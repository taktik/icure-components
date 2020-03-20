import '../fhc-api/fhc-api.js';
import * as api from 'icc-api/dist/icc-api/iccApi'
import moment from 'moment'
import _ from 'lodash/lodash';

import {IccBedrugsXApi} from 'icc-api/dist/icc-x-api/icc-bedrugs-x-api'
import {IccBekmehrXApi} from 'icc-api/dist/icc-x-api/icc-bekmehr-x-api'
import {IccCodeXApi} from 'icc-api/dist/icc-x-api/icc-code-x-api'
import {IccContactXApi} from 'icc-api/dist/icc-x-api/icc-contact-x-api'
import {IccCryptoXApi} from 'icc-api/dist/icc-x-api/icc-crypto-x-api'
import {IccDocumentXApi} from 'icc-api/dist/icc-x-api/icc-document-x-api'
import {IccFormXApi} from 'icc-api/dist/icc-x-api/icc-form-x-api'
import {IccHcpartyXApi} from 'icc-api/dist/icc-x-api/icc-hcparty-x-api'
import {IccHelementXApi} from 'icc-api/dist/icc-x-api/icc-helement-x-api'
import {IccPatientXApi} from 'icc-api/dist/icc-x-api/icc-patient-x-api'
import {IccReceiptXApi} from 'icc-api/dist/icc-x-api/icc-receipt-x-api'
import {IccAccesslogXApi} from 'icc-api/dist/icc-x-api/icc-accesslog-x-api'
import {IccUserXApi} from 'icc-api/dist/icc-x-api/icc-user-x-api'
import {IccInvoiceXApi} from 'icc-api/dist/icc-x-api/icc-invoice-x-api'
import {IccMessageXApi} from 'icc-api/dist/icc-x-api/icc-message-x-api'
import {IccClassificationXApi} from 'icc-api/dist/icc-x-api/icc-classification-x-api'

import {PolymerElement, html} from '@polymer/polymer';
class IccApi extends PolymerElement {
  static get template() {
    return html`
        <fhc-api id="fhc-api" host="[[fhcHost]]"></fhc-api>
`;
  }

  static get is() {
      return 'icc-api'
  }

  static get properties() {
      return {
          headers: {
              type: Object,
              value: {"Content-Type": "application/json", "Authorization": "Basic: ZGU5ODcyYjUtNWNiMC00ODQ2LThjNGMtOThhMjFhYmViNWUzOlQwcEB6RmhjWnRm"},
              notify: true
          },
          headers30s: {
              type: Object,
              value: {"Content-Type": "application/json", "X-CLIENT-SIDE-TIMEOUT":"30000", "Authorization": "Basic: ZGU5ODcyYjUtNWNiMC00ODQ2LThjNGMtOThhMjFhYmViNWUzOlQwcEB6RmhjWnRm"},
              notify: true
          },
          headers60s: {
              type: Object,
              value: {"Content-Type": "application/json", "X-CLIENT-SIDE-TIMEOUT":"60000", "Authorization": "Basic: ZGU5ODcyYjUtNWNiMC00ODQ2LThjNGMtOThhMjFhYmViNWUzOlQwcEB6RmhjWnRm"},
              notify: true
          },
          headers120s: {
              type: Object,
              value: {"Content-Type": "application/json", "X-CLIENT-SIDE-TIMEOUT":"120000", "Authorization": "Basic: ZGU5ODcyYjUtNWNiMC00ODQ2LThjNGMtOThhMjFhYmViNWUzOlQwcEB6RmhjWnRm"},
              notify: true
          },
          host: {
              type: String
          },
          fhcHost: {
              type: String
          },
          baseApi: {
              type: Object,
              notify: true
          },
          hcpartyApi: {
              type: Object
          },
          hcParties: {
              type: Object,
              value: function () {
                  return {}
              }
          },
          users: {
              type: Object,
              value: function () {
                  return {}
              }
          },
          registry: {
              type: Object,
              value: function () {
                  return {}
              }
          },
          sessionId: {
              type: String
          },
          mainLog:{
              type: Object,
              value : {}
          },
          promiseAccessLog:{
              type : Object,
              value : {}
          },
          preventLogging:{
              type : Boolean,
              value: false
          },
          _chargedPatients:{
              type: Array,
              value:[]
          },
          tmpLogging:{
              type:Boolean,
              value:false
          },
          electronHost: {
              type: String,
              value: "http://127.0.0.1:16042"
          }
      }
  }

  static get observers() {
      return ["refresh(headers, headers.*, host, fhcHost)"]
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
      if (this.host != null && this.headers != null) this.refresh()
  }

  refresh() {
      Object.assign(this.headers30s, this.headers)
      Object.assign(this.headers60s, this.headers)
      Object.assign(this.headers120s, this.headers)

      this.authicc = new api.iccAuthApi(this.host, this.headers)
      this.bemikronoicc = new api.iccBeMikronoApi(this.host, this.headers)
      this.onlineBeMikronoicc = new api.iccBeMikronoApi(this.host && this.host.match(/https:\/\/backend.(.+).icure.cloud.+/) ? this.host : "https://backend.svc.icure.cloud/rest/v1", this.headers)
      this.beresultexporticc = new api.iccBeResultExportApi(this.host, this.headers)
      this.beresultimporticc = new api.iccBeResultImportApi(this.host, this.headers)
      this.doctemplateicc = new api.iccDoctemplateApi(this.host, this.headers)
      this.entitytemplateicc = new api.iccEntitytemplateApi(this.host, this.headers)
      this.genericicc = new api.iccGenericApi(this.host, this.headers)
      this.icureicc = new api.iccIcureApi(this.host, this.headers)
      this.insuranceicc = new api.iccInsuranceApi(this.host, this.headers)
      this.replicationicc = new api.iccReplicationApi(this.host, this.headers)
      this.tarificationicc = new api.iccTarificationApi(this.host, this.headers)
      this.entityreficc = new api.iccEntityrefApi(this.host, this.headers30s)

      this.calendaritemicc = new api.iccCalendarItemApi(this.host, this.headers)
      this.calendaritemtypeicc = new api.iccCalendarItemTypeApi(this.host, this.headers)
      this.besamv2icc = new api.iccBeSamv2Api(this.host, this.headers)

      this.usericc = new IccUserXApi(this.host, this.headers)

      this.codeicc = new IccCodeXApi(this.host, this.headers)
      this.bedrugsicc = new IccBedrugsXApi(this.host, this.headers)

      this.hcpartyiccLight = new api.iccHcpartyApi(this.host, this.headers)
      this.hcpartyicc = new IccHcpartyXApi(this.host, this.headers)

      this.patienticcLight = new api.iccPatientApi(this.host, this.headers)
      this.cryptoicc = new IccCryptoXApi(this.host, this.headers, this.hcpartyiccLight, this.patienticcLight)

      this.classificationicc = new IccClassificationXApi(this.host, this.headers, this.cryptoicc)

      this.receipticc = new IccReceiptXApi(this.host, this.headers, this.cryptoicc)
      this.contacticc = new IccContactXApi(this.host, this.headers, this.cryptoicc)
      this.documenticc = new IccDocumentXApi(this.host, this.headers, this.cryptoicc, this.authicc)
      this.formicc = new IccFormXApi(this.host, this.headers, this.cryptoicc)
      this.helementicc = new IccHelementXApi(this.host, this.headers, this.cryptoicc)
      this.invoiceicc = new IccInvoiceXApi(this.host, this.headers30s, this.cryptoicc, this.entityreficc)
      this.patienticc = new IccPatientXApi(this.host, this.headers, this.cryptoicc, this.contacticc, this.formicc, this.helementicc, this.invoiceicc, this.documenticc, this.hcpartyicc, this.classificationicc)
      this.messageicc = new IccMessageXApi(this.host, this.headers120s, this.cryptoicc, this.insuranceicc, this.entityreficc, this.invoiceicc, this.documenticc, this.receipticc, this.patienticc)
      this.bekmehricc = new IccBekmehrXApi(this.host, this.headers, this.authicc,this.contacticc, this.helementicc)
      this.accesslogicc = new IccAccesslogXApi(this.host, this.headers, this.cryptoicc)

            this.medexicc = new api.iccMedexApi(this.host, this.headers)


      const toObserve = [
          [this.accesslogicc,["newInstance"]],
          [this.patienticc,["modifyPatientWithUser","createPatientWithUser","getPatientsWithUser","mergeIntoWithUser","modifyPatientReferralWithUser","getPatientWithUser"]],
          [this.contacticc,["modifyContactWithUser","getContactWithUser","getContactsWithUser","modifyContactsWithUser","createContactWithUser"]],
          [this.helementicc,["serviceToHealthElement"]],
          [this.invoiceicc,["deleteInvoice","getInvoice","getInvoices","mergeTo","modifyInvoice","createInvoice"]],
          [this.documenticc,["createDocument","deleteAttachment","deleteDocument","getAttachment","getDocument","getDocuments","modifyDocument","modifyDocuments","setAttachment","setAttachmentMulti"]],
          [this.messageicc,["createMessage","deleteMessages","deleteMessagesBatch","getChildren","getChildrenOfList","getMessage","modifyMessage","setMessagesReadStatus"]],
      ];
      this._Spy(toObserve);
      this.dispatchEvent(new CustomEvent('refresh', {detail: {}}))
  }

  accesslog() {
      return this.accesslogicc
  }

  entityRef(){
      return this.entityreficc
  }

  auth() {
      return this.authicc
  }

  beab() {
      return this.beabicc
  }

  bechapter() {
      return this.bechaptericc
  }

  bedmg() {
      return this.bedmgicc
  }

  bedrugs() {
      return this.bedrugsicc
  }

  beefact() {
      return this.beefacticc
  }

  beehbox() {
      return this.beehboxicc
  }

  beeid() {
      return this.beeidicc
  }

  beetarif() {
      return this.beetarificc
  }

  begenins() {
      return this.begeninsicc
  }

  behubs() {
      return this.behubsicc
  }

  bekmehr() {
      return this.bekmehricc
  }

  bemikrono() {
      return this.bemikronoicc
  }

  onlinebemikrono(){
      return this.onlineBeMikronoicc
  }

  beprimoto() {
      return this.beprimotoicc
  }

  berecipe() {
      return this.berecipeicc
  }

  beresultexport() {
      return this.beresultexporticc
  }

  beresultimport() {
      return this.beresultimporticc
  }

  besamv2() {
      return this.besamv2icc
  }

  bests() {
      return this.bestsicc
  }

  betherlink() {
      return this.betherlinkicc
  }

  bevitalink() {
      return this.bevitalinkicc
  }

  code() {
      return this.codeicc
  }

  contact() {
      return this.contacticc
  }

  doctemplate() {
      return this.doctemplateicc
  }

  document() {
      return this.documenticc
  }

  entitytemplate() {
      return this.entitytemplateicc
  }

  form() {
      return this.formicc
  }

  generic() {
      return this.genericicc
  }

  hcparty() {
      return this.hcpartyicc
  }

  hcpartyLight() {
      return this.hcpartyiccLight
  }

  helement() {
      return this.helementicc
  }

  icure() {
      return this.icureicc
  }

  insurance() {
      return this.insuranceicc
  }

  invoice() {
      return this.invoiceicc
  }

  message() {
      return this.messageicc
  }

  patient() {
      return this.patienticc
  }

  replication() {
      return this.replicationicc
  }

  receipt() {
      return this.receipticc
  }

  tarification() {
      return this.tarificationicc
  }

  user() {
      return this.usericc
  }

  crypto() {
      return this.cryptoicc
  }

  fhc() {
      return this.$['fhc-api'];
  }

  calendaritem(){
      return this.calendaritemicc
  }

  medex(){
      return this.medexicc
  }

  calendaritemtype(){
      return this.calendaritemtypeicc
  }

  authorizationHeader() {
      return this.headers.Authorization
  }

  localize(e, lng) {
      if (!e) {
          return null;
      }
      return e[lng] || e.fr || e.en || e.nl;
  }

  //Convenience methods for dates management
  after(d1, d2) {
      return d1 === null || d2 === null || d1 === undefined || d2 === undefined || this.moment(d1).isAfter(this.moment(d2));
  }

  before(d1, d2) {
      return d1 === null || d2 === null || d1 === undefined || d2 === undefined || this.moment(d1).isBefore(this.moment(d2));
  }

  moment(epochOrLongCalendar,extremity) {
      if (!epochOrLongCalendar && epochOrLongCalendar !== 0) {
          return null;
      }
      if (epochOrLongCalendar >= 18000101 && epochOrLongCalendar < 25400000) {
          const date= moment('' + (epochOrLongCalendar%100!==0 ? epochOrLongCalendar : epochOrLongCalendar%10000!==0 ? epochOrLongCalendar+1 : epochOrLongCalendar+101), 'YYYYMMDD')
          return extremity && extremity==="post" ? date.endOf(epochOrLongCalendar%100!==0 ? "day" : epochOrLongCalendar%10000!==0 ? "month" : "year")  : date
      } else if (epochOrLongCalendar >= 18000101000000) {
          let toAdd = 0 + (epochOrLongCalendar%10000000000<100000000 ? 100000000 : 0) + (epochOrLongCalendar%100000000<1000000 ? 1000000 : 0) + (epochOrLongCalendar%1000000<1000 ? 10000 : 0) + (epochOrLongCalendar%10000<100 ? 100 : 0) + (epochOrLongCalendar%100<1 ? 1 : 0);
          const date = moment('' + (epochOrLongCalendar+toAdd), 'YYYYMMDDHHmmss');
          return extremity && extremity==="post" ? date.endOf(epochOrLongCalendar%100000000!==0 ? "day" : epochOrLongCalendar%10000000000!==0 ? "month" : "year")  : date;
      } else {
          return moment(epochOrLongCalendar);
      }
  }

  formatedMoment(epochOrLongCalendar) {
      if(typeof epochOrLongCalendar === "String" && /$\d+^/.test(epochOrLongCalendar)){
          epochOrLongCalendar = parseInt(epochOrLongCalendar);
      }
      if (!epochOrLongCalendar && epochOrLongCalendar !== 0) {
          return null;
      }
      if (epochOrLongCalendar >= 18000101 && epochOrLongCalendar < 25400000) {
          if(epochOrLongCalendar%100!==0){
              return moment(''+epochOrLongCalendar, 'YYYYMMDD').format("DD/MM/YYYY");
          } else if(epochOrLongCalendar%10000!==0){
              return moment(''+(epochOrLongCalendar+1), 'YYYYMMDD').format("MM/YYYY");
          }else{
              return moment(''+(epochOrLongCalendar+101), 'YYYYMMDD').format("YYYY");
          }
      } else if (epochOrLongCalendar >= 18000101000000) {
          let toAdd = 0 + (epochOrLongCalendar%10000000000<100000000 ? 100000000 : 0) + (epochOrLongCalendar%100000000<1000000 ? 1000000 : 0) + (epochOrLongCalendar%1000000<1000 ? 10000 : 0) + (epochOrLongCalendar%10000<100 ? 100 : 0) + (epochOrLongCalendar%100<1 ? 1 : 0);
          return moment('' + (epochOrLongCalendar+toAdd), 'YYYYMMDDHHmmss').format((epochOrLongCalendar%100000000>=1000000?"DD/":"")+(epochOrLongCalendar%10000000000>=100000000?"MM/":"")+"YYYY"+(epochOrLongCalendar%1000000!==0 ?" HH:mm":""));
      } else {
          return moment(epochOrLongCalendar).format("DD/MM/YYYY");
      }
  }

  template(template, args) {
      const nargs = /\{([0-9a-zA-Z_ ]+)\}/g;
      return template.replace(nargs, function replaceArg(match, i, index) {
          var result;

          if (template[index - 1] === "{" && template[index + match.length] === "}") {
              //Double {{ }} means escape
              return i;
          } else {
              result = args.hasOwnProperty(i) ? args[i] : null;
              if (result === null || result === undefined) {
                  return "";
              }

              return result;
          }
      });
  }

  getCurrentAgeFromBirthDate(date, localizer) {

      if(!date) {
          return;
      }

      const birthDate = this.moment(date%100!==0 ? date : date%10000!==0 ? date+1 :date+101)
      const now = moment()
      let ageString = ""
      const age = moment.duration(now.diff(birthDate))

      const o = localizer('old','old')
      const ys = localizer('years', 'years')
      const y = localizer('year', 'year')
      const ms = localizer('months', 'months')
      const m = localizer('month', 'month')
      const ws = localizer('weeks', 'weeks')
      const w = localizer('week', 'week')
      const a = localizer('and', 'and')

      if(age.years() < 1) {
          if( (age.years() == 0) && (age.months() + (age.weeks() / 4) <= 1)) {
              return `${age.weeks()} ${age.weeks() == 1 ? w : ws} ${o}`
          }
          return `${age.months()} ${age.months() == 1 ? m : ms} ${a} ${age.weeks()} ${age.weeks() == 1 ? w : ws} ${o}`
      }else if (age.years() + (age.months() / 12) <= 16) {
          return `${age.years()} ${age.years() == 1 ? y : ys} ${a} ${age.months()} ${age.months() == 1 ? m : ms} ${o}`
      }
      return `${age.years()} ${age.years() == 1 ? y : ys} ${o}`

  }

  getAuthor(author) {
      const usr = this.users[author];
      const hcp = usr ? this.hcParties[usr.healthcarePartyId] : null;
      return hcp && hcp.lastName + " " + (hcp.firstName && hcp.firstName.length && hcp.firstName.substr(0, 1) + ".") || usr && usr.login || "N/A";
  }

  cacheRowsUsingPagination(key, paginator) {
      const cache = this.cache || ((this.cache = {}))
      const promise = cache[key]
      if (promise) { return promise }

      return (cache[key] = this.getRowsUsingPagination(paginator))
  }

  shortLivedCache(key, loader) {
      const cache = this.slCache || ((this.slCache = {}))
      const clean = () => { const now = +new Date(); Object.keys(cache).filter(k =>  cache[k].ttl < now ).forEach(k => delete cache[k]); console.log(`slc: ${cache.length} items`) }
      const wrapper = cache[key]
      if (wrapper) {
          this.cleaner && clearTimeout(this.cleaner)
          this.cleaner = setTimeout(() => clean(), 35000)
          wrapper.ttl = +new Date() + 30000
          return wrapper.promise
      }

      this.cleaner && clearTimeout(this.cleaner)
      this.cleaner = setTimeout(() => clean(), 35000)
      return (cache[key] = {ttl:+new Date() + 30000, promise:loader()}).promise
  }

  getRowsUsingPagination(paginator, filter, startIdx, endIdx, cache) {
      const executePaginator = (latestResult, acc, limit) =>
          paginator(latestResult.nextKey, latestResult.nextDocId, endIdx ? endIdx - startIdx : undefined).then((newResult) => {
              const rows = filter ? newResult.rows.filter(filter) : newResult.rows
              acc.push(...rows)
              return newResult.done || (limit && (acc.length >= limit)) ? ({rows: acc, nextKey: newResult.nextKey, nextDocId: newResult.nextDocId}) : executePaginator(newResult, acc, limit)
          })


      if (cache) {
          const [rows, lastKey, lastDocId, lastEndIdx, lastTreatedIdx] = cache.reduce(([rows, lastKey, lastDocId, lastEndIdx, lastTreatedIdx], chunk)  => {
              if (chunk.endIdx <= lastTreatedIdx) {
                  //               [--zoi--]
                  // [-chunk-]
                  //Doesn't look like anything to me
              } else if (chunk.startIdx >= endIdx) {
                  // [--zoi--]
                  //               [-chunk-]
                  if(lastTreatedIdx<endIdx){
                      rows.push({missing:[lastTreatedIdx, endIdx], lastEndIdx, lastKey, lastDocId})
                      lastTreatedIdx = endIdx
                  }
              } else {
                  if (chunk.startIdx <= lastTreatedIdx) {
                      if (chunk.endIdx <= endIdx) {
                          //       [--zoi--]
                          // [-chunk-]
                          rows.push({startIdx:lastTreatedIdx, rows:chunk.rows.slice(lastTreatedIdx - chunk.startIdx, chunk.endIdx - chunk.startIdx)})
                          lastTreatedIdx = chunk.endIdx
                      } else {
                          //       [--zoi--]
                          // [------chunk------]
                          rows.push({startIdx:lastTreatedIdx, rows:chunk.rows.slice(lastTreatedIdx - chunk.startIdx, endIdx - chunk.startIdx)})
                          lastTreatedIdx = endIdx
                      }
                  } else {
                      if (chunk.endIdx >= endIdx) {
                          //  [--zoi--]
                          //        [-chunk-]
                          rows.push({missing:[lastTreatedIdx, chunk.startIdx], lastEndIdx, lastKey, lastDocId})
                          rows.push({startIdx:chunk.startIdx, rows:chunk.rows.slice(0, endIdx - chunk.startIdx)})
                          lastTreatedIdx = endIdx
                      } else {
                          //  [-------zoi-------]
                          //        [-chunk-]
                          rows.push({missing:[lastTreatedIdx, chunk.startIdx], lastEndIdx, lastKey, lastDocId})
                          rows.push({startIdx:chunk.startIdx, rows:chunk.rows.slice(0, chunk.endIdx - chunk.startIdx)})
                          lastTreatedIdx = chunk.endIdx
                      }
                  }
              }
              return [rows, chunk.nextKey, chunk.nextDocId, chunk.endIdx, lastTreatedIdx]
          } , [[], null, null, 0, startIdx])


          if (!rows.length) {
              rows.push({missing:[startIdx,endIdx], lastKey: lastKey, lastDocId: lastDocId, lastEndIdx:lastEndIdx})
          } else {
              const lastRow = _.last(rows)
              if (lastRow.rows && lastRow.startIdx+lastRow.rows.length < endIdx) {
                  rows.push({missing:[lastRow.startIdx+lastRow.rows.length, endIdx], lastKey: lastKey, lastDocId: lastDocId, lastEndIdx:lastEndIdx})
              }
          }

          return Promise.all(rows.filter(r => r.missing).map(r => executePaginator({nextKey: r.lastKey, nextDocId: r.lastDocId}, [], r.missing[1] - r.lastEndIdx).then(({rows, nextKey, nextDocId}) => {
              r.rows = rows.slice(r.missing[0] - r.lastEndIdx, r.missing[1] - r.lastEndIdx)
              cache[r.lastEndIdx] = {rows, startIdx:r.missing[0], endIdx:r.missing[1], nextKey, nextDocId}
          }))).then(() => _.flatMap(rows, r => r.rows))
      } else {
          return executePaginator({nextKey: null, nextDocId: null}, []).then(({rows}) => rows)
      }
  }

  loadUsersAndHcParties() {
      return this.user().listUsers().then(users => {
          this.set('users', users.rows.reduce((acc, u) => {
              acc[u.id] = u
              return acc
          }, {}))
          return Promise.all(_.chunk(users.rows,100).map(uChunk => this.hcparty().getHealthcareParties(uChunk.map(u => u.healthcarePartyId).filter(id => !!id).join(','))))
      }).then(hcps => this.set('hcParties', _.flatMap(hcps).map(hcp => this.register(hcp, 'hcp')).reduce((acc, hcp) => {
              acc[hcp.id] = hcp
              return acc
          }, {}))
      ).catch(() => setTimeout(() => this.loadUsersAndHcParties(), 10000))
  }

  unregisterAll(domain) {
      this.registry[domain] = {listeners:{}, entities:{}, queues: {}}
  }

  getRegistry(domain) {
      return this.registry[domain] || (this.registry[domain] = {listeners: {}, entities: {}, queues: {}})
  }

  dedup(fn, domain, key, time) {
      const dedupCache = this.dedupCache || (this.dedupCache = {})
      const domainCache = (dedupCache[domain] || (dedupCache[domain] = {}))

      let promise = domainCache[key]

      if (!promise) {
          promise = fn()
          domainCache[key] = promise
          setTimeout(() => {delete domainCache[key]}, time)
      }

      return promise
  }

  /**
   * returns a Promise that will resolve when the current tail of the promise chain for this object resolves or that resolves immediately if the current chain is empty
   *
   * The promise resolves with two args in an array. The one that has been passed to the resolve and the next promise to resolve in order to make the queue advance
   *
   * @param entity
   * @param domain
   * @returns {*}
   */
  queue(entity, domain) {
      if (!entity || !entity.id) { return Promise.resolve([entity, undefined]) }
      const reg = this.getRegistry(domain)

      let res = null
      const defer = new Promise((resolve) => { res = resolve })
      defer.resolve = res

      const thisPromise = reg.queues[entity.id]
      const timeout =  thisPromise ? setTimeout(()=>{ thisPromise.resolve(entity) }, 10000) : null
      reg.queues[entity.id] = defer

      return (thisPromise || Promise.resolve(entity)).then(e =>{ timeout && clearTimeout(timeout); return [e, defer] })
  }

  register(entity, domain, defer, doNotOverride = false) {
      if (!entity || !entity.id) { defer && defer.resolve(entity); return entity }

      const reg = this.getRegistry(domain)
      let current = reg.entities[entity.id]
      if (current && (!current.rev || Number(current.rev.split('-')[0])) <= Number(entity.rev.split('-')[0])) {

          if( !doNotOverride || Number(current.rev.split('-')[0]) < Number(entity.rev.split('-')[0]) ){
              _.difference(_.keys(current), _.keys(entity)).forEach(k => delete current[k])
              _.assign(current, entity)

              Object.values(reg.listeners).forEach(l=>{
                  if (!l.pool || l.pool.some(x => x === entity.id)) {
                      l.paths && l.paths.forEach(path => l.target.notifyPath(path))
                      l.callbacks && l.callbacks.forEach(cb => cb())
                  }
              })
          }

      } else if (!current) {
          current = (reg.entities[entity.id] = entity)
      }

      defer && defer.resolve(current)

      return current
  }

  pdfReport(html, options = {}) {
      let electron = false
      return this.isElectronAvailable().then(elect => {
          electron = elect
          return this.user().getCurrentUser()
      }).then(user =>{
          const type = options.type
          const optionsString = _.toPairs(options).map(([k, v]) => `${k}=${v}`).join('&')
          if(!optionsString.length) option.type="doc-big-format"

          return (!electron || !type ? Promise.resolve(electron) : fetch(`${_.get(this,"electronHost","http://127.0.0.1:16042")}/getPrinterSetting`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json; charset=utf-8"
              },
              body: JSON.stringify({
                  userId: user.id
              })
          }))
              .then(response => response && response.status===200 ? response.json() : Promise.resolve({}))
              .then( data => {
                  const printersPrefs = electron && data && data.ok ? JSON.parse(data.data) : JSON.parse(localStorage.getItem('selectedPrinter') || '{}')
                  const stickersPrefs = electron && data && data.ok ? _.find(printersPrefs, pref => pref.type === "sticker-mut") || {} : _.get(printersPrefs,"stickers")
                  const typePreference = electron && data && options.type ? _.find(printersPrefs,pref => pref.type===options.type) || null : null
                  const paperSize = typePreference ?  typePreference.type==="sticker-mut" ? "stickers" : typePreference.format==="A4" ? "a4" : typePreference.format ==="A5" ? "a5" : typePreference.format==="DL/A5" ? "presc" : "a4"
                      :  options.paperWidth === 105 ? 'presc' : options.paperHeight === 210 ? 'a5' : (stickersPrefs && options.paperWidth === stickersPrefs.w && options.paperHeight === stickersPrefs.h) ? 'stickers' : 'a4'
                  const printerName = typePreference ? typePreference.printer : options.printer ? printersPrefs[options.printer] && printersPrefs[options.printer].bw || "" : (printersPrefs[paperSize] && (printersPrefs[paperSize].bw && printersPrefs[paperSize].bw.length ? printersPrefs[paperSize].bw : printersPrefs[paperSize].color && printersPrefs[paperSize].color.length ? printersPrefs[paperSize].color : null)) || null

                  //if(paperSize==="stickers"){
                  //    optionsString += "paperWidth=90&paperHeight=29"
                  //}

                  return (printerName ? Promise.resolve(printerName) : this.printers().then(printers => printers.find(p => p.isDefault)).then(p => p && p.name))
                      .then(printerName =>
                          fetch(`${electron && type && printerName ? _.get(this,"electronHost","http://127.0.0.1:16042") + '/print/' + encodeURIComponent(printerName) : 'https://report.icure.cloud/pdf'}${optionsString && optionsString.length ? `?${optionsString}` : ''}`, {
                              method: "POST",
                              mode: "cors", // no-cors, cors, *same-origin
                              credentials: "same-origin", // include, same-origin, *omit
                              headers: {"Content-Type": "text/html; charset=utf-8"},
                              redirect: "follow",
                              body: html,
                          }).then(response => response.arrayBuffer()).then(data => ({
                              pdf: data,
                              printed: electron && type && printerName
                          }))
                      )
              })

      })
  }

  printers() {
      return this.isElectronAvailable().then(electron =>
          electron && fetch(`${_.get(this,"electronHost","http://127.0.0.1:16042")}/printers`, { method: "GET" })
              .then(response => response.json()) || []
      )
  }

  loadBicData() {
      // Already existing, take no action
      if( typeof this.bicsData !== 'undefined' ) return;

      // Doesn't exist yet, require it
      this.bicsData = require('../bic/bics-list.json') || {};
  }

  getBicByIban( inputString ){
      // Get from json file -> casted in this.bicsData
      this.loadBicData();

      // Make sure we've got a string
      inputString = ( inputString || '' ) + '';

      // No Iban ?
      if(!inputString.length) return;

      // First four digits = country code | 3 digits for bic (starting at pos 4) | rest of iban
      var bicCodeToMatchOn = ( inputString.substr( 4, 3 ) );

      // Do we have a candidate ? (3 digits are to be between start & end values)
      var foundResult = _.filter( this.bicsData, o => parseInt( o.startValue ) <= parseInt( bicCodeToMatchOn ) && parseInt( o.endValue ) >= parseInt( bicCodeToMatchOn ) );

      // Up with results, if any
      return foundResult.length ? foundResult[0].bicCode : '';
  }

  logMcn(obj, user, docId, cat, subcat) {
      obj && obj.mycarenetConversation && this.receipticc.logSCReceipt(obj, user, docId, cat, subcat).catch(e => console.log(e))
      return obj
  }

  getUpdatedEdmgStatus( user, patient, requestDate, edmgNiss, edmgOA, genInsOA, genInsAFF, byPassCache=false ){
      if(!user||!patient) return Promise.resolve(null);

      // Everything that isn't today
      this.flushObsoleteEdmgStatusCache();

      const cachedEdmgRespStorageName = 'org.taktik.icure.edmgStatus.' + moment().format('YYYYMMDD') + '.' + user.healthcarePartyId + '.' + patient.ssin;

      // Try to get data from cache
      const cachedEdmgResp = localStorage.getItem( cachedEdmgRespStorageName ) || null;
      if( cachedEdmgResp && !byPassCache ) { return Promise.resolve(JSON.parse(cachedEdmgResp)); }

      if(((edmgNiss && edmgNiss !=='') || (patient.ssin && patient.ssin !== '')) && !(edmgOA && edmgOA !=='')){
          return this.hcparty().getHealthcareParty(user.healthcarePartyId)
              .then(hcp => {
                  return this.fhc().Dmgcontroller().consultDmgUsingGET(
                      this.keystoreId,
                      this.tokenId,
                      this.credentials.ehpassword,
                      hcp.nihii,
                      hcp.ssin,
                      hcp.firstName,
                      hcp.lastName,
                      edmgNiss ? edmgNiss.trim() : patient.ssin,
                      null,
                      null,
                      null,
                      requestDate
                  ).then( dmgConsult => this.logMcn(dmgConsult, user, patient.id, 'dmg', 'consult'))
              }).then(edmgResp => {
                  localStorage.setItem( cachedEdmgRespStorageName, JSON.stringify(edmgResp) );
                  return edmgResp||Promise.resolve(null);
              }).catch(() => { return Promise.resolve(null)});
      }else{
          //there is no niss
          const pi = patient.insurabilities && _.assign({}, patient.insurabilities[0] || {});
          this.insurance().getInsurance(pi.insuranceId).then(insu => {
              return this.hcparty().getHealthcareParty(user.healthcarePartyId)
                  .then(hcp => {
                          return this.fhc().Dmgcontroller().consultDmgUsingGET(
                              this.keystoreId,
                              this.tokenId,
                              this.credentials.ehpassword,
                              hcp.nihii,
                              hcp.ssin,
                              hcp.firstName,
                              hcp.lastName,
                              null,
                              null,
                              (genInsOA && genInsOA != '') ? genInsOA.trim() : insu.code,
                              (genInsAFF && genInsAFF != '') ? genInsAFF.trim() : pi.identificationNumber,
                              requestDate
                          ).then(dmgConsult => this.logMcn(dmgConsult, user, patient.id, 'dmg', 'consult'))
                      }
                  ).then(edmgResp => {
                      localStorage.setItem( cachedEdmgRespStorageName, JSON.stringify(edmgResp) );
                      return edmgResp||Promise.resolve(null);
                  }).catch(() => { return Promise.resolve(null)});
          }).catch(() => { return Promise.resolve(null)});
      }

  }

  flushObsoleteEdmgStatusCache() {

      // Target what's for us
      const patternToLookFor= 'org.taktik.icure.edmgStatus.';

      // Loop and drop old ones
      Object.keys(localStorage).filter(k => k.startsWith(patternToLookFor)).forEach(k => {
          // patternToLookFor . YYYYMMDD . userHcpId. patientSsin
          const [dateFormCache] = k.replace(patternToLookFor,'').split('.');

          // Drop if older than today
          if(moment(dateFormCache).isBefore(moment(), 'day')) { localStorage.removeItem(k) }
      });

  }

  triggerFileDownload(fileRawContent, mimeType, downloadFileName, appendTarget = false ) {

      if(!fileRawContent || !_.trim(mimeType) || !_.trim(downloadFileName) ) return;

      // let aObject = document.createElement("a");
      // let urlObject = window.URL.createObjectURL( new Blob([fileRawContent],{type :mimeType}) );
      //
      // (appendTarget?appendTarget:document.body).appendChild( aObject );
      //
      // aObject.style = "display: none";
      // aObject.href = urlObject;
      // aObject.download = downloadFileName;
      // aObject.click();
      // window.URL.revokeObjectURL(urlObject);

      const urlObject = window.URL.createObjectURL( new Blob([fileRawContent],{type :mimeType}) );
      try {
          const linkObject = _.merge(document.createElement("a"),{ style: "display: none", href: urlObject, download:downloadFileName });
          (appendTarget?appendTarget:document.body).appendChild( linkObject ) && linkObject.click() && window.URL.revokeObjectURL(urlObject);
      } catch(e) { window.open(_.trim(urlObject)) }

  }

  triggerUrlDownload(downloadUrl, appendTarget = false ) {
      if(!_.trim(downloadUrl)) return
      try {
          const linkObject = _.merge(document.createElement("a"),{ style: "display: none", href: downloadUrl })
          (appendTarget?appendTarget:document.body).appendChild( linkObject ) && linkObject.click() && window.URL.revokeObjectURL(downloadUrl);
      } catch(e) { window.open(_.trim(downloadUrl)) }
  }

  encryptDecryptFileContentByUserHcpIdAndDocumentObject( encryptOrDecryptMethod, user, documentObject, rawFileContent  ) {
      const edf = this.crypto().AES[_.trim(encryptOrDecryptMethod).toLocaleLowerCase()].bind(this.crypto().AES)
      if( !_.trim(encryptOrDecryptMethod) || !_.trim(user.healthcarePartyId) || !documentObject || !rawFileContent || typeof edf !== "function" ) return Promise.resolve(rawFileContent);

      return (documentObject.encryptionKeys && Object.keys(documentObject.encryptionKeys || {}).length ? Promise.resolve(documentObject) : this.document().initEncryptionKeys(user, documentObject))
          .then(doc => this.crypto().extractKeysFromDelegationsForHcpHierarchy(user.healthcarePartyId, doc.id, doc.encryptionKeys))
          .then((sfks) => this.crypto().AES.importKey("raw", this.crypto().utils.hex2ua(sfks.extractedKeys[0].replace(/-/g, ""))))
          .then((key) => edf(key, rawFileContent))
          .catch((e) =>
              this.crypto().decryptAndImportAesHcPartyKeysInDelegations(user.healthcarePartyId, documentObject.encryptionKeys && Object.keys(documentObject.encryptionKeys).length ? documentObject.encryptionKeys : documentObject.delegations)
                  .then(decryptedAndImportedAesHcPartyKeys => edf(_.get(_.head(decryptedAndImportedAesHcPartyKeys), "key", undefined), rawFileContent))
          )
  }

  findJsonObjectPathByPropNameAndPropValue( inputData, propName, propValue ) {
      this.variablesPath = []; this.propName = propName; this.propValue = propValue;
      this.browseObject(inputData);
      return this.variablesPath;
  }

  browseObject(inputData, sub="") {
      if (inputData && typeof inputData === "object") {
          if (Array.isArray(inputData)) { for (let i = 0; i < inputData.length; i++) { this.browseObject(inputData[i], sub + "[" + i + "]"); }
          } else {
              for (let p in inputData) {
                  if ((/^[a-z_$][a-z0-9_$]*$/i).test(p)) {
                      this.browseObject(inputData[p], sub + "." + p);
                      if(p===this.propName && inputData[p] === this.propValue ) { this.variablesPath.push(sub.substr(1)); }
                  } else {
                      this.browseObject(inputData[p], sub + "[\"" + p + "\"]");
                  }
              }
          }
      }
  }

  rewriteTableColumnsWidth(inputContent) {
      // Ratio between prose editor doc width and A4 pdf impression
      const ratioFactor = 1.39;
      // Col group has column width definitions, in relative pxs
      (inputContent.match(/<col style="([^"]*)">/gi)||[]).map(tagMatch=>{
          (tagMatch.match(/(width:)(\s*)([\d]*)(px)/gi)||[]).map(widthMatch=>{
              (widthMatch.match(/(\d*)/gi)||[]).map(widthValue=>{
                  if(parseInt(widthValue)) { inputContent = inputContent.replace( tagMatch, tagMatch.replace(widthMatch, widthMatch.replace(widthValue, Math.floor(widthValue*ratioFactor) ) ) ); }
              });
          });
      })
      return inputContent;
  }

  formatInamiNumber(inputContent) {
      // Split with hyphens (1,6,2,3) unless already has some or is empty
      return inputContent.indexOf("-")>-1 || !_.trim(inputContent) ? inputContent : _.trim([inputContent.slice(0,1),inputContent.slice(1,6),inputContent.slice(6,8),inputContent.slice(8,11)].join("-"));
  }

  formatBankAccount(inputContent) {
      return _.trim([inputContent.slice(0,4),inputContent.slice(4,8),inputContent.slice(8,12),inputContent.slice(12,16)].join(" "));
  }

  formatSsinNumber(inputContent) {
      if(!_.trim(inputContent)) return "";
      inputContent = _.trim(inputContent).replace(/[^0-9]+/g, '')
      return _.trim([inputContent.slice(0,2),inputContent.slice(2,4),inputContent.slice(4,6)].join(".")) + "-" + _.trim([inputContent.slice(6,9),inputContent.slice(9,11)].join("."));
  }

  isElectronAvailable() {
      return fetch('http://127.0.0.1:16042/ok', {
          method: "GET"
      })
          .then(() => true)
          .catch(() => false)
  }

  _powRoundFloatByPrecision(inputNumber,decimalPlaces=2){
      return parseFloat(Math.round(parseFloat( _.trim(inputNumber).replace(',','.') ) * Math.pow(10, decimalPlaces)) / Math.pow(10,decimalPlaces)).toFixed(decimalPlaces);
  }


  hrFormatNumber(inputNumber) {
      return parseFloat( _.trim(inputNumber).replace(',','.') ).toLocaleString("de-DE", {maximumFractionDigits:2, minimumFractionDigits:2})
  }

  getDocumentTypes(resources, language) {

      const exclusionList = [
          "medicaladvisoragreement",
          "bvt-sample",
          "clinicalpath",
          "ecare-safe-consultation",
          "ecare-tardis-consultation",
          "perinatal",
          "population-based-screening",
          "medicationschemeelement",
          "vaccinationschemeelement",
          "genericregistryentry",
          "ebirth-baby-medicalform",
          "ebirth-mother-medicalform",
          "intervention",
          "applicationlink",
          "ebirth-baby-notification",
          "ebirth-mother-notification",
          "child-prevention",
          "radiationexposuremonitoring",
          "treatmentsuspension",
          "telemonitoring"
      ]

      return this.code().findCodes("be", "CD-TRANSACTION")
          .then(foundCodes => _
              .chain(foundCodes)
              .filter(singleCode => exclusionList.indexOf(_.trim(_.get(singleCode,"code",""))) === -1)
              .map(singleCode => { const code = _.trim(_.get(singleCode,"code","")); return{code:code,name:_.upperFirst(_.trim(_.get(resources, language + ".cd-transaction-" + code, code)).toLowerCase())}})
              .orderBy(['name'],['asc'])
              .value()
          )
          .catch(()=>Promise.resolve())

  }

  _getUserConfirmationDialogAcknowledgements(currentUser=null) {

      return (!!_.size(currentUser) ? Promise.resolve(currentUser) : this.user().getCurrentUser())
          .then(user => {
              const confirmationDialogAcknowledgementsProperties = _.find(_.get(user,"properties",[]), p => _.trim(_.get(p,"type.identifier","")) === "org.taktik.icure.user.confirmationDialogAcknowledgements") || { type: { identifier: "org.taktik.icure.user.confirmationDialogAcknowledgements" }, typedValue: {type: "STRING", stringValue: "{}"} }
              return JSON.parse( _.trim(_.get(confirmationDialogAcknowledgementsProperties,"typedValue.stringValue","{}")))||{}
          })

  }

  _setUserConfirmationDialogAcknowledgements(currentUser=null, newProperties=null) {

      const dialogAcknowledgementsPropertyKeyName = "org.taktik.icure.user.confirmationDialogAcknowledgements"

      return !_.size(newProperties) ? Promise.resolve(currentUser) : (!!_.size(currentUser) ? Promise.resolve(currentUser) : this.user().getCurrentUser())
          .then(user => this._getUserConfirmationDialogAcknowledgements(user).then(acknowledgementProperties => ([user,acknowledgementProperties]) ))
          .then(([user,acknowledgementProperties]) => {
              const otherProperties = _.filter(_.get(user,"properties",[]), p => _.trim(_.get(p,"type.identifier","")) !== dialogAcknowledgementsPropertyKeyName)
              const acknowledgementUpdatedProperties = {type: {identifier: dialogAcknowledgementsPropertyKeyName}, typedValue: { type: "STRING", stringValue: JSON.stringify(_.merge(acknowledgementProperties,newProperties))}}
              return this.user().modifyUser(_.assign(user, {properties:_.concat(otherProperties, acknowledgementUpdatedProperties)})).then(u => this.register(u, "user"))
          })

  }

  _Spy(toObserve) {
     //j'utilise les objects car ca passe en pointeur!!!!
      /*
     let mainLog = {}
     let tmpLogging= {isDoing :false}
     let chargedPatients = {patients : []}

     const add = this._addNewCurrentLog.bind(this);
     const setMain = this._setMainLog.bind(this);

     toObserve.map(item =>{
         const obj = item[0]
         const methods = item[1]
         methods.map(method =>{
             let spy = {
                 object : obj,
                 args: [],
                 method : method
             };
             let original = obj[method];
             spy.original=original
             obj[method] = function() {
                 spy.args = [].slice.apply(arguments);
                 if(!this.preventLogging && !tmpLogging.isDoing){
                     if(spy.method!=="newInstance"){
                         add(spy,mainLog,tmpLogging,chargedPatients)
                     }
                     else {mainLog=setMain(spy)}
                 }
                 return original.apply(obj, spy.args)
             }.bind(this);
         })
     })
     */
  }

  _addNewCurrentLog(info,mainLog,tmpLogging,chargedPatients){
      this.user().getCurrentUser().then(user=>{
          let patients = this._getPatient(info,mainLog,chargedPatients)
          patients && patients.length && patients.map(pat => {
              if(!pat)return;
              const log ={}
              const chargedPatient = chargedPatients.patients.find(tmpPat=> tmpPat.id===pat) || false;
              tmpLogging.isDoing=true;
              (chargedPatient ? Promise.resolve(chargedPatient) :this.patienticc.getPatientWithUser(user,pat)).then(patient =>{
                  tmpLogging.isDoing=false;
                  if(!chargedPatients.patients.find(tmpPat => patient.id===tmpPat.id)){
                      chargedPatients.patients.push(patient)
                  }
                  tmpLogging.isDoing=true;
                  this.accesslogicc.newInstance(user,patient,log).then(newlog =>{
                      tmpLogging.isDoing=false;
                      newlog.detail=info.method
                      this.accesslogicc.createAccessLogWithUser(user,newlog)
                  })
              })
                  .catch(err=> tmpLogging.isDoing=false)
                  .finally(()=>{tmpLogging.isDoing=false})

          })
      })

  }

  _setMainLog(info){
      return {
          patientId : info.args[1].id,
          userId : info.args[0].id
      }
  }

  _getPatient(info,mainLog,chargedPatients){
      let patientIds = _.countBy(_.zip(this._getParamNames(info.original),info.args).map(([name,arg]) => {
          if(!arg)return false
          if(arg.constructor.name==="UserDto"){
              return false;
          }else if(arg.constructor.name==="PatientDto"){
              if(!chargedPatients.patients.find(pat => pat.id===arg.id)){
                  chargedPatients.patients.push(arg)
              }
              return arg.id;
          }else if(arg.constructor.name==="ListOfIdsDto"){
              return arg.ids.join(",");
          }else if(name.includes("user")){
              return false;
          }else if(name.includes("patient")){
              return arg;
          }else if(name.includes("toId")){
              return arg;
          }else if(name.includes("fromIds")){
              return arg;
          }else if(info.method.includes("getPatientsWithUser")){
              return arg.ids.join(",");
          }
          return false;
      }).filter(id => !!id));
      let patients = ""
      if(info.method==="mergeIntoWithUser"){
          patients = _.values(patientIds).join(",")
      }
      else{
          const biggest = _.last(_.sortBy(_.values(patientIds)))
          patients= _.findKey(patientIds,nb => nb===biggest)
      }

      if(!patients){
          patients = mainLog.patientId;
      }
      return !patients ? null : (patients.includes(",") ? patients.split(",") : [patients]);
  }

  _getParamNames(func) {
      const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      const ARGUMENT_NAMES = /([^\s,]+)/g;
      let fnStr = func.toString().replace(STRIP_COMMENTS, '');
      let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if(result === null)
          result = [];
      return result;
  }

  setPreventLogging(status=true){
      this.set("preventLogging",status)
  }

  _isValidMail(email){
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/.test(email))
  }
}

customElements.define(IccApi.is, IccApi)
