/*<link rel="import" href="../../../bower_components/vaadin-radio-button/vaadin-radio-button.html">*/
/*<link rel="import" href="../ht-lab/ht-lab-details.html">*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '../ht-spinner/ht-spinner.js';

import '../filter-panel/filter-panel.js';
import '../dynamic-form/dynamically-loaded-form.js';
import '../dynamic-form/entity-selector.js';
import '../../styles/spinner-style.js';
import '../../styles/buttons-style.js';
import '../dynamic-form/dynamic-doc.js';
import '../pdf-element/pdf-element.js';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-card/paper-card"
import "@polymer/paper-tooltip/paper-tooltip"
import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-date-picker/vaadin-date-picker"
import "@vaadin/vaadin-text-field/vaadin-text-area"
import "@vaadin/vaadin-text-field/vaadin-text-field"

import _ from 'lodash/lodash';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtMsgDocDetail extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style include="shared-style spinner-style buttons-style">
			:host{
				position: relative;
				background: var(--app-background-color-light);
				overflow-y: auto;
			}
			.notification-panel {
				position: fixed;
				top:50%;
				right: 0;
				z-index:1000;
				color: white;
				font-size: 13px;
				background: rgba(255, 0, 0, 0.55);
				height: 96px;
				padding: 0 8px 0 12px;
				border-radius: 3px 0 0 3px;
				overflow: hidden;
				white-space: nowrap;
				width: 0;
				opacity: 0;
			}

			.notification {
				animation: notificationAnim 7.5s ease-in;
			}

			@keyframes notificationAnim {
				0%{
					width: 0;
					opacity: 0;
				}
				5%{
					width: 440px;
					opacity: 1;
				}
				7%{
					width: 420px;
					opacity: 1;
				}
				95%{
					width: 420px;
					opacity: 1;
				}
				100%{
					width: 0;
					opacity: 0;
				}
			}

			.prescription-progress-bar {
				width: calc( 100% - 40px );
			}

			.details-panel {
				box-sizing: border-box;
				grid-column: 3 / span 1;
				grid-row: 1 / span 1;
				background: var(--app-background-color-light);
				display: flex;
				overflow-y: auto;
				flex-flow: column nowrap;
				align-items: flex-start;
				z-index: 0;
				width: 100%;
                flex: 1;
			}

			.contact-title{
				display:block;
				@apply --paper-font-body2;
				@apply --padding-32;
				padding-bottom:8px;
				padding-top: 32px;
			}
			/*.contact-title:first-child{
				padding-top:0;
			}*/

			.msg-detail-card > .card-content {
				padding: 16px 16px 32px !important;
			}

			.msg-detail-card {
				width: 100%;
                padding: 16px 16px;
				display: block;
				background: transparent;
				box-shadow: none;
                flex-grow: 0;
                --main-width: 100%
			}

			.horizontal {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				flex-basis: 100%;
			}

			.justified {
				justify-content: space-between;
			}

			.pat-details-input {
				flex-grow: 1;
				margin: 16px;
			}

			input {
				border: none;
				width: 100%;
			}

			paper-dialog {
				margin: 0;
			}

			.contact-card-container {
				position: relative;
				overflow-y: auto;
				height: calc(100% - 48px);
				padding-bottom: 32px;
			}

			paper-dialog {
				min-width:30%;
			}

			.extra-info{
				color:var(--app-text-color-disabled);
				font-style: italic;
				font-size: 80%;
			}

			vaadin-upload{
				margin:16px;
				min-height:280px;
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
					--paper-progress-active-color:var(--app-secondary-color);
				};
				--vaadin-upload-file-commands: {
					color: var(--app-primary-color);
				}

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

			paper-dialog {
				width: 80%;
			}

			vaadin-grid {
				height:100%;
				--vaadin-grid-body-row-hover-cell: {
					/* background-color: var(--app-primary-color); */
					color: white;
				};
				--vaadin-grid-body-row-selected-cell: {
					background-color: var(--app-primary-color);
					color: white;
				};
			}

			paper-input{
				--paper-input-container-focus-color: var(--app-primary-color);
			}

			.modal-title{
				background:  var(--app-background-color-dark);
				margin-top: 0;
				padding: 16px 24px;
			}

			.modal-subtitle{
				display: inline-flex;
				margin-top: 16px;
			}



			filter-panel{
				flex-grow: 9;
				/* --panel-width: 60%; */
			}

			.layout-bar{
				flex-grow: 1;
				display: inline-flex;
				flex-flow: row nowrap;
				align-items: center;
				justify-content: space-around;
				height:48px;
				background: var(--app-secondary-color);
				border-left: 1px solid var(--app-secondary-color-dark);
			}

			.layout-bar .list, .layout-bar .graphique, .layout-bar .doc{
				height: 32px;
				width: 32px;
				padding: 5px;
				color: var(--app-primary-color-dark);
			}

			.layout-bar .table{
				height: 30px;
				width: 30px;
				padding: 0;
				color: var(--app-primary-color-dark);
			}

			.floating-action-bar{
				display: flex;
				position: absolute;
				height: 40px;
				bottom: 16px;
				background: var(--app-secondary-color);
				border-radius: 3px;
				grid-column: 3/3;
				grid-row: 1/1;
				z-index: 1000;
				left: 50%;
				transform: translate(-50%, 0);
				box-shadow: var(--app-shadow-elevation-2);
			}

			.add-forms-container {
				position: absolute;
				bottom: 48px;
				left: 0;
				background-color: var(--app-background-color-light);
				opacity: .8;
				padding: 8px 0;
				border-radius: 2px;
				max-width: 253px;
			}
			.floating-action-bar paper-fab-speed-dial-action {
				--paper-fab-speed-dial-action-label-background: transparent;
				--paper-fab-iron-icon: {
					transform: scale(0.8);

				};
				--paper-fab: {
					background: var(--app-primary-color-dark);
				}
			}

			.floating-action-bar paper-button{
				--paper-button-ink-color: var(--app-secondary-color-dark);
				background: var(--app-secondary-color);
				color: var(--app-text-color);
				font-weight: bold;
				font-size: 12px;
				height: 40px;
				min-width: 130px;
				padding: 10px 1.2em;
				border-radius: 0;
				margin:0;
			}

			.floating-action-bar paper-button:hover{
				background: var(--app-dark-color-faded);
    			transition: var(--transition_-_transition);
			}

			.floating-action-bar paper-button:not(:first-child){
				border-left: 1px solid var(--app-secondary-color-dark);
			}

			.close-add-forms-btn{
				background: var(--app-secondary-color-dark) !important;
			}

			.floating-action-bar iron-icon{
				box-sizing: border-box;
				padding: 2px;
				margin-right: 8px;
			}

			.horizontal{
				flex-flow: row nowrap;
			}

			.contact-card-container {
				position: relative;
				overflow-y: auto;
				height: calc(100% - 48px);
				padding-bottom: 32px;
			}

            dynamic-doc {
                overflow-x: hidden;
                overflow-y: auto;
                margin-top: 16px;
                word-break: break-all;
                hyphens: auto;
            }

			.annexe-card{
                width: 100%;
                box-sizing: border-box;
				background: var(--app-background-color)
			}

			.annexe-card:first-of-type{
				margin-left:0;
			}

			.annexe-card--header{
				background-color: white;
    			padding: 0 8px;
				flex-flow: row nowrap!important;
                overflow: hidden;
                text-overflow: ellipsis;
			}

			.annexe-card--header span{
				flex-grow: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.annexe-card--header paper-icon-button{
				height: 32px;
				width: 32px;
				min-width: 32px;
				min-height: 32px;
				padding: 4px;
				opacity: .7;
				color: var(--app-text-color);
			}

			.annexe-card--content{
    			padding: 0 8px;
			}

			.annexe-card--action-button{
				font-size: 14px;
				font-weight: 400;
				text-transform: capitalize;
                margin: 0 auto;
			}

			.annexe-card--action-button:hover{
				background-color: var(--app-background-color-dark);
				font-weight: 500;
			}

            .img-container{
                padding: 20px;
                align-self: center;
                display:flex;
                justify-content: center;
                align-items: center;
                background-color:  rgb(113, 135, 146);
            }

            .img-container img{
                max-height: 600px;
                max-width: calc(var(--main-width) - 20px);
            }

            .action-buttons {
                width: 100%;
                padding: 0;
				border-bottom: 1px solid var(--app-background-color-dark);
				min-height: 56px;
                z-index: 10;
                /*padding: 8px;*/
                box-sizing: border-box;
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                align-items: center;
                padding: 0 12px;
                margin-top: 5px;
            }

            .buttons{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
            }

            .save-button{
                margin: 0 0 0 10px;
                box-sizing: border-box;
                --paper-button-ink-color: var(--app-secondary-color);
                height: 40px !important;
                display: block;
                text-align: center;
                --paper-button: {
                    background: var(--app-secondary-color);
                    color: var(--app-text-color);
                    margin: 0 auto;
                    font-size: 14px;
                    font-weight: bold;
                    text-transform: capitalize;
                };
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 220px;
                text-transform: uppercase;
                font-weight: 700;
            }


            .clearb {
                clear: both;
            }
            .flexbox {
                display: flex;
                flex-direction: row;
            }
            .flexbox.read {
                width: 100%;
            }
            .inlined {
                flex: 1;
                float: left;
                width: 30%;
                margin: 0 1%;
            }

            .read-txt {
                width: 100%;
                max-height: 50vh;
                overflow-y: auto;
				flex-grow: 1;
				border-top: 1px solid var(--app-background-color-dark);
                padding: 0 10px;
                box-sizing: border-box;
            }

			.read-txt p{
				font-size: 14px;
			}

            .attached {
                width: 100%;
                max-height: 176px;
                padding: 10px;
                overflow-y: auto;
                border-top: 1px solid var(--app-background-color-dark);
                box-sizing: border-box;
				display: flex;
				flex-flow: row wrap;
				justify-content: flex-start;
				align-items: flex-start;
            }
            .attached paper-button {
                margin: 0;
            }

			.attached h3{
				width: 100%;
				margin: 0;
				color: var(--app-text-color);
				font-size: 1em;
				padding-left:4px;
			}

			.msg-close-btn{
				font-size: 14px;
				font-weight: 400;
				color: var(--app-text-color);
				text-transform: capitalize;
				transition: all .12s cubic-bezier(0.075, 0.82, 0.165, 1);
				margin-bottom: 8px;
				height: 40px;
			}

			.msg-detail-btn:hover{
				background-color: var(--app-background-color-dark);
				color: var(--app-text-color);
			}

			.msg-detail-btn iron-icon{
				height: 20px;
				width: 20px;
				padding: 4px;
				opacity: .7;
				color: var(--app-text-color);
			}

			.layout-horizontal{
				display:flex;
				flex-flow: row wrap;
				align-items: center;
				justify-content: flex-start;
			}

			.layout-horizontal--nowrap{
				flex-flow: row nowrap;
			}

            .justify-content {
                justify-content: space-between;
                flex-flow: initial;
            }
			.space-between{
				justify-content: space-between;
                height: 80px;
			}

			.layout-horizontal--flex-end{
				justify-content: flex-end;
			}

			.msg-header-grid{
				display: grid;
				grid-template-columns: 40px 1fr;
				grid-template-rows: 20px 20px;
				grid-row-gap: 0;
				grid-column-gap: 8px;
			}

			.initials-avatar{
				grid-column: 1 / 1;
				grid-row: 1 / 2;
				display: inline-flex;
				flex-flow: row wrap;
				align-items: center;
				justify-content: center;
				background: var(--app-secondary-color-dark);
				border-radius: 50%;
				height: 40px;
                width: 40px;
				color: white;
				font-size: 1.2em;
				text-transform: uppercase;
			}

			.from{
				-webkit-font-smoothing: antialiased;
				font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
				font-size: 1rem;
				letter-spacing: .2px;
				color: var(--app-text-color);
				line-height: 20px;
				font-weight: 500;
				grid-column: 2 / 2;
				grid-row: 1 / 1;
				place-self: end start;
			}

			.to{
				-webkit-font-smoothing: auto;
				font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
				font-size: 13px;
				letter-spacing: .3px;
				color: var(--app-text-color-disabled);
				line-height: 20px;
				grid-column: 2 / 2;
				grid-row: 2 / 2;
				place-self: start start;
			}

			paper-icon-button{
				color: var(--app-text-color);
				height: 32px;
				width: 32px;
				padding: 4px;
				margin: 4px;
				transition: all .12s cubic-bezier(0.075, 0.82, 0.165, 1);
				opacity: .7;
			}

			paper-icon-button:hover{
				border-radius: 50%;
				background-color: var(--app-background-color-dark);
				color: var(--app-text-color);
				opacity: 1;
			}

			.date{
				font-size: 13px;
				background-color: var(--app-background-color-dark);
				padding: 0 12px;
				border-radius: 12px;
				color: var(--app-text-color);
			}

			ht-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 150;
                transform: translate(-50%,-50%);
				height: 42px;
				width: 42px;
            }
			paper-spinner.patlist-spinner {
                position: relative;
                top: 12px;
                left: 8px;
                transform: none;
            }

            .close-panel {
                width: 100%;
                text-align: center;
                padding: 4px 16px;
                box-sizing: border-box;
                background: var(--app-background-color-darker);
                cursor: pointer;
                border-top: 1px solid black;
            }

            #main-details-panel {
                flex: 1;
            }

            ht-msg-list.selected .col-right {
                width: 100%;
            }

            div.subject {
                flex-grow: 1;
                overflow: hidden;
                max-height: 88px;
            }

            h2.subject {
                margin: 24px 0;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .message-box {
                padding: 4px;
                width: 100%;
                box-sizing: border-box;
                flex: 1;
            }

            .mobileOnly {display: none;}

            .doc-container {
                max-width: 50%;
            }

            .confirmPats {
                background: var(--app-secondary-color);
                position: relative;
                padding: 4px 8px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                border-radius: 4px;
                font-size: .8em;
                text-align: center;
                width: auto;
                box-shadow: var(--app-shadow-elevation-1);
                cursor: pointer;
            }

            #import-suggest {
                position: fixed;
                display: flex;
                top: calc(50vh + 97px);
                left: calc(16% + 20px);
                width: calc(80vw - 12px);
                height: auto;
                max-height: calc(100vh - 97px);
                transform: translateY(calc(-50% - 64px));
                justify-content: flex-end;
                background: #fff;
                padding: 8px;
                border: 1px solid var(--app-background-color-dark);
                box-shadow: var(--app-shadow-elevation-2);
                border-radius: 4px;
                z-index: 999;
                flex-direction: column;
                margin: 0 auto;
            }

            #import-suggest .twocol {
                display: grid;
                grid-template-columns: 50% 50%;
            }

            #import-suggest h5 {
                margin: 0 auto 4px auto;
                text-align: center;
            }

            #import-suggest .lab-details {
                flex-grow: 1;
                flex-direction: column !important;
                margin-bottom: 8px;
            }
            #import-suggest .lab-details .sheet {
                overflow-y: auto;
                background: var(--app-background-color-dark);
                border-radius: 4px;
                flex-grow: 1;
            }

            #import-suggest .scrollbox {
                height: 40vh; /* TODO : when labresult is done, "128px" */
                overflow-y: auto;
                background: var(--app-background-color-dark);
                border-radius: 4px;
                padding: 4px;
                display: flex;
                flex-direction: column;
                margin-bottom: 8px;
                box-sizing: border-box;
            }
            .scrollbox.labolist {
                margin-right: 8px; /* TODO : 8px when labresult done*/
                padding: 0 !important;
            }
            .scrollbox.patlist .checkbox-item {
                border-bottom: 1px solid var(--app-background-color-darker);
                padding: 4px;
            }
            .scrollbox.patlist .checkbox-item * div#checkbox.checked {
                background-color: var(--app-secondary-color-dark);
                border-color: var(--app-secondary-color-dark);
            }

            #import-suggest .line {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                width: 100%;
            }
            #import-suggest .line > div.icon {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                width: 32px;
            }
            #import-suggest .line > div.grow {
                flex-grow: 1;
            }
            #import-suggest .save-line {
                justify-content: flex-end;
                min-height: 48px;
            }

            paper-listbox {
                background: transparent !important;
                padding: 0;
            }

            dynamic-doc {
                width: 100%;
            }

            .labolist .unassigned {
                line-height: 100%;
                display: flex;
                flex-direction: column;
                border-top: 1px solid var(--app-background-color-darker);
                text-align: left;
                padding: 8px;
            }
            .labolist .unassigned:first-child {
                border: none;
            }

            .labolist .unassigned .pat-name {
                font-weight: bold;
            }
            .labolist .unassigned iron-icon {
                width: 18px;
                margin-left: 4px;
            }
            .labolist .unassigned small {
                width: 100%;
                display: block;
            }
            .labolist .unassigned .labo-info {
                margin: 4px 0;
            }
            .labo-info .labo-name {}
            .labolist .unassigned .demand-date {
                text-align: right;
                font-size: .75em;
            }

            .pointer:hover,
            .pointer:focus,
            .pointer.iron-selected {
                background: var(--app-secondary-color);
                cursor: pointer;
                color: white;
                font-weight: initial;
            }
            .pointer.iron-selected {
                background: var(--app-secondary-color-dark);
            }

            paper-button.search-patients{
                background: var(--app-background-color-darker);
                margin: 4px;
            }
            paper-input.search-patients {
                flex-grow: 1;
            }
            iron-icon.search-patients {
                padding-top: 16px;
            }

            .wide-only {
                display: none;
            }

            @media screen and (max-width: 1336px) {
                .nomobile-wide {
                    display: none;
                }
                .wide-only {
                    display: block;
                }
                .msg-detail-btn {
                    min-width: 0;
                }
            }

            @media screen and (max-width: 1025px) {
                .mobileOnly {display: block;}
                .attached {
                    max-height: 25vh;
                    width: 100%;
                    overflow-y: auto;
                }

                #import-suggest {
                    left: 50vw;
                    transform: translateY(calc(-50% - 64px)) translateX(-50%);
                    width: 90vw;
                }

                .read-txt {
                    height: auto;
                    overflow-y: hidden;
                    min-height: 80px;
                }

                .action-buttons {
                    width: 100%;
                    padding: 0;
                    border: 1px solid #ccc;
                    height: 56px;
                    z-index: 10;
                    padding: 8px;
                    box-sizing: border-box;
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow:0px 1px 1px #bbb;
                }
            }

            @media screen and (max-width: 650px) {
                .noPortable {display: none !important;}
                #import-suggest {
                    max-height: 50vh;
                }

                #import-suggest .twocol {
                    display: flex;
                    flex-direction: column;
                }

                #import-suggest .scrollbox {
                    height: 128px;
                }

                #import-suggest .labolist {margin-right: 0;}
            }

            .input-form{
                width : calc(100% - 2px);
                height: 40px;
            }

            vaadin-combo-box {
                --vaadin-combo-box-overlay-max-height: 30vh;
            }

            vaadin-text-field{
                height: 40px;
                margin-top: -16px;
            }
            #importPicker,#docPicker, #importTextField {
                width: calc(50% - 2px);
            }
            #commentTextField {
                width: 100%;
            }
            #patCombo,.typeCombo {
                width: calc(50% - 4px);
            }
            #NissTextField{
                width: calc(50% - 2px);
            }
            .visual-panel {
                margin: 20px 0px;
            }

            #CommentTextForm {
                height: 80px;
                font-size: var(--font-size-normal);
                padding: 4px 0;
                width: 100%;
            }
            #CommentTextArea {
                width: 100%;
            }


        </style>
		<ht-spinner class="center spinner" active="[[isLoadingMessage]]"></ht-spinner>
		<template is="dom-if" if="[[selectedMessage]]">
			<div id="main-details-panel" class="details-panel">
                <div class="action-buttons">
                    <div class="buttons">
                        <template is="dom-if" if="[[!disabled]]">
                            <paper-button class="button button--other" on-tap="delete" data-message-id\$="[[selectedMessage.id]]"><iron-icon id="delete-msg" icon="delete" data-message-id\$="[[selectedMessage.id]]"></iron-icon>
                                <span class="nomobile-wide" data-message-id\$="[[selectedMessage.id]]">[[localize('del','Delete',language)]]</span>
                                <paper-tooltip class="wide-only" for="delete-msg">[[localize('del','Delete',language)]]</paper-tooltip>
                            </paper-button>
                        </template>
                        <template is="dom-if" if="[[!disabled]]">
                            <paper-button class="button button--save" on-tap="update"><iron-icon icon="save"></iron-icon>[[localize('save','Sauver',language)]]</paper-button>
                        </template>
                        <template is="dom-if" if="[[disabled]]">
                            <paper-button class="button button--save" on-tap="unassign">[[localize('unassign','Désaffecter',language)]]</paper-button>
                        </template>
                    </div>
                    <div>
                        <paper-button class="button" on-tap="_closeSingleMessageComponent">[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </div>

                    <paper-card class="msg-detail-card">
                        <div id="form-panel" class="panel">
                            <div class="form">
                                <h2>[[localize('document','Document',language)]]<span class="extra-info"> (PDF, images and videos)</span></h2>
                                <div class="input-form">
                                    <vaadin-text-field id="subject" label="[[localize('docTitle','Titre',language)]]" value="[[selectedMessage.subject]]" disabled="[[disabled]]">
                                    </vaadin-text-field>
                                </div>
                                <div class="input-form">
                                    <vaadin-text-field id="hcpTextField" label="[[localize('persphysicianRole','Recipient',language)]]" value="[[selectedMessage.hcp]]" disabled="">
                                    </vaadin-text-field>
                                </div>
                                <div class="input-form">
                                    <vaadin-combo-box id="patCombo" filter="{{filterPatient}}" label="[[localize('pat-name','Nom du patient',language)]]" filtered-items="[[patientList]]" item-label-path="name" item-value-path="id" value="{{selectedMessage.patientId}}" disabled="[[disabled]]"></vaadin-combo-box>
                                    <vaadin-text-field id="NissTextField" label="[[localize('ssin','NISS',language)]]" value="{{selectedMessage.patientSsin}}" disabled="[[disabled]]"></vaadin-text-field>
                                </div>
                                <div class="input-form">
                                    <vaadin-date-picker id="importPicker" label="[[localize('import_date','Date d\\'importation',language)]]" value="[[selectedMessage.metas.importDate]]" i18n="[[i18n]]" disabled=""></vaadin-date-picker>
                                    <vaadin-date-picker id="docPicker" label="[[localize('doc_date','Date du document',language)]]" value="{{selectedMessage.metas.documentDate}}" i18n="[[i18n]]" disabled="[[disabled]]"></vaadin-date-picker>
                                </div>
                            </div>
                            <template is="dom-repeat" items="[[attachments]]" as="attachment">
                                <div class="form">
                                    <div class="input-form">
                                        <vaadin-text-field id="importTextField" label="[[localize('doc-title','Titre du document',language)]]" value="{{attachment.filename}}" disabled="[[disabled]]"></vaadin-text-field>
                                        <vaadin-combo-box class="typeCombo" id="type_[[attachment.docmentId]]" filtered-items="[[listType]]" item-label-path="name" item-value-path="code" label="[[localize('docType','Type de document',language)]]" value="{{attachment.type}}" disabled="[[disabled]]">
                                        </vaadin-combo-box>
                                    </div>
                                </div>
                                <div class="visual-panel">
                                    <template is="dom-if" if="[[attachment.content]]">
                                        <template is="dom-if" if="[[!attachment.isPdf]]">
                                            <div class="img-container">
                                                <img src="[[attachment.content]]" alt="">
                                            </div>
                                        </template>
                                        <template is="dom-if" if="[[attachment.isPdf]]">
                                            <pdf-element width="600" height="600" id="pdfElement" src="[[attachment.content]]"></pdf-element>
                                        </template>
                                    </template>
                                </div>
                                <div class="input-form" id="CommentTextForm">
                                    <vaadin-text-area class="textarea-style" id="CommentTextArea" label="[[localize('com','Comments',language)]]" value="{{attachment.comment}}" disabled="[[disabled]]"></vaadin-text-area>
                                </div>
                            </template>
                        </div>
                    </paper-card>

            </div>

		</template>
`;
  }

  static get is() {
      return 'ht-msg-document-detail';
	}

  static get properties() {
      return {
          contacts: {
              type: Array,
              value: () => []
          },
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
          currentContact: {
              type: Object,
              value: null
          },
          selectedMessage: {
              type: Object
          },
          selectedData: {
              type: Object,
              value: null
          },
          attachments: {
              type: Array,
              value: () => []
          },
          // selectedDocuments:{
          // 	type: Object
          // },
          documentAttachment:{
              type: String,
              value: null
          },
          showDetail:{
              type: Boolean,
              value: false
          },
          isLoadingMessage: {
              type: Boolean,
              value: false
          },
          isDeleted: {
              type: Boolean,
              value: false
          },
          isHidden: {
              type: Boolean,
              value: false
          },
          attachmentQuantity: {
              type: Number,
              value: 0
          },
          unassignedResults: {
              type: Array,
              value: []
          },
          assignedResults: {
              type: Array,
              value: () => []
          },
          unimportedPats: {
              type: Array,
              value: () => []
          },
          toImportPatsSuggestions: {
              type: Array,
              value: () => []
          },
          selectedProtocol: {
              type: Number,
              value: -1
          },
          assignModal: {
              type: Boolean,
              value: false
          },
          selectedPats: {
              type: Array,
              value: () => []
          },
          targetPats: {
              type: Array,
              value: () => []
          },
          isLoadingPatsSuggest: {
              type: Boolean,
              value: false
          },
          selectName: {
              type: String,
              value: ''
          },
          // docInfo: {
          //     type: Object,
          //     value: null
          // },
          canAssign: {
              type: Boolean,
              value: false
          },
          searchPatValue: {
              type: String,
              value: ''
          },
          manualAssign: {
              type: Boolean,
              value: false
          },
          toImportPatsSearch: {
              type: Array,
              value: () => []
          },
          patsLng: {
              type: Number,
              value: 0
          },
          hasLabResult: {
              type: Boolean
          },
          // docTxt: {
          //     type: Object,
          //     value: null
          // },
          ehealthSession: {
              type: Boolean
          },
          patientList:{
              type : Array,
              value: ()=>[]
          },
          patientDisabled:{
              type : Boolean,
              value: false
          },
          listType:{
              type: Array,
              value: ()=>[]
          },
          disabled: {
              type: Boolean,
              value: true
          },
          _currentPageNumber: {
              type: Number,
              value: 1
          },
          currentHcp: {
              type: Object,
              value: {},
              noReset: true
          },
          parentHcp: {
              type: Object,
              value: {},
              noReset: true
          },
          _patientSearchReqIdx: {
              type: Number,
              value: 0
          }

  };
	}

  static get observers() {
      return [
          'apiReady(api,user,opened)',
          '_focusChanged(selectedMessage)',
          '_filterPatChanged(filterPatient)',
          // '_selectedDocChanged(selectedMessage.*)',
          '_patientIdChanged(selectedMessage.patientId)',
          '_patientNissChanged(selectedMessage.patientSsin)'
      ];
	}

  constructor() {
      super();
	}

  ready() {
      super.ready();
  }

  apiReady() {
      this.api && this.api.isElectronAvailable().then(electron => this.set("hasElectron", electron)).catch(error => console.log(error));
      return !!_.size(_.get(this,"listType",[])) ? null : this.api.getDocumentTypes(this.resources, this.language).then(documentTypes => this.set("listType", documentTypes))
  }


  _deleteSingleMessage(e){
      //@ToDo
  }

  _restoreDeletedMessage(e){
      //@ToDo
  }

  _setMessageStatus(message) {
      message.status = (message.status ^ 1 << 26) | (e.detail.patientId ? 1 << 26 : 0)
      this.api.message().modifyMessage(message)
          .then(msg => this.api.register(msg, 'message'))
  }

  // _focusChanged() {
  //     let selMsg = this.selectedMessage;
  //     if (!selMsg) {
  //         this.set('isLoadingMessage', false)
  //         return;
  //     }
  //
  //     this.set('disabled', ((selMsg.status & (1 << 26)) !== 0));
  //     this.api.document().findByMessage(this.user.healthcarePartyId, selMsg)
  //         .then(found => {
  //             this.set("document",found[0]);
  //             return this.api.document().getAttachment(found[0].id, found[0].attachmentId, found[0].secretForeignKeys);
  //         })
  //         .then(attachmentResponse => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, this.document, attachmentResponse))
  //         .then(decryptedFileContent => {
  //             let type = _.toLower(this.document.name.split('.').pop());
  //             let base64 = btoa([].reduce.call(new Uint8Array(decryptedFileContent), (p,c) => p+ String.fromCharCode(c),''));
  //             if (type === 'jpeg' || type === 'jpg' || type ==="PNG" || type ==="png") {
  //                 this.set('isPdf', false);
  //                 this.set('selectedData', 'data:image/jpeg;base64,' + base64);
  //             } else if (type === 'tif' || type === 'tiff') {
  //                 this.set('isPdf', false);
  //                 this.set('selectedData', 'data:image/tiff;base64,' + base64);
  //             } else if (type === 'pdf') {
  //                 this.set('selectedData',base64);
  //                 this.set('isPdf', true);
  //             }
  //         })
  //         .catch((error) => this.dispatchEvent(new CustomEvent('show-error-message', { detail: {title: selMsg.metas.filename, message: "err.document.open", detail: error}, bubbles: true })))
  //         .finally(() => this.set('isLoadingMessage', false))
  // }

  _decrypt(documentObject, cryptedString) {
	    if (!cryptedString) {
          return Promise.resolve("");
      }
      const ua = this.api.crypto().utils.text2ua(Base64.decode(cryptedString));
      return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, documentObject, ua)
          .then(ua => this.api.crypto().utils.ua2text(ua));
  }

  _focusChanged() {
      let selMsg = this.selectedMessage;
      if (!selMsg) {
          this.set('isLoadingMessage', false)
          return;
      }
      this.set("attachments", []);
      let documentList = selMsg.metas && selMsg.metas.documentListJson && JSON.parse(selMsg.metas.documentListJson) || [];
      this.set('disabled', ((selMsg.status & (1 << 26)) !== 0));
      this.api.document().findByMessage(this.user.healthcarePartyId, selMsg)
          .then(documents => Promise.all(documents.map(document => this.api.document().getAttachment(document.id, document.attachmentId, document.secretForeignKeys)
              .then(attachment => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, document, attachment))
              .then(decryptedAttachment => {
                  let type = _.toLower(document.name.split('.').pop());
                  let base64 = btoa([].reduce.call(new Uint8Array(decryptedAttachment), (p, c) => p + String.fromCharCode(c), ''));
                  let isPdf = false;
                  let content = null;
                  if (type === 'jpeg' || type === 'jpg' || type === "PNG" || type === "png") {
                      content = 'data:image/jpeg;base64,' + base64;
                  } else if (type === 'tif' || type === 'tiff') {
                      content = 'data:image/tiff;base64,' + base64;
                  } else if (type === 'pdf') {
                      content = base64;
                      isPdf = true;
                  }
                  let documentListItem =  documentList.find(doc => doc.id === document.id);

                  return {
                      documentId: document.id,
                      filename: document.name || selMsg.metas.filename,
                      type: document.documentType || selMsg.metas.type,
                      content: content,
                      isPdf: isPdf,
                      cryptedComment: documentListItem && documentListItem.comment || ""
                  }
              })

              .then(item => this._decrypt(document, item.cryptedComment)
                  .then(comment => {
                      item.comment = comment;
                      this.push("attachments", item);
                  })
              )
          )))
          .catch((error) => this.dispatchEvent(new CustomEvent('show-error-message', { detail: {title: selMsg.metas.filename, message: "err.document.open", detail: error}, bubbles: true })))
          .finally(() => this.set('isLoadingMessage', false))
  }

  _base64(data) {
      return base64js.fromByteArray(data);
  }

  _toDealWith(m) {
      return !!((m.status & (1 << 26)) === 0);
  }

  _wrapPatient(patient) {
      return {
          id: patient.id,
          name: patient.firstName + " " + patient.lastName || patient.id,
          ssin: patient.ssin
      };
  }

  _pushDistinctPatient(listPath, patient) {
      if (!patient || !patient.id) return;
      if (this.get(listPath).find(item => item.id === patient.id)) return;
      this.push(listPath, this._wrapPatient(patient));
  }

  _patientIdChanged(){
      if (!this.selectedMessage || !this.selectedMessage.id || !this.selectedMessage.patientId) return;
      let pat = this.patientList.find(p => p.id === this.selectedMessage.patientId);
      if (pat) (pat.ssin !== this.selectedMessage.patientSsin) && this.set("selectedMessage.patientSsin", pat.ssin)
      else {
          return this.api.patient().filterByWithUser(this.user, null, null, 10, null, null, "desc", {
              filter: {
                  '$type': 'PatientByHcPartyAndSsinFilter',
                  'healthcarePartyId': this.selectedMessage.fromHealthcarePartyId,
                  'id': this.selectedMessage.patientId
              }
          })
              .then(pats => {
                  pats.rows.map(pat => this._pushDistinctPatient("patientList", pat));
                  const pat = this.patientList.find(p => p.id === this.selectedMessage.patientId) || {
                      id: "",
                      ssin: "",
                      name: ""
                  };
                  this.set("selectedMessage.patientId", pat.id);
                  this.shadowRoot.querySelector("#patCombo").selectedItem = pat;
                  (pat.ssin !== this.selectedMessage.patientSsin) && this.set("selectedMessage.patientSsin", pat.ssin)
              })
      }
  }

  _validSsin(ssin) {
      return ssin && ssin.length > 9;
  }

  _patientNissChanged(){
      if(!this.selectedMessage)return;
      if(!this.selectedMessage.patientSsin || !this._validSsin(this.selectedMessage.patientSsin)) return;
      const found =this.patientList.find(pat => pat.ssin===this.selectedMessage.patientSsin)
      if(found){
          this.selectedMessage.patientId!==found.id && this.set("selectedMessage.patientId",found.id)
      }
      else{
          this.api.patient().filterByWithUser(this.user,null,null,10,null,null,"desc",{
              filter: {
                  '$type': 'PatientByHcPartyAndSsinFilter',
                  'healthcarePartyId': this.selectedMessage.fromHealthcarePartyId,
                  'ssin': this.selectedMessage.patientSsin
              }
          }).then(pats => {
              pats.rows.map(pat => this._pushDistinctPatient("patientList",pat))
              this.set("selectedMessage.patientId",this.patientList.find(pat => pat.ssin===this.selectedMessage.patientSsin).id)
          })
      }
  }
   _filterPatChanged(){

      const searchedValue = this.filterPatient

       if( _.trim(searchedValue).length < 3 ) return

       const reqIdx = (this._patientSearchReqIdx = (this._patientSearchReqIdx || 0) + 1)
       const parentOrCurrentHcpId = this.selectedMessage.fromHealthcarePartyId

       const filter = {
           '$type': 'IntersectionFilter', 'healthcarePartyId': parentOrCurrentHcpId,
           'filters': _.compact(_.trim(searchedValue).split(/[ ,;:]+/).filter(w => w.length >= 2).map( word => /^[0-9]{11}$/.test(word) ? {
           '$type': 'PatientByHcPartyAndSsinFilter',
           'healthcarePartyId': parentOrCurrentHcpId,
           'ssin': word
           } : /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? {
               '$type': 'PatientByHcPartyDateOfBirthFilter',
                   'healthcarePartyId': parentOrCurrentHcpId,
                   'dateOfBirth': parseInt(word.replace(/([0-3]?[0-9])[\/-](1[0-2]|0?[0-9])[\/-]((?:[1-2][89012])?[0-9][0-9])/g, (correspondance, p1, p2, p3) => (p3.length === 4 ? p3 : (p3 > 20) ? "19" + p3 : "20" + p3) + (p2.length === 2 ? p2 : "0" + p2) + (p1.length === 2 ? p1 : "0" + p1)))||0
           } : /^[0-9]{3}[0-9]+$/.test(word) ? {
               '$type': 'UnionFilter',
                   'healthcarePartyId': parentOrCurrentHcpId,
                   'filters': [
                       {
                           '$type': 'PatientByHcPartyDateOfBirthBetweenFilter',
                           'healthcarePartyId': parentOrCurrentHcpId,
                           'minDateOfBirth': word.length >= 8  ? Number(word.substr(0,8)) : word.length >= 6 ? Number(word.substr(0,6) + '00') : Number(word.substr(0,4) + '0000'),
                           'maxDateOfBirth': word.length >= 8  ? Number(word.substr(0,8)) : word.length >= 6 ? Number(word.substr(0,6) + '99') : Number(word.substr(0,4) + '9999')
                       },
                       {
                           '$type': 'PatientByHcPartyAndSsinFilter',
                           'healthcarePartyId': parentOrCurrentHcpId,
                           'ssin': word
                       },
                       {
                           '$type': 'PatientByHcPartyAndExternalIdFilter',
                           'healthcarePartyId': parentOrCurrentHcpId,
                           'externalId': word
                       }
                       ]
           } : /^[0-9]+$/.test(word) ? {
               '$type': 'PatientByHcPartyAndSsinFilter',
                   'healthcarePartyId': parentOrCurrentHcpId,
                   'ssin': word
           } : word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').length >= 2 ? {
               '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
                   'healthcarePartyId': parentOrCurrentHcpId,
                   'searchString': word
           } : null))
       }

       const predicates = _.trim(searchedValue).split(/[ ,;:]+/).filter(w => w.length >= 2).map( word =>
               /^[0-9]{11}$/.test(word) ? (() => true) :
                   /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? (() => true) :
                       /^[0-9]{3}[0-9]+$/.test(word) ? ((p) => (p.dateOfBirth && (`${p.dateOfBirth}`.includes(word))) || (p.externalId && p.externalId.includes(word))) :
                           (p => {
                               const w = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'')
                               return w.length<2 ?
                                   true :
                                   (p.firstName && p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').includes(w)) ||
                                   (p.lastName && p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').includes(w))
                           })
           )
       setTimeout(() => {
           if (reqIdx !== this._patientSearchReqIdx) return;
           this.api.getRowsUsingPagination((key, docId, pageSize) =>
               this.api.patient().filterByWithUser(this.user, key, docId, pageSize || 50, 0, "lastName", false, { filter: _.assign({}, filter, {filters: filter.filters}) })
                   .then(pl => {
                       const filteredRows = pl.rows.filter(p => predicates.every(f => f(p)))
                       return {
                           rows: filteredRows,
                               nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                               nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                               done: !pl.nextKeyPair
                       }
                   })
                   .catch(() => { return Promise.resolve() }),
               p => ( !!_.get(p,"active",false)  ), 0, 50, []
           )
               .then(searchResults => { if (reqIdx === this._patientSearchReqIdx) {
                   return this.set("patientList", _
                           .chain(searchResults)
                           .map(patientData =>{return {
                               id: _.trim(_.get(patientData, "id", "")),
                                   name: _.map(_.trim(_.get(patientData, "lastName", "")).split(" "), i => _.capitalize(i)).join(" ") + " " + _.map(_.trim(_.get(patientData, "firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                                   dateOfBirth: _.trim(_.get(patientData, "dateOfBirth", "")),
                                   ssin: _.trim(_.get(patientData, "ssin", "")),
                           }})
                           .orderBy(['name', 'dateOfBirth','ssin'],['asc','asc','asc'])
                           .uniqBy('patientData.id')
                           .value()
                       )
               }})
               .catch(e=>{console.log("ERROR with search for patient: ", e);})
       }, 300)

  }

    _filterPatChanged_v1(e){
      if(!this.filterPatient || !this.selectedMessage) return;
      this.api.patient().filterByWithUser(this.user, null, null, 50, null, null, true, {
          filter: {
              '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
              'healthcarePartyId': this.selectedMessage.fromHealthcarePartyId,
              'searchString': this.filterPatient
          }
      }).then(pats =>{
          this.set("patientList",pats.rows.map(pat =>{
              return {
                  id : pat.id,
                  name : pat.firstName+" "+pat.lastName || pat.id,
                  ssin : pat.ssin
              }
          }))
      })
  }

    _filterPatChanged_v2(){
        const searchedValue = this.filterPatient
        if(_.trim(searchedValue).length < 3 || !this.selectedMessage) return
        const reqIdx = (this._patientSearchReqIdx = (this._patientSearchReqIdx || 0) + 1)

        this.api.hcparty().getHealthcareParty(_.get(this,"selectedMessage.fromHealthcarePartyId"))
            .then(currentHcp => (this.set("currentHcp",currentHcp)||true) && currentHcp)
            .then(currentHcp => !_.trim(_.get(currentHcp, "parentId", "")) ? false : this.api.hcparty().getHealthcareParty(_.trim(_.get(currentHcp, "parentId", ""))).then(parentHcp => this.set("parentHcp",parentHcp)))
            .then(() => {

                const parentOrCurrentHcpId = !!_.trim(_.get(this,"parentHcp.id","")) ? _.trim(_.get(this,"parentHcp.id","")) : !!_.trim(_.get(this,"user.healthcarePartyId","")) ? _.trim(_.get(this,"user.healthcarePartyId","")) : _.get(this,"selectedMessage.fromHealthcarePartyId")

                const filter = {
                    '$type': 'IntersectionFilter',
                    'healthcarePartyId': parentOrCurrentHcpId,
                    'filters': _.compact(_.trim(searchedValue).split(/[ ,;:]+/).filter(w => w.length >= 2).map( word => /^[0-9]{11}$/.test(word) ? {
                        '$type': 'PatientByHcPartyAndSsinFilter',
                        'healthcarePartyId': parentOrCurrentHcpId,
                        'ssin': word
                    } : /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? {
                        '$type': 'PatientByHcPartyDateOfBirthFilter',
                        'healthcarePartyId': parentOrCurrentHcpId,
                        'dateOfBirth': parseInt(word.replace(/([0-3]?[0-9])[\/-](1[0-2]|0?[0-9])[\/-]((?:[1-2][89012])?[0-9][0-9])/g, (correspondance, p1, p2, p3) => (p3.length === 4 ? p3 : (p3 > 20) ? "19" + p3 : "20" + p3) + (p2.length === 2 ? p2 : "0" + p2) + (p1.length === 2 ? p1 : "0" + p1)))||0
                    } : /^[0-9]{3}[0-9]+$/.test(word) ? {
                        '$type': 'UnionFilter',
                        'healthcarePartyId': parentOrCurrentHcpId,
                        'filters': [
                            {
                                '$type': 'PatientByHcPartyDateOfBirthBetweenFilter',
                                'healthcarePartyId': parentOrCurrentHcpId,
                                'minDateOfBirth': word.length >= 8  ? Number(word.substr(0,8)) : word.length >= 6 ? Number(word.substr(0,6) + '00') : Number(word.substr(0,4) + '0000'),
                                'maxDateOfBirth': word.length >= 8  ? Number(word.substr(0,8)) : word.length >= 6 ? Number(word.substr(0,6) + '99') : Number(word.substr(0,4) + '9999')
                            },
                            {
                                '$type': 'PatientByHcPartyAndSsinFilter',
                                'healthcarePartyId': parentOrCurrentHcpId,
                                'ssin': word
                            },
                            {
                                '$type': 'PatientByHcPartyAndExternalIdFilter',
                                'healthcarePartyId': parentOrCurrentHcpId,
                                'externalId': word
                            }
                        ]
                    } : /^[0-9]+$/.test(word) ? {
                        '$type': 'PatientByHcPartyAndSsinFilter',
                        'healthcarePartyId': parentOrCurrentHcpId,
                        'ssin': word
                    } : word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').length >= 2 ? {
                        '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
                        'healthcarePartyId': parentOrCurrentHcpId,
                        'searchString': word
                    } : null))
                }
                const predicates = _.trim(searchedValue).split(/[ ,;:]+/).filter(w => w.length >= 2).map( word =>
                    /^[0-9]{11}$/.test(word) ? (() => true) :
                        /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? (() => true) :
                            /^[0-9]{3}[0-9]+$/.test(word) ? ((p) => (p.dateOfBirth && (`${p.dateOfBirth}`.includes(word))) || (p.externalId && p.externalId.includes(word))) :
                                (p => {
                                    const w = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'')
                                    return w.length<2 ?
                                        true :
                                        (p.firstName && p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').includes(w)) ||
                                        (p.lastName && p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g,'').includes(w))
                                })
                )
                setTimeout(() => {
                    if (reqIdx !== this._patientSearchReqIdx || !this.selectedMessage) return;
                    this.api.getRowsUsingPagination((key, docId, pageSize) =>
                            this.api.patient().filterByWithUser(this.user, key, docId, pageSize || 50, 0, "lastName", false, { filter: _.assign({}, filter, {filters: filter.filters}) })
                                .then(pl => {
                                    const filteredRows = pl.rows.filter(p => predicates.every(f => f(p)))
                                    return {
                                        rows: filteredRows,
                                        nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                                        nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                                        done: !pl.nextKeyPair
                                    }
                                })
                                .catch(() => { return Promise.resolve() }),
                        p => ( !!_.get(p,"active",false)  ), 0, 50, []
                    )
                        .then(searchResults => { if (reqIdx === this._patientSearchReqIdx) {
                            return this.set("patientList", _
                                .chain(searchResults)
                                .map(patientData =>{return {
                                    id: _.trim(_.get(patientData, "id", "")),
                                    name: _.map(_.trim(_.get(patientData, "lastName", "")).split(" "), i => _.capitalize(i)).join(" ") + " " + _.map(_.trim(_.get(patientData, "firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                                    dateOfBirth: _.trim(_.get(patientData, "dateOfBirth", "")),
                                    ssin: _.trim(_.get(patientData, "ssin", "")),
                                }})
                                .orderBy(['name', 'dateOfBirth','ssin'],['asc','asc','asc'])
                                .uniqBy('patientData.id')
                                .value()
                            )
                        }})
                        .catch(e=>{console.log("ERROR with search for patient: ", e);})
                }, 300)

            })
    }

  _closeSingleMessageComponent() {
      this.set('selectedMessage',null)
      this._focusChanged()
      this.classList.remove('selected')
      this.parentElement.children[0].classList.remove('selected')
      this.dispatchEvent(new CustomEvent('msg-detail-closed'))
  }

  unassign(e) {
      let detail = {
          'selectedMessage': this.selectedMessage,
      };
      this.dispatchEvent(new CustomEvent("document-unassign",  { detail: detail, bubbles: true }))
      this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true}));
  }

  delete(e) {
      let detail = {
          'selectedMessage': this.selectedMessage,
      };
      this.dispatchEvent(new CustomEvent("document-delete",  { detail: detail, bubbles: true }))
      this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true}));
  }

  update(e) {
      let detail = {
          'selectedMessage': this.selectedMessage,
          'attachments': this.attachments
      };
      if (!this.selectedMessage.metas.documentDate || this.attachments.some(att => !att.filename || !att.type)) {
          let errors = [];

          !this.selectedMessage.subject && errors.push(this.localize('docTitle', 'Titre', this.language));
          !this.selectedMessage.metas.documentDate && errors.push(this.localize('doc_date', 'Document date', this.language));
          !this.attachments.every(att => !!att.filename) && errors.push(this.localize('filename', 'Nom de fichier', this.language));
          !this.attachments.every(att => !!att.type) && errors.push(this.localize('docType', 'Type de document', this.language));

          let errorDetail = errors.filter(item => !!item).join(', ');
          this.dispatchEvent(new CustomEvent("show-error-message", {
              detail: {
                  title: this.selectedMessage.subject,
                  message: 'err.document.missingField',
                  detail: errorDetail
              }, bubbles: true
          }));
          // this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true}));
      }
      else {
          this.dispatchEvent(new CustomEvent("document-update", {detail: detail, bubbles: true}));
          // this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true}));
      }
  }


  update2(e){
	    let detail = { 'doc': this.selectedMessage.metas, 'messageId': this.selectedMessage.id, 'status': this.selectedMessage.status, 'patientId': this.selectedMessage.patientId };
	    detail.doc.id = this.document.id;
	    if (!this.selectedMessage.metas.type || !this.selectedMessage.metas.documentDate) {
	        let errors = [];
          errors.push(!this.selectedMessage.metas.type && this.localize('type-doc', 'Document type', this.language));
          errors.push(!this.selectedMessage.metas.documentDate && this.localize('doc_date', 'Document date', this.language));
	        let errorDetail = errors.filter(item => !!item).join(', ');
          this.dispatchEvent(new CustomEvent("show-error-message", {
              detail: {
                  title: this.selectedMessage.metas.filename,
                  message: 'err.document.missingField',
                  detail: errorDetail
              }, bubbles: true
          }));
          this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true}));
      }
	    else {
          this.dispatchEvent(new CustomEvent("document-update", {detail: detail, bubbles: true}));
          this.dispatchEvent(new CustomEvent("refresh-patient",{bubbles:true,composed:true}));
      }
  }

  _gotoPreviousGridPage() {
      if ( parseInt(_.get(this,"_currentPageNumber",1)) > 1 ) this.set( '_currentPageNumber',( parseInt(_.get(this,"_currentPageNumber",2)) - 1 ) )
  }

  _gotoNextGridPage() {
      if ( parseInt(_.get(this,"_currentPageNumber",1)) < parseInt(_.get(this,"_totalPagesForCurrentFolderAndCurrentFilter",1)) ) this.set('_currentPageNumber', ( parseInt(_.get(this,"_currentPageNumber",1)) + 1 ) )
  }

}

customElements.define(HtMsgDocDetail.is, HtMsgDocDetail);
