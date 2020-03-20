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

import '../../../styles/scrollbar-style.js';
import '../../../styles/paper-input-style.js';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-dropdown-menu/paper-dropdown-menu"
import "@polymer/paper-icon-button/paper-icon-button"
import "@polymer/paper-input/paper-input"
import "@polymer/paper-item/paper-item"
import "@polymer/paper-listbox/paper-listbox"
import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../../tk-localizer";
class HtAdminManagementFacturationFlatRate extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles dialog-style scrollbar-style paper-input-style">
            :host {
                display: block;
            }

            :host *:focus{
                outline:0!important;
            }

            .facturation-flat-rate-panel{
                height: 100%;
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                position:relative;
            }

            #addedFlatRateTarificationDialog{
                height: 380px;
                width: 600px;
            }

            .top-gradient{
                line-height:0;
                font-size:0;
                display:block;
                background: linear-gradient(90deg, var(--app-secondary-color-dark), var(--app-secondary-color));
                height:10px;
                position:relative;
                top:0;
                left:0;
                right:0;
                margin:0;
                border-radius:2px 2px 0 0;
            }

            .line {
                display: flex;
                padding: 0 12px;
                flex-wrap: wrap;
            }

            .flex{
                flex: 1;
            }

            .buttons{
                display: flex;
                flex-grow: 1;
                box-sizing: border-box;
                justify-content: flex-end;
                padding-top: 16px;
            }

            .trashIcon{
                height: 14px;
                width: 14px;
            }

            .warningMessage {
                margin-top: 20px;
                margin-bottom: 30px;
            }

            .warningMessageBody {
                padding:20px 35px;
                color: var(--app-status-color-nok);
                background-color: rgba(255, 0, 0, 0.15);
                font-weight: 700;
                border:1px dashed var(--app-status-color-nok);
                text-transform: uppercase;
                text-align: center;
            }

            paper-input{
				--paper-input-container-input: {
					height: 22px;
					font-size: var(--font-size-normal);
					line-height: var(--font-size-normal);
					padding: 0 8px;
					box-sizing: border-box;
					background: var(--app-input-background-color);
					border-radius: 4px 4px 0 0;
				}
			}

            .exportMonthPicker {
                width: 100%;
                height: 40px;
            }

            .add_line h5{
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
            }

        </style>

        <div class="facturation-flat-rate-panel">
            <h4>[[localize('man_fla_rat', 'Management - Flat rate facturation', language)]]</h4>
            <div class="warningMessage" id="warningMessageInvoicing">
                <div class="warningMessageBody">
                    Nous vous conseillons d'encoder la tarification pour les 24 derniers mois
                </div>
            </div>
            <div class="add_line">
                <h5>[[localize('flat_rat_tar', 'Flat rate tarifications', language)]] <paper-icon-button class="button--icon-btn add-btn" icon="icons:add-circle" on-tap="_addFlatRateTarification"></paper-icon-button></h5>
            </div>
            <vaadin-grid id="flatRateFacturation" class="material" items="[[flatRateTarificationTab]]" active-item="{{selectedPrice}}">
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('startOfValidity','Start of valididy',language)]]
                    </template>
                    <template>
                        <div>[[_getDateAsString(item.valorisation.startOfValidity)]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('type','Type',language)]]
                    </template>
                    <template>
                        <div>[[item.flatRateType]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('co','Code',language)]]
                    </template>
                    <template>
                        <div>[[item.code]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('lab','Label',language)]]
                    </template>
                    <template>
                        <div>[[_getCodeLabel(item.label)]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                        [[localize('presc_reimb','Reimbursement',language)]]
                    </template>
                    <template>
                        <div>[[item.valorisation.reimbursement]]</div>
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">
                    </template>
                    <template>
                        <div>
                            <iron-icon icon="vaadin:trash" class="trashIcon" on-tap="_deleteFalRatePrice" data-item\$="[[item]]"></iron-icon>
                        </div>
                    </template>
                </vaadin-grid-column>

            </vaadin-grid>

        </div>

        <paper-dialog id="addedFlatRateTarificationDialog">
            <h2 class="modal-title">[[localize('add_flat_rat_tar', 'Add flat rate tarification', language)]]</h2>
            <div class="content">
                <div class="line p8">
<!--                    <paper-dropdown-menu label="[[localize('stat','Code',language)]]">-->
<!--                        <paper-listbox slot="dropdown-content" selected="{{flatRateNmclSelectedItemIdx}}" selected-item="{{flatRateNmclSelectedItem}}" attr-for-selected="id" on-selected-changed="_fatRateNmclChanged">-->
<!--                            <template is="dom-repeat" items="[[flatRateNmcl]]" as="nmcl">-->
<!--                                <paper-item id="[[nmcl.code]]">[[nmcl.code]] - [[_getCodeLabel(nmcl.label)]]</paper-item>-->
<!--                            </template>-->
<!--                        </paper-listbox>-->
<!--                    </paper-dropdown-menu>-->
                    <paper-radio-group selected-item="{{flatRateNmclSelectedItem}}" attr-for-selected="id" on-selected-changed="_fatRateNmclChanged">
                        <template is="dom-repeat" items="[[flatRateNmcl]]" as="nmcl">
                            <paper-radio-button id="[[nmcl.code]]">[[nmcl.code]] - [[_getCodeLabel(nmcl.label)]]</paper-radio-button>
                        </template>
                    </paper-radio-group>
                </div>
                <div class="line">
                    <div class="exportMonthPicker">
                       <vaadin-combo-box id="tarificationMonth" filtered-items="[[_getTarificationMonthsList()]]" item-label-path="label" item-value-path="id" label="[[localize('month','Month',language)]]" value="[[_getTarificationCurrentMonth()]]" selected-item="{{selectedTarificationMonth}}"></vaadin-combo-box>
                       <vaadin-combo-box id="tarificationYear" filtered-items="[[_getTarificationYearsList()]]" item-label-path="label" item-value-path="id" label="[[localize('year','Year',language)]]" value="[[_getTarificationCurrentYear()]]" selected-item="{{selectedTarificationYear}}"></vaadin-combo-box>
                    </div>
                    <paper-input type="number" label="[[localize('flatrate_reimb', 'Reimbursement', language)]]" class="flex" id="reimbursement" value="{{flatRateTarification.reimbursement}}" always-float-label=""></paper-input>
                </div>
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="_addTarification">[[localize('save','Save',language)]]</paper-button>
            </div>

        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-admin-management-facturation-flat-rate'
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
          flatRateTarification: {
              type: Object,
              value: {
                  code: null,
                  label: null,
                  reimbursement : Number(0.00),
                  monthValidity: null,
                  yearValidity: null,
                  startOfValidity: null
              }
          },
          flatRateNmclSelectedItemIdx:{
              type: Number,
              value: 0
          },
          flatRateNmclSelectedItem:{
              type: Object,
              value: () => {}
          },
          flatRateNmcl: {
              type: Array,
              value: () => [
              {
                  code: '109616',
                  label: {
                      fr : 'Forfait soins médicaux dans les centres de santé',
                      en: 'Medical care package in health centers',
                      nl : 'Zorgpakket in gezondheidscentra'
                  },
                  flatRateType: 'physician'
              },{
                  code: '409614',
                  label: {
                      fr : 'Forfait soins infirmiers dans les centres de santé',
                      en: 'Nursing package at health centers',
                      nl : 'Verpleegpakket in gezondheidscentra'
                  },
                  flatRateType : 'nurse'
              },{
                  code: '509611',
                  label: {
                      fr : 'Forfait soins kiné dans les centres de santé',
                      en: 'Physiotherapy package in health centers',
                      nl : 'Fysiotherapie pakket in gezondheidscentra'
                  },
                  flatRateType: 'physiotherapist'
              }]
         },
          hcpParent: {
              type: Object,
              value: () => {}
          },
          flatRateTarificationTab: {
              type : Array,
              value: () => []
          },
          selectedTarificationMonth:{
              type: Object,
              value: () => {},
              observer: '_selectedTarificationMonthValueChanged'
          },
          selectedTarificationYear:{
              type: Object,
              value: () => {},
              observer: '_selectedTarificationYearValueChanged'
          },
          selectedPrice:{
              type: Object,
              value: () => {}
          }

      }
  }

  static get observers() {
      return ['_flatRateTarificationDataProvider(user)', '_selectedPriceChanged(selectedPrice)'];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
  }

  _flatRateTarificationDataProvider(){

      if(!this.user) {
          return
      }

      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
          .then(hcp => hcp.parentId ? this.api.hcparty().getHealthcareParty(hcp.parentId) : Promise.resolve(hcp))
          .then(hcpParent => {
              this.set('hcpParent', hcpParent)

              const flatRateTarifications = this.hcpParent && this.hcpParent.flatRateTarifications || []

              this.set('flatRateTarificationTab', _.flatten(flatRateTarifications.map(tar => tar.valorisations.map(val => ({valorisation: val, code: tar.code, label: tar.label, flatRateType: tar.flatRateType})))) )

      })
  }

  _addFlatRateTarification(){
      this.set('selectedTarificationMonth', { id: parseInt(moment().format('MM')), label: this.localize('month_'+parseInt(moment().format('MM')),this.language)})
      this.set('selectedTarificationYear', {id: parseInt(moment().format('YYYY')), label: parseInt(moment().format('YYYY'))})
      this.set('flatRateTarification', {})
      this.set('flatRateNmclSelectedItemIdx', 0)
      this.set('flatRateTarification.monthValidity', parseInt(moment().format('MM')))
      this.set('flatRateTarification.yearValidity', parseInt(moment().format('YYYY')))
      this.$['addedFlatRateTarificationDialog'].open()

  }

  _addTarification(){
      console.log(this.flatRateTarification)

      const startValidityMonth = this.flatRateTarification && this.flatRateTarification.monthValidity && this.flatRateTarification.monthValidity < 10 ? '0'+this.flatRateTarification.monthValidity :
          this.flatRateTarification && this.flatRateTarification.monthValidity && this.flatRateTarification.monthValidity >= 10 ? this.flatRateTarification.monthValidity
              : null
      const startOfValidity = this.flatRateTarification && startValidityMonth && this.flatRateTarification.yearValidity ? moment(this.flatRateTarification.yearValidity+'-'+startValidityMonth+'-01').startOf('month').format('YYYYMMDD') : null

      if(!this.hcpParent.flatRateTarifications){
          _.assign(this.hcpParent, {flatRateTarifications : []})
      }

      const selectedTar = this.hcpParent.flatRateTarifications.find(t => t.code === this.flatRateTarification.code) || null

      if(selectedTar){
          selectedTar ? selectedTar.valorisations.push({startOfValidity: parseInt(startOfValidity), reimbursement: this.flatRateTarification.reimbursement.replace(',', '.')}) : null
      }else{
          const valorisation = []
          valorisation.push({startOfValidity: parseInt(startOfValidity), reimbursement: this.flatRateTarification.reimbursement.replace(',', '.')})

          this.hcpParent.flatRateTarifications.push({
              code: this.flatRateTarification.code || null,
              label: this.flatRateTarification.label || null,
              flatRateType : this.flatRateTarification.flatRateType || null,
              valorisations: valorisation || []
           })
      }

      this.api.hcparty().modifyHealthcareParty(this.hcpParent)
          .then(hcp => this.set('hcpParent', hcp))
          .finally(() => {
          const flatRateTarifications = this.hcpParent && this.hcpParent.flatRateTarifications || []
          this.set('flatRateTarificationTab', _.flatten(flatRateTarifications.map(tar => tar.valorisations.map(val => ({valorisation: val, code: tar.code, label: tar.label, flatRateType: tar.flatRateType})))) )
          this.set('flatRateTarification', { code: null, label: null, reimbursement : Number(0.00), startOfValidity: null})
      })


  }

  _fatRateNmclChanged(){
      if(this.flatRateNmclSelectedItem && this.flatRateNmclSelectedItem.id){
          this.set('flatRateTarification.code', this.flatRateNmcl.find(cd => cd.code === this.flatRateNmclSelectedItem.id).code)
          this.set('flatRateTarification.label', this.flatRateNmcl.find(cd => cd.code === this.flatRateNmclSelectedItem.id).label)
          this.set('flatRateTarification.flatRateType', this.flatRateNmcl.find(cd => cd.code === this.flatRateNmclSelectedItem.id).flatRateType)
      }
  }

  _getCodeLabel(code){
      return code && code[this.language]
  }

  _getTarificationMonthsList() {
      let toReturn = [];
      for(let i=1; i<=12; i++) toReturn.push({id: i, label: this.localize('month_'+i,this.language) })
      return toReturn
  }
  _getTarificationYearsList() {
      let toReturn = [];
      for(let i=(parseInt(moment().format('YYYY'))+1); i>=(parseInt(moment().format('YYYY'))-2); i--) toReturn.push({id: i, label: i })
      return toReturn
  }

  _getTarificationCurrentMonth() {
      return parseInt(moment().format('MM'))
  }
  _getTarificationCurrentYear() {
      return parseInt(moment().format('YYYY'))
  }

  _selectedTarificationMonthValueChanged(selectedMonth){
      selectedMonth ? this.set('flatRateTarification.monthValidity', parseInt(selectedMonth.id)) : null
  }

  _selectedTarificationYearValueChanged(selectedYear){
      selectedYear ? this.set('flatRateTarification.yearValidity', parseInt(selectedYear.id)) : null
  }

  _getDateAsString(date){
      return date ? this.api.moment(date).format('DD/MM/YYYY') : null
  }

  _deleteFalRatePrice(e){
      e.stopPropagation()
      if(e.target.dataset && e.target.dataset.item){
          const dataToBeDeleted = JSON.parse(e.target.dataset.item)
          const tarification = this.hcpParent.flatRateTarifications.find(t => t.code === dataToBeDeleted.code)
          const valorisationsOfTarification = tarification.valorisations
          const valorisationToBeDeleted = tarification.valorisations.findIndex(val => val.startOfValidity === dataToBeDeleted.valorisation.startOfValidity && val.reimbursement === dataToBeDeleted.valorisation.reimbursement)
          valorisationsOfTarification.splice(valorisationToBeDeleted, 1)

          this.api.hcparty().modifyHealthcareParty(this.hcpParent)
              .then(hcp => this.set('hcpParent', hcp))
              .finally(() => {
                  const flatRateTarifications = this.hcpParent && this.hcpParent.flatRateTarifications || []
                  this.set('flatRateTarificationTab', _.flatten(flatRateTarifications.map(tar => tar.valorisations.map(val => ({valorisation: val, code: tar.code, label: tar.label, flatRateType: tar.flatRateType})))) )
              })
      }
  }

  _selectedPriceChanged(e){
     //this.$['addedFlatRateTarificationDialog'].open()
  }
}

customElements.define(HtAdminManagementFacturationFlatRate.is, HtAdminManagementFacturationFlatRate)
