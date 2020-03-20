import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../dynamic-form/dynamic-doc.js';
import './ht-pat-hub-medication-scheme-view.js';
import '../../../../styles/scrollbar-style.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/paper-tabs-style.js';
import * as models from 'icc-api/dist/icc-api/model/models';
import moment from 'moment/src/moment';
import { Base64 } from 'js-base64';

import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatHubDiaryNoteView extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="scrollbar-style dialog-style paper-tabs-style">

            #dialog .hub-cons{
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                box-sizing: border-box;
            }

            #dialog paper-button.action {
                --paper-button-ink-color: var(--app-secondary-color-dark);
                font-weight: 400;
                font-size: 12px;
                height: 32px;
                padding: 10px 1.2em;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                background: var(--app-secondary-color);
                color: var(--app-primary-color-dark);
                justify-self: flex-end;
            }
            #dialog .hub-cons paper-button.action[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            #dialog .hub-cons .buttons {
                right: 24px;
                position: absolute;
            }

            #dialog .hub-cons vaadin-date-picker {
                margin-right: 8px;
            }

            #dialog a {
                text-decoration: none;
                color:	var(--app-secondary-color);
            }

            #dialog{
                min-height: 800px;
                min-width: 1024px;
            }

            #dialog .hub-doc {
                overflow: auto ;
                max-height: 500px;
            }



            .links {
                position: absolute;
                right: 0;
            }

            .pills {
                float: right;
            }

            dynamic-link {
                float: right;
                top:4px;
            }

            vaadin-combo-box {
                width: 100%;
            }

            vaadin-text-area {
                width: 100%;
            }

            .containerHubCons {
                height: 58px;
                display: flex;
            }

            #par-search {
                flex: 1;
            }

            #dialog .hub-info{
                margin-top:0;
                display:flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: flex-start;
            }

            #dialog .hub-info div{
                margin-right: 24px;
            }

            #dialog .hub-info div p{
                margin: 8px 0;
            }

            #dialog .hub-info div b{
                margin-right: 8px;
            }

            .modal-title{
                background:  var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
            }

            .end-buttons {
                display: flex;
                position: absolute;
                right: 0;
                bottom: 0;
            }

            ht-spinner {
                position: relative;
                height: 42px!important;
                width: 42px!important;
            }

            #kmehr_slot{
                overflow-y: scroll;
                height: 90%;
            }

            #titleInfo{
                height: 20px;
                width: 98%;
                margin-bottom: 12px;
                font-size: 20px;
                font-weight: bold;
            }

            .headerInfo{
                height: auto;
                width: 100%;
                box-sizing: border-box;
            }

            #blockInfo{
                height: auto;
                width: 100%;
                box-sizing: border-box;
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

            .hub-doc-container{
                border: 1px solid var(--app-background-color-dark);
                margin-bottom: 12px;
            }

            .headerMasterTitle{
                font-size: var(--font-size-large);
                background: var(--app-background-color-dark);
                padding: 0 12px;
                box-sizing: border-box;
            }

            .blockInfo{
                height: auto;
                width: 100%;
                box-sizing: border-box;
            }

            .vaadinStyle{
                height: auto;
                border: none;
            }

            .doNotDisplay {
                display: none;
            }

            .pageContent{
                padding: 12px;
                width: auto;
                box-sizing: border-box;
            }

            iron-pages{
                height: calc(100% - 48px);
                width: auto;
                overflow: auto;
            }

            .selectedDocumentToImportContent{
                height: 260px;
                width: auto;
                margin: 12px;
            }

            #importHubDocumentDialog{
                height: 400px;
                width: 650px;
            }

            .pat-details-card > .card-content {
                padding: 16px 16px 32px !important;
            }

            .pat-details-card {
                margin: 0 32px 32px;
                padding:0 8px 8px;
                overflow: hidden;
                width: calc(100% - 64px);
            }

            .pat-details-card.fullWidth {
                margin: 0 0 32px 0;
                width: 100%;
            }

            .pat-details-card hr {
                border: 1px solid var(--app-background-color-darker)
            }

            .form-title {
                color: var(--app-primary-color);
                border-top: 2px solid var(--app-background-color-dark);
                border-radius: 2px 2px 0 0;
                background: var(--app-background-color-dark);
                font-size: 12px;
                margin: 0 0 8px -8px;
                padding: 2px 4px 2px 20px;
                display: flex;
                flex-flow: row nowrap;
                width: calc(100% - 8px);
                text-align: left;
                justify-content: space-between;
                align-items: center;
            }
            .form-title > span {
                flex-grow: 1;
                min-width: 100px;
            }

            .form-title >div {
                flex-grow: 0;
                min-width: 20px;
            }

            .full-height {
                height: 100%;
            }

            .tabIcon{
                padding-right: 10px;
            }

            .tel-line{
                display: flex;
                align-items: center;
            }

            .tel-line iron-icon{
                color: var(--app-text-color-disabled);
                height: 16px;
                width: 16px;
                margin-right: 4px;
            }

            .chronicIcon{
                height: 12px;
                width: 12px;
            }

            .oneShotIcon{
                height: 12px;
                width: 12px;
                color: #c60b44;
            }

            .legend-oneShotIcon{
                height: 18px;
                width: 18px;
                color: #c60b44;
            }

            .legend-compoundIcon{
                height: 14px;
                width: 14px;
                color: #2882ff;
            }

            .legend-substanceIcon{
                height: 14px;
                width: 14px;
                color: #c62ac4;
            }

            .legend-line{
                margin-right: 8px;
                font-size: var(--font-size-normal);
            }

            #legend {
                background: var(--app-background-color);
                border-radius: 4px;
                padding: 4px;
                width: 100%;
                box-sizing: border-box;
                margin-bottom: 12px;
            }

            .vaadin-temporality{
                width: 30px!important;
            }

            .hub-doc{
                border: 1px solid var(--app-background-color-dark);
                margin-bottom: 10px;
            }

            .hub-doc-title{
                height: auto;
                width: auto;
                background: var(--app-background-color-dark);
                padding: 4px;
            }

            .hub-doc-content{
                margin: 4px;
            }

            .iron-icon{
                height: 16px;
                width: 16px;
                padding: 4px;
            }

        </style>

        <template is="dom-if" if="[[isLoading]]">
            <div class="headerMasterTitle headerLabel">[[localize('hub-diary-note',"L'initialisation du journal peut prendre un certain temps",language)]]</div>
            <ht-spinner style="height: 20px!important; with:20px!important" active="[[isLoading]]"></ht-spinner>
        </template>
        <div class="pageContent">
            <div class="hub-doc">
                <div class="hub-doc-title"> <iron-icon icon="vaadin:filter" class="iron-icon"></iron-icon>[[localize('diary-filters', 'Filters', language)]]</div>
                <div class="hub-doc-content">
                    <vaadin-checkbox checked="{{filters.antibiotherapy}}" id="antibiotherapy" on-tap="_filterCheckChanged">[[localize('cd-diary-antibiotherapy', 'Antibiotherapy', language)]]</vaadin-checkbox>
                    <vaadin-checkbox checked="{{filters.diabetes}}" id="diabetes" on-tap="_filterCheckChanged">[[localize('cd-diary-diabetes', 'Diabetes', language)]]</vaadin-checkbox>
                    <vaadin-checkbox checked="{{filters.medication}}" id="medication" on-tap="_filterCheckChanged">[[localize('cd-diary-medication', 'Medication', language)]]</vaadin-checkbox>
                    <vaadin-checkbox checked="{{filters.movement}}" id="movement" on-tap="_filterCheckChanged">[[localize('cd-diary-movement', 'Movement', language)]]</vaadin-checkbox>
                    <vaadin-checkbox checked="{{filters.nutrition}}" id="nutrition" on-tap="_filterCheckChanged">[[localize('cd-diary-nutrition', 'Nutrition', language)]]</vaadin-checkbox>
                    <vaadin-checkbox checked="{{filters.oncology}}" id="oncology" on-tap="_filterCheckChanged">[[localize('cd-diary-oncology', 'Oncology', language)]]</vaadin-checkbox>
                    <vaadin-checkbox checked="{{filters.renalinsufficiency}}" id="renalinsufficiency" on-tap="_filterCheckChanged">[[localize('cd-diary-renalinsufficiency', 'Renal insufficiency', language)]]</vaadin-checkbox>
                    <vaadin-checkbox checked="{{filters.woundcare}}" id="woundcare" on-tap="_filterCheckChanged">[[localize('cd-diary-woundcare', 'Woundcare', language)]]</vaadin-checkbox>
                </div>
            </div>
            <template is="dom-repeat" items="[[availableTransactionOfDiaryNote]]" as="message">
                <div class="hub-doc">
                    <div class="hub-doc-title">
                        <iron-icon icon="vaadin:newspaper" class="iron-icon"></iron-icon>[[dateFormatTitle(message.transaction.recorddatetime)]]
                        <template is="dom-repeat" items="[[_getDiaryType(message)]]" as="tag">
                            <iron-icon icon="vaadin:bookmark" class="iron-icon"></iron-icon> [[_getDiaryTypeDescription(tag)]]
                        </template>
                    </div>
                    <div class="hub-doc-content">
                        <template is="dom-repeat" items="[[message.folders]]" as="folder">
                            <div class="hub-doc-container">
                                <div class="headerMasterTitle headerLabel">[[localize('hub_pat','First name',language)]]</div>
                                <div class="headerInfo">
                                    <div class="headerInfoLine">
                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_las_nam','Last name',language)]]: &nbsp; </span> [[folder.patient.familyname]]</div>
                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_fir_nam','First name',language)]]: &nbsp; </span> [[folder.patient.firstnames.0]] ([[folder.patient.sex.value]])</div>
                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_bir_dat','Birth date',language)]]: &nbsp; </span> [[dateFormat(folder.patient.birthdate)]]</div>
                                        <template is="dom-repeat" items="[[folder.patient.addresses]]" as="address">
                                            <div class="headerInfoField tel-line"><span class="headerLabel">[[localize('hub_adr','Adress',language)]] </span>
                                                <template is="dom-if" if="[[_isEqual(address.addressType,'work')]]"><iron-icon icon="social:domain"></iron-icon></template>
                                                <template is="dom-if" if="[[_isEqual(address.addressType,'home')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                <template is="dom-if" if="[[_isEqual(address.addressType,'other')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                <template is="dom-if" if="[[_isEqual(address.addressType,'vacation')]]"><iron-icon icon="places:beach-access"></iron-icon></template>
                                                <template is="dom-if" if="[[_isEqual(address.addressType,'careaddress')]]"><iron-icon icon="social:location-city"></iron-icon></template>
                                                [[address.street]] [[address.houseNumber]] [[address.postboxNumber]] [[address.zip]] [[address.city]]</div>
                                        </template>
                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_inss','Inss',language)]]: &nbsp; </span> </div>
                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_loc','Locality',language)]]: &nbsp; </span> [[folder.patient.addresses.0.zip]] [[folder.patient.addresses.0.city]]</div>
                                    </div>
                                </div>
                            </div>
                            <template is="dom-repeat" items="[[folder.transactions]]" as="trn">
                                <template is="dom-if" if="[[_isAuthor(trn.author.hcparties)]]">
                                    <div class="hub-doc-container">
                                        <div class="headerMasterTitle headerLabel">[[localize('hub_auth','Author(s)',language)]]</div>
                                        <template is="dom-repeat" items="[[_getHcpInfo(trn.author.hcparties)]]" as="hcp">
                                            <div class="headerInfo">
                                                <div class="headerInfoLine">
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_las_nam','Last name',language)]]: &nbsp;</span> [[hcp.name]] [[hcp.familyName]]</div>
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_fir_nam','First name',language)]]: &nbsp;</span> [[hcp.firstName]]</div>
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_hcp_type','Type',language)]]: &nbsp;</span> [[_localizeHcpType(hcp.type)]]</div>
                                                    <template is="dom-repeat" items="[[hcp.addresses]]" as="address">
                                                        <div class="headerInfoField tel-line"><span class="headerLabel">[[localize('hub_adr','Adress',language)]] </span>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'work')]]"><iron-icon icon="social:domain"></iron-icon></template>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'home')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'other')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'vacation')]]"><iron-icon icon="places:beach-access"></iron-icon></template>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'careaddress')]]"><iron-icon icon="social:location-city"></iron-icon></template>
                                                            [[address.street]] [[address.houseNumber]] [[address.postboxNumber]] [[address.zip]] [[address.city]]</div>
                                                    </template>
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_inss','Inss',language)]]: &nbsp;</span> [[hcp.inss]]</div>
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_nihii','Nihii',language)]]: &nbsp;</span> [[hcp.nihii]]</div>
                                                    <template is="dom-repeat" items="[[hcp.telecoms]]" as="tel">
                                                        <template is="dom-if" if="[[tel.telecomNumber]]">
                                                            <div class="headerInfoField tel-line">
                                                                <template is="dom-if" if="[[_isEqual(tel.telecomType,'phone')]]"> <iron-icon icon="maps:local-phone"></iron-icon> </template>
                                                                <template is="dom-if" if="[[_isEqual(tel.telecomType,'email')]]"> <iron-icon icon="icons:mail"></iron-icon> </template>
                                                                <template is="dom-if" if="[[_isEqual(tel.telecomType,'fax')]]"> <iron-icon icon="icons:print"></iron-icon> </template>
                                                                [[tel.telecomNumber]] ([[tel.addressType]])
                                                            </div>
                                                        </template>
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[_isRedactor(trn.redactor.hcparties)]]">
                                    <div class="hub-doc-container">
                                        <div class="headerMasterTitle headerLabel">[[localize('hub_redact','Redactor(s)',language)]]</div>
                                        <template is="dom-repeat" items="[[_getHcpInfo(trn.redactor.hcparties)]]" as="hcp">
                                            <div class="headerInfo">
                                                <div class="headerInfoLine">
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_las_nam','Last name',language)]]: </span> [[hcp.name]] [[hcp.familyName]]</div>
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_fir_nam','First name',language)]]: </span> [[hcp.firstName]]</div>
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_hcp_type','Type',language)]]: </span> [[_localizeHcpType(hcp.type)]]</div>
                                                    <template is="dom-repeat" items="[[hcp.addresses]]" as="address">
                                                        <div class="headerInfoField tel-line"><span class="headerLabel">[[localize('hub_adr','Adress',language)]] </span>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'work')]]"><iron-icon icon="social:domain"></iron-icon></template>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'home')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'other')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'vacation')]]"><iron-icon icon="places:beach-access"></iron-icon></template>
                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'careaddress')]]"><iron-icon icon="social:location-city"></iron-icon></template>
                                                            [[address.street]] [[address.houseNumber]] [[address.postboxNumber]] [[address.zip]] [[address.city]]</div>
                                                    </template>
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_inss','Inss',language)]]: </span> [[hcp.inss]] </div>
                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_nihii','Nihii',language)]]: </span> [[hcp.nihii]] </div>
                                                    <template is="dom-repeat" items="[[hcp.telecoms]]" as="tel">
                                                        <template is="dom-if" if="[[tel.telecomNumber]]">
                                                            <div class="headerInfoField tel-line">
                                                                <template is="dom-if" if="[[_isEqual(tel.telecomType,'phone')]]"> <iron-icon icon="maps:local-phone"></iron-icon> </template>
                                                                <template is="dom-if" if="[[_isEqual(tel.telecomType,'email')]]"> <iron-icon icon="icons:mail"></iron-icon> </template>
                                                                <template is="dom-if" if="[[_isEqual(tel.telecomType,'fax')]]"> <iron-icon icon="icons:print"></iron-icon> </template>
                                                                [[tel.telecomNumber]] ([[tel.addressType]])
                                                            </div>
                                                        </template>
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[_isSumehrType(transInfo)]]">
                                    <template is="dom-repeat" items="[[_processTransactionItemAndHeadingItem(trn)]]" as="item">
                                        <div class="hub-doc-container">
                                            <div class="headerMasterTitle headerLabel">[[_getTraduction(item.0.type)]]</div>
                                            <div class="blockInfo">
                                                <template is="dom-if" if="[[_ifTableView(item.0.type)]]">
                                                    <template is="dom-if" if="[[_isVaccineData(item.0.type)]]">
                                                        <vaadin-grid class="vaadinStyle" items="[[item]]">
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_titl','Title',language)]]
                                                                </template>
                                                                <template>
                                                                    [[_getTitle(item.contents, item.type)]]
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_sta_dat','Start date',language)]]
                                                                </template>
                                                                <template>
                                                                    [[_convertHubDateAsString(item.beginMoment)]]
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_code','Code',language)]]
                                                                </template>
                                                                <template>
                                                                    <template is="dom-repeat" items="[[_getCode(item.contents, item.type)]]" as="code">
                                                                        [[code.code]] [[_localizeVaccine(code.value)]]<br>
                                                                    </template>
                                                                </template>
                                                            </vaadin-grid-column>
                                                        </vaadin-grid>
                                                    </template>
                                                    <template is="dom-if" if="[[_isMedicationData(item.0.type)]]">
                                                        <div id="legend">
                                                            <span class="legend-line bold">[[localize('legend', 'Legend', language)]]: </span>
                                                            <span class="legend-line"><iron-icon class="legend-chronicIcon" icon="icons:alarm-on"></iron-icon> [[localize('hub-chron-med', 'Chronic medication', language)]]</span>
                                                            <span class="legend-line"><iron-icon class="legend-oneShotIcon" icon="vaadin:thumbs-up-o"></iron-icon> [[localize('hub-one-shot', 'One shot', language)]]</span>
                                                        </div>
                                                        <vaadin-grid class="vaadinStyle" items="[[item]]">
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('medication','Medication',language)]]
                                                                </template>
                                                                <template>
                                                                    <template is="dom-if" if="[[_isChronic(item.temporality)]]">
                                                                        <iron-icon class="chronicIcon" icon="icons:alarm-on"></iron-icon>
                                                                    </template>
                                                                    <template is="dom-if" if="[[_isOneShot(item.temporality)]]">
                                                                        <iron-icon class="oneShotIcon" icon="vaadin:thumbs-up-o"></iron-icon>
                                                                    </template>
                                                                    [[_getTitle(item.contents, item.type)]]
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('pos','Posology',language)]]
                                                                </template>
                                                                <template>
                                                                    <template is="dom-repeat" items="[[item.regimen]]" as="regimen">
                                                                        [[_getRegimenAsText(regimen)]] <br>
                                                                    </template>
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_sta_dat','Start date',language)]]
                                                                </template>
                                                                <template>
                                                                    [[_convertHubDateAsString(item.beginMoment)]]
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_end_dat','End date',language)]]
                                                                </template>
                                                                <template>
                                                                    [[_convertHubDateAsString(item.endMoment)]]
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_code','Code',language)]]
                                                                </template>
                                                                <template>
                                                                    <template is="dom-repeat" items="[[_getCode(item.contents, item.type)]]" as="code">
                                                                        [[code.code]] [[code.value]]<br>
                                                                    </template>
                                                                </template>
                                                            </vaadin-grid-column>
                                                        </vaadin-grid>
                                                    </template>
                                                    <template is="dom-if" if="[[_isOtherData(item.0.type)]]">
                                                        <vaadin-grid class="vaadinStyle" items="[[item]]">
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_titl','Title',language)]]
                                                                </template>
                                                                <template>
                                                                    [[_getTitle(item.contents, item.type)]]
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_sta_dat','Start date',language)]]
                                                                </template>
                                                                <template>
                                                                    [[_convertHubDateAsString(item.beginMoment)]]
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_end_dat','End date',language)]]
                                                                </template>
                                                                <template>
                                                                    [[_convertHubDateAsString(item.endMoment)]]
                                                                </template>
                                                            </vaadin-grid-column>
                                                            <vaadin-grid-column>
                                                                <template class="header">
                                                                    [[localize('hub_code','Code',language)]]
                                                                </template>
                                                                <template>
                                                                    <template is="dom-repeat" items="[[_getCode(item.contents, item.type)]]" as="code">
                                                                        [[code.code]] [[code.value]]<br>
                                                                    </template>
                                                                </template>
                                                            </vaadin-grid-column>
                                                        </vaadin-grid>
                                                    </template>
                                                </template>
                                                <template is="dom-if" if="[[!_ifTableView(item.0.type)]]">
                                                    <template is="dom-repeat" items="[[item]]" as="item">
                                                        <template is="dom-if" if="[[_isHcp(item.type)]]">
                                                            <template is="dom-repeat" items="[[item.contents]]" as="content">
                                                                <template is="dom-repeat" items="[[content.authors]]" as="hcp">
                                                                    <div class="headerInfoLine">
                                                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_las_nam','Last name',language)]]: </span> [[hcp.name]] [[hcp.familyName]]</div>
                                                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_fir_nam','First name',language)]]: </span> [[hcp.firstName]]</div>
                                                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_hcp_type','Type',language)]]: </span> [[_localizeHcpType(hcp.type)]]</div>
                                                                        <template is="dom-repeat" items="[[hcp.addresses]]" as="address">
                                                                            <div class="headerInfoField tel-line"><span class="headerLabel">[[localize('hub_adr','Adress',language)]] </span>
                                                                                <template is="dom-if" if="[[_isEqual(address.addressType,'work')]]"><iron-icon icon="social:domain"></iron-icon></template>
                                                                                <template is="dom-if" if="[[_isEqual(address.addressType,'home')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                                                <template is="dom-if" if="[[_isEqual(address.addressType,'other')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                                                <template is="dom-if" if="[[_isEqual(address.addressType,'vacation')]]"><iron-icon icon="places:beach-access"></iron-icon></template>
                                                                                <template is="dom-if" if="[[_isEqual(address.addressType,'careaddress')]]"><iron-icon icon="social:location-city"></iron-icon></template>
                                                                                [[address.street]] [[address.houseNumber]] [[address.postboxNumber]] [[address.zip]] [[address.city]]</div>
                                                                        </template>
                                                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_inss','Inss',language)]]: </span> [[hcp.inss]] </div>
                                                                        <div class="headerInfoField"><span class="headerLabel">[[localize('hub_nihii','Nihii',language)]]: </span> [[hcp.nihii]] </div>
                                                                    </div>
                                                                </template>
                                                            </template>
                                                        </template>
                                                        <template is="dom-if" if="[[_isPerson(item.type)]]">
                                                            <template is="dom-repeat" items="[[item.contents]]" as="content">
                                                                <div class="headerInfoLine">
                                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_las_nam','Last name',language)]]: </span> [[content.persons.name]] [[content.persons.familyName]]</div>
                                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_fir_nam','First name',language)]]: </span> [[content.persons.firstName]]</div>
                                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_person_type','Rel type ',language)]]: </span> [[content.persons.type]]</div>
                                                                    <template is="dom-repeat" items="[[content.persons.addresses]]" as="address">
                                                                        <div class="headerInfoField tel-line"><span class="headerLabel">[[localize('hub_adr','Adress',language)]] </span>
                                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'work')]]"><iron-icon icon="social:domain"></iron-icon></template>
                                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'home')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'other')]]"><iron-icon icon="icons:home"></iron-icon></template>
                                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'vacation')]]"><iron-icon icon="places:beach-access"></iron-icon></template>
                                                                            <template is="dom-if" if="[[_isEqual(address.addressType,'careaddress')]]"><iron-icon icon="social:location-city"></iron-icon></template>
                                                                            [[address.street]] [[address.houseNumber]] [[address.postboxNumber]] [[address.zip]] [[address.city]]</div>
                                                                    </template>
                                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_inss','Inss',language)]]: </span> [[content.persons.inss]] </div>
                                                                    <div class="headerInfoField"><span class="headerLabel">[[localize('hub_loc','Locality',language)]]: </span> [[content.persons.addresses.0.zip]] [[content.persons.addresses.0.city]]</div>
                                                                </div>
                                                            </template>
                                                        </template>
                                                        <template is="dom-if" if="[[_isPatientWill(item.type)l]]" as="pw">
                                                            <template is="dom-repeat" items="[[item.contents]]" as="content">
                                                                <template is="dom-repeat" items="[[content.cds]]" as="will">
                                                                    <div class="headerInfoLine">
                                                                        [[_getPatientWill(will)]]
                                                                    </div>
                                                                </template>
                                                            </template>
                                                        </template>
                                                    </template>
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                </template>
                            </template>
                        </template>
                    </div>

                    <template is="dom-if" if="[[!_isSumehrType(transInfo)]]">
                        <template is="dom-repeat" items="[[message.folders]]" as="folder">
                            <template is="dom-repeat" items="[[folder.transactions]]" as="trn">
                                <template is="dom-repeat" items="[[_txtsWithCnt(trn)]]" as="txt">
                                    <paper-card class="pat-details-card ">
                                        <div class="form-title"> &nbsp;</div>
                                        <p>[[_textData(txt.value)]]</p>
                                    </paper-card>
                                </template>
                                <template is="dom-repeat" items="[[_textsWithLayoutWithCnt(trn)]]" as="ftxt">
                                    <dynamic-doc api="[[api]]" user="[[user]]" patient="[[patient]]" data="[[_textWithLayoutData(ftxt)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" title="[[lnk.mediatype]]" downloadable="true" preview="true" is-pat-detail="false"></dynamic-doc>
                                </template>
                                <template is="dom-repeat" items="[[_lnksWithCnt(trn)]]" as="lnk">
                                    <dynamic-doc api="[[api]]" user="[[user]]" patient="[[patient]]" data="[[_linkData(lnk)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" title="[[lnk.mediatype]]" transaction-info="[[trn]]" downloadable="true" preview="true" is-pat-detail="false" hub-importable="true" on-import-hub-document="_importDocumentIntoPatientDialog"></dynamic-doc>
                                </template>
                            </template>
                        </template>
                    </template>
                </div>
            </template>
        </div>
`;
  }

  static get is() {
      return 'ht-pat-hub-diarynote-view';
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
          patient:{
              type: Object
          },
          language: {
              type: String
          },
          tabs: {
              type:  Number,
              value: 0
          },
          isLoading:{
              type: Boolean,
              value: false
          },
          transInfo:{
              type: Object,
              value: null
          },
          message:{
              type: Object,
              value: null
          },
          diaryNote:{
              type: Array,
              value: () => []
          },
          transactionOfDiaryNote:{
              type: Array,
              value: () => []
          },
          filters:{
              type: Object,
              value: {
                  antibiotherapy: true,
                  diabetes: true,
                  medication: true,
                  movement: true,
                  nutrition: true,
                  oncology: true,
                  renalinsufficiency: true,
                  woundcare: true
              }
          },
          availableTransactionOfDiaryNote:{
              type: Array,
              value: () => []
          }
      };
  }

  static get observers() {
      return ['apiReady(api,user,opened, transactionOfDiaryNote)', '_getDiaryNote(api, transactionOfDiaryNote)', '_filterChanged(filters, filters.*)'];
  }

  ready() {
      super.ready();
  }

  _isEqual(a,b) {
      return (a === b)
  }


  _textData(txt){
      if(txt){
          //console.log("text:", txt)
          return txt
      }else{
          return null
      }
  }

  _textWithLayoutData(ftxt){
      if(ftxt){
          //console.log("textWL:", ftxt)
          return ftxt
      }else{
          return null
      }
  }

  _linkData(lnk){
      if(lnk){
          //console.log("lnk:", lnk)
          return lnk
      }else{
          return null
      }
  }

  _lnks(trn) {
      let lnks = _.flatMap(trn.item || [], it => this._lnks(it)).concat(_.flatMap(trn.heading, it => this._lnks(it))).concat(_.flatMap(trn.lnk || [], it => it)).concat(_.flatMap(trn.lnks || [], it => it))
      lnks = lnks.filter(it => !it.url || it.url.substring(0,13) !== "//transaction")
      return lnks
  }

  _lnksWithCnt(trn){
      let lnks = this._lnks(trn)
      this.set("attachmentCount", this.attachmentCount + lnks.length)
      return lnks;
  }

  _txts(trn) {
      let txts =_.flatMap(trn.item || [], it => this._txts(it)).concat(_.flatMap(trn.heading, it => this._txts(it))).concat(_.flatMap(trn.text || [], it => it)).concat(_.flatMap(trn.texts || [], it => it))
      return txts
  }

  _txtsWithCnt(trn){
      let txts = this._txts(trn)
      this.set("attachmentCount", this.attachmentCount + txts.length)
      return txts;
  }

  _textsWithLayout(trn) {
      //todo add mimetype + filename
      let txts = _.flatMap(trn.item || [], it => this._textsWithLayout(it)).concat(_.flatMap(trn.heading, it => this._textsWithLayout(it))).concat(_.flatMap(trn.textWithLayout || [], it => it))
      return txts
  }

  _textsWithLayoutWithCnt(trn){
      let txts = this._textsWithLayout(trn)
      this.set("attachmentCount", this.attachmentCount + txts.length)
      return txts;
  }

  apiReady() {
      if (!this.api || !this.user || !this.user.id || !this.opened) return;
      this.set('isLoading',true);
      this.set('availableTransactionOfDiaryNote', _.get(this, 'transactionOfDiaryNote', []))
      try {
      } catch (e) {
          console.log(e);
      }
  }

  _getTimes(simplifiedMs){
      const times = _.uniq(_.flatMap(simplifiedMs.msElems, msElem=>_.flatMap(msElem.regimen, reg=>_.flatMap(reg, ritm => ritm.dayTime))).filter(it => !isNaN(it))).sort();
      return times;
  }

  _isSumehr(transInfo){
      return this._transactionType(transInfo) === 'sumehr';
  }

  _isDiaryNote(transInfo){
      return this._transactionType(transInfo) === 'diarynote';
  }

  _isOther(transInfo){
      return !( this._isSumehr(transInfo) || this._isDiaryNote(transInfo));
  }


  dateFormat(date){
      return _.get(date, "date.millis", null) ? this.api.moment(_.get(date, "date.millis", null)).format('DD/MM/YYYY') : null
  }

  dateFormatTitle(date){
      return date ? this.api.moment(date).format('DD/MM/YYYY') : null
  }

  _transactionType(tr){
      if(tr) {
          const cdTransType = tr.cds.find(cd => cd.s === "CD-TRANSACTION");
          if (cdTransType) {
              return cdTransType.value;
          }
          else {
              return "--";
          }
      } else {
          return "";
      }
  }

  _getHcpInfo(hcps){
      let hcpInfo = []

      if(hcps){
          hcps.map(hcp => {
              hcp && hcp.cds && hcp.cds.find(cd => cd && cd.s === "CD_HCPARTY") && hcp.cds.find(cd => cd && cd.s === "CD_HCPARTY").value !== "hub" ?
                  hcpInfo.push({
                      name: hcp.name || null,
                      firstName: hcp.firstname || null,
                      familyName: hcp.familyname || null,
                      inss: hcp && hcp.ids && hcp.ids.find(id => id && id.s === 'INSS') && hcp.ids.find(id => id && id.s === 'INSS') ? hcp.ids.find(id => id && id.s === 'INSS').value : null,
                      nihii: hcp && hcp.ids && hcp.ids.find(id => id && id.s === 'ID_HCPARTY') && hcp.ids.find(id => id && id.s === 'ID_HCPARTY').value ? hcp.ids.find(id => id && id.s === 'ID_HCPARTY').value : null,
                      type: hcp && hcp.cds && hcp.cds.find(cd => cd && cd.s === "CD_HCPARTY") && hcp.cds.find(cd => cd && cd.s === "CD_HCPARTY").value ? hcp.cds.find(cd => cd && cd.s === "CD_HCPARTY").value : null,
                      addresses: this._getAdresses(hcp.addresses) || [],
                      telecoms: this._getTelecoms(hcp.telecoms) || []
                  }) : null
          })
      }

      return hcpInfo
  }

  _getPersonInfo(person){
      let personInfo = {}

      person ?
          personInfo = {
              inss: person.ids && person.ids.find(id => id.s === "INSS") && person.ids.find(id => id.s === "INSS").value ? person.ids.find(id => id.s === "INSS").value : null,
              firstName: person.firstnames.join(' ') || null,
              familyName: person.familyname || null,
              birthdate: person.birthdate || null,
              deathdate: person.deathdate || null,
              sex : person.sex && person.sex.value || null,
              addresses: this._getAdresses(person.addresses) || [],
              telecoms: this._getTelecoms(person.telecoms) || [],
              type: person && person.cds && person.cds.find(cd => cd && cd.s === "CD_HCPARTY") && person.cds.find(cd => cd && cd.s === "CD_HCPARTY").value ? person.cds.find(cd => cd && cd.s === "CD_HCPARTY").value : null,
          }
          : null

      return personInfo

  }


  _getAdresses(addresses){
      let addressesInfo = []
      addresses.map(adr => addressesInfo.push({
              addressType: adr && adr.cds && adr.cds.find(cd => cd.s === "CD_ADDRESS") && adr.cds.find(cd => cd.s === "CD_ADDRESS").value ? adr.cds.find(cd => cd.s === "CD_ADDRESS").value : null,
              country: adr && adr.country && adr.country.cd && adr.country.cd.s  && adr.country.cd.s === "CD_FED_COUNTRY" && adr.country.cd.value ? adr.country.cd.value : null,
              zip: adr.zip || null,
              nis: adr.nis || null,
              city: adr.city || null,
              district : adr.district || null,
              street : adr.street || null,
              houseNumber: adr.housenumber || null,
              postboxNumber :adr.postboxnumber || null
          })
      )

      return addressesInfo
  }

  _getTelecoms(telecoms){
      let telecomInfo = []
      telecoms.map(tel => telecomInfo.push({
          addressType: tel && tel.cds && tel.cds.find(cd => cd.s === "CD_ADDRESS") && tel.cds.find(cd => cd.s === "CD_ADDRESS").value ? tel.cds.find(cd => cd.s === "CD_ADDRESS").value : null,
          telecomType: tel && tel.cds && tel.cds.find(cd => cd.s === "CD_TELECOM") && tel.cds.find(cd => cd.s === "CD_TELECOM").value ? tel.cds.find(cd => cd.s === "CD_TELECOM").value : null,
          telecomNumber : tel.telecomnumber
      }))

      return telecomInfo
  }

  _processTransactionItemAndHeadingItem(trn){
      const trnListOfItem = this._processItem(trn.item, "transaction");
      const headingListOfItem = trn.heading ? this._processItem(_.flatMap(trn.heading.map(it => it.item)), "heading") : [];
      return headingListOfItem.concat(trnListOfItem);
  }

  _processItem(listOfItem, itemParent){

      let newListOfItem = []

      if(listOfItem){
          listOfItem.map(item => newListOfItem.push({
              type: item && item.cds && item.cds.find(cd => cd && cd.s === "CD_ITEM") && item.cds.find(cd => cd && cd.s === "CD_ITEM").value ? item.cds.find(cd => cd && cd.s === "CD_ITEM").value : null,
              contents: this._getItemsContents(item.contents),
              beginMoment: item && item.beginmoment && item.beginmoment.date || null,
              endMoment: item && item.endmoment && item.endmoment.date || null,
              lifeCycle: item && item.lifecycle && item.lifecycle.cd && item.lifecycle.cd.value || null,
              isRelevant: item && item.isrelevant || null,
              parent: itemParent,
              temporality: item && item.temporality && item.temporality.cd && item.temporality.cd.value || null,
              posology: this._getPosology(item),
              regimen: item && item.regimen ? this._decomposedRegimen(item.regimen) : null
          }))
      }

      return _.orderBy(_.groupBy(newListOfItem, 'type'), ['type'])

  }

  _getItemsContents(contents){
      let contentInfo = []

      if(contents){
          contents.map(c => {
              contentInfo.push({
                  authors: this._getHcpInfo(c.hcparty ? [c.hcparty] : null),
                  persons: this._getPersonInfo(c.person || null),
                  cds: this._getContentCds(c.cds),
                  texts: this._getContentTexts(c.texts),
                  medicinalproduct: c.medicinalproduct

              })


          })
      }
      return contentInfo
  }

  _getContentCds(cds){
      let cdsInfo = []
      cds ? cds.map(cd => { cdsInfo.push({ s: cd.s, value: cd.value }) }) : null
      return cdsInfo
  }

  _getContentTexts(texts){
      let textInfo = []
      texts ? texts.map(txt => {textInfo.push({txtValue: txt.value,lang: txt.l}) }) : null
      return textInfo
  }

  _getTraduction(type){
      return this.localize(type, type, this.language)
  }

  _getTitle(contents, type){
      return type === "medication" || type === "vaccine" ? _.compact(_.flatten(contents.map(ct => ct.medicinalproduct))).map(med => med.intendedname).join(',') || null : _.flatten(contents.map(ct => ct.texts.map(txt => txt.txtValue))).join(',') || null
  }

  _getCode(contents, type){
      let codeList = []
      contents.map(ct => ct.cds.map(cd => {
          codeList.push({
              value: cd.value,
              code: cd.s === "CD_CLINICAL" ? "Ibui: " :
                  cd.s === "CD_ATC" ? "Atc: " :
                      cd.s === "CD_VACCINEINDICATION" ? "" :
                          cd.s === "ICD" ? "Icd: " :
                              cd.s === "ICPC" ? "Icpc: " :
                                  cd.s === "CD_PATIENTWILL" ? "" :
                                      cd.s+": "
          })
      }))

      return codeList
  }

  _ifTableView(type){
      return type === "gmdmanager" || type === "contactperson" || type === "contacthcparty" || type === "patientwill" ? false : true
  }

  _convertHubDateAsString(timestamp){
      if(timestamp){
          let date = parseInt(timestamp) / 1000000
          return this.api.moment(date).format("DD/MM/YYYY")
      }
  }

  _isSumehrType(transInfo){
      return this._transactionType(transInfo) === "sumehr" ? true : false
  }

  _isHcp(type){
      return type === "gmdmanager" || type === "contacthcparty" ? true : false
  }

  _isPerson(type){
      return type === "contactperson" ? true : false
  }

  _isAuthor(hcp){
      return hcp && hcp.length > 0 ? true : false
  }

  _isRedactor(hcp){
      return hcp && hcp.length > 0 ? true : false
  }

  tranformHubTypeToUti(docInfo){
      return docInfo && docInfo.mediatype ? _.toLower(_.split(docInfo.mediatype,'_').join('/')) : "application/pdf"
  }

  _localizeHcpType(type){
      return this.localize("cd-hcp-"+type, type, this.language)
  }

  _isPatientWill(transactionType){
      return transactionType === "patientwill" ? true : false
  }

  _isVaccineData(transactionType){
      return transactionType === "vaccine" ? true : false
  }

  _isMedicationData(transactionType){
      return transactionType === "medication" ? true : false
  }

  _isOtherData(transactionType){
      return transactionType !== "medication" && transactionType !== "vaccine"  ? true : false
  }

  _getPatientWill(cds){
      return cds.s === "CD_PATIENTWILL" ? this.localize('cd-patientwill-'+cds.value, cds.value, this.language) :
          cds.s === "CD_PATIENTWILL_HOS" ? this.localize('cd-patientwill-hos-'+cds.value, cds.value, this.language):
              cds.s === "CD_PATIENTWILL_RES" ? this.localize('cd-patientwill-res-'+cds.value, cds.value, this.language) :
                  cds.value
  }

  _getPosology(item){
      if(item && item.posology){
          //const posology = item.posology || null

      }
  }

  _getRegimenAsText(regimen){
      const administrationInfo = this.administrationUnit.find(adm => adm.code === regimen.administrationUnit) || null
      const adminUnit = administrationInfo && administrationInfo.label && administrationInfo.label[this.language] ? administrationInfo.label[this.language] : ""

      return this._getDayFreqDesc(regimen) + regimen.quantity+" "+adminUnit+" "+ this._getDayTimeDesc(regimen.dayTime)
  }

  _getDayFreqDesc(regimen){
      return regimen.dayNumber ? (this.localize("daynr", "Day #", this.language) + regimen.dayNumber + ":") :
          (regimen.weekDay ? ((regimen.weekNumber ? (this.localize("weeknr", "Week #", this.language) + regimen.weekNumber + ":") : "") + this.localize(regimen.weekDay, regimen.weekDay, this.language) + ":") : (""));
  }

  _getDayTimeDesc(dayTime){

      return !isNaN(dayTime) ? this._getTimeDesc(dayTime) : this.localize('ms_'+_.toLower(dayTime), _.toLower(dayTime), this.language);
  }

  _getTimeDesc(time){
      return  time && time.toString().length >= 14 ? time.toString().substr(8,2) + ":" + time.toString().substr(10,2) : "";
  }

  _isChronic(temporality){
      return temporality && temporality === "CHRONIC" ? true : false
  }

  _isOneShot(temporality){
      return temporality && temporality === "ONESHOT" ? true : false
  }

  _localizeVaccine(value){
      return value && this.localize("cd-vaccine-indication-"+value, value, this.language)
  }

  _getDiaryNote(){
      console.log(this.transactionOfDiaryNote)
      this.set('availableTransactionOfDiaryNote', _.get(this, 'transactionOfDiaryNote', []))
      _.size(_.get(this, 'transactionOfDiaryNote', [])) > 0 ?  this.set('isLoading',false) : this.set('isLoading',true)
  }

  _filterCheckChanged(e){
      if(_.get(e, 'currentTarget.id', null)){
          this.set('filters.'+_.get(e, 'currentTarget.id', null), _.get(e, 'currentTarget.checked', false))
      }
  }

  _filterChanged(){
      console.log(this.transactionOfDiaryNote)
      let transactionFiltered = []
      _.map(this.filters, (value, key) => {
          value ? transactionFiltered = _.concat(transactionFiltered, _.get(this, 'transactionOfDiaryNote', []).filter(t => _.get(t, 'transaction.cds', []).find(cd => _.get(cd, 's', null) === "CD-DIARY" && _.get(cd, 'value', null) === key))) : null
      })
      this.set('availableTransactionOfDiaryNote', _.uniqBy(transactionFiltered, 'header.ids[0].value'))  }

  _getDiaryType(message){
      return _.get(message, 'transaction.cds', []).filter(cd => _.get(cd, 's', null) === "CD-DIARY")
  }

  _getDiaryTypeDescription(tag){
      return this.localize("cd-diary-"+_.get(tag, 'value', null), _.get(tag, 'value', null), this.language)
  }
}
customElements.define(HtPatHubDiaryNoteView.is, HtPatHubDiaryNoteView);
