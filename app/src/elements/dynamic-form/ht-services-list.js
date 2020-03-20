import './ckmeans-grouping.js';
import './dynamic-form.js';
import '../../styles/buttons-style.js';
import '../../styles/icpc-styles.js';
import './dynamic-pills.js';



import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtServicesList extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="buttons-style icpc-styles dialog-style">

            .form-title-bar-btn {
                height: 20px;
                width: 20px;
                padding: 2px;
            }

            .horizontal vaadin-date-picker {
                height: 90px;
                padding-bottom: 0px;
                @apply --padding-right-left-16
            }

            .link .ICD-10 span {
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
            }

            paper-listbox {
                min-width: 200px;
            }

            paper-menu-button {
                padding: 0;
            }

            vaadin-grid {
                /*height: unset;*/
				max-height:calc(100% - 104px);
                margin: 8px 0;
				box-shadow: var(--app-shadow-elevation-1);
				border: none;
                border-radius: 3px;
                overflow-y: auto;
                flex-grow: 1;
                margin-bottom: 46px;
			}

            span.outofrange-true {
                color: var(--app-status-color-nok);
            }

            .textContainer {
                margin:0 32px;
                box-shadow: var(--app-shadow-elevation-1);
            }

            .textContainer.fullWidth {
                margin:8px 0 0 0;
            }

            .margin032 {
                margin:0 32px!important;
            }

            .margin032.fullWidth {
                margin:8px 0 0 0!important;
            }

            .textContainer pre {
                font-family: var(--paper-font-common-base_-_font-family);
                -webkit-font-smoothing: var(--paper-font-common-base_-_-webkit-font-smoothing);
                font-size: 13px;
                line-height: 1.6em;
                max-height: none;
                overflow-x: hidden;
                overflow-y: hidden;
                word-break:normal;
                white-space: pre-wrap;
                white-space: -moz-pre-wrap;
                white-space: -pre-wrap;
                white-space: -o-pre-wrap;
                word-wrap: break-word;
                padding:10px;
                margin:0;
                background: #fff;
            }

            .actionIcons {
                min-width: 1px;
            }

            .documentHeader {
                color: var(--app-primary-color);
                background: var(--app-background-color-dark);
                font-size: 12px;
                margin: 0;
                padding: 0 10px;
                display: flex;
                flex-flow: row nowrap;
                text-align: left;
                justify-content: space-between;
                align-items: center;
            }

            .documentHeader >div {
                flex-grow: 0;
                min-width: 20px;
            }

            .colour-code {
                font-size: 12px;
                white-space: nowrap;
            }

            .colour-code span {
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
            }

            paper-menu-button {
                padding:0;
            }

            paper-menu-button paper-listbox {
                padding:0!important;
            }

            paper-menu-button paper-listbox paper-item {
                padding:0 8px!important;
                font-size: var(--font-size-normal);
            }

        </style>



        <template is="dom-if" if="[[!_moreThan1Service(contacts,contacts.*)]]">

            <div class\$="textContainer [[additionalCssClasses]]">
                <template is="dom-repeat" items="[[_services(contacts,contacts.*)]]" as="item">

                    <template is="dom-if" if="[[_any(printable,forwardable,allowEsLink,allowEditLabelAndTransaction,allowDeletion)]]">
                        <div class="documentHeader">
                            <span></span>
                            <div>

                                <template is="dom-if" if="[[allowEsLink]]"><dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*)]]" on-unlink-to-health-element="_unlinkDoc"></dynamic-pills></template>

                                <template is="dom-if" if="[[_isContactLabResultOrProtocol(contacts)]]">
                                    <template is="dom-if" if="[[_documentId(contacts)]]">
                                        <paper-icon-button icon="file-download" on-tap="_triggerDownload" data-document-id\$="[[_documentId(contacts)]]" class="button--icon-btn" id="downloadFile-1"></paper-icon-button>
                                        <paper-tooltip for="downloadFile-1" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                                    </template>
                                    <template is="dom-if" if="[[printable]]">
                                        <paper-icon-button icon="print" on-tap="_printDocument" data-contact-id\$="[[_contactId(contacts)]]" class="button--icon-btn" id="printDocument"></paper-icon-button>
                                        <paper-tooltip for="printDocument" position="left">[[localize('pri','Print',language)]]</paper-tooltip>
                                    </template>
                                </template>

                                <template is="dom-if" if="[[forwardable]]">
                                    <template is="dom-if" if="[[_documentId(contacts)]]">
                                        <paper-icon-button on-tap="_forwardDocument" data-document-id\$="[[_documentId(contacts)]]" class="button--icon-btn" id="forwardDocument" icon="forward"></paper-icon-button>
                                        <paper-tooltip for="forwardDocument" position="left">[[localize('forwardDocumentToColleague','Forward document to a colleague',language)]]</paper-tooltip>
                                    </template>
                                </template>

                                <template is="dom-if" if="[[allowEsLink]]">
                                     <paper-tooltip position="left" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
                                     <paper-menu-button class="" horizontal-align="right" dynamic-align="true" vertical-offset="30">
                                         <paper-icon-button id="linkhe" class="button--icon-btn" icon="icons:link" slot="dropdown-trigger"></paper-icon-button>
                                         <paper-listbox slot="dropdown-content">
                                             <template is="dom-repeat" items="[[linkableHealthElements]]" as="he">
                                                 <template is="dom-if" if="[[he.id]]"><paper-item id="[[he.id]]" class$="link [[_isExcluded(he)]]" on-tap="_linkDoc"><label class$="colour-code [[he.colour]]"><span></span></label>[[he.descr]]</paper-item></template>
                                                 <!--<template is="dom-if" if="[[!he.id]]"><paper-item id="[[he.idService]]" class$="link [[he.colour]]" on-tap="_linkDoc"><label class="colour-code"><span></span></label>[[he.descr]]</paper-item></template>-->
                                             </template>
                                         </paper-listbox>
                                     </paper-menu-button>
                                </template>


                                <template is="dom-if" if="[[allowEditLabelAndTransaction]]">
                                    <paper-icon-button icon="create" on-tap="_editLabelAndTransaction" class="button--icon-btn" id="editLabelAndTransaction"></paper-icon-button>
                                    <paper-tooltip for="editLabelAndTransaction" position="left">[[localize('editLabelAndTransaction','Edit label and type',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowDeletion]]">
                                    <paper-icon-button icon="delete" on-tap="_deleteService" data-svc-ids$="[[item.id]]" class="button--icon-btn" id="deleteService"></paper-icon-button>
                                    <paper-tooltip for="deleteService" position="left">[[localize('del','Delete',language)]]</paper-tooltip>
                                </template>
                            </div>
                        </div>
                    </template>

                    <pre>[[_prettifyText(item)]]</pre>

                </template>
            </div>

        </template>



        <template is="dom-if" if="[[_moreThan1Service(contacts,contacts.*)]]">



            <template is="dom-if" if="[[!_moreThan1Contact(contacts,contacts.*)]]">
              <template is="dom-if" if="[[_any(printable,forwardable,allowEsLink,allowEditLabelAndTransaction,allowDeletion)]]">
                    <div class\$="documentHeader margin032 [[additionalCssClasses]]">
                        <span></span>
                        <div>
                            <template is="dom-if" if="[[_isContactLabResultOrProtocol(contacts)]]">

                                <template is="dom-if" if="[[allowEsLink]]"><dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*)]]" on-unlink-to-health-element="_unlinkDoc"></dynamic-pills></template>

                                <template is="dom-if" if="[[_documentId(contacts)]]">
                                    <paper-icon-button icon="file-download" on-tap="_triggerDownload" data-document-id\$="[[_documentId(contacts)]]" class="button--icon-btn" id="downloadFile-2"></paper-icon-button>
                                    <paper-tooltip for="downloadFile-2" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                                </template>
                                <template is="dom-if" if="[[printable]]">
                                    <paper-icon-button icon="print" on-tap="_printDocument" data-contact-id\$="[[_contactId(contacts)]]" class="button--icon-btn" id="printDocument"></paper-icon-button>
                                    <paper-tooltip for="printDocument" position="left">[[localize('pri','Print',language)]]</paper-tooltip>
                                </template>
                            </template>
                            <template is="dom-if" if="[[forwardable]]">
                                <template is="dom-if" if="[[_documentId(contacts)]]">
                                    <paper-icon-button on-tap="_forwardDocument" data-document-id\$="[[_documentId(contacts)]]" class="button--icon-btn" id="forwardDocument" icon="forward"></paper-icon-button>
                                    <paper-tooltip for="forwardDocument" position="left">[[localize('forwardDocumentToColleague','Forward document to a colleague',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowEsLink]]">
                                    <paper-tooltip position="left" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
                                    <paper-menu-button class="" horizontal-align="right" dynamic-align="true" vertical-offset="30">
                                        <paper-icon-button id="linkhe" class="button--icon-btn" icon="icons:link" slot="dropdown-trigger"></paper-icon-button>
                                        <paper-listbox slot="dropdown-content">
                                            <template is="dom-repeat" items="[[linkableHealthElements]]" as="he">
                                                <template is="dom-if" if="[[he.id]]"><paper-item id="[[he.id]]" class\$="link [[_isExcluded(he)]]" on-tap="_linkDoc"><label class\$="colour-code [[he.colour]]"><span></span></label>[[he.descr]]</paper-item></template>
                                                <!--<template is="dom-if" if="[[!he.id]]"><paper-item id="[[he.idService]]" class\$="link [[he.colour]]" on-tap="_linkDoc"><label class="colour-code"><span></span></label>[[he.descr]]</paper-item></template>-->
                                            </template>
                                        </paper-listbox>
                                    </paper-menu-button>
                                </template>

                                <template is="dom-if" if="[[allowEditLabelAndTransaction]]">
                                    <paper-icon-button icon="create" on-tap="_editLabelAndTransaction" class="button--icon-btn" id="editLabelAndTransaction"></paper-icon-button>
                                    <paper-tooltip for="editLabelAndTransaction" position="left">[[localize('editLabelAndTransaction','Edit label and type',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowDeletion]]">
                                    <paper-icon-button icon="delete" on-tap="_deleteService" class="button--icon-btn" id="deleteService"></paper-icon-button>
                                    <paper-tooltip for="deleteService" position="left">[[localize('del','Delete',language)]]</paper-tooltip>
                                </template>

                            </template>
                        </div>
                    </div>
                </template>
            </template>



            <vaadin-grid id="dynamic-list" size="10" multi-sort="[[multiSort]]" active-item="{{activeItem}}" items="[[_services(contacts,contacts.*)]]" on-tap="click" class\$="margin032 [[additionalCssClasses]]">
                    <vaadin-grid-column flex-grow="2" width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="label">[[localize('lab','Label',language)]]</vaadin-grid-sorter>
                        </template>
                        <template><span class\$="outofrange-[[_isOutOfRange(item)]]">[[item.label]]</span></template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <vaadin-grid-sorter path="modified">[[localize('dat','Date',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>[[_date(item)]]</template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="4">
                        <template class="header">
                            Value
                        </template>
                        <template><span class\$="outofrange-[[_isOutOfRange(item)]]">[[_shortDescription(item)]]</span></template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="4">
                        <template class="header">
                            Comment
                        </template>
                        <template><span class\$="outofrange-[[_isOutOfRange(item)]]">[[_comment(item)]]</span></template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="4">
                        <template class="header">
                            [[localize('nor_val','Normal values',language)]]
                        </template>
                        <template>[[_normalValues(item)]]</template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="2" width="80px">
                        <template class="header">
                            <vaadin-grid-sorter path="function{[[_author(item)]]}">[[localize('aut','Author',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>[[_author(item)]]</template>
                    </vaadin-grid-column>
                </vaadin-grid>



        </template>
`;
  }

  static get is() {
      return 'ht-services-list';
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          user: {
              type: Object
          },
          contact: {
              type: Object,
              value: null
          },
          contacts: {
              type: Array,
              value: []
          },
          activeItem: {
              type: Object
          },
          currentContact: {
              type: Object,
              value: null
          },
          lastColumnSort: {
              type: String,
              value: null
          },
          forwardable: {
              type: Boolean,
              value: false
          },
          printable: {
              type: Boolean,
              value: false
          },
          additionalCssClasses: {
              type: String,
              value: ""
          },
          _downloadUrl: {
              type: String,
              value: ""
          },
          allowEsLink: {
              type: Boolean,
              value: false
          },
          allowEditLabelAndTransaction: {
              type: Boolean,
              value: false
          },
          healthElements: {
              type: Array
          },
          linkableHealthElements: {
              type: Array
          },
          allowDeletion: {
              type: Boolean,
              value: false
          },
      };
  }

  constructor() {
      super();
  }

  ready() {
      super.ready()

      this._notifyResize()
  }

  _date(item) {
      return (item && item.modified) ? this.api.moment(item.modified).format(item.modified > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : '';
  }

  _author(item) {
      return this.api.getAuthor(item.author);
  }

  _isOutOfRange(svc) {
      const c = this.api.contact().preferredContent(svc, this.language)
      return (c && c.measureValue && (c.measureValue.value < c.measureValue.min || c.measureValue.value > c.measureValue.max ))
  }

  _normalValues(svc) {
      const c = this.api.contact().preferredContent(svc, this.language)
      return c && c.measureValue && `${c.measureValue.ref ? c.measureValue.ref.toFixed(2) : ''} ${c.measureValue.min || c.measureValue.max ? `${c.measureValue.min ? c.measureValue.min.toFixed(1) : '*'} - ${c.measureValue.max ? c.measureValue.max.toFixed(1) : '*'}` : ''}` || '';
  }

  _shortDescription(svc) {
      return this.api.contact().shortServiceDescription(svc, this.language);
  }

    _comment(svc){
      return svc.comment || ""
    }

  _notifyResize() {
      const grid = this.$['dynamic-list']
      if (grid) {
          grid.notifyResize()
      }
  }

  _moreThan1Contact(contacts) {
      return _.size(contacts) > 1
  }

  _prettifyText(input) {
      return _.trim(this._shortDescription(input)).replace(/\r\n|\n|\r/gm, "\n")
  }

  _contactId(input) {
      return _
          .chain(input)
          .filter(ctc => !!_.size(_.get(ctc,"services",[])))
          .orderBy(["modified"],["asc"])
          .head()
          .get("id","")
          .value()
  }

  _documentId(input) {
      return _
          .chain(input)
          .filter(ctc => !!_.size(_.get(ctc,"services",[])))
          .orderBy(["modified"],["asc"])
          .head()
          .get("tags",[])
          .find({type:"originalEhBoxDocumentId"})
          .get("id","")
          .trim()
          .value()

      // _.trim(_.get(_.find(_.get(input,"[0].tags",[]), {type:"originalEhBoxDocumentId"}), "id",""))

  }

  _ehBoxMessageId(input) {
      return _
          .chain(input)
          .filter(ctc => !!_.size(_.get(ctc,"services",[])))
          .orderBy(["modified"],["asc"])
          .head()
          .get("tags",[])
          .find({type:"originalEhBoxMessageId"})
          .get("id","")
          .trim()
          .value()
  }

  _forwardDocument(e) {
      const targetButton = _.find(_.get(e,"path",[]), nodePath=> _.trim(_.get(nodePath,"nodeName","")).toUpperCase() === "PAPER-ICON-BUTTON" )
      return !!targetButton ? this.dispatchEvent(new CustomEvent('forward-document', { composed: true, bubbles: true, detail: _.merge({source:_.trim(_.get(this,"nodeName","")).toLowerCase()},_.get(targetButton,"dataset",{})) })) : false;
  }

  _printDocument(e) {
      const targetButton = _.find(_.get(e,"path",[]), nodePath=> _.trim(_.get(nodePath,"nodeName","")).toUpperCase() === "PAPER-ICON-BUTTON" )
      return !!targetButton ? this.dispatchEvent(new CustomEvent('print-document', { composed: true, bubbles: true, detail: _.get(targetButton,"dataset",{}) })) : false;
  }

  _any(a,b,c,d,e) {
      return !!a||!!b||!!c||!!d||!!e
  }

  _triggerDownload(e) {

      const targetButton = _.find(_.get(e,"path",[]), nodePath=> _.trim(_.get(nodePath,"nodeName","")).toUpperCase() === "PAPER-ICON-BUTTON" )
      const documentId = _.trim(_.get(targetButton,"dataset.documentId",""))

      return !targetButton || !documentId ? false : this.api.document().getDocument(documentId)
          .then(document => !_.size(_.get(document,"encryptionKeys",[])) && !_.size(_.get(document,"delegations",[])) ?
              Promise.resolve([document,null]) :
              this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(_.trim(_.get(this,"user.healthcarePartyId","")), _.trim(_.get(document,"id","")), _.size(_.get(document,"encryptionKeys",[])) ? _.get(document,"encryptionKeys",[]) : _.get(document,"delegations",[]))
                  .then(({extractedKeys: enckeys}) => ([document,enckeys]))
                  .catch(()=>Promise.resolve([document,null]))
          )
          .then(([document,enckeys]) => !_.size(document) ? false : this.api.document().getAttachmentUrl(_.trim(_.get(document,"id","")), _.trim(_.get(document,"attachmentId","")), enckeys)).then(url => this.api.triggerUrlDownload(url))
          .catch(()=>false)

  }

  _isSubContactLabResultOrProtocol(sctc) {

      // 1<<0 = Lab Result ; 1<<5 = Protocol
      return !!((parseInt(_.get(sctc, "status", 0)) & (1 << 0)) || (parseInt(_.get(sctc, "status", 0)) & (1 << 5)))

  }

  _isContactLabResultOrProtocol(contacts) {

      // 1<<0 = Lab Result ; 1<<5 = Protocol
      return !!_.some(contacts, ctc => !!_.some(_.get(ctc,"subContacts",[]), sctc => this._isSubContactLabResultOrProtocol(sctc)))

  }

  _getServicesOutOfContact(ctc) {

      const isLabResultOrProtocol = !!_.some(_.get(ctc,"subContacts",[]), sctc => this._isSubContactLabResultOrProtocol(sctc))
      return !isLabResultOrProtocol ? ctc.services : _.size(ctc.services) !== 2 ? ctc.services : _.filter(ctc.services, svc => _.trim(_.get(svc, "label","")).toLowerCase() !== "labresult" && _.trim(_.get(svc, "label","")).toLowerCase() !== "report" )

  }

  _moreThan1Service(contacts) {

      // return _.size(_.flatMap(contacts, c => c.services)) > 1
      return _.size(_.flatMap(contacts, ctc => this._getServicesOutOfContact(ctc))) > 1

  }

  _services(contacts) {

      // return _.sortBy(_.flatMap(contacts, c => c.services), ['modified']);
      return _.sortBy(_.flatMap(contacts, ctc => this._getServicesOutOfContact(ctc)),['modified'])

  }

  _isExcluded(he){
      return _.get(he, 'tags', []).find(t => t.type === "CD-CERTAINTY" && t.code === "excluded") ? "exclude" : null
  }

  _linkDoc(e) {
      const he = this.healthElements.find(he => he.id === _.get(e,"target.id","") || he.idService === _.get(e,"target.id",""));
      this.dispatchEvent(new CustomEvent('link-doc', {detail: {healthElement: he, contact: _.get(this,"contacts[0]",{})}, composed: true, bubbles: true}));
  }

  _unlinkDoc(e) {
      const he = _.get(e,"detail.healthElement",{})
      this.dispatchEvent(new CustomEvent('unlink-doc', {detail: {healthElement: he, contact: _.get(this,"contacts[0]",{})}, composed: true, bubbles: true}));
  }

  _editLabelAndTransaction(e) {
      this.dispatchEvent(new CustomEvent('edit-label-and-transaction', {detail: {contact: _.get(this,"contacts[0]",{})}, composed: true, bubbles: true}));
  }

  _selectedHes() {

      if(!_.size(_.get(this,"contacts[0].services")) || !_.size(_.get(this,"contacts[0].subContacts")) || !_.size(_.get(this,"healthElements",[]))) return [];

      const sourceSubContact = _.find(_.get(this,"contacts[0].subContacts",[]), sctc => ((_.get(sctc,"status",0) & (1 << 0)) !== 0) || ((_.get(sctc,"status",0) & (1 << 5)) !== 0)) /* Target lab results (1<<0) or protocol (1<<5) subContact */
      const sourceServiceIds = _.uniq(_.compact(_.map(_.get(sourceSubContact,"services",[]), x => _.get(x,"serviceId",""))))

      const heIds = _
          .chain(_.get(this,"contacts[0].subContacts",[]))
          .filter(sctc => ((_.get(sctc,"status",0) & (1 << 0)) === 0) && ((_.get(sctc,"status",0) & (1 << 5)) === 0) && _.every( _.uniq(_.compact(_.map(_.get(sctc,"services",[]), x => _.get(x,"serviceId","")))), x => sourceServiceIds.indexOf(x) > -1 ))
          .map(subCtc => _.get(subCtc,"healthElementId",""))
          .compact()
          .uniq()
          .value()

      return this.healthElements.filter(he => he.id && heIds.indexOf(he.id) > -1)

  }

  _deleteService(e) {
      this.dispatchEvent(new CustomEvent('delete-service', {detail: {contact: _.get(this,"contacts[0]",{}), isServices: true}, composed: true, bubbles: true}));
  }
}



customElements.define(HtServicesList.is, HtServicesList);
