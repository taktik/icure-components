import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../dynamic-form/dynamic-doc.js';
import '../../../collapse-button/collapse-button.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/scrollbar-style.js';
import '../../../../styles/paper-tabs-style.js';
import moment from 'moment/src/moment';

import XLSX from 'xlsx'
import 'xlsx/dist/shim.min'

import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatPrimaryPreventionDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style paper-tabs-style">

            #preventionDialog{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 64px;
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

            .prev-error-container{
                height: auto;
                width: auto;
                color: var(--app-status-color-nok);
                font-weight: bold;
            }

            .prev-success-container{
                height: auto;
                width: auto;
                color: var(--app-status-color-ok);
                font-weight: bold;
            }

            .preventionDialog{
                display: flex;
                height: 100%;
                width: auto;
                margin: 0;
                padding: 0;
            }

            .prev-menu-list{
                height: 100%;
                width: 30%;
                background-color: var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
                overflow: auto;
                position: relative;
            }

            .prev-container{
                height: 100%;
                width: 70%;
                position: relative;
                background: white;
            }

            .prev-btn-left{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: auto;
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-items: center;
                padding: 8px 12px;
                box-sizing: border-box;
                border-top: 1px solid var(--app-background-color-dark);
                background: white;
            }

            .prev-btn-right{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: auto;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
                align-items: center;
                padding: 8px 12px;
                box-sizing: border-box;
                border-top: 1px solid var(--app-background-color-dark);
                background: white;
            }

            .prev-menu-search-line{
                display: flex;
            }

            paper-input {
                width: 100%;
                --paper-input-container-input: {
                    height: 22px;
                    font-size: var(--font-size-normal);
                    line-height: var(--font-size-normal);
                    padding: 0 8px;
                    box-sizing: border-box;
                    background: var(--app-input-background-color);
                    border-radius: 4px 4px 0 0;
                };
            }

            .mtm2{
                margin-top: -2px;
            }

            .w40{
                width: 40%;
            }

            .prev-historyResult{
                height: calc(100% - 100px);
                width: auto;
                overflow: auto;
            }


            paper-item {
                background: transparent;
                outline: 0;
                --paper-item-selected: {

                };

                --paper-item-disabled-color: {
                    color: red;
                };

                --paper-item-focused: {
                    background: transparent;
                };
                --paper-item-focused-before: {
                    background: transparent;
                };

            }

            .table-line-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }

            .table-line-menu-top{
                padding-left: var(--padding-menu-item_-_padding-left);
                padding-right: var(--padding-menu-item_-_padding-right);
                box-sizing: border-box;
            }

            .table-line-menu div:not(:last-child){
                border-right: 1px solid var(--app-background-color-dark);
                height: 20px;
                line-height: 20px;
            }

            .table-line-menu .firstName{
                width: 14%;
                padding-right: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .table-line-menu .lastName{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 25%;
            }

            .table-line-menu .birthDate{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 35%;
            }

            .table-line-menu .cp{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 10%;
            }

            .table-line-menu .gender{
                width: 12px;
                padding-right: 4px;
            }

            .table-line-menu .genderTit{
                width: 12px;
                padding-right: 4px;
                font-weight: bold;
            }

            .table-line-menu .firstNameTit{
                width: 14%;
                padding-right: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: bold;
            }

            .table-line-menu .lastNameTit{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 25%;
                font-weight: bold;
            }

            .table-line-menu .birthDateTit{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 35%;
                font-weight: bold;
            }

            .table-line-menu .cpTit{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 10%;
                font-weight: bold;
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

            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 0;
                padding:0;
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

            .genderIcon{
                height: 12px;
                width: 12px;
            }

            .prev-title{
                height: 50px;
                width: auto;
            }

            .prev-menu-list-header{
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

            .prev-menu-list-header-img{
                height: 40px;
                width: 40px;
                background-color: transparent;
                margin: 4px;
                float: left;
            }

            .prev-menu-list-header-info{
                margin-left: 12px;
                display: flex;
                align-items: center;
            }

            .prev-menu-list-header-img img{
                width: 100%;
                height: 100%;
            }

            .prev-name{
                font-size: var(--font-size-large);
                font-weight: 700;
            }

            .male{
                color: #0b97c4;
            }

            .female{
                color: deeppink;
            }

            .icon-button{
                height: 16px!important;
                width: 16px!important;
            }

            .m5{
                margin: 5px;
            }

            .mw0{
                min-width: 0
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

            .success{
                background-color: var(--app-status-color-ok);
            }

            .tabIcon{
                padding: 4px;
                height: 18px;
            }

            .notification-container{
                z-index: 1000!important;
            }

            .notification-msg{
                background: var(--app-status-color-ok)!important;
            }

            .prev-result-container{
                margin-bottom: 12px;
                border: 1px solid var(--app-background-color-dark);
            }

            .headerMasterTitle{
                font-size: var(--font-size-large);
                background: var(--app-background-color-dark);
                padding: 0 12px;
                box-sizing: border-box;
            }

            .prev-sub-container{
                height: auto;
                width: auto;
                margin: 10px;
                border: 1px solid var(--app-background-color-dark);
            }

            .prev-person-container{
                height: auto;
                width: auto;
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

            .w10{
                width: 9%;
            }

            .w20{
                width: 19%;
            }

            .w30{
                width: 29%;
            }

            .w40{
                width: 39%;
            }

            .w50{
                width: 49%;
            }

            .w60{
                width: 59%;
            }

            .w70{
                width: 69%;
            }

            .w80{
                width: 79%;
            }

            .headerLabel{
                font-weight: bold;
            }

            .prevention-error{
                color: var(--app-status-color-nok)
            }

            .prevention-line{
                width: 100%;
                display: flex;
            }

            .p4{
                padding: 4px;
            }

            .mw30{
                min-width: 29%;
            }

            .reminder{
                padding-left: 4px;
                padding-right: 4px;
                font-weight: bold;
                display: flex;
                width: 60px;
            }

            .reminderCol{
                width: 16px;
                padding: 2px;
            }

            .reminderIcon{
                width: 16px;
                height: 16px;
            }

            .m4{
                margin: 4px;
            }


        </style>

        <paper-dialog id="preventionDialog">
            <div class="preventionDialog">
                <div class="prev-menu-list">
                    <div class="prev-menu-list-header">
                        <div class="prev-menu-list-header-info">
                            <div class="prev-name">
                                [[localize('prev-crea-prev-act', 'Create prevention acts', language)]] ([[_getNbOfPatient(selectedPatientForPrevention)]])
                            </div>
                        </div>
                    </div>
                    <div class="prev-historyResult">
                        <div class="table-line-menu">
                            <div class="lastNameTit">[[localize('prev-lastName','Lastname',language)]]</div>
                            <div class="firstNameTit">[[localize('prev-firstName','Firstname',language)]]</div>
                            <div class="birthDateTit">[[localize('prev-birthDate','Birth date',language)]]</div>
                        </div>
                        <template is="dom-repeat" items="[[selectedPatientForPrevention]]" as="pat">
                            <div class="table-line-menu">
                                <div class="lastName">[[pat.patient.lastName]]</div>
                                <div class="firstName">[[pat.patient.firstName]]</div>
                                <div class="birthDate">[[_formatDateOfBirth(pat.patient.dateOfBirth)]]</div>
                                <div class="reminder">
                                    <div class="reminderCol">
                                        <template is="dom-if" if="[[_isAvailableForEmail(pat.patient)]]">
                                            <iron-icon class="reminderIcon" icon="vaadin:envelopes-o"></iron-icon>
                                        </template>
                                    </div>
                                    <div class="reminderCol">
                                        <template is="dom-if" if="[[_isAvailableForSms(pat.patient)]]">
                                            <iron-icon class="reminderIcon" icon="vaadin:mobile"></iron-icon>
                                        </template>
                                    </div>
                                    <div class="reminderCol">
                                        <template is="dom-if" if="[[_isAvailableForPublipostage(pat.patient)]]">
                                            <iron-icon class="reminderIcon" icon="vaadin:mailbox"></iron-icon>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="prev-container">
                    <div class="">
                        <paper-tabs selected="{{tabs}}">
                            <paper-tab id="viewerTab">
                                <iron-icon class="tabIcon" icon="vaadin:male"></iron-icon> [[localize('tra_vwr','Viewer',language)]]
                            </paper-tab>
                        </paper-tabs>
                        <iron-pages selected="[[tabs]]">
                            <page>
                                <div class="m4">
                                    <div class="prevention-line">
                                        <vaadin-combo-box class="w100 p4" filtered-items="[[listOfClinicalPlan]]" item-label-path="label.[[language]]" item-value-path="id" id="prevention-list" label="Type de prévention*" value="{{prevention.clinicalPlanId}}"></vaadin-combo-box>
                                    </div>
                                    <div class="prevention-line">
                                        <vaadin-combo-box class="w70 p4" filtered-items="[[filteredProcedures]]" item-label-path="label.[[language]]" item-value-path="id" id="procedures-list" filter="{{procedureFilter}}" label="[[localize('prev-proc', 'Procedure', language)]]*" value="{{prevention.procedureId}}"></vaadin-combo-box>
                                        <vaadin-date-picker class="mw30 p4 m4" id="date-picker" label="[[localize('prev-deadline', 'Deadline', language)]]*" value="{{prevention.deadline}}" i18n="[[i18n]]" on-value-changed="_checkIsDeadline"></vaadin-date-picker>
                                    </div>
                                    <div class="prevention-line">
                                        <vaadin-text-area class="w100 p4" id="cpa_description" label="Description" value="{{prevention.description}}"></vaadin-text-area>
                                    </div>
                                    [[localize('prev-reminder', 'Reminder', language)]] <vaadin-checkbox checked="[[isReminderActive]]" on-checked-changed="_reminderCheckChanged"></vaadin-checkbox>
                                    <template is="dom-if" if="[[isReminderActive]]">
                                        <div class="prevention-line">
                                            <vaadin-combo-box class="w100 p4" filtered-items="[[remindType]]" item-label-path="label.[[language]]" item-value-path="code" id="remindType-list" selected-item="{{selectedReminderType}}" label="[[localize('prev-reminder-type', 'Reminder type', language)]]" value="{{prevention.remindType}}"></vaadin-combo-box>
                                        </div>
                                    </template>
                                </div>
                                <div class="prevention-error m4">
                                    <template is="dom-repeat" items="[[errorList]]">
                                        <div>
                                            [[localize(item.code, item.label, language)]]
                                        </div>
                                    </template>
                                </div>
                            </page>
                        </iron-pages>
                    </div>
                    <ht-spinner active="[[isLoading]]"></ht-spinner>
                    <div class="prev-btn-right">
                        <paper-button class="button" on-tap="_closeDialog"><iron-icon icon="icons:close" class="mr5 smallIcon"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                        <paper-button class="button button--save" on-tap="_sendPrevention"><iron-icon icon="icons:send" class="mr5 smallIcon"></iron-icon> [[localize('cre','Create',language)]]</paper-button>
                    </div>
                </div>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-primary-prevention-dialog';
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
          selectedPatientForPrevention:{
              type: Array,
              value: () => []
          },
          proceduresListItem:{
              type: Array,
              value: []
          },
          tabs:{
              type: Number,
              value: 0
          },
          listOfProcedures:{
              type: Array,
              value: []
          },
          procedureFilter:{
              type: String,
              value: null
          },
          filteredProcedures:{
              type: Array,
              value: () => []
          },
          prevention: {
              type: Object,
              value: () => {}
          },
          remindType:{
              type: Array,
              value: () => [
                  //{label: {fr:'Par sms', nl:'Bij sms', en:'By sms'}, code: "sms"},
                  //{label: {fr:'Par email', nl:'Bij mail', en:'By email'}, code:"mail"},
                  //{label: {fr:'Publipostage pdf', nl:'Bij Pdf', en:'By Pdf'}, code:"pdf"},
                  {label: {fr:'Par liste Excel', nl:'Bij Excel', en:'By Excel'}, code:"xlsx"}
              ]
          },
          listOfClinicalPlan:{
              type: Array,
              value: () => []
          },
          errorList:{
              type: Array,
              value: () => []
          },
          isReminderActive:{
              type: Boolean,
              value: false
          },
          selectedReminderType:{
              type: Object,
              value: () => {}
          },
          reminderInfo:{
              type: Array,
              value: () => []
          },
          isLoading:{
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return ['_procedureFilterChanged(procedureFilter)', '_selectedReminderTypeChanged(selectedReminderType)'];
  }

  ready() {
      super.ready();
  }

  openPreventionDialog(){
      this.api.code().findCodes("be", "BE-THESAURUS-PROCEDURES").then(listOfProc => {
          this.set('listOfProcedures',listOfProc.map(p => _.assign(p, {
              normalizedSearchTerms: _.map(_.uniq(_.compact(_.flatten(_.concat([_.get(p, _.trim('label.'+this.language), ""), _.get(p, 'code', ""), _.get(p, 'searchTerms.'+this.language, "")])))), i =>  _.trim(i).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")).join(" ")
          })))
      }).then(() => this.api.code().findCodes("be", "CD-CLINICALPLAN"))
          .then(listOfClinicalPlan => this.set('listOfClinicalPlan', listOfClinicalPlan.filter(cp => cp.code !== "gmdplus")))
          .finally(() => {
          this.set('prevention', {
              title: null,
              clinicalPlanId: null,
              procedureId: null,
              deadline: null,
              linkedProfession: null,
              description: null,
              remindType: _.get(this, 'remindType', []).find(rt => rt.code === "xlsx"),
              label: 'Actes'
          })
          this.set("reminderInfo", {
              sms: {
                  availablePatient: this.selectedPatientForPrevention.filter(p => _.get(p, 'patient.addresses', []).find(adr => _.get(adr, 'telecoms', []).find(tel => _.get(tel, 'telecomType', null) === 'mobile' && _.get(tel, 'telecomNumber', null) !== '' && _.get(tel, 'telecomNumber', null) !== null)))
              },
              mail:{
                  availablePatient: this.selectedPatientForPrevention.filter(p => _.get(p, 'patient.addresses', []).find(adr => _.get(adr, 'telecoms', []).find(tel => _.get(tel, 'telecomType', null) === 'email' && _.get(tel, 'telecomNumber', null) !== '' && _.get(tel, 'telecomNumber', null) !== null)))
              },
              xlsx:{
                  availablePatient: this.selectedPatientForPrevention.filter(p => _.get(p, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home" && _.get(adr, 'street', null) !== "" && _.get(adr, 'street', null) !== null))
              }
          })
          this.set('filterdProcedure', this.listOfProcedures)
          this.$['preventionDialog'].open()
      })

  }

  _closeDialog(){
      this.set('prevention', {})
      this.set('errorList', [])
      this.set('isReminderActive', false)
      this.$['preventionDialog'].close()
  }

  _procedureFilterChanged(){
      if(this.procedureFilter){
          const keywordsString = _.trim(_.get(this,"procedureFilter","")).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
          const keywordsArray = _.compact(_.uniq(_.map(keywordsString.split(" "), i=>_.trim(i))))
          setTimeout(() => {
              if(parseInt(_.get(keywordsString,"length",0)) > 2) {
                  const proceduresSearchResults =  _.chain(_.get(this, "listOfProcedures", []))
                      .chain(_.get(this, "procedureFilter", []))
                      .filter(i => _.size(keywordsArray) === _.size(_.compact(_.map(keywordsArray, keyword => _.trim(_.get(i, "normalizedSearchTerms", "")).indexOf(keyword) > -1))))
                      .compact()
                      .uniq()
                      .orderBy(['code', 'label.' + this.language, 'id'], ['asc', 'asc', 'asc'])
                      .value()
                  this.set('filteredProcedures', _.sortBy(proceduresSearchResults, ['code', 'label.' + this.language, 'id'], ['asc', 'asc', 'asc']))
              }else{
                  this.set('filteredProcedures', _.sortBy(this.listOfProcedures, ['code', 'label.'+this.language, 'id'], ['asc', 'asc', 'asc']))
              }
          }, 100)
      }
  }

  _sendPrevention(){
      console.log(this.prevention)
      this.set('isLoading', true)
      this.set('errorList', [])
      let prom = Promise.resolve()

      if(_.get(this.prevention, 'deadline', null) && _.get(this.prevention, 'procedureId', null)){
          this.selectedPatientForPrevention.map(pat => {
              if(pat.check === true){
                  prom = prom.then(listOfContact => {
                      return this.api.patient().getPatientWithUser(this.user, pat.id).then(pat => Promise.all([pat, this.api.contact().newInstance(this.user, pat, {
                          created: +new Date,
                          modified: +new Date,
                          author: _.trim(_.get(this,"user.id","")),
                          responsible: _.trim(_.get(this,"user.healthcarePartyId","")),
                          openingDate: parseInt(moment().format("YYYYMMDDhhmmss")),
                          closingDate: parseInt(moment().format("YYYYMMDDhhmmss")),
                          encounterType: { type: "CD-TRANSACTION", version: "1", code: 'request' },
                          descr: 'Echéance collective: '+!!_.trim(_.get(this, 'prevention.description', null)) ? _.trim(_.get(_.get(this, 'listOfProcedures', []).find(proc => _.get(proc, 'id', null) === _.get(this.prevention, 'procedureId', "")), 'label.'+this.language, null)) : _.trim(_.get(this, 'prevention.description', null)),
                          tags: [
                              { type: 'CD-TRANSACTION', code: 'request'},
                              {
                                  id: _.get(this.listOfClinicalPlan.find(cp => cp.id === _.get(this.prevention, 'clinicalPlanId', null)), 'id' , null),
                                  type: _.get(this.listOfClinicalPlan.find(cp => cp.id === _.get(this.prevention, 'clinicalPlanId', null)), 'type' , null),
                                  code: _.get(this.listOfClinicalPlan.find(cp => cp.id === _.get(this.prevention, 'clinicalPlanId', null)), 'code' , null),
                                  version: _.get(this.listOfClinicalPlan.find(cp => cp.id === _.get(this.prevention, 'clinicalPlanId', null)), 'version' , null)
                              }
                          ],
                          services: []
                      })])).then(([pat, ctc]) => Promise.all([pat, ctc, this.api.contact().service().newInstance(this.user, {
                          content: _.fromPairs([[this.language, {
                              stringValue: _.trim(_.get(_.get(this, 'listOfProcedures', []).find(proc => _.get(proc, 'id', null) === _.get(this.prevention, 'procedureId', "")), 'label.'+this.language, null))
                          }]]),
                          label: _.get(this.prevention, "label", "Actes"),
                          comment: _.trim(_.get(this.prevention, 'description', null)),
                          valueDate: _.get(this.prevention, 'deadline', null) ? parseInt(_.padEnd(this.api.moment(_.get(this.prevention, 'deadline', null)).format('YYYYMMDD'), 14, 0)) : null,
                          codes: [
                              {
                                  id: _.get(this.listOfProcedures.find(proc => proc.id === this.prevention.procedureId), 'id', null),
                                  type: _.get(this.listOfProcedures.find(proc => proc.id === this.prevention.procedureId), 'type', null),
                                  code:  _.get(this.listOfProcedures.find(proc => proc.id === this.prevention.procedureId), 'code', null),
                                  version:  _.get(this.listOfProcedures.find(proc => proc.id === this.prevention.procedureId), 'version', null)
                              }
                          ],
                          tags: [
                              { type: 'CD-TRANSACTION', code: 'request'},
                              { type: 'CD-LIFECYCLE', code:'proposed'},
                              {
                                  id: _.get(this.listOfClinicalPlan.find(cp => cp.id === _.get(this.prevention, 'clinicalPlanId', null)), 'id' , null),
                                  type: _.get(this.listOfClinicalPlan.find(cp => cp.id === _.get(this.prevention, 'clinicalPlanId', null)), 'type' , null),
                                  code: _.get(this.listOfClinicalPlan.find(cp => cp.id === _.get(this.prevention, 'clinicalPlanId', null)), 'code' , null),
                                  version: _.get(this.listOfClinicalPlan.find(cp => cp.id === _.get(this.prevention, 'clinicalPlanId', null)), 'version' , null)
                              }
                          ]
                      })])).then(([pat, ctc, svc]) => {
                          ctc.services.push(svc)
                          return Promise.all([pat, this.api.contact().createContactWithUser(this.user, ctc)])
                      }).then(([pat, ctc]) => _.concat(listOfContact, {contact: ctc, patient: pat}))
                  })
              }
          })


          prom = prom.then(listOfContact => {
              if(_.get(this, 'isReminderActive', null)){
                  if(_.get(this.selectedReminderType, 'code', null) === "xlsx"){
                      Promise.resolve(this.exportXslxList())
                  }else if(_.get(this.selectedReminderType, 'code', null) === "sms"){
                      _.compact(listOfContact).map(ctc => {
                          const mobilePhone = ctc.patient.addresses.map(a => (a.addressType === 'home' || a.addressType === 'work') && a.telecoms.map(t=>t.telecomType === 'mobile' && t.telecomNumber).filter(x=>x)[0]).filter(x=>x)[0]
                          _.get(this.prevention, 'remindType', null) === 'sms' ? (mobilePhone && fetch(`https://msg-gw.svcacc.icure.cloud/luta/sms/to/${mobilePhone}`,{
                              method: "POST",
                              headers: { "Content-Type" : "application/json" },
                              body: JSON.stringify({message: _.get(this.prevention, 'description', null)})
                          })) : null
                      })
                  }else if(_.get(this.selectedReminderType, 'code', null) === "mail"){

                  }else if(_.get(this.selectedReminderType, 'code', null) === "pdf"){
                      Promise.resolve(this._generatePdfForPublipostage())
                  }
              }
          }).finally(() => {
              this.set('isLoading', false)
              this._closeDialog()
              this.dispatchEvent(new CustomEvent('close-prevention', {detail : null, bubbles: true, composed: true}))
          })

      }else{
          !_.get(this.prevention, 'clinicalPlanId', null) ? this.push('errorList', {code: 'prev-crea-err-clinPlan', label: "Clinical plan must be completed"}) : null
          !_.get(this.prevention, 'deadline', null) ? this.push('errorList', {code: 'pre-crea-err-deadline', label: " Deadline must be completed"}) : null
          !_.get(this.prevention, 'procedureId', null) ? this.push('errorList', {code: 'pre-crea-err-procedure', label: "Procedure must be completed"}) : null
      }
  }

  exportXslxList(){
      this.generateXlsFile(_.get(this, "selectedPatientForPrevention", []).map(pat => {
          return {
              [this.localize('ext_id_short', 'Dossier', this.language)]: _.get(pat, 'patient.externalId', null),
              [this.localize('las_nam', 'Last name', this.language)]: _.get(pat, 'patient.lastName', null),
              [this.localize('fir_nam', 'First name', this.language)]: _.get(pat, 'patient.firstName', null),
              [this.localize('birthDate', 'Birth date', this.language)]: _.get(pat, 'patient.dateOfBirth', null) ? this.api.moment(_.get(pat, 'patient.dateOfBirth', null)).format("DD/MM/YYYY") : null,
              [this.localize('phone', 'Phone', this.language)]: _.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'telecoms', []).find(tel => tel.telecomType === "mobile" || tel.telecomType==="phone")), "telecomNumber", null),
              [this.localize('postalAddress', 'Postal address', this.language)]: _.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "houseNumber", null)+" "+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "street", null)+" "+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "postalCode", null)+" "+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "city", null)+" "+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "country", null),
              [this.localize('email', 'Email', this.language)]: _.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'telecoms', []).find(tel => tel.telecomType === "email")), "telecomNumber", null),
              [this.localize('ssin', 'Ssin', this.language)]: _.get(pat, 'patient.ssin', null),
              [this.localize('gender', 'Gender', this.language)]:  this.localize(_.get(pat, 'patient.gender', null), _.get(pat, 'patient.gender', null), this.language),
              [this.localize('proc', 'Proc', this.language)]: _.get(_.get(this, 'listOfProcedures', []).find(proc => _.get(proc, 'id', null) === _.get(this.prevention, 'procedureId', "")), 'label.'+this.language, null)
          }
      }), "prevention_" +moment().format("YYYYMMDD-HHmmss")+ ".xls", "Liste prévention", "Topaz")
  }

  generateXlsFile(data, filename, title, author) {

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

      return
  }

  _getNbOfPatient(selectedPatient){
      return _.size(selectedPatient)
  }

  _formatDateOfBirth(date){
      return date ? this.api.moment(date).format("DD/MM/YYYY") : null
  }

  _reminderCheckChanged(e){
      this.set('isReminderActive', _.get(e, 'target.checked', false))
  }

  _selectedReminderTypeChanged(){
      if(_.isEmpty(_.get(this, 'selectedReminderType', {}))){

      }
  }

  _isAvailableForSms(pat){
      return !!_.get(pat, 'addresses', []).find(adr => _.get(adr, 'telecoms', []).find(tel => _.get(tel, 'telecomType', null) === 'mobile' && _.get(tel, 'telecomNumber', null) !== '' && _.get(tel, 'telecomNumber', null) !== null))
  }

  _isAvailableForEmail(pat){
      return !!_.get(pat, 'addresses', []).find(adr => _.get(adr, 'telecoms', []).find(tel => _.get(tel, 'telecomType', null) === 'email' && _.get(tel, 'telecomNumber', null) !== '' && _.get(tel, 'telecomNumber', null) !== null))
  }

  _isAvailableForPublipostage(pat){
      return !!_.get(pat, 'addresses', []).find(adr => _.get(adr, 'addressType', null) === "home" && _.get(adr, 'street', null) !== "" && _.get(adr, 'street', null) !== null)
  }

    _generatePdfForPublipostage(){
      let pdfTemplate = ""
        pdfTemplate+="<html>"
        pdfTemplate+="  <head>"
        pdfTemplate+="  <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet'>"
        pdfTemplate+="     <style>"
        pdfTemplate+="       @page {size: A4; width: 210mm; height: 297mm; margin: 0; padding: 0}"
        pdfTemplate+="       body {margin: 0; padding: 0; font-family: /* 'Open Sans', */ Arial, Helvetica, sans-serif; line-height:1em;}"
        pdfTemplate+="       .title{height: 20px; font-size: 14px; width: 100%;}"
        pdfTemplate+="       .sub-title{height: 15px; font-size: 12px; width: 100%;}"
        pdfTemplate+="       .separator{height: 2px; width: 100%; border-bottom: 1px solid black;}"
        pdfTemplate+="       .page {width: 210mm; color:#000000; font-size:12px; padding:10mm; position:relative;}"
        pdfTemplate+="       .textaligncenter { text-align: center; } .textalignleft { text-align: left; } .textalignright { text-align: right; }"
        pdfTemplate+="       .b{font-weight: bold}"
        pdfTemplate+="       .mutuality-block{border: 1px solid black; width: 100%; height: auto;}"
        pdfTemplate+="       .date-signature{height: 30px; width: 100%;}"
        pdfTemplate+="       .border{border: 1px solid black;}"
        pdfTemplate+="       .s14{font-size: 10px;}"
        pdfTemplate+="       .s10{font-size: 10px;}"
        pdfTemplate+="       .s9{font-size: 9px;}"
        pdfTemplate+="       .condition-block{height: 150px;}"
        pdfTemplate+="       .stamp-date-signature-title{width: 100%}"
        pdfTemplate+="       .stamp-date-signature{width: 100%; height: 55px;}"
        pdfTemplate+="       .check{height: 10px; width: 10px; background-color; black;}"
        pdfTemplate+="       .uncheck{height: 10px; width: 10px;}"
        pdfTemplate+="     </style>"
        pdfTemplate+="  </head>"
        pdfTemplate+="  <body>"
        _.get(this, "selectedPatientForPrevention", []).map(pat => {
            pdfTemplate += " <div class='page'>"
            pdfTemplate += "    <div>"
            pdfTemplate += "        <div>"+_.get(pat, 'patient.gender', null) === "male" ? "Monsieur " : "Madame " + " " + _.get(pat, 'patient.lastName', null) + " " + _.get(pat, 'patient.firstName', null) + "</div>"
            pdfTemplate += "        <div>"+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "houseNumber", null)+" "+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "street", null)+"</div>"
            pdfTemplate += "        <div>"+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "postalCode", null)+" "+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "city", null)+"</div>"
            pdfTemplate += "        <div>"+_.get(_.get(pat, 'patient.addresses', []).find(adr => _.get(adr, 'addressType', null) === "home"), "country", null)+"</div>"
            pdfTemplate += "    </div>"
            pdfTemplate += "    <div>"
            pdfTemplate += "      <div class='s14'>" + _.get(pat, 'patient.gender', null) === "male" ? "Monsieur " : "Madame " + " " + _.get(pat, 'patient.lastName', null) + " " + _.get(pat, 'patient.firstName', null) + ", </div>"
            pdfTemplate += "      <div class='s14'>"
            pdfTemplate += "          <div>Vous avez entre 50 et 74 ans, vous êtes concerné !.</div>"
            pdfTemplate += "          <div>A partir de 50 ans, le risque de développer un cancer colorectal est plus fréquent.</div>"
            pdfTemplate += "          <div>Le dépistage, tous les 2 ans, est un moyen efficace de lutter contre ce cancer et de le détecter tôt, permettant ainsi de meilleures chances de guérison. Il est même possible de repérer dans certains cas une lésion précancéreuse et de la soigner avant qu'elle n'évolue en cancer.</div>"
            pdfTemplate += "          <div>Votre médecin généraliste</div>"
            pdfTemplate += "      </div>"
            pdfTemplate += "    </div>"
            pdfTemplate += " </div>"
        })
        pdfTemplate+=       '<'+'script'+'>'+'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <'+'/script'+'>'
        pdfTemplate+="  </body>"
        pdfTemplate+="</html>"
        this.api.pdfReport(pdfTemplate, {type:"unknown",completionEvent:"pdfDoneRenderingEvent"})
            .then(printedPdf => !printedPdf.printed && this.api.triggerFileDownload( printedPdf.pdf, "application/pdf", _.kebabCase(_.trim(_.get(this,"_data.content.dateYYYYMMDD",moment().format("YYYYMMDD"))) + "-" +_ .trim(_.get(this,"_data.content.title",this.api.crypto().randomUuid()))) + ".pdf" ))
  }
}
customElements.define(HtPatPrimaryPreventionDialog.is, HtPatPrimaryPreventionDialog);
