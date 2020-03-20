import '../../../dynamic-form/dynamic-link.js'
import '../../../dynamic-form/dynamic-pills.js'
import '../../../ht-spinner/ht-spinner.js'
import '../../../../styles/dialog-style.js'
import '../../../../styles/buttons-style.js'
import * as models from 'icc-api/dist/icc-api/model/models'
import moment from 'moment/src/moment'
import _ from 'lodash/lodash'


import {TkLocalizerMixin} from "../../../tk-localizer"
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class"
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior"
import {PolymerElement, html} from '@polymer/polymer'

class HtPatMedicalhouseTimeline extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
    static get template() {
        return html`
                 <style include="dialog-style atc-styles scrollbar-style buttons-style">
             paper-dialog {
                 width: 90%;
                 height: 80%;
             }
 
             paper-tabs {
                 width: 50%;
                 max-width: 400px;
                 --paper-tabs-selection-bar-color: var(--app-secondary-color);
                 /* margin: 0 auto; */
             }
 
             paper-tab {
                 --paper-tab-ink: var(--app-secondary-color);
             }
 
             .present, .patient {
                 height: 100%;
                 overflow-y: auto;
                 margin-top: 0;
                 box-sizing: border-box;
             }
 
             .table-container {
                 margin-bottom: 24px;
             }
 
             .header {
                 background: linear-gradient(to right, var(--app-secondary-color), var(--app-secondary-color-dark));
                 color: var(--app-text-color);
                 display: flex;
                 flex-flow: row wrap;
                 justify-content: flex-start;
                 align-items: center;
                 height: 40px;
                 width: 100%;
                 padding: 0 12px;
                 box-sizing: border-box;
             }
 
             .header h3 {
                 font-size: 14;
                 font-weight: 400;
                 margin: 0;
             }
 
             .header iron-icon {
                 height: 20px;
                 width: 20px;
                 margin-right: 4px;
             }
 
             .table-header {
                 width: 100%;
                 display: flex;
                 flex-flow: row nowrap;
                 justify-content: space-between;
                 align-items: center;
                 border-bottom: 1px solid var(--app-background-color-dark);
                 font-size: 11px;
                 color: var(--app-text-color-disabled);
                 height: 28px;
             }
 
             .col {
                 height: 100%;
                 padding: 0 4px;
                 box-sizing: border-box;
                 display: flex;
                 flex-flow: row wrap;
                 justify-content: center;
                 align-items: center;
             }
 
             .col--med {
                 width: 30%;
                 justify-content: flex-start;
             }
 
             .med--name {
                 font-weight: 500;
                 margin-right: 4px;
             }
 
             .col--photo {
                 max-width: 56px;
                 min-width: 56px;
                 text-align: center;
                 flex-grow: 1;
             }
 
             .col--bef, .col--dur, .col--aft {
                 max-width: 56px;
                 min-width: 56px;
                 text-align: center;
                 flex-grow: 1;
             }
 
             .col--noMoment{
                 max-width: 168px;
                 min-width: 168px;
                 text-align: center;
                 flex-grow: 1;
             }
 
             .dur-pill {
                 background: var(--app-secondary-color);
                 color: var(--app-text-color);
                 font-weight: 500;
                 border-radius: 50%;
                 padding: 4px;
                 display: block;
                 height: 12px;
                 width: 12px;
                 line-height: 1.1;
                 text-align: center;
             }
 
             .col--ed, .col--freq {
                 text-align: center;
                 width: 12%;
             }
 
             .col--com {
                 width: 40%;
                 justify-content: flex-start;
             }
 
             .table-row {
                 width: 100%;
                 display: flex;
                 flex-flow: row nowrap;
                 justify-content: space-between;
                 align-items: center;
                 font-size: 12px;
                 color: var(--app-text-color);
                 height: 40px;
             }
 
             .table-row:nth-child(even) {
                 background: var(--app-background-color-light);
             }
 
             .table-row .col:not(:last-child) {
                 border-right: 1px solid var(--app-background-color-dark);
             }
 
             .general-infos {
                 display: flex;
                 flex-flow: row wrap;
                 justify-content: flex-start;
                 align-items: center;
                 margin-bottom: 24px;
                 background: var(--app-background-color-dark);
                 padding: 12px;
                 border-radius: 4px;
             }
 
             .infos-block {
                 font-size: 14px;
                 font-weight: 400;
                 color: var(--app-text-color);
                 margin-right: 24px;
             }
 
             .infos-block > div:first-child{
                 margin-bottom: 8px;
             }
 
             .infos-block span {
                 background: var(--app-background-color-light);
                 border-radius: 12px;
                 font-weight: 500;
                 padding: 1px 8px;
                 margin-right: 8px;
             }
 
             /* PRESENT */
 
             .table {
                 display: flex;
                 flex-flow: column nowrap;
                 font-size: .8rem;
                 line-height: 1.5;
                 flex: 1 1 auto;
                 min-width: 900px;
             }
 
             .table div{
                 box-sizing: border-box;
             }
 
             .th {
                 display: none;
                 font-weight: 700;
                 background-color: var(--app-background-color- );
             }
 
             .th:first-child {
                 border-top: 1px solid var(--app-background-color-dark);
             }
 
 
             .th > .td {
                 white-space: nowrap;
                 text-overflow: ellipsis;
                 justify-content: center;
             }
 
             .th .td {
                 color: var(--app-text-color);
             }
 
             .th .td:first-child, .tr.category .td:first-child{
                 width: 24px;
                 /*max-width: 24px;*/
                 box-sizing: border-box;
                 border-right: none;
             }
 
             .tr {
                 position: relative;
                 width: 100%;
                 display: flex;
                 flex-flow: row nowrap;
                 color: var(--app-text-color);
                 z-index: 1;
                 height: 24px;
             }
 
             .tr:not(.th):not(.category)::after {
                 display: block;
                 content: '';
                 position: absolute;
                 top: 0;
                 left: 0;
                 height: 100%;
                 width: 100%;
                 z-index: 0;
             }
 
             .tr:not(.td):nth-child(odd)::after {
                 opacity: 0.6;
                 transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
             }
 
             .tr:not(.td):nth-child(even)::after {
                 opacity: 0.8;
                 transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
             }
 
             .tr:not(.td):hover::after {
                 opacity: 1;
             }
 
             .tr.old {
                 color: var(--app-text-color-disabled)!important;
             }
             .tr.old::after {
                 background: var(--app-background-color-light)!important;
             }
 
             .tr:not(.category) {
                 color: black;
             }
 
             .odd {
                 background-color: var(--app-background-color);
             }
 
             .td {
                 position: relative;
                 display: flex;
                 flex-flow: row nowrap;
                 align-items: center;
                 justify-content: center;
                 flex-grow: 1;
                 flex-basis: 0;
                 padding: 6px;
                 overflow: hidden;
                 min-width: 0px;
                 z-index: 2;
                 word-break: break-word;
                 white-space: nowrap;
                 border-right: 1px solid var(--app-background-color-dark);
                 font-size: 13px;
             }
 
             .td span{
                 text-overflow: ellipsis;
                 width: 100%;
                 overflow: hidden;
                 text-align: center;
             }
 
             .td span.left{
                 text-align: left;
             }
 
             .td-input{
                 position: relative
             }
 
             .td iron-input > input{
                 position: absolute;
                 top: 0;
                 left: 0;
                 right: 0;
                 bottom: 0;
                 text-align: center;
                 width: 100%;
                 color: #fff;
                 background-color: transparent;
                 border: none;
                 height: 100%;
                 outline: 0;
                 transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
             }
 
             .td iron-input > input:focus{
                 animation: .24s ease-in forwards inputShadows;
             }
 
             .td iron-input > input:hover{
                 background-color: rgba(0, 0, 0, .2);
                 box-shadow: var(--app-shadow-elevation-1);
             }
 
             @keyframes inputShadows{
                 from{ box-shadow: inset 0 0 0 rgba(0, 0, 0, .2); }
                 to{ box-shadow: inset 0 0 50px rgba(0, 0, 0, .2); }
             }
 
             .td:first-child {
                 border-left: 1px solid var(--app-background-color-dark);
             }
 
             .td--comments, .td--medicine, .td--category {
                 justify-content: flex-start;
             }
 
             .td--category iron-icon {
                 height: 14px;
                 width: 14px;
                 margin-right: 4px;
             }
 
             .th {
                 border-top: 2px solid var(--app-background-color-dark);
             }
 
             .th .td, .tr:last-of-type .td {
                 border-bottom: 1px solid var(--app-background-color-dark);
             }
 
             .myRow {
                 background-color: var(--app-light-color);
             }
 
             .span-2 {
                 padding: 6px 13px; /* 13px because we had the padding of the missings .td padding + their borders */
             }
 
             .span-3 {
                 padding: 6px 19px; /* 19px because we had the padding of the missings .td padding + their borders */
             }
 
             .span-4 {
                 padding: 6px 26px; /* 26px because we had the padding of the missings .td padding + their borders */
             }
 
             .span-5 {
                 padding: 6px 31px; /* 31px because we had the padding of the missings .td padding + their borders */
             }
 
             .table .category {
                 border-bottom: 1px solid #d0d0d0;
             }
 
             .reimbursed{
                 width: 24px;
                 max-width: 24px;
                 box-sizing: border-box;
                 padding: 0;
                 border-right: none!important;
             }
 
             .reimbursed .reimbursed-status {
                 height: 14px;
                 width: 14px;
                 padding: 2px;
                 border-radius: 50%;
                 box-shadow: 0 0 0 rgba(0, 0, 0, .2);
                 transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
                 z-index: 3;
             }
 
             .add-period-btn {
                 height: 16px;
                 width: 16px;
                 padding: 0;
                 color: var(--app-text-color);
                 transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
             }
 
             .add-period-btn:hover {
                 height: 18px;
                 width: 18px;
                 color: var(--app-secondary-color);
             }
 
             /* HISTORY */
 
             .history{
                 margin-top: 24px;
             }
 
             .timeline-header{
                 display: flex;
                 flex-flow: row nowrap;
                 justify-content: space-between;
                 background: var(--app-background-color-light);
                 border: 1px solid var(--app-background-color-dark);
             }
 
             .timeline div {
                 box-sizing: border-box;
             }
 
             .years-container{
                 max-width: calc(24px * 36 + 2px);
                 width: calc(24px * 36 + 2px); /* 3 years + borders */
                 overflow-x: auto;
                 overflow-y: hidden;
                 flex-grow: 1;
                 display: flex;
                 flex-flow: row nowrap;
                 justify-content: flex-start;
                 align-items: center;
                 border-left: 1px solid var(--app-background-color-dark);
                 border-right: 1px solid var(--app-background-color-dark);
                 position: relative;
             }
 
             .year-block{
                 height: 48px;
                 min-width: calc(24px * 12 + 3px); /* 3 borders */
                 text-align: center;
                 display:flex;
                 flex-flow: row wrap;
                 justify-content: space-between;
                 align-items: center;
             }
 
             .year-block:not(:last-child){
                 border-right: 1px solid var(--app-background-color-dark);
             }
 
             .year-block.current{
                 font-weight: 500;
             }
 
             .year{
                 width: 100%;
                 height: 50%;
                 border-bottom: 1px solid var(--app-background-color-dark);
             }
 
             .quarter{
                 height: 50%;
                 width: calc(24px * 3);
             }
 
             .quarter:not(:last-child){
                 border-right: 1px solid var(--app-background-color-dark);
             }
 
             .futur-block{
                 min-width: calc(24px * 4);
                 width: calc(24px * 4);
                 display: flex;
                 flex-flow: row wrap;
                 align-items: center;
                 justify-content: center;
             }
 
             .btn-left, .btn-right{
                 display: flex;
                 flex-flow: row wrap;
                 align-items: center;
                 height: 48px;
                 width: 10%;
                 flex-grow: 1;
             }
 
             .btn-left{
                 justify-content: flex-end;
             }
 
             .btn-right{
                 justify-content: flex-start;
             }
 
             .medication-category{
                 display:flex;
                 flex-flow: row nowrap;
                 align-items: center;
                 justify-content: space-between;
                 color: var(--app-text-color);
                 font-size: 10px;
                 border-bottom: 1px solid var(--app-background-color-dark);
             }
 
             .medication-category span:first-child{
                 width: 10%;
                 flex-grow: 1;
                 padding-left: 8px;
                 display:block;
                 height: 100%;
                 box-sizing: border-box;
             }
 
             .medication-category span:nth-child(2){
                 max-width: calc(24px * 36 + 2px);
                 width: calc(24px * 36 + 2px);
                 display:block;
                 height: 20px;
                 box-sizing: border-box;
                 border-left: 1px solid var(--app-background-color-dark);
                 border-right: 1px solid var(--app-background-color-dark);
             }
 
             .medication-category span:last-child{
                 width: 10%;
                 flex-grow: 1;
                 display:block;
                 height: 100%;
                 box-sizing: border-box;
             }
 
             .medication-line{
                 display: flex;
                 flex-flow: row nowrap;
                 justify-content: space-between;
                 width: 100%;
                 align-items: center;
                 height: 24px;
             }
 
             .medication-line:nth-child(even){
                 background: #FAFAFA;
             }
 
             .medication-line .type{
                 width: 10%;
                 height: 100%;
                 text-align: left;
                 flex-grow: 1;
                 padding-left: 8px;
             }
 
             .medication-line .extra-info{
                 width: 10%;
                 flex-grow: 1;
                 padding: 0 8px;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 white-space: nowrap;
                 height: 100%;
             }
 
             .medication-line .line-container{
                 max-width: calc(24px * 36 + 2px);
                 width: calc(24px * 36 + 2px);
                 overflow: hidden;
                 height: 24px;
                 border-left: 1px solid var(--app-background-color-dark);
                 border-right: 1px solid var(--app-background-color-dark);
             }
 
             .medication-line .line{
                 display: flex;
                 box-sizing: unset;
                 position: absolute;
                 color: #fff;
                 border-radius: 2px;
                 top: 0;
                 left: 0;
                 height: 100%;
                 flex-flow: row wrap;
                 align-items: center;
                 justify-content: space-between;
                 margin: 1px 0;
             }
 
             .medication-line .line::after{
                 position: absolute;
                 height: 100%;
                 width: 100%;
                 display: block;
                 content:'';
                 z-index: 0;
             }
 
             .medication-line .line.over{
                 opacity: 0.6;
             }
 
             .line-total-width{
                 position: relative;
                 height: 100%;
             }
 
             .medication-line .line .name{
                 text-align: left;
                 margin-left: 4px;
                 margin-bottom: 4px;
                 z-index: 1;
                 max-width: 100%;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 padding-right: 4px;
             }
 
             .medication-line .line .until{
                 text-align: right;
                 margin-right: 4px;
                 margin-bottom: 4px;
                 z-index: 1;
             }
 
             .medication-line .reimbursement-line{
                 display: block;
                 position: absolute;
                 width: 100%;
                 background: var(--app-status-color-ok);
                 height: 4px;
                 bottom: 0;
                 transition: all .12s cubic-bezier(0.075, 0.82, 0.165, 1);
                 cursor: pointer;
                 overflow: visible;
             }
 
             .medication-line .reimbursement-line:hover{
                 height: 6px;
             }
 
             paper-tooltip{
                 --paper-tooltip: {
                     position: fixed;
                     z-index: 900;
                     width: auto;
                     left: 50%;
                     top: calc(10% + 24px);
                     transform: translate(-50%, -50%);
                     box-sizing: border-box;
                 }
             }
 
             .medIcon{
                 height: 28px;
                 width: 28px;
             }
 
             .content{
                 padding: 0;
             }
 
             .chronicIcon{
                 height: 12px;
                 width: 12px;
             }
 
             .suspensionIcon{
                 height: 12px;
                 width: 12px;
                 color: var(--app-status-color-pending)
             }
 
             .compoundIcon{
                 height: 12px;
                 width: 12px;
                 color: #2882ff;
             }
 
             .substanceIcon{
                 height: 12px;
                 width: 12px;
                 color: #c62ac4;
             }
 
             .legend-chronicIcon{
                 height: 18px;
                 width: 18px;
             }
 
             .legend-suspensionIcon{
                 height: 18px;
                 width: 18px;
                 color: var(--app-status-color-pending)
             }
 
             .oneShotIcon{
                 height: 12px;
                 width: 12px;
                 color: #c60b44;
             }
 
             .legend-oneShotIcon{
                 height: 18px;
                 width: 18px;
                 color: #c60b44;
             }
 
             .legend-compoundIcon{
                 height: 14px;
                 width: 14px;
                 color: #2882ff;
             }
 
             .legend-substanceIcon{
                 height: 14px;
                 width: 14px;
                 color: #c62ac4;
             }
 
             .legend-line{
                 margin-right: 8px;
                 font-size: var(--font-size-normal);
             }
 
             #legend {
                 background: var(--app-background-color);
                 border-radius: 4px;
                 padding: 4px;
                 width: 100%;
                 box-sizing: border-box;
                 margin-bottom: 12px;
             }
 
             .bold{
                 font-weight: bold;
             }
 
             paper-tooltip{
                 --paper-tooltip-delay-in:100;
                 display: inline-block;
                 position: absolute;
             }
 
             #medicationDetailDialog{
                 height: 500px;
                 width: 900px;
             }
 
             .modal-title{
                 background:  var(--app-background-color-dark);
                 margin-top: 0;
                 padding-left: 24px;
             }
 
             .buttons{
                 position: absolute;
                 right: 0;
                 bottom: 0;
             }
 
             .medicationDetailDialogContent{
                 height: 400px;
                 width: auto;
                 overflow: auto;
             }
 
             .medication-detail-line{
                 display: flex;
             }
 
 
             .flex{
                 display: flex;
             }
 
             .pointer{
                 cursor: pointer;
             }
 
             .suspension-info{
                 margin-top: 5px;
             }
 
             .morningIcon{
                 height: 18px;
                 width: 18px;
             }
 
             .moonIcon{
                 height: 12px;
                 width: 12px;
             }
 
             .posologyBlock{
                 padding: 4px;
             }
 
 
             .regimen-container{
                 margin-bottom: 12px;
             }
 
             .headerMasterTitle{
                 font-size: var(--font-size-large);
                 background: var(--app-background-color-dark);
                 padding: 0 12px;
                 box-sizing: border-box;
             }
 
             .headerLabel{
                 font-weight: bold;
             }
 
             .headerInfo{
                 height: auto;
                 width: 100%;
                 box-sizing: border-box;
                 padding: 4px;
                 border: 1px solid var(--app-background-color-dark);
             }
 
             .contentMedDia{
                 height: 100%;
                 position: relative;
                 background: white;
                 margin: 0;
             }
 
             .menu-item-icon--selected{
                 width:0;
             }
 
             .opened .menu-item-icon--selected{
                 width: 18px;
             }
 
             collapse-button[opened] .menu-item-icon{
                 transform: scaleY(-1);
             }
 
             .menu-item paper-icon-button.menu-item-icon--add, .list-info paper-icon-button.menu-item-icon {
                 padding: 0px;
                 height: 18px;
                 width: 18px;
                 border-radius: 3px;
                 background: var(--app-secondary-color);
                 color: var(--app-text-color-light);
                 margin-right: 8px;
             }
 
             .todo-actions paper-icon-button {
                 display: block;
                 height: 24px;
                 width: 24px;
                 padding: 4px;
                 color: var(--app-text-color);
                 margin-right: 2px;
                 margin-left: 2px;
                 --paper-ink-color:var(--app-text-color);
             }
 
             .todo-actions paper-icon-button.hideable {
                 display:none;
             }
 
             .todo-actions.open paper-icon-button.hideable {
                 display:inline-flex;
             }
 
             .contact-actions paper-icon-button {
                 margin: 0 4px;
             }
 
             paper-menu-button{
                 --paper-menu-button: {
                     height: 16px;
                     width: 16px;
                     padding: 0;
                 };
                 --paper-icon-button: {
                     height: 16px;
                     width: 16px;
                     padding: 0;
                 }
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
 
             .listIcon{
                 height: 14px;
                 width: 14px;
             }
 
             .warning{
                 color: darkred;
             }
 
         </style>
 
         <div id="dialog" opened="{{opened}}">
             <div class="admin-top-bar">
                 <div class="modal-title">[[localize('mh_flatrate_history','Flatrate history',language)]]<ht-spinner active="[[isLoading]]"></ht-spinner></div>
                 <div class="buttons">
                     <paper-icon-button class="button--icon-btn" id="refreshFRCheck" on-tap="_generateTimeLine" icon="vaadin:refresh"></paper-icon-button>
                     <paper-tooltip for="refreshFRCheck" position="left">[[localize('refresh','Refresh',language)]]</paper-tooltip>
                 </div>
             </div>
 
             <div class="present">
                 <div class="table">
                     <div class="tr th">
                         <div class="td">
                             Forfait<div class="listIcon"></div>
                         </div>
                         <div class="td">
 
                         </div>
                         <div class="td">
 
                         </div>
                         <div class="td">
 
                         </div>
                         <div class="td">
                             MUT<div class="listIcon"></div>
                         </div>
                         <div class="td">
 
                         </div>
                         <div class="td">
 
                         </div>
                         <div class="td">
 
                         </div>
                         <div class="td">
 
                         </div>
                         <div class="td span-3" style="flex-grow: 3;">
 
                         </div>
                     </div>
                     <div class="tr myRow">
                         <div class="td">
 
                         </div>
                         <div class="td">
                             Batch
                         </div>
                         <div class="td">
                             Status
                         </div>
                         <div class="td">
                             ref.
                         </div>
                         <div class="td">
                             MUT<div class="listIcon"></div>
                         </div>
                         <div class="td">
                             ABON
                         </div>
                         <div class="td">
                             tM
                         </div>
                         <div class="td">
                             tK
                         </div>
                         <div class="td">
                             tI
                         </div>
                         <div class="td span-3" style="flex-grow: 3;">
                             comment
                         </div>
                     </div>
                     <template is="dom-repeat" items="[[months]]" as="month">
                         <div class="tr th">
                             <div class="td">
                                 [[_dateFormat(month.date, 'MM/YYYY')]]
                                 <template is="dom-if" if="[[month.warnings.batchForMonth]]">
                                     <iron-icon icon="vaadin:paperplane" class="listIcon"></iron-icon>
                                 </template>
                                 <template is="dom-if" if="[[!month.warnings.batchForMonth]]">
                                     <div class="listIcon"></div>
                                 </template>
                                 <template is="dom-if" if="[[month.warnings.suspended]]">
                                     <iron-icon icon="editor:money-off" class="listIcon"></iron-icon>
                                 </template>
                                 <template is="dom-if" if="[[!month.warnings.suspended]]">
                                     <div class="listIcon"></div>
                                 </template>
                                 <template is="dom-if" if="[[month.warnings.noMhc]]">
                                     <iron-icon icon="av:skip-previous" class="listIcon"></iron-icon>
                                 </template>
                                 <template is="dom-if" if="[[!month.warnings.noMhc]]">
                                     <div class="listIcon"></div>
                                 </template>
                             </div>
                             <div class="td">
 
                             </div>
                             <div class="td">
 
                             </div>
                             <div class="td">
 
                             </div>
                             <div class="td">
                                 [[month.data.insurability.InsuranceCode]]<div class="listIcon"></div>
                             </div>
                             <div class="td">
                                 <!--                                    [[month.data.insurability.ct12]]-->
                             </div>
                             <div class="td">
 
                             </div>
                             <div class="td">
 
                             </div>
                             <div class="td">
 
                             </div>
                             <div class="td span-3" style="flex-grow: 3;">
                                 [[localize(month.warnings.suspensionreason, month.warnings.suspensionreason, language)]]
                                 <template is="dom-if" if="[[month.warnings.noMhc]]">
                                     [[localize('end-flatrate','End of contract',language)]]
                                 </template>
                             </div>
                         </div>
                         <template is="dom-if" if="[[_hasInvoices(month)]]">
                             <template is="dom-repeat" items="[[month.data.invoices]]" as="invoice">
                                 <div class="tr myRow">
                                     <div class="td">
 
                                     </div>
                                     <div class="td">
                                         [[invoice.DateEnvoi]]
                                     </div>
                                     <div class="td">
                                         [[invoice.status]]
                                         <!--                                        ([[invoice.icCount]])-->
                                     </div>
                                     <div class="td">
                                         [[invoice.invoiceReference]]
                                     </div>
                                     <div class="td">
                                         [[invoice.InsuranceCode]]
                                         <template is="dom-if" if="[[invoice.warnings.mutDif]]">
                                             <iron-icon icon="warning" class="listIcon warning"></iron-icon>
                                         </template>
                                         <template is="dom-if" if="[[!invoice.warnings.mutDif]]">
                                             <div class="listIcon"></div>
                                         </template>
                                     </div>
                                     <div class="td">
                                         [[invoice.mki]]
                                     </div>
                                     <div class="td">
                                         [[invoice.tM]]
                                     </div>
                                     <div class="td">
                                         [[invoice.tK]]
                                     </div>
                                     <div class="td">
                                         [[invoice.tI]]
                                     </div>
                                     <div class="td span-3" style="flex-grow: 3;">
                                         [[invoice.comment]]
                                     </div>
                                 </div>
                             </template>
                             <template is="dom-if" if="[[month.warnings.invoiceLost]]">
                                 <div class="tr myRow">
                                     <div class="td">
 
                                     </div>
                                     <div class="td">
 
                                     </div>
                                     <div class="td">
                                         <paper-icon-button class="menu-item-icon menu-item-icon--add" icon="icons:add" on-tap="_createInvoice" data-month$="[[month]]"></paper-icon-button>
                                         <!--                                        <paper-button on-tap="_createInvoice" data-month$="[[month]]">ADD</paper-button>-->
                                     </div>
                                     <div class="td">
 
                                     </div>
                                     <div class="td">
 
                                     </div>
                                     <div class="td">
 
                                     </div>
                                     <div class="td">
 
                                     </div>
                                     <div class="td">
 
                                     </div>
                                     <div class="td">
 
                                     </div>
                                     <div class="td span-3" style="flex-grow: 3;">
 
                                     </div>
                                 </div>
                             </template>
                         </template>
                         <template is="dom-if" if="[[_showAdd(month)]]">
                             <div class="tr myRow">
                                 <div class="td">
 
                                 </div>
                                 <div class="td">
 
                                 </div>
                                 <div class="td">
                                     <paper-icon-button class="menu-item-icon menu-item-icon--add" icon="icons:add" on-tap="_createInvoice" data-month$="[[month]]"></paper-icon-button>
                                 </div>
                                 <div class="td">
 
                                 </div>
                                 <div class="td">
 
                                 </div>
                                 <div class="td">
 
                                 </div>
                                 <div class="td">
 
                                 </div>
                                 <div class="td">
 
                                 </div>
                                 <div class="td">
 
                                 </div>
                                 <div class="td span-3" style="flex-grow: 3;">
 
                                 </div>
                             </div>
                         </template>
                     </template>
                 </div>
             </div>
         </div>
         </div>
         <ht-pat-flatrate-utils id="flatrateUtils" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" i18n="[[i18n]]" resources="[[resources]]" no-print></ht-pat-flatrate-utils>

`
    }

    static get is() {
        return 'ht-pat-medicalhouse-timeline'
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
            patient: {
                type: Object,
                notify: true
            },
            language: {
                type: String
            },
            opened: {
                type: Boolean,
                value: false
            },
            tabs: {
                type: Number,
                value: 0
            },
            isLoading: {
                type: Boolean,
                value: false
            },
            insList: {
                type: Object,
                value: null
            },
            invoicedMonth: {
                type: Number,
                value: 201901
            },
            invoices: {
                type: Array,
                value: null
            },
            months: {
                type: Array,
                value: null
            },
            invoiceType: {
                type: Array,
                value: () => [
                    {
                        id: "mutualfund",
                        label: {"fr": "Mutuelle", "nl": "Mutual", "en": "Mutual"}
                    },
                    {
                        id: "patient",
                        label: {"fr": "Patient", "nl": "Patient", "en": "Patient"}
                    },
                    {
                        id: "payingagency",
                        label: {"fr": "Autre organisme", "nl": "Anders", "en": "Paying agency"}
                    }
                ]
            },
            sentMediumType: {
                type: Array,
                value: () => [
                    {
                        id: "cdrom",
                        label: {"fr": "cd-rom", "nl": "cd-rom", "en": "cd-rom"}
                    },
                    {
                        id: "efact",
                        label: {"fr": "eFact", "nl": "eFact", "en": "eFact"}
                    },
                    {
                        id: "eattest",
                        label: {"fr": "eAttest", "nl": "eAttest", "en": "eAttest"}
                    },
                    {
                        id: "mediprima",
                        label: {"fr": "Mediprima", "nl": "Mediprima", "en": "Mediprima"}
                    },
                    {
                        id: "paper",
                        label: {"fr": "Papier", "nl": "Paper", "en": "Paper"}
                    }
                ]
            },
            invoicePeriod: {
                type: Array,
                value: () => [
                    {
                        id: 0,
                        label: {"fr": "Semaine", "nl": "Week", "en": "Week"}
                    },
                    {
                        id: 1,
                        label: {"fr": "Nuit", "nl": "Nacht", "en": "Night"}
                    },
                    {
                        id: 2,
                        label: {"fr": "Weekend", "nl": "Weekend", "en": "Weekend"}
                    },
                    {
                        id: 3,
                        label: {"fr": "Jour férié", "nl": "Vakantie", "en": "Public holiday"}
                    }
                ]
            },
            careProviderType: {
                type: Array,
                value: () => [
                    {
                        id: "persphysician",
                        label: {"fr": "Médecin", "nl": "Arts", "en": "Physician"}
                    },
                    {
                        id: "traineesupervised",
                        label: {"fr": "Méd.stag. superv.", "nl": "Stagiair arts", "en": "Superv. trainee"}
                    },
                    {
                        id: "trainee",
                        label: {"fr": "Médecin stagiaire", "nl": "Stagiair arts", "en": "Trainee physician"}
                    }
                ]
            },
        }
    }

    static get observers() {
        return ['apiReady(api,user,opened)', 'isOpened(patient, user)']
    }

    ready() {
        super.ready()
        this.addEventListener('iron-resize', () => this.onWidthChange())
        document.addEventListener('xmlHubUpdated', () => this.xmlHubListener())
    }

    _dateFormat(date) {
        return date ? this.api.moment(date).format('DD/MM/YYYY') : ''
    }

    _timeFormat(date) {
        return date ? this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : ''
    }

    _ageFormat(date) {
        return date ? this.api.getCurrentAgeFromBirthDate(date, (e, s) => this.localize(e, s, this.language)) : ''
    }

    _dateFormat2(date, fFrom, fTo) {
        return date ? this.api.moment(date, fFrom).format(fTo) : ''
    }

    _shortDateFormat(date, altDate) {
        return (date || altDate) && "'" + this.api.moment((date || altDate)).format('YY') || ''
    }

    _trueOrUnknown(b) {
        return b ? this.localize('yes', 'yes', this.language) : '?'
    }

    _yesOrNo(b) {
        return b ? this.localize('yes', 'yes', this.language) : this.localize('no', 'no', this.language)
    }

    _hasErrors(errs) {
        return errs && errs.length > 0
        //return true;
    }

    onWidthChange() {
        const offsetWidth = this.$.dialog.offsetWidth
        const offsetHeight = this.$.dialog.offsetHeight
        if (!offsetWidth || !offsetHeight) {
            return
        }
    }

    isOpened() {
        if (this.patient && this.user) {
            this.months = []
            setTimeout(() => {
                this._generateTimeLine()
            }, 1000)
        }
    }

    apiReady() {
        if (!this.api || !this.user || !this.user.id || !this.opened) return

        try {
        } catch (e) {
            console.log(e)
        }
    }

    attached() {
        super.attached()
        this.async(this.notifyResize, 1)
    }

    _runForfaitCheck() {
        this.checkFlatrateData(this.patient, Number(this.invoicedMonth)).then(res => {
            console.log("res", res)
            return res
        })
    }

    checkFlatrateData(pat, invoicedMonth) {
        //TODO: if multiple MHcontracts exist, check for overlap/validity of all
        //TODO: if multiple insurabilities extist, check for overlap/validity of all
        //Check if hcp or hcpParrent is flatrateInvoicing
        return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
            hcp.parentId ? this.api.hcparty().getHealthcareParty(hcp.parentId) : hcp).then(hcp2 => {
            let res = {}
            res.hcp = hcp2
            console.log("hcp flatrate ?", hcp2)
            if (hcp2.billingType && hcp2.billingType.toLowerCase() === "flatrate") {
                //PatientData:
                //  NISS
                res.nissCheck = this.checkNissValid(pat)
                //  Gender
                res.genderCheck = this.checkGender(pat)
                //  DeathDate
                res.aliveCheck = this.checkAlive(pat, invoicedMonth)
                //Insurability:
                res.insurabilityCheck = this.checkInsurability(pat, invoicedMonth)
                //  MUT
                res.mutCheck = this.checkMut(res.insurabilityCheck)
                //  CT12
                res.ct12Check = this.checkCT12(res.insurabilityCheck)
                //MH Contract:
                res.mhContractCheck = this.checkMHContract(pat, invoicedMonth)
                //  MM NIHII
                res.mhCheck = this.checkMH(res.mhContractCheck)
                //  No Suspension
                res.mhSuspensionCheck = this.checkSuspension(res.mhContractCheck, invoicedMonth)
                //  Disciplines
                res.mhDisciplineCheck = this.checkMHDiscipline(res.mhContractCheck)
                // oveview
                res.flatrateStatus = this.checkMHStatus(res)
                //console.log("res", res, JSON.stringify(res));
            } else {
                // non flatrate
                res.flatrateStatus = {status: "ok-no-flatrate-mh", errors: []}
            }
            return res
        })
    }

    checkMHStatus(res) {
        return res.mhContractCheck.valid ? (
            res.mutCheck.valid && res.ct12Check.valid && res.mhCheck.valid && res.mhSuspensionCheck.valid && res.mhDisciplineCheck.valid && res.nissCheck.valid && res.genderCheck.valid && res.aliveCheck.valid
                ? {status: "ok-flatrate-patient", errors: []} : {
                    status: "nok-flatrate-patient",
                    errors: this.mhStatusErrors(res)
                }
        ) : {status: "ok-no-flatrate-patient", errors: []}
    }

    mhStatusErrors(res) {
        let err = []
        if (!res.mutCheck.valid) err.push(res.mutCheck.error)
        if (!res.ct12Check.valid) err.push(res.ct12Check.error)
        if (!res.mhCheck.valid) err.push(res.mhCheck.error)
        if (!res.mhSuspensionCheck.valid) err.push(res.mhSuspensionCheck.error)
        if (!res.mhDisciplineCheck.valid) err.push(res.mhDisciplineCheck.error)
        if (!res.nissCheck.valid) err.push(res.nissCheck.error)
        if (!res.genderCheck.valid) err.push(res.genderCheck.error)
        if (!res.aliveCheck.valid) err.push(res.aliveCheck.error)
        return err
    }

    checkMHDiscipline(mhcCheck) {
        return mhcCheck.valid ?
            ((mhcCheck.medicalHouseContract.kine || mhcCheck.medicalHouseContract.gp || mhcCheck.medicalHouseContract.nurse) ?
                    {
                        valid: true,
                        discipline: (mhcCheck.medicalHouseContract.gp ? "1" : "0") + (mhcCheck.medicalHouseContract.kine ? "1" : "0") + (mhcCheck.medicalHouseContract.nurse ? "1" : "0"),
                        error: ''
                    }
                    : {valid: false, discipline: "000", error: 'no-discipline'}
            )
            : {valid: false, discipline: "", error: 'no-contract-for-period'}
    }

    checkSuspension(mhcCheck, invoicedMonth) {
        const month = (invoicedMonth * 100) + 1
        return mhcCheck.valid ?
            (mhcCheck.medicalHouseContract.startOfSuspension && mhcCheck.medicalHouseContract.startOfSuspension <= month
                && (!mhcCheck.medicalHouseContract.endOfSuspension || (mhcCheck.medicalHouseContract.endOfSuspension >= month)) ?
                    {valid: false, suspension: mhcCheck.medicalHouseContract, error: 'suspended'}
                    : {valid: true, suspension: {}, error: ''}
            )
            : {valid: false, suspension: {}, error: 'no-contract-for-period'}
    }

    checkMH(mhcCheck) {
        return mhcCheck.valid ?
            (mhcCheck.medicalHouseContract.hcpId && mhcCheck.medicalHouseContract.hcpId !== '' ?
                    {valid: true, hcpId: mhcCheck.medicalHouseContract.hcpId, error: ''}
                    : {valid: false, hcpId: '', error: 'mh-hcpId-absent-or-invalid'}
            )
            : {valid: false, hcpId: '', error: 'no-contract-for-period'}
    }

    checkMHContract(pat, invoicedMonth) {
        //invoicedmonth => yyyyMM => 201909 => (201909 * 100) + 1 = 20190901
        const month = (invoicedMonth * 100) + 1
        if (pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0) {
            const mhcList = pat.medicalHouseContracts.filter(mhc =>
                mhc.startOfCoverage && mhc.startOfCoverage <= month && (!mhc.endOfCoverage || (mhc.endOfCoverage >= month)))
            if (mhcList && mhcList.length > 0) {
                return {valid: true, medicalHouseContract: mhcList[0], error: ''}
            } else {
                return {valid: false, medicalHouseContract: null, error: 'no-contract-for-period'}
            }
        } else {
            return {valid: false, medicalHouseContract: null, error: 'no-contracts'}
        }
    }

    checkMut(insCheck) {
        return insCheck.valid ?
            (insCheck.insurability.insuranceId && insCheck.insurability.insuranceId !== '' ?
                    {valid: true, insuranceId: insCheck.insurability.insuranceId, error: ''}
                    : {valid: false, insuranceId: '', error: 'insuranceId-absent-or-invalid'}
            )
            : {valid: false, ct12: '', error: 'no-ins-for-period'}
    }

    checkCT12(insCheck) {
        return insCheck.valid ?
            (insCheck.insurability.parameters && insCheck.insurability.parameters.tc1
                && insCheck.insurability.parameters.tc1.length === 3 && insCheck.insurability.parameters.tc2 && insCheck.insurability.parameters.tc2.length === 3 ?
                    {
                        valid: true,
                        ct12: insCheck.insurability.parameters.tc1 + insCheck.insurability.parameters.tc2,
                        error: ''
                    }
                    : {valid: false, ct12: '', error: 'tc1-tc2-absent-or-invalid'}
            )
            : {valid: false, ct12: '', error: 'no-ins-for-period'}
    }

    checkInsurability(pat, invoicedMonth) {
        //invoicedmonth => yyyyMM => 201909 => (201909 * 100) + 1 = 20190901
        const month = (invoicedMonth * 100) + 1
        if (pat.insurabilities && pat.insurabilities.length > 0) {
            const insList = pat.insurabilities.filter(ins =>
                ins.startDate && ins.startDate <= month && (!ins.endDate || (ins.endDate >= month)))
            if (insList && insList.length > 0) {
                return {valid: true, insurability: insList[0], error: ''}
            } else {
                return {valid: false, insurability: null, error: 'no-ins-for-period'}
            }
        } else {
            return {valid: false, insurability: null, error: 'no-insurabilities'}
        }
    }

    checkAlive(pat, invoicedMonth) {
        const month = (invoicedMonth * 100) + 1
        return pat.dateOfDeath && (pat.dateOfDeath <= month) ? {
            valid: false,
            dateOfDeath: pat.dateOfDeath,
            error: 'patient-deceased'
        } : {valid: true, dateOfDeath: 0, error: ''}
    }

    checkGender(pat) {
        return pat.gender && (pat.gender === "male" || pat.gender === 'female') ? {
            valid: true,
            error: ''
        } : {valid: true, error: 'gender-invalid'}
    }

    checkNissValid(pat) {
        return (pat.ssin && pat.ssin !== "") ? (pat.ssin.length === 11 ? {valid: true, error: ''} : {
            valid: false,
            error: 'niss-invalid'
        }) : {valid: false, error: 'niss-absent'}
    }

    _getGeninsHistory() {
        this.set("isLoading", true)
        let aMonths = []
        let i
        for (i = 0; i < 24; i++) {
            aMonths.push(moment().startOf('month').subtract(i, 'month'))
        }
        this.set("insList", null)
        let insList = []
        Promise.all(aMonths.map(m => this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
            this.cleanNiss(this.patient.ssin),
            this.api.tokenId ? this.api.tokenId : this.api.tokenIdMH, this.api.tokenId ? this.api.keystoreId : this.api.keystoreIdMH, this.api.tokenId ? this.api.credentials.ehpassword : this.api.credentials.ehpasswordMH,
            this.api.tokenId ? hcp.nihii : this.api.nihiiMH, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, this.api.tokenId ? "doctor" : "medicalhouse", m.format('x'), null
            ))
        )).then(aRes => {
            aRes.map(res => {
                insList.push(res)
                //console.log(res);
            })
            this.set("insList", insList)
            console.log("insList", JSON.stringify(insList))
            this.set("isLoading", false)
        }).finally(this.set("isLoading", false))
    }

    cleanNiss(niss) {
        return niss.replace(/ /g, "").replace(/-/g, "").replace(/\./g, "").replace(/_/g, "").replace(/\//g, "")
    }

    _runTest() {
        let mhcs = this.patient.medicalHouseContracts
        mhcs.map(
            mhc => {
                let tmp = mhc.suspensionSource
            }
        )
        const amounts = this.getForfaitAmounts()
        const amount = this.getForfaitAmountOnDate(20161101)
        const amount1 = this.getForfaitAmountOnDate(20171101)
        const amount2 = this.getForfaitAmountOnDate(20181101)
    }


    getForfaitAmountOnDate(date) {
        const amounts = this.getForfaitAmounts()
        let amount = amounts.find(am => am.startDate <= date && (!am.endDate || am.endDate >= date))

        return amount
    }

    getForfaitAmounts() {
        const propRegStatus = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.Forfait.Amounts') ||
            (this.user.properties[this.user.properties.length] = {
                type: {identifier: 'org.taktik.icure.user.Forfait.Amounts'},
                typedValue: {type: 'JSON', stringValue: '{\"amounts\":[]}'}
            })
        let amounts = {}
        if (propRegStatus && propRegStatus.typedValue) {
            amounts = JSON.parse(propRegStatus.typedValue.stringValue)
        }
        return amounts.amounts ? amounts.amounts : null
    }

    open() {
        this.$.dialog.open()
    }

    close() {
        this.$.dialog.close()
    }

    _createInvoice(e) {
        const month = JSON.parse(_.get(e, "target.dataset.month", ""))
        const flatRateUtil = this.$.flatrateUtils
        flatRateUtil.createInvoice(this.patient, parseInt(this.api.moment(month.date).format("YYYYMMDD"))).then(invoice => this._generateTimeLine())
    }

    _runGetInvoiceHistory() {
        const flatRateUtil = this.$.flatrateUtils
        flatRateUtil.getPatientInvoices(this.patient).then(inv => {
            this.set('invoices', inv.filter(inv => inv.sentMediumType === "cdrom"))
        })
    }

    getInvoiceType(invoiceType) {
        if (!invoiceType) return
        const type = this.invoiceType.find(type => type.id === invoiceType)
        return type && type.label && type.label[this.language]
    }

    getSentMediumType(sentMediumType) {
        const type = this.sentMediumType.find(type => type.id === sentMediumType)
        return type && type.label && type.label[this.language]
    }

    _formatInvoiceDate(date) {
        return date ? this.api.moment(date).format("DD/MM/YYYY") : 'N/A'
    }

    _ifStatusDateExist(date) {
        return (date && date !== "") ? true : false
    }

    _dateFormat(date, format) {
        return date.format(format)
    }

    _hasInvoices(month) {
        return (month && month.data && month.data.invoices && month.data.invoices.length > 0)// && !month.warnings.invoiceLost;
    }

    _showAdd(month) {
        //TODO: remove ' true ;//'
        return !this._hasInvoices(month) && true// month.warnings.batchForMonth;
    }

    _generateTimeLine() {
        const flatRateUtil = this.$.flatrateUtils
        let invoices = []
        let insurancesData = []
        let messages = []
        flatRateUtil.getFlatrateInvoiceMessages().then(msgs => {
            messages = msgs
            console.log("messageCount", messages.length)
            console.log("messages", messages)
            return flatRateUtil.getPatientInvoices(this.patient)
        }).then(invs => {
            invoices = invs.filter(inv => inv.sentMediumType === "cdrom")
            console.log("invoices", invoices)
            const patInsurances = this.patient.insurabilities.map(ins => ins.insuranceId)
            return flatRateUtil._getInsurancesDataByIds(_.compact(_.uniq(_.concat(_.map(invoices, "recipientId", ""), patInsurances))))
        }).then(ins => {
            insurancesData = ins
            if (this.patient && this.patient.medicalHouseContracts && this.patient.medicalHouseContracts.length > 0) {
                const mhc = _.orderBy(this.patient.medicalHouseContracts, ['startOfContract'], ['asc'])[0]
                const startOfCoverage = mhc.startOfCoverage
                const endOfCoverage = mhc.endOfCoverage ? mhc.endOfCoverage : parseInt(moment().startOf('month').format("YYYYMMDD"))
                const startMoment = this.api.moment(startOfCoverage)
                const curMoment = this.api.moment(endOfCoverage).endOf('month').add(1, 'd')
                const endMoment = this.api.moment(endOfCoverage).endOf('month').add(1, 'd')
                console.log('start, end', startOfCoverage, endOfCoverage)
                this.set('months', [])
                let aMonths = []
                while (startMoment <= curMoment) {
                    console.log('curMoment', curMoment.format('YYYYMMDD'))
                    aMonths.push({date: this.api.moment(parseInt(curMoment.format('YYYYMMDD'))), data: {mhc: mhc}})
                    curMoment.subtract(1, 'month')
                }
                aMonths.forEach(m => {
                    const dateCode = parseInt(m.date.format("YYYYMMDD"))
                    m.dateCode = dateCode
                    const lins = this.patient.insurabilities && this.patient.insurabilities.length > 0 ? this.patient.insurabilities.filter(ins => ins.startDate <= dateCode && (ins.endDate >= dateCode || !ins.endDate)) : []
                    m.data.insurability = lins.length > 0 ? _.orderBy(lins, ['startDate'], ['desc'])[0] : {}
                    const ins = m.data.insurability ? insurancesData.find(ins => ins.id === m.data.insurability.insuranceId) : null
                    m.data.insurability.InsuranceCode = ins ? ins.code : "---"
                    m.data.insurability.InsuranceName = ins ? ins.finalName : ""
                    m.data.insurability.ct12 = m.data.insurability.parameters ? (m.data.insurability.parameters.tc1 + "/" + m.data.insurability.parameters.tc2) : "---/---"
                })

                if (invoices) {
                    aMonths.forEach(m => {
                        m.medicalHouseContract = mhc
                        const dateCode = parseInt(m.date.format("YYYYMMDD"))

                        const invs = invoices.filter(inv => inv.invoicingCodes.filter(ic => ic.dateCode === dateCode).length > 0)
                        const invsClone = []
                        const monthInsCode = m.data.insurability ? m.data.insurability.InsuranceCode : null
                        invs.forEach(inv => {
                            inv.invoicingCodes.forEach(ic => {
                                ic.status = (ic.canceled ? "canceled " : "") + (ic.accepted ? "accepted " : "") + (ic.pending ? "pending " : "") + (ic.resent ? "resent " : "") + (ic.lost ? "lost " : "")
                                ic.group = ic.dateCode + "/" + ic.status
                            })
                            const invClone = _.cloneDeep(inv)
                            //TODO: get display values
                            //Send Date/envoi
                            //inv.DateEnvoi = this.api.moment(inv.invoiceDate).format("DD/MM/YYYY");
                            //Mut
                            invClone.Insurance = insurancesData.find(ins => ins.id === inv.recipientId)
                            invClone.InsuranceCode = invClone.Insurance.code
                            invClone.InsuranceName = invClone.Insurance.finalName
                            invClone.warnings = {}
                            invClone.warnings.mutDif = !!(monthInsCode && monthInsCode !== invClone.InsuranceCode)
                            //get all invoicingcode groups : dateCode-status
                            const icGroups = _.uniq(invClone.invoicingCodes.filter(ic => ic.dateCode === dateCode).map(ic => ic.group))
                            icGroups.forEach(icGroup => {
                                console.log("icGroup", icGroup)
                                //m, k, i
                                const invCloneBis = _.cloneDeep(invClone)
                                invCloneBis.m = inv.invoicingCodes.find(ic => ic.code === "109616" && ic.group === icGroup)
                                invCloneBis.k = inv.invoicingCodes.find(ic => ic.code === "509611" && ic.group === icGroup)
                                invCloneBis.i = inv.invoicingCodes.find(ic => ic.code === "409614" && ic.group === icGroup)
                                invCloneBis.mki = (invCloneBis.m ? "M" : "N") + (invCloneBis.k ? "K" : "N") + (invCloneBis.i ? "I" : "N")
                                invCloneBis.icCount = inv.invoicingCodes.filter(ic => ic.code === "109616" && ic.dateCode === dateCode).length

                                //tM, tK, tI
                                invCloneBis.tM = invCloneBis.m ? invCloneBis.m.totalAmount : 0
                                invCloneBis.tK = invCloneBis.m ? invCloneBis.k.totalAmount : 0
                                invCloneBis.tI = invCloneBis.m ? invCloneBis.i.totalAmount : 0
                                //Status
                                const icode = invCloneBis.m ? invCloneBis.m : invCloneBis.k ? invCloneBis.k : invCloneBis.i ? invCloneBis.i : {
                                    canceled: false,
                                    accepted: false,
                                    pending: false,
                                    resent: false,
                                    lost: false,
                                    status: ""
                                }
                                console.log("icode", dateCode, icode)
                                invCloneBis.status = icode.status//(icode.canceled ? "canceled " : "") + (icode.accepted ? "accepted " : "") + (icode.pending ? "pending " : "") + (icode.resent ? "resent " : "") + (icode.lost ? "lost " : "");
                                invCloneBis.status = invCloneBis.status === "" ? "---" : invCloneBis.status
                                invCloneBis.statusDetail = {
                                    pending: icode.pending,
                                    canceled: icode.canceled,
                                    accepted: icode.accepted,
                                    resent: icode.resent,
                                    lost: icode.lost
                                }
                                //reference
                                //reason/error
                                invCloneBis.comment = invCloneBis.error ? invCloneBis.error : ""
                                //link with messages
                                invCloneBis.messages = messages.filter(msg => msg.invoiceIds.includes(invCloneBis.id))
                                invCloneBis.DateEnvoi = invCloneBis.messages && invCloneBis.messages.length > 0 ? this.api.moment(parseInt(invCloneBis.messages[0].metas.exportedDate)).format("MM/YYYY") : "--/----"
                                invsClone.push(invCloneBis)
                            })
                        })
                        m.data.invoices = invsClone
                    })
                }
                aMonths.forEach(m => {
                    const dateCode = parseInt(m.date.format("YYYYMMDD"))
                    m.dateCode = dateCode
                    const msgs = messages.filter(msg => parseInt(this.api.moment(parseInt(msg.metas.exportedDate)).format("YYYYMMDD")) === dateCode)
                    m.warnings = {}
                    m.warnings.batchForMonth = (msgs && msgs.length > 0)
                    m.warnings.notInvoiced = !(m.data.invoices && m.data.invoices.length > 0)
                    m.warnings.noInsurability = m.data.insurability.InsuranceCode === "---"
                    m.warnings.suspended = m.data.mhc && m.data.mhc.startOfSuspension && m.data.mhc.startOfSuspension <= dateCode && (!m.data.mhc.endOfSuspension || (m.data.mhc.endOfSuspension >= dateCode))
                    m.warnings.suspensionreason = m.warnings.suspended && m.data.mhc.suspensionReason ? m.data.mhc.suspensionReason : ""

                    m.warnings.noMhc = (m.data.mhc && m.data.mhc.endOfCoverage <= dateCode) || (m.data.mhc && m.data.mhc.startOfCoverage > dateCode)

                    //TODO:
                    //m.warnings.mutDif = false;
                    m.warnings.invoicePending = (m.data.invoices && m.data.invoices.filter(i => i.statusDetail.pending).length > 0)
                    m.warnings.invoiceAccepted = (m.data.invoices && m.data.invoices.filter(i => i.statusDetail.accepted).length > 0)
                    m.warnings.invoiceSent = (m.data.invoices && m.data.invoices.filter(i => !i.statusDetail.accepted && !i.statusDetail.pending && !i.statusDetail.resent && !i.statusDetail.lost && !i.statusDetail.canceled).length > 0)
                    m.warnings.invoiceLost = ((m.data.invoices && m.data.invoices.filter(i => i.statusDetail.lost).length > 0)) && (!m.warnings.invoicePending && !m.warnings.invoiceAccepted && !m.warnings.invoiceSent)
                    m.warnings.tarifDif = false
                    m.warnings.abonDif = false

                })
                this.set('months', aMonths)
            } else {
                this.set('months', [])
            }
        })

    }
}

customElements.define(HtPatMedicalhouseTimeline.is, HtPatMedicalhouseTimeline)

