import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../dynamic-form/dynamic-doc.js';
import '../../../collapse-button/collapse-button.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/scrollbar-style.js';
import '../../../../styles/paper-tabs-style.js';
import * as models from 'icc-api/dist/icc-api/model/models';
import moment from 'moment/src/moment';

import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatConsentDetail extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style paper-tabs-style">
            #consentDetailDialog{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 64px;
            }

            .title{
                height: 30px;
                width: auto;
                font-size: 20px;
            }

            .content{
                display: flex;
                height: calc(98% - 140px);
                width: auto;
                margin: 1%;
            }

            .consentDocumentsList{
                display: flex;
                height: 100%;
                width: 50%;
                border: 1px solid #c5c5c5;
                border-top: 4px solid var(--app-secondary-color-dark);
                margin-right: 1%;
            }

            .consentDocumentsList2{
                height: 100%;
                width: 30%;
                border: 1px solid #c5c5c5;
                border-top: 4px solid var(--app-secondary-color-dark);
                margin-right: 1%;
                overflow: auto;
            }

            .consentDocumentViewer{
                display: flex;
                height: 100%;
                width: 70%;
                border: 1px solid #c5c5c5;
                border-top: 4px solid var(--app-secondary-color-dark);
            }

            #transaction-list{
                height: 100%;
                width: 100%;
                max-height: 100%;
                overflow: auto;
            }

            #htPatHubTransactionViewer{
                height: 98%;
                width: 100%;
                max-height: 100%;
            }

            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 -30px;
                padding:0;
                border-radius:0 0 2px 2px;
            }

            collapse-buton{
                --iron-collapse: {
                    padding-left: 0px !important;
                };

            }

            ht-spinner {
                height: 42px;
                width: 42px;
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }

            .documentListContent{
                margin: 1%;
                width: auto;
            }

            .modal-title {
                background: var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
            }

            .buttons{
                position: absolute;
                right: 0;
                bottom: 0;
                margin: 0;
            }


            .menu-item {
                @apply --padding-menu-item;
                height: 24px;
                min-height: 24px;
                font-size: var(--font-size-normal);
                text-transform: inherit;
                justify-content: space-between;
                cursor: pointer;
                @apply --transition;
            }

            .sublist .menu-item {
                font-size: var(--font-size-normal);
                min-height:20px;
                height:20px;
            }

            .menu-item:hover{
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .menu-item .iron-selected{
                background:var(--app-primary-color);

            }

            .list-title {
                flex-basis: calc(100% - 72px);
                font-weight: bold;
            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
            }

            .consentDetailDialog{
                display: flex;
                height: calc(100% - 45px);;
                width: auto;
                margin: 0;
                padding: 0;
            }

            .consent-menu-list{
                height: 100%;
                width: 30%;
                background-color: var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
                overflow: auto;
                position: relative;
            }

            .consent-menu-view{
                height: 100%;
                width: 70%;
                position: relative;
                background: white;
            }

            .consent-menu-list-header{
                height: 48px;
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

            .consent-menu-list-header-img{
                height: 40px;
                width: 40px;
                background-color: transparent;
                margin: 4px;
                float: left;
            }

            .consent-menu-list-header-info{
                margin-left: 12px;
                display: flex;
                align-items: center;
            }

            .consent-menu-list-header-img img{
                width: 100%;
                height: 100%;
            }

            .consent-name{
                font-size: var(--font-size-large);
                font-weight: 700;
            }

            .menu-item-icon{
                height: 20px;
                width: 20px;
                padding: 0px;
            }

            collapse-button[opened] .menu-item-icon{
                transform: scaleY(-1);
            }

            .bold {
                font-weight: bold;
            }

            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 -30px;
                padding:0;
            }

            .table-line-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                width: 100%;
            }

            .table-line-menu-top{
                padding-left: var(--padding-menu-item_-_padding-left);
                padding-right: var(--padding-menu-item_-_padding-right);
                box-sizing: border-box;
            }

            .table-line-menu div:not(:last-child){
                border-right: 1px solid var(--app-background-color-dark);
                height: 20px;
                line-height: 20px;
            }

            .table-line-menu .date{
                width: 20%;
                padding-right: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .table-line-menu .auth{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 74%
            }

            .table-line-menu .pat{
                width: 4%;
                padding-right: 4px;
                padding-left: 4px;
            }

            .table-line-menu .dateTit{
                width: 20%;
                padding-right: 10px;
            }


            .table-line-menu .authTit{
                padding-left:4px;
                padding-right:4px;
                width: 74%;
            }

            .table-line-menu .patTit{
                width: 4%;
                padding-left: 4px;
                padding-right: 4px;
                text-align: center;
            }

            .never::after{
                background-color: var(--app-status-color-nok)
            }

            .yes::after{
                background-color: var(--app-status-color-ok)
            }

            .no::after{
                background-color: var(--app-status-color-pending)
            }

            .consent-access{
                height: 16px;
                width: 16px;
                position: relative;
                color: var(--app-text-color);
            }

            .consent-access::after{
                position: absolute;
                display: block;
                content: '';
                right: -5px;
                top: 50%;
                transform: translateY(-50%);
                height: 6px;
                width: 6px;
                border-radius: 50%;
            }

            .consent{
                text-transform: uppercase;
            }

            .tabIcon{
                padding-right: 10px;
                height: 14px;
                width: 14px;
            }

            .headerInfoLine{
                width: 100%;
                padding: 4px;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: flex-start;
            }
            .headerInfoField{
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                align-items: center;
                align-content: stretch;
                width: calc(100% / 2);
                padding: 0 8px;
                box-sizing: border-box;
            }
            .headerLabel{
                font-weight: bold;
            }
            .consent-result-container{
                margin-bottom: 12px;
                border: 1px solid var(--app-background-color-dark);
            }
            .headerMasterTitle{
                font-size: var(--font-size-large);
                background: var(--app-background-color-dark);
                padding: 0 12px;
                box-sizing: border-box;
            }
            .consent-sub-container{
                height: auto;
                width: auto;
                margin: 10px;
                border: 1px solid var(--app-background-color-dark);
            }
            .consent-person-container{
                height: auto;
                width: auto;
            }

            .consent-error-container{
                height: auto;
                width: auto;
                color: var(--app-status-color-nok);
                font-weight: bold;
            }
            .m5{
                margin: 5px;
            }

            .items-number{
                font-size: var(--font-size-small);
                padding: 2px;
                border-radius: 50%;
                height: 14px;
                width: 14px;
                background: var(--app-background-color-light);
                color: var(--app-text-color);
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                text-align: center;
                float: right;
                margin: 2px;
            }

            .capitalize{
                text-transform: capitalize;
            }

            .w100{
                width: 99%;
            }

            .lt-error-container{
                height: auto;
                width: auto;
                color: var(--app-status-color-nok);
                font-weight: bold;
            }
            .lt-success-container{
                height: auto;
                width: auto;
                color: var(--app-status-color-ok);
                font-weight: bold;
            }

            #readEidInfoDialog{
                height: 300px;
                width: 400px;
            }

            .content-line{
                height: 20px;
            }

            .eid-content-dialog{
                height: 100%;
                position: relative;
                margin: 0px;
                background: white;
            }

            .eid-title{
                heigth: 20px;
                width: auto;
                padding: 4px;
                background-color: var(--app-background-color-dark);
            }

            .legaltextCS{
                padding: 10px;
            }

        </style>

        <paper-dialog id="consentDetailDialog" opened="{{opened}}">
            <div class="consentDetailDialog">
                <div class="consent-menu-list">
                    <div class="consent-menu-list-header">
                        <div class="consent-menu-list-header-info">
                            <div class="consent-name">
                                [[localize('cs-consent','Consent',language)]]
                            </div>
                        </div>
                    </div>
                    <div class="consent-submenu-container">
                        <template is="dom-if" if="[[_isConsent(consentList, consentList.*)]]">
                            <template is="dom-repeat" items="[[_getConsentMasterType(consentList, consentList.*)]]" as="csType">
                                <collapse-button id="[[csType]]" opened="">
                                    <paper-item id="account" slot="sublist-collapse-item" class="menu-trigger menu-item bold" on-tap="toggleMenu" elevation="">
                                        <div class="one-line-menu list-title account-line">
                                            <div>
                                                <span class="force-left force-ellipsis box-txt bold capitalize">[[csType]]</span>
                                            </div>
                                        </div>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                                    </paper-item>
                                    <paper-listbox id="" class="menu-content sublist" selectable="paper-item" toggle-shift="">
                                        <div class="table-line-menu table-line-menu-top">
                                            <div class="dateTit">[[localize('cs-start-date','Start date',language)]]</div>
                                            <div class="dateTit">[[localize('cs-end-date','End date',language)]]</div>
                                            <div class="authTit">[[localize('aut','Author',language)]]</div>
                                            <div class="patTit"></div>
                                        </div>
                                        <template is="dom-repeat" items="[[_getConsentByType(consentList, csType, consentList.*)]]">
                                            <collapse-button>
                                                <paper-item slot="sublist-collapse-item" id\$="[[item]]" data-item\$="[[item]]" aria-selected="[[selected]]" class\$="menu-trigger menu-item [[isIronSelected(selected)]]" on-tap="_showInformation">
                                                    <div id="subMenu" class="table-line-menu">
                                                        <div class="date">[[_getDate(item.signdate)]]</div>
                                                        <div class="date">[[_getDate(item.revokedate)]]</div>
                                                        <div class="auth">[[_getAuthor(item)]]</div>
                                                        <div class="pat">
                                                            <iron-icon icon="vaadin:male" class\$="consent-access [[_consentAccessIcon(item.revokedate)]]"></iron-icon>
                                                        </div>
                                                    </div>
                                                </paper-item>
                                            </collapse-button>
                                        </template>
                                    </paper-listbox>
                                </collapse-button>
                            </template>
                        </template>
                    </div>
                    <ht-spinner active="[[isLoading]]"></ht-spinner>
                </div>
                <div class="consent-menu-view">
                    <paper-tabs selected="{{tabs}}">
                        <paper-tab>
                            <iron-icon class="tabIcon" icon="vaadin:info-circle-o"></iron-icon> [[localize('cs-info','Info',language)]]
                        </paper-tab>
                        <template is="dom-if" if="[[!_isRegisterAvailable(consentList, consentList.*, hcp)]]">
                            <paper-tab>
                                <iron-icon class="tabIcon" icon="vaadin:plus-circle-o"></iron-icon> [[localize('cs-crea','Creation',language)]]
                            </paper-tab>
                        </template>
                    </paper-tabs>
                    <iron-pages selected="[[tabs]]">
                        <page>
                            <ht-spinner active="[[isLoading]]"></ht-spinner>
                            <template is="dom-if" if="[[_isSelectedConsent(selectedConsent)]]">
                                <div class="consent-result-container m5">
                                    <div class="headerMasterTitle headerLabel h25">[[_getTherlinkType(selectedConsent)]]</div>
                                    <div class="consent-sub-container">
                                        <div class="consent-person-container">
                                            <div class="headerMasterTitle headerLabel">[[localize('cs-hcp-info','Hcp information',language)]]</div>
                                            <div class="headerInfoLine">
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-firstName', 'Firstname', language)]]: </span> [[_getHcpFirstName(selectedConsent)]]
                                                </div>
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-lastName', 'Lastname', language)]]: </span> [[_getHcpLastName(selectedConsent)]]
                                                </div>
                                            </div>
                                            <div class="headerInfoLine">
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-nihii', 'Nihii', language)]]: </span> [[_getHcpNihii(selectedConsent)]]
                                                </div>
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-inss', 'Inss', language)]]: </span> [[_getHcpNiss(selectedConsent)]]
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="consent-sub-container">
                                        <div class="consent-person-container">
                                            <div class="headerMasterTitle headerLabel">[[localize('cs-pat-info','Patient info',language)]]</div>
                                            <div class="headerInfoLine">
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-firstName', 'Firstname', language)]]: </span> [[selectedConsent.patient.firstName]]
                                                </div>
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-lastName', 'Lastname', language)]]: </span> [[selectedConsent.patient.lastName]]
                                                </div>
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-inss', 'Inss', language)]]: </span> [[_getPatientInss(selectedConsent)]]
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="consent-sub-container">
                                        <div class="consent-person-container">
                                            <div class="headerMasterTitle headerLabel">[[localize('cs-cs-info','Consent info',language)]]</div>
                                            <div class="headerInfoLine">
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-start-date-lg', 'Start date', language)]]: </span> [[_getDate(selectedConsent.signdate)]]
                                                </div>
                                                <div class="headerInfoField">
                                                    <span class="headerLabel">[[localize('cs-end-date-lg', 'End date', language)]]: </span> [[_getDate(selectedConsent.revokedate)]]
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </page>
                        <page>
                            <ht-spinner active="[[isLoading]]"></ht-spinner>
                            <div class="legaltextCS">
                                Merci de donner à votre patient les informations suivantes : <ul><li>Je consens à faciliter l'échange de mes données médicales par voie électronique, dans le cadre de la prise en charge de ma santé. </li><li>Vous avez donné votre accord pour l'échange (par voie électronique et dans le cadre de la prise en charge de votre santé) de données relatives à votre santé entre les prestataires de soins autorisés (un lien thérapeutique avéré existe entre votre personne et ce prestataire et vous n'avez enregistré aucune exclusion envers ce prestataire). </li><li>Afin de permettre cet échange électronique, vous êtes également d'accord pour que ces données de santé soient référencées au sein d'un répertoire indiquant où ces données sont disponibles (par exemple au sein de quel hôpital). </li><li>Pour rappel, cette disposition respecte les droits des patients, la loi relative à la vie privée et la déontologie médicale. </li></ul>
                            </div>
                            <div class="m5">
                                <paper-icon-button icon="vaadin:health-card" id="read-eid" class="eid" on-tap="_readEid"></paper-icon-button>
                                <vaadin-combo-box id="consentType" class="w100" label="[[localize('cs-type', 'Therapeutic link type', language)]]" filter="{{consentFilter}}" selected-item="{{selectedConsentType}}" filtered-items="[[availableConsentType]]" item-label-path="label.fr">
                                    <template>[[_getLabel(item.label)]]</template>
                                </vaadin-combo-box>
                                <paper-input id="idCardNo" always-float-label="" label="[[localize('eid_no','eID Card Number',language)]]" value="{{eidCardNumber}}"></paper-input>
                                <paper-input id="isiCardNo" always-float-label="" label="[[localize('isi_no','ISI+ Card Number',language)]]" value="{{isiCardNumber}}"></paper-input>
                            </div>

                            <template is="dom-if" if="[[_isReturnErrorStatus(consentResponseError, consentResponseError.*)]]">
                                <div class="lt-error-container m5">
                                    <div>[[localize('cs-error-code', 'Error code', language)]]: </div>
                                    <template is="dom-repeat" items="[[consentResponseError]]">
                                        <div>[[item.code]] [[_getError(item)]]</div>
                                    </template>
                                </div>
                            </template>

                            <template is="dom-if" if="[[_isErrorList(errorList, errorList.*)]]">
                                <div class="lt-error-container m5">
                                    <div>[[localize('cs-error-code', 'Error code', language)]]: </div>
                                    <template is="dom-repeat" items="[[errorList]]">
                                        <div>[[_localizeError(item)]]</div>
                                    </template>
                                </div>
                            </template>
                        </page>
                    </iron-pages>
                </div>
                <div class="buttons">
                    <paper-button class="button" on-tap="_closeDialogs"><iron-icon icon="icons:close" class="mr5 smallIcon"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <template is="dom-if" if="[[_isRevokeAvailable(selectedConsent, tabs)]]">
                        <paper-button class="button button--other" on-tap="_revokeEidDialog"><iron-icon icon="vaadin:close-circle-o" class="mr5 smallIcon"></iron-icon> [[localize('cs-revoke','Revoke',language)]]</paper-button>
                    </template>
                    <template is="dom-if" if="[[_isRegisterTab(tabs)]]">
                        <paper-button class="button button--other" on-tap="_registerConsent"><iron-icon icon="vaadin:plus-circle-o" class="mr5 smallIcon"></iron-icon> [[localize('cs-add','Add',language)]]</paper-button>
                    </template>
                    <template is="dom-if" if="[[!_isRegisterTab(tabs)]]">
                        <paper-button class="button button--other" on-tap="_refreshConsentList"><iron-icon icon="icons:refresh" class="mr5 smallIcon"></iron-icon> [[localize('refresh','Refresh',language)]]</paper-button>
                    </template>
                </div>
            </div>

        </paper-dialog>

        <paper-dialog id="readEidInfoDialog">
            <div class="eid-content-dialog">
                <div class="eid-title">
                    Introduction des données EID / ISI +
                    <paper-icon-button icon="vaadin:health-card" id="read-eid" class="eid" on-tap="_readEid"></paper-icon-button>
                </div>
                <div class="content-dialog">
                    <paper-input id="idCardNo" always-float-label="" label="[[localize('eid_no','eID Card Number',language)]]" value="{{eidCardNumber}}"></paper-input>
                    <paper-input id="isiCardNo" always-float-label="" label="[[localize('isi_no','ISI+ Card Number',language)]]" value="{{isiCardNumber}}"></paper-input>
                </div>
                <div class="buttons">
                    <paper-button class="button" on-tap="_closeEidDialog"><iron-icon icon="icons:close" class="mr5 smallIcon"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_revoke"><iron-icon icon="vaadin:close-circle-o" class="mr5 smallIcon"></iron-icon> [[localize('cs-revoke','Revoke',language)]]</paper-button>
                </div>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-consent-detail';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              value: null
          },
          user: {
              type: Object,
              value: null
          },
          language: {
              type: String
          },
          opened: {
              type: Boolean,
              value: false
          },
          patient:{
              type: Object
          },
          tabs: {
              type:  Number,
              value: 0
          },
          isLoading:{
              type: Boolean,
              value: false
          },
          consentList:{
              type: Array,
              value: () => []
          },
          selectedConsent:{
              type: Object,
              value: () => {}
          },
          hcp:{
              type: Object,
              value: () => {}
          },
          hubEndPoint:{
              type: String,
              value: null
          },
          hubSupportsConsent:{
              type: Boolean,
              value: true
          },
          eidCardNumber:{
              type: String,
              value: null
          },
          isiCardNumber:{
              type: String,
              value: null
          },
          hcpZip:{
              type: String,
              value: null
          },
          hubPackageId:{
              type: String,
              value: null
          },
          consentType:{
              type: Array,
              value: () => [
                  {type: "national", label: {fr: "Consentement national", en: "National consent", nl: ""}},
                  {type: "hub", label: {fr: "Consentement hub", en: "Hub consent", nl: ""}}
              ]
          },
          availableConsentType:{
              type: Array,
              value: () => []
          },
          selectedConsentType:{
              type: Object,
              value: () => {}
          },
          isNotificationSuccess:{
              type: Boolean,
              value: false
          },
          consentResponseError:{
              type: Object,
              value: () => {}
          },
          errorList:{
              type: Array,
              value: []
          }
      };
  }

  static get observers() {
      return [];
  }

  ready() {
      super.ready();
  }

  _open(){
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
          .then(hcp => {
              this.set('hcp', hcp)
              this.set('hcpZip', _.get(_.get(this.hcp, 'addresses', []).find(adr => _.get(adr, 'addressType', null) === "work"), "postalCode", null))
          })
          .then(() => Promise.all([
              this.api.fhc().Consentcontroller().getPatientConsentUsingGET(_.get(this.api, 'keystoreId', null), _.get(this.api, 'tokenId', null), _.get(this.api, 'credentials.ehpassword', null), _.get(this.hcp, 'nihii', null), _.get(this.hcp, 'ssin', null), _.get(this.hcp, 'firstName', null), _.get(this.hcp, 'lastName', null), _.get(this.patient, 'ssin', null), _.get(this.patient, 'firstName', null), _.get(this.patient, 'lastName', null)),
              this.hubSupportsConsent ? this.api.fhc().Hubcontroller().getPatientConsentUsingGET1(this.hubEndPoint, _.get(this.api, "keystoreId", null), _.get(this.api, "tokenId", null), _.get(this.api, "credentials.ehpassword", null), _.get(this.hcp, "lastName", null), _.get(this.hcp, "firstName", null), _.get(this.hcp, "nihii", null), _.get(this.hcp, "ssin", null), _.get(this, 'hcpZip', null), _.get(this.patient, "ssin", null)) : null
          ]))
          .then(([nationalResp, hubResp]) => {
              console.log(nationalResp)
              console.log(hubResp)
              this.set('currentConsent', {nationalResp: nationalResp, hubResp: hubResp})
              this.set('consentList', _.compact(_.concat(!_.isEmpty(_.get(this, 'currentConsent.hubResp', {})) ? _.assign(_.get(this, 'currentConsent.hubResp', {}), {csType: "hub"}) : null, !_.isEmpty(_.get(this, 'currentConsent.nationalResp.consent', {})) ? _.assign(_.get(this, 'currentConsent.nationalResp.consent'), {csType: "national"}) : null)))
          })
          .finally(() => {
              if(this.hubSupportsConsent){
                  this.set('consentType',  [
                      {type: "national", label: {fr: "Consentement national", en: "National consent", nl: ""}},
                      {type: "hub", label: {fr: "Consentement hub", en: "Hub consent", nl: ""}}
                  ]);
              }else{
                  this.set('consentType',  [
                      {type: "national", label: {fr: "Consentement national", en: "National consent", nl: ""}},
                  ]);
              }

              this.set('eidCardNumber', null)
              this.set('isiCardNumber', null)
              this.set('isNotificationSuccess', false)
              this.set('errorList', [])
              this.set('availableConsentType', _.get(this, 'consentType', []).filter(csType => !this.consentList.find(csl => csl.csType === csType.type)))
              this.set('selectedConsentType', _.head(_.get(this, 'availableConsentType', [])))
              this.$['consentDetailDialog'].open();
          })
  }

  _refreshConsentList(){
      Promise.all([
          this.api.fhc().Consentcontroller().getPatientConsentUsingGET(_.get(this.api, 'keystoreId', null), _.get(this.api, 'tokenId', null), _.get(this.api, 'credentials.ehpassword', null), _.get(this.hcp, 'nihii', null), _.get(this.hcp, 'ssin', null), _.get(this.hcp, 'firstName', null), _.get(this.hcp, 'lastName', null), _.get(this.patient, 'ssin', null), _.get(this.patient, 'firstName', null), _.get(this.patient, 'lastName', null)),
          this.api.fhc().Hubcontroller().getPatientConsentUsingGET1(this.hubEndPoint, _.get(this.api, "keystoreId", null), _.get(this.api, "tokenId", null), _.get(this.api, "credentials.ehpassword", null), _.get(this.hcp, "lastName", null), _.get(this.hcp, "firstName", null), _.get(this.hcp, "nihii", null), _.get(this.hcp, "ssin", null), _.get(this, 'hcpZip', null), _.get(this.patient, "ssin", null))
      ])
      .then(([nationalResp, hubResp]) => {
          console.log(nationalResp)
          console.log(hubResp)
          this.set('currentConsent', {nationalResp: nationalResp, hubResp: hubResp})
          this.set('consentList', _.compact(_.concat(!_.isEmpty(_.get(this, 'currentConsent.hubResp', {})) ? _.assign(_.get(this, 'currentConsent.hubResp', {}), {csType: "hub"}) : null, !_.isEmpty(_.get(this, 'currentConsent.nationalResp.consent', {})) ? _.assign(_.get(this, 'currentConsent.nationalResp.consent'), {csType: "national"}) : null)))
          this.set('selectedConsentType', _.head(_.get(this, 'availableConsentType', [])))
          this.set('availableConsentType', _.get(this, 'consentType').filter(csType => !this.consentList.find(csl => csl.csType === csType.type)))
          this.set('tabs', 0)
      }).finally(() => {
          this.set("isLoading",false)
      })
  }

  _closeDialogs(){
      this.$['consentDetailDialog'].close();
  }


  _getAuthor(item){
      return _.get(_.head(_.get(item, 'author.hcparties', [])), 'firstname', null)+" "+_.get(_.head(_.get(item, 'author.hcparties', [])), 'familyname', null)
  }


  _showInformation(e){
      if(e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.item){
          const selected = JSON.parse(e.currentTarget.dataset.item)
          this.set('selectedConsent', selected);
          this.set('tabs', 0)
      }
  }

  formatNissNumber(niss) {
      return niss ? ("" + niss).replace(/([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{3})([0-9]{2})/, '$1.$2.$3-$4.$5') : ''
  }

  _isRevokeAvailable(){
      return (!_.isEmpty(_.get(this, 'selectedConsent', {})) && (_.get(this, 'tabs', null) === 0))
  }

  _readEid(){
      this.dispatchEvent(new CustomEvent('read-eid',{detail: {}, bubbles:true, composed:true}))
  }

  _isRegisterTab(tab){
      return tab === 1
  }

  _isRegisterAvailable(){
      return this.hubSupportsConsent ? ( !!_.get(this, 'consentList', []).find(cs => cs.csType === 'hub') && !!_.get(this, 'consentList', []).find(cs => cs.csType === 'national'))
          : (!!_.get(this, 'consentList', []).find(cs => cs.csType === 'national'))
  }

  cleanNumberSequence(niss){
      return niss && niss.replace(/ /g, "").replace(/-/g,"").replace(/\./g,"").replace(/_/g,"").replace(/\//g,"")
  }

  _getLabel(label){
      return _.get(label, this.language, label.en)
  }

  _isReturnErrorStatus(error){
      return _.size(error) > 0
  }

  _getError(error){
      return _.get(error, 'description.value', null) ? _.get(error, 'description.value', null) :  _.get(error, 'descr', null)
  }

  _localizeError(error){
      return this.localize(_.get(error, 'code', null), _.get(error, 'label', null) , this.language)
  }

  _isErrorList(){
      return _.get(this, 'errorList', []).length > 0
  }

  _isConsent(){
      return _.get(this, 'consentList', []).length
  }

  _getConsentMasterType(){
      return  _.uniq(_.compact(_.get(this, 'consentList', []).map(type => _.get(type, 'csType', null))))
  }

  _getConsentByType(consents, type){
      return consents && consents.filter(c => c.csType === type) || []
  }

  _getDate(date){
      return date ? this.api.moment(date).format("DD/MM/YYYY") : null
  }

  _getTypeShort(item){
      return this.localize('cs-'+_.get(item, 'type', null)+'-short', _.get(item, 'type', null), this.language)
  }

  _getType(item){
      return this.localize('cs-'+_.get(item, 'type', null), _.get(item, 'type', null), this.language)
  }

  _consentAccessIcon(endDate){
      return endDate ? moment().isBetween(this.api.moment(endDate).subtract(2, 'months'), this.api.moment(endDate)) ? "no" :
          moment().isBefore(this.api.moment(endDate)) ? "yes" :
              "never" : "yes"
  }

  _isSelectedConsent(){
      return !_.isEmpty(_.get(this, 'selectedConsent', {}))
  }

  _getHcpFirstName(item){
      return _.get(_.head(_.get(item, 'author.hcparties', [])), 'firstname', null)
  }

  _getHcpLastName(item){
      return _.get(_.head(_.get(item, 'author.hcparties', [])), 'familyname', null)
  }

  _getHcpNiss(item){
      return _.get(_.get(_.head(_.get(item, 'author.hcparties', [])), 'ids', null).find(id => _.get(id, 's', null) === "INSS"), "value", null)
  }

  _getHcpNihii(item){
      return _.get(_.get(_.head(_.get(item, 'author.hcparties', [])), 'ids', null).find(id => _.get(id, 's', null) === "ID-HCPARTY"), "value", null) ? this.formatNissNumber(_.get(_.get(_.head(_.get(item, 'author.hcparties', [])), 'ids', null).find(id => _.get(id, 's', null) === "ID-HCPARTY"), "value", null)) : null
  }

  _getPatientInss(item){
      return _.get(_.get(item, 'patient.ids', []).find(id => _.get(id, "s", null) === "INSS"), 'value', null) ? this.formatNissNumber(_.get(_.get(item, 'patient.ids', []).find(id => _.get(id, "s", null) === "INSS"), 'value', null)) : null
  }

  _revokeEidDialog(){
      this.set('eidCardNumber', null)
      this.set('isiCardNumber', null)
      _.get(this.patient, 'dateOfBirth', null) && moment().diff(moment(_.get(this.patient, 'dateOfBirth', null), "YYYYMMDD"), 'months', true) > 3 ? this.$['readEidInfoDialog'].open() : this._revoke()
  }

  _closeEidDialog(){
      this.set('eidCardNumber', null)
      this.set('isiCardNumber', null)
      this.$['readEidInfoDialog'].close()
  }

  _revoke(){
      this.set('errorList', [])
      this.set("isLoading",true)
      _.get(this.selectedConsent, 'csType', null) === "national" ? this._revokeNationalConsent() : this._revokeHubConsent()
  }

  _revokeHubConsent(){
      this.set("isLoading",true)
      this._verifData(["keystoreId", "keystorePassword", "token", "hcpNihii", "hcpSsin", "hcpFirstName", "hcpLastName", "patientInss"]) ?
          this.api.fhc().Hubcontroller().revokePatientConsentUsingDELETE(_.get(this, "hubEndPoint", null), _.get(this.api, "keystoreId", null), _.get(this.api, "tokenId", null), _.get(this.api, "credentials.ehpassword", null), _.get(this.hcp, "lastName", null), _.get(this.hcp, "firstName", null), _.get(this.hcp, "nihii", null), _.get(this.hcp, "ssin", null), this.hcpZip, this.cleanNumberSequence(_.get(this.patient, "ssin", null)))
          .then(revokeResp => {
              console.log(revokeResp)
              if(!_.isEmpty(revokeResp) && (_.get(revokeResp, "acknowledge.isComplete", false) === true)){
                  this._closeEidDialog()
                  this.set("isLoading",false)
                  this._refreshConsentList()
                  this.set('tabs', 0)
                  this.dispatchEvent(new CustomEvent('refresh-consent',{detail: {}, bubbles:true, composed:true}))
              }
          })
          .finally(() => {
              this.$['readEidInfoDialog'].close()
              this.set("isLoading",false)
          }) : this.set("isLoading",false)
  }

  _revokeNationalConsent(){
      this._verifData(["keystoreId", "keystorePassword", "token", "hcpNihii", "hcpSsin", "hcpFirstName", "hcpLastName", "patientInss", "patientFirstName", "patientLastName", "eidCardNumber"]) ?
          this.api.fhc().Consentcontroller().getPatientConsentUsingGET(_.get(this.api, 'keystoreId', null), _.get(this.api, 'tokenId', null), _.get(this.api, 'credentials.ehpassword', null), _.get(this.hcp, 'nihii', null), _.get(this.hcp, 'ssin', null), _.get(this.hcp, 'firstName', null), _.get(this.hcp, 'lastName', null), _.get(this.patient, 'ssin', null), _.get(this.patient, 'firstName', null), _.get(this.patient, 'lastName', null))
          .then(consent => !_.isEmpty(consent) ? this.api.fhc().Consentcontroller().revokePatientConsentUsingPOST(_.get(this.api, "keystoreId", null), _.get(this.api, "tokenId", null), _.get(this.api, "credentials.ehpassword", null), _.get(this.hcp, "nihii", null), _.get(this.hcp, "ssin", null), _.get(this.hcp, "firstName", null), _.get(this.hcp, "lastName", null), _.get(consent, 'consent', {}), _.get(this, "eidCardNumber", null), _.get(this, "isiCardNumber", null)): Promise.resolve({}))
          .then(revokeResp => {
              console.log(revokeResp)
              this._refreshConsentList()
              this.set('tabs', 0)
              this.dispatchEvent(new CustomEvent('refresh-consent',{detail: {}, bubbles:true, composed:true}))
          })
          .finally(() =>{
              this.$['readEidInfoDialog'].close()
              this.set("isLoading",false)
          }) : this.set("isLoading",false)
  }

  _registerConsent(){
      this.set('errorList', [])
      this.set("isLoading",true)
      _.get(this.selectedConsentType, 'type', null) === "national" ? this._registerNationalConsent() : this._registerHubConsent()
  }

  _registerHubConsent(){
      this._verifData(["keystoreId", "keystorePassword", "token", "hcpNihii", "hcpSsin", "hcpFirstName", "hcpLastName", "patientInss", "patientFirstName", "patientLastName", "eidCardNumber", "dateOfBirth", "gender"]) ?
      this.api.fhc().Hubcontroller().putPatientUsingPOST(this.hubEndPoint, _.get(this.api, "keystoreId", null), _.get(this.api, "tokenId", null), _.get(this.api, "credentials.ehpassword", null), _.get(this.hcp, "lastName", null), _.get(this.hcp, "firstName", null), _.get(this.hcp, "nihii", null), _.get(this.hcp, "ssin", null), this.hcpZip, _.get(this.patient, "ssin", null), _.get(this.patient, "firstName", null), _.get(this.patient, "lastName", null), _.get(this.patient, "gender", null), _.get(this.patient, "dateOfBirth", null))
          .then(consentResp => {
              console.log(consentResp)
              if(!_.isEmpty(consentResp)){
                  this._refreshConsentList()
                  this.set('tabs', 0)
                  this.dispatchEvent(new CustomEvent('refresh-consent',{detail: {}, bubbles:true, composed:true}))
              }
          }) : this.set("isLoading",false)
  }

  _registerNationalConsent(){
      this._verifData(["keystoreId", "keystorePassword", "token", "hcpNihii", "hcpSsin", "hcpFirstName", "hcpLastName", "patientInss", "patientFirstName", "patientLastName", "eidCardNumber"]) ?
          this.api.fhc().Consentcontroller().registerPatientConsentUsingPOST(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, this.hcp.nihii, this.hcp.ssin, this.hcp.firstName, this.hcp.lastName, this.cleanNumberSequence(this.patient.ssin), this.patient.firstName, this.patient.lastName, this.eidCardNumber, this.isiCardNumber)
          .then(consentResp => {
              console.log(consentResp)
              if(!_.isEmpty(consentResp)){
                  this._refreshConsentList()
                  this.set('tabs', 0)
                  this.dispatchEvent(new CustomEvent('refresh-consent',{detail: {}, bubbles:true, composed:true}))
              }
          }) : this.set("isLoading",false)
  }

  cleanNumberSequence(niss){
      return niss && niss.replace(/ /g, "").replace(/-/g,"").replace(/\./g,"").replace(/_/g,"").replace(/\//g,"")
  }

  _verifData(dataToBeVerified){
      const error = []
      this.set('errorList', [])
      !_.get(this.api, 'keystoreId', null) ? error.push({tag: 'keystoreId', code: 'lt-keystoreId-ko', label: 'Keystore id is missing'}) : null
      !_.get(this.api, 'tokenId', null) ? error.push({tag: 'token',code: 'lt-token-ko', label: 'Token id is missing'}) : null
      !_.get(this.api, 'credentials.ehpassword', null) ? error.push({tag: 'keystorePassword',code: 'lt-keystorePassword-ko', label: 'Keystore password is missing'}) : null
      !_.get(this.hcp, 'nihii', null) ? error.push({tag: 'hcpNihii',code: 'lt-hcpNihii-ko', label: 'Hcp nihii is missing'}) : null
      !_.get(this.hcp, 'ssin', null) ? error.push({tag: 'hcpSsin',code: 'lt-hcpSsin-ko', label: 'Hcp ssin is missing'}) : null
      !_.get(this.hcp, 'firstName', null) ? error.push({tag: 'hcpFirstName',code: 'lt-hcpFirstName-ko', label: 'Hcp first name is missing'}) : null
      !_.get(this.hcp, 'lastName', null) ? error.push({tag: 'hcpLastName',code: 'lt-hcpLastName-ko', label: 'Hcp last name is missing'}) : null
      !_.get(this.patient, 'ssin', null) ? error.push({tag: 'patientInss',code: 'lt-patientInss-ko', label: 'Patient inss is missing'}) : null
      !_.get(this.patient, 'firstName', null) ? error.push({tag: 'patientFirstName',code: 'lt-patientFirstName-ko', label: 'Patient first name is missing'}) : null
      !_.get(this.patient, 'lastName', null) ? error.push({tag: 'patientLastName',code: 'lt-patientLastName-ko', label: 'Patient last name is missing'}) : null
      !_.get(this, 'hubEndPoint', null) ? error.push({tag: 'hubEndpoint',code: 'lt-hubEndpoint-ko', label: 'Hub endpoint is missing'}) : null
      !_.get(this, 'hcpZip', null) ? error.push({tag: 'hcpZip',code: 'lt-hcpZip-ko', label: 'Hcp zip is missing'}) : null
      !_.get(this.patient, "gender", null) ? error.push({tag: 'gender',code: 'lt-gender-ko', label: 'Patient gender is missing'}) : null
      !_.get(this.patient, "dateOfBirth", null) ? error.push({tag: 'dateOfBirth',code: 'lt-dateOfBirth-ko', label: 'Patient date of birth is missing'}) : null
      !_.get(this, 'hubPackageId', null) ? error.push({tag: 'hubPackageId',code: 'lt-hubPackageId-ko', label: 'Hub package id is missing'}) : null

      _.get(this.patient, 'dateOfBirth', null) && moment().diff(moment(_.get(this.patient, 'dateOfBirth', null), "YYYYMMDD"), 'months', true) > 3 && !(_.get(this, 'eidCardNumber', null) || _.get(this, 'isiCardNumber', null)) ? error.push({tag: 'eidCardNumber',code: 'lt-eidCardNumber-ko', label: 'Patient eid or isi+ card number is missing'}) : null

      this.set("errorList", error.filter(err => dataToBeVerified.find(data => data === _.get(err, "tag", null))))
      return !_.size(_.get(this, "errorList", [])) > 0
  }
}
customElements.define(HtPatConsentDetail.is, HtPatConsentDetail);
