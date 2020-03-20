import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../dynamic-form/dynamic-doc.js';
import '../../../collapse-button/collapse-button.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/scrollbar-style.js';
import '../../../../styles/buttons-style.js';
import '../../../../styles/paper-tabs-style.js';
import '../../../dynamic-form/dynamic-text-field.js';
import '../../../../styles/notification-style.js';
import './ht-pat-rn-consult-detail.js';
import './ht-pat-rn-consult-notification.js';
import * as models from 'icc-api/dist/icc-api/model/models';
import moment from 'moment/src/moment';

import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';
class HtPatRnConsultDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style buttons-style paper-tabs-style notification-style">
            #rnConsultDialog{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 64px;
            }

            .w100{
                width: 100%;
            }


            .w33{
                width: 33%;
            }

            .p4{
                padding: 4px;
            }

            .rn-error-container{
                height: auto;
                width: auto;
                color: var(--app-status-color-nok);
                font-weight: bold;
            }

            .rn-success-container{
                height: auto;
                width: auto;
                color: var(--app-status-color-ok);
                font-weight: bold;
            }

            .rnConsultDialog{
                display: flex;
                height: 100%;
                width: auto;
                margin: 0;
                padding: 0;
            }

            .rn-menu-list{
                height: 100%;
                width: 30%;
                background-color: var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
                overflow: auto;
                position: relative;
            }

            .rn-container{
                height: 100%;
                width: 70%;
                position: relative;
                background: white;
            }

            .rn-btn-left{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: auto;
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-items: center;
                padding: 8px 12px;
                box-sizing: border-box;
                border-top: 1px solid var(--app-background-color-dark);
                background: white;
            }

            .rn-btn-right{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: auto;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
                align-items: center;
                padding: 8px 12px;
                box-sizing: border-box;
                border-top: 1px solid var(--app-background-color-dark);
                background: white;
            }

            .rn-menu-search-line{
                display: flex;
            }

            paper-input {
                width: 100%;
                --paper-input-container-input: {
                    height: 22px;
                    font-size: var(--font-size-normal);
                    line-height: var(--font-size-normal);
                    padding: 0 8px;
                    box-sizing: border-box;
                    background: var(--app-input-background-color);
                    border-radius: 4px 4px 0 0;
                };
            }

            .mtm2{
                margin-top: -2px;
            }

            .w40{
                width: 40%;
            }

            .rn-searchResult{
                height: calc(100% - 170px);
                width: auto;
                overflow: auto;
            }


            paper-item {
                background: transparent;
                outline: 0;
                --paper-item-selected: {

                };

                --paper-item-disabled-color: {
                    color: red;
                };

                --paper-item-focused: {
                    background: transparent;
                };
                --paper-item-focused-before: {
                    background: transparent;
                };

            }

            .table-line-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                width: 100%;
            }

            .table-line-menu-top{
                padding-left: var(--padding-menu-item_-_padding-left);
                padding-right: var(--padding-menu-item_-_padding-right);
                box-sizing: border-box;
            }

            .table-line-menu div:not(:last-child){
                border-right: 1px solid var(--app-background-color-dark);
                height: 20px;
                line-height: 20px;
            }

            .table-line-menu .firstName{
                width: 14%;
                padding-right: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: var(--font-size-small);
            }

            .table-line-menu .lastName{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 25%;
                font-size: var(--font-size-small);
            }

            .table-line-menu .birthDate{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 35%;
                font-size: var(--font-size-small);
            }

            .table-line-menu .cp{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 10%;
                font-size: var(--font-size-small);
            }

            .table-line-menu .gender{
                width: 12px;
                padding-right: 4px;
                font-size: var(--font-size-small);
            }

            .table-line-menu .genderTit{
                width: 12px;
                padding-right: 4px;
                font-size: var(--font-size-small);
                font-weight: bold;
            }

            .table-line-menu .firstNameTit{
                width: 14%;
                padding-right: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: var(--font-size-small);
                font-weight: bold;
            }

            .table-line-menu .lastNameTit{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 25%;
                font-size: var(--font-size-small);
                font-weight: bold;
            }

            .table-line-menu .birthDateTit{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 35%;
                font-size: var(--font-size-small);
                font-weight: bold;
            }

            .table-line-menu .cpTit{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 10%;
                font-size: var(--font-size-small);
                font-weight: bold;
            }

            .menu-item {
                @apply --padding-menu-item;
                height: 24px;
                min-height: 24px;
                font-size: var(--font-size-normal);
                text-transform: inherit;
                justify-content: space-between;
                cursor: pointer;
                @apply --transition;
            }

            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 0;
                padding:0;
            }

            .sublist .menu-item {
                font-size: var(--font-size-normal);
                min-height:20px;
                height:20px;
            }

            .menu-item:hover{
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .menu-item .iron-selected{
                background:var(--app-primary-color);

            }

            .genderIcon{
                height: 12px;
                width: 12px;
            }

            .rn-title{
                height: 50px;
                width: auto;
            }

            .rn-menu-list-header{
                height: 48px;
                width: 100%;
                border-bottom: 1px solid var(--app-background-color-darker);
                background-color: var(--app-background-color-dark);
                padding: 0 12px;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                box-sizing: border-box;
            }

            .rn-menu-list-header-img{
                height: 40px;
                width: 40px;
                background-color: transparent;
                margin: 4px;
                float: left;
            }

            .rn-menu-list-header-info{
                margin-left: 12px;
                display: flex;
                align-items: center;
            }

            .rn-menu-list-header-img img{
                width: 100%;
                height: 100%;
            }

            .rn-name{
                font-size: var(--font-size-large);
                font-weight: 700;
            }

            .male{
                color: #0b97c4;
            }

            .female{
                color: deeppink;
            }

            .icon-button{
                height: 16px!important;
                width: 16px!important;
            }

            .m5{
                margin: 5px;
            }

            .mw0{
                min-width: 0
            }

            ht-spinner {
                height: 42px;
                width: 42px;
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }

            .success{
                background-color: var(--app-status-color-ok);
            }

            .tabIcon{
                padding: 4px;
                height: 18px;
            }

            .notification-container{
                z-index: 1000!important;
            }

            .notification-msg{
                background: var(--app-status-color-ok)!important;
            }

            .rn-container-content{
                height: calc(100% - 50px);
                overflow: auto;
            }

        </style>

        <paper-dialog id="rnConsultDialog">
            <div class="rnConsultDialog">
                <div class="rn-menu-list">
                    <div class="rn-menu-list-header">
                        <div class="rn-menu-list-header-img">
                            <img src="data:image/png;base64,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">
                        </div>
                        <div class="rn-menu-list-header-info">
                            <div class="rn-name">
                                [[localize('rn-consult-rn', 'RN consult', language)]]
                            </div>
                        </div>
                    </div>
                    <div class="rn-menu-list-search">
                        <div class="rn-menu-search-line">
                            <vaadin-combo-box id="consultType" class="w40" label="[[localize('rn-consult-type', 'Consultation type', language)]]" filter="{{rnTypeFilter}}" selected-item="{{selectedRnConsultType}}" filtered-items="[[rnConsultType]]" item-label-path="label.fr">
                                <template>[[_getLabel(item.label)]]</template>
                            </vaadin-combo-box>
                            <template is="dom-if" if="[[!_isRnPhoneticSearch(selectedRnConsultType)]]">
                                <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('rn-niss', 'Niss', language)]]" value="{{rnSearch.ssin}}" required="" error-message="This field is required"></dynamic-text-field>
                            </template>
                            <template is="dom-if" if="[[_isRnPhoneticSearch(selectedRnConsultType)]]">
                                <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('rn-lastName', 'Lastname', language)]]" value="{{rnSearch.lastName}}" required="" error-message="This field is required"></dynamic-text-field>
                                <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('rn-birthDate', 'Birthdate', language)]]" value="{{rnSearch.birthDate}}" required="" error-message="This field is required"></dynamic-text-field>
                            </template>
                        </div>
                        <template is="dom-if" if="[[_isRnPhoneticSearch(selectedRnConsultType)]]">
                            <div class="rn-menu-search-line">
                                <dynamic-text-field class="w33 p4 mw0" label="[[localize('rn-firstName', 'Firstname', language)]]" value="{{rnSearch.firstName}}"></dynamic-text-field>
                                <vaadin-combo-box id="w33 p4 mw0" class="w40" label="[[localize('rn-gender', 'Gender', language)]]" selected-item="{{selectedGenderType}}" filtered-items="[[genderType]]" item-label-path="label.fr">
                                    <template>[[_getLabel(item.label)]]</template>
                                </vaadin-combo-box>
                                <dynamic-text-field class="w33 p4 mw0" label="[[localize('rn-tolerance', 'Tolerance', language)]]" type="number" value="{{rnSearch.tolerance}}"></dynamic-text-field>
                            </div>
                        </template>
                    </div>
                    <div class="rn-searchResult">
                        <paper-listbox id="" class="menu-content sublist" selectable="paper-item" toggle-shift="">
                            <div class="table-line-menu table-line-menu-top">
                                <div class="genderTit"></div>
                                <div class="lastNameTit">[[localize('rn-lastName','Lastname',language)]]</div>
                                <div class="firstNameTit">[[localize('rn-firstName','Firstname',language)]]</div>
                                <div class="birthDateTit">[[localize('rn-birthDate','Birthdate',language)]]</div>
                                <div class="cpTit">[[localize('rn-cp','CP',language)]]</div>
                            </div>
                            <template is="dom-repeat" items="[[rnConsultResult.person]]" as="pers">
                                <collapse-button>
                                    <paper-item slot="sublist-collapse-item" id\$="[[pers.ssin.value]]" data-item\$="[[pers]]" aria-selected="[[selected]]" class\$="menu-trigger menu-item [[isIronSelected(selected)]]" on-tap="_showPersonInfo">
                                        <div id="subMenu" class="table-line-menu">
                                            <div class="gender">
                                                <template is="dom-if" if="[[_isMale(pers.personData.gender.value)]]">
                                                    <iron-icon icon="vaadin:male" class="genderIcon male"></iron-icon>
                                                </template>
                                                <template is="dom-if" if="[[!_isMale(pers.personData.gender.value)]]">
                                                    <iron-icon icon="vaadin:female" class="genderIcon female"></iron-icon>
                                                </template>
                                            </div>
                                            <div class="lastName">[[pers.personData.name.last]]</div>
                                            <div class="firstName">[[pers.personData.name.first]]</div>
                                            <div class="birthDate">[[_formatDate(pers.personData.birth.date)]]</div>
                                            <div class="cp">[[pers.personData.address.standardAddress.municipality.postalCode]]</div>
                                        </div>
                                    </paper-item>
                                </collapse-button>
                            </template>
                         </paper-listbox>
                    </div>
                    <div class="rn-btn-left">
                        <paper-button class="button button--save" autofocus="" on-tap="_consultRn">[[localize('rn-consult','Consult',language)]]</paper-button>
                    </div>
                </div>
                <div class="rn-container">
                    <div class="rn-container-content">
                        <paper-tabs selected="{{tabs}}">
                            <paper-tab id="viewerTab">
                                <iron-icon class="tabIcon" icon="vaadin:male"></iron-icon> [[localize('tra_vwr','Viewer',language)]]
                            </paper-tab>
                            <template is="dom-if" if="[[isNotificationTabAvailable]]">
                                <paper-tab id="notificationTab">
                                    <iron-icon class="tabIcon" icon="vaadin:office"></iron-icon> [[localize('rn-crea-noti','Create notification ',language)]]
                                </paper-tab>
                            </template>
                        </paper-tabs>
                        <iron-pages selected="[[tabs]]">
                            <page>
                                <ht-spinner active="[[isLoading]]"></ht-spinner>
                                <template is="dom-if" if="[[_isErrorStatus(rnConsultResult.status, rnConsultResult.*)]]">
                                    <div class="rn-error-container m5">
                                        <div>[[localize('rn-error-code', 'Error code', language)]]: [[rnConsultResult.status.code]]</div>
                                        <template is="dom-repeat" items="[[rnConsultResult.status.messages]]" as="msg">
                                            <div>[[msg.value]]</div>
                                        </template>
                                        <template is="dom-repeat" items="[[rnConsultResult.errorInformations]]" as="info">
                                            [[info]]
                                        </template>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[isNotificationErrror]]">
                                    <div class="rn-error-container m5">
                                        <div>[[notificationStatus.statusMessage]]</div>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[isNotificationSuccess]]">
                                    <div class="rn-success-container m5">
                                        <div>[[notificationStatus.statusCode.statusCode]] [[localize('rn-successStatus', notificationStatus.statusCode.value, language)]]</div>
                                    </div>
                                </template>
                                <template is="dom-if" if="[[_isSelectedPersonData(selectedPersonData, tabs)]]">
                                    <ht-pat-rn-consult-detail id="htPatRnConsultDetail" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" resources="[[resources]]" selected-person-data="[[selectedPersonData]]"></ht-pat-rn-consult-detail>
                                </template>
                               </page>
                            <page>
                                <ht-pat-rn-consult-notification id="htPatRnConsultNotification" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" resources="[[resources]]" list-of-countries="[[listOfCountries]]" list-of-municipality="[[listOfMunicipality]]" on-notification-success="_notificationSuccess" on-notification-existing-persons="_notificationExistingPersons"></ht-pat-rn-consult-notification>
                            </page>
                        </iron-pages>
                    </div>
                    <div class="rn-btn-right">
                        <paper-button class="button button--other" on-tap="_closeRnConsultDialog"><iron-icon icon="icons:close" class="icon-button"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                        <template is="dom-if" if="[[_isSelectedPersonData(selectedPersonData, tabs)]]">
                            <paper-button class="button button--save" autofocus="" on-tap="_importDataIntoPatient"><iron-icon icon="vaadin:cloud-download" class="mr5 icon-button"></iron-icon> [[localize('imp','Import',language)]]</paper-button>
                        </template>
                        <template is="dom-if" if="[[_isNotificationTab(tabs)]]">
                            <paper-button class="button button--save" autofocus="" on-tap="_sendNotification"><iron-icon icon="vaadin:plus-circle-o" class="mr5 icon-button"></iron-icon> [[localize('rn-notify','Notify',language)]]</paper-button>
                        </template>
                    </div>
                </div>
            </div>
        </paper-dialog>

        <paper-item id="import-notification" class="notification-container success">
            <div class="notification-msg">
                <h4>[[localize('rn-import-success', 'Importation success', language)]]</h4>
                <p>[[localize('rn-info-import', 'Informations were imported into patient folder', language)]]</p>
            </div>
        </paper-item>
`;
  }

  static get is() {
      return 'ht-pat-rn-consult-dialog';
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
          patient:{
              type: Object,
              value: () => {}
          },
          rnConsultType:{
              type: Array,
              value: () => [
                  {type: "IdentifyPerson", label: {fr: "Niss", en: "SSIN", nl: ""}},
                  {type: "PhoneticSearch", label: {fr: "Phonétique", en: "Phonetic", nl: ""}},
              ]},
          selectedRnConsultType:{
              type: Object,
              value: () => {}
          },
          rnSearch:{
              type: Object,
              value: () => ({
                  ssin: null,
                  birthDate: null,
                  firstName: null,
                  lastName: null,
                  middelName: null,
                  gender: null,
                  tolerance: null
              })
          },
          rnConsultResult:{
              type: Object,
              value: () => {}
          },
          selectedPersonData:{
              type: Object,
              value: () => {}
          },
          tabs:{
              type: Number,
              value: 0
          },
          listOfCountries:{
              type: Array,
              value: () => []
          },
          listOfMunicipality:{
              type: Array,
              value: () => []
          },
          notificationStatus:{
              type: String,
              value: null
          },
          isNotificationErrror:{
              type: Boolean,
              value: false
          },
          isNotificationTabAvailable:{
              type: Boolean,
              value: false
          },
          isNotificationSuccess:{
              type: Boolean,
              value: false
          },
          isLoading:{
              type: Boolean,
              value: false
          },
          genderType:{
              type: Array,
              value:() => [
                  {type: 'male', label: {fr: 'Masculin', en: 'Male', nl: 'Male'}},
                  {type: 'female', label: {fr: 'Féminin', en: 'Female', nl: 'Female'}}
              ]
          }
      };
  }

  static get observers() {
      return ['_selectedRnConsultTypeChanged(selectedRnConsultType)', '_selectedGenderTypeChanged(selectedGenderType)'];
  }

  ready() {
      super.ready();
  }

  open(e){
      this.set('isNotificationTabAvailable', false)
      this.set('isNotificationErrror', false)
      this.set('isNotificationSuccess', false)
      this.set('selectedPersonData', {})
      this.set('rnConsultResult', {})

      this.api.code().findCodes("be", "BE-COUNTRY")
          .then(countriesCode => Promise.all([countriesCode, this.api.code().findCodes("be", "BE-MUNICIPALITY")]))
          .then(([countriesCode, municipalityCode]) => {
              this.set('listOfCountries', _.sortBy(countriesCode, ['label.'+this.language], ['asc']).map(c => _.assign(c, { normalizedSearchTerms: _.map(_.uniq(_.compact(_.flatten(_.concat([_.get(c, _.trim('label.'+this.language), ""), _.get(c, 'code', "")])))), i =>  _.trim(i).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")).join(" ")})))
              this.set('listOfMunicipality', _.sortBy(municipalityCode, ['label.'+this.language], ['asc']).map(m => _.assign(m, { normalizedSearchTerms: _.map(_.uniq(_.compact(_.flatten(_.concat([_.get(m, _.trim('label.'+this.language), ""), _.get(m, 'code', "")])))), i =>  _.trim(i).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")).join(" ")})))
          })
          .finally(() => {
              _.get(this.patient, 'ssin', null) && this.api.patient().isValidSsin(_.get(this.patient, 'ssin', null)) ? this.set('selectedRnConsultType', this.rnConsultType.find(t => t.type === "IdentifyPerson")) : this.set('selectedRnConsultType', this.rnConsultType.find(t => t.type === "PhoneticSearch"))
              this.set('selectedGenderType', _.get(this.patient, 'gender', null) ? this.genderType.find(t => t.type === _.get(this.patient, 'gender', null)) : null)
              this.set('rnSearch', {
                  ssin: _.get(this.patient, 'ssin', null),
                  firstName: _.get(this.patient, 'firstName', null),
                  lastName: _.get(this.patient, 'lastName', null),
                  middelName: _.get(this.patient, 'middleName', null),
                  gender: _.get(this.patient, 'gender', null),
                  birthDate: _.get(this.patient, 'dateOfBirth', null),
                  tolerance: null
              })
              this.$['rnConsultDialog'].open()
              ;(_.get(this.patient, 'ssin', null) || (_.get(this.patient, 'firstName', null) && _.get(this.patient, 'dateOfBirth', null))) ? this._consultRn() : null
      })
  }

  _closeRnConsultDialog(){
      this.set('rnSearch', {})
      this.set('rnConsultResult', {})
      this.set('selectedPersonData', {})
      this.set('tabs', 0)
      this.$['rnConsultDialog'].close()
  }

  _consultRn(){
      this.set('selectedPersonData', {})
      this.set('isLoading',true);
      ;(this._isRnPhoneticSearch() ? this._consultRnByPhonetic() : this._consultRnBySsin()).then(rnResult => {
          this.set('rnConsultResult', rnResult)
      }).finally(() => {
          (_.size(_.get(this, 'rnConsultResult.person', [])) === 1) ? this.set('selectedPersonData', _.get(this, 'rnConsultResult.person.0', {})) : null
          ;(!this._isRnPhoneticSearch() && _.size(_.get(this, 'rnConsultResult.person', [])) === 1) ? this.set('isNotificationTabAvailable', false)  : this.set('isNotificationTabAvailable', true)
          this.set('isLoading',false);
      })
  }

  _consultRnBySsin(){
      return (_.get(this.rnSearch, 'ssin', null) !== '' && _.get(this.rnSearch, 'ssin', null) !== null ? this.api.fhc().RnConsultController().identifyUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, _.trim(_.get(this.rnSearch, 'ssin', '').replace(/\D+/g, ''))) : Promise.resolve({})).then(result => {
          console.log(result)
          return {
              errorInformations: _.get(result, 'errorInformations', {}),
              id: _.get(result, 'id', null),
              person: _.get(result, 'person', null) ? [ _.get(result, 'person', null)] : [],
              status: _.get(result, 'status', {})
          }
      })
  }

  _consultRnByPhonetic(){
      return (_.get(this.rnSearch, 'birthDate', null) && _.get(this.rnSearch, 'lastName', null) ? this.api.fhc().RnConsultController().searchUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, parseInt(_.padEnd(_.trim(_.get(this.rnSearch, 'birthDate', '')), 8, 0)), _.trim(_.get(this.rnSearch, 'lastName', null)), _.trim(_.get(this.rnSearch, 'firstName', null)), _.trim(_.get(this.rnSearch, 'middleName', null)), _.trim(_.get(this.rnSearch, 'gender', null)), _.trim(_.get(this.rnSearch, 'tolerance', null)), 50) : Promise.resolve([])).then(result => {
          console.log(result)
          return {
              errorInformations: _.get(result, 'errorInformations', {}),
              id: _.get(result, 'id', null),
              person: _.get(result, 'persons', []),
              status: _.get(result, 'status', {})
          }
      })
  }

  _isRnPhoneticSearch(){
      return _.get(this.selectedRnConsultType, 'type', {}) === "PhoneticSearch"
  }

  _selectedRnConsultTypeChanged(){
      if(this.selectedRnConsultType){
          this.set('selectedPersonData', {})
          this.set('rnConsultResult', {})
      }
  }

  _showPersonInfo(e){
      if(_.get(e, 'currentTarget.dataset.item', null)){
          const selected = JSON.parse(_.get(e, 'currentTarget.dataset.item', null))
          this.set('selectedPersonData', selected);
          //this.$['htPatHubTransactionViewer'].open(this,  selected, this._getHubTransactionMessage( selected));
      }
  }

  _formatDate(date){
      return date ? this.api.moment(date).format('DD/MM/YYYY') : null
  }

  _isMale(gender){
      return _.trim(_.toLower(gender)) === "male"
  }

  _getLabel(label){
      return _.get(label, this.language, label.en)
  }

  _isSelectedPersonData(){
      return !_.isEmpty(this.selectedPersonData) && _.get(this, 'tabs', null) === 0
  }

  _importDataIntoPatient(){
      if(_.get(this, 'selectedPersonData', null)){
          this.set('isLoading',true)
          //patient
          _.get(this.selectedPersonData, 'personData.name.first', null) ? this.set('patient.firstName', _.get(this.selectedPersonData, 'personData.name.first', null)) : null
          _.get(this.selectedPersonData, 'personData.name.last', null) ? this.set('patient.lastName', _.get(this.selectedPersonData, 'personData.name.last', null)) : null
          _.get(this.selectedPersonData, 'personData.birth.date', null) ? this.set('patient.dateOfBirth', moment(_.get(this.selectedPersonData, 'personData.birth.date', null)).format('YYYYMMDD')) : null
          _.get(this.selectedPersonData, 'ssin.value', null) ? this.set('patient.ssin', _.get(this.selectedPersonData, 'ssin.value', null)) : null
          _.get(this.selectedPersonData, 'personData.gender.value', null) ? this.set('patient.gender', _.toLower(_.get(this.selectedPersonData, 'personData.gender.value', null))) : null
          _.isEmpty(_.get(this.selectedPersonData, 'personData.birth.localisation.municipality', null)) === false ? this.set('patient.placeOfBirth', this._getDescription(_.get(this.selectedPersonData, 'personData.birth.localisation.municipality', null))) : null

          //addresse

          const homeAdr = _.get(this.patient, 'addresses', []).find(adr => adr.addressType === "home")

          if(homeAdr){
              homeAdr.street =  _.get(this.selectedPersonData, 'personData.address.standardAddress.street', null) ? _.get(this.selectedPersonData, 'personData.address.standardAddress.street', null)  : homeAdr.street
              homeAdr.houseNumber = _.get(this.selectedPersonData, 'personData.address.standardAddress.housenumber', null) ? _.get(this.selectedPersonData, 'personData.address.standardAddress.housenumber', null) : homeAdr.houseNumber
              homeAdr.postalCode = _.get(this.selectedPersonData, 'personData.address.standardAddress.municipality.postalCode', null) ? _.get(this.selectedPersonData, 'personData.address.standardAddress.municipality.postalCode', null) : homeAdr.postalCode
              homeAdr.city = _.get(this.selectedPersonData, 'personData.address.standardAddress.city', null) ? _.get(this.selectedPersonData, 'personData.address.standardAddress.city', null) : homeAdr.city
              homeAdr.country =  _.get(this.selectedPersonData, 'personData.address.standardAddress.country', null) ? this._getDescription(_.get(this.selectedPersonData, 'personData.address.standardAddress.country', null)) : homeAdr.country
          }else{
              this.push('patient.addresses', {
                  addressType: 'home',
                  street: _.get(this.selectedPersonData, 'personData.address.standardAddress.street', null),
                  houseNumber: _.get(this.selectedPersonData, 'personData.address.standardAddress.housenumber', null),
                  postalCode: _.get(this.selectedPersonData, 'personData.address.standardAddress.municipality.postalCode', null),
                  city: _.get(this.selectedPersonData, 'personData.address.standardAddress.city', null),
                  country: this._getDescription(_.get(this.selectedPersonData, 'personData.address.standardAddress.country', null))
              })
          }

          this.api.patient().modifyPatientWithUser(this.user, this.patient)
          .then(p => this.api.register(p,'patient'))
          .then(p => {
              this.dispatchEvent(new CustomEvent("patient-updated", {bubbles: true, composed: true}))
          }).finally(() => {
              this.set('isLoading',false)
              this._importNotificationSuccess()
          })

      }
  }

  _isErrorStatus(status){
      return _.get(status, 'code', null) !== null && _.get(status, 'code', null) !== "100"
  }

  _getDescription(data){
      return _.get(_.get(data, 'descriptions', []).find(d => _.lowerCase(d.lang) === this.language), 'value', null) ? _.get(_.get(data, 'descriptions', []).find(d => _.lowerCase(d.lang) === this.language), 'value', null) : _.get(_.head(_.get(data, 'descriptions', [])), 'value', null) ? _.get(_.head(_.get(data, 'descriptions', [])), 'value', null) : null
  }

  _isNotificationTab(){
      return _.get(this, 'tabs', null) === 1
  }

  _sendNotification(){
      this.$['htPatRnConsultNotification']._sendNotification()
  }

  _notificationSuccess(e){
      this.set('tabs', 0)
      this.set('selectedRnConsultType', this.rnConsultType.find(t => t.type === "IdentifyPerson"))
      this.set('rnSearch', {
          ssin: _.get(e, 'detail.newlyRegisteredPerson.ssin', null),
          firstName: _.get(e, 'detail.newlyRegisteredPerson.name.firstName', null),
          lastName: _.get(e, 'detail.newlyRegisteredPerson.name.lastName', null),
          middelName: null,
          gender: null,
          birthDate: _.get(e, 'detail.newlyRegisteredPerson.birth.birthDate', null) ? _.get(e, 'detail.newlyRegisteredPerson.birth.birthDate', null).replace(/\D+/g, '') : null,
          tolerance: null
      })
      this._consultRn()
      this.set('notificationStatus', _.get(e, 'detail.status', {}))
      this.set('isNotificationSuccess', !_.isEmpty(_.get(e, 'detail.status', {})))
      this.set('tabs', 0)
  }

  _notificationExistingPersons(e){
      this.set('selectedRnConsultType', this.rnConsultType.find(t => t.type === "PhoneticSearch"))
      this.set('rnSearch', {
          ssin: null,
          firstName: _.get(e, 'detail.notificationRequest.firstName', null),
          lastName: _.get(e, 'detail.notificationRequest.lastName', null),
          middelName: null,
          gender: _.get(e, 'detail.notificationRequest.gender', null),
          birthDate: _.get(e, 'detail.notificationRequest.dateOfBirth', null),
          tolerance: null
      })
      this._consultRn()
      this.set('notificationStatus', _.get(e, 'detail.status', {}))
      this.set('isNotificationErrror', !_.isEmpty(_.get(e, 'detail.status', {})))
      this.set('tabs', 0)
  }

  _importNotificationSuccess(value) {
      this.$["import-notification"].classList.add('notification')
      setTimeout(() => {
          this.closeImportNotification()
      }, 5000);
  }

  closeImportNotification() {
      this.$["import-notification"].classList.remove('notification')
  }

  _selectedGenderTypeChanged(){
      this.set('rnSearch.gender', _.get(_.get(this, 'selectedGenderType', null), 'type', null))
  }
}
customElements.define(HtPatRnConsultDialog.is, HtPatRnConsultDialog);
