import '../../dynamic-form/dynamic-link.js';
import '../../dynamic-form/dynamic-pills.js';
import '../../../styles/dialog-style.js';
import '../../../styles/scrollbar-style.js';
import './ht-pat-action-plan-detail.js';

import {TkLocalizerMixin} from "../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatActionPlanDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style">
            #dialog{
                min-height: 510px;
                min-width: 600px;
                max-width: 600px;
                max-height: calc( 100vh - 32px ) !important;
            }

            .title {
                position: absolute;
            }

            .links {
                position: absolute;
                right: 0;
            }

            .pills {
                float: right;
            }

            .mh2 {
                max-height: 60px;
            }

            dynamic-link {
                float: right;
                top:4px;
            }

            .content {
               padding: 12px;
               height: 417px;
               overfloaw:auto;
            }

            p.error {
                color: var(--app-error-color);
            }

            paper-button[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            @media screen and (max-width: 936px) {
                paper-dialog#dialog {
                    min-height: 0!important;
                    min-width: 0!important;
                    max-height: none !important;
                    max-width: none !important;
                    height: calc(110vh - 84px)!important;
                    width: 100%;
                    margin: 0;
                    top: 64px!important;
                    left: 0 !important;
                    transform: none!important;
                }
            }
        </style>

        <paper-dialog id="dialog" opened="{{opened}}">
            <!--
            <div class="links">
                <template is="dom-if" if="[[!readonly]]">
                    <dynamic-link i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[linkables]]" represented-object="[[key]]" on-link-to-health-element="linkToHealthElement" api="[[api]]" no-status></dynamic-link>
                </template>
                <div class="pills">
                    <dynamic-pills health-elements="[[linkedHes]]"></dynamic-pills>
                </div>
            </div>
            -->
            <h2 class="modal-title">[[localize('plan_act','Plan an action',language)]]</h2>
            <div class="content">
                <ht-pat-action-plan-detail id="detail" api="[[api]]" user="[[user]]" resources="[[resources]]" language="[[language]]" i18n="[[i18n]]" contacts="[[contacts]]" linkables="[[linkables]]" current-contact="[[currentContact]]" on-changed="_onChanged" on-create-service="_createService" on-update-service="_updateServices" on-link-form="linkForm" on-link-to-health-element="linkService" on-unlink-to-health-element="unlinkService" on-delete-form="deleteForm" readonly="false"></ht-pat-action-plan-detail>
            </div>
            <div class="buttons">
                <p class="error">[[error]]</p>
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                 <template is="dom-if" if="[[exist]]">
                     <paper-button class="button button--other" on-tap="_delete">[[localize('del','Delete',language)]]</paper-button>
                 </template>
                <paper-button class="button button--save" autofocus="" on-tap="_save" disabled="[[!isValid]]"><iron-icon icon="save"></iron-icon>[[localize('save','Save',language)]]</paper-button>
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-action-plan-dialog';
  }

  static get properties() {
      return {
          api: {
              type: Object,
              value: null
          },
          user: {
              type: Object,
              value: null
          },
          language: {
              type: String
          },
          linkables: {
              type: Array,
              value: () => []
          },
          linkedHes: {
              type: Array,
              value: () => []
          },
          contact: {
              type: Object,
              value: null
          },
          currentContact: {
              type: Object,
              value: null
          },
          service : {
              type : Object,
              value : {}
          },
          opened: {
              type: Boolean,
              value: false
          },
          readonly: {
              type: Boolean,
              value: false
          },
          error: {
              type: String,
              value: ''
          },
          isValid: {
              type: Boolean,
              value : false
          },
          exist: {
              type: Boolean,
              value: false
          }
      };
  }

  static get observers() {
      return []
  }

  ready() {
      super.ready();
      this.addEventListener('iron-resize', () => this.onWidthChange());
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }

  _onChanged(e) {
      this.set("error", e.detail.error);
      this.set("isValid", e.detail.isValid);
  }

  onWidthChange() {
      const offsetWidth = this.$.dialog.offsetWidth;
      const offsetHeight = this.$.dialog.offsetHeight;
      if (!offsetWidth || !offsetHeight)
          return;
  }

  open(service, readonly, detail) {
      this.shadowRoot.querySelector("#detail").open(service, readonly, detail);
      this.set("service", service);
      this.set("opened", true);
      this.set("exist", _.get(service, "id", null) != null);
  }

  _save() {
      this.shadowRoot.querySelector("#detail").planAction();
      this.close();
  }

  _delete() {
      this.dispatchEvent(new CustomEvent("delete-service", {
          detail: {
              service: this.service,
              caller: this,
          },
          bubbles: true,
          composed: true
      }))
  }

  delete() {
      this.shadowRoot.querySelector("#detail").delete();
      this.close();
  }

  close() {
      this.$.dialog.close();
  }
}
customElements.define(HtPatActionPlanDialog.is, HtPatActionPlanDialog);
