/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import './styles/app-theme.js';
import './styles/atc-styles';
import './styles/buttons-style';
import './styles/dialog-style';
import './styles/dropdown-style';
import './styles/icd-styles';
import './styles/icpc-styles';
import './styles/notification-style';
import './styles/paper-input-style';
import './styles/paper-tabs-style';
import './styles/scrollbar-style';
import './styles/shared-styles';
import './styles/spinner-style';
import './styles/table-style';
import './styles/tk-token-field-style';
import './styles/vaadin-icure-theme';

import "@polymer/app-layout/app-drawer-layout/app-drawer-layout"
import "@polymer/app-layout/app-header/app-header"
import "@polymer/app-layout/app-header-layout/app-header-layout"
import "@polymer/app-layout/app-toolbar/app-toolbar"
import "@polymer/app-route/app-location"
import "@polymer/app-route/app-route"

import './elements/ht-app/ht-app-entities-selector'
import './elements/ht-app/ht-app-first-login-dialog'
import './elements/ht-app/ht-app-login-dialog'
import './elements/ht-app/ht-app-register-keypair-dialog'
import './elements/ht-app/ht-app-setup-prompt'
import './elements/ht-app/ht-app-welcome';
import './elements/ht-spinner/ht-spinner'
import './elements/ht-tools/ht-access-log'
import './elements/ht-tools/ht-export-key'
import './elements/ht-tools/ht-import-keychain'
import './elements/ht-tools/ht-my-profile'
import './elements/icc-api/icc-api';
import './elements/icons/icure-icons';
import './elements/menu-bar/menu-bar';
import './elements/splash-screen/splash-screen'
import './elements/tk-localizer';
import './ht-view404'
import './ht-update-dialog'

import "@polymer/iron-icon/iron-icon"
import "@polymer/iron-icons/iron-icons"
import "@polymer/iron-icons/av-icons"
import "@polymer/iron-icons/communication-icons"
import "@polymer/iron-icons/device-icons"
import "@polymer/iron-icons/editor-icons"
import "@polymer/iron-icons/hardware-icons"
import "@polymer/iron-icons/image-icons"
import "@polymer/iron-icons/maps-icons"
import "@polymer/iron-icons/notification-icons"
import "@polymer/iron-icons/places-icons"
import "@polymer/iron-icons/social-icons"

import "@polymer/iron-pages/iron-pages"
import "@polymer/iron-collapse/iron-collapse"

import "@polymer/paper-button/paper-button"
import "@polymer/paper-card/paper-card"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-icon-button/paper-icon-button"
import "@polymer/paper-input/paper-input"
import "@polymer/paper-item/paper-item"
import "@polymer/paper-listbox/paper-listbox"
import "@polymer/paper-menu-button/paper-menu-button"
import "@polymer/paper-tabs/paper-tab"
import "@polymer/paper-tooltip/paper-tooltip"
import "@polymer/paper-fab/paper-fab"
import "@polymer/paper-dropdown-menu/paper-dropdown-menu"
import "@polymer/paper-listbox/paper-listbox"
import "@polymer/paper-checkbox/paper-checkbox"
import "@polymer/paper-toolbar/paper-toolbar"

import "@vaadin/vaadin-material-styles/all-imports"
import "@vaadin/vaadin-icons/vaadin-icons"
import "@vaadin/vaadin-date-picker/vaadin-date-picker"
import "@vaadin/vaadin-checkbox/vaadin-checkbox"
import "@vaadin/vaadin-progress-bar/vaadin-progress-bar"
import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-tabs/vaadin-tabs"
import "@vaadin/vaadin-upload/vaadin-upload"
import "@vaadin/vaadin-text-field/vaadin-text-field"
import "@vaadin/vaadin-grid/vaadin-grid"
import "@vaadin/vaadin-grid/vaadin-grid-column"
import "@vaadin/vaadin-grid/vaadin-grid-sorter"
import "@vaadin/vaadin-grid/vaadin-grid-column-group"
import "@vaadin/vaadin-grid/vaadin-grid-filter-column"
import "@vaadin/vaadin-grid/vaadin-grid-tree-column"
import "@vaadin/vaadin-grid/vaadin-grid-tree-toggle"

import moment from 'moment/src/moment'
import Worker from 'worker-loader!./workers/ehboxWebworker.js'
const runtime = require('offline-plugin/runtime');
import _ from 'lodash/lodash';
import io from 'socket.io-client';
import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "./elements/tk-localizer";

class HtApp extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="shared-styles dialog-style notification-style buttons-style">
            :host {
                display: block;
            }

            app-header {
                color: var(--app-text-color-light);
                background-color: var(--app-primary-color-dark);
                height: 64px;
                @apply --shadow-elevation-4dp;
            }

            app-header paper-icon-button {
                --paper-icon-button-ink-color: white;
            }

            app-toolbar {
                padding-right: 0;
                height: 64px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: stretch;

            }

            :host iron-pages {
                height: calc(100% - 64px);
            }

            :host app-header-layout {
                height: 100%;
            }

            iron-icon {
                max-height: 20px;
                width: 20px;
                margin-right: 8px;
                color: rgba(255, 255, 255, 0.5);
            }

            iron-icon.smaller {
                height: 16px !important;
                width: 16px !important;
            }

            .icure-logo {
                height: 64px;
                margin-right: 24px;
            }



            paper-menu-button {
                --paper-menu-button-content: {
                    width: 380px;
                };
                --paper-menu-button-dropdown: {
                    padding: 0;
                }
            }

            .extra-menu {
                padding: 0;
            }

            .extra-menu-item {
                cursor: pointer;
                --paper-item-focused: {
                    background: white;
                }
            }

            .extra-menu-item:hover{
                background-color: var(--app-background-color-dark);
            }

            .extra-menu-item:last-child, .extra-menu-item:nth-last-child(2) {
                border-top: 1px solid var(--app-background-color-dark);
            }

            .extra-menu-item iron-icon {
                color: var(--app-text-color-disabled);
            }

            paper-tabs {
                --paper-tabs-selection-bar-color: var(--app-secondary-color);
                height: 64px;
            }

            paper-tab {
                --paper-tab-ink: var(--app-secondary-color);
            }

            paper-tab:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            paper-tab.iron-selected {
                font-weight: bold;
            }

            paper-tab.iron-selected > iron-icon {
                color: var(--app-secondary-color);
            }

            .mobile-menu-btn {
                align-self: center;
                display: none;
            }

            .mobile-menu {
                position: fixed;
                top: 64px;
                left: 0;
                bottom: 0;
                background: var(--app-light-color);
                overflow: hidden;
                width: 180px;
                transform: translateX(-180px); /* 180 = menu-width */
                transition: .24s cubic-bezier(0.4, 0.0, 0.2, 1);
                visibility: hidden;
                @apply --shadow-elevation-6dp;
                padding: 0 1em;
                height: calc(100vh - 84px); /* 84px = app-header height and log */
                overflow-y: auto;
            }

            .mobile-menu.open {
                visibility: visible;
                transform: translateX(0);
            }

            .mobile-menu paper-button {
                font-size: 14px;
                color: var(--app-text-color);
                width: 100%;
                margin: 8px 0;
                justify-content: flex-start;
                --paper-button-ink-color: var(--app-secondary-color);
            }

            .mobile-menu paper-button iron-icon {
                color: var(--app-text-color-disabled);
            }

            .mobile-menu paper-button.iron-selected {
                font-weight: 600;
            }

            .mobile-menu paper-button.iron-selected iron-icon {
                color: var(--app-secondary-color);
            }

            .mobile-menu-overlay {
                position: absolute;
                top: 64px;
                left: 0;
                width: 100vw;
                height: calc(100vh - 84px);
                display: none;
                background: var(--app-text-color-disabled);
            }

            .mobile-menu-overlay.open {
                display: block;

            }

            .mobile-menu-container {
                display: none;
            }

            .ehbox-notification-panel,
            .electron-notification-panel{
                position: fixed;
                top: 76px;
                right: 16px;
                z-index: 1000;
                height: 56px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
            }


            .notification-panel {
                position: fixed;
                top: 50%;
                right: 0;
                z-index: 1000;
                color: white;
                font-size: 13px;
                background: rgba(255, 0, 0, 0.55);
                height: 48px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
            }

            .patient-info{
                display:flex;
                flex-direction:row;
                flex-wrap: nowrap;
                width: auto;
                position: absolute;
                top: 50%;
                right: 137px;
                transform: scaleX(1) translateY(-50%);
                color: var(--app-text-color-light);
                opacity: 1;
                transition: all .24s;
                font-size: var(--font-size-small);
            }

            .patient-info-picture-container {
                margin-top: 2px;
                height: 14px;
                width: 14px;
                min-width: 14px;
                border-radius:50%;
                overflow: hidden;
            }

            .patient-info-picture-container img{
                width:100%;
                margin:50%;
                transform: translate(-50%,-50%);
            }

            .patient-info-container{
                display:flex;
                flex-direction:row;
                flex-wrap: nowrap;
                margin-top: 4px;
            }

            .patient-info-text{
                margin-left: 4px;
                font-size: var(--font-size-small);
            }

            footer.log-info {
                position: fixed;
                bottom: 0;
                width: 100%;
                padding: 0 24px;
                height: 20px;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                align-items: center;
                background: var(--app-background-color-light);
                border-top: 1px solid var(--app-background-color-dark);
                font-size: 12px;
                box-sizing: border-box;
            }

            footer.log-info .user-email iron-icon, footer.log-info .eHealth-status-container iron-icon{
                color: var(--app-text-color);
                opacity: .5;
                height: 14px;
                width: 14px;
                margin: 0 4px 0 0;
                padding: 0;
            }

            footer.log-info .eHealth-status-container:hover, footer.log-info .user-email:hover, footer.log-info .versions span:hover{
                background: var(--app-background-color-dark);
            }


            footer.log-info > div {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                font-family: 'Roboto', Arial, Helvetica, sans-serif;
                font-size: 12px;
                color: var(--app-text-color);
                margin: 0;
            }

            footer.log-info .user-email, footer.log-info .eHealth-status-container{
                display:flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                padding: 0 8px 0 0;
                border-right: 1px solid var(--app-background-color-dark);
            }

            footer.log-info .eHealth-status-container{
                padding: 0 8px 0 2px;
            }

            footer.log-info .eHealth-status-container .ehealth-connection-status, footer.log-info .eHealth-status-container .ehealth-mh-connection-status {
                content: '';
                display: block;
                height: 7px;
                width: 7px;
                border-radius: 8px;
                margin-left: 4px;
            }

            footer.log-info .versions{
                display:flex;
                flex-flow: row wrap;
                justify-content: flex-end;
            }

            footer.log-info .versions span{
                border-left: 1px solid var(--app-background-color-dark);
                padding: 0 8px;
                display: block;
            }

            .connected {
                background: var(--app-status-color-ok);
            }

            .pending {
                background: var(--app-status-color-pending);
                animation: pendingAnim .8s ease-in-out infinite alternate;
            }

            .disconnected {
                background: var(--app-status-color-nok);
            }

            .notconfigured {
                background: var(--app-status-color-nok);
            }

            @keyframes pendingAnim {
                from {
                    background: var(--app-status-color-pending);
                }
                to {
                    background: transparent;
                }
            }

            @media (max-width: 1024px) {
                paper-button {
                    margin-right: 10px;
                }

                paper-tabs {
                    display: none;
                }

                .mobile-menu-btn {
                    display: block;
                }

                .mobile-menu-container {
                    display: block;
                }
            }

            paper-dialog#ht-invite-hcp{
                width: 50vw;
                left: 0;
                transform: translateX(50%);
                margin: 0;
                display: flex;
                flex-direction: column;
            }
            #ht-invite-hcp h3.modal-title {
                margin: 0 !important;
            }
            #ht-invite-hcp .content{
                padding: 12px;
                height : 400px;
            }
            paper-dialog#ht-invite-hcp-user-already-exists{
                width: 60%;
                left: 0;
                transform: translateX(50%);
                margin: 0;
            }

            .inviteHcpInput {
                width: 100%;
            }

            .formNewHcp {
                max-height: 312px;
                overflow-y: auto;
                width: 100%;
                box-sizing: border-box;
            }

            .formNewHcp paper-input{
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .top-gradient {
                line-height: 0;
                font-size: 0;
                display: block;
                background: linear-gradient(90deg, var(--app-secondary-color-dark), var(--app-secondary-color));
                height: 10px;
                position: relative;
                top: 0;
                left: 0;
                right: 0;
                margin: 0;
                border-radius: 2px 2px 0 0;
            }

            .timer {
                font-size: 10px;
                width: auto;
                text-align: center;
            }

            .nok {
                color: var(--app-status-color-nok) !important;
            }

            .taktik-logo{
                transform: translateY(-2px);
            }

            ht-app-welcome{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                background: white;
            }

            #tutorialDialog{
                height: 500px;
                width: 600px;
            }

            #mikronoErrorDialog{
                height: 300px;
                width: 600px;

            }

            .errorMikrono{
                color: var(--app-status-color-nok);
            }

            #appointmentsMigrationDialog{
                height: 400px;
                width: 600px;
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
                width:100px;
                height:100px;
            }
            #update-notification {
                z-index: 1000;
                position: fixed;
                right: 32px;
                top: 32px;
                height: 48px;
                width: 256px;
                font-size: 12px;
                font-weight: 500;
                background-color: var(--app-secondary-color);
                opacity: 1;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-around;
                align-items: center;
                color: var(--app-text-color-light);
                box-shadow: 0 2px 4px 0 rgba(0,0,0,0.14),
                0 3px 4px 0 rgba(0,0,0,0.12),
                0 1px 5px 0 rgba(0,0,0,0.20),
                0 0 0 200vw rgba(0,0,0,.24);
            }

            span.warn {
                color: var(--app-error-color);
                background: transparent !important;
            }
            paper-tooltip.big {
                transform: translateY(8px) scale(1.5);
            }

            paper-button[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            @media screen and (max-width: 640px) {
                .timer {
                    display: none;
                }

                paper-dialog#ht-invite-hcp {
                    max-width: none !important;
                    width: 100% !important;
                    transform: none !important;
                }

                svg .logo-text {
                    display: none;
                }
            }

            @media screen and (max-width: 352px) {
                .logo {
                    width: 56px;
                }
            }

            @media screen and (max-width: 256px) {
                paper-menu-button#tools-and-parameters {
                    position: fixed;
                    top: 0;
                    right: 0;
                    transform: none;
                }
                .log-info {
                    position: fixed;
                    left: 64px;
                }
                .log-info span.user-email {
                    max-width: 33vw !important;
                }
                .logo {
                    display: none;
                }
            }
            .ehBoxViewIcon {
                color:var(--app-primary-color-dark);
                opacity: 1!important;
                max-height: 30px;
                width: 30px;
                height: 30px;
            }
            #ehBoxMessage {
                cursor: pointer;
            }
            #ehBoxMessage .notification-msg {
                overflow:hidden
            }
            
            #iconCloseErrorEID{
                width:100%;
                height: 100%;
                max-height: 100%;
            }

            .keystoreExpIcon{
                color: var(--app-status-color-nok)!important;
                height: 13px;
                width: 13px;
            }

            .timer-container{
                font-size: var(--font-size-small);
            }

        </style>

        <icc-api id="api" host="[[icureUrl]]" fhc-host="[[fhcUrl]]" electron-host="[[electronUrl]]" headers="[[headers]]" credentials="[[credentials]]"></icc-api>

         <paper-item id="noehealth" class="notification-panel noehealth">[[localize('no_ehe_con','No Ehealth connection',language)]]
             <iron-icon icon="icons:warning"></iron-icon>
         </paper-item>

        <ht-app-setup-prompt id="setupPrompt"></ht-app-setup-prompt>

        <ht-app-welcome id="welcome" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" credentials="[[credentials]]" api="[[api]]" hidden="[[!showWelcomePage]]" on-login="login" default-icure-url="[[defaultIcureUrl]]" default-fhc-url="[[defaultFhcUrl]]"></ht-app-welcome>

        <ht-app-login-dialog id="loginDialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" credentials="[[credentials]]" on-login="login" default-icure-url="[[defaultIcureUrl]]" default-fhc-url="[[defaultFhcUrl]]"></ht-app-login-dialog>

        <ht-app-entities-selector id="ht-app-account-selector" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" credentials="[[credentials]]" api="[[api]]" user="[[user]]" entities="[[entities]]" on-redirect-another-entity="_redirectToAnotherEntity"></ht-app-entities-selector>

         <ht-app-first-login-dialog id="firstConnectionDialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" credentials="[[credentials]]" api="[[api]]" route="{{route}}" user="[[user]]"></ht-app-first-login-dialog>
         <ht-app-register-keypair-dialog id="registerKeyPairDialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" api="[[api]]" user="[[user]]" keyhcpid="[[keyHcpId]]" message="[[registerKeyPairDialogMessage]]" on-file-selected="importPrivateKey" on-key-scanned="importScannedPrivateKey"></ht-app-register-keypair-dialog>
         <ht-export-key id="export-key" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" api="[[api]]" user="[[user]]"></ht-export-key>
         <ht-import-keychain id="ht-import-keychain" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" api="[[api]]" user="[[user]]"></ht-import-keychain>
         <ht-access-log id="ht-access-log" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" api="[[api]]" user="[[user]]"></ht-access-log>
         <ht-my-profile id="ht-my-profile" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" api="[[api]]" user="[[user]]" on-user-saved="_userSaved"></ht-my-profile>

        <ht-update-dialog id="htUpdateDialog" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" api="[[api]]" user="[[user]]"></ht-update-dialog>

        <template is="dom-if" if="[[updateMessage]]">
            <paper-card id="update-notification">
                    <span>[[updateMessage]]</span>
                    <template is="dom-if" if="[[updateAction]]">
                        <paper-button name="update" on-tap="doUpdate">
                            <iron-icon class="iron-icon" icon="play-for-work"></iron-icon>
                            <span>[[updateAction]]</span>
                        </paper-button>
                    </template>
            </paper-card>
        </template>

        <paper-item id="electronErrorMessage" class="notification-container error">
            <div class="notification-msg">
                <h4>[[localize("err","Error",language)]]</h4>
                <p>[[electronErrorMessage]]</p>
            </div>
            <paper-button class="notification-btn single-btn" on-tap="closeNotifElectron">
                <iron-icon id="iconCloseErrorEID" icon="close"></iron-icon>
            </paper-button>
        </paper-item>


         <app-location route="{{route}}" query-param="{{queryParams}}" use-hash-as-path="true"></app-location>
         <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
         <app-route route="{{subroute}}" pattern="/:page" data="{{subrouteData}}"></app-route>


         <app-drawer-layout fullbleed="">
             <!-- Main content -->
            <app-header-layout fullbleed="">
                <app-header slot="header" fixed="" condenses="" effects="waterfall">
                    <app-toolbar id="mainToolbar" class="" sticky="">
                        <!-- Mobile Menu -->
                        <paper-icon-button class="mobile-menu-btn" icon="menu" on-tap="_triggerMenu"></paper-icon-button>
                        <div class="mobile-menu-container">
                            <div id="overlayMenu" class="mobile-menu-overlay" on-tap="_triggerMenu"></div>
                            <paper-listbox id="mobileMenu" class="mobile-menu" selected="[[routeData.page]]" attr-for-selected="name">
                                <paper-button data-name="main" name="main" on-tap="doRoute"><iron-icon data-name="main" class="iron-icon" icon="home"></iron-icon>[[localize('sum','Summary',language)]]</paper-button>
                                <paper-button data-name="pat" name="pat" on-tap="doRoute"><iron-icon data-name="pat" icon="vaadin:user-heart"></iron-icon>[[localize('pat','Patients',language)]]</paper-button>
                                <paper-button data-name="hcp" name="hcp" on-tap="doRoute"><iron-icon data-name="hcp" icon="vaadin:hospital"></iron-icon>[[localize('hc_par','HC parties',language)]]</paper-button>
                                <paper-button data-name="msg" name="msg" on-tap="doRoute"><iron-icon data-name="msg" icon="communication:email"></iron-icon>[[localize('msg','Message',language)]]</paper-button>
                                <paper-button data-name="diary" name="diary" on-tap="checkAndLoadMikrono"><iron-icon data-name="diary" icon="date-range"></iron-icon>[[localize('diary','Diary',language)]]</paper-button>
                                <paper-button data-name="admin" name="admin" on-tap="doRoute"><iron-icon data-name="admin" icon="vaadin:cog-o"></iron-icon>[[localize('admin')]]</paper-button>
                            </paper-listbox>
                        </div>
                        
                        <div style="display: flex; align-items: center;">
                            <div name="main" on-tap="doRoute" style="cursor:pointer">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="92px" height="64px" viewBox="0 0 92 64" style="enable-background:new 0 0 92 64;" xml:space="preserve" class="icure-logo">
                                    <style type="text/css">
                                    .st1 {
                                        fill: #FFFFFF;
                                    }

                                    .st2 {
                                        fill: #66DEA1;
                                    }
                                    </style>
                                    <defs>
                                    </defs>
                                    <g>
                                        <g>
                                            <rect x="44.3" y="32.2" class="st1" width="1.3" height="12.6"></rect>
                                            <path class="st1" d="M45,27.6c-0.6,0-1,0.5-1,1.2c0,0.6,0.4,1.2,1,1.2h0c0.6,0,1-0.5,1-1.2C46,28.1,45.6,27.6,45,27.6z"></path>
                                            <path class="st1" d="M60.2,43c-1,0.5-2.3,0.8-3.7,0.8c-4.3,0-6.9-2.9-6.9-7.7c0-5,2.6-8,7-8c1.3,0,2.5,0.3,3.4,0.7l0.1,0l0.4-1.2
                                                l-0.1,0c-0.4-0.2-1.7-0.8-3.8-0.8c-5,0-8.4,3.7-8.4,9.2c0,6.6,4.2,9,7.9,9c2.1,0,3.7-0.5,4.5-0.9l0.1,0L60.2,43L60.2,43z"></path>
                                            <path class="st1" d="M72.3,41.7v-9.5H71V40c0,0.4-0.1,0.9-0.2,1.3c-0.5,1.1-1.6,2.4-3.4,2.4c-2,0-3-1.5-3-4.5v-7.1H63v7.3
                                                c0,5,2.9,5.6,4.1,5.6c1.9,0,3.3-1.2,4-2.3l0.1,2.1h1.3l0-0.1C72.3,43.8,72.3,42.9,72.3,41.7z"></path>
                                            <path class="st1" d="M80.5,31.9c-1.4,0-2.7,1-3.3,2.6l0-2.3h-1.3l0,0.1C76,33.4,76,34.6,76,36v8.8h1.3v-6.9c0-0.5,0-0.9,0.1-1.2
                                                c0.3-2.1,1.5-3.4,3-3.4c0.2,0,0.4,0,0.5,0l0.1,0V32L81,32C80.9,31.9,80.7,31.9,80.5,31.9z"></path>
                                            <path class="st1" d="M91.1,34.1c-0.8-1.4-2.1-2.2-3.8-2.2c-3.2,0-5.4,2.7-5.4,6.8c0,3.8,2.2,6.3,5.5,6.3c2.1,0,3.3-0.6,3.7-0.8
                                                l0.1,0L91,43.1l-0.1,0c-0.7,0.4-1.6,0.7-3.2,0.7c-1.3,0-4.3-0.5-4.4-5.3h8.6l0-0.1C92,38.1,92,38,92,37.6
                                                C92,37.1,91.9,35.5,91.1,34.1z M83.4,37.3c0.3-1.9,1.4-4.1,3.8-4.1c1,0,1.8,0.3,2.3,0.9c0.9,1,1.1,2.5,1.1,3.2H83.4z"></path>
                                        </g>
                                        <path class="st2" d="M36.2,38.4c-0.4-4.3-2.9-6.6-7.4-6.6l-5.5,0c-0.2,0-0.4,0.1-0.5,0.3l-0.6,1.5l-1.9-8.4c0-0.3-0.3-0.5-0.6-0.5
                                        c-0.3,0-0.5,0.2-0.6,0.5l-2.3,10.4L15.4,29c0-0.3-0.3-0.5-0.6-0.5c-0.3,0-0.5,0.2-0.6,0.4L13,31.8H8.3V33h5.2
                                        c0.3,0,0.5-0.2,0.6-0.4l0.6-1.5l1.6,7.2c0.1,0.3,0.3,0.5,0.6,0.5c0.3,0,0.5-0.2,0.6-0.5l2.2-10.3l1.7,7.5c0,0.3,0.2,0.5,0.5,0.5
                                        c0.2,0.1,0.5-0.1,0.6-0.3l1.2-2.7l5.1,0c3.8,0,5.8,1.5,6.3,4.7c0.3,2-0.2,3.8-1.3,5.1c-1.2,1.4-3,2-5,1.9H8.8
                                        c-4.1,0-7.5-3.4-7.6-7.6C1,32.8,4,29.1,8,28.8c0.3,0,0.5-0.3,0.5-0.5c0.3-2.3,1.2-4.4,2.7-6c1.8-1.9,4.2-3,6.8-3c2.6,0,5,1.1,6.8,3
                                        c1.2,1.3,2.3,3.7,2.7,6.4l0,0.2l0.2,0c0.2,0,0.7-0.1,0.8-0.1l0.2,0l0-0.2c-0.5-3-1.6-5.6-3-7.1c-2-2.1-4.7-3.3-7.6-3.3
                                        c-2.9,0-5.6,1.2-7.6,3.3c-1.6,1.7-2.6,3.9-3,6.3C3.1,28.3-0.1,32.3,0,37c0.1,2.4,1,4.6,2.7,6.4C4.4,45.1,6.6,46,8.8,46l19.7,0
                                        c0.1,0,0.2,0,0.4,0c2.2,0,4.2-0.9,5.6-2.4C35.7,42.2,36.3,40.4,36.2,38.4z"></path>
                                    </g>
                                </svg>
                            </div>
                            <!-- Regular Tabs Menu -->
                            <paper-tabs selected="[[routeData.page]]" attr-for-selected="name" role="navigation">
                                <paper-tab data-name="main" name="main" on-tap="doRoute"><iron-icon data-name="main" name="main" class="iron-icon" icon="home"></iron-icon>[[localize('sum','Summary',language)]]</paper-tab>
                                <paper-tab data-name="pat" name="pat" on-tap="doRoute"><iron-icon data-name="pat" name="pat" class="smaller" icon="vaadin:user-heart"></iron-icon>[[localize('pat','Patients',language)]]</paper-tab>
                                <paper-tab data-name="hcp" name="hcp" on-tap="doRoute"><iron-icon data-name="hcp" name="hcp" class="smaller" icon="vaadin:hospital"></iron-icon>[[localize('hc_par','HC parties',language)]]</paper-tab>
                                <paper-tab data-name="msg" name="msg" on-tap="doRoute"><iron-icon data-name="msg" name="msg" class="smaller" icon="vaadin:envelope"></iron-icon>[[localize('msg','Message',language)]]</paper-tab>
                                <paper-tab data-name="diary" name="diary" on-tap="checkAndLoadMikrono"><iron-icon data-name="diary" name="diary" icon="date-range"></iron-icon>[[localize('diary','Diary',language)]]</paper-tab>
                                <paper-tab data-name="admin" name="admin" on-tap="doRoute"><iron-icon data-name="admin" name="admin" icon="settings"></iron-icon>[[localize('admin')]]</paper-tab>
                            </paper-tabs>
                        </div>
                        <div style="display:flex; align-items: center; width: 120px;">
                            <!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In  -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="100px" height="17.3px" viewBox="0 0 100 17.3" style="enable-background:new 0 0 100 17.3;" xml:space="preserve" class="taktik-logo">

                            <defs>
                            </defs>
                            <polygon class="st1" points="0,8.3 6.9,8.3 6.9,17.2 10,17.2 10,8.3 16.9,8.3 16.9,5.3 0,5.3 "></polygon>
                            <path class="st1" d="M36.1,17.2v-8c0-2.1-1.6-3.9-3.6-3.9H19.3v3H33v1.5H22.5c-2.1,0-3.8,1.7-3.8,3.7c0,2.1,1.8,3.8,4,3.8H36.1z
                            M21.9,12.8H33v1.5H21.9V12.8z"></path>
                            <polygon class="st1" points="56.8,8.3 63.7,8.3 63.7,17.2 66.8,17.2 66.8,8.3 73.7,8.3 73.7,5.3 56.8,5.3 "></polygon>
                            <rect x="75.7" y="5.3" class="st1" width="3.1" height="11.9"></rect>
                            <rect x="75.7" class="st1" width="3.1" height="3.1"></rect>
                            <path class="st1" d="M43,9.4C43,9.4,43,9.4,43,9.4C43,9.4,43,9.4,43,9.4z"></path>
                            <path class="st1" d="M86.9,9.4C87,9.4,87,9.4,86.9,9.4C87,9.4,87,9.4,86.9,9.4z"></path>
                            <path class="st1" d="M91.3,12.3l8.7,5h-6.3l-5.2-3.1c-0.2-0.1-0.5-0.3-0.7-0.4c-0.2-0.1-0.4-0.3-0.6-0.4c-0.2-0.2-0.4-0.4-0.6-0.6
                            c0,0,0-0.1-0.1-0.1c-0.2-0.3-0.4-0.7-0.4-1.2v5.7h-3.1V5.4h3.1V11c0.1-0.6,0.3-1.2,0.7-1.6c0,0,0,0,0.1-0.1c0,0,0,0,0,0
                            c0.3-0.3,0.7-0.6,1.3-0.9l5.5-3.1h6.3l-8.7,4.9l-1.7,1L91.3,12.3z"></path>
                            <path class="st1" d="M43.1,9.4C43.1,9.4,43.1,9.4,43.1,9.4C43.1,9.4,43.1,9.4,43.1,9.4z"></path>
                            <path class="st1" d="M43.1,9.4C43.1,9.4,43.1,9.4,43.1,9.4C43.1,9.4,43.1,9.4,43.1,9.4z"></path>
                            <path class="st1" d="M47.4,12.3l8.7,5h-6.3l-5.2-3.1c-0.2-0.1-0.5-0.3-0.7-0.4c-0.2-0.1-0.4-0.3-0.6-0.4c-0.2-0.2-0.4-0.4-0.6-0.6
                            c0,0,0-0.1-0.1-0.1c-0.2-0.3-0.4-0.7-0.4-1.2v5.7h-3.1V5.4h3.1V11c0.1-0.6,0.3-1.2,0.7-1.6c0,0,0,0,0.1-0.1c0,0,0,0,0,0
                            c0.3-0.3,0.7-0.6,1.3-0.9l5.5-3.1h6.3l-8.7,4.9l-1.7,1L47.4,12.3z"></path>
                            </svg>

                            <template is="dom-if" if="{{_isPatientView(route, subroute)}}">
                                <div class="patient-info">
                                    <div class="patient-info-picture-container"><img src\$="[[picture(patient,patient.picture)]]"></div>
                                    <div class="patient-info-container">
                                        <span class="patient-info-text">[[getGender(patient.gender)]] [[patient.firstName]] [[patient.lastName]]</span>
                                        <span class="patient-info-text">°[[_timeFormat(patient.dateOfBirth)]] °[[_ageFormat(patient.dateOfBirth)]]</span>
                                        <span class="patient-info-text">°[[patient.ssin]]</span>
                                    </div>
                                </div>
                            </template>

                            <paper-tooltip class="big" position="left" for="tools-and-parameters">[[localize('tools_and_parameters','Tools and parameters',language)]]</paper-tooltip>
                            <paper-menu-button id="tools-and-parameters" horizontal-align="right" close-on-activate="" no-overlap="" no-animations="" focused="false">
                                <paper-icon-button icon="icons:more-vert" slot="dropdown-trigger" alt="menu"></paper-icon-button>
                                <paper-listbox class="extra-menu" slot="dropdown-content" stop-keyboard-event-propagation="">
                                    <div class="dropdown-content"></div><!-- workaround to fix that the fist element of the list was always focus -->

                                    <paper-item class="extra-menu-item" on-tap="_openExportKey">[[localize('tra_pri_key_/_con_tab','Transfer private key / Connect
                                        tablet',language)]]
                                    </paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_importKeychain">[[localize('imp_my_ehe_key','Import my eHealth keychain',language)]]</paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_inviteHCP">[[localize('inviteHCP','Invite a colleague ',language)]]</paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_logList">[[localize('acc_log','Access Log',language)]]</paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_tuto">[[localize('tutorial','Tutorial',language)]]</paper-item>
                                    <paper-item class="extra-menu-item" on-tap="mikronoAppointmentsMigration">[[localize('imp_ep_app','Import Epicure appointments',language)]]</paper-item>
                                    <paper-item class="extra-menu-item" on-tap="_myProfile">
                                        <iron-icon icon="icons:account-circle"></iron-icon>
                                        [[localize('my_pro','My profile',language)]]
                                    </paper-item>
                                    <paper-item data-name="logout" class="extra-menu-item" name="logout" on-tap="doRoute">
                                        <iron-icon data-name="logout" icon="power-settings-new"></iron-icon>
                                        [[localize('log_out','Log out',language)]]
                                    </paper-item>
                                </paper-listbox>
                            </paper-menu-button>

                        </div>

                    </app-toolbar>

                </app-header>
                <iron-pages selected="[[view]]" attr-for-selected="name" fallback-selection="view404" role="main">
                    <ht-main id="htmain" name="main" api="[[api]]" user="[[user]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" route="{{subroute}}" socket="[[socket]]">
                        <splash-screen></splash-screen>
                    </ht-main>
                    <ht-pat name="pat" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" route="{{subroute}}" credentials="[[credentials]]" socket="[[socket]]" on-user-saved="_userSaved" on-idle="resetTimer">
                        <splash-screen></splash-screen>
                    </ht-pat>
                    <ht-hcp name="hcp" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" route="{{subroute}}">
                        <splash-screen></splash-screen>
                    </ht-hcp>
                    <ht-msg name="msg" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" credentials="[[credentials]]" force-refresh="[[_forceEhBoxRefresh]]" on-trigger-open-my-profile="_triggerOpenMyProfile" on-trigger-goto-admin="_triggerOpenAdminGroupsManagementSubMenu">
                        <splash-screen></splash-screen>
                    </ht-msg>
                    <ht-diary id="htDiary" name="diary" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" credentials="[[credentials]]">
                        <splash-screen></splash-screen>
                    </ht-diary>
                    <ht-admin id="htAdmin" name="admin" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" credentials="[[credentials]]" socket="[[socket]]">
                        <splash-screen-tz></splash-screen-tz>
                    </ht-admin>
                    <ht-view404 name="view404"></ht-view404>
                </iron-pages>
            </app-header-layout>
            <footer class="log-info">
                <div>
                    <div class="user-email" on-click="_debugPostUser"><iron-icon icon="icons:account-circle"></iron-icon>[[user.login]]</div>
                    <div class="eHealth-status-container">
                        <iron-icon icon="icure-svg-icons:ehealth"></iron-icon>
                        <span>eHealth</span>
                        <span id="eHealthStatus" class="ehealth-connection-status pending"></span>
                        <paper-tooltip for="eHealthStatus" position="top">[[localize('ehe','eHealth status',language)]]</paper-tooltip>
                    </div>
                    <div class="eHealth-status-container">
                        <template is="dom-if" if="[[showKeystoreExpiredStatusIcon]]">
                            <iron-icon id="keystoreExpiredStatusIcon" icon="vaadin:warning" class="keystoreExpIcon"></iron-icon> [[localize('keystoreExpiredLabel','Votre keystore est expiré depuis le',language)]] [[keyStoreValidityLabel]]
                            <paper-tooltip for="keystoreExpiredStatusIcon" position="top"> [[localize('keystoreExpiredLabel','Votre keystore est expiré depuis le',language)]] [[keyStoreValidityLabel]]</paper-tooltip>
                        </template>
                        <template is="dom-if" if="[[showKeystoreExpiresSoonStatusIcon]]">
                            <iron-icon id="keystoreExpiresSoonStatusIcon" icon="alarm" class="keystoreExpIcon"></iron-icon> [[localize('keystoreExpiresSoonLabel','Votre keystore va bientôt expirer',language)]] : [[keyStoreValidityLabel]]
                            <paper-tooltip for="keystoreExpiresSoonStatusIcon" position="top"> [[localize('keystoreExpiresSoonLabel','Votre keystore va bientôt expirer',language)]] : [[keyStoreValidityLabel]] </paper-tooltip>
                        </template>
                    </div>
                    <template is="dom-if" if="[[hasMHCertificate]]">
                        <div class="eHealth-status-container">
                            <iron-icon icon="icure-svg-icons:ehealth"></iron-icon>
                            <span>[[localize('medical_house','Medical House',language)]] eHealth</span>
                            <span id="eHealthMHStatus" class="ehealth-mh-connection-status pending"></span>
                            <paper-tooltip for="eHealthMHStatus" position="top">[[localize('eheMM','eHealth status for Medical House certificats',language)]]</paper-tooltip>
                        </div>
                    </template>
                </div>
                <div class="versions">
                    <span class="frontVersion">frontend: [AIV]{version}[/AIV]</span>
                    <span class="backVersion">backend: [[backendVersion]]</span>
                    <template is="dom-if" if="[[isElectron]]">
                        <span class="version">e—[[electronVersion]]</span>
                    </template>
                </div>
                <paper-tooltip for="ehealth" position="top">
                    <template is="dom-if" if="[[api.tokenId]]">
                        [[localize('ehe_is_con','eHealth is connected',language)]]
                    </template>
                    <template is="dom-if" if="[[!api.tokenId]]">
                        [[localize('ehe_is_not_con','eHealth is not connected',language)]]
                    </template>
                </paper-tooltip>
                <paper-tooltip for="ehealthMH" position="top">
                    <template is="dom-if" if="[[api.tokenIdMH]]">
                        [[localize('ehe_is_con','eHealth is connected',language)]]
                    </template>
                    <template is="dom-if" if="[[!api.tokenIdMH]]">
                        [[localize('ehe_is_not_con','eHealth is not connected',language)]]
                    </template>
                </paper-tooltip>
            </footer>
        </app-drawer-layout>

        <template is="dom-if" if="[[busySpinner]]"><div id="busySpinner"><div id="busySpinnerContainer"><ht-spinner class="spinner" active=""></ht-spinner></div></div></template>

        <paper-dialog id="ht-invite-hcp">
            <h2 class="modal-title">[[localize('inviteHCP','Invite a colleague ',language)]]</h2>
            <div class="content">
                <paper-input class="inviteHcpInput" label="[[localize('las_nam','Last name',language)]]" value="{{lastName}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('fir_nam','First name',language)]]" value="{{firstName}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('ema','Email',language)]]" value="{{email}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('phone','Phone',language)]]" value="{{phone}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('inami','NIHII',language)]]" value="{{nihii}}"></paper-input>
                <paper-input class="inviteHcpInput" label="[[localize('ssin','SSIN',language)]]" value="{{ssin}}"></paper-input>
                <paper-dropdown-menu label="[[localize('language','language',language)]]" selected-item="{{lang}}">
                    <paper-listbox slot="dropdown-content" class="dropdown-content">
                        <paper-item id="fr">[[localize('fre','French',language)]]</paper-item>
                        <paper-item id="en">[[localize('eng','English',language)]]</paper-item>
                        <paper-item id="nl">[[localize('dut','Deutch',language)]]</paper-item>
                    </paper-listbox>
                </paper-dropdown-menu>
            </div>

            <div class="buttons">
                <span class="warn">[[warn]]</span>
                <paper-button dialog-dismiss="" class="button">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button dialog-confirm="" autofocus="" on-tap="confirmUserInvitation" class="button button--save" disabled="[[!validInvite]]">[[localize('invite','Invite',language)]]</paper-button>
            </div>
        </paper-dialog>
        <paper-dialog id="ht-invite-hcp-link">
            <h2 class="modal-title">Lien de première connexion</h2>
            <div class="content">
                <div style="padding:12px;height: 100px;">[[invitedHcpLink]]</div>
            </div>
            <div class="buttons">
                <paper-button dialog-dismiss="" class="button">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="ht-invite-hcp-user-already-exists">
            <h2 class="modal-title">[[localize('warning','Attention',language)]]</h2>
            <h4> [[localize( 'email_address_already_exists', 'L\\'adresse email de ce collègue existe déjà\\, veuillez svp en spécifier une autre', language)]]</h4>
            <paper-button dialog-confirm="" autofocus="" class="button" on-tap="_inviteHCP">[[localize('clo','Close',language)]]</paper-button>
        </paper-dialog>

        <paper-dialog id="tutorialDialog">
            <h2 class="modal-title">[[localize('tutorialList','Tutorial list',language)]]</h2>
            <div id="tutorialContainer">
                <ul>
                    <li><a href="../docs/1_1_connexion.pdf" target="_blank">Connexion</a></li>
                    <li><a href="../docs/1_2_Configuration_du_compte_utilisateur.pdf" target="_blank">Configuration du compte utilisateur</a></li>
                    <li><a href="../docs/1_3_Configuration_et_importation_du_trousseau_eHealth.pdf" target="_blank">Configuration et importation du trousseau eHealth</a></li>
                    <li><a href="../docs/1_4_dashboard_first_use.pdf" target="_blank">Tableau de bord</a></li>
                    <li><a href="../docs/2_1_presentation_generale.pdf" target="_blank">Présentation générale</a></li>
                    <li><a href="../docs/2_2_creation_et_configuration_patient.pdf" target="_blank">Création et configuration d'un patient</a></li>
                    <li><a href="../docs/2_3_Partage_de_patients.pdf" target="_blank">Partager un patient</a></li>
                    <li><a href="../docs/3_1_dossier_complet.pdf" target="_blank">Dossier complet</a></li>
                    <li><a href="../docs/manuel.pdf" target="_blank">Manuel</a></li>
                </ul>
            </div>
            <div class="buttons">
                <paper-button dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-item id="ehBoxMessage" class="notification-container electron-notification-panel">
            <iron-icon class="notification-icn" icon="communication:email" on-tap="_gotoEhBox"></iron-icon>
            <div class="notification-msg" on-tap="_gotoEhBox">[[ehBoxWebWorkerTotalNewMessages]] [[localize('ehb.newMessages','new message(s)', language)]]</div>
            <paper-button class="notification-btn single-btn" on-tap="_closeNotif">[[localize('clo','Close', language)]]</paper-button>
        </paper-item>

        <paper-item id="electronMessage" class="notification-container electron-notification-panel">
            <iron-icon class="notification-icn" icon="icons:warning"></iron-icon>
            <div class="notification-msg">[[localize('electron_update_available','New electron version available',language)]]</div>
            <paper-button class="notification-btn single-btn" on-tap="_closeNotif">[[localize('clo','Close', language)]]</paper-button>
        </paper-item>

        <paper-dialog id="mikronoErrorDialog">
            <h2 class="modal-title">Erreur lors de la création de votre compte agenda</h2>
            <div class="errorMikrono">
                <template is="dom-if" if="[[!mikronoError.addresses]]"><h5>- Adresse manquante</h5></template>
                <template is="dom-if" if="[[!mikronoError.workAddresses]]"><h5>- Adresse de type travail manquante</h5></template>
                <template is="dom-if" if="[[!mikronoError.workMobile]]"><h5>- N° de gsm manquant</h5></template>
                <template is="dom-if" if="[[!mikronoError.workEmail]]"><h5>- Email manquant</h5></template>
                <template is="dom-if" if="[[!mikronoError.token]]"><h5>- Token manquant</h5></template>
                <template is="dom-if" if="[[!mikronoError.error]]"><h5>- Erreur lors de la création du compte</h5></template>
            </div>
            <div class="buttons">
                <paper-button dialog-dismiss="">[[localize('clo','Close',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="appointmentsMigrationDialog">
            <h2 class="modal-title">Migration de vos rendez-vous</h2>
            <vaadin-grid id="migrItem" class="material" items="[[migrationItems]]">
                <vaadin-grid-column>
                    <template class="header">
                        Opération en cours
                    </template>
                    <template>
                        <div>[[item.item]]</div>
                    </template>
                </vaadin-grid-column>
            </vaadin-grid>
        </paper-dialog>


        <template is="dom-if" if="[[showKeystoreExpiredLabel]]">
            <div class="failedLabel displayNotification" id="keystoreExpiredLabel"><iron-icon icon="clear"></iron-icon> [[localize('keystoreExpiredLabel','Votre keystore est expiré depuis le',language)]] [[keyStoreValidityLabel]]</div>
        </template>
        <template is="dom-if" if="[[showKeystoreExpiresSoonLabel]]">
            <div class="warningLabel displayNotification" id="keystoreExpiresSoonLabel"><iron-icon icon="alarm"></iron-icon> [[localize('keystoreExpiresSoonLabel','Votre keystore va bientôt expirer',language)]] : [[keyStoreValidityLabel]]</div>
        </template>
`;
  }

  static get is() {
      return 'ht-app'
  }

  static get properties() {
      return {
          versions: {
              type: Object,
              value: function () {
                  return require('../versions.json');
              }
          },
          api: {
              type: Object,
              noReset: true,
              value: null
          },
          user: {
              type: Object,
              value: null
          },
          keyHcpId: {
              type: Object,
              value: null,
          },
          language: {
              type: String,
              noReset: true,
              value: 'fr'
          },
          i18n: {
              Type: Object,
              noReset: true,
              value() {
                  moment.locale('fr', {
                      months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
                      monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
                      monthsParseExact : true,
                      weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
                      weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
                      weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
                      weekdaysParseExact : true,
                      longDateFormat : {
                          LT : 'HH:mm',
                          LTS : 'HH:mm:ss',
                          L : 'DD/MM/YYYY',
                          LL : 'D MMMM YYYY',
                          LLL : 'D MMMM YYYY HH:mm',
                          LLLL : 'dddd D MMMM YYYY HH:mm'
                      },
                      calendar : {
                          sameDay : '[Aujourd’hui à] LT',
                          nextDay : '[Demain à] LT',
                          nextWeek : 'dddd [à] LT',
                          lastDay : '[Hier à] LT',
                          lastWeek : 'dddd [dernier à] LT',
                          sameElse : 'L'
                      },
                      relativeTime : {
                          future : 'dans %s',
                          past : 'il y a %s',
                          s : 'quelques secondes',
                          m : 'une minute',
                          mm : '%d minutes',
                          h : 'une heure',
                          hh : '%d heures',
                          d : 'un jour',
                          dd : '%d jours',
                          M : 'un mois',
                          MM : '%d mois',
                          y : 'un an',
                          yy : '%d ans'
                      },
                      week : {
                          dow :1
                      }
                  });
                  const res = {
                      monthNames: moment.months(),
                      weekdays: moment.weekdays(),
                      weekdaysShort: moment.weekdaysShort(),
                      firstDayOfWeek: moment.localeData().firstDayOfWeek(),
                      week: 'Semaine',
                      calendar: 'Calendrier',
                      clear: 'Clear',
                      today: 'Aujourd\'hui',
                      thisMonth: "ce mois-ci",
                      thisYear: "cette année",
                      cancel: 'Annuler',
                      formatDate(d, accuracy) {
                          const date = moment(d).format('DD/MM/YYYY')
                          return accuracy==="year" ? date.substr(6) : accuracy==="month" ? date.substr(3) : date
                      },
                      parseDate(text) {
                          const parts = text.split('/');
                          const today = new Date();
                          let day, month = today.getMonth(), year = today.getFullYear(),accuracy="";

                          parts.reverse()
                          if (parts.length >= 1) {
                              year = parseInt(parts[0]);
                              accuracy="year";
                          }
                          if (parts.length >= 2 && parseInt(parts[1]) > 0) {
                              month = parseInt(parts[1]) - 1;
                              accuracy="month";
                          }else{
                              month= 0;
                          }
                          if (parts.length >= 3 && parseInt(parts[2])>0) {
                              day = parseInt(parts[2]);
                              accuracy="day";
                          }else{
                              day = 1;
                          }

                          if (day !== undefined) {
                              return {day, month, year, accuracy};
                          }
                      },
                      formatTitle(monthName, fullYear) {
                          return monthName
                      }
                  }
                  return res
              }
          },
          view: {
              type: String,
              reflectToAttribute: true,
              observer: '_viewChanged',
              noReset: true
          },
          headers: {
              type: Object,
              value: {"Content-Type": "application/json"}
          },
          credentials: {
              type: Object,
              value: {logout: false}
          },
          lazyPages: {
              type: Object,
              noReset: true,
              value: {
                  main() {
                      import(/* webpackChunkName: "ht-main" */ './ht-main.js')
                  },
                  pat() {
                      import(/* webpackChunkName: "ht-pat" */ './ht-pat.js')
                  },
                  hcp() {
                      import(/* webpackChunkName: "ht-hcp" */ './ht-hcp.js')
                  },
                  msg() {
                      import(/* webpackChunkName: "ht-msg" */ './ht-msg.js')
                  },
                  diary(){
                      import(/* webpackChunkName: "ht-diary" */ './ht-diary.js')
                  },
                  admin(){
                      import(/* webpackChunkName: "ht-admin" */ './ht-admin.js')
                  },
                  view404() {
                      import(/* webpackChunkName: "ht-view404" */ './ht-view404.js')
                  }
              }
          },
          resources: {
              value() {
                  return require('./elements/language/language.json')
              },
              noReset: true
          },
          invitedHcpLink: {
              type: String,
              value: ""
          },
          disconnectionTimer: {
              type: Number,
              value: 60,
              noReset: true
          },
          connectionTime: {
              type: Number,
              noReset: true
          },
          ehBoxWebWorkerTotalNewMessages: {
              type: Number,
              value: 0
          },
          EhboxCheckingActive: {
              type: Boolean,
              value: false
          },
          worker: {
              type: Worker,
              noReset: true
          },
          timeOutId: {
              type: String
          },
          keyPairKeystore:{
              type: Array,
              value: () => []
          },
          showWelcomePage: {
              type: Boolean,
              value: false
          },
          entities:{
              type: Array,
              value: () => []
          },
          isMultiUser : {
              type: Boolean,
              value: true
          },
          mikronoError:{
              type: Object,
              value : () => {}
          },
          migrationItems:{
              type: Array,
              value: () => []
          },
          busySpinner: {
              type: Boolean,
              value: false
          },
          updateMessage: {
              type: String,
              value: null
          },
          updateAction: {
              type: String,
              value: null
          },
          validInvite: {
              type: Boolean,
              value: false
          },
          warn: {
              type: String
          },
          validMail: {
              type: Boolean,
              value: null
          },
          isElectron :{
              type: Boolean,
              value: false
          },
          electronVersion : {
              type : String,
              value : ""
          },
          electronVersionOk : {
              type : Boolean,
              value : true
          },
          backendVersionOk : {
              type : Boolean,
              value : true
          },
          socket: {
              type : Object,
              value : null
          },
          _forceEhBoxRefresh: {
              type : Boolean,
              value : false
          },
          patientOpened:{
              type: String,
              value : ""
          },
          electronErrorMessage:{
              type:String,
              value:""
          },
          keyStoreValidityLabel : {
              type : String,
              value : ""
          },
          showKeystoreExpiresSoonLabel: {
              type : Boolean,
              value : false
          },
          showKeystoreExpiredLabel: {
              type : Boolean,
              value : false
          },
          showKeystoreExpiresSoonStatusIcon: {
              type : Boolean,
              value : false
          },
          showKeystoreExpiredStatusIcon: {
              type : Boolean,
              value : false
          },
          phone:{
              type: String,
              value: null
          },
          lang:{
              type: String,
              value: null
          }

  }
  }

  static get observers() {
      return [
          '_routePageChanged(routeData.page)',
          '_isValidInvite(lastName,firstName,validMail)',
          'isMailValid(email)',
          'resourceAndLanguageChanged(resources,language)'
      ]
  }

  constructor() {
      super()
  }

  _closeNotif(e){
      e.target.parentElement.classList.remove('notification');
  }

  _gotoEhBox(e){
      if(!!_.size(_.get(e,"target.parentElement",{}))) e.target.parentElement.classList.remove('notification');
      this.$['ehBoxMessage'] && this.$['ehBoxMessage'].classList && this.$['ehBoxMessage'].classList.remove('notification')
      this.set('routeData.page', "msg")
      this._triggerMenu()
  }


  _isValidInvite() {
      this.set('validInvite', this.lastName && this.firstName && this.lastName.length && this.firstName.length && this.validMail)
  }

  isMailValid(str) {
      setTimeout(()=>{
          if (str.length) {
              const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

              if (filter.test(str)) {
                  this.set('warn','')
                  this.set('validMail',true)
              } else {
                  this.set('warn',this.localize('please_valid_mail','Please enter valid email',this.language))
                  this.set('validMail',false)
              }
          }
      },2000)
  }

  setUrls() {
      const params = this.route.__queryParams //_.fromPairs((this.route.path.split('?')[1] || "").split('&').map(p => p.split('=')))
      this.set('icureUrl', params.icureUrl || `https://backendb.svc.icure.cloud/rest/v1`)//`https://backend${window.location.href.replace(/https?:\/\/.+?(b?)\.icure\.cloud.*/,'$1')}.svc.icure.cloud/rest/v1`)
      this.set('fhcUrl', params.fhcUrl || (window.location.href.includes('https://tzb') ? 'https://fhctz.icure.cloud' : 'https://fhcprd.icure.cloud'))
      this.set('electronUrl', params.electronUrl || "http://127.0.0.1:16042");
      this.set('mikronoProxy', params.mikronoProxy || 'http://127.0.0.1:16041');
      this.set('defaultIcureUrl', this.icureUrl)
      this.set('defaultFhcUrl', this.fhcUrl)

  }

  _updateServerUrl(icureurl, fhcurl) {

      if(icureurl) this.set('icureUrl',icureurl)
      if(fhcurl) this.set('fhcUrl',fhcurl)

  }

  reset() {
      const props = HtApp.properties
      Object.keys(props).forEach(k => { if (!props[k].noReset) { this.set(k, (typeof props[k].value === 'function' ? props[k].value() : (props[k].value || null))) }})
      ;['#ht-main', '#ht-pat', '#ht-hcp', '#ht-msg'].map(x => this.root.querySelector(x)).map(el => el && typeof el.reset === 'function' && el.reset())
  }

  _checkShowWelcomePage() {
      this.api.icure().isReady().then(ok => {
          if (ok === 'false') {
              this.set('showWelcomePage', true)
              this.$["loginDialog"].disable()
              this.$["setupPrompt"].close()
          } else if (ok !== 'true') {
              this.$["setupPrompt"].close()
              this.$["loginDialog"].disable()
              setTimeout(() => this._checkShowWelcomePage(), 10000)
          }else {
              localStorage.setItem('last_app_startup', Date.now().toString())
              this.$["loginDialog"].enable()
              this.$["setupPrompt"].close()
          }
      }).catch(() => {
          if (!localStorage.getItem('last_app_startup')) this.$["setupPrompt"].open()
          this.$["loginDialog"].disable()
          setTimeout(() => this._checkShowWelcomePage(), 10000)
      })
  }

  ready() {
      super.ready()

      this.set("isMultiUser",true)

      const url = new URL(window.location.href)
      if (!url.hash || !url.hash.startsWith('#/')) {
          url.hash = '#/'
          window.location.replace(url.toString())
      }

      window.app = this

      if (!this.icureUrl) { this.setUrls() }

      this.set('api', this.$.api)

      //init socket io
      this.set("socket",null)
      this.api.isElectronAvailable().then(electron => {
          this.set("isElectron",electron)
          if (electron) {
              this.set("socket",io(_.get(this,"api.electronHost","http://127.0.0.1:16042")))

              this.socket.on("connect", () => {
                  console.log("connection avec le socket de electron")
              })

              this.socket.on("update-downloaded", msg => {
                  console.log(msg)
                  this.$['electronMessage'].classList.add('notification');
                  setTimeout(() => {
                      this.$['electronMessage'].classList.remove('notification');
                  }, 7500);
              })

              this.socket.on("auto-read-card-eid", cards =>{
                  if(typeof cards==="string" && cards.includes("Error"))return;
                  if(this.route.path.includes("/pat")){
                      this.$["ht-pat"] && typeof this.$["ht-pat"].autoReadCardEid ==="function" && this.$["ht-pat"].autoReadCardEid(cards)
                  }else if(this.route.path.includes("/main") && !this.route.path.includes("/auth")){
                      this.$["htmain"] && typeof this.$["htmain"].autoReadCardEid ==="function" && this.$["htmain"].autoReadCardEid(cards)
                  }
              })

              fetch('http://127.0.0.1:16042/checkDrugs',{
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json; charset=utf-8"
                  }
              })

              this.notifyPath("socket");
          }

          if(this.isElectron){
              fetch('http://127.0.0.1:16042/getVersion')
                  .then((response) => {
                      return response.json()
                  })
                  .then(res => {
                      if (res.version) {
                          this.set("electronVersion", res.version)
                          this.set("electronVersionOk",this.versions.electron.includes(res.version))
                      }
                  })

              fetch('http://127.0.0.1:16042/getConnexionData')
                  .then((response) => {
                      return response.json()
                  })
                  .then(res => {
                      if(res.ok){
                          this.set("api.isMH",res.tokenData.isMH)
                          if(res.tokenData.isMH){
                              this.set('api.tokenIdMH', res.tokenData.tokenId)
                              this.set('api.tokenMH', res.tokenData.token)
                              this.set('api.nihiiMH',res.tokenData.nihiiMH)
                          }
                          else {
                              this.set('api.tokenId', res.tokenData.tokenId)
                              this.set('api.token', res.tokenData.token)
                          }
                          if(res.credential){
                              this.set("credentials",res.credential)
                          }
                      }
                  })
          } else {
              this.set("electronVersionOk", true)
          }

      })

      document.onmousemove = this.resetTimer.bind(this)
      document.onkeypress = this.resetTimer.bind(this)

      runtime.install({
          onUpdating: () => {
              console.log('SW Event: ', 'onUpdating');
              this.set('updateMessage', this.localize('new_upd_det','New update detected.',this.language))
              this.set('updateAction', null)
          },
          onUpdateReady: () => {
              console.log('SW Event: ', 'onUpdateReady');
              this.set('updateMessage', this.localize('new_upd_rea','New update ready',this.language))
              this.set('updateAction', this.localize('upd','Update'))
          },
          onUpdated: () => {
              console.log('SW Event: ', 'onUpdated');
              window.location.reload();
          },

          onUpdateFailed: () => {
              console.log('SW Event: ', 'onUpdateFailed');
              this.set('updateMessage', this.localize('upd_fail','Update failed, please refresh.'))
          }
      });

      this.api.icure().getVersion().then(v => {
          this.set("backendVersion", v.substring(0, v.indexOf('-')))
          this.set("backendVersionOk",this.versions.backend.includes(v))
      })

      this._checkShowWelcomePage()
      this._startCheckInactiveTimer()
  }

  doUpdate() {
      this.set('updateMessage', this.localize('upd_ing','Updating...'))
      this.set('updateAction', null)
      runtime.applyUpdate();
  }

  resetTimer() {
      this.set('connectionTime', +new Date())
  }

  _userSaved(e) {
      this.set('user', e.detail)
  }

  _debugPostUser() {
      return this.$.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
          console.log("user:", this.user)
          console.log("hcp:", hcp)
          if(hcp.parentId) {
              return this.$.api.hcparty().getHealthcareParty(hcp.parentId).then(hcp => {
                  console.log("parentHcp:", hcp)
              })
          }
      })
  }

  _openUtility(e) {
      if (e.detail && e.detail.panel === 'my-profile') {
          this._myProfile(e.detail.tab)
      } else if (e.detail && e.detail.panel === 'import-keychain') {
          this._importKeychain()
      }
  }


  _startCheckInactiveTimer() {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
          const timeBeforeDeconnection = Math.floor(60 - (+new Date() - this.connectionTime) / 1000 / 60)
          if (timeBeforeDeconnection > 0) {
              this.set('disconnectionTimer', timeBeforeDeconnection)
          } else {
              const creds = _.clone(this.credentials)
              this.set("isMultiUser",true)
              this.set('routeData.page', 'logout')
              this.credentials.username = creds.username
              this.credentials.ehpassword = creds.ehpassword
              this._triggerMenu()
          }
      }, 10000)

  }

  _timeCheck(period = 30000) {
      setTimeout(() => {
          if (this.api.isMH ? this.api.tokenIdMH : this.api.tokenId) {
              this.api.fhc().Stscontroller().checkTokenValidUsingGET(this.api.isMH ? this.api.tokenIdMH : this.api.tokenId).then(isTokenValid => {
                  if (!isTokenValid) {
                      this.uploadKeystoreAndCheckToken().then(() => {
                          this._timeCheck()
                      }).catch(() => this._timeCheck(10000))
                  } else {
                      this._timeCheck()
                  }
              }).catch(() => this._timeCheck(10000))
          } else {
              this.uploadKeystoreAndCheckToken().then(() => {
              this._timeCheck()
              }).catch(() => this._timeCheck(10000))
          }
      }, period)
  }

  _timeCheckMH(period = 30000){
      setTimeout(() => {
          if (this.api.tokenIdMH) {
              this.api.fhc().Stscontroller().checkTokenValidUsingGET(this.api.tokenIdMH).then(isTokenValid => {
                  if (!isTokenValid) {
                      this.uploadMHKeystoreAndCheckToken().then(() => {
                          this._timeCheckMH()
                      }).catch(() => this._timeCheckMH(10000))
                  } else {
                      this._timeCheckMH()
                  }
              }).catch(() => this._timeCheckMH(10000))
          } else {
              this.uploadMHKeystoreAndCheckToken().then(() => {
                  this._timeCheckMH()
              }).catch(() => this._timeCheckMH(10000))
          }
      }, period)
  }

  _inboxMessageCheck(period = 20000) {
      this.timeOutId && clearInterval(this.timeOutId)
          this.timeOutId = setInterval(() => {
          this.api.tokenId && this.checkEhboxMessage()
          }, period)
      }

  _routePageChanged(page) {
      if (page === 'logout') {

          this.route.__queryParams.oldToken=this.route.__queryParams.token
          this.route.__queryParams.token=""
          this.route.__queryParams.oldUserId=this.route.__queryParams.userId
          this.route.__queryParams.userId=""

          sessionStorage.removeItem('auth')

          this.authenticated = false

          this.worker && this.worker.terminate()

          if(this.view!=="auth")this.reset()
          this.set('routeData.page', '/')
          //setTimeout(() => window.location.reload(), 100) // don't reload at logout
      } else {
          console.log("page is -> " + page)

          if (!this.icureUrl) { this.setUrls() }

          if (!this.authenticated && (!page || !page.startsWith('auth'))) {
              if (sessionStorage.getItem('auth') || (this.route.__queryParams.token && this.route.__queryParams.userId)) {
                  this.loginAndRedirect(page)
              } else {
                  fetch('http://127.0.0.1:16042/logout')
                  this.set('routeData.page', 'auth/' + (!page ? 'main' : page.startsWith('logout') ? 'main' : page))
              }
          } else {
              const dest = page ? page.replace(/\/$/, '') : 'main'
              //keep patient opened
              if(dest==="pat" && this.subroute.path!=="/"){
                  this.set('patientOpened',this.subroute.path)
              }else if(dest==="pat" && this.view!=="pat" && this.patientOpened){
                  this.set("subroute.path",this.patientOpened)
              }else if(dest==="pat" && this.view==="pat" && this.patientOpened){
                  this.set('patientOpened',null)
              }

              if (dest !== this.view) { this.set('view', dest) }
          }
          this._startCheckInactiveTimer('refresh')
      }
  }

  _triggerMenu() {
      let menu = this.$.mobileMenu
      let overlay = this.$.overlayMenu

      overlay.classList.toggle('open')
      menu.classList.toggle('open')


  }

  _viewChanged(view) {
      if (view.startsWith('auth')) {
          this.$.loginDialog.open()
          return
      }
      if (this.lazyPages[view]) {
          this.lazyPages[view]()
      } else {
          this._showPage404()
      }

      if(this.view==="main"){
          this.$["htmain"].apiReady && this.$["htmain"].apiReady()
      }
  }

  _showPage404() {
      this.view = 'view404'
  }


  doRoute(e) {
      const routeTo = (e.target.dataset.name || _.get(_.filter(_.get(e,"path",[]), nodePath=> !!_.trim(_.get(nodePath,"dataset.name",""))),"[0].dataset.name","main")) + "/"
      this.set('routeData.page', routeTo)
      this._triggerMenu()
  }

  _openExportKey() {
      this.$['export-key'].open()
  }

  _importKeychain() {
      this.$['ht-import-keychain'].open()
  }

  _inviteHCP() {
      this.set('firstName','')
      this.set('lastName','')
      this.set('email','')
      this.set('warn','')
      this.$['ht-invite-hcp'].open()
  }

  _myProfile(tab) {
      this.$['ht-my-profile'].open(tab)
  }

  _selectEntities(){
      this.$['ht-app-account-selector'].open()
  }

  _showToasterMessage(id) {
      this.set(id, true)
      setTimeout(() => { this.set(id, false) }, 5000*2)
  }

  _checkKeystoreValidity() {
      //console.log("_checkKeystoreValidity: ", this.showKeystoreExpiredLabel, this.showKeystoreExpiresSoonLabel)
      const monthLimit = 2 // number of remaining months when to start warning the user

      this.api.fhc().Stscontroller().getKeystoreInfoUsingGET(this.api.keystoreId, this.credentials.ehpassword).then(info => {
          if(info.validity && info.validity - moment().valueOf() <= 0) {
              this.keyStoreValidityLabel = moment(info.validity).format("DD/MM/YYYY")
              this._showToasterMessage("showKeystoreExpiredLabel")
              this.set("showKeystoreExpiredStatusIcon", true)
              this.set("showKeystoreExpiresSoonStatusIcon", false)
          } else if(info.validity && info.validity - moment().add(monthLimit, 'months').valueOf() <= 0) {
              this.keyStoreValidityLabel = moment(info.validity).format("DD/MM/YYYY")
              this._showToasterMessage("showKeystoreExpiresSoonLabel")
              this.set("showKeystoreExpiresSoonStatusIcon", true)
              this.set("showKeystoreExpiredStatusIcon", false)
          } else {
              this.set("showKeystoreExpiredStatusIcon", false)
              this.set("showKeystoreExpiresSoonStatusIcon", false)
          }
      })

  }

  _getToken() {
      return this.$.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
      {
          const isMH = hcp.type && hcp.type.toLowerCase() === 'medicalhouse';
          return this.$.api.fhc().Stscontroller().requestTokenUsingGET(this.credentials.ehpassword, isMH ? hcp.nihii.substr(0,8): hcp.ssin, this.api.keystoreId, isMH).then(res => {
              this.$.eHealthStatus.classList.remove('pending')
              this.$.eHealthStatus.classList.remove('disconnected')
              this.$.eHealthStatus.classList.add('connected')

              this.set('api.isMH', isMH)
              if(isMH){
                  this.credentials.ehpasswordMH = this.credentials.ehpassword

                  this.set('api.keystoreIdMH', this.api.keystoreId)
                  this.set('api.tokenIdMH', res.tokenId)
                  this.set('api.tokenMH', res.token)
                  this.set('api.nihiiMH', hcp.nihii)

                  if(hcp.contactPersonHcpId){
                      this.$.api.hcparty().getHealthcareParty(hcp.contactPersonHcpId).then(hcpCt =>{
                          this.set('api.MHContactPersonName', hcpCt.lastName + ' ' + hcpCt.firstName)
                          this.set('api.MHContactPersonSsin', hcpCt.ssin)
                      });
                  }

              }else {
              this.set('api.tokenId', res.tokenId)
              this.set('api.token', res.token)
              }

              this.api.isElectronAvailable().then(electron =>{
                  if(electron){
                      fetch('http://127.0.0.1:16042/tokenFHC', {
                          method: "POST",
                          headers: {"Content-Type": "application/json"},
                          body: !isMH ? JSON.stringify({isMH:false,tokenId:this.api.tokenId, token:this.api.token}) : JSON.stringify({isMH:true,keystoreIdMH:this.api.keystoreIdMH, tokenIdMH:this.api.tokenIdMH, tokenMH:this.api.tokenMH, nihiiMH:this.api.nihiiMH})
                      }).then(response => response.json()).then(rep => {
                          if(rep.ok){
                              this.set('routeData.page', "diary")
                              setTimeout(() => this.shadowRoot.querySelector("#htDiary").loadMikornoIframe(), 100)
                          }
                      })
                  }
              })
              return res.tokenId
          }).catch((e) => {
              this.$.eHealthStatus.classList.remove('pending')
              this.$.eHealthStatus.classList.remove('connected')
              this.$.eHealthStatus.classList.add('disconnected')
              throw(e)
          })
      }
      )
  }
  _versionOk(a,b) {
      return a && b ? 'ok' : 'nok'
  }
  _getMHToken() {
      //TODO: change the request for MH
      //this.api.fhc().Stscontroller().requestTokenUsingGET(k.passPhrase, this.getNihii8(MHNihii), k.uuid, true )
      //get the password from local storage
      //let mhPassword= "";
      return this.$.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
          .then(hcp => hcp.parentId ? this.$.api.hcparty().getHealthcareParty(hcp.parentId) : hcp)
          .then(hcpMH => {
              this.set('hasMHCertificate', hcpMH && this.api.keystoreIdMH)
              return this.$.api.fhc().Stscontroller().requestTokenUsingGET(this.credentials.ehpasswordMH, hcpMH.nihii.substr(0, 8), this.api.keystoreIdMH, true).then(res => {
                  if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                  if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('disconnected')
                  !_.isEmpty(res) ? this.root.getElementById('eHealthMHStatus') ? this.root.getElementById('eHealthMHStatus').classList.add('connected') : null : this.root.getElementById('eHealthMHStatus').classList.add('disconnected')

              this.set('api.tokenIdMH', res.tokenId)
              this.set('api.tokenMH', res.token)
              this.set('api.nihiiMH', hcpMH.nihii)
              return res.tokenId
              })
          }).catch((e) => {
              if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
              if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('connected')
              if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('disconnected')
              throw(e)
          })
  }

  loginAndRedirect(page) {
      const sAuth = JSON.parse(sessionStorage.getItem('auth'))
      if (!this.credentials || (!this.credentials.password && sAuth && sAuth.password) || (!this.credentials.appToken && sAuth && sAuth.appToken)) {
          this.set('credentials', sAuth)
      }

      if (this.route.__queryParams.token && this.route.__queryParams.userId) {
          this.set('headers', _.assign(_.assign({}, this.headers),
              {Authorization: 'Basic ' + btoa(this.route.__queryParams.userId + ':' + this.route.__queryParams.token)}))
      } else if ((this.credentials.userId && this.credentials.appToken)) {
          this.set('headers', _.assign(_.assign({}, this.headers),
              {Authorization: 'Basic ' + btoa(this.credentials.userId + ':' + this.credentials.appToken)}))
      }
      // else if ((this.credentials.username && this.credentials.password)) {
      else this.set('headers', _.assign(_.assign({}, this.headers),
              {Authorization: 'Basic ' + btoa(this.credentials.username + ':' + this.credentials.password + (this.credentials.twofa ? '|' + this.credentials.twofa : ''))}))
      // }

      //Be careful not to use this.api here as it might not have been defined yet
      //TODD debounce here
      this.$.api.user().getCurrentUser().then(u => {
          if(this.isMultiUser) {
              this._selectEntities()
          }

          this.api.user().getCurrentSession().then(sessionId => this.api.set('sessionId', sessionId))

          this.set('user', u)
          this.user.roles && this.user.roles.find(r => r === 'ADMIN' || r === 'MS-ADMIN' || r === 'MS_ADMIN') ? this.set('isAdmin', true) : this.set('isAdmin', false)
          this.set('connectionTime', +new Date())
          this.api.hcparty().getCurrentHealthcareParty().then(hcp => {
              const language = (hcp.languages || ['fr']).find(lng => lng && lng.length === 2)
              language && this.set('language', language)

              this.$.loginDialog.opened = false

              if(this.route.__queryParams.oldToken && Object.keys(this.user.applicationTokens).find(key =>this.user.applicationTokens[key]===this.route.__queryParams.oldToken) && this.route.__queryParams.oldUserId && this.route.__queryParams.oldUserId===this.user.id){
                  this.route.__queryParams.token = this.route.__queryParams.oldToken
                  this.route.__queryParams.userId =this.route.__queryParams.oldUserId
              }

              this.api.isElectronAvailable().then(electron => {
                  this.set("isElectron",electron)
                  if (electron === true) {
                      //request electron tc.
                      fetch('http://localhost:16042/tc', {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json; charset=utf-8"
                          },
                          body: JSON.stringify({
                              "userId": this.user.id,
                              "token": this.user.applicationTokens.MIKRONO || this.user.applicationTokens.tmp || this.user.applicationTokens.tmpFirstLogin,
                              "credential": this.api.credentials
                          })
                      })
                  }
              })

              this.set('credentials.twofa', null)
          u.groupId ? this.set('credentials.userId', u.groupId+"/"+u.id) : this.set('credentials.userId', u.id)
              this.set('credentials.appToken', u.applicationTokens && u.applicationTokens.ICC)

              if ((this.credentials.userId && this.credentials.appToken)) {
                  this.set('credentials.password', null)
                  this.set('headers.Authorization', 'Basic ' + btoa(this.credentials.userId + ':' + this.credentials.appToken))
              }
              sessionStorage.setItem('auth', JSON.stringify(this.credentials))
          localStorage.setItem('last_connection',this.credentials.username)

              if (!this.authenticated) {
                  this.authenticated = true

              const loadKeysForParent = (parentId, prom) => {
                  if (parentId) {
                      return prom.then(([success, destPage]) => {
                          if (success) {
                              return this.api.hcparty().getHealthcareParty(parentId).then(hcp =>
                                  loadKeysForParent(hcp.parentId, this.loadOrImportRSAKeys(u, hcp, destPage))
                              )
                          } else {
                              return Promise.resolve([success, destPage])
                          }
                      })
                  } else {
                      return prom
                  }
              }

              loadKeysForParent(hcp.parentId, this.loadOrImportRSAKeys(u, hcp, page)).then(([success, page]) => {
                  if (success) {
                              const destPage = page || (this.routeData && this.routeData.page === 'auth' && this.subrouteData && this.subrouteData.page ? this.subrouteData.page : 'main')
                              if (!this.routeData || destPage !== this.routeData.page) {
                                  this.set('routeData.page', destPage)
                              } else {
                                  this._routePageChanged(destPage)
                              }
                  }
              })
          }
          this._timeCheck()
              this._timeCheckMH(0)//Should launch directly, no wait in this case!!!
              this._inboxMessageCheck()
              this._checkForUpdateMessage()
              //this._correctionGenderPatients();

          })
      }).catch(function (e) {
          this.authenticated = false
          sessionStorage.removeItem('auth')
          this.set("credentials.error", "Wrong user or password")
      }.bind(this))
  }

  loadOrImportRSAKeys(u, hcp, page) {
      return new Promise((resolve, reject) => {
          if (this.$.api.crypto().RSA.loadKeyPairNotImported(hcp.id)) {
              this.$.api.crypto().checkPrivateKeyValidity(hcp).then(ok => {
                  this.set("keyHcpId", hcp.id)
                  if (ok) {
                      this.api.loadUsersAndHcParties()
                      this.uploadKeystoreAndCheckToken().catch(e => console.log(e))
                      resolve([true, page])
                          } else {
                              this.registerKeyPairDialogMessage = "The key registered in your browser is invalid"
                      this.registerKeyPairDialogResolution = ([resolve,reject])
                              this.$.registerKeyPairDialog.opened = true
                          }
                      })
                  } else {
              this.set("keyHcpId", hcp.id)
                      if (hcp.publicKey) {
                          this.registerKeyPairDialogMessage = ""
                  this.registerKeyPairDialogResolution = ([resolve,reject])
                          this.$.registerKeyPairDialog.opened = true
                      } else {
                          console.log("HCP public key is " + hcp.publicKey, hcp)
                  this.registerKeyPairDialogResolution = ([resolve,reject])
                          this.$.firstConnectionDialog.opened = true
                      }
                  }

          })
  }

  uploadKeystoreAndCheckToken() {
      if (this.credentials.ehpassword) {
          const ehKeychain = this.$.api.crypto().loadKeychainFromBrowserLocalStorage(this.user.healthcarePartyId)
          if (ehKeychain) {
              return this.$.api.fhc().Stscontroller().uploadKeystoreUsingPOST(ehKeychain).then(res => {
                  this.$.api.keystoreId = res.uuid
                  this._checkKeystoreValidity()
                  return this._getToken()
              }).catch((e) => {
                  this.$.eHealthStatus.classList.remove('pending')
                  this.$.eHealthStatus.classList.remove('connected')
                  this.$.eHealthStatus.classList.add('disconnected')
                  throw(e)
              })
          } else {
              this.$.noehealth.classList.add("notification")

              this.$.eHealthStatus.classList.remove('pending')
              this.$.eHealthStatus.classList.remove('connected')
              this.$.eHealthStatus.classList.add('disconnected')
          }
      } else {
          this.$.eHealthStatus.classList.remove('pending')
          this.$.eHealthStatus.classList.remove('connected')
          this.$.eHealthStatus.classList.add('disconnected')
      }
      return Promise.resolve(null);
  }


  uploadMHKeystoreAndCheckToken() {
      if(!_.get(this, "user.healthcarePartyId", false)) return Promise.resolve()
      const ksKey  = "org.taktik.icure.ehealth.keychain.MMH."+ this.user.healthcarePartyId;
      Object.keys(localStorage).filter(k => k === ksKey).map(kM => {
          const val = localStorage.getItem(kM);
          Object.keys(localStorage).map(kA => {
              if(localStorage.getItem(kA) === val){
                  this.getDecryptedValueFromLocalstorage(this.user.healthcarePartyId, kA.replace("keychain.","keychain.password."))
                      .then( password => {
                          if (password) {
                          this.credentials.ehpasswordMH = password
                              const ehKeychain = this.$.api.crypto().loadKeychainFromBrowserLocalStorage("MMH."+ this.user.healthcarePartyId)
                              if (ehKeychain) {
                                  return this.$.api.fhc().Stscontroller().uploadKeystoreUsingPOST(ehKeychain).then(res => {
                                      this.$.api.keystoreIdMH = res.uuid
                                      return this._getMHToken()
                                  }).catch((e) => {
                                      if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                                      if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('connected')
                                      if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('disconnected')
                                      throw(e)
                                  })
                              } else {
                                  //TODO: notif for no MH session
                                  //this.$.noehealth.classList.add("notification")
                                  if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                                  if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('connected')
                                  if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('disconnected')
                              }
                          } else {
                              if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('pending')
                              if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.remove('connected')
                              if(this.root.getElementById('eHealthMHStatus')) this.root.getElementById('eHealthMHStatus').classList.add('disconnected')
                          }
                          return Promise.resolve()
                      });
              }
          })
      })
      return Promise.resolve(null);
  }

  login(event, loginObject) { /* this is called from mouseDown with 2 arguments */
      this._updateServerUrl( loginObject.icureurl, loginObject.fhcurl )

      this.set('credentials', loginObject && loginObject.credentials)
      this.loginAndRedirect(loginObject && loginObject.page)
  }

  importPrivateKey(e, selectedRsaFile) {
      let hcpId;
      if(this.keyHcpId == null) {
          hcpId = this.user.healthcarePartyId
      } else {
          hcpId = this.keyHcpId
      }
      selectedRsaFile && selectedRsaFile.name && this.api.crypto().loadKeyPairsInBrowserLocalStorage(hcpId, selectedRsaFile).then(function () {
          if (this.$.api.crypto().RSA.loadKeyPairNotImported(hcpId)) {
              this.$.registerKeyPairDialog.opened = false
              this.set("registerKeyPairDialogMessage", "")

              this.registerKeyPairDialogResolution[0]([true, 'main/'])
          } else {
              this.set("registerKeyPairDialogMessage", "Invalid key file")
              this.$.registerKeyPairDialog.reset()
          }
      }.bind(this)).catch(e => {console.log(e); this.registerKeyPairDialogResolution[1](e)})
  }

  importScannedPrivateKey(e, jwkKey) {
      let hcpId;
      if(this.keyHcpId == null) {
          hcpId = this.user.healthcarePartyId
      } else {
          hcpId = this.keyHcpId
      }
      this.api.crypto().loadKeyPairsAsJwkInBrowserLocalStorage(hcpId, jwkKey).then(function () {
          if (this.$.api.crypto().RSA.loadKeyPairNotImported(hcpId)) {
              this.$.registerKeyPairDialog.opened = false
              this.set("registerKeyPairDialogMessage", "")
              this.registerKeyPairDialogResolution[0]([true, 'main/'])
          } else {
              this.set("registerKeyPairDialogMessage", "Invalid key file")
              this.$.registerKeyPairDialog.reset()
          }
      }.bind(this)).catch(e => {console.log(e); this.registerKeyPairDialogResolution[1](e)})
  }

  togglePanel(e) {
  }

  confirmUserInvitation() {
      if (this.validInvite) {
          // See if user exists first, based on email address
          this.api.user().getUserByEmail(this.email).then(existingUserDto => {
              if (existingUserDto && existingUserDto.id) {
                  this.$['ht-invite-hcp-user-already-exists'].open()
              } else {
                  this.createAndInviteUser();
              }
          }).catch( error=> {
              this.createAndInviteUser();
          })
      }
  }

  checkEhboxMessage() {
      if (!this.user) { return }
      const lastLoad = parseInt(localStorage.getItem('lastEhboxRefresh')) ? parseInt(localStorage.getItem('lastEhboxRefresh')) : -1
      const shouldLoad = (lastLoad + (10*60000) <= Date.now() || lastLoad === -1)
      if ( /*localStorage.getItem('receiveMailAuto') === 'true' && */ shouldLoad) {
          localStorage.setItem('lastEhboxRefresh', Date.now())

          const getParents = (id, keyPairs) => this.api.hcparty().getHealthcareParty(id).then(hcp => {
              keyPairs[hcp.id] = this.api.crypto().RSA.loadKeyPairNotImported(id)
              if (hcp.parentId) {
                  return getParents(hcp.parentId, keyPairs)
              }
              return ([hcp, keyPairs])
          })

          this.$.ehBoxMessage.classList.remove('notification')

          if (!this.worker) { this.worker = new Worker() }

          getParents(this.user.healthcarePartyId, {}).then(([hcp, kp]) => this.getAlternateKeystores().then(alternateKeystores => {
              this.worker.postMessage({
                  action: "loadEhboxMessage",
                  hcpartyBaseApi: this.api.hcpartyLight(),
                  fhcHost: this.api.fhc().host,
                  fhcHeaders: JSON.stringify(this.api.fhc().headers),
                  language: this.language,
                  iccHost: this.api.host,
                  iccHeaders: JSON.stringify(this.api.headers),
                  tokenId: this.api.tokenId,
                  keystoreId: this.api.keystoreId,
                  user: this.user,
                  ehpassword: this.credentials.ehpassword,
                  boxId: ["INBOX","SENTBOX"],
                  alternateKeystores: ({keystores: alternateKeystores.filter(ak => ak.passPhrase)}),
                  keyPairs: kp,
                  parentHcp: hcp
              })
          }))

          this.worker.onmessage = e => {

              const totalNewMessages = parseInt(_.get(e,"data.totalNewMessages",0))
              if(parseInt(totalNewMessages)) {
                  this.set("_forceEhBoxRefresh", true)
                  this.set('ehBoxWebWorkerTotalNewMessages', totalNewMessages)
                  this.$['ehBoxMessage'].classList.add('notification');
                  setTimeout(() => { this.set("_forceEhBoxRefresh", false) }, 1000);
                  setTimeout(() => { this.$['ehBoxMessage'].classList.remove('notification'); }, 15000);
              }

              if(!!_.get(e,"data.forceRefresh",false)) {
                  this.set("_forceEhBoxRefresh", true);
                  setTimeout(() => { this.set("_forceEhBoxRefresh", false) }, 1000);
              }

          }

      }

  }

  getMHKeystore(){
      const healthcarePartyId =this.user.healthcarePartyId;
      // MHPrefix ? MHPrefix + "." + this.user.healthcarePartyId :

  }

  getAlternateKeystores(){
      const healthcarePartyId = this.user.healthcarePartyId;

      return Promise.all(
      Object.keys(localStorage).filter(k => k.includes(this.api.crypto().keychainLocalStoreIdPrefix + healthcarePartyId + ".") === true)
          .map(fk => this.getDecryptedValueFromLocalstorage(healthcarePartyId, fk.replace("keychain.","keychain.password."))
					    .then( password =>
                  (this.keyPairKeystore[fk])?
                      // Get fhc keystore UUID in cache
                      new Promise(x => x(({uuid: this.keyPairKeystore[fk], passPhrase: password}))):
                      // Upload new keystore
                      this.$.api.fhc().Stscontroller().uploadKeystoreUsingPOST(this.api.crypto().utils.base64toByteArray(localStorage.getItem(fk)))
                          .then(res => this.addUUIDKeystoresInCache(fk, res.uuid, password))

              )
          )
      )
  }

  addUUIDKeystoresInCache(key, uuid, password){
      return new Promise(x =>{
					this.keyPairKeystore[key] = uuid;
          x(({uuid: uuid, passPhrase: password}))
      })

  }

  getDecryptedValueFromLocalstorage(healthcarePartyId, key){
      let item = localStorage.getItem(key);

      return this.api.crypto().hcpartyBaseApi.getHcPartyKeysForDelegate(healthcarePartyId)
          .then(encryptedHcPartyKey =>
              this.api.crypto().decryptHcPartyKey(healthcarePartyId, healthcarePartyId, encryptedHcPartyKey[healthcarePartyId], true)
          )
          .then(importedAESHcPartyKey =>
              (item)?this.api.crypto().AES.decrypt(importedAESHcPartyKey.key, this.api.crypto().utils.text2ua(item)):null
          )
          .then(data =>
              (data)?this.api.crypto().utils.ua2text(data):null
          );
  }

  _logList() {
      this.$['ht-access-log'].open()
  }

  _patientChanged(e) {
      this.set("patient", e.detail.patient);
  }

  _timeFormat(date) {
      return date ? this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : '';
  }

  _ageFormat(date) {
      return date ? this.api.getCurrentAgeFromBirthDate(date,( e , s ) => this.localize(e, s, this.language)) : '';
  }

  getGender(gender){
      if(gender==="male")return "M.";
      if(gender==="female")return "Mme";
      else return "";
  }

  picture(pat) {
      if (!pat) {
          return require('../images/male-placeholder.png');
      }
      return pat.picture ? 'data:image/png;base64,' + pat.picture : (pat.gender && pat.gender.substr(0,1).toLowerCase() === 'f') ? require('../images/female-placeholder.png') : require('../images/male-placeholder.png');
  }

  createAndInviteUser(){
      this.api.hcparty().createHealthcareParty({
          "name": this.lastName + " " + this.firstName,
          "lastName": this.lastName,
          "firstName": this.firstName,
          "nihii": this.nihii,
          "ssin": this.ssin
      }).then(hcp => {
          this.api.user().createUser({
              "healthcarePartyId": hcp.id,
              "name": this.lastName + " " + this.firstName,
              "email": this.email,
              "applicationTokens": {"tmpFirstLogin": this.api.crypto().randomUuid()},
              "status": "ACTIVE",
              "type": "database"
          }).then(usr => {
              this.invitedHcpLink = window.location.origin + window.location.pathname + '/?userId=' + usr.id + '&token=' + usr.applicationTokens.tmpFirstLogin
              this.$['ht-invite-hcp-link'].open()
          })
      })
  }

  _redirectToAnotherEntity(e){
      if(e.detail){
          this.set("isMultiUser",false)
          this.$['ht-app-account-selector'].close()
          this.login(e, {credentials: e.detail})
      }
  }

  _tuto(){
      // this.$['tutorialDialog'].open()
      window.open("https://www.topaz.care/fr/support/");
  }

  checkAndLoadMikrono(){
      if(this.user){
          this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {

              const applicationTokens = this.user.applicationTokens
              const mikronoUrl = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url").typedValue.stringValue || null
              const mikronoUser = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user").typedValue.stringValue || null
              const mikronoPassword = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password").typedValue.stringValue || null


              if(mikronoUrl && mikronoUser && mikronoPassword && applicationTokens && applicationTokens.MIKRONO){
                  this.api.isElectronAvailable().then(electron =>{
                      if(electron === false){
                          window.open("https://"+mikronoUser+":"+mikronoPassword+"@"+mikronoUrl.replace("https://", "")+"/iCureShortcut.jsp?id="+this.user.id, '_blank')
                      }else{
                          fetch('http://127.0.0.1:16042/mc', {
                              method: "POST",
                              headers: {"Content-Type": "application/json"},
                              body: JSON.stringify({username:mikronoUser, password:mikronoPassword})
                          }).then(response => response.json()).then(rep => {
                              if(rep.ok){
                                  this.set('routeData.page', "diary")
                                  setTimeout(() => this.shadowRoot.querySelector("#htDiary").loadMikornoIframe(), 100)
                              }
                          })


                      }
                  })

              }else{
                  const addresses = hcp && hcp.addresses || null
                  const workAddresses = addresses.find(adr => adr.addressType === "work") || null
                  const telecoms = workAddresses && workAddresses.telecoms
                  const workMobile = telecoms && telecoms.find(tel => tel.telecomType === "mobile" || tel.telecomType === "phone") || null
                  const workEmail = telecoms && telecoms.find(tel => tel.telecomType === "email") || null

                  if(workMobile && workMobile.telecomNumber !== "" && workEmail && workEmail.telecomNumber !== ""){
                      this.api.onlinebemikrono().register(this.user.id, {}).then(user => {
                          if(user === true){
                              this.api.user().getUser(this.user.id).then(u => {
                                  this.set('user', u)
                                  const mikronoUrl = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url").typedValue.stringValue || null
                                  const mikronoUser = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user").typedValue.stringValue || null
                                  const mikronoPassword = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password").typedValue.stringValue || null
                                  if(mikronoUrl && mikronoUser && mikronoPassword && applicationTokens && applicationTokens.MIKRONO){
                                      this.api.isElectronAvailable().then(electron =>{
                                          if(electron === false){
                                                      window.open("https://" + mikronoUser + ":" + mikronoPassword + "@" + mikronoUrl.replace("https://", "") + "/iCureShortcut.jsp?id=" + this.user.id, '_blank')
                                          }else{
                                              fetch('http://127.0.0.1:16042/mc', {
                                                  method: "POST",
                                                  headers: {"Content-Type": "application/json"},
                                                  body: JSON.stringify({username:mikronoUser, password:mikronoPassword})
                                              }).then(response => response.json()).then(rep => {
                                                  if(rep.ok){
                                                      this.set('routeData.page', "diary")
                                                      setTimeout(() => this.shadowRoot.querySelector("#htDiary").loadMikornoIframe(), 100)
                                                  }
                                              })


                                          }
                                                  })
                                              }else{
                                      this.set("mikronoError", {
                                          addresses: false,
                                          workAddresses : false,
                                          workMobile: false,
                                          workEmail : false,
                                          token: applicationTokens.MIKRONO ? true : false,
                                          error: true
                              })
                                  }
                              })
                          }else{
                              this.set("mikronoError", {
                                  addresses: addresses ? true : false,
                                  workAddresses : workAddresses ? true : false,
                                  workMobile: workMobile ? true : false,
                                  workEmail : workEmail ? true : false,
                                  token: applicationTokens.MIKRONO ? true : false,
                                  error: true
                              })
                          }

                      })
                  }else{
                      this.set("mikronoError", {
                          addresses: addresses ? true : false,
                          workAddresses : workAddresses ? true : false,
                          workMobile: workMobile ? true : false,
                          workEmail : workEmail ? true : false,
                          token: applicationTokens.MIKRONO ? true : false,
                          error: false
                      })

                      this.$['mikronoErrorDialog'].open()
                  }
              }

          })
      }
  }

  mikronoAppointmentsMigration(){

      const applicationTokens = _.get(this.user, "applicationTokens", "" )
      const mikronoUrl = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.url").typedValue.stringValue || null
      const mikronoUser = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.user").typedValue.stringValue || null
      const mikronoPassword = this.user && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password") && this.user.properties.find(p => p.type.identifier === "org.taktik.icure.be.plugins.mikrono.password").typedValue.stringValue || null

      if(mikronoUrl && mikronoUser && mikronoPassword && applicationTokens && applicationTokens.MIKRONO){
          this.busySpinner = true;
          this.set("migrationItems", [])
          this.$["appointmentsMigrationDialog"].open()
          this.push("migrationItems", {status: "", item: "Récupération de vos rendez-vous en cours..."})

          let appointments = []

          // TODO: Restore me
          // this.api.calendaritem().getCalendarItemsByPeriodAndHcPartyId(moment().subtract(1, 'months').format('YYYYMMDDHHmmss'), moment().add(3, 'months').format('YYYYMMDDHHmmss'), this.user.healthcarePartyId).then(items => {
          this.api.hcparty().getCurrentHealthcareParty().then(hcp => {
              return Promise.all([this.api.calendaritem().getCalendarItemsByPeriodAndHcPartyId(moment().subtract(15, 'days').format('YYYYMMDDHHmmss'), moment().add(6, 'months').format('YYYYMMDDHHmmss'), this.user.healthcarePartyId)].concat(
                  hcp.parentId ? [this.api.calendaritem().getCalendarItemsByPeriodAndHcPartyId(moment().subtract(15, 'days').format('YYYYMMDDHHmmss'), moment().add(6, 'months').format('YYYYMMDDHHmmss'), hcp.parentId)] : []
              )).then(([a, b]) => {
                  const items = a.concat(b.filter(calItem => calItem.responsible === hcp.id))
              this.push("migrationItems", {status: "", item: "Traitement de vos rendez-vous en cours..."})
              return items.filter( item => parseInt(_.get(item, "startTime", 0)) && parseInt(_.get(item, "endTime", 0)) && !_.get(item, "wasMigrated", false) ).map(item => ({
                  comments: _.trim(_.get(item, "details", ""))||null,
                  externalCustomerId: _.trim(_.get(item, "patientId", ""))||null,
                  customerComments: _.trim(_.get(item, "details", ""))||null,
                  title: _.trim(_.get(item, "title", ""))||null,
                  startTime: ( parseInt(_.get(item, "startTime", 0)) ? moment(_.trim(_.get(item, "startTime", "")), "YYYYMMDDHHmmss").format("YYYY-MM-DDTHH:mm:ss")+"Z":null),
                  endTime: ( parseInt(_.get(item, "startTime", 0)) ? moment(_.trim(_.get(item, "endTime", "")), "YYYYMMDDHHmmss").format("YYYY-MM-DDTHH:mm:ss")+"Z":null),
                  type: null,
                  street: _.trim(_.get(item, "addressText", ""))||null,
                  originalObject: _.merge({wasMigrated: true}, item)
              }))
              })
          }).then(apps => {

              console.log(apps);

              this.push("migrationItems", {status: "", item: "Migration de vos rendez-vous en cours..."})
              if(apps && apps.length !== 0){
                  let prom = Promise.resolve([])
                  _.chunk(apps, 100).forEach(chunkOfAppointments => {
                      prom = prom.then(prevResults => this.api.bemikrono().createAppointments(chunkOfAppointments).then(() => {

                          // TODO: make this evolve and pass appointments by batches
                          _.forEach( chunkOfAppointments, (i=>{ this.api.calendaritem().modifyCalendarItem(_.get(i, "originalObject")).then(() => { /*this.push("migrationItems", { status: "", item: "Migration terminée"})*/ }) }))

                      }).then(res => {
                          this.push("migrationItems", {status: "", item: "100 rendez-vous (de plus) migrés..."})
                          return prevResults.concat(res)
                      }))
                  })
                  prom = prom.then(results => {
                      this.$["appointmentsMigrationDialog"].close()
                      this.busySpinner = false;
                      window.open("https://" + mikronoUser + ":" + mikronoPassword + "@" + mikronoUrl.replace("https://", "") + "/iCureShortcut.jsp?id=" + this.user.id, '_blank')
                  }).catch((e)=>{this.busySpinner = false;})
              }else{
                  this.busySpinner = false;
                  window.open("https://"+mikronoUser+":"+mikronoPassword+"@"+mikronoUrl.replace("https://", "")+"/iCureShortcut.jsp?id="+this.user.id, '_blank');
              }
          }).catch((e)=>{this.busySpinner = false;})
}

  }

  _triggerOpenMyProfile(e) {
      this._myProfile(parseInt(_.get(e,"detail.tabIndex",1)));
  }

  _triggerOpenAdminGroupsManagementSubMenu(e) {
      this.set('routeData.page', "admin"); this._triggerMenu();
      this.$['htAdmin'] && typeof this.$['htAdmin'].handleMenuChange === "function" && this.$['htAdmin'].handleMenuChange({detail:{selection:{item: 'management',submenu:'facturationFlatRateManagementSubMenu'}}});
  }

  _checkForUpdateMessage(){
      if(this.user){
          this.$['htUpdateDialog']._openDialog()
      }
  }

  setElectronErrorMessage(e){
      this.set("electronErrorMessage",e.detail.message)
      this.$["electronErrorMessage"].classList.add('notification')
      setTimeout(() => this.closeNotifElectron(), 5000)
  }

  closeNotifElectron(e){
      this.$["electronErrorMessage"].classList.remove('notification')
      this.set("electronErrorMessage","")
  }

  //Deprecated - restore date of brith of patients with the ssin of patient
  _correctionDateOfBirth() {

      if( !this.user || !this.api || !!this.busyCorrectingDatesOfBirth || moment().format("YYYYMMDD") > "20190901" ) return;
      this.busyCorrectingDatesOfBirth = true;

      this._getPatientsByHcp(_.get(this, "user.healthcarePartyId",""),this.filterForDate)
          .then(myPatients=>_.chain(myPatients).filter(p => [6,8,11,13].indexOf(_.trim(p.ssin).length) > -1 && !(parseInt(p.dateOfBirth)||null)).value())
          .then(patients => {

              let prom = Promise.resolve([])

              _.map(patients, pat => {
                  prom = prom.then(promisesCarrier => {
                      const patSsin = _.trim(_.get(pat,"ssin"))
                      const patSsinLength = parseInt(patSsin.length)||0
                      const evaluatedDateOfBirth = !!(patSsinLength === 6 && /^\d{2}(1[0-2])|(0[1-9])([0-2]\d)|(3[0-1])$/.test(patSsin)) ? (/^[0-1]/.test(patSsin) ? '20' : '19') + patSsin :
                          !!(patSsinLength === 8 && /^\d{4}(1[0-2])|(0[1-9])([0-2]\d|3[0-1])$/.test(patSsin)) ? patSsin :
                          !!(patSsinLength === 11 && this.api.patient().isValidSsin(patSsin)) ? (/^[0-1]/.test(patSsin) ? '20' : '19') + patSsin.substring(0, 6) :
                          !!(patSsinLength === 13 && this.api.patient().isValidSsin(patSsin.substring(2))) ? patSsin.substring(0, 8) :
                          false
                      return !evaluatedDateOfBirth ?
                          Promise.resolve() :
                          this.api.patient().modifyPatientWithUser(this.user,_.merge({},pat,{dateOfBirth:parseInt(evaluatedDateOfBirth)||null}))
                              .then(p=>this.api.register(p,"patient"))
                              .then(p=>_.concat(promisesCarrier, p))
                              .catch(()=>Promise.resolve())
                  })
              })

              return prom
                  .then(() => {
                      this.busyCorrectingDatesOfBirth = false
                      setTimeout(() => { this._correctionDateOfBirth() }, 3600000)
                  })

          })

  }

  // - restore gender of patients with the ssin of patient
  _correctionGenderPatients(){
      const isChecked = localStorage.getItem("checked_gender_"+_.get(this,"user.healthcarePartyId","0")) || false;
      if( !this.user || isChecked || !!this.busyCorrectingGender || !this.api || moment().format("YYYYMMDD") > "20191201" ) return;
      this.busyCorrectingGender = true;

      this._getPatientsByHcp(_.get(this, "user.healthcarePartyId",""),this.filterForGender)
          .then(patients => _.chain(patients).filter(p => this.api.patient().isValidSsin(p.ssin)).value())
          .then(patients => {
              let prom = Promise.resolve([])
              let number = 1;
              _.map(patients, pat => {
                  prom = prom.then(promisesCarrier => {
                      const gender = pat.ssin.slice(6, 9) % 2 === 1 ? "male" : "female";
                      console.log("patient n°"+number+"/"+patients.length+" with ssin n°"+pat.ssin+" : gender de base ==="+pat.gender+" | nouveau gender ==="+gender)
                      number+=1;
                      if (gender !== pat.gender) {
                          return this.api.patient().modifyPatientWithUser(this.user,_.merge({},pat,{gender : gender || "unknow"}))
                              .then(p=>this.api.register(p,"patient"))
                              .then(p=>_.concat(promisesCarrier, p))
                              .catch(()=>Promise.resolve())
                      }else{
                          return Promise.resolve([])
                      }
                  })
              })

              return prom
                  .then(() => {
                      this.busyCorrectingGender = false
                      console.log("fini")
                      localStorage.setItem("checked_gender_"+_.get(this,"user.healthcarePartyId","0"),true);
                  })
          })
  }

  filterForDate(pl){
      return _.filter( pl.rows, i => !_.trim(_.get(i,"dateOfBirth", "")) && !!_.trim(_.get(i,"ssin", "")) && parseInt(_.get(i,"ssin", "")) )
}

  filterForGender(pl){
      return _.filter( pl.rows, i => parseInt(_.get(i,"ssin", "0")))
  }

  _getPatientsByHcp(hcpId,filterFunction) {
      return this.api.getRowsUsingPagination(
          (key,docId) =>
              this.api.patient().listPatientsByHcPartyWithUser(this.user, hcpId, null, key && JSON.stringify(key), docId, 1000)
                  .then(pl => {
                      return {
                          rows: filterFunction(pl),
                          nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                          nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                          done: !pl.nextKeyPair
                      }
                  })
                  .catch(()=>{ return Promise.resolve(); })
      )||[];
  }

  _refreshPatient() {
      const htPat = this.shadowRoot.querySelector("#ht-pat") || this.$['ht-pat'] || null
      return !htPat || typeof _.get(htPat, "_refreshPatient", false) !== "function" ? null : htPat._refreshPatient()
  }

  forceReloadPatient(e){
      if(e.detail && e.detail.origin && e.detail.origin.includes("ht-auto-read-eid-opening")){
          this._refreshPatient();
      }
  }

  resourceAndLanguageChanged(){
      if(!this.resources || !this.language)return;
      const months =  Array.from(Array(12).keys()).map(month =>this.localize("month_"+(month+1),month+1,this.language || "en"))
      const weeks = Array.from(Array(7).keys()).map(month =>this.localize("weekDay_"+(month+1),"un jour",this.language || "en"))
      weeks.unshift(weeks[6])
      weeks.pop()
      this.set("i18n.monthNames",months)
      this.set("i18n.monthNamesShort",months.map(month => month.substr(0,3)))
      this.set("i18n.weekdays",weeks)
      this.set("i18n.weekdaysShort",weeks.map(day => day.substr(0,3)))
      this.set("i18n.week",this.localize('week','Semaine',this.language));
      this.set("i18n.calendar",this.localize('calendar','Calendrier',this.language))
      this.set("i18n.clear",this.localize('clear','Clear',this.language))
      this.set("i18n.today",this.localize("sel_tod",'Aujourd\'hui',this.language))
      this.set("i18n.thisMonth",this.localize("this_month","ce mois-ci",this.language))
      this.set("i18n.thisYear",this.localize("this_year","cette année",this.language))
      this.set("i18n.cancel",this.localize("can",'Annuler',this.language))
  }

  _isPatientView(){
      return this.route.path.includes("/pat")
  }
}

customElements.define(HtApp.is, HtApp)
