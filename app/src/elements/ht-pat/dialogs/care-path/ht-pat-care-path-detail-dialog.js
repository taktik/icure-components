import '../../../dynamic-form/dynamic-link.js';
import '../../../dynamic-form/dynamic-pills.js';
import '../../../ht-spinner/ht-spinner.js';
import '../../../dynamic-form/dynamic-doc.js';
import '../../../collapse-button/collapse-button.js';
import '../../../../styles/dialog-style.js';
import '../../../../styles/scrollbar-style.js';
import '../../../../styles/buttons-style.js';
import '../../../../styles/notification-style.js';
import '../../../../styles/spinner-style.js';
import '../../../../styles/shared-styles.js';
import '../../../../styles/paper-tabs-style.js';
import './ht-pat-care-path-detail-document.js';
import './ht-pat-care-path-detail-procedure.js';
import moment from 'moment/src/moment';
import Chart from 'chart.js';

import {TkLocalizerMixin} from "../../../tk-localizer";
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class";
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior";
import {PolymerElement, html} from '@polymer/polymer';

class HtPatCarePathDetailDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
        <style include="dialog-style scrollbar-style buttons-style notification-style spinner-style shared-styles paper-tabs-style">
            #care-path-detail{
                height: calc(98% - 12vh);
                width: 98%;
                max-height: calc(100% - 64px - 48px - 20px); /* 100% - header - margin - footer*/
                min-height: 400px;
                min-width: 800px;
                top: 64px;
            }

            .content{
                height: 100%;
            }

            .buttons{
                position: absolute;
                right: 0;
                bottom: 0;
                margin: 0;
            }

            #care-path-list-grid{
                margin: 1%;
                height: calc(100% - 55px);
            }

            .tabIcon{
                height: 16px;
                width: 16px;
                padding: 4px;
            }

            .btn-dropdown-container {
                text-align: right;
                position: absolute;
                margin-top: 8px;
                top: -40px;
                right: 4px;
                background-color: var(--app-background-color);
                opacity: 1;
                border-radius: 2px;
                z-index: 200;
                height: auto !important;
                box-shadow: var(--app-shadow-elevation-2);
                display: flex;
                flex-flow: column nowrap;
                align-items: stretch;
                border-radius: 3px;
                overflow: hidden;
                padding: 0;
                color: var(--app-text-color);
            }

            .btn-dropdown-container paper-button{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                text-transform: capitalize;
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
            }

            .btn-dropdown-container paper-icon-button:hover{
                background: var(--app-background-color-dark);
            }

            .btn-dropdown-container paper-button iron-icon{
                color: var(--app-secondary-color);
                height: 20px;
                width: 20px;
                margin-right: 4px;
                box-sizing: border-box;
            }

            .information-block{
                height: auto;
                width: 98%;
                border: 1px solid var(--app-background-color-dark);
                margin: 1%;
            }

            .information-block-title{
                background-color: var(--app-background-color-dark);
                height: 16px;
                font-size: var(--font-size-small);
                padding: 4px;
            }

            .information-block-content{
                height: auto;
                width: auto;
                padding: 4px;
            }

           .agreement-picker{
               min-width: 200px;
           }

            .care-path-selection{
                display: flex;
            }

            .w50{
                width: 50%;
                padding: 4px;
            }

            .w100{
                width: 98%;
                padding: 4px;
            }

            .not-found-mess{
                color: var(--app-status-color-nok);
                padding: 4px;
                margin-top: 18px;
            }

            .ko{
                color: var(--app-status-color-nok)
            }

            .ok{
                color: var(--app-status-color-ok)
            }

            .p4{
                padding: 4px;
            }

            .warningIcon{
                height: 14px;
                width: 14px;
                padding: 4px;
            }

            .linked-proc-list{
                width: 100%;
            }

            #procedures-list-grid{
                margin: 1%;
            }

            .tab-page-title{
                height: 20px;
                padding: 4px;
                width: 98%;
            }

            .close-view-btn{
                right: 0;
                position: absolute;
                margin: 2px;
            }

            .team-tag {
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
            .team-type{
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

            .del-team {
                height: 22px;
                width: 22px;
                margin: 0 4px 0 8px;
                padding: 2px;
            }

            .horizontal {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                flex-basis: 100%;
                align-items: center;
            }
            .team-list {
                overflow-x: auto;
                margin-top: -25px;
            }

            .w-100{
                width: 100%;
            }

            .contact-year-container{
                width: 98%;
                margin: 1%;
                height: auto;
                border: 1px solid var(--app-background-color-dark);
            }

            .contact-year-title{
                height: 20px;
                padding: 5px;
                width: auto;
                background: var(--app-background-color-dark);
            }

            .ctc-nbr{
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: var(--app-secondary-color);
                color: white;
                text-align: center;
                float: left;
                margin-left: 15px;
            }

            .year{
                float: left;
            }

            .contact-year-ctc-container{
                height: auto;
            }

            .contact-year-ctc-container-ctc{
                height: 20px;
                width: 98%;
                padding: 4px;
            }

            .charts-container-line{
                display: flex;
                height: auto;
            }

            .charts-container-row{
                margin: 1%;
                width: 31%;
                height: 300px;
                border: 1px solid var(--app-background-color-dark);
            }

            .charts-container-row-title{
                height: 15px;
                padding: 5px;
                width: auto;
                background: var(--app-background-color-dark);
            }

            .charts{
                height: 255px;
                width: 100%!important;
            }

            .proc-line{
                background: var(--app-background-color-dark);
                border: 1px solid var(--app-background-color-dark);
                font-size: var(--font-size-small);
                margin: 4px;
                height: auto;
                width: auto;
            }

            .proc-line-title{
                height: 16px;
                width: 100%;
            }

            .proc-line-content{
               height: auto;
                width: 100%;
            }

            .procedure-title{
                float: left;
            }

            .proc-nbr{
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: var(--app-secondary-color);
                color: white;
                text-align: center;
                float: left;
                margin-right: 10px;
            }

            .procedure-container{
                height: calc(100% - 50px);
                width: auto;
                display: flex;
            }

            .procedure-list-container{
                width: 30%;
                height: 100%;
            }

            .procedure-content-container{
                width: 70%;
                height: 100%;
            }

            .procedure-list-title{
                height: 40px;
                width: auto;
                padding: 4px;
            }

            .procedure-list-content{
                height: calc(100% - 50px);
                width: auto;
                margin: 5px;
                overflow: auto;
            }

            .pcc-line{
                display: flex;
                margin: 4px;
                padding: 4px;
                width: auto;
            }

            .menu-item {
                @apply --padding-menu-item;
                height: 24px;
                min-height: 24px;
                font-size: var(--font-size-normal);
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

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
            }

            .list-title {
                flex-basis: calc(100% - 72px);
                font-weight: bold;
            }

            .bold {
                font-weight: bold;
            }

            .menu-item-icon{
                height: 20px;
                width: 20px;
                padding: 0px;
            }

            collapse-button[opened] .menu-item-icon{
                transform: scaleY(-1);
            }

            .sublist{
                background:var(--app-light-color);
                margin:0 0 0 -30px;
                padding:0;
            }

            .sublist-document{
                background:var(--app-light-color);
                margin:0 0 0 0px;
                padding:0;
            }

            .table-line-menu {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                width: 100%;
            }

            .table-line-menu-top{
                padding-left: var(--padding-menu-item_-_padding-left);
                padding-right: var(--padding-menu-item_-_padding-right);
                box-sizing: border-box;
            }

            .table-line-menu div:not(:last-child){
                border-right: 1px solid var(--app-background-color-dark);
                height: 20px;
                line-height: 20px;
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

            .list-title {
                flex-basis: calc(100% - 72px);
                font-weight: bold;
            }

            .one-line-menu {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 400;
                padding-left:0;
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

            .w10{
                width: 9%;
            }
            .w20{
                width: 19%;
            }
            .w30{
                width: 29%;
            }
            .w40{
                width: 39%;
            }
            .w50{
                width: 49%;
            }
            .w60{
                width: 59%;
            }
            .w70{
                width: 69%;
            }
            .w80{
                width: 79%;
            }
            .w90{
                width: 89%;
            }
            .w100{
                width: 99%;
            }
            .m4{
                margin: 4px;
            }
            .p4{
                padding: 4px;
            }
            .mw30{
                min-width: 29%;
            }
            .procedure-error{
                color: var(--app-status-color-nok)
            }

            .procedure-line{
                width: auto;
                display: flex;
            }

            .hubDetailDialog{
                display: flex;
                height: 100%;
                width: auto;
                margin: 0;
                padding: 0;
            }

            .hub-menu-list{
                height: 100%;
                width: 30%;
                background-color: var(--app-background-color-dark);
                border-right: 1px solid var(--app-background-color-dark);
                overflow: auto;
                position: relative;
            }

            .hub-menu-view{
                height: 100%;
                width: 70%;
                position: relative;
                background: white;
            }

            .table-line-menu .date{
                width: 14%;
                padding-right: 4px;
                overflow: hidden;
                text-overflow: ellipsis;
            }


            .table-line-menu .name{
                overflow: hidden;
                text-overflow: ellipsis;
                padding-left: 4px;
                padding-right: 4px;
                width: 84%
            }

            .table-line-menu .dateTit{
                width: 14%;
                padding-right: 10px;
            }


            .table-line-menu .nameTit{
                padding-left:4px;
                padding-right:4px;
                width: 84%;
            }

            iron-pages{
                height: calc(100% - 50px);
            }


        </style>

        <paper-dialog id="care-path-detail">
            <h2 class="modal-title">
                [[selectedCarePath.type]] ([[patient.firstName]] [[patient.lastName]] - [[_formatDate(patient.dateOfBirth)]] [[_ageFormat(patient.dateOfBirth)]])
            </h2>
            <div class="content">
                <paper-tabs class="tab-selector" selected="{{tabs}}">
                    <paper-tab>
                        <iron-icon class="tabIcon" icon="vaadin:ambulance"></iron-icon>[[localize('care-path-info','Care path info',language)]]
                    </paper-tab>
                    <paper-tab>
                        <iron-icon class="tabIcon" icon="vaadin:group"></iron-icon>[[localize('care-path-team','Care team',language)]]
                    </paper-tab>
                    <paper-tab>
                        <iron-icon class="tabIcon" icon="vaadin:tools"></iron-icon>[[localize('care-path-procedure','Procedures',language)]]
                    </paper-tab>
                    <paper-tab>
                        <iron-icon class="tabIcon" icon="vaadin:crosshairs"></iron-icon>[[localize('care-path-resume','Resume',language)]]
                    </paper-tab>
                    <paper-tab>
                        <iron-icon class="tabIcon" icon="vaadin:newspaper"></iron-icon>[[localize('care-path-document','Documents',language)]]
                    </paper-tab>
                    <!--
                    <paper-tab>
                        <iron-icon class="tabIcon" icon="vaadin:pill"></iron-icon>[[localize('care-path-prescription','Prescription',language)]]
                    </paper-tab>
                    -->
                </paper-tabs>
                <iron-pages selected="[[tabs]]">
                    <page id="carePathInformation">
                        <div class="information-block">
                            <div class="information-block-title">
                                [[localize('care-path', 'Care path', language)]]
                            </div>
                            <div class="information-block-content care-path-selection">
                                <vaadin-combo-box id="care-path-type" class="w50" label="[[localize('care-path-type','Care path type',language)]]" filter="{{carePathType}}" selected-item="{{selectedCarePathType}}" filtered-items="[[carePathList]]" item-label-path="label.fr">
                                    <template>[[item.label.fr]]</template>
                                </vaadin-combo-box>
                                <template is="dom-if" if="[[_isSelectableHealthElements(selectableEhealthElements)]]">
                                    <vaadin-combo-box id="linked-health-element" class="w50" label="[[localize('care-path-linked-health-element','linked health element',language)]]" filter="{{healthElement}}" selected-item="{{selectedHealthElement}}" filtered-items="[[selectableEhealthElements]]" item-label-path="descr">
                                        <template>[[_getHeDescr(item)]]</template>
                                    </vaadin-combo-box>
                                </template>
                                <template is="dom-if" if="[[!_isSelectableHealthElements(selectableEhealthElements)]]">
                                    <span class="not-found-mess">[[localize('care-path-act-he-prob-found', 'No corresponding active health problem found', language)]]</span>
                                </template>
                            </div>
                        </div>
                        <template is="dom-if" if="[[_isSelectedHealthElement(selectedHealthElement)]]">
                            <div class="information-block">
                                <div class="information-block-title">
                                    [[localize('care-path-cond', 'Conditions', language)]]
                                </div>
                                <div>
                                    <template is="dom-if" if="[[isRenal(selectedHealthElement)]]">
                                        <div class="p4">
                                            [[localize('care-path-ren-crit-incl', 'Renal failure critera', language)]]
                                            <ul>
                                                <li>
                                                    [[localize('care-path-ren-crit-incl-renal-failure', 'Renal failure', language)]]
                                                    <ul>
                                                        <li>[[localize('care-path-ren-crit-incl-filtration', 'Filtration', language)]]</li>
                                                        [[localize('care-path-ren-crit-incl-and-or', '', language)]]
                                                        <li>[[localize('care-path-ren-crit-incl-proteinuria', 'Proteinuria', language)]]</li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    [[localize('care-path-ren-crit-incl-dialysis', 'Dialysis', language)]]
                                                </li>
                                                <li>
                                                    [[localize('care-path-ren-crit-incl-follow-up', 'Follow up', language)]]
                                                </li>
                                                <li>
                                                    [[localize('care-path-ren-crit-incl-age', 'Must have more than 18 years', language)]]
                                                    <template is="dom-if" if="[[!_checkPatientAge(patient)]]">
                                                        <iron-icon class="ko warningIcon" icon="vaadin:warning"></iron-icon> <span class="ko">[[localize('care-path-ren-crit-incl-age-alert', 'Your patient must have more than 18 years', language)]]</span>
                                                    </template>
                                                </li>
                                            </ul>
                                        </div>
                                    </template>
                                    <template is="dom-if" if="[[!isRenal(selectedHealthElement)]]">
                                        <div class="p4">
                                            <div inner-h-t-m-l="[[localize('care-path-dia-crit-incl', 'Inclusion critera', language)]]"></div>
                                            [[localize('care-path-dia-crit-excl', 'Exclusion criteria for a type 2 diabetes care path', language)]]
                                            <ul>
                                                <li>
                                                    [[localize('care-path-dia-crit-exlc-injection', 'More than two insulin injections per day', language)]]
                                                </li>
                                                <li>
                                                    [[localize('care-path-dia-crit-excl-preg', 'Pregnancy or pregnancy wish', language)]]
                                                    <template is="dom-if" if="[[_isPregnant(activeHealthElements)]]">
                                                        <iron-icon class="ko warningIcon" icon="vaadin:warning"></iron-icon> <span class="ko">[[localize('care-path-preg-alert', 'Warning, there is at least one active problem regarding pregnancy', language)]]</span>
                                                    </template>
                                                </li>
                                                <li>
                                                    [[localize('care-path-dia-crit-excl-diabetes', 'Diabetes type 1', language)]]
                                                    <template is="dom-if" if="[[_isDiabetesTypeOne(activeHealthElements)]]">
                                                        <iron-icon class="ko warningIcon" icon="vaadin:warning"></iron-icon> <span class="ko">[[localize('care-path-diabetes-type-one-alert', 'Warning, there is at least one active problem regarding diabetes type I', language)]]</span>
                                                    </template>
                                                </li>
                                            </ul>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div class="information-block">
                                <div class="information-block-title">
                                    [[localize('care-path-act', 'Activation', language)]]
                                </div>
                                <div class="information-block-content">
                                    <vaadin-date-picker class="agreement-picker" label="[[localize('care-path-start-date', 'Start date', language)]]" i18n="[[i18n]]" value="{{activationDateAsString.start}}"></vaadin-date-picker>
                                    <vaadin-date-picker class="agreement-picker" label="[[localize('care-path-end-date', 'End date', language)]]" i18n="[[i18n]]" value="{{activationDateAsString.end}}"></vaadin-date-picker>
                                </div>
                            </div>

                            <div class="information-block">
                                <div class="information-block-title">
                                    [[localize('care-path-supp-agr', 'Support agreements', language)]]
                                </div>
                                <div class="information-block-content">
                                    <vaadin-date-picker class="agreement-picker" label="[[localize('care-path-acc-pat', 'Patient agreement', language)]]" i18n="[[i18n]]" value="{{agreementsDateAsString.patient}}"></vaadin-date-picker>
                                    <vaadin-date-picker class="agreement-picker" label="[[localize('care-path-acc-phys', 'Physician agreement', language)]]" i18n="[[i18n]]" value="{{agreementsDateAsString.physician}}"></vaadin-date-picker>
                                    <vaadin-date-picker class="agreement-picker" label="[[localize('care-path-acc-spec', 'Specialist agreement', language)]]" i18n="[[i18n]]" value="{{agreementsDateAsString.specialist}}"></vaadin-date-picker>
                                    <vaadin-date-picker class="agreement-picker" label="[[localize('care-path-acc-mut', 'Mutuality agreement', language)]]" i18n="[[i18n]]" value="{{agreementsDateAsString.mutuality}}"></vaadin-date-picker>
                                </div>
                            </div>

                            <div class="information-block">
                                <div class="information-block-title">
                                    [[localize('care-path-deadline', 'Care path deadline', language)]]
                                </div>
                                <div class="information-block-content">
                                    <vaadin-date-picker class="agreement-picker" label="[[localize('care-path-deadline-date', 'Deadline date', language)]]" i18n="[[i18n]]" value="{{deadlineDateAsString}}"></vaadin-date-picker>
                                </div>
                            </div>
                        </template>
                    </page>
                    <page id="carePathTeam">
                        <div class="information-block">
                            <div class="information-block-title">
                                [[localize('care-path-team-physician','Physician',language)]]
                            </div>
                            <div class="information-block-content">
                                <vaadin-combo-box id="physician-team" class="w100" label="[[localize('inputYourSearchQuery', 'Input your search query', language)]]" filter="{{physicianFilter}}" selected-item="{{selectedTeamPhysician}}" filtered-items="[[availableCareTeam]]" item-label-path="displayedName">
                                    <template>[[item.displayedName]]</template>
                                </vaadin-combo-box>
                                <div class="horizontal team-list w-100">
                                    <template is="dom-repeat" items="[[selectedCarePath.careTeam.physician]]" as="singlePhysician" id="physicianTeamList">
                                        <paper-item class="team-tag" id="[[singlePhysician.id]]">
                                            <div class="team-type"></div>
                                            <div class="one-line-menu-team list-title-team">[[singlePhysician.displayedName]]</div>
                                            <paper-icon-button class="del-team" icon="icons:delete" id="[[singlePhysician.id]]" on-tap="_removePhysicianFromTeam"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="information-block">
                            <div class="information-block-title">
                                [[localize('care-path-team-specialist','Specialist',language)]]
                            </div>
                            <div class="information-block-content">
                                <vaadin-combo-box id="specialist-team" class="w100" label="[[localize('inputYourSearchQuery', 'Input your search query', language)]]" filter="{{specialistFilter}}" selected-item="{{selectedTeamSpecialist}}" filtered-items="[[availableCareTeam]]" item-label-path="displayedName">
                                    <template>[[item.displayedName]]</template>
                                </vaadin-combo-box>
                                <div class="horizontal team-list w-100">
                                    <template is="dom-repeat" items="[[selectedCarePath.careTeam.specialist]]" as="singleSpecialist" id="specialistList">
                                        <paper-item class="team-tag" id="[[singleSpecialist.id]]">
                                            <div class="team-type"></div>
                                            <div class="one-line-menu-team list-title-team">[[singleSpecialist.displayedName]]</div>
                                            <paper-icon-button class="del-team" icon="icons:delete" id="[[singleSpecialist.id]]" on-tap="_removeSpecialistFromTeam"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="information-block">
                            <div class="information-block-title">
                                [[localize('care-path-team-other','Other',language)]]
                            </div>
                            <div class="information-block-content">
                                <vaadin-combo-box id="other-team" class="w100" label="[[localize('inputYourSearchQuery', 'Input your search query', language)]]" filter="{{otherFilter}}" selected-item="{{selectedTeamOther}}" filtered-items="[[availableCareTeam]]" item-label-path="displayedName">
                                    <template>[[item.displayedName]]</template>
                                </vaadin-combo-box>
                                <div class="horizontal team-list w-100">
                                    <template is="dom-repeat" items="[[selectedCarePath.careTeam.other]]" as="singleOther" id="otherList">
                                        <paper-item class="team-tag" id="[[singleOther.id]]">
                                            <div class="team-type"></div>
                                            <div class="one-line-menu-team list-title-team">[[singleOther.displayedName]]</div>
                                            <paper-icon-button class="del-team" icon="icons:delete" id="[[singleOther.id]]" on-tap="_removeOtherFromTeam"></paper-icon-button>
                                        </paper-item>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </page>
                    <page id="carePathProcedure">
                        <ht-pat-care-path-detail-procedure id="htPatCarePathDetailProcedure" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" hcp="[[hcp]]" selected-care-path="[[selectedCarePath]]" selected-care-path-type="[[selectedCarePathType]]" available-package-of-procedure="[[availablePackageOfProcedure]]" contacts="[[contacts]]"></ht-pat-care-path-detail-procedure>
                    </page>
                    <page id="carePathResume">
                        <div class="information-block">
                            <div class="information-block-title">
                                [[localize('care-path-ctc', 'Contacts made as part of the care path', language)]]
                            </div>
                            <div class="information-block-content">
                                <template is="dom-repeat" items="[[_getYearOfContact(contactsOfCarePath, contactsOfCarePath.*)]]" as="year">
                                    <div class="contact-year-container">
                                        <div class="contact-year-title">
                                            <div class="year">[[year]]</div>
                                            <div class="ctc-nbr">[[_getNumberOfContacts(contactsOfCarePath, year, contactsOfCarePath.*)]]</div>
                                        </div>
                                        <div class="contact-year-ctc-container">
                                            <template is="dom-repeat" items="[[_getContactFromYear(contactsOfCarePath, year, contactsOfCarePath.*)]]" as="ctc">
                                                <div class="contact-year-ctc-container-ctc">
                                                    [[_formatDate(ctc.openingDate)]] [[ctc.userDescr]]
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div>
                            <template is="dom-if" if="[[isRenal(selectedHealthElement)]]">
                                <div class="charts-container-line">
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage du cholestérol", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="cholesterolChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de la créatinine sanguine", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="creatinineChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de l'hémoglobine", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="hemoglobinChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                </div>
                                <div class="charts-container-line">
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de l'eGFR", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="egfrChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de la 25-OH-Vitamine D3", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="vitaminChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Prise de la tension artérielle", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="bloodPresureChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                </div>
                                <div class="charts-container-line">
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Mesure du BMI", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="bmiChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de la microalbuminurie", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="microAlbumenChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template is="dom-if" if="[[!isRenal(selectedHealthElement)]]">
                                <div class="charts-container-line">
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage du LDL-cholestérol", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="ldlCholesterolChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de la créatinine sanguine", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="creatinineChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de la microalbuminurie", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="microAlbumenChart" width="100%" height="200"></canvas>
                                        </div>
                                    </div>
                                </div>
                                <div class="charts-container-line">
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Mesure du BMI", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="bmiChart" class="charts"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de l'HBA1c", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="hba1cChart" class="charts"></canvas>
                                        </div>
                                    </div>
                                    <div class="charts-container-row">
                                        <div class="charts-container-row-title">
                                            [[localize("", "Dosage de la glycémie", language)]]
                                        </div>
                                        <div class="charts-container-row-content">
                                            <canvas id="glycemicChart" class="charts"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </page>
                    <page id="carePathDocument">
                        <ht-pat-care-path-detail-document id="htPatCarePathDetailDocument" api="[[api]]" user="[[user]]" language="[[language]]" patient="[[patient]]" i18n="[[i18n]]" current-contact="[[currentContact]]" resources="[[resources]]" hcp="[[hcp]]" selected-care-path="[[selectedCarePath]]" available-document-list="[[availableDocumentList]]" on-selected-document="_showLinkingBtn"></ht-pat-care-path-detail-document>
                    </page>
                    <!--
                    <page id="carePathPrescription">

                    </page>
                    -->
                </iron-pages>
            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="_closeDialogs"><iron-icon icon="icons:close" class="mr5 smallIcon"></iron-icon> [[localize('clo','Close',language)]]</paper-button>
                <template is="dom-if" if="[[_isDocumentTab(tabs)]]">
                    <template is="dom-if" if="[[linkBtnAvailable]]">
                        <paper-button class="button button--other" on-tap="_linkDocument"><iron-icon icon="vaadin:link" class="mr5 smallIcon"></iron-icon> [[localize('care-path-link-doc','Link',language)]]</paper-button>
                    </template>
                    <template is="dom-if" if="[[unlinkBtnAvailable]]">
                        <paper-button class="button button--other" on-tap="_removeLinkedDocument"><iron-icon icon="vaadin:unlink" class="mr5 smallIcon"></iron-icon> [[localize('care-path-unlink-doc','Unlink',language)]]</paper-button>
                    </template>
                </template>
                <paper-button class="button button--save" on-tap="_saveCarePath"><iron-icon icon="save" class="mr5 smallIcon"></iron-icon> [[localize('care-path-save','Save',language)]]</paper-button>
                <template is="dom-if" if="[[_isSelectedHealthElement(selectedHealthElement)]]">
                    <paper-icon-button class="button--icon-btn" icon="more-vert" on-tap="_toggleAddActions"></paper-icon-button>
                    <template is="dom-if" if="[[showMoreOptionContainer]]">
                        <div class="btn-dropdown-container">
                            <paper-button on-tap="_createContract"><iron-icon icon="vaadin:clipboard-text"></iron-icon>[[localize('care-path-print-contract', 'Print contract', language)]]</paper-button>
                        </div>
                    </template>
                </template>
            </div>

        </paper-dialog>
`;
  }

  static get is() {
      return 'ht-pat-care-path-detail-dialog';
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
          tabs:{
              type: Number,
              value: 0
          },
          currentContact:{
              type: Object,
              value: () => {}
          },
          hcp:{
            type: Object,
            value: () => {}
          },
          showMoreOptionContainer: {
              type: Boolean,
              value: false
          },
          agreementsDateAsString:{
              type: Object,
              value: {
                  patient: null,
                  physician: null,
                  specialist: null,
                  mutuality: null
              }
          },
          activationDateAsString:{
              type: Object,
              value: () => ({
                  start: null,
                  end: null
              })
          },
          deadlineDateAsString:{
              type: String,
              value: null
          },
          carePathList:{
              type: Array,
              value: () => []
          },
          selectedCarePathType:{
              type: Object,
              value: () => {}
          },
          activeHealthElements:{
            type: Array,
            value: () => []
          },
          selectableEhealthElements:{
              type: Array,
              value: () => []
          },
          selectedHealthElement:{
              type: Object,
              value: () => {}
          },
          selectedCarePath:{
              type: Object,
              value: {
                  careTeam: {
                      physician: [],
                      specialist: [],
                      other: []
                  },
                  linkedHealthElement: null,
                  type: null,
                  startDate: null,
                  endDate: null,
                  valueDate: null,
                  created: null,
                  id: null,
                  status : null,
                  deadlineDate: null,
                  agreementsDate: {
                      patient: null,
                      physician: null,
                      specialist: null,
                      mutuality: null
                  },
                  linkedDocuments: [],
                  linkedProcedures: []
              }
          },
          availableCareTeam:{
              type: Array,
              value: () => []
          },
          selectedTeamPhysician:{
              type: Object,
              value: () => {}
          },
          selectedTeamSpecialist:{
              type: Object,
              value: () => {}
          },
          selectedTeamOther:{
              type: Object,
              value: () => {}
          },
          contacts:{
              type: Array,
              value: () => []
          },
          contactsOfCarePath:{
              type: Array,
              value: () => []
          },
          saveFormReqIdx:{
              type: Number,
              value: 0
          },
          selectedCarePathInfo:{
              type: Object,
              value: () => {}
          },
          isLinkedDocumentView:{
              type: Boolean,
              value: true
          },
          availableDocumentList:{
              type: Array,
              value: () => []
          },
          dataForCharts:{
              type: Array,
              value: () => []
          },
          availablePackageOfProcedure:{
              type: Array,
              value: () => []
          },
          selectedPackageOfProcedure:{
              type: Object,
              value: () => {}
          },
          selectedProcedure: {
              type: Object,
              value: () => {}
          },
          packageOfProcedure:{
              type: Array,
              value: () => []
          },
          availableLifeCycleCodes:{
              type: Array,
              value: () => []
          },
          linkBtnAvailable:{
              type: Boolean,
              value: false
          },
          unlinkBtnAvailable:{
              type: Boolean,
              value: false
          },
          selectedDocumentId:{
              type: String,
              value: null
          }

      };
  }

  static get observers() {
      return [
          '_selectedCarePathTypeChanged(selectedCarePathType, selectedCarePathType.*)',
          '_selectedTeamPhysicianChanged(selectedTeamPhysician)',
          '_selectedTeamSpecialistChanged(selectedTeamSpecialist)',
          '_selectedTeamOtherChanged(selectedTeamOther)',
          '_activationDateChanged(activationDateAsString.start)',
          '_initializeCharts(tabs)',
          '_dateAsStringChanged(agreementsDateAsString, agreementsDateAsString.*, activationDateAsString, activationDateAsString.*, deadlineDateAsString)',
          '_selectedPackageOfProcedureChanged(selectedPackageOfProcedure)',
          '_selectedTabChanged(tabs)'
      ];
  }

  ready() {
      super.ready();
  }

  open(){
      const carePathCode = ["BE-THESAURUS|10025768|3.1.0", "BE-THESAURUS|10119104|3.1.0"]
      ;(_.get(this.selectedCarePathInfo, 'linkedHeId', null) && _.get(this.selectedCarePathInfo, 'carePathId', null) ? this.api.helement().getHealthElement(_.get(this.selectedCarePathInfo, 'linkedHeId', null)) : Promise.resolve({}))
       .then(he => Promise.all([he, this._getCurrentCareTeam()]))
       .then(([he, careTeam]) => Promise.all([he, careTeam, this.api.code().getCodes(carePathCode.join(','))]))
       .then(([he, careTeam, hes]) => {
           const carePath = _.get(he, 'plansOfAction', []).find(p => p.id === _.get(this.selectedCarePathInfo, 'carePathId', null))

           this.set('availableCareTeam', careTeam)
           this.set('availableDocumentList', [])

           this.set("carePathList", [{
               label: {fr: 'Trajet de soins insuffisance rénale chronique', nl: 'Chronisch nierfalen zorgpad' , en: 'Chronic renal failure care pathway'},
               linkedHe: hes.find(he => he.id === "BE-THESAURUS|10119104|3.1.0") || {}
           },{
               label: {fr: 'Trajet de soins diabète type 2', nl: 'Diabetes zorgpad type 2' , en: 'Diabetes Care Path Type 2'},
               linkedHe: hes.find(he => he.id === "BE-THESAURUS|10025768|3.1.0") || {}
           }])

           this.set('selectedCarePath', {
               careTeam: {
                   physician: _.compact(_.uniq(_.get(carePath, "careTeamMemberships", []).map(ctms => _.get(_.get(he, "careTeam", []).find(ct => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "physician"), 'healthcarePartyId', null)))).map(hcpId => careTeam.find(hcp => hcp.id === hcpId)),
                   specialist: _.compact(_.uniq(_.get(carePath, "careTeamMemberships", []).map(ctms => _.get(_.get(he, "careTeam", []).find(ct => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "specialist"), 'healthcarePartyId', null)))).map(hcpId => careTeam.find(hcp => hcp.id === hcpId)),
                   other: _.compact(_.uniq(_.get(carePath, "careTeamMemberships", []).map(ctms => _.get(_.get(he, "careTeam", []).find(ct => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "other"), 'healthcarePartyId', null)))).map(hcpId => careTeam.find(hcp => hcp.id === hcpId)),
               },
               linkedHealthElement: he,
               type: _.get(carePath, 'name', null),
               startDate: _.get(carePath, 'openingDate', null),
               endDate: _.get(carePath, 'closingDate', null),
               valueDate: _.get(carePath, 'valueDate', null),
               created: _.get(carePath, 'created', null),
               id: _.get(carePath, 'id', null),
               status : _.get(carePath, 'status', null),
               deadlineDate: _.get(carePath, 'deadlineDate', null),
               idOpeningContact: _.get(carePath, 'idOpeningContact', null),
               agreementsDate: {
                   patient: _.get(_.get(carePath, "careTeamMemberships", []).find(ctms => _.get(ctms, 'membershipType', null) === 'patient' && _.get(ctms, 'startDate', null)), "startDate", null),
                   physician:  _.get(_.head(_.compact(_.get(he, "careTeam", []).map(ct => _.get(carePath, "careTeamMemberships", []).find(ctms => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "physician" && _.get(ctms, 'startDate', null))))), 'startDate', null),
                   specialist:  _.get(_.head(_.compact(_.get(he, "careTeam", []).map(ct => _.get(carePath, "careTeamMemberships", []).find(ctms => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "specialist" && _.get(ctms, 'startDate', null))))), 'startDate', null),
                   mutuality: _.get(_.get(carePath, "careTeamMemberships", []).find(ctms => _.get(ctms, 'membershipType', null) === 'mutuality' && _.get(ctms, 'startDate', null)), "startDate", null)
               },
               encryptedDocumentsId: _.get(carePath, "documentIds", []),
               linkedDocuments: [],
               linkedProcedures: []
           })

           this.set('agreementsDateAsString', {
               patient:  _.get(_.get(carePath, "careTeamMemberships", []).find(ctms => _.get(ctms, 'membershipType', null) === 'patient' && _.get(ctms, 'startDate', null)), "startDate", null) ? this.api.moment(_.get(_.get(carePath, "careTeamMemberships", []).find(ctms => _.get(ctms, 'membershipType', null) === 'patient' && _.get(ctms, 'startDate', null)), "startDate", null)).format('YYYY-MM-DD') : null,
               physician:  _.get(_.head(_.compact(_.get(he, "careTeam", []).map(ct => _.get(carePath, "careTeamMemberships", []).find(ctms => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "physician" && _.get(ctms, 'startDate', null))))), 'startDate', null) ? this.api.moment( _.get(_.head(_.compact(_.get(he, "careTeam", []).map(ct => _.get(carePath, "careTeamMemberships", []).find(ctms => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "physician" && _.get(ctms, 'startDate', null))))), 'startDate', null)).format('YYYY-MM-DD') : null,
               specialist: _.get(_.head(_.compact(_.get(he, "careTeam", []).map(ct => _.get(carePath, "careTeamMemberships", []).find(ctms => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "specialist" && _.get(ctms, 'startDate', null))))), 'startDate', null) ? this.api.moment( _.get(_.head(_.compact(_.get(he, "careTeam", []).map(ct => _.get(carePath, "careTeamMemberships", []).find(ctms => ctms.careTeamMemberId === ct.id && ct.careTeamMemberType === "specialist" && _.get(ctms, 'startDate', null))))), 'startDate', null)).format('YYYY-MM-DD') : null,
               mutuality: _.get(_.get(carePath, "careTeamMemberships", []).find(ctms => _.get(ctms, 'membershipType', null) === 'mutuality' && _.get(ctms, 'startDate', null)), "startDate", null) ? this.api.moment(_.get(_.get(carePath, "careTeamMemberships", []).find(ctms => _.get(ctms, 'membershipType', null) === 'mutuality' && _.get(ctms, 'startDate', null)), "startDate", null)).format('YYYY-MM-DD') : null
           })

           this.set('activationDateAsString', {
               start: _.get(carePath, 'openingDate', null) ? this.api.moment(_.get(carePath, 'openingDate', null)).format('YYYY-MM-DD') : null,
               end: _.get(carePath, 'closingDate', null) ? this.api.moment(_.get(carePath, 'closingDate', null)).format('YYYY-MM-DD') : null,
           })

           this.set('deadlineDateAsString', _.get(carePath, 'deadlineDate', null) ? this.api.moment(_.get(carePath, 'deadlineDate', null)).format('YYYY-MM-DD') : null)

           !_.isEmpty(he) ? this.set('selectedCarePathType', this.carePathList.find(cp => he.codes.find(c => c.code === cp.linkedHe.code))) : null

       })
       .then(() => this.api.contact().findBy(this.user.healthcarePartyId,this.patient))
       .then(ctcs => {
           console.log(ctcs)
           const serviceIds = _.flatten(_.get(this, 'contacts', []).filter(ctc => _.get(ctc, 'subContacts', []).find(sctc => _.get(sctc, 'planOfActionId', "") === _.get(this.selectedCarePath, 'id', null))).map(ctc => _.get(_.get(ctc, 'subContacts', []).find(sctc => _.get(sctc, 'planOfActionId', "") === _.get(this.selectedCarePath, 'id', null)), 'services', []))).map(svc => svc.serviceId)
           this.set('selectedCarePath.linkedProcedures', _.flatten(_.get(this, 'contacts', []).map(ctc => _.get(ctc, 'services', []))).filter(svc => serviceIds.find(s => s === svc.id)))
       })
       .then(() => this._getDocuments())
       .then(availableDocument => this.set("availableDocumentList", availableDocument.map(ad => ad.document)))
       .then(() => {
           let prom = Promise.resolve([]);
           const encryptedDocumentIds = _.uniq(_.compact(_.flatten(_.map(_.get(this.selectedCarePath, "encryptedDocumentsId", [])))))
           _.map(encryptedDocumentIds, encryptedDocId => {
               prom = prom.then(promisesCarrier => this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject("decrypt", _.get(this,"user",{}), _.get(this,"patient",{}), this.api.crypto().utils.text2ua(Base64.decode(_.trim(encryptedDocId))))
                   .then(uaDecryptedContent => _.concat(promisesCarrier, {encryptedDocId: encryptedDocId, decryptedDocId: this.api.crypto().utils.ua2text(uaDecryptedContent)}))
                   .catch(()=>_.concat(promisesCarrier, {encryptedDocId: encryptedDocId, decryptedDocId: encryptedDocId}))
               )
           })
           return prom.then(decryptedDocIds => decryptedDocIds)
       })
       .then(decryptedDocId => {
           this.set('selectedCarePath.linkedDocuments', decryptedDocId.map(docId => this.availableDocumentList.find(doc => doc.id === docId.decryptedDocId)))
           _.get(this.selectedCarePath, 'linkedDocuments', []).map(doc => this.splice('availableDocumentList', _.indexOf( _.get(this, 'availableDocumentList', []), _.get(this, 'availableDocumentList', []).find(ldoc => ldoc.id === doc.id)), 1))
       })
       .then(() => this.api.hcparty().getCurrentHealthcareParty())
       .then(hcp => {
           const addressData = _.find(_.get(hcp,"addresses",[]), {addressType:"work"}) || _.find(_.get(hcp,"addresses",[]), {addressType:"home"}) || _.get(hcp,"addresses[0]",[])
           this.set('hcp',  _.merge({}, hcp, {
                   address: [ _.trim(_.get(addressData,"street","")), _.trim(_.get(addressData,"houseNumber","")) + (!!_.trim(_.get(addressData,"postboxNumber","")) ? "/" + _.trim(_.get(addressData,"postboxNumber","")) : "") ].join(", "),
                   postalCode: _.trim(_.get(addressData,"postalCode","")),
                   city: this._upperFirstAll(_.trim(_.get(addressData,"city",""))),
                   country: this._upperFirstAll(_.trim(_.get(addressData,"country",""))),
                   phone: _.trim(_.get(_.find(_.get(addressData,"telecoms",[]), {"telecomType":"phone"}), "telecomNumber", "")),
                   mobile: _.trim(_.get(_.find(_.get(addressData,"telecoms",[]), {"telecomType":"mobile"}), "telecomNumber", "")),
                   email: _.trim(_.get(_.find(_.get(addressData,"telecoms",[]), {"telecomType":"email"}), "telecomNumber", "")),
                   firstName: this._upperFirstAll(_.get(hcp,"firstName","")),
                   lastName: this._upperFirstAll(_.get(hcp,"lastName","")),
                   nihiiHr: this.api.formatInamiNumber(_.trim(_.get(hcp,"nihii",""))),
                   ssinHr: this.api.formatSsinNumber(_.trim(_.get(hcp,"ssin",""))),
                   bankAccount: _.trim(_.get(hcp, "bankAccount", "")),
                   cbe: _.trim(_.get(hcp, 'cbe', ''))
               })
           )
       })
       .then(() => this._getProcedurePackage())
       .then(packageOfProcedure => this.set('packageOfProcedure', packageOfProcedure))
       .then(() => this.api.code().findCodes('be', "CD-LIFECYCLE"))
       .then(lifeCycleCodes => this.set("availableLifeCycleCodes", lifeCycleCodes))
       .finally(() => {
           this.set('availablePackageOfProcedure', _.get(this, 'packageOfProcedure', []).filter(pack => _.get(pack, 'qualifiedLinks.relatedCode', null).find(code => code === _.get(_.get(this, 'selectedHealthElement.codes', []).find(c => c.type === "BE-THESAURUS"), 'id', null))))
           this.set('contactsOfCarePath',this.contacts.filter(c => c.healthElements && c.healthElements.find(eh => eh.codes && eh.codes.find(c => c.type === "BE-THESAURUS" && c.id === _.get(this.selectedCarePathType, 'linkedHe.id', null)))).map(c => _.merge(c, {contactYear: this.api.moment(c.openingDate).format('YYYY')})))
           this._initializeChartsDataProvider()
           this.$['care-path-detail'].open()
       })
  }

  _getProcedurePackage(){
      return this.api.code().findCodes('be', 'care.topaz.procedurepackage.carepath')
          .then(packageOfProcedure => Promise.all([packageOfProcedure, this.api.code().getCodes(_.uniq(_.flatten(packageOfProcedure.map(p => p.links))).join(','))]))
          .then(([packageOfProcedure, procedureList]) => packageOfProcedure.map(p => _.merge(p, {linkedProcedure:_.get(p, 'links', []).map(link =>  procedureList.find(pl => pl.id === link))})))
          .catch(e => 'Error during recovery of package of procedure: '+e)

  }

  _getDocuments(){
      return this.api.contact().findBy( _.trim(_.get(this,"user.healthcarePartyId","")), this.patient )
          .then(patientContacts => _.compact(_.flatten(_.map(patientContacts, singleContact => _.map(singleContact.services, singleService => !_.trim(_.get(singleService,"content." + this.language + ".documentId")) ? false : {
              contact: singleContact,
              service: singleService,
              serviceTitle: _.trim(_.get(singleService,"content." + this.language + ".stringValue")),
              formId: _.trim(_.get(singleService,"formId")),
              date: parseInt(_.get(singleService,"valueDate")),
              dateAndTimeHr: moment(parseInt(_.trim(_.get(singleService,"valueDate")).substring(0,8)),"YYYYMMDD").format('DD/MM/YYYY') + " - " + _.trim(_.get(singleService,"valueDate")).substring(8,10) + ":" + _.trim(_.get(singleService,"valueDate")).substring(10,12),
              documentId: _.trim(_.get(singleService,"content." + this.language + ".documentId"))
          })))))
          .then(foundServices => !_.size(foundServices) ? Promise.resolve([foundServices, []]) : this.api.document().getDocuments({ids:_.map(foundServices,s=>s.documentId)}).then(foundDocuments=>[foundServices,foundDocuments]))
          .then(([foundServices,foundDocuments]) => _.compact(_.map(foundServices, fs => {
              const serviceDocument = _.find(foundDocuments, {id: _.trim(_.get(fs, "documentId"))})
              const documentExtension = _.trim(_.last(_.trim(_.get(serviceDocument,"name","")).split("."))).toLowerCase()
              return (
                  ['jpg','jpeg','pdf','png','tif','tiff'].indexOf(documentExtension) === -1 ||
                  !_.trim(_.get(serviceDocument,"id","")) ||
                  !_.trim(_.get(serviceDocument,"attachmentId","")) ||
                  !_.trim(_.get(serviceDocument,"secretForeignKeys",""))
              ) ? false : _.merge({}, _.omit(fs, ['documentId']), {document: serviceDocument})
          })))
          .then(servicesAndDocuments => Promise.all(servicesAndDocuments.map(sad => this.api.crypto().extractKeysFromDelegationsForHcpHierarchy(_.get(this, "user.healthcarePartyId", null), _.trim(_.get(sad.document, "id", "")), _.size(_.get(sad.document, "encryptionKeys", [])) ? _.get(sad.document, "encryptionKeys", []) : _.get(sad.document, "delegations", []))
                  .then(({extractedKeys: enckeys}) => !!_.trim(_.get(sad.document,"id","")) && _.trim(_.get(sad.document,"attachmentId","")) ? this.api.document().getAttachment(_.trim(_.get(sad.document,"id","")), _.trim(_.get(sad.document,"attachmentId","")), enckeys.join(',')).then(decryptedContent=>(_.merge(sad, {document:{decryptedContent:decryptedContent}}))).catch(e=>{console.log("ERROR with getAttachment: ",e); }) : sad)
              )).then(servicesAndDocuments => servicesAndDocuments)
          )
          .then(servicesAndDocuments => _
              .chain(servicesAndDocuments)
              .filter(i => !!_.trim(_.get(i,"document.id")) && !!parseInt(_.get(i,"document.decryptedContent.byteLength")) )
              .orderBy(['date'], ['desc'])
              .value()
          )
  }

  _toggleCollapseDocumentPreview(e) {
      const promResolve = Promise.resolve();
      const targetButton = !!_.size(_.get(e,"target","")) && _.get(e,"target.nodeName","") === "PAPER-BUTTON" ? _.get(e,"target",{}) : _.find( _.get(e,"path",[]), p => _.get(p,"nodeName","") === "PAPER-BUTTON")
      const documentId = _.trim(_.get(targetButton,"dataset.documentId"))
      return !_.trim(documentId) ? promResolve : promResolve
          .then(()=> _.trim(_.get(this,"_currentPreviewDocumentId","")) === documentId ? this.set("_currentPreviewDocumentId", "") : this.set("_currentPreviewDocumentId", documentId) )
          .then(()=>{
              const targetPdfPreviewPdfElement = this.shadowRoot.querySelector("#document-preview-" + documentId) && this.shadowRoot.querySelector("#document-preview-" + documentId).shadowRoot.querySelector("pdf-element")
              return typeof _.get(targetPdfPreviewPdfElement,"onWidthChange","") === "function" ? targetPdfPreviewPdfElement.onWidthChange() : false
          })
  }

  _isEqual(a, b) {
      return !!(a===b)
  }

  _initializeChartsDataProvider(){
      this.set('dataForCharts', [
          {
              chartType: 'bmiChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels: _.compact(_.flatten(this.contactsOfCarePath.map(ctc => _.get(ctc, 'services', []).filter(s => _.get(s, 'tags', [])))).map(s => s.tags.find(t => t.type === "CD-PARAMETER" && t.code === "bmi") ? this.api.moment(_.get(s, 'created', null), "YYYYMMDD").format('DD/MM/YYYY') : null)) || [],
                      datasets: [{
                          label: "BMI",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contactsOfCarePath.map(ctc => _.get(ctc, 'services', []).filter(s => _.get(s, 'tags', [])))).map(s => s.tags.find(t => t.type === "CD-PARAMETER" && t.code === "bmi") ? _.get(s, 'content.fr.numberValue', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"}]},
                  options: {}
              }
          },
          {
              chartType: 'cholesterolChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("CHO-LDL / CHO-HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTASE") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL LDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL LDL  CALCULE") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL LIE AUX L.D.L") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL LIE AUX VLDV") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL NON HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL TOTAL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL TOTAL/HDL") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol hdl") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol ldl") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol ldl calcul,") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol ldl calcul,") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol non hdl") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol total") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol total/hdl,")) ? this.api.moment(_.get(s, 'valueDate', null), "YYYYMMDD").format('DD/MM/YYYY') : null)) || [],
                      datasets: [
                          {
                          label: "Cholestérol",
                              fillColor: "transparent",
                              data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("CHO-LDL / CHO-HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTASE") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL LDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL LDL  CALCULE") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL LIE AUX L.D.L") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL LIE AUX VLDV") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL NON HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL TOTAL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL TOTAL/HDL") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol hdl") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol ldl") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol ldl calcul,") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol ldl calcul,") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol non hdl") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol total") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol total/hdl,")) ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                              lineTension: 0.1,
                              backgroundColor: "rgba(255,99,132,0.2)",
                              borderColor: "rgba(254,99,132,2)"
                          }]
                  },
                  options: {}}
                  },
          {
              chartType: 'creatinineChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine/24h") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine / 24 H. ur") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (g/24h)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (idms)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (old u.)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine sg") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (s/p)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine ur") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (unrines)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (urine 24h)")) ? this.api.moment(_.get(svc, 'valueDate', null), "YYYYMMDD").format('DD/MM/YYYY') : null)) || [],
                      datasets: [{
                      label: "Créatinine sanguine",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine/24h") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine / 24 H. ur") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (g/24h)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (idms)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (old u.)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine sg") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (s/p)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine ur") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (unrines)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("creatinine (urine 24h)")) ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"}]},
                  options: {}
              }
           },
          {
              chartType: 'hemoglobinChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => _.get(svc, 'label', null) === "Hémoglobine" ? this.api.moment(_.get(svc, 'valueDate', null), "YYYYMMDD").format("DD/MM/YYYY") : null)) || [],
                      datasets: [{
                      label: "Hémoglobine glyquée",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => _.get(svc, 'label', null) === "Hémoglobine" ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"}]},
                  options: {}
              }
          },
          {
              chartType: 'egfrChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels:  _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("eGfr")) ? this.api.moment(_.get(svc, 'valueDate', null), "YYYYMMDD").format('DD/MM/YYYY') : null)) || [],
                      datasets: [{
                      label: "eGFR",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("eGfr"))  ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"}]},
                  options: {}
              }
          },
          {
              chartType: 'vitaminChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels:  _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d") || _.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d 25-oh") || _.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d (25-oh-d)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d (25oh-d3)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d (25-oh-d3 et d2)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("25-OH Vitamine D3")) ? this.api.moment(_.get(svc, 'valueDate', null), "YYYYMMDD").format('DD/MM/YYYY') : null)) || [],
                      datasets: [{
                      label: "25-OH-Vitamine D3",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d") || _.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d 25-oh") || _.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d (25-oh-d)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d (25oh-d3)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("vitamine d (25-oh-d3 et d2)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("25-OH Vitamine D3")) ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"}]},
                  options: {}
              }
          },
          {
              chartType: 'bloodPresureChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels: _.compact(_.flatten(this.contactsOfCarePath.map(ctc => _.get(ctc, 'services', []).filter(s => _.get(s, 'tags', [])))).map(s => s.tags.find(t => t.type === "CD-PARAMETER" && t.code === "dbp") ? this.api.moment(_.get(s, 'created', null), "YYYYMMDD").format('DD/MM/YYYY') : null)),
                      datasets: [{
                          label: "Tension systolique",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contactsOfCarePath.map(ctc => _.get(ctc, 'services', []).filter(s => _.get(s, 'tags', [])))).map(s => s.tags.find(t => t.type === "CD-PARAMETER" && t.code === "sbp") ? _.get(s, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"
                      },{
                          label: "Tension diastolique",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contactsOfCarePath.map(ctc => _.get(ctc, 'services', []).filter(s => _.get(s, 'tags', [])))).map(s => s.tags.find(t => t.type === "CD-PARAMETER" && t.code === "dbp") ? _.get(s, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(28,101,254,0.2)",
                          borderColor: "rgb(28,101,254)"
                      }]
                  },
                  options: {}
              }
          },
          {
              chartType: 'microAlbumenChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("microalb./creatinine") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbumine") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbumine/crea") || _.toLower(_.get(svc, 'label', null)) === _.toLower("micro-albuminurie") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbuminurie / creatininurie") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbuminurie débit") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbuminurie debit") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbuminurie / volume")) ? this.api.moment(_.get(svc, 'valueDate', null), "YYYYMMDD").format("DD/MM/YYYY") : null)) || [],
                      datasets: [{
                          label: "Microalbuminurie",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("microalb./creatinine") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbumine") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbumine/crea") || _.toLower(_.get(svc, 'label', null)) === _.toLower("micro-albuminurie") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbuminurie / creatininurie") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbuminurie débit") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbuminurie debit") || _.toLower(_.get(svc, 'label', null)) === _.toLower("microalbuminurie / volume")) ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"}]},
                  options: {}
              }
          },
          {
              chartType: 'ldlCholesterolChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels:  _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("CHO-LDL / CHO-HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL TOTAL/HDL") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol hdl") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol total/hdl,")) ? this.api.moment(_.get(svc, 'valueDate', null), "YYYYMMDD").format("DD/MM/YYYY") : null)) || [],
                      datasets: [{
                          label: "LDL-Cholestérol",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null)) === _.toLower("CHO-LDL / CHO-HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL HDL") || _.toLower(_.get(svc, 'label', null)) === _.toLower("CHOLESTEROL TOTAL/HDL") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol hdl") || _.toUpper(_.get(svc, 'label', null)) === _.toUpper("cholestérol total/hdl,")) ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,99,132,0.2)",
                          borderColor: "rgba(254,99,132,2)"}]},
                  options: {}
              }
          },
          {
              chartType: 'hba1cChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null) === "hba1c") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hba1c") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb81") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c glycosylee") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c glycosylee (dcct)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c (ifcc)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c (ngsp/dcct)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c (si/ifcc)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hbc anticorps") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee (glyquee)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee ifcc") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee (ngsp)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee (si pas de diabete connu)")) ? this.api.moment(_.get(svc, 'valueDate', null), "YYYYMMDD").format("DD/MM/YYYY") : null)) || [],
                      datasets: [{
                          label: "Hémoglobine",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services',[]))).map(svc => (_.toLower(_.get(svc, 'label', null) === "hba1c") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hba1c") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb81") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c glycosylee") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c glycosylee (dcct)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c (ifcc)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c (ngsp/dcct)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb a1c (si/ifcc)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hbc anticorps") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee (glyquee)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee ifcc") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee (ngsp)") || _.toLower(_.get(svc, 'label', null)) === _.toLower("hb glycosylee (si pas de diabete connu)")) ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1, backgroundColor: "rgba(255,99,132,0.2)", borderColor: "rgba(254,99,132,2)"}]
                  },
                  options: {}
              }
          },
          {
              chartType: 'glycemicChart',
              chartInfo: {
                  type: 'line',
                  data: {
                      labels: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services', []))).map(svc => (_.toLower(_.get(svc, 'label', null) === "Glycémie") || _.toLower(_.get(svc, 'label', null) === "GLYCEMIE") || _.toLower(_.get(svc, 'label', null)) === _.toLower("GLYCEMIE SER.") || _.toLower(_.get(svc, 'label', null)) === _.toLower("GLYC,MIE") || _.toLower(_.get(svc, 'label', null)) === _.toLower("GLYCEMIE (VALEUR)")) ? this.api.moment(_.get(svc, 'valueDate', null), "YYYYMMDD").format("DD/MM/YYYY") : null)) || [],
                      datasets: [{
                          label: "Glycémie",
                          fillColor: "transparent",
                          data: _.compact(_.flatten(this.contacts.map(ctc => _.get(ctc, 'services', []))).map(svc => (_.toLower(_.get(svc, 'label', null) === "Glycémie") || _.toLower(_.get(svc, 'label', null) === "GLYCEMIE") || _.toLower(_.get(svc, 'label', null)) === _.toLower("GLYCEMIE SER.") || _.toLower(_.get(svc, 'label', null)) === _.toLower("GLYC,MIE") || _.toLower(_.get(svc, 'label', null)) === _.toLower("GLYCEMIE (VALEUR)")) ? _.get(svc, 'content.fr.measureValue.value', null) : null)) || [],
                          lineTension: 0.1, backgroundColor: "rgba(255,99,132,0.2)", borderColor: "rgba(254,99,132,2)"
                      }]
                  },
                  options: {}
              }
          }
      ])

  }

  _closeDialogs(){
      this.set('linkBtnAvailable', false)
      this.set('unlinkBtnAvailable', false)
      this.set('selectedDocumentId', null)
      this.set('selectedCarePath', {})
      this.set('selectedCarePathType', {})
      this.set('selectedPackageOfProcedure', {})
      this.set('carePathList', [])
      this.set('availableCareTeam', [])
      this.set('contactsOfCarePath', [])
      this.set('selectableEhealthElements', [])
      this.set('agreementsDateAsString', [])
      this.set('activationDateAsString', [])
      this.set('deadlineDateAsString', null)
      this.$["care-path-detail"].close()
      this.dispatchEvent(new CustomEvent('closing-care-path', {bubbles: true, composed: true}))
  }

  _getCurrentCareTeam(){
      return this.api.patient().getPatientWithUser(this.user, this.patient.id)
          .then(patient => this.api.register(patient, 'patient'))
          .then(patient => Promise.all([patient, _.keys(patient.delegations).length > 0 ? this.api.hcparty().getHealthcareParties(_.keys(patient.delegations).join(',')) : Promise.resolve([])]))
          .then(([patient, listOfInternalHcp]) => Promise.all([listOfInternalHcp, patient.patientHealthCareParties.length > 0 ? this.api.hcparty().getHealthcareParties(patient.patientHealthCareParties.map(hcp => hcp.healthcarePartyId).join(',')) : Promise.resolve([])]))
          .then(([listOfInternalHcp, listOfExternalHcp]) => {
              return _.uniqBy(_.merge(listOfInternalHcp, listOfExternalHcp), 'id').map(hcp => _.assign(hcp, {displayedName: _.get(hcp, 'firstName', '')+' '+_.get(hcp, 'lastName', '')+' - '+this.api.formatInamiNumber(_.get(hcp, 'nihii', ''))+' - '+this.localize('cd-hcp-'+_.get(hcp, 'speciality', ''), _.get(hcp, 'speciality', ''), this.language)}))
          })
  }

  _isPregnant(){
      const pregnantElements = this.activeHealthElements.filter(he => he.codes.find(c => c.type === "ICPC" && (c.code === "W78" || c.code === "W79" || c.code === "W80"|| c.code === "W84"))) || []
      return pregnantElements.length > 0 ? true : false
  }

  _isDiabetesTypeOne(){
      const typeOneDiabetesElements =  this.activeHealthElements.filter(he => he.codes.find(c => c.type === "BE-THESAURUS" && c.code === "10025767")) || []
      return typeOneDiabetesElements.length > 0 ? true : false
  }

  _formatDate(date){
      return date ? this.api.moment(date).format('DD/MM/YYYY') : null
  }

  _ageFormat(date) {
      return date ? this.api.getCurrentAgeFromBirthDate(date,( e , s ) => this.localize(e, s, this.language)) : '';
  }

  _toggleAddActions() {
      this.showMoreOptionContainer = !this.showMoreOptionContainer;
  }

  _actionIcon(showMoreOptionContainer) {
      return showMoreOptionContainer ? 'icons:close' : 'icons:more-vert';
  }

  _createContract(){
      this._saveCarePath()
      const pdfTemplate = this.isRenal() === true ? this._getRenalPdfContent() : this._getDiabetesPdfContent()
      this.api.pdfReport(pdfTemplate, {type:"unknown",completionEvent:"pdfDoneRenderingEvent"})
          .then(printedPdf => !printedPdf.printed && this.api.triggerFileDownload( printedPdf.pdf, "application/pdf", _.kebabCase(_.trim(moment().format("YYYYMMDD"))) + "-" +_ .trim("prevention",this.api.crypto().randomUuid())) + ".pdf" )
  }

  _selectedCarePathTypeChanged(){
      if(this.selectedCarePathType){
          this.set('selectedPackageOfProcedure', {})
          this.set("selectableEhealthElements", this.activeHealthElements.filter(he => he.id && he.codes.find(c => c.type === "BE-THESAURUS") && he.codes.find(c => c.code === _.get(this.selectedCarePathType, 'linkedHe.code', null))))
          this.set('selectedHealthElement', this.activeHealthElements.find(he => he.id && he.codes.find(c => c.type === "BE-THESAURUS") && he.codes.find(c => c.code === _.get(this.selectedCarePathType, 'linkedHe.code', null))))
          this.set('contactsOfCarePath', this.contacts.filter(c => c.healthElements && c.healthElements.find(eh => eh.codes && eh.codes.find(c => c.type === "BE-THESAURUS" && c.id === _.get(this.selectedCarePathType, 'linkedHe.id', null)))).map(c => _.merge(c, {contactYear: this.api.moment(c.openingDate).format('YYYY')})))
          this.set('selectedCarePath.type', _.get(this.selectedCarePathType, 'label.'+this.language, null))
          this.set('selectedCarePath.linkedHealthElement', _.get(this, 'selectedHealthElement', {}))
          this.set('availablePackageOfProcedure', _.get(this, 'packageOfProcedure', []).filter(pack => _.get(pack, 'qualifiedLinks.relatedCode', null).find(code => code === _.get(_.get(this, 'selectedHealthElement.codes', []).find(c => c.type === "BE-THESAURUS"), 'id', null))))
          this._initializeChartsDataProvider()
      }
  }


  _getHeDescr(he){
      return _.get(_.get(he, 'codes', []).find(c => c.type === "ICPC"), 'code', "")+' - '+_.get(he, 'descr', "")
  }

  _isSelectableHealthElements(){
      return this.selectableEhealthElements.length > 0 ? true : false
  }

  _isSelectedHealthElement(){
      return !_.isEmpty(this.selectedHealthElement)
  }

  isRenal(){
      return _.get(this.selectedHealthElement, 'codes', []).find(c => c.type === "BE-THESAURUS" && c.code === "10119104") ? true : false
  }

  _checkPatientAge(){
      return parseInt(_.trim(this._ageFormat(this.patient.dateOfBirth)).replace(/\D/g, '')) >= 18 ? true : false
  }

  _showAddDocument(){
      this.isLinkedDocumentView ===  true ? this.set('isLinkedDocumentView', false) : this.set('isLinkedDocumentView', true)
  }

  _selectedTeamPhysicianChanged(){
      if(this.selectedTeamPhysician){
          this.push('selectedCarePath.careTeam.physician', this.selectedTeamPhysician)
          this.shadowRoot.querySelector('#physician-team')._clear() || false
      }
  }

  _selectedTeamSpecialistChanged(){
      if(this.selectedTeamSpecialist){
          this.push('selectedCarePath.careTeam.specialist', this.selectedTeamSpecialist)
          this.shadowRoot.querySelector('#specialist-team')._clear() || false
      }
  }

  _selectedTeamOtherChanged(){
      if(this.selectedTeamOther){
          this.push('selectedCarePath.careTeam.other', this.selectedTeamOther)
          this.shadowRoot.querySelector('#other-team')._clear() || false
      }
  }

  _removePhysicianFromTeam(e){
      this.splice('selectedCarePath.careTeam.physician', _.indexOf(_.get(this.selectedCarePath,'careTeam.physician', []), _.get(this.selectedCarePath,'careTeam.physician', []).find(h => h.id === e.target.id)), 1)
  }

  _removeSpecialistFromTeam(e){
      this.splice('selectedCarePath.careTeam.specialist', _.indexOf(_.get(this.selectedCarePath, 'careTeam.specialist', []), _.get(this.selectedCarePath, 'careTeam.specialist', []).find(h => h.id === e.target.id)), 1)
  }

  _removeOtherFromTeam(e){
      this.splice('selectedCarePath.careTeam.other', _.indexOf(_.get(this.selectedCarePath, 'careTeam.other', []), _.get(this.selectedCarePath, 'careTeam.other', []).find(h => h.id === e.target.id)), 1)
  }

  _activationDateChanged(){
      if(_.get(this.activationDateAsString,'start', null)){
          this.set("deadlineDateAsString", this.api.moment(_.get(this.activationDateAsString,'start', null)).add(3, 'Y').format('YYYY-MM-DD'))
      }
  }

  _getYearOfContact(){
      return _.keys( _.groupBy(this.contactsOfCarePath, 'contactYear'))
  }

  _getContactFromYear(contacts, year){
      return _.get(_.groupBy(contacts, 'contactYear'), year, [])
  }

  _getNumberOfContacts(contacts, year){
      return _.size(_.get(_.groupBy(contacts, 'contactYear'), year, []))
  }

  _initializeCharts(tabs){
      if(tabs === 3){

          this.dataForCharts.map(chart => {
              this.shadowRoot.querySelector("#"+_.get(chart, 'chartType', null)) ?
                  new Chart(this.shadowRoot.querySelector("#"+_.get(chart, 'chartType', null)), {
                  type: _.get(chart, 'chartInfo.type', 'line'),
                  data: _.get(chart, 'chartInfo.data', {}),
                  options: {
                      responsive: true,
                      aspectRatio: 3,
                      maintainAspectRatio: false
                  }
              }) : null
          })
      }
  }

  _dateAsStringChanged(){
      this.set('selectedCarePath.agreementsDate', {
          patient: _.get(this.agreementsDateAsString, 'patient', null) ? parseInt(this.api.moment(_.get(this.agreementsDateAsString, 'patient', null)).format('YYYYMMDD')) : null,
          mutuality: _.get(this.agreementsDateAsString, 'mutuality', null) ? parseInt(this.api.moment(_.get(this.agreementsDateAsString, 'mutuality', null)).format('YYYYMMDD')) : null,
          physician: _.get(this.agreementsDateAsString, 'physician', null) ? parseInt(this.api.moment(_.get(this.agreementsDateAsString, 'physician', null)).format('YYYYMMDD')): null,
          specialist: _.get(this.agreementsDateAsString, 'specialist', null) ? parseInt(this.api.moment(_.get(this.agreementsDateAsString, 'specialist', null)).format('YYYYMMDD')) : null,
      })
      this.set('selectedCarePath.startDate', _.get(this.activationDateAsString, 'start', null) ? parseInt(this.api.moment(_.get(this.activationDateAsString, 'start', null)).format('YYYYMMDD')) : null)
      this.set('selectedCarePath.endDate',  _.get(this.activationDateAsString, 'end', null) ? parseInt(this.api.moment(_.get(this.activationDateAsString, 'end', null)).format('YYYYMMDD')): null)
      this.set('selectedCarePath.deadlineDate', _.get(this, 'deadlineDateAsString', null) ? parseInt(this.api.moment(_.get(this, 'deadlineDateAsString', null)).format('YYYYMMDD')) : null)
  }

  _saveCarePath(){
      const promResolve = Promise.resolve();
      let careTeamMemberships = []
      if(!_.isEmpty(_.get(this.selectedCarePath, 'linkedHealthElement', {})) && _.get(this.selectedCarePath, 'startDate', null) !== null && _.get(this,"selectedCarePath.type", null) !== null){
          this.api.helement().getHealthElement(_.get(this.selectedCarePath, 'linkedHealthElement.id', null))
              .then(he => {
                  he.careTeam = _.concat(he.careTeam, _.compact(_.concat(this.selectedCarePath.careTeam.physician.map(hcp => _.assign(hcp, {careTeamMemberType: 'physician'})),
                      this.selectedCarePath.careTeam.specialist.map(hcp => _.assign(hcp, {careTeamMemberType: 'specialist'})),
                      this.selectedCarePath.careTeam.other.map(hcp => _.assign(hcp, {careTeamMemberType: 'other'}))).map(hcp => {
                      return !_.get(he, 'careTeam', []).find(ct => _.get(ct, 'healthcarePartyId', null) === hcp.id) ? {
                             id: this.api.crypto().randomUuid(),
                             healthcarePartyId: _.get(hcp, 'id', null),
                             quality: _.get(hcp, 'specialityCodes', []).length ? {
                                 code: _.get(_.head(_.get(hcp, 'specialityCodes', [])), 'code', null),
                                 type: _.get(_.head(_.get(hcp, 'specialityCodes', [])), 'type', null),
                                 version: _.get(_.head(_.get(hcp, 'specialityCodes', [])), 'version', null),
                                 id: _.get(_.head(_.get(hcp, 'specialityCodes', [])), 'id', null)
                             } : null,
                             careTeamMemberType: _.get(hcp, 'careTeamMemberType', null)
                         } : null
                  })))
                  const removedPlanOfAction = !!_.trim(_.get(this.selectedCarePath,"id","")) ? _.head(_.remove(_.get(he,"plansOfAction",[]), {id: _.get(this.selectedCarePath,"id","")})) : null
                  const poaToAdd = {
                      id: !!_.trim(_.get(removedPlanOfAction,"id","")) ? _.trim(_.get(removedPlanOfAction,"id","")) : this.api.crypto().randomUuid(),
                      author: _.trim(_.get(this,"user.id")),
                      responsible: _.trim(_.get(this,"user.healthcarePartyId")),
                      openingDate: _.trim(_.get(this,"selectedCarePath.startDate","")) ? parseInt(this.api.moment(_.trim(_.get(this,"selectedCarePath.startDate",""))).format('YYYYMMDDhhmmss')) : parseInt(moment().format('YYYYMMDDHHmmss')),
                      closingDate: _.trim(_.get(this,"selectedCarePath.endDate","")) ? parseInt(this.api.moment(_.trim(_.get(this,"selectedCarePath.endDate",""))).format('YYYYMMDDhhmmss')) : null,
                      endOfLife: parseInt(_.trim(_.get(this,"selectedCarePath.endDate",""))) || null,
                      name: _.trim(_.get(this,"selectedCarePath.type","")),
                      idOpeningContact: _.get(removedPlanOfAction, 'idOpeningContact', '') ?  _.get(removedPlanOfAction, 'idOpeningContact', '') : _.trim(_.get(this.currentContact,"id","")),
                      created: !!_.trim(_.get(removedPlanOfAction,"created","")) ? parseInt(_.trim(_.get(removedPlanOfAction,"created",""))) : +new Date,
                      modified: +new Date,
                      deadlineDate: _.trim(_.get(this,"selectedCarePath.deadlineDate", "")) ? parseInt(this.api.moment(_.trim(_.get(this,"selectedCarePath.deadlineDate", ""))).format("YYYYMMDDhhmmss")) : null,
                      agreementDate: _.get(this, 'selectedCarePath.agreementsDate', {}),
                      codes: [],
                      tags: [],
                      careTeamMemberships: _.compact(_.concat(_.concat(_.get(this, 'selectedCarePath.careTeam.physician', []).map(hcp => _.assign(hcp, {careTeamMemberType: 'doctor'})), _.get(this, 'selectedCarePath.careTeam.specialist', []).map(hcp => _.assign(hcp, {careTeamMemberType: 'specialist'})), _.get(this, 'selectedCarePath.careTeam.other', []).map(hcp => _.assign(hcp, {careTeamMemberType: 'other'}))).map(hcp => {
                          return {
                              careTeamMemberId: _.get(_.get(he, 'careTeam', []).find(ct => ct.healthcarePartyId === hcp.id), 'id', null),
                              membershipType: _.get(hcp, 'careTeamMemberType', null),
                              startDate: _.get(_.get(he, 'careTeam', []).find(ct => ct.healthcarePartyId === hcp.id), 'careTeamMemberType', null) === 'physician' ?
                                  parseInt(_.padEnd(_.get(this, 'selectedCarePath.agreementsDate.physician', null), 14, 0)) :
                                  _.get(_.get(he, 'careTeam', []).find(ct => ct.healthcarePartyId === hcp.id), 'careTeamMemberType', null) === 'specialist' ?
                                      parseInt(_.padEnd(_.get(this, 'selectedCarePath.agreementsDate.specialist', null), 14, 0)) :
                                      null
                          }
                      }), [
                          _.get(this, 'selectedCarePath.agreementsDate.patient', null) ? {membershipType: 'patient', startDate: parseInt(_.padEnd(_.get(this, 'selectedCarePath.agreementsDate.patient', null), 14, 0))} : null,
                          _.get(this, 'selectedCarePath.agreementsDate.mutuality', null) ? {membershipType: 'mutuality', startDate: parseInt(_.padEnd(_.get(this, 'selectedCarePath.agreementsDate.mutuality', null), 14, 0))} : null
                      ])),
                      documentIds: _.get(this, 'selectedCarePath.linkedDocuments', []).map(doc => doc.id),
                      prescriberId: _.trim(_.get(this,"user.healthcarePartyId")),
                      status: !!_.trim(_.get(removedPlanOfAction,"status","")) ? parseInt(_.trim(_.get(removedPlanOfAction,"status",""))) : 1 << 1,
                  }

                  return !_.size(_.get(poaToAdd,"documentIds",[])) ? ([he, poaToAdd]) :
                      Promise.all(_.map(poaToAdd.documentIds, docId =>
                          this.api.encryptDecryptFileContentByUserHcpIdAndDocumentObject( "encrypt", _.get(this,"user",{}), _.get(this,"patient",{}), this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(docId)))
                              .then(encryptedContent => Base64.encode(String.fromCharCode.apply(null, new Uint8Array(encryptedContent))))
                              .catch(()=>docId)))
                          .then(encryptedDocumentIds => ([he, _.merge(poaToAdd, {documentIds: _.uniq(_.compact(encryptedDocumentIds||[]))})]))
              })
              .then(([he, poaToAdd]) => {
                  const alreadyHasPlanOfActionsKey = _.keys(he).indexOf("plansOfAction") > -1 && Array.isArray(_.get(he,"plansOfAction","notOfTypeArray"))
                  if(!!alreadyHasPlanOfActionsKey) { he.plansOfAction.push(poaToAdd) } else { this.set('selectedHealthElement',  _.merge({},he, {plansOfAction: [poaToAdd]})) }
                  !!_.trim(_.get(this.selectedCarePath,"id","")) ? _.trim(_.get(this.selectedCarePath,"id","")) : this.set('selectedCarePath.id', _.get(poaToAdd, 'id', null))
                  return he
              })
              .then(he => !_.trim(_.get(he,"id","")) ? promResolve : this.api.helement().modifyHealthElement(he).then(he=>this.api.register(he, 'helement')))
              .then(he => {
                  console.log(he)
                  this.dispatchEvent(new CustomEvent('save-care-path', {bubbles: true, composed: true}))
              }).catch( e => "Error when saving care path: "+e)

      }
  }

  _selectedPackageOfProcedureChanged(){
      if(this.selectedPackageOfProcedure){
          return setTimeout(() => {
              this.shadowRoot.querySelector('#linkedProcedureList') && this.shadowRoot.querySelector('#linkedProcedureList').render()
          }, 100)
      }
  }

  _getPeriodicity(proc){
      return  this.localize("cd-periodicity-"+_.get(_.get(proc, 'periodicity', []).find(p => _.get(p, 'relatedCode.id', null) === this.selectedPackageOfProcedure.id), 'relatedPeriodicity.code', ""), _.get(_.get(proc, 'periodicity', []).find(p => _.get(p, 'relatedCode.id', null) === this.selectedPackageOfProcedure.id), 'relatedPeriodicity.code', ""), this.language)
  }

  _isSelectedProcedure(){
     return !_.isEmpty(this.selectedProcedure)
  }

  _getProcedureType(linkedProc, procId){
      return linkedProc.filter(proc => proc.codes.find(code => code.id === procId))
  }

  _getRenalPdfContent(){
      const patientInssurance = _
          .chain(_.get(this.patient, "insurabilities",{}))
          .filter((i)=>{
              return i &&
                  !!moment( _.trim(_.get(i, "startDate", "0") ), "YYYYMMDD" ).isBefore(moment()) &&
                  (!!moment( _.trim(_.get(i, "endDate", "0") ), "YYYYMMDD" ).isAfter(moment()) || !_.trim(_.get(i, "endDate", "") ) ) &&
                  !!_.trim( _.get( i, "insuranceId", "" ) )
          })
          .map(i => {return {
              insuranceId: _.trim(_.get(i,"insuranceId","")),
              identificationNumber: _.trim(_.get(i,"identificationNumber","")),
              tc1: _.trim(_.get(i,"parameters.tc1","")),
              tc2: _.trim(_.get(i,"parameters.tc2","")),
              preferentialstatus: typeof _.get(i,"parameters.preferentialstatus") === "boolean" ? !!_.get(i,"parameters.preferentialstatus",false) : _.trim(_.get(i,"parameters.preferentialstatus")) === "true"
          }})
          .head()
          .value()

      let pdfTemplate = ""
      pdfTemplate+="<html>"
      pdfTemplate+="  <head>"
      pdfTemplate+="  <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet'>"
      pdfTemplate+="     <style>"
      pdfTemplate+="       @page {size: A4; width: 210mm; height: 297mm; margin: 0; padding: 0}"
      pdfTemplate+="       body {margin: 0; padding: 0; font-family: /* 'Open Sans', */ Arial, Helvetica, sans-serif; line-height:1em;}"
      pdfTemplate+="       .title{height: 20px; font-size: 14px; width: 100%;}"
      pdfTemplate+="       .sub-title{height: 15px; font-size: 12px; width: 100%;}"
      pdfTemplate+="       .separator{height: 2px; width: 100%; border-bottom: 1px solid black;}"
      pdfTemplate+="       .page {width: 210mm; color:#000000; font-size:12px; padding:10mm; position:relative;}"
      pdfTemplate+="       .textaligncenter { text-align: center; } .textalignleft { text-align: left; } .textalignright { text-align: right; }"
      pdfTemplate+="       .b{font-weight: bold}"
      pdfTemplate+="       .mutuality-block{border: 1px solid black; width: 100%; height: auto;}"
      pdfTemplate+="       .date-signature{height: 30px; width: 100%;}"
      pdfTemplate+="       .border{border: 1px solid black;}"
      pdfTemplate+="       .s10{font-size: 10px;}"
      pdfTemplate+="       .s9{font-size: 9px;}"
      pdfTemplate+="       .condition-block{height: 150px;}"
      pdfTemplate+="       .stamp-date-signature-title{width: 100%}"
      pdfTemplate+="       .stamp-date-signature{width: 100%; height: 55px;}"
      pdfTemplate+="       .check{height: 10px; width: 10px; background-color; black;}"
      pdfTemplate+="       .uncheck{height: 10px; width: 10px;}"
      pdfTemplate+="     </style>"
      pdfTemplate+="  </head>"
      pdfTemplate+="  <body>"
      pdfTemplate+="      <div class='page'>"
      pdfTemplate+="          <div class='title textaligncenter b'>CONTRAT TRAJET DE SOINS INSUFFISANCE RENALE CHRONIQUE</div>"
      pdfTemplate+="          <div class='mutuality-block s9'>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("lastAndFirstName", "Last and first names", this.language)+"</span>: "+_.get(this.patient, "lastName", "")+" "+_.get(this.patient, "firstName", "")+" <span class='b'>"+this.localize("birthDate", "Birthdate", this.language)+"</span>: "+this._formatDate(_.get(this.patient, "dateOfBirth", ""))+" <span class='b'>"+this.localize("ssinPatVerbose", "SSIN", this.language)+"</span>: "+this.api.formatSsinNumber(_.trim(_.get(this.patient,"ssin","")))+"</div>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("address", "Address", this.language)+"</span>: "+_.get(this.patient, "addresses.0.street", "")+" "+_.get(this.patient, "addresses.0.houseNumber", "")+" "+_.get(this.patient, "addresses.0.postboxNumber", "")+" "+_.get(this.patient, "addresses.0.postalCode", "")+" "+_.get(this.patient, "addresses.0.city", "")+"</div>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("adm_in", "Insurance", this.language)+"</span>: "+_.trim(_.get(patientInssurance,"name","-"))+" <span class='b'>Code: </span>"+_.trim(_.get(patientInssurance,"code","-"))+" <span class='b'>CT1/CT2</span>: "+_.trim(_.get(patientInssurance,"tc1","-")) +" - "+ _.trim(_.get(patientInssurance,"tc2","-"))+" <span class='b'>"+this.localize("AFF", "Membership number", this.language)+"</span>: "+_.trim(_.get(patientInssurance,"identificationNumber","-"))+"</div>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='sub-title b s10'>ENGAGEMENTS DU PATIENT</div>"
      pdfTemplate+="          <div class='s10'><span class='b'>NOM DU PATIENT</span> "+_.get(this.patient, "lastName", "")+" "+_.get(this.patient, "firstName", "")+"</div>"
      pdfTemplate+="          <div class='s10'>- Mon médecin généraliste, à qui je demande de transmettre cette demande au médecin-conseil de ma mutualité , m’a expliqué aujourd’hui les conditions du trajet de soins insuffisance rénale chronique ; </div>"
      pdfTemplate+="          <div class='s10'>- J’ai été informé(e) par mon médecin généraliste que les bénéfices et la réussite du trajet de soins dépendent de ma participation active au plan de suivi. Je m’engage à cette fin à définir avec mon médecin généraliste l’organisation pratique de ce suivi optimal; </div>"
      pdfTemplate+="          <div class='s10'>- Mon médecin généraliste et moi-même avons parlé des objectifs du traitement et de la façon de les atteindre en nous basant sur les informations décrites en page 2 du présent contrat ; </div>"
      pdfTemplate+="          <div class='s10'>- Mon médecin généraliste m’a communiqué qu’il/elle transmettra à Sciensano les données codées me concernant qui se rapportent à l’âge, au sexe, au diagnostic rénal, à la tension artérielle, et aux résultats de certains examens sanguins: (hémoglobine, créatinine, e-GFR,), à des fins d’évaluation scientifique et dans le respect des dispositions réglementaires relatives à la vie privée. </div>"
      pdfTemplate+="          <div class='stamp-date-signature-title s10'>"
      pdfTemplate+="              <span class='stamp b' style='margin-left: 100px;'></span>"
      pdfTemplate+="              <span class='date-signature b' style='margin-left: 425px;'>Date et signature</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='stamp-date-signature s10'>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='s10'>Je demande à mon médecin généraliste, signataire du présent contrat, de gérer mon dossier médical global : il/elle doit à cette fin en attester les honoraires dans l’année qui suit le début du trajet de soins. </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='sub-title b s10'>ENGAGEMENTS DU NEPHROLOGUE / DE L’INTERNISTE</div>"
      pdfTemplate+="          <div class='s10'>J’accepte de participer au trajet de soins de ce patient, qui appartient au groupe cible (1), et plus précisément :</div>"
      pdfTemplate+="          <div class='s10'>- d’encadrer, d’un commun accord avec lui, le médecin généraliste lors de l’élaboration, de l’évaluation et de l’adaptation d’un plan de suivi individuel pour le patient présentant une insuffisance rénale chronique; ce plan comprend des objectifs, un suivi planifié, des consultations médicales, des interventions paramédicales et des examens techniques ; </div>"
      pdfTemplate+="          <div class='s10'>- de transmettre les rapports de mes consultations et examens techniques au médecin généraliste ; </div>"
      pdfTemplate+="          <div class='s10'>- d’entretenir, avec le médecin généraliste, une communication efficace, soit à la demande du médecin généraliste, soit à l ‘occasion d’une transmission des paramètres cliniques ou biologiques. </div>"
      pdfTemplate+="          <div class='stamp-date-signature-title s10'>"
      pdfTemplate+="              <span class='stamp b' style='margin-left: 100px;'>Nom + cachet</span>"
      pdfTemplate+="              <span class='date-signature b' style='margin-left: 350px;'>Date et signature</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='stamp-date-signature'>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='s10'>Numéro de compte en banque pour le paiement des honoraires du trajet de soins</div>"
      pdfTemplate+="          <div class='s10'>"
      pdfTemplate+="               <span class='uncheck'></span>Médecin spécialiste:"
      pdfTemplate+="               <span style='margin-left: 404px;'>Numéro de compte:</span><br/>"
      pdfTemplate+="               <span style='margin-left: 501px;'>Numéro BCE:</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='s10'>"
      pdfTemplate+="               <span class='uncheck'></span>Hôpital:"
      pdfTemplate+="               <span style='margin-left: 462px;'>Numéro de compte:</span><br/>"
      pdfTemplate+="               <span style='margin-left: 501px;'>Numéro BCE:</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='sub-title b s10'>ENGAGEMENTS DU MÉDECIN GÉNÉRALISTE</div>"
      pdfTemplate+="          <div class='s10'>J’accepte de participer au trajet de soins de ce patient, qui appartient au groupe cible 1, et plus précisément : </div>"
      pdfTemplate+="          <div class='s10'>- d’élaborer, d’évaluer et d’adapter, d’un commun accord avec le néphrologue, un plan de suivi individuel qui comprend des objectifs, un suivi planifié, des consultations médicales, des interventions paramédicales et des examens techniques pour le patient présentant une insuffisance rénale chronique; </div>"
      pdfTemplate+="          <div class='s10'>- de transmettre au médecin spécialiste mes observations et les résultats d’examens utiles au suivi du patient </div>"
      pdfTemplate+="          <div class='s10'>- d’utiliser le dossier médical du patient ;</div>"
      pdfTemplate+="          <div class='s10'>- de transmettre copie du présent contrat dûment complété au médecin-conseil. </div>"
      pdfTemplate+="          <div class='stamp-date-signature-title s10'>"
      pdfTemplate+="              <span class='stamp b' style='margin-left: 100px;'>Nom + cachet</span>"
      pdfTemplate+="              <span class='date-signature b' style='margin-left: 350px;'>Date et signature</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='stamp-date-signature s9'>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("nihii", "Nihii", this.language)+": </span>"+_.get(this.hcp, 'nihiiHr', '')+" "+_.get(this.hcp, 'firstName', '')+' '+_.get(this.hcp, 'lastName', '')+"</div>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("address", "Address", this.language)+": </span> "+_.get(this.hcp, 'addresse', '')+' '+_.get(this.hcp, 'postalcode', '')+' '+_.get(this.hcp, 'city', '')+"</div>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("phone", "Phone", this.language)+": </span> "+_.get(this.hcp, 'phone', '')+" <span class='b'>"+this.localize("email", "Email", this.language)+": </span>"+_.get(this.hcp, 'email', '')+"</div>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='s10'>Numéro de compte en banque pour le paiement des honoraires du trajet de soins</div>"
      pdfTemplate+="          <div class='s10'>"
      pdfTemplate+="               <span class='uncheck'></span>Médecin généraliste:"
      pdfTemplate+="               <span style='margin-left: 400px;'>Numéro de compte: "+_.get(this.hcp, 'bankAccount', '')+"</span><br/>"
      pdfTemplate+="               <span style='margin-left: 499px;'>Numéro BCE: "+_.get(this.hcp, 'cbe', '')+"</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='sub-title b s10'>MÉDECIN-CONSEIL DE LA MUTUALITE</div>"
      pdfTemplate+="          <div class='s10'>Je confirme réception du présent contrat conformément à la réglementation portant sur le trajet de soins applicable à partir du (date de réception conformément à la demande)…………………………………………jusqu’au………………………………………………………… </div>"
      pdfTemplate+="          <div class='stamp-date-signature-title s10'>"
      pdfTemplate+="              <span class='stamp b' style='margin-left: 100px;'>Nom + cachet</span>"
      pdfTemplate+="              <span class='date-signature b' style='margin-left: 350px;'>Date et signature</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='stamp-date-signature s10'>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='s9 condition-block'>"
      pdfTemplate+="              <div class=''>(1) Critères d’inclusion pour un trajet de soins insuffisance rénale chronique:</div>"
      pdfTemplate+="              <ul>"
      pdfTemplate+="                  <li>Avoir une insuffisance rénale chronique définie par</li>"
      pdfTemplate+="                  <ul>"
      pdfTemplate+="                      <li>une vitesse de filtration glomérulaire calculée <45ml/min/1,73m² selon la formule MDRD simplifiée confirmée au moins 2 x avec un intervalle d’au moins 3 mois</li>"
      pdfTemplate+="                      et/ou"
      pdfTemplate+="                      <li>une protéinurie de >1g/jour confirmée au moins 2 x avec un intervalle d’au moins 3 mois</li>"
      pdfTemplate+="                  </ul>"
      pdfTemplate+="                  <li>être âgé de plus de 18 ans</li>"
      pdfTemplate+="                  <li>ne pas être en dialyse ni transplanté</li>"
      pdfTemplate+="                  <li>être capable d'un follow up ambulant, c.à.d. consulter le néphrologue/interniste dans son cabinet de consultation</li>"
      pdfTemplate+="             </ul>"
      pdfTemplate+="         </div>"
      pdfTemplate+="      </div>"
      pdfTemplate+="      <div class='page'>"
      pdfTemplate+="          <div class='title textaligncenter b'>CONTRAT TRAJET DE SOINS INSUFFISANCE RENALE CHRONIQUE</div>"
      pdfTemplate+="          <div class='title textaligncenter b border'>INFORMATION SUR LA PRISE EN CHARGE DE L’INSUFFISANCE RENALE CHRONIQUE </div>"
      pdfTemplate+="          <div class='title textaligncenter b'>OBJECTIF GENERAL </div>"
      pdfTemplate+="          <div class=''>Une bonne prise en charge de votre maladie rénale vous garantit une vie plus saine et plus longue. Cette prise en charge peut fortement ralentir l’évolution de votre maladie. Elle permet également de maintenir le plus longtemps possible un fonctionnement « correct » de vos reins et diminue votre risque de maladie cardio-vasculaire. </div>"
      pdfTemplate+="          <div class='title textaligncenter b'>VOS OBJECTIFS PERSONNELS </div>"
      pdfTemplate+="          <div class=''>Vos objectifs personnels vous guident dans la prise en charge de votre maladie rénale. En concertation avec votre médecin généraliste, vous établissez, pour votre trajet de soins, un plan de suivi concret qui repose sur les objectifs suivants : </div>"
      pdfTemplate+="          <div class=''>Avoir un mode de vie sain: </div>"
      pdfTemplate+="          <div>"
      pdfTemplate+="              <ul>"
      pdfTemplate+="                  <li>bouger régulièrement </li>"
      pdfTemplate+="                  <li>arrêter de fumer </li>"
      pdfTemplate+="                  <li>manger sainement </li>"
      pdfTemplate+="                  <li>perdre du poids si nécessaire </li>"
      pdfTemplate+="                  <li>ne pas utiliser de médicaments (p.ex: antidouleurs) sans avis de votre médecin: ils peuvent être nocifs pour vos reins </li>"
      pdfTemplate+="              </ul>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class=''>Suivre et, si nécessaire, traiter avec des médicaments : </div>"
      pdfTemplate+="          <div>"
      pdfTemplate+="              <ul>"
      pdfTemplate+="                  <li>votre glycémie (glucose dans le sang) </li>"
      pdfTemplate+="                  <li>votre tension artérielle </li>"
      pdfTemplate+="                  <li>votre cholestérol et graisses dans le sang </li>"
      pdfTemplate+="                  <li>votre protéinurie: albumine dans l’urine </li>"
      pdfTemplate+="                  <li>votre anémie</li>"
      pdfTemplate+="                  <li>l’état de vos os et articulations </li>"
      pdfTemplate+="                  <li>votre tabagisme: arrêter de fumer </li>"
      pdfTemplate+="                  <li>un régime adapté avec l’aide d’un diététicien expérimenté </li>"
      pdfTemplate+="                  <li>prendre les médicaments nécessaires comme prescrits </li>"
      pdfTemplate+="              </ul>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class=''>Un examen sanguin <br/>Votre spécialiste et votre généraliste déterminent la fréquence des ces examens sanguins. </div>"
      pdfTemplate+="          <div class=''>Un examen de contrôle: dépistage des complications au niveau d’autres organes</div>"
      pdfTemplate+="          <div class=''>Vaccinations contre la grippe, l’hépatite et le pneumocoque</div>"
      pdfTemplate+="      </div>"
      pdfTemplate+=       '<'+'script'+'>'+'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <'+'/script'+'>'
      pdfTemplate+="  </body>"
      pdfTemplate+="</html>"
      return pdfTemplate
  }

  _getDiabetesPdfContent(){
      const patientInssurance = _
          .chain(_.get(this.patient, "insurabilities",{}))
          .filter((i)=>{
              return i &&
                  !!moment( _.trim(_.get(i, "startDate", "0") ), "YYYYMMDD" ).isBefore(moment()) &&
                  (!!moment( _.trim(_.get(i, "endDate", "0") ), "YYYYMMDD" ).isAfter(moment()) || !_.trim(_.get(i, "endDate", "") ) ) &&
                  !!_.trim( _.get( i, "insuranceId", "" ) )
          })
          .map(i => {return {
              insuranceId: _.trim(_.get(i,"insuranceId","")),
              identificationNumber: _.trim(_.get(i,"identificationNumber","")),
              tc1: _.trim(_.get(i,"parameters.tc1","")),
              tc2: _.trim(_.get(i,"parameters.tc2","")),
              preferentialstatus: typeof _.get(i,"parameters.preferentialstatus") === "boolean" ? !!_.get(i,"parameters.preferentialstatus",false) : _.trim(_.get(i,"parameters.preferentialstatus")) === "true"
          }})
          .head()
          .value()

      let pdfTemplate = ""
      pdfTemplate+="<html>"
      pdfTemplate+="  <head>"
      pdfTemplate+="  <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet'>"
      pdfTemplate+="     <style>"
      pdfTemplate+="       @page {size: A4; width: 210mm; height: 297mm; margin: 0; padding: 0}"
      pdfTemplate+="       body {margin: 0; padding: 0; font-family: /* 'Open Sans', */ Arial, Helvetica, sans-serif; line-height:1em;}"
      pdfTemplate+="       .title{height: 20px; font-size: 14px; width: 100%;}"
      pdfTemplate+="       .sub-title{height: 15px; font-size: 12px; width: 100%;}"
      pdfTemplate+="       .separator{height: 2px; width: 100%; border-bottom: 1px solid black;}"
      pdfTemplate+="       .page {width: 210mm; color:#000000; font-size:12px; padding:10mm; position:relative;}"
      pdfTemplate+="       .textaligncenter { text-align: center; } .textalignleft { text-align: left; } .textalignright { text-align: right; }"
      pdfTemplate+="       .b{font-weight: bold}"
      pdfTemplate+="       .mutuality-block{border: 1px solid black; width: 100%; height: auto;}"
      pdfTemplate+="       .date-signature{height: 30px; width: 100%;}"
      pdfTemplate+="       .border{border: 1px solid black;}"
      pdfTemplate+="       .s10{font-size: 10px;}"
      pdfTemplate+="       .s9{font-size: 9px;}"
      pdfTemplate+="       .condition-block{height: 150px;}"
      pdfTemplate+="       .stamp-date-signature-title{width: 100%}"
      pdfTemplate+="       .stamp-date-signature{width: 100%; height: 55px;}"
      pdfTemplate+="       .check{height: 10px; width: 10px; background-color; black;}"
      pdfTemplate+="       .uncheck{height: 10px; width: 10px;}"
      pdfTemplate+="     </style>"
      pdfTemplate+="  </head>"
      pdfTemplate+="  <body>"
      pdfTemplate+="      <div class='page'>"
      pdfTemplate+="          <div class='title textaligncenter b'>CONTRAT TRAJET DE SOINS DIABÈTE TYPE 2</div>"
      pdfTemplate+="          <div class='mutuality-block s9'>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("lastAndFirstName", "Last and first names", this.language)+"</span>: "+_.get(this.patient, "lastName", "")+" "+_.get(this.patient, "firstName", "")+" <span class='b'>"+this.localize("birthDate", "Birthdate", this.language)+"</span>: "+this._formatDate(_.get(this.patient, "dateOfBirth", ""))+" <span class='b'>"+this.localize("ssinPatVerbose", "SSIN", this.language)+"</span>: "+this.api.formatSsinNumber(_.trim(_.get(this.patient,"ssin","")))+"</div>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("address", "Address", this.language)+"</span>: "+_.get(this.patient, "addresses.0.street", "")+" "+_.get(this.patient, "addresses.0.houseNumber", "")+" "+_.get(this.patient, "addresses.0.postboxNumber", "")+" "+_.get(this.patient, "addresses.0.postalCode", "")+" "+_.get(this.patient, "addresses.0.city", "")+"</div>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("adm_in", "Insurance", this.language)+"</span>: "+_.trim(_.get(patientInssurance,"name","-"))+" <span class='b'>Code: </span>"+_.trim(_.get(patientInssurance,"code","-"))+" <span class='b'>CT1/CT2</span>: "+_.trim(_.get(patientInssurance,"tc1","-")) +" - "+ _.trim(_.get(patientInssurance,"tc2","-"))+" <span class='b'>"+this.localize("AFF", "Membership number", this.language)+"</span>: "+_.trim(_.get(patientInssurance,"identificationNumber","-"))+"</div>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='sub-title b s10'>ENGAGEMENTS DU PATIENT</div>"
      pdfTemplate+="          <div><span class='b s10'>NOM DU PATIENT</span> "+_.get(this.patient, "lastName", "")+" "+_.get(this.patient, "firstName", "")+"</div>"
      pdfTemplate+="          <div class='s10'>- Mon médecin généraliste, à qui je demande de transmettre cette demande au médecin-conseil de ma mutuelle, m’a expliqué aujourd’hui les conditions du trajet de soins diabète de type 2. </div>"
      pdfTemplate+="          <div class='s10'>- J’ai été informé(e) par mon médecin généraliste que les bénéfices et la réussite du trajet de soins dépendent de ma participation active au plan de suivi. Je m’engage à cette fin à définir avec mon médecin généraliste l’organisation pratique de ce plan de suivi. </div>"
      pdfTemplate+="          <div class='s10'>- Mon médecin généraliste et moi-même avons parlé des objectifs du traitement et de la façon de les atteindre en nous basant sur les informations décrites en page 2 du présent contrat.</div>"
      pdfTemplate+="          <div class='s10'>- Mon médecin généraliste m’a communiqué qu’il/elle à transmettra à Sciensano les données codées me concernant qui se rapportent à l’âge, au sexe, au poids, à la taille, à la tension artérielle, et aux résultats de certaines analyses sanguines (Hb A1c, cholestérol LDL) à des fins d’évaluation scientifique et dans le respect des dispositions réglementaires relatives à la vie privée. </div>"
      pdfTemplate+="          <div class='stamp-date-signature-title s10'>"
      pdfTemplate+="              <span class='stamp b' style='margin-left: 100px;'></span>"
      pdfTemplate+="              <span class='date-signature b' style='margin-left: 425px;'>Date et signature</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='stamp-date-signature s10'>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='s10'><span class='check'></span> Je demande à mon médecin généraliste, signataire du présent contrat, de gérer mon dossier médical global : il/elle doit à cette fin en attester les honoraires dans l’année qui suit le début du trajet de soins. </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='sub-title b s10'>ENGAGEMENTS DE L’ENDOCRINO-DIABÉTOLOGUE / DE L’INTERNISTE</div>"
      pdfTemplate+="          <div class='s10'>J’accepte de participer au trajet de soins de ce patient, qui appartient au groupe à risque 1, et plus précisément : </div>"
      pdfTemplate+="          <div class='s10'>- d’encadrer, d’un commun accord avec lui, le médecin généraliste lors de l’élaboration, de l’évaluation et de l’adaptation d’un plan de suivi individuel pour le patient présentant un diabète de type 2 ; ce plan de suivi comprend des objectifs, un suivi planifié, des consultations médicales, des interventions paramédicales et des examens techniques </div>"
      pdfTemplate+="          <div class='s10'>- de transmettre les rapports de mes consultations et examens techniques au médecin généraliste </div>"
      pdfTemplate+="          <div class='s10'>- d’entretenir, avec le médecin généraliste, une communication efficace, soit à la demande du médecin généraliste, soit à l ‘occasion d’une transmission des paramètres cliniques ou biologiques. </div>"
      pdfTemplate+="          <div class='stamp-date-signature-title s10'>"
      pdfTemplate+="              <span class='stamp b' style='margin-left: 100px;'>Nom + cachet</span>"
      pdfTemplate+="              <span class='date-signature b' style='margin-left: 350px;'>Date et signature</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='stamp-date-signature'>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='s10'>Numéro de compte en banque pour le paiement des honoraires du trajet de soins</div>"
      pdfTemplate+="          <div class='s10'>"
      pdfTemplate+="               <span class='uncheck'></span>Médecin spécialiste:"
      pdfTemplate+="               <span style='margin-left: 404px;'>Numéro de compte:</span><br/>"
      pdfTemplate+="               <span style='margin-left: 501px;'>Numéro BCE:</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='s10'>"
      pdfTemplate+="               <span class='uncheck'></span>Hôpital:"
      pdfTemplate+="               <span style='margin-left: 462px;'>Numéro de compte:</span><br/>"
      pdfTemplate+="               <span style='margin-left: 501px;'>Numéro BCE:</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='sub-title b s10'>ENGAGEMENTS DU MÉDECIN GÉNÉRALISTE</div>"
      pdfTemplate+="          <div class='s10'>J’accepte de participer au trajet de soins de ce patient, qui appartient au groupe cible (1), et plus précisément : </div>"
      pdfTemplate+="          <div class='s10'>- d’élaborer, d’évaluer et d’adapter, d’un commun accord avec le néphrologue, un plan de suivi individuel qui comprend des objectifs, un suivi planifié, des consultations médicales, des interventions paramédicales et des examens techniques pour le patient présentant un diabète de type 2 ; </div>"
      pdfTemplate+="          <div class='s10'>- de transmettre au médecin spécialiste mes observations et les résultats d’examens utiles au suivi du patient </div>"
      pdfTemplate+="          <div class='s10'>- dans le cas où le patient ne la reçoit pas via un centre de diabète conventionné, lui prodiguer et entretenir l’éducation nécessaire concernant la maladie, le traitement et le suivi, moi-même ou via l’éducateur au diabète </div>"
      pdfTemplate+="          <div class='s10'>- d’utiliser le dossier médical du patient ;</div>"
      pdfTemplate+="          <div class='s10'>- de transmettre copie du présent contrat dûment complété au médecin-conseil. </div>"
      pdfTemplate+="          <div class='stamp-date-signature-title s10'>"
      pdfTemplate+="              <span class='stamp b' style='margin-left: 100px;'>Nom + cachet</span>"
      pdfTemplate+="              <span class='date-signature b' style='margin-left: 350px;'>Date et signature</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='stamp-date-signature s9'>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("nihii", "Nihii", this.language)+": </span>"+_.get(this.hcp, 'nihiiHr', '')+" "+_.get(this.hcp, 'firstName', '')+' '+_.get(this.hcp, 'lastName', '')+"</div>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("address", "Address", this.language)+": </span> "+_.get(this.hcp, 'addresse', '')+' '+_.get(this.hcp, 'postalcode', '')+' '+_.get(this.hcp, 'city', '')+"</div>"
      pdfTemplate+="              <div><span class='b'>"+this.localize("phone", "Phone", this.language)+": </span> "+_.get(this.hcp, 'phone', '')+" <span class='b'>"+this.localize("email", "Email", this.language)+": </span>"+_.get(this.hcp, 'email', '')+"</div>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='s10'>Numéro de compte en banque pour le paiement des honoraires du trajet de soins</div>"
      pdfTemplate+="          <div class='s10'>"
      pdfTemplate+="               <span class='uncheck'></span>Médecin généraliste:"
      pdfTemplate+="               <span style='margin-left: 400px;'>Numéro de compte: "+_.get(this.hcp, 'bankAccount', '')+"</span><br/>"
      pdfTemplate+="               <span style='margin-left: 499px;'>Numéro BCE: "+_.get(this.hcp, 'cbe', '')+"</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='sub-title b s10'>MÉDECIN-CONSEIL DE LA MUTUALITE</div>"
      pdfTemplate+="          <div class='s10'>Je confirme réception du présent contrat conformément à la réglementation portant sur le trajet de soins diabète de type 2, applicable à partir du (date de réception conformément à la demande)…………………………………………jusqu’au………………………………………………………… </div>"
      pdfTemplate+="          <div class='stamp-date-signature-title s10'>"
      pdfTemplate+="              <span class='stamp b' style='margin-left: 100px;'>Nom + cachet</span>"
      pdfTemplate+="              <span class='date-signature b' style='margin-left: 350px;'>Date et signature</span>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='stamp-date-signature s10'>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class='s9 condition-block'>"
      pdfTemplate+="              <div class=''>(1) Critères d’inclusion pour un trajet de soins diabète de type 2 </div>"
      pdfTemplate+="              <div class=''>- 1 ou 2 injections d’insuline par jour</div>"
      pdfTemplate+="              <div class=''>- contrôle insuffisant sous traitement oral maximal : dans ce cas, une insulinothérapie doit être envisagée </div>"
      pdfTemplate+="              <div class=''>Critères d’exclusion </div>"
      pdfTemplate+="              <div class=''>- grossesse ou souhait de grossesse </div>"
      pdfTemplate+="              <div class=''>- plus de deux injections d’insuline par jour </div>"
      pdfTemplate+="              <div class=''>- diabète de type 1 </div>"
      pdfTemplate+="         </div>"
      pdfTemplate+="      </div>"
      pdfTemplate+="      <div class='page'>"
      pdfTemplate+="          <div class='title textaligncenter b'>CONTRAT TRAJET DE SOINS DIABETE (page2) </div>"
      pdfTemplate+="          <div class='title textaligncenter b border'>INFORMATIONS SUR LA PRISE EN CHARGE DU DIABÈTE DE TYPE 2 </div>"
      pdfTemplate+="          <div class='title textaligncenter b'>OBJECTIF GENERAL </div>"
      pdfTemplate+="          <div class=''>Une bonne prise en charge de votre diabète vous garantit une vie plus saine et plus longue. Cette prise en charge évite pendant plus longtemps les complications dues à l’obstruction des vaisseaux sanguins. </div>"
      pdfTemplate+="          <div class='title textaligncenter b'>VOS OBJECTIFS PERSONNELS </div>"
      pdfTemplate+="          <div class=''>Vos objectifs personnels vous guident dans la prise en charge de votre diabète. En concertation avec votre médecin généraliste, vous établissez, pour votre trajet de soins, un plan de suivi concret qui repose sur les objectifs suivants : </div>"
      pdfTemplate+="          <div class=''>Avoir un mode de vie sain: </div>"
      pdfTemplate+="          <div>"
      pdfTemplate+="              <ul>"
      pdfTemplate+="                  <li>bouger régulièrement </li>"
      pdfTemplate+="                  <li>arrêter de fumer </li>"
      pdfTemplate+="                  <li>manger sainement </li>"
      pdfTemplate+="                  <li>contrôler votre poids </li>"
      pdfTemplate+="              </ul>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class=''>Suivre et, si nécessaire, traiter avec des médicaments : </div>"
      pdfTemplate+="          <div>"
      pdfTemplate+="              <ul>"
      pdfTemplate+="                  <li>votre glycémie (glucose dans le sang) </li>"
      pdfTemplate+="                  <li>votre tension artérielle </li>"
      pdfTemplate+="                  <li>votre cholestérol et graisses dans le sang </li>"
      pdfTemplate+="                  <li>le risque d’obstruction des vaisseaux sanguins grâce à la prise de médicaments </li>"
      pdfTemplate+="                  <li>votre surpoids </li>"
      pdfTemplate+="                  <li>votre tabagisme : arrêter de fumer </li>"
      pdfTemplate+="              </ul>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class=''>Un examen sanguin : HbA1c (2)</div>"
      pdfTemplate+="          <div class=''>Un examen de contrôle: dépistage des complications au niveau d’autres organes</div>"
      pdfTemplate+="          <div class=''>Un contrôle chez votre médecin généraliste pour détecter les complications éventuelles : </div>"
      pdfTemplate+="          <div>"
      pdfTemplate+="              <ul>"
      pdfTemplate+="                  <li>questionnaire (risque de maladie cardiaque, douleurs nerveuses,...) </li>"
      pdfTemplate+="                  <li>examen des pieds </li>"
      pdfTemplate+="                  <li>examen du sang et des urines </li>"
      pdfTemplate+="              </ul>"
      pdfTemplate+="          </div>"
      pdfTemplate+="          <div class=''>Un examen des yeux chez votre ophtalmologue </div>"
      pdfTemplate+="          <div class=''>Vaccinations contre la grippe et le pneumocoque (3)</div>"
      pdfTemplate+="          <div class=''>Mieux comprendre votre maladie et votre plan de soins, à l’aide d’éducation au diabète.</div>"
      pdfTemplate+="          <div class='separator'></div>"
      pdfTemplate+="          <div class=''>(2) HbA1c = Hémoglobine A1c : indique si votre sucre (glucose) sanguin était bien réglé au cours des trois derniers mois. </div>"
      pdfTemplate+="          <div class=''>(3) Le diabète diminue votre résistance face à la grippe et aux maladies infectieuses; la grippe peut dérégler votre diabète. </div>"
      pdfTemplate+="      </div>"
      pdfTemplate+=       '<'+'script'+'>'+'document.fonts.ready.then(() => { setInterval(() => {document.body.dispatchEvent(new CustomEvent("pdfDoneRenderingEvent"))}, 500); }); <'+'/script'+'>'
      pdfTemplate+="  </body>"
      pdfTemplate+="</html>"
      return pdfTemplate
  }

  _upperFirstAll(inputValue){
      return _.trim(_.map(_.trim(inputValue).toLowerCase().split(" "),i=>_.upperFirst(_.trim(i))).join(" "))
  }

  _isDocumentTab(tab){
      return tab === 4
  }

  _showLinkingBtn(e){
      this.set("unlinkBtnAvailable", false)
      this.set("linkBtnAvailable", false)
      if(_.get(e, 'detail', null)){
          _.get(e, 'detail.docOrigin', null) === "linkedDoc" ? this.set("unlinkBtnAvailable", true) : this.set("linkBtnAvailable", true)
          this.set("selectedDocumentId", _.get(e, 'detail.documentId', null))
      }
  }

  _linkDocument() {
      const targetDocument = _.head(_.remove(this.availableDocumentList, {id: _.get(this, 'selectedDocumentId', null)}))
      this.push("selectedCarePath.linkedDocuments", targetDocument)
      this.$["htPatCarePathDetailDocument"]._refreshInsuranceLinkedAndAvailableDocuments()
      this.set("unlinkBtnAvailable", true)
      this.set("linkBtnAvailable", false)
      this._saveCarePath()
  }

  _removeLinkedDocument() {
      const targetDocument = _.head(_.remove(_.get(this.selectedCarePath, 'linkedDocuments', []), {id: _.get(this, 'selectedDocumentId', null)}))
      this.push("availableDocumentList", targetDocument)
      this.$["htPatCarePathDetailDocument"]._refreshInsuranceLinkedAndAvailableDocuments()
      this.set("unlinkBtnAvailable", false)
      this.set("linkBtnAvailable", true)
      this._saveCarePath()
  }

  _selectedTabChanged(){
      !_.isEmpty(_.get(this, 'selectedCarePath', {})) ? this._saveCarePath() : null
  }
}
customElements.define(HtPatCarePathDetailDialog.is, HtPatCarePathDetailDialog);
