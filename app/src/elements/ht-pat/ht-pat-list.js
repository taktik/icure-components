/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../ht-spinner/ht-spinner.js';

import '../dynamic-form/ckmeans-grouping.js';
import '../../styles/dialog-style.js';
import '../../styles/notification-style.js';
import './dialogs/ht-import-mf-dialog.js';
import './dialogs/ht-pat-fusion-dialog.js';
import '../../styles/buttons-style.js';
import '../../styles/paper-input-style.js';
import '../dynamic-form/dynamic-date-field.js';
import '../../styles/dropdown-style.js';
import '../ht-tools/ht-auto-read-eid-opening.js';
import './dialogs/reporting/ht-pat-primary-prevention-dialog.js';
import '../../styles/table-style';
import '../../styles/paper-tabs-style';

import moment from 'moment/src/moment'
import _ from 'lodash/lodash'
import { parse } from '../../../scripts/icure-reporting'
import { filter as icrFilter } from '../../../scripts/filters'
import {FilterExPrinter} from '../icc-x-api/filterExPrinter'

// To generate download xlsx file
import XLSX from 'xlsx'
import 'xlsx/dist/shim.min'

import * as models from 'icc-api/dist/icc-api/model/models'

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtPatList extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="dialog-style notification-style paper-input-style dropdown-style paper-tabs-style"></style>
        <custom-style>
            <style include="custom-style buttons-style">
                :host {
                    display: block;
                    height: 100%;
                    @apply --padding-right-left-32;
                }

                :host #patients-list {
                    height: calc(100% - 200px);
                    outline: none;
                    flex-grow: 1;
                }

                #scroller tbody#item {
                    cursor: pointer;
                }

                .horizontal {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    flex-basis: 100%;
                    align-items: center;
                    width: 100%
                }

                .horizontal paper-menu-button {
                    padding: 0;
                }

                .horizontal vaadin-date-picker {
                    @apply --padding-right-left-16;
                    padding-top: 4px;
                    height: 48px;
                }

                vaadin-grid.material {

                    font-family: Roboto, sans-serif;
                    --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                    --vaadin-grid-cell: {
                        padding: 8px;
                    };

                    --vaadin-grid-header-cell: {
                        height: 64px;
                        color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                        font-size: var(--font-size-large);
                    };

                    --vaadin-grid-body-cell: {
                        height: 48px;
                        color: rgba(0, 0, 0, var(--dark-primary-opacity));
                        font-size: var(--font-size-normal);
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
                    padding-right: 0;
                }

                vaadin-grid.material .cell.last {
                    padding-right: 24px;
                }

                vaadin-grid.material paper-checkbox {
                    --primary-color: var(--paper-indigo-500);
                    margin: 0 24px;
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

                .show-all-patients {
                    bottom: 20px;
                    width: 24px;
                }
                span.show-all-patients-txt {
                    max-width: 70%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: var(--font-size-normal);
                }

                .progress-bar {
                    width: 20%;
                    right: 312px;
                    position: absolute;
                    bottom: 20px;
                }

                .add-btn-mobileonly {
                    display: block;
                    position: fixed;
                    bottom: 0;
                    right: 0;
                }

                .toggle-btn {
                    position: relative;
                }

                .closed {
                    display: none;
                }

                .line {
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    justify-content: space-between;
                    margin: 8px 0;
                }
                .line.bottom-line {
                    justify-content: flex-start;
                }

                .add-btn-container {
                    /*right: 28px;*/
                    /*position: absolute;*/
                    /*bottom: 16px;*/
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                    margin: 4px auto;

                    flex-grow: 1;
                }

                .cancel-btn {
                    --paper-button-ink-color: var(--app-text-color);
                    color: var(--app-text-color);
                    font-weight: bold;
                    font-size: 14px;
                    height: 40px;
                    min-width: 100px;
                    padding: 10px 1.2em;
                    text-transform: capitalize;
                }

                .add-btn, .exportcsv-btn {
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    color: var(--app-text-color);
                    font-weight: 700;
                    font-size: var(--font-size-normal);
                    height: 28px;
                    min-width: 100px;
                    padding: 0 12px;
                    text-transform: capitalize;
                    background: var(--app-secondary-color);
                    margin: 0 4px;
                    @apply --shadow-elevation-2dp;
                    text-transform: capitalize;
                }

                .save-btn-container {
                    width: 20%;
                    left: 0;
                    position: absolute;
                    bottom: 16px;

                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    margin-top: 2px;
                }

                .save-btn {
                    --paper-button-ink-color: var(--app-secondary-color-dark);
                    background: var(--app-secondary-color);
                    color: var(--app-text-color);
                    font-weight: bold;
                    font-size: 14px;
                    height: 40px;
                    min-width: 100px;
                    @apply --shadow-elevation-2dp;
                    padding: 10px 1.2em;
                }

                .patient-photo {
                    background: rgba(0, 0, 0, 0.1);
                    height: 26px;
                    width: 26px;
                    min-width: 26px;
                    border-radius: 50%;
                    margin-right: 8px;
                    overflow: hidden !important;
                    padding-right: 0 !important;
                }

                .patient-photo img {
                    width: 100%;
                    margin: 50%;
                    transform: translate(-50%, -50%);
                }

                .container {
                    width: 100%;
                    height: calc(100vh - 64px - 20px);
                    position: fixed;
                    top: 64px;
                    left: 0;
                    bottom: 0;
                    right: 0;
                }

                .first-filter-panel {
                    height: 100%;
                    background: var(--app-background-color-dark);
                    top: 64px;
                    left: 0;
                    @apply --shadow-elevation-3dp;
                    grid-column: 1 / 1;
                    grid-row: 1 / 1;
                    z-index: 3;
                    overflow: hidden;
                    padding: 5px;
                }

                .second-filter-panel {
                    height: 100%;
                    background: var(--app-background-color);
                    top: 64px;
                    left: 20%;
                    @apply --shadow-elevation-2dp;
                    margin: 0;
                    grid-column: 2 / 4;
                    grid-row: 1 / 1;

                    z-index: 2;
                    @apply --padding-right-left-32;

                    display: flex;
                    flex-direction: column;
                }

                .display-left-menu {
                    display: inherit;
                }

                .submenus-container {
                    overflow-x: auto;
                    height: calc(100% - 140px);
                    margin-bottom: 16px;
                }

                collapse-button > .menu-item.iron-selected {
                    @apply --padding-right-left-16;
                    color: var(--app-text-color-light);
                    background: var(--app-primary-color);
                    @apply --text-shadow;
                }

                .menu-item {
                    @apply --padding-right-left-16;
                    height: 48px;
                    @apply --paper-font-button;
                    text-transform: inherit;
                    justify-content: space-between;
                    cursor: pointer;
                    @apply --transition;
                }

                .menu-item:hover {
                    background: var(--app-dark-color-faded);
                    @apply --transition;
                }

                .menu-item .iron-selected {
                    background: var(--app-primary-color);
                }

                .deleteFilterIcon {
                    color: var(--app-text-color-disabled);
                }

                .deleteFilterIcon:hover {
                    color: var(--app-text-color);
                    transition: all 0.24s ease-in-out;
                }

                .deleteFilterIcon iron-icon {
                    height: 14px;
                    width: 14px;
                }

                paper-item.iron-selected {
                    background-color: var(--app-primary-color);
                    color: var(--app-text-color-light);
                }

                paper-item.iron-selected:hover {
                    background: #5a6d75;
                }

                #selectPatientOption {
                    height: calc(58px + 78px);
                    box-sizing: border-box;
                    padding: 14px;
                    background: var(--app-background-color-dark);
                    -webkit-transition: background .15s;
                    transition: background .15s;
                    z-index: 2;
                    display: flex;
                    border-left: 1px solid rgba(0,0,0,.05);
                    border-right: 1px solid rgba(0,0,0,.05);
                    display: flex;
                    flex-flow: row wrap;
                    align-items: center;
                }

                #selectPatientOption_back {
                    min-width: 80px;
                    cursor: pointer;
                    line-height: 35px;
                }

                #selectPatientOption_text {
                    margin: auto;
                }

                #selectPatientOption_option {
                    cursor: pointer;
                }

                paper-listbox {
                    background: none;
                }

                #sharePatientDialog {
                    width: 1000px;
                    height: 60vh;
                }

                #sharePatientDialog .content{
                    padding: 12px;
                }

                #sharePatientDialog vaadin-grid{
                    min-height: 400px;
                    margin-top: 24px;
                }

                #sharePatientDialog #hcpFilter, #hcp-list {
                    margin: 0;
                }
                #sharePatientDialog #hcpFilter {
                    max-height: 62px;
                }
                #sharePatientDialog #hcp-list {
                    height: calc(100% - 24px - 64px);
                }

                paper-checkbox{
                    --paper-checkbox-checked-color: var(--app-secondary-color);
                }

                #inputGender {
                    border: none;
                    width: calc(100% - 24px);
                    outline: 0;
                    background: none;
                    font-size: var(--form-font-size);
                }

                #fusionPatSelect {
                    border: none;
                    width: calc(100% - 24px);
                    outline: 0;
                    background: none;
                    font-size: var(--form-font-size);
                }

                #duplicate-list {
                    max-height: 200px;
                }

                #sharePatientDelegationDialog {
                    width: 50%;
                }

                #sharePatientDelegationDialog .content{
                    padding-bottom: calc(52px + 24px);
                    padding-top: 24px;
                }

                #sharingPatientStatus {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                }

                #sharingPatientStatus vaadin-grid {
                    width: calc(100% - 96px);
                    margin: auto;
                }

                .delegationCheckBox {
                    width: 220px;
                }

                .filter-panel-title {
                    display: block;
                    @apply --paper-font-body2;
                    @apply --padding-32;
                    padding-top: 8px;
                    padding-bottom: 8px;
                    margin: 0;
                }


                paper-button.filter-tag.iron-selected {
                    background: var(--app-secondary-color);
                    color: var(--app-primary-color-dark);
                }

                paper-dialog > div:not(.buttons) {
                    margin-top: 0;
                    flex-grow: 1;
                }

                paper-dialog {
                    width: 50%;
                }

                #saveFilterDialog {
                    align-items: center;
                }

                #saveFilterDialog .buttons {
                    padding: 8px 24px;
                }

                .saved-filters {
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    width: 100%;
                }

                .filter-tag {
                    background: rgba(0,0,0,.1);
                    color: var(--exm-token-input-badge-text-color,--text-primary-color);
                    height: 20px;
                    font-size: 12px;
                    min-width: initial;
                    padding: 4px;
                    border-radius: 5px;
                    text-transform: capitalize;
                }

                .del-filter {
                    height: 13px;
                    width: 13px;
                    margin-left: 8px;
                }

                .add-btn-mobile {
                    display: none;
                }

                .status-green {
                    background: #07f8804d;
                }

                .status-red {
                    background: #ff4d4d4d;
                }

                pre.recap-filter {
                    flex-grow: 1;
                    margin: 4px;
                    background: var(--app-background-color-dark);
                    padding: 4px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    box-sizing: border-box;
                    max-width: 90%;
                }

                paper-button[disabled] {
                    background-color: var(--app-secondary-color-dark);
                    color: var(--app-text-color-disabled);
                    box-shadow: none;
                }

                @media screen and (max-width: 1120px) {
                    div.container {
                        display: inherit;
                    }

                    .add-btn-container {
                        width: 100%;
                        left: inherit;
                        position: initial;
                        justify-content: initial;
                        padding-top: 15px;
                        overflow-x: scroll;
                        height: 100px;
                        border-left: 1px dashed lightgrey;
                        border-right: 1px dashed lightgrey;
                        box-sizing: border-box;
                    }

                    .add-btn-container paper-button.add-btn,
                    .add-btn-container .exportcsv-btn {
                        height: 60px;
                    }

                    .add-btn-container {
                        display: none;
                    }

                    .add-btn-mobile {
                        display: block;
                        position: fixed;
                        bottom: 26px;
                        right: 36px;
                    }

                    .add-list-mobile {
                        position: fixed;
                        bottom: 60px;
                        right: 32px;

                        background: var(--app-background-color-light);
                        width: 200px;
                        border: 1px solid rgba(0, 0, 0, .1);
                        border-radius: 2px;
                        z-index: 99;
                        padding: 8px 0;

                        transition: .25s cubic-bezier(0.075, 0.82, 0.165, 1);
                        transform: scaleY(0);
                        transform-origin: bottom;
                    }

                    .shown-menu {
                        transform: scaleY(1);
                    }

                    .toggle-btn {
                        background: var(--app-secondary-color);
						color: var(--app-text-color-light);
						box-shadow: var(--app-shadow-elevation-1);
						border-radius: 3px;
						height: 28px;
						width: 28px;
						box-sizing: border-box;
						padding: 4px;
                    }

					.toggle-btn:hover {
						box-shadow: var(--app-shadow-elevation-2);
						background: var(--app-secondary-color-dark);
						color: var(--app-text-color-light);
					}

                    .add-elem-mobile {
                        cursor: pointer;
                        padding: 10px;
                    }

                    .add-elem-mobile:hover {
                        background: rgba(0, 0, 0, .1);
                    }

                    .eid {
                        padding-top: 12px;
                    }

                    .dialog {
                        width: 80%;
                        min-height: 320px;
                        display: flex;
                        flex-flow: row wrap;
                        justify-content: space-between;
                        align-items: flex-start;
                    }
                    .add-pat-dialog {
                        display: initial;
                    }
                }

                ht-spinner {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    z-index: 9999;
                    transform: translate(-50%, -50%);
                    height: 42px;
                    width: 42px;
                }

                import-spinner {
                    position: fixed;
                    top: 210px;
                    left: 50%;
                    z-index: 9999;
                    transform: translateX(-60%);
                }


                #add-patient-dialog {
                    height: 400px;
                    width: 660px;
                }

                #add-patient-dialog .administrative-panel {
                    overflow: hidden;
                }

                #add-patient-dialog .administrative-panel iron-pages {
                    padding: 12px;
                    overflow: auto;
                    max-height: calc(100% - 45px - 30px);
                }

                #add-patient-dialog .administrative-panel iron-pages page {
                    display: flex;
                    flex-flow: row wrap;
                    align-items: center;
                    justify-content: space-between;
                }

                #add-patient-dialog .administrative-panel paper-input, #add-patient-dialog .administrative-panel vaadin-combo-box, #add-patient-dialog .administrative-panel paper-checkbox {
                    flex-grow: 1;
                    margin: 0 6px 12px;
                }

                #add-patient-dialog .administrative-panel paper-dropdown-menu {
                    margin: 0 6px 12px;
                }

                #add-patient-dialog .administrative-panel paper-icon-button{
                    margin-top: 8px;
                }

                #add-patient-dialog .administrative-panel label{
                    font-weight: 700; 
                    display: block; 
                    margin: 0 6px 12px;
                }

                .extra-info{
                    color:var(--app-text-color-disabled);
                    font-style: italic;
                    font-size: 80%;
                }

                .close-button-icon{
                    position: absolute;
                    top: 0;
                    right: 0;
                    margin: 0;
                    transform: translate(50%, -50%);
                    height: 32px;
                    width: 32px;
                    padding: 8px;
                    background: var(--app-primary-color);
                }

                vaadin-upload {
                    overflow-y: auto;
                    margin-top: 24px;
                    margin-bottom: calc(24px + 52px);
                    min-height: 280px;
                    background: var(--app-background-color);
                    --vaadin-upload-buttons-primary: {
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
                    --vaadin-upload-file-progress: {
                        --paper-progress-active-color: var(--app-secondary-color);
                    };
                    --vaadin-upload-file-commands: {
                        color: var(--app-primary-color);
                    }
                }

                .doNotDisplay {
                    display: none;
                }

                .eid-notification-panel{
                    display: none;
                    flex-direction: column;
                    position: fixed;
                    top: 84px;
                    right: -264px;
                    padding: 0;
                    background: var(--app-background-color);
                    color: var(--app-text-color);
                    font-size: 13px;
                    width: 460px;
                    opacity: 0;
                    z-index: 1000;
                    border-radius: 3px 0 0 3px;
                    box-shadow: var(--app-shadow-elevation-1);
                    overflow: hidden;
                    transition: all .5s ease-in;
                    z-index: 2;
                }


                .notification {
                    display: flex;
                    opacity: 1;
                    right: 16px;
                }

                div.panel-header {
                    background: var(--app-secondary-color-dark);
                    margin-bottom: 8px;
                    font-size: 1.5em;
                    width: 100%;
                    text-align: center;
                    padding: 8px 16px;
                    box-sizing: border-box;
                }
                vaadin-grid.eid-patients-list {
                    width: 448px;
                    max-height: 256px;
                    overflow-y: auto;
                    margin: 0 8px;
                }
                div.panel-bottom-btns {
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    justify-content: flex-end;
                }
                div.panel-bottom-btns > paper-button {
                    margin: 4px;
                    transition: .25s ease;
                }
                div.panel-bottom-btns > paper-button > iron-icon {
                    padding: 4px;
                    box-sizing: border-box;
                    opacity: .7;
                }
                div.panel-bottom-btns > paper-button:hover {
                    box-shadow: var(--app-shadow-elevation-2);
                }

                paper-icon-button.save-filter {
                    height: 20px;
                    width: 20px;
                    padding: 2px;
                    box-sizing: border-box;
                }

                .export-container, .share-container {
                    position:relative;
                }

                .exports-container, .shares-container{
                    text-align: right;
                    position: absolute;
                    margin-top: 8px;
                    bottom: 30px;
                    left: 4px;
                    background-color: var(--app-background-color);
                    opacity: 1;
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

                .exports-container paper-button, .shares-container paper-button{
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
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
                    text-transform: inherit;
                }
                .exports-container paper-button:hover, .shares-container paper-button:hover{
                    background: var(--app-background-color-dark);
                }

                .exports-container paper-button iron-icon, .shares-container paper-button iron-icon{
                    color: var(--app-secondary-color);
                    height: 20px;
                    width: 20px;
                    margin-right: 4px;
                    box-sizing: border-box;
                }


            </style>
        </custom-style>

        <div class="container">
            <ht-pat-fusion-dialog id="fusion-dialog" api="[[api]]" language="[[language]]" user="[[user]]" i18n="[[i18n]]" resources="[[resources]]" on-patient-merged="_patientMerged"></ht-pat-fusion-dialog>
            <ht-auto-read-eid-opening id="autoRead" language="[[language]]" resources="[[resources]]" card="[[cardData]]" api="[[api]]" user="[[user]]"></ht-auto-read-eid-opening>

            <div class="second-filter-panel">

                <template is="dom-if" if="{{_isPatientsSelected(nbPatientSelected.*)}}">
                    <div id="selectPatientOption">
                        <div id="selectPatientOption_back" on-tap="_deselectAllSelectedPatients">
                            <iron-icon icon="vaadin:arrow-left"></iron-icon>
                            <span>[[localize('can','Cancel',language)]]</span>
                        </div>
                        <div id="selectPatientOption_text">
                            [[nbPatientSelected]] [[localize('pat','Patients',language)]] [[localize('multiple_selected','Selected',language)]]
                        </div>
                    </div>
                </template>
                <template is="dom-if" if="{{!_isPatientsSelected(nbPatientSelected.*)}}">
                    <div class="search-field-container">
                        <!--paper-button class="button button--save" on-tap="displayAllPatients">View All Patients</paper-button-->
                        <paper-input always-float-label="" id="filter" label="[[localize('search','Search',language)]]" value="{{filterValue}}" autofocus="">
                            <div slot="suffix">
                                <paper-icon-button icon="star" id="save-filter" class="save-filter" on-tap="_saveFilter" disabled="[[!filterValue.length]]"></paper-icon-button>
                                <paper-tooltip for="save-filter" position="left">[[localize('save_filter','Save filter',language)]]</paper-tooltip>
                            </div>
                        </paper-input>
                    </div>
                    <div id="saved-filters" class="saved-filters">
                        <paper-listbox id="filters" selectable="paper-button" multi="" toggle-shift="" selected-values="{{selectedFilterIndexes}}">
                            <template is="dom-repeat" items="[[_activeFilters(user.properties.*)]]" as="filter" id="filterMenu">
                                <paper-button class="filter-tag" id="[[filter.id]]" api="[[api]]" user="[[user]]" language="[[language]]">
                                    <div class="one-line-menu list-title">
                                        [[_localizeFilterName(filter.name)]]
                                    </div>
                                    <div>
                                        <template is="dom-if" if="[[_isCustomFilter(filter)]]">
                                            <iron-icon class="del-filter" icon="vaadin:trash" id="[[filter.id]]" on-tap="deleteFilter"></iron-icon>
                                        </template>
                                    </div>
                                </paper-button>
                            </template>
                        </paper-listbox>
                    </div>
                </template>

                <template is="dom-if" if="[[isLoadingPatient]]">
                    <div class="loadingContainer">
                        <div class="loadingContentContainer">
                            <div style="max-width:200px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner></div>
                        </div>
                    </div>
                </template>
                <vaadin-grid id="patients-list" class="material" multi-sort="[[multiSort]]" active-item="{{activeItem}}" on-tap="clickOnRow">
                    <template is="dom-if" if="[[onElectron]]">
                        <vaadin-grid-column flex-grow="0" width="64px">
                            <template class="header">
                                <div class="cell frozen"></div>
                            </template>
                            <template>
                                <div class="cell frozen">
                                    <template is="dom-if" if="[[!_optionsChecked(shareOption.*,exportOption.*,fusionOption.*, preventionOption.*)]]">
                                        <paper-icon-button id="new-window-[[item.id]]" icon="icons:open-in-new" on-tap="openPatientOnElectron" data-item\$="[[item.id]]"></paper-icon-button>
                                        <paper-tooltip for="new-window-[[item.id]]" position="right" style="white-space: nowrap;">[[localize('new_win','New window',language)]]</paper-tooltip>
                                    </template>
                                </div>
                            </template>
                        </vaadin-grid-column>
                    </template>


                    <vaadin-grid-column flex-grow="0" width="52px">
                        <template class="header">
                            <template is="dom-if" if="[[_optionsChecked(shareOption.*,exportOption.*,fusionOption.*, preventionOption.*)]]">
                                <vaadin-checkbox checked="[[isAllPatientCheck]]" on-checked-changed="_checkAllPatientChanged"></vaadin-checkbox>
                            </template>
                            <!-- <div class="cell frozen">[[localize('pic','Picture',language)]]</div> -->
                        </template>
                        <template>
                            <template is="dom-if" if="[[!_optionsChecked(shareOption.*,exportOption.*,fusionOption.*, preventionOption.*)]]">
                                <div class="cell frozen patient-photo">
                                    <img src\$="[[picture(item)]]">
                                </div>
                            </template>
                            <template is="dom-if" if="[[_optionsChecked(shareOption.*,exportOption.*,fusionOption.*, preventionOption.*)]]">
                                <vaadin-checkbox id="[[item.id]]" patient="[[item]]" checked="[[_patientSelected(item, patientSelected.*)]]" on-checked-changed="_checkSharePatient"></vaadin-checkbox>
                            </template>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="externalId">[[localize('ext_id_short', 'File N°', language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.externalId]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="10%">
                        <template class="header">
                            <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.lastName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="10%">
                        <template class="header">
                            <vaadin-grid-sorter path="firstName">[[localize('fir_nam','First name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.firstName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="104px">
                        <template class="header">
                            <vaadin-grid-sorter path="dateOfBirth">[[localize('dat_of_bir','Date of birth',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[formatDateOfBirth(item.dateOfBirth)]]</div>
                        </template>
                    </vaadin-grid-column>

                    <vaadin-grid-column flex-grow="0" width="100px">
                        <template class="header">
                            <div class="cell numeric">[[localize('pho','Phone',language)]]</div>
                        </template>
                        <template>
                            <div class="cell numeric">[[_getPhone(item)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <!-- <vaadin-grid-column flex-grow="0" width="150px">
                        <template class="header">
                            <div class="cell numeric">[[localize('mob','Mobile',language)]]</div>
                        </template>
                        <template>
                            <div class="cell numeric">[[item.mobile]]</div>
                        </template>
                    </vaadin-grid-column> -->
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">
                            <div class="cell frozen">[[localize('postalAddress','Address',language)]]</div>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.postalAddress]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column flex-grow="0" width="17%">
                        <template class="header">
                            <div class="cell frozen">[[localize('ema','Email',language)]]</div>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.email]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>

                <div class="add-btn-mobile">
                    <paper-fab mini="" icon="more-vert" id="add-btn-mobile-btn" class="toggle-btn" on-tap="toggleMobileMenu"></paper-fab>
                    <paper-tooltip position="left" for="add-btn-mobile-btn">[[localize('more','More',language)]]</paper-tooltip>
                    <div id="add-list-mobile" class\$="add-list-mobile [[isShown]]">
                        <template is="dom-if" if="[[!_optionsChecked(shareOption.*,exportOption.*,fusionOption.*, preventionOption.*)]]">
                            <div class="add-elem-mobile" on-tap="_addPatient">[[localize('add_pat','Add Patient',language)]]
                            </div>
                            <template is="dom-if" if="[[btnSelectionPatient]]">
                                <div class="add-elem-mobile" on-tap="_sharePatient">[[localize('share_pat','Share patients',language)]]</div>
                                <div class="add-elem-mobile" on-tap="_exportPatientAsPMF">[[localize('export_pat_pmf','Export patients (PMF)',language)]]</div>
                                <div class="add-elem-mobile" on-tap="_exportPatient">[[localize('export_pat_smf','Export patients (SMF)',language)]]</div>
                                <div class="add-elem-mobile" on-tap="_fusionPatient">[[localize('fus_pat','Fusion patients',language)]]</div>
                                <div class="add-elem-mobile" on-tap="_preventionPatient">[[localize('prim_prev','Primary prevention',language)]]</div>
                            </template>
                            <div class="add-elem-mobile" on-tap="_sharePatientAll">[[localize('share_all_pat','Share all patients',language)]]
                            </div>
                            <div class="add-elem-mobile" on-tap="_exportFilteredPatientListToXls">[[localize('export_xls','Export to XLS',language)]]
                            </div>
                            <div class="add-elem-mobile" on-tap="_exportAllPatientListToXls">[[localize('export_all_pat_xls','Export all patients to XLS',language)]]
                            </div>
                            <div class="add-elem-mobile" on-tap="_openImportPatientFromMfDialog">[[localize('import_mf','Import patient from PMF/SMF',language)]]
                            </div>
                        </template>
                        <template is="dom-if" if="[[_optionsChecked(shareOption.*,exportOption.*,fusionOption.*, preventionOption.*)]]">
                            <div class="add-elem-mobile" on-tap="_cancelSelecting">[[localize('canc','Cancel',language)]]</div>
                            <div class="add-elem-mobile" on-tap="_openPatientActionDialog">[[localize('sel','Select',language)]]</div>
                            <template is="dom-if" if="[[taskProgress]]">
                                <vaadin-progress-bar class="progress-bar" value="[[taskProgress]]"></vaadin-progress-bar>
                            </template>
                        </template>
                    </div>
                </div>

                <div class="line bottom-line">
                    <vaadin-checkbox class="show-all-patients" checked="{{showInactive}}">
                    </vaadin-checkbox>
                    <span class="show-all-patients-txt">[[localize('show_inactive_patients','Show inactive patients',language)]]</span>

                    <div class="add-btn-container">


                        <template is="dom-if" if="[[!_optionsChecked(shareOption.*,exportOption.*,fusionOption.*, preventionOption.*)]]">
                            <paper-button class="button button--save" on-tap="_addPatient">[[localize('add_pat','Add Patient',language)]]</paper-button>

                            <template is="dom-if" if="[[!showExportContainer]]">
                                <paper-button id="newExportBtn" class="button button--menu" on-tap="_toggleExportActions">
                                    <span class="no-mobile">[[localize('btn-export','Export',language)]]</span>
                                    <iron-icon icon="[[_actionIcon(showExportContainer)]]"></iron-icon>
                                </paper-button>
                            </template>
                            <template is="dom-if" if="[[showExportContainer]]">
                                <div class="export-container">
                                    <paper-button class="button button--menu" on-tap="_toggleExportActions">
                                        <span class="no-mobile">[[localize('clo','Close',language)]]</span>
                                        <iron-icon icon="[[_actionIcon(showExportContainer)]]"></iron-icon>
                                    </paper-button>
                                    <div class="exports-container">
                                        <paper-button class="button button--other" on-tap="_exportAllPatientListToXls">[[localize('export_all_pat_xls','Export all patients to XLS',language)]]</paper-button>
                                        <template is="dom-if" if="[[btnSelectionPatient]]">
                                            <paper-button class="button button--other" on-tap="_exportPatientAsPMF">[[localize('export_pat_pmf','Export patients',language)]]</paper-button>
                                            <paper-button class="button button--other" on-tap="_exportPatient">[[localize('export_pat_smf','Export patients',language)]]</paper-button>
                                            <paper-button class="button button--other" on-tap="_exportFilteredPatientListToXls">[[localize('export_xls','Export to XLS',language)]]</paper-button>
                                        </template>
                                    </div>
                                </div>
                            </template>

                            <template is="dom-if" if="[[!showShareContainer]]">
                                <paper-button id="newShareBtn" class="button button--menu" on-tap="_toggleShareActions">
                                    <span class="no-mobile">[[localize('btn-share','Share',language)]]</span>
                                    <iron-icon icon="[[_actionIcon(showShareContainer)]]"></iron-icon>
                                </paper-button>
                            </template>
                            <template is="dom-if" if="[[showShareContainer]]">
                                <div class="share-container">
                                    <paper-button class="button button--menu" on-tap="_toggleShareActions">
                                        <span class="no-mobile">[[localize('clo','Close',language)]]</span>
                                        <iron-icon icon="[[_actionIcon(showShareContainer)]]"></iron-icon>
                                    </paper-button>
                                    <div class="shares-container">
                                       <paper-button class="button button--other" on-tap="_sharePatientAll">[[localize('share_all_pat','Share all patients',language)]]</paper-button>
                                       <template is="dom-if" if="[[btnSelectionPatient]]">
                                           <paper-button class="button button--other" on-tap="_sharePatient">[[localize('share_pat','Share patients',language)]]</paper-button>
                                        </template>
                                    </div>
                                </div>
                            </template>

                            <template is="dom-if" if="[[btnSelectionPatient]]">
                                <paper-button class="button button--other" on-tap="_fusionPatient">[[localize('fus_pat','Fusion patients',language)]]
                                </paper-button>
                                <paper-button class="button button--other" on-tap="_preventionPatient">[[localize('prim_prev','Prevention',language)]]</paper-button>
                            </template>

                            <paper-button class="button button--other" on-tap="_openImportPatientFromMfDialog">[[localize('import_mf','Import patient from PMF/SMF',language)]]
                            </paper-button>
                        </template>

                        <template is="dom-if" if="[[_optionsChecked(shareOption.*,exportOption.*,fusionOption.*, preventionOption.*)]]">
                            <paper-button class="button" on-tap="_cancelSelecting">[[localize('canc','Cancel',language)]]</paper-button>
                            <paper-button class="button button--save" on-tap="_openPatientActionDialog">
                                <iron-icon icon="icons:check" on-tap="_openPatientActionDialog"></iron-icon>
                                [[localize('sel','Select',language)]]
                            </paper-button>
                            <template is="dom-if" if="[[taskProgress]]">
                                <vaadin-progress-bar class="progress-bar" value="[[taskProgress]]"></vaadin-progress-bar>
                            </template>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <ht-import-mf-dialog id="import-mf-dialog" on-add-patient="_addPatientNoOpen" added-patient="{{addedPatient}}" api="[[api]]" user="[[user]]" resources="[[resources]]" language="[[language]]"></ht-import-mf-dialog>

        <paper-dialog id="add-patient-dialog" class="dialog add-pat-dialog" on-opened-changed="_addPatientDialogOpenedChanged">
            <h2 class="modal-title">[[localize('add_pat','Add a patient',language)]]</h2>
            <div class="content administrative-panel">
                <paper-tabs selected="{{tabs}}">
                    <paper-tab class="adm-tab">
                        <iron-icon icon="icons:assignment-ind"></iron-icon>
                        [[localize('subscription_form_physical_person','Physical person',language)]]
                    </paper-tab>
                    <paper-tab class="adm-tab doNotDisplay" id="medicalHouseTabView">
                        <iron-icon icon="vaadin:family"></iron-icon>
                        [[localize('subscription_form_medical_house','Medical houses',language)]]
                    </paper-tab>
                </paper-tabs>
                <iron-pages selected="[[tabs]]">
                    <page>
                        <template is="dom-if" if="[[onElectron]]">
                            <paper-icon-button icon="vaadin:health-card" id="read-eid" class="button--icon-btn" on-tap="_readEid"></paper-icon-button>
                            <paper-tooltip for="read-eid" position="top">[[localize('fill_with_eid','Fill with eID',language)]]</paper-tooltip>
                        </template>
                        
                        <paper-input always-float-label="" label="[[localize('las_nam','Last name',language)]]" style="min-width:200px" value="{{lastName}}"></paper-input>
                        
                        <paper-input always-float-label="" label="[[localize('fir_nam','First name',language)]]" value="{{firstName}}"></paper-input>
                        
                        <vaadin-date-picker-light id="datePickerCreation" i18n="[[i18n]]" attr-for-value="value" can-be-fuzzy>
                            <paper-input always-float-label="" label="[[localize('dat_of_bir','Date of birth',language)]]" value="{{dateAsString}}"></paper-input>
                        </vaadin-date-picker-light>
                        
                        <paper-input always-float-label="" label="[[localize('niss','Ssin',language)]]" value="{{ssin}}" on-keyup="_searchDuplicate"></paper-input>
                        
                        <paper-dropdown-menu label="[[localize('gender','Gender',language)]]" always-float-label>
                            <paper-listbox id="dropdown-listbox" slot="dropdown-content" selected="{{selected}}" selected-item="{{selectedItem}}">
                                <paper-item id="unknown">[[localize('unknown','unknown',language)]]</paper-item>
                                <paper-item id="male">[[localize('male','male',language)]]</paper-item>
                                <paper-item id="female">[[localize('female','female',language)]]</paper-item>
                                <paper-item id="indeterminate">[[localize('indeterminate','indeterminate',language)]]</paper-item>
                                <paper-item id="changed">[[localize('changed','changed',language)]]</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
  
                        <paper-checkbox class="doNotDisplay" checked="{{createMhContract}}" id="createMedicalHouseContractCheckBox" label="[[localize('subscription_form_medical_house','Medicalhouse flatrate subscription',language)]]" style="width:100%;">[[localize('subscription_form_medical_house','Medicalhouse flatrate subscription',language)]]?</paper-checkbox>
                        <template is="dom-if" if="[[displayResult]]">
                            <vaadin-grid id="duplicate-list" class="material" items="[[listResultPatients]]" style="width: 100%;" height-by-rows>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('las_nam','Last name',language)]]
                                    </template>
                                    <template>
                                        <div>[[item.lastName]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('fir_nam','First name',language)]]
                                    </template>
                                    <template>
                                        <div>[[item.firstName]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('dat_of_bir','Date of birth',language)]]
                                    </template>
                                    <template>
                                        <div>[[formatDateOfBirth(item.dateOfBirth)]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('ssin','SSIN',language)]]
                                    </template>
                                    <template>
                                        <div>[[item.ssin]]</div>
                                    </template>
                                </vaadin-grid-column>
                                <vaadin-grid-column>
                                    <template class="header">
                                        [[localize('remark','Remarks',language)]]
                                    </template>
                                    <template>
                                        <div>[[item.remarks]]</div>
                                    </template>
                                </vaadin-grid-column>
                            </vaadin-grid>

                        </template>
                        
                    </page>
                    <page>
                        <!--Medical houses-->
                        <vaadin-combo-box id="mh-search" filtered-items="[[mhListItem]]" item-label-path="hrLabel" style="width:100%" item-value-path="id" on-filter-changed="_mhSearch" on-keydown="" label="[[localize('mh','Medical house',language)]]" value="{{medicalHouseContractShadowObject.hcpId}}"></vaadin-combo-box>

                        <vaadin-date-picker-light id="startOfContract" i18n="[[i18n]]" attr-for-value="value" style="width: 30%">
                            <paper-input always-float-label label="[[localize('sub_dat','Subscription date',language)]]" value="" on-value-changed="updateStartOfCoverage"></paper-input>
                        </vaadin-date-picker-light>

                        <paper-input label="[[localize('sub_eva_mon','Subscription evaluation months',language)]]" i18n="[[i18n]]" value="0" id="evalutationMonths" on-value-changed="updateStartOfCoverage" type="number" always-float-label min="0" step="3" max="3" style="width: 30%"></paper-input>

                        <vaadin-date-picker-light id="startOfCoverage" i18n="[[i18n]]" attr-for-value="value" style="width: 30%">
                            <paper-input always-float-label="" label="[[localize('cov_sta','Coverage start',language)]]" value="" readonly=""></paper-input>
                        </vaadin-date-picker-light>
                        
                        <label>[[localize('patient_subscriptions','Patient subscriptions',language)]]:</label>
                        <paper-checkbox checked="{{medicalHouseContractShadowObject.gp}}" id="medicalHouseContractGpCheckBox" label="[[localize('has_m','Has doctor subscription',language)]]">[[localize('has_m','Has doctor subscription',language)]]?</paper-checkbox>
                        <paper-checkbox checked="{{medicalHouseContractShadowObject.kine}}" id="medicalHouseContractKineCheckBox" label="[[localize('has_k','Has physiotherapist subscription',language)]]">[[localize('has_k','Has physiotherapist subscription',language)]]?</paper-checkbox>
                        <paper-checkbox checked="{{medicalHouseContractShadowObject.nurse}}" id="medicalHouseContractNurseCheckBox" label="[[localize('has_i','Has nurse subscription',language)]]">[[localize('has_i','Has nurse subscription',language)]]?</paper-checkbox>
                    </page>
                </iron-pages> 
                
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <template is="dom-if" if="[[openAddedPatient]]">
                    <paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="confirmAddAndOpenPatient" disabled="[[!canAddPat]]">[[localize('cre','Create',language)]]</paper-button>
                </template>
                <template is="dom-if" if="[[!openAddedPatient]]">
                    <paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="confirmAddPatient" disabled="[[!canAddPat]]"><iron-icon icon="social:person-add"></iron-icon>[[localize('cre','Create',language)]]</paper-button>
                </template>
            </div>
            
        </paper-dialog>


        <paper-dialog id="saveFilterDialog">
            <h2 class="modal-title">[[localize('save_filter','Save Filter',language)]]</h2>
            <div>
                <paper-input class="filterNameInput" label="[[localize('filter_name','Filter name',language)]]" value="{{filterName}}"></paper-input>
            </div>
            <div class="line">
                <span>[[localize('fil','Filter',language)]] : </span>
                <pre class="recap-filter">[[filterValue]]</pre>
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="confirmFilter">[[localize('cre','Create',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="sharePatientDialog">
            <h2 class="modal-title">[[localize('share_to_what_hcp','With which provider do you want to share these patients',language)]] ?</h2>
            <div class="content">
                <paper-input id="hcpFilter" label="[[localize('fil','Filter',language)]]" always-float-label="" value="{{hcpFilterValue}}"></paper-input>
                <vaadin-grid id="hcp-list" class="material" multi-sort="[[multiSort]]" items="[[hcp]]" active-item="{{activeHcp}}">
                    <vaadin-grid-column width="40px">
                        <template class="header">
                            <vaadin-checkbox on-checked-changed="_toggleBoxes"></vaadin-checkbox>
                        </template>
                        <template>
                            <vaadin-checkbox class="checkbox" id="[[item.id]]" checked="[[_sharingHcp(item, hcp.*)]]" on-checked-changed="_checkHcp" disabled="[[shareAll]]"></vaadin-checkbox>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="lastName">[[localize('las_nam','Last name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[_any(item.lastName, item.name, item)]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="firstName">[[localize('fir_nam','First name',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.firstName]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="speciality">[[localize('spe','Speciality',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.speciality]]</div>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="100px">
                        <template class="header">
                            <vaadin-grid-sorter path="email">[[localize('ema','Email',language)]]
                            </vaadin-grid-sorter>
                        </template>
                        <template>
                            <div class="cell frozen">[[item.email]]</div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <paper-checkbox on-checked-changed="displayAllHcps">[[localize('disp_all_hcps','Display all HCPs', language)]]</paper-checkbox>
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="confirmSharingNextStep">[[localize('share_pat','Share
                    patients',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="sharePatientDelegationDialog">
            <h2 class="modal-title">[[localize("titleSharPatDelDia","Quels sont les droits d'accès à partager ?",language)]]</h2>
            <div class="content">
                <vaadin-grid items="[[hcpSelectedForSharing]]">
                    <vaadin-grid-column width="150px">
                        <template class="header">
                            [[localize('hcp_ident','HCP',language)]]
                        </template>
                        <template>
                            [[getNamesWithHcpId(item.id)]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="700px">
                        <template class="header">
                            [[localize('access_rights','Access rights',language)]]
                        </template>
                        <template>
                            <div>
                                <template is="dom-repeat" items="[[delegation]]" as="delegationTag">
                                    <template is="dom-if" if="{{_showAllDelegation(delegationTag,item.id,hcpSelectedForSharing.*)}}">
                                        <vaadin-checkbox class="delegationCheckBox" id="[[item.id]][[delegationTag]]" checked="{{checkingDelegation(delegationTag,item.delegation,hcpSelectedForSharing.*)}}" on-checked-changed="_checkDelegation">[[localize(delegationTag,delegationTag,language)]]
                                        </vaadin-checkbox>
                                        <template is="dom-if" if="{{_neededBr(delegationTag)}}">
                                            <br>
                                        </template>
                                    </template>
                                </template>
                            </div>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" dialog-confirm="" autofocus="" on-tap="confirmSharing">[[localize('share_pat','Share patients',language)]]
                </paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="sharingPatientStatus">
            <h2 class="modal-title">[[localize("pat_sha_sta","Patient sharing status",language)]]</h2>
            <div class="content">
                <template is="dom-if" if="[[isSharingPatient]]">
                    <div class="loadingContainer">
                        <div class="loadingContentContainer">
                            <div style="max-width:200px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner></div>
                        </div>
                    </div>
                </template>
                <vaadin-grid items="[[patientShareStatuses]]">
                    <vaadin-grid-column width="150px">
                        <template class="header">
                            [[localize('pati','Patient',language)]]
                        </template>
                        <template>
                            [[item.patient.firstName]] [[item.patient.lastName]]
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('pati','Patient',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.patient)]]">[[_statusDetail(item.statuses.patient)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('contacts','Contacts',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.contacts)]]">[[_statusDetail(item.statuses.contacts)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            Health elements
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.healthElements)]]">[[_statusDetail(item.statuses.healthElements)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            Invoices
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.invoices)]]">[[_statusDetail(item.statuses.invoices)]]</span>
                        </template>
                    </vaadin-grid-column>
                    <vaadin-grid-column width="70px">
                        <template class="header">
                            [[localize('files','Files',language)]]
                        </template>
                        <template>
                            <span class\$="[[_statusDetailClass(item.statuses.documents)]]">[[_statusDetail(item.statuses.documents)]]</span>
                        </template>
                    </vaadin-grid-column>
                </vaadin-grid>
            </div>
            <div class="buttons">
                <paper-button class="button button--save" dialog-dismiss="">[[localize('done','Done',language)]]</paper-button>
            </div>
        </paper-dialog>

        <ht-pat-primary-prevention-dialog id="htPatPrimaryPreventionDialog" api="[[api]]" user="[[user]]" hcp="[[hcp]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" selected-patient-for-prevention="[[selectedPatientForPrevention]]" on-close-prevention="_closePrevention"></ht-pat-primary-prevention-dialog>
`;
  }

  static get is() {
      return 'ht-pat-list'
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          user: {
              type: Object
          },
          selectedPatient: {
              type: Object,
              notify: true
          },
          activeItem: {
              type: Object
          },
          hcp: {
              type: Object
          },
          hcpSelectedForSharing: {
              type: Object,
              notify: true,
              value: () => []
          },
          showInactive: {
              type: Boolean,
              value: false
          },
          shareOption: {
              type: Boolean,
              value: false
          },
          btnSelectionPatient: {
              type: Boolean,
              value: false,
              notify: true
          },
          nbPatientSelected: {
              type: Number,
              value: 0
          },
          taskProgress: {
              type: Number,
              value: 0
          },
          selectedFilters: {
              type: Array,
              notify: true,
              value: () => []
          },
          selectedFilterIndexes: {
              type: Array,
              notify: true,
              value: () => []
          },
          files: {
              type: Array
          },
          patientSelected: {
              type: Array,
              notify: true,
              value: () => []
          },
          displayResult: {
              type: Boolean,
              value: false
          },
          listResultPatients: {
              type: Object,
              value: () => []
          },
          listBoxOffsetWidth: {
              type: Number,
              value: -100
          },
          selected: {
              type: Number,
              observer: '_selectedChanged'
          },
          valueGender: {
              type: String,
              notify: true
          },
          filterValue: {
              type: String,
              value: ''
          },
          filter: {
              type: Object,
              value: null
          },
          lastName: {
              type: String,
              value: null,
              observer: '_searchDuplicate'
          },
          firstName: {
              type: String,
              value: null,
              observer: '_searchDuplicate'
          },
          dateAsString: {
              type: String,
              value: null,
              observer: '_searchDuplicate'
          },
          ssin: {
              type: String,
              value: null,
              observer: '_searchDuplicate'
          },
          delegation: {
              type: Array,
              value: [
                  "all",
                  "administrativeData",
                  "generalInformation",
                  "financialInformation",
                  "medicalInformation",
                  "sensitiveInformation",
                  "confidentialInformation",
                  "cdItemRisk",
                  "cdItemFamilyRisk",
                  "cdItemHealthcareelement",
                  "cdItemAllergy",
                  "cdItemDiagnosis",
                  "cdItemLab",
                  "cdItemResult",
                  "cdItemParameter",
                  "cdItemMedication",
                  "cdItemTreatment",
                  "cdItemVaccine"
              ]
          },
          exportOption: {
              type: Boolean,
              value: false
          },
          exportAsPMF: {
              type: Boolean,
              value: false
          },
          fusionOption: {
              type: Boolean,
              value: false
          },
          preventionOption:{
              type:Boolean,
              value: false
          },
          idFusionPat: {
              type: String,
              notify: true
          },
          hcpFilterValue: {
              type: String
          },
          mobileMenuHidden: {
              type: Boolean,
              value: true
          },
          isShown: {
              type: String,
              value: ""
          },
          tabs: {
              type: Number,
              value: 0
          },
          medicalHouseContract: { // used to store MH default contract
              type: Object,
              value: () => ({
                  mmNihii: '',
                  startOfContract: null,
                  startOfCoverage: null,
                  endOfContract: null,
                  endOfCoverage: null,
                  kine: false,
                  gp: false,
                  nurse: false,
                  hcpId: ''
              })
          },
          medicalHouseContractShadowObject: { // copy for new patient contract
              type: Object,
              value: () => ({
                  mmNihii: '',
                  startOfContract: null,
                  startOfCoverage: null,
                  endOfContract: null,
                  endOfCoverage: null,
                  kine: false,
                  gp: false,
                  nurse: false,
                  hcpId: ''
              })
          },
          createMhContract:{
            type: Boolean,
            value: false
          },
          isLoadingPatient: {
              type: Boolean,
              value: false
          },
          hcpParentMedicalHouseData: {
              type: Object,
              value: null
          },
          mhListItem: {
              type: Array,
              value: function () {
                  return []
              }
          },
          isSharingPatient: {
              type: Boolean,
              value: true
          },
          shareAll: {
              type: Boolean,
              value: false
          },
          cardData: {
              type: Object,
              value: {}
          },
          newPatCardData: {
              type: Object,
              value: {}
          },
          canAddPat: {
              type: Boolean,
              value: false
          },
          eidPatientsList : {
              type : Array,
              value : []
          },
          onElectron : {
              type : Boolean,
              value : false
          },
          openAddedPatient: {
              type: Boolean,
              value: true
          },
          primaryPreventionFilters:{
              type: Array,
              value: [
                  {name: {fr: "Prévention mammotest", nl: "Mammotest", en: "Mammotest"}, type: 'breastCancer', filter: {searchString: '((gender == "female") & age>50y & age<69y & active == true) - SVC[ICPC == X76 - :CD-CERTAINTY == excluded] - HE[ICPC == X76 - :CD-CERTAINTY == excluded] - SVC[BE-THESAURUS-PROCEDURES == X41.004{<2y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)] - SVC[BE-THESAURUS-PROCEDURES == X41.006{<2y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)] - SVC[BE-THESAURUS-PROCEDURES == X41.007{<2y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)] - SVC[BE-THESAURUS-PROCEDURES == X41.008{<2y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)] - SVC[BE-THESAURUS-PROCEDURES == X41.009{<2y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)] - SVC[BE-THESAURUS-PROCEDURES == X41.010{<2y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)] - SVC[BE-THESAURUS-PROCEDURES == X41.011{<2y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)]'}},
                  {name: {fr: "Prévention cancer colo-rectal", nl: "Colorectale kanker", en: "Colorectal cancer"}, type:"colorectalCancer", filter: {searchString: '((gender == "female" | gender == "male") & active == true & (age>50y & age<74y)) - SVC[ICPC == D75 - :CD-CERTAINTY == excluded] - HE[ICPC == D75 - :CD-CERTAINTY == excluded] - SVC[BE-THESAURUS-PROCEDURES == D40.001{<5y} & :CD-LIFECYCLE == completed] - SVC[BE-THESAURUS-PROCEDURES == D36.002{<2y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)]'}},
                  {name: {fr: "Prévention frottis de col", nl: "Kraag uitstrijkje", en: "Collar smear"}, type: 'collarSmear', filter: {searchString: '(gender=="female" & (age>25y & age<65y) & active == true) - SVC[ICPC == X75 - :CD-CERTAINTY == excluded] - HE[ICPC == X75 - :CD-CERTAINTY == excluded] - SVC[BE-THESAURUS-PROCEDURES == X52.002 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-PROCEDURES == X52.003 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-PROCEDURES == X52.004 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-PROCEDURES == X52.005 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-PROCEDURES == X52.006 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-PROCEDURES == X59.002 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-PROCEDURES == X59.003 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-PROCEDURES == X59.004 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-PROCEDURES == X59.005 & (:CD-LIFECYCLE == completed)] - SVC[BE-THESAURUS-SURGICAL-PROCEDURES == 369] - SVC[BE-THESAURUS-SURGICAL-PROCEDURES == 367] - SVC[BE-THESAURUS-SURGICAL-PROCEDURES == 368] - SVC[BE-THESAURUS-SURGICAL-PROCEDURES == 525] - SVC[BE-THESAURUS-SURGICAL-PROCEDURES == 522] - SVC[BE-THESAURUS-PROCEDURES == X37.003{<3y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed) | :CD-LIFECYCLE == refused] - SVC[BE-THESAURUS-PROCEDURES == X37.002{<3y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)]'}},
                  {name :{fr: "Vaccination grippe", nl: "", en:"Vaccine again influenza"}, type: 'influenza', filter: {searchString: '((age>65y & active == true) | SVC[ICPC == W78 - :CD-CERTAINTY == excluded] | HE[ICPC == W78 - :CD-CERTAINTY == excluded] | SVC[ICPC == W79 - :CD-CERTAINTY == excluded] | HE[ICPC == W79 - :CD-CERTAINTY == excluded] | SVC[ICPC == W29 - :CD-CERTAINTY == excluded] | HE[ICPC == W29 - :CD-CERTAINTY == excluded] | SVC[ICPC == W84 - :CD-CERTAINTY == excluded] | HE[ICPC == W84 - :CD-CERTAINTY == excluded] | SVC[ICPC == T90 - :CD-CERTAINTY == excluded] | HE[ICPC == T90 - :CD-CERTAINTY == excluded] | SVC[ICPC == T89 - :CD-CERTAINTY == excluded] | HE[ICPC == T89 - :CD-CERTAINTY == excluded]| SVC[ICPC == R95 - :CD-CERTAINTY == excluded]) | HE[ICPC == R95 - :CD-CERTAINTY == excluded] - SVC[BE-THESAURUS-PROCEDURES == R44.003{<1y} & (:CD-LIFECYCLE == completed | :CD-LIFECYCLE == aborted | :CD-LIFECYCLE == cancelled | :CD-LIFECYCLE == proposed | :CD-LIFECYCLE == refused)]'}}
                  //{name: {fr: "Patients avec sumehr", nl: "Patiënten met sumehr", en: "Patients with sumehr"}, type: 'withSumEHR', filter: {searchString: 'active == true & SVC[:CD-TRANSACTION == "sumehr"]'}},
                  //{name: {fr: "Patients sans sumehr", nl: "Patiënten zonder sumehr", en: "Patients without sumehr"}, type: 'withoutSumEHR', filter: {searchString: 'active == true - SVC[:CD-TRANSACTION == "sumehr"]'}},
                  //{name: {fr: "Patients avec DMG et avec sumehr", nl: "Patiënten met DMG en met sumehr", en: "Patients with DMG and with sumehr"}, type: 'withDMGwithSumEHR', filter: {searchString: 'active == true & SVC[:CD-TRANSACTION-MYCARENET == gmd] & SVC[:CD-TRANSACTION == sumehr]'}},
                  //{name: {fr: "Patients avec DMG et sans sumehr", nl: "Patiënten met DMG en zonder sumehr", en: "Patients with DMG and without sumehr"}, type: 'withDMGwithoutSumEHR', filter: {searchString: 'active == true & SVC[:CD-TRANSACTION-MYCARENET == gmd] - SVC[:CD-TRANSACTION == sumehr]'}}
              ]
          },
          showExportContainer: {
              type: Boolean,
              value: false
          },
          showShareContainer: {
              type: Boolean,
              value: false
          },
          isAllPatientCheck:{
              type: Boolean,
              value: false
          }

      }
  }

  static get observers() {
      return [
          '_hcpChanged(hcp)','_selectedFilterIndexesChanged(selectedFilterIndexes.splices)', '_filterValueChanged(filterValue)', '_showInactivePatientsChanged(showInactive)', '_hcpFilterChanged(hcpFilterValue, _allHcpsChecked)',
          '_canAddPat(lastName,firstName,dateAsString,ssin,listResultPatients)', '_resetSearchField(selectedPatient)', '_createMhContractChanged(createMhContract)'
      ]
  }

  constructor() {
      super()
  }

  _showInactivePatientsChanged() {
      const grid = this.$['patients-list']
      grid.innerCache = []
      grid.clearCache()
  }

  _any(a,b,c) {
      return a || b
  }

  ready() {
      super.ready()

      this.api && this.api.isElectronAvailable().then(electron => this.set('onElectron',electron))

      var grid = this.$['patients-list']

      grid.lastParams = null //Used to prevent double calls
      grid.lastParamsWithIdx = null //Used to prevent double calls
      grid.size = 0
      grid.pageSize = 50
      grid.innerCache = []

      grid.dataProvider = (params, callback) => {
          const sort = params.sortOrders && params.sortOrders[0] && params.sortOrders[0].path || 'lastName'
          const desc = params.sortOrders && params.sortOrders[0] && params.sortOrders[0].direction === 'desc' || false

          const pageSize = params.pageSize || grid.pageSize
          const startIndex = (params.page || 0) * pageSize
          const endIndex = ((params.page || 0) + 1) * pageSize

          const thisParams = this.filterValue + "|" + sort + "|" + (desc ? "<|" : ">|") + pageSize + ":" + JSON.stringify(this.selectedFilters || [])
          const thisParamsWithIdx = thisParams + ":" + startIndex

          //100ms cooldown period

          let latestSearchValue = this.filterValue
          this.latestSearchValue = latestSearchValue

          if ((!latestSearchValue || latestSearchValue.length < 2) && !(this.selectedFilters && this.selectedFilters.length)) {
              // console.log("Cancelling empty search")
              this.btnSelectionPatient = false
              this.shareOption = false
              this.exportOption = false
              this.fusionOption = false
              this.preventionOption = false
              grid.set("size", 0)
              callback([])
              return
          }

          let svcFilter = null
          this.api && this.api.hcparty() && this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(currentHcp => {
              if (this.selectedFilters && this.selectedFilters.length) {
                  svcFilter = parse(`PAT[${this._selectedFiltersAsString()}]`, {hcpId: currentHcp.parentId || this.user.healthcarePartyId})
              } else {
                  try {
                      svcFilter = parse(`PAT[${latestSearchValue}]`, {hcpId: currentHcp.parentId || this.user.healthcarePartyId})
                  } catch (ignored) {}
              }

              let filter = svcFilter ? null : {
                  '$type': 'IntersectionFilter',
                  'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                  'filters': _.compact(latestSearchValue.split(/[ ,;:]+/).filter(w => w.length >= 2).map( word => /^[0-9]{11}$/.test(word) ? {
                      '$type': 'PatientByHcPartyAndSsinFilter',
                      'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                      'ssin': word
                  } : /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? {
                      '$type': 'PatientByHcPartyDateOfBirthFilter',
                      'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                      'dateOfBirth': word.replace(/([0-3]?[0-9])[\/-](1[0-2]|0?[0-9])[\/-]((?:[1-2][89012])?[0-9][0-9])/g, (correspondance, p1, p2, p3) => (p3.length === 4 ? p3 : (p3 > 20) ? "19" + p3 : "20" + p3) + (p2.length === 2 ? p2 : "0" + p2) + (p1.length === 2 ? p1 : "0" + p1))
                  } : /^[0-9]{3}[0-9]+$/.test(word) ? {
                      '$type': 'UnionFilter',
                      'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                      'filters': [
                          {
                              '$type': 'PatientByHcPartyDateOfBirthBetweenFilter',
                              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                              'minDateOfBirth': word.length >= 8  ? Number(word.substr(0,8)) : word.length >= 6 ? Number(word.substr(0,6) + '00') : Number(word.substr(0,4) + '0000'),
                              'maxDateOfBirth': word.length >= 8  ? Number(word.substr(0,8)) : word.length >= 6 ? Number(word.substr(0,6) + '99') : Number(word.substr(0,4) + '9999')
                          },
                          {
                              '$type': 'PatientByHcPartyAndSsinFilter',
                              'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                              'ssin': word
                          },
                          {
                              '$type': 'PatientByHcPartyAndExternalIdFilter', 'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                              'externalId': word
                          }
                      ]
                  } : word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').length >= 2 ? {
                      '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
                      'healthcarePartyId': currentHcp.parentId || this.user.healthcarePartyId,
                      'searchString': word
                  } : null))
              }

              const predicates = svcFilter ? [] : latestSearchValue.split(/[ ,;:]+/).filter(w => w.length >= 2).map( word =>
                  /^[0-9]{11}$/.test(word) ? (() => true) :
                      /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? (() => true) :
                          /^[0-9]{3}[0-9]+$/.test(word) ? ((p) => (p.dateOfBirth && (`${p.dateOfBirth}`.includes(word))) || (p.externalId && p.externalId.includes(word))) :
                              (p => {
                                  const w = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'')
                                  return w.length<2 ? true : (p.firstName && p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').includes(w)) ||
                                      (p.lastName && p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').includes(w))
                              })
              )


              if (grid.lastParamsWithIdx !== thisParamsWithIdx) {
                  grid.lastParamsWithIdx = thisParamsWithIdx
                  // console.log("Starting search for " + thisParamsWithIdx)

                  this.set('hideSpinner', false)
                  this.set('isLoadingPatient', true)

                  if (thisParams !== grid.lastParams) {
                      grid.lastParams = thisParams
                      grid.innerCache = []
                  }

                  grid.lastParamsWithIdxProm = (svcFilter ? icrFilter(svcFilter, {
                      cryptoicc: this.api.crypto(), usericc: this.api.user(), patienticc: this.api.patient(), contacticc: this.api.contact(), helementicc: this.api.helement(), invoiceicc: this.api.invoice(), hcpartyicc: this.api.hcparty()
                  }, currentHcp.parentId || this.user.healthcarePartyId, false).then(pl => pl.rows) :
                          this.api.getRowsUsingPagination((key, docId, pageSize) =>
                              this.api.patient().filterByWithUser(this.user, key, docId, pageSize || 50, 0, sort, desc, {
                                  filter: _.assign({}, filter, {filters: filter.filters})
                              })
                                  .then(pl => {
                                      const filteredRows = pl.rows.filter(p => predicates.every(f => f(p)))
                                      this.set('searchHint', filteredRows.length > 20 ? this.localize('add_criteria', 'Add search criteria (year, part of file id, part of firstname, separated by spaces to improve the precision of your search') : '')
                                      return {
                                          rows: filteredRows,
                                          nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                                          nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                                          done: !pl.nextKeyPair
                                      }
                                  })
                                  .catch(() => {
                                      return Promise.resolve()
                                  }), p => this.showInactive || p.active, startIndex, endIndex, grid.innerCache || ((grid.innerCache = [])))
                  )

                  grid.lastParamsWithIdxProm.then(res => {
                      if (grid.lastParams !== thisParams) {
                          console.log("Cancelling obsolete search")
                          return
                      }
                      if (res.length > 0 || startIndex > 0) {
                          this.btnSelectionPatient = true
                      }
                      callback(res.map(this.pimpPatient.bind(this)), res.length >= endIndex - startIndex ? res.length + startIndex + pageSize : res.length + startIndex)
                  }).finally(() => {
                      this.set('hideSpinner', true)
                      this.set('isLoadingPatient', false)
                  })
              } else {
                  grid.lastParamsWithIdxProm.then(res => {
                      if (grid.lastParams !== thisParams) {
                          console.log("Cancelling obsolete search")
                          return
                      }
                      if (res.length > 0 || startIndex > 0) {
                          this.btnSelectionPatient = true
                      }
                      callback(res.map(this.pimpPatient.bind(this)), res.length >= endIndex - startIndex ? res.length + startIndex + pageSize : res.length + startIndex)
                  })
              }
          })

      }


      // reset to tab one
      this.tabs = 0

      this.api && this.api.hcparty() && this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(myHcp => {
          if ( !!(myHcp && myHcp.parentId && this.api && this.api.hcparty()) || _.trim(_.get(myHcp,"type","")).toLowerCase() === "medicalhouse" ) {
              this.api.hcparty().getHealthcareParty(_.get(myHcp,"parentId", _.trim(myHcp.id) )).then(parentHcp => {
                  const parent = _.trim(_.get(myHcp,"type","")).toLowerCase() === "medicalhouse" ? myHcp : parentHcp;
                  this.mhListItem = parent ? [{
                      id: parent.id,
                      name: _.upperFirst(_.lowerCase(parent.name)),
                      hrLabel:
                          _.upperFirst(_.lowerCase(parent.name)) + ' ' +
                          (typeof parent.nihii === 'undefined' || !parent.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + parent.nihii) + ' ' +
                          ''
                  }] : []
                  this.set('medicalHouseContract.hcpId', parent.id)

                  // Pre-check vs NIHII number, last 3 digits (MKI) === 1 (Respectively for "médecin", "kiné", "infirmière"
                  this.set('medicalHouseContract.gp', !!(parent && _.trim(_.get(parent,"nihii","")).slice(-3, -2) === '1') );
                  this.set('medicalHouseContract.kine', !!(parent && _.trim(_.get(parent,"nihii","")).slice(-2, -1) === '1') );
                  this.set('medicalHouseContract.nurse', !!(parent && _.trim(_.get(parent,"nihii","")).slice(-1) === '1') );

              })
          } else {
              this.mhListItem = []
          }
      })
  }

  displayAllHcps(checked) {
      this._allHcpsChecked = checked.detail.value
  }

  displayAllPatients() {
      this.filterValue = "  "
  }

  _hcpFilterChanged(e) {
      let latestSearchValue = this.hcpFilterValue
      this.latestSearchValue = latestSearchValue

      if (!latestSearchValue || latestSearchValue.length < 2) {
          // console.log("Cancelling empty search")
          const hcps = (_.values(this.api.hcParties || {}) || []).filter(hcp => hcp.publicKey && (!hcp.parentId || this._allHcpsChecked) && ((hcp.lastName || '').length || (hcp.name || '').length))
          this.set('hcp', _.orderBy(hcps, ['lastName'], ['asc']))
          return
      }
      this._hcpDataProvider() && this._hcpDataProvider().filter(latestSearchValue).then(res => {
          if (latestSearchValue !== this.latestSearchValue) {
              console.log("Cancelling obsolete search")
              return
          }
          this.set('hcp', res.rows)
      })
  }

  _hcpDataProvider() {
      return {
          filter: (hcpFilterValue) => {
              const desc = 'desc'
              let count = 15
              return Promise.all([this.api.hcparty().findByName(hcpFilterValue, null, null, count, desc)]).then(results => {
                  const hcpList = results[0]
                  const filtered = _.flatten(hcpList.rows.filter(hcp => hcp.publicKey && ((hcp.lastName || '').length || (hcp.name || '').length)).map(hcp => ({
                      id: hcp.id,
                      lastName: hcp.lastName,
                      firstName: hcp.firstName,
                      speciality: hcp.speciality,
                      email: hcp.email
                  })))
                  return {totalSize: filtered.length, rows: filtered}
              })

          }
      }
  }

  toggleMobileMenu() {
      this.set('mobileMenuHidden', !this.mobileMenuHidden)
      this.set('isShown', !this.mobileMenuHidden ? "shown-menu" : "")
  }


  formatDateOfBirth(dateOfBirth) {
      return dateOfBirth ? ("" + dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : 'N/A'
  }

  refresh() {
      const previousValue = this.filterValue
      setTimeout(() => {
          if (previousValue === this.filterValue) {
              console.log("Triggering search for " + this.filterValue)
              const grid = this.$['patients-list']
              grid.innerCache = []
              grid.clearCache()
          } else {
              console.log("Skipping search for new value " + this.filterValue + " != " + previousValue)
          }
      }, 500) //Wait for the user to stop typing
  }

  _getPostalAddress(address) {
      return _.compact([
          _.trim(_.get(address,"street","")),
          _.trim(_.get(address,"houseNumber","")) + (!!_.trim(_.get(address,"postboxNumber","")) ? "/" + _.trim(_.get(address,"postboxNumber","")) : ""),
          ( !!_.trim(_.get(address,"postalCode","")) || !!_.trim(_.get(address,"city",""))) ? "-" : "",
          _.trim(_.get(address,"postalCode","")),
          _.trim(_.get(address,"city",""))
      ]).join(" ")
  }

  pimpPatient(p) {
      p.email = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'email').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
      p.phone = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'phone').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
      p.mobile = p.addresses && p.addresses.map(a => a.telecoms && a.telecoms.filter(t => t.telecomType === 'mobile').map(t => t.telecomNumber).join()).filter(a => a).join() || ''
      const address = _.find(_.get(p,"addresses",[]), {addressType:"home"}) || _.find(_.get(p,"addresses",[]), {addressType:"work"}) || _.get(p,"addresses[0]",[])
      p.postalAddress = _.compact([
          _.trim(_.get(address,"street","")),
          _.trim(_.get(address,"houseNumber","")) + (!!_.trim(_.get(address,"postboxNumber","")) ? "/" + _.trim(_.get(address,"postboxNumber","")) : ""),
          ( !!_.trim(_.get(address,"postalCode","")) || !!_.trim(_.get(address,"city",""))) ? "-" : "",
          _.trim(_.get(address,"postalCode","")),
          _.trim(_.get(address,"city",""))
      ]).join(" ");
      return p
  }

  clickOnRow(e) {
      if (this.shareOption || this.exportOption || this.fusionOption || this.preventionOption) return

      // Must click on a row
      if ((e.path || e.composedPath())[0].nodeName === 'TABLE') return
      if(this.activeItem) {
          this.set('isLoadingPatient', true)
          const selected = this.activeItem
          console.log('selected ', selected, ' - ' + this.latestSelected)
          this.api.patient().getPatientWithUser(this.user, selected.id).then(p => this.api.register(p, 'patient')).then(p => {
              this.set('selectedPatient', p)
              this.set('isLoadingPatient', false)
          })
      }
  }

  _addPatient() {
      this.resetNewPatientDialog()
      this.checkForParentMedicalHouse()

      this.$['add-patient-dialog'].open()
  }

  _addPatientNoOpen() {
      this.set('openAddedPatient', false)
      this._addPatient()
  }

  _addPatientDialogOpenedChanged(e) {
      if(e.detail.value === false) {
          // reset to default state when closed
          this.set('openAddedPatient', true)
      }
  }

  _readEid() {
      fetch(`${_.get(this,"api.electronHost","http://127.0.0.1:16042")}/read`)
          .then((response) => {
              return response.json()
          })
          .then(res => {
              if (res.cards[0]) {
                  this.set('firstName', res.cards[0].firstName)
                  this.set('lastName', res.cards[0].surname)
                  this.set('dateAsString', this.api.moment(res.cards[0].dateOfBirth * 1000).format('DD/MM/YYYY'))
                  this.set('ssin', res.cards[0].nationalNumber)
                  this.set('valueGender', res.cards[0].gender === 'M' ? 'male' : 'female')
                  this.set('newPatCardData',res.cards[0])
              }
          })
  }

  _exportFilteredPatientListToCsv() { // not used currently, export is done in Xls
      // Data mapping
      var dataColumns = [
          "lastName",
          "firstName",
          "gender",
          "dateOfBirth",
          "ssin",
          "email",
          "phone",
          "mobile"
      ]

      // Human readable columns
      var hrColumns = [
          this.localize('lastname', 'Last name'),
          this.localize('firstname', 'First name'),
          this.localize('gender', 'Gender'),
          this.localize('birthdate', 'Birthdate'),
          this.localize('ssin', 'SSIN'),
          this.localize('email_address', 'Email address'),
          this.localize('phone_number', 'Phone number'),
          this.localize('mobile_number', 'Mobile number')
      ]

      // Define csv content, header = column names
      var csvFileContent = hrColumns.join(";") + "\n\n"

      // Get grid / we're going to read data from it
      var grid = this.$['patients-list']

      // Loop grid with a max of X results (csv)
      grid.dataProvider({pageSize: 10000}, function (items) {

          // Rewrite date for HR, input = yyyymmdd, output = dd/mm/yyyy
          items.forEach(item => item.dateOfBirth = item.dateOfBirth ? ("" + item.dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : this.localize('na_short', 'N/A'))

          // Populate / collect
          items.forEach(item => csvFileContent += dataColumns.map(col => item[col]).join(";") + '\n')

          var fileBlob = new Blob([csvFileContent], {type: "text/csv"})
          var downloadLink = document.createElement("a")
          document.body.appendChild(downloadLink)
          downloadLink.style = "display: none"

          var urlObject = window.URL.createObjectURL(fileBlob)

          downloadLink.href = urlObject
          downloadLink.download = "patients-list.csv"
          downloadLink.click()
          window.URL.revokeObjectURL(urlObject)
      })

  }

  _exportFilteredPatientListToXls() {
      this._exportXlsFromPatientDataProviderFunction(fun => {
          var grid = this.$['patients-list']
          grid.dataProvider({pageSize: 10000}, fun)
      })
  }

  _capitalize(value) {
      return value && value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value;
  }

  _exportXlsFromPatientDataProviderFunction(dataProviderFun) {

      // Data mapping
      var dataColumns = [
          "externalId",
          "lastName",
          "firstName",
          "dateOfBirth",
          "phone",
          "fax",
          "postalAddress",
          "email",
          "ssin",
          "genderText",
          "active",
      ]

      // Human readable columns
      var hrColumns = [
          this.localize('ext_id_short', 'Dossier', this.language),
          this.localize('las_nam', 'Last name', this.language),
          this.localize('fir_nam', 'First name', this.language),
          this.localize('birthDate', 'Birthdate', this.language),
          this.localize('phone', 'Phone number', this.language),
          this._capitalize(this.localize('fax', 'Fax number', this.language)),
          this.localize('postalAddress', 'Address', this.language),
          this.localize('email', 'Email address', this.language),
          this.localize('ssin', 'SSIN', this.language),
          this.localize('gender', 'Gender', this.language),
          this.localize('stat_act', 'active', this.language),
      ]

      // Define csv content, header = column names
      var csvFileContent = hrColumns.join(";") + "\n\n"

      // Get grid / we're going to read data from it
      var grid = this.$['patients-list']

      // Loop grid with a max of X results (csv)
      dataProviderFun(items => {

          // Rewrite date for HR, input = yyyymmdd, output = dd/mm/yyyy
          items.forEach(item => {
              item.dateOfBirth = item.dateOfBirth ? ("" + item.dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : this.localize('na_short', 'N/A')
              item.phone = this._getPhone(item)
              item.fax = this._getFax(item)
              item.genderText = this.localize(item.gender, 'no translation', this.language)
          })

          // Populate / collect
          //items = items.map(item => _.pick(item, dataColumns))
          items = items.map(item => {
              let newitem = {}
              dataColumns.forEach((key, idx) => {
                  newitem[hrColumns[idx]] = item[key]
              })
              return newitem
          })

          this.generateXlsFile(items)

      })

  }

  getAllPatients() {

      return this.api.getRowsUsingPagination(
          (key, docId) => this.api.patient().listPatientsByHcPartyWithUser(this.user, this.user.healthcarePartyId, null, (key && JSON.stringify(key) || null), docId || null, 1000, null).then(pl => ({
              rows: pl.rows.map(
                  p => (
                      this.pimpPatient(p)
                      /*
                      p.languages = p.languages.join(' / '),
                          p.dateOfBirth = (p.dateOfBirth ? ("" + p.dateOfBirth).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$3/$2/$1') : this.localize('na_short', 'N/A')),
                          _.assign(
                              _.pick(p, ['externalId'], ['lastName'], ['firstName'], ['dateOfBirth'], ['gender'], ['languages'], ['ssin'], ['active']),
                              _.fromPairs(
                                  _.flatMap(
                                      p.addresses,
                                      a => [
                                          [a.addressType + '_street', a.street],
                                          [a.addressType + '_number', a.houseNumber],
                                          [a.addressType + '_zip', a.postalCode],
                                          [a.addressType + '_city', a.city]
                                      ]
                                          .concat(
                                              _.map(
                                                  a.telecoms,
                                                  t => [
                                                      a.addressType + '_' + t.telecomType, t.telecomNumber
                                                  ]
                                              )
                                          )
                                  )
                              )
                          )

                       */
                  )
              ),
              nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
              nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
              done: !pl.nextKeyPair
          }))
      )
  }

  _exportAllPatientListToXls() {
      this.set("isLoadingPatient",true)
      this.getAllPatients().then(
          pl => {
              this._exportXlsFromPatientDataProviderFunction(fun => {
                  fun(pl)
              })
          }
      ).finally( () => this.set('isLoadingPatient',false))
  }

  _openImportPatientFromMfDialog() {
      this.$['import-mf-dialog'].open()
  }

  generateXlsFile(data, filename, title, author) {

      // Create xls work book and assign properties
      filename = filename || ("patient-list_" + moment().format("YYYYMMDD-HHmmss") + ".xls")
      title = title || "Patients list"
      author = author || "iCure"
      const xlsWorkBook = {SheetNames: [], Sheets: {}}
      xlsWorkBook.Props = {Title: title, Author: author}

      // Create sheet based on json data collection
      var xlsWorkSheet = XLSX.utils.json_to_sheet(data)

      // Link sheet to workbook
      XLSX.utils.book_append_sheet(xlsWorkBook, xlsWorkSheet, title)

      // Virtual data output
      var xlsWorkBookOutput = new Buffer(XLSX.write(xlsWorkBook, {bookType: 'xls', type: 'buffer'}))

      // Put output to virtual "file"
      var fileBlob = new Blob([xlsWorkBookOutput], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})

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

  confirmAddPatient() {
      if ((!this.ssin || (this.api.patient().isValidSsin(this.ssin) && (!this.listResultPatients.length || !this.listResultPatients.find(pat => pat.ssin===this.ssin)))) && this.lastName.length && this.firstName.length && this.dateAsString.length) { // name and birthdate are needed
          this.set('isLoadingPatient',true)
          // Trigger update
          let newPatient = {
              lastName: this.lastName,
              firstName: this.firstName,
              active: true,
              dateOfBirth: this.dateAsString && this.dateAsString.length && parseInt(_.padEnd(this.dateAsString.split("/").reverse().map(str => _.padStart(str,2,"0")).join(""),8,"0")) || null,
              ssin: this.ssin,
              gender: this.valueGender,
              medicalHouseContracts: [this.medicalHouseContractShadowObject]
          }
          if (Object.keys(this.newPatCardData).length !== 0 && this.ssin === this.newPatCardData.nationalNumber) {
              let streetData = _.trim(this.newPatCardData.street).split(" ")
              const number = streetData.find(str => str.match(/\d/g))
              const boxNumber = streetData[streetData.length - 1] !== number ? streetData[streetData.length - 1] : ""
              const street = streetData.reduce((tot, str) => {
                  if (!tot) tot = "";
                  if (!(str === number || str === boxNumber))
                      tot = tot.concat(" ", str)
                  return tot;
              })
              _.merge(newPatient, {
                  placeOfBirth: this.newPatCardData.locationOfBirth,
                  nationality: this.newPatCardData.nationality,
                  picture: this.newPatCardData.picture,
                  addresses: [
                      {
                          addressType: "home",
                          street: street,
                          houseNumber: number,
                          postboxNumber: boxNumber,
                          postalCode: this.newPatCardData.zipCode,
                          city: this.newPatCardData.municipality,
                          country: this.newPatCardData.country
                      }
                  ]
              })
          }
          if(this.createMhContract) {
              this.updateStartOfCoverage()
              newPatient.medicalHouseContracts[0] = this.medicalHouseContractShadowObject;
          }else{
              newPatient.medicalHouseContracts.pop();
          }
          return this.api.patient().newInstance(this.user, newPatient).then(
              p => this.api.patient().createPatientWithUser(this.user, p)
          ).then(
              p => this.api.register(p, 'patient')
          ).then(
              p => {
                  this.set("addedPatient", p)
                  this.resetNewPatientDialog()
                  return p
              }
          ).finally(x =>{
              this.set('isLoadingPatient',false)
          })
      }
  }

  confirmAddAndOpenPatient() {
      this.confirmAddPatient().then(p => {
          this.set('selectedPatient', p)
      })
  }

  confirmAddAndOpenPatientWithEid(){
      const filter = {
          filter: {'$type': 'PatientByHcPartyAndSsinFilter',
              'healthcarePartyId': this.user.healthcarePartyId,
              'ssin': this.ssin}}
      this.api.patient().filterByWithUser(this.user, null, null, 50, 0, 1, 'desc', filter ).then(response => {
          if (!response || !response["totalSize"].length || !response["rows"].find(pat => pat.ssin === this.ssin))
              this.confirmAddAndOpenPatient()
      })
  }

  _canAddPat() {
      this.set('canAddPat', ((!this.ssin || (this.api.patient().isValidSsin(this.ssin) && (!this.listResultPatients.length || !this.listResultPatients.find(pat => pat.ssin===this.ssin)))) &&
          this.lastName && this.firstName && this.dateAsString && this.lastName.length && this.firstName.length && this.dateAsString.length) ? true : false)
  }

  _resetSearchField() {
      this.set('filterValue', "")
  }

  resetNewPatientDialog() {
      this.lastName = null
      this.firstName = null
      this.dateAsString = null
      this.ssin = null
      this.valueGender = null
      this.cardData=[];
      if(this.medicalHouseContract) {
          this.medicalHouseContractShadowObject = {
              hcpId: this.medicalHouseContract.hcpId,
              mmNihii: this.medicalHouseContract.mmNihii,
              startOfContract: this.medicalHouseContract.startOfContract,
              startOfCoverage: this.medicalHouseContract.startOfCoverage,
              kine: this.medicalHouseContract.kine,
              gp: this.medicalHouseContract.gp,
              nurse: this.medicalHouseContract.nurse,
          }
      }
      this.selected=null
      this.selectedItem=null
      this.$["datePickerCreation"].accuracy="day"
      this.$["datePickerCreation"].value=""
      this.$['evalutationMonths'].value = 0
      this.$['startOfCoverage'].value = ""
      this.updateStartOfCoverage()
  }

  confirmFilter() {
      const filtersProperty = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.datafilters') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.datafilters'},
              typedValue: {type: 'STRING', stringValue: '{}'}
          })

      if (!filtersProperty.typedValue) {
          filtersProperty.typedValue = {type: 'STRING', stringValue: '{}'}
      }
      if (!filtersProperty.typedValue.stringValue) {
          filtersProperty.typedValue.type = 'STRING'
          filtersProperty.typedValue.stringValue = '{}'
      }

      const key = this.filterName.length ? this.filterName : this.filterValue.substring(0, 5) + '...'

      const filters = JSON.parse(filtersProperty.typedValue.stringValue)
      filters[key] = {searchString: this.filterValue}

      filtersProperty.typedValue.stringValue = JSON.stringify(filters)

      this.set('user.properties', this.user.properties.map(x => x))

      this.api.user().modifyUser(this.user).then(user => this.dispatchEvent(new CustomEvent('user-saved', {
          detail: user,
          bubbles: true,
          composed: true
      })))
  }

  picture(pat) {
      if (!pat) {
          return require('../../../images/male-placeholder.png')
      }
      return pat.picture ? 'data:image/jpeg;base64,' + pat.picture : pat.gender === 'female' ? require('../../../images/female-placeholder.png') : require('../../../images/male-placeholder.png')
  }

  _saveFilter(e) {
      this.$['saveFilterDialog'].open()
  }

  deleteFilter(e) {
      e.stopPropagation()

      const filtersProperty = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.datafilters') ||
          (this.user.properties[this.user.properties.length] = {
              type: {identifier: 'org.taktik.icure.datafilters'},
              typedValue: {type: 'STRING', stringValue: '{}'}
          })

      const filters = JSON.parse(filtersProperty.typedValue.stringValue)
      delete(filters[e.target.id])

      filtersProperty.typedValue.stringValue = JSON.stringify(filters)

      this.set('user.properties', this.user.properties.map(x => x))

      this.api.user().modifyUser(this.user).then(user => this.dispatchEvent(new CustomEvent('user-saved', {
          detail: user,
          bubbles: true,
          composed: true
      })))
  }

  _activeFilters() {
      const filters =  _.get(this.user, 'properties', []).find(p => _.get(p, 'type.identifier', null) === 'org.taktik.icure.datafilters')

      const parsedFilters = _.get(filters, 'typedValue.stringValue', null) ? JSON.parse(filters.typedValue.stringValue) : {}
      return this.api && this.api.crypto() ? _.concat(_.get(this, 'primaryPreventionFilters', []).map(f => ({name: f.name, filter: f.filter, id: this.api.crypto().randomUuid(), type: f.type})), Object.keys(parsedFilters).map(k => ({name: {[this.language] : k}, filter: parsedFilters[k], id: this.api.crypto().randomUuid(), type: "custom"}))) || [] : []

  }

  _selectedFilterIndexesChanged() {
      const activeFilters = this._activeFilters()
      this.set('selectedFilters', this.selectedFilterIndexes.map(i => activeFilters[i]))
      if (this.selectedFilters.length) {
          this.set('filterValue', this._selectedFiltersAsString())
          const grid = this.$['patients-list']
          grid.innerCache = []
          grid.clearCache()
      }
  }

  _selectedFiltersAsString() {
      return this.selectedFilters.length>1 ? this.selectedFilters.map(f => `(${f.filter.searchString})`).join('&') : this.selectedFilters[0].filter.searchString
  }

  _filterValueChanged(filterValue, oldValue) {
      if (this.selectedFilters[0] && this._selectedFiltersAsString() !== filterValue) {
          this.set('selectedFilterIndexes', [])
      } else if (!this.selectedFilters.length && filterValue !== oldValue) {
          this.refresh()
      }
  }

  _sharePatient(e) {
      e.stopPropagation()
      this.set('hideSpinner', true)
      this.set('shareOption', true)
      this.set('exportOption', false)
      this.set('fusionOption', false)
      this.set('preventionOption', false)

  }

  _exportPatient(e) {
      e.stopPropagation()
      this.set('hideSpinner', true)
      this.set('exportOption', true)
      this.set('exportAsPMF', false)
      this.set('shareOption', false)
      this.set('fusionOption', false)
      this.set('preventionOption', false)
  }

  _exportPatientAsPMF(e) {
      e.stopPropagation()
      this.set('hideSpinner', true)
      this.set('exportOption', true)
      this.set('exportAsPMF', true)
      this.set('shareOption', false)
      this.set('fusionOption', false)
  }

  _fusionPatient(e) {
      e.stopPropagation()
      this.set('hideSpinner', true)
      this.set('fusionOption', true)
      this.set('shareOption', false)
      this.set('exportOption', false)
      this.set('preventionOption', false)
  }

  _preventionPatient(e){
      e.stopPropagation()
      this.set('hideSpinner', true)
      this.set('fusionOption', false)
      this.set('shareOption', false)
      this.set('exportOption', false)
      this.set('preventionOption', true)
  }

  _checkSharePatient(e) {
      const targetId = e.target.id

      if (targetId !== "") {
          const mark = this.patientSelected.find(m => m.id === targetId)
          if (!mark) {
              this.api.patient().getPatientWithUser(this.user, targetId).then(result => {
                  this.push('patientSelected', {id: targetId, check: true, names: result.firstName + " " + result.lastName, patient: result})
                  this.set('nbPatientSelected', this.patientSelected.filter(patient => patient.check).length)
              })
          } else {
              mark.check = !mark.check
              this.notifyPath('patientSelected.*')
              this.set('nbPatientSelected', this.patientSelected.filter(patient => patient.check).length)
          }
      }

  }

  _patientSelected(item) {

      if (item) {
          const mark = this.patientSelected.find(m => m.id === item.id)
          return mark && mark.check
      } else {
          return false
      }
  }

  _sharePatientAll() {
      this.set('isImportingPatients', true)
      let retry = 0
      this.api.getRowsUsingPagination(
          (key, docId) => this.api.patient().listPatientsIds(this.user.healthcarePartyId, key || null, docId || null, 1000).then(pl => {
              retry = 0
              return {
                  rows: pl.rows.map(id => ({id})),
                  nextKey: pl.nextKeyPair && JSON.stringify(pl.nextKeyPair.startKey),
                  nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                  done: !pl.nextKeyPair
              }
          }).catch((e) => {
              console.log(`retry: ${e.message}`)
              retry++
              return retry <= 3 ? Promise.resolve({
                  rows: [],
                  nextKey: key,
                  nextDocId: docId,
                  done: false
              }) : Promise.reject(e)
          })
      ).then(pats => {
          this.set('shareOption', true)
          this.selectedPatientsForSharing = pats
          this.$['sharePatientDialog'].open()
      }).finally(() => {
          this.set('isImportingPatients', false)
      })
  }

  _openPatientActionDialog() {
      if (this.shareOption) {
          this.$['sharePatientDialog'].open()
          this.set('hcp', _.orderBy(_.values(this.api.hcParties), ['lastName'], ['asc']))
          this.selectedPatientsForSharing = this.patientSelected.filter(pat => pat.check && pat.id)
      }
      if (this.exportOption) {
          //export here
          this.set('taskProgress', 0.001)
          let p = Promise.resolve([])
          const selectedPatientsForExport = this.patientSelected.filter(pat => pat.check && pat.id)
          selectedPatientsForExport.forEach((patient, pidx) => {
              p = p.then(acc =>
                  this.api.patient().getPatientWithUser(this.user, patient.id)
                      .then(patientDto => {
                          return this.api.crypto()
                              .extractDelegationsSFKs(patientDto, this.user.healthcarePartyId)
                              .then(secretForeignKeys => {
                                  console.log("exportAsPMF", this.exportAsPMF)
                                  return this.api.bekmehr().generateSmfExportWithEncryptionSupport(patientDto.id, this.user.healthcarePartyId, "fr", {
                                      exportAsPMF: this.exportAsPMF,
                                      secretForeignKeys: secretForeignKeys.extractedKeys,
                                      comment: null
                                  }, (progress) => this.set('taskProgress', (pidx + progress) / selectedPatientsForExport.length), this.api.sessionId).then(output => {
                                      //creation of the xml file
                                      var file = typeof output === "string" ? new Blob([output], {type: "application/xml"}) : output

                                      //creation the downloading link
                                      var a = document.createElement("a")
                                      document.body.appendChild(a)
                                      a.style = "display: none"

                                      //download the new file
                                      var url = window.URL.createObjectURL(file)
                                      a.href = url
                                      a.download = patient.names.replace(" ", "_") + "_" + (moment().format("x")) + ".xml"
                                      a.click()
                                      window.URL.revokeObjectURL(url)

                                      document.body.removeChild(a)

                                  }).catch(error => console.log(error))
                              })
                      }))
          })
          p.finally(() => this.set('taskProgress', 0))
      }
      if (this.fusionOption) {
          this.set("patientSelected", this.patientSelected.filter(element => element.check === true))
          if (this.patientSelected.length > 1)
              this.api.patient().getPatientsWithUser(this.user,new models.ListOfIdsDto({ids:_.uniq(this.patientSelected.map(pat => pat.id))}))
                  .then(pats => this.$['fusion-dialog'].open(pats))
      }

      if(this.preventionOption){
          this.set("selectedPatientForPrevention", this.patientSelected.filter(element => element.check === true))
          this.patientSelected.length > 1 ? this._addPrimaryPrevention() : null
      }
  }

  _deselectAllSelectedPatients() {
      this.set('patientSelected', [])
      this.notifyPath('patientSelected.*')

      this.set('nbPatientSelected', 0)
  }

  _cancelSelecting() {
      this._deselectAllSelectedPatients()
      this.set('shareOption', false)
      this.set('exportOption', false)
      this.set('fusionOption', false)
      this.set('preventionOption', false)
  }

  _toggleBoxes(e) {
      const checked = e.target.getAttribute('checked')!= null ? true : false
      console.log('checked ?',checked)
      let boxList = this.shadowRoot.querySelector('#hcp-list');
      let allCheckBoxes = boxList ? boxList.querySelectorAll('.checkbox') : [];
      allCheckBoxes.forEach(box=>{
          box.checked = !box.checked;
      })
      this.set('shareAll',checked)
  }

  _checkHcp(e) {
      if (e.target.id !== "") {
          const mark = this.hcpSelectedForSharing.find(m => m.id === e.target.id)
          if (!mark) {
              this.push('hcpSelectedForSharing', {
                  id: e.target.id,
                  check: true,
                  delegation: ["all"]
              })
          } else {
              mark.check = !mark.check
              this.notifyPath('hcpSelectedForSharing.*')
          }
      }

  }

  _statusDetail(status) {
      return status.success === null ? 'N/A' : status.success ? 'OK' : status.error && status.error.message || 'NOK'
  }

  _statusDetailClass(status) {
      return status.success === null ? '' : status.success ? 'status-green' : 'status-red'
  }

  _sharingHcp(item) {
      if (this.shareAll == true ) {
          return true
      } else if (item) {
          const mark = this.hcpSelectedForSharing.find(m => m.id === item.id)
          return mark && mark.check
      } else {
          return false
      }
  }

  confirmSharingAllNextStep() {
      this.confirmSharingNextStep(true)
  }

  confirmSharingNextStep(allHcp) {
      this.$['sharePatientDialog'].close()

      //erase uncheck user
      if (this.shareAll ||(allHcp === true)) {
          this.set('hcpSelectedForSharing',this.hcp)
      } else {
          const tab = _.differenceBy(this.hcpSelectedForSharing, [{'check': false}], 'check')
          this.set("hcpSelectedForSharing", tab)
      }

      //loading existing delegation of shared users
      this.hcpSelectedForSharing.forEach((userShared, index) => {
          let delegationTag = []
          const keys = Object.keys(this.user.autoDelegations)
          keys.forEach(key => {
              if (this.user.autoDelegations[key].find(x => x === userShared.id))
                  delegationTag.push(key)
          })
          if (delegationTag.length !== 0)
              this.set("hcpSelectedForSharing." + index + ".delegation", delegationTag)
      })

      this.$['sharePatientDelegationDialog'].open()
  }

  confirmSharing() {
      this.updateDelegation()

      this.$['sharePatientDelegationDialog'].close()
      this.$['sharingPatientStatus'].open()

      this._sharePatients(this.selectedPatientsForSharing)
  }

  _hashCode(str) {
      return str.split('').reduce((prevHash, currVal) =>
          (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0)
  }

  _sharePatients(patients) {
      this.set('patientShareStatuses', [])
      this.set('isSharingPatient',true)

      const hcpId = this.user.healthcarePartyId
      const delegates = this.hcpSelectedForSharing.filter(hcp => hcp.check && hcp.id)
      const delegationTags = _.fromPairs(delegates.map(hcp => [hcp.id, _.sortBy(hcp.delegation)]))
      const sig = this._hashCode(JSON.stringify(_.sortBy(delegationTags, x => x[0])))
      const locStoTag = `org.taktik.icure.${this.user.id}.share.${sig}.progress`

      const prevRunIds = JSON.parse(localStorage.getItem(locStoTag) || '[]')

      this.patientSharePromise = Promise.resolve([[], prevRunIds])

      _.chunk(patients.filter(p => !prevRunIds.includes(p.id)), 16).forEach(chunk => {
          this.patientSharePromise = this.patientSharePromise.then(([prevStatuses, treatedIds]) => Promise.all(chunk.map(pat =>
                  this.api.patient().share(this.user, pat.id, hcpId, delegates.map(hcp => hcp.id), delegationTags)
                      .catch(e => {
                          console.log(e)
                          return {
                              patient: pat, statuses: {
                                  contacts: {success: null, error: null},
                                  healthElements: {success: null, error: null},
                                  invoices: {success: null, error: null},
                                  documents: {success: null, error: null},
                                  patient: {success: false, error: e}
                              }
                          }
                      })
              )).then(statuses => {
                  const newStatuses = prevStatuses.concat(statuses)
                  const newTreatedIds = treatedIds.concat(statuses.filter(s => !_.values(s.statuses).some(s => !s.success)).map(s => s.patient.id))
                  localStorage.setItem(locStoTag, JSON.stringify(newTreatedIds))
                  this.push('patientShareStatuses', ...statuses)

                  this.dispatchEvent(new CustomEvent('idle', {bubbles: true, composed: true}))

                  return [newStatuses, newTreatedIds]
              })
          )
      });
      this.patientSharePromise.then(()=>this.set('isSharingPatient',false))
  }

  _openPopupMenu() {
      if (this.readOnly) {
          return
      }
      this.shadowRoot.querySelector('#paper-menu-button').open()
  }

  _selectedChanged(selected) {
      if (this.readOnly) {
          return
      }
      this.set('valueGender', this.selectedItem && this.selectedItem.id || null)
  }

  _searchDuplicate() {
      if (!this.user) return
      this.set("canAddPat",false)
      const fingerPrint = this.firstName + '|' + this.lastName + '|' + this.dateAsString + '|' + this.ssin
      //creation of filters
      const totalChars = (this.firstName && this.firstName.length || 0) + (this.lastName && this.lastName.length || 0)
      const firstNameFilter = this.firstName && this.firstName.length >= 2 && totalChars >= 4 && ({
          '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'searchString': this.firstName
      })
      const lastNameFilter = this.lastName && this.lastName.length >= 2 && totalChars >= 4 && ({
          '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'searchString': this.lastName
      })
      const dateOfBirthFilter = (/^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/.test(this.dateAsString)) && ({
          '$type': 'PatientByHcPartyDateOfBirthFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'dateOfBirth': this.dateAsString.replace(/-/g, "")
      })
      const ssinFilter = /^[0-9]{11}$/.test(this.ssin) && ({
          '$type': 'PatientByHcPartyAndSsinFilter',
          'healthcarePartyId': this.user.healthcarePartyId,
          'ssin': this.ssin
      })

      const intersectionFilters = [firstNameFilter, lastNameFilter, dateOfBirthFilter].filter(x => !!x)
      const unionFilters = [intersectionFilters.length > 1 ? ({
          '$type': 'IntersectionFilter',
          filters: intersectionFilters
      }) : intersectionFilters[0], ssinFilter].filter(x => !!x)

      const unionFilter = unionFilters.length > 1 ? ({
          '$type': 'UnionFilter',
          filters: unionFilters
      }) : unionFilters[0]

      clearTimeout(this.checkDuplicateTimeout)
      if (unionFilter) {
          this.checkDuplicateTimeout = setTimeout(() => {
              if (fingerPrint !== this.firstName + '|' + this.lastName + '|' + this.dateAsString + '|' + this.ssin) {
                  return
              }
              console.log(unionFilter)
              //research
              this.api.patient().filterByWithUser(this.user, null, null, 50, 0, 1, 'desc', {filter: unionFilter}).then(tb => {
                  console.log("result of the research : " + JSON.stringify(tb))

                  //construct of the table
                  if (_.get(tb, 'totalSize', 0) !== 0){
                      _.get(tb, 'rows', []).map(row => {
                          row.remarks = this.localize("rem_Ty5_CreatPat", "Ressemblance !", this.language)
                          let flagRem = false
                          if (_.toUpper(_.get(row, 'firstName', null)) === _.toUpper(_.get(this, 'firstName', "")) && _.toUpper(_.get(row, 'lastName', null)) === _.toUpper(_.get(this, "lastName", ""))) {
                              row.remarks = this.localize("rem_Ty1_CreatPat", "Même nom et prénom!", this.language)

                              if (_.get(row, "dateOfBirth", null).toString() === this.dateAsString.replace(/-/g, '')) {
                                  flagRem = true
                                  row.remarks = this.localize("rem_Ty4_CreatPat", "Même nom, prénom et date de naissance!", this.language)
                              }
                          }

                          if (row.ssin === _.get(this, 'ssin', "") && _.get(this, 'ssin', "") !== "") {
                              row.remarks = this.localize("rem_Ty2_CreatPat", "Même NISS!", this.language)
                              if (flagRem) {
                                  row.remarks = this.localize("rem_Ty3_CreatPat", "Même patient!", this.language)
                              }
                          }

                      })

                      this.set("listResultPatients", _.get(tb, "rows", []))
                      this.set("displayResult", true)
                  } else {
                      this.set("listResultPatients", [])
                      this.set("displayResult", false)
                  }
                  this._canAddPat()
              })
          }, 300)
      } else {
          this.set("listResultPatients", [])
          this.set("displayResult", false)
          this._canAddPat()
      }
  }

  getNamesWithHcpId(id) {
      const element = this.hcp.find(x => x.id === id)
      return element.lastName + " " + element.firstName
  }

  _checkDelegation(event) {

      const index = this.hcpSelectedForSharing.indexOf(event.model.__data.item)
      const tag = event.target.id.substr(event.model.__data.item.id.length)
      const value = event.detail.value

      //idem of checkingDelegation

      if (this.hcpSelectedForSharing[index].delegation.find(x => x === 'all')) {
          this.set("hcpSelectedForSharing." + index + ".delegation", this.delegation.map(x => x))
          this.hcpSelectedForSharing[index].delegation.shift()
      }
      if (value === true) {//check
          if (tag === "all") {
              this.set("hcpSelectedForSharing." + index + ".delegation", [])
          }
          this.push("hcpSelectedForSharing." + index + ".delegation", tag)

          if (this.hcpSelectedForSharing[index].delegation.filter(x => x.includes("cdItem")).length === 12) {
              this.push("hcpSelectedForSharing." + index + ".delegation", "medicalInformation")
          }

          if (this.hcpSelectedForSharing[index].delegation.find(x => x === "medicalInformation")) {
              this.set("hcpSelectedForSharing." + index + ".delegation", this.hcpSelectedForSharing[index].delegation.filter(x => !x.includes("cdItem")))
          }

          if (this.hcpSelectedForSharing[index].delegation.filter(element => !(element.includes("cdItem") || element === "all")).length === 6) {
              this.set("hcpSelectedForSharing." + index + ".delegation", ["all"])
          }
      }
      else {//uncheck
          if (tag === "all") {
              this.set("hcpSelectedForSharing." + index + ".delegation", this.delegation.filter((element, index, array) => (index <= 4 && element !== "all")))
          }
          else {
              this.set("hcpSelectedForSharing." + index + ".delegation",
                  this.hcpSelectedForSharing[index].delegation.filter(x => x !== tag))
          }
      }
  }

  checkingDelegation(tagInput, delegations) {
      if (!delegations) return
      return delegations.find(x => x === tagInput)
  }

  updateDelegation() {
      if (!this.user) return
      let userDelegation = this.user.autoDelegations

      this.hcpSelectedForSharing.forEach(userShared => {
              //delete old delegations for this user
              Object.keys(userDelegation).forEach(key => {
                  userDelegation[key] = userDelegation[key].filter(x => x !== userShared.id)
                  if (userDelegation[key].length === 0) delete userDelegation[key]
              })

              userShared.delegation.forEach(delegationTag => {
                  //add news delegations for this user
                  if (userDelegation.hasOwnProperty(delegationTag)) {
                      userDelegation[delegationTag].push(userShared.id)
                  }
                  else {
                      userDelegation[delegationTag] = [userShared.id]
                  }
              })
          }
      )
      this.set("user.autoDelegations", userDelegation)

      this.api.user().modifyUser(this.user).then(user => {
          this.dispatchEvent(new CustomEvent('user-saved', {
              detail: user,
              bubbles: true,
              composed: true
          }))
      }).catch(e => {
          console.log(e)
      }).finally(e => {
          this.api.user().getUser(this.user.id).then(x => {
              this.set("user", x)
          })
      })
  }

  _neededBr(tag) {
      return tag === "all"
  }

  _showAllDelegation(tag, id) {

      if (tag === "all") return true
      const index = this.hcpSelectedForSharing.findIndex(x => x.id === id)
      if (index === -1) return false

      let value = !this.hcpSelectedForSharing[index].delegation.find(x => x === "all")
      if (tag.includes("cdItem") && this.hcpSelectedForSharing[index].delegation.find(x => x === "medicalInformation"))
          value = false
      return value
  }

  _optionsChecked() {
      return this.shareOption || this.exportOption || this.fusionOption || this.preventionOption
  }

  _isPatientsSelected() {
      return this.patientSelected.filter(x => x.check == true).length
  }


  updateStartOfCoverage(event, object) {

      // Busy status
      this.updateStartOfCoverageBusy = this.updateStartOfCoverageBusy || false

      // Already busy ?
      if (this.updateStartOfCoverageBusy) return

      // Set to busy
      this.updateStartOfCoverageBusy = true

      // Grab final object
      let startOfContractObject = this.$['startOfContract']
      let startOfCoverageObject = this.$['startOfCoverage']
      let evalutationMonthsObject = this.$['evalutationMonths']

      // No value defined yet (first call), set to today
      if (!startOfCoverageObject.value || startOfCoverageObject.value === "") {
          startOfContractObject.value = moment().format('YYYY-MM-DD')
      }

      // By default, start of coverage date = 1st day of next month
      startOfCoverageObject.value = moment(startOfContractObject.value).add((1 + parseInt(evalutationMonthsObject.value || 0)), 'months').startOf('month').format('YYYY-MM-DD')

      // Cast values
      this.set('medicalHouseContractShadowObject.startOfContract', startOfContractObject.value.replace(/-/g, ''))
      this.set('medicalHouseContractShadowObject.startOfCoverage', startOfCoverageObject.value.replace(/-/g, ''))

      // We're finished
      this.updateStartOfCoverageBusy = false

  }

  //TODO: check for flatrate invoice type of MH HCP: "billingType": "flatRate"
  checkForParentMedicalHouse() {
      if (this.user && this.user.healthcarePartyId && this.api && this.api.hcparty() ) {
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
              if ( !!(hcp && hcp.parentId) || _.trim(_.get(hcp,"type","")).toLowerCase() === "medicalhouse" ) {
                  this.api.hcparty().getHealthcareParty(_.get(hcp,"parentId", _.trim(hcp.id) )).then(parentHcp => {
                      if ( (_.trim(_.get(parentHcp,"type","")).toLowerCase() === "medicalhouse"
                          || _.trim(_.get(hcp,"type","")).toLowerCase() === "medicalhouse")
                      && (_.trim(_.get(parentHcp,"billingType","")).toLowerCase() === "flatrate"
                              || _.trim(_.get(hcp,"billingType","")).toLowerCase() === "flatrate")) {
                          this.shadowRoot.getElementById("medicalHouseTabView").classList.remove("doNotDisplay")
                          this.shadowRoot.getElementById("createMedicalHouseContractCheckBox").classList.remove("doNotDisplay")
                          this.hcpParentMedicalHouseData = parentHcp
                          this.set("createMhContract", true);
                      } else {
                          this.shadowRoot.getElementById("medicalHouseTabView").classList.add("doNotDisplay")
                          this.shadowRoot.getElementById("createMedicalHouseContractCheckBox").classList.add("doNotDisplay")
                          this.set("createMhContract", false);
                      }
                  })
              } else {
                  this.shadowRoot.getElementById("medicalHouseTabView").classList.add("doNotDisplay")
                  this.shadowRoot.getElementById("createMedicalHouseContractCheckBox").classList.add("doNotDisplay")
                  this.set("createMhContract", false);
              }
          })
      } else {
          this.shadowRoot.getElementById("medicalHouseTabView").classList.add("doNotDisplay")
          this.shadowRoot.getElementById("createMedicalHouseContractCheckBox").classList.add("doNotDisplay")
          this.set("createMhContract", false);
      }
  }

  _createMhContractChanged(mhc){
      if(mhc){
          this.shadowRoot.getElementById("medicalHouseTabView").classList.remove("doNotDisplay")
      }else{
          this.shadowRoot.getElementById("medicalHouseTabView").classList.add("doNotDisplay")
      }

  }

  _mhSearch(e) {
      let mhLatestSearchValue = e && e.detail.value
      this.mhLatestSearchValue = mhLatestSearchValue

      if (!mhLatestSearchValue || mhLatestSearchValue.length < 2) {
          this.set('mhListItem', [])
          return
      }
      this._mhDataProvider() && this._mhDataProvider().filter(mhLatestSearchValue).then(res => {
          if (mhLatestSearchValue !== this.mhLatestSearchValue) return
          this.set('mhListItem', res.rows)
      })
  }


  _mhDataProvider() {
      return {
          filter: function (mhFilterValue) {
              return Promise.all(
                  [
                      this.api.hcparty().findBySsinOrNihii(mhFilterValue),
                      this.api.hcparty().findByName(mhFilterValue)
                  ]
              ).then(
                  results => {
                      const dataProviderResults =
                          _.flatten(
                              _
                                  .chain(_.concat(results[0].rows, results[1].rows))
                                  .uniqBy('id')
                                  .filter({type: 'medicalhouse'})
                                  .value()
                                  .map(
                                      i => ({
                                          id: i.id,
                                          name: _.upperFirst(_.lowerCase(i.name)),
                                          hrLabel:
                                              _.upperFirst(_.lowerCase(i.name)) + ' ' +
                                              (typeof i.nihii === 'undefined' || !i.nihii ? '' : ' - ' + this.localize('nihii', 'INAMI', language) + ': ' + i.nihii) + ' ' +
                                              ''
                                      })
                                  )
                          )

                      return {totalSize: dataProviderResults.length, rows: _.sortBy(dataProviderResults, 'name')}
                  }
              )

          }.bind(this)
      }
  }


  /**
   * Electron's part
   * */
  autoReadCardEid(cards){
      const res = JSON.parse(cards)
      if (res.cards[0]) {
          this.set('cardData',res.cards[0])
      }
  }

  openPatientOnElectron(e){
      e.stopPropagation()
      e.preventDefault();

      if (this.shareOption || this.exportOption || this.fusionOption) return

      // Must click on a row
      if ((e.path || e.composedPath())[0].nodeName === 'TABLE') return
      console.log(e.target.dataset.item)
      fetch(`${_.get(this,"api.electronHost","http://127.0.0.1:16042")}/getPatient`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },
          body: JSON.stringify({
              "patientId": e.target.dataset.item
          })
      })
          .then((response) => {
             return response.json()
          })
          .then(response => {if(response.code!==0){
              this.dispatchEvent(new CustomEvent("error-electron", {detail: {message : this.localize("pat-already-open","patient déjà ouvert",this.language)}, bubbles:true, composed:true }))
          }})
  }

  cleanNiss(niss){
      return niss.replace(/ /g, "").replace(/-/g,"").replace(/\./g,"").replace(/_/g,"").replace(/\//g,"")
  }

  _addPrimaryPrevention(){
      this.$['htPatPrimaryPreventionDialog'].openPreventionDialog()
  }

  _closePrevention(){
      this._cancelSelecting()
  }

  _patientMerged(e){
      if(e.detail.ok){
        this.api.patient().getPatientWithUser(this.user,e.detail.patientId).then(p => this.api.register(p, 'patient')).then(p => this.set('selectedPatient', p))
      }
 }

 _getPhone(item){
      return ((item.addresses.find(add => add.telecoms.find(tel=> tel.telecomType==="mobile" || tel.telecomType==="phone"))|| {telecoms:[]}).telecoms.find(tel=> tel.telecomType==="mobile" || tel.telecomType==="phone")||{telecomNumber:""}).telecomNumber
  }

  _getFax(item){
      return ((item.addresses.find(add => add.telecoms.find(tel=> tel.telecomType==="fax"))|| {telecoms:[]}).telecoms.find(tel=> tel.telecomType==="fax")||{telecomNumber:""}).telecomNumber
  }

  _localizePrevention(name){
      return _.get(name, this.language, null)
  }

  _toggleExportActions() {
      this.showExportContainer = !this.showExportContainer;
  }

  _actionIcon(showContainer) {
      return showContainer ? 'icons:close' : 'icons:more-vert';
  }

  _toggleShareActions() {
      this.showShareContainer = !this.showShareContainer;
  }

  _localizeFilterName(name){
      return _.get(name, this.language, null)
  }

  _isCustomFilter(filter){
      return _.get(filter, "type", null) === "custom"
  }

  _checkAllPatientChanged(e) {
      this.set("patientSelected", [])
      this.set("nbPatientSelected", 0)
      this.set("isAllPatientCheck", _.get(e, 'target.checked', null))

      if(_.get(e, 'target.checked', false)){
          _.uniqBy(_.values(_.get(this.$['patients-list']._cache, 'items', null)), "id").map(p => {
              this.push('patientSelected', {
                  id: p.id,
                  check: true,
                  patient: p,
                  names: p.firstName + " " + p.lastName
              })
          })
          this.set('nbPatientSelected', _.size(_.get(this, 'patientSelected', []).filter(patient => patient.check)))
      }
  }
}

customElements.define(HtPatList.is, HtPatList)
