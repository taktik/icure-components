import { sha256 } from 'js-sha256/src/sha256';

import "@polymer/paper-button/paper-button"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-input/paper-input"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";

class HtAppFirstLoginDialog extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
        paper-dialog{
            border-radius:2px;
        }
        .top-gradient{
            line-height:0;
            font-size:0;
            display:block;
            background: linear-gradient(90deg, var(--app-secondary-color-dark), var(--app-secondary-color));
            height:10px;
            position:relative;
            top:0;
            left:0;
            right:0;
            margin:0;
            border-radius:2px 2px 0 0;
        }
        paper-input{
            --paper-input-container-focus-color: var(--app-secondary-color-dark);
            --paper-input-container-invalid-color: var(--app-error-color);
        }
        paper-button{
            margin:2em auto 0 auto;
            color:var(--app-text-color-light);
            background:var(--app-secondary-color);
            --paper-button-ink-color: var(--app-secondary-color-dark);
            @apply --shadow-elevation-2dp;
            align-self:flex-end;
        }

       .generateKeyBtn{
            display: table;
        }

        .flex{
            display:flex;
            flex-direction: column;
            justify-content: center!important;
        }

        .message.error{
            color: var(--app-error-color);
        }

		#firstConnectionDialog{
			/* height: 400px; */
            padding-bottom: 24px;
			width: 350px;
		}

        .error{
            color: red;
            height: 20px;
            margin-top: 10px;
            width: auto;
        }

    </style>

		<paper-dialog id="firstConnectionDialog" opened="{{opened}}" api="[[api]]" route="[[route]]" user="[[user]]" modal="">

            <h3>[[localize('welcome_mess','Welcome to the Icure application',language)]] [[user.name]]</h3>

            <template is="dom-if" if="[[!user.passwordHash]]">
                <h4>[[localize('generate_key_mess','Entrer a password for the application and click on the following button to generate your key',language)]]</h4>
                <paper-input label="[[localize('mdp','Password',language)]]" value="{{password}}"></paper-input>
                <paper-input label="[[localize('mdp_ver','Password verification',language)]]" value="{{password_verif}}"></paper-input>
                <div class="error">[[passwordError]]</div>
            </template>

            <template is="dom-if" if="[[user.passwordHash]]">
                <h4>[[localize('generate_key_mess_bypass','Generate your key and keep it somewhere safe',language)]]</h4>
            </template>
            <paper-button class="generateKeyBtn" on-tap="generateKey">[[localize('gen','Generate',language)]]</paper-button>

		</paper-dialog>
`;
  }

  static get is() {
      return "ht-app-first-login-dialog";
	}

  static get properties() {
      return {
          credentials: {
              type: Object
          },
          passwordError: {
            type: String
          },
          opened: {
              type: Boolean,
              value: false,
              notify: true
          },
          token: {
              type: String
          },
          userId:{
              type: String
          },
          user: {
              type: Object,
              value: null
          },
          api: {
              type: Object
          },
          password: {
              type: String
          },
          password_verif: {
              type: String
          }
      };
	}

  static get observers() {
      return ['_displayInfoFirstLogin(api, opened)']
  }

  constructor() {
      super();
	}


  _displayInfoFirstConnection(e) {
      if (this.api) {
          if (this.$.firstConnectionDialog.opened === true) {
              this.set('token', this.$.route.__queryParams.token)
              this.set('userId', this.$.route.__queryParams.userId)
          }
      }
  }

  generateKey(){

      if(!this.user.passwordHash) {

          if(this.password !== "" && this.password === this.password_verif){

              this.set('passwordError', '');
              var hash = sha256.create()
              hash.update(this.password)
              const passwordHash = hash.hex()
              this.user.passwordHash = passwordHash

          }else if(this.password !== this.password_verif){

              this.set('passwordError', 'Les mots de passe ne correspondent pas')
              return

          }else if(this.password === ""){

              this.set('passwordError', 'Mot de passe invalide')
              return

          }

      }


      this.api.user().modifyUser(this.user).then(u => {
          this.api.crypto().RSA.generateKeyPair().then(keyPair => {
              this.api.crypto().AES.generateCryptoKey(true).then(AESKey => {
                  return this.api.crypto().RSA.encrypt(keyPair.publicKey, this.api.crypto().utils.hex2ua(AESKey))
              }).then(encryptedAESKey => {
                  this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>{
                      hcp = this.api.register(hcp, 'hcp')
                      this.api.crypto().RSA.exportKeys(keyPair, 'jwk', 'jwk').then(exportedKeyPair => {
                          this.api.crypto().RSA.storeKeyPair(this.user.healthcarePartyId, exportedKeyPair)
                      })

                      this.api.crypto().RSA.exportKeys(keyPair, 'pkcs8', 'spki').then(exportedKeyPair => {
                          const healthcarePartyId = this.user.healthcarePartyId

                          hcp.publicKey = this.api.crypto().utils.ua2hex(exportedKeyPair.publicKey)
                          hcp.hcPartyKeys[healthcarePartyId] = [this.api.crypto().utils.ua2hex(encryptedAESKey), this.api.crypto().utils.ua2hex(encryptedAESKey)]

                          this.api.hcparty().modifyHealthcareParty(hcp).then(h =>{
                              this.api.register(h, 'hcp')

                              var file = new Blob([this.api.crypto().utils.ua2hex(exportedKeyPair.privateKey)] ,{type: "text/plain"})
                              var a = document.createElement("a");
                              document.body.appendChild(a);
                              a.style = "display: none";

                              var url = window.URL.createObjectURL(file);
                              a.href = url;
                              a.download = this.user.healthcarePartyId+".2048.key";
                              a.click();
                              window.URL.revokeObjectURL(url);

                              this.$.firstConnectionDialog.opened = false

                              const nURL = new URL(window.location.href);
                              nURL.hash = "#/main";
                              window.location.replace(nURL);

                          });
                      })
                  })
              })
          })
      })

  }
}

customElements.define(HtAppFirstLoginDialog.is, HtAppFirstLoginDialog);
