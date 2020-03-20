/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import '../dynamic-form/ckmeans-grouping.js';

import '../ht-spinner/ht-spinner.js';
import '../../styles/dialog-style.js';
import '../../styles/dropdown-style.js';
import '../../styles/shared-styles.js';
import '../../styles/paper-input-style.js';
import '../../styles/buttons-style.js';
import '../../styles/paper-tabs-style.js';

import "@polymer/iron-icon/iron-icon"

import moment from 'moment/src/moment';
import _ from 'lodash/lodash';
import * as models from 'icc-api/dist/icc-api/model/models'
import { Base64 } from 'js-base64';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtMsgList extends TkLocalizerMixin(PolymerElement) {

    static get template() {
        return html`
            <custom-style>
                <style include="scrollbar-style dialog-style buttons-style dropdown-style paper-input-style paper-tabs-style shared-styles">
                    :host {
                        display: flex;
                        flex-direction: column;
                        z-index:0;
                    }
                    :host *:focus {
                        outline: 0 !important;
                    }
                    .boxes-list {
                        margin: 20px auto;
                        padding: 0;
                        min-width: 80%;
                    }
                    .col-right {
                        position: relative;
                        box-sizing: border-box;
                        grid-column: 2 / span 1;
                        grid-row: 1 / span 1;
                        /*background:var(--app-background-color);*/
                        float:left;
                        padding: 12px 20px;
                        padding-top: 0;
                        display:flex;
                        flex-flow: column nowrap;
                        align-items: flex-start;
                        height: calc(100% - 56px);
                        width: calc(100vw - 38%);
                        /*width: calc(100vw - 19%)*/
                    }
                    .card-title-container{
                        padding: 8px 0;
                        height: 34px;
                    }
                    .card-title{
                        margin: 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        -webkit-font-smoothing: antialiased;
                        font-family: 'Roboto',Helvetica,Arial,sans-serif;
                        font-size: 14px;
                        letter-spacing: .15px;
                        color: var(--app-text-color);
                        font-weight: 500;
                        letter-spacing: 0;
                        line-height: 16px;
                        -webkit-box-ordinal-group: 0;
                        -webkit-order: 0;
                        order: 0;
                    }
                    .card-title iron-icon{
                        width:16px;
                        width: 16px;
                        color: var(--app-text-color-disabled);
                    }
                    .has-unread {
                        font-weight: bold;
                    }
                    paper-item {
                        outline: 0;
                        cursor: pointer;
                        --paper-item: { margin: 0; };
                        font-size:.9em;
                        min-height:36px;
                        --paper-item-selected: { background: rgba(0, 0, 0, 0.1); color: var(--google-green-700); };
                        --paper-item-focused: { background: rgba(0, 0, 0, 0.1); color: var(--google-green-700); };
                        --paper-item-focused-before: { background: rgba(0, 0, 0, 0.1); }
                    }
                    paper-item:hover {
                        background: rgba(0, 0, 0, 0.1);
                        color:var(--dark-primary-color)
                    }
                    paper-listbox {
                        width:320px;
                        padding:5px;
                    }
                    paper-listbox:focus {
                        outline: 0;
                    }
                    .sublist {
                        padding-left: 20px;
                        outline: 0;
                    }
                    .sublist paper-item {
                        --paper-item-min-height: 28px;
                    }
                    vaadin-grid {
                        height: calc(100% - 16px - 32px - 50px);
                        width: 100%;
                        box-shadow: var(--app-shadow-elevation-1);
                        border: none;
                        box-sizing: border-box;
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
                        padding-right: 8px;
                    }
                    vaadin-grid.material .cell.last {
                        padding-right: 8px;
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
                        background: red;
                    }
                    paper-checkbox {
                        --paper-checkbox-unchecked-color: var(--app-text-color);
                        --paper-checkbox-label-color: var(--app-text-color);
                        --paper-checkbox-checked-color: var(--app-secondary-color);
                        --paper-checkbox-checked-ink-color: var(--app-secondary-color-dark);
                    }
                    .table-top {
                        width: calc(100vw - 38%);
                        /*width: calc(100vw - 19%);*/
                        min-height: 56px;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-end;
                        padding-top:5px;
                        position: relative;
                    }
                    .table-top > .checkbox {
                        width: 16px;
                        margin-left: 20px;
                        display: flex;
                        justify-content: space-around;
                        padding-left: 12px;
                        flex-direction: column;
                    }
                    .table-top > div {
                        display: flex;
                        flex-direction: row;
                        z-index: 1;
                        align-items: center;
                    }
                    .table-top > div > div {
                        text-align: center;
                    }
                    .table-top > div.indicators {
                        justify-content: flex-end;
                        padding-right: 20px;
                    }
                    .table-top > div.indicators > div {
                        display: flex;
                        flex-direction: column;
                        padding: 8px;
                        justify-content: center;
                    }
                    .table-top > div.indicators > div > * {
                        margin: 0 auto;
                    }
                    .table-top > div.indicators > div#stamp-indicator.hasNew span {color: var(--app-error-color);}
                    .table-top > div.indicators > div#capacity-indicator > * {
                        display: inline-block;
                    }
                    .table-top > div.actions {
                        flex-grow: 1;
                        margin: 0 16px;
                    }
                    .table-top paper-dropdown-menu#filterLabresult {
                        min-width: 256px;
                        margin-left: 22%;
                    }
                    .table-top > div.actions paper-icon-button {
                        margin: 0;
                        height: 28px;
                        width: 28px;
                        padding: 4px;
                        box-sizing: border-box;
                    }
                    .mb4 iron-icon{
                        opacity: 0.7;
                        margin-right: 4px;
                    }
                    .mb4 span{
                        font-size: 12px;
                        font-weight: 400;
                    }
                    paper-progress {
                        --paper-progress-active-color: var(--app-secondary-color);
                        width:130px;
                    }
                    paper-progress.full {
                        --paper-progress-active-color: var(--app-error-color);
                    }
                    .errorColor {
                        color: var(--app-error-color);
                    }
                    .errorColorDark {
                        color: var(--app-error-color-dark);
                    }
                    #vaadinMessagesGrid {
                        padding-right: 0;
                        margin-right: 0;
                        flex-grow: 1;
                        margin-bottom: 16px;
                        transition: opacity .25s ease;
                    }
                    #vaadinMessagesGrid iron-icon{
                        color: var(--app-text-color);
                        height: 18px;
                        width: 18px;
                        padding: 0px;
                    }
                    .labicon {
                        content: '';
                        display: inline-block;
                        height: 8px;
                        width: 8px;
                        margin: 0 auto;
                        border-radius: 50%;
                        background: var(--app-status-color-ok);
                        margin-right:5px;
                    }
                    .labicon.unassigned-true {
                        background: var(--app-status-color-nok);
                    }
                    .actions .labicon {
                        margin: 8px;
                    }
                    .get-msg-btn{
                        margin-bottom: 16px;
                        --paper-button: {
                            background: var(--app-secondary-color);
                            color: var(--app-text-color);
                            width: 100%;
                            margin: 0 auto;
                            font-size: 14px;
                            font-weight: bold;
                            text-transform: capitalize;
                        };
                        --paper-button-ink-color: var(--app-secondary-color-dark);
                    }
                    paper-icon-button.change-page {
                        cursor: pointer;
                        width: 24px;
                        height: 24px;
                        min-width: 0;
                        padding: 2px;
                        color: var(--app-text-color);
                        margin:0 4px;
                    }
                    .selector {
                        overflow-x: auto;
                        overflow-y: hidden;
                        white-space: nowrap;
                        max-width: 360px;
                    }
                    div.bottom-commands {
                        display: flex;
                        width: 100%;
                        justify-content: flex-end;
                        align-items: center;
                    }
                    div.bottom-commands > div.grid-size-indicator {
                        max-width: 208px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        color: var(--app-text-color);
                        font-size: 13px;
                        font-weight: 400;
                        letter-spacing: 0.3px;
                    }
                    .scroll-top {
                        background: var(--app-secondary-color);
                        padding: 0 4px;
                        height: 24px;
                        width: 24px;
                        box-sizing: border-box;
                        border-radius: 50%;
                    }
                    .warn {
                        color: var(--app-status-color-nok);
                    }
                    @media screen and (max-width:1696px) {
                        .table-top paper-dropdown-menu#filterLabresult {
                            margin-left: 0;
                        }
                    }
                    @media screen and (max-width:1025px) {
                        .col-right {
                            width: 100vw;
                            transition: all .5s ease;
                            box-shadow: none;
                        }
                        ht-spinner.center {
                            left: 50vw;
                        }
                    }
                    @media screen and (max-width: 1025px) {
                        div.bottom-commands {
                            justify-content: center;
                        }
                    }
                    @media screen and (max-width: 800px) {
                        .table-top paper-dropdown-menu#filterLabresult {
                            min-width: 0;
                            margin-left: initial;
                        }
                        .mb4 span {
                            display: none;
                        }
                        #capacity-indicator paper-progress {
                            width: 64px;
                        }
                        .table-top paper-dropdown-menu#filterLabresult {
                            min-width: 0;
                            margin-left: initial;
                        }
                    }
                    @media screen and (max-width: 640px) {
                        .hideOnMobile {
                            display: none;
                        }
                    }
                    .bold {
                        font-weight: 700;
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
                        /*min-height: 200px;*/
                        background-color: #ffffff;
                        padding:20px;
                        border:1px solid var(--app-secondary-color);
                        margin:40px auto 0 auto;
                        text-align: center;
                    }
                    .sub-container {
                        position:relative;
                    }
                    .loadingIcon {
                        margin-right:5px;
                    }
                    .loadingIcon.done {
                        color: var(--app-secondary-color);
                    }
                    .mr5 {margin-right:5px}
                    .ml5 {margin-left:5px}
                    .smallIcon { width:16px; height:16px; }
                    .bottom30 {
                        bottom:30px!important;
                    }
                    .m-t-20 {
                                        margin-top:20px!important;
                                    }
                    .m-t-25 {
                        margin-top:25px!important;
                    }
                    .m-t-30 {
                        margin-top:30px!important;
                    }
                    .m-t-40 {
                        margin-top:40px;
                    }
                    .m-t-50 {
                        margin-top:50px!important;
                    }
                    .textAlignCenter {
                        text-align: center;
                    }
                    .dialogButtons {
                        position: absolute;
                        bottom: 40px;
                        margin: 0;
                        width:100%;
                        text-align:center;
                    }
                    .fs12 {
                        font-size:12px;
                    }
                    .m-r-5 {
                        margin-right:5px;
                    }
                    .m-t-minus-2 {
                        margin-top:-2px;
                    }
                    .w-20 {
                        width:20px
                    }
                    .darkRed {
                        color:#a00000!important;
                    }
                    .modal-title {
                        justify-content: flex-start;
                    }
                    .modal-title iron-icon{
                        margin-right: 8px;
                    }
                    .eHealthBoxProcessErrorMessage {
                        border: 1px dashed #999999;
                        padding: 10px 10px 0 10px;
                        margin-top: 10px;
                        max-height: 240px;
                        overflow: auto;
                    }
                    .eHealthBoxProcessErrorMessage p {
                        margin:0 0 5px 0;
                        border-bottom:1px dashed #dddddd;
                        padding-bottom:5px;
                    }
                    .eHealthBoxProcessErrorMessage p:last-child {
                        border-bottom:0;
                    }
                    .italic {
                        font-style:italic;
                    }
                    .fs9em {
                        font-size:.9em;
                    }
                    .fs8em {
                        font-size:.8em;
                    }
                    .displayBlock {
                        display: block;
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
                    #messagesFilters {
                        margin:0 auto;
                        position: relative;
                    }
                    #messagesFiltersDropDown {
                        width:220px;
                        margin-left:150px;
                    }
                    #messagesFiltersDropDown hr {
                        margin: 5px 10px;
                        border: 0;
                        border-top: 1px dashed #aaaaaa;
                    }
                    .w20 {
                        width:20px;
                    }
                    .h20 {
                        height:20px;
                    }
                    .w22 {
                        width:22px;
                    }
                    .darkBlue {
                        color:var(--dark-primary-color)!important;
                    }
                    .darkGreen {
                        color:#41671e!important
                    }
                    .visibilityHidden {
                        visibility:hidden;
                    }
                    .searchIconContainer {
                        display:inline-block;
                    }
                    .searchIcon {
                        margin:0
                    }
                    #searchContainer {
                        display: block;
                        width: 100%;
                        position: absolute;
                        left: 0;
                        top: -100px;
                        background: #fff;
                        padding: 5px 25px 8px 25px;
                        z-index: 10;
                        border-bottom: 1px solid #ddd;
                        border-left: 1px solid #ddd;
                        height: 40px;
                        transition: all .3s ease-in-out;
                        -webkit-transition: all .3s ease-in-out;
                    }
                    #searchContainer.opened {
                        top:0;
                    }
                    #searchInputField {
                        display: inline-block;
                        width: calc(100% - 330px);
                        margin: -15px 0 0 0;
                        padding: 0;
                    }
                    .action-btn {
                        font-size: 14px;
                        font-weight: 700;
                        color: var(--app-text-color);
                        transition: all .12s cubic-bezier(0.075, 0.82, 0.165, 1);
                        margin-bottom: 8px;
                        height: 40px;
                        text-transform: none;
                        background-color: #eeeeee;
                        padding-right:15px;
                        border:1px solid #cccccc;
                    }
                    .action-btn.searchButtons.triggerSearchButton {
                        right:180px;
                    }
                    .action-btn:hover{
                        background-color: var(--app-secondary-color);
                    }
                    .action-btn iron-icon{
                        height: 20px;
                        width: 20px;
                        padding: 4px;
                        opacity: .7;
                        color: var(--app-text-color);
                    }
                    .searchButtonContainer {
                        position: absolute;
                        top: 5px;
                    }
                </style>
            </custom-style>
    
    
    
            <template is="dom-if" if="[[_isLoading]]">
                <div id="loadingContainer">
                    <div id="loadingContentContainer">
                        <div style="max-width:80px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active></ht-spinner></div>
                        <div id="loadingContent"></div>
                    </div>
                </div>
            </template>
    
    
    
            <div class="table-top">
    
                <div id="searchContainer">
                    <iron-icon class="searchIcon m-r-5" icon="icons:search"></iron-icon>
                    <paper-input id="searchInputField" value="{{_searchedValue}}" placeholder="[[localize('inputYourSearchQuery','Input your search query...',language)]]" autofocus on-keyup="_submitSearchWhenEnterIsPressed"></paper-input>
                    <paper-button class="button button--save triggerSearchButton" on-tap="_getEHealthBoxData"><iron-icon icon="icons:search" on-tap="_getEHealthBoxData"></iron-icon> [[localize('sch','Search',language)]]</paper-button>
                    <paper-button class="button" on-tap="_closeSearch"><iron-icon icon="icons:close" on-tap="_closeSearch"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                </div>
    
                <div class="actions">
    
                    <template is="dom-if" if="[[_haveGridSelectedMessages]]">
                        <template is="dom-if" if="[[!_isEqual(menuSelectionObject.selection.folder,'assigned')]]"><template is="dom-if" if="[[!_isEqual(menuSelectionObject.selection.folder,'deleted')]]"><template is="dom-if" if="[[!_isEqual(menuSelectionObject.selection.folder,'hidden')]]"><paper-icon-button id="hidebutton" icon="visibility-off" on-tap="_hideUnHideMessages"></paper-icon-button><paper-tooltip for="hidebutton" offset="0">[[localize('ehb.hideMessages','Hide messages',language)]]</paper-tooltip></template></template></template>
                        <template is="dom-if" if="[[!_isEqual(menuSelectionObject.selection.folder,'assigned')]]"><template is="dom-if" if="[[_isEqual(menuSelectionObject.selection.folder,'hidden')]]"><paper-icon-button id="restoreHiddenMessagesButton" icon="undo" on-tap="_hideUnHideMessages"></paper-icon-button><paper-tooltip for="restoreHiddenMessagesButton" offset="0">[[localize('ehb.restoreHiddenMessages','Restore hidden messages',language)]]</paper-tooltip></template></template>
                        <template is="dom-if" if="[[!_isEqual(menuSelectionObject.selection.folder,'deleted')]]"><paper-icon-button id="del-button" icon="delete" on-tap="_deletedUndeleteMessages"></paper-icon-button></template>
                        <template is="dom-if" if="[[_isEqual(menuSelectionObject.selection.folder,'deleted')]]"><paper-icon-button id="restore-button" icon="undo" on-tap="_deletedUndeleteMessages"></paper-icon-button><paper-icon-button id="del-for-button" icon="delete-forever" on-tap="_confirmDeleteMessagesForEver"></paper-icon-button></template>
                        <template is="dom-if" if="[[!_isEqual(menuSelectionObject.selection.folder,'assigned')]]"><paper-icon-button id="flagAsUnreadButton" icon="markunread-mailbox" on-tap="_flagAsUnread"></paper-icon-button><paper-tooltip for="flagAsUnreadButton" offset="0">[[localize('ehb.flagAsUnread','Flag as unread',language)]]</paper-tooltip></template>
                    </template>
    
                    <template is="dom-if" if="[[!_haveGridSelectedMessages]]"><paper-icon-button id="refresh-button" icon="icons:refresh" on-tap="_triggerGetEHealthBoxDataForceRefresh"></paper-icon-button></template>
    
                    <paper-button id="new-msg-btn" class$="button button--save new-msg-btn [[_disabledCssClassWhenNoeHealthSession]]" on-tap="_createNewMessage">
                        <template is="dom-if" if="[[!ehealthSession]]"><iron-icon icon="icons:block" class="mr8"></iron-icon></template>
                        <template is="dom-if" if="[[ehealthSession]]"><iron-icon icon="icons:mail" class="mr8"></iron-icon></template>
                         &nbsp; [[localize('new_mes','New Message',language)]]
                    </paper-button>
    
                    <div id="messagesFilters">
                        <div class="searchButtonContainer"><paper-button class="button button--other" on-tap="_openSearch"><iron-icon icon="icons:search" on-tap="_openSearch" class="m-r-5"></iron-icon> [[localize('sch','Search',language)]]</paper-button></div>
                        <paper-dropdown-menu id="messagesFiltersDropDown" label="[[localize('filterMessages','Filter messages',language)]]" no-label-float selected-item="{{_messageFilterSelectedItem}}">
                            <paper-listbox slot="dropdown-content">
                                <paper-item data-filter="" id="allMessagesFilter"><iron-icon icon="icons:home" class="m-r-5 w22"></iron-icon>[[localize('ehb.all','All',language)]]</paper-item>
                                <hr />
                                <paper-item data-filter="read"><iron-icon icon="icons:visibility" class="m-r-5 w22"></iron-icon>[[localize('ehb.read','Read',language)]]</paper-item>
                                <paper-item data-filter="unread"><iron-icon icon="icons:visibility-off" class="m-r-5 w22"></iron-icon>[[localize('ehb.unread','Unread',language)]]</paper-item>
                                <hr />
                                <paper-item data-filter="withAttachment"><iron-icon icon="editor:attach-file" class="m-r-5 w22"></iron-icon>[[localize('ehb.withAttachments','With attachments',language)]]</paper-item>
                                <paper-item data-filter="withoutAttachment"><iron-icon icon="icons:check-box-outline-blank" class="m-r-5 w22"></iron-icon>[[localize('ehb.withoutAttachments','Without attachments',language)]]</paper-item>
                                <hr />
                                <paper-item data-filter="important"><iron-icon icon="icons:arrow-upward" class="m-r-5 w22"></iron-icon>[[localize('ehb.important','High importance',language)]]</paper-item>
                                <paper-item data-filter="notImportant"><iron-icon icon="icons:arrow-downward" class="m-r-5 w22"></iron-icon>[[localize('ehb.notImportant','Low importance',language)]]</paper-item>
                                <hr />
                                <paper-item data-filter="assignedResults"><iron-icon icon="icons:folder-shared" class="m-r-5 w22"></iron-icon>[[localize('ehb.assignedResults','Assigned results',language)]]</paper-item>
                                <paper-item data-filter="unassignedResults"><iron-icon icon="icons:folder-open" class="m-r-5 w22"></iron-icon>[[localize('ehb.unassignedResults','Unassigned results',language)]]</paper-item>
                                <paper-item data-filter="labResults"><iron-icon icon="vaadin:flask" class="m-r-5 w22"></iron-icon>[[localize('ehb.labResults','Lab results',language)]]</paper-item>
                                <hr />
                                <paper-item data-filter="allButLabResults"><iron-icon icon="icons:mail" class="m-r-5 w22"></iron-icon>[[localize('ehb.allButLabProtocol','All but lab / protocol',language)]]</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                    </div>
    
                </div>
    
                <div class="indicators">
    
                    <template is="dom-if" if="[[!_isEqual(nbrMessagesInStandBy,0)]]">
                        <div id="stamp-indicator" class="stamp-indicator hasNew errorColor"><iron-icon icon="warning" class="errorColor"></iron-icon><span class="label errorColor fs12">[[nbrMessagesInStandBy]] [[localize('pendingMessages','Pending messages',language)]]</span></div>
                        <paper-tooltip for="stamp-indicator" offset="0">[[localize('becauseEhBoxIsFull','Because your e-Health Box is full',language)]]</paper-tooltip>
                    </template>
    
                    <div id="capacity-indicator">
                        <div class="mb4"><iron-icon icon="cloud"></iron-icon>
                            <span>
                                <template is="dom-if" if="[[ehealthSession]]">[[localize('ehb.capacity','Capacity',language)]]: [[currentCapacityPercentage]]%</template>
                                <template is="dom-if" if="[[!ehealthSession]]"><span class="warn">[[localize('ehb.disconnected','Disconnected',language)]]</span></template>
                            </span>
                        </div>
                        <template is="dom-if" if="[[ehealthSession]]"><paper-progress value$="[[currentCapacityPercentage]]" min="0" max="100" class$="[[_ehBoxCurrentSizeColor]]"></paper-progress></template>
                    </div>
    
                    <template is="dom-if" if="[[ehealthSession]]">
                        <paper-tooltip for="capacity-indicator" offset="0">[[currentStorageCapacity]]%</paper-tooltip>
                    </template>
    
                </div>
    
            </div>
    
            <div class="second-panel col-right">
    
                <vaadin-grid
                    id="vaadinMessagesGrid"
                    class="material"
                    width="100%"
                    items="[[_vaadinGridDataToShow]]"
                    active-item="{{_vaadinGridMessagesActiveItem}}"
                    pageSize="[[_vaadinGridMaxItemsPerPage]]"
                    on-selected-items-changed="_gridSelectedItemsChanged"
                >
    
                    <vaadin-grid-selection-column></vaadin-grid-selection-column>
    
                    <vaadin-grid-column flex-grow="1">
                        <template class="header"><vaadin-grid-sorter path="fromAddress"><b>[[localize('ehb.senderRecipient','Sender / recipient',language)]]</b></vaadin-grid-sorter></template>
                        <!--
                            <template is="dom-if" if="[[!_isEqual(menuSelectionObject.selection.folder,'sent')]]"><template class="header"><vaadin-grid-sorter path="fromAddress"><b>[[localize('sen','Sender',language)]]</b></vaadin-grid-sorter></template></template>
                            <template is="dom-if" if="[[_isEqual(menuSelectionObject.selection.folder,'sent')]]"><template class="header"><vaadin-grid-sorter path="fromAddress"><b>[[localize('rec','Recipient',language)]]</b></vaadin-grid-sorter></template></template>
                        -->
                        <template>
                            <div class$="cell [[_boldIfIsUnread(item)]]">
                               <template is="dom-if" if="[[_isImportant(item)]]"><iron-icon icon="vaadin:exclamation" class="darkRed"></iron-icon></template>
                                <template is="dom-if" if="[[!_isImportant(item)]]"><iron-icon icon="warning" class="darkGreen visibilityHidden"></iron-icon></template>
                                <template is="dom-if" if="[[_hasAnnex(item)]]"><iron-icon icon="editor:attach-file" class="m-r-5"></iron-icon></template>
                                <template is="dom-if" if="[[!_hasAnnex(item)]]"><iron-icon icon="editor:attach-file" class="m-r-5 visibilityHidden"></iron-icon></template>
                                <template is="dom-if" if="[[!_isEqual(menuSelectionObject.selection.folder,'sent')]]">[[item.fromAddress]]</template>
                                <template is="dom-if" if="[[_isEqual(menuSelectionObject.selection.folder,'sent')]]">[[_formatRecipientDetailsForSentFolder(item)]]</template>
                            </div>
                        </template>
                    </vaadin-grid-column>
    
                    <vaadin-grid-column flex-grow="1">
                        <template class="header"><vaadin-grid-sorter path="subject">[[localize('sub','Subject',language)]]</vaadin-grid-sorter></template>
                        <template><div class$="cell [[_boldIfIsUnread(item)]]">[[item.subject]]</div></template>
                    </vaadin-grid-column>
    
                    <vaadin-grid-column flex-grow="1">
                        <template class="header">[[localize('pat','Patient',language)]]</template>
                        <template>
                            <template is="dom-repeat" items="[[item.uniqueAnnexesInfos]]" as="annexesInfos">
                                <div class$="singlePatientInfo [[_boldIfIsUnread(item)]]">
                                    <template is="dom-if" if="[[annexesInfos.isAssigned]]"><div id="hasLab-[[annexesInfos.patientData.uniqueId]]" class="labicon"></div><paper-tooltip position="right" for="hasLab-[[annexesInfos.patientData.uniqueId]]">[[localize('assigned_labresults','Assigned lab results',language)]]</paper-tooltip></template>
                                    <template is="dom-if" if="[[!annexesInfos.isAssigned]]"><div id="hasLab-[[annexesInfos.patientData.uniqueId]]" class="labicon unassigned-true"></div><paper-tooltip position="right" for="hasLab-[[annexesInfos.patientData.uniqueId]]">[[localize('unassigned_labresults','Unassigned lab results',language)]]</paper-tooltip></template>
                                    [[annexesInfos.patientData.lastName]]
                                    [[annexesInfos.patientData.firstName]]
                                    [[annexesInfos.patientData.dateOfBirthHr]]
                                </div>
                            </template>
                        </template>
                    </vaadin-grid-column>
    
                    <vaadin-grid-column width="100px" flex-grow="0">
                        <template class="header"><vaadin-grid-sorter path="created" direction="asc">[[localize('dat','Date',language)]]</vaadin-grid-sorter></template>
                        <template><div class$="cell [[_boldIfIsUnread(item)]]">[[_msTstampToDDMMYYYY(item.created)]]</div></template>
                    </vaadin-grid-column>
    
                </vaadin-grid>
    
                <div class="bottom-commands">
                    <div class="grid-size-indicator hideOnMobile"> [[pageStart]] – [[pageEnd]] [[localize('sur','sur',language)]] [[_totalMessagesForCurrentFolderAndCurrentFilter]]</div>
                    <paper-icon-button id="previous-page-change" icon="chevron-left"class="change-page" on-tap="_gotoPreviousGridPage"></paper-icon-button>
                    <paper-icon-button id="next-page-change" icon="chevron-right" class="change-page" on-tap="_gotoNextGridPage"></paper-icon-button>
                    <div class="hideOnMobile"><paper-icon-button id="scrolltop" class="button--icon-btn" icon="arrow-upward" on-tap="_scrollToTop"></paper-icon-button></div>
                </div>
    
            </div>
    
    
    
            <paper-dialog class="modalDialog" id="notConnctedToeHealthBox" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('notConnctedToeHealthBox','You are not connected to your eHealthBox yet',language)]]</p>
                    <p>[[localize('someFunctionalitiesAreDisabled','Some functionalities are disabled',language)]].</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="confirmPermanentDeletionDialog" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('confirmDeletePermanently','Are you sure you wish to delete PERMANENTLY ?',language)]]</p>
                    <p>[[localize('cantBeUndone',"This can't be undone",language)]].</p>
                    <p><vaadin-checkbox checked="{{_confirmationDialogAcknowledgementsProperties.confirmPermanentDeletionDialog}}"> [[localize('acknowledgementDontShowAnymore','I understand\\, don\\'t ask for confirmation in the future',language)]]</vaadin-checkbox></p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('can','Cancel',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_deleteMessagesForEver"><iron-icon icon="check-circle"></iron-icon>[[localize('confirm','Confirm',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="errorWithEHealthBoxProcessing" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('errorDealingWithYourRequest','An error occurred while processing your request',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p class="fw700">[[localize('followingMessagesCouldNotBeDeletedRestored','Following message(s) could not be deleted / restored',language)]]:</p>
                    <div class="eHealthBoxProcessErrorMessage">
                        <template is="dom-repeat" items="[[_eHealthBoxProcessErrorMessages]]" as="singleErrorMessage" id="eHealthBoxProcessErrorMessageDomRepeat">
                            <p>
                                <span class="fs9em bold italic displayBlock "><iron-icon icon="icons:mail" class="errorColorDark"></iron-icon> [[singleErrorMessage.subject]]</span>
                                <span class="fs8em displayBlock">[[[_msTstampToDDMMYYYY(singleErrorMessage.created)]]] [[singleErrorMessage.fromAddress]]</span>
                            </p>
                        </template>
                    </div>
                    <p class="fw700">[[localize('toContactUs','To contact us',language)]]: <iron-icon icon="communication:phone" class="mr5 ml5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark" ></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    <paper-button class="button button--save" on-tap="_moveErrorMessagesToHiddenFolder button--save"><iron-icon icon="icons:visibility-off"></iron-icon>[[localize('moveMessagesToHiddenFolder','Move messages to hidden box',language)]]</paper-button>
                </div>
            </paper-dialog>
            <paper-dialog class="modalDialog" id="errorGettingEHealthBoxMessages" no-cancel-on-outside-click no-cancel-on-esc-key>
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="content textaligncenter pt20 pb70 pl20 pr20">
                    <p>[[localize('errorGettingEHealthBoxMessages','An error occurred while getting your messages',language)]]</p>
                    <p>[[localize('pleaseReloadPageOrApp','Please reload the page / the application',language)]]</p>
                </div>
                <div class="buttons">
                    <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                </div>
            </paper-dialog>
        `;
    }

    static get is() {
        return 'ht-msg-list';
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
            _vaadinGridMessagesActiveItem: {
                type: Object,
                value: null
            },
            _vaadinGridDataToShow: {
                type: Array,
                value: () => []
            },
            menuSelectionObject: {
                type: Object
            },
            _currentPageNumber: {
                type: Number,
                value: 1
            },
            nbrMessagesInStandBy: {
                type: Number,
                value: 0
            },
            ehBoxCurrentSize: {
                type: Number,
                value: 0
            },
            ehboxMaxStorageCapacity: {
                type: Number,
                value: 10485760 // 1024^2 - 10Mb
            },
            currentCapacityPercentage: {
                type: Number,
                value: 0
            },
            selectedLabFilter: {
                type: Number,
                    value: 0
            },
            currentStorageCapacity: {
                type: Number,
                value: 0
            },
            _totalMessagesForCurrentFolderAndCurrentFilter: {
                type: Number,
                value: 0
            },
            _totalPagesForCurrentFolderAndCurrentFilter: {
                type: Number,
                value: 1
            },
            ehealthSession: {
                type: Boolean,
                value: false,
                noReset: true
            },
            pageStart: {
                type: Number,
                value: 0
            },
            pageEnd: {
                type: Number,
                value: 100
            },
            _bodyOverlay: {
                type: Boolean,
                value: false
            },
            _loadingMessages: {
                type: Array,
                value: () => []
            },
            _isLoading: {
                type: Boolean,
                value: false,
                observer: '_loadingStatusChanged'
            },
            _vaadinGridMaxItemsPerPage: {
                type: Number,
                value: 100
            },
            _ehBoxCurrentSizeColor: {
                type: String,
                value: ""
            },
            _disabledCssClassWhenNoeHealthSession: {
                type: String,
                value: ""
            },
            _haveGridSelectedMessages: {
                type: Boolean,
                value: false
            },
            _eHealthBoxProcessErrorMessages: {
                type: Array,
                value: () => []
            },
            _getEHealthBoxDataLastRefreshTstamp:{
                type: Number,
                value: 0
            },
            _cachedMessagesData: {
                type: Object,
                value: () => {
                    return {
                        "inbox": [],
                        "sent": [],
                        "hidden": [],
                        "deleted": [],
                        "assigned": []
                    }
                }
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
            _messageFilterSelectedItem: {
                type: Object,
                value: {}
            },
            _eHealthBoxLastFolder: {
                type: String,
                value: "inbox"
            },
            _messageFilterLastSelectedItem: {
                type: String,
                value: ""
            },
            _searchedValue: {
                type: String,
                value: ""
            },
            _confirmationDialogAcknowledgementsProperties: {
                type: Array,
                value: () => [],
                noReset: true
            },
            _locked: {
                type: Boolean,
                value: false,
                noReset: true
            }
        };
    }

    constructor() {
        super();
    }

    static get observers() {
        return [
            '_setIsConnectedToEhbox(api.tokenId)',
            '_getEHealthBoxData(menuSelectionObject,_messageFilterSelectedItem,_currentPageNumber)',
            '_triggerGetEHealthBoxDataForceRefresh(user,currentHcp)',
            '_vaadinGridActiveItemChanged(_vaadinGridMessagesActiveItem)',
            '_userDialogAcknowledgementsPropertiesChanged(_confirmationDialogAcknowledgementsProperties.*)',
        ];
    }

    ready() {
        super.ready();
    }

    _loadingStatusChanged() {
        if(!this._isLoading) this._resetLoadingMessage();
    }

    _resetLoadingMessage() {
        this._loadingMessages = [];
    }

    _setLoadingMessage( messageData ) {
        setTimeout(()=> {
            if (messageData.updateLastMessage) this._loadingMessages.pop();
            this._loadingMessages.push(messageData);
            let loadingContentTarget = this.shadowRoot.querySelectorAll('#loadingContent')[0];
            if (loadingContentTarget) { loadingContentTarget.innerHTML = ''; _.each(this._loadingMessages, (v) => { loadingContentTarget.innerHTML += "<p><iron-icon icon='" + v.icon + "' class='" + (v.done ? "loadingIcon done" : "loadingIcon") + "'></iron-icon>" + v.message + "</p>"; }); }
        },100)
    }

    _setIsConnectedToEhbox() {
        this.set("ehealthSession", !!_.get(this,"api.tokenId"))
        this.set("_disabledCssClassWhenNoeHealthSession", !!_.get(this,"api.tokenId") ? "" : "disabled")
    }

    _isUnread(m) {
        return ((m.status & (1 << 1)) !== 0)
    }

    _boldIfIsUnread(m) {
        return this._isUnread(m) ? "bold" : "";
    }

    _isImportant(m) {
        return ((m.status & (1 << 2)) !== 0)
    }

    _isCrypted(m) {
        return ((m.status & (1 << 3)) !== 0)
    }

    _hasAnnex(m) {
        return ((m.status & (1 << 4)) !== 0)
    }

    _getGridSelectedItems() {
        return _.get(this.shadowRoot.querySelector('#vaadinMessagesGrid'), "selectedItems", []);
    }

    _resetGridSelectedItems() {
        const vaadinMessagesGrid = this.shadowRoot.querySelector('#vaadinMessagesGrid');
        vaadinMessagesGrid.selectedItems = []
        this.set('_haveGridSelectedMessages',false)
    }

    _clearGridCache() {
        const vaadinMessagesGrid = this.shadowRoot.querySelector('#vaadinMessagesGrid');
        vaadinMessagesGrid && vaadinMessagesGrid.clearCache()
    }

    _gridSelectedItemsChanged(e) {
        this.set("_haveGridSelectedMessages", (!!_.size(this._getGridSelectedItems()) ))
    }

    _isEqual(a,b) {
        return !!(a === b)
    }

    _getBoxCapacity() {
        return !(_.get(this,"api.keystoreId",false) && _.get(this,"api.tokenId",false) && _.get(this,"api.credentials.ehpassword",false)) ?
            Promise.resolve() :
            this.api.fhc().Ehboxcontroller().getInfosUsingGET(this.api.keystoreId, _.get(this,"api.tokenId"), this.api.credentials.ehpassword)
                .then(boxInfo=>{
                    this.set('nbrMessagesInStandBy',parseInt(_.get(boxInfo,"nbrMessagesInStandBy",0)))
                    this.set('ehBoxCurrentSize',parseInt(_.get(boxInfo,"currentSize",0)))
                    this.set('ehboxMaxStorageCapacity',parseInt(_.get(boxInfo,"maxSize",10485760))) // 1024^2 - 10 Mb
                    this.set('currentStorageCapacity',((this.ehBoxCurrentSize / this.ehboxMaxStorageCapacity)*100).toFixed(2))
                    if (this.currentStorageCapacity > 90) this.set('_ehBoxCurrentSizeColor','full')
                    this.set('currentCapacityPercentage', this.currentStorageCapacity <= 100 ? this.currentStorageCapacity : '100+')
                })
                .catch(e=>console.log("ERROR with _getBoxCapacity: ", e))
                .finally(()=>Promise.resolve())
    }

    _scrollToTop() {
        const grid = this.shadowRoot.getElementById('vaadinMessagesGrid')
        return grid && setTimeout(()=>grid._scrollToIndex(0),250)
    }

    _triggerGridResize() {
        const vaadinMessagesGrid = this.shadowRoot.querySelector('#vaadinMessagesGrid');
        vaadinMessagesGrid && vaadinMessagesGrid.notifyResize()
    }

    _msTstampToDDMMYYYY(msTstamp) {
        return parseInt(msTstamp) ? this.api.moment(parseInt(msTstamp)).format('DD/MM/YYYY') : ""
    }

    _toggleProcessingPopup( inputMessage="" ) {
        if(!_.get(this,"_isLoading",false)) {
            this._resetLoadingMessage();
            this.set('_isLoading', true );
            this._setLoadingMessage({ message: _.trim(inputMessage) ? _.trim(inputMessage) : this.localize('ongoingProcess',this.language), icon:"arrow-forward"});
        } else {
            this.set('_isLoading', false );
        }
    }

    _confirmDeleteMessagesForEver() {

        const selectedMessages = this._getGridSelectedItems()
        if(!_.size(selectedMessages)) return

        this.set("_bodyOverlay", true);
        this.$["confirmPermanentDeletionDialog"].open()

    }

    _closeDialogs() {
        this.set("_bodyOverlay", false);
        _.map( this.shadowRoot.querySelectorAll('.modalDialog'), i=> i && typeof i.close === "function" && i.close() )
    }

    _menuSelectionChanged(menuSelectionObject) {
        this._resetGridSelectedItems();
    }

    _createNewMessage(){

        // No eHealthBox ?
        if (!_.get(this,"ehealthSession",false)) { this.set("_bodyOverlay", true); this.$["notConnctedToeHealthBox"].open(); return; }

        this.dispatchEvent(new CustomEvent('create-new-msg', { detail: {},params: null}));

    }

    _closeReadMessageComponent() {
        this.set("_vaadinGridMessagesActiveItem",null)
        this.dispatchEvent(new CustomEvent('selected-message-changed', { detail:{selection:{item:null}}}))
        return Promise.resolve()
    }

    assignResolvedObjects(inputObjects) {
        _.map(inputObjects, (v,k)=> this.set(k,v))
    }

    _moveErrorMessagesToHiddenFolder() {
        this._closeDialogs();
        const messagesToHide = _.cloneDeep(this._eHealthBoxProcessErrorMessages)
        this.set("_eHealthBoxProcessErrorMessages",[])
        this._hideUnHideMessages(_.compact(_.filter(messagesToHide, i=>!(_.get(i,"status",0)&(1<<14)))), {metas:{deletionFromeHealthBoxFailed:true}}); // Hide when not already
    }

    _resetMessagesFilters() {
        if(this.shadowRoot.querySelector('#allMessagesFilter') && typeof _.get(this.shadowRoot.querySelector('#allMessagesFilter'),"click",false) === "function" ) { try { this.shadowRoot.querySelector('#allMessagesFilter').click() } catch(e){} }
    }

    _hideUnHideMessages(givenMessages=null,additionalDataForMessagesToUpdate=null) {

        let selectedMessages = _.size(givenMessages) && !( givenMessages instanceof Event) ? givenMessages : this._getGridSelectedItems()
        selectedMessages = !_.size(additionalDataForMessagesToUpdate) || !!_.size(_.get(additionalDataForMessagesToUpdate,"sourceEvent",false)) ? selectedMessages : _.map(selectedMessages, i=>_.merge(i,additionalDataForMessagesToUpdate))
        if(!_.size(selectedMessages)) return Promise.resolve()

        this._toggleProcessingPopup();

        let prom = Promise.resolve([]);
        selectedMessages.map(singleSelectedMessage => {
            prom = prom.then(promisesCarrier => {
                const isAlreadyHidden = !!(_.get(singleSelectedMessage,"status",0)&(1<<14))
                const newMessageStatus = isAlreadyHidden ? (_.get(singleSelectedMessage,"status",0)^(1<<14)) : (_.get(singleSelectedMessage,"status",0)|(1<<14))
                return !_.trim(_.get(singleSelectedMessage,"id","")) ? Promise.resolve() : this.api.message().modifyMessage(_.merge(singleSelectedMessage, {status:newMessageStatus})).then(modifiedMessage=>_.concat(promisesCarrier, {action:isAlreadyHidden?"unhide":"hide", message:modifiedMessage})).catch(e=>{console.log("ERROR with modifyMessage: ", e); return Promise.resolve();})
            })
        })

        return prom
            .then(promisesCarrier=>this._updateCachedMessagesDataStructure(promisesCarrier))
            .catch(e=>console.log("ERROR with _hideMessages: ",e))
            .finally(()=>{
                this._toggleProcessingPopup();
                this._getEHealthBoxData();
                return Promise.resolve()
            })

    }

    _flagAsUnread() {

        const selectedMessages = _.filter(this._getGridSelectedItems(),i=>!(_.get(i,"status",0) & (1 << 1)))
        if(!_.size(selectedMessages)) return

        this._toggleProcessingPopup();

        let prom = Promise.resolve([]);
        selectedMessages.map(singleSelectedMessage => {
            prom = prom.then(promisesCarrier => !_.trim(_.get(singleSelectedMessage,"id","")) ? Promise.resolve() : this.api.message().modifyMessage(_.merge(singleSelectedMessage, {status:(_.get(singleSelectedMessage,"status",0)|(1<<1))})).then(modifiedMessage=>_.concat(promisesCarrier, {action:"unread", message:modifiedMessage})).catch(e=>{console.log("ERROR with modifyMessage: ", e); return Promise.resolve();}))
        })

        return prom
            .then(promisesCarrier=>this._updateCachedMessagesDataStructure(promisesCarrier))
            .catch(e=>console.log("ERROR with _hideMessages: ",e))
            .finally(()=>{
                this._toggleProcessingPopup();
                this._getEHealthBoxData();
            })

    }

    _deletedUndeleteMessages(givenMessages=null) {

        // No eHealthBox ?
        if (!_.get(this,"ehealthSession",false)) { this.set("_bodyOverlay", true); this.$["notConnctedToeHealthBox"].open(); return Promise.resolve(); }

        let selectedMessages = _.size(givenMessages) && !( givenMessages instanceof Event) ? givenMessages : this._getGridSelectedItems()
        if(!_.size(selectedMessages)) return Promise.resolve()

        this._toggleProcessingPopup()

        let prom = Promise.resolve([]);
        selectedMessages.map(singleSelectedMessage => {
            prom = prom.then(promisesCarrier => {
                const sourceBox = _.trim(_.get(_.trim(_.get(singleSelectedMessage,"transportGuid","")).split(':'), "[0]", ""))
                const destinationBox = sourceBox === "INBOX" ? "BININBOX" : sourceBox === "SENTBOX" ? "BINSENTBOX" : sourceBox === "BININBOX" ? "INBOX" : sourceBox === "BINSENTBOX" ? "SENTBOX" : false
                const eHealthBoxMessageId = _.trim(_.get(_.trim(_.get(singleSelectedMessage,"transportGuid","")).split(':'), "[1]", ""))
                const action = sourceBox === "INBOX" || sourceBox === "SENTBOX" ? "delete" : "undelete"
                const newStatus = action === "delete" ? (_.get(singleSelectedMessage,"status",0)|(1<<20)) : (_.get(singleSelectedMessage,"status",0)^(1<<20))
                return !eHealthBoxMessageId || !sourceBox || !destinationBox || !_.get(this,"api.keystoreId",false) || !_.get(this,"api.tokenId",false) || !_.get(this,"api.credentials.ehpassword",false) ?
                    false :
                    this.api.fhc().Ehboxcontroller().moveMessagesUsingPOST(this.api.keystoreId, _.get(this,"api.tokenId"), this.api.credentials.ehpassword, [eHealthBoxMessageId], sourceBox, destinationBox).catch(e=>{})
                        .then(()=> this.api.message().modifyMessage(_.merge(singleSelectedMessage, {transportGuid:destinationBox+":"+eHealthBoxMessageId, status:newStatus})).then(modifiedMessage=>_.concat(promisesCarrier, {action:action, message:modifiedMessage, success:true})).catch(e=>{console.log("ERROR with modifyMessage: ", e); return Promise.resolve();}))
                        .catch(()=>_.concat(promisesCarrier, {action:action, message:singleSelectedMessage, success:false}))
            })
        })

        return prom
            .then(promisesCarrier => {
                const failedExecutions = _.map(_.compact(_.filter(promisesCarrier, i=>!_.get(i,"success",false))),i=>_.get(i,"message",{}))
                const successfulExecutions = _.compact(_.filter(promisesCarrier, i=>!!_.get(i,"success",false)))
                if(_.size(failedExecutions)) {
                    setTimeout(()=>{
                        this.set("_bodyOverlay", true);
                        this.$["errorWithEHealthBoxProcessing"].open();
                        this.set("_eHealthBoxProcessErrorMessages", failedExecutions);
                        this.shadowRoot.querySelector('#eHealthBoxProcessErrorMessageDomRepeat') && this.shadowRoot.querySelector('#eHealthBoxProcessErrorMessageDomRepeat').render()
                    },200)
                }
                return this._updateCachedMessagesDataStructure(successfulExecutions)
            })
            .catch(e=>console.log("ERROR with _deletedUndeleteMessages: ",e))
            .finally(()=>{
                this._toggleProcessingPopup();
                this._getEHealthBoxData();
                return Promise.resolve()
            })

    }

    _triggerGetEHealthBoxDataForceRefresh() {

        return !!_.get(this,"_locked",false) ? null : this._getEHealthBoxData(null,null,null,{forceRefresh:true})

    }

    _triggerGetEHealthBoxDataForceRefreshFromWebWorker() {

        const currentVaadinGridMessagesActiveItem = _.cloneDeep(_.get(this,"_vaadinGridMessagesActiveItem",{}))

        return !!_.size(currentVaadinGridMessagesActiveItem) ?
            this._getEHealthBoxData(null,null,null,{forceRefresh:true, avoidClosingOpenedDocument:true,avoidScrollToTop:true})
                .then(()=> this.set("_vaadinGridMessagesActiveItem", _.find(_.flatMap(_.get(this,"_cachedMessagesData",[])), {id:_.trim(_.get(currentVaadinGridMessagesActiveItem,"id",""))}))) :
            this._triggerGetEHealthBoxDataForceRefresh()

    }

    _formatRecipientDetailsForSentFolder(inputData) {
        return !_.size(_.get(inputData,"metas",{})) ? "" : _.trim(_.compact([
            _.trim(_.get(inputData,"metas.CM-RecipientLastName","")),
            _.trim(_.get(inputData,"metas.CM-RecipientFirstName","")),
            "(" + _.compact([
                _.trim(_.get(inputData,"metas.CM-RecipientIDType","")),
                _.trim(_.get(inputData,"metas.CM-RecipientID",""))
            ]).join(": ") + ")"
        ]).join(" "))
    }

    _vaadinGridActiveItemChanged(activeItem) {

        const isUnread = !!(_.get(activeItem,"status",0) & (1 << 1))
        const isFullyAssigned = !!(_.get(activeItem,"status",0) & (1 << 26))

        if(activeItem && isUnread) {
            let modifiedMessageCarrier = {}
            this.api.message().modifyMessage(_.merge(activeItem, {status:(_.get(activeItem,"status",0)^(1<<1))}))
                .then(modifiedMessage => this._updateCachedMessagesDataStructure([{action:(!!isFullyAssigned ? "readFullyAssigned" : "read"), message:modifiedMessage}]))
                .then(x=>modifiedMessageCarrier = _.get(x,"message",{}))
                .catch(e=>console.log("ERROR with flag as read: ",e))
                .finally(()=>{
                    this.set("_vaadinGridMessagesActiveItem",modifiedMessageCarrier);
                    this._getEHealthBoxData(null,null,null,{avoidClosingOpenedDocument:true,avoidScrollToTop:true}).then(()=>{
                        this.dispatchEvent(new CustomEvent('selected-message-changed', {detail:{selection:{item: modifiedMessageCarrier}}}))
                        if(isFullyAssigned) setTimeout(()=>{this.dispatchEvent(new CustomEvent('message-moved-to-assigned-folder', {}))},100)
                    });
                })
        }

        if(!activeItem || (activeItem && !isUnread)) this.dispatchEvent(new CustomEvent('selected-message-changed', {detail:{selection:{item: activeItem}}}))

    }

    _gotoPreviousGridPage() {
        if ( parseInt(_.get(this,"_currentPageNumber",1)) > 1 ) this.set( '_currentPageNumber',( parseInt(_.get(this,"_currentPageNumber",2)) - 1 ) )
    }

    _gotoNextGridPage() {
        if ( parseInt(_.get(this,"_currentPageNumber",1)) < parseInt(_.get(this,"_totalPagesForCurrentFolderAndCurrentFilter",1)) ) this.set('_currentPageNumber', ( parseInt(_.get(this,"_currentPageNumber",1)) + 1 ) )
    }

    _openSearch() {
        const searchContainer = this.shadowRoot.querySelector('#searchContainer')
        const searchInputField = this.shadowRoot.querySelector('#searchInputField')
        searchContainer && searchContainer.classList && searchContainer.classList.add('opened')
        setTimeout(()=>{searchInputField.focus();},100)
    }

    _closeSearch(additionalParameters={}) {
        const searchContainer = this.shadowRoot.querySelector('#searchContainer')
        searchContainer && searchContainer.classList && searchContainer.classList.remove('opened')
        this.set("_searchedValue","")
        this.set("_currentPageNumber", 1)
        if(!_.get(additionalParameters,"dontRefreshMessageList",false)) setTimeout(()=>{this._getEHealthBoxData();},100)
    }

    _submitSearchWhenEnterIsPressed(e) {
        return (_.trim(_.get(e,"which")) === "13" || _.trim(_.get(e,"keyCode")) === "13") ? this._getEHealthBoxData() : true
    }

    takeActionForDetailMessage(givenAction,givenMessage,additionalParameters) {

        let prom = Promise.resolve([])

        prom =
            ( !!_.get(additionalParameters,"dontCloseReadMessageComponent",false) ? Promise.resolve() : this._closeReadMessageComponent() )
            .then(() => !_.trim(givenAction) || !_.trim(_.get(givenMessage,"id","")) ?
                Promise.resolve():
                (
                    givenAction === "hideUnhide" ? this._hideUnHideMessages([givenMessage]) :
                    givenAction === "deleteUndelete" ? this._deletedUndeleteMessages([givenMessage]) :
                    givenAction === "deleteForEver" ? this._deleteMessagesForEver([givenMessage]) :
                    (givenAction === "reply" || givenAction === "forward") ? this._replyToOrForwardMessage(givenMessage,additionalParameters,givenAction) :
                    givenAction === "deleteAssignment" ? this._deleteAssignment(givenMessage, additionalParameters) :
                    givenAction === "saveAssignment" ? this._saveAssignment(givenMessage, additionalParameters) :
                    Promise.resolve()
                )
            )

        return prom
            .then(()=>{})
            .catch((e)=>console.log("ERROR with takeActionForDetailMessage: ", e))
            .finally(()=>prom)

    }

    _replyToOrForwardMessage(givenMessage,additionalParameters,replyOrForwardAction) {
        const prom = Promise.resolve([])
        return prom
            .then(()=> !_.trim(_.get(givenMessage,"id","")) ? prom : {
                subject: _.trim(_.get(givenMessage,"subject","")),
                recipientId: _.trim(_.get(givenMessage,"fromHealthcarePartyId",_.trim(_.get(givenMessage,"metas.CM-SenderID","")))),
                recipientType: _.trim(_.get(givenMessage,"metas.CM-SenderIDType","")),
                patientSsin: _.trim(_.get(givenMessage,"metas.patientSsin","")),
                body: _.trim(_.get(_.find(_.get(additionalParameters,"documentsOfMessage",[]),i=>_.trim(_.get(i,"documentLocation"))==="body"),"attachmentInfos.decryptedContent","")),
                originalSender: _.trim(_.get(givenMessage,"fromAddress","")),
                received: this.api.moment(_.get(givenMessage,"created",new Date().getTime())).format('DD/MM/YYYY hh:mm'),
                replyOrForward: _.trim(replyOrForwardAction),
                attachments: _.get(additionalParameters,"_messageAttachments",[])
            })
            .then(eventParameters=>this.dispatchEvent(new CustomEvent("reply-to-or-forward-message", { bubbles:true, composed:true, detail:eventParameters })))
            .catch((e)=>console.log("ERROR with _replyToMessage: ", e))
            .finally(()=>prom)
    }

    _updateCachedMessagesDataStructure(modifiedMessages,allAnnexesAreAssigned=false) {

        const idsOfMessagesToRemove = _.compact(_.map(_.compact(modifiedMessages),i=>_.trim(_.get(i,"message.id",""))))
        let cachedMessagesDataCopy = _.cloneDeep(_.get(this,"_cachedMessagesData",{}))
        let newCachedMessagesData =_.fromPairs(_.map(_.keys(cachedMessagesDataCopy), i=>[i,[]]))

        // Drop from current folder
        _.map(cachedMessagesDataCopy, (messagesOfFolder,cacheFolderName)=> newCachedMessagesData[cacheFolderName] = _.compact(_.remove(messagesOfFolder, i=>idsOfMessagesToRemove.indexOf(_.trim(_.get(i,"id","")))===-1)))

        return this._decryptAndResolvePatientsMetas(_.map(modifiedMessages, m=>m.message))
            .then(modifiedAndResolvedMessages => {

                // Remap as {message,action} object (always the same action)
                modifiedAndResolvedMessages = _.map(_.compact(modifiedAndResolvedMessages),m => { return {message:m, action: _.get(modifiedMessages,"[0].action","")} })

                // Assign to new /same folder
                _.map(modifiedAndResolvedMessages,i=>{
                    const modifyAction = _.trim(_.get(i,"action",""))
                    const singleMessage = _.get(i,"message",{})
                    const messageBox = _.trim(_.get(_.trim(_.get(singleMessage,"transportGuid","")).split(":"),"[0]",""))
                    const isHidden = !!(_.get(singleMessage,"status",0)&(1<<14))
                    const isProcessed = !!(_.get(singleMessage,"status",0)&(1<<26)) && (!(_.get(singleMessage,"status",0) & (1 << 1)))
                    return (
                        modifyAction === "hide" ? newCachedMessagesData.hidden.push(singleMessage) :
                        modifyAction === "unhide" && messageBox === "INBOX" ? newCachedMessagesData.inbox.push(singleMessage) :
                        modifyAction === "unhide" && messageBox === "SENTBOX" ? newCachedMessagesData.sent.push(singleMessage) :
                        modifyAction === "delete" ? newCachedMessagesData.deleted.push(singleMessage) :
                        modifyAction === "undelete" && isHidden ? newCachedMessagesData.hidden.push(singleMessage) :
                        modifyAction === "undelete" && !isHidden && messageBox === "INBOX" && !isProcessed ? newCachedMessagesData.inbox.push(singleMessage) :
                        modifyAction === "undelete" && !isHidden && messageBox === "INBOX" && !!isProcessed ? newCachedMessagesData.assigned.push(singleMessage) :
                        modifyAction === "undelete" && !isHidden && messageBox === "SENTBOX" ? newCachedMessagesData.sent.push(singleMessage) :
                        modifyAction === "deleteAssignment" && _.trim(_.get(this,"menuSelectionObject.selection.folder","inbox")) !== "assigned" ? newCachedMessagesData[_.trim(_.get(this,"menuSelectionObject.selection.folder","inbox"))].push(singleMessage) :
                        modifyAction === "deleteAssignment" && _.trim(_.get(this,"menuSelectionObject.selection.folder","inbox")) === "assigned" ? newCachedMessagesData.inbox.push(singleMessage) :
                        modifyAction === "saveAssignment" && !!allAnnexesAreAssigned ? newCachedMessagesData.assigned.push(singleMessage) :
                        modifyAction === "saveAssignment" && !allAnnexesAreAssigned ? newCachedMessagesData[_.trim(_.get(this,"menuSelectionObject.selection.folder","inbox"))].push(singleMessage) :
                        modifyAction === "readFullyAssigned" ? newCachedMessagesData.assigned.push(singleMessage) :
                        ( modifyAction === "unread" || modifyAction === "read" ) ? newCachedMessagesData[_.trim(_.get(this,"menuSelectionObject.selection.folder","inbox"))].push(singleMessage) :
                        false
                    )
                })

                _.map(newCachedMessagesData, (v,k) => newCachedMessagesData[k] = _.chain(v).compact().orderBy(['created','received'],['desc','desc']).value())
                this.set("_cachedMessagesData", newCachedMessagesData)
                return Promise.resolve(_.head(modifiedAndResolvedMessages))
            })
            .catch(e=>{ console.log("ERROR with _decryptAndResolvePatientsMetas: ",e); return Promise.resolve(); })

    }

    _decryptAndResolvePatientsMetas(givenMessages) {

        this.api.setPreventLogging()

        let prom = Promise.resolve();
        _.map(givenMessages, singleMessage => {
            prom = prom.then(promisesCarrier => !_.trim(_.get(singleMessage,"metas.annexesInfos")) ?
                Promise.resolve(_.concat(promisesCarrier, singleMessage)) :
                this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, singleMessage, this.api.crypto().utils.text2ua(Base64.decode(_.trim(_.get(singleMessage,"metas.annexesInfos")))) )
                    .then(uaDecryptedContent => _.merge({}, singleMessage, {annexesInfos:JSON.parse(this.api.crypto().utils.ua2text(uaDecryptedContent))||[]}))
                    .then(singleMessage => _.concat(promisesCarrier, singleMessage))
                    .catch(e=>{console.log("ERROR with encryptDecryptFileContentByUserHcpIdAndDocumentObject: ",e); return Promise.resolve(_.concat(promisesCarrier, singleMessage))})
            )
        })

        return prom
            .then(messagesWithDecryptedPatientInfos => {
                const patientIds = _.uniq(_.compact(_.flatMap(_.map(messagesWithDecryptedPatientInfos,i=>_.compact(_.map(_.get(i,"annexesInfos",[]),j=>_.get(j,"patientId","")))))))
                return this.api.patient().getPatientsWithUser(this.user, new models.ListOfIdsDto({ids: patientIds}))
                    .then(patientsFromLocalDb => _.map(_.compact(messagesWithDecryptedPatientInfos), singleMessageToEnrichWithPatDetails => {
                        const patsInfos = _.get(singleMessageToEnrichWithPatDetails,"annexesInfos",[])
                        return !_.size(patsInfos) ?
                            singleMessageToEnrichWithPatDetails :
                            _.merge({},singleMessageToEnrichWithPatDetails, {
                                annexesInfos: patsInfos.map( patInfo => {
                                    const patientData = _.find(patientsFromLocalDb, p => _.trim(_.get(patInfo,"patientId","")) === _.trim(_.get(p,"id","")))
                                    const couldResolvePatient = !(!_.trim(_.get(patInfo,"patientId","")) || !_.trim(_.get(patientData,"id","")))
                                    return _.merge({},patInfo,{patientData:
                                        {
                                            id: !!couldResolvePatient ? _.trim(_.get(patientData,"id","")) : "",
                                            uniqueId: !!couldResolvePatient ? _.uniqueId(_.trim(_.get(patientData,"id","")) + "-") : _.uniqueId("patientData-"),
                                            firstName: _.map( ( !!couldResolvePatient ?_.trim(_.get(patientData, "firstName", "")) : _.trim(_.get(patInfo,"docInfo.firstName","")) ).split(" "),i=> _.capitalize(i)).join(" "),
                                            lastName: _.map( ( !!couldResolvePatient ?_.trim(_.get(patientData, "lastName", "")) : _.trim(_.get(patInfo,"docInfo.lastName","")) ).split(" "),i=> _.capitalize(i)).join(" "),
                                            dateOfBirth: !!couldResolvePatient ? _.trim(_.get(patientData,"dateOfBirth","")) : _.trim(_.get(patInfo,"docInfo.dateOfBirth","")),
                                            dateOfBirthHr: !!couldResolvePatient ? (_.parseInt(_.trim(_.get(patientData,"dateOfBirth",""))) ? this.api.formatedMoment(_.parseInt(_.trim(_.get(patientData,"dateOfBirth","")))) : "") : (_.parseInt(_.trim(_.get(patInfo,"docInfo.dateOfBirth",""))) ? this.api.formatedMoment(_.parseInt(_.trim(_.get(patInfo,"docInfo.dateOfBirth","")))) : ""),
                                            ssin: !!couldResolvePatient ? _.trim(_.get(patientData,"ssin","")) : _.trim(_.get(patInfo,"docInfo.ssin","")),
                                            sex: !!couldResolvePatient ? (_.trim(_.get(patientData,"gender","male")).toLowerCase()==="male" ? "M" : "F") : (_.trim(_.get(patInfo,"docInfo.sex","M")).toLowerCase()==="m" ? "M" : "F"),
                                            picture: !!couldResolvePatient ? _.trim(_.get(patientData,"picture","")) : "",
                                            address: !!couldResolvePatient ?
                                               _.chain(_.get(patientData, "addresses", {})).filter({addressType:"home"}).head().value() ||
                                               _.chain(_.get(patientData, "addresses", {})).filter({addressType:"work"}).head().value() ||
                                               _.chain(_.get(patientData, "addresses", {})).head().value() ||
                                               {} : ""
                                        }
                                    })
                                })
                            })
                        })
                    )
                    .catch(e=>{console.log("ERROR with getPatientsWithUser: ", e); return _.compact(messagesWithDecryptedPatientInfos);})

            })
            .then(allMessages=>{
                this.api.setPreventLogging(false)
                return _.map(allMessages, m => { m.uniqueAnnexesInfos = _.uniqBy(_.get(m,"annexesInfos",[]), pi => [ _.get(pi,"patientData.id",""), _.get(pi,"patientId",""), _.get(pi,"docInfo.ssin",""), _.get(pi,"docInfo.dateOfBirth",""), _.get(pi,"docInfo.lastName",""),  _.get(pi,"docInfo.firstName","")].join() ); return m; })
            })

    }

    _getEHealthBoxData(menuSelectionObject, _messageFilterSelectedItem, _currentPageNumber, additionalSettings={}) {

        // patientInfo: [
        //  {
        //     isAssigned: true
        //     patientId: "123456"
        //     protocolId: "123456"
        //     contactId: "123456"
        //     documentId: "123456"
        //     docInfo: {
        //         dateOfBirth: 19841002
        //         firstName: _"xxx",
        //         lastName: "xxx",
        //         sex: "M/F"
        //         ssin: "84100212104"
        //     }
        //  },
        //  ...
        // ]

        // Not ready yet, wait for assignResolvedObjects - upon filter change value is set to null before being set to something
        if(!_.size(_.get(this,"currentHcp",{})) || _.get(this,"_messageFilterSelectedItem",null) === null) return;

        const promResolve = Promise.resolve()
        const cacheTTL = (10**3)*3600 // Long TTL on purpose, ehboxWebWorker will force refresh (when new message hits inbox / sentbox)
        const eHealthBoxType = _.trim(_.get(this,"menuSelectionObject.selection.item","personalInbox"))
        const eHealthBoxCurrentFolder = _.trim(_.get(this,"menuSelectionObject.selection.folder","inbox"))
        const eHealthBoxLastFolder = _.trim(_.get(this,"_eHealthBoxLastFolder","inbox"))
        const selectedMessagesFilter = _.get(this,"_messageFilterSelectedItem.dataset.filter","")
        const messageFilterLastSelectedItem = _.trim(_.get(this,"_messageFilterLastSelectedItem",""))
        const shouldRefreshData = !!_.get(additionalSettings,"forceRefresh",false) || !!(parseInt(_.get(this,"_getEHealthBoxDataLastRefreshTstamp",0)) < (+new Date() - cacheTTL))
        const currentPageNumber = parseInt(_.get(this,"_currentPageNumber",1))
        this.set("_eHealthBoxLastFolder", eHealthBoxCurrentFolder);
        this.set("_messageFilterLastSelectedItem", selectedMessagesFilter);

        if(eHealthBoxCurrentFolder !== eHealthBoxLastFolder) {
            if (parseInt(currentPageNumber) > 1) this.set("_currentPageNumber", 1);
            this._closeSearch({dontRefreshMessageList:true});
            if (_.trim(selectedMessagesFilter)) this._resetMessagesFilters();
            if (parseInt(currentPageNumber) > 1 || _.trim(selectedMessagesFilter)) return;
        }

        if(selectedMessagesFilter !== messageFilterLastSelectedItem && parseInt(currentPageNumber) > 1 ) { this.set("_currentPageNumber", 1); return; }

        if(!_.get(additionalSettings,"avoidClosingOpenedDocument",false)) this._closeReadMessageComponent()
        this._toggleProcessingPopup(this.localize('ehb.gettingMessages',this.language));

        const promiseResolver = !shouldRefreshData ?
            promResolve :
            Promise.all(_.map(["INBOX:*","SENTBOX:*","BININBOX:*","BINSENTBOX:*"], singleTransportGuid => this.api.message().findMessagesByTransportGuid(_.trim(singleTransportGuid), null, null, null, 5000).then(messages=>messages.rows).catch(()=>Promise.resolve())))
                .then(promisesResults => _
                    .chain(promisesResults)
                    .flatMap()
                    .uniqBy('id')
                    .filter(msg=>_.trim(_.get(msg,"responsible","")) === (eHealthBoxType==="personalInbox" ? _.trim(_.get(this,"user.healthcarePartyId","")) : _.trim(_.get(this,"parentHcp.id","")))) // "My messages" or the ones of my "Medical House"
                    .orderBy(['created','received'],['desc','desc'])
                    .value()
                )
                .then(foundMessages => {

                    this.set("_getEHealthBoxDataLastRefreshTstamp",( _.size(foundMessages) ? +new Date() : 0 ))
                    Object.keys(this._cachedMessagesData).forEach(k => this._cachedMessagesData[k] = [] )

                    return this._decryptAndResolvePatientsMetas(foundMessages)
                        .then(messagesWithEnrichedPatientInfos => {
                            _.compact(messagesWithEnrichedPatientInfos).map(singleMessageWithEnrichedPatientInfos => {
                                const messageBox = _.trim(_.get(_.trim(_.get(singleMessageWithEnrichedPatientInfos,"transportGuid","")).split(":"),"[0]",""))
                                const isHidden = !!(_.get(singleMessageWithEnrichedPatientInfos,"status",0)&(1<<14))
                                const isProcessed = !!(_.get(singleMessageWithEnrichedPatientInfos,"status",0)&(1<<26)) && (!(_.get(singleMessageWithEnrichedPatientInfos,"status",0) & (1 << 1)))    // Processed AND unread (otherwise remains under inbox - could have been fully assigned by webworker but not seen by user yet)
                                return (
                                    !!isProcessed ? this.push("_cachedMessagesData.assigned", singleMessageWithEnrichedPatientInfos) :
                                    messageBox === "INBOX" && !isHidden ? this.push("_cachedMessagesData.inbox", singleMessageWithEnrichedPatientInfos) :
                                    messageBox === "SENTBOX" && !isHidden ? this.push("_cachedMessagesData.sent", singleMessageWithEnrichedPatientInfos) :
                                    messageBox === "BININBOX" && !isHidden ? this.push("_cachedMessagesData.deleted", singleMessageWithEnrichedPatientInfos):
                                    messageBox === "BINSENTBOX" && !isHidden ? this.push("_cachedMessagesData.deleted", singleMessageWithEnrichedPatientInfos) :
                                    this.push("_cachedMessagesData.hidden", singleMessageWithEnrichedPatientInfos)
                                )
                            })
                        })

                })
                .then(()=>this._getBoxCapacity())

        return promiseResolver
            .then(() => {

                this.dispatchEvent(new CustomEvent('update-menu-folders-totals', { bubbles:true, composed:true, detail:_.fromPairs(_.map(_.get(this,"_cachedMessagesData",{}), (v,k)=>[k, _.size(v)])) }));

                const messageKeysToSearchOn = ["id", "fromAddress", "subject", "fromHealthcarePartyId", "metas.CM-AuthorID", "metas.CM-AuthorFirstName", "metas.CM-AuthorLastName","metas.patientSsin"]
                const annexeKeysToSearchOn = ["docInfo.dateOfBirth","docInfo.firstName","docInfo.lastName","docInfo.ssin", "docInfo.protocolId", "docInfo.labo","patientData.dateOfBirth","patientData.firstName","patientData.lastName","patientData.ssin"]

                const messagesDataForCurrentFolderAndCurrentFilter = _
                    .chain(_.get(this,"_cachedMessagesData." + eHealthBoxCurrentFolder, []))
                    .uniqBy('id')
                    .filter(msg=>{
                        const isLabResult = !!((_.get(msg,"status",0) & (1 << 0)) || !!_.size(_.get(msg,"assignedResults",[])) || !!_.size(_.get(msg,"unassignedResults",[])) || (!!_.size(_.get(msg,"annexesInfos",[])) && !!_.size(_.get(msg,"annexesInfos",[]).filter(ai=>!!_.size(_.get(ai,"docInfo",{}))))))
                        return !_.trim(selectedMessagesFilter) ? msg :
                            _.trim(selectedMessagesFilter) === "read" ? !(_.get(msg,"status",0) & (1 << 1)) :
                            _.trim(selectedMessagesFilter) === "unread" ? !!(_.get(msg,"status",0) & (1 << 1)) :
                            _.trim(selectedMessagesFilter) === "withAttachment" ? !!(_.get(msg,"status",0) & (1 << 4)) :
                            _.trim(selectedMessagesFilter) === "withoutAttachment" ? !(_.get(msg,"status",0) & (1 << 4)) :
                            _.trim(selectedMessagesFilter) === "important" ? !!(_.get(msg,"status",0) & (1 << 2)) :
                            _.trim(selectedMessagesFilter) === "notImportant" ? !(_.get(msg,"status",0) & (1 << 2)) :
                            _.trim(selectedMessagesFilter) === "assignedResults" ? (!!isLabResult && (!!_.some(_.get(msg,"annexesInfos",[]), {isAssigned:true}) || !!_.size(_.get(msg,"assignedResults",[])))) :
                            _.trim(selectedMessagesFilter) === "unassignedResults" ? (!!isLabResult && (!!_.some(_.get(msg,"annexesInfos",[]), {isAssigned:false}) || !!_.size(_.get(msg,"unassignedResults",[])))) :
                            _.trim(selectedMessagesFilter) === "labResults" ? !!isLabResult :
                            _.trim(selectedMessagesFilter) === "allButLabResults" ? !isLabResult :
                            false
                    })
                    .filter(msg=>{
                        const valuesToSearchOn = _.uniq(_.compact(_.concat(
                            _.map(messageKeysToSearchOn,sk=>_.trim(_.get(msg,sk,"")).toLowerCase()),
                            _.flatMap(_.map(_.get(msg,"annexesInfos",[]), ai=>_.map(annexeKeysToSearchOn,sk=>_.trim(_.get(ai,sk,"")).toLowerCase())))
                        )))
                        return !_.trim(_.get(this,"_searchedValue","")) ? true : !!_.size(_.compact(_.map(valuesToSearchOn, vtso => vtso.includes(_.trim(_.get(this,"_searchedValue","")).toLowerCase()))))
                    })
                    .orderBy(['created','received'],['desc','desc'])
                    .value()

                this._clearGridCache()
                this._resetGridSelectedItems()
                this.set('pageStart', parseInt(((currentPageNumber-1)||0) * parseInt(this._vaadinGridMaxItemsPerPage)) )
                this.set('pageEnd', parseInt(((currentPageNumber)||1) * parseInt(this._vaadinGridMaxItemsPerPage)) )
                this.set('_totalMessagesForCurrentFolderAndCurrentFilter', _.size(messagesDataForCurrentFolderAndCurrentFilter))
                this.set('_totalPagesForCurrentFolderAndCurrentFilter', Math.ceil(_.get(this,"_totalMessagesForCurrentFolderAndCurrentFilter",0) / parseInt(this._vaadinGridMaxItemsPerPage)))
                this.set("_vaadinGridDataToShow", messagesDataForCurrentFolderAndCurrentFilter.slice(parseInt(_.get(this,"pageStart",0)), parseInt(_.get(this,"pageEnd",0))))

            })
            .catch(e=>{ setTimeout(()=>{ console.log("ERROR with _getEHealthBoxData: ", e); this.set("_bodyOverlay", true); this.$["errorGettingEHealthBoxMessages"].open(); },200); return Promise.resolve(); })
            .finally(()=>{
                this._triggerGridResize()
                if(!_.get(additionalSettings,"avoidScrollToTop",false)) this._scrollToTop()
                this._toggleProcessingPopup()
                return Promise.resolve()
            })

    }

    _deleteAssignment(givenMessage, additionalParameters) {

        const promResolve = Promise.resolve()
        const contactIdToDelete = _.trim(_.get(additionalParameters,"contactId",""))
        const updatedAnnexesInfos = _.compact(_.map( _.get(givenMessage,"annexesInfos",[]), ai=> (_.trim(_.get(ai,"contactId","")) === contactIdToDelete ? _.merge({},ai,{isAssigned:false,contactId:"",patientId:""}) : ai))).map(ai=>_.omit(ai,"patientData"))

        return this.api.contact().getContactWithUser(_.get(this,"user",{}), _.trim(contactIdToDelete))
            .then(foundContact => { _.map(foundContact.services||[], s=>s.endOfLife = +new Date()); return _.merge({}, foundContact, {deletionDate: parseInt(moment().format('YYYYMMDDHHmmss'))}) })
            .then(contactToDelete => this.api.form().getForm(_.trim(_.get(contactToDelete, "subContacts[0].formId","")))
                .then(foundForm => [contactToDelete, _.merge({}, foundForm, {deletionDate:parseInt(moment().format('YYYYMMDDHHmmss'))})])
                .catch(e=>{ console.log("ERROR with getForm: ",e); return Promise.resolve([contactToDelete,{}]); })
            )
            .then(([contactToDelete,formToDelete]) => Promise.all([
                this.api.contact().modifyContactWithUser(_.get(this,"user",{}), contactToDelete).catch(e=>{ console.log("ERROR with modifyContactWithUser: ", e); return promResolve; }),
                this.api.form().modifyForm(formToDelete).catch(e=>{ console.log("ERROR with modifyForm: ", e); return promResolve; })
            ]))
            .then(() => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject( "encrypt", _.get(this,"user",{}), givenMessage, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(JSON.stringify(updatedAnnexesInfos))))
                .then(encryptedContent => _.merge({},givenMessage, {metas:{annexesInfos:Base64.encode(String.fromCharCode.apply(null, new Uint8Array(encryptedContent)))}}))
                .then(givenMessageWithCryptedMetasPatientInfos => {

                    const messageStatus = _.get(givenMessageWithCryptedMetasPatientInfos,"status",0)
                    const isToBeDeletedOnserver = parseInt(messageStatus & (1<<20))
                    const isProcessed = parseInt(messageStatus & (1<<26))

                    let messageNewStatus = !!isToBeDeletedOnserver ? (messageStatus ^ (1<<20)) : messageStatus
                    messageNewStatus = !!isProcessed ? (messageNewStatus ^ (1<<26)) : messageNewStatus

                    // Drop statuses "STATUS_SHOULD_BE_DELETED_ON_SERVER" && "STATUS_TRAITED" as we just deleted an assignment
                    return this.api.message().modifyMessage(_.merge({}, givenMessageWithCryptedMetasPatientInfos, { status: messageNewStatus }))

                })
                .then(modifiedMessage => this._updateCachedMessagesDataStructure([{action:"deleteAssignment", message:modifiedMessage}])
                    .then(() => this._getEHealthBoxData(null,null,null,{avoidClosingOpenedDocument:true,avoidScrollToTop:true}))
                    .then(()=> this.set("_vaadinGridMessagesActiveItem", _.find(_.flatMap(_.get(this,"_cachedMessagesData",[])), {id:_.trim(_.get(modifiedMessage,"id",""))})))
                )
                .catch(e=>{ console.log(e); return promResolve; })
            )
            .then(() => this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true})))
            .catch(e=>{ console.log(e); return promResolve; })
            .finally(()=>promResolve)

    }

    _deleteMessagesForEver(givenMessages=null) {

        // No eHealthBox ?
        if (!_.get(this,"ehealthSession",false)) { this.set("_bodyOverlay", true); this.$["notConnctedToeHealthBox"].open(); return Promise.resolve(); }

        let selectedMessages = _.size(givenMessages) && !( givenMessages instanceof Event) ? givenMessages : this._getGridSelectedItems()
        if(!_.size(selectedMessages)) return Promise.resolve()

        this._closeDialogs();
        this._toggleProcessingPopup()

        let prom = Promise.resolve([]);
        selectedMessages.map(singleSelectedMessage => {
            prom = prom.then(promisesCarrier => {
                const sourceBox = _.trim(_.get(_.trim(_.get(singleSelectedMessage,"transportGuid","")).split(':'), "[0]", ""))
                const eHealthBoxMessageId = _.trim(_.get(_.trim(_.get(singleSelectedMessage,"transportGuid","")).split(':'), "[1]", ""))
                const action = "deleteForEver"
                return !eHealthBoxMessageId || !sourceBox || !_.get(this,"api.keystoreId",false) || !_.get(this,"api.tokenId",false) || !_.get(this,"api.credentials.ehpassword",false) ?
                    false :
                    this.api.fhc().Ehboxcontroller().deleteMessagesUsingPOST(this.api.keystoreId, _.get(this,"api.tokenId"), this.api.credentials.ehpassword, [eHealthBoxMessageId], sourceBox).catch(e=>{})
                        .then(()=> this.api.message().deleteMessages(_.trim(_.get(singleSelectedMessage,"id",""))).then(deletetionResult=>_.concat(promisesCarrier, {action:action, message:singleSelectedMessage, success:!!deletetionResult})).catch(e=>{console.log("ERROR with deleteMessages: ", e); return Promise.resolve();}))
                        .catch(()=>_.concat(promisesCarrier, {action:action, message:singleSelectedMessage, success:false}))
            })
        })

        return prom
            .then(promisesCarrier => {
                const failedExecutions = _.map(_.compact(_.filter(promisesCarrier, i=>!_.get(i,"success",false))),i=>_.get(i,"message",{}))
                const successfulExecutions = _.compact(_.filter(promisesCarrier, i=>!!_.get(i,"success",false)))
                if(_.size(failedExecutions)) {
                    setTimeout(()=>{
                        this.set("_bodyOverlay", true);
                        this.$["errorWithEHealthBoxProcessing"].open();
                        this.set("_eHealthBoxProcessErrorMessages", failedExecutions);
                        this.shadowRoot.querySelector('#eHealthBoxProcessErrorMessageDomRepeat') && this.shadowRoot.querySelector('#eHealthBoxProcessErrorMessageDomRepeat').render()
                    },200)
                }
                return this._updateCachedMessagesDataStructure(successfulExecutions).then(()=>this._getBoxCapacity())
            })
            .catch(e=>console.log("ERROR with _deleteMessagesForEver: ",e))
            .finally(()=>{
                this._toggleProcessingPopup();
                this._getEHealthBoxData();
                return Promise.resolve()
            })

    }

    _userDialogAcknowledgementsPropertiesChanged(confirmationDialogAcknowledgementsProperties) {

        const propertyName = _.trim(_.get(_.trim(_.get(confirmationDialogAcknowledgementsProperties,"path",[])).split("."), "[1]",""))

        return !_.trim(propertyName) ? null : Promise.resolve()
            .then(() => this.api._setUserConfirmationDialogAcknowledgements(_.get(this,"user",{}), this._confirmationDialogAcknowledgementsProperties))
            .then(updatedUser => { this.set("_locked", true); this.set("user",updatedUser); setTimeout(()=>{this.set("_locked", false)},100); this.dispatchEvent(new CustomEvent('user-got-updated', {composed: true, bubbles: true, detail: {updatedUser:updatedUser}})) })

    }

    _confirmDeleteMessagesForEver() {

        const promResolve = Promise.resolve()

        return this.api._getUserConfirmationDialogAcknowledgements(_.get(this,"user",{}))
            .then(userConfirmationDialogAcknowledgements => this.set("_confirmationDialogAcknowledgementsProperties", userConfirmationDialogAcknowledgements))
            .then(() => !!_.get(this,"_confirmationDialogAcknowledgementsProperties.confirmPermanentDeletionDialog", false) ?
                this._deleteMessagesForEver() :
                promResolve.then(() => !_.size(this._getGridSelectedItems()) ? promResolve : promResolve.then(()=>{ this.set("_bodyOverlay", true); return this.$["confirmPermanentDeletionDialog"].open() }))
            )

    }

    _doUpdateUser(updatedUser) {

        this.set("_locked", true);
        this.set("user",updatedUser);
        setTimeout(()=>{this.set("_locked", false)},100)

    }

    _saveAssignment(givenMessage, additionalParameters) {

        const promResolve = Promise.resolve()
        const documentId = _.trim(_.get(additionalParameters,"documentId",""))
        const patientId = _.trim(_.get(additionalParameters,"patientId",""))
        const documentType = _.trim(_.get(additionalParameters,"documentType",""))
        const documentTypeLabel = _.trim(_.get(additionalParameters,"documentTypeLabel","Analyse"))
        const documentToAssign = _.find(_.get(additionalParameters,"documentsOfMessage",[]), {id:documentId})
        const isLabResult = !!_.size(_.get(documentToAssign,"docInfo",[]))
        const annexesInfosAlreadyExist = !!_.size(_.get(givenMessage,"annexesInfos",[]))
        const totalAnnexes = parseInt(_.size(_.filter(additionalParameters.documentsOfMessage,dom=>_.trim(_.get(dom,"documentLocation","body")) !== "body" )))
        const totalAssignedAnnexes = (parseInt(_.size(_.filter(_.get(givenMessage,"annexesInfos",[]),ai=>!!_.get(ai,"isAssigned",false))))) + 1 // "+1" as we are assigning now

        // const documentToAssignDemandDate = !!((parseInt(_.get(documentToAssign,"docInfo[0].demandDate",0))||0) > 1546300800000) ? parseInt(_.get(documentToAssign,"docInfo[0].demandDate",undefined)) : parseInt(_.get(givenMessage,"created",undefined))
        const documentToAssignDemandDate = !!((parseInt(_.get(documentToAssign,"docInfo[0].demandDate",0))||0)) ? parseInt(_.get(documentToAssign,"docInfo[0].demandDate",0)) : parseInt(_.get(givenMessage,"created",undefined))

        const importDescription = /* _.trim(documentTypeLabel) + ": " + */ (!!_.trim(_.get(documentToAssign,"docInfo[0].labo","")) ? _.trim(_.get(documentToAssign,"docInfo[0].labo","")) : _.trim(_.get(givenMessage,"subject")) ) + ( !!_.trim(_.get(documentToAssign,"docInfo[0].protocol","")) ? " (Protocole #" + _.trim(_.get(documentToAssign,"docInfo[0].protocol","")) + ")" : " " )
        let annexInfosToUpdate = !annexesInfosAlreadyExist ? false : _.find(_.get(givenMessage,"annexesInfos",[]), {documentId:documentId})

        return (!documentId || !patientId || !_.size(documentToAssign)) ?
            promResolve : this.api.patient().getPatientWithUser(this.user,patientId)
            .then(patientObject => {
                this.api.accesslog().newInstance(this.user,patientObject,{}).then(log =>{
                    log.detail="Save Assignment in Message panel"
                    this.api.accesslog().createAccessLogWithUser(this.user,log)
                })
                let contactObjectForInstance = {
                    //groupId: _.trim(_.get(givenMessage,"id","")),
                    groupId: this.api.crypto().randomUuid(),
                    created: +new Date,
                    modified: +new Date,
                    author: _.trim(_.get(this,"user.id","")),
                    responsible: _.trim(_.get(this,"user.healthcarePartyId","")),
                    openingDate: parseInt(moment(documentToAssignDemandDate).format('YYYYMMDDHHmmss')),
                    closingDate: parseInt(moment(documentToAssignDemandDate).format('YYYYMMDDHHmmss')),
                    encounterType: { type: "CD-TRANSACTION", version: "1", code: documentType },
                    descr: importDescription,
                    tags: [
                        { type: 'CD-TRANSACTION', code: documentType },
                        { type: "originalEhBoxDocumentId", id: documentId },
                        { type: "originalEhBoxMessageId", id: _.trim(_.get(givenMessage,"id","")) }
                    ],
                    subContacts: []
                }
                if(!isLabResult) contactObjectForInstance.descr = /* (_.trim(documentTypeLabel) ? _.trim(documentTypeLabel) : "Annexe") + ": " + */ _.trim(_.get(documentToAssign,"name",""))
                return this.api.contact().newInstance(this.user, patientObject, contactObjectForInstance).then(contactInstance => [contactInstance,patientObject])
            })
            .then(([contactInstance,patientObject]) => {

                if(isLabResult) {
                    // contactInstance.services.push({
                    //     id: this.api.crypto().randomUuid(),
                    //     label: documentTypeLabel,
                    //     valueDate: parseInt(moment().format('YYYYMMDDHHmmss')),
                    //     content: _.fromPairs([[this.language, {stringValue: _.trim(_.get(documentToAssign,"docInfo[0].labo",""))}]])
                    // })
                } else {
                    const svc = this.api.contact().service().newInstance( this.user, {
                        content: _.fromPairs([[this.language, {documentId: documentId,
                        stringValue: _.trim(_.get(documentToAssign,"name",""))}]]),
                        label: /* (_.trim(documentTypeLabel) ? _.trim(documentTypeLabel) : "Annexe") + ": " + */ _.trim(_.get(documentToAssign,"name","")),
                        tags: [
                            { type: 'CD-TRANSACTION', code: documentType },
                            { type: "originalEhBoxDocumentId", id: documentId },
                            { type: "originalEhBoxMessageId", id: _.trim(_.get(givenMessage,"id","")) }
                        ],
                    })
                    contactInstance.services = [svc]
                    contactInstance.subContacts.push({
                        status: 64,
                        services: [{serviceId: svc.id}],
                        tags: [
                            { type: 'CD-TRANSACTION', code: documentType },
                            { type: "originalEhBoxDocumentId", id: documentId },
                            { type: "originalEhBoxMessageId", id: _.trim(_.get(givenMessage,"id","")) }
                        ],
                    })
                }

                return this.api.contact().createContactWithUser(this.user, contactInstance)
                    .then(createdContact => [createdContact,patientObject])

            })
            .then(([createdContact,patientObject]) => !isLabResult ? createdContact :
                this.api.form().newInstance(this.user, patientObject, {contactId: _.trim(_.get(createdContact,"id","")), descr: importDescription})
                    .then(formInstance => this.api.form().createForm(formInstance))
                    .then(createdForm => this.api.crypto().extractKeysFromDelegationsForHcpHierarchy( _.trim(_.get(this,"user.healthcarePartyId","")), _.trim(_.get(documentToAssign,"id","")), _.size(_.get(documentToAssign,"encryptionKeys",{})) ? _.get(documentToAssign,"encryptionKeys",{}) : _.get(documentToAssign,"delegations",{}))
                        .then(({extractedKeys: enckeys}) => this.api.beresultimport().doImport( _.trim(_.get(documentToAssign,"id","")), _.trim(_.get(this,"user.healthcarePartyId","")), this.language, _.trim(_.get(documentToAssign,"docInfo[0].protocol","")), _.trim(_.get(createdForm,"id","")), null, enckeys.join(','), createdContact).catch(e=>{console.log("ERROR with doImport: ", e); return Promise.resolve(createdContact);}))
                        .catch(e=>{console.log("ERROR with extractKeysFromDelegationsForHcpHierarchy: ", e); return Promise.resolve(createdContact);})
                    )
                    .then(updatedContactAfterImport => !_.trim(_.get(updatedContactAfterImport, "id","")) ? createdContact : this.api.contact().modifyContactWithUser(this.user, _.merge({},updatedContactAfterImport,{ subContacts: [{
                        tags:[
                            { type: 'CD-TRANSACTION', code: documentType },
                            { type: "originalEhBoxDocumentId", id: documentId },
                            { type: "originalEhBoxMessageId", id: _.trim(_.get(givenMessage,"id","")) }
                        ],
                        descr: (!!_.trim(_.get(updatedContactAfterImport, "subContacts[0].descr")) ? _.trim(_.get(updatedContactAfterImport, "subContacts[0].descr")) : _.trim(_.get(givenMessage,"subject")))
                    }]})))
                    .catch(e =>{ console.log("ERROR with createForm: ", e); return Promise.resolve(createdContact); })
            )
            .then(createdContact => {

                const updatedAnnexInfosForDocumentToAssign = {
                    isAssigned: true,
                    patientId: patientId,
                    protocolId: ( !!_.size(annexInfosToUpdate) ? _.trim(_.get(annexInfosToUpdate,"protocolId","")) : _.trim(_.get(documentToAssign,"docInfo[0].protocol","")) ),
                    contactId: _.trim(_.get(createdContact,"id","")),
                    documentId: documentId,
                    docInfo: {
                        dateOfBirth: ( !!_.size(annexInfosToUpdate) ? _.trim(_.get(annexInfosToUpdate,"docInfo.dateOfBirth","")) : _.trim(_.get(documentToAssign,"docInfo[0].dateOfBirth","")) ),
                        firstName: ( !!_.size(annexInfosToUpdate) ? _.trim(_.get(annexInfosToUpdate,"docInfo.firstName","")) : _.trim(_.get(documentToAssign,"docInfo[0].firstName","")) ),
                        lastName: ( !!_.size(annexInfosToUpdate) ? _.trim(_.get(annexInfosToUpdate,"docInfo.lastName","")) : _.trim(_.get(documentToAssign,"docInfo[0].lastName","")) ),
                        sex: ( !!_.size(annexInfosToUpdate) ? _.trim(_.get(annexInfosToUpdate,"docInfo.sex","")) : _.trim(_.get(documentToAssign,"docInfo[0].sex","")) ),
                        ssin: ( !!_.size(annexInfosToUpdate) ? _.trim(_.get(annexInfosToUpdate,"docInfo.ssin","")) : _.trim(_.get(documentToAssign,"docInfo[0].ssin","")) )
                    }
                }

                return !annexesInfosAlreadyExist ?
                    [updatedAnnexInfosForDocumentToAssign] :
                    !!_.size(annexInfosToUpdate) ?
                        _.compact(_.map( _.get(givenMessage,"annexesInfos",[]), ai=> (_.trim(_.get(ai,"documentId","")) === _.trim(_.get(annexInfosToUpdate,"documentId","")) ? updatedAnnexInfosForDocumentToAssign : ai))) :
                        _.concat(givenMessage.annexesInfos, updatedAnnexInfosForDocumentToAssign)

            })
            .then(updatedAnnexesInfos => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject( "encrypt", _.get(this,"user",{}), givenMessage, this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(JSON.stringify(updatedAnnexesInfos.map(ai=>_.omit(ai,"patientData"))))))
                .then(encryptedContent => _.merge({},givenMessage, {metas:{annexesInfos:Base64.encode(String.fromCharCode.apply(null, new Uint8Array(encryptedContent)))}}))
                .then(givenMessageWithCryptedMetasPatientInfos => this.api.message().modifyMessage( (totalAnnexes && totalAssignedAnnexes===totalAnnexes) ? _.merge({}, givenMessageWithCryptedMetasPatientInfos, { status: (_.get(givenMessageWithCryptedMetasPatientInfos,"status",0) |(1<<20) ) |(1<<26) }) : givenMessageWithCryptedMetasPatientInfos ))    // Everything assigned, flag as "STATUS_SHOULD_BE_DELETED_ON_SERVER" && "STATUS_TRAITED"
                .then(modifiedMessage => this._updateCachedMessagesDataStructure([{action:"saveAssignment", message:modifiedMessage}],!!(totalAnnexes && totalAssignedAnnexes===totalAnnexes))
                    .then(() => this._getEHealthBoxData(null,null,null,{avoidClosingOpenedDocument:true,avoidScrollToTop:true}))
                    .then(()=> this.set("_vaadinGridMessagesActiveItem", _.find(_.flatMap(_.get(this,"_cachedMessagesData",[])), {id:_.trim(_.get(modifiedMessage,"id",""))})))
                )
            )
            .then(() => this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true})))
            .catch(e=>{ console.log(e); return promResolve; })
            .finally(()=>promResolve)

    }

}

customElements.define(HtMsgList.is, HtMsgList);
