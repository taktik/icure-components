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


import moment from 'moment/src/moment';

import Chart from 'chart.js';

import XLSX from 'xlsx'
import 'xlsx/dist/shim.min'

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../../tk-localizer";
class HtAdminReportsAgeStructure extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles dialog-style">
            :host {
                display: block;
            }

            :host *:focus{
                outline:0!important;
            }

            .age-structure {
                height: calc(100vh - 84px);
                width: 100%;
                padding: 0 20px 24px 20px;
                box-sizing: border-box;
                position: relative;
            }

            .export-btn {
                margin-right: 0;
            }

            .spinnerbox {
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                padding: 0;
            }

            ht-spinner {
                width: 42px;
                height: 42px;
            }

            .options {
                display: flex;
                flex-flow: row nowrap;
            }

            .chart-container {
                position: relative;
                height: calc(100% - 105px);
                width: 100%!important;
            }
        </style>

        <div class="age-structure">
            <h4>[[localize('rap_age_structure', 'Rapports - Pyramide des âges', language)]]</h4>
            <div class="spinnerbox">
                <ht-spinner active="[[isLoading]]"></ht-spinner>
            </div>
            <div style="height: 100%">
                <div class="options">
                    <vaadin-checkbox id="active" checked="[[active]]" on-checked-changed="_activeChanged">[[localize('ags_active','ags_active',language)]]</vaadin-checkbox>
                    <vaadin-checkbox id="pyramid" checked="[[pyramid]]" on-checked-changed="_pyramidChanged">[[localize('ags_pyramid','ags_pyramid',language)]]</vaadin-checkbox>
                </div>
                <div class="chart-container">
                    <canvas id="chart"></canvas>
                </div>
                <div style="width: fit-content">
                    <paper-button on-tap="_print" class="button button--save"><iron-icon icon="vaadin:print" class="mr5 smallIcon"></iron-icon>[[localize('print','Print',language)]]</paper-button>
                </div>
            </div>
        </div>
`;
  }

  static get is() {
      return 'ht-admin-reports-age-structure'
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
          active: {
              type: Boolean,
              value: true
          },
          pyramid: {
              type: Boolean,
              value: true
          },
          isLoading: {
              type: Boolean,
              value: false
          }
      }
  }

  static get observers() {
      return [];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready();
      this.open();
  }

  open() {
      this.set("isLoading", true);
      this._timer = setTimeout(()=> {
          this._initialize();
          clearTimeout(this._timer);
      }, 1000);
  }

  _activeChanged(e) {
      this.set("active", e.detail.value);
      this._initializeChart();
  }

  _pyramidChanged(e) {
      this.set("pyramid", e.detail.value);
      this._initializeChart();
  }

  _initialize() {
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
          const id = hcp.parentId ? hcp.parentId : hcp.id;
          const filter = {
              $type: "PatientByHcPartyNameContainsFuzzyFilter",
              healthcarePartyId: id,
              searchString: ""
          };
          this.api.patient().filterByWithUser(this.user, null, null, 5000, 0, null, true, {filter: filter})
              .then(patients => {
                  this._patients = patients.rows;
                  this._initializeChart();
              }).finally(() => {
                  this.set("isLoading", false);
              });
      })
  }

  _initializeChart() {
      const patients = this.active ?
          this._patients.filter(p => p.active) :
          this._patients;

      let values = [];
      let index;
      for (index = 0; index < 24; index++)
          values.push({index: index, male: 0, female: 0});

      patients.forEach(patient => {
          const birth = this.api.moment(patient.dateOfBirth);
          if (birth) {
              const age = this.api.moment(Date.now()).diff(birth, "years");
              if (age && age >= 0) {
                  const index = Math.floor(age / 5);
                  if (patient.gender === "male")
                      values[index].male++;
                  else
                      values[index].female++;
              }
          }
      });

      let start = 0
      while (start < values.length && values[start].male < 1 && values[start].female < 1 && !this.pyramid) start++;

      let end = values.length -1;
      while (end > start && values[end].male < 1 && values[end].female < 1) end--;
      values = values.slice(start, end);

      if (this.chart)
          this.chart.destroy();

      if(!this.pyramid){
          this.chart = new Chart(this.$['chart'], {
              type: 'bar',
              data: {
                  labels: values.map(x => x.index * 5),
                  datasets: [{
                      label: this.localize('gender_male', 'Male', this.language),
                      fillColor: "transparent",
                      data: values.map(x => x.male),
                      lineTension: 0.1,
                      backgroundColor: "rgba(28,101,254,0.2)",
                      borderColor: "rgb(28,101,254)"
                  },
                      {
                          label: this.localize('gender_female', 'Female', this.language),
                          fillColor: "transparent",
                          data: values.map(x => x.female),
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"
                      }]
              },
              options: {
                  responsive: true,
                  aspectRatio: 3,
                  maintainAspectRatio: false
              }
          });
      }
  }

  exportToCsv() {
      let items = null
      if(this.checkedInvoices.length > 0) {
          items = this.checkedInvoices
      } else {
          items = this.filteredInvoiceItems
      }
      this.generateXlsFile(items.map(inv => {
          const xlinv = JSON.parse(JSON.stringify(inv));
          if(this.isExportAnonyme) {
              delete xlinv.patient
          }
          xlinv.date = xlinv.date.replace("-", "/").replace("-", "/")
          xlinv.invoiceId = xlinv.invoice.id
          delete xlinv.patientId
          delete xlinv.invoice
          delete xlinv.authorHcpId
          delete xlinv.responsibleHcpId
          delete xlinv.responsibleToSort
          delete xlinv.patientToSort
          delete xlinv.authorToSort
          delete xlinv.dateToSort
          delete xlinv.sentDateToSort
          return xlinv
      }))
  }

  _print() {
      const title = this.localize('age_structure','Age structure');
      this.api.pdfReport(this._getHtml(title, this.chart.toBase64Image()), {type:"unknown",completionEvent:"pdfDoneRenderingEvent"})
          .then(printedPdf => !printedPdf.printed && this.api.triggerFileDownload(printedPdf.pdf, "application/pdf", title + ".pdf"))
          .finally(() => {
              console.log("Printed");
          })
  }

  _getHtml(title, data) {
      const body = '<div class="imageContainer"><img src="' + data + '"/></div>'
      return `
          <html>
              <head>
                  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
                  <style>
                      @page {size: A4 landscape; width: 210mm; height: 297mm; margin: 0; padding: 0; }
                      body {margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; line-height:1.3em; }
                      .page { width: 300mm; color:#000000; font-size:12px; padding:10mm; position:relative; }
                      .imageContainer img {max-width:100%; height:auto; margin-top: 80px}
                  </style>
              </head>

              <body>
                  <div class="page"><h1>` + title + `</h1>` + body + `
                  </div>` +
          '<script>document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <' + '/script>' + `
              </body>
          </html>
      `
  }

  generateXlsFile(data) {

      // Create xls work book and assign properties
      const xlsWorkBook = {SheetNames: [], Sheets: {}}
      xlsWorkBook.Props = {Title: "Attest list", Author: "Topaz"}

      // Create sheet based on json data collection
      var xlsWorkSheet = XLSX.utils.json_to_sheet(data)

      // Link sheet to workbook
      XLSX.utils.book_append_sheet(xlsWorkBook, xlsWorkSheet, 'Attest list')

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
      downloadLink.download = "attest-list_" + moment().format("YYYYMMDD-HHmmss") + ".xls"

      // Trigger download and drop object
      downloadLink.click()
      window.URL.revokeObjectURL(urlObject)

      // Free mem
      fileBlob = false
      xlsWorkBookOutput = false

      return
  }
}

customElements.define(HtAdminReportsAgeStructure.is, HtAdminReportsAgeStructure)
