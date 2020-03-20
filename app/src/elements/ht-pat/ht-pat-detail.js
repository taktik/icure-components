/**
 @license
 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/*<link rel="import" href="dialogs/mycarenet/ht-pat-mcn-chapteriv-agreement.html">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '../filter-panel/filter-panel.js'

import '../collapse-button/collapse-button.js'
import './ht-pat-admin-card.js'
import './ht-pat-he-tree-detail.js'
import './ht-pat-he-tree-settings.js'
import './ht-pat-detail-ctc-detail-panel.js'
import '../icons/icure-icons.js'
import '../../styles/icpc-styles.js'
import '../../styles/atc-styles.js'
import '../../styles/scrollbar-style.js'
import '../ht-spinner/ht-spinner.js'
import '../print/print-document.js'
import '../dynamic-form/entity-selector.js'
import '../dynamic-form/health-problem-selector.js'
import './dialogs/ht-pat-charts-dialog.js'
import './dialogs/ht-pat-action-plan-dialog.js'
import './dialogs/ht-pat-prescription-dialog.js'
import './dialogs/ht-pat-preventive-acts-dialog.js'
import '../dynamic-form/dialogs/medication-selection-dialog.js'
import '../dynamic-form/dialogs/medications-selection-dialog.js'
import '../dynamic-form/dialogs/medication-details-dialog.js'
import '../dynamic-form/dialogs/medication-details-dialog-old.js'
import '../dynamic-form/dialogs/medication-plan-dialog.js'
import '../dynamic-form/dialogs/medication-prescription-dialog.js'
import './dialogs/ht-pat-edmg-dialog.js'
import './dialogs/hubs/ht-pat-hub-transaction-view.js'
import '../ht-msg/ht-msg-import-doc-dialog.js'
import './dialogs/hubs/ht-pat-hub-detail.js'
import './dialogs/hubs/ht-pat-hub-upload.js'
import './dialogs/hubs/ht-pat-hub-utils.js'
import './dialogs/ht-pat-fusion-dialog.js'
import './dialogs/hubs/ht-pat-hub-diary-note.js'
import './dialogs/ht-pat-patientwill-dialog.js'
import './dialogs/hubs/ht-pat-hub-sumehr-preview.js'
import '../../ht-upload-dialog.js'
import './dialogs/ht-pat-vaccine-dialog.js'
import './dialogs/medicalhouse/ht-pat-flatrate-utils.js'
import './dialogs/rn-consult/ht-pat-rn-consult-dialog.js'
import './dialogs/rn-consult/ht-pat-rn-consult-history-dialog.js'
import './dialogs/ht-pat-documents-directory-dialog.js'
import '../../styles/shared-styles.js'
import '../../styles/dialog-style.js'
import '../../styles/notification-style.js'
import '../../styles/paper-input-style.js'
import '../../styles/buttons-style.js'
import '../../styles/dropdown-style.js'
import '../../styles/paper-tabs-style.js'
import './dialogs/therlink/ht-pat-therlink-detail.js'
import './dialogs/consent/ht-pat-consent-detail.js'
import './dialogs/care-path/ht-pat-care-path-detail-dialog.js'
import './dialogs/care-path/ht-pat-care-path-list-dialog.js'
import './dialogs/mda/ht-pat-member-data-detail.js'
import './dialogs/ht-pat-other-form-dialog'

import '@vaadin/vaadin-split-layout/vaadin-split-layout'
import '@polymer/paper-button/paper-button'
import '@polymer/paper-toast/paper-toast'
import '@polymer/paper-radio-button/paper-radio-button'


import moment from 'moment/src/moment'
import _ from 'lodash/lodash'
import styx from '../../../scripts/styx'
import {AccessLogDto} from "icc-api/dist/icc-api/model/AccessLogDto"

const md5 = require('md5')
import XLSX from 'xlsx'
import 'xlsx/dist/shim.min'

import {PolymerElement, html} from '@polymer/polymer'
import {TkLocalizerMixin} from "../tk-localizer"

class HtPatDetail extends TkLocalizerMixin(PolymerElement) {
    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment"></style>
        <!--suppress CssUnusedSymbol -->
        <style include="atc-styles icpc-styles scrollbar-style dialog-style buttons-style dropdown-style notification-style paper-input-style paper-tabs-style shared-styles">
            :host {
                height: 100%;
            }

            .modal-title {
                justify-content: flex-start;
            }

            .modal-title iron-icon{
                margin-right: 8px;
            }

            .container {
                width: 100%;
                height: calc(100vh - 64px - 20px);
                /* display:grid;
                grid-template-columns: 20% 20% 60%;
                grid-template-rows: 100%; */
                position: fixed;
                top: 64px;
                left: 0;
                bottom: 0;
                right: 0;
            }

            .zone {
                display: flex;
                flex-direction: column;
                height: 100%;
                position: relative;
            }

            .padding-0{
                padding:0;
            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
            }

            .extra-button {
                padding: 2px;
                height: 20px;
                width: 20px;
                border-radius: 3px;
                background: var(--app-secondary-color);
                color: var(--app-text-color-light);
                margin-right: 4px;
            }

            #first {
                height: calc(100% - 36px);
            }

            paper-fab {
                --paper-fab-mini: {
                    height: 16px;
                    width: 16px;
                    padding: 2px;
                };

                margin-right: 4px;
            }

            .first-panel{
                display: flex;
                flex-direction: column;
                height:calc(100vh - 64px - 20px); /* 64px = app-header */
                background: var(--app-background-color-dark);
                top:64px;
                left:0;
                box-shadow: var(--app-shadow-elevation-2);
                z-index:3;
                overflow:hidden;
                /*transition: .5s ease;*/
                min-width: 288px;
                max-width: 50vw;
            }

            #_contacts_listbox {
                padding: 0;
            }

            .contact-text-row p {
                padding-right: 30px;
            }

            paper-listbox{
                background:transparent;
                padding: 0;
            }

            paper-item{
                background:transparent;
                outline:0;
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

            #adminFileMenu paper-item.iron-selected {
                color:var(--app-text-color-light);
                background:var(--app-primary-color);
                @apply --text-shadow;
            }

            collapse-button {
                outline:0;
                align-items: flex-start;
                --paper-listbox-selected-item: {
                    color:var(--app-text-color-light);
                    background:var(--app-primary-color);
                }
            }

            collapse-button > .menu-item.iron-selected {
                @apply --padding-menu-item;
                color:var(--app-text-color-light);
                background:var(--app-primary-color);
                @apply --text-shadow;
            }

            .opened{
                color:var(--app-text-color);
            }

            .opened.iron-selected{
                box-shadow: 0 -2px 0 0 var(--app-primary-color),
                0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }

            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 -30px;
                padding:0;
            }

            paper-item.sublist-footer {
                height:48px;
                font-weight: normal;
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

            paper-item.list-info {
                font-weight: lighter;
                font-style: italic;
                height:48px;
            }

            .list-title {
                flex-basis: calc(100% - 72px);
                font-weight: bold;
            }

            .menu-item {
                @apply --padding-menu-item;
                height: 24px;
                min-height: 24px;
                font-size: var(--font-size-normal);
                font-weight: bold;
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



            .menu-item-icon{
                height: 20px;
                width: 20px;
                padding: 0px;
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

            .add-btn-container{
                position: relative;
                bottom: 12px;
                display:flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .new-ctc-btn-container {
                width: 100%;
                left: 0;
                position: absolute;
                bottom: 16px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }

            .add-btn{
                --paper-button-ink-color: var(--app-secondary-color-dark);
                background:var(--app-secondary-color);
                color:var(--app-text-color);
                font-weight:bold;
                font-size: var(--font-size-normal);
                height:40px;
                min-width:100px;
                @apply --shadow-elevation-2dp;
                padding: 10px 1.2em;
                text-transform: capitalize;
            }
            .patient-info-container{
                height: 72px;
                padding: 12px;
                cursor: pointer;
                box-sizing: border-box;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                overflow: hidden;
            }

            .patient-info-container:hover{
                background: var(--app-dark-color-faded);
                @apply --transition;
            }

            .patient-info{
                padding-left: 12px;
                display:flex;
                flex-direction:column;
                align-items: flex-start;
                justify-content: center;
            }
            .patient-name{
                font-weight:700;
                line-height:14px;
                font-size: var(--font-size-large);
            }
            .patient-birthdate{
                font-size: var(--font-size-normal);
                line-height: 1;
            }

            .patient-profession{
                font-size: var(--font-size-normal);
            }

            .btn-pat-close{
                position: absolute;
                left: 4px;
                top: 4px;
                background:var(--app-secondary-color);
                color:var(--app-text-color-light);
                height:20px;
                width:20px;
                z-index: 4;
            }

            .btn-pat-close:hover{
                @apply --transition;
                @apply --shadow-elevation-2dp;
            }

            .patient-picture-container {
                height: 52px;
                width: 52px;
                min-width: 52px;
                border-radius:50%;
                overflow: hidden;
            }

            .patient-picture-container img{
                width:100%;
                margin:50%;
                transform: translate(-50%,-50%);
            }

            .submenus-container{
                overflow-y: auto;
                flex-grow: 1;
            }



            [hidden] {
                display:none!important;
            }
            /* END FIRST PANEL */

            /* SECOND PANEL  */
            .second-panel{
                height: calc(100vh - 84px);
                background: var(--app-background-color);
                top:64px;
                left:20%;
                @apply --shadow-elevation-2dp;
                margin:0;
                min-width: 280px;
                z-index:2;
                overflow: initial;
                position: relative;
                top: 0;
                left: 0;
            }


            .fit-bottom{
                bottom: 80px;
                left: 0;
                width: 100%;
                height: 48px;
                z-index: 4;
                padding-right: var(--padding-right-left-32_-_padding-right);
                padding-left: var(--padding-right-left-32_-_padding-left);
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: nowrap;
                padding-top: 8px;
                margin-bottom: 20px;
                position: absolute;

            }

            .fit-bottom.open {
                opacity: 1;
                display: flex !important;
            }

            .selection-toast-button{
                height:32px;
                @apply --paper-font-button;
                text-transform:lowercase;
            }

            .selection-toast-icon{
                height:16px;
                margin-right:4px;
            }

            div.extraDialogFields {
                margin-top: 0;
            }

            .contact {
                margin: 0 24px 12px;
                background: var(--app-light-color);
                color:var(--app-text-color);
                outline:0;
                padding:0;
                align-items: flex-start !important;
                @apply --shadow-elevation-2dp;
                position:relative;
            }

            .contact.iron-selected{
                background: var(--app-primary-color);
                color:var(--app-light-color);
                @apply --text-shadow;
            }
            .contact h4{
                font-size: var(--font-size-large);
                font-weight: 600;
                margin:0;
                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */
                max-width: 95%;
                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;
            }

            .contact .contact-text-row{
                width:calc(100% - 32px);
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                @apply --padding-right-left-16;
            }

            .contact:nth-of-type(1) .contact-text-row p {
                padding-right: 32px;
            }

            .contact .contact-text-row:first-child, .contact .contact-text-row:last-child{
                height:24px;
            }
            /*.contact .contact-text-row:nth-child(2){
\t\t\t\theight:48px;
\t\t\t}*/

            .contact-text-row p {
                width: 100%;
                text-overflow: ellipsis;
                overflow-x: hidden;
                white-space: nowrap;
            }

            .contact-text-row .document {
                margin-top:10px;
            }

            .contact-text-date{
                justify-content: space-between!important;
                position: relative;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(0,0,0,.1);
                @apply --padding-right-left-16;
                color: var(--app-text-color-disabled);
                height:24px;
            }

            .contact .label-container {
                display: flex;
                flex-flow: row nowrap;
            }

            .contact label{
                font-size: var(--font-size-normal);
                font-weight: 400;
                margin:0;
                display: block;

                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;

            }

            .contact label.hcp {
                position: absolute;
                right: 16px;
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .colour-code{
                line-height: 12px;
                margin-right:4px;
                color: black;
            }

            .iron-selected .colour-code{
                color: var(--app-light-color);
            }

            .iron-selected .colour-code span{
                background: var(--app-light-color);
            }
            .colour-code:hover{
                font-weight:600;
            }

            .colour-code:hover:before{
                height:8px;
                width:8px;
                margin-bottom:0;
                border-radius:4px;
            }

            .colour-code span{
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
                background: lightgrey;
            }

            .contact .colour-code:not(:first-child) {
                margin-left: 4px;
            }

            .contact p{
                @apply --paper-font-body1;
                margin:0;
                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;
            }

            .contact-icon{
                position: absolute;
                right: 8px;
                margin: auto;
                top: 50%;
                height: 20px;
                width: 20px;
                transform: translate(0,-50%);
                color: var(--app-background-color-darker);
                padding: 0 2px;
                box-sizing: border-box;
                border-radius: 50%;
            }

            .close-ctc:hover{
                background: rgba(0, 0, 0, 0.12);
            }

            paper-material.iron-selected > .contact-icon{
                color:var(--app-text-color-light);
            }

            paper-material.iron-selected > .contact-text > .contact-text-date{
                color:var(--app-text-color-light)!important;
            }

            .current-contact {
                color:var(--app-secondary-color-dark);
                margin-bottom: 16px;
            }


            .current-contact.iron-selected{
                border-bottom:1px solid var(--app-primary-color);
            }

            .contact--big{
                min-height: 96px;
                /*@apply --padding-16;*/
                /*border-bottom: 1px solid var(--app-background-color-dark);*/
            }

            .contact--small{
                min-height: 32px;
                /*@apply --padding-right-left-16;*/
                padding-bottom: 8px;
            }

            .contact--small .contact-text-row:nth-child(2){
                justify-content: space-between;
            }

            .contact--small .contact-text-row:last-child{
                //display: none;
            }

            .contact--small .he-dots-container{
                display:none;
            }

            .he-dots-container{
                display:flex;
                flex-flow:row wrap;
                justify-content: flex-end;
            }

            .contact-year{
                display:block;
                font-size: var(--font-size-normal);
                font-weight:bold;
                padding: 12px 24px 8px;
            }

            .contact-text{
                background:transparent;
                flex-direction:column;
                justify-content: space-between;
                align-items: flex-start;
                width:100%;
                height: 100%;
                padding:0;
            }

            .contact-text:focus::before, .contact-text:focus::after{
                background:transparent;
            }

            .contacts-container{
                overflow-y: overlay;
                height: calc(100% - 80px);
                padding-bottom: 32px;
            }

            .layout.vertical {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                flex-wrap:nowrap;
            }
            .layout.vertical:hover {
                /*background: lightgreen;*/
                cursor: pointer;
            }
            .layout.vertical.iron-selected:hover {
                background: var(--app-primary-color);
                cursor: initial;
            }

            .todo-list{
                border: 1px dashed rgba(0,0,0,.1);
                margin: 0 24px;
                border-radius: 4px;
                max-height: 128px;
                overflow: auto;
                padding: 4px 0;
            }

            .todo-item{
                font-size: var(--font-size-normal);
                --paper-item-min-height: 24px;
                color: var(--app-text-color);
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-between;
                padding-left: 8px;
                height: 24px;
            }

            .todo-item h4{
                margin:0;
                max-width: calc( 100% - 52px );
                text-overflow: ellipsis;
                overflow-x: hidden;
                white-space: nowrap;
                user-select: none;
            }

            .todo-due-date{
                font-size: var(--font-size-normal);
                font-weight:300;
                margin-right:4px;
            }

            .todo-actions {
                background: transparent;
                border-radius: 14px;
                display:inline-flex;
                flex-flow: row-reverse nowrap;
                justify-content: space-between;
                align-items: center;
                padding: 2px;
                width: 24px;
                height: 24px;
                overflow: hidden;
                transition: width .42s cubic-bezier(0.075, 0.82, 0.165, 1);
                cursor: pointer;
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

            .todo-actions.open {
                min-width: 90px;
                background: var(--app-background-color-dark)
            }

            .he-edit-btn-dark{
                color: var(--app-text-color);
                --paper-ink-color:var(--app-text-color);
            }

            .iron-selected .he-edit-btn{
                color: var(--app-text-color-light);
            }

            .todo-item--late{
                color:var(--paper-red-500)
            }
            /* END SECOND PANEL */

            .second-third-panel{
                height: calc(100vh - 84px);
                background: var(--app-background-color);
                top: 64px;
                left: 20%;
                margin: 0;
                min-width: 280px;
                z-index: 2;
                overflow: initial;
                position: relative;
                top: 0;
                left: 0;
            }

            ht-pat-detail-ctc-detail-panel {
                height: calc(100vh - 84px);
                overflow: hidden;
            }

            .statusContainer {
                display:inline-flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 16px;
                overflow: hidden;
            }

            #insuranceStatus, #hubStatus, #tlStatus, #consentStatus, #edmgStatus, #ebmPracticeNet, #cbipLink, #rnConsult, #sumehrStatus  {
                --paper-fab-background: var(--app-background-color-dark);
                --paper-fab-keyboard-focus-background: var(--app-background-color);
                color: var(--app-primary-color-dark);
                box-shadow: none;
                --paper-fab-iron-icon: {
                    height:16px;
                    width:16px;
                }

            }

            .edmg-hcps {
                position: fixed;
                top: 190px;
                left: 0;
                display: flex;
                flex-direction: column;
                background: rgba(69, 90, 100,.95); /* is --app-primary-color with opacity 95% */
                color: white;
                width: calc(20% - 16px); /* 20% is first col wdth, 16px is for margins */
                padding: 16px;
                margin: 0 8px;
                z-index: 10;
                border-radius: 8px;
                box-sizing: border-box;
            }

            .edmg-hcps > p {
                font-size: 1.3em;
                margin-top: 0;
                margin-bottom: 8px;
            }
            .edmg-hcps > p > span.ul {
                text-decoration: underline;
            }
            .edmg-hcps > p > small {
                margin: 8px 4px 12px 0;
                font-size: 1em;
                padding-left: 4px;
                display: block;
            }

            #insuranceStatus.medicalHouse, #edmgStatus.edmgPending, #tlStatus.tlPending, #rnConsultStatus.rnConsultPending, #consentStatus.pendingConsent, #sumehrStatus.sumehrChange, #mdaStatus.medicalHouse{
                --paper-fab-background: var(--app-status-color-pending);
            }

            #insuranceStatus.noInsurance, #hubStatus.noAccess, #tlStatus.noTl, #consentStatus.noConsent, #edmgStatus.edmgNOk, #rnConsultStatus.rnConsultNOk, #sumehrStatus.noSumehr, #mdaStatus.noInsurance{
                --paper-fab-background: var(--app-status-color-nok);
            }

            #insuranceStatus.insuranceOk, #hubStatus.accessOk, #tlStatus.tlOk, #consentStatus.consentOk, #edmgStatus.edmgOk, #rnConsultStatus.rnConsultOk, #sumehrStatus.sumehr, #mdaStatus.insuranceOk {
                --paper-fab-background: var(--app-status-color-ok);
            }

            .pendingConsent{
                --paper-fab-background: var(--app-status-color-pending)!important;
            }

            #mdaStatus{
                color: black;
            }

            #ebmPracticeNet{

            }

            #select-more-options-dialog {
                display: flex;
                flex-direction: column;
            }
            #select-more-options-dialog .buttons {
                position: relative;
            }

            #select-more-options-content {
                padding: 12px;
            }

            paper-radio-button {
                --paper-radio-button-unchecked-color: var(--app-text-color);
                --paper-radio-button-label-color: var(--app-text-color);
                --paper-radio-button-checked-color: var(--app-secondary-color);
                --paper-radio-button-checked-ink-color: var(--app-secondary-color-dark);
            }


            .display-left-menu{
                display:none;
                position: fixed;
                height: 100%;
                top: 64px;
                width: 24px;
                left: 0;
                padding: 0;
                z-index: 120;
                background: var(--app-background-color-dark);
                transform: rotate(0);
                transition: .5s ease;
                box-shadow: var(--app-shadow-elevation-1);
            }
            .display-left-menu.open{
                left: 400px;
                box-shadow: 2px 0 2px 0 rgba(0,0,0,.07),
                2px 2px 2px 0 rgba(0,0,0,.06),
                3px 1px 3px 0 rgba(0,0,0,.1);
            }

            @media screen and (max-width: 1168px) {
                .patient-info-container{
                    padding: 0;
                }
                .patient-picture-container{
                    display:none;
                }
                .btn-pat-close {
                    top: 4px;
                    left: inherit;
                    right: 4px;
                }
            }

            @media screen and (max-width:1025px){
                .container .fit-bottom{
                    left:0%!important;
                }
                .container .first-panel {
                    transform: translateX(-100%);
                }
                .container.expanded .first-panel {
                    /* width: 288px !important;
                    max-width: 288px !important; */
                    z-index: 1001;
                    transform: none;
                }
                .container.expanded .fit-bottom {
                    width:30%;
                }
                .selection-toast-button{
                    @apply --paper-font-caption;
                    text-transform:lowercase;
                }
                .second-third-panel{
                    position: fixed;
                    width: 100vw;
                }
                .display-left-menu{
                    display:inherit;
                }
                .floating-action-bar {
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100vw;
                    transform: none;
                }
            }
            @media screen and (max-width:1625px){
                .wide .first-panel {
                    min-width: 0 !important;
                    max-width: 0 !important;
                    width: 0 !important;
                }
                .wide .second-panel {
                    width: 25vw;
                }
                .wide #ctcDetailPanel {
                    width: 75vw;
                }
                .wide .container.expanded .first-panel {
                    min-width: 40vw !important;
                    max-width: 40vw !important;
                    width: 40vw !important;
                }
                .wide .container.expanded .second-panel {
                    min-width: 25vw;
                }
                .wide .container.expanded #ctcDetailPanel {
                    min-width: 50vw;
                }
                .wide .container.container .first-panel {
                    transform: translateX(-100%);
                }
                .wide .container.expanded .first-panel {
                    z-index: 1001;
                    transform: none;
                }
                .wide .selection-toast-button{
                    @apply --paper-font-caption;
                    text-transform:lowercase;
                }
                .wide .second-third-panel{
                    grid-column: 1 / span 3;
                    grid-row: 1 / 1;
                }
                .wide .display-left-menu{
                    display:inherit;
                }
                .wide .container.expanded .display-left-menu {
                    left: 40vw;
                }
            }

            @media screen and (max-width:1218px) {
                .wide .first-panel {
                    min-width: 0 !important;
                    max-width: 0 !important;
                    width: 0 !important;
                }
                .wide .second-panel {
                    width: 33vw;
                }
                .wide #ctcDetailPanel {}

            }

            @media screen and (max-width:800px){
                .contact label {
                    max-width: 40% !important;
                }
                .contact h4 {
                    max-width: 80%;
                }
                .contact .contact-text-row {
                    padding: 0 4px;
                    width: 100%;
                    box-sizing: border-box;
                }
            }

            @media screen and (max-width: 456px) {
                .contact-year {
                    display: flex;
                    flex-direction: column;
                }
                .contact-year > div {
                    text-align: center;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-around;
                }
                .container.expanded .first-panel, .wide .container.expanded .first-panel {
                    width: 70% !important;
                    max-width: 70% !important;
                    z-index: 1001;
                    transform: none;
                }
                .wide .container.expanded .display-left-menu, .container.expanded .display-left-menu{
                    left: 70%;
                }
                .btn-pat-close {
                    left: calc(70% - 24px);
                }
            }

            .extraDialogFields paper-input, .extraDialogFields tk-token-field{
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .toast-detector {
                position: relative;
                height: 48px;
                bottom:48px;
                width:100%;
            }
            #savedIndicator{
                position: fixed;
                top:50%;
                right: 0;
                z-index:1000;
                color: white;
                font-size: 13px;
                background:rgba(0,0,0,0.42);
                height: 24px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
            }
            .saved{
                animation: savedAnim 2.5s ease-in;
            }
            .saved iron-icon{
                margin-left: 4px;
                padding: 4px;
            }

            @keyframes savedAnim {
                0%{
                    width: 0;
                    opacity: 0;
                }
                20%{
                    width: 114px;
                    opacity: 1;
                }
                25%{
                    width: 96px;
                    opacity: 1;
                }
                75%{
                    width: 96px;
                    opacity: 1;
                }
                100%{
                    width: 0;
                    opacity: 0;
                }
            }

            #therLinkDialog, #hubDialog{
                width: 80%;
            }

            #therLinkDialog vaadin-grid {
                height: 320px;
            }

            div.ther-container {
                height: 469px;
                margin: 0;
                flex-grow: 1;
                margin-bottom: 60px;
                overflow-y: auto;
            }

            #therLinkDialog .buttons {
                background: white;
            }

            #transactionDialog, #genInsDialog{
                width: 60%;
                height: 340px;
            }

            #genInsDialog .genIns-info{
                margin-top:0;
                display:flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: flex-start;
            }

            #genInsDialog .genIns-info div{
                margin-right: 24px;
            }

            #genInsDialog .genIns-info div p{
                margin: 8px 0;
            }

            #genInsDialog .genIns-info div b{
                margin-right: 8px;
            }


            #transfers-list, #insurabilities-list{
                padding: 0;
                height: auto;
                margin: 0 24px 12px;
                border-bottom:0;
                max-height: 200px;
                overflow-y: auto;
            }

            #genInsDialog .request-transfert{
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                box-sizing: border-box;
                margin-bottom: 0;
                padding: 0;
            }

            #genInsDialog .request-transfert .buttons {
                right: 24px;
                position: initial;
            }

            #genInsDialog .request-transfert vaadin-date-picker#picker {
                margin-right: 8px;
                padding-top: 0;
            }

            #genInsDialog .request-transfert paper-button.action[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            #genInsDialog a {
                text-decoration: none;
                color:\tvar(--app-secondary-color);
            }

            #therLinkDialog .content, #consentDialog .content, #genInsDialog .content {
                padding: 0 12px;
            }

            #therLinkDialog paper-input, #consentDialog paper-input {
                margin-bottom: 12px;
            }

            #kmehr_slot{
                overflow-y: scroll;
                height: 90%;
            }

            paper-tooltip{
                --paper-tooltip-delay-in:100;
            }

            .history{
                height: 48px;
                width: calc(100% - 48px);
                color: var(--app-text-color);
                background-color: var(--app-background-color-dark);
                padding: 0 24px;
                font-weight: 700;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
            }

            .history-icon {
                height: 24px;
                width: 24px;
                opacity: .5;
            }

            .history-txt {
                padding-left: 8px;
            }


            #consentDialog {
                max-width: 50vw !important;
                left: 50% !important;
                transform: translateX(-50%);
                height: 45%;
            }

            ht-spinner {
                margin-left: 15px;
                height: 42px;
                width: 42px;
            }

            .menu-item.iron-selected {
                background:var(--app-primary-color);
                color: white;
            }

            paper-item.iron-selected .he-edit-btn {
                display:inline-flex;
            }

            .he-edit-btn-container.open{
                width: 90px;
                display:inline-flex;
                flex-flow: row-reverse nowrap;
            }


            .he-edit-btn{
                height: 14px;
                width: 14px;
                padding: 1px;
                color: var(--app-text-color-light);
                margin-right: 2px;
                margin-left: 2px;
                --paper-ink-color:var(--app-text-color-light);
                box-sizing: border-box;
                display: none;
            }

            .he-edit-btn-dark{
                color: var(--app-text-color);
                --paper-ink-color:var(--app-text-color);
            }

            .icon-prof{
                height: 14px;
                width: 14px;
            }

            .icon-doc{
                height: 14px;
                width: 14px;
            }

            #legaltext{
                margin-top: 20px;
            }

            #busySpinner {
                position: absolute;
                height: 100%;
                width: 100%;
                background: rgba(255,255,255,.6);
                z-index:110;
                margin-top:0;
                top:0;
                left:0;
            }
            #busySpinnerContainer {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);
                width:80px;
                height:80px;
            }

            div.planned {
                display: flex;
            }

            .button_list_vaccine_history {
                min-width: 0;
                width: 40px;
                height: 40px;
                padding: 8px;
                box-sizing: border-box;
            }
            img.button_list_vaccine_history-img {
                width: 24px;
                height: 24px;
            }

            .table-line-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 20px;
                width: 100%;
                font-size: var(--font-size-small);
                padding-left: 12px;
                box-sizing: border-box;
                font-weight: 500;
            }

            .table-line-menu:not(.table-line-menu-top){
                font-size: var(--font-size-normal);
                padding-left: 0;
            }

            .table-line-menu div:not(:last-child){
                border-right: 1px solid var(--app-background-color-dark);
                height: 20px;
                line-height: 20px;
            }

            .table-line-menu .code {
                min-width: 40px;
                padding-right: 4px;
            }

            .table-line-menu .privacy{
                min-width: 20px;
                max-width: 20px;
                padding: 0 2px;
                box-sizing: border-box;
            }

            .code-pw{
                overflow:hidden;
                text-overflow: ellipsis;
                min-width: 120px;
                width: 120px;
                padding-left: 4px;
                padding-right: 4px;
                flex-grow: 0;
                flex-shrink: 0;
                white-space: nowrap;
            }

            .date-pw{
                overflow:hidden;
                text-overflow: ellipsis;
                min-width: 50px;
                width: 50px;
                padding-left: 4px;
                padding-right: 4px;
                flex-grow: 0;
                flex-shrink: 0;
                white-space: nowrap;
            }

            .table-line-menu .descr{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                flex-grow: 1;
                /*white-space: nowrap;*/
            }

            .descr-pw{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                flex-grow: 1;
                white-space: nowrap;
            }

            .table-line-menu .privacy {
                min-width: 20px;
                max-width: 20px;
                padding: 0 2px;
                box-sizing: border-box;
                text-align: center;
            }

            .table-line-menu .sign{
                padding-left:4px;
                padding-right:4px;
                min-width:8px;
                text-align:right;
            }

            .table-line-menu .date{
                width: 34px;
                padding-left: 4px;
                padding-right: 4px;
                text-align: center;
                flex-shrink: 0;
                flex-grow: 0;
            }

            .table-line-menu .btns{
                min-width: 44px;
                display: flex;
                height: 20px;
                align-items: center;
                justify-content: center;
            }

            .table-line-menu .bio-normal {
                font-weight: normal;
            }

            .table-line-menu .bio-sort {
                display: flex;
                flex-flow: row nowrap;
                cursor: pointer;
            }

            .table-line-menu .bio-sort-button {
                display: inline;
                position: relative;
                padding: 0px;
                margin: 0px;
                width: 16px;
                height: 16px;
            }

            .table-line-menu .bio-date {
                min-width: 60px;
                padding-left: 4px;
                padding-right: 4px;
            }

            .table-line-menu .bio-label {
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                flex-grow: 1;
                white-space: nowrap;
            }

            .table-line-menu .bio-value {
                overflow: hidden;
                min-width: 50px;
                padding-left: 4px;
                padding-right: 4px;
                white-space: nowrap;
            }

            .table-line-menu .bio-button {
                overflow: hidden;
                min-width: 24px;
                padding-left: 4px;
                padding-right: 4px;
                white-space: nowrap;
            }

            .table-line-menu .bio-button2 {
                overflow: hidden;
                min-width: 28px;
                padding-left: 4px;
                padding-right: 4px;
                white-space: nowrap;
            }

            .table-line-menu .bio-button-icon {
                height: 20px;
                width: 20px;
                padding: 0px;
            }

            .items-number {
                font-size: var(--font-size-small);
                padding: 2px;
                border-radius: 50%;
                height: 14px;
                width: 14px;
                background: var(--app-background-color-light);
                color: var(--app-text-color);
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                text-align: center;
                margin-right: 4px;
            }

            .items-number span{
                display: block;
            }
            #upload-dialog{
                width: 70%;
                height: auto;
                margin: 0;
                min-height: calc(280px + 32px + 45px + 45px);
            }

            vaadin-upload{
\t\t\t\tmargin:16px;
\t\t\t\theight: 280px;
                overflow-y: auto;
\t\t\t\tbackground: var(--app-background-color);
\t\t\t\t--vaadin-upload-buttons-primary: {
                    height: 28px;
                };
                --vaadin-upload-button-add: {
                    border: 1px solid var(--app-secondary-color);
                    color: var(--app-secondary-color);
                    background: transparent;
                    font-weight: 500;
                    font-size: var(--font-size-normal);
                    height: 28px;
                    padding: 0 12px;
                    text-transform: capitalize;
                    background: transparent;
                    box-sizing: border-box;
                    border-radius: 3px;
                };
\t\t\t\t--vaadin-upload-file-progress: {
\t\t\t\t\t--paper-progress-active-color:var(--app-secondary-color);
\t\t\t\t};
\t\t\t\t--vaadin-upload-file-commands: {
\t\t\t\t\tcolor: var(--app-primary-color);
\t\t\t\t}

\t\t\t}

            #pat-admin-card{
                overflow-y: initial;
                overflow-x: auto;
            }

            .loadingContainer, .loadingContainerSmall {
                position:absolute;
                width: 100%;
                height: 100%;
                top: 0;left: 0;
                background-color: rgba(0,0,0,.3);
                z-index: 10;
                text-align: center;
            }

            .loadingContentContainer, .loadingContentContainerSmall {
                position:relative;
                width: 100px;
                height: 110px;
                background-color: #ffffff;
                padding:10px;
                border:1px solid var(--app-secondary-color);
                margin:40px auto 0 auto;
                text-align: center;
            }

            .loadingContentContainerSmall {
                width: 250px;
                min-height: 1px;
            }

            .document-title {
                display: block;
                font-size: var(--font-size-normal);
                font-weight: normal;
            }
            .document-data {
                font-size: var(--font-size-small);
                line-height: normal;
            }

            #more-options-container {
                margin-top: 0px;
                background: #fff;
                position: relative;
            }

            #ssinHistory{

            }

            .contact-actions {
                display:inline-flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-around;
                height:48px;
                padding: 0 4px;
                background: var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-darker);
                border-bottom: 1px solid var(--app-background-color-darker);
            }

            .contact-actions div{
                height: 28px;
            }

            .contact-actions.mobile span{
                display: none;
            }

            .contact-actions.mobile paper-button{
                min-width: 0;
            }

            .contact-actions paper-icon-button {
                margin: 0 4px;
            }

            .horizontal{
                display: flex;
                flex-flow: row nowrap;
                flex-direction: row;
                flex-basis: 100%;
            }

            #contactFilterPanel{
                flex-grow: 1;
                flex-shrink: 1;
                width: 0;
            }

            .ctc-info-icon{
                height: 12px;
                width: 12px;
                position: absolute;
                right: 3px;
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

            paper-menu-button paper-listbox{
                padding: 2px;
                overflow: hidden;
            }

            paper-menu-button paper-listbox paper-item{
                min-height: 20px;
                height: 20px;
                font-size: var(--font-size-normal);
                color: var(--app-text-color);
                padding: 0 8px;
            }
            paper-menu-button paper-listbox paper-item:hover{
                background: var(--app-background-color);
            }

            .exclude{
                text-decoration: line-through;
            }

            .confirmDeleteServiceDialog {
                height: 200px;
                width: 400px;
                z-index: 3000;
            }

        </style>

        <template is="dom-if" if="[[_bodyOverlay]]">
<!--            <div class="loadingContainer"></div>-->
        </template>

        <ht-pat-fusion-dialog id="fusion-dialog" api="[[api]]" language="[[language]]" user="[[user]]" i18n="[[i18n]]" resources="[[resources]]" on-patient-merged="_patientMerged"></ht-pat-fusion-dialog>

        <div class\$="[[wideClass(user.rev)]]">
        <div class="container">
            <template is="dom-if" if="[[SpinnerActive]]">
                <div class="loadingContainer">
                    <div class="loadingContentContainer">
                        <div style="max-width:60px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner></div>
                    </div>
                </div>
            </template>

            <ht-upload-dialog id="upload-dialog" api="[[api]]" i18n="[[i18n]]" user="[[user]]" language="[[language]]" resources="[[resources]]" patient-disabled="" patient="[[patient]]" on-save-documents="_saveDocuments" on-error-message="_handleError" on-post-process="_postProcess">
            </ht-upload-dialog>

            <paper-item id="postit-notification" class="notification-container dark">
                <iron-icon class="notification-icn" icon="vaadin:edit"></iron-icon>
                <div class="notification-msg">
                    <h4>[[localize('postit','Post-it',language)]]</h4>
                    <p>[[postitMsg]]</p>
                </div>
                <paper-button name="closePostit" class="notification-btn" on-tap="closePostit">
                   [[localize('clo','Close',language)]]
                </paper-button>
                <paper-button name="editPostit" class="notification-btn" on-tap="editPostit">
                    [[localize('edi','Edit',language)]]
                </paper-button>
            </paper-item>

            <paper-item id="flatrate-notification" class="notification-container error" style="top:148px; height: 168px; grid-template-rows: 28px 140px;">
                <iron-icon class="notification-icn" icon="vaadin:exclamation" style="grid-row: 1 / span 1;"></iron-icon>
                <div class="notification-msg" style="place-self: start;">
                    <h4>[[localize('flatrate-err','Flatrate info',language)]]</h4>
                    <p>[[flatrateMsg]]</p>
                </div>
                <paper-button name="closeFlatrateMsg" class="notification-btn single-btn" on-tap="closeFlatrateMsg">
                    [[localize('clo','Close',language)]]
                </paper-button>
            </paper-item>

            <paper-item id="ehealth-notification" class="notification-container error">
                <iron-icon class="notification-icn" icon="vaadin:exclamation"></iron-icon>
                <div class="notification-msg">
                    <h4>E-health</h4>
                    <p>[[localize('notConnectedToeHealth', 'You are not connected ehealth', language)]]</p>
                </div>
                <paper-button name="closePostit" class="notification-btn single-btn" on-tap="_closeEhealthErrorNotification">
                    [[localize('clo','Close',language)]]
                </paper-button>
            </paper-item>

            <paper-item id="consent-notification" class="notification-container error">
                <iron-icon class="notification-icn" icon="vaadin:exclamation"></iron-icon>
                <div class="notification-msg">
                    <h4>[[localize('pat_hub_cons', 'Patient consent', language)]]</h4>
                    <p>[[localize('noConsent', "You don't have consent with patient", language)]]</p>
                </div>
                <paper-button name="closePostit" class="notification-btn single-btn" on-tap="_closeConsentErrorNotification">
                    [[localize('clo','Close',language)]]
                </paper-button>
            </paper-item>

            <paper-item id="therLink-notification" class="notification-container error">
                <iron-icon class="notification-icn" icon="vaadin:exclamation"></iron-icon>
                <div class="notification-msg">
                    <h4>[[localize('therLink', 'Therapeutic link', language)]]</h4>
                    <p>[[localize('noTherapeuticLink', "You don't have any therapeutic link with the patient", language)]]</p>
                </div>
                <paper-button name="closePostit" class="notification-btn single-btn" on-tap="_closeConsentErrorNotification">
                    [[localize('clo','Close',language)]]
                </paper-button>
            </paper-item>

            <paper-item id="savedIndicator">[[localize('sav','SAVED',language)]]
                <iron-icon icon="icons:check"></iron-icon>
            </paper-item>
            <template is="dom-if" if="[[!leftMenuOpen]]">
                <paper-icon-button class="display-left-menu" icon="chevron-right" on-tap="_expandColumn"></paper-icon-button>
            </template>
            <template is="dom-if" if="[[leftMenuOpen]]">
                <paper-icon-button class="display-left-menu open" icon="chevron-left" on-tap="_closeColumn"></paper-icon-button>
            </template>
            <paper-tooltip for="pat-close" position="right">[[localize('back_to_pat_list','Back to patients list',language)]]</paper-tooltip>
            <vaadin-split-layout on-splitter-dragend="_colSizeChanged">
                <div class="first-panel">
                    <paper-material class="zone compact-menu">
                        <paper-listbox class="padding-0" id="adminFileMenu" selected="{{selectedAdminOrCompleteFileIndex}}" selectable="paper-item">
                            <paper-fab id="pat-close" class="btn-pat-close" mini icon="close" on-tap="close"></paper-fab>
                            <paper-item id="_admin_info" class="patient-info-container" on-tap="_expandColumn">
                                <div class="patient-picture-container"><img src\$="[[picture(patient,patient.picture)]]"></div>
                                <div class="patient-info">
                                    <div class="patient-name">[[getGender(patient.gender)]] [[patient.firstName]] [[patient.lastName]] [[orphans]]</div>
                                    <div class="patient-birthdate">°[[_timeFormat(patient.dateOfBirth)]] °[[_ageFormat(patient.dateOfBirth)]] [[patient.profession]]</div>
                                    <div class="statusContainer">
                                        <template is="dom-if" if="[[_isAvailableForHcp(hcpType, 'insurability')]]">
                                            <paper-fab id="insuranceStatus" mini icon="vaadin:umbrella" on-tap="_openGenInsDialog"></paper-fab>
                                            <paper-tooltip position="top" for="insuranceStatus">[[localize('gen_ins','assurability',language)]]</paper-tooltip>
                                        </template>
                                        <template is="dom-if" if="[[_isAvailableForHcp(hcpType, 'mda')]]">
                                            <paper-fab id="mdaStatus" mini icon="vaadin:male" on-tap="_openMdaDialog"></paper-fab>
                                            <paper-tooltip for="mdaStatus">[[localize('mda-data','Member data',language)]]</paper-tooltip>
                                        </template>
                                        <template is="dom-if" if="[[_isAvailableForHcp(hcpType, 'consent')]]">
                                            <paper-fab id="consentStatus" mini icon="icons:thumb-up" on-tap="_openConsentDialog"></paper-fab>
                                            <paper-tooltip position="top" for="consentStatus">[[localize('consent','consent',language)]]</paper-tooltip>
                                        </template>
                                        <template is="dom-if" if="[[_isAvailableForHcp(hcpType, 'therLink')]]">
                                            <paper-fab id="tlStatus" mini icon="vaadin:specialist" on-tap="_openTherLinkDialog"></paper-fab>
                                            <paper-tooltip position="top" for="tlStatus">[[localize('tl','therapeutic link',language)]]</paper-tooltip>
                                        </template>
                                        <template is="dom-if" if="[[_isAvailableForHcp(hcpType, 'hub')]]">
                                            <paper-fab id="hubStatus" mini icon="hardware:device-hub" on-tap="_openHubDialog"></paper-fab>
                                            <paper-tooltip position="top" for="hubStatus">Hub</paper-tooltip>
                                            <paper-fab id="sumehrStatus" mini icon="editor:format-list-bulleted" on-tap="_openHubDialogDirectToUpload"></paper-fab>
                                            <paper-tooltip position="top" for="sumehrStatus">[[sumehrStatusDesc]]</paper-tooltip>
                                        </template>
                                        <template is="dom-if" if="[[_isAvailableForHcp(hcpType, 'edmg')]]">
                                            <paper-fab id="edmgStatus" mini icon="vaadin:clipboard-pulse" on-tap="_openEdmgDialog"></paper-fab>
                                            <paper-tooltip position="top" for="edmgStatus">[[localize('edmg','e-DMG',language)]]
                                                <template is="dom-if" if="[[refPeriods.length]]">
                                                    <div class="edmg-hcps">
                                                        <template is="dom-repeat" items="[[_myReferralPeriods(patient.patientHealthCareParties)]]">
                                                            <p><span class="ul">[[localize('begin','Begin',language)]]: <b>[[_dateFormat(item.startDate)]]</b> - [[localize('end','End',language)]]: <b>[[_dateFormat(item.endDate)]]</b></span>
                                                                <template is="dom-if" if="[[item.comment.length]]"><br/><small>[[item.comment]]</small></template>
                                                            </p>
                                                        </template>
                                                    </div>
                                                </template>
                                            </paper-tooltip>
                                        </template>                                        
                                        <paper-fab id="ebmPracticeNet" mini on-tap="_linkToEbPracticeNet" src="[[_ebmPicture()]]"></paper-fab>
                                        <paper-tooltip position="top" for="ebmPracticeNet">[[localize('adm_ebm','ebmPracticeNet',language)]]</paper-tooltip>
                                        <paper-fab id="cbipLink" mini on-tap="_linkToCBIP" src="[[_cbipPicture()]]"></paper-fab>
                                        <paper-tooltip position="top" for="cbipLink">[[localize('cbip','CBIP',language)]]</paper-tooltip>
                                        <template is="dom-if" if="[[_isAvailableForHcp(hcpType, 'rnConsult')]]">
                                            <paper-fab id="rnConsultStatus" mini on-tap="_openRnConsultDialog" src="[[_rnConsultPicture()]]"></paper-fab>
                                            <paper-tooltip position="top" for="rnConsultStatus">[[localize('rn-consult','Rn consult',language)]]</paper-tooltip>
                                        </template>
                                    </div>
                                </div>
                            </paper-item>
                            <paper-item class="menu-item" id="_complete_file" on-tap="_expandColumn">[[localize('com_fil','Complete file',language)]]<div><paper-icon-button class="menu-item-icon menu-item-icon--add" icon="icons:add" on-tap="_addHealthElement"></paper-icon-button><iron-icon class="menu-item-icon" icon="icons:arrow-forward"></iron-icon></div></paper-item>
                        </paper-listbox>
                        <div class="submenus-container">

                            <collapse-button id="cb_ahelb">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_active_hes" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('act_hea_pro','Active Health Problems',language)]]</span></div>
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[activeHealthElements.length]]">
                                            <div class="items-number"><span>[[activeHealthElements.length]]</span></div>
                                        </template>
                                        <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_ahelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu" hover="none"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="ahelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi toggle-shift on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!activeHealthElements.length]]">
                                        <paper-item class="menu-item  list-info"><div class="one-line-menu">[[localize('no_act_hea_ele','No active health elements',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="privacy">C</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template id="activeHesDomRepeat" is="dom-repeat" items="[[_filterElements(activeHealthElements,cb_ahelb_sort,cb_ahelb_showInactive)]]" as="he">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" hcp="[[globalHcp]]" user="[[user]]" resources="[[resources]]" refresher="[[refresher]]" contacts="[[getContacts(refresher)]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[_isItemInArray(he,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate" on-show-linked-procedures="_showLinkedProcedures"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[activeHealthElements.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_hea_ele','Add health element',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_ihelb">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_inactive_hes" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('med_ant','Medical antecedents',language)]]</span></div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_ihelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[inactiveHealthElements.length]]">
                                            <div class="items-number"><span>[[inactiveHealthElements.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="ihelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi toggle-shift on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!inactiveHealthElements.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_med_ant','No medical antecedent',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="privacy">C</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template id="inactiveHesDomRepeat" is="dom-repeat" items="[[_filterElements(inactiveHealthElements,cb_ihelb_sort,cb_ihelb_showInactive)]]" as="he">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" hcp="[[globalHcp]]" user="[[user]]" resources="[[resources]]" refresher="[[refresher]]" contacts="[[getContacts(refresher)]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[_isItemInArray(he,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[inactiveHealthElements.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_med_ant','Add medical antecedent',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_ishelb">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_surgical_hes" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('surg','Surgical',language)]]</span></div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_ishelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[surgicalHealthElements.length]]">
                                            <div class="items-number"><span>[[surgicalHealthElements.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="suhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi toggle-shift on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!surgicalHealthElements.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_sur_hea_ele','No surgical history',language)]]</div></paper-item><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement" data-tags="CD-ITEM|surgery|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="privacy">C</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template id="surgicalHesDomRepeat" is="dom-repeat" items="[[_filterElements(surgicalHealthElements,cb_ishelb_sort,cb_ishelb_showInactive)]]" as="he">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" hcp="[[globalHcp]]" user="[[user]]" resources="[[resources]]" refresher="[[refresher]]" contacts="[[getContacts(refresher)]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[_isItemInArray(he,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[surgicalHealthElements.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_fam_ris','Add surgical history',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addInactiveHealthElement" data-label="Surgery" data-tags="CD-ITEM|surgery|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_frhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_familyrisks" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('fam_ris','Family risks',language)]]</div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_frhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[familyrisks.length]]">
                                            <div class="items-number"><span>[[familyrisks.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="frhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi toggle-shift on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!familyrisks.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_fam_ris','No family risks',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Family risk" data-tags="CD-ITEM|familyrisk|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="privacy">C</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template is="dom-repeat" items="[[_filterElements(familyrisks, cb_frhelb_sort, cb_frhelb_showInactive)]]" as="risk">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" hcp="[[globalHcp]]" user="[[user]]" resources="[[resources]]" refresher="[[refresher]]" contacts="[[getContacts(refresher)]]" id="[[getHeId(risk)]]" he="[[risk]]" family-links="[[familyLinks]]" selected="[[_isItemInArray(risk,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[familyrisks.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_fam_ris','Add family risk',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Family risk" data-tags="CD-ITEM|familyrisk|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_rhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_risks" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('ris','Risks',language)]]</div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_rhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[risks.length]]">
                                            <div class="items-number"><span>[[risks.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="rhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi toggle-shift on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!risks.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_ris','No risks',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Risks" data-tags="CD-ITEM|risk|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="privacy">C</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template is="dom-repeat" items="[[_filterElements(risks, cb_rhelb_sort, cb_rhelb_showInactive)]]" as="risk">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" hcp="[[globalHcp]]" user="[[user]]" resources="[[resources]]" refresher="[[refresher]]" contacts="[[getContacts(refresher)]]" id="[[getHeId(risk)]]" he="[[risk]]" selected="[[_isItemInArray(risk,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[risks.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_ris','Add risk',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Risks" data-tags="CD-ITEM|risk|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_alhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_allergies" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('aller','Allergies',language)]] [[localize('and','and',language)]] [[localize('intolerances','intolerances',language)]]</div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_alhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[allergies.length]]">
                                            <div class="items-number"><span>[[allergies.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="alhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi toggle-shift on-selected-items-changed="selectedMainElementItemsChanged">
                                    <!-- <template is="dom-if" if="[[!allergies.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_all','No allergies',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Allergies" data-tags="CD-ITEM|allergy|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="privacy">C</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template is="dom-repeat" items="[[_filterElements(allergies, cb_alhelb_sort, cb_alhelb_showInactive)]]" as="allergy">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" hcp="[[globalHcp]]" user="[[user]]" resources="[[resources]]" refresher="[[refresher]]" contacts="[[getContacts(refresher)]]" id="[[getHeId(allergy)]]" he="[[allergy]]" selected="[[_isItemInArray(allergy,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                    <!-- <template is="dom-if" if="[[allergies.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_all','Add allergy',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addHealthElement" data-label="Allergies" data-tags="CD-ITEM|allergy|1.0"></paper-icon-button></paper-item>
                                    </template> -->
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_gmhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_medications" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('med','Medication',language)]]</div>
                                    <paper-tooltip position="left" offset="-1" for="med-edit-btn-plan">[[localize('med_plan','Medication Plan',language)]]</paper-tooltip>
                                    <div style="display: flex; align-items: center;">
                                        <paper-icon-button id="med-edit-btn-plan" class="extra-button" icon="icons:assignment" on-tap="_medicationPlan"></paper-icon-button>
                                        <template is="dom-if" if="[[_nbMedications(medications.*)]]">
                                            <div class="items-number"><span>[[_nbMedications(medications.*)]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="mhelb" class="menu-content sublist" multi toggle-shift selected-items="{{selectedMedications}}">
                                    <template is="dom-if" if="[[!_nbMedications(medications.*)]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_med','No medications',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addMedication" data-label="Medications" data-tags="CD-ITEM|medication|1.0"></paper-icon-button></paper-item>
                                    </template>
                                    <div class="table-line-menu table-line-menu-top" style="padding-right: 4px;">
                                        <div class="code">ATC</div>
                                        <div class="descr">Libellé</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template is="dom-repeat" items="[[_getActiveMedications(medications.*)]]" as="medication">
                                        <paper-item class="menu-item" id="_svc_[[medication.id]]">
                                            <div class="table-line-menu">
                                                <div class="code">
                                                    <template is="dom-if" if="[[medication.colour]]">
                                                        <label class\$="colour-code [[medication.colour]]"><span></span></label>
                                                    </template>
                                                    [[getAtc(medication)]]
                                                </div>
                                                <div class="descr">[[shortMedicationDescription(medication, language)]]</div>
                                                <div class="date">[[_medicationStartDateLabel(medication)]]</div>
                                                <div class="date">[[_medicationEndDateLabel(medication)]]</div>
                                                <div class="btns">
                                                    <paper-icon-button id="med-edit-btn-edit_[[medication.id]]" class="he-edit-btn he-edit-btn-dark" icon="create" on-tap="_editMedication"></paper-icon-button>
                                                </div>
                                            </div>
                                        </paper-item>
                                    </template>
                                    <template is="dom-if" if="[[medications.length]]">
                                        <paper-item class="menu-item sublist-footer"><div class="one-line-menu">[[localize('add_med','Add medication',language)]]</div><paper-icon-button class="menu-item-icon" icon="icons:add" on-tap="_addMedication" data-label="Medications" data-tags="CD-ITEM|medication|1.0"></paper-icon-button></paper-item>
                                    </template>
                                </paper-listbox>
                            </collapse-button>

                            <collapse-button id="cb_biom">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="biometrics" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('biometrics', 'Données biométriques', language)]]</span></div>
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[biometrics.length]]">
                                            <div class="items-number"><span>[[biometrics.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu" hover="none"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox class="menu-content sublist">
                                    <div class="table-line-menu table-line-menu-top">
                                        <div id="bio-date" class="bio-sort bio-date" on-tap="_sortBy">
                                            <div style="border: 0">[[localize('dat', 'Date', language)]]</div>
                                            <template is="dom-if" if="[[_isSortedBy('bio-date', bioSort)]]">
                                                <paper-icon-button id="bioSortDate" class="bio-sort-button" icon="[[_sortIcon('bio-date', bioSort)]]" hover="none"></paper-icon-button>
                                            </template>
                                        </div>
                                        <div id="bio-label" class="bio-sort bio-label" on-tap="_sortBy">
                                            <div style="border: 0">[[localize('lab', 'Libellé', language)]]</div>
                                            <template is="dom-if" if="[[_isSortedBy('bio-label', bioSort)]]">
                                                <paper-icon-button id="bioSortLabel" class="bio-sort-button" icon="[[_sortIcon('bio-label', bioSort)]]" hover="none"></paper-icon-button>
                                            </template>
                                        </div>
                                        <div class="bio-value">[[localize('val', 'Value', language)]]</div>
                                        <div class="btns" style="min-width: 36px">&nbsp;</div>
                                    </div>
                                    <template id="biometricsList" is="dom-repeat" items="[[biometrics]]">
                                        <collapse-button>
                                            <paper-item slot="sublist-collapse-item" id="[[getHeId(he)]]" aria-selected="[[selected]]" class\$="menu-trigger menu-item [[isIronSelected(selected)]]" on-tap="select">
                                                <div class="table-line-menu">
                                                    <div class="bio-date bio-normal">[[item.dateAsString]]</div>
                                                    <div class="bio-label bio-normal">[[item.label]]</div>
                                                    <div class="bio-value bio-normal">[[item.value]]</div>
                                                    <div class="bio-button">
                                                        <paper-menu-button>
                                                            <paper-icon-button icon="icons:more-vert" slot="dropdown-trigger"></paper-icon-button>
                                                            <paper-listbox slot="dropdown-content">
                                                                <!--
                                                                <paper-item id="[[item.code]]" class="menu-item-icon" on-tap="_openChart"></paper-item>
                                                                -->
                                                                <paper-item id="[[item.code]]" on-tap="_openChart">Graphique</paper-item>
                                                            </paper-listbox>
                                                        </paper-menu-button>
                                                    </div>
                                                </div>
                                            </paper-item>
                                        </collapse-button>
                                    </template>
                                </paper-listbox>
                            </collapse-button>

                            <collapse-button id="cb_pwhelb">
                                <paper-item slot="sublist-collapse-item" id="_svc_group_allergies" class="menu-trigger menu-item">
                                    <div class="one-line-menu list-title">[[localize('patientwill','Patient will',language)]]</div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_alhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <paper-icon-button id="patientwill-edit-btn" class="extra-button" icon="vaadin:diploma" on-tap="_openPatientWillDialog"></paper-icon-button>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="pwhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail">
                                    <div class="table-line-menu table-line-menu-top" style="padding-right: 4px;">
                                        <div class="descr-pw">[[localize('nom', 'Name', language)]]</div>
                                        <div class="code-pw">[[localize('value', 'Value', language)]]</div>
                                        <div class="date-pw">[[localize('date', 'Date', language)]]</div>
                                    </div>
                                    <template is="dom-repeat" items="[[patientWillServices]]" as="patientwill">
                                        <paper-item class="menu-item" id="_svc_[[patientwill.id]]">
                                            <div class="table-line-menu">
                                                <div class="descr-pw">
                                                    [[_getPatientWillType(patientwill)]]
                                                </div>
                                                <div class="code-pw">[[_getPatientWillResponse(patientwill)]]</div>
                                                <div class="date-pw">[[_getPatientWillRegDate(patientwill)]]</div>
                                            </div>
                                        </paper-item>
                                        <paper-tooltip position="bottom-right" for="_svc_[[patientwill.id]]">[[_getPatientWillType(patientwill)]] : [[_getPatientWillResponse(patientwill)]]</paper-tooltip>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                            <collapse-button id="cb_archhelb">
                                <paper-item slot="sublist-collapse-item" class="menu-trigger menu-item" id="_ht_archived_hes" elevation="">
                                    <div class="one-line-menu list-title"><span>[[localize('arc','Archive',language)]]</span></div>
                                    <!-- <ht-pat-he-tree-settings user="[[user]]" section="cb_archhelb" on-settings-changed="_settingsChanged"></ht-pat-he-tree-settings> -->
                                    <div style="display: flex; align-items: center;">
                                        <template is="dom-if" if="[[archivedHealthElements.length]]">
                                            <div class="items-number"><span>[[archivedHealthElements.length]]</span></div>
                                        </template>
                                        <paper-icon-button class="menu-item-icon" icon="hardware:keyboard-arrow-down" on-tap="toggleMenu"></paper-icon-button>
                                    </div>
                                </paper-item>
                                <paper-listbox id="arhelb" class="menu-content sublist" selectable="ht-pat-he-tree-detail" multi toggle-shift on-selected-items-changed="selectedMainElementItemsChanged">
                                    <template is="dom-if" if="[[!archivedHealthElements.length]]">
                                        <paper-item class="menu-item list-info"><div class="one-line-menu">[[localize('no_arc_hea_ele','No archived health elements',language)]]</div></paper-item>
                                    </template>
                                    <div class="table-line-menu table-line-menu-top">
                                        <div class="code">Code</div>
                                        <div class="descr">Libellé</div>
                                        <div class="privacy">C</div>
                                        <div class="sign">S</div>
                                        <div class="date">Début</div>
                                        <div class="date">Fin</div>
                                        <div class="btns">&nbsp;</div>
                                    </div>
                                    <template id="archivedHesDomRepeat" is="dom-repeat" items="[[_filterElements(archivedHealthElements,cb_archhelb_sort)]]" as="he">
                                        <ht-pat-he-tree-detail api="[[api]]" i18n="[[i18n]]" language="[[language]]" hcp="[[globalHcp]]" user="[[user]]" resources="[[resources]]" id="[[getHeId(he)]]" he="[[he]]" selected="[[_isItemInArray(he,selectedHealthcareElements,selectedHealthcareElements.*)]]" on-selection-change="handleSelectionChange" on-edit-he="_editHealthElement" on-activate-he="_activate" on-archive-he="_archive" on-inactivate-he="_inactivate"></ht-pat-he-tree-detail>
                                    </template>
                                </paper-listbox>
                            </collapse-button>
                        </div>
                        <!--<div class="add-btn-container"><paper-button class="add-btn" on-tap="_addHealthElement">[[localize('add_heal_elem','Add Health Element',language)]]</paper-button></div>-->
                    </paper-material>
                </div>

                <vaadin-split-layout class="second-third-panel" on-splitter-dragend="_colSizeChanged">
                <template is="dom-if" if="[[!isAdminSelected(selectedAdminOrCompleteFileIndex)]]" restamp>
                        <div class="second-panel">
                            <div class="layout horizontal">
                                <div class="contact-actions">
                                    <paper-icon-button id="documentsDirectory-btn" class="button--icon-btn--other" icon="icons:folder" on-tap="_openDocumentsDirectory"></paper-icon-button>
                                    <paper-tooltip position="right" for="documentsDirectory-btn">[[localize('documentsDirectory','Documents directory',language)]]</paper-tooltip>

                                    <paper-icon-button id="exportContactListBtn" class="button--icon-btn--other" icon="icons:get-app" name="select-all" role="button" tabindex="0" animated aria-disabled="false" elevation="0" on-tap="_exportContactListAsCsv"></paper-icon-button>
                                    <paper-tooltip position="right" for="exportContactListBtn">{{localize("export","Exporter",language)}}</paper-tooltip>

                                    <paper-icon-button id="displayJournal" class="button--icon-btn--other" icon="icons:chrome-reader-mode" name="select-all" role="button" tabindex="0" animated aria-disabled="false" elevation="0" on-tap="_journal"></paper-icon-button>
                                    <paper-tooltip position="right" for="displayJournal">{{localize("tra_typ_diarynote","tra_typ_diarynote",language)}}</paper-tooltip>
                                    <paper-icon-button id="button_list_plan_of_action-eventslgt" class="button--icon-btn--other" icon="history" on-tap="showListPlanOfAction"></paper-icon-button>
                                    <paper-tooltip position="bottom" for="button_list_plan_of_action-eventslgt">[[localize('plan_of_act','Plan of action',language)]]</paper-tooltip>
                                    <paper-icon-button id="button_list_vaccine_history" class="button--icon-btn--other" icon="icure-svg-icons:syringe" on-tap="_showVaccineDialog"></paper-icon-button>
                                    <paper-tooltip position="bottom" for="button_list_vaccine_history">[[localize('vacc','Vaccination',language)]]</paper-tooltip>
                                </div>
                                <filter-panel id="contactFilterPanel" items="[[secondPanelItems]]" search-string="{{contactSearchString}}" selected-filters="{{contactFilters}}" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"></filter-panel>
                            </div>
                            <div class="contacts-container" on-scroll="openToast">
                                <paper-listbox id="_contacts_listbox" focused="" multi toggle-shift selectable="paper-material" selected-values="{{selectedContactIds}}" attr-for-selected="id">
                                    <span class="contact-year" on-click="openToast">
                                        <div>[[localize('to_do','To Do',language)]]</div>
                                        <div class="planned">

                                        </div>
                                    </span>
                                    <template is="dom-if" if="[[events.length]]">
                                        <paper-listbox id="_events_listbox" class="todo-list">
                                            <template is="dom-repeat" items="[[events]]" as="e" id="eventsList">
                                                <paper-item id="_svc_[[e.id]]" class\$="todo-item [[_lateEventCssClass(e)]]">
                                                    <h4><label class="todo-due-date">[[_dateFormat(e.valueDate)]]</label>[[shortServiceDescription(e)]]</h4>
                                                    <div class="todo-actions">
                                                        <paper-icon-button id="event-btn-edit_[[e.id]]" class="action-edit-btn" icon="create" on-tap="_toggleActionButton"></paper-icon-button>
                                                        <paper-tooltip position="left" for="event-btn-edit_[[e.id]]">[[localize('edi','Edit',language)]]</paper-tooltip>
                                                        <paper-icon-button id="event-btn-close_[[e.id]]" class="action-edit-btn hideable" icon="done" on-tap="completeEvent"></paper-icon-button>
                                                        <paper-tooltip position="left" for="event-btn-close_[[e.id]]">[[localize('arc','Archive',language)]]</paper-tooltip>
                                                        <paper-icon-button id="event-btn-done_[[e.id]]" class="action-edit-btn hideable" icon="clear" on-tap="clearEvent"></paper-icon-button>
                                                        <paper-tooltip position="left" for="event-btn-done_[[e.id]]">[[localize('mark_as_aborted','Marquer comme abandonnée',language)]]</paper-tooltip>
                                                    </div>
                                                </paper-item>
                                            </template>
                                        </paper-listbox>
                                    </template>
                                    <template is="dom-repeat" items="[[contactYears]]" as="contactYear">

                                        <span class="contact-year" on-click="openToast">
                                            [[contactYear.year]]
                                        </span>
                                        <template is="dom-repeat" id="contactsList" items="[[contactYear.contacts]]" as="contact" filter="[[contactFilter(selectedHealthcareElements, selectedHealthcareElements.*, timeSpanStart, timeSpanEnd, contactSearchString, contactFilters, contactFilters.*, currentContact,contactStatutChecked.*, contactStatusFilter, sortDirection, sortCriterion, documentType)]]" sort="compareContacts">
                                            <paper-material id="ctc_[[contact.id]]" elevation="0" class\$="layout vertical contact [[_isLatestYearContact(contactYear, contactYears)]] [[_contactClasses(contact, contact.closingDate, contact.author, contact.responsible)]]" on-click="openToast">
                                                <paper-item class="contact-text">
                                                    <div class="contact-text-row contact-text-date">
                                                        <label>[[_timeFormat(contact.openingDate, refreshServicesDescription)]] ([[_shortId(contact.id)]])</label>
                                                        <label class="hcp">[[hcp(contact)]]</label>
                                                    </div>
                                                    <div class="contact-text-row grey">
                                                        <h4>[[getTypeContact(contact,refreshServicesDescription)]]</h4>
                                                        <template is="dom-repeat" items="[[getDocumentDetails(contact, refreshServicesDescription)]]" as="document">
                                                            <p>
                                                                </p><div class="document">
                                                                <div class="document-title">
                                                                    <template is="dom-if" if="[[document.type]]">
                                                                        <b>[[document.type]]</b>:
                                                                    </template>
                                                                    [[document.name]]
                                                                </div>
                                                                    <template is="dom-if" if="[[document.created]]">
                                                                        <div class="document-data">[[localize('doc_date','Document date',language)]] : [[document.created]]</div>
                                                                    </template>
                                                                </div>
                                                            <p></p>
                                                        </template>
                                                        <template is="dom-repeat" items="[[highlightedServiceLabels(user)]]" as="label">
                                                            <p>
                                                                <template is="dom-repeat" items="[[serviceDescriptions(contact,label)]]" as="svcDesc">
                                                                    <template is="dom-if" if="[[!index]]">[[label]]:</template>
                                                                    <template is="dom-if" if="[[index]]"> ,</template>
                                                                    [[svcDesc]]
                                                                </template>
                                                            </p>
                                                        </template>
                                                        <template is="dom-repeat" items="[[contact.services]]" as="svc">
                                                            <template is="dom-if" if="[[_isFreeConsultation(svc)]]">
                                                                <div class="document-data">Consultation: [[_getFreeConsultationDescr(svc)]]</div><br>
                                                            </template>
                                                        </template>
                                                    </div>
                                                    <div class="contact-text-row label-container">
                                                        <template is="dom-repeat" items="[[contact.healthElements]]" as="he" id="contactsHes">
                                                            <label id="label_[[contact.id]]_[[getHeId(he)]]" class\$="colour-code [[he.colour]] [[_isExcluded(he)]]"><span></span>[[he.descr]]</label>
                                                            <paper-tooltip for="label_[[contact.id]]_[[getHeId(he)]]">[[he.descr]]</paper-tooltip>
                                                        </template>
                                                    </div>
                                                </paper-item>
                                                <template is="dom-if" if="[[!contact.closingDate]]">
                                                    <paper-icon-button id="close-[[contact.id]]" class="menu-item-icon contact-icon close-ctc" icon="icons:lock-open" alt="[[localize('fin_ctc','Finalize contact',language)]]" on-tap="closeContact"></paper-icon-button>
                                                    <paper-tooltip for="close-[[contact.id]]">[[localize('fin_ctc','Finalize contact',language)]]</paper-tooltip>
                                                </template>
                                                <template is="dom-if" if="[[contact.closingDate]]">
                                                    <iron-icon class="menu-item-icon contact-icon" icon="icons:lock" alt="[[localize('fin_ctc','Finalize contact',language)]]"></iron-icon>
                                                </template>
                                            </paper-material>
                                        </template>
                                    </template>
                                </paper-listbox>
                            </div>
                            <div class="toast-detector" on-mousemove="openToast"></div>
                            <paper-toast id="selectionToast" class="fit-bottom">
                                <paper-button class="selection-toast-button" name="select-today" role="button" tabindex="0" animated aria-disabled="false" elevation="0" on-tap="_selectToday">
                                    <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-today"></iron-icon>
                                    [[localize('sel_tod','Select Today',language)]]
                                </paper-button>
                                <paper-button class="selection-toast-button" name="select-six-months" role="button" tabindex="0" animated aria-disabled="false" elevation="0" on-tap="_select6Months">
                                    <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-six-months"></iron-icon>
                                    [[localize('sel_last_6_month','Last 6 Months',language)]]
                                </paper-button>
                                <paper-button class="selection-toast-button" name="select-all" role="button" tabindex="0" animated aria-disabled="false" elevation="0" on-tap="_selectAll">
                                    <iron-icon class="selection-toast-icon" icon="icure-svg-icons:select-all"></iron-icon>
                                    [[localize('sel_all','Select All',language)]]
                                </paper-button>
                                <paper-button class="selection-toast-button" name="select-all" role="button" tabindex="0" animated aria-disabled="false" elevation="0" on-tap="_selectMoreOptions">
                                    <iron-icon class="selection-toast-icon" icon="icons:add"></iron-icon>
                                    {{localize("more","More",language)}}
                                </paper-button>

                            </paper-toast>
                            <template is="dom-if" if="[[!currentContact]]">
                                <div class="new-ctc-btn-container"><paper-button class="add-btn" on-tap="newContact">[[localize('new_con','New Contact',language)]]</paper-button></div>
                            </template>
                        </div>
                        <ht-pat-detail-ctc-detail-panel id="ctcDetailPanel" contacts="[[selectedContacts]]" all-contacts="[[contacts]]" health-elements="[[healthElements]]" main-health-elements="[[_concat(activeHealthElements, allergies, risks, inactiveHealthElements, familyrisks)]]" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" current-contact="[[currentContact]]" medications="[[medications]]" hidden-sub-contacts-id="[[hiddenSubContactsId]]" services-refresher="[[servicesRefresher]]" on-refresh-contacts="_refreshContacts" on-select-current-contact="_selectCurrentContact" on-plan-action="_planAction" on-close-contact="_closeContact" on-change="formsChanged" on-must-save-contact="_saveContact" on-medications-selection="_selectMultiMedication" on-medications-validation="_medicationDetailValueChanged" on-medication-selection="_selectMedication" on-medication-detail="_medicationDetail" on-medications-detail="_medicationsDetail" contact-type-list="[[contactTypeList]]" on-contact-saved="contactChanged" on-open-charts-dialog="_openChartsDialog" on-add-other="addOther" on-add-document="_openUploadDialog" on-prescribe="_prescribe" credentials="[[credentials]]" on-write-linking-letter="writeLinkingLetter" on-reset-patient="_resetPatient" linking-letter-dialog="[[linkingLetterDialog]]" on-forward-document="_forwardDocument" on-print-document="_printDocument" global-hcp="[[globalHcp]]" all-health-elements="[[allHealthElements]]" on-trigger-out-going-doc="_newReport_v2" on-trigger-export-sumehr="_exportSumehrDialog" on-open-care-path-list="_openCarePathList" on-send-sub-form-via-emediattest="_sendSubformViaEmediattest" on-upload-document="_hubUpload">
                        </ht-pat-detail-ctc-detail-panel>
                </template>
                <template is="dom-if" if="[[isAdminSelected(selectedAdminOrCompleteFileIndex)]]">
                    <ht-pat-admin-card id="pat-admin-card" api="[[api]]" user="[[user]]" patient="{{patient}}" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" tab-index="[[adminTabIndex]]" carddata="[[cardData]]" on-card-changed="_cardChanged" on-patient-saved="_patientSaved" on-fusion-dialog-called="fusionDialogCalled" active-health-elements="[[activeHealthElements]]" inactive-health-elements="[[inactiveHealthElements]]"></ht-pat-admin-card>
                </template>
            </vaadin-split-layout>
        </vaadin-split-layout></div>
        </div>

        <health-problem-selector id="add-healthelement-dialog" api="[[api]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" data-provider="[[_healthElementsSelectorDataProvider()]]" on-entity-selected="_addedHealthElementSelected" entity-type="[[localize('hp','Health Problem',language)]]" entity="{{heEntity}}" ok-label="[[localize('cre','Create',language)]]">
            <div class="extraDialogFields" slot="suffix">

            </div>
        </health-problem-selector>

        <health-problem-selector id="edit-healthelement-dialog" api="[[api]]" i18n="[[i18n]]" resources="[[resources]]" language="[[language]]" on-open-health-problem="_composeHistory" data-provider="[[_healthElementsSelectorDataProvider()]]" on-entity-selected="_editedHealthElementSelected" entity-type="[[localize('hp','Health Problem',language)]]" entity="{{heEntity}}" ok-label="[[localize('save','Save',language)]]">
            <div class="extraDialogFields" slot="suffix">
                <div class="history">
                    <div class="history-icon">
                        <iron-icon icon="history"></iron-icon>
                    </div>
                    <div class="history-txt">
                        [[localize('his','History',language)]]
                    </div>
                </div>
                <template is="dom-repeat" items="[[historyElement]]" as="he">
                    <h4>[[he.modifiedDateAsString]] [[he.descr]]</h4>
                    <div>
                        <b>[[localize('aut','Author',language)]]:</b> [[he.responsibleHcp.firstName]] [[he.responsibleHcp.lastName]]
                    </div>
                    <div>
                        <b>[[localize('st_da','Start Date',language)]]:</b> [[he.openingDateAsString]]
                        <template is="dom-if" if="[[_checkClosingDate(he.closingDate)]]">
                            <b>[[localize('en_da','End Date',language)]]:</b> [[he.closingDateAsString]]
                        </template>

                    </div>
                    <div>
                        <template is="dom-if" if="[[_checkHeTagAvailable(he, 'CD-ITEM')]]">
                            <b>[[localize('nat','Nature',language)]]:</b> [[_getHeTags(he, 'CD-ITEM')]];
                        </template>

                        <template is="dom-if" if="[[_checkHeTagAvailable(he, 'CD-CERTAINTY')]]">
                            <b>[[localize('cert','Certainty',language)]]:</b> [[_getHeTags(he, 'CD-CERTAINTY')]];
                        </template>

                        <template is="dom-if" if="[[_checkHeTagAvailable(he, 'CD-SEVERITY')]]">
                            <b>[[localize('sev','Severity',language)]]:</b> [[_getHeTags(he, 'CD-SEVERITY')]];
                        </template>

                        <template is="dom-if" if="[[_checkHeTagAvailable(he, 'CD-TEMPORALITY')]]">
                            <b>[[localize('temp','Temporality',language)]]:</b> [[_getHeTags(he, 'CD-TEMPORALITY')]];
                        </template>

                        <template is="dom-if" if="[[_checkHeTagAvailable(he, 'CD-EXTRA-TEMPORALITY')]]">
                            <b>[[localize('ext-temp','Extra temporality',language)]]:</b> [[_getHeTags(he, 'CD-EXTRA-TEMPORALITY')]];
                        </template>

                    </div>
                </template>
            </div>
        </health-problem-selector>

        <entity-selector id="add-service-dialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[_servicesSelectorColumns()]]" data-provider="[[_servicesSelectorDataProvider(editedSvcLabel)]]" on-entity-selected="_addedOrEditedServiceSelected" entity-type="[[editedSvcLabel]]" entity="{{svcEntity}}" ok-label="[[localize('cre','Create',language)]]">
            <div class="extraDialogFields" slot="suffix">
                <paper-input label="Description" value="[[shortServiceDescription(svcEntity, language)}}" on-value-changed="_svcEntityContentChanged"></paper-input>
            </div>
        </entity-selector>

        <entity-selector id="edit-service-dialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" columns="[[_servicesSelectorColumns()]]" data-provider="[[_servicesSelectorDataProvider(editedSvcLabel)]]" on-entity-selected="_addedOrEditedServiceSelected" entity-type="[[editedSvcLabel]]" entity="{{svcEntity}}" ok-label="[[localize('modify','Modify',language)]]">
            <div class="extraDialogFields" slot="suffix">
                <paper-input label="Description" value="[[shortServiceDescription(svcEntity, language)}}" on-value-changed="_svcEntityContentChanged"></paper-input>
            </div>
        </entity-selector>

        <ht-pat-flatrate-utils id="flatrateUtils" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" no-print></ht-pat-flatrate-utils>

        <paper-dialog id="genInsDialog">
            <h2 class="modal-title">[[localize('gen_ins','General insurability',language)]]</h2>
            <div class="content">
                <div class="genIns-info">
                    <div>
                        <p><b>[[localize('ssin','SSIN',language)]]:</b> [[curGenInsResp.inss]]</p>
                        <p><b>[[localize('nam','Name',language)]]:</b> [[curGenInsResp.firstName]] [[curGenInsResp.lastName]]</p>
                        <p><b>[[localize('sex','Gender',language)]]:</b> [[localize(curGenInsResp.sex,curGenInsResp.sex,language)]]</p>
                        <p><b>[[localize('dat_of_bir','Birthdate',language)]]:</b> [[_dateFormat2(curGenInsResp.dateOfBirth,'YYYYMMDD','DD/MM/YYYY')]]</p>
                        <template is="dom-if" if="{{curGenInsResp.deceased}}"><p><b>[[localize('deceased','Deceased',language)]]:</b>[[_dateFormat2(curGenInsResp.deceased,'YYYYMMDD','DD/MM/YYYY')]]</p></template>
                        <template is="dom-if" if="{{curGenInsResp.hospitalizedInfo}}"><p><b>[[localize('hos_inf','Hospitalized',language)]]:</b>[[_formatHospitalizedInfo(curGenInsResp.hospitalizedInfo)]]</p></template>
                    </div>
                    <div>
                        <p><b>[[localize('paymentByIo','paymentByIo',language)]]:</b>[[_yesOrNo(curGenInsResp.paymentByIo)]]</p>
                        <p><b>[[localize('specialSocialCategory','specialSocialCategory',language)]]:</b>[[_yesOrNo(curGenInsResp.specialSocialCategory)]]</p>
                        <template is="dom-if" if="{{curGenInsResp.generalSituation}}"><p><b>[[localize('generalSituation','generalSituation',language)]]:</b>[[localize(curGenInsResp.generalSituation, curGenInsResp.generalSituation, language)]]</p></template>
                        <template is="dom-if" if="{{_hasErrors(curGenInsResp.errors)}}">
                            <p><b>[[localize('err','Error',language)]]:</b><br>
                                <template is="dom-repeat" items="[[curGenInsResp.errors]]" as="error">
                                    <b>[[error.code]]</b> [[_formatError(error)]]<br>
                                </template>
                            </p>
                        </template>
                        <template is="dom-if" if="{{!_hasErrors(curGenInsResp.errors)}}">
                            <p>&nbsp;</p>
                            <template is="dom-if" if="{{curGenInsResp.faultMessage}}"><p><b>[[localize('faultMessage','faultMessage',language)]]:</b>[[curGenInsResp.faultMessage]]</p></template>
                            <template is="dom-if" if="{{curGenInsResp.faultSource}}"><p><b>[[localize('faultSource','faultSource',language)]]:</b>[[curGenInsResp.faultSource]]</p></template>
                            <template is="dom-if" if="{{curGenInsResp.faultCode}}"><p><b>[[localize('faultCode','faultCode',language)]]:</b>[[curGenInsResp.faultCode]]</p></template>
                        </template>
                        <p></p>
                    </div>
                </div>
                <div>
                    <template is="dom-if" if="{{curGenInsResp.medicalHouseInfo}}">
                        <p><b>[[localize('mmh_inf','Medical House',language)]]:</b></p>
                        <p><b>[[localize('per_sta','Start',language)]]:</b> [[_dateFormat2(curGenInsResp.medicalHouseInfo.periodStart, 'YYYYMMDD', 'DD/MM/YYYY')]]</p>
                        <p><b>[[localize('per_end','End',language)]]:</b> [[dateFormat2(curGenInsResp.medicalHouseInfo.periodEnd, 'YYYYMMDD', 'DD/MM/YYYY')]]</p>
                        <template is="dom-if" if="{{curGenInsResp.medicalHouseInfo.medical}}">
                            <p><b>[[localize('abo_med','Doctor',language)]]:</b> [[_trueOrUnknown(curGenInsResp.medicalHouseInfo.medical)]]</p>
                        </template>
                        <template is="dom-if" if="{{curGenInsResp.medicalHouseInfo.nurse}}">
                            <p><b>[[localize('abo_nur','Nurse',language)]]:</b> [[_trueOrUnknown(curGenInsResp.medicalHouseInfo.nurse)]]</p>
                        </template>
                        <template is="dom-if" if="{{curGenInsResp.medicalHouseInfo.kine}}">
                            <p><b>[[localize('abo_kin','Kine',language)]]:</b> [[_trueOrUnknown(curGenInsResp.medicalHouseInfo.kine)]]</p>
                        </template>
                    </template>
                </div>

                <vaadin-grid id="insurabilities-list" class="material" overflow="bottom" items="[[curGenInsResp.insurabilities]]" active-item="{{selectedInsurability}}">
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="mut">[[localize('mut','Mut. (Membership Nr)',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.mutuality]] ([[item.regNrWithMut]]) </div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="periodStart">[[localize('per_sta','Start',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_dateFormat2(item.period.periodStart,'YYYYMMDD','DD/MM/YYYY')]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="periodEnd">[[localize('per_end','End',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_dateFormat2(item.period.periodEnd,'YYYYMMDD','DD/MM/YYYY')]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="periodCT12">[[localize('ct12','CT1/2',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.ct1]]/[[item.ct2]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="elevated">[[localize('ele','Elevated',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_isElevated(item.ct1)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="paymentApproval">[[localize('pay_app','paymentApproval',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.paymentApproval]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column>
                        <template class="header">
                            <vaadin-grid-sorter path="insurabilityDate">[[localize('ins_dat','insurabilityDate',language)]]</vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_dateFormat2(item.insurabilityDate,'YYYYMMDD','DD/MM/YYYY')]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
                <template is="dom-if" if="{{_hasTransfers(curGenInsResp)}}">
                    <vaadin-grid id="transfers-list" class="material" overflow="bottom" items="[[curGenInsResp.transfers]]" active-item="{{selectedTransfer}}">
                        <vaadin-grid-column>
                            <template class="header">
                                <vaadin-grid-sorter path="direction">[[localize('tra_dir','Direction',language)]]</vaadin-grid-sorter>
                            </template>
                            <template>
                                <div class="cell frozen">[[localize(item.direction,item.direction,language)]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column>
                            <template class="header">
                                <vaadin-grid-sorter path="io">[[localize('tra_io','IO',language)]]</vaadin-grid-sorter>
                            </template>
                            <template>
                                <div class="cell frozen">[[item.io]]</div>
                            </template>
                        </vaadin-grid-column>
                        <vaadin-grid-column>
                            <template class="header">
                                <vaadin-grid-sorter path="date">[[localize('tra_dat','Date',language)]]</vaadin-grid-sorter>
                            </template>
                            <template>
                                <div class="cell frozen">[[_dateFormat2(item.date,'YYYYMMDD','DD/MM/YYYY')]]</div>
                            </template>
                        </vaadin-grid-column>
                    </vaadin-grid>
                </template>

                <div class="request-transfert">
                    <template is="dom-if" if="{{!hasTokenMH}}">
                        <vaadin-date-picker id="picker" label="[[localize('req_dat','Request date',language)]]" value="{{genInsDateFrom}}" i18n="[[i18n]]"></vaadin-date-picker>
                        <vaadin-checkbox checked="{{genInsHospitalized}}">[[localize('pat_hos','Hospitalized',language)]]</vaadin-checkbox>
                        <ht-spinner active="[[isLoading]]"></ht-spinner>
                    </template>
                    <template is="dom-if" if="{{hasTokenMH}}">
                        <vaadin-date-picker label="[[localize('req_dat','Request date',language)]]" value="{{genInsDateFrom}}" i18n="[[i18n]]"></vaadin-date-picker>
                        <vaadin-date-picker label="[[localize('endDate','End date',language)]]" value="{{genInsDateTo}}" i18n="[[i18n]]"></vaadin-date-picker>
                        <vaadin-checkbox checked="{{genInsHospitalized}}">[[localize('pat_hos','Hospitalized',language)]]</vaadin-checkbox>
                        <ht-spinner active="[[isLoading]]"></ht-spinner>
                    </template>
                </div>

            <!--div class="buttons">
				<vaadin-checkbox id="switchBox" on-checked-changed="_switchTest" checked="{{showGeninsTest}}" id="testgenins">[[localize('tst','Test',language)]]</vaadin-checkbox>
			</div>
			<div id="geninstest" style="display: none">
				<paper-input id="genInsNiss" label="[[localize('niss','NISS',language)]]" value="{{genInsNiss}}"></paper-input>
				<paper-input id="genInsOA" label="[[localize('OA','Mut',language)]]" value="{{genInsOA}}"></paper-input>
				<paper-input id="genInsAFF" label="[[localize('AFF','Membership Nr',language)]]" value="{{genInsAFF}}"></paper-input>
			</div-->
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
                <paper-button class="button button--other" on-tap="_importGenIns"><b>[[localize("imp-data","Import data",language)]]</b></paper-button>
                <template is="dom-if" if="{{!hasTokenMH}}">
                    <paper-button class="button button--save" on-tap="_requestGenins" disabled="[[isLoading]]">[[localize('gen_ins_req','Request',language)]]</paper-button>
                </template>
                <template is="dom-if" if="{{hasTokenMH}}">
                    <template is="dom-if" if="{{hasToken}}">
                        <paper-button class="button button--other" on-tap="_requestGenins" disabled="[[isLoading]]">[[localize('gen_ins_req','Request',language)]]</paper-button>
                    </template>
                    <paper-button class="button button--save" on-tap="_requestGeninsMMH" disabled="[[isLoading]]">[[localize('gen_ins_req_mmh','Request MMH',language)]]</paper-button>
                </template>
            </div>
        </paper-dialog>

        <paper-dialog id="select-more-options-dialog">
            <h2 class="modal-title">
                [[localize("slctBtw2Date","Select between 2 dates",language)]]
            </h2>
            <div class="content" id="select-more-options-content">
            <div class="horizontal">
                <vaadin-date-picker label="[[localize('startDate','Start date',language)]]" i18n="[[i18n]]" value="{{dateStartAsString}}"></vaadin-date-picker>
                <vaadin-date-picker label="[[localize('endDate','End date',language)]]" i18n="[[i18n]]" value="{{dateEndAsString}}"></vaadin-date-picker>
                <vaadin-combo-box style="vertical-align: top; min-width: 260px" id="moreOptionsUsers" filter="{{moreOptionsUsersFilter}}" filtered-items="[[moreOptionsUsers]]" item-label-path="name" item-value-path="id" label="[[localize('user','User',language)]]" value="{{moreOptionsUser}}"></vaadin-combo-box>
                <!--
                <vaadin-combo-box style="vertical-align: top; min-width: 260px" id="moreOptionsUsers" filtered-items="[[moreOptionsUsers]]"
                                  item-label-path="name" item-value-path="id"
                                  label="[[localize('user','User',language)]]"
                                  value="{{moreOptionsUser}}"></vaadin-combo-box>
                                  -->
            </div>
            <div class="horizontal">
                <label style="display:flex;"><b>[[localize('sta','Status',language)]]</b></label>
                <paper-radio-group selected="{{statutFilter}}">
                    <paper-radio-button name="all">[[localize('all','All',language)]]</paper-radio-button>
                    <paper-radio-button name="active-relevant">[[localize('act_rel','Active relevant',language)]]</paper-radio-button>
                    <paper-radio-button name="active-irrelevant">[[localize('act_irr','Active irrelevant',language)]]</paper-radio-button>
                    <paper-radio-button name="inactive">[[localize('ina','Inactive',language)]]</paper-radio-button>
                    <paper-radio-button name="archived">[[localize('archiv','Archived',language)]]</paper-radio-button>
                </paper-radio-group>
            </div>
            <div class="horizontal">
                <label style="display:flex;"><b>[[localize('various','Various',language)]]</b></label>
                <paper-radio-group style="vertical-align: top;" selected="{{contactStatusFilter}}">
                    <paper-radio-button name="all">[[localize('all','All',language)]]</paper-radio-button>
                    <paper-radio-button name="import">[[localize('importedDocuments','Imported documents',language)]]</paper-radio-button>
                </paper-radio-group>
                <vaadin-combo-box style="vertical-align: top; min-width: 260px" id="document-type" filtered-items="[[documentTypes]]" item-label-path="name" item-value-path="code" label="[[localize('doc-typ','Document type',language)]]" value="{{documentType}}" disabled="[[contactStatusAll]]"></vaadin-combo-box>
            </div>
            <div class="horizontal">
                <label style="display:flex;"><b>[[localize('sort','Sort',language)]]</b></label>
                <vaadin-combo-box id="sort-criterion" filtered-items="[[sortCriteria]]" item-label-path="label" item-value-path="id" label="[[localize('sortCriteria','Sort criteria',language)]]" value="{{sortCriterion}}" disabled="[[contactStatusAll]]"></vaadin-combo-box>
                <vaadin-combo-box id="sort-direction" filtered-items="[[sortDirections]]" item-label-path="label" item-value-path="id" label="[[localize('sortDirection','Sort direction',language)]]" value="{{sortDirection}}"></vaadin-combo-box>
            </div>
            </div>
            <div class="buttons">
                <paper-button class="button button--save" on-tap="_closeMoreOptions">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>
        <ht-pat-preventive-acts-dialog id="preventiveActs" api="[[api]]" user="[[user]]" resources="[[resources]]" language="[[language]]" i18n="[[i18n]]" linkables="[[_concat(activeHealthElements, allergies, risks, inactiveHealthElements, familyrisks)]]" contacts="[[contacts]]" on-open-action="openActionDialog" on-create-service="_createService" on-update-service="_updateServices" on-delete-service="_deleteService" services-refresher="[[servicesRefresher]]"></ht-pat-preventive-acts-dialog>
        <ht-pat-action-plan-dialog id="planActionForm" api="[[api]]" user="[[user]]" resources="[[resources]]" language="[[language]]" i18n="[[i18n]]" linkables="[[_concat(activeHealthElements, allergies, risks, inactiveHealthElements, familyrisks)]]" current-contact="[[currentContact]]" on-create-service="_createService" on-update-service="_updateServices" on-delete-service="_deleteService" readonly="false"></ht-pat-action-plan-dialog>
        <medication-prescription-dialog 
            id="medication-prescription" 
            api="[[api]]" 
            user="[[user]]" 
            patient="[[patient]]" 
            i18n="[[i18n]]" 
            language="[[language]]" 
            medications="[[existingMedications]]" 
            treatment-history="[[treatmentHistory]]" 
            resources="[[resources]]"
            on-save-medications="_saveMedications" 
            on-new-medications="_createNewMedications">
        </medication-prescription-dialog>
        <medication-details-dialog id="medication-detail" api="[[api]]" user="[[user]]" i18n="[[i18n]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" selected-medication-content-with-id="{{selectedMedicationContentWithId}}" on-value-changed="_medicationDetailValueChanged"></medication-details-dialog>
        <medication-plan-dialog id="medication-plan" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" medications="[[medications]]" prescriptions="[[prescriptions]]" user="[[user]]" patient="[[patient]]" on-print-prescription="onPrintPrescription"></medication-plan-dialog>
        <!--<ht-pat-mcn-chapteriv-agreement id="chapterivdialog" api="[[api]]" user="[[user]]" patient="[[patient]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" medications="[[medications]]" on-create-service="_createService" on-update-services="_updateServices"></ht-pat-mcn-chapteriv-agreement>-->
        <ht-pat-edmg-dialog id="edmgDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]"></ht-pat-edmg-dialog>
        <ht-pat-patientwill-dialog id="patientWillDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-service-changed="_serviceChanged"></ht-pat-patientwill-dialog>
        <!--<ht-pat-hub-transaction-view id="transactionViewDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" i18n="[[i18n]]" resources="[[resources]]"></ht-pat-hub-transaction-view>-->
        <ht-pat-hub-detail id="patHubDetail" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-hub-download="_hubDownload" on-close-hub-dialog="_closeOverlay" on-service-changed="_serviceChanged" on-healthelement-changed="_healthElementChanged" on-import-hub-sumehr-item="_importHubSumehrItem"></ht-pat-hub-detail>
        <!-- ht-pat-detail-ctc-detail-panel dialogs -->
        <ht-pat-hub-upload id="patHubUpload" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" patient-consent="[[patientConsent]]" selected-document-id-to-upload="[[documentIdToUpload]]" ehealth-session="[[ehealthSession]]" have-ther-links="[[haveTherLinks]]" hub-end-point="[[hubEndPoint]]" hub-id="[[hubId]]" hub-application="[[hubApplication]]" hub-package-id="[[hubPackageId]]"></ht-pat-hub-upload>
        <ht-pat-vaccine-dialog id="HtPatVaccineDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" contacts="[[contacts]]" current-contact="[[currentContact]]" resources="[[resources]]" on-refresh-patient="refreshPatientAndServices" on-update-service="_updateServices" on-open-action="openActionDialog"></ht-pat-vaccine-dialog>
        <ht-pat-hub-diary-note id="htPatHubDiaryNote" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-close-hub-dialog="_closeOverlay"></ht-pat-hub-diary-note>
        <ht-pat-hub-sumehr-preview id="htPatHubSumehrPreview" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-hub-download="_hubDownload" on-close-hub-dialog="_closeOverlay" on-service-changed="_serviceChanged" on-healthelement-changed="_healthElementChanged" on-import-hub-sumehr-item="_importHubSumehrItem"></ht-pat-hub-sumehr-preview>
        <ht-pat-other-form-dialog id="htPatOtherFormDialog" api="[[api]]" user="[[user]]" language="[[language]]" resources="[[resources]]" patient="[[patient]]" data-provider="[[formTemplatesSelectorDataProvider()]]" on-entity-selected="_addedFormSelected"></ht-pat-other-form-dialog>
        <paper-dialog id="upload-dialog">
            <h2 class="modal-title">[[localize('upl_fil','Upload files',language)]]<span class="extra-info">(PDF, images and videos)</span></h2>
            <vaadin-upload id="vaadin-upload" no-auto files="{{files}}" accept="video/*,image/*,application/pdf,text/xml,application/xml,text/plain" target="[[api.host]]/document/{documentId}/attachment/multipart;jsessionid=[[api.sessionId]]" method="PUT" form-data-name="attachment" on-upload-success="_fileUploaded"></vaadin-upload>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>
        <ht-pat-prescription-dialog id="prescriptionDialog" api="[[api]]" user="[[user]]" i18n="[[i18n]]" language="[[language]]" patient="[[patient]]" resources="[[resources]]" current-contact="[[currentContact]]" services-map="[[servicesMap]]" drugs-refresher="[[_drugsRefresher]]" on-save-document-as-service="[[_handleSaveDocumentAsService]]" global-hcp="[[globalHcp]]" on-save-contact="_saveContact"></ht-pat-prescription-dialog>

        <ht-msg-new id="new-msg" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" credentials="[[credentials]]" patient="[[patient]]" on-refresh-patient="refreshPatientAndServices"></ht-msg-new>

        <paper-dialog id="notConnctedToeHealthBox" class="modalDialog" no-cancel-on-outside-click no-cancel-on-esc-key>
            <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
            <div class="content textaligncenter pt20 pb70 pl20 pr20">
                <p class="fw700">[[localize('notConnctedToeHealthBox','You are not connected to your eHealthBox yet',language)]]</p>
                <p>[[localize('pleaseConnecteHealthBoxFirst','Please connect your eHealthBox first',language)]].</p>
            </div>
            <div class="buttons">
                <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>

        <ht-pat-rn-consult-dialog id="htPatRnConsultDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" resources="[[resources]]" on-patient-updated="_patientUpdated"></ht-pat-rn-consult-dialog>
        <ht-pat-rn-consult-history-dialog id="htPatRnConsultHistoryDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" resources="[[resources]]" history-result="[[rnHistoryResult]]"></ht-pat-rn-consult-history-dialog>
        <ht-pat-charts-dialog id="patChartsDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" contacts="[[contacts]]" resources="[[resources]]"></ht-pat-charts-dialog>

        <print-document id="printDocument" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" on-done-printing-document="_donePrintingDocument"></print-document>

        <paper-item id="rnConsult-error-notification" class="notification-container error">
            <iron-icon class="notification-icn" src="[[_rnConsultPicture()]]"></iron-icon>
            <div class="notification-msg">
                <h4>[[localize('rn-consult-not-err', 'Rn consult error', language)]]</h4>
                <p>[[rnHistoryResult.status.code]] :
                    <template is="dom-repeat" items="[[rnHistoryResult.status.messages]]" as="msg">
                        [[msg.value]]
                    </template>
                </p>
            </div>
        </paper-item>

        <paper-item id="rnConsult-changed-notification" class="notification-container dark">
            <iron-icon class="notification-icn" src="[[_rnConsultPicture()]]"></iron-icon>
            <div class="notification-msg">
                <h4>[[localize('rn-consult-not', 'Rn consult changed', language)]]</h4>
                <p>[[localize('rn-consult-niss-changed', "Niss number changed", language)]]</p>
            </div>
            <paper-button name="closePostit" class="notification-btn" on-tap="_closeRnConsultChangedNotification">
                [[localize('clo','Close',language)]]
            </paper-button>
            <paper-button name="editPostit" class="notification-btn" on-tap="_showRnConsultDiff">
                [[localize('rn-consult-show','Show',language)]]
            </paper-button>
        </paper-item>


        <ht-pat-outgoing-document id="outgoingDocument" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" on-refresh-templates-menu="_triggerRefreshOutGoingDocumentTemplates" on-refresh-patient="refreshPatientAndServices"></ht-pat-outgoing-document>


        <ht-pat-documents-directory-dialog id="documentsDirectory" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" on-print-document="_printDocument" on-forward-document="_forwardDocument"></ht-pat-documents-directory-dialog>

        <paper-dialog id="prose-editor-dialog-linking-letter" no-cancel-on-outside-click no-cancel-on-esc-key>
            <h2 class="modal-title">[[localize('linkingLetter','Lettre de liaison',language)]]</h2>
            <prose-editor class="content" id="prose-editor-linking-letter" on-refresh-context="_refreshContextLinkingLetter"></prose-editor>
            <div class="buttons">
                <paper-button class="button" on-tap="_closeLinkingLetterDialog"><iron-icon icon="icons:close" class="mr5 smallIcon"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                <paper-button class="button button--other" on-tap="_printLinkingLetter"><iron-icon icon="icons:print" class="mr5 smallIcon"></iron-icon> [[localize('print','Print',language)]]</paper-button>
                <paper-button class="button button--save" autofocus="" on-tap="_saveLinkingLetter"><iron-icon icon="icons:save" class="mr5 smallIcon"></iron-icon> [[localize('saveToPatFile','Save to patient file',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog class="confirmDeleteServiceDialog" id="confirmDeleteServiceDialog">
            <h2 class="modal-title">[[localize('confirmDeleteServiceTitle',"Suppression d'un service",language)]]</h2>
            <div class="content">
                <div class="cdc-content">
                    <div style="margin-top: 20px; margin-left: 20px;">[[localize('confirmDeleteService',"Voulez-vous supprimer le service ?",language)]]</div>
                </div>
            </div>
            <div class="buttons">
                <paper-button class="button button--save" on-tap="_confirmDeleteService">[[localize('yes','Oui',language)]]</paper-button>
                <paper-button class="button" on-tap="_cancelDeleteService">[[localize('no','Non',language)]]</paper-button>
            </div>
        </paper-dialog>

        <ht-pat-therlink-detail id="htPatTherlinkDetail" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" therlink-list="[[therLinkList]]" hub-end-point="[[hubEndPoint]]" hub-supports-consent="[[hubSupportsConsent]]" eid-card-number="{{eidCardNumber}}" isi-card-number="[[isiCardNumber]]" hub-package-id="[[hubPackageId]]" on-read-eid="_readEid" on-refresh-therlink="showPatientTherLinkState"></ht-pat-therlink-detail>
        <ht-pat-consent-detail id="htPatConsentDetail" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" hub-end-point="[[hubEndPoint]]" hub-supports-consent="[[hubSupportsConsent]]" eid-card-number="{{eidCardNumber}}" isi-card-number="[[isiCardNumber]]" hub-package-id="[[hubPackageId]]" on-read-eid="_readEid" on-refresh-consent="showPatientConsentState"></ht-pat-consent-detail>
        <ht-pat-hub-utils id="htPatHubUtils" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" on-hub-download="_hubDownload" on-close-hub-dialog="_closeOverlay"></ht-pat-hub-utils>
        <ht-pat-care-path-detail-dialog id="htPatCarePathDetailDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" contacts="[[contacts]]" current-contact="[[currentContact]]" resources="[[resources]]" selected-care-path-info="[[selectedCarePathInfo]]" active-health-elements="[[activeHealthElements]]" on-save-care-path="_refreshFromServices" on-closing-care-path="refreshPatient"></ht-pat-care-path-detail-dialog>
        <ht-pat-care-path-list-dialog id="htPatCarePathListDialog" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" active-health-elements="[[activeHealthElements]]" on-open-care-path-detail-dialog="_openCarePathDetail"></ht-pat-care-path-list-dialog>
        <ht-pat-member-data-detail id="htPatMemberDataDetail" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" current-contact="[[currentContact]]" mda-result="[[mdaResult]]" on-mda-response="_updateMdaFlags"></ht-pat-member-data-detail>
`
    }


    static get is() {
        return 'ht-pat-detail'
    }

    static get properties() {
        return {
            api: {
                type: Object
            },
            user: {
                type: Object
            },
            patient: {
                type: Object,
                notify: true
            },
            patientInsurance: {
                type: Object,
                value: function () {
                    return {}
                }
            },
            patientInsurability: {
                type: Object,
                value: function () {
                    return {}
                }
            },
            patientConsent: {
                type: Object,
                value: function () {
                    return {}
                }
            },
            eidCardNumber: {
                type: String,
                value: '',
            },
            isiCardNumber: {
                type: String,
                value: '',
            },
            hubEndPoint: {
                type: String,
                value: 'https://acchub.reseausantewallon.be/HubServices/IntraHub/V3/IntraHub.asmx'
            },
            hubPackageId: {
                type: String,
                value: null
            },
            hubApplication: {
                type: String,
                value: null
            },
            hubSupportsConsent: {
                type: Boolean,
                value: false
            },
            hcpZip: {
                type: String,
                value: '1000'
            },
            curGenInsResp: {
                type: Object,
                value: null
            },
            genInsDateFrom: {
                type: Number,
                value: null
            },
            genInsDateTo: {
                type: Number,
                value: null
            },
            genInsNiss: {
                type: String,
                value: null
            },
            genInsOA: {
                type: String,
                value: null
            },
            genInsAFF: {
                type: String,
                value: null
            },
            genInsHospitalized: {
                type: Boolean,
                value: false
            },
            genInsDateStartAsString: {
                type: Number,
                value: null
            },
            hasToken: {
                type: Boolean,
                value: false
            },
            hasTokenMH: {
                type: Boolean,
                value: false
            },
            selectedTransaction: {
                type: Object
            },
            selectedAdminOrCompleteFileIndex: {
                type: Object,
                observer: 'selectedAdminFileChanged',
                value: null
            },
            selectedHealthcareElements: {
                type: Array,
                value: function () {
                    return []
                }
            },
            selectedFamily: {
                type: Array,
                value: function () {
                    return []
                }

            },
            events: {
                type: Array,
                value: function () {
                    return []
                }

            },
            selectedRisks: {
                type: Array,
                value: function () {
                    return []
                }

            },
            selectedAllergies: {
                type: Array,
                value: function () {
                    return []
                }

            },
            selectedLocalize: {
                type: Array,
                value: function () {
                    return []
                }
            },
            selected: {
                type: Boolean,
                value: false
            },
            showFiltersPanel: {
                type: Boolean,
                value: false
            },
            currentContact: {
                type: Object,
                value: null
            },
            contactSearchString: {
                type: String,
                value: null
            },
            showDetailsFiltersPanel: {
                type: Boolean,
                value: false
            },
            isLatestYear: {
                type: Boolean,
                value: false
            },
            selectedContactIds: {
                type: Array,
                value: function () {
                    return []
                }
            },
            itemSelected: {
                type: Boolean,
                value: false
            },
            currentTherLinks: {
                type: Array,
                value: () => []
            },
            haveTherLinks: {
                type: Boolean,
                value: false
            },
            selectedTherLink: {
                type: Object,
                value: null
            },
            secondPanelItems: {
                type: Array,
                value: function () {
                    return [{
                        icon: "icure-svg-icons:laboratory",
                        filter: [{type: 'CD-TRANSACTION', code: ['labresult']}],
                        title: {en: "Lab Results", fr: "Résultats de laboratoire", nl: "Lab Results"},
                        id: "LabResults"
                    },
                        {
                            icon: "icure-svg-icons:imaging",
                            filter: [{type: 'CD-TRANSACTION', code: ['result']}, {
                                type: 'CD-HCPARTY',
                                code: ['deptradiology']
                            }],
                            title: {en: "Imaging", fr: "Imagerie", nl: "Imaging"},
                            id: "Imaging"
                        },
                        {
                            icon: "icure-svg-icons:stethoscope",
                            filter: [{type: 'CD-ENCOUNTER', code: ['consultation']}],
                            title: {en: "Consultation", fr: "Consultation", nl: "Consultation"},
                            id: "Consultation"
                        },
                        {
                            icon: "editor:insert-drive-file",
                            filter: [{type: 'CD-TRANSACTION', code: ['contactreport']}],
                            title: {en: "Protocol", fr: "Protocole", nl: "Protocol"},
                            id: "Protocol"
                        },
                        {
                            icon: "icure-svg-icons:prescription",
                            filter: [{type: 'CD-ITEM', code: ['treatment']}],
                            title: {en: "Prescription", fr: "Prescription", nl: "Prescription"},
                            id: "Prescription"
                        }]
                }
            },
            dateStartAsString: {
                type: String,
                value: null,
                observer: '_selectBetweenTwoDates'
            },
            dateEndAsString: {
                type: String,
                value: null,
                observer: '_selectBetweenTwoDates'
            },
            statutFilter: {
                type: String,
                value: "all",
                observer: 'checkingStatus'
            },
            contactStatusFilter: {
                type: String,
                value: "all",
                observer: 'updateCriterionSorter'
            },
            contactStatutChecked: {
                type: Array,
                value: []
            },
            hiddenSubContactsId: {
                type: Object,
                value: {}
            },
            historyElement: {
                type: Object
            },
            keyPairKeystore: {
                type: Array,
                value: () => []
            },
            MMHKeystoreId: {
                type: String,
                value: null
            },
            MMHPassPhrase: {
                type: String,
                value: null
            },
            MMHTokenId: {
                type: String,
                value: null
            },
            MMHNihii: {
                type: String,
                value: null
            },
            showGeninsTest: {
                type: Boolean,
                value: false
            },
            isLoading: {
                type: Boolean,
                value: false
            },
            currentSelectMedicationEventDetail: {
                type: Object,
                value: () => {
                }
            },
            currentMedicationDetailEventDetail: {
                type: Object,
                value: () => {
                }
            },
            contactTypeList: {
                type: Array,
                value: function () {
                    return []
                }
            },
            SpinnerActive: {
                type: Boolean,
                value: false
            },
            postitMsg: {
                type: String,
                value: null
            },
            flatrateMsg: {
                type: String,
                value: null
            },
            adminTabIndex: {
                type: Number,
                value: 0
            },
            cardData: {
                type: Object,
                value: {},
                observer: "cardDataChanged"
            },
            leftMenuOpen: {
                type: Boolean,
                value: false
            },
            refPeriods: {
                type: Array,
                value: []
            },
            refreshServicesDescription: {
                type: Number,
                value: 0
            },
            linkingLetterDialog: {
                type: HTMLElement
            },
            orphans: {
                type: String,
                value: null
            },
            refresher: {
                type: Number,
                value: 0
            },
            servicesRefresher: {
                type: Number,
                value: 0
            },
            ehealthSession: {
                type: Boolean,
                value: false
            },
            documentIdToUpload: {
                type: String,
                value: null
            },
            _bodyOverlay: {
                type: Boolean,
                value: false
            },
            sortDirections: {
                type: Array,
                value: () => []
            },
            sortDirection: {
                type: String,
                value: ""
            },
            sortCriteria: {
                type: Array,
                value: () => []
            },
            sortCriterion: {
                type: String,
                value: ""
            },
            moreOptionsUsersFilter: {
                type: String,
                value: null
            },
            moreOptionsUsers: {
                type: Array,
                value: () => []
            },
            moreOptionsUser: {
                type: Object,
                value: () => {
                }
            },
            contactStatusAll: {
                type: Boolean,
                value: true
            },
            documentTypes: {
                type: Array,
                value: () => []
            },
            documentType: {
                type: String,
                value: ""
            },
            allHealthElements: {
                type: Object,
                value: {}
            },
            therLinkList: {
                type: Object,
                value: () => {
                }
            },
            rnHistoryResult: {
                type: Object,
                value: () => {
                }
            },
            currentConsents: {
                type: Array,
                value: () => []
            },
            biometrics: {
                type: Array,
                value: () => [],
                notify: true
            },
            bioSort: {
                type: String,
                value: ""
            },
            prescriptions: {
                type: Array,
                value: [],
                notify: true
            },
            treatmentHistory: {
                type: Array,
                value: [],
                notify: true
            },
            selectedCarePathInfo: {
                type: Object,
                value: () => {
                }
            },
            familyLinks: {
                type: Array,
                value: () => []
            },
            mdaResult:{
                type: Object,
                value: {}
            },
            hcpType: {
                type: String,
                value: null
            },
            sumehrContentOnPatientLoad:{
                type: Object,
                value: () => {}
            },
            matrixByHcpType: {
                type: Object,
                value: {
                    rnConsult: ["physician", "specialist"],
                    edmg: ["physician"],
                    hub: ["physician", "specialist"],
                    therLink: ["physician", "specialist"],
                    consent: ["physician", "specialist"],
                    mda: ["physician", "specialist"],
                    insurability: ["medicalHouse"]
                }
            }
        }
    }

    static get observers() {
        return [
            'patientOpened(patient,api,user)',
            'postitChanged(postitMsg)',
            'flatrateMsgChanged(flatrateMsg)',
            'patientChanged(api,user,patient)',
            'selectedHealthcareElementsSpliced(selectedHealthcareElements.splices)',
            'selectedContactIdsChanged(selectedContactIds.*)',
            '_filesChanged(files.*)',
            '_isConnectedToEhbox(api.tokenId)',
            'selectedMedicationsChanged(selectedMedications)',
            'hcpChanged(user)',
            'showPatientHubState(currentConsents, currentConsents.*, currentTherLinks, currentTherLinks.*)',
            'checkSumehrPresentOnHub(currentConsents, currentConsents.*, currentTherLinks, currentTherLinks.*, hubReady)',
            'showPatientSumehrState(currentConsents, currentConsents.*, currentTherLinks, currentTherLinks.*, sumehrOnHubChecked, sumehrPresentOnHub, sumehrContentOnPatientLoad, sumehrContentOnPatientRefresh, hubEndPoint)',
            '_moreOptionsUsersFilterChanged(moreOptionsUsersFilter)'
        ]
    }

    constructor() {
        super()
    }

    _updateGlobalHcp() {
        this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(tempHcp => {
            this.set('globalHcp', tempHcp)
        })
    }

    hcpChanged(user) {
        if (!user) return
        this._updateGlobalHcp()
    }

    ready() {
        super.ready()
        this.set("SpinnerActive", true)

        this.api && this.api.isElectronAvailable().then(electron => {
            if (electron) {
                this._readEid()
            }
        })
        if (this.patientHealthCarePartiesById == null) {
            Promise.all(
                _.chunk(this.patient.patientHealthCareParties, 100).map(uChunk =>
                    this.api.hcparty().getHealthcareParties(uChunk.map(u => u.healthcarePartyId).filter(id => !!id).join(','))
                )
            ).then(hcps => {
                this.patientHealthCarePartiesById = _.flatMap(hcps).reduce((acc, hcp) => {
                    if (_.trim(_.get(hcp, "id", ""))) acc[hcp.id] = hcp
                    return acc
                }, {})
            })
        }

        this._updateGlobalHcp()

        this.api.code().findPaginatedCodes('be', 'BE-CONTACT-TYPE', '')
            .then(ct => this.set("contactTypeList", _.orderBy(ct.rows, ['code'], ['asc'])))

        this._setColsWidth()

        this.set('linkingLetterDialog', this.root.querySelector("#prose-editor-linking-letter"))

        this.set('sortCriteria',
            [
                {
                    id: 'contact',
                    label: this.localize("contact-date", "Contact date", this.language)
                },
                {
                    id: 'document',
                    label: this.localize("doc_date", "Document date", this.language)
                }
            ]
        )
        this.shadowRoot.querySelector("#sort-criterion").selectedItem = this.sortCriteria[0]
        this.set('sortDirections',
            [
                {
                    id: 'desc',
                    label: this.localize("descending", "Descending", this.language)
                },
                {
                    id: 'asc',
                    label: this.localize("ascending", "Ascending", this.language)
                }
            ]
        )
        this.shadowRoot.querySelector("#sort-direction").selectedItem = this.sortDirections[0]

        this._biometrics = [
            {key: "height", code: "height", chart: "height", regex: null},
            {key: "weight", code: "weight", chart: "weight", regex: null},
            {key: "bmi", code: "bmi", chart: "bmi", regex: null},
            {key: "glycemia", code: "glycemie", chart: "glycemia", regex: /^Glycémie/i},
            {key: "cholesterol", code: "cholesterol", chart: "cholesterol", regex: /^Cholesterol/i},
            {key: "sbp", code: "sbp", chart: "bp", regex: null},
            {key: "dbp", code: "dbp", chart: "bp", regex: null},
        ]

        return this.api.user().listUsers().then((users) => {
            //this.set("moreOptionsUsers", users.rows);
            this._moreOptionsUsers = users.rows
            this.api.getDocumentTypes(this.resources, this.language)
                .then(documentTypes => this.set("documentTypes", _.concat([{
                    code: 'all',
                    name: this.localize('all', 'All', this.language)
                }], documentTypes)))
                .then(() => {
                    this.shadowRoot.querySelector("#document-type").selectedItem = this.documentTypes[0]
                    this.api.code().findCodes("be", "BE-FAMILY-LINK").then((codes) => {
                        this.set("familyLinks", codes)
                    })
                })
        })
    }

    wideClass(rev) {
        return this.user && (((this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.wideAspectRatio') || {typedValue: {}}).typedValue.booleanValue || false) ? 'wide' : '')
    }

    _switchTest(e) {
        //this.set('showGeninsTest', !this.showGeninsTest);
        e.stopPropagation()
        let cb = this.root.querySelector('#switchBox')
        const isChecked = cb.checked
        let testdiv = this.root.querySelector('#geninstest')
        if (isChecked) {
            testdiv.style = ''
        } else {
            testdiv.style = 'display: none'
        }
    }

    selectedContactIdsChanged() {
        const ctcDetailPanel = this.shadowRoot.querySelector('#ctcDetailPanel')
        ctcDetailPanel && ctcDetailPanel.flushSave()

        const allContacts = _.concat(this.currentContact ? [this.currentContact] : [], this.contacts)
        this.set('selectedContacts', this.selectedContactIds.map(i => allContacts.find(c => c && c.id === i.substr(4) /* skip ctc_ */)))
    }

    _myReferralPeriods(refPeriods) {
        return refPeriods && (refPeriods.find(r => r.healthcarePartyId === _.get(this, "user.healthcarePartyId", false)) || {}).referralPeriods
    }

    _shortId(id) {
        return id && id.substr(0, 8)
    }

    _timeFormat(date) {
        return date ? this.api.formatedMoment(date) : ''
    }

    _ageFormat(date) {
        return date ? this.api.getCurrentAgeFromBirthDate(date, (e, s) => this.localize(e, s, this.language)) : ''
    }

    _dateFormat(date) {
        return date ? this.api.formatedMoment(date) : ''
    }

    _dateFormat2(date, fFrom, fTo) {
        return date ? this.api.moment(date, fFrom).format(fTo) : ''
    }

    _medicationStartDateLabel(med) {
        const medValue = this.api.contact().medicationValue(med)
        // should try same properties as in medication-detail-dialog.open to avoid inconsistency
        return this._shortDateFormat(medValue && medValue.beginMoment, med.valueDate, med.openingDate)
    }

    _medicationEndDateLabel(med) {
        const medValue = this.api.contact().medicationValue(med)
        return this._shortDateFormat(medValue && medValue.endMoment, med.closingDate)
    }

    _getPatientWillType(pw) {
        const t = pw.codes && pw.codes.find(c => c.type === "CD-PATIENT-WILL" || c.type === "CD-PATIENT-WILL-HOS" || c.type === "CD-PATIENT-WILL-RES") ? pw.codes.filter(c => c.type === "CD-PATIENT-WILL" || c.type === "CD-PATIENT-WILL-HOS" || c.type === "CD-PATIENT-WILL-RES")[0].code : ""
        if (!t) {
            console.log("no t !", pw)
        }
        return this.localize("cd-patientwill-" + t, t, this.language)
    }

    _getPatientWillResponse(pw) {
        const content = this.api.contact().preferredContent(pw, this.language)
        const t = content && content.stringValue && content.stringValue.split("|").length > 2 ? content.stringValue.split("|")[1] : "--"
        return t.includes("hos") ? this.localize("cd-patientwill-hos-" + t, t, this.language) : t.includes("dnr") ? this.localize("cd-patientwill-res-" + t, t, this.language) : this.localize("patientwilldialog_" + t, t, this.language)
    }

    _getPatientWillRegDate(pw) {
        return pw && pw.modified ? this.api.moment(pw.modified).format("MM/YY") : ""
    }

    _shortDateFormat(date, altDate, altDate2) {
        return (date || altDate || altDate2) && this.api.moment((date || altDate || altDate2)).format('YY') || ''
    }

    _isElevated(CT) {
        return CT && CT.substring(2) !== '0' ? this._yesOrNo(true) : this._yesOrNo(false)
    }

    _contactClasses(contact, closingDate, author, responsible) {
        return (closingDate || (author !== this.user.id && responsible !== this.user.healthcarePartyId)) ? '' : 'current-contact'
    }

    _openGenInsDialog(e) {
        e.stopPropagation()
        if (this._checkForEhealthSession() === true) {
            this.set("hasToken", this.api.tokenId)
            this.set("hasTokenMH", this.api.tokenIdMH)
            const mym = moment
            //this.set('curGenInsResp', null);
            this.set('genInsNiss', null)
            this.set('genInsOA', null)
            this.set('genInsAFF', null)
            this.set('genInsDateFrom', null)
            this.set('genInsDateTo', null)
            this.set('genInsHospitalized', false)
            //TODO: init MMH if possible
            this.$.genInsDialog.open()
            if (!this.curGenInsResp || this.curGenInsResp.inss !== this.cleanNiss(this.patient.ssin)) {
                this.set('curGenInsResp', null)
                this._requestGenins()
            }
        } else {
            this._ehealthErrorNotification()
        }
    }

    _importGenIns() {
        if (this.curGenInsResp && !this.curGenInsResp.errors.length) {
            this.api.queue(this.patient, 'patient').then(([pat, defer]) => {
                this.set('patient.firstName', this.curGenInsResp.firstName)
                this.set('patient.lastName', this.curGenInsResp.lastName)
                this.set('patient.dateOfBirth', this.curGenInsResp.dateOfBirth)
                this.set('patient.gender', this.curGenInsResp.sex)

                this.api.patient().modifyPatientWithUser(this.user, this.patient).catch(e => defer.resolve(this.patient)).then(p => this.api.register(p, 'patient', defer)).then(p => {
                    this.dispatchEvent(new CustomEvent("patient-saved", {bubbles: true, composed: true}))
                    this.shadowRoot.querySelector('#pat-admin-card').patientChanged()
                    //this.patient && (this.set('patient.rev', p.rev))
                })
            })
        }
    }

    _openConsentDialog(e) {
        e.stopPropagation()
        if (this._checkForEhealthSession() === true) {
            this.$['htPatConsentDetail']._open()
        } else {
            this._ehealthErrorNotification()
        }
    }

    _openTherLinkDialog(e) {
        e.stopPropagation()
        if (this._checkForEhealthSession() === true) {
            this.selectedTherLink = null
            this._getTherLinks().then(therlink => {
                Object.keys(this.cardData).length && _.get(this.patient, 'ssin', null) === _.get(this.cardData, 'nationalNumber', '') ? this.set("eidCardNumber", _.get(this.cardData, 'logicalNumber', null)) : null
                this.set('therLinkList', _.concat(_.get(therlink, 'hubResp.therapeuticLinks', []).map(link => _.assign(link, {tlType: 'hub'})), _.get(therlink, 'nationalResp.therapeuticLinks', []).map(link => _.assign(link, {tlType: 'national'}))))
                this.$['htPatTherlinkDetail']._open()
            })
        } else {
            this._ehealthErrorNotification()
        }
    }

    _openHubDialogDirectToUpload(e) {
        e.stopPropagation()
        if (this._checkForEhealthSession() === true && ((!!_.size(_.get(this.currentTherLinks, 'hubResp.therapeuticLinks', [])) && !_.isEmpty(_.get(this.currentConsents, "hubResp", {}))) || !this.hubSupportsConsent)) {
            this.$['patHubDetail'].open(true)
        } else {
            this._checkForEhealthSession() === false ? this._ehealthErrorNotification() : null
            !!_.size(_.get(this.currentTherLinks, 'hubResp.therapeuticLinks', [])) ? this._therLinkErrorNotification() : null
            _.isEmpty(_.get(this.currentConsents, "hubResp", {})) ? this._consentErrorNotification() : null
        }
    }

    _openHubDialog(e) {
        e.stopPropagation()
        if (this._checkForEhealthSession() === true && ((!!_.size(_.get(this.currentTherLinks, 'hubResp.therapeuticLinks', [])) && !_.isEmpty(_.get(this.currentConsents, "hubResp", {}))) || !this.hubSupportsConsent)) {
            this.$['patHubDetail'].open()
        } else {
            this._checkForEhealthSession() === false ? this._ehealthErrorNotification() : null
            !!_.size(_.get(this.currentTherLinks, 'hubResp.therapeuticLinks', [])) ? this._therLinkErrorNotification() : null
            _.isEmpty(_.get(this.currentConsents, "hubResp", {})) ? this._consentErrorNotification() : null
        }
    }

    _openEdmgDialog(e) {
        e.stopPropagation()
        if (this._checkForEhealthSession() === true) {
            this.$.edmgDialog.open()
        } else {
            this._ehealthErrorNotification()
        }
    }

    _openPatientWillDialog(e) {
        e.stopPropagation()
        this.$.patientWillDialog.open(this.patientWillServices)
    }

    _trueOrUnknown(b) {
        return b ? this.localize('yes', 'yes', this.language) : '?'
    }

    _yesOrNo(b) {
        return b ? this.localize('yes', 'yes', this.language) : this.localize('no', 'no', this.language)
    }

    _formatHospitalizedInfo(hi) {
        let info = ''
        info += hi && hi.hospital ? this.localize('hosp', 'Hospital', this.language) + ':' + hi.hospital + ' ' : ''
        info += hi && hi.admissionDate ? this.localize('adm_dat', 'AdmissionDate', this.language) + ':' + this._dateFormat2(hi.admissionDate, 'YYYYMMDD', 'DD/MM/YYYY') + ' ' : ''
        info += hi && hi.admissionService ? this.localize('adm_svc', 'AdmissionService', this.language) + ':' + hi.admissionService + ' ' : ''
        return info
    }

    _hasErrors(errs) {
        return errs && errs.length > 0
        //return true;
    }

    _formatError(error) {
        return "[" + (this.language === 'nl' ? error.locNl : error.locFr) + '] ' + (error.value ? error.value + ' : ' : "") + (this.language === 'nl' ? error.msgNl : error.msgFr)
    }

    _hasTransfers(genins) {
        return genins && genins.transfers && genins.transfers.length > 0
        //return true;
    }

    _requestGenins() {
        this.getGenIns(false).then(genInsResp => this.set('curGenInsResp', genInsResp))
    }

    _requestGeninsMMH() {
        this.getGenIns(true).then(genInsResp => this.set('curGenInsResp', genInsResp))
    }

    getGenIns(asMMH) {
        let dStart = null
        if (this.genInsDateFrom) {
            const date = new Date(Date.parse(this.genInsDateFrom)), y = date.getFullYear(), m = date.getMonth()
            dStart = new Date(y, m, 1).getTime()
        } else {
            const date = new Date(), y = date.getFullYear(), m = date.getMonth()
            dStart = new Date(y, m, 1).getTime()
        }

        if (this.api.tokenId || (this.api.tokenIdMH && asMMH)) {
            this.set('isLoading', true)

            if (((this.genInsNiss && this.genInsNiss !== '') || (this.patient.ssin && this.patient.ssin !== '')) && !(this.genInsOA && this.genInsOA !== '')) {
                return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                    .then(hcp => {
                            console.log("getGenIns.getGeneralInsurabilityUsingGET on date", dStart)
                            return this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
                                this.genInsNiss ? this.genInsNiss.trim() : this.cleanNiss(this.patient.ssin),
                                asMMH ? this.api.tokenIdMH : this.api.tokenId, asMMH ? this.api.keystoreIdMH : this.api.keystoreId, asMMH ? this.api.credentials.ehpasswordMH : this.api.credentials.ehpassword,
                                asMMH ? this.api.nihiiMH : hcp.nihii, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, asMMH ? 'medicalhouse' : 'doctor', dStart, asMMH ? Date.parse(this.genInsDateTo) : null, this.genInsHospitalized)
                        }
                    ).then(genInsResp => {
                            if (genInsResp) {
                                this.set('isLoading', false)
                                return genInsResp
                            } else {
                                this.set('isLoading', false)
                                return null
                            }
                        }
                    ).catch(e => {
                        console.log("genins failed " + e.message)
                        this.set('isLoading', false)
                        return null
                    })
            } else {
                //there is no niss
                let oa = this.genInsOA
                let aff = this.genInsAFF
                const pi = this.patient.insurabilities && _.assign({}, this.patient.insurabilities[0] || {})
                return this.api.insurance().getInsurance(pi.insuranceId).then(insu => {
                    return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                        .then(hcp => {
                                return this.api.fhc().Geninscontroller().getGeneralInsurabilityByMembershipUsingGET(
                                    (this.genInsOA && this.genInsOA != '') ? this.genInsOA.trim() : insu.code,
                                    (this.genInsAFF && this.genInsAFF != '') ? this.genInsAFF.trim() : pi.identificationNumber,
                                    asMMH ? this.api.tokenIdMH : this.api.tokenId, asMMH ? this.api.keystoreIdMH : this.api.keystoreId, asMMH ? this.api.credentials.ehpasswordMH : this.api.credentials.ehpassword,
                                    asMMH ? this.api.nihiiMH : hcp.nihii, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, asMMH ? 'medicalhouse' : 'doctor', dStart, asMMH ? Date.parse(this.genInsDateTo) : null, this.genInsHospitalized)
                            }
                        ).then(genInsResp => {
                            if (genInsResp) {
                                this.set('isLoading', false)
                                return genInsResp
                            } else {
                                this.set('isLoading', false)
                                return null
                            }
                        })
                }).catch(e => {
                    console.log("genins failed " + e.message)
                    this.set('isLoading', false)
                    return null
                })
            }
        } else {
            return Promise.resolve(null)
        }
    }

    getNihii8(nihii) {
        return nihii && nihii !== '' && nihii.length >= 8 ? nihii.substring(0, 8) : ''
    }

    getMMHKeystore() {
        const prefix = this.api.crypto().keychainLocalStoreIdPrefix
        const prefixMMH = this.api.crypto().keychainLocalStoreIdPrefix + "MMH."
        const healthcarePartyId = this.user.healthcarePartyId
        const mmhKeystore = localStorage.getItem(prefixMMH + healthcarePartyId) || ""
        const storageKey = prefix + healthcarePartyId


        return Promise.all(
            Object.keys(localStorage).filter(k => k.includes(storageKey) === true && localStorage.getItem(k) === mmhKeystore)
                .map(fk =>
                    this.getDecryptedValueFromLocalstorage(healthcarePartyId, fk.replace("keychain.", "keychain.password."))
                        .then(password =>
                            (this.keyPairKeystore[fk]) ?
                                // Get fhc keystore UUID in cache
                                new Promise(x => x(({uuid: this.keyPairKeystore[fk], passPhrase: password}))) :
                                // Upload new keystore
                                this.api.fhc().Stscontroller().uploadKeystoreUsingPOST(this.api.crypto().utils.base64toByteArray(localStorage.getItem(fk)))
                                    .then(res => this.addUUIDKeystoresInCache(fk, res.uuid, password))
                        )
                )
        )
    }

    getDecryptedValueFromLocalstorage(healthcarePartyId, key) {
        let item = localStorage.getItem(key)

        return this.api.crypto().hcpartyBaseApi.getHcPartyKeysForDelegate(healthcarePartyId)
            .then(encryptedHcPartyKey =>
                this.api.crypto().decryptHcPartyKey(healthcarePartyId, healthcarePartyId, encryptedHcPartyKey[healthcarePartyId], true)
            )
            .then(importedAESHcPartyKey =>
                (item) ? this.api.crypto().AES.decrypt(importedAESHcPartyKey.key, this.api.crypto().utils.text2ua(item)) : null
            )
            .then(data =>
                (data) ? this.api.crypto().utils.ua2text(data) : null
            )
    }

    addUUIDKeystoresInCache(key, uuid, password) {
        return new Promise(x => {
            this.keyPairKeystore[key] = uuid
            x(({uuid: uuid, passPhrase: password}))
        })

    }

    _hcpIdent(tl) {
        return tl && tl.hcParty && tl.hcParty.nihii ? tl.hcParty.nihii : ''
    }

    _patIdent(tl) {
        return tl && tl.patient && tl.patient.inss ? tl.patient.inss : ''
    }

    _startDate(tl) {
        return tl && tl.startDate ? tl.startDate : ''
    }

    _endDate(tl) {
        return tl && tl.endDate ? tl.endDate : ''
    }

    _tlStatus(tl) {
        return tl && tl.status ? tl.status : ''
    }

    _tlType(tl) {
        return tl && tl.type ? tl.type : ''
    }

    _transactionId(tr) {
        this.set('selectedTransaction', tr)
        if (tr) {
            const idLocal = tr.ids.find(id => id.s === "LOCAL")
            if (idLocal) {
                return idLocal.value
            } else {
                return "--"
            }
        } else {
            return ""
        }
    }

    _transactionType(tr) {
        const cdTransType = tr.cds.find(cd => cd.s === "CD-TRANSACTION")
        if (cdTransType) {
            return cdTransType.value
        } else {
            return "--"
        }
    }

    _transactionDate(tr) {
        if (tr.date) {
            var d = new Date(0)
            d.setUTCMilliseconds(tr.date)
            return d.toDateString()
        } else {
            return ""
        }
    }

    _transactionAuthor(tr) {
        var authorRes = "--"
        const author = tr.author.hcparties.find(hcp => hcp.familyname)
        if (author) {
            authorRes = author.familyname + ' ' + author.firstname
        }

        const dept = tr.author.hcparties.find(hcp => hcp.cds.find(cd => cd.s === "CD-HCPARTY"))
        if (dept) {
            const cd = dept.cds.find(cd => cd.s === "CD-HCPARTY")
            authorRes += "/" + cd.value
        }

        return authorRes
        // if(tr.author.hcparties[1]){
        //     return tr.author.hcparties[1].familyname + ' ' + tr.author.hcparties[1].firstname;
        // }
        // else {
        //     return "author";
        // }
    }

    _getTherLinks() {
        if (this.patient.ssin && this.api.tokenId) {
            return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                .then(hcp => Promise.all([
                    this.api.fhc().Therlinkcontroller().getAllTherapeuticLinksUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, hcp.nihii, hcp.ssin, hcp.firstName, hcp.lastName, this.cleanNiss(this.patient.ssin), this.patient.firstName, this.patient.lastName, this.eidCardNumber, this.isiCardNumber, null, null, null, null),
                    this.hubSupportsConsent ? this.api.fhc().Hubcontroller().getTherapeuticLinksUsingGET(this.hubEndPoint, this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, hcp.lastName, hcp.firstName, hcp.nihii, hcp.ssin, this.hcpZip, this.cleanNiss(this.patient.ssin)) : null
                ]))
                .then(([nationalTlResp, hubTlResp]) => {
                    console.log("nationalTlResp", nationalTlResp)
                    console.log("hubTlResp", hubTlResp)
                    this.set('currentTherLinks', {nationalResp: nationalTlResp, hubResp: hubTlResp})
                    return {nationalResp: nationalTlResp, hubResp: hubTlResp}
                })
        } else {
            return Promise.resolve({nationalResp: null, hubResp: null})
        }
    }

    _getConsents() {
        return (this.patient.ssin && this.api.tokenId) ? this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
            Promise.all([
                this.api.fhc().Consentcontroller().getPatientConsentUsingGET(_.get(this.api, 'keystoreId', null), _.get(this.api, 'tokenId', null), _.get(this.api, 'credentials.ehpassword', null), _.get(hcp, 'nihii', null), _.get(hcp, 'ssin', null), _.get(hcp, 'firstName', null), _.get(hcp, 'lastName', null), _.get(this.patient, 'ssin', null), _.get(this.patient, 'firstName', null), _.get(this.patient, 'lastName', null)),
                this.hubSupportsConsent ? this.api.fhc().Hubcontroller().getPatientConsentUsingGET1(this.hubEndPoint, _.get(this.api, "keystoreId", null), _.get(this.api, "tokenId", null), _.get(this.api, "credentials.ehpassword", null), _.get(hcp, "lastName", null), _.get(hcp, "firstName", null), _.get(hcp, "nihii", null), _.get(hcp, "ssin", null), _.get(this, 'hcpZip', null), _.get(this.patient, "ssin", null)) : null
            ])
                .then(([nationalResp, hubResp]) => {
                    console.log("nationalTlResp", nationalResp)
                    console.log("hubTlResp", hubResp)
                    this.set('currentConsents', {nationalResp: nationalResp, hubResp: hubResp})
                    return {nationalResp: nationalResp, hubResp: hubResp}
                })) : Promise.resolve({nationalResp: null, hubResp: null})
    }

    _toggleActionButton(e) {
        e.stopPropagation()
        e.preventDefault()

        let parentElement = e.target.parentElement
        if (parentElement.classList.contains('open')) {
            const svcId = e.target.id.substr("event-btn-done_".length)
            const svc = this.get('events').find(s => s.id === svcId)

            this._planAction(svc)
        } else {
            parentElement.classList.add('open')
            setTimeout(() => parentElement.classList.remove('open'), 6000)
        }
    }

    clearEvent(el) {
        const svcId = el.target.id.substr("event-btn-done_".length)
        const svc = this.get('events').find(s => s.id === svcId)

        const t = svc.tags.find(t => t.type === 'CD-LIFECYCLE')
        if (t) {
            t.code = 'aborted'
            if (!this.currentContact) {
                return
            }
            this.saveNewService(svc).then(c => this.filterEvents())
        }
    }

    completeEvent(el) {
        const svcId = el.target.id.substr("event-btn-close_".length)
        const svc = this.get('events').find(s => s.id === svcId)

        const t = svc.tags.find(t => t.type === 'CD-LIFECYCLE')
        if (t) {
            t.code = 'completed'
            if (!this.currentContact) {
                return
            }
            this.saveNewService(svc).then(c => this.filterEvents())
        }
    }

    _planAction(svc) {
        this.$.planActionForm.open(svc)
    }

    _cloneService(event) {
        const service = _.cloneDeep(event.detail.service)
        delete service.id
        delete service.created
        delete service.modified
        service.valueDate = parseInt(event.detail.next)
        let tag = service.tags.find(t => t.type == 'CD-LIFECYCLE')
        tag ? tag.code = "pending" : null
        event.detail.clone = this.api.contact().service().newInstance(this.user, service)
        return event.detail.clone
    }

    _updateClone(event, services) {
        if (!event || !services) return
        const clone = _.get(event, "detail.clone", null)
        if (!clone) return
        const service = services.find(s => s.id === clone.id)
        if (!service) return
        event.detail.clone = service
    }

    _hasService(object) {
        return _.get(object, "services", []).length > 0
    }

    _hasServiceId(contact, id) {
        return _.get(contact, "services", []).some(s => s.id === id)
    }

    _hasServiceRef(contact, id) {
        return _.get(contact, "subContacts", []).some(s => _.get(s, "services", []).some(s => s.serviceId === id))
    }

    _filterServices(object, condition) {
        if (!object && !object.services) return
        object.services = object.services.filter(s => condition(s))
    }

    _createService(e) {
        if (!this.currentContact) return
        const hes = e.detail.hes || []
        const allContacts = (this.currentContact ? [this.currentContact] : []).concat(this.contacts)
        let services = []
        if (e.detail.service) {
            services.push(this.api.contact().service().newInstance(this.user, e.detail.service))
            if (e.detail.next)
                services.push(this._cloneService(e))
        }
        Promise.all(hes.map(he => he.id ? Promise.resolve(he) : this.contact().promoteServiceToHealthElement(he))).then(hes =>
            //this.api.contact().promoteServiceInContact(this.currentContact, this.user, allContacts, this.api.contact().service().newInstance(this.user, e.detail.service), null, {}, hes.map(he => he.id), e.detail.function || undefined)
            services.forEach(svc => this.api.contact().promoteServiceInContact(this.currentContact, this.user, allContacts, svc, null, {}, hes.map(he => he.id), e.detail.function || undefined))
        ).then(() => this._saveContactAndNotify(this.currentContact, e))
    }

    _deleteService(e) {
        this.$['confirmDeleteServiceDialog'].open()
        this.deleteServiceDetail = e.detail
    }

    _confirmDeleteService() {
        this.deleteServiceDetail.caller.delete()
        this.$['confirmDeleteServiceDialog'].close()
    }

    _cancelDeleteService() {
        this.$['confirmDeleteServiceDialog'].close()
    }

    _updateServices(e) {
        let services = (e.detail.services || (e.detail.service && [e.detail.service]) || [])
        const heIds = e.detail.hes ? e.detail.hes.map(he => he.id) : []
        if (e.detail.hes && e.detail.service) {
            let updates = []
            const service = e.detail.service
            // A. Insert hes
            const contact = this.contacts.find(c => c.id === service.contactId)
            if (e.detail.next)
                contact.services.push(this._cloneService(e))
            this.api.contact().promoteServiceInContact(contact, this.user, this.contacts, service, null, {}, heIds, e.detail.function || undefined)
            // B. Remove hes
            this.contacts.filter(c => this._hasServiceRef(c, service.id)).forEach(contact => {
                const fingerprint = JSON.stringify(contact)
                contact.subContacts.filter(sc => sc.healthElementId).forEach(sc => {
                    this._filterServices(sc, s => s.serviceId !== service.id || heIds.includes(sc.healthElementId))
                })
                contact.subContacts = contact.subContacts.filter(sc => !sc.healthElementId || this._hasService(sc))
                if (fingerprint !== JSON.stringify(contact))
                    updates.push(contact)
            })
            // C. Cleanup
            if (false) {
                this.contacts.filter(c => c.id !== service.contactId && this._hasServiceId(c, service.id)).forEach(contact => {
                    this._filterServices(contact, s => s.id !== service.id)
                    updates.push(contact)
                })
                this.contacts.filter(c => c.id !== service.contactId && this._hasServiceRef(c, service.id)).forEach(contact => {
                    const fingerprint = JSON.stringify(contact)
                    contact.subContacts.forEach(sc => {
                        this._filterServices(sc, s => s.serviceId !== service.id)
                    })
                    contact.subContacts = contact.subContacts.filter(sc => this._hasService(sc))
                    if (fingerprint !== JSON.stringify(contact))
                        updates.push(contact)
                })
            }

            updates = _.uniq(updates.filter(c => c.id !== contact.id))
            const promises = updates.map(contact => {
                return this.api.contact().modifyContactWithUser(this.user, contact)
            })

            Promise.all(promises).then((contacts) => {
                contacts.forEach(contact => this._updateClone(e, contact.services))
                this._saveContactAndNotify(contact, e)
            })

            return
        }

        if (!this.currentContact) return
        const allContacts = (this.currentContact ? [this.currentContact] : []).concat(this.contacts)
        services.forEach(svc => this.api.contact().promoteServiceInContact(this.currentContact, this.user, allContacts, svc, null, {}, heIds, e.detail.function || undefined))
        this.saveContact(this.currentContact)
    }

    updateMedication(svc) {
        if (!svc.id) return
        svc.modified = +new Date()
        const ctc = this.api.contact().contactOfService(this.get('contacts'), svc.id) || this.currentContact
        let sc = this.currentContact.subContacts.find(sc => sc.services.find(sId => svc.id))
        if (!sc) {
            sc = ctc.subContacts.find(sc => sc.services.find(sId => svc.id)) || {}
            this.currentContact.subContacts.push(sc = {
                formId: sc.formId,
                planOfActionId: sc.planOfActionId,
                healthElementId: sc.healthElementId,
                services: []
            })
            sc.services.push({serviceId: svc.id})
        }
        const oldSvcIdx = this.currentContact.services.findIndex(s => s.id === svc.id)
        if (oldSvcIdx > -1)
            this.currentContact.services.splice(oldSvcIdx, 1)
        this.currentContact.services.push(svc)
        return this.saveCurrentContact()
    }

    saveNewService(svc) {
        svc.modified = +new Date()
        if (!svc.id) {
            svc.id = this.api.crypto().randomUuid()
        }
        if (!svc.valueDate) {
            svc.valueDate = parseInt(moment().format('YYYYMMDDHHmmss'))
        }
        if (!svc.openingDate) {
            svc.openingDate = svc.valueDate
        }
        if (!svc.created) {
            svc.created = svc.modified
        }
        const ctc = this.api.contact().contactOfService(this.get('contacts'), svc.id) || this.currentContact
        let sc = this.currentContact.subContacts.find(sc => sc.services.find(sId => svc.id))
        if (!sc) {
            sc = ctc.subContacts.find(sc => sc.services.find(sId => svc.id)) || {}
            this.currentContact.subContacts.push(sc = {
                formId: sc.formId,
                planOfActionId: sc.planOfActionId,
                healthElementId: sc.healthElementId,
                services: []
            })
            sc.services.push({serviceId: svc.id})
        }
        const oldSvcIdx = this.currentContact.services.findIndex(s => s.id === svc.id)
        if (oldSvcIdx > -1) {
            this.currentContact.services.splice(oldSvcIdx, 1)
        }
        this.currentContact.services.push(svc)
        return this.saveCurrentContact()
    }

    _patientSaved() {
        setTimeout(() => this.$.savedIndicator.classList.remove("saved"), 2000)
        this.$.savedIndicator.classList.add("saved")
    }

    _patientUpdated() {
        const patient = this.patient
        this.set("patient", null)
        this.set("patient", patient)
        this._patientSaved()
    }

    saveContact(ctc, preSave, postSave, postError, event) {
        return (preSave ? preSave() : Promise.resolve()).catch(e => console.log(e)).then(() => (ctc.rev ? this.api.contact().modifyContactWithUser(this.user, ctc) : this.api.contact().createContactWithUser(this.user, ctc))).then(c => {
            console.log('Registering ...', c)
            return this.api.register(c, 'contact')
        }).then(c => {
            ctc.rev = c.rev
            console.log("contact saved: " + ctc.id + ":" + ctc.rev)

            setTimeout(() => this.$.savedIndicator.classList.remove("saved"), 2000)
            this.$.savedIndicator.classList.add("saved")

            // need to push the new contact in this.contacts because that's how it is when reloading the page
            this.contacts.find(con => con.id === ctc.id) || this.push('contacts', ctc)
            console.log("ht-pat-detail: after save: currentContact", this.currentContact, "contacts", this.contacts, "selected", this.selectedContacts)
            this._refreshFromServices()

            postSave && postSave(c)

            this._updateClone(event, c.services)
            const caller = _.get(event, "detail.caller", null)
            caller ? caller.onActionChanged(event.detail) : null

            this.set("refresher", this.refresher + 1)

            return c
        }).catch(e => {
            postError && postError(e)
            throw e
        })
    }

    saveCurrentContact() {
        return this.saveContact(this.currentContact)
    }

    _saveContact(event) {
        this.saveContact(event.detail.contact, event.detail.preSave, event.detail.postSave, event.detail.postError)
    }

    _saveContactAndNotify(contact, event) {
        this.saveContact(contact, null, null, null, event)
    }

    filterEvents() {
        const filteredEvents = this.api.contact().filteredServices(this.contacts, s => s.tags.some(t => t.type === 'CD-LIFECYCLE')).filter(s => s.tags.some(t => t.type === 'CD-LIFECYCLE' && (t.code === 'planned' || t.code === 'pending')))
        this.set('events', _.sortBy(filteredEvents, it => this.api.moment(it.valueDate)))
    }

    _lateEventCssClass(e) {
        if (!e || !e.valueDate) return ""
        if (e.valueDate % 100 !== 0) {
            return this.api.moment(e.valueDate).isBefore(moment()) ? 'todo-item--late' : ''
        } else if (e.valueDate % 10000 !== 0) {
            return this.api.moment(e.valueDate).endOf('month').isBefore(moment()) ? 'todo-item--late' : ''
        } else {
            return this.api.moment(e.valueDate).endOf('year').isBefore(moment()) ? 'todo-item--late' : ''
        }
    }

    _isLatestYearContact(contactYear, contactYears) {
        if (!contactYear || !contactYears || !contactYears.length) {
            return "contact--small"
        }
        if (contactYear.year === contactYears[Object.keys(contactYears)[0]].year) {
            this.isLatestYear = true
            return "contact--big"
        } else {
            this.isLatestYear = false
            return "contact--small"
        }
    }

    openToast() {
        const fitbottom = this.shadowRoot.querySelector('#selectionToast') || null
        if (fitbottom) {
            fitbottom.classList.add('open')
            setTimeout(() => fitbottom.classList.remove('open'), 10000)
        }
    }

    toggleFiltersPanel() {
        this.showFiltersPanel = !this.showFiltersPanel
        this.root.querySelector('#filtersPanel').classList.toggle('filters-panel--collapsed')
    }

    selectedItemsSubmenu(list, selectedItems) {
        if (!selectedItems || selectedItems.length === 0) {
            return 'icons:check-box-outline-blank'
        } else if (selectedItems.length < list.length) {
            return 'icons:indeterminate-check-box'
        } else {
            return 'icons:check-box'
        }
    }

    checkedUncheckedIcon(item, selectedItems) {
        if (selectedItems && selectedItems.find(i => i && i.id && i.id.endsWith(item.id))) {
            return 'icons:check-box'
        } else {
            return 'icons:check-box-outline-blank'
        }
    }

    patientOpened() {
        if (this.api && this.user && this.patient && this.patient.id !== this.latestPatientId) {
            this.api.unregisterAll('contact')
            this.latestPatientId = this.patient.id
            const log = {}
            this.api.accesslog().newInstance(this.user, this.patient, log).then(newlog => {
                newlog.detail = "opening Patient"
                this.api.accesslog().createAccessLogWithUser(this.user, newlog)
            })

        } else if (this.api && this.user) {
            this.api.unregisterAll('contact')
        }
    }

    _openChart(e) {
        this.$["patChartsDialog"].open(e.currentTarget.id)
    }

    _isSortedBy(label) {
        return this.bioSort.startsWith(label)
    }

    _sortIcon() {
        return this.bioSort.endsWith("-desc") ? "icons:arrow-drop-down" : "icons:arrow-drop-up"
    }

    _sortBy(e) {
        const label = e.currentTarget.id
        if (this._isSortedBy(label)) {
            this._sortBiometrics(!this.bioSort.endsWith("-desc") ? label + "-desc" : label)
            return
        }
        this._sortBiometrics(label)
    }

    _getCode(code) {
        return this.localize("chart-" + code, code)
    }

    _compareValueDates(a, b) {
        return this.api.moment(b).diff(this.api.moment(a))
    }

    _compareBiometrics(order, a, b) {
        if (order.startsWith("bio-date")) {
            if (order.endsWith("-desc"))
                return this._compareValueDates(a.date, b.date)
            return this._compareValueDates(b.date, a.date)
        }
        const compare = order.endsWith("-desc") ?
            this._getCode(b.code).localeCompare(this._getCode(a.code)) :
            this._getCode(a.code).localeCompare(this._getCode(b.code))
        //const compare = order.endsWith("-desc") ?
        //    b.label.localeCompare(a.label) :
        //    a.label.localeCompare(b.label);
        return compare != 0 ? compare : this._compareValueDates(a.date, b.date)
    }

    _sortBiometrics(order) {
        this.set("bioSort", order)
        this.set("biometrics", this._biometricsFiltered.sort((a, b) => this._compareBiometrics(order, a, b)))
        this.shadowRoot.querySelector('#biometricsList').render()
    }

    _getBiometrics() {
        let biometrics = {}
        const services = _.uniqBy(this.contacts.flatMap(contact => contact.services), 'id')
        services.forEach(service => this._getBiometricFromService(biometrics, service))
        // this.contacts.forEach(contact => {
        //     contact.subContacts.forEach(subcontact => {
        //         subcontact.services.forEach(service => {
        //             this._getBiometricFromService(biometrics, service);
        //         });
        //     });
        //     contact.services.forEach(service => {
        //         this._getBiometricFromService(biometrics, service);
        //     });
        // });

        const values = this._biometrics.filter(b => b.key in biometrics).flatMap(b => biometrics[b.key].map(c => {
                return {
                    code: c.code,
                    date: c.date,
                    label: c.label,
                    value: c.value,
                    dateAsString: this.api.moment(c.date).format('DD/MM/YY'),
                }
            })
        )

        this._biometricsFiltered = values

        this._sortBiometrics("bio-label")

        // Number of services found in more than one contact
        if (false) {
            let orphans = 0
            const services = this.contacts.flatMap(c => c.services)
            services.forEach(service => {
                const contacts = this.contacts.filter(c => c.services.some(s => s.id === service.id))
                if (contacts.length > 1)
                    orphans++
            })
            this.set("orphans", orphans + "/" + services.length)
        }
    }

    _getBiometricFromService(biometrics, service) {
        _.get(this,"_biometrics",[]).forEach(biometric => {
            if ((biometric.code && _.get(service, 'tags', []).some(t => _.get(t, 'type', null) === "CD-PARAMETER" && _.get(t, 'code', '') === _.get(biometric, 'code', null))) ||
                (biometric.regex && service.label && service.label.match(biometric.regex))) {
                if (!(biometric.key in biometrics))
                    biometrics[biometric.key] = []
                const date = _.get(service, 'valueDate', null)
                const label = _.get(service, 'label', null) ? _.get(service, 'label', null) : (_.get(biometric, 'label', null) ?
                    this.localize(_.get(biometric, 'label', null), _.get(biometric, 'key', null)) : _.get(biometric, 'key', null))
                let value = this._getValue(service)
                if (date && label && value) {
                    value = (Math.floor(parseFloat(value) * 100)) / 100
                    if (biometrics[biometric.key].length > 2)
                        if (this._compareValueDates(date, _.last(biometrics[biometric.key]).date) < 0)
                            biometrics[biometric.key].pop()
                    if (biometrics[biometric.key].length < 3) {
                        biometrics[biometric.key].push({code: biometric.chart, date: date, label: label, value: value})
                        biometrics[biometric.key].sort((a, b) => this._compareValueDates(a.date, b.date))
                    }
                }
            }
        })
    }

    _getValue(service) {
        if (_.get(service, 'content.fr.numberValue', null))
            return _.get(service, 'content.fr.numberValue', null)
        if (_.get(service, 'content.fr.stringValue', null))
            return _.get(service, 'content.fr.stringValue', null)
        if (_.get(service, 'content.fr.measureValue.value', null))
            return _.get(service, 'content.fr.measureValue.value', null)
        return null
    }

    patientChanged(api, user, patient) {
        this.set('curGenInsResp', null)
        this.set("SpinnerActive", true)
        this.set('healthTopics', [])

        this.set('healthElements', [])

        this.set('allHealthElements', {})
        this.set('activeHealthElements', [])
        this.set('inactiveHealthElements', [])
        this.set('archivedHealthElements', [])
        this.set('allergies', [])
        this.set('risks', [])
        this.set('familyrisks', [])
        this.set('surgicalHealthElements', [])
        this.set('eidCardNumber', '')
        this.set('isiCardNumber', '')

        //sumehr state
        this.set('sumehrOnHubChecked', false)
        this.set('sumehrPresentOnHub', false)
        this.set('sumehrContentOnPatientLoad', null)
        this.set('sumehrContentOnPatientRefresh', null)

        // Default values = all closed
        this.root.querySelector('#cb_ahelb').opened = false
        this.root.querySelector('#cb_ihelb').opened = false
        this.root.querySelector('#cb_alhelb').opened = false
        this.root.querySelector('#cb_rhelb').opened = false
        this.root.querySelector('#cb_gmhelb').opened = false
        this.root.querySelector('#cb_archhelb').opened = false
        this.root.querySelector('#cb_ishelb').opened = false
        this.root.querySelector('#cb_frhelb').opened = false
        this.root.querySelector('#cb_biom').opened = false
        this.root.querySelector('#cb_pwhelb').opened = false

        // 20190612 for labellisation -> must all be opened
        // this.root.querySelector('#cb_ahelb').opened = true
        // this.root.querySelector('#cb_ihelb').opened = true
        // this.root.querySelector('#cb_alhelb').opened = true
        // this.root.querySelector('#cb_rhelb').opened = true
        // this.root.querySelector('#cb_gmhelb').opened = true
        // this.root.querySelector('#cb_archhelb').opened = true
        // this.root.querySelector('#cb_ishelb').opened = true
        // this.root.querySelector('#cb_frhelb').opened = true
        // this.root.querySelector('#cb_biom').opened = true
        // this.root.querySelector('#cb_pwhelb').opened = true
        // 20190612 for labellisation -> must all be opened

        this.root.querySelector('#medication-plan').reset()


        this.set('selectedHealthcareElements', [])
        this.set('contacts', [])
        this.set('contactYears', [])
        this.set('selectedContactIds', [])

        this.set('currentContact', null)

        this.set('adminTabIndex', 0)
        if (this.api && this.user && this.patient) {
            this.refreshPatient()
        }

        let cfp = this.shadowRoot.querySelector('#contactFilterPanel')
        cfp && cfp.reset()
        this.set('refPeriods', patient && this._myReferralPeriods(patient.patientHealthCareParties) || [])
    }

    _makeHeFromSvc(svc) {
        return {
            created: svc.created,
            modified: svc.modified,
            endOfLife: svc.endOfLife,
            author: svc.author,
            responsible: svc.responsible,
            codes: svc.codes,
            tags: svc.tags,
            valueDate: svc.valueDate,
            openingDate: svc.openingDate,
            closingDate: svc.closingDate,
            descr: this.shortServiceDescription(svc, this.language),
            idService: svc.id,
            status: svc.status,
            svc: svc,
            plansOfAction: []
        }
    }

    _refreshFromServices() {
        const firstJanuary2018 = moment("2018-01-01")
        if (this.currentContact) {
            const combinedHes = (this.activeHealthElements || []).concat(this.inactiveHealthElements || []).concat(this.archivedHealthElements || []).concat(this.allergies || []).concat(this.risks || []).concat(this.familyrisks || []).concat(this.surgicalHealthElements || [])
            const idServicesInHes = combinedHes.map(he => he.idService)

            const hesAsServices = this.currentContact.services.filter(s => s.tags.find(c => c.type === 'CD-ITEM' && ['healthcareelement', 'healthissue', 'familyrisk', 'risk', 'socialrisk', 'allergy'].includes(c.code)) && !idServicesInHes.includes(s.id))
            const svcHes = hesAsServices.map(svc => this._makeHeFromSvc(svc))

            const now = moment()

            const sorter = x => [
                ((x.codes || []).find(c => c.type === 'ICPC' || c.type === 'ICPC2') || {}).code || "\uff0f",
                -(x.valueDate || x.openingDate || 0),
                -(x.closingDate || 0)
            ]

            this.api.code().icpcChapters(_.compact(combinedHes.concat(svcHes).map(he => he.codes.find(c => c.type === 'ICPC' || c.type === 'ICPC2'))).map(x => x.code)).then(codes => {
                codes.forEach(cc => {
                    cc.healthElements = _.sortBy(combinedHes.concat(svcHes).filter(he => {
                        let heIcpc = he.codes.find(c => c.type === 'ICPC' || c.type === 'ICPC2')
                        return (he.healthElementId || he.svc && he.svc.id) && heIcpc && cc.subCodes.includes(heIcpc.code)
                    }), sorter)
                    cc.healthElements.forEach(he => he.colour = cc.descr.colour)
                })
            }).finally(() => {
                this.set('activeHealthElements', (this.activeHealthElements || []).concat(svcHes).filter(it => (!it.closingDate || (it.closingDate && this.api.moment(it.closingDate).isSameOrAfter(now))) && (it.status & 1) === 0 && ((it.status & 2) === 0 || (it.openingDate && this.api.moment(it.openingDate).isSameOrAfter(firstJanuary2018))) && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement'))))
                this.set('inactiveHealthElements', (this.inactiveHealthElements || []).concat(svcHes).filter(it => ((it.closingDate && this.api.moment(it.closingDate).isBefore(now)) || (it.status & 1) === 1) && (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement'))))
                this.set('archivedHealthElements', (this.archivedHealthElements || []).concat(svcHes).filter(it => (it.status & 3) === 3))
                this.set('allergies', (this.allergies || []).concat(svcHes).filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'allergy')))
                this.set('risks', (this.risks || []).concat(svcHes).filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'risk' || c.code === 'socialrisk'))))
                this.set('familyrisks', (this.familyrisks || []).concat(svcHes).filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'familyrisk')))
                this.set('surgicalHealthElements', (this.surgicalHealthElements || []).concat(svcHes).filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'surgery')))
                this.set("allHealthElements", {
                    activeHealthElements: this.activeHealthElements,
                    inactiveHealthElements: this.inactiveHealthElements,
                    archivedHealthElements: this.archivedHealthElements,
                    allergies: this.allergies,
                    medications: this.medications,
                    risks: this.risks,
                    familyrisks: this.familyrisks,
                    surgicalHealthElements: this.surgicalHealthElements
                })
                this._getBiometrics()
                this.filterEvents()
                this.servicesRefresher = this.servicesRefresher + 1
            })
        }
    }

    _refreshContacts(e) {

        this.refreshPatient(false)

        const originalTimeSpanStart = _.get(this, "timeSpanStart", null)

        setTimeout(() => {
            this._refreshFromServices()
            this.set('selectedContactIds', ["ctc_" + e.detail.contact.id])
            this.set('selectedContacts', [e.detail.contact])
            this.shadowRoot.querySelector('#contactsList') && this.shadowRoot.querySelector('#contactsList').render()
            // setTimeout(() => {this.shadowRoot.querySelectorAll('#contactsHes') && this.shadowRoot.querySelectorAll('#contactsHes').forEach(x => x.render());},1000)
            this.set("refreshServicesDescription", this.refreshServicesDescription + 1)
        }, 1000)

        // Hes would not refresh properly without a little help
        setTimeout(() => {
            this.set('timeSpanStart', parseInt(moment().add(1, "day").format('YYYYMMDD')))
        }, 2100)
        setTimeout(() => {
            this.set('timeSpanStart', originalTimeSpanStart)
            this.updateContactYears()
        }, 2100)

    }

    _normalizeMedications(contact) {
        if (!contact || !contact.services || !contact.services.length) return
        contact.services.forEach(service => {
            if (service.id && /^Medication_\d{19}_\d*$/.test(service.id)) {
                if (_.get(service, "content.medication.medicationValue")) {
                    if (!_.get(service, `content[${this.language}].medicationValue`)) {
                        const medicationValue = this.api.contact().medicationValue(service, this.language)
                        Object.assign(service.content, _.fromPairs([[this.language, {medicationValue: medicationValue}]]))
                    }
                    if (_.get(service, "content.medication.medicationValue.endMoment", "")) {
                        if (!service.tags || !service.tags.length || !service.tags.some(tag => tag.type === "ICURE" && tag.code === "PRESC")) {
                            if (service.tags && service.tags.length) {
                                service.tags = service.tags.filter(tag => !(tag.type === "CD-ITEM" && tag.code === "medication") && !(tag.type === "ICURE" && tag.code === "PRESC"))
                            } else {
                                service.tags = []
                            }
                            service.tags.push(this.api.code().normalize({id: "ICURE|PRESC|1"}))
                        }
                        service.label = "Prescription"
                    }
                    if (!service.codes) service.codes = []

                    const atcCode = _.get(service, "content.medication.medicationValue.options.atcCode.stringValue", "")
                    if (atcCode) {
                        service.codes.push(this.api.code().normalize({id: `CD-ATC|${atcCode}|1`}))
                    }
                    const codes = _.get(service, "content.medication.medicationValue.medicinalProduct.intendedcds", _.get(service, "content.medication.medicationValue.substanceProduct.intendedcds", [])).filter(code => ["CD-INNCLUSTER", "CD-VMPGROUP", "CD-DRUG-CNK"].includes(code.type))
                    if (codes) {
                        service.codes = service.codes.filter(code => !["CD-INNCLUSTER", "CD-VMPGROUP", "CD-DRUG-CNK"].includes(code.type))
                        service.codes.push(...codes)
                    }
                }
            }
        })
    }

    refreshPatient(refreshSelectedContacts = true) {
        const patient = this.patient

        this.api.patient().getPatientWithUser(this.user, patient.id)
            .then(p => this.api.register(p, 'patient'))
            .then(pat => this.set("patient", pat))
            .then(pat => {
                const patAdmin = this.shadowRoot.querySelector("#pat-admin-card") || this.$["pat-admin-card"] || false
                patAdmin && typeof _.get(patAdmin, "patientChanged", false) === "function" ? patAdmin.patientChanged() : null
            })

        const now = moment()

        const currentlySelectedContactsIds = (this.selectedContactIds || []).map(id => id && id.substr(4) /* format is ctc_... see DOM */)
        this.set('postitMsg', this.patient.note)
        const flatRateUtil = this.$.flatrateUtils
        this.set("flatrateMsg", "")
        flatRateUtil.checkFlatrateData(patient, Number(moment().format('YYYYMM'))).then(res => {
            console.log("flatrate res", res)
            if (res && res.flatrateStatus && res.flatrateStatus.errors.length > 0) {
                this.set("flatrateMsg", res.flatrateStatus.errors.map(err => this.localize(err, err, this.language)).join())
                console.log("flatrateMsg", this.flatrateMsg)
            }
            // flatRateUtil.checkGenins([res]).then(res2 => {
            //     console.log("flatrate res genins", res2);
            // })
        })

        //console.log("Before load "+(+new Date() - now))
        Promise.all([this.api.contact().findBy(this.user.healthcarePartyId, patient).then(ctcs => ctcs.map(ctc => this.api.register(ctc, 'contact'))), this.api.helement().findBy(this.user.healthcarePartyId, patient, true)]).then(([ctcs, allHes]) => {
            //console.log("After load "+(+new Date() - now))

            const hesByHeId = {}
            allHes.forEach(he => {
                if (he.healthElementId) {
                    ;(hesByHeId[he.healthElementId] || (hesByHeId[he.healthElementId] = [])).push(he)
                }
            })
            _.values(hesByHeId).forEach(a => a.sort((he1, he2) => (he2.modified || 0) - (he1.modified || 0)))
            const hes = _.values(hesByHeId).map(a => a[0]).filter((s) => s && !s.endOfLife)

            ctcs.sort((a, b) => (a.created || 0) - (b.created || 0))
            const sorter = x => [
                ((x.codes || []).find(c => c.type === 'ICPC' || c.type === 'ICPC2') || {}).code || "\uff0f",
                -(x.valueDate || x.openingDate || 0),
                -(x.closingDate || 0)
            ]
            const idServicesInHes = _.compact(hes.map(he => he.idService))
            //console.log("Before filter service "+(+new Date() - now))

            //get patientwill services
            //s.endOfLife === null &&
            //pw.codes.find(c => c.type === "CD-PATIENT-WILL")
            this.api.contact().filterServices(ctcs, s => s.tags.find(c => c.type === 'CD-ITEM' && ['patientwill'].includes(c.code)) && s.codes.find(c => c.type === "CD-PATIENT-WILL" || c.type === "CD-PATIENT-WILL-HOS" || c.type === "CD-PATIENT-WILL-RES")).then(patientWillServices => {
                console.log("eols", patientWillServices.map(svc => svc.endOfLife))
                console.log("patientwillservices", patientWillServices)
                this.set("patientWillServices", patientWillServices)
            })
            ctcs.forEach(ctc => this._normalizeMedications(ctc))
            this.api.contact().filterServices(ctcs, s => s.tags.find(c => c.type === 'CD-ITEM' && ['healthcareelement', 'healthissue', 'familyrisk', 'risk', 'socialrisk', 'adr', 'allergy', 'medication', 'surgery', 'professionalrisk'].includes(c.code)) && !idServicesInHes.includes(s.id)).then(hesAsServices => {
                const svcHes = hesAsServices.filter(s => !s.tags.some(t => t.type === 'CD-ITEM' && t.code === 'medication')).map(svc => this._makeHeFromSvc(svc))

                const oneWeekAgo = moment().subtract(7, 'days')

                //s.tags.some(c => c.type === 'CD-ITEM' && c.code === 'medication' && !_.values(s.content).some(c => c && c.medicationValue && c.medicationValue.endMomentAsString && this.api.moment(c.medicationValue.endMomentAsString).isBefore(oneWeekAgo)))
                this.set('medications', _.sortBy(hesAsServices.filter(s => s.tags.some(c => c.type === 'CD-ITEM' && c.code === 'medication') && !(this.api.contact().medicationValue(s, this.language) || {}).endMoment).map(m => {
                    return Object.assign(m, {
                        colour: m.codes && m.codes.length && `ATC--${((m.codes.find(c => c.type === 'CD-ATC') || {code: 'V'}).code || 'V').substr(0, 1)}` || ""
                    })
                }), sorter))

                this.set('existingMedications', this.medications.filter(s => !_.values(_.get(s, 'content', null)).some(c => _.get(c, 'medicationValue', null) && _.get(c, 'medicationValue.endOfLife', null) && this.api.moment(_.get(c, 'medicationValue.endOfLife', null)).isBefore(now))))

                const combinedHes = _.sortBy(_.concat(svcHes, hes.filter(it => it.descr != null && !it.descr.startsWith('Etat g') && !it.descr.startsWith('Algemeen t') && it.descr !== 'INBOX')), sorter)
                const combinedHesWithHistory = _.sortBy(_.concat(svcHes, allHes.filter(it => it.descr != null && !it.descr.startsWith('Etat g') && !it.descr.startsWith('Algemeen t') && it.descr !== 'INBOX')), sorter)

                combinedHes.forEach(e => {
                    e.selectedItems = []
                })

                const firstJanuary2018 = moment("2018-01-01")
                this.api.code().icpcChapters(_.compact(combinedHesWithHistory.map(he => he.codes.find(c => c.type === 'ICPC' || c.type === 'ICPC2'))).map(x => x.code)).then(codes => {
                    codes.forEach(cc => {
                        cc.healthElements = _.sortBy(combinedHesWithHistory.filter(he => {
                            let heIcpc = he.codes.find(c => c.type === 'ICPC' || c.type === 'ICPC2')
                            return (he.healthElementId || he.svc && he.svc.id) && heIcpc && cc.subCodes.includes(heIcpc.code)
                        }), sorter)
                        cc.healthElements.forEach(he => he.colour = cc.descr.colour)
                    })
                    this.set('healthTopics', _.sortBy(codes.filter(ht => ht.healthElements.length > 1), it => this.api.contact().localize(it, this.language)))

                    this.set('healthElements', combinedHesWithHistory)

                    this.set('activeHealthElements', combinedHes.filter(it => (!it.closingDate || (it.closingDate && this.api.moment(it.closingDate).isSameOrAfter(now))) && (it.status & 1) === 0 && ((it.status & 2) === 0 || (it.openingDate && this.api.moment(it.openingDate).isSameOrAfter(firstJanuary2018))) && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement' || c.code === 'diagnosis'))))
                    this.set('inactiveHealthElements', combinedHes.filter(it => (it.closingDate && this.api.moment(it.closingDate).isBefore(now) || (it.status & 1) === 1) && (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'healthissue' || c.code === 'healthcareelement' || c.code === 'diagnosis'))))
                    this.set('archivedHealthElements', combinedHes.filter(it => (it.status & 3) === 3))
                    this.set('allergies', combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => (c.type === 'CD-ITEM' || c.type === 'CD-ITEM-EXT-CHARACTERIZATION') && (c.code === 'allergy' || c.code === 'adr'))))
                    this.set('risks', combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && (c.code === 'risk' || c.code === 'socialrisk' || c.code === 'professionalrisk'))))
                    this.set('familyrisks', combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'familyrisk')))
                    this.set('surgicalHealthElements', combinedHes.filter(it => (it.status & 2) === 0 && it.tags.find(c => c.type === 'CD-ITEM' && c.code === 'surgery')))

                    this.set("allHealthElements", {
                        activeHealthElements: this.activeHealthElements,
                        inactiveHealthElements: this.inactiveHealthElements,
                        archivedHealthElements: this.archivedHealthElements,
                        allergies: this.allergies,
                        medications: this.medications,
                        risks: this.risks,
                        familyrisks: this.familyrisks,
                        surgicalHealthElements: this.surgicalHealthElements
                    })

                    // Default values
                    this.activeHealthElements.length && (this.root.querySelector('#cb_ahelb').opened = true)
                    this.inactiveHealthElements.length && (this.root.querySelector('#cb_ihelb').opened = false)
                    this.allergies.length && (this.root.querySelector('#cb_alhelb').opened = false)
                    this.risks.length && (this.root.querySelector('#cb_rhelb').opened = false)


                    // 20190612 for labellisation -> must all be opened
                    // this.activeHealthElements.length && (this.root.querySelector('#cb_ahelb').opened = true)
                    // this.inactiveHealthElements.length && (this.root.querySelector('#cb_ihelb').opened = true)
                    // this.allergies.length && (this.root.querySelector('#cb_alhelb').opened = true)
                    // this.risks.length && (this.root.querySelector('#cb_rhelb').opened = true)
                    // 20190612 for labellisation -> must all be opened


                    this.set('selectedHealthcareElements', (this.selectedHealthcareElements || []).filter(he => this.activeHealthElements.concat(this.inactiveHealthElements).concat(this.archivedHealthElements).concat(this.allergies).concat(this.risks).concat(this.familyrisks).concat(this.surgicalHealthElements).includes(he)))
                })

                const unclosedContacts = ctcs.filter(c => !c.closingDate && (c.author === this.user.id || c.responsible === this.user.healthcarePartyId))

                //console.log("Before scan ctcs "+(+new Date() - now))
                ctcs.forEach(ctc => {
                    ctc.healthElements = _.uniq(ctc.subContacts.map(sc => sc.planOfActionId && combinedHesWithHistory.find(he => he.plansOfAction.find(poa => poa.id === sc.planOfActionId)) || sc.healthElementId && combinedHesWithHistory.find(he => he.id === sc.healthElementId)).map(he => he && he.healthElementId)).filter(id => !!id).map(id => hesByHeId[id][0])
                    ctc.services.forEach(s => {
                        if (!s.label) {
                            s.label = ((s.tags.find(t => t.type === 'SOAP') || {}).code || 'Other').replace(/ *: *$/, '')
                        }
                    })
                })

                //console.log("After scan ctcs "+(+new Date() - now))
                const youngest = unclosedContacts.map(c => c.openingDate && this.api.moment(c.openingDate)).reduce((y, mc) => (mc && mc.isAfter(y)) ? mc : y, moment().subtract(1, 'days'))
                Promise.all(unclosedContacts.map(unclosedContact => {
                        return (!unclosedContact.openingDate || this.api.moment(unclosedContact.openingDate).isBefore(youngest)) ?
                            this.api.contact().modifyContactWithUser(this.user, Object.assign(unclosedContact, {closingDate: parseInt(moment().format('YYYYMMDDHHmmss'))}))
                                .then(() => null).catch(() => null)
                            : Promise.resolve(unclosedContact)
                    })
                )
                    .then(ctcs =>
                        _.compact(ctcs)[0] || this.api.contact().newInstance(this.user, patient, {
                            tags: [{code: "1", type: "BE-CONTACT-TYPE", version: "1"}], // default contact type : consult
                            descr: "",
                            userDescr: "",
                            //descr: this.localize('contact_of_the_day', 'Contact of the day', this.language),
                            //userDescr: this.localize('contact_of_the_day', 'Contact of the day', this.language)
                        })
                    )
                    .then(newCtc => {
                        const thisYear = moment().year()

                        //console.log("Before set contacts "+(+new Date() - now))

                        this.set('contacts', Object.values(ctcs.reduce((acc, it) => {
                            const prev = acc[it.groupId || it.id]
                            if (prev) {
                                const target = (it.created || it.modified) > (prev.created || prev.modified) ? it : prev
                                const source = (it.created || it.modified) > (prev.created || prev.modified) ? prev : it

                                acc[it.groupId || it.id] = target

                                target.subContacts = (target.subContacts || []).concat(source.subContacts)
                                target.services = (target.services || []).concat(source.services)
                            } else {
                                acc[it.groupId || it.id] = it
                            }
                            return acc
                        }, {})))

                        //console.log("Before set contacts "+(+new Date() - now))

                        this.set('currentContact', newCtc)
                        const formIds = {}
                        this.hiddenSubContactsId = _.reduce(this.contacts, (acc, ctc) => {
                            ctc.subContacts.forEach(sc => {
                                if (sc.formId && formIds[sc.formId]) {
                                    if (!sc.id) {
                                        sc.id = this.api.crypto().randomUuid()
                                    }
                                    acc[sc.id] = 1
                                } else if (sc.formId) {
                                    formIds[sc.formId] = true
                                }
                            })
                            return acc
                        }, {})

                        if (this.currentContact && this.user) {
                            const noCodeMedications = this.medications.filter(m => !m.codes || !m.codes.length).map(m => {
                                const medValue = this.api.contact().medicationValue(m)
                                const codes = (medValue && medValue.medicinalProduct && medValue.medicinalProduct.intendedcds || []).reduce((map, cds) => (cds.code && cds.type && map.concat([{
                                    code: cds.code,
                                    type: cds.type,
                                    version: "1"
                                }]) || map), [])
                                return [m, codes]
                            }).filter((m, codes) => codes && codes.length).map((m, codes) => {
                                return Object.assign(m, {codes})
                            })

                            if (noCodeMedications && noCodeMedications.length) {
                                const allContacts = [this.currentContact].concat(this.contacts || [])
                                noCodeMedications.forEach(svc => this.api.contact().promoteServiceInContact(this.currentContact, this.user, allContacts, svc, null, {}, []))
                                this.saveContact(this.currentContact)
                            }
                        }

                        //console.log("Before ctcs years"+(+new Date() - now))

                        this.set('contactYears', _.sortBy(_.values(_.reduce(this.contacts, (acc, ctc) => {
                            if (ctc.subContacts && ctc.subContacts.some(sc => !sc.id || !this.hiddenSubContactsId[sc.id]) ||
                                ctc.services.some(s => !ctc.subContacts.some(sc => sc.services.some(scs => scs.serviceId === s.id)) && _.values(s.content).find(this.contentHasData.bind(this)))) {
                                let year = parseInt((ctc.openingDate || 2000).toString().substr(0, 4))
                                const contacts = (acc[year] || (acc[year] = {year: year, contacts: []})).contacts
                                if (!contacts.includes(ctc)) {
                                    contacts.push(ctc)
                                }
                            }
                            return acc
                        }, _.fromPairs([[thisYear, {year: thisYear, contacts: [newCtc]}]]))).map(x => {
                            x.contacts = _.sortBy(x.contacts, sorter)
                            return x
                        }), x => -x.year))

                        this.filterEvents()

                        //console.log("After ctcs years"+(+new Date() - now))

                        if (refreshSelectedContacts) {
                            if (currentlySelectedContactsIds.some(cId => !ctcs.some(c => c.id === cId))) {
                                this.set('selectedContactIds', _.compact(ctcs.filter(c => currentlySelectedContactsIds.includes(c.id)).map(c => `ctc_${c.id}`)))
                            } else {
                                this.set('selectedContactIds', ['ctc_' + newCtc.id])
                            }
                        }

                        this._getBiometrics()
                        this.set("refresher", this.refresher + 1)

                        setTimeout(() =>
                            this.selectedContactIds.forEach(cDomId => {
                                const pm = this.root.querySelector(`#${cDomId}`)
                                if (pm) {
                                    pm.setAttribute("aria-selected", "true")
                                    pm.classList.add('iron-selected')
                                }
                            }), 0)


                    }).finally(() => this.set("SpinnerActive", false))
            })

                .then(() => this.api.contact().filterServices(ctcs, s => s.tags.find(t => (t.type === 'ICURE' && t.code === "PRESC" || t.type === 'CD-ITEM' && t.code === "medication") && !_.values(_.get(s, 'content', null)).some(c => _.get(c, 'medicationValue', null) && _.get(c, 'medicationValue.endOfLife', null) && this.api.moment(_.get(c, 'medicationValue.endOfLife', null)).isBefore(now)))))
                .then(svcs => {
                    this.set("treatmentHistory", svcs)
                    this.set("prescriptions", _.sortBy(svcs.filter(svc => !svc.tags.some(t => t.type === "CD-ITEM" && t.code === "medication"))))
                })
                .finally(() => this.set("SpinnerActive", false)) // icc contact then end

            this._updateFilterPanels()
        })

        //eHealth stuff
        //TODO: set hub and env preferences
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

        const hubConfig = this.$["htPatHubUtils"].getHubConfig(propHub.typedValue.stringValue, propEnv.typedValue.stringValue)

        this.hubId = hubConfig.hubId
        this.hubEndPoint = hubConfig.hubEndPoint
        this.set("hubSupportsConsent", hubConfig.hubSupportsConsent)
        this.hubPackageId = hubConfig.hubPackageId
        this.hubApplication = hubConfig.hubApplication
        this.set("supportBreakTheGlass", hubConfig.supportBreakTheGlass)

        this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>{
            _.get(hcp, 'type', null).toLowerCase() === "medicalhouse" ? this.set('hcpType', "medicalHouse") :
                this._isSpecialist(hcp) ? this.set('hcpType', "specialist") :
                    this.set('hcpType', "physician")

            if(_.get(this.patient, 'ssin', null) && _.get(hcp, 'nihii', null) && _.get(this.api, 'tokenId', null) && _.get(this.api, 'keystoreId', null)){
                //Physician or specialist access
                this._checkEhealthServiceForPhysician(hcp)

            }else if(_.get(this.patient, 'ssin', null) && _.get(hcp, 'nihii', null) && _.get(this.api, 'tokenIdMH', null) && _.get(this.api, 'keystoreIdMH', null)){
                //MedicalHouse access
                this._checkEhealthServiceForMedicalHouse(hcp)
            }else{
                //No ehealth session or patient SSIN not present
                this.shadowRoot.querySelector('#insuranceStatus') && this.shadowRoot.querySelector('#insuranceStatus').classList.remove('medicalHouse')
                this.shadowRoot.querySelector('#insuranceStatus') && this.shadowRoot.querySelector('#insuranceStatus').classList.remove('noInsurance')
                this.shadowRoot.querySelector('#insuranceStatus') && this.shadowRoot.querySelector('#insuranceStatus').classList.remove('insuranceOk')
                this.shadowRoot.querySelector('#consentStatus') && this.shadowRoot.querySelector('#consentStatus').classList.remove('noConsent')
                this.shadowRoot.querySelector('#consentStatus') && this.shadowRoot.querySelector('#consentStatus').classList.remove('consentOk')
                this.shadowRoot.querySelector('#consentStatus') && this.shadowRoot.querySelector('#consentStatus').classList.remove('pendingConsent')
                this.shadowRoot.querySelector('#hubStatus') && this.shadowRoot.querySelector('#hubStatus').classList.remove('noAccess')
                this.shadowRoot.querySelector('#hubStatus') && this.shadowRoot.querySelector('#hubStatus').classList.remove('accessOk')
                this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.remove('noSumehr')
                this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.remove('sumehr')
                this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.remove('sumehrChange')
                this.shadowRoot.querySelector('#tlStatus') && this.shadowRoot.querySelector('#tlStatus').classList.remove('noTl')
                this.shadowRoot.querySelector('#tlStatus') && this.shadowRoot.querySelector('#tlStatus').classList.remove('tlOk')
                this.shadowRoot.querySelector('#tlStatus') && this.shadowRoot.querySelector('#tlStatus').classList.remove('tlPending')
                this.shadowRoot.querySelector('#edmgStatus') && this.shadowRoot.querySelector('#edmgStatus').classList.remove('edmgPending')
                this.shadowRoot.querySelector('#edmgStatus') && this.shadowRoot.querySelector('#edmgStatus').classList.remove('edmgOk')
                this.shadowRoot.querySelector('#edmgStatus') && this.shadowRoot.querySelector('#edmgStatus').classList.remove('edmgNOk')
                this.shadowRoot.querySelector('#rnConsultStatus') && this.shadowRoot.querySelector('#rnConsultStatus').classList.remove('rnConsultPending')
                this.shadowRoot.querySelector('#rnConsultStatus') && this.shadowRoot.querySelector('#rnConsultStatus').classList.remove('rnConsultNOk')
                this.shadowRoot.querySelector('#rnConsultStatus') && this.shadowRoot.querySelector('#rnConsultStatus').classList.remove('rnConsultOk')
            }
        })

        this._closeRnConsultChangedNotification()
    }

    _isAvailableForHcp(hcpType, wsType) {
        return !!_.get(this, "matrixByHcpType." + wsType, []).find(hcp => hcp === hcpType)
    }

    _checkEhealthServiceForPhysician(hcp) {
        this.showPatientConsentState()
        this.showPatientTherLinkState()
        this.checkSumehrPresentOnHub()
        if (!this.sumehrContentOnPatientLoad) {
            this.getSumehrContent().then(res => this.set('sumehrContentOnPatientLoad', res))
        }
        this.getSumehrContent().then(res => this.set('sumehrContentOnPatientRefresh', res))
        this.updateEdmgStatus()
        this._consultRnHistory(_.get(this, 'patient', null))
        this._consultMda()
    }

    _checkEhealthServiceForMedicalHouse(hcp) {
        let dlg = this.root.querySelector('#genInsDialog')
        let dStart = null
        const date = new Date(), y = date.getFullYear(), m = date.getMonth()
        dStart = new Date(y, m, 1).getTime()

        if (!dlg.opened) this.set('curGenInsResp', null)
        console.log("getGeneralInsurabilityUsingGET on date", dStart)
        this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(this.cleanNiss(patient.ssin), _.get(this.api, "tokenIdMH", null), _.get(this.api, 'keystoreIdMH', null), _.get(this.api, 'credentials.ehpasswordMH', null), _.get(this.api, 'nihiiMH', null), _.get(this.api, 'MHContactPersonSsin', null), _.get(this.api, 'MHContactPersonName', null), "medicalhouse", dStart, null)
            .then(gi => {
                const genInsOk = !gi.faultCode && gi.insurabilities && gi.insurabilities.length && gi.insurabilities[0].ct1 && gi.insurabilities[0].ct1 !== '000' && !(gi.generalSituation && gi.generalSituation.length)
                const medicalHouse = gi.medicalHouseInfo && gi.medicalHouseInfo.medical && this.api.before(gi.medicalHouseInfo.periodStart, +new Date()) && (!gi.medicalHouseInfo.periodEnd || this.api.after(gi.medicalHouseInfo.periodEnd + 24 * 3600 * 1000, +new Date()))

                if (!dlg.opened) this.set('curGenInsResp', gi)

                this.shadowRoot.querySelector("#insuranceStatus") ? this.shadowRoot.querySelector("#insuranceStatus").classList.remove('medicalHouse') : null
                this.shadowRoot.querySelector("#insuranceStatus") ? this.shadowRoot.querySelector("#insuranceStatus").classList.remove('noInsurance') : null
                this.shadowRoot.querySelector("#insuranceStatus") ? this.shadowRoot.querySelector("#insuranceStatus").classList.remove('insuranceOk') : null

                this.shadowRoot.querySelector("#insuranceStatus") ? this.shadowRoot.querySelector("#insuranceStatus").classList.add(genInsOk ? medicalHouse ? 'medicalHouse' : 'insuranceOk' : 'noInsurance') : null
                //Polymer.updateStyles(this.$.insuranceStatus)

                if (genInsOk) {
                    //TODO: expected behaviour:
                    //1. if same mut and CT1/2 -> do nothing
                    //2. if different mut or CT1/2 -> close previous insurability and create new insurability
                    const ins = gi.insurabilities[0]
                    this.api.insurance().listInsurancesByCode(ins.mutuality).then(out => {
                        if (out && out.length) {
                            //find all patient insurabilities where insuranceId = out[0].Id and endDate is null or > today
                            let insuFound = false
                            insuFound = patient.insurabilities.filter(l => out.some(insu => l.insuranceId === insu.id) && (!l.endDate || l.endDate === ""))
                            if (insuFound && insuFound.length) {
                                insuFound.map(p => {
                                    //1 if found: check if CT1/2 is changed
                                    if (
                                        (ins.ct1 && (!p.parameters || p.parameters.tc1 !== ins.ct1))
                                        || (ins.ct2 && (!p.parameters || p.parameters.tc2 !== ins.ct2))
                                        || ins.period.periodStart < p.startDate
                                    ) {
                                        console.log('Insurability: CT1/2 changed or startdate changed')//1.2 if changed: close the found ins and create new with startdate today
                                        const newP = {}
                                        newP.identificationNumber = ins.regNrWithMut
                                        newP.insuranceId = out[0].id
                                        newP.startDate = ins.period.periodStart//moment().format('YYYYMMDD');
                                        newP.parameters = {
                                            tc1: ins.ct1,
                                            preferentialstatus: parseInt(ins.ct1) % 2 === 1 ? true : false,
                                            tc2: ins.ct2,
                                            paymentapproval: !!ins.paymentApproval
                                        }
                                        //2.1 close all other
                                        this.patient.insurabilities.map(p => {
                                                if (!p.endDate) p.endDate = ins.period.periodStart//moment().format('YYYYMMDD');
                                            }
                                        )
                                        //remove insurabilities with same startdate
                                        this.patient.insurabilities = this.patient.insurabilities.filter(it => it.startDate !== ins.period.periodStart && it.startDate < ins.period.periodStart)
                                        this.patient.insurabilities.push(newP)
                                        if (patient === this.patient) {
                                            this.api.queue(this.patient, 'patient').then(([pat, defer]) => {
                                                return this.api.patient().modifyPatientWithUser(this.user, this.patient).catch(e => defer.resolve(this.patient)).then(pt => this.api.register(pt, 'patient', defer)).then(p => {
                                                    this.dispatchEvent(new CustomEvent("patient-saved", {
                                                        bubbles: true,
                                                        composed: true
                                                    }))
                                                    Polymer.dom(this.root).querySelector('#pat-admin-card').patientChanged()
                                                })
                                            })
                                        }
                                    } else {
                                        //1.1 if not changed: do nothing
                                        console.log('Insurability: Nothing changed')
                                    }
                                })
                            } else {
                                console.log('Insurability: Mutuality changed')//2 if not found: create new with startdate today
                                const newP = {}
                                newP.identificationNumber = ins.regNrWithMut
                                newP.insuranceId = out[0].id
                                newP.startDate = ins.period.periodStart//moment().format('YYYYMMDD');
                                newP.parameters = {
                                    tc1: ins.ct1,
                                    preferentialstatus: parseInt(ins.ct1) % 2 === 1 ? true : false,
                                    tc2: ins.ct2,
                                    paymentapproval: !!ins.paymentApproval
                                }
                                //2.1 close all other
                                this.patient.insurabilities.map(p => {
                                        if (!p.endDate) p.endDate = ins.period.periodStart//moment().format('YYYYMMDD');
                                    }
                                )
                                //remove insurabilities with same startdate
                                this.patient.insurabilities = this.patient.insurabilities.filter(it => it.startDate !== ins.period.periodStart && it.startDate < ins.period.periodStart)
                                this.push("patient.insurabilities", newP)
                                if (patient === this.patient) {
                                    this.api.queue(this.patient, 'patient').then(([pat, defer]) => {
                                        return this.api.patient().modifyPatientWithUser(this.user, this.patient).catch(e => defer.resolve(this.patient)).then(pt => this.api.register(pt, 'patient', defer)).then(p => {
                                            this.dispatchEvent(new CustomEvent("patient-saved", {
                                                bubbles: true,
                                                composed: true
                                            }))
                                            Polymer.dom(this.root).querySelector('#pat-admin-card').patientChanged()
                                        })
                                    })
                                }
                            }

                        }
                    })
                }
            }).catch(e => {
            console.log("genins failed " + e.message)
            this.set('isLoading', false)
            return null
        })
    }

    showPatientTherLinkState() {
        this._getTherLinks().then(therLinks => {

            this.shadowRoot.querySelector('#tlStatus').classList.remove('noTl')
            this.shadowRoot.querySelector('#tlStatus').classList.remove('tlOk')
            this.shadowRoot.querySelector('#tlStatus').classList.remove('tlPending')

            _.get(therLinks, 'nationalResp.therapeuticLinks', []).length && _.get(therLinks, 'hubResp.therapeuticLinks', []).length ? this.shadowRoot.querySelector('#tlStatus').classList.add('tlOk') :
                _.get(therLinks, 'nationalResp.therapeuticLinks', []).length || _.get(therLinks, 'hubResp.therapeuticLinks', []).length ? (this.hubSupportsConsent ? this.shadowRoot.querySelector('#tlStatus').classList.add('tlPending') : this.shadowRoot.querySelector('#tlStatus').classList.add('tlOk')) :
                    this.shadowRoot.querySelector('#tlStatus').classList.add('noTl')

        })
    }

    checkSumehrPresentOnHub() {
        console.log("checkSumehrPresentOnHub sumehrOnHubChecked ?", this.sumehrOnHubChecked)
        if (this.hubReady && !this.sumehrOnHubChecked) {
            this.$.patHubDetail._getMostRecentSumehr().then(res => {
                console.log("checkSumehrPresentOnHub.res", res)
                this.set('sumehrPresentOnHub', res ? true : false)
            })
            this.set('sumehrOnHubChecked', true)
        }
    }

    getSumehrContent() {
        if (this.patient) {
            return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
                this.api.patient().getPatientWithUser(this.user, this.patient.id)
                    .then(patientDto =>
                        this.api.crypto()
                            .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                            .then(secretForeignKeys =>
                                this.api.bekmehricc.getSumehrV2Content(patientDto.id, {
                                    secretForeignKeys: secretForeignKeys.extractedKeys,
                                    recipient: hcp
                                }).then(resp =>
                                    this.api.contacticc.decryptServices(hcp.id, resp.services).then(
                                        svcs => {
                                            resp = this.removeTreatedServices(resp)
                                            resp = this.removeNotExportedPatientWill(resp)
                                            resp = this.sortItems(resp)
                                            resp.signature = md5(JSON.stringify(resp))
                                            return resp
                                        }
                                    )
                                )
                            ))
            )
        } else {
            return Promise.resolve(null)
        }
    }

    sortItems(newSumehr) {
        newSumehr.services = _.orderBy(newSumehr.services, ['id'], ['asc'])
        newSumehr.healthElements = _.orderBy(newSumehr.healthElements, ['id'], ['asc'])
        newSumehr.partnerships = _.orderBy(newSumehr.partnerships, ['partnerId'], ['asc'])
        newSumehr.patientHealthcareParties = _.orderBy(newSumehr.patientHealthcareParties, ['healthcarePartyId'], ['asc'])
        return newSumehr
    }

    removeTreatedServices(newSumehr) {
        const treatedServiceIds = newSumehr.healthElements.filter(he => he.idService).map(he => he.idService)
        console.log("treatedServiceIds", treatedServiceIds)
        newSumehr.services = newSumehr.services.filter(svc => !treatedServiceIds.includes(svc.id))
        return newSumehr
    }

    removeNotExportedPatientWill(newSumehr) {
        newSumehr.services = newSumehr.services.filter(svc => !this.api.contact().preferredContent(svc, this.language)
            || !this.api.contact().preferredContent(svc, this.language).stringValue
            || (!this.api.contact().preferredContent(svc, this.language).stringValue.includes('|noconsent')
                && !this.api.contact().preferredContent(svc, this.language).stringValue.includes('|notasked')))
        return newSumehr
    }

    compareSumehrContent(content1, content2) {
        var changed = false
        if (content1 && content2) {
            changed = !(content1.services.length === content2.services.length
                && content1.healthElements.length === content2.healthElements.length
                && content1.patientHealthcareParties.length === content2.patientHealthcareParties.length
                && content1.partnerships.length === content2.partnerships.length
                && content1.signature === content2.signature
            )
        } else if (content1 || content2) {
            changed = true
        }
        return changed
    }

    showPatientSumehrState() {
        const changed = this.compareSumehrContent(this.sumehrContentOnPatientLoad, this.sumehrContentOnPatientRefresh)
        console.log('showPatientSumehrState triggered present:', this.sumehrPresentOnHub, "changed:", changed, this.sumehrContentOnPatientLoad, this.sumehrContentOnPatientRefresh)
        this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.remove('noSumehr')
        this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.remove('sumehr')
        this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.remove('sumehrChange')
        if (this.sumehrPresentOnHub) {
            if (changed) {
                this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.add('sumehrChange')
                this.set('sumehrStatusDesc', this.localize('sumehr_data_changed', 'Patient data for sumehr changed', this.language))
            } else {
                this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.add('sumehr')
                this.set('sumehrStatusDesc', this.localize('sumehr_present', 'Sumehr present on hub', this.language))
            }
        } else {
            this.shadowRoot.querySelector('#sumehrStatus') && this.shadowRoot.querySelector('#sumehrStatus').classList.add('noSumehr')
            this.set('sumehrStatusDesc', this.localize('sumehr_not_present', 'Sumehr not present on hub', this.language))
        }
    }

    cleanNiss(niss) {
        return niss && niss.replace(/ /g, "").replace(/-/g, "").replace(/\./g, "").replace(/_/g, "").replace(/\//g, "")
    }

    showPatientConsentState() {
        this._getConsents().then(patientConsent => {
                this.shadowRoot.querySelector('#consentStatus') && this.shadowRoot.querySelector('#consentStatus').classList.remove('noConsent')
                this.shadowRoot.querySelector('#consentStatus') && this.shadowRoot.querySelector('#consentStatus').classList.remove('consentOk')
                this.shadowRoot.querySelector('#consentStatus') && this.shadowRoot.querySelector('#consentStatus').classList.remove('pendingConsent')

                !_.isEmpty(_.get(patientConsent, "nationalResp.consent", {})) && (!_.isEmpty(_.get(patientConsent, "hubResp", {})) || !this.hubSupportsConsent) ? this.shadowRoot.querySelector('#consentStatus').classList.add("consentOk") :
                    !_.isEmpty(_.get(patientConsent, "nationalResp.consent", {})) || !_.isEmpty(_.get(patientConsent, "hubResp", {})) ? this.shadowRoot.querySelector('#consentStatus').classList.add("pendingConsent") :
                        this.shadowRoot.querySelector('#consentStatus').classList.add("noConsent")

            }
        )
    }

    showPatientHubState() {
        this.$["hubStatus"] && this.shadowRoot.querySelector('#hubStatus') && this.shadowRoot.querySelector('#hubStatus').classList.remove('accessOk')
        this.$["hubStatus"] && this.shadowRoot.querySelector('#hubStatus') && this.shadowRoot.querySelector('#hubStatus').classList.remove('noAccess')

        this.set("hubReady", !this.hubSupportsConsent ? true :
            !!_.size(_.get(this.currentTherLinks, 'hubResp.therapeuticLinks', [])) && !_.isEmpty(_.get(this.currentConsents, "hubResp", {})) ? true : false)

        !this.hubSupportsConsent ? this.$["hubStatus"] && this.shadowRoot.querySelector('#hubStatus') && this.shadowRoot.querySelector('#hubStatus').classList.add('accessOk') :
            !!_.size(_.get(this.currentTherLinks, 'hubResp.therapeuticLinks', [])) && !_.isEmpty(_.get(this.currentConsents, "hubResp", {})) ? this.$["hubStatus"] && this.shadowRoot.querySelector('#hubStatus') && this.shadowRoot.querySelector('#hubStatus').classList.add('accessOk') :
                this.shadowRoot.querySelector('#hubStatus') && this.shadowRoot.querySelector('#hubStatus').classList.add('noAccess')
    }

    unselectAdminFile() {
        this.$.adminFileMenu.select(null)
    }

    newContact(e) {
        this.refreshPatient()
    }

    closeContact(e) {
        e.stopPropagation()
        e.preventDefault()

        const ctcId = e.target.id.substr(6)
        const year = this.contactYears.find(y => y.contacts.find(c => c.id === ctcId))
        const contact = year.contacts.find(c => c.id === ctcId)

        const ctcDetailPanel = this.shadowRoot.querySelector('#ctcDetailPanel')

        ;(ctcDetailPanel && ctcDetailPanel.shouldSave() && this.saveCurrentContact() || Promise.resolve(this.currentContact)).then(() => {
            if (contact) {
                if (!contact.rev && (!contact.services || contact.services.length === 0)) {
                    const idx = this.contactYears[0].contacts.indexOf(this.currentContact)
                    if (idx >= 0) {
                        this.splice('contactYears.0.contacts', idx, 1)
                    }
                    this.set('currentContact', null)
                } else {
                    this.api.contact().getContactWithUser(this.user, contact.id).then(c => {
                        c.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'));
                        (c.rev ? this.api.contact().modifyContactWithUser(this.user, c) : this.api.contact().createContactWithUser(this.user, c)).then(c => this.api.register(c, 'contact')).then(() => this.refreshPatient())
                        //this.notifyPath('currentContact.closingDate')
                    })
                }
            }
        })
    }

    _archive(event) {
        const model = event.detail
        if (model.he.id) {
            this.api.helement().getHealthElement(model.he.id).then(he => {
                if (!he.closingDate && he.closingDate !== 0) {
                    he.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'))
                }
                if ((he.status & 1) === 0) {
                    he.status = he.status | 1
                }
                if ((he.status & 2) === 0) {
                    he.status = he.status | 2
                }
                this.api.helement().modifyHealthElement(he).then(() => {
                    this.refreshPatient()
                })
            })
        } else if (model.he.idService) {
            if (!this.currentContact) {
                return
            }
            const svc = model.he.svc

            if (!svc.closingDate && svc.closingDate !== 0) {
                svc.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'))
            }
            if ((svc.status & 2) === 0) {
                svc.status = svc.status | 2
            }
            this.saveNewService(svc).then(c => this.refreshPatient())
        }
    }

    _activate(event) {
        const model = event.detail
        if (model.he.id) {
            this.api.helement().getHealthElement(model.he.id).then(he => {
                if (he.closingDate || he.closingDate === 0) {
                    he.closingDate = null
                }
                if ((he.status & 1) === 1) {
                    he.status = he.status - 1
                } //activate
                if ((he.status & 2) === 2) {
                    he.status = he.status - 2
                } //unarchive
                this.api.helement().modifyHealthElement(he).then(he => {
                    this.refreshPatient()
                })
            })
        } else if (model.he.idService) {
            if (!this.currentContact) {
                return
            }
            const svc = model.he.svc

            if (svc.closingDate || svc.closingDate === 0) {
                svc.closingDate = null
            }
            if ((svc.status & 1) === 1) {
                svc.status = svc.status - 1
            } //activate
            if ((svc.status & 2) === 2) {
                svc.status = svc.status - 2
            } //unarchive
            this.saveNewService(svc).then(c => this.refreshPatient())
        }
    }

    _inactivate(event) {
        const model = event.detail
        if (model.he.id) {
            this.api.helement().getHealthElement(model.he.id).then(he => {
                if (!he.closingDate && he.closingDate !== 0) {
                    he.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'))
                }
                if ((he.status & 2) === 2) {
                    he.status = he.status - 2
                } //unarchive
                this.api.helement().modifyHealthElement(he).then(he => {
                    this.refreshPatient()
                })
            })
        } else if (model.he.idService) {
            if (!this.currentContact) {
                return
            }
            const svc = model.he.svc

            if (!svc.closingDate && svc.closingDate !== 0) {
                svc.closingDate = parseInt(moment().format('YYYYMMDDHHmmss'))
            }
            if ((svc.status & 2) === 2) {
                svc.status = svc.status - 2
            } //unarchive

            this.saveNewService(svc).then(c => this.refreshPatient())
        }
    }

    _showLinkedProcedures(e) {
        e.stopPropagation()
        const healthElementId = _.get(e, "detail.he.id", null)
        if (healthElementId)
            this.$["preventiveActs"]._openDialog(healthElementId)
    }

    _journal() {
        this.set('selectedContacts', this.contacts)
        this.set('selectedContactIds', this.contacts.map(contact => "ctc_" + contact.id))
        this.updateContactYears()
    }

    _selectToday() {
        this.$.adminFileMenu.select(1)

        this.set('timeSpanStart', parseInt(moment().startOf('day').format('YYYYMMDD')))
        this.set('timeSpanEnd', null)

        this.updateContactYears()
    }

    _select6Months() {
        this.set('timeSpanStart', parseInt(moment().subtract(6, 'month').format('YYYYMMDD')))
        this.set('timeSpanEnd', null)

        this.updateContactYears()
    }

    _selectAll() {
        this.set('timeSpanStart', null)
        this.set('timeSpanEnd', null)

        this.updateContactYears()
    }

    _selectMoreOptions() {
        this.$['select-more-options-dialog'].open()
    }

    _closeMoreOptions() {
        this.$['select-more-options-dialog'].close()
        this._refreshContacts()
    }

    _selectBetweenTwoDates() {

        this.set('timeSpanStart', moment(this.dateStartAsString).format('YYYYMMDD') === "Invalid date" ? null : parseInt(moment(this.dateStartAsString).format('YYYYMMDD')))
        this.set('timeSpanEnd', moment(this.dateEndAsString).format('YYYYMMDD') === "Invalid date" ? null : parseInt(moment(this.dateEndAsString).format('YYYYMMDD')))

        this.updateContactYears()
    }

    _selectCurrentContact() {
        this.currentContact && this.currentContact.id && this.shadowRoot.querySelector('#_contacts_listbox').set('selectedValues', [this.currentContact.id])
    }

    _exportContactListAsCsv() {
        // Data mapping
        var dataColumns = [
            "openingDate",
            "userDescr",
            "author",
            "closingDate",
        ]

        // Human readable columns
        var hrColumns = [
            this.localize('date', 'Date', this.language),
            this.localize('descr', 'Description', this.language),
            this.localize('aut', 'Author', this.language),
            this.localize('endDate', 'Date de fin', this.language),
        ]

        // Define csv content, header = column names
        var csvFileContent = hrColumns.join(";") + "\n\n"
        const allContacts = _.concat(this.currentContact ? [this.currentContact] : [], this.contacts)
        var items = allContacts
        items = items.filter(this.contactFilter())

        // Rewrite date for HR, input = yyyymmdd, output = dd/mm/yyyy
        //items.forEach(item => item.dateOfBirth = item.dateOfBirth ? ("" + item.dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : this.localize('na_short', 'N/A'))

        // Populate / collect
        //items = items.map(item => _.pick(item, dataColumns))
        let newItems = items.map(item => {
            let newitem = {}
            dataColumns.forEach((key, idx) => {
                newitem[hrColumns[idx]] = item[key]
                if (key == "openingDate" || key == "closingDate") {
                    newitem[hrColumns[idx]] = newitem[hrColumns[idx]] ? this.api.moment(newitem[hrColumns[idx]]).format("YYYY-MM-DD hh:mm:ss") : ""
                }
                if (key == "userDescr") {
                    newitem[hrColumns[idx]] = (newitem[hrColumns[idx]] || "").replace(/(\r\n|\n|\r)/gm, " ")
                }
                if (key == "author") {
                    newitem[hrColumns[idx]] = this.hcp(item)
                }
            })
            newitem["openingDate"]
            return newitem
        })

        this.generatePdfFile(items)
        //this.generateXlsFile(newItems, "contact-list_" + moment().format("YYYYMMDD-HHmmss") + ".csv", "Contact List", "Topaz")
    }

    generatePdfFile(contacts) {
        const printer = this.shadowRoot.querySelector("#printDocument")
        if (!printer) return
        this.set('SpinnerActive', true)
        //printer.printPatient(this.patient, contacts, this.documentTypes, this.patientHealthCarePartiesById).then(() => {
        //    console.log("printed");
        //    this.set('SpinnerActive', false);
        //});
        const selectedContacts = this.selectedContacts && this.selectedContacts.length > 1 ? this.selectedContacts : contacts
        printer._printPatient(this.patient, selectedContacts, this.documentTypes, this.patientHealthCarePartiesById, () => {
            console.log("printed")
            this.set('SpinnerActive', false)
        })
    }

    generateXlsFile(data, filename, title, author) {
        // FIXME: xls is truncated at 255 chars and xlsx is corrupt, i use csv for the moment

        // Create xls work book and assign properties
        filename = filename || ("patient-list_" + moment().format("YYYYMMDD-HHmmss") + ".xlsx")
        title = title || "Patients list"
        author = author || "iCure"
        const xlsWorkBook = {SheetNames: [], Sheets: {}}
        xlsWorkBook.Props = {Title: title, Author: author}

        // Create sheet based on json data collection
        var xlsWorkSheet = XLSX.utils.json_to_sheet(data)

        // Link sheet to workbook
        XLSX.utils.book_append_sheet(xlsWorkBook, xlsWorkSheet, title)

        // Virtual data output
        var xlsWorkBookOutput = new Buffer(XLSX.write(xlsWorkBook, {bookType: 'csv', type: 'buffer', FS: "\t"}))

        // Put output to virtual "file"
        var fileBlob = new Blob([xlsWorkBookOutput], {type: "application/vnd.ms-excel"})

        // Create download link and append to page's body
        var downloadLink = document.createElement("a")
        document.body.appendChild(downloadLink)
        downloadLink.style = "display: none"

        // Create url
        var urlObject = window.URL.createObjectURL(fileBlob)

        // Link to url
        downloadLink.href = urlObject
        downloadLink.download = filename

        // Trigger download and drop object
        downloadLink.click()
        window.URL.revokeObjectURL(urlObject)

        // Free mem
        fileBlob = false
        xlsWorkBookOutput = false

        return
    }


    updateContactYears() {
        this.notifyPath('contactYears')
    }

    getHeId(he) {
        return he.id ? `_he_${he.id}` : `_svc_${he.idService}`
    }

    getContacts(he) {
        return this.contacts
    }

    contactFilter() {
        return (ctc) => {
            const regExp = this.contactSearchString && new RegExp(this.contactSearchString, "i")

            const heHeIds = this.selectedHealthcareElements.map(he => he.healthElementId).filter(x => !!x)
            const heIds = _.uniq(this.selectedHealthcareElements.map(he => he.id).concat((this.healthElements || []).filter(h => h.healthElementId && heHeIds.includes(h.healthElementId)).map(he => he.id)))
            const poaIds = _.flatMap(this.selectedHealthcareElements, he => he.selectedPlansOfAction ? he.selectedPlansOfAction.map(p => p.id) : [])
            const svcIds = this.selectedHealthcareElements.filter(he => !he.id).map(he => he.idService)

            return this.api.after(ctc.openingDate, this.timeSpanStart)
                && this.api.before(ctc.openingDate, this.timeSpanEnd)
                && (!regExp || ctc.subContacts.some(sc => sc.descr && sc.descr.match(regExp) && sc.services.length)
                    || ctc.services.some(s => this.shortServiceDescription(s, this.language).match(regExp))
                    || this.hcp(ctc).match(regExp))
                && (!heIds.length && !poaIds.length && !svcIds.length
                    || ctc.subContacts.some(sc => (sc.healthElementId && heIds.includes(sc.healthElementId) || sc.planOfActionId && poaIds.includes(sc.planOfActionId)))
                    || ctc.services.some(s => svcIds.includes(s.id)))
                && (!this.contactFilters || !this.contactFilters.length
                    || ctc.services.some(s => s.tags && s.tags.some(t => this.contactFilters.some(cf =>
                        cf.every(f => f.code.some(c => f.type === t.type && c === t.code)))))
                    || ctc.tags.some(t => this.contactFilters.some(cf =>
                        cf.every(f => f.code.some(c => f.type === t.type && c === t.code))))
                    || ctc.subContacts.some(s => s.tags && s.tags.some(t => this.contactFilters.some(cf =>
                        cf.every(f => f.code.some(c => f.type === t.type && c === t.code)))))
                )
                && (
                    this.statutFilter === "all" || this.contactStatutChecked.some(id => id === ctc.id)
                )
                && (
                    !this.moreOptionsUser || this.moreOptionsUser === ctc.author
                )
                && (
                    this.contactStatusFilter === "all" || (
                        // 1<<0 = Labresult ; 1<<5 = Protocol ; 1<<6 = imported document
                        (ctc.subContacts.some(s => !!(parseInt(_.get(s, "status", 0)) & (1 << 0)) || !!(parseInt(_.get(s, "status", 0)) & (1 << 5)) || !!(parseInt(_.get(s, "status", 0)) & (1 << 6)))) && (
                            this.documentType === "all" || (
                                ctc.tags && ctc.tags.some(tag => tag.code && tag.code === this.documentType) ||
                                ctc.services && ctc.services.some(service => service.tags && service.tags.some(tag => tag.code && tag.code === this.documentType)) ||
                                ctc.subContacts && ctc.subContacts.some(sctc => sctc.tags && sctc.tags.some(tag => tag.code && tag.code === this.documentType))
                            )
                        )
                    )
                )
                || !ctc.closingDate

        }
    }

    _moreOptionsUsersFilterChanged() {
        if (this.moreOptionsUsersFilter) {
            const keywordsString = _.trim(_.get(this, "moreOptionsUsersFilter", "")).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            const keywordsArray = _.compact(_.uniq(_.map(keywordsString.split(" "), i => _.trim(i))))
            setTimeout(() => {
                if (parseInt(_.get(keywordsString, "length", 0)) > 0) {
                    const results = _.chain(_.get(this, "_moreOptionsUsers", []))
                        .chain(_.get(this, "moreOptionsUsersFilter", []))
                        .filter(i => _.size(keywordsArray) === _.size(_.compact(_.map(keywordsArray, keyword => i.name.toLowerCase().normalize('NFD').includes(keyword) ? keyword : null))))
                        .compact()
                        .uniq()
                        .orderBy(['name'], ['asc'])
                        .value()
                    this.set('moreOptionsUsers', _.sortBy(results, ['name'], ['asc']))
                } else {
                    this.set('moreOptionsUsers', _.sortBy(this._moreOptionsUsers, ['name'], ['asc']))
                }
            }, 100)
        }
    }

    compareContacts(a, b) {
        return this.sortCriterion === 'document' ?
            (this.sortDirection === 'desc' ? b.created - a.created : a.created - b.created) :
            (this.sortDirection === 'desc' ? b.openingDate - a.openingDate : a.openingDate - b.openingDate)
        // return b.openingDate - a.openingDate;
    }

    updateCriterionSorter() {
        this.set("contactStatusAll", this.contactStatusFilter === "all")
        this.shadowRoot.querySelector("#sort-criterion").selectedItem = this.sortCriteria[0]
        this.shadowRoot.querySelector("#document-type").selectedItem = this.documentTypes[0]
    }

    close() {
        this.set('patient', null)
    }


    _editHealthElement(event) {
        this.saveCurrentContact().then(c => this.api.register(c, 'contact'))
            .then(() => {
                ;(_.size(_.get(event, 'detail.he.codes', [])) ? this.api.code().getCodes(_.get(event, 'detail.he.codes', []).map(c => c.id).join(',')) : Promise.resolve([]))
                    .then(codes => {
                        this.set('editedHealthElementModel', _.get(event, 'detail', {}))
                        !_.get(this, 'editedHealthElementModel.he.openingDate', null) ? this.set('editedHealthElementModel.he.openingDate', _.get(this, 'editedHealthElementModel.he.created', null) ? this.api.moment(_.get(this, 'editedHealthElementModel.he.created', null)).format('YYYY-MM-DD') : null) : null
                        this.$['edit-healthelement-dialog'].set('entity', _.assign(_.assign({plansOfAction: []}, _.get(event, 'detail.he', {})), {codes: codes}))
                        this.$['edit-healthelement-dialog'].open()
                    })
            })
    }

    toggleMenu(e) {
        e.stopPropagation()
        e.preventDefault()
        styx.parent(e.target, el => el.tagName.toLowerCase() === 'collapse-button').toggle()
        styx.parent(e.target, el => el.tagName.toLowerCase() === 'paper-item').classList.toggle('opened')

        this._updateFilterPanels()
    }

    getPaperItemParentForEvent(e) {
        let tgt = e.target
        while (tgt && tgt.tagName && tgt.tagName.toLowerCase() !== 'paper-item') {
            tgt = tgt.parentElement
        }
        return tgt && tgt.tagName ? tgt : null
    }

    getPaperListboxParent(tgt) {
        while (tgt && tgt.tagName && tgt.tagName.toLowerCase() !== 'paper-listbox') {
            tgt = tgt.parentElement
        }
        return tgt && tgt.tagName ? tgt : null
    }

    handleSelectionChange(e) {
        e.preventDefault()
        e.stopPropagation()
        document.getSelection().removeAllRanges()

        const selections = e.detail.selections
        const selChanges = {} // Map with new selected indexes for each listbox id

        selections.forEach(s => {
            if (s.action === 'unselect') {
                this.set('selectedAdminOrCompleteFileIndex', null)
            }
            ;(s.items || this.selectedHealthcareElements.map(he => this.getHeId(he))).forEach(id => {
                const item = this.root.querySelector('#' + id)
                if (item) {
                    const listBox = this.getPaperListboxParent(item)
                    if (listBox) {
                        const selChangesEntry = selChanges[listBox.id] || (selChanges[listBox.id] = {
                            el: listBox,
                            selectedValues: listBox.selectedValues
                        })
                        if (s.action === 'select') {
                            selChangesEntry.selectedValues = _.uniq(selChangesEntry.selectedValues.concat([listBox.items.indexOf(item)]))
                        } else if (s.action === 'extend') {
                            if (selChangesEntry.selectedValues && selChangesEntry.selectedValues.length) {
                                const min = Math.min(...selChangesEntry.selectedValues)
                                const max = Math.max(...selChangesEntry.selectedValues)
                                const idx = listBox.items.indexOf(item)
                                selChangesEntry.selectedValues = _.uniq(selChangesEntry.selectedValues.concat(idx < min ? _.range(idx, min) : _.range(max + 1, idx + 1)))
                            }
                        } else if (s.action === 'unselect') {
                            const delValue = listBox.items.indexOf(item)
                            selChangesEntry.selectedValues = selChangesEntry.selectedValues.filter(it => it !== delValue)
                        }
                    }
                }
            })
        })
        Object.values(selChanges).forEach(c => c.el.set('selectedValues', c.selectedValues))
        if (this.selectedHealthcareElements.length === 0 && this.selectedAdminOrCompleteFileIndex !== 0) {
            this.set('selectedAdminOrCompleteFileIndex', 1)
        }
    }

    selectedAdminFileChanged(el) {
        if (el && this.selectedHealthcareElements && this.selectedHealthcareElements.length && this.selectedAdminOrCompleteFileIndex === 1) {
            //this.set("selectedHealthcareElements", []);
            this.root.querySelectorAll('paper-listbox.menu-content').forEach(plb =>
                plb.set('selectedValues', [])
            )
        }
        this._updateFilterPanels()
    }

    selectedMedicationsChanged() {
        // useful for debug
        const sel = this.selectedMedications.length && this.selectedMedications[0].id.substr(5)
        if (sel) {
            console.log("selected medication: ", this.medications && this.medications.find(med => med.id == sel))
        }
    }

    selectedMainElementItemsChanged(event) {
        const domRepeat = event.target.querySelector("dom-repeat")
        const selectedModels = _.compact(event.target.selectedItems.map(el => {
            const model = domRepeat.modelForElement(el)
            return model && (model.he || model.risk || model.allergy)
        }))

        if (!domRepeat || !selectedModels) {
            return
        }
        const allModels = domRepeat.items || []

        let finalSelection = this.selectedHealthcareElements.filter(he => !allModels.includes(he)).concat(selectedModels)
        //console.log(finalSelection.map(he=>he.descr).join(","))
        console.log("selected HE:", finalSelection) // useful for debug
        this.set('selectedHealthcareElements', finalSelection)
    }

    _isItemInArray(item, selectedItems) {
        return selectedItems && selectedItems.includes(item)
    }

    selectedHealthcareElementsSpliced(changeRecord) {
        if (changeRecord) {
            this.updateContactYears()
        }
    }

    isNotEmpty(a) {
        return a && a.length > 0
    }

    isEmpty(a) {
        return !a || a.length === 0
    }

    isAdminSelected(el) {
        if (el === 0) {
            this.closePostit()
            return true
        } else {
            if (this.patient) {
                this.set('postitMsg', this.patient.note)
            }
            return false
        }
    }

    highlightedServiceLabels(user) {
        try {
            return user.properties.filter(p => p.type.identifier === 'org.taktik.icure.highlightedServiceLabels').map(p => JSON.parse(p.typedValue.stringValue))[0] || ['Motif', 'Examen clinique', 'Diagnostics', 'Conclusion', 'Prescription']
        } catch (e) {
        }
        return ['Examen clinique', 'Diagnostics', 'Prescription']
    }

    hcp(ctc) {
        const usr = this.api.users && this.api.users[ctc.author]
        //const hcp = usr ? this.api.hcParties[usr.healthcarePartyId] : null;
        const hcpid = ctc.responsible ? ctc.responsible : (usr ? usr.healthcarePartyId : null)
        let hcp = hcpid && this.patientHealthCarePartiesById ? this.patientHealthCarePartiesById[hcpid] : null
        hcp = hcp ? hcp : (hcpid ? this.api.hcParties[hcpid] : null)
        let name
        if (hcp && hcp.name != null && hcp.name != "") {
            name = hcp && hcp.name
        } else {
            name = hcp && hcp.lastName + " " + (hcp.firstName && hcp.firstName.length && hcp.firstName.substr(0, 1) + ".")
        }
        return name || usr && usr.login || "N/A"
    }

    picture(pat) {
        if (!pat) {
            return require('../../../images/male-placeholder.png')
        }
        return pat.picture ? 'data:image/png;base64,' + pat.picture : (pat.gender && pat.gender.substr(0, 1).toLowerCase() === 'f') ? require('../../../images/female-placeholder.png') : require('../../../images/male-placeholder.png')
    }

    serviceDescriptions(ctc, label) {
        return this.api && this.api.contact().services(ctc, label).filter(s => !s.endOfLife).map(s => this.shortServiceDescription(s, this.language)).filter(desc => desc) || []
    }

    shortServiceDescription(svc, lng) {
        let rawDesc
        if (svc && svc.tags && svc.tags.some(t => t.type == "SOAP" && t.code == "Plan")) {
            rawDesc = svc.content && svc.content.descr && svc.content.descr.stringValue || ""
        } else {
            rawDesc = this.api.contact().shortServiceDescription(svc, lng) || ""
        }
        return rawDesc && '' + rawDesc || ''
    }

    shortMedicationDescription(svc, lng) {
        let rawContent = svc && this.api && this.api.contact().preferredContent(svc, lng)
        return rawContent && rawContent.medicationValue && `${this.api.contact().medication().medicationNameToString(rawContent.medicationValue)} ${this.api.contact().medication().posologyToString(rawContent.medicationValue, lng)}` || ''
    }

    contentHasData(c) {
        return this.api && this.api.contact().contentHasData(c) || false
    }

    _openChartsDialog(e) {
        e.stopPropagation()
        this.$["patChartsDialog"].open()
    }

    _addHealthElement(e) {
        this.$['add-healthelement-dialog'].open()
        this.$['add-healthelement-dialog'].set('entity', {
            plansOfAction: [],
            tags: (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({
                id: c,
                type: c.split('|')[0],
                code: c.split('|')[1],
                version: c.split('|')[2]
            }))
        })
    }

    _addInactiveHealthElement(e) {
        this.$['add-healthelement-dialog'].open()
        this.$['add-healthelement-dialog'].set('entity', {
            plansOfAction: [],
            closingDate: parseInt(moment().format('YYYYMMDDHHmmss')),
            tags: (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({
                id: c,
                type: c.split('|')[0],
                code: c.split('|')[1],
                version: c.split('|')[2]
            }))
        })
    }

    _addMedication(e) {
        // const id = this.api.crypto().randomUuid();
        // const medicationValue = { regimen: [] }
        // const newMedication =  {
        //     label: this.localize('medication','medication',this.language), id: id,
        //     content: _.fromPairs([[this.language, { medicationValue: medicationValue }]]),
        //     tags: (e.target.dataset.tags ? e.target.dataset.tags.split(',') : []).map(c => ({ id: c, type: c.split('|')[0], code: c.split('|')[1], version: c.split('|')[2] }))
        // };

        this.currentSelectMedicationEventDetail = null
        // this.$['medication-prescription'].open(newMedication, { id: id, medicationValue: medicationValue, isNew: true } );
        this.$['medication-prescription'].open(e.detail.service, {isPrescription: false})

    }

    _editMedication(e) {
        const id = e.target.id.substr("med-edit-btn-edit_".length)
        const medicationService = this.medications.find(s => s.id === id)
        this.currentSelectMedicationEventDetail = null
        this.currentMedicationDetailEventDetail = null
        this.$['medication-detail'].open(medicationService, {
            id: medicationService.id,
            medicationValue: (this.api.contact().preferredContent(medicationService, this.language) || (medicationService.content[this.language] = {medicationValue: {regimen: []}})).medicationValue,
            isNew: false,
            isPrescription: e.detail.isPrescription
        })
    }

    _selectMedication(e) {
        this.currentSelectMedicationEventDetail = e.detail
        this.$['medication-selection'].open(e.detail.service, e.detail.content)
    }

    // _selectMultiMedication(e) {
    //     this.currentSelectMedicationEventDetail = e.detail
    //     this.$['medication-prescription'].open(e.detail.service, {isPrescription: true});
    // }

    _selectMultiMedication(e) {
        this.currentMedicationDetailEventDetail = e.detail
        this.$['medication-prescription'].open(e.detail.service, {isPrescription: true})
    }

    _saveMedications(e) {
        if (this.currentMedicationDetailEventDetail && this.currentMedicationDetailEventDetail.onCreate) {
            this.currentMedicationDetailEventDetail.onCreate(e)
        }
    }

    _medicationDetail(e) {
        this.currentMedicationDetailEventDetail = e.detail
        this.$['medication-detail'].open(e.detail.service, e.detail.content)
    }

    _medicationsDetail(e) {
        this.currentMedicationDetailEventDetail = e.detail
        this.$['medication-detail'].openList(e.detail.services)
    }

    // _medicationCreated(e) {
    //     if (this.currentSelectMedicationEventDetail && this.currentSelectMedicationEventDetail.onCreate) {
    //         this.currentSelectMedicationEventDetail.onCreate(e)
    //     } else {
    //         if (!this.currentContact) {
    //             return;
    //         }
    //         this._displayMedicationDetails(e)
    //     }
    // }

    // _medicationsCreated(e) {
    //     if (this.currentSelectMedicationEventDetail && this.currentSelectMedicationEventDetail.onCreate) {
    //         this.currentSelectMedicationEventDetail.onCreate(e)
    //     } else {
    //         if (!this.currentContact) {
    //             return;
    //         }
    //         this._displayMedicationDetails(e)
    //     }
    // }

    // _medicationValueChanged(e) {
    //     if (this.currentSelectMedicationEventDetail && this.currentSelectMedicationEventDetail.onValueChanged) {
    //         this.currentSelectMedicationEventDetail.onValueChanged(e)
    //     }
    // }

    _createNewMedications(e) {
        const medicationArray = e.detail.medications ? e.detail.medications : [e.detail.medication]
        Promise.all(medicationArray.map(m => {
            if (m.options && (m.options.createMedication || !m.options.isPrescription)) {
                const newMedication = _.cloneDeep(_.omit(m.newMedication, ["id"]));
                (this.api.contact().medicationValue(newMedication, this.language) || {endMoment: ""}).endMoment = null
                newMedication.tags = newMedication.tags && newMedication.tags.filter(tag => !(tag.type === "ICURE" && tag.code === "PRESC")) || [];
                (newMedication.tags.find(tag => tag.type === "CD-ITEM") || (newMedication.tags[newMedication.tags.length] = {
                    type: "CD-ITEM",
                    version: "1"
                })).code = "medication"
                newMedication.label = this.localize('medication', 'medication', this.language)
                newMedication.id = this.api.crypto().randomUuid()
                return this.saveNewService(this.api.contact().service().newInstance(this.user, newMedication))
            }
            return null
        }))
            .then((results) => results.find(r => r) && this.refreshPatient())
    }

    _medicationDetailValueChanged(e) {
        //In case we get here coming from the prescription dialog by checking the checkbox
        if (this.currentMedicationDetailEventDetail && this.currentMedicationDetailEventDetail.onValueChanged) {
            this.currentMedicationDetailEventDetail.onValueChanged(e)
            this._createNewMedications(e)
        } else {
            //Standard behaviour: create from medication button in left panel
            this.saveNewService(this.api.contact().service().newInstance(this.user, e.detail.medication.newMedication)).then(() => this.refreshPatient())
        }
    }


    // _displayMedicationDetails(e) {
    //     if (this.currentSelectMedicationEventDetail && this.currentSelectMedicationEventDetail.onShowDetails) {
    //         this.currentSelectMedicationEventDetail.onShowDetails(e)
    //     } else {
    //         const medicationService = e.detail.medication
    //         this.$['medication-detail'].open(e.detail.medication, {
    //             id: medicationService.id,
    //             medicationValue: (this.api.contact().preferredContent(medicationService, this.language) || (medicationService.content[this.language] = {medicationValue: {regimen: []}})).medicationValue,
    //             isNew: true,
    //             isPrescription: e.detail.isPrescription
    //         });
    //     }
    // }

    _healthElementsSelectorColumns() {
        return [{key: 'descr', title: 'Description'}, {key: 'plansOfActionDescr', title: 'Plans of action'}]
    }

    _healthElementsSelectorDataProvider() {
        return {
            filter: function (filterValue, limit, offset, sortKey, descending, cds = ['BE-THESAURUS']) {
                const noDiacFilterValue = filterValue && filterValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")

                const regExp = noDiacFilterValue && new RegExp(noDiacFilterValue.replace(/\s+/, '.*'), "i")
                const words = noDiacFilterValue && noDiacFilterValue.toLowerCase().split(/\s+/)
                const sorter = x => {
                    const key = (x.descr || x.name || '').normalize('NFD').replace(/[\u0300-\u036f ]/g, "").toLowerCase()
                    return [key.startsWith(words[0]), key]
                }

                const promises = [this.api.entitytemplate().findEntityTemplates(this.user.id, 'org.taktik.icure.entities.HealthElementTemplate', null, true)]
                cds.forEach(cd => promises.push(this.api.code().findPaginatedCodesByLabel('be', cd, 'fr', words[0], null, null, 1000)))

                return Promise.all(promises).then(results => {
                    const entityTemplates = results[0]
                    const codes = _.flatMap(results.slice(1), cs => cs.rows)
                    const filtered = _.flatten(entityTemplates.map(et => et.entity)).filter(he => [he].concat(he.plansOfAction || []).some(it => it.descr && it.descr.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").match(regExp) || it.name && it.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").match(regExp)))
                        .map(it => ({
                            descr: it.descr || it.name,
                            healthElement: it,
                            plansOfAction: it.plansOfAction || [],
                            plansOfActionDescr: (it.plansOfAction && it.plansOfAction.map(poa => poa.descr || poa.name) || []).join(',')
                        }))
                        .concat(codes.filter(c => words.every(w => this.api.localize(c.label).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(w))).map(code => ({
                            descr: this.api.localize(code.label),
                            codes: [code.id].concat(code.links),
                            plansOfAction: [],
                            plansOfActionDescr: 'N/A'
                        })))
                    return {
                        totalSize: filtered.length,
                        rows: (descending ? _.reverse(_.sortBy(filtered, sorter)) : _.sortBy(filtered, sorter)).slice(offset, limit)
                    }
                })
            }.bind(this),
            filterDrugs: (filterValue, limit = 100, offset = 0, sortKey = name, descending) => {
                return Promise.all([
                    this.api.bedrugs().getMedecinePackages(filterValue, this.language.toLowerCase(), null, offset, limit),
                    this.api.bedrugs().getMedecinePackagesFromIngredients(filterValue, this.language.toLowerCase(), null, offset, limit)
                ])
                    .then(([packs, packsIng]) => {
                        const newItems = _.unionBy(packs, packsIng, 'id.id')
                        if (newItems.length > 0) {

                        }
                        return {rows: _.sortBy(newItems, sortKey)}
                    })
            },
            filterDrugsSamV2: (filterValue, limit = 100, offset = 0, sortKey = name, descending) => {
                const AmpPromise = this.api.besamv2().findPaginatedAmpsByLabel(this.language, filterValue, null, null, limit)
                    .then(results => (results && results.rows || []))
                    .then(amps => amps.filter(amp =>
                        amp.status === "AUTHORIZED" && !amp.to && amp.ampps && amp.ampps.some(ampp =>
                        !ampp.to &&
                        ampp.atcs && ampp.atcs.length &&
                        ampp.dmpps && ampp.dmpps.length && ampp.dmpps.some(dmpp => dmpp.deliveryEnvironment === 'P')
                        )
                    ))

                const VmpGroupPromise = this.api.besamv2().findPaginatedVmpGroupsByLabel(this.language, filterValue, null, null, limit)
                    .then(results => (results && results.rows || []))

                return Promise.all([
                    AmpPromise,
                    VmpGroupPromise
                ])
                    .then(([ampRes, vmpGroupRes]) => _.unionBy(ampRes || [], vmpGroupRes || [], "id"))
                    .then(results => results.filter(result => !result.to && result.name && result.name[this.language]).map(result => Object.assign(result, {name: result.name[this.language]})))
                    .then(results => {
                        return {rows: _.sortBy(results, sortKey)}
                    })

                // .then(results => (results && results.rows || []))
                // .then(rows => rows.reduce((ampps, row) => {
                //         if (row.ampps && row.ampps.length) {
                //             return ampps.concat(row.ampps.map(ampp => {
                //                 const publicDmpp = ampp.dmpps.find(dmpp => dmpp.deliveryEnvironment === "P");
                //                 const groupId = row.vmp && row.vmp.vmpGroup && row.vmp.vmpGroup.id || "";
                //                 const id = {id: (publicDmpp && publicDmpp.codeType === 'CNK' && publicDmpp.code || "")}
                //                 const atcCode = ampp && ampp.atcs && ampp.atcs.length && ampp.atcs[0] || ""; // todo: get all atcs!
                //                 id.id && (((ampp.codes || (ampp.codes = [])).find(c => c.type === "CD-DRUG-CNK") || (ampp.codes[ampp.codes.length] = {
                //                     type: "CD-DRUG-CNK",
                //                     version: "0.0.1"
                //                 })).code = id.id);
                //                 atcCode && (((ampp.codes || (ampp.codes = [])).find(c => c.type === "CD-ATC") || (ampp.codes[ampp.codes.length] = {
                //                     type: "CD-ATC",
                //                     version: "0.0.1"
                //                 })).code = atcCode.code);
                //                 return Object.assign(
                //                     ampp,
                //                     {
                //                         id: id,
                //                         groupId: groupId,
                //                         publicDmpp: publicDmpp,
                //                         name: (ampp.prescriptionName && ampp.prescriptionName[this.language]) || (publicDmpp && publicDmpp.prescriptionName && publicDmpp.prescriptionName[this.language]) || (ampp.abbreviatedName && ampp.abbreviatedName[this.language]) || '',
                //                         amp: row
                //                     }
                //                 )
                //             }));
                //         }
                //         return ampps;
                //     }, [])
                //         .filter(e => e.publicDmpp && e.id && e.id.id && e.name)
                //         .filter((e, i, a) => a.findIndex(x => x.id.id === e.id.id) === i)
                // )
                // .then(packs => {
                //     return {rows: _.sortBy(packs, sortKey)}
                // })
            }
        }
    }

    _medicinePackageAdapter(results) {
        if (results && results.length) {
            return Promise.all(results.map(med => this.api.bedrugs().getMppInfos(med.id.id, this.language === 'en' ? 'fr' : this.language || 'fr')
                .then(mppInfos => {
                    mppInfos.id.id && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-DRUG-CNK') || (med.codes[med.codes.length] = {
                        type: 'CD-DRUG-CNK',
                        version: '0.0.1'
                    })).code = med.id.id)
                    mppInfos.atcCode && (((med.codes || (med.codes = [])).find(c => c.type === 'CD-ATC') || (med.codes[med.codes.length] = {
                        type: 'CD-ATC',
                        version: '0.0.1'
                    })).code = mppInfos.atcCode)

                    return this._buildListItem(mppInfos)
                })))
                .catch(err => {
                    console.log("error:", err)
                    return []
                })
        } else {
            return Promise.resolve([])
        }
    }


    _normalizedHealthElement(healthElement) {
        return {
            descr: healthElement.descr,
            openingDate: healthElement.openingDate, // auto-filled by backend if null (longfuzzy)
            closingDate: healthElement.closingDate,
            status: healthElement.status || 0,
            plansOfAction: (healthElement.plansOfAction || []).map(poa => _.extend(poa, {
                id: this.api.crypto().randomUuid(),
                openingDate: parseInt(moment().format('YYYYMMDDHHmmss'))
            })),
            tags: (healthElement.tags || []).map(c => this.api.code().normalize(c)),
            codes: (healthElement.codes || []).map(c => this.api.code().normalize(c)),
            note: healthElement.note,
            idService: healthElement.idService
        }
    }

    _addedHealthElementSelected(event, healthElement) {
        this.saveCurrentContact()
            .then(c => this.api.register(c, 'contact'))
            .then(() => this.api.helement().newInstance(this.user, this.patient, this._normalizedHealthElement(healthElement)).then(he => this.api.helement().createHealthElement(he)).then(() => this.refreshPatient()))
    }

    _editedHealthElementSelected(event, healthElement) {
        if (this.editedHealthElementModel.he.id) {
            this.api.helement().getHealthElement(this.editedHealthElementModel.he.id).then(he => {
                delete healthElement.plansOfActionDescr
                _.assign(he, this._normalizedHealthElement(healthElement))
                he.id = this.api.crypto().randomUuid()
                delete he.rev
                return he
            }).then(he => this.api.helement().createHealthElement(he)).then(he => this.refreshPatient())
        } else if (this.editedHealthElementModel.he.idService) {
            const svc = this.editedHealthElementModel.he.svc
            return this.api.helement().serviceToHealthElement(this.user, this.patient, svc,
                this.api.contact().shortServiceDescription(svc, language)).then(he => {
                if (this.currentContact) {
                    this.api.contact().promoteServiceInContact(this.currentContact, this.user, this.contacts, svc, undefined, null, [he.id], null)
                    this.saveCurrentContact().then(c => this.refreshPatient())
                }

                this.editedHealthElementModel.he = he
                return this._editedHealthElementSelected(event, healthElement)
            })
        }
    }

    _servicesSelectorColumns() {
        return [{
            key: svc => svc && svc.content && this.shortServiceDescription(svc, this.language) || '',
            sortKey: 'content.' + this.language + '.stringValue',
            title: 'Description'
        }, {
            key: svc => svc && svc.codes && svc.codes.map(c => (c.type || c.id && c.id.split('|')[0]) + ':' + (c.code || c.id && c.id.split('|')[1])).join(',') || '',
            sortKey: 'codes.0.code',
            title: 'Codes'
        }]
    }

    _servicesSelectorDataProvider(label) {
        return {
            filter: function (filterValue, limit, offset, sortKey, descending) {
                const regExp = filterValue && new RegExp(filterValue, "i")

                return this.api.code().findPaginatedCodesByLabel('be', 'BE-THESAURUS', 'fr', filterValue, null, null, 1000).then(results => {
                    const filtered = results.rows.map(code => ({
                        label: label,
                        content: _.mapValues(code.label, v => ({stringValue: v})),
                        codes: code.links && code.links.map(c => ({
                            id: c,
                            type: c.split('|')[0],
                            code: c.split('|')[1],
                            version: c.split('|')[2]
                        })) || []
                    }))
                    return {
                        totalSize: filtered.length,
                        rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(offset, limit)
                    }
                })
            }.bind(this)
        }
    }

    _addedOrEditedServiceSelected(event, svc) {
        if (!this.currentContact) {
            return
        }
        this.saveNewService(svc).then(c => this.refreshPatient())
    }

    _svcEntityContentChanged(e, value) {
        const svc = styx.parent(e.target, el => el.tagName.toLowerCase() === 'entity-selector').entity
        const content = (this.api.contact().preferredContent(svc, this.language) || {}).stringValue = value
    }

    _updateFilterPanels() {
        setTimeout(() => {
            const cfp = this.shadowRoot.querySelector('#contactFilterPanel')
            cfp && cfp.refreshIcons()
            const hpd = this.shadowRoot.querySelector('#ht-pat-detail-ctc-detail-panel')
            hpd && hpd.refreshIcons()
            this.set("SpinnerActive", false)
        }, 10)
    }

    _expandColumn(e) {
        this.set('leftMenuOpen', true)
        this.root.querySelector('.container').classList.add('expanded')
        this._updateFilterPanels()
    }

    _closeColumn(e) {
        this.set('leftMenuOpen', false)
        this.root.querySelector('.container').classList.remove('expanded')
        this._updateFilterPanels()
    }

    _concat(a, b, c, d, e) {
        return (a || []).concat(b || []).concat(c || []).concat(d || []).concat(e || [])
    }

    _settingsChanged(e) {
        if (e.detail && e.detail.section) {
            this.set(`${e.detail.section}_${e.detail.type}`, e.detail.value)
        }
    }

    _filterElements(hes, sort, showInactive = true) {
        return _.sortBy(hes.filter(he => showInactive || (he.status & 2) === 0), (x) =>
            (sort === 'created') ? [
                (-(x.valueDate || x.openingDate || 0),
                (x.codes || []).find(c => c.type === 'ICPC' || c.type === 'ICPC2') || {}).code || "\uff0f",
                -(x.closingDate || 0)
            ] : [
                ((x.codes || []).find(c => c.type === 'ICPC' || c.type === 'ICPC2') || {}).code || "\uff0f",
                -(x.valueDate || x.openingDate || 0),
                -(x.closingDate || 0)
            ])
    }

    checkingStatus() {
        let promises = []
        const table = ["all", "active-relevant", "active-irrelevant", "inactive", "archived"]

        this.set("contactStatutChecked", [])

        if (this.statutFilter !== "all") {
            this.contactYears.map(
                contactYear => {
                    contactYear.contacts.map(ctc => {
                        console.log('contact', ctc)
                        ctc.subContacts.map(sbct => {
                            let value
                            if (sbct.healthElementId) {
                                this.api.helement().getHealthElement(sbct.healthElementId).then(element => {
                                    value = element.status === table.findIndex(row => row === this.statutFilter)
                                    if (value && !this.contactStatutChecked.find(id => id === ctc.id)) {
                                        this.push("contactStatutChecked", ctc.id)
                                    }
                                })
                            }

                        })
                    })
                }
            )
        }
    }

    _toggleEditSettings(e) {
        e.stopPropagation()
        e.preventDefault()

        let parentElement = e.target.parentElement
        if (parentElement.classList.contains('open')) {
        } else {
            parentElement.classList.add('open')
            setTimeout(() => parentElement.classList.remove('open'), 4000)
        }
    }

    _composeHistory(e) {
        this.set("historyElement", [])
        ;(_.size(_.get(this, 'healthElements', []).filter(eh => eh.healthElementId === _.get(e, 'detail.entity.healthElementId', null))) ? this.api.hcparty().getHealthcareParties(_.compact(_.uniq(_.get(this, 'healthElements', []).filter(eh => eh.healthElementId === _.get(e, 'detail.entity.healthElementId', null)).map(he => he.responsible))).join(',')) : Promise.resolve([]))
            .then(hcps => this.set('historyElement', _.sortBy(_.get(this, 'healthElements', []).filter(eh => eh.healthElementId === _.get(e, 'detail.entity.healthElementId', null)).map(eh =>
                _.assign(eh, {
                    modifiedDateAsString: _.get(eh, 'modified', false) ? this.api.formatedMoment(_.get(eh, 'modified', null)) : null,
                    openingDateAsString: _.get(eh, 'openingDate', false) ? this.api.formatedMoment(_.get(eh, 'openingDate', null)) : null,
                    closingDateAsString: _.get(eh, 'closingDate', false) ? this.api.formatedMoment(_.get(eh, 'closingDate', null)) : null,
                    responsibleHcp: hcps.find(hcp => hcp.id === eh.responsible)
                })
            ), ['modified'], ['desc'])))
    }

    _checkIfPresent(data) {
        return data !== "" && data !== 'null' && data !== null ? true : false
    }

    _getDataTrad(data) {
        return this.localize(data, data, this.language)
    }

    _checkClosingDate(date) {
        return date !== "" ? true : false
    }

    _checkOpeningDate() {
        return date !== "" ? true : false
    }

    _checkHeTagAvailable(he, cd) {
        return !_.isEmpty(_.get(he, 'tags', []).find(tag => _.get(tag, 'type', null) === cd && _.get(tag, 'code', null)))
    }

    _getHeTags(he, cd) {
        return this.localize(_.get(_.get(he, 'tags', []).find(tag => tag.type === cd), 'code', null), _.get(_.get(he, 'tags', []).find(tag => tag.type === cd), 'code', null), this.language)
    }

    getGender(gender) {
        if (gender === "male") return "M."
        if (gender === "female") return "Mme"
        else return ""
    }

    _chapter4(e) {
        e.stopPropagation()
        e.preventDefault()

        //this.$['chapterivdialog'].open()
    }


    _medicationPlan(e) {
        e.stopPropagation()
        e.preventDefault()

        this.$['medication-plan'].open()
        this.$['medication-plan'].setContacts(this.contacts)
    }

    updateEdmgClassList(cssClassToAssign) {
        this.$.edmgStatus.classList.remove('edmgPending')
        this.$.edmgStatus.classList.remove('edmgOk')
        this.$.edmgStatus.classList.remove('edmgNOk')
        this.$.edmgStatus.classList.add(cssClassToAssign || '')
    }


    updateEdmgStatus() {

        if (!this.api.tokenId || this.isLoading) return

        this.set('isLoading', true)

        this.api.getUpdatedEdmgStatus(
            this.user,
            this.patient,
            null, // requestDate
            null, // edmgNiss,
            null, // edmgOA,
            this.genInsOA,
            this.genInsAFF
        ).then(edmgStatusResponse => {

            if (!edmgStatusResponse || (edmgStatusResponse.errors && edmgStatusResponse.errors.length > 0) || !edmgStatusResponse.hcParty) {
                this.set('isLoading', false)
                return
            }

            // Get connected user's HCP.nihii (the only comparaison key with EDMG's result
            this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(
                thisHcp => {
                    this.set('isLoading', false)
                    const currentTstamp = moment().valueOf()
                    if (thisHcp.nihii !== (edmgStatusResponse.hcParty.ids.find(id => id.s === 'ID_HCPARTY') ? edmgStatusResponse.hcParty.ids.find(id => id.s === 'ID_HCPARTY').value : '')) {
                        this.updateEdmgClassList('edmgNOk')
                        console.log('EDMG Failed : patient is NOT mine (based on nihii) ')
                        return
                    } // Connected doctor !== the one that has patient's EDMG
                    if (edmgStatusResponse.from <= currentTstamp && edmgStatusResponse.to >= currentTstamp) {
                        this.updateEdmgClassList('edmgOk')
                        console.log('EDMG OK: last consultation less than 1 year ago')
                        return
                    } // Valid status (last consultation between start & end of eDMG)
                    if (edmgStatusResponse.from > currentTstamp && currentTstamp >= moment(edmgStatusResponse.from).subtract(1, 'year').valueOf()) {
                        this.updateEdmgClassList('edmgPending')
                        console.log('EDMG PENDING: last consultation less than 2 years ago (but more than one)')
                        return
                    } // Pending status (last consultation more than a year ago but less than 2 years ago)
                    console.log('EDMG FAILED: last consultation more than 2 years ago') // Anything else
                }
            ).catch(() => {
                this.set('isLoading', false)
            })
        }).catch(() => {
            this.set('isLoading', false)
        })

    }

    _linkToEbPracticeNet(e) {
        e.stopPropagation()
        window.open("https://www.ebpnet.be/fr/Pages/default.aspx", '_blank')
    }

    _linkToCBIP(e) {
        e.stopPropagation()
        window.open("http://www.cbip.be/fr/start", '_blank')
    }

    _ebmPicture() {
        return require('../../../images/EbpracticeNet-logo-square.png')
    }

    _cbipPicture() {
        return require('../../../images/cbip-logo.png')
    }

    _rnConsultPicture() {
        return require('../../../images/bcss.png')
    }

    showListPlanOfAction(e) {
        e.stopPropagation()
        this.$["preventiveActs"]._openDialog()
    }

    showVaccineHistory(e) {
        e.stopPropagation()
        this.$["vaccineHistory"].opened = true
    }

    openActionDialog(e) {
        console.log("svcs", e.detail.service)
        if (e.detail && e.detail.source && (e.detail.source === "schema" || e.detail.source === "history")) {
            this.$["planActionForm"].open(e.detail.service, false, e.detail)
            return
        }
        const lifecycle = e.detail.service.tags.find(tag => tag.type === "CD-LIFECYCLE") || {}
        this.$["planActionForm"].open(e.detail.service, lifecycle.code === "cancelled" || lifecycle.code === "completed", e.detail)
    }

    postitChanged(value) {
        const trimmedValue = value && value.trim()
        if (trimmedValue && trimmedValue.length) {
            this.shadowRoot.querySelector('#postit-notification') && this.shadowRoot.querySelector('#postit-notification').classList.add('notification')
            setTimeout(() => {
                this.closePostit()
            }, 60000)
        } else {
            this.closePostit()
        }
    }

    editPostit() {
        this.set('adminTabIndex', 3)
        this.set('selectedAdminOrCompleteFileIndex', 0)
    }

    closePostit() {
        this.shadowRoot.querySelector('#postit-notification') && this.shadowRoot.querySelector('#postit-notification').classList.remove('notification')
    }

    flatrateMsgChanged(value) {
        const trimmedValue = value && value.trim()
        if (trimmedValue && trimmedValue.length) {
            this.shadowRoot.querySelector('#flatrate-notification') && this.shadowRoot.querySelector('#flatrate-notification').classList.add('notification')
            setTimeout(() => {
                this.closeFlatrateMsg()
            }, 60000)
        } else {
            this.closeFlatrateMsg()
        }
    }

    closeFlatrateMsg() {
        this.shadowRoot.querySelector('#flatrate-notification') && this.shadowRoot.querySelector('#flatrate-notification').classList.remove('notification')
    }

    createEvent(codeId) {
        this.api.code().getCode(codeId).then(procedure => {
            const service = {
                label: "Actes",
                modified: +new Date(),
                responsible: this.hcp.id,
                content: {
                    fr: {
                        stringValue: procedure.label.fr,
                        medicationValue: null
                    },
                    nl: {
                        stringValue: procedure.label.nl,
                        medicationValue: null
                    },
                    en: {
                        stringValue: procedure.label.en,
                        medicationValue: null
                    }
                },
                codes: [
                    procedure
                ],
                valueDate: +new Date(),
                tags: [
                    {
                        type: "CD-LIFECYCLE",
                        code: "pending",
                        version: "1.0",
                    }
                ]
            }

            if (this.currentContact) {
                this._createService(new CustomEvent("create-service", {
                    detail: {service: service, hes: []},
                    bubbles: true,
                    composed: true
                }))
                this.events.push(service)
                this.set("events", _.sortBy(this.events, it => this.api.moment(it.valueDate)))
            }
        })
    }

    _readEid() {
        fetch(`${_.get(this, "api.electronHost", "http://127.0.0.1:16042")}/read`)
            .then((response) => {
                return response.json()
            })
            .then(res => {
                if (res && res.cards.length && res.cards[0]) {
                    this.set('cardData', res.cards[0])
                }
            })
    }

    cardDataChanged() {
        if (this.$['htPatTherlinkDetail'].opened || this.$["htPatConsentDetail"].opened) {
            if (Object.keys(this.cardData).length && _.get(this.patient, 'ssin', "") === _.get(this.cardData, "nationalNumber", null)) {
                this.set("eidCardNumber", "")
                this.set("eidCardNumber", _.get(this.cardData, "logicalNumber", null))
            }
        }
    }

    _cardChanged(e) {
        this.set("cardData", e.detail.cardData)
    }

    autoReadCardEid(cards) {
        const res = JSON.parse(cards)
        if (res.cards[0] && this.patient.ssin === res.cards[0].nationalNumber) {
            this.set('cardData', res.cards[0])
            this.set("eidCardNumber", this.cardData.logicalNumber)
            if (!this.haveTherLinks) {
                this._registerNationalAndHubTherLink()
            }
        }
    }

    contactChanged(e) {
        this.set("refreshServicesDescription", this.refreshServicesDescription + 1)
    }

    getTypeContact(ctc) {
        const descrPattern = this.user.properties.find(p => p.type.identifier === 'org.taktik.icure.preferred.contactDescription') || "{Motifs de contact}"
        const templateKeys = descrPattern.match(/\{.+?\}/g).map(s => s.substring(1, s.length - 1))
            .reduce((acc, s) => {
                acc[s] = true
                return acc
            }, {})

        ctc.userDescr = this.api.template(descrPattern, ctc.services.filter(s => templateKeys[s.label] && !s.endOfLife).reduce((acc, v) => {
            acc[v.label] = !acc[v.label] ? this.shortServiceDescription(v, this.language) : acc[v.label] + "," + this.shortServiceDescription(v, this.language)
            return acc
        }, {}))
        if (!ctc.userDescr || ctc.userDescr.length < 3) {
            ctc.userDescr = ctc.descr
        }
        const contacttype = ctc.tags.find(tag => tag.type === "BE-CONTACT-TYPE")
        if (contacttype) {
            const code = this.contactTypeList.find(sct => sct.code === contacttype.code)
            if (code && code.label) {
                if (ctc.userDescr && ctc.userDescr != "") {
                    ctc.userDescr = code.label[this.language || "fr"] + " : " + ctc.userDescr
                } else {
                    ctc.userDescr = code.label[this.language || "fr"]
                }
            } else {
                console.log("invalid contact type", ctc, code)
            }
        }

        return ctc.userDescr
    }

    getDocumentDetails(ctc) {

        return _
            .chain(_.get(ctc, "subContacts", []))
            .map(subContact => {

                const contactTransactionCode = _.trim(_.get(_.find(_.get(ctc, "tags", []), {type: "CD-TRANSACTION"}), "code", ""))
                const subContactTransactionCode = _.trim(_.get(_.find(_.get(subContact, "tags", []), {type: "CD-TRANSACTION"}), "code", ""))
                const labOrProtocolTransactionCode = !!_.trim(subContactTransactionCode) ? _.trim(subContactTransactionCode) : !!_.trim(contactTransactionCode) ? _.trim(contactTransactionCode) : "unknown"

                // Imported file file
                return !!(parseInt(_.get(subContact, "status", 0)) & (1 << 6)) ?
                    _.map(subContact.services, subContactService => {
                        const svc = _.find(_.get(ctc, "services", []), service => _.trim(_.get(service, "id", "something")) === _.trim(_.get(subContactService, "serviceId", "else")))
                        const fileName = _.trim(_.get(svc, "content." + this.language + ".stringValue", ""))
                        const cdTransactionCode = _.trim(_.get(_.find(_.get(svc, "tags", []), {type: "CD-TRANSACTION"}), "code", ""))
                        const docType = !!_.trim(cdTransactionCode) ? _.trim(cdTransactionCode) : "unknown"

                        return !fileName || !!parseInt(_.get(svc, "endOfLife", 0)) ? false : {
                            name: fileName,
                            type: !!_.size(_.find(_.get(svc, "tags", []), {type: "outgoingDocument"})) ? "" : this.localize('cd-transaction-' + docType, docType, this.language),
                            created: this._dateFormat(_.get(ctc, "created", undefined)),
                            modified: this._dateFormat(_.get(ctc, "modified", undefined))
                        }
                    }) :

                    // Labresult or protocol
                    !!((parseInt(_.get(subContact, "status", 0)) & (1 << 0)) || (parseInt(_.get(subContact, "status", 0)) & (1 << 5))) ? {
                        created: this._dateFormat(_.get(ctc, "created", undefined)),
                        type: this.localize('cd-transaction-' + labOrProtocolTransactionCode, labOrProtocolTransactionCode, this.language),
                        name: !(parseInt(_.get(subContact, "status", 0)) & (1 << 0)) ? null : this.localize((!!(parseInt(_.get(subContact, "status", 0)) & (1 << 4)) ? "com_res" : "inc_res"), "Complete result", this.language)
                    } : false
            })
            .flatten()
            .compact()
            .map(i => _.merge({}, i, {createdTstamp: _.get(ctc, "created", 0)}))
            .orderBy(["createdTstamp"], ["desc"])
            .value()

    }

    getAtc(med) {
        return med && med.colour && med.colour.substr(med.colour.length - 1)
    }

    // COLUMN SIZE

    _colSizeChanged() {
        const firstCol = this.root.querySelector('.first-panel') || {offsetWidth: 0}
        const secondCol = this.root.querySelector('.second-panel') || {offsetWidth: 0}
        const thirdCol = this.root.querySelector('#ctcDetailPanel') || {offsetWidth: 0}
        const toastdetector = this.root.querySelector('.toast-detector')
        const toast = this.root.querySelector('#selectionToast')
        const windowW = window && window.innerWidth || null
        const firstW = windowW && firstCol.offsetWidth != 0 ? (firstCol.offsetWidth / windowW) * 100 + 'vw' : 'auto'
        const secondW = windowW && secondCol.offsetWidth != 0 ? (secondCol.offsetWidth / windowW) * 100 + 'vw' : 'auto'
        const thirdW = windowW && thirdCol.offsetWidth != 0 ? (thirdCol.offsetWidth / windowW) * 100 + 'vw' : 'auto'
        localStorage.setItem('three-cols-size', JSON.stringify({'first': firstW, 'second': secondW, 'third': thirdW}))
        if (secondCol.offsetWidth != 0) {
            if (toastdetector) toastdetector.style.width = secondW
            if (toast) toast.style.width = secondW
        }

        (thirdCol.offsetWidth < 600) ? thirdCol.resizeContactActions(true) : thirdCol.resizeContactActions(false)
    }

    _setColsWidth() {
        if (localStorage.getItem('three-cols-size')) {
            const colSizes = JSON.parse(localStorage.getItem('three-cols-size'))
            const firstCol = this.root.querySelector('.first-panel')
            const secondCol = this.root.querySelector('.second-panel')
            const thirdCol = this.root.querySelector('#ctcDetailPanel')
            const toastdetector = this.root.querySelector('.toast-detector')
            const toast = this.root.querySelector('#selectionToast')
            if (thirdCol) thirdCol.style.width = colSizes['third'] || 'auto'
            if (secondCol) {
                secondCol.style.width = colSizes['second'] || 'auto'
                if (toastdetector) toastdetector.style.width = colSizes['second'] || 'auto'
                if (toast) toast.style.width = colSizes['second'] || 'auto'
            }
            if (firstCol) firstCol.style.width = colSizes['first'] || 'auto'
        }
    }

    addOther() {
        this.$['htPatOtherFormDialog']._openDialog()
    }

    formTemplatesSelectorDataProvider() {
        return {
            filter: function (filterValue, limit, offset, sortKey, descending) {
                const regExp = filterValue && new RegExp(filterValue, "i")

                // FIXME: for backward compat, we use deptgeneralpractice if no codes in hcp. One may want to prevent this for clerk users
                const specialtyCodes = _.get(_.get(this.api, 'hcParties[' + _.get(this.user, 'healthcarePartyId', null) + ']', {}), 'specialityCodes', [{
                    version: 1,
                    code: "deptgeneralpractice",
                    type: "CD-HCPARTY",
                    id: "CD-HCPARTY|deptgeneralpractice|1"
                }])
                const all = this.allTemplates || (this.allTemplates = Promise.all([
                    this.api.form().findFormTemplates(),
                ].concat(
                    specialtyCodes.map(sc =>
                        this.api.form().findFormTemplatesBySpeciality(sc.code)
                    )
                )).then(res => _.chain(_.flatten(res)).uniqBy(x => x.id).sortBy(['group', 'name']).value()))

                return all
                    .then(fts => {
                        const filtered = fts.filter(ft => (!regExp || ft.name && ft.name.match(regExp) || ft.group && ft.group.name && ft.group.name.match(regExp) || ft.guid && ft.guid.match(regExp)) && ft.disabled !== "true")
                        return {
                            totalSize: filtered.length,
                            rows: (descending ? _.reverse(_.sortBy(filtered, sortKey)) : _.sortBy(filtered, sortKey)).slice(0, limit)
                        }
                    })
            }.bind(this)
        }
    }

    formTemplatesSelectorColumns() {
        return [{key: 'group.name', title: 'Groupe'}, {key: 'name', title: 'Nom'}, {key: 'guid', title: 'GUID'}]
    }

    _addedFormSelected(e, formTemplate) {
        const ctcDetailPanel = this.root.querySelector('#ctcDetailPanel')
        formTemplate && ctcDetailPanel && ctcDetailPanel.addForm(e.detail.guid)
    }

    _filesChanged() {
        if (!this.currentContact) {
            return
        }
        const files = _.clone(this.files)
        const vaadinUpload = this.$['vaadin-upload']

        Promise.all(files.filter(f => !f.attached).map(f => {
            f.attached = true
            console.log(f)
            return this.api.document().newInstance(this.user, null, {
                documentType: 'result',
                mainUti: this.api.document().uti(f.type, f.name && f.name.replace(/.+\.(.+)/, '$1')),
                name: f.name
            })
                .then(d => this.api.document().createDocument(d))

                .then(createdDocument => {
                    return this.api.crypto()
                        .extractKeysFromDelegationsForHcpHierarchy(
                            this.user.healthcarePartyId,
                            createdDocument.id,
                            _.size(createdDocument.encryptionKeys) ? createdDocument.encryptionKeys : createdDocument.delegations
                        )
                        .then(({extractedKeys: enckeys}) => [createdDocument, enckeys])
                })
                .then(([d, enckeys]) => {
                    f.doc = d
                    f.uploadTarget = (f.uploadTarget || vaadinUpload.target).replace(/\{documentId\}/, d.id) + "?ts=" + new Date().getTime() + (enckeys ? "&enckeys=" + enckeys : "")
                    return f
                })
        })).then(files => {
            files.length && vaadinUpload.uploadFiles(files)
        })
    }

    _fileUploaded(e) {
        if (!this.currentContact) {
            return
        }
        const vaadinUpload = this.$['vaadin-upload']
        const f = e.detail.file
        const d = f.doc

        let sc = this.currentContact.subContacts.find(sbc => (sbc.status || 0) & 64)
        if (!sc) {
            sc = {status: 64, services: []}
            this.currentContact.subContacts.push(sc)
        }
        const svc = this.api.contact().service().newInstance(this.user, {
            content: _.fromPairs([[this.language, {
                documentId: d.id,
                stringValue: f.name
            }]]), label: 'document'
        })
        this.currentContact.services.push(svc)
        sc.services.push({serviceId: svc.id})
        if (!vaadinUpload.files.find(f => !f.complete && !f.error)) {
            this.saveCurrentContact().then(c => this.refreshPatient())
        }
        console.log(vaadinUpload.files)
    }

    _prescribe(e) {
        e.stopPropagation()
        this.$.prescriptionDialog.open()
    }

    _hubDownload(e) {
        console.log(e)
        this.root.querySelector('ht-pat-detail-ctc-detail-panel')._contactsChanged()
    }

    // _saveDoc(e){
    //     this.shadowRoot.querySelector('#ctcDetailPanel').saveDoc(e)
    //     // this.root.querySelector('ht-pat-detail-ctc-detail-panel')._saveDoc(e)
    // }

    _resetPatient() {
        this.$['prose-editor-dialog-linking-letter'].close()
    }

    writeLinkingLetter(e) {
        this.$['prose-editor-dialog-linking-letter'].open()
        const proseEditor = this.root.querySelector("#prose-editor-linking-letter")
        proseEditor.set("additionalCssClasses", "linkingLetter")
        const ctcDetailPanel = this.shadowRoot.querySelector('#ctcDetailPanel')

        ctcDetailPanel._getPatAndHcpCommonData({})
            .then(dpData => _.assign({dpData: dpData}, {}))
            .then(resourceObject => {

                ctcDetailPanel.linkingLetterDpData = resourceObject.dpData
                if (ctcDetailPanel.proseEditorLinkingLetterTemplateAlreadyApplied) return

                return ctcDetailPanel.api.doctemplate().findDocumentTemplatesByDocumentType('template')
                    .then(docTemplates => _.get(_.filter(docTemplates, i => _.get(i, "mainUti", "") === "proseTemplate.linkingLetter." + this.language), "[0]", false) || _.get(_.filter(docTemplates, i => _.get(i, "mainUti", "") === "proseTemplate.linkingLetter.fr"), "[0]", {}))
                    .then(dt => {
                        return (dt && dt.id && dt.attachmentId) ?
                            ctcDetailPanel.api.doctemplate().getAttachmentText(dt.id, dt.attachmentId).then(proseTemplate => {
                                ctcDetailPanel.proseEditorLinkingLetterTemplateAlreadyApplied = true
                                proseEditor.setJSONContent(ctcDetailPanel.api.crypto().utils.ua2utf8(proseTemplate) || {})
                            }).catch(e => {
                            }) :
                            ctcDetailPanel._createLinkingLettersProseTemplate().then(createdTemplate => {
                                ctcDetailPanel.api.doctemplate().getAttachmentText(createdTemplate.id, createdTemplate.attachmentId).then(proseTemplate => {
                                    ctcDetailPanel.proseEditorLinkingLetterTemplateAlreadyApplied = true
                                    proseEditor.setJSONContent(ctcDetailPanel.api.crypto().utils.ua2utf8(proseTemplate) || {})
                                }).catch(e => {
                                })
                            }).catch(e => {
                            })
                    })
                    .catch(e => console.log(e))

            })
            .catch(e => console.log(e))
            .finally(() => {
                ctcDetailPanel._refreshContextLinkingLetter()
                ctcDetailPanel._toggleAddActions()
                ctcDetailPanel.busySpinner = false
            })

    }

    _closeLinkingLetterDialog() {
        this.$['prose-editor-dialog-linking-letter'].close()
        const ctcDetailPanel = this.shadowRoot.querySelector('#ctcDetailPanel')
        ctcDetailPanel.busySpinner = false
        this.busySpinner = false
    }

    _saveLinkingLetter(e) {
        this.shadowRoot.querySelector('#ctcDetailPanel')._saveLinkingLetter(e)
        this.$['prose-editor-dialog-linking-letter'].close()
    }

    _printLinkingLetter(e) {
        this.shadowRoot.querySelector('#ctcDetailPanel')._printLinkingLetter(e)
    }

    _closeDialogs() {
        this.set("_bodyOverlay", false)
        _.map(this.shadowRoot.querySelectorAll('.modalDialog'), i => i && typeof i.close === "function" && i.close())
    }

    _uploadDocumentOnHubs(e) {
        this.set('documentIdToUpload', null)
        const documentId = _.get(e, "detail.documentId", false)

        if (documentId) {
            this.set('documentIdToUpload', documentId)
            this.$['patHubUpload'].openHubDocumentUploadDialog()
        }
    }

    _isConnectedToEhbox() {
        this.set("ehealthSession", !!this.api.tokenId)
    }

    _closeOverlay() {
        this.set("_bodyOverlay", false)
    }

    _openUploadDialog(e) {
        const currCtc = e && e.detail && e.detail.currentContact || null
        if (currCtc) {
            this.set('currentContact', currCtc)
            this.shadowRoot.querySelector("#upload-dialog").open(currCtc)
        }
    }

    _saveDocuments(e) {
        this.shadowRoot.querySelector("#upload-dialog").defaultSaveDocuments(e)
    }

    _postProcess(e) {
        this.shadowRoot.querySelector("#upload-dialog").close()
        e && e.detail && e.detail.contact && this.set('currentContact', e.detail.contact)
        this.saveCurrentContact().then(c => this.refreshPatient()).finally(() => this.contactChanged())
    }

    _handleError(e) {
        this.shadowRoot.querySelector("#upload-dialog").showErrorMessage(e)
    }

    _hubUpload(e) {
        if (!this._checkForEhealthSession()) {
            this.set("_bodyOverlay", true)
            this.$["notConnctedToeHealthBox"].open()
            return
        }
        const documentId = _.trim(_.get(e, "detail.documentId", false))
        const documentComment = _.trim(_.get(e, "detail.documentComment", ""))
        console.log("hub upload", documentId, documentComment)
        this.$['htPatHubDiaryNote'].open(documentId, documentComment)
    }


    _showVaccineDialog() {
        this.$['HtPatVaccineDialog']._openDialog()
    }

    _forwardDocument(e) {

        // eHealthBox connection has to be
        if (!this._checkForEhealthSession()) {
            this.set("_bodyOverlay", true)
            this.$["notConnctedToeHealthBox"].open()
            return
        }
        const documentId = _.trim(_.get(e, "detail.documentId", false))

        return !documentId ? false : this.shadowRoot.querySelector('#ctcDetailPanel')._getPatAndHcpCommonData()
            .then(hcpAndPatData => this.shadowRoot.querySelector('#new-msg').open({
                dataFromPatDetail: {
                    patient: _.get(this, "patient", false),
                    currentContact: _.get(this, "currentContact", false),
                    hcpAndPatData: hcpAndPatData || false,
                    documentId: documentId
                }
            }))

    }

    _printDocument(e) {
        const printDocumentComponent = this.shadowRoot.querySelector("#printDocument")
        return printDocumentComponent && typeof _.get(printDocumentComponent, "printDocument", false) === "function" && printDocumentComponent.printDocument(_.get(e, "detail", {}))
    }

    _openCarePathList() {
        this.$['htPatCarePathListDialog'].open()
    }

    _openCarePathDetail(e) {
        this.set('selectedCarePathInfo', _.get(e, 'detail.selectedCarePathInfo', {}))
        this.$['htPatCarePathDetailDialog'].open()
    }


    _serviceChanged(e) {
        //this.dispatchEvent(new CustomEvent('service-changed', {detail: {service: e.detail.service}, bubbles: true, composed: true}))
        console.log("service changed event arrived")
        this.saveNewService(e.detail.service).then(c => this.refreshPatient())
    }

    _healthElementChanged(e) {
        console.log("he changed event arrived")
        this.api.helement().modifyHealthElement(e.detail.healthelement).then(() => {
            this.refreshPatient()
        })
    }

    _LodashDash(txt) {
        return txt.replace("_", "-")
    }

    _importHubSumehrItem(e) {
        const item = e.detail && e.detail.item ? JSON.parse(e.detail.item) : null
        const sumehrXml = e.detail && e.detail.sumehrXml ? e.detail.sumehrXml : null
        console.log("import hub sumehr item event arrived", item)
        console.log("sumehrXml", sumehrXml)
        console.log("itemId", item.itemId)
        this._importSumehrByItemId(item.itemId, sumehrXml).then(results => console.log(results))
    }

    _importSumehrByItemId(itemId, sumehrXml) {
        if (itemId && sumehrXml) {
            return this.api.message().newInstance(this.user)
                .then(nmi => this.api.message().createMessage(_.merge(nmi, { //creation of container message
                        transportGuid: "HUB:IN:IMPORT-SUMEHR",
                        recipients: [this.user && this.user.healthcarePartyId],
                        metas: {
                            filename: "sumehrImport" + itemId,
                            mediaType: "hub",
                            transactionId: "sumehrImport" + itemId,
                            itemId: itemId
                        }, //-->"hub",
                        toAddresses: [_.get(this.user, 'email', this.user && this.user.healthcarePartyId)], //email needed ?
                        subject: "Hub Sumehr Import",
                        status: 0 | 1 << 25 | (this.patient.id ? 1 << 26 : 0)
                    }))
                        .then(createdMessage => Promise.all([createdMessage,
                            this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt",
                                this.user, createdMessage,
                                this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(JSON.stringify({
                                    patientId: this.patient.id,
                                    isAssigned: true
                                }))))]))
                        .then(([createdMessage, cryptedMeta]) => {
                            createdMessage.metas.cryptedInfo = Base64.encode(String.fromCharCode.apply(null, new Uint8Array(cryptedMeta)))
                            return this.api.message().modifyMessage(createdMessage)
                        })
                        .then(createdMessage => this.api.document().newInstance(this.user, createdMessage, { //creation of first document (before)
                            documentType: 'sumehr',
                            mainUti: this.api.document().uti("text/xml"),
                            name: "sumehrImport" + itemId + "_" + moment().format("YYYYMMDDhhmmss")
                        }))
                        .then(newDocInstance => this.api.document().createDocument(newDocInstance))
                        .then(createdDocument => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject('encrypt', this.user, createdDocument, this.api.crypto().utils.base64toArrayBuffer(btoa(sumehrXml)))
                            .then(encryptedFileContent => ({createdDocument, encryptedFileContent})))
                        .then(({createdDocument, encryptedFileContent}) => this.api.document().setAttachment(createdDocument.id, null, sumehrXml)) //.then(({createdDocument, encryptedFileContent}) => this.api.document().setAttachment(createdDocument.id, null, encryptedFileContent))
                        .then(resourcesObject => {
                            console.log("resourcesObject", resourcesObject)
                            return this.api.bekmehr().importSumehrByItemId(resourcesObject.id, "dockey", false, this.patient.id, this.language, {}, itemId).then(results => {
                                console.log("importSumehrItem results", results)
                                let patpromises = results.map(result => {
                                    return this.api.patient().modifyPatientWithUser(this.user, result.patient).then(pat => {
                                        let prolist = [
                                            Promise.all(result.forms.map(form => {
                                                return this.api.form().newInstance(this.user, pat, form)
                                            })).then(forms => this.api.form().modifyForms(forms)),
                                            Promise.all(result.ctcs.map(ctc => {
                                                return this.api.contact().newInstance(this.user, pat, ctc)
                                            })).then(c => {
                                                return this.api.contact().modifyContactsWithUser(this.user, c)
                                            }),
                                            Promise.all(result.hes.map(he => {
                                                return this.api.helement().newInstance(this.user, pat, he)
                                            })).then(h => {
                                                return this.api.helement().modifyHealthElements(h)
                                            }),
                                            Promise.all(result.documents.map(doc => {
                                                return this.api.document().newInstance(this.user, pat, doc)
                                            })).then(d => {
                                                return this.api.document().modifyDocuments(d)
                                            })
                                        ]
                                        return prolist.reduce((acc, prom) => acc.then(res => prom.then(innerRes => res.concat(innerRes))), Promise.resolve([]))
                                            .then(
                                                datastatus => {
                                                    console.log("done import: " + document.name + ":" + pat.firstName + " " + pat.lastName + "; " + pat.id)
                                                    console.log(datastatus)
                                                    return Promise.resolve()
                                                },
                                                // patient imported but error importing patient data
                                                err => {
                                                    // TODO: check specific error for contacts, he, etc
                                                    console.log(err)
                                                    this.set(['patientImportStatuses', this.patientImportStatuses.indexOf(status), 'statuses'],
                                                        {
                                                            contacts: {success: null, error: null},
                                                            healthElements: {success: null, error: null},
                                                            invoices: {success: null, error: null},
                                                            documents: {success: null, error: null},
                                                            patient: {success: false, error: {message: err}}
                                                        }
                                                    )
                                                    this.set(['patientImportStatuses', this.patientImportStatuses.indexOf(status), 'progress'], -1)
                                                    return Promise.resolve()
                                                }
                                            )
                                    })
                                })
                                return Promise.all(patpromises)
                                //}
                                //this.refreshPatient();
                            })
                        }).finally(() => {
                            console.log("finally of _logUpdateMessage")
                        }).catch(e => {
                            console.log("---error upload attachment---", e)
                        })
                )
        } else {
            return Promise.resolve(null)
        }
    }

    fusionDialogCalled(e) {
        if (e.detail.open) {
            this.$["fusion-dialog"].open(e.detail.patients).then(() => {
                e.detail.select && e.detail.select.length && this.$["fusion-dialog"].select(e.detail.select)
            })
        }
    }

    _openRnConsultDialog(e) {
        e.stopPropagation()
        if (this._checkForEhealthSession() === true) {
            this.$['htPatRnConsultDialog'].open()
        } else {
            this._ehealthErrorNotification()
        }
    }

    _consultRnHistory(patient) {
        this.set('rnHistoryResult', {})
        if (this.api.tokenId) {
            this.api.fhc().RnConsultController().historyUsingGET(_.get(this, 'api.keystoreId', null), _.get(this, 'api.tokenId', null), _.get(this, 'api.credentials.ehpassword', null), _.get(patient, 'ssin', null)).then(resp => {
                this.set('rnHistoryResult', resp)
                if (!_.isEmpty(resp)) {
                    if (_.get(resp, 'ssin.value', null) && !_.get(resp, 'ssin.replaces', null) && _.get(resp, 'ssin.canceled', null) !== true) {
                        this.shadowRoot.querySelector('#rnConsultStatus').classList.add('rnConsultOk')
                    } else if (_.get(resp, 'ssin.replaces', null)) {
                        this.shadowRoot.querySelector('#rnConsultStatus').classList.add('rnConsultPending')
                        this._rnConsultChangedNotification()
                    } else if (_.get(resp, 'ssin.canceled', null)) {
                        this.shadowRoot.querySelector('#rnConsultStatus').classList.add('rnConsultNOk')
                        this._rnConsultErrorNotification()
                    } else {
                        this.shadowRoot.querySelector('#rnConsultStatus').classList.add('rnConsultNOk')
                        this._rnConsultErrorNotification()
                    }
                } else {
                    this.shadowRoot.querySelector('#rnConsultStatus').classList.add('rnConsultNOk')
                    this._rnConsultErrorNotification()
                }
            })
        }
    }

    _patientMerged(e) {
        this.shadowRoot.querySelector("#pat-admin-card").patientMerged(e)
        if (e.detail.ok && e.detail.patientId !== this.patient.id) {
            location.replace(location.href.replace(/(.+?)#.*/, `$1#/pat/${e.detail.patientId}`))
        }
    }

    _checkForEhealthSession() {
        return !!(_.get(this, 'api.tokenId', null) || _.get(this, 'api.tokenIdMH', null))
    }

    // _checkForConsent(){
    //     return !_.isEmpty(_.get(this, 'patientConsent.consent', {}))
    // }

    // _checkForTherLink(){
    //     return _.get(this, 'haveTherLinks', false)
    // }

    _therLinkErrorNotification() {
        this.shadowRoot.querySelector('#therLink-notification') && this.shadowRoot.querySelector('#therLink-notification').classList.add('notification')
        setTimeout(() => {
            this._closeTherLinkErrorNotification()
        }, 10000)
    }

    _closeTherLinkErrorNotification() {
        this.shadowRoot.querySelector('#therLink-notification') && this.shadowRoot.querySelector('#therLink-notification').classList.remove('notification')
    }

    _consentErrorNotification() {
        this.shadowRoot.querySelector('#consent-notification') && this.shadowRoot.querySelector('#consent-notification').classList.add('notification')
        setTimeout(() => {
            this._closeConsentErrorNotification()
        }, 10000)
    }

    _closeConsentErrorNotification() {
        this.shadowRoot.querySelector('#consent-notification') && this.shadowRoot.querySelector('#consent-notification').classList.remove('notification')
    }

    _ehealthErrorNotification() {
        this.shadowRoot.querySelector('#ehealth-notification') && this.shadowRoot.querySelector('#ehealth-notification').classList.add('notification')
        setTimeout(() => {
            this._closeEhealthErrorNotification()
        }, 10000)
    }

    _closeEhealthErrorNotification() {
        this.shadowRoot.querySelector('#ehealth-notification') && this.shadowRoot.querySelector('#ehealth-notification').classList.remove('notification')
    }

    _newReport_v2(e) {
        const outgoingDocumentComponent = this.shadowRoot.querySelector("#outgoingDocument")
        return outgoingDocumentComponent && typeof _.get(outgoingDocumentComponent, "open", false) === "function" && outgoingDocumentComponent.open(_.get(e, "detail"))
    }

    _exportSumehrDialog() {
        this.set('showOutGoingDocContainer', false)
        this.$['htPatHubSumehrPreview'].open(null, this, null, true)
    }

    _triggerRefreshOutGoingDocumentTemplates(e) {
        const ctcDetailPanel = this.shadowRoot.querySelector("#ctcDetailPanel")
        return ctcDetailPanel && typeof _.get(ctcDetailPanel, "_getOutGoingDocumentTemplates", false) === "function" && ctcDetailPanel._getOutGoingDocumentTemplates()
    }

    refreshPatientAndServices() {
        this.refreshPatient()
        this._refreshFromServices()
    }

    _rnConsultErrorNotification() {
        this.shadowRoot.querySelector('#rnConsult-error-notification') && this.shadowRoot.querySelector('#rnConsult-error-notification').classList.add('notification')
        setTimeout(() => {
            this._closeRnConsultErrorNotification()
        }, 10000)
    }

    _rnConsultChangedNotification() {
        this.shadowRoot.querySelector('#rnConsult-changed-notification') && this.shadowRoot.querySelector('#rnConsult-changed-notification').classList.add('notification')
        setTimeout(() => {
            this._closeRnConsultChangedNotification()
        }, 600000)
    }

    _closeRnConsultErrorNotification() {
        this.shadowRoot.querySelector('#rnConsult-error-notification') && this.shadowRoot.querySelector('#rnConsult-error-notification').classList.remove('notification')
    }

    _closeRnConsultChangedNotification() {
        this.shadowRoot.querySelector('#rnConsult-changed-notification') && this.shadowRoot.querySelector('#rnConsult-changed-notification').classList.remove('notification')
    }

    _showRnConsultDiff() {
        this._closeRnConsultChangedNotification()
        this.$["htPatRnConsultHistoryDialog"]._openDialog()
    }

    _openMdaDialog(e) {
        e.stopPropagation()
        if (this._checkForEhealthSession() === true) {
            this.$["htPatMemberDataDetail"].openDialog()
        } else {
            this._ehealthErrorNotification()
        }
    }

    _consultMda() {
        this.$["htPatMemberDataDetail"].openDialog({open: false})
    }

    _updateMdaFlags(e) {
        this.shadowRoot.querySelector("#mdaStatus") ? this.shadowRoot.querySelector("#mdaStatus").classList.remove('medicalHouse') : null
        this.shadowRoot.querySelector("#mdaStatus") ? this.shadowRoot.querySelector("#mdaStatus").classList.remove('insuranceOk') : null
        this.shadowRoot.querySelector("#mdaStatus") ? this.shadowRoot.querySelector("#mdaStatus").classList.remove('noInsurance') : null
        this.set('mdaResult', _.get(e, 'detail.mdaResult', {}))

        !_.isEmpty(_.get(e, 'detail', {})) ?
            _.get(e, 'detail.medicalHouse', 0) > 0 ? this.shadowRoot.querySelector("#mdaStatus") ? this.shadowRoot.querySelector("#mdaStatus").classList.add('medicalHouse') : null :
                _.get(e, 'detail.generalSituation', 0) === 0 ? this.shadowRoot.querySelector("#mdaStatus") ? this.shadowRoot.querySelector("#mdaStatus").classList.add('insuranceOk') : null :
                    this.shadowRoot.querySelector("#mdaStatus") ? this.shadowRoot.querySelector("#mdaStatus").classList.add('noInsurance') : null :
            this.shadowRoot.querySelector("#mdaStatus") ? this.shadowRoot.querySelector("#mdaStatus").classList.add('noInsurance') : null

    }

    _openDocumentsDirectory() {
        const documentsDirectoryComponent = this.shadowRoot.querySelector("#documentsDirectory")
        return documentsDirectoryComponent && typeof _.get(documentsDirectoryComponent, "open", false) === "function" && documentsDirectoryComponent.open()
    }

    _donePrintingDocument() {
        const documentsDirectoryComponent = this.shadowRoot.querySelector("#documentsDirectory")
        return documentsDirectoryComponent && typeof _.get(documentsDirectoryComponent, "_donePrintingDocument", false) === "function" && documentsDirectoryComponent._donePrintingDocument()
    }

    onPrintPrescription(e) {
        this.$["prescriptionDialog"]._print(e)
    }

    _isFreeConsultation(svc) {
        return _.get(svc, 'label', null) === "PageBlanche"
    }

    _getFreeConsultationDescr(svc) {
        return _.get(svc, 'content.' + this.language + '.stringValue', null)
    }

    _isExcluded(he) {
        return _.get(he, 'tags', []).find(t => t.type === "CD-CERTAINTY" && t.code === "excluded") ? "exclude" : null
    }

    _debug(a, b) {
        console.log("--- debug ---", a, b)
    }

    _sendSubformViaEmediattest(e) {

        // eHealthBox connection has to be
        if (!this._checkForEhealthSession()) {
            this.set("_bodyOverlay", true)
            this.$["notConnctedToeHealthBox"].open()
            return
        }

        const subFormDp = _.get(e, "detail.subFormDp", false)
        const parentFormDp = _.get(e, "detail.parentFormDp", false)

        return !subFormDp || !parentFormDp ? false : this.shadowRoot.querySelector('#ctcDetailPanel')._getPatAndHcpCommonData()
            .then(hcpAndPatData => this.shadowRoot.querySelector('#new-msg').open({
                dataFromPatDetail: {
                    patient: _.get(this, "patient", false),
                    currentContact: _.get(this, "currentContact", false),
                    hcpAndPatData: hcpAndPatData || false,
                    eMediattestSubFormDp: subFormDp,
                    eMediattestParentFormDp: parentFormDp,
                }
            }))

    }

    _nbMedications() {
        return this._getActiveMedications().length
    }

    _getActiveMedications() {
        const yesterday = moment().subtract(1, 'days')
        const today = moment()
        return this.medications.filter(s => s.tags.some(c => _.get(c, 'type', null) === 'CD-ITEM' && _.get(c, 'code', null) === 'medication' && !_.values(_.get(s, 'content', null)).some(c => _.get(c, 'medicationValue', null) && (_.get(c, 'medicationValue.endMoment', null) && this.api.moment(_.get(c, 'medicationValue.endMoment', null)).isBefore(yesterday)) || (_.get(c, 'medicationValue.endOfLife', null) && this.api.moment(_.get(c, 'medicationValue.endOfLife', null)).isBefore(today)))))
    }

    _isSpecialist(hcp) {
        return !!(_.get(hcp, 'nihii', null) && _.startsWith(_.get(hcp, 'nihii', null), "1", 0) && _.size(_.get(hcp, 'nihii', null)) === 11 && (_.get(hcp, 'nihii', null).substr(_.size(_.get(hcp, 'nihii', null)) - 3) >= 10))

    }
}

customElements.define(HtPatDetail.is, HtPatDetail)
