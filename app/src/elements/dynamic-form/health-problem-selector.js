import '../../styles/vaadin-icure-theme.js';
import '../../styles/dialog-style.js';
import '../../styles/scrollbar-style.js';
import '../../styles/dropdown-style.js';
import '../../styles/paper-input-style.js';
import '../../styles/tk-token-field-style.js';

import _ from 'lodash/lodash';
import moment from 'moment/src/moment';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HealthProblemSelector extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style include="dialog-style scrollbar-style dropdown-style vaadin-icure-theme paper-input-style tk-token-field-style">
			:host{
				--paper-font-caption: {
					line-height: 0;
				}
			}
			paper-dialog {
				width: 840px;
				max-width: 1024px;
				max-height:750px;
				height: 659px;
				z-index: 300;
			}

			paper-dropdown-menu-light{
				width: 140px;
				height: 22px;
			}

            vaadin-combo-box, paper-input {
				width: 100%;
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

			.grid {
				display: grid;
				grid-template-columns: 110px 1fr;
				grid-template-rows: 1fr;
				margin-bottom: 12px;
				grid-column-gap: 12px;
			}

			.flex {
				display: flex;
				flex-flow: row wrap;
				justify-content: flex-start;
				align-items: center;
			}

			.label {
                color: var(--app-primary-color-dark);
                font-size: var(--font-size-normal);
				justify-content: space-between;
				place-self: center start;
			}

            paper-radio-group {
                --paper-radio-group-item-padding: 8px;
            }

			paper-radio-button {
				--paper-radio-button-checked-color: var(--app-secondary-color);
				--paper-radio-button-size: 12px;
				--paper-radio-button-label: {
					font-size: var(--font-size-normal)
				};
				padding: 4px 8px;
			}

			.reorder::before, .reorder::after{
				content: '';
				width: 100%;
				order: 1;
			}

			.reorder paper-radio-button:nth-child(n + 4){
				order: 1;
			}

			.reorder paper-radio-button:nth-child(n + 7){
				order: 2;
			}

			vaadin-date-picker {
				height: 22px;
				width: 120px;
			}

			.content {
				padding: 12px;
			}

			.margin-left-right-6 {
				margin-left: 6px;
    			margin-right: 6px;
			}

			.nowrap {
				flex-wrap: nowrap;
			}
		</style>

		<paper-dialog id="dialog" opened="{{opened}}">
			<h2 class="modal-title">[[entityType]]</h2>
			<div class="content">
				<div class="grid">
					<div class="label">[[localize('nat','Nature',language)]] *</div>
					<paper-radio-group selected="[[_nature(entity, entity.tags, entity.tags.*)]]" class="flex reorder" on-selected-changed="_natureChanged">
						<paper-radio-button name="healthcareelement">[[localize('healthcareelement','Problem',language)]]</paper-radio-button>
						<paper-radio-button name="surgery">[[localize('surg_abr','Surgery',language)]]</paper-radio-button>
						<paper-radio-button name="familyrisk">[[localize('familyrisk','Family Risk',language)]]</paper-radio-button>
						<paper-radio-button name="risk">[[localize('risk','Risk',language)]]</paper-radio-button>
						<paper-radio-button name="socialrisk">[[localize('socialrisk','Social risk',language)]]</paper-radio-button>
						<paper-radio-button name="professionalrisk">[[localize('professionalrisk','Professional risk',language)]]</paper-radio-button>
						<paper-radio-button name="allergy">[[localize('allergy','Allergy',language)]]</paper-radio-button>
						<paper-radio-button name="adr">[[localize('adr','Adverse drug reaction',language)]]</paper-radio-button>
					</paper-radio-group>
				</div>
				<div class="grid">
					<div class="label">[[localize('lab-sta','Standard Label',language)]] *</div>
					<template is="dom-if" if="[[!searchSurgery]]">
						<vaadin-combo-box id="entities-list" filtered-items="[[items]]" on-filter-changed="_filterChanged" item-label-path="descr" selected-item="{{selectedItem}}" item-value-path="id"></vaadin-combo-box>
					</template>
					<template is="dom-if" if="[[searchSurgery]]">
						<vaadin-combo-box id="entities-list" filtered-items="[[surgeryItems]]" on-filter-changed="_surgeryFilterChanged" item-label-path="descr" selected-item="{{surgerySelectedItem}}" item-value-path="id"></vaadin-combo-box>
					</template>
				</div>
				<template is="dom-if" if="[[searchAllergen]]">
					<div class="grid">
						<div class="label">[[localize('allergen','Allergen',language)]]</div>
						<vaadin-combo-box id="entities-list" filtered-items="[[allergenItems]]" on-filter-changed="_allergenFilterChanged" item-label-path="descr" selected-item="{{allergenSelectedItem}}" item-value-path="id"></vaadin-combo-box>
					</div>
				</template>

				<template is="dom-if" if="[[searchDrug]]">
					<div class="grid">
						<div class="label">[[localize('drugs','Drugs',language)]]</div>
						<vaadin-combo-box id="entities-list" filtered-items="[[drugItems]]" on-filter-changed="_drugFilterChanged" item-label-path="name" selected-item="{{drugSelectedItem}}" item-value-path="id"></vaadin-combo-box>
					</div>
				</template>
				<template is="dom-if" if="[[searchFamilyLink]]">
					<div class="grid">
						<div class="label">[[localize('fam-ris','Family Risks',language)]]</div>
						<vaadin-combo-box id="entities-list" filtered-items="[[familyLinkItems]]" on-filter-changed="_familyRiskFilterChanged" item-label-path="descr" selected-item="{{familyRiskSelectedItem}}" item-value-path="id"></vaadin-combo-box>
					</div>
				</template>
				<div class="grid">
					<div class="label">[[localize('lab-per','Personal Label',language)]]</div>
					<paper-input value="{{entity.descr}}" no-label-float=""></paper-input>
				</div>
				<div class="grid">
					<div class="label">[[localize('sta','Status',language)]]</div>
					<paper-radio-group selected="[[_status(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_statusChanged">
						<paper-radio-button name="active-relevant">[[localize('act_rel','Active relevant',language)]]</paper-radio-button>
						<paper-radio-button name="active-irrelevant">[[localize('act_irr','Active irrelevant',language)]]</paper-radio-button>
						<paper-radio-button name="inactive">[[localize('ina','Inactive',language)]]</paper-radio-button>
						<paper-radio-button name="archived">[[localize('archiv','Archived',language)]]</paper-radio-button>
					</paper-radio-group>
				</div>
				<div class="grid">
					<div class="label">[[localize('cert','Certainty',language)]]</div>
					<paper-radio-group selected="[[_certainty(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_certaintyChanged">
						<paper-radio-button name="proven">[[localize('proven','Proven',language)]]</paper-radio-button>
						<paper-radio-button name="probable">[[localize('probable','Probable',language)]]</paper-radio-button>
						<paper-radio-button name="unprobable">[[localize('unprobable','improbable',language)]]</paper-radio-button>
						<paper-radio-button name="excluded">[[localize('excluded','Excluded',language)]]</paper-radio-button>
					</paper-radio-group>
				</div>
				<div class="grid">
					<div class="label">[[localize('sev','Severity',language)]]</div>
					<paper-radio-group selected="[[_severity(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_severityChanged">
						<paper-radio-button name="normal">[[localize('normal','No problem',language)]]</paper-radio-button>
						<paper-radio-button name="verylow">[[localize('verylow','Light',language)]]</paper-radio-button>
						<paper-radio-button name="low">[[localize('low','Moderate',language)]]</paper-radio-button>
						<paper-radio-button name="high">[[localize('high','Severe',language)]]</paper-radio-button>
						<paper-radio-button name="veryhigh">[[localize('veryhigh','Total',language)]]</paper-radio-button>
					</paper-radio-group>
				</div>
				<div class="grid">
					<div class="label">[[localize('ext_temp','Extra temporality',language)]]</div>
					<paper-radio-group selected="[[_extraTemporality(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_extraTemporalityChanged">
						<!--<paper-radio-button name="chronic">[[localize('chronic','Chronic',language)]]</paper-radio-button>
						<paper-radio-button name="subbacute">[[localize('subbacute','Sub-acute',language)]]</paper-radio-button>
						<paper-radio-button name="acute">[[localize('acute','Acute',language)]]</paper-radio-button>-->
						<paper-radio-button name="remission">[[localize('remission','Remission',language)]]</paper-radio-button>
						<paper-radio-button name="relapse">[[localize('relapse','Relapse',language)]]</paper-radio-button>
					</paper-radio-group>
				</div>

				<div class="grid">
					<div class="label">[[localize('conf','Confidentiality',language)]]</div>
					<paper-radio-group selected="[[_confidentiality(entity, entity.tags, entity.tags.*, entity.status, entity.closingDate)]]" class="flex" on-selected-changed="_confidentialityChanged">
						<paper-radio-button name="notsecret">[[localize('no-conf','Non confidential',language)]]</paper-radio-button>
						<paper-radio-button name="secret">[[localize('conf','Confidential',language)]]</paper-radio-button>
					</paper-radio-group>
				</div>

				<div class="flex nowrap">
					<div class="grid">
						<div class="label">[[localize('st_da','Start Date',language)]] *</div>
						<vaadin-date-picker i18n="[[i18n]]" value="{{_openingDateAsString}}" can-be-fuzzy accuracy="{{accuracyOpening}}"></vaadin-date-picker>
					</div>
					<div class="grid margin-left-right-6">
						<div class="label">[[localize('en_da','End Date',language)]]</div>
						<vaadin-date-picker i18n="[[i18n]]" value="{{_closingDateAsString}}" can-be-fuzzy accuracy="{{accuracyClosing}}"></vaadin-date-picker>
					</div>

					<div class="grid margin-left-right-6">
						<div class="label">Rémanence</div>
						<paper-dropdown-menu-light id="temporality" no-label-float="">
							<paper-listbox slot="dropdown-content" class="dropdown-temporality" selected="{{temporalityItemIdx}}" selected-item="{{temporalityItem}}">
								<template is="dom-repeat" items="[[temporalityList]]" as="tp">
									<paper-item id="[[tp.code]]">[[_getTpLabel(tp)]]</paper-item>
								</template>
							</paper-listbox>
						</paper-dropdown-menu-light>
					</div>
				</div>

				<div class="grid">
					<div class="label">[[localize('co','Code',language)]]</div>
					<tk-token-field value="{{entity.codes}}" data-value-path="id" label-path="[[_label(language)]]" data-label-path="[[_label(language)]]" no-label-float=""></tk-token-field>
				</div>

				<div class="grid">
					<div class="label">[[localize('pl_of_ac','Plans of action',language)]]</div>
					<tk-token-field value="{{entity.plansOfAction}}" data-value-path="id" data-label-path="descr" no-label-float=""></tk-token-field>
				</div>

				<div class="grid">
					<div class="label">[[localize('note','Note',language)]]</div>
					<vaadin-text-area style="width: 100%" class="textarea-style" value="{{entity.note}}"></vaadin-text-area>
				</div>

				<slot name="suffix"></slot>
			</div>
			<div class="buttons">
				<paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
				<paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="confirm" disabled="[[!isValid]]">[[localize('save','Save',language)]]</paper-button>
			</div>
		</paper-dialog>
`;
  }

  static get is() {
      return 'health-problem-selector';
	}

  static get properties() {
      return {
          opened:{
              type: Boolean,
              value:false
          },
          columns: {
              type: Array,
              value: function () {
                  return [];
              }
          },

          entityType: {
              type: String,
              value: 'entity'
          },

          entity: {
              type: Object,
              value: () => ({ plansOfAction: [] }),
              notify: true
          },

          okLabel: {
              type: String
          },

          filterValue: {
              type: String
          },

          dataProvider: {
              type: Object,
              value: null
          },

          allergenDataProvider:{
              type: Object,
              value: null
          },

          i18n: {
              type: Object
          },

          selectedItem: {
              type: Object,
              value: null
          },
          surgerySelectedItem:{
              type: Object,
              value: null
          },
          allergenSelectedItem: {
              type: Object,
              value: null
          },
          drugSelectedItem: {
              type: Object,
              value: null
          },
          familyRiskSelectedItem:{
              type: Object,
              value: null
          },
          items: {
              type: Array,
              value: () => []
          },
          allergenItems: {
              type: Array,
              value: () => []
          },
          familyLinkItems: {
            type: Array,
              value:  () => []
          },
          _openingDateAsString: {
              type: String
          },
          _closingDateAsString: {
              type: String
          },
          searchAllergen:{
              type: Boolean,
              value: false
          },
          searchDrug:{
              type: Boolean,
              value: false
          },
          searchFamilyLink:{
              type: Boolean,
              value: false
          },
          allergenFilterValue: {
              type: String
          },
          drugFilterValue: {
              type: String
          },
          familyLinkFilterValue: {
              type: String
          },
          searchSurgery: {
              type: Boolean,
              value: false
          },
          surgeryItems:{
              type: Array,
              value:  () => []
          },
          surgeryFilterValue: {
              type: String
          },
          temporalityItemIdx: {
              type: Number,
              value: 0
          },
          temporalityList:{
              type: Array,
              value: () => []
          },
          temporalityItem:{
              type: Object,
              value: () => {}
          },
          isValid: {
              type : Boolean,
              value : false
          },
          accuracyOpening:{
              type:String,
              value:'day'
          },
          accuracyClosing: {
              type: String,
              value: 'day'
          },
          locked: {
              type : Boolean,
              value : false,
              noReset: true
          }
      };
	}

  static get observers() {
      return [
          '_selectedTemporalityItemChanged(temporalityItem)',
          '_filterChanged(filterValue)',
          '_selectedItemChanged(selectedItem)',
          '_allergenItemChanged(allergenSelectedItem)',
          '_familyRiskItemChanged(familyRiskSelectedItem)',
          '_drugChangedSamV2(drugSelectedItem)',
          '_selectSurgerySelectedItem(surgerySelectedItem)',
          '_updateDescription(selectedItem, allergenSelectedItem, familyRiskSelectedItem, surgerySelectedItem, drugSelectedItem)',
          '_ehDateChanged(entity.openingDate, entity.closingDate)',
          '_openingDateChanged(entity.openingDate)',
          '_closingDateChanged(entity.closingDate)',
          '_openingDateAsStringChanged(_openingDateAsString)',
          '_closingDateAsStringChanged(_closingDateAsString)',
          '_checkValidity(entity.codes)'
      ];
	}

  constructor() {
      super();
	}

  _filterChanged(e) {
      let latestSearchValue = this.filterValue || e && e.detail.value;
      this.latestSearchValue = latestSearchValue;

      if (!latestSearchValue || latestSearchValue.length < 2) {
          //console.log("Cancelling empty search");
          this.set('items', []);
          return;
      }

      this.dataProvider && this.dataProvider.filter(latestSearchValue, 500, 0, 'descr', false).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              //console.log("Cancelling obsolete search");
              return;
          }
          this.set('items', res.rows);
      });
	}

  _updateDescription() {
	    // surgery is the only one to replace selectedItem by surgerySelectedItem, other kinds have both
      // selectedItem can be the only filled field when using normal He kind
      if(!this.locked && (this.selectedItem || this.surgerySelectedItem)) {
          this.set('entity.descr',
              (this.selectedItem && this.searchAllergen && this.allergenSelectedItem) ? `${this.selectedItem.descr} (${this.allergenSelectedItem.descr})`
                  : (this.selectedItem && this.searchFamilyRisk && this.familyRiskSelectedItem) ? `${this.selectedItem.descr} (${this.familyRiskSelectedItem.descr})`
                  : (this.selectedItem && this.searchDrug && this.drugSelectedItem) ? `${this.selectedItem.descr} (${this.drugSelectedItem.name})`
                      : (this.searchSurgery && this.surgerySelectedItem) ? `${this.surgerySelectedItem.descr}`
                          : this.selectedItem && this.selectedItem.descr
          );
      }
  }

  _selectedItemChanged() {
      if (this.selectedItem) {
          this.set('entity.plansOfAction', this.selectedItem.plansOfAction || []);
          this.api.code().getCodes(this.selectedItem.codes.join(',')).then(codes => {
              this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["ICD", "ICPC", "BE-THESAURUS"]), codes));
          });
      }
	}

  _allergenItemChanged() {
      if (this.allergenSelectedItem) {
          this.api.code().getCodes(this.allergenSelectedItem.codes.join(',')).then(codes => {
              this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["CD-ATC"]), codes));
          });
      }
  }

  _familyRiskItemChanged() {
      if (this.familyRiskSelectedItem) {
          this.api.code().getCodes(this.familyRiskSelectedItem.codes.join(',')).then(codes => {
              this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["BE-FAMILY-LINK"]), codes));
          });
      }
  }

  _drugChanged() {
      if (this.drugSelectedItem) {
          this._fillMedecineCodes(this.drugSelectedItem).then(() => {
              this.api.code().getCodes(this.drugSelectedItem.codes.map(c => this.api.code().normalize(c).id).join(',')).then(codes => {
                  this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["CD-ATC", "CD-DRUG-CNK"]), codes));
                  console.log("entity-codes", this.entity.codes);
              });
          })
      }
  }

  _getValidAmpps(ampps) {
      return ampps && ampps.filter(ampp => !ampp.to && ampp.atcs && ampp.atcs.length && ampp.dmpps && ampp.dmpps.length &&
              ampp.dmpps.some(dmpp => dmpp.deliveryEnvironment === 'P' && dmpp.codeType === 'CNK' && !dmpp.to)
      ) || [];
	}

  _getAllDmpps(ampps) {
      return ampps && ampps.reduce((allDmpps, ampp) => allDmpps.concat(ampp.dmpps && ampp.dmpps.find(dmpp => !dmpp.to && dmpp.deliveryEnvironment === 'P' && dmpp.codeType === 'CNK')), []) || [];
	}

  _getAtcCodes(ampps) {
      return ampps.reduce((codes, ampp) => {
          ampp.atcs.map(atc =>
                  codes.push({
                      type: "CD-ATC",
                      version: "0.0.1",
                      code: atc.code
                  })
          );
          return codes;
      }, [])
	}

  _getCnkCodes(dmpps) {
      return dmpps.reduce((codes, dmpp) => {
          codes.push({
              type: "CD-DRUG-CNK",
              version: "0.0.1",
              code: dmpp.code
          });
          return codes;
      }, []);
	}



  _drugChangedSamV2() {
      const mp = this.drugSelectedItem;
      if (!mp) return;
      new Promise(resolve => {
          if (mp.ampps) {
              const validAmpps = this._getValidAmpps(mp.ampps);
              const codes = this._getAtcCodes(validAmpps);
              const allDmpps = this._getAllDmpps(validAmpps);
              return resolve(codes.concat(this._getCnkCodes(allDmpps)));
          } else {
              return this.api.besamv2().findPaginatedAmpsByGroupCode(mp.code, null, null, 100)
                      .then(results => (results && results.rows || []))
                      .then(amps => amps.reduce((ampps, amp) => ampps.concat(amp.ampps), []))
                      .then(ampps => {
                          const validAmpps = this._getValidAmpps(ampps);
                          return resolve(this._getAtcCodes(validAmpps))
                      })
          }
      })
              .then(codes => codes.filter((e, i, a) => a.findIndex(x => x.code === e.code) === i))
              .then(codes => this.api.code().getCodes(codes.map(c => this.api.code().normalize(c).id).join(',')))
              .then(codes => {
                  this.set('entity.codes', _.union(this._stripCodesByTypes(this.entity.codes, ["CD-ATC", "CD-DRUG-CNK"]), codes));
                  console.log("entity-codes", this.entity.codes);
              })
	}

  _fillMedecineCodes(med) {
      return Promise.resolve([]).then(()=> {
          //med.codes = [{type: "CD-ATC", code: 123213}];
          if (med.id && med.id.id) {
              //by productName
              return this.api.bedrugs().getMppInfos(med.id.id, this.language === 'en' ? 'fr' : this.language || 'fr').then(mppInfos => {

                  med.id.id && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-DRUG-CNK') || (med.codes[med.codes.length] = {
                      type: 'CD-DRUG-CNK',
                      version: '0.0.1'
                  })).code = med.id.id)
                  mppInfos.atcCode && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-ATC') || (med.codes[med.codes.length] = {
                      type: 'CD-ATC',
                      version: '0.0.1'
                  })).code = mppInfos.atcCode)

              })
          } else {
              //by molecule
              if (med.inncluster) {

                  med.inncluster && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-INNCLUSTER') || (med.codes[med.codes.length] = {
                      type: 'CD-INNCLUSTER',
                      version: '0.0.1'
                  })).code = med.inncluster)
                  med.atcCode && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-ATC') || (med.codes[med.codes.length] = {
                      type: 'CD-ATC',
                      version: '0.0.1'
                  })).code = med.atcCode)
              } else {
                  //Compound prescription

              }
          }
          return med
      })

  }

  _selectSurgerySelectedItem(){
      if (this.surgerySelectedItem) {
          this.set('entity.plansOfAction', this.surgerySelectedItem.plansOfAction || []);
          this.api.code().getCodes(this.surgerySelectedItem.codes.join(',')).then(codes => {
              this.set('entity.codes', codes); // no need for additional codes, can replace all codes
          });
      }
	}


  _allergenFilterChanged(e){

      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          //console.log("Cancelling empty search");
          this.set('allergenItems', []);
          return;
      }
      this.dataProvider && this.dataProvider.filter(latestSearchValue, 500, 0, 'descr', false, ['BE-ALLERGEN','CD-ATC']).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              //console.log("Cancelling obsolete search");
              return;
          }
          this.set('allergenItems', res.rows);
      });
	}

  _drugFilterChanged(e) {
      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          //console.log("Cancelling empty search");
          this.set('drugItems', []);
          return;
      }


      const search = this.dataProvider && (() => this.dataProvider.filterDrugsSamV2(latestSearchValue, 100, 0, 'name', false))

      if(this.drugFilterTimeout) {
          clearTimeout(this.drugFilterTimeout)
      }

      this.drugFilterTimeout = setTimeout(() => search().then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              //console.log("Cancelling obsolete search");
              return;
          }

          this.drugFilterTimeout = null
          this.set('drugItems', res.rows);
      }), 500)

	}

  _familyRiskFilterChanged(e){
      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          //console.log("Cancelling empty search");
          this.set('familyLinkItems', []);
          return;
      }
      this.dataProvider && this.dataProvider.filter(latestSearchValue, 500, 0, 'descr', false, ['BE-FAMILY-LINK']).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              //console.log("Cancelling obsolete search");
              return;
          }
          this.set('familyLinkItems', res.rows);
      });
	}

  _surgeryFilterChanged(e){
      let latestSearchValue = e && e.detail.value;
      this.latestSearchValue = latestSearchValue;
      if (!latestSearchValue || latestSearchValue.length < 2) {
          //console.log("Cancelling empty search");
          this.set('surgeryItems', []);
          return;
      }
      this.dataProvider && this.dataProvider.filter(latestSearchValue, 500, 0, 'descr', false, ['BE-THESAURUS-SURGICAL-PROCEDURES']).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              //console.log("Cancelling obsolete search");
              return;
          }
          this.set('surgeryItems', res.rows);
      });
	}

  _tagForEntity(e, type, code) {
      const tags = e && (e.tags || (e.tags = []));
      return tags.find(t => t.type === type) || create && (tags[tags.length] = { type: type, code: code, version: '1' });
	}

  _cdItemTagForEntity(e, create) {
      return this._tagForEntity(e , 'CD-ITEM', create && 'healthcareelement');
  }

  _nature() {
      const code = this._cdItemTagForEntity(this.entity, true);
      return code && code.code;
  }

  _status() {
      //possible returns
      //entity === null --> null
      //status & 3 === 3 -- x11 --> 'archived' !!! not 2
      //status & 2 === 2 -- x10 --> 'active-irrelevant'
      // && if closingdate before now -- x11 --> 'archived'
      //status & 1 === 1 -- x01 --> 'inactive'
      //status & 3 === 0 -- x00 --> 'active-relevant'
      // && if closingdate before now -- x01 --> 'inactive'
      return !this.entity ? null :
              ((this.entity.status || 0) & 3) === 3 ? 'archived' :
                      ((this.entity.status || 0) & 2) === 2 && (this.entity.closingDate && this.api.moment(this.entity.closingDate).isBefore()) ? 'archived' :
                              ((this.entity.status || 0) & 2) === 2 ? 'active-irrelevant' :
                                      ((this.entity.status || 0) & 1) === 1 ? 'inactive' :
                                              ((this.entity.status || 0) & 3) === 0 && (this.entity.closingDate && this.api.moment(this.entity.closingDate).isBefore()) ? 'inactive' :
                              'active-relevant';
  }

  _severity() {
      const code = this._tagForEntity(this.entity, 'CD-SEVERITY');
      return code && code.code;
  }

  _extraTemporality() {
      const code = this._tagForEntity(this.entity, 'CD-EXTRA-TEMPORALITY');
      return code && code.code;
  }

  _certainty() {
      const code = this._tagForEntity(this.entity, 'CD-CERTAINTY');
      return code && code.code;
  }

  _confidentiality(){
      const code = this._tagForEntity(this.entity, 'org.taktik.icure.entities.embed.Confidentiality');
      return code && code.code ? code.code : "notsecret";
	}

  _natureChanged(e) {
      this._cdItemTagForEntity(this.entity, true).code = e.detail.value;

      e.detail.value === "allergy" ? this.set("searchAllergen", true) : this.set("searchAllergen", false)
      e.detail.value === "adr" ? this.set("searchDrug", true) : this.set("searchDrug", false)
      e.detail.value === "familyrisk" ? this.set("searchFamilyLink", true) : this.set("searchFamilyLink", false)
      e.detail.value === "surgery" ? this.set("searchSurgery", true) :  this.set("searchSurgery", false)
	}

  _statusChanged(e) {
      switch (e.detail.value) {
          // case 'active': //will never be hit !
          // 	this.set('entity.closingDate', null);
          // 	((this.entity.status || 0) & 1) === 1 && this.set('entity.status', (this.entity.status || 0) - 1);
          // 	((this.entity.status || 0) & 2) === 1 && this.set('entity.status', (this.entity.status || 0) - 2);
          // 	break;
          case 'active-relevant': //set status to x00
              this.set('entity.closingDate', null);
              this.set('entity.status', (this.entity.status & 4 || 0));
              break;
          case 'active-irrelevant': //set status to x10
              this.set('entity.closingDate', null);
              this.set('entity.status', (this.entity.status & 4 || 0) | 2);
              break;
          case 'inactive': //set status to x01
              this.set('entity.status', (this.entity.status & 4 || 0) | 1);
              break;
          case 'archived': //set status to x11
              this.set('entity.status', (this.entity.status & 4 || 0) | 3);
              break;
      }
      console.log('status : ', this.entity.status)
	}

  _severityChanged(e) {
      this._tagForEntity(this.entity, 'CD-SEVERITY', 'normal').code = e.detail.value
  }

  _extraTemporalityChanged(e) {
      this._tagForEntity(this.entity, 'CD-EXTRA-TEMPORALITY', 'oneshot').code = e.detail.value
	}

  _certaintyChanged(e) {
      this._tagForEntity(this.entity, 'CD-CERTAINTY', 'probable').code = e.detail.value
	}

  _confidentialityChanged(e){
      this._tagForEntity(this.entity, 'org.taktik.icure.entities.embed.Confidentiality', 'notsecret').code = e.detail.value
	}

  _cellContent(item, column) {
      return _.isFunction(column.key) ? column.key(item) : _.get(item, column.key);
	}

  _key(column) {
      return _.isFunction(column.key) ? column.sortKey : column.key;
	}

  _label(language) {
      return `type:label.${['fr', 'nl'].includes(language) ? language : 'fr'}`;
	}

  click(e) {
      const selected = this.activeItem;

      console.log('selected ' + selected + ' - ' + this.latestSelected);
      if (this.inDoubleClick && (this.latestSelected === selected || this.latestSelected && !selected || !this.latestSelected && selected)) {
          this.select(this.latestSelected || selected);
      } else {
          this.latestSelected = selected;
          this.inDoubleClick = true;
          this.set('entity', _.assign(_.assign({}, this.entity || {}), selected));
          setTimeout(() => {
              delete this.inDoubleClick;
          }, 500);
      }
	}

  refresh() {
      //Give the gui the time to update the field
      setTimeout(function () {
          let currentValue = this.filterValue;

          if (this.latestSearchValue === currentValue) {
              return;
          }
          setTimeout(function () {
              if (currentValue === this.filterValue) {
                  console.log("Triggering search for " + this.filterValue);
                  this.$['entities-list'].clearCache();
              } else {
                  console.log("Skipping search for " + this.filterValue + " != " + currentValue);
              }
          }.bind(this), 500); //Wait for the user to stop typing
      }.bind(this), 100);
	}

  confirm() {
      if (this.entity || this.activeItem) {
          console.log(this.entity)
          this.select(this.entity || this.activeItem);
      }
	}

  select(item) {
      if (item) {
          this.dispatchEvent(new CustomEvent('entity-selected', { detail: item, composed: true }));
          this.$.dialog.close();
      }
	}

  open() {
      this.flushComboData()
      this.set("isValid",false)

      this.api.code().findPaginatedCodes('be', 'CD-TEMPORALITY', '')
          .then(c => this.set("temporalityList", c.rows.filter(c => c.code === "acute" || c.code === "subacute" || c.code === "chronic")))
          .finally(() => {
              this.$.dialog.open();
              this.$.dialog.scrollTop = 0;

              const type = this.entity.tags.find(t => t.type === "CD-ITEM")
              type && type.code === "allergy" ? this.set("searchAllergen", true) : this.set("searchAllergen", false)
              type && type.code === "familyrisk" ? this.set("searchFamilyLink", true) : this.set("searchFamilyLink", false)
              type && type.code === "adr" ? this.set("searchDrug", true) : this.set("searchDrug", false)
              type && type.code === "surgery" ? this.set("searchSurgery", true) :  this.set("searchSurgery", false)

              this.set("locked", true)
              Promise.all([
                  this._setComboboxValue("BE-THESAURUS","selectedItem"),
                  this._setComboboxValue("BE-FAMILY-LINK","familyRiskSelectedItem")
              ]).finally(() => {
                  this.set("locked", false)
                  this.dispatchEvent(new CustomEvent('open-health-problem', { bubbles: true, composed: true, detail: {entity: this.entity}}));
                  this._checkValidity();
              })
          })

	}

  flushComboData(){
      this.set('filterValue','')
      this.set('selectedItem',null)
      this.set('allergenFilterValue', '')
      this.set('allergenSelectedItem', null)
      this.set('drugFilterValue', '')
      this.set('drugSelectedItem', null)
      this.set('familyLinkFilterValue', '')
      this.set('familyRiskSelectedItem', null)
      this.set('surgeryFilterValue', '')
      this.set('surgerySelectedItem', null)
	}

  _closingDateChanged(date) {
      const dateString = date? this._formatDate(date) : "";
      if (dateString !== this._closingDateAsString) {
          this.set('_closingDateAsString', dateString);
      }
	}

  _formatDate(date){
      const tab =date? this.api.formatedMoment(date).substring(0, 10).split("/") : []
      tab.reverse()
      if(tab.length < 3)tab.push("00")
      if(tab.length < 3)tab.push("00")
      return tab.join("-")
	}

  _openingDateChanged(date) {
      const dateString = date ? this._formatDate(date) : '';
      if (dateString !== this._openingDateAsString) {
          this.set('_openingDateAsString', dateString);
      }
	}

  _ehDateChanged(startingDate, closingDate){
	    if(startingDate){
          startingDate && this.set("accuracyOpening",startingDate%100!==0 ? "day" : startingDate%10000!==0 ? "month" : "year");
          closingDate && this.set("accuracyClosing",closingDate%100!==0 ? "day" : closingDate%10000!==0 ? "month" : "year");

          let startingDateAsString = this.api.moment(startingDate,"ante").format("YYYY-MM-DD")
	        let closingDateAsString = closingDate ? this.api.moment(closingDate,"post").format("YYYY-MM-DD") : closingDate = moment().format("YYYY-MM-DD")

          this._isChronical(startingDateAsString, closingDateAsString) === true ? this.set("temporalityItemIdx", this.temporalityList.indexOf(this.temporalityList.find(c => c.code === "chronic"))) :
              this._isSubAcute(startingDateAsString, closingDateAsString) === true ? this.set("temporalityItemIdx", this.temporalityList.indexOf(this.temporalityList.find(c => c.code === "subacute"))) :
                  this._isAcute(startingDateAsString, closingDateAsString) === true ? this.set("temporalityItemIdx", this.temporalityList.indexOf(this.temporalityList.find(c => c.code === "acute"))) :
                      console.log("bug")
      }
	}

  _isChronical(start, end){
      return moment(start).isSameOrBefore(moment(end).subtract(6, "month"))
	}

  _isSubAcute(start, end){
     return moment(start).isBetween(moment(end).subtract(6, "month"), moment(end).subtract(1, "month"))
	}

  _isAcute(start, end){
      return moment(start).isSameOrAfter(moment(end).subtract(1, "month"))
	}

  _closingDateAsStringChanged(dateAsString) {
      if (!dateAsString) {
          this.entity && this.set('entity.closingDate', null);return;
      }
      const date = parseInt(dateAsString.replace(/(....)-(..)-(..)/, '$1$2$3')) * (this.displayTime ? 1000000 : 1);
      if (this.entity && date !== this.entity.closingDate) {
          this.entity && this.set('entity.closingDate', date);
      }
	}

  _openingDateAsStringChanged(dateAsString) {
      if (!dateAsString) {
          this.entity && this.set('entity.openingDate', null);return;
      }
      const date = parseInt(dateAsString.replace(/(....)-(..)-(..)/, '$1$2$3')) * (this.displayTime ? 1000000 : 1);
      if (this.entity && date !== this.entity.openingDate) {
          this.set('entity.openingDate', date);
      }
	}

  _selectedTemporalityItemChanged(item){
      if(item && item.id && this.entity){
          const selectedItem = this.temporalityList.find(c => c.code === item.id)

          if(this.entity.tags.find(t => t.type === "CD-TEMPORALITY")){
              this.entity.tags.splice(this.entity.tags.indexOf(this.entity.tags.find(t => t.type === "CD-TEMPORALITY")), 1);
              this.entity.tags.push(selectedItem);
          }else{
              this.entity.tags.push(selectedItem);
          }

          console.log(this.entity.tags)


      }
	}

  _getTpLabel(item){
	    return item.label[this.language] ? item.label[this.language] : item.label.en
	}

  _stripCodesByTypes(codes, types) {
	    return (codes || []).filter(c=> !types.includes(c.type))
	}

  _checkValidity(){
	    if(this.entity.codes){
	        this.set("isValid",true)
      }
      else{
          this.set("isValid",false)
      }
	}

  _setComboboxValue(codeType, componentValueToSet) {

      const promResolve = Promise.resolve()
      const entityCode = _.find(_.get(this,"entity.codes",[]), c => c.type === codeType)
      const entityCodeLabel = !!_.trim(_.get(entityCode,"label." + this.language, "")) ? _.trim(_.get(entityCode,"label." + this.language, "")) : _.trim(_.find(_.flatMap(_.get(entityCode,"label",{})),_.trim))

      return !this.dataProvider || !_.size(entityCode) || !_.trim(entityCodeLabel) ? promResolve : promResolve.then(() => this.dataProvider.filter(entityCodeLabel, 500, 0, "descr", false, [codeType]).then(res => {
          const entityCodeId = _.trim(_.get(entityCode,"id",""))
          const valueToAssign = _.find(_.get(res,"rows",[]), i => _.get(i,"codes",[]).indexOf(entityCodeId) > -1)
          return !!_.size(_.get(res, "rows[0]", {})) && !!entityCodeId && !!_.size(valueToAssign) ? this.set(componentValueToSet, valueToAssign) : false
      }))

	}
}

customElements.define(HealthProblemSelector.is, HealthProblemSelector);
