import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../dynamic-form/dynamic-doc.js';
import '../../../collapse-button/collapse-button.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/scrollbar-style.js';
import '../../../../styles/buttons-style.js';
import '../../../../styles/paper-tabs-style.js';
import '../../../dynamic-form/dynamic-text-field.js';
import '../../../../styles/notification-style.js';

import moment from 'moment/src/moment';
import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';





class HtPatMemberDataTechnicalInfo extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
<style include="dialog-style scrollbar-style buttons-style paper-tabs-style notification-style">

            .p4{
                padding: 4px;
            }

            .mtm2{
                margin-top: -2px;
            }

            .w40{
                width: 40%;
            }

            .m5{
                margin: 5px;
            }

            .w100{
                width: 98%;
            }


        </style>
        <div>

            <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('', 'inputReference', language)]]" value="[[mdaResult.commonOutput.inputReference]]"></dynamic-text-field>
            <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('', 'nipreference', language)]]" value="[[mdaResult.commonOutput.nipreference]]"></dynamic-text-field>
            <dynamic-text-field class="w100 p4 mtm2 mw0" label="[[localize('', 'outputReference', language)]]" value="[[mdaResult.commonOutput.outputReference]]"></dynamic-text-field>
            <div>
                <vaadin-text-area class="textarea-style w100" id="CommentTextArea" label="[[localize('','soapRequest',language)]]" value="[[mdaResult.mycarenetConversation.soapRequest]]"></vaadin-text-area>
            </div>
            <div>
                <vaadin-text-area class="textarea-style w100" id="CommentTextArea" label="[[localize('','transactionRequest',language)]]" value="[[mdaResult.mycarenetConversation.transactionRequest]]"></vaadin-text-area>
            </div>
            <div>
                <vaadin-text-area class="textarea-style w100" id="CommentTextArea" label="[[localize('','soapResponse',language)]]" value="[[mdaResult.mycarenetConversation.soapResponse]]"></vaadin-text-area>
            </div>
            <div>
                <vaadin-text-area class="textarea-style w100" id="CommentTextArea" label="[[localize('','transactionResponse',language)]]" value="[[mdaResult.mycarenetConversation.transactionResponse]]"></vaadin-text-area>
            </div>
        </div>
`;
  }

    static get is() {
        return 'ht-pat-member-data-technical-info';
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
            language: {
                type: String
            },
            patient:{
                type: Object,
                value: () => {}
            },
            hcp:{
                type: Object,
                value: () => {}
            },
            mdaSearch:{
                type: Object,
                value: () => {}
            },
            selectedMdaContactType:{
                type: Object,
                value: () => {}
            },
            selectedMdaRequestType:{
                type: Object,
                value: () => {}
            },
            mdaResult:{
                type: Object,
                value: () => {}
            }
        };
    }

    static get observers() {
        return [];
    }

    ready() {
        super.ready();
    }
}
customElements.define(HtPatMemberDataTechnicalInfo.is, HtPatMemberDataTechnicalInfo);
