import '../../../styles/dialog-style.js';
import '../../../styles/scrollbar-style.js';
import '../../ht-spinner/ht-spinner.js';
import './ht-pat-action-plan-detail.js';

const procedureStatus = [ "aborted", "error", "refused", "pending", "planned", "completed", "proposed", "cancelled" ];

import {TkLocalizerMixin} from "../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatPreventiveActsDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style paper-tabs-style">

            #preventiveActsDialog{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 64px;
            }

            .splitPanel{
                display: flex;
                height: 100%;
                width: auto;
                margin: 0;
                padding: 0;
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

            .menu-item:hover {
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .menu-item .iron-selected {
                background:var(--app-primary-color);

            }

            .iron-selected-2 {
                background:var(--app-primary-color);
                color: white;
            }

            .sidebar {
                height: 100%;
                width: 30%;
                min-width: 320px;
                background-color: var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
                overflow: auto;
                position: relative;
            }

            .sidebar-content{
                margin: 8px 4px 4px 4px;
            }

            .detail {
                height: 100%;
                width: 75%;
                position: relative;
                background: white;
                overflow-y: scroll;
            }

            .detail-content{
                margin: 5px;
            }

            .sublist{
                background:var(--app-light-color);
                padding:0;
            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
            }

            .status {
                border-radius: 20px;
                padding: 1px 12px 1px 8px;
                font-size: 14px;
                display: block;
                width: auto;
                max-width: fit-content;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .status--orangeStatus{
                background: #fcdf354d;
            }
            .status--greenStatus{
                background: #07f8804d;
            }
            .status--redStatus{
                background: #ff4d4d4d;
            }

            .statusIcon {
                height: 8px;
                width: 8px;
            }
            .statusIcon--orangeStatus {
                color: var(--app-status-color-pending);
            }
            .statusIcon--greenStatus {
                color: var(--app-status-color-ok);
            }
            .statusIcon--redStatus {
                color: var(--app-status-color-nok);
            }

            p.error {
                color: var(--app-error-color);
            }

            .header {
                display: flex;
                flex-flow: row nowrap;
                background: var(--app-background-color-light);
                border-bottom: 1px solid var(--app-background-color-dark);
            }

            .hdr {
                font-weight: bold;
            }

            .col {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-left: 2px;
            }

            .col-1 {
                border-right: 1px solid var(--app-background-color-dark);
                width: 30%;
            }

            .col-2 {
                border-right: 1px solid var(--app-background-color-dark);
                width: 50%;
            }

            .col-3 {
                width: 20%;
            }

            .sort {
                display: flex;
                flex-flow: row nowrap;
                cursor: pointer;
            }

            .sort-button {
                display: inline;
                position: relative;
                padding: 0px;
                margin: 0px;
                width: 16px;
                height: 16px;
            }

            .sidebar-filter {
                display: flex;
                flex-flow: row nowrap;
                height: 40px;
                width: 100%;
            }

            .sidebar-filter-date-min {
                width: 50%;
                margin-left: 6px;
            }

            .sidebar-filter-date-max {
                width: 50%;
                margin-left: 6px;
            }

            .sidebar-filter-label {
                width: 50%;
                margin-left: 6px;
            }

            .sidebar-filter-status {
                width: 50%;
                margin-left: 6px;
            }

            .sidebar-filter-links {
                width: 50%;
                margin-left: 6px;
            }

            vaadin-date-picker {
                min-width: 100%!important;
                margin-top: 0px;
            }

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
                width: 140px;
                margin-top: -14px;
                margin-bottom: 10px;
            }

            vaadin-combo-box {
                width: 160px;
            }

            .w100 {
                width: 100%
            }

            .hidden {
                display: none;
            }

            .detail-none {
                margin: 6px;
                font-style: italic;
            }

        </style>

        <paper-dialog id="preventiveActsDialog">
            <h2 class="modal-title">[[title]]</h2>
            <div class="content">
                <div class="splitPanel">
                    <div class="sidebar">

                        <div class="sidebar-filter">
                            <div class="sidebar-filter-date-min">
                                <vaadin-date-picker class="dateFilter" id="filterDateMin" on-value-changed="_valueChanged" label="[[localize('from2','Du',language)]]" value="{{filterDateMin}}" i18n="[[i18n]]"></vaadin-date-picker>
                            </div>
                            <div class="sidebar-filter-date-max">
                                <vaadin-date-picker class="dateFilter" id="filterDateMax" on-value-changed="_valueChanged" label="[[localize('to2','Au',language)]]" value="{{filterDateMax}}" i18n="[[i18n]]"></vaadin-date-picker>
                            </div>
                        </div>
                        <div class="sidebar-filter">
                            <div class="sidebar-filter-label">
                                <paper-input id="filterLabel" class="w100" label="[[localize('lab','Label',language)]]" value="{{filterLabel}}" on-value-changed="_valueChanged"></paper-input>
                            </div>
                            <div class="sidebar-filter-status">
                                <vaadin-combo-box id="filterStatus" class="w100" filtered-items="[[comboStatus]]" item-label-path="label" item-value-path="id" label="[[localize('sta','Status',language)]]" value="{{filterStatus}}" on-value-changed="_valueChanged"></vaadin-combo-box>
                            </div>
                        </div>
                        <div class="sidebar-filter">
                            <div class="sidebar-filter-links">
                                <vaadin-combo-box id="filterLinks" class="w100" filtered-items="[[linkables]]" item-label-path="descr" item-value-path="id" label="[[localize('healthElement','Element de soin',language)]]" value="{{filterLinks}}" on-value-changed="_valueChanged"></vaadin-combo-box>
                            </div>
                        </div>

                        <div class="sidebar-content">
                            <div class="header">
                                <div id="date" class="sort col-1 col hdr" on-tap="_sortBy">
                                    <div>[[localize('dat', 'Date', language)]]</div>
                                    <template is="dom-if" if="[[_isSortedBy('date', sort)]]">
                                        <paper-icon-button id="sortDate" class="sort-button" icon="[[_sortIcon('date', sort)]]" hover="none"></paper-icon-button>
                                    </template>
                                </div>
                                <div id="label" class="sort col-2 col hdr" on-tap="_sortBy">
                                    <div>[[localize('lab', 'Label', language)]]</div>
                                    <template is="dom-if" if="[[_isSortedBy('label', sort)]]">
                                        <paper-icon-button id="sortLabel" class="sort-button" icon="[[_sortIcon('label', sort)]]" hover="none"></paper-icon-button>
                                    </template>
                                </div>
                                <div id="status" class="sort col-3 col hdr" on-tap="_sortBy">
                                    <div>[[localize('sta', 'Status', language)]]</div>
                                    <template is="dom-if" if="[[_isSortedBy('status', sort)]]">
                                        <paper-icon-button id="sortStatus" class="sort-button" icon="[[_sortIcon('status', sort)]]" hover="none"></paper-icon-button>
                                    </template>
                                </div>
                            </div>
                            <paper-listbox id="menu" class="menu-content sublist" selected="[[selectedItem]]" attr-for-selected="id">
                                <template id="servicesList" is="dom-repeat" items="[[services]]">
                                    <paper-item id="id_[[item.id]]" class\$="menu-trigger menu-item [[isIronSelected(selected)]] one-line-menu" aria-selected="[[selected]]" on-tap="_select">
                                        <div class="col-1 col" data-id\$="[[id]]">[[_formatDate(item, services, refresher)]]</div>
                                        <div class="col-2 col" data-id\$="[[id]]">[[_getContent(item, services, refresher)]]</div>
                                        <div class="col-3 col" data-id\$="[[id]]"><span><iron-icon icon="vaadin:circle" class\$="statusIcon statusIcon--[[_getStatusClass(item, services, refresher)]]"></iron-icon>&nbsp;[[_formatStatus(item, services, refresher)]]</span></div>
                                    </paper-item>
                                </template>
                            </paper-listbox>
                        </div>
                    </div>
                    <div class="detail">
                        <div class="detail-content" id="detail-content">
                            <ht-spinner active="[[isLoading]]"></ht-spinner>
                            <ht-pat-action-plan-detail id="detail" api="[[api]]" user="[[user]]" resources="[[resources]]" language="[[language]]" i18n="[[i18n]]" contacts="[[contacts]]" linkables="[[linkables]]" showlinks="true" current-contact="[[currentContact]]" on-changed="_onChanged" on-saved="_onSaved" readonly="false"></ht-pat-action-plan-detail>
                        </div>
                        <div class="detail-none hidden" id="detail-none">[[localize('proc_none', 'proc_none', language)]]</div>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <p class="error">[[error]]</p>
                <paper-button class="button" on-tap="_closeDialogs"><iron-icon icon="icons:close" class="mr5 smallIcon"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                <paper-button class="button button--other" on-tap="_print"><iron-icon icon="vaadin:print" class="mr5 smallIcon"></iron-icon> [[localize('print','Print',language)]]</paper-button>
                <paper-button class="button button--other" on-tap="_delete">[[localize('del','Delete',language)]]</paper-button>
                <paper-button class="button button--save" autofocus="" on-tap="_save" disabled="[[!changed]]">[[localize('save','Save',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-preventive-acts-dialog';
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
          contacts: {
              type: Array,
              value: ()=>[]
          },
          services:{
              type: Array,
              value: ()=>[]
          },
          language: {
              type: String
          },
          title: {
              type: String
          },
          filterDate: {
              type: String
          },
          filterLabel: {
              type: String
          },
          filterStatus: {
              type: Object,
              value: null
          },
          filterLinks: {
              type: Object,
              value: null
          },
          comboStatus: {
              type: Array,
              value : () => []
          },
          selectedItem: {
              type:  String,
              value: null
          },
          isLoading: {
              type: Boolean,
              value: false
          },
          error: {
              type: String,
              value: ''
          },
          sort: {
              type: String,
              value: "date"
          },
          refresher: {
              type: Number,
              value: 0
          },
          activeItem: {
              type: Object,
              observer: '_activeItemChanged'
          },
      };
  }

  static get observers() {
      return ['contactsChanged(contacts, servicesRefresher)'];
  }

  ready() {
      super.ready();
  }

  attached() {
      super.attached();
      this.async(this.notifyResize());
  }

  reset() {
      this.set("services", [])
  }

  contactsChanged(){
      if(!(this.contacts && this.contacts.length)) {
          this.reset()
          return;
      }
      this.api.contact().filterServices(this.contacts, s => s.label==='Actes' || s.tags.some(t => t.type == "CD-ITEM" && t.code == "vaccine") || (s.tags.some(t => t.type == "SOAP" && t.code == "Plan") && s.tags.some(t => t.type == 'CD-ITEM-TASK')))
          .then(services =>{
              this._services = services;
              this._filter();
          })
  }

  isIronSelected(selected) {
      return selected ? 'iron-selected' : '';
  }

  _isSortedBy(label) {
      return this.sort.startsWith(label);
  }

  _sortIcon() {
      return this.sort.endsWith("-desc") ? "icons:arrow-drop-down" : "icons:arrow-drop-up"
  }

  _sortBy(e) {
      const label = e.currentTarget.id;
      if (this._isSortedBy(label)) {
          this._sort(!this.sort.endsWith("-desc") ? label + "-desc" : label)
          return;
      }
      this._sort(label)
  }

  _sort(order) {
      this.set("sort", order)
      this.set("services", this._filteredServices.sort((a, b) => this._compare(order, a, b)));
      this.shadowRoot.querySelector('#servicesList').render() ;
      if (this.selectedItem) {
          if (!this.services.some(s => s.id === this.selectedItem.id))
              this._show(this.services.length > 0 ? this.services[0] : null);
      } else {
          if (this.services.length > 0)
              this._show(this.services[0])
      }
  }

  _compare(order, a, b) {
      if (order.startsWith("date")) {
          if (order.endsWith("-desc"))
              return this._compareDates(b.valueDate, a.valueDate);
          return this._compareDates(a.valueDate, b.valueDate);
      }
      if (order.startsWith("label")) {
          if (order.endsWith("-desc"))
              return this._getContent(b).localeCompare(this._getContent(a));
          return this._getContent(a).localeCompare(this._getContent(b));
      }
      if (order.startsWith("status")) {
          if (order.endsWith("-desc"))
              return this._formatStatus(b).localeCompare(this._formatStatus(a));
          return this._formatStatus(a).localeCompare(this._formatStatus(b));
      }
  }

  _compareDates(a, b) {
      return a && b ? this.api.moment(a).diff(this.api.moment(b)) : null;
  }

  _between(date, min, max) {
      if (min && max) return this._compareDates(date, min) >= 0 && this._compareDates(date, max) <= 0;
      if (min) return this._compareDates(date, min) >= 0;
      if (max) return this._compareDates(date, max) <= 0;
      return true;
  }

  _valueChanged(e) {
      this.filterDateMin = this.$["filterDateMin"].value;
      this.filterDateMax = this.$["filterDateMax"].value;
      if (e.currentTarget.id === "filterLabel")
          this.filterLabel = e.detail.value;
      if (e.currentTarget.id === "filterStatus")
          this.filterStatus = !!e.detail.value ? e.detail.value : null;
      if (e.currentTarget.id === "filterLinks")
          this.filterLinks = !!e.detail.value ? e.detail.value : null;
      this._filter();
  }

  _hasHealthElement(healthElementId, serviceId) {
      return this.contacts.some(c => _.get(c, "subContacts", []).some(sc => sc.healthElementId === healthElementId && _.get(sc, "services", []).some(s => s.serviceId === serviceId)));
  }

  _filter() {
      if (!this._services) return;
      if (this.$["filterDateMin"] && this.$["filterDateMax"]) {
          this.$["filterDateMin"].max = this.$["filterDateMax"].value;
          this.$["filterDateMax"].min = this.$["filterDateMin"].value;
      }
      const min = this.filterDateMin ? parseInt(this.api.moment(this.filterDateMin).format('YYYYMMDDHHmmss')) : null;
      const max = this.filterDateMax ? parseInt(this.api.moment(this.filterDateMax).format('YYYYMMDDHHmmss')) : null;
      let services = this._services.filter(s => this._between(s.valueDate, min, max));
      if (this.filterLabel && this.filterLabel.length > 0)
          services = services.filter(s => this._getContent(s).includes(this.filterLabel));
      if (this.filterStatus)
          services = services.filter(s => this._getStatus(s) === this.filterStatus);
      if (this.filterLinks) {
          services = services.filter(s => this._hasHealthElement(this.filterLinks, s.id));
          const descr = _.get(this.linkables.find(l => l.id === this.filterLinks), "descr", "...");
          this.set("title", this.localize("proc_list_related", "proc_list_related") + " " + descr);
      }
      else
          this.set("title", this.localize("proc_list", "proc_list"));
      this._filteredServices = services;
      this._sort(this.sort);
  }

  _getContent(svc){
      const content = svc && this.api.contact().preferredContent(svc, this.language) || svc.content[this.language]
      return _.get(svc, 'tags', []).some(t => t.type == "SOAP" && t.code == "Plan") && !_.isEmpty(content) ?  _.get(svc, 'content.descr.stringValue', null) : _.get(content, 'stringValue', null) ?  _.get(content, 'stringValue', null) : !_.isEmpty(content) ? content : _.get(svc, 'comment', null) ? _.get(svc, 'comment', null) :  this.localize('obs_val','obsolete value',this.language)
  }

  _formatDate(svc) {
      return svc.valueDate && this.api.formatedMoment(svc.valueDate);
  }

  _formatStatus(svc) {
      const status = this._getStatus(svc);
      return this.localize('proc_status_' + status, status, this.language);
  }

  _getStatus(svc) {
      return _.get(svc.tags.find(tag => tag.type === "CD-LIFECYCLE"), "code", "");
  }

  _getStatusClass(svc) {
      const status = this._getStatus(svc);
      if (status === "error" || status === "aborted" || status === "refused" || status === "cancelled")
          return "redStatus"
      if (status === "pending" || status === "planned" || status === "proposed")
          return "orangeStatus"
      return "greenStatus";
  }

  _onSaved(e) {
      this._show(this._next);
      this._next = null;
  }

  _onChanged(e) {
      //if (e.detail.changed)
          this.set("refresher", this.refresher + 1);
      this.set("error", e.detail.error);
      this.set("changed", e.detail.changed);
  }

  _openDialog(healthElementId) {
      this.$['preventiveActsDialog'].open();
      this.set("title", this.localize("proc_list", "proc_list"));
      this.set("isLoading", true);
      this.filterLinks = healthElementId;
      setTimeout(()=> {
          this.api.contact().filterServices(this.contacts, s => s.label==='Actes' || (s.tags.some(t => t.type == "SOAP" && t.code == "Plan") && s.tags.some(t => t.type == 'CD-ITEM-TASK')))
              .then(services =>{
                  this._services = services;
                  this._filter();
                  if (this.services.length > 0)
                      this._show(this.services[0]);
                  this.set("isLoading", false);
              })
      }, 500);
  }

  _setItemClass(item, className, enabled) {
      if (!item) return;
      if (enabled)
          item.classList.add(className);
      else
          item.classList.remove(className);
  }

  _setClass(selector, className, enabled) {
      return this._setItemClass(this.shadowRoot.querySelector(selector), className, enabled);
  }

  _show(service) {
      const id = _.get(service, "id", null);
      this.set("comboStatus", procedureStatus.map(id => {
          return { id : id, label: this.localize("proc_status_" + id, id) }
      }));
      this.services.forEach(service => {
          const item = this.shadowRoot.querySelector("#id_" + service.id);
          if (item) {
              item.setAttribute("aria-selected", service.id === id ? "true" : "false");
              this._setItemClass(item, "iron-selected-2", service.id === id);
          }
      });

      this._setClass("#detail-none", "hidden", service);
      this._setClass("#detail-content", "hidden", !service);

      this.set("selectedItem", service)
      this.$['detail'].show(service);
  }

  _select(e) {
      console.log("_select");
      this._next = this.services.find(s => "id_" + s.id === e.currentTarget.id);
      if (this.changed) {
          this.$['detail'].save();
          return;
      }
      this._show(this._next);
      this._next = null;
  }

  _save(e) {
      this._next = this.selectedItem;
      this.$['detail'].save();
  }

  close() {
      this.$.dialog.close();
  }

  _closeDialogs(){
      this.$['preventiveActsDialog'].close();
  }

  _formatDate(svc) {
      return svc.valueDate && this.api.formatedMoment(svc.valueDate);
  }

  _formatStatus(svc) {
      const status = this._getStatus(svc);
      return this.localize('proc_status_' + status, status, this.language);
  }

  _label(label, value) {
      return "<b>" + this.localize(label, label) + ":</b>&nbsp;" + value;
  }

  _generateRow(value) {
      return value ? "<div class='action-row'>" + value + "</div>" : "";
  }

  _generatePdf(action) {
      let html = "<div class='action'>";
      html += "<div class='action-header'>";
      html += "<div>" + this._formatDate(action.service) + "&nbsp;</div>";
      let content = this._getContent(action.service);
      if (action.isVaccineProcedure) {
          const dose = _.get(action, "DoseNumber", null);
          if (content && dose)
              content += "&nbsp;(" + dose + ")";
      }
      html += "<div>" + content + "</div>";
      html += "<div class='action-status " + this._getStatusClass(action.service) + "'>" + this._formatStatus(action.service) + "</div>";
      html += "</div>";

      html += "<div class='action-body'>";

      if (action.HealthElements && action.HealthElements.length > 0) {
          html += "<div class='action-row'><b>" + this.localize("healthcareelements", "healthcareelements") + ":</b>&nbsp;";
          action.HealthElements.forEach(he => {
              html += "<div>" + he.descr + "&nbsp;</div>";
          })
          html += "</div>";
      }

      if (action.isVaccineProcedure) {
          let product = _.get(action, "VaccineInfo.name", _.get(action, "VaccineName", null));
          if (product) {
              const batch = _.get(action, "BatchNumber", null);
              if (batch)
                  product += "&nbsp;(" + batch + ")"
              html += this._generateRow(this._label("pro", product));
          }
      }

      const description = _.get(action, "Description", null);
      if (description)
          html += this._generateRow(this._label("des", description));

      const profession = _.get(action, "ProfessionInfo.label." + this.language, null);
      let healthCareParty = _.get(action, "HealthCareParty.name", null);
      if (healthCareParty && profession)
          healthCareParty += "&nbsp;(" + profession.trim() + ")"
      html += this._generateRow(healthCareParty);

      if (action.Status === "refused") {
          const reasonOfRef = _.get(action, "ReasonOfRef", null);
          if (reasonOfRef)
              html += this._generateRow("<b>Motif de refus:</b>" + reasonOfRef);
      }

      //if (action.Status === "completed")
      //    html += this._generateRow(_.get(action, "isSurgical", null));

      html += "</div>";
      html += "</div>";
      return html;
  }

  _print() {
      const name = "report.pdf";
      const promises = this.services.map(s => this.$["detail"].getPlannedAction(s));
      Promise.all(promises).then(actions => {
          let html = "";
          actions.forEach(action => html += this._generatePdf(action));
          this.api.pdfReport(this._getHtml(html), {type:"unknown",completionEvent:"pdfDoneRenderingEvent"})
              .then(printedPdf => !printedPdf.printed && this.api.triggerFileDownload(printedPdf.pdf, "application/pdf", name, this.$['preventiveActsDialog']))
              .finally(() => {
                  console.log("Printed");
              })
      })
  }

  _getHtml(body) {
      return `
          <html>
              <head>
                  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
                  <style>

                      @page {size: A4; width: 210mm; height: 297mm; margin: 0; padding: 0; }
                      body {margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; line-height:1.3em; }
                      .page { width: 210mm; color:#000000; font-size:12px; padding:10mm; position:relative;  }

                      .action {
                          border: 1px solid #eeeeee;
                          margin: 5px;
                      }
                      .action-header {
                          background-color: #eeeeee;
                          display: flex;
                          padding: 5px;
                          flex-flow: row nowrap;
                      }
                      .action-status {
                          margin-left: auto;
                      }
                      .action-body {
                          display: flex;
                          flex-flow: column nowrap;
                          padding: 5px;
                          line-height: 14px;
                          font-size: x-small;
                          text-align: center;
                      }
                      .action-row {
                          display: flex;
                          flex-flow: row nowrap;
                          padding: 5px;
                          line-height: 14px;
                          font-size: x-small;
                          text-align: center;
                      }

                      .orangeStatus { color: #fcdf35; }
                      .greenStatus { color: #07f87f; }
                      .redStatus { color: #ff4d4d; }

                      .w100 { width: 100px; }
                      .w400 { width: 400px; }
                      .w300 { width: 300px; }
                      .w150 { width: 150px; }

                  </style>
              </head>

              <body>
                  <div class="page">` + body + `
                  </div>` +
          '<script>document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <'+'/script>' + `
              </body>
          </html>
      `
  }

  _delete() {
      this.dispatchEvent(new CustomEvent("delete-service", {
          detail: {
              service: this.selectedItem,
              caller: this,
          },
          bubbles: true,
          composed: true
      }))
  }

  delete() {
      this.$['detail'].delete();
  }
}
customElements.define(HtPatPreventiveActsDialog.is, HtPatPreventiveActsDialog);
