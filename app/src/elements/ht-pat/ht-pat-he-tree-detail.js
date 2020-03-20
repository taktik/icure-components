import '../../styles/icpc-styles.js';
import '../collapse-button/collapse-button.js';

import styx from '../../../scripts/styx';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtPatHeTreeDetail extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="icpc-styles">
            paper-item.list-info {
                font-weight: lighter;
                font-style: italic;
                --paper-item-min-height: 16px;
                height:16px;
                padding: 0;
            }

            .list-title {
                font-weight: bold;
            }

            .menu-item{
                @apply --padding-menu-item;
                @apply --paper-font-button;
                text-transform: inherit;
                justify-content: space-between;
                cursor: pointer;
                @apply --transition;
                font-size: var(--font-size-normal);
                min-height: 20px;
                height: 20px;
            }

            .menu-item:hover{
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .menu-item .iron-selected{
                background:var(--app-primary-color);
            }

            .btns paper-item.iron-selected {
                background: initial;
            }

            .menu-item .opened{
                background:white!important;
                width:80%;
                border-radius:2px;
            }

            .menu-item-icon--selected{
                width:0;
            }

            .opened .menu-item-icon--selected{
                width: 18px;
            }

            .opened > .menu-item-icon{
                transform: scaleY(-1);
            }

            .menu-item-icon{
                height: 18px;
                width: 18px;
                padding: 0;
            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
            }

            paper-item.menu-item.opened {
                @apply --padding-menu-item;
            }

            .submenu-item{
                cursor:pointer;
                --paper-item-min-height: 20px;
                height:32px;
                padding: 0;
            }

            .submenu-item.iron-selected{
                background:var(--app-primary-color-light);
                color:var(--app-text-color-light);
                @apply --text-shadow;
            }

            .submenu-item-icon{
                height:14px;
                width:14px;
                color:var(--app-text-color-light);
                margin-right:10px;
            }

            paper-item:hover .he-edit-btn-container {
                display:inline-flex;
            }

            paper-item.iron-selected .he-edit-btn-container {
                display:inline-flex;
            }

            .he-edit-btn-container{
                background: var(--app-text-color);
                border-radius: 14px;
                display: none;
                flex-flow: row-reverse wrap;
                justify-content: space-between;
                align-items: center;
                padding: 2px;
                width: 24px;
                height: 24px;
                overflow: hidden;
                transition: width .42s cubic-bezier(0.075, 0.82, 0.165, 1);
                cursor: pointer;
            }

            paper-item:hover .he-edit-btn-container.open {
                width: auto !important;
                display:inline-flex;
                flex-flow: row-reverse nowrap;
            }

            .he-edit-btn{
                height: 24px;
                width: 24px;
                padding: 0;
                color: var(--app-text-color-light);
                margin-right: 4px;
                margin-left: 4px;
                --paper-ink-color:var(--app-text-color-light);
            }

            paper-item:hover .he-edit-btn-container.open .he-edit-btn {
                margin-left: 8px;
                height: 16px;
                width: 16px;
            }

            .he-edit-btn-dark{
                color: var(--app-text-color);
                --paper-ink-color:var(--app-text-color);
            }

            .sub-sublist{
                padding: 0;
                margin: 0 0 0 -30px;
            }

            .sub-sublist > paper-item {
                height: 20px;
                line-height: 20px;
                font-size: var(--font-size-normal);
                padding-left: 38px;
            }

            paper-listbox.sub-sublist{
                --paper-listbox-selected-item: {
                    color:var(--app-text-color-light);
                    background:var(--app-primary-color-light);
                };
            }

            collapse-button {
                outline:0;
                --paper-listbox-selected-item: {
                    color:var(--app-text-color-light);
                    background:var(--app-primary-color);
                }
            }

            collapse-button > .menu-item.iron-selected {
                @apply --padding-menu-item;
                color:var(--app-text-color-light);
                background:var(--app-primary-color);
                @apply --text-shadow;
            }

            paper-item.opened{
                padding-top: 8px;

            }
            .opened{
                color:var(--app-text-color);
                background:var(--app-text-color-light);
                border-radius:2px 2px 0 0;
                box-shadow: 0 4px 0 0 white,
                0 -2px 0 0 white,
                0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);

            }

            .opened.iron-selected{
                box-shadow: 0 4px 0 0 white,
                0 -2px 0 0 var(--app-primary-color),
                0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }

            .colour-code{
                line-height: 12px;
                margin-right:4px;
                color: black;
            }

            .icon-code {
                margin-top: -4px;
                margin-right: 3px;
                width: 8px;
                height: 8px;
                color: var(--app-primary-color-dark);
            }

            .iron-selected .colour-code{
                color: var(--app-light-color);
            }

            .iron-selected .colour-code span{
                background: var(--app-light-color);
            }
            .colour-code:hover{
                font-weight:600;
            }

            .colour-code:hover:before{
                height:8px;
                width:8px;
                margin-bottom:0;
                border-radius:4px;
            }

            .colour-code span{
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
                background: lightgrey;
            }

            .contact .colour-code:not(:first-child) {
                margin-left: 4px;
            }

            .table-line-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                width: 100%;
            }

            .table-line-menu div:not(:last-child){
                border-right: 1px solid var(--app-background-color-dark);
                height: 20px;
                line-height: 20px;
            }

            .table-line-menu .code{
                min-width: 40px;
                padding-right: 4px;
            }

            .table-line-menu .descr{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                flex-grow: 1;
            }

            .table-line-menu .privacy{
                min-width: 20px;
                max-width: 20px;
                padding: 0 2px;
                box-sizing: border-box;
            }

            .table-line-menu .privacy iron-icon{
                height: 16px;
                width: 16px;
            }

            .table-line-menu .sign{
                padding-left:4px;
                padding-right:4px;
                min-width:8px;
            }

            .table-line-menu .date{
                width: 34px;
                padding-left: 4px;
                padding-right: 4px;
                text-align: center;
                overflow: hidden;
                flex-shrink: 0;
                flex-grow: 0;
            }

            .table-line-menu .btns{
                min-width: 40px;
                height: 20px;
                padding: 0;
                line-height: 0;
            }

            paper-menu-button{
                --paper-menu-button: {
                    height: 16px;
                    width: 16px;
                    padding: 0;
                };
                --paper-icon-button: {
                    height: 16px;
                    width: 16px;
                    padding: 0;
                }
            }

             paper-menu-button paper-listbox{
                padding: 2px;
                overflow: hidden;
             }

            paper-menu-button paper-listbox paper-item{
                min-height: 20px;
                height: 20px;
                font-size: var(--font-size-normal);
                color: var(--app-text-color);
                padding: 0 8px;
            }
            paper-menu-button paper-listbox paper-item:hover{
                background: var(--app-background-color);
            }

            .exclude{
                text-decoration: line-through;
            }


        </style>
        <collapse-button>
            <paper-item slot="sublist-collapse-item" id="[[getHeId(he)]]" aria-selected="[[selected]]" class\$="menu-trigger menu-item [[isIronSelected(selected)]]" on-tap="select">
                <div class="table-line-menu">
                    <div class\$="code [[_isExcluded(he)]]">
                        <template is="dom-if" if="[[_hasIcon(he)]]">
                            <template is="dom-if" if="[[he.colour]]">
                                <iron-icon class\$="icon-code [[he.colour]]" icon="[[_getIcon(he)]]"></iron-icon>
                            </template>
                            <template is="dom-if" if="[[!he.colour]]">
                                <iron-icon class="icon-code" icon="[[_getIcon(he)]]"></iron-icon>
                            </template>
                        </template>
                        <template is="dom-if" if="[[_hasColor(he)]]">
                            <label class\$="colour-code [[he.colour]]"><span></span></label>
                        </template>
                        [[getIcpc(he)]]
                    </div>
                    <div class\$="descr [[_isExcluded(he)]]">[[_getLabel(he)]]</div>
                    <div class="privacy"><iron-icon icon="[[_getPrivacyIcon(he)]]"></iron-icon></div>
                    <div class="sign">[[_getSign(he)]]</div>
                    <div class="date">[[_shortDateFormat(he.openingDate, he.valueDate)]]</div>
                    <div class="date">[[_shortDateFormat(he.closingDate)]]</div>
                    <div class="btns">
                        <paper-menu-button>
                            <paper-icon-button icon="icons:more-vert" slot="dropdown-trigger"></paper-icon-button>
                            <paper-listbox slot="dropdown-content">
                                <paper-item id="he-edit-btn-edit_[[getHeId(he)]]" on-tap="_toggleEditHE">[[localize('edi','Edit',language)]]</paper-item>
                                <template is="dom-if" if="[[isNotArchived(he)]]">
                                    <paper-item id="he-edit-btn-archive_[[getHeId(he)]]" on-tap="_archive">[[localize('arch','Archiver',language)]]</paper-item>
                                </template>
                                <template is="dom-if" if="[[isNotActive(he)]]">
                                        <paper-item id="he-edit-btn-active_[[getHeId(he)]]" on-tap="_activate">[[localize('mak_act','Make Active',language)]]</paper-item>
                                </template>
                                <template is="dom-if" if="[[isNotHistory(he)]]">
                                    <paper-item id="he-edit-btn-history_[[getHeId(he)]]" on-tap="_inactivate">[[localize('add_to_ant','Add to med history',language)]]</paper-item>
                                </template>
                                <template is="dom-if" if="[[hasLinkedProcedures(he, contacts, refresher)]]">
                                    <paper-item id="he-edit-btn-procedures_[[getHeId(he)]]" on-tap="_linkToProcedures">[[localize('proc_show_linked','Afficher les procédures liées',language)]]</paper-item>
                                </template>
                                <paper-item id="he-edit-btn-evlink_[[getHeId(he)]]" on-tap="_linkToEvidenceLinker">[[localize('adm_ebm','ebmPracticeNet',language)]]</paper-item>
                            </paper-listbox>
                        </paper-menu-button>
                        <template is="dom-if" if="[[he.plansOfAction.length]]">
                            <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                        </template>
                    </div>
                </div>
                <!-- <div class="he-edit-btn-container">
                    <paper-icon-button id="he-edit-btn-edit_[[getHeId(he)]]" class="he-edit-btn" icon="create" on-tap="_toggleEditHE"></paper-icon-button>

                    <template is="dom-if" if="[[isNotArchived(he)]]">
                        <paper-icon-button id="he-edit-btn-archive_[[getHeId(he)]]" class="he-edit-btn" icon="vaadin:safe" on-tap="_archive"></paper-icon-button>
                    </template>
                    <template is="dom-if" if="[[isNotActive(he)]]">
                        <paper-icon-button id="he-edit-btn-active_[[getHeId(he)]]" class="he-edit-btn" icon="assignment-turned-in" on-tap="_activate"></paper-icon-button>
                    </template>
                    <template is="dom-if" if="[[isNotHistory(he)]]">
                        <paper-icon-button id="he-edit-btn-history_[[getHeId(he)]]" class="he-edit-btn" icon="assignment-return" on-tap="_inactivate"></paper-icon-button>
                    </template>

                    <paper-icon-button id="he-edit-btn-evlink_[[getHeId(he)]]" class="he-edit-btn" on-tap="_linkToEvidenceLinker" icon="vaadin:open-book"></paper-icon-button>

                </div> -->
            </paper-item>
            <paper-listbox class="menu-content sublist sub-sublist" selected-items="{{he.selectedItems}}" multi="" toggle-shift="">
                <template is="dom-if" if="[[!he.plansOfAction.length]]">
                    <paper-item class="submenu-item list-info"><div class="one-line-menu">[[localize('no_app','No approach',language)]]</div><paper-icon-button class="submenu-item-icon" icon="icons:add" on-tap="_addApproach"></paper-icon-button></paper-item>
                </template>
                <template is="dom-repeat" items="[[he.plansOfAction]]" as="poa">
                    <paper-item class="submenu-item" id="_poa_[[poa.id]]">
                        <span>[[poa.name]]</span>
                    </paper-item>
                </template>
                <!--
                <!- - no dialog yet to encode approaches, use HE dialog - ->
                <template is="dom-if" if="[[he.plansOfAction.length]]">
                    <paper-item class="submenu-item sublist-footer"><div class="one-line-menu">[[localize('add_app','Add approach',language)]]</div><paper-icon-button class="submenu-item-icon" icon="icons:add" on-tap="_addApproach"></paper-icon-button></paper-item>
                </template>
                -->
            </paper-listbox>
        </collapse-button>
        <!-- <div class="tooltips">
            <paper-tooltip position="bottom" for="he-edit-btn-edit_[[getHeId(he)]]">[[localize('edi','Edit',language)]]</paper-tooltip>
            <template is="dom-if" if="[[isNotArchived(he)]]"><paper-tooltip position="bottom" for="he-edit-btn-archive_[[getHeId(he)]]">[[localize('arc','Archive',language)]]</paper-tooltip></template>
            <template is="dom-if" if="[[isNotActive(he)]]"><paper-tooltip position="bottom" for="he-edit-btn-active_[[getHeId(he)]]">[[localize('mak_act','Make Active',language)]]</paper-tooltip></template>
            <template is="dom-if" if="[[isNotHistory(he)]]"><paper-tooltip position="bottom" for="he-edit-btn-history_[[getHeId(he)]]">[[localize('add_to_ant','Add to med history',language)]]</paper-tooltip></template>
            <paper-tooltip position="bottom" for="he-edit-btn-evlink_[[getHeId(he)]]">[[localize('adm_ebm','ebmPracticeNet',language)]]</paper-tooltip>
        </div> -->
`;
  }

  static get is() {
      return 'ht-pat-he-tree-detail';
  }

  static get properties() {
      return {
          he: {
              type: Object
          },
          selected: {
              type: Boolean
          },
          iconsMapping: {
              type: Object,
              value: () => ({
                  allergy: "image:filter-vintage",
                  adr: "vaadin:pill",
                  risk: "vaadin:exclamation-circle",
                  socialrisk: "vaadin:group",
                  professionalrisk: "icons:work"
              })
          },
          refresher: {
              type: Number,
              value: 0
          },
          contacts: {
              type: Array,
              value: () => []
          },
          hcp: {
              type: Object,
              value: () => {}
          },
          familyLinks: {
              type: Array,
              value: () => []
          }
      };
  }

  static get observers() {
      return [];
  }

  ready() {
      super.ready();
  }

  isIronSelected(selected) {
      return selected ? 'iron-selected' : '';
  }

  getHeId(he) {
      return he.id ? `_he_${he.id}` : `_svc_${he.idService}`;
  }

  isNotHistory(he) {
      return !he.closingDate && (he.status & 1) === 0;
  }

  isNotActive(he) {
      return he.closingDate || (he.status & 1) !== 0;
  }

  isNotArchived(he) {
      return (he.status & 2) === 0;
  }

  hasLinkedProcedures(he) {
      return this.contacts.some(c => _.get(c, "subContacts", []).some(sc => sc.healthElementId && sc.healthElementId === he.id && _.get(sc, "services", []).length > 0));
  }

  toggleMenu(e) {
      e.stopPropagation();
      e.preventDefault();
      styx.parent(e.target, el => el.tagName.toLowerCase() === 'collapse-button').toggle();
      styx.parent(e.target, el => el.tagName.toLowerCase() === 'paper-item').classList.toggle('opened');
  }

  _toggleEditHE(e) {
      this.dispatchEvent(new CustomEvent('edit-he', { detail: { he: this.he } }));
      // e.stopPropagation();
      // e.preventDefault();
      //
      // let parentElement = e.target.parentElement;
      // if (parentElement.classList.contains('open')) {
      //     this.dispatchEvent(new CustomEvent('edit-he', { detail: { he: this.he } }));
      // } else {
      //     parentElement.classList.add('open');
      //     setTimeout(() => parentElement.classList.remove('open'), 4000);
      // }
  }

  _archive(e) {
      this.dispatchEvent(new CustomEvent('archive-he', { detail: { he: this.he } }));
  }

  _activate(e) {
      this.dispatchEvent(new CustomEvent('activate-he', { detail: { he: this.he } }));
  }

  _inactivate(e) {
      this.dispatchEvent(new CustomEvent('inactivate-he', { detail: { he: this.he } }));
  }

  _linkToProcedures(e) {
      this.dispatchEvent(new CustomEvent('show-linked-procedures', { detail: { he: this.he } }));
  }

  _linkToEvidenceLinker(e){
      e.stopPropagation()
      const he = this.he;
      if(_.get(_.get(this, 'he.codes', []).find(c => c.type === "ICD"), 'code', null) || _.get(_.get(this, 'he.codes', []).find(c => c.type === "ICPC"), 'code', null)){
          _.get(this.api, 'tokenId', null) && _.get(this, 'api.keystoreId', null) ?
          this.api.fhc().Stscontroller().getBearerTokenUsingGET(_.get(this.api, 'tokenId', null), _.get(this, 'api.credentials.ehpassword', null), _.get(this.hcp, 'ssin', null),_.get(this, 'api.keystoreId', null))
              .then(bearerToken => {
                  this._sendPostRequest({
                      action : _.get(this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eHealthEnv'), "typedValue.stringValue", null) === "acc" ? "https://wwwacc.ehealth.fgov.be/idp/profile/SAML2/Bearer/POST" : "https://www.ehealth.fgov.be/idp/profile/SAML2/Bearer/POST",
                      params: [
                          _.get(_.get(this, 'he.codes', []).find(c => c.type === "ICD"), 'code', null) ? {type: "hidden", name: "RelayState", value: "https://login.cdlh.be/sts/evidence"+_.toLower(this.language)+".aspx?k=elicd:"+_.get(_.get(this, 'he.codes', []).find(c => c.type === "ICD"), 'code', null)} : {type: "hidden", name: "RelayState", value: "https://login.cdlh.be/sts/evidence"+_.toLower(this.language)+".aspx?k=elicpc:"+_.get(_.get(this, 'he.codes', []).find(c => c.type === "ICPC"), 'code', null)} ,
                          {type: "hidden", name: "SAMLResponse", value: _.get(bearerToken, 'token', null)}
                      ]
                  })
              }) :
              _.get(_.get(this, 'he.codes', []).find(c => c.type === "ICD"), 'code', null) ?
                  window.open("https://www.evidencelinker.be/"+_.toLower(this.language)+"/Pages/evdresult.aspx?k=elicd:"+_.get(_.get(this, 'he.codes', []).find(c => c.type === "ICD"), 'code', null)) :
                  window.open("https://www.evidencelinker.be/"+_.toLower(this.language)+"/Pages/evdresult.aspx?k=elicpc:"+_.get(_.get(this, 'he.codes', []).find(c => c.type === "ICPC"), 'code', null))
      }
  }

  _sendPostRequest(params){
      const form = document.createElement('form')
      form.method = "post"
      form.target = "cebam"
      form.action = _.get(params, 'action', null)

      _.get(params, 'params', []).map(p => {
          const hiddenField = document.createElement('input')
          hiddenField.type = _.get(p, 'type', null)
          hiddenField.name = _.get(p, 'name', null)
          hiddenField.value = _.get(p, 'value', null)
          form.appendChild(hiddenField)
      })

      document.body.appendChild(form)
      form.submit()
  }

  _addApproach(e) {}

  getIcpc(he) {
      const icpc = he.codes && he.codes.find(t=>t.type==='ICPC' || t.type==='ICPC2')
      return icpc && ((icpc.code || icpc.id.split('|')[1]))
  }

  _shortDateFormat(date, altDate) {
      return (date || altDate) && this.api.moment(date || altDate).format('MM/YY') || '';
  }

  _evidenceLinkerPicture(){
      return require('../../../images/evidencelinkerlogo.png')
  }

  select(e) {
      e.stopPropagation();
      e.preventDefault();

      if (navigator.platform.startsWith('Win') ? e.detail.sourceEvent.ctrlKey : e.detail.sourceEvent.metaKey) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selections: [{ action: this.selected ? 'unselect' : 'select', items: [this.getHeId(this.he)] }] } }));
      } else if (e.detail.sourceEvent.shiftKey) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selections: [{ action: 'extend', items: [this.getHeId(this.he)] }] } }));
      } else {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selections: [{ action: 'unselect' }, { action: 'select', items: [this.getHeId(this.he)] }] } }));
      }
  }

  _getIcon() {
      return this.iconsMapping[(this.he.tags.find(c => (c.type === 'CD-ITEM' || c.type === 'CD-ITEM-EXT-CHARACTERIZATION')) || {}).code || '']
  }

  _hasIcon() {
      return !!this._getIcon()
  }

  _hasColor() {
      return !!(!this._getIcon() && this.he.colour)
  }

  _getSign(healthElement){
      return healthElement && healthElement.tags && healthElement.tags.find(tag => tag.type==="CD-ITEM") && !["familyrisk","risk","socialrisk","allergy","adr","surgery"].find(type => type===healthElement.tags.find(tag => tag.type==="CD-ITEM").code) ? healthElement.status===0 || healthElement.status===1 ?"S" : healthElement.status===3 || healthElement.status===2 ? "N" :"" : ""
  }

  _getPrivacyType(healthElement){
      return healthElement && healthElement.tags &&
      healthElement.tags.find(tag => tag.type==="org.taktik.icure.entities.embed.Confidentiality" && tag.code==="secret") ? "secret"  : ""
  }

  _getPrivacyIcon(healthElement){
      //TODO @sam : retrieve the info to check
      const privacy = this._getPrivacyType(healthElement);
      switch(privacy) {
          case 'secret':
              return 'icure-svg-icons:privacy';
          case 'notvisible':
              return 'icons:visibility-off';
          default:
              return ''
      }

  }

    _getLabel(he){
      const familyLink = this._getFamilyLink(he);
      return !familyLink ? he.descr : he.descr + " (" + familyLink + ")";
  }

    _getFamilyLink(he) {
      const link = _.get(he, 'codes', []).find(c => c.type === "BE-FAMILY-LINK")
        if (link) {
            const familyLink = this.familyLinks.find(c => c.code === link.code);
            if (familyLink && familyLink.label)
                return _.get(familyLink.label, this.language, _.get(familyLink.label, 'fr', null));
        }
        return "";
    }

  _isExcluded(he){
      return _.get(he, 'tags', []).find(t => t.type === "CD-CERTAINTY" && t.code === "excluded") ? "exclude" : null
  }
}
customElements.define(HtPatHeTreeDetail.is, HtPatHeTreeDetail);
