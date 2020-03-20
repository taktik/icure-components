/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import './reports/ht-admin-reports-list-of-attestations.js';
import './reports/ht-admin-reports-age-structure.js';
import './reports/ht-admin-reports-rash'

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtAdminReports extends TkLocalizerMixin(PolymerElement) {
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
                padding: 24px 0;
                display:flex;
                flex-flow: column nowrap;
                align-items: center;
                height: 100%;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                z-index: 25;
            }

            #admin-reports-rash{
                height: calc(100% - 50px);
            }


        </style>

        <template is="dom-if" if="[[listOfAttestationLayout]]">
            <ht-admin-reports-list-of-attestations id="admin-reports-list-of-attestations" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]"></ht-admin-reports-list-of-attestations>
        </template>
        <template is="dom-if" if="[[ageStructure]]">
            <ht-admin-reports-age-structure id="admin-reports-age-structure" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]"></ht-admin-reports-age-structure>
        </template>
        <template is="dom-if" if="[[rashReport]]">            
               <ht-admin-reports-rash id="admin-reports-rash" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]"></ht-admin-reports-rash>        
        </template>

`;
  }

  static get is() {
      return 'ht-admin-reports'
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
          selectedSubMenu: {
              type: String,
              observer: '_selectedReportsSubMenuChanged'
          },
          listOfAttestationLayout:{
              type: Boolean,
              value: false
          },
          ageStructure: {
              type: Boolean,
              value: false
          },
          rashReport:{
              type: Boolean,
              value: false
          },
          selection: {
              type: Object,
              observer: '_select'
          }
      }
  }

  static get observers() {
      return [];
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
  }

  _select() {
      if (this.selection.submenu === "ageStructure") {
          const report = this.shadowRoot.querySelector("#admin-reports-age-structure");
          if (report)
              report.open();
      }
  }

  _selectedReportsSubMenuChanged(){
      this.set('listOfAttestationLayout', this.selectedSubMenu === "listOfAttestationSubMenu");
      this.set('ageStructure', this.selectedSubMenu === "ageStructure");
      this.set('rashReport', this.selectedSubMenu === "rashReport");
  }
}

customElements.define(HtAdminReports.is, HtAdminReports)
