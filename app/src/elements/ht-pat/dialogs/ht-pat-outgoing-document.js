import '../../dynamic-form/dynamically-loaded-form.js'
import '../../dynamic-form/entity-selector.js'
import '../../ht-spinner/ht-spinner.js'
import '../../../styles/scrollbar-style.js'
import '../../../styles/buttons-style.js'
import '../../../styles/dialog-style.js'
import '../../../styles/vaadin-icure-theme.js'
import '../../../styles/shared-styles.js'
import '../../../styles/dropdown-style.js'
import '../../../styles/paper-tabs-style.js'


import _ from 'lodash/lodash'
import moment from 'moment/src/moment'
import '../../prose-editor/prose-editor/prose-editor'
import * as evaljs from "evaljs"
import * as models from 'icc-api/dist/icc-api/model/models'


import {PolymerElement, html} from '@polymer/polymer'
import {TkLocalizerMixin} from "../../tk-localizer"

class HtPatOutgoingDocument extends TkLocalizerMixin(PolymerElement) {
    static get template() {
        return html`
        <style include="scrollbar-style dialog-style buttons-style dropdown-style paper-tabs-style shared-styles">

            #outgoingDocumentDialog {
                height:calc(100% - 160px);
                width: 90%;
            }

            #saveTemplateDialog {
                width: 720px;
                height:250px;
            }

            .overlaySpinnerContainer {
                position:absolute;
                width:100%;
                height:100%;
                z-index:10;
                background:rgba(255, 255, 255, .8);
                top:0;
                left:0;
                margin:0;
                padding:0;
            }

            .overlaySpinner {
                max-width:80px;
                margin:100px auto
            }

            .forceLeft {
                position: absolute;
                display: flex;
                flex-flow: row;
                left: 8px;
            }

        </style>





        <paper-dialog id="outgoingDocumentDialog" always-on-top="true" no-cancel-on-outside-click="true" no-cancel-on-esc-key="true">



            <h2 class="modal-title">[[localize('new_out-doc','New outgoing document',language)]] <paper-icon-button class="button button--other" dialog-dismiss="" icon="icons:close"></paper-icon-button></h2>

            <div class="content">
                <prose-editor id="prose-editor" class="content" on-refresh-context="_refreshProseEditorContext"></prose-editor>
            </div>

            <div class="buttons">

                <div class="forceLeft">
                    <paper-button class="button button--other" on-tap="_openDialogLoadTemplate"><iron-icon icon="icons:description"></iron-icon>[[localize('loadTemplate','Load template',language)]]</paper-button>
                    <paper-button class="button button--other" on-tap="_openDialogSaveTemplate"><iron-icon icon="icons:save"></iron-icon>[[localize('saveAsTemplate','Save as template',language)]]</paper-button>
                    <paper-button class="button button--other" on-tap="_flushProseEditorContent"><iron-icon icon="icons:delete"></iron-icon>[[localize('eraseAll','Erase all',language)]]</paper-button>
                </div>

                <paper-button class="button button--other" on-tap="_print"><iron-icon icon="icons:print"></iron-icon>[[localize('print','Print',language)]]</paper-button>
                <paper-button class="button button--save" on-tap="_saveAndAddToPatFile"><iron-icon icon="icons:save"></iron-icon>[[localize('saveToPatFile','Save to patient file',language)]]</paper-button>

            </div>



            <entity-selector id="loadTemplateDialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[_getTemplateSelectorColumns()]]" data-provider="[[_templatesDp()]]" entity-icon="icons:description" entity-type="[[localize('aTemplate','a template',language)]]" on-entity-selected="_applyProseEditorTemplate"></entity-selector>



            <paper-dialog id="saveTemplateDialog" class="p0" always-on-top="true" no-cancel-on-outside-click="true" no-cancel-on-esc-key="true">

                <h2 class="modal-title">[[localize('saveAsTemplate','Save as template',language)]]</h2>

                <div class="content pl20 pr20">
                    <paper-input label="[[localize('docTitle','Title',language)]] - Menu (max 50 [[localize('characters','characters',language)]])" autofocus="" auto-validate="" required="" maxlength="50" value="{{_data.proseEditorSelectedTemplate.name}}" id="templateName"></paper-input>
                    <paper-input label="[[localize('des','Description',language)]] = [[localize('documentVisibleTitle','Description',language)]]" autofocus="" auto-validate="" required="" value="{{_data.proseEditorSelectedTemplate.descr}}" id="templateDescription"></paper-input>
                </div>

                <div class="buttons">
                    <div class="forceLeft"><paper-button class="button button--other" dialog-dismiss=""><iron-icon icon="icons:close"></iron-icon>[[localize('can','Cancel',language)]]</paper-button></div>
                    <template is="dom-if" if="[[!_data.proseEditorSelectedTemplate.id]]"><paper-button class="button button--save" on-tap="_doSaveTemplate"><iron-icon icon="icons:save"></iron-icon>[[localize('save','Save',language)]]</paper-button></template>
                    <template is="dom-if" if="[[_data.proseEditorSelectedTemplate.id]]">
                        <paper-button class="button button--other" on-tap="_doSaveTemplate"><iron-icon icon="icons:warning"></iron-icon>[[localize('save_current_version','Save current version',language)]]</paper-button>
                        <paper-button class="button button--save" on-tap="_doSaveTemplate" data-version="new"><iron-icon icon="icons:save"></iron-icon>[[localize('save_new_version','Save new version',language)]]</paper-button>
                    </template>
                </div>

            </paper-dialog>



            <div class="successLabel" id="templateSavedLabel"><iron-icon icon="check"></iron-icon>[[localize('templateSuccessfullySaved','Template successfully saved',language)]]</div>
            <div class="failedLabel" id="templateNotSavedLabel"><iron-icon icon="clear"></iron-icon>[[localize('templateNotSaved','Template could not be saved',language)]]</div>



            <template is="dom-if" if="[[_isBusy]]"><div class="overlaySpinnerContainer"><div class="overlaySpinner"><ht-spinner active=""></ht-spinner></div></div></template>



        </paper-dialog>
`
    }

    static get is() {
        return 'ht-pat-outgoing-document'
    }

    static get properties() {
        return {
            api: {
                type: Object,
                noReset: true,
                value: () => {
                }
            },
            user: {
                type: Object,
                noReset: true,
                value: () => {
                }
            },
            i18n: {
                type: Object,
                noReset: true,
                value: () => {
                }
            },
            resources: {
                type: Object,
                noReset: true,
                value: () => {
                }
            },
            language: {
                type: String,
                noReset: true,
                value: "fr"
            },
            patient: {
                type: Object,
                noReset: true,
                value: () => {
                }
            },
            _isBusy: {
                type: Boolean,
                value: false,
                noReset: true
            },
            dataProvider: {
                type: Object,
                value: () => {
                }
            },
            _data: {
                type: Object,
                value: () => {
                    return {
                        currentMh: {
                            type: Object,
                            value: () => {
                            }
                        },
                        currentHcp: {
                            type: Object,
                            value: () => {
                            }
                        },
                        contactHcp: {
                            type: Object,
                            value: () => {
                            }
                        },
                        currentPatient: {
                            type: Object,
                            value: () => {
                            }
                        },
                        codes: {
                            type: Object,
                            value: () => {
                            }
                        },
                        proseEditorVariables: {
                            type: Array,
                            value: () => []
                        },
                        currentContact: {
                            type: Array,
                            value: () => []
                        },
                        selectedContact: {
                            type: Object,
                            value: () => {
                            }
                        },
                        allHealthElements: {
                            type: Array,
                            value: () => {
                            }
                        },
                        formsAndDataProviders: {
                            type: Array,
                            value: () => []
                        },
                        proseEditorTemplates: {
                            type: Array,
                            value: () => []
                        },
                        proseEditorSelectedTemplate: {
                            type: Object,
                            value: () => {
                            }
                        },
                        eMediattest: {
                            type: Object,
                            value: () => {
                            }
                        },
                        pdf: {
                            type: Object,
                            value: () => {
                                return {
                                    content: {
                                        type: String,
                                        value: ""
                                    },
                                    data: {
                                        type: ArrayBuffer,
                                        value: null
                                    },
                                    filename: {
                                        type: String,
                                        value: ""
                                    },
                                    createdMessage: {
                                        type: Object,
                                        value: () => {
                                        }
                                    },
                                    createdDocument: {
                                        type: Object,
                                        value: () => {
                                        }
                                    },
                                }
                            }
                        },
                    }
                }
            }
        }
    }

    static get observers() {
        return []
    }

    constructor() {
        super()
    }

    ready() {
        super.ready()
    }

    _resetComponentProperties() {
        const promResolve = Promise.resolve()
        return promResolve
            .then(() => {
                const componentProperties = HtPatOutgoingDocument.properties
                Object.keys(componentProperties).forEach(k => {
                    if (!_.get(componentProperties[k], "noReset", false)) {
                        this.set(k, (typeof componentProperties[k].value === 'function' ? componentProperties[k].value() : (componentProperties[k].value || null)))
                    }
                })
                return promResolve
            })
    }

    _msTstampToDDMMYYYY(msTstamp) {
        return parseInt(msTstamp) ? this.api.moment(parseInt(msTstamp)).format('DD/MM/YYYY') : ""
    }

    _msTstampToYYYYMMDD(msTstamp) {
        return parseInt(msTstamp) ? this.api.moment(parseInt(msTstamp)).format('YYYYMMDD') : ""
    }

    _YYYYMMDDToDDMMYYYY(inputValue) {
        return parseInt(inputValue) ? this.api.moment(_.trim(parseInt(inputValue)), "YYYYMMDD").format('DD/MM/YYYY') : ""
    }

    _YYYYMMDDHHmmssToDDMMYYYYHHmmss(inputValue) {
        return parseInt(inputValue) ? this.api.moment(_.trim(parseInt(inputValue)), "YYYYMMDDHHmmss").format('DD/MM/YYYY HH:mm:ss') : ""
    }

    _YYYYMMDDHHmmssToDDMMYYYY(inputValue) {
        return parseInt(inputValue) ? this.api.moment(_.trim(parseInt(inputValue)), "YYYYMMDDHHmmss").format('DD/MM/YYYY') : ""
    }

    _upperFirstAll(inputValue) {
        return _.trim(_.map(_.trim(inputValue).toLowerCase().split(" "), i => _.upperFirst(_.trim(i))).join(" "))
    }

    _dobToAge(inputValue) {
        return inputValue ? this.api.getCurrentAgeFromBirthDate(inputValue, (e, s) => this.localize(e, s, this.language)) : ''
    }

    _getPrettifiedHcp(hcpId = null) {

        const promResolve = Promise.resolve()

        return promResolve
            .then(() => !hcpId ? this.api.hcparty().getCurrentHealthcareParty() : this.api.hcparty().getHealthcareParty(hcpId))
            .then(hcp => {
                const addressData = _.find(_.get(hcp, "addresses", []), {addressType: "work"}) || _.find(_.get(hcp, "addresses", []), {addressType: "home"}) || _.get(hcp, "addresses[0]", [])
                return _.merge({}, hcp, _.mapValues({
                    address: [_.trim(_.get(addressData, "street", "")), _.trim(_.get(addressData, "houseNumber", "")) + (!!_.trim(_.get(addressData, "postboxNumber", "")) ? "/" + _.trim(_.get(addressData, "postboxNumber", "")) : "")].join(", "),
                    postalCode: _.trim(_.get(addressData, "postalCode", "")),
                    city: this._upperFirstAll(_.trim(_.get(addressData, "city", ""))),
                    country: this._upperFirstAll(_.trim(_.get(addressData, "country", ""))),
                    phone: _.trim(_.get(_.find(_.get(addressData, "telecoms", []), {"telecomType": "phone"}), "telecomNumber", "")),
                    mobile: _.trim(_.get(_.find(_.get(addressData, "telecoms", []), {"telecomType": "mobile"}), "telecomNumber", "")),
                    email: _.trim(_.get(_.find(_.get(addressData, "telecoms", []), {"telecomType": "email"}), "telecomNumber", "")),
                    firstName: this._upperFirstAll(_.get(hcp, "firstName", "")),
                    lastName: this._upperFirstAll(_.get(hcp, "lastName", "")),
                    nihiiHr: this.api.formatInamiNumber(_.trim(_.get(hcp, "nihii", ""))),
                    ssinHr: this.api.formatSsinNumber(_.trim(_.get(hcp, "ssin", ""))),
                }, i => typeof i === "string" ? !!_.trim(i) ? _.trim(i) : '-' : i))
            })
            .catch(() => promResolve)

    }

    _getPrettifiedMh() {

        return !_.trim(_.get(this, "_data.currentHcp.parentId", "")) ? Promise.resolve() : this._getPrettifiedHcp(_.trim(_.get(this, "_data.currentHcp.parentId", "")))

    }

    _getPrettifiedContactHcp(hcpId = null) {

        // Get from selected contact and not current contact / might be different
        const contactHcpId = !!_.trim(hcpId) ? hcpId : !!_.trim(_.get(this, "_data.selectedContact.responsible", "")) ? _.trim(_.get(this, "_data.selectedContact.responsible", "")) : _.trim(_.get(this, "user.healthcarePartyId"))

        return contactHcpId === _.trim(_.get(this, "_data.currentHcp.id", "")) ? Promise.resolve(_.cloneDeep(_.get(this, "_data.currentHcp", {}))) : this._getPrettifiedHcp(contactHcpId)

    }

    _getPrettifiedPatient(user, patientId, patientObject = null) {

        const promResolve = Promise.resolve()

        return !_.size(patientObject) && (!_.trim(_.get(user, "id")) || !_.trim(patientId)) ? promResolve : (!!_.size(patientObject) ? Promise.resolve(patientObject) : this.api.patient().getPatientWithUser(user, patientId))
            .then(patient => {
                const addressData = _.find(_.get(patient, "addresses", []), {addressType: "home"}) || _.find(_.get(patient, "addresses", []), {addressType: "work"}) || _.get(patient, "addresses[0]", [])
                return _.merge({}, patient, _.mapValues({
                    address: [_.trim(_.get(addressData, "street", "")), _.trim(_.get(addressData, "houseNumber", "")) + (!!_.trim(_.get(addressData, "postboxNumber", "")) ? "/" + _.trim(_.get(addressData, "postboxNumber", "")) : "")].join(", "),
                    postalCode: _.trim(_.get(addressData, "postalCode", "")),
                    city: this._upperFirstAll(_.trim(_.get(addressData, "city", ""))),
                    country: this._upperFirstAll(_.trim(_.get(addressData, "country", ""))),
                    phone: _.trim(_.get(_.find(_.get(addressData, "telecoms", []), {"telecomType": "phone"}), "telecomNumber", "")),
                    mobile: _.trim(_.get(_.find(_.get(addressData, "telecoms", []), {"telecomType": "mobile"}), "telecomNumber", "")),
                    email: _.trim(_.get(_.find(_.get(addressData, "telecoms", []), {"telecomType": "email"}), "telecomNumber", "")),
                    firstName: this._upperFirstAll(_.get(patient, "firstName", "")),
                    lastName: this._upperFirstAll(_.get(patient, "lastName", "")),
                    ssinHr: this.api.formatSsinNumber(_.trim(_.get(patient, "ssin", ""))),
                    gender: !!_.trim(_.get(patient, "gender", "")) && ["female", "male", "changed"].indexOf(_.trim(_.get(patient, "gender", "male"))) ? _.trim(_.get(patient, "gender", "male")) : "unknown",
                    genderHr: this._upperFirstAll(this.localize(_.trim(_.get(patient, "gender", "male")) + "GenderLong", "masculin")),
                    civilityHr: (_.trim(_.get(patient, "gender", "")) === "female" ? this._upperFirstAll(this.localize("abrv_female", "Mrs.", this.language)) : this._upperFirstAll(this.localize("abrv_male", "Mr.", this.language))),
                    dateOfBirthHr: this._YYYYMMDDToDDMMYYYY(_.trim(_.get(patient, "dateOfBirth"))),
                    dateOfBirthHyphenSplitted: _.trim(_.get(patient, "dateOfBirth")).substring(0, 4) + "-" + _.trim(_.get(patient, "dateOfBirth")).substring(4, 6) + "-" + _.trim(_.get(patient, "dateOfBirth")).substring(6, 8),
                    age: this._dobToAge(_.trim(_.get(patient, "dateOfBirth"))),
                    insuranceData: _
                        .chain(_.get(patient, "insurabilities", {}))
                        .filter((i) => {
                            return i &&
                                !!moment(_.trim(_.get(i, "startDate", "0")), "YYYYMMDD").isBefore(moment()) &&
                                (!!moment(_.trim(_.get(i, "endDate", "0")), "YYYYMMDD").isAfter(moment()) || !_.trim(_.get(i, "endDate", ""))) &&
                                !!_.trim(_.get(i, "insuranceId", ""))
                        })
                        .map(i => {
                            return _.mapValues({
                                insuranceId: _.trim(_.get(i, "insuranceId", "")),
                                identificationNumber: _.trim(_.get(i, "identificationNumber", "")),
                                tc1: _.trim(_.get(i, "parameters.tc1", "")),
                                tc2: _.trim(_.get(i, "parameters.tc2", "")),
                                tc1tc2: [_.trim(_.get(i, "parameters.tc1", "")), _.trim(_.get(i, "parameters.tc2", ""))].join(" - "),
                                preferentialstatus: typeof _.get(i, "parameters.preferentialstatus") === "boolean" ? !!_.get(i, "parameters.preferentialstatus", false) : _.trim(_.get(i, "parameters.preferentialstatus")) === "true"
                            }, i => typeof i === "string" ? !!_.trim(i) ? _.trim(i) : '-' : i)
                        })
                        .head()
                        .value(),
                }, i => typeof i === "string" ? !!_.trim(i) ? _.trim(i) : '-' : i))
            })
            .then(patient => this._getInsuranceData(_.trim(_.get(patient, "insuranceData.insuranceId"))).then(insuranceData => _.merge({}, patient, {insuranceData: insuranceData})))
            .then(patient => !_.size(_.get(patient, "partnerships")) ? patient : this.api.patient().getPatientWithUser(user, _.trim(_.get(patient, "partnerships[0].partnerId")))
                .then(partner => _.merge({}, patient, {
                    partnerHr: {
                        firstName: this._upperFirstAll(_.get(partner, "firstName", "")),
                        lastName: this._upperFirstAll(_.get(partner, "lastName", "")),
                        ssinHr: this.api.formatSsinNumber(_.trim(_.get(partner, "ssin", ""))),
                        dateOfBirthHr: this._YYYYMMDDToDDMMYYYY(_.trim(_.get(partner, "dateOfBirth"))),
                    }
                }))
                .catch(() => patient)
            )
            .catch(() => promResolve)

    }

    _getInsuranceData(insuranceId) {

        const promResolve = Promise.resolve()

        return !_.trim(insuranceId) ? promResolve : this.api.insurance().getInsurance(insuranceId)
            .then(insuranceData => _.merge({}, {
                code: _.trim(_.get(insuranceData, "code", "")),
                name: this._upperFirstAll(!!_.trim(_.get(insuranceData, "name." + this.language, "")) ? _.trim(_.get(insuranceData, "name." + this.language, "")) : _.trim(_.find(_.get(insuranceData, "name", {}), _.trim))),
                address: _.trim(_.get(insuranceData, "address.street", "")),
                postalCode: _.trim(_.get(insuranceData, "address.postalCode", "")),
                city: this._upperFirstAll(_.trim(_.get(insuranceData, "address.city", ""))),
            }))
            .catch(() => promResolve)

    }

    _getHeHrStatus(item) {

        //entity === null --> null
        //status & 3 === 3 -- x11 --> 'archived' !!! not 2
        //status & 2 === 2 -- x10 --> 'active-irrelevant'
        // && if closingdate before now -- x11 --> 'archived'
        //status & 1 === 1 -- x01 --> 'inactive'
        //status & 3 === 0 -- x00 --> 'active-relevant'
        // && if closingdate before now -- x01 --> 'inactive'

        return !item ? "" :
            ((item.status || 0) & 3) === 3 ? this.localize("archiv", "Archived", this.language) :
                ((item.status || 0) & 2) === 2 && (item.closingDate && this.api.moment(item.closingDate).isBefore()) ? this.localize("archiv", "Archived", this.language) :
                    ((item.status || 0) & 2) === 2 ? this.localize("act_irr", "Active irrelevant", this.language) :
                        ((item.status || 0) & 1) === 1 ? this.localize("ina", "Inactive", this.language) :
                            ((item.status || 0) & 3) === 0 && (item.closingDate && this.api.moment(item.closingDate).isBefore()) ? this.localize("ina", "Inactive", this.language) :
                                this.localize("act_rel", "Active relevant", this.language)

    }

    _getCodesFromData() {

        const resolvedCodes = {}

        const formAndSubFormValues = _.compact(
            _.flatten(_.map(_.get(this, "_data.formsAndDataProviders", {}), form => !_.get(form, "dataProvider", false) ? false :
                _.compact(_.concat(
                    _.get(form, "dataProvider.getValue")() || [],
                    _.compact(_.flatten(_.map((_.get(form, "dataProvider.getSubForms")() || []), subForm => _.get(subForm, "dataProvider.getValue")() || [])))
                ))
            ))
        )
            .filter(it => _.trim(it).toLowerCase().startsWith("cd-") && _.trim(it).indexOf("|") > 1)
            .map(it => {
                const splittedCode = it.split("|")
                return {type: _.trim(_.get(splittedCode, "[0]")), code: _.trim(_.get(splittedCode, "[1]"))}
            })

        const codesToResolve = _.uniqWith(
            _.compact(
                _.concat(
                    _.flatMapDeep(
                        _.map(_.get(this, "_data.allHealthElements", {}), hes => _.map(hes, he => _.concat(
                            _.map(_.get(he, "codes", []), it => _.merge({}, {
                                type: _.trim(_.get(it, "type", "")),
                                code: _.trim(_.get(it, "code", ""))
                            })),
                            _.map(_.get(he, "tags", []), it => _.merge({}, {
                                type: _.trim(_.get(it, "type", "")),
                                code: _.trim(_.get(it, "code", ""))
                            })),
                            _.map(_.get(he, "content." + this.language + ".medicationValue.regimen", []), it => _.merge({}, {
                                type: _.trim(_.get(it, "dayPeriod.type", "")),
                                code: _.trim(_.get(it, "dayPeriod.code", ""))
                            })),
                        )))
                    ),
                    formAndSubFormValues
                )
            ), _.isEqual
        )


        // let prom = Promise.resolve([])
        // const filteredCodesToResolve = _.filter(codesToResolve, x => !!_.trim(_.get(x,"type")) || !!_.trim(_.get(x,"code")))
        //
        // return Promise.all(_.map(filteredCodesToResolve, it => {
        //     prom = prom.then(filteredCodesToResolve => this.api.code().findCodes("be",_.trim(_.get(it,"type","")),_.trim(_.get(it,"code","")))
        //         .then(foundCodes => _.map(foundCodes, singleCode => {
        //             singleCode = _.merge({},singleCode,{
        //                 labelHr: singleCode.type === "CD-TRANSACTION" ?
        //                     _.upperFirst(_.trim(this.localize("cd-transaction-" + _.trim(_.get(singleCode,"code")), _.trim(_.get(singleCode,"code")), this.language)).toLowerCase()) :
        //                     singleCode.type === "CD-SEVERITY" ? _.upperFirst(_.trim(this.localize(_.trim(_.get(singleCode,"code")), _.trim(_.get(singleCode,"code")), this.language)).toLowerCase()) :
        //                     singleCode.type === "CD-DAYPERIOD" ? _.upperFirst(_.trim(this.localize('ms_' + _.trim(_.get(singleCode,"code")), (_.trim(_.get(singleCode,"label." + this.language,"")) ? _.upperFirst(_.trim(_.get(singleCode,"label." + this.language,"")).toLowerCase()) : _.upperFirst(_.trim(_.head(_.flatMap(_.get(singleCode,"label","")))).toLowerCase())), this.language)).toLowerCase()) :
        //                     _.trim(_.get(singleCode,"label." + this.language,"")) ?
        //                         _.upperFirst(_.trim(_.get(singleCode,"label." + this.language,"")).toLowerCase()) :
        //                         _.upperFirst(_.trim(_.head(_.flatMap(_.get(singleCode,"label","")))).toLowerCase())
        //             })
        //             if(!resolvedCodes[singleCode.type]) { resolvedCodes[singleCode.type] = [singleCode] } else { resolvedCodes[singleCode.type].push(singleCode) }
        //             return _.concat(filteredCodesToResolve,resolvedCodes)
        //         }))
        //     )
        // }))


        return Promise.all(_.map(_.filter(codesToResolve, x => !!_.trim(_.get(x, "type")) || !!_.trim(_.get(x, "code"))), it => this.api.code().findCodes("be", _.trim(_.get(it, "type", "")), _.trim(_.get(it, "code", ""))).catch(e => {
        })))
            .then(promResults => _.map(promResults, promResult => _.map(promResult, singleCode => {
                singleCode = _.merge({}, singleCode, {
                    labelHr: singleCode.type === "CD-TRANSACTION" ?
                        _.upperFirst(_.trim(this.localize("cd-transaction-" + _.trim(_.get(singleCode, "code")), _.trim(_.get(singleCode, "code")), this.language)).toLowerCase()) :
                        singleCode.type === "CD-SEVERITY" ? _.upperFirst(_.trim(this.localize(_.trim(_.get(singleCode, "code")), _.trim(_.get(singleCode, "code")), this.language)).toLowerCase()) :
                            singleCode.type === "CD-DAYPERIOD" ? _.upperFirst(_.trim(this.localize('ms_' + _.trim(_.get(singleCode, "code")), (_.trim(_.get(singleCode, "label." + this.language, "")) ? _.upperFirst(_.trim(_.get(singleCode, "label." + this.language, "")).toLowerCase()) : _.upperFirst(_.trim(_.head(_.flatMap(_.get(singleCode, "label", "")))).toLowerCase())), this.language)).toLowerCase()) :
                                _.trim(_.get(singleCode, "label." + this.language, "")) ?
                                    _.upperFirst(_.trim(_.get(singleCode, "label." + this.language, "")).toLowerCase()) :
                                    _.upperFirst(_.trim(_.head(_.flatMap(_.get(singleCode, "label", "")))).toLowerCase())
                })
                return !resolvedCodes[singleCode.type] ? resolvedCodes[singleCode.type] = [singleCode] : resolvedCodes[singleCode.type].push(singleCode)
            })))
            .then(() => resolvedCodes)

    }

    _getPrettifiedHealthElements(allHealthElements) {

        const promResolve = Promise.resolve()

        return !_.size(allHealthElements) ? promResolve : promResolve
            .then(() => _.map(allHealthElements, hes => _.map(hes, he => {
                const evolutionExtraTemporalityCode = _.trim(_.get(_.find(_.get(he, "tags", []), {type: "CD-EXTRA-TEMPORALITY"}), "code", ""))
                const heIcpcCodes = _.map(_.filter(_.get(he, "codes", []), {type: "ICPC"}), i => _.trim(_.get(i, "code", ""))) || []
                const heIcdCodes = _.map(_.filter(_.get(he, "codes", []), {type: "ICD"}), i => _.trim(_.get(i, "code", ""))) || []
                const heHr = !!_.size(_.find(_.get(he, "codes", []), {type: "BE-THESAURUS-SURGICAL-PROCEDURES"})) ? _.trim(_.get(_.find(_.get(this, "_data.codes.BE-THESAURUS-SURGICAL-PROCEDURES", []), {code: _.get(_.find(_.get(he, "codes", []), {type: "BE-THESAURUS-SURGICAL-PROCEDURES"}), "code", "")}), "labelHr", "")) : _.trim(_.get(_.find(_.get(this, "_data.codes.BE-THESAURUS", []), {code: _.get(_.find(_.get(he, "codes", []), {type: "BE-THESAURUS"}), "code", "")}), "labelHr", ""))
                const allergyHr = !!_.size(_.find(_.get(he, "codes", []), {type: "CD-ATC"})) ? _.trim(_.get(_.find(_.get(this, "_data.codes.CD-ATC", []), {code: _.get(_.find(_.get(he, "codes", []), {type: "CD-ATC"}), "code", "")}), "labelHr", "")) : _.trim(_.get(_.find(_.get(this, "_data.codes.BE-ALLERGEN", []), {code: _.get(_.find(_.get(he, "codes", []), {type: "BE-ALLERGEN"}), "code", "")}), "labelHr", ""))
                const medicationContent = _.get(he, "content." + this.language)
                const cnkHrLabel = !!_.trim(_.get(medicationContent, "medicationValue.medicinalProduct.intendedname")) ? _.trim(_.get(medicationContent, "medicationValue.medicinalProduct.intendedname")) : _.trim(_.get(_.find(_.get(this, "_data.codes.CD-DRUG-CNK", []), {code: _.get(_.find(_.get(he, "codes", []), {type: "CD-DRUG-CNK"}), "code", "")}), "labelHr", ""))
                return _.merge(he, _.mapValues({
                    descr: _.upperFirst(_.trim(_.get(he, "descr", ""))),
                    heHr: heHr,
                    allergyHr: allergyHr,
                    cnkHr: _.trim(_.get(_.find(_.get(he, "codes", []), {type: "CD-DRUG-CNK"}), "code", "")) + " - " + cnkHrLabel,
                    statusHr: this._getHeHrStatus(he),
                    certaintyHr: _.trim(_.get(_.find(_.get(this, "_data.codes.CD-CERTAINTY", []), {code: _.get(_.find(_.get(he, "tags", []), {type: "CD-CERTAINTY"}), "code", "")}), "labelHr", "")),
                    severityHr: _.trim(_.get(_.find(_.get(this, "_data.codes.CD-SEVERITY", []), {code: _.get(_.find(_.get(he, "tags", []), {type: "CD-SEVERITY"}), "code", "")}), "labelHr", "")),
                    evolutionHr: !!evolutionExtraTemporalityCode ? this.localize(evolutionExtraTemporalityCode, evolutionExtraTemporalityCode, this.language) : "",
                    familyLinkHr: _.trim(_.get(_.find(_.get(this, "_data.codes.BE-FAMILY-LINK", []), {code: _.get(_.find(_.get(he, "codes", []), {type: "BE-FAMILY-LINK"}), "code", "")}), "labelHr", "")),
                    openingDateHr: !!parseInt(_.get(he, "openingDate", 0)) ? this._YYYYMMDDToDDMMYYYY(parseInt(_.get(he, "openingDate", 0))) : "",
                    closingDateHr: !!parseInt(_.get(he, "closingDate", 0)) ? this._YYYYMMDDToDDMMYYYY(parseInt(_.get(he, "closingDate", 0))) : "",
                    temporalityHr: _.trim(_.get(_.find(_.get(this, "_data.codes.CD-TEMPORALITY", []), {code: _.get(_.find(_.get(he, "tags", []), {type: "CD-TEMPORALITY"}), "code", "")}), "labelHr", "")),
                    heCodeHr: _.trim(_.get(_.find(_.get(he, "codes", []), {type: "ICPC"}), "code", "")),
                    icpcsHr: _.compact(_.map(_.get(this, "_data.codes.ICPC", []), it => heIcpcCodes.indexOf(_.trim(_.get(it, "code", ""))) === -1 ? false : _.trim(_.get(it, "code", "")) + " - " + _.trim(_.get(it, "labelHr", "")))).join(', '),
                    icdsHr: _.compact(_.map(_.get(this, "_data.codes.ICD", []), it => heIcdCodes.indexOf(_.trim(_.get(it, "code", ""))) === -1 ? false : _.trim(_.get(it, "code", "")) + " - " + _.trim(_.get(it, "labelHr", "")))).join(', '),
                    lastUpdateDateHr: !!parseInt(_.get(he, "modified", "")) ? this._msTstampToDDMMYYYY(parseInt(_.get(he, "modified", ""))) : "",
                    medication: {
                        cnkCode: _.trim(_.get(_.find(_.get(he, "codes", []), {type: "CD-DRUG-CNK"}), "code", "")),
                        cnkHrLabel: cnkHrLabel,
                        begin: !parseInt(_.get(medicationContent, "medicationValue.beginMoment", 0)) ? "" : this._YYYYMMDDToDDMMYYYY(parseInt(_.get(medicationContent, "medicationValue.beginMoment", 0))),
                        end: !parseInt(_.get(medicationContent, "medicationValue.endMoment", 0)) ? "" : this._YYYYMMDDToDDMMYYYY(parseInt(_.get(medicationContent, "medicationValue.endMoment", 0))),
                        comment: _.trim(_.get(medicationContent, "commentForDelivery", "")),
                        isRenewal: this.localize(!!_.get(medicationContent, "isRenewal", false) ? "yes" : "no", !!_.get(medicationContent, "isRenewal", false) ? "yes" : "no", this.language),
                        substitutionAllowed: this.localize(!!_.get(medicationContent, "substitutionAllowed", false) ? "subtitutionAllowed" : "subtitutionForbidden", !!_.get(medicationContent, "substitutionAllowed", false) ? "subtitutionAllowed" : "subtitutionForbidden", this.language),
                        regimenHr: _.map(_.get(medicationContent, "medicationValue.regimen", []), it => _.trim(_.get(it, "frequency", "daily")) === "daily" ? _.trim(_.get(it, "administratedQuantity.quantity", "")) + " " + _.trim(_.get(medicationContent, "regimen[0].administratedQuantity.unit", "")) + " - " + _.trim(_.get(_.find(_.get(this, "_data.codes.CD-DAYPERIOD", []), {code: _.trim(_.get(it, "dayPeriod.code", ""))}), "labelHr", "")) :
                            _.trim(_.get(it, "frequency", "daily")) === "weekly" ? _.trim(_.get(it, "administratedQuantity.quantity", "")) + " " + _.trim(_.get(medicationContent, "regimen[0].administratedQuantity.unit", "")) + " " + this.localize("perBy", "per", this.language) + " " + this.localize("week", "Week", this.language) + " (" + this.localize(_.trim(_.get(it, "administratedQuantity.day", "")), _.trim(_.get(it, "administratedQuantity.day", "")), this.language) + ") " :
                                _.trim(_.get(it, "frequency", "daily")) === "monthly" ? _.trim(_.get(it, "administratedQuantity.quantity", "")) + " " + _.trim(_.get(medicationContent, "regimen[0].administratedQuantity.unit", "")) + " " + this.localize("perBy", "per", this.language) + " " + this.localize("month", "Month", this.language).toLowerCase() + " (" + this.localize("the", "the", this.language) + " " + _.trim(_.get(it, "administratedQuantity.time", "")).substr(-2) + "° " + this.localize("ofMonth", "of month", this.language).toLowerCase() + ") " :
                                    ""
                        ).join(" // "),
                    }

                }, i => typeof i === "string" ? !!_.trim(i) ? _.trim(i) : '-' : i))
            })))
            .catch(() => promResolve)

    }

    _refreshProseEditorContext() {

        return Promise.resolve(this._doApplyProseEditorContext(this.shadowRoot.querySelector("#prose-editor")))

    }

    _getDataProvider() {

        return Promise.resolve({

            getYYYYMMDDAsDDMMYYYY: (value) => parseInt(value) ? this.api.moment(_.trim(parseInt(value)), "YYYYMMDD").format('DD/MM/YYYY') : "",

            getMeasureValue: (value) => !value ? "" : _.trim(_.get(value, "value")) + _.trim(_.get(value, "unit")),

            getBooleanValue: (value) => (typeof value === "boolean" && !!value) ? this.localize("yes", "Yes", this.language) : this.localize("no", "No", this.language),

            getLocalizedText: (value) => this.localize(_.trim(value), _.trim(value), this.language),

            getVariableValue: (value) => {
                return _.trim(
                    value === "todaysDate" ? this.localize('day_' + parseInt(moment().day()), this.language) + ` ` + moment().format('DD') + ` ` + (this.localize('month_' + parseInt(moment().format('M')), this.language)).toLowerCase() + ` ` + moment().format('YYYY') :
                        value === "documentTitle" ? _.trim(_.get(this, "_data.proseEditorSelectedTemplate.descr", this.localize('hub-doc-title', 'Document title', this.language))) :
                            value === "time" ? "" + moment().format('HH:mm') :
                                ""
                )
            },

            getHrCodesAndTagsValue: (value) => {
                if (!_.trim(value) || !(_.trim(value).toLowerCase().startsWith("cd-") && _.trim(value).indexOf("|") > 1)) return value
                const splittedValue = _.trim(value).split("|")
                const hrValue = _.get(_.find(_.get(this, "_data.codes." + _.trim(_.get(splittedValue, "[0]"))), {code: _.trim(_.get(splittedValue, "[1]"))}), "labelHr", "")
                return !!_.trim(hrValue) ? _.trim(hrValue) : value
            },

        })

    }

    _getFormEditorSortedItemsBasedOnTemplate(formDataProvider) {

        const formObject = typeof _.get(formDataProvider, "form", false) === "function" && formDataProvider.form()
        const layoutItems = _.flatten(_.flatten(_.get(formObject, "template.layout.sections", []).map(s => s.formColumns)).map(c => c.formDataList))

        // Make it look like on screen / don't use form's DP.sortedItems method
        return !formDataProvider || !formObject || !layoutItems ? (typeof _.trim(_.get(formDataProvider, "sortedItems", false)) === "string" ? formDataProvider.sortedItems() : formDataProvider) :
            _.concat(
                _.chain(layoutItems).filter(it => _.trim(_.get(it, "type", "")) !== "TKSubConsult").orderBy(["sortOrder", "editor.top", "editor.left"]).value(),
                _.chain(layoutItems).filter(it => _.trim(_.get(it, "type", "")) === "TKSubConsult").orderBy(["sortOrder", "editor.top", "editor.left"]).map(it => _.merge(it, {isSubForm: true})).value()
            )

    }

    _doApplyProseEditorContext(proseEditorObject) {

        //This fn creates the function that return the subContexts (like the context but corresponding to a subForm)
        const makeSubContextsSubForms = (ctx) => ((key, subFormIdx) =>
                _.compact(ctx.dataProvider.getSubForms(key).map((sf, idx) => {
                    const subCtx = _.assign({}, ctx, {
                        componentDataProvider: ctx.componentDataProvider,
                        dataProvider: sf.dataProvider
                    })
                    subCtx.subContexts = makeSubContextsSubForms(subCtx)
                    return parseInt(idx) !== parseInt(subFormIdx) ? false : subCtx
                }))
        )

        const makeSubContextsForms = (ctx) => ((key) => {
            const subCtx = _.assign({}, ctx, {
                componentDataProvider: ctx.componentDataProvider,
                dataProvider: _.get(ctx, "formsAndDataProviders[" + key + "].dataProvider", null)
            })
            subCtx.subContextsSubForms = makeSubContextsSubForms(subCtx)
            return [subCtx]
        })

        const makeSubContextsHes = (ctx) => ((key) => _.compact(_.map(_.get(ctx, "healthElements." + key), he => !_.trim(_.get(he, "id")) ? null : _.assign({}, ctx, {
            dataProvider: {
                form: () => {
                    return {template: {id: _.trim(_.get(he, "id"))}, he: he}
                }
            }
        }))))

        const ctx = {
            formatDate: (date) => this.api.moment(date).format('DD/MM/YYYY'),
            user: _.get(this, "user", {}),
            patient: _.get(this, "_data.currentPatient", {}),
            hcp: _.get(this, "_data.contactHcp", {}),
            mh: _.get(this, "_data.currentMh", {}),
            // currentContact: _.get(this,"currentContact",{}),
            currentContact: _.get(this, "_data.selectedContact", {}),
            contactOpeningDate: this._YYYYMMDDHHmmssToDDMMYYYY(_.get(this, "_data.selectedContact.openingDate", "")),
            language: this.language,
            formsAndDataProviders: _.get(this, "_data.formsAndDataProviders", {}),
            dataProvider: _.get(this, "dataProvider", {}),
            componentDataProvider: _.get(this, "dataProvider", {}),
            healthElements: _.get(this, "_data.allHealthElements", {}),
            _: _
        }
        ctx.subContextsHes = makeSubContextsHes(ctx)
        ctx.subContextsForms = makeSubContextsForms(ctx)
        ctx.subContextsSubForms = makeSubContextsSubForms(ctx)

        proseEditorObject.applyContext((expr, ctx) => {
            return new Promise(function (resolve, reject) {
                try {
                    const env = new evaljs.Environment(_.assign(ctx, {resolve, reject}))
                    const gen = (env.gen(expr)())
                    let status = {done: false}
                    while (!status.done) {
                        try {
                            status = gen.next()
                        } catch (e) {
                            reject(e)
                            return
                        }
                    }
                    if (status.value && status.value.asynchronous) {
                        //Wait for internal resolution... it is the responsibility of the js to call resolve
                        // TODO: manage some timeout
                    } else {
                        resolve(status.value)
                    }
                } catch (e) {
                    reject(e)
                }
            })
        }, ctx)

    }

    _getTemplateSelectorColumns() {

        return [
            {key: 'name', title: this.localize('name', this.language)},
            {key: 'descr', title: this.localize('des', this.language)},
            {key: 'createdHr', title: this.localize('creation', this.language)}
        ]

    }

    _refreshDataProseEditorTemplates() {

        return this._getProseEditorTemplatesAndAttachment()
            .then(proseEditorTemplates => _.assign(this._data, {proseEditorTemplates: proseEditorTemplates}))
            .then(() => this.dispatchEvent(new CustomEvent('refresh-templates-menu', {
                composed: true,
                bubbles: true,
                detail: {}
            })))
            .then(() => this._refreshDialogLoadTemplate())

    }

    _flushProseEditorContent() {

        const promResolve = Promise.resolve()
        const proseEditor = this.shadowRoot.querySelector("#prose-editor")

        return promResolve
            .then(() => this.set("_data.proseEditorSelectedTemplate", null))
            .then(() => proseEditor && proseEditor.setHTMLContent(""))

    }

    _openDialogLoadTemplate() {

        this.shadowRoot.querySelector("#loadTemplateDialog") && this.shadowRoot.querySelector("#loadTemplateDialog").open()
        setTimeout(() => {
            this._refreshDialogLoadTemplate()
        }, 100)

    }

    _refreshDialogLoadTemplate() {

        const loadTemplateDialog = this.shadowRoot.querySelector("#loadTemplateDialog")
        loadTemplateDialog && ((loadTemplateDialog.filterValue = "  ") || true) && (loadTemplateDialog.refresh() || true) && (loadTemplateDialog.forceRefresh() || true) && setTimeout(() => {
            loadTemplateDialog.filterValue = ""
        }, 1100)

    }

    _templatesDp() {

        return {
            filter: function (filterValue, limit, offset, sortKey, descending) {
                const searchTermRegExp = _.trim(filterValue) && new RegExp(_.trim(filterValue).normalize('NFD').replace(/[\u0300-\u036f ]/g, ""), "i")
                const filteredResults = _.filter(_.get(this, "_data.proseEditorTemplates", []), it => _.trim(_.get(it, "searchTerms", "")).match(searchTermRegExp))
                return Promise.resolve({
                    totalSize: _.size(filteredResults),
                    rows: (descending ? _.reverse(_.sortBy(filteredResults, sortKey)) : _.sortBy(filteredResults, sortKey)).slice(0, limit)
                })
            }.bind(this)
        }

    }

    _applyProseEditorTemplate(e, selectedTemplate) {

        const promResolve = Promise.resolve()
        const prose = this.shadowRoot.querySelector("#prose-editor")

        return (!prose || !_.get(selectedTemplate, "attachmentFileContent")) ? promResolve : promResolve
            .then(() => this._flushProseEditorContent())
            .then(() => this.set("_data.proseEditorSelectedTemplate", selectedTemplate))
            .then(() => JSON.parse(this.api.crypto().utils.ua2utf8(_.get(this, "_data.proseEditorSelectedTemplate.attachmentFileContent"))))
            .then(jsonTemplate => {
                jsonTemplate.content[0].content = _
                    .chain(_.get(jsonTemplate, "content[0].content", {}))
                    .map(node => node.type !== "dynamicNodes" ?
                        node :
                        _.trim(_.get(node, "templateGuid")) ?
                            // Trying to render form, via its templateGuid
                            _
                                .chain(_.get(this, "_data.proseEditorVariables", []))
                                .find({type: "forms"})
                                .get("subVars", [])
                                .find({templateGuid: _.get(node, "templateGuid")})
                                .get("nodes", [])
                                .value() :
                            // Going for a specific var name
                            _
                                .chain(_.get(this, "_data.proseEditorVariables", []))
                                .find({type: _.get(node, "varName")})
                                .get("subVars", [])
                                .map("nodes")
                                .flatten()
                                .value()
                    )
                    .flatten()
                    .value()
                return jsonTemplate
            })
            .then(jsonTemplate => prose && prose.setJSONContent(JSON.stringify(jsonTemplate))).then(() => this._refreshProseEditorContext())

    }

    _getPrettifiedFormsAndDataProviders(formsAndDataProviders) {

        const promResolve = Promise.resolve()
        let totalFormCountsByTemplateGuid = []

        return !_.size(formsAndDataProviders) ? promResolve : promResolve.then(() => _
            .chain(formsAndDataProviders)
            .map(formAndDp => {
                const formObject = typeof _.get(formAndDp, "dataProvider.form") === "function" && _.get(formAndDp, "dataProvider.form")()
                const templateGuid = _.trim(_.get(formObject, "template.guid", ""))
                return !!formObject && !!templateGuid && {templateGuid: templateGuid, formAndDp: formAndDp}
            })
            .compact()
            .map(it => {
                const templateGuid = _.trim(_.get(it, "templateGuid", ""))
                if (!_.get(totalFormCountsByTemplateGuid, templateGuid, false)) totalFormCountsByTemplateGuid[templateGuid] = 0
                totalFormCountsByTemplateGuid[templateGuid]++
                return [templateGuid + "#" + _.trim(totalFormCountsByTemplateGuid[templateGuid]), _.get(it, "formAndDp", null)]
            })
            .fromPairs()
            .value()
        )
    }

    _openDialogSaveTemplate() {

        this.$['saveTemplateDialog'].open()

    }

    _dropVarsFromProseJsonContent(proseJsonContent, variablesPath) {
        if (!_.size(variablesPath)) return proseJsonContent
        _.map(variablesPath, (v) => {
            _.set(proseJsonContent, v + ".content", [])
        })
        return proseJsonContent
    }

    _confirmTemplateSaved() {

        if (this.shadowRoot.querySelector("#templateSavedLabel") && this.shadowRoot.querySelector("#templateSavedLabel").classList) {
            this.shadowRoot.querySelector("#templateSavedLabel").classList.add('displayNotification')
            setTimeout(() => {
                this.shadowRoot.querySelector("#templateSavedLabel").classList.remove('displayNotification')
            }, 5000)
        }

    }

    _confirmTemplateNotSaved() {

        if (this.shadowRoot.querySelector("#templateNotSavedLabel") && this.shadowRoot.querySelector("#templateNotSavedLabel").classList) {
            this.shadowRoot.querySelector("#templateNotSavedLabel").classList.add('displayNotification')
            setTimeout(() => {
                this.shadowRoot.querySelector("#templateNotSavedLabel").classList.remove('displayNotification')
            }, 5000)
        }

    }

    _getProseEditorTemplatesAndAttachment() {

        const promResolve = Promise.resolve()

        return this._getProseEditorTemplates()
            .then(foundTemplates => Promise.all(_.map(foundTemplates, template => template && this.api.doctemplate().getAttachmentText(template.id, template.attachmentId).then(attachmentFileContent => _.merge({}, template, {attachmentFileContent: attachmentFileContent})))))
            .catch(e => {
                console.log("[ERROR] _getProseEditorTemplatesAndAttachment", e)
                return promResolve
            })

    }

    _getIncapacityCodes() {
        return this.api.code().findCodes("be", "CD-INCAPACITY")
            .then(incapacityCodes => this.api.code().findCodes("be", "CD-INCAPACITYREASON")
                .then(incapacityReasons => {
                    return {
                        "CD-INCAPACITY": _.map(incapacityCodes, singleCode => _.merge(singleCode, {labelHr: _.trim(_.get(singleCode, "label." + this.language, "")) ? _.trim(_.get(singleCode, "label." + this.language, "")).toLowerCase() : _.trim(_.head(_.flatMap(_.get(singleCode, "label", "")))).toLowerCase()})),
                        "CD-INCAPACITYREASON": _.map(incapacityReasons, singleCode => _.merge(singleCode, {labelHr: _.trim(_.get(singleCode, "label." + this.language, "")) ? _.upperFirst(_.trim(_.get(singleCode, "label." + this.language, "")).toLowerCase()) : _.upperFirst(_.trim(_.head(_.flatMap(_.get(singleCode, "label", "")))).toLowerCase())})),
                    }
                }))
    }

    _getEMediattestData() {

        const promResolve = Promise.resolve()

        return promResolve
            .then(() => {
                const diagnosticSvc = _.get(this, "_data.eMediattestParentFormDp.servicesMap['Diagnostics'][0][0].svc", {})
                return {
                    labelHr: _.get(diagnosticSvc, "content." + this.language + ".stringValue", ""),
                    icpc: _.get(_.find(_.get(diagnosticSvc, "codes", []), {type: "ICPC"}), "code", ""),
                    icd: _.get(_.find(_.get(diagnosticSvc, "codes", []), {type: "ICD"}), "code", ""),
                }
            })
            .then(diagnosticData => {
                let incapacityReason = null
                let outOfHomeAllowed = null
                let occuredOn = null
                let incapacityBegin = null
                let incapacityEnd = null
                const extensionData = typeof _.get(this, "_data.eMediattestSubFormDp.servicesMap['extension'][0][0].svc.content." + this.language + ".booleanValue", "") === "boolean" ? !!_.get(this, "_data.eMediattestSubFormDp.servicesMap['extension'][0][0].svc.content." + this.language + ".booleanValue", false) :
                    typeof _.get(this, "_data.eMediattestSubFormDp.servicesMap['extension'][0][0].svc.content.fr.booleanValue", "") === "boolean" ? !!_.get(this, "_data.eMediattestSubFormDp.servicesMap['extension'][0][0].svc.content.fr.booleanValue", false) :
                        typeof _.get(this, "_data.eMediattestSubFormDp.servicesMap['extension'][0][0].svc.content.nl.booleanValue", "") === "boolean" ? !!_.get(this, "_data.eMediattestSubFormDp.servicesMap['extension'][0][0].svc.content.nl.booleanValue", false) :
                            typeof _.get(this, "_data.eMediattestSubFormDp.servicesMap['extension'][0][0].svc.content.en.booleanValue", "") === "boolean" ? !!_.get(this, "_data.eMediattestSubFormDp.servicesMap['extension'][0][0].svc.content.en.booleanValue", false) :
                                false
                const incapacityData = _.compact(_.map(_.get(this, "_data.eMediattestSubFormDp.servicesMap", []), (v, k) => {
                    const valueObject = !!_.get(v, "[0][0].svc.content." + this.language, null) ? _.get(v, "[0][0].svc.content." + this.language, null) : !!_.get(v, "[0][0].svc.content.fr", "") ? _.get(v, "[0][0].svc.content.fr", "") : !!_.get(v, "[0][0].svc.content.nl", "") ? _.get(v, "[0][0].svc.content.nl", "") : !!_.get(v, "[0][0].svc.content.en", "") ? _.get(v, "[0][0].svc.content.en", "") : null
                    const isIncapacity = !!_.trim(_.get(valueObject, "stringValue", "")) && _.trim(_.get(valueObject, "stringValue", "")).startsWith("CD-INCAPACITY|")
                    const isIncapacityReason = !!_.trim(_.get(valueObject, "stringValue", "")) && _.trim(_.get(valueObject, "stringValue", "")).startsWith("CD-INCAPACITYREASON|")
                    if (k === "pour cause de") incapacityReason = !!_.trim(_.get(valueObject, "stringValue", "")) ? _.trim(_.get(valueObject, "stringValue", "")) : "CD-INCAPACITYREASON|illness|1"
                    if (k === "Sortie") outOfHomeAllowed = !!_.trim(_.get(valueObject, "stringValue", "")) ? _.trim(_.get(valueObject, "stringValue", "")) : "interdite"
                    if (k === "du") incapacityBegin = !!_.trim(_.get(valueObject, "fuzzyDateValue", "")) ? _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(0, 4) + "-" + _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(4, 6) + "-" + _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(6, 8) : moment().format("YYYY-MM-DD")
                    if (k === "au") incapacityEnd = !!_.trim(_.get(valueObject, "fuzzyDateValue", "")) ? _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(0, 4) + "-" + _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(4, 6) + "-" + _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(6, 8) : moment().add(1, 'day').format("YYYY-MM-DD")
                    if (k === "Accident suvenu le") occuredOn = !!_.trim(_.get(valueObject, "fuzzyDateValue", "")) ? _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(0, 4) + "-" + _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(4, 6) + "-" + _.trim(_.get(valueObject, "fuzzyDateValue", "")).substring(6, 8) : ""
                    return !_.size(v) ? false : {
                        name: k,
                        valueObject: valueObject,
                        valueHr: !!_.trim(_.get(valueObject, "stringValue", "")) ?
                            !!isIncapacity ? _.get(_.find(_.get(this, "_data.codes.CD-INCAPACITY", []), {id: _.trim(_.get(valueObject, "stringValue", ""))}), "labelHr", "") :
                                !!isIncapacityReason ? _.get(_.find(_.get(this, "_data.codes.CD-INCAPACITYREASON", []), {id: _.trim(_.get(valueObject, "stringValue", ""))}), "labelHr", "") :
                                    _.trim(_.get(valueObject, "stringValue", "")) :
                            !!_.trim(_.get(valueObject, "fuzzyDateValue", "")) ? this._YYYYMMDDToDDMMYYYY(_.trim(_.get(valueObject, "fuzzyDateValue", ""))) :
                                !!_.size(_.get(valueObject, "measureValue", "")) ? _.trim(_.get(valueObject, "measureValue.value", "")) + (!!_.trim(_.get(valueObject, "measureValue.unit", "")) ? _.trim(_.get(valueObject, "measureValue.unit", "")) : "%") :
                                    typeof _.get(valueObject, "booleanValue", "") === "boolean" ? !!_.get(valueObject, "booleanValue", "") ? this.localize("yes", "Yes", this.language) : this.localize("no", "No", this.language) :
                                        ""
                    }
                }))
                return {
                    diagnosticData: diagnosticData,
                    incapacityData: incapacityData,
                    khmerData: {
                        incapacityOrIncapacityExtension: !!extensionData ? "incapacityextension" : "incapacity",
                        certificateDate: !!parseInt(_.get(_.get(this, "_data.eMediattestSubFormDp.form")(), "created")) || 0 ? moment(parseInt(_.get(_.get(this, "_data.eMediattestSubFormDp.form")(), "created"))).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
                        certificateTime: !!parseInt(_.get(_.get(this, "_data.eMediattestSubFormDp.form")(), "created")) || 0 ? moment(parseInt(_.get(_.get(this, "_data.eMediattestSubFormDp.form")(), "created"))).format('HH:mm:ss') : moment().format('HH:mm:ss'),
                        incapacityReason: ["illness", "hospitalisation", "sickness", "pregnancy", "workaccident", "traveltofromworkaccident", "occupationaldisease"].indexOf(_.trim(_.get(_.trim(incapacityReason).split("|"), "[1]", "illness"))) > -1 ? _.trim(_.get(_.trim(incapacityReason).split("|"), "[1]", "illness")) : "illness",
                        outOfHomeAllowed: _.trim(outOfHomeAllowed) === "interdite" ? "false" : "true",
                        // In xml, the additional <content><date> tag must hold a value but only when workaccident ; occupationaldisease ; traveltofromworkaccident
                        // In pdf "accident survenu le" msut hold a value but only when workaccident ; traveltofromworkaccident and never for occupationaldisease
                        // In pdf and when occupationaldisease -> no accident date must be present but a "maladie profesionnelle déclarée le" must be present
                        occuredOn: (_.get(_.find(incapacityData, {name: "pour cause de"}), "valueObject.stringValue", "").indexOf("workaccident") > -1 || _.get(_.find(incapacityData, {name: "pour cause de"}), "valueObject.stringValue", "").indexOf("occupationaldisease") > -1 || _.get(_.find(incapacityData, {name: "pour cause de"}), "valueObject.stringValue", "").indexOf("traveltofromworkaccident") > -1) ? _.trim(occuredOn) : "",
                        incapacityBegin: incapacityBegin,
                        incapacityEnd: incapacityEnd,
                    }
                }
            })

    }

    _saveMedexIttToPatFile() {

        const messageObject = {
            transportGuid: "MEDEX:OUT:PDF",
            recipients: [_.trim(_.get(this, "_data.contactHcp.id", ""))],
            metas: {
                filename: _.trim(_.get(this, "_data.pdf.filename", "")),
                hcpId: _.trim(_.get(this, "_data.contactHcp.id", "")),
                contactId: _.trim(_.get(this, "_data.currentContact.id", "")),
                originalContactId: this._data.eMediattestParentFormDp.form().contactId,
                formId: _.trim(_.get(_.get(this, "_data.eMediattestParentFormDp.form")(), "id", "")),
                subFormId: _.trim(_.get(_.get(this, "_data.eMediattestSubFormDp.form")(), "id", "")),
            },
            toAddresses: [_.trim(_.get(this, "_data.contactHcp.id", ""))],
            subject: this.localize("medicalCertificate", "Medical certificate", this.language) + " Medex",
        }
        return this.api.message().newInstanceWithPatient(_.get(this, "user", {}), _.get(this, "_data.currentPatient", {}))
            .then(messageInstance => this.api.message().createMessage(_.merge(messageInstance, messageObject)))
            .then(createdMessage => this.api.document().newInstance(_.get(this, "user", {}), createdMessage, {
                documentType: 'report',
                mainUti: this.api.document().uti("application/pdf"),
                name: _.get(messageObject, "metas.filename"),
                tags: [
                    {type: "medex", code: "true"},
                    {type: "formId", code: _.trim(_.get(messageObject, "metas.formId", ""))},
                    {type: "subFormId", code: _.trim(_.get(messageObject, "metas.subFormId", ""))}
                ]
            }).then(documentInstance => ([createdMessage, documentInstance])))
            .then(([createdMessage, documentInstance]) => this.api.document().createDocument(documentInstance).then(createdDocument => ([createdMessage, createdDocument])))
            .then(([createdMessage, createdDocument]) => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", _.get(this, "user", {}), createdDocument, _.get(this, "_data.pdf.data", "")).then(encryptedFileContent => [createdMessage, createdDocument, encryptedFileContent]))
            .then(([createdMessage, createdDocument, encryptedFileContent]) => this.api.document().setAttachment(_.get(createdDocument, "id"), null, encryptedFileContent).then(() => ([createdMessage, createdDocument])))
            .then(([createdMessage, createdDocument]) => this._saveDocumentAsService({
                documentId: _.trim(_.get(createdDocument, "id", "")),
                stringValue: _.trim(_.get(messageObject, "subject", "")),
                contactId: _.trim(_.get(messageObject, "metas.contactId", "")),
                originalContactId: _.trim(_.get(messageObject, "metas.originalContactId", "")),
                messageObject: messageObject,
                cdTransactionCode: "medical-certificate",
                isMedex: true,
                forceNoRefreshPatientFile: true, // Don't refresh now, refresh once we got the KHMER generated
            }).then(() => ([createdMessage, createdDocument])))
            .catch(e => {
                console.log("[ERROR] _saveMedexIttToPatFile", e)
                return Promise.resolve()
            })

    }

    printMedexPdfItt(dataFromPatDetail) {

        if (!!_.get(this, "_isBusy", false)) return Promise.resolve()

        const patientId = !!_.trim(_.get(dataFromPatDetail, "patient.id", "")) ? _.trim(_.get(dataFromPatDetail, "patient.id", "")) : _.trim(_.get(this, "patient.id", ""))

        return this._resetComponentProperties()
            .then(() => _.map(this._data, (propValue, propKey) => typeof _.get(propValue, "value", null) !== "function" ? null : this.set("_data." + propKey, propValue.value())))
            .then(() => this.set("_isBusy", true))
            .then(() => this.set("_data.pdf.filename", _.kebabCase(_.compact([moment().format("YYYY-MM-DD"), "medex", this.localize("medicalCertificate", "Medical certificate", this.language), +new Date()]).join(" ")) + ".pdf"))
            .then(() => _.assign(this._data, _.cloneDeep(dataFromPatDetail)))
            .then(() => this._getPrettifiedHcp().then(hcp => _.assign(this._data, {currentHcp: hcp})))
            .then(() => this._getPrettifiedMh().then(hcp => _.assign(this._data, {currentMh: hcp})))
            .then(() => this._getPrettifiedContactHcp(_.trim(_.get(_.get(dataFromPatDetail, "eMediattestParentFormDp.form")(), "responsible", ""))).then(hcp => _.assign(this._data, {contactHcp: hcp})))
            .then(() => this._getPrettifiedPatient(_.get(this, "user", {}), patientId).then(patient => _.assign(this._data, {currentPatient: patient})))
            .then(() => this._getIncapacityCodes().then(codes => _.assign(this._data, {codes: codes})))
            .then(() => this._getEMediattestData().then(data => _.assign(this._data, {eMediattest: data})))
            .then(() => this._getPdfContent().then(data => _.merge(this._data.pdf, {content: data})))
            .then(() => this.api.pdfReport(_.get(this, "_data.pdf.content", ""), _.merge({completionEvent: "pdfDoneRenderingEvent"/*, printBackground:true*/})))
            .then(printedPdf => _.merge(this._data.pdf, {data: printedPdf.pdf}))
            .then(() => this._saveMedexIttToPatFile())
            .then(([createdMessage, createdDocument]) => _.merge(this._data.pdf, {
                createdMessage: createdMessage,
                createdDocument: createdDocument
            }))
            .then(() => this._data)
            .catch(e => console.log("[ERROR] printMedexPdfItt", e, dataFromPatDetail, this._data))
            .finally(() => {
                console.log("[Outgoing document, printMedexPdfItt, _data]", this._data)
                this.set("_isBusy", false)
                return this._data
            })
    }

    _getPdfFooter() {

        return `` +
            '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 1000); }); <' + '/script' + '>' + `
          </body>
      </html>`

    }

    _getPdfFooterMedex() {

        return `</div>` +
            '<' + 'script' + '>' + 'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 1000); }); <' + '/script' + '>' + `
          </body>
      </html>`

    }

    _getPdfHeader() {

        return `
          <html>
              <head>

                  <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Alegreya|Barlow|Barlow+Condensed|Cardo|Crete+Round|EB+Garamond|Exo|Exo+2|Fjalla+One|Great+Vibes|Indie+Flower|Josefin+Sans|Kurale|Libre+Baskerville|Lobster|Lora|Maven+Pro|Monoton|Montserrat|Montserrat+Alternates|Nanum+Myeongjo|Neucha|Old+Standard+TT|Open+Sans|Oswald|Pathway+Gothic+One|Poiret+One|Poppins|Quattrocento|Quattrocento+Sans|Quicksand|Raleway:400,700|Roboto|Roboto+Condensed|Source+Serif+Pro|Spectral|Teko|Tinos|Vollkorn">

                  <style>

                      @page {size: A4; width: 210mm; height: 297mm; margin: 10mm; padding: 0; }
                      body {margin: 0; padding: 0mm; font-family: 'Roboto', Arial, Helvetica, sans-serif; font-size:12px; line-height:1.2em; background:#ffffff; -webkit-font-smoothing: antialiased; font-smooth: always; }
                      .page { padding:8mm; color:#000000; position:relative; background:#ffffff; }

                      h1 { font-size: 1.8em; font-weight: bold; padding:0; margin-top:0; color:#101079; text-transform:uppercase; line-height:1.3em;}
                      h2 { font-size: 1.5em; font-weight: bold; padding:0; }
                      h3 { font-size: 1.3em; font-weight: bold; padding:0; }
                      h4 { font-size: 1.1em; font-weight: bold; padding:0; }
                      h5 { font-size: 1em; padding:0; }

                      p { padding:0; margin:10px 0 10px 0; }

                      table { width:100%; margin:0 0 10mm 0; border:1px solid #dddddd; border-collapse: collapse; font-size:12px; line-height:1.2em; }
                      table tr td { border:1px solid #dddddd; font-size:12px; padding:0 3mm; vertical-align:top; }

                  </style>

              </head>

          <body>
      `

    }

    _getPdfHeaderMedex() {
        return `
          <html>
              <head>

                  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">

                  <style>

                      @page {size: A4; width: 210mm; height: 297mm; margin: 0; padding: 0; }
                      body {margin: 0; padding: 0; font-family: /* "Open Sans", */ Arial, Helvetica, sans-serif; line-height:1.5em; }
                      .page { width: 210mm; color:#000000; font-size:12px; padding:10mm; position:relative; /* border:1px solid #f00; */ }

                      h1 { font-size:17px; margin:0; padding:0; }
                      h2 { font-size:15px; font-weight:400; font-style: italic; text-align: center; padding:0; margin:0; }
                      p { margin:0 0 10px 0; padding:0; }

                      .m0auto { margin:0 auto }

                      .m0 { margin:0px } .m1 { margin:1px } .m2 { margin:2px } .m3 { margin:3px } .m4 { margin:4px } .m5 { margin:5px } .m6 { margin:6px } .m7 { margin:7px } .m8 { margin:8px } .m9 { margin:9px } .m10 { margin:10px } .m15 { margin:15px } .m20 { margin:20px } .m25 { margin:25px } .m30 { margin:30px } .m35 { margin:35px } .m40 { margin:40px } .m45 { margin:45px } .m50 { margin:50px }
                      .mt0 { margin-top:0px } .mt1 { margin-top:1px } .mt2 { margin-top:2px } .mt3 { margin-top:3px } .mt4 { margin-top:4px } .mt5 { margin-top:5px } .mt6 { margin-top:6px } .mt7 { margin-top:7px } .mt8 { margin-top:8px } .mt9 { margin-top:9px } .mt10 { margin-top:10px } .mt15 { margin-top:15px } .mt20 { margin-top:20px } .mt25 { margin-top:25px } .mt30 { margin-top:30px } .mt35 { margin-top:35px } .mt40 { margin-top:40px } .mt45 { margin-top:45px } .mt50 { margin-top:50px }
                      .mr0 { margin-right:0px } .mr1 { margin-right:1px } .mr2 { margin-right:2px } .mr3 { margin-right:3px } .mr4 { margin-right:4px } .mr5 { margin-right:5px } .mr6 { margin-right:6px } .mr7 { margin-right:7px } .mr8 { margin-right:8px } .mr9 { margin-right:9px } .mr10 { margin-right:10px } .mr15 { margin-right:15px } .mr20 { margin-right:20px } .mr25 { margin-right:25px } .mr30 { margin-right:30px } .mr35 { margin-right:35px } .mr40 { margin-right:40px } .mr45 { margin-right:45px } .mr50 { margin-right:50px }
                      .mb0 { margin-bottom:0px } .mb1 { margin-bottom:1px } .mb2 { margin-bottom:2px } .mb3 { margin-bottom:3px } .mb4 { margin-bottom:4px } .mb5 { margin-bottom:5px } .mb6 { margin-bottom:6px } .mb7 { margin-bottom:7px } .mb8 { margin-bottom:8px } .mb9 { margin-bottom:9px } .mb10 { margin-bottom:10px } .mb15 { margin-bottom:15px } .mb20 { margin-bottom:20px } .mb25 { margin-bottom:25px } .mb30 { margin-bottom:30px } .mb35 { margin-bottom:35px } .mb40 { margin-bottom:40px } .mb45 { margin-bottom:45px } .mb50 { margin-bottom:50px }
                      .ml0 { margin-left:0px } .ml1 { margin-left:1px } .ml2 { margin-left:2px } .ml3 { margin-left:3px } .ml4 { margin-left:4px } .ml5 { margin-left:5px } .ml6 { margin-left:6px } .ml7 { margin-left:7px } .ml8 { margin-left:8px } .ml9 { margin-left:9px } .ml10 { margin-left:10px } .ml15 { margin-left:15px } .ml20 { margin-left:20px } .ml25 { margin-left:25px } .ml30 { margin-left:30px } .ml35 { margin-left:35px } .ml40 { margin-left:40px } .ml45 { margin-left:45px } .ml50 { margin-left:50px }

                      .p0 { padding:0px } .p1 { padding:1px } .p2 { padding:2px } .p3 { padding:3px } .p4 { padding:4px } .p5 { padding:5px } .p6 { padding:6px } .p7 { padding:7px } .p8 { padding:8px } .p9 { padding:9px } .p10 { padding:10px } .p15 { padding:15px } .p20 { padding:20px } .p25 { padding:25px } .p30 { padding:30px } .p35 { padding:35px } .p40 { padding:40px } .p45 { padding:45px } .p50 { padding:50px }
                      .pt0 { padding-top:0px } .pt1 { padding-top:1px } .pt2 { padding-top:2px } .pt3 { padding-top:3px } .pt4 { padding-top:4px } .pt5 { padding-top:5px } .pt6 { padding-top:6px } .pt7 { padding-top:7px } .pt8 { padding-top:8px } .pt9 { padding-top:9px } .pt10 { padding-top:10px } .pt15 { padding-top:15px } .pt20 { padding-top:20px } .pt25 { padding-top:25px } .pt30 { padding-top:30px } .pt35 { padding-top:35px } .pt40 { padding-top:40px } .pt45 { padding-top:45px } .pt50 { padding-top:50px }
                      .pr0 { padding-right:0px } .pr1 { padding-right:1px } .pr2 { padding-right:2px } .pr3 { padding-right:3px } .pr4 { padding-right:4px } .pr5 { padding-right:5px } .pr6 { padding-right:6px } .pr7 { padding-right:7px } .pr8 { padding-right:8px } .pr9 { padding-right:9px } .pr10 { padding-right:10px } .pr15 { padding-right:15px } .pr20 { padding-right:20px } .pr25 { padding-right:25px } .pr30 { padding-right:30px } .pr35 { padding-right:35px } .pr40 { padding-right:40px } .pr45 { padding-right:45px } .pr50 { padding-right:50px }
                      .pb0 { padding-bottom:0px } .pb1 { padding-bottom:1px } .pb2 { padding-bottom:2px } .pb3 { padding-bottom:3px } .pb4 { padding-bottom:4px } .pb5 { padding-bottom:5px } .pb6 { padding-bottom:6px } .pb7 { padding-bottom:7px } .pb8 { padding-bottom:8px } .pb9 { padding-bottom:9px } .pb10 { padding-bottom:10px } .pb15 { padding-bottom:15px } .pb20 { padding-bottom:20px } .pb25 { padding-bottom:25px } .pb30 { padding-bottom:30px } .pb35 { padding-bottom:35px } .pb40 { padding-bottom:40px } .pb45 { padding-bottom:45px } .pb50 { padding-bottom:50px }
                      .pl0 { padding-left:0px } .pl1 { padding-left:1px } .pl2 { padding-left:2px } .pl3 { padding-left:3px } .pl4 { padding-left:4px } .pl5 { padding-left:5px } .pl6 { padding-left:6px } .pl7 { padding-left:7px } .pl8 { padding-left:8px } .pl9 { padding-left:9px } .pl10 { padding-left:10px } .pl15 { padding-left:15px } .pl20 { padding-left:20px } .pl25 { padding-left:25px } .pl30 { padding-left:30px } .pl35 { padding-left:35px } .pl40 { padding-left:40px } .pl45 { padding-left:45px } .pl50 { padding-left:50px }

                      .clear { clear: both; } .clearl { clear: left; } .clearr { clear: right; }
                      .fr {float:right} .fl {float:left} .flnone {float:none}
                      .fl50 { float:left; width: calc(50% - 10px); } .fr50 { float:right; width: calc(50% - 10px) }
                      .fl45 { float:left; width: calc(45% - 10px); } .fr55 { float:right; width: calc(55% - 10px) }

                      .textaligncenter { text-align: center; } .textalignleft { text-align: left; } .textalignright { text-align: right; }

                      .fs8px {font-size:8px!important;} .fs9px {font-size:9px!important;} .fs10px {font-size:10px!important;} .fs11px {font-size:11px!important;} .fs12px {font-size:12px!important;} .fs13px {font-size:13px!important;} .fs14px {font-size:14px!important;} .fs15px {font-size:15px!important;} .fs16px {font-size:16px!important;} .fs17px {font-size:17px!important;} .fs18px {font-size:18px!important;} .fs19px {font-size:19px!important;} .fs20px {font-size:20px!important;} .fs21px {font-size:21px!important;} .fs22px {font-size:22px!important;}
                      .fspoint1em { font-size:.1em!important; } .fspoint2em { font-size:.2em!important; } .fspoint3em { font-size:.3em!important; } .fspoint4em { font-size:.4em!important; } .fspoint5em { font-size:.5em!important; } .fspoint6em { font-size:.6em!important; } .fspoint7em { font-size:.7em!important; } .fspoint8em { font-size:.8em!important; } .fspoint9em { font-size:.9em!important; }
                      .fs1em { font-size:1em!important; } .fs11em { font-size:1.1em!important; } .fs12em { font-size:1.2em!important; } .fs13em { font-size:1.3em!important; } .fs14em { font-size:1.4em!important; } .fs15em { font-size:1.5em!important; } .fs16em { font-size:1.6em!important; } .fs17em { font-size:1.7em!important; } .fs18em { font-size:1.8em!important; } .fs19em { font-size:1.9em!important; } .fs2em { font-size:2em!important; }
                      .fw100 {font-weight:100} .fw200 {font-weight:200} .fw300 {font-weight:300} .fw400 {font-weight:400} .fw500 {font-weight:500} .fw600 {font-weight:600} .fw700 {font-weight:700} .fw800 {font-weight:800} .fw900 {font-weight:900}
                      .fontstyleitalic {font-style:italic!important;} .fontstylenormal {font-style:normal!important;}

                      .ttuppercase { text-transform: uppercase; } .ttn { text-transform:none; }

                      .displayblock {display:block} .displayinlineblock {display:inline-block} .displaynone {display:none} .displayFlex {display: flex}

                      .w10pc { width:10%!important; } .w20pc { width:20%!important; } .w30pc { width:30%!important; } .w40pc { width:40%!important; } .w50pc { width:50%!important; } .w60pc { width:60%!important; } .w70pc { width:70%!important; } .w80pc { width:80%!important; } .w90pc { width:90%!important; } .w100pc { width:100%!important; }
                      .minw0 { min-width:0px!important; } .minw1 { min-width:1px!important; } .minw2 { min-width:2px!important; } .minw3 { min-width:3px!important; } .minw4 { min-width:4px!important; } .minw5 { min-width:5px!important; } .minw6 { min-width:6px!important; } .minw7 { min-width:7px!important; } .minw8 { min-width:8px!important; } .minw9 { min-width:9px!important; } .minw10 { min-width:10px!important; } .minw15 { min-width:15px!important; } .minw20 { min-width:20px!important; } .minw25 { min-width:25px!important; } .minw30 { min-width:30px!important; } .minw35 { min-width:35px!important; } .minw40 { min-width:40px!important; } .minw45 { min-width:45px!important; } .minw50 { min-width:50px!important; } .minw55 { min-width:55px!important; } .minw60 { min-width:60px!important; } .minw65 { min-width:65px!important; } .minw70 { min-width:70px!important; } .minw75 { min-width:75px!important; } .minw80 { min-width:80px!important; } .minw85 { min-width:85px!important; } .minw90 { min-width:90px!important; } .minw95 { min-width:95px!important; } .minw100 { min-width:100px!important; }
                      .mw0 { max-width:0px!important; } .mw1 { max-width:1px!important; } .mw2 { max-width:2px!important; } .mw3 { max-width:3px!important; } .mw4 { max-width:4px!important; } .mw5 { max-width:5px!important; } .mw6 { max-width:6px!important; } .mw7 { max-width:7px!important; } .mw8 { max-width:8px!important; } .mw9 { max-width:9px!important; } .mw10 { max-width:10px!important; } .mw15 { max-width:15px!important; } .mw20 { max-width:20px!important; } .mw25 { max-width:25px!important; } .mw30 { max-width:30px!important; } .mw35 { max-width:35px!important; } .mw40 { max-width:40px!important; } .mw45 { max-width:45px!important; } .mw50 { max-width:50px!important; } .mw55 { max-width:55px!important; } .mw60 { max-width:60px!important; } .mw65 { max-width:65px!important; } .mw70 { max-width:70px!important; } .mw75 { max-width:75px!important; } .mw80 { max-width:80px!important; } .mw85 { max-width:85px!important; } .mw90 { max-width:90px!important; } .mw95 { max-width:95px!important; } .mw100 { max-width:100px!important; }
                      .mh0 { max-height:0px!important; } .mh1 { max-height:1px!important; } .mh2 { max-height:2px!important; } .mh3 { max-height:3px!important; } .mh4 { max-height:4px!important; } .mh5 { max-height:5px!important; } .mh6 { max-height:6px!important; } .mh7 { max-height:7px!important; } .mh8 { max-height:8px!important; } .mh9 { max-height:9px!important; } .mh10 { max-height:10px!important; } .mh15 { max-height:15px!important; } .mh20 { max-height:20px!important; } .mh25 { max-height:25px!important; } .mh30 { max-height:30px!important; } .mh35 { max-height:35px!important; } .mh40 { max-height:40px!important; } .mh45 { max-height:45px!important; } .mh50 { max-height:50px!important; } .mh55 { max-height:55px!important; } .mh60 { max-height:60px!important; } .mh65 { max-height:65px!important; } .mh70 { max-height:70px!important; } .mh75 { max-height:75px!important; } .mh80 { max-height:80px!important; } .mh85 { max-height:85px!important; } .mh90 { max-height:90px!important; } .mh95 { max-height:95px!important; } .mh100 { max-height:100px!important; }

                      .b0 { border:0!important; } .bt0 {border-top:0!important;} .br0 {border-right:0!important;} .bb0 {border-bottom:0!important;} .bl0 {border-left:0!important;}
                      .borderSolid { border-style: solid; } .borderDashed { border-style: dashed; } .borderDotted { border-style: dotted; }
                      .borderW1px { border-width: 1px; } .borderW2px { border-width: 2px; } .borderW3px { border-width: 3px; } .borderW4px { border-width: 4px; } .borderW5px { border-width: 5px; }
                      .borderColorBlack { border-color: #000 } .borderColorGrey { border-color: #ddd } .borderColorDarkBlue { border-color: #101079!important }

                      .black {color:#000000!important; }
                      .darkRed { color:#a00000!important; }
                      .darkGreen { color:#41671e!important; }
                      .darkBlue { color:#101079!important; }

                      .bgColor_f5f5f5 {background-color:#f5f5f5;}
                      .bgColor_eeeeee {background-color:#eeeeee;}
                      .bgColor_dddddd {background-color:#dddddd;}
                      .bgColor_cccccc {background-color:#cccccc;}

                      /* ----------------------------------------------------------------------------- */

                      .documentType { width:calc(100% - 50mm) }
                      .documentDate { width:100mm; }

                      pre { white-space: pre-wrap; word-wrap: break-word; font-family: Arial, Helvetica, sans-serif; line-height:1.3em; }

                      .resultLines {}
                      .resultHeader {}
                      .resultHeader div, .singleLineResult div {display:inline-block;}
                      .singleLineResult {}
                      .singleLineResult.outOfRange { color:#a00000; font-weight:700; }
                      .resultsLabel { width:60mm; vertical-align: top; }
                      .resultsValue { width:75mm; vertical-align: top; }
                      .resultsNormalValue { width:50mm; text-align:center; vertical-align: top; }
                      .resultsAuthor { width:30mm; vertical-align: top; }
                      .resultsDate { width:15mm; text-align:center; vertical-align: top; }

                      .imageContainer {max-width:17%; }
                      .imageContainer img {max-width:100%; height:auto;}

                  </style>
              </head>

              <body>
                  <div class="page">
      `
    }

    _getPdfContent() {

        const includedExcluded = !!_.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "inclus/exclus"}), "valueHr", "")) ? _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "inclus/exclus"}), "valueHr", "")) : this.localize("included", "included", this.language)
        const outdoorActivities = _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "Sortie"}), "valueHr", "")) === "interdite" ? this.localize("no", "No", this.language) : this.localize("yes", "Yes", this.language)


        return Promise.resolve(
            "" +
            this._getPdfHeaderMedex() + `
              <div class="mb10">
                  <div class="imageContainer fl"><img src="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowQTY3NEI3RDA2RTQxMUVBQURGQUIyMTIzMEM4OTBGRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowQTY3NEI3RTA2RTQxMUVBQURGQUIyMTIzMEM4OTBGRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjBBNjc0QjdCMDZFNDExRUFBREZBQjIxMjMwQzg5MEZFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjBBNjc0QjdDMDZFNDExRUFBREZBQjIxMjMwQzg5MEZFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgID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"/></div>
                  <div class="fr black fw700 fs22px textalignright documentDate"><br/>` + this.localize("medicalCertificate", "Medical certificate", this.language) + `</div>
              </div>
              <div class="clear"></div>
              <div class="pt3 pb3 pl10 pr10 mt10 mb30 borderSolid borderW1px borderColorBlack">
                  <div class="fw700 fs13px mb10">1. ` + this.localize("patientData", "Patient details", this.language) + `</div>
                  ` + this.localize("ssinPatVerbose", "SSIN", this.language) + `: ` + _.trim(_.get(this, "_data.currentPatient.ssinHr", "-")) + `<br />
                  ` + this.localize("las_nam", "Lastname", this.language) + `: ` + _.trim(_.get(this, "_data.currentPatient.lastName", "-")) + `<br />
                  ` + this.localize("rn-firstName", "Firstname", this.language) + `: ` + _.trim(_.get(this, "_data.currentPatient.firstName", "-")) + `<br />
                  ` + this.localize("birthDate", "Birthdate", this.language) + `: ` + _.trim(_.get(this, "_data.currentPatient.dateOfBirthHr", "-")) + `<br />
                  ` + this.localize("codeLanguage", "Language code", this.language) + `: FR<br />
              </div>
              <div class="pt3 pb3 pl10 pr10 mt30 mb30 borderSolid borderW1px borderColorBlack">
                  <div class="fw700 fs13px mb10">2. ` + this.localize("medexHcpBlockHeader", "Praticien fills in the below", this.language) + `</div>
                  ` + this.localize("medexText1", "La personne susmentionnée est", this.language) + `:<b> ` + _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "incapacité de"}), "valueHr", "-")) + `</b>,
                  ` + this.localize("from2", "From", this.language) + ` ` + _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "du"}), "valueHr", "-")) + ` ` + this.localize("till", "till", this.language) + ` ` + _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "au"}), "valueHr", "-")) + ` <b>` + includedExcluded + `</b><br /><br />
                  <b>` + this.localize("diagnosticFreeText", "Diagnostic (free text)", this.language) + `:</b> ` + _.trim(_.get(this, "_data.eMediattest.diagnosticData.labelHr", "-")) + `<br /><br />
                  <b>` + this.localize("mainDiagnosticCoded", "Main diagnostic coded", this.language) + `</b><br />
                  <span class="displayinlineblock mr50"></span><b>Code ICPC2: </b> ` + _.trim(_.get(this, "_data.eMediattest.diagnosticData.icpc", "")) + `<br />
                  <span class="displayinlineblock mr50"></span><b>Code SNOWMED: </b> -<br />
                  <span class="displayinlineblock mr50"></span><b>Code ICD10: </b> ` + _.trim(_.get(this, "_data.eMediattest.diagnosticData.icd", "")) + `<br /><br />
                  ` + this.localize("incapacityReason", "Incapacity reason", this.language) + `:<b> ` + _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "pour cause de"}), "valueHr", "-")) + `</b><br /><br />

                  ` + this.localize("medexText2", "Accident survenu le", this.language) + `:<b> ` + ((_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "pour cause de"}), "valueObject.stringValue", "").indexOf("workaccident") > -1 || _.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "pour cause de"}), "valueObject.stringValue", "").indexOf("traveltofromworkaccident") > -1) ? _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "Accident suvenu le"}), "valueHr", "-")) : "") + `</b><br /><br />
                  ` + this.localize("medexText3", "Maladie professionnelle déclarée le", this.language) + `:<b> ` + (_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "pour cause de"}), "valueObject.stringValue", "").indexOf("occupationaldisease") > -1 ? _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "Accident suvenu le"}), "valueHr", "-")) : "") + `</b><br /><br />

                  ` + this.localize("medexText5", "Prolongation", this.language) + `:<b> ` + _.trim(_.get(_.find(_.get(this, "_data.eMediattest.incapacityData", []), {name: "extension"}), "valueHr", this.localize("no", "No", this.language))) + `</b><br /><br />
                  <b>` + this.localize("medexText4", "Déplacements", this.language) + `:</b> ` + outdoorActivities + `<br />

              </div>
              <div class="pt3 pb3 pl10 pr10 mt30 mb30 borderSolid borderW1px borderColorBlack">
                  <div class="fw700 fs13px mb10">3. ` + this.localize("hcpDetails", "Praticien details", this.language) + `</div>
                  ` + this.localize("nihiiVerbose", "NIHII number", this.language) + `: ` + _.trim(_.get(this, "_data.currentHcp.nihiiHr", "-")) + `<br />
                  ` + this.localize("ssinPatVerbose", "SSIN", this.language) + `: ` + _.trim(_.get(this, "_data.currentHcp.ssinHr", "-")) + `<br />
                  ` + this.localize("las_nam", "Lastname", this.language) + `: ` + _.trim(_.get(this, "_data.currentHcp.lastName", "-")) + `<br />
                  ` + this.localize("rn-firstName", "Firstname", this.language) + `: ` + _.trim(_.get(this, "_data.currentHcp.firstName", "-")) + `<br />
                  ` + this.localize("postalAddress", "Address", this.language) + `: ` + _.trim(_.get(this, "_data.currentHcp.address", "-")) + ` - ` + _.trim(_.get(this, "_data.currentHcp.postalCode", "")) + " " + _.trim(_.get(this, "_data.currentHcp.city", "")) + `<br /><br />
                  ` + this.localize("signatureDate", "Signature date", this.language) + `: ` + this.localize('day_' + parseInt(moment().day()), this.language) + ` ` + moment().format('DD') + ` ` + (this.localize('month_' + parseInt(moment().format('M')), this.language)).toLowerCase() + ` ` + moment().format('YYYY') + `<br />
              </div>
          ` +
            this._getPdfFooterMedex()
        )
    }

    _print(parameters = {}) {

        if (!!_.get(this, "_isBusy", false)) return

        const promResolve = Promise.resolve()
        const proseEditor = this.shadowRoot.querySelector("#prose-editor")
        const proseContent = _.trim(_.get(proseEditor, "$.container.innerHTML"))
        const fileName = _.kebabCase(_.compact([moment().format("YYYY-MM-DD"), _.trim(_.get(this, "_data.proseEditorSelectedTemplate.descr")), this.localize("out-doc", "Outgoing document", this.language), +new Date()]).join(" ")) + ".pdf"

        return promResolve
            .then(() => this.set("_isBusy", true))
            .then(() => this.api.pdfReport(this._getPdfHeader() + this.api.rewriteTableColumnsWidth(proseContent) + this._getPdfFooter(), _.merge({completionEvent: "pdfDoneRenderingEvent"/*, printBackground:true*/}, (!!_.get(parameters, "forceReturnFile", false) ? {} : {type: "rapp-mail"}))))
            .then(printedPdf => !!_.get(parameters, "forceReturnFile", false) ? ([printedPdf.pdf, fileName]) : !printedPdf.printed && this.api.triggerFileDownload(printedPdf.pdf, "application/pdf", fileName))
            .catch(e => console.log("[ERROR] _print", e))
            .finally(() => this.set("_isBusy", false))

    }

    _saveDocumentAsService(inputConfig) {

        const promResolve = Promise.resolve()

        const svc = this.api.contact().service().newInstance(_.get(this, "user", {}), {
            content: _.fromPairs([[this.language, {
                documentId: inputConfig.documentId,
                stringValue: inputConfig.stringValue
            }]]),
            label: _.trim(_.get(inputConfig, "messageObject.subject", "")),
            contactId: inputConfig.contactId,
            tags: [{type: "outgoingDocument", code: _.trim(_.get(inputConfig, "messageObject.subject", ""))}]
        })

        if (!!_.get(inputConfig, "isMedex", "")) svc.tags = [
            {type: "isMedex", code: "true"},
            {type: "originalContactId", code: _.trim(_.get(inputConfig, "messageObject.metas.originalContactId", ""))},
            {type: "formId", code: _.trim(_.get(inputConfig, "messageObject.metas.formId", ""))},
            {type: "subFormId", code: _.trim(_.get(inputConfig, "messageObject.metas.subFormId", ""))},
            {type: "outgoingDocument", code: _.trim(_.get(inputConfig, "messageObject.subject", ""))},
            {type: 'CD-TRANSACTION', code: _.trim(_.get(inputConfig, "cdTransactionCode", ""))},
        ]

        if (false === _.get(this, "_data.currentContact.services", false)) this._data.currentContact.services = []
        if (false === _.get(this, "_data.currentContact.subContacts", false)) this._data.currentContact.subContacts = []

        this._data.currentContact.services.push(svc)
        this._data.currentContact.subContacts.push({
            status: 64,
            services: [{serviceId: svc.id}],
            tags: svc.tags,
        })

        return promResolve
            .then(() => !!_.trim(_.get(this, "_data.currentContact.rev", "")) ?
                this.api.contact().modifyContactWithUser(_.get(this, "user", {}), _.get(this, "_data.currentContact", {})) :
                this.api.contact().createContactWithUser(_.get(this, "user", {}), _.get(this, "_data.currentContact", {}))
            )
            .then(c => this.api.register(c, 'contact')).then(c => (this._data.currentContact.rev = c.rev) && c)
            .then(() => !_.get(inputConfig, "forceNoRefreshPatientFile", false) ? this.dispatchEvent(new CustomEvent('refresh-patient', {
                composed: true,
                bubbles: true,
                detail: {}
            })) : null)

    }

    _saveAndAddToPatFile() {

        if (!!_.get(this, "_isBusy", false)) return

        return this._print({forceReturnFile: true})
            .then(([printedPdf, fileName]) => {

                this.set("_isBusy", true)

                const messageObject = {
                    transportGuid: "OUTGOING-DOCUMENT:PATIENT:ARCHIVE",
                    recipients: [_.trim(_.get(this, "_data.contactHcp.id", ""))],
                    metas: {
                        filename: fileName,
                        hcpId: _.trim(_.get(this, "_data.contactHcp.id", "")),
                        contactId: _.trim(_.get(this, "_data.currentContact.id", "")),
                        templateGuid: _.trim(_.get(this, "_data.proseEditorSelectedTemplate.guid", "")),
                        templateVersion: _.trim(_.get(this, "_data.proseEditorSelectedTemplate.group.guid", "")),
                    },
                    toAddresses: [_.trim(_.get(this, "_data.contactHcp.id", ""))],
                    subject: !!_.trim(_.get(this, "_data.proseEditorSelectedTemplate.descr")) ? _.trim(_.get(this, "_data.proseEditorSelectedTemplate.descr")) : this.localize("out-doc", "Outgoing document", this.language)
                }

                return this.api.message().newInstanceWithPatient(_.get(this, "user", {}), _.get(this, "patient", {}))
                    .then(messageInstance => this.api.message().createMessage(_.merge(messageInstance, messageObject)))
                    .then(createdMessage => this.api.document().newInstance(_.get(this, "user", {}), createdMessage, {
                        documentType: 'report',
                        mainUti: this.api.document().uti("application/pdf"),
                        name: _.get(messageObject, "metas.filename"),
                        tags: [
                            {type: "templateGuid", code: _.trim(_.get(messageObject, "metas.templateGuid", ""))},
                            {type: "templateVersion", code: _.trim(_.get(messageObject, "metas.templateVersion", ""))}
                        ]
                    }))
                    .then(documentInstance => this.api.document().createDocument(documentInstance))
                    .then(createdDocument => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", _.get(this, "user", {}), createdDocument, printedPdf).then(encryptedFileContent => [createdDocument, encryptedFileContent]))
                    .then(([createdDocument, encryptedFileContent]) => this.api.document().setAttachment(_.get(createdDocument, "id"), null, encryptedFileContent).then(() => createdDocument))
                    .then(createdDocument => this._saveDocumentAsService({
                        documentId: _.trim(_.get(createdDocument, "id", "")),
                        stringValue: _.trim(_.get(messageObject, "subject", "")),
                        contactId: _.trim(_.get(messageObject, "metas.contactId", "")),
                        messageObject: messageObject,
                    }))
                    .then(() => this._flushProseEditorContent())
                    .then(() => this.set("_data.proseEditorSelectedTemplate", {}))
                    .then(() => this.shadowRoot.querySelector('#outgoingDocumentDialog').close())

            })
            .catch(e => console.log("[ERROR] _saveAndAddToPatFile", e))
            .finally(() => this.set("_isBusy", false))

    }

    _doSaveTemplate(e) {

        const promResolve = Promise.resolve()
        const fieldsToValidate = ["templateName", "templateDescription"]
        const fieldsValidation = _.compact(_.map(fieldsToValidate, k => {
            const fieldToValidate = this.shadowRoot.querySelector('#' + k)
            return (fieldToValidate && typeof _.get(fieldToValidate, "validate", false) === "function" && fieldToValidate.validate())
        }))

        return (_.size(fieldsToValidate) !== _.size(fieldsValidation)) ? promResolve : promResolve
            .then(() => this.set("_isBusy", true))
            .then(() => {
                const targetButton = !!_.size(_.get(e, "target", "")) && _.get(e, "target.nodeName", "") === "PAPER-BUTTON" ? _.get(e, "target", {}) : _.find(_.get(e, "path", []), p => _.get(p, "nodeName", "") === "PAPER-BUTTON")
                const saveAsNewVersion = _.get(targetButton, "dataset.version", {}) === "new"
                return (!!saveAsNewVersion || !_.trim(_.get(this, "_data.proseEditorSelectedTemplate.id", ""))) ?
                    this.api.doctemplate().createDocumentTemplate({
                        created: +new Date(),
                        documentType: "template",
                        mainUti: "prose.template.json." + this.language,
                        name: _.trim(this.shadowRoot.querySelector('#templateName').value),
                        descr: _.trim(this.shadowRoot.querySelector('#templateDescription').value),
                    }) :
                    this.api.doctemplate().updateDocumentTemplate(_.trim(_.get(this, "_data.proseEditorSelectedTemplate.id", "")), {
                        created: parseInt(_.get(this, "_data.proseEditorSelectedTemplate.created", +new Date())),
                        guid: _.trim(_.get(this, "_data.proseEditorSelectedTemplate.guid", "")),
                        group: {
                            name: "version",
                            guid: _.trim(_.get(this, "_data.proseEditorSelectedTemplate.group.guid", ""))
                        },
                        documentType: "template",
                        mainUti: "prose.template.json." + this.language,
                        name: _.trim(this.shadowRoot.querySelector('#templateName').value),
                        descr: _.trim(this.shadowRoot.querySelector('#templateDescription').value),
                        rev: _.trim(_.get(this, "_data.proseEditorSelectedTemplate.rev", "")),
                    })
            })
            .then(docTemplateObject => {
                const prose = this.root.querySelector("#prose-editor")
                const proseJsonContent = prose.editorView.state.doc.toJSON()
                const variablesPath = this.api.findJsonObjectPathByPropNameAndPropValue(proseJsonContent, "type", "variable")
                const proseJsonContentWithoutVars = this._dropVarsFromProseJsonContent(proseJsonContent, variablesPath)
                const proseTextContentWithoutVars = JSON.stringify(proseJsonContentWithoutVars).replace(/"rendered":"([^"*]*)"/g, '"rendered":""')
                console.log("savedTemplate", proseTextContentWithoutVars)
                return this.api.doctemplate().setAttachment(_.trim(_.get(docTemplateObject, "id", "")), proseTextContentWithoutVars)
            })
            .then(docTemplateObject => this._refreshDataProseEditorTemplates().then(() => docTemplateObject))
            .then(docTemplateObject => this.set("_data.proseEditorSelectedTemplate", docTemplateObject))
            .then(() => this._confirmTemplateSaved())
            .catch(e => {
                console.log("[ERROR] _doSaveTemplate", e)
                this._confirmTemplateNotSaved()
            })
            .finally(() => (this.set("_isBusy", false) || true) && this.$['saveTemplateDialog'].close())

    }

    _getProseEditorTemplates(forceNoAutoInject = false) {

        const promResolve = Promise.resolve()
        const coreTemplateGuids = [
            "new-doc",
            "lettre-liaison",
            "lettre-liaison-avec-es",
            "msoap",
            "amu",
            "coups-blessures",
            "presence-consultation",
            // "violences-physiques",
            "grossesse",
            "bonne-sante",
            "aptitude-sportive",
            "frequentation-creche",
            "rapport-medecin-conseil",
            "aide-familiale",
            "transport-ambulance",
            "bonne-sante-one",
            "forfait-incontinence",
            "incapacite-vote",
            "jour-circonstance",
            "frottis-depistage",
            "itt",
            "necessite-toilette",
            "attestation-amu",
            "psy",
            "placement-malades-mentaux",
            "rapport-circonstancie-malades-mentaux",
            "itt-independant",
            "mm-inscription",
            "mm-desinscription",
            "mm-transfert",
            "mm-soins-abonnes-en-institution",
        ]

        return promResolve
            .then(() => this.api.doctemplate().findDocumentTemplatesByDocumentType('template'))
            .then(foundTemplates => _
                .chain(foundTemplates)
                .filter(it => _.trim(_.get(it, "mainUti", "")) === "prose.template.json." + this.language && !parseInt(_.get(it, "deleted", 0)))
                .map(it => _.merge({}, it, {createdHr: moment(it.created).format('DD/MM/YYYY - HH:mm:ss')}))
                .map(it => _.merge({}, it, {searchTerms: _.trim(_.trim(_.get(it, "id") + " " + _.get(it, "name") + " " + _.get(it, "descr")).normalize('NFD').replace(/[\u0300-\u036f ]/g, "").toLowerCase())}))
                .orderBy(["name", "crdate"], ["asc", "asc"])
                .value()
            )

            // Require static files core templates and compare versions (delete templates from db if obsolete)
            .then(foundTemplatesFromDb => Promise.all(_.map(coreTemplateGuids, coreTemplateGuid => {
                    try {
                        return require("./rsrc/outgoing-document-template-" + coreTemplateGuid + "-" + this.language + ".json")
                    } catch (e) {
                        return promResolve
                    }
                }))
                    .then(staticFilesCoreTemplates => _.compact(_.map(staticFilesCoreTemplates, staticFileTemplate => {
                        const matchingTemplateFromDatabase = _.find(foundTemplatesFromDb, it => _.trim(_.get(it, "guid")) === _.trim(_.get(staticFileTemplate, "guid")))
                        return (!!_.trim(_.get(matchingTemplateFromDatabase, "id", "")) && (parseInt(_.get(staticFileTemplate, "version", 0)) > parseInt(_.get(matchingTemplateFromDatabase, "group.guid", 0)))) ? matchingTemplateFromDatabase : null
                    })))
                    .then(templatesToDeleteFromDatabase => !_.size(templatesToDeleteFromDatabase) ?
                        foundTemplatesFromDb :
                        Promise.all(_.map(templatesToDeleteFromDatabase, it => this.api.doctemplate().deleteDocumentTemplate(_.trim(_.get(it, "id", ""))).catch(e => {
                        })))
                            .then(() => {
                                const deletedGuids = _.compact(_.map(templatesToDeleteFromDatabase, it => _.trim(_.get(it, "guid"))))
                                return _.filter(foundTemplatesFromDb, it => deletedGuids.indexOf(_.trim(_.get(it, "guid"))) === -1)
                            })
                    )
            )
            .then(foundTemplates => {

                // Have "New document" as last item of list
                const sortedFoundTemplates = _.concat(
                    _.filter(foundTemplates, it => _.trim(_.get(it, "guid", "")) !== "new-doc"),
                    _.merge(_.find(foundTemplates, it => _.trim(_.get(it, "guid", "")) === "new-doc"), {isLast: true})
                )

                const foundTemplateGuids = _.uniq(_.compact(_.map(sortedFoundTemplates, it => _.trim(_.get(it, "guid", "")))))
                const missingTemplateGuids = _.uniq(_.compact(_.difference(coreTemplateGuids, foundTemplateGuids)))

                // Auto-inject part, when core templates are not found
                return (!_.size(missingTemplateGuids) || !!forceNoAutoInject) ? sortedFoundTemplates : promResolve
                    .then(() => Promise.all(_.map(missingTemplateGuids, missingTemplateGuid => {
                        try {
                            return require("./rsrc/outgoing-document-template-" + missingTemplateGuid + "-" + this.language + ".json")
                        } catch (e) {
                            return promResolve
                        }
                    })))
                    .then(loadedMissingTemplates => Promise.all(_.map(_.filter(loadedMissingTemplates, it => !!_.trim(_.get(it, "guid", ""))), templateToInject => this.api.doctemplate().createDocumentTemplate({
                            created: +new Date(),
                            documentType: _.trim(_.get(templateToInject, "documentType", "template")),
                            guid: _.trim(_.get(templateToInject, "guid", "")),
                            group: {name: "version", guid: _.trim(_.get(templateToInject, "version", ""))},
                            mainUti: _.trim(_.get(templateToInject, "mainUti", "prose.template.json." + this.language)),
                            name: _.trim(_.get(templateToInject, "name", this.api.crypto().randomUuid())),
                            descr: _.trim(_.get(templateToInject, "descr", "-")),
                        })
                            .then(docTemplateObject => this.api.doctemplate().setAttachment(_.trim(_.get(docTemplateObject, "id", "")), JSON.stringify(_.get(templateToInject, "content"))))
                    )))
                    .then(() => this._getProseEditorTemplates(true)) // "True" param avoids infinite loop in case template couldn't be "required"

            })
            .catch(e => {
                console.log("[ERROR] _getProseEditorTemplates", e)
                return promResolve
            })

    }

    _getProseEditorVariables() {

        const staticVariables = [{
            type: 'blocks',
            additionalCssClasses: 'largeDivider',
            name: this.localize('informationBlocks', 'Information blocks', this.language),
            subVars: [{
                name: this.localize('idHcp', 'Physician identification', this.language),
                nodes: [
                    {
                        type: 'paragraph',
                        content: [{
                            type: 'text',
                            marks: [{type: 'strong'}, {type: 'underlined'}],
                            text: _.trim(this.localize('idHcp', 'Physician identification', this.language)).toUpperCase()
                        }]
                    },
                    {
                        type: 'table', content: [
                            {
                                type: 'table_row', content: [
                                    {
                                        type: 'table_cell',
                                        attrs: {
                                            "colspan": 1,
                                            "rowspan": 1,
                                            "colwidth": null,
                                            "borderColor": "#999999",
                                            "background": "#fafafa"
                                        },
                                        content: [
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("doctorAbreviation", "Dr.", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'hcp.lastName'}}, {
                                                        type: 'text',
                                                        text: ' '
                                                    }, {type: 'variable', attrs: {expr: 'hcp.firstName'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("inami", "Nihii", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'hcp.nihiiHr'}}, {
                                                        type: 'text',
                                                        text: ' '
                                                    },
                                                ]
                                            },
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("postalAddress", "Address", this.language) + ": "
                                                    },
                                                    {type: 'variable', attrs: {expr: 'hcp.address'}}, {
                                                        type: 'text',
                                                        text: ' - '
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'hcp.postalCode'}
                                                    }, {type: 'text', text: ' '}, {
                                                        type: 'variable',
                                                        attrs: {expr: 'hcp.city'}
                                                    }, {type: 'text', text: ' '},
                                                ]
                                            },
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: "Email: "
                                                    }, {type: 'variable', attrs: {expr: 'hcp.email'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("phone", "Phone", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'hcp.phone'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("mobile", "Mobile", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'hcp.mobile'}}, {
                                                        type: 'text',
                                                        text: ' '
                                                    },
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {type: 'paragraph', content: [{type: 'text', text: " "}]},
                ]
            }, {
                name: this.localize('footerHcp', 'Physician signature', this.language),
                nodes: [
                    {type: 'paragraph', content: [{type: 'text', text: " "}]},
                    {
                        type: 'paragraph',
                        content: [{
                            type: 'text',
                            marks: [{type: 'strong'}],
                            text: _.trim(this.localize('hcpRegards', 'Fraternally yours', this.language)) + ", "
                        }]
                    },
                    {type: 'paragraph', content: [{type: 'text', text: " "}]},
                    {
                        type: 'paragraph', content: [
                            {
                                type: 'text',
                                text: this.localize("doctorAbreviation", "Dr.", this.language) + " "
                            }, {type: 'variable', attrs: {expr: 'hcp.lastName'}}, {
                                type: 'text',
                                text: ' '
                            }, {type: 'variable', attrs: {expr: 'hcp.firstName'}}, {type: 'text', text: ' - '},
                            {
                                type: 'text',
                                text: this.localize("inami", "Nihii", this.language) + ": "
                            }, {type: 'variable', attrs: {expr: 'hcp.nihiiHr'}}, {type: 'text', text: ' '}
                        ]
                    },

                    {
                        type: 'paragraph',
                        content: [{
                            type: 'text',
                            text: this.localize("postalAddress", "Address", this.language) + ": "
                        }, {type: 'variable', attrs: {expr: 'hcp.address'}}, {
                            type: 'text',
                            text: ' - '
                        }, {type: 'variable', attrs: {expr: 'hcp.postalCode'}}, {
                            type: 'text',
                            text: ' '
                        }, {type: 'variable', attrs: {expr: 'hcp.city'}}, {type: 'text', text: ' '},]
                    },
                    {
                        type: 'paragraph', content: [
                            {type: 'text', text: "Email: "}, {
                                type: 'variable',
                                attrs: {expr: 'hcp.email'}
                            }, {type: 'text', text: ' - '},
                            {
                                type: 'text',
                                text: this.localize("phone", "Phone", this.language) + ": "
                            }, {type: 'variable', attrs: {expr: 'hcp.phone'}}, {
                                type: 'text',
                                text: ' - '
                            }, {
                                type: 'text',
                                text: this.localize("mobile", "Mobile", this.language) + ": "
                            }, {type: 'variable', attrs: {expr: 'hcp.mobile'}}, {type: 'text', text: ' '},
                        ]
                    },
                ]
            }, {
                name: this.localize('idPatientShort', 'Patient id. (short)', this.language),
                nodes: [
                    {
                        type: 'paragraph',
                        content: [{
                            type: 'text',
                            marks: [{type: 'strong'}, {type: 'underlined'}],
                            text: _.trim(this.localize('idPatientHr', 'Patient identification', this.language)).toUpperCase()
                        }]
                    },
                    {
                        type: 'table', content: [
                            {
                                type: 'table_row', content: [
                                    {
                                        type: 'table_cell',
                                        attrs: {
                                            "colspan": 1,
                                            "rowspan": 1,
                                            "colwidth": null,
                                            "borderColor": "#999999",
                                            "background": "#fafafa"
                                        },
                                        content: [
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("lastAndAndFirstNames", "Last & first names", this.language) + ": "
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.lastName'}
                                                    }, {type: 'text', text: ' '}, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.firstName'}
                                                    },
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("postalAddress", "Address", this.language) + ": "
                                                    },
                                                    {type: 'variable', attrs: {expr: 'patient.address'}}, {
                                                        type: 'text',
                                                        text: ' - '
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.postalCode'}
                                                    }, {type: 'text', text: ' '}, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.city'}
                                                    }, {type: 'text', text: ' '},
                                                ]
                                            },
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("sexLitteral", "Sex", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'patient.genderHr'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("birthDate", "Birthdate", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'patient.dateOfBirthHr'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("ssinPatVerbose", "NISS", this.language) + ": "
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.ssinHr'}
                                                    }, {type: 'text', text: ' '},
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {type: 'paragraph', content: [{type: 'text', text: " "}]},
                ]
            }, {
                name: this.localize('idPatient', 'Patient identification', this.language),
                nodes: [
                    {
                        type: 'paragraph',
                        content: [{
                            type: 'text',
                            marks: [{type: 'strong'}, {type: 'underlined'}],
                            text: _.trim(this.localize('idPatientHr', 'Patient identification', this.language)).toUpperCase()
                        }]
                    },
                    {
                        type: 'table', content: [
                            {
                                type: 'table_row', content: [
                                    {
                                        type: 'table_cell',
                                        attrs: {
                                            "colspan": 1,
                                            "rowspan": 1,
                                            "colwidth": null,
                                            "borderColor": "#999999",
                                            "background": "#fafafa"
                                        },
                                        content: [
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("lastAndAndFirstNames", "Last & first names", this.language) + ": "
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.lastName'}
                                                    }, {type: 'text', text: ' '}, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.firstName'}
                                                    },
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("postalAddress", "Address", this.language) + ": "
                                                    },
                                                    {type: 'variable', attrs: {expr: 'patient.address'}}, {
                                                        type: 'text',
                                                        text: ' - '
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.postalCode'}
                                                    }, {type: 'text', text: ' '}, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.city'}
                                                    }, {type: 'text', text: ' '},
                                                ]
                                            },
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("sexLitteral", "Sex", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'patient.genderHr'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("birthDate", "Birthdate", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'patient.dateOfBirthHr'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("ssinPatVerbose", "NISS", this.language) + ": "
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.ssinHr'}
                                                    }, {type: 'text', text: ' '},
                                                ]
                                            },
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: "Email: "
                                                    }, {type: 'variable', attrs: {expr: 'patient.email'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("phone", "Phone", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'patient.phone'}},
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("job", "Job", this.language) + ": "
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.profession'}
                                                    }, {type: 'text', text: ' '},
                                                ]
                                            },
                                            {
                                                type: 'paragraph', content: [
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("adm_in", "Insurance", this.language) + ": "
                                                    }, {type: 'variable', attrs: {expr: 'patient.insuranceData.name'}},
                                                    {type: 'text', text: ' (#'}, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.insuranceData.code'}
                                                    }, {type: 'text', text: ') - '},
                                                    {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: this.localize("AFF", "Membership number", this.language) + ": "
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.insuranceData.identificationNumber'}
                                                    },
                                                    {type: 'text', text: ' - '}, {
                                                        type: 'text',
                                                        marks: [{type: 'strong'}],
                                                        text: "CT1 - CT2: "
                                                    }, {
                                                        type: 'variable',
                                                        attrs: {expr: 'patient.insuranceData.tc1tc2'}
                                                    }, {type: 'text', text: ' '},
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {type: 'paragraph', content: [{type: 'text', text: " "}]},
                ]
            }]
        }]

        // Add MH data
        if (!!_.trim(_.get(this, "_data.currentMh.id"))) {
            staticVariables.push({
                type: 'mh',
                name: this.localize('medicalHouseInformations', 'Medical house informations', this.language),
                subVars: [
                    {
                        name: this.localize('name', 'Name', this.language),
                        nodes: [{type: 'variable', attrs: {expr: 'mh.name'}}, {type: 'text', text: ' '}]
                    },
                    {
                        name: this.localize('inami', 'Nihii', this.language),
                        nodes: [{type: 'variable', attrs: {expr: 'mh.nihiiHr'}}, {type: 'text', text: ' '}]
                    },
                    {
                        name: this.localize('postalAddress', 'Address', this.language),
                        nodes: [{type: 'variable', attrs: {expr: 'mh.address'}}, {type: 'text', text: ' '}]
                    },
                    {
                        name: this.localize('postalCode', 'Zip', this.language),
                        nodes: [{type: 'variable', attrs: {expr: 'mh.postalCode'}}, {type: 'text', text: ' '}]
                    },
                    {
                        name: this.localize('city', 'City', this.language),
                        nodes: [{type: 'variable', attrs: {expr: 'mh.city'}}, {type: 'text', text: ' '}]
                    },
                    {name: "E-mail", nodes: [{type: 'variable', attrs: {expr: 'mh.email'}}, {type: 'text', text: ' '}]},
                    {
                        name: this.localize('phone', 'Phone', this.language),
                        nodes: [{type: 'variable', attrs: {expr: 'mh.phone'}}, {type: 'text', text: ' '}]
                    },
                ]
            })
        }

        staticVariables.push({
            type: 'hcp',
            name: this.localize('physicianInformations', 'Physician informations', this.language),
            subVars: [
                {
                    name: this.localize('las_nam', 'Last name', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'hcp.lastName'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('fir_nam', 'First name', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'hcp.firstName'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('inami', 'Nihii', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'hcp.nihiiHr'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('postalAddress', 'Address', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'hcp.address'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('postalCode', 'Zip', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'hcp.postalCode'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('city', 'City', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'hcp.city'}}, {type: 'text', text: ' '}]
                },
                {name: "E-mail", nodes: [{type: 'variable', attrs: {expr: 'hcp.email'}}, {type: 'text', text: ' '}]},
                {
                    name: this.localize('phone', 'Phone', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'hcp.phone'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('mobile', 'Mobile', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'hcp.mobile'}}, {type: 'text', text: ' '}]
                },
            ]
        }, {
            type: 'patient',
            additionalCssClasses: 'largeDivider',
            name: this.localize('patientInformations', 'Patient informations', this.language),
            subVars: [
                {
                    name: this.localize('docTitle', 'Title', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.civilityHr'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('las_nam', 'Last name', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.lastName'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('fir_nam', 'First name', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.firstName'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("postalAddress", "Address", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.address'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("postalCode", "Zip", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.postalCode'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("city", "City", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.city'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("sexLitteral", "Sex", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.genderHr'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("birthDate", "Birthdate", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.dateOfBirthHr'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("age", "Age", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.age'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("ssinPatVerbose", "NISS", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.ssinHr'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("nationality", "Nationality", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.nationality'}}, {type: 'text', text: ' '}]
                },
                {
                    name: "E-mail",
                    nodes: [{type: 'variable', attrs: {expr: 'patient.email'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("phone", "Phone", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.phone'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("job", "Job", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.profession'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("adm_in", "Insurance", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.insuranceData.name'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("insuranceCode", "Insurance code", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.insuranceData.code'}}, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("insuranceAddress", "Insurance address", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.insuranceData.address'}}, {
                        type: 'text',
                        text: ' '
                    }]
                },
                {
                    name: this.localize("insuranceZip", "Insurance zip", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.insuranceData.postalCode'}}, {
                        type: 'text',
                        text: ' '
                    }]
                },
                {
                    name: this.localize("insuranceCity", "Insurance city", this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'patient.insuranceData.city'}}, {type: 'text', text: ' '}]
                },
                {
                    name: "CT1 - CT2",
                    nodes: [{type: 'variable', attrs: {expr: 'patient.insuranceData.tc1tc2'}}, {
                        type: 'text',
                        text: ' '
                    }]
                },
                {
                    name: this.localize("AFF", "Membership number", this.language),
                    nodes: [{
                        type: 'variable',
                        attrs: {expr: 'patient.insuranceData.identificationNumber'}
                    }, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize("husbandWife", "Partner", this.language), nodes: [
                        {type: 'variable', attrs: {expr: 'patient.partnerHr.lastName'}}, {type: 'text', text: ' '},
                        {type: 'variable', attrs: {expr: 'patient.partnerHr.firstName'}}, {type: 'text', text: ' '},
                        {type: 'variable', attrs: {expr: 'patient.partnerHr.ssinHr'}}, {type: 'text', text: ' '}
                    ]
                },
            ]
        })

        const healthElementVariables = {
            type: 'hes',
            // additionalCssClasses:'largeDivider',
            name: this.localize('healthcareelements', 'Health elements', this.language) + " (" + this.localize('detailed', 'detailed', this.language) + ")",
            subVars: _.compact(_.map(_.get(this, "_data.allHealthElements", []), (hes, heType) => {

                const heTypeLabel = heType === "activeHealthElements" ? this.localize("act_hea_pro", "Active Health Problems", this.language) :
                    heType === "inactiveHealthElements" ? this.localize("med_ant", "Medical antecedents", this.language) :
                        heType === "surgicalHealthElements" ? this.localize("surg", "Surgical", this.language) :
                            heType === "familyrisks" ? this.localize("fam_ris", "Family risks", this.language) :
                                heType === "risks" ? this.localize("ris", "Risks", this.language) :
                                    heType === "allergies" ? this.localize("aller", "Allergies", this.language) :
                                        heType === "medications" ? this.localize("med", "Medication", this.language) :
                                            heType === "archivedHealthElements" ? this.localize("arc", "Archives", this.language) : ""

                return (!_.size(hes) /* || heType==="archivedHealthElements" */) ? null : {
                    name: heTypeLabel,
                    sorting: heType === "activeHealthElements" ? 1 :
                        heType === "surgicalHealthElements" ? 3 :
                            heType === "familyrisks" ? 4 :
                                heType === "risks" ? 5 :
                                    heType === "allergies" ? 6 :
                                        heType === "medications" ? 7 :
                                            heType === "archivedHealthElements" ? 8 : 999,
                    nodes: [
                        {
                            type: 'template', attrs: {
                                expr: `subContextsHes("${heType}")`,
                                template: {
                                    'default': heType !== "medications" ?
                                        [
                                            {
                                                type: 'paragraph',
                                                marks: [{type: 'underlined'}],
                                                content: [{
                                                    type: 'text',
                                                    marks: [{type: 'strong'}],
                                                    text: _.trim(heTypeLabel).toUpperCase() + ": "
                                                }, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.heCodeHr`}
                                                }, {type: 'text', text: " - "}, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.descr`}
                                                }, {type: 'text', text: " "}]
                                            },
                                            {
                                                type: 'table', content: [
                                                    {
                                                        type: 'table_row', content: [
                                                            {
                                                                type: 'table_cell',
                                                                attrs: {
                                                                    "colspan": 1,
                                                                    "rowspan": 1,
                                                                    "colwidth": null,
                                                                    "borderColor": "#999999",
                                                                    "background": "#fafafa"
                                                                },
                                                                content: _.compact([
                                                                    {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("healthElement", "Health element", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.heHr`}
                                                                        }, {type: 'text', text: " "}]
                                                                    },
                                                                    ((heType !== "allergies" && heType !== "archivedHealthElements") ? false : {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("cdItemAllergy", "Allergy", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.allergyHr`}
                                                                        }, {type: 'text', text: " - "}, {
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("drugs", "Drug", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.cnkHr`}
                                                                        }, {type: 'text', text: " "}]
                                                                    }),
                                                                    {
                                                                        type: 'paragraph', content: [
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("status", "Status", this.language) + ": "
                                                                            }, {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.statusHr`}
                                                                            }, {type: 'text', text: " "},
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("cert", "Certainity", this.language) + ": "
                                                                            }, {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.certaintyHr`}
                                                                            }, {type: 'text', text: " "},
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("sev", "Severity", this.language) + ": "
                                                                            }, {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.severityHr`}
                                                                            }, {type: 'text', text: " "},
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("temp", "Temporality", this.language) + ": "
                                                                            }, {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.evolutionHr`}
                                                                            }, {type: 'text', text: " "},
                                                                        ]
                                                                    },
                                                                    ((heType !== "familyrisks" && heType !== "archivedHealthElements") ? false : {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("fam-ris", "Family risk", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.familyLinkHr`}
                                                                        }, {type: 'text', text: " "}]
                                                                    }),
                                                                    {
                                                                        type: 'paragraph', content: [
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("st_da", "Start date", this.language) + ": "
                                                                            }, {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.openingDateHr`}
                                                                            }, {type: 'text', text: " "},
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("en_da", "End date", this.language) + ": "
                                                                            }, {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.closingDateHr`}
                                                                            }, {type: 'text', text: " "},
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("remanence", "Rémanence", this.language) + ": "
                                                                            }, {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.temporalityHr`}
                                                                            }, {type: 'text', text: " "}
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: "ICPC" + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.icpcsHr`}
                                                                        }, {type: 'text', text: " "}]
                                                                    },
                                                                    {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: "ICD" + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.icdsHr`}
                                                                        }, {type: 'text', text: " "}]
                                                                    },
                                                                    {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("last_update", "Last update", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.lastUpdateDateHr`}
                                                                        }, {type: 'text', text: " "}]
                                                                    },
                                                                ])
                                                            },
                                                        ]
                                                    },
                                                ]
                                            },
                                        ] : [
                                            {
                                                type: 'paragraph',
                                                marks: [{type: 'underlined'}],
                                                content: [{
                                                    type: 'text',
                                                    marks: [{type: 'strong'}],
                                                    text: _.trim(heTypeLabel).toUpperCase() + ": "
                                                }, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.medication.cnkCode`}
                                                }, {type: 'text', text: " - "}, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.medication.cnkHrLabel`}
                                                }, {type: 'text', text: " "}]
                                            },
                                            {
                                                type: 'table', content: [
                                                    {
                                                        type: 'table_row', content: [
                                                            {
                                                                type: 'table_cell',
                                                                attrs: {
                                                                    "colspan": 1,
                                                                    "rowspan": 1,
                                                                    "colwidth": null,
                                                                    "borderColor": "#999999",
                                                                    "background": "#fafafa"
                                                                },
                                                                content: [
                                                                    {
                                                                        type: 'paragraph', content: [
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("begin", "Begin", this.language) + ": "
                                                                            },
                                                                            {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.medication.begin`}
                                                                            },
                                                                            {type: 'text', text: " - "},
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("end", "End", this.language) + ": "
                                                                            },
                                                                            {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.medication.end`}
                                                                            },
                                                                            {type: 'text', text: " - "},
                                                                            {
                                                                                type: 'text',
                                                                                marks: [{type: 'strong'}],
                                                                                text: this.localize("substitution", "Substitution", this.language) + ": "
                                                                            },
                                                                            {
                                                                                type: 'variable',
                                                                                attrs: {expr: `dataProvider.form().he.medication.substitutionAllowed`}
                                                                            },
                                                                            {type: 'text', text: " "}
                                                                        ]
                                                                    },
                                                                    {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("cdItemAllergy", "Allergy", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.allergyHr`}
                                                                        }, {type: 'text', text: " "}, {
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("com", "Comment", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.medication.comment`}
                                                                        }, {type: 'text', text: " "}]
                                                                    },
                                                                    {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("pos", "Posology", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.medication.regimenHr`}
                                                                        }, {type: 'text', text: " "}]
                                                                    },
                                                                    {
                                                                        type: 'paragraph',
                                                                        content: [{
                                                                            type: 'text',
                                                                            marks: [{type: 'strong'}],
                                                                            text: this.localize("last_update", "Last update", this.language) + ": "
                                                                        }, {
                                                                            type: 'variable',
                                                                            attrs: {expr: `dataProvider.form().he.lastUpdateDateHr`}
                                                                        }, {type: 'text', text: " "}]
                                                                    },
                                                                ]
                                                            },
                                                        ]
                                                    },
                                                ]
                                            },
                                        ]
                                },
                            }
                        },
                        {type: 'paragraph', content: [{type: 'text', text: " "}]},
                    ]
                }

            }))
        }

        _.assign(healthElementVariables, {subVars: _.orderBy(_.get(healthElementVariables, "subVars", []), ['sorting'], ['asc'])})

        const healthElementVariablesLight = {
            type: 'hesLight',
            additionalCssClasses: 'largeDivider',
            name: this.localize('healthcareelements', 'Health elements', this.language) + " (" + this.localize('summary', 'summary', this.language) + ")",
            subVars: _.compact(_.map(_.get(this, "_data.allHealthElements", []), (hes, heType) => {

                const heTypeLabel = heType === "activeHealthElements" ? this.localize("act_hea_pro", "Active Health Problems", this.language) :
                    heType === "inactiveHealthElements" ? this.localize("med_ant", "Medical antecedents", this.language) :
                        heType === "surgicalHealthElements" ? this.localize("surg", "Surgical", this.language) :
                            heType === "familyrisks" ? this.localize("fam_ris", "Family risks", this.language) :
                                heType === "risks" ? this.localize("ris", "Risks", this.language) :
                                    heType === "allergies" ? this.localize("aller", "Allergies", this.language) :
                                        heType === "medications" ? this.localize("med", "Medication", this.language) :
                                            heType === "archivedHealthElements" ? this.localize("arc", "Archives", this.language) : ""

                return (!_.size(hes) /* || heType==="archivedHealthElements" */) ? null : {
                    name: heTypeLabel,
                    sorting: heType === "activeHealthElements" ? 1 :
                        heType === "inactiveHealthElements" ? 2 :
                            heType === "surgicalHealthElements" ? 3 :
                                heType === "familyrisks" ? 4 :
                                    heType === "risks" ? 5 :
                                        heType === "allergies" ? 6 :
                                            heType === "medications" ? 7 :
                                                heType === "archivedHealthElements" ? 8 : 999,
                    nodes: [
                        {
                            type: 'paragraph',
                            content: [{
                                type: 'text',
                                marks: [{type: 'strong'}],
                                text: _.trim(heTypeLabel).toUpperCase() + ": "
                            }, {type: 'text', text: " "}]
                        },
                        {
                            type: 'template', attrs: {
                                expr: `subContextsHes("${heType}")`,
                                template: {
                                    'default': heType !== "medications" ?
                                        _.compact([
                                            {
                                                type: 'paragraph', content: _.flatten(_.compact(_.concat(
                                                    (heType !== "familyrisks" ? [] : [{
                                                        type: 'variable',
                                                        attrs: {expr: `dataProvider.form().he.familyLinkHr`}
                                                    }, {type: 'text', text: ": "}]),
                                                    [
                                                        {
                                                            type: 'variable',
                                                            attrs: {expr: `dataProvider.form().he.descr`}
                                                        }, {type: 'text', text: " "},
                                                        {type: 'text', text: "("}, {
                                                        type: 'variable',
                                                        attrs: {expr: `dataProvider.form().he.heCodeHr`}
                                                    }, {type: 'text', text: ") - "},
                                                        // {type:'variable', attrs:{ expr:`dataProvider.form().he.statusHr`}}, {type:'text', text: " - "},
                                                        {
                                                            type: 'text',
                                                            text: this.localize("from2", "From", this.language) + " "
                                                        }, {
                                                        type: 'variable',
                                                        attrs: {expr: `dataProvider.form().he.openingDateHr`}
                                                    }, {type: 'text', text: " "},
                                                        {
                                                            type: 'text',
                                                            text: this.localize("till", "to", this.language) + " "
                                                        }, {
                                                        type: 'variable',
                                                        attrs: {expr: `dataProvider.form().he.closingDateHr`}
                                                    }
                                                    ]
                                                )))
                                            },
                                            ((heType !== "allergies" && heType !== "archivedHealthElements") ? null :
                                                    {
                                                        type: 'paragraph', content: [
                                                            {
                                                                type: 'text',
                                                                text: this.localize("cdItemAllergy", "Allergy", this.language) + ": "
                                                            }, {
                                                                type: 'variable',
                                                                attrs: {expr: `dataProvider.form().he.allergyHr`}
                                                            }, {type: 'text', text: " - "},
                                                            {
                                                                type: 'text',
                                                                text: this.localize("drugs", "Drug", this.language) + ": "
                                                            }, {
                                                                type: 'variable',
                                                                attrs: {expr: `dataProvider.form().he.cnkHr`}
                                                            }
                                                        ]
                                                    }
                                            ),
                                        ]) : [
                                            {
                                                type: 'paragraph',
                                                content: [{
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.medication.cnkHrLabel`}
                                                }, {type: 'text', text: " (CNK: "}, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.medication.cnkCode`}
                                                }, {type: 'text', text: ") - "}, {
                                                    type: 'text',
                                                    text: this.localize("from2", "From", this.language) + " "
                                                }, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.medication.begin`}
                                                }, {type: 'text', text: " "}, {
                                                    type: 'text',
                                                    text: this.localize("till", "to", this.language) + " "
                                                }, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.medication.end`}
                                                }, {type: 'text', text: " - "}, {
                                                    type: 'text',
                                                    text: this.localize("substitution", "Substitution", this.language) + ": "
                                                }, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.medication.substitutionAllowed`}
                                                }, {type: 'text', text: " "}]
                                            },
                                            {
                                                type: 'paragraph',
                                                content: [{
                                                    type: 'text',
                                                    text: this.localize("cdItemAllergy", "Allergy", this.language) + ": "
                                                }, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.allergyHr`}
                                                }, {type: 'text', text: " "}, {
                                                    type: 'text',
                                                    text: this.localize("com", "Comment", this.language) + ": "
                                                }, {
                                                    type: 'variable',
                                                    attrs: {expr: `dataProvider.form().he.medication.comment`}
                                                }, {type: 'text', text: " "}]
                                            },
                                        ]
                                },
                            }
                        },
                        {type: 'paragraph', content: [{type: 'text', text: " "}]},
                    ]
                }

            }))
        }

        _.assign(healthElementVariablesLight, {subVars: _.orderBy(_.get(healthElementVariablesLight, "subVars", []), ['sorting'], ['asc'])})

        const getterByDataType = {
            TKDate: "getDateValue",
            TKNumber: "getNumberValue",
            TKMeasure: "getMeasureValue",
            TKBoolean: "getBooleanValue",
        }

        // Prose editor will try to have our templates / variables to fit on one page.
        // If not enough space is available, Prose editor will jump to the next A4 page, trying to make it fit there.
        // Ie: if we are "too long" => infinite loop seeking for next A4 page hoping to have enough space again and again.
        // Todo: improve Prose editor and have it to split content over several pages when required
        const maxVaribalesPerPage = 43

        const formVariables = {
            type: 'forms',
            additionalCssClasses: 'largeDivider',
            name: this.localize('formBlocks', 'Form blocks', this.language),
            subVars: _.flatten(_.compact(_.map(_.get(this, "_data.formsAndDataProviders", []), (form, templateGuid) => {

                const formObject = typeof _.get(form, "dataProvider.form", "") === "function" && _.get(form, "dataProvider.form", "")()
                const formName = _.trim(_.get(formObject, "descr", _.trim(_.get(formObject, ".template.name", ""))))
                const formTemplateDataList = _.get(formObject, "template.layout.sections[0].formColumns[0].formDataList", [])
                const formTemplateIsConsultation = _.trim(_.get(formObject, "template.guid", "")) === "FFFFFFFF-FFFF-FFFF-FFFF-CONSULTATION"

                const templateGuidAndIndex = templateGuid.split('#')
                const templateGuidsAndIndexes = _.keys(_.get(this, "_data.formsAndDataProviders", []))
                const totalFormsForCurrentTemplateGuid = parseInt(_.size(_.filter(templateGuidsAndIndexes, it => it.indexOf(templateGuidAndIndex[0]) > -1)))

                return {
                    name: _.get(formObject, "descr", "") + (totalFormsForCurrentTemplateGuid === 1 ? "" : " (" + _.trim(parseInt(templateGuidAndIndex[1])) + "/" + totalFormsForCurrentTemplateGuid + ")"),
                    templateGuid: _.trim(_.get(templateGuidAndIndex, "[0]", "")),
                    nodes: [
                        {
                            type: 'paragraph', content: [
                                {
                                    type: 'text',
                                    marks: [{type: 'strong'}, {type: 'underlined'}],
                                    text: this.localize("form", "Form", this.language).toUpperCase()
                                },
                                {type: 'text', text: ": " + _.trim(formName).toUpperCase()},
                                {
                                    type: 'text',
                                    text: " - " + this.localize("con_of", "Consultation of", this.language) + ": "
                                },
                                {type: 'variable', attrs: {expr: `contactOpeningDate`}},
                                {type: 'text', text: ' '}
                            ]
                        },
                        {
                            type: 'table', content: [
                                {
                                    type: 'table_row', content: [
                                        {
                                            type: 'table_cell',
                                            attrs: {
                                                "colspan": 1,
                                                "rowspan": 1,
                                                "colwidth": null,
                                                "borderColor": "#999999",
                                                "background": "#fafafa"
                                            },
                                            content: [{
                                                type: 'template',
                                                attrs: {
                                                    expr: `subContextsForms("${templateGuid}")`,
                                                    template: {
                                                        'default': _.compact(_.flattenDeep(_.map(this._getFormEditorSortedItemsBasedOnTemplate(form.dataProvider).filter(i => i.type !== 'TKAction'), k => {

                                                            const isSubForm = !!_.get(k, "isSubForm", false)
                                                            const subForms = !!isSubForm && form.dataProvider.getSubForms(_.get(k, "name"))
                                                            const fieldLabel = !!formTemplateIsConsultation ? _.trim(_.get(k, "name")) : _.trim(_.get(_.find(formTemplateDataList, {name: _.get(k, "name")}), "label")) || _.trim(_.get(k, "name"))
                                                            const fieldValue = form && form.dataProvider && form.dataProvider.getValue(k.name)

                                                            return (!!isSubForm && !_.size(subForms)) ?

                                                                // Empty subform
                                                                false :

                                                                // Field with no value
                                                                (!isSubForm && (
                                                                    !_.trim(fieldValue) ||
                                                                    _.trim(fieldValue) === "-" ||
                                                                    _.trim(fieldValue).toLowerCase() === "ok" ||
                                                                    (_.trim(_.get(k, "type")) === "TKMeasure" && !_.trim(form.dataProvider.getMeasureValue(k.name).value))
                                                                )) ? false :
                                                                    // Not sub form and has field value
                                                                    (!isSubForm) ? {
                                                                            type: 'paragraph', content: [
                                                                                {
                                                                                    type: 'text',
                                                                                    marks: [{type: 'strong'}],
                                                                                    text: fieldLabel + ": "
                                                                                },
                                                                                {
                                                                                    type: 'variable', attrs: {
                                                                                        expr: `const v = dataProvider.` + _.trim(_.get(getterByDataType, k.type, "getValue")) + `("${k.name}"); Array.isArray(v) ? v.join(', ') : ` + (
                                                                                            _.trim(_.get(k, "type")) === "TKDate" ? "componentDataProvider.getYYYYMMDDAsDDMMYYYY(v)" :
                                                                                                _.trim(_.get(k, "type")) === "TKMeasure" ? "componentDataProvider.getMeasureValue(v)" :
                                                                                                    _.trim(_.get(k, "type")) === "TKBoolean" ? "componentDataProvider.getBooleanValue(v)" :
                                                                                                        "componentDataProvider.getHrCodesAndTagsValue(v)"
                                                                                        )
                                                                                    }
                                                                                },
                                                                                {type: 'text', text: ' '}
                                                                            ]
                                                                        } :

                                                                        // Non-empty subform, map all its fields => values
                                                                        _.concat(
                                                                            _.compact(_.map(subForms, (subForm, subFormIdx) => {
                                                                                const subFormObject = typeof _.get(subForm, "dataProvider.form", "") === "function" && _.get(subForm, "dataProvider.form", "")()
                                                                                const subFormName = _.trim(_.get(subFormObject, "template.name", ""))
                                                                                const subFormTemplateDataList = _.get(subFormObject, "template.layout.sections[0].formColumns[0].formDataList", [])

                                                                                return [
                                                                                    {
                                                                                        type: 'paragraph',
                                                                                        content: [{
                                                                                            type: 'text',
                                                                                            text: " "
                                                                                        }]
                                                                                    },
                                                                                    {
                                                                                        type: 'paragraph', content: [
                                                                                            {
                                                                                                type: 'text',
                                                                                                marks: [{type: 'strong'}, {type: 'underlined'}],
                                                                                                text: this.localize("subForm", "Sub-form", this.language).toUpperCase()
                                                                                            },
                                                                                            {
                                                                                                type: 'text',
                                                                                                text: ": " + _.trim(subFormName).toUpperCase()
                                                                                            },
                                                                                            {
                                                                                                type: 'text',
                                                                                                text: " - " + this.localize("con_of", "Consultation of", this.language) + ": "
                                                                                            },
                                                                                            {
                                                                                                type: 'variable',
                                                                                                attrs: {expr: `contactOpeningDate`}
                                                                                            },
                                                                                            {type: 'text', text: ' '}
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        type: 'table', content: [
                                                                                            {
                                                                                                type: 'table_row',
                                                                                                content: [
                                                                                                    {
                                                                                                        type: 'table_cell',
                                                                                                        attrs: {
                                                                                                            "colspan": 1,
                                                                                                            "rowspan": 1,
                                                                                                            "colwidth": null,
                                                                                                            "borderColor": "#999999",
                                                                                                            "background": "#fafafa"
                                                                                                        },
                                                                                                        content: [{
                                                                                                            type: 'template',
                                                                                                            attrs: {
                                                                                                                expr: `subContextsSubForms("${k.name}",${subFormIdx})`,
                                                                                                                template: {
                                                                                                                    'default': _.compact(_.map(this._getFormEditorSortedItemsBasedOnTemplate(subForm.dataProvider).filter(i => i.type !== 'TKAction'), kk => {
                                                                                                                        const subFormFieldLabel = _.trim(_.get(_.find(subFormTemplateDataList, {name: _.get(kk, "name", "")}), "label", _.trim(_.get(kk, "name", ""))))
                                                                                                                        const subFormFieldValue = subForm && subForm.dataProvider && subForm.dataProvider.getValue(kk.name)
                                                                                                                        return /* (!_.trim(subFormFieldValue) || _.trim(subFormFieldValue) === "-" || _.trim(subFormFieldValue).toLowerCase() === "ok") ? false : */ {
                                                                                                                            type: 'paragraph',
                                                                                                                            content: [
                                                                                                                                {
                                                                                                                                    type: 'text',
                                                                                                                                    marks: [{type: 'strong'}],
                                                                                                                                    text: subFormFieldLabel + ": "
                                                                                                                                },
                                                                                                                                {
                                                                                                                                    type: 'variable',
                                                                                                                                    attrs: {
                                                                                                                                        expr: `const v = dataProvider.` + _.trim(_.get(getterByDataType, kk.type, "getValue")) + `("${kk.name}"); Array.isArray(v) ? v.join(', ') : ` + (
                                                                                                                                            _.trim(_.get(k, "type")) === "TKDate" ? "componentDataProvider.getYYYYMMDDAsDDMMYYYY(v)" :
                                                                                                                                                _.trim(_.get(k, "type")) === "TKMeasure" ? "componentDataProvider.getMeasureValue(v)" :
                                                                                                                                                    _.trim(_.get(k, "type")) === "TKBoolean" ? "componentDataProvider.getBooleanValue(v)" :
                                                                                                                                                        "componentDataProvider.getHrCodesAndTagsValue(v)"
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                },
                                                                                                                            ]
                                                                                                                        }
                                                                                                                    }))
                                                                                                                }
                                                                                                            }
                                                                                                        }]
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            })),
                                                                            [{
                                                                                type: 'paragraph',
                                                                                content: [{type: 'text', text: " "}]
                                                                            }]
                                                                        )
                                                        })))
                                                    }
                                                }
                                            }]
                                        },
                                    ]
                                },
                            ]
                        },
                        {type: 'paragraph', content: [{type: 'text', text: " "}]},
                    ]
                }

            })))
        }

        // document title, hcp footer (signature)
        const miscVariables = {
            type: 'misc',
            name: this.localize('miscellaneous', 'Miscellaneous', this.language),
            subVars: [
                {
                    name: this.localize('hub-doc-title', 'Document title', this.language),
                    nodes: [{
                        type: 'variable',
                        attrs: {expr: 'dataProvider.getVariableValue("documentTitle")'}
                    }, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('todaysDate', 'Todays date', this.language),
                    nodes: [{
                        type: 'variable',
                        attrs: {expr: 'dataProvider.getVariableValue("todaysDate")'}
                    }, {type: 'text', text: ' '}]
                },
                {
                    name: this.localize('hour', 'Time', this.language),
                    nodes: [{type: 'variable', attrs: {expr: 'dataProvider.getVariableValue("time")'}}, {
                        type: 'text',
                        text: ' '
                    }]
                },
            ]
        }

        const proseEditorVariables = _
            .chain(_.compact(_.concat(
                staticVariables,
                (!!_.size(_.get(healthElementVariables, "subVars")) ? healthElementVariables : []),
                (!!_.size(_.get(healthElementVariablesLight, "subVars")) ? healthElementVariablesLight : []),
                formVariables,
                miscVariables
            )))
            .map(it => {
                _.assign(_.last(it.subVars), {isLast: "isLast"})
                return it
            })
            .value()

        _.assign(_.last(proseEditorVariables), {isLast: "isLast"})

        return Promise.resolve(proseEditorVariables)

    }

    open(inputData) {

        if (!!_.get(this, "_isBusy", false)) return

        const patientId = !!_.trim(_.get(inputData, "patientId", "")) ? _.trim(_.get(inputData, "patientId", "")) : _.trim(_.get(this, "patient.id", ""))

        return this._resetComponentProperties()
            .then(() => _.map(this._data, (propValue, propKey) => typeof _.get(propValue, "value", null) !== "function" ? null : this.set("_data." + propKey, propValue.value())))
            .then(() => {
                this.set("_isBusy", true)
                this.shadowRoot.querySelector('#outgoingDocumentDialog').open()
            })
            .then(() => this._getPrettifiedFormsAndDataProviders(_.cloneDeep(_.get(inputData, "formsAndDataProviders", []))).then(formsAndDataProviders => _.assign(this._data, _.cloneDeep(inputData), {formsAndDataProviders: formsAndDataProviders})))
            .then(() => this._getPrettifiedHcp().then(hcp => _.assign(this._data, {currentHcp: hcp})))
            .then(() => this._getPrettifiedMh().then(hcp => _.assign(this._data, {currentMh: hcp})))
            .then(() => this._getPrettifiedContactHcp().then(hcp => _.assign(this._data, {contactHcp: hcp})))
            .then(() => this._getPrettifiedPatient(_.get(this, "user", {}), patientId).then(patient => _.assign(this._data, {currentPatient: patient})))
            .then(() => this._getCodesFromData().then(codes => _.assign(this._data, {codes: codes})))
            .then(() => this._getPrettifiedHealthElements(_.get(this, "_data.allHealthElements", [])).then(x => x))
            .then(() => this._getProseEditorVariables().then(proseEditorVariables => _.assign(this._data, {proseEditorVariables: proseEditorVariables})))
            .then(() => {
                const proseEditor = this.shadowRoot.querySelector("#prose-editor")
                proseEditor.set("dynamicVars", _.get(this, "_data.proseEditorVariables", []))
            })
            .then(() => this._getProseEditorTemplatesAndAttachment().then(proseEditorTemplates => _.assign(this._data, {proseEditorTemplates: proseEditorTemplates})))
            .then(() => this._getDataProvider().then(dataProvider => _.assign(this, {dataProvider: dataProvider})))
            .then(() => !!_.trim(_.get(this, "_data.docTemplateId", "")) ? this._applyProseEditorTemplate(null, _.find(_.get(this, "_data.proseEditorTemplates", []), {id: _.trim(_.get(this, "_data.docTemplateId", ""))})) : this._refreshProseEditorContext())
            .catch(e => console.log("[ERROR] outgoing document", e, inputData))
            .finally(() => (this.set("_isBusy", false) || true) && console.log("[Outgoing document, _data]", this._data))

        // Todo: When using prose template object, can't write in it ? Cusor jumps after one char typed / render issue ?
        // Todo: With linking letters, create smart component to get recipient details using cobra

    }
}

customElements.define(HtPatOutgoingDocument.is, HtPatOutgoingDocument)
