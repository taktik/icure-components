import './dynamic-link.js';
import '../../styles/paper-input-style.js';
import '../../styles/dropdown-style.js';
import {PolymerElement, html} from '@polymer/polymer';
import {TkLocalizerMixin} from "../tk-localizer";
class DynamicMeasureField extends TkLocalizerMixin(PolymerElement) {
  static get template() {
    return html`
		<style include="paper-input-style">
			:host {
                position: relative;
                flex-grow: var(--dynamic-field-width, 25);
				min-width: calc(var(--dynamic-field-width-percent, '25%') - 12px);
				padding:0 6px;
				--paper-font-caption_-_line-height: var(--font-size-normal);
				box-sizing: border-box;
			}

            dynamic-link {
                position: absolute;
                right: 0;
				bottom: 8px;
            }

			.modified-icon {
				width: 18px;
			}

			.modified-previous-value {
				color: var(--app-text-color-disabled);
				text-decoration: line-through;
				font-style: italic;
			}

			.modified-before-out {
				color: var(--app-secondary-color-dark);
				text-align: right;
				float: right;
				font-style: italic;
				border-bottom: 1px dotted var(--app-secondary-color-dark);
			}

			.modified-after-out {
				color: var(--app-secondary-color-dark);
				text-align: right;
				float: right;
				font-style: italic;
				border-bottom: 1px dotted var(--app-secondary-color-dark);
			}

			iron-input{
				min-width: 0;
				box-sizing: border-box;
				width: 100%;
				max-width: 100%;
				position: relative;
			}

			input{
				border: none;
				width: 0;
				min-width: 0;
				outline: 0;
				padding: 0;
				background: transparent;
				font-size: var(--font-size-normal);
				box-sizing: border-box;
				max-width: calc(100% - 16px);
				width: 100%;
				position:absolute;
				height: 100%;
			}

			#dropdown-listbox{
				padding: 0;
			}
			paper-item{
				padding: 0 8px;
			}

			#unit{
				text-align: right;
				padding-top: 5px;
				vertical-align: bottom;
			}
		</style>

		<template is="dom-if" if="[[readOnly]]">
			<paper-input-container always-float-label="true">
				<label slot="label">[[localize(label,label,language)]]
					<template is="dom-if" if="[[wasModified]]">
						<span class="modified-before-out">[[localize('mod','modified',language)]] [[lastModified]] <iron-icon class="modified-icon" icon="schedule"></iron-icon></span>
					</template>
					<template is="dom-if" if="[[isModifiedAfter]]">
						<span class="modified-after-out">[[localize('obs_val','obsolete value',language)]]<iron-icon class="modified-icon" icon="report-problem"></iron-icon></span>
					</template>
				</label>
				<iron-input slot="input" bind-value="{{inputValue}}">
					<input value="{{inputValue::input}}" readonly="">
					[[unit]]
				</iron-input>
			</paper-input-container>
		</template>
		<template is="dom-if" if="[[!readOnly]]">
			<paper-input-container always-float-label="true">
				<label slot="label">[[localize(label,label,language)]]
                    <template is="dom-if" if="[[wasModified]]">
						<span class="modified-before-out">[[localize('mod','modified',language)]] [[lastModified]] <iron-icon class="modified-icon" icon="schedule"></iron-icon></span>
					</template>
					<template is="dom-if" if="[[isModifiedAfter]]">
						<span class="modified-after-out">[[localize('obs_val','obsolete value',language)]]<iron-icon class="modified-icon" icon="report-problem"></iron-icon></span>
					</template>
				</label>
				<iron-input slot="input" bind-value="{{inputValue}}">
					<input value="{{inputValue::input}}">
					<div id="unit">[[unit]]</div>
				</iron-input>
				<!--
					@ToDo Julien wathelet
					@Description : permettre de changer le type d'unité gràce au parentId (type d'unité) dans le code CD-UNIT + table de conversion (ou formule de conversion) dans le parent
				<paper-menu-button id="paper-menu-button" slot="suffix">
					<iron-icon icon="paper-dropdown-menu:arrow-drop-down" slot="dropdown-trigger"></iron-icon>
					<paper-listbox id="dropdown-listbox" slot="dropdown-content" selected="{{unit}}">
						<paper-item>g</paper-item>
						<paper-item>kg</paper-item>
						<paper-item>mg</paper-item>
						<template is="dom-repeat" items="[[options]]">
                            <paper-item>[[localize(item,item,language)]]</paper-item>
                        </template>
					</paper-listbox>
				</paper-menu-button>
				-->
			</paper-input-container>
			<dynamic-link i18n="[[i18n]]" language="[[language]]" resources="[[resources]]" linkables="[[linkables]]" represented-object="[[key]]" api="[[api]]"></dynamic-link>
        </template>
`;
  }

  static get is() {
      return 'dynamic-measure-field';
	}

  static get properties() {
      return {
          wasModified: {
              type: Boolean
          },
          isModifiedAfter: {
              type: Boolean
          },
          readOnly: {
              type: Boolean,
              value: false
          },
          lastModified: {
              type: String
          },
          label: {
              type: String
          },
          valueWithUnit: {
              type: Object,
              notify: true,
              observer: '_valueWithUnitChanged'
          },
          value : {
              type: String,
              notify: true,
              observer: '_valueChanged'
          },
          inputValue: {
              type: String,
              observer: '_inputValueChanged'
          },
          unit:{
              type: String,
              notify: true,
              observer: '_unitChanged'
          },
          width: {
              type: Number,
              value: 24,
              observer: '_widthChanged'
          }
      };
	}

  constructor() {
      super();
	}

  _widthChanged(width) {
      this.updateStyles({ '--dynamic-field-width': width, '--dynamic-field-width-percent': '' + width + '%' });
	}

  _valueChanged(value) {
      if ((this.inputValue || '').trim() !== value) {
          this.set('inputValue', value);
      }
  }
   _unitChanged(unit){
      if(unit!== this.valueWithUnit.unit){
          if(!this.readOnly) {
              this.dispatchEvent(new CustomEvent('field-changed', {
                  detail: {
                      context: this.context,
                      value: this.inputValue,
                      unit : this.unit
                  }
              }));
          }
        }
    }


    _inputValueChanged(value) {
      if(value!== this.valueWithUnit.value || value!==this.value){
          value !== this.value && this.set('value',value)
          if(!this.readOnly) {
              this.dispatchEvent(new CustomEvent('field-changed', {
                  detail: {
                      context: this.context,
                      value: this.inputValue,
                      unit : this.unit
                  }
              }));
          }
      }
          //const match = /^ *([+-]?[0-9]+(?:[.,][0-9]*)?)(?: *([a-zA-Z°].*?))?(?: +([1-9].*?))? *$/.exec(this.inputValue);
          //if (!this.inputValue.match(/^ *([+-]?[0-9]+(?:[.,]0*))(?: *([a-zA-Z°].*?))?(?: +([1-9].*?))? *$/) /*intermediate situation*//*) {
	}
}

customElements.define(DynamicMeasureField.is, DynamicMeasureField);
