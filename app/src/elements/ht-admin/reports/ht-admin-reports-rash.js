/**
 @license
 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '../../../styles/dialog-style.js';
import '../../../styles/buttons-style';
import '../../../styles/shared-styles';
import '../../../styles/scrollbar-style';
import '../../../styles/paper-tabs-style';


import XLSX from 'xlsx'
import 'xlsx/dist/shim.min'
import _ from 'lodash/lodash';
import moment from 'moment/src/moment';
import { parse } from '../../../../scripts/icure-reporting'
import { filter as icrFilter } from '../../../../scripts/filters'
import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../../tk-localizer";

class HtAdminReportsRash extends TkLocalizerMixin(PolymerElement){
    static get template() {
        return html`
                      <style include="shared-styles dialog-style buttons-style paper-tabs-style">
                            :host {
                                display: block;
                            }
                
                            :host *:focus{
                                outline:0!important;
                            }
                
                            .rash-panel{
                                width: 100%;
                                height: 100%;
                                grid-column-gap: 24px;
                                grid-row-gap: 24px;
                                padding: 0 24px;
                                box-sizing: border-box;
                                background: white;
                            }
                
                            .rashResult{
                                height: calc(100% - 120px);
                                width: 50%;
                                margin: 1%;
                                overflow: auto;
                            }
                
                            .block-title{
                                height: 20px;
                                width: auto;
                                font-weight: bold;
                            }
                
                            .block-sub-title{
                                font-size: var(--font-size-large);
                                background: var(--app-background-color-dark);
                                padding: 0 12px;
                                box-sizing: border-box;
                                border-radius: 4px 4px 0 0;
                            }
                
                            .block-age-distribution{
                                border: 1px solid var(--app-background-color-dark);
                                margin: 5px;
                                font-size: var(--font-size-large);
                            }
                
                            .block-gender-distribution{
                                border: 1px solid var(--app-background-color-dark);
                                margin: 5px;
                                font-size: var(--font-size-large);
                            }
                
                            .block-home-distribution{
                                border: 1px solid var(--app-background-color-dark);
                                margin: 5px;
                                font-size: var(--font-size-large);
                            }
                
                            .block-bmi{
                                border: 1px solid var(--app-background-color-dark);
                                margin: 5px;
                                font-size: var(--font-size-large);
                            }
                
                            .block-amu{
                                border: 1px solid var(--app-background-color-dark);
                                margin: 5px;
                                font-size: var(--font-size-large);
                            }
                
                            .block-activities{
                                border: 1px solid var(--app-background-color-dark);
                                margin: 5px;
                                font-size: var(--font-size-large);
                            }
                
                            .rashRequest{
                                display: flex;
                            }
                
                            #yearOfRash{
                                padding: 5px;
                            }
                
                            .btn-container{
                                margin: 18px;
                            }
                
                            .btn-icon{
                                height: 14px!important;
                                width: 14px!important;
                            }
                
                            #processDialog{
                                height: 300px;
                                width: 600px
                            }
                
                            #requestInfoDialog{
                                height: 400px;
                                width: 700px;
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
                
                            .btn-container{
                                display: flex;
                            }
                
                            .table{
                                height: auto;
                                width: 98%;
                                padding: 1%;
                            }
                
                            .tr{
                                height: auto;
                                width: 100%;
                                display: flex;
                            }
                
                            .td .info{
                                width: 5%;
                            }
                
                            .td .title{
                                width: 65%;
                            }
                
                            .td .result{
                                width: 28%;
                            }
                
                            .w5{
                                width: 5%;
                            }
                
                            .w65{
                                width: 65%;
                            }
                
                            .w30{
                                width: 28%;
                                text-align: right;
                            }
                
                            .w90{
                                width: 90%;
                            }
                
                            .info-icon{
                                height: 14px;
                                width: 14px;
                                padding: 0px;
                            }
                
                            .requestInfoDialogContent{
                                padding: 5px;
                                font-size: var(--font-size-small);
                                display: block;
                            }
                
                            .processDialogContent{
                                padding: 5px;
                                text-align: center;
                            }
                
                            .process-icon{
                                height: 14px;
                                width: 14px;
                                padding: 0px;
                                color: var(--app-status-color-ok);
                            }
                
                            .center{
                                text-align: center;
                            }
                
                            .left{
                                text-align: left;
                            }
                
                            .containerRequestInfo{
                                padding: 0px;
                                top: 0px;
                                margin: 0px;
                                background-color: white;
                                position: relative;
                                height: 100%;
                            }
                
                            .tabIcon{
                                padding-right: 10px;
                            }
                
                        </style>
                        <div class="rash-panel">
                            <h4 class="section-title">[[localize('rash-report', 'Report', language)]] - [[localize('rash-rash', 'RASH', language)]]</h4>
                
                            <div class="rashRequest">
                                <div class="rashYear">
                                    <vaadin-combo-box id="yearOfRash" filtered-items="[[availableYearForReport]]" item-label-path="label" item-value-path="id" label="[[localize('rash-which-year', 'For which year do you want to generate the Rash report ?', language)]]" selected-item="{{selectedYear}}"></vaadin-combo-box>
                                </div>
                                <div class="btn-container">
                                    <paper-button class="button button--save" on-tap="_getReportInformation"><iron-icon icon="vaadin:download" class="btn-icon"></iron-icon> [[localize('rash-gen-rep','Generate report',language)]]</paper-button>
                                    <paper-button class="button button--other" on-tap="_resetReport"><iron-icon icon="vaadin:close" class="btn-icon"></iron-icon> [[localize('rash-reset','Reset',language)]]</paper-button>
                                </div>
                            </div>
                
                            <template is="dom-if" if="[[_isResultForRequest(queriesResult)]]">
                                <div class="rashResult">
                                    <div class="info-block">
                                        <div class="block-title">
                                            [[localize('rash-jobs-done', 'Jobs done', language)]]
                                        </div>
                                        <div class="block-activities">
                                            <div class="block-sub-title">
                                                [[localize('rash-jobs-done', 'Jobs done', language)]]
                                            </div>
                                            <div class="table">
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="influenza" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-influ', 'Influenza vaccination rate (65 years and over)', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('influenza', queriesResult)]] %</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-dmg', 'Number of DMG (number of patients registred on 31/12)', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div></div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-cons-doc', 'Number of consultations / services performed by a doctor', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div></div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-cons-nurse', 'Number of consultations / services provided by a nurse', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div></div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-cons-phy', 'Number of consultations / services performed by a physiotherapist', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div></div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-cons-ano', 'Number of consultations / services performed by another function', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div></div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-non-flatrate', 'Number of active patients (if ASI fixed price)', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getNumberOfPatientWithoutFlatrateContract(patientList)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-flatrate', 'Number of active patients on the INAMI package (if ASI on the package)', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getNumberOfPatientWithFlatrateContract(patientList)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="colorectalCancer" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-colon', 'Colon cancer screening rate (50 to 75 years)', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('colorectalCancer', queriesResult)]] %</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="breastCancer" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-mammograms', 'Rate of screening mammograms (women aged 50 to 69)', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('breastCancer', queriesResult)]] %</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                
                
                                    <div class="info-block">
                                        <div class="block-title">
                                            [[localize('rash-recipient', 'Recipient', language)]]
                                        </div>
                
                                        <div class="block-age-distribution">
                                            <div class="block-sub-title">
                                                [[localize('rash-age-distrib', 'Age distribution (age groups)', language)]]
                                            </div>
                                            <div class="table">
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="0To4" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>0 - 4 [[localize('rash-years', 'years', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('0To4', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="5To14" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>5 - 14 [[localize('rash-years', 'years', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('5To14', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="15To24" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>15 - 24 [[localize('rash-years', 'years', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('15To24', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="25To44" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>25 - 44 [[localize('rash-years', 'years', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('25To44', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="45To64" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>45 - 64 [[localize('rash-years', 'years', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('45To64', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="65To74" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>65 - 74 [[localize('rash-years', 'years', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('65To74', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="75To94" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>75 - 94 [[localize('rash-years', 'years', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('75To94', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="moreThan95" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-95-and-more', '95 years and more', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('moreThan95', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                
                                        <div class="block-bmi">
                                            <div class="block-sub-title">
                                                [[localize('rash-BIM', 'BIM', language)]]
                                            </div>
                                            <div class="table">
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-BIM', 'BIM', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getNumberOfBim(patientList)]]</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                
                                        <div class="block-amu">
                                            <div class="block-sub-title">
                                                [[localize('rash-amu', 'Emergency help (AMU)', language)]]
                                            </div>
                                            <div class="table">
                                                <div class="tr">
                                                    <div class="td w5">
                
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-amu', 'Emergency help (AMU)', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                
                                        <div class="block-gender-distribution">
                                            <div class="block-sub-title">
                                                [[localize('rash-gender-dist', 'Gender distribution', language)]]
                                            </div>
                                            <div class="table">
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="male" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-male', 'Male', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('male', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="female" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-female', 'Female', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('female', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                                <div class="tr">
                                                    <div class="td w5">
                                                        <paper-icon-button icon="vaadin:info-circle" class="info-icon" id="other" on-tap="_openRequestInfoDialog"></paper-icon-button>
                                                    </div>
                                                    <div class="td w65">
                                                        <div>[[localize('rash-other', 'Other', language)]]</div>
                                                    </div>
                                                    <div class="td w30">
                                                        <div>[[_getResult('other', queriesResult)]]</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                
                                        <div class="block-home-distribution">
                                            <div class="block-sub-title">
                                                [[localize('rash-home-dist', 'Home distribution', language)]]
                                            </div>
                                            <div class="table">
                                                <template is="dom-repeat" items="[[homeDistribution]]">
                                                    <template is="dom-if" if="[[_isMoreThanOnePercent(item.rate)]]">
                                                        <div class="tr">
                                                            <div class="td w5">
                
                                                            </div>
                                                            <div class="td w65">
                                                                <div>[[item.postalCode]]</div>
                                                            </div>
                                                            <div class="td w30">
                                                                <div>[[item.rate]]%</div>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                
                        <paper-dialog id="processDialog">
                            <h2 class="modal-title">[[localize('rash-proc', 'Process request', language)]]</h2>
                            <div class="content">
                                <div class="processDialogContent">
                                    [[localize('rash-proc-mess', 'This process can take a few minutes, please wait a moment', language)]]
                                       <div class="table">
                                           <template is="dom-repeat" items="[[processStep]]">
                                               <div class="tr">
                                                   <div class="td w90 left">
                                                       [[item]]
                                                   </div>
                                                   <div class="td w5 center">
                                                       <iron-icon icon="vaadin:check-circle" class="process-icon"></iron-icon>
                                                   </div>
                                               </div>
                                           </template>
                                       </div>
                                    <ht-spinner active="[[isLoading]]"></ht-spinner>
                                </div>
                            </div>
                            <div class="buttons">
                                <div>&nbsp;</div>
                            </div>
                        </paper-dialog>
                
                        <paper-dialog id="requestInfoDialog">
                            <div class="containerRequestInfo">
                                <paper-tabs selected="{{tabs}}">
                                    <paper-tab id="tabInfoRequest"><iron-icon class="tabIcon" icon="vaadin:male"></iron-icon> [[localize('rash-inf-req', 'Information about request', language)]]</paper-tab>
                                    <paper-tab id="tabInfoQuery"><iron-icon class="tabIcon" icon="vaadin:code"></iron-icon>[[localize('rash-inf-quer', 'Information about query', language)]]</paper-tab>
                                </paper-tabs>
                                <iron-pages selected="[[tabs]]">
                                    <page>
                                        <div class="requestInfoDialogContent">
                                            [[selectedRequestDescriptionInfo]]
                                        </div>
                                    </page>
                                    <page>
                                        <div class="requestInfoDialogContent">
                                            [[selectedRequestInfo]]
                                        </div>
                                    </page>
                                </iron-pages>
                            </div>
                            <div class="buttons">
                                <paper-button on-tap="_closeRequestInfoDialog" class="button button--other"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                            </div>
                        </paper-dialog>
            `;
    }

    static get is() {
        return 'ht-admin-reports-rash'
    }

    static get properties() {
        return {
            api: {
                type: Object,
                noReset: true
            },
            user: {
                type: Object,
                noReset: true
            },
            patientList:{
                type: Array,
                value: () => []
            },
            homeDistribution:{
                type: Array,
                value: () => []
            },
            hcp:{
                type: Object,
                value: () => {}
            },
            queriesResult:{
                type: Array,
                value: () => []
            },
            queryList:{
                type: Array,
                value: () => []
            },
            selectedYear:{
                type: Object,
                value: () => {}
            },
            availableYearForReport:{
                type: Array,
                value: () => []
            },
            isLoading:{
                type: Boolean,
                value: false
            },
            selectedRequestInfo:{
                type: String,
                value: null
            },
            processStep:{
                type: Array,
                value: () => []
            },
            tabs: {
                type: Number,
                value: 0
            },
            selectedRequestDescriptionInfo:{
                type: String,
                value: null
            }
        }
    }

    static get observers() {
        return ['_initializeDataProvider(api, user)'];
    }

    constructor() {
        super()
    }

    ready() {
        super.ready()
    }

    _initializeDataProvider(){
        this.set('patientList', [])
        this.set('homeDistribution', [])
        this.set('hcp', {})
        this.set('queriesResult', [])
        this.set('queryList', [])
        this.set('selectedYear', {})
        this.set('availableYearForReport', [])

        this.set('availableYearForReport', [
            {label: 2019, id: 2019},
            {label: 2020, id: 2020}
        ])

        this.set('selectedYear', _.get(this, 'availableYearForReport', []).find(ay => _.get(ay, 'id', null) === parseInt(this.api.moment(new Date()).format('YYYY')) -1))

        const startYear = _.get(this.selectedYear, "id", null)+'0101'
        const endYear = (parseInt(_.get(this.selectedYear, "id", null)) + 1)+'0101'

        this.set('queryList', [
            {type: 'breastCancer', label:{ fr: "Taux de dépistage du cancer du sein", nl: "", en: "Mammography rate"}, resultType: 'rate', filter:'((gender == "female") & age>50y & age<69y & active == true) & (SVC[(BE-THESAURUS-PROCEDURES == X41.004{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)) | (BE-THESAURUS-PROCEDURES == X41.006{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)) | (BE-THESAURUS-PROCEDURES == X41.007{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)) | (BE-THESAURUS-PROCEDURES == X41.008{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)) | (BE-THESAURUS-PROCEDURES == X41.009{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)) | (BE-THESAURUS-PROCEDURES == X41.010{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)) | (BE-THESAURUS-PROCEDURES == X41.011{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed))])'},
            {type: 'colorectalCancer', label:{ fr: "Taux de dépistage du cancer colo-rectal", nl: "", en: "Colorectal cancer rate"}, resultType: 'rate',filter: '((gender == "female" | gender == "male") & active == true & (age>50y & age<75y)) & (SVC[(BE-THESAURUS-PROCEDURES == D40.001{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)) | (BE-THESAURUS-PROCEDURES == D36.002{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed))])'},
            {type: 'collarSmear', label:{ fr: "Taux de dépistage du cancer du col", nl: "", en: "Collar smear rate"}, resultType: 'rate', filter: '(gender=="female" & (age>25y & age<65y) & active == true) & (SVC[(BE-THESAURUS-PROCEDURES == X37.003{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)) | (BE-THESAURUS-PROCEDURES == X37.002{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed))])'},
            {type: 'influenza', label:{ fr: "Taux de vaccination contre la grippe", nl: "", en: "Influenza vaccination rate"}, resultType: 'rate', filter: '(age>65y & active == true) & (SVC[BE-THESAURUS-PROCEDURES == R44.003{'+startYear+' -> '+endYear+'} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == proposed)])'},
            {type: 'male', label:{ fr: "Bénéficiaires masculins", nl: "", en: "Male patient"}, resultType: 'number', filter: '(gender == "male") & active == true'},
            {type: 'female', label:{ fr: "Bénéficiaires féminins", nl: "", en: "Female patient"}, resultType: 'number', filter: '(gender == "female") & active == true'},
            {type: 'other', label:{ fr: "Bénéficaires d'autres sexes", nl: "", en: "Other sex patient"}, resultType: 'number', filter: '((gender == "indeterminate") | (gender == "changed") | (gender == "changedToMale") | (gender == "changedToFemale") | (gender == "unknown")) & active == true'},
            {type: '0To4', label:{ fr: "Bénéficaires entre 0 et 4 ans", nl: "", en: "Patient between 0 and 4 years"}, resultType: 'number',filter: 'age>0y & age<5y & active == true'},
            {type: '5To14', label:{ fr: "Bénéficaires entre 5 et 14 ans", nl: "", en: "Patient between 5 and 14 years"}, resultType: 'number', filter: 'age>5y & age<15y & active == true'},
            {type: '15To24', label:{ fr: "Bénéficaires entre 15 et 24 ans", nl: "", en: "Patient between 15 and 24 years"}, resultType: 'number', filter: 'age>15y & age<25y & active == true'},
            {type: '25To44', label:{ fr: "Bénéficaires entre 25 et 44 ans", nl: "", en: "Patient between 25 and 44 years"}, resultType: 'number', filter: 'age>25y & age<45y & active == true'},
            {type: '45To64', label:{ fr: "Bénéficaires entre 45 et 64 ans", nl: "", en: "Patient between 45 and 64 years"}, resultType: 'number', filter: 'age>45y & age<65y & active == true'},
            {type: '65To74', label:{ fr: "Bénéficaires entre 65 et 74 ans", nl: "", en: "Patient between 65 and 74 years"}, resultType: 'number', filter: 'age>65y & age<75y & active == true'},
            {type: '75To94', label:{ fr: "Bénéficaires entre 75 et 94 ans", nl: "", en: "Patient between 75 and 94 years"}, resultType: 'number', filter: 'age>75y & age<95y & active == true'},
            {type: 'moreThan95', label:{ fr: "Bénéficiaires de + de 95 ans", nl: "", en: "Patient over 95 years"}, resultType: 'number', filter: 'age>95y & active == true'}
        ])
    }

    _getReportInformation(){

        this.$['processDialog'].open()
        this.set('isLoading', true)

        this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
            this.set('hcp', hcp)
            let prom = Promise.resolve([])

            const filter = {
                $type: "PatientByHcPartyNameContainsFuzzyFilter",
                healthcarePartyId: _.get(hcp, 'parentId', null) ? _.get(hcp, 'parentId', null) : _.get(hcp, 'id', null),
                searchString: ""
            };

            this.api.patient().filterByWithUser(this.user, null, null, 30000, 0, null, true, {filter: filter})
                .then(patients => {
                    this.set('patientList', patients.rows)
                })
                .then(() => {
                    this.queryList.map(query => {
                        prom = prom.then(result => this._executeQueryFilter(query.filter).then(res => {
                            this.push('processStep',  _.get(query, 'label.'+this.language, null))
                            return _.concat(result, {
                                type: _.get(query, 'type', null),
                                request: _.get(query, 'filter', null),
                                result: res,
                                label: _.get(query, 'label.'+this.language, null),
                                numberOfPatient: _.size(res),
                                rateOfPatient: parseFloat(((parseInt(_.size(res)) / parseInt(_.size(_.get(this, 'patientList', [])))) * 100).toFixed(2)),
                                resultType: _.get(query, 'resultType', null),
                            })
                        }))
                    })

                    prom.then(allResult => {
                        console.log(allResult)
                        this.set("queriesResult", allResult)
                    }).finally(() => {
                        this.set("isLoading", false)
                        this.set('processStep', [])
                        // this._createXlsx()
                        this.$['processDialog'].close()
                    })
                })
                .finally(() => {
                    this._getHomeDistribution()
                })
        })
    }

    _executeQueryFilter(searchFilter){
        let svcFilter = null
        let lastParamsWithIdxProm = Promise.resolve()

        svcFilter = parse(`PAT[${searchFilter}]`, {hcpId: this.hcp.parentId || this.user.healthcarePartyId})

        lastParamsWithIdxProm = icrFilter(svcFilter, {
            cryptoicc: this.api.crypto(), usericc: this.api.user(), patienticc: this.api.patient(), contacticc: this.api.contact(), helementicc: this.api.helement(), invoiceicc: this.api.invoice(), hcpartyicc: this.api.hcparty()
        }, this.hcp.parentId || this.user.healthcarePartyId, false).then(pl => pl.rows)

        return lastParamsWithIdxProm.then(res => {
            return res
        })
    }


    _getNumberOfPatient(){
        return _.size(_.get(this, 'patientList', []))
    }

    _getNumberOfBim(){
        return _.size(
            _.get(this, 'patientList', []).filter(p =>
                (_.get(p, 'active', false) === true) && _.size(_.get(p, 'insurabilities', [])) &&
                parseInt(_.get(_.head(_.get(p, 'insurabilities', []).filter(ins =>
                    _.get(ins, 'startDate', null) && !_.get(ins, 'endDate', null) && _.trim(_.get(ins, 'parameters.tc1', null)).length === 3 && _.trim(_.get(ins, 'parameters.tc2', null)).length === 3
                )), 'parameters.tc1', null)) % 2 !== 0
            )
        )
    }

    _getNumberOfPatientWithFlatrateContract(){
        const startOfYear = parseInt(_.get(this, 'selectedYear.id', null)+"0101")
        return _.size(_.get(this, 'patientList', []).filter(pat => (_.get(pat, 'active', false) === true) &&  _.size(_.get(pat, "medicalHouseContracts", [])) &&
            _.some(_.get(pat, "medicalHouseContracts", []), mhc => mhc &&
                (mhc.kine || mhc.gp || mhc.nurse) &&
                _.trim(_.get(mhc,"startOfContract") &&
                    _.get(mhc,"startOfContract") < (startOfYear+(1e4)) &&
                    (!_.get(mhc,"startOfCoverage") || (_.get(mhc,"startOfCoverage") && _.get(mhc,"startOfCoverage") < (startOfYear+(1e4))) ) &&
                    (!_.get(mhc,"endOfContract") || _.get(mhc,"endOfContract") > (startOfYear + 1130)) &&
                    (!_.get(mhc,"endOfCoverage") || _.get(mhc,"endOfCoverage") > (startOfYear + 1130)))))
        )
    }

    _getNumberOfPatientWithoutFlatrateContract(){
        return parseInt(_.size(_.get(this, 'patientList', []).filter(p => _.get(p, 'active', false) === true ))) - parseInt(this._getNumberOfPatientWithFlatrateContract())
    }

    _getHomeDistribution(){
        const patientWithAdr = _.get(this, 'patientList', []).filter(p => (_.get(p, 'active', false) === true) && _.get(p, 'addresses', []).find(adr => _.get(adr, 'addressType', null) === "home" && _.trim(_.get(adr, 'postalCode', null))  && _.trim(_.get(adr, 'postalCode', null)) !== "")) || []
        this.set("homeDistribution", _.orderBy(_.map(_.groupBy(patientWithAdr.map(pwa => _.head(_.get(pwa, 'addresses', []))), 'postalCode'), a => {
            return {
                postalCode: _.get(_.head(a), 'postalCode', null),
                occurence: _.size(a),
                rate: parseFloat(((parseInt(_.size(a)) / parseInt(_.size(_.get(this, 'patientList', [])))) * 100).toFixed(2))
            }
        }), ['rate'], ['desc']))

        console.log(this.homeDistribution)
    }

    _isMoreThanOnePercent(rate){
        return rate && rate >= 1
    }

    _isResultForRequest(){
        return !_.isEmpty(this.queriesResult)
    }

    _resetReport(){
        this.set('queriesResult', [])
        return !_.isEmpty(this.queriesResult)
    }

    _getResult(type){
        const result = _.get(this, 'queriesResult', []).find(qr => _.get(qr, 'type', null) === type)
        return _.get(result, 'resultType', 'number') === "rate" ? _.get(result, 'rateOfPatient', null) : _.get(result, 'numberOfPatient', null)
    }

    _closeRequestInfoDialog(){
        this.set('selectedRequestDescriptionInfo', null)
        this.set('selectedRequestInfo', null)
        this.$["requestInfoDialog"].close()
    }

    _openRequestInfoDialog(e){
        if(_.get(e, 'target.id', null)){
            this.set('selectedRequestInfo', _.get(_.get(this, 'queriesResult', []).find(qr => _.get(qr, 'type', null) === _.get(e, 'target.id', null)), 'request', null))
            this.set('selectedRequestDescriptionInfo', _.get(_.get(this, 'queriesResult', []).find(qr => _.get(qr, 'type', null) === _.get(e, 'target.id', null)), 'label', null))
            this.$["requestInfoDialog"].open()
        }
    }

    _createXlsx(){

        let data = [
            [
                this.localize('rash-influ', 'Influenza vaccination rate (65 years and over)', this.language),
                this._getResult('influenza', this.queriesResult)+"%"
            ],
            [
                this.localize('rash-dmg', 'Number of DMG (number of patients registred on 31/12)', this.language),
                0
            ],
            [
                this.localize('rash-cons-doc', 'Number of consultations / services performed by a doctor', this.language),
                0
            ],
            [
                this.localize('rash-cons-nurse', 'Number of consultations / services provided by a nurse', this.language),
                0
            ],
            [
                this.localize('rash-cons-phy', 'Number of consultations / services performed by a physiotherapist', this.language),
                0
            ],
            [
                this.localize('rash-cons-ano', 'Number of consultations / services performed by another function', this.language),
                0
            ],
            [
                this.localize('rash-non-flatrate', 'Number of active patients (if ASI fixed price)', this.language),
                this._getNumberOfPatientWithoutFlatrateContract(this.patientList)
            ],
            [
                this.localize('rash-flatrate', 'Number of active patients on the INAMI package (if ASI on the package)', this.language),
                this._getNumberOfPatientWithFlatrateContract(this.patientList)
            ],
            [
                this.localize('rash-colon', 'Colon cancer screening rate (50 to 75 years)', this.language),
                this._getResult('colorectalCancer', this.queriesResult)+"%"
            ],
            [
                this.localize('rash-mammograms', 'Rate of screening mammograms (women aged 50 to 69)', this.language),
                this._getResult('breastCancer', this.queriesResult)+"%"
            ],
            [
                this.localize('rash-age-distrib', 'Age distribution (age groups)', this.language)
            ],
            [
                "0 - 4 " + this.localize('rash-years', 'years', this.language),
                this._getResult('0To4', this.queriesResult)
            ],
            [
                "5 - 14 " + this.localize('rash-years', 'years', this.language),
                this._getResult('5To14', this.queriesResult)
            ],
            [
                "15 - 24 " + this.localize('rash-years', 'years', this.language),
                this._getResult('15To24', this.queriesResult)
            ],
            [
                "24 - 44 " + this.localize('rash-years', 'years', this.language),
                this._getResult('25To44', this.queriesResult)
            ],
            [
                "45 - 64 " + this.localize('rash-years', 'years', this.language),
                this._getResult('45To64', this.queriesResult)
            ],
            [
                "65 - 74 " + this.localize('rash-years', 'years', this.language),
                this._getResult('65To74', this.queriesResult)
            ],
            [
                "75 - 94 " + this.localize('rash-years', 'years', this.language),
                this._getResult('75To94', this.queriesResult)
            ],
            [
                this.localize('rash-95-and-more', '95 years and more', this.language),
                this._getResult('moreThan95', this.queriesResult)
            ],
            [
                this.localize('rash-BIM', 'BIM', this.language),
                this._getNumberOfBim(this.patientList)
            ],
            [
                this.localize('rash-amu', 'Emergency help (AMU)', this.language),
                0
            ],
            [
                this.localize('rash-age-distrib', 'Age distribution (age groups)', this.language)
            ],
            [
                this.localize('rash-male', 'Male', this.language),
                this._getResult('male', this.queriesResult)
            ],
            [
                this.localize('rash-female', 'Female', this.language),
                this._getResult('female', this.queriesResult)
            ],
            [
                this.localize('rash-other', 'Other', this.language),
                this._getResult('other', this.queriesResult)
            ],
            [
                this.localize('rash-home-dist', 'Home distribution', this.language)
            ]
        ]

        this.generateXlsFile(_.concat(data, _.compact(this.homeDistribution.map(hd => {
            return _.get(hd, 'rate', null) > 1 ? [_.get(hd, 'postalCode', null), _.get(hd, 'rate', null)+"%"] : null
        }))), "rash_"+_.get(this.selectedYear, 'id', null)+"_"+moment().format("YYYYMMDD-HHmmss")+ ".xls", "Rash "+_.get(this.selectedYear, 'id', null), "Topaz")
    }

    generateXlsFile(data, filename, title, author){

        // Create xls work book and assign properties
        const xlsWorkBook = {SheetNames: [], Sheets: {}}
        xlsWorkBook.Props = {Title: title, Author: author}

        // Create sheet based on json data collection
        var xlsWorkSheet = XLSX.utils.json_to_sheet(data)

        // Link sheet to workbook
        XLSX.utils.book_append_sheet(xlsWorkBook, xlsWorkSheet, title)

        // Virtual data output
        var xlsWorkBookOutput = new Buffer(XLSX.write(xlsWorkBook, {bookType: 'xls', type: 'buffer'}))

        // Put output to virtual "file"
        var fileBlob = new Blob([xlsWorkBookOutput], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})

        // Create download link and append to page's body
        var downloadLink = document.createElement("a")
        document.body.appendChild(downloadLink)
        downloadLink.style = "display: none"

        // Create url
        var urlObject = window.URL.createObjectURL(fileBlob)

        // Link to url
        downloadLink.href = urlObject
        downloadLink.download = filename

        // Trigger download and drop object
        downloadLink.click()
        window.URL.revokeObjectURL(urlObject)

        // Free mem
        fileBlob = false
        xlsWorkBookOutput = false

    }
}
customElements.define(HtAdminReportsRash.is, HtAdminReportsRash)
