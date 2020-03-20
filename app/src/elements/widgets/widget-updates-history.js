import '../../styles/scrollbar-style.js';
import '../../styles/dialog-style.js';
import '../../styles/buttons-style.js';
import moment from 'moment/src/moment'

import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";

class WidgetUpdatesHistory extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
        <style include="scrollbar-style">
            .card {
				color: var(--app-text-color);
				background: var(--app-background-color);
				border-radius: 2px;
				@apply --shadow-elevation-2dp;
				overflow: hidden!important;
				position: relative;
				z-index:0;
				transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
			}

			.card-title-container {
				background: #ffffff;
				padding: 0 16px;
				display: flex;
				flex-flow: row wrap;
				justify-content: space-between;
				align-items: center;
				height: 56px;
    			box-sizing: border-box;
			}

			.card-title {
                display: flex;
                flex-grow: 1;
				padding: 0;
				margin: 0;
				font-size: 16px;
				font-weight: bold;
				text-align: center;
				color: var(--app-text-color);
			}

			.card-title-container paper-icon-button {
				color: rgba(0,0,0,0);
				height: 20px;
				width: 20px;
				padding: 2px;
				transition: all .24s cubic-bezier(0.075, 0.82, 0.165, 1);
			}

			.card:hover .card-title-container paper-icon-button {
				color: var(--app-text-color-disabled);
				padding: 0;
			}

			.card-body {
				display: block;
				padding: 16px;
				height: calc(100% - 88px);
				overflow: auto;
				position: relative;
			}

            .update-container {
                display: grid;
                grid-template-columns: 28px 1fr 80px;
                grid-template-rows: 1fr 1fr;
                width: 100%;
                height: auto;
                padding: 12px 0;
                transition: all 0.24s cubic-bezier(0.075, 0.82, 0.165, 1);
                cursor: pointer;
                box-sizing: border-box;
            }

            .update-container:not(:last-child) {
                border-bottom: 1px solid var(--app-background-color-dark);
            }

            .update-container:last-child {
                padding: 12px 0 0;
            }

            .update-container:hover {
                background: var(--app-background-color-dark);
                padding: 12px;
            }

            .update-icon {
                border-radius: 50%;
                background: rgba(255, 80, 0, .1);
                place-self: center;
                display: flex;
                align-items: center;
                justify-content: center;
                grid-column: 1 / span 1;
                grid-row: 1 / span 2;
                height: 28px;
                width: 28px;
            }

            .update-icon iron-icon {
                color: var(--app-secondary-color);
                height: 20px;
                width: 20px;
            }

            .update-title {
                font-size: var(--font-size-large);
                font-weight: bold;
                grid-column: 2 / span 1;
                grid-row: 1 / span 1;
                padding: 0 12px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
                box-sizing: border-box;
                place-self: end start;
                line-height: 1;
            }

            .update-summary {
                font-size: var(--font-size-normal);
                grid-column: 2 / span 1;
                grid-row: 2 / span 1;
                padding: 0 12px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
                box-sizing: border-box;
                place-self: start start;
                line-height: 1;
            }

            .update-date {
                place-self: center;
                border-radius: 4px;
                background: rgba(255, 80, 0, .1);
                display: inline-flex;
                align-items: center;
                grid-column: 3 / span 1;
                grid-row: 1 / span 2;
                padding: 0 8px;
                height: 16px;
            }

            .update-date span {
                display: block;
                color: var(--app-secondary-color);
                font-size: var(--font-size-small);
                padding: 0;
                margin: 0;
                line-height: 1;
            }

            paper-menu-button.widget-settings-menu div {
				width: 160px;
				height: auto;
			}

			paper-menu-button.widget-settings-menu div paper-button {
				width: 100%;
				margin: 0;
				background-color: var(--app-secondary-color);
				color: var(--app-text-color);
				text-transform: capitalize;
				font-size: 14px;
				font-weight: 500;
				border-radius: 0;
			}

			paper-menu-button.widget-settings-menu div paper-input {
				margin: 0 8px;
				--paper-input-container-input: {
					padding: 0;
				};
				--paper-input-container-focus-color: var(--app-secondary-color);
			}


        </style>
        <div class="card-title-container">
            <h1 class="card-title">[[localize('wdgt-update-histo', 'Updates history', language)]]</h1>
            <paper-menu-button class="widget-settings-menu" horizontal-align="right" no-overlap="" no-animations="" focused="false">
                <paper-icon-button id="settings-updatesHistory" icon="settings" slot="dropdown-trigger" alt="widget settings menu"></paper-icon-button>
                <div slot="dropdown-content">
                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_col','Nr of columns',language)]]" value="{{widget.nrCols}}"></paper-input>
                    <paper-input type="number" min="1" always-float-label="" label="[[localize('nr_of_row','Nr of rows',language)]]" value="{{widget.nrRows}}"></paper-input>
                    <!-- <paper-button on-tap="_handleWidgetChange" data-item\$="{{widget}}">Apply settings</paper-button> -->
                </div>
            </paper-menu-button>
        </div>
        <div class="card-body">
            <template is="dom-repeat" items="[[updates.updates]]" as="update">
                <div class="update-container" data-update\$="{{update}}" on-tap="_updateDialog">
                    <div class="update-icon"><iron-icon icon="bug-report"></iron-icon></div>
                    <div class="update-title">[[update.mainTitle]]</div>
                    <div class="update-summary">
                        <template is="dom-repeat" items="[[update.modules]]" as="module">
                            [[_stringifiedLocalizeContent(module.description)]]
                        </template>
                    </div>
                    <div class="update-date"><span>[[_getDate(update.updateDate)]]</span></div>
                </div>
            </template>
        </div>
       
`;
  }

  static get is() {
      return "widget-updates-history";
  }
  static get properties() {
      return {
          api: {
              type: Object,
              noReset: true
          },
          user: {
              type: Object
          },
          _bodyOverlay: {
              type: Boolean,
              value: false
          },
          updateVersion:{
              type: String,
              value: ""
          },
          updates: {
              type: Object,
              value: function () {
                  return require('../../../updates.json');
              }
          },
          selectedUpdate: {
              type: Object
          }
      }
  }

  ready() {
      super.ready();
  }

  _stringifiedLocalizeContent(content){
      return content && content[this.language] ? content[this.language].replace(/<\/?[^>]+(>|$)/g, "") : null
  }

  _updateDialog(e){
      e.stopPropagation()
      e.preventDefault()
      let target = e.target;
      while (target && !target.dataset.update) {
          target = target.parentNode;
      }
      const update = JSON.parse(target.dataset.update)
      this.dispatchEvent(new CustomEvent("update-selected",{detail:update, bubbles: true, composed: true}))
  }



  _getDate(date){
      return date ? moment(date).format("DD/MM/YYYY") : null
  }
}

customElements.define(WidgetUpdatesHistory.is, WidgetUpdatesHistory);
