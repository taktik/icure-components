import {PolymerElement, html} from '@polymer/polymer';
import '@polymer/paper-toolbar/paper-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/editor-icons';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import '@polymer/neon-animation/neon-animation';

import "../utils/color-picker.ts"
import "../utils/heading-picker.ts"
import "../utils/font-picker.ts"
import "../utils/font-size-picker.ts"

import {customElement, property} from "@polymer/decorators";
import {keymap} from 'prosemirror-keymap'
import {EditorState, TextSelection, Transaction} from 'prosemirror-state'
import {EditorView, NodeView} from 'prosemirror-view'
import {Schema, DOMParser, NodeSpec, Node, MarkType, ParseRule, Mark, Slice, Fragment} from 'prosemirror-model'
import {schema} from 'prosemirror-schema-basic'
import {
  baseKeymap,
  toggleMark,
  setBlockType,
  chainCommands,
  newlineInCode,
  createParagraphNear, liftEmptyBlock, splitBlockKeepMarks
} from "prosemirror-commands";
import {Plugin} from "prosemirror-state"
import {dropCursor} from 'prosemirror-dropcursor';
import {gapCursor} from 'prosemirror-gapcursor';
import {ReplaceStep, StepMap} from "prosemirror-transform";
import {history, undo, redo, undoDepth, redoDepth} from "prosemirror-history";
import {addColumnAfter, addColumnBefore, addRowAfter, addRowBefore, columnResizing, deleteColumn, deleteRow, deleteTable, goToNextCell, mergeCells, splitCell, tableEditing, tableNodes, toggleHeaderCell, toggleHeaderColumn, toggleHeaderRow} from "prosemirror-tables";
import {fixTables} from "./fixtables";

import _ from 'lodash';

/**
 * MyApp main class.
 *
 */
@customElement('prose-editor')
export class ProseEditor extends PolymerElement {
  static get template() {
    return html`        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Alegreya|Barlow|Barlow+Condensed|Cardo|Crete+Round|EB+Garamond|Exo|Exo+2|Fjalla+One|Great+Vibes|Indie+Flower|Josefin+Sans|Kurale|Libre+Baskerville|Lobster|Lora|Maven+Pro|Monoton|Montserrat|Montserrat+Alternates|Nanum+Myeongjo|Neucha|Old+Standard+TT|Open+Sans|Oswald|Pathway+Gothic+One|Poiret+One|Poppins|Quattrocento|Quattrocento+Sans|Quicksand|Raleway:400,700|Roboto|Roboto+Condensed|Source+Serif+Pro|Spectral|Teko|Tinos|Vollkorn">

        <custom-style>
            <style is="custom-style">
                :host {
                    background: 0 0;
                    height: 100%;
                    width: 100%;
                    font-family: 'Roboto', sans-serif;
                    font-size: 13px;
                    min-height: 100vw;

                }

                .prose-editor-container{
                    height: 100%;
                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: space-between;
                }

                .container {
                    left: 50%;
                    transform: translateX(-50%);
                    position: absolute;
                }

                .page {
                    padding: 20px;
                    outline: 0;
                    background: #fefefe;
                    border-radius: 3px;
                    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
                    0 3px 4px 0 rgba(0, 0, 0, 0.12),
                    0 1px 8px 0 rgba(0, 0, 0, 0.20);

                    /*width: 555px;*/
                    width: 660px;
                    min-height: 931px;
                    transition: height .2s ease-in;

                    font-family: 'Roboto', sans-serif;
                    font-size: 11px;

                    margin-bottom: 24px;
                }

                h1 {
                    font-size: 1.8em;
                    font-weight: bold;
                }

                h2 {
                    font-size: 1.5em;
                    font-weight: bold;
                }

                h3 {
                    font-size: 1.3em;
                    font-weight: bold;
                }

                h4 {
                    font-size: 1em;
                    font-weight: bold;
                    text-decoration: underline;
                }


                h5 {
                    font-size: 1em;
                    text-decoration: underline;
                }

                p {
                    margin: 0;
                }

                #editor {
                    outline: 0;
                    padding: 20px;
                }

                .ProseMirror {
                    outline: 0;
                    position: relative;
                    word-wrap: break-word;
                    white-space: pre-wrap;
                    -webkit-font-variant-ligatures: none;
                    font-variant-ligatures: none;
                }

                .ProseMirror pre {
                    white-space: pre-wrap;
                }

                .ProseMirror li {
                    position: relative;
                }

                .ProseMirror .tableWrapper {
                    overflow-x: auto;
                }
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    overflow: hidden;
                    margin: 0;
                }

                .ProseMirror td, .ProseMirror th {
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                }

                .ProseMirror .column-resize-handle {
                    position: absolute;
                    right: -2px; top: 0; bottom: 0;
                    width: 4px;
                    z-index: 20;
                    background-color: #adf;
                    pointer-events: none;
                }

                .ProseMirror.resize-cursor {
                    cursor: ew-resize;
                    cursor: col-resize;
                }

                /* Give selected cells a blue overlay */
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(200, 200, 255, 0.4);
                    pointer-events: none;
                }

                .ProseMirror th, .ProseMirror td {
                    min-width: 1em;
                    border: 1px solid #ddd;
                    padding: 3px 5px;
                }

                .ProseMirror-hideselection *::selection {
                    background: transparent;
                }

                .ProseMirror-hideselection *::-moz-selection {
                    background: transparent;
                }

                .ProseMirror-hideselection {
                    caret-color: transparent;
                }

                .ProseMirror-selectednode {
                    outline: 2px solid #8cf;
                }

                /* Make sure li selections wrap around markers */

                li.ProseMirror-selectednode {
                    outline: none;
                }

                li.ProseMirror-selectednode:after {
                    content: "";
                    position: absolute;
                    left: -32px;
                    right: -2px;
                    top: -2px;
                    bottom: -2px;
                    border: 2px solid #8cf;
                    pointer-events: none;
                }

                .ProseMirror-gapcursor {
                    display: none;
                    pointer-events: none;
                    position: absolute;
                }

                .ProseMirror-gapcursor:after {
                    content: "";
                    display: block;
                    position: absolute;
                    top: -2px;
                    width: 20px;
                    border-top: 1px solid black;
                    animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
                }

                @keyframes ProseMirror-cursor-blink {
                    to {
                        visibility: hidden;
                    }
                }

                .ProseMirror-focused .ProseMirror-gapcursor {
                    display: block;
                }

                paper-toolbar {
                    --paper-toolbar-background: ligh-gray;
                }

                paper-dropdown-menu {
                    display:block;
                    width: 10%;
                    height: 40px;
                    margin: 0 4px;
                    --paper-dropdown-menu-button: {
                        height: 40px;
                    };
                    --paper-dropdown-menu-input: {
                        height: 40px;
                    };
                    --paper-input-container: {
                        height: 40px;
                    };
                    --paper-input-container-input: {
                    }
                    --paper-input-container-input-align: center;
                }

                .toolbar {
                    width: 100%;
                    height: 48px;
                    min-height: 40px;
                    overflow: hidden;
                    border-bottom: 1px solid #e0e0e0;
                    background: #fff;
                    padding: 0;
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    justify-content: flex-start;
                    box-sizing: border-box;
                    padding: 0 8px;
                }

                .scroll-area {
                    flex-grow: 1;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    position: relative;
                    background: var(--app-background-color);
                    min-height:calc(100vh - 400px);
                }

                .status-bar {
                    width: 100%;
                    height: 38px;
                    bottom: 0;
                    overflow: hidden;
                    padding-top: 5px;
                    padding-bottom: 5px;

                    border-top: 1px solid #e0e0e0;
                    border-bottom: 1px solid #e0e0e0;
                }

                paper-icon-button:hover{
                    color: var(--app-text-color);
                    background: --app-background-color-dark;
                }

                paper-icon-button{
                    color: var(--app-text-color-disabled);
                    border-radius: 50%;
                    transition: all .12s cubic-bezier(0.075, 0.82, 0.165, 1);
                }

                paper-icon-button[active] {
                    color: var(--app-text-color);
                }

                paper-input.zoom {
                    padding-left: 8px;
                    width: 60px;
                    height: 40px;
                }

                .divider{
                    display: block;
                    border-left: 1px solid #e0e0e0;
                    height: 100%;
                    margin: 0 4px;
                    padding: 0;
                }

                .dropdown-content paper-menu-button {
                    padding: 0px;
                    /*width:100%;*/
                    width:220px;
                    /*border-bottom:1px dashed #eee;*/
                }

                .dropdown-content paper-item {
                    cursor: pointer;
                    border-bottom:1px dashed #eee;
                }

                .largeDivider {
                    border-bottom:1px solid #aaaaaa!important;
                }

                .isLast {
                    border-bottom:0!important;
                }

                .dropdown-content.box {
                    border:1px solid #cccccc;
                }

                .paperItemLevel1 {
                    font-size:.9rem;
                    padding:2px 10px;
                }

                .paperItemLevel1.hasChildren:after {
                    content: ">";
                    display: block;
                    position: absolute;
                    right:10px;
                }

                .paperItemLevel2 {
                    font-weight: 400;
                    font-size:.7rem;
                    padding:1px 10px;
                }

                .ProseMirror table {
                    margin: 0;
                }
                .ProseMirror th, .ProseMirror td {
                    min-width: 1em;
                    border: 1px solid #ddd;
                    padding: 3px 5px;
                }
                .ProseMirror .tableWrapper {
                    margin: 1em 0;
                }

                .linkingLetter h1 { margin-bottom:5px }
                .linkingLetter h5 { margin-top:0px; text-decoration:none; font-weight:400 }
                .linkingLetter p { padding:0; margin:10px 0 10px 0; }
                .linkingLetter .tableWrapper { margin:0!important; }
                .linkingLetter table { border:0; border-collapse: collapse; }
                .linkingLetter table tr td { border:1px solid #000; }
                .linkingLetter table tr td p { padding:0; margin:1px 0 1px 0; }

                .variable {
                    background-color: #e2f2ff;
                    border-radius:3px 3px 3px 3px;
                    border:solid 1px #bde1ff;
                }

                .template-instance {
                    /*background-color: #00000010;*/
                    /*border-radius:3px 3px 3px 3px;*/
                    /*border:solid 1px #aaaaaa;*/
                    /*margin-bottom:20px;*/
                }

                .template {
                    /*border-radius:3px 3px 3px 3px;*/
                    /*border:solid 1px #70ddff;*/
                }

                .dropdown-content.table {
                    border:1px solid #ccc
                }

                .dropdown-content.table hr {
                    margin:3px 0 3px 0;
                }

                .paperItemTable {
                    padding: 2px 10px;
                    border-bottom: 1px solid #aaa;
                    cursor: pointer;
                    font-size: .9rem;
                }

                .paperItemTable.noBorderBottom {
                    border-bottom: 0;
                }

                .fs8rem {
                    font-size: .8rem;
                }

            </style>
        </custom-style>

        <div class="prose-editor-container">

            <div class="toolbar">
                <paper-icon-button icon="icons:undo" disabled="[[!canUndo]]" on-tap="doUndo"></paper-icon-button>
                <paper-icon-button icon="icons:redo" disabled="[[!canRedo]]" on-tap="doRedo"></paper-icon-button>

                <span class="divider"></span>

                <heading-picker heading="[[currentHeading]]" on-heading-picker-selected="doHeading"></heading-picker>

                <font-picker font="[[currentFont]]" on-font-picker-selected="doFont"></font-picker>

                <font-size-picker font-size="[[currentSize]]" font-size-list="[[sizes]]" on-font-size-picker-selected="doSize"></font-size-picker>

                <span class="divider"></span>

                <paper-icon-button icon="editor:format-bold" active="[[isStrong]]" on-tap="toggleBold"></paper-icon-button>
                <paper-icon-button icon="editor:format-italic" active="[[isEm]]" on-tap="toggleItalic"></paper-icon-button>
                <paper-icon-button icon="editor:format-underlined" active="[[isUnderlined]]" on-tap="toggleUnderlined"></paper-icon-button>
                <paper-icon-button icon="editor:format-clear" on-tap="doClear"></paper-icon-button>
                <color-picker icon="editor:format-color-text" color="[[currentColor]]" on-color-picker-selected="doColor"></color-picker>
                <color-picker icon="editor:format-color-fill" color="[[currentBgColor]]" on-color-picker-selected="doFillColor"></color-picker>

                <paper-icon-button icon="editor:format-align-left" active="[[isLeft]]" on-tap="doLeft"></paper-icon-button>
                <paper-icon-button icon="editor:format-align-center" active="[[isCenter]]" on-tap="doCenter"></paper-icon-button>
                <paper-icon-button icon="editor:format-align-right" active="[[isRight]]" on-tap="doRight"></paper-icon-button>
                <paper-icon-button icon="editor:format-align-justify" active="[[isJustify]]" on-tap="doJustify"></paper-icon-button>

                <paper-menu-button id="button" vertical-offset="42" horizontal-offset="16" on-opened-changed="_layout">
                    <paper-icon-button
                            id="iconButton"
                            icon="vaadin:table"
                            slot="dropdown-trigger"
                            alt="table options">
                    </paper-icon-button>
                    <div slot="dropdown-content" class="dropdown-content box table" on-tap="_onTap" id="box">
                        <paper-item class="paperItemTable noBorderBottom" on-tap="_insertTable">Insert table</paper-item>
                        <hr>
                        <paper-item class="paperItemTable fs8rem" on-tap="_addColumnBefore">Insert column before</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_addColumnAfter">Insert column after</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_deleteColumn">Delete column</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_addRowBefore">Insert row before</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_addRowAfter">Insert row after</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_deleteRow">Delete row</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_deleteTable">Delete table</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_mergeCells">Merge cells</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_splitCell">Split cell</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_toggleHeaderColumn">Toggle header column</paper-item>
                        <paper-item class="paperItemTable fs8rem" on-tap="_toggleHeaderRow">Toggle header row</paper-item>
                        <paper-item class="paperItemTable fs8rem noBorderBottom" on-tap="_toggleHeaderCell">Toggle header cells</paper-item>
                    </div>
                </paper-menu-button>

                <template is="dom-if" if="[[dynamicVars]]">
                    <span class="divider"></span>

                    <paper-menu-button id="insertVarMenuButton" no-overlap horizontal-align="left" horizontal-offset="-145" vertical-align="top" vertical-offset="-6">

                        <paper-icon-button
                                id="insertVarButton"
                                icon="vaadin:database"
                                slot="dropdown-trigger"
                                alt="insert variable">
                        </paper-icon-button>

                        <div slot="dropdown-content" class="dropdown-content box" id="dropdownVar">
                            <template id="varsRepeat" is="dom-repeat" items="[[dynamicVars]]" as="singleVar">
                                <template is="dom-if" if="[[_hasSeparator(dynamicVars,singleVar,index)]]"><span class="divider"></span></template>
                                <template is="dom-if" if="[[!singleVar.subVars]]"><paper-item on-tap="_insertOrEditVar" data-var="[[singleVar.name]]" data-prose="[[singleVar.nodes]]" class$="paperItemLevel1 [[singleVar.isLast]]">[[singleVar.name]]</paper-item></template>
                                <template is="dom-if" if="[[singleVar.subVars]]">

                                    <paper-menu-button  no-overlap horizontal-align="left" horizontal-offset="220" vertical-align="top" vertical-offset="-31">
                                        <paper-item slot="dropdown-trigger" class$="paperItemLevel1 hasChildren [[singleVar.isLast]] [[singleVar.additionalCssClasses]]">[[singleVar.name]]</paper-item>
                                        <div slot="dropdown-content" class="dropdown-content box">
                                            <template is="dom-if" if="[[singleVar.nodes]]"><paper-item on-tap="_insertOrEditVar" data-var="[[singleVar.name]]" data-prose="[[singleVar.nodes]]" class="paperItemLevel2">[[singleVar.name]]</paper-item></template>
                                            <template is="dom-repeat" items="[[singleVar.subVars]]" as="subVar">
                                                <paper-item on-tap="_insertOrEditVar" data-var="[[subVar.name]]" data-prose="[[subVar.nodes]]" class$="paperItemLevel2 [[subVar.isLast]]">[[subVar.name]]</paper-item>
                                            </template>
                                        </div>
                                    </paper-menu-button>

                                </template>
                            </template>
                        </div>

                    </paper-menu-button>

                </template>

                <span class="divider"></span>

                <paper-input no-label-float class="zoom" type="number" value="{{zoomLevel}}"><div slot="suffix">&nbsp;%</div></paper-input>
            </div>

            <div class="scroll-area">
                <div id="container" class="container">
                    <div id=editor class$="[[additionalCssClasses]]"></div>
                    <div style="display: none" id="content">
                        <div id="page_0" class="page"></div>
                    </div>
                </div>
            </div>

        </div>`
  }

  $: { editor: HTMLElement, content: HTMLElement } | any

  @property({type: Number})
  pageHeight: number = 976

  @property({type: Number, observer: '_zoomChanged'})
  zoomLevel = 120

  @property({type: Array})
  sizes = ['4px','5px','6px','7px','8px','9px','10px','11px','12px','13px','14px','16px','18px','20px','24px','28px','36px','48px','72px']

  @property({type: Boolean})
  isStrong : boolean = false
  @property({type: Boolean})
  isEm : boolean = false
  @property({type: Boolean})
  isUnderlined : boolean = false
  @property({type: Boolean})
  isVar : boolean = false
  @property({type: Boolean})
  isLeft : boolean = false
  @property({type: Boolean})
  isCenter : boolean = false
  @property({type: Boolean})
  isJustify : boolean = false
  @property({type: String})
  currentFont : string = ''
  @property({type: String})
  currentSize : string = ''
  @property({type: String})
  currentColor : string = ''
  @property({type: String})
  currentBgColor : string = ''
  @property({type: String})
  codeExpression : string = ''

  _zoomChanged() {
    if (this.$.container) {
      this.$.container.style.transform = "translateX(-50%)  translateY(" + (this.zoomLevel - 100) / 2 + "%) scale(" + (this.zoomLevel / 100) + ")"
    }
  }

  docNodeSpec: NodeSpec = {
    content: "page+"
  }

  pageNodeSpec: NodeSpec = {
    inline: false,
    draggable: false,
    isolating: true,
    attrs: {
      id: {default: 0}
    },
    content: "block+",

    toDOM: (node: any) => ["div", {class: "page", id: "page_" + node.attrs.id}, 0],
    parseDOM: [{
      tag: "div.page", getAttrs(dom) {
        return (dom instanceof HTMLDivElement) && {
          id: parseInt(dom.getAttribute("id")!!.substr(5))
        } || {}
      }
    }]
  }

  templateInstanceNodeSpec: NodeSpec = {
    inline: false,
    draggable: false,
    isolating: true,
    attrs: {},
    content: "block+",

    toDOM: () => {
      return ["div", {class: "template-instance"}, 0]
    },
    parseDOM: [{
      tag: "div.template-instance", getAttrs() { return {} }
    }]
  }

  templateNodeSpec: NodeSpec = {
    group: "block",
    inline: false,
    draggable: true,
    isolating: true,
    attrs: {
      expr: {default: ''},
      template: {default: ''},
      renderTimestamp: {default: 0}
    },
    content: "ti*",

    toDOM: (node: any) => {
      const {expr, template, renderTimestamp} = node.attrs
      return ["div", {class: "template", 'data-expr': expr, 'data-template': JSON.stringify(template), 'data-ts': renderTimestamp.toString()}, 0]
    },
    parseDOM: [{
      tag: "div.template", getAttrs(dom) {
        return (dom instanceof HTMLDivElement) && {
          expr: dom.dataset.expr,
          template: dom.dataset.template && JSON.parse(dom.dataset.template) || null,
          renderTimestamp: Number(dom.dataset.ts || 0)
        } || {}
      }
    }]
  }

  variableNodeSpec: NodeSpec = {
    inline: true,
    group: "inline",
    draggable: true,
    atom: false,
    isolating: true,
    content: "text*",
    attrs: {
      expr: {default: ''},
      rendered: {default: ''},
      renderTimestamp: {default: 0}
    },

    toDOM: (node: any) => {
      const {expr, rendered, renderTimestamp} = node.attrs
      return ["span", {class: "variable", 'data-expr': expr, 'data-rendered': rendered, 'data-ts': renderTimestamp.toString()}, 0]
    },
    parseDOM: [{
      tag: "span.variable", getAttrs(dom) {
        return (dom instanceof HTMLSpanElement) && {
          expr: dom.dataset.expr,
          rendered: dom.dataset.rendered,
          renderTimestamp: Number(dom.dataset.ts || 0)
        } || {}
      }
    }]
  }

  tabNodeSpec: NodeSpec = {
    inline: true,
    group: "inline",
    draggable: false,

    toDOM: (node: any) => ["span", {style: "padding-left:100px", class: "tab"}],
    parseDOM: [{tag: "span.var", getAttrs(dom) { return {expr: (dom as HTMLElement).dataset.expr} }}]
  }

  @property({type: Object})
  editorSchema = new Schema({
    nodes: (schema.spec.nodes as any)
      .remove("doc").addToStart("page", this.pageNodeSpec).addToStart("doc", this.docNodeSpec)
      .update("paragraph", Object.assign((schema.spec.nodes as any).get("paragraph"), {
        attrs: { align: {default: 'inherit'} },
        parseDOM: [{tag: "p", getAttrs(value : HTMLElement) { return {align: value.style && value.style.textAlign || 'inherit'}}}],
        toDOM(node: any) { return ["p", {style: "text-align:"+(node.attrs.align || 'inherit')}, 0] }
      }))
      .update("heading", Object.assign((schema.spec.nodes as any).get("heading"), {
        attrs: Object.assign((schema.spec.nodes as any).get("heading").attrs, { align: {default: 'inherit'} }),
        parseDOM: (schema.spec.nodes as any).get("heading").parseDOM.map((r: ParseRule) => Object.assign(r, {getAttrs(value : HTMLElement) {
          return {level: parseInt(value.tagName.replace(/.+([0-9]+)/,'$1')), align: value.style && value.style.textAlign || 'inherit'}
        }})),
        toDOM(node: any) {
          return ["h" + node.attrs.level, {style: "text-align: "+(node.attrs.align || 'inherit')}, 0]
        }
      }))
      .append({"template":this.templateNodeSpec})
      .append({"ti":this.templateInstanceNodeSpec})
      .append({"variable":this.variableNodeSpec})
      .append(tableNodes({
        tableGroup: "block",
        cellContent: "block+",
        cellAttributes: {
          borderColor: {
            default: null,
            getFromDOM(dom) { return (dom as HTMLElement).style.borderColor || null },
            setDOMAttr(value, attrs) { if (value) attrs.style = (attrs.style || "") + `border-color: ${value};` }
          },
          background: {
            default: null,
            getFromDOM(dom) { return (dom as HTMLElement).style.backgroundColor || null },
            setDOMAttr(value, attrs) { if (value) attrs.style = (attrs.style || "") + `background-color: ${value};` }
          }
        }
      }))
      //.addBefore("image", "tab", this.tabNodeSpec)
    ,
    marks: (schema.spec.marks as any)
      .addToEnd("underlined", {
        attrs: {
          underline: {default: 'underline'}
        },
        parseDOM: [{tag: "u"}, {
          style: 'text-decoration',
          getAttrs(value:any) {
            return {underline: value}
          }
        }],
        toDOM(mark:Mark) {
          let {underline} = mark.attrs
          return ['span', {style: `text-decoration: ${underline || 'underline'}`}, 0]
        }
      }).addToEnd("color", {
        attrs: {
          color: {default: ''}
        },
        parseDOM: [
          {
            style: 'color',
            getAttrs(value:any) {
              return {color: value}
            }
          }
        ],
        toDOM(mark:Mark) {
          let {color} = mark.attrs
          return ['span', {style: `color: ${color}`}, 0]
        }
      }).addToEnd("font", {
        attrs: {
          font: {default: ''}
        },
        parseDOM: [
          {
            style: 'font-family',
            getAttrs(value:any) {
              return {font: value}
            }
          }
        ],
        toDOM(mark:Mark) {
          let {font} = mark.attrs
          return ['span', {style: `font-family: ${font}`}, 0]
        }
      }).addToEnd("size", {
        attrs: {
          size: {default: ''}
        },
        parseDOM: [
          {
            style: 'font-size',
            getAttrs(value:any) {
              return {size: value}
            }
          }
        ],
        toDOM(mark:Mark) {
          let {size} = mark.attrs
          return ['span', {style: `font-size: ${size}`}, 0]
        }
      }).addToEnd("bgcolor", {
        attrs: {
          color: {default: ''}
        },
        parseDOM: [
          {
            style: 'background',
            getAttrs(value: any) {
              return {color: value}
            }
          }
        ],
        toDOM(mark:Mark) {
          let {color} = mark.attrs
          return ['span', {style: `background: ${color}`}, 0]
        }
      })
  })

  @property({type: Object})
  editorView?: EditorView

  layout() {
    const view = this.editorView
    if (view) {
      const state = view.state
      const pages: any[] = []
      state.doc.forEach((node: Node, offset: number) => pages.splice(pages.length, 0, {
        offset: offset,
        node: node
      }))
      for (const page of pages) {
        const pageDom = (view.domAtPos(0).node as Element).getElementsByClassName('page')[page.node.attrs.id] as HTMLElement
        const reverseSubNodes: any[] = []

        if (pageDom.offsetHeight > this.pageHeight) {
          page.node.forEach((node: Node, offset: number) => {
            reverseSubNodes.splice(0, 0, {
              offset: offset,
              node: node
            })
          })

          if (reverseSubNodes.length) {
            const subNode = reverseSubNodes[0];
            const start = page.offset + 1 + subNode.offset

			//let tr = state.tr
			let tr = view.state.tr
            const nextPage = state.doc.nodeAt(page.offset + page.node.nodeSize)
            if (!nextPage) {
              tr = tr.insert(page.offset + page.node.nodeSize, page.node.type.create({id: (page.node.attrs.id || 0) + 1}))
            }
			tr.insert(page.offset + page.node.nodeSize + 1, subNode.node).delete(start, start + subNode.node.nodeSize)
            //const pos = tr.doc.resolve(tr.steps[tr.steps.length - 1].getMap().map(page.offset + page.node.nodeSize + 1 + subNode.node.nodeSize))
            //tr.setSelection(new TextSelection(pos, pos))
			view.dispatch(tr.scrollIntoView());
          }
        }
      }
    }
  }

  ready() {
    super.ready()

    const proseEditor = this

    let selectionTrackingPlugin = new Plugin({
      view(view) {
        return {
          update: function (view, prevState) {
            var state = view.state;

            if (!(prevState && prevState.doc.eq(state.doc) && prevState.selection.eq(state.selection))) {
              const {$anchor, $head, $cursor} = state.selection as TextSelection
              const node = state.doc.nodeAt($anchor.pos) || ($head && state.doc.nodeAt($head.pos))

              if (node && node.type.name === 'heading') {
                proseEditor.set('currentHeading', 'Heading ' + node.attrs.level)
              } else {
                proseEditor.set('currentHeading', 'Normal')
              }
              //Might want to restrict node marks analysis to paragraphs and headings
              let marks = ($cursor && $cursor.marks() && $cursor.marks().length ? $cursor.marks() : state.storedMarks) || []

              const {from, to} = state.selection

              let align : string | null = null
              state.doc.nodesBetween(from, to, (node, pos) => {
                if ((node.type === proseEditor.editorSchema.nodes.paragraph || node.type === proseEditor.editorSchema.nodes.heading) && node.attrs.align != align) {
                  align = node.attrs.align
                }
                if (!marks.length && node.marks.length) {
                  marks = node.marks
                }
              })

              const fontMark = marks.find(m => m.type === proseEditor.editorSchema.marks.font)
              const sizeMark = marks.find(m => m.type === proseEditor.editorSchema.marks.size)
              const strongMark = marks.find(m => m.type === proseEditor.editorSchema.marks.strong)
              const emMark = marks.find(m => m.type === proseEditor.editorSchema.marks.em)
              const underlinedMark = marks.find(m => m.type === proseEditor.editorSchema.marks.underlined)
              const colorMark = marks.find(m => m.type === proseEditor.editorSchema.marks.color)
              const bgcolorMark = marks.find(m => m.type === proseEditor.editorSchema.marks.bgcolor)
              const varMark = marks.find(m => m.type === proseEditor.editorSchema.marks.var)

              proseEditor.set('currentFont', fontMark && fontMark.attrs.font || 'Roboto')
              proseEditor.set('currentSize', sizeMark && sizeMark.attrs.size || '11px')
              proseEditor.set('isStrong', !!strongMark )
              proseEditor.set('isEm', !!emMark )
              proseEditor.set('isUnderlined', !!underlinedMark )
              proseEditor.set('currentColor', colorMark && colorMark.attrs.color || '#000000' )
              proseEditor.set('currentBgColor', bgcolorMark && bgcolorMark.attrs.color || '#000000' )
              proseEditor.set('isVar',  varMark && varMark.attrs.expr &&  varMark && varMark.attrs.expr.length)
              proseEditor.set('codeExpression',  varMark && varMark.attrs.expr || '')

              proseEditor.set('isLeft', align && align === 'left')
              proseEditor.set('isCenter',  align && align === 'center' )
              proseEditor.set('isRight',  align && align === 'right' )
              proseEditor.set('isJustify',  align && align === 'justify' )

              proseEditor.set('canUndo', undoDepth(state) !== 0)
              proseEditor.set('canRedo', redoDepth(state) !== 0)
            }
          }
        }
      }
    });

    let paginationPlugin = new Plugin({
      appendTransaction(tr, oldState, newState) {
        setTimeout(() => proseEditor.layout(), 0)
        if (oldState.doc.childCount > newState.doc.childCount && tr[0].steps[0] instanceof ReplaceStep) {
          const loc: number = (tr[0].steps[0] as any).from
          const lastNode = newState.doc.nodeAt(loc)
          if (lastNode && lastNode.type.name === 'paragraph') {
            return newState.tr.join(loc)
          }
        }
        return null
      },
      props: {
        //nodeViews: { page(node, view, getPos, decorations) { return new PageView(node, view, getPos, decorations) } }
      }
    });

    let paragraphPlugin = new Plugin({
      view: ((view: EditorView) => {
        return {
          update: (view, state) => {
            view.state.doc.descendants((n, pos, parent) => {
              if (n.type == view.state.schema.nodes.paragraph) {
                const p = view.domAtPos(pos).node as HTMLParagraphElement
                Array.from(p.getElementsByClassName('tab')).forEach(span => {
                  if (span instanceof HTMLSpanElement) {
                    const prev = span.previousSibling
                    const delta = prev && (prev instanceof HTMLSpanElement) && prev.classList.contains('tab') ? 1 : 0
                    const desiredPadding = (200 - (span.offsetLeft + delta - p!!.offsetLeft) % 200) + 'px'
                    if (desiredPadding !== span.style.paddingLeft) {
                      span.style.paddingLeft = desiredPadding
                    }
                  }
                })
              } else if (n.type == view.state.schema.nodes.tab) {
              }
              return true
            })
            return true
          },
          destroy: () => {
          }
        }
      })
    });

    let templateTrackerPlugin = new Plugin({
      appendTransaction(tr, oldState, newState) {
        if (tr[0] && tr[0].steps && tr[0].steps.length) {
          const a = tr[0].selection.$anchor
          for (let l = a.depth - 1; l > 0; l--) {
            let ti = a.node(l)
            if (ti.type.name === 'ti') {
              let tplt = a.node(l - 1)
              const newTemplate = Object.assign({}, tplt.attrs.template)
              newTemplate[ti.attrs.tid] = ti.toJSON()['content']
              return newState.tr.replaceWith(a.start(l - 1) - 1, a.end(l - 1) + 1, newState.schema.nodes.template.create({expr: tplt.attrs.expr, template: newTemplate, renderTimestamp: tplt.attrs.renderTimestamp}, tplt.content))
            }
          }
        }
      },
      props: {}
    });

    let state = EditorState.create({
      doc: DOMParser.fromSchema(this.editorSchema).parse(this.$.content),
      plugins: [
        history(),
        dropCursor(),
        gapCursor(),
        columnResizing({}),
        tableEditing(),
        keymap(Object.assign(baseKeymap,{
          "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlockKeepMarks),
          "Tab": goToNextCell(1),
          "Shift-Tab": goToNextCell(-1),
          "Mod-b": toggleMark(this.editorSchema.marks.strong, {}),
          "Mod-i": toggleMark(this.editorSchema.marks.em, {}),
          "Mod-u": toggleMark(this.editorSchema.marks.underlined, {}),
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-+': (e: EditorState, d?: (tr: Transaction) => void) => this.addMark(this.editorSchema.marks.size, {size: proseEditor.sizes[Math.min(proseEditor.currentSizeIdx(), proseEditor.sizes.length-2) + 1]})(e,d),
          'Mod--': (e: EditorState, d?: (tr: Transaction) => void) => this.addMark(this.editorSchema.marks.size, {size: proseEditor.sizes[Math.max(proseEditor.currentSizeIdx(), 1) - 1]})(e,d),
          'Mod-Shift-k' : this.clearMarks()
        })),
        selectionTrackingPlugin,
		// LDE: disabling paginationPlugin because a node bigger than one single page generates infinite loop
	    //paginationPlugin,
        paragraphPlugin,
        templateTrackerPlugin
      ]
    })

    let fix = fixTables(state)
    if (fix) state = state.apply(fix.setMeta("addToHistory", false))

    this.editorView = new EditorView(this.$.editor, {
      state: state,
      nodeViews: {
        variable(node, view, getPos) { return new VariableView(node, view, getPos as any) }
      },
      // TODO: this was to prevent pasting impossible elements like li, a, etc. from external source, which are not supported
      transformPastedHTML: function transformEditorPastedHTML(html: string): string {
        var ALLOWED_TAGS = ['STRONG', 'EM', 'SPAN', 'P', 'LI', 'UL', 'OL', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'DIV']
        function sanitize(el: HTMLElement) {
          debugger
          const tags = Array.prototype.slice.apply(el.getElementsByTagName('*'), [0])
          for (let i = 0; i < tags.length; i++) {
            if (ALLOWED_TAGS.indexOf(tags[i].nodeName) === -1) {
              let last = tags[i]
              for (let j = tags[i].childNodes.length - 1; j >= 0; j--) {
                const e = tags[i].removeChild(tags[i].childNodes[j])
                tags[i].parentNode.insertBefore(e, last)
                last = e
              }
              tags[i].parentNode.removeChild(tags[i])
            }
          }
        }
        const tmp =  document.createElement('DIV')
        tmp.innerHTML = html
        sanitize(tmp)
        return tmp.innerHTML
      }
    })

    //document.execCommand("enableObjectResizing", false, false)
    //document.execCommand("enableInlineTableEditing", false, false)
  }

  setHTMLContent(doc:HTMLElement) {
    if (this.editorView) {
      const node = DOMParser.fromSchema(this.editorSchema).parse(doc)
      let newState = EditorState.create({schema: this.editorSchema, doc: node, plugins: this.editorView.state.plugins});
      this.editorView.updateState(newState);
    }
  }

  setJSONContent(doc:string) {
    if (this.editorView) {
      const node = Node.fromJSON(this.editorSchema, JSON.parse(doc))
      let newState = EditorState.create({schema: this.editorSchema, doc: node, plugins: this.editorView.state.plugins});
      this.editorView.updateState(newState);
    }
  }

  applyContext(ctxFn:(expr:string, ctx?:any, cache?:any) => Promise<any>, ctx: { [key: string] : any }) {
    if (this.editorView) {
      const ts = +new Date()
      const state = this.editorView.state

      const visit = (prom:Promise<Transaction>) : Promise<Transaction> => {
        return prom.then(tr => {

          const detect = (node: Node, absPos: number, lazyCtx: () => Promise<{ [key: string] : any }>) : Promise<{node: Node, pos: number, ctx:{ [key: string] : any }} | undefined> => {
            if (node.type === this.editorSchema.nodes.template) {
              if (node.attrs.renderTimestamp < ts) {
                return lazyCtx().then(ctx => ({node: node, pos: absPos, ctx: ctx}))
              } else {
                let prom : Promise<{node: Node, pos: number, ctx:{ [key: string] : any }} | undefined> = Promise.resolve(undefined)
                node.forEach((child, pos, idx) => {
                  prom = prom.then(selected => {
                    return selected || detect(child, absPos+1+pos, () => lazyCtx()
                      .then(ctx => {
                        //If possible drill down in contexts
                        return ctxFn(node.attrs.expr, ctx)
                          .catch(e => {
                            console.log(`Error during expression ${node.attrs.expr} evaluation`, e)
                            return ctx
                          }) //Execute template function on current ctx
                      }).then((subCtx:any) => {
                        console.log(`Select ${idx}th element in `, subCtx)
                        return subCtx && (subCtx[0] ? subCtx[idx] : subCtx)
                      })) //and select idxth element from the result
                  })
                })
                return prom
              }
            } else if (node.type === this.editorSchema.nodes.variable && (node.attrs.renderTimestamp || 0)  < ts) {
              return lazyCtx().then(ctx => ({node: node, pos: absPos, ctx: ctx}))
            } else if (node.childCount) {
              let prom : Promise<{node: Node, pos: number, ctx:{ [key: string] : any }} | undefined> = Promise.resolve(undefined)
              node.forEach((child, pos) => {
                prom = prom.then(selected => {
                  return selected || detect(child, absPos+1+pos, lazyCtx)
                })
              })
              return prom
            } else {
              return Promise.resolve(undefined)
            }
          }

          return detect(tr.doc, -1 /* Because there is always a doc and 0 is inside the doc */, () => Promise.resolve(ctx) /* initial ctxt is just an object, so that we can just resolve to it */)
            .then(selected => {
              if (selected) {
                if (selected.node.type === this.editorSchema.nodes.template) {
                  return visit(
                    ctxFn(selected.node.attrs.expr, selected.ctx)
                      .catch(e => {console.log(`Error during expression ${selected.node.attrs.expr} evaluation`, e); return null})
                      .then((ctx) => {
                        return tr.replaceWith(selected.pos, selected.pos + selected.node.nodeSize,
                            this.editorSchema.nodes.template.create({expr: selected.node.attrs.expr, template: selected.node.attrs.template, renderTimestamp: ts},
                              ctx && ctx[0] && ctx.map((ctxi:any, i:number) => this.editorSchema.nodes.ti.create({idx:i,d:ctxi.dataProvider.form().template.id},
                              (selected.node.attrs.template[ctxi.dataProvider.form().template.id] || selected.node.attrs.template['default'])
                                .map((aNode:{ [key: string]: any }) => Node.fromJSON(this.editorSchema, aNode)))) || []))
                      })
                  )
                } else {
                  return visit(
                    ctxFn(selected.node.attrs.expr, selected.ctx)
                      .catch(e => {console.log(`Error during expression ${selected.node.attrs.expr} evaluation`, e); return null})
                      .then((ctx) => {
                      return tr.replaceWith(selected.pos, selected.pos + selected.node.nodeSize, this.editorSchema.nodes.variable.create({expr: selected.node.attrs.expr, renderTimestamp: ts, rendered: ctx && ctx.toString() || " "}))
                    })
                  )
                }
              } else {
                return Promise.resolve(tr)
              }
            })
        })
      }
      visit(Promise.resolve(state.tr)).then(tr => this.editorView && this.editorView.dispatch(tr))
    }
  }

  currentSizeIdx() {
    if (!this.sizes) { return 0 }
    const idx = this.sizes.indexOf(this.get('currentSize'))
    return idx >= 0 ? idx : this.sizes.length/2
  }

  doUndo(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      undo(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
      this.set('canUndo', undoDepth(this.editorView.state) !== 0)
      this.set('canRedo', redoDepth(this.editorView.state) !== 0)
    }
  }

  doRedo(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      redo(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
      this.set('canUndo', undoDepth(this.editorView.state) !== 0)
      this.set('canRedo', redoDepth(this.editorView.state) !== 0)
    }
  }

  toggleBold(e: Event) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      toggleMark(this.editorSchema.marks.strong, {})(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
      this.set('isStrong', !this.isStrong)
    }
  }

  toggleItalic(e: Event) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      toggleMark(this.editorSchema.marks.em, {})(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
      this.set('isEm', !this.isEm)
    }
  }

  toggleUnderlined(e: Event) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      toggleMark(this.editorSchema.marks.underlined, {})(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
      this.set('isUnderlined', !this.isUnderlined)
    }
  }

  doClear(e: Event) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      this.clearMarks()(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doColor(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      this.addMark(this.editorSchema.marks.color, {color: e.detail.color})(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doFillColor(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      this.addMark(this.editorSchema.marks.bgcolor, {color: e.detail.color})(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doFont(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView && e.detail && e.detail.value && e.detail.value.length) {
      this.addMark(this.editorSchema.marks.font, {font: e.detail.value})(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doSize(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView && e.detail && e.detail.value && e.detail.value.length) {
      this.addMark(this.editorSchema.marks.size, {size: e.detail.value.replace(/ /, '')})(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doHeading(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView && e.detail && e.detail.value && e.detail.value.length) {
      setBlockType(this.editorSchema.nodes.heading, {level: parseInt(e.detail.value.replace(/.+ ([0-9]+)/, '$1'))})(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doLeft(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      this.setAlignment("left")(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doCenter(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      this.setAlignment("center")(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doRight(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      this.setAlignment("right")(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  doJustify(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      this.setAlignment("justify")(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }


  setAlignment(align: String) {
    const proseEditor = this
    return function(state: EditorState, dispatch?: (tr: Transaction) => void)  {
      let {from, to} = state.selection
      let hasChange = false
      let tr = state.tr
      state.doc.nodesBetween(from, to, (node, pos) => {
        if ((node.type === proseEditor.editorSchema.nodes.paragraph || node.type === proseEditor.editorSchema.nodes.heading) && node.attrs.align != align) {
					tr = tr.setNodeMarkup(pos, undefined, Object.assign({}, node.attrs, { align: align }))
          hasChange = true
        }
      })
      if (hasChange && dispatch) dispatch(tr.scrollIntoView())
      return true
    }
  }

  addMark(markType: MarkType, attrs?: { [key: string]: any }): (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean {
    return function (state, dispatch) {
      let {empty, $cursor, ranges} = state.selection as TextSelection
      if ((empty && !$cursor)) return false
      if (dispatch) {
        const tr = state.tr
        if ($cursor) {
          dispatch(tr.addStoredMark(markType.create(attrs)))
        } else {
          for (let i = 0; i < ranges.length; i++) {
            let {$from, $to} = ranges[i]
            tr.addMark($from.pos, $to.pos, markType.create(attrs))
          }
          dispatch(tr.scrollIntoView())
        }
      }
      return true
    }
  }

  clearMarks(): (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean {
    return function (state, dispatch) {
      let {empty, $cursor, ranges} = state.selection as TextSelection
      if ((empty && !$cursor)) return false
      if (dispatch) {
        let tr = state.tr
        if ($cursor) {
          $cursor.marks().forEach(m => {tr = tr.removeStoredMark(m)})
          dispatch(tr.scrollIntoView())
        } else {
          for (let i = 0; i < ranges.length; i++) {
            let {$from, $to} = ranges[i]
            if ($to.pos > $from.pos) {
              state.doc.nodesBetween($from.pos, $to.pos, () => {
                tr = tr.removeMark($from.pos, $to.pos)
              })
            }
          }
          dispatch(tr.scrollIntoView())
        }
      }
      return true
    }
  }

  _insertTable(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      const state = this.editorView.state;

      let {$from, $to} = state.selection, index = $from.index()
      if ($from !== $to) {
        return false
      }
      if (this.editorView.dispatch) {
        const scNodes = state.schema.nodes;
        const newState = state.tr.replaceSelectionWith(scNodes.table.create({},[scNodes.table_row.create({},[scNodes.table_cell.create({},[scNodes.paragraph.create({})])])]))
        this.editorView.dispatch(newState)
      }
      return true
    }
  }

  _addColumnBefore(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      addColumnBefore(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _addColumnAfter(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      addColumnAfter(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _deleteColumn(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      deleteColumn(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _addRowBefore(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      addRowBefore(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _addRowAfter(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      addRowAfter(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _deleteRow(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      deleteRow(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _deleteTable(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      deleteTable(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _mergeCells(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      mergeCells(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _splitCell(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      splitCell(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _toggleHeaderColumn(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      toggleHeaderColumn(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _toggleHeaderRow(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      toggleHeaderRow(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }
  _toggleHeaderCell(e: CustomEvent) {
    e.stopPropagation()
    e.preventDefault()
    if (this.editorView) {
      toggleHeaderCell(this.editorView.state, this.editorView.dispatch)
      this.editorView.focus()
    }
  }

  _insertOrEditVar(e: CustomEvent) {
      e.stopPropagation()
      e.preventDefault()
      if (this.editorView) {
          const state = this.editorView.state;
          let {$from, $to} = state.selection, index = $from.index()
          if ($from !== $to) { return false }
          if (this.editorView.dispatch) {
            const nodes = (e.target as any).dataProse
            if (nodes && nodes.length) {
              const newState = state.tr.replaceSelection(new Slice(Fragment.fromJSON(state.schema, nodes), 0, 0));
              this.editorView.dispatch(newState)
              this.dispatchEvent(new CustomEvent("refresh-context",{bubbles: true, detail: {name:_.get( e, "target.dataVar", "" )}}));

            }
          }
          if(!this.editorView.hasFocus()) this.editorView.focus()
          return true
      }
  }

  _hasSeparator(vars: Array<any>, aVar:any, index:number) {
    return index>0 && aVar.type !== vars[index-1].type
  }

}

class VariableView implements NodeView<Schema> {
  dom?: HTMLElement | null;
  contentDOM?: HTMLElement | null;
  private node: Node;
  private outerView: EditorView;
  private getPos: () => number;
  private innerView: EditorView | null;

  constructor(node: Node, view: EditorView, getPos: () => number) {
    // We'll need these later
    this.node = node
    this.outerView = view
    this.getPos = getPos

    // The node's representation in the editor (empty, for now)
    const {expr, rendered, renderTimestamp} = node.attrs

    const newDom = document.createElement("span")
    newDom.classList.add('variable')
    newDom.dataset.expr = expr
    newDom.dataset.rendered = rendered
    newDom.dataset.ts = renderTimestamp.toString()
    newDom.innerText = rendered

    this.dom = newDom

    // These are used when the footnote is selected
    this.innerView = null
  }
  selectNode() {
    if (this.dom) {
      this.dom.classList.add("ProseMirror-selectednode")
      //if (!this.innerView) this.open()
    }
  }

  deselectNode() {
    if (this.dom) {
      this.dom.classList.remove("ProseMirror-selectednode")
      //if (this.innerView) this.close()
    }
  }

  open() {
    if (this.dom) {

      // Append a tooltip to the outer node
      let tooltip = this.dom.appendChild(document.createElement("div"))
      tooltip.className = "footnote-tooltip"
      // And put a sub-ProseMirror into that
      this.innerView = new EditorView(tooltip, {
        // You can use any node as an editor document
        state: EditorState.create({
          doc: this.node,
          plugins: [keymap({
            "Mod-z": () => undo(this.outerView.state, this.outerView.dispatch),
            "Mod-y": () => redo(this.outerView.state, this.outerView.dispatch)
          })]
        }),
        // This is the magic part
        dispatchTransaction: this.dispatchInner.bind(this),
        handleDOMEvents: {
          mousedown: () => {
            // Kludge to prevent issues due to the fact that the whole
            // footnote is node-selected (and thus DOM-selected) when
            // the parent editor is focused.
            if (this.outerView.hasFocus() && this.innerView) this.innerView.focus()
            return false
          }
        }
      })
    }
  }

  close() {
    if (this.innerView) {
      this.innerView.destroy()
      this.innerView = null
    }
  }

  dispatchInner(tr: Transaction) {
    if (this.innerView) {
      let {state, transactions} = this.innerView.state.applyTransaction(tr)
      this.innerView.updateState(state)

      if (!tr.getMeta("fromOutside")) {
        let outerTr = this.outerView.state.tr, offsetMap = StepMap.offset(this.getPos() + 1)
        for (let i = 0; i < transactions.length; i++) {
          let steps = transactions[i].steps
          for (let j = 0; j < steps.length; j++) {
             const aStep = steps[j].map(offsetMap);
             aStep && outerTr.step(aStep)
          }
        }
        if (outerTr.docChanged) this.outerView.dispatch(outerTr)
      }
    }
  }

  update(node: Node) {
    if (!node.sameMarkup(this.node)) return false
    this.node = node
    if (this.innerView) {
      let state = this.innerView.state
      let start = node.content.findDiffStart(state.doc.content)
      if (start != null) {
        let {a: endA, b: endB} = node.content.findDiffEnd(state.doc.content as any) || {a:-1, b:-1}
        if (endA>0) {
          let overlap = start - Math.min(endA, endB)
          if (overlap > 0) {
            endA += overlap;
            endB += overlap
          }
          this.innerView.dispatch(
            state.tr
              .replace(start, endB, node.slice(start, endA))
              .setMeta("fromOutside", true))
        }
      }
    }
    return true
  }
  destroy() {
    if (this.innerView) this.close()
  }

  stopEvent(event:any) {
    return this.innerView && this.innerView.dom.contains(event.target) || false
  }

  ignoreMutation() { return true }
}


