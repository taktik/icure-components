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

import moment from 'moment/src/moment';
import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';





class HtPatMemberDataResponse extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
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
            }

            .mda-view{
                width: 70%;
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
            .fw2{
                width: calc(100% / 2);
            }

            .succesContainer{
                height: auto;
                width: auto;
                margin: 10px;
            }

            .warningIcon{
                color: var(--app-status-color-pending);
                height: 16px;
                width: 16px;
            }

            .mda-sub-container-error{
                height: auto;
                width: auto;
                margin: 10px;
                border: 1px solid var(--app-status-color-nok);
            }

            .mda-container-error{
                height: auto;
                width: auto;
            }

            .headerMasterTitleError{
                font-size: var(--font-size-large);
                background: var(--app-status-color-nok);
                padding: 0 12px;
                box-sizing: border-box;
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

        </style>

        <div>
            <ht-spinner active="[[isLoading]]"></ht-spinner>
            <template is="dom-if" if="[[_ifData(mdaResult, mdaResult.*)]]">

                <!--
                <template is="dom-if" if="[[!_isSucces(mdaResult.status, mdaResult.*)]]">
                    <div class="succesContainer">
                        <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> <span class="p4">[[_getStatus(mdaResult.status)]]</span>
                    </div>
                </template>-->
                <!--
                <template is="dom-if" if="[[generalError]]">
                    <div class="succesContainer">
                        <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> <span class="p4">Le service est momentanément indisponible veuillez réessayer plus tard</span>
                    </div>
                </template>
                -->
                <template is="dom-if" if="[[_isErrors(mdaResult.errors, mdaResult.myCarenetErrors)]]">
                    <div class="mda-sub-container-error">
                        <div class="headerMasterTitleError headerLabel">[[localize('mda-error', 'Error', language)]]</div>
                        <div class="mda-container-error p4">
                            <template is="dom-if" if="[[_isMcnError(mdaResult.myCarenetErrors)]]">
                                <template is="dom-repeat" items="[[mdaResult.myCarenetErrors]]" as="mcnError">
                                    <div>[[_getMcnErrorMessage(mcnError)]]</div>
                                </template>
                            </template>

                            <template is="dom-if" if="[[!_isMcnError(mdaResult.myCarenetErrors)]]">
                                <template is="dom-repeat" items="[[mdaResult.errors]]" as="error">
                                    <template is="dom-repeat" items="[[error.details.details]]" as="detail">
                                        <div>[[_getErrorMessage(detail)]]</div>
                                    </template>
                                </template>
                            </template>
                        </div>
                    </div>
                </template>

                <template is="dom-if" if="[[_isDataAvailable('urn:be:cin:nippin:insurability:patientData', mdaResult, mdaResult.*)]]">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.patientData]]" as="pd">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-patientData', 'Patient data', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-name', 'Name', language)]]: &nbsp;</span> [[pd.careReceiver.name]]
                                    </div>
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-firstName', 'First name', language)]]: &nbsp;</span> [[pd.careReceiver.firstName]]
                                    </div>
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-gender', 'Gender', language)]]: &nbsp;</span> [[_localizeGender(pd.careReceiver.gender)]]
                                    </div>
                                </div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-niss', 'Niss', language)]]: &nbsp;</span> [[_formatNissNumber(pd.person.ssin)]]
                                    </div>
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-birdthDate', 'Birth date', language)]]: &nbsp;</span> [[_formatDate(pd.careReceiver.birthDate)]]
                                    </div>
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-deceasedDate', 'Deceased date', language)]]: &nbsp;</span> [[_formatDate(pd.careReceiver.deceasedDate)]]
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>

                <template is="dom-if" if="[[!_isDataAvailable('urn:be:cin:nippin:insurability:patientData', mdaResult, mdaResult.*)]]">
                    <template is="dom-if" if="[[_isFacetExeption('insurability', mdaResult, mdaResult.*)]]">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-patientData', 'Patient data', language)]]</div>
                                <div class="headerInfoLine">
                                    <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> [[localize("mda-facet-expt-info-start", "Facet", language)]] assurabilité [[localize("mda-facet-expt-info-end", "is not available", language)]]
                                </div>
                            </div>
                        </div>
                    </template>
                </template>

                <template is="dom-if" if="[[_isDataAvailable('urn:be:cin:nippin:insurability:period', mdaResult, mdaResult.*)]]">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.period]]" as="p">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-period', 'Period', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-reg-numb', 'Registration number', language)]]: &nbsp;</span> [[p.careReceiver.registrationNumber]]
                                    </div>
                                    <div class="headerInfoField fw2">
                                        <span class="headerLabel">[[localize('mda-mut', 'Mutuality', language)]]: &nbsp;</span> [[p.careReceiver.mutuality.code]] [[p.careReceiver.mutuality.name]]
                                    </div>
                                </div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-ct-code', 'Ct code', language)]]: &nbsp;</span> [[p.cb1]]/[[p.cb2]]
                                    </div>
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-com-date', 'Communication date', language)]]: &nbsp;</span> [[_formatDate(p.communicationDate)]]
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template is="dom-if" if="[[!_isDataAvailable('urn:be:cin:nippin:insurability:period', mdaResult, mdaResult.*)]]">
                    <template is="dom-if" if="[[_isFacetExeption('insurability', mdaResult, mdaResult.*)]]">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-period', 'Period', language)]]</div>
                                <div class="headerInfoLine">
                                    <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> [[localize("mda-facet-expt-info-start", "Facet", language)]] assurabilité [[localize("mda-facet-expt-info-end", "is not available", language)]]
                                </div>
                            </div>
                        </div>
                    </template>
                </template>

                <template is="dom-if" if="[[_isDataAvailable('urn:be:cin:nippin:insurability:payment', mdaResult, mdaResult.*)]]">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.payment]]" as="p">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-payment', 'Payment', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-payment-io', 'Payment by IO', language)]]: &nbsp;</span> [[_localizePayment(p.paymentByIO)]]
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template is="dom-if" if="[[!_isDataAvailable('urn:be:cin:nippin:insurability:payment', mdaResult, mdaResult.*)]]">
                    <template is="dom-if" if="[[_isFacetExeption('insurability', mdaResult, mdaResult.*)]]">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-payment', 'Payment', language)]]</div>
                                <div class="headerInfoLine">
                                    <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> [[localize("mda-facet-expt-info-start", "Facet", language)]] assurabilité [[localize("mda-facet-expt-info-end", "is not available", language)]]
                                </div>
                            </div>
                        </div>
                    </template>
                </template>

                <template is="dom-if" if="[[_isDataAvailable('urn:be:cin:nippin:medicalHouse', mdaResult, mdaResult.*)]]">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.medicalHouse]]" as="mmh">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-medicalHouse', 'Medical house', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoLine">
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-nihii', 'Nihii', language)]]: &nbsp;</span> [[_formatNihiiNumber(mmh.medicalHouse.nihii)]]
                                        </div>
                                        <div class="headerInfoField fw2">
                                            <span class="headerLabel">[[localize('mda-name', 'Name', language)]]: &nbsp;</span> [[mmh.medicalHouse.name]]
                                        </div>
                                    </div>
                                    <div class="headerInfoLine">
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-type', 'Type', language)]]: &nbsp;</span> [[mmh.medicalHouse.type]]
                                        </div>
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-startDate', 'Start date', language)]]: &nbsp;</span> [[_formatDate(mmh.medicalHouse.startDate)]]
                                        </div>
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-endDate', 'End date', language)]]: &nbsp;</span> [[_formatDate(mmh.medicalHouse.endDate)]]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template is="dom-if" if="[[!_isDataAvailable('urn:be:cin:nippin:insurability:medicalHouse', mdaResult, mdaResult.*)]]">
                    <template is="dom-if" if="[[_isFacetExeption('insurability', mdaResult, mdaResult.*)]]">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-medicalHouse', 'Medical house', language)]]</div>
                                <div class="headerInfoLine">
                                    <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> [[localize("mda-facet-expt-info-start", "Facet", language)]] assurabilité [[localize("mda-facet-expt-info-end", "is not available", language)]]
                                </div>
                            </div>
                        </div>
                    </template>
                    <template is="dom-if" if="[[_isAssertion(mdaResult, mdaResult.*)]]">
                        <template is="dom-if" if="[[!_isFacetExeption('insurability', mdaResult, mdaResult.*)]]">
                            <div class="mda-sub-container">
                                <div class="mda-person-container">
                                    <div class="headerMasterTitle headerLabel">[[localize('mda-medicalHouse', 'Medical house', language)]]</div>
                                    <div class="headerInfoLine">
                                        [[localize("mda-no-mmh-contract", "No medical house contact", language)]]
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>

                <template is="dom-if" if="[[_isDataAvailable('urn:be:cin:nippin:hospitalisation', mdaResult, mdaResult.*)]]">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.hospitalisation]]" as="hosp">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-hospitalisation', 'Hospitalisation', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoLine">
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-nihii', 'Nihii', language)]]: &nbsp;</span> [[_formatNihiiNumber(hosp.hospitalisation.hospital.nihii)]]
                                        </div>
                                        <div class="headerInfoField fw2">
                                            <span class="headerLabel">[[localize('mda-name', 'Name', language)]]: &nbsp;</span> [[hosp.hospitalisation.hospital.name]]
                                        </div>
                                    </div>
                                    <div class="headerInfoLine">
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-adm-date', 'Admission date', language)]]: &nbsp;</span> [[_formatDate(hosp.hospitalisation.admissionDate)]]
                                        </div>
                                        <div class="headerInfoField fw2">
                                            <span class="headerLabel">[[localize('mda-service', 'Service', language)]]: &nbsp;</span> [[_getServiceInfo(hosp.hospitalisation.service)]]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>

                <template is="dom-if" if="_isDataAvailable('urn:be:cin:nippin:insurability:generalSituation', mdaResult, mdaResult.*)">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.generalSituation]]" as="gs">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-generalSituation', 'General situation', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoLine">
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-event', 'Event', language)]]: &nbsp;</span> [[_localizeEvent(gs.generalSituation.event)]]
                                        </div>
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-direction', 'Direction', language)]]: &nbsp;</span> [[_localizeDirection(gs.generalSituation.transfer.direction)]]
                                        </div>
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-io', 'IO', language)]]: &nbsp;</span> [[gs.generalSituation.transfer.IO]]
                                        </div>
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-transferDate', 'Transfer date', language)]]: &nbsp;</span> [[_formatDate(gs.generalSituation.transfer.transferDate)]]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template is="dom-if" if="[[!_isDataAvailable('urn:be:cin:nippin:insurability:generalSituation', mdaResult, mdaResult.*)]]">
                    <template is="dom-if" if="[[_isFacetExeption('insurability', mdaResult, mdaResult.*)]]">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-generalSituation', 'General situation', language)]]</div>
                                <div class="headerInfoLine">
                                    <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> [[localize("mda-facet-expt-info-start", "Facet", language)]] assurabilité [[localize("mda-facet-expt-info-end", "is not available", language)]]
                                </div>
                            </div>
                        </div>
                    </template>
                    <template is="dom-if" if="[[_isAssertion(mdaResult, mdaResult.*)]]">
                        <template is="dom-if" if="[[!_isFacetExeption('insurability', mdaResult, mdaResult.*)]]">
                            <div class="mda-sub-container">
                                <div class="mda-person-container">
                                    <div class="headerMasterTitle headerLabel">[[localize('mda-generalSituation', 'General situation', language)]]</div>
                                    <div class="headerInfoLine">
                                        [[localize("", "Pas d'info sur la situation générale", language)]]
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>

                <template is="dom-if" if="[[_isDataAvailable('urn:be:cin:nippin:carePath', mdaResult, mdaResult.*)]]">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.carePath]]" as="cp">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-carePath', 'Care path', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-type', 'Type', language)]]:  &nbsp;</span> [[_localizeCarePathType(cp.carePath.type)]]
                                    </div>
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-startRightDate', 'Start right date', language)]]: &nbsp;</span> [[_formatDate(cp.carePath.startRightDate)]]
                                    </div>
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-endRightDate', 'End right date', language)]]: &nbsp;</span> [[_formatDate(cp.carePath.endRightDate)]]
                                    </div>
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-endContractDate', 'End contract date', language)]]: &nbsp;</span> [[_formatDate(cp.carePath.endContractDate)]]
                                    </div>
                                </div>
                                <template is="dom-if" if="[[_isCarePathNihiiAvailable(cp.carePath.physician.nihii, cp.*)]]">
                                    <div class="mda-sub-container m5">
                                        <div class="mda-person-container">
                                            <div class="headerMasterTitle headerLabel">[[localize('mda-physician', 'Physician', language)]]</div>
                                            <div class="headerInfoLine">
                                                <div class="headerInfoLine">
                                                    <div class="headerInfoField">
                                                        <span class="headerLabel">[[localize('mda-nihii', 'Nihii', language)]]: &nbsp;</span> [[_formatNihiiNumber(cp.carePath.physician.nihii)]]
                                                    </div>
                                                    <div class="headerInfoField">
                                                        <span class="headerLabel">[[localize('mda-firstName', 'First name', language)]]: &nbsp;</span> [[cp.carePath.physician.firstName]]
                                                    </div>
                                                    <div class="headerInfoField">
                                                        <span class="headerLabel">[[localize('mda-lastName', 'Last name', language)]]: &nbsp;</span> [[cp.carePath.physician.lastName]]
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[_isCarePathNihiiAvailable(cp.carePath.medicalHouse.nihii, cp.*)]]">
                                    <div class="mda-sub-container m5">
                                        <div class="mda-person-container">
                                            <div class="headerMasterTitle headerLabel">[[localize('mda-cp-medicalHouse', 'Medical house', language)]]</div>
                                            <div class="headerInfoLine">
                                                <div class="headerInfoLine">
                                                    <div class="headerInfoLine">
                                                        <div class="headerInfoField">
                                                            <span class="headerLabel">[[localize('mda-nihii', 'Nihii', language)]]: &nbsp;</span> [[_formatNihiiNumber(cp.carePath.medicalHouse.nihii)]]
                                                        </div>
                                                        <div class="headerInfoField">
                                                            <span class="headerLabel">[[localize('mda-name', 'Name', language)]]: &nbsp;</span> [[cp.carePath.medicalHouse.name]]
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[_isCarePathNihiiAvailable(cp.carePath.specialist.nihii, cp.*)]]">
                                    <div class="mda-sub-container m5">
                                        <div class="mda-person-container">
                                            <div class="headerMasterTitle headerLabel">[[localize('mda-specialist', 'Specialist', language)]]</div>
                                            <div class="headerInfoLine">
                                                <div class="headerInfoLine">
                                                    <div class="headerInfoLine">
                                                        <div class="headerInfoField">
                                                            <span class="headerLabel">[[localize('mda-nihii', 'Nihii', language)]]: &nbsp;</span> [[_formatNihiiNumber(cp.carePath.specialist.nihii)]]
                                                        </div>
                                                        <div class="headerInfoField">
                                                            <span class="headerLabel">[[localize('mda-firstName', 'First name', language)]]: &nbsp;</span> [[cp.carePath.specialist.firstName]]
                                                        </div>
                                                        <div class="headerInfoField">
                                                            <span class="headerLabel">[[localize('mda-lastName', 'Last name', language)]]: &nbsp;</span> [[cp.carePath.specialist.lastName]]
                                                        </div>
                                                        <div class="headerInfoField">
                                                            <span class="headerLabel">[[localize('mda-speciality', 'Speciality', language)]]: &nbsp;</span> [[cp.carePath.specialist.speciality]]
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </template>
                <template is="dom-if" if="[[!_isDataAvailable('urn:be:cin:nippin:carePath', mdaResult, mdaResult.*)]]">
                    <template is="dom-if" if="[[_isFacetExeption('carePath', mdaResult, mdaResult.*)]]">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-carePath', 'Care path', language)]]</div>
                                <div class="headerInfoLine">
                                    <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> [[localize("mda-facet-expt-info-start", "Facet", language)]] trajet de soins [[localize("mda-facet-expt-info-end", "is not available", language)]]
                                </div>
                            </div>
                        </div>
                    </template>
                    <template is="dom-if" if="[[_isAssertion(mdaResult, mdaResult.*)]]">
                        <template is="dom-if" if="[[!_isFacetExeption('carePath', mdaResult, mdaResult.*)]]">
                            <div class="mda-sub-container">
                                <div class="mda-person-container">
                                    <div class="headerMasterTitle headerLabel">[[localize('mda-carePath', 'Care path', language)]]</div>
                                    <div class="headerInfoLine">
                                        [[localize("mda-no-care-path", "No care path", language)]]
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>


                <template is="dom-if" if="[[_isDataAvailable('urn:be:cin:nippin:chronicCondition', mdaResult, mdaResult.*)]]">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.chronicCondition]]" as="cc">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-chronicCondition', 'Chronic condition', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoField">
                                        <span class="headerLabel">[[localize('mda-year', 'Year', language)]]: &nbsp;</span> [[cc.chronicCondition.year]]
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template is="dom-if" if="[[!_isDataAvailable('urn:be:cin:nippin:chronicCondition', mdaResult, mdaResult.*)]]">
                    <template is="dom-if" if="[[_isFacetExeption('chronicCondition', mdaResult, mdaResult.*)]]">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-chronicCondition', 'Chronic condition', language)]]</div>
                                <div class="headerInfoLine">
                                    <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> [[localize("mda-facet-expt-info-start", "Facet", language)]] statut affection chronique [[localize("mda-facet-expt-info-end", "is not available", language)]]
                                </div>
                            </div>
                        </div>
                    </template>
                    <template is="dom-if" if="[[_isAssertion(mdaResult, mdaResult.*)]]">
                        <template is="dom-if" if="[[!_isFacetExeption('chronicCondition', mdaResult, mdaResult.*)]]">
                            <div class="mda-sub-container">
                                <div class="mda-person-container">
                                    <div class="headerMasterTitle headerLabel">[[localize('mda-chronicCondition', 'Chronic condition', language)]]</div>
                                    <div class="headerInfoLine">
                                        [[localize("mda-no-chronic-condition", "No Chronic condition", language)]]
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>

                <template is="dom-if" if="[[_isDataAvailable('urn:be:cin:nippin:referencePharmacy', mdaResult, mdaResult.*)]]">
                    <template is="dom-repeat" items="[[mdaResult.formatedResponse.referencePharmacy]]" as="rp">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-referencePharmacy', 'Reference pharmacy', language)]]</div>
                                <div class="headerInfoLine">
                                    <div class="headerInfoLine">
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-nihii', 'Nihii', language)]]: &nbsp;</span> [[_formatNihiiNumber(rp.referencePharmacy.pharmacy.nihii)]]
                                        </div>
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-name', 'Name', language)]]: &nbsp;</span> [[rp.referencePharmacy.pharmacy.name]]
                                        </div>
                                        <div class="headerInfoField">
                                            <span class="headerLabel">[[localize('mda-startDate', 'Start date', language)]]: &nbsp;</span> [[_formatDate(rp.referencePharmacy.startDate)]]
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <template is="dom-if" if="[[!_isDataAvailable('urn:be:cin:nippin:referencePharmacy', mdaResult, mdaResult.*)]]">
                    <template is="dom-if" if="[[_isFacetExeption('referencePharmacy', mdaResult, mdaResult.*)]]">
                        <div class="mda-sub-container">
                            <div class="mda-person-container">
                                <div class="headerMasterTitle headerLabel">[[localize('mda-referencePharmacy', 'Reference pharmacy', language)]]</div>
                                <div class="headerInfoLine">
                                    <iron-icon icon="vaadin:warning" class="warningIcon"></iron-icon> [[localize("mda-facet-expt-info-start", "Facet", language)]] pharmacie de référence [[localize("mda-facet-expt-info-end", "is not available", language)]]
                                </div>
                            </div>
                        </div>
                    </template>
                    <template is="dom-if" if="[[_isAssertion(mdaResult, mdaResult.*)]]">
                        <template is="dom-if" if="[[!_isFacetExeption('referencePharmacy', mdaResult, mdaResult.*)]]">
                            <div class="mda-sub-container">
                                <div class="mda-person-container">
                                    <div class="headerMasterTitle headerLabel">[[localize('mda-referencePharmacy', 'Reference pharmacy', language)]]</div>
                                    <div class="headerInfoLine">
                                        [[localize("mda-no-reference-pharmacy", "No reference pharmacy", language)]]
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>
            </template>
        </div>
`;
  }

  static get is() {
      return 'ht-pat-member-data-response';
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
            patient:{
                type: Object,
                value: () => {}
            },
            hcp:{
                type: Object,
                value: () => {}
            },
            mdaSearch:{
                type: Object,
                value: () => {}
            },
            selectedMdaContactType:{
                type: Object,
                value: () => {}
            },
            selectedMdaRequestType:{
                type: Object,
                value: () => {}
            },
            mdaResult:{
                type: Object,
                value: () => {}
            },
            isLoading:{
                type: Boolean,
                value: false
            },
            hospitalServiceList: {
                type: Object,
                value: function () {
                    return require('./rsrc/listOfHospitalService.json');
                }
            },
            generalError:{
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [];
    }

    ready() {
        super.ready();
    }

    _getAssertionType(assertionType){
        return this.localize('mda-ass-'+_.last(_.split(assertionType, ':')), _.last(_.split(assertionType, ':')), this.language)
    }

    _getStatusOfRequest(statusCode){
        return this.localize('mda-stat-'+_.last(_.split(statusCode, ':')), _.last(_.split(statusCode, ':')), this.language)
    }

    _getAttributeName(att){
        return this.localize('mda-att-name-'+_.last(_.split(_.get(att, 'name', null), ':')), _.last(_.split(_.get(att, 'name', null), ':')), this.language)
    }

    _getAttributeValue(att){
        return _.get(att, 'attributeValues', []).join(" ")
    }

    _isDataAvailable(type, mdaResult){
        return !!_.get(mdaResult, 'assertions', []).find(assertion => _.get(assertion, 'advice.assertionType', null) === type)
    }

    _formatDate(date){
        return date ? moment(parseInt(date)).format("DD/MM/YYYY"): null
    }

    _formatNissNumber(niss) {
        return niss ? ("" + niss).replace(/([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{3})([0-9]{2})/, '$1.$2.$3-$4.$5') : ''
    }

    _formatNihiiNumber(nihii) {
        return nihii ? ("" + nihii).replace(/([0-9]{1})([0-9]{5})([0-9]{2})([0-9]{3})/, '$1-$2-$3-$4') : nihii
    }

    _localizePayment(payment){
        return payment ? this.localize('mda-payement-'+_.toLower(payment), payment, this.language) : null
    }

    _localizeGender(gender){
        return gender ? this.localize('mda-gender-'+_.toLower(gender), gender, this.language) : null
    }

    _localizeCarePathType(carePathType){
        return carePathType ? this.localize('mda-carePath-type-'+_.toLower(carePathType), carePathType, this.language) : null
    }

    _localizeDirection(direction){
        return direction ? this.localize('mda-direction-'+direction, direction, this.language) : null
    }

    _localizeEvent(event){
        return event ? this.localize('mda-event-'+event, event, this.language) : null
    }

    _isCarePathNihiiAvailable(nihii){
        return nihii !== null && nihii !== ""
    }

    _isErrors(errors, mcnErrors){
        return !!_.size(_.flatten((errors || []).map(err => _.get(err, "details.details", []))).filter(err => _.get(err, 'detailCode', null) !== "BO_MISSING_FACET" && _.get(err, 'detailCode', null) !== "FACET_EXCEPTION")) || !!_.size(mcnErrors)
    }

    _isSucces(status){
        return _.get(status, 'code2', null) ? false : !!_.get(status, 'code1', null) && !(!!_.get(status, 'code2', null)) ? _.get(status, 'code1', null) === "urn:oasis:names:tc:SAML:2.0:status:Success" : false
    }

    _getStatus(status){
        return _.get(status, 'code2', null) === "urn:be:cin:nippin:SAML:status:PartialAnswer" ? this.localize("mda-partialAnswer", "Partial answer", this.language)  :
            _.get(status, 'code2', null) === "urn:be:cin:nippin:SAML:status:AttributeQueryError" ? this.localize("mda-attributeError", "Attribute error", this.language) :
                _.get(status, 'code2', null)
    }

    _getErrorMessage(detail){
        return _.get(detail, "detailCode", null) === "FACET_EXCEPTION" ? "" : _.get(detail, "detailCode", null) === "MISMATCHED_CONTACTTYPE" ? "Type de contact non disponible" : _.get(detail, "message.value", null)
    }

    _getMcnErrorMessage(errorMessage){
        return _.get(errorMessage, "uid", null)+' - '+(this.language === "fr" ? _.get(errorMessage, "msgFr", null) : this.language === "nl" ? _.get(errorMessage, "msgNl", null) : _.get(errorMessage, "msgEn", null))
    }

    _isMcnError(mcnErrors){
        return !!_.size(mcnErrors)
    }

    _getServiceInfo(service){
        return service ? service+" - "+_.get(_.get(this.hospitalServiceList, 'hospitalServiceList', []).find(s => s.code === service), 'description.'+this.language, null) : null
    }

    _isFacetExeption(type, mdaResult){
        return  !_.isEmpty(mdaResult) && _.get(mdaResult, "status.code2", null) === "urn:be:cin:nippin:SAML:status:PartialAnswer" && !_.isEmpty(_.flatten((_.get(mdaResult, "errors", []) || []).map(err => _.get(err, 'details.details', []))).filter(detail => _.get(detail, "detailCode", null) === "FACET_EXCEPTION").find(fe => _.toUpper(fe.detailSource) === _.toUpper(type)))
    }

    _ifData(mdaResult){
        return !_.isEmpty(mdaResult)
    }

    _isAssertion(mdaResult){
        return _.size(_.get(mdaResult, 'assertions', []))
    }
}
customElements.define(HtPatMemberDataResponse.is, HtPatMemberDataResponse);
