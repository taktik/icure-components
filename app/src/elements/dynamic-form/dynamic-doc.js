import '../pdf-element/pdf-element.js';
import '../ht-spinner/ht-spinner.js';
import './ht-services-list.js';
import '../../styles/buttons-style.js';
import '../../styles/icpc-styles.js';
import './dynamic-pills.js';

import XML from 'parse-xml/dist/parse-xml';
import mustache from "mustache/mustache.js";
import moment from 'moment/src/moment';
import base64js from 'base64-js';

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class DynamicDoc extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="buttons-style icpc-styles dialog-style">

            ht-spinner.center  {
                position: absolute;
                left: calc(50% - 14px);
                top: calc(50% - 14px);
                height: 42px;
                width: 42px;
            }

            paper-card.subform-card {
                min-height: 16px;
                padding: 0 0 8px 0;
                box-shadow: none;
                border-bottom: 1px solid lightgrey;
                margin:0;
                width:100%;
                background:transparent;
            }

            .pat-details-card > .card-content {
                padding: 16px 16px 32px !important;
            }

            .pat-details-card {
                margin: 0 32px 32px;
                padding:0 8px 8px;
                overflow: hidden;
                width: calc(100% - 64px);
            }

            .pat-details-card.fullWidth {
                margin: 0 0 32px 0;
                width: 100%;
            }

            .pat-details-card hr {
                border: 1px solid var(--app-background-color-darker)
            }

            .horizontal {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                flex-basis: 100%;
            }

            .edit-pat-details-btn{
                position:absolute;
                left:50%;
                transform: translate(-50%,0);
                bottom:-20px;
                background: var(--app-secondary-color);
                border-radius:50%;
                @apply --shadow-elevation-4dp;
            }

            .justified {
                justify-content: space-between;
            }

            span.title {
                color:var(--app-primary-color);
                border-top: 2px solid rgba(231,231,231,1);
                border-radius: 2px 2px 0 0;
                background:rgba(0,0,0,0.1);
                font-size:12px;
                margin:0 0 8px -8px;
                padding:2px 24px;
                display:inline-block;
                width:calc(100% - 32px);
                text-align:left;
                word-break: break-word;
                height: 20px;
                line-height: 20px;
            }

            pdf-element {
                width: 100%;
                margin: auto;
            }

            .img-container{
                width:100%;
                height:100%;
                display:flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
            }

            .img-container img{
                align-self: center;
                width: inherit;
            }

            .txt-container {
                font-family: "Lucida Console","Lucida Sans","monospace",sans-serif;
                font-size: small;
                width: 100%;
                margin: 0;
                height: auto;
                max-height: 160px;
                padding: 8px;
                box-shadow: none;
                overflow-x: auto;
                overflow-y: auto;
                border: 1px solid var(--app-background-color-dark);
                background: var(--app-dark-color-faded);
                box-sizing: border-box;
            }

            .txt-container.large {
                font-family: var(--paper-font-common-base_-_font-family);
                -webkit-font-smoothing: var(--paper-font-common-base_-_-webkit-font-smoothing);
                max-height: none;
                overflow-x: hidden;
                overflow-y: hidden;
                background: none;
                word-break:normal;
                white-space: pre-wrap;
                white-space: -moz-pre-wrap;
                white-space: -pre-wrap;
                white-space: -o-pre-wrap;
                word-wrap: break-word;
                border:0;
                /*padding:10px;*/
                font-size: 13px;
                line-height: 1.6em;
            }

            .bodyOfEmail {
                font-size:15px!important;
                padding-top:15px;
            }

            .pointers-line {
                display: flex;
                width: 100%;
                justify-content: space-between;
            }

            .hoverpointer {
                cursor: pointer;
                text-align: center;
                flex-grow: 1;
                margin: 8px 4px;
                border-radius: 4px;
                border: 1px solid var(--app-background-color-dark);
            }

            .resInfos {
                display: flex;
                flex-direction: column;
                background: var(--app-background-color-dark);
                border-radius: 4px;
                padding: 8px;
            }

            .resInfos h4 {
                margin: 0;
                text-align: center;
            }

            .resInfos .line {
                display: flex;
                flex-direction: row;
            }

            .resInfos .line .label {
                width: 96px;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: block;
                padding-top: 4px;
                overflow: hidden;
            }

            .resInfos .line span {
                box-sizing: border-box;
                padding: 4px;
                background: white;
            }

            .resInfos .indicator {
                font-size: .85em;
                text-align: right;
            }

            pre.result {
                border: 1px solid var(--app-background-color-dark);
                border-radius: 4px;
                overflow-y: auto;
                overflow-x: auto;
                word-break: break-word;
                margin: 8px 0;
                padding: 4px;
                max-height: 400px;
            }

            .assignToPat {
                margin: 0 0 8px 0;
                width: 100%;
                transition: .25s ease-in-out;
                background: var(--app-secondary-color);
                box-shadow: var(--app-shadow-elevation-1);
            }

            .assignToPat:hover {
                background: var(--app-secondary-color-dark);
            }

            .assign-ico {
                position: absolute;
                right: 8px;
                top: 4px;
                padding: 4px;
                cursor: pointer;
                height: 32px;
                width: 32px;
                box-sizing: border-box;
                background: var(--app-secondary-color);
                border-radius: 50%;
            }

            .actionIcons {
                min-width: 1px;
            }

            .form-title {
                color: var(--app-primary-color);
                border-top: 2px solid var(--app-background-color-dark);
                border-radius: 2px 2px 0 0;
                background: var(--app-background-color-dark);
                font-size: 12px;
                margin: 0 0 8px -8px;
                padding: 2px 4px 2px 20px;
                display: flex;
                flex-flow: row nowrap;
                width: calc(100% - 8px);
                text-align: left;
                justify-content: space-between;
                align-items: center;
            }

            .form-title >div {
                flex-grow: 0;
                min-width: 20px;
            }

            .form-comment {
                background: var(--app-background-color);
                font-size: 12px;
                display: flex;
                flex-flow: row nowrap;
                text-align: left;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                margin-top: 8px;
                line-height: normal;
                white-space: pre-line;
            }

            .fs10px { font-size:10px; }
            .fs11px { font-size:11px; }
            .fs12px { font-size:12px; }
            .fs13px { font-size:13px; }
            .fs14px { font-size:14px; }
            .fs15px { font-size:15px; }

            .m-r-1 { margin-right:1px; }
            .m-r-2 { margin-right:2px; }
            .m-r-3 { margin-right:3px; }
            .m-r-4 { margin-right:4px; }
            .m-r-5 { margin-right:5px; }
            .m-r-10 { margin-right:10px; }
            .m-r-15 { margin-right:15px; }
            .m-r-20 { margin-right:20px; }

            .m-l-1 { margin-left:1px; }
            .m-l-2 { margin-left:2px; }
            .m-l-3 { margin-left:3px; }
            .m-l-4 { margin-left:4px; }
            .m-l-5 { margin-left:5px; }
            .m-l-10 { margin-left:10px; }
            .m-l-15 { margin-left:15px; }
            .m-l-20 { margin-left:20px; }

            .m-t-1 { margin-top:1px; }
            .m-t-2 { margin-top:2px; }
            .m-t-3 { margin-top:3px; }
            .m-t-4 { margin-top:4px; }
            .m-t-5 { margin-top:5px; }
            .m-t-10 { margin-top:10px; }
            .m-t-15 { margin-top:15px; }
            .m-t-20 { margin-top:20px; }
            .m-t-50 { margin-top:50px; }

            .m-t-minus-1 { margin-top:-1px; }
            .m-t-minus-2 { margin-top:-2px; }
            .m-t-minus-3 { margin-top:-3px; }
            .m-t-minus-4 { margin-top:-4px; }
            .m-t-minus-5 { margin-top:-5px; }

            .m-b-1 { margin-bottom:1px; }
            .m-b-2 { margin-bottom:2px; }
            .m-b-3 { margin-bottom:3px; }
            .m-b-4 { margin-bottom:4px; }
            .m-b-5 { margin-bottom:5px; }

            .w-20 { width:20px }
            .h-20 { height:20px }

            .darkRed { color:#a00000!important; }
            .darkGreen { color:#41671e!important; }
            .darkBlue { color:var(--dark-primary-color)!important; }

            .bold { font-weight:700; }
            .regular { font-weight:400; }
            .italic { font-style:italic; }

            .fs8em { font-size:.8em; }
            .fs9em { font-size:.9em; }
            .fs10em { font-size:1em; }
            .fs11em { font-size:1.1em; }
            .fs12em { font-size:1.2em; }
            .fs13em { font-size:1.3em; }

            .displayBlock { display: block; }
            .displayInline { display: inline; }
            .displayInlineBlock { display: inline-block; }

            .color-app-primary { color:var(--app-primary-color) }
            .color-app-secondary { color:var(--app-secondary-color) }
            .bg-app-primary { background-color:var(--app-primary-color) }
            .bg-app-secondary { background-color:var(--app-secondary-color) }

            .spinnerContainer {
                max-width:200px;
                margin:0 auto;
            }

            .darkBlue {
                color:var(--dark-primary-color)!important;
            }

            .darkPink {
                color:#A02A7F!important;
            }

            .darkGreen {
                color:#41671e!important;
            }

            .darkerGreen {
                color:#006c03!important;
            }

            .darkerRed {
                color:#840000!important;
            }

            .darkRed {
                color:#a00000!important;
            }

            .w20 {
                width:20px;
            }

            .h20 {
                height:20px;
            }

            .patientInfos {
                font-size:13px;
                position: relative;
            }

            .patientPicture {
                float: left;
                margin: 0 15px 0 0;
                text-align: left;
                height:120px;
                overflow: hidden;
            }

            .patientPicture img {
                height: 120px;
                width: auto;
                border:1px solid #bbb
            }

            .flTopRight {
                position:absolute;
                right:0px;
                top:0px;
                text-align: right;
            }

            .bold {
                font-weight: 700;
            }

            .normal {
                font-weight: 400;
            }

            .resultDate {}

            .colour-code {
                font-size: 12px;
                white-space: nowrap;
            }

            .colour-code span {
                content: '';
                display: inline-block;
                height: 6px;
                width: 6px;
                border-radius: 3px;
                margin-right: 3px;
                margin-bottom: 1px;
            }

            paper-menu-button {
                padding:0;
            }

            paper-menu-button paper-listbox {
                padding:0!important;
            }

            paper-menu-button paper-listbox paper-item {
                padding:0 8px!important;
                font-size: var(--font-size-normal);
            }

        </style>



        <template is="dom-if" if="[[!isLabOrProtocol]]">

            <paper-card class\$="pat-details-card [[_fullWidth(fullwidth)]]">

                <template is="dom-if" if="[[!_unknownMimeType(document.mainUti, document.otherUtis.*, dataUrl, data)]]">

                    <template is="dom-if" if="[[!documentId]]"><template is="dom-if" if="[[isLoading]]"><ht-spinner active=""></ht-spinner></template></template>

                    <template is="dom-if" if="[[_imageMimeType(document.mainUti, document.otherUtis.*, dataUrl, data)]]">
                        <div class="form-title">
                            [[_title(document.name, title)]]
                            <div>

                                <template is="dom-if" if="[[allowEsLink]]"><dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*)]]" on-unlink-to-health-element="_unlinkDoc"></dynamic-pills></template>

                                <template is="dom-if" if="[[downloadable]]">
                                    <paper-icon-button icon="file-download" on-tap="_downloadAnnex" dataurl\$="[[item.dataUrl]]" class="button--icon-btn" id="downloadFile-1"></paper-icon-button>
                                    <paper-tooltip for="downloadFile-1" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                                </template>
                                <template is="dom-if" if="[[printable]]">
                                    <paper-icon-button icon="print" on-tap="_printDocument" data-contact-id\$="[[contactId]]" data-document-id\$="[[_getId(document)]]" class="button--icon-btn" id="printDocument"></paper-icon-button>
                                    <paper-tooltip for="printDocument" position="left">[[localize('pri','Print',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[!_isEqual(document.documentLocation,'body')]]">
                                    <template is="dom-if" if="[[!isPatDetail]]">
                                        <template is="dom-if" if="[[!forceNoAssignation]]">
                                            <paper-icon-button on-tap="_triggerOpenAssignmentDialog" icon="icons:assignment-ind" document-id\$="[[item.id]]" class="button--icon-btn" id="assign-ico-lab"></paper-icon-button>
                                            <paper-tooltip for="assign-ico-lab" position="left">[[localize('assign_to_pat','Assign to a patient',language)]]</paper-tooltip>
                                        </template>
                                    </template>
                                </template>

                                <template is="dom-if" if="[[hubImportable]]">
                                    <paper-icon-button icon="icons:cloud-download" on-tap="_importDocumentFromHub" data-document\$="[[data]]" data-transaction\$="[[transactionInfo]]" class="button--icon-btn" id="downloadFileOnHub"></paper-icon-button>
                                    <paper-tooltip for="downloadFileOnHub" position="left">[[localize('hub-down-fil-pat','Download file into patient folder',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[hubuploadable]]">
                                    <paper-icon-button icon="icons:cloud-upload" on-tap="_uploadOnHubs" data-document-id\$="[[document.id]]" class="button--icon-btn" id="uploadFileOnHub"></paper-icon-button>
                                    <paper-tooltip for="uploadFileOnHub" position="left">[[localize('hub-upl-fil','Upload file on hubs',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[forwardable]]">
                                    <paper-icon-button icon="arrow-forward" on-tap="_forwardDocument" data-document-id\$="[[document.id]]" class="button--icon-btn" id="forwardDocument"></paper-icon-button>
                                    <paper-tooltip for="forwardDocument" position="left">[[localize('forwardDocumentToColleague','Forward document to a colleague',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowEsLink]]">
                                    <paper-tooltip position="left" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
                                    <paper-menu-button class="form-title-bar-btn" horizontal-align="right" dynamic-align="true" vertical-offset="30">
                                        <paper-icon-button id="linkhe" class="button--icon-btn" icon="icons:link" slot="dropdown-trigger"></paper-icon-button>
                                        <paper-listbox slot="dropdown-content">
                                            <template is="dom-repeat" items="[[linkableHealthElements]]" as="he">
                                                <template is="dom-if" if="[[he.id]]"><paper-item id="[[he.id]]" class\$="link [[_isExcluded(he)]]" on-tap="_linkDoc"><label class\$="colour-code [[he.colour]]"><span></span></label>[[he.descr]]</paper-item></template>
                                                <!--<template is="dom-if" if="[[!he.id]]"><paper-item id="[[he.idService]]" class\$="link [[he.colour]]" on-tap="_linkDoc"><label class="colour-code"><span></span></label>[[he.descr]]</paper-item></template>-->
                                            </template>
                                        </paper-listbox>
                                    </paper-menu-button>
                                </template>

                                <template is="dom-if" if="[[allowEditLabelAndTransaction]]">
                                    <paper-icon-button icon="create" on-tap="_editLabelAndTransaction" class="button--icon-btn" id="editLabelAndTransaction"></paper-icon-button>
                                    <paper-tooltip for="editLabelAndTransaction" position="left">[[localize('editLabelAndTransaction','Edit label and type',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowDeletion]]">
                                    <paper-icon-button icon="delete" on-tap="_deleteService" class="button--icon-btn" id="deleteService"></paper-icon-button>
                                    <paper-tooltip for="deleteService" position="left">[[localize('del','Delete',language)]]</paper-tooltip>
                                </template>

                            </div>
                        </div>
                        <template is="dom-if" if="[[_size(patientData)]]">
                            <div class="resInfos">
                                <div class="patientInfos">
                                    <div class="patientPicture"><img src\$="[[_renderPatientPicture(patientData)]]"></div>
                                    <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(patientData.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[patientData.lastName]] [[patientData.firstName]]</b></div>
                                    <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(patientData.ssin)]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[patientData.dateOfBirthHr]]</div>
                                    <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[patientData.address.street]] [[patientData.address.houseNumber]] [[patientData.address.postboxNumber]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[patientData.address.postalCode]] [[patientData.address.city]]</div>
                                    <div class="flTopRight">
                                        <iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2 darkerGreen"></iron-icon> <span class="bold darkerGreen">[[localize('documentAssigned','Document assigned',language)]]</span>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template is="dom-if" if="[[isLoading]]"><ht-spinner active=""></ht-spinner></template>
                        <div class="img-container">
                            <img src\$="[[_selectImageData(dataUrl, data)]]">
                        </div>
                        <template is="dom-if" if="[[hasComment]]">
                            <div class="form-comment">
                                [[comment]]
                            </div>
                        </template>

                    </template>

                    <template is="dom-if" if="[[_pdfMimeType(document.mainUti, document.otherUtis.*, dataUrl, data)]]">

                        <div class="form-title">
                            <template is="dom-if" if="[[showExtendedTitle]]">
                                [[_extendedTitle(document.name, document.created, document.modified, title)]]
                            </template>
                            <template is="dom-if" if="[[!showExtendedTitle]]">
                                [[_title(document.name, title)]]
                            </template>
                            <div>

                                <template is="dom-if" if="[[allowEsLink]]"><dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*)]]" on-unlink-to-health-element="_unlinkDoc"></dynamic-pills></template>

                                <template is="dom-if" if="[[downloadable]]">
                                    <paper-icon-button icon="file-download" on-tap="_downloadAnnex" dataurl\$="[[item.dataUrl]]" class="button--icon-btn" id="downloadFile-2"></paper-icon-button>
                                    <paper-tooltip for="downloadFile-2" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[!isPatDetail]]">
                                    <template is="dom-if" if="[[!forceNoAssignation]]">
                                        <paper-icon-button icon="icons:assignment-ind" on-tap="_triggerOpenAssignmentDialog" document-id\$="[[item.id]]" class="button--icon-btn" id="assign-ico-lab-3"></paper-icon-button>
                                        <paper-tooltip for="assign-ico-lab-3" position="left">[[localize('assign_to_pat','Assign to a patient',language)]]</paper-tooltip>
                                    </template>
                                </template>

                                <template is="dom-if" if="[[hubImportable]]">
                                    <paper-icon-button icon="icons:cloud-download" on-tap="_importDocumentFromHub" data-document\$="[[data]]" data-transaction\$="[[transactionInfo]]" class="button--icon-btn" id="downloadFileOnHub"></paper-icon-button>
                                    <paper-tooltip for="downloadFileOnHub" position="left">[[localize('hub-down-fil-pat','Download file into patient folder',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[hubuploadable]]">
                                    <paper-icon-button icon="icons:cloud-upload" on-tap="_uploadOnHubs" data-document-id\$="[[document.id]]" class="button--icon-btn" id="uploadFileOnHub"></paper-icon-button>
                                    <paper-tooltip for="uploadFileOnHub" position="left">[[localize('hub-upl-fil','Upload file on hubs',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[forwardable]]">
                                    <paper-icon-button icon="arrow-forward" on-tap="_forwardDocument" data-document-id\$="[[document.id]]" class="button--icon-btn" id="forwardDocument"></paper-icon-button>
                                    <paper-tooltip for="forwardDocument" position="left">[[localize('forwardDocumentToColleague','Forward document to a colleague',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowEsLink]]">
                                    <paper-tooltip position="left" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
                                    <paper-menu-button class="form-title-bar-btn" horizontal-align="right" dynamic-align="true" vertical-offset="30">
                                        <paper-icon-button id="linkhe" class="button--icon-btn" icon="icons:link" slot="dropdown-trigger"></paper-icon-button>
                                        <paper-listbox slot="dropdown-content">
                                            <template is="dom-repeat" items="[[linkableHealthElements]]" as="he">
                                                <template is="dom-if" if="[[he.id]]"><paper-item id="[[he.id]]" class\$="link [[_isExcluded(he)]]" on-tap="_linkDoc"><label class\$="colour-code [[he.colour]]"><span></span></label>[[he.descr]]</paper-item></template>
                                                <!--<template is="dom-if" if="[[!he.id]]"><paper-item id="[[he.idService]]" class\$="link [[he.colour]]" on-tap="_linkDoc"><label class="colour-code"><span></span></label>[[he.descr]]</paper-item></template>-->
                                            </template>
                                        </paper-listbox>
                                    </paper-menu-button>
                                </template>

                                <template is="dom-if" if="[[allowEditLabelAndTransaction]]">
                                    <paper-icon-button icon="create" on-tap="_editLabelAndTransaction" class="button--icon-btn" id="editLabelAndTransaction"></paper-icon-button>
                                    <paper-tooltip for="editLabelAndTransaction" position="left">[[localize('editLabelAndTransaction','Edit label and type',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowDeletion]]">
                                    <paper-icon-button icon="delete" on-tap="_deleteService" class="button--icon-btn" id="deleteService"></paper-icon-button>
                                    <paper-tooltip for="deleteService" position="left">[[localize('del','Delete',language)]]</paper-tooltip>
                                </template>

                            </div>
                        </div>

                        <template is="dom-if" if="[[_size(patientData)]]">
                            <div class="resInfos">
                                <div class="patientInfos">
                                    <div class="patientPicture"><img src\$="[[_renderPatientPicture(patientData)]]"></div>
                                    <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(patientData.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[patientData.lastName]] [[patientData.firstName]]</b></div>
                                    <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(patientData.ssin)]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[patientData.dateOfBirthHr]]</div>
                                    <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[patientData.address.street]] [[patientData.address.houseNumber]] [[patientData.address.postboxNumber]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[patientData.address.postalCode]] [[patientData.address.city]]</div>
                                    <div class="flTopRight">
                                        <iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2 darkerGreen"></iron-icon> <span class="bold darkerGreen">[[localize('documentAssigned','Document assigned',language)]]</span>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template is="dom-if" if="[[isLoading]]"><ht-spinner active=""></ht-spinner></template>
                        <pdf-element src="[[_selectData(dataUrl, data)]]" elevation="5" downloadable="" fit-width="" fit-height="" enable-text-selection=""></pdf-element>

                        <template is="dom-if" if="[[hasComment]]">
                            <div class="form-comment">
                                [[comment]]
                            </div>
                        </template>

                    </template>

                    <template is="dom-if" if="[[_xmlMimeType(document.mainUti, document.otherUtis.*, dataUrl, data)]]">
                        <div class="form-title">
                            [[_title(document.name, title)]]
                            <div>

                                <template is="dom-if" if="[[allowEsLink]]"><dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*)]]" on-unlink-to-health-element="_unlinkDoc"></dynamic-pills></template>

                                <template is="dom-if" if="[[downloadable]]">
                                    <paper-icon-button icon="file-download" on-tap="_downloadAnnex" dataurl\$="[[item.dataUrl]]" class="button--icon-btn" id="downloadFile-3"></paper-icon-button>
                                    <paper-tooltip for="downloadFile-3" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[!isPatDetail]]">
                                    <template is="dom-if" if="[[!forceNoAssignation]]">
                                        <paper-icon-button icon="icons:assignment-ind" on-tap="_triggerOpenAssignmentDialog" document-id\$="[[item.id]]" class="actionIcons form-title-bar-btn button--icon-btn" id="assign-ico-lab"></paper-icon-button>
                                        <paper-tooltip for="assign-ico-lab" position="left">[[localize('assign_to_pat','Assign to a patient',language)]]</paper-tooltip>
                                    </template>
                                </template>

                                <template is="dom-if" if="[[hubImportable]]">
                                    <paper-icon-button icon="icons:cloud-download" on-tap="_importDocumentFromHub" data-document\$="[[data]]" data-transaction\$="[[transactionInfo]]" class="button--icon-btn" id="downloadFileOnHub"></paper-icon-button>
                                    <paper-tooltip for="downloadFileOnHub" position="left">[[localize('hub-down-fil-pat','Download file into patient folder',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[hubuploadable]]">
                                    <paper-icon-button icon="icons:cloud-upload" on-tap="_uploadOnHubs" data-document-id\$="[[document.id]]" class="button--icon-btn" id="uploadFileOnHub"></paper-icon-button>
                                    <paper-tooltip for="uploadFileOnHub" position="left">[[localize('hub-upl-fil','Upload file on hubs',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[forwardable]]">
                                    <paper-icon-button icon="arrow-forward" on-tap="_forwardDocument" data-document-id\$="[[document.id]]" class="button--icon-btn" id="forwardDocument"></paper-icon-button>
                                    <paper-tooltip for="forwardDocument" position="left">[[localize('forwardDocumentToColleague','Forward document to a colleague',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowEsLink]]">
                                    <paper-tooltip position="left" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
                                    <paper-menu-button class="form-title-bar-btn" horizontal-align="right" dynamic-align="true" vertical-offset="30">
                                        <paper-icon-button id="linkhe" class="button--icon-btn" icon="icons:link" slot="dropdown-trigger"></paper-icon-button>
                                        <paper-listbox slot="dropdown-content">
                                            <template is="dom-repeat" items="[[linkableHealthElements]]" as="he">
                                                <template is="dom-if" if="[[he.id]]"><paper-item id="[[he.id]]" class\$="link [[_isExcluded(he)]]" on-tap="_linkDoc"><label class\$="colour-code [[he.colour]]"><span></span></label>[[he.descr]]</paper-item></template>
                                                <template is="dom-if" if="[[!he.id]]"><paper-item id="[[he.idService]]" class\$="link [[he.colour]]" on-tap="_linkDoc"><label class="colour-code"><span></span></label>[[he.descr]]</paper-item></template>
                                            </template>
                                        </paper-listbox>
                                    </paper-menu-button>
                                </template>

                                <template is="dom-if" if="[[allowEditLabelAndTransaction]]">
                                    <paper-icon-button icon="create" on-tap="_editLabelAndTransaction" class="button--icon-btn" id="editLabelAndTransaction"></paper-icon-button>
                                    <paper-tooltip for="editLabelAndTransaction" position="left">[[localize('editLabelAndTransaction','Edit label and type',language)]]</paper-tooltip>
                                </template>

                                <template is="dom-if" if="[[allowDeletion]]">
                                    <paper-icon-button icon="delete" on-tap="_deleteService" class="button--icon-btn" id="deleteService"></paper-icon-button>
                                    <paper-tooltip for="deleteService" position="left">[[localize('del','Delete',language)]]</paper-tooltip>
                                </template>

                            </div>
                        </div>

                        <template is="dom-if" if="[[_size(patientData)]]">
                            <div class="resInfos">
                                <div class="patientInfos">
                                    <div class="patientPicture"><img src\$="[[_renderPatientPicture(patientData)]]"></div>
                                    <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(patientData.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[patientData.lastName]] [[patientData.firstName]]</b></div>
                                    <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(patientData.ssin)]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[patientData.dateOfBirthHr]]</div>
                                    <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[patientData.address.street]] [[patientData.address.houseNumber]] [[patientData.address.postboxNumber]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[patientData.address.postalCode]] [[patientData.address.city]]</div>
                                    <div class="flTopRight">
                                        <iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2 darkerGreen"></iron-icon> <span class="bold darkerGreen">[[localize('documentAssigned','Document assigned',language)]]</span>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <div class="img-container" style="text-transform:uppercase">
                            [[localize('noPreviewDownload','No preview available, please download the file',language)]]
                            <template is="dom-if" if="[[downloadable]]">
                                <paper-icon-button icon="file-download" on-tap="_downloadAnnex" style="margin-left:10px" dataurl\$="[[item.dataUrl]]" class="button--icon-btn" id="downloadFile-4"></paper-icon-button>
                                <paper-tooltip for="downloadFile-4" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                            </template>
                        </div>

                    </template>

                </template>

                <template is="dom-if" if="[[_pdfRenderableMimeType(document.mainUti, document.otherUtis.*, null, data)]]">
                    <div class="form-title">
                        [[_title(document.name, title)]]
                        <div>

                            <template is="dom-if" if="[[allowEsLink]]"><dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*)]]" on-unlink-to-health-element="_unlinkDoc"></dynamic-pills></template>

                            <template is="dom-if" if="[[downloadable]]">
                                <paper-icon-button icon="file-download" on-tap="_downloadAnnex" dataurl\$="[[item.dataUrl]]" class="button--icon-btn" id="downloadFile-4"></paper-icon-button>
                                <paper-tooltip for="downloadFile-4" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                            </template>

                            <template is="dom-if" if="[[!_isEqual(document.documentLocation,'body')]]">
                                <template is="dom-if" if="[[!isPatDetail]]">
                                    <template is="dom-if" if="[[!forceNoAssignation]]">
                                        <paper-icon-button icon="icons:assignment-ind" on-tap="_triggerOpenAssignmentDialog" document-id\$="[[item.id]]" class="button--icon-btn" id="assign-ico-lab"></paper-icon-button>
                                        <paper-tooltip for="assign-ico-lab" position="left">[[localize('assign_to_pat','Assign to a patient',language)]]</paper-tooltip>
                                    </template>
                                </template>
                            </template>

                            <template is="dom-if" if="[[allowEsLink]]">
                                <paper-tooltip position="left" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
                                <paper-menu-button class="form-title-bar-btn" horizontal-align="right" dynamic-align="true" vertical-offset="30">
                                    <paper-icon-button id="linkhe" class="button--icon-btn" icon="icons:link" slot="dropdown-trigger"></paper-icon-button>
                                    <paper-listbox slot="dropdown-content">
                                        <template is="dom-repeat" items="[[linkableHealthElements]]" as="he">
                                            <template is="dom-if" if="[[he.id]]"><paper-item id="[[he.id]]" class\$="link [[_isExcluded(he)]]" on-tap="_linkDoc"><label class\$="colour-code [[he.colour]]"><span></span></label>[[he.descr]]</paper-item></template>
                                            <!--<template is="dom-if" if="[[!he.id]]"><paper-item id="[[he.idService]]" class\$="link [[he.colour]]" on-tap="_linkDoc"><label class="colour-code"><span></span></label>[[he.descr]]</paper-item></template>-->
                                        </template>
                                    </paper-listbox>
                                </paper-menu-button>
                            </template>

                            <template is="dom-if" if="[[allowEditLabelAndTransaction]]">
                                <paper-icon-button icon="create" on-tap="_editLabelAndTransaction" class="button--icon-btn" id="editLabelAndTransaction"></paper-icon-button>
                                <paper-tooltip for="editLabelAndTransaction" position="left">[[localize('editLabelAndTransaction','Edit label and type',language)]]</paper-tooltip>
                            </template>

                            <template is="dom-if" if="[[allowDeletion]]">
                                <paper-icon-button icon="delete" on-tap="_deleteService" class="button--icon-btn" id="deleteService"></paper-icon-button>
                                <paper-tooltip for="deleteService" position="left">[[localize('del','Delete',language)]]</paper-tooltip>
                            </template>

                        </div>
                    </div>

                    <template is="dom-if" if="[[_size(patientData)]]">
                        <div class="resInfos">
                            <div class="patientInfos">
                                <div class="patientPicture"><img src\$="[[_renderPatientPicture(patientData)]]"></div>
                                <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(patientData.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[patientData.lastName]] [[patientData.firstName]]</b></div>
                                <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(patientData.ssin)]]</div>
                                <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[patientData.dateOfBirthHr]]</div>
                                <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[patientData.address.street]] [[patientData.address.houseNumber]] [[patientData.address.postboxNumber]]</div>
                                <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[patientData.address.postalCode]] [[patientData.address.city]]</div>
                                <div class="flTopRight">
                                    <iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2 darkerGreen"></iron-icon> <span class="bold darkerGreen">[[localize('documentAssigned','Document assigned',language)]]</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template is="dom-if" if="[[isLoading]]"><ht-spinner active=""></ht-spinner></template>
                    <pdf-element src="[[pdfData]]" elevation="5" downloadable="" fit-width="" fit-height="" enable-text-selection=""></pdf-element>
                    <template is="dom-if" if="[[hasComment]]">
                        <div class="form-comment">
                            [[comment]]
                        </div>
                    </template>


                </template>

                <template is="dom-if" if="[[_urlMimeType(document.mainUti, document.otherUtis.*, null, data)]]">
                    <span class="title">URL [[_title(document.name, title)]]</span>

                    <template is="dom-if" if="[[_size(patientData)]]">
                        <div class="resInfos">
                            <div class="patientInfos">
                                <div class="patientPicture"><img src\$="[[_renderPatientPicture(patientData)]]"></div>
                                <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(patientData.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[patientData.lastName]] [[patientData.firstName]]</b></div>
                                <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(patientData.ssin)]]</div>
                                <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[patientData.dateOfBirthHr]]</div>
                                <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[patientData.address.street]] [[patientData.address.houseNumber]] [[patientData.address.postboxNumber]]</div>
                                <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[patientData.address.postalCode]] [[patientData.address.city]]</div>
                                <div class="flTopRight">
                                    <iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2 darkerGreen"></iron-icon> <span class="bold darkerGreen">[[localize('documentAssigned','Document assigned',language)]]</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template is="dom-if" if="[[isLoading]]"><ht-spinner active=""></ht-spinner></template>
                    <p><a href="[[data.url]]" target="_blank">External link</a></p>
                </template>

                <template is="dom-if" if="[[_plainMimeType(document.mainUti, document.otherUtis.*, null, data)]]">
                    <template is="dom-if" if="[[attachmentContent.length]]">

                        <template is="dom-if" if="[[!isBodyTextOfEmail]]">
                            <div class="form-title">
                                [[_title(document.name, title)]]
                                <div>

                                    <template is="dom-if" if="[[allowEsLink]]"><dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*)]]" on-unlink-to-health-element="_unlinkDoc"></dynamic-pills></template>

                                    <template is="dom-if" if="[[downloadable]]">
                                        <paper-icon-button icon="file-download" on-tap="_downloadAnnex" dataurl\$="[[item.dataUrl]]" class="button--icon-btn" id="downloadFile-5"></paper-icon-button>
                                        <paper-tooltip for="downloadFile-5" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                                    </template>

                                    <template is="dom-if" if="[[printable]]">
                                        <paper-icon-button icon="print" on-tap="_printDocument" data-contact-id\$="[[contactId]]" data-document-id\$="[[_getId(document)]]" class="button--icon-btn" id="printDocument"></paper-icon-button>
                                        <paper-tooltip for="printFile" position="left">[[localize('print','Print',language)]]</paper-tooltip>
                                    </template>

                                    <template is="dom-if" if="[[forwardable]]">
                                        <paper-icon-button on-tap="_forwardDocument" data-document-id\$="[[document.id]]" class="button--icon-btn" id="forwardDocument" icon="forward"></paper-icon-button>
                                        <paper-tooltip for="forwardDocument" position="left">[[localize('forwardDocumentToColleague','Forward document to a colleague',language)]]</paper-tooltip>
                                    </template>

                                    <template is="dom-if" if="[[!isPatDetail]]">
                                        <template is="dom-if" if="[[!forceNoAssignation]]">
                                            <paper-icon-button icon="icons:assignment-ind" on-tap="_triggerOpenAssignmentDialog" document-id\$="[[item.id]]" class="button--icon-btn" id="assign-ico-lab"></paper-icon-button>
                                            <paper-tooltip for="assign-ico-lab" position="left">[[localize('assign_to_pat','Assign to a patient',language)]]</paper-tooltip>
                                        </template>
                                    </template>

                                    <template is="dom-if" if="[[allowEsLink]]">
                                    <paper-tooltip position="left" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
                                    <paper-menu-button class="form-title-bar-btn" horizontal-align="right" dynamic-align="true" vertical-offset="30">
                                        <paper-icon-button id="linkhe" class="button--icon-btn" icon="icons:link" slot="dropdown-trigger"></paper-icon-button>
                                        <paper-listbox slot="dropdown-content">
                                            <template is="dom-repeat" items="[[linkableHealthElements]]" as="he">
                                                <template is="dom-if" if="[[he.id]]"><paper-item id="[[he.id]]" class\$="link [[_isExcluded(he)]]" on-tap="_linkDoc"><label class\$="colour-code [[he.colour]]"><span></span></label>[[he.descr]]</paper-item></template>
                                                <!--<template is="dom-if" if="[[!he.id]]"><paper-item id="[[he.idService]]" class\$="link [[he.colour]]" on-tap="_linkDoc"><label class="colour-code"><span></span></label>[[he.descr]]</paper-item></template>-->
                                            </template>
                                        </paper-listbox>
                                    </paper-menu-button>
                                </template>

                                    <template is="dom-if" if="[[allowEditLabelAndTransaction]]">
                                        <paper-icon-button icon="create" on-tap="_editLabelAndTransaction" class="button--icon-btn" id="editLabelAndTransaction"></paper-icon-button>
                                        <paper-tooltip for="editLabelAndTransaction" position="left">[[localize('editLabelAndTransaction','Edit label and type',language)]]</paper-tooltip>
                                    </template>

                                    <template is="dom-if" if="[[allowDeletion]]">
                                        <paper-icon-button icon="delete" on-tap="_deleteService" class="button--icon-btn" id="deleteService"></paper-icon-button>
                                        <paper-tooltip for="deleteService" position="left">[[localize('del','Delete',language)]]</paper-tooltip>
                                    </template>

                                </div>
                            </div>
                            <template is="dom-if" if="[[_size(patientData)]]">
                                <div class="resInfos">
                                    <div class="patientInfos">
                                        <div class="patientPicture"><img src\$="[[_renderPatientPicture(patientData)]]"></div>
                                        <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(patientData.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[patientData.lastName]] [[patientData.firstName]]</b></div>
                                        <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(patientData.ssin)]]</div>
                                        <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[patientData.dateOfBirthHr]]</div>
                                        <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[patientData.address.street]] [[patientData.address.houseNumber]] [[patientData.address.postboxNumber]]</div>
                                        <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[patientData.address.postalCode]] [[patientData.address.city]]</div>
                                        <div class="flTopRight">
                                            <iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2 darkerGreen"></iron-icon> <span class="bold darkerGreen">[[localize('documentAssigned','Document assigned',language)]]</span>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template is="dom-if" if="[[isLoading]]"><ht-spinner active=""></ht-spinner></template>
                            <template is="dom-if" if="[[preview]]"><pre class="txt-container large">[[attachmentContent]]</pre></template>

                        </template>

                        <template is="dom-if" if="[[isBodyTextOfEmail]]"><pre class="txt-container large bodyOfEmail">[[attachmentContent]]</pre></template>

                    </template>

                </template>

                <template is="dom-if" if="[[_unknownMimeType(document.mainUti, document.otherUtis.*, dataUrl, data)]]">
                    <div class="form-title">
                        [[_title(document.name, title)]]
                        <div>

                            <template is="dom-if" if="[[allowEsLink]]"><dynamic-pills health-elements="[[_selectedHes(healthElements.*, contact.subContacts.*)]]" on-unlink-to-health-element="_unlinkDoc"></dynamic-pills></template>

                            <template is="dom-if" if="[[downloadable]]">
                                <paper-icon-button icon="file-download" on-tap="_downloadAnnex" dataurl\$="[[item.dataUrl]]" class="button--icon-btn" id="downloadFile-6"></paper-icon-button>
                                <paper-tooltip for="downloadFile-6" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                            </template>

                            <template is="dom-if" if="[[!isPatDetail]]">
                                <template is="dom-if" if="[[!forceNoAssignation]]">
                                    <paper-icon-button icon="icons:assignment-ind" on-tap="_triggerOpenAssignmentDialog" document-id\$="[[item.id]]" class="button--icon-btn" id="assign-ico-lab"></paper-icon-button>
                                    <paper-tooltip for="assign-ico-lab" position="left">[[localize('assign_to_pat','Assign to a patient',language)]]</paper-tooltip>
                                </template>
                            </template>

                            <template is="dom-if" if="[[hubImportable]]">
                                <paper-icon-button icon="icons:cloud-download" on-tap="_importDocumentFromHub" data-document\$="[[data]]" data-transaction\$="[[transactionInfo]]" class="button--icon-btn" id="downloadFileOnHub"></paper-icon-button>
                                <paper-tooltip for="downloadFileOnHub" position="left">[[localize('hub-down-fil-pat','Download file into patient folder',language)]]</paper-tooltip>
                            </template>

                            <template is="dom-if" if="[[hubuploadable]]">
                                <paper-icon-button icon="icons:cloud-upload" on-tap="_uploadOnHubs" data-document-id\$="[[document.id]]" class="button--icon-btn" id="uploadFileOnHub"></paper-icon-button>
                                <paper-tooltip for="uploadFileOnHub" position="left">[[localize('hub-upl-fil','Upload file on hubs',language)]]</paper-tooltip>
                            </template>

                            <template is="dom-if" if="[[forwardable]]">
                                <paper-icon-button on-tap="_forwardDocument" data-document-id\$="[[document.id]]" class="button--icon-btn" id="forwardDocument" icon="forward"></paper-icon-button>
                                <paper-tooltip for="forwardDocument" position="left">[[localize('forwardDocumentToColleague','Forward document to a colleague',language)]]</paper-tooltip>
                            </template>

                            <template is="dom-if" if="[[allowEsLink]]">
                                <paper-tooltip position="left" for="linkhe">[[localize('link_he','Link Health Element',language)]]</paper-tooltip>
                                <paper-menu-button class="form-title-bar-btn" horizontal-align="right" dynamic-align="true" vertical-offset="30">
                                    <paper-icon-button id="linkhe" class="button--icon-btn" icon="icons:link" slot="dropdown-trigger"></paper-icon-button>
                                    <paper-listbox slot="dropdown-content">
                                        <template is="dom-repeat" items="[[linkableHealthElements]]" as="he">
                                            <template is="dom-if" if="[[he.id]]"><paper-item id="[[he.id]]" class\$="link [[_isExcluded(he)]]" on-tap="_linkDoc"><label class\$="colour-code [[he.colour]]"><span></span></label>[[he.descr]]</paper-item></template>
                                            <template is="dom-if" if="[[!he.id]]"><paper-item id="[[he.idService]]" class\$="link [[he.colour]]" on-tap="_linkDoc"><label class="colour-code"><span></span></label>[[he.descr]]</paper-item></template>
                                        </template>
                                    </paper-listbox>
                                </paper-menu-button>
                            </template>

                            <template is="dom-if" if="[[allowEditLabelAndTransaction]]">
                                <paper-icon-button icon="create" on-tap="_editLabelAndTransaction" class="button--icon-btn" id="editLabelAndTransaction"></paper-icon-button>
                                <paper-tooltip for="editLabelAndTransaction" position="left">[[localize('editLabelAndTransaction','Edit label and type',language)]]</paper-tooltip>
                            </template>

                            <template is="dom-if" if="[[allowDeletion]]">
                                <paper-icon-button icon="delete" on-tap="_deleteService" class="button--icon-btn" id="deleteService"></paper-icon-button>
                                <paper-tooltip for="deleteService" position="left">[[localize('del','Delete',language)]]</paper-tooltip>
                            </template>

                        </div>
                    </div>

                    <template is="dom-if" if="[[_size(patientData)]]">
                        <div class="resInfos">
                            <div class="patientInfos">
                                <div class="patientPicture"><img src\$="[[_renderPatientPicture(patientData)]]"></div>
                                <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(patientData.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[patientData.lastName]] [[patientData.firstName]]</b></div>
                                <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(patientData.ssin)]]</div>
                                <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[patientData.dateOfBirthHr]]</div>
                                <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[patientData.address.street]] [[patientData.address.houseNumber]] [[patientData.address.postboxNumber]]</div>
                                <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[patientData.address.postalCode]] [[patientData.address.city]]</div>
                                <div class="flTopRight">
                                    <iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2 darkerGreen"></iron-icon> <span class="bold darkerGreen">[[localize('documentAssigned','Document assigned',language)]]</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <pre class="txt-container large">[[attachmentContent]]</pre>

                    <template is="dom-if" if="[[isLoading]]"><ht-spinner active=""></ht-spinner></template>
                </template>

            </paper-card>

        </template>



        <template is="dom-if" if="[[isLabOrProtocol]]">
            <paper-card class\$="pat-details-card [[_fullWidth(fullwidth)]]" rel="isLabOrProtocol">

                <template is="dom-if" if="[[isLoading]]"><div class="spinnerContainer"><ht-spinner active=""></ht-spinner></div></template>

                <div class="form-title bold">
                    <span class="fs12em"><iron-icon icon="vaadin:flask" class="darkBlue w-20 m-r-5"></iron-icon> [[localize('boxtitle.labResult','Lab results',language)]] <span class="regular italic">([[labOrProtocolContentFirstItem.labo]])</span> - [[localize('prot','Protocol',language)]] <span class="darkBlue">#[[labOrProtocolContentFirstItem.protocol]]</span> - <span class="darkRed">[[labOrProtocolTotalPatients]] [[localize('singularOrPluralpatient','Patient(s)',language)]]</span></span>
                    <div>

                        <template is="dom-if" if="[[downloadable]]">
                            <paper-icon-button icon="file-download" on-tap="_downloadAnnex" dataurl\$="[[item.dataUrl]]" class="button--icon-btn" id="downloadFile-7"></paper-icon-button>
                            <paper-tooltip for="downloadFile-7" position="left">[[localize('dl','Download',language)]]</paper-tooltip>
                        </template>

                        <template is="dom-if" if="[[printable]]">
                            <paper-icon-button icon="print" on-tap="_printDocument" data-contact-id\$="[[contactId]]" data-document-id\$="[[_getId(document)]]" id="printDocument" class="button--icon-btn"></paper-icon-button>
                            <paper-tooltip for="printDocument" position="left">[[localize('print','Print',language)]]</paper-tooltip>
                        </template>

                        <template is="dom-if" if="[[!isPatDetail]]">
                            <template is="dom-if" if="[[!forceNoAssignation]]">
                                <paper-icon-button icon="icons:assignment-ind" on-tap="_triggerOpenAssignmentDialog" document-id\$="[[item.id]]" class="button--icon-btn" id="assign-ico-lab"></paper-icon-button>
                                <paper-tooltip for="assign-ico-lab" position="left">[[localize('assign_to_pat','Assign to a patient',language)]]</paper-tooltip>
                            </template>
                        </template>

                        <template is="dom-if" if="[[hubImportable]]">
                            <paper-icon-button icon="icons:cloud-download" on-tap="_importDocumentFromHub" data-document\$="[[data]]" data-transaction\$="[[transactionInfo]]" class="button--icon-btn" id="downloadFileOnHub"></paper-icon-button>
                            <paper-tooltip for="downloadFileOnHub" position="left">[[localize('hub-down-fil-pat','Download file into patient folder',language)]]</paper-tooltip>
                        </template>

                        <template is="dom-if" if="[[hubuploadable]]">
                            <paper-icon-button icon="icons:cloud-upload" on-tap="_uploadOnHubs" data-document-id\$="[[document.id]]" class="button--icon-btn" id="uploadFileOnHub"></paper-icon-button>
                            <paper-tooltip for="uploadFileOnHub" position="left">[[localize('hub-upl-fil','Upload file on hubs',language)]]</paper-tooltip>
                        </template>

                        <template is="dom-if" if="[[forwardable]]">
                            <paper-icon-button icon="arrow-forward" on-tap="_forwardDocument" data-document-id\$="[[document.id]]" class="button--icon-btn" id="forwardDocument"></paper-icon-button>
                            <paper-tooltip for="forwardDocument" position="left">[[localize('forwardDocumentToColleague','Forward document to a colleague',language)]]</paper-tooltip>
                        </template>

                    </div>
                </div>

                <template is="dom-repeat" items="[[labOrProtocolContent]]" as="resInfo">



                    <template is="dom-if" if="[[!isPatDetail]]">

                        <template is="dom-if" if="[[_size(patientData)]]">
                            <div class="resInfos">
                                <div class="patientInfos">
                                    <div class="patientPicture"><img src\$="[[_renderPatientPicture(patientData)]]"></div>
                                    <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(patientData.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(patientData.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[patientData.lastName]] [[patientData.firstName]]</b></div>
                                    <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(patientData.ssin)]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[patientData.dateOfBirthHr]]</div>
                                    <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: [[patientData.address.street]] [[patientData.address.houseNumber]] [[patientData.address.postboxNumber]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: [[patientData.address.postalCode]] [[patientData.address.city]]</div>
                                    <div class="flTopRight">
                                        <iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2 darkerGreen"></iron-icon> <span class="bold darkerGreen">[[localize('documentAssigned','Document assigned',language)]]</span>
                                        <template is="dom-if" if="[[resInfo.complete]]"><div class="completeIncompleteIndicator m-t-50 darkerGreen normal"><iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('com_res','Complete result',language)]]</div></template>
                                        <template is="dom-if" if="[[!resInfo.complete]]"><div class="completeIncompleteIndicator m-t-50 darkRed normal"><iron-icon icon="icons:cancel" class="m-r-5 w20 m-t-minus-2"></iron-icon>  [[localize('inc_res','Incomplete result',language)]]</div></template>
                                        <div class="resultDate m-t-10 darkBlue"><iron-icon icon="vaadin:calendar-clock" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('date','Date',language)]]: [[_formatDateDDMMYYYY(resInfo.demandDate)]]</div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template is="dom-if" if="[[!_size(patientData)]]">
                            <div class="resInfos">
                                <div class="patientInfos">
                                    <div class="patientPicture"><img src\$="[[_renderPatientPicture(resInfo)]]"></div>
                                    <div class="m-b-3"><iron-icon icon\$="[[_iconBySex(resInfo.sex)]]" class\$="m-r-5 [[_colorCssClassBySex(resInfo.sex)]] w20 m-t-minus-2"></iron-icon> <b>[[resInfo.lastName]] [[resInfo.firstName]]</b></div>
                                    <div class="m-b-3"><iron-icon icon="vaadin:user-card" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('ssinPatVerbose','National identification number',language)]]: [[_formatSsinNumber(resInfo.ssin)]]</div>
                                    <div class="m-b-3"><iron-icon icon="social:cake" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('birthDate','Birth date',language)]]: [[_YYYYMMDDDateToHrDate(resInfo.dateOfBirth)]]</div>
                                    <div class="m-b-3"><iron-icon icon="icons:home" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('postalAddress','Address',language)]]: -</div>
                                    <div class="m-b-3"><iron-icon icon="social:location-city" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('zipHyphenCity','ZIP - City',language)]]: -</div>
                                    <div class="flTopRight">
                                        <iron-icon icon="icons:cancel" class="m-r-5 w20 m-t-minus-2 darkRed"></iron-icon> <span class="bold darkRed">[[localize('unassignedDocument','Unassigned document',language)]]</span>
                                        <template is="dom-if" if="[[resInfo.complete]]"><div class="completeIncompleteIndicator m-t-50 darkerGreen normal"><iron-icon icon="icons:check-circle" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('com_res','Complete result',language)]]</div></template>
                                        <template is="dom-if" if="[[!resInfo.complete]]"><div class="completeIncompleteIndicator m-t-50 darkRed normal"><iron-icon icon="icons:cancel" class="m-r-5 w20 m-t-minus-2"></iron-icon>  [[localize('inc_res','Incomplete result',language)]]</div></template>
                                        <div class="resultDate m-t-10 darkBlue"><iron-icon icon="vaadin:calendar-clock" class="m-r-5 w20 m-t-minus-2"></iron-icon> [[localize('date','Date',language)]]: [[_formatDateDDMMYYYY(resInfo.demandDate)]]</div>
                                    </div>
                                </div>
                            </div>
                        </template>

                    </template>



                    <template is="dom-if" if="[[_hasServices(resInfo)]]">

                        <ht-services-list id="dynamicallyListForm" api="[[api]]" user="[[user]]" contacts="[[_wrap(resInfo)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" additional-css-classes="fullWidth"></ht-services-list>

<!--                        <template is="dom-if" if="[[_moreThan2(resInfo.services)]]"><ht-services-list id="dynamicallyListForm" api="[[api]]" user="[[user]]" contacts="[[_wrap(resInfo)]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]"></ht-services-list></template>-->
<!--                        <template is="dom-if" if="[[!_moreThan2(resInfo.services)]]">-->
<!--                            <template is="dom-if" if="[[_serviceDescription(resInfo.services.1)]]">-->
<!--                                <div class="line-flex">-->
<!--                                    <div class="label">[[_serviceDescription(resInfo.services.0)]]</div>-->
<!--                                    <pre class="result">[[_serviceDescription(resInfo.services.1)]]</pre>-->
<!--                                </div>-->
<!--                            </template>-->
<!--                            <template is="dom-if" if="[[!_serviceDescription(resInfo.services.1)]]">-->
<!--                                <div class="line-flex">-->
<!--                                    <pre class="txt-container large">[[_prettifyText(resInfo.services.0)]]</pre>-->
<!--                                </div>-->
<!--                            </template>-->
<!--                        </template>-->

                    </template>

                    <template is="dom-if" if="[[!_hasServices(resInfo)]]">
                        <pre class="txt-container large">[[attachmentContent]]</pre>
                    </template>



                </template>

            </paper-card>
        </template>
`;
  }

  static get is() {
      return 'dynamic-doc';
  }

  static get properties() {
      return {
          api: {
              type: Object
          },
          user: {
              type: Object
          },
          documentId: {
              type: String,
              value: null
          },
          language: {
              type: String,
              value: null
          },
          downloadable:{
              type: Boolean
          },
          forwardable:{
              type: Boolean,
              value: false
          },
          hubuploadable: {
            type: Boolean,
            value: false
          },
          hubImportable:{
              type: Boolean,
              value: false
          },
          printable: {
              type: Boolean,
              value: false
          },
          isBodyTextOfEmail:{
              type: Boolean,
              value: false
          },
          preview:{
              type: Boolean
          },
          document: {
              type: Object,
              value: null
          },
          documentAttachment:{
              type: String,
              value: null
          },
          dataUrl: {
              type: String,
              value: null
          },
          data: {
              type: Object
          },
          pdfData: {
              type: Object
          },
          title: {
              type: String,
              value: null
          },
          showDetail:{
              type: Boolean,
              value: false
          },
          type:{
              type: String,
              value: null
          },
          isLabOrProtocol: {
              type: Boolean,
              value: true
          },
          isPatDetail: {
              type: Boolean,
              value: false
          },
          forceNoAssignation: {
              type: Boolean,
              value: false
          },
          isLoading: {
              type: Boolean,
              value: false
          },
          fullwidth: {
              type: Boolean,
              value: false
          },
          transactionInfo:{
              type: Object,
              value: () => {}
          },
          patientData:{
              type: Object,
              value: () => {}
          },
          labOrProtocolContent: {
              type: Array,
              value: () => []
          },
          labOrProtocolContentFirstItem: {
              type: Object,
              value: {}
          },
          labOrProtocolTotalPatients: {
              type: Number,
              value: 1
          },
          showExtendedTitle: {
              type: Boolean,
              value: false
          },
          contacts: {
              type: Object,
              value: () => {}
          },
          contact: {
              type: Object,
              value: () => {}
          },
          annexesInfos: {
              type: Object,
              value: () => {}
          },
          hasComment: {
              type: Boolean,
              value: false
          },
          comment: {
              type: String,
              value: null
          },
          forwardDocumentEvent: {
              type: String,
              value: "forward-document"
          },
          allowEsLink: {
              type: Boolean,
              value: false
          },
          allowEditLabelAndTransaction: {
              type: Boolean,
              value: false
          },
          healthElements: {
              type: Array
          },
          linkableHealthElements: {
              type: Array
          },
          allowDeletion: {
              type: Boolean,
              value: false
          },
      };
  }

  static get observers() {
      return ['_documentIdChanged(documentId, api, user)','_dataUrlChanged(dataUrl)', '_dataChanged(data)']
  }

  constructor() {
      super();
  }

  ready() {
      super.ready()
  }

  _title(name, fallback) {
      return name && name !== 'No title' ? name : fallback
  }

  _extendedTitle(name, created, modified, fallback) {

      return this._title(name, fallback)
          + " - " + this.localize('creation', 'Creation', this.language) + " " + this._formatDateDDMMYYYY(created)
          + " - " + this.localize('last_edi', 'Last modification', this.language) + " " + this._formatDateDDMMYYYY(modified)
  }

  _size(inputData) {
      return !!_.size(inputData)
  }

  _triggerOpenAssignmentDialog() {
      this.dispatchEvent(new CustomEvent('trigger-open-assignment-dialog', {detail: {documentId: this.documentId}, bubbles: true, composed: true}))
  }

  _documentIdChanged() {
      if (!this.documentId || !this.api || !this.user) {
          this.set('isLoading',false)
          return;
      }
      this.set('isLoading',true)

      const contact = _.find(this.contacts, ctc => _.some(_.get(ctc,"services",[]), svc => _.trim(_.get(svc,"content."+ this.language +".documentId")) === _.trim(_.get(this,"documentId",""))));
      this.set("contact", contact);
      this.set("contactId", _.trim(_.get(this.contact,"id","")));

      const docId = this.documentId
      this.api.document().getDocument(docId)
          .then(doc => {
              this.set('document', doc)
              if (_.size(doc.encryptionKeys) || _.size(doc.delegations)) {
                  this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(this.user.healthcarePartyId, doc.id, _.size(doc.encryptionKeys) ? doc.encryptionKeys : doc.delegations)
                      .then(({extractedKeys: enckeys}) => {
                          if(_.trim(_.get(doc,"mainUti","")) === "public.html") {
                              this.api.document().getAttachment(_.trim(_.get(doc, "id", "")), _.trim(_.get(doc, "attachmentId", "")), enckeys.join(',')).then(attachmentContent => this.set("data", {
                                  content: [_.trim(attachmentContent)],
                                  l: null
                              }))
                          }
                          doc && this.api.document().getAttachmentUrl(doc.id, doc.attachmentId, enckeys).then(url => this.set('dataUrl', url))
                      })
                      .catch(() => {
                          doc && this.api.document().getAttachmentUrl(doc.id, doc.attachmentId, undefined).then(url => this.set('dataUrl', url))
                      })
              } else {
                  doc && this.api.document().getAttachmentUrl(doc.id, doc.attachmentId, undefined).then(url => this.set('dataUrl', url))
              }
          })
          .then(() => this._getComment())
          .then(comment => {
              comment && this.set("comment", comment);
              this.set("hasComment", !!comment);
          })
          .catch(error => {
              console.log(error);
          })
          .finally(() => this.set('isLoading', false))
  }

  _downloadAnnex(){
      const doc = this.document
      if (doc && (_.size(doc.encryptionKeys) || _.size(doc.delegations))) {
          this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(this.user.healthcarePartyId, doc.id, _.size(doc.encryptionKeys) ? doc.encryptionKeys : doc.delegations
          ).then(({extractedKeys: enckeys}) => {
              const utiExt = doc.mainUti && doc.mainUti.split(".").length ? doc.mainUti.split(".")[1] : undefined
              const docExt = doc.name  && doc.name.split(".").length ? doc.name.split(".")[1] : undefined
              const docName = !docExt && utiExt ? doc.name + "." + utiExt : doc.name
              doc && this.api.document().getAttachmentUrl(doc.id, doc.attachmentId, enckeys, docName).then(url => {
                  let a = document.createElement("a");
                  document.body.appendChild(a);
                  this.appendChild(a);
                  a.style = "display: none";
                  a.download = doc.name // optional
                  a.setAttribute('href', url);
                  a.click();
                  window.URL.revokeObjectURL(url);
              })
          })
      } else {
          if(this.data && this.data.value){
              let image_data = atob(this.data.value);
              let arraybuffer = new ArrayBuffer(image_data.length);
              let view = new Uint8Array(arraybuffer);
              for (let i=0; i<image_data.length; i++) {
                  view[i] = image_data.charCodeAt(i) & 0xff;
              }
              let blob = new Blob([arraybuffer], {type: 'application/octet-stream'});

              let url = window.URL.createObjectURL(blob)
              let a = document.createElement("a");
              this.appendChild(a);
              a.style = "display: none";
              a.href = url;
              if(this.data && this.data.mediatype && this.data.mediatype === "IMAGE_JPEG"){
                  a.download = `${"image"}_${moment()}.jpeg`;
              }else {
                  a.download = `${"image"}_${moment()}.png`;
              }
              a.click();
              this.removeChild(a);
              window.URL.revokeObjectURL(url);
          } else if(this.dataUrl){
              console.log("dataUrl : ", this.dataUrl)
          }
      }

  }

  _print(e) {
      const target = this.document || null
      if (target) {
          this.api.pdfReport(null,{}).then(({pdf:data, printed:printed}) =>{ // TODO format print
              if (!printed) {
                  let blob = new Blob([data],{type :'application/pdf'});

                  let url = window.URL.createObjectURL(blob)

                  let a = document.createElement("a");
                  document.body.appendChild(a);
                  a.style = "display: none";

                  a.href = url;
                  a.download = _.get(this,"selectedInvoice.id",this.api.crypto().randomUuid()) + moment() + ".pdf";
                  a.click();
                  window.URL.revokeObjectURL(url);
              }
          })
      }
  }

  _imageMimeType(uti, utis, dataUrl, data) {
      return data && data.mediatype ? data.mediatype === "IMAGE_PNG" || data.mediatype === "IMAGE_JPEG"  : (data || dataUrl) && (uti && [uti] || []).concat(utis || []).map(u => this.mimeType(u)).find(m => m && (m.startsWith('image/') || m === 'public/jpeg'));
  }

  _pdfMimeType(uti, utis, dataUrl, data) {
      return data && data.mediatype ? data.mediatype === "APPLICATION_PDF" : (data || dataUrl) && (uti && [uti] || []).concat(utis || []).map(u=>this.mimeType(u)).find(m=>m === 'application/pdf');
  }

  _xmlMimeType(uti, utis) {
      return (uti && [uti] || []).concat(utis || []).map(u => this.mimeType(u)).find(m => m === 'text/xml' || m === 'application/xml');
  }

  _plainMimeType(uti, utis, isLabOrProtocol, data) {
      return !isLabOrProtocol && (uti && [uti] || []).concat(utis || []).map(u => this.mimeType(u)).find(m => m === 'text/plain');
  }

  _pdfRenderableMimeType(uti, utis, isLabOrProtocol, data){
      return data && data.content && (data.l || data.l === null) ? data.content.length : false;//this._plainMimeType(uti, utis, isLabOrProtocol, data);
  }

  _urlMimeType(uti, utis, isLabOrProtocol, data){
      return data && data.mediatype ? data.mediatype === "TEXT_HTML" : false
  }

  _unknownMimeType(uti, utis, dataUrl, data) {
      return (!this._imageMimeType(uti, utis, dataUrl, data) && !this._pdfMimeType(uti, utis, dataUrl, data) && !this._xmlMimeType(uti, utis)
          && !this._plainMimeType(uti, utis)&& !this._pdfRenderableMimeType(uti, utis, null, data)
          && !this._urlMimeType(uti, utis, null, data))
  }

  _dataUrlChanged(dataUrl) {
      const promResolve = Promise.resolve()
      if (dataUrl && dataUrl.length && this.document && this.document.mainUti !== "com.adobe.pdf" && this.document.mainUti !== "public.jpeg" && this.document.mainUti !== "public.png") {
          this.set('isLoading',true)
          this.api.crypto()
              .extractKeysFromDelegationsForHcpHierarchy(
                  this.user.healthcarePartyId,
                  this.document.id,
                  _.size(this.document.encryptionKeys) ? this.document.encryptionKeys : this.document.delegations
              )
              .then(({extractedKeys: enckeys}) => {
                  return promResolve
                      .then(() => this.api.beresultimport().canHandle(this.document.id, enckeys.join(',')).then(isResult =>!!isResult).catch(()=>false))
                      .then(isResult => {
                          if (isResult) {
                              this.set('isLabOrProtocol', true)
                              return this.api.beresultimport().getInfos(this.document.id, true, this.language || 'fr', enckeys.join(','))
                                  .then(res => {
                                      this.set('labOrProtocolContent', res)
                                      this.set('labOrProtocolContentFirstItem', _.head(res))
                                      this.set('labOrProtocolTotalPatients', _.size(res))
                                      return !!_.size(_.get(res,"[0].services",[])) ? null : this.api.shortLivedCache(dataUrl, () => fetch(dataUrl, {credentials: 'include'}).then(response => response.text())).then(attachmentContent => this.set('attachmentContent', attachmentContent))
                                  })
                          } else {
                              this.set('isLabOrProtocol', false)
                              return this.api.shortLivedCache(dataUrl, () => fetch(dataUrl, {credentials: 'include'})
                                  .then(response => response.text()))
                                  .then(text => {
                                      this.set('attachmentContent', text)
                                  })

                          }
                  }).catch((e) => console.log('Handle error: ', e))
              })
              .finally(()=>this.set('isLoading',false))
      }else{
          this.set('isLabOrProtocol', false)
      }
  }

  _dataChanged(data) {
      if (data) {
          this.set('isLabOrProtocol', false)
          this.set('attachmentContent', data && data.value ? data.value : data)
          this.set('isLoading',false)
          if(data && data.content && (data.l || data.l === null)){
              this._renderData(data);
          }
      } else {
          this.set('isLabOrProtocol', false)
      }
  }

  _selectData(dataUrl, data){
      //data.value: kmehr lnk element
      return dataUrl ? dataUrl : (data.value ? data.value : data);
  }

  _selectImageData(dataUrl, data){
      //data.value: kmehr lnk element
      //"data:image/png;base64, BASE64DATA...=="
      return dataUrl ? dataUrl : (data.value ? "data:image/png;base64, " + data.value : data);
  }

  mimeType(u){
      return u === 'public.plainText' ? 'text/plain' : this.api.document().mimeType(u)
  }

  _base64(data) {
      return base64js.fromByteArray(data);
  }

  _getAttachment(){
      this.showDetail = !this.showDetail
  }

  _formatDate(date) {
      return date && this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY')
  }

  _formatDateDDMMYYYY(date) {
      return date && this.api.moment(date).format('DD/MM/YYYY')
  }

  _wrap(o) { return [o] }

  _moreThan2(items) {
      return items && items.length > 2
  }

  _serviceDescription(svc) {
      return svc && this.api.contact().shortServiceDescription(svc, this.language) || ''
  }

  _isEqual(a,b) {
      return a === b
  }

  _renderData(data){

      if(data && data.content) {
          this._renderHtmlAsPDF(_.join(data.content), "doc")
              .then(({pdf:data}) => this.set("pdfData", this._arrayBufferToBase64(data)))
      }

  }

  _arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
  }

  _renderHtmlAsPDF(html, filename){
      let pdfTemplate = html;
      return this.api.pdfReport(mustache.render(pdfTemplate, {}));
  }

  _uploadOnHubs(e){
      const documentId = _.get(e,"target.dataset.documentId", false);
      return !!documentId ? this.dispatchEvent(new CustomEvent('upload-document', { composed: true, bubbles: true, detail: { documentId:documentId, documentComment:this.comment } })) : false;
  }

  _importDocumentFromHub(e){
      if(e.target && e.target.dataset && e.target.dataset.document && e.target.dataset.transaction){
          this.dispatchEvent(new CustomEvent('import-hub-document', { composed: true, bubbles: true, detail: { document: e.target.dataset.document, transaction:  e.target.dataset.transaction} }))
      }
  }

  _forwardDocument(e) {
      const documentId = _.get(e,"target.dataset.documentId", false);
      return !!documentId ? this.dispatchEvent(new CustomEvent(this.forwardDocumentEvent, { composed: true, bubbles: true, detail: { documentId:documentId } })) : false;
  }

  _fullWidth(inputData) {
      return !!inputData ? "fullWidth" : ""
  }

  _renderPatientPicture(patientData) {
      return !_.trim(_.get(patientData,"picture","")) ?
          _.trim(_.get(patientData,"sex","M")) === 'F' ? require('../../../images/female-placeholder.png') : require('../../../images/male-placeholder.png') :
          'data:image/png;base64,' + _.trim(_.get(patientData,"picture",""))
  }

  _iconBySex(inputData) {
      return (inputData === "F" || inputData === "W") ? "vaadin:female" : "vaadin:male"
  }

  _colorCssClassBySex(inputData) {
      return (inputData === "F" || inputData === "W") ? "darkPink" : "darkBlue"
  }

  _formatSsinNumber(inputData) {
      return this.api.formatSsinNumber(_.trim(inputData))
  }

  _YYYYMMDDDateToHrDate(inputData) {
      return inputData && this.api.moment(inputData,"YYYYMMDD").format('DD/MM/YYYY')
  }

  _hasServices(a) {
      return !!_.size(_.get(a,"services",[]))
  }

  _prettifyText(input) {
      return _.trim(this._serviceDescription(input))
          .replace(/\r\n|\n|\r/gm, "\n")
  }

  _getId(a) {
      return _.trim(_.get(a,"id",""))
  }

  _contactId(contacts) {
      const targetContact = _.find(contacts, ctc => _.some(_.get(ctc,"services",[]), svc => _.trim(_.get(svc,"content."+ this.language +".documentId")) === _.trim(_.get(this,"document.id",""))))
      return _.trim(_.get(targetContact,"id",""))
  }

  _getComment() {
      if (!this.documentId || !this.document || !this.contact) {
          return Promise.resolve("");
      } else {
          const encryptedComment = (this.contact.services.find(svc => svc.content && svc.content.hasOwnProperty(this.language) && svc.content[this.language].documentId === this.documentId) || {comment: ""}).comment;
          if (!encryptedComment) {
              return Promise.resolve("");
          } else {
              const ua = this.api.crypto().utils.text2ua(Base64.decode(encryptedComment));
              return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, this.contact, ua)
                  .then(ua => this.api.crypto().utils.ua2text(ua))
                  .catch(err => {
                      return this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", this.user, this.document, ua)
                      .then(ua => this.api.crypto().utils.ua2text(ua))
                  })
          }
      }
  }

  _printDocument(e) {

      const targetButton = _.find(_.get(e,"path",[]), nodePath=> _.trim(_.get(nodePath,"nodeName","")).toUpperCase() === "PAPER-ICON-BUTTON" )
      const patientId = _.trim(_.get(this,"patientData.id",""))
      const annexInfo = _.find(_.get(this,"annexesInfos",[]), {documentId:_.trim(_.get(this,"document.id",""))})
      const contactId = _.trim(_.get(annexInfo,"contactId",""))

      if(!!_.trim(patientId)) _.merge(targetButton, {dataset:{patientId:patientId}})
      if(!!_.trim(contactId)) _.merge(targetButton, {dataset:{contactId:contactId}})

      return !!targetButton ? this.dispatchEvent(new CustomEvent('print-document', { composed: true, bubbles: true, detail: _.get(targetButton,"dataset",{}) })) : false;

  }

  _isExcluded(he){
      return _.get(he, 'tags', []).find(t => t.type === "CD-CERTAINTY" && t.code === "excluded") ? "exclude" : null
  }

  _linkDoc(e) {
      const he = this.healthElements.find(he => he.id === _.get(e,"target.id","") || he.idService === _.get(e,"target.id",""));
      this.dispatchEvent(new CustomEvent('link-doc', {detail: {healthElement: he, contact: this.contact, document: this.document}, composed: true, bubbles: true}));
  }

  _unlinkDoc(e) {
      const he = _.get(e,"detail.healthElement",{})
      this.dispatchEvent(new CustomEvent('unlink-doc', {detail: {healthElement: he, contact: this.contact, document: this.document}, composed: true, bubbles: true}));
  }

  _editLabelAndTransaction(e) {
      this.dispatchEvent(new CustomEvent('edit-label-and-transaction', {detail: {contact: this.contact, document: this.document}, composed: true, bubbles: true}));
  }

  _selectedHes() {

      if(!_.size(_.get(this,"contact.services")) || !_.size(_.get(this,"contact.subContacts")) || !_.trim(_.get(this,"document.id","")) || !_.size(_.get(this,"healthElements",[]))) return [];

      const documentSvc = _.find(this.contact.services, svc => (!!_.size(_.get(svc,"content.fr",{})) && _.get(svc,"content.fr.documentId","") === this.document.id) || (!!_.size(_.get(svc,"content.nl",{})) && _.get(svc,"content.nl.documentId","") === this.document.id) || (!!_.size(_.get(svc,"content.en",{})) && _.get(svc,"content.en.documentId","") === this.document.id))
      const heIds = _.map(_.filter(this.contact.subContacts, sctc => !!_.trim(_.get(sctc,"healthElementId","")) && _.some(_.get(sctc,"services"), {serviceId:_.get(documentSvc,"id","")})), "healthElementId")

      return this.healthElements.filter(he => he.id && heIds.indexOf(he.id) > -1)

  }

  _deleteService(e) {
      this.dispatchEvent(new CustomEvent('delete-service', {detail: {contact: this.contact, document: this.document}, composed: true, bubbles: true}));
  }
}

customElements.define(DynamicDoc.is, DynamicDoc);
