import '../dynamic-form/dynamic-subcontact-type-selector.js';
import '../pdf-element/pdf-element.js';
import '../../styles/buttons-style.js';
import '../../styles/dialog-style.js';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-dialog/paper-dialog"
import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-date-picker/vaadin-date-picker"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"
import "@vaadin/vaadin-text-field/vaadin-text-field"
import "@vaadin/vaadin-upload/vaadin-upload"

import _ from 'lodash/lodash';
import moment from 'moment/src/moment';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtMsgImportDocDialog extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="buttons-style dialog-style">
            .buttons{
                display: flex;
                flex-grow: 1;
                box-sizing: border-box;
                padding: 16px 12px 8px 16px;
            }

            paper-dialog {
                min-width:1024px;
                margin: 0;
                display : flex;
                height: 80%;
                min-height: 400px;
                --main-height: 80vh;
            }

            .input-form{
                width : 100%;
                height: 40px;
            }

            vaadin-upload{
                margin-bottom: 5px;
                height: 40px;
                max-height: 40px;
                background: var(--app-background-color);
                --vaadin-upload-buttons-primary: {
                    height: 28px;
                };
                --vaadin-upload-button-add: {
                    border: 1px solid var(--app-secondary-color);
                    color: var(--app-secondary-color);
                    background: transparent;
                    font-weight: 500;
                    font-size: var(--font-size-normal);
                    height: 28px;
                    padding: 0 12px;
                    text-transform: capitalize;
                    background: transparent;
                    box-sizing: border-box; 
                    border-radius: 3px;
                };
                --vaadin-upload-file-progress: {
                    display:none;
                    --paper-progress-active-color:var(--app-secondary-color);
                };
                --vaadin-upload-file-commands: {
                    display:none;
                    color: var(--app-primary-color);
                };
                --vaadin-upload-drop-label:{
                    display: none;
                }
            }

            vaadin-text-field{
                height: 40px;
                margin-top: -20px;
            }
            #importTextField,#hcpCombo,#typeCombo{
                width: 100%;
            }
            #importPicker,#docPicker{
                width: calc(50% - 2px);
            }
            #PatCombo {
                width: calc(60% - 2px);
            }
            #NissTextField{
                width: calc(40% - 2px);
            }
            .panel{
                width: calc(50% - 2px);
            }
            #visual-panel{
                min-width: 600px;
                /*height: 100%*/
            }
            #import-buttons{
                /*height: calc(20% - 2px);*/
            }
            #doc-list{
                height: calc(80% - 2px);
            }
            vaadin-upload paper-button{
                @apply --button;
                @apply --button--other;
            }
            vaadin-grid.material {

                font-family: Roboto, sans-serif;
                --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                --vaadin-grid-cell: {
                    padding: 8px;
                };

                --vaadin-grid-header-cell: {
                    height: 64px;
                    color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                    font-size: var(--font-size-large);
                };

                --vaadin-grid-body-cell: {
                    height: 48px;
                    color: rgba(0, 0, 0, var(--dark-primary-opacity));
                    font-size: var(--font-size-normal);
                };

                --vaadin-grid-body-row-hover-cell: {
                    background-color: var(--paper-grey-200);
                };

                --vaadin-grid-body-row-selected-cell: {
                    background-color: var(--paper-grey-100);
                };

                --vaadin-grid-focused-cell: {
                    box-shadow: none;
                    font-weight: bold;
                };
            }

            vaadin-grid.material .cell {
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 0;
            }

            vaadin-grid.material .cell.last {
                padding-right: 24px;
            }

            .img-container{
                padding: 20px;
                align-self: center;
                display:flex;
                justify-content: center;
                align-items: center;
                background-color:  rgb(113, 135, 146);
            }

            .img-container img{
                height: calc(var(--main-height) - 80px);
                max-width: 600px;
            }

            .modalDialog {
                height: 300px;
                width: 600px;
            }




        </style>
        <paper-dialog id="upload-dialog">
            <div id="list-panel" class="panel">
                <div id="import-buttons">
                    <template is="dom-if" if="[[_hasScanners(hasElectron,scannerList)]]">
                        <div class="buttons">
                            <paper-button class="button" on-tap="_launchScan">[[localize('scan','Scan',language)]]</paper-button>
                            <vaadin-combo-box id="scannerList" filtered-items="[[scannerList]]" item-label-path="label" item-value-path="id" label="[[localize('scanners','Scanners',language)]]" value="{{selectedScanner}}"></vaadin-combo-box>
                        </div>
                    </template>
                    <vaadin-upload id="vaadin-upload" no-auto="" files="{{files}}" accept="video/*,image/*,application/pdf,text/xml,application/xml,text/plain" form-data-name="attachment"></vaadin-upload>
                </div>
                <vaadin-grid id="doc-list" class="" items="[[docList]]" active-item="{{selectedDoc}}">
                    <vaadin-grid-column>
                        <template class="header">
                            <div class="cell frozen">[[localize('type-doc','Type',language)]]</div>
                        </template>
                        <template>
                            <template is="dom-if" if="[[!item.isScanned]]">
                                <iron-icon icon="icons:file-upload"></iron-icon>
                            </template>
                            <template is="dom-if" if="[[item.isScanned]]">
                                <iron-icon icon="hardware:scanner"></iron-icon>
                            </template>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <div class="cell frozen">[[localize('title-doc','Titre',language)]]</div>
                        </template>
                        <template>
                            <div>[[item.title]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div id="visual-panel" class="panel">
                <template is="dom-if" if="[[selectedDoc]]">
                    <template is="dom-if" if="[[!isPdf]]">
                        <div class="img-container">
                            <img src="[[selectedData]]" alt="">
                        </div>
                    </template>
                    <template is="dom-if" if="[[isPdf]]">
                        <pdf-element id="pdfElement" min-height="600" src="[[selectedData]]"></pdf-element>
                    </template>
                </template>
            </div>
            <div id="form-panel" class="panel">
                <div id="form">
                    <h2>[[localize('upl_fil','Upload files',language)]]<span class="extra-info">(PDF, images and videos)</span></h2>
                    <div class="input-form">
                        <vaadin-text-field id="importTextField" label="[[localize('docTitle','Titre du document',language)]]" value="{{selectedDoc.title}}"></vaadin-text-field>
                    </div>
                    <div class="input-form">
                        <vaadin-date-picker id="importPicker" label="[[localize('import_date','Date d\\'importation',language)]]" value="{{selectedDoc.importDate}}" i18n="[[i18n]]" disabled=""></vaadin-date-picker>
                        <vaadin-date-picker id="docPicker" label="[[localize('doc_date','Date du document',language)]]" value="{{selectedDoc.docDate}}" i18n="[[i18n]]"></vaadin-date-picker>
                    </div>
                    <div class="input-form">
                        <vaadin-combo-box id="hcpCombo" filtered-items="[[listHcp]]" on-filter-changed="_filterHcpChanged" item-label-path="name" item-value-path="id" label="[[localize('hcp','Medecin',language)]]" value="{{selectedDoc.hcp}}">
                        </vaadin-combo-box>
                    </div>
                    <div class="input-form">
                        <vaadin-combo-box id="typeCombo" filtered-items="[[listType]]" item-label-path="name" item-value-path="code" label="[[localize('type-doc','Type de document',language)]]" value="{{selectedDoc.type}}">
                        </vaadin-combo-box>
                    </div>
                    <div class="input-form">
                        <vaadin-combo-box id="PatCombo" filter="{{filterPatient}}" label="[[localize('pat-name','Nom du patient',language)]]" filtered-items="[[listPat]]" item-label-path="name" item-value-path="id" value="{{selectedDoc.patientId}}" disabled="[[patientDisabled]]"></vaadin-combo-box>
                        <vaadin-text-field id="NissTextField" label="[[localize('ssin','NISS',language)]]" value="{{selectedDoc.patientSsin}}" disabled="[[patientDisabled]]"></vaadin-text-field>
                    </div>
                </div>
                <div class="buttons">
                    <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--other" on-tap="delete">[[localize('del-it','Supprimer',language)]]</paper-button>
                    <!--<paper-button class="button" on-tap="saveAll">[[localize('save-all','Tout sauver',language)]]</paper-button>-->
                    <paper-button class="button button--save" on-tap="saveEvent"><iron-icon icon="save"></iron-icon>[[localize('save','Enregistrer',language)]]</paper-button>
                </div>
            </div>
        </paper-dialog>
        <paper-dialog class="modalDialog" id="error-message-box" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <h2 class="modal-title">
                <iron-icon icon="icons:warning"></iron-icon>
                [[localize('warning','Warning',language)]]
            </h2>
            <div class="content">
                <h3 class="textAlignCenter">
                    [[errorTitle]]
                </h3>
                <p class="textAlignCenter m-t-20">
                    [[errorMessage]]
                </p>
                <p class="textAlignCenter m-t-20">
                    [[errorDetail]]
                </p>
            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="closeErrorMessageBoxEvent">
                    [[localize('clo','Close',language)]]
                </paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-msg-import-doc-dialog';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              observer: "apiReady"
          },
          doc: {
              type: Boolean,
              value: true
          },
          user: {
              type: Object,
              observer : "_userChanged"
          },
          patient: {
              type: Object,
              observer : "_patientChanged"
          },
          docList:{
              type: Array,
              value: ()=>[]
          },
          selectedDoc:{
              type: Object
          },
          files: {
              type: Array
          },
          isLoadingDoc: {
              type: Boolean,
              value: false
          },
          documentMetas: {
              type: Object,
              value: null
          },
          selectedScanner:{
              type : String,
              value : ""
          },
          scannerList:{
              type: Array,
              value : ()=> []
          },
          hasElectron:{
              type: Boolean,
              value : false,
              observer: '_hasElectronChanged'
          },
          listHcp :{
              type : Array,
              value: ()=>[]
          },
          listPat:{
              type : Array,
              value: ()=>[]
          },
          filterPatient:{
              type:String,
              value:""
          },
          listType:{
              type: Array,
              value: ()=>[]
          },
          patientDisabled:{
              type: Boolean,
              value:false
          },
          selectedData:{
              type: Object,
              value: null
          },
          isPdf: {
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return [
          '_filesChanged(files.*)',
          "_selectedDocChanged(selectedDoc.*)",
          "_filterPatChanged(filterPatient)",
          "_patientIdChanged(selectedDoc.patientId)",
          "_patientNissChanged(selectedDoc.patientSsin)"
      ];
  }

  constructor() {
      super();
  }

  ready() {
      super.ready();
      this.addEventListener();
  }

  apiReady(){
      this.api && this.api.isElectronAvailable().then(electron => this.set("hasElectron",electron))
      return !!_.size(_.get(this,"listType",[])) ? null : this.api.getDocumentTypes(this.resources, this.language).then(documentTypes => this.set("listType", documentTypes))
  }

  _hasElectronChanged(){
      if(!this.hasElectron)return;
      Promise.all([fetch("http://127.0.0.1:16042/scanning",{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
              request : "list"
          })
      }), fetch('http://127.0.0.1:16042/getPrinterSetting', {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
              userId: this.user.id
          })
      })
      ]).then(response => Promise.all(response.map(rep=>rep.json()))).then(([data, settings])=>{
          if(!data.ok)return;
          const scanner = settings && settings.data && settings.data !== 'error' && JSON.parse(settings.data).find(set => set.type==="scanner")
          this.set("selectedScanner", scanner && data.data.all.find(scan => scan.id===scanner.printer || scan.label===scanner.printer) ? scanner.printer :data.data.default.id)
          this.set("scannerList",data.data.all)
      })
  }

  _updateView() {
      let type = _.toLower(this.selectedDoc.extension);
      let base64 = btoa([].reduce.call(new Uint8Array(this.selectedDoc.fileBlob), (p,c) => p+ String.fromCharCode(c),''));
      if (type === 'jpeg' || type === 'jpg' || type ==="PNG" || type ==="png") {
          this.set('isPdf', false);
          this.set('selectedData', 'data:image/jpeg;base64,' + base64);
      } else if (type === 'tif' || type === 'tiff') {
          this.set('isPdf', false);
          this.set('selectedData', 'data:image/tiff;base64,' + base64);
      } else if (type === 'pdf') {
          this.set('selectedData',base64);
          this.set('isPdf', true);
      }
  }

  _selectedDocChanged(){
      if(!this.selectedDoc){
          this.set('isPdf', false);
          //this.set('selectedData',"");
          return;
      }
      console.log("selected doc changed =",this.selectedDoc)

      if(!this.listHcp.find(hcp => this.selectedDoc.hcp===hcp.id)){
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(tempHcp => {
              this.push("listHcp",{
                  id:tempHcp.id,
                  name:tempHcp.name || tempHcp.firstName+" "+tempHcp.lastName || tempHcp.id})
          })
      }

      this.api.patient().filterByWithUser(this.user, null, null, 50, null, null, true, {
          filter: {
              '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
              'healthcarePartyId': this.selectedHcp,
              'searchString': this.filterPatient
          }
      }).then(pats =>{
          pats.rows.map(pat =>{
              this.push("listPat",{
                  id : pat.id,
                  name : pat.firstName+" "+pat.lastName || pat.id,
                  ssin : pat.ssin
              })
          })
      })
      this.$['doc-list'].clearCache()
      this._updateView();
  }

  _userChanged(){
      if(!this.user)return;
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(tempHcp => {
          this.push("listHcp",{
              id:tempHcp.id,
              name:tempHcp.name || tempHcp.firstName+" "+tempHcp.lastName || tempHcp.id})
      })
  }

  _patientChanged(){
      if(!this.patient)return;
      this.push("listPat",{
          id:this.patient.id,
          name:this.patient.firstName+" "+this.patient.lastName || this.patient.id,
          ssin : this.patient.ssin})
      this.set("patientDisabled",true)
  }

  _patientIdChanged(){
      if(!this.selectedDoc)return;
      (this.listPat.find(pat =>  pat.id===this.selectedDoc.patientId)||{ssin:""}).ssin!==this.selectedDoc.patientSsin && this.set("selectedDoc.patientSsin",(this.listPat.find(pat => pat.id===this.selectedDoc.patientId)||{ssin:""}).ssin)
  }

  _patientNissChanged(){
      if(!this.selectedDoc)return;
      if(!this.selectedDoc.patientSsin || !this._validSsin(this.selectedDoc.patientSsin)) return;
      const found =this.listPat.find(pat => pat.ssin===this.selectedDoc.patientSsin)
      if(found){
          this.selectedDoc.patientId!==found.id && this.set("selectedDoc.patientId",found.id)
      }
      else{
          this.api.patient().filterByWithUser(this.user,null,null,10,null,null,"desc",{
              filter: {
                  '$type': 'PatientByHcPartyAndSsinFilter',
                  'healthcarePartyId': this.selectedHcp,
                  'ssin': this.selectedDoc.patientSsin
              }
          }).then(pats => {

              pats.rows.map(pat => this.push("listPat",{
                  id: pat.id,
                  name: pat.firstName + " " + pat.lastName || pat.id,
                  ssin: pat.ssin
              }))
              this.set("selectedDoc.patientId",this.listPat.find(pat => pat.ssin===this.selectedDoc.patientSsin).id)
          })
      }
  }

  _filterHcpChanged(e){
      if(!e.detail.value)return;
      this.api.hcparty().findByName(e.detail.value,null,null,100,"desc").then(hcps =>{
          this.set("listHcp",hcps.rows.map(hcp =>{
              return {
                  id : hcp.id,
                  name : hcp.name ||  hcp.firstName+" "+hcp.lastName || hcp.id
              }
          }))
      })
  }

  _filterPatChanged(e){
      if(!this.filterPatient)return;
      this.api.patient().filterByWithUser(this.user, null, null, 50, null, null, true, {
          filter: {
              '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
              'healthcarePartyId': this.user.healthcarePartyId,
              'searchString': this.filterPatient
          }
      }).then(pats =>{
          this.set("listPat",pats.rows.map(pat =>{
              return {
                  id : pat.id,
                  name : pat.firstName+" "+pat.lastName || pat.id,
                  ssin : pat.ssin
              }
          }))
      })
  }

  _validSsin(ssin) {
      return ssin && ssin.length > 9;
  }

  _hasScanners(){
      return this.hasElectron && this.scannerList && this.scannerList.length;
  }

  _isScannedFile(document){
      return document.isScanned
  }

  _launchScan(){
      fetch("http://127.0.0.1:16042/scanning",{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
              request : "scan",
              scanner : this.selectedScanner
          })
      }).then(response => response.json()).then(response => {
          if (!response.ok) return;

          let document = {
              isScanned : true,
              title : "scanned doc n°"+this.docList.filter(doc=> doc.isScanned).length,
              fileBlob: this.api.crypto().utils.base64toArrayBuffer(response.data.base64),
              importDate : moment().format("YYYY-MM-DD"),
              docDate : moment().format("YYYY-MM-DD"),
              hcp : this.user.healthcarePartyId,
              type : "",
              extension: "pdf",
              patientId : this.patient ? this.patient.id : "",
              patientSsin : this.patient ? this.patient.ssin : ""
          }
          this.push("docList",document)
          this.set("selectedDoc",document)
      })
  }

  _encryptInfo(message, info) {
      if (!message.metas)
          return Promise.reject('Invalid message structure');
      try {
          return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, message, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(JSON.stringify(info))))
              .then(encrypted => {
                  message.metas.cryptedInfo = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
                  return message;
              })
      }
      catch(error) {
          return Promise.reject(error);
      }
  }
  _readFile(file) {
      return new Promise(function(resolve, reject) {
          let reader = new FileReader();
          reader.onload = function(e) {
              resolve(e.target.result);
          };
          reader.onerror = reader.onabort = reject;
          reader.readAsArrayBuffer(file);
      });
  }

  _filesChanged() {
      if (this.files.length === 0) return;
      let file = this.files.pop();
      let extension = _.toLower(file.name.split('.').pop());
      if (['pdf', 'jpg', 'jpeg', 'png'].includes(extension)) {
          this._readFile(file).then((dataFile) => {
              let document = {
                  isScanned: false,
                  importDate: moment().format("YYYY-MM-DD"),
                  docDate: moment().format("YYYY-MM-DD"),
                  hcp: this.user.healthcarePartyId,
                  title: file.name,
                  fileBlob: dataFile,
                  type: "",
                  extension: _.toLower(file.name.split('.').pop()),
                  patientId: this.patient ? this.patient.id : "",
                  patientSsin: this.patient ? this.patient.ssin : ""
              };
              this.push("docList", document);
              this.set("selectedDoc", document);
          });
      } else {
          this.dispatchEvent(new CustomEvent('show-error-message', { detail: {title: file.name, message: "err.document.invalidType"}, bubbles: true }));
      }
  }

  delete() {
      this.set("docList",this.docList.filter(doc => doc!==this.selectedDoc))
      this.set("selectedDoc",{})
      this.set('isPdf', false);
      this.set('selectedData',"");
  }

  open() {
      const vaadinUpload = this.$['vaadin-upload'];
      vaadinUpload.set('i18n.addFiles.many', this.localize('upl_fil','Upload file',this.language))
      vaadinUpload.set('i18n.dropFiles.many', this.localize('uplabel','Drop files here...',this.language))
      this.set('files', []);
      this.$['upload-dialog'].open();
  }

  close() {
      this.set('files', []);
      this.$['upload-dialog'].close();
  }

  saveEvent() {
      if((_.trim(this.selectedDoc.title) === "" || this.selectedDoc.type ==="" || this.selectedDoc.docDate ==="")) {
          let errors = [];
          errors.push(!this.selectedDoc.type && this.localize('doc-typ', 'Type de document', this.language));
          errors.push(!this.selectedDoc.docDate && this.localize('doc_date', 'Document date', this.language));
          errors.push(!this.selectedDoc.title && this.localize('docTitle', 'Title', this.language));
          let errorDetail = errors.filter(item => !!item).join(', ');
          this.dispatchEvent(new CustomEvent("show-error-message", {
              detail: {
                  title: this.selectedDoc.title || 'Unknown',
                  message: 'err.document.missingField',
                  detail: errorDetail
              }, bubbles: true
          }));
      } else {
          this.dispatchEvent(new CustomEvent('save-documents', {
              detail: {documents: [this.selectedDoc]},
              bubbles: true
          }));
          this.delete()
      }
  }

  save(e) {
      if(!(e && e.detail && e.detail.documents && e.detail.documents.length)) return;
      let message = null;
      (e.detail.documents || []).map( doc =>{
          Promise.all([
              this.api.user().findByHcpartyId(doc.hcp),
              this.api.message().newInstance(this.user)])
              .then(([user,msg]) => this.api.message().createMessage(_.merge(msg,{
                  transportGuid : "DOC:"+(doc.isScanned ? "SCAN" :"IMPORT")+":IN",
                  recipients :[doc.hcp,(this.user.healthcarePartyId || (this.hcp && this.hcp.id) || "")],
                  recipientsType : "org.taktik.icure.entities.HealthcareParty",
                  metas :{
                      filename : doc.title,
                      importDate : doc.importDate,
                      documentDate : doc.docDate,
                      type : doc.type
                  },
                  toAddresses : [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', "")),_.get(user,"email",doc.hcp)],
                  subject : "imported doc in message",
                  //@ToDo test on persphysician ==> traited or not
                  status : (doc.isScanned ? 1<<24 : 0) | 1<<25 | (doc.patientId ? 1<<26 : 0)
              })))
              // .then(msg => this.encryptPatientId(msg, doc.patientId))
              // .then(msg => this.api.message().modifyMessage(msg))
              .then(msg => {
                  message = msg;
                  return this.api.document().newInstance(this.user, msg, {
                      documentType: doc.type,
                      mainUti: this.api.document().uti(_.toLower(doc.extension) === "pdf" ? "application/" + _.toLower(doc.extension) : "image/" + _.toLower(doc.extension)),
                      name: doc.title.includes("." + doc.extension) ? _.trim(doc.title) : _.trim(doc.title) + "." + doc.extension
                  })
              })
              .then(newDoc => this.api.document().createDocument(newDoc))
              .then(createdDoc =>{
                  doc.docId = createdDoc.id
                  return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, createdDoc, doc.fileBlob)
              })
              .then(encryptedFileContent => this.api.document().setAttachment(doc.docId, null, encryptedFileContent)
                  .then(x=>x)
                  .catch((e)=>{console.log("---error upload attachment---")}))
              .finally(x => {
                  if(!doc.patientId && !this.message) {
                      this.encryptInfo(message, [{}])
                          .then((msg) => this.api.message().modifyMessage(msg))
                          .then(() => this._refresh())
                  }
                  else {
                      this.api.patient().getPatientWithUser(this.user, doc.patientId)
                          .then(patient => this.api.register(patient, "patient"))
                          .then(patient => this.api.contact().newInstance(this.user, patient, {
                              created: parseInt(moment(doc.docDate).format("x")) || new Date().getTime(),
                              modified: parseInt(moment(doc.docDate).format("x")) || new Date().getTime(),
                              author: this.user.id,
                              responsible: this.user.healthcarePartyId,
                              subContacts: []
                          }))
                          .then(contact => {
                              const svc = this.api.contact().service().newInstance(this.user, {
                                  content: _.fromPairs([[this.language, {
                                      documentId: doc.docId,
                                      stringValue: doc.title
                                  }]]), label: 'imported document'
                              });
                              contact.services = [svc];
                              const sc = {status: 64, services: [{serviceId: svc.id}]};
                              contact.subContacts.push(sc);

                              return this.api.contact().createContactWithUser(this.user, contact)
                          })
                          .then(contact => this.api.register(contact, "contact"))
                          .then(contact => this._encryptInfo(message, [{
                              'patientId': doc.patientId,
                              'isAssigned': true,
                              'contactId': contact.id
                          }]))
                          .then((msg) => this.api.message().modifyMessage(msg))
                          .then(() => this._refresh())
                  }
              })
      })
  }

  showErrorMessage(e) {
      if (e.detail && e.detail.title && e.detail.message) {
          return setTimeout(()=>{
              console.log(e.detail.error);
              this.set('errorTitle', e.detail.title);
              this.set('errorMessage', this.localize(e.detail.message, e.detail.message, this.language));
              e.detail.detail && this.set('errorDetail', e.detail.detail);
              this.set("_bodyOverlay", true);
              this.$["error-message-box"].open();
          }, 200);
      }
  }

  closeErrorMessageBoxEvent() {
      this.dispatchEvent(new CustomEvent('close-error-message', { bubbles: true }));
  }

  closeErrorMessageBox() {
      this.$['error-message-box'].close();
  }
}

customElements.define(HtMsgImportDocDialog.is, HtMsgImportDocDialog);
