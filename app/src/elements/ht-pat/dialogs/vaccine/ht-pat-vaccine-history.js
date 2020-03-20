import '../../../ht-spinner/ht-spinner.js'
import _ from 'lodash/lodash'

import {PolymerElement, html} from '@polymer/polymer'
import {TkLocalizerMixin} from "../../../tk-localizer"

class HtPatVaccineHistory extends TkLocalizerMixin(PolymerElement) {
    static get template() {
        return html`
        <style include="dialog-style">
            #dialog {
                height: 60vh;
                width: 90vw;
                overflow: hidden;
                margin: 0;
            }

            #vaccines {
                height: calc(100% - 2px);
                outline: none;
                flex-grow: 1;
            }

            h2 {
                min-height: 24px;
            }

            h3.err {
                text-align: center;
                margin-top: 10%;
                color: var(--app-error-color);
            }

            .content{
                margin-top: 0;
            }

            .col1 {
                width: 15%;
            }
            .col2 {
                width: 30%;
            }
            .col3 {
                width: 30%;
            }
            .col4 {
                width: 25%;
            }

            paper-button {
                color: #000;
            }

            .status {
                border-radius: 20px;
                padding: 1px 12px 1px 8px;
                font-size: x-small;
                display: block;
                width: auto;
                max-width: fit-content;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .status--orange{
                background: #fcdf354d;
            }
            .status--green{
                background: #07f8804d;
            }
            .status--red{
                background: #ff4d4d4d;
            }

            .statusIcon {
                height: 8px;
                width: 8px;
            }
            .statusIcon--orange {
                color: var(--app-status-color-pending);
            }
            .statusIcon--green {
                color: var(--app-status-color-ok);
            }
            .statusIcon--red {
                color: var(--app-status-color-nok);
            }

            ht-spinner {
                position: fixed;
                top: 50%;
                left: 50%;
                z-index: 9999;
                transform: translate(-50%, -50%);
                height: 42px;
                width: 42px;
            }

            @media screen and (max-width: 936px) {
                paper-dialog#dialog {
                    min-height: 0!important;
                    min-width: 0!important;
                    max-height: none !important;
                    max-width: none !important;
                    height: calc(100vh - 84px)!important;
                    width: 100%;
                    margin: 0;
                    top: 64px!important;
                    left: 0 !important;
                    transform: none!important;
                }
            }

            .pageContent{
                width: auto;
                box-sizing: border-box;
                height: 100%;
            }
        </style>

        <div class="pageContent view">

            <template is="dom-if" if="[[isEmpty]]">
                <iron-icon icon="warning"></iron-icon> [[localize('no_hist','No history',language)]] !
            </template>

            <vaadin-grid id="vaccines" class="material" items="[[getVaccines(refresher)]]" active-item="{{vaccine}}">
                <vaadin-grid-column flex-grow="0" width="100px">
                    <template class="header">
                        <vaadin-grid-sorter path="time">[[localize('dat','Date',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[getValue(item.dateAsString, refresher)]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column flex-grow="0" width="100px">
                    <template class="header">
                        <vaadin-grid-sorter path="code">[[localize('cod','Code',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen">[[item.code]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column flex-grow="1" width="400px">
                    <template class="header">
                        <vaadin-grid-sorter path="name">[[localize('nam','Name',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell">[[item.name]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column flex-grow="0" width="300px">
                    <template class="header">
                        <vaadin-grid-sorter path="product">[[localize('pro','Product',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell">[[getValue(item.product, refresher)]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column flex-grow="0" width="150px">
                    <template class="header">
                        <vaadin-grid-sorter path="status">[[localize('sta','Status',language)]]
                        </vaadin-grid-sorter>
                    </template>
                    <template>
                        <div class="cell frozen"><span class\$="status status--[[getValue(item.color, refresher)]]"><iron-icon icon="vaadin:circle" class\$="statusIcon statusIcon--[[getValue(item.color, refresher)]]"></iron-icon>&nbsp;[[_formatStatus(item.status, refresher)]]</span></div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column flex-grow="0" width="60px">
                    <template class="header">
                    </template>
                    <template>
                        <div class="cell">
                            <div>
                                <paper-icon-button id="[[item.id]]" icon="zoom-in" on-tap="showAction"></paper-icon-button>
                                <paper-tooltip position="left" for="[[vaccine.id]]">[[localize('show_det','Show details',language)]]</paper-tooltip>
                            </div>
                        </div>
                    </template>
                </vaadin-grid-column>
            </vaadin-grid>

            <!--
            <paper-listbox id="services-list" class="" selected="{{selected}}">
                <template is="dom-if" if="[[!vaccines.length]]">
                    <paper-item class="err"><iron-icon icon="warning"></iron-icon> [[localize('no_hist','No history',language)]] !</paper-item>
                </template>
                <template is="dom-repeat" items="[[vaccines]]">
                    <paper-item class="" data-item\$="[[item.id]]">
                        <div class="col1" data-item\$="[[item.id]]">[[item.date]]</div>
                        <div class="col2" data-item\$="[[item.id]]">[[item.name]] ([[item.code]])</div>
                        <div class="col3" data-item\$="[[item.id]]">[[item.product]]</div>
                        <div class="col4" data-item\$="[[item.id]]"><span class\$="status status--[[getValue(item.color, refresher)]]"><iron-icon icon="vaadin:circle" class\$="statusIcon statusIcon--[[getValue(item.color, refresher)]]"></iron-icon>&nbsp[[getValue(item.status, refresher)]]</span></div>
                    </paper-item>
                </template>
            </paper-listbox>
            -->
        </div>
`
    }

    static get is() {
        return 'ht-pat-vaccine-history'
    }

    static get properties() {
        return {
            api: {
                type: Object
            },
            user: {
                type: Object
            },
            language: {
                type: String
            },
            contacts: {
                type: Array,
                value: null
            },
            vaccines: {
                type: Array,
                value: []
            },
            refresher: {
                type: Number,
                value: 0
            },
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

    initialize(schemas, services) {
        console.log("ht-pat-vaccine-history: initialize", this.contacts)
        this._schemas = schemas
        let vaccines = services.map(svc => this._newVaccine(svc))
        this.set("vaccines", _.orderBy(vaccines, ['time', 'time'], ['code', 'code']))
        this.set("refresher", this.refresher + 1)
    }

    _newVaccine(svc) {
        return {
            id: svc.id,
            date: svc.valueDate,
            code: _.get(this._getCode(svc), 'code', null),
            name: this._getName(svc),
            time: this._getTime(svc),
            color: this._getColor(svc),
            status: this._getStatus(svc),
            product: this._getProduct(svc),
            service: svc,
            dateAsString: this._getDate(svc),
        }
    }


    updateService(detail) {
        const service = "service" in detail ? detail.service : detail.period.service
        const vaccine = this.vaccines.find(v => v.id == service.id)
        if (!vaccine) return
        vaccine.date = service.valueDate
        vaccine.time = this._getTime(service)
        vaccine.color = this._getColor(service)
        vaccine.status = this._getStatus(service)
        vaccine.product = this._getProduct(service)
        vaccine.dateAsString = this._getDate(service)
        this.set("refresher", this.refresher + 1)
        //this.shadowRoot.querySelector('#products').render();
    }

    getValue(value) {
        return value
    }

    getVaccines() {
        return this.vaccines
    }

    _formatDate(date) {
        return this.api.moment(date).format("DD/MM/YYYY")
    }

    _getDate(svc) {
        return this._formatDate(svc.valueDate)
    }

    _getTime(svc) {
        return svc && svc.valueDate ? this.api.moment(svc.valueDate).format("x") : null
    }

    _getCode(svc) {
        return svc.codes.find(c => c.type == "BE-THESAURUS-PROCEDURES")
    }

    _getName(svc) {
        const code = this._getCode(svc)
        if (code) {
            const procedure = this._schemas['fr'].procedures.find(p => p.id == code.id)
            if (procedure)
                return procedure.label[this.language]
        }
        return _.get(this._getContent(svc), "stringValue", "unknown")
    }

    _getColor(svc) {
        const status = this._getStatus(svc)
        if (status == "error" || status == "refused" || status == "aborded" || status == "aborted" || status == "cancelled")
            return "red"
        if (status == "pending" || status == "planned" || status == "proposed")
            return "orange"
        return "green"
    }

    _getStatus(svc) {
        return _.get(svc.tags.find(t => t.type === "CD-LIFECYCLE"), "code", "")
    }

    _getProduct(svc) {
        const content = this._getContent(svc)
        if (content &&
            content.medicationValue &&
            content.medicationValue.medicinalProduct &&
            content.medicationValue.medicinalProduct.intendedname)
            return content.medicationValue.medicinalProduct.intendedname
        return svc.comment ? svc.comment : this.localize('not_specified', 'n/a', this.language)
    }

    _getContent(svc) {
        return svc && this.api.contact().preferredContent(svc, this.language) || svc.content[this.language]
    }

    _formatStatus(code) {
        return this.localize("proc_status_" + code, code, this.language)
    }

    onActionChanged(detail) {
        if (detail.clone) {
            this.push("vaccines", this._newVaccine(detail.clone))
            this.set("vaccines", _.orderBy(this.vaccines, ['time', 'time'], ['code', 'code']))
            this.set("refresher", this.refresher + 1)
        }
        this.updateService(detail)
        this.dispatchEvent(new CustomEvent('update-service', {
            detail: detail
        }))
    }

    showAction(e) {
        const vaccine = this.vaccines.find(v => v.id == e.currentTarget.id)
        const contact = this.contacts.find(c => c.id == vaccine.service.contactId)
        this.dispatchEvent(new CustomEvent('open-action', {
            detail: {
                caller: this,
                source: "history",
                contact: contact,
                service: vaccine.service
            }
        }))
    }

    print() {
        let html = ''
        html += '<div class="history">'

        html += '<div class="history-line">'
        html += '<div class="history-header w100"><div class="pad">' + this.localize("dat", "Date") + '</div></div>'
        html += '<div class="history-header w100"><div class="pad">' + this.localize("cod", "Code") + '</div></div>'
        html += '<div class="history-header w400"><div class="pad">' + this.localize("nam", "Name") + '</div></div>'
        html += '<div class="history-header w300"><div class="pad">' + this.localize("pro", "Product") + '</div></div>'
        html += '<div class="history-header w150"><div class="pad">' + this.localize("sta", "Status") + '</div></div>'
        html += '</div>'

        this.vaccines.forEach(vaccine => {
            html += '<div class="history-line">'
            html += '<div class="history-column w100"><div class="pad">' + vaccine.dateAsString + '</div></div>'
            html += '<div class="history-column w100"><div class="pad">' + vaccine.code + '</div></div>'
            html += '<div class="history-column w400"><div class="pad">' + vaccine.name + '</div></div>'
            html += '<div class="history-column w300"><div class="pad">' + vaccine.product + '</div></div>'
            html += '<div class="history-column w150"><div class="pad">' + this._formatStatus(vaccine.status) + '</div></div>'
            html += '</div>'
        })

        html += '</div>'
        return html
    }
}

customElements.define(HtPatVaccineHistory.is, HtPatVaccineHistory)
