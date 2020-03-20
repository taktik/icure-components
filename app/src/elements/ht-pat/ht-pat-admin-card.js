/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../dynamic-form/dynamic-form.js';

import './dialogs/medicalhouse/ht-pat-medicalhouse-timeline.js';
import '../../styles/scrollbar-style.js';
import '../../styles/notification-style.js';
import '../../styles/paper-tabs-style.js';
import '../../styles/shared-styles.js';
import '../../styles/dialog-style.js';
import './ht-pat-admin-team.js';

import moment from 'moment/src/moment';
import levenshtein from 'js-levenshtein';
import _ from 'lodash/lodash';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtPatAdminCard extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style include="iron-flex iron-flex-alignment"></style>
		<style include="scrollbar-style notification-style buttons-style paper-tabs-style shared-styles dialog-style">
			:host {
				height: 100%;
			}

			.container {
				width: 100%;
				height: 100%;
			}

            paper-tabs {
                flex-grow: 1;
            }

            .admin-top-bar {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: stretch;
                background: var(--app-background-color-dark);
            }

            .admin-top-bar .buttons{
                border-left: 1px solid var(--app-background-color-darker);
                border-bottom: 1px solid var(--app-background-color-darker);
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-around;
                align-items: center;
                width: auto;
                padding: 0 4px;
                position: inherit;
                box-sizing:border-box;
            }

            .admin-top-bar .buttons paper-icon-button{
                margin:0 8px;
            }

			paper-material.card {
				background-color: #fff;
				padding: 10px;
				margin-left: 5px;
				margin-right: 5px;
				margin-bottom: 10px;
			}

			paper-input {
				padding-left: 5px;
				padding-right: 5px;
			}

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
                --paper-input-container-label: {
                    color: var(--app-text-color);
                    opacity: 1;
                };
                --paper-input-container-underline-disabled: {
                    border-bottom: 1px solid var(--app-text-color);

                };
                --paper-input-container-color: var(--app-text-color);
            }

            paper-textarea {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

			paper-dropdown-menu {
				padding-left: 5px;
				padding-right: 5px;
			}

            iron-pages {
                padding: 32px 0 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                overflow-y: auto;
            }

            :host #institution-list {
                height: calc(100% - 140px);
                outline: none;
            }

            #institution-list{
                width: 98%;
                padding: 5px;
                height: calc(100% - 140px);
            }

            .grid-institution{
                width: 100%;
                padding: 5px;
                height: calc(100% - 20px);
            }

            vaadin-grid.material {
                box-shadow: var(--app-shadow-elevation-1);
                border: 0;
                font-family: Roboto, sans-serif;
                --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));
                margin: 0 0 32px 0;

                --vaadin-grid-cell: {
                    padding: 8px;
                };

                --vaadin-grid-header-cell: {
                    height: 64px;
                    color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                    font-size: 12px;
                };

                --vaadin-grid-body-cell: {
                    height: 48px;
                    color: rgba(0, 0, 0, var(--dark-primary-opacity));
                    font-size: 13px;
                };

                --vaadin-grid-body-row-hover-cell: {
                    background-color: var(--paper-grey-200);
                };

                --vaadin-grid-body-row-selected-cell: {
                    background-color: var(--paper-grey-100);
                };

                --vaadin-grid-focused-cell: {
                    box-shadow: none;
                    font-weight: bold;
                };
            }

            vaadin-grid.material .cell {
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 56px;
            }

            vaadin-grid.material .cell.last {
                padding-right: 24px;
            }

            vaadin-grid.material .cell.numeric {
                text-align: right;
            }

            vaadin-grid.material paper-checkbox {
                --primary-color: var(--paper-indigo-500);
                margin: 0 24px;
            }

            vaadin-grid.material vaadin-grid-sorter .cell {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            vaadin-grid.material vaadin-grid-sorter iron-icon {
                transform: scale(0.8);
            }

            vaadin-grid.material vaadin-grid-sorter:not([direction]) iron-icon {
                color: rgba(0, 0, 0, var(--dark-disabled-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction] {
                color: rgba(0, 0, 0, var(--dark-primary-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction=desc] iron-icon {
                transform: scale(0.8) rotate(180deg);
            }

            paper-dialog paper-input{
                padding: 0;
            }

            paper-dialog > div {
                margin-top: 0;
            }

            paper-dialog vaadin-grid.material{
                margin:24px 0 0;
            }


            .buttons paper-checkbox{
                align-self: center;
            }

            #dialogAddInstitution{
                height: 400px;
                width: 600px;
            }

            .formAddStay{
                width: 100%;
                border-collapse: collapse;
            }

            .full-width{
                width: 100%;
            }

            .administrative-panel {
                height: calc(100% - 48px);
                background: var(--app-background-color);
                margin: 0;
            }

            .add-btn-stay-container{
                display:table;
                margin: auto;
            }

            .btn{
                --paper-button-ink-color: var(--app-secondary-color-dark);
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                font-weight: 700;
                font-size: 12px;
                height: 40px;
                min-width: 100px;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                padding: 10px 1.2em;
            }

            #institutionComment{
                height: 140px;
            }

            #add-person-to-care-team{
                min-height: 554px;
                max-height: 50%;
                min-width: 800px;
                max-width: 60%;
            }

            #add-new-person-to-care-team{
                height: 520px;
                width: 500px;
            }

            #internal-care-team-list, #external-care-team-list, #dmg-owner-list{
                max-height: 50%;
                height: auto;
            }

            #showHcpInfo {
                min-height: 520px;
                max-height: 50%;
                min-width: 500px;
                max-width: 60%;
                height: 400px;
            }

            .iconHcpInfo{
                height: 18px;
            }

            .indent{
                margin-bottom: 12px;
            }

            .indent paper-input{
                margin: 0 24px;
            }

            .titleHcpInfo{
                height: 48px;
                width: calc(100% - 48px);
                color: var(--app-light-color);
                background-color: var(--app-secondary-color);
                padding: 0 24px;
                font-weight: bold;
                display:flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
            }


            .titleHcpInfo_Icon{
                height: 24px;
                width: 24px;
            }

            .titleHcpInfo_Txt{
                padding-left: 8px;
            }

            .label{
                font-weight: bold;
            }

            .hcpAdr{
                margin-bottom: 10px;
            }

            .button_add_provider{
                width:75%;
                position: fixed;
                bottom: 16px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .add-btn{
                --paper-button-ink-color: var(--app-secondary-color-dark);
                background:var(--app-secondary-color);
                color:var(--app-text-color);
                font-weight:bold;
                font-size:12px;
                height:40px;
                min-width:100px;
                @apply --shadow-elevation-2dp;
                padding: 10px 1.2em;
            }

            paper-card {
                width: 100%;
                margin-bottom: 32px;
                padding: 16px;
            }

            .not-form-page {
                padding: 32px
            }

            iron-icon.smaller {
                padding-right: 8px;
                width: 16px;
                height: 16px;
            }

            .subtitle{
                display:block;
				@apply --paper-font-body2;
				padding-bottom: 8px;
                margin: 0;
            }

            .modal-title{
                justify-content: flex-start;
            }

            .iron-container {
                padding: 0;
            }

            .save, .print-vignette {
                background: var(--app-secondary-color);
                border-radius: 50%;
                margin: 7px 4px;
                padding: 4px;
                cursor: pointer;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                transition: .25s ease;
                width: 24px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                background: var(--app-primary-color);
            }
            .save {
                margin-right: 36px;
                margin-left: 16px;
            }
            .save iron-icon,
            .print-vignette iron-icon {
                width: 20px;
                margin-top: -3px;
                color: white;
            }
            .save:hover,
            .print-vignette:hover {
                transform: scale(1.05);
            }
            .save:active,
            .print-vignette:active {
                background: var(--app-background-color-dark);
                box-shadow: none;
                transform: scale(.9);
            }

            vaadin-combo-box {
                width:calc(100% - 50px);
                padding-left: 25px;
            }

            #noSave.notification-container{
                height: 358px;
                grid-template-columns: 48px 1fr 132px;
            }

            #noSave.notification-container.notification {
                animation: notificationAnim .5s ease-in;
            }
            .notification-grid{
                grid-column-start: 1;
                grid-column-end: span 3;
                grid-row-start: 3;
                grid-row-end: span 2;
                margin: 0;
                height: 300px;
            }

            .patient-photo {
                background: rgba(0, 0, 0, 0.1);
                height: 26px;
                width: 26px;
                min-width: 26px;
                border-radius: 50%;
                margin-right: 8px;
                overflow: hidden !important;
                padding-right: 0 !important;
            }

            .patient-photo img {
                width: 100%;
                margin: 50%;
                transform: translate(-50%, -50%);
            }

            #ssin-patients-list.material .cell {
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 0;
            }

            .dataTable {
                font-size: var(--font-size-normal);
                border-collapse: collapse;
                border-spacing: 0;
                box-sizing: border-box;
                text-align: left;
                margin-left: auto;
                margin-right: auto;
            }

            .dataTable td,
            .dataTable th {
                padding: .50em;
                vertical-align: middle;
                border: 1px solid #eee;
            }

            .dataTable .empty {
                border-top: 0px;
                border-left: 0px;
            }

            .dataTable .warning {
                color: var(--app-error-color);
            }

            .dataTable .header {
                background: var(--app-background-color-light);
                color: var(--app-text-color-dark);
                font-weight: 500;
            }

            .modal-title iron-icon {
                margin-right: 8px;
            }
        </style>
        <div class="administrative-panel">
            <paper-item id="noSave" class="notification-container">
                <iron-icon class="notification-icn" icon="icons:warning"></iron-icon>
                <div class="notification-msg">
                    <h4>[[localize('niss-already-used','No Saved',language)]]</h4>
                    <p>[[localize('choose_who_keep_ssin','Sélectionner le patient qui gardera le NISS',language)]]</p>
                </div>
                <paper-button on-tap="upgradePatientWithSsin" class="notification-btn"><iron-icon icon="check"></iron-icon>[[localize("this_pat_upg","Ce patient",language)]]</paper-button>
                <paper-button on-tap="deleteSsin" class="notification-btn"><iron-icon icon="cancel"></iron-icon>[[localize('remove_ssin_this_patient','Annuler',language)]]</paper-button>

                <vaadin-grid id="ssin-patients-list" class="notification-grid" items="[[ssinPatientsList]]" on-tap="upgradePatientWithSsin" active-item="{{activeItem}}">
                    <vaadin-grid-column flex-grow="0" width="25%">
                        <template class="header">
                            <div class="cell frozen">[[localize('pic','Picture',language)]]</div>
                        </template>
                        <template>
                            <div class="cell frozen patient-photo"><img src\$="[[picture(item.patient)]]"></div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <vaadin-grid-sorter path="patient.lastName">[[localize('nam','name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.patient.lastName]] [[item.patient.firstName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="20%">
                        <template class="header">
                            <vaadin-grid-sorter path="contatcsLength">[[localize('con','Contacts',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.contactsLength]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="55px">
                        <template class="header">
                            [[localize('fuz','Fusion',language)]]
                        </template>
                        <template>
                            <div class="cell frozen"><paper-icon-button on-tap="openFusionDialog" icon="vaadin:users" entry="[[item.patient.id]]" class="button--icon-btn"></paper-icon-button></div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </paper-item>

            <div class="admin-top-bar">
                <paper-tabs selected="{{tabs}}">
                    <paper-tab class="adm-tab"><iron-icon class="smaller" icon="vaadin:clipboard-text"></iron-icon>[[localize('adm_form','Administrative form',language)]]</paper-tab>
                    <paper-tab class="adm-tab"><iron-icon class="smaller" icon="vaadin:family"></iron-icon>[[localize('adm_ctc_per','Contact persons',language)]]</paper-tab>
                    <paper-tab class="adm-tab"><iron-icon class="smaller" icon="vaadin:doctor"></iron-icon>[[localize('adm_h_t','Care team',language)]]</paper-tab>
                    <paper-tab class="adm-tab"><iron-icon class="smaller" icon="vaadin:edit"></iron-icon>[[localize('adm_post_it','Post-it',language)]]</paper-tab>
                    <paper-tab class="adm-tab"><iron-icon class="smaller" icon="timeline"></iron-icon>[[localize('mh_timeline','Timeline',language)]]</paper-tab>
                </paper-tabs>
                <div class="buttons">
                    <paper-icon-button class="button--icon-btn" id="print-vignette" icon="av:recent-actors" on-tap="printMutualVignette"></paper-icon-button>
                    <paper-tooltip for="print-vignette" position="left">[[localize('print_mutual_vignette','Print mutual vignette',language)]]</paper-tooltip>

                    <paper-icon-button class="button--icon-btn" id="print-vignette-grid" icon="av:library-books" on-tap="printMutualVignetteGrid"></paper-icon-button>
                    <paper-tooltip for="print-vignette-grid" position="left">[[localize('print_mutual_vignette_grid','Print mutual vignette grid',language)]]</paper-tooltip>
                    <template is="dom-if" if="[[onElectron]]">
                        <paper-icon-button class="button--icon-btn" id="fill-with-card" icon="vaadin:health-card" on-tap="fillWithCard"></paper-icon-button>
                        <paper-tooltip for="fill-with-card" position="left">[[localize('fill_with_eid','Fill with eid',language)]]</paper-tooltip>
                    </template>
                    <paper-icon-button class="button--icon-btn" id="save-btn" icon="save" on-tap="forceSaveAdmin"></paper-icon-button>
                    <paper-tooltip for="save-btn" position="left">[[localize('save','Save',language)]]</paper-tooltip>
                </div>
            </div>


            <iron-pages class="iron-container" selected="[[tabs]]">
                <page><!--Administrative form-->
                    <div class="page-container">
                        <div class="form-container">
                        <dynamic-form id="dynamic-form-administrative" class="page-content printable" api="[[api]]" user="[[user]]" template="[[patientForm]]" data-map="[[patientMap]]" data-provider="[[dataProvider]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" no-print="">
                        </dynamic-form>
                        </div>
                    </div>
                </page>
                <page><!--Contact persons-->
                    <div class="page-container">
                        <vaadin-combo-box id="researchFuturPartnerShip" filtered-items="[[listPatient]]" on-filter-changed="researchPat" filter="{{filterPartner}}" label="[[localize('add-patient','Lier un patient déjà existant',language)]]" item-label-path="prettyName" item-value-path="id" on-value-changed="searchPatient" value="{{valuePartner}}"></vaadin-combo-box>
                        <dynamic-form id="dynamic-form-partnerships" class="page-content" api="[[api]]" user="[[user]]" template="[[partnershipsContainerForm]]" data-map="[[patientMap]]" data-provider="[[dataProvider]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" no-print=""></dynamic-form>
                    </div>
                </page>
                <page><!--Care team-->
                    <div class="page-container">
                        <div class="not-form-page">
                            <ht-pat-admin-team api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" resources="[[resources]]" active-health-elements="[[activeHealthElements]]" inactive-health-elements="[[inactiveHealthElements]]"></ht-pat-admin-team>
                        </div>
                    </div>
                </page>
                <page><!--Post-it-->
                    <div class="page-container">
                        <div class="not-form-page">
                            <h4 class="subtitle">[[localize('adm_post_it_adm','Post-it administratif',language)]]</h4>
                            <paper-card>
                                <paper-textarea no-label-float="" value="{{administrativePostit}}"></paper-textarea>
                            </paper-card>

                            <h4 class="subtitle">[[localize('adm_post_it_adm','Post-it médical',language)]]</h4>
                            <paper-card>
                                <paper-textarea no-label-float="" value="{{medicalPostit}}"></paper-textarea>
                            </paper-card>
                        </div>
                    </div>
                </page>
                <page><!--Timeline-->
                    <div class="page-container">
                        <ht-pat-medicalhouse-timeline id="timeline" class="page-content printable" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" no-print="">
                    </ht-pat-medicalhouse-timeline></div>
                </page>
            </iron-pages>
        </div>

        <paper-dialog id="warning-message-box" class="modalDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="" always-on-top="">
            <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon>[[localize('warning','Warning',language)]]</h2>
            <div class="content textaligncenter pt20 pb70 pl20 pr20">
                <h3>[[localize('warning-elect-pat-ssin-empty', 'The ID card data will override the patient\\'s', language)]]</h3>
                <table class="dataTable">
                    <thead>
                        <tr>
                            <th class="empty"></th>
                            <th class="header">[[localize('eid_card','eID card',language)]]</th>
                            <th class="header">[[localize('pati','Patien',language)]]</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="header">[[localize('fir_nam', 'First name', language)]]</td>
                            <td>[[warningData.card.firstName]]</td>
                            <td>[[warningData.patient.firstName]]</td>
                        </tr>
                        <tr>
                            <td class="header">[[localize('las_nam', 'Last name', language)]]</td>
                            <td>[[warningData.card.lastName]]</td>
                            <td>[[warningData.patient.lastName]]</td>
                        </tr>
                        <tr>
                            <td class="header">[[localize('birthDate', 'Birth date', language)]]</td>
                            <td>[[warningData.card.dateOfBirth]]</td>
                            <td>[[warningData.patient.dateOfBirth]]</td>
                        </tr>
                        <tr>
                            <td class="header">[[localize('ssin', 'SSIN', language)]]</td>
                            <td>[[warningData.card.niss]]</td>
                            <td class="warning">[[localize('missing', 'Missing', language)]]</td>
                        </tr>
                    </tbody>
                </table>
                <h3>[[localize('areYouSure', 'Are you sure', language)]]</h3>
            </div>
            <div class="buttons">
                <paper-button class="button button--other" role="button" dialog-dismiss=""><iron-icon icon="icons:close"></iron-icon>[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" role="button" dialog-confirm="" on-tap="doFillWithCard"><iron-icon icon="icons:check"></iron-icon>[[localize('confirm','Confirm',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-admin-card';
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          patientForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientAdministrativeForm.json');
              }
          },
          addressForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientAddressForm.json');
              }
          },
          medicalHouseContractsForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientMedicalHouseContractsForm.json');
              }
          },
          telecomForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientTelecomForm.json');
              }
          },
          insuranceForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientInsuranceForm.json');
              }
          },
          partnershipsForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientPartnershipsForm.json');
              }
          },
          partnershipsContainerForm: {
              type: Object,
              value: function () {
                  return require('./rsrc/PatientPartnershipsContainerForm.json');
              }
          },
          user: {
              type: Object
          },
          patient: {
              type: Object,
              notify: true
          },
          warningData: {
              type: Object,
              value: {
                  patient: {
                      firstName: '',
                      lastName: '',
                      dateOfBirth: ''
                  },
                  card: {
                      firstName: '',
                      lastName: '',
                      dateOfBirth: '',
                      niss: ''
                  }
              }
          },
          patientMap: {
              type: Object
          },
          dataProvider: {
              type: Object,
              value: null
          },
          administrativePostit: {
              type: String
          },
          medicalPostit: {
              type: String
          },
          newHcpCareTeam: {
              type: Object,
              value: {
                  'LastName': '',
                  'FirstName': '',
                  'Nihii': '',
                  'Speciality': '',
                  'Email': '',
                  'Niss': '',
                  'Invite': false
              }
          },

          currentInternalCareTeam: {
              type: Array,
              value: [],
              notify: true
          },

          currentExternalCareTeam: {
              type: Array,
              value: [],
              notify: true
          },

          currentExternalPatientCareTeam: {
              type: Array,
              value: [],
              notify: true
          },

          currentDMGOwner: {
              type: Array,
              value: [],
              notify: true
          },

          currentHcp: {
              type: Array,
              value: []
          },
          selectedCareProvider: {
              type: Object
          },
          selectedPerson: {
              type: Object
          },
          hcpSelectedForTeam: {
              type: Object,
              notify: true,
              value: () => []
          },
          invitedHcpLink: {
              type: String,
              value: ""
          },
          tabs: {
              type: Number,
              value: 0
          },
          tabIndex: {
              type: Number,
              value: 0,
              observer: '_tabIndexChanged'
          },
          cardData: {
              type: Object,
              value: {}
          },
          listPatient:{
              type: Array,
              value: ()=> []
          },
          filterPartner:{
              type: String,
              value:''
          },
          valuePartner:{
              type:String,
              value:""
          },
          listValidSsin:{
              type: Object,
              value:{}
          },
          ssinPatientsList:{
              type: Array,
              value: []
          },
          activeItem:{
              type:Object,
              value:{}
          },
          ssinSavePrimaryPatient: {
              type: Object,
              value: {}
          },
          linkNoSaveLanguage:{
              type: String,
              value: 'niss-already-used'
          },
          flatrateMsg: {
              type:String,
              value: null
          },
          activeHealthElements:{
              type: Array,
              value: () => []
          },
          inactiveHealthElements:{
              type: Array,
              value:() => []
          },
          onElectron:{
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return ['patientChanged(api,user,patient)',
          'partnershipsChanged(patient.partnerships.*)',
          'medicalPostitChanged(medicalPostit)',
          'administrativePostitChanged(administrativePostit)'];
  }

  constructor() {
      super();
  }

  detached() {
      this.flushSave();
  }

  ready() {
      super.ready();
      this.api && this.api.isElectronAvailable().then(electron => this.set('onElectron',electron))
  }

  printMutualVignette() {
      const insur = ((this.patient || {}).insurabilities || []).find(a => !a.endDate && a.insuranceId && a.insuranceId !== "") || null
      if (insur) {
          this.api.insurance().getInsurance(insur.insuranceId).then(ins=>{
              const home = this.patient.addresses.find(a=>a.addressType === "home") || null
              const mutName = this.localizeContent(ins.name)
              const mutCode = this.localizeContent(ins.code)
              const patName = _.get(this,"patient.lastName","")+" "+_.get(this,"patient.firstName","")+" "+this.api.moment(_.trim(_.get(this,"patient.dateOfBirth",0))).format('DD/MM/YYYY')
              const oa = mutCode && insur.parameters && insur.parameters.tc1 && insur.parameters.tc2 && mutName && mutName.length ? mutCode+" "+insur.parameters.tc1+"-"+insur.parameters.tc2 : "no OA"
              const ssin = this.patient.ssin
              const addr = home ? home.street+" "+home.houseNumber+((home.postboxNumber && home.postboxNumber.length) ? (!home.postboxNumber.startsWith('/')?"/":"")+home.postboxNumber:"") : "no Addr"
              const cp = home ? home.postalCode+" "+home.city : "no CP"
              const vignetteBody =`<html><head>
                  <style>
                      * {margin:0;padding:0;font-size:8pt; font-family:Arial}
                      /*div.sticker {transform:rotate(-90deg);transform-origin:bottom;}*/
                      td { padding: 11pt; }
                      p.patName {font-size:10pt;font-weight:bold;}
                      p, pre {overflow: hidden; text-overflow: ellipsis; white-space: nowrap;} /* inverted size for rotation */
                  </style></head>
                  <body>
                      <div class="sticker">
                          <p class="patName">${patName}</p>
                          <pre class="oa"><b>OA${oa}</b> ${mutName}</pre>
                          <pre class="ssin">   ${ssin}</pre>
                          <pre class="addr">   ${addr}</pre>
                          <pre class="cp">   ${cp}</pre>
                      </div>
                  </body></html>`
              this.api.pdfReport(vignetteBody,{
                  type : "sticker-mut",
                  paperWidth: 90,
                  paperHeight: 29,
                  marginLeft: 0,marginRight: 0,marginTop: 0,marginBottom: 0
              }).then(({pdf:data, printed:printed}) =>{
                  if (!printed) {
                      let blob = new Blob([data],{type :'application/pdf'});

                      let url = window.URL.createObjectURL(blob)

                      let a = document.createElement("a");
                      document.body.appendChild(a);
                      a.style = "display: none";

                      a.href = url;
                      a.download = this.patient.firstName+"-"+this.patient.lastName+"-"+moment()+".pdf";
                      a.click();
                      window.URL.revokeObjectURL(url);
                  }
              }).catch(e=>{console.log('Print error ',e)})
          }).catch(e=>{console.log('cannot resolve insurance',e)})
      } else {console.log('cannot find insurance')}
  }

  printMutualVignetteGrid() {
      const rowCount = 10
      const columnCount = 3
      const insur = ((this.patient || {}).insurabilities || []).find(a => !a.endDate && a.insuranceId && a.insuranceId !== "") || null
      if (insur) {
          this.api.insurance().getInsurance(insur.insuranceId).then(ins=>{
              const home = this.patient.addresses.find(a=>a.addressType === "home") || null
              const mutName = this.localizeContent(ins.name)
              const mutCode = this.localizeContent(ins.code)
              const patName = _.get(this,"patient.lastName","")+" "+_.get(this,"patient.firstName","")+" "+this.api.moment(_.trim(_.get(this,"patient.dateOfBirth",0))).format('DD/MM/YYYY')
              const oa = mutCode && insur.parameters && insur.parameters.tc1 && insur.parameters.tc2 && mutName && mutName.length ? mutCode+" "+insur.parameters.tc1+"-"+insur.parameters.tc2 : "no OA"
              const ssin = this.patient.ssin
              const addr = home ? home.street+" "+home.houseNumber+((home.postboxNumber && home.postboxNumber.length) ? (!home.postboxNumber.startsWith('/')?"/":"")+home.postboxNumber:"") : "no Addr"
              const cp = home ? home.postalCode+" "+home.city : "no CP"
              const vignetteCard = `
                      <div class="sticker">
                          <p class="patName">${patName}</p>
                          <pre class="oa"><b>OA${oa}</b> ${mutName}</pre>
                          <pre class="ssin">   ${ssin}</pre>
                          <pre class="addr">   ${addr}</pre>
                          <pre class="cp">   ${cp}</pre>
                      </div>
              `
              const cells = _.times(columnCount, cellidx => {
                  return `<td>${vignetteCard}</td>`
              }).join("\n")
              const rows = _.times(rowCount, rowidx=> {
                  return `<tr>${cells}</tr>`
              }).join("\n")
              const vignetteBody =`<html><head>
                  <style>
                      * {margin:0;padding:0;font-size:8pt; font-family:Arial}
                      /*div.sticker {transform:rotate(-90deg);transform-origin:bottom;}*/
                      td { padding: 2pt; }

                      table { width: 100%; table-layout: fixed ;}
                      tr { width: ${(100/columnCount).toFixed(2)}%}
                      p.patName {font-size:10pt;font-weight:bold;}
                      p, pre {overflow: hidden; text-overflow: ellipsis; white-space: nowrap;} /* inverted size for rotation */
                  </style></head>
                  <body>
                      <table>
                          ${rows}
                      </table>
                  </body></html>`
              console.log("vignetteBody", vignetteBody)
              this.api.pdfReport(vignetteBody,{
                  type : "sticker-mut-a4",
                  paperWidth: 210,
                  paperHeight: 297,
                  marginLeft: 5,marginRight: 5,marginTop: 15,marginBottom: 0
              }).then(({pdf:data, printed:printed}) =>{
                  if (!printed) {
                      let blob = new Blob([data],{type :'application/pdf'});

                      let url = window.URL.createObjectURL(blob)

                      let a = document.createElement("a");
                      document.body.appendChild(a);
                      a.style = "display: none";

                      a.href = url;
                      a.download = this.patient.firstName+"-"+this.patient.lastName+"-"+moment()+".pdf";
                      a.click();
                      window.URL.revokeObjectURL(url);
                  }
              }).catch(e=>{console.log('Print error ',e)})
          }).catch(e=>{console.log('cannot resolve insurance',e)})
      } else {console.log('cannot find insurance')}
  }

  medicalPostitChanged(medical) {
      if (this.patient && this.patient.note !== medical) {
          this.patient.note = medical
          this.scheduleSave(this.patient)
      }
  }

  administrativePostitChanged(administrative) {
      if (this.patient && this.patient.administrativeNote !== administrative) {
          this.patient.administrativeNote = administrative
          this.scheduleSave(this.patient)
      }
  }

  patientChanged() {
      if (!this.api || !this.user) { return }

      this.set('dataProvider', this.patientDataProvider({}, '', '', null, []));
      this.set('patientMap', {});
      this.set("listValidSsin",{})

      if(this.$["noSave"].classList.contains("notification"))this.$["noSave"].classList.remove("notification")


      if (this.patient) {

          this.set('administrativePostit', this.patient.administrativeNote || "")
          this.set('medicalPostit', this.patient.note || '')
          this.listValidSsin[this.patient.id]=this.patient.ssin

          this.api.getRegistry('patient').listeners['ht-pat-admin'] = {target: this, pool: [this.patient.id], callbacks: [this.partnershipsChanged.bind(this)]}

          this.initCurrentCareTeam();

          this.api.code().getCodes((this.patient.languages || []).map(l=>'ISO-639-1|'+l+'|1').join(',') || "ISO-639-1|en|1").then( codes => {
              if (this.patient.partnerships && this.patient.partnerships.length) {
                  ;(this.patient.partnerships.length ? this.api.patient().getPatientsWithUser(this.user,{ids:this.patient.partnerships.map(ps => ps.partnerId)}) : Promise.resolve([]))
                      .then(ppss => ppss.map(p => this.api.register(p, 'patient')))
                      .then(ppss =>
                      this.set('patient.partnerships',this.patient.partnerships.map(pp => {
                          return Object.assign({}, pp, { partnerInfo: ppss.find(ps => ps.id === pp.partnerId)} || {})
                      }).filter(p => !_.isEmpty(p.partnerInfo)))
                  ).finally(() => {
                      this.patient.partnerships.map(pat=>{
                          this.listValidSsin[pat.partnerId]=pat.partnerInfo.ssin
                      })

                      this.set("dataProvider",this.patientDataProvider(this.patient, '', '', this.patient && this.patient.id, codes));
                      this.set('patientMap', _.cloneDeep(this.patient));

                      if (!this.root.activeElement || !this.$[this.root.activeElement.id]) {
                          this.$['dynamic-form-administrative'].loadDataMap();
                      } else {
                          this.$[this.root.activeElement.id].loadDataMap();
                      }
                  })
              } else {
                  this.set("dataProvider",this.patientDataProvider(this.patient, '', '', this.patient && this.patient.id, codes));
                  this.set('patientMap', _.cloneDeep(this.patient));

                  if (!this.root.activeElement || !this.$[this.root.activeElement.id]) {
                      this.$['dynamic-form-administrative'].loadDataMap();
                  } else {
                      this.$[this.root.activeElement.id].loadDataMap();
                  }
              }
          })
      }
  }

  partnershipsChanged() {
      if(this.patient){
          const tbc = this.patient.partnerships.filter(p=>p.partnerId && !p.partnerInfo)
          if (tbc.length) {
              this.api.patient().getPatientsWithUser(this.user,{ids:tbc.map(ps => ps.partnerId)})
                  .then(ppss => ppss.map(p => this.api.register(p, 'patient')))
                  .then(ppss => ppss.forEach(pps => {
                      const idx = _.findIndex(this.patient.partnerships, pp => pps.id === pp.partnerId)
                      if(!this.patient.partnerships[idx].partnerInfo)
                          this.set(`patient.partnerships.${idx}.partnerInfo`, pps)
                  }))
                  .finally(()=>{
                      this.patient.partnerships.filter(partner=> partner.partnerId && !Object.keys(partner).find(key=>key==="partnerInfo")).forEach(partner=>{
                          if(!partner.partnerInfo)partner.partnerInfo={}
                      })
                  })
          }
      }
  }

  scheduleSave(patient) {
      if (!patient) { return }
      const rev = patient.rev

      if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);
          this.saveTimeout = undefined
      }

      this.saveAction = () => {

          this.api.queue(patient, 'patient').then(([pat, defer]) => {
              if (!pat || pat.rev !== rev) { defer.resolve(patient); return }

              (!!_.size(_.get(patient,"partnerships", [])) ?
                  Promise.all(patient.partnerships.map((partner, index) => {
                      if(!partner.partnerInfo || (!partner.partnerInfo.lastName && !partner.partnerInfo.name))
                          return Promise.resolve({})

                      if (!partner.partnerId || !partner.partnerInfo.rev) {
                          //patient not present
                          partner.partnerInfo.active = false
                          partner.partnerInfo.id = partner.partnerId
                          partner.partnerInfo.ssin = _.get(this,["listValidSsin",partner.partnerId],partner.partnerInfo.ssin || "")

                          return this.api.patient().newInstance(this.user, partner.partnerInfo)
                              .then(np => {
                                  return this.api.patient().createPatientWithUser(this.user, np).then(np => this.api.register(np, 'patient')).then(np => {
                                      this.set('patient.partnerships.' + index,{partnerId: np.id, partnerInfo: np})
                                  })
                              })
                              .catch(e => {console.log("Cannot save "+e.message); return null})

                      } else {
                          //patient present
                          partner.partnerInfo.ssin = _.get(this,["listValidSsin",partner.partnerId],partner.partnerInfo.ssin || "")

                          return this.api.patient().modifyPatientWithUser(this.user, partner.partnerInfo)
                              .then(p => {
                                  this.api.register(p, 'patient')
                              })
                              .catch(e => {console.log("Cannot save "+e.message,partner.partnerInfo); return null})
                      }
                  }))
              : Promise.resolve([]))
                  .finally(() => {
                      patient.ssin = _.get(this,["listValidSsin",patient.id],patient.ssin || "");

                      const timeline = this.$.timeline;
                      timeline.checkFlatrateData(patient, Number(moment().format('YYYYMM'))).then(res => {
                          if(res && res.flatrateStatus && res.flatrateStatus.errors.length > 0){
                              this.set("flatrateMsg", res.flatrateStatus.errors.join());
                              console.log("flatrateMsg", this.flatrateMsg);
                          }
                      });

                      this.api.patient().modifyPatientWithUser(this.user, patient)
                          .catch(() => defer.resolve(patient))
                          .then(p => this.api.register(p, 'patient', defer))
                          .then(p => this.dispatchEvent(new CustomEvent("patient-saved", {
                              detail: p,
                              bubbles: true,
                              composed: true
                          })))
                          .catch(e => {
                              if (this.patient) {
                                  return this.api.patient().getPatientWithUser(this.user, this.patient.id).then(p => this.api.register(p, 'patient')).then(p => {
                                      this.patient = p
                                      this.saveTimeout = undefined
                                      this.saveAction = undefined
                                      throw e
                                  })
                              } else {
                                  throw e
                              }
                          })
                  })
          })
      }

      this.saveTimeout = setTimeout(this.saveAction, 5000);
  }

  postitChanged(value) {
      const trimmedValue = value && value.trim()
      if(trimmedValue && trimmedValue.length) {
          this.$["flatrate-notification"].classList.add('notification')
          setTimeout(() => {
              this.closePostit()
          }, 60000);
      }else {
          this.closePostit()
      }
  }

  closePostit() {
      this.$["flatrate-notification"].classList.remove('notification')
  }


  flushSave() {
      if (this.saveTimeout) {
          clearTimeout(this.saveTimeout)
          this.saveTimeout = undefined
          return this.saveAction()
      }
  }

  forceSaveAdmin() {
      this.saveAction()
  }

  patientDataProvider(oroot, subPath, rootPath, id, codes) {
      const root = () => subPath && subPath.length ? _.get(oroot, subPath) : oroot;
      const getValue = function (key) {
          return root() ? _.get(root(), key) : null;
      };
      let subForms = {};
      const setValue = (key, value) => {
          if(!this.patient || !this.patientMap || this.patientMap.id!==this.patient.id)return;
          let resolvedRoot = root();

          if (resolvedRoot && !_.isEqual( _.get(resolvedRoot, key) , value)) {
              this.set("patient."+(rootPath.length ? (rootPath+".") : "")+key,value)

              if(key.includes("ssin") && (!value || this.api.patient().isValidSsin(value))){
                  if(value && this.$["noSave"].classList.contains("notification")){
                      this.deleteSsin();
                  }
                  if(value){
                      return this.api.patient().findByNameBirthSsinAutoWithUser(this.user, this.user.healthcarePartyId, value, null, null, 100, "asc").then(patients =>{
                          if(value && patients.rows.length){
                              const news = Object.keys(this.listValidSsin).filter(id=>this.listValidSsin[id]===value).map(id=>this.patient.id===id ? this.patient : this.patient.partnerships.find(partner=>partner.partnerId===id).partnerInfo)
                              return Promise.all(_.uniqBy(_.concat(patients.rows,news),"id").filter(p=>!!p.ssin && p.ssin === value && (key === "ssin" ? this.patient.id : resolvedRoot.partnerId)!==p.id).map(pat =>{
                                  return this.api.contact().findBy(this.user.healthcarePartyId,pat).then(ctcs =>{ return {patient : pat,contactsLength: ctcs.length || 0}})
                              })).then(patsAndCtcs=>{
                                  this.set("ssinPatientsList", patsAndCtcs)
                                  if(this.ssinPatientsList.length){
                                      this.set("activeItem",{})
                                      this.set("ssinSavePrimaryPatient",(key === "ssin" ? this.patient : resolvedRoot.partnerInfo))
                                      this.$["noSave"].classList.add("notification")
                                  }
                                  else{
                                      this.listValidSsin[key==="ssin" ? this.patient.id : resolvedRoot.partnerId]=value;
                                      this.scheduleSave(this.patient);
                                  }
                              })
                          }
                          else{
                              this.listValidSsin[key==="ssin" ? this.patient.id : resolvedRoot.partnerId]=value;
                              this.scheduleSave(this.patient);
                          }
                      })
                  }else{
                      this.listValidSsin[key==="ssin" ? this.patient.id : resolvedRoot.partnerId]=value;
                      this.scheduleSave(this.patient);
                  }
              }
              else{
                  this.scheduleSave(this.patient);
              }

              return Promise.resolve({});
          }
      };
      return {
          getStringValue: getValue,
          getNumberValue: getValue,
          getMeasureValue: getValue,
          getDateValue: getValue,
          getBooleanValue: key => root() ? _.get(root(), key) && _.get(root(), key) !== 'false' : null,
          setStringValue: setValue,
          setNumberValue: setValue,
          setMeasureValue: setValue,
          setDateValue: setValue,
          setBooleanValue: setValue,
          getValueContainers: (key) => {
              return (getValue(key) || []).map((l,idx)=>{
                  const code = codes && codes.length && codes.find(c => c.code === l)
                  return {
                      id:this.api.crypto().randomUuid(),
                      index:idx,
                      content:(code && code.label && _.fromPairs(_.toPairs(code.label).map(([k,v]) => [k, {stringValue: v}]))) || _.fromPairs([[this.language,{stringValue:l}]]),
                      codes: code ? [code] : []
                  }
              })
          },
          setValueContainers: (key, value) => setValue(key, value.map(s=> (s.codes && s.codes[0] || {}).code || (this.api.contact().preferredContent(s,this.language) || {}).stringValue)),
          getSubForms: key => {
              return _.get(subForms,key , subForms[key]=(_.get(root(),key) || []).map((a, idx) => {
                  return {
                      dataMap: a,
                      dataProvider: this.patientDataProvider(oroot, (subPath && subPath.length ? subPath + '.' : '') + key + '[' + idx + ']', (rootPath.length ? rootPath + '.' : '') + key + '.' + idx, key === 'partnerships' ? a.partnerId || (a.partnerId = this.api.crypto().randomUuid()) : a.id || (a.id = this.api.crypto().randomUuid())),
                      template:
                          key === 'telecoms' ?
                              this.telecomForm :
                              (key === 'addresses' || key === 'partnerInfo.addresses') ?
                                  this.addressForm :
                                  key === 'partnerships' ?
                                      this.partnershipsForm :
                                      key === 'medicalHouseContracts' ?
                                          this.medicalHouseContractsForm :
                                          this.insuranceForm
                  };
              }))
          },
          getId: () => id,
          deleteSubForm: (key, id, index) => {
              this.flushSave();
              _.pullAt( _.get(root(),key), [index] );
              this.$[this.root.activeElement.id].notify((rootPath.length ? rootPath + '.' : '') + key + '.*');
              this.scheduleSave(this.patient);
          },
          addSubForm: (key, guid) => {
              this.flushSave(); //Important
              if(key.includes("partnerInfo.addresses") && (!root().partnerInfo || (!root().partnerInfo.lastName && !root().partnerInfo.name)))return;
              (_.get(root(), key) || _.get(_.set(root(), key, []), key)).push(key==='partnerships'?{partnerId: this.api.crypto().randomUuid(), partnerInfo:{}, type:""}:{});

              this.$[this.root.activeElement.id==="researchFuturPartnerShip"? "dynamic-form-partnerships" : this.root.activeElement.id].notify((rootPath.length ? rootPath + '.' : '') + key + '.*');
              this.scheduleSave(this.patient);
          },
          filter: (data, text, uuid, id) => {
              if (data.source === 'insurances') {
                  return (text || '').length >= 2 ?
                      (text.match(/^[0-9]+$/) ? this.api.insurance().listInsurancesByCode(text) : this.api.insurance().listInsurancesByName(text))
                          .then(res => res.map(i => ({
                              'codeId': i.id,
                              'id': i.id,
                              'name': i.code + " - " + this.localizeContent(i.name, this.language)
                          }))) : id ? this.api.insurance().getInsurance(id)
                          .then(i => ({
                              'codeId': i.id,
                              'id': i.id,
                              'name': i.code + " - " + this.localizeContent(i.name, this.language)
                          })) : Promise.resolve([]);
              } else if (data.source === 'users') {
                  const s = text && text.toLowerCase()
                  return Promise.resolve(s ? Object.values(this.api.users).filter(u => (u.login && u.login.toLowerCase().includes(s.toLowerCase())) ||
                      (u.name && u.name.toLowerCase().includes(s.toLowerCase())) || (u.email && u.email.toLowerCase().includes(s.toLowerCase())))
                      .map(u => ({id: u.id, name: u.name || u.login || u.email})) : [])
              } else if (data.source === "codes" && data.types.length && (id || (text && text.length > 1))) {
                  return id ?
                      Promise.all(data.types.map(ct => this.api.code().getCodeWithParts(ct.type, id, '1')))
                          .then(x => _.compact(x)[0])
                          .then(c => {
                              const typeLng = this.api.code().languageForType(c.type, this.language)
                              return {id: c.code, name: c.label[typeLng]}
                          }) :
                      Promise.all(data.types.map(ct => {
                          const typeLng = this.api.code().languageForType(ct.type, this.language)
                          const words = text.toLowerCase().split(/\s+/)
                          const sorter = x => [x.name && x.name.toLowerCase().startsWith(words[0]) ? 0 : 1, x.name]

                          return this.api.code().findPaginatedCodesByLabel('be', ct.type, typeLng, words[0], null, null, 200).then(results => _.sortBy(results.rows.filter(c => c.label[typeLng] && words.every(w => c.label[typeLng].toLowerCase().includes(w))).map(code => ({
                              id: code.code, name: code.label[typeLng], stringValue: code.label[typeLng], codes: [code]
                          })), sorter))
                      })).then(responses => _.flatMap(responses))
              } else if (data.source === "mh") {
                  return (id||'').length >= 1 ?
                      this.api.hcparty().getHealthcareParty( id ).then(results => { return { 'id': results.id, 'name':_.upperFirst(_.lowerCase(results.name)) + ' ' +(typeof results.nihii === 'undefined' || !results.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + results.nihii) }}) :
                      (text || '').length >= 2 ? Promise.all([this.api.hcparty().findBySsinOrNihii( text ),this.api.hcparty().findByName( text )]).then(results => {
                      return _.flatten(_.chain( _.concat( results[0].rows, results[1].rows ) ).uniqBy( 'id' ).filter({ type : 'medicalhouse' }).value().map(i => ({
                          'id': i.id,
                          'name':_.upperFirst(_.lowerCase(i.name)) + ' ' +(typeof i.nihii === 'undefined' || !i.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + i.nihii) + ' ' +''
                      })));

                  }) : Promise.resolve([]);
              } else if (data.source === "insuranceTitularies") {
                  return (id||'').length >= 1 ?
                      this.api.patient().getPatientWithUser( this.user, id ).then(p => this.api.register(p, 'patient')).then(results => { return { 'id': results.id, 'name':_.upperFirst(_.lowerCase(_.get(results, "firstName", "" ))) + ' ' + _.upperFirst(_.lowerCase(_.get(results, "lastName", "" ))) + ' ' + this.api.formatSsinNumber(_.get(results, "ssin", "")) }}) :

                      (text || '').length >= 2 ? Promise.all([this.api.patient().filterByWithUser(this.user, null, null, null, null, null, null, {filter: { $type: "PatientByHcPartyNameContainsFuzzyFilter", healthcarePartyId: this.user.healthcarePartyId, searchString: text }})]).then(results => {
                      return _.flatten(_.chain( results[0].rows ).uniqBy( 'ssin' ).filter((i)=>{
                          return i &&
                              !!_.trim(_.get(i, "ssin", "")) &&
                              !!_.get(i, "active", false) &&
                              parseInt(_.size(_.get(i, "insurabilities", []))) &&
                              parseInt(_.size(_.filter(_.map(
                                  _.get(i, "insurabilities", []),
                                  (ins => ins &&
                                      _.size(ins) &&
                                      !_.trim(_.get( ins, "titularyId", "" ) ) &&
                                      !!_.trim(_.get( ins, "insuranceId", "" ) ) &&
                                      !!_.trim(_.get( ins, "identificationNumber", "" ) ) &&
                                      ( moment(_.get(ins, "startDate", 0), 'YYYYMMDD').isBefore(moment(), 'date') || !parseInt(_.get(ins, "startDate", 0)) ) &&
                                      ( moment(_.get(ins, "endDate", 0), 'YYYYMMDD').isAfter(moment(), 'date') || !parseInt(_.get(ins, "endDate", 0)) )
                                  )))))
                      }).value().map(i => ({
                          'id': i.id,
                          'name':_.upperFirst(_.lowerCase(_.get(i, "firstName", "" ))) + ' ' + _.upperFirst(_.lowerCase(_.get(i, "lastName", "" ))) + ' ' + this.api.formatSsinNumber(_.get(i, "ssin", ""))
                      })));

                  }) : Promise.resolve([]);
              }
              return Promise.resolve(id ? null : [])
          }
      };
  }

  localizeContent(e, lng) {
      return this.api && this.api.contact().localize(e, lng) || e;
  }

  showAddPersonToCareTeam() {
      this.$['add-person-to-care-team'].open()
      this.set('currentHcp', _.values(this.api.hcParties))
  }

  showAddNewPersonToCareTeamForm() {
      this.$['add-person-to-care-team'].close()
      this.$['add-new-person-to-care-team'].open()
  }

  addNewExternalPersonToCareTeam() {
      const careProvider = this.newHcpCareTeam

      this.api.hcparty().createHealthcareParty({
          "name": careProvider.LastName + " " + careProvider.FirstName,
          "lastName": careProvider.LastName,
          "firstName": careProvider.FirstName,
          "nihii": careProvider.Nihii,
          "ssin": careProvider.Niss
      }).then(hcp => {
          this.api.user().createUser({
              "healthcarePartyId": hcp.id,
              "name": careProvider.LastName + " " + careProvider.FirstName,
              "email": careProvider.Email,
              "applicationTokens": {"tmpFirstLogin": this.api.crypto().randomUuid()},
              "status": "ACTIVE",
              "type": "database"
          }).then(usr => {
              this.api.queue(this.patient, 'patient').then(([patient, defer])  => {
                  var phcp = patient.patientHealthCareParties
                  var newPhcp = {}
                  newPhcp.healthcarePartyId = hcp.id
                  newPhcp.referral = false
                  newPhcp.sendFormats = {}
                  phcp.push(newPhcp)

                  this.api.patient().modifyPatientWithUser(this.user,patient).catch(e => defer.resolve(patient))
                      .then(p => this.api.register(p, 'patient', defer))
                      .then(() => {
                          this.set('patient.patientHealthCareParties', phcp)
                          this.$['add-new-person-to-care-team'].close()
                          this.initCurrentCareTeam()

                          if (careProvider.Invite === true) {
                              this.$['ht-invite-hcp-link'].open()
                              this.invitedHcpLink = window.location.origin + window.location.pathname + '/?userId=' + usr.id + '&token=' + usr.applicationTokens.tmpFirstLogin
                          }
                      })
              })
          })
      })
  }

  initCurrentCareTeam() {
      var internalTeam = []
      var externalTeam = []
      var externalPatientHcpTeam = []
      //var dmgOwner = []

      this.api.patient().getPatientWithUser(this.user,this.patient.id).then(p => this.api.register(p, 'patient')).then(patient => {
          const internalHcp = patient.delegations
          const externalHcp = patient.patientHealthCareParties

          Promise.all([
              Promise.all(
                  _.keys(internalHcp).map(hcpId =>
                      this.api.hcparty().getHealthcareParty(hcpId).then(hcp =>
                          internalTeam.push(hcp)
                      )
                  )
              ),
              Promise.all(
                  externalHcp.map(patientHcp =>
                      this.api.hcparty().getHealthcareParty(patientHcp.healthcarePartyId).then(hcp => {
                          patientHcp.firstName = hcp.firstName;
                          patientHcp.lastName = hcp.lastName;
                          patientHcp.name = hcp.name;
                          patientHcp.nihii = hcp.nihii;
                          patientHcp.ssin = hcp.ssin;
                          patientHcp.isDmg = patientHcp.referral;
                          externalTeam.push(hcp);
                          externalPatientHcpTeam.push(patientHcp);
                          }
                      )
                  )
              )
              ]

          ).then(([,]) => {
              this.set('currentInternalCareTeam', internalTeam);
              this.set('currentExternalCareTeam', externalTeam);
              this.set('currentExternalPatientCareTeam', externalPatientHcpTeam);
          }).then(
              () => {
                  //this.set('currentDMGOwner', dmgOwner);
                  if (this.patient.ssin && this.api.tokenId) {
                      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                          .then(hcp =>
                              this.api.fhc().Dmgcontroller().consultDmgUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName, this.patient.ssin)
                          )
                          .then(dmgConsultResp => {
                              const dmgNihii = dmgConsultResp.hcParty && dmgConsultResp.hcParty.ids.find(id => id.s === 'ID_HCPARTY') ? dmgConsultResp.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value : ''
                              if (dmgNihii && internalTeam.find(h => h.nihii === dmgNihii)) {
                                  // 3.1 Update user/party if exists
                                  console.log('dmg owner in internal team')
                                  const hcpI = internalTeam.find(h => h.nihii === dmgNihii)
                                  //TODO: show status
                                  return hcpI
                              } else if (dmgNihii && externalTeam.find(h => h.nihii === dmgNihii)) {
                                  // 3.1 Update user/party if exists
                                  console.log('dmg owner in external team')
                                  let hcpE = externalTeam.find(h => h.nihii === dmgNihii)
                                  hcpE.name = (!dmgConsultResp.hcParty.name) && dmgConsultResp.hcParty.name === '' ? dmgConsultResp.hcParty.familyname + ' ' + dmgConsultResp.hcParty.firstname : dmgConsultResp.hcParty.name
                                  hcpE.lastName = dmgConsultResp.hcParty.familyname
                                  hcpE.firstName = dmgConsultResp.hcParty.firstname
                                  hcpE.nihii = dmgConsultResp.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value

                                  hcpE.addresses = []
                                  if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.addresses) {
                                      dmgConsultResp.hcParty.addresses.map(addr => {
                                          let hcAddr = {}
                                          hcAddr.addressType = addr.cds.find(cd => cd.s === 'CD_ADDRESS') ? addr.cds.find(cd => cd.s === 'CD_ADDRESS').value : ''
                                          hcAddr.street = addr.street ? addr.street : ''
                                          hcAddr.city = addr.city ? addr.city : ''
                                          hcAddr.postalCode = addr.zip ? addr.zip : ''
                                          hcAddr.houseNumber = addr.housenumber ? addr.housenumber : ''
                                          hcAddr.postboxNumber = addr.postboxnumber ? addr.postboxnumber : ''
                                          hcAddr.country = addr.country && addr.country.cd && addr.country.cd.value ? addr.country.cd.value : ''
                                          hcpE.addresses.push(hcAddr)
                                      })
                                  }

                                  if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.cds) {
                                      const cd = dmgConsultResp.hcParty.cds.find(cd => cd.s === 'CD_HCPARTY')
                                      if (cd) {
                                          hcpE.speciality = cd.value ? cd.value : ''
                                      }
                                  }
                                  hcpE.referral = true
                                  hcpE.isDmg = true
                                  hcpE.referralPeriods = [{
                                      startDate: dmgConsultResp.from,
                                      endDate: dmgConsultResp.to
                                  }]

                                  return this.api.hcparty().modifyHealthcareParty(hcpE)
                                      .then(hcpE => {
                                          this.api.queue(this.patient, 'patient')
                                              .then(([patient, defer]) => {
                                                  let phcpE = patient.patientHealthCareParties.find(phcp => phcp.healthcarePartyId === hcpE.id)
                                                  if (!phcpE) {
                                                      patient.patientHealthCareParties.push(phcpE = {healthcarePartyId: hcpE.id, referralPeriods: []})
                                                  }
                                                  const currentReferralPeriod = phcpE.referralPeriods.find(rp => !rp.endDate)
                                                  let type = "other"
                                                  if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.cds) {
                                                      const cd = dmgConsultResp.hcParty.cds.find(cd => cd.s === 'CD_HCPARTY')
                                                      if (cd.value === 'orgprimaryhealthcarecenter') {
                                                          type = "medicalhouse"
                                                      } else if (cd.value === 'persphysician') {
                                                          type = "doctor"
                                                      }
                                                  }
                                                  if (!currentReferralPeriod || !phcpE.referral || phcpE.type !== type) {
                                                      phcpE.referralPeriods = [{
                                                          startDate: dmgConsultResp.from,
                                                          endDate: null
                                                      }]
                                                      phcpE.referral = true
                                                      phcpE.isDmg = true

                                                      return this.api.patient().modifyPatientWithUser(this.user,patient).catch(e => defer.resolve(patient)).then(p => this.api.register(p, 'patient', defer)).then(p => this.patientChanged())
                                                  } else {
                                                      defer.resolve(patient)
                                                      return patient
                                                  }
                                              })
                                              .then(() => hcpE)
                                  })
                              } else if (dmgNihii) {
                                  console.log('dmg owner not yet in patientHcParties')
                                  return this.api.hcparty().createHealthcareParty({
                                      "name": (!dmgConsultResp.hcParty.name) && dmgConsultResp.hcParty.name === '' ? dmgConsultResp.hcParty.familyname + ' ' + dmgConsultResp.hcParty.firstname : dmgConsultResp.hcParty.name,
                                      "lastName": dmgConsultResp.hcParty.familyname,
                                      "firstName": dmgConsultResp.hcParty.firstname,
                                      "nihii": dmgConsultResp.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value,
                                      "ssin": '' //TODO: get SSIN from dmgConsultResp
                                  }).then(hcp2 => {
                                      var newPhcp = {}
                                      newPhcp.firstName = hcp2.firstName
                                      newPhcp.lastName = hcp2.lastName
                                      newPhcp.name = hcp2.name
                                      newPhcp.nihii = hcp2.nihii
                                      newPhcp.ssin = hcp2.ssin
                                      newPhcp.healthcarePartyId = hcp2.id
                                      if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.cds) {
                                          const cd = dmgConsultResp.hcParty.cds.find(cd => cd.s === 'CD_HCPARTY')
                                          if (cd.value === 'orgprimaryhealthcarecenter') {
                                              newPhcp.type = "medicalhouse"
                                          } else if (cd.value === 'persphysician') {
                                              newPhcp.type = "doctor"
                                          } else {
                                              newPhcp.type = "other"
                                          }
                                      }
                                      newPhcp.isDmg = true
                                      newPhcp.referral = true
                                      newPhcp.referralPeriods = [{
                                          startDate: dmgConsultResp.from,
                                          endDate: dmgConsultResp.to
                                      }]
                                      hcp2.addresses = []
                                      if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.addresses) {
                                          dmgConsultResp.hcParty.addresses.map(addr => {
                                              let hcAddr = {}
                                              hcAddr.addressType = addr.cds.find(cd => cd.s === 'CD_ADDRESS') ? addr.cds.find(cd => cd.s === 'CD_ADDRESS').value : ''
                                              hcAddr.street = addr.street ? addr.street : ''
                                              hcAddr.city = addr.city ? addr.city : ''
                                              hcAddr.postalCode = addr.zip ? addr.zip : ''
                                              hcAddr.houseNumber = addr.housenumber ? addr.housenumber : ''
                                              hcAddr.postboxNumber = addr.postboxnumber ? addr.postboxnumber : ''
                                              hcAddr.country = addr.country && addr.country.cd && addr.country.cd.value ? addr.country.cd.value : ''
                                              hcp2.addresses.push(hcAddr)
                                          })
                                      }

                                      if (dmgConsultResp.hcParty && dmgConsultResp.hcParty.cds) {
                                          const cd = dmgConsultResp.hcParty.cds.find(cd => cd.s === 'CD_HCPARTY')
                                          if (cd) {
                                              hcp2.speciality = cd.value ? cd.value : ''
                                          }
                                      }

                                      hcp2.pphc = newPhcp
                                      hcp2.referral = true
                                      hcp2.referralPeriods = [{
                                          startDate: dmgConsultResp.from,
                                          endDate: dmgConsultResp.to
                                      }]

                                      console.log('dmg owner pushed to external team')
                                      //externalTeam.push(hcp2);
                                      externalPatientHcpTeam.push(hcp2)
                                      this.api.queue(this.patient, 'patient').then(([patient, defer]) => {
                                          patient.patientHealthCareParties = this.patient.patientHealthCareParties
                                          this.push('patient.patientHealthCareParties', newPhcp)
                                          // 4 save data
                                          return this.api.patient().modifyPatientWithUser(this.user,patient).catch(e => defer.resolve(patient)).then(p => this.api.register(p, 'patient', defer))
                                      })

                                  })
                              }
                          })
                          .then(() => {
                              this.set('currentInternalCareTeam', internalTeam)
                              this.set('currentExternalCareTeam', externalTeam)
                              this.set('currentExternalPatientCareTeam', externalPatientHcpTeam)
                          })
                          .catch(e => {
                              console.log(e)
                              this.set('currentInternalCareTeam', internalTeam)
                              this.set('currentExternalCareTeam', externalTeam)
                              this.set('currentExternalPatientCareTeam', externalPatientHcpTeam)
                          })
                  }
              })

      })
  }

  getHcpName(hcp){
      if(hcp.name && hcp.name !== '') {
          return hcp.name
      }
      else{
          return hcp.firstName + ' ' + hcp.lastName
      }
  }

  formatDate(date){
      if(date){
          return this.api.moment(date).format('DD/MM/YYYY')
      }
      else {
          return ''
      }
  }

  getStartDate(item){
      if(item.referralPeriods && item.referralPeriods[0]){
          return this.formatDate(item.referralPeriods[0].startDate)
      }
      else
      {
          return null;
      }
  }

  getEndDate(item){
      if(item.referralPeriods && item.referralPeriods[0]){
          return this.formatDate(item.referralPeriods[0].endDate)
      }
      else
      {
          return null;
      }
  }

  showInfoSelectedHcp(e){
      //TODO: catch the case no hcp is selected

      let tmp = this.selectedCareProvider;

	    this.$['showHcpInfo'].open();

      const pphcTab = this.patient.patientHealthCareParties;
      const pphcTarget = pphcTab.find(pphc => pphc.healthcarePartyId === this.selectedCareProvider.id);

      //Comparer les dates pour le detenteur du dmg
      if(pphcTarget){
          pphcTarget.referralPeriods.map(rp => rp);
      }

      if(this.selectedCareProvider && this.selectedCareProvider.isDmg)
      {

          this.selectedCareProvider.pphc = _.cloneDeep(this.selectedCareProvider);
          this.set('selectedPerson', this.selectedCareProvider);
      }
      else
      {
          if(pphcTarget) this.selectedCareProvider.pphc = pphcTarget;
          this.set('selectedPerson', this.selectedCareProvider);
      }

  }

  _timeFormat(date) {
      return date && this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') || '';
  }

  _sharingHcp(item){
      if (item) {
          const mark = this.hcpSelectedForTeam.find(m => m.id === item.id)
          return mark && mark.check
      } else {
          return false
      }
  }

  _checkHcp(e){
      if (e.target.id !== "") {
          const mark = this.hcpSelectedForTeam.find(m => m.id === e.target.id)
          if (!mark) {
              this.push('hcpSelectedForTeam',{id:e.target.id, check:true})
          } else {
              mark.check = !mark.check
              this.notifyPath('hcpSelectedForTeam.*')
          }
      }

  }

  confirmSharing() {
      let pPromise = Promise.resolve([])
      const hcpId = this.user.healthcarePartyId

      pPromise = pPromise.then(pats =>
              this.api.patient().share(this.api.user, this.patient.id, hcpId, this.hcpSelectedForTeam.filter(hcp =>
                  hcp.check && hcp.id).map(hcp => hcp.id))
                  .then(pat => {
                          _.concat(pats, pat)
                          this.initCurrentCareTeam()
                      }
                  )
          )
      return pPromise
  }

  formatNihiiNumber(nihii) {
      return nihii ? ("" + nihii).replace(/([0-9]{1})([0-9]{5})([0-9]{2})([0-9]{3})/, '$1-$2-$3-$4') : ''
  }

  formatNissNumber(niss) {
      return niss ? ("" + niss).replace(/([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{3})([0-9]{2})/, '$1.$2.$3-$4.$5') : ''
  }

  chckInvite(e){
      if(e.target.checked){
          this.newHcpCareTeam.Invite = true
      }else{
          this.newHcpCareTeam.Invite = false
      }
  }

  fillWithCard(){
      this.set('cardData', null);
      fetch(`${_.get(this,"api.electronHost","http://127.0.0.1:16042")}/read`)
          .then((response) => {
              return response.json();
          })
          .catch(() => {})
          .then(res => {
              if (res && res.cards && res.cards[0]) {
                  this.set('cardData', res.cards[0]);
                  this.dispatchEvent(new CustomEvent('card-changed', {
                      detail: {cardData: this.cardData},
                      composed: true,
                      bubbles: true
                  }));
              }
          })
          .then(() => {
              if (!this.cardData) {
                  this.dispatchEvent(new CustomEvent('error-electron', {detail: {message:this.localize("error-elect-eid-no-found","EID : not found",this.language) }, bubbles: true, composed: true}));
              } else if (!this.patient.ssin) {
                  this.set('warningData',{
                      patient: {
                          firstName: this.patient.firstName,
                          lastName: this.patient.lastName,
                          dateOfBirth: this.api.moment(this.patient.dateOfBirth).format('DD/MM/YYYY')
                      },
                      card: {
                          firstName: this.cardData.firstName,
                          lastName: this.cardData.surname,
                          dateOfBirth: this.api.moment(this.cardData.dateOfBirth * 1000).format('DD/MM/YYYY'),
                          niss: this.cardData.nationalNumber
                      }
                  });
                  this.$['warning-message-box'].open();
              } else if (this.patient.ssin !== this.cardData.nationalNumber) {
                  this.dispatchEvent(new CustomEvent('error-electron', {detail: { message:this.localize("error-elect-eid-ssin-diff","EID : the EID SSIN isn't the same as the patient's",this.language)}, bubbles: true, composed: true}));
              } else {
                  this.doFillWithCard();
              }
          })
  }

  doFillWithCard() {
      if(Object.keys(this.cardData).length!==0) {
          let streetData = _.trim(this.cardData.street).split(" ")
          const number = streetData.find(str => str.match(/\d/g))
          const boxNumber = streetData[streetData.length-1]!==number ? streetData[streetData.length-1] :""
          const street = streetData.reduce((tot,str)=>{
              if(!tot)tot="";
              if(!(str===number || str===boxNumber ))
                  tot = tot.concat(" ",str)
              return tot;
          })

          this.set("patient.lastName", this.cardData.surname)
          this.set("patient.firstName", this.cardData.firstName)
          this.set("patient.lastTimeEidRead",parseInt(moment().format('YYYYMMDD')))
          this.set("patient.placeOfBirth", this.cardData.locationOfBirth)
          this.set("patient.dateOfBirth", parseInt(this.api.moment(this.cardData.dateOfBirth * 1000).format('YYYYMMDD')))
          this.set("patient.nationality", this.cardData.nationality)
          this.set("patient.picture", this.cardData.picture)
          this.set("patient.gender", this.cardData.gender === 'M' ? 'male' : 'female')
          if (!this.patient.ssin) {
              this.set("patient.ssin", this.cardData.nationalNumber)
          }

          if(!this.patient.addresses.find(adr => adr.addressType==="home")) {
              this.push("patient.addresses", {
                  addressType: "home",
                  street: street,
                  houseNumber: number,
                  postboxNumber: boxNumber,
                  postalCode: this.cardData.zipCode,
                  city: this.cardData.municipality,
                  country: this.cardData.country
              })
          }
          else{
              this.set("patient.addresses."+this.patient.addresses.findIndex(adr => adr.addressType==="home"), {
                  addressType: "home",
                  street: street,
                  houseNumber: number,
                  postboxNumber: boxNumber,
                  postalCode: this.cardData.zipCode,
                  city: this.cardData.municipality,
                  country: this.cardData.country,
                  telecoms : this.patient.addresses[this.patient.addresses.findIndex(adr => adr.addressType==="home")].telecoms
              })
          }


          this.api.patient().modifyPatientWithUser(this.user, this.patient)
              .then(p => {
                  this.api.register(p, 'patient')
              })
              .then(p => {
                  this.set('patientMap', _.cloneDeep(this.patient));

                  if (!this.root.activeElement || !this.$[this.root.activeElement.id]) {
                      this.$['dynamic-form-administrative'].loadDataMap();
                  } else {
                      this.$[this.root.activeElement.id].loadDataMap();
                  }
              })
      }
      else{
          this.dispatchEvent(new CustomEvent('error-electron', { detail: {message:(this.patient.ssin !== this.cardData.nationalNumber ? this.localize("error-elect-eid-ssin-diff","EID : the EID SSIN isn't the same as the patient's",this.language) : this.localize("error-elect-eid-no-found","EID : not found",this.language))}, bubbles: true, composed: true }))
      }
  }

  _tabIndexChanged() {
      if(this.tabIndex >= 0 && this.tabs >= 0 && this.tabIndex != this.tabs){
          this.set('tabs',this.tabIndex)
      }
  }

  searchPatient(e){
      if(!e.detail.value)return;
      this.api.patient().getPatientWithUser(this.user,e.detail.value).then( pat =>{
          let partner = this.patient.partnerships.findIndex(partner => !partner.partnerId || !partner.partnerInfo || (partner.partnerId && !partner.partnerInfo.id))
          if(partner===-1) {
              partner = this.patient.partnerships.length
              this.dataProvider.addSubForm("partnerships", null)
          }
          this.set("patient.partnerships."+partner,{partnerId:pat.id,partnerInfo:pat})

          this.$["dynamic-form-partnerships"].notify('partnerships.*');
          this.scheduleSave(this.patient);
          this.set("filterPartner","")
          this.set("valuePartner","")
      })

  }

  researchPat(e){
      const searchValue = e.detail.value
      if( _.trim(searchValue).length < 3 ) {
          this.set("listPatient",[]);
          clearTimeout(this.launchFilterBy)
          return;
      }

      const parentOrCurrentHcpId =_.trim(_.get(this,"user.healthcarePartyId",""))

      const filter = {
          '$type': 'IntersectionFilter',
          'healthcarePartyId': parentOrCurrentHcpId,
          'filters': _.compact(_.trim(searchValue).split(/[ ,;:]+/).filter(w => w.length >= 2).map( word => /^[0-9]{11}$/.test(word) ? {
              '$type': 'PatientByHcPartyAndSsinFilter',
              'healthcarePartyId': parentOrCurrentHcpId,
              'ssin': word
          } : /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? {
              '$type': 'PatientByHcPartyDateOfBirthFilter',
              'healthcarePartyId': parentOrCurrentHcpId,
              'dateOfBirth': word.replace(/([0-3]?[0-9])[\/-](1[0-2]|0?[0-9])[\/-]((?:[1-2][89012])?[0-9][0-9])/g, (correspondance, p1, p2, p3) => (p3.length === 4 ? p3 : (p3 > 20) ? "19" + p3 : "20" + p3) + (p2.length === 2 ? p2 : "0" + p2) + (p1.length === 2 ? p1 : "0" + p1))
          } : /^[0-9]{3}[0-9]+$/.test(word) ? {
              '$type': 'UnionFilter',
              'healthcarePartyId': parentOrCurrentHcpId,
              'filters': [
                  {
                      '$type': 'PatientByHcPartyDateOfBirthBetweenFilter',
                      'healthcarePartyId': parentOrCurrentHcpId,
                      'minDateOfBirth': word.length >= 8  ? Number(word.substr(0,8)) : word.length >= 6 ? Number(word.substr(0,6) + '00') : Number(word.substr(0,4) + '0000'),
                      'maxDateOfBirth': word.length >= 8  ? Number(word.substr(0,8)) : word.length >= 6 ? Number(word.substr(0,6) + '99') : Number(word.substr(0,4) + '9999')
                  },
                  {
                      '$type': 'PatientByHcPartyAndSsinFilter',
                      'healthcarePartyId': parentOrCurrentHcpId,
                      'ssin': word
                  },
                  {
                      '$type': 'PatientByHcPartyAndExternalIdFilter',
                      'healthcarePartyId': parentOrCurrentHcpId,
                      'externalId': word
                  }
              ]
          } : /^[0-9]+$/.test(word) ? {
              '$type': 'PatientByHcPartyAndSsinFilter',
              'healthcarePartyId': parentOrCurrentHcpId,
              'ssin': word
          } : word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').length >= 2 ? {
              '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
              'healthcarePartyId': parentOrCurrentHcpId,
              'searchString': word
          } : null))
      }

      const predicates = _.trim(searchValue).split(/[ ,;:]+/).filter(w => w.length >= 2).map( word =>
          /^[0-9]{11}$/.test(word) ? (() => true) :
              /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? (() => true) :
                  /^[0-9]{3}[0-9]+$/.test(word) ? ((p) => (p.dateOfBirth && (`${p.dateOfBirth}`.includes(word))) || (p.externalId && p.externalId.includes(word))) :
                      (p => {
                          const w = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'')
                          return w.length<2 ?
                              true :
                              (p.firstName && p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').includes(w)) ||
                              (p.lastName && p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').includes(w))
                      })
      )

      clearTimeout(this.launchFilterBy)
      this.launchFilterBy = setTimeout(() =>{
          this.api.getRowsUsingPagination((key, docId, pageSize) =>
                  this.api.patient().filterByWithUser(this.user, key, docId, pageSize || 50, 0, "lastName", false, { filter: _.assign({}, filter, {filters: filter.filters}) })
                      .then(pl => {
                          const filteredRows = pl.rows.filter(p => predicates.every(f => f(p)))
                          return {
                              rows: filteredRows,
                              nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                              nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                              done: !pl.nextKeyPair
                          }
                      })
                      .catch(() => { return Promise.resolve() }),
              p => ( !!_.get(p,"active",false) && ( !!_.trim(_.get(p,"dateOfBirth","")) || !!_.trim(_.get(p,"ssin","")) ) ), 0, 50, []
          )
              .then(searchResults => {
                  return this.set("listPatient", searchResults.filter(pat => pat.id!==this.patient.id && !this.patient.partnerships.find(partner => partner.partnerId===pat.id)).map(pat =>{
                      return _.assign(pat,{"prettyName": ((pat.lastName ? pat.lastName+" " : "")+(pat.firstName ? pat.firstName : "")) || pat.name })
                  }))
              })
              .catch(e=>{console.log("ERROR with searching patient: ", e);})
      }, 500)
  }

  picture(pat) {
      if (!pat) {
          return require('../../../images/male-placeholder.png')
      }
      return pat.picture ? 'data:image/jpeg;base64,' + pat.picture : pat.gender === 'female' ? require('../../../images/female-placeholder.png') : require('../../../images/male-placeholder.png')
  }

  upgradePatientWithSsin(){
      if(_.isEmpty(this.activeItem)){
          this.set("listValidSsin."+(this.ssinSavePrimaryPatient.id),this.ssinSavePrimaryPatient.ssin)
          Object.keys(this.listValidSsin).filter(key=>key!==this.ssinSavePrimaryPatient.id && this.listValidSsin[key]===this.ssinSavePrimaryPatient.ssin).map(key=>{
              this.listValidSsin[key]="";
              if(key===this.patient.id){
                  this.dataProvider.setStringValue("ssin","")
              }else{
                  this.dataProvider.getSubForms("partnerships").find(subForm => subForm.dataMap.partnerId===key).dataProvider.setStringValue("partnerInfo.ssin","")
              }
          })

          Promise.all(this.ssinPatientsList.filter(pat => pat.ssin===this.ssinSavePrimaryPatient.ssin && pat.id!==this.ssinSavePrimaryPatient.id && !Object.keys(this.listValidSsin).find(key=>key===pat.id)).map(pat=>{
              pat.ssin=""
              return this.api.patient().modifyPatientWithUser(this.user,pat).then( p => this.api.register(p, 'patient')).then(pat => console.log("ssin du patient supprimé",pat))
          })).then(()=>{
              this.flushSave()
          }).catch(err=>{
              console.log("error with upgradePatientWithSSIN",err)
          }).finally(()=>{
              this.$["noSave"].classList.remove("notification")
              this.set('patientMap', _.cloneDeep(this.patient));
              this.$['dynamic-form-administrative'].loadDataMap();
              this.$['dynamic-form-partnerships'].loadDataMap();
              this.set("activeItem",{})
          })
      }
      else{
          this.listValidSsin[this.ssinSavePrimaryPatient.id]=this.activeItem.patient.ssin
          Object.keys(this.listValidSsin).filter(key=>key!==this.activeItem.patient.id && this.listValidSsin[key]===this.activeItem.patient.ssin).map(key=>{
              this.listValidSsin[key]="";
              if(key===this.patient.id){
                  this.dataProvider.setStringValue("ssin","")
              }else{
                  this.dataProvider.getSubForms("partnerships").find(subForm => subForm.dataMap.partnerId===key).dataProvider.setStringValue("partnerInfo.ssin","")
              }
          })

          Promise.all(this.ssinPatientsList.filter(pat=> pat.id!==this.activeItem.patient.id && pat.ssin===this.activeItem.patient.ssin && !Object.keys(this.listValidSsin).find(key=>key===pat.id)).map(pat=>{
              pat.ssin=""
              return this.api.patient().modifyPatientWithUser(this.user,pat).then( p => this.api.register(p, 'patient')).then(pat => console.log("ssin du patient supprimé",pat))
          })).then(()=>{
              this.flushSave()
          }).catch(err=>{
              console.log("error with upgradePatientWithSSIN",err)
          }).finally(()=>{
              this.$["noSave"].classList.remove("notification")
              this.set('patientMap', _.cloneDeep(this.patient));
              this.$['dynamic-form-administrative'].loadDataMap();
              this.$['dynamic-form-partnerships'].loadDataMap();
              this.set("activeItem",{})
          })
      }
  }

  deleteSsin(){
      this.$["noSave"].classList.remove("notification")
      let promise;
      if(this.patient.id===this.ssinSavePrimaryPatient.id){
          promise=this.dataProvider.setStringValue("ssin",this.listValidSsin[this.ssinSavePrimaryPatient.id])
      }else{
          const form = this.dataProvider.getSubForms("partnerships").find(subForm => subForm.dataMap.partnerId===this.ssinSavePrimaryPatient.id)
          promise= form.dataProvider.setStringValue("partnerInfo.ssin",this.listValidSsin[this.ssinSavePrimaryPatient.id])
          form.dataMap = this.patient.partnerships.find(partner => partner.partnerId===this.ssinSavePrimaryPatient.id)
      }
      this.set('patientMap', _.cloneDeep(this.patient))
      this.set("activeItem",{})
      promise.then(()=> this.flushSave())
  }


  openFusionDialog(e){
      e.stopPropagation()
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("fusion-dialog-called",{
          detail: {
              open:true,
              patients:[this.ssinSavePrimaryPatient,this.ssinPatientsList.find(pat => pat.patient.id===e.target.entry).patient],
              select: [0,1]
          },
          bubbles: true,
          composed: true
      }))
  }

  patientMerged(e){
      if(!e.detail.ok){
          if(!this.$["noSave"].classList.contains("notification"))this.$["noSave"].classList.add("notification")
          return;
      }

      if(e.detail.patientId===this.patient.id){
          this.$["noSave"].classList.remove("notification")
          this.set("ssinPatientsList",this.ssinPatientsList.filter(patAndCtc=>!this.patient.mergedIds.find(id=> id===patAndCtc.patient.id)))
          if(this.ssinPatientsList.length) this.$["noSave"].classList.add("notification")
          return;
      }else{
          if(this.$["noSave"].classList.contains("notification"))this.$["noSave"].classList.remove("notification")
      }
  }
}

customElements.define(HtPatAdminCard.is, HtPatAdminCard);
