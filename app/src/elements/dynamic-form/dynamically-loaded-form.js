import '../../styles/icpc-styles.js';
import '../../styles/buttons-style.js';
import './dynamic-form.js';
import './dynamic-pills.js';
import {simple} from 'acorn/dist/walk'
import {parse} from 'acorn'
import * as evaljs from "evaljs"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class DynamicallyLoadedForm extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style include="icpc-styles buttons-style">

			.title-bar {
				flex-grow: 2;
				text-align: right;
			}

			.containerPlanAction{
				height: 470px;
				width: auto;
				overflow: auto;
			}

			vaadin-combo-box {
				width: calc(100% - 48px);
				margin: 8px 0;
			}

			paper-input{
				width: calc(100% - 48px);
				margin: 8px 0;
			}

			#cpa_description{
				height: 125px;
				width: calc(100% - 48px);
			}

			paper-item {
				font-size: 14px;
				min-height: 30px;
			}

			.fancy {
				line-height: 0.5;
				text-align: center;
				height: 18px;
                overflow-x: hidden;
			}
			.fancy span {
				display: inline-block;
				position: relative;
				font-size: 11px;
				color: var(--app-text-color-disabled);
			}
			.fancy span:before,
			.fancy span:after {
				content: "";
				position: absolute;
				height: 5px;
				border-bottom: 1px solid var(--app-secondary-color);
				border-top: 1px solid var(--app-secondary-color-light);
				top: 0;
				width: 600px
			}
			.fancy span:before {
				right: 100%;
				margin-right: 15px;
			}
			.fancy span:after {
				left: 100%;
				margin-left: 15px;
			}
		</style>

		<template is="dom-if" if="[[_shouldDisplay(form, form.deletionDate, contact)]]">
			<dynamic-form id="dynamic-form" api="[[api]]" user="[[user]]" language="[[language]]" resources="[[resources]]" template="[[form.template.layout]]" reports="[[formReports]]" data-provider="[[dataProvider]]" i18n="[[i18n]]" data-map="[[dataMap]]" linkable-health-elements="[[mainHealthElements]]" title="[[form.template.name]]" read-only="[[_isNotInCurrentContact(currentContact, contact, form, currentContact.subContacts.*)]]" show-title="true" health-elements="[[healthElements]]" disabled="[[currentContact.closingDate]]" on-link-form="linkForm" on-link-to-health-element="linkService" on-unlink-to-health-element="unlinkService" on-delete-form="deleteForm" on-status-changed="_statusChanged" on-dynamically-event="_openActionDialog" subcontact-type="[[subcontactType]]" on-subcontact-type-change="_subContactTypeChange">
				<div slot="titlebar" class="title-bar">
					<dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*, dataProvider)]]" highlighted-hes="{{highlightedHes}}"></dynamic-pills>
				</div>
			</dynamic-form>
		</template>
		<template is="dom-if" if="[[_shouldDisplaySummary(form, form.deletionDate, contact)]]">
			<div class="fancy"><span>[[localize('modification_of','Modification of',language)]] [[form.template.name]] [[localize('of','of',language)]] [[_dateFormat(form.created)]]</span></div>
		</template>
`;
  }

  static get is() {
      return 'dynamically-loaded-form';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              observer: '_apiChanged'
          },
          user: {
              type: Object
          },
          patient: {
              type: Object,
              value: null
          },
          contact: {
              type: Object,
              value: null
          },
          contacts: {
              type: Array,
              value: []
          },
          formReports: {
              type: Array,
              value: []
          },
          servicesMap: {
              type: Object,
              value: {}
          },
          healthElements: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          highlightedHes: {
              type: Array,
              value: function () {
                  return [];
              }
          },
          currentContact: {
              type: Object,
              value: null
          },
          formId: {
              type: String,
              observer: '_formIdChanged'
          },
          form: {
              type: Object,
              value: null
          },
          dataProvider: {
              type: Object,
              value: null
          },
          dataMap: {
              type: Object,
              value: null
          },
          hcpListItem: {
              type: Array,
              value: []
          },
          filterValue: {
              type: String
          },
          drugsFilterValue: {
              type: String
          },
          drugsListItem: {
              type: Array,
              value: []
          }
      };
  }

  static get observers() {
      return ["_loadReports(form.template.reports.*, form.template.layout)", "_prepareDataProvider(contact, contacts.*, servicesMap.*, form, patient,user)", '_hcpFilterChanged(filterValue)', '_proceduresFilterChanged(proceduresFilterValue)', '_drugsFilterChanged(drugsFilterValue)','currentContactChanged(currentContact)'];
  }

  constructor() {
      super();
  }

  disconnectedCallback() {
      this.flushSave()
      super.disconnectedCallback()
  }

  _dateFormat(date) {
      return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
  }

  _shouldDisplay(form) {
      return form && !form.deletionDate && this.contact && (!(form.contactId || !this.contact.id) || this.contact.id === form.contactId)
  }

  _shouldDisplaySummary(form) {
      return form && !form.deletionDate && this.contact && !(!(form.contactId || !this.contact.id) || this.contact.id === form.contactId)
  }

  _isNotInCurrentContact(currentContact, contact, form) {
      if(form && this.localize('service_mod_del','Modified or deleted service',this.language)===form.template.name)return true
      return form && contact && (!currentContact || (contact !== currentContact && !currentContact.subContacts.some(sc => sc.formId === form.id)));
  }

  linkService(e) {
      const he = e.detail.healthElement
      if (!he) return;
      const ctc = this.currentContact
      ;(he.id ? Promise.resolve(he) : this.promoteServiceToHealthElement(he)).then(he => {
              this.dataProvider.getServicesInContact(e.detail.representedObject).forEach(svcStruc => svcStruc && svcStruc[0] && svcStruc[0].svc && !!svcStruc[0].svc.endOfLife && this.api.contact().promoteServiceInContact(ctc, this.user, this._allContacts(), svcStruc[0].svc, this.form.id, null, [he.id]))
              this.scanServicesAndScheduleSave(ctc)
          }
      )
  }

  unlinkService(e){
      const he = e.detail.healthElement
      if (!he) return;
      const heIndex = _.findIndex(this.currentContact.subContacts,subC => subC.healthElementId === he.id);
      this.splice("currentContact.subContacts", heIndex , 1)
      this.scanServicesAndScheduleSave(this.currentContact)
  }

  linkForm(e) {
      const he = e.detail.healthElement
      if (!he) return;
      const ctc = this.currentContact
      if (!he.id) {
          this.promoteServiceToHealthElement(he).then(he => {
              _.assign(e.detail.healthElement, he) //Prevent subsequent promotions
              if (!ctc.subContacts.some(sc => sc.formId === this.formId && sc.healthElementId === he.id))
                  this._link(he, ctc)
          });
      } else if (!this._selectedHes().includes(he.id))
					this._link(he, ctc)
  }

  _link(he, ctc) {
      if (this.contact === ctc)
					this.push('contact.subContacts', {formId: this.formId, healthElementId: he.id, services: []})
      else
					ctc.subContacts.push({formId: this.formId, healthElementId: he.id, services: []})
      this.scanServicesAndScheduleSave(ctc);
  }

  _openActionDialog(e, detail) {
      this.dispatchEvent(new CustomEvent('plan-action', {detail: this.dataProvider && this.dataProvider.getStringValue(detail.representedObject), bubbles: true, composed: true})); //Must be fired before the end of the save otherwise the element won't exist anymore and the event will not bubble up
  }

  _selectedHes() {
      if (!this.dataProvider || !this.healthElements)
          return []
      const svcsStructs = _.chain(this.dataProvider.servicesInHierarchy()).map(svcLine => svcLine[0]).compact().value()
      const heIds = _.chain(svcsStructs).flatMap(svcstr => svcstr.ctc.subContacts.filter(sc => sc.services.some(s => s.serviceId === svcstr.svc.id)).map(sc => sc.healthElementId)).compact().uniq().value()
      const scHeIds = _.chain(this.contact.subContacts.filter(sc => sc.formId === this.formId).map(sc => sc.healthElementId)).compact().uniq().value()
      return this.healthElements.filter(he => he.id && (heIds.includes(he.id) || scHeIds.includes(he.id)))
  }

  _allContacts() {
      return this.contacts.includes(this.contact) ? this.contacts : _.concat([this.contact], this.contacts)
  }

  _contactDescr(contactId) {
      const ctc = (this.contact && this.contact.id === contactId ? this.contact : this.contacts && this.contacts.find(c => c.id === contactId))
      return ctc && ctc.descr || contactId
  }

  _loadReports() {
      const reports = this.form && this.form.template && this.form.template.reports || []
      this.form && this.form.template && this.form.template.layout && this.form.template.layout.sections.forEach(s => s.formColumns.forEach(c => c.formDataList.forEach(field => {
          if (field.type === 'TKAction') {
              //reports.push()
					}
      })))

      Promise.all(reports.map(r => this.api.doctemplate().getDocumentTemplate(r)))
					.then(tpls => {this.formReports = [{name:'Report'}].concat(tpls);})
  }

  _prepareDataProvider() {
      if (this.contacts && this.contact && this.form && this.user && this.patient && this.servicesMap) {
          this.set('dataProvider', this.getDataProvider(this.form, ''));

          if (this.form.id && !this.form.hasBeenInitialized) {
              this.form.hasBeenInitialized = true
              this.api.form().modifyForm(this.form).then(f => this.form.rev = f.rev)
              this.dataProvider.computeFormulas(['OnCreate'])

              _.get(this,"form.template.layout.sections",[]).forEach(s => s.formColumns
                      .forEach(c => c.formDataList
                              .forEach(fdl => fdl.subForm === true && (fdl.editor.compulsoryFormGuids || [])
                                      .forEach(ftguid => this.dataProvider.addSubForm(fdl.name, ftguid)))
                      ))
					}

          if ((this.form.template || {}).layout) {
              const layoutItems = _.flatten(_.flatten(this.form.template.layout.sections.map(s => s.formColumns)).map(c => c.formDataList))
              this.set('dataMap', _.fromPairs(layoutItems.map(f => [f.name, 1])))
					} else if (this.form.id) {
              this.set('dataMap', _.fromPairs(_.flatten(this._allContacts().map(c => {
                  const sc = c.subContacts.find(sc => sc.formId === this.form.id);
                  return sc && c.services.filter(s => sc.services.map(s => s.serviceId).includes(s.id)).map(s => [s.label, s]) || []
              }))))
					} else {
              const idsInScs = this.contact.subContacts.flatMap(sc => sc.formId ? sc.services.map(s => s.serviceId) : [])
              this.set('dataMap', _.fromPairs(_.compact(this.contact.services.map(s => {
                  if (!idsInScs.includes(s.id)) {
                      return [s.label, s]
                  }
                  return null
              }))))
          }

					if (!this.form.template || !this.form.template.layout) {
              this.set('form.template.layout', {
                  sections: [{
                      formColumns: [{
                          formDataList: _.compact(Object.values(this.dataMap).map((s, idx) => {
                              const c = this.api.contact().preferredContent(s, this.language);
                              return c ? {
                                  name: s.label,
                                  label: s.label,
                                  editor: {
                                      key: c.medicationValue ? 'MedicationTableEditor' : c.numberValue || c.numberValue === 0 ? 'NumberEditor' : c.measureValue ? 'MeasureEditor' : "StringEditor",
                                      left: 0,
                                      width: 400,
                                      top: idx * 20,
                                      multiline: true
                                  }
                              } : null;
                          }))
                      }]
                  }]
              });
          }
          !this.currentContact && this.set('currentContact', this._allContacts().find(c => !c.closingDate) || null);
      }
  }

  scanServicesAndScheduleSave(ctc) {
      if (!ctc) {
          return;
      }

      this.dataProvider.computeFormulas(['OnChange']).finally(() => {
          //Make sure that healthElements contain new potential linkables
          const idLinkables = this.healthElements.map(he=>he.idService)

          const promiseChain = ctc.services.filter(s => s.tags.some(t => t.type === 'CD-ITEM' && (t.code === 'healthcareelement'  || t.code === 'healthissue')))
              .map(svc => {
                  const descr = this.shortServiceDescription(svc, this.language)
                  if (descr && descr.length && !idLinkables.includes(svc.id)) {
                      const he = {
                          created: svc.created,
                          modified: svc.modified,
                          endOfLife: svc.endOfLife,
                          author: svc.author,
                          responsible: svc.responsible,
                          codes: svc.codes,
                          tags: svc.tags,
                          valueDate: svc.valueDate,
                          openingDate: svc.openingDate,
                          closingDate: svc.closingDate,
                          descr: descr,
                          idService: svc.id,
                          status: svc.status,
                          svc: svc,
                          plansOfAction: []
                      }
                      return this.api.code().icpcChapters(he.codes.filter(c => c.type === 'ICPC' || c.type === 'ICPC2').map(x => x.code))
                          .then(([code]) => {
                              code && code.descr && ((he.colour = code.descr.colour))
                          })
                          .finally(() => {
                              idLinkables.push(svc.id)

                              this.splice('healthElements', 0, 0, he)
                              this.splice('mainHealthElements', 0, 0, he)
                          })
                  }
              })

          Promise.all(promiseChain).then(() => {
              this.dispatchEvent(new CustomEvent('data-change', {detail: ctc, bubbles: true, composed: true})); //Must be fired before the end of the save otherwise the element won't exist anymore and the event will not bubble up
              if (this.saveTimeout) {
                  clearTimeout(this.saveTimeout);
              }
              const saveAction = this.saveAction = () => {
                  console.log("Saving...")
                  this.saveTimeout = undefined;

                  return new Promise((resolve,reject) =>
                      this.dispatchEvent(new CustomEvent('must-save-contact', {detail: {contact: ctc, preSave: () => this.dataProvider.computeFormulas(['OnSave']), postSave:(ctc) => resolve(ctc), postError: (e) => reject(e)}, bubbles: true, composed: true})))//Must be fired before the end of the save otherwise the element won't exist anymore and the event will not bubble up
              };
              this.saveTimeout = setTimeout(saveAction, 10000); //Make sure the save is done with the right saveAction by using a const
          })
      })


  }

  shouldSave() {
      return !!this.saveTimeout
  }

  flushSave() {
      if (this.saveTimeout) {
          clearTimeout(this.saveTimeout);

          const action = this.saveAction;

          this.saveTimeout = undefined;
          this.saveAction = undefined;

					return action && action()
      }
      return null
  }

  _timeFormat(date) {
      return date ? this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : '';
  }

  getDataProvider(form, rootPath) {
      const layoutInfoPerLabel = (form.template.layout && form.template.layout.sections && _.flatMap(form.template.layout.sections, s => s.formColumns && _.flatMap(s.formColumns, c => c.formDataList || []) || []) || []).reduce((acc, fli) => {
              acc[fli.name] = fli;
              return acc;
					}, {})

      const initWrapper = (label, init) => svc => {
          const li = layoutInfoPerLabel[label];
          if (li) {
              li.tags && li.tags.forEach(tag => {
                  const exTag = svc.tags.find(t => t.type === tag.type);
                  if (exTag) {
                      exTag.code = tag.code;
                      if (exTag.id) {
                          exTag.id = tag.type + '|' + tag.code + "|" + (exTag.id.split('|')[2] || '1');
                      }
                  } else {
                      svc.tags = (svc.tags || []).concat([tag]);
                  }
              });
              li.codes && li.codes.forEach(code => {
                  const exCode = svc.codes.find(c => c.type === code.type && c.code === code.code);
                  if (!exCode) {
                      svc.codes = (svc.codes || []).concat([code]);
                  }
              });
              if (li.defaultStatus || li.defaultStatus === 0) {
                  svc.status = li.defaultStatus;
              }
          }
          return init && init(svc) || svc;
      };

      const self = {
          subFormsMap: {},
          servicesMap: {},
					parentForm: form.parent ? this._getFormParent(this.dataProvider,form.parent) : {},
					sortedItems: () => {
              const layoutItems = form.template && form.template.layout && _.flatten(_.flatten((form||this.form).template.layout.sections.map(s => s.formColumns)).map(c => c.formDataList))
              return _.sortBy(_.compact(
                  layoutItems && layoutItems.map(s => (_.assign({name:s.name, label:s.subForm ? s.label : s.name, isSubForm: s.subForm, type: s.type, unit:s.type==="TKMeasure" ?
                          s.defaultValue.find(value=> Object.keys(value).find(key=> key==="measureValue")).measureValue.unit : ""
                      }))) ||
                  _.uniq(self.services.map(s => s.svc && ({name:s.svc.label, label:s.svc.label})))
              ))
					},
          form: () => form,
          computeFormulas: (lifecycles) => {
              try {
                  form = form || this.form
                  const layoutItems = _.flatten(_.flatten(form.template.layout.sections.map(s => s.formColumns)).map(c => c.formDataList))
                  const lis = layoutItems.filter(li => li.subForm || (li.formulas || []).some(f =>f && f.lifecycle && lifecycles.includes(f.lifecycle.toString())) || (li.defaultValue && lifecycles.includes('OnCreate')) )

                  form.children.forEach( child =>{
                      lis.findIndex(li=> li.subForm && child.descr === li.name)!==-1 && self.getSubForms(child.descr).map(subForms => subForms.dataProvider.computeFormulas(lifecycles))
                  })

                  const computables = lis.filter(li => !li.subForm).map(li => {
                      const deps = []
                      const shouldWrap = {}
                      ;(li.formulas || []).filter(f => f && f.lifecycle && lifecycles.includes(f.lifecycle.toString())).forEach(f => {
                          const expr = `(function(x) { ${f.value} })(x)`
                          const parsed = parse(expr)
                          shouldWrap[f.value] =  parsed.body[0].expression.callee.body.body.length === 1 && _.last(parsed.body[0].expression.callee.body.body).type === "ExpressionStatement"

                          simple(parsed, {
                              MemberExpression(node) {
                                  if (node.object.name === 'x' && li.label!==node.property.name) {
                                      deps.push(node.property.name)
                                  }
                              }
                          })
                      })
                      return {name: li.name, deps: deps, shouldWrap: shouldWrap, li: li}
                  })

                  const visit = (computables, oks) => {
                      const okNames = oks.map(k => k.name)
                      const thisPass = computables.filter(li => !okNames.includes(li.name) && (li.deps.length === 0 || li.deps.every(d => okNames.includes(d) || !computables.some(c => c.name === d))))

                      return thisPass.length > 0 ? visit(computables, oks.concat(thisPass)) : oks
                  }

                  const orderedComputables = visit(computables, [])

                  if (orderedComputables.length) {
                      const env = new evaljs.Environment({
                          patient: this.patient,
                          contact: this.contact,
                          contacts: this.contacts,
                          x: _.keys(this.servicesMap).reduce((x, label) => {
                              x[label] = self.getRawValue(label)
                              return x
                          }, {}),
                          parent: self.form().parent ? _.keys(this.servicesMap).reduce((x, label) => {
                              x[label] = self.parentForm.getRawValue(label)
                              return x
                          }, {}): {},
                          children: self.hasSubForms() ? self.subFormsMap.reduce((x,child) =>{
                              x[child.template.name] = _.keys(this.servicesMap).reduce((y, label) => {
                                  y[label] =	child.dataProvider.getRawValue(label)
                                  return y
                              }, {})
                              return x;
                          },{}) : {}
                      });
                      return Promise.all(orderedComputables.map(comp => {
                          const f = (comp.li.formulas || []).find(f => f && f.lifecycle && lifecycles.includes(f.lifecycle.toString()))

                          const expr = f && `(function(x,patient,contact,contacts) { ${comp.shouldWrap[f.value] ? `return (${f.value});` : f.value} })(x,patient,contact,contacts)`
                          const gen = expr && (env.gen(expr)())
                          let status = {done: false, value: null}

                          while (gen && !status.done) {
                              status = gen.next() //Execute lines one by one
                          }

                          const compValue = status.value !== null ? status.value : (lifecycles.includes('OnCreate') ? typeof comp.li.defaultValue === "object" ? this.api.contact().contentValue(comp.li.defaultValue[0])  : comp.li.defaultValue : null)

                          ;['StringEditor', 'PopupMenuEditor'].includes(comp.li.editor.key) && (!compValue || typeof compValue === 'string') && self.setStringValue(comp.name, compValue, false);
                          ;['NumberEditor'].includes(comp.li.editor.key) && (!compValue || typeof compValue === 'number') && self.setNumberValue(comp.name, compValue === 0 ? 0 : (Number(compValue.toFixed(3)) || null), false);
                          ;['MeasureEditor'].includes(comp.li.editor.key) && (!compValue || typeof compValue === 'number') && self.setMeasureValue(comp.name, {value: Number(compValue.toFixed(3))} || null, false);
                          ;['MeasureEditor'].includes(comp.li.editor.key) && (!compValue || typeof compValue === 'object') && self.setMeasureValue(comp.name, Number(compValue.toFixed(3)) || null, false);
                          ;['DateTimeEditor'].includes(comp.li.editor.key) && (!compValue || typeof compValue === 'number') && self.setDateValue(comp.name, status.value || null, false);
                          ;['DateTimeEditor'].includes(comp.li.editor.key) && (typeof compValue === 'string') && self.setDateValue(comp.name,isNaN(Date.parse(compValue)) ? compValue : Date.parse(compValue) || null, false);
                          ;['CheckBoxEditor'].includes(comp.li.editor.key) && (typeof compValue === 'boolean') && self.setBooleanValue(comp.name, compValue || false,false);

                          this.root.querySelector('#dynamic-form') && this.root.querySelector('#dynamic-form').notify((rootPath.length ? rootPath + '.' : '') + comp.name)

                          return Promise.resolve(status.value)
                      })).catch(() => [])
                  } else {
                      return Promise.resolve([])
                  }
              } catch (e) {
                  return Promise.resolve([])
              }
					},
          //Returns an array of arrays of svcStructs (a svcStruct is a map with the ctc, the svc and the subContacts this svc belongs to). All svcStructs in the second array share the same svc id
          services: label => {
              if (label && self.servicesMap[label]) {
                  return self.servicesMap[label];
              }
              return label ? self.servicesMap[label] = this.servicesInForm(form.id, label) : this.servicesInForm(form.id);
          },
					subContactTitle: () => {
              const scs = this.contact && this.contact.subContacts.find(sc => sc.formId === form.id)
              const contactType = scs && scs.tags && scs.tags.find(t => t.type === "BE-CONTACT-TYPE") || []
              const type = this.subcontactType && this.subcontactType.length && this.subcontactType.find(c => c.id === contactType.id)
              return type && "("+type.label[this.language]+")" || ""
					},
          servicesInHierarchy: label => {
              return _.concat(self.services(label), _.flatMap(form.children, sf => this.getDataProvider(sf, (rootPath.length ? rootPath + '.' : '') + sf.descr + '.' + form.children.filter(sff => sff.descr === sf.descr).indexOf(sf)).servicesInHierarchy(label)));
          },
          dispatchService: svc => {
              if (!svc) {
                  return null;
              }
              delete self.servicesMap[svc.label];
              this.dispatchEvent(new CustomEvent('new-service', {
                  detail: {
                      ctc: this.currentContact,
                      svc: svc,
                      scs: this.currentContact.subContacts.filter(sc => sc.formId === form.id)
                  }, composed: true
              }));

              return svc;
          },
          promoteOrCreateService: (label, formId, poaIds, heIds, init) => {
              let s = self.getServiceInContact(label);
              if (!this.currentContact) {
                  return s && s.svc;
              }
              if (s) {
                  //Make sure we have exactly the one that is in currentContact if it exists
                  s.svc = s.svc && (this.currentContact.services.find(ss => ss.id === s.svc.id) || s.svc) || null
              }
              return s && s.svc && (s.ctc.id === this.currentContact.id ? initWrapper(label, init)(s.svc) : self.dispatchService(this.promoteServiceInCurrentContact(s.svc, formId, poaIds, heIds, initWrapper(label, init)))) || self.dispatchService(this.createService(label, formId, poaIds, heIds, null, initWrapper(label, init)));
          },
          getOrCreateContent: (svc, lng) => svc && (svc.content && this.api.contact().preferredContent(svc, lng) || ((svc.content || (svc.content = {}))[lng] = {})),
          //Returns an array of svcStructs (a svcStruct is a map with the ctc, the svc and the subContacts this svc belongs to). All svcStructs share the same svc id. If there is a choice between several series of services. Pick the one that preferably appears in the contact.
          getServicesLineForContact: label => {
              const sss = self.services(label);
              return sss && (sss.find(svcs => svcs.find(ss => ss.ctc.id === this.contact.id)) || sss[0]) || [];
          },
          getServicesLinesForContact: label => {
              const sss = self.services(label);
              return sss && (sss.filter(svcs => svcs.find(ss => !ss.ctc || ss.ctc.id === this.contact.id)) || sss[0]) || [];
          },
          getServiceInContact: label => {
              const ssLine = self.getServicesLineForContact(label);
              return ssLine && ssLine.find(ss => !this.api.after(ss.ctc.created, this.contact.created));
          },
          getServicesInContact: label => {
              const ssLines = self.getServicesLinesForContact(label);
              return ssLines && ssLines.filter(ss => !ss.ctc || !this.api.after(ss.ctc.created, this.contact.created));
          },
          wasModified: label => {
              const s = self.getServiceInContact(label);
              return s && (this.api.before(s.ctc.openingDate, this.contact.openingDate) || this.api.before(s.ctc.created, this.contact.created));
          },
          isModifiedAfter: label => {
              const s = self.getServicesLineForContact(label);
              return s && s[0] && s[0] !== self.getServiceInContact(label);
          },
          latestModification: label => {
              const s = self.getServicesLineForContact(label);
              return s && s[0] && this._timeFormat(s[0].ctc.openingDate);
          },
          getValueContainers: label => {
              const c = _.compact(self.services(label).map(line => line && line[0]).map(s => s && s.svc && !s.svc.endOfLife && s.svc)).map(s => _.cloneDeep(s)); //Never provide the real objects so that we can compare them later on
              return c;
          },
          setValueContainers: (label, containers) => {
              if (!this.currentContact) {
                  return;
              }
              let currentValueContainers = self.getValueContainers(label);
              if (_.isEqual(currentValueContainers, containers)) {
                  return;
              }
              const isModified = containers.map(container => {
                  let svc = this.currentContact.services.find(s => s.id === container.id);
                  if (svc) {
                      _.pull(currentValueContainers, currentValueContainers.find(s => s.id === container.id));
                      if (!_.isEqual(svc.content, container.content) || svc.index !== container.index || svc.endOfLife) {
                          _.extend(svc.content, _.cloneDeep(container.content));
                          svc.index = container.index;
                          delete svc.endOfLife;

                          return true;
                      }
                  } else {
                      const prevSvc = currentValueContainers.find(s => s.id === container.id);
                      if (prevSvc) {
                          _.pull(currentValueContainers, currentValueContainers.find(s => s.id === container.id));
                      }
                      if (!prevSvc || !_.isEqual(prevSvc.content, container.content)) {
                          const createdSvc = this.createService(label, form.id, null, (this.highlightedHes || []).map(he => he.id), container.id, initWrapper(label));
                          self.dispatchService(_.extend(
                                  createdSvc,
                                  {
                                      index: container.index,
                                      content: _.cloneDeep(container.content),
                                      codes: container.codes && container.codes.map(_.cloneDeep),
                                      tags: _.unionBy(createdSvc.tags, container.tags && container.tags.map(_.cloneDeep), "type")
                                  }));
                          return true;
                      }
                  }
                  return false;
              }).find(x => x);
              currentValueContainers.forEach(service => {
                  let svc = this.currentContact.services.find(s => s.id === service.id);
                  if (svc) {
                      svc.endOfLife = +new Date() * 1000;
                  } else {
                      self.dispatchService(_.extend(this.createService(label, form.id, null, null, service.id, initWrapper(label)), {endOfLife: +new Date() * 1000}));
                  }
              });
              if (isModified || currentValueContainers.length) {
                  this.scanServicesAndScheduleSave(this.currentContact);
              }
          },
          getStringValue: (label, original) => {
              const s = !original ? self.getServicesLineForContact(label)[0] : self.getServiceInContact(label);
              const c = s && s.svc && ((s.svc.endOfLife && this.localize('service_mod_del','Modified or deleted service',this.language)===this.form.template.name) || !s.svc.endOfLife) && this.localizedContent(s.svc, this.language);
              return c && c.stringValue;
          },
          getNumberValue: (label, original) => {
              const s = !original ? self.getServicesLineForContact(label)[0] : self.getServiceInContact(label);
              const c = s && s.svc && ((s.svc.endOfLife && this.localize('service_mod_del','Modified or deleted service',this.language)===this.form.template.name) || !s.svc.endOfLife) && this.localizedContent(s.svc, this.language);
              return c && c.numberValue;
          },
          getMeasureValue: (label, original) => {
              const s = !original ? self.getServicesLineForContact(label)[0] : self.getServiceInContact(label);
              const c = s && s.svc && ((s.svc.endOfLife && this.localize('service_mod_del','Modified or deleted service',this.language)===this.form.template.name) || !s.svc.endOfLife) && this.localizedContent(s.svc, this.language);
              return c && c.measureValue || {value:null, unit: self.sortedItems().find(item => item.label===label).unit};
          },
          getDateValue: (label, original) => {
              const s = !original ? self.getServicesLineForContact(label)[0] : self.getServiceInContact(label);
              const c = s && s.svc && ((s.svc.endOfLife && this.localize('service_mod_del','Modified or deleted service',this.language)===this.form.template.name) || !s.svc.endOfLife) && this.localizedContent(s.svc, this.language);
              return c && (c.fuzzyDateValue || c.instantValue);
          },
          getBooleanValue: (label, original) => {
              const s = !original ? self.getServicesLineForContact(label)[0] : self.getServiceInContact(label);
              const c = s && s.svc && ((s.svc.endOfLife && this.localize('service_mod_del','Modified or deleted service',this.language)===this.form.template.name) || !s.svc.endOfLife) && this.localizedContent(s.svc, this.language);
              return c && c.booleanValue;
          },
          getValueDateOfValue: (label, original) => {
              const s = !original ? self.getServicesLineForContact(label)[0] : self.getServiceInContact(label);
              return s && s.svc && ((s.svc.endOfLife && this.localize('service_mod_del','Modified or deleted service',this.language)===this.form.template.name) || !s.svc.endOfLife) && s.svc.valueDate;
          },
          getValue: (label) => {
              const valContainers = self.getValueContainers(label)

              if (valContainers && valContainers.length > 1) {
                  return valContainers.map(svc => this.api.contact().shortServiceDescription(svc, this.language))
              } else {
                  const s = self.getServicesLineForContact(label)[0];
                  return s ? s.svc ? this.api.contact().shortServiceDescription(s.svc, this.language) : "<NA>" : "-";
              }
					},
          getRawValue: (label) => {
              const s = self.getServicesLineForContact(label)[0];
              const c = s && s.svc && this.api.contact().preferredContent(s.svc, this.language)

              return c && (c.measureValue && (c.measureValue.value || c.measureValue.value === 0) ? c.measureValue.value : this.api.contact().contentValue(c))
          },
          setStringValue: function (label, value, save = true) {
              const currentValue = self.getStringValue(label)
              if ((currentValue || null) === (value || null) || ((!currentValue || !currentValue.length) && (!value || !value.length))) {
                  return;
              }
              self.promoteOrCreateService(label, form.id, null, (this.highlightedHes || []).map(he => he.id), svc => {
                  let c = self.getOrCreateContent(svc, this.language);
                  if (c && c.stringValue !== value) {
                      c.stringValue = value;
                      save && this.scanServicesAndScheduleSave(this.currentContact);
                  }
                  return svc;
              });
          }.bind(this),
          setNumberValue: function (label, value, save = true) {
              if (self.getNumberValue(label) === parseFloat(value)) {
                  return;
              }
              self.promoteOrCreateService(label, form.id, null, (this.highlightedHes || []).map(he => he.id), svc => {
                  let c = self.getOrCreateContent(svc, this.language);
                  if (c && c.numberValue !== value) {
                      c.numberValue = value;
                      save && this.scanServicesAndScheduleSave(this.currentContact);
                  }
                  return svc;
              });
          }.bind(this),
          setMeasureValue: function (label, value, save = true) {
              const currentValue = self.getMeasureValue(label);
              if (!value || !value.value || !value.unit || ((currentValue.value || 0)===(value.value||0) && (currentValue.unit || null) === (value.unit || null))) {
                  return;
              }

              self.promoteOrCreateService(label, form.id, null, (this.highlightedHes || []).map(he => he.id), svc => {
                  let c = self.getOrCreateContent(svc, this.language);
                  if (c && c.measureValue !== value) {
                      c.measureValue = value;
                      save && this.scanServicesAndScheduleSave(this.currentContact);
                  }
                  return svc;
              });
          }.bind(this),
          setDateValue: function (label, value, save = true) {
              if (self.getDateValue(label) === value) {
                  return;
              }
              self.promoteOrCreateService(label, form.id, null, (this.highlightedHes || []).map(he => he.id), svc => {
                  let c = self.getOrCreateContent(svc, this.language);
                  // if (c && c.fuzzyDateValue !== this.api.moment(value).format("YYYYMMDD000000")) {
                  if (value && c && c.fuzzyDateValue !== this.api.moment(value).format("YYYYMMDD")) {
                      // c.fuzzyDateValue = this.api.moment(value).format("YYYYMMDD000000");
                      c.fuzzyDateValue = this.api.moment(value).format("YYYYMMDD");
                      save && this.scanServicesAndScheduleSave(this.currentContact);
                  }
                  return svc;
              });
          }.bind(this),
          setBooleanValue: function (label, value, save = true) {
              if (self.getBooleanValue(label) === value) {
                  return;
              }
              self.promoteOrCreateService(label, form.id, null, (this.highlightedHes || []).map(he => he.id), svc => {
                  let c = self.getOrCreateContent(svc, this.language);
                  if (c && c.booleanValue !== value) {
                      c.booleanValue = value;
                      save && this.scanServicesAndScheduleSave(this.currentContact);
                  }
                  return svc;
              });
          }.bind(this),
          setValueDateOfValue: function (label, value, setBooleanValue, save = true) {
              if (self.getValueDateOfValue(label) === value) {
                  return;
              }
              self.promoteOrCreateService(label, form.id, null, (this.highlightedHes || []).map(he => he.id), svc => {
                  if (!svc) {
                      return;
                  }
                  if (svc.valueDate !== value) {
                      svc.valueDate = value;
                      if (setBooleanValue) {
                          let c = self.getOrCreateContent(svc, this.language);
                          if (c && c.booleanValue !== value) {
                              c.booleanValue = value;
                          }
                      }
                      save && this.scanServicesAndScheduleSave(this.currentContact);
                  } else if (setBooleanValue) {
                      self.setBooleanValue(!!value);
                  }
                  return svc;
              });
          }.bind(this),
          hasSubForms: function (key) {
              return (form.children || []).filter(f => !key || f.descr === key).length > 0
          },
          getSubForms: function (key) {
              return (form.children || []).filter(f => !key || f.descr === key).map((subForm, idx) => {
                  const subDataProvider = this.getDataProvider(subForm, (rootPath.length ? rootPath + '.' : '') + key + '.' + idx)
                  if (!subForm.hasBeenInitialized) {
                      subForm.hasBeenInitialized = true
                      this.api.form().modifyForm(subForm).then(f => subForm.rev = f.rev)

                      subDataProvider.computeFormulas(['OnCreate'])

                      subForm.template.layout.sections.forEach(s => s.formColumns
                              .forEach(c => c.formDataList
                                      .forEach(fdl => fdl.subForm === true && (fdl.editor.compulsoryFormGuids || [])
                                              .forEach(ftguid => subDataProvider.addSubForm(fdl.name, ftguid)))
                      ))
                  }

                  return self.subFormsMap[[subForm.id, subForm.descr, idx]] || ((self.subFormsMap[[subForm.id, key, idx]] = {
                      dataMap: _.fromPairs(_.flatten(_.flatten(subForm.template.layout.sections.map(s => s.formColumns)).map(c => c.formDataList)).map(f => [f.name, 1])),
                      dataProvider: subDataProvider,
                      template: subForm.template.layout,
                      reportsPromises: Promise.all((this.form && this.form.template && this.form.template.reports || [])
                          .concat(_.compact(this.form.template.layout.sections.flatMap(s => s.formColumns.flatMap(c => c.formDataList.map(fdl => fdl.type === 'TKAction' && null || null)))))
                          .map(dt => this.api.doctemplate().getDocumentTemplate(dt)))
                  }));
              });
          }.bind(this),
          editForm: function () {
              this.dispatchEvent(new CustomEvent('edit-form', {detail: form, composed: true}));
          }.bind(this),
          deleteForm: function () {
              if (!this.currentContact) {
                  return;
              }

              const id = form.id;
              const subContacts = this.currentContact.subContacts.filter(sc => sc.formId === id);
              _.pullAll(this.currentContact.subContacts, subContacts);

              //Get all services in the formId
              this.servicesInForm(id).forEach(sl => {
                  if (sl.length >= 1 && sl[0].ctc === this.currentContact) {
                      sl[0].svc.content = {};
                      sl[0].svc.endOfLife = +new Date() * 1000;
                  } else {
                      ;(this.currentContact.services || (this.currentContact.services = [])).push(self.dispatchService(_.extend(_.cloneDeep(sl[0].svc), {
                          content: {},
                          endOfLife: +new Date() * 1000
                      })));
                  }
              });

              if( form.formTemplateId ) {
                  this.api.form().modifyForm(_.extend(form, {deletionDate: +new Date() * 1000})).then(f => {
                      this.dispatchEvent(new CustomEvent('form-deleted', {detail: f, composed: true}));
                      this.flushSave()
                  });
              }

          }.bind(this),
          getId: () => form.id,
          deleteSubForm: (key, id) => {
              if (!this.currentContact) {
                  return;
              }
              this.flushSave();

              const ff = form.children.find(a => a.id === id);

              _.pull(form.children, ff);
              const subContacts = this.currentContact.subContacts.filter(sc => sc.formId === id);
              _.pullAll(this.currentContact.subContacts, subContacts);

              //Get all services in the formId
              this.servicesInForm(id).forEach(sl => {
                  if (sl.length >= 1 && sl[0].ctc === this.currentContact) {
                      //sl[0].svc.content = {};
                      sl[0].svc.endOfLife = +new Date() * 1000;
                  } else {
                      ;(this.currentContact.services || (this.currentContact.services = [])).push(self.dispatchService(_.extend(_.cloneDeep(sl[0].svc), {
                          content: {},
                          endOfLife: +new Date() * 1000
                      })));
                  }
              });

              this.api.form().modifyForm(_.extend(ff, {deletionDate: +new Date() * 1000})).then(f => {
                  this.root.querySelector('#dynamic-form').notify((rootPath.length ? rootPath + '.' : '') + key + '.*');
                  this.scanServicesAndScheduleSave(this.currentContact);
              });
          },
          addSubForm: (key, guid) => {
              if (!this.currentContact) {
                  return;
              }
              this.flushSave();
              this.api.hcparty().getCurrentHealthcareParty().then(hcp => this.api.form().getFormTemplatesByGuid(guid, hcp.specialityCodes && hcp.specialityCodes[0] && hcp.specialityCodes[0].code || 'deptgeneralpractice')).then(formTemplates => {
                  if (formTemplates[0] && formTemplates[0]) {
                      //Create a new form and link it to the currentContact
                      this.api.form().newInstance(this.user, this.patient, {
                          contactId: this.currentContact.id,
                          descr: key,
                          formTemplateId: formTemplates[0].id,
                          parent: form.id
                      }).then(f => this.api.form().createForm(f)).then(f => {
                          f.template = formTemplates[0]
                          ;(form.children || (form.children = [])).push(f);
                          this.currentContact.subContacts.push({formId: f.id, descr: key, services: []});
                          this.root.querySelector('#dynamic-form').notify((rootPath.length ? rootPath + '.' : '') + key + '.*');

                          this.scanServicesAndScheduleSave(this.currentContact);
                      });
                  }
              });
          },
					radioButtonChecked: (group,checkedName) =>{
              form = form || this.form
              const layoutItems = _.flatten(_.flatten(form.template.layout.sections.map(s => s.formColumns)).map(c => c.formDataList))
              layoutItems.filter(item =>item.editor && item.editor.key==="CheckBoxEditor" && item.editor.groupRadio && item.editor.groupRadio===group && item.name!==checkedName).map(box =>  self.setBooleanValue(box.name,false,false))
					},
          filter: (data, text, deduplicationUuid, id) => {
              if (data.source !== "codes") { return id ? Promise.resolve({}) : Promise.resolve([]) }

              if (id) {
                  return this.api.code().getCode(id).then(res => {
                      return {
                          'id': res.id,
                          'name': res.label[this.language],
                          'authentic' : true
                      };
                  })
              }

              const uuids = (self.uuids || (self.uuids = {}))
              const reqIdx = uuids[deduplicationUuid] = (uuids[deduplicationUuid] || 0) + 1

              const words = text && text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(/\s+/);

              return !(data.types.length && words && words.length) ? Promise.resolve([]) : Promise.all(data.types.map(ct => {
                  const typeLng = this.api.code().languageForType(ct.type, this.language);
                  const sorter = x => [x.stringValue && x.stringValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").startsWith(words[0]) ? 0 : 1, x.stringValue]
                  return this.api.code().filterBy(null, null, 1000, null, null, null, {filter: {'$type':'IntersectionFilter', 'filters':words.map(w => ({
                          '$type': 'CodeByRegionTypeLabelLanguageFilter',
                          'region': 'be',
                          'type': ct.type,
                          'language': typeLng,
                          'label':w
                      }))}})
                  .then(results => {
                      if (reqIdx<uuids[deduplicationUuid]) { return [] }

                      return _.sortBy(results.rows.filter(c => c.label[typeLng] && words.every(w => c.label[typeLng].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(w))).map(code => ({
                          codeId: code.id,
                          stringValue: code.label[typeLng],
                          codes: [code].concat(code.links && code.links.map(c => ({
                              id: c,
                              type: c.split('|')[0],
                              code: c.split('|')[1],
                              version: c.split('|')[2]
                          })) || []),
                          id: code.id,
                          name: code.label[typeLng],
                          authentic : true
                      })), sorter)
                  });

              })).then(responses => (reqIdx<uuids[deduplicationUuid]) ? null : _.chain(responses).flatMap().uniqBy("codeId").value() )
          }
      };
      return self;
  }

  _formIdChanged(formId) {
      if (!formId) {
          return;
      }

      const loadForms = function (templates, forms, root) {
          const newFormTemplateIds = forms.map(f => f.formTemplateId).filter(id => id && !templates[id]);
          return Promise.all([
              Promise.all(newFormTemplateIds.map(id => this.api.form().getFormTemplate(id))),
              Promise.all(forms.map(f => this.api.form().getChildren(f.id, this.user.healthcarePartyId)))
          ]).then(res => {
              const [fts, children] = res
              fts.forEach(ft => {
                  templates[ft.id] = ft
              });
              forms.forEach(f => f.template = f.formTemplateId ? templates[f.formTemplateId] : {layout: null, name: "Dynamic"})
              children.forEach((cs, idx) => {
                  forms[idx].children = cs;
                  cs.forEach(c => forms[c.id] = cs);
              });
              return children.length ? loadForms(templates, _.flatten(children), root) : root;
          });
      }.bind(this);
      this.api.form().getForm(formId).then(f => loadForms(this.api.cachedTemplates || (this.api.cachedTemplate = {}), [f], f)).then(form => this.set('form', form));
  }

  deleteForm() {
      this.dataProvider.deleteForm && this.dataProvider.deleteForm();
  }

  linkAllServicesInForm(he) {
      _.compact(this.dataProvider.servicesInHierarchy().map(svcLine => svcLine[0])) //Latest version of all services
          .forEach(svc => {
              this.promoteServiceInCurrentContact(svc.svc, this.form.id, null, [he.id], null);
          });
      this.scanServicesAndScheduleSave(this.currentContact);
  }

  //Returns an array of arrays of svcStructs (a svcStruct is a map with the ctc, the svc and the subContacts this svc belongs to). All svcStructs in the second array share the same svc id
  servicesInForm(formId, label) {
      const svcStructs = (label ? this.servicesMap[label] : _.flatten(Object.values(this.servicesMap))) || [];
      return _.sortBy(_.uniqBy(svcStructs.filter(ss => (ss.scs || []).find(sc => sc.formId === formId) || (!formId && (!ss.scs || !ss.scs.some(ssc => ssc.formId) && ss.ctc && ss.ctc.id === this.contact.id))) //Extract all services which appear at some point in that form
              .map(ss => ss.svc.id)) //Get their ids
              .map(id => _.sortBy(svcStructs.filter(ss => ss.svc.id === id), ss => -ss.svc.modified)) //Sort them by modified for each id
              .filter(svcHistory => svcHistory.length) //Keep the ones with a history
          , svcs => -svcs[0].svc.modified); //Sort the lines of services by modification date
  }

  services(ctc, label) {
      return this.api && this.api.contact().services(ctc, label) || [];
  }

  createService(label, formId, poaId, heId, serviceId, init) {
      if (!this.currentContact) {
          return null;
      }
      const svc = this.api.contact().service().newInstance(this.user, serviceId ? {id: serviceId, label: label} : {label: label})
      ;(this.currentContact.services || (this.currentContact.services = [])).push(svc);

      let sc = this.currentContact.subContacts.find(sc => sc.formId === formId);
      if (!sc) {
          this.currentContact.subContacts.push(sc = {formId: formId, planOfActionId: poaId, healthElementId: heId, services: []});
      }

      const csc = this.currentContact.subContacts.find(csc => csc.services.indexOf(svc.id) >= 0);
      if (csc) {
          if (csc !== sc) {
              csc.splice(csc.services.indexOf(svc.id), 1);
              sc.services.push({serviceId: svc.id});
          }
      } else {
          sc.services.push({serviceId: svc.id});
      }
      return init && init(svc) || svc;
  }

  promoteServiceToHealthElement(heSvc) {
      return this.api.helement().serviceToHealthElement(this.user, this.patient, heSvc.svc,
          this.api.contact().shortServiceDescription(heSvc.svc, language)).then(he => {
          this.promoteServiceInCurrentContact(heSvc.svc, this.form.id, null, [he.id], null);
          this.scanServicesAndScheduleSave(this.currentContact);
          this.dispatchEvent(new CustomEvent('health-elements-change', {detail: {hes: [he]}, bubbles: true, composed: true}));

          return he;
      });
  }

  promoteServiceInCurrentContact(svc, formId, poaIds, heIds, init) {
      return this.api.contact().promoteServiceInContact(this.currentContact, this.user, this._allContacts(), svc, formId, poaIds, heIds, init);
  }

  shortServiceDescription(svc, lng) {
      let rawDesc = this.api && this.api.contact().shortServiceDescription(svc, lng);
      return rawDesc && '' + rawDesc || '';
  }

  contentHasData(c) {
      return this.api && this.api.contact().contentHasData(c) || false;
  }

  _localize(e, lng) {
      return this.api && this.api.contact().localize(e, lng) || "";
  }

  localizedContent(svc, lng) {
      return this.api && svc && this.api.contact().preferredContent(svc, lng) || {};
  }

  _subContactTypeChange(e){
      if(e.detail){

          const scs = this.currentContact.subContacts.find(sc => sc.formId === e.detail.formId)

					if(scs && scs.tags && scs.tags.find(t => t.type === "BE-CONTACT-TYPE")){
              scs.tags.splice(scs.tags.indexOf(scs.tags.find(t => t.type === "BE-CONTACT-TYPE")), 1);
              scs.tags.push(e.detail.type.type);
					}else{
              scs.tags = scs.tags || []
              scs && scs.tags.push(e.detail.type.type);
					}

          this.scanServicesAndScheduleSave(this.currentContact);

          this.shadowRoot.querySelector("#dynamic-form").set('showTitle', this.shadowRoot.querySelector("#dynamic-form").showTitle + 1)
/*
          if(this.currentContact.tags.find(t => t.type === "BE-CONTACT-TYPE")){
              this.currentContact.tags.splice(this.currentContact.tags.indexOf(this.currentContact.tags.find(t => t.type === "BE-CONTACT-TYPE")), 1);
              this.currentContact.tags.push(e.detail.type.type);
					}else{
              this.currentContact.tags.push(e.detail.type.type);
					}
          this.scanServicesAndScheduleSave(this.currentContact);
          */
      }
  }

  currentContactChanged(){
      this.set('incapacityFirstResearch',true);
      this.set('incapacityReasonFirstResearch',true);
  }

  _getFormParent(dataProvider,formId){
      if(dataProvider.getId()===formId){
          return dataProvider;
      }
      else if(dataProvider.hasSubForms()){
					const table = _.compact(dataProvider.getSubForms().map(child => this._getFormParent(child.dataProvider,formId)));
          return table.length ? _.first(table) : false;
      }else{
          return false;
      }
  }
}

customElements.define(DynamicallyLoadedForm.is, DynamicallyLoadedForm);
