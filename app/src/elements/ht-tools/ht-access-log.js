import '../qrcode-manager/qrcode-printer.js';
import '../ht-spinner/ht-spinner.js';
import '../../styles/dialog-style.js';
import '../../styles/buttons-style.js';
import '../../styles/spinner-style.js';

import moment from 'moment';
import XLSX from 'xlsx';
import _ from 'lodash';

import {TkLocalizerMixin} from "../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtExportKey extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style buttons-style spinner-style">
            paper-dialog {
                width: 90%;
                height: 90%;
                max-height: none !important;
                display: flex;
                flex-direction: column;
            }

            h3.modal-title {
                margin: 0;
            }

            div {
                width : 100%;
            }

            div.content {
                display: grid;
                flex-direction: column;
                grid-template-columns: 500px auto;
            }

            vadin-grid {
                width : 100%;
                flex-grow: 1 !important;
                height: auto !important;
            }

            paper-input{
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .col-left {
                height: 100%;
                background: var(--app-background-color-dark);
                box-shadow: var(--shadow-elevation-3dp_-_box-shadow);
                grid-column: 1/2;
                grid-row: 1/1;
                z-index: 3;
                margin-top: 0px;
                padding-left: 5px;
                padding-top: 5px;
                box-sizing: border-box;
                overflow-y: auto;
            }

            .list-box{
                height: calc(100% - 65px);
                overflow-y: auto;
            }

            .col-right {
                height: 100%;
                background: var(--app-background-color);
                /*box-shadow: var(--shadow-elevation-2dp_-_box-shadow);*/
                border-bottom: 1px solid var(--app-background-color-dark);
                margin: 0;
                grid-column: 2/2;
                grid-row: 1/1;
                z-index: 2;
                overflow-y: auto;
                padding: 24px;
                box-sizing: border-box;
            }

            .log-text{
                padding : 0px;
                width: 100%;
                display : flex;
            }
            .log-text-col{
                max-widt: 250px;
            }
            .tab-right{
                height: calc(100% - 30px);
            }

            paper-checkbox {
                --primary-color: var(--paper-indigo-500);
                margin: 0 24px;
            }

            paper-checkbox{
                --paper-checkbox-checked-color: var(--app-secondary-color);
            }

            ht-spinner{
                height: 35px;
                width: 35px;
            }

            .spinner {
                position: absolute;
                top: 0%;
                left: 0%;
            }

            .none{
                display : none;
                height: 18px;
            }

            .hover-icon:hover *{
                display : inline-flex;
            }

            .filters{
                display: flex;
            }

            #startDate, #endDate{
                margin-left: 8px;
                margin-top: 15px;
            }
        </style>
        <paper-dialog id="dialog" opened="{{opened}}">
            <h2 class="modal-title">Access log</h2>
            <div class="content">
                <div class="col-left">
                    <template is="dom-if" if="[[loadingLogs]]">
                        <div class="loadingContentContainer"><ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner></div>
                    </template>
                    <div class="filters">
                        <paper-input id="filter" label="[[localize('fil','Filter',language)]]" value="{{filterValue}}" on-keydown="refresh" disabled="[[isDisabled(exportMode,needMorePatient)]]"></paper-input>
                        <vaadin-date-picker id="startDate" i18n="[[i18n]]" value="{{startDate}}" max="[[endDate]]" label="[[localize('from2', 'Du', language)]]"></vaadin-date-picker>
                        <vaadin-date-picker id="endDate" i18n="[[i18n]]" value="{{endDate}}" min="[[startDate]]" label="[[localize('to2', 'Au', language)]]"></vaadin-date-picker>
                    </div>
                    <div class="list-box">
                        <paper-listbox id="_log_listbox" focused="" selectable="paper-item" selected="{{selected}}">
                            <div class="log-text">
                                <div class="log-text-col hover-icon" id="date" data-item\$="date" on-tap="sortList">[[localize('dat','date',language)]]<iron-icon data-item\$="date" class="none" icon="[[getIcon('date',lastSort,asc)]]"></iron-icon></div>
                                <div class="log-text-col hover-icon" id="user" data-item\$="user" on-tap="sortList">[[localize('persphysicianRole','Prestataire',language)]]<iron-icon data-item\$="user" class="none" icon="[[getIcon('user',lastSort,asc)]]"></iron-icon></div>
                                <div class="log-text-col hover-icon" id="patient" data-item\$="patient" on-tap="sortList">[[localize('pat','Patients',language)]]<iron-icon data-item\$="patient" class="none" icon="[[getIcon('patient',lastSort,asc)]]"></iron-icon></div>
                            </div>
                            <template is="dom-repeat" items="[[displayedLogList]]">
                                <paper-item class="log-text">
                                    <div class="log-text-col">
                                        <template is="dom-if" if="[[exportMode]]">
                                            <paper-checkbox role="check" index="[[getIndex(item,logList.*)]]" on-checked-changed="setListExport"></paper-checkbox>
                                        </template>
                                        [[item.date]]
                                    </div>
                                    <div class="log-text-col">[[item.user]]</div>
                                    <div class="log-text-col">[[item.patient]]</div>
                                </paper-item>
                            </template>
                            <template is="dom-if" if="[[canGetMore(loadingLogs,exportMode,needMoreLogs)]]">
                                <paper-item class="log-text">
                                    <div class="log-text-col"></div>
                                    <div class="log-text-col"><paper-button class="button button--other spinner" on-tap="getMoreAccess">[[localize('more','More',language)]]</paper-button></div>
                                    <div class="log-text-col"></div>
                                </paper-item>
                            </template>
                        </paper-listbox>
                    </div>
                </div>
                <div class="col-right">
                    <template is="dom-if" if="[[selectedLog]]">
                        <div class="header-selected">[[_getSelectedLogTitle(selectedLog,selectedLog.*)]]</div>
                        <vaadin-grid items="[[selectedLog.logs]]" class="tab-right">
                            <vaadin-grid-column>
                                <template class="header">
                                    <vaadin-grid-sorter path="date">
                                        [[localize('hour','heure',language)]]
                                    </vaadin-grid-sorter>
                                </template>
                                <template>
                                    [[convertDate(item.date)]]
                                </template>
                            </vaadin-grid-column>
                            <vaadin-grid-column>
                                <template class="header">
                                    [[localize('action','Action',language)]]
                                </template>
                                <template>
                                    [[_getDetail(item)]]
                                </template>
                            </vaadin-grid-column>
                        </vaadin-grid>
                    </template>
                </div>
            </div>
            <div class="buttons">
                <template is="dom-if" if="[[exportMode]]">
                    <paper-button class="button button--other" on-tap="export">[[localize('can','Cancel',language)]]</paper-button>
                    <paper-button class="button button--other" on-tap="launchExport">[[localize('valid','Valid',language)]]</paper-button>
                </template>
                <template is="dom-if" if="[[!exportMode]]">
                    <paper-button class="button button--other" disabled="[[loadingLogs]]" on-tap="export">[[localize('export','Export',language)]]</paper-button>
                </template>
                <paper-button class="button" on-tap="close">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {/**@todo faire les translate ^^*/
      return 'ht-access-log';
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
          opened: {
              type: Boolean,
              value: false
          },
          logList: {
              type : Array,
              value : []
          },
          displayedLogList: {
              type : Array,
              value : []
          },
          listPatient :{
              type : Array,
              value : []
          },
          filterValue : {
              type : String,
              value : "",
              observer : "filterValueChanged"
          },
          latestSearchValue : {
              type : String,
              value : ""
          },
          selectedLog:{
              type : Object,
              value : null
          },
          selected:{
              type: Object,
              value : null,
              observer : 'selectedChanged'
          },
          exportMode:{
              type: Boolean,
              value: false
          },
          exportLogList:{
              type:Array,
              value: []
          },
          users:{
              type: Array,
              value: []
          },
          documentPatients:{
              type: Object,
              value: {}
          },
          needMorePatient: {
              type: Boolean,
              value: false,
              observer: 'needMorePatientChanged'
          },
          usersList:{
              type: Array,
              value: []
          },
          extraPatientsList:{
              type: Array,
              value: []
          },
          needMoreLogs:{
              type: Boolean,
              value: false
          },
          loadingLogs:{
              type: Boolean,
              value: false
          },
          lastSort:{
              type: String,
              value: 'date'
          },
          asc:{
              type: Boolean,
              value: true
          },
          startDate:{
              type: String,
              value: ""
          },
          endDate:{
              type: String,
              value: ""
          },
          listMoreAccess:{
              type: Object,
              value: {}
          },
          searchDate:{
              type: String,
              value: ""
          },
          i18n: {
              type: Object
          }
      };
  }

  static get observers(){
      return ['_setDisplayedLogList(logList.*)','_setSearchDate(endDate,startDate)']
  }

  open() {
      this.$.dialog.open();
      this.api.user().listUsers().then(users=> this.set('users',users.rows))
  }

  close() {
      this.$.dialog.close();
  }

  convertDate(date){
      return date ? this.api.moment(date).format("DD/MM/YYYY HH:mm:ss") : "inconnu"
  }

  updateList() {
      if (!this.user || !this.api || this.filterValue.length<2) return
      this.set("loadingLogs",true)
      this.set('selected', null)
      this.set('selectedLog', null)
      //patients
      this.set("documentPatients",{})
      this.set("needMorePatient",true)
      this.set("patientsList",[])

      this.set("logList",[])
      const prom = []
      this.api.setPreventLogging();
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
          .then(hcp => this.recurciveParent(hcp,prom,this.user))
          .then(()=>{
              Promise.all(prom).then(p =>{
                  this.set("needMorePatient",false)
              }).finally(()=>{
                  this.api.setPreventLogging(false);
              })
          })
  }

  recurciveParent(hcp,prom,user){
      prom.push(this.listingPatients(user))
      if(hcp.parentId){
          return Promise.all([this.api.hcparty().getHealthcareParty(hcp.parentId),this.api.user().findByHcpartyId(hcp.parentId)])
              .then(([newHcp,userId]) => Promise.all([Promise.resolve(newHcp),this.api.user().getUser(userId)]))
              .then(([newHcp,newUser])=>this.recurciveParent(newHcp,prom,newUser))
      }
      return Promise.resolve({})
  }

  getMoreAccess(){
      this.set("selected",null)
      this.set("selectedLog",null)
      this.set("loadingLogs",true)
      this.listingAccessByUser(this.filterValue,this.searchDate)
          .then(logs => this.format(logs))
  }

  _setSearchDate(){
      const old = this.searchDate || moment().format("YYYY-MM-DD")
      let prom = Promise.resolve({})
      if(this.startDate && moment(this.startDate).isBefore(moment(old,"YYYY-MM-DD"))){
          this.set("searchDate",this.startDate)
      }
      else if(this.endDate && moment(this.endDate,"YYYY-MM-DD").isBefore(moment(old,"YYYY-MM-DD"))){
          this.set("searchDate",this.endDate)
      }
      if(old !== this.searchDate){
          prom = this.listingAccessByUser(this.filterValue,this.searchDate).then(logs => this.format(logs))
      }

      prom.then(log => this._setDisplayedLogList())
  }

  listingPatients(user){
      if(!this.user)return;
      let latestSearchValue = this.filterValue
      this.latestSearchValue = latestSearchValue

      this.api.setPreventLogging();
      const filter = /^[0-9]{11}$/.test(latestSearchValue) ? {
          '$type': 'PatientByHcPartyAndSsinFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'ssin': latestSearchValue
      } : /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(latestSearchValue) ? {
          '$type': 'PatientByHcPartyDateOfBirthFilter',
          'healthcarePartyId': user.healthcarePartyId,
          'dateOfBirth': latestSearchValue.replace(/([0-3]?[0-9])[\/-](1[0-2]|0?[0-9])[\/-]((?:[1-2][89012])?[0-9][0-9])/g, (correspondance, p1, p2, p3, decalage, chaine) => (p3.length === 4 ? p3 : (p3 > 20) ? "19" + p3 : "20" + p3) + (p2.length === 2 ? p2 : "0" + p2) + (p1.length === 2 ? p1 : "0" + p1))
      } : /^([1-2][89012])?[0-9][0-9]([\/-])?(1[0-2]|0?[0-9])([\/-])?[0-3]?[0-9]$/.test(latestSearchValue) ? {
          '$type': 'PatientByHcPartyDateOfBirthFilter',
          'healthcarePartyId': user.healthcarePartyId,
          'dateOfBirth': latestSearchValue.replace(/^((?:[1-2][89012])?[0-9][0-9])(?:[\/-])?(1[0-2]|0?[0-9])(?:[\/-])?([0-3]?[0-9])$/g, (correspondance, p1, p2, p3, decalage, chaine) => (p1.length === 4 ? p1 : (p1 > 20) ? "19" + p1 : "20" + p1) + (p2.length === 2 ? p2 : "0" + p2) + (p3.length === 2 ? p3 : "0" + p3))
      } : {
          '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
          'healthcarePartyId': user.healthcarePartyId,
          'searchString': latestSearchValue
      }

      console.log(filter)

      return this.api.patient().filterByWithUser(user, _.get(this,"documentPatients."+user.id+".startKey",null),_.get(this,"documentPatients."+user.id+".startKeyDocId",null), 1000, 0, 'lastName', true, {filter: filter}).then(patients =>{
          this.set("patientsList",_.uniqBy(this.patientsList.concat(patients.rows),"id"))
          if(patients.rows.length<1000){
              this.set("documentPatients."+user.id,{startKey:null,startKeyDocId:null})
          }else{
              this.set("documentPatients."+user.id,patients.nextKeyPair)
              this.set("needMorePatient",true)
              this.api.setPreventLogging(false);
              return this.listingPatients()
          }
      })
  }

  needMorePatientChanged(){
      if(this.needMorePatient)return;
      this.set("logList",[]);
      this.set("needMoreLogs",false)
      this.set('usersList', this.users.filter(user=> _.lowerCase(_.get(user,'name','')).includes(_.lowerCase(this.filterValue)) || _.lowerCase(_.get(user,'email','')).includes(_.lowerCase(this.filterValue))))
      this.set('extraPatientsList',[])
      this.set('listMoreAccess',{})
      Promise.all([
          this.listingAccessByUser(this.filterValue,this.searchDate),
          this.listingAccessByPatient(this.filterValue)
      ]).then(([logsUser,logsPat])=>{
          this.format(_.uniqBy(_.flattenDeep([logsUser|| [],logsPat || []]),"id"))
      })

  }

  listingAccessByUser(filter,date){
      if(filter!==this.filterValue || date!==this.searchDate ||!this.user) return Promise.resolve([]);

      if(this.usersList.length){
          return Promise.all(this.usersList.filter(user => !_.get(this.listMoreAccess,user.id,false) || _.get(this.listMoreAccess,user.id+'.needMoreLogs',false)).map(user => {
              return this.api.accesslog().findByUserAfterDateWithUser(this.user,user.id,'USER_ACCESS',this.searchDate ? moment(this.searchDate).unix()*1000 : +new Date() - 1000 * 3600 * 24 * 31,_.get(this.listMoreAccess,user.id+'.startKey',null),_.get(this.listMoreAccess,user.id+'.startDocumentId',null),1000,true)
                  .then(logs =>{
                      if(!logs.nextKeyPair || logs.rows.length<1000){
                          this.listMoreAccess[user.id].needMoreLogs=false
                      }else{
                          this.listMoreAccess[user.id]={
                              needMoreLogs:true,
                              startKey : logs.nextKeyPair.startKey,
                              startKeyDocId : logs.nextKeyPair.startKeyDocId
                          }
                      }
                      return logs.rows
                  })
          })).then(logsByUser=>{
              const logs = _.flatten(logsByUser)
              this.set("needMoreLogs",!!this.usersList.find(user => !_.get(this.listMoreAccess,user.id,false) || _.get(this.listMoreAccess,user.id+'.needMoreLogs',false)))
              if(logs.length<50 && this.usersList.find(user => !_.get(this.listMoreAccess,user.id,false) || _.get(this.listMoreAccess,user.id+'.needMoreLogs',false))){
                  return this.listingAccessByUser(filter,date).then(newLogs => newLogs.concat(logs))
              }
              return logs
          }).catch(err => {
              return Promise.resolve([]);
          })
      }
      return Promise.resolve([]);
  }

  listingAccessByPatient(filter){
      if(filter!==this.filterValue || !this.user)return;
      return Promise.all(this.patientsList && this.patientsList.length ? this.patientsList.map(pat => this.api.accesslog().findBy(this.user.healthcarePartyId,pat)) : [])
          .then(logsByPatient => {
              return logsByPatient && logsByPatient.length ? logsByPatient : []
          })
          .catch(err => {
              return Promise.resolve([]);
          })
  }

  setLinkPatient(logs){
      if(!this.user)return;
      return Promise.all(logs.map(log => this.api.crypto().extractCryptedFKs(log, this.user.healthcarePartyId).then(ids =>{
          log.patientId= log.patientId || ids.extractedKeys[0];
          return log;
      })))
  }

  format(logsWithoutPatient){
      if(!this.user)return;
      this.api && this.api.setPreventLogging();
      this.setLinkPatient(logsWithoutPatient).then(logs =>{
          const logListTemp=logs.filter(log=> this.patientsList.find(pat=> pat.id===log.patientId) || this.usersList.find(user => user.id===log.user))

          this.user && this.api.patient().getPatientsWithUser(this.user,{ids:_.uniq(_.flattenDeep(logListTemp.filter(log => !this.patientsList.find(pat=> log.patientId===pat.id) && !this.extraPatientsList.find(pat=> log.patientId===pat.id)).map(log => log.patientId)))}).then(extraPatients =>{
              this.set('extraPatientsList',this.extraPatientsList.concat(extraPatients))
              const logByPatient = _.groupBy(logListTemp,log=> log.patientId)
              const newLogs=_.flatMapDeep(Object.keys(logByPatient).map(patId =>{
                  const patient = this.patientsList.find(pat=> pat.id===patId) || this.extraPatientsList.find(pat=> patId===pat.id)
                  const logByUser=_.groupBy(logByPatient[patId],log=> log.user)
                  return Object.keys(logByUser).map(userId =>{
                      const logByDate = _.groupBy(logByUser[userId],log => this.api.moment(log.date).format("DD/MM/YYYY"))
                      return Object.keys(logByDate).map(date =>{
                          return{
                              logs : logByDate[date].map(log => {
                                  return {
                                      detail : log.detail,
                                      date: log.date,
                                      id : log.id
                                  }
                              }),
                              date : date,
                              userId : userId,
                              patientId : patId,
                              patient : patient ? patient.lastName + " " + patient.firstName : this.localize("unknow","Inconnu"),
                              user : (this.users.find(user=> user.id===userId)|| {name: this.localize("unknow","Inconnu")}).name
                          }
                      })
                  })
              }))

              const grouped =  _.groupBy(_.concat(newLogs,this.logList),log=> log.userId+"/"+log.patientId+"/"+log.date)
              this.set("logList",Object.keys(grouped).map(key=> grouped[key].length ? grouped[key].reduce((acc,val) => _.mergeWith(acc||{},val,(objValue, srcValue)=>{
                  if (_.isArray(srcValue)) {
                      return _.compact(srcValue.concat(objValue));
                  }
                  return srcValue;
              })) : _.first(grouped[key])).map(formatedLog => {
                  return {
                      logs : _.uniqBy(formatedLog.logs,"id"),
                      date : formatedLog.date,
                      userId : formatedLog.userId,
                      patientId : formatedLog.patientId,
                      patient : formatedLog.patient,
                      user : formatedLog.user
                  }
              }))

              this.sortList();
          }).finally(()=> {
              this.set("loadingLogs", false)
              this.api.setPreventLogging(false);
          })
      }).finally(()=> {
          this.set("loadingLogs", false)
          this.api.setPreventLogging(false);
      })


  }

  filterValueChanged(){
      //Give the gui the time to update the field
      setTimeout(function () {
          let currentValue = this.filterValue;

          if(this.latestSearchValue===this.filterValue){
              return;
          }

          setTimeout(function () {
              if (currentValue === this.filterValue) {
                  console.log("Triggering search for " + this.filterValue);
                  this.updateList();
              } else {
                  console.log("Skipping search for " + this.filterValue + " != " + currentValue);
              }
          }.bind(this), 500); //Wait for the user to stop typing
      }.bind(this), 100);
  }

  _getSelectedLogTitle(){
      return this.localize("log_title_header","Log du")+" "+this.selectedLog.date+" "+this.localize('perBy','par')+" "+this.selectedLog.user+" "+this.localize('log_title_ending','sur le patient')+" "+this.selectedLog.patient;
  }

  selectedChanged(){
      if((!this.selected && this.selected!==0)|| this.exportMode)return;
      this.set("selectedLog",this.logList[this.selected])
  }

  _getDetail(item){
      return (item.detail && this.localize(item.detail,item.detail)) || this.localize('log_info','ancien systeme de log => ouverture du patient')
  }

  export(){
      this.set("exportLogList",[])
      this.set("exportMode",!this.exportMode)
  }

  launchExport(){
      const data =_.flatMapDeep(this.exportLogList.map(idxToExport => this.logList[idxToExport].logs.map(log =>{
          const data={}
          data[this.localize("dat","dat")] = this.convertDate(log.date)
          data[this.localize("praticien","Praticien")] = this.logList[idxToExport].user
          data[this.localize("patient","Patient")] = this.logList[idxToExport].patient
          data[this.localize("action","Action")] = this._getDetail(log)
          return data
      })))
      this.set("exportLogList",[])
      this.set("exportMode",false)
      this.generateXlsFile(data);
  }

  generateXlsFile(data) {

      // Create xls work book and assign properties
      const xlsWorkBook = {SheetNames: [], Sheets: {}}
      xlsWorkBook.Props = {Title: "AccessLog List", Author: "Topaz"}

      // Create sheet based on json data collection
      var xlsWorkSheet = XLSX.utils.json_to_sheet(data)

      // Link sheet to workbook
      XLSX.utils.book_append_sheet(xlsWorkBook, xlsWorkSheet, 'AccessLog List')

      // Virtual data output
      var xlsWorkBookOutput = new Buffer(XLSX.write(xlsWorkBook, {bookType: 'xls', type: 'buffer'}))

      this.api.triggerFileDownload(xlsWorkBookOutput, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  "accessLog_list_" + moment().format("YYYYMMDD-HHmmss") + ".xls",this.$["dialog"])
  }

  getIndex(item){
      return this.logList.findIndex(log => log===item)
  }

  setListExport(e){
      e.stopPropagation()
      const idx=this.exportLogList.find(it => it===e.target.index)
      if(idx>-1 && !e.detail.value){
          this.exportLogList.splice(idx, 1);
      }
      else if(e.detail.value){
          this.push("exportLogList",e.target.index)
      }
  }

  isDisabled(){
      return this.exportMode || this.needMorePatient
  }

  canGetMore(){
      return !this.loadingLogs && !this.exportMode && this.needMoreLogs
  }

  sortList(e){
      this.set("asc", _.get(e, 'currentTarget.dataset.item$', false) && _.get(e, 'currentTarget.dataset.item$', false)===this.lastSort ? !this.asc : true)
      this.set("lastSort",_.get(e, 'currentTarget.dataset.item$', this.lastSort))

      const logList= this.logList;
      this.set('logList',[])
      this.set("logList",logList.sort((a,b)=>{
          if(this.lastSort==="date"){
              return parseInt(moment(a[this.lastSort],"DD/MM/YYYY").format("YYYYMMDD"))<parseInt(moment(b[this.lastSort],"DD/MM/YYYY").format("YYYYMMDD"))? this.asc ? 1 : -1 : parseInt(moment(a[this.lastSort],"DD/MM/YYYY").format("YYYYMMDD"))>parseInt(moment(b[this.lastSort],"DD/MM/YYYY").format("YYYYMMDD")) ? this.asc ? -1 : 1 : 0
          }
          else {
              return _.lowerCase(a[this.lastSort])>_.lowerCase(b[this.lastSort])? this.asc ? 1 : -1 : _.lowerCase(a[this.lastSort])<_.lowerCase(b[this.lastSort]) ? this.asc ? -1 : 1 : 0
          }
      }))
  }

  getIcon(div){
      return div===this.lastSort && !this.asc ? "icons:arrow-drop-down" : "icons:arrow-drop-up";
  }

  _setDisplayedLogList(){
      this.set("displayedLogList",this.logList.filter(log => {
          if(this.startDate || this.endDate){
              const oneDate= this.startDate || this.endDate
              if(this.startDate && this.endDate){
                  return moment(log.date,"DD/MM/YYYY").isBetween(moment(this.startDate),moment(this.endDate) ,null, '[]')
              }
              else{
                  return moment(log.date,"DD/MM/YYYY").isSame(moment(oneDate),"day")
              }
          }
          return true;
      }))
  }
}
customElements.define(HtExportKey.is, HtExportKey);
