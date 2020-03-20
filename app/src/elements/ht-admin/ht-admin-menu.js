/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../filter-panel/filter-panel.js';

import '../collapse-button/collapse-button.js';
import '../icons/icure-icons.js';
import '../../styles/icd-styles.js';
import '../dynamic-form/entity-selector.js';
import '../dynamic-form/health-problem-selector.js';

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import styx from '../../../scripts/styx';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtAdminMenu extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles">
            :host {
                display: block;
            }

            :host *:focus{
                outline:0!important;
            }

            .col-left{
                position: relative;
                box-sizing: border-box;
                grid-column: 1 / 1;
                grid-row: 1 / 1;
                background:var(--app-background-color-dark);
                @apply --shadow-elevation-3dp;
                padding: 0;
                display:flex;
                flex-flow: column nowrap;
                align-items: center;
                height: 100%;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                z-index: 25;
                padding: 12px 0;
            }
            paper-listbox{
                background:transparent;
                padding: 0;
            }

            paper-item{
                background:transparent;
                outline:0;
                height: 32px;
                align-items: center;
                --paper-item-selected:{

                };
                --paper-item-focused: {
                    background:transparent;
                };
                --paper-item-focused-before: {
                    background:transparent;
                };

            }

            paper-listbox {
                outline:0;
                --paper-listbox-selected-item: {
                    color:var(--app-text-color-light);
                    background:var(--app-primary-color);
                };
            }



            collapse-button {
                outline:0;
                width: 100%;
                user-select: none;
                --paper-listbox-selected-item: {
                    color:var(--app-text-color-light);
                    background:var(--app-primary-color);
                };
                transition: var(--transition_-_transition);
                background: var(--app-background-color-dark);
            }
            collapse-button paper-item {
                font-size: 13px;
                font-weight: bold;
            }

            collapse-button .menu-item.iron-selected,
            collapse-button paper-item.iron-selected{
                @apply --padding-menu-item;
                color:var(--app-text-color-light);
                background:var(--app-primary-color);
                @apply --text-shadow;
            }

            collapse-button paper-item.iron-selected{
                background: var(--app-background-color-dark);
                color: black;
                text-shadow: none;
            }

            collapse-button paper-item.iron-selected iron-icon{
                color: var(--app-secondary-color) !important;
                opacity: 1;
            }

            collapse-button paper-item iron-icon, paper-item iron-icon{
                height: 24px;
                width: 24px;
                padding: 4px;
                color: var(--app-text-color);
                opacity: .7;
                box-sizing: border-box;
            }

            collapse-button paper-icon-button{
                min-width: 40px;
                min-height: 40px;
            }



            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 -30px;
                padding:0;
                border-radius:0 0 2px 2px;
            }

            paper-item.list-info {
                font-weight: lighter;
                font-style: italic;
                height:48px;
            }

            .menu-item{
                @apply --padding-menu-item;
                height: 24px;
                min-height: 24px;
                @apply --paper-font-button;
                text-transform: inherit;
                justify-content: space-between;
                cursor: pointer;
                @apply --transition;
            }

            .sublist .menu-item {
                font-size: 13px;
                min-height:32px;
                height:32px;
            }
            .sublist .menu-item.flex-start {
                justify-content: flex-start;
            }

            .menu-item:hover{
                /*background: var(--app-dark-color-faded);*/
                @apply --transition;
            }

            .menu-item .iron-selected{
                background:var(--app-primary-color);
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

            paper-item.menu-item.opened {
                /*@apply --padding-right-left-16;*/
            }

            .submenu-item{
                cursor:pointer;
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

            .one-line-menu.list-title {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                align-items: center;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
            }

            #management {
                flex-direction: row;
            }

            #account {
                flex-direction: row;
            }

            #reports {
                flex-direction: row;
            }

            .management-line.one-line-menu {
                width: 100%;
                justify-content: space-between;
            }

            .account-line.one-line-menu {
                width: 100%;
                justify-content: space-between;
            }

            .reports-line.one-line-menu {
                width: 100%;
                justify-content: space-between;
            }

            .sub-menu-icon{
                height: 24px;
                width: 24px;
                margin-right: 8px;
                opacity: .7;
            }

        </style>

        <div class="col-left">
            <template is="dom-if" if="[[isAdmin]]">
                <collapse-button id="managementcollapse">
                    <paper-item id="management" slot="sublist-collapse-item" class="menu-trigger menu-item" on-tap="toggleMenu" elevation="">
                        <div class="one-line-menu list-title management-line">
                            <div>
                                <iron-icon icon="communication:business" class="force-left"></iron-icon>
                                <span class="force-left force-ellipsis box-txt">[[localize('manag','Management of office / medical house',language)]]</span>
                            </div>
                        </div>
                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                    </paper-item>
                    <paper-listbox id="managementlist" class="menu-content sublist" selected="{{managementSelectionIndex}}" selected-item="{{managementSelectionItem}}" selectable="paper-item">
                        <!--
                        <paper-item class="one-line-menu menu-item flex-start" id="management" data-submenu="parentManagementSubMenu">
                            <iron-icon class="sub-menu-icon" icon="vaadin:office"></iron-icon> [[localize('off_mh','Office / Medical house',language)]]
                        </paper-item>
                        <paper-item class="one-line-menu menu-item flex-start" id="management" data-submenu="facturationServiceFeeManagementSubMenu">
                            <iron-icon class="sub-menu-icon" icon="vaadin:invoice"></iron-icon> [[localize('fac_ser_fee','Service fee facturation',language)]]
                        </paper-item>
                        -->
                        <paper-item class="one-line-menu menu-item flex-start" id="management" data-submenu="facturationFlatRateManagementSubMenu">
                            <iron-icon class="sub-menu-icon" icon="icons:shopping-cart"></iron-icon> [[localize('fac_fla_rat','Flat rate facturation',language)]]
                        </paper-item>
                        <paper-item class="one-line-menu menu-item flex-start" id="management" data-submenu="formsManagementSubMenu">
                            <iron-icon class="sub-menu-icon" icon="av:library-books"></iron-icon> [[localize('forms','Forms',language)]]
                        </paper-item>
                        <!--
                        <paper-item class="one-line-menu menu-item flex-start" id="management" data-submenu="groupsManagementSubMenu">
                            <iron-icon class="sub-menu-icon" icon="vaadin:split"></iron-icon> [[localize('grps','Groups of users',language)]]
                        </paper-item>
                        -->
                        <paper-item class="one-line-menu menu-item flex-start" id="management" data-submenu="usersManagementSubMenu">
                            <iron-icon class="sub-menu-icon" icon="social:group"></iron-icon> [[localize('users','Users',language)]]
                        </paper-item>
                        <!--
                        <paper-item class="one-line-menu menu-item flex-start" id="management" data-submenu="delegationsManagementSubMenu">
                            <iron-icon class="sub-menu-icon" icon="vaadin:key"></iron-icon> [[localize('deleg','My delegations',language)]]
                        </paper-item>
                        -->
                    </paper-listbox>
                </collapse-button>
            </template>

            <collapse-button id="accountcollapse">
                <paper-item id="account" slot="sublist-collapse-item" class="menu-trigger menu-item" on-tap="toggleMenu" elevation="">
                    <div class="one-line-menu list-title account-line">
                        <div>
                            <iron-icon icon="icons:account-circle" class="force-left"></iron-icon>
                            <span class="force-left force-ellipsis box-txt">[[localize('my_pro','My profil',language)]]</span>
                        </div>
                    </div>
                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                </paper-item>
                <paper-listbox id="accountlist" class="menu-content sublist" selected="{{accountSelectionIndex}}" selected-item="{{accountSelectionItem}}" selectable="paper-item">
                    <paper-item class="one-line-menu menu-item flex-start" id="account" data-submenu="agendaSubMenu">
                        <iron-icon class="sub-menu-icon" icon="icons:date-range"></iron-icon> [[localize('agenda','Agenda',language)]]
                    </paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" id="account" data-submenu="invoiceSubMenu">
                        <iron-icon class="sub-menu-icon" icon="vaadin:invoice"></iron-icon> [[localize('inv','Invoice',language)]]
                    </paper-item>
                    <!--
                    <paper-item class="one-line-menu menu-item flex-start" id="account" data-submenu="edmgInformationSubMenu">
                        <iron-icon class="sub-menu-icon" icon="icons:folder"></iron-icon> [[localize('acc_edmg_info','Edmg informations',language)]]
                    </paper-item>-->


                    <template is="dom-if" if="[[_isElectronAvailable]]">
                        <paper-item class="one-line-menu menu-item flex-start" id="account" data-submenu="printersInformationSubMenu">
                            <iron-icon class="sub-menu-icon" icon="icons:print"></iron-icon> [[localize('acc_print_info','Printers',language)]]
                        </paper-item>
                    </template>


                    <!--<paper-item class="one-line-menu menu-item flex-start" id="account" data-submenu="accountInformationSubMenu">
                        <iron-icon class="sub-menu-icon" icon="icons:info"></iron-icon> [[localize('acc_info','Account informations',language)]]
                    </paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" id="account" data-submenu="bankInformationsSubMenu">
                        <iron-icon class="sub-menu-icon" icon="icons:account-balance"></iron-icon> [[localize('acc_bank_info','Bank informations',language)]]
                    </paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" id="account" data-submenu="myDelegationsSubMenu">
                        <iron-icon class="sub-menu-icon" icon="communication:vpn-key"></iron-icon> [[localize('deleg','My delegation',language)]]
                    </paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" id="account" data-submenu="preferencesSubMenu">
                        <iron-icon class="sub-menu-icon" icon="vaadin:sliders"></iron-icon> [[localize('acc_prefs','Preferences',language)]]
                    </paper-item>-->
                </paper-listbox>
            </collapse-button>

            <collapse-button id="reportcollapse">
                <paper-item id="reports" slot="sublist-collapse-item" class="menu-trigger menu-item" on-tap="toggleMenu" elevation="">
                    <div class="one-line-menu list-title reports-line">
                        <div>
                            <iron-icon icon="av:equalizer" class="force-left"></iron-icon>
                            <span class="force-left force-ellipsis box-txt">[[localize('reports','Reports',language)]]</span>
                        </div>
                    </div>
                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                </paper-item>
                <paper-listbox id="reportlist" class="menu-content sublist" selected="{{reportSelectionIndex}}" selected-item="{{reportSelectionItem}}" selectable="paper-item">
                    <paper-item class="one-line-menu menu-item flex-start" id="reports" data-submenu="listOfAttestationSubMenu">
                        <iron-icon class="sub-menu-icon" icon="icons:list"></iron-icon> [[localize('lst_att','List of attestations',language)]]
                    </paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" id="reports" data-submenu="ageStructure">
                        <iron-icon class="sub-menu-icon" icon="icons:timeline"></iron-icon> [[localize('age_structure','Age structure',language)]]
                    </paper-item>

                    <paper-item class="one-line-menu menu-item flex-start" id="reports" data-submenu="rashReport">
                        <iron-icon class="sub-menu-icon" icon="icons:timeline"></iron-icon> [[localize('rash','RASH',language)]]
                    </paper-item>

                </paper-listbox>
            </collapse-button>

        </div>
`;
  }

  static get is() {
      return 'ht-admin-menu'
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
          managementSelectionIndex: {
              type: Number,
              value: null
          },
          accountSelectionIndex: {
              type: Number,
              value: null
          },
          reportSelectionIndex:{
              type: Number,
              value: null
          },
          managementSelectionItem:{
              type: Object,
              value: () => {}
          },
          accountSelectionItem: {
              type: Object,
              value: () => {}
          },
          reportSelectionItem:{
              type: Object,
              value: () => {}
          },
          isAdmin: {
              type: Boolean,
              value: false
          },
          _isElectronAvailable: {
              type: Boolean,
              value: false
          }
      }
  }

  static get observers() {
      return ['apiReady(user)',
          '_managementSelectionIndexChanged(managementSelectionIndex)',
          '_accountSelectionIndexChanged(accountSelectionIndex)',
          '_reportSelectionIndexChanged(reportSelectionIndex)'
      ];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
  }

  apiReady(){
      this.user && this.user.roles && this.user.roles.find(r => r === 'ADMIN' || r === 'MS-ADMIN' || r === 'MS_ADMIN') ? this.set('isAdmin', true) : this.set('isAdmin', false)
      this.api && this.api.isElectronAvailable().then(x=> this.set("_isElectronAvailable", !!x) ).catch(e=>{ /* False anyway */ })
  }

  _select(id, name) {
      const indexes = ['managementSelectionIndex', 'accountSelectionIndex', 'reportSelectionIndex'];
      indexes.filter(item => item !== name).forEach(item => {
          this.set(item, null);
      });
      const ids = ['management', 'account', 'reports'];
      ids.filter(item => item !== id).forEach(item => {
          this.shadowRoot.querySelector('#' + item).classList.remove('iron-selected')
      });
      //this.shadowRoot.querySelector('#' + id).classList.add('iron-selected')
  }

  _management(e){
      e.stopPropagation()
      e.preventDefault()

      this.dispatchEvent(new CustomEvent('selection-change', {detail: {selection: {item: 'management', submenu: 'usersManagementSubMenu'}}}));
      this._select("management", "managementSelectionIndex");
  }

  _account(e){
      e.stopPropagation()
      e.preventDefault()

      this.dispatchEvent(new CustomEvent('selection-change', {detail: {selection: {item: 'account', submenu: 'accountSubMenu'}}}));
      this._select("account", "accountSelectionIndex");
  }

  _report(e){
      e.stopPropagation()
      e.preventDefault()

      this.dispatchEvent(new CustomEvent('selection-change', {detail: {selection: {item: 'report', submenu: 'reportsSubMenu'}}}));
      this._select("reports", "reportSelectionIndex");
  }

  _managementSelectionIndexChanged(){
      if (this.managementSelectionIndex !== null && this.managementSelectionIndex !== undefined) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: this.managementSelectionItem.id, submenu: this.managementSelectionItem.dataset.submenu} } }));
          this._select("management", "managementSelectionIndex");
      }
  }

  _accountSelectionIndexChanged(){
      if (this.accountSelectionIndex !== null && this.accountSelectionIndex !== undefined) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: this.accountSelectionItem.id, submenu: this.accountSelectionItem.dataset.submenu} } }));
          this._select("account", "accountSelectionIndex");
      }
  }

  _reportSelectionIndexChanged(){
      if (this.reportSelectionIndex !== null && this.reportSelectionIndex !== undefined) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: this.reportSelectionItem.id, submenu: this.reportSelectionItem.dataset.submenu} } }));
          this._select("reports", "reportSelectionIndex");
      }
  }

  toggleMenu(e){
      e.stopPropagation();
      e.preventDefault();

      styx.parent(e.target, el => el.tagName.toLowerCase() === 'collapse-button').toggle();
      styx.parent(e.target, el => el.tagName.toLowerCase() === 'paper-item').classList.toggle('opened');
  }
}

customElements.define(HtAdminMenu.is, HtAdminMenu)
