/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../../../styles/dropdown-style.js';

import '../../../styles/paper-input-style.js';
import '../../../styles/buttons-style.js';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-checkbox/paper-checkbox"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-dropdown-menu/paper-dropdown-menu"
import "@polymer/paper-dropdown-menu/paper-dropdown-menu-light"
import "@polymer/paper-icon-button/paper-icon-button"
import "@polymer/paper-input/paper-input"
import "@polymer/paper-item/paper-item"
import "@polymer/paper-listbox/paper-listbox"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../../tk-localizer";
import _ from 'lodash/lodash';

class HtAdminAccountPrinters extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles dropdown-style paper-input-style buttons-style">
            :host {
                display: block;
                height: calc(100% - 20px);
                --paper-font-caption: {
					line-height: 0;
				}
            }

            :host *:focus{
                outline:0!important;
            }

            .section-title{
                margin-top: 24px;
                margin-bottom: 0;
            }

            .printer-panel{
                width: 100%;
                height: 100%;
                grid-column-gap: 24px;
                grid-row-gap: 24px;
                padding: 0 24px;
                box-sizing: border-box;
                background: white;
            }

            .line {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
            }

            .col {
                flex-grow: 1;
                box-sizing: border-box;
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                margin-right: 12px;
                font-size: var(--font-size-normal);
            }

            .col:last-child{
                margin-right: 0;
            }

            .col > * {
                flex-grow: 1;
            }

            .col:first-child{
                width: 20%;
            }

            .col:nth-child(2){
                width: 10%;
                min-width:120px;
            }

            .col:last-child{
                width: 70%;
            }

            .edit {
                height: 90%;
                overflow: auto;
            }

            .buttons{
                display: flex;
                flex-flow: row-reverse;
                margin-bottom: 12px;
            }

            #savedIndicator{
                position: fixed;
                top:50%;
                right: 0;
                z-index:1000;
                color: white;
                font-size: 13px;
                background:rgba(0,0,0,0.42);
                height: 24px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
            }
            .saved{
                animation: savedAnim 2.5s ease-in;
            }
            .saved iron-icon{
                margin-left: 4px;
                padding: 4px;
            }

            @keyframes savedAnim {
                0%{
                    width: 0;
                    opacity: 0;
                }
                20%{
                    width: 114px;
                    opacity: 1;
                }
                25%{
                    width: 96px;
                    opacity: 1;
                }
                75%{
                    width: 96px;
                    opacity: 1;
                }
                100%{
                    width: 0;
                    opacity: 0;
                }
            }

            @media screen and (max-width:375px) {
                .line:first-child{
                    display: none;
                }

                .line{
                    flex-flow: row wrap;
                }

                .col{
                    margin: 0;
                }

                .col:first-child{
                    width: 100%;
                }

                .col:nth-child(2){
                    width: 100%;
                    min-width:120px;
                }

                .col:last-child{
                    width: 100%;
                }
            }

            paper-checkbox {
                --paper-checkbox-unchecked-color: var(--app-text-color);
                --paper-checkbox-label-color: var(--app-text-color);
                --paper-checkbox-checked-color: var(--app-secondary-color);
                --paper-checkbox-checked-ink-color: var(--app-secondary-color-dark);
            }
            .scan-container {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
            }
            .scan-name {
                flex: 6;
                padding-right: 12px;
            }
            .scan-name paper-dropdown-menu-light {
                width: 100%;
            }
            .scan-option {
                flex: 1;
            }

        </style>

        <div class="printer-panel">

            <paper-item id="savedIndicator">[[localize('sav','SAVED',language)]]
                <iron-icon icon="icons:check"></iron-icon>
            </paper-item>

            <h4 class="section-title">[[localize('my_pro', 'My profil', language)]] - [[localize('acc_print_info', 'Printers', language)]]</h4>

            <div class="edit">
                <div class="line">
                    <h5 class="col" style="width: 20%;">[[localize("type-doc","Type de documents",language)]]</h5>
                    <h5 class="col" style="width: 30%;">[[localize("format","Format d'impression",language)]]</h5>
                    <h5 class="col" style="width: 50%;">[[localize("printers","Imprimantes",language)]]</h5>
                </div>
                <template id="repeat" is="dom-repeat" items="[[listTypeDocument]]" as="preference">
                    <div class="line">
                        <div class="col">[[localize(preference.type,preference.typeLocalized,language)]]</div>
                        <div class="col">
                            <template is="dom-if" if="[[preference.isPrinter]]">
                                <paper-dropdown-menu-light>
                                    <label></label>
                                    <paper-listbox slot="dropdown-content" selected="{{preference.formatSelected}}" attr-for-selected="name">
                                        <template is="dom-repeat" items="[[preference.formats]]">
                                            <paper-item name="[[item]]">[[item]]</paper-item>
                                        </template>
                                    </paper-listbox>
                                </paper-dropdown-menu-light>
                            </template>
                        </div>
                        <div class="col">
                            <template is="dom-if" if="[[preference.isPrinter]]">
                                <paper-dropdown-menu-light>
                                    <label></label>
                                    <paper-listbox slot="dropdown-content" selected="{{preference.printerSelected}}" attr-for-selected="name">
                                        <paper-item name="print-window">[[localize('print-window','print-window',language)]]</paper-item>
                                        <template is="dom-repeat" items="[[printers]]">
                                            <paper-item name="[[item.name]]">[[item.name]]</paper-item>
                                        </template>
                                    </paper-listbox>
                                </paper-dropdown-menu-light>
                            </template>
                            <template is="dom-if" if="[[!preference.isPrinter]]">
                                <div class="scan-container">
                                    <div class="scan-name">
                                        <paper-dropdown-menu-light>
                                            <label></label>
                                            <paper-listbox slot="dropdown-content" selected="{{preference.printerSelected}}" attr-for-selected="name">
                                                <template is="dom-repeat" items="[[scanners]]">
                                                    <paper-item name="[[item.id]]">[[item.label]]</paper-item>
                                                </template>
                                            </paper-listbox>
                                        </paper-dropdown-menu-light>
                                    </div>
                                    <div class="scan-option">
                                        <paper-checkbox checked="{{preference.color}}">Couleur</paper-checkbox>
                                    </div>
                                    <div class="scan-option">
                                        <paper-checkbox checked="{{preference.duplex}}">Duplex</paper-checkbox>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
                <!--<div class="line">
                    <h5 class="col">[[localize("list-eti","Liste de vos étiquettes",language)]]</h5>
                </div>
                <vaadin-grid id="etiq" class="material" items="[[listStickers]]">
                    <vaadin-grid-column>
                        <template class="header">
                            [[localize('name-format','Nom du format',language)]]
                        </template>
                        <template>
                            <div>[[item.name]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            [[localize('format','Format',language)]]
                        </template>
                        <template>
                            <div>[[item.formatX]] mm - [[item.formatY]] mm</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            [[localize('printer','Printer',language)]]
                        </template>
                        <template>
                            <div>[[item.printer]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <paper-icon-button class="mobile-menu-btn" icon="vaadin:plus" on-tap="_addSticker"></paper-icon-button>
                        </template>
                        <template>
                            <div>
                                <paper-icon-button class="mobile-menu-btn" icon="vaadin:edit" data-item\$="[[item.id]]" on-tap="_editSticker"></paper-icon-button>
                                <paper-icon-button class="mobile-menu-btn" icon="vaadin:trash" data-item\$="[[item.id]]" on-tap="_delSticker"></paper-icon-button>
                            </div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>-->
            </div>
            <div class="buttons">
                <paper-button on-tap="_savePrinters" class="button button--save"><iron-icon icon="save"></iron-icon>[[localize('save','Save',language)]]</paper-button>
            </div>
        </div>

        <!--<paper-dialog id="sticker-dialog">
            <div>
                <paper-input label="[[localize('nam','name',language)]]" value="{{sticker.name}}" type="text"></paper-input>
                <paper-input label="[[localize('long-h','Longueur horizontal',language)]]" value="{{sticker.formatX}}" type="number"></paper-input>
                <paper-input label="[[localize('long-vert','Longueur verticale',language)]]" value="{{sticker.formatY}}" type="number"></paper-input>
                <paper-dropdown-menu class="flex">
                    <paper-listbox slot="dropdown-content" selected="{{sticker.printer}}" attr-for-selected="name">
                        <paper-item name="print-window">[[localize('print-window','print-window',language)]]</paper-item>
                        <template is="dom-repeat" items="[[printers]]">
                            <paper-item name="[[item.name]]">[[item.name]]</paper-item>
                        </template>
                    </paper-listbox>
                </paper-dropdown-menu>
            </div>
            <div class="buttons">
                <paper-button dialog-dismiss class="button" >[[localize('clo','close',language)]]</paper-button>
                <paper-button dialog-confirm on-tap="_saveSticker" class="button button--save">[[localize('save','Save',language)]]</paper-button>
            </div>
        </paper-dialog>-->
`;
  }

  static get is() {
      return 'ht-admin-account-printers'
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
          printers: {
              type: Array,
              value: []
          },
          scanners: {
              type: Array,
              value: []
          },
          listTypeDocument: {
              type: Array,
              value : [
                  {type : "rapp-mail",typeLocalized :"rapport et courrier",formats:["A4"],isPrinter:true},
                  {type : "recipe",typeLocalized :"prescriptions et ITT",formats:["A4","DL/A5"],isPrinter:true},
                  {type : "recipe-kine-inf",typeLocalized :"prescription kiné et infi",formats:["A4","DL/A5"],isPrinter:true},
                  {type : "imagerie",typeLocalized :"demande d'imagerie",formats:["A4"],isPrinter:true},
                  {type : "doc-off-format",typeLocalized :"Document officiel",formats:["A4"],isPrinter:true},
                  {type : "sticker-mut",typeLocalized :"Etiquette mutuelle",formats:["90 X 29"],isPrinter:true},
                  {type : "sticker-mut-a4",typeLocalized :"Feuille d'étiquettes mutuelle",formats:["A4"],isPrinter:true},
                  {type : "doc-little-format",typeLocalized :"Autre document - petit format",formats:["A4","DL/A5"],isPrinter:true},
                  {type : "doc-big-format",typeLocalized :"Autre document - grand format",formats:["A4","DL/A5"],isPrinter:true},
                  {type : "scanner",typeLocalized :"Scanner",formats:[],isPrinter:false,formatSelected:"-", color:false, duplex:false}
              ]
          },
          electronAvailable: {
              type : Boolean,
              value : false
          },
          socket: {
              type : Object,
              value : {}
          }
      }
  }

  static get observers() {
      return ["_electronInit(electronAvailable)"];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
      this.api && this.api.isElectronAvailable().then(elect=>this.set('electronAvailable',elect))
  }

  _electronInit(){
      if(!this.electronAvailable)return;
      this.api.printers()
      .then(prt=>{
          this.set('printers',prt)
          fetch('http://127.0.0.1:16042/getPrinterSetting', {
              method: "POST",
              headers: {
                  "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                  userId: this.user.id
              })
          })
          .then(response => response.json())
          .then((responseParsed) =>{
              let scanSetting= {type:"scanner", isPrinter:false, format:"-"};
              if(responseParsed.ok){
                  const property = JSON.parse(responseParsed.data)
                  property.map(setting => {
                      if(setting.type==="scanner") scanSetting=setting
                      else{
                          const itemTypeDoc =this.listTypeDocument.findIndex(itemDoc => itemDoc.type===setting.type)
                          if(itemTypeDoc===-1)return null;
                          this.set("listTypeDocument."+itemTypeDoc+".formatSelected", setting.format)
                          this.set("listTypeDocument."+itemTypeDoc+".printerSelected", this.listTypeDocument[itemTypeDoc].isPrinter ? (this.printers.find(printer => printer.name===setting.printer) ? setting.printer : "print-window") : "")
                      }
                  })
              }
              else {
                  console.log("error =>"+responseParsed.msg)
              }
              return scanSetting;
          })
          .then(scanSetting => {
              fetch("http://127.0.0.1:16042/scanning",{
                  method: "POST",
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify({request : "list"})
              }).then(response => response.json())
                  .then(scns =>{
                      this.set("scanners",scns.data.all)
                      const itemTypeDoc =this.listTypeDocument.findIndex(itemDoc => itemDoc.type===scanSetting.type)
                      if(itemTypeDoc===-1) return;
                      this.set("listTypeDocument."+itemTypeDoc+".formatSelected", scanSetting.format)
                      if (this.listTypeDocument[itemTypeDoc].isPrinter) return;
                      if (this.scanners.some(scan => scan.id===scanSetting.printer)) {
                          this.set("listTypeDocument."+itemTypeDoc+".printerSelected", scanSetting.printer);
                          if (scanSetting.color !== undefined)
                              this.set("listTypeDocument."+itemTypeDoc+".color", scanSetting.color);
                          if (scanSetting.duplex !== undefined)
                              this.set("listTypeDocument."+itemTypeDoc+".duplex", scanSetting.duplex);
                      } else {
                          this.set("listTypeDocument."+itemTypeDoc+".printerSelected", "")
                      }
                  })
          })
      })
  }

  _savePrinters(){
      const printerSettingComplete = this.listTypeDocument.filter(type => (type.formatSelected || type.formatSelected===0) && (type.printerSelected || type.printerSelected===0))
      .map(x => {return{type:x.type,format : x.formatSelected,printer : x.printerSelected, color: x.color, duplex: x.duplex}})
      fetch('http://127.0.0.1:16042/setPrinterSetting', {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
              userId : this.user.id,
              settings: printerSettingComplete
          })
      })
          .then(answer=>{
              answer = typeof answer === 'string' ? JSON.parse(_.trim(answer))||{} : answer
              if(!!_.get(answer,"ok", false)) { setTimeout(() => this.shadowRoot.querySelector('savedIndicator') ? this.shadowRoot.querySelector('savedIndicator').classList.remove("saved") : null, 2000); this.shadowRoot.querySelector('savedIndicator') ? this.shadowRoot.querySelector('savedIndicator').classList.add("saved") : null; }
          })
          .catch(error=>{ console.log("NOT SAVED"); })
  }

  /** @ToDo Faire la gestion des stickers si nécessaire
   * _addSticker(){
      this.set("sticker",{
          id : 0,
          name : "",
          printer : "print-window",
          formatX : 0,
          formatY : 0
      })
      this.$["sticker-dialog"].open()
  }

  _editSticker(e){
      const stickTemp = this.listStickers.find(stick => stick.id===e.target.dataset.item)
      this.set("sticker",{
          id : stickTemp.id,
          name : stickTemp.name,
          printer : stickTemp.printer,
          formatX : stickTemp.formatX,
          formatY : stickTemp.formatY
      })
      this.$["sticker-dialog"].open()
  }

  _saveSticker(){
      const printerSetting =localStorage.getItem("stickersSetting") ? JSON.parse(localStorage.getItem("stickersSetting")) : []
      let stickTmp = {}
      if (this.sticker.id) {
          stickTmp = printerSetting.find(stick => stick.id === this.sticker.id)
          stickTmp.name = this.sticker.name
          stickTmp.printer = this.sticker.printer
          stickTmp.formatX = this.sticker.formatX
          stickTmp.formatY = this.sticker.formatY
          this.set("listStickers."+this.listStickers.findIndex(stick => stick.id===this.sticker.id),stickTmp)
      } else {
          stickTmp.id = this.api.crypto().randomUuid()
          stickTmp.name = this.sticker.name
          stickTmp.printer = this.sticker.printer
          stickTmp.formatX = this.sticker.formatX
          stickTmp.formatY = this.sticker.formatY
          this.push("listStickers",stickTmp)
      }

      localStorage.setItem("stickersSetting",JSON.stringify(this.listStickers))
  }

  _delSticker(e){
      const stickTemp = this.listStickers.filter(stick => stick.id!==e.target.dataset.item)
      this.set("listStickers",stickTemp)
      localStorage.setItem("stickersSetting",JSON.stringify(this.listStickers))
  }*/

  _isPrinter(it){
      return it.isPrinter
  }
}

customElements.define(HtAdminAccountPrinters.is, HtAdminAccountPrinters)
