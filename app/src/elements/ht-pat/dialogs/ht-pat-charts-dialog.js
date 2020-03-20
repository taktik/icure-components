import '../../dynamic-form/dynamic-link.js';
import '../../dynamic-form/dynamic-pills.js';
import '../../ht-spinner/ht-spinner.js';
import '../../dynamic-form/dynamic-doc.js';
import '../../collapse-button/collapse-button.js';
import '../../../styles/dialog-style.js';
import '../../../styles/scrollbar-style.js';
import '../../../styles/paper-tabs-style.js';
import Chart from 'chart.js';

import {TkLocalizerMixin} from "../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
const curves = require('./rsrc/growth-curves.json')
const growthCurves = [
    //{ id: "HeadWeeks", code: "head", period: "weeks" },
    //{ id: "HeadMonths", code: "head", period: "months" },
    { id: "HeightWeeks", code: "height", period: "weeks" },
    { id: "HeightMonths", code: "height", period: "months" },
    { id: "WeightWeeks", code: "weight", period: "weeks" },
    { id: "WeightMonths", code: "weight", period: "months" }
]

const pSeries = [
    { index: 1, id: 'P3', color: "rgb(187,0,19)", backgroundColor: "rgb(187,0,19,0.2)", width: 2 },
    { index: 2, id: 'P15', color: "rgb(255,114,37)", backgroundColor: "rgb(255,114,37,0.2)", dash: [5, 10] },
    { index: 3, id: 'P50', color: "rgb(0,115,25)", backgroundColor: "rgb(0,115,25,0.2)", width: 2 },
    { index: 4, id: 'P85', color: "rgb(255,114,37)", backgroundColor: "rgb(255,114,37,0.2)", dash: [5, 10] },
    { index: 5, id: 'P97', color: "rgb(187,0,19)", backgroundColor: "rgb(187,0,19,0.2)", width: 2 },
]
class HtPatChartsDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style paper-tabs-style">

            #chartsDialog{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 64px;
            }

            .chartsDialog{
                display: flex;
                height: calc(100% - 45px);
                width: auto;
                margin: 0;
                padding: 0;
            }

            collapse-buton{
                --iron-collapse: {
                    padding-left: 0px !important;
                };
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

            .one-line-menu2 {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
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

            .menu-item:hover{
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .menu-item .iron-selected{
                background:var(--app-primary-color);

            }

            .charts-menu-list{
                height: 100%;
                width: 30%;
                background-color: var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
                overflow: auto;
                position: relative;
            }

            .charts-menu-view{
                height: 100%;
                width: 70%;
                position: relative;
                background: white;
            }

            .charts-menu-list-header{
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

            .charts-menu-list-header-img img{
                width: 100%;
                height: 100%;
            }

            collapse-button[opened] .menu-item-icon{
                transform: scaleY(-1);
            }

            .charts-container-line{
                display: flex;
                height: auto;
            }

            .charts-container-row{
                margin: 1%;
                width: 31%;
                height: 300px;
                border: 1px solid var(--app-background-color-dark);
            }

            .charts-container-row-title{
                height: 15px;
                padding: 5px;
                width: auto;
                background: var(--app-background-color-dark);
            }

            .charts{
                height: 255px;
                width: 100%!important;
            }

            .sublist{
                background:var(--app-light-color);
                padding:0;
            }

            .table-line-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                width: 100%;
            }

            .table-line-menu-top{
                padding-left: var(--padding-menu-item_-_padding-left);
                padding-right: var(--padding-menu-item_-_padding-right);
                box-sizing: border-box;
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

            .menu-item:hover{
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .menu-item .iron-selected{
                background:var(--app-primary-color);

            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
            }

            .charts-submenu-container{
                margin: 4px;
            }

            .charts-menu-content{
                margin: 5px;
            }

            .iron-selected-2{
                background:var(--app-primary-color);
                color: white;
            }

        </style>

        <paper-dialog id="chartsDialog">
            <div class="chartsDialog">
                <div class="charts-menu-list">
                    <div class="charts-menu-list-header">
                        [[localize('chart-av-measure', 'Available measures', language)]]
                    </div>
                    <div class="charts-submenu-container">
                        <paper-listbox id="menu" class="menu-content sublist" selected="[[selectedItem]]" attr-for-selected="id">
                        <template is="dom-repeat" items="[[charts]]">
                           <paper-item id="[[item.id]]" class$="menu-trigger menu-item [[isIronSelected(selected)]]" aria-selected="[[selected]]" on-tap="toggleMenu" elevation="">
                               <div class="one-line-menu">
                                    <span class="force-left force-ellipsis box-txt">[[item.name]]</span>
                                    <!-- <span>[[item.name]]</span>-->
                               </div>
                           </paper-item>
                        </template>
                        </paper-listbox>
                    </div>
                </div>
                <div class="charts-menu-view" style="overflow-y: scroll;">
                    <paper-tabs selected="{{tabs}}">
                        <paper-tab>
                            <iron-icon class="tabIcon" icon="vaadin:male"></iron-icon> [[localize('chart-chart','Charts',language)]]
                        </paper-tab>
                    </paper-tabs>
                    <page>
                        <!--<ht-spinner active="[[isLoading]]"></ht-spinner>-->
                        <div class="chart-container" style="position: relative; height:calc(100% - 60px); width:100%;">
                            <canvas id="chart"></canvas>
                        </div>
                    </page>
                </div>
                <div class="buttons">
                    <paper-button class="button" on-tap="_closeDialogs"><iron-icon icon="icons:close" class="mr5 smallIcon"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--other" on-tap="_print"><iron-icon icon="icons:print" class="mr5 smallIcon"></iron-icon> [[localize('pri','Print',language)]]</paper-button>
                    <paper-button class="button button--other" on-tap="_refresh"><iron-icon icon="icons:refresh" class="mr5 smallIcon"></iron-icon> [[localize('refresh','Refresh',language)]]</paper-button>
                </div>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-charts-dialog';
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
          patient: {
              type: Object,
              value: null
          },
          language: {
              type: String
          },
          opened: {
              type: Boolean,
              value: false
          },
          selectedItem: {
              type:  String,
              value: null
          },
          isLoading:{
              type: Boolean,
              value: false
          },
          activeItem: {
              type: Object,
              observer: '_activeItemChanged'
          },
          charts: {
              type: Array,
              value: () => []
          },
          tabs:{
              type: Number,
              value: 0
          }
      };
  }

  static get observers() {
      return [];
  }

  ready() {
      super.ready();

      this._labResults = [
          {
              id: "hemo",
              regex: /^HÉMOGLOBINE$/,
              series: [
                  {
                      label: "min",
                      value: "min",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  },
                  {
                      label: "max",
                      value: "max",
                      backgroundColor: "rgba(28,101,254,0.2)",
                      borderColor: "rgb(28,101,254)"

                  },
                  {
                      label: this.localize('chart-value', 'Value', this.language),
                      value: "value",
                      backgroundColor: "rgba(28,254,101,0.2)",
                      borderColor: "rgb(28,254,101)"
                  }
              ],
              samples: [ "HÉMOGLOBINE" ]
          },
          {
              id: "glycemia",
              regex: /^GLYCEMIE|GLYCÉMIE|GLYC,MIE/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "GLYCEMIE",
                  "GLYCEMIE 0'",
                  "GLYCEMIE (+00:00)",
                  "GLYCEMIE (+00:30)",
                  "GLYCEMIE (+01:00)",
                  "GLYCEMIE (+01:30)",
                  "GLYCEMIE (+02:00)",
                  "GLYCEMIE (+02:30)",
                  "GLYCEMIE (+03:00)",
                  "GLYCEMIE (+03:30)",
                  "GLYCEMIE (+04:00)",
                  "GLYCEMIE 120'",
                  "GLYCEMIE 120 MIN.",
                  "GLYCEMIE 120 MIN. (TEST AU LACTOSE)",
                  "GLYCEMIE 150'",
                  "GLYCEMIE 180'",
                  "GLYCEMIE 180 MIN.",
                  "GLYCEMIE 240 MIN.",
                  "GLYCEMIE 30'",
                  "GLYCEMIE 30 MIN.",
                  "GLYCEMIE 30 MIN. (TEST AU LACTOSE)",
                  "GLYCEMIE 60'",
                  "GLYCEMIE 60 MIN.",
                  "GLYCEMIE 60 MIN. (TEST AU LACTOSE)",
                  "GLYCEMIE 90'",
                  "GLYCEMIE 90 MIN.",
                  "GLYCEMIE A JEUN",
                  "GLYCEMIE A JEUN (TEST AU LACTOSE)",
                  "GLYCEMIE A (TEMPS)",
                  "GLYCEMIE A TOUTE HEURE",
                  "GLYCEMIE ESTIMEE (%HBA1C)",
                  "GLYCEMIE (FLUOR.)",
                  "GLYCEMIE (FLUOR) (OLD U.)",
                  "GLYCEMIE MOYENNE ESTIMEE",
                  "GLYCEMIE (Ó JEUN)",
                  "GLYCEMIE (PLASMA FLUORE)",
                  "GLYCEMIE PP 08h45",
                  "GLYCEMIE PP 16H02",
                  "GLYCEMIE SER.",
                  "GLYCEMIE (SERUM)",
                  "GLYCEMIE (SERUM) (OLD U.)",
                  "GLYCEMIE TEMPS 0 (13:44)",
                  "GLYCEMIE TEMPS 120 (13:44)",
                  "GLYCEMIE TEMPS 150 (13:44)",
                  "GLYCEMIE TEMPS 15 (13:44)",
                  "GLYCEMIE TEMPS 180 (13:44)",
                  "GLYCEMIE TEMPS 30 (13:44)",
                  "GLYCEMIE TEMPS 60 (13:44)",
                  "GLYCEMIE TEMPS 90 (13:44)",
                  "GLYCEMIE TPS 0'",
                  "GLYCEMIE TPS 120'",
                  "GLYCEMIE TPS 180'",
                  "GLYCEMIE TPS 30'",
                  "GLYCEMIE TPS 60'",
                  "GLYC,MIE",
                  "GLYC,MIE (1)",
                  "GLYC,MIE 120 MIN.",
                  "GLYC,MIE 120 MIN.(TEST AU LACTOSE)",
                  "GLYC,MIE 150 MIN",
                  "GLYC,MIE 180 MIN.",
              ]
          },
          {
              id: "cholesterol",
              regex: /^CHO-LDL|CHOLESTASE|CHOLESTEROL|CHOLEST,ROL|CHOLESTÚROL/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "CHO-LDL / CHO-HDL",
                  "CHOLESTASE",
                  "CHOLESTEROL",
                  "CHOLESTEROL HDL",
                  "CHOLESTEROL LDL",
                  "CHOLESTEROL LDL CALCULE",
                  "CHOLESTEROL LIE AUX L.D.L",
                  "CHOLESTEROL LIE AUX VLDL",
                  "CHOLESTEROL NON HDL",
                  "CHOLESTEROL TOTAL",
                  "CHOLESTEROL TOTAL/HDL",
                  "CHOLESTEROL TOT./HDL",
                  "CHOLEST,ROL",
                  "CHOLEST,ROL HDL",
                  "CHOLEST,ROL LDL",
                  "CHOLEST,ROL LDL CALCUL,",
                  "CHOLESTÚROL",
                  "CHOLESTÚROL HDL",
                  "CHOLESTÚROL LDL",
                  "CHOLESTÚROL LDL CALCULÚ",
                  "CHOLESTÚROL TOTAL",
                  "CHOLESTÚROL TOTAL/HDL",
                  "CHOLESTUROL NON HDL"
              ]
          },
          {
              id: "hba1c",
              regex: /^HB(81|\sA1C|C\sANTICORPS|\sGLYCOSYLEE|\sGLYCOSYL,E|\sGLYCOSYLÚE|\sGLYQUEE|S\sAG|S\sANTICORPS)]/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "HB81",
                  "HB A1C GLYCOSYLEE",
                  "HB A1C GLYCOSYLEE (DCCT)",
                  "HB A1C (IFCC)",
                  "HB A1C (NGSP/DCCT)",
                  "HB A1C (SI/IFCC)",
                  "HBC ANTICORPS",
                  "HB GLYCOSYLEE",
                  "HB GLYCOSYLEE (GLYQUEE)",
                  "HB GLYCOSYLEE IFCC",
                  "HB GLYCOSYLEE (NGSP)",
                  "HB GLYCOSYLEE (SI PAS DE DIABETE CONNU)",
                  "HB GLYCOSYL,E (GLYQU,E)",
                  "HB GLYCOSYL,E (IFCC)",
                  "HB GLYCOSYL,E (NGSP)",
                  "HB GLYCOSYLÚE (IFCC)",
                  "HB GLYCOSYLÚE (NGSP)",
                  "HB GLYQUEE (HBA1C-IFCC)",
                  "HB GLYQUEE (HBA1C-NGSP)",
                  "HBS AG",
                  "HBS ANTICORPS",
              ]
          },
          {
              id: "microalbumine",
              regex: /^MICROALB|MICRO-ALB/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "MICROALB./CREATININE",
                  "MICROALBUMINE",
                  "MICROALBUMINE/CREA",
                  "MICRO-ALBUMINURIE",
                  "MICRO-ALBUMINURIE / CREATININURIE",
                  "MICROALBUMINURIE D,BIT",
                  "MICROALBUMINURIE DEBIT",
                  "MICROALBUMINURIE / VOLUME",
              ]
          },
          {
              id: "vitamined",
              regex: /^VITAMINE\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "VITAMINE D",
                  "VITAMINE D 25-OH",
                  "VITAMINE D (25-OH-D)",
                  "VITAMINE D (25OH-D3)",
                  "VITAMINE D (25-OH-D3 ET D2)",
              ]
          },
          {
              id: "Creatinine",
              regex: /^CREATININE\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "Creatinine",
                  "CREATININE"
              ]
          },
          {
              id: "eGFR",
              regex: /^EGFR\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "eGFR",
                  "EGFR"
              ]
          },
          {
              id: "Ureum",
              regex: /^Ureum\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "Ureum",
                  "UREUM"
              ]
          },
          {
              id: "Urinezuur",
              regex: /^Urinezuur\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "Urinezuur",
                  "URINEZUUR"
              ]
          },
          {
              id: "Natrium",
              regex: /^Natrium\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "Natrium",
                  "NATRIUM"
              ]
          },
          {
              id: "Kalium",
              regex: /^Kalium\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "Kalium",
                  "KALIUM"
              ]
          },
          {
              id: "Chloor",
              regex: /^Chloor\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "Chloor",
                  "CHLOOR"
              ]
          },
          {
              id: "Calcium",
              regex: /^Calcium\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "Calcium",
                  "CALCIUM"
              ]
          },
          {
              id: "Fosfor",
              regex: /^Fosfor\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "Fosfor",
                  "FOSFOR"
              ]
          },
          {
              id: "PTH",
              regex: /^PTH\sD/,
              series: [
                  {
                      label: "value",
                      value: "value",
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }
              ],
              samples: [
                  "PTH",
                  "pth"
              ]
          }
      ]
  }

  apiReady() {
  }

  toggleMenu(e) {
      console.log(e);
      this.select(e.currentTarget.id);
  }

  isIronSelected(selected) {
      return selected ? 'iron-selected' : '';
  }

  select(id) {
      this.set('selectedItem', id);

      this.charts.forEach(chart => {
          const item = this.shadowRoot.querySelector("#" + chart.id);
          if (item) {
              item.setAttribute("aria-selected", chart.id == id ? "true" : "false");
              if (chart.id == id)
                  item.classList.add("iron-selected-2");
              else
                  item.classList.remove("iron-selected-2");
          }
      });

      let chart = this.charts.find(chart => chart.id == id);

      if (this.chart)
          this.chart.destroy();

      this.chart = new Chart(this.$['chart'], {
          type: chart.info.type,
          data: chart.info.data,
          options: {
              responsive: true,
              aspectRatio: 3,
                  maintainAspectRatio: false,
              cubicInterpolationMode: 'default',
              scales: {
                  yAxes: [{
                      id: 'y-log-axis',
                      type: 'linear'
                      //type: 'logarithmic'
                  }]
              }
          }
      });
  }

  attached() {
      super.attached();
      //this.async(this.notifyResize());
  }

  open(code) {
      this._code = code ? code : 'bmi';
      this.$['chartsDialog'].open();
      this._initialize();

      this.set("isLoading", true);
      this._timer = setTimeout(()=> {
          this.set("isLoading", false);
          this.select(this._code);
          clearTimeout(this._timer);
          this._timer = null;
      }, 1000);
  }

  _match(service, labResult) {
      const label = service.label.toUpperCase().replace(/\s+/g, " ");
      return (label.match(labResult.regex) || labResult.samples.includes(label));
  }

  _getContentValue(s, name) {
      return _.get(s, "content." + this.language + "." + name,
          _.get(s, "content.fr." + name, _.get(s, "content.measure." + name, null)));
  }

  _hasValue(s) {
      return !!this._getValue(s);
  }

  _getLabel(s) {
      return this.api.moment(_.get(s, 'valueDate', null)).format('DD/MM/YYYY');
  }
  _getServices() {
      return _.uniqBy(this.contacts.flatMap(contact => _.get(contact, 'services', [])), 'id');
  }

  _sort(services) {
      return services.sort((a,b) => this._compareValueDates(b.valueDate, a.valueDate));
  }

  _inWeeks(self, s, dateOfBirth) {
      return self.api.moment(s.valueDate).diff(dateOfBirth, 'weeks') < 13;
  }

  _inMonths(self, s, dateOfBirth) {
      return self.api.moment(s.valueDate).diff(dateOfBirth, 'months') < 60;
  }

  _getValues(code) {
      return _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services', []).filter(s => _.get(s, 'tags', [])))).map(s => s.tags.find(t => t.type === "CD-PARAMETER" && t.code === code) ? this._getValue(s) : null)) || [];
  }

  _compareValueDates(a, b) {
      return this.api.moment(b).diff(this.api.moment(a));
  }

  _newChart(id) {
      const services = this._sort(this._getServices().filter(s => this._hasTag(s, id) && this._hasValue(s)));
      return {
          id: id,
          name: this.localize('chart-' + id, id, this.language),
          info: {
              type: 'line',
              data: {
                  labels: services.map(s => this._getLabel(s)),
                  datasets: [{
                      label: this.localize('chart-' + id, id, this.language),
                      fillColor: "transparent",
                      data: services.map(s => this._getValue(s)),
                      lineTension: 0.1,
                      backgroundColor: "rgba(255,99,132,0.2)",
                      borderColor: "rgba(254,99,132,2)"
                  }]
              },
              options: {}
          }
      }
  }

  _initialize() {
      const bpValues = this._getBpValues();
      let charts = [
          this._newChart("bmi"),
          this._newChart("weight"),
          this._newChart("height"),
          {
              id: 'bp',
              name: this.localize('chart-bp', 'bp', this.language),
              info: {
                  type: 'line',
                  data: {
                      labels: bpValues.map(bp => this.api.moment(bp.valueDate).format('DD/MM/YYYY')),
                      datasets: [{
                          label: this.localize('chart-sbp', 'Systolic blood pressure', this.language),
                          fillColor: "transparent",
                          data: bpValues.map(bp => bp.sbp),
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"
                      }, {
                          label: this.localize('chart-dbp', 'Diastolic blood pressure', this.language),
                          fillColor: "transparent",
                          data: bpValues.map(bp => bp.dbp),
                          lineTension: 0.1,
                          backgroundColor: "rgba(28,101,254,0.2)",
                          borderColor: "rgb(28,101,254)"
                      }]
                  },
                  options: {}
              }
          }
      ];

      if (this.patient.gender === "male")
          this._createGrowthCharts(charts, "boys");
      if (this.patient.gender === "female")
          this._createGrowthCharts(charts, "girls");

      const contacts = this.contacts.filter(ctc => ctc.encounterType && ctc.encounterType.type === "CD-TRANSACTION" && ctc.encounterType.code === "labresult");
      this._labResults.forEach(labResult => {
          const services = _.uniqBy(contacts.flatMap(c => c.services.filter(s => this._match(s, labResult))), 'id');
          console.log(labResult.name + " " + services.length);
          if (services.length > 0) {
              services.sort((a,b) => this._compareValueDates(a.valueDate, b.valueDate));
              charts.push({
                  id: labResult.id,
                  name: this.localize('chart-' + labResult.id, labResult.id, this.language),
                  info: {
                      type: 'line',
                      data: {
                          labels: services.map(s => this.api.moment(s.valueDate).format('DD/MM/YYYY')),
                          datasets: labResult.series.map(serie => {
                              return {
                                  label: serie.label,
                                  fillColor: "transparent",
                                  data: _.compact(services.map(s => _.get(s.content.fr.measureValue, serie.value, null) ? _.get(s.content.fr.measureValue, serie.value, null) : _.get(s.content.measure.measureValue, serie.value, null) ? _.get(s.content.measure.measureValue, serie.value, null) : null)) || [],
                                  lineTension: 0.1,
                                  backgroundColor: serie.backgroundColor,
                                  borderColor: serie.borderColor
                              }
                          })
                      },
                      options: {}
                  }
              });
          };
      });

      this.set("charts", charts);
  }

  close() {
      this.$.dialog.close();
  }

  _closeDialogs(){
      this.$['chartsDialog'].close();
  }

  _print() {
      if (!this.chart || !this.selectedItem) return;
      const chart = this.charts.find(chart => chart.id == this.selectedItem);
      const title = chart.name;
      this.api.pdfReport(this._getHtml(title, this.chart.toBase64Image()), {type:"unknown",completionEvent:"pdfDoneRenderingEvent"})
          .then(printedPdf => !printedPdf.printed && this.api.triggerFileDownload(printedPdf.pdf, "application/pdf", title + ".pdf", this.$["chartsDialog"]))
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
                      .imageContainer img {width:auto; height:190mm;}
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

    _newGrowthChart(id, data, series, label, measures) {

      let datasets = series.map(serie => {
          return {
              label: this.localize('chart-' + serie.id, serie.id, this.language),
                  fillColor: "transparent",
                  data: data.map(d => d[serie.index]),
                  fill: false,
                  lineTension: 0.5,
                  borderDash: _.get(serie, "dash", []),
              borderWidth: _.get(serie, "width", 1),
              borderColor: _.get(serie, "color", "rgb(28,101,254)"),
              backgroundColor: _.get(serie, "backgroundColor", "rgb(28,101,254,0.2)"),
              pointRadius: 0,
              pointHitRadius: 0,
              pointBorderWidth: 0,
              spanGaps: true,
              cubicInterpolationMode: 'default'
          }
      })

        if (label && measures && measures.length) {
            datasets.push({
                label: this.localize(label, label, this.language),
                fillColor: "transparent",
                data: measures,
                fill: false,
                lineTension: 0.1,
                borderWidth: 2,
                borderColor: "rgb(28,101,254)",
                backgroundColor: "rgb(28,101,254,0.2)",
                spanGaps: true
            })
        }
        return {
            id: id,
                name: this.localize('chart-' + id, id, this.language),
            info: {
                type: 'line',
                data: {
                    labels: data.map(d => d[0]),
                    datasets: datasets,
                }
            }
        }
  }

  _createGrowthCharts(charts, gender) {
      const dateOfBirth = this.api.moment(this.patient.dateOfBirth);
      growthCurves.forEach(curve => {
          const name = gender + curve.id
          const filter = curve.period === "weeks" ? this._inWeeks : this._inMonths;
          const services = this._sort(this._getServices().filter(s => filter(this, s, dateOfBirth) && this._hasTag(s, curve.code) && this._hasValue(s)));
          if (services.length > 0) {
              const labels = services.map(s => s.valueDate);
              const values = services.map(s => this._getValue(s));
              const data = curves[name + "P"];
              let measures = data.map(d => null);
              labels.forEach((label, i) => {
                  const index = this.api.moment(label).diff(dateOfBirth, curve.period);
                  measures[index] = values[i];
              })
              charts.push(this._newGrowthChart(name, data, pSeries, curve.code, measures));
          }
      })
  }

  _getBpValues() {
      let values = [];
      const subContacts = this.contacts.flatMap(contact => _.get(contact, 'subContacts', []).filter(sc => sc.formId));
      const services = this._getServices().filter(s => (this._hasTag(s, "sbp") || this._hasTag(s, "dbp")) && this._hasValue(s));
      services.forEach(service => {
          const ids = subContacts.filter(sc => _.get(sc, 'services', []).some(s => s.serviceId === service.id)).map(sc => sc.formId);
          if (ids.length > 0) {
              const id = ids.sort((a, b) => a > b).toString();
              let value = values.find(v => v.id === id);
              if (!value) {
                  value = { id : id, sbp: null, dbp: null };
                  values.push(value);
              }
              value.valueDate = service.valueDate;
              value[this._hasTag(service, "sbp") ? "sbp" : "dbp"] = this._getValue(service);
          }
          else
              console.error("id(s) not found")
      })
        return values.sort((a, b) => this._compareValueDates(b.valueDate, a.valueDate));
  }

  _hasTag(s, code) {
      return _.get(s, 'tags', []).some(t => t.type === "CD-PARAMETER" && t.code === code);
  }
}
customElements.define(HtPatChartsDialog.is, HtPatChartsDialog);
