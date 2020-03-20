import './ht-app-server-dialog.js';
import '../../styles/shared-styles.js';

import "@polymer/paper-button/paper-button"
import "@polymer/paper-dropdown-menu/paper-dropdown-menu"
import "@polymer/paper-input/paper-input"
import "@polymer/paper-item/paper-item"
import "@polymer/paper-listbox/paper-listbox"
import "@polymer/paper-dialog/paper-dialog"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"

import { HealthcarePartyDto } from 'icc-api/dist/icc-api/model/models'

//noinspection JSUnusedGlobalSymbols
import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtAppWelcomeTz extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style include="shared-styles">
            .backdrop{
                position: absolute;
                height: 100%;
                width: 100%;
                top: 0;
                left: 0;
                z-index: 2000;
                background-color: white;
                background: url('../../../images/topaz-welcome-background.svg');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 95% 95%;
            }

            .container{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                height: 60%;
                width: 80%;
                min-height: 800px;
                border-radius: 8px;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px 0 rgba(0,0,0,0.2);
                background: white;
                overflow: hidden;
            }

            .container > div{
                flex-grow: 1;
                width: calc(100% / 3);
                display: inline-flex;
                flex-flow: column wrap;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                padding: 32px 24px;
                box-sizing: border-box;
            }

            .left > div{
                width: 100%;
            }

            .left h1{
                width: 100%;
                text-align: left;
                font-size: 44px;
                font-weight: 700;
                color: var(--app-text-color);
                margin: 0;
                box-sizing: border-box;
                line-height: 44px;
            }

            .left h2{
                width: 100%;
                text-align: left;
                font-size: 32px;
                font-weight: 400;
                color: var(--app-text-color);
                margin: 0;
                box-sizing: border-box;
                line-height: 28px;
            }

            p{
                font-size: 14px;
                color: var(--app-text-color);
                width: 100%;
                box-sizing: border-box;
                margin: 0;
            }

            .middle{
                background: var(--app-background-color-light);
            }

            .right{
                background: url('../../../images/topaz-welcome-img-right.jpg');
                background-position: center center;
                background-size: cover;
                height: 100%;
            }

            paper-button{
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                font-size: 14px;
                font-weight: 500;
                text-transform: capitalize;
                min-width: 160px;
                margin: 0 auto;
                position: relative;
            }

            paper-button:hover{
                box-shadow: var(--app-shadow-elevation-1);
            }

            .left paper-button{
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                margin-top: 24px;
            }

            paper-input{
                width: 100%;
                --paper-input-container-focus-color: var(--app-secondary-color);
                box-sizing: border-box;
            }

            paper-dropdown-menu{
                width: 100%;
                --paper-input-container-focus-color: var(--app-secondary-color);
                box-sizing: border-box;
            }

            .invalid-form {
                color: red;
            }

            @media screen and (max-width: 1024px) {
                .right{
                    display: none!important;
                }
                .container{
                    height: 80%;
                }

                .container > div{
                    width: 50%;
                }
            }

        </style>

        <div class="backdrop">
            <div class="container">
                <div class="left">
                    <div>
                        <h1>Welcome</h1>
                        <h2>thank you for joining Topaz</h2>
                        <ht-app-server-dialog id="icure-servers-list" title="iCure [[localize('server', 'server', language)]]" server-name="icure" local-url="[[defaultIcureUrl]]" api="[[api]]" user="[[user]]" i18n="[[i18n]]" language="[[language]]"></ht-app-server-dialog>

                        <ht-app-server-dialog id="fhc-servers-list" title="Free Health Connector [[localize('server', 'server', language)]]" server-name="fhc" local-url="[[defaultFhcUrl]]" api="[[api]]" user="[[user]]" i18n="[[i18n]]" language="[[language]]"></ht-app-server-dialog>
                    </div>
                    <div>
                        <template is="dom-if" if="[[_isEmpty(allEmptyMsg)]]">
                            <p class="invalid-form">[[allEmptyMsg]]</p>
                        </template>
                        <p>If you already have a database in the cloud. You can copy your cloud key below and start using Topaz. </p>
                        <paper-input label="Cloud key" value="{{cloudKey}}"></paper-input>
                    </div>
                </div>
                <div class="middle">
                    <p>Please fill in this form to request an access to Topaz.</p>
                    <template is="dom-if" if="[[_isEmpty(invalidFormMsg)]]">
                        <p class="invalid-form">[[invalidFormMsg]]</p>
                    </template>
                    <paper-dropdown-menu label="Profession" selected-item="{{professionItem}}">
                        <paper-listbox slot="dropdown-content" class="dropdown-content">
                            <paper-item id="persphysician">Physician</paper-item>
                            <paper-item id="persnurse">Nurse</paper-item>
                            <paper-item id="persphysiotherapist">Physiotherapist</paper-item>
                            <paper-item id="perspsychologist">Psychologist</paper-item>
                            <paper-item id="perssocialworker">Social worker</paper-item>
                            <paper-item id="persadministrative">Secretary</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <template is="dom-if" if="[[_equal(selectedProfessionId,'persphysician')]]">
                        <paper-dropdown-menu label="Speciality" selected-item="{{specialityItem}}">
                            <paper-listbox slot="dropdown-content" class="dropdown-content">
                                <template is="dom-repeat" items="[[specialities]]" as="spec">
                                    <paper-item id="spec_[[spec.id]] ">[[localize(spec.descr, spec.descr, language)]]</paper-item>
                                </template>
                            </paper-listbox>
                        </paper-dropdown-menu>
                    </template>

                    <paper-input label="First Name" value="{{healthcareParty.firstName}}"></paper-input>
                    <paper-input label="Last Name" value="{{healthcareParty.lastName}}"></paper-input>
                    <paper-input label="Inami Number" value="{{healthcareParty.nihii}}"></paper-input>
                    <paper-input label="SSIN Number" value="{{healthcareParty.ssin}}"></paper-input>
                    <paper-input label="Email" id="email" type="email" value="{{user.email}}"></paper-input>
                    <paper-input label="Password" type="password" value="{{user.passwordHash}}" required=""></paper-input>
                    <paper-input label="Confirm Password" type="password" value="{{passwordCheck}}"></paper-input>
                    <paper-button id="login">Request Access</paper-button>
                </div>
                <div class="right"></div>
            </div>


        </div>
`;
  }

  static get is() {
      return "ht-app-welcome-tz";
	}

  static get properties() {
      return {
          user: {
              type: Object,
              value: {}
          },

          healthcareParty: {
              type: Object,
              value: () => new HealthcarePartyDto()
          },

          credentials: {
              type: Object
          },
          opened: {
              type: Boolean,
              value: true,
              notify: true
          },
          specialities: {
              type: Array,
              value: [{id:'003',descr:'general practitioner'}, {id:'690',descr:'pediatrics'}, {id:'055',descr:'dermatology'}, {id:'055',descr:'gastroenterology'}, {id:'340',descr:'gynecologyobstetrics'}]
          }
      };
	}

  static get observers() {
	    return ['_professionChanged(professionItem)']
  }

  constructor() {
      super();

	}

  ready() {
      super.ready();

      this.addEventListener('keypress',this.checkForEnter.bind(this))
      this.$.login.addEventListener('click',e => this.register())
      // this.$.cloud.addEventListener('click',e => this.replicate())
  }

  _professionChanged(item) {
	    if (item) {
	        this.set('selectedProfessionId', item.id)
      }
  }

  _isEmpty(a) {
      return Boolean(a)
  }

  _equal(a,b) { return a === b }

  errorMessage( msg ){
      this.set("invalidFormMsg", msg)
  }

  errorMessageLeft(msg) {
      this.set("allEmptyMsg", msg )
  }

  register() {

      this.errorMessage(null)
      this.errorMessageLeft(null)

      const hcp = this.healthcareParty
      const user = this.user

      if (!hcp.firstName && !hcp.lastName && !hcp.nihii && !hcp.ssin && !user.email && !user.passwordHash && !this.get("professionItem") && !this.get('cloudKey')){

          this.errorMessage("Please fill in at least one of the sides")
          this.errorMessageLeft("Please fill in at least one of the sides")

          return

      }

      Promise.all([this.createUser(), this.replicate()]).then( values => {

          if(values[1] && !values[0]) {

              this.set('hidden', true)

          } else if (values[0]) {

              this.set('hidden', true)

              const currentIcureServerUrl = this.$["icure-servers-list"].getSelectedServerURL()
              const currentFhcServerUrl = this.$["fhc-servers-list"].getSelectedServerURL()

              this.dispatchEvent(new CustomEvent('login', { detail: { credentials: this.credentials, icureurl: currentIcureServerUrl, fhcurl: currentFhcServerUrl }, bubbles: true, composed: true }))

          }

      }).catch( err => {
          console.warn(err)
      })

  }

  createUser() {

      const profession = this.get("professionItem")
      let speciality = { id: "" }

      if(!profession) return this.errorMessage( "All inputs must be filled")
      if(profession.id === "persphysician") speciality = this.get("specialityItem")
      if(!speciality) return this.errorMessage("Choose a speciality")
      if( !this.$.email.$.nativeInput.validity.valid ) return this.errorMessage( "Email is not valid")

      this.healthcareParty.profession = profession.id
      this.healthcareParty.speciality = speciality.id

      const hcp = this.healthcareParty
      const user = this.user

      if( !hcp.firstName || !hcp.lastName || !hcp.nihii || !hcp.ssin || !user.email || !user.passwordHash ) return this.errorMessage("All fields must be filled")
      if( user.passwordHash !== this.get("passwordCheck") ) return this.errorMessage("Passwords are not identical")

      this.user.login = user.email;

      this.user.name = hcp.firstName + " " + hcp.lastName;

      this.user._id = this.api.crypto().randomUuid()
      this.healthcareParty._id = this.api.crypto().randomUuid()

      this.user.healthcarePartyId = this.healthcareParty._id;

      this.healthcareParty.java_type = 'org.taktik.icure.entities.HealthcareParty';
      this.user.java_type = 'org.taktik.icure.entities.User';
      this.user.type = 'database'
      this.user.status = 'ACTIVE'

      this.user.createdDate = Date.now();

      this.credentials.username = this.user.login;
      this.credentials.password = this.user.passwordHash;

      return fetch('http://127.0.0.1:16042/create-first-user',{
          method: "POST",
          headers: {
              "Content-Type" : "application/json; charset=utf-8"
          },
          body: JSON.stringify( [this.healthcareParty,this.user] )
      })

  }

  replicate() {

      fetch('http://127.0.0.1:16042/replicate',{
          method: "POST",
          headers: {
              "Content-Type" : "application/json; charset=utf-8"
          },
          body: JSON.stringify( { cloudKey: this.get('cloudKey').trim() } )
      }).then( response => {
          this.set('hidden',true);
      }).catch( error => {
          console.error(error)
      })

  }

  checkForEnter(e) {
      // check if 'enter' was pressed
      if (e.keyCode === 13) {
          this.register()
      }
	}
}

customElements.define(HtAppWelcomeTz.is, HtAppWelcomeTz);
