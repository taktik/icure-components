import '../../../styles/dialog-style.js';
import '../../../styles/atc-styles.js';
import '../../../styles/scrollbar-style.js';
import './prescription-history.js';
import '../../ht-pat/dialogs/mycarenet/ht-pat-mcn-chapteriv-agreement.js';
import '../../icons/medication-icons.js';
import '../../../styles/paper-tabs-style.js';
import '../../../styles/paper-input-style.js';
import '../../ht-spinner/ht-spinner.js';
import '@polymer/paper-tabs/paper-tabs';

import _ from 'lodash/lodash'
import moment from 'moment/src/moment'
import mustache from "mustache/mustache.js";

const STATUS_NOT_SENT = 1;
const STATUS_SENT = 2;
const STATUS_PENDING = 4;
const STATUS_DELIVERED = 8;
const STATUS_REVOKED = 16;

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../../tk-localizer";
class MedicationPlanDialog extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="dialog-style atc-styles scrollbar-style paper-tabs-style paper-input-style">
            paper-dialog {
                width: 90%;
                height: 80%;
            }

            paper-tabs {
                width: 50%;
                max-width: 400px;
                border-bottom: none;
            }

            .modal-title{
                border-bottom:1px solid var(--app-background-color-darker);
            }

            .present {
                height: calc(100% - 55px);
                overflow-y: auto;
                margin-top: 4px;
                padding: 0 24px 24px;
                box-sizing: border-box;
            }

            .patient {
                height: 100%;
                overflow-y: auto;
                margin-top: 0;
                padding: 24px;
                box-sizing: border-box;
            }

            .table-container {
                margin-bottom: 24px;
                border: 1px solid var(--app-background-color-dark);
                border-radius: 4px;
                overflow: hidden;
            }

            .table-container:last-child{
                margin-bottom: 0;
            }

            .header {
                background: var(--app-background-color-dark);
                color: var(--app-text-color);
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                height: 32px;
                width: 100%;
                padding: 0 12px;
                box-sizing: border-box;
                border: 1px solid var(--app-background-color-dark);
                border-bottom: none;
            }

            .header h3 {
                font-size: var(--font-size-large);
                margin: 0;
            }

            .header iron-icon {
                height: 20px;
                width: 20px;
                margin-right: 4px;
                color: var(--app-secondary-color);
            }

            .table-header {
                width: 100%;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--app-background-color-dark);
                font-size: var(--font-size-small);
                color: var(--app-text-color-disabled);
                min-height: 28px;
                padding: 4px 0;
            }

            .col {
                padding: 0 4px;
                box-sizing: border-box;
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                align-items: center;
                line-height: 1.2;
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
                line-height: 1;
            }

            .col--noMoment{
                max-width: 168px;
                min-width: 168px;
                text-align: center;
                flex-grow: 1;
            }

            .dur-pill {
                background: var(--app-secondary-color);
                color: var(--app-text-color-light);
                font-weight: 500;
                border-radius: 50%;
                padding: 4px;
                display: block;
                height: 12px;
                width: 12px;
                line-height: 1.3;
                text-align: center;
                font-size: var(--font-size-small);
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
                align-items: stretch;
                font-size: var(--font-size-normal);
                color: var(--app-text-color);
                min-height: 40px;
            }

            .table-row:nth-child(even) {
                background: var(--app-background-color);
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
                font-size: var(--font-size-normal);
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
                margin: 0;
                line-height: 1.5;
                flex: 1 1 auto;
                position: relative;
            }

            .table div{
                box-sizing: border-box;
            }

            .th {
                display: none;
                font-weight: 700;
                background-color: var(--app-background-color- );
                z-index: 2;

            }

            .th:first-child {
                border-top: 1px solid var(--app-background-color-dark);
                background: white;
                position: sticky!important;
                top: 0;
                z-index: 2;
            }

            .th:nth-child(2) {
                border-top: 1px solid var(--app-background-color-dark);
                position: sticky!important;
                top: 24px;
                background: var(--app-background-color);
                z-index: 2;
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
                max-width: 24px;
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

            /* .tr:not(.category):not(.th):not(.old) .td {
                color: var(--app-text-color-light);
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
            } */

            /* .tr:not(.td):nth-child(odd)::after {
                opacity: 0.6;
                transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .tr:not(.td):nth-child(even)::after {
                opacity: 0.8;
                transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            .tr:not(.td):hover::after {
                opacity: 1;
            } */

            .tr.old {
                color: var(--app-text-color-disabled)!important;
            }
            /* .tr.old::after {
                background: var(--app-background-color-light)!important;
            } */

            .tr:not(.category) {
                color: var(--app-text-color);
            }

            .tr:nth-of-type(even) {
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
                padding: 0.5em;
                overflow: hidden;
                min-width: 0px;
                z-index: 2;
                word-break: break-word;
                white-space: nowrap;
                border-right: 1px solid var(--app-background-color-dark);
                font-size: var(--font-size-normal);
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
                color: var(--app-text-color);
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
                background-color: var(--app-background-color-dark);
                box-shadow: var(--app-shadow-elevation-1);
            }

            @keyframes inputShadows{
                from{ box-shadow: inset 0 0 0 rgba(0, 0, 0, .12); }
                to{ box-shadow: inset 0 0 50px rgba(0, 0, 0, .12); }
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

            .th .td {
                border-bottom: 1px solid var(--app-background-color-dark);
            }

            .span-3 {
                padding: 6px 19px; /* 19px because we had the padding of the missings .td padding + their borders */
            }

            .table .category {
                border-bottom: 1px solid #d0d0d0;
                position: sticky;
                top: calc(2 * 24px);
                z-index: 2;
                background: white;
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

            .reimbursed .reimbursed-status:hover {
                height: 16px;
                width: 16px;
                box-shadow: 0 0 4px rgba(0, 0, 0, .2);
            }

            .reimbursed .reimbursed-status.hidden{
                display: none;
            }

            .reimbursed .reimbursed-status.ok {
               color: var(--app-status-color-ok);
               background-color: var(--app-text-color-light);
            }

            .reimbursed .reimbursed-status.nok {
                color: var(--app-status-color-nok);
                background-color: var(--app-text-color-light);
            }

            .reimbursed .reimbursed-status.pending {
                color: var(--app-status-color-pending);
                background-color: var(--app-text-color-light);
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
                font-size: var(--font-size-small);
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

            paper-checkbox {
                --primary-color: var(--paper-indigo-500);
                margin: 0 24px;
            }

            paper-checkbox{
                --paper-checkbox-checked-color: var(--app-secondary-color);
            }

            .header-content{
                padding: 0 24px 24px;
                height: 50px;
                display: flex;
                box-sizing: border-box;
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

            paper-input {
                --paper-input-container-focus-color: var(--app-primary-color);
                font-size: var(--form-font-size);
                width: calc(100% - 300px);
            }

            #startDatePresent, #endDatePresent{
                margin-left: 8px;
                margin-top: 5px;
            }

            .medication-category-label span{
                content: '';
                display: block;
                height: 8px;
                width: 8px!important;
                margin-right: 4px;
                border-radius: 50%;
                min-width: 8px;
                min-height: 8px;
            }

            .tr:last-child {
                border-bottom: 1px solid var(--app-background-color-darker);
            }

        </style>

        <paper-dialog id="medication-plan" always-on-top="true" no-cancel-on-outside-click="true">

            <h2 class="modal-title">[[_getModalTitle(selectedTab)]]
                <paper-tabs selected="{{selectedTab}}">
                    <paper-tab>[[localize('pr_history','Prescription',language)]]</paper-tab>
                    <paper-tab>[[localize('tab_pres','Present',language)]]</paper-tab>
                    <paper-tab>[[localize('tab_pat','Patient',language)]]</paper-tab>
                    <paper-tab>[[localize('tab_chap','Chapter IV',language)]]</paper-tab>
                </paper-tabs>
            </h2>

            <div class="content">
                <template is="dom-if" if="{{_isEqual(selectedTab,0)}}">
                    <prescription-history id="prescription-history" api="[[api]]" user="[[user]]" patient="[[patient]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" is-loading="[[isLoading]]"></prescription-history>
                </template>
                <template is="dom-if" if="{{_isEqual(selectedTab,1)}}">
                    <div class="header-content">
                        <paper-input always-float-label="" id="filter" label="[[localize('search','Search',language)]]" value="{{filterPresentValue}}" autofocus=""></paper-input>
                        <vaadin-date-picker id="startDatePresent" value="{{startDatePresent}}" max="[[endDatePresent]]" label="[[localize('from2', 'Du', language)]]"></vaadin-date-picker>
                        <vaadin-date-picker id="endDatePresent" value="{{endDatePresent}}" min="[[startDatePresent]]" label="[[localize('to2', 'Au', language)]]"></vaadin-date-picker>
                    </div>
                    <div class="present">
                        <div class="table">
                            <div class="tr th">
                                <div class="td reimbursed">

                                </div>
                                <div class="td" style="flex-grow: 5;">

                                </div>
                                <div class="td" style="flex-grow: 2;">

                                </div>
                                <div class="td span-3" style="flex-grow: 3;">
                                    <span>[[localize('mom_break','Breakfast',language)]]</span>
                                </div>
                                <div class="td span-3" style="flex-grow: 3;">
                                    <span>[[localize('mom_lunch','Lunch',language)]]</span>
                                </div>
                                <div class="td span-3" style="flex-grow: 3;">
                                    <span>[[localize('mom_dinner','Dinner',language)]]</span>
                                </div>
                                <div class="td" style="flex-grow: 2;">

                                </div>
                                <div class="td" style="flex-grow: 2;">

                                </div>
                                <div class="td" style="flex-grow: 4;">

                                </div>
                            </div>
                            <div class="tr th">
                                <div class="td">

                                </div>
                                <div class="td td--medicine" style="flex-grow: 5; justify-content: flex-start">
                                    <span class="left">[[localize('medic','Medicine',language)]]</span>
                                </div>
                                <div class="td" style="flex-grow: 2;">
                                    <span>[[localize('freq','Frequency',language)]]</span>
                                </div>
                                <div class="td bf-bef">
                                    <span>[[localize('mom_before','Before',language)]]</span>
                                </div>
                                <div class="td bf-dur">
                                    <span>[[localize('mom_during','During',language)]]</span>
                                </div>
                                <div class="td bf-aft">
                                    <span>[[localize('mom_after','After',language)]]</span>
                                </div>
                                <div class="td lu-bef">
                                    <span>[[localize('mom_before','Before',language)]]</span>
                                </div>
                                <div class="td lu-dur">
                                    <span>[[localize('mom_during','During',language)]]</span>
                                </div>
                                <div class="td lu-aft">
                                    <span>[[localize('mom_after','After',language)]]</span>
                                </div>
                                <div class="td di-bef">
                                    <span>[[localize('mom_before','Before',language)]]</span>
                                </div>
                                <div class="td di-dur">
                                    <span>[[localize('mom_during','During',language)]]</span>
                                </div>
                                <div class="td di-aft">
                                    <span>[[localize('mom_after','After',language)]]</span>
                                </div>
                                <div class="td" style="flex-grow: 2;">
                                    <span>[[localize('startDate','Start Date',language)]]</span>
                                </div>
                                <div class="td" style="flex-grow: 2;">
                                    <span>[[localize('endDate','End Date',language)]]</span>
                                </div>
                                <div class="td td-comments" style="flex-grow: 4; justify-content: space-between;">
                                    <span class="left">[[localize('com','Comments',language)]]</span>
                                    <paper-icon-button class="add-period-btn" on-tap="" icon="add-circle"></paper-icon-button>
                                </div>
                            </div>
                            <!-- END HEADER -->
                            <!-- START BODY -->
                            <template is="dom-repeat" items="[[presentList]]" as="medicationsWithPosology">
                                <div class="tr category">
                                    <div class="td">
                                        <label class\$="medication-category-label [[_medicationClass(m.medication,medicationsWithPosology.letter)]]">
                                            <span></span>
                                        </label>
                                    </div>
                                    <div class="td td--category" style="flex-grow: 5;">
                                        <iron-icon icon="history"></iron-icon>
                                        <span class="left"><b>[[_localizedTitle(medicationsWithPosology)]]</b></span>
                                    </div>
                                    <div class="td" style="flex-grow: 2;"></div>
                                    <div class="td"></div>
                                    <div class="td"></div>
                                    <div class="td"></div>
                                    <div class="td"></div>
                                    <div class="td"></div>
                                    <div class="td"></div>
                                    <div class="td"></div>
                                    <div class="td"></div>
                                    <div class="td"></div>
                                    <div class="td" style="flex-grow: 2;"></div>
                                    <div class="td" style="flex-grow: 2;"></div>
                                    <div class="td" style="flex-grow: 4;"></div>
                                </div>
                                <template is="dom-repeat" items="[[medicationsWithPosology.meds]]" as="m">
                                <div class="tr">
                                    <div class="td reimbursed">
                                       <template is="dom-if" if="[[_isChronic(m.medication)]]">
                                           <iron-icon id="chronical" icon="vaadin:alarm" style="height: 16px; width: 16px;"></iron-icon>
                                       </template>
                                        <iron-icon id="reimbursedStatus" icon="icons:euro-symbol" class\$="reimbursed-status [[_hasValidChap4Class(m.medication)]]"></iron-icon>
                                        <paper-tooltip for="reimbursedStatus">[[_chap4Status(m.medication)]]</paper-tooltip>
                                    </div>
                                    <div class="td td--medicine" style="flex-grow: 5;">
                                        <span class="left">[[_serviceDescription(m.medication)]]</span>
                                    </div>
                                    <div class="td" style="flex-grow: 2;"><span>[[_servicePosology(m.medication)]]</span></div>
                                    <template is="dom-repeat" items="[[combinedTableHeaders(medicationClassesWithPosology, 0, m.regimenTable.0, m.regimenTable.0.*, medicationsWithPosology.meds.*)]]" as="regimen">
                                        <div class="td td-input bf-bef">
                                            <span>
                                                <iron-input allowed-pattern="[0-9]">
                                                    <input value="{{regimen.administratedQuantity.quantity}}">
                                                </iron-input>
                                            </span>
                                        </div>
                                    </template>
                                    <div class="td td-input bf-bef"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.1.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.1.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <div class="td td-input bf-dur"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.2.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.2.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <div class="td td-input bf-aft"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.3.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.3.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <template is="dom-repeat" items="[[combinedTable(medicationClassesWithPosology, 4, m.regimenTable.4, m.regimenTable.4.*, medicationsWithPosology.meds.*)]]" as="regimen">
                                        <div class="td td-input bf-bef">
                                            <span>
                                                <iron-input allowed-pattern="[0-9]" bind-value="{{regimen.administratedQuantity.quantity}}">
                                                    <input value="{{regimen.administratedQuantity.quantity::input}}">
                                                </iron-input>
                                            </span>
                                        </div>
                                    </template>
                                    <div class="td td-input lu-bef"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.5.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.5.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <div class="td td-input lu-dur"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.6.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.6.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <div class="td td-input lu-aft"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.7.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.7.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <template is="dom-repeat" items="[[combinedTable(medicationClassesWithPosology, 8, m.regimenTable.8, m.regimenTable.8.*, medicationsWithPosology.meds.*)]]" as="regimen">
                                        <div class="td td-input bf-bef">
                                            <span>
                                                <iron-input allowed-pattern="[0-9]" bind-value="{{regimen.administratedQuantity.quantity}}">
                                                    <input value="{{regimen.administratedQuantity.quantity::input}}">
                                                </iron-input>
                                            </span>
                                        </div>
                                    </template>
                                    <div class="td td-input di-bef"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.9.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.9.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <div class="td td-input di-dur"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.10.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.10.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <div class="td td-input di-aft"><iron-input allowed-pattern="[0-9]" bind-value="{{m.regimenTable.11.0.administratedQuantity.quantity}}"><input value="{{m.regimenTable.11.0.administratedQuantity.quantity::input}}"></iron-input></div>
                                    <template is="dom-repeat" items="[[combinedTable(medicationClassesWithPosology, 12, m.regimenTable.12, m.regimenTable.12.*, medicationsWithPosology.meds.*)]]" as="regimen">
                                        <div class="td td-input bf-bef">
                                            <span>
                                                <iron-input allowed-pattern="[0-9]" bind-value="{{regimen.administratedQuantity.quantity}}">
                                                    <input value="{{regimen.administratedQuantity.quantity::input}}">
                                                </iron-input>
                                            </span>
                                        </div>
                                    </template>
                                    <div class="td" style="flex-grow: 2;"><span>[[_getMedicationOpeningDate(m.medication)]]</span></div>
                                    <div class="td" style="flex-grow: 2;"><span>[[_getMedicationClosingDate(m.medication)]]</span></div>
                                    <div class="td td--comments" style="flex-grow: 4;"><span class="left">[[m.medication.instructionForPatient]]</span></div>
                                </div>
                            </template>
                            </template>
                        </div>
                        <!-- END BODY -->
                        <!-- END TABLE -->
                    </div>

                </template>

                <template is="dom-if" if="{{_isEqual(selectedTab,5)}}">
                    <div class="history">
                        <div class="timeline">
                            <div class="timeline-header">
                                <div class="btn-left">
                                    <paper-icon-button on-tap="_scrollBack" icon="arrow-back"></paper-icon-button>
                                </div>
                                <div class="years-container" id="yearsContainer" on-scroll="_scrollHandler">
                                    <template is="dom-repeat" items="[[historyYears]]" as="historyYear">
                                        <div id="[[historyYear.id]]" class\$="year-block [[_isCurrentYear(historyYear.isCurrent)]]">
                                            <div class="year">[[historyYear.number]]</div>
                                            <div class="quarter">Q1</div>
                                            <div class="quarter">Q2</div>
                                            <div class="quarter">Q3</div>
                                            <div class="quarter">Q4</div>
                                        </div>
                                    </template>
                                    <div class="futur-block">
                                        <div>futur</div>
                                    </div>

                                </div>
                                <div class="btn-right">
                                    <paper-icon-button on-tap="_scrollForward" icon="arrow-forward"></paper-icon-button>
                                </div>
                            </div>
                            <div class="timeline-body">
                                <template is="dom-repeat" items="[[fakePatientMedications]]" as="fakePatientMedication">
                                    <div class="medication-category">
                                        <span>[[fakePatientMedication.category]]</span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <template is="dom-repeat" items="[[fakePatientMedication.medications]]" as="medication">
                                        <div class="medication-line" id="scrollable-element">
                                            <div class="type">[[medication.type]]</div>
                                            <div class="line-container">
                                                <div class="line-total-width" style\$="width: [[totalWidth]]px;">
                                                    <div id="[[medication.id]]" class\$="line [[_medicationClass(medication)]] [[_isOver(medication.endDate)]]" style\$="[[_linePosition(medication.startDate, medication.endDate)]]">
                                                        <div class="name">[[medication.name]] - [[medication.posology]]</div>
                                                        <template is="dom-if" if="[[_endAfterCurrent(medication.endDate)]]"><div class="until">until [[medication.endDate]]</div></template>
                                                    </div>
                                                    <paper-tooltip position="top" for="[[medication.id]]">[[medication.name]] - [[medication.posology]]</paper-tooltip>

                                                    <div id="[[medication.id]]reimbursedLine" class="reimbursement-line" style\$="[[_linePosition(medication.reimmbursementDateStart, medication.reimmbursementDateEnd)]]"></div>
                                                    <paper-tooltip position="top" for="[[medication.id]]reimbursedLine">This medication is reimbursed until [[medication.reimmbursementDateEnd]]</paper-tooltip>
                                                </div>
                                            </div>
                                            <div class="extra-info">[[medication.extraInfo]]</div>

                                        </div>
                                    </template>
                                </template>
                            </div>
                        </div>

                    </div>
                </template>

                <template is="dom-if" if="{{_isEqual(selectedTab,2)}}">
                    <div class="patient">
                        <div class="general-infos">
                            <div class="infos-block">
                                <div class="infos--name"><span>GP</span>Dr. [[user.name]]</div>
                                <div class="infos--address"><span>Address</span>[[_getHcpAddress()]]</div>
                            </div>

                            <div class="infos-block">
                                <div class="infos--name"><span>Pharmacist</span>FirstName LastName</div>
                                <div class="infos--address"><span>Address</span>250 street StreetName</div>
                            </div>
                        </div>
                        <template is="dom-repeat" items="[[patientPlan]]" as="plan">
                            <template is="dom-if" if="[[_isRegimen(plan.meds)]]">
                                <div id="breakfast" class="table-container">
                                    <div class="header">
                                        <iron-icon icon="icure-svg-icons:[[plan.icon]]"></iron-icon>
                                        <h3>[[plan.title]]</h3>
                                    </div>
                                    <div class="table-header">
                                        <div class="col col--med">[[localize('medic','Medicine',language)]]</div>
                                        <div class="col col--photo">Photo</div>
                                        <div class="col col--ed">[[localize('endDate','End Date',language)]]</div>
                                        <div class="col col--freq">[[localize('freq','Frequency',language)]]</div>
                                        <template is="dom-repeat" items="[[plan.cols]]" as="col">
                                            <div class="col col--bef">[[_getHeaderTitle(col)]]</div>
                                        </template>
                                        <div class="col col--com">[[localize('com','Comments',language)]]</div>
                                    </div>
                                    <div class="table-body">
                                        <template is="dom-repeat" items="[[plan.meds]]" as="m">
                                            <div class="table-row">
                                                <div class="col col--med"><span class="med--name">[[_serviceDescription(m.medication)]]</span></div>
                                                <div class="col col--photo"><iron-icon class="medIcon" icon="medication-svg-icons:[[_getMedIcon(m)]]"></iron-icon></div>
                                                <div class="col col--ed">[[_getMedicationClosingDate(m.medication)]]</div>
                                                <div class="col col--freq">[[_serviceFrequency(m.medication)]]</div>
                                                    <template is="dom-repeat" items="[[plan.cols]]" as="col">
                                                        <div class="col col--dur">
                                                            <template is="dom-if" if="[[_getRegimen(col, m)]]">
                                                                <span class="dur-pill">[[_getRegimenQuantity(col, m)]]</span>
                                                            </template>
                                                        </div>
                                                    </template>
                                                <div class="col col--com">[[m.medication.instructionForPatient]]</div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </template>
                <template is="dom-if" if="{{_isEqual(selectedTab,3)}}">
                    <ht-pat-mcn-chapteriv-agreement id="chapterivdialog" api="[[api]]" user="[[user]]" patient="[[patient]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" medications="[[medications]]" on-create-service="_createService" on-update-services="_updateServices"></ht-pat-mcn-chapteriv-agreement>
                </template>
            </div>


            <div class="buttons">
                <paper-button dialog-confirm="" autofocus="" on-tap="cancel" class="button">[[localize('clo','Close',language)]]</paper-button>
                <template is="dom-if" if="{{_isDisplayingPrintButton(selectedTab)}}">
                    <paper-button on-tap="print" class="button button--other">[[localize('print','Print',language)]]</paper-button>
                </template>
                <!--<paper-button dialog-confirm autofocus on-tap="" class="button button--save">[[localize('add_medication','Add Medication',language)]]</paper-button>-->
            </div>
        </paper-dialog>
`;
  }

  static get is() {
      return 'medication-plan-dialog'
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          selectedMedicationContentWithId: {
              type: Object,
              value: null,
              notify: true
          },
          isLoading: {
              type: Boolean,
              value: false
          },
          selectedTab: {
              type: Number,
              value: 0
          },
          medications: {
              type: Array,
              value: () => []
          },
          hcp:{
              type: Object
          },
          medicationClassesWithPosology: {
              type: Array,
              value: () => []
          },
          prescriptionsClassesWithPosology: {
              type: Array,
              value: () => []
          },
          patientPlan:{
              type: Array,
              value: () => []
          },
          scrollLeft: {
              type: Number,
              value: 0,
              notify: true,
              observer: '_scrollLeftChanged'
          },

          totalWidth: {
              type: Number,
              value: 0,
              notify: true,
              observer: '_totalWidth'
          },
          user: {
              type: Object
          },
          historyYears: {
              type: Array,
              value: () => [
                  {
                      id: "year-2014",
                      number: 2014,
                      isCurrent: false
                  },
                  {
                      id: "year-2015",
                      number: 2015,
                      isCurrent: false
                  },
                  {
                      id: "year-2016",
                      number: 2016,
                      isCurrent: false
                  },
                  {
                      id: "year-2017",
                      number: 2017,
                      isCurrent: false
                  },
                  {
                      id: "year-2018",
                      number: 2018,
                      isCurrent: true
                  }
              ],
          },
          fakePatientMedications: {
              type: Array,
              value: () => [
                  {
                      category: "Anti-hypertenseurs",
                      medications: [
                          {
                              id: "selectol500mg",
                              name: "Selectol 500mg",
                              posology: "2x/d",
                              type: "ß-bloquant",
                              startDate: "01 jan 2017",
                              endDate: "31 dec 2018",
                              extraInfo: "Take with a glass of milk Take with a glass of milk Take with a glass of milk Take with a glass of milk",
                              isReimbursed: true,
                              reimmbursementDateStart: "20 jan 2017",
                              reimmbursementDateEnd: "31 dec 2018",
                              colour: "ATC--L"
                          },
                          {
                              id: "Amlor200mg",
                              name: "Amlor 200mg",
                              posology: "2x/d",
                              type: "Inhib.-Ca",
                              startDate: "01 jan 2018",
                              endDate: "30 sep 2018",
                              extraInfo: "",
                              isReimbursed: true,
                              reimmbursementDateStart: "20 mar 2018",
                              reimmbursementDateEnd: "30 sept 2019",
                              colour: "ATC--L"
                          }
                      ]
                  },
                  {
                      category: "Anti-douleur",
                      medications: [
                          {
                              id: "paracetamolTeva200mg",
                              name: "Paracétamol Téva 200mg",
                              posology: "2x/j",
                              type: "",
                              startDate: "01 mar 2017",
                              endDate: "15 dec 2017",
                              extraInfo: "",
                              isReimbursed: false,
                              reimmbursementDateStart: "20 jan 2017",
                              reimmbursementDateEnd: "31 dec 2018",
                              colour: "ATC--J"
                          },
                          {
                              id: "claradolCodeine20mg",
                              name: "Claradol Codéine 20mg",
                              posology: "1x/d",
                              type: "",
                              startDate: "01 sep 2018",
                              endDate: "30 sep 2018",
                              extraInfo: "",
                              isReimbursed: true,
                              reimmbursementDateStart: "20 mar 2018",
                              reimmbursementDateEnd: "30 sept 2019",
                              colour: "ATC--J"
                          }
                      ]
                  }
              ]
          },
          patient : {
              type : Object,
              value : {}
          },
          prescriptions:{
              type: Array,
              value: []
          },
          filterPresentValue:{
              type: String,
              value: ""
          },
          startDatePresent:{
              type: String,
              value: ""
          },
          endDatePresent:{
              type: String,
              value: ""
          },
          presentList:{
              type: Array,
              value : []
          }
      }
  }

  static get observers() {
      return ['_medicationsChanged(medications.*)', '_patientPlanChanged(medicationClassesWithPosology.*,prescriptionsClassesWithPosology.*)','_prescriptionsChanged(prescriptions.*)','_getPrescrMed(medicationClassesWithPosology.*,prescriptionsClassesWithPosology.*,filterPresentValue,startDatePresent,endDatePresent)']
  }

  constructor() {
      super()
  }

  ready() {
      super.ready()
      this.addEventListener('iron-resize', () => this._setInitialScroll())
      this.addEventListener('iron-resize', () => this._totalWidth())
  }

  attached() {
      super.attached();
      this.async(this.notifyResize, 1);
  }

  setSelectedTab(e) {
      this.set('selectedTab', e)
  }

  _scrollHandler(e) {
      this.set('scrollLeft', e.currentTarget.scrollLeft)
  }

  _scrollLeftChanged(){
      const yearsContainer = this.shadowRoot.querySelector('.years-container')
      if(yearsContainer) yearsContainer.scrollLeft = this.scrollLeft
      const timelines = this.root.querySelectorAll('.line-container')
      for( let line of timelines) {
          line.scrollLeft = this.scrollLeft
      }
  }

  _setInitialScroll(){
      const currentYear = this.shadowRoot.querySelector('.current')
      this.set('scrollLeft', currentYear && currentYear.offsetLeft)
  }

  _scrollBack(e){
      e.preventDefault();
      e.stopPropagation();
      this.set('scrollLeft', this.scrollLeft -= 24)
  }

  _scrollForward(e){
      e.preventDefault();
      e.stopPropagation();
      this.set('scrollLeft', this.scrollLeft += 24)
  }

  _linePosition(startDate, endDate){
      startDate  = (startDate) ? new Date(startDate) : null
      const historyYearStart = new Date("01 jan " + this.historyYears[0].number)
      const left = Math.round((Date.parse(startDate) - Date.parse(historyYearStart))  * 3.8027E-10 * 24)
      endDate = (endDate) ? new Date(endDate) : null
      const currentYear = new Date().getFullYear()
      let width = "0"
      if (currentYear >= endDate.getFullYear()) {
          width = (startDate && endDate) ? Math.round((Date.parse(endDate) - Date.parse(startDate)) * 3.8027E-10 * 24) + 'px' : 100 + '%'
      } else{
          width = this.totalWidth - left + "px"
      }

      return "left: " + left + "px; " + "width: " + width
  }

  _reimbursementLinePosition(startDate, endDate){
      startDate  = (startDate) ? new Date(startDate) : null
      endDate = (endDate) ? new Date(endDate) : null
      const historyYearStart = new Date("01 jan " + this.historyYears[0].number)
  }

  _totalWidth(){
      const width = this.historyYears.length * 12 * 24 + 24 * 4
      this.set('totalWidth',  width)
  }

  _isOver(endDate){
      endDate = new Date(endDate)
      const endDateYear = endDate.getFullYear()
      if(endDateYear) return (endDateYear < (new Date()).getFullYear()) ? 'over' : ''
  }

  _isCurrentYear(current){
      return (current) ? 'current' : ''
  }

  _isEqual(a,b) {
      console.log(a+' ?= '+b)
      return (a === b)
  }

  _endAfterCurrent(endDate){
      const endDateYear = new Date(endDate).getFullYear()
      const currentYear = new Date().getFullYear()
      console.log("!!!!!! current !!!!!!!!", (endDateYear > currentYear))
      return (endDateYear > currentYear)
  }

  open(medicationPlan, selectedMedicationContentWithId) {
      this.$['medication-plan'].open()
  }

  _setStatus(service, status) {

  }

  setContacts(contacts) {

      let prescriptions = [];

      this._contacts = contacts;

      this._contacts.forEach(contact => {
          _.get(contact, "subContacts", []).forEach(subContact => {
              _.get(subContact, "services", []).forEach(service => {
                  this._getPrescription(prescriptions, service, contact);
              });
          });
          _.get(contact, "services", []).forEach(service => {
              this._getPrescription(prescriptions, service, contact);
          });
      })

      this.set("isLoading", true)

      if (this.shadowRoot.querySelector("#prescription-history"))
          this.shadowRoot.querySelector("#prescription-history").setPrescriptions([]);

      this.api.hcparty().getHealthcareParty(_.get(this.user, 'healthcarePartyId', null))
          .then(hcp => this.set("hcp", hcp))
          .then(() => (_.get(this.api, "tokenId", null) && _.get(this.patient, 'ssin', null) ? this.api.fhc().Recipecontroller().listOpenPrescriptionsByPatientUsingGET(_.get(this.api, 'keystoreId', null), _.get(this.api, 'tokenId', null), "persphysician", _.get(this.hcp, 'nihii', null), _.get(this.hcp, 'ssin', null), _.get(this.hcp, 'lastName', null), _.get(this.patient, 'ssin', null), _.get(this.api, 'credentials.ehpassword', null)) : Promise.resolve([])))
          .then(openPrescriptions => {
              console.log(openPrescriptions);
              prescriptions.forEach(prescription => {
                  const found = !!_.get(prescription, 'rid', null) && openPrescriptions.some(p => p.rid === _.get(prescription, 'rid', null));
                  const medicationValue = this.api.contact().preferredContent(prescription.service, this.language).medicationValue;
                  if (!("status" in medicationValue)) {
                      const tag = _.get(prescription, 'service.tags', []).find(t => t.type === 'CD-LIFECYCLE')
                      const sent = found || (_.get(tag, 'code', null) === "ordered");
                      medicationValue.status = sent ? STATUS_SENT : STATUS_NOT_SENT;
                      prescription.update = true;
                  }
                  let status = _.get(medicationValue, 'status', null)
                  if (found)
                      status = STATUS_SENT | STATUS_PENDING;
                  else if ((status & STATUS_SENT) && !(status & STATUS_REVOKED))
                      status |= STATUS_DELIVERED;
                  if (status & STATUS_DELIVERED)
                      status = STATUS_DELIVERED | STATUS_SENT;
                  if (status & STATUS_REVOKED)
                      status = STATUS_REVOKED | STATUS_SENT;
                  if (medicationValue.status != status) {
                      medicationValue.status = status;
                      prescription.update = true;
                  }
              })

              const contacts = prescriptions.filter(p => p.update).flatMap(p => p.contact).filter((c, i, a) => a.indexOf(c) === i);
              const promises = contacts.map(contact => {
                  return this.api.contact().modifyContactWithUser(this.user, contact)
              });

              //TODO: get feedback for every recip-e prescription
              //this.api.fhc().Recipecontroller().listFeedbacksUsingGET(this.api.keystoreId, this.api.tokenId, "persphysician", this.hcp.nihii, this.hcp.ssin, this.hcp.lastName, this.api.credentials.ehpassword, rid)

              const getFeedback = _.get(this.api, "tokenId", null) && _.get(this.patient, 'ssin', null) ? prescriptions.filter(p => p.rid).map(p => {
                  return this.api.fhc().Recipecontroller().listFeedbacksUsingGET(
                      _.get(this.api, 'keystoreId', null),
                      _.get(this.api, 'tokenId', null),
                      "persphysician",
                      _.get(this.hcp, 'nihii', null),
                      _.get(this.hcp, 'ssin', null),
                      _.get(this.hcp, 'lastName', null),
                      _.get(this.api, 'credentials.ehpassword'), p.rid);
              }) : [];

              return Promise.all(promises).then(() => {
                  this.shadowRoot.querySelector("#prescription-history").hcp = this.hcp;
                  this.shadowRoot.querySelector("#prescription-history").setPrescriptions(prescriptions);
                  Promise.all(getFeedback).then((fbs) => {
                      console.log("get feedbacks");
                  });
              }).finally(() => {
                  this.set("isLoading", false)
              });
          })
  }

  _getMedicationValue(service) {
      return _.get(this.api.contact().preferredContent(service, this.language), "medicationValue", null);
  }

  _getPrescription(prescriptions, service, contact) {
      if (!service) return;
      if (service.label === "Prescription" ||
          (service.tags && service.tags.some(t => t.type === "ICURE" && t.code === "PRESC"))) {
          const medicationValue = this._getMedicationValue(service);
          const product = _.get(medicationValue, "medicinalProduct" , _.get(medicationValue, "substanceProduct", null));
          let prescription = null;
          if (product) {
              prescription = {
                  service: service,
                  contact: contact,
                  date: this.api.moment(service.valueDate).format("DD/MM/YYYY"),
                  name: _.get(product, "intendedname", "unknown"),
                  rid: _.get(medicationValue, "prescriptionRID", null),
                  atc: _.get(service.codes.find(c => c.type === "CD-ATC"), "code", ""),
                  cnk: _.get(service.codes.find(c => c.type === "CD-DRUG-CNK"), "code", ""),
                  vmp: _.get(service.codes.find(c => c.type === "CD-VMPGROUP"), "code", ""),
                  cds: _.get(product,"intendedcds",[]).map(c => _.get(c,'code','unknown')) || "unknown",
                  update: false
              };
          } else {
              const compoundPrescription = _.get(medicationValue, "compoundPrescription", null);
              if (compoundPrescription) {
                  prescription = {
                      service: service,
                      contact: contact,
                      date: this.api.moment(service.valueDate).format("DD/MM/YYYY"),
                      name: compoundPrescription,
                      rid: _.get(medicationValue, "prescriptionRID", null),
                      update: false
                  }
              }
          }
          if (prescription) {
              prescriptions.push(prescription);
          }
      }
  }

  _localize(s) {
      return this.api.contact().medication().localize(s, this.language)
  }

  cancel() {
      this.close()
  }

  saveAndClose() {
      this.save() // instant save
      this.close()
  }

  close() {
      this.set("selectedMedicationContentWithId", null)
  }

  _closeAndNew() {
      const target = this.parentNode
      this._valueChanged() // instant save
      this.close()
      // this.parentNode.dispatchEvent(new CustomEvent('newMedicFromChild',{}) )
  }

  save() {
      this._valueChanged()
  }

  _regimenTableDataProvider(frequency) {
      function getMeal(regimens, daytime, frequency="daily") {
          return regimens.find(rg => rg.dayPeriod && rg.dayPeriod.code === daytime && rg.frequency === frequency) || {
              administratedQuantity: { quantity: 0 },
              dayPeriod: {type: "CD-DAYPERIOD", code: daytime},
              frequency: "daily"
          }
      }

      return (params, callback) => {
          if (!this.get('selectedMedicationContentWithId.medicationValue')) { callback([], 0); return }

          const startIndex = params.page * params.pageSize
          const regs = this.selectedMedicationContentWithId.medicationValue.regimen
          const {morningRegimens, middayRegimens, eveningRegimens} = this.extractRegimenSlices(regs, frequency)

          const extraColsBefore = []
          const extraColsAfter = []

          const scores = this.api.contact().medication().regimenScores()

          this.regimenTable = [
              {moment:this.localize('breakfast','breakfast'), regimens: morningRegimens, beforeMeal: getMeal(morningRegimens,'beforebreakfast', frequency)
                  , duringMeal: getMeal(morningRegimens,'duringbreakfast', frequency), afterMeal: getMeal(morningRegimens,'afterbreakfast', frequency)},
              {moment:this.localize('lunch','lunch'), regimens: middayRegimens, beforeMeal: getMeal(middayRegimens,'beforelunch', frequency)
                  , duringMeal: getMeal(middayRegimens,'duringlunch', frequency), afterMeal: getMeal(middayRegimens,'afterlunch', frequency)},
              {moment:this.localize('dinner','dinner'), regimens: eveningRegimens, beforeMeal: getMeal(eveningRegimens,'beforedinner', frequency)
                  , duringMeal: getMeal(eveningRegimens, 'duringdinner', frequency), afterMeal: getMeal(eveningRegimens,'afterdinner', frequency)}
          ]


          ;[[0,scores.beforebreakfast-1,scores.duringbreakfast,scores.afterbreakfast+1,105959], [110000,scores.beforelunch-1,scores.duringlunch,scores.afterlunch+1,155959], [160000,scores.beforedinner-1,scores.duringdinner,scores.afterdinner+1,240000]].forEach((quad,idx) => {
              const l  = this.regimenTable[idx]
              l.extraBefore = extraColsBefore.map(() => null).concat((l.regimens || []).filter(r => this.selectRegimen(scores, r, quad[0],  quad[1]) || r.timeOfDay && r.timeOfDay < quad[2]))
              extraColsBefore.push(..._.sortBy(l.extraBefore.filter(x => !!x), rg => rg.timeOfDay || rg.dayPeriod && rg.dayPeriod.code && scores[rg.dayPeriod.code] || 0))
              l.extraAfter = extraColsAfter.map(() => null).concat((l.regimens || []).filter(r => this.selectRegimen(scores, r, quad[3],  quad[4]) || r.timeOfDay && r.timeOfDay > quad[2]))
              extraColsAfter.push(..._.sortBy(l.extraAfter.filter(x => !!x), rg => rg.timeOfDay || rg.dayPeriod && rg.dayPeriod.code && scores[rg.dayPeriod.code] || 0))
          })

          this.set('extraColsBefore', extraColsBefore.map(rg =>  rg.timeOfDay ? this._formatTime(rg.timeOfDay) : rg.dayPeriod && rg.dayPeriod.code ))
          this.set('extraColsAfter', extraColsAfter.map(rg => rg.timeOfDay ? this._formatTime(rg.timeOfDay) : rg.dayPeriod && rg.dayPeriod.code  ))


          ;[0,1,2,3].forEach(idx => idx>=this.extraColsBefore.length && (this.root.querySelector(`#extracol_before_${idx}`).hidden = true))
          this.extraColsBefore.forEach((val,idx) => {
              const el = this.root.querySelector(`#extracol_before_${idx}`)
              el && (el.hidden = false)
          })

          ;[0,1,2,3].forEach(idx => idx>=this.extraColsAfter.length && (this.root.querySelector(`#extracol_after_${idx}`).hidden = true))
          this.extraColsAfter.forEach((val,idx) => {
              const el = this.root.querySelector(`#extracol_after_${idx}`)
              el && (el.hidden = false)
          })

          callback(this.regimenTable.slice(startIndex, startIndex + params.pageSize), this.regimenTable.length)
      }
  }

  extractRegimenSlices(regimen, frequency, conditions) {
      const scores = this.api.contact().medication().regimenScores()
      const regsTable = conditions.map(() => [])
      ;(regimen || []).forEach(rg => {
          if ((rg.frequency || 'daily') === frequency) {
              const score = rg.timeOfDay || rg.dayPeriod && rg.dayPeriod.code && scores[rg.dayPeriod.code] || 0
              const idx = _.findIndex(conditions, c => c(score))
              if (idx>=0) {
                  regsTable[idx].push(rg)
              }
          }
      })
      return regsTable
  }

  _getPrescrMed(){
      const prescTab =_.sortBy(_.compact(_.get(this,'medicationClassesWithPosology',[]).map(val => !this.prescriptionsClassesWithPosology.find(lowVal => lowVal.letter===val.letter) ? {letter : val.letter, meds:[]} : {}).concat(this.prescriptionsClassesWithPosology)),'letter')
      const medTab =_.sortBy(_.compact(_.get(this,'prescriptionsClassesWithPosology',[]).map(val => !this.medicationClassesWithPosology.find(lowVal => lowVal.letter===val.letter) ? {letter : val.letter, meds:[]} : {}).concat(this.medicationClassesWithPosology)),'letter')
      this.set("presentList", _.zipWith(medTab, prescTab,(med,presc) =>{
          return {
              "letter" : _.get(med, 'letter', null),
              "meds" : _.uniq(_.concat(_.get(med, 'meds', []), _.get(presc, 'meds', []))).filter(med => {
                  const closeDate = this._getMedicationClosingDate(med.medication) ? moment(this._getMedicationClosingDate(med.medication),"DD/MM/YYYY") : false
                  const startDate = this._getMedicationOpeningDate(med.medication) ? moment(this._getMedicationOpeningDate(med.medication),"DD/MM/YYYY") : false
                  //const startDate= this.api.moment(_.get(this.api.contact().medicationValue(med.medication),"beginMoment",parseInt(moment().format("YYYYMMDD"))))
                  const betweenDate = (this.startDatePresent && moment(this.startDatePresent)) || (this.endDatePresent && moment(this.endDatePresent)) || false
                  if(betweenDate){
                      if(this.startDatePresent && moment(this.startDatePresent) && this.endDatePresent && moment(this.endDatePresent)){
                          return (!closeDate || moment(this.startDatePresent).isSameOrBefore(closeDate)) && moment(this.endDatePresent).isSameOrAfter(startDate)
                      }
                      else{
                          return (!closeDate && moment(betweenDate).isSameOrAfter(startDate)) || moment(betweenDate).isBetween(startDate,closeDate)
                      }
                  }
                  else{
                      return closeDate ? closeDate.isSameOrAfter(moment()) : true
                  }
              }).filter(med => this.filterPresentValue.length>2 ? this._serviceDescription(med.medication).includes(this.filterPresentValue) : true)
          };
      }).filter(zipped => zipped.meds.length))
  }

  _prescriptionsChanged(){
      const scores = this.api.contact().medication().regimenScores()
      this.set('prescriptionsClassesWithPosology',_.sortBy(Object.values(this.prescriptions.filter(prescr => {
          const medValue = this.api.contact().medicationValue(prescr)
          return (medValue && medValue.endMoment || prescr.closingDate) ? this.api.moment(medValue && medValue.endMoment || prescr.closingDate).isSameOrAfter(moment()) : true
      }).map( p => ({
          medication:p, regimenTable: this.extractRegimenSlices(((this.api.contact().preferredContent(p, this.language) || {}).medicationValue || {}).regimen, 'daily', [
              x => x < scores.beforebreakfast,
              x => x === scores.beforebreakfast,
              x => x === scores.duringbreakfast,
              x => x === scores.afterbreakfast,
              x => x < scores.beforelunch,
              x => x === scores.beforelunch,
              x => x === scores.duringlunch,
              x => x === scores.afterlunch,
              x => x < scores.beforedinner,
              x => x === scores.beforedinner,
              x => x === scores.duringdinner,
              x => x === scores.afterdinner,
              x => x > scores.afterdinner
          ])
      })).reduce((acc,p) => {
          const letter = ((p.medication && p.medication.codes && p.medication.codes.find(c => c.type === 'CD-ATC') || {code: 'V'}).code || 'V').substr(0,1)
          ;(acc[letter] || (acc[letter] = {letter:letter, meds:[]})).meds.push(p)
          return acc
      }, {})), 'letter'))
  }

  _medicationsChanged() {
      const scores = this.api.contact().medication().regimenScores()
      this.set('medicationClassesWithPosology',_.sortBy(Object.values(this.medications.map( m => ({
          medication:m, regimenTable: this.extractRegimenSlices(((this.api.contact().preferredContent(m, this.language) || {}).medicationValue || {}).regimen, 'daily', [
              x => x < scores.beforebreakfast,
              x => x === scores.beforebreakfast,
              x => x === scores.duringbreakfast,
              x => x === scores.afterbreakfast,
              x => x < scores.beforelunch,
              x => x === scores.beforelunch,
              x => x === scores.duringlunch,
              x => x === scores.afterlunch,
              x => x < scores.beforedinner,
              x => x === scores.beforedinner,
              x => x === scores.duringdinner,
              x => x === scores.afterdinner,
              x => x > scores.afterdinner
          ])
      })).reduce((acc,m) => {
          const letter = ((m.medication && m.medication.codes && m.medication.codes.find(c => c.type === 'CD-ATC') || {code: 'V'}).code || 'V').substr(0,1)
          ;(acc[letter] || (acc[letter] = {letter:letter, meds:[]})).meds.push(m)
          return acc
      }, {})), 'letter'))
  }

  _serviceDescription(s) {
      return this.api.contact().medication().medicationNameToString((this.api.contact().preferredContent(s, this.language) || {}).medicationValue, this.language)
  }

  _getMedIcon(s){
      return "cap"
  }

  _servicePosology(s) {
      return this.api.contact().medication().posologyToString((this.api.contact().preferredContent(s, this.language) || {}).medicationValue, this.language)
  }

  _serviceFrequency(s){
      return this.api.contact().medication().frequencyToString((this.api.contact().preferredContent(s, this.language) || {}).medicationValue, this.language)
  }

  _chap4Status(s) {
      return this._hasValidChap4() ? 'reimbursed' : ''
  }

  _hasValidChap4(s) {
      ;(((this.api.contact().preferredContent(s, this.language) || {}).medicationValue || {}).agreements || []).some(z => z.accepted && (!!z.end || this.api.moment(z.end).isAfter(moment())))
  }

  _hasPendingChap4(s) {
      ;(((this.api.contact().preferredContent(s, this.language) || {}).medicationValue || {}).agreements || []).some(z => z.inTreatment)
  }

  _hasValidChap4Class(s) {
      return this._hasValidChap4(s) ? 'ok' : this._hasPendingChap4(s) ? 'pending' : this._hasChap4 (s) ? 'nok' : 'hidden'
  }

  _hasChap4(s) {
      return !!(((this.api.contact().preferredContent(s, this.language) || {}).medicationValue || {}).agreements || []).length
  }

  _medicationClass(m,letter = null) {
      return (letter && "ATC--"+letter) || (m.colour && (m.colour))|| "ATC--"+_.get(m.codes.find(c=> c.type==="CD-ATC"), 'code', ' ').charAt(0)
  }

  _localizedTitle(medicationsWithPosology) {
      return this.atcCat(medicationsWithPosology.letter)
  }

  atcCat(l) {
      return l === 'A' ? this.localize('ali_trac_meta','Alimentary tract and metabolism') :
          l === 'B' ? this.localize('blo_blo_for','Blood and blood forming organs') :
          l === 'C' ? this.localize('car_sys','Cardiovascular system') :
          l === 'D' ? this.localize('dermatologicals','Dermatologicals') :
          l === 'G' ? this.localize('gen_uri_sys','Genito-urinary system and sex hormones') :
          l === 'H' ? this.localize('sys_hor_pre','Systemic hormonal preparations, excluding sex hormones and insulins') :
          l === 'J' ? this.localize('anti_inf_sys','Antiinfectives for systemic use') :
          l === 'L' ? this.localize('anti_neo_imm','Antineoplastic and immunomodulating agents') :
          l === 'M' ? this.localize('mus_ske_sys','Musculo-skeletal system') :
          l === 'N' ? this.localize('ner_sys','Nervous system') :
          l === 'P' ? this.localize('Anti_para_pro','Antiparasitic products, insecticides and repellents') :
          l === 'R' ? this.localize('res_sys','Respiratory system') :
          l === 'S' ? this.localize('sens_org','Sensory organs') :
          l === 'V' ? this.localize('various','Various') : this.localize('unk','Unknown')
  }

  _getModalTitle(){
      // TODO: LDE: not sure
      //return this.selectedTab === 3 ? this.localize('tab_chap','Chapter IV') : this.localize('med_plan','Medication plan')
      return this.selectedTab === 4 ? this.localize('tab_chap','Chapter IV') : this.localize('med_plan','Medication plan')
  }

  _getMedicationQuantity(quantity){
      return quantity
  }

  _isEmptyRegiment(regiment){
      return regiment && regiment.length !== 0 ? false : true
  }

  combinedTableHeaders(medicationClassesWithPosology, index){
      return _(medicationClassesWithPosology)
          .flatMap(classe => classe.meds)
          .map(med => med.regimenTable)
          .compact()
          .map(reg => reg[index])
          .compact()
          .flatMap(r => r.administratedQuantity && r.administratedQuantity.quantity > 0 && (r.timeOfDay || r.dayPeriod && r.dayPeriod.code))
          .compact()
          .uniq()
          .value()
  }

  combinedTable(medicationClassesWithPosology, index, regimenTable) {
      this.combinedTableHeaders(medicationClassesWithPosology, index).map(col =>
          regimenTable.find(r => r.timeOfDay === col || r.dayPeriod && r.dayPeriod.code === col)
      )
  }
   _isChronic(med){
      return !med.closingDate && _.get(med, "tags", []).some(t => t.type === "CD-ITEM" && t.code === "medication");
  }

  _getMedicationOpeningDate(med){
      if (!med) return "";
      const medValue = this.api.contact().medicationValue(med)
       return this._longDateFormat(medValue && medValue.beginMoment, med.openingDate)
  }

    _getMedicationClosingDate(med){
      if (!med) return "";
      const medValue = this.api.contact().medicationValue(med)
      return this._longDateFormat(medValue && medValue.endMoment, med.closingDate)
    }

  _longDateFormat(date, altDate, altDate2) {
      return (date || altDate || altDate2) && this.api.moment((date || altDate || altDate2)).format('DD/MM/YYYY') || '';
  }

  _patientPlanChanged(){
     let medicationClass = this.medicationClassesWithPosology.concat(this.prescriptionsClassesWithPosology)

      const medications = []
      medicationClass.flatMap(classe => classe.meds).map(m => {
          const find = medications.find(med => m.medication.codes.find(cm => med.medication.codes.find(code=> code.code===cm.code)))
          if(!medications.length || !find){
              medications.push(m)
          }
          else if(!find.medication.tags.find(tag => tag.code==="medication") && m.medication.tags.find(tag => tag.code==="medication")){
              medications[medications.findIndex(med => med.medication.id===find.medication.id)]=m
          }
      })

      let regimensTableByDayPeriod = {
          beforeBreak : [],
          breakfast : [],
          betweenBAndL: [],
          lunch: [],
          betweenLAndD: [],
          dinner: [],
          night: []
      }

      medications.map(m => {

          const medication = m.medication
          const regimens = m.regimenTable

          if((regimens[0]).length > 0){
              regimensTableByDayPeriod.beforeBreak.push({
                  medication : medication,
                  regimens: _.uniq(regimens[0]),
                  before: [],
                  during: regimens[0],
                  after: [],
                  times: regimens[0].map(r => ({tod: r.timeOfDay && r.timeOfDay !== "" ? r.timeOfDay : null, pc: r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code !== "" ? r.dayPeriod.code : null , oth: (!r.timeOfDay && !r.dayPeriod) ? r.administratedQuantity : null}))
              })
          }

          if(_(_.concat(regimens[1], regimens[2], regimens[3])).compact().uniq().value().length > 0){
              regimensTableByDayPeriod.breakfast.push({
                  medication : medication,
                  regimens: _(_.concat(regimens[1], regimens[2], regimens[3])).compact().uniq().value(),
                  before: regimens[1],
                  during: regimens[2],
                  after: regimens[3],
                  times: _(_.concat(regimens[1], regimens[2], regimens[3])).compact().uniq().value().map(r => ({tod: r.timeOfDay && r.timeOfDay !== "" ? r.timeOfDay : null, pc: r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code !== "" ? r.dayPeriod.code : null , oth: (!r.timeOfDay && !r.dayPeriod) ? r.administratedQuantity : null}))
              })
          }

          if(regimens[4].length > 0){
              regimensTableByDayPeriod.betweenBAndL.push({
                  medication : medication,
                  regimens: _.uniq(regimens[4]),
                  before: [],
                  during: regimens[4],
                  after: [],
                  times: regimens[4].map(r => ({tod: r.timeOfDay && r.timeOfDay !== "" ? r.timeOfDay : null, pc: r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code !== "" ? r.dayPeriod.code : null , oth: (!r.timeOfDay && !r.dayPeriod) ? r.administratedQuantity : null}))
              })
          }

          if(_(_.concat(regimens[5], regimens[6], regimens[7])).compact().uniq().value().length > 0){
              regimensTableByDayPeriod.lunch.push({
                  medication : medication,
                  regimens: _(_.concat(regimens[5], regimens[6], regimens[7])).compact().uniq().value(),
                  before: regimens[5],
                  during: regimens[6],
                  after: regimens[7],
                  times: _(_.concat(regimens[5], regimens[6], regimens[7])).compact().uniq().value().map(r => ({tod: r.timeOfDay && r.timeOfDay !== "" ? r.timeOfDay : null, pc: r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code !== "" ? r.dayPeriod.code : null , oth: (!r.timeOfDay && !r.dayPeriod) ? r.administratedQuantity : null}))
              })
          }

          if(regimens[8].length > 0){
              regimensTableByDayPeriod.betweenLAndD.push({
                  medication : medication,
                  regimens: _.uniq(regimens[8]),
                  before: [],
                  during: regimens[8],
                  after: [],
                  times: regimens[8].map(r => ({tod: r.timeOfDay && r.timeOfDay !== "" ? r.timeOfDay : null, pc: r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code !== "" ? r.dayPeriod.code : null , oth: (!r.timeOfDay && !r.dayPeriod) ? r.administratedQuantity : null}))
              })
          }

          if((_(_.concat(regimens[9], regimens[10], regimens[11])).compact().uniq().value()).length > 0){
              regimensTableByDayPeriod.dinner.push({
                  medication : medication,
                  regimens: _(_.concat(regimens[9], regimens[10], regimens[11])).compact().uniq().value(),
                  before: regimens[9],
                  during: regimens[10],
                  after: regimens[11],
                  times: _(_.concat(regimens[9], regimens[10], regimens[11])).compact().uniq().value().map(r => ({tod: r.timeOfDay && r.timeOfDay !== "" ? r.timeOfDay : null, pc: r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code !== "" ? r.dayPeriod.code : null , oth: (!r.timeOfDay && !r.dayPeriod) ? r.administratedQuantity : null}))
              })
          }

          if(regimens[12].length > 0){
              regimensTableByDayPeriod.night.push({
                  medication : medication,
                  regimens: _.uniq(regimens[12]),
                  before: [],
                  during: regimens[12],
                  after: [],
                  times: regimens[12].map(r => ({tod: r.timeOfDay && r.timeOfDay !== "" ? r.timeOfDay : null, pc: r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code !== "" ? r.dayPeriod.code : null , oth: (!r.timeOfDay && !r.dayPeriod) ? r.administratedQuantity : null}))
              })
          }

      })

      const beforeBreak = {
          title: this.localize("mom_wakeup", "Wake-up", this.language),
          icon: "wakeup",
          meds: regimensTableByDayPeriod.beforeBreak,
          cols: regimensTableByDayPeriod.beforeBreak.reduce((acc, med) => {
              med.times.forEach(t => {
                  if (!acc.some(col => col.tod && (col.tod === t.tod) || col.pc === t.pc)) {
                      acc.push(t)
                  }
              })
              return acc
          }, [])
      }
      const breakfast = {
          title: this.localize("mom_break", "Breakfast", this.language),
          icon: "breakfast",
          meds: regimensTableByDayPeriod.breakfast,
          cols: regimensTableByDayPeriod.breakfast.reduce((acc, med) => {
              med.times.forEach(t => {
                  if (!acc.some(col => col.tod && (col.tod === t.tod) || col.pc === t.pc)) {
                      acc.push(t)
                  }
              })
              return acc
          }, [])
      }
      const betweenBAndL = {
          title: this.localize("mom_morning", "Morning", this.language),
          icon: "morning",
          meds: regimensTableByDayPeriod.betweenBAndL,
          cols: regimensTableByDayPeriod.betweenBAndL.reduce((acc, med) => {
              med.times.forEach(t => {
                  if (!acc.some(col => col.tod && (col.tod === t.tod) || col.pc === t.pc)) {
                      acc.push(t)
                  }
              })
              return acc
          }, [])
      }
      const lunch = {
          title: this.localize("mom_lunch", "Lunch", this.language),
          icon: "lunch",
          meds: regimensTableByDayPeriod.lunch,
          cols: regimensTableByDayPeriod.lunch.reduce((acc, med) => {
              med.times.forEach(t => {
                  if (!acc.some(col => col.tod && (col.tod === t.tod) || col.pc === t.pc)) {
                      acc.push(t)
                  }
              })
              return acc
          }, [])
      }
      const betweenLAndD = {
          title: this.localize("mom_afternoon", "Afternoon", this.language),
          icon: "afternoon",
          meds: regimensTableByDayPeriod.betweenLAndD,
          cols: regimensTableByDayPeriod.betweenLAndD.reduce((acc, med) => {
              med.times.forEach(t => {
                  if (!acc.some(col => col.tod && (col.tod === t.tod) || col.pc === t.pc)) {
                      acc.push(t)
                  }
              })
              return acc
          }, [])
      }
      const dinner = {
          title: this.localize("mom_dinner", "Dinner", this.language),
          icon: "dinner",
          meds: regimensTableByDayPeriod.dinner,
          cols: regimensTableByDayPeriod.dinner.reduce((acc, med) => {
              med.times.forEach(t => {
                  if (!acc.some(col => col.tod && (col.tod === t.tod) || col.pc === t.pc)) {
                      acc.push(t)
                  }
              })
              return acc
          }, [])
      }
      const night = {
          title: this.localize("mom_bef_bed", "Before bed", this.language),
          icon: "bed",
          meds: regimensTableByDayPeriod.night,
          cols: regimensTableByDayPeriod.night.reduce((acc, med) => {
              med.times.forEach(t => {
                  if (!acc.some(col => col.tod && (col.tod === t.tod) || col.pc === t.pc)) {
                      acc.push(t)
                  }
              })
              return acc
          }, [])
      }

      const patientPlan = [beforeBreak, breakfast, betweenBAndL, lunch, betweenLAndD, dinner, night]

      this.set("patientPlan", patientPlan)
  }

  _isRegimen(meds){
      return (meds && meds.length > 0) ? true : false
  }

  _getRegimen(col, m){
      const colPeriod = col.tod || col.pc || "other"
      return m.regimens.find(r => ((r.timeOfDay && r.timeOfDay === colPeriod) || (r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code === colPeriod))) ? true : colPeriod === "other"
  }

  _getRegimenQuantity(col, m){

      const colPeriod = col.tod || col.pc || "other"
      const regimenTod = m.regimens.filter(r => ((r.timeOfDay && r.timeOfDay === colPeriod) || (r.dayPeriod && r.dayPeriod.code && r.dayPeriod.code === colPeriod)))
      let qty = 0

      if(regimenTod && regimenTod.length){
          qty = _.reduce(regimenTod, function (tot, r){
              return tot + Number(r.administratedQuantity && r.administratedQuantity.quantity)
          }, 0)
      }else{
          qty = _.reduce(m.regimens, function (tot, r){
              return tot + Number(r.administratedQuantity && r.administratedQuantity.quantity)
          }, 0)
      }

      return qty
  }

  _getHeaderTitle(col){
      return col && col.pc && !col.tod ? this.localize("ms_"+col.pc, col.pc, this.language): col && col.tod ? col.tod.toString().substr(0,2)+"h"+col.tod.toString().substr(2,2) : null
  }

  reset(){
      this.$.chapterivdialog && this.$.chapterivdialog.reset()
  }

  print() {
      const template = require(this._isEqual(this.selectedTab,1) ? "./src/medication-doctor-view-pdf-template.json" : "./src/medication-patient-view-pdf-template.json")

      let list = this.presentList
      list = list.map(l => {
          l.localizedTitle = this._localizedTitle(l)
          l.meds = l.meds.map(med => {
              med.combinedTableHeaders0 = this.combinedTableHeaders(list, 0)
              med.combinedTableHeaders4 = this.combinedTableHeaders(list, 4)
              med.combinedTableHeaders8 = this.combinedTableHeaders(list, 8)
              med.combinedTableHeaders12 = this.combinedTableHeaders(list, 12)
              med.medicationClass = this._medicationClass(med.medication)
              med.serviceDescription = this._serviceDescription(med.medication)
              med.servicePosology = this._servicePosology(med.medication)
              med.euro = this._hasValidChap4Class(med.medication)==="ok"? template.icon.euroOK : this._hasValidChap4Class(med.medication)==="pending" ? template.icon.euroPending : template.icon.euroNok
              med.getMedicationClosingDate = this._getMedicationClosingDate(med.medication)
              return med;
          })
          return l;
      })

      let patientPlan = this.patientPlan
      patientPlan = patientPlan.map(plan =>{
          plan.isRegimen = this._isRegimen(plan.meds)
          plan.cols = plan.cols.map(col =>{
              col.getHeaderTitle = this._getHeaderTitle(col)
              return col
          })
          plan.meds = plan.meds.map(m =>{
              m.serviceDescription = this._serviceDescription(m.medication);
              m.getMedIconBase64 = template.icon.medoc
              m.getMedicationClosingDate =this._getMedicationClosingDate(m.medication);
              m.serviceFrequency = this._serviceFrequency(m.medication);
              m.cols = plan.cols.map(col => {
                  col.getRegimen = this._getRegimen(col, m)
                  col.getRegimenQuantity = this._getRegimenQuantity(col, m)
                  return col;
              })
              return m
          })
          return plan;
      })
      const view = {
          hcp : {
              stylisedAdd: this._getHcpAddress(),
              stylised : this.localize("dr","Dr.")+" "+this.user.name
          },
          pharma : {
              /**@todo faire les pharma pour le mustache a imprimer*/
              stylisedAdd: "",
              stylised : ""
          },

          history : template.icon.history,
          list: list,
          patient_plan: patientPlan,
          moon : template.icon.moon,
          sun : template.icon.sun,
          localize: {
              mom_break: this.localize('mom_break', 'Breakfast'),
              mom_lunch: this.localize('mom_lunch', 'Lunch'),
              mom_dinner: this.localize('mom_dinner', 'Dinner'),
              medic: this.localize('medic', 'Medicine'),
              freq: this.localize('freq', 'Frequency'),
              mom_before: this.localize('mom_before_short', 'Before'),
              mom_during: this.localize('mom_during_short', 'During'),
              mom_after: this.localize('mom_after_short', 'After'),
              endDate: this.localize('endDate', 'End Date'),
              com: this.localize('com', 'Comments'),
              gp: "GP",
              pharmacist : this.localize("pharmacist","pharmacist"),
              add : this.localize("address","address"),
              medecine : this.localize("medic","Medicine")
          }
      }

      //type:"doc-off-format"
      this.api.pdfReport(mustache.render(template.html, view), {
          type: "rapp-mail",
          rotate : 1
      }).then(({pdf: pdfFileContent, printed: printed}) => !printed && this.api.triggerFileDownload(
          pdfFileContent,
          "application/pdf",
          _.kebabCase(_.compact([
              this._isEqual(this.selectedTab,1) ? "doctor_" : "patient_",
              "schema_medication_",
              +new Date()
          ]).join("_")) + ".pdf"
      ))
  }

  _isDisplayingPrintButton(){
      return this._isEqual(this.selectedTab,1) || this._isEqual(this.selectedTab,2)
  }

  _getHcpAddress(){
      const add = _.get(this,'hcp.addresses',[]).find(add => add==="work")
      return add ? _.get(add,"houseNumber","")+_.get(add,"postboxNumber","")+","+_.get(add,"street","")+","+_.get(add,"postalCode","")+"  "+_.get(add,"city","") : ""
  }
}

customElements.define(MedicationPlanDialog.is, MedicationPlanDialog)
