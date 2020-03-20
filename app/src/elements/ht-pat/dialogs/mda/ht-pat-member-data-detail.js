import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../dynamic-form/dynamic-doc.js';
import '../../../collapse-button/collapse-button.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/scrollbar-style.js';
import '../../../../styles/buttons-style.js';
import '../../../../styles/paper-tabs-style.js';
import '../../../dynamic-form/dynamic-text-field.js';
import '../../../../styles/notification-style.js';

import './ht-pat-member-data-response.js';
import './ht-pat-member-data-technical-info.js';

import moment from 'moment/src/moment';
import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';





class HtPatMemberDataDetail extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style buttons-style paper-tabs-style notification-style">
            #mdaDetailDialog{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 64px;
            }

            .mdaDetailDialog{
                display: flex;
                height: calc(100% - 45px);;
                width: auto;
                margin: 0;
                padding: 0;
            }

            .mda-content{
                display: flex;
                width: 100%;
                position: relative;
                height: 100%;
                background-color: white;
            }

            .mda-menu-list{
                width: 30%;
                height: 100%;
            }

            .mda-view{
                width: 70%;
                height: 100%;
                overflow: auto;
            }

            .mda-menu-list-header{
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

            .mda-menu-list-header-info{
                margin-left: 12px;
                display: flex;
                align-items: center;
            }

            .mda-name{
                font-size: var(--font-size-large);
                font-weight: 700;
            }

            .mda-menu-search-line{
                display: flex;
            }

            .w100{
                width: 100%;
            }


            .w33{
                width: 33%;
            }

            .p4{
                padding: 4px;
            }

            .mtm2{
                margin-top: -2px;
            }

            .w40{
                width: 40%;
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
                width: calc(100% / 4);
                padding: 0 8px;
                box-sizing: border-box;
            }

            .headerLabel{
                font-weight: bold;
            }

            .mda-result-container{
                margin-bottom: 12px;
                border: 1px solid var(--app-background-color-dark);
            }

            .headerMasterTitle{
                font-size: var(--font-size-large);
                background: var(--app-background-color-dark);
                padding: 0 12px;
                box-sizing: border-box;
            }

            .mda-sub-container{
                overflow: auto;
                height: auto;
                width: auto;
                margin: 10px;
                border: 1px solid var(--app-background-color-dark);
            }

            .mda-person-container{
                height: auto;
                width: auto;
            }

            .mda-address-container{
                height: auto;
                width: auto;
            }

            .mda-partnerInfo-container{
                height: auto;
                width: auto;
            }

            .mda-error-container{
                height: auto;
                width: auto;
                color: var(--app-status-color-nok);
                font-weight: bold;
            }

            .m5{
                margin: 5px;
            }

            .mda-menu-list-search{
                height: calc(100% - 90px);
            }

            .mda-btn-left{
                bottom: 0;
                width: 100%;
                height: auto;
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-items: center;
                padding: 8px 12px;
                box-sizing: border-box;
                background: white;
            }

            #htPatMemberDataTechnicalInfo{
                height: 98%;
                width: 100%;
                max-height: 100%;
            }

            #htPatMemberDataTechnicalInfo{
                height: 98%;
                width: 100%;
                max-height: 100%;
            }

            .page-content{
                padding: 12px;
                width: auto;
                box-sizing: border-box;
            }

            iron-pages{
                height: calc(100% - 48px);
                width: auto;
                overflow: auto;
            }

            .mr1{
                margin-right: 1%;
            }


        </style>

        <paper-dialog id="mdaDetailDialog">
            <div class="mdaDetailDialog">
                <div class="mda-content">
                    <div class="mda-menu-list">
                        <div class="mda-menu-list-header">
                            <div class="mda-menu-list-header-info">
                                <div class="mda-name">
                                    [[localize('mda-mda','Member data',language)]]
                                </div>
                            </div>
                        </div>
                        <div class="mda-menu-list-search">
                            <div class="mda-menu-search-line">
                                <vaadin-combo-box id="consultType" class="w40" label="[[localize('mda-consult-type', 'Consultation type', language)]]" filter="{{mdaTypeFilter}}" selected-item="{{selectedMdaConsultType}}"  filtered-items="[[mdaConsultType]]" item-label-path="label.fr" >
                                    <template>[[_getLabel(item.label)]]</template>
                                </vaadin-combo-box>
                                <template is="dom-if" if="[[_isMdaSearchByNiss(selectedMdaConsultType)]]">
                                    <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('mda-niss', 'Niss', language)]]" value="{{mdaSearch.ssin}}" required error-message="This field is required"></dynamic-text-field>
                                </template>
                                <template is="dom-if" if="[[!_isMdaSearchByNiss(selectedMdaConsultType)]]">
                                    <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('mda-mutuality', 'Mutuality', language)]]" value="{{mdaSearch.mutuality}}" required error-message="This field is required"></dynamic-text-field>
                                    <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('mda-identification-number', 'Identification number', language)]]" value="{{mdaSearch.identificationNumber}}" required error-message="This field is required"></dynamic-text-field>
                                </template>
                            </div>
                            <template is="dom-if" if="[[_isMedicalHouse(hcp)]]">
                                <div class="mda-menu-search-line">
                                    <dynamic-date-field label="[[localize('mda-startDate', 'Start date', language)]]" value="{{mdaSearch.startDate}}" i18n="[[i18n]]"></dynamic-date-field>
                                    <dynamic-date-field label="[[localize('mda-endDate', 'End date', language)]]" value="{{mdaSearch.endDate}}" i18n="[[i18n]]"></dynamic-date-field>
                                </div>
                                <div class="mda-menu-search-line">
                                    <vaadin-combo-box id="contactType" class="w40" label="[[localize('mda-contactType', 'Contact type', language)]]" filter="{{mdaContactTypeFilter}}" selected-item="{{selectedMdaContactType}}"  filtered-items="[[mdaContactType]]" item-label-path="label.fr" >
                                        <template>[[_getLabel(item.label)]]</template>
                                    </vaadin-combo-box>
                                </div>
                                <div class="mda-menu-search-line">
                                    <vaadin-combo-box id="contactType" class="w40" label="[[localize('mda-requestType', 'Request type', language)]]" filter="{{mdaRequestTypeFilter}}" selected-item="{{selectedMdaRequestType}}"  filtered-items="[[mdaRequestType]]" item-label-path="label.fr" >
                                        <template>[[_getLabel(item.label)]]</template>
                                    </vaadin-combo-box>
                                </div>
                            </template>
                            <template is="dom-if" if="[[!_isMedicalHouse(hcp)]]">
                                <div class="mda-menu-search-line">
                                    <vaadin-date-picker class="w100 mtm2 mw0 mr1" label="[[localize('mda-startDate', 'Start date', language)]]" value="{{mdaSearch.startDate}}" i18n="[[i18n]]" min="[[dateRange.minDate]]" max="[[dateRange.maxDate]]"></vaadin-date-picker>
                                    <vaadin-combo-box id="contactType" class="w100 mtm2 mw0" label="[[localize('mda-contactType', 'Contact type', language)]]" filter="{{mdaContactTypeFilter}}" selected-item="{{selectedMdaContactType}}"  filtered-items="[[mdaContactType]]" item-label-path="label.fr" >
                                        <template>[[_getLabel(item.label)]]</template>
                                    </vaadin-combo-box>
                                    <template is="dom-if" if="[[_isSpecialist(hcp)]]">
                                        <vaadin-combo-box id="contactType" class="w100 mtm2 mw0" label="[[localize('mda-requestType', 'Request type', language)]]" filter="{{mdaRequestTypeFilter}}" selected-item="{{selectedMdaRequestType}}"  filtered-items="[[mdaRequestType]]" item-label-path="label.fr" >
                                            <template>[[_getLabel(item.label)]]</template>
                                        </vaadin-combo-box>
                                    </template>
                                </div>
                            </template>
                        </div>
                        <div class="mda-btn-left">
                            <paper-button class="button button--other" on-tap="consultMda"><iron-icon icon="icons:refresh" class="mr5 smallIcon" ></iron-icon> [[localize('mda-consult','Consulter mda',language)]]</paper-button>
                        </div>
                    </div>
                    <div class="mda-view">
                        <paper-tabs selected="{{tabs}}" >
                            <paper-tab>
                                <iron-icon class="tabIcon" icon="vaadin:male"></iron-icon> [[localize('mda-response','Response',language)]]
                            </paper-tab>
                            <template is="dom-if" if="[[_isTechnicalInfo(mdaResult, mdaResult.*)]]">
                                <paper-tab>
                                    <iron-icon class="tabIcon" icon="vaadin:tools"></iron-icon> [[localize('mda-technical-info','Technical info',language)]]
                                </paper-tab>
                            </template>
                        </paper-tabs>
                        <iron-pages selected="[[tabs]]">
                            <page>
                                <div class="page-content">
                                    <ht-pat-member-data-response id="htPatMemberDataResponse" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" hcp="[[hcp]]" mda-search="[[mdaSearch]]" i18n="[[i18n]]" resources="[[resources]]" selected-mda-contact-type="[[selectedMdaContactType]]" selected-mda-request-type="[[selectedMdaRequestType]]" mda-result="[[mdaResult]]" is-loading="[[isLoading]]" general-error="[[generalError]]"></ht-pat-member-data-response>
                                </div>
                            </page>
                            <page>
                                <div class="page-content">
                                    <ht-pat-member-data-technical-info id="htPatMemberDataTechnicalInfo" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" hcp="[[hcp]]" mda-search="[[mdaSearch]]" i18n="[[i18n]]" resources="[[resources]]" selected-mda-contact-type="[[selectedMdaContactType]]" selected-mda-request-type="[[selectedMdaRequestType]]" mda-result="[[mdaResult]]"></ht-pat-member-data-technical-info>
                                </div>
                            </page>
                        </iron-pages>
                    </div>
                </div>
                <div class="buttons">
                    <paper-button class="button" on-tap="_closeDialog"><iron-icon icon="icons:close" class="mr5 smallIcon" ></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                </div>
            </div>
        </div>
    </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-member-data-detail';
  }

    static get properties() {
        return {
            api: {
                type: Object,
                value: null,
                noReset: true
            },
            user: {
                type: Object,
                value: null,
                noReset: true
            },
            i18n:{
                type: Object,
                value: {},
                noReset: true
            },
            resources:{
                type: Object,
                value: {},
                noReset: true
            },
            language: {
                type: String,
                noReset: true
            },
            patient:{
                type: Object,
                value: () => {},
                noReset: true
            },
            hcp:{
                type: Object,
                value: () => {},
                noReset: true
            },
            tabs:{
                type: Number,
                value: 0
            },
            isLoading:{
                type: Boolean,
                value: false,
                noReset: true
            },
            mdaConsultType:{
                type: Array,
                value: () => [
                    {type: "byNiss", label: {fr: "Niss", en: "SSIN", nl: ""}},
                    {type: "byIo", label: {fr: "Données mutuelles", en: "Mutuality information", nl: ""}}
                ],
                noReset: true
            },
            selectedMdaConsultType:{
                type: Object,
                value: () => {}
            },
            mdaSearch:{
                type: Object,
                value: () => ({
                    ssin: null,
                    startDate: null,
                    endDate: null,
                    mutuality: null,
                    inscriptionNumber: null,
                    contactType: null,
                    requestType: null,
                    consultType: null
                })
            },
            mdaContactType: {
                type: Array,
                value: () => [
                    {type: "other", label:{fr: "Ambulant", nl: "", en: "Other"}},
                    {type: "hospitalized", label:{fr: "Hospitalisé", nl: "", en: "Hospitalized"}}
                ],
                noReset: true
            },
            selectedMdaContactType:{
                type: Object,
                value: () => {}
            },
            mdaRequestType:{
                type: Array,
                value: () => [
                    {type: "information", label:{fr: "Information", nl: "", en: "Information"}},
                    {type: "invoicing", label:{fr: "Facturation", nl: "", en: "Invoicing"}}
                ],
                noReset: true
            },
            selectedMdaRequestType:{
                type: Object,
                value: () => {}
            },
            mdaResult:{
                type: Object,
                value: () => {}
            },
            medicalHouseList: {
                type: Object,
                value: function () {
                    return require('./rsrc/listOfMedicalHouse.json');
                }
            },
            pharmacyList: {
                type: Object,
                value: function () {
                    return require('./rsrc/listOfPharmacy.json');
                }
            },
            patientInsurance: {
                type: Object,
                value: () => {}
            },
            dateRange:{
                type: Object,
                value: () => {}
            },
            generalError:{
                type: Boolean,
                value: false
            }

        };
    }

    static get observers() {
        return ['_selectedMdaConsultTypeChanged(selectedMdaConsultType)', '_selectedMdaContactTypeChanged(selectedMdaContactType)'];
    }

    ready() {
        super.ready();
    }

    openDialog(e){
        ;(this.cleanData(_.get(_.head(_.get(this, 'mdaResult.formatedResponse.patientData', [])), 'person.ssin', null)) !== this.cleanData(_.get(this.patient, 'ssin', '')) ? this._resetComponentProperties() : Promise.resolve({}))
            .then(() => this.api.hcparty().getHealthcareParty(_.get(this.user, 'healthcarePartyId', null)))
            .then(hcp => {
                this.set('hcp', hcp)
            }).then(() => _.get(_.head(_.get(this.patient, 'insurabilities', [])), "insuranceId", null) ? this.api.insurance().getInsurance(_.get(_.head(_.get(this.patient, 'insurabilities', [])), "insuranceId", null)) : Promise.resolve({}))
            .then(insuranceInfo => this.set('patientInsurance', insuranceInfo))
            .finally(() => {
                this.set('tabs', 0)
                this.set('dateRange', {
                    minDate : moment().subtract(5, 'years').format("YYYY-MM-DD"),
                    maxDate: moment().format("YYYY-MM-DD")
                })
                this.set('selectedMdaConsultType', _.get(this.patient, 'ssin', null) ? _.get(this, 'mdaConsultType', []).find(t => t.type === "byNiss") : _.get(this, 'mdaConsultType', []).find(t => t.type === "byIo"))
                this.set('selectedMdaContactType', _.get(this, 'mdaContactType', []).find(t => t.type === "other"))
                this.set('selectedMdaRequestType', _.get(this, 'mdaRequestType', []).find(t => t.type === "information"))
                this.set('mdaSearch', {
                    ssin: _.get(this.patient, 'ssin', null),
                    startDate: this._isMedicalHouse() ? moment().startOf('month').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                    endDate: this._isMedicalHouse() ? moment().endOf('month').format('YYYY-MM-DD') : null,
                    mutuality: _.head(_.split(_.get(this.patientInsurance, 'code', null), ',')),
                    identificationNumber: _.get(_.head(_.get(this.patient, 'insurabilities', [])), "identificationNumber", null),
                    contactType: _.get(_.get(this, 'mdaContactType', []).find(t => t.type === "other"), "type", "other"),
                    requestType: _.get(_.get(this, 'mdaRequestType', []).find(t => t.type === "information"), "type", "information"),
                    consultType: _.get(this.patient, 'ssin', null) ? _.get(_.get(this, 'mdaConsultType', []).find(t => t.type === "byNiss"), 'type', null) : _.get(_.get(this, 'mdaConsultType', []).find(t => t.type === "byIo"), 'type', null)
                })
                _.get(e, 'open', true) ? this.$['mdaDetailDialog'].open() : null
                _.isEmpty(_.get(this, 'mdaResult', {})) ? _.get(this.mdaSearch, 'ssin', null) || ( _.get(this.mdaSearch, 'mutuality', null) && _.get(this.mdaSearch, 'identificationNumber', null)) ? this.consultMda() : null : null
            })
    }

    _closeDialog(){
        this.$['mdaDetailDialog'].close()
    }

    _resetComponentProperties() {
        const promResolve = Promise.resolve();
        return promResolve
            .then(() => {
                const componentProperties = HtPatMemberDataDetail.properties
                Object.keys(componentProperties).forEach(k => { if (!_.get(componentProperties[k],"noReset", false)) { this.set(k, (typeof componentProperties[k].value === 'function' ? componentProperties[k].value() : (componentProperties[k].value || null))) }})
                return promResolve
            })
    }

    consultMda(){
        this.set('isLoading',true)
        this.set('tabs', 0)
        this.set("mdaResult", {})
        this.set('generalError', false)
        ;(_.get(this.mdaSearch, 'ssin', null) && _.get(this.mdaSearch, 'consultType', null) === "byNiss"  ? this.consultMdaBySsin() : this.consultMdaByMemberShip()).then(mdaResponse => {
            return _.assign(mdaResponse, {
                formatedResponse: {
                    patientData: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:insurability:patientData"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        person: {
                            ssin: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:fgov:person:ssin"), 'attributeValues', []).join(" ")
                        },
                        careReceiver: {
                            name: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:careReceiver:name"), 'attributeValues', []).join(" "),
                            firstName: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:careReceiver:firstName"), 'attributeValues', []).join(" "),
                            birthDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:careReceiver:birthDate"), 'attributeValues', []).join(" "),
                            gender: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:careReceiver:gender"), 'attributeValues', []).join(" "),
                            deceasedDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:careReceiver:deceasedDate"), 'attributeValues', []).join(" ")
                        }
                    })),
                    period: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:insurability:period"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        careReceiver: {
                            registrationNumber: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:careReceiver:registrationNumber"), 'attributeValues', []).join(" "),
                            mutuality: {
                                code: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:careReceiver:mutuality"), 'attributeValues', []).join(" "),
                                name: null,
                                address: {}
                            }
                        },
                        cb1: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:cb1"), 'attributeValues', []).join(" "),
                        cb2: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:cb2"), 'attributeValues', []).join(" "),
                        communicationDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:communicationDate"), 'attributeValues', []).join(" ")
                    })),
                    payment: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:insurability:payment"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        paymentByIO: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:payment:byIO"), 'attributeValues', []).join(" ")
                    })),
                    medicalHouse: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:medicalHouse"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        medicalHouse: {
                            nihii: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:medicalHouse:nihii11"), 'attributeValues', []).join(" "),
                            name: null,
                            type: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:medicalHouse:type"), 'attributeValues', []).join(" "),
                            startDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:medicalHouse:start"), 'attributeValues', []).join(" "),
                            endDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:medicalHouse:end"), 'attributeValues', []).join(" ")
                        }
                    })),
                    hospitalisation: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:hospitalisation"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        hospitalisation: {
                            hospital: {
                                nihii: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:hospitalisation:hospital:nihii11"), 'attributeValues', []).join(" "),
                                name: null
                            },
                            service: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:hospitalisation:service"), 'attributeValues', []).join(" "),
                            admissionDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:hospitalisation:admissionDate"), 'attributeValues', []).join(" ")
                        }
                    })),
                    generalSituation: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:insurability:generalSituation"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        generalSituation: {
                            event: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:generalSituation:event"), 'attributeValues', []).join(" "),
                            transfer: {
                                direction: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:generalSituation:transfer:direction"), 'attributeValues', []).join(" "),
                                IO: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:generalSituation:transfer:IO"), 'attributeValues', []).join(" "),
                                transferDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:generalSituation:transfer:date"), 'attributeValues', []).join(" ")
                            }
                        }
                    })),
                    carePath: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:carePath"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        carePath: {
                            type: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:carePath:type"), 'attributeValues', []).join(" "),
                            physician: {
                                nihii: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:carePath:physician:nihii11"), 'attributeValues', []).join(" "),
                                firstName: null,
                                lastName: null
                            },
                            medicalHouse: {
                                nihii: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:carePath:medicalHouse:nihii11"), 'attributeValues', []).join(" "),
                                name: null
                            },
                            specialist: {
                                nihii: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:carePath:specialist:nihii11"), 'attributeValues', []).join(" "),
                                firstName: null,
                                lastName: null,
                                speciality: null
                            },
                            startRightDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:carePath:startRightDate"), 'attributeValues', []).join(" "),
                            endContractDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:carePath:endContractDate"), 'attributeValues', []).join(" "),
                            endRightDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:carePath:endRightDate"), 'attributeValues', []).join(" ")
                        }
                    })),
                    chronicCondition: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:chronicCondition"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        chronicCondition: {
                            year: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:chronicCondition:year"), 'attributeValues', []).join(" ")
                        }
                    })),
                    referencePharmacy: _.get(_.get(mdaResponse, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === "urn:be:cin:nippin:referencePharmacy"), 'statementsAndAuthnStatementsAndAuthzDecisionStatements', []).map(stat => ({
                        referencePharmacy: {
                            pharmacy: {
                                nihii: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:referencePharmacy:pharmacy:nihii8"), 'attributeValues', []).join(" "),
                                name: null
                            },
                            startDate: _.get(_.get(stat, 'attributesAndEncryptedAttributes', []).find(att => _.get(att, 'name', null) === "urn:be:cin:nippin:referencePharmacy:startDate"), 'attributeValues', []).join(" ")
                        }
                    }))
                }
            })
        }).then(mdaResponse => {
            let prom = Promise.resolve({})
            _.uniqBy(_.get(mdaResponse, 'formatedResponse.period', []), 'careReceiver.mutuality.code').map(p => {
                prom = prom.then(insurancesList => (_.get(p, 'careReceiver.mutuality.code', null) !== "" &&  _.get(p, 'careReceiver.mutuality.code', null) !== null ? this.api.insurance().listInsurancesByCode(_.get(p, 'careReceiver.mutuality.code')) : Promise.resolve({}))
                    .then(ins => _.concat(insurancesList, ins)))
            })

            return prom.then(insurancesList => {
                _.get(mdaResponse, 'formatedResponse.period', []).map(p => {
                    p.careReceiver.mutuality.name = _.get(_.compact(insurancesList).find(ins => _.split(_.get(ins, 'code', null)).find(c => c === _.get(p, 'careReceiver.mutuality.code', ''))), 'name.'+this.language, null)
                    p.careReceiver.mutuality.address = _.get(_.compact(insurancesList).find(ins => _.split(_.get(ins, 'code', null)).find(c => c === _.get(p, 'careReceiver.mutuality.code', ''))), 'address', {})
                })
                return mdaResponse
            })

        }).then(mdaResponse => this._consultAddressBook(mdaResponse))
            .then(mdaResponse => {
                this.set('mdaResult', mdaResponse)
                console.log(this.mdaResult)
                !_.isEmpty(_.get(mdaResponse, 'commonOutput', {})) ? Promise.all([mdaResponse, this.api.receipticc.createReceipt({
                    documentId: null,
                    references: Object.values(_.get(mdaResponse, 'commonOutput', {})),
                    category: "memberData",
                    subCategory:"soapRequest"
                }), this.api.receipticc.createReceipt({
                    documentId: null,
                    references: Object.values(_.get(mdaResponse, 'commonOutput', {})),
                    category: "memberData",
                    subCategory:"soapResponse"
                })]).then(([mdaResponse, receiptRequest, receiptResponse]) => Promise.all([
                    this.api.receipt().setAttachment(receiptRequest.id, "soapRequest", undefined, (this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(_.get(mdaResponse, 'mycarenetConversation.soapRequest', null))))),
                    this.api.receipt().setAttachment(receiptResponse.id, "soapResponse", undefined, (this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(_.get(mdaResponse, 'mycarenetConversation.soapResponse', null)))))
                ])) : Promise.resolve({})
            }).finally(() => {
                this.set('isLoading',false)
                this.dispatchEvent(new CustomEvent('mda-response', {
                    detail: {
                        carePath: _.size(_.get(this.mdaResult, 'formatedResponse.carePath', [])),
                        medicalHouse:  _.size(_.get(this.mdaResult, 'formatedResponse.medicalHouse', [])),
                        chronicCondition: _.size(_.get(this.mdaResult, 'formatedResponse.chronicCondition', [])),
                        generalSituation: _.size(_.get(this.mdaResult, 'formatedResponse.generalSituation', [])),
                        mdaResult: this.mdaResult
                    },
                    bubbles: true,
                    composed: true
                }))
                _.size(_.get(this.mdaResult, 'formatedResponse.carePath', [])) === 0 &&
                _.size(_.get(this.mdaResult, 'formatedResponse.medicalHouse', [])) === 0 &&
                _.size(_.get(this.mdaResult, 'formatedResponse.chronicCondition', [])) === 0 &&
                _.size(_.get(this.mdaResult, 'formatedResponse.generalSituation', [])) === 0 &&
                _.size(_.get(this.mdaResult, 'formatedResponse.period', [])) === 0 &&
                _.size(_.get(this.mdaResult, 'formatedResponse.payment', [])) === 0 &&
                _.size(_.get(this.mdaResult, 'formatedResponse.patientData', [])) === 0  ? this.set('generalError', true) : this.set('generalError', false)
            })
    }

    _consultAddressBook(mdaResponse){
        let prom = Promise.resolve({})

        _.uniq(_.compact(_.flatten(_.concat(
            _.get(mdaResponse, 'formatedResponse.hospitalisation', []).map(hosp => ({nihii: _.get(hosp, 'hospitalisation.hospital.nihii', null), type: 'org'})),
            _.get(mdaResponse, 'formatedResponse.carePath', []).map( cp => [{nihii: _.get(cp, 'carePath.physician.nihii', null), type: 'hcp'},{nihii: _.get(cp, 'carePath.specialist.nihii', null), type: 'hcp'}, {nihii: _.get(cp, 'carePath.medicalHouse.nihii', null), type: 'mm'}]),
            _.get(mdaResponse, 'formatedResponse.referencePharmacy', []).map(rp => ({nihii: _.get(rp, 'referencePharmacy.pharmacy.nihii', null), type: 'pha'})),
            _.get(mdaResponse, 'formatedResponse.medicalHouse', []).map(mm => ({nihii: _.get(mm, 'medicalHouse.nihii', null), type: 'mm'}))
        )))).map(nihii => {
            prom = prom.then(nihiiList =>
                (
                    this.api.patient().checkInami(_.get(nihii, 'nihii', null))  ?
                        _.get(nihii, 'type', null) === 'org' ? this.api.fhc().Addressbookcontroller().getOrgByNihiiUsingGET(_.get(this.api, 'keystoreId', null), _.get(this.api, 'tokenId', null), _.get(this.api, 'credentials.ehpassword', null), _.get(nihii, 'nihii', null)) :
                            _.get(nihii, 'type', null) === 'hcp' ? this.api.fhc().Addressbookcontroller().getHcpByNihiiUsingGET(_.get(this.api, 'keystoreId', null), _.get(this.api, 'tokenId', null), _.get(this.api, 'credentials.ehpassword', null), _.get(nihii, 'nihii', null)) :
                                _.get(nihii, 'type', null) === 'mm' ? Promise.resolve(_.concat(nihiiList, _.assign(_.get(this.medicalHouseList, 'medicalHouseList', []).find(mm => _.get(mm, 'nihii', null) === _.get(nihii, 'nihii', '')), {initialSearch: nihii}))) :
                                    Promise.resolve(_.concat(nihiiList, _.assign({}, {initialSearch: nihii}))) :
                        _.get(nihii, 'type', null) === 'pha' ? Promise.resolve(_.concat(nihiiList, _.assign(_.get(this.pharmacyList, 'pharmacyList', []).find(pha => _.get(pha, 'authorizationNumber', null) === _.get(nihii, 'nihii', '').substr(2)), {initialSearch: nihii}))) :
                            Promise.resolve(_.concat(nihiiList, _.assign({}, {initialSearch: nihii})))
                ).then(adrResp => _.concat(nihiiList, _.assign(adrResp, {initialSearch: nihii})))
            )
        })

        return prom.then(nihiiList => {
            _.get(mdaResponse, 'formatedResponse.hospitalisation', []).map(hosp => {
                hosp.hospitalisation.hospital.name = _.get(_.compact(nihiiList).find(nihii => _.get(nihii, 'initialSearch.nihii', null) === _.get(hosp, 'hospitalisation.hospital.nihii', '')), 'name', null)
            })
            _.get(mdaResponse, 'formatedResponse.referencePharmacy', []).map(rp => {
                rp.referencePharmacy.pharmacy.name = _.get(_.compact(nihiiList).find(nihii => _.get(nihii, 'initialSearch.nihii', null) === _.get(rp, 'referencePharmacy.pharmacy.nihii', '')), 'name', null)
            })
            _.get(mdaResponse, 'formatedResponse.carePath', []).map( cp => {
                cp.carePath.physician.firstName = _.get(_.compact(nihiiList).find(nihii => _.get(nihii, 'initialSearch.nihii', null) === _.get(cp, 'carePath.physician.nihii', '')), 'firstName', null)
                cp.carePath.physician.lastName = _.get(_.compact(nihiiList).find(nihii => _.get(nihii, 'initialSearch.nihii', null) === _.get(cp, 'carePath.physician.nihii', '')), 'lastName', null)
                cp.carePath.specialist.firstName = _.get(_.compact(nihiiList).find(nihii => _.get(nihii, 'initialSearch.nihii', null) === _.get(cp, 'carePath.specialist.nihii', '')), 'firstName', null)
                cp.carePath.specialist.lastName = _.get(_.compact(nihiiList).find(nihii => _.get(nihii, 'initialSearch.nihii', null) === _.get(cp, 'carePath.specialist.nihii', '')), 'lastName', null)
                cp.carePath.medicalHouse.name = _.get(_.compact(nihiiList).find(nihii => _.get(nihii, 'initialSearch.nihii', null) === _.get(cp, 'carePath.medicalHouse.nihii', '')), 'name', null)
            })

            _.get(mdaResponse, 'formatedResponse.medicalHouse', []).map(mm => {
                mm.medicalHouse.name = _.get(_.compact(nihiiList).find(nihii => _.get(nihii, 'initialSearch.nihii', null) === _.get(mm, 'medicalHouse.nihii', '')), 'name', null)
            })

            return mdaResponse
        })
    }

    consultMdaBySsin(){
        return _.get(this.mdaSearch, "ssin", null) ? this.api.fhc().MemberDataController().getMemberDataUsingGET(this.cleanData(_.get(this.patient, "ssin", null)), this._isMedicalHouse() ? _.get(this.api, "tokenIdMH", null) : _.get(this.api, "tokenId", null), _.get(this.api, "keystoreId", null), _.get(this.api, "credentials.ehpassword", null), this.cleanData(_.get(this.hcp, "nihii", null)), this.cleanData(_.get(this.hcp, "ssin", null)), this._isMedicalHouse() ? _.get(this.hcp, 'name', null) : _.get(this.hcp, "firstName", null), this._isMedicalHouse() ? "medicalhouse" : "doctor" , _.get(this.mdaSearch, 'startDate', null) ? moment(_.get(this.mdaSearch, 'startDate', null), 'YYYYMMDD').valueOf() : null , this._isMedicalHouse() ? _.get(this.mdaSearch, 'endDate', null) ? moment(_.get(this.mdaSearch, 'endDate', null), 'YYYYMMDD').valueOf() : null : null, _.get(this.mdaSearch, 'contactType', "other") !== "other") : Promise.resolve({})
    }

    consultMdaByMemberShip(){
        return _.get(this.mdaSearch, "identificationNumber", null) && _.get(this.mdaSearch, "mutuality", null)? this.api.fhc().MemberDataController().getMemberDataByMembershipUsingGET(_.get(this.mdaSearch, "mutuality", null), _.get(this.mdaSearch, "identificationNumber", null), this._isMedicalHouse() ? _.get(this.api, "tokenIdMH", null) : _.get(this.api, "tokenId", null), _.get(this.api, "keystoreId", null), _.get(this.api, "credentials.ehpassword", null), this.cleanData(_.get(this.hcp, "nihii", null)), this.cleanData(_.get(this.hcp, "ssin", null)), this._isMedicalHouse() ? _.get(this.hcp, 'name', null) : _.get(this.hcp, "firstName", null), this._isMedicalHouse() ? "medicalhouse" : "doctor" , _.get(this.mdaSearch, 'startDate', null) ? moment(_.get(this.mdaSearch, 'startDate', null), 'YYYYMMDD').valueOf() : null, this._isMedicalHouse() ? _.get(this.mdaSearch, 'endDate', null) ? moment(_.get(this.mdaSearch, 'endDate', null), 'YYYYMMDD').valueOf() : null : null, _.get(this.mdaSearch, 'contactType', "other") !== "other") : Promise.resolve({})
    }

    _selectedMdaConsultTypeChanged(){
        this.set("mdaSearch.consultType", _.get(this.selectedMdaConsultType, 'type', "byNiss"))
    }

    _selectedMdaContactTypeChanged(){
        this.set("mdaSearch.contactType", _.get(this.selectedMdaContactType, 'type', "other"))
    }

    _isMdaSearchByNiss(){
        return _.get(this.selectedMdaConsultType, 'type', {}) === "byNiss"
    }

    _getLabel(label){
        return _.get(label, this.language, label.en)
    }

    _isMedicalHouse(){
        return _.get(this.hcp, "type", null) === "medicalhouse"
    }

    cleanData(data){
        return data && data.replace(/ /g, "").replace(/-/g,"").replace(/\./g,"").replace(/_/g,"").replace(/\//g,"")
    }

    _isTechnicalInfo(mdaResponse){
        return !!_.get(mdaResponse, 'status.code1', null)
    }

    _isSpecialist(){
        return !!(_.get(this.hcp, 'nihii', null) && _.startsWith(_.get(this.hcp, 'nihii', null), "1", 0) && _.size(_.get(this.hcp, 'nihii', null)) === 11 && (_.get(this.hcp, 'nihii', null).substr(_.size(_.get(this.hcp, 'nihii', null)) - 3) >= 10))
    }
}
customElements.define(HtPatMemberDataDetail.is, HtPatMemberDataDetail);
