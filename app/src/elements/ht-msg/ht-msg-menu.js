/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../filter-panel/filter-panel.js';

import '../collapse-button/collapse-button.js';
import '../icons/icure-icons.js';
import '../../styles/icd-styles.js';
import '../dynamic-form/entity-selector.js';
import '../dynamic-form/health-problem-selector.js';
import '../ht-spinner/ht-spinner.js';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-icon-button/paper-icon-button"
import "@polymer/paper-item/paper-item"
import "@polymer/paper-listbox/paper-listbox"

import _ from 'lodash/lodash';
import styx from '../../../scripts/styx';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtMsgMenu extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="iron-flex iron-flex-alignment"></style>

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
                padding: 0;
                display:flex;
                flex-flow: column nowrap;
                align-items: center;
                height: 100%;
                width: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                z-index: 25;
            }

            .has-unread{
                font-weight:bold;
            }

            .unreadNumber{
                display: block;
                padding: 2px 5px;
                font-size: 11px;
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                border-radius: 10px;
                line-height: 11px;
                margin-left: 8px;
                max-width: 30px;
            }

            paper-listbox{
                background:transparent;
                padding: 0;
            }

            paper-item{
                background:transparent;
                outline:0;
                height: 32px;
                align-items: center;
                --paper-item-selected:{

                };

                --paper-item-disabled-color:{
                    color: red;
                };

                --paper-item-focused: {
                    background:transparent;
                };
                --paper-item-focused-before: {
                    background:transparent;
                };

            }

            paper-listbox {
                outline:0;
                --paper-listbox-selected-item: {
                    color:var(--app-text-color-light);
                    background:var(--app-primary-color);
                };
                --paper-listbox-disabled-color:{
                    color: red;
                };
            }

            collapse-button {
                outline:0;
                width: 100%;
                user-select: none;
                --paper-listbox-selected-item: {
                    color:var(--app-text-color-light);
                    background:var(--app-primar y-color);
                };
                margin-bottom: 15px;
                transition: var(--transition_-_transition);
                background: var(--app-background-color-dark);
            }
            collapse-button paper-item {
                font-size: 13px;
                font-weight: bold;
            }

            collapse-button[opened] {
                background: white;
            }

            collapse-button .menu-item.iron-selected,
            collapse-button paper-item.iron-selected{
\t\t\t\t@apply --padding-menu-item;
\t\t\t\tcolor:var(--app-text-color-light);
\t\t\t\tbackground:var(--app-primary-color);
\t\t\t\t@apply --text-shadow;
\t\t\t}

            collapse-button paper-item.iron-selected{
                background: var(--app-background-color-dark);
                color: black;
                text-shadow: none;
            }
            collapse-button paper-item.opened{
                background: #fff;
            }

            collapse-button paper-item.iron-selected iron-icon{
                color: var(--app-secondary-color) !important;
                opacity: 1;
            }

            collapse-button paper-item.iron-selected {
                color: white;
                background: var(--app-primary-color);
            }

\t\t\tcollapse-button paper-item iron-icon, paper-item iron-icon{
\t\t\t\theight: 20px;
\t\t\t\twidth: 20px;
\t\t\t\tpadding:4px;
\t\t\t\tcolor: var(--app-text-color);
\t\t\t\topacity: .5;
\t\t\t}

            collapse-button paper-icon-button{
                min-width: 40px;
                min-height: 40px;
            }

            .opened{
                color:var(--app-text-color);
                background:var(--app-text-color-light);
                border-radius:2px 2px 0 0;

            }

            .sublist{
                background:var(--app-light-color);
                margin:0 0 8px -30px;
                padding:0;
                padding-bottom:4px;
                border-radius:0 0 2px 2px;
            }

            paper-item.list-info {
                font-weight: lighter;
                font-style: italic;
                height:48px;
            }

\t\t\t.menu-item{
\t\t\t\t@apply --padding-menu-item;
\t\t\t\theight:48px;
\t\t\t\t@apply --paper-font-button;
\t\t\t\ttext-transform: inherit;
\t\t\t\tjustify-content: space-between;
\t\t\t\tcursor: pointer;
\t\t\t\t@apply --transition;
\t\t\t}

\t\t\t.sublist .menu-item {
\t\t\t\tfont-size: 13px;
\t\t\t\tmin-height:32px;
\t\t\t\theight:32px;
\t\t\t\tpadding-left: 8px;
\t\t\t}
\t\t\t.sublist .menu-item.flex-start {
                justify-content: flex-start;
            }

            .menu-item:hover{
                /*background: var(--app-dark-color-faded);*/
                @apply --transition;
            }

            .menu-item .iron-selected{
                background:var(--app-primary-color);
            }

            .menu-item .opened{
                background:white!important;
                width:80%;
                border-radius:2px;
            }

            .menu-item-icon--selected{
                width:0;
            }

            .opened .menu-item-icon--selected{
                width: 18px;
            }

            .opened > .menu-item-icon{
                transform: scaleY(-1);
            }

            paper-item.menu-item.opened {
                /*@apply --padding-right-left-16;*/
            }

            .submenu-item{
                cursor:pointer;
            }

            .submenu-item.iron-selected{
                background:var(--app-primary-color-light);
                color:var(--app-text-color-light);
                @apply --text-shadow;
            }

            .submenu-item-icon{
                height:14px;
                width:14px;
                color:var(--app-text-color-light);
                margin-right:10px;
            }

            vaadin-grid.material {
                outline: 0!important;
                font-family: Roboto, sans-serif;
                background:rgba(0,0,0,0);
                border:none;
                --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                --vaadin-grid-cell: {
                    padding: 8px;
                };

                --vaadin-grid-header-cell: {
                    height: 48px;
                    padding:11.2px;
                    color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                    font-size: 12px;
                    background:rgba(0,0,0,0);
                    border-top:0;
                };

                --vaadin-grid-body-cell: {
                    height: 48px;
                    color: rgba(0, 0, 0, var(--dark-primary-opacity));
                    font-size: 13px;
                };

                --vaadin-grid-body-row-hover-cell: {
                    background-color: var(--paper-grey-200);
                };

                --vaadin-grid-body-row-selected-cell: {
                    background-color: var(--paper-grey-100);
                };

                --vaadin-grid-focused-cell: {
                    box-shadow: none;
                    font-weight: bold;
                };

            }
            vaadin-grid.material .cell {
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 56px;
            }

            vaadin-grid.material .cell.last {
                padding-right: 24px;
            }

            vaadin-grid.material .cell.numeric {
                text-align: right;
            }

            vaadin-grid.material paper-checkbox {
                --primary-color: var(--paper-indigo-500);
                margin: 0 24px;
            }

            vaadin-grid.material vaadin-grid-sorter {
                --vaadin-grid-sorter-arrow: {
                    display: none !important;
                };
            }

            vaadin-grid.material vaadin-grid-sorter .cell {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            vaadin-grid.material vaadin-grid-sorter iron-icon {
                transform: scale(0.8);
            }

            vaadin-grid.material vaadin-grid-sorter:not([direction]) iron-icon {
                color: rgba(0, 0, 0, var(--dark-disabled-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction] {
                color: rgba(0, 0, 0, var(--dark-primary-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction=desc] iron-icon {
                transform: scale(0.8) rotate(180deg);
            }


            vaadin-grid.material::slotted(div){
                outline:0 !important;
            }

            paper-checkbox{
                --paper-checkbox-unchecked-color: var(--app-text-color);
                --paper-checkbox-label-color: var(--app-text-color);
                --paper-checkbox-checked-color: var(--app-secondary-color);
                --paper-checkbox-checked-ink-color: var(--app-secondary-color-dark);
            }

            paper-icon-button {
                transition: .5s ease;
            }

            .trash{
                align-self: flex-start;
                width:100%;
                padding: 0 8px;
                box-sizing: border-box;
            }
            .trash.selected {
                background: var(--app-primary-color);
                color: white;
            }
            .trash.selected iron-icon {
                color: var(--app-secondary-color);
            }

            paper-item{
                cursor: pointer;
                justify-content: space-between;
                user-select: none;
            }
            .menu-trigger{
                padding: 0 8px;
            }

            .batchNumber{
                padding: 1px 5px;
                font-size: 11px;
                color: var(--app-text-color-light);
                border-radius: 10px;
                min-height: 0;
                display: block;
                line-height: 16px;
                height: 15px;
            }

            .batchOrange, .batchPending, .batchToBeSend{
                background-color: var(--paper-orange-400);
            }

            .batchRejected, .batchRed, .batchToBeCorrected{
                background-color: var(--paper-red-400);
            }

            .batchBlue, .batchProcessed{
                background-color: var(--paper-blue-400);
            }

            .batchGreen, .batchAccepted{
                background-color: var(--paper-green-400);
            }

            .batchPurple, .batchArchived{
                background-color: var(--paper-purple-300);
            }

            .one-line-menu.list-title {
                max-width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
\t\t\t\toverflow: hidden;
\t\t\t\talign-items: center;
\t\t\t\tdisplay: flex;
\t\t\t\tflex-flow: row nowrap;
\t\t\t\tjustify-content: flex-start;
\t\t\t}

\t\t\t.one-line-menu.list-title > div {
\t\t\t\tmax-width: 100%;
\t\t\t\toverflow: hidden;
\t\t\t\ttext-overflow: ellipsis;
\t\t\t}

            #inbox {
                flex-direction: row;
            }

            .force-ellipsis {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            /* .box-txt.force-ellipsis {
                max-width: 60%;
            } */
            @media screen and (max-width: 1480px) {
                .inbox-txt.force-ellipsis {
                    max-width: 50%;
                }
                .unreadNumber {
                    max-width: 19% !important;
                }
            }
            .inbox-line.one-line-menu {
                width: 100%;
                justify-content: space-between;
            }

            ht-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 9999;
                transform: translate(-50% -50%);
                height: 42px;
                width: 42px;
            }

            #flatRateInvoicingListingBoxCollapse {

            }

            .menuHr {
                margin:15px 5px 15px 5px;
                border:0;
                border-top:2px dashed #cccccc;
            }

            .ehb_batchNumber.forceRight {
                position:absolute;
                right:4px;
            }

        </style>

        
        
        <div class="col-left">

            <template is="dom-if" if="[[showInbox()]]">
            <!-- PERSONAL mailbox -->
            <collapse-button id="inboxcollapse" opened>
<<<<<<< HEAD
				<paper-item id="inbox" slot="sublist-collapse-item" class="menu-trigger menu-item opened iron-selected" on-tap="_inboxTapped" elevation="">
					<div class="one-line-menu list-title inbox-line"><div><iron-icon icon="social:person" class="force-left"></iron-icon><span class="force-left force-ellipsis box-txt">[[localize('personalInbox','Personal inbox',language)]]</span></div></div>
					<paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
				</paper-item>
				<paper-listbox id="inboxlist" class="menu-content sublist" selected="{{inboxSelectionIndex}}" selected-item="{{inboxSelectionItem}}" selectable="paper-item">
=======
                <paper-item id="inbox" slot="sublist-collapse-item" class="menu-trigger menu-item opened iron-selected" on-tap="_inboxTapped" elevation="">
                    <div class="one-line-menu list-title inbox-line"><div><iron-icon icon="social:person" class="force-left"></iron-icon><span class="force-left force-ellipsis box-txt">[[localize('personalInbox','Personal inbox',language)]]</span></div></div>
                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                </paper-item>
                <paper-listbox id="inboxlist" class="menu-content sublist" selected="{{inboxSelectionIndex}}" selected-item="{{inboxSelectionItem}}" selectable="paper-item">
>>>>>>> 1f851e67b6dde6487331d01027bc6b8bf642ae64
                    <paper-item class="one-line-menu menu-item flex-start" data-folder="inbox"><iron-icon icon="icons:home"></iron-icon> [[localize('inb','Inbox',language)]] <span class="batchNumber ehb_batchNumber batchGreen forceRight">[[personalEHealthBoxTotalsByFolder.inbox]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" data-folder="sent"><iron-icon icon="icons:send"></iron-icon> [[localize('sen_mes','Sent messages',language)]] <span class="batchNumber ehb_batchNumber batchBlue forceRight">[[personalEHealthBoxTotalsByFolder.sent]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" data-folder="hidden"><iron-icon icon="icons:visibility-off"></iron-icon> [[localize('hidden_msgs','Hidden messages',language)]] <span class="batchNumber ehb_batchNumber batchOrange forceRight">[[personalEHealthBoxTotalsByFolder.hidden]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" data-folder="deleted"><iron-icon icon="icons:delete"></iron-icon> [[localize('deletedMessages','Deleted messages',language)]] <span class="batchNumber ehb_batchNumber batchRed forceRight">[[personalEHealthBoxTotalsByFolder.deleted]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" data-folder="assigned"><iron-icon icon="vaadin:clipboard-user"></iron-icon> [[localize('ehb.assignedMessages','Assigned messages',language)]] <span class="batchNumber ehb_batchNumber batchPurple forceRight">[[personalEHealthBoxTotalsByFolder.assigned]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" data-folder="mycarenet"><iron-icon icon="icons:account-balance"></iron-icon> [[localize('mycarenet','My Carenet',language)]]</paper-item>
                </paper-listbox>
            </collapse-button>



            <!-- SHARED mailbox -->
            <template is="dom-if" if="[[!isAMedicalHouse]]">
                <template is="dom-if" if="[[isParentAMedicalHouse]]">
                    <!--<div class="one-line-menu list-title inbox-line"><div><iron-icon icon="social:group" class="force-left"></iron-icon><span class="force-left force-ellipsis box-txt">[[localize('sharedInbox','Shared inbox',language)]]</span></div></div>-->
                </template>
            </template>



            <!-- Documents -->
            <collapse-button id="documentboxcollapse">
                <paper-item id="documentBox" slot="sublist-collapse-item" class="menu-trigger menu-item" on-tap="_documentBoxTapped" elevation="">
                    <div class="one-line-menu list-title inbox-line"><div><iron-icon icon="editor:insert-drive-file" class="force-left"></iron-icon><span class="force-left force-ellipsis box-txt">[[localize('documents','Documents',language)]]</span></div></div>
                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                </paper-item>
                <paper-listbox id="documentboxlist" class="menu-content sublist" selected="{{documentBoxSelectionIndex}}" selected-item="{{documentBoxSelectionItem}}" selectable="paper-item">
                    <paper-item class="one-line-menu menu-item flex-start" data-folder="todealwith"><iron-icon icon="icons:cloud-download"></iron-icon> [[localize('documentsToDealWith','Documents to deal with',language)]]<span class="batchNumber ehb_batchNumber batchOrange forceRight">[[docCounter.toDealWith]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item flex-start" data-folder="dealtwith"><iron-icon icon="icons:cloud-done"></iron-icon> [[localize('documentsDealtWith','Documents dealt with',language)]]<span class="batchNumber ehb_batchNumber batchOrange forceRight">[[docCounter.archived]]</span></paper-item>
                </paper-listbox>
            </collapse-button>            
            </template>

            <template is="dom-if" if="[[showInvoicing()]]">
            <!-- Invoicing -->
            <collapse-button id="invoiceboxcollapse" opened="[[group]]">
                <paper-item id="invoicebox" slot="sublist-collapse-item" class="menu-trigger menu-item" on-tap="_invoiceboxTapped" elevation="">
                    <div class="one-line-menu list-title"><iron-icon icon="vaadin:invoice"></iron-icon><span class="force-left force-ellipsis box-txt">[[localize('serviceFeeInvoicing','Service fee invoicing',language)]]</span> <template is="dom-if" if="[[sendNumber]]"><span class="unreadNumber">[[sendNumber]]</span></template></div>
                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                </paper-item>
                <paper-listbox id="invoiceboxlist" class="menu-content sublist"  selected="{{invoiceSelectionIndex}}" selected-item="{{invoiceSelectionItem}}" selectable="paper-item">
                    <paper-item class="one-line-menu menu-item" id="e_invOut" data-status="toBeCorrected">[[localize('_e_inv_toBeCorrected','To be corrected',language)]] <span class="batchNumber batchToBeCorrected">[[batchCounter.toBeCorrected]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_invOut" data-status="toBeSend">[[localize('_e_inv_toBeSend','To be send',language)]] <span class="batchNumber batchToBeSend">[[batchCounter.toBeSend]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_invOut" data-status="process">[[localize('_e_inv_pro','Processing',language)]] <span class="batchNumber batchProcessed">[[batchCounter.processing]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_invOut" data-status="reject">[[localize('_e_inv_rej','Rejected',language)]] <span class="batchNumber batchRejected">[[batchCounter.rejected]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_invOut" data-status="accept">[[localize('_e_inv_acc','Accepted',language)]] <span class="batchNumber batchAccepted">[[batchCounter.accepted]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_invOut" data-status="archive">[[localize('_e_inv_arc','Archived',language)]] <span class="batchNumber batchArchived">[[batchCounter.archived]]</span></paper-item>
                </paper-listbox>
            </collapse-button>

            <!-- Flatrate invoicing as user (via parent hcp id)-->
            <template is="dom-if" if="[[!isAMedicalHouse]]">
                <template is="dom-if" if="[[isParentAMedicalHouse]]">
                    <template is="dom-if" if="[[medicalHouseBillingTypeIsFlatRate]]">
                        <collapse-button id="flatRateInvoicingListingBoxCollapse">
                            <paper-item id="flatRateInvoicingListingBox2" slot="sublist-collapse-item" class="menu-trigger menu-item" on-tap="_flatRateInvoivingBox2Tapped" elevation="">
                                <div class="one-line-menu list-title"><iron-icon icon="accessibility"></iron-icon><span class="force-left force-ellipsis box-txt">[[localize('flatrateInvoicing','Facturation au forfait',language)]]</span></div>
                                <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                            </paper-item>
                            <paper-listbox id="flatRateInvoicingListingBoxList" class="menu-content sublist"  selected="{{flatRateInvoicingSelectionIndex}}" selected-item="{{flatRateInvoicingSelectionItem}}" selectable="paper-item">
                                <paper-item class="one-line-menu menu-item" id="e_flatraterptOut" data-status="rpt"><div class="one-line-menu list-title"><iron-icon icon="assignment-late"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('_e_flatrateinv_report','Report',language)]]</span></div></paper-item>
                            </paper-listbox>
                        </collapse-button>
                    </template>
                </template>
            </template>



            <!-- Flatrate invoicing -->
            <template is="dom-if" if="[[isAMedicalHouse]]">
                <template is="dom-if" if="[[medicalHouseBillingTypeIsFlatRate]]">
                    <collapse-button id="flatRateInvoicingListingBoxCollapse">
                        <paper-item id="flatRateInvoicingListingBox" slot="sublist-collapse-item" class="menu-trigger menu-item" on-tap="_flatRateInvoivingBoxTapped" elevation="">
                    <div class="one-line-menu list-title"><iron-icon icon="accessibility"></iron-icon><span class="force-left force-ellipsis box-txt">[[localize('flatrateInvoicing','Facturation au forfait',language)]]</span></div>
                    <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                </paper-item>
                    <paper-listbox id="flatRateInvoicingListingBoxList" class="menu-content sublist"  selected="{{flatRateInvoicingSelectionIndex}}" selected-item="{{flatRateInvoicingSelectionItem}}" selectable="paper-item">
                    <paper-item class="one-line-menu menu-item" id="e_flatraterptOut" data-status="rpt"><div class="one-line-menu list-title"><iron-icon icon="assignment-late"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('_e_flatrateinv_report','Report',language)]]</span></div></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j3"><div class="one-line-menu list-title"><iron-icon icon="view-headline"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('_e_flatrateinv_listing','Export listing',language)]]</span></div></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="archivej3"><div class="one-line-menu list-title"><iron-icon icon="markunread-mailbox"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('_e_flatrateinv_archives_listing','Archives listing',language)]]</span></div></paper-item>

                    <hr class="menuHr"/>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_toBeCorrected"><div class="one-line-menu list-title"><iron-icon icon="error"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_toBeCorrected','To be corrected',language)]]</span></div> <span class="batchNumber j20_batchNumber batchToBeCorrected">[[j20_batchCounter.error]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_toBeSend"><div class="one-line-menu list-title"><iron-icon icon="send"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_toBeSend','To be send',language)]]</span></div> <!--<span class="batchNumber j20_batchNumber batchToBeSend">[[j20_batchCounter.xxx]]</span>--><span class="batchNumber j20_batchNumber batchToBeSend">+</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_process"><div class="one-line-menu list-title"><iron-icon icon="cached"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_process','Processing',language)]]</span></div> <span class="batchNumber j20_batchNumber batchProcessed">[[j20_batchCounter.pending]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_reject"><div class="one-line-menu list-title"><iron-icon icon="cancel"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_reject','Rejected',language)]]</span></div> <span class="batchNumber j20_batchNumber batchRejected">[[j20_batchCounter.rejected]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_partiallyAccepted"><div class="one-line-menu list-title"><iron-icon icon="settings-backup-restore"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_partiallyAccepted','Partially accepted batches',language)]]</span></div> <span class="batchNumber j20_batchNumber batchToBeSend">[[j20_batchCounter.partiallyAccepted]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_accept"><div class="one-line-menu list-title"><iron-icon icon="check-circle"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_accept','Accepted',language)]]</span></div> <span class="batchNumber j20_batchNumber batchAccepted">[[j20_batchCounter.fullyAccepted]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_archive"><div class="one-line-menu list-title"><iron-icon icon="markunread-mailbox"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_archive','Archived',language)]]</span></div> <span class="batchNumber j20_batchNumber batchArchived">[[j20_batchCounter.archived]]</span></paper-item>
                    <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_reset"><div class="one-line-menu list-title"><iron-icon icon="error"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_reset','Reset',language)]]</span></div> <span class="batchNumber j20_batchNumber batchRed">[[j20_batchCounter.reset]]</span></paper-item>

                </paper-listbox>
                    </collapse-button>
                </template>
            </template>
            </template>

            <!-- Electronic flatrate invoicing -->
            <template is="dom-if" if="[[isAMedicalHouse]]">
                <template is="dom-if" if="[[medicalHouseBillingTypeIsFlatRate]]">
                    <collapse-button id="flatRateInvoicingListingBoxCollapse">
                        <paper-item id="flatRateInvoicingListingBox" slot="sublist-collapse-item" class="menu-trigger menu-item" on-tap="_flatRateInvoivingBoxTapped" elevation="">
                            <div class="one-line-menu list-title"><iron-icon icon="accessibility"></iron-icon><span class="force-left force-ellipsis box-txt">[[localize('electronicFlatrateInvoicing','Facturation électronique du forfait',language)]]</span></div>
                            <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" hover="none" on-tap="toggleMenu"></paper-icon-button>
                        </paper-item>
                        <paper-listbox id="flatRateInvoicingListingBoxList" class="menu-content sublist"  selected="{{flatRateInvoicingSelectionIndex}}" selected-item="{{flatRateInvoicingSelectionItem}}" selectable="paper-item">
                            <paper-item class="one-line-menu menu-item" id="e_memberData" data-status="mbd"><div class="one-line-menu list-title"><iron-icon icon="assignment-late"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('_e_memberData','Member data',language)]]</span></div></paper-item>

                            <hr class="menuHr"/>
                            <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_toBeCorrected"><div class="one-line-menu list-title"><iron-icon icon="error"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_toBeCorrected','To be corrected',language)]]</span></div> <span class="batchNumber j20_batchNumber batchToBeCorrected">[[j20_batchCounter.error]]</span></paper-item>
                            <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_toBeSend"><div class="one-line-menu list-title"><iron-icon icon="send"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_toBeSend','To be send',language)]]</span></div> <!--<span class="batchNumber j20_batchNumber batchToBeSend">[[j20_batchCounter.xxx]]</span>--><span class="batchNumber j20_batchNumber batchToBeSend">+</span></paper-item>
                            <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_process"><div class="one-line-menu list-title"><iron-icon icon="cached"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_process','Processing',language)]]</span></div> <span class="batchNumber j20_batchNumber batchProcessed">[[j20_batchCounter.pending]]</span></paper-item>
                            <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_reject"><div class="one-line-menu list-title"><iron-icon icon="cancel"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_reject','Rejected',language)]]</span></div> <span class="batchNumber j20_batchNumber batchRejected">[[j20_batchCounter.rejected]]</span></paper-item>
                            <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_partiallyAccepted"><div class="one-line-menu list-title"><iron-icon icon="settings-backup-restore"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_partiallyAccepted','Partially accepted batches',language)]]</span></div> <span class="batchNumber j20_batchNumber batchToBeSend">[[j20_batchCounter.partiallyAccepted]]</span></paper-item>
                            <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_accept"><div class="one-line-menu list-title"><iron-icon icon="check-circle"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_accept','Accepted',language)]]</span></div> <span class="batchNumber j20_batchNumber batchAccepted">[[j20_batchCounter.fullyAccepted]]</span></paper-item>
                            <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_archive"><div class="one-line-menu list-title"><iron-icon icon="markunread-mailbox"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_archive','Archived',language)]]</span></div> <span class="batchNumber j20_batchNumber batchArchived">[[j20_batchCounter.archived]]</span></paper-item>
                            <paper-item class="one-line-menu menu-item" id="e_flatrateinvOut" data-status="j20_reset"><div class="one-line-menu list-title"><iron-icon icon="error"></iron-icon> <span class="force-left force-ellipsis box-txt">[[localize('j20_reset','Reset',language)]]</span></div> <span class="batchNumber j20_batchNumber batchRed">[[j20_batchCounter.reset]]</span></paper-item>

                        </paper-listbox>
                    </collapse-button>
                </template>
            </template>



        </div>
`;
  }

  static get is() {
      return 'ht-msg-menu';
  }

<<<<<<< HEAD
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
          selectedContactItems: {
              type: Array,
              value: () => []
          },
          i18n: {
              type: Object,
              noReset: true
          },
          docCounter: {
              type: Object,
              value: () => ({
                  toDealWith: 0,
                  archived: 0
              })
          },
          batchCounter: {
              type: Object,
              value: () => ({
                  toBeSend: 0,
                  toBeCorrected: 0,
                  processing: 0,
                  rejected: 0,
                  accepted: 0,
                  archived: 0
              })
          },
          j20_batchCounter: {
              type: Object,
              value: () => ({
                  archived: 0,
                  error: 0,
                  partiallyAccepted: 0,
                  fullyAccepted: 0,
                  rejected: 0,
                  treated: 0,
                  acceptedForTreatment: 0,
                  successfullySentToOA: 0,
                  pending: 0,
                  reset: 0
              })
          },
          personalEHealthBoxTotalsByFolder: {
              type: Object,
              value: () => ({
                  inbox: 0,
                  sent: 0,
                  deleted: 0,
                  hidden: 0,
                  assigned: 0
              })
          },
          inboxSelectionIndex: {
              type: Number,
              value: null
          },
          documentBoxSelectionIndex: {
                                  type: Number,
                                  value: null
                              },
          flatRateInvoicingSelectionIndex: {
              type: Number,
              value: null
          },
          group: {
              type: String,
              value: null
          },
          sentboxSelectionIndex: {
              type: Number,
              value: null
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
          }
      };
  }

  static get observers() {
      return [
          '_isConnectedToEhbox(api.tokenId)',
          '_inboxSelectionIndexChanged(inboxSelectionIndex)',
          '_documentBoxSelectionIndexChanged(documentBoxSelectionIndex)',
          '_invoiceSelectionIndexChanged(invoiceSelectionIndex)',
          '_flatRateInvoicingSelectionIndexChanged(flatRateInvoicingSelectionIndex)'
      ];
  }

  constructor() {
      super();
  }

  ready() {
      super.ready();
  }

  _isConnectedToEhbox() {
      this.set("ehealthSession", !!_.get(this,"api.tokenId"))
  }

  toggleMenu(e) {
      e.stopPropagation();
      e.preventDefault();
      styx.parent(e.target, el => el.tagName.toLowerCase() === 'collapse-button').toggle();
      styx.parent(e.target, el => el.tagName.toLowerCase() === 'paper-item').classList.toggle('opened');
  }

  initializeDocCounter(e){
      if (e.detail.folder == "todealwith")
          this.set("docCounter.toDealWith", e.detail.count);
      else
          this.set("docCounter.archived", e.detail.count);
  }

  initializeBatchCounter(e){
      this.set("batchCounter.toBeSend", e.detail.toBeSend)
      this.set("batchCounter.toBeCorrected", e.detail.toBeCorrected)
      this.set("batchCounter.processing", e.detail.processing)
      this.set("batchCounter.rejected", e.detail.rejected)
      this.set("batchCounter.accepted", e.detail.accepted)
      this.set("batchCounter.archived", e.detail.archived)
  }

  initializeBatchCounterJ20(e){
      if(_.size(e.detail)) _.map(e.detail, (batchCount,batchKey) => this.set("j20_batchCounter." + batchKey , parseInt(batchCount)))
  }

  updatePersonalInboxMenuFoldersTotals(e){
      if(_.size(e.detail)) _.map(e.detail, (totalMessages,folderName) => this.set("personalEHealthBoxTotalsByFolder." + folderName , parseInt(totalMessages)))
  }

  assignResolvedObjects(inputObjects) {
      _.map(inputObjects, (v,k)=> this.set(k,v))
  }

  showInvoicing() {
      return !this.get('group') || this.get('group') === 'invoicing'
  }

  showInbox() {
      return !this.get('group') || this.get('group') === 'inbox'
  }

  _inboxTapped(e) {
      e.stopPropagation()
      e.preventDefault()
      this.dispatchEvent(new CustomEvent('selection-change', {detail: {selection: {item: 'personalInbox', folder: 'inbox'}}}));
      this.set('inboxSelectionIndex', null)
      this.set('documentBoxSelectionIndex', null)
      this.set('invoiceSelectionIndex', null)
      this.set('flatRateInvoicingSelectionIndex', null)
      this.$.inbox.classList.add('iron-selected')
      this.$.documentBox.classList.remove('iron-selected')
      this.$.invoicebox.classList.remove('iron-selected')
      this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
  }

  _inboxSelectionIndexChanged() {
      if (this.inboxSelectionIndex !== null && this.inboxSelectionIndex !== undefined) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: "personalInbox", folder: _.trim(_.get(this,"inboxSelectionItem.dataset.folder","inbox")) } } }));
          this.set('invoiceSelectionIndex', null)
          this.set('documentBoxSelectionIndex', null)
          this.set('flatRateInvoicingSelectionIndex', null)
          this.$.inbox.classList.remove('iron-selected')
          this.$.documentBox.classList.remove('iron-selected')
          this.$.invoicebox.classList.remove('iron-selected')
          this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
      }
  }

  _documentBoxTapped(e) {
      e.stopPropagation()
      e.preventDefault()
      this.dispatchEvent(new CustomEvent('selection-change', {detail: {selection: {item: 'documentBox', folder: 'todealwith'}}}));
      this.set('inboxSelectionIndex', null)
      this.set('documentBoxSelectionIndex', null)
      this.set('invoiceSelectionIndex', null)
      this.set('flatRateInvoicingSelectionIndex', null)
      this.$.inbox.classList.remove('iron-selected')
      this.$.documentBox.classList.add('iron-selected')
      this.$.invoicebox.classList.remove('iron-selected')
      this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
  }

  _documentBoxSelectionIndexChanged() {
      if (this.documentBoxSelectionIndex !== null && this.documentBoxSelectionIndex !== undefined) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: "documentBox", folder: _.trim(_.get(this,"documentBoxSelectionItem.dataset.folder","todealwith")) } } }));
          this.set('inboxSelectionIndex', null)
          this.set('invoiceSelectionIndex', null)
          this.set('flatRateInvoicingSelectionIndex', null)
          this.$.inbox.classList.remove('iron-selected')
          this.$.documentBox.classList.remove('iron-selected')
          this.$.invoicebox.classList.remove('iron-selected')
          this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
      }
  }

  _invoiceboxTapped(e){
      e.stopPropagation()
      e.preventDefault()
      this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: 'e_invOut', status: 'toBeSend'} } }));
      this.set('inboxSelectionIndex', null)
      this.set('documentBoxSelectionIndex', null)
      this.set('invoiceSelectionIndex', null)
      this.set('flatRateInvoicingSelectionIndex', null)
      this.$.inbox.classList.remove('iron-selected')
      this.$.documentBox.classList.remove('iron-selected')
      this.$.invoicebox.classList.add('iron-selected')
      this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
  }

  _invoiceSelectionIndexChanged() {
      if (this.invoiceSelectionIndex !== null && this.invoiceSelectionIndex !== undefined) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: this.invoiceSelectionItem.id, status: this.invoiceSelectionItem.dataset.status } } }));
          this.set('inboxSelectionIndex', null)
          this.set('documentBoxSelectionIndex', null)
          this.set('flatRateInvoicingSelectionIndex', null)
          this.$.inbox.classList.remove('iron-selected')
          this.$.documentBox.classList.remove('iron-selected')
          this.$.invoicebox.classList.remove('iron-selected')
          this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
      }
  }

  _flatRateInvoivingBox2Tapped(e){
      e.stopPropagation()
      e.preventDefault()
      console.log('_flatRateInvoivingBox2Tapped')
      this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: 'e_flatraterptOut', status: 'rpt'} } }));
      this.set('inboxSelectionIndex', null)
      this.set('documentBoxSelectionIndex', null)
      this.set('invoiceSelectionIndex', null)
      this.set('flatRateInvoicingSelectionIndex', null)
      this.$.inbox.classList.remove('iron-selected')
      this.$.documentBox.classList.remove('iron-selected')
      this.$.invoicebox.classList.remove('iron-selected')
      this.$.flatRateInvoicingListingBox2 && this.$.flatRateInvoicingListingBox2.classList.add('iron-selected')
  }

  _flatRateInvoivingBoxTapped(e){
      e.stopPropagation()
      e.preventDefault()
      console.log('_flatRateInvoivingBoxTapped')
      this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: 'e_flatrateinvOut', status: 'j3'} } }));
      this.set('inboxSelectionIndex', null)
      this.set('documentBoxSelectionIndex', null)
      this.set('invoiceSelectionIndex', null)
      this.set('flatRateInvoicingSelectionIndex', null)
      this.$.inbox.classList.remove('iron-selected')
      this.$.documentBox.classList.remove('iron-selected')
      this.$.invoicebox.classList.remove('iron-selected')
      this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.add('iron-selected')
  }

  _flatRateInvoicingSelectionIndexChanged() {
      if (this.flatRateInvoicingSelectionIndex !== null && this.flatRateInvoicingSelectionIndex !== undefined) {
          this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: this.flatRateInvoicingSelectionItem.id, status: this.flatRateInvoicingSelectionItem.dataset.status } } }));
          this.set('inboxSelectionIndex', null)
          this.set('documentBoxSelectionIndex', null)
          this.set('invoiceSelectionIndex', null)
          this.$.inbox.classList.remove('iron-selected')
          this.$.documentBox.classList.remove('iron-selected')
          this.$.invoicebox.classList.remove('iron-selected')
          this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
      }
  }
=======
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
            selectedContactItems: {
                type: Array,
                value: () => []
            },
            i18n: {
                type: Object,
                noReset: true
            },
            docCounter: {
                type: Object,
                value: () => ({
                    toDealWith: 0,
                    archived: 0
                })
            },
            batchCounter: {
                type: Object,
                value: () => ({
                    toBeSend: 0,
                    toBeCorrected: 0,
                    processing: 0,
                    rejected: 0,
                    accepted: 0,
                    archived: 0
                })
            },
            j20_batchCounter: {
                type: Object,
                value: () => ({
                    archived: 0,
                    error: 0,
                    partiallyAccepted: 0,
                    fullyAccepted: 0,
                    rejected: 0,
                    treated: 0,
                    acceptedForTreatment: 0,
                    successfullySentToOA: 0,
                    pending: 0,
                    reset: 0
                })
            },
            personalEHealthBoxTotalsByFolder: {
                type: Object,
                value: () => ({
                    inbox: 0,
                    sent: 0,
                    deleted: 0,
                    hidden: 0,
                    assigned: 0
                })
            },
            inboxSelectionIndex: {
                type: Number,
                value: null
            },
            documentBoxSelectionIndex: {
                type: Number,
                value: null
            },
            flatRateInvoicingSelectionIndex: {
                type: Number,
                value: null
            },
            sentboxSelectionIndex: {
                type: Number,
                value: null
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
            }
        };
    }

    static get observers() {
        return [
            '_isConnectedToEhbox(api.tokenId)',
            '_inboxSelectionIndexChanged(inboxSelectionIndex)',
            '_documentBoxSelectionIndexChanged(documentBoxSelectionIndex)',
            '_invoiceSelectionIndexChanged(invoiceSelectionIndex)',
            '_flatRateInvoicingSelectionIndexChanged(flatRateInvoicingSelectionIndex)'
        ];
    }

    constructor() {
        super();
    }

    ready() {
        super.ready();
    }

    _isConnectedToEhbox() {
        this.set("ehealthSession", !!this.api.tokenId)
    }

    toggleMenu(e) {
        e.stopPropagation();
        e.preventDefault();
        styx.parent(e.target, el => el.tagName.toLowerCase() === 'collapse-button').toggle();
        styx.parent(e.target, el => el.tagName.toLowerCase() === 'paper-item').classList.toggle('opened');
    }

    initializeDocCounter(e){
        if (e.detail.folder == "todealwith")
            this.set("docCounter.toDealWith", e.detail.count);
        else
            this.set("docCounter.archived", e.detail.count);
    }

    initializeBatchCounter(e){
        this.set("batchCounter.toBeSend", e.detail.toBeSend)
        this.set("batchCounter.toBeCorrected", e.detail.toBeCorrected)
        this.set("batchCounter.processing", e.detail.processing)
        this.set("batchCounter.rejected", e.detail.rejected)
        this.set("batchCounter.accepted", e.detail.accepted)
        this.set("batchCounter.archived", e.detail.archived)
    }

    initializeBatchCounterJ20(e){
        if(_.size(e.detail)) _.map(e.detail, (batchCount,batchKey) => this.set("j20_batchCounter." + batchKey , parseInt(batchCount)))
    }

    updatePersonalInboxMenuFoldersTotals(e){
        if(_.size(e.detail)) _.map(e.detail, (totalMessages,folderName) => this.set("personalEHealthBoxTotalsByFolder." + folderName , parseInt(totalMessages)))
    }

    assignResolvedObjects(inputObjects) {
        _.map(inputObjects, (v,k)=> this.set(k,v))
    }




    _inboxTapped(e) {
        e.stopPropagation()
        e.preventDefault()
        this.dispatchEvent(new CustomEvent('selection-change', {detail: {selection: {item: 'personalInbox', folder: 'inbox'}}}));
        this.set('inboxSelectionIndex', null)
        this.set('documentBoxSelectionIndex', null)
        this.set('invoiceSelectionIndex', null)
        this.set('flatRateInvoicingSelectionIndex', null)
        this.$.inbox.classList.add('iron-selected')
        this.$.documentBox.classList.remove('iron-selected')
        this.$.invoicebox.classList.remove('iron-selected')
        this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
    }

    _inboxSelectionIndexChanged() {
        if (this.inboxSelectionIndex !== null && this.inboxSelectionIndex !== undefined) {
            this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: "personalInbox", folder: _.trim(_.get(this,"inboxSelectionItem.dataset.folder","inbox")) } } }));
            this.set('invoiceSelectionIndex', null)
            this.set('documentBoxSelectionIndex', null)
            this.set('flatRateInvoicingSelectionIndex', null)
            this.$.inbox.classList.remove('iron-selected')
            this.$.documentBox.classList.remove('iron-selected')
            this.$.invoicebox.classList.remove('iron-selected')
            this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
        }
    }

    _documentBoxTapped(e) {
        e.stopPropagation()
        e.preventDefault()
        this.dispatchEvent(new CustomEvent('selection-change', {detail: {selection: {item: 'documentBox', folder: 'todealwith'}}}));
        this.set('inboxSelectionIndex', null)
        this.set('documentBoxSelectionIndex', null)
        this.set('invoiceSelectionIndex', null)
        this.set('flatRateInvoicingSelectionIndex', null)
        this.$.inbox.classList.remove('iron-selected')
        this.$.documentBox.classList.add('iron-selected')
        this.$.invoicebox.classList.remove('iron-selected')
        this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
    }

    _documentBoxSelectionIndexChanged() {
        if (this.documentBoxSelectionIndex !== null && this.documentBoxSelectionIndex !== undefined) {
            this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: "documentBox", folder: _.trim(_.get(this,"documentBoxSelectionItem.dataset.folder","todealwith")) } } }));
            this.set('inboxSelectionIndex', null)
            this.set('invoiceSelectionIndex', null)
            this.set('flatRateInvoicingSelectionIndex', null)
            this.$.inbox.classList.remove('iron-selected')
            this.$.documentBox.classList.remove('iron-selected')
            this.$.invoicebox.classList.remove('iron-selected')
            this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
        }
    }

    _invoiceboxTapped(e){
        e.stopPropagation()
        e.preventDefault()
        this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: 'e_invOut', status: 'toBeSend'} } }));
        this.set('inboxSelectionIndex', null)
        this.set('documentBoxSelectionIndex', null)
        this.set('invoiceSelectionIndex', null)
        this.set('flatRateInvoicingSelectionIndex', null)
        this.$.inbox.classList.remove('iron-selected')
        this.$.documentBox.classList.remove('iron-selected')
        this.$.invoicebox.classList.add('iron-selected')
        this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
    }

    _invoiceSelectionIndexChanged() {
        if (this.invoiceSelectionIndex !== null && this.invoiceSelectionIndex !== undefined) {
            this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: this.invoiceSelectionItem.id, status: this.invoiceSelectionItem.dataset.status } } }));
            this.set('inboxSelectionIndex', null)
            this.set('documentBoxSelectionIndex', null)
            this.set('flatRateInvoicingSelectionIndex', null)
            this.$.inbox.classList.remove('iron-selected')
            this.$.documentBox.classList.remove('iron-selected')
            this.$.invoicebox.classList.remove('iron-selected')
            this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
        }
    }

    _flatRateInvoivingBox2Tapped(e){
        e.stopPropagation()
        e.preventDefault()
        console.log('_flatRateInvoivingBox2Tapped')
        this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: 'e_flatraterptOut', status: 'rpt'} } }));
        this.set('inboxSelectionIndex', null)
        this.set('documentBoxSelectionIndex', null)
        this.set('invoiceSelectionIndex', null)
        this.set('flatRateInvoicingSelectionIndex', null)
        this.$.inbox.classList.remove('iron-selected')
        this.$.documentBox.classList.remove('iron-selected')
        this.$.invoicebox.classList.remove('iron-selected')
        this.$.flatRateInvoicingListingBox2 && this.$.flatRateInvoicingListingBox2.classList.add('iron-selected')
    }

    _flatRateInvoivingBoxTapped(e){
        e.stopPropagation()
        e.preventDefault()
        console.log('_flatRateInvoivingBoxTapped')
        this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: 'e_flatrateinvOut', status: 'j3'} } }));
        this.set('inboxSelectionIndex', null)
        this.set('documentBoxSelectionIndex', null)
        this.set('invoiceSelectionIndex', null)
        this.set('flatRateInvoicingSelectionIndex', null)
        this.$.inbox.classList.remove('iron-selected')
        this.$.documentBox.classList.remove('iron-selected')
        this.$.invoicebox.classList.remove('iron-selected')
        this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.add('iron-selected')
    }

    _flatRateInvoicingSelectionIndexChanged() {
        if (this.flatRateInvoicingSelectionIndex !== null && this.flatRateInvoicingSelectionIndex !== undefined) {
            this.dispatchEvent(new CustomEvent('selection-change', { detail: { selection: { item: this.flatRateInvoicingSelectionItem.id, status: this.flatRateInvoicingSelectionItem.dataset.status } } }));
            this.set('inboxSelectionIndex', null)
            this.set('documentBoxSelectionIndex', null)
            this.set('invoiceSelectionIndex', null)
            this.$.inbox.classList.remove('iron-selected')
            this.$.documentBox.classList.remove('iron-selected')
            this.$.invoicebox.classList.remove('iron-selected')
            this.$.flatRateInvoicingListingBox && this.$.flatRateInvoicingListingBox.classList.remove('iron-selected')
        }
    }
>>>>>>> 1f851e67b6dde6487331d01027bc6b8bf642ae64
}

customElements.define(HtMsgMenu.is, HtMsgMenu);
