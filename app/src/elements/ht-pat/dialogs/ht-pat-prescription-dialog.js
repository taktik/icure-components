import '../../../styles/dialog-style.js';

import _ from 'lodash/lodash';
import JsBarcode from 'jsbarcode';
import mustache from "mustache/mustache.js";
import moment from 'moment/src/moment';

const STATUS_NOT_SENT = 1;
const STATUS_SENT = 2;

import {TkLocalizerMixin} from "../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatPrescriptionDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
    static get template() {
        return html`
        <style include="dialog-style">
            .endline {
				display: flex;
				flex-direction: row;
				margin: 0;
				border-top: 1px solid var(--app-background-color-dark);
			}

            .prescription-progress-bar {
				width: calc( 100% - 40px );
			}

            .warning {
                display: block;
                font-size: 1.1em;
                color: var(--app-status-color-nok);
                text-align: left;
                margin: 16px auto;
                background: rgba(252,0,0,.2);
                border-radius: 4px;
                padding: 8px;
                cursor: pointer;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                width: 80%;
            }

            .warning.ehbox {
                color: white;
                background: var(--app-status-color-pending);
            }

            paper-dialog {
				width: 80%;
                min-width:30%;
                margin: 0;
			}

            paper-radio-group {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}

			paper-radio-group paper-radio-button {
				line-height: 48px;
			}


            vaadin-grid {
				max-height:100%;
				border: none;
				--vaadin-grid-body-row-hover-cell: {
					/* background-color: var(--app-primary-color); */
					color: white;
				};
				--vaadin-grid-body-row-selected-cell: {
					background-color: var(--app-primary-color);
					color: white;
				};
			}

            .content.sent {
                padding: 0;
            }

            paper-tabs {
                margin-top: 0;
                position: relative;
                padding: 0;
                background: var(--app-background-color-dark);
                --paper-tabs-selection-bar-color: var(--app-secondary-color);
                --paper-tabs: {
                    color: var(--app-text-color);
                };
               
            }

            @media screen and (max-width: 952px) {
                paper-dialog#prescriptionDialog {
                    position: fixed;
                    max-height: none;
                    max-width: none !important;
                    top: 64px !important;
                    left: 0 !important;
                    height: calc(100vh - 64px - 20px) !important; /* 64 = app-header 20 = footer */
                    width: 100% !important;
                }
            }

            @media screen and (max-width: 800px) {
				.endline {
					padding-bottom: 16px;
				}
				paper-radio-group paper-radio-button {
					line-height: normal;
				}
			}

            @media screen and (max-width: 672px) {
                .button {
                    margin: 4px 0;
                }
            }

            @media screen and (max-width: 664px) {
                paper-radio-group, .buttons {
                    flex-direction: column;
                }
            }

            #loading {
                padding: 10px
            }

            .presc-dialog .buttons{
                padding-bottom: 16px;
            }
            .presc-dialog .error-message{
                padding-bottom: 16px;
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
            .buttons {
                justify-content: space-between;
            }

            dynamic-date-field{
                --dynamic-field-width: 0!important;
                --dynamic-field-width-percent: 0!important;
                max-width: 130px;
            }

            .deliveryDate{
                width: 200px;
            }
            .printButton {
                display: flex;
            }
        </style>

        <paper-dialog id="loading" modal="">
            <h2>[[localize('sending_prescription','Sending prescription...',language)]]</h2>
            <paper-progress class="prescription-progress-bar" indeterminate=""></paper-progress>
        </paper-dialog>

        <paper-dialog id="confirmNoRecipe" class="presc-dialog">
            <h2 class="modal-title">[[localize('send_recipe_fail','Sending to Recipe failed',language)]]</h2>
            <div class="error-message">
                [[_printError]]
            </div>
            <div class="error-message-details">
                [[_printErrorDetails]]
            </div>

            <div class="buttons">
                <paper-button class="button" on-tap="" dialog-dismiss="">[[localize('can', "Annuler", language)]]</paper-button>
                <paper-button class="button button--other" on-tap="_printPrescriptionNoRecipe" disabled="[[!_printEnabled(_drugsOnPrescriptions,_drugsOnPrescriptions.*,_splitColumns)]]"><iron-icon icon="print"></iron-icon>[[localize('print_no_recipe', "Imprimer sans recipe", language)]]</paper-button>
                <paper-button class="button button--save" dialog-dismiss="" autofocus="" on-tap="_printPrescriptions" disabled="[[!_printEnabled(_drugsOnPrescriptions,_drugsOnPrescriptions.*,_splitColumns)]]"><iron-icon icon="print"></iron-icon>[[localize('try_again','Réessayer',language)]]</paper-button>
            </div>
            
        </paper-dialog>

        <paper-dialog id="tryAgainRevoke" class="presc-dialog">
            <h2 class="modal-title">[[localize('revoke_recipe_fail','Revoke RID failed',language)]]</h2>
            <div class="error-message">
                [[_printError]]
            </div>
            <div class="error-message-details">
                [[_printErrorDetails]]
            </div>

            <div class="buttons">
                <paper-button class="button" on-tap="" dialog-dismiss="">[[localize('can', "Annuler", language)]]</paper-button>
                <paper-button class="button button--save" dialog-dismiss="" autofocus="" on-tap="_revokeTryAgainCallback">[[localize('try_again','Réessayer',language)]]</paper-button>
            </div>
        
        </paper-dialog>

        <paper-dialog id="confirmRevoke" class="presc-dialog">
            <h2 class="modal-title">[[localize('confirm','Confirmer',language)]]</h2>
            <div class="error-message">
                [[_printError]]
            </div>
            <div class="error-message-details">
                [[_printErrorDetails]]
            </div>

            <div class="buttons">
                <paper-button class="button" on-tap="" dialog-dismiss="">[[localize('can', "Annuler", language)]]</paper-button>
                <paper-button class="button button--save" dialog-dismiss="" autofocus="" on-tap="_revokeTryAgainCallback"><iron-icon icon="remove"></iron-icon>[[localize('revoke','Révoquer',language)]]</paper-button>
            </div>

        </paper-dialog>

        <paper-dialog id="dialog">
            <paper-tabs selected="{{prescriptionTab}}" attr-for-selected="name">
                <!--
                <paper-tab name="sent" on-tap="_entitiesNotifyResize">
                    <span class="names-nomobile">[[localize('prescription_sent','Prescriptions envoyées',language)]]</span>
                </paper-tab>-->
                <paper-tab name="toSend">
                    <span class="names-nomobile">[[localize('prescription_to_send','Prescriptions à envoyer',language)]]</span>
                </paper-tab>
            </paper-tabs>
            <template is="dom-if" if="[[_isSentView(prescriptionTab)]]">
                <div class="content sent">
                    <vaadin-grid id="sent-entities-list" class="material" overflow="bottom" items="[[ridSentListExtended]]">
                        <vaadin-grid-column width="80px">
                            <template class="header">
                                <div path="description">[[localize('date',"Date",language)]]</div>
                            </template>
                            <template>
                                <div class="cell frozen">[[_getRidDate(item)]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="80px">
                            <template class="header">
                                <div path="description">[[localize('RID',"Numéro d'envoi Recipe",language)]]</div>
                            </template>
                            <template>
                                <div class="cell frozen">[[_getRidLabel(item)]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="100px">
                            <template class="header">
                                <div path="description">[[localize('dru_des','Drug descr.',language)]]</div>
                            </template>
                            <template>
                                <div class="cell frozen">[[item.drugDescription]]
                                    <template is="dom-if" if="[[_drugIsType(item, 'local')]]">
                                        [[localize('recipe_not_found_remote', '(Non trouvé sur serveur recipe)', language)]]
                                    </template>
                                </div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="200px">
                            <template class="header">
                                [[localize('pos','Posology',language)]]
                            </template>
                            <template>
                                <div class="cell frozen">[[item.drugPosology]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="40px">
                            <template class="header">
                                [[localize('revoke','Revoquer',language)]]
                            </template>
                            <template>
                                <template is="dom-if" if="[[!_drugIsType(item, 'drug')]]">
                                    <paper-icon-button data-rid\$="[[item.rid]]" on-tap="_revokeRIDHandler" icon="backspace"></paper-icon-button>
                                    <!--<paper-button class="action-btn" data-rid\$="[[item.rid]]" on-tap="_revokeRIDHandler">-->
                                        <!--[[localize('revoke','Revoquer',language)]]-->
                                    <!--</paper-button>-->
                                </template>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="40px">
                            <template class="header">
                                [[localize('pri','Imprimer',language)]]
                            </template>
                            <template>
                                <template is="dom-if" if="[[_canPrint(item)]]">
                                    <paper-icon-button data-rid\$="[[item.rid]]" on-tap="_printRID" icon="print"></paper-icon-button>
                                    <!--<paper-button class="action-btn" data-rid\$="[[item.rid]]" on-tap="_printRID">-->
                                        <!--[[localize('pri','Imprimer',language)]]-->
                                    <!--</paper-button>-->
                                </template>
                            </template>
                        </vaadin-grid-column>
                    </vaadin-grid>
                </div>
                <div class="buttons">
                    <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
                </div>
                <template is="dom-if" if="[[_isFetchingRecipeList]]">
                    <div class="spinnerbox">
                        <ht-spinner active=""></ht-spinner>
                    </div>
                </template>
            </template>
            <template is="dom-if" if="[[_isToSendView(prescriptionTab)]]">
                <!-- <h2 class="modal-title">[[localize('pri_pre','Print prescription',language)]]</h2> -->
                <div class="content">
                    <vaadin-grid id="entities-list" class="material" overflow="bottom" items="[[_drugsOnPrescriptions]]" active-item="{{activeDrug}}">
                        <vaadin-grid-column width="100px">
                            <template class="header">
                                <vaadin-grid-sorter path="description">[[localize('dru_des','Drug descr.',language)]]</vaadin-grid-sorter>
                            </template>
                            <template>
                                <div class="cell frozen">[[_drugDescription(item.svc)]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column width="200px">
                            <template class="header">
                                [[localize('pos','Posology',language)]]
                            </template>
                            <template>
                                <div class="cell frozen">[[_drugPosology(item.svc)]]</div>
                            </template>
                        </vaadin-grid-column>
                        <template is="dom-repeat" items="[[_splitColumns]]" as="column" index-as="columnIndex">
                            <vaadin-grid-column flex-grow="0" width="50px">
                                <template class="header">
                                    [[_columnName(columnIndex)]]
                                </template>
                                <template>
                                    <vaadin-checkbox id="[[item.id]]:[[columnIndex]]" disabled="[[!_enabled(columnIndex,index,_drugsOnPrescriptions,_drugsOnPrescriptions.*)]]" checked="[[_drugOnPrescription(item,columnIndex,_splitColumns)]]" on-checked-changed="_setDrugOnPrescription"></vaadin-checkbox>
                                </template>
                            </vaadin-grid-column>
                        </template>
                    </vaadin-grid>
                    <template is="dom-if" if="[[!ehealthSession]]">
                        <paper-button class="warning ehbox" on-tap="_importKeychain">
                            <iron-icon icon="warning"></iron-icon> [[localize('ehe_is_not_con','eHealth is not connected',language)]]
                        </paper-button>
                    </template>
                    <template is="dom-if" if="[[!fullProfile]]">
                        <paper-button class="warning" on-tap="_myProfile">
                            <iron-icon icon="warning"></iron-icon> [[localize('recipe_warning','To print recip-e, you HAVE to inquire your ADRESS and PHONE NUMBER in your profile !',language)]]
                        </paper-button>
                    </template>
                </div>
                <div class="buttons">
                    <!-- <vaadin-date-picker id="deliveryDate" label="Date de délivrance" value="{{deliveryDateString}}" i18n="[[i18n]]"></vaadin-date-picker> -->
                    <dynamic-date-field id="deliveryDate" class="deliveryDate" label="Date de délivrance" value="{{deliveryDateString}}" i18n="[[i18n]]"></dynamic-date-field>
                    <div class="printButton">
                        <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
                        <paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="_printPrescriptions" disabled="[[!_printEnabled(_drugsOnPrescriptions,_drugsOnPrescriptions.*,_splitColumns)]]">[[localize('pri','Print',language)]]</paper-button>
                    </div>
                </div>
            </template>
        </paper-dialog>

        <canvas id="barCode"></canvas>
`;
  }

  static get is() {
      return 'ht-pat-prescription-dialog';
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
          patient: {
              type: Object
          },
          selectedFormat: {
              type: String,
              value: 'presc'
          },
          currentContact: {
              type: Object
          },
          deliveryDateString: {
              type: String,
              value: moment().format("YYYY-MM-DD")
          },
          endDateForExecutionString: {
              type: String,
              value: moment().add(3, "M").subtract(1, "d").format("YYYY-MM-DD")
          },
          globalHcp: {
              type: Object
          },
          drugsRefresher: {
              type: Number,
              value: 0
          },
          _printError: {
              type: String,
              value: ""
          },
          _printErrorDetails: {
              type: String,
              value: ""
          },
          _revokeTryAgainCallback: {
              type: Function,
              value: function(){}
          },
          _drugsToBePrescribed: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          _splitColumns: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          _drugsOnPrescriptions: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          _fetchRidSentListEnabled: {
              type: Boolean,
              value: false,
          },
          prescriptionTab: {
              type: String,
              value: 'toSend'
          },
          _isFetchingRecipeList: {
              type: Boolean,
              value: false
          },
          _reimbursementReasonToInstructions: {
              type: Object,
              value: {
                  tirdpartypaid: "PAYING_THIRD_PARTY",
                  firstdose: "FIRST_DOSE",
                  seconddose:"SECOND_DOSE",
                  thirddose: "THIRD_DOSE",
                  chronicalrenalcarepath: "CHRONIC_KINDEY_DISEASE",
                  diabetescarepath: "DIABETES_TREATMENT",
                  diabeteconvention: "DIABETES_CONVENTION",
                  notreimbursable: "NOT_REIMBURSABLE"
              }
          }
      }
  }

  static get observers() {
      return [
          '_setPrintSize(selectedFormat)',
          '_fetchRidSentList(_drugsToBePrescribed)',
          '_populateDrugsOnPrescriptions(_drugsToBePrescribed)',
          '_refreshSplitColumns(_drugsOnPrescriptions,_drugsOnPrescriptions.*)',
      ];
  }

  constructor() {
      super();
  }

  _setPrintSize() {
      localStorage.setItem('prefillFormat', this.selectedFormat)
  }

  ready() {
      super.ready();
      this.set('selectedFormat', localStorage.getItem('prefillFormat') ? localStorage.getItem('prefillFormat') : 'presc')
      //console.log("READY presc")
  }

  open() {
      this.$.dialog.open()
      this._refreshDrugsToBePrescribed()
      this.api && this.api.isElectronAvailable()
          .then(hasElectron => hasElectron ? fetch(`${_.get(this,"api.electronHost","http://127.0.0.1:16042")}/getPrinterSetting`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                  userId: this.user.id
              })
          })
              .then(response => response && response.status===200 ? response.json() : Promise.resolve({}))
              .then( data => {
                  this.set('selectedFormat',data && data.data && JSON.parse(data.data) && JSON.parse(data.data).find(x => x.type==="recipe") ? JSON.parse(data.data).find(x => x.type==="recipe").format : "A4")
              }): this.set('selectedFormat',"A4") )
  }

  _entitiesNotifyResize() {
      const entities = this.root.querySelector('#sent-entities-list')
      entities.notifyResize()
  }

  _isSentView() {
      //console.log("is sent view")
      return this.prescriptionTab == 'sent'
  }

  _isToSendView() {
      //console.log("is to send view")
      if(this.prescriptionTab == 'toSend') {
          return true
      } else {
          this._fetchRidSentListEnabled = true
          this._fetchRidSentList()
          return false
      }
  }

  _columnName(idx) {
      return `#${idx + 1}`;
  }

  _getRidLabel(item) {
      if(item.rid) {
          return item.rid
      } else {
          if(item.drugs) {
              return this.localize('paper', 'Papier', this.language)
          } else {
              return ""
          }
      }
  }

  _getRidDate(item) {
      if(item.creationDate) {
          return moment(item.creationDate).format("DD-MM-YYYY")
      } else {
          if(item.drugs) {
              return moment().format("DD-MM-YYYY")
          } else {
              return ""
          }
      }
  }

  _revokeRIDHandler(e) {
      const rid = e.target.dataset.rid
      this.set('_printError', this.localize("confirm_revoke_recipe", "Etes-vous sur de vouloir revoquer le prescription recipe suivante ?", this.language))
      this.set('_printErrorDetails', rid)
      this.set('_revokeTryAgainCallback', () => this._revokeRID(rid))

      this.$.loading.close();
      setTimeout(() => this.$.confirmRevoke.open(),10) // dialog doesn't open a second time without setTimeout
  }

  _revokeRID(rid) {
      if(rid) {
          if (this.patient.ssin && this.api.tokenId) { // if ehealth connected
              const group = this.ridSentList.find(group=> group.rid === rid)
              if(group.itemType === 'local') { // not found on remote, just mark them as revoked locally
                  this._markDrugsAsNotSent(group.drugs)
              } else {
                  this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
                      this.api.fhc().Recipecontroller().revokePrescriptionUsingDELETE(this.api.keystoreId, this.api.tokenId, "persphysician", hcp.nihii, hcp.ssin, hcp.lastName, this.api.credentials.ehpassword, rid, "no reason specified")
                          .then(isDeleted => {
                              console.log("delete rid: ", isDeleted)
                              if(isDeleted) {
                                  if(group) {
                                      this._markDrugsAsNotSent(group.drugs)
                                  } else {
                                      console.log("not found or no drugs in contact to mark as revoked")
                                  }
                              } else {
                                  throw "Server say not deleted"
                              }
                          })
                          .catch(error => {
                              console.log("error:", error)
                              this.set('_printError', this.localize("error_revoke_recipe", "Error while revoking Recipe:", this.language))
                              this.set('_printErrorDetails', error)
                              this.set('_revokeTryAgainCallback', () => this._revokeRID(rid))

                              this.$.loading.close();
                              setTimeout(() => this.$.tryAgainRevoke.open(),10) // dialog doesn't open a second time without setTimeout
                          })
                  )
              }
          } else {
              console.log("no niss or no recip-e", this.patient.ssin, this.api.tokenId)
              if(!this.patient.ssin) {
                  this.set('_printError', this.localize("the_ni_of_the_pat_is_not_val_or_mis", "no niss", this.language))
              } else {
                  this.set('_printError', this.localize('no_ehe_con', "You have no ehealth session.", this.language))
              }
              this.set('_printErrorDetails', "")
              this.set('_revokeTryAgainCallback', () => this._revokeRID(rid))
              this.$.loading.close();
              setTimeout(() => this.$.confirmNoRecipe.open(),10) // dialog doesn't open a second time without setTimeout
          }
      } else {
          // not a recipe
          console.log("not a recipe")
          const papergroup = this.ridSentList.find(group=> !group.rid)
          if(papergroup) {
              this._markDrugsAsNotSent(papergroup.drugs)
          } else {
              console.log("no paper prescription to revoke")
          }
      }
  }

  _printRID(e) {
      const rid = e.target.dataset.rid // if rid is null, norecipe is printed
      const ridDrugs = this.ridSentList.find(group=> group.rid === rid).drugs
      const splitCols = [{rid: rid, drugIds: ridDrugs.map(d => d.id)}]
      const element = this.root.querySelector("#barCode");
      const toPrint = this._formatPrescriptionsBody(splitCols,ridDrugs,this.patient,this.globalHcp,moment(this.deliveryDateString+"").format("DD/MM/YYYY"),moment(this.endDateForExecutionString+"").format("DD/MM/YYYY"),element)
      this._pdfReport(ridDrugs,toPrint,this.selectedFormat)
  }

  _drugIsType(item, itemType) {
      return item.itemType === itemType
  }

  _canPrint(item) {
      return item.drugs && item.drugs.length > 0
  }

  _fetchRidSentList() {
      //console.log("_fetchRidSentList()")
      if(!this._fetchRidSentListEnabled) { // prevent fetch when opening patient
          console.log("skip fetch recipe")
          return
      }

      this._isFetchingRecipeList = true

      // local RIDs
      const groupObj = _.groupBy(this._drugsAlreadyPrescribed(), svc => this.api.contact().medicationValue(svc, this.language).prescriptionRID)
      const local_presclist = Object.keys(groupObj).map(key => {
          return {
              "drugs": groupObj[key],
              "itemType": "local",
              "rid": this.api.contact().medicationValue(groupObj[key][0], this.language).prescriptionRID
          }
      })

      const extend_list = list => {
          var ridlist = []
          console.log("before", list)
          ridlist = list.length > 0 ? list : local_presclist
          console.log("after", ridlist)

          this.set('ridSentList', ridlist)
          this.set('ridSentListExtended', _.flattenDeep(ridlist.map(g => {
              return [
                  g,
                  g.drugs ? g.drugs.map(d=> {
                      return {
                          itemType: "drug",
                          drugPosology: this._drugPosology(d),
                          drugDescription: this._drugDescription(d),
                      }
                  }) : []
              ]
          })))

      }

      let endlist = []
      if (this.patient.ssin && this.api.tokenId) { // if ehealth connected
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.fhc().Recipecontroller().listOpenPrescriptionsByPatientUsingGET(this.api.keystoreId, this.api.tokenId, "persphysician", hcp.nihii, hcp.ssin, hcp.lastName, this.patient.ssin, this.api.credentials.ehpassword)
                  .then(presclist => {
                      presclist = presclist.reverse()
                      console.log("presclist", presclist)
                      if(presclist.length > 0) {
                          presclist.forEach(remote_item => {
                                  const found = local_presclist.find(local_item => local_item.rid === remote_item.rid)
                                  if(found) {
                                      found.itemType = "remote" // if itemType === 'local' then the RID was not found on remote
                                      endlist.push(found)
                                  } else {
                                      remote_item.drugs = [] // no drug list received from recipe
                                      remote_item.itemType = "remote"
                                      endlist.push(remote_item)
                                  }
                          })
                          endlist = _.concat(local_presclist.filter(item => item.itemType === 'local'), endlist)
                      }
                  })
                  .then(() => {
                      this._isFetchingRecipeList = false
                      extend_list(endlist)
                  })
          ).catch(error => {
              console.log(error)
              extend_list([])
              this._isFetchingRecipeList = false
          })
      } else {
          this._isFetchingRecipeList = false
          extend_list([])
      }

      //console.log("_fetchRidSentList(): ridSentListExtended",this.ridSentListExtended )
  }

  _isDrugAlreadyPrescribed(s) {
      return s && s.tags && s.tags.find(t => (t.type === 'CD-ITEM' && t.code === 'treatment') || (t.type === 'ICURE' && t.code === 'PRESC')) && !s.endOfLife && s.tags.find(t => t.type === 'CD-LIFECYCLE' && ['ordered', 'completed', 'delivered'].includes(t.code)) && this.api.contact().medicationValue(s, this.language)
  }

  _isDrugNotPrescribed(s) {
      return s && s.tags && s.tags.find(t => (t.type === 'CD-ITEM' && t.code === 'treatment') || (t.type === 'ICURE' && t.code === 'PRESC')) && !s.endOfLife && !s.tags.find(t => t.type === 'CD-LIFECYCLE' && ['ordered', 'completed', 'delivered'].includes(t.code)) && this.api.contact().medicationValue(s, this.language)
  }

  _drugsAlreadyPrescribed() {
      return this.api && this.currentContact && this.currentContact.services && this.currentContact.services.filter(this._isDrugAlreadyPrescribed.bind(this)) || [];
  }

  _refreshDrugsToBePrescribed() {
      //console.log("_refreshDrugsToBePrescribed()")
      let tbp = this.api && this.currentContact && this.currentContact.services && this.currentContact.services.filter(this._isDrugNotPrescribed.bind(this)) || [];
      this.set('_drugsToBePrescribed', tbp)
      return tbp
  }

  _drugsSelectedAndToBePrescribed() {
      return this._drugsToBePrescribed.filter(d=>this._drugsOnPrescriptions.find(dop=>dop.id === d.id && dop.column >= 0))
  }

  _drugDescription(svc) {
      return svc && this.api.contact().medication().medicationNameToString(this.api.contact().medicationValue(svc, this.language), this.language) || "N/A";
  }

  _drugOnPrescription(svc, index) {
      const col = this._splitColumns[index];
      console.log("_drugOnPrescription: ", index, svc, col, svc && col && col.drugIds && col.drugIds.includes(svc.id) || false)
      return svc && col && col.drugIds && col.drugIds.includes(svc.id) || false;
  }

  _drugPosology(svc) {
      return svc && this.api.contact().medication().posologyToString(this.api.contact().medicationValue(svc, this.language), this.language) || this.localize("known_usage", "Usage connu");
  }


  _enabled(column, line) {
      if (line === undefined) {
					return true;
      }

      const dop = this._drugsOnPrescriptions;
      if (dop.length < 5) {
					return true;
      }

      const sums = dop.reduce((sums, i) => {
          if(i.column >= 0) {
              sums[i.column] = (sums[i.column] || 0) + 1;
          }
					return sums;
      }, []);

      if ((sums[column] || 0) < 5) {
					return true;
      }

      const ids = this._drugsToBePrescribed.map(d => d.id);
      const id = ids[line];
      return dop.find(x => x.id === id && x.column === column) || false;
  }

  _importKeychain() { // open keychain importation window
      this.$.prescriptionDialog.close()
      this.dispatchEvent(new CustomEvent("open-utility", {composed: true, bubbles: true, detail: {panel:'import-keychain'}}))
  }

  _myProfile() { // open profile
      this.dispatchEvent(new CustomEvent("open-utility", {composed: true, bubbles: true, detail: {panel:'my-profile', tab:1}}))
  }


  _convertForRecipe(medications) {
      // @todo: use code api
      const medsDup = _.cloneDeep(medications);
      medsDup.forEach(med => {
          const medicationValue = this.api.contact().medicationValue(med, this.language);
          if (!medicationValue) return;
          if (medicationValue.regimen && medicationValue.regimen.length) {
              medicationValue.knownUsage = false;
              const customReg = medicationValue.regimen.filter(r => r.dayPeriod && (r.dayPeriod.type === "care.topaz.customDayPeriod"));
              if (customReg && customReg.length) {
                  medicationValue.regimen = medicationValue.regimen.filter(r => !r.dayPeriod || !(r.dayPeriod.type === "care.topaz.customDayPeriod"));
                  customReg.forEach(r => {
                      if (r.dayPeriod.code === "midday") {
                          medicationValue.regimen.push({timeOfDay: "120000", administratedQuantity: r.administratedQuantity});
                      } else if (r.dayPeriod.code === "afterwakingup") {
                          medicationValue.regimen.push({timeOfDay: "63000", administratedQuantity: r.administratedQuantity});
                      }
                  });
              }
              medicationValue.regimen.filter(r => r.administratedQuantity.quantity === "1/2").forEach(i => i.administratedQuantity.quantity = 0.5);
              medicationValue.regimen.filter(r => r.administratedQuantity.quantity === "1/3").forEach(i => i.administratedQuantity.quantity = 0.33);
              medicationValue.regimen.filter(r => r.administratedQuantity.quantity === "1/4").forEach(i => i.administratedQuantity.quantity = 0.25);
          } else {
              if (!medicationValue.instructionForPatient) {
                  medicationValue.knownUsage = true;
              }
          }
          if (medicationValue.substanceProduct) {
              if (medicationValue.substanceProduct.intendedcds && medicationValue.substanceProduct.intendedcds.some(intendedcd => intendedcd.type === "CD-VMPGROUP")) {
                  medicationValue.substanceProduct.intendedcds = [];
              }
          }
          if (medicationValue.reimbursementReason) {
              const key = Object.keys(this._reimbursementReasonToInstructions).find(key => key === medicationValue.reimbursementReason.code);
              medicationValue.instructionsForReimbursement = key && this._reimbursementReasonToInstructions[key] || this._reimbursementReasonToInstructions.notreimbursable;
          }
       });
      return medsDup;
  }

  _printPrescriptions(e) {
      if(!this._printEnabled()) {
          console.log("nothing to print")
          return
      }
      this.$.confirmNoRecipe.close()
      this.$.loading.open();
      const splitColumns = this._splitColumns.filter(c => c && c.drugIds && c.drugIds.length > 0)
      const drugsToBePrescribed = this._drugsSelectedAndToBePrescribed();
      const element = this.root.querySelector("#barCode");
      let toPrint = undefined
      this.set('selectedFormat', (this.patient.ssin && this.api.tokenId) ? this.selectedFormat : 'presc')


      if (this.patient.ssin && this.api.tokenId){ // if ehealth connected
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              Promise.all(
                  splitColumns.map(c =>
                      this.api.fhc().Recipecontroller().createPrescriptionUsingPOST(this.api.keystoreId, this.api.tokenId, "persphysician", hcp.nihii, hcp.ssin, hcp.lastName, this.api.credentials.ehpassword, {
                          patient: this.patient,
                          hcp: hcp,
                          feedback: false,
                          medications: this._convertForRecipe(drugsToBePrescribed).filter(s => c.drugIds.includes(s.id)).map(s => this.addEmptyPosologyIfNeeded(this.api.contact().medicationValue(s, this.language))),
                          deliveryDate: this.api.moment(this.deliveryDateString).format("YYYYMMDD")
                      }).then(prescri => {
                          c.rid = prescri.rid
                          c.recipeResponse = prescri
                          drugsToBePrescribed.filter(s => c.drugIds.includes(s.id)).map(s => this.api.contact().medicationValue(s, this.language)).map(mv => mv.prescriptionRID = prescri.rid)
                      } )
                  )
              )
          )
              .catch(error=>{
                  this.set('_printError', this.localize("error_send_recipe", "Error while sending to Recipe:", this.language))
                  this.set('_printErrorDetails', error)

                  this.$.loading.close();
                  setTimeout(() => this.$.confirmNoRecipe.open(),10) // dialog doesn't open a second time without setTimeout
                  throw "ERROR_WHILE_RECIPE"
              })
              .then(()=>{
                  this._markDrugsAsSent(drugsToBePrescribed)
              })
              .then(()=>{
                  toPrint = this._formatPrescriptionsBody(splitColumns,drugsToBePrescribed,this.patient,this.globalHcp,moment(this.deliveryDateString+"").format("DD/MM/YYYY"),moment(this.endDateForExecutionString+"").format("DD/MM/YYYY"),element)
                  this._pdfReport(drugsToBePrescribed,toPrint,this.selectedFormat)
                  this.$.loading.close();
              })
              .catch(error=>{
                  if(error !== "ERROR_WHILE_RECIPE") {
                      console.log("Recipe sent but error when trying to print or mark drugs as sent: ", error)
                  }
              })
      } else {
          console.log("no niss or no recip-e", this.patient.ssin, this.api.tokenId)
          if(!this.patient.ssin) {
              this.set('_printError', this.localize("the_ni_of_the_pat_is_not_val_or_mis", "no niss", this.language))
          } else {
              this.set('_printError', this.localize('no_ehe_con', "You have no ehealth session.", this.language))
          }
          this.set('_printErrorDetails', "")
          this.$.loading.close();
          setTimeout(() => this.$.confirmNoRecipe.open(),10) // dialog doesn't open a second time without setTimeout
      }
  } // print end

  addEmptyPosologyIfNeeded(mv){
      if(mv.instructionForPatient || mv.regimen && mv.regimen.length > 0){
          return mv
      } else {
          mv.instructionForPatient = this.localize('known_use','Known use',this.language);//"pas d'application";
          return mv;
      }
  }

  _formatBody(ids, drugs) {
      const element = this.root.querySelector("#barCode");
      return this._formatPrescriptionsBody(ids, drugs, this.patient, this.globalHcp, moment(this.deliveryDateString + "").format("DD/MM/YYYY"), moment(this.endDateForExecutionString+"").format("DD/MM/YYYY"), element)
  }

  _print(e) {
      const service = e.detail.service;
      const medicationValue = service ?
          _.get(this.api.contact().preferredContent(service, this.language), "medicationValue", null) : null;
      const rid = _.get(medicationValue, "prescriptionRID", null);
      const ids = ((medicationValue.status & STATUS_SENT) && rid) ?
          [{ drugIds: service.id, rid: rid }] :
          [{ drugIds: service.id }];
      const drugs = [service];
      const toPrint = this._formatBody(ids, drugs);
      this._pdfReport(drugs, toPrint, 'presc')
          .then(() => {
              console.log("printed")
              //this._markDrugsAsSent(drugsToBePrescribed)
          })
  }

  _printPrescriptionNoRecipe(e) {
      if(!this._printEnabled()) {
          console.log("nothing to print")
          return
      }
      const splitColumns = this._splitColumns.filter(c => c && c.drugIds && c.drugIds.length > 0)
      const drugsToBePrescribed = this._drugsSelectedAndToBePrescribed();
      this.set('selectedFormat', (this.patient.ssin && this.api.tokenId) ? this.selectedFormat : 'presc')
      const element = this.root.querySelector("#barCode");

      const toPrint = this._formatPrescriptionsBody(splitColumns,drugsToBePrescribed,this.patient,this.globalHcp,moment(this.deliveryDateString+"").format("DD/MM/YYYY"),moment(this.endDateForExecutionString+"").format("DD/MM/YYYY"),element)
      this._pdfReport(drugsToBePrescribed,toPrint,this.selectedFormat)
          .then(()=>{
              this._markDrugsAsSent(drugsToBePrescribed)
          })
  }

  _formatPrescriptionsBody(splitColumns,drugsToBePrescribed,patient,hcp,deliveryDate, endDateForExecution, element) {
      // console.log('_formatPrescriptionsBody, hello hcp is : ',hcp)
      let prescriToPrint = [], allPages = []
      let prescNum = 0, pageNum = 1

      const inRecipeMode = this.patient.ssin && this.api.tokenId && splitColumns.find(c=>c.rid) // else print good old prescription format
      splitColumns.forEach((c, idx) => {
          const ridOrNihii = c.rid ? c.rid : hcp.nihii;
          JsBarcode(element, ridOrNihii, {format: "CODE128A", displayValue: false, height: 75});
          const jpegUrl = element.toDataURL("image/jpeg");
          const ridLabel = ridOrNihii.split('').join('&nbsp;')
          prescNum += 1
          const prescriByPage = this.selectedFormat == 'A4' ? 2 : 1
          if (prescNum > prescriByPage * pageNum) { // if doesn't fit in page
              pageNum += 1 // add a page
          } // will be set on next page

          let prescArray = [], posology = {}
          _.flatMap(drugsToBePrescribed.filter(s => c.drugIds.includes(s.id)), s => {
              const medicationApi = this.api.contact().medication();
              const med = this.api.contact().medicationValue(s, this.language);
              const medPoso = this.api.contact().medication().posologyToString(med, this.language) || "N/A";
              const medR = medicationApi.medicationNameToString(med, this.language)
              const medS = med.regimen && med.regimen.length && medicationApi.posologyToString(med, this.language) || med.instructionForPatient || this.localize("known_usage", "Usage connu");
              const thisMed = {'S': medS, 'R': medR, 'poso':medPoso};
              const medC = medicationApi.reimbursementReasonToString(med, this.language);
              if (medC) {
                  Object.assign(thisMed, {'C': medC});
              }
              prescArray.push(thisMed) // add to the medications list
          }) // flatmap end
          // console.log("prescArray",prescArray)

          let prescriContent = ""
          let articlePoso = []
          let articleMedWithPoso = []
          let medicName = ""

          prescArray.map(onePrescri => { // create prescription content
              prescriContent += (`<article>
                  <p class="bigtxt" style="white-space: pre-line;"><span class="bold bigtxt">R/</span> ${onePrescri.R}</p>
                  <p class="bigtxt"><span class="bold bigtxt">S/</span> ${onePrescri.S}</p>` +
                  (onePrescri.C && `<p class="bigtxt"><span class="bold bigtxt">C/</span> ${onePrescri.C}</p>` || "") +
                  `</article>`);
              articlePoso.push(onePrescri.poso) // add posology to the list
              articleMedWithPoso.push({medR: onePrescri.R, poso: onePrescri.poso})//add medication with posology to the list
              medicName = onePrescri.R
          }) // map end

          const prescri = inRecipeMode ? `<article class="prescription">
              <header>
                  <img src="${jpegUrl}" alt="code-bar">
                  <div class="barcode-num">${ridLabel}</div>
                  <hr>
                  <h2>${this.localize('proof_of_e_prescription','Please present this document to the pharmacist to scan the barcode and issue the prescribed medications',this.language)}</h2>
                  <hr>
                  <p class="center">${this.localize('ple_present_doc','Please present this document to the pharmacist to scan the barcode and issue the prescribed medications',this.language)}.</p>
                  <hr>
                  <div class="profile">
                      <small>${this.localize("prescriber_name_lastname","Prescriber first name and last name",this.language)}&nbsp;:</small>
                      <ul class="prescripteur-details">
                          <li><b>${hcp.firstName} ${hcp.lastName}</b></li>
                          <li><b>`+ this.localize('inami','inami',this.language) +`&nbsp;:</b> ${hcp.nihii}</li>
                      </ul>
                  </div>
                  <hr>
                  <div class="profile">
                      <small>${this.localize("benef_name_lastname","Name and surname of the beneficiary",this.language)}&nbsp;:</small>
                      <ul class="patient-details">
                          <li><b>${this.patient.firstName} ${this.patient.lastName}</b></li>
                          <li><b>NISS&nbsp;:</b> ${this.patient.ssin}</li>
                      </ul>
                  </div>
                  <hr>
              </header>
              <h2>${this.localize('content_of_e_prescription','Content of electronical prescription',this.language)}</h2>
              <hr>
              <div class="prescription-content">
                  ${prescriContent}
              </div>
              <footer>
                  <hr>
                  <p class="center">${this.localize('no_man_ad','No manuscript additions will be taken into account',this.language)}.</p>
                  <hr>
                  <small class="center">${this.localize('date','Date',this.language)}&nbsp;:</small>
                  <p class="center">${deliveryDate}</p>
                  <hr>
                  <small class="center">${this.localize('deliv_from','Deliverable from',this.language)}&nbsp;:</small>
                  <p class="center">${deliveryDate}</p>
                  <hr>
                  <small class="center">${this.localize('EndDateForExecution','End date for execution',this.language)}&nbsp;:</small>
                  <p class="center">${endDateForExecution}</p>
              </footer>
          </article>` : prescriContent; // create single prescription body

          prescriToPrint.push({name:medicName,'prescriBody':prescri,'page':pageNum,'posology':articlePoso, 'medWithPosology': articleMedWithPoso,'myRid':ridLabel, 'myJpegUrl':jpegUrl}) // add a prescription with its datas
      }) // splitCol forEach end
      // console.log("prescriToPrint",prescriToPrint)

      // console.log("allPages before map",allPages)
      prescriToPrint.map((prescri)=>{ // for every prescription found in list
          let singlePage = {body:'',poso:[],rid:'',jpegUrl: ''}
          singlePage.body += (prescri.prescriBody) // get the body
          singlePage.name = prescri.name
          singlePage.rid = prescri.myRid
          singlePage.jpegUrl = prescri.myJpegUrl
          prescri.medWithPosology.map((poso)=>{ // check if there's posology
              singlePage.poso.push(poso)
          })
          if (!allPages[prescri.page-1]) {
              allPages.push([singlePage]) // assign posology to prescription
          } else {
              allPages[prescri.page-1].push(singlePage)
          }
      })
      // console.log("allPages after map",allPages)

      const hcpAddress = _.chain(_.get(hcp, "addresses", {})).filter({addressType:"work"}).head().value() ||
          _.chain(_.get(hcp, "addresses", {})).filter({addressType:"home"}).head().value() ||
          _.chain(_.get(hcp, "addresses", {})).head().value() ||
          {}
      ;

      const hcpTel = _.trim( _.get( _.filter(_.get(hcpAddress, "telecoms", {}), {telecomType:"phone"}), "[0].telecomNumber", "" ) ) ||
          _.trim( _.get( _.filter(_.get(hcpAddress, "telecoms", {}), {telecomType:"mobile"}), "[0].telecomNumber", "" ) )


      let allPagesBody = ""
      allPages.map((onePage)=>{
          let posoByDay = { // make the arrays that will receive sorted posologies
                  'byMoment':[],
                  'byHour':[]
              },
              posoByWeek = [],
              posoByMonth = []
          if (typeof onePage == 'object') {
              let posoTable = ''
              let thatBody = ''
              onePage.map((onePrescription)=>{
                  let singleName = onePrescription.name
                  if (inRecipeMode) {
                      thatBody += onePrescription.body
                      onePrescription.poso.map((singlePoso)=>{posoTable += "<tr><td><b>"+singlePoso.medR+"</b></td><td>"+singlePoso.poso.toString()+"</td></tr>"}) // construct the posology body
                  }else{
                      thatBody += `
                      <div id="prescription">
                          <header id="header" class="flexbox vert bt center">
                              <div class="horiz">
                                  <div class="cell br w50 p1025">
                                      <img class="codbar" src="${onePrescription.jpegUrl}" alt="code-bar">
                                      <span>${onePrescription.rid}</span>
                                  </div>
                                  <div class="cell w50">
                                      <p>${this.localize("prescriber_name_lastname","Prescriber first name and last name",this.language)}</p>
                                      <p class="bold">Dr. ${hcp.lastName} ${hcp.firstName}</p>
                                  </div>
                              </div>
                          </header>
                          <div class="horiz w100">
                              <div class="vert bt bb flex1 cell">
                                  <p class="uppercase">${this.localize("complete_by_prescriber","To be completed by the prescriber",this.language)}</p>
                                  <p>${this.localize("benef_name_lastname","Name and surname of the beneficiary",this.language)} : <span class="bold">${this.patient.firstName} ${this.patient.lastName}</span></p>
                              </div>
                          </div>
                          <main id="main" class="flexbox flex1 horiz bb">
                              <div class="cell br w33">
                                  <p>${this.localize("reserved_sticker","Reserved for the packaging sticker",this.language)}</p>
                              </div>
                              <div class="cell">
                                  ${onePrescription.body}
                              </div>
                          </main>
                          <footer id="footer" class="flex horiz bb">
                              <div class="flex1 cell br w50">
                                  <p class="title bold center w100">${this.localize("prescriber_stamp","Prescriber's stamp",this.language)}</p>
                                  <ul>
                                      <li>Dr. ${hcp.lastName} ${hcp.firstName}</li>` +

                          "<li>" + _.get(hcpAddress, "street", "") + ", " + _.get(hcpAddress, "houseNumber", "") + ( _.trim(_.get(hcpAddress, "postboxNumber", "")) ? " / " + _.trim(_.get(hcpAddress, "postboxNumber", "")) : "" ) + "</li>" +
                          "<li class='uppercase'>" + _.get(hcpAddress, "postalCode", "") + " - " + _.get(hcpAddress, "city", "") + "</li>" +
                          ( _.trim(hcpTel) ? "<li>Tel: " + _.trim(hcpTel) + "</li>" : "" ) + `

                                      <li><span class="uppercase">`+ this.localize('inami','inami',this.language) +`</span>&nbsp;: ${hcp.nihii}</li>
                                  </ul>
                              </div>
                              <div class="w50">
                                  <div class="vert w100">
                                      <div class="cell bb center">
                                          <p class="mt0">${this.localize('date_and_sign_of_presc',"Date and prescriber's signature",this.language)}</p>
                                          <p>${deliveryDate}</p>
                                      </div>
                                      <div class="cell">
                                          <p class="center">${this.localize('deliv_date','Deliverable from the specified date or from',this.language)}&nbsp;:</p>
                                          <p class="signdate center bold w100">${deliveryDate}</p>
                                      </div>
                                      <div class="cell">
                                          <p class="center">${this.localize('EndDateForExecution','End date for execution',this.language)}&nbsp;:</p>
                                          <p class="signdate center bold w100">${endDateForExecution}</p>
                                      </div>
                                  </div>
                              </div>
                          </footer>
                          <aside>
                              <div class="horiz">
                                  <p class="big uppercase center w100 bold fs1">${this.localize('presc_of_med','Prescription of drugs',this.language)}</p>
                              </div>
                              <div class="horiz">
                                  <p class="big uppercase center w100 bold fs1">${this.localize('presc_of_med_20191101','Application from November 1st 2019',this.language)}</p>
                              </div>
                          </aside>
                      </div>`
                  }
              })
              if (inRecipeMode) {
                  const onePageBodyTop = `<div class="page"><main>${thatBody}</main><footer><table><thead><tr><td>${this.localize('name','Name',this.language)}</td><td>${this.localize('freq','Frequency',this.language)}</td></tr></thead><tbody>`; // prepare the PDF's pages
                  const onepageBodyBottom = `</tbody></table></footer></div>`;
                  allPagesBody += onePageBodyTop+posoTable+onepageBodyBottom;
              } else {
                  allPagesBody += `<div class="page">
                      ${thatBody}
                  </div>`;
              } // elif end

          }
      }) // allPage map end

      const toPrint = inRecipeMode ?
          `<html>
              <head><style>
              body {margin: 0;width: ${this.selectedFormat == 'A4' ? '210mm' : '105mm'};height: ${this.selectedFormat == 'A4' ? '297mm' : '210mm'};}
              body > div.page {display:block;size: A4;margin: 0;width: ${this.selectedFormat == 'A4' ? '210mm' : '105mm'};height: ${this.selectedFormat == 'A4' ? '297mm' : '210mm'};page-break-after: always;display:flex;flex-direction:column;}
              body > div.page:last-child {page-break-after: avoid;}
              body > div.page >main {display: flex;width: 100%;}
              body > div.page > main > article.prescription {padding-top: 15px;width: ${this.selectedFormat == 'A4' ? '105mm' : '100%'};height: ${this.selectedFormat == 'A4' ? '200mm' : '210mm'};overflow: hidden;font-size: 12px;display: flex;flex-direction: column;}
              body > div.page > main > article.prescription:first-child{border-right: ${this.selectedFormat == 'A4' ? '.5px dashed lightgrey' : 'none'};}
              body > div.page > main > article img {display: block;width: 95%;max-height:80px;margin: 0 auto;text-align: center;}
              body > div.page > main > article div.barcode-num {margin: 3px 25px 10px 25px;font-size: 1.2em;text-align: justify;}
              body > div.page > main > article div.barcode-num:after {content: "";display: inline-block;width: 100%;}
              body > div.page > main > article h2 {font-size: .9em;text-transform: uppercase;margin: 5px auto;text-align: center;}
              body > div.page > main > article header p.center {text-align: center;max-width: 80%;margin: 5px auto;}
              body > div.page > main > article .prescription-content p.center {margin:2px;text-align: center;}
              body > div.page > main > article small.center {text-align: center;width: 100%;display: block;margin: 0 auto;}
              body > div.page > main > article hr {border-top: 1px solid darkgrey;border-bottom: 0;margin: 0 10px;}
              body > div.page > main > article div.profile {margin: 0 25px;}
              body > div.page > main > article ul {padding-left: 0;list-style: none;margin-top: 2px;}
              body > div.page > main > article div.prescription-content {display: flex;padding: 0 25px;flex-direction: column;flex: 1;}
              body > div.page > main > article div.prescription-content > article {margin: 0 0 10px 0;}
              body > div.page > main > article div.prescription-content > article > p {font-size:1.1em; margin: 0;padding: 0;}
              body > div.page > main > article div.prescription-content > article > p > .bold {font-weight: bold;}
              body > div.page > main > article footer p {text-align: center;margin: 2px 0;}
              body > div.page > footer {${this.selectedFormat != 'A4' ? 'display:none;' : ''}border-top: .5px dashed lightgrey;text-align:center;padding:25px 20px 0 20px;}
              body > div.page > footer table {width: 100%;border-collapse: collapse;border-top:1px solid black;}
              body > div.page > footer table:first-child {border-top:none;}
              body > div.page > footer table tr td {font-size:.8em; border-bottom:1px solid black;text-align: left;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
              body > div.page > footer table tr td:first-child {width:258px;border-right:1px solid black;}
              body > div.page > footer table tr td:not(:first-child){padding: 0 5px;}
              body > div.page > footer table thead {font-weight: bold;border-bottom: 2px solid black;}
              body > div.page > footer table thead tr td {text-align: center;background-color: lightgrey;}
          </style></head><body>${allPagesBody}</body></html>`
          : // no eHe connection =
          `<html><head><style>
              /* body */
              body {margin: 0;padding: 0;}
              div.page {display:flex;flex-direction: row;margin: 0;padding:0;padding-top:20mm;width: ${this.selectedFormat == 'A4' ? '210mm' : '105mm'};height:200mm;overflow:hidden;page-break-after:always;}
              div.page:last-child {page-break-after: avoid;}
              div#prescription {display:flex;flex-direction:column;${this.selectedFormat == 'A4' && "width: 50%;border-left: .25px solid black; border-right: .25px solid black; border-bottom: .25px solid black;" || ""}}
              div#prescription:first-child {${this.selectedFormat == 'A4' ? "margin-right: 1px" : "margin: 0"}}
              * {font-size:10px;font-family: Arial,sans-serif;}
              *.bigtxt {font-size:13px; white-space: pre-line; }
              /* flex */
              *.flexbox, *.horiz, *.vert {display: flex;} *.horiz {flex-direction: row;} *.vert {flex-direction: column;} *.flex1 {flex:1;}
              /* elems */
              img.codbar {height:auto;width:100%;background: black;margin-bottom: 5px;} *.signdate {border-bottom: .25px dotted grey;} *.cell {padding: 5px; overflow: hidden;} article {margin-bottom: 15px;} article > p {margin: 0;}
              /* style */
              *.w100 {width:100%} *.w50 {width: 50%;} *.w40 {width:40%;} *.w33 {width: 33%;min-width:33%;} *.w20 {width: 20%;}
              *.bold {font-weight: bold;} *.p1025 {padding: 10px 25px;} *.mt0 {margin-top: 0;}
              *.br {border-right: .25px solid black;} *.bt {border-top: .25px solid black} *.bb {border-bottom: .25px solid black}
              *.center {text-align: center;} *.capitalize {text-transform: capitalize;} *.uppercase{text-transform: uppercase;e}
              *.right {text-align: right;} *.fs1 {font-size: 1em;} ul {list-style: none; padding-left: 0}
          </style></head><body>${allPagesBody}</body></html>`; // finalize PDF body

      //console.log("toPrint",toPrint)
      return toPrint
  }

  _pdfReport(drugsToBePrescribed,toPrint,size) {

      this.dispatchEvent(new CustomEvent('pdf-report',{detail: {loading: true}}))

      const pdfPrintingData = {
          downloadFileName: _.kebabCase([ "prescription", _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", ""), +new Date()].join(" ")) + ".pdf",
          documentMetas : {
              title : "Prescription",
              contactId : _.get(this.currentContact, "id", ""),
              created: ""+ +new Date(),
              patientId : _.trim(_.get(this.patient, "id", "")),
              patientName : _.compact([ _.get(this.patient, "lastName", ""), _.get(this.patient, "firstName", "") ]).join(" ")
          }
      }

      return this.api.pdfReport(mustache.render(toPrint, null), {
          type: "recipe",
          paperWidth: this.patient.ssin && this.api.tokenId && size == 'A4' ? 210 : 105,
          paperHeight: this.patient.ssin && this.api.tokenId && size == 'A4' ? 297 : 210,
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5
      })
      .then(({pdf:pdfFileContent, printed:wasPrinted}) => _.assign({pdfFileContent:pdfFileContent, printed:wasPrinted}, pdfPrintingData))
      .then(pdfPrintingData => this.api.message().newInstanceWithPatient(this.user, this.patient)
          .then(newMessageInstance=>_.assign({newMessageInstance: newMessageInstance}, pdfPrintingData))
          .then(pdfPrintingData=>this.api.message().createMessage(
                  _.merge(
                      pdfPrintingData.newMessageInstance,
                      {
                          transportGuid: "PRESCRIPTION:PHARMACEUTICALS:ARCHIVE",
                          recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.user.id))],
//TODO                              metas: pdfPrintingData.documentMetas,
                          toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.user.id)))],
                          subject: pdfPrintingData.documentMetas.title
                      }
                  )
              ).then(createMessageResponse=>_.assign({createMessageResponse: createMessageResponse}, pdfPrintingData)))
      )
      .then(pdfPrintingData=>this.api.document().newInstance(
              this.user,pdfPrintingData.createMessageResponse,
              {
                  documentType: 'report',
                  mainUti: this.api.document().uti("application/pdf"),
                  name: pdfPrintingData.documentMetas.title + " - " + pdfPrintingData.documentMetas.patientName
              }
          ).then(newDocumentInstance=>_.assign({newDocumentInstance:newDocumentInstance},pdfPrintingData))
      )
      .then(pdfPrintingData=>this.api.document().createDocument(pdfPrintingData.newDocumentInstance).then(createDocumentResponse=>_.assign({createDocumentResponse:createDocumentResponse},pdfPrintingData)))
      .then(pdfPrintingData=>this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user.healthcarePartyId, pdfPrintingData.createDocumentResponse, pdfPrintingData.pdfFileContent).then(encryptedFileContent=>_.assign({encryptedFileContent:encryptedFileContent},pdfPrintingData)))
      .then(pdfPrintingData=>this.api.document().setAttachment(pdfPrintingData.createDocumentResponse.id, null, pdfPrintingData.encryptedFileContent).then(setAttachmentResponse=>_.assign({setAttachmentResponse:setAttachmentResponse},pdfPrintingData)))
      .then(pdfPrintingData=>{
          this.dispatchEvent(new CustomEvent('save-document-as-service', {detail: {
              documentId: _.trim(_.get(pdfPrintingData, "createDocumentResponse.id", "")),
              stringValue: pdfPrintingData.documentMetas.title,
              contactId: pdfPrintingData.documentMetas.contactId,
          }}))
          return pdfPrintingData
      })
      .then(pdfPrintingData => !pdfPrintingData.printed && this.api.triggerFileDownload( pdfPrintingData.pdfFileContent, "application/pdf", pdfPrintingData.downloadFileName ))
      .catch(e=>{
          console.log(e)
          this.dispatchEvent(new CustomEvent('pdf-report',{detail: {loading: false}}))
      })
  }

  _markDrugsAs(drugs, code, status) {
      drugs.forEach(service => {
          const id = "CD-LIFECYCLE|" + code + "|1";
          const tag = service.tags.find(t => t.type === 'CD-LIFECYCLE')
          if (tag) {
              tag.id = id;
              tag.code = code
          } else
              service.tags.push(this.api.code().normalize({id: id}))
          const content = this.api.contact().preferredContent(service, this.language)
          if (content && content.medicationValue) {
              if ("status" in content.medicationValue) {
                  content.medicationValue.status &= STATUS_SENT | STATUS_NOT_SENT;
                  content.medicationValue.status |= status;
              } else
                  content.medicationValue.status = status;
          }
      });
      this._refreshDrugsToBePrescribed();
      this.dispatchEvent(new CustomEvent('pdf-report',{detail: {loading: false, success: true}}))
      this.dispatchEvent(new CustomEvent('save-contact', {detail: {contact: this.currentContact}, bubbles: true, composed: true}));
  }


  _markDrugsAsSent(drugsToBePrescribed) {
      this._markDrugsAs(drugsToBePrescribed, "ordered", STATUS_SENT);
  }

  _markDrugsAsNotSent(drugsToBePrescribed) {
      this._markDrugsAs(drugsToBePrescribed, "active", STATUS_NOT_SENT);
  }

  _populateDrugsOnPrescriptions() {
      //console.log('_populateDrugsOnPrescriptions()')
      this.set('_drugsOnPrescriptions', []) // ugly hack to force refresh due to polymer bug
      this.set('_drugsOnPrescriptions',
          this._drugsToBePrescribed.reduce((accu, s) => {
              const availableSpace = accu.reduce((acc,drug) => {
                  if(drug.column >= 0) {
                      acc[drug.column] >= 0 ? acc[drug.column]-- : acc[drug.column] = 4;
                  }
                  return acc
              }, []);
              availableSpace.push(5);
              let codes = s.codes && s.codes.map(c => c.code + '|' + c.type + '|' + c.version);
              let sameDrugColumnIndex = 0
              let compound = null
              if(!codes || !codes.length) {
                  codes = null
                  const content = this.api.contact().preferredContent(s,this.language)
                  compound = content && content.medicationValue && content.medicationValue.compoundPrescription
                  sameDrugColumnIndex = (accu.slice(0).reverse().find( drug => drug.compound == compound ) || {}).column
              }else {
                  sameDrugColumnIndex = (accu.slice(0).reverse().find(drug => drug.codes && drug.codes.length && codes.filter( c => drug.codes.join(',').includes(c)).length === codes.length) || {}).column;
              }
              const column = _.findIndex(availableSpace, (s, idx) => sameDrugColumnIndex >= 0 ? (idx === sameDrugColumnIndex + 1) && s : s );
              accu.push({
                  id: s.id,
                  svc: s,
                  codes,
                  column,
                  compound
              })
              return accu
          }, [] )
      )
      //console.log('_populateDrugsOnPrescriptions(): this._drugsOnPrescriptions', this._drugsOnPrescriptions)
      return this._drugsOnPrescriptions
  }

  _setDrugOnPrescription(e) {
      const id = e.target.id.split(':')[0];
      let column = parseInt(e.target.id.split(':')[1]);
      const checked = e.detail.value
      console.log("_setDrugOnPrescription: _drugsOnPrescriptions:", this._drugsOnPrescriptions)
      if(checked === false) {
          column = -1 // null mean do not print this drug
      }

      if (!id || id.length === 0 || !column && column !== 0) {
					return;
      }

      const current = this._drugsOnPrescriptions;

      const markIndex = current.findIndex(m => m.id === id);

      if (markIndex >= 0) {
          this.set('_drugsOnPrescriptions.' + markIndex + '.column', column);
      } else {
          console.log("_setDrugOnPrescription: not found: should not happen!")
					//current.push({ id: id, column: column }); // should not be needed ?
      }

  }

  _printEnabled() {
      const cols = this._splitColumns
      return cols.length !== 0 && cols.find(c=>c && c.drugIds && c.drugIds.length !== 0)
  }

  _refreshSplitColumns() {
      const drugs = this._drugsToBePrescribed;
      const columns = this._drugsOnPrescriptions.reduce((columns, mark) => {
          const id = mark.id;
          const column = mark.column;
          if(column >= 0) { // ignore unchecked drugs
              ;(columns[column] || (columns[column] = {drugIds:[], column:column})).drugIds.push(id)
          }
          return columns;
      }, [{drugIds:[]}]);
      if (!columns.find(c => !c || !c.drugIds || !c.drugIds.length) && columns.length < drugs.length) {
          columns.push({drugIds:[]});
      }
      //console.log("_refreshSplitColumns", columns)
      this.set('_splitColumns', columns)
  }
}

customElements.define(HtPatPrescriptionDialog.is, HtPatPrescriptionDialog);
