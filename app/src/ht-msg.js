/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import './elements/ht-msg/ht-msg-detail.js';

import './elements/ht-msg/ht-msg-menu.js';
import './elements/ht-msg/ht-msg-list.js';
import './elements/ht-msg/ht-msg-invoice.js';
import './elements/ht-msg/ht-msg-flatrate-invoice.js';
import './elements/ht-msg/ht-msg-flatrate-report.js';
import './elements/ht-msg/ht-msg-mycarenet.js';
import './elements/ht-msg/ht-msg-new.js';
import './elements/ht-msg/ht-msg-documents.js';
import './elements/ht-msg/ht-msg-document-detail.js';
import './elements/ht-msg/ht-msg-import-doc-dialog.js';
import './ht-upload-dialog.js';
import './styles/buttons-style.js';
import './styles/shared-styles.js';

import "@polymer/paper-icon-button/paper-icon-button"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "./elements/tk-localizer";
class HtMsg extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
<style include="shared-styles">
            :host {
                display: block;
                height: calc(100% - 20px);
                /*padding: 10px;*/
            }

            .container {
                width: 100%;
                height: calc(100vh - 64px - 20px);
                display:grid;
                grid-template-columns: 16% 84%;
                grid-template-rows: 100%;
                position: fixed;
                top: 64px;
                left: 0;
                bottom: 0;
                right: 0;
            }

            .sub-container {
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: 50% 50%;
                grid-template-rows: 100%;
                background-color: var(--app-background-color);
            }

            ht-msg-detail{
                padding: 16px;
                z-index: 0;
                transform: translateX(100vw);
                opacity: 0;
                transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
            }
            ht-msg-detail.selected {
                transform: none;
                opacity: 1;
                z-index: 10; /* else it's impossible to scroll in this box */
                overflow: hidden;
                display: flex;
                flex-direction: column;
                background-color: var(--app-background-color-light);
                padding: 0;
                transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);

                position: fixed;
                top: 72px;
                left: 16.5%;
                width: 83%;
                height: calc(100% - 91px);
            }

            ht-msg-document-detail{
                padding: 16px;
                z-index: 0;
                transform: translateX(100vw);
                opacity: 0;
                transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
            }
            ht-msg-document-detail.selected {
                transform: none;
                opacity: 1;
                z-index: 10; /* else it's impossible to scroll in this box */
                overflow: hidden;
                display: flex;
                flex-direction: column;
                border-left: 1px solid var(--app-background-color-dark);
                background-color: var(--app-background-color-light);
                padding: 0;
            }

            .display-left-menu{
                display:none;
                position:fixed;
                top: 50%;
                left: 0;
                z-index: 120;
                background: var(--app-background-color-dark);
                transform:translateY(-50%) rotate(0);
                border-radius:0 50% 50% 0;
                /*transition: .5s ease;*/
                box-shadow: var(--app-shadow-elevation-1);
            }
            .display-left-menu.open{
                left:50vw;
                border-radius: 0 50% 50% 0;
                transform: translateY(-50%);
            }

            paper-dialog {
                width: 40%;
                height: 40%;
            }


            .modalDialog {
                height: 300px;
                width: 600px;
            }

            ht-msg-list.selected {
                /*width: 152vw;*/
            }

            ht-msg-documents.selected {
                width: 152vw;
            }

            ht-msg-menu{
                z-index : 1;
            }

            ht-msg-invoice#invoicingForm {
                z-index : 10;
            }

            @media screen and (max-width:1025px){
                .container{
                    grid-template-columns: 0 40% 60%;

                }
                .container.expanded {
                    grid-template-columns: 20% 30% 50%;
                }
                .sub-container {
                    left: 0%;
                    grid-template-columns: 30% 71%;
                }
                ht-msg-menu{
                    display:none;
                    width: 50vw;
                    z-index: 150;
                }
                .container.expanded ht-msg-menu {
                    display: block;
                }
                .display-left-menu{
                    display:inherit;
                }

                #msg-flatrate-invoice,
                #msg-invoice,
                #msg-mycarenet {
                    width: 100vw;
                }

                ht-msg-list {
                    transition: all .5s ease-out;
                }

                ht-msg-list.selected {
                    /*height: calc(40vh - 24px);*/
                    /*width: initial;*/
                }

                ht-msg-documents {
                    transition: all .5s ease-out;
                }

                ht-msg-documents.selected {
                    height: calc(40vh - 24px);
                    width: initial;
                }

                ht-msg-detail {
                    padding: 0 16px;
                    z-index: 2;
                    width: 100vw;
                    height: calc(60vh - 32px);
                    bottom: 0;
                    position: fixed;
                    transform: translateY(100vh);
                    opacity: 0;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                }
                ht-msg-detail.selected {
                    transform: none;
                    opacity: 1;
                    border-top: 1px solid var(--app-background-color-darker);
                }

                ht-msg-document-detail {
                    padding: 0 16px;
                    z-index: 2;
                    width: 100vw;
                    height: calc(60vh - 32px);
                    bottom: 0;
                    position: fixed;
                    transform: translateY(100vh);
                    opacity: 0;
                    display: flex;
                    flex-direction: column;
                    box-sizing: border-box;
                }
                ht-msg-document-detail.selected {
                    transform: none;
                    opacity: 1;
                    border-top: 1px solid var(--app-background-color-darker);
                }

            }

            #msgDocuments {
                padding-left:10px;
            }

            #msg-list {
                z-index:2
            }

            #msg-detail {
                z-index:3
            }
        </style>

        <div class="container">
            <template is="dom-if" if="[[!leftMenuOpen]]">
                <paper-icon-button class="display-left-menu" icon="chevron-right" on-tap="_expandColumn"></paper-icon-button>
            </template>
            <template is="dom-if" if="[[leftMenuOpen]]">
                <paper-icon-button class="display-left-menu open" icon="chevron-left" on-tap="_closeColumn"></paper-icon-button>
            </template>

            <ht-msg-menu
                id="msg-menu"
                api="[[api]]"
                i18n="[[i18n]]"
                language="[[language]]"
                resources="[[resources]]"
                user="[[user]]"
                group="invoicing"
                on-selection-change="handleMenuChange"
            ></ht-msg-menu>

            <template is="dom-if" if="[[isEHealthBox]]">
                <div class="sub-container">

                    <ht-msg-list
                        id="msg-list"
                        api="[[api]]"
                        i18n="[[i18n]]"
                        language="[[language]]"
                        resources="[[resources]]"
                        user="[[user]]"
                        menu-selection-object="[[selectList]]"
                        on-selected-message-changed="handleMessageChange"
                        on-message-moved-to-assigned-folder="_handleMessageMovedToAssignedFolder"
                        on-update-menu-folders-totals="callPersonalInboxUpdateMenuFoldersTotals"
                        on-create-new-msg="_triggerCreateNewMessage"
                        on-reply-to-or-forward-message="_triggerReplyToOrForwardMessage"
                        on-user-got-updated="_userGotUpdatedFromList"
                        class$="[[_selectedElem(selectedMessage)]]"
                    ></ht-msg-list>


                    <ht-msg-detail
                        id="msg-detail"
                        api="[[api]]"
                        i18n="[[i18n]]"
                        language="[[language]]"
                        resources="[[resources]]"
                        user="[[user]]"
                        credentials="[[credentials]]"
                        selected-message="[[selectedMessage]]"
                        on-carry-out-action="_carryOutActionFromDetailComponent"
                        on-msg-detail-closed="_triggerGridResize"
                        on-item-delete="handleRefreshlist"
                        on-item-restore="handleRefreshlist"
                        on-user-got-updated="_userGotUpdatedFromDetail"
                        class$="[[_selectedElem(selectedMessage)]]"
                    ></ht-msg-detail>

                </div>
            </template>

<template is="dom-if" if="[[documentLayout]]">
                <div class="sub-container">
                    <ht-msg-documents id="doc-list" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]"
                        menu-selection-object="[[selectList]]"
                        on-selection-messages-change="handleMessageChange"
                        on-open-upload-dialog="_openUploadDialog"
                        on-show-error-message="showErrorMessage"
                        on-initialize-doc-counter="callInitializeDocCounter"
                        class$="[[_selectedElem(selectedMessage)]]"
                    ></ht-msg-documents>
                    <ht-msg-document-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" credentials="[[credentials]]"
                        selected-message="[[selectedMessage]]"
                        patient-list="[[patientList]]"
                        on-msg-detail-closed="_triggerGridDocResize"
                        on-item-delete="handleRefreshlist"
                        on-item-restore="handleRefreshlist"
                        on-document-update="_updateDoc"
                        on-document-unassign="_unassignDoc"
                        on-document-delete="_deleteDoc"
                        on-show-error-message="showErrorMessage"
                        class$="[[_selectedElem(selectedMessage)]]"
                    ></ht-msg-document-detail>
                </div>
            </template>

            <template is="dom-if" if="[[invoicesLayout]]">
                    <ht-msg-invoice id="msg-invoice" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                                 user="[[user]]"
                                 select-list="[[selectList]]"
                                 invoices-status="[[invoicesStatus]]"
                                 on-selection-messages-change="handleMessageChange"
                                 on-initialize-batch-counter="callInitializeBatchCounter"></ht-msg-invoice>
            </template>

            <template is="dom-if" if="[[flatrateinvoicesLayout]]">
                <ht-msg-flatrate-invoice
                    id="msg-flatrate-invoice"
                    api="[[api]]"
                    i18n="[[i18n]]"
                    language="[[language]]"
                    resources="[[resources]]"
                    user="[[user]]"
                    flatrate-menu-section="[[flatrateMenuSection]]"
                    on-selection-messages-change="handleMessageChange"
                    on-initialize-batch-counter-j20="callInitializeBatchCounterJ20"
                    on-do-route="_doRouteFlatRate"
                ></ht-msg-flatrate-invoice>
            </template>

            <template is="dom-if" if="[[flatrateinvoicesReportLayout]]">
                <ht-msg-flatrate-report
                        id="msg-flatrate-report"
                        api="[[api]]"
                        i18n="[[i18n]]"
                        language="[[language]]"
                        resources="[[resources]]"
                        user="[[user]]"
                        flatrate-menu-section="[[flatrateMenuSection]]"
                ></ht-msg-flatrate-report>
            </template>

            <template is="dom-if" if="[[mycarenetLayout]]">
                <ht-msg-mycarenet id="msg-mycarenet" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"
                                  user="[[user]]"
                                  select-list="[[selectList]]">

                </ht-msg-mycarenet>
            </template>

        </div>

        <ht-msg-new
                id="new-msg"
                api="[[api]]"
                i18n="[[i18n]]"
                language="[[language]]"
                resources="[[resources]]"
                user="[[user]]"
                credentials="[[credentials]]">
        </ht-msg-new>


        <ht-upload-dialog
                id="upload-dialog"
                api="[[api]]"
                i18n="[[i18n]]"
                user="[[user]]"
                language="[[language]]"
                resources="[[resources]]"
                on-save-documents="_saveDocuments"
                on-error-message="_handleError"
                on-post-process="_postProcess">
        </ht-upload-dialog>

`;
  }

  static get is() {
      return 'ht-msg'
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
            credentials:{
                type: Object,
                noReset: true
            },
            selectList: {
                type: Object
            },
            invoicesLayout: {
                type: Boolean,
                value: false
            },
            documentLayout: {
                type: Boolean,
                value: false
            },
            flatrateinvoicesLayout: {
                type: Boolean,
                value: false
            },
            flatrateinvoicesReportLayout: {
                type: Boolean,
                value: false
            },
            invoicesStatus:{
                type: String,
                value: null
            },
            flatrateMenuSection:{
                type: String,
                value: null
            },
            mycarenetLayout:{
                type: Boolean,
                value : false
            },
            isEHealthBox:{
                type: Boolean,
                value : false
            },
            leftMenuOpen:{
                type: Boolean,
                value: false
            },
            ehealthSession: {
                type: Boolean,
                value: false
            },
            currentHcp: {
                type: Object,
                value: {}
            },
            parentHcp: {
                type: Object,
                value: {}
            },
            isAMedicalHouse: {
                type: Boolean,
                value: false
            },
            isParentAMedicalHouse: {
                type: Boolean,
                value: false
            },
            medicalHouseBillingTypeIsFlatRate: {
                type: Boolean,
                value: false
            },
            forceRefresh: {
                type: Boolean,
                value: false
            },
            patientList: {
                type: Array,
                value: []
            }
        }
    }

    static get observers() {
        return [
            '_setIsConnectedToEhbox(api.tokenId)',
            '_getCurrentAndParentHcps(user)',
            '_forceRefreshList(forceRefresh)'
        ];
    }

    constructor() {
        super()
    }

    reset() {
        const props = HtMsg.properties
        Object.keys(props).forEach(k => { if (!props[k].noReset) { this.set(k, (typeof props[k].value === 'function' ? props[k].value() : (props[k].value || null))) }})
    }

    ready() {
        super.ready()
        this._triggerGotoInbox()
        //this.$['doc-list'].
    }

    _triggerGotoInbox() {
        this.$['msg-menu'].dispatchEvent(new CustomEvent('selection-change',{detail:{selection:{item:"personalInbox", folder:"inbox"}}}))
    }

    _setIsConnectedToEhbox() {
        this.set("ehealthSession", !!this.api.tokenId)
    }

    _selectedElem(e) {
        return (e) ? 'selected' : ''
    }

    handleMenuChange(e) {

        const selectedItem = _.trim(_.get(e,"detail.selection.item",""))
        const selectedFolder = _.trim(_.get(e,"detail.selection.folder",""))
        const selectedStatus = _.trim(_.get(e,"detail.selection.status",""))
        const availableLayouts = ["invoicesLayout","documentLayout","flatrateinvoicesLayout","flatrateinvoicesReportLayout","mycarenetLayout","isEHealthBox"]

        availableLayouts.map(i=>this.set(i,false))
        console.log('selectedItem', selectedItem)
        if (selectedItem === 'e_invOut') {
            this.set('invoicesLayout', true)
            this.set('invoicesStatus', selectedStatus)
            setTimeout(() =>{ this.shadowRoot.querySelector("#msg-invoice").reset(); this.shadowRoot.querySelector("#msg-invoice").getMessage(); },0)
        } else if (selectedItem === 'e_flatrateinvOut') {
            this.set('flatrateinvoicesLayout', true)
            this.set('flatrateMenuSection', selectedStatus)
        } else if (selectedItem === 'e_flatraterptOut' ){
            this.set('flatrateinvoicesReportLayout', true);
            this.set('flatrateMenuSection', selectedStatus)
        } else if (selectedItem === 'documentBox') {
            this.set('documentLayout',true)
        } else {
            this.set('mycarenetLayout', !!(selectedFolder === "mycarenet"))
            this.set('isEHealthBox', !(selectedFolder === "mycarenet"))
            if(selectedFolder === "mycarenet") setTimeout(() => this.shadowRoot.querySelector("#msg-mycarenet").refresh(),0)
        }
        console.log('flatrateinvoicesReportLayout', this.flatrateinvoicesReportLayout)
        this.set('selectList', _.get(e,"detail",""))
        this._closeColumn(e)
    }

    handleMessageChange(e) {
        let selectedMessage = _.get(e,"detail.selection.item",null);
        if (selectedMessage && selectedMessage.patientId) {
            if (!(this.patientList.find(p => p.id === selectedMessage.patientId)))
                this.patientList.push({
                    id: selectedMessage.patientId,
                    name: selectedMessage.patientName,
                    ssin: selectedMessage.patientSsin
                })
        }
        this.set('selectedMessage', selectedMessage)
        this._triggerGridResize()
        this._triggerGridDocResize()
    }

    _triggerGridResize() {
        const msgList = this.shadowRoot.querySelector('#msg-list')|| false
        return typeof _.get(msgList,"_triggerGridResize","") === "function" && msgList._triggerGridResize()
    }

    _triggerGridDocResize() {
        const msgDoc = this.shadowRoot.querySelector('#doc-list')|| false
        return msgDoc && msgDoc._triggerGridResize()
    }

    handleRefreshlist(e) {
        new Promise(Ok =>{
            let selectList = this.selectList
            this.set('selectList', e.detail);
            Ok(selectList);
        }).then(selectList=> this.set('selectList', selectList))
    }

    _expandColumn(e) {
        this.set('leftMenuOpen',true)
        this.root.querySelector('.container').classList.add('expanded');
    }

    _closeColumn(e) {
        this.set('leftMenuOpen',false)
        this.root.querySelector('.container').classList.remove('expanded');
    }

    _triggerCreateNewMessage() {
        return !!_.get(this,"ehealthSession",false) ? this.$['new-msg'].open() : false
    }

    _triggerReplyToOrForwardMessage(e) {
        return !!_.get(this,"ehealthSession",false) ? this.$['new-msg'].open(_.get(e,"detail",null)) : false
    }

    callInitializeDocCounter(e){
        this.shadowRoot.querySelector("#msg-menu").initializeDocCounter(e)
    }

    callInitializeBatchCounter(e){
        this.shadowRoot.querySelector("#msg-menu").initializeBatchCounter(e)
    }

    callInitializeBatchCounterJ20(e){
        this.shadowRoot.querySelector("#msg-menu").initializeBatchCounterJ20(e)
    }

    callPersonalInboxUpdateMenuFoldersTotals(e){
        this.shadowRoot.querySelector("#msg-menu") && typeof _.get(this.shadowRoot.querySelector("#msg-menu"), "updatePersonalInboxMenuFoldersTotals", false) === "function" && this.shadowRoot.querySelector("#msg-menu").updatePersonalInboxMenuFoldersTotals(e)
    }

    _doRouteFlatRate(e){
        this.handleMenuChange({ detail: e.detail })
        _.get(this, "$['msg-menu'].shadowRoot", false)
        && typeof _.get(this, "$['msg-menu'].shadowRoot.querySelectorAll", "") === "function"
        && _.get(this, "$['msg-menu'].shadowRoot", false).querySelectorAll("[data-status='" + _.get(e, "detail.selection.status", "") + "']")
        && _.map(_.get(this, "$['msg-menu'].shadowRoot", false).querySelectorAll("[data-status='" + _.get(e, "detail.selection.status", "") + "']"),e=>{ try{e.click()}catch(e){}})
    }

    showErrorMessage(e) {
        // @todo: create a unique component to show errors
        this.shadowRoot.querySelector("#upload-dialog").showErrorMessage(e);
    }

    _updateDoc(e) {
        this.shadowRoot.querySelector('#doc-list').updateDoc(e)
    }

    _unassignDoc(e) {
        this.shadowRoot.querySelector('#doc-list').unassignDoc(e)
    }

    _deleteDoc(e) {
        this.shadowRoot.querySelector('#doc-list').deleteDoc(e)
    }

    _getCurrentAndParentHcps(user) {

        const userId = _.trim(_.get(user,"id",""))
        const userHealthcarePartyId = _.trim(_.get(user,"healthcarePartyId",""))
        if(!userId || !userHealthcarePartyId) return;

        this.api.hcparty().getHealthcareParty(userHealthcarePartyId)
            .then(currentHcp => {
                this.set("currentHcp",currentHcp)
                this.set("isAMedicalHouse",_.trim(_.get(currentHcp, "type", "")).toLowerCase() === 'medicalhouse')
                this.set("medicalHouseBillingTypeIsFlatRate",_.trim(_.get(currentHcp, "billingType", "")).toLowerCase() === 'flatrate')
                return currentHcp
            })
            .then(currentHcp => !_.trim(_.get(currentHcp, "parentId", "")) ?
                false :
                this.api.hcparty().getHealthcareParty(_.trim(_.get(currentHcp, "parentId", "")))
                    .then(parentHcp => {
                        this.set("parentHcp",parentHcp)
                        this.set("isParentAMedicalHouse",_.trim(_.get(parentHcp, "type", "")).toLowerCase() === 'medicalhouse')
                    })
            )
            .catch((e)=>console.log("ERROR with _getCurrentAndParentHcps:", e))
            .finally(()=> {
                const dataToAssign = {currentHcp:this.currentHcp, isAMedicalHouse:this.isAMedicalHouse, medicalHouseBillingTypeIsFlatRate:this.medicalHouseBillingTypeIsFlatRate, parentHcp:this.parentHcp, isParentAMedicalHouse:this.isParentAMedicalHouse}
                this.shadowRoot.querySelector("#msg-menu") && typeof _.get(this.shadowRoot.querySelector("#msg-menu"), "assignResolvedObjects", false) === "function" && this.shadowRoot.querySelector("#msg-menu").assignResolvedObjects(dataToAssign)
                this.shadowRoot.querySelector("#msg-list") && typeof _.get(this.shadowRoot.querySelector("#msg-list"), "assignResolvedObjects", false) === "function" && this.shadowRoot.querySelector("#msg-list").assignResolvedObjects(dataToAssign)
                this.shadowRoot.querySelector("#msg-detail") && typeof _.get(this.shadowRoot.querySelector("#msg-detail"), "assignResolvedObjects", false) === "function" && this.shadowRoot.querySelector("#msg-detail").assignResolvedObjects(dataToAssign)
            })

    }

    _carryOutActionFromDetailComponent(e) {
        const actionToTake = _.trim(_.get(e,"detail.action",""))
        const givenMessage = _.trim(_.get(e,"detail.message.id","")) ? _.get(e,"detail.message",{}) : {}
        const additionalParameters = _.get(e,"detail.additionalParameters",{})
        return !!actionToTake && !!givenMessage ? typeof _.get(this.shadowRoot.querySelector("#msg-list"), "takeActionForDetailMessage", false) === "function" && this.shadowRoot.querySelector("#msg-list").takeActionForDetailMessage(actionToTake,givenMessage,additionalParameters) : false
    }

    _forceRefreshList(forceRefresh) {
        return !!forceRefresh && this.shadowRoot.querySelector("#msg-list") && typeof _.get(this.shadowRoot.querySelector("#msg-list"), "_triggerGetEHealthBoxDataForceRefreshFromWebWorker", false) === "function" ? this.shadowRoot.querySelector("#msg-list")._triggerGetEHealthBoxDataForceRefreshFromWebWorker() : false
    }

    _handleMessageMovedToAssignedFolder() {
        this.shadowRoot.querySelector("#msg-detail") && typeof _.get(this.shadowRoot.querySelector("#msg-detail"), "_messageGotMovedToAssignedFolder", false) === "function" && this.shadowRoot.querySelector("#msg-detail")._messageGotMovedToAssignedFolder()
    }

    _openUploadDialog() {
        this.shadowRoot.querySelector("#upload-dialog").open()
    }

    _saveDocuments(e) {
        this.shadowRoot.querySelector("#upload-dialog").defaultSaveDocuments(e);
    }

    _postProcess() {
        this.shadowRoot.querySelector("#upload-dialog").close();
        this.shadowRoot.querySelector('#doc-list')._refresh();
    }

    _handleError(e) {
        this.shadowRoot.querySelector("#upload-dialog").showErrorMessage(e);
    }

    _userGotUpdatedFromDetail(e) {
        const updatedUser = _.get(e,"detail.updatedUser",{})
        return !!_.size(updatedUser) ? typeof _.get(this.shadowRoot.querySelector("#msg-list"), "_doUpdateUser", false) === "function" && this.shadowRoot.querySelector("#msg-list")._doUpdateUser(updatedUser) : false
    }

    _userGotUpdatedFromList(e) {
        const updatedUser = _.get(e,"detail.updatedUser",{})
        return !!_.size(updatedUser) ? typeof _.get(this.shadowRoot.querySelector("#msg-detail"), "_doUpdateUser", false) === "function" && this.shadowRoot.querySelector("#msg-detail")._doUpdateUser(updatedUser) : false
    }

}

customElements.define(HtMsg.is, HtMsg)
