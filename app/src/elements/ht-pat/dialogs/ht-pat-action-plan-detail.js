import '../../ht-spinner/ht-spinner.js'
import '../../dynamic-form/dynamic-link.js'
import '../../dynamic-form/dynamic-pills.js'
import '../../../styles/scrollbar-style.js'
import '../../../styles/paper-input-style.js'
import '../../../styles/dropdown-style.js'

import '@vaadin/vaadin-date-picker'
import '@vaadin/vaadin-combo-box'

import moment from 'moment/src/moment'

const procedureStatus = ["aborted", "error", "refused", "pending", "planned", "completed", "proposed", "cancelled"]

import {TkLocalizerMixin} from "../../tk-localizer"
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class"
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior"
import {PolymerElement, html} from '@polymer/polymer'

class HtPatActionPlanDetail extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
    static get template() {
        return html`
        <style include="paper-input-style scrollbar-style dropdown-style">

            :host {
                min-height: 400px;
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                position: relative;
            }

            .links {
                flex-grow: 2;
                width: 100%;
            }

            .pills {
                float: right;
            }

            dynamic-link {
                float: right;
                top: 4px;
            }

            .form-title-bar-btn {
                height: 20px;
                width: 20px;
                padding: 2px;
            }

            .form-title-bar-btn paper-listbox{
                padding: 0;
            }

            .form-title-bar-btn paper-listbox paper-item{
                padding: 0 8px;
                font-size: var(--font-size-normal);
            }

            .form-title-bar-btn paper-listbox paper-item iron-icon{
                height: 12px;
                width: 12px;
                padding: 0;
                margin-right: 4px;
            }

            .row {
                display: flex;
                flex-flow: row nowrap;
            }

            .cs1 {
                flex-grow: 1;
                width: calc(50% - 16px);
                margin: 0 8px 12px;
            }

            .cs2 {
                flex-grow: 2;
                width: calc(100% - 16px);
                margin: 0 8px 12px;
            }

            .paperItem {
                font-size: 16px;
                padding-left: 5px;
                padding-right: 5px;
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

       

        <ht-spinner active="[[isLoading]]"></ht-spinner>

        <div class="links">
            <div class="pills">
                 <dynamic-pills health-elements="[[linkedHes]]" on-unlink-to-health-element="_unlink"></dynamic-pills>
            </div>
        </div>
        
        <paper-tooltip position="bottom" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
        <paper-menu-button class="form-title-bar-btn" horizontal-align="right" dynamic-align="true" vertical-offset="26">
            <paper-icon-button id="linkhe" class="form-title-bar-btn" icon="icons:link" slot="dropdown-trigger" alt="menu"></paper-icon-button>
              <paper-listbox slot="dropdown-content">
                     <template is="dom-repeat" items="[[linkables]]" as="he">
                         <template is="dom-if" if="[[he.id]]">
                             <paper-item id="[[he.id]]" class$="link [[_isExcluded(he)]]" on-tap="_link">
                                 <label class$="colour-code [[he.colour]]">
                                     <span></span>
                                 </label>[[he.descr]]</paper-item>
                          </template>
                         <template is="dom-if" if="[[!he.id]]">
                             <paper-item id="[[he.idService]]" class$="link [[he.colour]]" on-tap="_link">
                                 <label class="colour-code">
                                     <span></span>
                                 </label>[[he.descr]]</paper-item>
                         </template>
                     </template>
                 </paper-listbox>
             </paper-menu-button>

        
        <vaadin-date-picker class="cs1" theme="tk-theme" id="date-picker" label="Date d'échéance*" value="{{plannedAction.Deadline}}" i18n="[[i18n]]" on-value-changed="_checkIsDeadline" can-be-fuzzy accuracy="{{accuracy}}"></vaadin-date-picker>
        <vaadin-combo-box class="cs1" filtered-items="[[comboStatus]]" item-label-path="label" item-value-path="id" on-filter-changed="" label="Statut*" value="{{plannedAction.Status}}" on-value-changed="analyzeStatus" readonly="[[readonly]]"></vaadin-combo-box>
        <!-- <tk-combo-box class="cs1" label="Statut*" items="[[comboStatus]]" item-label-path="label" item-value-path="id" value="{{plannedAction.Status}}" on-value-changed="analyzeStatus" readonly="[[readonly]]"></tk-combo-box> -->
    
       <vaadin-combo-box class="cs2" filtered-items="[[proceduresListItem]]" item-label-path="label.[[language]]" item-value-path="code" id="procedures-list" on-filter-changed="_proceduresFilterChanged" on-value-changed="procedureChanged" label="Procédure*" value="{{plannedAction.ProcedureId}}" readonly="[[readonly]]" disabled="[[vaccineOnly]]"></vaadin-combo-box>
        <!-- <tk-combo-box id="procedures-list" class="cs2" label="Procédure*" items="[[proceduresListItem]]" item-label-path="label.[[language]]" item-value-path="code" value="{{plannedAction.ProcedureId}}" readonly="[[readonly]]" disabled="[[vaccineOnly]]"></tk-combo-box> -->

        <template is="dom-if" if="[[isVaccineProcedure]]">
            
            <vaadin-combo-box class="cs2" id="vaccine" filtered-items="[[drugsListItem]]" item-label-path="name" item-value-path="id" on-filter-changed="_drugsFilterChanged" on-value-changed="_drugsChanged" selected-item="{{selectedVaccineItem}}" label="[[localize('commercial_name','Commercial name',language)]]" readonly="[[readonly]]"></vaadin-combo-box>
            <!-- <tk-combo-box id="vaccine" class="cs2" label="[[localize('commercial_name','Commercial name',language)]]" items="[[drugsListItem]]" item-value-path="id" selected="{{selectedVaccineItem}}" readonly="[[readonly]]"></tk-combo-box> -->
    
            <paper-input class="cs2" label="Autre" value="{{plannedAction.VaccineName}}" disabled="[[!hasNoMedication(plannedAction.VaccineCommercialNameId)]]" always-float-label=""></paper-input>
        
             <div class="cs1"><paper-input label="N° de la dose" value="{{plannedAction.DoseNumber}}" readonly="[[readonly]]" always-float-label></paper-input></div>
             <div class="cs1"><paper-input label="N° de lot" value="{{plannedAction.BatchNumber}}" readonly="[[readonly]]" always-float-label></paper-input></div>
        </template>
        
        <vaadin-text-area class="cs2 textarea-style" id="cpa_description" label="Description" value="{{plannedAction.Description}}" readonly="[[readonly]]"></vaadin-text-area>
        <template is="dom-if" if="[[!vaccineOnly]]">    
           <vaadin-combo-box class="cs2" filtered-items="[[hcpListItem]]" id="hcp-list" item-label-path="name" item-value-path="id" on-filter-changed="_hcpFilterChanged" selected-item="{{selectedHcpItem}}" label="Prestataire lié" readonly="[[readonly]]"></vaadin-combo-box>
            <vaadin-combo-box class="cs2" filtered-items="[[hcpartyTypeListFiltered]]" item-label-path="label.[[language]]" item-value-path="id" on-filter-changed="" label="Profession liée" selected-item="{{selectedProfessionItem}}" readonly="[[readonly]]"></vaadin-combo-box>
        </template>
        <template is="dom-if" if="[[isStatusRefusal]]">
            <vaadin-text-area class="cs2" id="cpa_description" label="Motif de refus" value="{{plannedAction.ReasonOfRef}}" readonly="[[readonly]]"></vaadin-text-area>
        </template>
        
        <template is="dom-if" if="[[isStatusComplete]]">
                  <div class="row h1">
                     <div class="row cs1">
                         <vaadin-date-picker style="min-width: 180px" label="Prochaine échéance" value="{{nextDate}}" i18n="[[i18n]]" need-full-date="[[fullDateMode]]" accuracy="{{accuracy}}"></vaadin-date-picker>
                         <paper-menu-button id="button" style="padding-top:10px">
                             <!-- vaadin:alarm ; vaadin:timer ; vaadin:date-input; vaadin:calendar-clock -->
                             <paper-icon-button id="iconButton" icon="vaadin:alarm" slot="dropdown-trigger"></paper-icon-button>
                             <paper-listbox slot="dropdown-content">
                                 <paper-item class="paperItem" data-months="1" on-tap="_setNextDate">[[localize('alarm1','1 month',language)]]</paper-item>
                                 <paper-item class="paperItem" data-months="3" on-tap="_setNextDate">[[localize('alarm3','3 months',language)]]</paper-item>
                                 <paper-item class="paperItem" data-months="6" on-tap="_setNextDate">[[localize('alarm6','6 months',language)]]</paper-item>
                                 <paper-item class="paperItem" data-months="12" on-tap="_setNextDate">[[localize('alarm12','1 year',language)]]</paper-item>
                                 <paper-item class="paperItem" data-months="24" on-tap="_setNextDate">[[localize('alarm24','2 years',language)]]</paper-item>
                                 <paper-item class="paperItem" data-months="36" on-tap="_setNextDate">[[localize('alarm36','3 years',language)]]</paper-item>
                             </paper-listbox>
                         </paper-menu-button>
                     </div>
                      <div class="cs1"><vaadin-checkbox style="margin-top: 14px" on-checked-changed="_isSurgical" checked="[[plannedAction.isSurgical]]" disabled="[[readonly]]">Chirurgical</vaadin-checkbox></div>
                  </div>
              </template>

     

`
    }

    static get is() {
        return 'ht-pat-action-plan-detail'
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
            contacts: {
                type: Array,
                value: () => []
            },
            currentContact: {
                type: Object,
                value: null
            },
            isLoading: {
                type: Boolean,
                value: false
            },
            linkables: {
                type: Array
            },
            linkedHes: {
                type: Array,
                value: () => []
            },
            plannedAction: {
                type: Object,
                value: () => ({
                    Status: "pending",
                    Deadline: "",
                    HcpId: "",
                    ProcedureId: "",
                    ProfessionId: "",
                    ReasonOfRef: "",
                    isSendMail: false,
                    isDeadline: false,
                    isSurgical: false,
                    VaccineCommercialNameId: "",
                    DoseNumber: "",
                    BatchNumber: "",
                    ProcedureInfo: {},
                    Description: "",
                    ProfessionInfo: {},
                    VaccineInfo: {}
                })
            },
            comboStatus: {
                type: Array,
                value: () => []
            },
            proceduresFilterValue: {
                type: String
            },
            selectedItem: {
                type: Object,
                value: null
            },
            isDeadline: {
                type: Boolean,
                value: false
            },
            hcpartyTypeList: {
                type: Array,
                value: []
            },
            hcpartyTypeListFiltered: {
                type: Array,
                value: []
            },
            isStatusComplete: {
                type: Boolean,
                value: false
            },
            isStatusRefusal: {
                type: Boolean,
                value: false
            },
            proceduresListItem: {
                type: Array,
                value: []
            },
            isVaccineProcedure: {
                type: Boolean,
                value: false
            },
            contact: {
                type: Object,
                value: null
            },
            professionId: {
                type: String,
                value: ""
            },
            isExistingSvc: {
                type: Boolean,
                value: false
            },
            selectedHcpItem: {
                type: Object,
                value: ""
            },
            selectedVaccineItem: {
                type: Object,
                value: ""
            },
            selectedProfessionItem: {
                type: Object,
                value: ""
            },
            service: {
                type: Object,
                value: {}
            },
            readonly: {
                type: Boolean,
                value: false
            },
            hasSurgical: {
                type: Boolean,
                value: false
            },
            error: {
                type: String,
                value: ''
            },
            isValid: {
                type: Boolean,
                value: false
            },
            showLinks: {
                type: Boolean,
                value: false
            },
            accuracy: {
                type: String,
                value: "day"
            },
            nextDate: {
                type: String
            },
        }
    }

    static get observers() {
        return ["hcpItemChanged(selectedHcpItem)", "vaccineItemChanged(selectedVaccineItem)", "professionItemChanged(selectedProfessionItem)", "_checkValidity(plannedAction.*,selectedVaccineItem,selectedProfessionItem)"]
    }

    ready() {
        super.ready()
        //this.addEventListener('iron-resize', () => this.onWidthChange());
        try {
            this.set('plannedAction.HcpId', this.user.healthcarePartyId)
            this.api.cacheRowsUsingPagination(
                'CD-HCPARTY-pers',
                (key, docId) =>
                    this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', 'fr', 'pers', key && JSON.stringify(key), docId, 100)
                        .then(pl => ({
                            rows: pl.rows,
                            nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                            nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                            done: !pl.nextKeyPair
                        }))
            ).then(rows => {
                this.set('hcpartyTypeList', _.orderBy(rows, ['label.fr'], ['asc']))
                this.set('hcpartyTypeListFiltered', this.hcpartyTypeList)
                this.set('plannedAction.ProfessionId', this.professionId)
            })
        } catch (e) {
            console.log(e)
        }
    }

    reset() {
        this.set("service", {})
        this.set('error', '')
        this.set("plannedAction", {})
        this.set('drugsListItem', [])
        this.set("selectedHcpItem", "")
        this.set("selectedVaccineItem", "")
        this.set("selectedProfessionItem", "")
        this.set("isExistingSvc", false)
        this.set("hasSurgical", false)
        this.set("isVaccineProcedure", false)
        this.set("accuracy", "day")
    }

    attached() {
        super.attached()
        this.async(this.notifyResize, 1)
    }

    _checkIsDeadline() {
        this.set('plannedAction.isDeadline', this.plannedAction.Deadline !== "")
    }

    hasVaccineId() {
        return this.selectedVaccineItem != null
    }

    hasNoMedication() {
        return !this.plannedAction.VaccineCommercialNameId
    }

    _isSendMailCheck(e) {
        this.set('plannedAction.isSendMail', e.target.checked)
    }

    _isSurgical(e) {
        this.set('plannedAction.isSurgical', e.target.checked)
    }

    analyzeStatus(e) {
        const status = e.detail.value
        this.set("isStatusComplete", status === "completed")
        this.set("isStatusRefusal", status === "refused")
        if (status === "completed" && !this.selectedHcpItem && !this.plannedAction.HcpId) {
            this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
                if (hcp.type) {
                    this.set("selectedHcpItem", hcp)
                    this.set("plannedAction.HcpId", this.selectedHcpItem.id)
                }
            })
        }
    }

    _hcpDataProvider() {
        return {
            filter: function (filterValue) {
                const desc = 'desc'
                let count = 15
                return Promise.all([this.api.hcparty().findByName(filterValue, null, null, count, desc)]).then(results => {
                    const hcpList = results[0]
                    const filtered = _.flatten(hcpList.rows.filter(hcp => hcp.lastName && hcp.lastName !== "" || hcp.firstName && hcp.firstName !== "").map(hcp => ({
                        id: hcp.id,
                        name: hcp.lastName + ' ' + hcp.firstName
                    })))
                    return {totalSize: filtered.length, rows: filtered}
                })
            }.bind(this)
        }
    }

    _hcpFilterChanged(e) {
        let latestSearchValue = e && e.detail.value
        this.latestSearchValue = latestSearchValue
        if (!latestSearchValue || latestSearchValue.length < 2) {
            // //console.log("Cancelling empty search");
            this.set('hcpListItem', [])
            return
        }
        this._hcpDataProvider() && this._hcpDataProvider().filter(latestSearchValue).then(res => {
            if (latestSearchValue !== this.latestSearchValue) {
                // //console.log("Cancelling obsolete search");
                return
            }
            this.set('hcpListItem', res.rows)
        })
    }

    procedureChanged(e) {
        if (!(e && e.detail && e.detail.value)) return
        const code = e && e.detail && e.detail.value
        let codeExp = code.split(".")
        let CISPType = codeExp[0].substr(1, 3)

        this.set("isVaccineProcedure", CISPType === "44")

        let listFiltered = []
        const procedureCode = this.proceduresListItem.find(p => p.code === code)
        if (procedureCode && procedureCode.links) {
            procedureCode.links.filter(link => link.includes("CD-HCPARTY|")).map(link => {
                const info = link.split('|')
                listFiltered.push(this.hcpartyTypeList.find(type => type.code === info[1]))
            })
        }
        this.set("hcpartyTypeListFiltered", listFiltered)
    }

    _proceduresDataProvider() {
        return {
            filter: function (proceduresFilterValue) {
                return Promise.all([this.api.code().findPaginatedCodesByLabel('be', 'BE-THESAURUS-PROCEDURES', 'fr', proceduresFilterValue, null, null)]).then(results => {
                    const procedureList = results[0]
                    let filtered = procedureList.rows
                    filtered = _.flatten(filtered.map(procedure => ({
                        id: procedure.id,
                        label: procedure.label,
                        code: procedure.code,
                        searchTerms: procedure.searchTerms
                    })))
                    return {totalSize: filtered.length, rows: filtered}
                })
            }.bind(this)
        }
    }

    _proceduresFilterChanged(e) {
        let latestSearchValue = e && e.detail.value
        this.latestSearchValue = latestSearchValue
        if (!latestSearchValue || latestSearchValue.length < 2) {
            // //console.log("Cancelling empty search");
            this.set('proceduresListItem', [])
            return
        }
        this._proceduresDataProvider() && this._proceduresDataProvider().filter(latestSearchValue).then(res => {
            if (latestSearchValue !== this.latestSearchValue) {
                // //console.log("Cancelling obsolete search");
                return []
            }
            if (!(res && res.rows && res.rows.length))
                return []
            return this.api.code().getCodes(res.rows.map(code => code.id))
        })
            .then(codes => {
                this.set('proceduresListItem', codes)
            })
    }

    _drugsChanged(e) {
        // console.log("drug changed")
        if (!e.detail.value || e.detail.value === "") {
            this.set("selectedVaccineItem", null)
            this.set("plannedAction.VaccineCommercialNameId", null)
        }
    }

    _drugsDataProvider() {
        return {
            filter: function (drugsFilterValue) {
                return Promise.all([this.api.bedrugs().getMedecinePackages(drugsFilterValue, this.language, null, 0)]).then(results => {
                    const drugsList = results[0]
                    const filtered = _.flatten(drugsList.map(drugs => ({name: drugs.name, id: drugs.id.id})))
                    return {totalSize: filtered.length, rows: filtered}
                })
            }.bind(this)
        }
    }

    _drugsFilterChanged(e) {
        let latestSearchValue = e && e.detail && e.detail.value
        this.latestSearchValue = latestSearchValue
        if (!latestSearchValue || latestSearchValue.length < 2) {
            //console.log("Cancelling empty search");
            this.set('drugsListItem', [])
            return
        }
        this._drugsDataProvider() && this._drugsDataProvider().filter(latestSearchValue).then(res => {
            if (latestSearchValue !== this.latestSearchValue) {
                //console.log("Cancelling obsolete search");
                return
            }
            this.set('drugsListItem', res.rows)
        })
    }

    planAction() {
        // console.log('planAction',this.plannedAction)
        this.set('plannedAction.VaccineInfo', null)
        if (this.plannedAction && this.plannedAction.ProcedureId && this.plannedAction.Status !== '') {
            const tabProfession = this.plannedAction.ProfessionId ? this.plannedAction.ProfessionId.split("|") : []
            Promise.all(
                [
                    this.api.code().findPaginatedCodesByLabel('be', 'BE-THESAURUS-PROCEDURES', 'fr', this.plannedAction.ProcedureId, null, null, 10),
                    tabProfession.length && this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', 'fr', tabProfession[1], null, null, 10) || Promise.resolve({rows: []})
                ]).then(
                ([results, code]) => {
                    if (!(results.rows[0]))
                        return this._setError(this.localize('proc_or_prof_not_exist', 'Procédure/Profession inexistante', this.language))
                    if (this.plannedAction.VaccineCommercialNameId && this.plannedAction.VaccineCommercialNameId !== "") {
                        this.api.bedrugs().getMppInfos(this.plannedAction.VaccineCommercialNameId, this.language).then(
                            mpp => {
                                this.set('plannedAction.VaccineInfo', mpp)
                                //this._planAction(results.rows[0], code.rows.length && code.rows[0] || "")
                            }
                        )
                    }
                    this._planAction(results.rows[0], code.rows.length && code.rows[0] || "")
                })
        } else
            this._setError(this.localize('mandat_fields', 'All fields are mandatory', this.language))
    }

    _assign(items, item) {
        if (!item) return
        const old = items.find(c => c.type === item.type)
        if (old) {
            Object.assign(old, item)
            return
        }
        items.push(item)
    }

    _cleanDate(date) {
        while (date.length < 14) date = date + "0"
        return parseInt(date)
    }

    _planAction(procedureInfo, professionInfo) {
        // console.log('_planAction',this.plannedAction)
        this.set('plannedAction.ProcedureInfo', procedureInfo)
        this.set('plannedAction.ProfessionInfo', professionInfo)
        if (!this.plannedAction.ProcedureInfo)
            return this._setError(this.localize('mandat_fields', 'All fields are mandatory', this.language))
        const action = this.plannedAction
        const contactId = this.currentContact.id
        const responsible = action.HcpId && action.HcpId !== "" ? action.HcpId : this.user.healthcarePartyId
        const valueDate = action.Deadline && action.Deadline !== "" ? action.Deadline.split("-").map(str => _.padStart(str, 2, "0")).join("") : ""

        if (!action || !contactId || !valueDate)
            return this._setError(this.localize('some_mandat_fields', 'Some fields are mandatory', this.language))

        const vaccine = this.selectedVaccineItem
        const vaccineId = _.get(action, "VaccineInfo.id", _.get(vaccine, "id", null))
        const vaccineName = _.get(action, "VaccineInfo.name", _.get(vaccine, "name", _.get(action, "VaccineName", null)))
        const vaccineRegion = _.get(action, "VaccineInfo.id.language", "fr")

        const medication = this.isVaccineProcedure && {
            medicinalProduct: {
                intendedcds: vaccineId ? [
                    {
                        code: vaccineId,
                        type: "CD-DRUG-CNK"
                    }
                ] : [],
                intendedname: vaccineName
            },
            regimen: [],
            batch: action.BatchNumber,
            options: {
                doseNumber: {
                    stringValue: action.DoseNumber
                }
            }
        } || null

        this.service.label = "Actes"
        this.service.modified = +new Date()
        this.service.responsible = responsible
        this.service.content = {
            fr: this._createContent(action.ProcedureInfo.label.fr, medication),
            nl: this._createContent(action.ProcedureInfo.label.nl, medication),
            en: this._createContent(action.ProcedureInfo.label.nl, medication)
        }
        if (!this.service.codes)
            this.service.codes = []
        this._assign(this.service.codes, action.ProcedureInfo)
        this._assign(this.service.codes, action.ProfessionInfo)

        this.service.comment = action.Description
        this.service.valueDate = this._cleanDate(valueDate)
        if (!this.service.tags)
            this.service.tags = []

        const endOfLife = _.get(action, "endOfLife", null)
        endOfLife ? this.service.endOfLife = endOfLife : null

        const status = {
            type: "CD-LIFECYCLE",
            code: action.Status,
            version: "1.0",
        }
        if (action.Status === "refused") status.label = {fr: action.ReasonOfRef}
        this._assign(this.service.tags, status)

        //if (action.VaccineCommercialNameId) {
        if (this.isVaccineProcedure) {
            const vaccine = {
                region: ["be", vaccineRegion].filter(x => !!x),
                type: "CD-ITEM",
                code: "vaccine",
                version: "1.0",
                id: "CD-ITEM|vaccine|1.0"
            }
            this._assign(this.service.tags, vaccine)
        }

        if (action.isSurgical)
            this.service.content.isSurgical = {booleanValue: action.isSurgical}

        // console.log(this.service)
        if (!this.isExistingSvc) {
            this.service.created = +new Date()
            this._dispatchEvent("create-service", responsible)
        } else {
            this._dispatchEvent("update-service", responsible)
        }

        this._footprint = this._getFootprint()
        this._dispatchChangedEvent()
        this._dispatchEvent("saved")
    }

    _createContent(stringValue, medicationValue) {
        return {
            stringValue: stringValue,
            medicationValue: medicationValue
        }
    }

    _dispatchEvent(event, responsible) {
        const isCompleted = this.plannedAction.Status === "completed"
        this.dispatchEvent(new CustomEvent(event, {
            detail: {
                service: this.service,
                caller: _.get(this, "_detail.caller", null),
                next: isCompleted ? this._cleanDate(this.nextDate.split("-").join("")) : null,
                hes: this.linkedHes,
                function: (svc) => {
                    svc.responsible = responsible
                    return svc
                }
            },
            bubbles: true,
            composed: true
        }))
    }

    _link(e) {
        const he = this.linkables.find(he => he.id === e.currentTarget.id)
        this.push("linkedHes", he)
        this._dispatchChangedEvent()

    }

    _unlink(e) {
        const id = _.get(e, "detail.healthElement.id", null)
        if (!id) return
        this._detach.push(id)
        this._dispatchChangedEvent()
    }


    // onWidthChange() {
    //     const offsetWidth = this.$.actionPlanDetail.offsetWidth;
    //     const offsetHeight = this.$.actionPlanDetail.offsetHeight;
    //     if (!offsetWidth || !offsetHeight)
    //         return;
    //     this.set('qrCodeWidth', Math.min(offsetWidth - 32, offsetHeight - 160));
    // }

    _getFootprint() {
        return JSON.stringify({
            plannedAction: this.plannedAction,
            linkedHes: this.linkedHes,
            detach: this._detach
        })
    }

    _toDetach(subContact) {
        return subContact.healthElementId && this._detach.includes(subContact.healthElementId)
    }

    save() {
        this.planAction()
    }

    _getId(object) {
        return _.get(object, 'type', null) && _.get(object, 'code', null) && _.get(object, 'version', null) ?
            [_.get(object, 'type', null), _.get(object, 'code', null), _.get(object, 'version', null)].join("|") :
            null
    }

    _getDate(service) {
        return ('' + _.get(service, 'valueDate', null)).replace(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{6})/, '$1-$2-$3').replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$1-$2-$3')
    }

    _setColors(healthElements, codes) {
        healthElements.forEach(he => {
            const icp = _.get(he, 'codes', []).find(c => c.type === 'ICPC' || c.type === 'ICPC2')
            if (_.get(icp, 'code', null)) {
                const code = codes.find(c => c.subCodes.includes(icp.code))
                if (code)
                    he.colour = _.get(code, 'descr.colour', null)
            }
        })
    }

    _find(object, path, type) {
        return _.get(object, path, []).find(item => item.type === type)
    }

    delete() {
        this.plannedAction.endOfLife = parseInt(moment().format("YYYYMMDD"), 10)
        this.planAction()
    }

    show(service) {
        return this._open(service, false, null, true)
    }

    open(service, readonly, detail) {
        return this._open(service, readonly, detail, false)
    }

    _open(service, readonly, detail, showLinks) {
        // LDE: TODO: remove showLinks
        showLinks = true
        this._detail = detail
        this.reset()

        this.set("comboStatus", procedureStatus.map(id => {
            return {id: id, label: this.localize("proc_status_" + id, id)}
        }))

        if (!service) return

        this.set("isLoading", true)

        this.set("linkedHes", [])
        this.api.contact().getContactWithUser(this.user, service.contactId).then(contact => {
            this.set("currentContact", contact)
            const ids = _.compact(_.get(contact, 'subContacts', []).filter(sc => sc.services.some(s => s.serviceId === service.id)).map(s => s.healthElementId))
            const promises = ids.map(id => this.api.helement().getHealthElement(id))
            Promise.all(promises).then(healthElements => {
                this._linkedHes = healthElements
                this.api.code().icpcChapters(_.compact(healthElements.map(he => he.codes.find(c => c.type === 'ICPC' || c.type === 'ICPC2'))).map(x => x.code))
                    .then((codes) => {
                        this._setColors(this._linkedHes, codes)
                        this.set("linkedHes", this._linkedHes)
                    }).finally(() => {
                    this.set("isLoading", false)
                })
            })
        })

        const vaccineOnly = _.get(detail, 'source', null) && (detail.source === "schema" || detail.source === "history")
        this.set("vaccineOnly", vaccineOnly)
        this.set("readonly", !!readonly)
        this.set("nextDate", null)
        this.set("showLinks", showLinks)
        this.set("hcpListItem", [])
        this._detach = []

        this.set("isLoading", true)

        if (_.get(service, 'tags', []) && (
            _.get(service, 'tags', []).some(t => t.type == "SOAP" && t.code == "Plan") &&
            _.get(service, 'tags', []).some(t => t.type == 'CD-ITEM-TASK')))
            this.convertMedispringPlan(service)

        if (_.get(service, 'id', null)) {
            this.set("isExistingSvc", true)
            this.set("service", service)

            const codeProcedure = this._find(service, "codes", "BE-THESAURUS-PROCEDURES")
            const codeProfession = this._find(service, "codes", "CD-HCPARTY")
            const codeVaccine = this._find(service, "tags", "CD-ITEM")
            const codeStatus = this._find(service, "tags", "CD-LIFECYCLE")
            const content = this.api.contact().preferredContent(service, this.language)
            const codeMedication = this._find(content, 'medicationValue.medicinalProduct.intendedcds', "CD-DRUG-CNK") || {}

            const codeExp = _.get(codeProcedure, 'code', null) ? _.get(codeProcedure, 'code', null).split(".") : null
            const CISPType = codeExp ? codeExp[0].substr(1, 3) : null
            this.set("isVaccineProcedure", CISPType === "44")

            let critical = true

            const procedureId = _.get(codeProcedure, 'id', this._getId(codeProcedure))

            Promise.all([
                this.api.hcparty().getHealthcareParty(service.responsible),
                procedureId ? this.api.code().getCode(procedureId) : Promise.resolve({}),
                _.get(codeProfession, 'code', null) ? this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', 'fr', _.get(codeProfession, 'code', null), null, null, 10) : Promise.resolve({})
                //codeVaccine && codeVaccine.id && codeMedication && codeMedication.code ? this.api.bedrugs().getMppInfos(codeMedication.code, this.language) : Promise.resolve({})
            ]).then(([hcp, procedure, profession]) => {
                this.push("hcpListItem", {id: hcp.id, name: hcp.lastName + ' ' + hcp.firstName})

                parseInt(('' + _.padEnd(_.get(service, 'valueDate', null), 14, 0)).replace(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{6})/, '$3')) !== 0 ? this.set("accuracy", "day") :
                    parseInt(('' + _.padEnd(_.get(service, 'valueDate', null), 14, 0)).replace(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{6})/, '$2')) !== 0 ? this.set("accuracy", "month") :
                        parseInt(('' + _.padEnd(_.get(service, 'valueDate', null), 14, 0)).replace(/([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{6})/, '$1')) !== 0 ? this.set("accuracy", "year") : null

                const date = this._getDate(service)

                this.set("proceduresListItem", [procedure])
                this.procedureChanged({detail: {value: (_.get(codeProcedure, 'code', null))}})

                this.professionId = this._getId(codeProfession)
                const medicationValue = _.get(content, 'medicationValue', null)
                const vaccineId = this.isVaccineProcedure && _.get(codeMedication, 'code', null)
                const vaccineName = this.isVaccineProcedure && _.get(medicationValue, 'medicinalProduct.intendedname', null)

                this.set("plannedAction", {
                    Status: _.get(codeStatus, 'code', null),
                    Deadline: date,
                    HcpId: _.get(service, 'responsible', null),
                    ProcedureId: _.get(codeProcedure, 'code', null),
                    ProfessionId: this.professionId,
                    ReasonOfRef: _.get(codeStatus, 'code', null) === "refused" ? _.get(codeStatus, 'label', null) : "",
                    isDeadline: (date ? true : false),
                    isSurgical: this.api.contact().preferredContent(service, "isSurgical").booleanValue ? true : false,
                    VaccineCommercialNameId: vaccineId,
                    VaccineName: vaccineName,
                    DoseNumber: this.isVaccineProcedure && _.get(medicationValue, 'options.doseNumber.stringValue', null),
                    BatchNumber: this.isVaccineProcedure && _.get(medicationValue, 'batch', null),
                    ProcedureInfo: procedure,
                    Description: _.get(service, 'comment', null),
                    ProfessionInfo: (profession && profession.rows && profession.rows[0]) || {},
                    //VaccineInfo: (codeVaccine && codeVaccine.length ? resultVaccine : "")
                })

                //this.set('drugsListItem', [resultVaccine]);
                this.set("selectedHcpItem", {
                    id: this.plannedAction.HcpId,
                    name: !hcp.name ? hcp.lastName + ' ' + hcp.firstName : hcp.name
                })

                this.set("selectedProfessionItem", this.hcpartyTypeList.find(type => type.id === this.plannedAction.ProfessionId))
                this.set("isStatusComplete", _.get(codeStatus, 'code', null) === "completed")
                this.set("isStatusRefusal", _.get(codeStatus, 'code', null) === "refused")
                if (this.plannedAction.isSurgical)
                    this.set("hasSurgical", true)
                critical = false
                return _.get(codeVaccine, 'id', null) && _.get(codeMedication, 'code', null) ? this.api.bedrugs().getMppInfos(_.get(codeMedication, 'code', null), this.language) : Promise.resolve({})
            }).then((resultVaccine) => {
                // console.log(resultVaccine)
                this.plannedAction.VaccineInfo = resultVaccine
            }).catch(err => {
                if (critical)
                    this._setError(err)
            }).finally(() => {
                if (this.plannedAction.VaccineCommercialNameId) {
                    this.set("selectedVaccineItem", {
                        id: this.plannedAction.VaccineCommercialNameId,
                        name: this.plannedAction.VaccineName
                    })
                    this.set("plannedAction.VaccineName", null)
                }
                this._footprint = this._getFootprint()
                this._dispatchChangedEvent()
                this.set("isLoading", false)
            })
            return
        }

        this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
            if (hcp.type) {
                // do not set prestataire by default
                //this.set("selectedHcpItem", hcp)
                //this.set("plannedAction.HcpId",this.selectedHcpItem.id)
                this.set("plannedAction.ProfessionId", "CD-HCPARTY|" + hcp.type + "|1")
                this.set("selectedProfessionItem", this.hcpartyTypeList.find(type => type.id === this.plannedAction.ProfessionId))
            }
        }).finally(() => {
            this.set("plannedAction.Deadline", moment().format('YYYY-MM-DD'))
            this.set("plannedAction.Status", "pending")
            this._footprint = this._getFootprint()
            this._dispatchChangedEvent()
            this.set("isLoading", false)
        })
    }

    _setNextDate(e) {
        const months = parseInt(e.target.dataset.months)
        const nextDate = moment().add(months, 'months')
        this.set("nextDate", nextDate.format("YYYY-MM-DD"))
    }

    getPlannedAction(service) {
        return this.api.contact().getContactWithUser(this.user, service.contactId).then(contact => {
            const ids = _.compact(_.get(contact, 'subContacts', []).filter(sc => sc.services.some(s => s.serviceId === service.id)).map(s => s.healthElementId))
            const promises = ids.map(id => this.api.helement().getHealthElement(id))
            return Promise.all(promises).then(healthElements => {
                this._linkedHes = healthElements
                return this.api.code().icpcChapters(_.compact(healthElements.map(he => he.codes.find(c => c.type === 'ICPC' || c.type === 'ICPC2'))).map(x => x.code))
                    .then((codes) => {
                        let plannedAction = {}
                        plannedAction.service = service
                        plannedAction.HealthElements = []
                        this._setColors(this._linkedHes, codes)
                        plannedAction.HealthElements = this._linkedHes

                        if (_.get(service, 'id', null)) {
                            const codeProcedure = this._find(service, "codes", "BE-THESAURUS-PROCEDURES")
                            const codeProfession = this._find(service, "codes", "CD-HCPARTY")
                            const codeVaccine = this._find(service, "tags", "CD-ITEM")
                            const codeStatus = this._find(service, "tags", "CD-LIFECYCLE")
                            const content = this.api.contact().preferredContent(service, this.language)
                            const codeMedication = this._find(content, "medicationValue.medicinalProduct.intendedcds", "CD-DRUG-CNK") || {}

                            const codeExp = _.get(codeProcedure, 'code', null) ? _.get(codeProcedure, 'code', null).split(".") : null
                            const CISPType = codeExp ? codeExp[0].substr(1, 3) : null
                            plannedAction.isVaccineProcedure = CISPType === "44"

                            const procedureId = _.get(codeProcedure, 'id', this._getId(codeProcedure))

                            return Promise.all([
                                this.api.hcparty().getHealthcareParty(service.responsible),
                                procedureId ? this.api.code().getCode(procedureId) : Promise.resolve({}),
                                _.get(codeProfession, 'code', null) ? this.api.code().findPaginatedCodesByLabel('be', 'CD-HCPARTY', 'fr', _.get(codeProfession, 'code', null), null, null, 10) : Promise.resolve({})
                            ]).then(([hcp, procedure, profession]) => {
                                plannedAction.HealthCareParty = {
                                    id: hcp.id,
                                    name: hcp.lastName + ' ' + hcp.firstName
                                }
                                plannedAction.professionId = this._getId(codeProfession)
                                const medicationValue = _.get(content, 'medicationValue', null)
                                const vaccineId = plannedAction.isVaccineProcedure && _.get(codeMedication, 'code', null)
                                const vaccineName = plannedAction.isVaccineProcedure && _.get(medicationValue, 'medicinalProduct.intendedname', null)
                                const date = this._getDate(service)

                                Object.assign(plannedAction, {
                                    Status: _.get(codeStatus, 'code', null),
                                    Deadline: date,
                                    HcpId: _.get(service, 'responsible', null),
                                    ProcedureId: _.get(codeProcedure, 'code', null),
                                    ReasonOfRef: _.get(codeStatus, 'code', null) === "refused" ? _.get(codeStatus, 'label', null) : "",
                                    isDeadline: (date ? true : false),
                                    isSurgical: this.api.contact().preferredContent(service, "isSurgical").booleanValue ? true : false,
                                    VaccineCommercialNameId: vaccineId,
                                    VaccineName: vaccineName,
                                    DoseNumber: plannedAction.isVaccineProcedure && _.get(medicationValue, 'options.doseNumber.stringValue', null),
                                    BatchNumber: plannedAction.isVaccineProcedure && _.get(medicationValue, 'batch', null),
                                    ProcedureInfo: procedure,
                                    Description: _.get(service, 'comment', null),
                                    ProfessionInfo: (profession && profession.rows && profession.rows[0]) || {},
                                })

                                //this.set("selectedProfessionItem", this.hcpartyTypeList.find(type => type.id === this.plannedAction.ProfessionId))
                                const promise = _.get(codeVaccine, 'id', null) && _.get(codeMedication, 'code', null) ? this.api.bedrugs().getMppInfos(_.get(codeMedication, 'code', null), this.language) : Promise.resolve({})
                                return promise.then(vaccine => {
                                    // console.log(vaccine)
                                    plannedAction.VaccineInfo = vaccine
                                    return Promise.resolve(plannedAction)
                                }).catch(error => {
                                    console.error(error)
                                })
                            })
                        }
                    })
            })
        })
    }

    convertMedispringPlan(svc) {
        const service = _.cloneDeep(svc)
        const content = service.content
        if (!content) return
        svc.comment = content.descr && content.descr.stringValue || ""
        svc.content = {}
        svc.content[this.language] = {}
        if (content.medication && content.medication.medicationValue)
            svc.content[this.language].medicationValue = content.medication.medicationValue
        _.remove(svc.tags, tag => tag.type == 'CD-ITEM-TASK')
        svc.label = "Actes"
    }

    shortServiceDescription(svc, lng) {
        let rawDesc = svc && this.api && this.api.contact().shortServiceDescription(svc, lng)
        return rawDesc && '' + rawDesc || ''
    }

    vaccineItemChanged() {
        if (!(this.drugsListItem && this.drugsListItem.length)) return
        this.set("plannedAction.VaccineCommercialNameId", this.selectedVaccineItem && this.selectedVaccineItem.id || "")
    }

    hcpItemChanged() {
        if (!(this.hcpListItem && this.hcpListItem.length) || typeof this.selectedHcpItem === "string") return
        this.set("plannedAction.HcpId", this.selectedHcpItem && this.selectedHcpItem.id || "")
    }

    professionItemChanged() {
        if (!(this.hcpartyTypeListFiltered && this.hcpartyTypeListFiltered.length)) return
        this.set("plannedAction.ProfessionId", this.selectedProfessionItem && this.selectedProfessionItem.id || "")
    }

    _setError(error) {
        // console.log(error);
        this.set("error", error)
        this._dispatchChangedEvent()
    }

    _dispatchChangedEvent() {
        this.dispatchEvent(new CustomEvent("changed", {
            detail: {
                error: this.error,
                service: this.service,
                isValid: this.isValid,
                changed: this._footprint !== this._getFootprint()
            },
            bubbles: true,
            composed: true
        }))
    }

    _checkValidity() {
        // console.log(this.plannedAction)
        this.set("isValid",
            this.plannedAction.Deadline && this.plannedAction.Deadline != "" &&
            this.plannedAction.ProcedureId && this.plannedAction.ProcedureId != "" &&
            this.plannedAction.Status != '' && !this.readonly)
        this._dispatchChangedEvent()
    }
}

customElements.define(HtPatActionPlanDetail.is, HtPatActionPlanDetail)
