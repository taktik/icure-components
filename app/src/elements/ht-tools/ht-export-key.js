import '../qrcode-manager/qrcode-printer.js';
import '../../styles/dialog-style.js';
import './ht-print-key.js';
import moment from 'moment/src/moment';
import mustache from "mustache/mustache.js";

import {TkLocalizerMixin} from "../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtExportKey extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
		<style include="dialog-style">
			paper-dialog {
                position: fixed;
                top: 50vh !important;
                left: 50vw !important;
                transform: translate(-50%,-50%);
                max-height: initial !important;
                max-width: initial !important;
			}

			qrcode-printer {
				width: 100%;
				height: 100%;
			}


			.content{
				min-height: 400px;
				position: relative;
			}

		</style>

		<paper-dialog id="dialog" opened="{{opened}}">
			<h2 class="modal-title">[[localize('sca_the_fol_cod_wit_you_tab','Scan the following code with your tablet',language)]]</h2>
			<div class="content">
                <div id="printable"><qrcode-printer id="qrcode_printer" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" text="[[privateKeyPart]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
			</div>
			<div class="buttons">
				<paper-button dialog-dismiss="" class="button">[[localize('can','Cancel',language)]]</paper-button>
				<paper-button class="button button--other" on-tap="_print"><iron-icon icon="print"></iron-icon>[[localize('pri','Print',language)]]</paper-button>
				<paper-button dialog-confirm="" autofocus="" on-tap="confirm" class="button button--save"><iron-icon icon="save"></iron-icon>[[localize('sel','Select',language)]]</paper-button>
			</div>
		</paper-dialog>

		<ht-print-key id="print-key" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" api="[[api]]" user="[[user]]"></ht-print-key>
`;
  }

  static get is() {
      return 'ht-export-key';
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
          privateKey: {
              type: String
          },
          qrCodeWidth: {
              type: Number,
              value: 200
          },
          privateKeyPart: {
              type: String,
              value: null,
              observer: ''
          },
          opened: {
              type: Boolean,
              value: false
          },
          segments: {
              type: Number,
              value: 8
          },
          verbose: {
              type: Boolean,
              value: true
          }
      };
	}

  static get observers() {
      return ['apiReady(api,user,opened)'];
	}

  ready() {
      super.ready();
      this.addEventListener('iron-resize', () => this.onWidthChange());
	}

  apiReady() {
      if (!this.api || !this.user || !this.user.id || !this.opened) return;

      try {
          const pair = this.api.crypto().RSA.loadKeyPairNotImported(this.user.healthcarePartyId);
          if (pair) {
              const pk = _.cloneDeep(pair.privateKey);
              delete pk.n;
              delete pk.e;

              if (this.verbose) {
                  this.set('privateKey', JSON.stringify(pk).replace(/ /g, ''));
              } else {
                  const a = this.api.crypto().utils.text2ua([pk.d, pk.dp, pk.dq, pk.p, pk.q, pk.qi].join(' '));
                  this.set('privateKey', this.api.crypto().utils.ua2hex(pako.deflate(a)));
                  //const jwk = {alg: 'RSA-OAEP', key_ops: ['decrypt'], kty: 'RSA', ext: true};
                  //[jwk.d,jwk.dp,jwk.dq,jwk.p,jwk.q,jwk.qi] = String.fromCharCode.apply(null, pako.inflate(this.api.crypto().utils.text2ua(this.privateKey))).split(' ')
                  console.log("Check code: ", this.privateKey);
              }
              this._privateKeyChanged(); //Force even if the key hasn't changed
          }
      } catch (e) {
          console.log(e);
      }
	}

  _switchKey() {
      if (!this.privateKeyPart) {
          this.set('privateKeyPart', '1' + this.segments + this.privateKey.substr(0, this.privateKey.length / this.segments));
      } else {
          const step = parseInt(this.privateKeyPart.substr(0, 1)) % this.segments + 1;
          this.set('privateKeyPart', '' + step + this.segments + (step === this.segments ? this.privateKey.substr((step - 1) * this.privateKey.length / this.segments) : this.privateKey.substr((step - 1) * this.privateKey.length / this.segments, this.privateKey.length / this.segments)));
      }
      if (this.opened) {
          setTimeout(this._switchKey.bind(this), 2000);
      }
	}

  _privateKeyChanged() {
      if (this.privateKey) {
          this._switchKey();
      }
	}

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
	}

  onWidthChange() {
      const offsetWidth = this.$.dialog.offsetWidth;
      const offsetHeight = this.$.dialog.offsetHeight;
      if (!offsetWidth || !offsetHeight) {
          return;
      }
      this.set('qrCodeWidth', Math.min(offsetWidth - 32, offsetHeight - 140));
	}

  open() {
      this.$.dialog.open();
	}

  close() {
      this.$.dialog.close();
	}

  _print(){
	    let first=true;
      let html = `
      <html>
          <body>{{label}}<table style="text-align: center;width:100%">`;
      this.$["print-key"].getCodes().map(el => {
          if(first){
              html+="<tr>"
          }
          html+="<td style='height: 350px;'>"
          html+=el.innerHTML
          html+="</td>"
          if(!first){
              html+="</tr>"
          }
          first=!first
      })
      html+=`</table></body>
      </html>
      `;

      this.api.pdfReport(mustache.render(html,{label: this.localize('key_top','Private Key Topaz:',this.language)}),{
        	type : "doc-big-format",
          paperWidth: 210,
          paperHeight: 297,
          marginLeft: 5,
          marginRight: 5,
          marginTop: 5,
          marginBottom: 5
      })
          .then(({pdf:data, printed:printed}) => {
              let blob = new Blob([data], {type: 'application/pdf'});
              let url = window.URL.createObjectURL(blob)
              let a = document.createElement("a");
              document.body.appendChild(a);
              a.style = "display: none;";
              a.href = url;
              a.download = "private_key_qrCode_"+ this.user.id +"_" + moment() + ".pdf";
              a.click();
              window.URL.revokeObjectURL(url);
          })
	}
}
customElements.define(HtExportKey.is, HtExportKey);
