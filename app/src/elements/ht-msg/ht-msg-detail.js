import '../ht-spinner/ht-spinner.js';
import '../filter-panel/filter-panel.js';
import '../dynamic-form/dynamically-loaded-form.js';
import '../dynamic-form/entity-selector.js';
import '../dynamic-form/dynamic-doc.js';
import '../pdf-element/pdf-element.js';
import '../dynamic-form/validator/ht-ssin-validator.js';
import '../../styles/buttons-style.js';
import '../../styles/dialog-style.js';
import '../print/print-document.js';
import '../../styles/shared-styles.js';

import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-card/paper-card"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-input/paper-input"
import "@polymer/paper-tabs/paper-tabs"
import "@vaadin/vaadin-checkbox/vaadin-checkbox"
import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-date-picker/vaadin-date-picker"

import _ from 'lodash/lodash';
import moment from 'moment/src/moment';
import levenshtein from 'js-levenshtein'

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class HtMsgDetail extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style include="shared-styles buttons-style dialog-style">

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
                padding: 0 10px;
			}

			.contact-title{
				display:block;
				@apply --paper-font-body2;
				@apply --padding-32;
				padding-bottom:8px;
				padding-top: 32px;
			}

			.msg-detail-card > .card-content {
				padding: 16px 16px 32px !important;
			}

			.msg-detail-card {
				width: 100%;
                padding: 0 16px 8px 16px;
				display: block;
				background: transparent;
                flex-grow: 0;
                margin: 12px 0;
                border: 1px solid #ccc;
                box-shadow: none;
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

			.img-container img{
				max-width: 100%;
				height: auto;
			}

            .action-buttons {
                width: 100%;
                padding: 0;
                z-index: 10;
                padding: 0;
                box-sizing: border-box;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
            }

            /*.buttons{*/
            /*    display: flex;*/
            /*    flex-flow: row wrap;*/
            /*    justify-content: flex-start;*/
            /*    align-items: center;*/
            /*}*/

            /*.dialogButtons {*/
            /*    position:fixed;*/
            /*    bottom:60px;*/
            /*    right:30px;*/
            /*}*/

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

			.senderDetails {
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
                    padding-left: 36px;
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

            h3.subject {
                margin:10px 0 10px 0;
            }

            .messageHeaders {
                color:var(--app-text-color-dark);
                font-size:14px
            }

            .singleHeaderLine {
                margin-bottom:5px;
            }

            .w20 {
                width:20px;
            }

            .h20 {
                height:20px;
            }

            .m-t-minus-2 {
                margin-top:-2px;
            }

            .clear {
                clear: both;
            }

            .m-t-10 {
                margin-top: 10px;
            }

            .m-t-20 {
                margin-top: 20px;
            }

            .visibilityHidden {
                                visibility:hidden;
                            }

            .fs9em {
                font-size:.9em;
            }

            .fs8em {
                font-size:.8em;
            }

            .fileSize {
                color:var(--app-primary-color-light);
                font-size:.9em;
                font-style:italic;
            }

            .cursorPointer{
                cursor:pointer;
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

            .loadingIcon {
                margin-right:5px;
                margin-top:-4px;
            }

            .loadingIcon.done {
                color: var(--app-secondary-color);
            }

            .textAlignCenter {
                text-align: center;
            }

            .modalDialog {
                /*height: 300px;*/
                /*max-width: 600px;*/
            }

            #annexAssignmentDialog {
                height: 100%;
                width: 100%;
                background-color: rgba(0,0,0,.3);
            }

            #annexAssignmentDialog::before {
                display:none;
            }

            #annexAssignmentDialogContainer {
                padding:0px;
                margin:70px 10px 0 10px;
                height:calc(100% - 110px);
                background-color:#ffffff;
                box-shadow: var(--app-shadow-elevation-2)
            }

            .contentContainer {
                position:relative;
                margin:0;
                height:calc(100% - 96px);
                padding:20px;
            }

            #annexAssignmentLoadingContainer {
                position:absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-color: rgba(255,255,255,.8);
                z-index: 10;
                text-align: center;
            }

            .f-r {
                float:right
            }

            #annexAssignmentSpinnerContainer{
                width:80px;
                height:80px;
                position:absolute;
                top: 50%;left: 50%;
                transform: translate(-50%, -50%);
                padding:10px;
                border:1px solid var(--app-secondary-color);
            }

            .cursorPointer {
                cursor: pointer;
            }

            .dialogTabContent {
                padding:20px 20px 0 20px ;
                height: calc(100% - 130px);
                border:1px solid var(--app-background-color-darker)!important;
                overflow:auto;
            }

            .dialogTab {
                border-top:1px solid var(--app-background-color-darker);
                border-left:1px solid var(--app-background-color-darker);
                padding-left: 0;
                padding-right: 0;
            }

            .dialogTab:last-child {
                border-right:1px solid var(--app-background-color-darker);
            }

            .iron-selected {
                background-color:var(--app-background-color-dark)
            }

            .singleAssignment {
                margin-bottom:30px;
                border:1px dashed var(--app-background-color-darker);
                padding:15px 15px 10px 15px;
                background-color: var(--app-background-color);
                position:relative;
            }

            .singleAssignmentLine {
                margin-bottom:5px;
            }

            .singleAssignmentChecked {
                position:absolute;
                right:20px;
                top:20px;
                font-weight:700;
                color: #006C03;
            }

            .singleAssignmentDelete, .singleAssignmentSet {
                position:absolute;
                bottom:15px;
                right:15px;
            }

            .newPatient .singleAssignmentSet {
                position:relative;
                bottom:unset;
                right:unset;
                text-align: right;
            }

            #positiveFeedback, #negativeFeedback {
                display: flex;
                position: fixed;
                top: 50vh;
                right: 0;
                transform: translate(100vw,-50%);
                z-index: 999;
                padding: 16px;
                border-radius: 4px 0 0 4px;
                transition: 1s ease-in;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                background: rgba(0,0 ,0,.42);
                color: var(--app-text-color-light);
                box-shadow: 0 9px 12px 1px rgba(0,0,0,.14),
                0 3px 16px 2px rgba(0,0,0,.12),
                0 5px 6px 0 rgba(0,0,0,.2);
            }

            #positiveFeedback iron-icon, #negativeFeedback iron-icon{
                border-radius: 50%;
                padding: 2px;
                margin-right: 8px;
                box-sizing: border-box;
            }

            #positiveFeedback iron-icon{
                background: var(--app-status-color-ok);
            }

            #negativeFeedback iron-icon{
                background: var(--app-status-color-nok);
            }

            .showFeedbackMessage {
                animation: ribbonFeedbackAnimation 7.5s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            @keyframes ribbonFeedbackAnimation {
                0% {transform: translate(100vw,-50%);}
                10% {transform: translate(0,-50%);}
                88% {transform: translate(0,-50%);}
                100% {transform: translate(100vw,-50%);}
            }

            .patientPicture {
                float: left;
                margin: 0 15px 0 0;
                width: 155px;
                text-align: center;
                border: 1px solid #ccc;
                height:155px;
                overflow: hidden;
            }

            .patientPicture img {
                height: 155px;
                width: auto;
            }

            .insideAssignmentDialog {
                max-width:600px;
            /*    height: 100%;*/
            /*    background-color: rgba(0,0,0,0.3);*/
            }

            /*.insideAssignmentDialogContainer {*/
            /*    height: 300px;*/
            /*    width: 600px;*/
            /*    background-color: #fff;*/
            /*    margin:0;*/
            /*    padding:0;*/
            /*    box-shadow: var(--app-shadow-elevation-2);*/
            /*    top: 50%;*/
            /*    left: 50%;*/
            /*    position: fixed;*/
            /*    transform: translate(-50%, -50%);*/
            /*}*/

            /*.insideAssignmentDialogButtons {*/
            /*    position: fixed;*/
            /*    bottom:40px;*/
            /*    left: 50%;*/
            /*    transform: translateX(-50%);*/
            /*}*/

            /*#gotMovedToAssignedMessagesFromEhboxDialog .insideAssignmentDialogButtons {*/
            /*    bottom:20px;*/
            /*}*/

            .m-b-0 {
                margin-bottom:0px
            }

            .m-t-0 {
                margin-top:0px
            }

            .m-t-30 {
                margin-top:30px
            }

            .m-t-50 {
                margin-top:50px
            }

            .bottom30 {
                    bottom:30px!important;
                }

            .documentTypeComboBoxContainer {
                position: absolute;
                right: 15px;
                top: 15px;
                width: 320px;
            }

            .documentTypeComboBoxContainer.alreadyAssigned {
                position: absolute;
                right: 15px;
                top: 65px;
                width: auto;
            }

            .documentTypeComboBox {
                width:100%
            }

            .documentTypeLabel {
                font-weight: 700;
                text-transform: uppercase;
                display:block;
            }

            #searchInputContainer {
                margin-bottom:20px;
            }

            .batchNumber{
                padding: 3px 7px;
                font-size: 13px;
                color: var(--app-text-color-light);
                border-radius: 10px;
                min-height: 0;
                display: block;
                line-height: 16px;
                height: 15px;
                margin-left:8px;
                margin-top:-2px;
            }

            .batchOrange {
                background-color: var(--paper-orange-400);
            }

            .batchRed {
                background-color: var(--paper-red-400);
            }

            .batchBlue {
                background-color: var(--paper-blue-400);
            }

            .batchGreen {
                background-color: var(--paper-green-400);
            }

            .batchPurple {
                background-color: var(--paper-purple-300);
            }

            .bold {
                font-weight: 700;
            }

            .tabAssignmentFeedback {
                border:2px solid #3daf03;
                text-align:center;
                position: fixed;
                top:50%;
                left:50%;
                transform: translate(-50%, -50%);
                background:#e1ffec;
                padding:10px 20px;
            }

            .tabAssignmentFeedback.negative {
                border:2px solid #840000;
                background:#fff2f2;
            }

            .m-b-5 {
                margin-bottom:5px;
            }

            .p050 {
                padding:0 50px;
            }

            .fl50 {
                float:left;
                width: calc(50% - 10px)
            }

            .fr50 {
                float:right;
                width: calc(50% - 10px)
            }

            vaadin-date-picker {
                min-width:100%!important;
                margin-top:14px;
            }

            .fieldLabel {
                float:left;
                margin-top:18px;
                margin-right: 10px;
            }

            #newPat_gender {
                min-width:calc(100% - 52px);
            }

            .newPatient .documentTypeComboBox {
                width:calc(100% - 132px)
            }

            .modal-title {
                justify-content: flex-start;
            }

            .modal-title iron-icon{
                margin-right: 8px;
            }

            .absright20 {
                position: absolute;
                right:20px
            }

        </style>



        <template is="dom-if" if="[[_isLoading]]">
            <div id="loadingContainer">
                <div id="loadingContentContainer">
                    <div style="max-width:80px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner></div>
                    <div id="loadingContent"></div>
                </div>
            </div>
        </template>



        <template is="dom-if" if="[[selectedMessage]]">
            <div id="main-details-panel" class="details-panel">



                <div class="action-buttons">
                    <!-- Reply -->
                    <template is="dom-if" if="[[ehealthSession]]"><template is="dom-if" if="[[!_isSentbox(selectedMessage)]]"><template is="dom-if" if="[[!_isDeleted(selectedMessage)]]"><template is="dom-if" if="[[!_isAcknowledgment]]"><paper-button class="button button--save" on-tap="_takeAction" data-action="reply"><iron-icon icon="icons:reply" data-action="reply"></iron-icon> [[localize('reply','Reply',language)]]</paper-button></template></template></template></template>
                    <!-- Forward -->
                    <template is="dom-if" if="[[ehealthSession]]"><template is="dom-if" if="[[!_isAcknowledgment]]"><paper-button class="button button--save" on-tap="_takeAction" data-action="forward"><iron-icon icon="icons:reply" style="transform: scaleX(-1)" data-action="forward"></iron-icon> [[localize('ehb.forward','Forward',language)]]</paper-button></template></template>
                    <!-- Hide / unhide -->
                    <template is="dom-if" if="[[_isHidden(selectedMessage)]]"><template is="dom-if" if="[[!_isProcessed(selectedMessage)]]"><paper-button class="button button--save" on-tap="_takeAction" data-action="hideUnhide"><iron-icon icon="visibility" data-action="hideUnhide"></iron-icon> [[localize('ehb.unhideMessage','Unhide message',language)]]</paper-button></template></template>
                    <template is="dom-if" if="[[!_isHidden(selectedMessage)]]"><template is="dom-if" if="[[!_isProcessed(selectedMessage)]]"><template is="dom-if" if="[[!_isDeleted(selectedMessage)]]"><paper-button class="button button--other" on-tap="_takeAction" data-action="hideUnhide"><iron-icon icon="visibility-off" data-action="hideUnhide"></iron-icon> [[localize('hid_msg','Hide message',language)]]</paper-button></template></template></template>
                    <!-- Delete / undelete / delete for ever -->
                    <template is="dom-if" if="[[ehealthSession]]">
                        <template is="dom-if" if="[[_isDeleted(selectedMessage)]]">
                            <paper-button class="button button--other" on-tap="_takeAction" data-action="deleteUndelete"><iron-icon icon="undo" data-action="deleteUndelete"></iron-icon> [[localize('restore','Restore',language)]]</paper-button>
                            <paper-button class="button button--save" on-tap="_takeAction" data-action="deleteForEver"><iron-icon icon="delete-forever" data-action="deleteForEver"></iron-icon> [[localize('ehb.permaDelete','Delete for ever',language)]]</paper-button>
                        </template>
                        <template is="dom-if" if="[[!_isDeleted(selectedMessage)]]"><paper-button class="button button--other" on-tap="_takeAction" data-action="deleteUndelete"><iron-icon icon="delete" data-action="deleteUndelete"></iron-icon> [[localize('del','Delete',language)]]</paper-button></template>
                    </template>
                    <paper-button class="button" on-tap="_takeAction" data-action="close">[[localize('clo','Close',language)]]</paper-button>
                </div>



                <paper-card class="msg-detail-card">
                    <h3 class="subject">[[selectedMessage.subject]]</h3>
                    <div class="messageHeaders">
                        <div class="singleHeaderLine"><iron-icon icon="icons:account-circle" class="w20 m-t-minus-2"></iron-icon> [[selectedMessage.fromAddress]]</div>
                        <div class="singleHeaderLine"><iron-icon icon="icons:date-range" class="w20 m-t-minus-2"></iron-icon> [[_msTstampToDDMMYYYY(selectedMessage.created)]]</div>
                        <template is="dom-if" if="[[_isImportant(selectedMessage)]]"><div class="singleHeaderLine"><iron-icon icon="warning" class="darkRed w20 m-t-minus-2"></iron-icon> [[localize('ehb.important','High importance',language)]]</div></template>
                        <template is="dom-repeat" items="[[_linkedPatientsBasedOnMessageSsinAndAnnexes]]" as="singlePatient"><div class="singleHeaderLine"><iron-icon icon\$="[[_iconBySex(singlePatient.sex)]]" class\$="[[_colorCssClassBySex(singlePatient.sex)]] w20 m-t-minus-2"></iron-icon> [[singlePatient.lastName]] [[singlePatient.firstName]] [[singlePatient.ssinOrBirthdate]]</div></template>
                        <template is="dom-repeat" items="[[_messageAttachments]]" as="singleAttachment">
                            <template is="dom-if" if="[[singleAttachment.attachmentUrl]]">
                                <div class="singleHeaderLine cursorPointer" data-attachmenturl="[[singleAttachment.attachmentUrl]]" on-tap="_downloadAttachment">
                                    <iron-icon icon="editor:attach-file" class="w20 m-t-minus-2" data-attachmenturl="[[singleAttachment.attachmentUrl]]"></iron-icon>
                                    [[singleAttachment.filename]] <span class="fileSize" data-attachmenturl="[[singleAttachment.attachmentUrl]]">([[singleAttachment.size]])</span>
                                    <iron-icon icon="icons:file-download" class="w20 m-t-minus-2" data-attachmenturl="[[singleAttachment.attachmentUrl]]"></iron-icon>
                                </div>
                            </template>
                        </template>

                    </div>
                </paper-card>

                <template is="dom-repeat" items="[[documentsOfMessage]]">
                    <div class="layout-vertical annexe-card">
                        <dynamic-doc id="[[item.id]]" api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" patient="[[patient]]" document-id="[[item.id]]" title="[[item.label]]" preview="true" printable="true" downloadable="true" fullwidth="true" patient-data="[[item.patientData]]" annexes-infos="[[selectedMessage.annexesInfos]]" is-body-text-of-email="[[_isEqual(item.documentLocation,'body')]]" on-trigger-open-assignment-dialog="_toggleAssignmentDialog" on-print-document="_printDocument"></dynamic-doc>
                    </div>
                </template>

            </div>
        </template>



        <paper-dialog class="modalDialog" id="annexAssignmentDialog" always-on-top="true" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <div id="annexAssignmentDialogContainer">
                <h2 class="modal-title"><iron-icon icon="vaadin:clipboard-user" class=""></iron-icon> [[localize('ehb.assignWindow.title','Assign selected annex to patient file',language)]] <iron-icon icon="icons:close" class="cursorPointer absright20" on-tap="_toggleAssignmentDialog"></iron-icon></h2>



                <div class="contentContainer">



                    <template is="dom-if" if="[[_assignmentDialogIsLoading]]"><div id="annexAssignmentLoadingContainer"><div id="annexAssignmentSpinnerContainer"><ht-spinner active=""></ht-spinner></div></div></template>



                    <paper-tabs selected="{{_assignmentActiveTab}}" attr-for-selected="name">
                        <paper-tab class="dialogTab" name="suggestion"><iron-icon icon="vaadin:clipboard-user" class="w20 m-t-minus-2"></iron-icon> [[localize('ehb.assignmentSuggestions','Assignment suggestions',language)]] <span class="batchNumber batchRed">[[_sizeCount(_resolvedPatientsForSuggestedAssignments)]]</span></paper-tab>
                        <paper-tab class="dialogTab" name="manual"><iron-icon icon="vaadin:pointer" class="w20 m-t-minus-2"></iron-icon> [[localize('ehb.manualAssignment','Manual assignment',language)]] / [[localize('lowerSch','search',language)]] <span class="batchNumber batchBlue">[[_sizeCount(_manualSearchResultsForAssignments)]]</span></paper-tab>
                        <paper-tab class="dialogTab" name="newPatient"><iron-icon icon="vaadin:user-card" class="w20 m-t-minus-2"></iron-icon> [[localize('ehb.assignToNewPatient','New patient',language)]]</paper-tab>
                        <paper-tab class="dialogTab" name="existing"><iron-icon icon="vaadin:bullets" class="w20 m-t-minus-2"></iron-icon> [[localize('ehb.existingAssignments','Existing assignments',language)]] <span class="batchNumber batchGreen">[[_totalAnnexesAlreadyAssignedForCurrentDoc]]</span></paper-tab>
                    </paper-tabs>

                    <div class="dialogTabContent">

                        <template is="dom-if" if="[[_isEqual(_assignmentActiveTab,'suggestion')]]">

                            <template is="dom-if" if="[[_totalRemainingAnnexesToAssignForCurrentDoc]]">
                                <template is="dom-if" if="[[_size(_resolvedPatientsForSuggestedAssignments)]]">
                                    <template is="dom-repeat" items="[[_resolvedPatientsForSuggestedAssignments]]" as="item">
                                        <div class="singleAssignment">
                                            <div class="patientPicture"><img src\$="[[_renderPatientPicture(item.patientData)]]"></div>
                                            <div class="singleAssignmentLine"><iron-icon icon\$="[[_iconBySex(item.patientData.sex)]]" class\$="[[_colorCssClassBySex(item.patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[item.patientData.lastName]] [[item.patientData.firstName]]</b></div>
                                            <div class="singleAssignmentLine"><iron-icon icon="vaadin:user-card" class="w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(item.patientData.ssin)]]</div>
                                            <div class="singleAssignmentLine"><iron-icon icon="social:cake" class="w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[item.patientData.dateOfBirthHr]]</div>
                                            <div class="singleAssignmentLine"><iron-icon icon="icons:home" class="w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[item.patientData.address.street]] [[item.patientData.address.houseNumber]] [[item.patientData.address.postboxNumber]]</div>
                                            <div class="singleAssignmentLine"><iron-icon icon="social:location-city" class="w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[item.patientData.address.postalCode]] [[item.patientData.address.city]]</div>
                                            <div class="singleAssignmentLine"><iron-icon icon="vaadin:calendar-clock" class="w20 m-t-minus-2"></iron-icon> [[localize('last_edi','Last modification',language)]]: [[item.patientData.lastModifiedHr]]</div>
                                            <div class="documentTypeComboBoxContainer"><span class="documentTypeLabel">[[localize('ehb.assignmentDocumentType','Document type',language)]]:</span><vaadin-combo-box id\$="documentType-[[item.documentId]]-[[item.patientData.id]]" class="documentTypeComboBox" filtered-items="[[_transactionCodes]]" item-label-path="name" item-value-path="code" value="[[item.documentType]]"></vaadin-combo-box></div>
                                            <div class="singleAssignmentSet"><paper-button class="button button--other" on-tap="_openConfirmActionDialog" data-confirmation-action="_saveAssignment" data-document-id\$="[[item.documentId]]" data-patient-id\$="[[item.patientData.id]]"><iron-icon icon="icons:assignment-turned-in" class="w20 m-t-minus-2" data-confirmation-action="_saveAssignment" data-document-id\$="[[item.documentId]]" data-patient-id\$="[[item.patientData.id]]"></iron-icon> [[localize('assignDocumentToThisPatient','Assign document to this patient',language)]]</paper-button></div>
                                            <div class="clear"></div>
                                        </div>
                                    </template>
                                </template>
                            </template>

                            <template is="dom-if" if="[[!_totalRemainingAnnexesToAssignForCurrentDoc]]">
                                <div class="tabAssignmentFeedback">
                                    <p class="bold"><iron-icon icon="icons:check-circle" class="w20 m-t-minus-2"></iron-icon> [[localize('ehb.allAnnexesAreAssigned','You already assigned everything for this document.',language)]]</p>
                                    <p class="m-t-20 cursorPointer" on-tap="_goToTab4"><iron-icon icon="arrow-forward" class="w20 m-t-minus-2" on-tap="_goToTab4"></iron-icon> [[localize('ehb.gotoExistingAssignments','View existing assignments',language)]]</p>
                                </div>
                            </template>

                            <template is="dom-if" if="[[_totalRemainingAnnexesToAssignForCurrentDoc]]">
                                <template is="dom-if" if="[[!_size(_resolvedPatientsForSuggestedAssignments)]]">
                                    <div class="tabAssignmentFeedback negative">
                                        <p class="bold"><iron-icon icon="icons:cancel" class="w20 m-t-minus-2 darkerRed"></iron-icon> [[localize('ehb.noSuggestionFound','No suggestion could be found.',language)]]</p>
                                        <p class="m-t-20 cursorPointer" on-tap="_goToTab2"><iron-icon icon="arrow-forward" class="w20 m-t-minus-2" on-tap="_goToTab2"></iron-icon> [[localize('ehb.gotoManualAssignments','Search for a patient to assign',language)]]</p>
                                    </div>
                                </template>
                            </template>

                        </template>

                        <template is="dom-if" if="[[_isEqual(_assignmentActiveTab,'manual')]]">

                            <template is="dom-if" if="[[_totalRemainingAnnexesToAssignForCurrentDoc]]">
                                <div id="searchInputContainer"><paper-input id="searchInputField" label="[[localize('inputYourSearchQuery','Input your search query...',language)]]" value="{{searchedValue}}" autofocus=""></paper-input></div>
                                <template is="dom-repeat" items="[[_manualSearchResultsForAssignments]]" as="item">
                                    <div class="singleAssignment">
                                        <div class="patientPicture"><img src\$="[[_renderPatientPicture(item.patientData)]]"></div>
                                        <div class="singleAssignmentLine"><iron-icon icon\$="[[_iconBySex(item.patientData.sex)]]" class\$="[[_colorCssClassBySex(item.patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[item.patientData.lastName]] [[item.patientData.firstName]]</b></div>
                                        <div class="singleAssignmentLine"><iron-icon icon="vaadin:user-card" class="w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(item.patientData.ssin)]]</div>
                                        <div class="singleAssignmentLine"><iron-icon icon="social:cake" class="w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[item.patientData.dateOfBirthHr]]</div>
                                        <div class="singleAssignmentLine"><iron-icon icon="icons:home" class="w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[item.patientData.address.street]] [[item.patientData.address.houseNumber]] [[item.patientData.address.postboxNumber]]</div>
                                        <div class="singleAssignmentLine"><iron-icon icon="social:location-city" class="w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[item.patientData.address.postalCode]] [[item.patientData.address.city]]</div>
                                        <div class="singleAssignmentLine"><iron-icon icon="vaadin:calendar-clock" class="w20 m-t-minus-2"></iron-icon> [[localize('last_edi','Last modification',language)]]: [[item.patientData.lastModifiedHr]]</div>
                                        <div class="documentTypeComboBoxContainer"><span class="documentTypeLabel">[[localize('ehb.assignmentDocumentType','Document type',language)]]:</span><vaadin-combo-box id\$="documentType-[[item.documentId]]-[[item.patientData.id]]" class="documentTypeComboBox" filtered-items="[[_transactionCodes]]" item-label-path="name" item-value-path="code" value="[[item.documentType]]"></vaadin-combo-box></div>
                                        <div class="singleAssignmentSet"><paper-button class="button button--save" on-tap="_openConfirmActionDialog" data-confirmation-action="_saveAssignment" data-document-id\$="[[item.documentId]]" data-patient-id\$="[[item.patientData.id]]"><iron-icon icon="icons:assignment-turned-in" class="w20 m-t-minus-2" data-confirmation-action="_saveAssignment" data-document-id\$="[[item.documentId]]" data-patient-id\$="[[item.patientData.id]]"></iron-icon> [[localize('assignDocumentToThisPatient','Assign document to this patient',language)]]</paper-button></div>
                                        <div class="clear"></div>
                                    </div>
                                </template>
                            </template>

                            <template is="dom-if" if="[[!_totalRemainingAnnexesToAssignForCurrentDoc]]">
                                <div class="tabAssignmentFeedback">
                                    <p class="bold"><iron-icon icon="icons:check-circle" class="w20 m-t-minus-2"></iron-icon> [[localize('ehb.allAnnexesAreAssigned','You already assigned everything for this document.',language)]]</p>
                                    <p class="m-t-20 cursorPointer" on-tap="_goToTab4"><iron-icon icon="arrow-forward" class="w20 m-t-minus-2" on-tap="_goToTab4"></iron-icon> [[localize('ehb.gotoExistingAssignments','View existing assignments',language)]]</p>
                                </div>
                            </template>

                        </template>

                        <template is="dom-if" if="[[_isEqual(_assignmentActiveTab,'newPatient')]]">

                            <template is="dom-if" if="[[_totalRemainingAnnexesToAssignForCurrentDoc]]">
                                <div class="singleAssignment newPatient">

                                    <div class="fl50"><paper-input label="[[localize('las_nam','Last name',language)]]" value="{{newPat.lastName}}" id="newPat_lastName" auto-validate="" required=""></paper-input></div>
                                    <div class="fr50"><paper-input label="[[localize('fir_nam','First name',language)]]" value="{{newPat.firstName}}" id="newPat_firstName" auto-validate="" required=""></paper-input></div>
                                    <div class="clear"></div>

                                    <div class="fl50"><vaadin-date-picker label="[[localize('birthDate','Date of birth',language)]]" i18n="[[i18n]]" value="{{newPat.birthDate}}" id="newPat_birthDate" can-be-fuzzy auto-validate="" required=""></vaadin-date-picker></div>
                                    <!-- 20191210 - Murielle Mernier - Niss should not be validated anymore -->
                                    <!--<div class="fr50"><ht-ssin-validator validator-name="ht-ssin-validator"></ht-ssin-validator><paper-input label="[[localize('ssinPatVerbose','National identification number',language)]]" auto-validate required validator="ht-ssin-validator" value="{{newPat.ssin}}" id="newPat_ssin"></paper-input></div>-->
                                    <div class="fr50"><paper-input label="[[localize('ssinPatVerbose','National identification number',language)]]" value="{{newPat.ssin}}" id="newPat_ssin"></paper-input></div>
                                    <div class="clear"></div>

                                    <div class="fl50"><span class="fieldLabel">[[localize('gender','Gender',language)]]: </span><vaadin-combo-box filtered-items="[[_genders]]" item-label-path="name" item-value-path="value" value="{{newPat.gender}}" id="newPat_gender" auto-validate=""></vaadin-combo-box></div>
                                    <div class="fr50"><span class="fieldLabel">[[localize('ehb.assignmentDocumentType','Document type',language)]]:</span><vaadin-combo-box class="documentTypeComboBox" filtered-items="[[_transactionCodes]]" item-label-path="name" item-value-path="code" value="{{newPat.documentType}}" auto-validate="" id="newPat_documentType"></vaadin-combo-box></div>
                                    <div class="clear"></div>

                                    <div class="singleAssignmentSet"><paper-button class="button button--save" on-tap="_openConfirmActionDialog" data-confirmation-action="_createNewPatAndSaveAssignment" data-document-id\$="[[_assignmentCurrentDocumentId]]"><iron-icon icon="icons:assignment-turned-in" class="w20 m-t-minus-2" data-confirmation-action="_createNewPatAndSaveAssignment" data-document-id\$="[[_assignmentCurrentDocumentId]]"></iron-icon> [[localize('createPatientAndAssignDocument','Create and assign',language)]]</paper-button></div>
                                    <div class="clear"></div>
                                </div>
                            </template>

                            <template is="dom-if" if="[[!_totalRemainingAnnexesToAssignForCurrentDoc]]">
                                <div class="tabAssignmentFeedback">
                                    <p class="bold"><iron-icon icon="icons:check-circle" class="w20 m-t-minus-2"></iron-icon> [[localize('ehb.allAnnexesAreAssigned','You already assigned everything for this document.',language)]]</p>
                                    <p class="m-t-20 cursorPointer" on-tap="_goToTab4"><iron-icon icon="arrow-forward" class="w20 m-t-minus-2" on-tap="_goToTab4"></iron-icon> [[localize('ehb.gotoExistingAssignments','View existing assignments',language)]]</p>
                                </div>
                            </template>

                        </template>

                        <template is="dom-if" if="[[_isEqual(_assignmentActiveTab,'existing')]]">

                            <template is="dom-if" if="[[_size(_alreadyAssignedDocuments)]]">
                                <template is="dom-repeat" items="[[_alreadyAssignedDocuments]]" as="item">
                                    <div class="singleAssignment">
                                        <div class="patientPicture"><img src\$="[[_renderPatientPicture(item.patientData)]]"></div>
                                        <div class="singleAssignmentLine"><iron-icon icon\$="[[_iconBySex(item.patientData.sex)]]" class\$="[[_colorCssClassBySex(item.patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[item.patientData.lastName]] [[item.patientData.firstName]]</b></div>
                                        <div class="singleAssignmentLine"><iron-icon icon="vaadin:user-card" class="w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(item.patientData.ssin)]]</div>
                                        <div class="singleAssignmentLine"><iron-icon icon="social:cake" class="w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[item.patientData.dateOfBirthHr]]</div>
                                        <div class="singleAssignmentLine"><iron-icon icon="icons:home" class="w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[item.patientData.address.street]] [[item.patientData.address.houseNumber]] [[item.patientData.address.postboxNumber]]</div>
                                        <div class="singleAssignmentLine"><iron-icon icon="social:location-city" class="w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[item.patientData.address.postalCode]] [[item.patientData.address.city]]</div>
                                        <div class="singleAssignmentLine"><iron-icon icon="vaadin:calendar-clock" class="w20 m-t-minus-2"></iron-icon> [[localize('assignmentDate','Assignment date',language)]]: [[item.createdHr]]</div>
                                        <div class="singleAssignmentChecked"><iron-icon icon="icons:check-circle" class="w20 m-t-minus-2"></iron-icon> [[localize('documentAssigned','Document assigned',language)]]</div>
                                        <div class="documentTypeComboBoxContainer alreadyAssigned"><span class="documentTypeLabel">[[localize('ehb.assignmentDocumentType','Document type',language)]]:</span>[[item.documentTypeHr]]</div>
                                        <div class="singleAssignmentDelete"><paper-button class="button button--other" on-tap="_openConfirmActionDialog" data-confirmation-action="_deleteAssignment" data-contact-id\$="[[item.contactId]]"><iron-icon icon="icons:delete-forever" class="w20 m-t-minus-2" data-confirmation-action="_deleteAssignment" data-contact-id\$="[[item.contactId]]"></iron-icon> [[localize('deleteAssignment','Delete assignment',language)]]</paper-button></div>
                                        <div class="clear"></div>
                                    </div>
                                </template>
                            </template>

                            <template is="dom-if" if="[[!_size(_alreadyAssignedDocuments)]]">
                                <template is="dom-if" if="[[_size(_resolvedPatientsForSuggestedAssignments)]]">
                                    <div class="tabAssignmentFeedback negative">
                                        <p class="bold"><iron-icon icon="icons:cancel" class="w20 m-t-minus-2 darkerRed"></iron-icon> [[localize('ehb.noAssignmentYet','Document is not assigned yet.',language)]]</p>
                                        <p class="m-t-20 cursorPointer" on-tap="_goToTab1"><iron-icon icon="arrow-forward" class="w20 m-t-minus-2" on-tap="_goToTab1"></iron-icon> [[localize('ehb.gotoSuggestedAssignments','View suggested assignment',language)]]</p>
                                    </div>
                                </template>
                            </template>

                            <template is="dom-if" if="[[!_size(_alreadyAssignedDocuments)]]">
                                <template is="dom-if" if="[[!_size(_resolvedPatientsForSuggestedAssignments)]]">
                                    <div class="tabAssignmentFeedback negative">
                                        <p class="bold"><iron-icon icon="icons:cancel" class="w20 m-t-minus-2 darkerRed"></iron-icon> [[localize('ehb.noAssignmentYet','Document is not assigned yet.',language)]]</p>
                                        <p class="m-t-20 cursorPointer" on-tap="_goToTab2"><iron-icon icon="arrow-forward" class="w20 m-t-minus-2" on-tap="_goToTab2"></iron-icon> [[localize('ehb.gotoManualAssignments','Search for a patient to assign',language)]]</p>
                                    </div>
                                </template>
                            </template>

                        </template>

                    </div>

                    <div class="dialogButtons mt10"><paper-button class="button button--save" on-tap="_toggleAssignmentDialog"><iron-icon icon="icons:close" class="" on-tap="_toggleAssignmentDialog"></iron-icon> [[localize('clo','Close',language)]]</paper-button></div>



                    <div id="positiveFeedback"><iron-icon icon="check"></iron-icon> [[localize('assignmentSuccessfullyUpdated','Assignment successfully updated',language)]]</div>
                    <div id="negativeFeedback"><iron-icon icon="clear"></iron-icon> [[localize('assignmentNotSuccessfullyUpdated','Assignment could not be updated',language)]]</div>



                </div>



                <paper-dialog class="insideAssignmentDialog modalDialog" id="confirmActionDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('confirmModifyAssignment','Are you sure you update current assignment ?',language)]]</p>
                        <p class="">[[localize('updateCanBeUpdatedAfterwards',"Operation can be updated afterwards",language)]]</p>
                        <p class=""><vaadin-checkbox checked="{{_confirmationDialogAcknowledgementsProperties.confirmSaveDeleteAssignmentActionDialog}}"> [[localize('acknowledgementDontShowAnymore','I understand\\, don\\'t ask for confirmation in the future',language)]]</vaadin-checkbox></p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeConfirmActionDialog"><iron-icon icon="icons:close"></iron-icon>[[localize('can','Cancel',language)]]</paper-button>
                        <paper-button class="button button--save" on-tap="_doConfirmAction"><iron-icon icon="check-circle"></iron-icon> [[localize('confirm','Confirm',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="insideAssignmentDialog modalDialog informationDialog" id="gotMovedToAssignedMessagesDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('ehb.msgMovedToAssignedMsgs','We moved this message under your "Assigned messages" folder',language)]]</p>
                        <p class="">[[localize('ehb.msgAlwaysAvailableInTopaz',"This message will always be available in Topaz.",language)]]</p>
                        <p class="">[[localize('ehb.deletedFromEhbInFewDays',"It will nevertheless be deleted from your e-Healthbox in a few days.",language)]]</p>
                        <p class=""><vaadin-checkbox checked="{{_confirmationDialogAcknowledgementsProperties.gotMovedToAssignedMessagesDialog}}"> [[localize('acknowledgementDontShowAnymore','I understand\\, don\\'t ask for confirmation in the future',language)]]</vaadin-checkbox></p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--save" on-tap="_closeDialogs"><iron-icon icon="check-circle"></iron-icon> [[localize('thanks','Thank you',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="insideAssignmentDialog modalDialog informationDialog" id="gotRestoredToInboxDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('ehb.msgRestoredToInbox','We moved this message back to your inbox',language)]]</p>
                        <p class="">[[localize('ehb.annexesNotAllAssignedAnyMore',"As not all its annexes are assigned anymore.",language)]]</p>
                        <p class=""><vaadin-checkbox checked="{{_confirmationDialogAcknowledgementsProperties.gotRestoredToInboxDialog}}"> [[localize('acknowledgementDontShowAnymore','I understand\\, don\\'t ask for confirmation in the future',language)]]</vaadin-checkbox></p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--save" on-tap="_closeDialogs"><iron-icon icon="check-circle"></iron-icon> [[localize('thanks','Thank you',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="insideAssignmentDialog modalDialog informationDialog" id="fieldsValidationDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('someFieldsAreEmpty','Some required fields are empty.',language)]]</p>
                        <p class="">[[localize('pleaseCompleteAllFields',"Please fill in all fields.",language)]]</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--save" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="insideAssignmentDialog modalDialog informationDialog" id="alreadyExistingPatientDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('patientAlreadyExists','This patient already exists in your database.',language)]]</p>
                        <p class="">[[localize('referToManualAssignment',"Please refer to manual assignments.",language)]]</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--save" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>



            </div>
        </paper-dialog>



        <paper-dialog class="insideAssignmentDialog modalDialog informationDialog" id="gotMovedToAssignedMessagesFromEhboxDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
            <div class="insideAssignmentDialogContainer" style="height:370px">
                <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                <div class="modalDialogContent m-t-20">
                    <p class="textAlignCenter bold">[[localize('ehb.msgMovedToAssignedMsgs','We moved this message under your "Assigned messages" folder',language)]]</p>
                    <p class="textAlignCenter m-t-0 p050">[[localize('ehb.allAnnexesAssignedBasedOnNiss','Indeed, all annexes of current message got automatically assigned based on your patients\\' NISS number',language)]]</p>
                    <p class="textAlignCenter m-t-20 m-b-0">[[localize('ehb.msgAlwaysAvailableInTopaz',"This message will always be available in Topaz.",language)]]</p>
                    <p class="textAlignCenter m-t-0">[[localize('ehb.deletedFromEhbInFewDays',"It will nevertheless be deleted from your e-Healthbox in a few days.",language)]]</p>
                    <p class="textAlignCenter m-t-30"><vaadin-checkbox checked="{{_confirmationDialogAcknowledgementsProperties.gotMovedToAssignedMessagesFromEhboxDialog}}"> [[localize('acknowledgementDontShowAnymore','I understand\\, don\\'t ask for confirmation in the future',language)]]</vaadin-checkbox></p>
                </div>
                <div class="insideAssignmentDialogButtons">
                    <paper-button class="button button--save" on-tap="_closeDialogs"><iron-icon icon="check-circle"></iron-icon> [[localize('thanks','Thank you',language)]]</paper-button>
                </div>
            </div>
        </paper-dialog>



        <print-document id="printDocument" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]"></print-document>
`;
  }

  static get is() {
      return 'ht-msg-detail';
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
          ehealthSession: {
              type: Boolean,
              value: false,
              noReset: true
          },
          selectedMessage: {
              type: Object,
              value: {}
          },
          _isLoading: {
              type: Boolean,
              value: false,
              observer: '_loadingStatusChanged'
          },
          _loadingMessages: {
              type: Array,
              value: () => []
          },
          _linkedPatientsBasedOnMessageSsinAndAnnexes:{
              type: Array,
              value: () => []
          },
          processLock: {
              type: Boolean,
              value: false,
              noReset: true
          },
          documentsOfMessage:{
              type: Array,
              value: () => []
          },
          _messageAttachments:{
              type: Array,
              value: () => []
          },
          _assignmentActiveTab:{
              type: String,
              value: "suggestion"
          },
          _assignmentDialogIsLoading:{
              type: Boolean,
              value: false
          },
          _assignmentDialogIsOpened:{
              type: Boolean,
              value: false
          },
          _alreadyAssignedDocuments: {
              type: Array,
              value: () => []
          },
          _resolvedPatientsForSuggestedAssignments: {
              type: Array,
              value: () => []
          },
          _assignmentCallBack: {
              type: Object,
              value: {},
              noReset: true
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
          isAMedicalHouse: {
              type: Boolean,
              value: false,
              noReset: true
          },
          isParentAMedicalHouse: {
              type: Boolean,
              value: false,
              noReset: true
          },
          medicalHouseBillingTypeIsFlatRate: {
              type: Boolean,
              value: false,
              noReset: true
          },
          _totalAnnexesToAssignForCurrentDoc: {
              type: Number,
              value: 0
          },
          _totalAnnexesAlreadyAssignedForCurrentDoc: {
              type: Number,
              value: 0
          },
          _totalRemainingAnnexesToAssignForCurrentDoc: {
              type: Number,
              value: 0
          },
          _confirmationDataset: {
              type: Object,
              value: {}
          },
          _transactionCodes: {
              type: Array,
              value: ()=>[],
              noReset: true
          },
          _genders: {
              type: Array,
              value: ()=>[],
              noReset: true
          },
          _manualSearchResultsForAssignments: {
              type: Array,
              value: () => []
          },
          searchedValue: {
              type: String,
              value: ""
          },
          _patientSearchReqIdx: {
              type: Number,
              value: 0
          },
          _assignmentCurrentDocumentId: {
              type: String,
              value: "",
              noReset: true
          },
          _isAcknowledgment:{
              type: Boolean,
              value: false
          },
          newPat: {
              type: Object,
              value: () => {
                  return {
                      "lastName": "",
                      "firstName": "",
                      "birthDate": "",
                      "ssin": "",
                      "gender": "male",
                      "documentType": "labresult"
                  }
              }
          },
          _confirmationDialogAcknowledgementsProperties: {
              type: Array,
              value: () => [],
              noReset: true
          }
      };
  }

  static get observers() {
      return [
          '_setIsConnectedToEhbox(api.tokenId)',
          '_loadMessageDetails(selectedMessage)',
          '_manualSearchForPatients(searchedValue)',
          '_userDialogAcknowledgementsPropertiesChanged(_confirmationDialogAcknowledgementsProperties.*)'
      ];
  }

  constructor() {
      super();
  }

  ready() {
      super.ready();
      document.addEventListener('keyup',this._handleShortcutKeys.bind(this))
  }

  _setIsConnectedToEhbox() {
      this.set("ehealthSession", !!_.get(this,"api.tokenId"))
  }

  _isEqual(a, b) {
      return !!(a===b)
  }

  _msTstampToDDMMYYYY(msTstamp) {
      return parseInt(msTstamp) ? this.api.moment(parseInt(msTstamp)).format('DD/MM/YYYY') : ""
  }

  _isDeleted(inputData) {
      return !!_.trim(_.get(inputData,"transportGuid","")).startsWith("BIN")
  }

  _isProcessed(inputData) {
      return !!(_.get(inputData,"status",0)&(1<<26))
  }

  _isHidden(inputData) {
      return !!(_.get(inputData,"status",0)&(1<<14))
  }

  _isSentbox(inputData) {
      return !!_.trim(_.get(inputData,"transportGuid","")).startsWith("SENT")
  }

  _size(inputData){
      return !!_.size(inputData)
  }

  _sizeCount(inputData){
      return !!_.size(inputData) ? parseInt(_.size(inputData)) : 0
  }

  _renderPatientPicture(patientData) {
      return !_.trim(_.get(patientData,"picture","")) ?
          _.trim(_.get(patientData,"sex","M")) === 'F' ? require('../../../images/female-placeholder.png') : require('../../../images/male-placeholder.png') :
          'data:image/png;base64,' + _.trim(_.get(patientData,"picture",""))
  }

  _resetComponentData(){

      const componentProperties = HtMsgDetail.properties
      Object.keys(componentProperties).forEach(k => { if (!_.get(componentProperties[k],"noReset", false)) { this.set(k, (typeof componentProperties[k].value === 'function' ? componentProperties[k].value() : (componentProperties[k].value || null))) }})

      this.$['positiveFeedback'] && this.$['positiveFeedback'].classList && this.$['positiveFeedback'].classList.remove('showFeedbackMessage')
      this.$['negativeFeedback'] && this.$['negativeFeedback'].classList && this.$['negativeFeedback'].classList.remove('showFeedbackMessage')

  }

  assignResolvedObjects(inputObjects) {
      _.map(inputObjects, (v,k)=> this.set(k,v))
  }

  _getPatientDataBySsin(patientSsin) {
      return !_.trim(patientSsin) ?
          Promise.resolve() :
          this.api.patient().findByNameBirthSsinAutoWithUser(_.get(this,"user",{}), _.trim(_.get(this,"user.healthcarePartyId",null)), _.trim(patientSsin), null, null, 100)
              .then(foundPatientsBasedOnSsin => _
                  .chain(_.get(foundPatientsBasedOnSsin,"rows",[]))
                  .filter(i=>!!_.get(i,"active",false) && _.trim(_.get(i,"ssin","")) === _.trim(patientSsin))
                  .orderBy(['modified'],['desc'])
                  .head()
                  .value()
              )
              .catch(e=>{console.log("ERROR with findByNameBirthSsinAutoWithUser: ", e); return Promise.resolve();})
  }

  _takeAction(e, takeActionAdditionalParameters={}) {
      const actionToTake = typeof e === "string" ? _.trim(e) : _.get(_.filter(_.get(e,"path",[]), nodePath=> !!_.trim(_.get(nodePath,"dataset.action",""))),"[0].dataset.action","")
      const additionalParameters = _.merge({}, { documentsOfMessage:_.get(this,"documentsOfMessage",[]), _linkedPatientsBasedOnMessageSsinAndAnnexes:_.get(this,"_linkedPatientsBasedOnMessageSsinAndAnnexes",[]), _messageAttachments:_.get(this,"_messageAttachments",[]) }, takeActionAdditionalParameters)
      return (
              !_.trim(actionToTake) ||
              !_.trim(_.get(this,"selectedMessage.id", "")) ||
              (actionToTake==="reply" && !!this._isAcknowledgment) ||
              (actionToTake==="forward" && !!this._isAcknowledgment) ||
              ( actionToTake === "hideUnhide" && !!this._isProcessed(_.get(this,"selectedMessage",{})) )
          ) ?
              false :
              this.dispatchEvent(new CustomEvent('carry-out-action', {composed: true, bubbles: true, detail: {action:_.trim(actionToTake), message:_.get(this,"selectedMessage",{}),additionalParameters:additionalParameters}}))
  }

  _closeDialogs() {
      _.map( this.shadowRoot.querySelectorAll('.informationDialog'), i=> i && typeof i.close === "function" && i.close() )
  }

  _isImportant(m) {
      return ((m.status & (1 << 2)) !== 0)
  }

  _hasAnnex(m) {
      return ((m.status & (1 << 4)) !== 0)
  }

  _iconBySex(inputData) {
      return (inputData === "F" || inputData === "W") ? "vaadin:female" : "vaadin:male"
  }

  _colorCssClassBySex(inputData) {
      return (inputData === "F" || inputData === "W") ? "" : ""
  }

  _goToTab1() {
      this.set("_assignmentActiveTab", "suggestion")
  }

  _goToTab2() {
      this.set("_assignmentActiveTab", "manual")
  }

  _goToTab3() {
      this.set("_assignmentActiveTab", "newPatient")
  }

  _goToTab4() {
      this.set("_assignmentActiveTab", "existing")
  }

  _downloadAttachment(e) {

      const downloadUrl = _.get(_.filter(_.get(e,"path",[]), nodePath=> !!_.trim(_.get(nodePath,"dataAttachmenturl",""))),"[0].dataAttachmenturl","")
      if(!_.trim(downloadUrl)) return

      try {
          const linkObject = _.merge(document.createElement("a"),{ style: "display: none", href: downloadUrl })
          this.appendChild( linkObject ) && linkObject.click() && window.URL.revokeObjectURL(downloadUrl);
      } catch(e) { window.open(_.trim(downloadUrl)) }

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

  _toggleProcessingPopup( inputMessage="" ) {
      if(!_.get(this,"_isLoading",false)) {
          this._resetLoadingMessage();
          this.set('_isLoading', true );
          this._setLoadingMessage({ message: _.trim(inputMessage) ? _.trim(inputMessage) : this.localize('ongoingProcess',this.language), icon:"arrow-forward"});
      } else {
          this.set('_isLoading', false );
      }
  }

  _handleShortcutKeys(e) {

      const isActive = !!_.size(_.get(this,"selectedMessage",{}))
      const isInInput = ["INPUT", "SELECT", "TEXTAREA"].indexOf(_.get(e,"target.nodeName","")) !== -1
      const assignmentDialogIsOpened = !!_.get(this,"_assignmentDialogIsOpened",false)
      const activeView = _.trim(typeof _.get(e, "target.getAttribute", "") === "function" ? _.trim(e.target.getAttribute("view")) : "msg")
      const activeViewIsMsg = !activeView || activeView === "msg"

      if(!isActive || isInInput || !activeViewIsMsg || !!assignmentDialogIsOpened) return

      const pressedKey = _.trim(_.get(e,"key","")).toLocaleLowerCase();
      const message = _.get(this,"selectedMessage",{})
      const ehealthSession = !!this.ehealthSession
      const isSentBox = !!this._isSentbox(message)
      const isDeleted = !!this._isDeleted(message)

      //if(!!assignmentDialogIsOpened && pressedKey === "escape") this._toggleAssignmentDialog()

      if(pressedKey === "escape") this._takeAction("close")
      if(pressedKey === "h" || pressedKey === "m") this._takeAction("hideUnhide")
      if(!!ehealthSession && !isSentBox && !isDeleted && pressedKey === "r") this._takeAction("reply")
      if(!!ehealthSession && (pressedKey === "f" || pressedKey === "t")) this._takeAction("forward")
      if(!!ehealthSession && (pressedKey === "d" || pressedKey === "s" || pressedKey === "delete")) this._takeAction("deleteUndelete")

  }

  _formatSsinNumber(inputData) {
      return this.api.formatSsinNumber(_.trim(inputData))
  }

  _filterBestMatchingPatients( foundPatients, infosToMatchOn ) {

      return _.filter(foundPatients, p => {

          const pFn =  !_.trim(_.get(p,"firstName","")) ? false : p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(/\s+/)[0]
          const pLn =  !_.trim(_.get(p,"lastName","")) ? false : p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(/\s+/)[0]
          const lFn =  !_.trim(_.get(infosToMatchOn,"firstName","")) ? false : infosToMatchOn.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/,'')
          const lLn =  !_.trim(_.get(infosToMatchOn,"lastName","")) ? false : infosToMatchOn.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/,'')

          return (infosToMatchOn.ssin && p.ssin && infosToMatchOn.ssin === p.ssin) ||
              (pFn && lFn && pLn && lLn && p.dateOfBirth && infosToMatchOn.dateOfBirth && (levenshtein(pFn,lFn) < 2 && levenshtein(pLn,lLn) < 3 && p.dateOfBirth === infosToMatchOn.dateOfBirth)) ||
              (pFn && lFn && p.dateOfBirth && infosToMatchOn.dateOfBirth && (pFn === lFn && p.dateOfBirth === infosToMatchOn.dateOfBirth)) ||
              (pLn && lLn && p.dateOfBirth && infosToMatchOn.dateOfBirth && (pLn === lLn && p.dateOfBirth === infosToMatchOn.dateOfBirth)) ||
              (pFn && lFn && pLn && lLn && (pLn === lLn && pFn === lFn))

      })

  }

  _closeConfirmActionDialog() {
      this.$['confirmActionDialog'].close()
  }

  _deleteAssignment(e) {

      const contactId = _.trim(_.get(e,"contactId",""))
      if(!_.trim(contactId)) return;

      this.set("_assignmentCallBack", {
          action: "deleteAssignment",
          activeTab: _.trim(_.get(this,"_assignmentActiveTab","")),
          contactId: contactId,
          documentId: _.trim(_.get(_.find(_.get(this,"_alreadyAssignedDocuments",[]), {contactId:contactId}),"documentId")),
          patientId: _.trim(_.get(_.find(_.get(this,"_alreadyAssignedDocuments",[]), {contactId:contactId}),"patientId")),
      })

      this.set("_assignmentDialogIsLoading", true)
      this._takeAction(this._assignmentCallBack.action,{contactId:contactId, dontCloseReadMessageComponent:true})

  }

  _saveAssignment(e) {

      const documentId = _.trim(_.get(e,"documentId",""))
      const patientId = _.trim(_.get(e,"patientId",""))
      const documentType = _.trim(_.get(this.shadowRoot.querySelector('#documentType-' + documentId + '-' + patientId),"value","labresult"))
      const documentTypeLabel = _.get(_.find(this._transactionCodes, {code:documentType}), "name", "Analyse")
      if(!_.trim(documentId) || !_.trim(patientId)) return;

      this.set("_assignmentCallBack", {
          action: "saveAssignment",
          activeTab: _.trim(_.get(this,"_assignmentActiveTab","")),
          documentId: documentId,
          patientId: patientId,
          documentType: documentType
      })

      this.set("_assignmentDialogIsLoading", true)
      this._takeAction(this._assignmentCallBack.action,{documentId:documentId, patientId:patientId, documentType:documentType, documentTypeLabel:documentTypeLabel, dontCloseReadMessageComponent:true})

  }

  _manualSearchForPatients(searchedValue){

      if( _.trim(searchedValue).length < 3 ) { this.set("_manualSearchResultsForAssignments",[]); return; }

      const documentId = _.trim(_.get(this,"_assignmentCurrentDocumentId",""))
      const reqIdx = (this._patientSearchReqIdx = (this._patientSearchReqIdx || 0) + 1)
      const parentOrCurrentHcpId =_.trim(_.get(this,"parentHcp.id","")) ? _.trim(_.get(this,"parentHcp.id","")) : _.trim(_.get(this,"user.healthcarePartyId",""))

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
          if (reqIdx !== this._patientSearchReqIdx || !documentId) return;
          this.set("_assignmentDialogIsLoading", true)
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
              p => ( !!_.get(p,"active",false) && ( !!_.trim(_.get(p,"dateOfBirth","")) || !!_.trim(_.get(p,"ssin","")) ) ), 0, 50, []
          )
              .then(searchResults => { if (reqIdx === this._patientSearchReqIdx) {
                  return this.set("_manualSearchResultsForAssignments", _
                      .chain(searchResults)
                      .map(patientData =>{return {
                          isAssigned: false,
                          documentType: "labresult",
                          documentId: documentId,
                          patientData: {
                              id: _.trim(_.get(patientData, "id", "")),
                              firstName: _.map(_.trim(_.get(patientData, "firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                              lastName: _.map(_.trim(_.get(patientData, "lastName", "")).split(" "), i => _.capitalize(i)).join(" "),
                              dateOfBirth: _.trim(_.get(patientData, "dateOfBirth", "")),
                              dateOfBirthHr: (_.parseInt(_.trim(_.get(patientData, "dateOfBirth", ""))) ? this.api.formatedMoment(_.parseInt(_.trim(_.get(patientData, "dateOfBirth", "")))) : ""),
                              ssin: _.trim(_.get(patientData, "ssin", "")),
                              sex: (_.trim(_.get(patientData, "gender", "male")).toLowerCase() === "male" ? "M" : "F"),
                              picture: _.trim(_.get(patientData, "picture", "")),
                              address: _.chain(_.get(patientData, "addresses", {})).filter({addressType: "home"}).head().value() ||
                                  _.chain(_.get(patientData, "addresses", {})).filter({addressType: "work"}).head().value() ||
                                  _.chain(_.get(patientData, "addresses", {})).head().value() ||
                                  {},
                              lastModifiedHr: parseInt(_.get(patientData, "modified", null)) ? moment(_.get(patientData, "modified", null)).format("DD/MM/YYYY - HH:mm:ss") : "-"
                          }
                      }})
                      .orderBy(['lastName','firstName', 'dateOfBirth','modified'],['asc','asc','desc','desc'])
                      .uniqBy('patientData.id')
                      .value()
                  )
              }})
              .catch(e=>{console.log("ERROR with _manualSearchForPatients: ", e);})
              .finally(() => this.set("_assignmentDialogIsLoading", false))
      }, 300)

  }

  _loadMessageDetails(selectedMessage) {

      const prom = Promise.resolve()
      let patientDetailsBasedOnSsin = false

      if(!!_.get(this, "processLock", false)) return prom;
      this.set("processLock", true)

      this._resetComponentData();
      if(!!_.size(selectedMessage)) this.set("selectedMessage", selectedMessage);
      this.set("processLock", false)

      if(!_.size(selectedMessage)) return prom
      this._toggleProcessingPopup()



      const assignmentCallBack = _.get(this,"_assignmentCallBack",{})
      if(!!_.size(assignmentCallBack)) {
          this.set("_assignmentDialogIsLoading", true)
          this.set("_assignmentActiveTab", _.trim(_.get(assignmentCallBack,"activeTab","suggestion")))
          this.set("_assignmentCallBack", {})
      }

      this.set("_isAcknowledgment", _.trim(_.get(selectedMessage,"fromHealthcarePartyId","")) === "12345678912" )



      return this._getPatientDataBySsin(_.trim(_.get(selectedMessage,"metas.patientSsin","")))
          .then(x => patientDetailsBasedOnSsin = x)
          .then(()=> !_.trim(_.get(selectedMessage,"id","")) ? prom : this.api.document().findByMessage(_.get(this,"user.healthcarePartyId",""), selectedMessage).catch(e=>{console.log("ERROR with findByMessage: ", e); return prom;}))
          .then(documentsOfMessage => !_.size(documentsOfMessage) ? prom : Promise.all(_.compact(_.filter(documentsOfMessage,d=>!!_.trim(_.get(d,"attachmentId",""))&&!!_.trim(_.get(d,"secretForeignKeys","")))).map(singleDocument => this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(_.get(this,"user.healthcarePartyId", null), _.trim(_.get(singleDocument,"id","")), _.size(_.get(singleDocument,"encryptionKeys",[])) ? _.get(singleDocument,"encryptionKeys",[]) : _.get(singleDocument,"delegations",[]))
              .then(({extractedKeys: enckeys}) => this.api.beresultimport().canHandle(_.trim(_.get(singleDocument,"id","")), enckeys.join(',')).catch(e=>{console.log("ERROR with canHandle: ", e); return prom;})
                  .then(canHandle => !!canHandle ? this.api.beresultimport().getInfos(_.trim(_.get(singleDocument,"id","")), true, null, enckeys.join(',')).catch(e=>{console.log("ERROR with getInfos: ", e); return prom;}) : prom)
                  .then(beResultImportInfos => !beResultImportInfos ? prom : _.compact(_.map(beResultImportInfos, singleBeResultImportInfo => { return _.merge(singleBeResultImportInfo, {
                      codes: _.get(singleBeResultImportInfo,"codes[0]",{}),
                      lastName: _.map( _.trim(_.get(singleBeResultImportInfo, "lastName", "")).split(" "),i=> _.capitalize(i)).join(" "),
                      firstName: _.map( _.trim(_.get(singleBeResultImportInfo, "firstName", "")).split(" "),i=> _.capitalize(i)).join(" "),
                      dateOfBirthHr: (_.parseInt(_.trim(_.get(singleBeResultImportInfo,"dateOfBirth",""))) ? this.api.formatedMoment(_.parseInt(_.trim(_.get(singleBeResultImportInfo,"dateOfBirth","")))): ""),
                      complete: !!_.get(singleBeResultImportInfo,"complete",""),
                      demandDate: parseInt(_.get(singleBeResultImportInfo,"demandDate",0)),
                      demandDateHr: moment(_.get(singleBeResultImportInfo,"demandDate",undefined)).format("DD/MM/YYYY")
                  })})))
                  .then(documentsInfos => ({singleDocument,documentsInfos}))
                  .then(({singleDocument,documentsInfos})=>!!_.trim(_.get(singleDocument,"id","")) && _.trim(_.get(singleDocument,"attachmentId","")) ? this.api.document().getAttachment(_.trim(_.get(singleDocument,"id","")), _.trim(_.get(singleDocument,"attachmentId","")), enckeys.join(',')).then(decryptedContent=>({singleDocument,documentsInfos,decryptedContent})).catch(e=>{console.log("ERROR with getAttachment: ",e); return ({singleDocument,documentsInfos});}) : ({singleDocument,documentsInfos}))
                  .then(({singleDocument,documentsInfos,decryptedContent}) =>
                      this.api.document().getAttachmentUrl(_.trim(_.get(singleDocument, "id","")), _.trim(_.get(singleDocument, "attachmentId","")), enckeys)
                      .then(url => ({url,singleDocument,documentsInfos,decryptedContent}))
                  ).then(({url,singleDocument,documentsInfos,decryptedContent})=>{
                      const foundExtension = _.trim(_.get(singleDocument,"name","")).split(".").pop()
                      const fileExtension = _.trim(_.get( _.compact(_.map(this.api.document().utiExts, (v,k)=>_.trim(v).toLowerCase() ===_.trim(_.get(singleDocument,"mainUti","")).toLowerCase()?k:false)), "[0]", ( _.trim(_.get(singleDocument,"name","")).indexOf(".") > -1 && _.trim(foundExtension).length<5 && _.trim(foundExtension).length>2 ? foundExtension : "" ))).toLowerCase()
                      const attachmentSize = _.get((typeof decryptedContent === "string" ? this.api.crypto().utils.text2ua(decryptedContent) : decryptedContent),"byteLength",0)
                      const attachmentSizePow = attachmentSize > (1024**2) ? 2 : attachmentSize > 1024 ? 1 : 0
                      return !_.trim(decryptedContent) ? false :  _.merge(singleDocument,{
                          docInfo:documentsInfos||[],
                          attachmentInfos:{
                              filename: _.kebabCase(_.trim(_.get(singleDocument,"name","")).replace("."+foundExtension,"")) + "." + fileExtension,
                              fileExtension: fileExtension,
                              size: this.api._powRoundFloatByPrecision( attachmentSize / (1024**attachmentSizePow) ,2) + " " + _.trim(attachmentSizePow === 2 ? "Mb" : attachmentSizePow === 1 ? "Kb" : "Bytes"),
                              attachmentUrl: _.trim(url),
                              decryptedContent: decryptedContent,
                              mimeType: _.trim(this.api.document().mimeType(_.trim(_.get(singleDocument,"mainUti","")))) ? _.trim(this.api.document().mimeType(_.trim(_.get(singleDocument,"mainUti","")))) : "text/plain",
                              uniqueId: _.uniqueId(_.trim(_.get(singleDocument,"id","")) + "-"),
                              documentId: _.trim(_.get(singleDocument, "id",""))
                          }
                      })
                  })
              )
              .catch(e=>{console.log("ERROR with extractKeysFromDelegationsForHcpHierarchy: ", e); return singleDocument;})
          )))
          .then(documentsOfMessage => {
              let resolvedDocumentsOfMessage = !!_.size(documentsOfMessage) ? _.compact(_.orderBy(documentsOfMessage, d => _.trim(_.get(d,"documentLocation","annex")) === "body" ? "" : _.get(d,"id",_.uniqueId()))) : []
              this.set("documentsOfMessage", _.map(resolvedDocumentsOfMessage, rdom => {
                  const assignmentResolvedInformation = _.find(_.get(selectedMessage,"annexesInfos",[]), ai => { return _.trim(_.get(ai,"documentId","")) === _.trim(_.get(rdom,"id","")) && !!_.get(ai,"isAssigned","") })
                  return _.merge(rdom, {patientData:_.get(assignmentResolvedInformation,"patientData",{})})
              }))
          })
          .then(()=>{
              const backupOriginalMessageDocumentId = _.trim(_.get(this,"selectedMessage.metas.backupOriginalMessageDocumentId",""))
              return !_.trim(backupOriginalMessageDocumentId) ?
                  prom:
                  this.api.document().getDocument(backupOriginalMessageDocumentId)
                      .then(originalMessageDocumentObject => this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(_.get(this,"user.healthcarePartyId", null), _.trim(_.get(originalMessageDocumentObject,"id","")), _.size(_.get(originalMessageDocumentObject,"encryptionKeys",[])) ? _.get(originalMessageDocumentObject,"encryptionKeys",[]) : _.get(originalMessageDocumentObject,"delegations",[])).then(({extractedKeys: enckeys}) => [originalMessageDocumentObject,enckeys]))
                      .then(([originalMessageDocumentObject,enckeys]) => this.api.document().getAttachment(_.trim(_.get(originalMessageDocumentObject,"id","")), _.trim(_.get(originalMessageDocumentObject,"attachmentId","")), enckeys.join(',')))
                      .then(decryptedContent => console.log("ORIGINAL EHB MESSAGE", JSON.parse(this.api.crypto().utils.ua2text(decryptedContent))||{}) )
                      .catch(e=>{console.log("ERROR with get backupOriginalMessage: ", e); return prom;})
          })
          .catch(e=>console.log("ERROR with _loadMessageDetails: ", e))
          .finally(()=>{
              this.set("_linkedPatientsBasedOnMessageSsinAndAnnexes", _.uniqBy(_.compact(
                  _.compact(_.concat( [patientDetailsBasedOnSsin], _.flatMap(_.map(_.get(this,"documentsOfMessage",[]), singleDoc => _.map(_.get(singleDoc,"docInfo",[]), x=>x))))).map(pat => { return {
                      sex: _.trim(_.get(pat, "sex", "")).toUpperCase(),
                      lastName: _.map(_.trim(_.get(pat, "lastName", "")).split(" "), i => _.capitalize(i)).join(" "),
                      firstName: _.map(_.trim(_.get(pat, "firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                      ssinOrBirthdate: (
                          !!_.trim(_.get(pat, "ssin", "")) ? "(" + this.localize('ssinPatVerbose', 'Numéro de registre national', this.language) + ": " + this.api.formatSsinNumber(_.trim(_.get(pat, "ssin", ""))) + ")" :
                          !!_.trim(_.get(pat, "dateOfBirth", "")) ? "(" + this.localize('birthDate', 'Birthdate', this.language) + ": " + this.api.formatedMoment(_.parseInt(_.trim(_.get(pat, "dateOfBirth", "")))) + ")" :
                          ""
                      )
                  }})),"ssinOrBirthdate")
              )
              this.set("_messageAttachments", _.orderBy(_.compact(_.map(_.get(this,"documentsOfMessage",[]).filter(d=>_.trim(_.get(d,"documentLocation",""))==="annex"), singleDoc => _.get(singleDoc,"attachmentInfos",{}))), ['filename','size'],['asc','asc']))
              this._toggleProcessingPopup()

              console.log("selectedMessage", this.selectedMessage);
              console.log("documentsOfMessage", this.documentsOfMessage);

              return (["saveAssignment","deleteAssignment"].indexOf(_.trim(_.get(assignmentCallBack,"action","")))>-1) ? this._toggleAssignmentDialog({assignmentCallBack:assignmentCallBack}) : prom
          })

  }

  _toggleAssignmentDialog(e) {

      this.api.setPreventLogging()

      const assignmentCallBack = _.get(e,"assignmentCallBack",{})

      let prom = Promise.resolve();
      const promResolve = Promise.resolve();
      const documentId = !!_.size(assignmentCallBack) ? _.trim(_.get(assignmentCallBack,"documentId","")) : _.trim(_.get(e,"detail.documentId",""))
      const isOpened = !!_.get(this,"_assignmentDialogIsOpened",false)
      this.set("_assignmentCurrentDocumentId", documentId)

      if(!isOpened && !_.trim(documentId)) return prom;
      if(!!isOpened) { this.set("_assignmentDialogIsOpened", false); this.set("_assignmentDialogIsLoading", false); this.$["positiveFeedback"].classList.remove('showFeedbackMessage'); this.$["negativeFeedback"].classList.remove('showFeedbackMessage'); this.$['annexAssignmentDialog'].close(); return prom; }
      if(!isOpened && _.trim(documentId)) { this.set("_assignmentDialogIsOpened", true); this.set("_assignmentDialogIsLoading", true); this.$['annexAssignmentDialog'].open(); }

      const selectedMessage =  _.get(this,"selectedMessage",{})
      const currentDocument = _.find(_.get(this,"documentsOfMessage",[]), {id:documentId})
      const docInfosOfCurrentDocument = _.get(currentDocument, "docInfo",[])
      const patInfosOfSelectedDocument = _.filter(_.get(selectedMessage,"annexesInfos",[]), {documentId:documentId})
      const parentOrCurrentHcpId =_.trim(_.get(this,"parentHcp.id","")) ? _.trim(_.get(this,"parentHcp.id","")) : _.trim(_.get(this,"user.healthcarePartyId",""))

      let patientsToResolve = _.map(docInfosOfCurrentDocument, x => { return { lastName: _.get(x,"lastName",""), firstName: _.get(x,"firstName",""), dateOfBirth: _.get(x,"dateOfBirth",""), ssin: _.get(x,"ssin",""), } })
      patientsToResolve = _.compact(_.concat(patientsToResolve, _.map(patInfosOfSelectedDocument, x => { return { lastName: _.get(x,"patientData.lastName",""), firstName: _.get(x,"patientData.firstName",""), dateOfBirth: _.get(x,"patientData.dateOfBirth",""), ssin: _.get(x,"patientData.ssin",""), id: _.get(x,"patientData.id",""), } })))
      patientsToResolve = _.uniqBy(patientsToResolve, x => [ _.get(x,"id",""), _.get(x,"ssin",""), _.get(x,"dateOfBirth",""), _.get(x,"lastName",""),  _.get(x,"firstName","")].join() )

      // Reset search value & results
      this.set("searchedValue","")
      this.set("_manualSearchResultsForAssignments",[])

      if(!_.size(_.get(this,"_genders",[]))) this.set("_genders",[
          { value:"male", name: _.upperFirst(_.trim(this.localize("male", "Male", this.language)).toLowerCase()) },
          { value:"female", name: _.upperFirst(_.trim(this.localize("female", "Female", this.language)).toLowerCase()) },
          { value:"changed", name: _.upperFirst(_.trim(this.localize("changed", "Changed", this.language)).toLowerCase()) },
          { value:"indeterminate", name: _.upperFirst(_.trim(this.localize("indeterminate", "Indeterminate", this.language)).toLowerCase()) },
          { value:"unknown", name: _.upperFirst(_.trim(this.localize("unknown", "Unknown", this.language)).toLowerCase()) }
      ])

      _.map(patientsToResolve, singlePatientToResolve => {

          const filter = {
              '$type': 'UnionFilter',
              'healthcarePartyId': parentOrCurrentHcpId,
              'filters': [{
                  '$type': 'IntersectionFilter',
                  'healthcarePartyId': parentOrCurrentHcpId,
                  'filters': [
                      { '$type': 'PatientByHcPartyNameContainsFuzzyFilter', 'healthcarePartyId': parentOrCurrentHcpId, 'searchString': _.trim(_.get(singlePatientToResolve,"lastName","")) },
                      { '$type': 'PatientByHcPartyNameContainsFuzzyFilter', 'healthcarePartyId': parentOrCurrentHcpId, 'searchString': _.trim(_.get(singlePatientToResolve,"firstName","")) }
                  ]},
                  { '$type': 'PatientByHcPartyDateOfBirthFilter', 'healthcarePartyId': parentOrCurrentHcpId, 'dateOfBirth': parseInt(_.trim(_.get(singlePatientToResolve,"dateOfBirth","")))||0 }
              ]}

          prom = prom.then(promisesCarrier => !!_.trim(_.get(singlePatientToResolve,"id","")) ?
              this.api.patient().getPatientWithUser(_.get(this,"user",{}),_.trim(_.get(singlePatientToResolve,"id",""))).then(foundPatient=>_.concat(promisesCarrier, foundPatient)).catch(e=>{console.log("ERROR with getPatientWithUser: ", e); return promisesCarrier;}) :
              Promise.all([
                  !_.trim(_.get(singlePatientToResolve,"ssin","")) ? promResolve : this.api.patient().findByNameBirthSsinAutoWithUser(_.get(this,"user",{}), _.trim(_.get(this,"user.healthcarePartyId","")), _.trim(_.get(singlePatientToResolve,"ssin","")), null, null, 10).then(({rows})=>_.concat(promisesCarrier, rows)).catch(e=>{console.log("ERROR with findByNameBirthSsinAutoWithUser (by ssin): ", e); return promisesCarrier;}),
                  !( !!_.trim(_.get(singlePatientToResolve,"lastName","")) || !!_.trim(_.get(singlePatientToResolve,"firstName","")) || !!_.trim(_.get(singlePatientToResolve,"dateOfBirth","")) ) ? promResolve : this.api.patient().filterByWithUser(_.get(this,"user",{}), null, null, 20, 0, null, null, {filter: filter}).then(({rows}) => _.concat(promisesCarrier, this._filterBestMatchingPatients(rows,singlePatientToResolve))).catch(e=>{console.log("ERROR with fuzzySearchWithUser: ", e); return promisesCarrier;})
              ])
                  .then(promsAnswers=>_.flatMap(promsAnswers,pa=>_.compact(pa)))
          )
      })

      return prom
          .then(resolvedPatients =>  this.set("_resolvedPatientsForSuggestedAssignments", _.orderBy(_.uniqBy(_.compact(resolvedPatients), 'id').map(patientData =>{return{
              isAssigned: false,
              documentType: "labresult",
              documentId: documentId,
              patientData: {
                  id: _.trim(_.get(patientData,"id","")),
                  firstName: _.map(_.trim(_.get(patientData, "firstName", "")).split(" "),i=> _.capitalize(i)).join(" "),
                  lastName: _.map(_.trim(_.get(patientData, "lastName", "")).split(" "),i=> _.capitalize(i)).join(" "),
                  dateOfBirth: _.trim(_.get(patientData,"dateOfBirth","")),
                  dateOfBirthHr: (_.parseInt(_.trim(_.get(patientData,"dateOfBirth",""))) ? this.api.formatedMoment(_.parseInt(_.trim(_.get(patientData,"dateOfBirth","")))) : ""),
                  ssin: _.trim(_.get(patientData,"ssin","")),
                  sex: (_.trim(_.get(patientData,"gender","male")).toLowerCase()==="male" ? "M" : "F"),
                  picture: _.trim(_.get(patientData,"picture","")),
                  address: _.chain(_.get(patientData, "addresses", {})).filter({addressType:"home"}).head().value() ||
                      _.chain(_.get(patientData, "addresses", {})).filter({addressType:"work"}).head().value() ||
                      _.chain(_.get(patientData, "addresses", {})).head().value() ||
                      {},
                  lastModifiedHr: parseInt(_.get(patientData, "modified", undefined)) ? moment(_.get(patientData, "modified", undefined)).format("DD/MM/YYYY - HH:mm:ss") : "-"
              }
          }}), ['lastName','firstName','dateOfBirth','modified'], ['asc','asc','desc','desc'])))
          .then(() => !!_.size(_.get(this,"_transactionCodes",[])) ? false : this.api.getDocumentTypes(this.resources, this.language).then(documentTypes => this.set("_transactionCodes", documentTypes)))
          .then(()=>{
              const alreadyAssignedDocuments = _.compact(_.filter(patInfosOfSelectedDocument, {isAssigned:true}))
              return this.api.contact().getContactsWithUser(_.get(this,"user",{}),{ids:_.map(alreadyAssignedDocuments,x=>_.trim(_.get(x,"contactId","")))})
                  .then(foundContacts => _.map(alreadyAssignedDocuments, aad => {
                      const contactOfDocument = _.find(foundContacts, {id:_.trim(_.get(aad,"contactId",""))})
                      const contactCreatedOn = _.get(contactOfDocument, "created", null)
                      const transactionTag = _.find(_.get(contactOfDocument, "tags",[]), {type:"CD-TRANSACTION"})
                      return _.merge({}, aad, {
                          documentType: _.get(transactionTag, "code","labresult"),
                          documentTypeHr: _.trim(_.get(_.find(_.get(this,"_transactionCodes",[]), {code:_.get(transactionTag, "code","labresult")}), "name", this.localize("labresult", "Lab result", this.language))),
                          created: contactCreatedOn,
                          createdHr: moment(contactCreatedOn).format("DD/MM/YYYY - HH:mm:ss")
                      })
                  }))
                  .catch(e=>{console.log("ERROR with getContactsWithUser: ", e); return alreadyAssignedDocuments;})
          })
          .then(alreadyAssignedDocuments => this.set("_alreadyAssignedDocuments", alreadyAssignedDocuments))
          .then(()=> this.set("_resolvedPatientsForSuggestedAssignments", _.compact(_.map( _.get(this,"_resolvedPatientsForSuggestedAssignments",[]), rpfsa => !!_.size(_.filter(_.get(this,"_alreadyAssignedDocuments",[]), aad=>_.trim(_.get(aad,"patientId","")) === _.trim(_.get(rpfsa,"patientData.id","")) )) ? false : rpfsa ))))
          .then(() => this.api._getUserConfirmationDialogAcknowledgements(_.get(this,"user",{})))
          .then(userConfirmationDialogAcknowledgements => this.set("_confirmationDialogAcknowledgementsProperties", userConfirmationDialogAcknowledgements))
          .catch(e=>console.log("ERROR with _toggleAssignmentDialog: ", e))
          .finally(()=>{

              this.set("_totalAnnexesToAssignForCurrentDoc", parseInt(_.size(docInfosOfCurrentDocument)) ? parseInt(_.size(docInfosOfCurrentDocument)) : 1)
              this.set("_totalAnnexesAlreadyAssignedForCurrentDoc", parseInt(_.size(this._alreadyAssignedDocuments)))
              this.set("_totalRemainingAnnexesToAssignForCurrentDoc", parseInt(this._totalAnnexesToAssignForCurrentDoc) - parseInt(this._totalAnnexesAlreadyAssignedForCurrentDoc))

              // Force no suggestions anymore when everything got assigned
              if(!parseInt(this._totalRemainingAnnexesToAssignForCurrentDoc)) this.set("_resolvedPatientsForSuggestedAssignments",[])

              this.set("_assignmentActiveTab",
                  !parseInt(this._totalRemainingAnnexesToAssignForCurrentDoc) ? "existing" :
                  !!_.size(this._resolvedPatientsForSuggestedAssignments) ? "suggestion" :
                  "manual"
              )

              if(!!_.size(assignmentCallBack)) {

                  const callBackAction = _.trim(_.get(assignmentCallBack ,"action",""))
                  const totalAnnexes = parseInt(_.size(_.filter(_.get(this,"documentsOfMessage",[]),dom=>_.trim(_.get(dom,"documentLocation","body")) !== "body" )))
                  const totalAssignedAnnexes = parseInt(_.size(_.filter(_.get(selectedMessage,"annexesInfos",[]),ai=>!!_.get(ai,"isAssigned",false))))

                  if( totalAnnexes === totalAssignedAnnexes && callBackAction === "saveAssignment" ) !_.get(this,"_confirmationDialogAcknowledgementsProperties.gotMovedToAssignedMessagesDialog", false) && this.$['gotMovedToAssignedMessagesDialog'].open()
                  if( totalAnnexes - totalAssignedAnnexes === 1 && callBackAction === "deleteAssignment" ) !_.get(this,"_confirmationDialogAcknowledgementsProperties.gotRestoredToInboxDialog", false) && this.$['gotRestoredToInboxDialog'].open()

                  setTimeout(() => { this.$["positiveFeedback"].classList.add('showFeedbackMessage'); },100);
                  setTimeout(() => { this.$["positiveFeedback"].classList.remove('showFeedbackMessage'); },8000);

              }
              this.set("_assignmentDialogIsLoading", false)
              this.api.setPreventLogging(false)
              return prom

          })

  }

  _messageGotMovedToAssignedFolder() {

      return this.api._getUserConfirmationDialogAcknowledgements(_.get(this,"user",{}))
          .then(userConfirmationDialogAcknowledgements => this.set("_confirmationDialogAcknowledgementsProperties", userConfirmationDialogAcknowledgements))
          .then(() => !!_.get(this,"_confirmationDialogAcknowledgementsProperties.gotMovedToAssignedMessagesFromEhboxDialog", false) ? null : setTimeout(()=>{this.$['gotMovedToAssignedMessagesFromEhboxDialog'].open()},2000) )

  }

  _createNewPatAndSaveAssignment(e) {

      const prom = Promise.resolve()
      const documentId = _.trim(_.get(e,"documentId",""))
      const documentType = _.trim(_.get(this,"newPat.documentType","labresult"))
      const documentTypeLabel = _.get(_.find(this._transactionCodes, {code:documentType}), "name", "Analyse")

      // const fieldsToValidate = _.keys(this.newPat)
      // 20191210 - Murielle Mernier - Niss should not be validated anymore

      const fieldsToValidate = _.keys(this.newPat)
      const fieldsValidation = _.compact(_.map( fieldsToValidate, k => { const fieldToValidate = this.shadowRoot.querySelector('#newPat_' + k); return (fieldToValidate && typeof _.get(fieldToValidate, "validate", false) === "function" && fieldToValidate.validate()); }))

      if(!_.trim(documentId)) return;
      if(_.size(fieldsToValidate) !== _.size(fieldsValidation) || !_.trim(_.get(this,"newPat.gender","")) || !_.trim(!_.trim(_.get(this,"newPat.documentType","")))) return this.$['fieldsValidationDialog'].open()

      return this._getPatientDataBySsin(_.trim(_.get(this,"newPat.ssin","")))
          .then(foundPatient => !!_.size(foundPatient) ?
              this.$['alreadyExistingPatientDialog'].open() :
              prom.then(()=> this.api.patient().newInstance(this.user, {
                  lastName: _.trim(_.get(this,"newPat.lastName")),
                  firstName: _.trim(_.get(this,"newPat.firstName")),
                  active: true,
                  ssin: _.trim(_.get(this,"newPat.ssin")),
                  gender: _.trim(_.get(this,"newPat.gender")),
                  dateOfBirth: parseInt(_.padEnd(_.trim(_.get(this,"newPat.birthDate")).split("-").join(""),8,"0"))||null
              }))
              .then(patientInstance => this.api.patient().createPatientWithUser(this.user, patientInstance))
              .then(patientObject => {
                  const patientId = _.trim(_.get(patientObject,"id",""))
                  this.set("_assignmentCallBack", {
                      action: "saveAssignment",
                      activeTab: _.trim(_.get(this,"_assignmentActiveTab","")),
                      documentId: documentId,
                      patientId: patientId,
                      documentType: documentType
                  })
                  this.set("_assignmentDialogIsLoading", true)
                  return this._takeAction(this._assignmentCallBack.action,{documentId:documentId, patientId:patientId, documentType:documentType, documentTypeLabel:documentTypeLabel, dontCloseReadMessageComponent:true})
              })
          )

  }

  _doConfirmAction(e) {

      const confirmationAction = _.get(this,"_confirmationDataset.confirmationAction","")
      const confirmationParams = _.omit( _.get(this,"_confirmationDataset",{}), "confirmationAction" )||{}

      this._closeConfirmActionDialog()
      this.set("_confirmationDataset", {})

      return (
          _.trim(confirmationAction) === "_deleteAssignment" ? this._deleteAssignment(confirmationParams) :
          _.trim(confirmationAction) === "_saveAssignment" ? this._saveAssignment(confirmationParams) :
          _.trim(confirmationAction) === "_createNewPatAndSaveAssignment" ? this._createNewPatAndSaveAssignment(confirmationParams) :
          false
      )

  }

  _doUpdateUser(updatedUser) {

      this.set("user",updatedUser);

  }

  _userDialogAcknowledgementsPropertiesChanged(confirmationDialogAcknowledgementsProperties) {

      const propertyName = _.trim(_.get(_.trim(_.get(confirmationDialogAcknowledgementsProperties,"path",[])).split("."), "[1]",""))

      return !_.trim(propertyName) ? null : Promise.resolve()
          .then(() => this.api._setUserConfirmationDialogAcknowledgements(_.get(this,"user",{}), this._confirmationDialogAcknowledgementsProperties))
          .then(updatedUser => { this.set("user",updatedUser); this.dispatchEvent(new CustomEvent('user-got-updated', {composed: true, bubbles: true, detail: {updatedUser:updatedUser}})); })

  }

  _openConfirmActionDialog(e) {

      this.set("_confirmationDataset", _.get(_.filter(_.get(e,"path",[]), nodePath=> !!_.size(_.get(nodePath,"dataset",""))), "[0].dataset",{}))

      return this.api._getUserConfirmationDialogAcknowledgements(_.get(this,"user",{}))
          .then(userConfirmationDialogAcknowledgements => this.set("_confirmationDialogAcknowledgementsProperties", userConfirmationDialogAcknowledgements))
          .then(() => !!_.get(this,"_confirmationDialogAcknowledgementsProperties.confirmSaveDeleteAssignmentActionDialog", false) ? this._doConfirmAction() : this.$['confirmActionDialog'].open())

  }

  _printDocument(e) {
      const printDocumentComponent = this.shadowRoot.querySelector("#printDocument")
      return printDocumentComponent && typeof _.get(printDocumentComponent,"printDocument", false) === "function"  && printDocumentComponent.printDocument(_.get(e,"detail",{}))
  }
}

customElements.define(HtMsgDetail.is, HtMsgDetail);
