import '../dynamic-form/ckmeans-grouping.js';
import '../../styles/vaadin-icure-theme.js';
import '../../styles/spinner-style.js';
import '../ht-spinner/ht-spinner.js';
import '../../styles/dialog-style.js';
import '../../styles/shared-styles.js';
import '../ht-pat/dialogs/ht-pat-invoicing-dialog.js';
import '../ht-pat/dialogs/medicalhouse/ht-pat-flatrate-utils.js';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-dialog/paper-dialog"
import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-date-picker/vaadin-date-picker"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"
import "@vaadin/vaadin-grid/vaadin-grid-column-group"
import "@vaadin/vaadin-grid/vaadin-grid-sorter"

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import * as models from 'icc-api/dist/icc-api/model/models'
import * as fhcmodels from 'fhc-api/dist/model/models'
import mustache from "mustache/mustache.js";
import jsZip from "jszip/dist/jszip.js";
import promiseLimit from 'promise-limit';
import * as retry from "icc-api/dist/icc-x-api/utils/net-utils"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtMsgFlatrateInvoice extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
<custom-style>
            <style include="shared-styles vaadin-icure-theme spinner-style dialog-style">

                :host {
                    display: block;
                    z-index:2;
                }

                :host *:focus {
                    outline: 0 !important;
                }

                vaadin-grid {
                    height: calc(100vh - 145px);
                    box-shadow: var(--app-shadow-elevation-1);
                    border: none;
                    box-sizing: border-box;
                }

                .modal-title {
                    justify-content: flex-start;
                }

                .modal-title iron-icon{
                    margin-right: 8px;
                }

                vaadin-grid.material {
                    outline: 0 !important;
                    font-family: Roboto, sans-serif;
                    background: rgba(0, 0, 0, 0);
                    border: none;
                    --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                    --vaadin-grid-cell: {
                        padding: 8px;
                    };

                    --vaadin-grid-header-cell: {
                        height: 48px;
                        padding: 11.2px;
                        color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                        font-size: 12px;
                        background: rgba(0, 0, 0, 0);
                        border-top: 0;
                    };

                    --vaadin-grid-body-cell: {
                        height: 48px;
                        color: rgba(0, 0, 0, var(--dark-primary-opacity));
                        font-size: 13px;
                    };

                    --vaadin-grid-body-row-hover-cell: {
                        background-color: var(--app-background-color-dark);
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
                    height: 100%;
                }

                vaadin-grid.material .cell.last {
                    padding-right: 24px;
                    text-align: center;
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

                vaadin-grid.material::slotted(div) {
                    outline: 0 !important;
                }

                .invoice-panel{
                    height: 100%;
                    width: 100%;
                    padding: 0 20px;
                    box-sizing: border-box;
                    position:relative;
                }

                .oa-col{
                    min-width: 25px;
                }

                .bold {
                    font-weight: 700!important;
                }

                .underlined {
                    text-decoration:underline!important;
                }

                .textDecorationNone {
                    text-decoration:none!important;
                }

                .ref-col{
                    min-width: 75px;
                }

                .invoice-col{
                    min-width: 40px;
                }

                .month-col{
                    min-width: 40px;
                }

                .invoiceDate-col{
                    min-width: 50px;
                }

                .invAmount-col{
                    min-width: 50px;
                }

                .accAmount-col{
                    min-width: 50px;
                }

                .refAmount-col{
                    min-width: 50px;
                }

                .stat-col{
                    min-width: 50px;
                }

                .reject-col{
                    min-width: 100px;
                }

                .payRef-col{
                    min-width: 50px;
                }

                .payDate-col{
                    min-width: 40px;
                }

                .payTot-col{
                    min-width: 40px;
                }

                .payBank-col{
                    min-width: 50px;
                }

                .payPaid-col{
                    min-width: 50px;
                }

                .facture-title {
                    padding: 15px;
                    font-size: 25px;
                    text-transform: capitalize;
                    margin: 0;
                    color: #212121;
                    height: 25px;
                    line-height: 25px;
                }


                @media screen and (max-width:1025px){
                    .invoice-panel {
                        left: 0;
                        width: 100%;
                    }
                }
                .gridContainer{
                    height: 100%;
                    overflow-y: hidden;
                    overflow-x: hidden;
                    box-shadow: var(--app-shadow-elevation-1);
                }

                .invoice-status {
                    border-radius: 20px;
                    padding: 1px 12px 1px 8px;
                    font-size: 12px;
                    display: block;
                    width: auto;
                    max-width: fit-content;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .invoice-status--orangeStatus{
                    background: #fcdf354d;
                }

                .invoice-status--greenStatus{
                    background: #07f8804d;
                }

                .invoice-status--blueStatus {
                    background: #84c8ff;
                }

                .invoice-status--redStatus{
                    background: #ff4d4d4d;
                }

                .statusIcon{
                    height: 8px;
                    width: 8px;
                }
                .statusIcon.invoice-status--orangeStatus {
                    color: var(--app-status-color-pending);
                }
                .statusIcon.invoice-status--greenStatus {
                    color: var(--app-status-color-ok);
                }
                .statusIcon.invoice-status--blueStatus {
                    color: var(--paper-blue-400);
                }
                .statusIcon.invoice-status--redStatus {
                    color: var(--app-status-color-nok);
                }
                .statusIcon.invoice-status--orangeStatus,
                .statusIcon.invoice-status--greenStatus,
                .statusIcon.invoice-status--redStatus {
                    background: transparent !important;
                }
                .invoice-status--purpleStatus {
                    background: #e1b6e6;
                }

                *.txtcolor--orangeStatus {
                    color: var(--paper-amber-800);
                }
                *.txtcolor--greenStatus {
                    color: #36a201;
                }
                *.txtcolor--blueStatus {
                    color: var(--paper-blue-400);
                }
                *.txtcolor--redStatus {
                    color: var(--app-status-color-nok);
                }
                *.txtcolor--purpleStatus {
                    color: var(--paper-purple-300)
                }
                #pendingDetailDialog{
                    height: calc(100vh - 40px);
                    width: calc(85% - 40px);
                    z-index: 1100;
                    position: fixed;
                    top: 64px;
                }

                #pendingGridDetail{
                    height: calc(100% - 185px);
                    padding: 0;
                    width: 100%;
                }

                .batch-status {
                    font-size: 24px;
                    text-transform: capitalize;
                    padding-top: 5px;
                    display: flex;
                    flex-flow: row wrap;
                    align-items: center;
                    justify-content: flex-start;
                }

                .unlockBtn {
                    height: 12px;
                    width: 12px;
                }

                .hidden {
                    display: none;
                }

                #messagesGridContainer,#messagesGridContainer2, #messagesGridContainer3, #messagesGridContainer4 {
                    overflow-y: auto;
                }

                .invoiceContainer{
                    overflow-x: hidden;
                    overflow-y: hidden;
                    height: calc(100vh - 145px);
                    box-shadow: var(--app-shadow-elevation-1);
                }
                .invoiceSubContainerBig {
                    height: 100%;
                }

                .invoiceSubContainerMiddle {
                    height: calc(100%);
                    transition: all .5s ease;
                }
                .invoiceSubContainerMiddle vaadin-grid {
                    /*height: 100%;*/
                }
                .invoiceSubContainerMiddle.half {
                    height: 49%;
                }

                .invoiceDetailContainer,
                .toBeCorrectedDetailContainerC{
                    height: 50%;
                    opacity: 0;
                    transition: all .75s ease-out;
                    overflow-y: auto;
                }
                .invoiceDetailContainer.open,
                .toBeCorrectedDetailContainerC.open {
                    opacity: 1;
                    width: 100%;
                    height: 46%;
                    margin-top:4%
                }

                tr.hidden {
                    display: none !important;
                }

                .mb0 {
                    margin-bottom: 0;
                }
                .mb30 {
                    margin-bottom: 30px;
                }

                #pendingDetailDialog {
                    max-height: 80vh;
                }

                .helpdeskIcon {
                    height: 12px;
                    width: 12px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
                }

                .helpdeskIcon:hover{
                    transform: scale(1.05);
                    opacity: 1;
                }

                iron-collapse-button #trigger{
                    height: 45px;
                    background: var(--app-background-color-dark);
                    display: initial;
                }

                #invoiceCollapser {
                    display: block;
                    background: white;
                    height: calc(100% - 75px);
                    overflow-y: auto;
                }

                h3.header {
                    margin: 0 auto
                }
                #collapse-grid .recipient-col {
                    background: grey;
                }

                .rejectionReason-col {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }

                .containScroll {
                    overflow: auto;
                    height: 100%;
                }

                .scrollBox {
                    width: 100%;
                    overflow: hidden;
                    height: 100%;
                }
                .scrollBox > #messagesGrid, .scrollBox > #messagesGrid2, .scrollBox > #messagesGrid3 {
                    width: 100%;
                    height: 100%;
                }

                .flex-header{
                    width: 100%;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    height: 48px;
                }

                iron-collapse-button:hover{
                    background: var(--app-background-color-dark);
                }

                .flex-header span{
                    display:block;
                    font-size: 12px;
                    font-weight: 400;
                    padding: 4px 12px;
                    box-sizing:border-box;
                    cursor: pointer;
                    color: rgb(115,115,115);
                }

                .flex-header span.center{
                    text-align: center;
                }

                #invoiceGrid .footer{
                    background: red;
                }

                #invoiceAndBatchesGridDetail {
                    height: calc(100% - 100px);
                }

                .invoicesToBeCorrectedGrid {
                    height: 100%;
                }

                #helpdeskInfoDialog{
                    position: fixed;
                    width: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    max-width: none !important;
                    max-height: none !important;
                    overflow-y: auto;
                }

                /*.modal-title {*/
                /*    background: var(--app-background-color-dark);*/
                /*    margin-top: 0;*/
                /*    padding: 16px 24px;*/
                /*}*/

                .modal-content{
                    display: flex;
                    flex-flow: row wrap;
                    align-items: center;
                    justify-content: flex-start;
                }

                .colorAppSecondaryColorDark {
                    color:var(--app-secondary-color-dark)
                }

                .modal-input{
                    margin: 0 12px;
                    flex-grow: 1;
                }

                paper-input{
                    --paper-input-container-focus-color: var(--app-primary-color);
                }

                .buttons {
                    /*position: absolute;*/
                    /*right: 0;*/
                    /*bottom: 0;*/
                    /*margin: 8px 16px;*/
                }

                .button--accepted {
                    --paper-button-ink-color: var(--app-status-color-ok);
                    background-color: var(--app-status-color-ok);
                    color: var(--app-text-color-light);
                }

                .button--partially-accepted {
                    --paper-button-ink-color: var(--app-status-color-pending);
                    background-color: var(--app-status-color-pending);
                    color: var(--app-text-color-light);
                }

                .button--rejected {
                    --paper-button-ink-color: var(--app-status-color-nok);
                    background-color: var(--app-status-color-nok);
                    color: var(--app-text-color-light);
                }

                .batchNumber{
                    color: var(--app-text-color-light);
                    border-radius: 25px;
                    min-height: 0;
                    margin-left: 8px;
                    font-size: .6em;
                    display: inline-block;
                    padding: 4px 6px;
                    line-height: 0.8;
                    text-align: center;
                    height: 10px;
                }
                .batchPending{background-color: var(--paper-orange-400);}
                .batchToBeCorrected{background-color: var(--paper-red-400);}
                .batchProcessed{background-color: var(--paper-blue-400);}
                .batchRejected, .batchRed{background-color: var(--paper-red-400);}
                .batchAccepted{background-color: var(--paper-green-400);}
                .batchArchived{background-color: var(--paper-purple-300);}
                .batchToBeSend{background-color: var(--paper-orange-400);}

                ht-spinner {
                    margin-top:10px;
                    margin-bottom:10px;
                    height:42px;
                    width:42px;
                }

                .tool-btn{
                    margin: 0;
                    box-sizing: border-box;
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    display: inline-block;
                    text-align: center;
                    --paper-button: {
                        background: var(--app-secondary-color);
                        color: var(--app-text-color);
                        width: auto;
                        margin: 0 auto;
                        font-size: 13px;
                        font-weight: 700;
                        padding:10px;
                    };
                }

                .grid-btn-small {
                    margin: 0;
                    padding:2px 10px;
                    box-sizing: border-box;
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    display: inline-block;
                    text-align: center;
                    --paper-button: {
                        background: var(--app-secondary-color);
                        color: var(--app-text-color);
                        width: auto;
                        margin: 0 auto;
                        font-size: 12px;
                        font-weight: 400;
                        padding:10px;
                    };
                }

                .grid-btn-small.noBg {
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    --paper-button: {
                        background: none;
                    };
                }

                .noPad {
                    padding:0
                }

                .grid-btn-small iron-icon {
                    max-width:20px;
                }

                .tool-btn-previous-month {
                    color:#ffffff;
                    --paper-button: {
                        background: var(--app-text-color);
                        font-weight: 400;
                    };
                }

                #rightPanel {
                    position: absolute;
                    right: -350px;
                    width:300px;
                    top: 0px;
                    background: rgba(255,255,255,1);
                    border-left:1px solid #dddddd;
                    box-shadow:0px 0px 3px 0px #dddddd;
                    height: 100%;
                    z-index: 5;
                    transition: all 400ms ease;
                    -moz-transition: all 400ms ease;
                    -webkit-transition: all 400ms ease;
                    -o-transition: all 400ms ease;
                    -ms-transition: all 400ms ease;
                }

                #rightPanel.opened {
                    right:0;
                }

                .header {
                    padding: 10px;
                    color: #ffffff;
                    text-transform: uppercase;
                    margin: 0;
                    font-weight: 700;
                    background-color: #777777;
                    cursor: pointer;
                }

                #rightPanel label {
                    margin:0;
                    padding:0;
                }

                #rightPanel .pullRightIcon {
                    margin:0;
                    padding:0;
                    min-width:1px;
                    float:right;
                }

                #rightPanel .body {
                    padding: 10px;
                }

                #rightPanel .body h4 {
                    text-transform: uppercase;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #000000;
                    font-weight: 700;
                    margin-top:12px;
                    padding-bottom:2px;
                }

                #rightPanelToggleContainer {
                    position:absolute;
                    right:20px;
                    top:10px;
                }

                #rightPanelToggleContainer .header {
                    margin:0;
                    color:#000000;
                    background-color: initial;
                    padding:0;
                }

                .w30px {
                    width:30px
                }

                .h30px {
                    height:30px
                }

                .w20px {
                    width:20px
                }

                .h20px {
                    height:20px
                }

                .p-35px {
                    padding:35px;
                }

                .p-10px {
                    padding:10px;
                }

                .p-15px {
                    padding:15px;
                }

                .p-r-15px {
                    padding-right:15px;
                }

                .p-l-15px {
                    padding-left:15px;
                }

                .datePicker {
                    width:95%;
                }

                .m-t-40 {
                    margin-top:40px;
                }

                .m-t-50 {
                    margin-top:50px!important;
                }

                .m-t-20 {
                    margin-top:20px!important;
                }

                .m-t-25 {
                    margin-top:25px!important;
                }

                .w-100-pc {
                    width:100%;
                }

                .fr {
                    float:right
                }

                .m-t-20 {
                    margin-top:20px;
                }

                @media screen and (max-width: 1024px) {
                    .hideOnMobile {display: none;opacity: 0;}
                }

                .warningMessage {
                    margin-top: 20px;
                    margin-bottom: 30px;
                }

                .warningMessageBody {
                    padding:20px 35px;
                    color:#7E0000;
                    background-color: rgba(255, 0, 0, 0.15);
                    font-weight: 700;
                    border:1px dashed #7e0000;
                    text-transform: uppercase;
                    text-align: center;
                }

                #loadingContainer, #loadingContainerSmall {
                    position:absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;left: 0;
                    background-color: rgba(0,0,0,.3);
                    z-index: 10;
                    text-align: center;
                }

                #loadingContentContainer, #loadingContentContainerSmall {
                    position:relative;
                    width: 400px;
                    min-height: 200px;
                    background-color: #ffffff;
                    padding:20px;
                    border:3px solid var(--app-secondary-color);
                    margin:40px auto 0 auto;
                    text-align: center;
                }

                #loadingContentContainerSmall {
                    width: 80px;
                    padding:10px;
                    border:1px solid var(--app-secondary-color);
                    min-height: 1px;
                }

                #loadingContent {
                    text-align: left;
                }

                .loadingIcon {
                    margin-right:5px;
                }

                .loadingIcon.done {
                    color: var(--app-secondary-color);
                }

                .f-s-1em {
                    font-size:1em;
                }

                .f-s-08em {
                    font-size:.8em;
                }

                #exportRangeNotification {
                    font-style:italic;
                    margin-top:10px;
                    color:#555555;
                }

                #exportRangeNotification span {
                    font-weight: 700;
                }

                .centerCenter {
                    text-align:center;
                    text-align:center;
                }

                .bordered {
                    border:1px solid #888888;
                }

                .textRed {
                    color:#A80000;
                }

                .textAlignCenter {
                    text-align: center;
                }

                .onlyIfRejectRate {
                    font-weight: 400;
                    color: #ffb7b7;
                    display:block;
                }

                .exportMonthPicker {
                    border:1px solid var(--app-secondary-color);
                    padding:0px 0 10px 0;
                    margin:40px auto;
                    max-width:520px;
                    -webkit-box-shadow: 2px 2px 5px 0 rgba(0,0,0,0.2);
                    box-shadow: 2px 2px 5px 0 rgba(0,0,0,0.2);
                }

                vaadin-combo-box {
                    margin:10px 30px 0 30px;
                    width:130px;
                }

                .exportMonthPickerTitle {
                    text-transform: uppercase;
                    margin-bottom:20px;
                    padding:10px 0 13px 0;
                    border-bottom:1px solid var(--app-secondary-color);
                    background-color:rgba(255, 80, 0, .2);
                    font-weight: 700;
                }

                .invoicesGridContainer{
                    margin-top:20px;
                    height: auto;
                    overflow-y: hidden;
                    overflow-x: hidden;
                    box-shadow: var(--app-shadow-elevation-1);
                }

                .alignRight{
                    float: right;
                    margin-right: 1%;
                }

                #invoiceDetailHeader {
                    padding:0 10px;
                    min-height:40px;
                }

                #invoiceDetailHeader h4 {
                    margin:0;
                    padding-top:20px;
                }

                .actionButtonsRight {
                    float:right;
                }

                .actionButtonsRight iron-icon {
                    max-width:20px;
                    margin-right: 10px;
                }

                .modalDialog{
                    /*height: 350px;*/
                    /*width: 600px;*/
                }

                .modalDialogContent{
                    height: 250px;
                    width: auto;
                    margin: 10px;
                }

                .mr5 {margin-right:5px}
                .smallIcon { width:16px; height:16px; }
                .displayNone {
                    display:none!important
                }

                #largeButton {
                    padding:20px 20px 40px 20px
                }

                .batchNumberInput {
                    width:50%;
                    margin:0 auto;
                }

                .batchNumberInput {
                    width:50%;
                    margin:0 auto;
                }

            </style>
        </custom-style>

        
        
        <div class="invoice-panel">



            <div style="display:none" id="_DEVELOPERS_ONLY_deleteFlatrateMessagesAndInvoices_container">
                <paper-button class="tool-btn" on-tap="_DEVELOPERS_ONLY_deleteFlatrateMessagesAndInvoices"><iron-icon icon="icons:error" class="w30px h30px"></iron-icon> &nbsp; DELETE ALL INVOICES - NOT FOR PROD !!!</paper-button>
            </div>



            <template is="dom-if" if="[[_bodyOverlay]]">
                <div id="loadingContainer"></div>
            </template>
            <template is="dom-if" if="[[_isLoading]]">
                <div id="loadingContainer">
                    <div id="loadingContentContainer">
                        <div style="max-width:80px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active></ht-spinner></div>
                        <div id="loadingContent"><p><iron-icon icon="arrow-forward" class="loadingIcon"></iron-icon> [[localize("mhListing.spinner.step_1", language)]]</p></div>
                    </div>
                </div>
            </template>
            <template is="dom-if" if="[[_isLoadingSmall]]">
                <div id="loadingContainerSmall">
                    <div id="loadingContentContainerSmall">
                        <ht-spinner class="spinner" alt="Loading..." active></ht-spinner>
                        <!--                        <p><iron-icon icon="arrow-forward" class="loadingIcon"></iron-icon> [[localize("pleaseWait", language)]]</p>-->
                    </div>
                </div>
            </template>



            <div id="batchStatus" class="batch-status">
                <template is="dom-if" if="[[_isEqual(flatrateMenuSection,'j20_toBeCorrected')]]"><span class="batchNumber j20_batchNumber batchToBeCorrected">[[messagesCachedData.countByStatus.error]]</span></template>
                <template is="dom-if" if="[[_isEqual(flatrateMenuSection,'j20_toBeSend')]]"><span class="batchNumber j20_batchNumber batchToBeSend">+<!--[[messagesCachedData.countByStatus.xxx]]]--></span></template>
                <template is="dom-if" if="[[_isEqual(flatrateMenuSection,'j20_process')]]"><span class="batchNumber j20_batchNumber batchProcessed">[[messagesCachedData.countByStatus.pending]]</span></template>
                <template is="dom-if" if="[[_isEqual(flatrateMenuSection,'j20_partiallyAccepted')]]"><span class="batchNumber j20_batchNumber batchToBeSend">[[messagesCachedData.countByStatus.partiallyAccepted]]</span></template>
                <template is="dom-if" if="[[_isEqual(flatrateMenuSection,'j20_accept')]]"><span class="batchNumber j20_batchNumber batchAccepted">[[messagesCachedData.countByStatus.fullyAccepted]]</span></template>
                <template is="dom-if" if="[[_isEqual(flatrateMenuSection,'j20_reject')]]"><span class="batchNumber j20_batchNumber batchRejected">[[messagesCachedData.countByStatus.rejected]]</span></template>
                <template is="dom-if" if="[[_isEqual(flatrateMenuSection,'j20_archive')]]"><span class="batchNumber j20_batchNumber batchArchived">[[messagesCachedData.countByStatus.archived]]</span></template>
                <template is="dom-if" if="[[_isEqual(flatrateMenuSection,'j20_reset')]]"><span class="batchNumber j20_batchNumber batchRed">[[messagesCachedData.countByStatus.reset]]</span></template>
            </div>


            <template is="dom-if" if="[[_isEqual(flatrateMenuSection, 'j3')]]">
                <!--<template is="dom-if" if="[[_showWarningMessageEarlyInvoicingListing()]]"><div class="warningMessage" id="warningMessageListing"><div class="warningMessageBody"><iron-icon icon="icons:warning" class="w30px h30px"></iron-icon> &nbsp; [[localize('earlyInvoicingWarningMessage', 'Attention\\, veuillez ne procéder à la facturation qu\\'entre le premier et le cinquième jour du mois.', language)]]</div></div></template>-->
                <div class="centerCenter">
                    <div class="exportMonthPicker pb20">
                        <div class="exportMonthPickerTitle"><iron-icon icon="vaadin:calendar" style="max-width:20px; max-height:20px; margin-right:7px;"></iron-icon> [[localize('j20_monthToGenerate','Month to generate',language)]]</div>
                        <vaadin-combo-box id="listingExportedMonth" filtered-items="[[_getExportMonthsList()]]" item-label-path="label" item-value-path="id" label="[[localize('month','Month',language)]]" value="[[_getExportCurrentMonth()]]"></vaadin-combo-box>
                        <vaadin-combo-box id="listingExportedYear" filtered-items="[[_getExportYearsList()]]" item-label-path="label" item-value-path="id" label="[[localize('year','Year',language)]]" value="[[_getExportCurrentYear()]]"></vaadin-combo-box>
                        <vaadin-checkbox checked="[[overrideBatchNumber]]" on-tap="_overrideBatchNumberGotChanged">[[localize('override_batchnr','Override batch number',language)]]</vaadin-checkbox>
                        <template is="dom-if" if="[[overrideBatchNumber]]"><paper-input label="[[localize('batchnr','Batch number',language)]]" value="{{batchNumber}}" class="batchNumberInput"></paper-input></template>
                    </div>
                    <paper-button class="button button--save tool-btn m-t-20 f-s-1em bordered" id="largeButton" on-tap="_getListingJ3"><iron-icon icon="icons:cloud-download" class="w30px h30px"></iron-icon> &nbsp; [[localize('downloadListing','Téléchargement listing',language)]]</paper-button>
                    <!--<div id="exportRangeNotification">(*) [[localize('exportedPeriod', language)]]: [[localize('from2', language)]] <span>[[_startOfPreviousMonth()]]</span> [[localize('till', language)]] <span>[[_endOfPreviousMonth()]]</span></div>-->
                    <!--<paper-button class="tool-btn tool-btn-previous-month p-10px m-t-50 f-s-08em bordered" id="getListingJ3PreviousMonth" on-tap="_getListingJ3"><iron-icon icon="icons:cloud-download" class="w30px h30px"></iron-icon> &nbsp; [[localize('downloadListingPreviousMonth','Téléchargement listing du mois précédent',language)]]<span class="onlyIfRejectRate">[[localize('downloadListingPreviousMonthRemark','Only when rejection rate > 5%',language)]]</span></paper-button>-->
                </div>
            </template>



            <template is="dom-if" if="[[_isEqual(flatrateMenuSection, 'archivej3')]]">

                <div id="rightPanelToggleContainer" class=""><div class="header"><paper-button class="button button--other" on-tap="_toggleRightPanel"><iron-icon icon="icons:build" class=""></iron-icon> &nbsp; [[localize('tools', language)]]</paper-button></div></div>

                <div id="rightPanel" class="">
                    <div class="header"  on-tap="_toggleRightPanel">
                        <label><iron-icon icon="icons:build"  class="w20px h20px"></iron-icon> &nbsp;[[localize('tools', language)]]</label>
                        <paper-button class="pullRightIcon"><iron-icon icon="icons:arrow-forward"></iron-icon></paper-button>
                    </div>
                    <div class="body">
                        <h4 class="m-t-50"><iron-icon icon="date-range"></iron-icon> &nbsp; [[localize('filterByDate','Filtrer par date',language)]]</h4>
                        <vaadin-date-picker label="[[localize('begin','Début',language)]]" i18n="[[i18n]]" class="datePicker" value="" id="dateRangeStart" always-float-label></vaadin-date-picker>
                        <vaadin-date-picker label="[[localize('end','Fin',language)]]" i18n="[[i18n]]" class="datePicker" value="" id="dateRangeEnd" always-float-label></vaadin-date-picker>
                        <paper-button class="button button--save w-100-pc" on-tap="_getListingArchives" ><iron-icon icon="icons:update" class="force-left"></iron-icon> &nbsp; [[localize('filterResults','Filtrer les résultats',language)]]</paper-button>
                    </div>
                </div>

                <div class="gridContainer m-t-25">
                    <div class="invoiceContainer">
                        <div id="messagesGridContainer3" class="invoiceSubContainerMiddle">
                            <div class="gridContainer grid-archives-listing">
                                <div class="containScroll">
                                    <vaadin-grid id="noscroll" items="[[archiveListingMessages]]">
                                        <vaadin-grid-column flex-grow="0" width="10%" class="" >
                                            <template class="header"><vaadin-grid-sorter path="created">[[localize('date','Date',language)]]</vaadin-grid-sorter></template>
                                            <template>[[item.hrDate]]</template>
                                        </vaadin-grid-column>
                                        <vaadin-grid-column flex-grow="0" width="9%" class="">
                                            <template class="header"><vaadin-grid-sorter path="created">[[localize('time','Heure',language)]]</vaadin-grid-sorter></template>
                                            <template>[[item.hrTime]]</template>
                                        </vaadin-grid-column>
                                        <vaadin-grid-column flex-grow="1" class="">
                                            <template class="header"><vaadin-grid-sorter path="filename">[[localize('filename','Fichier',language)]]</vaadin-grid-sorter></template>
                                            <template><iron-icon icon="image:picture-as-pdf" class="force-left textRed"></iron-icon> &nbsp; [[item.filename]]</template>
                                        </vaadin-grid-column>
                                        <vaadin-grid-column flex-grow="0" width="10%" class="">
                                            <template class="header"><vaadin-grid-sorter path="totalPages">[[localize('totalPages','Nombre de pages',language)]]</vaadin-grid-sorter></template>
                                            <template class="textAlignCenter">[[item.totalPages]]</template>
                                        </vaadin-grid-column>
                                        <vaadin-grid-column flex-grow="0" width="20%" class="">
                                            <template class="header"><vaadin-grid-sorter path="id">[[localize('downloadArchive',"Télécharger l'archive",language)]]</vaadin-grid-sorter></template>
                                            <template><paper-button class="button button--other downloadListingArchive" on-tap="_downloadListingArchive" messageId="[[item.id]]" ><iron-icon icon="icons:cloud-download" class="force-left"></iron-icon> &nbsp; [[localize('download','Télécharger',language)]]</paper-button></vaadin-grid-sorter></template>
                                        </vaadin-grid-column>
                                    </vaadin-grid>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </template>



            <template is="dom-if" if="[[_isEqual(flatrateMenuSection, 'j20_toBeCorrected')]]">
                <div class="invoicesGridContainer">
                    <div class="invoiceContainer">
                        <div id="messagesGridContainer2" class="invoiceSubContainerMiddle">
                            <div class="scrollBox">
                                <vaadin-grid id="messagesGrid" items="[[messagesGridData]]" data-status$="[[_getBatchStatusByMenuSection(flatrateMenuSection)]]" class="invoicesToBeCorrectedGrid">
                                    <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="oaCode">Oa</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.oaCode]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="15%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="oaLabel">[[localize('name','Name',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.oaLabel]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="invoiceData.invoiceReference">N° fact.</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.invoiceData.invoiceReference]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="17%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="patientData.firstName">[[localize('inv_pat','Patient',language)]] </vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.patientData.firstName]] [[item.patientData.lastName]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="patientData.ssin">[[localize('inv_niss','Niss',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[_formatSsinNumber(item.patientData.ssin)]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="9%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="invoiceData.invoicingCodes">Nmcl</vaadin-grid-sorter>
                                        </template>
                                        <template>[[_renderGridInvoiceNmcl(item.invoiceData.invoicingCodes)]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="invoiceData.invoiceDate">Date presta.</vaadin-grid-sorter>
                                        </template>
                                        <template>[[formatDate(item.invoiceData.invoiceDate,'date')]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column-group>
                                        <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                            <template class="header">
                                                <vaadin-grid-sorter path="invoicedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_invoiced','Invoiced',language)]]</vaadin-grid-sorter>
                                            </template>
                                            <template><span class$="invoice-status [[_getTxtStatusColor(item.invoiceStatusHr,item.invoicedAmount)]]">[[item.invoicedAmount]]€</span></template>
                                            <template class="footer">[[_invoicesToBeCorrectedInvoicedAmount(flatrateMenuSection, 'flatFiles')]]€</template>
                                        </vaadin-grid-column>
                                        <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                            <template class="header">
                                                <vaadin-grid-sorter path="refusedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_rej','Rejected',language)]]</vaadin-grid-sorter>
                                            </template>
                                            <template><span class$="invoice-status [[_getTxtStatusColor('force-red',item.refusedAmount)]]">[[item.refusedAmount]]€</span></template>
                                            <template class="footer">[[_invoicesToBeCorrectedRefusedAmount(flatrateMenuSection, 'flatFiles')]]€</template>
                                        </vaadin-grid-column>
                                    </vaadin-grid-column-group>
                                    <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="invoiceStatusHr">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>
                                            <span class="invoice-status invoice-status--redStatus"><iron-icon icon="vaadin:circle" class="statusIcon invoice-status--redStatus"></iron-icon> [[localize('inv_rej','Rejected',language)]]</span>
                                        </template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="1" class="stat-col">
                                        <template><paper-button class="button button--save" on-tap="_flagInvoiceAsCorrected" data-invoice-id$="[[item.invoiceData.id]]" ><iron-icon icon="check-circle" data-message-id$="[[item.id]]" data-invoice-id$="[[item.invoiceData.id]]"></iron-icon> &nbsp; [[localize('corrected',"Corrected",language)]]</paper-button></template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="1" class="stat-col">
                                        <template><paper-button class="button button--other" on-tap="_flagInvoiceAsLostConfirmationDialog" data-invoice-id$="[[item.invoiceData.id]]" ><iron-icon icon="error" data-message-id$="[[item.id]]" data-invoice-id$="[[item.invoiceData.id]]"></iron-icon> &nbsp; [[localize('lost',"Lost",language)]]</paper-button></template>
                                    </vaadin-grid-column>
                                </vaadin-grid>
                            </div>
                        </div>
                    </div>
                </div>
            </template>



            <template is="dom-if" if="[[_isEqual(flatrateMenuSection, 'j20_toBeSend')]]">
                <!--<template is="dom-if" if="[[_showWarningMessageEarlyInvoicingDownload()]]"><div class="warningMessage" id="warningMessageInvoicing"><div class="warningMessageBody"><iron-icon icon="icons:warning" class="w30px h30px"></iron-icon> &nbsp; [[localize('earlyInvoicingDownloadWarningMessage', 'Please only download invoicing at the end of the month', language)]]</div></div></template>-->
                <div class="textAlignCenter">

                    <div class="exportMonthPicker pb20">
                        <div class="exportMonthPickerTitle"><iron-icon icon="vaadin:calendar" style="max-width:20px; max-height:20px; margin-right:7px;"></iron-icon> [[localize('j20_monthToGenerate','Month to generate',language)]]</div>
                        <vaadin-combo-box id="exportedMonth" filtered-items="[[_getExportMonthsList()]]" item-label-path="label" item-value-path="id" label="[[localize('month','Month',language)]]" value="[[_getExportCurrentMonth()]]"></vaadin-combo-box>
                        <vaadin-combo-box id="exportedYear" filtered-items="[[_getExportYearsList()]]" item-label-path="label" item-value-path="id" label="[[localize('year','Year',language)]]" value="[[_getExportCurrentYear()]]"></vaadin-combo-box>

                        <vaadin-checkbox checked="[[overrideBatchNumber]]" on-tap="_overrideBatchNumberGotChanged">[[localize('override_batchnr','Override batch number',language)]]</vaadin-checkbox>
                        <template is="dom-if" if="[[overrideBatchNumber]]"><paper-input label="[[localize('batchnr','Batch number',language)]]" value="{{batchNumber}}" class="batchNumberInput"></paper-input></template>
                    </div>

                    <paper-button class="button button--save tool-btn m-t-20 f-s-1em bordered" id="largeButton" on-tap="_exportFlatRateInvoicing"><iron-icon icon="icons:cloud-download" class="w30px h30px"></iron-icon> &nbsp; [[localize('invoicingExport','Télécharger la facturation',language)]]</paper-button>
                </div>
            </template>



            <template is="dom-if" if="[[_isIn(flatrateMenuSection, 'j20_process\\,j20_accept\\,j20_partiallyAccepted\\,j20_reject\\,j20_archive')]]">
                <div class="invoicesGridContainer">
                    <div class="invoiceContainer">

                        <div id="messagesGridContainer" class="invoiceSubContainerMiddle">
                            <div class="scrollBox">
                                <vaadin-grid id="messagesGrid2" items="[[messagesGridData]]" data-status$="[[_getBatchStatusByMenuSection(flatrateMenuSection)]]" active-item="{{activeGridItem}}" on-tap="_toggleBatchDetails">
                                    <vaadin-grid-column flex-grow="0" width="4%" class="oa-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.parentOaCode">[[localize('inv_oa','Oa',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.messageInfo.parentOaCode]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="24%" class="ref-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.parentOaLabel">[[localize('name','Name',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.messageInfo.parentOaLabel]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="8%" class="invoice-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.batchReference">[[localize('inv_batch_num','Batch reference',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.messageInfo.batchReference]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="8%" class="month-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.invoicedMonth">[[localize('inv_batch_month','Billed month',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.messageInfo.invoicedMonth]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="10%" class="invoiceDate-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.generationDate">[[localize('inv_date_fact','Invoice date',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.messageInfo.generationDate]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="9%" class="invAmount-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.invoicedAmount"> [[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_invoiced','Invoiced',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="invoice-status [[_getTxtStatusColor(item.messageInfo.invoiceStatusHr,item.messageInfo.invoicedAmount)]]">[[item.messageInfo.invoicedAmount]]€</span></template>
                                        <template class="footer">[[_invoicedAmount(flatrateMenuSection, 'flatFiles')]]€</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="9%" class="accAmount-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.acceptedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_acc','Accepted',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="[[_getTxtStatusColor('force-green',item.messageInfo.acceptedAmount)]]">[[item.messageInfo.acceptedAmount]]€</span></template>
                                        <template class="footer">[[_acceptedAmount(flatrateMenuSection, 'flatFiles')]]€</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="9%" class="refAmount-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.refusedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_rej','Rejected',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="[[_getTxtStatusColor('force-red',item.messageInfo.refusedAmount)]]">[[item.messageInfo.refusedAmount]]€</span></template>
                                        <template class="footer">[[_rejectedAmount(flatrateMenuSection, 'flatFiles')]]€</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="9%" class="stat-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.invoiceStatusHr">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="invoice-status [[_getIconStatusClass(item.messageInfo.invoiceStatusHr)]]"><iron-icon icon="vaadin:circle" class$="statusIcon [[_getIconStatusClass(item.messageInfo.invoiceStatusHr)]]"></iron-icon> [[item.messageInfo.invoiceStatusHr]]</span></template>
                                    </vaadin-grid-column>
                                    <!--
                                    <vaadin-grid-column flex-grow="1" class="stat-col">
                                        <template class="header"><vaadin-grid-sorter path="id">[[localize('download',"Télécharger",language)]] PDF</vaadin-grid-sorter></template>
                                        <template><paper-button class="grid-btn-small noBg noPad" on-tap="_downloadParentOaPdf" data-message-id$="[[item.id]]"><iron-icon icon="image:picture-as-pdf" class="force-left textRed" data-message-id$="[[item.id]]"></iron-icon> &nbsp; PDF</paper-button></template>
                                    </vaadin-grid-column>
                                    -->
                                    <vaadin-grid-column flex-grow="1" class="stat-col">
                                        <template class="header"><vaadin-grid-sorter path="id">[[localize('downloadArchive',"Télécharger l'archive",language)]]</vaadin-grid-sorter></template>
                                        <template><paper-button class="button button--other" on-tap="_downloadParentOaArchive" data-message-id$="[[item.id]]"><iron-icon icon="icons:folder" class="force-left" data-message-id$="[[item.id]]"></iron-icon> &nbsp; ZIP</paper-button></template>
                                    </vaadin-grid-column>
                                </vaadin-grid>
                            </div>
                        </div>

                        <div id="invoiceDetailContainer" class="invoiceDetailContainer">
                            <div id="invoiceDetailHeader" class="mb30">
                                <div class="actionButtonsRight">
                                    <template is="dom-if" if="[[_isEqual(flatrateMenuSection, 'j20_process')]]">
                                        <paper-button class="button button--save" on-tap="_acceptBatch"><iron-icon icon="check-circle"></iron-icon> [[localize('j20_accept','Accepted batches',language)]]</paper-button>
                                        <paper-button class="button button button--other" on-tap="_partiallyAcceptBatch"><iron-icon icon="settings-backup-restore"></iron-icon> [[localize('inv_par_acc','Partially accepted',language)]]</paper-button>
                                        <paper-button class="button button button--other" on-tap="_rejectBatch"><iron-icon icon="cancel"></iron-icon> [[localize('j20_reject','Refused batches',language)]]</paper-button>
                                    </template>
                                    <template is="dom-if" if="[[_isIn(flatrateMenuSection, 'j20_accept\\,j20_partiallyAccepted\\,j20_reject')]]">
                                        <paper-button class="button button--other" on-tap="_openArchiveDialogForBatch"><iron-icon icon="markunread-mailbox"></iron-icon> [[localize('j20_archive_batch','Archive batch',language)]]</paper-button>
                                    </template>
                                </div>
                                <h4>[[localize('batchDetails',"Batch details",language)]]<span class="txtcolor--redStatus">[[activeGridItem.messageInfo.batchReference]]</span> [[localize('ofOa',"of OA",language)]] <span class="txtcolor--blueStatus">[[activeGridItem.messageInfo.parentOaCode]] - [[activeGridItem.messageInfo.parentOaLabel]]</span></h4>
                            </div>
                            <vaadin-grid id="invoiceAndBatchesGridDetail" items="[[messageDetailsData]]">
                                <vaadin-grid-column flex-grow="0" width="4%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="oaCode">Oa</vaadin-grid-sorter>
                                    </template>
                                    <template>[[item.oaCode]]</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="15%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="oaLabel">[[localize('name','Name',language)]]</vaadin-grid-sorter>
                                    </template>
                                    <template>[[item.oaLabel]]</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="invoiceData.invoiceReference">N° fact.</vaadin-grid-sorter>
                                    </template>
                                    <template>[[item.invoiceData.invoiceReference]]</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="17%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="patientData.firstName">[[localize('inv_pat','Patient',language)]] </vaadin-grid-sorter>
                                    </template>
                                    <template>[[item.patientData.firstName]] [[item.patientData.lastName]]</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="8%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="patientData.ssin">[[localize('inv_niss','Niss',language)]]</vaadin-grid-sorter>
                                    </template>
                                    <template>[[_formatSsinNumber(item.patientData.ssin)]]</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="9%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="invoiceData.invoicingCodes">Nmcl</vaadin-grid-sorter>
                                    </template>
                                    <template>[[_renderGridInvoiceNmcl(item.invoiceData.invoicingCodes)]]</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column flex-grow="0" width="7%" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="invoiceData.invoiceDate">Date presta.</vaadin-grid-sorter>
                                    </template>
                                    <template>[[formatDate(item.invoiceData.invoiceDate,'date')]]</template>
                                </vaadin-grid-column>
                                <vaadin-grid-column-group>
                                    <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="invoicedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_invoiced','Invoiced',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="invoice-status [[_getTxtStatusColor(item.invoiceStatusHr,item.invoicedAmount)]]">[[item.invoicedAmount]]€</span></template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="acceptedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_acc','Accepted',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="invoice-status [[_getTxtStatusColor('force-green',item.acceptedAmount)]]">[[item.acceptedAmount]]€</span></template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="5%" class="recipient-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="refusedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_rej','Rejected',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="invoice-status [[_getTxtStatusColor('force-red',item.refusedAmount)]]">[[item.refusedAmount]]€</span></template>
                                    </vaadin-grid-column>
                                </vaadin-grid-column-group>
                                <vaadin-grid-column flex-grow="1" class="recipient-col">
                                    <template class="header">
                                        <vaadin-grid-sorter path="invoiceStatusHr">[[localize('inv_stat','Status',language)]]</vaadin-grid-sorter>
                                    </template>
                                    <template>
                                        <span class$="invoice-status [[_getIconStatusClass(item.invoiceStatusHr)]]"><iron-icon icon="vaadin:circle" class$="statusIcon [[_getIconStatusClass(item.invoiceStatusHr)]]"></iron-icon> [[item.invoiceStatusHr]]</span>
                                    </template>
                                </vaadin-grid-column>
                                <!--
                                <vaadin-grid-column flex-grow="1" class="stat-col">
                                    <template class="header"><vaadin-grid-sorter path="id">[[localize('download',"Télécharger",language)]] PDF</vaadin-grid-sorter></template>
                                    <template><paper-button class="grid-btn-small noBg noPad" on-tap="_downloadOaPdfByMessageId" data-message-id$="[[item.id]]"><iron-icon icon="image:picture-as-pdf" class="force-left textRed" data-message-id$="[[item.id]]"></iron-icon> &nbsp; PDF</paper-button></template>
                                </vaadin-grid-column>
                                -->
                                <vaadin-grid-column flex-grow="1" class="stat-col">
                                    <template><paper-button class$="button button button--other [[_showRejectInvoiceButton(item.messageOriginalStatus, item.invoiceFinalStatus)]]" on-tap="_rejectInvoice" data-message-id$="[[item.id]]" data-invoice-id$="[[item.invoiceData.id]]" ><iron-icon icon="cancel" data-message-id$="[[item.id]]" data-invoice-id$="[[item.invoiceData.id]]"></iron-icon> [[localize('rejectVerb',"Reject",language)]]</paper-button></template>
                                </vaadin-grid-column>
                            </vaadin-grid>
                        </div>

                    </div>
                </div>
            </template>



            <template is="dom-if" if="[[_isEqual(flatrateMenuSection, 'j20_reset')]]">
                <div class="invoicesGridContainer">
                    <div class="invoiceContainer">
                        <div id="messagesGridContainer4" class="invoiceSubContainerMiddle">
                            <div class="scrollBox">
                                <vaadin-grid id="messagesGrid3" items="[[messagesGridDataReset]]" data-status$="[[_getBatchStatusByMenuSection(flatrateMenuSection)]]" class="invoicesToBeCorrectedGrid">
                                    <vaadin-grid-column flex-grow="0" width="13%" class="invoice-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.batchReference">[[localize('inv_batch_num','Batch reference',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.messageInfo.batchReference]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="13%" class="month-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.invoicedMonth">[[localize('inv_batch_month','Billed month',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.messageInfo.invoicedMonth]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="13%" class="invoiceDate-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.generationDate">[[localize('inv_date_fact','Invoice date',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template>[[item.messageInfo.generationDate]]</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="11%" class="invAmount-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.invoicedAmount"> [[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_invoiced','Invoiced',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="invoice-status [[_getTxtStatusColor('force-blue', item.totalInvoicedAmount)]]">[[item.totalInvoicedAmount]]€</span></template>
                                        <template class="footer">[[_getSumByDataKey(messagesGridDataReset, 'totalInvoicedAmount')]]€</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="11%" class="accAmount-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.acceptedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_acc','Accepted',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="[[_getTxtStatusColor('force-green',item.totalAcceptedAmount)]]">[[item.totalAcceptedAmount]]€</span></template>
                                        <template class="footer">[[_getSumByDataKey(messagesGridDataReset, 'totalAcceptedAmount')]]€</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="0" width="11%" class="refAmount-col">
                                        <template class="header">
                                            <vaadin-grid-sorter path="messageInfo.refusedAmount">[[localize('inv_batch_amount','Amount',language)]]<br/>[[localize('inv_batch_amount_rej','Rejected',language)]]</vaadin-grid-sorter>
                                        </template>
                                        <template><span class$="[[_getTxtStatusColor('force-red',item.totalRefusedAmount)]]">[[item.totalRefusedAmount]]€</span></template>
                                        <template class="footer">[[_getSumByDataKey(messagesGridDataReset, 'totalRefusedAmount')]]€</template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="1" class="stat-col">
                                        <template class="header"><vaadin-grid-sorter path="id">[[localize('download',"Download",language)]]</vaadin-grid-sorter></template>
                                        <template><paper-button class="button button--other" on-tap="_downloadParentOaArchive" data-message-id$="[[item.id]]"><iron-icon icon="icons:folder" class="force-left" data-message-id$="[[item.id]]"></iron-icon> ZIP</paper-button></template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column flex-grow="1" class="stat-col">
                                        <template class="header"><vaadin-grid-sorter path="id">[[localize('del',"Delete",language)]]</vaadin-grid-sorter></template>
                                        <template><paper-button class="button button--other" on-tap="_confirmDeleteBatch" data-batch-export-tstamp="[[item.metas.batchExportTstamp]]"><iron-icon icon="icons:error" class="force-left"></iron-icon> [[localize('del',"Delete",language)]]</paper-button></template>
                                    </vaadin-grid-column>
                                </vaadin-grid>
                            </div>
                        </div>
                    </div>
                </div>
            </template>








            <ht-pat-flatrate-utils id="flatrateUtils" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" i18n="[[i18n]]" resources="[[resources]]" no-print></ht-pat-flatrate-utils>

            <paper-dialog class="modalDialog" id="archiveDialog">
                <h2 class="modal-title"><iron-icon icon="markunread-mailbox"></iron-icon> [[localize('j20_archive_batch','Archive batch',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p>[[localize('archiveBatchConfirmation',"Voulez-vous vraiment archiver l'envoi",language)]] <b>[[activeGridItem.messageInfo.batchReference]]</b></p>
                    <p>OA <span class="txtcolor--blueStatus">[[activeGridItem.messageInfo.parentOaCode]]</span> [[activeGridItem.messageInfo.parentOaLabel]] ?</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other" dialog-dismiss><iron-icon icon="icons:close"></iron-icon> [[localize('can','Cancel',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_archiveBatch"><iron-icon icon="check-circle"></iron-icon> [[localize('confirm','Confirm',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="missingNihiiDialog" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('incompleteUserProfile','Incomplete user profile',language)]].</p>
                    <p class="">[[localize('provideNihiiNumber','Please provide your number',language)]] <b>[[localize('inami','INAMI',language)]]</b>.</p>
                    <p class="fw700"><iron-icon icon="communication:phone" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other " on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_gotoMyProfileTab1"><iron-icon icon="icons:settings"></iron-icon> [[localize('configure','Configure',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="missingMedicalHouseValorisations" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('incompleteUserProfile','Incomplete user profile',language)]].</p>
                    <p class="">[[localize('provideMissingValorisations','Please provide your flat rates',language)]].</p>
                    <p class="fw700"><iron-icon icon="communication:phone" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other " on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_gotoMyAdmin"><iron-icon icon="icons:settings"></iron-icon>[[localize('configure','Configure',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="noDataToExport" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="">[[localize('noDataToExport','We could not find any data to export',language)]].</p>
                    <p class="fw700"><iron-icon icon="communication:phone" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other " on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="noHcpContactPerson" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('incompleteUserProfile','Incomplete user profile',language)]].</p>
                    <p class=" ">[[localize('missingMhHcpContactPerson1','Please provide an invoicing contact person',language)]].<br />[[localize('missingMhHcpContactPerson2','Required information for Insurances',language)]].</p>
                    <p class="fw700"><iron-icon icon="communication:phone" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other " on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_gotoMyProfileTab1"><iron-icon icon="icons:settings"></iron-icon>[[localize('configure','Configure',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="noHcpBce" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('incompleteUserProfile','Incomplete user profile',language)]].</p>
                    <p class="">[[localize('missingMhBce','Please provide a valid BCE',language)]].</p>
                    <p class="fw700"><iron-icon icon="communication:phone" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other " on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_gotoMyProfileTab2"><iron-icon icon="icons:settings"></iron-icon>[[localize('configure','Configure',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="noHcpBankAccount" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('incompleteUserProfile','Incomplete user profile',language)]].</p>
                    <p class="">[[localize('missingMhBankAccount','Please provide with a valid bank account',language)]].</p>
                    <p class="fw700"><iron-icon icon="communication:phone" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other " on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_gotoMyProfileTab3"><iron-icon icon="icons:settings"></iron-icon>[[localize('configure','Configure',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="exportAlreadyRan" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('flatRateInvoicingAlreadyRan','Incomplete user profile',language)]].</p>
                    <p class="">[[localize('getInTouchWithUsToUnlock','Please provide with a valid bank account',language)]].</p>
                    <p class="fw700"><iron-icon icon="communication:phone" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other " on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="flagInvoiceAsLostConfirmationDialog" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('areYouSureFlagInvoiceAsLost','Are you sure you wish to flag invoice as permanently lost?',language)]]</p>
                    <p class="">[[localize('unrecoverableAction','This action is unrecoverable',language)]].</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other " on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_flagInvoiceAsLost">[[localize('confirm','Confirm',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="deleteBatchDialog">
                <h2 class="modal-title"><iron-icon icon="error"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p>[[localize('mhFlatRateConfirmDeleteBatch','Are you sure you wish to delete this batch?',language)]]</p>
                    <p class="uppercase bold">[[localize('unrecoverableAction','This action is unrecoverable',language)]].</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other" dialog-dismiss><iron-icon icon="icons:close"></iron-icon> [[localize('can','Cancel',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_doDeleteBatch"><iron-icon icon="check-circle"></iron-icon> [[localize('confirm','Confirm',language)]]</paper-button>
                </div>
            </paper-dialog>






        </div>

`;
  }

  static get is() {
      return 'ht-msg-flatrate-invoice';
  }

    static get properties() {
        return {
            api: {
                type: Object
            },
            user: {
                type: Object
            },
            hcp: {
                type : Object
            },
            contactPerson: {
                type : String,
                value: ""
            },
            flatrateMenuSection: {
                type: String,
                observer: '_flatRateListingMenuSectionChanged'
            },
            activeGridItem:{
                type: Object,
                value: function () {
                    return [];
                }
            },
            displayedYear: {
                type: Number,
                value: () => Number(moment().format('YYYY'))
            },
            processing:{
                type: Boolean,
                value: false
            },
            flatRateAllPatients : {
                type: Array,
                value: function () {
                    return [];
                }
            },
            _isLoading: {
                type: Boolean,
                value: false,
                observer: '_loadingStatusChanged'
            },
            _bodyOverlay: {
                type: Boolean,
                value: false
            },
            _isLoadingSmall: {
                type: Boolean,
                value: false
            },
            _loadingMessages: {
                type: Array,
                value: () => []
            },
            oaData: {
                type: Array,
                value: () => []
            },
            archiveListingMessages:{
                type:Object,
                value: {}
            },
            downloadFileName: {
                type: String,
                value: ""
            },
            reportCurrentDateMomentObject: {
                type: Object,
                value: moment()
            },
            flatRateInvoicingDataObject: {
                type: Object,
                value: null
            },
            isMessagesLoaded:{
                type: Boolean,
                value: false,
            },
            _isLoadingMessages:{
                type: Boolean,
                value: false,
            },
            invoiceMessageStatuses: {
                type:Object,
                value: () => ({
                    archived:               { status:(1 << 21), menuSection: "j20_archive", llKey:'inv_arch' },
                    error:                  { status:(1 << 17), menuSection: "j20_toBeCorrected", llKey:'inv_err' },
                    partiallyAccepted:      { status:(1 << 16), menuSection: "j20_partiallyAccepted", llKey:'inv_par_acc' },
                    fullyAccepted:          { status:(1 << 15), menuSection: "j20_accept", llKey:'inv_full_acc' },
                    rejected:               { status:(1 << 12), menuSection: "j20_reject", llKey:'inv_rej' },
                    treated:                { status:(1 << 11), menuSection: "", llKey:'inv_tre' },
                    acceptedForTreatment:   { status:(1 << 10), menuSection: "", llKey:'inv_acc_tre' },
                    successfullySentToOA:   { status:(1 << 9),  menuSection: "", llKey:'inv_succ_tra_oa' },
                    pending:                { status:(1 << 8),  menuSection: "j20_process", llKey:'inv_pen' },
                    reset:                  { menuSection: "j20_reset", llKey:'del' }
                })
            },
            cachedDataTTL: {
                type: Number,
                value: 300000
            },
            messagesCachedData: {
                type: Object,
                value: () => ({
                    cachedTstamp: 0,
                    roughData: [],
                    dataByStatus: {},
                    countByStatus: {
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
                    }
                })
            },
            messageDetailsData: {
                type: Object,
                value: null
            },
            messagesGridData: {
                type: Array,
                value: () => []
            },
            messagesGridDataReset: {
                type: Array,
                value: () => []
            },
            flagInvoiceAsLostId: {
                type: String,
                value: ""
            },
            batchExportTstamp: {
                type: String,
                value: ""
            },
            flatRateCheckList: {
                type: Array,
                value: () => []
            },
            tabs: {
                type: Number,
                value: 0
            },
            batchNumber: {
                type: String,
                value: ""
            },
            overrideBatchNumber:{
                type: Boolean,
                value: false
            }
        };
    }

    constructor() {
        super();
    }

    static get observers() {
    }

    ready() {
        super.ready();
        this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(response =>{
            this.set("hcp",response)
            if(response.contactPersonHcpId){
                this.api.hcparty().getHealthcareParty(response.contactPersonHcpId).then(hcpCt => {
                    this.set("contactPerson", _.trim( _.trim(_.get(hcpCt, "lastName", "")) + " " + _.trim(_.get(hcpCt, "firstName", "")) ));
                })}
        })
    }

    _loadingStatusChanged() {
        if(!this._isLoading) this._resetLoadingMessage();
    }

    _flatRateListingMenuSectionChanged() {

        this.set('_isLoading', false );
        this.set('_isLoadingSmall', false );

        this.set('activeGridItem', null );
        this.set('messageDetailsData', null );
        this.set('messagesGridData', [] );
        this.set('messagesGridDataReset', [] );

        if( this.flatrateMenuSection === "archivej3" ) { this._getListingArchives(); return; }

        if( ['j20_process', 'j20_reject', 'j20_accept', 'j20_partiallyAccepted', 'j20_archive', 'j20_toBeCorrected', 'j20_reset'].indexOf(_.trim(this.flatrateMenuSection)) > -1  ) {

            // Close when opened + unset objects & reset detail grid
            this._toggleBatchDetails();

            if(!!_.size(this.messagesCachedData.dataByStatus)) {
                this.set("messagesGridData", this._getBatchDataByMenuSection(this.flatrateMenuSection, 'flatFiles'))
                this.set("messagesGridDataReset", _.get(this, "messagesCachedData.dataByStatus.reset.flatFiles", []))
                const messagesGrid = this.root.querySelector('#messagesGrid'); messagesGrid && messagesGrid.clearCache();
                const messagesGrid2 = this.root.querySelector('#messagesGrid2'); messagesGrid2 && messagesGrid2.clearCache();
                const messagesGrid3 = this.root.querySelector('#messagesGrid3'); messagesGrid3 && messagesGrid3.clearCache();
                const invGridDetail = this.root.querySelector('#invoiceAndBatchesGridDetail'); invGridDetail && invGridDetail.clearCache();
            } else {
                this._fetchJ20Messages();
            }

        }

    }

    formatDate(d,f) {
        const input = d.toString()
        const yyyy = input.slice(0,4), mm = input.slice(4,6), dd = input.slice(6,8)
        switch(f) {
            case 'date' :
                return `${dd}/${mm}/${yyyy}`;
            case 'month' :
                const monthStr =
                    (mm.toString() === '01') ? this.localize('Jan',this.language) :
                        (mm.toString() === '02') ? this.localize('Feb',this.language) :
                            (mm.toString() === '03') ? this.localize('Mar',this.language) :
                                (mm.toString() === '04') ? this.localize('Apr',this.language) :
                                    (mm.toString() === '05') ? this.localize('May',this.language) :
                                        (mm.toString() === '06') ? this.localize('Jun',this.language) :
                                            (mm.toString() === '07') ? this.localize('Jul',this.language) :
                                                (mm.toString() === '08') ? this.localize('Aug',this.language) :
                                                    (mm.toString() === '09') ? this.localize('Sep',this.language) :
                                                        (mm.toString() === '10') ? this.localize('Oct',this.language) :
                                                            (mm.toString() === '11') ? this.localize('Nov',this.language) :
                                                                this.localize('Dec',this.language)
                return `${monthStr} ${yyyy}`
        }
    }

    _overrideBatchNumberGotChanged(e) {

        this.set("overrideBatchNumber", _.get(_.find(e.path, it => _.get(it,"nodeName") === "VAADIN-CHECKBOX"), "checked", false));

    }

    SEG_getErrSegment_200(zones){
        var erreur = '';

        //Erreur sur le nom du message
        if(zones.find(z => z.zone === "2001") !== '00'){
            if(zones.find(z => z.zone === "2001") === '10'){
                erreur += 'Nom du message => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "2001") === '11'){
                erreur += 'Nom du message => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "2001") === '20'){
                erreur += 'Nom du message => Codification inconnue<br>';
            }else if(zones.find(z => z.zone === "2001") === '21'){
                erreur += 'Nom du message => Message non autorisé pour cet émetteur<br>';
            }else if(zones.find(z => z.zone === "2001") === '22'){
                erreur += 'Nom du message => # de 920000<br>';
            }
        }

        //Erreur sur le n° de version du message
        if(zones.find(z => z.zone === "2011") !== '00'){
            if(zones.find(z => z.zone === "2011") === '10'){
                erreur += 'N° version mess => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "2011") === '11'){
                erreur += 'N° version mess => Erreur format<br>';
            }else if(zones.find(z => z.zone === "2011") === '20'){
                erreur += 'N° version mess => N° de version n\'est plus d\'application<br>';
            }else if(zones.find(z => z.zone === "2011") === '21'){
                erreur += 'N° version mess => N° de version pas encore d\'application<br>';
            }else if(zones.find(z => z.zone === "2011") === '30'){
                erreur += 'N° version mess => N° de version non autorisé pour ce flux<br>';
            }
        }

        //Erreur sur le type de message
        if(zones.find(z => z.zone === "2021") !== '00'){
            if(zones.find(z => z.zone === "2021") === '10'){
                erreur += 'Type de mess => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "2021") === '11'){
                erreur += 'Type de mess => Erreur format<br>';
            }else if(zones.find(z => z.zone === "2021") === '20'){
                erreur += 'Type de mess => Valeur non permise<br>';
            }else if(zones.find(z => z.zone === "2021") === '30'){
                erreur += 'Type de mess => Message test dans un buffer de production (1er car zone 107 = P)<br>';
            }else if(zones.find(z => z.zone === "2021") === '31'){
                erreur += 'Type de mess => Message de production dans un buffer de test (1er car zone 107 = T)<br>';
            }
        }

        //Erreur sur le statut du message
        if(zones.find(z => z.zone === "2031") !== '00'){
            if(zones.find(z => z.zone === "2031") === '10'){
                erreur += 'Statut mess => Erreur format<br>';
            }else if(zones.find(z => z.zone === "2031") === '20'){
                erreur += 'Statut mess => Valeur non permise<br>';
            }
        }

        //Erreur sur la référence message institution ou prestataire de soins
        if(zones.find(z => z.zone === "2041") !== '00'){
            if(zones.find(z => z.zone === "2041") === '10'){
                erreur += 'Réf mess => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "2041") === '11'){
                erreur += 'Réf mess => Erreur format<br>';
            }
        }

        //Erreur sur la référence message O.A
        if(zones.find(z => z.zone === "2051") !== '00'){
            if(zones.find(z => z.zone === "2051") === '10'){
                erreur += 'Réf mess OA => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "2051") === '11'){
                erreur += 'Réf mess OA => Erreur format<br>';
            }
        }

        return erreur;
    }

    SEG_getErrSegment_300(zones){
        var erreur = '';

        //Erreur sur l'année et le mois de facturation
        if(zones.find(z => z.zone === "3001") !== '00'){
            if(zones.find(z => z.zone === "3001") === '10'){
                erreur += 'Année mois fact => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3001") === '11'){
                erreur += 'Année mois fact => Erreur format<br>';
            }else if(zones.find(z => z.zone === "3001") === '20'){
                erreur += 'Année mois fact => Valeur non permise<br>';
            }
        }

        //Erreur sur le n° d'envoi
        if(zones.find(z => z.zone === "3011") !== '00'){
            if(zones.find(z => z.zone === "3011") === '10'){
                erreur += 'N° envoi => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3011") === '11'){
                erreur += 'N° envoi => Erreur format<br>';
            }else if(zones.find(z => z.zone === "3011") === '40'){
                erreur += 'N° envoi => Signalisation de double fichier de facturation transmis<br>';
            }
        }

        //Erreur sur la date de création de la facture
        if(zones.find(z => z.zone === "3021") !== '00'){
            if(zones.find(z => z.zone === "3021") === '10'){
                erreur += 'Date création facture => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3021") === '11'){
                erreur += 'Date création facture => Erreur format<br>';
            }else if(zones.find(z => z.zone === "3021") === '20'){
                erreur += 'Date création facture => Date > date du jour<br>';
            }else if(zones.find(z => z.zone === "3021") === '21'){
                erreur += 'Date création facture => Date invraisemblable ( date < 01/01/2002)<br>';
            }
        }


        //Erreur sur le n° de version des instruction
        if(zones.find(z => z.zone === "3041") !== '00'){
            if(zones.find(z => z.zone === "3041") === '10'){
                erreur += 'N° version instruction => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3041") === '11'){
                erreur += 'N° version instruction => Erreur format<br>';
            }else if(zones.find(z => z.zone === "3041") === '20'){
                erreur += 'N° version instruction => Valeur non permise<br>';
            }else if(zones.find(z => z.zone === "3041") === '21'){
                erreur += 'N° version instruction => Incompatibilité avec valeur reprise en zone 202<br>';
            }
        }

        //Erreur sur le nom de la personne de contact
        if(zones.find(z => z.zone === "3051") !== '00'){
            if(zones.find(z => z.zone === "3051") === '10'){
                erreur += 'Nom personne de contact => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3051") === '11'){
                erreur += 'Nom personne de contact => Erreur format<br>';
            }
        }

        //Erreur sur le prenom de la personne de contact
        if(zones.find(z => z.zone === "3061") !== '00'){
            if(zones.find(z => z.zone === "3061") === '10'){
                erreur += 'Prénom personne de contact => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3061") === '11'){
                erreur += 'Prénom personne de contact => Erreur format<br>';
            }
        }

        //Erreur sur le n° de tel de contact
        if(zones.find(z => z.zone === "3071") !== '00'){
            if(zones.find(z => z.zone === "3071") === '10'){
                erreur += 'N° téléphone => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3071") === '11'){
                erreur += 'N° téléphone => Erreur format<br>';
            }
        }

        //Erreur sur le type de la facture
        if(zones.find(z => z.zone === "3081") !== '00'){
            if(zones.find(z => z.zone === "3081") === '10'){
                erreur += 'Type de la facture => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3081") === '11'){
                erreur += 'Type de la facture => Erreur format<br>';
            }else if(zones.find(z => z.zone === "3081") === '20'){
                erreur += 'Type de la facture => Valeur non permise en fonction du secteur qui émet la facturation';
            }
        }

        //Erreur sur le type de facturation
        if(zones.find(z => z.zone === "3091") !== '00'){
            if(zones.find(z => z.zone === "3091") === '10'){
                erreur += 'Type de facturation => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "3091") === '11'){
                erreur += 'Type de facturation => Erreur format<br>';
            }else if(zones.find(z => z.zone === "3091") === '20'){
                erreur += 'Type de facturation => Valeur non permise en fonction du secteur qui émet la facturation';
            }else if(zones.find(z => z.zone === "3091") === '30'){
                erreur += 'Type de facturation => Valeur # de 1 ou 2 alors que la zone 308 = 3';
            }
        }

        return erreur;

    }

    SEG_getErrSegment_400(zones){
        var erreur = '';

        //Erreur sur le type de record
        if(zones.find(z => z.zone === "4001") !== '00'){
            if(zones.find(z => z.zone === "4001") === '10'){
                erreur +='Type de record => Zone obligatoire<br>';
            }else if(zones.find(z => z.zone === "4001") === '11'){
                erreur += 'Type de record => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "4001") === '20'){
                erreur += 'Type de record => Valeur non permise<br>';
            }
        }

        //Erreur sur le num de mut
        if(zones.find(z => z.zone === "4011") !== '00'){
            if(zones.find(z => z.zone === "4011") === '10'){
                erreur += 'N° de mutualité => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "4011") === '11'){
                erreur +='N° de mutualité => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "4011") === '20'){
                erreur +='N° de mutualité => Numéro inconnu ou codification erronée<br>';
            }else if(zones.find(z => z.zone === "4011") === '21'){
                erreur += 'N° de mutualité => N° de mutualité non retrouvé dans le détail de la facturation<br>';
            }
        }

        //Erreur sur le num fact
        if(zones.find(z => z.zone === "4021") !== '00'){
            if(zones.find(z => z.zone === "4021") === '10'){
                erreur +='N° de facture récapitulative => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "4021") === '11'){
                erreur += 'N° de facture récapitulative => Erreur de format<br>';
            }
        }

        //Erreur sur le signe montant a ou montant demande a
        if(zones.find(z => z.zone === "4041") !== '00'){
            if(zones.find(z => z.zone === "4041") === '11'){
                erreur += 'Montant demandé cpt a => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "4041") === '40'){
                erreur += 'Montant demandé cpt a => Erreur code signe (# de + ou -)<br>';
            }else if(zones.find(z => z.zone === "4041") === '41'){
                erreur +='Montant demandé cpt a => Discordance entre montant ci-mentionné et total du fichier facturation pour la mutualité<br>';
            }else if(zones.find(z => z.zone === "4041") === '20'){
                erreur += 'Montant demandé cpt a => Somme erronée<br>';
            }
        }

        //Erreur sur le signe montant b ou montant demande b
        if(zones.find(z => z.zone === "4061") !== '00'){
            if(zones.find(z => z.zone === "4061") === '11'){
                erreur += 'Montant demandé cpt b => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "4061") === '15'){
                erreur +='Montant demandé cpt b => Zone # de 0 si l\'émetteur n\est pas une institution hospitalière - Zone signe # de «blanc» et émetteur de la facturation # d’une institution hospitalière<br>';
            }else if(zones.find(z => z.zone === "4061") === '40'){
                erreur +='Montant demandé cpt b => Erreur code signe (# de + ou -)';
            }else if(zones.find(z => z.zone === "4061") === '41'){
                erreur +='Montant demandé cpt b => Discordance entre montant ci-mentionné et total du fichier facturation pour la mutualité<br>';
            }else if(zones.find(z => z.zone === "4061") === '20'){
                erreur +='Montant demandé cpt b => Somme erronée<br>';
            }
        }

        //Erreur sur le signe montant a + b ou montant demande a + b
        if(zones.find(z => z.zone === "4081") !== '00'){
            if(zones.find(z => z.zone === "4081") === '11'){
                erreur +='Total montant demandés cpt a + cpt b => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "4081") === '20'){
                erreur +='Total montant demandé cpt a + cpt b => Montant # somme des montants cpt a et cpt b<br>';
            }else if(zones.find(z => z.zone === "4081") === '40'){
                erreur +='Total montant demandé cpt a + cpt b => Erreur code signe (# de + ou -)<br>';
            }
        }

        //Erreur sur le nb d'enreg
        if(zones.find(z => z.zone === "4091") !== '00'){
            if(zones.find(z => z.zone === "4091") === '10'){
                erreur += 'Nb de records détail => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "4091") === '11'){
                erreur +='Nb de records détail => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "4091") === '20'){
                erreur += 'Nb de records détail => Somme erronée<br>';
            }
        }

        //Erreur sur le num de controle par mutualite si 95 ou num de controle de l'envoi si 96
        if(zones.find(z => z.zone === "4101") !== '00'){
            if(zones.find(z => z.zone === "400") === '95'){
                if(zones.find(z => z.zone === "4101") === '10'){
                    erreur += 'N° de contrôle par mutualité => zone obligaoire non complétée<br>';
                }else if(zones.find(z => z.zone === "4101") === '11'){
                    erreur +='N° de contrôle par mutualité => Erreur de format<br>';
                }
            }else if(zones.find(z => z.zone === "400") === '96'){
                if(zones.find(z => z.zone === "4101") === '10'){
                    erreur += 'N° de contrôle de l\'envoi => zone obligaoire non complétée<br>';
                }else if(zones.find(z => z.zone === "4101") === '11'){
                    erreur +='N° de contrôle de l\'envoi => Erreur de format<br>';
                }
            }
        }

        return erreur;
    }

    SEG_getErrSegment_500(zones){
        var erreur = '';

        //Erreur sur le type de record
        if(zones.find(z => z.zone === "5001") !== '00'){
            if(zones.find(z => z.zone === "5001") === '10'){
                erreur +='Type de record => Zone obligatoire<br>';
            }else if(zones.find(z => z.zone === "5001") === '11'){
                erreur += 'Type de record => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "5001") === '20'){
                erreur += 'Type de record => Valeur non permise<br>';
            }
        }

        //Erreur sur le num de mut
        if(zones.find(z => z.zone === "5011") !== '00'){
            if(zones.find(z => z.zone === "5011") === '10'){
                erreur += 'N° de mutualité => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "5011") === '11'){
                erreur +='N° de mutualité => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "5011") === '20'){
                erreur +='N° de mutualité => Numéro inconnu ou codification erronée<br>';
            }else if(zones.find(z => z.zone === "5011") === '21'){
                erreur += 'N° de mutualité => N° de mutualité non retrouvé dans le détail de la facturation<br>';
            }
        }

        //Erreur sur le num fact
        if(zones.find(z => z.zone === "5021") !== '00'){
            if(zones.find(z => z.zone === "5021") === '10'){
                erreur +='N° de facture récapitulative => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "5021") === '11'){
                erreur += 'N° de facture récapitulative => Erreur de format<br>';
            }
        }

        //Erreur sur le signe montant a ou montant demande a
        if(zones.find(z => z.zone === "5041") !== '00'){
            if(zones.find(z => z.zone === "5041") === '11'){
                erreur += 'Montant demandé cpt a => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "5041") === '40'){
                erreur += 'Montant demandé cpt a => Erreur code signe (# de + ou -)<br>';
            }else if(zones.find(z => z.zone === "5041") === '41'){
                erreur +='Montant demandé cpt a => Discordance entre montant ci-mentionné et total du fichier facturation pour la mutualité<br>';
            }else if(zones.find(z => z.zone === "5041") === '20'){
                erreur += 'Montant demandé cpt a => Somme erronée<br>';
            }
        }

        //Erreur sur le signe montant b ou montant demande b
        if(zones.find(z => z.zone === "5061") !== '00'){
            if(zones.find(z => z.zone === "5061") === '11'){
                erreur += 'Montant demandé cpt b => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "5061") === '15'){
                erreur +='Montant demandé cpt b => Zone # de 0 si l\'émetteur n\est pas une institution hospitalière - Zone signe # de «blanc» et émetteur de la facturation # d’une institution hospitalière<br>';
            }else if(zones.find(z => z.zone === "5061") === '40'){
                erreur +='Montant demandé cpt b => Erreur code signe (# de + ou -)';
            }else if(zones.find(z => z.zone === "5061") === '41'){
                erreur +='Montant demandé cpt b => Discordance entre montant ci-mentionné et total du fichier facturation pour la mutualité<br>';
            }else if(zones.find(z => z.zone === "5061") === '20'){
                erreur +='Montant demandé cpt b => Somme erronée<br>';
            }
        }

        //Erreur sur le signe montant a + b ou montant demande a + b
        if(zones.find(z => z.zone === "5081") !== '00'){
            if(zones.find(z => z.zone === "5081") === '11'){
                erreur +='Total montant demandés cpt a + cpt b => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "5081") === '20'){
                erreur +='Total montant demandé cpt a + cpt b => Montant # somme des montants cpt a et cpt b<br>';
            }else if(zones.find(z => z.zone === "5081") === '40'){
                erreur +='Total montant demandé cpt a + cpt b => Erreur code signe (# de + ou -)<br>';
            }
        }

        //Erreur sur le nb d'enreg
        if(zones.find(z => z.zone === "5091") !== '00'){
            if(zones.find(z => z.zone === "5091") === '10'){
                erreur += 'Nb de records détail => Zone obligatoire non complétée<br>';
            }else if(zones.find(z => z.zone === "5091") === '11'){
                erreur +='Nb de records détail => Erreur de format<br>';
            }else if(zones.find(z => z.zone === "5091") === '20'){
                erreur += 'Nb de records détail => Somme erronée<br>';
            }
        }

        //Erreur sur le num de controle par mutualite si 95 ou num de controle de l'envoi si 96
        if(zones.find(z => z.zone === "5101") !== '00'){
            if(zones.find(z => z.zone === "500" === '95')){
                if(zones.find(z => z.zone === "5101") === '10'){
                    erreur += 'N° de contrôle par mutualité => zone obligaoire non complétée<br>';
                }else if(zones.find(z => z.zone === "5101") === '11'){
                    erreur +='N° de contrôle par mutualité => Erreur de format<br>';
                }
            }else if(zones.find(z => z.zone === "500" === '96')){
                if(zones.find(z => z.zone === "5101") === '10'){
                    erreur += 'N° de contrôle de l\'envoi => zone obligaoire non complétée<br>';
                }else if(zones.find(z => z.zone === "5101") === '11'){
                    erreur +='N° de contrôle de l\'envoi => Erreur de format<br>';
                }
            }
        }

        return erreur;
    }

    _toggleRightPanel(){
        this.shadowRoot.getElementById("rightPanel").classList.toggle("opened")
    }

    _showWarningMessageEarlyInvoicingListing() {
        return parseInt(moment().date()) > 5;
    }

    _showWarningMessageEarlyInvoicingDownload() {
        return parseInt(moment().date()) > 8;
    }

    _startOfPreviousMonth() {
        return moment().subtract(1, 'month').startOf('month').format('DD/MM/YYYY')
    }

    _endOfPreviousMonth() {
        return moment().subtract(1, 'month').endOf('month').format('DD/MM/YYYY')
    }

    _closeDialogs() {
        this.set("_bodyOverlay", false);
        _.map( this.shadowRoot.querySelectorAll('.modalDialog'), i=> i && typeof i.close === "function" && i.close() )
    }

    _gotoMyProfileTab1() {
        this._closeDialogs()
        this.dispatchEvent(new CustomEvent('trigger-open-my-profile', { bubbles: true, composed: true, detail: {tabIndex:0} }));
    }

    _gotoMyProfileTab2() {
        this._closeDialogs()
        this.dispatchEvent(new CustomEvent('trigger-open-my-profile', { bubbles: true, composed: true, detail: {tabIndex:1} }));
    }

    _gotoMyProfileTab3() {
        this._closeDialogs()
        this.dispatchEvent(new CustomEvent('trigger-open-my-profile', { bubbles: true, composed: true, detail: {tabIndex:2} }));
    }

    _gotoMyAdmin() {
        this._closeDialogs()
        this.dispatchEvent(new CustomEvent('trigger-goto-admin', { bubbles: true, composed: true, detail: {} }));
    }

    _showRejectInvoiceButton(messageOriginalStatus, invoiceFinalStatus) {
        return _.trim(messageOriginalStatus) !== "partiallyAccepted" ? "displayNone" :
            ( _.trim(invoiceFinalStatus) === "fullyAccepted" ) ? "" :
                "displayNone"
    }

    _isEqual(a,b) {
        return a === b
    }

    _isNotEqual(a,b) {
        return a !== b
    }

    _isIn(needle,haystack) {
        return !!( _.trim(haystack).split(",").indexOf(needle) > -1 );
    }

    _getBatchDataByMenuSection(menuSection, dataSet) {
        const batchDataStatus = this._getBatchStatusByMenuSection(menuSection)
        return _.get(this, "messagesCachedData.dataByStatus."+batchDataStatus+"." + dataSet, false ) || _.get(this, "messagesCachedData.dataByStatus."+batchDataStatus, [] )
    }

    _getBatchStatusByMenuSection(menuSection) {
        return _.get( _.filter(_.toPairs(this.invoiceMessageStatuses), i=>_.trim(_.get(i, "[1].menuSection")) === _.trim(menuSection) ), "[0][0]", [] )
    }

    _getInsuranceTitularyInfo(inputPatientsList=false) {
        return new Promise(resolve =>{
            const insuranceTitularyIds = _.compact(_.uniq(_.filter( (inputPatientsList?inputPatientsList:this.flatRateAllPatients), (i)=>{ return _.trim(_.get(i, "titularyId", "")) }).map(i=>i.titularyId) ));
            return !_.size(insuranceTitularyIds) ? resolve((inputPatientsList?inputPatientsList:this.flatRateAllPatients)) : this.api.patient().getPatientsWithUser(this.user, new models.ListOfIdsDto({ ids: insuranceTitularyIds })).then(results => {
                //this.api.setPreventLogging(false)
                return resolve(
                    _.map((inputPatientsList?inputPatientsList:this.flatRateAllPatients), (i=>{
                        if(!_.trim(_.get(i,"titularyId", "" ))) return i
                        let titularyRecord = _.head(_.filter(results,(j=>{ return _.trim(j.id) === _.get(i,"titularyId", "" ) })))
                        i.titularyLabel = _.upperCase(_.get(titularyRecord, "firstName", "" )) + ' ' + _.upperCase(_.get(titularyRecord, "lastName", "" ))
                        return i
                    }))
                )
            })
        })
    }

    _getListingJ3(e) {

        this.set('_isLoading', true );
        this.api.setPreventLogging();
        this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_2',this.language), icon:"arrow-forward"});

        this.reportCurrentDateString = _.trim(
            parseInt(_.get(this.shadowRoot.getElementById("listingExportedYear")||{}, "value", this._getExportCurrentYear())) +
            ( ( _.trim(_.get(this.shadowRoot.getElementById("listingExportedMonth")||{}, "value", this._getExportCurrentMonth())).length === 1 ? "0" : "" ) + parseInt(_.get(this.shadowRoot.getElementById("listingExportedMonth"), "value", this._getExportCurrentMonth())) ) +
            "01"
        );
        this.reportCurrentDateMomentObject = moment(this.reportCurrentDateString, "YYYYMMDD");

        this._getPatientsByHcp(_.get(this.hcp, "id"))
            .then(hcpPat => {
                this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_3_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                if(!!hcpPat.length) _.forEach(hcpPat, ((singleHcpPat)=>this.flatRateAllPatients.push(singleHcpPat)));
                this.flatRateAllPatients = _.chain(this.flatRateAllPatients).uniqBy('ssin').orderBy(['lastName', 'firstName'],['asc','asc']).value();
                this._getInsuranceTitularyInfo().then( data => {
                    this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_4',this.language), icon:"arrow-forward"});
                    this._getInsurancesData();
                })

            })
            .catch(()=>{this.set('_isLoading', false );})
        ;

    }

    _setLoadingMessage( messageData ) {
        if( messageData.updateLastMessage ) { this._loadingMessages.pop(); }
        this._loadingMessages.push( messageData );
        let loadingContentTarget = this.shadowRoot.querySelectorAll('#loadingContent')[0];
        if(loadingContentTarget) { loadingContentTarget.innerHTML = ''; _.each(this._loadingMessages, (v)=>{ loadingContentTarget.innerHTML += "<p><iron-icon icon='"+v.icon+"' class='"+(v.done?"loadingIcon done":"loadingIcon")+"'></iron-icon>" + v.message + "</p>"; }); }
    }

    _resetLoadingMessage() {
        this._loadingMessages = [];
    }

    _getExportPageHeader(data, isInvoicingExport=false) {

        // Make sure
        this.reportCurrentDateMomentObject = !!_.trim(this.reportCurrentDateString) ? moment(this.reportCurrentDateString, "YYYYMMDD") : this.reportCurrentDateMomentObject;

        return `
                    <article id="" class="page">

                        <table class="boderGrey bleft0 bright0">
                            <tbody>
                                <tr class="bleft0 bright0">
                                    <td width="33%" class="important colorBlue bleft0 bright0 italic">`+ this.localize('flatrateMonthlyInvoicing',this.language) +`</td>
                                    <td width="33%" class="important colorBlue bleft0 bright0 txt-center uppercase italic">`+ this.localize('month_' + parseInt(this.reportCurrentDateMomentObject.format('M')), this.language) + ` `+ this.reportCurrentDateMomentObject.format('YYYY') + `</td>
                                    <td width="33%" class="important colorBlue bleft0 bright0 txt-right small-txt italic lineHeight14px verticalAlignMiddle">`+ this.localize('day_' + parseInt(moment().day()), this.language) + ` ` + moment().format('DD') + ` `+ (this.localize('month_' + parseInt(moment().format('M')), this.language)).toLowerCase() + ` ` + moment().format('YYYY') + `</td>

                                </tr>
                            </tbody>
                        </table>
                        <table class="small-txt boderBottomGrey" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr class="">
                                    <td width="55%">
                ` + (
            isInvoicingExport ?
                `
                            <span class="bold uppercase">${this.flatRateInvoicingDataObject.hcpData.name}</span><br />
                            ${this.flatRateInvoicingDataObject.hcpData.address.street} ${this.flatRateInvoicingDataObject.hcpData.address.houseNumber}` +( _.trim(this.flatRateInvoicingDataObject.hcpData.address.postboxNumber) ? " / " + _.trim(this.flatRateInvoicingDataObject.hcpData.address.postboxNumber) : "" )+ `<br />
                            ${this.flatRateInvoicingDataObject.hcpData.address.postalCode} ${this.flatRateInvoicingDataObject.hcpData.address.city}<br />
                            ` + this.localize('inami',this.language) + `: &nbsp;&nbsp; ${this.flatRateInvoicingDataObject.hcpData.nihiiFormated}<br />
                            ` + this.localize('adm_ctc_per',this.language) + `: &nbsp;&nbsp; ${this.flatRateInvoicingDataObject.hcpData.contactPerson} &nbsp;&nbsp; ${this.flatRateInvoicingDataObject.hcpData.phone}<br />
                            ` + this.localize('bankAccountNumber',this.language) + `: &nbsp;&nbsp; ${this.flatRateInvoicingDataObject.hcpData.financialInfo.bankAccountFormated}<br />
                        ` :
                `
                            <span class="bold uppercase">${_.get(this.user, "name", "")}</span><br />
                            ${_.get(this.hcp, "addresses[0].street", "")} ${_.get(this.hcp, "addresses[0].houseNumber", "")}<br />
                            ${_.get(this.hcp, "addresses[0].postalCode", "")} ${_.get(this.hcp, "addresses[0].city", "")}<br />
                            ` + this.localize('inami',this.language) + `: &nbsp;&nbsp; ${_.get(this.hcp, "nihii", "")}<br />
                            ` + this.localize('adm_ctc_per',this.language) + `: &nbsp;&nbsp; ${this.contactPerson} &nbsp;&nbsp; ${_.get(this.hcp, "addresses[0].telecoms[0].telecomNumber", "")}<br />
                        `
        ) + `
                                </td>
                                <td width="45%">
                                    <table class="borderOa"><tbody><tr><td class="fs11">
                                        <b>` +_.get(data, "code", "") + ` &nbsp;&nbsp; ` +_.get(data, "finalName", "") + `</b><br /><br />
                                        ` +_.get(data, "address", "") + `<br />
                                        ` +_.get(data, "city", "") + ` ` +_.get(data, "postalCode", "") + `<br />
                                    </td></tr></tbody></table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `
            ;

    }

    _getExportListHeader(listIndex, isInvoicingExport=false) {

        return `
                    <table id="documentHeader" class="boderBottomGrey" cellspacing="0" cellpadding="0">
                        <tbody>
                            <tr class="">
                                <td width="100%">
                                    <span class="bold uppercase colorBlue fs12">` + this.localize("flatrate_" + ( isInvoicingExport ? "invoicing" : "list") + "_"+listIndex+"_header","flatrate_" + ( isInvoicingExport ? "invoicing" : "list") + "_"+listIndex+"_header",this.language) + `</span><br />
                                    <span class="bold uppercase colorBlue fs10">` + this.localize("flatrate_" + ( isInvoicingExport ? "invoicing" : "list") + "_"+listIndex+"_subheader","flatrate_" + ( isInvoicingExport ? "invoicing" : "list") + "_"+listIndex+"_subheader",this.language) + `</span><br />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                `;

    }

    _getExportListContent(listIndex,listEntries) {

        let contentToReturn = "";

        // Lists 1 & 2 don't require unsubscription infos
        if( parseInt(listIndex)<3 ) {

            contentToReturn += `
                        <table id="contentBodyTable" class="mt10" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr class="fs10 colorBlue italic bold txt-left pb10">
                                    <td class="contentBodyHeader" width="5%">` + this.localize("flatrate_column_1","flatrate_column_1",this.language) + `</td>
                                    <td class="contentBodyHeader" width="30%">` + this.localize("flatrate_column_2","flatrate_column_2",this.language) + `</td>
                                    <td class="contentBodyHeader" width="10%">` + this.localize("flatrate_column_3","flatrate_column_3",this.language) + `</td>
                                    <td class="contentBodyHeader" width="10%">` + this.localize("flatrate_column_4","flatrate_column_4",this.language) + `</td>
                                    <td class="contentBodyHeader" width="6%">` + this.localize("flatrate_column_5","flatrate_column_5",this.language) + `</td>
                                    <td class="contentBodyHeader" width="11%">` + this.localize("flatrate_column_6","flatrate_column_6",this.language) + `</td>
                                    <td class="contentBodyHeader" width="13%">` + this.localize("flatrate_column_7","flatrate_column_7",this.language) + `</td>
                                    <td class="contentBodyHeader" width="5%">` + this.localize("flatrate_column_8","flatrate_column_8",this.language) + `</td>
                                    <td class="contentBodyHeader" width="10%">` + this.localize("flatrate_column_9","flatrate_column_9",this.language) + `</td>
                                </tr>
                            </thead>
                        <tbody>`

            _.forEach(listEntries, (singleEntry)=>{
                _.forEach(singleEntry, _.trim);
                contentToReturn += `
                                <tr class="fs9 borderTopLightThinGrey pt2 pb2">
                                    <td width="5%" class="">`+_.get(singleEntry, "externalId", "")+`</td>
                                    <td width="30%" class="">`+_.get(singleEntry, "lastName", "")+` `+_.get(singleEntry, "firstName", "")+`</td>
                                    <td width="10%" class="">`+_.get(singleEntry, "dateOfBirth", "")+`</td>
                                    <td width="10%" class="bold">`+_.get(singleEntry, "ssin", "")+`</td>
                                    <td width="6%" class="">`+_.get(singleEntry, "finalInsurability.parameters.tc1", "")+``+_.get(singleEntry, "finalInsurability.parameters.tc2", "")+`</td>
                                    <td width="11%" class="">`+(parseInt(_.get(singleEntry, "medicalHouseContracts[0].startOfContract",0))?moment(_.get(singleEntry, "medicalHouseContracts[0].startOfContract",0)+"","YYYYMMDD").format("DD/MM/YYYY"):"")+`</td>
                                    <td width="13%" class="colorGreen">`+(parseInt(_.get(singleEntry, "medicalHouseContracts[0].startOfCoverage",0))?moment(_.get(singleEntry, "medicalHouseContracts[0].startOfCoverage",0)+"","YYYYMMDD").format("DD/MM/YYYY"):"")+`</td>
                                    <td width="5%" class="">`+_.get(singleEntry, "insurancePersonType", "")+`</td>
                                    <td width="10%" class="">`+_.get(singleEntry, "titularyLabel", "")+`</td>
                                </tr>`
            })

        } else {

            // We don't show flatrate_column_12 (reason) anymore as already in page header

            contentToReturn += `
                        <table id="contentBodyTable" class="mt10" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr class="fs10 colorBlue italic bold txt-left pb10">
                                    <td class="contentBodyHeader" width="4%">` + this.localize("flatrate_column_1",this.language) + `</td>
                                    <td class="contentBodyHeader" width="19%">` + this.localize("flatrate_column_2",this.language) + `</td>
                                    <td class="contentBodyHeader" width="9%">` + this.localize("flatrate_column_3",this.language) + `</td>
                                    <td class="contentBodyHeader" width="9%">` + this.localize("flatrate_column_4",this.language) + `</td>
                                    <td class="contentBodyHeader" width="6%">` + this.localize("flatrate_column_5",this.language) + `</td>
                                    <td class="contentBodyHeader" width="9%">` + this.localize("flatrate_column_6",this.language) + `</td>
                                    <td class="contentBodyHeader" width="9%">` + this.localize("flatrate_column_7",this.language) + `</td>
                                    <td class="contentBodyHeader" width="8%">` + this.localize("flatrate_column_10",this.language) + `</td>
                                    <td class="contentBodyHeader" width="8%">` + this.localize("flatrate_column_11",this.language) + `</td>
                                    <!--<td class="contentBodyHeader" width="6%">` + this.localize("flatrate_column_12",this.language) + `</td>-->
                                    <td class="contentBodyHeader" width="4%">` + this.localize("flatrate_column_8",this.language) + `</td>
                                    <td class="contentBodyHeader" width="15%">` + this.localize("flatrate_column_9",this.language) + `</td>
                                </tr>
                            </thead>
                        <tbody>`

            _.forEach(listEntries, (singleEntry)=>{
                _.forEach(singleEntry, _.trim);
                contentToReturn += `
                                <tr class="fs9 borderTopLightThinGrey pt2 pb2">
                                    <td width="4%" class="">`+_.get(singleEntry, "externalId", "")+`</td>
                                    <td width="19%" class="">`+_.get(singleEntry, "lastName", "")+` `+_.get(singleEntry, "firstName", "")+`</td>
                                    <td width="9%" class="">`+_.get(singleEntry, "dateOfBirth", "")+`</td>
                                    <td width="9%" class="bold">`+_.get(singleEntry, "ssin", "")+`</td>
                                    <td width="6%" class="">`+_.get(singleEntry, "finalInsurability.parameters.tc1", "")+``+_.get(singleEntry, "finalInsurability.parameters.tc2", "")+`</td>
                                    <td width="9%" class="">`+(parseInt(_.get(singleEntry, "medicalHouseContracts[0].startOfContract",0))?moment(_.get(singleEntry, "medicalHouseContracts[0].startOfContract",0)+"","YYYYMMDD").format("DD/MM/YYYY"):"")+`</td>
                                    <td width="9%" class="colorGreen">`+(parseInt(_.get(singleEntry, "medicalHouseContracts[0].startOfCoverage",0))?moment(_.get(singleEntry, "medicalHouseContracts[0].startOfCoverage",0)+"","YYYYMMDD").format("DD/MM/YYYY"):"")+`</td>
                                    <td width="8%" class="colorRed">`+(parseInt(_.get(singleEntry, "medicalHouseContracts[0].endOfContract",0))?moment(_.get(singleEntry, "medicalHouseContracts[0].endOfContract",0)+"","YYYYMMDD").format("DD/MM/YYYY"):"")+`</td>
                                    <td width="8%" class="colorRed">`+(parseInt(_.get(singleEntry, "medicalHouseContracts[0].endOfCoverage",0))?moment(_.get(singleEntry, "medicalHouseContracts[0].endOfCoverage",0)+"","YYYYMMDD").format("DD/MM/YYYY"):"")+`</td>
                                    <!--<td width="6%" class="">`+_.get(singleEntry, "medicalHouseContracts[0].suspensionReason","")+`</td>-->
                                    <td width="4%" class="">`+_.get(singleEntry, "insurancePersonType", "")+`</td>
                                    <td width="15%" class="">`+_.get(singleEntry, "titularyLabel", "")+`</td>
                                </tr>`
            })

        }

        contentToReturn += `</tbody></table>`

        return contentToReturn;

    }

    _getExportListContentForInvoicing(listIndex,listEntries) {

        let contentToReturn = "";

        contentToReturn += `
                    <table id="contentBodyTable" class="mt10" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr class="fs10 colorBlue italic bold txt-left pb10">
                                <td class="contentBodyHeader underlined" width="10%">` + this.localize("flatrate_invoicing_column_1",this.language) + `</td>
                                <td class="contentBodyHeader" width="5%">` + this.localize("flatrate_column_1",this.language) + `</td>
                                <td class="contentBodyHeader" width="21%">` + this.localize("flatrate_column_2",this.language) + `</td>
                                <td class="contentBodyHeader" width="9%">` + this.localize("flatrate_column_4",this.language) + `</td>
                                <td class="contentBodyHeader" width="9%">` + this.localize("flatrate_column_3",this.language) + `</td>
                                <td class="contentBodyHeader" width="8%">` + this.localize("flatrate_column_6",this.language) + `</td>
                                <td class="contentBodyHeader" width="6%">` + this.localize("flatrate_column_5",this.language) + `</td>
                                <td class="contentBodyHeader txt-center" width="6%">M</td>
                                <td class="contentBodyHeader txt-center" width="6%">K</td>
                                <td class="contentBodyHeader txt-center" width="6%">I</td>
                                <td class="contentBodyHeader txt-center" width="7%">MKI tot.</td>
                                <td class="contentBodyHeader txt-center" width="7%">` + this.localize("month",this.language) + `</td>
                            </tr>
                        </thead>
                    <tbody>`

        _.forEach(listEntries, (singleEntry)=>{
            _.forEach(singleEntry, _.trim);

            // Old way, based on profile
            // let gpPrice = !_.get(singleEntry, "finalMedicalHouseContracts.gp", false ) ? 0 : this.api._powRoundFloatByPrecision( parseFloat( _.get( _.filter(this.flatRateInvoicingDataObject.hcpValorisationsCurrentMonth, {code:"109616"}), "[0].price", 0 ) ), 2 )
            // let kinePrice = !_.get(singleEntry, "finalMedicalHouseContracts.kine", false ) ? 0 :  this.api._powRoundFloatByPrecision( parseFloat( _.get( _.filter(this.flatRateInvoicingDataObject.hcpValorisationsCurrentMonth, {code:"509611"}), "[0].price", 0 ) ), 2 )
            // let nursePrice = !_.get(singleEntry, "finalMedicalHouseContracts.nurse", false ) ? 0 :  this.api._powRoundFloatByPrecision( parseFloat( _.get( _.filter(this.flatRateInvoicingDataObject.hcpValorisationsCurrentMonth, {code:"409614"}), "[0].price", 0 ) ), 2 )
            // let totalPriceMKI = this.api._powRoundFloatByPrecision( (parseFloat(gpPrice) + parseFloat(kinePrice) + parseFloat(nursePrice)), 2 )
            //
            // // Lists 5 & 6 = NEW subscribers => sum both current & previous (export month) valorisations
            // if([5,6].indexOf(listIndex) > -1) {
            //     gpPrice = !_.get(singleEntry, "finalMedicalHouseContracts.gp", false ) ? gpPrice : parseFloat(parseFloat(gpPrice) + parseFloat(this.api._powRoundFloatByPrecision( parseFloat( _.get( _.filter(this.flatRateInvoicingDataObject.hcpValorisationsPreviousMonth, {code:"109616"}), "[0].price", 0 ) ), 2 )))
            //     kinePrice = !_.get(singleEntry, "finalMedicalHouseContracts.kine", false ) ? kinePrice : parseFloat(parseFloat(kinePrice) + parseFloat(this.api._powRoundFloatByPrecision( parseFloat( _.get( _.filter(this.flatRateInvoicingDataObject.hcpValorisationsPreviousMonth, {code:"509611"}), "[0].price", 0 ) ), 2 )))
            //     nursePrice = !_.get(singleEntry, "finalMedicalHouseContracts.nurse", false ) ? nursePrice : parseFloat(parseFloat(nursePrice) + parseFloat(this.api._powRoundFloatByPrecision( parseFloat( _.get( _.filter(this.flatRateInvoicingDataObject.hcpValorisationsPreviousMonth, {code:"409614"}), "[0].price", 0 ) ), 2 )))
            //     totalPriceMKI = parseFloat(this.api._powRoundFloatByPrecision( (parseFloat(gpPrice) + parseFloat(kinePrice) + parseFloat(nursePrice)), 2 ))
            // }

            // New way, based on invoices
            let gpPrice = this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.filter( _.get(singleEntry, "invoicingCodes"), {code:"109616"} ), "totalAmount" ) ), 2 )
            let kinePrice = this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.filter( _.get(singleEntry, "invoicingCodes"), {code:"509611"} ), "totalAmount" ) ), 2 )
            let nursePrice = this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.filter( _.get(singleEntry, "invoicingCodes"), {code:"409614"} ), "totalAmount" ) ), 2 )
            let totalPriceMKI = this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.get(singleEntry, "invoicingCodes"), "totalAmount" ) ), 2 )

            // _.get(singleEntry, "invoices[0].invoiceReference") => From local invoices model
            // _.get(singleEntry, "invoiceNumber") => From FHC flat files

            contentToReturn += `
                        <tr class="fs9 borderTopLightThinGrey pt2 pb2">
                            <td width="10%" class="bold underlined">`+_.get(singleEntry, "invoices[0].invoiceReference")+`</td>
                            <td width="5%" class="">`+_.get(singleEntry, "externalId", "")+`</td>
                            <td width="21%" class="">`+_.get(singleEntry, "lastName", "")+` `+_.get(singleEntry, "firstName", "")+`</td>
                            <td width="9%" class="bold">`+_.get(singleEntry, "ssin", "")+`</td>
                            <td width="9%" class="">`+_.get(singleEntry, "dateOfBirth", "")+`</td>
                            <td width="8%" class="">`+(parseInt(_.get(singleEntry, "finalMedicalHouseContracts.startOfContract",0))?moment(_.get(singleEntry, "finalMedicalHouseContracts.startOfContract",0)+"","YYYYMMDD").format("DD/MM/YYYY"):"")+`</td>
                            <td width="6%" class="">`+_.get(singleEntry, "finalInsurability.parameters.tc1", "")+``+_.get(singleEntry, "finalInsurability.parameters.tc2", "")+`</td>
                            <td width="6%" class="txt-center" >` + this.api.hrFormatNumber(_.trim(gpPrice)) + ` €</td>
                            <td width="6%" class="txt-center" >` + this.api.hrFormatNumber(_.trim(kinePrice)) + ` €</td>
                            <td width="6%" class="txt-center" >` + this.api.hrFormatNumber(_.trim(nursePrice)) + ` €</td>
                            <td width="7%" class="txt-center bold" >` + this.api.hrFormatNumber(_.trim(totalPriceMKI)) + ` €</td>
                            <td width="7%" class="txt-center" >` + _.trim(this.reportCurrentDateMomentObject.format('YYYY')) + "/" + _.trim(this.reportCurrentDateMomentObject.format('MM')) + `</td>
                        </tr>`
        })

        contentToReturn += `</tbody></table>`

        return contentToReturn;

    }

    _getExportPageFooter(currentPage,totalPages,oaCode, isInvoicingExport=false) {

        // Make sure
        this.reportCurrentDateMomentObject = !!_.trim(this.reportCurrentDateString) ? moment(this.reportCurrentDateString, "YYYYMMDD") : this.reportCurrentDateMomentObject;

        return `
                    </article>
                    <article class="footerContainer">
                        <table class="boderGreyTop pageFooter">
                            <tbody>
                                <tr class="fs9 bold">
                                    <td width="40%" class="colorBlue txt-left italic">`+ ( isInvoicingExport ? "" : this.localize('flatrate_footer_reply_before',this.language) ) +`</td>
                                    <td width="20%" class="colorBlue txt-center italic underlined">`+ this.localize('month_' + parseInt(this.reportCurrentDateMomentObject.format('M')), this.language) + ` `
            + this.reportCurrentDateMomentObject.format('YYYY')
            + (isInvoicingExport ? ` ` + this.localize("batch_nr", "N° envoi") + `:` + this.getUniqueSendNr(this.flatRateInvoicingDataObject.exportedDate) : ``)  +  `</td>
                                    <td width="40%" class="colorBlue txt-right italic">`+this.localize('page',this.language)+` `+currentPage+` `+this.localize('on',this.language)+` `+totalPages+` - Mut. `+oaCode+`</td>
                                </tr>
                            </tbody>
                        </table>
                    </article>
                `;
    }

    _getExportPdfFooter() {
        return "</body></html>";
    }

    _getExportPdfHeader() {

        return `<html>
                            <head>
                                <style>

                                    body {margin: 0;}
                                    @page {size: A4; margin: 0; }

                                    article.page {
                                        width: 210mm;
                                        height: 283mm;
                                        padding: 20px;
                                        overflow:hidden;
                                    }
                                    article.footerContainer {
                                        width: 210mm;
                                        padding: 20px;
                                    }

                                    article.page:last-child { border-bottom: 0; }
                                    @media print { article.page { border-bottom: 0; } }

                                    table {
                                        display: table;
                                        box-sizing: border-box;
                                        border-spacing: 0;
                                        border-collapse: collapse;
                                        width: 100%;
                                        padding:0;
                                        margin:0;
                                    }

                                    table thead {font-size: 14px}
                                    table tr,
                                    table td {
                                        margin: 0;
                                        padding: 0;
                                        vertical-align: top;
                                    }
                                    table td {padding: 5px;}
                                    table.border,
                                    table.border tr,
                                    table.border td { border: 1px solid black; }
                                    table.boderGrey,
                                    table.boderGrey tr,
                                    table.boderGrey td {border: 2px solid #bbbbbb;}
                                    table.boderGreyTop,
                                    table.boderGreyTop tr,
                                    table.boderGreyTop td {border-top: 2px solid #bbbbbb;}
                                    .boderBottomGrey {border-bottom: 2px solid #bbbbbb;}
                                    *.half td {width: 50%;}
                                    *.no-border * {border: none !important;}

                                    #factBody {
                                        display: flex;
                                        flex-direction: column;
                                        flex: 1;
                                        border: 0px;
                                    }
                                    #factBody * {border: none;}
                                    #factBody > * {
                                        display: flex;
                                        flex-direction: column;
                                    }
                                    #factBody > * > tr.border > td {border-right: 0;}
                                    #factBody > * > tr.border > td:last-child {border-right: 0;            }
                                    #factBody .table-entry td {border: none; border-top: .3px solid lightgrey; margin-top:5px; }
                                    .factBody td {border: none; border-top: .3px solid lightgrey; margin-top:5px; }
                                    #factBody .row-total > td {text-align: right;}
                                    #factBody .row-total > td:first-child {text-align: left;}

                                    .txt-center {text-align: center!important;}
                                    .txt-right {text-align: right;}
                                    .txt-left tr td, .txt-left td, .txt-left {text-align: left;}
                                    .mt5 {margin-top: 5px!important;}
                                    .mt3 {margin-top: 3px!important;}
                                    .mb5 {margin-bottom: 5px!important;}
                                    .mt10 {margin-top: 10px!important;}
                                    .mt20 {margin-top: 20px!important;}
                                    .bleft0 {border-left:0!important;}
                                    .bright0 {border-right:0!important;}
                                    .bleft {border-left:1px solid black !important;}
                                    .bleft-light {border-left:1px solid lightgrey !important;}
                                    .bbottom-light {border-bottom:1px solid lightgrey !important;}
                                    .btop0 {border-top: 0!important;}
                                    .bbottom0 {border-bottom: 0 !important;}
                                    .nopad {padding: 0;}

                                    td.important { font-weight: bold; font-size: 1.1em; }
                                    td.indic {font-weight: 700;}
                                    .bold {font-weight: 700!important;}
                                    .bold td {font-weight: 700!important;}
                                    *.min-txt {font-size: 11px;}
                                    .small-txt {font-size: 11px!important;}
                                    .fs9 tr td, .fs9 td, .fs9 {font-size: 9px!important;}
                                    .fs10 tr td, .fs10 td, .fs10 {font-size: 10px!important;}
                                    .fs11 tr td, .fs11 td, .fs11 {font-size: 11px!important;}
                                    .fs12 tr td, .fs12 td, .fs12 {font-size: 12px!important;}
                                    .fs13 tr td, .fs13 td, .fs13 {font-size: 13px!important;}
                                    .fs14 tr td, .fs14 td, .fs14 {font-size: 14px!important;}
                                    .fs15 tr td, .fs15 td, .fs15 {font-size: 15px!important;}
                                    .colorRed { color:#ff0000!important;}
                                    .colorGreen { color:#02a102!important;}
                                    .colorBlue { color:#101079!important;}
                                    .uppercase {text-transform:uppercase!important;}
                                    .italic {font-style:italic!important;}
                                    .underlined {text-decoration:underline!important;}
                                    .verticalAlignMiddle tr td, .verticalAlignMiddle {vertical-align: middle!important;}
                                    .borderOa tr td { border:3px solid #101079!important;}
                                    tr.bold td, .bold { font-weight:700!important;}
                                    .padding0, .padding0 td {padding:0;}
                                    .margin0, .margin td {margin:0;}

                                    #contentBodyTable, #contentBodyTable tr, #contentBodyTable tr { width:100%; margin:0; padding:0; border:0; vertical-align:top }
                                    #contentBodyTable tr td { padding:0; border:0; margin:0; vertical-align:top }
                                    .borderTopLightThinGrey td { border-top: .3px solid lightgrey!important; }
                                    .pt2, .pt2 td { padding-top:2px!important; }
                                    .pb2, .pb2 td { padding-bottom:2px!important; }
                                    .pb5, .pb5 td { padding-bottom:5px!important; }
                                    .pb10, .pb10 td { padding-bottom:10px!important; }

                                    .pageFooter {
                                        page-break-after: always;
                                    }

                                </style>
                                </head>
                                <body>`

    }

    _getMyHcps() {

        return this.api.getRowsUsingPagination(
            (key,docId) =>
                this.api.hcparty().listHealthcareParties( key /* && JSON.stringify(key)*/, docId, 1000)
                    .then(pl => {
                        pl.rows = _
                            .chain(pl.rows)
                            .filter((i)=>{return(
                                !!i
                                && !!_.trim(_.get(i,"nihii", ""))
                                && !!_.trim(_.get(i,"ssin", ""))
                                && _.trim(_.get(i,"parentId", "")) === _.trim(_.get(this,"user.healthcarePartyId", ""))
                            )})
                            .uniqBy( 'nihii' )
                            .value()
                        ;
                        return {
                            rows:pl.rows,
                            nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                            nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                            done: !pl.nextKeyPair
                        }
                    })
                    .catch(()=>{ return Promise.resolve(null); })
        )||[];

    }

    _getPatientsByHcp( hcpId ) {

        return this.api.getRowsUsingPagination(
            (key,docId) =>
                this.api.patient().listPatientsByHcPartyWithUser(this.user, hcpId, null, key && JSON.stringify(key), docId, 1000)
                    .then(pl => {
                        pl.rows = _
                            .chain(pl.rows)
                            .filter((i)=>{return(
                                !!i
                                && !!_.get(i,"active", true)
                                && !!_.trim(_.get(i,"dateOfBirth", ""))
                                && !!_.trim(_.get(i,"ssin", ""))
                                && !!_.size(_.get(i,"insurabilities", []))

                                // Make sure there is at least one valid insurance versus exported date
                                && !!_.size(
                                    _.chain(i.insurabilities)
                                        .filter(i=>{return(
                                            !!i
                                            // && i.identificationNumber
                                            && !!_.trim(_.get(i,"insuranceId", ""))
                                            && _.trim(_.get(i, "parameters.tc1", "")).length === 3
                                            && _.trim(_.get(i, "parameters.tc2", "")).length === 3
                                            && ( _.trim(_.get(i, "parameters.tc1", "")) + _.trim(_.get(i, "parameters.tc2", "")) !== "000000" )
                                            && (
                                                moment(_.get(i, "startDate"+"", 0), 'YYYYMMDD').isBefore(this.reportCurrentDateMomentObject, 'date') ||
                                                moment(_.get(i, "startDate"+"", 0), 'YYYYMMDD').isSame(this.reportCurrentDateMomentObject, 'date') ||
                                                !parseInt(_.get(i, "startDate", 0))
                                            )
                                            && (
                                                moment(_.get(i, "endDate"+"", 0), 'YYYYMMDD').isAfter(this.reportCurrentDateMomentObject, 'date') ||
                                                moment(_.get(i, "endDate"+"", 0), 'YYYYMMDD').isSame(this.reportCurrentDateMomentObject, 'date') ||
                                                !parseInt(_.get(i, "endDate", 0))
                                            )
                                        )})
                                        .value()
                                )
                                && !!_.size(_.get(i, "medicalHouseContracts", []))
                                && !!_.size(_.filter(_.get(i, "medicalHouseContracts",[]), i => _.trim(_.get(i,"hcpId", "something")) === _.trim(_.get(this,"user.healthcarePartyId","else"))))
                            )})
                            .uniqBy( 'ssin' )
                            .value()
                            .map((i) => {
                                i.ssin = _.trim(_.get(i,"ssin","")).replace(/[^\d]/gmi,"")
                                i.lastName = (_.get(i,"lastName","")).toUpperCase()
                                i.firstName = (_.get(i,"firstName","")).toUpperCase()
                                i.dateOfBirth = (!!_.trim(_.get(i,"dateOfBirth",""))?moment(_.trim(_.get(i,"dateOfBirth",0)), "YYYYMMDD").format('DD/MM/YYYY'):"")

                                // Eval "finalInsurability" to be the one corresponding to exported date
                                i.finalInsurability = _.get(
                                    _.filter(
                                        i.insurabilities,
                                        (ins) => {
                                            return ins &&
                                                _.size(ins) &&
                                                !!_.trim(_.get( ins, "insuranceId", "" )) &&
                                                _.trim(_.get(ins, "parameters.tc1", "")).length === 3 &&
                                                _.trim(_.get(ins, "parameters.tc2", "")).length === 3 &&
                                                ( _.trim(_.get(ins, "parameters.tc1", "")) + _.trim(_.get(ins, "parameters.tc2", "")) !== "000000" ) &&
                                                // !!_.trim(_.get( ins, "identificationNumber", "" ) ) &&
                                                (
                                                    moment(_.get(ins, "startDate"+"", 0), 'YYYYMMDD').isBefore(this.reportCurrentDateMomentObject, 'date') ||
                                                    moment(_.get(ins, "startDate"+"", 0), 'YYYYMMDD').isSame(this.reportCurrentDateMomentObject, 'date') ||
                                                    !parseInt(_.get(ins, "startDate", 0))
                                                ) &&
                                                (
                                                    moment(_.get(ins, "endDate"+"", 0), 'YYYYMMDD').isAfter(this.reportCurrentDateMomentObject, 'date') ||
                                                    moment(_.get(ins, "endDate"+"", 0), 'YYYYMMDD').isSame(this.reportCurrentDateMomentObject, 'date') ||
                                                    !parseInt(_.get(ins, "endDate", 0))
                                                )
                                        }
                                    ), "[0]", {}
                                )
                                i.insurancePersonType = !_.trim( _.get( i, "finalInsurability.titularyId", "" )) ? "T" : ( moment().diff(moment(_.get(i, "dateOfBirth"+"", "0")+"", "DD/MM/YYYY"), 'years') < 18 ) ? "E" : "C"
                                i.titularyId = _.trim( _.get( i, "finalInsurability.titularyId", "" ))
                                return i
                            })
                        ;
                        return {
                            rows:pl.rows,
                            nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                            nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                            done: !pl.nextKeyPair
                        }
                    })
                    .catch(()=>{ return Promise.resolve(); })
        )||[];

    }

    _getInsurancesData() {

        this.api.insurance().getInsurances(new models.ListOfIdsDto({ids : _.compact(_.chain(this.flatRateAllPatients).map((i)=>{return (i && !!_.get(i,"finalInsurability",false)) ? _.get(i,"finalInsurability.insuranceId",false) : false }).uniq().value())}))
            .then((ins) => {
                this.oaData = _
                    .chain(ins)
                    .map((i)=>{ i.finalName = (i && i.name && i.name[this.language]) ? i.name[this.language] : i.name[(this.language==='fr' ? 'nl' : 'fr')]; return i; })
                    .sortBy((i)=>{ return _.get(i,"code",""); })
                    .value();
                this._generateJ3FileAndDownload();
            })
            .catch((e)=>{
                console.log('_getInsurancesData',e)
                this.set('_isLoading', false );
            });

    }

    getDestCode(affCode){
        let destCode = affCode;
        if (affCode.startsWith("3")) {
            if (["304", "305", "309", "311", "315", "317", "319", "322", "323", "325"].includes(affCode)) {
                destCode = "300";
            } else {
                destCode ="306";
            }
        } else if (affCode.startsWith("4")) {
            destCode =  "400"
        }
        return  destCode;
    }

    _getInsurancesDataByPatientsList(inputPatientsList) {
        return new Promise(resolve => {
            this.api.insurance().getInsurances(new models.ListOfIdsDto({ids : _.chain(inputPatientsList).map(i=> i.insurabilities.map(ins => _.trim(_.get(ins, "insuranceId")))).flattenDeep().uniq().compact().value()}))
                .then(insurancesData => resolve(
                    _
                        .chain(insurancesData)
                        .map((i)=>{ i.finalName = (i && i.name && i.name[this.language]) ? i.name[this.language] : i.name[(this.language==='fr' ? 'nl' : 'fr')]; return i; })
                        .sortBy((i)=>{ return i.code; })
                        .value()
                ))
        })
    }

    _getInsurancesDataByIds(insurancesIds) {
        return new Promise(resolve => {
            this.api.insurance().getInsurances(new models.ListOfIdsDto({ids : insurancesIds}))
                .then(insurancesData => resolve(
                    _
                        .chain(insurancesData)
                        .map((i)=>{ i.finalName = (i && i.name && i.name[this.language]) ? i.name[this.language] : i.name[(this.language==='fr' ? 'nl' : 'fr')]; return i; })
                        .sortBy((i)=>{ return i.code; })
                        .value()
                ))
        })
    }

    _getInsurancesDataByCode(insurancesCode) {
        return new Promise(resolve => {
            this.api.insurance().listInsurancesByCode(insurancesCode)
                .then(insurancesData => resolve(
                    _
                        .chain(insurancesData)
                        .map((i)=>{ i.finalName = (i && i.name && i.name[this.language]) ? i.name[this.language] : i.name[(this.language==='fr' ? 'nl' : 'fr')]; return i; })
                        .sortBy((i)=>{ return i.code; })
                        .value()
                ))
        })
    }

    _getIOsDataByInsurancesList(inputInsurancesList) {

        return new Promise(resolve => {
            this.api.insurance().getInsurances(new models.ListOfIdsDto({ids : _.chain(inputInsurancesList).map(i=>_.trim(_.get(i, "parent"))).uniq().compact().value()}))
                .then(insurancesData => resolve(
                    _
                        .chain(insurancesData)
                        .map((i)=>{ i.finalName = (i && i.name && i.name[this.language]) ? i.name[this.language] : i.name[(this.language==='fr' ? 'nl' : 'fr')]; return i; })
                        .sortBy((i)=>{ return i.code; })
                        .value()
                ))
        })
    }

    _generateJ3FileAndDownload() {

        this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_4_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
        this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_5',this.language), icon:"arrow-forward"});

        // Always export data versus previous month's contracts (will kick in this month)
        this.reportCurrentDateMomentObject = moment(this.reportCurrentDateString, "YYYYMMDD").subtract(1, 'month');

        let pdfData = {};

        // Loop OA
        _.forEach( this.oaData, (oa,k)=> {

            let OaPatients = _.filter(this.flatRateAllPatients, (i=>_.trim(_.get(i, "finalInsurability.insuranceId", "" )) === _.trim(oa.id)))

            pdfData[oa.id] = {
                oa: {
                    id: _.get(oa, "id", ""),
                    finalName: _.get(oa, "finalName", ""),
                    code: _.get(oa, "code", ""),
                    address: _.trim(_.compact([_.get(oa, "address.street", ""), _.get(oa, "address.houseNumber", ""), _.get(oa, "address.postboxNumber", "")]).join(' ')),
                    postalCode: _.get(oa, "address.postalCode", ""),
                    city: _.get(oa, "address.city", "")
                },
                entries: {

                    // 01 : Subscriptions WITHOUT try-out period
                    list1 :  _.compact(_.map(OaPatients, pat=>{
                        return parseInt(_.size(_.filter(_.get(pat, "medicalHouseContracts", []), mhc=>{return(
                            moment( _.get(mhc, "startOfContract", 0), 'YYYYMMDD').startOf('month').isSame( this.reportCurrentDateMomentObject.startOf('month') ) &&
                            ( moment( _.get(mhc, "startOfContract", 0), 'YYYYMMDD').startOf('month').isSame( moment( _.get(mhc, "startOfCoverage", 0), 'YYYYMMDD').subtract(1,"month").startOf('month') ) || !parseInt(_.get(mhc, "startOfCoverage", 0)) )
                        )}))) ? pat : false
                    })),

                    // 02 : Subscriptions WITH try-out period
                    list2 : _.compact(_.map(OaPatients, pat=>{
                        return parseInt(_.size(_.filter(_.get(pat, "medicalHouseContracts", []), mhc=>{return(
                            moment( _.get(mhc, "startOfContract", 0), 'YYYYMMDD').startOf('month').isSame( this.reportCurrentDateMomentObject.startOf('month') ) &&
                            moment( _.get(mhc, "startOfContract", 0), 'YYYYMMDD').startOf('month').isBefore( moment( _.get(mhc, "startOfCoverage", 0), 'YYYYMMDD').subtract(2,"month").startOf('month') )
                        )}))) ? pat : false
                    })),

                    // 03 : Unsubscriptions
                    list3 : _.compact(_.map(OaPatients, pat=>{return !!(
                        parseInt(_.size(_.filter(_.get(pat, "medicalHouseContracts", []), mhc=>{ return moment( _.get(mhc, "endOfContract", 0), 'YYYYMMDD').startOf('month').isSame( this.reportCurrentDateMomentObject.startOf('month') ) }))) ||
                        // Just died last month
                        moment( _.get(pat, "dateOfDeath", 0), 'YYYYMMDD').startOf('month').isSame( this.reportCurrentDateMomentObject.startOf('month') )
                    ) ? pat : false
                    })),

                    //TODO: this is not ready yet !!! filter out the 3 months to be done
                    // 10 : Subscriptions WITH transfert
                    list10 : _.compact(_.map(OaPatients, pat=>{
                        return parseInt(_.size(_.filter(_.get(pat, "medicalHouseContracts", []), mhc=>{return(
                            moment( _.get(mhc, "startOfContract", 0), 'YYYYMMDD').startOf('month').isSame( this.reportCurrentDateMomentObject.startOf('month') ) &&
                            moment( _.get(mhc, "startOfContract", 0), 'YYYYMMDD').startOf('month').isBefore( moment( _.get(mhc, "startOfCoverage", 0), 'YYYYMMDD').subtract(1,"month").startOf('month') )
                            //&& moment( _.get(mhc, "startOfContract", 0), 'YYYYMMDD').startOf('month').isAfter( moment( _.get(mhc, "startOfCoverage", 0), 'YYYYMMDD').subtract(2,"month").startOf('month') )
                        )}))) ? pat : false
                    })),

                    //  Suspensions
                    suspensions : _.compact(_.map(OaPatients, pat=>{
                        return parseInt(_.size(_.filter( _.get(pat, "medicalHouseContracts", []), mhc=>{return(
                            !!_.trim( _.get(mhc,"suspensionReason","")) &&
                            ( parseInt(_.get(mhc,"startOfSuspension",0)) && moment( _.get(mhc,"startOfSuspension",0)+"", "YYYYMMDD" ).isBefore( this.reportCurrentDateMomentObject ) ) &&
                            ( !parseInt(_.get(mhc,"endOfSuspension",0)) || moment( _.get(mhc,"endOfSuspension",0)+"", "YYYYMMDD" ).isAfter( this.reportCurrentDateMomentObject ) )
                        )}))) ? pat : false
                    }))

                }
            };

            // 04 : Invoicing suspended: Not insured
            // 05 : Invoicing suspended: No reason given
            // 06 : Invoicing suspended: Is hospitalized
            // 07 : Invoicing suspended: Out of country
            // 08 : This one doesn't exist (legitimately omitted)
            // 09 : Invoicing suspended: change of mutuality
            pdfData[oa.id].entries['list4'] = _.filter( _.get(pdfData[oa.id], "entries.suspensions", [] ), pat=> _.uniq( _.map( _.get( pat, "medicalHouseContracts", []), mhc=>_.trim(mhc.suspensionReason) ) ).indexOf("notInsured") > -1  )||[]
            pdfData[oa.id].entries['list5'] = _.filter( _.get(pdfData[oa.id], "entries.suspensions", [] ), pat=> _.uniq( _.map( _.get( pat, "medicalHouseContracts", []), mhc=>_.trim(mhc.suspensionReason) ) ).indexOf("noReasonGiven") > -1  )||[]
            pdfData[oa.id].entries['list6'] = _.filter( _.get(pdfData[oa.id], "entries.suspensions", [] ), pat=> _.uniq( _.map( _.get( pat, "medicalHouseContracts", []), mhc=>_.trim(mhc.suspensionReason) ) ).indexOf("isHospitalized") > -1  )||[]
            pdfData[oa.id].entries['list7'] = _.filter( _.get(pdfData[oa.id], "entries.suspensions", [] ), pat=> _.uniq( _.map( _.get( pat, "medicalHouseContracts", []), mhc=>_.trim(mhc.suspensionReason) ) ).indexOf("outsideOfCountry") > -1  )||[]
            pdfData[oa.id].entries['list9'] = _.filter( _.get(pdfData[oa.id], "entries.suspensions", [] ), pat=> _.uniq( _.map( _.get( pat, "medicalHouseContracts", []), mhc=>_.trim(mhc.suspensionReason) ) ).indexOf("changeOfMutuality") > -1  )||[]

            delete pdfData[oa.id].entries.suspensions

        }); // Loop OA

        // NOT FOR PROD, just to test page breaks with large records amount
        // _(pdfData).forEach((oa)=>{_(oa.entries).forEach((entries)=>{if( !entries.length ) return;_.forEach(entries, (i)=>{ entries.push(i); })})});
        // _(pdfData).forEach((oa)=>{_(oa.entries).forEach((entries)=>{if( !entries.length ) return;_.forEach(entries, (i)=>{ entries.push(i); })})});
        // _(pdfData).forEach((oa)=>{_(oa.entries).forEach((entries)=>{if( !entries.length ) return;_.forEach(entries, (i)=>{ entries.push(i); })})});
        // _(pdfData).forEach((oa)=>{_(oa.entries).forEach((entries)=>{if( !entries.length ) return;_.forEach(entries, (i)=>{ entries.push(i); })})});
        // _(pdfData).forEach((oa)=>{_(oa.entries).forEach((entries)=>{if( !entries.length ) return;_.forEach(entries, (i)=>{ entries.push(i); })})});
        // _(pdfData).forEach((oa)=>{_(oa.entries).forEach((entries)=>{if( !entries.length ) return;_.forEach(entries, (i)=>{ entries.push(i); })})});

        // We're done collecting data, reset according to given exported month
        this.reportCurrentDateMomentObject = moment(this.reportCurrentDateString, "YYYYMMDD");

        // Namely for footer
        let totalPages = 0; let currentPage = 0;

        // Hardcoded, see PDF output
        const maxEntriesPerPage = 47;

        // Whole document headers
        let pdfTemplate = this._getExportPdfHeader();

        // Eval total pages
        _.forEach( pdfData, (oaData)=> { _.forEach( oaData.entries, (listEntries)=> { if(!parseInt(_.size(listEntries))) return; let pageBreakentriesChunks = _.chunk(listEntries, maxEntriesPerPage ); _.forEach(pageBreakentriesChunks, ()=>{ totalPages++; })})})

        // Build document pages
        _.forEach( pdfData, (oaData)=> {
            _.forEach( oaData.entries, (listEntries, listKey)=> {
                if(!parseInt(_.size(listEntries))) return;
                let listIndex = parseInt(listKey.replace('list',''));
                let pageBreakentriesChunks = _.chunk(listEntries, maxEntriesPerPage );
                _.forEach(pageBreakentriesChunks, (entriesChunk)=>{
                    currentPage++;
                    pdfTemplate +=
                        this._getExportPageHeader(oaData.oa) +
                        this._getExportListHeader(listIndex) +
                        this._getExportListContent(listIndex,entriesChunk) +
                        this._getExportPageFooter(currentPage,totalPages,oaData.oa.code)
                });
            })
        })

        // Close document
        pdfTemplate += this._getExportPdfFooter();

        this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_5_done', 'mhListing.spinner.step_5_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
        this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_6', 'mhListing.spinner.step_6',this.language), icon:"arrow-forward"});

        this.downloadFileName = _.kebabCase( _.compact([
            'listing patients',
            ' ',
            this.localize('month_' + parseInt(moment(this.reportCurrentDateString, "YYYYMMDD").format('M')), this.language),
            ' ',
            parseInt(moment(this.reportCurrentDateString, "YYYYMMDD").format('Y')),
            ' au '
        ]).join("")) + "-" + moment().format("YYYY-MM-DD-HH[h]-mm[m]-ss[s]") + '.pdf'

        // Generate, archive & download pdf report
        this.api.pdfReport(mustache.render(pdfTemplate, pdfData))
            .then(({pdf:pdfFileContent, printed:printed}) =>{
                this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_6_done','mhListing.spinner.step_6_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_7','mhListing.spinner.step_7',this.language), icon:"arrow-forward"});

                return this.api.message().newInstance(this.user)
                    .then(newMessageInstance => this.api.message().createMessage(
                        _.merge(newMessageInstance, {
                            transportGuid: "MH:ARCHIVES:LISTING",
                            recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id))],
                            metas: {totalPages: totalPages, filename: this.downloadFileName},
                            toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id)))],
                            subject: "MH: Archive listing patients download - " + this.downloadFileName
                        }))
                    )
                    .then(createdMessage => this.api.document().newInstance(this.user, createdMessage, {
                        documentType: 'report',
                        mainUti: this.api.document().uti("application/pdf"),
                        name: this.downloadFileName
                    }))
                    .then(newDocumentInstance => this.api.document().createDocument(newDocumentInstance))
                    .then(createdDocument => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, createdDocument, pdfFileContent).then(encryptedFileContent => ({createdDocument, encryptedFileContent })))
                    .then(({createdDocument, encryptedFileContent}) => this.api.document().setAttachment(createdDocument.id, null, encryptedFileContent))
                    .then(() => !printed && this.api.triggerFileDownload( pdfFileContent, "application/pdf", this.downloadFileName ))
            })
            .then(() => {
                this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_7_done','mhListing.spinner.step_7_done',this.language), icon:"check-circle", updateLastMessage: true, done:true})
                this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_8','mhListing.spinner.step_8',this.language), icon:"arrow-forward"})
            })
            .catch((e)=> console.log(e))
            .finally(() => {
                this.set('_isLoading', false)
                this.api.setPreventLogging(false);
            })

    }

    _getListingArchives() {

        this.archiveListingMessages = {}
        let dateRangeStart = _.trim(_.get(this.shadowRoot.getElementById("dateRangeStart"), "value", "" ));
        let dateRangeEnd = _.trim(_.get(this.shadowRoot.getElementById("dateRangeEnd"), "value", "" ));

        this.api.message().findMessagesByTransportGuid('MH:ARCHIVES:LISTING', null, null, null, 1000).then(m => {
            this.archiveListingMessages = _
                .chain(m.rows)
                .filter((m)=>{return _.get(m,'fromHealthcarePartyId',false)===this.user.healthcarePartyId && (!dateRangeStart?true:(!moment(m.created).isBefore(moment(dateRangeStart, "YYYY-MM-DD")))) && (!dateRangeEnd?true:(moment(m.created).isBefore(moment(dateRangeEnd, "YYYY-MM-DD"))))})
                .map((i)=>{
                    i.hrDate = moment(i.created).format('DD/MM/YYYY');
                    i.hrTime = moment(i.created).format("HH:mm:ss");
                    i.filename = _.get(i.metas,"filename", "listing-patients.pdf");
                    i.totalPages = _.get(i.metas,"totalPages",1);
                    return i;
                })
                .orderBy("created", "desc")
                .value();
        });

    }

    _downloadListingArchive(e) {
        let messageId = _.get(_.head(_.chain(e.path).filter((i)=>{return _.get(_.get(i,"classList",[]), "value","").indexOf('downloadListingArchive')!==-1}).value()),"messageid",false);
        this.api.document().findByMessage(this.user.healthcarePartyId, _.chain(this.archiveListingMessages).filter({id:messageId}).head().value()).then(singleMessage => {
            if(singleMessage && singleMessage[0] && singleMessage[0].id && singleMessage[0].attachmentId && singleMessage[0].secretForeignKeys) {
                this.api.document().getAttachment(singleMessage[0].id, singleMessage[0].attachmentId, singleMessage[0].secretForeignKeys).then(attachmentResponse => {
                    if(attachmentResponse) {
                        this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, _.head(singleMessage), attachmentResponse).then(decryptedFileContent =>{
                            this.api.triggerFileDownload(decryptedFileContent,"application/pdf",_.get( _.head(_.filter(this.archiveListingMessages, {"id":_.trim(messageId)})), "filename","listing-patients.pdf"));
                        }).catch(()=>{})
                    }
                }).catch(()=>{})
            }
        }).catch(()=>{})
    }

    _getExportMonthsList() {
        let toReturn = [];
        for(let i=1; i<=12; i++) toReturn.push({id: i, label: this.localize('month_'+i,this.language) })
        return toReturn
    }

    _getExportYearsList() {
        let toReturn = [];
        for(let i=(parseInt(moment().format('YYYY'))+1); i>=(parseInt(moment().format('YYYY'))-2); i--) toReturn.push({id: i, label: i })
        return toReturn
    }

    _getExportCurrentMonth() {
        return parseInt(moment().format('MM'))
    }

    _getExportCurrentYear() {
        return parseInt(moment().format('YYYY'))
    }

    _sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    getChangeParentCode306(code){
        return code === "306" ? "300" : code;
    }

    _createOrUpdateMedicalHousePatientsInvoices() {
        let prom = Promise.resolve([])
        const allPats = _.flatMap(this.flatRateInvoicingDataObject.listsData)
        const patsCount = _.size(allPats)
        const parentInsuranceIds = _.compact(_.uniq(_.map( this.flatRateInvoicingDataObject.insurancesData, i=>_.get(i,"parent", false ))))
        const childrenInsurancesData = _.compact(_.uniqBy(this.flatRateInvoicingDataObject.insurancesData, 'id'))

        return this.api.insurance().getInsurances(new models.ListOfIdsDto({ids : parentInsuranceIds})).then(parentInsurances => {
            allPats.forEach((pat,loopIndex) => {
                prom = prom.then(pats =>
                    this.api.crypto().extractDelegationsSFKs(pat, this.user.healthcarePartyId)
                        .then(secretForeignKeys => {

                            // TOP-435
                            const insParent = _.get(_.filter( parentInsurances, parentIns=> _.trim(_.get(parentIns, "id", "")) === _.trim(_.get(_.get(_.filter(childrenInsurancesData, i=>_.trim(_.get(i,"id",""))===_.trim(_.get(pat,"finalInsurability.insuranceId", ""))), "[0]", {}), "parent", ""))), "[0]", {})

                            return retry.retry(() => (this.api.invoice().appendCodes(this.user.id, "patient", "cdrom", _.trim(_.get(pat,"finalInsurability.insuranceId","")), secretForeignKeys.extractedKeys.join(","), null, (365*2), pat.invoicingCodes)))
                                .then(invoices => !_.trim(_.get(invoices, "[0].id", "")) ?
                                    this.api.invoice().newInstance(this.user, pat, invoices[0]).then(inv => retry.retry(() => (this.api.invoice().createInvoice(inv, 'invoice:' + this.user.healthcarePartyId + ':' + this.getChangeParentCode306(insParent && insParent.code ? insParent.code : '000') + ':')))) :
                                    Promise.resolve(invoices[0])
                                )
                                .then(newInvoice => {

                                    if(this.invoiceHasDoubles(newInvoice)){

                                        // Drop duplicated codes
                                        pat.invoicingCodes.forEach(pic => { newInvoice.invoicingCodes = _.remove(newInvoice.invoicingCodes, ic => ic.dateCode === pic.dateCode && ic.code === pic.dateCode); });
                                        newInvoice.invoicingCodes = newInvoice.invoicingCodes.concat(pat.invoicingCodes);

                                        // && Update invoice
                                        return this.api.invoice().modifyInvoice(newInvoice).then(inv =>this.api.register(inv,'invoice'))
                                            .then(newInvoiceMod => {
                                                pat.invoices = [newInvoiceMod]
                                                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_4',this.language) + " " + (loopIndex+1) + "/" + patsCount, icon:"arrow-forward", updateLastMessage: true, done:false});
                                                return _.concat(pats, [pat])
                                            });

                                    } else {

                                        pat.invoices = [newInvoice]
                                        this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_4',this.language) + " " + (loopIndex+1) + "/" + patsCount, icon:"arrow-forward", updateLastMessage: true, done:false});
                                        return _.concat(pats, [pat])

                                    }

                                })
                        })
                )
            })
            return prom
        })
    }

    invoiceHasDoubles(inv){
        let hasDouble = false;
        inv.invoicingCodes.forEach(ic => {
            const ics = inv.invoicingCodes.filter(icf => icf.dateCode === ic.dateCode && icf.code === ic.code);
            if(_.size(ics) > 1) hasDouble = true;
        });
        return hasDouble;
    }

    _generateJ20FlatFiles(){
        return Promise.all(this.flatRateInvoicingDataObject.iosData.map(OA => {
            let ib  = new fhcmodels.InvoicesBatch('');
            ib.invoicingYear = this.flatRateInvoicingDataObject.exportedDate.substr(0,4);
            ib.invoicingMonth = this.flatRateInvoicingDataObject.exportedDate.substr(4,2);
            ib.fileRef = 'xxx';//not used
            ib.batchRef = this.getBatchRef(this.flatRateInvoicingDataObject.exportedDate, OA.code);
            ib.ioFederationCode = _.trim(_.get(OA, "code", ""));
            ib.uniqueSendNumber = this.getUniqueSendNr(this.flatRateInvoicingDataObject.exportedDate);
            ib.sender = {};
            ib.sender.bce = this.flatRateInvoicingDataObject.hcpData.cbe.replace(/[^\d]/g, '');
            ib.sender.bic = this.flatRateInvoicingDataObject.hcpData.financialInfo.bic.replace(/ /g, '').replace(/-/g, '');
            ib.sender.iban = this.flatRateInvoicingDataObject.hcpData.financialInfo.bankAccount.replace(/ /g, '').replace(/-/g, '');
            ib.sender.firstName = ''
            ib.sender.lastName = this.flatRateInvoicingDataObject.hcpData.name;
            ib.sender.nihii = this.flatRateInvoicingDataObject.hcpData.nihii;
            ib.sender.phoneNumber = Number(this.flatRateInvoicingDataObject.hcpData.address.telecoms.filter(tc => tc.telecomType = "phone")[0].telecomNumber.replace(/[^\d]/g, ''));
            ib.sender.ssin = ''; //not used
            ib.numericalRef = 0;//not used
            ib.invoiceContent = 0;
            ib.magneticInvoice = true;
            let invoices = []

            //loop patients of OA
            const oaMuts = this.flatRateInvoicingDataObject.insurancesData.filter(insdt => insdt.code.substr(0,1) === OA.code.substr(0,1));
            const oaMutIds = oaMuts.map(oaMut => oaMut.id);//.join(",");
            const oaInvoicesData = this.flatRateInvoicingDataObject.invoicesData.filter(idt => oaMutIds.includes(idt.finalInsurability.insuranceId));
            oaInvoicesData.map(idt => parseInt(_.size(_.get(idt, "invoicingCodes", false))) ? invoices.push(this.getPatientInvoice(idt, _.trim(_.get(OA, "code", "")))) : false )
            ib.invoices = _.orderBy(invoices, ["destInsuranceCode", "insuranceCode", "invoiceNumber"], ["asc", "asc","asc"]); //1 per patient

            //end loop patients of OA
            return this.api.fhc().Efactcontroller().makeFlatFileCoreUsingPOST(ib).then(flatRes => {
                return {
                    io:_.get(this.flatRateInvoicingDataObject.iosData.filter(io => io.code === _.trim(_.get(OA, "code", ""))), "[0].id", ""),
                    file: flatRes.flatFile,
                    metadata: flatRes.metadata,
                    slip: this.slipDataFromBatchAndFlatFile(ib, flatRes),
                    msg: "",
                    oaInvoiceIds: _.compact( _.map(oaInvoicesData, oaInv => _.trim( _.get( oaInv, "invoices[0].id", "" ) ) ) ),
                    batch: ib
                };
            }).catch(err => {
                return {
                    io:_.get(this.flatRateInvoicingDataObject.iosData.filter(io => io.code === _.trim(_.get(OA, "code", ""))), "[0].id", ""),
                    file: "",
                    metadata: "",
                    slip: "",
                    msg: err,
                    oaInvoiceIds: _.compact( _.map(oaInvoicesData, oaInv => _.trim( _.get( oaInv, "invoices[0].id", "" ) ) ) ),
                    batch: ib
                }
            });
        })).then(x=>x)
    }

    slipDataFromBatchAndFlatFile(batch, flatWithMetadata){

        //title
        let title= this.localize('flatrate_slipfile_01',this.language) + "\n" +
            "------------------------------------------------\n" +
            this.localize('flatrate_slipfile_02',this.language) + "\n" +
            this.localize('flatrate_slipfile_03',this.language) + "\n" +
            "---------------------------- :\n";
        //MM info from this.flatRateInvoicingDataObject.hcpData
        let mmInfo = this.localize('flatrate_slipfile_04',this.language) + "[mm.name]\n" +
            this.localize('flatrate_slipfile_05',this.language) + "[mm.address]\n" +
            this.localize('flatrate_slipfile_06',this.language) + "[mm.cpCity]\n" +
            this.localize('flatrate_slipfile_07',this.language) + "[mm.nihii]\n" +
            this.localize('flatrate_slipfile_08',this.language) + "[mm.cbe]\n" +
            this.localize('flatrate_slipfile_09',this.language) + "[mm.BIC]\n" +
            this.localize('flatrate_slipfile_10',this.language) + "[mm.IBAN]\n";
        //OA info
        const hcp = this.flatRateInvoicingDataObject.hcpData;
        mmInfo = mmInfo.replace("[mm.name]", hcp.name).replace("[mm.address]", this.getStreetAddress(hcp.address)).replace("[mm.cpCity]", this.getCityAddress(hcp.address)).replace("[mm.nihii]", hcp.nihii).replace("[mm.cbe]", hcp.cbe).replace("[mm.BIC]", hcp.financialInfo.bic).replace("[mm.IBAN]", hcp.financialInfo.bankAccount);
        let oaInfo = "---------------------------------------------------------------------------\n" +
            this.localize('flatrate_slipfile_11',this.language) + "\n" +
            "--------------------------------- : \n" +
            this.localize('flatrate_slipfile_04',this.language) + " [oa.name]\n" +
            this.localize('flatrate_slipfile_05',this.language) + " [oa.address]\n" +
            this.localize('flatrate_slipfile_06',this.language) + " [oa.pcCity]\n" +
            "---------------------------------------------------------------------------\n";
        const OA = this.flatRateInvoicingDataObject.iosData.filter(io => io.code === batch.ioFederationCode)[0];
        oaInfo = oaInfo.replace("[oa.name]", OA.name.nl).replace("[oa.address]", this.getStreetAddress(OA.address)).replace("[oa.pcCity]", this.getCityAddress(OA.address));
        //File info
        let fileInfo = this.localize('flatrate_slipfile_12',this.language) + "[batch.version]\n" +
            this.localize('flatrate_slipfile_13',this.language) + "[batch.nr]\n" +
            this.localize('flatrate_slipfile_14',this.language) + "[batch.fileName]\n" +
            this.localize('flatrate_slipfile_15',this.language) + "[batch.yearMonth]\n" +
            this.localize('flatrate_slipfile_16',this.language) + "[batch.creationDate]\n" +
            this.localize('flatrate_slipfile_17',this.language) + "[mm.contactPerson]\n";
        //column headers
        let fileName = "flat-file-oa-" + batch.ioFederationCode + ".txt"
        fileInfo = fileInfo.replace("[batch.version]","0001999").replace("[batch.nr]",batch.uniqueSendNumber).replace("[batch.fileName]",fileName).replace("[batch.yearMonth]", batch.invoicingMonth + '/' + batch.invoicingYear).replace("[batch.creationDate]", moment().format("DD/MM/YYYY")).replace("[mm.contactPerson]",hcp.contactPerson);
        let columnHeaders = "---------------------------------------------------------------------------\n" +
            this.localize('flatrate_slipfile_18',this.language) + "\n" +
            this.localize('flatrate_slipfile_19',this.language) + "\n" +
            "---------------------------------------------------------------------------\n";
        //mut lines
        let mutLines = "";
        const mutTmpl = "   [mutCode:3]         [nRecords:4]               [checkSum:2]                       [amount:8]\n";

        //const props = Object.getOwnPropertyNames(flatWithMetadata.metadata.codesPerOAMap);
        let OAs = Object.getOwnPropertyNames(flatWithMetadata.metadata.codesPerOAMap).filter(p => !isNaN(parseFloat(p)) && isFinite(p));
        let oaData = OAs.map(oa => {
            let nRecords = flatWithMetadata.metadata.recordsCountPerOAMap[oa][0];
            let checkSum = this.getCheckSum(flatWithMetadata.metadata.codesPerOAMap[oa]);
            let amount = flatWithMetadata.metadata.amountPerOAMap[oa][0];
            return {
                OA: oa,
                Records: nRecords,
                CheckSum: checkSum,
                Amount: amount,
                Line: mutTmpl.replace("[mutCode:3]",oa).replace("[nRecords:4]",nRecords.toString().padStart(4, " ")).replace("[amount:8]",(amount / 100).toString().padStart(8, " ")).replace("[checkSum:2]",checkSum)
            }
        })

        oaData.forEach(od =>
            {
                mutLines += od.Line;
            }
        )

        let totRecords = flatWithMetadata.metadata.recordsCount;
        let totCheckSum = this.getCheckSum(flatWithMetadata.metadata.codes); //flatWithMetadata.metadata.recordsCount;
        let totAmount = flatWithMetadata.metadata.amount;

        //total line
        let totalLine = "---------------------------------------------------------------------------\n" +
            this.localize('flatrate_slipfile_20',this.language) + "[nRecords:4]               [checkSum:2]                       [total:8]\n" +
            "---------------------------------------------------------------------------\n";

        totalLine = totalLine.replace("[nRecords:4]",totRecords.toString().padStart(4, " ")).replace("[checkSum:2]",totCheckSum).replace("[total:8]",(totAmount / 100).toString().padStart(8, " "))
        //footer
        let footer = this.localize('flatrate_slipfile_21',this.language) + "\n" +
            "------------------------------------------          --------------------\n" +
            this.localize('flatrate_slipfile_22',this.language) + "\n" +
            this.localize('flatrate_slipfile_23',this.language) + "\n" +
            this.localize('flatrate_slipfile_24',this.language) + "\n" +
            this.localize('flatrate_slipfile_25',this.language) + "";

        return title + mmInfo + oaInfo + fileInfo + columnHeaders + mutLines + totalLine + footer;
    }

    getCheckSum(codes){
        let sumCodes = 0;
        codes.forEach(cd =>{
            sumCodes += Number(cd)
        })
        return (sumCodes % 97) === 0 ? "97" : (sumCodes % 97).toString().padStart(2, "0");
    }

    getStreetAddress(address){
        let arr = [];
        if(address.street) arr.push(address.street);
        if(address.houseNumber) arr.push(address.houseNumber);
        if(address.postboxNumber) arr.push(address.postboxNumber);
        return arr.join(' ')
    }

    getCityAddress(address){
        let arr = [];
        if(address.postalCode) arr.push(address.postalCode);
        if(address.city) arr.push(address.city);
        return arr.join(' ')
    }

    cleanNumericalString(str){
        return str.replace(/[^\d]/g, '');
    }

    getUniqueSendNr(exportedDate){
        return this.overrideBatchNumber ? this.batchNumber : exportedDate.substr(3,3);
    }

    getBatchRef(exportedDate, OA){
        return (this.overrideBatchNumber ? this.batchNumber : exportedDate.substr(3,3)) + OA;
    }

    getPatientInvoice(patientData, OA){
        let inv = new fhcmodels.Invoice('');
        inv.patient = {};
        inv.patient.dateOfBirth = parseInt(moment(_.trim(patientData.dateOfBirth), "DD/MM/YYYY").format("YYYYMMDD"))||0;
        inv.patient.ssin = patientData.ssin;
        inv.patient.insurabilities = [];
        inv.patient.gender = patientData.gender;
        let ins = new fhcmodels.Insurability('');
        const patIns = patientData.finalInsurability;
        ins.insuranceCode = this.flatRateInvoicingDataObject.insurancesData.filter(idt => idt.id === patIns.insuranceId)[0].code;
        ins.parameters = {tc1 : patIns.parameters.tc1 , tc2 : patIns.parameters.tc2};
        inv.patient.insurabilities.push(ins);
        inv.invoiceNumber = Number(patientData.invoices[0].invoiceReference);
        patientData.invoiceNumber = patientData.invoices[0].invoiceReference;
        inv.invoiceRef = patientData.externalId ? patientData.externalId : patientData.ssin; //R20Z28
        inv.ioCode = ins.insuranceCode.padEnd(3," ").substr(0,3);
        inv.insuranceCode = ins.insuranceCode;
        inv.destInsuranceCode = this.getDestCode(ins.insuranceCode);
        inv.reason = 'Other';
        inv.startOfCoveragePeriod= patientData.medicalHouseContracts[0].startOfContract;
        inv.items = [];
        _.forEach(patientData.invoices, invItm => {
            _.forEach(invItm.invoicingCodes, invCd => {
                let itm = new fhcmodels.InvoiceItem('');
                itm.codeNomenclature = invCd.code;
                itm.dateCode = invCd.dateCode;
                itm.endDateCode = Number(this.api.moment(invCd.dateCode).endOf('month').format("YYYYMMDD"));
                itm.reimbursedAmount = Math.round(invCd.reimbursement * 100);
                itm.units = 1;
                if(!invCd.pending && !invCd.lost && !invCd.canceled && !invCd.accepted && !invCd.archived && !this.alreadyExists(inv.items, itm)) inv.items.push(itm);
            })
        });

        return inv;
    }

    alreadyExists(items, item){
        const exist = items.filter(itm => itm.dateCode === item.dateCode && itm.codeNomenclature === item.codeNomenclature);
        if (exist && exist.length > 0){
            console.log("item already exists", item, exist);
            return true;
        }
        else
        {
            return false;
        }
    }

    _renderGridInvoiceNmcl(inputData) {
        return _.sortBy(_.uniq(_.compact(_.map(inputData,i=>i.code))),'code', 'asc').join(", ")
    }

    _confirmDeleteBatch(e) {

        const dataBatchExportTstamp = _.trim(_.get(_.find(_.get(e,"path",[]), nodePath=> !!_.trim(_.get(nodePath,"dataBatchExportTstamp",""))), "dataBatchExportTstamp",""))

        this.set("batchExportTstamp", dataBatchExportTstamp)

        return !!dataBatchExportTstamp && this.$["deleteBatchDialog"].open()

    }

    _doDeleteBatch() {

        this.api.setPreventLogging();
        const promResolve = Promise.resolve();
        const batchExportTstamp = _.trim(this.batchExportTstamp)

        return !_.trim(batchExportTstamp) ? promResolve.then(()=>this.$["deleteBatchDialog"].close()) : promResolve
            .then(() => {
                this.set('_isLoadingSmall',true)
                this.set("batchExportTstamp", null)
                this.$["deleteBatchDialog"].close()
            })
            .then(() => this.api.getRowsUsingPagination((key,docId) => this.api.message().findMessagesByTransportGuid('MH:FLATRATE:*', null, key, docId, 1000)
                .then(pl => { return {
                    rows:_.filter(pl.rows, m => _.get(m,'fromHealthcarePartyId',false)===this.user.healthcarePartyId ),
                    nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                    nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                    done: !pl.nextKeyPair
                }})
            ))
            .then(foundMessages => {

                // Messages and invoices matching this export tstamp (could be several per month so don't filter on exportDate only
                const messagesToDelete = _.filter(foundMessages, it => _.trim(_.get(it,"metas.batchExportTstamp","")) === batchExportTstamp)
                const invoiceIdsToDelete = _
                    .chain(messagesToDelete)
                    .map(it => _.get(it,"invoiceIds",[]))
                    .flatten()
                    .compact()
                    .uniq()
                    .value()

                return this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: invoiceIdsToDelete })).then(invoices => [messagesToDelete,invoices])

            })
            .then(([messagesToDelete,invoicesToDelete]) => {

                const correctedInvoiceIds = _.uniq(_.compact(_.map(invoicesToDelete, it => _.trim(_.get(it,"correctedInvoiceId","")))))

                // Get invoices THIS batch corrects, if any
                return !_.size(correctedInvoiceIds) ? [messagesToDelete,invoicesToDelete,null] : this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: correctedInvoiceIds })).then(correctedInvoices => [messagesToDelete,invoicesToDelete,correctedInvoices])

            })
            .then(([messagesToDelete,invoicesToDelete,correctedInvoices]) => {

                let limit = promiseLimit(100);
                return !_.size(correctedInvoices) ? [messagesToDelete,invoicesToDelete] : Promise.all(correctedInvoices.map(inv => {
                    return limit(() => {

                        // Drop its "correctiveInvoiceId" as we're going to delete it
                        try{ delete(inv.correctiveInvoiceId); } catch(e){}

                        // Reset all invoicingCodes booleans to false, except for "pending" which was the correct status before invoice got corrected by an afterward batch
                        inv.invoicingCodes.map(ic => {
                            ic.canceled = false;
                            ic.accepted = false;
                            ic.pending = true;
                            ic.resent = false;
                            ic.archived = false;
                            ic.lost = false;
                            return ic;
                        })
                        return retry.retry(() => (this.api.invoice().modifyInvoice(inv).then(inv =>this.api.register(inv,'invoice'))))
                    })
                }))
                    .then(()=>[messagesToDelete,invoicesToDelete])

            })
            .then(([messagesToDelete,invoicesToDelete]) => this.api.message().deleteMessagesBatch(new models.ListOfIdsDto({ids: _.map(messagesToDelete, i=>i.id)})).then(()=>invoicesToDelete))
            .then(invoicesToDelete => { let limit = promiseLimit(100); return !_.size(invoicesToDelete) ? null : Promise.all(invoicesToDelete.map(inv => limit(() => retry.retry(() => this.api.invoice().deleteInvoice(inv.id).then(x=>x))))).then(x=>x) })
            .catch(() => this._fetchJ20Messages(true))
            .finally(() => {
                this.set('activeGridItem', null );
                this.set('messagesCachedData', null );
                this.api.setPreventLogging(false);
                return this._fetchJ20Messages(true)
            })

    }

    _openArchiveDialogForBatch(){
        if ( _.size(this.activeGridItem) ) this.$["archiveDialog"].open()
    }

    _archiveBatch(){
        this._updateBatchStatus("archive")
        this.$["archiveDialog"].close()
    }

    _acceptBatch() {
        this._updateBatchStatus("accept")
    }

    _partiallyAcceptBatch() {
        this._updateBatchStatus("partialAccept")
    }

    _rejectBatch() {
        this._updateBatchStatus("reject")
    }

    _updateBatchStatus( action ) {

        this.api.setPreventLogging();
        const defaultInvoiceStatuses = {
            accepted: false,
            canceled: false,
            pending: false,
            resent: false,
            archived: false,
            lost: false
        }

        const actionSettings = action === "reject" ? { newStatusKey: "rejected", newInvoicingCodeStatus: "canceled" } :
            action === "accept" ? { newStatusKey: "fullyAccepted", newInvoicingCodeStatus: "accepted" } :
                action === "partialAccept" ? { newStatusKey: "partiallyAccepted", newInvoicingCodeStatus: "accepted" } :
                    action === "archive" ? { newStatusKey: "archived", newInvoicingCodeStatus: "archived" } :
                        {}

        if ( _.size(this.activeGridItem) && _.size(actionSettings) ) {
            this.set('_isLoadingSmall', true );
            const newStatus = parseInt(_.get(this, "activeGridItem.status")) | parseInt(this.invoiceMessageStatuses[actionSettings.newStatusKey].status)
            Promise.all(
                _.filter( this.messagesCachedData.roughData, i => {
                    return _.size(i)
                        && parseInt(_.get(i, "metas.batchExportTstamp", 0)) === parseInt( _.get( this.activeGridItem, "metas.batchExportTstamp", 0 ))
                        && _.trim(_.get(i, "transportGuid", "")) !== "MH:FLATRATE:INVOICING-BATCH-ZIP"
                        && _.trim(_.get(i, "metas.parentOaId", "")) === _.trim( _.get( this.activeGridItem, "metas.parentOaId", "" ))
                }).map(singleMessage => this.api.message().modifyMessage(_.merge(singleMessage, {status:newStatus})).then(msg =>this.api.register(msg, 'message')) )
            ).then(allMessages=>{
                return ( !_.trim(actionSettings.newInvoicingCodeStatus) ) ? false : this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: _.uniq(_.flatten( _.map(allMessages, msg=>msg.invoiceIds.map(i => i))))}))
                    .then(invoices => {
                        return Promise.all(invoices.map(inv => {
                            if(actionSettings.newStatusKey==="archived") {
                                // When archiving, only set archived status to true / leave other statuses as such
                                inv.invoicingCodes.map(ic =>{ ic.archived = true; return ic; })
                            } else {
                                // When not archiving, reset all statuses but the one
                                inv.invoicingCodes.map(ic => _.merge(ic, _.merge( defaultInvoiceStatuses, {[actionSettings.newInvoicingCodeStatus]:true} )))
                            }
                            return this.api.invoice().modifyInvoice(inv).then(inv =>this.api.register(inv,'invoice'))
                        }))
                    })
                    .then(invoices => {
                        if((actionSettings.newStatusKey!=="rejected") || !_.size(invoices)) return false;
                        const acceptedAmount = this.api._powRoundFloatByPrecision( _.sumBy( _.filter( _.map(invoices, inv => { return { acceptedOrRefused: !!_.get( inv, "invoicingCodes[0].canceled", false ) ? "refused" : "accepted", amount: this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.get( inv, "invoicingCodes" ), i=>parseFloat(i.totalAmount) ) ), 2 ) } }),  {acceptedOrRefused:"accepted"}  ), i=>parseFloat(i.amount) ), 2)
                        const refusedAmount = this.api._powRoundFloatByPrecision( _.sumBy( _.filter( _.map(invoices, inv => { return { acceptedOrRefused: !!_.get( inv, "invoicingCodes[0].canceled", false ) ? "refused" : "accepted", amount: this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.get( inv, "invoicingCodes" ), i=>parseFloat(i.totalAmount) ) ), 2 ) } }),  {acceptedOrRefused:"refused"}  ), i=>parseFloat(i.amount) ), 2)
                        let updatedFlatFileMessage = _.get(_.filter(allMessages, {id:this.activeGridItem.id}), "[0]", {})
                        updatedFlatFileMessage.metas = _.merge(updatedFlatFileMessage.metas, {acceptedAmount:acceptedAmount, refusedAmount:refusedAmount});
                        return this.api.message().modifyMessage(updatedFlatFileMessage).then(msg =>this.api.register(msg,'message'))
                    })
            })
                .then((updatedFlatFileMessage) => {
                    return _.size(_.get(updatedFlatFileMessage, "invoiceIds", [])) ? this._duplicateRejectedInvoices(_.uniq(_.get(updatedFlatFileMessage, "invoiceIds", []))).then(x=>x) : false
                })
                .catch((e)=>{console.log(e)})
                .finally(() => {
                    this.set('_isLoadingSmall', false );
                    this.set('activeGridItem', null );
                    this.api.setPreventLogging(false);
                    this._fetchJ20Messages(true)
                })
        }

    }

    _rejectInvoice(e) {

        this.set('_isLoadingSmall', true );
        const invoiceId = _.get(e, "target.dataset.invoiceId", "")
        let oldActiveGridItemId = _.trim(_.get(this, "activeGridItem.id", ""))

        this.api.invoice().getInvoice(invoiceId)
            .then(invoice => {
                invoice.invoicingCodes.map(ic => {
                    ic.canceled = true;
                    ic.accepted = false;
                    ic.pending = false;
                    ic.resent = false;
                    ic.archived = false;
                    ic.lost = false;
                    return ic;
                })
                return this.api.invoice().modifyInvoice(invoice).then(invoice => this.api.register(invoice,'invoice'))
            })
            .then(invoice=>{
                return _.trim(_.get(invoice, "id", "")) ? this._duplicateRejectedInvoices([_.trim(_.get(invoice, "id", ""))]).then(x=>x) : false
            })
            .then(() => {
                return this.api.invoice().getInvoices(new models.ListOfIdsDto({ ids:_.compact(_.uniq(_.map(_.get(this, "activeGridItem.invoiceIds", []),i=>i))) }))
                    .then(invoices => {
                        const acceptedAmount = this.api._powRoundFloatByPrecision( _.sumBy( _.filter( _.map(invoices, inv => { return { acceptedOrRefused: !!_.get( inv, "invoicingCodes[0].canceled", false ) ? "refused" : "accepted", amount: this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.get( inv, "invoicingCodes" ), i=>parseFloat(i.totalAmount) ) ), 2 ) } }),  {acceptedOrRefused:"accepted"}  ), i=>parseFloat(i.amount) ), 2)
                        const refusedAmount = this.api._powRoundFloatByPrecision( _.sumBy( _.filter( _.map(invoices, inv => { return { acceptedOrRefused: !!_.get( inv, "invoicingCodes[0].canceled", false ) ? "refused" : "accepted", amount: this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.get( inv, "invoicingCodes" ), i=>parseFloat(i.totalAmount) ) ), 2 ) } }),  {acceptedOrRefused:"refused"}  ), i=>parseFloat(i.amount) ), 2)
                        this.activeGridItem.metas = _.merge(this.activeGridItem.metas, {acceptedAmount:acceptedAmount, refusedAmount:refusedAmount});
                        return this.api.message().modifyMessage(this.activeGridItem).then(msg => { this.api.register(msg,'message'); })
                    })
            })
            .catch((e)=>{console.log(e)})
            .finally(() => {
                this.set('_isLoadingSmall', false );
                this.set('activeGridItem', null )
                this._fetchJ20Messages(true).then(()=>{
                    _.size(_.get(_.filter(this.messagesGridData, {id:oldActiveGridItemId}), "[0]")) && this.set('activeGridItem', _.get(_.filter(this.messagesGridData, {id:oldActiveGridItemId}), "[0]") );
                    _.size(this.activeGridItem) && this._toggleBatchDetails({currentTarget:{dataset:{status:"partiallyAccepted"}}})
                })
            })
    }

    _downloadParentOaArchive(e) {

        let prom = Promise.resolve([])
        const messageId = _.get(e, "target.dataset.messageId", "")
        if(messageId) this.set('_isLoadingSmall', true );

        const batchExportedDate = _.get( _.filter( this.messagesCachedData.roughData, {id:messageId}), "[0].metas.exportedDate", "")
        const batchMessage = _.get( _.filter( this.messagesCachedData.roughData, i=> i.metas.exportedDate === batchExportedDate && i.transportGuid === "MH:FLATRATE:INVOICING-BATCH-ZIP" ), "[0]", "")

        return !messageId ? null : this.api.document().findByMessage(this.user.healthcarePartyId, batchMessage)
            .then(doc => (doc && doc[0] && doc[0].id && doc[0].attachmentId && doc[0].secretForeignKeys) ? this.api.document().getAttachment(doc[0].id, doc[0].attachmentId, doc[0].secretForeignKeys).then(attachment=>{return {doc:_.head(doc),attachment:attachment }}) : prom )
            .then(({doc,attachment})=> attachment ? this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, doc, attachment).then(decryptedContent=>{return {doc:doc,decryptedContent:decryptedContent }}) : prom)
            .then(({doc,decryptedContent})=> this.api.triggerFileDownload(decryptedContent,"application/zip",_.get( doc, "name", doc.id + ".zip")))
            .catch(e=>{console.log(e)})
            .finally(()=>{this.set('_isLoadingSmall', false );})

    }

    _downloadParentOaPdf(e) {

        let prom = Promise.resolve([])
        const messageId = _.get(e, "target.dataset.messageId", "")
        if(messageId) this.set('_isLoadingSmall', true );

        const batchExportedDate = _.get( _.filter( this.messagesCachedData.roughData, {id:messageId}), "[0].metas.exportedDate", "")
        const batchParentOaId = _.trim(_.get( _.filter( this.messagesCachedData.roughData, {id:messageId}), "[0].metas.parentOaId", ""))
        const batchMessage = _.get( _.filter( this.messagesCachedData.roughData, i=> i.metas.exportedDate === batchExportedDate && i.transportGuid === "MH:FLATRATE:PARENT-OA-INVOICING-PDF" && i.metas.parentOaId === batchParentOaId ), "[0]", "")

        return !messageId ? null : this.api.document().findByMessage(this.user.healthcarePartyId, batchMessage)
            .then(doc => (doc && doc[0] && doc[0].id && doc[0].attachmentId && doc[0].secretForeignKeys) ? this.api.document().getAttachment(doc[0].id, doc[0].attachmentId, doc[0].secretForeignKeys).then(attachment=>{return {doc:_.head(doc),attachment:attachment }}).catch(e=>{console.log(e)}) : prom )
            .then(({doc,attachment})=> attachment ? this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, doc, attachment).then(decryptedContent=>{return {doc:doc,decryptedContent:decryptedContent }}) : prom)
            .then(({doc,decryptedContent})=> this.api.triggerFileDownload(decryptedContent,"application/pdf",_.get( doc, "name", doc.id + ".pdf")))
            .catch(e=>{console.log(e)})
            .finally(()=>{this.set('_isLoadingSmall', false );})

    }

    _downloadOaPdfByMessageId(e) {

        let prom = Promise.resolve([])
        const messageId = _.get(e, "target.dataset.messageId", "")
        if(messageId) this.set('_isLoadingSmall', true );

        return !messageId ? null : this.api.document().findByMessage(this.user.healthcarePartyId, _.get(_.filter(this.messageDetailsData, {id:messageId}), "[0].messageData" ))
            .then(doc => (doc && doc[0] && doc[0].id && doc[0].attachmentId && doc[0].secretForeignKeys) ? this.api.document().getAttachment(doc[0].id, doc[0].attachmentId, doc[0].secretForeignKeys).then(attachment=>{return {doc:_.head(doc),attachment:attachment }}) : prom )
            .then(({doc,attachment})=> attachment ? this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, doc, attachment).then(decryptedContent=>{return {doc:doc,decryptedContent:decryptedContent }}) : prom)
            .then(({doc,decryptedContent})=> this.api.triggerFileDownload(decryptedContent,"application/pdf",_.get( doc, "name", doc.id + ".pdf")))
            .catch(e=>{console.log(e)})
            .finally(()=>{this.set('_isLoadingSmall', false );})
    }

    _formatSsinNumber(inputData){
        return this.api.formatSsinNumber(inputData)
    }

    _invoicedAmount(menuSection, dataSet) {
        return this.api.hrFormatNumber( this.api._powRoundFloatByPrecision( parseFloat(_.sumBy( _.map( this._getBatchDataByMenuSection(menuSection, dataSet), i=>parseFloat(_.get(i, "metas.totalAmount", "0.00"))), i=>parseFloat(i)) )))
    }

    _getSumByDataKey(items, dataKey) {
        return this.api.hrFormatNumber( this.api._powRoundFloatByPrecision( parseFloat( (_.sumBy(_.map(items, it => parseFloat(_.trim(_.get(it,dataKey,0)).replace(".","").replace(",","."))*10000), i=>parseFloat(i))/10000) )))
    }

    _invoicesToBeCorrectedInvoicedAmount(menuSection, dataSet) {
        return this.api.hrFormatNumber( this.api._powRoundFloatByPrecision( parseFloat(_.sumBy( _.map( this._getBatchDataByMenuSection(menuSection, dataSet), i=>parseFloat(_.trim(_.get(i, "invoicedAmount", "0.00")).replace(",","."))), i=>parseFloat(i)) )))
    }

    _invoicesToBeCorrectedRefusedAmount(menuSection, dataSet) {
        return this.api.hrFormatNumber( this.api._powRoundFloatByPrecision( parseFloat(_.sumBy( _.map( this._getBatchDataByMenuSection(menuSection, dataSet), i=>parseFloat(_.trim(_.get(i, "refusedAmount", "0.00")).replace(",","."))), i=>parseFloat(i)) )))
    }

    _acceptedAmount(menuSection, dataSet) {
        return this.api.hrFormatNumber( this.api._powRoundFloatByPrecision( parseFloat(_.sumBy( _.map( this._getBatchDataByMenuSection(menuSection, dataSet), i=>parseFloat(_.get(i, ((menuSection === "j20_reject" || menuSection === "j20_process") ? "" : "metas.totalAmount"), "0.00"))), i=>parseFloat(i)) )))
    }

    _rejectedAmount(menuSection, dataSet) {
        return this.api.hrFormatNumber( this.api._powRoundFloatByPrecision( parseFloat(_.sumBy( _.map( this._getBatchDataByMenuSection(menuSection, dataSet), i=>parseFloat(_.get(i, (menuSection !== "j20_reject" ? "" : "metas.totalAmount"), "0.00"))), i=>parseFloat(i)) )))
    }

    _getIconStatusClass(status) {

        return (status === this.localize('inv_acc_tre','Accepted for treatment',this.language)) ? "invoice-status--blueStatus" :
            (status === this.localize('inv_to_be_send','To be send',this.language)) ? (!this.statusToBeSend)  ? "invoice-status--blueStatus" : "invoice-status--orangeStatus" :
                (status === this.localize('inv_to_be_corrected','To be corrected',this.language))  ? "invoice-status--redStatus" :
                    (status === this.localize('inv_rej','To be corrected',this.language))  ? "invoice-status--redStatus" :
                        (status === this.localize('inv_par_acc','Partially accepted',this.language)) ? "invoice-status--orangeStatus" :
                            (status === this.localize('inv_full_acc','Fully accepted',this.language)) ? "invoice-status--greenStatus" :
                                (status === this.localize('inv_tre','Treated',this.language)) ? "invoice-status--greenStatus" :
                                    (status === this.localize('inv_acc_tre','Accepted for treatment',this.language)) ? "invoice-status--blueStatus" :
                                        (status === this.localize('inv_pen','Pending',this.language)) ? (!this.statusToBeSend) ? "invoice-status--blueStatus" : "" :
                                            (status === this.localize('inv_err','Error',this.language)) ? "invoice-status--redStatus" :
                                                (status === this.localize('inv_arch','Archived',this.language)) ? "invoice-status--purpleStatus" :
                                                    (status === this.localize('nmcl-rejected','Rejected',this.language)) ? "invoice-status--redStatus" :
                                                        (status === this.localize('nmcl-accepted','Accepted',this.language)) ? "invoice-status--greenStatus" :
                                                            (status === 'force-red') ? "txtcolor--redStatus" :
                                                                (status === 'force-green') ? "txtcolor--greenStatus" :
                                                                    ""
    }

    _getTxtStatusColor(status,amount) {
        if (parseFloat(amount) > 0) {
            return (status === this.localize('inv_par_acc','Partially accepted',this.language)) ? "txtcolor--orangeStatus" :
                (status === this.localize('inv_full_acc','Fully accepted',this.language)) ? "txtcolor--greenStatus" :
                    (status === this.localize('inv_to_be_corrected','To be corrected',this.language))  ? "txtcolor--redStatus" :
                        (status === this.localize('inv_rej','To be corrected',this.language))  ? "txtcolor--redStatus" :
                            (status === this.localize('inv_acc_tre','Accepted for treatment',this.language)) ? "txtcolor--blueStatus" :
                                (status === this.localize('inv_pen','Pending',this.language)) ? "txtcolor--blueStatus" :
                                    (status === this.localize('inv_tre','Treated',this.language)) ? "txtcolor--greenStatus" :
                                        (status === this.localize('inv_err','Error',this.language)) ? "txtcolor--redStatus" :
                                            (status === this.localize('inv_arch','Archived',this.language)) ? "txtcolor--purpleStatus" :
                                                (status === this.localize('nmcl-rejected','Rejected',this.language)) ? "txtcolor--redStatus" :
                                                    (status === this.localize('nmcl-accepted','Accepted',this.language)) ? "txtcolor--greenStatus" :
                                                        (status === 'force-red') ? "txtcolor--redStatus" :
                                                            (status === 'force-green') ? "txtcolor--greenStatus" :
                                                                (status === 'force-blue') ? "txtcolor--blueStatus" :
                                                                    ""
        }
    }

    _DEVELOPERS_ONLY_deleteFlatrateMessagesAndInvoices() {

        this.api.getRowsUsingPagination(
            (key,docId) =>
                this.api.message().findMessagesByTransportGuid('MH:FLATRATE:*', null, key, docId, 1000)
                    .then(pl => { return {
                        rows:_.filter(pl.rows, m => _.get(m,'fromHealthcarePartyId',false)===this.user.healthcarePartyId ),
                        nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                        nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                        done: !pl.nextKeyPair
                    }})
                    .catch(()=>{ return Promise.resolve(); })
        ).then(messages=>{
            const invoiceIdsFromMessage = _.compact(_.uniq( _.flatten(_.map(messages, i=>i.invoiceIds))))
            this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: invoiceIdsFromMessage }))
                .then(invoices=>{
                    const correctiveInvoiceIds = _.compact(_.uniq(_.map( _.filter(invoices, i=>!!_.trim(i.correctiveInvoiceId)), "id" )))
                    Promise.all( _.compact(_.uniq(_.concat(invoiceIdsFromMessage,correctiveInvoiceIds))).map(i => this.api.invoice().deleteInvoice(i).catch(()=>{}) ))
                        .then(()=> !!_.size(messages) && this.api.message().deleteMessagesBatch(new models.ListOfIdsDto({ids: _.map(messages, i=>i.id)})).catch(()=>{}) );
                })
        })
            .catch((e)=>console.log(e))

    }

    _generateJ20PdfTemplateObjects() {

        let pdfData = {};

        _.forEach( this.flatRateInvoicingDataObject.insurancesData, (oa,k)=> {
            pdfData[oa.id] = {
                oa: {
                    id: _.get(oa, "id", ""),
                    parent: _.get(oa, "parent", ""),
                    finalName: _.get(oa, "finalName", ""),
                    code: _.get(oa, "code", ""),
                    address: _.trim(_.compact([_.get(oa, "address.street", ""), _.get(oa, "address.houseNumber", ""), _.get(oa, "address.postboxNumber", "")]).join(' ')),
                    postalCode: _.get(oa, "address.postalCode", ""),
                    city: _.get(oa, "address.city", "")
                },
                entries: {
                    list5: _.filter(this.flatRateInvoicingDataObject.listsData.list5, (i=>_.trim(_.get(i, "finalInsurability.insuranceId", "" )) === _.trim(oa.id))),   // New patients WITHOUT tryout
                    list6: _.filter(this.flatRateInvoicingDataObject.listsData.list6, (i=>_.trim(_.get(i, "finalInsurability.insuranceId", "" )) === _.trim(oa.id))),   // New patients WITH tryout
                    list8: _.filter(this.flatRateInvoicingDataObject.listsData.list8, (i=>_.trim(_.get(i, "finalInsurability.insuranceId", "" )) === _.trim(oa.id))),   // "Old" patients
                }
            };
        }); // Loop OA

        const maxEntriesPerPage = 47;

        const pdfDataToPrint = _.compact(
            _.map( pdfData, (oaData)=> {

                let totalPages = 1;
                let currentPage = 0;
                let pdfTemplate = this._getExportPdfHeader();

                // Eval total pages
                _.forEach( oaData.entries, (listEntries)=> { if(!parseInt(_.size(listEntries))) return; let pageBreakentriesChunks = _.chunk(listEntries, maxEntriesPerPage ); _.forEach(pageBreakentriesChunks, ()=>{ totalPages++; }); })

                _.forEach( oaData.entries, (listEntries, listKey)=> {

                    if(!parseInt(_.size(listEntries))) return;
                    let listIndex = parseInt(listKey.replace('list',''));
                    let pageBreakentriesChunks = _.chunk(listEntries, maxEntriesPerPage );

                    this.flatRateInvoicingDataObject.oaTotalPrices.push({
                        oaId: oaData.oa.id,
                        listId: listKey,
                        listTotal: this.api._powRoundFloatByPrecision(_.sumBy( _.map( listEntries, i => this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.get( i, "invoicingCodes" ), "totalAmount" ) ), 2 ) ), i=>parseFloat(i) ), 2)
                    })

                    _.forEach(pageBreakentriesChunks, (entriesChunk)=>{
                        currentPage++;
                        pdfTemplate +=
                            this._getExportPageHeader(oaData.oa, true) +
                            this._getExportListHeader(listIndex, true) +
                            this._getExportListContentForInvoicing(listIndex,entriesChunk) +
                            this._getExportPageFooter(currentPage,totalPages,oaData.oa.code, true)
                    });

                })

                const totalAmount = this.api._powRoundFloatByPrecision( _.sumBy(_.filter(this.flatRateInvoicingDataObject.oaTotalPrices, i=>{ return _.trim(i.oaId)=== _.trim(oaData.oa.id) }), i=>parseFloat(i.listTotal)), 2);

                // List totals
                currentPage++
                pdfTemplate +=
                    this._getExportPageHeader(oaData.oa, true) +
                    "<div style='margin-top:100px'></div>" +
                    "<p class='bold fs10'>" +
                    _.compact(
                        _.map(oaData.entries, (listEntries, listKey) => {
                            let listIndex = parseInt(listKey.replace('list',''));
                            return !parseInt(_.size(listEntries)) ? false :
                                this.localize('flatrate_invoicing_listTotal',this.language) + ' ('+_.trim(listIndex)+') "<span class="italic colorBlue">'+_.trim(this.localize('flatrate_invoicing_'+_.trim(listIndex)+'_subheader',this.language)).toLowerCase()+'</span>": ' +
                                this.api.hrFormatNumber(_.get( _.filter(this.flatRateInvoicingDataObject.oaTotalPrices, i=>{ return _.trim(i.oaId)=== _.trim(oaData.oa.id) && _.trim(i.listId)=== _.trim(listKey) }), "[0].listTotal", 0 )) + ' €'
                        })
                    ) .join("<br />") +
                    "</p>" +
                    "<p class='bold fs15 mt20 colorBlue uppercase italic'>" + this.localize('flatrate_invoicing_insTotal',this.language) + ': ' + this.api.hrFormatNumber(totalAmount) + ' €</p>' +
                    this._getExportPageFooter(currentPage,totalPages,oaData.oa.code, true) +
                    this._getExportPdfFooter();

                return {
                    oaId: _.trim(oaData.oa.id),
                    parentOaId: _.trim(oaData.oa.parent),
                    invoiceIds: _.compact( _.map( _.flatMap( oaData.entries ), i =>_.trim(_.get(i, "invoices[0].id", "")) )),
                    totalAmount: totalAmount,
                    template: pdfTemplate,
                    totalPages: parseInt(totalPages)
                }

            })
        );

        return new Promise(resolve =>resolve(pdfDataToPrint))

    }

    _generateJ20PdfTemplateParentOaObjects() {

        let pdfData = {};
        let pdfDataToPrint = [];

        _.forEach( this.flatRateInvoicingDataObject.insurancesData, (oa,k)=> {
            pdfData[oa.id] = {
                oa: {
                    id: _.get(oa, "id", ""),
                    parent: _.get(oa, "parent", ""),
                    finalName: _.get(oa, "finalName", ""),
                    code: _.get(oa, "code", ""),
                    address: _.trim(_.compact([_.get(oa, "address.street", ""), _.get(oa, "address.houseNumber", ""), _.get(oa, "address.postboxNumber", "")]).join(' ')),
                    postalCode: _.get(oa, "address.postalCode", ""),
                    city: _.get(oa, "address.city", "")
                },
                entries: {
                    list5: _.filter(this.flatRateInvoicingDataObject.listsData.list5, (i=>_.trim(_.get(i, "finalInsurability.insuranceId", "" )) === _.trim(oa.id))),   // New patients WITHOUT tryout
                    list6: _.filter(this.flatRateInvoicingDataObject.listsData.list6, (i=>_.trim(_.get(i, "finalInsurability.insuranceId", "" )) === _.trim(oa.id))),   // New patients WITH tryout
                    list8: _.filter(this.flatRateInvoicingDataObject.listsData.list8, (i=>_.trim(_.get(i, "finalInsurability.insuranceId", "" )) === _.trim(oa.id))),   // "Old" patients
                }
            };
        }); // Loop OA

        const maxEntriesPerPage = 47;

        // Group by PARENT OA
        pdfDataToPrint = _.map( this.flatRateInvoicingDataObject.iosData, (parentOaData)=> {

            let totalPages = 1;
            let currentPage = 0;
            let oasTotalPrices = [];
            let invoiceIds = [];
            let pdfTemplate = this._getExportPdfHeader();

            // Eval total pages
            _.map( _.filter(pdfData, i=> _.trim(_.get(i,"oa.parent","")) === _.trim(_.get(parentOaData, "id", "" ))), (oaData)=> { _.forEach( oaData.entries, (listEntries)=> { if(!parseInt(_.size(listEntries))) return; let pageBreakentriesChunks = _.chunk(listEntries, maxEntriesPerPage ); _.forEach(pageBreakentriesChunks, ()=>{ totalPages++; }); }); totalPages++; /* For list totals */ })

            _.map( _.filter(pdfData, i=> _.trim(_.get(i,"oa.parent","")) === _.trim(_.get(parentOaData, "id", "" ))), (oaData)=> {

                _.forEach( oaData.entries, (listEntries, listKey)=> {

                    if(!parseInt(_.size(listEntries))) return;
                    let listIndex = parseInt(listKey.replace('list',''));
                    let pageBreakentriesChunks = _.chunk(listEntries, maxEntriesPerPage );

                    oasTotalPrices.push({
                        poaId: parentOaData.id,
                        oaId: oaData.oa.id,
                        listId: listKey,
                        listTotal: this.api._powRoundFloatByPrecision(_.sumBy( _.map( listEntries, i => this.api._powRoundFloatByPrecision( parseFloat( _.sumBy( _.get( i, "invoicingCodes" ), "totalAmount" ) ), 2 ) ), i=>parseFloat(i) ), 2)
                    })

                    _.forEach(pageBreakentriesChunks, (entriesChunk)=>{
                        currentPage++;
                        pdfTemplate +=
                            this._getExportPageHeader(oaData.oa, true) +
                            this._getExportListHeader(listIndex, true) +
                            this._getExportListContentForInvoicing(listIndex,entriesChunk) +
                            this._getExportPageFooter(currentPage,totalPages,oaData.oa.code, true)
                    });

                })

                const totalAmount = this.api._powRoundFloatByPrecision( _.sumBy(_.filter(oasTotalPrices, i=>{ return _.trim(i.oaId)=== _.trim(oaData.oa.id) }), i=>parseFloat(i.listTotal)), 2);

                // List totals
                currentPage++
                pdfTemplate +=
                    this._getExportPageHeader(oaData.oa, true) +
                    "<div style='margin-top:100px'></div>" +
                    "<p class='bold fs10'>" +
                    _.compact(
                        _.map(oaData.entries, (listEntries, listKey) => {
                            let listIndex = parseInt(listKey.replace('list',''));
                            return !parseInt(_.size(listEntries)) ? false :
                                this.localize('flatrate_invoicing_listTotal',this.language) + ' ('+_.trim(listIndex)+') "<span class="italic colorBlue">'+_.trim(this.localize('flatrate_invoicing_'+_.trim(listIndex)+'_subheader',this.language)).toLowerCase()+'</span>": ' +
                                this.api.hrFormatNumber(_.get( _.filter(oasTotalPrices, i=>{ return _.trim(i.oaId)=== _.trim(oaData.oa.id) && _.trim(i.listId)=== _.trim(listKey) }), "[0].listTotal", 0 )) + ' €'
                        })
                    ) .join("<br />") +
                    "</p>" +
                    "<p class='bold fs15 mt20 colorBlue uppercase italic'>" + this.localize('flatrate_invoicing_insTotal',this.language) + ': ' + this.api.hrFormatNumber(totalAmount) + ' €</p>' +
                    this._getExportPageFooter(currentPage,totalPages,oaData.oa.code, true)

                invoiceIds = _.concat(invoiceIds,  _.compact( _.map( _.flatMap( oaData.entries ), i =>_.trim(_.get(i, "invoices[0].id", "")) )))

            })

            parentOaData = _.merge(parentOaData, {
                address: _.trim(_.compact([_.get(parentOaData, "address.street", ""), _.get(parentOaData, "address.houseNumber", ""), _.get(parentOaData, "address.postboxNumber", "")]).join(' ')),
                postalCode: _.get(parentOaData, "address.postalCode", ""),
                city: _.get(parentOaData, "address.city", "")
            })

            let computedPrices = { list5: 0, list6: 0, list8: 0}
            _.map( oasTotalPrices, i => computedPrices[i.listId] += parseFloat(i.listTotal) )
            let poaTotalPrice = this.api._powRoundFloatByPrecision( computedPrices.list5 + computedPrices.list6 + computedPrices.list8, 2 )

            // PARENT OA List totals
            currentPage++
            pdfTemplate +=
                this._getExportPageHeader(parentOaData, true) +
                "<div style='margin-top:100px'></div>" +
                "<div style='padding:10px; border:3px solid #101079'>" +
                "<p class='bold fs15 mt20 colorBlue uppercase'>" + _.get(parentOaData, "code", "") + ' - ' + _.get(parentOaData, "finalName", "") + '</p>' +
                "<p class='bold fs10'>" +
                _.map(computedPrices, (totalPrice, listKey) => {
                    let listIndex = parseInt(listKey.replace('list',''));
                    return "" +
                        this.localize('flatrate_invoicing_listTotal',this.language) + ' ('+_.trim(listIndex)+') "<span class="italic colorBlue">'+_.trim(this.localize('flatrate_invoicing_'+_.trim(listIndex)+'_subheader',this.language)).toLowerCase()+'</span>": ' +
                        this.api.hrFormatNumber( this.api._powRoundFloatByPrecision(totalPrice) ) + ' €'
                }).join("<br />") +
                "</p>" +
                "<p class='bold fs15 mt20 colorBlue uppercase italic'>" + this.localize('groupGrandTotal',this.language) + ' <span style="color:#000000">' + _.get(parentOaData, "code", "") + '</span>: ' + this.api.hrFormatNumber( poaTotalPrice ) + ' €</p>' +
                "</div>" +
                this._getExportPageFooter(currentPage,totalPages,parentOaData.code, true)

            return {
                oaId: _.trim(parentOaData.id),
                parentOaId: _.trim(parentOaData.id),
                invoiceIds: invoiceIds,
                totalAmount: poaTotalPrice,
                template: pdfTemplate + this._getExportPdfFooter(),
                totalPages: parseInt(totalPages)
            }

        })

        return new Promise(resolve =>resolve(pdfDataToPrint))

    }

    _createMhExportZipArchive() {

        let zipArchive = new jsZip();

        _.map(this.flatRateInvoicingDataObject.iosData, parentOa => {

            // let parentOaFolderName = _.kebabCase( _.compact([ _.trim(_.get(parentOa, "code", "")), _.trim(_.get(parentOa, "finalName", "")) ]).join(" "))
            let parentOaFolderName = _.trim(_.get(parentOa, "code", ""))

            zipArchive
                .folder(parentOaFolderName)
                .file("bordereau-oa-"+_.trim(_.get(parentOa, "code", ""))+".txt", _.get(_.filter(this.flatRateInvoicingDataObject.generatedFiles.slips, {parentOaId:parentOa.id}),"[0].fileContent", ""))
                .file("flat-file-oa-"+_.trim(_.get(parentOa, "code", ""))+".txt", _.get(_.filter(this.flatRateInvoicingDataObject.generatedFiles.flatFiles, {parentOaId:parentOa.id}),"[0].fileContent", ""))
                .file("listes-A4-oa-"+_.trim(_.get(parentOa, "code", ""))+".pdf", _.get(_.filter(this.flatRateInvoicingDataObject.generatedFiles.oaPdfs, {parentOaId:parentOa.id}),"[0].fileContent", ""))

            _.map(_.filter(this.flatRateInvoicingDataObject.insurancesData, {parent:parentOa.id}), oa => {
                zipArchive
                    .folder(parentOaFolderName)
                    // .folder(_.kebabCase( _.compact([ _.trim(_.get(oa, "code", "")), _.trim(_.get(oa, "finalName", "")) ]).join(" ")))
                    .folder(_.trim(_.get(oa, "code", "")))
                    .file("listes-A4-oa-"+_.trim(_.get(oa, "code", ""))+".pdf", _.get(_.filter(this.flatRateInvoicingDataObject.generatedFiles.pdfs, {oaId:oa.id}),"[0].fileContent", ""))
            })

        })

        return zipArchive.generateAsync({
            // type:"blob",
            type:"arraybuffer",
            mimeType: "application/zip",
            compression: "DEFLATE",
            compressionOptions: { level: 9 }
        })

    }

    _showWarningNoHcpFlatrateTarification() {
        this.set("_bodyOverlay", true);
        this.$["missingMedicalHouseValorisations"].open()
    }

    _showWarningNoDataToExport() {
        this.set("_bodyOverlay", true);
        this.$["noDataToExport"].open()
    }

    _showWarningNoHcpContactPerson() {
        this.set("_bodyOverlay", true);
        this.$["noHcpContactPerson"].open()
    }

    _showWarningNoCbe() {
        this.set("_bodyOverlay", true);
        this.$["noHcpBce"].open()
    }

    _showWarningNoBankAccount() {
        this.set("_bodyOverlay", true);
        this.$["noHcpBankAccount"].open()
    }

    _showWarningExportAlreadyRan() {
        this.set("_bodyOverlay", true);
        this.$["exportAlreadyRan"].open()
    }

    _showWarningNoHcpNihii() {
        this.set("_bodyOverlay", true);
        this.$["missingNihiiDialog"].open()
    }

    _toggleBatchDetails(e) {

        // Make sure we have a "legit" click
        if( _.get(e, "path", false) ) {
            var paths = _.map( e.path, (pathNode,index)=> { return { index:index, nodeName:_.get( pathNode, "nodeName", "" ), target: _.get( pathNode, "id", "" ).toLowerCase()==="messagesgrid2" } })
            if( !parseInt(_.size(_.compact(_.map( paths.slice( 0, _.get( _.filter(paths,"target"), "[0].index", 0 ) ), (path, index) => { return ["vaadin-grid-cell-content", "slot", "td", "tr" ].indexOf( _.trim(path.nodeName).toLowerCase() ) > -1 } )))) ) return;
        }

        if ( _.size(this.activeGridItem) ) {

            this.api.setPreventLogging()
            this.shadowRoot.getElementById("messagesGridContainer").classList.add("half")
            this.shadowRoot.getElementById("invoiceDetailContainer").classList.add("open")

            let dataStatus = _.get(e, "currentTarget.dataset.status", "pending")
            let batchExportPdfs = _.filter(this.messagesCachedData.dataByStatus[dataStatus].pdfs, i=>{ return parseInt(_.get(i, "metas.batchExportTstamp", 0)) === parseInt(_.get( this.activeGridItem, "metas.batchExportTstamp", 0 )) && _.get(i, "metas.parentOaId", "") === _.trim(_.get( this.activeGridItem, "metas.parentOaId", "" )) })
            let batchExportInvoiceIds = _.uniq(_.flatten( _.map( batchExportPdfs, i=>i.invoiceIds) ) )

            this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: batchExportInvoiceIds}))
                .then(invoices => Promise.all(invoices.map(inv => this.api.crypto().extractCryptedFKs(inv, this.user.healthcarePartyId).then(ids => [inv, ids.extractedKeys[0]]))))
                .then(invAndIdsPat => this.api.patient().getPatientsWithUser(this.user,new models.ListOfIdsDto({ids: _.uniq(invAndIdsPat.map(x => x[1]))})).then(pats => invAndIdsPat.map(it => [it[0], pats.find(p => p.id === it[1])])))
                .then(invoicesAndPatient=>_.orderBy(
                    _.flatMap(
                        _.map(batchExportPdfs, message => {
                            return _.map(_.get(message, "invoiceIds", []), invoiceId => {

                                let invoiceData = _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} )
                                invoiceData = _.merge(invoiceData, {invoiceDate:_.trim(_.get(invoiceData, "invoiceDate","")) || moment(_.get(invoiceData, "created","0")).startOf('month').format("YYYYMMDD") })

                                const st = message.status
                                let invoiceStatus =
                                    !!(st & (1 << 21)) ? { hrLabel: this.localize('inv_arch','Archived',this.language), finalStatus:"archived" }:
                                        !!(st & (1 << 17)) ? { hrLabel: this.localize('inv_err','Error',this.language), finalStatus:"error" }:
                                            !!(st & (1 << 16)) ? { hrLabel: this.localize('inv_par_acc','Partially accepted',this.language), finalStatus:"partiallyAccepted" }:
                                                !!(st & (1 << 15)) ? { hrLabel: this.localize('inv_full_acc','Fully accepted',this.language), finalStatus:"fullyAccepted" }:
                                                    !!(st & (1 << 12)) ? { hrLabel: this.localize('inv_rej','Rejected',this.language), finalStatus:"rejected" }:
                                                        !!(st & (1 << 11)) ? { hrLabel: this.localize('inv_tre','Treated',this.language), finalStatus:"treated" }:
                                                            !!(st & (1 << 10)) ? { hrLabel: this.localize('inv_acc_tre','Accepted for treatment',this.language), finalStatus:"acceptedForTreatment" }:
                                                                !!(st & (1 << 9))  ? { hrLabel: this.localize('inv_succ_tra_oa','Successfully transmitted to OA',this.language), finalStatus:"successfullySentToOA" }:
                                                                    !!(st & (1 << 8))  ? { hrLabel: this.localize('inv_pen','Pending',this.language), finalStatus:"pending" }: ""

                                const acceptedAmount =
                                    _.get(invoiceStatus, "finalStatus") === "pending" ? "0,00" :
                                        _.get(invoiceStatus, "finalStatus") === "rejected" ? "0,00" :
                                            _.get(invoiceStatus, "finalStatus") === "fullyAccepted" ? _.sumBy( _.get( _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} ), "invoicingCodes", [] ), i=>parseFloat(i.totalAmount) ):
                                                _.get(invoiceStatus, "finalStatus") === "partiallyAccepted" ? _.sumBy( _.get( _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} ), "invoicingCodes", [] ), i=>( !i.canceled ? parseFloat(i.totalAmount) : 0) ):
                                                    _.get(invoiceStatus, "finalStatus") === "archived" ? _.sumBy( _.get( _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} ), "invoicingCodes", [] ), i=>( !i.canceled ? parseFloat(i.totalAmount) : 0) ):
                                                        "0,00"

                                const refusedAmount =
                                    _.get(invoiceStatus, "finalStatus") === "pending" ? "0,00" :
                                        _.get(invoiceStatus, "finalStatus") === "rejected" ? _.sumBy( _.get( _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} ), "invoicingCodes", [] ), i=>parseFloat(i.totalAmount) ) :
                                            _.get(invoiceStatus, "finalStatus") === "fullyAccepted" ? "0,00" :
                                                _.get(invoiceStatus, "finalStatus") === "partiallyAccepted" ? _.sumBy( _.get( _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} ), "invoicingCodes", [] ), i=>( !!i.canceled ? parseFloat(i.totalAmount) : 0) ):
                                                    _.get(invoiceStatus, "finalStatus") === "archived" ? _.sumBy( _.get( _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} ), "invoicingCodes", [] ), i=>( !!i.canceled ? parseFloat(i.totalAmount) : 0) ):
                                                        "0,00"

                                const messageOriginalStatus = invoiceStatus

                                invoiceStatus = _.get(invoiceStatus, "finalStatus")!=="partiallyAccepted" ? invoiceStatus :
                                    (_.size(_.compact(_.map( _.get( _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} ), "invoicingCodes", [] ), i=>!!i.canceled )))) ?
                                        { hrLabel: this.localize('inv_rej','Rejected',this.language), finalStatus:"rejected" } : { hrLabel: this.localize('inv_full_acc','Fully accepted',this.language), finalStatus:"fullyAccepted" }

                                return {
                                    id: _.get(message, "id", ""),
                                    oaId: _.get(message, "metas.oaId", ""),
                                    oaCode: _.get(_.filter(this.messagesCachedData.insurancesData, ins => ins.id === _.get(message, "metas.oaId", "")), "[0].code"),
                                    oaLabel: _.get(_.filter(this.messagesCachedData.insurancesData, ins => ins.id === _.get(message, "metas.oaId", "")), "[0].finalName"),
                                    parentOaId: _.get(message, "metas.parentOaId", ""),
                                    parentOaCode: _.get(_.filter(this.messagesCachedData.parentInsurancesData, ins => ins.id === _.get(message, "metas.parentOaId", "")), "[0].code"),
                                    parentOaLabel: _.get(_.filter(this.messagesCachedData.parentInsurancesData, ins => ins.id === _.get(message, "metas.parentOaId", "")), "[0].finalName"),
                                    invoiceData: invoiceData,
                                    patientData: _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][1]", {} ),
                                    invoicedAmount: this.api.hrFormatNumber( this.api._powRoundFloatByPrecision( _.sumBy( _.get( _.get(_.filter(invoicesAndPatient, i=>_.get(i, "[0].id", "")===invoiceId), "[0][0]", {} ), "invoicingCodes", [] ).filter(it => !it.pending), i=>parseFloat(i.totalAmount) ) ) ),
                                    acceptedAmount: this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(acceptedAmount)),
                                    refusedAmount: this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(refusedAmount)),
                                    invoiceStatusHr: _.get(invoiceStatus, "hrLabel"),
                                    invoiceFinalStatus: _.get(invoiceStatus, "finalStatus"),
                                    messageOriginalStatus: _.get(messageOriginalStatus, "finalStatus"),
                                    messageData: message
                                }
                            })
                        })
                    ),
                    ['oaCode','invoiceData.invoiceReference','patientData.firstName','patientData.lastName'],
                    ['asc','asc','asc','asc']
                ))
                .then(messageDetailsData=>{
                    this.set("messageDetailsData", messageDetailsData)
                    const invGridDetail = this.root.querySelector('#invoiceAndBatchesGridDetail'); invGridDetail && invGridDetail.clearCache();
                })
                .finally(()=>this.api.setPreventLogging(false))

        } else {

            this.set("messageDetailsData", null)
            const invGridDetail = this.root.querySelector('#invoiceAndBatchesGridDetail'); invGridDetail && invGridDetail.clearCache();

            this.shadowRoot.getElementById("messagesGridContainer") && this.shadowRoot.getElementById("messagesGridContainer").classList.remove("half")
            this.shadowRoot.getElementById("invoiceDetailContainer") && this.shadowRoot.getElementById("invoiceDetailContainer").classList.remove("open")

        }

    }

    _duplicateRejectedInvoices(rejectedInvoiceIds) {

        // 1. Get invoice(s)
        // 2. Extract foreign keys to get PAT ID
        // 3. Get pat with user
        // 4. Thanks to pat OBJECT, new instance invoice, omitting non "legit" fields (of inv to be corrected)
        // 5. Link NEW invoice to old one (corrective/corrected)
        // 6. On new inv instance, loop invoicing codes and set as pending true + resent true (all others to false)
        // 7. DO create new invoice, passing the entity ref ("type:hcpid:poaId:")
        // 8. Modify old invoice to set corrective invoice id
        this.api.setPreventLogging();
        let prom = Promise.resolve([])
        let insData = {}

        return !parseInt(_.size(rejectedInvoiceIds||[])) ?
            prom :
            this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: _.uniq(rejectedInvoiceIds)}))
                .then(invoices => {
                    return this._getInsurancesDataByIds(_.compact(_.uniq(_.map(invoices,"recipientId","")))).then(ins=>{ insData = ins; return invoices; })
                })
                .then(invoices => {
                    if(!parseInt(_.size(invoices))) throw new Error("no-resolved-invoices");
                    return Promise.all(invoices.map(inv => this.api.crypto().extractCryptedFKs(inv, _.get(this, "user.healthcarePartyId", ""))
                        .then(ids => [inv, ids.extractedKeys[0]])
                        .catch(e=>{console.log("Can't extractCryptedFKs for", inv, e); return [{},""];})
                    ))
                })
                .then(invoicesAndPatIds => {
                    if(!parseInt(_.size(invoicesAndPatIds))) throw new Error("no-invoices-and-pat-ids");
                    return this.api.patient().getPatientsWithUser(this.user,new models.ListOfIdsDto({ids: _.uniq(invoicesAndPatIds.map(x => x[1]))}))
                        .then(pats => invoicesAndPatIds.map(x => [x[0], pats.find(p => p.id === x[1])]))
                        .catch(e=>{ console.log("Can't getPatientsWithUser for", invoicesAndPatIds, e); return false; })
                })
                .then(invoicesAndPatients => {
                    if(!parseInt(_.size(invoicesAndPatients))) throw new Error("no-invoices-and-pats");
                    return Promise.all( invoicesAndPatients.map( invoiceAndPatient => {
                        let oldInvoice = invoiceAndPatient[0]
                        let patient = invoiceAndPatient[1]
                        return this.api.invoice().newInstance(
                            this.user,
                            patient,
                            _.omit(oldInvoice, [
                                "id",
                                "rev",
                                "deletionDate",
                                "created",
                                "modified",

                                // 20200201 - With have an error with appendCode that picks up non-corrected (yet) invoices & lost invoices despite the invoicingCodes statuses
                                // When rejecting a batch / invoice
                                //      -> original invoice.invoicingCodes are all set to false BUT the "canceled" bool that becomes true
                                //      -> original invoice.correctiveInvoiceId = the duplicated invoice
                                //      -> original invoice gets duplicated with invoicingCodes pending = true & resent = true (all others are false)
                                //      -> duplicated invoices gets as correctedInvoiceId = the original invoice id
                                //      -> here is the problem: if duplicated invoice has no sentDate, appendCode is gonna use it upon next run which is wrong (as it should only be picked up when corrected)
                                //      -> Work around = keep the original "sentDate" on duplicated invoice so that it won't be picked up and ONLY drop it by the time it's flagged as corrected.
                                // "sentDate",

                                "printedDate",
                                "secretForeignKeys",
                                "cryptedForeignKeys",
                                "delegations",
                                "encryptionKeys",
                                "invoicingCodes",
                                "error",
                                "receipts",
                                "encryptedSelf"
                            ])
                        )
                            .then(newInvoiceInstance => {
                                oldInvoice.correctiveInvoiceId = _.get(newInvoiceInstance, "id", "" )
                                newInvoiceInstance.correctedInvoiceId = _.get(oldInvoice, "id", "" )
                                return ({ oldInvoice, newInvoiceInstance })
                            })
                            .catch(e=>{ console.log("Can't get invoice newInstance based on ", oldInvoice, e); return false; })
                    }))
                        .then(x=>x)
                })
                .then(oldInvoicesObjectsAndNewInvoicesInstances => {
                    if(!parseInt(_.size(oldInvoicesObjectsAndNewInvoicesInstances))) throw new Error("no-old-new-invoices");
                    return Promise.all(oldInvoicesObjectsAndNewInvoicesInstances.map( i => {
                        i.newInvoiceInstance.invoicingCodes = _.map( i.oldInvoice.invoicingCodes, ic => { return _.assign({}, ic, {
                            id: this.api.crypto().randomUuid(),
                            accepted: false,
                            canceled: false,
                            pending: true,
                            resent: true,
                            archived: false
                        })})
                        return i;
                    }))
                        .then(x=>x)
                })
                .then(oldInvoicesObjectsAndNewInvoicesInstancesWithInvoicingCodes => {
                    if(!parseInt(_.size(oldInvoicesObjectsAndNewInvoicesInstancesWithInvoicingCodes))) throw new Error("no-old-new-invoices-with-invoicing-codes");

                    return Promise.all(oldInvoicesObjectsAndNewInvoicesInstancesWithInvoicingCodes.map( i => {
                        prom = prom.then(oldInvoicesObjectsAndNewInvoicesInstancesWithInvoicingCodes => {
                            // This would have 306 being thrown under 300 (done on purpose)
                            let parentInsCode = _.get( _.get(_.filter(insData, {id:_.get(i, "oldInvoice.recipientId", "")}), "[0]", {}), "code", "0" ).substr(0,1) + "00"
                            return this.api.invoice().modifyInvoice(i.oldInvoice).catch(e=>{ console.log("Can't modify old invoice ", i.oldInvoice, e); return false; }).then(()=>
                                this.api.invoice().createInvoice(i.newInvoiceInstance, 'invoice:' + this.user.healthcarePartyId + ':' + parentInsCode + ':')
                                    .then(()=> _.concat(oldInvoicesObjectsAndNewInvoicesInstancesWithInvoicingCodes, [i]))
                                    .catch(e=>{ console.log("Can't createInvoice for ", i.newInvoiceInstance, e); return false; })
                            )
                        })
                    }))

                })
                .catch((e)=>{
                    console.log(e);
                    return (
                        ( _.trim(e).indexOf('no-resolved-invoices') > -1 ) ? console.log("Couldn't find any invoice to resolve?") && e :
                            ( _.trim(e).indexOf('no-invoices-and-pat-ids') > -1 ) ? console.log("Couldn't resolve pat ids based on invoices?") && e :
                                ( _.trim(e).indexOf('no-invoices-and-pats') > -1 ) ? console.log("Couldn't resolve patients based on invoices?") && e :
                                    ( _.trim(e).indexOf('no-old-new-invoices') > -1 ) ? console.log("Couldn't get new invoices instances based on old ones?") && e :
                                        ( _.trim(e).indexOf('no-old-new-invoices-with-invoicing-codes') > -1 ) ? console.log("Couldn't get new invoices instances, (including invoicingCodes) based on old ones?") && e :
                                            e
                    )
                })
                .finally(()=>{
                    this.api.setPreventLogging(false);
                    return prom;
                })

    }

    _flagInvoiceAsCorrected(e) {

        this.set('_isLoadingSmall', true );
        const invoiceId = _.get(e, "target.dataset.invoiceId", "")

        this.api.invoice().getInvoice(invoiceId)
            .then(invoice => {

                // 20200201 - With have an error with appendCode that picks up non-corrected (yet) invoices & lost invoices despite the invoicingCodes statuses
                // When rejecting a batch / invoice
                //      -> original invoice.invoicingCodes are all set to false BUT the "canceled" bool that becomes true
                //      -> original invoice.correctiveInvoiceId = the duplicated invoice
                //      -> original invoice gets duplicated with invoicingCodes pending = true & resent = true (all others are false)
                //      -> duplicated invoices gets as correctedInvoiceId = the original invoice id
                //      -> here is the problem: if duplicated invoice has no sentDate, appendCode is gonna use it upon next ran which is wrong (as it should only be picked up when corrected)
                //      -> Work around = keep the original "sentDate" on duplicated invoice so that it won't be picked up and ONLY drop it by the time it's flagged as corrected.
                try{ delete(invoice.sentDate); } catch(e){}

                invoice.invoicingCodes.map(ic => {
                    ic.canceled = false;
                    ic.accepted = false;
                    ic.pending = true;
                    ic.resent = false;
                    ic.archived = false;
                    return ic;
                })
                return this.api.invoice().modifyInvoice(invoice).then(invoice => this.api.register(invoice,'invoice'))
            })
            .catch((e)=>{console.log(e)})
            .finally(() => {
                this.set('_isLoadingSmall', false );
                this._fetchJ20Messages(true)
            })

    }

    _flagInvoiceAsLostConfirmationDialog(e) {
        this.flagInvoiceAsLostId = _.get(e, "target.dataset.invoiceId", "")
        this.set("_bodyOverlay", true);
        this.$["flagInvoiceAsLostConfirmationDialog"].open()
    }

    _flagInvoiceAsLost() {

        this.set('_isLoadingSmall', true );

        this.api.invoice().getInvoice(this.flagInvoiceAsLostId)
            .then(invoice => {
                invoice.invoicingCodes.map(ic => {
                    ic.canceled = true;
                    ic.lost = true;
                    ic.accepted = false;
                    ic.pending = false;
                    ic.resent = false;
                    ic.archived = false;
                    return ic;
                })
                invoice.error = "Flagged as lost"
                return this.api.invoice().modifyInvoice(invoice).then(invoice => this.api.register(invoice,'invoice'))
            })
            .catch((e)=>{console.log(e)})
            .finally(() => {
                this.flagInvoiceAsLostId = "";
                this._closeDialogs()
                this.set('_isLoadingSmall', false );
                this._fetchJ20Messages(true)
            })

    }

    _fetchJ20Messages( forceRefresh = false ) {

        let prom = Promise.resolve(null)

        if( !forceRefresh && this.messagesCachedData.cachedTstamp > (+new Date() - this.cachedDataTTL) ) return prom;

        this.set('_isLoadingSmall', true );

        if(this.shadowRoot.getElementById("messagesGridContainer") && this.shadowRoot.getElementById("messagesGridContainer").classList.contains("half")){
            this.shadowRoot.getElementById("messagesGridContainer").classList.remove("half")
            this.shadowRoot.getElementById("invoiceDetailContainer").classList.remove("open")
        }

        let dataObject = {}
        let dataByStatus = {}
        let countByStatus = {}

        return this._getPatientsByHcp(_.get(this.hcp, "id"))
            .then(myPatients=>{
                dataObject = _.merge(dataObject, { patients: _.chain(myPatients).uniqBy('ssin').orderBy(['lastName', 'firstName'],['asc','asc']).value() })
                return this._getInsurancesDataByPatientsList(dataObject.patients).then(x=>x)
            })
            .then((insurancesData)=>{
                dataObject = _.merge(dataObject, { insurancesData: insurancesData })
                return this._getIOsDataByInsurancesList(dataObject.insurancesData).then(x=>x)
            })
            .then((parentInsurancesData)=>{
                dataObject = _.merge(dataObject, { parentInsurancesData: parentInsurancesData })
            })
            .then(()=>{
                return this.api.getRowsUsingPagination(
                    (key,docId) =>
                        this.api.message().findMessagesByTransportGuid('MH:FLATRATE:*', null, key, docId, 1000)
                            .then(pl => { return {
                                rows:_.filter(pl.rows, m => {
                                    return m
                                        && _.get(m,'fromHealthcarePartyId',false)===this.user.healthcarePartyId
                                        && _.get(m, "recipients", []).indexOf(this.user.healthcarePartyId) > -1
                                        && parseInt( _.get(m, "metas.batchExportTstamp", 0) )
                                        && parseInt( _.size( _.get(m, "invoiceIds", [] ) ) )
                                }),
                                nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                                nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                                done: !pl.nextKeyPair
                            }})
                            .catch(()=>{ return Promise.resolve(); })
                ).then(messages=>messages)
            })
            .then(messages => {

                this.messagesCachedData = _.merge( this.messagesCachedData, {
                    cachedTstamp: +new Date(),
                    insurancesData: dataObject.insurancesData,
                    parentInsurancesData: dataObject.parentInsurancesData,
                    roughData: _.chain(messages).uniqBy('id').value().map(message=> {
                        const st = message.status
                        const invoiceStatus =
                            !!(st & (1 << 21)) ? { hrLabel: this.localize('inv_arch','Archived',this.language), finalStatus:"archived" }:
                                !!(st & (1 << 17)) ? { hrLabel: this.localize('inv_err','Error',this.language), finalStatus:"error" }:
                                    !!(st & (1 << 16)) ? { hrLabel: this.localize('inv_par_acc','Partially accepted',this.language), finalStatus:"partiallyAccepted" }:
                                        !!(st & (1 << 15)) ? { hrLabel: this.localize('inv_full_acc','Fully accepted',this.language), finalStatus:"fullyAccepted" }:
                                            !!(st & (1 << 12)) ? { hrLabel: this.localize('inv_rej','Rejected',this.language), finalStatus:"rejected" }:
                                                !!(st & (1 << 11)) ? { hrLabel: this.localize('inv_tre','Treated',this.language), finalStatus:"treated" }:
                                                    !!(st & (1 << 10)) ? { hrLabel: this.localize('inv_acc_tre','Accepted for treatment',this.language), finalStatus:"acceptedForTreatment" }:
                                                        !!(st & (1 << 9))  ? { hrLabel: this.localize('inv_succ_tra_oa','Successfully transmitted to OA',this.language), finalStatus:"successfullySentToOA" }:
                                                            !!(st & (1 << 8))  ? { hrLabel: this.localize('inv_pen','Pending',this.language), finalStatus:"pending" }: ""

                        const acceptedAmount =
                            _.get(invoiceStatus, "finalStatus") === "pending" ? "0,00" :
                                _.get(invoiceStatus, "finalStatus") === "rejected" ? "0,00" :
                                    _.get(invoiceStatus, "finalStatus") === "fullyAccepted" ? this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(parseFloat(_.get(message, "metas.totalAmount", "0.00")))):
                                        _.get(invoiceStatus, "finalStatus") === "partiallyAccepted" ? this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(parseFloat(_.get(message, "metas.acceptedAmount", _.get(message, "metas.totalAmount", "0.00"))))):
                                            _.get(invoiceStatus, "finalStatus") === "archived" ? this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(parseFloat(_.get(message, "metas.acceptedAmount", _.get(message, "metas.totalAmount", "0.00"))))):
                                                "0,00"

                        const refusedAmount =
                            _.get(invoiceStatus, "finalStatus") === "pending" ? "0,00" :
                                _.get(invoiceStatus, "finalStatus") === "rejected" ? this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(parseFloat(_.get(message, "metas.totalAmount", "0.00")))) :
                                    _.get(invoiceStatus, "finalStatus") === "fullyAccepted" ? "0,00":
                                        _.get(invoiceStatus, "finalStatus") === "partiallyAccepted" ? this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(parseFloat(_.get(message, "metas.refusedAmount", "0.00")))):
                                            _.get(invoiceStatus, "finalStatus") === "archived" ? this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(parseFloat(_.get(message, "metas.refusedAmount", "0.00")))):
                                                "0,00"

                        return _.merge(message, {
                            messageInfo: {
                                hcp: _.trim(_.get(this.hcp, "name", "")) || _.trim(_.trim(_.get(this.hcp, "firstName", "")) + " " + _.trim(_.get(this.hcp, "lastName", ""))) || _.trim(_.get(this.user, "name", "")),
                                parentOaId: _.get(message, "metas.parentOaId", ""),
                                parentOaCode: _.get(_.filter(dataObject.parentInsurancesData, {id: _.get(message, "metas.parentOaId", "")}), "[0].code"),
                                parentOaLabel: _.get(_.filter(dataObject.parentInsurancesData, {id: _.get(message, "metas.parentOaId", "")}), "[0].finalName"),
                                hcpReference: "-",
                                batchReference: _.get(message, "metas.batchExportTstamp", ""),
                                invoicedMonth: this.localize('month_' + parseInt(moment(_.get(message, "metas.exportedDate", 0), "YYYYMMDD").format('M')), this.language) + " " + _.trim(_.get(message, "metas.exportedDate", _.get(message, "metas.exportDate", ""))).slice(0, 4),
                                generationDate: moment(parseInt(_.get(message, "created", 0))).format("DD/MM/YYYY"),
                                invoicedAmount: this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(parseFloat(_.get(message, "metas.totalAmount", "0.00")))),
                                acceptedAmount: acceptedAmount,
                                refusedAmount: refusedAmount,
                                invoiceStatusHr: _.get(invoiceStatus, "hrLabel"),
                                invoiceFinalStatus: _.get(invoiceStatus, "finalStatus"),
                                rejectionReason: "-",
                                paymentReference: "-",
                                paymentDate: "-",
                                amountPaid: "-",
                                paymentAccount: this.api.formatBankAccount(_.get(_.head(_.filter(_.get(this.hcp, "financialInstitutionInformation", []), i => {
                                    return !!i && _.trim(_.get(i, "bankAccount", ""))
                                })), "bankAccount", "")),
                                paid: false,
                            }
                        })
                    })
                });

                _.map( this.invoiceMessageStatuses, (invMsgStatus,statusKey) =>{
                    dataByStatus[statusKey] = {
                        batches : _.orderBy(_.filter(this.messagesCachedData.roughData, i=> i.messageInfo.invoiceFinalStatus===statusKey && i.transportGuid === "MH:FLATRATE:INVOICING-BATCH-ZIP" ), ['metas.exportedDate','metas.parentOaId'],['desc','asc']),
                        flatFiles : _.orderBy( _.filter(this.messagesCachedData.roughData, i=> i.messageInfo.invoiceFinalStatus===statusKey && i.transportGuid === "MH:FLATRATE:INVOICING-FLATFILE" ), ['metas.exportedDate','metas.parentOaId'],['desc','asc']),
                        slips : _.orderBy( _.filter(this.messagesCachedData.roughData, i=> i.messageInfo.invoiceFinalStatus===statusKey && i.transportGuid === "MH:FLATRATE:INVOICING-SLIP" ), ['metas.exportedDate','metas.parentOaId'],['desc','asc']),
                        pdfs : _.orderBy( _.filter(this.messagesCachedData.roughData, i=> i.messageInfo.invoiceFinalStatus===statusKey && i.transportGuid === "MH:FLATRATE:INVOICING-PDF" ), ['metas.exportedDate','metas.parentOaId'],['desc','asc']),
                        oaPdfs : _.orderBy( _.filter(this.messagesCachedData.roughData, i=> i.messageInfo.invoiceFinalStatus===statusKey && i.transportGuid === "MH:FLATRATE:PARENT-OA-INVOICING-PDF" ), ['metas.exportedDate','metas.parentOaId'],['desc','asc'])
                    }
                    countByStatus[statusKey] = parseInt(_.size(dataByStatus[statusKey].flatFiles))
                })

                this.api.setPreventLogging()
                // Eval error invoices based on fully rejected or partially accepted
                return Promise.all( _.map( _.concat(dataByStatus.partiallyAccepted.flatFiles, dataByStatus.rejected.flatFiles), msg => {
                    const originalMessage = msg
                    const invoiceIds = _.compact(_.uniq(msg.invoiceIds))
                    return this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: invoiceIds}))
                        .then(allInvoices=>this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: _.map(allInvoices,"correctiveInvoiceId")})))
                        .then(invoicesToBeCorrected =>{
                            return _.compact(
                                _.map(invoicesToBeCorrected, i =>{
                                    return (

                                        // 20200201 - With have an error with appendCode that picks up non-corrected (yet) invoices & lost invoices despite the invoicingCodes statuses
                                        // When rejecting a batch / invoice
                                        //      -> original invoice.invoicingCodes are all set to false BUT the "canceled" bool that becomes true
                                        //      -> original invoice.correctiveInvoiceId = the duplicated invoice
                                        //      -> original invoice gets duplicated with invoicingCodes pending = true & resent = true (all others are false)
                                        //      -> duplicated invoices gets as correctedInvoiceId = the original invoice id
                                        //      -> here is the problem: if duplicated invoice has no sentDate, appendCode is gonna use it upon next ran which is wrong (as it should only be picked up when corrected)
                                        //      -> Work around = keep the original "sentDate" on duplicated invoice so that it won't be picked up and ONLY drop it by the time it's flagged as corrected.
                                        // !parseInt(_.get(i,"sentDate",0))

                                        _.trim(_.get(i,"error","")).toLowerCase() !== "flagged as lost"
                                        && _.every(_.get(i,"invoicingCodes",[]), ic=>{
                                            return _.get(ic,"pending",false)===true
                                                && _.get(ic,"resent",false)===true
                                                && _.get(ic,"accepted",false)===false
                                                && _.get(ic,"archived",false)===false
                                                && _.get(ic,"canceled",false)===false
                                                && _.get(ic,"lost",false)===false
                                        })
                                    ) ? i : false
                                })
                            )
                        })
                        .then(invoicesToBeCorrected => Promise.all(invoicesToBeCorrected.map(inv => this.api.crypto().extractCryptedFKs(inv, this.user.healthcarePartyId).then(ids => [inv, ids.extractedKeys[0]]))))
                        .then(invAndPatIds => this.api.patient().getPatientsWithUser(this.user,new models.ListOfIdsDto({ids: _.uniq(invAndPatIds.map(x => x[1]))})).then(pats => invAndPatIds.map(it => [it[0], pats.find(p => p.id === it[1])])))
                        .then(invoicesAndPatient=>_.orderBy(
                            _.map(invoicesAndPatient, invAndPat => {
                                let invoiceData = invAndPat[0]
                                const patientData = invAndPat[1]
                                invoiceData = _.merge(invoiceData, {invoiceDate:_.trim(_.get(invoiceData, "invoiceDate","")) || moment(_.get(invoiceData, "created","0")).startOf('month').format("YYYYMMDD") })
                                return {
                                    id: _.get(invoiceData, "id", ""),
                                    oaId: _.get(invoiceData, "recipientId", ""),
                                    oaCode: _.get(_.filter(this.messagesCachedData.insurancesData, ins => ins.id === _.get(invoiceData, "recipientId", "")), "[0].code"),
                                    oaLabel: _.get(_.filter(this.messagesCachedData.insurancesData, ins => ins.id === _.get(invoiceData, "recipientId", "")), "[0].finalName"),
                                    parentOaId: _.get(_.filter(this.messagesCachedData.insurancesData, ins => ins.id === _.get(invoiceData, "recipientId", "")), "[0].parent"),
                                    parentOaCode: _.get(_.filter(this.messagesCachedData.parentInsurancesData, ins => ins.id === _.get(message, "metas.parentOaId", "")), "[0].code"),
                                    parentOaLabel: _.get(_.filter(this.messagesCachedData.parentInsurancesData, ins => ins.id === _.get(message, "metas.parentOaId", "")), "[0].finalName"),
                                    invoiceData: invoiceData,
                                    patientData: patientData,
                                    invoicedAmount: this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(_.sumBy( _.get( invoiceData, "invoicingCodes", [] ), i=>parseFloat(i.totalAmount) ))),
                                    acceptedAmount: "0,00",
                                    refusedAmount: this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(_.sumBy( _.get( invoiceData, "invoicingCodes", [] ), i=>parseFloat(i.totalAmount) ))),
                                    messageData: originalMessage
                                }
                            })
                            ),
                            ['oaCode','invoiceData.invoiceReference','patientData.firstName','patientData.lastName'],
                            ['asc','asc','asc','asc']
                        )
                        .catch((e)=>console.log(e))
                })).then(x=>{

                    dataByStatus.error = _.orderBy( _.flatMap(x), ['oaCode','invoiceData.invoiceReference','patientData.firstName','patientData.lastName'], ['asc','asc','asc','asc'] )
                    countByStatus.error = parseInt(_.size(dataByStatus.error))

                    // "Reset" data = ONE batch per month and by batchExportTstamp - to be cancelled / reset / deleted
                    dataByStatus.reset.flatFiles = _.orderBy(_.uniqBy(this.messagesCachedData.roughData, it => _.trim(_.get(it,"metas.batchExportTstamp",""))), ['metas.exportedDate','metas.batchExportTstamp'], ['desc', 'desc'])
                    countByStatus.reset = parseInt(_.size(dataByStatus.reset.flatFiles))



                    const batchExportTstamps = _.compact(_.map(dataByStatus.reset.flatFiles, it => _.get(it,"metas.batchExportTstamp",false)))

                    _.map( batchExportTstamps, batchExportTstamp => {

                        let invoicedAmount = 0
                        let acceptedAmount = 0
                        let refusedAmount = 0
                        const targetMessage = _.find(dataByStatus.reset.flatFiles, it => _.get(it,"metas.batchExportTstamp","") === batchExportTstamp )
                        const batchExportTstampFileMessages = _.filter(_.get(this,"messagesCachedData.roughData",[]), it => _.get(it,"metas.batchExportTstamp","") === batchExportTstamp && _.get(it,"transportGuid","") === "MH:FLATRATE:INVOICING-FLATFILE"  )

                        _.map(batchExportTstampFileMessages, it => {
                            invoicedAmount += parseFloat(_.trim(_.get(it,"messageInfo.invoicedAmount","")).replace(".","").replace(",",".")) * 10000
                            acceptedAmount += parseFloat(_.trim(_.get(it,"messageInfo.acceptedAmount","")).replace(".","").replace(",",".")) * 10000
                            refusedAmount += parseFloat(_.trim(_.get(it,"messageInfo.refusedAmount","")).replace(".","").replace(",",".")) * 10000
                        })

                        _.assign(targetMessage, {
                            totalInvoicedAmount: this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(invoicedAmount/10000)),
                            totalAcceptedAmount: this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(acceptedAmount/10000)),
                            totalRefusedAmount: this.api.hrFormatNumber(this.api._powRoundFloatByPrecision(refusedAmount/10000)),
                        })

                    })



                    // For us (has to be assigned at once)
                    this.set("messagesCachedData.dataByStatus", dataByStatus)
                    this.set("messagesCachedData.countByStatus", countByStatus)

                    // For msg-menu
                    this.dispatchEvent(new CustomEvent('initialize-batch-counter-j20', { bubbles: true, composed: true, detail: this.messagesCachedData.countByStatus }));

                    return null;

                })
                    .catch((e)=>console.log(e))

            })
            .catch((e)=>console.log(e))
            .finally(()=>{

                this.set("messagesGridData", [])
                this.set("messagesGridDataReset", [])
                const messagesGrid = this.root.querySelector('#messagesGrid'); messagesGrid && messagesGrid.clearCache();
                const messagesGrid2 = this.root.querySelector('#messagesGrid2'); messagesGrid2 && messagesGrid2.clearCache();
                const messagesGrid3 = this.root.querySelector('#messagesGrid3'); messagesGrid3 && messagesGrid3.clearCache();

                this.set("messagesGridData", this._getBatchDataByMenuSection(this.flatrateMenuSection, 'flatFiles'))
                this.set("messagesGridDataReset", _.get(this, "messagesCachedData.dataByStatus.reset.flatFiles", []))

                messagesGrid && messagesGrid.clearCache();
                messagesGrid2 && messagesGrid2.clearCache();
                messagesGrid3 && messagesGrid3.clearCache();

                this.set('_isLoadingSmall', false )
                this.api.setPreventLogging(false)
                return prom

            })

    }

    _getPatientsWithValidInvoiceForExportedMonth(patients, exportedMonth) {

        let prom = Promise.resolve([])

        _.map(patients, pat => {
            prom = prom.then(promisesCarrier => this.api.invoice().findBy(_.get(this,"user.healthcarePartyId"), pat)
                .then(invoices => _.filter(invoices, inv => inv &&
                    inv.sentDate &&
                    inv.sentMediumType === "cdrom" &&
                    _.size(_.filter(inv.invoicingCodes, ic => !ic.lost && !ic.canceled && !ic.resent)) &&
                    _.trim(inv.invoiceDate) === exportedMonth
                ))
                .then(patValidInvoicesForExportedMonth => !!_.size(patValidInvoicesForExportedMonth) ? _.get(pat,"id",false) : false)
                .then(patId => _.concat(promisesCarrier, [patId]))
                .catch(()=>_.concat(promisesCarrier, [false]))
            )
        })

        return prom.then(x=>_.compact(x))

    }

    _exportFlatRateInvoicing() {

        this.set('_isLoading', true );
        this.api.setPreventLogging();
        this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_1',this.language), icon:"arrow-forward"});
        this.reportCurrentDateString = null;
        const flatRateUtil = this.$.flatrateUtils;

        // Force refresh - could be new "valorisation" / bce / bank account / contact person / ... was just set
        if(_.size(_.get(this.api.hcparty().cache, _.get(this.user, "healthcarePartyId", "" )))) delete this.api.hcparty().cache[_.get(this.user, "healthcarePartyId", "" )];

        this.api.hcparty().getHealthcareParty(_.get(this.user, "healthcarePartyId", "" )) //0
            .then(hcp => { //1

                this.set("hcp", hcp);
                if (!_.trim(_.get(this, "hcp.nihii", ""))) throw new Error("no-nihii");

                this.flatRateInvoicingDataObject = {
                    hcpData: {
                        id: _.trim(_.get(this.hcp, "id")),
                        name: _.trim(_.get(this.hcp, "name", "")) || _.trim(_.trim(_.get(this.hcp, "firstName", "")) + " " + _.trim(_.get(this.hcp, "lastName", ""))) || _.trim(_.get(this.user, "name", "")),
                        address: _.chain(_.get(this.hcp, "addresses", {})).filter({addressType: "work"}).head().value() || _.chain(_.get(this.hcp, "addresses", {})).filter({addressType: "home"}).head().value() || _.chain(_.get(this.hcp, "addresses", {})).head().value() || {},
                        cbe: _.trim(_.get(this.hcp, "cbe", "")),
                        nihii: _.trim(_.get(this.hcp, "nihii", "")),
                        nihiiFormated: this.api.formatInamiNumber(_.trim(_.get(this.hcp, "nihii", ""))),
                        contactPersonHcpId: _.trim(_.get(this.hcp, "contactPersonHcpId", "")),
                        contactPerson: "",  // Make it empty at first, done on purpose
                        financialInfo: _.head(_.filter(_.get(this.hcp, "financialInstitutionInformation", []), i => _.trim(_.get(i, "bankAccount", ""))))
                    },
                    patientsData: [],
                    insurancesData: [],
                    iosData: [],
                    listsData: [],
                    patientIdsWithValidInvoiceForExportedMonth: [],
                    invoicesData: [],
                    oaTotalPrices: [],
                    batchExportTstamp: +new Date(),
                    exportedDate: _.trim( parseInt(_.get(this.shadowRoot.getElementById("exportedYear"), "value", this._getExportCurrentYear())) + ((_.trim(_.get(this.shadowRoot.getElementById("exportedMonth"), "value", this._getExportCurrentMonth())).length === 1 ? "0" : "") + parseInt(_.get(this.shadowRoot.getElementById("exportedMonth"), "value", this._getExportCurrentMonth()))) + "01" ),
                    generatedFiles: { pdfs: {}, oaPdfs: {}, flatFiles: {}, slips: {} },
                    finalArchiveSpeakingName: { archiveDownloadFileName: _.kebabCase(_.compact([ moment().format('YYYY-MM-DD-HH[h]-mm[m]-ss[s]'), "medical house", _.trim(_.get(this.hcp, "name", "")) || _.trim(_.trim(_.get(this.hcp, "firstName", "")) + " " + _.trim(_.get(this.hcp, "lastName", ""))) || _.trim(_.get(this.user, "name", "")), "invoicing export", +new Date() ]).join(" ")) + ".zip" },
                    finalArchive: { archiveDownloadFileName: _.kebabCase(_.compact([ moment().format('YYYY-MM-DD-HH[h]-mm[m]-ss[s]'), "invoicing export", ]).join(" ")) + ".zip" },
                    pendingInvoicesToResend: [],
                    pendingInvoicesAndPatToResend: [],
                    hcpValorisationsByMonth: []
                }
                this.reportCurrentDateMomentObject = moment(_.trim(this.flatRateInvoicingDataObject.exportedDate), "YYYYMMDD")
                this.flatRateInvoicingDataObject.hcpData = _.merge(this.flatRateInvoicingDataObject.hcpData, {
                    phone: _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.hcpData.address.telecoms, {telecomType: "phone"}), "[0].telecomNumber", "")) || _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.hcpData.address.telecoms, {telecomType: "mobile"}), "[0].telecomNumber", "")),
                    email: _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.hcpData.address.telecoms, {telecomType: "email"}), "[0].telecomNumber", "")),
                    financialInfo: {
                        bankAccount: _.trim(_.get(this.flatRateInvoicingDataObject, "hcpData.financialInfo.bankAccount", "")),
                        bankAccountFormated: this.api.formatBankAccount(_.trim(_.get(this.flatRateInvoicingDataObject, "hcpData.financialInfo.bankAccount", ""))),
                        bic: _.trim(_.get(this.flatRateInvoicingDataObject, "hcpData.financialInfo.bic", "")) || this.api.getBicByIban(_.trim(_.get(this.flatRateInvoicingDataObject, "hcpData.financialInfo.bankAccount", ""))),
                        name: _.trim(_.get(this.flatRateInvoicingDataObject, "hcpData.financialInfo.name", "")),
                    }
                })


                // Make sure - refuse to proceed if missing
                if (!_.trim(_.get(this, "flatRateInvoicingDataObject.hcpData.cbe"))) throw new Error("missing-cbe");

                // Make sure - refuse to proceed if missing
                if (!_.trim(_.get(this, "flatRateInvoicingDataObject.hcpData.contactPersonHcpId"))) throw new Error("missing-contact-person");

                // Make sure - refuse to proceed if missing
                if (!_.size(this.flatRateInvoicingDataObject.hcpData.financialInfo) || !_.trim(_.get(this, "flatRateInvoicingDataObject.hcpData.financialInfo.bankAccount", ""))) throw new Error("missing-bank-account");

                // Check again, even if already done in this.super() - could be got updated meanwhile & this.super() is only called !once
                this.api.hcparty().getHealthcareParty(_.trim(_.get(this, "flatRateInvoicingDataObject.hcpData.contactPersonHcpId")))
                    .then(hcpContactPerson => {
                        if (!_.size(hcpContactPerson) || !_.trim(_.get(hcpContactPerson, "id", "")) || !_.trim(_.get(hcpContactPerson, "lastName", "")) || !_.trim(_.get(hcpContactPerson, "firstName", ""))) throw new Error("missing-contact-person");
                        const contactPerson = _.trim(_.trim(_.get(hcpContactPerson, "lastName", "")) + " " + _.trim(_.get(hcpContactPerson, "firstName", "")))
                        this.set("contactPerson", contactPerson);
                        this.flatRateInvoicingDataObject.hcpData.contactPerson = contactPerson
                    })
                    .catch((e) => { throw new Error("missing-contact-person"); })


                // Get valorisations for last X months - as of export date
                let valorisationMonths = [];
                for (let i = 0; i < 240; i++) { valorisationMonths.push(_.trim(moment(_.trim(this.flatRateInvoicingDataObject.exportedDate), "YYYYMMDD").startOf('month').subtract(i, "month").format("YYYYMMDD"))) }
                this.flatRateInvoicingDataObject.hcpValorisationsByMonth = valorisationMonths.map(valorisationMonth => {
                    return {
                        month: parseInt(valorisationMonth),
                        valorisations: _.merge(
                            [
                                {code: "109616", price: 0.00, flatRateType: "physician"},           // Doctor
                                {code: "509611", price: 0.00, flatRateType: "physiotherapist"},     // Kine
                                {code: "409614", price: 0.00, flatRateType: "nurse"}                // Nurse
                            ],
                            _.compact(
                                _.chain(_.get(this.hcp, "flatRateTarifications", []))
                                    .map(singleNomenclature => {
                                        const valorisationObject = _.head(
                                            _.orderBy(
                                                _
                                                    .chain(singleNomenclature.valorisations)
                                                    .filter(singleValorisation => {
                                                        return (
                                                            !!singleValorisation
                                                            && parseFloat(_.get(singleValorisation, "reimbursement", 0))
                                                            && (
                                                                (moment(_.trim(_.get(singleValorisation, "startOfValidity", "0")), "YYYYMMDD").startOf('month')).isBefore(moment(_.trim(valorisationMonth), "YYYYMMDD").startOf('month')) ||
                                                                (moment(_.trim(_.get(singleValorisation, "startOfValidity", "0")), "YYYYMMDD").startOf('month')).format("YYYYMMDD") === moment(_.trim(valorisationMonth), "YYYYMMDD").startOf('month').format("YYYYMMDD")
                                                            )
                                                        )

                                                    })
                                                    .value(),
                                                ["startOfValidity"],
                                                ["desc"]
                                            )
                                        )
                                        return parseFloat(_.get(valorisationObject, "reimbursement", 0)) ? {
                                            code: _.trim(_.get(singleNomenclature, "code")),
                                            label: _.get(singleNomenclature, "label"),
                                            flatRateType: _.trim(_.get(singleNomenclature, "flatRateType")),
                                            price: parseFloat(_.get(valorisationObject, "reimbursement", 0)),
                                            valorisationMonth: parseInt(valorisationMonth)
                                        } : false
                                    })
                                    .value()
                            )
                        )
                    }
                })


                // HCP NIHII last 3 digits = booleans (0/1) tell us whether or not HCP has (respectively) MKI availabilities (respectively: M = physician, K = physiotherapist & I = nurse)
                const medicalHouseNihiiLastThreeDigits = _.trim(this.hcp.nihii).slice(-3).split("")
                const medicalHouseAvailableValorisationsByNihii = _.compact(_.map(["physician", "physiotherapist", "nurse"], (v, k) => !!parseInt(medicalHouseNihiiLastThreeDigits[k]) ? {flatRateType: v} : false ))

                // At least one MH valorisation is missing
                if (
                    !parseInt(_.size(medicalHouseAvailableValorisationsByNihii))
                    || _.size(medicalHouseAvailableValorisationsByNihii) !== _.size(_.compact(_.map(medicalHouseAvailableValorisationsByNihii, mhValorisation => !!parseInt(_.size(_.filter(_.get(this, "flatRateInvoicingDataObject.hcpValorisationsByMonth[0].valorisations", {}), i =>  _.trim(_.get(i, "flatRateType", "")) === _.trim(mhValorisation.flatRateType) && parseFloat(_.get(i, "price", 0))))))))
                ) throw new Error("missing-flatrate-tarification");

                return null

            }) //1
            .then(()=>{ //2

                // Make sure we won't get disconnected if process runs for over an hour
                this.dispatchEvent(new CustomEvent('idle', {bubbles: true, composed: true}))

                // Check for existing exports - did it run already? - do we have anything to run again for this month?
                //     1. Get existing messages of month we're trying to export
                //     2. No message found -> allow to run. Only of status fullyAccepted / pending -> don't allow to run again. If some of status archived / error / partiallyAccepted / rejected -> allow to run again (after checking invoicingCode booleans).
                //     3. Take & resolve invoiceIds
                //     4. Only keep (old) invoices with a correctiveInvoiceId
                //     5. Resolve corrective invoices & drop already sent ones
                //     6. Filter inv.invoicingCodes based on all bool false but "pending" === true (when BOTH pending & resent are true -> invoice will appear under "Invoices to be corrected" / customer has to flag as being corrected)
                //     7. One+ record found? Export may run again
                return this.api.getRowsUsingPagination(
                    (key,docId) =>
                        this.api.message().findMessagesByTransportGuid('MH:FLATRATE:INVOICING-FLATFILE', null, key, docId, 1000)
                            .then(pl => { return {
                                rows:_.filter(pl.rows, m => {
                                    m.evaluatedStatus =
                                        !!(m.status & (1 << 21)) ? "archived" :
                                            !!(m.status & (1 << 17)) ? "error" :
                                                !!(m.status & (1 << 16)) ? "partiallyAccepted" :
                                                    !!(m.status & (1 << 15)) ? "fullyAccepted" :
                                                        !!(m.status & (1 << 12)) ? "rejected" :
                                                            !!(m.status & (1 << 11)) ? "treated" :
                                                                !!(m.status & (1 << 10)) ? "acceptedForTreatment" :
                                                                    !!(m.status & (1 << 9))  ? "successfullySentToOA" :
                                                                        !!(m.status & (1 << 8))  ? "pending" :
                                                                            ""
                                    return m
                                        && _.get(m,'fromHealthcarePartyId',false)===this.user.healthcarePartyId
                                        && _.get(m, "recipients", []).indexOf(this.user.healthcarePartyId) > -1
                                        && parseInt( _.get(m, "metas.batchExportTstamp", 0) )
                                        && parseInt( _.size( _.get(m, "invoiceIds", [] ) ) )
                                        && (
                                            parseInt( _.get(m, "metas.exportedDate", "" ) ) === parseInt(this.flatRateInvoicingDataObject.exportedDate)     // Either current month
                                            || parseInt( _.get(m, "metas.exportedDate", "" ) ) < parseInt(this.flatRateInvoicingDataObject.exportedDate)    // Or before, NEVER take resent invoices "in the future"
                                        )
                                }),
                                nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                                nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                                done: !pl.nextKeyPair
                            }})
                            .catch(()=>{ return Promise.resolve(); })
                ).then(foundMessages=> {

                    // Export already ran this month - any message at all?
                    this.flatRateInvoicingDataObject.exportAlreadyRanThisMonth = !!parseInt( _.size(_.filter(foundMessages, m=>{return _.trim(_.get(m,"metas.exportedDate",0))=== _.trim(this.flatRateInvoicingDataObject.exportedDate) })) )

                    // Invoices / no invoices to resend
                    return !parseInt(_.size(foundMessages)) ? [] :

                        // All are pending or fully accepted, nothing to resend
                        !parseInt( _.size(_.filter(foundMessages, msg => { return ["archived","error","partiallyAccepted","rejected"].indexOf(msg.evaluatedStatus) > -1 }))) ? [] :

                            this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: _.compact(_.uniq(_.flatMap(_.map(_.filter(foundMessages, msg => { return ["archived","error","partiallyAccepted","rejected"].indexOf(msg.evaluatedStatus) > -1 }), "invoiceIds"))))}))
                                .then(invoicesToBeCorrected => !parseInt(_.size(invoicesToBeCorrected)) ? [] :
                                    this.api.invoice().getInvoices(new models.ListOfIdsDto({ids: _.compact(_.uniq(_.map(_.filter(invoicesToBeCorrected, _.trim("correctiveInvoiceId")), "correctiveInvoiceId")))}))
                                        .then(correctiveInvoices => !parseInt(_.size(correctiveInvoices)) ? [] :
                                            _.compact(
                                                _.filter(correctiveInvoices, i => !_.trim(_.get(i, "sentDate", ""))).map(inv => {
                                                    // Make sure I have to take it into account (all false but the pending bool)
                                                    const invoicingCodes = _.get(inv, "invoicingCodes", [])
                                                    return !parseInt(_.size(invoicingCodes)) ? false :
                                                        _.every(invoicingCodes, ic => {
                                                            return _.get(ic,"accepted",false)===false
                                                                && _.get(ic,"archived",false)===false
                                                                && _.get(ic,"canceled",false)===false
                                                                && _.get(ic,"resent",false)===false
                                                                && _.get(ic,"lost",false)===false
                                                                && _.get(ic,"pending",false)===true
                                                        }) ? inv : false
                                                })
                                            )
                                        )
                                        .catch(e => { console.log("Could not getInvoices (corrective ones) by ", _.compact(_.uniq(_.map(_.filter(invoicesToBeCorrected, _.trim("correctiveInvoiceId")), "correctiveInvoiceId")))); console.log(e); return false; })
                                )
                                .catch(e => { console.log("Could not getInvoices (to be corrected) by ", _.compact(_.uniq(_.flatMap(_.map(foundMessages, "invoiceIds"))))); console.log(e); return false; })
                })

            }) //2
            .then(pendingInvoicesToResend => {

                // Go for any invoice(s) to be added in the batch (could be manually created using PAT's timeline (timeline && pat-flatrate-utils)
                // For performance purposes, such invoices could be found by scanning for messages with transportGuid "MH:FLATRATE:INVOICE-TO-ADD" (current or previous month allowed, never in the future), then go for the invoiceIds
                return flatRateUtil.getInvoicesToAddFromTimelineByMaxExportDate(parseInt(_.get(this,"flatRateInvoicingDataObject.exportedDate")))
                    .then(invoicesToAdd => _
                        .chain(invoicesToAdd)
                        .map(inv => {
                            // Make sure I have to take it into account (all false but the pending bool)
                            const invoicingCodes = _.get(inv, "invoicingCodes", [])
                            return !parseInt(_.size(invoicingCodes)) ? false :
                                _.every(invoicingCodes, ic => {
                                    return _.get(ic,"accepted",false)===false
                                        && _.get(ic,"archived",false)===false
                                        && _.get(ic,"canceled",false)===false
                                        && _.get(ic,"resent",false)===false
                                        && _.get(ic,"lost",false)===false
                                        && _.get(ic,"pending",false)===true
                                }) ? inv : false
                        })
                        .concat((pendingInvoicesToResend||[]))
                        .value()
                    )
            }) // 2 Bis
            .then(pendingInvoicesToResend => { //3
                if(!parseInt(_.size(pendingInvoicesToResend)) && !!this.flatRateInvoicingDataObject.exportAlreadyRanThisMonth) throw new Error("export-already-ran")
                this.flatRateInvoicingDataObject.pendingInvoicesToResend = pendingInvoicesToResend
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_1_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_2',this.language), icon:"arrow-forward"});
                return !!this.flatRateInvoicingDataObject.exportAlreadyRanThisMonth ? false : this._getPatientsByHcp(_.get(this.hcp, "id")).then(myPatients => _
                    .chain(myPatients)
                    .uniqBy('ssin')
                    .filter(pat => (
                        // Either pat is alive
                        !parseInt(_.get(pat, "dateOfDeath", 0)) ||
                        // Or pat's death occured during exported month -> at which point he should still be taken into account
                        (!!parseInt(_.get(pat, "dateOfDeath", 0)) && moment( _.get(pat, "dateOfDeath", 0), 'YYYYMMDD').startOf('month').add(1,"month").isAfter(this.reportCurrentDateMomentObject.startOf('month')))
                    ))
                    .orderBy(['lastName', 'firstName'],['asc','asc'])
                    .value()
                )
            }) //3
            .then(myPatients=> {
                return !parseInt(_.size(this.flatRateInvoicingDataObject.pendingInvoicesToResend)) ?
                    { myPatients: _.compact(myPatients), myPatientsToResend: [] } :
                    Promise.all(this.flatRateInvoicingDataObject.pendingInvoicesToResend.map(inv => this.api.crypto().extractCryptedFKs(inv, this.user.healthcarePartyId).then(ids => [inv, ids.extractedKeys[0]]).catch(e=>{console.log(e); console.log("Could not extractCryptedFKs for invoices to resend");})))
                        .then(invAndIdsPat => this.api.patient().getPatientsWithUser(this.user,new models.ListOfIdsDto({ids: _.uniq(invAndIdsPat.map(x => x[1]))})).then(pats => invAndIdsPat.map(it => [it[0], pats.find(p => p.id === it[1])])).catch(e=>{console.log(e); console.log("Could not get getPatientsWithUser for invoices to resend");}))
                        .then(invoicesAndPatient=>{
                            invoicesAndPatient = _.compact(_.map(invoicesAndPatient, invAndPat => {
                                let tempPat = _.cloneDeep(invAndPat[1])
                                tempPat.invoiceToBeResent = _.get(_.cloneDeep(invAndPat),"[0]",{})
                                tempPat.ssin = _.trim(_.get(tempPat,"ssin","")).replace(/[^\d]/gmi,"")
                                tempPat.lastName = (tempPat.lastName||"").toUpperCase()
                                tempPat.firstName = (tempPat.firstName||"").toUpperCase()
                                tempPat.dateOfBirth = (tempPat.dateOfBirth?moment(tempPat.dateOfBirth+"", "YYYYMMDD").format('DD/MM/YYYY'):"")
                                tempPat.finalInsurability = _.find(
                                    tempPat.insurabilities,
                                    (ins) => {
                                        return ins &&
                                            _.size(ins) &&
                                            !!_.trim(_.get( ins, "insuranceId", "" )) &&
                                            _.trim(_.get(ins, "parameters.tc1", "")).length === 3 &&
                                            _.trim(_.get(ins, "parameters.tc2", "")).length === 3 &&
                                            ( _.trim(_.get(ins, "parameters.tc1", "")) + _.trim(_.get(ins, "parameters.tc2", "")) !== "000000" ) &&
                                            // !!_.trim(_.get( ins, "identificationNumber", "" ) ) &&
                                            (
                                                moment(_.get(ins, "startDate"+"", 0), 'YYYYMMDD').isBefore( moment(_.trim(_.get(tempPat,"invoiceToBeResent.invoiceDate",0)),"YYYYMMDD") ) ||
                                                moment(_.get(ins, "startDate"+"", 0), 'YYYYMMDD').isSame(moment(_.trim(_.get(tempPat,"invoiceToBeResent.invoiceDate",0)),"YYYYMMDD")) ||
                                                !parseInt(_.get(ins, "startDate", 0))
                                            ) &&
                                            (
                                                moment(_.get(ins, "endDate"+"", 0), 'YYYYMMDD').isAfter(moment(_.trim(_.get(tempPat,"invoiceToBeResent.invoiceDate",0)),"YYYYMMDD")) ||
                                                moment(_.get(ins, "endDate"+"", 0), 'YYYYMMDD').isSame(moment(_.trim(_.get(tempPat,"invoiceToBeResent.invoiceDate",0)),"YYYYMMDD")) ||
                                                !parseInt(_.get(ins, "endDate", 0))
                                            )

                                        // 20200203 - Don't do that anymore, it would prevent errors from getting fixed. The correct way to reconcile an INVOICE vs. an INS is based on invoice's date and INS' date
                                        // When resending a corrective invoice, make sure we match PAT's INS to whom original invoice was sent to
                                        // _.trim(_.get(tempPat,"invoiceToBeResent.recipientId","")) === _.trim(_.get( ins, "insuranceId", "" ))
                                    }
                                )
                                tempPat.insurancePersonType = !_.trim( _.get( tempPat, "finalInsurability.titularyId", "" )) ? "T" : ( moment().diff(moment(_.get(tempPat, "dateOfBirth"+"", "0")+"", "DD/MM/YYYY"), 'years') < 18 ) ? "E" : "C"
                                tempPat.titularyId = _.trim( _.get( tempPat, "finalInsurability.titularyId", "" ))
                                invAndPat[1] = tempPat
                                // Make sure patient has a valid INS ("finalInsurability" corresponds to invoice date) for that invoice, otherwise drop (invoice can't be resent when it has nos valid insurance to related to)
                                return !_.size(_.get(tempPat,"finalInsurability",[])) ? false : invAndPat
                            }))
                            this.flatRateInvoicingDataObject.pendingInvoicesAndPatToResend = invoicesAndPatient
                            return { myPatients: _.compact(myPatients), myPatientsToResend: _.compact(_.map(invoicesAndPatient,x=>x[1])) }
                        })
            }) //4
            .then(patsAndPatsToResend=>{

                // PATS of mine, to be invoiced this month
                let myPatients = patsAndPatsToResend.myPatients

                // PATS of previous invoices (either rejected + corrected OR from PAT's timeline)
                const myPatientsToResend = _.cloneDeep(patsAndPatsToResend.myPatientsToResend)

                // If same PAT of same INS -> collect all invoicing codes under 1! invoice
                // If same PAT with different INS -> duplicate PAT with all invoicing codes of THAT INS (and append invoicing codes when already existing)
                // To figure it out (in case of a resent) -> look at invoice's "invoiceDate" and reconcile vs. PAT's INS of that time (*)

                // At this stage, 1+ the same patient could be present in myPatientsToResend but they'll all have 1! "invoiceToBeResent"
                // At this stage and because of previous step, PAT's "finalInsurability" already matches the invoice.sendDate it should be sent to (the correct INS based on date reconciliation)
                _.map(myPatientsToResend, patToResend => {
                    const patWithThatIns = _.find(myPatients, pat => { return pat &&
                        _.trim(_.get(pat,"ssin","")) === _.trim(_.get(patToResend,"ssin","")) &&
                        _.trim(_.get(pat,"finalInsurability.insuranceId","")) === _.trim(_.get(patToResend,"finalInsurability.insuranceId",""))
                    })
                    if(_.size(patWithThatIns)) {
                        patWithThatIns.invoiceToBeResent = _.concat((patWithThatIns.invoiceToBeResent||[]), patToResend.invoiceToBeResent)
                    }
                    else {
                        patToResend.isResent = true;
                        patToResend.invoiceToBeResent = [patToResend.invoiceToBeResent];
                        myPatients.push(patToResend);
                    }
                })

                // Todo: refactor this:
                // Either is not a resent -> can let go as below
                // Or it is, at which point valid MHC should be evaluated vs. ALL 1+ "invoiceToBeResent" date (discard invoiceToBeResent when non-legit)
                // Should we not have any "invoiceToBeResent" anymore -> either drop PAT (should it not exist in patsAndPatsToResend.myPatients) OR keep PAT when already existing in patsAndPatsToResend.myPatients

                // Find valid MHContract or drop entry
                myPatients = _.compact(_.map( myPatients, pat => {
                    pat.finalMedicalHouseContracts = _.get(
                        _.orderBy(
                            _
                                .chain(pat.medicalHouseContracts||[])
                                .filter(mhc => {
                                    // Eval final MHC either based on export date OR based on resent invoice date
                                    let mhcExportDateOrResentDate = !!parseInt(_.size(_.get(pat,"invoiceToBeResent[0]",[]))) ? moment(_.trim(_.get(pat,"invoiceToBeResent[0].invoiceDate",0)),"YYYYMMDD") : moment(_.trim(this.flatRateInvoicingDataObject.exportedDate), "YYYYMMDD")
                                    return (
                                        !!mhc &&
                                        !!_.size(mhc) &&
                                        // Has to begin in the past
                                        //TODO: I think it should be: startOfCoverage instead of startOfContract
                                        moment(_.trim(_.get(mhc, "startOfContract", 0)), "YYYYMMDD").startOf('month').isBefore(mhcExportDateOrResentDate) &&
                                        // Either end of contract is in the future or is not set
                                        //TODO: I think it should be: endOfCoverage instead of endOfContract
                                        ( moment(_.trim(_.get(mhc, "endOfContract", "0")), "YYYYMMDD").endOf('month').isAfter(mhcExportDateOrResentDate) || !parseInt(_.get(mhc, "endOfContract", 0)) ) &&
                                        (
                                            // Either start of coverage is before this month AND set OR
                                            // Start of coverage isn't set and start of contract is two month in the past (start of coverage = start of contract + 1 month when no trial period)
                                            ( parseInt(_.get(mhc, "startOfCoverage", 0)) && moment(_.trim(_.get(mhc, "startOfCoverage", "0")), "YYYYMMDD").endOf('month').isBefore(mhcExportDateOrResentDate) ) ||
                                            ( !parseInt(_.get(mhc, "startOfCoverage", 0)) && moment(_.trim(_.get(mhc, "startOfContract", 0)), "YYYYMMDD").startOf('month').add(1, 'months').isBefore(mhcExportDateOrResentDate) )
                                        )
                                        && //remove suspended contracts also during their time of suspension
                                        (
                                            //Allow contracts that:
                                            // don't have startOfSuspension (we ignore suspensions that only have endOfSuspension as they are incomplete data)
                                            // OR the invoicedate is before startOfSuspension
                                            // OR the invoicedate is after endOfSuspension
                                            (parseInt(_.get(mhc, "startOfSuspension", -1)) < 0) ||
                                            (parseInt(_.get(mhc, "startOfSuspension", 0)) && moment(_.trim(_.get(mhc, "startOfSuspension", "0")), "YYYYMMDD").isAfter(mhcExportDateOrResentDate)) ||
                                            (parseInt(_.get(mhc, "endOfSuspension", 0)) && moment(_.trim(_.get(mhc, "endOfSuspension", 0)), "YYYYMMDD").isBefore(mhcExportDateOrResentDate))
                                        )
                                    )
                                })
                                .value(),
                            ["startOfContract"],
                            ["desc"]
                        ),
                        "[0]", []
                    )
                    return _.size( pat.finalMedicalHouseContracts ) ? pat : false
                }))




                // Assign startOfCoverage if not set yet
                _.map( myPatients, pat => {
                    pat.finalMedicalHouseContracts = parseInt(_.get(pat.finalMedicalHouseContracts, "startOfCoverage", 0)) ?
                        pat.finalMedicalHouseContracts :
                        _.merge(
                            pat.finalMedicalHouseContracts,
                            {startOfCoverage: parseInt(moment(_.trim(_.get(pat.finalMedicalHouseContracts, "startOfContract", 0)), "YYYYMMDD").startOf('month').add(1, 'months').format("YYYYMMDD"))}
                        )
                })

                this.flatRateInvoicingDataObject.patientsData = myPatients
                this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_3_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_3',this.language), icon:"arrow-forward"});
                return this._getInsuranceTitularyInfo(myPatients)

            }) //5
            .then((myPatientsWithInsuranceTitularyInfo)=>{
                this.flatRateInvoicingDataObject.patientsData = myPatientsWithInsuranceTitularyInfo
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_3_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_4',this.language), icon:"arrow-forward"});
                return this._getInsurancesDataByPatientsList(myPatientsWithInsuranceTitularyInfo).then(x=>x)
            }) //6
            .then((insurancesData)=>{
                this.flatRateInvoicingDataObject.insurancesData = insurancesData
                return this._getIOsDataByInsurancesList(this.flatRateInvoicingDataObject.insurancesData).then(x=>x);}) //7
            .then((iosData) => {
                // Ins 306 has to be seen as a child of 300
                return this._getInsurancesDataByCode(300)
                    .then(ins300=>{
                        iosData = parseInt(_.size(_.filter(iosData, {code:"300"}))) ? iosData : _.size(_.filter(iosData, {code:"306"})) ? _.sortBy(_.concat(iosData, _.head(ins300)), "code") : iosData
                        _.remove(iosData, i=>_.trim(_.get(i,"code",""))==="306")
                        this.flatRateInvoicingDataObject.iosData = iosData
                        this.flatRateInvoicingDataObject.insurancesData = _.map(this.flatRateInvoicingDataObject.insurancesData, ins => { if(_.trim(_.get(ins, "code", "")) === "306") ins.parent = _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.iosData, {code:"300"}), "[0].id", "")); return ins })
                        return null
                    })
                    .then(()=>{

                        this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_4_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                        this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_5',this.language), icon:"arrow-forward"});

                        const listsData = { list5: [], list6: [], list8: [] }

                        // Eval pat's list 5/6/8
                        _.map(this.flatRateInvoicingDataObject.patientsData, pat => {

                            // None of the contracts -> Drop (Valid INS vs. exported date and valid MHC vs. exported date are already checked against at this stage)
                            if(!(_.get(pat, "finalMedicalHouseContracts.gp", false) || _.get(pat, "finalMedicalHouseContracts.kine", false) || _.get(pat, "finalMedicalHouseContracts.nurse", false))) return false

                            // Can only be a resent if for current exported month THAT PAT with THAT INS doesn't exist (most likely rejected+correct invoice OR invoice create via timeline AND for another INS)
                            // Ie: isResent is evaluated on BOTH pat's NISS AND pat's INS (between existing pats and pats to resend -> rejected+correct OR timeline)
                            const isResent = _.get(pat, "isResent", false)
                            const mhcStartOfCoverage = moment(_.get(pat,"finalMedicalHouseContracts.startOfCoverage"), "YYYYMMDD").startOf("month")
                            const mhcStartOfContract = moment(_.get(pat,"finalMedicalHouseContracts.startOfContract"), "YYYYMMDD").startOf("month")

                            // When is a resent -> Only look at the most recent invoice to define which list pat belongs to (remember: if original invoices of list 5/6 are to be resent: patient is known by now -> list 8).
                            // When not a resent = patient IS to be exported for this month (even though may have invoices to resend) -> always look at the month's exported date (at it will be the most recent date, we never re-invoice data of the future)
                            const compareDate = moment(_.trim( !isResent ? _.get(this,"flatRateInvoicingDataObject.exportedDate") : _
                                .chain(_.get(pat,"invoiceToBeResent",[]))
                                .orderBy(["invoiceDate"], ["desc"])
                                .head()
                                .get("invoiceDate")
                                .value()
                            ),"YYYYMMDD").startOf("month").subtract(1, "month")

                            // List 5 = New patients WITHOUT tryout (double amounts / must appear twice): Start of month of start cover must be EQUAL TO (start of export month -1 month) - AND Start of month of cover - 1 month === Start of month of contract
                            // List 6 = New patients WITH tryout (double amounts / must appear twice) - Start of month of start cover must be EQUAL TO (start of export month -1 month) - AND Start of month of cover - 1 month > Start of month of contract
                            // List 8 = "Old" patients: Start of month of start cover must be BEFORE (start of export month -1 month) - (Ie: start of coverage began 2+ month before exported month)
                            const isList5 = mhcStartOfCoverage.isSame(compareDate) && (_.cloneDeep(mhcStartOfCoverage).subtract(1, 'month')).isSame(mhcStartOfContract)
                            const isList6 = mhcStartOfCoverage.isSame(compareDate) && (_.cloneDeep(mhcStartOfCoverage).subtract(1, 'month')).isAfter(mhcStartOfContract)
                            const isList8 = mhcStartOfCoverage.isBefore(compareDate)

                            return isList8 ? listsData.list8 = _.concat(listsData.list8, [pat]) :
                                isList5 ? listsData.list5 = _.concat(listsData.list5, [pat]) :
                                    isList6 ? listsData.list6 = _.concat(listsData.list6, [pat]) :
                                        false

                        })

                        return listsData;

                    })

            }) //8
            .then((listsData)=> {

                this.flatRateInvoicingDataObject.listsData = listsData
                this.flatRateInvoicingDataObject.invoicesToBeModified = []

                // Drop patients we couldn't find in list (no valorisation)
                const patientsInLists = _.uniq(_.compact(_.flatMap(_.get(this, "flatRateInvoicingDataObject.listsData", {})).map(i => i.id))) || []
                this.flatRateInvoicingDataObject.patientsData = _.compact(_.map(this.flatRateInvoicingDataObject.patientsData, i => patientsInLists.indexOf(_.trim(i.id)) > -1 ? i : false))
                if (!parseInt(_.size(this.flatRateInvoicingDataObject.patientsData) || 0)) throw new Error("no-data-to-export")

                // Drop when not in use
                this.flatRateInvoicingDataObject.insurancesData = _.compact(_.map(this.flatRateInvoicingDataObject.insurancesData, i => !!(_.uniq(_.compact(_.map(this.flatRateInvoicingDataObject.patientsData, pat => _.get(pat, "finalInsurability.insuranceId", "")))) || []).indexOf(_.trim(i.id)) > -1 ? i : false))
                this.flatRateInvoicingDataObject.iosData = _.compact(_.map(this.flatRateInvoicingDataObject.iosData, i => !!(_.uniq(_.compact(_.map(this.flatRateInvoicingDataObject.insurancesData, oa => _.get(oa, "parent", ""))))).indexOf(_.trim(i.id)) > -1 ? i : false))

                this._setLoadingMessage({message: this.localize('mhListing.spinner.step_5_done', this.language),icon: "check-circle",updateLastMessage: true,done: true});
                this._setLoadingMessage({message: this.localize('mhInvoicing.spinner.step_4', this.language),icon: "arrow-forward"});

            }) //9
            .then(() => this._getPatientsWithValidInvoiceForExportedMonth(_.flatMap(_.cloneDeep(this.flatRateInvoicingDataObject.listsData)), _.trim(this.flatRateInvoicingDataObject.exportedDate)).then(x=>_.assign(this.flatRateInvoicingDataObject.patientIdsWithValidInvoiceForExportedMonth,x))) //10
            .then(() => {
                return Promise.all(_.toPairs(this.flatRateInvoicingDataObject.listsData).map(list => {

                    const typeList = list[0]
                    const patientList = list[1]
                    const codesList = typeList === "list5" || typeList === "list6" ?
                        // Lists 5 & 6 = NEW patients with respectively no tryout ; tryout
                        _.concat(
                            _.get(_.find(this.flatRateInvoicingDataObject.hcpValorisationsByMonth, {month:parseInt(_.trim(moment(_.trim(this.flatRateInvoicingDataObject.exportedDate), "YYYYMMDD").startOf('month').format("YYYYMMDD")))}), "valorisations"),
                            _.get(_.find(this.flatRateInvoicingDataObject.hcpValorisationsByMonth, {month:parseInt(_.trim(moment(_.trim(this.flatRateInvoicingDataObject.exportedDate), "YYYYMMDD").startOf('month').subtract(1,"month").format("YYYYMMDD")))}), "valorisations")
                        ) :
                        // List 8 = old / regular patients
                        _.get(_.find(this.flatRateInvoicingDataObject.hcpValorisationsByMonth, {month:parseInt(_.trim(moment(_.trim(this.flatRateInvoicingDataObject.exportedDate), "YYYYMMDD").startOf('month').format("YYYYMMDD")))}), "valorisations")

                    return _.compact(_.map(patientList, pat => {

                        // If is a resent -> pat already exists for exported month, with another INS.
                        // Ie: should NOT be charged for current exported month
                        const originalInvoicingCodes = _.get(pat,"isResent",false) ? [] : codesList.filter(code =>
                            parseFloat(code.price) && (
                                (code.flatRateType === "physician" && pat.finalMedicalHouseContracts.gp === true ) ||
                                (code.flatRateType === "nurse" && pat.finalMedicalHouseContracts.nurse === true) ||
                                (code.flatRateType === "physiotherapist" && pat.finalMedicalHouseContracts.kine === true)
                            )
                        )

                        const additionalInvoicingCodes = _.flatMap(_.map(_.get(pat,"invoiceToBeResent",[]), invoiceToBeResent => {

                            // In case we inherit of an invoice to be resent, make sure we don't invoice month to be resent twice
                            const invoiceCodesToBeDeleted = _.get(invoiceToBeResent,"invoicingCodes",[]).filter(ic=>_.compact(_.uniq(_.map(originalInvoicingCodes,oic=>_.trim(_.get(oic,"valorisationMonth",0))))).indexOf(_.trim(_.get(ic,"dateCode",0))) > -1 )

                            // 1+ times the same invoicing codes ? Update IC codes & DB
                            if( !!parseInt(_.size(invoiceCodesToBeDeleted)) ) {
                                const newInvoicingCodes = _.compact(_.map(invoiceToBeResent.invoicingCodes, ic => _.compact(_.map(invoiceCodesToBeDeleted,"id")).indexOf(_.trim(_.get(ic,"id",false)))>-1 ? false : ic ))
                                const invoiceToBeResentWithOmittedDuplicatedInvCodes = _.assign(_.cloneDeep(invoiceToBeResent), {invoicingCodes:newInvoicingCodes})
                                this.flatRateInvoicingDataObject.invoicesToBeModified.push(invoiceToBeResentWithOmittedDuplicatedInvCodes)
                            }

                            return _.map(
                                _.get(invoiceToBeResent,"invoicingCodes",[]).filter(ic=>_.compact(_.uniq(_.map(originalInvoicingCodes,oic=>_.trim(_.get(oic,"valorisationMonth",0))))).indexOf(_.trim(_.get(ic,"dateCode",0))) === -1 ),
                                ic => _.merge({},{
                                    code: _.get(ic,"code",""),
                                    label: { fr: _.get(ic,"label",""), nl: _.get(ic,"label",""), en: _.get(ic,"label","") },
                                    price: _.get(ic,"totalAmount",0),
                                    valorisationMonth: _.get(ic,"dateCode",null)
                                })
                            )

                        })||[])

                        // Say we generate month 01, then we generate month 02
                        // Then we flag invoices of month 01 as rejected + corrected
                        // Then we re-run month 02
                        // Export should only hold pat X for month 01 but not for month 02
                        const finalInvoicingCodes = _.compact(_.concat( additionalInvoicingCodes||[], (_.get(this,"flatRateInvoicingDataObject.patientIdsWithValidInvoiceForExportedMonth",[]).indexOf(_.get(pat,"id")) > -1 ? [] : originalInvoicingCodes) ))

                        return !_.size(finalInvoicingCodes) ? false : _.assign(pat, {
                            invoicingCodes: _.orderBy(_.map(finalInvoicingCodes, ic => ({
                                code: ic.code,
                                tarificationId: "INAMI-RIZIV|" + ic.code + "|1.0",
                                label: _.get(ic, "label."+this.language,""),
                                totalAmount: Number(_.get(ic,"price",0)),
                                reimbursement: Number(_.get(ic,"price",0)),
                                patientIntervention: Number(0.00).toFixed(2),
                                doctorSupplement: Number(0.00).toFixed(2),
                                units: 1,
                                canceled: false,
                                accepted: false,
                                pending: false,
                                resent: false,
                                lost: false,
                                archived: false,
                                dateCode: parseInt(_.get(ic,"valorisationMonth",0))||null,
                                id: this.api.crypto().randomUuid(),
                                logicalId: this.api.crypto().randomUuid()
                            })), ["dateCode"], ["desc"])
                        })
                    }))
                }))
                    .then(()=>{

                        console.log("--- Before generate invoices ---");
                        console.log(_.cloneDeep(this.flatRateInvoicingDataObject));

                        let prom = Promise.resolve([])
                        let invoicesToBeModified = _.cloneDeep(this.flatRateInvoicingDataObject.invoicesToBeModified);
                        return !parseInt(_.size(invoicesToBeModified||[])) ?
                            prom :
                            Promise.all(invoicesToBeModified.map( inv => {
                                prom = prom.then(invoicesToBeModified => this.api.invoice().modifyInvoice(inv)
                                    .then(() => _.concat(invoicesToBeModified, [inv]))
                                    .catch(e => { console.log("Can't modify invoice", inv, e); return false; })
                                )
                            }))
                    })
                    .then(()=> this._sleep(5000)) /* Cool down */
                    .then(()=>this._createOrUpdateMedicalHousePatientsInvoices())
            }) //11
            .then(invoicesData=>{
                this.flatRateInvoicingDataObject.invoicesData = invoicesData
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_4_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_7',this.language), icon:"arrow-forward"});
                return this._generateJ20FlatFiles().then(x=>x)
            }) //12
            .then(flatFileObjects=>{

                this.flatRateInvoicingDataObject.generatedFiles.flatFiles = _.map(flatFileObjects,i=>{
                    return {
                        downloadFileName: _.kebabCase(_.compact([
                            moment().format('YYYY-MM-DD-HH[h]-mm[m]-ss[s]'),
                            "medical house invoicing export flatfile parent oa",
                            _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.iosData, {id:i.io}), "[0].code" )),
                            _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.iosData, {id:i.io}), "[0].finalName" )),
                            +new Date()
                        ]).join(" ")) + ".txt",
                        fileContent: i.file,
                        parentOaId: i.io,
                        oaInvoiceIds: i.oaInvoiceIds,
                    }
                })

                this.flatRateInvoicingDataObject.generatedFiles.slips = _.map(flatFileObjects,i=>{
                    return {
                        downloadFileName: _.kebabCase(_.compact([
                            moment().format('YYYY-MM-DD-HH[h]-mm[m]-ss[s]'),
                            "medical house invoicing export slip parent oa",
                            _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.iosData, {id:i.io}), "[0].code" )),
                            _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.iosData, {id:i.io}), "[0].finalName" )),
                            +new Date()
                        ]).join(" ")) + ".txt",
                        fileContent: i.slip,
                        parentOaId: i.io,
                        oaInvoiceIds: i.oaInvoiceIds,
                    }
                })

                this.flatRateInvoicingDataObject = _.merge(this.flatRateInvoicingDataObject,{
                    totalByParentOa: _.map(
                        _.get(this, "flatRateInvoicingDataObject.generatedFiles.flatFiles", []),
                        flatFile => {
                            return {
                                parentOaId: _.trim(_.get(flatFile, "parentOaId", "" ) ),
                                totalAmount: this.api._powRoundFloatByPrecision(
                                    _.sumBy(
                                        _.compact(
                                            _.map(
                                                _.compact(
                                                    _.filter(
                                                        _.get(this, "flatRateInvoicingDataObject.invoicesData", []),
                                                        inv => _.size(_.filter(_.get(inv, "invoices", []), i=> { return _.compact(_.uniq(_.get(flatFile, "oaInvoiceIds", []))).indexOf(i.id) > -1 } ))
                                                    )
                                                ),
                                                oaInvoice => this.api._powRoundFloatByPrecision(parseFloat( _.sumBy( _.get(oaInvoice, "invoicingCodes"), "totalAmount" ) ))
                                            )
                                        ),
                                        i=>parseFloat(i)
                                    )
                                )
                            }

                        }
                    )
                })

                return Promise.all(this.flatRateInvoicingDataObject.generatedFiles.flatFiles.map( singleFileObject =>  {
                    return this.api.message().newInstance(this.user)
                        .then(newMessageInstance => this.api.message().createMessage(
                            _.merge(newMessageInstance, {
                                transportGuid: "MH:FLATRATE:INVOICING-FLATFILE",
                                recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id))],
                                recipientsType: "org.taktik.icure.entities.HealthcareParty",
                                metas: {
                                    filename: _.trim(singleFileObject.downloadFileName),
                                    totalInvoices: parseInt(_.size(singleFileObject.oaInvoiceIds)),
                                    exportedDate: parseInt(this.flatRateInvoicingDataObject.exportedDate),
                                    batchExportTstamp: parseInt(this.flatRateInvoicingDataObject.batchExportTstamp),
                                    parentOaId: _.trim(_.get(singleFileObject, "parentOaId", "")),
                                    totalAmount: _.get( _.filter( this.flatRateInvoicingDataObject.totalByParentOa, {parentOaId:_.trim(_.get(singleFileObject, "parentOaId", ""))} ), "[0].totalAmount", "0.00" )
                                },
                                toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id)))],
                                subject: "MH: Flatrate invoicing FLAT FILE export",
                                status: this.invoiceMessageStatuses.pending.status,
                                invoiceIds: _.compact(singleFileObject.oaInvoiceIds)
                            }))
                        )
                        .then(createdMessage => {
                            _.merge(singleFileObject, {messageId:createdMessage.id})
                            return this.api.document().newInstance(this.user, createdMessage, {documentType: 'report', mainUti: this.api.document().uti("text/plain"), name: _.trim(singleFileObject.downloadFileName)}).then(newDocumentInstance => this.api.document().createDocument(newDocumentInstance))
                        })
                        .then(createdDocument => {
                            _.merge(singleFileObject, {documentId:createdDocument.id})
                            return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, createdDocument, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(singleFileObject.fileContent))).then(encryptedFileContent => ({createdDocument, encryptedFileContent}))
                        })
                        .then(({createdDocument, encryptedFileContent}) => { return this.api.document().setAttachment(createdDocument.id, null, encryptedFileContent).then(x=>x).catch((e)=>{console.log("---error upload attachment flatfile---");console.log(createdDocument);console.log(encryptedFileContent);}) })
                }))
                    .then(()=>{
                        return Promise.all(this.flatRateInvoicingDataObject.generatedFiles.slips.map( singleFileObject =>  {
                            return this.api.message().newInstance(this.user)
                                .then(newMessageInstance => this.api.message().createMessage(
                                    _.merge(newMessageInstance, {
                                        transportGuid: "MH:FLATRATE:INVOICING-SLIP",
                                        recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id))],
                                        recipientsType: "org.taktik.icure.entities.HealthcareParty",
                                        metas: {
                                            filename: _.trim(singleFileObject.downloadFileName),
                                            totalInvoices: parseInt(_.size(singleFileObject.oaInvoiceIds)),
                                            exportedDate: parseInt(this.flatRateInvoicingDataObject.exportedDate),
                                            batchExportTstamp: parseInt(this.flatRateInvoicingDataObject.batchExportTstamp),
                                            parentOaId: _.trim(_.get(singleFileObject, "parentOaId", "")),
                                            totalAmount: _.get( _.filter( this.flatRateInvoicingDataObject.totalByParentOa, {parentOaId:_.trim(_.get(singleFileObject, "parentOaId", ""))} ), "[0].totalAmount", "0.00" )
                                        },
                                        toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id)))],
                                        subject: "MH: Flatrate invoicing SLIP export",
                                        status: this.invoiceMessageStatuses.pending.status,
                                        invoiceIds: _.compact(singleFileObject.oaInvoiceIds)
                                    }))
                                )
                                .then(createdMessage => {
                                    _.merge(singleFileObject, {messageId:createdMessage.id})
                                    return this.api.document().newInstance(this.user, createdMessage, {documentType: 'report', mainUti: this.api.document().uti("text/plain"), name: _.trim(singleFileObject.downloadFileName)}).then(newDocumentInstance => this.api.document().createDocument(newDocumentInstance))
                                })
                                .then(createdDocument => {
                                    _.merge(singleFileObject, {documentId:createdDocument.id})
                                    return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, createdDocument, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(singleFileObject.fileContent))).then(encryptedFileContent => ({createdDocument, encryptedFileContent}))
                                })
                                .then(({createdDocument, encryptedFileContent}) => { return this.api.document().setAttachment(createdDocument.id, null, encryptedFileContent).then(x=>x).catch((e)=>{console.log("---error upload attachment slip---");console.log(createdDocument);console.log(encryptedFileContent);}) })
                        })).then(x=>x)
                    })
                    .then(()=>{
                        return this.api.invoice().getInvoices(new models.ListOfIdsDto({ ids: _.uniq( _.compact( _.map( _.get(this.flatRateInvoicingDataObject, "invoicesData", []), i => _.get(i, "invoices[0].id", false )))) }))
                            .then(invoices => {
                                let limit = promiseLimit(100);
                                return Promise.all(invoices.map(inv => {
                                    return limit(() => {
                                        inv.sentDate = moment().format("YYYYMMDD")
                                        return retry.retry(() => (this.api.invoice().modifyInvoice(inv).then(inv =>this.api.register(inv,'invoice'))))
                                    })
                                }))
                            }).then(x=>x)
                    })
                    .then(()=>flatRateUtil.flagInvoicesToAddFromTimelineAsAdded(parseInt(_.get(this,"flatRateInvoicingDataObject.exportedDate"))))
                    .then(()=>{
                        this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_7_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                        this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_5',this.language), icon:"arrow-forward"});
                        return this._generateJ20PdfTemplateObjects().then(x=>x)
                    })
            }) //13
            .then(pdfTemplateObjects=>{
                return Promise.all(pdfTemplateObjects.map( singlePdfFileObject => this.api.pdfReport(mustache.render(singlePdfFileObject.template, {})).then(x=>_.merge(singlePdfFileObject, {fileContent:x.pdf})) ))
            }) //14
            .then(generatedPdfFiles=>{

                this.flatRateInvoicingDataObject.generatedFiles.pdfs = _.map(generatedPdfFiles,i=>{
                    try{ delete(i.template); } catch(e){}
                    i.downloadFileName = _.kebabCase(_.compact([
                        moment().format('YYYY-MM-DD-HH[h]-mm[m]-ss[s]'),
                        "medical house invoicing export pdf oa",
                        _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.insurancesData, {id:i.oaId}), "[0].code" )),
                        _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.insurancesData, {id:i.oaId}), "[0].finalName" )),
                        +new Date()
                    ]).join(" ")) + ".pdf"
                    return i;
                })

                return Promise.all(this.flatRateInvoicingDataObject.generatedFiles.pdfs.map( singlePdfFileObject =>  {
                    return this.api.message().newInstance(this.user)
                        .then(newMessageInstance => this.api.message().createMessage(
                            _.merge(newMessageInstance, {
                                transportGuid: "MH:FLATRATE:INVOICING-PDF",
                                recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id))],
                                recipientsType: "org.taktik.icure.entities.HealthcareParty",
                                metas: {
                                    totalPages: parseInt(singlePdfFileObject.totalPages),
                                    filename: _.trim(singlePdfFileObject.downloadFileName),
                                    totalInvoices: parseInt(_.size(singlePdfFileObject.invoiceIds)),
                                    exportedDate: parseInt(this.flatRateInvoicingDataObject.exportedDate),
                                    batchExportTstamp: parseInt(this.flatRateInvoicingDataObject.batchExportTstamp),
                                    totalAmount: singlePdfFileObject.totalAmount,
                                    oaId: _.trim(_.get(singlePdfFileObject, "oaId", "")),
                                    parentOaId: _.trim(_.get(singlePdfFileObject, "parentOaId", ""))
                                },
                                toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id)))],
                                subject: "MH: Flatrate invoicing PDF export",
                                status: this.invoiceMessageStatuses.pending.status,
                                invoiceIds: _.compact(singlePdfFileObject.invoiceIds)
                            }))
                        )
                        .then(createdMessage => {
                            _.merge(singlePdfFileObject, {messageId:createdMessage.id})
                            return this.api.document().newInstance(this.user, createdMessage, {documentType: 'report', mainUti: this.api.document().uti("application/pdf"), name: _.trim(singlePdfFileObject.downloadFileName)}).then(newDocumentInstance => this.api.document().createDocument(newDocumentInstance))
                        })
                        .then(createdDocument => {
                            _.merge(singlePdfFileObject, {documentId:createdDocument.id})
                            return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, createdDocument, singlePdfFileObject.fileContent).then(encryptedFileContent => ({createdDocument, encryptedFileContent}))
                        })
                        .then(({createdDocument, encryptedFileContent}) => { return this.api.document().setAttachment(createdDocument.id, null, encryptedFileContent).then(x=>x).catch((e)=>{console.log("---error upload attachment pdf---");console.log(createdDocument);console.log(encryptedFileContent);}) })
                })).then(x=>x)
            }) //15
            .then(()=>{
                return this._generateJ20PdfTemplateParentOaObjects().then(x=>x)
            }) //16
            .then((parentOaPdfTemplateObjects)=>{
                return Promise.all(parentOaPdfTemplateObjects.map( singlePdfFileObject => this.api.pdfReport(mustache.render(singlePdfFileObject.template, {})).then(x=>_.merge(singlePdfFileObject, {fileContent:x.pdf})) ))
            }) //17
            .then(generatedOaPdfFiles=>{

                this.flatRateInvoicingDataObject.generatedFiles.oaPdfs = _.map(generatedOaPdfFiles,i=>{
                    try{ delete(i.template); } catch(e){}
                    i.downloadFileName = _.kebabCase(_.compact([
                        moment().format('YYYY-MM-DD-HH[h]-mm[m]-ss[s]'),
                        "medical house invoicing export pdf parent oa",
                        _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.iosData, {id:i.oaId}), "[0].code" )),
                        _.trim(_.get(_.filter(this.flatRateInvoicingDataObject.iosData, {id:i.oaId}), "[0].finalName" )),
                        +new Date()
                    ]).join(" ")) + ".pdf"
                    return i;
                })

                return Promise.all(this.flatRateInvoicingDataObject.generatedFiles.oaPdfs.map( singlePdfFileObject =>  {
                    return this.api.message().newInstance(this.user)
                        .then(newMessageInstance => this.api.message().createMessage(
                            _.merge(newMessageInstance, {
                                transportGuid: "MH:FLATRATE:PARENT-OA-INVOICING-PDF",
                                recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id))],
                                recipientsType: "org.taktik.icure.entities.HealthcareParty",
                                metas: {
                                    totalPages: parseInt(singlePdfFileObject.totalPages),
                                    filename: _.trim(singlePdfFileObject.downloadFileName),
                                    totalInvoices: parseInt(_.size(singlePdfFileObject.invoiceIds)),
                                    exportedDate: parseInt(this.flatRateInvoicingDataObject.exportedDate),
                                    batchExportTstamp: parseInt(this.flatRateInvoicingDataObject.batchExportTstamp),
                                    totalAmount: singlePdfFileObject.totalAmount,
                                    oaId: _.trim(_.get(singlePdfFileObject, "oaId", "")),
                                    parentOaId: _.trim(_.get(singlePdfFileObject, "parentOaId", ""))
                                },
                                toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id)))],
                                subject: "MH: Flatrate invoicing Parent OA PDF export",
                                status: this.invoiceMessageStatuses.pending.status,
                                invoiceIds: _.compact(singlePdfFileObject.invoiceIds)
                            }))
                        )
                        .then(createdMessage => {
                            _.merge(singlePdfFileObject, {messageId:createdMessage.id})
                            return this.api.document().newInstance(this.user, createdMessage, {documentType: 'report', mainUti: this.api.document().uti("application/pdf"), name: _.trim(singlePdfFileObject.downloadFileName)}).then(newDocumentInstance => this.api.document().createDocument(newDocumentInstance))
                        })
                        .then(createdDocument => {
                            _.merge(singlePdfFileObject, {documentId:createdDocument.id})
                            return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, createdDocument, singlePdfFileObject.fileContent).then(encryptedFileContent => ({createdDocument, encryptedFileContent}))
                        })
                        .then(({createdDocument, encryptedFileContent}) => { return this.api.document().setAttachment(createdDocument.id, null, encryptedFileContent).then(x=>x).catch((e)=>{console.log("---error upload attachment parent oa pdf---");console.log(createdDocument);console.log(encryptedFileContent);}) })
                })).then(x=>x)
            }) //18
            .then(()=>{
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_5_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_8',this.language), icon:"arrow-forward"})
                return this._createMhExportZipArchive().then(x=>x)
            }) //19
            .then(batchZipFileBlob=>{
                this.flatRateInvoicingDataObject.finalArchive.batchZipFileBlob = batchZipFileBlob
                return this.api.message().newInstance(this.user)
                    .then(newMessageInstance => this.api.message().createMessage(
                        _.merge(newMessageInstance, {
                            transportGuid: "MH:FLATRATE:INVOICING-BATCH-ZIP",
                            recipients: [_.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id))],
                            recipientsType: "org.taktik.icure.entities.HealthcareParty",
                            metas: {
                                totalOa: parseInt(_.size(this.flatRateInvoicingDataObject.insurancesData)),
                                totalParentOa: parseInt(_.size(this.flatRateInvoicingDataObject.iosData)),
                                filename: _.trim(this.flatRateInvoicingDataObject.finalArchive.archiveDownloadFileName),
                                exportedDate: parseInt(this.flatRateInvoicingDataObject.exportedDate),
                                batchExportTstamp: parseInt(this.flatRateInvoicingDataObject.batchExportTstamp),
                                totalInvoices: parseInt(_.size(_.compact( _.map(this.flatRateInvoicingDataObject.invoicesData,i=>_.get(i,"invoices[0].id",""))))),
                                totalAmount: this.api._powRoundFloatByPrecision(_.sumBy( this.flatRateInvoicingDataObject.oaTotalPrices, i=>parseFloat(i.listTotal) ), 2)
                            },
                            toAddresses: [_.get(this.user, 'email', _.get(this.user, 'healthcarePartyId', _.trim(this.hcp.id)))],
                            subject: "MH: Flatrate invoicing BATCH ZIP export",
                            status: this.invoiceMessageStatuses.pending.status,
                            invoiceIds: _.compact( _.map(this.flatRateInvoicingDataObject.invoicesData,i=>_.get(i,"invoices[0].id","")))
                        }))
                    )
                    .then(createdMessage => {
                        _.merge(this.flatRateInvoicingDataObject.finalArchive, {messageId:createdMessage.id})
                        return this.api.document().newInstance(this.user, createdMessage, {documentType: 'report', mainUti: this.api.document().uti("application/zip"), name: _.trim(this.flatRateInvoicingDataObject.finalArchive.archiveDownloadFileName)}).then(newDocumentInstance => this.api.document().createDocument(newDocumentInstance))
                    })
                    .then(createdDocument => {
                        _.merge(this.flatRateInvoicingDataObject.finalArchive, {documentId:createdDocument.id})
                        return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", this.user, createdDocument, this.flatRateInvoicingDataObject.finalArchive.batchZipFileBlob).then(encryptedFileContent => ({createdDocument, encryptedFileContent}))
                    })
                    .then(({createdDocument, encryptedFileContent}) => { return this.api.document().setAttachment(createdDocument.id, null, encryptedFileContent).then(x=>x).catch((e)=>{console.log("---error upload attachment batch---");console.log(createdDocument);console.log(encryptedFileContent);}) })
            }) //20
            .then(()=>{
                this._setLoadingMessage({ message:this.localize('mhInvoicing.spinner.step_8_done',this.language), icon:"check-circle", updateLastMessage: true, done:true});
                this._setLoadingMessage({ message:this.localize('mhListing.spinner.step_8',this.language), icon:"arrow-forward"})
                this.api.triggerFileDownload( this.flatRateInvoicingDataObject.finalArchive.batchZipFileBlob, "application/zip", this.flatRateInvoicingDataObject.finalArchive.archiveDownloadFileName )
            }) //21
            .catch((e)=>{
                console.log(e);
                return (
                    ( _.trim(e).indexOf('no-nihii') > -1 ) ? this._showWarningNoHcpNihii() && e :
                        ( _.trim(e).indexOf('missing-flatrate-tarification') > -1 ) ? this._showWarningNoHcpFlatrateTarification() && e :
                            ( _.trim(e).indexOf('no-data-to-export') > -1 ) ? this._showWarningNoDataToExport() && e :
                                ( _.trim(e).indexOf('missing-contact-person') > -1 ) ? this._showWarningNoHcpContactPerson() && e :
                                    ( _.trim(e).indexOf('missing-cbe') > -1 ) ? this._showWarningNoCbe() && e :
                                        ( _.trim(e).indexOf('missing-bank-account') > -1 ) ? this._showWarningNoBankAccount() && e :
                                            ( _.trim(e).indexOf('export-already-ran') > -1 ) ? this._showWarningExportAlreadyRan() && e :
                                                e
                )
            }) //22
            .finally(()=>{
                console.log(this.flatRateInvoicingDataObject);
                this.flatRateInvoicingDataObject = {}
                this.set('_isLoading', false );
                this.set('activeGridItem', null );
                this.set('messagesCachedData', null );
                this.set('messagesGridData', [] );
                this.set('messagesGridDataReset', [] );
                const messagesGrid = this.root.querySelector('#messagesGrid'); messagesGrid && messagesGrid.clearCache();
                const messagesGrid2 = this.root.querySelector('#messagesGrid2'); messagesGrid2 && messagesGrid2.clearCache();
                const messagesGrid3 = this.root.querySelector('#messagesGrid3'); messagesGrid3 && messagesGrid3.clearCache();
                const invGridDetail = this.root.querySelector('#invoiceAndBatchesGridDetail'); invGridDetail && invGridDetail.clearCache();
                this.api.setPreventLogging(false);
                this._fetchJ20Messages(true).then(()=>{ this.dispatchEvent(new CustomEvent('do-route', { bubbles: true, composed: true, detail: { selection : { item : "e_flatrateinvOut", status: "j20_process" }}})); })
            }) //23

    }

}

customElements.define(HtMsgFlatrateInvoice.is, HtMsgFlatrateInvoice);
