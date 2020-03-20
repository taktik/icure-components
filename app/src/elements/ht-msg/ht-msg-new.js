import '../ht-spinner/ht-spinner.js'
import '../../styles/vaadin-icure-theme.js'
import '../dynamic-form/dynamically-loaded-form.js'
import '../dynamic-form/entity-selector.js'
import '../dynamic-form/dynamic-doc.js'
import '../../styles/shared-styles.js'
import '../../styles/dialog-style.js'
import '../../styles/buttons-style.js'
import '../../styles/dropdown-style.js'
import '../../styles/paper-tabs-style.js'
import '../ht-pat/dialogs/ht-pat-outgoing-document.js'

import "@polymer/iron-autogrow-textarea/iron-autogrow-textarea"
import "@polymer/iron-icon/iron-icon"
import "@polymer/paper-button/paper-button"
import "@polymer/paper-checkbox/paper-checkbox"
import "@polymer/paper-dialog/paper-dialog"
import "@polymer/paper-icon-button/paper-icon-button"
import "@polymer/paper-input/paper-input"
import "@polymer/paper-item/paper-item"
import "@vaadin/vaadin-combo-box/vaadin-combo-box"
import "@vaadin/vaadin-upload/vaadin-upload"

import _ from 'lodash/lodash'
import moment from 'moment/src/moment'
import mustache from "mustache/mustache.js"

import {PolymerElement, html} from '@polymer/polymer'
import {TkLocalizerMixin} from "../tk-localizer"

class HtMsgNew extends TkLocalizerMixin(PolymerElement) {
    static get template() {
        return html`
        <style include="scrollbar-style dialog-style buttons-style dropdown-style paper-tabs-style shared-styles">

            h2 {
                margin-block-start:0;
            }

            .posRel {
                position:relative
            }

            .vertical {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }

            .horizontal {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                flex-basis: 100%;
                align-items: center;
            }

            .m-t-8 {
                margin-top: 8px;
            }

            .m-t-12 {
                margin-top: 12px;
            }

            .m-t-m-10 {
                margin-top: -10px;
            }

            .m-t-20 {
                margin-top: 20px;
            }

            .m-t-30 {
                margin-top: 30px;
            }

            .m-t-50 {
                margin-top: 50px;
            }

            .m-l-20 {
                margin-left: 20px;
            }

            .p-t-7 {
                padding-top: 7px;
            }

            .p-t-18 {
                padding-top: 18px;
            }

            .mw120 {
                min-width:120px;
            }

            .cell {
                display: flex;
                flex-grow: 1;
            }

            .cell.colspan2 {
                flex-grow: 2;
            }

            .cell.colspan3 {
                flex-grow: 3;
            }

            .cell.colspan6 {
                flex-grow: 6;
            }

            .type-to {
                width: 280px;
            }

            .recipients-list {
                overflow-x: auto;
                padding-left: 130px;
            }

            input {
                border: none;
                width: 100%;
            }

            paper-dialog {
                margin: 0;
                min-width: 30%;
                width: 80%;
                height: 80vh;
                overflow: hidden;
            }

            .modal-subtitle {
                margin: 8px 12px 8px 0;
                font-weight: bold;
            }

            vaadin-upload {
                margin: 16px 0;
                min-height: 280px;
                min-height: 0;
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
                };
                --vaadin-upload-file-meta: {
                    min-height: 36px;
                };

            }

            paper-input, paper-input-container {
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .patLabel {
                padding-top: 12px;
            }

            paper-checkbox {
                margin-right: 16px;
            }

            vaadin-combo-box {
                width: 100%;
            }

            iron-autogrow-textarea {
                min-height: 80px;
                width: 100%;
                --paper-input-container-focus-color: var(--app-primary-color);
            }

            .form-disabled {
                opacity: .5;
                background: var(--app-background-color-darker);
            }

            .buttons {
                display: flex;
                flex-direction: row;
            }

            .scrollbox {
                height: calc(100% - 132px);
                overflow-y: auto;
                margin-top: 0;
            }

            .field{
                padding:12px 0;
            }

            .destination-tag {
                background: rgba(0,0,0,.1);
                color: var(--exm-token-input-badge-text-color,--text-primary-color);
                height: 24px;
                min-height: 1px;
                font-size: 12px;
                min-width: initial;
                padding: 0;
                margin: 5px 10px 0 0;
                border-radius: 5px;
                overflow: hidden;
                float:left;
            }

            .destination-type{
                background: var(--app-secondary-color);
                color: var(--app-text-color);
                display: flex;
                height: 100%;
                flex-flow: row wrap;
                padding: 0 4px;
                box-sizing: border-box;
                align-items: center;
                margin-right: 8px;
            }

            .del-destination {
                height: 22px;
                width: 22px;
                margin: 0 4px 0 8px;
                padding: 2px;
            }

            paper-checkbox {
                --paper-checkbox-unchecked-color: var(--app-text-color);
                --paper-checkbox-label-color: var(--app-text-color);
                --paper-checkbox-checked-color: var(--app-secondary-color);
                --paper-checkbox-checked-ink-color: var(--app-secondary-color-dark);
            }

            #messageBodyText {
                min-height: 200px;
            }

            #new-msg {
                display: flex;
                flex-direction: column;
                top: 70px !important;
                right: 7px !important;
                left: initial !important;
                position: fixed;
                /*max-width: initial !important;*/
                max-width: -webkit-fill-available!important;
                width: 83vw !important;
                max-height: initial !important;
                height: calc(100vh - 28px);
            }

            .spinner {
                display: flex;
                flex-grow: 1;
                width: 47px; /* force circle */
                transform: translateY(16px);
            }

            .sendingSpinner {
                display: block;
                float: right;
            }

            #success, #failed {
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

            #success iron-icon, #failed iron-icon{
                border-radius: 50%;
                padding: 2px;
                margin-right: 8px;
                box-sizing: border-box;
            }

            #success iron-icon{
                background: var(--app-status-color-ok);
            }

            #failed iron-icon{
                background: var(--app-status-color-nok);
            }

            .displayNotification {
                animation: displaySent 7.5s cubic-bezier(0.075, 0.82, 0.165, 1);
            }

            @keyframes displaySent {
                0% {transform: translate(100vw,-50%);}
                10% {transform: translate(0,-50%);}
                88% {transform: translate(0,-50%);}
                100% {transform: translate(100vw,-50%);}
            }

            @media screen and (max-width: 1030px) {
                #new-msg {
                    top: 64px !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: calc(100vh - 64px - 20px) !important;
                }
            }

            ht-spinner {
                height: 42px;
                width: 42px;
            }

            .messageSubject {
                width:100%;
            }

            .busySpinner {
                position:absolute;
                top:17px;
                display:inline-block;
                width:40px;
                height:40px;
                right:20px;
            }

            .bordered {
                border: 1px solid #ddd
            }

            paper-input-container {
                padding:0 10px 10px 10px;
            }

            .fleft {
                flex-grow: 1;
            }

            .textAlignCenter {
                text-align: center;
            }

            #loadingContent {
                margin-top:50px;
                font-size:1.1em;
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
                margin-top:0px;
            }

            #loadingContentContainer, #loadingContentContainerSmall {
                position:relative;
                width: 220px;
                /*min-height: 200px;*/
                background-color: #ffffff;
                padding:10px;
                border:1px solid var(--app-secondary-color);
                margin:40px auto 0 auto;
                text-align: center;
            }

            .modalDialog {
                height: 240px;
                width: 600px;
                padding:0px;
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

            .textAlignCenter {
                text-align: center;
            }

            .spinner {
                width:80px;
                height:80px;
            }

            .loadingIcon {
                margin-right:5px;
            }

            .loadingIcon.done {
                color: var(--app-secondary-color);
            }

            .mr5 {margin-right:5px}

            .smallIcon { width:16px; height:16px; }

            .dynamicDocContainer {
                margin-top:20px;
                border:1px dashed #999999;
                padding-top: 32px;
            }

            .clearFix {
                clear:both
            }

            .content {
                padding: 12px;
            }

            .modal-title {
                justify-content: flex-start;
            }

            .modal-title iron-icon{
                margin-right: 8px;
            }

            #recipientWithMultipleEHealthBoxesDialog {
                height:500px;
            }

            #multipleEHealthBoxesSelector {
                height:280px;
                overflow:auto;
                border:1px solid var(--app-background-color-darker)
            }

            .multipleEHealthBoxesSingleLine {
                display:flex;
                align-items:center;
                justify-content: flex-start;
            }

            #organizationQualitiesContainer {
                align-items:flex-start;
            }

            #organizationQualitiesContainer .cell {
                flex-wrap: wrap;
                width: calc(100% - 140px);
                margin-top:16px;
            }

            .organizationQualityCheckbox {
                --paper-checkbox-size: 14px;
                font-size:.85em;
                width:30%;
                margin:0 0 5px 0;

            }

        </style>



        <paper-dialog id="new-msg">
            <div class="content">



                <h2 class="modal-title mb0">[[localize('new_mes','New message',language)]] [[_forwardOrReplyAction]] <ht-spinner class="busySpinner" active="[[busySpinner]]" hidden="[[!busySpinner]]"></ht-spinner></h2>



                <div class="scrollbox">

                    <div class="horizontal mt10">
                        <div class="cell">
                            <div class="vertical">

                                <template is="dom-if" if="[[!_isMedex]]">
                                    <div class="cell">
                                    <div class="horizontal">
                                        <div class="modal-subtitle p-t-7 mw120">[[localize('recipient_s','Recipient(s)',language)]]:</div>
                                        <div class="cell">
                                            <vaadin-combo-box id="newMsg-To" label="[[localize('inputYourSearchQuery','What are you looking for ?',language)]]" filter="{{recipientFilter}}" filtered-items="[[filteredRecipientsList]]" item-label-path="displayName" allow-custom-value="" on-change="_addRecipient"><template>[[item.displayName]]</template></vaadin-combo-box>
                                            <vaadin-combo-box class="type-to m-l-20" id="type-To" items="[[recipientTypes]]" item-label-path="label" item-value-path="id" required="" error-message="This field is required" label="[[localize('sch_by', 'Search by', language)]]" selected-item="{{recipientType}}"></vaadin-combo-box>
                                        </div>
                                        <div class="horizontal recipients-list">
                                            <template is="dom-if" if="[[newMessage.recipients]]">
                                                <template is="dom-repeat" items="[[newMessage.recipients]]" as="singleRecipient" id="recipientsList">
                                                    <paper-item class="destination-tag" id="[[singleRecipient.displayName]]">
                                                        <div class="destination-type">[[singleRecipient.type]]</div>
                                                        <div class="one-line-menu list-title">[[singleRecipient.displayName]] [[_hyphenBeforeWhenExists(singleRecipient.ehealthBoxes.0.qualityHr)]]</div>
                                                        <paper-icon-button class="del-destination" icon="icons:delete" id="[[singleRecipient.displayName]]" on-tap="_removeRecipient" data-recipient-index$='[[index]]'></paper-icon-button>
                                                   </paper-item>
                                                </template>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                 <template is="dom-if" if="[[_recipientTypeIsOrg]]">
                                    <div class="cell">
                                        <div class="horizontal" id="organizationQualitiesContainer">
                                           <div class="modal-subtitle p-t-7 mw120">[[localize('organization','Organization',language)]]:</div>
                                           <div class="cell"><template is="dom-repeat" items="[[organizationQualities]]" as="item"><paper-checkbox checked="{{item.checked}}" class="organizationQualityCheckbox"> [[item.label]]</paper-checkbox></template></div>
                                        </div>
                                    </div>
                                </template>
                                <div class="cell">
                                    <div class="horizontal">
                                        <div class="modal-subtitle patLabel mw120">[[localize('pati','Patient',language)]]:</div>
                                        <div class="cell"><vaadin-combo-box id="linkedPatientComboxBox" label="[[localize('inputYourSearchQuery','What are you looking for ?',language)]]" filter="{{patientFilter}}" filtered-items="[[filteredPatientsList]]" item-label-path="displayName" allow-custom-value="" on-selected-item-changed="_setLinkedPatient"><template>[[item.displayName]]</template></vaadin-combo-box>
                                        </div>
                                    </div>
                                </div>
                                </template>

                                <div class="cell mt10">
                                    <div class="horizontal">
                                        <div class="modal-subtitle mw120">[[localize('options','Options',language)]]:</div>
                                        <div class="cell">
                                            <paper-checkbox checked="{{newMessage.important}}">[[localize('importantMessage','Important message',language)]]</paper-checkbox>
                                            <paper-checkbox checked="{{newMessage.useReceivedReceipt}}">[[localize('aknReception','Reception acknowledge',language)]]</paper-checkbox>
                                            <paper-checkbox checked="{{newMessage.useReadReceipt}}">[[localize('aknRead','Read acknowledge',language)]]</paper-checkbox>
                                            <paper-checkbox checked="{{newMessage.usePublicationReceipt}}">[[localize('aknPublication','Publication acknowledge',language)]]</paper-checkbox>
                                            <paper-checkbox checked="{{newMessage.encrypted}}">[[localize('encryptedMessage','Encrypted message',language)]]</paper-checkbox>
                                        </div>
                                    </div>
                                </div>
                                <div class="cell">
                                    <div class="horizontal">
                                        <div class="modal-subtitle mw120 p-t-18">[[localize('sub','Subject',language)]]:</div>
                                        <div class="cell"><paper-input id="newMsg-Subject" class="messageSubject" value="{{newMessage.document.title}}" placeholder="[[localize('writeYourSubject', 'Write your subject', language)]]"></paper-input></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <template is="dom-if" if="[[!_isMedex]]">
                        <div class="messageContainer m-t-30">
                            <div class="modal-subtitle">[[localize('msg','Message',language)]]:</div>
                            <div class="bordered"><paper-input-container alway-float-label="true"><iron-autogrow-textarea slot="input" class="paper-input-input" id="messageBodyText" placeholder="[[localize('writeYourMessage', 'Write your message', language)]]" value="{{newMessage.document.textContent}}"></iron-autogrow-textarea></paper-input-container></div>
                        </div>
                    </template>

                    <template is="dom-if" if="[[_hasAdditionalAnnexesFromPatDetail]]">
                        <div class="additionalAttachmentFromPatDetails m-t-50">
                            <div class="modal-subtitle">[[localize('annexFromPatDetail','Annex of patient file',language)]]:</div>
                            <template is="dom-repeat" items="[[_additionalAnnexesFromPatDetail]]" as="singleAnnex" id="additionalAnnexesFromPatDetail">

                                <paper-item class="destination-tag" data-document-id="[[singleAnnex.documentId]]">
                                    <div class="destination-type" data-document-id="[[singleAnnex.documentId]]">[[singleAnnex.fileExtensionUppercase]]</div>
                                    <div class="one-line-menu list-title" data-document-id="[[singleAnnex.documentId]]">[[singleAnnex.filename]] ([[singleAnnex.size]])</div>
                                    <paper-icon-button class="del-destination" icon="icons:delete" data-document-id="[[singleAnnex.documentId]]" on-tap="_removeAdditionalAnnexFromPatDetail"></paper-icon-button>
                                </paper-item>

                                <div class="clearFix"></div>
                                <div class="dynamicDocContainer">
                                    <dynamic-doc api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" patient="[[patient]]" document-id="[[singleAnnex.documentId]]" title="[[singleAnnex.title]]" preview="true" force-no-assignation="true"></dynamic-doc>
                                </div>

                            </template>
                        </div>
                    </template>
                    <div class="clearFix"></div>

                    <template is="dom-if" if="[[_hasAnnexesFromForward]]">
                        <div class="additionalAttachmentFromForward m-t-50">
                            <div class="modal-subtitle">[[localize('ehb.forwardedDocuments','Forwarded document(s)',language)]]:</div>

                            <template is="dom-repeat" items="[[_additionalAnnexesFromForward]]" as="singleAnnex" id="additionalAnnexesFromForward_attachmentsList">
                                <paper-item class="destination-tag" data-document-id="[[singleAnnex.documentId]]">
                                    <div class="destination-type" data-document-id="[[singleAnnex.documentId]]">[[singleAnnex.fileExtensionUppercase]]</div>
                                    <div class="one-line-menu list-title" data-document-id="[[singleAnnex.documentId]]">[[singleAnnex.filename]] ([[singleAnnex.size]])</div>
                                    <paper-icon-button class="del-destination" icon="icons:delete" data-document-id="[[singleAnnex.documentId]]" on-tap="_removeAnnexesFromForward"></paper-icon-button>
                                </paper-item>
                            </template>

                            <template is="dom-repeat" items="[[_additionalAnnexesFromForward]]" as="singleAnnex" id="additionalAnnexesFromForward_attachmentsPreview">
                                <div class="clearFix"></div>
                                <div class="dynamicDocContainer">
                                    <dynamic-doc api="[[api]]" i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" user="[[user]]" patient="[[patient]]" document-id="[[singleAnnex.documentId]]" title="[[singleAnnex.title]]" preview="true" force-no-assignation="true"></dynamic-doc>
                                </div>
                            </template>

                        </div>
                    </template>
                    <div class="clearFix"></div>

                    <div class="attachmentsContainer m-t-50">
                        <div class="modal-subtitle">[[localize('attachments','Attachments',language)]]:</div>
                        <vaadin-upload id="vaadinUploadNewMessage" class="m-t-8" no-auto="" files="{{files}}" target\$="[[api.host]]/document/{documentId}/attachment/multipart;jsessionid=[[api.sessionId]]" method="PUT" form-data-name="attachment" on-upload-success="_fileGotSuccessFullyUploaded" on-file-remove="_fileUploadRemove"></vaadin-upload>
                    </div>

                </div>



                <div class="buttons">
                    <div class="fleft"><paper-button class="button button--other" on-tap="_resetComponentData">[[localize('reset','Reset',language)]]</paper-button></div>
                    <div class="fright">
                        <paper-button class="button button--other" on-tap="_closeComponent"><iron-icon icon="icons:close"></iron-icon> &nbsp; [[localize('clo','Close',language)]]</paper-button>
                        <paper-button class="button button--save" on-tap="_doSendMessageWithEhBox"><iron-icon icon="check-circle"></iron-icon>[[localize('send','Send',language)]]</paper-button>
                    </div>
                </div>



                <template is="dom-if" if="[[_bodyOverlay]]">
<!--                    <div id="loadingContainer"></div>-->
                </template>
                <template is="dom-if" if="[[_isLoading]]">
                    <div id="loadingContainer">
                        <div id="loadingContentContainer">
                            <div style="max-width:80px; margin:0 auto"><ht-spinner class="spinner" alt="Loading..." active=""></ht-spinner></div>
                            <div id="loadingContent"></div>
                        </div>
                    </div>
                </template>

                <paper-dialog class="modalDialog" id="missingSubjectDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('missingSubject','You forgot to give your message a subject',language)]]</p>
                        <p class="">[[localize('pleaseFillInTheField',"Please provide with the required information",language)]].</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="modalDialog" id="notConnectedDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('youAreNotConnectedToehBox','You are not connected to e-Healthbox',language)]]</p>
                        <p class="">[[localize('yourMessageCantBeSent',"Your message can therefore not be sent",language)]].</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="modalDialog" id="missingRecipientDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('missingRecipient','You forgot to give your message a recipient',language)]]</p>
                        <p class="">[[localize('pleaseFillInTheField',"Your message can therefore not be sent",language)]].</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="modalDialog" id="missingContentDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('missingBodyOrAnnex','You forgot to give your message a content',language)]]</p>
                        <p class="">[[localize('pleaseFillInTheField',"Your message can therefore not be sent",language)]].</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="modalDialog" id="unableToLinkPatDocument" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter pt20 pb70 pl20 pr20">
                        <p class="fw700">[[localize('unableToLinkDocumentFromPatDetail','The document(s) you are trying to transfer failed',language)]].</p>
                        <p class="">[[localize('pleaseContactUs','Please contact us',language)]]:</p>
                        <p class="fw700"><iron-icon icon="communication:phone" class="mr5 smallIcon colorAppSecondaryColorDark"></iron-icon> <a href="tel:+3223192241" class="textDecorationNone">+32(0)2/319.22.41</a> - <iron-icon icon="icons:mail" class="mr5 smallIcon colorAppSecondaryColorDark"></iron-icon> <a href="mailto:support@topaz.care" class="textDecorationNone">support@topaz.care</a>.</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="modalDialog" id="errorDialog" no-cancel-on-outside-click="" no-cancel-on-esc-key="">
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter">
                        <p class="fw700">[[errorDialogLine1]]</p>
                        <p class="">[[errorDialogLine2]]</p>
                        <p class="">[[errorDialogLine3]]</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="modalDialog" id="recipientWithMultipleEHealthBoxesDialog" no-cancel-on-outside-click no-cancel-on-esc-key>

                    <h2 class="modal-title"><iron-icon icon="vaadin:clipboard-user"></iron-icon> [[localize('chooseRecipient','Choose recipient',language)]]</h2>
                    <div class="content pt10 pr20 pb10 pl20">
                        <p class="fw700 mb5">[[localize('recipientSeveralQualities','Your recipient has several qualities.',language)]]</p>
                        <p class="mb20 mt0">[[localize('recipientSeveralQualitiesChoose',"Please choose the relevant one to send this message to.",language)]]</p>
                        <div id="multipleEHealthBoxesSelector" class="mt20 p10">
                            <template is="dom-repeat" items="[[_recipientWithMultipleEHealthBoxes.ehealthBoxes]]" as="item" id="multipleEHealthBoxesSelectorDomRepeat">
                                <template is="dom-if" if="[[_notAlreadyInRecipients(_recipientWithMultipleEHealthBoxes,item)]]">
                                    <div class="multipleEHealthBoxesSingleLine">
                                        <paper-button class="button minw0 pt0 pr0 pb0 pl3" on-tap="_addRecipientEhBox" data-ehbox$="[[item]]"><iron-icon icon="add-circle"></iron-icon></paper-button>
                                        <div>[[item.qualityHr]] ([[item.typeHr]]: [[item.id]])</div>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>

                <paper-dialog class="modalDialog" id="recipientWithoutEHealthBoxDialog" no-cancel-on-outside-click no-cancel-on-esc-key>
                    <h2 class="modal-title"><iron-icon icon="icons:warning"></iron-icon> [[localize('warning','Warning',language)]]</h2>
                    <div class="content textaligncenter">
                        <p class="fw700">[[localize('ehBox_recipientHasNoEhbox_1','We encountered a problem with your recipient.',language)]]</p>
                        <p class="">[[localize('ehBox_recipientHasNoEhbox_2','Even though found in the address book, it does not have a valid e-Health box.',language)]]</p>
                        <p class="">[[localize('ehBox_recipientHasNoEhbox_3','Therefore, your message can not be sent to that recipient.',language)]]</p>
                    </div>
                    <div class="buttons">
                        <paper-button class="button button--other" on-tap="_closeDialogs"><iron-icon icon="icons:close"></iron-icon>[[localize('clo','Close',language)]]</paper-button>
                    </div>
                </paper-dialog>



            </div>
        </paper-dialog>



        <div id="success"><iron-icon icon="check"></iron-icon> [[localize('sen_succ','Success',language)]]</div>
        <div id="failed"><iron-icon icon="clear"></iron-icon> [[localize('sen_error','Error',language)]]</div>



        <ht-pat-outgoing-document id="outgoingDocument" api="[[api]]" i18n="[[i18n]]" user="[[user]]" patient="[[patient]]" language="[[language]]" resources="[[resources]]" on-refresh-patient="_refreshPatientAndServices"></ht-pat-outgoing-document>
`
    }

    static get is() {
        return 'ht-msg-new'
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
            credentials: {
                type: Object,
                noReset: true
            },
            newMessage: {
                type: Object,
                value: {
                    customMetas: {},
                    document: {
                        textContent: '',
                        title: '',
                        mimeType: 'text/plain',
                        filename: ''
                    },
                    important: false,
                    encrypted: false,
                    patientInss: '',
                    annex: [],
                    recipients: [],
                    useReceivedReceipt: false,
                    useReadReceipt: false,
                    usePublicationReceipt: false
                }
            },
            // 20191217 - Refactor
            //      1) First level of search = [EITHER] person [OR] Organization
            //      2) Second level of search = Only applicable when "Organization" -> Organization qualities

            // recipientTypes: {
            //     type: Array,
            //     value: [
            //         {id: "CBE", label: "BCE"},
            //         {id: "EHP", label: "EHP (eHealth Partner)"},
            //         {id: "SSIN", label: "INSS"},
            //         {id: "NIHII", label: "NIHII"},
            //         {id: "NIHII-HOSPITAL", label: "NIHII-HOSPITAL"},
            //         {id: "NIHII-PHARMACY", label: "NIHII-PHARMACY"}
            //     ],
            //     noReset: true
            // },
            recipientTypes: {
                type: Array,
                value: () => [
                    {id: "hcp", label: "Person"},
                    {id: "org", label: "Organization"}
                ],
                noReset: true
            },
            organizationQualities: {
                type: Array,
                value: () => [],
                noReset: true
            },
            filteredRecipientsList: {
                type: Array,
                value: () => []
            },
            filteredPatientsList: {
                type: Array,
                value: () => []
            },
            busySpinner: {
                type: Boolean,
                value: false
            },
            currentContact: {
                type: Object,
                value: {
                    subContacts: [],
                    services: []
                }
            },
            recipientReqIdx: {
                type: Number,
                value: 0
            },
            currentHcp: {
                type: Object,
                value: {},
                noReset: true
            },
            _forwardOrReplyAction: {
                type: String,
                value: ''
            },
            recipientFilter: {
                type: String,
                value: ""
            },
            errorDialogLine1: {
                type: String,
                value: ""
            },
            errorDialogLine2: {
                type: String,
                value: ""
            },
            errorDialogLine3: {
                type: String,
                value: ""
            },
            recipientType: {
                type: Object,
                value: {}
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
            files: {
                type: Array,
                value: () => []
            },
            uploadFileReqIdx: {
                type: Number,
                value: 0
            },
            _additionalAnnexesFromPatDetail: {
                type: Array,
                value: () => []
            },
            _additionalAnnexesFromForward: {
                type: Array,
                value: () => []
            },
            _hasAdditionalAnnexesFromPatDetail: {
                type: Boolean,
                value: false
            },
            _hasAnnexesFromForward: {
                type: Boolean,
                value: false
            },
            _dontTriggerUpdateSubjectUpOnPatientLinked: {
                type: Boolean,
                value: false
            },
            _assignRecipientValueWhenReplyingToMessage: {
                type: Boolean,
                value: false
            },
            patient: {
                type: Object,
                value: () => {
                }
            },
            _data: {
                type: Object,
                value: () => {
                }
            },
            medexData: {
                type: Object,
                value: () => {
                }
            },
            _isMedex: {
                type: Boolean,
                value: false
            },
            _recipientTypeIsOrg: {
                type: Boolean,
                value: false
            },
            _recipientWithMultipleEHealthBoxes: {
                type: Object,
                value: () => {
                }
            }
        }
    }

    static get observers() {
        return [
            '_userChanged(user)',
            '_loadRecipientTypesTranslations(language)',
            '_recipientsFilterChanged(recipientType, recipientFilter)',
            '_patientFilterChanged(patientFilter)',
            '_loadOrganizationQualitiesTranslations(language)',
            '_fileToBeUploadedChanged(files.*)',
        ]
    }

    constructor() {
        super()
    }

    ready() {
        super.ready()
    }

    _userChanged(changedUser) {
        if (_.trim(_.get(changedUser, "healthcarePartyId", "something")) === _.trim(_.get(this, "currentHcp.id", "else"))) return
        this.api && this.api.hcparty() && this.api.hcparty().getHealthcareParty(_.trim(_.get(changedUser, "healthcarePartyId", ""))).then(hcp => this.set("currentHcp", hcp)).catch(ignored => {
        })
    }

    _loadRecipientTypesTranslations() {

        // 20191217 - Refactor
        //      1) First level of search = [EITHER] person [OR] Organization
        //      2) Second level of search = Only applicable when "Organization" -> Organization qualities

        // let cbe = this.recipientTypes.find(i=>i.id==="CBE")
        // let ehp = this.recipientTypes.find(i=>i.id==="EHP")
        // let inss = this.recipientTypes.find(i=>i.id==="SSIN")
        // let nihii = this.recipientTypes.find(i=>i.id==="NIHII")
        // let nihiiHospital = this.recipientTypes.find(i=>i.id==="NIHII-HOSPITAL")
        // let nihiiPharmacy = this.recipientTypes.find(i=>i.id==="NIHII-PHARMACY")
        //
        // cbe.label = this.localize('cbe', 'CBE', this.language) + " / " + this.localize('name', 'Name', this.language)
        // ehp.label = "EHP (eHealth Partner) / " + this.localize('name', 'Name', this.language)
        // inss.label = this.localize('ssin', 'Registre national', this.language) + " / " + this.localize('name', 'Name', this.language)
        // nihii.label = this.localize('nihii', 'INAMI', this.language) + " / " + this.localize('name', 'Name', this.language)
        // nihiiHospital.label = this.localize('nihii', 'INAMI', this.language) + " " + this.localize('hospital', 'Hospital', this.language) + " / " + this.localize('name', 'Name', this.language)
        // nihiiPharmacy.label = this.localize('nihii', 'INAMI', this.language) + " " + this.localize('pharmacy', 'Pharmacy', this.language) + " / " + this.localize('name', 'Name', this.language)

        let hcp = this.recipientTypes.find(i => i.id === "hcp")
        let org = this.recipientTypes.find(i => i.id === "org")

        hcp.label = this.localize('person', 'Person', this.language)
        org.label = this.localize('organization', 'organization', this.language)

        // Assign default value to be a "person / hcp"
        this.set("recipientType", hcp)

    }

    _loadOrganizationQualitiesTranslations() {
        const defaultCheckedQualities = ["HOSPITAL", "PHARMACY", "INSTITUTION", "LABO"]
        this.set("organizationQualities", _.orderBy(_.compact(_.map(_.get(this, "resources." + this.language, {}), (v, k) => !!_.trim(k).toLowerCase().startsWith("ehboxquality_organization_") ? {
            id: _.trim(k).replace(/ehboxquality_organization_/ig, ""),
            label: v,
            checked: (defaultCheckedQualities.indexOf(_.trim(k).replace(/ehboxquality_organization_/ig, "")) > -1)
        } : false)), ["label"], ["asc"]))
    }

    _removeRecipient(e) {
        return !_.size(this, "newMessage.recipients", []) ? false : (this.newMessage.recipients.splice(parseInt(_.get(e, "target.dataset.recipientIndex", 0)), 1) && this.shadowRoot.querySelector('#recipientsList') && this.shadowRoot.querySelector('#recipientsList').render())
    }

    _closeComponent() {
        this.$['new-msg'] && this.$['new-msg'].close()
    }

    _patientFilterChanged(patientSearchValue) {

        if (_.trim(patientSearchValue).length < 3) {
            this.set("filteredPatientsList", [])
            return
        }
        const reqIdx = (this.patientReqIdx = (this.patientReqIdx || 0) + 1)

        const filter = {
            '$type': 'IntersectionFilter',
            'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
            'filters': _.compact(_.trim(patientSearchValue).split(/[ ,;:]+/).filter(w => w.length >= 2).map(word => /^[0-9]{11}$/.test(word) ? {
                '$type': 'PatientByHcPartyAndSsinFilter',
                'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
                'ssin': word
            } : /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? {
                '$type': 'PatientByHcPartyDateOfBirthFilter',
                'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
                'dateOfBirth': word.replace(/([0-3]?[0-9])[\/-](1[0-2]|0?[0-9])[\/-]((?:[1-2][89012])?[0-9][0-9])/g, (correspondance, p1, p2, p3) => (p3.length === 4 ? p3 : (p3 > 20) ? "19" + p3 : "20" + p3) + (p2.length === 2 ? p2 : "0" + p2) + (p1.length === 2 ? p1 : "0" + p1))
            } : /^[0-9]{3}[0-9]+$/.test(word) ? {
                '$type': 'UnionFilter',
                'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
                'filters': [
                    {
                        '$type': 'PatientByHcPartyDateOfBirthBetweenFilter',
                        'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
                        'minDateOfBirth': word.length >= 8 ? Number(word.substr(0, 8)) : word.length >= 6 ? Number(word.substr(0, 6) + '00') : Number(word.substr(0, 4) + '0000'),
                        'maxDateOfBirth': word.length >= 8 ? Number(word.substr(0, 8)) : word.length >= 6 ? Number(word.substr(0, 6) + '99') : Number(word.substr(0, 4) + '9999')
                    },
                    {
                        '$type': 'PatientByHcPartyAndSsinFilter',
                        'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
                        'ssin': word
                    },
                    {
                        '$type': 'PatientByHcPartyAndExternalIdFilter',
                        'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
                        'externalId': word
                    }
                ]
            } : /^[0-9]+$/.test(word) ? {
                '$type': 'PatientByHcPartyAndSsinFilter',
                'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
                'ssin': word
            } : word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '').length >= 2 ? {
                '$type': 'PatientByHcPartyNameContainsFuzzyFilter',
                'healthcarePartyId': _.get(this, "currentHcp.parentId", false) || _.get(this, "user.healthcarePartyId", false),
                'searchString': word
            } : null))
        }

        const predicates = _.trim(patientSearchValue).split(/[ ,;:]+/).filter(w => w.length >= 2).map(word =>
            /^[0-9]{11}$/.test(word) ? (() => true) :
                /^[0-3]?[0-9][\/-](1[0-2]|0?[0-9])[\/-]([1-2][89012])?[0-9][0-9]$/.test(word) ? (() => true) :
                    /^[0-9]{3}[0-9]+$/.test(word) ? ((p) => (p.dateOfBirth && (`${p.dateOfBirth}`.includes(word))) || (p.externalId && p.externalId.includes(word))) :
                        (p => {
                            const w = word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '')
                            return w.length < 2 ?
                                true :
                                (p.firstName && p.firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '').includes(w)) ||
                                (p.lastName && p.lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z]/g, '').includes(w))
                        })
        )

        setTimeout(() => {
            if (reqIdx !== this.patientReqIdx) return
            this.set('busySpinner', true)
            this.api.getRowsUsingPagination((key, docId, pageSize) =>
                    this.api.patient().filterByWithUser(this.user, key, docId, pageSize || 50, 0, "lastName", false, {filter: _.assign({}, filter, {filters: filter.filters})})
                        .then(pl => {
                            const filteredRows = pl.rows.filter(p => predicates.every(f => f(p)))
                            return {
                                rows: filteredRows,
                                nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                                nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                                done: !pl.nextKeyPair
                            }
                        })
                        .catch(() => {
                            return Promise.resolve()
                        }),
                p => (!!_.get(p, "active", false) && (!!_.trim(_.get(p, "dateOfBirth", "")) || !!_.trim(_.get(p, "ssin", "")))), 0, 50, []
            )
                .then(searchResults => {
                    if (reqIdx === this.patientReqIdx) {
                        this.set("filteredPatientsList", _
                            .chain(searchResults)
                            .map(singlePat => _.assign({
                                displayName: _.compact([
                                    _.map(_.trim(_.get(singlePat, "lastName", "")).split(" "), i => _.capitalize(i)).join(" "),
                                    _.map(_.trim(_.get(singlePat, "firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                                    (!!_.trim(_.get(singlePat, "ssin", "")) ? "(" + this.localize('ssinPatVerbose', 'Numéro de registre national', this.language) + ": " + this.api.formatSsinNumber(_.trim(_.get(singlePat, "ssin", ""))) + ")" : ""),
                                    (!_.trim(_.get(singlePat, "ssin", "")) && !!_.trim(_.get(singlePat, "dateOfBirth", "")) ? "(" + this.localize('birthDate', 'Birthdate', this.language) + ": " + moment(_.trim(_.get(singlePat, "dateOfBirth", 0)), "YYYYMMDD").format('DD/MM/YYYY') + ")" : "")
                                ]).join(" ")
                            }, singlePat))
                            .orderBy(['displayName', 'ssin', 'dateOfBirth'], ['asc', 'asc', 'asc'])
                            .uniqBy('id')
                            .value()
                        )
                    }
                })
                .catch(e => {
                    console.log("ERROR with _patientFilterChanged: ", e)
                })
                .finally(() => this.set('busySpinner', false))
        }, 300)

    }

    _setLinkedPatient(e) {

        const linkedPatientComboxBox = this.shadowRoot.querySelector("#linkedPatientComboxBox")

        setTimeout(() => {

            // Because we allow for custom values, it could be we have no selected item but still a value being passed
            const linkedPatientComboxBoxSelectedItem = _.get(linkedPatientComboxBox, "selectedItem", null)
            const linkedPatientComboxBoxValue = _.get(linkedPatientComboxBox, "value", null)

            // Valid pat, valid ssin, assign straight
            if (_.trim(_.get(linkedPatientComboxBoxSelectedItem, "ssin", ""))) {
                this.set("newMessage.patientInss", _.trim(_.get(linkedPatientComboxBoxSelectedItem, "ssin", "")))
                if (!this._dontTriggerUpdateSubjectUpOnPatientLinked) this.set("newMessage.document.title", _.compact([_.trim(_.get(this, "newMessage.document.title")), _.trim(_.get(linkedPatientComboxBoxSelectedItem, "displayName", ""))]).join(" - "))
                return
            }

            // At this stage, we don't have a valid inss anymore, unset var & update subject with relevant info
            this.set("newMessage.patientInss", null)
            return _.trim(_.get(linkedPatientComboxBoxSelectedItem, "id", "")) ?
                this.set("newMessage.document.title", _.compact([_.trim(_.get(this, "newMessage.document.title")), _.trim(_.get(linkedPatientComboxBoxSelectedItem, "displayName", ""))]).join(" - ")) :
                this.set("newMessage.document.title", _.compact([_.trim(_.get(this, "newMessage.document.title")), _.trim(linkedPatientComboxBoxValue)]).join(" - "))

        }, 100)

    }


    _fileToBeUploadedChanged(filesToBeUploaded) {

        const reqIdx = (this.uploadFileReqIdx = (this.uploadFileReqIdx || 0) + 1)
        const haveFilesToUploaded = !!_.size(filesToBeUploaded) && !!_.size(_.get(this, "files", []))

        return !haveFilesToUploaded ? false : setTimeout(() => {

            if (reqIdx !== this.uploadFileReqIdx || !haveFilesToUploaded) return
            const vaadinUpload = this.shadowRoot.querySelector('#vaadinUploadNewMessage') || null
            const filesToBeUploaded = _.clone(this.files)

            Promise.all(_.filter(filesToBeUploaded, singleFileToBeUploaded => !singleFileToBeUploaded.attached).map(singleFileToBeUploaded => this.api.document().newInstance(this.user, null, {
                    documentType: 'result',
                    mainUti: this.api.document().uti(singleFileToBeUploaded.type),
                    name: singleFileToBeUploaded.name
                })
                    .then(documentInstance => this.api.document().createDocument(documentInstance))
                    .then(createdDocument => {
                        singleFileToBeUploaded.attached = true
                        singleFileToBeUploaded.doc = createdDocument
                        singleFileToBeUploaded.uploadTarget = (singleFileToBeUploaded.uploadTarget || vaadinUpload.target).replace(/\{documentId\}/, createdDocument.id)
                        return singleFileToBeUploaded
                    })
            ))
                .then(filesToBeUploaded => {
                    filesToBeUploaded.map(singleFileToBeUploaded => {
                        const fileReaderInstance = new FileReader()
                        fileReaderInstance.onload = function (se) {
                            let fileByteArray = []
                            new Uint8Array(se.target.result).forEach(int8 => fileByteArray.push(int8))
                            this.push('newMessage.annex', [{
                                content: fileByteArray,
                                filename: _.trim(_.get(singleFileToBeUploaded, "name", "document.txt")),
                                mimeType: _.trim(_.get(singleFileToBeUploaded, "type", "")) ? _.trim(_.get(singleFileToBeUploaded, "type", "")) : "text/plain",
                                title: _.trim(_.get(singleFileToBeUploaded, "name", "document.txt")),
                                size: _.get(singleFileToBeUploaded, "size", 0) > 1024 ? (_.get(singleFileToBeUploaded, "size", 0) / 1024).toFixed(2) + " Ko" : _.get(singleFileToBeUploaded, "size", 0) + " o",
                                documentId: _.trim(_.get(singleFileToBeUploaded, "doc.id", ""))
                            }])
                        }.bind(this)
                        fileReaderInstance.readAsArrayBuffer(singleFileToBeUploaded)
                    })
                    !!_.size(filesToBeUploaded) && vaadinUpload.uploadFiles(filesToBeUploaded)
                })

        }, 300)

    }

    _fileGotSuccessFullyUploaded(e) {

        const uploadedFileObject = _.get(e, "detail.file", false)
        const uploadedFileDocumentId = _.trim(_.get(uploadedFileObject, "doc.id", ""))
        const vaadinUpload = this.shadowRoot.querySelector('#vaadinUploadNewMessage')

        if (!_.size(e.detail.file) || typeof _.get(e, "preventDefault", false) !== 'function' || !uploadedFileObject || !uploadedFileDocumentId || !vaadinUpload) return
        e.preventDefault()

        let currentSubContacts = _.get(this, "currentContact.subContacts", []).find(sbc => (sbc.status || 0) & 64)
        if (!_.size(currentSubContacts)) {
            currentSubContacts = {status: 64, services: []}
            this.push("currentContact.subContacts", currentSubContacts)
        }

        const svc = this.api.contact().service().newInstance(this.user, {
            content: _.fromPairs([[this.language, {
                documentId: uploadedFileDocumentId,
                stringValue: _.trim(_.get(uploadedFileObject, "name", "document.txt"))
            }]]), label: 'document'
        })
        this.push("currentContact.services", svc)

        currentSubContacts.services.push({serviceId: svc.id})
        if (!vaadinUpload.files.find(f => !f.complete && !f.error)) this.saveCurrentContact()

    }

    _closeDialogs() {
        this.set("_bodyOverlay", false)
        _.map(this.shadowRoot.querySelectorAll('.modalDialog'), i => i && typeof i.close === "function" && i.close())
        this.set("_recipientWithMultipleEHealthBoxes", {})
    }

    _loadingStatusChanged() {
        if (!this._isLoading) this._resetLoadingMessage()
    }

    _resetLoadingMessage() {
        this._loadingMessages = []
    }

    _setLoadingMessage(messageData) {
        setTimeout(() => {
            if (messageData.updateLastMessage) this._loadingMessages.pop()
            this._loadingMessages.push(messageData)
            let loadingContentTarget = this.shadowRoot.querySelectorAll('#loadingContent')[0]
            if (loadingContentTarget) {
                loadingContentTarget.innerHTML = ''
                _.each(this._loadingMessages, (v) => {
                    loadingContentTarget.innerHTML += "<p><iron-icon icon='" + v.icon + "' class='" + (v.done ? "loadingIcon done" : "loadingIcon") + "'></iron-icon>" + v.message + "</p>"
                })
            }
        }, 100)
    }

    _showSendingMessagePreload() {
        this._resetLoadingMessage()
        this.set('_isLoading', true)
        this._setLoadingMessage({message: this.localize('ehb.sendingMessage', this.language), icon: "arrow-forward"})
    }

    _arrayBufferToByteArray(arrayBuffer) {
        let fileByteArray = []
        new Uint8Array(arrayBuffer).forEach(int8 => fileByteArray.push(int8))
        return fileByteArray
    }

    _fileUploadRemove(e) {
        const fileDocumentId = _.trim(_.get(e, "detail.file.doc.id"))
        const foundAnnexToRemove = _.find(_.get(this, "newMessage.annex", []), i => e.detail.file.doc.id === _.trim(_.get(i, "[0].documentId", "")))
        return !_.size(_.get(this, "newMessage.annex", [])) || !_.trim(fileDocumentId) || !_.size(foundAnnexToRemove) ? false : _.remove(this.newMessage.annex, i => i === foundAnnexToRemove)
    }

    _removeAdditionalAnnexFromPatDetail(e) {

        // To improve: could be several attachments from pat (considering we only have one at the moment) -> cfr method _removeAnnexesFromForward
        this.set("_additionalAnnexesFromPatDetail", [])
        this.set("_hasAdditionalAnnexesFromPatDetail", false)
        this.shadowRoot.querySelector('#additionalAnnexesFromPatDetail') && this.shadowRoot.querySelector('#additionalAnnexesFromPatDetail').render()

    }

    _removeAnnexesFromForward(e) {

        const documentIdToRemove = _.trim(_.get(_.filter(_.get(e, "path", []), nodePath => !!_.trim(_.get(nodePath, "dataDocumentId", ""))), "[0].dataDocumentId", ""))
        if (!_.trim(documentIdToRemove)) return

        this.set("_additionalAnnexesFromForward", _.compact(_.remove(_.cloneDeep(_.get(this, "_additionalAnnexesFromForward", [])), i => documentIdToRemove !== _.trim(_.get(i, "documentId", "")))))
        this.set("_hasAnnexesFromForward", !!_.size(_.get(this, "_additionalAnnexesFromForward", [])))

        this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsList') && this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsList').render()
        this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsPreview') && this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsPreview').render()

    }

    saveCurrentContact() {
        this.currentContact.id = !_.trim(_.get(this, "currentContact.id", "")) ? this.api.crypto().randomUuid() : this.currentContact.id
        return (!!_.trim(_.get(this, "currentContact.rev", "")) ? this.api.contact().modifyContactWithUser(this.user, this.currentContact) : this.api.contact().createContactWithUser(this.user, this.currentContact)).then(c => this.api.register(c, 'contact')).then(c => (this.currentContact.rev = c.rev) && c)
    }

    _getPatientDataBySsin(ssin) {
        return !_.trim(ssin) ?
            Promise.resolve() :
            this.api.patient().findByNameBirthSsinAutoWithUser(_.get(this, "user", {}), _.trim(_.get(this, "user.healthcarePartyId", null)), _.trim(ssin), null, null, 100)
                .then(foundPatientsBasedOnSsin => _
                    .chain(_.get(foundPatientsBasedOnSsin, "rows", []))
                    .filter(i => !!_.get(i, "active", false) && _.trim(_.get(i, "ssin", "")) === _.trim(ssin))
                    .orderBy(['modified'], ['desc'])
                    .head()
                    .value()
                )
                .catch(e => {
                    console.log("ERROR with findByNameBirthSsinAutoWithUser: ", e)
                    return Promise.resolve()
                })
    }

    _debugMessage() {

        console.log(this.newMessage)
        console.log(this._additionalAnnexesFromForward)
        console.log(this._additionalAnnexesFromPatDetail)
        return

    }

    _recipientsFilterChanged(recipientType, recipientFilter) {

        // For organization qualities
        this.set("_recipientTypeIsOrg", _.trim(_.get(recipientType, "id", "hcp")) === "org")
        if (_.trim(recipientFilter).length < 3 || !_.get(this, "api.keystoreId", false) || !_.get(this, "api.tokenId", false) || !_.get(this, "api.credentials.ehpassword", false)) {
            this.set("filteredRecipientsList", [])
            return
        }
        const reqIdx = (this.recipientReqIdx = (this.recipientReqIdx || 0) + 1)

        setTimeout(() => {

            if (reqIdx !== this.recipientReqIdx) return
            this.set('_isLoading', true)

            const newMsgTo = this.shadowRoot.querySelector('#newMsg-To') || false
            const numericSearchQuery = _.trim(_.trim(recipientFilter).replace(/([^\d]*)/gi, ''))
            const patternsValidation = {
                heightDigits: /^([0-9]){8}$/i,
                tenDigits: /^([0-9]){10}$/i,
                elevenDigits: /^([0-9]){11}$/i
            }

            const defaultPersonQualities = ["PHYSICIAN", "NURSE", "DOCTOR", "PHYSIOTHERAPIST"]

            const isValidCbe = !!patternsValidation.tenDigits.test(numericSearchQuery)
            const isValidEhp = !!patternsValidation.tenDigits.test(numericSearchQuery)
            const isValidSsin = !!patternsValidation.elevenDigits.test(numericSearchQuery) && this.api.patient().isValidSsin(numericSearchQuery)
            const isValidNihii = (!!patternsValidation.heightDigits.test(numericSearchQuery) || !!patternsValidation.elevenDigits.test(numericSearchQuery)) /* && this.api.patient().checkInami(numericSearchQuery) */

            const getProms = _.compact([
                (!this._recipientTypeIsOrg || !isValidCbe) ? false : this.api.fhc().Addressbookcontroller().getOrgByCbeUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, numericSearchQuery).catch(() => Promise.resolve([])),
                (!this._recipientTypeIsOrg || !isValidEhp) ? false : this.api.fhc().Addressbookcontroller().getOrgByEhpUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, numericSearchQuery).catch(() => Promise.resolve([])),
                (!this._recipientTypeIsOrg || !isValidNihii) ? false : this.api.fhc().Addressbookcontroller().getOrgByNihiiUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, numericSearchQuery).catch(() => Promise.resolve([])),
                (!!this._recipientTypeIsOrg || !isValidSsin) ? false : this.api.fhc().Addressbookcontroller().getHcpBySsinUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, numericSearchQuery).catch(() => Promise.resolve([])),
                (!!this._recipientTypeIsOrg || !isValidNihii) ? false : this.api.fhc().Addressbookcontroller().getHcpByNihiiUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, numericSearchQuery).catch(() => Promise.resolve([]))
            ])

            const searchProms = _.compact(_.concat(
                // [(!!this._recipientTypeIsOrg || !!isValidCbe || !!isValidEhp || !!isValidNihii || !!isValidSsin) ? false : this.api.fhc().Addressbookcontroller().searchHcpUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, _.trim(recipientFilter) + '*').catch(()=>Promise.resolve([]))],
                (!!this._recipientTypeIsOrg || !!isValidCbe || !!isValidEhp || !!isValidNihii || !!isValidSsin) ? [] : _.map(defaultPersonQualities, it => this.api.fhc().Addressbookcontroller().searchHcpUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, _.trim(recipientFilter) + '*', "", it).catch(() => Promise.resolve([]))),
                (!this._recipientTypeIsOrg || !!isValidCbe || !!isValidEhp || !!isValidNihii || !!isValidSsin) ? [] : _.map(_.filter(this.organizationQualities, "checked"), it => this.api.fhc().Addressbookcontroller().searchOrgUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, _.trim(recipientFilter) + '*', _.trim(_.get(it, "id"))).catch(() => Promise.resolve([])))
            ))

            Promise.all(_.concat(getProms, searchProms))
                .then(searchResults => {
                    if (reqIdx === this.recipientReqIdx) {
                        this.set("filteredRecipientsList", _
                            .chain(searchResults)
                            .flatMap()
                            .filter(i => !!_.trim(_.get(i, 'nihii', "")) || !!_.trim(_.get(i, 'ssin', "")) || !!_.trim(_.get(i, 'ehp', "")) || !!_.trim(_.get(i, 'cbe', "")))
                            // 20191215 - Can't filter here anymore as we don't have qualities yet, filter when adding in method this._addRecipient()
                            // .filter( singleSearchResult => { return (
                            //     ( !!_.get(singleSearchResult, "ehp", false) && _.uniq(_.compact(_.map(_.get(this,"newMessage.recipients",[]), i=>_.trim(i.ehp)))).indexOf(_.trim(_.get(singleSearchResult, "ehp", ""))) === -1 ) ||
                            //     ( !!_.get(singleSearchResult, "ssin", false) && _.uniq(_.compact(_.map(_.get(this,"newMessage.recipients",[]), i=>_.trim(i.ssin)))).indexOf(_.trim(_.get(singleSearchResult, "ssin", ""))) === -1 ) ||
                            //     ( !!_.get(singleSearchResult, "cbe", false) && _.uniq(_.compact(_.map(_.get(this,"newMessage.recipients",[]), i=>_.trim(i.cbe)))).indexOf(_.trim(_.get(singleSearchResult, "cbe", ""))) === -1 ) ||
                            //     ( !!_.get(singleSearchResult, "nihii", false) && _.uniq(_.compact(_.map(_.get(this,"newMessage.recipients",[]), i=>_.trim(i.nihii)))).indexOf(_.trim(_.get(singleSearchResult, "nihii", ""))) === -1 )
                            // )})

                            .map(singleRecipient => _.assign({
                                displayName: _.compact([
                                    _.map(_.trim(_.get(singleRecipient, "lastName", "")).split(" "), i => _.capitalize(i)).join(" "),
                                    _.map(_.trim(_.get(singleRecipient, "firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                                    ((!_.trim(_.get(singleRecipient, "lastName", "")) && !_.trim(_.get(singleRecipient, "firstName", ""))) ? _.map(_.trim(_.get(singleRecipient, "name", "")).split(" "), i => _.capitalize(i)).join(" ") : ""),
                                    (!!_.trim(_.get(singleRecipient, "nihii", "")) ? "(" + this.localize('nihii', 'INAMI', this.language) + ": " + this.api.formatInamiNumber(_.trim(_.get(singleRecipient, "nihii", ""))) + ")" : ""),
                                    (!!_.trim(_.get(singleRecipient, "ssin", "")) ? "(" + this.localize('ssin', 'Registre national', this.language) + ": " + this.api.formatSsinNumber(_.trim(_.get(singleRecipient, "ssin", ""))) + ")" : ""),
                                    (!!_.trim(_.get(singleRecipient, "ehp", "")) ? "(EHP: " + _.trim(_.get(singleRecipient, "ehp", "")) + ")" : ""),
                                    (!!_.trim(_.get(singleRecipient, "cbe", "")) ? "(BCE: " + _.trim(_.get(singleRecipient, "cbe", "")) + ")" : "")
                                ]).join(" ")
                            }, singleRecipient))
                            .orderBy(['displayName', 'nihii', 'ssin', 'ehp', 'cbe'], ['asc', 'asc', 'asc', 'asc', 'asc'])
                            .value()
                        )
                        if (!!_.get(this, "_assignRecipientValueWhenReplyingToMessage") && _.size(_.get(this, "filteredRecipientsList[0]", {})) && !!newMsgTo) {
                            this.set("_assignRecipientValueWhenReplyingToMessage", false)
                            newMsgTo.selectedItem = _.get(this, "filteredRecipientsList[0]", {})
                            setTimeout(() => {
                                this._addRecipient()
                            }, 100)
                            setTimeout(() => {
                                newMsgTo.close()
                            }, 200)
                        }

                    }
                })
                .catch(e => {
                    console.log("ERROR with _recipientsFilterChanged: ", e)
                })
                // .finally(() => this.set('busySpinner', false))
                .finally(() => this.set('_isLoading', false))
        }, 300)
    }

    _refreshPatientAndServices() {
        this.dispatchEvent(new CustomEvent('refresh-patient', {composed: true, bubbles: true, detail: {}}))
    }

    _getMedexKhmerTemplate(data) {

        let khmerTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<kmehrmessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.ehealth.fgov.be/standards/kmehr/schema/v1" xsi:schemaLocation="http://www.ehealth.fgov.be/standards/kmehr/schema/v1 kmehr_elements.xsd">
<header>
<standard>
  <cd S="CD-STANDARD" SV="1.8">20121001</cd>
</standard>
<id S="ID-KMEHR" SV="1.0">{{currentHcp.nihii}}.{{nowMs}}</id>
<date>{{nowYYYYMMDD}}</date>
<time>{{nowHHMMSS}}</time>
<sender>
  <hcparty>
      <id S="LOCAL" SV="[AIV]{version}[/AIV]" SL="Topaz">Topaz-v[AIV]{version}[/AIV]</id>
      <cd S="CD-HCPARTY" SV="1.0">application</cd>
      <name>Topaz</name>
  </hcparty>
  <hcparty>
      <id S="ID-HCPARTY" SV="1.0">{{currentHcp.nihii}}</id>
      <id S="INSS" SV="1.0">{{currentHcp.ssin}}</id>
      <cd S="CD-HCPARTY" SV="1.6">persphysician</cd>
      <firstname>{{currentHcp.firstName}}</firstname>
      <familyname>{{currentHcp.lastName}}</familyname>
  </hcparty>
</sender>
<recipient>
  <hcparty>
      <cd S="CD-HCPARTY" SV="1.6">application</cd>
      <name>medex</name>
  </hcparty>
</recipient>
</header>
<folder>
<id S="ID-KMEHR" SV="1.0">1</id>
<patient>
  <id S="ID-PATIENT" SV="1.0">{{currentPatient.ssin}}</id>
  <firstname>{{currentPatient.firstName}}</firstname>
  <familyname>{{currentPatient.lastName}}</familyname>
  <birthdate>
      <date>{{currentPatient.dateOfBirthHyphenSplitted}}</date>
  </birthdate>
  <sex>
      <cd SV="1.0" S="CD-SEX">{{currentPatient.gender}}</cd>
  </sex>
  <usuallanguage>fr</usuallanguage>
</patient>
<transaction>
  <id S="ID-KMEHR" SV="1.0">1</id>
  <cd S="CD-TRANSACTION" SV="1.5">notification</cd>
  <cd S="CD-TRANSACTION-TYPE" SV="1.1">{{eMediattest.khmerData.incapacityOrIncapacityExtension}}</cd>
  <date>{{eMediattest.khmerData.certificateDate}}</date>
  <time>{{eMediattest.khmerData.certificateTime}}</time>
  <author>
      <hcparty>
					<id S="ID-HCPARTY" SV="1.0">{{currentHcp.nihii}}</id>
					<id S="INSS" SV="1.0">{{currentHcp.ssin}}</id>
					<cd S="CD-HCPARTY" SV="1.6">persphysician</cd>
					<firstname>{{currentHcp.firstName}}</firstname>
					<familyname>{{currentHcp.lastName}}</familyname>
      </hcparty>
  </author>
  <iscomplete>true</iscomplete>
  <isvalidated>true</isvalidated>
  <item>
      <id S="ID-KMEHR" SV="1.0">1</id>
      <cd S="CD-ITEM" SV="1.6">incapacity</cd>
      <content>
					<incapacity>
              <cd S="CD-INCAPACITY" SV="1.1">work</cd>
              <incapacityreason>
                  <cd S="CD-INCAPACITYREASON" SV="1.1">{{eMediattest.khmerData.incapacityReason}}</cd>
              </incapacityreason>
              <outofhomeallowed>{{eMediattest.khmerData.outOfHomeAllowed}}</outofhomeallowed>
					</incapacity>
      </content>`

        if (!!_.trim(_.get(data, "eMediattest.khmerData.occuredOn", ""))) khmerTemplate += `
      <content>
          <date>{{eMediattest.khmerData.occuredOn}}</date>
      </content>`

        khmerTemplate += `
      <beginmoment>
					<date>{{eMediattest.khmerData.incapacityBegin}}</date>
      </beginmoment>
      <endmoment>
					<date>{{eMediattest.khmerData.incapacityEnd}}</date>
      </endmoment>
  </item>
  <item>
      <id S="ID-KMEHR" SV="1.0">2</id>
      <cd S="CD-ITEM" SV="1.6">diagnosis</cd>
      <content>
					<cd S="ICD" SV="10">{{eMediattest.diagnosticData.icd}}</cd>
					<cd S="ICPC" SV="2">{{eMediattest.diagnosticData.icpc}}</cd>
      </content>
      <content>
					<text L="{{language}}">{{eMediattest.diagnosticData.labelHr}}</text>
      </content>
  </item>
</transaction>
</folder>
</kmehrmessage>`

        return mustache.render(khmerTemplate, data)

    }

    _saveDocumentAsService(inputConfig) {

        const promResolve = Promise.resolve()

        const svc = this.api.contact().service().newInstance(_.get(this, "user", {}), {
            content: _.fromPairs([[this.language, {
                documentId: inputConfig.documentId,
                stringValue: inputConfig.stringValue
            }]]),
            label: _.trim(_.get(inputConfig, "messageObject.subject", "")),
            contactId: inputConfig.contactId,
            tags: [
                {type: "isMedex", code: "true"},
                {type: "isKhmer", code: "true"},
                {
                    type: "originalContactId",
                    code: _.trim(_.get(inputConfig, "messageObject.metas.originalContactId", ""))
                },
                {type: "formId", code: _.trim(_.get(inputConfig, "messageObject.metas.formId", ""))},
                {type: "subFormId", code: _.trim(_.get(inputConfig, "messageObject.metas.subFormId", ""))},
                {type: "outgoingDocument", code: _.trim(_.get(inputConfig, "messageObject.subject", ""))},
                {type: 'CD-TRANSACTION', code: _.trim(_.get(inputConfig, "cdTransactionCode", ""))},
            ]
        })

        if (false === _.get(this, "_data.currentContact.services", false)) this._data.currentContact.services = []
        if (false === _.get(this, "_data.currentContact.subContacts", false)) this._data.currentContact.subContacts = []

        this._data.currentContact.services.push(svc)
        this._data.currentContact.subContacts.push({
            status: 64,
            services: [{serviceId: svc.id}],
            tags: svc.tags,
        })

        return promResolve
            .then(() => !!_.trim(_.get(this, "_data.currentContact.rev", "")) ?
                this.api.contact().modifyContactWithUser(_.get(this, "user", {}), _.get(this, "_data.currentContact", {})) :
                this.api.contact().createContactWithUser(_.get(this, "user", {}), _.get(this, "_data.currentContact", {}))
            )
            .then(c => this.api.register(c, 'contact')).then(c => (this._data.currentContact.rev = c.rev) && c)
            .then(() => this.dispatchEvent(new CustomEvent('refresh-patient', {
                composed: true,
                bubbles: true,
                detail: {}
            })))

    }

    _saveMedexKhmerIttToPatFile() {

        const messageObject = {
            transportGuid: "MEDEX:OUT:KHMER",
            recipients: [_.trim(_.get(this, "_data.contactHcp.id", ""))],
            metas: {
                filename: _.trim(_.get(this, "_data.pdf.filename", "")).replace(".pdf", ".xml"),
                hcpId: _.trim(_.get(this, "_data.contactHcp.id", "")),
                contactId: _.trim(_.get(this, "_data.currentContact.id", "")),
                originalContactId: this._data.eMediattestParentFormDp.form().contactId,
                formId: _.trim(_.get(_.get(this, "_data.eMediattestParentFormDp.form")(), "id", "")),
                subFormId: _.trim(_.get(_.get(this, "_data.eMediattestSubFormDp.form")(), "id", "")),
            },
            toAddresses: [_.trim(_.get(this, "_data.contactHcp.id", ""))],
            subject: "[KHMER] " + this.localize("medicalCertificate", "Medical certificate", this.language) + " Medex",
        }

        return this.api.message().newInstanceWithPatient(_.get(this, "user", {}), _.get(this, "_data.currentPatient", {}))
            .then(messageInstance => this.api.message().createMessage(_.merge(messageInstance, messageObject)))
            .then(createdMessage => this.api.document().newInstance(_.get(this, "user", {}), createdMessage, {
                documentType: 'report',
                mainUti: this.api.document().uti("application/xml"),
                name: _.get(messageObject, "metas.filename"),
                tags: [
                    {type: "medex", code: "true"},
                    {type: "khmer", code: "true"},
                    {type: "formId", code: _.trim(_.get(messageObject, "metas.formId", ""))},
                    {type: "subFormId", code: _.trim(_.get(messageObject, "metas.subFormId", ""))}
                ]
            }).then(documentInstance => ([createdMessage, documentInstance])))
            .then(([createdMessage, documentInstance]) => this.api.document().createDocument(documentInstance).then(createdDocument => ([createdMessage, createdDocument])))
            .then(([createdMessage, createdDocument]) => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("encrypt", _.get(this, "user", {}), createdDocument, this.api.crypto().utils.text2ua(_.get(this, "_data.eMediattest.khmerContent", ""))).then(encryptedFileContent => [createdMessage, createdDocument, encryptedFileContent]))
            .then(([createdMessage, createdDocument, encryptedFileContent]) => this.api.document().setAttachment(_.get(createdDocument, "id"), null, encryptedFileContent).then(() => ([createdMessage, createdDocument])))
            .then(([createdMessage, createdDocument]) => this._saveDocumentAsService({
                documentId: _.trim(_.get(createdDocument, "id", "")),
                stringValue: _.trim(_.get(messageObject, "subject", "")),
                contactId: _.trim(_.get(messageObject, "metas.contactId", "")),
                originalContactId: _.trim(_.get(messageObject, "metas.originalContactId", "")),
                messageObject: messageObject,
                cdTransactionCode: "medical-certificate",
            }).then(() => ([createdMessage, createdDocument])))
            .catch(e => {
                console.log("[ERROR] _saveMedexKhmerIttToPatFile", e)
                return Promise.resolve()
            })

    }

    open(componentOpenParameters) {

        this._resetComponentData()

        const dataFromPatDetail = _.get(componentOpenParameters, "dataFromPatDetail", false)
        const linkedPatientComboxBox = this.shadowRoot.querySelector('#linkedPatientComboxBox')

        // From ht-pat-detail-ctc-detail-panel
        if (!!_.size(dataFromPatDetail)) {

            // GDL on 20190607 - Not anymore by default
            // this.set("newMessage.important", true)
            try {
                delete (componentOpenParameters.dataFromPatDetail)
            } catch (e) {
            }

            // eMediattest ?
            if (!!_.size(_.get(dataFromPatDetail, "eMediattestSubFormDp", {}))) return this._prepareEMediattestMessage(dataFromPatDetail)

            if (_.trim(_.get(dataFromPatDetail, "patient.id", ""))) {
                dataFromPatDetail.patient = _.assign({
                    displayName: _.compact([
                        _.map(_.trim(_.get(dataFromPatDetail, "patient.lastName", "")).split(" "), i => _.capitalize(i)).join(" "),
                        _.map(_.trim(_.get(dataFromPatDetail, "patient.firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                        (!!_.trim(_.get(dataFromPatDetail, "patient.ssin", "")) ? "(" + this.localize('ssinPatVerbose', 'Numéro de registre national', this.language) + ": " + this.api.formatSsinNumber(_.trim(_.get(dataFromPatDetail, "patient.ssin", ""))) + ")" : ""),
                        (!_.trim(_.get(dataFromPatDetail, "patient.ssin", "")) && !!_.trim(_.get(dataFromPatDetail, "patient.dateOfBirth", "")) ? "(" + this.localize('birthDate', 'Birthdate', this.language) + ": " + moment(_.trim(_.get(dataFromPatDetail, "patient.dateOfBirth", 0)), "YYYYMMDD").format('DD/MM/YYYY') + ")" : "")
                    ]).join(" ")
                }, dataFromPatDetail.patient)

                // Changing value / selectedItem will call this._setLinkedPatient
                if (linkedPatientComboxBox && !!_.trim(_.get(dataFromPatDetail, "patient.ssin", ""))) linkedPatientComboxBox.selectedItem = _.get(dataFromPatDetail, "patient", {})
                if (linkedPatientComboxBox && !_.trim(_.get(dataFromPatDetail, "patient.ssin", ""))) linkedPatientComboxBox.value = _.get(dataFromPatDetail, "patient.displayName", "")
                setTimeout(() => {
                    this.set("newMessage.document.title", _.compact([this.localize('documentTransfer', 'Document transfer', this.language), _.trim(_.get(this, "newMessage.document.title"))]).join(" - "))
                }, 100)
            }

            // To improve: could be several attachments from pat (considering we only have one at the moment)
            return this.api.document().getDocument(_.trim(_.get(dataFromPatDetail, "documentId", "")))
                .then(foundDocument => this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(_.get(this, "user.healthcarePartyId", null), _.trim(_.get(foundDocument, "id", "")), _.size(_.get(foundDocument, "encryptionKeys", [])) ? _.get(foundDocument, "encryptionKeys", []) : _.get(foundDocument, "delegations", []))
                    .then(({extractedKeys: enckeys}) => !!_.trim(_.get(foundDocument, "attachmentId", "")) ? this.api.document().getAttachment(_.trim(_.get(foundDocument, "id", "")), _.trim(_.get(foundDocument, "attachmentId", "")), enckeys.join(',')).then(decryptedContent => ({
                        foundDocument,
                        decryptedContent
                    })).catch(e => {
                        console.log("ERROR with getAttachment: ", e)
                        return foundDocument
                    }) : foundDocument)
                )
                .then(({foundDocument, decryptedContent}) => {
                    const foundExtension = _.trim(_.get(foundDocument, "name", "")).split(".").pop()
                    const fileExtension = _.trim(_.get(_.compact(_.map(this.api.document().utiExts, (v, k) => _.trim(v).toLowerCase() === _.trim(_.get(foundDocument, "mainUti", "")).toLowerCase() ? k : false)), "[0]", (_.trim(_.get(foundDocument, "name", "")).indexOf(".") > -1 && _.trim(foundExtension).length < 5 && _.trim(foundExtension).length > 2 ? foundExtension : ""))).toLowerCase()
                    const attachmentSize = _.get((typeof decryptedContent === "string" ? this.api.crypto().utils.text2ua(decryptedContent) : decryptedContent), "byteLength", 0)
                    const attachmentSizePow = attachmentSize > (1024 ** 2) ? 2 : attachmentSize > 1024 ? 1 : 0
                    this.set("_hasAdditionalAnnexesFromPatDetail", true)
                    this.push("_additionalAnnexesFromPatDetail", {
                        content: decryptedContent,
                        filename: _.kebabCase(_.trim(_.get(foundDocument, "name", "")).replace("." + foundExtension, "")) + "." + fileExtension,
                        fileExtension: fileExtension,
                        fileExtensionUppercase: _.trim(fileExtension).toUpperCase(),
                        mimeType: _.trim(this.api.document().mimeType(_.trim(_.get(foundDocument, "mainUti", "")))) ? _.trim(this.api.document().mimeType(_.trim(_.get(foundDocument, "mainUti", "")))) : "text/plain",
                        title: _.trim(_.get(foundDocument, "name", "")),
                        size: this.api._powRoundFloatByPrecision(attachmentSize / (1024 ** attachmentSizePow), 2) + " " + _.trim(attachmentSizePow === 2 ? "Mb" : attachmentSizePow === 1 ? "Kb" : "Bytes"),
                        documentId: _.trim(_.get(foundDocument, "id", ""))
                    })
                    this.shadowRoot.querySelector('#additionalAnnexesFromPatDetail') && this.shadowRoot.querySelector('#additionalAnnexesFromPatDetail').render()
                })
                .catch(e => {
                    console.log("ERROR getting attachment from pat detail: ", e)
                    this.set("_bodyOverlay", true)
                    this.$["unableToLinkPatDocument"].open()
                })
                .finally(() => this.$['new-msg'].open())

        }

        // Is case of forward / reply
        if (!!_.size(componentOpenParameters)) {

            const prom = Promise.resolve([])
            const patientSsin = _.trim(_.get(componentOpenParameters, "patientSsin", ""))
            const replyOrForward = _.trim(_.get(componentOpenParameters, "replyOrForward", "reply"))
            const givenAttachments = _.get(componentOpenParameters, "attachments", [])

            return prom
                .then(() => this._getPatientDataBySsin(patientSsin))
                .then(foundPatientBySsin => {
                    if (!_.trim(_.get(foundPatientBySsin, "id", ""))) return prom
                    this.set("_dontTriggerUpdateSubjectUpOnPatientLinked", true)
                    linkedPatientComboxBox.selectedItem = _.assign({
                        displayName: _.compact([
                            _.map(_.trim(_.get(foundPatientBySsin, "lastName", "")).split(" "), i => _.capitalize(i)).join(" "),
                            _.map(_.trim(_.get(foundPatientBySsin, "firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                            (!!_.trim(_.get(foundPatientBySsin, "ssin", "")) ? "(" + this.localize('ssinPatVerbose', 'Numéro de registre national', this.language) + ": " + this.api.formatSsinNumber(_.trim(_.get(foundPatientBySsin, "ssin", ""))) + ")" : ""),
                            (!_.trim(_.get(foundPatientBySsin, "ssin", "")) && !!_.trim(_.get(foundPatientBySsin, "dateOfBirth", "")) ? "(" + this.localize('birthDate', 'Birthdate', this.language) + ": " + moment(_.trim(_.get(foundPatientBySsin, "dateOfBirth", 0)), "YYYYMMDD").format('DD/MM/YYYY') + ")" : "")
                        ]).join(" ")
                    }, foundPatientBySsin)
                    return prom
                })
                .then(() => {
                    if (_.trim(replyOrForward) !== "reply" || !_.trim(_.get(componentOpenParameters, "recipientId", ""))) return prom
                    this.set("_assignRecipientValueWhenReplyingToMessage", true)
                    this.set("recipientType", _.trim(_.get(componentOpenParameters, "recipientType", "")))
                    this.set("recipientFilter", _.trim(_.get(componentOpenParameters, "recipientId", "")))
                    return prom
                })
                .then(() => {
                    if (_.trim(replyOrForward) !== "forward" || !_.size(givenAttachments)) return prom

                    prom.then(() => {
                        this.set("_hasAnnexesFromForward", true)
                        _.map(givenAttachments, singleAttachment => {
                            this.push("_additionalAnnexesFromForward", {
                                content: _.get(singleAttachment, "decryptedContent", ""),
                                filename: _.trim(_.get(singleAttachment, "filename", "")),
                                fileExtension: _.trim(_.get(singleAttachment, "fileExtension", "")),
                                fileExtensionUppercase: _.trim(_.get(singleAttachment, "fileExtension", "")).toUpperCase(),
                                mimeType: _.trim(_.get(singleAttachment, "mimeType", "text/plain")),
                                title: _.trim(_.get(singleAttachment, "filename", "")),
                                size: _.trim(_.get(singleAttachment, "size", "")),
                                documentId: _.trim(_.get(singleAttachment, "documentId", ""))
                            })
                        })
                        setTimeout(() => {
                            this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsList') && this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsList').render()
                            this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsPreview') && this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsPreview').render()
                        }, 100)
                    })
                        .catch(e => {
                            console.log("ERROR getting attachment from pat detail: ", e)
                            this.set("_bodyOverlay", true)
                            this.$["unableToLinkPatDocument"].open()
                        })
                        .finally(() => prom)

                })
                .catch((e) => {
                    console.log("ERROR with open: ", e)
                    return prom
                })
                .finally(() => {
                    this.set("_forwardOrReplyAction", "(" + (replyOrForward === "forward" ? this.localize("ehb.forward", this.language) : this.localize("reply", this.language)) + ")")

                    // GDL on 20190607 - Not anymore by default
                    // this.set("newMessage.important", true)

                    this.set('newMessage.document.title', (replyOrForward === "forward" ? "FW: " : replyOrForward === "reply" ? "RE: " : "") + _.trim(_.get(componentOpenParameters, "subject", "")))
                    this.set('newMessage.document.textContent', [
                        "\n\n",
                        "--------------------------------------------------------------------------\n" +
                        _.trim(_.get(componentOpenParameters, "originalSender", "")) + " - " + _.trim(_.get(componentOpenParameters, "received", "")) + "\n" +
                        "--------------------------------------------------------------------------\n",
                        _.trim(_.get(componentOpenParameters, "body", "")) + "\n\n"
                    ].join("\n\n"))
                    this.$['new-msg'].open()
                })

        }

        // Not from pat detail, not a forward / not a reply
        if (!_.size(dataFromPatDetail) && !_.size(componentOpenParameters)) this.$['new-msg'].open()

    }

    _confirmMessageSuccessfullySent() {

        this._resetComponentData()

        this.$['new-msg'].close()

        setTimeout(() => {
            this.$["success"].classList.add('displayNotification')
        }, 100)
        setTimeout(() => {
            this.$["success"].classList.remove('displayNotification')
        }, 8000)

        return null

    }

    _prepareEMediattestMessage(dataFromPatDetail) {

        const promResolve = Promise.resolve()
        const outgoingDocumentComponent = this.shadowRoot.querySelector("#outgoingDocument")
        const linkedPatientComboxBox = this.shadowRoot.querySelector('#linkedPatientComboxBox')

        return promResolve
            .then(() => {
                this.set('_isMedex', true)
                this._resetLoadingMessage()
                this.$['new-msg'].open()
                this.set('_isLoading', true)
                this._setLoadingMessage({message: this.localize('please_wait', this.language), icon: "arrow-forward"})
                this.set('medexData', {
                    recipient: {
                        type: "EHP",
                        quality: "INSTITUTION_EHP",
                        id: "1990002015"
                    },
                    customMetas: {
                        MessageType: "IncapacityNotification",
                        MessageVersion: "1.0",
                        MessageFormat: "FPS HFCSE",
                    }

                })
            })
            .then(() => {
                // Linked patient & subject line
                dataFromPatDetail.patient = _.assign({
                    displayName: _.compact([
                        _.map(_.trim(_.get(dataFromPatDetail, "patient.lastName", "")).split(" "), i => _.capitalize(i)).join(" "),
                        _.map(_.trim(_.get(dataFromPatDetail, "patient.firstName", "")).split(" "), i => _.capitalize(i)).join(" "),
                        (!!_.trim(_.get(dataFromPatDetail, "patient.ssin", "")) ? "(" + this.localize('ssinPatVerbose', 'Numéro de registre national', this.language) + ": " + this.api.formatSsinNumber(_.trim(_.get(dataFromPatDetail, "patient.ssin", ""))) + ")" : ""),
                        (!_.trim(_.get(dataFromPatDetail, "patient.ssin", "")) && !!_.trim(_.get(dataFromPatDetail, "patient.dateOfBirth", "")) ? "(" + this.localize('birthDate', 'Birthdate', this.language) + ": " + moment(_.trim(_.get(dataFromPatDetail, "patient.dateOfBirth", 0)), "YYYYMMDD").format('DD/MM/YYYY') + ")" : "")
                    ]).join(" ")
                }, dataFromPatDetail.patient)

                // Changing value / selectedItem will call this._setLinkedPatient
                if (linkedPatientComboxBox && !!_.trim(_.get(dataFromPatDetail, "patient.ssin", ""))) linkedPatientComboxBox.selectedItem = _.get(dataFromPatDetail, "patient", {})
                if (linkedPatientComboxBox && !_.trim(_.get(dataFromPatDetail, "patient.ssin", ""))) linkedPatientComboxBox.value = _.get(dataFromPatDetail, "patient.displayName", "")
                setTimeout(() => {
                    this.set("newMessage.document.title", _.compact(["eMediAtt - Medex", _.trim(_.get(this, "newMessage.document.title"))]).join(" - "))
                }, 100)
            })
            .then(() => outgoingDocumentComponent.printMedexPdfItt(dataFromPatDetail))
            .then(printMedexPdfIttData => this.set("_data", _.merge(printMedexPdfIttData, {
                language: this.language,
                nowMs: moment().format('YYYYMMDDHHmmss0000'),
                nowYYYYMMDD: moment().format('YYYY-MM-DD'),
                nowHHMMSS: moment().format('HH:mm:ss'),
            })))
            .then(() => _.merge(this._data.eMediattest, {khmerContent: this._getMedexKhmerTemplate(this._data)}))
            .then(() => this._saveMedexKhmerIttToPatFile())
            .then(([createdMessage, createdDocument]) => _.merge(this._data.eMediattest.khmerData, {
                createdMessage: createdMessage,
                createdDocument: createdDocument
            }))
            .then(() => {

                // Error scenarios
                const errorScenario = _.trim(_.get(this, "_data.currentPatient.ssin", "")).length < 11 ? 1 :
                    _.trim(_.get(this, "_data.currentPatient.ssin", "")).length > 11 ? 2 :
                        !this.api.patient().isValidSsin(_.trim(_.get(this, "_data.currentPatient.ssin", ""))) ? 3 :
                            // !_.trim(_.get(this,"_data.currentPatient.firstName","")) ? 4 :
                            !_.trim(_.get(this, "_data.currentPatient.lastName", "")) ? 5 :
                                (_.trim(_.get(this, "_data.currentPatient.dateOfBirth", "")).length !== 8 || !parseInt(_.trim(_.get(this, "_data.currentPatient.dateOfBirth", "")))) ? 6 :
                                    // !_.size(_.get(this,"_data.currentPatient.languages",[])) ? 7 :
                                    !_.trim(_.get(_.find(this._data.eMediattest.incapacityData, {name: "incapacité de"}), "valueHr")) ? 8 :
                                        !_.trim(_.get(_.find(this._data.eMediattest.incapacityData, {name: "pour cause de"}), "valueHr")) ? 9 :
                                            !_.trim(_.get(_.find(this._data.eMediattest.incapacityData, {name: "Sortie"}), "valueHr")) ? 10 :
                                                // !_.trim(_.get(_.find(this._data.eMediattest.incapacityData, {name:"Accident suvenu le"}), "valueHr")) ? 11 :
                                                !_.trim(_.get(_.get(this, "_data.eMediattestSubFormDp.form")(), "created")) ? 12 :
                                                    !_.trim(_.get(_.find(this._data.eMediattest.incapacityData, {name: "du"}), "valueHr")) ? 13 :
                                                        !_.trim(_.get(_.find(this._data.eMediattest.incapacityData, {name: "au"}), "valueHr")) ? 14 :
                                                            (parseInt(_.get(_.find(this._data.eMediattest.incapacityData, {name: "du"}), "valueObject.fuzzyDateValue", "")) > parseInt(_.get(_.find(this._data.eMediattest.incapacityData, {name: "au"}), "valueObject.fuzzyDateValue", ""))) ? 15 :
                                                                _.trim(_.get(this, "_data.currentHcp.ssin", "")).length < 11 ? 16 :
                                                                    _.trim(_.get(this, "_data.currentHcp.ssin", "")).length > 11 ? 17 :
                                                                        !this.api.patient().isValidSsin(_.trim(_.get(this, "_data.currentHcp.ssin", ""))) ? 18 :
                                                                            !_.trim(_.get(this, "_data.currentHcp.nihii", "")) ? 19 :
                                                                                _.trim(_.get(_.find(this._data.eMediattest.incapacityData, {name: "incapacité de"}), "valueObject.stringValue")) !== "CD-INCAPACITY|work|1" ? 20 :
                                                                                    !_.trim(_.get(this, "_data.eMediattest.diagnosticData.labelHr", "")) ? 21 :
                                                                                        0

                return !parseInt(errorScenario) ? false : this._toggleMedexErrorScenario(errorScenario)

            })
            .then(hasError => {

                if (!!hasError) return false

                this.set("_hasAnnexesFromForward", true)
                this.set("newMessage.useReceivedReceipt", true)
                this.set("newMessage.useReadReceipt", true)
                this.set("newMessage.usePublicationReceipt", true)
                this.set("newMessage.encrypted", true)
                this.set("_forwardOrReplyAction", "- " + this.localize("medicalCertificate", "Medical certificate", this.language) + " Medex")
                this.push('newMessage.recipients', {
                    type: _.get(this, "medexData.recipient.type"),
                    ehp: _.get(this, "medexData.recipient.id"),
                    quality: _.get(this, "medexData.recipient.quality") /*, lastName: "Medex", firstName: "Medex" */
                })

                // PDF FILE
                const attachmentSizePdf = _.get(_.get(this, "_data.pdf.data", ""), "byteLength", 0)
                const attachmentSizePdfPow = attachmentSizePdf > (1024 ** 2) ? 2 : attachmentSizePdf > 1024 ? 1 : 0
                this.push("_additionalAnnexesFromForward", {
                    content: _.get(this, "_data.pdf.data", ""),
                    filename: _.trim(_.get(this, "_data.pdf.filename", "")),
                    fileExtension: "pdf",
                    fileExtensionUppercase: "PDF",
                    mimeType: "application/pdf",
                    title: _.trim(_.get(this, "_data.pdf.filename", "")),
                    size: this.api._powRoundFloatByPrecision(attachmentSizePdf / (1024 ** attachmentSizePdfPow), 2) + " " + _.trim(attachmentSizePdfPow === 2 ? "Mb" : attachmentSizePdfPow === 1 ? "Kb" : "Bytes"),
                    documentId: _.trim(_.get(this, "_data.pdf.createdDocument.id", ""))
                })

                // KHMER FILE
                const attachmentSizeKhmer = _.get(this.api.crypto().utils.utf82ua(_.get(this, "_data.eMediattest.khmerContent", "")), "byteLength", 0)
                const attachmentSizeKhmerPow = attachmentSizeKhmer > (1024 ** 2) ? 2 : attachmentSizeKhmer > 1024 ? 1 : 0
                this.push("_additionalAnnexesFromForward", {
                    content: this.api.crypto().utils.utf82ua(_.get(this, "_data.eMediattest.khmerContent", "")),
                    filename: _.trim(_.get(this, "_data.pdf.filename", "")).replace(".pdf", ".xml"),
                    fileExtension: "xml",
                    fileExtensionUppercase: "XML",
                    mimeType: "application/xml",
                    title: _.trim(_.get(this, "_data.pdf.filename", "")).replace(".pdf", ".xml"),
                    size: this.api._powRoundFloatByPrecision(attachmentSizeKhmer / (1024 ** attachmentSizeKhmerPow), 2) + " " + _.trim(attachmentSizeKhmerPow === 2 ? "Mb" : attachmentSizeKhmerPow === 1 ? "Kb" : "Bytes"),
                    documentId: _.trim(_.get(this, "_data.eMediattest.khmerData.createdDocument.id", ""))
                })

                setTimeout(() => {
                    this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsList') && this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsList').render()
                    this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsPreview') && this.shadowRoot.querySelector('#additionalAnnexesFromForward_attachmentsPreview').render()
                }, 100)

            })
            .catch(e => {
                console.log("ERROR _prepareEMediattestMessage", e)
                this.set("_bodyOverlay", true)
                this.$["unableToLinkPatDocument"].open()
            })
            .finally(() => {
                this._resetLoadingMessage()
                this.set('_isLoading', false)
            })

    }

    _toggleMedexErrorScenario(errorScenario) {

        // 1) Pat ssin < 11
        // 2) Pat ssin > 11
        // 3) Invalid pat ssin
        // 4) Missing pat fn
        // 5) Missing pat ln
        // 6) Invalid pat dateOfBirth
        // 7) Pat has no language
        // 8) No incapacity
        // 9) No incapacity reason
        // 10) No "out of house" flag (allowed/disallowed)
        // 11) No accident date
        // 12) No accident report date
        // 13) No incapacity begin date
        // 14) No incapacity end date
        // 15) Incapacity end date before begin date
        // 16) Hcp ssin < 11
        // 17) Hcp ssin > 11
        // 18) Invalid hcp ssin
        // 19) No hcp nihii
        // 20) Incapacity is not of type "CD-INCAPACITY|work|1", which is the only one allowed for Medex
        // 21) Missing diagnostic

        this.set("_bodyOverlay", true)
        this.set("errorDialogLine1", this.localize("ehboxMedexErrorScenario_" + _.trim(errorScenario), "Error with validation " + errorScenario, this.language))
        this.set("errorDialogLine2", this.localize("pleaseCorrectAndTryAgain", "Please correct the information and try again.", this.language))
        this.set("errorDialogLine3", "")
        this.$["errorDialog"].open()

        return true

    }

    _addRecipient() {

        const newMsgTo = this.shadowRoot.querySelector('#newMsg-To') || false
        if (!newMsgTo || !_.get(newMsgTo, "selectedItem", false) || !_.size(newMsgTo, "selectedItem", false)) return false

        const multipleEHealthBoxesDialog = this.shadowRoot.querySelector('#recipientWithMultipleEHealthBoxesDialog') || false
        const recipientWithoutEHealthBoxDialog = this.shadowRoot.querySelector('#recipientWithoutEHealthBoxDialog') || false
        const patternsValidation = {
            heightDigits: /^([0-9]){8}$/i,
            tenDigits: /^([0-9]){10}$/i,
            elevenDigits: /^([0-9]){11}$/i
        }

        this.set('_isLoading', true)

        // Cobra sometimes returns cbe, ehp, nihii, ssin with hyphens, spaces or dots
        const keysToClean = ["cbe", "ehp", "nihii", "ssin"]
        _.map(keysToClean, k => !_.trim(_.get(newMsgTo.selectedItem, k, "")) ? false : newMsgTo.selectedItem[k] = _.trim(newMsgTo.selectedItem[k].replace(/[^0-9]*/g, "")))

        const getValue = !!_.trim(_.get(newMsgTo, "selectedItem.cbe", "")) ? _.trim(_.get(newMsgTo, "selectedItem.cbe", "")) : !!_.trim(_.get(newMsgTo, "selectedItem.ehp", "")) ? _.trim(_.get(newMsgTo, "selectedItem.ehp", "")) : !!_.trim(_.get(newMsgTo, "selectedItem.nihii", "")) ? _.trim(_.get(newMsgTo, "selectedItem.nihii", "")) : _.trim(_.get(newMsgTo, "selectedItem.ssin", ""))

        const isValidCbe = !!patternsValidation.tenDigits.test(getValue)
        const isValidEhp = !!patternsValidation.tenDigits.test(getValue)
        const isValidSsin = !!patternsValidation.elevenDigits.test(getValue) && this.api.patient().isValidSsin(getValue)
        const isValidNihii = !!patternsValidation.heightDigits.test(getValue) || !!patternsValidation.elevenDigits.test(getValue)

        const getProms = _.compact([
            (!this._recipientTypeIsOrg || !isValidCbe) ? false : this.api.fhc().Addressbookcontroller().getOrgByCbeUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, getValue).catch(() => Promise.resolve([])),
            (!this._recipientTypeIsOrg || !isValidEhp) ? false : this.api.fhc().Addressbookcontroller().getOrgByEhpUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, getValue).catch(() => Promise.resolve([])),
            (!this._recipientTypeIsOrg || !isValidNihii) ? false : this.api.fhc().Addressbookcontroller().getOrgByNihiiUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, getValue).catch(() => Promise.resolve([])),
            (!!this._recipientTypeIsOrg || !isValidSsin) ? false : this.api.fhc().Addressbookcontroller().getHcpBySsinUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, getValue).catch(() => Promise.resolve([])),
            (!!this._recipientTypeIsOrg || !isValidNihii) ? false : this.api.fhc().Addressbookcontroller().getHcpByNihiiUsingGET(this.api.keystoreId, this.api.tokenId, this.credentials.ehpassword, getValue).catch(() => Promise.resolve([]))
        ])

        this.set("_recipientWithMultipleEHealthBoxes", {})

        return (
            !!_.size(_.get(newMsgTo, "selectedItem.ehealthBoxes", [])) ?
                Promise.resolve(_.get(newMsgTo, "selectedItem", {})) :
                Promise.all(getProms).then(searchResults => _.chain(searchResults).flatMap().filter(sr => !!_.size(_.get(sr, "ehealthBoxes"))).compact().uniq().head().value() || newMsgTo.selectedItem)
        )
            .then(recipientAndEhealthBoxes => _.assign(newMsgTo.selectedItem, {
                type: !!_.trim(_.get(recipientAndEhealthBoxes, "cbe")) ? "CBE" : !!_.trim(_.get(recipientAndEhealthBoxes, "ehp")) ? "EHP" : !!_.trim(_.get(recipientAndEhealthBoxes, "ssin")) ? "SSIN" : "NIHII",
                ehealthBoxes: _
                    .chain(_.get(recipientAndEhealthBoxes, "ehealthBoxes", []))
                    .filter(x => !!_.trim(_.get(x, "id", "")))
                    .map(x => _.assign(x, {
                        qualityHr: this.localize("ehBoxQuality_" + _.trim(_.get(x, "quality")), _.trim(_.get(x, "quality")), this.language),
                        typeHr: _.trim(_.get(x, "type")).toLowerCase() === "nihii" ? this.localize("cs-nihii", "Nihii", this.language) : _.trim(_.get(x, "type")).toLowerCase() === "inss" ? this.localize("cs-inss", "Inss", this.language) : _.upperFirst(_.trim(_.get(x, "type")).toLowerCase())
                    }))
                    .orderBy(['qualityHr', 'quality'], ['asc', 'asc'])
                    .value()
            }))
            .then(recipientAndEhealthBoxes => !_.size(_.get(recipientAndEhealthBoxes, "ehealthBoxes", [])) ? (recipientWithoutEHealthBoxDialog && recipientWithoutEHealthBoxDialog.open()) :
                (_.size(_.get(recipientAndEhealthBoxes, "ehealthBoxes", [])) === 1 && !!this._notAlreadyInRecipients(recipientAndEhealthBoxes)) ? this.push('newMessage.recipients', recipientAndEhealthBoxes) :
                    _.size(_.get(recipientAndEhealthBoxes, "ehealthBoxes", [])) > 1 ? (this.set("_recipientWithMultipleEHealthBoxes", recipientAndEhealthBoxes) || true) && multipleEHealthBoxesDialog && multipleEHealthBoxesDialog.open() :
                        false
            )
            .catch(e => console.log("Error with get org/hcp", e))
            .finally(() => (newMsgTo._clear() || true) && this.set('_isLoading', false))

    }

    _wrapRecipientData(recipientObject) {
        const recipientId = !!_.trim(_.get(recipientObject, "ehealthBoxes[0].id", "")) ?
            _.trim(_.get(recipientObject, "ehealthBoxes[0].id", "")) :
            !!_.trim(_.get(recipientObject, "cbe", "")) ? _.trim(_.get(recipientObject, "cbe", "")) :
                !!_.trim(_.get(recipientObject, "ehp", "")) ? _.trim(_.get(recipientObject, "ehp", "")) :
                    !!_.trim(_.get(recipientObject, "ssin", "")) ? _.trim(_.get(recipientObject, "ssin", "")) :
                        !!_.trim(_.get(recipientObject, "nihii", "")) ? _.trim(_.get(recipientObject, "nihii", "")) :
                            null

        const identifierType = !!_.trim(_.get(recipientObject, "ehealthBoxes[0].type", "")) ? _.trim(_.get(recipientObject, "ehealthBoxes[0].type", "")).toUpperCase() : _.trim(_.get(recipientObject, "type", "")).toUpperCase()

        return !recipientId ? null : {
            id: recipientId,
            // Even though we might get "INSS" from AddressBook/Cobra it would fail. We have to pass "SSIN"
            identifierType: {type: (_.trim(identifierType) === "INSS" ? "SSIN" : identifierType)},
            quality: !!_.trim(_.get(recipientObject, "ehealthBoxes[0].quality", "")) ? _.trim(_.get(recipientObject, "ehealthBoxes[0].quality")).toUpperCase() : !!_.trim(_.get(recipientObject, "quality", "")) ? _.trim(_.get(recipientObject, "quality", "doctor")).toUpperCase() : "DOCTOR",
            applicationId: _.trim(_.get(recipientObject, "applicationID", "")),
            lastName: !!_.trim(_.get(recipientObject, "lastName", "")) ? _.trim(_.get(recipientObject, "lastName", "")) : null,
            firstName: !!_.trim(_.get(recipientObject, "firstName", "")) ? _.trim(_.get(recipientObject, "firstName", "")) : null,
            organizationName: !!_.trim(_.get(recipientObject, "companyName", "")) ? _.trim(_.get(recipientObject, "companyName")) : "",
            personInOrganisation: ""
        }
    }

    _etkNotRetrieved() {

        this.set("_bodyOverlay", true)

        this.set("errorDialogLine1", this.localize("ehboxMissingEtkLine1", "Your recipient does not support message encryption.", this.language))
        this.set("errorDialogLine2", this.localize("ehboxMissingEtkLine2", "Its ETK could not be found within the public keys repository.", this.language))
        this.set("errorDialogLine3", this.localize("ehboxMissingEtkLine3", "Please get in touch with the support and/or with your recipient.", this.language))

        return this.$["errorDialog"].open()

    }

    _hyphenBeforeWhenExists(x) {
        return !!_.trim(x) ? "- " + _.trim(x) : ""
    }

    _resetComponentData() {

        const componentProperties = HtMsgNew.properties
        Object.keys(componentProperties).forEach(k => {
            if (!_.get(componentProperties[k], "noReset", false)) {
                this.set(k, (typeof componentProperties[k].value === 'function' ? componentProperties[k].value() : (componentProperties[k].value || null)))
            }
        })

        this.set("recipientType", this.recipientTypes.find(i => i.id === "hcp"))
        if (this.shadowRoot.querySelector('#linkedPatientComboxBox')) this.shadowRoot.querySelector('#linkedPatientComboxBox').value = ""
        this.shadowRoot.querySelector('#recipientsList') && this.shadowRoot.querySelector('#recipientsList').render()
        this.shadowRoot.querySelector('#additionalAnnexesFromPatDetail') && this.shadowRoot.querySelector('#additionalAnnexesFromPatDetail').render()
        this.$['success'] && this.$['success'].classList && this.$['success'].classList.remove('displayNotification')
        this.$['failed'] && this.$['failed'].classList && this.$['failed'].classList.remove('displayNotification')

    }


    _doSendMessageWithEhBox() {

        // Error scenarios
        const errorScenarioDialog = (!_.get(this, "api.keystoreId", false) || !_.get(this, "api.tokenId", false) || !_.get(this, "api.credentials.ehpassword", false)) ? "notConnectedDialog" :
            !_.trim(_.get(this, "newMessage.document.title", "")) ? "missingSubjectDialog" :
                !_.size(_.get(this, "newMessage.recipients", [])) ? "missingRecipientDialog" :
                    (!_.trim(_.get(this, "newMessage.document.textContent", "")) && !_.size(_.get(this, "newMessage.annex", [])) && !_.size(_.get(this, "_additionalAnnexesFromPatDetail", [])) && !_.size(_.get(this, "_additionalAnnexesFromForward", []))) ? "missingContentDialog" :
                        ""
        if (!!_.trim(errorScenarioDialog)) {
            this.set("_bodyOverlay", true)
            this.$[errorScenarioDialog].open()
            return
        }
        this._showSendingMessagePreload()
        this.$['success'] && this.$['success'].classList && this.$['success'].classList.remove('displayNotification')
        this.$['failed'] && this.$['failed'].classList && this.$['failed'].classList.remove('displayNotification')

        this.api.hcparty().getCurrentHealthcareParty().then(currentHcp => {

            let sendMessageResponse = false
            const publicationId = +new Date
            const messageSubject = _.trim(_.get(this, "newMessage.document.title", ""))
            const mainRecipient = this._wrapRecipientData(_.head(_.get(this, "newMessage.recipients", [])))

            const annexes = _.compact(_.concat(_.flatMap(_.get(this, "newMessage.annex", [])), _.map(_.compact(_.concat(_.get(this, "_additionalAnnexesFromPatDetail", []), _.get(this, "_additionalAnnexesFromForward", []))), _singleAdditionalAnnex => {
                return {
                    content: this._arrayBufferToByteArray(typeof _singleAdditionalAnnex.content !== "string" ? _singleAdditionalAnnex.content : this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(_singleAdditionalAnnex.content))),
                    documentId: _singleAdditionalAnnex.documentId,
                    filename: _singleAdditionalAnnex.filename,
                    mimeType: _.trim(_.get(_singleAdditionalAnnex, "mimeType", "")) ? _.trim(_.get(_singleAdditionalAnnex, "mimeType", "")) : "text/plain",
                    title: _singleAdditionalAnnex.title,
                    size: _singleAdditionalAnnex.size
                }
            }) || []))

            const isImportant = !!_.get(this, "newMessage.important", false)
            const isEncrypted = !!_.get(this, "newMessage.encrypted", false)

            let customMetas = {
                "CM-AuthorID": _.trim(_.get(currentHcp, "nihii", _.get(currentHcp, "ssin", ""))),
                "CM-AuthorIDType": _.trim(_.get(currentHcp, "nihii", "")) ? "NIHII" : "SSIN",
                "CM-AuthorType": _.trim(_.get(currentHcp, "civility", "doctor")).toUpperCase(),
                "CM-AuthorLastName": _.trim(_.get(currentHcp, "lastName", "")).toUpperCase(),
                "CM-AuthorFirstName": _.trim(_.get(currentHcp, "firstName", "")),
                "CM-AuthorName": (!_.trim(_.get(currentHcp, "lastName", "")) && !_.trim(_.get(currentHcp, "firstName", ""))) ? _.trim(_.get(currentHcp, "name", _.get(currentHcp, "companyName", ""))) : "",

                "CM-RecipientID": _.trim(_.get(mainRecipient, "id", "")),
                "CM-RecipientIDType": _.trim(_.get(mainRecipient, "identifierType.type", "NIHII")),
                "CM-RecipientLastName": _.trim(_.get(mainRecipient, "lastName", "")).toUpperCase(),
                "CM-RecipientFirstName": _.trim(_.get(mainRecipient, "firstName", "")),
                "CM-RecipientName": (!_.trim(_.get(mainRecipient, "lastName", "")) && !_.trim(_.get(mainRecipient, "firstName", ""))) ? _.trim(_.get(mainRecipient, "name", _.get(mainRecipient, "companyName", ""))) : "",

                "CM-EhrMessage": false,
                "CM-EhrMessageType": "Functionnal",
                "CM-EtkApplicationID": _.trim(_.get(this, "api.tokenId", "")),
                "CM-Requestnumber": publicationId,
                "CM-SendDateTime": moment().format('YYYY-MM-DD HH:mm:ss'),
            }

            // Sender = author
            customMetas = _.merge({
                "CM-SenderID": _.get(customMetas, "CM-AuthorID", ""),
                "CM-SenderIDType": _.get(customMetas, "CM-AuthorIDType", ""),
                "CM-SenderType": _.get(customMetas, "CM-AuthorType", ""),
                "CM-SenderLastName": _.get(customMetas, "CM-AuthorLastName", ""),
                "CM-SenderFirstName": _.get(customMetas, "CM-AuthorFirstName", ""),
                "CM-SenderName": _.get(customMetas, "CM-AuthorName", ""),
            }, customMetas)

            // For medex
            if (!!_.size(_.get(this, "medexData.customMetas", {}))) _.merge(customMetas, _.get(this, "medexData.customMetas", {}))

            // EhBox won't allow for empty values
            Object.keys(customMetas).forEach(k => {
                if (!_.trim(customMetas[k])) try {
                    delete customMetas[k]
                } catch (e) {
                }
            })

            // Unread by default, then eval important, cyrpted & has annexes statuses
            let messageStatus = 1 << 1
            messageStatus = isImportant ? messageStatus | 1 << 2 : messageStatus
            messageStatus = isEncrypted ? messageStatus | 1 << 3 : messageStatus
            messageStatus = !!_.size(annexes) ? messageStatus | 1 << 4 : messageStatus

            // The envelope itself
            const messageToBeSentWithEhbox = {
                id: this.api.crypto().randomUuid(),
                publicationId: publicationId,
                publicationDateTime: parseInt(moment().format('YYYYMMDD')),
                expirationDateTime: parseInt(moment().add(1, "years").format('YYYYMMDD')),
                customMetas: customMetas,
                document: {
                    title: messageSubject,
                    textContent: _.get(this, "newMessage.document.textContent", ""),
                    mimeType: 'text/plain',
                    filename: messageSubject
                },
                freeText: _.get(this, "newMessage.document.textContent", ""),
                freeInformationTableTitle: null,
                freeInformationTableRows: {},
                patientInss: !!_.trim(_.get(this, "newMessage.patientInss", "")) ? _.trim(_.get(this, "newMessage.patientInss", null)) : null,
                annex: annexes,
                copyMailTo: [],
                documentTitle: messageSubject,
                annexList: annexes,
                useReceivedReceipt: !!_.get(this, "newMessage.useReceivedReceipt", false),
                useReadReceipt: !!_.get(this, "newMessage.useReadReceipt", false),
                usePublicationReceipt: !!_.get(this, "newMessage.usePublicationReceipt", false),
                hasAnnex: !!_.size(annexes),
                hasFreeInformations: false,
                important: isImportant,
                encrypted: isEncrypted,
                destinations: _.compact(_.map(_.get(this, "newMessage.recipients", []), singleRecipient => this._wrapRecipientData(singleRecipient))),
                sender: {
                    identifierType: "NIHII",
                    id: _.trim(_.get(currentHcp, "nihii", "")),
                    quality: _.trim(_.get(currentHcp, "quality", "doctor")).toUpperCase(),
                    applicationId: "",
                    lastName: _.trim(_.get(currentHcp, "lastName", "")),
                    firstName: _.trim(_.get(currentHcp, "firstName", "")),
                    organizationName: (!_.trim(_.get(currentHcp, "lastName", "")) && !_.trim(_.get(currentHcp, "firstName", ""))) ? _.trim(_.get(currentHcp, "name", _.get(currentHcp, "companyName", ""))) : "",
                    personInOrganisation: ""
                },
                fromHealthcarePartyId: _.get(currentHcp, "id", ""),
                status: messageStatus
            }

            this.api.fhc().Ehboxcontroller().sendMessageUsingPOST(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, messageToBeSentWithEhbox, messageToBeSentWithEhbox.usePublicationReceipt, messageToBeSentWithEhbox.useReceivedReceipt, messageToBeSentWithEhbox.useReadReceipt)
                .then(x => sendMessageResponse = x)
                .catch(x => sendMessageResponse = x)
                .finally(() => {

                    this._resetLoadingMessage()
                    this.set('_isLoading', false)

                    // if(sendMessageResponse===true) { this._resetComponentData(); this.$['new-msg'].close(); } else { console.log("ERROR with _doSendMessageWithEhBox: ", sendMessageResponse); }
                    // setTimeout(() => { this.$[(sendMessageResponse===true ? "success" : "failed")].classList.add('displayNotification'); },100);
                    // setTimeout(() => { this.$[(sendMessageResponse===true ? "success" : "failed")].classList.remove('displayNotification'); },8000);

                    // Either went well [OR] couldn't find ETK (missing recipient public key) - when crypting message [OR] (hardcoded) -> "successfull" (labellisation)

                    return sendMessageResponse === true ? this._confirmMessageSuccessfullySent() : _.trim(_.get(sendMessageResponse, "message", "")) === "api-error403" ? this._etkNotRetrieved() : this._confirmMessageSuccessfullySent()

                }).catch(e => {
                this._resetLoadingMessage()
                this.set('_isLoading', false)
                this.$["failed"].classList.add('displayNotification')
                console.log("ERROR with getCurrentHealthcareParty while _doSendMessageWithEhBox: ", e)
            })

        })
            .catch(e => {
                this._resetLoadingMessage()
                this.set('_isLoading', false)
                this.$["failed"].classList.add('displayNotification')
                console.log("ERROR with getCurrentHealthcareParty while _doSendMessageWithEhBox: ", e)
            })
    }

    _addRecipientEhBox(e) {
        let ehboxToAdd = {}
        const promResolve = Promise.resolve()
        const multipleEHealthBoxesDialog = this.shadowRoot.querySelector('#recipientWithMultipleEHealthBoxesDialog') || false

        try {
            ehboxToAdd = JSON.parse(_.get(_.filter(_.get(e, "path", []), nodePath => !!_.trim(_.get(nodePath, "dataset.ehbox", ""))), "[0].dataset.ehbox", ""))
        } catch (e) {
        }
        const finalRecipientObject = _.assign(_.cloneDeep(_.get(this, "_recipientWithMultipleEHealthBoxes", {})), {
            ehealthBoxes: [_.find(_.get(this, "_recipientWithMultipleEHealthBoxes.ehealthBoxes", []), {
                id: _.trim(_.get(ehboxToAdd, "id", "")),
                quality: _.trim(_.get(ehboxToAdd, "quality", ""))
            })]
        })

        return !_.size(ehboxToAdd) || !_.size(finalRecipientObject) || !this._notAlreadyInRecipients(finalRecipientObject) ? promResolve : promResolve
            .then(() => {
                this.push('newMessage.recipients', finalRecipientObject)
                this.set("_recipientWithMultipleEHealthBoxes.ehealthBoxes", _.filter(_.get(this, "_recipientWithMultipleEHealthBoxes.ehealthBoxes", []), x => _.trim(_.get(x, "id")) === _.trim(_.get(ehboxToAdd, "id", "")) && _.trim(_.get(x, "quality")) !== _.trim(_.get(ehboxToAdd, "quality", ""))))
                this.shadowRoot.querySelector('#multipleEHealthBoxesSelectorDomRepeat') && this.shadowRoot.querySelector('#multipleEHealthBoxesSelectorDomRepeat').render()
                return !_.size(_.get(this, "_recipientWithMultipleEHealthBoxes.ehealthBoxes", [])) ? multipleEHealthBoxesDialog && multipleEHealthBoxesDialog.close() : null
            })

    }

    _notAlreadyInRecipients(recipientAndEhealthBoxes, qualityObject = {}) {

        const cbeId = _.trim(_.get(recipientAndEhealthBoxes, "cbe", ""))
        const ehpId = _.trim(_.get(recipientAndEhealthBoxes, "ehp", ""))
        const nihiiId = _.trim(_.get(recipientAndEhealthBoxes, "nihii", ""))
        const ssinId = _.trim(_.get(recipientAndEhealthBoxes, "ssin", ""))

        // [EITHER] called straight (when clicking on single recipient result)
        // [OR] when adding via #recipientWithMultipleEHealthBoxesDialog (same recipient but with multiple qualities)
        // [OR] through #recipientWithMultipleEHealthBoxesDialog = dom repeat / showing / listing (same recipient but with multiple qualities) => then qualityObject is defined
        const quality = !!_.size(qualityObject) ? _.trim(_.get(qualityObject, "quality", "")) : _.trim(_.get(recipientAndEhealthBoxes, "ehealthBoxes[0].quality", ""))

        // No recipients yet, allow
        if (!_.size(_.get(this, "newMessage.recipients"))) return true

        // Already have recipient(s) but the one we're trying to add has no ehealthBoxes attached to it -> simply check for presence of cbe, ehp, nihii, ssin in recipients list we already have
        if (!_.size(_.get(recipientAndEhealthBoxes, "ehealthBoxes", []))) return !(
            (!!_.get(recipientAndEhealthBoxes, "ehp", false) && _.uniq(_.compact(_.map(_.get(this, "newMessage.recipients", []), i => _.trim(i.ehp)))).indexOf(_.trim(_.get(recipientAndEhealthBoxes, "ehp", ""))) > -1) ||
            (!!_.get(recipientAndEhealthBoxes, "ssin", false) && _.uniq(_.compact(_.map(_.get(this, "newMessage.recipients", []), i => _.trim(i.ssin)))).indexOf(_.trim(_.get(recipientAndEhealthBoxes, "ssin", ""))) > -1) ||
            (!!_.get(recipientAndEhealthBoxes, "cbe", false) && _.uniq(_.compact(_.map(_.get(this, "newMessage.recipients", []), i => _.trim(i.cbe)))).indexOf(_.trim(_.get(recipientAndEhealthBoxes, "cbe", ""))) > -1) ||
            (!!_.get(recipientAndEhealthBoxes, "nihii", false) && _.uniq(_.compact(_.map(_.get(this, "newMessage.recipients", []), i => _.trim(i.nihii)))).indexOf(_.trim(_.get(recipientAndEhealthBoxes, "nihii", ""))) > -1)
        )

        // [Called WHEN ADDING A RECIPIENT [or] CALLED BY DOM-REPEAT / listing] Already have recipient(s) and the one we're trying to ADD/SHOW does have quality(ies) -> check accordingly (avoid the same recipient twice with the same quality)
        return _.size(_.get(this, "newMessage.recipients", [])) === _.size(_
            .chain(_.get(this, "newMessage.recipients", []))
            .filter(x => !cbeId || (_.trim(cbeId) !== _.trim(_.get(x, "cbe", "")) || (_.trim(cbeId) === _.trim(_.get(x, "cbe", "")) && _.trim(_.get(x, "ehealthBoxes[0].quality")) !== quality)))
            .filter(x => !ehpId || (_.trim(ehpId) !== _.trim(_.get(x, "ehp", "")) || (_.trim(ehpId) === _.trim(_.get(x, "ehp", "")) && _.trim(_.get(x, "ehealthBoxes[0].quality")) !== quality)))
            .filter(x => !nihiiId || (_.trim(nihiiId) !== _.trim(_.get(x, "nihii", "")) || (_.trim(nihiiId) === _.trim(_.get(x, "nihii", "")) && _.trim(_.get(x, "ehealthBoxes[0].quality")) !== quality)))
            .filter(x => !ssinId || (_.trim(ssinId) !== _.trim(_.get(x, "ssin", "")) || (_.trim(ssinId) === _.trim(_.get(x, "ssin", "")) && _.trim(_.get(x, "ehealthBoxes[0].quality")) !== quality)))
            .value()
        )

    }

}

customElements.define(HtMsgNew.is, HtMsgNew)
