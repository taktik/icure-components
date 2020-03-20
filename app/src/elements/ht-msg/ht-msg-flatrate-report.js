import '../dynamic-form/ckmeans-grouping.js';
import '../../styles/vaadin-icure-theme.js';
import '../../styles/spinner-style.js';
import '../ht-spinner/ht-spinner.js';
import '../../styles/dialog-style.js';
import '../../styles/buttons-style.js';
import '../../styles/shared-styles.js';
import '../../styles/scrollbar-style.js';
import '../../styles/paper-tabs-style.js';
import '../ht-pat/dialogs/ht-pat-invoicing-dialog.js';
import '../ht-pat/dialogs/medicalhouse/ht-pat-flatrate-utils.js';

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import * as models from 'icc-api/dist/icc-api/model/models'
import XLSX from 'xlsx'
import 'xlsx/dist/shim.min'

import promiseLimit from 'promise-limit';

import "@polymer/iron-icon/iron-icon"
import "@polymer/iron-pages/iron-pages"
import "@polymer/paper-icon-button/paper-icon-button"
import "@polymer/paper-input/paper-input"
import "@polymer/paper-tabs/paper-tabs"
import "@polymer/paper-tooltip/paper-tooltip"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"
import "@vaadin/vaadin-grid/vaadin-grid-sorter"

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtMsgFlatrateReport extends TkLocalizerMixin(PolymerElement) {

  static get template() {
    return html`
        <custom-style>
            <style include="iron-flex iron-flex-alignment"></style>
            <style include="shared-styles vaadin-icure-theme spinner-style dialog-style buttons-style scrollbar-style paper-tabs-style">

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
                    height: calc(100% - 48px);
                    width: 100%;
                    padding: 0 0px;
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

                .admin-top-bar {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: stretch;
                    background: var(--app-background-color-dark);
                }

                .admin-top-bar .buttons{
                    border-left: 1px solid var(--app-background-color-darker);
                    border-bottom: 1px solid var(--app-background-color-darker);
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-around;
                    align-items: center;
                    width: auto;
                    padding: 0 4px;
                    position: inherit;
                    box-sizing:border-box;
                }

                .admin-top-bar .buttons paper-icon-button{
                    margin:0 8px;
                }

                .administrative-panel {
                    height: calc(100% - 48px);
                    background: var(--app-background-color);
                    margin: 0;
                }

                .iron-container {
                    padding: 0;
                }

                .searchbox{
                    display: none;
                }

                .tabIcon{
                    max-height: 20px;
                    width: 20px;
                    margin-right: 8px;
                }
            </style>
        </custom-style>

        <div id="mypanel" class="invoice-panel">
<!--            <template is="dom-if" if="[[_isLoading]]">-->
<!--                <div id="loadingContainer">-->
<!--                    <div id="loadingContentContainer">-->
<!--                        <div style="max-width:80px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active></ht-spinner></div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </template>-->
            <template is="dom-if" if="[[_isLoading]]">
                <div id="loadingContainerSmall">
                    <div id="loadingContentContainerSmall">
                        <ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner>
                        <template is="dom-if" if="[[_loadingDetail]]">
                            <p>[[_loadingDetailText]]</p>
                        </template>
                        <!--                        <p><iron-icon icon="arrow-forward" class="loadingIcon"></iron-icon> [[localize("pleaseWait", language)]]</p>-->
                    </div>
                </div>
            </template>

            <template is="dom-if" if="[[_isEqual(flatrateMenuSection, 'rpt')]]">
                <div class="admin-top-bar">
                    <paper-tabs selected="{{tabs}}">
                        <paper-tab class="adm-tab" on-tap="mainPage"><iron-icon class="smaller tabIcon" icon="vaadin:clipboard-text"></iron-icon>[[localize('fr_pat_error','Patients with missing data',language)]]</paper-tab>
                        <paper-tab class="adm-tab" on-tap="genderPage"><iron-icon class="smaller tabIcon" icon="vaadin:family"></iron-icon>[[localize('fr_par_err_gender','niss/gender mismatch',language)]]</paper-tab>
                        <paper-tab class="adm-tab" on-tap="deceasedPage"><iron-icon class="smaller tabIcon" icon="vaadin:family"></iron-icon>[[localize('fr_par_err_deceased','Deceased',language)]]</paper-tab>
                        <paper-tab class="adm-tab" on-tap="contractPage"><iron-icon class="smaller tabIcon" icon="vaadin:family"></iron-icon>[[localize('fr_par_err_mhc','MH Contract',language)]]</paper-tab>
                        <paper-tab class="adm-tab" on-tap="insurabilityPage"><iron-icon class="smaller tabIcon" icon="vaadin:family"></iron-icon>[[localize('fr_par_err_ins','Insurability',language)]]</paper-tab>
                        <paper-tab class="adm-tab" on-tap="geninsPage"><iron-icon class="smaller tabIcon" icon="vaadin:umbrella"></iron-icon>[[localize('fr_par_err_ins_mcn','Insurability by MyCareNet',language)]]</paper-tab>
                        <paper-tab class="adm-tab" on-tap="datesPage"><iron-icon class="smaller tabIcon" icon="vaadin:umbrella"></iron-icon>[[localize('fr_pat_dates','Dates',language)]]</paper-tab>
                    </paper-tabs>
                    <div class="buttons">
                        <paper-icon-button class="button--icon-btn" id="refreshFRCheck" on-tap="_runFlatRateCheck" icon="vaadin:refresh"></paper-icon-button>
                        <paper-tooltip for="refreshFRCheck" position="left">[[localize('flatrate-gen-report','Generate report',language)]]</paper-tooltip>
                        <paper-icon-button class="button--icon-btn" id="exportXLSX" on-tap="_exportXLSX" icon="icons:cloud-download"></paper-icon-button>
                        <paper-tooltip for="exportXLSX" position="left">[[localize('export-excel','Export to xlsx',language)]]</paper-tooltip>
                    </div>
                </div>
                <div class="searchbox">
                    [[localize('search','Search')]]<paper-input value="{{searchText}}"></paper-input>
                </div>
                <iron-pages class="iron-container" selected="[[tabs]]">
                    <page><!--Data error-->
                        <div class="page-container">
                            <div class="invoicesGridContainer">
                                <div class="invoiceContainer">
                                    <div class="invoiceSubContainerMiddle">
                                        <div class="scrollBox">
                                            <vaadin-grid id="main" items="[[flatRateCheckListView]]" active-item="{{activeGridItem}}">
                                                <vaadin-grid-column flex-grow="0" width="20%" class="oa-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.lastName">[[localize('pat','Patient',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.lastName]] [[item.pat.firstName]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="ref-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.ssin">[[localize('niss','Niss',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.ssin]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="15%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateStatus.status">[[localize('status','Status',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[localize(item.flatrateStatus.status, item.flatrateStatus.status)]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="45%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('error','Error',language)]]
                                                    </template>
                                                    <template>[[_join(item.flatrateStatus.errors)]]</template>
                                                </vaadin-grid-column>
<!--                                                data-id\$="[[access.patient.id]]-->
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('open_pat','Open',language)]]
                                                    </template>
                                                    <template><paper-icon-button class="button--icon-btn" id="openPatient" data-id\$="[[item.pat.id]]" on-tap="openPatient" icon="vaadin:edit">Open</paper-icon-button></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </page>
                    <page><!--Gender mismatch-->
                        <div class="page-container">
                            <div class="invoicesGridContainer">
                                <div class="invoiceContainer">
                                    <div class="invoiceSubContainerMiddle">
                                        <div class="scrollBox">
                                            <vaadin-grid id="gender" items="[[flatRateCheckListView]]" active-item="{{activeGridItem}}">
                                                <vaadin-grid-column flex-grow="0" width="20%" class="oa-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.lastName">[[localize('pat','Patient',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.lastName]] [[item.pat.firstName]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="ref-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.ssin">[[localize('niss','Niss',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.ssin]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="15%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateStatus.status">[[localize('status','Status',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[localize(item.flatrateStatus.status, item.flatrateStatus.status)]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="45%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('error','Error',language)]]
                                                    </template>
                                                    <template>[[_join(item.flatrateStatus.errors)]]</template>
                                                </vaadin-grid-column>
                                                <!--                                                data-id\$="[[access.patient.id]]-->
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('open_pat','Open',language)]]
                                                    </template>
                                                    <template><paper-icon-button class="button--icon-btn" id="openPatient" data-id\$="[[item.pat.id]]" on-tap="openPatient" icon="vaadin:edit">Open</paper-icon-button></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </page>
                    <page><!--Deceased-->
                        <div class="page-container">
                            <div class="invoicesGridContainer">
                                <div class="invoiceContainer">
                                    <div class="invoiceSubContainerMiddle">
                                        <div class="scrollBox">
                                            <vaadin-grid id="deceased" items="[[flatRateCheckListView]]" active-item="{{activeGridItem}}">
                                                <vaadin-grid-column flex-grow="0" width="20%" class="oa-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.lastName">[[localize('pat','Patient',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.lastName]] [[item.pat.firstName]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="ref-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.ssin">[[localize('niss','Niss',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.ssin]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="15%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateStatus.status">[[localize('status','Status',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[localize(item.flatrateStatus.status, item.flatrateStatus.status)]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="45%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('error','Error',language)]]
                                                    </template>
                                                    <template>[[_join(item.flatrateStatus.errors)]]</template>
                                                </vaadin-grid-column>
                                                <!--                                                data-id\$="[[access.patient.id]]-->
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('open_pat','Open',language)]]
                                                    </template>
                                                    <template><paper-icon-button class="button--icon-btn" id="openPatient" data-id\$="[[item.pat.id]]" on-tap="openPatient" icon="vaadin:edit">Open</paper-icon-button></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </page>
                    <page><!--contract-->
                        <div class="page-container">
                            <div class="invoicesGridContainer">
                                <div class="invoiceContainer">
                                    <div class="invoiceSubContainerMiddle">
                                        <div class="scrollBox">
                                            <vaadin-grid id="contract" items="[[flatRateCheckListView]]" active-item="{{activeGridItem}}">
                                                <vaadin-grid-column flex-grow="0" width="20%" class="oa-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.lastName">[[localize('pat','Patient',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.lastName]] [[item.pat.firstName]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="ref-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.ssin">[[localize('niss','Niss',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.ssin]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="15%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateStatus.status">[[localize('status','Status',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[localize(item.flatrateStatus.status, item.flatrateStatus.status)]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="45%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('error','Error',language)]]
                                                    </template>
                                                    <template>[[_join(item.flatrateStatus.errors)]]</template>
                                                </vaadin-grid-column>
                                                <!--                                                data-id\$="[[access.patient.id]]-->
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('open_pat','Open',language)]]
                                                    </template>
                                                    <template><paper-icon-button class="button--icon-btn" id="openPatient" data-id\$="[[item.pat.id]]" on-tap="openPatient" icon="vaadin:edit">Open</paper-icon-button></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </page>
                    <page><!--ins-->
                        <div class="page-container">
                            <div class="invoicesGridContainer">
                                <div class="invoiceContainer">
                                    <div class="invoiceSubContainerMiddle">
                                        <div class="scrollBox">
                                            <vaadin-grid id="insurability" items="[[flatRateCheckListView]]" active-item="{{activeGridItem}}">
                                                <vaadin-grid-column flex-grow="0" width="20%" class="oa-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.lastName">[[localize('pat','Patient',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.lastName]] [[item.pat.firstName]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="ref-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.ssin">[[localize('niss','Niss',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.ssin]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="15%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateStatus.status">[[localize('status','Status',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[localize(item.flatrateStatus.status, item.flatrateStatus.status)]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="45%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('error','Error',language)]]
                                                    </template>
                                                    <template>[[_join(item.flatrateStatus.errors)]]</template>
                                                </vaadin-grid-column>
                                                <!--                                                data-id\$="[[access.patient.id]]-->
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('open_pat','Open',language)]]
                                                    </template>
                                                    <template><paper-icon-button class="button--icon-btn" id="openPatient" data-id\$="[[item.pat.id]]" on-tap="openPatient" icon="vaadin:edit">Open</paper-icon-button></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </page>
                    <page><!--genins-mcn-->
<!--                        <paper-icon-button class="button&#45;&#45;icon-btn" id="refreshFRCheck" on-tap="_checkAssurabilityInformation" icon="vaadin:refresh"></paper-icon-button>-->
                        <div class="invoicesGridContainer">
                            <div class="invoiceContainer">
                                <div class="invoiceSubContainerMiddle">
                                    <div class="scrollBox">
                                        <vaadin-grid id="mcn" items="[[geninsResList]]" active-item="{{activeGridItem}}">
                                            <vaadin-grid-column flex-grow="0" width="20%" class="oa-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="pat.lastName">[[localize('pat','Patient',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.pat.lastName]] [[item.pat.firstName]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="10%" class="ref-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="pat.ssin">[[localize('niss','Niss',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[item.pat.ssin]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="15%" class="invoice-col">
                                                <template class="header">
                                                    <vaadin-grid-sorter path="flatrateStatus.status">[[localize('status','Status',language)]]</vaadin-grid-sorter>
                                                </template>
                                                <template>[[localize(item.flatrateStatus.status, item.flatrateStatus.status)]]</template>
                                            </vaadin-grid-column>
                                            <vaadin-grid-column flex-grow="0" width="45%" class="invoice-col">
                                                <template class="header">
                                                    [[localize('error','Error',language)]]
                                                </template>
                                                <template>[[_join(item.geninsErrors)]]</template>
                                            </vaadin-grid-column>
                                            <!--                                                data-id\$="[[access.patient.id]]-->
                                            <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                <template class="header">
                                                    [[localize('open_pat','Open',language)]]
                                                </template>
                                                <template><paper-icon-button class="button--icon-btn" id="openPatient" data-id\$="[[item.pat.id]]" on-tap="openPatient" icon="vaadin:edit">Open</paper-icon-button></template>
                                            </vaadin-grid-column>
                                        </vaadin-grid>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </page>
                    <page><!--dates-->
                        <div class="page-container">
                            <div class="invoicesGridContainer">
                                <div class="invoiceContainer">
                                    <div class="invoiceSubContainerMiddle">
                                        <div class="scrollBox">
                                            <vaadin-grid id="info" items="[[flatRateCheckListView]]" active-item="{{activeGridItem}}">
                                                <vaadin-grid-column flex-grow="0" width="15%" class="oa-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.lastName">[[localize('pat','Patient',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.lastName]] [[item.pat.firstName]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="ref-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="pat.ssin">[[localize('niss','Niss',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.pat.ssin]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateInfo.ABON">[[localize('ABON','ABON',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.flatrateInfo.ABON]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateInfo.MUT">[[localize('MUT','MUT',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.flatrateInfo.MUT]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateInfo.CT12">[[localize('tc1','CT1',language)]]/[[localize('tc2','CT2',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.flatrateInfo.CT12]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="flatrateInfo.DINS">[[localize('sub_start_date','DINS',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.flatrateInfo.DINS]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="item.flatrateInfo.DFAC">[[localize('cov_start_date','DFAC',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.flatrateInfo.DFAC]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="item.flatrateInfo.DDES">[[localize('sub_end_date','DDES',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.flatrateInfo.DDES]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        <vaadin-grid-sorter path="item.flatrateInfo.DFIN">[[localize('cov_end_date','DFIN',language)]]</vaadin-grid-sorter>
                                                    </template>
                                                    <template>[[item.flatrateInfo.DFIN]]</template>
                                                </vaadin-grid-column>
                                                <vaadin-grid-column flex-grow="0" width="10%" class="invoice-col">
                                                    <template class="header">
                                                        [[localize('open_pat','Open',language)]]
                                                    </template>
                                                    <template><paper-icon-button class="button--icon-btn" id="openPatient" data-id$="[[item.pat.id]]" on-tap="openPatient" icon="vaadin:edit">Open</paper-icon-button></template>
                                                </vaadin-grid-column>
                                            </vaadin-grid>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </page>
                </iron-pages>

            </template>


            <ht-pat-flatrate-utils id="flatrateUtils" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" no-print=""></ht-pat-flatrate-utils>

        </div>
`;
  }

  static get is() {
      return 'ht-msg-flatrate-report';
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
          i18n: {
              type: Object,
              value: function () {
                  moment.locale('fr');
                  const res = {
                      monthNames: moment.months(),
                      weekdays: moment.weekdays(),
                      weekdaysShort: moment.weekdaysShort(),
                      firstDayOfWeek: moment.localeData().firstDayOfWeek(),
                      week: 'Semaine',
                      calendar: 'Calendrier',
                      clear: 'Clear',
                      today: 'Aujourd\'hui',
                      cancel: 'Annuler',
                      formatDate: function (d) {
                          //return moment(d).format(moment.localeData().longDateFormat('L'))
                          return moment(d).format('DD/MM/YYYY');
                      },
                      parseDate: function (s) {
                          return moment(s, 'DD/MM/YYYY').toDate();
                      },
                      formatTitle: function (monthName, fullYear) {
                          return monthName + ' ' + fullYear;
                      }
                  };
                  return res;
              }
          },
          flatrateMenuSection: {
              type: String,
              value: null
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
          _loadingDetail:{
              type: Boolean,
              value: false
          },
          _loadingDetailText:{
              type: String,
              value: ""
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
          cachedDataTTL: {
              type: Number,
              value: 300000
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
          flatRateResList: {
              type: Array,
              value: () => []
          },
          geninsResList: {
              type: Array,
              value: () => []
          },
          tabs: {
              type: Number,
              value: 0
          },
          selectedList: {
              type: String,
              value: ""
          },
          searchText: {
              type: String,
              value: ""
          },
          geninsChecked:{
              type: Boolean,
              value: false
          }
      };
  }

  constructor() {
      super();
  }

  static get observers() {
      return [
          "_viewSelection(selectedList)",
          "_filterView(searchText)"
      ];
  }

  ready() {
      super.ready();
      this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(response =>{
          this.set("hcp",response);
          this._runFlatRateCheck();
          if(response.contactPersonHcpId){
              this.api.hcparty().getHealthcareParty(response.contactPersonHcpId).then(hcpCt => {
                  this.set("contactPerson", _.trim( _.trim(_.get(hcpCt, "lastName", "")) + " " + _.trim(_.get(hcpCt, "firstName", "")) ));
              })}
      });
  }

  _loadingStatusChanged() {
      if(!this._isLoading) this._resetLoadingMessage();
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

  _toggleRightPanel(){
      this.shadowRoot.getElementById("rightPanel").classList.toggle("opened")
  }

  _startOfPreviousMonth() {
      return moment().subtract(1, 'month').startOf('month').format('DD/MM/YYYY')
  }

  _endOfPreviousMonth() {
      return moment().subtract(1, 'month').endOf('month').format('DD/MM/YYYY')
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

  _setLoadingMessage( messageData ) {
      if( messageData.updateLastMessage ) { this._loadingMessages.pop(); }
      this._loadingMessages.push( messageData );
      let loadingContentTarget = this.shadowRoot.querySelectorAll('#loadingContent')[0];
      if(loadingContentTarget) { loadingContentTarget.innerHTML = ''; _.each(this._loadingMessages, (v)=>{ loadingContentTarget.innerHTML += "<p><iron-icon icon='"+v.icon+"' class='"+(v.done?"loadingIcon done":"loadingIcon")+"'></iron-icon>" + v.message + "</p>"; }); }
  }

  _resetLoadingMessage() {
      this._loadingMessages = [];
  }

  _getPatientsByHcp( hcpId ) {

      return this.api.getRowsUsingPagination(
          (key,docId) =>
              this.api.patient().listPatientsByHcPartyWithUser(this.user, hcpId, null, key && JSON.stringify(key), docId, 1000)
                  .then(pl => {
                      pl.rows = _
                          .chain(pl.rows)
                          .value()
                          .map((i) => {
                              i.ssin = _.trim(_.get(i,"ssin","")).replace(/[^\d]/gmi,"")
                              i.lastName = (_.get(i,"lastName","")).toUpperCase()
                              i.firstName = (_.get(i,"firstName","")).toUpperCase()
                              i.dateOfBirth = (!!_.trim(_.get(i,"dateOfBirth",""))?moment(_.trim(_.get(i,"dateOfBirth",0)), "YYYYMMDD").format('DD/MM/YYYY'):"")
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
          .catch(()=>{this.set('_isLoading', false );});

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
      return exportedDate.substr(3,3);
  }

  getBatchRef(exportedDate, OA){
      return exportedDate.substr(3,3) + OA;
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

  convertDate(sDate){
      //Todo: implement
      //moment(_.get(i, "dateOfBirth"+"", "0")+"", "DD/MM/YYYY")
      //let d = moment(sDate, "DD/MM/YYYY");

      return sDate;
  }

  _renderGridInvoiceNmcl(inputData) {
      return _.sortBy(_.uniq(_.compact(_.map(inputData,i=>i.code))),'code', 'asc').join(", ")
  }

  _archiveBatch(){
      this._updateBatchStatus("archive")
      this.$["archiveDialog"].close()
  }

  _formatSsinNumber(inputData){
      return this.api.formatSsinNumber(inputData)
  }

  _toggleBatchDetails(e) {

      // Make sure we have a "legit" click
      if( _.get(e, "path", false) || e.composedPath ) {
          var paths = _.map( e.path || e.composedPath(), (pathNode,index)=> { return { index:index, nodeName:_.get( pathNode, "nodeName", "" ), target: _.get( pathNode, "id", "" ).toLowerCase()==="messagesgrid2" } })
          if( !parseInt(_.size(_.compact(_.map( paths.slice( 0, _.get( _.filter(paths,"target"), "[0].index", 0 ) ), (path, index) => { return ["vaadin-grid-cell-content", "slot", "td", "tr" ].indexOf( _.trim(path.nodeName).toLowerCase() ) > -1 } )))) ) return;
      }

      if ( _.size(this.activeGridItem) ) {

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

      } else {

          this.set("messageDetailsData", null)
          const invGridDetail = this.root.querySelector('#invoiceAndBatchesGridDetail'); invGridDetail && invGridDetail.clearCache();

          this.shadowRoot.getElementById("messagesGridContainer") && this.shadowRoot.getElementById("messagesGridContainer").classList.remove("half")
          this.shadowRoot.getElementById("invoiceDetailContainer") && this.shadowRoot.getElementById("invoiceDetailContainer").classList.remove("open")

      }

  }

  _runFlatRateCheck(){
      this.set('_isLoading', true);
      return this._flatrateCheckOnAllPatients(Number(moment().format('YYYYMM'))).then(resList =>{
          console.log("resList", resList);
          const errList = resList.filter(res => res.flatrateStatus.status !== 'ok-flatrate-patient' && res.flatrateStatus.status !== 'ok-no-flatrate-patient');
          this.set("flatRateCheckList", errList);
          this.set("flatRateResList", resList);
          this.set('_isLoading', false);
          if(!this.selectedList) this.set('selectedList', 'main');
          this._viewSelection();
          this.set("geninsChecked", false);
          return errList;
      });
  }

  _flatrateCheckOnAllPatients(invoicedMonth) {
      const flatRateUtil = this.$.flatrateUtils;
      //.then( hcp =>
      //hcp.parentId ? this.api.hcparty().getHealthcareParty(hcp.parentId) : hcp)
      let hcpId = this.hcp.parentId ? this.hcp.parentId : this.hcp.id;
      return this._getPatientsByHcp(hcpId).then(myPatients => myPatients.map(pat =>  flatRateUtil.checkFlatrateDataWithHcp(this.hcp, pat, invoicedMonth)));
  }


  //data display methods

  _join(arr){
      return arr.map(itm => this.localize(itm, itm)).join();
  }

  openPatient(ev) {
      this.set("_isLoadingLatestPatients",true)
      this.set("_isLoadingTodaysConsultations",true)
      let target = ev.target;
      while (target && !target.dataset.id) {
          target = target.parentNode;
      }
      if (target.dataset.id != '0') location.replace(location.href.replace(/(.+?)#.*/, `$1#/pat/${target.dataset.id}`));
      this.set("_isLoadingLatestPatients",false)
      this.set("_isLoadingTodaysConsultations",false)
  }

  mainPage(){
      this.set('selectedList', 'main');
  }

  genderPage(){
      this.set('selectedList', 'gender');
  }

  deceasedPage(){
      this.set('selectedList', 'deceased');
  }

  contractPage(){
      this.set('selectedList', 'contract');
  }

  insurabilityPage(){
      this.set('selectedList', 'insurability');
  }

  geninsPage(){
      this.set('selectedList', 'mcn');
  }

  _viewSelection(){
      //TODO: implement data selection based on List
      var resultlist = this.flatRateCheckList;
      console.log("selectedList", this.selectedList);
      switch(this.selectedList){
          case 'main':
              break;
          case 'gender':
              resultlist = this.flatRateCheckList.filter(res => res.nissCheck.valid && res.genderCheck.valid && !res.genderNissCheck.valid);
              break;
          case 'deceased':
              resultlist = this.flatRateCheckList.filter(res => ! res.aliveCheck.valid);
              break;
          case 'contract':
              resultlist = this.flatRateCheckList.filter(res => !res.mhContractStart.valid || !res.mhContractEndBeforeStart.valid
                  || !res.mhContractCheck.valid || !res.mhCheck.valid || !res.mhDisciplineCheck.valid || !res.mhSuspensionCheck.valid);
              break;
          case 'insurability':
              resultlist = this.flatRateCheckList.filter(res => !res.insurabilityCheck.valid
                  || (res.insurabilityCheck.valid && !res.mutCheck.valid)
                  || (res.insurabilityCheck.valid && !res.ct12Check.valid));
              break;
          case 'mcn':
              this._checkAssurabilityInformation();
              break;
      }
      resultlist = this.addSearchField(resultlist);
      this.set('flatRateCheckListViewTmp', resultlist)
      this.set('flatRateCheckListView', resultlist)
  }

  addSearchField(lst){
      lst.forEach(itm => {
          const sf = [
              itm.pat.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
              itm.pat.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
              itm.pat.ssin.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
          ].join();

          itm.searchField = sf;
      });
      //pat lname fname niss
      return lst;
  }

  _filterView(filter){
      if(filter && filter !== "") {
          const srch = filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
          const lst = this.flatRateCheckListViewTmp.filter(itm => itm.searchField.includes(srch));
          this.set('flatRateCheckListView', lst);
      }
  }

  _getPatientForInsurabilityCheck(){
      return this.api.getRowsUsingPagination(
          (key,docId) =>
              this.api.patient().listPatientsByHcPartyWithUser(this.user, this.hcp.parentId ? this.hcp.parentId : this.hcp.id, null, key && JSON.stringify(key), docId, 1000)
                  .then(pl => {
                      pl.rows = _
                          .chain(pl.rows)
                          .filter((i)=>{return(
                              !!i
                              && !!_.get(i,"active", true)
                              && !!_.trim(_.get(i,"dateOfBirth", ""))
                              && !!_.trim(_.get(i,"ssin", ""))
                              && parseInt( _.size( _.get(i, "medicalHouseContracts", [] ) ) )
                              && !!parseInt( _.size( _.filter( _.get(i, "medicalHouseContracts", [] ), (i)=>{return !!i && _.trim(_.get(i,"hcpId", "something")) === _.trim(this.hcp.parentId ? this.hcp.parentId : this.hcp.id)}) ) )
                          )})
                          .uniqBy( 'ssin' )
                          .value()
                          .map((i) => {
                              i.ssin = _.trim(_.get(i,"ssin","")).replace(/[^\d]/gmi,"")
                              i.lastName = (_.get(i,"lastName","")).toUpperCase()
                              i.firstName = (_.get(i,"firstName","")).toUpperCase()
                              i.dateOfBirth = (!!_.trim(_.get(i,"dateOfBirth",""))?moment(_.trim(_.get(i,"dateOfBirth",0)), "YYYYMMDD").format('DD/MM/YYYY'):"")
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

  checkGenins(resList){
      const ehSession = this._checkHasEhSession();
      const mmehSession = this._checkHasMMEhSession();

      const userIsMH = this._checkUserIsMH();
      const useMHSession = mmehSession && !ehSession;

      let limit = promiseLimit(10);
      let count = resList.filter(res => res.nissCheck.valid).length;
      let pos = 0;
      this.set('_loadingDetailText', "" + pos.toString() + "/" + count.toString());
      return Promise.all(resList.filter(res => res.nissCheck.valid).map(res => {
          return limit(() => {
              const dStart = this.getRequestDateFromRes(res);
              //TODO: only check patients where needed: niss-ok, mh-contract-ok
              return this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
                  _.get(res, 'pat.ssin', null),
                  useMHSession ? _.get(this, 'api.tokenIdMH', null) : _.get(this, 'api.tokenId'),
                  useMHSession ? _.get(this, 'api.keystoreIdMH', null) : _.get(this, 'api.keystoreId'),
                  useMHSession ? _.get(this, 'api.credentials.ehpasswordMH', null) : _.get(this, 'api.credentials.ehpassword'),
                  useMHSession ? _.get(this, 'api.nihiiMH', null) : _.get(this, 'hcp.nihii'),
                  userIsMH ? _.get(this, 'api.MHContactPersonSsin') : _.get(this, 'hcp.ssin'),
                  userIsMH ? _.get(this, 'api.MHContactPersonName') : _.get(this, 'hcp.lastName')+' '+_.get(this, 'hcp.firstName'),
                  useMHSession ? 'medicalhouse' : 'doctor',
                  dStart,
                  useMHSession ?  dStart : null,
                  null,
                  false
              ).then(gi => {
                  pos++;
                  this.set('_loadingDetailText', "" + pos.toString() + "/" + count.toString());
                  res.genIns = gi;
                  res.genInsChecks = [];
                  const genInsOk = !gi.faultCode && gi.insurabilities && gi.insurabilities.length && gi.insurabilities[0].ct1 && !(gi.generalSituation && gi.generalSituation.length);
                  res.genInsOk = genInsOk;
                  if(gi.deceased){
                      res.deceased = gi.deceased;
                      let c = {check: "deceased", deceasedGenins: gi.deceased};
                      if(res.pat.dateOfDeath){
                          if(res.pat.dateOfDeath === gi.deceased){
                              c.valid = true;
                          }else{
                              c.valid = false;
                              c.message = "genins.incorrect.date.of.death";
                          }
                      } else {
                          c.valid = false;
                          c.message = "genins.missing.date.of.death";
                      }
                      res.genInsChecks.push(c);
                  }
                  if(genInsOk){
                      const ins = gi.insurabilities[0];
                      const month = (res.invoicedMonth * 100) + 1;
                      return this.api.insurance().listInsurancesByCode(ins.mutuality).then(out => {
                          if(out && out.length){
                              const insuFound = res.pat.insurabilities.filter(l => out.some(insu => l.insuranceId===insu.id) && (!l.endDate || l.endDate===""))
                              if(insuFound && insuFound.length){
                                  // let c = {check: "geninsOk", valid: true, message:"genins.mut.match"};
                                  // res.genInsChecks.push(c);
                                  if(insuFound[0].parameters){
                                      const tc1 = insuFound[0].parameters.tc1;
                                      const tc2 = insuFound[0].parameters.tc2;
                                      if(tc1 && tc2 && tc1 === ins.ct1 && tc2 === ins.ct2){
                                          let c = {check: "geninsOk", valid: true, message:"genins.ins.match"};
                                          res.genInsChecks.push(c);
                                      } else {
                                          let c = {check: "geninsOk", valid: false, message:"genins.ins.not.match"};
                                          res.genInsChecks.push(c);
                                      }
                                  }else{
                                      let c = {check: "geninsOk", valid: false, message:"genins.ins.not.valid"};
                                      res.genInsChecks.push(c);
                                  }

                              }else{
                                  let c = {check: "geninsOk", valid: false, message:"genins.mut.not.match"};
                                  res.genInsChecks.push(c)
                              }
                              return res;
                          } else {
                              let c = {check: "geninsOk", valid: false, message:"genins.mut.not.found"};
                              res.genInsChecks.push(c);
                              return res;
                          }
                      })
                  }else{
                      if (gi.errors && gi.errors.length && gi.errors.length > 0) {
                          let c = {check: "geninsOk", valid: false, message:"genins.svc.error", detail:gi.errors.join()};
                          res.genInsChecks.push(c);
                      }else {
                          let c = {check: "geninsOk", valid: false, message:"genins.not.ok"};
                          res.genInsChecks.push(c);
                      }
                      return res;
                  }
                  // const ins = gi.insurabilities[0];
                  // const month = (res.invoicedMonth * 100) + 1;
                  // //find matching topaz ins
                  // //find mutid from genins result
                  // this.api.insurance().listInsurancesByCode(ins.mutuality).then(out => {
                  //     if(out && out.length){
                  //
                  //     }
                  // })
                  //Check if genins alive
                  //
                  //TODO: check if gi differs from assu in res

              })//--
          })

      }))
  }

  getRequestDateFromRes(res){
      const date = new Date(), y = Number(res.invoicedMonth.toString().substr(0,4)), m = Number(res.invoicedMonth.toString().substr(4,2));
      return new Date(y,m - 1,1).getTime();
  }

  _checkAssurabilityInformation(){
      if(this._checkEhealthSession()){
          if(!this.geninsChecked){
              this.set('_isLoading', true);
              this.set('_loadingDetail', true);
              this.set('_loadingDetailText', "...");
              this.checkGenins(this.flatRateResList).then(resList => {
                  resList.forEach(res => {
                      res.geninsErrors = this.getGeninsErrors(res);
                  })
                  console.log("check result", resList);
                  this.set("geninsResList", resList.filter(res => res.geninsErrors && res.geninsErrors.length && res.geninsErrors.length > 0));
                  this.set('_isLoading', false);
                  this.set('_loadingDetail', true);
                  this.set('_loadingDetailText', "");
                  this.set("geninsChecked", true);
              })
          }
      }
  }

  getGeninsErrors(res){
      return res.genInsChecks.filter(c => !c.valid).map(c => c.message);
  }

  _checkUserIsMH(){
      return false;
  }

  _checkEhealthSession(){
      return !!(_.get(this, 'api.tokenId', null) || _.get(this, 'api.tokenIdMH', null))
  }

  _checkHasEhSession(){
      return !!_.get(this, 'api.tokenId', null)
  }

  _checkHasMMEhSession(){
      return !!_.get(this, 'api.tokenIdMH', null)
  }
}

customElements.define(HtMsgFlatrateReport.is, HtMsgFlatrateReport);
