import './elements/dynamic-form/dynamic-subcontact-type-selector.js';
import './elements/pdf-element/pdf-element.js';
import './styles/dialog-style.js';
import './styles/shared-styles.js';
import './styles/buttons-style.js';
import _ from 'lodash/lodash';
import moment from 'moment/src/moment';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-checkbox/paper-checkbox"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-icon-button/paper-icon-button"

import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-date-picker/vaadin-date-picker"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"
import "@vaadin/vaadin-text-field/vaadin-text-area"
import "@vaadin/vaadin-text-field/vaadin-text-field"
import "@vaadin/vaadin-upload/vaadin-upload"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "./elements/tk-localizer";

class HtUploadDialog extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="buttons-style dialog-style">
            /*.buttons {*/
            /*    display: flex;*/
            /*    justify-content: flex-start;*/
            /*    box-sizing: border-box;*/
            /*}*/

            #form-header {
                padding-bottom: 16px;
            }

            #optionsCombo {
                flex: auto;
                margin-right: 2px;
            }

            .date-picker {
                flex: initial;
            }

            #drag-drop-layer {
                position: absolute;
                height: 100%;
                width: 100%;
                top: 0;
                left: 0;
                margin: 0;
                padding: 0;
                background-color: rgba(0, 0, 0, .3);
                visibility: hidden;
            }

            #form {
                flex-grow: 0;
                /*padding-bottom: 24px;*/
            }

            .input-form {
                width: 100%;
                height: 40px;
                display: flex;
                flex-direction: row;
            }

            .input-row {
                width: 100%;
                display: flex;
                flex-direction: row;
            }

            .input-col {
                display: flex;
                flex-direction: column;
            }

            .input-col-margin {
                margin-top: 44px;
            }

            .modal-button--save[disabled] {
                background: var(--app-secondary-color-dark);
                box-shadow: none;
            }

            vaadin-upload {
                border: none;
                overflow: unset;
                padding: 0;
                --vaadin-upload-buttons-primary: {
                    height: 28px;
                };
                --vaadin-upload-button-add: {
                    background-color: var(--button--other_-_background-color);
                    border: var(--button--other_-_border);
                    color: var(--button--other_-_color);
                    height: var(--button_-_height);
                    padding: var(--button_-_padding);
                    min-width: 100px;
                    text-transform: var(--button_-_text-transform);
                    background: var(--button_-_background);
                    box-sizing: var(--button_-_box-sizing);
                    border-radius: var(--button_-_border-radius);
                    font-weight: var(--button_-_font-weight);
                    font-size: var(--button_-_font-size);
                };

                --vaadin-upload-file-progress: {
                    display: none;
                    --paper-progress-active-color: var(--app-secondary-color);
                };
                --vaadin-upload-file-commands: {
                    display: none;
                    color: var(--app-primary-color);
                };
                --vaadin-upload-drop-label: {
                    display: none;
                };
            }

            vaadin-combo-box {
                --vaadin-combo-box-overlay-max-height: 30vh;
            }

            vaadin-text-field {
                height: 40px;
                margin-top: -16px;
                font-size: var(--font-size-normal);
            }

            #importTextField, #hcpCombo, #typeCombo {
                width: 100%;
            }

            #importTextField {
                margin-right: 2px;
            }


            #importPicker {
                width: calc(50% - 2px);
                margin-right: 2px;
            }

            #patCombo {
                width: calc(60% - 2px);
                margin-right: 2px;
            }

            #NissTextField {
                width: 40%;
            }

            #TitleTextField {
                width: 100%;
            }

            #CommentTextForm {
                height: 80px;
                font-size: var(--font-size-normal);
                padding: 4px 0;
                width: 100%;
            }

            #CommentTextArea {
                width: 100%;
            }

            #scnCombo {
                width: calc(60% - 2px);
                margin-right: 2px;
            }

            .scan-option {
                margin-top: auto;
                margin-bottom: 4px;
                padding-left: 4px;
                flex: initial;
                font-size: var(--font-size-small);
            }

            #scanner-list {
                flex: auto;
            }

            .panel {
                display: flex;
                flex-direction: column;
                padding: 12px;
                /*margin-bottom: 24px;*/
                /*margin-top: 24px;*/
            }

            #import-buttons {
                display: flex;
                flex-flow: row-reverse;
                padding-top: 12px;
                padding-left: 12px;
                min-width: 250px;
            }

            #doc-list {
                flex-grow: 1;
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
                /*padding-right: 24px;*/
            }

            #visual-panel {
                /*min-width: 600px;*/
                /*width: calc(10% - 2px);*/
                flex: 1;
                background-color: rgb(113, 135, 146);
                overflow-y: overlay;
                /*padding: 0;*/
            }

            .img-container {
                width: calc(100% - 40px);
                top: 0;
                left: 0;
                margin: 0;
                padding: 20px;
                align-self: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .img-container img {
                /*height: 100%;*/
                max-width: 546px;
            }

            pdf-element {
                max-width: 600px;
                height: 100%;
                --max-pdf-viewer-height: calc(var(--main-height) - 242px);
                --max-pdf-viewer-width: 600px;
            }

            .modalDialog {
                display: flex;
                flex-direction: column;
                min-height: 300px;
                height: 200px;
                min-width: 400px;
                width: 600px;
            }

            .modalDialogContent {
                height: 250px;
                width: auto;
                margin: auto;
            }

            .dialogContainer {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, .3);
                z-index: 10;
                text-align: center;
            }

            .dialogButtons {
                position: absolute;
                bottom: 40px;
                margin: 0;
                width: 100%;
                text-align: center;
                padding: 0;
            }

            .dialogButtons .modal-button {
                --paper-button-ink-color: var(--app-secondary-color);
                background-color: var(--app-secondary-color);
                color: var(--app-text-color);
                font-weight: 700;
                font-size: 14px;
                height: 40px;
                min-width: 100px;
                padding: 10px 1.2em;
                text-transform: uppercase;
            }

            .dialogButtons .modal-button.grey {
                --paper-button-ink-color: var(--app-background-color-dark);
                background-color: var(--app-background-color-dark);
            }

            .m-t-50 {
                margin-top: 50px !important;
            }

            .m-t-20 {
                margin-top: 20px !important;
            }

            .small {
                height: 24px;
                width: 24px;
                padding: 0;
            }

            .content {
                padding: 0;
            }

            .container {
                height: unset;
                flex-grow: 1;
                display: flex;
                flex-direction: row;
            }

            #upload-dialog {
                background: #fff;
                display: flex;
                flex-direction: column;
                min-width: 1024px;
                min-height: 400px;
                /*margin: 0;*/
                height: 80%;
                --main-height: 80vh;
            }

            .input-radio {
                padding-top: 20px;
                padding-bottom: 8px;
            }

            #list-panel {
                width: calc(40% - 2px);
            }

            #info-panel {
                width: calc(60% - 2px);
            }

            paper-radio-button {
                --paper-radio-button-unchecked-color: var(--app-text-color);
                --paper-radio-button-label-color: var(--app-text-color);
                --paper-radio-button-checked-color: var(--app-secondary-color);
                --paper-radio-button-checked-ink-color: var(--app-secondary-color-dark);
            }

            paper-checkbox {
                --paper-checkbox-unchecked-color: var(--app-text-color);
                --paper-checkbox-label-color: var(--app-text-color);
                --paper-checkbox-checked-color: var(--app-secondary-color);
                --paper-checkbox-checked-ink-color: var(--app-secondary-color-dark);
            }

            .modal-title {
                justify-content: flex-start;
            }

            .content {
                text-align: center;
            }

            .modal-title iron-icon {
                margin-right: 8px;
            }

            #drop-message {
                padding: 4px 0;
                font-size: var(--font-size-normal)
            }

        </style>
        <template is="dom-if" if="[[_bodyOverlay]]">
            <div class="dialogContainer"></div>
        </template>
        <paper-dialog id="upload-dialog" always-on-top="" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <h2 class="modal-title">[[localize('upl_fil','Upload files',language)]]</h2>
            <div class="content container">
                <div id="list-panel" class="panel">
                    <div id="form">
                        <template is="dom-if" if="[[_contactOptionsDisabled]]">
                            <div class="input-form">
                                <vaadin-text-field id="TitleTextField" label="[[localize('docTitle','Titre',language)]]" value="{{title}}" disabled="[[_patientDisabled]]"></vaadin-text-field>
                            </div>
                        </template>
                        <div class="input-form">
                            <vaadin-combo-box id="hcpCombo" filter="{{filterHcp}}" filtered-items="[[listHcp]]" on-filter-changed="_filterHcpChanged" on-value-changed="_hcpChanged" item-label-path="name" item-value-path="id" label="[[localize('persphysicianRole','Recipient',language)]]" value="{{hcpId}}" disabled="[[_patientDisabled]]">
                            </vaadin-combo-box>
                        </div>
                        <div class="input-form">
                            <vaadin-combo-box id="patCombo" filter="{{filterPatient}}" on-filter-changed="_filterPatChanged" label="[[localize('pat-name','Nom du patient',language)]]" filtered-items="[[listPat]]" item-label-path="name" item-value-path="id" value="{{patientId}}" disabled="[[_patientDisabled]]"></vaadin-combo-box>
                            <vaadin-text-field id="NissTextField" label="[[localize('ssin','NISS',language)]]" value="{{patientSsin}}" disabled="[[_patientDisabled]]"></vaadin-text-field>
                        </div>

                        <template is="dom-if" if="[[_contactOptionsVisible]]">
                            <div class="input-form">
                                <vaadin-combo-box id="optionsCombo" filtered-items="[[contactOptions]]" item-label-path="label" item-value-path="id" label="[[localize(contact_type,'Type de contact',language)]]" value="{{contactOption}}" disabled="[[_contactOptionsDisabled]]">
                                </vaadin-combo-box>
                                <vaadin-date-picker id="datePicker" label="[[localize('doc_date','Date du document',language)]]" value="{{_documentDate}}" i18n="[[i18n]]" disabled="[[_documentDateDisabled]]"></vaadin-date-picker>
                            </div>
                        </template>
                    </div>

                    <div id="drop-message">[[localize('uplabel','Drop files here...',language)]]</div>
                    <vaadin-grid id="doc-list" class="material" items="[[docList]]" active-item="{{selectedDoc}}">
                        <vaadin-grid-column flex-grow="0" width="40px">
<!--                            <template class="header">-->
<!--                                <div class="cell frozen">[[localize('type-doc','Type',language)]]</div>-->
<!--                            </template>-->
                            <template>
                                <template is="dom-if" if="[[!item.isScanned]]">
                                    <iron-icon icon="icons:file-upload"></iron-icon>
                                </template>
                                <template is="dom-if" if="[[item.isScanned]]">
                                    <iron-icon icon="hardware:scanner"></iron-icon>
                                </template>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column flex-grow="1">
                            <template class="header">
                                <div class="cell frozen">[[localize('docTitle','Titre',language)]]</div>
                            </template>
                            <template>[[item.title]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column flex-grow="1">
                            <template class="header">
                                <div class="cell frozen">[[localize('type','Type',language)]]</div>
                            </template>
                            <template>[[_getDocumentLabel(item.type)]]</template>
                        </vaadin-grid-column>
                        <vaadin-grid-column flex-grow="0" width="40px">
<!--                            <template class="header">-->
<!--                                <div class="cell frozen">[[localize('del','Delete',language)]]</div>-->
<!--                            </template>-->
                            <template>
                                <paper-icon-button icon="icons:close" class="small" on-tap="_deleteItem">
                                </paper-icon-button>
                            </template>
                        </vaadin-grid-column>
                    </vaadin-grid>

                    <div class="input-form">
                        <vaadin-combo-box id="scanner-list" filtered-items="[[scannerList]]" item-label-path="label" item-value-path="id" label="[[localize('scanner','Scanner',language)]]" value="{{selectedScanner}}" disabled="[[!_canConfigureScan(isScanning,hasElectron,scannerList)]]">
                        </vaadin-combo-box>
                        <div class="scan-option">
                            <paper-checkbox checked="{{scannerColor}}" disabled="[[!_canConfigureScan(isScanning,hasElectron,scannerList)]]">[[localize('color','Color',language)]]</paper-checkbox>
                        </div>
                        <div class="scan-option">
                            <paper-checkbox checked="{{scannerDuplex}}" disabled="[[!_canConfigureScan(isScanning,hasElectron,scannerList)]]">[[localize('duplex','Duplex',language)]]</paper-checkbox>
                        </div>
                    </div>

                    <div id="import-buttons">
                        <div id="upload">
                            <vaadin-upload id="vaadin-upload" no-auto="" files="{{files}}" accept="image/jpeg,application/pdf" form-data-name="attachment"></vaadin-upload>
                        </div>
                        <paper-button class="button button--other" role="button" on-tap="_launchScan" disabled="[[!_canConfigureScan(isScanning,hasElectron,scannerList)]]">
                            [[localize('scan','Scan',language)]]
                        </paper-button>
                    </div>
                </div>
                <div id="info-panel" class="panel">
                    <div id="form-header">
                        <div class="input-form">
                            <vaadin-combo-box id="typeCombo" filtered-items="[[listType]]" item-label-path="name" item-value-path="code" label="[[localize('type-doc','Type de document',language)]]" value="{{selectedDoc.type}}">
                            </vaadin-combo-box>
                        </div>
                        <div class="input-form" id="CommentTextForm">
                            <vaadin-text-area class="textarea-style" id="CommentTextArea" label="[[localize('com','Comments',language)]]" value="{{selectedDoc.comment}}"></vaadin-text-area>
                        </div>
                    </div>
                    <div id="visual-panel">
                        <template is="dom-if" if="[[selectedDoc]]">
                            <template is="dom-if" if="[[!isPdf]]">
                                <div class="img-container">
                                    <img src="[[selectedData]]" alt="">
                                </div>
                            </template>
                            <template is="dom-if" if="[[isPdf]]">
                                <pdf-element fit-height="" id="viewer" src="[[selectedData]]"></pdf-element>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="" role="button" on-tap="close">
                    [[localize('clo','Close',language)]]
                </paper-button>
                <paper-button class="button button--save" role="button" autofocus="" on-tap="_saveDocuments" disabled="[[_saveDisabled]]">
                    [[localize('save','Enregistrer',language)]]
                </paper-button>
            </div>
            <div id="drag-drop-layer" class="dragDropLayer"></div>
        </paper-dialog>

        <paper-dialog id="error-message-box" class="modalDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="" always-on-top="">
            <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
            <div class="content">
                <h3>[[errorTitle]]</h3>
                <p>[[errorMessage]]: [[errorDetail]]</p>
            </div>
            <div class="buttons">
                <paper-button class="button button--other" role="button" dialog-dismiss=""><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-upload-dialog';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              // observer: "apiReady"
              noReset: true
          },
          doc: {
              type: Boolean,
              value: true
          },
          user: {
              type: Object,
              observer: "_userChanged"
          },
          _bodyOverlay: {
              type: Boolean,
              value: false
          },
          _dialogOverlay: {
              type: Boolean,
              value: false
          },
          patient: {
              type: Object,
              observer: "_patientChanged"
          },
          docList: {
              type: Array,
              value: () => []
          },
          selectedDoc: {
              type: Object
          },
          files: {
              type: Array
          },
          isLoadingDoc: {
              type: Boolean,
              value: false
          },
          isScanning: {
              type: Boolean,
              value: false
          },
          documentMetas: {
              type: Object,
              value: null
          },
          selectedScanner: {
              type: String,
              value: ""
          },
          scannerColor: {
              type: Boolean,
              value: false
          },
          scannerDuplex: {
              type: Boolean,
              value: true
          },
          scannerList: {
              type: Array,
              value: () => []
          },
          hasElectron: {
              type: Boolean,
              value: false,
              observer: '_hasElectronChanged'
          },

          listHcp: {
              type: Array,
              value: () => []
          },
          hcpFilter: {
              type: String,
              value: ""
          },
          hcpId: {
              type: Object,
              value: null
          },

          listPat: {
              type: Array,
              value: () => []
          },
          filterPatient: {
              type: String,
              value: ""
          },
          patientId: {
              type: Object,
              value: null,
          },

          patientSsin: {
              type: String,
              value: ""
          },

          title: {
              type: String,
              value: ""
          },

          comment: {
              type: String,
              value: ""
          },

          listType: {
              type: Array,
              value: () => []
          },

          selectedData: {
              type: Object,
              value: null
          },
          isPdf: {
              type: Boolean,
              value: false
          },
          _patientDisabled: {
              type: Boolean,
              value: false
          },
          contactOption: {
              type: String,
              value: ""
          },
          currentContact: {
              type: Object,
              value: null
          },

          _contactOptionsVisible: {
              type: Boolean,
              value: true
          },

          _contactOptionsDisabled: {
              type: Boolean,
              value: true
          },

          _documentDateDisabled: {
              type: Boolean,
              value: true
          },
          _documentDate: {
              type: Object,
              value: null
          },
          _saveDisabled: {
              type: Boolean,
              value: false
          },
          contactOptions: {
              type: Array,
              value: []
          }
      };
  }

  static get observers() {
      return [
          'apiReady(api,user,opened)',
          '_filesChanged(files.*)',
          "_selectedDocChanged(selectedDoc.*)",
          "_isInvalid(selectedDoc.*)",
          "_patientIdChanged(patientId)",
          "_patientNissChanged(patientSsin)",
          "_contactOptionChanged(patientId, currentContact, contactOption)",
          "_docListChanged(docList.*)"
      ];
  }

  constructor() {
      super();
  }

  ready() {
      super.ready();

      this.set("contactOptions", [
          {id: "current", label: this.localize("current_contact", "Contact courant", this.language)},
          {id: "new", label: this.localize("new_sync_contact", "Nouveau contact synchronisé", this.language)}]);

      const uploadDialog = this.shadowRoot.querySelector('#upload-dialog');
      const dragDropLayer = this.shadowRoot.querySelector('#drag-drop-layer');
      const errorDialog = this.shadowRoot.querySelector('#error-message-box');
      const optionsCombo = this.shadowRoot.querySelector('#optionsCombo');

      uploadDialog.addEventListener('dragenter', () => {
          dragDropLayer.style.visibility = 'visible';
      });
      dragDropLayer.addEventListener('dragenter', (e) => {
          e.dataTransfer.dropEffect = 'copy';
          e.preventDefault();
      });
      dragDropLayer.addEventListener('dragover', (e) => {
          e.dataTransfer.dropEffect = 'copy';
          e.preventDefault();
      });
      dragDropLayer.addEventListener('dragleave', () => {
          dragDropLayer.style.visibility = "hidden";
      });
      dragDropLayer.addEventListener('drop', (e) => {
          e.preventDefault();
          dragDropLayer.style.visibility = "hidden";
          let target = this.shadowRoot.querySelector('vaadin-upload');
          target && target._onDrop(e);
      });

      optionsCombo.selectedItem = this.contactOptions[0];
  }

  apiReady() {
      this.api && this.api.isElectronAvailable().then(electron => this.set("hasElectron", electron)).catch(error => console.log(error));
      return !!_.size(_.get(this, "listType", [])) || !this.api ? null : this.api.getDocumentTypes(this.resources, this.language).then(documentTypes => this.set("listType", documentTypes))
  }

  // _isSynchronizedContact(contactOption) {
  //     return contactOption === "current";
  // }

  _getDocumentLabel(code) {
      if (this.listType.length === 0) return code;
      return (this.listType.find(t => t.code === code) || { name: code }).name;
  }


  _hasElectronChanged() {
      if (!this.hasElectron) return;
      Promise.all([fetch("http://127.0.0.1:16042/scanning", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
              request: "list"
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
      ]).then(response => Promise.all(response.map(rep => rep.json()))).then(([data, settings]) => {
          if (!data.ok) return;
          const scanner = settings && settings.data && settings.data !== 'error' && JSON.parse(settings.data).find(set => set.type === "scanner")
          this.set("selectedScanner", scanner && data.data.all.find(scan => scan.id === scanner.printer || scan.label === scanner.printer) ? scanner.printer : data.data.default.id)
          this.set("scannerList", data.data.all);
          this.set("scannerColor", scanner.color);
          this.set("scannerDuplex", scanner.duplex);
      })
  }

  _updateView() {
      let type = _.toLower(this.selectedDoc.extension);
      let base64 = btoa([].reduce.call(new Uint8Array(this.selectedDoc.fileBlob), (p, c) => p + String.fromCharCode(c), ''));

      if (type === 'jpeg' || type === 'jpg' || type === "PNG" || type === "png") {
          this.set('isPdf', false);
          this.set('selectedData', 'data:image/jpeg;base64,' + base64);
      } else if (type === 'tif' || type === 'tiff') {
          this.set('isPdf', false);
          this.set('selectedData', 'data:image/tiff;base64,' + base64);
      } else if (type === 'pdf') {
          this.set('isPdf', true);
          this.set('selectedData', base64);
          // setTimeout(() => this.shadowRoot.querySelector("#viewer").zoomFit(), 1000)
      }
  }

  _selectedDocChanged() {
      if (!this.selectedDoc) {
          this.set('isPdf', false);
          this.set('selectedData', null);
          return;
      }
      console.log("selected doc changed =", this.selectedDoc)

      // if (!this.listHcp.find(hcp => this.selectedDoc.hcp === hcp.id)) {
      //     this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(tempHcp => {
      //         this.push("listHcp", {
      //             id: tempHcp.id,
      //             name: tempHcp.name || tempHcp.firstName + " " + tempHcp.lastName || tempHcp.id
      //         })
      //     })
      // }

      // if (this.patient)
      //     this._patientChanged();
      // else {
      //     this.api.patient().filterByWithUser(this.user, null, null, 50, null, null, true, {
      //         filter: {
      //             '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
      //             'healthcarePartyId': this.hcpId,
      //             'searchString': this.filterPatient
      //         }
      //     })
      //         .then(pats => pats.rows.map(pat => this._pushDistinctPatient("listPat", pat)))
      // }
      this.$['doc-list'].clearCache()
      this._updateView();
  }

  _userChanged() {
      if (!this.user) return;
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(tempHcp => {
          this.push("listHcp", {
              id: tempHcp.id,
              name: tempHcp.name || tempHcp.firstName + " " + tempHcp.lastName || tempHcp.id
          })
      })
  }

  _wrapPatient(patient) {
      return {
          id: patient.id,
          name: patient.firstName + " " + patient.lastName || patient.id,
          ssin: patient.ssin
      };
  }

  _pushDistinctPatient(listPath, patient) {
      if (!patient || !patient.id) return;
      if (this.get(listPath).find(item => item.id === patient.id)) return;
      this.push(listPath, this._wrapPatient(patient));
  }

  _patientChanged() {
      if (!this.patient) return;
      let pat = this._wrapPatient(this.patient);
      this._pushDistinctPatient("listPat", pat);
      this.set("patientId", this.patient.id);
      this.shadowRoot.querySelector("#patCombo").selectedItem = pat;
  }

  _clearPatList() {
      this.splice("listPat", 0, this.listPat.length);
      this.set("patientId", "");
      // const hcpCombo = this.shadowRoot.querySelector("#hcpCombo");
      // if (hcpCombo) {
      //     hcpCombo.filteredItems = null;
      //     hcpCombo.selectedItem = null;
      // }
  }

  _patientIdChanged() {
      // if (!this.selectedDoc) return;
      let pat = this.listPat.find(pat => pat.id === this.patientId) || {ssin: ""};
      pat.ssin !== this.patientSsin && this.set("patientSsin", pat.ssin);
  }

  _patientNissChanged() {
      // if (!this.selectedDoc) return;
      if (!this.patientSsin || !this._validSsin(this.patientSsin)) return;
      const found = this.listPat.find(pat => pat.ssin === this.patientSsin)
      if (found) {
          this.patientId !== found.id && this.set("patientId", found.id)
      } else {
          this.api.patient().filterByWithUser(this.user, null, null, 10, null, null, "desc", {
              filter: {
                  '$type': 'PatientByHcPartyAndSsinFilter',
                  'healthcarePartyId': this.hcpId,
                  'ssin': this.patientSsin
              }
          }).then(pats => {
              pats.rows.map(pat => this._pushDistinctPatient("listPat", pat))
              this.set("patientId", this.listPat.find(pat => pat.ssin === this.patientSsin).id)
          })
      }
  }

  _hcpChanged(e) {
      this._clearPatList();
  }

  _filterHcpChanged(e) {
      if (!e.detail.value) return;
      this.api.hcparty().findByName(e.detail.value, null, null, 100, "desc").then(hcps => {
          this.set("listHcp", hcps.rows.map(hcp => {
              return {
                  id: hcp.id,
                  name: hcp.name || hcp.firstName + " " + hcp.lastName || hcp.id
              }
          }))
      })
  }

  _filterPatChanged(e) {
      if (!this.filterPatient || !this.hcpId) return;
      this.api.patient().filterByWithUser(this.user, null, null, 50, null, null, true, {
          filter: {
              '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
              'healthcarePartyId': this.hcpId,
              'searchString': this.filterPatient
          }
      }).then(pats => {
          this.set("listPat", pats.rows.map(pat => {
              return {
                  id: pat.id,
                  name: pat.firstName + " " + pat.lastName || pat.id,
                  ssin: pat.ssin
              }
          }))
      })
  }

  _validSsin(ssin) {
      return ssin && ssin.length > 9;
  }

  _docListChanged() {
      this.set("_saveDisabled", (this.docList.length === 0));
  }

  _hasScanners() {
      //return true;
      return this.hasElectron && this.scannerList && this.scannerList.length;
  }

  _canConfigureScan() {
      return this._hasScanners() && !this.isScanning;
  }

  _isScannedFile(document) {
      return document.isScanned
  }

  _launchScan() {
      this.set("isScanning", true);
      fetch("http://127.0.0.1:16042/scanning", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
              request: "scan",
              scanner: this.selectedScanner,
              index: this.scannerList.findIndex(item => item.id === this.selectedScanner).toString(),
              color: this.scannerColor ? "1" : "0",
              duplex: this.scannerDuplex ? "1" : "0"
          })
      })
          .then(response => response.json())
          .then(response => {
              if (!response.ok) {
                  this.dispatchEvent(new CustomEvent("error-message", {
                      detail: {
                          title: this.selectedScanner,
                          message: 'err.scan.capture',
                          detail: response.data
                      }, bubbles: true
                  }));
                  return;
              }

              let document = {
                  isScanned: true,
                  title: "scanned doc n°" + this.docList.filter(doc => doc.isScanned).length + 1,
                  fileBlob: this.api.crypto().utils.base64toArrayBuffer(response.data.base64),
                  // importDate: moment().format("YYYY-MM-DD"),
                  // docDate: moment().format("YYYY-MM-DD"),
                  // hcp: "",
                  type: "",
                  extension: "pdf",
                  // patientId: this.patient ? this.patient.id : "",
                  // patientSsin: this.patient ? this.patient.ssin : ""
              };
              this.push("docList", document);
              this.set("selectedDoc", document);
          })
          .finally(() => {
              this.set("isScanning", false);
          })
  }

  _encrypt(documentObject, object) {
      return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, documentObject, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(object || "")))
          .then(ua => Base64.encode(this.api.crypto().utils.ua2text(ua)))
  }

  _decrypt(documentObject, cryptedString) {
      if (!cryptedString) {
          return Promise.resolve("");
      }
      const ua = this.api.crypto().utils.text2ua(Base64.decode(cryptedString));
      return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, documentObject, ua)
          .then(ua => this.api.crypto().utils.ua2text(ua));
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
      } catch (error) {
          return Promise.reject(error);
      }
  }

  _readFile(file) {
      return new Promise(function (resolve, reject) {
          let reader = new FileReader();
          reader.onload = function (e) {
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
                  hcp: "",
                  title: file.name,
                  fileBlob: dataFile,
                  type: "",
                  comment: "",
                  extension: _.toLower(file.name.split('.').pop()),
                  patientId: "",
                  patientSsin: ""
              };
              this.push("docList", document);
              this.set("selectedDoc", document);
          });
      } else {
          this.dispatchEvent(new CustomEvent('error-message', {
              detail: {
                  title: file.name,
                  message: "err.document.invalidType"
              }, bubbles: true
          }));
      }
  }

  _reset() {
      this.set("docList", [])
      this.$['doc-list'].clearCache()
      this.set('files', []);
      this.set("selectedDoc", null)
  }

  _deleteItem(e) {
      if (e.model && e.model.item) {
          let item = e.model.item;
          this.set("docList", this.docList.filter(doc => doc !== item));
          if (this.selectedDoc === item) {
              this.set("selectedDoc", null)
              this.set('isPdf', false);
              this.set('selectedData', null);
          }
      }
  }

  _isInvalid(document) {
      return _.trim(document.title) === "" || document.type === "" || !document.fileBlob;
  }

  _saveDocuments() {
      const hasContact = !!(this.currentContact);
      if (this.title.length == 0 && !hasContact) {
          this.dispatchEvent(new CustomEvent("error-message", {
              detail: {
                  title: 'Missing title',
                  message: 'err.document.missingField',
                  detail: this.localize('docTitle', 'Title', this.language)
              }, bubbles: true
          }));
          return;
      }

      if (this.docList.length === 0) return;
      let invalidDoc = this.docList.find(d => this._isInvalid(d));
      if (invalidDoc) {
          let errors = []
          errors.push(!invalidDoc.type && this.localize('doc-typ', 'Document type', this.language));
          // errors.push(!invalidDoc.docDate && this.localize('doc_date', 'Document date', this.language));
          errors.push(!invalidDoc.title && this.localize('docTitle', 'Title', this.language));
          errors.push(!invalidDoc.fileBlob && this.localize('file', 'File', this.language));
          let errorDetail = errors.filter(item => !!item).join(', ');
          this.dispatchEvent(new CustomEvent("error-message", {
              detail: {
                  title: invalidDoc.title || 'Unknown',
                  message: 'err.document.missingField',
                  detail: errorDetail
              }, bubbles: true
          }));
      } else {
          this.dispatchEvent(new CustomEvent('save-documents', {
              detail: {
                  documents: this.docList,
                  //@ TODO Clean this
                  //title: this.title
              },
              bubbles: true
          }));
      }
  }

  _contactOptionChanged() {
      this._documentDate || this.set('_documentDate', moment().format("YYYY-MM-DD"));
      if (this.patientId === '') {
          const optionsCombo = this.shadowRoot.querySelector('#optionsCombo');
          if (optionsCombo)
              optionsCombo.selectedItem = this.contactOptions[0];
          this.set('_documentDateDisabled', true);
          this.set('_contactOptionsDisabled', true);
      } else {
          this.set('_contactOptionsDisabled', false);
          this.set('_documentDateDisabled', this.contactOption === 'current');
      }
  }

  open(currentContact) {
      const vaadinUpload = this.$['vaadin-upload'];
      vaadinUpload.set('i18n.addFiles.many', this.localize('imp', 'Import', this.language))
      vaadinUpload.set('i18n.dropFiles.many', this.localize('uplabel', 'Drop files here...', this.language))
      this.set('files', []);
      this.set('_bodyOverlay', true);
      this.set('currentContact', currentContact);
      this.set('_documentDate', moment().format("YYYY-MM-DD"));


      this.scannerList = [
          { id: 1, code: '1', label : 'scanner A' },
          { id: 2, code: '2', label : 'scanner B' },
      ];

      const hasContact = !!(this.currentContact);
      this.set('_patientDisabled', hasContact);
      this.set('_contactOptionsDisabled', !hasContact);

      this.set('title', this.localize('document','Document', this.language) + ' ' + moment().format("DD/MM/YY HH:mm"));

      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
          .then(tempHcp => {
              this.push("listHcp", {
                  id: tempHcp.id,
                  name: tempHcp.name || tempHcp.firstName + " " + tempHcp.lastName || tempHcp.id
              });
              return tempHcp;

          })
          .then((tempHcp) => this.set('hcpId', tempHcp.id));

      this.$['upload-dialog'].open();
      this._hasElectronChanged();
  }

  close() {
      this._reset()
      this.$['upload-dialog'].close();
      this.set('_bodyOverlay', false)
  }

  defaultSaveDocuments(e) {
      if (!(e && e.detail && e.detail.documents && e.detail.documents.length)) return;
      const documents = e.detail.documents;
      let updatedContact = null;
      let documentList = [];
      const title = this.title;
      let docDate = moment();
      if (this._documentDate && this._documentDate.length > 0)
          docDate = moment(this._documentDate);
      const docDateYMD = parseInt(docDate.format("YYYYMMDDHHmmss"));
      const docDateMs = parseInt(docDate.format("x")) || new Date().getTime();
      const docDateAsString = docDate.format("YYYY-MM-DD")
      console.log("message to process ", documents.length);
      Promise.all([this.api.user().findByHcpartyId(this.hcpId), this.api.message().newInstance(this.user)])
          .then(([user, msg]) => this.api.message().createMessage(_.merge(msg, {
              transportGuid: "DOC:IMPORT:IN",
              recipients: [this.hcpId, (this.user.healthcarePartyId || this.hcpId || "")],
              recipientsType: "org.taktik.icure.entities.HealthcareParty",
              metas: {
                  documentDate: docDateAsString,
                  importDate: moment().format("YYYY-MM-DD")
              },
              toAddresses: [_.get(this.user, "email", _.get(this.user, "healthcarePartyId", "")), _.get(user, "email", this.hcpId)],
              subject: title,
              //@ToDo test on persphysician ==> traited or not
              status: 1 << 1 | 1 << 25 | (this.patientId ? 1 << 26 : 0)
          })))
          .then(msg => new Promise(resolve => {
                  if (this.patientId) {
                      console.log("has patient for message ", msg.id);
                      return this.api.patient().getPatientWithUser(this.user, this.patientId)
                          .then(patient => this.api.register(patient, "patient"))
                          .then(patient => {
                              const contact = (this.contactOption === "current") && this.currentContact;
                              if (!contact) {
                                  return this.api.contact().newInstance(this.user, patient, {
                                      openingDate: docDateYMD,
                                      closingDate: docDateYMD,
                                      author: this.user.id,
                                      responsible: this.user.healthcarePartyId,
                                      subContacts: []
                                  })
                              } else {
                                  return contact;
                              }
                          })
                          .then(contact => resolve(contact))
                  } else {
                      console.log("no patient for message ", msg.id);
                      // return this._encryptInfo(msg, [{}])
                      return resolve();
                  }
              })
              .then(contact => Promise.all(documents.map(doc => {
                  let mimeType = _.toLower(doc.extension);
                  mimeType = mimeType === 'jpg' ? 'jpeg' : mimeType === 'tif' ? 'tiff' : mimeType;
                  let name = doc.title.includes("." + doc.extension) ? _.trim(doc.title) : _.trim(doc.title) + "." + doc.extension;
                  return this.api.document().newInstance(this.user, msg, {
                      documentType: doc.type,
                      mainUti: this.api.document().uti(mimeType === "pdf" ? "application/pdf" : "image/" + mimeType),
                      name: name,
                      created: docDateMs
                  })
                      .then(newDoc => this.api.document().createDocument(newDoc))
                      .then(createdDoc => this._encrypt(createdDoc, doc.comment)
                          .then(cryptedComment => {
                              console.log("1 - doc creation")
                              doc.docId = createdDoc.id;
                              // doc.createdDoc = createdDoc;
                              documentList.push({
                                  id: doc.docId,
                                  // filename: doc.title,
                                  comment: cryptedComment,
                                  // type: doc.type,
                                  scanned: (doc.isScanned ? 1 : 0)
                              });
                              console.log("-- 1 - documentList: ", documentList);

                              if (!contact) return;
                              const svc = this.api.contact().service().newInstance(this.user, {
                                  content: _.fromPairs([[this.language, {
                                      documentId: doc.docId,
                                      stringValue: doc.title
                                  }]]),
                                  created: docDateMs,
                                  tags: [{type: 'CD-TRANSACTION', code: doc.type || 'report'}],
                                  label: 'imported document',
                                  comment: cryptedComment
                              });

                              if (contact.services === undefined) contact.services = [svc];
                              else contact.services.push(svc);

                              const sc = {status: 64, services: [{serviceId: svc.id}]};
                              contact.subContacts.push(sc);
                              console.log("2 - pushed sc");
                          })
                          .then(() => createdDoc)
                      )
                      .then(createdDoc => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, createdDoc, doc.fileBlob))
                      .then(encryptedFileContent => this.api.document().setAttachment(doc.docId, null, encryptedFileContent))
                  }))
                  .then(() => contact)
              )
              .then(contact => {
                  if (!contact) return;
                  console.log("3 - create or modify contact")
                  return (this.contactOption === "new" ? this.api.contact().createContactWithUser(this.user, contact) : this.api.contact().modifyContactWithUser(this.user, contact))
                      .then(contact => this.api.register(contact, "contact"))
                      .then(contact => updatedContact = contact)
                      .then(contact => this._encryptInfo(msg, [{
                          'patientId': this.patientId,
                          'isAssigned': true,
                          'contactId': contact.id
                      }]))
              })
              .then(() => msg)
          )
          .then(msg => {
              console.log("4 - stringify");
              msg.metas.documentListJson = JSON.stringify(documentList);
              delete msg.metas.documentList;
              console.log("-- 2 - documentList: ", documentList);
              console.log("-- documentListJson: ", msg.metas.documentListJson);
              return this.api.message().modifyMessage(msg);
          })
          .then(msg => {
              console.log(msg);
              return msg;
          })
          .catch(error => console.log(error))
          .finally(msg => {
              console.log("5 - finally");
              this.dispatchEvent(new CustomEvent("post-process", {
                  detail: {
                      messages: msg,
                      contact: updatedContact
                  }, bubbles: true
              }))
          })
  }

  showErrorMessage(e) {
      if (e.detail && e.detail.title && e.detail.message) {
          return setTimeout(() => {
              console.log(e.detail.error);
              this.set('errorTitle', e.detail.title);
              this.set('errorMessage', this.localize(e.detail.message, e.detail.message, this.language));
              e.detail.detail && this.set('errorDetail', e.detail.detail);
              this.$["error-message-box"].open();
          }, 200);
      }
  }
}

customElements.define(HtUploadDialog.is, HtUploadDialog);
