import * as models from 'icc-api/dist/icc-api/model/models'
import '../../filter-panel/filter-panel.js';

import '../../collapse-button/collapse-button.js';
import '../../icons/icure-icons.js';
import '../../../styles/icpc-styles.js';
import '../../../styles/atc-styles.js';
import '../../../styles/scrollbar-style.js';
import '../../ht-spinner/ht-spinner.js';
import '../../../styles/shared-styles.js';
import '../../../styles/dialog-style.js';
import '../../../styles/notification-style.js';
import '../../../styles/paper-input-style.js';
import '../../../styles/buttons-style.js';
import '../../../styles/dropdown-style.js';
import '../../../styles/paper-tabs-style.js';

import '@vaadin/vaadin-split-layout/vaadin-split-layout';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-radio-button/paper-radio-button';
import moment from 'moment/src/moment'
import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../../tk-localizer";

class HtPatOtherFormDialog extends TkLocalizerMixin(PolymerElement){

    static get template() {
        return html`
                <style include="dialog-style scrollbar-style shared-styles paper-input-style">

                    #otherFormDialog{
                        height: calc(98% - 12vh);
                        width: 98%;
                        max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                        min-height: 400px;
                        min-width: 800px;
                        top: 64px;
                    }
        
                    .otherFormDialog{
                        height: calc(100% - 45px - 45px);
                        width: auto;
                        margin: 0;
                        padding: 0;
                        background-color: white;
                        position: relative;
        
                    }
        
                    .buttons{
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        margin: 0;
                    }
        
                    .title{
                        height: 30px;
                        width: auto;
                        font-size: 20px;
                    }
        
                    .content{
                        max-height: calc(100% - 45px);
                        height: calc(98% - 28px);
                        width: auto;
                    }
        
                    .searchBlock{
                        display: flex;
                        padding: 5px;
                    }
        
                    .w50{
                        width: 49%;
                    }
        
                    .ml1{
                        margin-left: 1%;
                    }
        
                    .w80{
                        width: 80%;
                    }
        
                    .w20{
                        width: 20%;
                    }
        
                    .p6{
                        padding:6px;
                    }
        
                    .searchForm{
                        display: flex;
                        padding: 5px;
                    }
        
                    .form-container{
                        margin: 1%;
                    }
        
                </style>
        
                <paper-dialog id="otherFormDialog">
                    <div class="content otherFormDialog">
                        <div class="title">
                            [[localize('ofd-ava-form', 'Available form', language)]]
                        </div>
                        <div class="searchBlock">
        
                        </div>
                        <div class="grid">
                            <div class="searchForm">
                                <paper-input class="w80 m0 mr10" value="{{formFilter}}" label="[[localize('search','Search',language)]]:"></paper-input>
                                <vaadin-combo-box class="w20 type-to m-l-20 p6" id="type-Dept" items="[[availableDepartmentList]]" item-label-path="label.fr" item-value-path="id" label="[[localize('dept', 'Department', language)]]" selected-item="{{selectedDepartment}}"></vaadin-combo-box>
                            </div>
                            <div class="form-container">
                                <vaadin-grid id="formList" class="material grid" items="[[availableForm]]" active-item="{{selectedForm}}">
                                    <vaadin-grid-column>
                                        <template class="header">
                                            [[localize('formGroupName','Group name',language)]]
                                        </template>
                                        <template>
                                            <div>[[item.group.name]]</div>
                                        </template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column>
                                        <template class="header">
                                            [[localize('formName','Form name',language)]]
                                        </template>
                                        <template>
                                            <div>[[item.name]]</div>
                                        </template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column>
                                        <template class="header">
                                            [[localize('dept','Department',language)]]
                                        </template>
                                        <template>
                                            <div>[[_localizeSpeciality(item.specialty.code)]]</div>
                                        </template>
                                    </vaadin-grid-column>
                                </vaadin-grid>
                            </div>
                        </div>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    </div>        
                </paper-dialog>`
    }


    static get is() {
        return 'ht-pat-other-form-dialog'
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
            formList: {
                type: Array,
                value: () => []
            },
            availableForm: {
                type: Array,
                value: () => []
            },
            selectedDepartment: {
                type: Object,
                value: () => {
                }
            },
            departmentList: {
                type: Array,
                value: () => []
            },
            availableDepartmentList: {
                type: Array,
                value: () => []
            },
            hcp: {
                type: Object,
                value: () => {
                }
            },
            formFilter: {
                type: String,
                value: ""
            },
            selectedForm: {
                type: Object,
                value: () => {
                }
            }
        }
    }

    static get observers() {
        return ['_selectedFormChanged(selectedForm)', '_formFilterChanged(formFilter)']
    }

    _openDialog() {

        this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
            .then(hcp => Promise.all([hcp, this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', this.language, 'dept', null, null, 200)]))
            .then(([hcp, listOfDept]) => {
                this.set('hcp', hcp)
                this.set('departmentList', listOfDept.rows)
            })
            .finally(() => {
                this.set("availableDepartmentList", this.departmentList.filter(dept => dept.code === "deptgeneralpractice"))
                this.set('selectedDepartment', this.departmentList.find(dept => dept.code === _.get(this.hcp, 'specialityCodes.0.code', 'deptgeneralpractice')))
                this._initFormsDataProvider()
            })

        this.$['otherFormDialog'].open()
    }

    _initFormsDataProvider() {
        this.api.form().findFormTemplatesBySpeciality(_.get(this.selectedDepartment, 'code', "deptgeneralpractice"))
            .then((forms) => {
                this.set('formList', forms.map(form =>
                    _.assign(form, {
                        normalizedSearchTerms: _.map(_.uniq(_.compact(_.flatten(_.concat([_.get(form, 'name', ''), _.get(form, 'layout.group', ''), _.get(form, 'layout.name', '')])))), i => _.trim(i).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")).join(" ")
                    }))
                )
                this.set('availableForm', _.sortBy(_.get(this, 'formList', []).filter(form => _.get(form, 'disabled', false) !== true), ['group.name']))
                this.set('formFilter', null)
                this.$['formList'].clearCache()
            })
    }

    _closeDialogs() {
        this.$['otherFormDialog'].close()
    }

    _localizeSpeciality(specialityCode) {
        return this.localize('cd-hcp-' + specialityCode, specialityCode, this.language)
    }

    _selectedFormChanged() {
        if (this.selectedForm && this.selectedForm.id) {
            this.dispatchEvent(new CustomEvent('entity-selected', {
                detail: {guid: _.get(this.selectedForm, 'guid', null)},
                bubbles: true,
                composed: true
            }))
            this._closeDialogs()
        }
    }

    _formFilterChanged() {
        if (this.formFilter) {
            const keywordsString = _.trim(_.get(this, "formFilter", "")).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            const keywordsArray = _.compact(_.uniq(_.map(keywordsString.split(" "), i => _.trim(i))))

            setTimeout(() => {
                if (parseInt(_.get(keywordsString, "length", 0)) > 2) {
                    const formsSearchResults = _.chain(_.get(this, "availableForm", []))
                        .chain(_.get(this, "formFilter", []))
                        .filter(i => _.size(keywordsArray) === _.size(_.compact(_.map(keywordsArray, keyword => _.trim(_.get(i, "normalizedSearchTerms", "")).indexOf(keyword) > -1))))
                        .compact()
                        .uniq()
                        .orderBy(['layout.group', 'name', 'id'], ['asc', 'asc', 'asc'])
                        .value()

                    this.set('availableForm', formsSearchResults)

                } else {
                    this.set('availableForm', _.sortBy(_.get(this, 'formList', []).filter(form => _.get(form, 'disabled', false) !== true), ['group.name']))
                }
            }, 100)
        }
    }

}

customElements.define(HtPatOtherFormDialog.is, HtPatOtherFormDialog)
