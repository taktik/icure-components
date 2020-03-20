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

import '../../styles/scrollbar-style.js';
import '../../styles/notification-style.js';
import '../../styles/paper-tabs-style.js';
import '../../styles/shared-styles.js';
import '../../styles/dialog-style.js';
import './dialogs/team/ht-pat-admin-team-dialog.js';
import moment from 'moment/src/moment';
import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtPatAdminTeam extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment"></style>
        <style include="scrollbar-style notification-style buttons-style paper-tabs-style shared-styles dialog-style">
            :host {
                height: 100%;
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
            paper-dialog paper-input{
                padding: 0;
            }
            paper-dialog > div {
                margin-top: 0;
            }
            paper-dialog vaadin-grid.material{
                margin:24px 0 0;
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
            #internalCareTeamDialog{
                min-height: 554px;
                max-height: 50%;
                min-width: 800px;
                max-width: 60%;
            }

            #hcpInfoDialog{
                height: 440px;
                width: 1024px;
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
            }
            .hcpInfo{
                max-height: calc(520px - 56px);
                overflow: auto;
                padding: 0;
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
                color: var(--app-text-color);
                background-color: var(--app-background-color-dark);
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
                opacity: 0.5;
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
            iron-icon.smaller {
                padding-right: 8px;
                width: 16px;
                height: 16px;
            }
            #newHcp{
                width: 740px;
            }
            .icon-title{
                height: 12px;
                width: 12px;
            }
            .external-care-team-form{
                height: calc(100% - 45px);
                overflow: auto;
            }
            .external-care-team-line{
                display: flex;
            }
            .external-care-team-line-item{
                width: 50%!important;
                padding: 5px!important;
            }
            .external-care-team-line-item-only{
                width: 100%!important;
                padding: 5px!important;
            }
            .external-care-team-block{
                width: 99%;
                height: auto;
                border: 1px solid var(--app-background-color-dark);
                margin-bottom: 12px;
            }
            .external-care-team-block-title{
                font-size: var(--font-size-large);
                background: var(--app-background-color-dark);
                padding: 0 12px;
                box-sizing: border-box;
            }
            vaadin-text-field {
                height: 40px;
                padding: 0;
            }
            .referral-icon{
                height: 15px;
                width: 15px;
            }
            .hidden{
                visibility: hidden;
            }
            .modal-title {
                background: var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
            }
            .buttons {
                display: flex;
                flex-direction: row;
            }
            .modal-button{
                --paper-button-ink-color: var(--app-secondary-color);
                color: var(--app-text-color);
                font-weight: 700;
                font-size: 14px;
                height: 40px;
                min-width: 100px;
                padding: 10px 1.2em;
            }
            .modal-button--save {
                background: var(--app-secondary-color);
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                color: var(--app-primary-color-dark);
                font-weight: 700;
            }
            .hcp-info-dialog-form{
                height: 305px;
                width: auto;
            }

            .title{
                height: 45px;
                width: 100%;
                border-bottom: 1px solid var(--app-background-color-darker);
                background-color: var(--app-background-color-dark);
                padding: 0 12px;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                box-sizing: border-box;
            }

            .hcpExternalTeamDialog-content{
                height: calc(98% - 36px);
                width: auto;
            }

            .m5{
                margin: 5px;
            }

            #externalCareTeamDialog{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 0;
                position: fixed;
                z-index: 1100;

            }

            .hcpExternalTeamDialog{
                height: 100%;
                width: auto;
                margin: 0;
                padding: 0;
                background-color: white;
                position: relative;
            }

            .content{
                height: calc(98% - 140px);
                width: auto;
                margin: 1%;
            }

            .w67{
                width: 66%;
            }

            .w33{
                width: 32%;
            }

            .p4{
                pading: 4px;
            }
        </style>
        <div class="team-content">
            <div class="internal-team">
                <h4 class="subtitle">[[localize('icp','Internal care provider',language)]]</h4>
                <vaadin-grid id="internal-care-team-list" class="material" overflow="bottom" multi-sort="[[multiSort]]" items="[[patientTeam.internal]]" active-item="{{selectedCareProvider}}">
                    <vaadin-grid-column width="240px">
                        <template class="header">
                            <vaadin-grid-sorter path="lastName">[[localize('nam','Name',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <template is="dom-if" if="[[_isReferral(item)]]">
                                <iron-icon class="referral-icon" icon="icons:accessibility"></iron-icon>
                            </template>
                            <template is="dom-if" if="[[!_isReferral(item)]]">
                                <iron-icon class="referral-icon hidden" icon="icons:accessibility"></iron-icon>
                            </template>
                            [[getHcpName(item)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="nihii">[[localize('inami','Nihii',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[formatNihiiNumber(item.nihii)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="speciality">[[localize('speciality','Speciality',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[_localizeSpeciality(item.speciality)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="beginDate">[[localize('foll-up-beg','Beginning of the follow-up',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[getStartDate(item)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="endDate">[[localize('foll-up-end','End of the follow-up',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[getEndDate(item)]]
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>

            <div class="external-team">
                <h4 class="subtitle">[[localize('ecp','External care provider',language)]] <iron-icon class="icon-title" icon="vaadin:plus-circle" on-tap="_showExternalTeamSelector"></iron-icon></h4>
                <vaadin-grid id="dmg-owner-list" class="material" overflow="bottom" multi-sort="[[multiSort]]" items="[[patientTeam.external]]" active-item="{{selectedCareProvider}}">
                    <vaadin-grid-column width="240px">
                        <template class="header">
                            <vaadin-grid-sorter path="name">[[localize('nam','Name',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <template is="dom-if" if="[[_isReferral(item)]]">
                                <iron-icon class="referral-icon" icon="icons:accessibility"></iron-icon>
                            </template>
                            <template is="dom-if" if="[[!_isReferral(item)]]">
                                <iron-icon class="referral-icon hidden" icon="icons:accessibility"></iron-icon>
                            </template>
                            [[getHcpName(item)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="nihii">[[localize('inami','Nihii',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[formatNihiiNumber(item.nihii)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="speciality">[[localize('speciality','Speciality',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[_localizeSpeciality(item.speciality)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="beginDate">[[localize('foll-up-beg','Beginning of the follow-up',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[getStartDate(item)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="endDate">[[localize('foll-up-end','End of the follow-up',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[getEndDate(item)]]
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
        </div>

        <paper-dialog id="internalCareTeamDialog">
            <h3 class="modal-title">
                <iron-icon icon="social:group-add"></iron-icon>
                [[localize('add_per_to_car_tea','Add person',language)]]
            </h3>
            <div>
                <vaadin-grid id="hcp-list" class="material" overflow="bottom" items="[[patientTeam.internal]]" active-item="{{selectedHcp}}">
                    <vaadin-grid-column width="100px">
                        <template class="header">
                        </template>
                        <template>
                            <vaadin-checkbox id="[[item.id]]" checked="[[_sharingHcp(item, patientTeam.internal.*)]]" on-checked-changed="_checkHcp"></vaadin-checkbox>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="120px">
                        <template class="header">
                            <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last name',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[item.lastName]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="120px">
                        <template class="header">
                            <vaadin-grid-sorter path="firstName">[[localize('fir_nam','First name',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[item.firstName]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="nihii">[[localize('inami','Nihii',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[formatNihiiNumber(item.nihii)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="speciality">[[localize('speciality','Speciality',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            [[item.speciality]]
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <paper-button class="modal-button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="modal-button--save" dialog-confirm="" autofocus="" on-tap="_addHcpToInternalTeam">[[localize('save','Save',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="externalCareTeamDialog">
            <div class="hcpExternalTeamDialog">
                <div class="title">
                    <iron-icon icon="social:group-add" class="p4"></iron-icon> [[localize('add_new_per_to_car_tea','Add new person to the care team',language)]]
                </div>
                <div class="hcpExternalTeamDialog-content">
                    <div class="m5">
                        <template is="dom-if" if="[[_isEhealthActive()]]">
                            <div class="external-care-team-line">
                                <vaadin-combo-box id="newHcp" class="w67 p4" label="[[localize('inputYourSearchQuery','What are you looking for ?',language)]]" filter="{{hcpFilter}}" filtered-items="[[filteredHcpList]]" item-label-path="displayName" selected-item="{{selectedHcp}}" allow-custom-value=""><template>[[item.displayName]]</template></vaadin-combo-box>
                                <vaadin-combo-box class="type-to m-l-20 w33  p4" id="type-To" items="[[hcpTypes]]" item-label-path="label" item-value-path="id" required="" error-message="This field is required" label="[[localize('sch_by', 'Search by', language)]]" selected-item="{{hcpType}}"></vaadin-combo-box>
                            </div>
                        </template>
                        <div class="external-care-team-form">
                            <div class="external-care-team-block">
                                <div class="external-care-team-block-title">[[localize('adm-team-prov', 'Provider', language)]]</div>
                                <div class="external-care-team-line">
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('las_nam','Last name',language)]]" value="{{newHcpCareTeam.lastName}}" required="" error-message="This field is required"></vaadin-text-field>
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('fir_nam','First name',language)]]" value="{{newHcpCareTeam.firstName}}" required="" error-message="This field is required"></vaadin-text-field>
                                </div>
                                <div class="external-care-team-line">
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('inami','Nihii',language)]]" value="{{newHcpCareTeam.nihii}}"></vaadin-text-field>
                                    <vaadin-combo-box id="hcpSpeciality" class="external-care-team-line-item" items="[[specialityList]]" item-label-path="label.fr" item-value-path="id" label="[[localize('speciality','Speciality',language)]]" selected-item="{{selectedHcpSpeciality}}"></vaadin-combo-box>
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('niss','Niss',language)]]" value="{{newHcpCareTeam.ssin}}"></vaadin-text-field>
                                </div>
                                <div class="external-care-team-line">
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('cbe','Cbe',language)]]" value="{{newHcpCareTeam.cbe}}"></vaadin-text-field>
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('comp_nam','Compagny name',language)]]" value="{{newHcpCareTeam.companyName}}"></vaadin-text-field>
                                </div>
                            </div>
                            <div class="external-care-team-block">
                                <div class="external-care-team-block-title">[[localize('adm-team-comment', 'Comment', language)]]</div>
                                <div class="external-care-team-line">
                                    <vaadin-text-field class="external-care-team-line-item-only" label="[[localize('adm-team-comment', 'Comment', language)]]" value="{{newHcpCareTeam.notes}}"></vaadin-text-field>
                                </div>
                            </div>
                            <div class="external-care-team-block">
                                <div class="external-care-team-block-title">[[localize('adm-team-ref-period', 'Referral periods', language)]]</div>
                                <div class="external-care-team-line">
                                    <vaadin-date-picker class="external-care-team-line-item" label="[[localize('foll-up-beg','Beginning of the follow-up',language)]]" value="{{newHcpCareTeam.referralStartDate}}" i18n="[[i18n]]"></vaadin-date-picker>
                                    <vaadin-date-picker class="external-care-team-line-item" label="[[localize('foll-up-end','End of the follow-up',language)]]" value="{{newHcpCareTeam.referralEndDate}}" i18n="[[i18n]]"></vaadin-date-picker>
                                    <paper-checkbox class="external-care-team-line-item" value="{{newHcpCareTeam.referral}}" on-change="_chckIfReferral">[[localize('ref-hcp', 'Referral hcp', language)]]</paper-checkbox>
                                    <!--<paper-checkbox class="external-care-team-line-item" value="{{newHcpCareTeam.invite}}" on-change="chckInvite">[[localize('inv-hcp', 'Invite hcp', language)]]</paper-checkbox>-->
                                </div>
                            </div>
                            <!--
                            <div class="external-care-team-block">
                                <div class="external-care-team-block-title">[[localize('adm-team-ctc-data', 'Contacts data', language)]]</div>
                                <div class="external-care-team-line">
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('street','Street',language)]]" value="{{newHcpCareTeam.addresses.0.street}}"></vaadin-text-field>
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('number','Number',language)]]" value="{{newHcpCareTeam.addresses.0.houseNumber}}"></vaadin-text-field>
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('postalCode','Postal code',language)]]" value="{{newHcpCareTeam.addresses.0.postalCode}}"></vaadin-text-field>
                                    <vaadin-text-field class="external-care-team-line-item" label="[[localize('city','City',language)]]" value="{{newHcpCareTeam.addresses.0.city}}"></vaadin-text-field>
                                </div>
                            </div>
                            -->
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                    <paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="_addHcpToExternalTeam">[[localize('save','Save',language)]]</paper-button>
                </div>
            </div>
        </paper-dialog>


        <paper-dialog id="ht-invite-hcp-link">
            <h3>Lien de première connexion</h3>
            <h4>[[invitedHcpLink]]</h4>
        </paper-dialog>

        <ht-pat-admin-team-dialog id="htPatAdminTeamDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" resources="[[resources]]" selected-care-provider="[[selectedCareProvider]]" active-health-elements="[[activeHealthElements]]" inactive-health-elements="[[inactiveHealthElements]]" on-refresh-grid="_refreshGrid"></ht-pat-admin-team-dialog>
`;
  }

  static get is() {
      return 'ht-pat-admin-team';
  }
  static get properties() {
      return {
          api: {
              type: Object
          },
          resources: {
              type: Object
          },
          i18n:{
              type: Object
          },
          credentials: {
              type: Object,
              noReset: true
          },
          user: {
              type: Object
          },
          patient: {
              type: Object,
              notify: true
          },
          patientMap: {
              type: Object
          },
          dataProvider: {
              type: Object,
              value: null
          },
          newHcpCareTeam: {
              type: Object,
              value: () => ({
                  civility: null,
                  firstName: null,
                  lastName: null,
                  speciality: null,
                  nihii: null,
                  ssin: null,
                  cbe: null,
                  companyName: null,
                  referral: false,
                  notes: null,
                  referralPeriods: [],
                  addresses: [{
                      addressType: "work",
                      street: null,
                      houseNumber: null,
                      postalCode: null,
                      city: null,
                      telecoms: [{
                          telecomType: null,
                          telecomNumber: null
                      }]
                  }]
              })
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
          hcpFilter: {
              type: String,
              value: ''
          },
          hcpType: {
              type: Object,
              value: {}
          },
          hcpTypes: {
              type: Array,
              value: [
                  {id: "CBE", label: "BCE"},
                  {id: "EHP", label: "EHP (eHealth Partner)"},
                  {id: "INSS", label: "INSS"},
                  {id: "NIHII", label: "NIHII"},
                  {id: "NIHII-HOSPITAL", label: "NIHII-HOSPITAL"},
                  {id: "NIHII-PHARMACY", label: "NIHII-PHARMACY"}
              ],
              noReset: true
          },
          hcpReqIdx: {
              type: Number,
              value: 0
          },
          selectedHcp: {
              type: Object,
              value: () => {}
          },
          specialityList:{
              type: Array,
              value: () => []
          },
          selectedHcpSpeciality:{
              type: Object,
              value: () => {}
          },
          patientTeam:{
              type: Object,
              value: () => {}
          },
          activeHealthElements:{
              type: Array,
              value: () => []
          },
          inactiveHealthElements:{
              type: Array,
              value: () => []
          },
          telecomType:{
              type: Array,
              value: () => [
                  {code: "home", label: {fr: "Domicile", nl: "Home", en: "Home"}},
                  {code: "work", label: {fr: "Travail", nl: "Work", en: "Work"}},
                  {code: "hospital", label: {fr: "Hopital", nl: "Hospital", en: "Hospital"}},
                  {code: "clinic", label: {fr: "Clinique", nl: "Clinic", en: "Clinic"}},
                  {code: "other", label: {fr: "Autre", nl: "Other", en: "Other"}}
              ]
          },
          addresseType: {
              type: Array,
              value: () => [
                  {code: "mobile", label: {fr: "Portable", nl: "Mobile", en: "Mobile"}},
                  {code: "phone", label: {fr: "Tél", nl: "Phone", en: "Phone"}},
                  {code: "email", label: {fr: "Email", nl: "Email", en: "Email"}},
                  {code: "fax", label: {fr: "Fax", nl: "Fax", en: "Fax"}}
              ]
          }
      };
  }
  static get observers() {
      return ['_hcpFilterChanged(hcpType, hcpFilter)', '_loadHcpTypesTranslations(language)', '_selectedHcpChanged(selectedHcp)', '_initialize(usr, patient)', '_selectedHcpSpecialityChanged(selectedHcpSpeciality)', '_selectedCareProviderChanged(selectedCareProvider)'];
  }
  constructor() {
      super();
  }
  detached() {
      this.flushSave();
  }
  ready() {
      super.ready();
  }
  _initialize(){
      this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', 'fr', 'pers', null, null, 1000).then(specList => {
          this.set('specialityList', specList.rows)
          this._initCurrentCareTeam();
      })
  }
  _showAddPersonToCareTeam() {
      this.$['internalCareTeamDialog'].open()
      this.set('currentHcp', _.values(this.api.hcParties))
  }
  _showAddNewPersonToCareTeamForm() {
      this.$['internalCareTeamDialog'].close()
      this.$['externalCareTeamDialog'].open()
  }
  _initCurrentCareTeam(){
      this.api.patient().getPatientWithUser(this.user, this.patient.id)
          .then(patient => this.api.register(patient, 'patient'))
          .then(patient => Promise.all([patient, _.keys(patient.delegations).length > 0 ? this.api.hcparty().getHealthcareParties(_.keys(patient.delegations).join(',')) : Promise.resolve([])]))
          .then(([patient, listOfInternalHcp]) => Promise.all([listOfInternalHcp, patient.patientHealthCareParties.length > 0 ? this.api.hcparty().getHealthcareParties(patient.patientHealthCareParties.map(hcp => hcp.healthcarePartyId).join(',')) : Promise.resolve([])]))
          .then(([listOfInternalHcp, listOfExternalHcp]) => {
              this.patient.patientHealthCareParties.map(patientHcp => _.assign(_.compact(listOfExternalHcp).find(externHcp => externHcp.id === patientHcp.healthcarePartyId), {referral: patientHcp.referral, referralPeriods: patientHcp.referralPeriods}))
              _.compact(listOfInternalHcp.map(int => listOfExternalHcp.find(ext => ext.id === int.id))).map(h => _.remove(listOfExternalHcp, {id: h.id}))
              this.set('patientTeam', _.assign({internal: listOfInternalHcp}, {external: listOfExternalHcp}))
          })
          .finally(() => {
              this.$['dmg-owner-list'].clearCache()
              this.$['internal-care-team-list'].clearCache()
              this._checkForDmgOwner();
          })
  }
  _checkForDmgOwner(){
      if(this.patient && this.patient.ssin && this.api.tokenId){
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp => this.api.fhc().Dmgcontroller().consultDmgUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName, this.patient.ssin))
              .then(rep => {
                  const dmgNihii = rep.hcParty && rep.hcParty.ids && rep.hcParty.ids.find(id => id.s === 'ID_HCPARTY') ? rep.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value : null
                  if(dmgNihii && this.patientTeam.internal.find(h => h.nihii === dmgNihii)){
                      console.log('dmg owner in internal team')
                  }else if(dmgNihii && this.patientTeam.external.find(h => h.nihii === dmgNihii)){
                      console.log('dmg owner in external team')
                      const dmgOwner = this.patientTeam.external.find(h => h.nihii === dmgNihii)
                      console.log(dmgOwner)
                  }else if(dmgNihii){
                      console.log('dmg owner not yet in patientHcParties')
                      console.log(dmgNihii)
                  }
              })
      }
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
                                  patientHcp.firstName = _.get(hcp, "firstName", null)
                                  patientHcp.lastName = _.get(hcp, "lastName", null)
                                  patientHcp.name = _.get(hcp, "name", null)
                                  patientHcp.nihii = _.get(hcp, "nihii", null)
                                  patientHcp.ssin = _.get(hcp, "ssin", null)
                                  patientHcp.isDmg = _.get(hcp, "referral", false)
                                  patientHcp.speciality = _.get(hcp, "speciality", null)
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
      return _.get(hcp, 'name', null) ? _.get(hcp, 'name', null) : _.get(hcp, 'firstName', null)+" "+_.get(hcp, 'lastName', null)
  }
  formatDate(date){
      return date ? this.api.moment(date).format('DD/MM/YYYY') : null
  }
  getStartDate(item){
      return _.get(item, 'referralPeriods[0].startDate', null) ? this.api.moment(_.get(item, 'referralPeriods[0].startDate', null)).format('DD/MM/YYYY') : null
  }
  getEndDate(item){
      return _.get(item, 'referralPeriods[0].endDate', null) ? this.api.moment(_.get(item, 'referralPeriods[0].endDate', null)).format('DD/MM/YYYY') : null
  }
  _selectedCareProviderChanged(){
      if(this.selectedCareProvider) {
          this.$['htPatAdminTeamDialog']._openDialog()
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
  formatNihiiNumber(nihii) {
      return nihii ? ("" + nihii).replace(/([0-9]{1})([0-9]{5})([0-9]{2})([0-9]{3})/, '$1-$2-$3-$4') : ''
  }
  formatNissNumber(niss) {
      return niss ? ("" + niss).replace(/([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{3})([0-9]{2})/, '$1.$2.$3-$4.$5') : ''
  }
  chckInvite(e){
      if(e.target.checked){
          this.set("newHcpCareTeam.invite", true)
      }else{
          this.set("newHcpCareTeam.invite", false)
      }
  }
  _chckIfReferral(e){
      if(e.target.checked){
          this.set("newHcpCareTeam.isReferral", true)
      }else{
          this.set("newHcpCareTeam.isReferral", false)
      }
  }
  _localizeSpeciality(speciality){
      return this.specialityList.find(spec => spec.id === speciality) && _.get(this.specialityList.find(spec => spec.id === speciality), "code", null) ?
          this.localize('cd-hcp-'+_.get(this.specialityList.find(spec => spec.id === speciality), 'code', null), _.get(this.specialityList.find(spec => spec.id === speciality), 'code', null), this.language)  :
          this.specialityList.find(spec => spec.code === speciality) && _.get(this.specialityList.find(spec => spec.code === speciality), "code", null) ?
              this.localize('cd-hcp-'+_.get(this.specialityList.find(spec => spec.code === speciality), 'code', null), _.get(this.specialityList.find(spec => spec.code === speciality), 'code', null), this.language) :
              this.localize('cd-hcp-'+speciality, speciality, this.language)
  }
  _isEhealthActive(){
      return this.api.tokenId && this.api.keystoreId && this.api.credentials.ehpassword ? true : false
  }
  _hcpFilterChanged(hcpType, hcpFilter) {
      if( _.trim(hcpFilter).length < 3 || !_.get(this,"api.keystoreId",false) || !_.get(this,"api.tokenId",false) || !_.get(this,"api.credentials.ehpassword",false) ) { this.set("filteredHcpList",[]); return; }
      const reqIdx = (this.hcpReqIdx = (this.hcpReqIdx || 0) + 1)
      setTimeout(() => {
          if (reqIdx !== this.hcpReqIdx) return;
          this.set('busySpinner', true)
          const newMsgTo = this.shadowRoot.querySelector('#newHcp')||false;
          const numericSearchQuery = _.trim(_.trim(hcpFilter).replace( /([^\d]*)/gi, '' ))
          const patternsValidation = {
              heightDigits: /^([0-9]){8}$/i,
              tenDigits: /^([0-9]){10}$/i,
              elevenDigits: /^([0-9]){11}$/i
          }
          const isValidNihii = !!patternsValidation.heightDigits.test(numericSearchQuery) || !!patternsValidation.elevenDigits.test(numericSearchQuery)
          const isValidBce = !!patternsValidation.tenDigits.test(numericSearchQuery)
          const isValidEhp = !!patternsValidation.tenDigits.test(numericSearchQuery)
          const isValidSsin = !!patternsValidation.elevenDigits.test(numericSearchQuery)
          let searchProm = hcpType.id === 'CBE' ?
              Promise.all([
                  !isValidBce ? Promise.resolve([]) : this.api.fhc().Addressbookcontroller().getOrgByCbeUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, numericSearchQuery ).then(searchResults=>_.chain([searchResults]).filter(i=>!!_.get(i,'cbe',false)).value()),
                  this.api.fhc().Addressbookcontroller().searchHcpUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, _.trim(hcpFilter) + '*').then(searchResults=>_.chain(searchResults).filter(i=>!!_.get(i,'nihii',false)).uniqBy('nihii').value()),
                  this.api.fhc().Addressbookcontroller().searchOrgUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, _.trim(hcpFilter) + '*').then(searchResults=>_.chain(searchResults).filter(i=>!!_.get(i,'ehp',false)).uniqBy('ehp').value())
              ]) :
              hcpType.id === 'EHP' ? Promise.all([
                      !isValidEhp ? Promise.resolve([]) : this.api.fhc().Addressbookcontroller().getOrgByEhpUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, numericSearchQuery ).then(searchResults=>_.chain([searchResults]).filter(i=>!!_.get(i,'ehp',false)).value()),
                      this.api.fhc().Addressbookcontroller().searchHcpUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, _.trim(hcpFilter) + '*').then(searchResults=>_.chain(searchResults).filter(i=>!!_.get(i,'nihii',false)).uniqBy('nihii').value()),
                      this.api.fhc().Addressbookcontroller().searchOrgUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, _.trim(hcpFilter) + '*').then(searchResults=>_.chain(searchResults).filter(i=>!!_.get(i,'ehp',false)).uniqBy('ehp').value())
                  ]) :
                  hcpType.id === 'INSS' ? Promise.all([
                          !isValidSsin ? Promise.resolve([]) : this.api.fhc().Addressbookcontroller().getHcpBySsinUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, numericSearchQuery ).then(searchResults=>_.chain([searchResults]).filter(i=>!!_.get(i,'nihii',false)).value()),    // Looking for SSIN "53815994527" returns it but WITHOUT SSIN value, quite logical. Filtering on NIHII then
                          this.api.fhc().Addressbookcontroller().searchHcpUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, _.trim(hcpFilter) + '*').then(searchResults=>_.chain(searchResults).filter(i=>!!_.get(i,'nihii',false)).uniqBy('nihii').value())
                      ]) :
                      (hcpType.id === 'NIHII-HOSPITAL' || hcpType.id === 'NIHII-PHARMACY')  ? Promise.all([
                              !isValidNihii ? Promise.resolve([]) : this.api.fhc().Addressbookcontroller().getOrgByNihiiUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, numericSearchQuery ).then(searchResults=>_.chain([searchResults]).filter(i=>!!_.get(i,'nihii',false)).value()),
                              this.api.fhc().Addressbookcontroller().searchOrgUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, _.trim(hcpFilter) + '*', ( hcpType.id === 'NIHII-PHARMACY' ? "PHARMACY" : "HOSPITAL" ) ).then(searchResults=>_.chain(searchResults).filter(i=>!!_.get(i,'ehp',false)).uniqBy('ehp').value())
                          ]) :
                          // Default type = NIHII
                          Promise.all([
                              !isValidNihii ? Promise.resolve([]) : this.api.fhc().Addressbookcontroller().getHcpByNihiiUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, numericSearchQuery ).then(searchResults=>_.chain([searchResults]).filter(i=>!!_.get(i,'nihii',false)).value()),
                              this.api.fhc().Addressbookcontroller().searchHcpUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, _.trim(hcpFilter) + '*').then(searchResults=>_.chain(searchResults).filter(i=>!!_.get(i,'nihii',false)).uniqBy('nihii').value())
                          ])
          searchProm
              .then(searchResults => { if (reqIdx === this.hcpReqIdx) {
                  this.set("filteredHcpList", _
                      .chain(searchResults)
                      .flatMap()
                      .map(singleRecipient => _.assign({displayName : _.compact([
                              _.map( _.trim(_.get(singleRecipient, "lastName", "")).split(" "),i=> _.capitalize(i)).join(" "),
                              _.map( _.trim(_.get(singleRecipient, "firstName", "")).split(" "),i=> _.capitalize(i)).join(" "),
                              ( ( !_.trim(_.get(singleRecipient, "lastName", "")) && !_.trim(_.get(singleRecipient, "firstName", "")) ) ? _.map( _.trim(_.get(singleRecipient, "name", "")).split(" "),i=> _.capitalize(i)).join(" ") : "" ),
                              ( !! _.trim(_.get(singleRecipient, "nihii", "")) ? "(" + this.localize('nihii', 'INAMI', this.language) + ": " + this.api.formatInamiNumber(_.trim(_.get(singleRecipient, "nihii", ""))) + ")" : "" ),
                              ( !! _.trim(_.get(singleRecipient, "ssin", "")) ? "(" + this.localize('ssin', 'Registre national', this.language) + ": " + this.api.formatSsinNumber(_.trim(_.get(singleRecipient, "ssin", ""))) + ")" : "" ),
                              ( !! _.trim(_.get(singleRecipient, "ehp", "")) ? "(EHP: " + _.trim(_.get(singleRecipient, "ehp", "")) + ")" : "" ),
                              ( !! _.trim(_.get(singleRecipient, "cbe", "")) ? "(BCE: " + _.trim(_.get(singleRecipient, "cbe", "")) + ")" : "" )
                          ]).join(" ")},singleRecipient))
                      .orderBy(['displayName','nihii', 'ssin', 'ehp', 'cbe'],['asc','asc','asc','asc','asc'])
                      .value()
                  )
                  console.log(this.filteredHcpList)
              }})
              .catch(e=>{console.log("ERROR with _hcpFilterChanged: ", e);})
              .finally(() => this.set('busySpinner', false))
      }, 300)
  }
  _loadHcpTypesTranslations() {
      let cbe = this.hcpTypes.find(i=>i.id==="CBE")
      let ehp = this.hcpTypes.find(i=>i.id==="EHP")
      let inss = this.hcpTypes.find(i=>i.id==="INSS")
      let nihii = this.hcpTypes.find(i=>i.id==="NIHII")
      let nihiiHospital = this.hcpTypes.find(i=>i.id==="NIHII-HOSPITAL")
      let nihiiPharmacy = this.hcpTypes.find(i=>i.id==="NIHII-PHARMACY")
      cbe.label = this.localize('cbe', 'CBE', this.language) + " / " + this.localize('name', 'Name', this.language)
      ehp.label = "EHP (eHealth Partner) / " + this.localize('name', 'Name', this.language)
      inss.label = this.localize('ssin', 'Registre national', this.language) + " / " + this.localize('name', 'Name', this.language)
      nihii.label = this.localize('nihii', 'INAMI', this.language) + " / " + this.localize('name', 'Name', this.language)
      nihiiHospital.label = this.localize('nihii', 'INAMI', this.language) + " " + this.localize('hospital', 'Hospital', this.language) + " / " + this.localize('name', 'Name', this.language)
      nihiiPharmacy.label = this.localize('nihii', 'INAMI', this.language) + " " + this.localize('pharmacy', 'Pharmacy', this.language) + " / " + this.localize('name', 'Name', this.language)
      this.set("hcpType", nihii)
  }
  _selectedHcpChanged(){
      console.log(this.selectedHcp)
      this.set("newHcpCareTeam", {
          lastName: _.get(this.selectedHcp, "lastName", null),
          firstName :  _.get(this.selectedHcp, "firstName", null),
          nihii :  _.get(this.selectedHcp, "nihii", null),
          ssin :  _.get(this.selectedHcp, "ssin", null),
          speciality:  _.get(this.selectedHcp, "speciality", null),
          civility: _.get(this.selectedHcp, "civility", null),
          cbe: _.get(this.selectedHcp, "cbe", null),
          companyName: _.get(this.selectedHcp, "companyName", null),
          referral: false,
          notes: null,
          referralPeriods: [],
          addresses: _.get(this.selectedHcp, "adresses", []).length > 0 ? _.get(this.selectedHcp, "adresses", []) : [{street: null, houseNumber: null, postalCode: null, city: null}]
      })
  }
  _showInternalTeamSelector(){
      this.$['internalCareTeamDialog'].open()
  }
  _showExternalTeamSelector(){
      this.$['externalCareTeamDialog'].open()
      this.shadowRoot.querySelector('#newHcp')._clear() || false
  }
  _addHcpToInternalTeam(){
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
  _addHcpToExternalTeam(){
      if(_.get(this.newHcpCareTeam, 'invite', false) === true){
          this.api.hcparty().createHealthcareParty({
              name: _.get(this.newHcpCareTeam, 'lastName', null)+" "+_.get(this.newHcpCareTeam, 'firstName', null),
              lastName: _.get(this.newHcpCareTeam, 'lastName', null),
              firstName: _.get(this.newHcpCareTeam, 'firstName', null),
              nihii: _.get(this.newHcpCareTeam, 'nihii', null),
              ssin: _.get(this.newHcpCareTeam, 'ssin', null),
              speciality: _.get(this.newHcpCareTeam, 'speciality.code', null),
              compagyName: _.get(this.newHcpCareTeam, 'compagyName', null),
              notes: _.get(this.newHcpCareTeam, 'notes', null),
              cbe: _.get(this.newHcpCareTeam, 'cbe', null),
              addresses: _.get(this.newHcpCareTeam, 'addresses', null),
              specialityCodes: dept.length > 0 ? dept.map(dept => {
                  return {
                      code: _.get(_.split(dept, '|'), 1, null),
                      type: _.get(_.split(dept, '|'), 0, null),
                      version: _.get(_.split(dept, '|'), 2, null),
                      id: dept
                  }
              }) : null
          })
              .then(hcp => Promise.all([hcp, this.api.user().createUser({
                  healthcarePartyId: hcp.id,
                  name: _.get(this.newHcpCareTeam, 'lastName', null)+" "+_.get(this.newHcpCareTeam, 'firstName', null),
                  email: _.get(this.newHcpCareTeam, 'email', null),
                  applicationTokens: {tmpFirstLogin : this.api.crypto().randomUuid()},
                  status: "ACTIVE",
                  type: "database"
              })]))
              .then(([hcp, usr]) => Promise.all([hcp, usr, this.api.patient().getPatientWithUser(this.user, this.patient.id)]))
              .then(([hcp, usr, patient]) => {
                  const newHcp = {
                      healthcarePartyId : hcp.id,
                      referral: _.get(this.newHcpCareTeam, 'isReferral', false),
                      referralPeriods: [{
                          startDate : _.get(this.newHcpCareTeam, 'referralStartDate', null) != null ? parseInt(moment(_.trim(_.get(this.newHcpCareTeam, "referralStartDate"))).format('YYYYMMDD')) : null,
                          endDate: _.get(this.newHcpCareTeam, 'referralEndDate', null) != null ? parseInt(moment(_.trim(_.get(this.newHcpCareTeam, "referralEndDate"))).format('YYYYMMDD')) : null
                      }]
                  }
                  patient.patientHealthCareParties.push(newHcp)
                  this.patientTeam.external.push(_.assign(hcp, newHcp))
                  return Promise.all([usr, this.api.patient().modifyPatientWithUser(this.user, patient)])
              })
              .then(([usr, patient]) => Promise.all([usr, this.api.register(patient, 'patient')]))
              .then(([usr, patient]) => {
                  this.$['externalCareTeamDialog'].close()
                  this.$['ht-invite-hcp-link'].open()
                  this.invitedHcpLink = window.location.origin + window.location.pathname + '/?userId=' + usr.id + '&token=' + usr.applicationTokens.tmpFirstLogin
              }).finally(() => {
              this.$['dmg-owner-list'].clearCache()
              this.$['externalCareTeamDialog'].close()
              this.set('newHcpCareTeam', {})
              this.shadowRoot.querySelector('#newHcp')._clear() || false
              this.shadowRoot.querySelector('#type-To')._clear() || false
              this.shadowRoot.querySelector('#hcpSpeciality')._clear() || false
          })
              .catch(e => console.log("Error: "+e))
      }else{
          this.api.hcparty().createHealthcareParty({
              name: _.get(this.newHcpCareTeam, 'lastName', null)+" "+_.get(this.newHcpCareTeam, 'firstName', null),
              lastName: _.get(this.newHcpCareTeam, 'lastName', null),
              firstName: _.get(this.newHcpCareTeam, 'firstName', null),
              nihii: _.get(this.newHcpCareTeam, 'nihii', null),
              ssin: _.get(this.newHcpCareTeam, 'ssin', null),
              companyName: _.get(this.newHcpCareTeam, 'companyName', null),
              notes: _.get(this.newHcpCareTeam, 'notes', null),
              cbe: _.get(this.newHcpCareTeam, 'cbe', null),
              speciality: _.get(this.newHcpCareTeam, 'speciality.code', null),
              addresses: _.get(this.newHcpCareTeam, 'addresses', null),
              specialityCodes: _.get(this.newHcpCareTeam, 'speciality.links', []).length ? _.get(this.newHcpCareTeam, 'speciality.links', []).map(dept => {
                  return {
                      code: _.get(_.split(dept, '|'), 1, null),
                      type: _.get(_.split(dept, '|'), 0, null),
                      version: _.get(_.split(dept, '|'), 2, null),
                      id: dept
                  }
              }) : null
          })
              .then(hcp => Promise.all([hcp, this.api.patient().getPatientWithUser(this.user, this.patient.id)])
                  .then(([hcp, patient]) => {
                      const newHcp = {
                          healthcarePartyId : hcp.id,
                          referral: _.get(this.newHcpCareTeam, 'isReferral', false),
                          referralPeriods: [{
                              startDate : _.get(this.newHcpCareTeam, 'referralStartDate', null) != null ? parseInt(moment(_.trim(_.get(this.newHcpCareTeam, "referralStartDate"))).format('YYYYMMDD')) : null,
                              endDate: _.get(this.newHcpCareTeam, 'referralEndDate', null) != null ? parseInt(moment(_.trim(_.get(this.newHcpCareTeam, "referralEndDate"))).format('YYYYMMDD')) : null
                          }]
                      }
                      patient.patientHealthCareParties.push(newHcp)
                      this.patientTeam.external.push(_.assign(hcp, newHcp))
                      return patient
                  }))
              .then(patient => this.api.patient().modifyPatientWithUser(this.user, patient))
              .then(patient => this.api.register(patient, 'patient'))
              .finally(() => {
                  this.$['dmg-owner-list'].clearCache()
                  this.set('newHcpCareTeam', {})
                  this.shadowRoot.querySelector('#hcpSpeciality')._clear() || false
              }).catch(e => console.log("Error: "+e))
      }
  }
  _isReferral(item){
      return _.get(item, 'referral', false)
  }
  _selectedHcpSpecialityChanged(){
      this.set('newHcpCareTeam.speciality', _.get(this, "selectedHcpSpeciality", {}))
  }

  _refreshGrid(){
      this._initCurrentCareTeam()
      this.$['dmg-owner-list'].clearCache()
      this.$['internal-care-team-list'].clearCache()
  }
}
customElements.define(HtPatAdminTeam.is, HtPatAdminTeam);
