import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../dynamic-form/dynamic-doc.js';
import '../../../collapse-button/collapse-button.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/scrollbar-style.js';
import './ht-pat-hub-sumehr-preview.js';
import './ht-pat-hub-transaction-view.js';
import './ht-pat-hub-history-viewer.js';
import './ht-pat-hub-diary-note.js';
import './ht-pat-hub-utils.js';
import * as models from 'icc-api/dist/icc-api/model/models';
import moment from 'moment/src/moment';

class HtPatHubDetail extends Polymer.TkLocalizerMixin(Polymer.mixinBehaviors([Polymer.IronResizableBehavior], Polymer.Element)) {
  static get template() {
    return Polymer.html`
        <style include="dialog-style scrollbar-style">

            #hubDetailDialog{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 64px;
            }

            .title{
                height: 30px;
                width: auto;
                font-size: 20px;
            }

            .content{
                display: flex;
                height: calc(98% - 140px);
                width: auto;
                margin: 1%;
            }

            .hubDocumentsList{
                display: flex;
                height: 100%;
                width: 50%;
                border: 1px solid #c5c5c5;
                border-top: 4px solid var(--app-secondary-color-dark);
                margin-right: 1%;
            }

            .hubDocumentsList2{
                height: 100%;
                width: 30%;
                border: 1px solid #c5c5c5;
                border-top: 4px solid var(--app-secondary-color-dark);
                margin-right: 1%;
                overflow: auto;
            }

            .hubDocumentViewer{
                display: flex;
                height: 100%;
                width: 70%;
                border: 1px solid #c5c5c5;
                border-top: 4px solid var(--app-secondary-color-dark);
            }

            #transaction-list{
                height: 100%;
                width: 100%;
                max-height: 100%;
                overflow: auto;
            }

            #htPatHubTransactionViewer{
                height: 98%;
                width: 100%;
                max-height: 100%;
            }

            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 -30px;
                padding:0;
                border-radius:0 0 2px 2px;
            }

            collapse-buton{
                --iron-collapse: {
                    padding-left: 0px !important;
                };

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

            .documentListContent{
                margin: 1%;
                width: auto;
            }

            .modal-title {
                background: var(--app-background-color-dark);
                margin-top: 0;
                padding: 16px 24px;
            }

            .buttons{
                position: absolute;
                right: 0;
                bottom: 0;
                margin: 0;
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

            .list-title {
                flex-basis: calc(100% - 72px);
                font-weight: bold;
            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
            }

            .hubDetailDialog{
                display: flex;
                height: calc(100% - 45px);;
                width: auto;
                margin: 0;
                padding: 0;
            }

            .hub-menu-list{
                height: 100%;
                width: 30%;
                background-color: var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
                overflow: auto;
                position: relative;
            }

            .hub-menu-view{
                height: 100%;
                width: 70%;
                position: relative;
                background: white;
            }

            .hub-menu-list-header{
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

            .hub-menu-list-header-img{
                height: 40px;
                width: 40px;
                background-color: transparent;
                margin: 4px;
                float: left;
            }

            .hub-menu-list-header-info{
                margin-left: 12px;
                display: flex;
                /*align-items: center;*/
            }

            .hub-menu-list-header-img img{
                width: 100%;
                height: 100%;
            }

            .hub-name{
                font-size: var(--font-size-large);
                font-weight: 700;
            }

            .menu-item-icon{
                height: 20px;
                width: 20px;
                padding: 0px;
            }

            collapse-button[opened] .menu-item-icon{
                transform: scaleY(-1);
            }

            .bold {
                font-weight: bold;
            }

            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 -30px;
                padding:0;
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

            .table-line-menu .date{
               width: 14%;
                padding-right: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .table-line-menu .type{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 35%;
            }

            .table-line-menu .auth{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 45%
            }

            .table-line-menu .pat{
                width: 4%;
                padding-right: 4px;
                padding-left: 4px;
            }

            .table-line-menu .dateTit{
                width: 14%;
                padding-right: 10px;
            }

            .table-line-menu .typeTit{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 35%;
                white-space: nowrap;
            }

            .table-line-menu .authTit{
                padding-left:4px;
                padding-right:4px;
                width: 45%;
            }

            .table-line-menu .patTit{
                width: 4%;
                padding-left: 4px;
                padding-right: 4px;
                text-align: center;
            }

            .never::after{
                background-color: var(--app-status-color-nok)
            }

            .yes::after{
                background-color: var(--app-status-color-ok)
            }

            .no::after{
                background-color: var(--app-status-color-pending)
            }

            .pat-access{
                height: 16px;
                width: 16px;
                position: relative;
                color: var(--app-text-color);
            }

            .pat-access::after{
                position: absolute;
                display: block;
                content: '';
                right: -5px;
                top: 50%;
                transform: translateY(-50%);
                height: 6px;
                width: 6px;
                border-radius: 50%;
            }

            .hub{
                text-transform: uppercase;
            }

            /*When no h2 on dialog:*/
            .content{
                max-height: calc(100% - 45px);
            }

            .sumehr-form-container {
                position:relative;
            }

            .sumehr-forms-container{
                text-align: right;
                position: absolute;
                margin-top: 8px;
                top: -70px;
                left: -44px;
                background-color: var(--app-background-color);
                opacity: 1;
                border-radius: 2px;
                z-index: 200;
                height: auto !important;
                box-shadow: var(--app-shadow-elevation-2);
                display: flex;
                flex-flow: column nowrap;
                align-items: stretch;
                border-radius: 3px;
                overflow: hidden;
                padding: 0;
            }

            .sumehr-forms-container paper-button{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                text-transform: capitalize;
                height: 28px;
                padding: 0 12px 0 8px;
                font-weight: 400;
                font-size: var(--font-size-normal);
                text-align: left;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                flex-grow: 1;
                border-radius: 0;
                margin: 0;
            }
            .sumehr-forms-container paper-button:hover{
                background: var(--app-background-color-dark);
            }

            .sumehr-forms-container paper-button iron-icon{
                color: var(--app-secondary-color);
                height: 20px;
                width: 20px;
                margin-right: 4px;
                box-sizing: border-box;
            }

            .close-add-forms-btn, .close-sumehr-forms-btn{
                background: var(--app-secondary-color-dark) !important;
            }

            .no-mobile {
                display: none;
            }

            .search-line{
                display: flex;
            }

            .w50{
                width: 49%;
            }

            .ml1{
                margin-left: 1%;
            }

        </style>

        <paper-dialog id="hubDetailDialog">
            <div class="content hubDetailDialog">
                <div class="hub-menu-list">
                    <div class="hub-menu-list-header">
                        <div class="hub-menu-list-header-img">
                            <template is="dom-if" if="[[_isEqual(curHub,'rsw')]]">
                                <img src="../../../../../images/rsw-icn.png">
                            </template>
                            <template is="dom-if" if="[[_isEqual(curHub,'vitalink')]]">
                                <img src="../../../../../images/vitalink-icn.png">
                            </template>
                            <template is="dom-if" if="[[_isEqual(curHub,'rsb')]]">
                                <img src="../../../../../images/rsb-icn.png">
                            </template>
                        </div>
                        <div class="hub-menu-list-header-info">
                            <div class="hub-name">
                                <span class="hub">[[curHub]]</span>
                            </div>
                        </div>
                    </div>
                    <div class="hub-submenu-container">
                        <ht-spinner active="[[isLoading]]"></ht-spinner>
                        <template is="dom-if" if="[[_enableTransactionList(patientHubConsent, hubSupportsConsent)]]">
                            <div class="search-line">
                                <vaadin-combo-box id="documentType" class="w50" label="[[localize('hub-doc-hcp-type', 'Sender', language)]]" filter="{{documentTypeFilter}}" selected-item="{{selectedDocumentCategory}}" filtered-items="[[listOfDocumentCategory]]" item-label-path="label.fr">
                                    <template>[[_getLabel(item.label)]]</template>
                                </vaadin-combo-box>
                                <vaadin-combo-box id="author" class="w50 ml1" label="[[localize('hub-author', 'Author', language)]]" filter="{{authorFilter}}" selected-item="{{selectedAuthor}}" filtered-items="[[listOfAuthor]]" item-label-path="nameHr">
                                    <template>[[item.nameHr]]</template>
                                </vaadin-combo-box>
                            </div>

                            <div class="search-line">
                                <vaadin-combo-box id="docType" class="w50" label="[[localize('hub-doc-type', 'Document type', language)]]" filter="{{documentTypeFilter}}" selected-item="{{selectedDocumentType}}" filtered-items="[[listOfDocumentType]]" item-label-path="label.fr">
                                    <template>[[_getLabel(item.label)]]</template>
                                </vaadin-combo-box>
                                <dynamic-text-field label="[[localize('filter','Filter',language)]]" class="w50 ml1" value="{{filter}}"></dynamic-text-field>
                            </div>

                            <template is="dom-repeat" items="[[_getHcPartyTypes(hubTransactionListFiltered, 'hub')]]" as="hcptype">
                                <collapse-button opened="true" id="[[hcptype]]">
                                    <paper-item id="account" slot="sublist-collapse-item" class="menu-trigger menu-item bold" on-tap="toggleMenu" elevation="">
                                        <div class="one-line-menu list-title account-line">
                                            <div>
                                                <span class="force-left force-ellipsis box-txt bold">[[_localizeHcpType(hcptype)]]</span>
                                            </div>
                                        </div>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                                    </paper-item>
                                    <paper-listbox id="" class="menu-content sublist" selectable="paper-item" toggle-shift="">
                                        <div class="table-line-menu table-line-menu-top">
                                            <div class="dateTit">[[localize('dat','Date',language)]]</div>
                                            <div class="typeTit">[[localize('type','Type',language)]]</div>
                                            <div class="authTit">[[localize('aut','Author',language)]]</div>
                                            <div class="patTit"></div>
                                        </div>
                                        <template is="dom-repeat" items="[[_filterList(hubTransactionListFiltered, hcptype)]]">
                                            <collapse-button>
                                                <paper-item slot="sublist-collapse-item" id\$="[[item]]" data-item\$="[[item]]" aria-selected="[[selected]]" class\$="menu-trigger menu-item [[isIronSelected(selected)]]" on-tap="transactionItemClick">
                                                    <div id="subMenu" class="table-line-menu">
                                                        <div class="date">[[_transactionDate(item)]]</div>
                                                        <div class="type">[[_transactionType(item)]]</div>
                                                        <div class="auth">[[_transactionAuthor(item)]]</div>
                                                        <div class="pat">
                                                            <iron-icon title="Accessible par le patient le: [[_patientAccessDate(item)]]" icon="vaadin:male" class\$="pat-access [[_patientAccessIcon(item)]]"></iron-icon>
                                                        </div>
                                                    </div>
                                                </paper-item>
                                            </collapse-button>
                                        </template>
                                    </paper-listbox>
                                </collapse-button>
                            </template>
                        </template>
                    </div>
                </div>
                <div class="hub-menu-view">
                    <ht-pat-hub-transaction-view id="htPatHubTransactionViewer" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" diary-note="[[diaryNote]]" transaction-of-diary-note="[[transactionOfDiaryNote]]" resources="[[resources]]" on-hub-download="_hubDownload"></ht-pat-hub-transaction-view>
                </div>
            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                <paper-button class="button button--other" on-tap="_refresh"><iron-icon icon="icons:refresh"></iron-icon> [[localize('refresh','Refresh',language)]]</paper-button>
                <template is="dom-if" if="[[revokableTransaction]]">
                    <paper-button class="button button--other" on-tap="_runRevokeHubTransaction"><iron-icon icon="icons:delete"></iron-icon> [[localize('revoke_tra','Revoke document',language)]]</paper-button>
                </template>
<!--                <paper-button class="button button&#45;&#45;other" on-tap="_openHistoryViewer"><iron-icon icon="icons:compare-arrows" ></iron-icon> [[localize('sumehr_history','Update history',language)]]</paper-button>-->
<!--                <paper-button class="button button&#45;&#45;other" on-tap="_openPreviewSumehr"><iron-icon icon="icons:backup" ></iron-icon> [[localize('upload_sumehr','Upload sumehr',language)]]</paper-button>-->

                <template is="dom-if" if="[[!showSumehrContainer]]">
                <paper-button id="sumehrBtnCtnr" class="button button--menu" on-tap="_toggleSumehrActions">
                    <span class="no-mobile">[[localize('sumehr','Sumehr',language)]]</span>
                    <iron-icon icon="[[_actionIcon(showSumehrContainer)]]"></iron-icon>
                </paper-button>
                </template>
                <template is="dom-if" if="[[showSumehrContainer]]">
                    <div class="sumehr-form-container">
                        <paper-button id="sumehrBtnCtnr" class="button button--menu" on-tap="_toggleSumehrActions">
                            <span class="no-mobile">[[localize('clo','Close',language)]]</span>
                            <iron-icon icon="[[_actionIcon(showSumehrContainer)]]"></iron-icon>
                        </paper-button>
                        <div class="sumehr-forms-container">
                            <paper-button on-tap="_openHistoryViewer"><iron-icon icon="icons:compare-arrows"></iron-icon> [[localize('sumehr_history','Update history',language)]]</paper-button>
                            <paper-button on-tap="_openPreviewSumehr"><iron-icon icon="icons:backup"></iron-icon> [[localize('upload_sumehr','Upload sumehr',language)]]</paper-button>
                        </div>
                    </div>
                </template>
<!--                <paper-button class="button button&#45;&#45;other" on-tap="_addDiaryNote"><iron-icon icon="vaadin:clipboard-cross" ></iron-icon> [[localize('add_diary_note','Add diary note',language)]]</paper-button>-->
            </div>
        </paper-dialog>
        <ht-pat-hub-diary-note id="htPatHubDiaryNote" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-close-hub-dialog="_closeOverlay"></ht-pat-hub-diary-note>
        <ht-pat-hub-sumehr-preview id="htPatHubSumehrPreview" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-hub-download="_hubDownload" on-close-hub-dialog="_closeOverlay"></ht-pat-hub-sumehr-preview>
        <ht-pat-hub-history-viewer id="htPatHubHistoryViewer" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-hub-download="_hubDownload" on-close-hub-dialog="_closeOverlay"></ht-pat-hub-history-viewer>
        <ht-pat-hub-utils id="htPatHubUtils" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-hub-download="_hubDownload" on-close-hub-dialog="_closeOverlay"></ht-pat-hub-utils>
`;
  }

  static get is() {
      return 'ht-pat-hub-detail';
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
          opened: {
              type: Boolean,
              value: false
          },
          patient:{
            type: Object
          },
          currentContact:{
              type: Object
          },
          tabs: {
              type:  Number,
              value: 0
          },
          isLoading:{
              type: Boolean,
              value: false
          },
          activeItem: {
              type: Object,
              observer: '_activeItemChanged'
          },
          eidCardNumber:{
              type: String,
              value : '',
          },
          isiCardNumber:{
              type: String,
              value : '',
          },
          curHub:{
              type: String,
              value: null,
              observer: '_curHubChanged'
          },
          curEnv:{
              type: String,
              value: null
          },
          hubId:{
              type: Number,
              value : 0
          }
          ,
          hubEndPoint:{
              type: String,
              value:'https://acchub.reseausantewallon.be/HubServices/IntraHub/V3/IntraHub.asmx'
          },
          hubPackageId:{
              type: String,
              value:null
          },
          hubApplication : {
              type: String,
              value:null
          },
          hubSupportsConsent:{
              type: Boolean,
              value: false
          },
          hcpHubConsent:{
              type: Object
          },
          patientHubConsent:{
              type: Object
          },
          patientHubTherLinks:{
              type: Object
          },
          patientHubInfo:{
              type: Object
          },
          hcpZip:{
              type:String,
              value:'1000'
          },
          hubTransactionList:{
              type: Array,
              value: function(){
                  return [];
              }
          },
          hubTransactionListFiltered:{
              type: Array,
              value: function(){
                  return [];
              }
          },
          selectedTransaction:{
              type: Object
          },
          revokeTransactionResp:{
              type: String,
              value: ""
          },
          supportBreakTheGlass:{
              type: Boolean,
              value: false
          },
          breakTheGlassReason:{
              type: String,
              value: null
          },
          filter:{
              type: String,
              value: ""
          },
          diaryNote:{
              type: Array,
              value: () => []
          },
          transactionOfDiaryNote:{
              type: Array,
              value: () => []
          },
          directToUpload:{
              type: Boolean,
              value: false
          },
          showAddFormsContainer: {
              type: Boolean,
              value: false
          },
          showSumehrContainer: {
              type: Boolean,
              value: false
          },
          revokableTransaction:{
              type: Boolean,
              value: false
          },
          selectedDocumentCategory:{
              type: Object,
              value: () => {}
          },
          selectedAuthor:{
              type: Object,
              value: () => {}
          },
          selectedDocumentType:{
              type: Object,
              value: () => {}
          },
          listOfDocumentCategory:{
              type: Array,
              value: () => []
          },
          listOfAuthor:{
              type: Array,
              value: () => []
          },
          listOfDocumentType:{
              type: Array,
              value: () => []
          }
      };
  }

  static get observers() {
      return ['apiReady(api,user,opened)', 'filterChanged(filter)', 'selectedFiltersChanged(selectedDocumentCategory, selectedAuthor, selectedDocumentType)'];
  }

  ready() {
      super.ready();
      document.addEventListener('xmlHubUpdated', () => this.xmlHubListener() );
  }

  _dateFormat(date) {
      return date ? this.api.moment(date).format('DD/MM/YYYY') : '';
  }

  apiReady() {
      if (!this.api || !this.user || !this.user.id || !this.opened) return;

      try {
      } catch (e) {
          console.log(e);
      }
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }

  _actionIcon(showAddFormsContainer) {
      return showAddFormsContainer ? 'icons:close' : 'icons:more-vert';
  }

  _toggleSumehrActions() {
      this.showSumehrContainer = !this.showSumehrContainer;
  }

  open(directToUpload) {
      this.set('revokableTransaction', false);
      this.set('showSumehrContainer', false);
      this.set('directToUpload', directToUpload ? true : false)
      this.$['hubDetailDialog'].open();

      this.set('selectedTransaction', null);
      this.$['htPatHubTransactionViewer'].open(this,  null);

      this._refresh();

  }

  _refresh(){
      this.set('revokableTransaction', false);
      this._setHub();
  }

  _enableBreakTheGlass(btg){
      return btg;
  }

  _enableTransactionList(hubconsent, supportConsent){
      return this._patientHasHubConsent(hubconsent)|| !supportConsent;
  }

  _enableRegisterConsent(hubconsent, supportConsent){
      return !this._patientHasHubConsent(hubconsent) && supportConsent;
  }

  _enableRevokeConsent(hubconsent, supportConsent){
      return this._patientHasHubConsent(hubconsent) && supportConsent;
  }


  _curHubChanged(){
      this._setHub();
  }

  _initHub(){
      const propHub = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.preferredhub') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.preferredhub'},
              typedValue: {type: 'STRING', stringValue: 'rsw'}
          })

      const propEnv = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.eHealthEnv') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.user.eHealthEnv'},
              typedValue: {type: 'STRING', stringValue: 'prd'}
          })
      this.set("curHub", propHub.typedValue.stringValue);
      this.set("curEnv", propEnv.typedValue.stringValue);
      this.set("supportBreakTheGlass", false);
      
      const hubConfig = this.$["htPatHubUtils"].getHubConfig(this.curHub, this.curEnv);

      this.set('isLoading',true);
      this.set('hcpHubConsent', null);
      this.set('patientHubConsent', null);
      this.set('patientHubTherLinks', null);
      this.set('hubTransactionList', null);
      this.set('hubTransactionListFiltered', null)
      this.set('patientHubInfo', null);
      this.set('breakTheGlassReason', null);

      this.hubId = hubConfig.hubId;
      this.hubEndPoint = hubConfig.hubEndPoint;
      this.set("hubSupportsConsent", hubConfig.hubSupportsConsent);
      this.hubPackageId = hubConfig.hubPackageId;
      this.hubApplication = hubConfig.hubApplication;
      this.set("supportBreakTheGlass", hubConfig.supportBreakTheGlass);
  }

  _setHub(){
      this._initHub();

      if (this.hubSupportsConsent) this._getHubHcpConsent().then(consentResp => this.set('hcpHubConsent', consentResp)).catch(error => {
          console.log(error);
      });
      if (this.hubSupportsConsent) this._getHubPatientConsent().then(consentResp => this.set('patientHubConsent', consentResp)).catch(error => {
          console.log(error);
      });
      if (this.hubSupportsConsent) this._getHubTherapeuticLinks().then(tlResp => this.set('patientHubTherLinks', tlResp)).catch(error => {
          console.log(error);
      });
      this._getHubTransactionList().then(tranResp => {
          this.set('isLoading', false);
          if(this.directToUpload){
              this.set('directToUpload', false);
              this._openPreviewSumehr();
          }
      }).catch(error => {
          this.set('isLoading', false);
          console.log(error);
      });

      if (this.hubSupportsConsent){
          this.putHubPatient().then(putResp => {
              this.getHubPatient().then(hubPat => this.set('patientHubInfo', hubPat)).catch(error => {console.log(error);})
          }).catch(error => {console.log(error);})
      }
  }

  addSearchField(){
      this.hubTransactionList.forEach(tr => tr.searchField = this._transactionType(tr).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      + "|" + this._transactionCDHcParties(tr, 'hub').map(hcp => this._localizeHcpType(hcp)).join("|").toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))

      //_localizeHcpType
  }

  filterChanged(){
      console.log("filterchanged", this.filter);
      //this.set('hubTransactionListFiltered', this.hubTransactionList && this.hubTransactionList.length ? this.hubTransactionList.filter(tr => this._transactionType(tr).toLowerCase().includes(this.filter)) : [] );
      this.set('hubTransactionListFiltered', this.hubTransactionList && this.hubTransactionList.length ? this.hubTransactionList.filter(tr => tr.searchField.includes(this.filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) : [] );
  }

  _getDiaryNote(){
      if(_.size(this.diaryNote)){
          let prom = Promise.resolve()

          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
              this.diaryNote.map(dn => {
                  prom = prom.then(listOfTransaction =>
                      this.api.fhc().Hubcontroller().getTransactionMessageUsingGET(this.hubEndPoint, this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip, this.patient.ssin, dn.ids.find(id => id.s === 'LOCAL').sv, dn.ids.find(id => id.s === 'LOCAL').sl, dn.ids.find(id => id.s === 'LOCAL').value, this.hubPackageId, this.breakTheGlassReason)
                          .then(tr => _.concat(listOfTransaction, _.assign(tr, {transaction: dn})))
                  )
              })

              prom = prom.then(listOfTransaction => {
                  this.set("transactionOfDiaryNote", _.compact(listOfTransaction))
              })
          })
      }
  }

  close() {
      this.$.dialog.close();
  }

  _activeItemChanged(item){

  }

  transactionItemClick(e) {
      if(e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.item){
          const selected = JSON.parse(e.currentTarget.dataset.item)
          this._isOwnTransaction(selected).then(res => this.set('revokableTransaction',res));
          this.set('selectedTransaction', selected);
          console.log('current transactioninfo', selected);
          this.$['htPatHubTransactionViewer'].open(this,  selected, this._getHubTransactionMessage( selected));
          //this._getHubTransactionXML(selected).then(resp => console.log("xml", resp));
      }
  }

  _isOwnTransaction(tr){
      return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
          // console.log("me is ", hcp.ssin, hcp.nihii);
          // console.log("trinfo", JSON.stringify(tr));
          const author = tr && tr.author && tr.author.hcparties && tr.author.hcparties.length && tr.author.hcparties.length > 0
              ? tr.author.hcparties.find(p => p.ids && p.ids.find(id => id.value === hcp.ssin || id.value === hcp.nihii))
              : null;
          console.log("found author is", author);
          return !!author;
      })
  }

  _openTransactionViewer(e){
      e.stopPropagation();
      if(e && e.target && e.target.item) {
          this.set("selectedTransaction", e.target.item)
          this.$['htPatHubTransactionViewer'].open( e.target.item, this._getHubTransactionMessage( e.target.item));
      }
  }

  _runGetTransactionList(){
      console.log("_runGetTransactionList");
      this.set('isLoading',true);
      this._getHubTransactionList().then(tranResp => {
          this.set('isLoading', false);
          this.set('hubTransactionList', tranResp)}).catch(error => {
          console.log(error);
          this.set('isLoading', false);
      });
  }

  // _runPutSumehrV2(){
  //     this.generateAndPutSumehrV2().then(putResp => {
  //         this.set('putTransactionResponse', putResp);
  //         console.log("putTransactionResponse = ", putResp);
  //         this._getHubTransactionList().then(tranResp => this.set('hubTransactionList', tranResp));
  //     }).catch(error => {
  //         console.log(error);
  //     });
  // }
  //
  // generateAndPutSumehrV2(){
  //     if (this.patient && this.patient.ssin && this.api.tokenId) {
  //         return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
  //             this.api.patient().getPatientWithUser(this.user,this.patient.id)
  //                 .then(patientDto =>
  //                     this.api.crypto().extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
  //                         .then(secretForeignKeys =>
  //                             this.api.bekmehr().generateSumehrV2ExportWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", {
  //                                 secretForeignKeys: secretForeignKeys.extractedKeys,
  //                                 recipient: hcp,
  //                                 comment: "mycomment"
  //                             }).then(output =>
  //                                 this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
  //                                     .then(hcp =>{
  //                                         let reader = new FileReader();
  //                                         reader.onload = function() {
  //                                             console.log("sumehr = ", reader.result);
  //                                         }
  //                                         reader.readAsText(output);
  //
  //                                         return this.api.fhc().Hubcontroller().putTransactionUsingPOST(this.hubEndPoint,
  //                                             this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
  //                                             hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
  //                                             this.hubId,
  //                                             this.patient.ssin,
  //                                             output,
  //                                             this.hubPackageId, this.hubApplication
  //                                         )}
  //                                     ).then(putResp => {
  //                                         if (putResp) {
  //                                             return putResp;
  //                                         } else {
  //                                             return null;
  //                                         }
  //                                     }
  //                                 )
  //                             )
  //                         )
  //                 ))
  //     }else{
  //         return Promise.resolve(null)
  //     }
  // }

  _isEqual(a,b) {
      return (a === b)
  }

  _addDiaryNote(){
      this.$['htPatHubDiaryNote'].open();
  }

  _openPreviewSumehr(){
      this.set('showSumehrContainer', false);
      this._getMostRecentSumehr().then(tr => this.$['htPatHubSumehrPreview'].open(tr ? this._getHubTransactionMessage(tr) : null, this, tr ? this._getHubTransactionXML(tr) : null));
  }

  _openHistoryViewer(){
      this.set('showSumehrContainer', false);
      this.$['htPatHubHistoryViewer'].open();
  }

  // _generateSumehrV2(){
  //     if (this.patient) {
  //         this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
  //             this.api.patient().getPatientWithUser(this.user,this.patient.id)
  //                 .then(patientDto =>
  //                     this.api.crypto()
  //                         .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
  //                         .then(secretForeignKeys => {
  //                             return this.api.bekmehr().generateSumehrV2ExportWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", {
  //                                 secretForeignKeys: secretForeignKeys.extractedKeys,
  //                                 recipient: hcp,
  //                                 comment: "mycomment"
  //                             }).then(output => {
  //                                 let reader = new FileReader();
  //                                 const myself = this;
  //                                 reader.onload = function() {
  //                                     console.log("sumehr = ", reader.result);
  //                                     // const parser = new DOMParser();
  //                                     // const srcDOM = parser.parseFromString(reader.result, "application/xml");
  //                                     // Converting DOM Tree To JSON.
  //                                     // console.log("json = ", JSON.stringify(myself.xml2json(srcDOM)));
  //                                     console.log("json = ", parser.toXml(reader.result))
  //
  //                                 }
  //                                 reader.readAsText(output);
  //
  //
  //                                 //creation of the xml file
  //                                 let file = typeof output === "string" ? new Blob([output] ,{type: "application/xml"}) : output
  //
  //                                 //creation the downloading link
  //                                 let a = document.createElement("a");
  //                                 document.body.appendChild(a);
  //                                 a.style = "display: none";
  //
  //                                 //download the new file
  //                                 let url = window.URL.createObjectURL(file);
  //                                 a.href = url;
  //                                 a.download = (patientDto.lastName || "Doe").replace(" ","_") + "_" + (patientDto.firstName || "John").replace(" ","_") + "_" + (moment().format("x"))+"_sumehr.xml";
  //                                 a.click();
  //                                 window.URL.revokeObjectURL(url);
  //
  //                                 document.body.removeChild(a);
  //
  //                             }).catch( error=> console.log(error))
  //                         })
  //                 ))
  //     }
  // }

  _runGenerateMedicationScheme(){
      this._generateMedicationScheme(1)
  }

  //generateMedicationSchemeExport(patientId: string,language?: string,version?: number,body?: models.MedicationSchemeExportInfoDto
  _generateMedicationScheme(versionNumber){
      if (this.patient) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.patient().getPatientWithUser(this.user,this.patient.id)
                  .then(patientDto =>
                      this.api.crypto()
                          .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                          .then(secretForeignKeys => {
                              return this.api.bekmehr().generateMedicationSchemeWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", versionNumber, {
                                  secretForeignKeys: secretForeignKeys.extractedKeys,
                                  recipient: hcp,
                                  comment: "mycomment"
                              }).then(output => {
                                  //creation of the xml file
                                  let file = typeof output === "string" ? new Blob([output] ,{type: "application/xml"}) : output

                                  //creation the downloading link
                                  let a = document.createElement("a");
                                  document.body.appendChild(a);
                                  a.style = "display: none";

                                  //download the new file
                                  let url = window.URL.createObjectURL(file);
                                  a.href = url;
                                  a.download = (patientDto.lastName || "Doe").replace(" ","_") + "_" + (patientDto.firstName || "John").replace(" ","_") + "_" + (moment().format("x"))+"medicationscheme.xml";
                                  a.click();
                                  window.URL.revokeObjectURL(url);

                                  document.body.removeChild(a);
                              }).catch( error=> console.log(error))
                          })
                  ))
      }
  }

  _runPutMedicationScheme(){
      const versionNumber = 23;
      this.generateAndPutMedicationScheme(versionNumber).then(putResp => {
          this.set('putTransactionSetResponse', putResp);
          //this._getHubTransactionList().then(tranResp => this.set('hubTransactionList', tranResp));
      }).catch(error => {
          console.log(error);
      });
  }

  generateAndPutMedicationScheme(versionNumber){
      if (this.patient) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.patient().getPatientWithUser(this.user,this.patient.id)
                  .then(patientDto =>
                      this.api.crypto()
                          .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                          .then(secretForeignKeys => {
                              return this.api.bekmehr().generateMedicationSchemeWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", versionNumber, {
                                  secretForeignKeys: secretForeignKeys.extractedKeys,
                                  recipient: hcp,
                                  comment: "mycomment"
                              }).then(output =>{
                                  return this.api.fhc().Hubcontroller().putTransactionSetUsingPOST(this.hubEndPoint,
                                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                                      this.hubId,
                                      this.patient.ssin,
                                      output,
                                      this.hubPackageId, this.hubApplication
                                  )}
                              )
                          })
                  ))
      }
  }

  _transactionId(tr){
      this.set('selectedTransaction', tr); //is this needed ?
      if(tr) {
          const idLocal = tr.ids.find(id => ["vitalinkuri", "RSWID", "RSBID"].includes(id.sl));
          if (idLocal) {
              return idLocal.value;
          }
          else {
              return "--";
          }
      }
      else
      {
          return "";
      }
  }

  _transactionType(tr){
      const cdTransType = tr.cds.find(cd => cd.s === "CD-TRANSACTION");
      if(cdTransType){
          return this.localize("cd-transaction-"+cdTransType.value, cdTransType.value, this.language);
      }
      else {
          return "--";
      }
  }

  _transactionDate(tr){
      if(tr.date) {
          let d = new Date(0);
          d.setUTCMilliseconds(tr.date + (tr.time ? tr.time : 0) );
          return this.api.moment(d).format("DD/MM/YY");
      } else {
          return "";
      }
  }

  _transactionAuthor(tr){
      return _.flatMap(tr.author || [], it => it).filter(it => it.familyname).map(it => it.familyname + " " + it.firstname).join("/");
  }

  _transactionCDHcParties(trn, ignore){
      let a = _.flatMap(trn.author || [], it => it);
      let b = _.flatMap(a || [], it => it.cds.find(cd => cd.s === "CD-HCPARTY"));
      return _.flatMap(b.filter(it  => it !== undefined) || [], it => it.value).filter(it => it !== ignore)
      //return "--"
  }

  _patientAccessCD(tr, sl){
      const cdres = tr && tr.cds && tr.cds.length ? tr.cds.find(cd => cd.sl && cd.sl === sl) : undefined;
      return cdres
  }

  _patientAccessDate(tr){
      const cd1 = this._patientAccessCD(tr, "PatientAccess");
      let d = "";
      if(cd1){
          const cd2 = cd1.value && cd1.value === "yes" ?  this._patientAccessCD(tr, "PatientAccessDate") : undefined;
          d = (cd1.value === "never" ? this.localize(cd1.value, cd1.value, this.language) : "") + " " + (cd2 && cd2.value ? "" + cd2.value + "" : "") + "";
      }

      return d;
  }

  _patientAccessIcon(tr){
      const cd1 = this._patientAccessCD(tr, "PatientAccess");
      let d = "";
      if(cd1){
          const cd2 = cd1.value && cd1.value === "yes" ?  this._patientAccessCD(tr, "PatientAccessDate") : undefined;
          d = (cd1.value === "never" ? this.localize(cd1.value, cd1.value, this.language) : "") + " " + (cd2 && cd2.value ? "" + cd2.value + "" : "") + "";
      }

      return moment().isBefore(moment(_.trim(d), "DD/MM/YYYY")) ? "no" : moment().isSameOrAfter(moment(_.trim(d), "DD/MM/YYYY"))  ? "yes" : "never"

  }

  _getHcPartyTypes(trns, ignore){
      if(trns){
          let a = _.uniq(_.flatMap(trns.map(trn => this._transactionCDHcParties(trn, ignore))))
          return a
      }
      else {
          return "";
      }
  }

  _filterList(list, hcptype){
      //console.log("filterlist")
      return  list && hcptype ? list.filter(itm => itm.author && itm.author.hcparties && itm.author.hcparties.length > 0 && itm.author.hcparties.filter(hcp => hcp.cds && hcp.cds.length > 0 && hcp.cds.find(cd => cd.s && cd.s === "CD-HCPARTY" && cd.value && cd.value === hcptype)).length > 0) : []
  }

  _patientHasHubConsent(cs){
      if((cs && cs.author && cs.author.hcparties && cs.author.hcparties[0]) || !this.hubSupportsConsent){
          return true;
      }
      else{
          return false;
      }
  }

  _HcpHasHubConsent(cs, consentSupport){
      let betweendates = false;
      const currentdate = new Date().getTime();
      if(cs && cs.signdate) {
          betweendates = cs.signdate <= currentdate;
      }
      if(betweendates && cs && cs.revokedate) {
          betweendates = cs.revokedate >= currentdate;
      }
      return !consentSupport || betweendates;
  }

  _getHubHcpConsentDesc(cs){
      let desc = '';
      //hub
      if(cs && cs.author && cs.author && cs.author.hcparties && cs.author.hcparties[0]){
          desc += cs.author.hcparties[0].name + ' ';
      }
      if(cs && cs.hcparty && cs.hcparty.ids) {
          //hcp
          desc += this.localize("hcp", "Hcp", this.language) + " : " +  "[" + cs.hcparty.ids.find(id => id.s === 'ID-HCPARTY').value + "] ";
          desc += cs.hcparty.ids.find(id => id.s === 'INSS').value + " ";
      }
      if(cs && cs.signdate) {
          //sign
          desc += this.localize("from", "From ", this.language) + " " + this.api.moment(cs.signdate).format('DD/MM/YYYY') + " ";
      }
      if(cs && cs.revokedate) {
          //revoke
          desc += this.localize("to", "To", this.language) + " " + this.api.moment(cs.revokedate).format('DD/MM/YYYY') + " ";
      }
      return desc;
  }

  getHubEndPoint(){
      return this.hubEndPoint;
  }



  _getHubHcpConsent(){
      //getHcpConsentUsingGET: function (endpoint, keystoreId, tokenId, passPhrase, hcpNihii, hcpSsin, hcpZip)
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getHcpConsentUsingGET(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.nihii, hcp.lastName, hcp.firstName, hcp.ssin, this.hcpZip)
              ).then(consentResp => {
                      if (consentResp) {
                          return consentResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _getHubPatientInfoDesc(pi){
      if(pi){
          return pi.firstName + " " + pi.lastName + " [" + this.localize(pi.gender, pi.gender, this.language) + "]";
      }else{
          return  this.localize("pat_not_hub", "Patient does not exist on hub.", this.language);
      }
  }

  _getHubPatientTherLinkDesc(tl){
      let desc = '';
      if(tl && tl.length > 0) {
          desc = tl[0].therapeuticLink.patient.inss + " <-> " + tl[0].therapeuticLink.hcParty.ids.find(id => id.s === "ID-HCPARTY").value
              +  " " + this.localize("from", "From ", this.language) +" "
              + this.api.moment(tl[0].therapeuticLink.startDate).format('DD/MM/YYYY')
              + " " +  this.localize("to", "To", this.language) + " "
              + this.api.moment(tl[0].therapeuticLink.endDate).format('DD/MM/YYYY')
      }
      return desc;
  }

  _getHubPatientConsentDesc(cs){
      let desc = '';
      // author - sign date - type
      // author - fname lname niss nihii

      if(cs && cs.cds && cs.cds.find(cd => cd.s === 'CD_CONSENTTYPE')){
          desc += cs.cds.find(cd => cd.s === 'CD_CONSENTTYPE').value + " : " ;
      }

      if(cs && cs.author && cs.author.hcparties && cs.author.hcparties[0]) {
          const hcp = cs.author.hcparties[0]
          desc += (hcp.name ? hcp.name + ' ' : '') + (hcp.familyname ? hcp.familyname + ' ' : '') + (hcp.firstname ? hcp.firstname : '');
          desc += ' [' + hcp.ids.find(id => id.s === 'ID-HCPARTY').value + ']';
      }
      if(cs && cs.signdate) {
          desc += ' ' + this.api.moment(cs.signdate).format('DD/MM/YYYY');
      }
      return desc;
  }


  _runGetHubPatient(){
      this.getHubPatient().then(hubPat => this.set('patientHubInfo', hubPat));
  }
  //getPatientUsingGET(
  // endpoint: string,
  // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
  // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
  // patientSsin: string, hubPackageId?: string): Promise<models.Patient | any>;
  getHubPatient(){
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getPatientUsingGET(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin)
              ).then(patResp => {
                      if (patResp) {
                          return patResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _runPutHubPatient(){
      this.putHubPatient().then(hubPat => this.set('putPatientResult', hubPat));
  }
  //putPatientUsingPOST(
  // endpoint: string,
  // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
  // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
  // patientSsin: string, firstName: string, lastName: string, gender: string, dateOfBirth: number,
  // hubPackageId?: string): Promise<models.Patient | any>;
  putHubPatient(){
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().putPatientUsingPOST(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin, this.patient.firstName, this.patient.lastName, this.patient.gender, this.patient.dateOfBirth)
              ).then(patResp => {
                      if (patResp) {
                          return patResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _getHubPatientConsent(){
      //getPatientConsentUsingGET1: function (endpoint, keystoreId, tokenId, passPhrase, hcpNihii, hcpSsin, hcpZip, patientSsin)
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getPatientConsentUsingGET1(this.hubEndPoint, this.api.keystoreId,
                      this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin)
              ).then(consentResp => {
                      if (consentResp) {
                          return consentResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _runRegisterHubPatient(){
      this._registerHubPatientConsent().then(consResp => this.set('registerConsentResp', consResp)).catch(error=> console.log(error))
      this._registerHubPatientTherapeuticLink().then(tlResp => this.set('registerTLResp', tlResp)).catch(error=> console.log(error))
  }

  _registerHubPatientConsent(){
      //registerPatientConsentUsingPOST1(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // patientSsin: string,
      // hubPackageId?: string,
      // patientEidCardNumber?: string): Promise<any | Boolean>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.fhc().Hubcontroller().registerPatientConsentUsingPOST1(this.hubEndPoint,
                  this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                  this.patient.ssin, this.hubPackageId, this.eidCardNumber)
          ).then(consResp => {
                  if(consResp.therapeuticLink) {
                      //this.showPatientTherLinkState()
                      return(consResp.therapeuticLink)
                  }
                  else{
                      return Promise.resolve(null)
                  }
              }
          )
      }
      else
      {
          return Promise.resolve(null)
      }
  }

  _getHubTherapeuticLinks(){
      //getTherapeuticLinksUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // patientSsin: string,
      // hubPackageId?: string,
      // therLinkType?: string,
      // from?: Date,
      // to?: Date): Promise<Array<models.TherapeuticLink> | any>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getTherapeuticLinksUsingGET(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName,  hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin,
                      this.hubPackageId)
              ).then(tlResp => {
                      if (tlResp) {
                          return tlResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _registerHubPatientTherapeuticLink(){
      //registerTherapeuticLinkUsingPOST(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // patientSsin: string,
      // hubPackageId?: string,
      // patientEidCardNumber?: string): Promise<any | Boolean>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.fhc().Hubcontroller().registerTherapeuticLinkUsingPOST(this.hubEndPoint,
                  this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                  this.patient.ssin,
                  this.hubPackageId,
                  this.eidCardNumber)
          ).then(therLinkResp => {
                  if(therLinkResp.therapeuticLink) {
                      //this.showPatientTherLinkState()
                      return(therLinkResp.therapeuticLink)
                  }
                  else{
                      return Promise.resolve(null)
                  }
              }
          )
      }
      else
      {
          return Promise.resolve(null)
      }
  }

  _revokeHubPatientTherapeuticLink(){
      //TODO: implement, does not exist in FHC
  }

  _getMostRecentSumehr(){
      if(!this.hubId){this._initHub()}
      return this._getHubTransactionList().then(tranResp => {
          this.set('hubTransactionList', tranResp);
          return tranResp ? _.first(_.orderBy(tranResp.filter(r => r.cds.find(cd => cd.value === "sumehr")), ['date', 'time'], ['desc', 'desc'])) : {};
      })
  }

  _getHubTransactionList(){
      //getTransactionsListUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // patientSsin: string,
      // hubPackageId?: string,
      // from?: number, to?: number,
      // authorNihii?: string, authorSsin?:  string,
      // isGlobal?: boolean, breakTheGlassReason?: string): Promise<Array<models.TransactionSummary> | any>;
      if (this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getTransactionsListUsingGET(
                      this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin,
                      this.hubPackageId,
                      null, null,
                      null, null,
                      true, this.breakTheGlassReason
                  )
              ).then(tranResp => {
                      if (tranResp) {
                          this.set('hubTransactionList', tranResp);
                          this.addSearchField();
                          this.filterChanged();
                          this.set('diaryNote', tranResp.filter(tr => tr.desc === "diarynote"));
                          this.set('listOfDocumentCategory', _.uniq(_.flatMap(tranResp.map(trn => this._transactionCDHcParties(trn, false)))).map(type => {
                              return {
                                  code: type,
                                  label: {
                                      fr: this.localize('cd-hcp-'+type, type, this.language),
                                      nl: this.localize('cd-hcp-'+type, type, this.language),
                                      en: this.localize('cd-hcp-'+type, type, this.language)
                                  }
                              }
                          }))
                          this.set('listOfAuthor', _.orderBy(_.uniqBy(_.flatten(tranResp.map(tr => _.get(tr, 'author', [])).map(auth => _.get(auth, 'hcparties', []))).map(hcp => {
                                  return {
                                      id: _.get(_.get(hcp, 'ids', []).find(id => _.get(id, 's', null) === "ID-HCPARTY"), 'value', null) || _.get(_.get(hcp, 'ids', []).find(id => _.get(id, 's', null) === "INSS"), 'value', null) || _.get(_.get(hcp, 'ids', []).find(id => _.get(id, 's', null) === "LOCAL"), 'value', null),
                                      name: _.get(hcp, "name", null),
                                      firstName: _.get(hcp, "firstname", null),
                                      familyName: _.get(hcp, "familyname", null),
                                      nameHr: _.trim(_.get(hcp, "name", null))+" "+_.trim(_.get(hcp, "firstname", null))+" "+_.trim(_.get(hcp, "familyname", null))
                                  }
                          }), "id"), ["nameHr"], ["asc"]))
                          this.set('listOfDocumentType', _.orderBy(_.compact(_.uniqBy(tranResp.map(tr => {
                              return {
                                  code: _.get(tr, 'desc', null),
                                  label: {
                                      fr: this.localize('cd-transaction-'+_.get(tr, 'desc', null), _.get(tr, 'desc', null), this.language),
                                      nl: this.localize('cd-transaction-'+_.get(tr, 'desc', null), _.get(tr, 'desc', null), this.language),
                                      en: this.localize('cd-transaction-'+_.get(tr, 'desc', null), _.get(tr, 'desc', null), this.language)
                                  }
                              }

                          }), 'code')), ["code"], ["asc"]))
                          this._getDiaryNote();
                          return tranResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _isTransactionSet(tr){
      let cd = tr && tr.cds ? tr.cds.find(cd => cd.value.toLowerCase()==='gettransactionset') : null;
      if(cd){
          return true;
      } else {
          return false;
      }
  }

  _getHubTransaction(transaction){
      //getTransactionUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if(transaction && this._isTransactionSet(transaction)) {
          return this._getHubTransactionSet(transaction);
      } else {
          if (this.patient.ssin && this.api.tokenId && transaction) {
              return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp =>
                      this.api.fhc().Hubcontroller().getTransactionUsingGET(this.hubEndPoint, this.api.keystoreId,
                          this.api.tokenId, this.api.credentials.ehpassword,
                          hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                          this.patient.ssin,
                          transaction.ids.find(id => id.s === 'LOCAL').sv, transaction.ids.find(id => id.s === 'LOCAL').sl, transaction.ids.find(id => id.s === 'LOCAL').value,
                          this.hubPackageId, this.breakTheGlassReason
                      )
                  ).then(tranResp => {
                          if (tranResp) {
                              return tranResp;
                          } else {
                              return null;
                          }
                      }
                  )
          } else {
              return Promise.resolve(null)
          }
      }
  }

  _getHubTransactionMessage(transaction){
      //getTransactionUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if(transaction && this._isTransactionSet(transaction)) {
          return this._getHubTransactionSetMessage(transaction);
      } else {
          if (this.patient.ssin && this.api.tokenId && transaction) {
              return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp =>
                      this.api.fhc().Hubcontroller().getTransactionMessageUsingGET(this.hubEndPoint, this.api.keystoreId,
                          this.api.tokenId, this.api.credentials.ehpassword,
                          hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                          this.patient.ssin,
                          transaction.ids.find(id => id.s === 'LOCAL').sv, transaction.ids.find(id => id.s === 'LOCAL').sl, transaction.ids.find(id => id.s === 'LOCAL').value,
                          this.hubPackageId, this.breakTheGlassReason
                      )
                  ).then(tranResp => {
                          if (tranResp) {
                              return tranResp;
                          } else {
                              return null;
                          }
                      }
                  )
          } else {
              return Promise.resolve(null)
          }
      }
  }

  _getHubTransactionXML(transaction){
      //getTransactionUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if(transaction && this._isTransactionSet(transaction)) {
          return null;
      } else {
          if (this.patient.ssin && this.api.tokenId && transaction) {
              return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp =>
                      this.api.fhc().Hubcontroller().getTransactionUsingGET(this.hubEndPoint, this.api.keystoreId,
                          this.api.tokenId, this.api.credentials.ehpassword,
                          hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                          this.patient.ssin,
                          transaction.ids.find(id => id.s === 'LOCAL').sv, transaction.ids.find(id => id.s === 'LOCAL').sl, transaction.ids.find(id => id.s === 'LOCAL').value,
                          this.hubPackageId, this.breakTheGlassReason
                      )
                  ).then(tranResp => {
                          if (tranResp) {
                              return tranResp;
                          } else {
                              return null;
                          }
                      }
                  )
          } else {
              return Promise.resolve(null)
          }
      }
  }

  _runRevokeHubTransaction(e){
      e.stopPropagation();
      this.set('revokableTransaction',false);
      if(this.selectedTransaction) {
          this._revokeHubTransaction(this.selectedTransaction).then(tranResp =>{
              this.set("revokeTransactionResp", tranResp);
              this._getHubTransactionList().then(tranResp => this.set('hubTransactionList', tranResp));
              this.set('selectedTransaction', null);
              this.$['htPatHubTransactionViewer'].open(this,  null);
          })
      }
  }
  //revokeTransactionUsingDELETE(
  // endpoint: string,
  // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
  // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
  // ssin: string,
  // sv: string, sl: string, id: string,
  // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;

  _revokeHubTransaction(transaction){
      if (this.patient.ssin && this.api.tokenId && transaction) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp => this.api.fhc().Hubcontroller().revokeTransactionUsingDELETE(this.hubEndPoint,
                  this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                  hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                  this.patient.ssin,
                  transaction.ids.find(id => ["vitalinkuri", "RSWID", "RSBID"].includes(id.sl)).sv,
                  transaction.ids.find(id => ["vitalinkuri", "RSWID", "RSBID"].includes(id.sl)).sl,
                  transaction.ids.find(id => ["vitalinkuri", "RSWID", "RSBID"].includes(id.sl)).value,
                  this.hubPackageId, null
                  ) //TODO: add break the glass reason
              ).then(tranResp => {
                      if (tranResp) {
                          return tranResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  //breakTheGlassReason
  _getHubTransactionSet(transaction){
      //getTransactionSetUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if (this.patient.ssin && this.api.tokenId && transaction) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getTransactionSetUsingGET(this.hubEndPoint, this.api.keystoreId,
                      this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin,
                      transaction.ids.find(id => id.s==='LOCAL').sv, transaction.ids.find(id => id.s==='LOCAL').sl, transaction.ids.find(id => id.s==='LOCAL').value,
                      this.hubPackageId, this.breakTheGlassReason
                  )
              ).then(tranResp => {
                      if (tranResp) {
                          return tranResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _getHubTransactionSetMessage(transaction){
      //getTransactionSetUsingGET(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // ssin: string, sv: string, sl: string, id: string,
      // hubPackageId?: string, breakTheGlassReason?: string): Promise<string | any>;
      if (this.patient.ssin && this.api.tokenId && transaction) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
              .then(hcp =>
                  this.api.fhc().Hubcontroller().getTransactionSetMessageUsingGET(this.hubEndPoint, this.api.keystoreId,
                      this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.patient.ssin,
                      transaction.ids.find(id => id.s==='LOCAL').sv, transaction.ids.find(id => id.s==='LOCAL').sl, transaction.ids.find(id => id.s==='LOCAL').value,
                      this.hubPackageId, this.breakTheGlassReason
                  )
              ).then(tranResp => {
                      if (tranResp) {
                          return tranResp;
                      } else {
                          return null;
                      }
                  }
              )
      } else {
          return Promise.resolve(null)
      }
  }

  _putHubTransactionSet(tsXML){
      console.log('---_putHubTransactionSet---');
      console.log(tsXML);
      console.log(this.patient);
      console.log(this.patient.ssin);
      console.log(this.api.tokenId);
      //putTransactionSetUsingPOST(
      // endpoint: string,
      // xFHCKeystoreId: string, xFHCTokenId: string, xFHCPassPhrase: string,
      // hcpLastName: string, hcpFirstName: string, hcpNihii: string, hcpSsin: string, hcpZip: string,
      // hubId: number,
      // patientSsin: string,
      // essage: string,
      // hubPackageId?: string, hubApplication?: string): Promise<models.PutTransactionSetResponse | any>;
      const myblob = new Blob([tsXML]);
      if (this.patient && this.patient.ssin && this.api.tokenId) {
          return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
              this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                  .then(hcp => this.api.fhc().Hubcontroller().putTransactionSetUsingPOST(this.hubEndPoint,
                      this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword,
                      hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip,
                      this.hubId,
                      this.patient.ssin,
                      myblob,
                      this.hubPackageId, this.hubApplication
                      )
                  ).then(putResp => {
                      if (putResp) {
                          return putResp;
                      } else {
                          return null;
                      }
                  }
              )
          )
      }else{
          return Promise.resolve(null)
      }
  }

  xmlHubListener() {
      this._putHubTransactionSet(document.getElementById('putHubXml').value).then(resp => {
          console.log('---response _putHubTransactionSet---');
          console.log(resp);
          this.set("tsResp", resp);
      })
  }

  _getTSfromFileAndPut(){
      //TODO: this is testing code, not for production
      const req = new XMLHttpRequest();

      req.onreadystatechange = function(event){
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
              const msSam = this.responseXML;
              const txtSam = new XMLSerializer().serializeToString(msSam.documentElement);
              const inputHidden = document.createElement("input");
              inputHidden.setAttribute('type', 'hidden');
              inputHidden.setAttribute('value', txtSam);
              inputHidden.setAttribute('id', 'putHubXml');
              document.body.appendChild(inputHidden);
              document.dispatchEvent( new Event("xmlHubUpdated",{bubbles:true,cancelable:false,composed: false}) )
          }
      };

      //req.open("GET", "http://www.figac.be/topaz_ms.xml", true);//"GET", "http://i-fab.be/ts_sam.xml", true);
      req.open("GET", "http://i-fab.be/ts_sam.xml", true);
      req.send(null);

  }

  _closeDialogs(){
      this.set('showSumehrContainer', false);
      this.$['hubDetailDialog'].close();
  }

  _hubDownload(e){
      this.dispatchEvent(new CustomEvent('hub-download', {}))
  }

  _localizeHcpType(type){
      return this.localize("cd-hcp-"+type, type, this.language)
  }

  selectedFiltersChanged(){
      this.set('hubTransactionListFiltered', _.get(this, 'hubTransactionList', []))
      this.selectedDocumentCategory ? this.set('hubTransactionListFiltered', _.get(this, 'hubTransactionListFiltered', []).filter(tr => _.get(tr, 'author.hcparties', []).find(hcp => _.get(hcp, 'cds', []).find(cd => _.get(cd, 'value', null) === _.get(this.selectedDocumentCategory, 'code', ""))))) : null
      this.selectedAuthor ? this.set('hubTransactionListFiltered', _.get(this, 'hubTransactionListFiltered', []).filter(tr => _.get(tr, 'author.hcparties', []).find(hcp => _.get(hcp, 'ids', []).find(id => _.get(id, 'value', null) === _.get(this.selectedAuthor, 'id', ""))))) : null
      this.selectedDocumentType ? this.set('hubTransactionListFiltered', _.get(this, 'hubTransactionListFiltered', []).filter(tr => _.get(tr, "desc", "") === _.get(this.selectedDocumentType, 'code', null))) : null
  }

  _getLabel(label){
      return _.get(label, this.language, label.en)
  }
}
customElements.define(HtPatHubDetail.is, HtPatHubDetail);