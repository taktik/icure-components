import '../qrcode-manager/qrcode-printer.js';
import '../../styles/dialog-style.js';
import {TkLocalizerMixin} from "../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPrintKey extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
		<style include="dialog-style">
			paper-dialog {
                position: fixed;
                top: 50vh !important;
                left: 50vw !important;
                transform: translate(-50%,-50%);
                height: 60vh !important;
                max-height: initial !important;
                max-width: initial !important;
			}

			qrcode-printer {
				width: 100%;
				height: 100%;
			}
		</style>

		<paper-dialog id="dialog_printable" opened="{{opened}}">
			<div id="printable_image">
				<div id="printable_0"><qrcode-printer i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="qrcode_0" text="[[privateKeys.0]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
				<div id="printable_1"><qrcode-printer i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="qrcode_1" text="[[privateKeys.1]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
				<div id="printable_2"><qrcode-printer i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="qrcode_2" text="[[privateKeys.2]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
				<div id="printable_3"><qrcode-printer i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="qrcode_3" text="[[privateKeys.3]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
				<div id="printable_4"><qrcode-printer i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="qrcode_4" text="[[privateKeys.4]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
				<div id="printable_5"><qrcode-printer i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="qrcode_5" text="[[privateKeys.5]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
				<div id="printable_6"><qrcode-printer i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="qrcode_6" text="[[privateKeys.6]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
				<div id="printable_7"><qrcode-printer i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" id="qrcode_7" text="[[privateKeys.7]]" size="[[qrCodeWidth]]" ecl="H"></qrcode-printer></div>
			</div>
		</paper-dialog>
`;
  }

  static get is() {
      return 'ht-print-key';
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
              value: 300
          },
          privateKeys: {
              type: [],
              value: null
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
      if (!this.api || !this.user || !this.user.id) return;

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
              this.set('privateKeys', [...Array(this.segments).keys()].map(step => '' + step + this.segments + (step === this.segments ? this.privateKey.substr((step - 1) * this.privateKey.length / this.segments) : this.privateKey.substr((step - 1) * this.privateKey.length / this.segments, this.privateKey.length / this.segments))))
          }
      } catch (e) {
          console.log(e);
      }
	}

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
	}

  onWidthChange() {
      const offsetWidth = this.$.dialog_printable.offsetWidth;
      const offsetHeight = this.$.dialog_printable.offsetHeight;
      if (!offsetWidth || !offsetHeight) {
          return;
      }
      this.set('qrCodeWidth', Math.min(offsetWidth - 32, offsetHeight - 160));
	}

  open() {
      this.$.dialog_printable.open();
	}

  close() {
      this.$.dialog_printable.close();
	}

  getCodes(){
	    this.apiReady();
	    let list = [];
      list.push(this.$['qrcode_0'].getImage())
      list.push(this.$['qrcode_1'].getImage())
      list.push(this.$['qrcode_2'].getImage())
      list.push(this.$['qrcode_3'].getImage())
      list.push(this.$['qrcode_4'].getImage())
      list.push(this.$['qrcode_5'].getImage())
      list.push(this.$['qrcode_6'].getImage())
      list.push(this.$['qrcode_7'].getImage())

	    return list;
	}
}
customElements.define(HtPrintKey.is, HtPrintKey);
