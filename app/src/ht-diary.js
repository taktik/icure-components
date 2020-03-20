/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import './styles/shared-styles.js';

import './elements/ht-spinner/ht-spinner.js';
import {PolymerElement, html} from '@polymer/polymer';
class HtMsg extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles">
            :host {
                display: block;
                height: calc(100% - 20px);
                /*padding: 10px;*/
            }

            #iframe {
                height: calc(100vh - 68px);
                width: 100vw;
                box-sizing: border-box;
                overflow-x: auto;
                overflow-y: auto;
                border: 0;
            }

            ht-spinner.center {
                position: fixed;
                top: 50vh;
                left: 50vw;
                height: 80px;
                transform: translate(-50%, -50%);
                z-index: -1;
            }
        </style>

        <ht-spinner class="center" active="[[!showAgenda]]"></ht-spinner>

        <template is="dom-if" if="[[showAgenda]]">
            <iframe id="iframe" src\$="[[mikronoUrl]]"></iframe>
        </template>
`;
  }

  static get is() {
      return 'ht-diary'
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
          credentials: {
              type: Object,
              noReset: true
          },
          showAgenda: {
              type: Boolean,
              value: false
          },
          mikronoData: {
              type: Object,
              value: () => {
              }
          },
          mikronoUrl: {
              type: String,
              value: ""
          }
      }
  }

  static get observers() {
      return []
  }

  constructor() {
      super()
  }

  reset() {
      const props = HtMsg.properties
      Object.keys(props).forEach(k => {
          if (!props[k].noReset) {
              this.set(k, (typeof props[k].value === 'function' ? props[k].value() : (props[k].value || null)))
          }
      })
  }

  ready() {
      super.ready()
  }

  loadMikronoIframe(proxy) {
      this.set("showAgenda", true);
      this.set("mikronoUrl", `${proxy}/iCureShortcut.jsp?id=${this.user.id}`);
    }
}

customElements.define(HtMsg.is, HtMsg)
