import '../../ht-spinner/ht-spinner.js'
import '../../../styles/spinner-style.js'
import '../../../styles/vaadin-icure-theme.js'
import '../../../styles/dialog-style.js'
import './related-code-link.js'
import '../../dynamic-form/validator/ht-inami-validator.js'
import * as models from 'icc-api/dist/icc-api/model/models'
import moment from 'moment/src/moment'
import * as evaljs from "evaljs"
import mustache from "mustache/mustache.js"

import {TkLocalizerMixin} from "../../tk-localizer"
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class"
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior"
import {PolymerElement, html} from '@polymer/polymer'

class HtPatInvoicingDialog extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
    static get template() {
        return html`
        <style include="spinner-style vaadin-icure-theme dialog-style">

            paper-button[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }

            .invoice-item {
                height: 90px;
                width: auto;
                box-shadow: var(--shadow-elevation-3dp_-_box-shadow);
                margin-top: 12px;
            }

            .invoice-item:first-child{
                margin-top: 0;
            }

            .invoice-item-title {
                height: 20px;
                width: auto;
                background: rgba(0, 0, 0, .1);
            }

            #invoiceDialog {
                height: calc(100vh - 40px);
                width: calc(100% - 40px);
                z-index: 1100;
                display: grid;
                grid-template-columns: 20% 80%;
                grid-template-rows: 100%;
                position: fixed;
                top: 64px;
                left: 0;
                bottom: 0;
                right: 0;
            }

            .invoice-panel {
                height: 100%;
                background: var(--app-background-color-dark);
                box-shadow: var(--shadow-elevation-3dp_-_box-shadow);
                grid-column: 1/2;
                grid-row: 1/1;
                z-index: 3;
                overflow-y: auto;
                margin-top: 0px;
                padding: 12px;
                box-sizing: border-box;
            }

            .detail-panel {
                height: calc(100% - 45px);
                background: var(--app-background-color);
                /*box-shadow: var(--shadow-elevation-2dp_-_box-shadow);*/
                border-bottom: 1px solid var(--app-background-color-dark);
                margin: 0;
                grid-column: 2/2;
                grid-row: 1/1;
                z-index: 2;
                overflow-y: auto;
                padding: 24px;
                box-sizing: border-box;
            }

            .invoice-header {
                height: auto;
                width: auto;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
            }

            .invoice-nomenclature-code {
                height: auto;
                overflow-y: auto;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                margin-top: 24px;
            }

            .invoice-detail {
                min-height: 200px;
                height: auto;
                width: auto;
                overflow-y: auto;
                box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
                margin-top: 12px;
                margin-bottom: 12px;
            }

            .flex-container {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .flex-container > * {
                margin-right: 12px;
            }

            .flex-container-nmcl {
                display: flex;
                flex-flow: row nowrap;
                align-items: flex-end;
            }

            .flex-container-nmcl-row {
                flex: 1;
                padding: 0px;
            }

            .flex-container-descr-nmcl-row {
                flex: 8;
                padding: 0px;
            }

            vaadin-text-field{
                height: 40px;
                padding: 0;
            }

            #invoice-type {
                flex: 1;
                padding: 0;
            }

            #invoice-mode {
                flex: 1;
                padding: 0;
            }

            #invoice-number {
                flex: 1;
                margin-top: 0;
                margin-bottom: 0;
            }

            #invoice-date {
                flex: 1;
                padding: 0;
            }

            #invoice-period {
                flex: 1;
                margin: 0;
            }

            #invoice-careProviderType {
                flex: 1;
                padding: 0;
            }

            #invoice-nihiiTrainee {
                flex: 1;
                padding: 0;
            }

            #invoice-thirdPartyJustification {
                flex: 3;
                padding: 0;
            }

            #invoice-dmg {
                flex: 1;
                margin-bottom: 0;
            }

            #invoice-creditNote {
                flex: 1;
                padding: 0;
            }

            .title {
                height: 20px;
                color: var(--app-text-color);
                background-color: var(--app-background-color-dark);
                font-weight: 700;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
            }

            .title-txt {
                padding-left: 8px;
                width: 100%;
            }
            .nmcl-descr {
                overflow-y: hidden;
                /*height: 332px;*/
            }

            .nmcl-favorite {
                display: flex;
                padding: 5px;
            }

            .nmcl-favorite span{
                padding: 8px;
            }

            .invoice-nomenclature-code-option {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-around;
                margin-bottom: 12px;
                padding: 0 0 0 12px;
            }

            .invoice-nomenclature-code-option > * {
                margin-right: 12px;
            }

            .nmcl-list {
                overflow-y: auto;
            }
            .favcodes-flex {
                flex: 1;
                overflow: hidden;
                flex-direction: row;
                display: flex;
                justify-content: space-between;
            }
            .favcodes-flex > * {
                display: block;
            }
            .favcodes-flex > .hidden {
                display: none;
            }
            .favcodes-flex .paddle {
                width: 24px;
                height: 20px;
                margin: 8px 4px 0;
                min-width: 24px;
                padding: 0;
                color: var(--app-text-color);
                transition: .5s ease;
                cursor: pointer;
                background: var(--app-background-color-darker);
                border-radius: 4px;
            }
            .paddle:hover{transform:scale(.9);}

            .favcodes-box {
                flex-grow: 1;
                height: 20px;
                display: flex;
                overflow: hidden;
                flex-direction: row;
                margin: 8px 0;
            }
            .favcodes-box .nmclFavoriteCode {
                transition: all .25s ease-in;
            }

            #nmclGrid {
                height: 202px;
            }

            #nmcl-search {
                flex: 1;
                padding: 0;
            }

            .mobile-col{
                padding: 12px 0 12px 12px;
            }

            .invoice-item {
                background: var(--app-background-color);
                color: var(--app-text-color);
                outline: 0;
                padding: 0;
                align-items: flex-start !important;
                @apply --shadow-elevation-2dp;
                position: relative;
            }

            .invoice-item .label-container {
                display: flex;
                flex-flow: row nowrap;
            }

            .invoice-item.iron-selected {
                background: var(--app-primary-color);
                color: var(--app-text-color-light);
            }

            .invoice-item.iron-selected .invoice-text-row.invoice-text-date {
                color: var(--app-text-color-light);
            }

            .invoice-item.iron-selected .invoice-text-row .invoiceDateInfo {
                border-color: var(--app-primary-color-light);
            }

            .invoice-item.iron-selected .invoice-text-row  .invoiceDateInfo .item {
                border-color: var(--app-primary-color-light);
            }

            .invoice-item h4 {
                font-size: 14px;
                font-weight: 600;
                margin: 0;
                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /*overflow: hidden;*/
                /*text-overflow: ellipsis;*/
                /*white-space: nowrap;*/

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;
                padding: 0 8px;
            }

            .invoice-item .invoice-text-row {
                width: 100%;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: center;
                font-size: 14px;
                padding: 0;
                overflow-x: auto;
                box-sizing: border-box;
                flex-grow: 1;
            }
            .invoice-item .invoice-text-row.invoice-text-date {
                padding: 0 8px;
                font-size: var(--font-size-small);
            }

            .invoice-item:nth-of-type(1) .invoice-text-row p {
                padding-right: 32px;
            }

            /* WIP */
            /*.invoice-item .invoice-text-row:first-child, .invoice-item .invoice-text-row:last-child {*/
                /*height: 24px;*/
            /*}*/

            .invoice-item .colour-code:not(:first-child) {
                margin-left: 4px;
            }

            .invoice-item p {
                @apply --paper-font-body1;
                margin: 0;
                -webkit-user-select: none; /* Chrome/Safari */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* IE10+ */

                /* Rules below not implemented in browsers yet */
                -o-user-select: none;
                user-select: none;
            }

            .invoice-item--big {
                min-height: 96px;
                /*@apply --padding-16;*/
                /*border-bottom: 1px solid var(--app-background-color-dark);*/
            }

            .invoice-item--small {
                min-height: 32px;
                /*@apply --padding-right-left-16;*/
                padding-bottom: 8px;
            }

            .invoice-item--small .invoice-text-row:nth-child(2) {
                justify-content: space-between;
            }

            .invoice-item--small .invoice-text-row:last-child {
                display: none;
            }

            .invoice-item--small .he-dots-container {
                display: none;
            }

            .he-dots-container {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
            }

            paper-item {
                background: transparent;
                outline: 0;
                --paper-item-selected: {

                };

                --paper-item-disabled-color: {
                    color: red;
                };

                --paper-item-focused: {
                    background: transparent;
                };
                --paper-item-focused-before: {
                    background: transparent;
                };

            }

            .opened {
                color: var(--app-text-color);
                background: var(--app-text-color-light);
                border-radius: 2px 2px 0 0;
                box-shadow: 0 4px 0 0 white,
                0 -2px 0 0 white,
                0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);

            }

            paper-item.iron-selected > .invoice-text > .invoice-text-date {
                color: var(--app-text-color-light) !important;
            }

            .invoice-text {
                background: transparent;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-start;
                width: 100%;
                height: 100%;
                padding: 0;
                background: var(--app-background-color);
            }

            .invoice-text:focus::before, .invoice-text:focus::after {
                background: transparent;
            }

            .invoice-text-row p {
                width: 100%;
                text-overflow: ellipsis;
                overflow-x: hidden;
                white-space: nowrap;
                padding: 0 8px;
            }

            .invoice-text-date {
                justify-content: space-between !important;
                position: relative;
                top: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, .1);
                @apply --padding-right-left-16;
                color: var(--app-text-color-disabled);
                height: 24px;
            }

            .invoice--big {
                min-height: 96px;
                /*@apply --padding-16;*/
                /*border-bottom: 1px solid var(--app-background-color-dark);*/
            }

            .invoice--small {
                min-height: 32px;
                /*@apply --padding-right-left-16;*/
                padding-bottom: 8px;
            }

            .invoice--small .invoice-text-row:nth-child(2) {
                justify-content: space-between;
            }

            .invoice--small .invoice-text-row:last-child {
                display: none;
            }

            .invoice--small .he-dots-container {
                display: none;
            }

            .he-dots-container {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-end;
            }

            paper-listbox {
                outline: 0;
                --paper-listbox-selected-item: {
                    color: var(--app-text-color-light);
                    background: var(--app-primary-color);
                };
                --paper-listbox-disabled-color: {
                    color: red;
                };

                background: transparent;
                padding: 0;
            }

            #_invoice_listbox {
                padding: 0;
            }

            .layout.vertical {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                flex-wrap: nowrap;
                height: auto;
                max-height: none !important;
            }

            .verifiedNmcl {
                color: var(--app-status-color-ok);
            }

            .unverifiedNmcl {
                color: var(--app-status-color-nok);
            }


            vaadin-grid.material {

                font-family: Roboto, sans-serif;
                --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

                --vaadin-grid-cell: {
                    padding: 8px;
                };

                --vaadin-grid-header-cell: {
                    height: 64px;
                    color: rgba(0, 0, 0, var(--dark-secondary-opacity));
                    font-size: 12px;
                };

                --vaadin-grid-body-cell: {
                    height: 48px;
                    color: rgba(0, 0, 0, var(--dark-primary-opacity));
                    font-size: 13px;
                };

                --vaadin-grid-body-row-hover-cell: {
                    background-color: var(--paper-grey-200);
                };

                --vaadin-grid-body-row-selected-cell: {
                    background-color: var(--paper-grey-100);
                };

                --vaadin-grid-focused-cell: {
                    box-shadow: none;
                    font-weight: bold;
                };
            }

            vaadin-grid.material .cell {
                overflow: hidden;
                padding-left: 4px;
                text-overflow: ellipsis;
            }

            vaadin-grid.material .cell.last {
                padding-right: 24px;
            }

            vaadin-grid.material .cell.numeric {
                text-align: right;
            }

            vaadin-grid.material paper-checkbox {
                --primary-color: var(--paper-indigo-500);
                margin: 0 24px;
            }

            vaadin-grid.material vaadin-grid-sorter .cell {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            vaadin-grid.material vaadin-grid-sorter iron-icon {
                transform: scale(0.8);
            }

            vaadin-grid.material vaadin-grid-sorter:not([direction]) iron-icon {
                color: rgba(0, 0, 0, var(--dark-disabled-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction] {
                color: rgba(0, 0, 0, var(--dark-primary-opacity));
            }

            vaadin-grid.material vaadin-grid-sorter[direction=desc] iron-icon {
                transform: scale(0.8) rotate(180deg);
            }

            .clearBtn {
                height: 16px;
                width: 16px
                cursor: pointer;
            }

            .nmclFavoriteCode {
                background-color: var(--app-secondary-color-dark);
                margin: 0 5px 0 0;
                color: var(--app-text-color-light);
                height: 20px;
                font-size: 12px;
                min-width: initial;
                text-transform: none;
                padding-left: 8px;
            }

            .tarificationError {
                padding: 5px;
                width: auto;
                height: 20px;
                color: var(--app-error-color);
            }

            .tarificationBtnEnableWithWarning {
                background-color: var(--app-status-color-pending);
            }

            .infoDmg {
                height: 18px;
                width: 18px;
            }

            .invoiceDateInfo{
                font-size: 12px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                border-top: 1px solid var(--app-background-color-darker);
            }

            .invoiceDateInfo .item {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: flex-start;
                padding: 2px 4px;
                margin: 0;
                flex-grow: 1;
                min-height: 0;
                min-width: 0;
                font-size: var(--font-size-small);
                border-radius: 0;
                border-right: 1px solid var(--app-background-color-darker);
            }

            .invoiceDateInfo .item:last-child {
                border-right:none;
            }

            .invoiceDateInfo .item span {
                margin-left: 2px;
                display: block;
                line-height: var(--font-size-small);
                align-self: center;
            }

            .invoiceDateInfoIcon{
                min-height: 14px;
                min-width: 14px;
                max-height: 14px;
                max-width: 14px;
                padding: 2px;
                box-sizing: border-box;
                border-radius: 50%;
                flex-shrink: 0;
            }

            #relativeCodeDialog{
                height: 176px;
                width: 220px;
            }

            #eidDialog{
                height: 220px;
                width: 500px;
            }

            #containerEidDialog{
                width: auto;
                display: flex;
                padding-top: 20px;
            }

            .eidContainerBtn{
                flex: auto;
                text-align: center;
                position: relative;
            }

            .eidBtn{
                height: 60px;
                width: 60px;
            }

            .eidReadingBtnContainer{
                right: 0px;
                float: right;
            }

            #manualEncodingDialog{
                height: 242px;
                width: 500px;
            }

            #manualEncodingDialog .content{
                padding: 12px;
            }

            .manualEncodingContainer{
                display: flex;
            }

            .manualEncodingContainerChild{
                flex: auto;
            }

            paper-button[disabled] {
                background-color: var(--app-secondary-color-dark);
                color: var(--app-text-color-disabled);
                box-shadow: none;
            }


            .he-edit-btn-container{
                background: var(--app-text-color);
                border-radius: 14px;
                display: inline-flex;
                flex-flow: row-reverse wrap;
                justify-content: space-between;
                align-items: center;
                padding: 2px;
                width: 24px;
                height: 24px;
                overflow: hidden;
                transition: width .42s cubic-bezier(0.075, 0.82, 0.165, 1), opacity .33s ease;
                cursor: pointer;
                opacity: 0;
            }
            paper-item:hover .he-edit-btn-container,
            paper-item.iron-selected .he-edit-btn-container {
                opacity: 1;
            }

            .he-edit-btn-container.open{
                width: 90px;
                display:inline-flex;
                flex-flow: row-reverse nowrap;
            }

            paper-item:hover .he-edit-btn-container {
                display:inline-flex;
            }

            paper-item.iron-selected .he-edit-btn-container {
                display:inline-flex;
            }

            .he-edit-btn{
                height: 24px;
                width: 24px;
                padding: 4px;
                color: var(--app-text-color-light);
                margin-right: 2px;
                margin-left: 2px;
                --paper-ink-color:var(--app-text-color-light);
            }

            .he-edit-btn-dark{
                color: var(--app-text-color);
                --paper-ink-color:var(--app-text-color);
            }

            #barCode{
                visibility: hidden;
            }

            paper-item:hover .he-edit-btn-container {
                display:inline-flex;
            }

            paper-item.iron-selected .he-edit-btn-container {
                display:inline-flex;
            }

            .he-edit-btn-container{
                background: var(--app-text-color);
                border-radius: 14px;
                display: none;
                flex-flow: row-reverse wrap;
                justify-content: space-between;
                align-items: center;
                padding: 2px;
                width: 24px;
                height: 24px;
                overflow: hidden;
                transition: width .42s cubic-bezier(0.075, 0.82, 0.165, 1);
                cursor: pointer;
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
            }

            .he-edit-btn-container.open{
                width: 90px;
                /*display:inline-flex;*/
                flex-flow: row-reverse nowrap;
                position: absolute;
                right: 5px;
            }

            paper-item:hover .he-edit-btn-container {
                display:inline-flex;
            }

            paper-item.iron-selected .he-edit-btn-container {
                display:inline-flex;
            }

            .he-edit-btn-container{
                background: var(--app-text-color);
                border-radius: 14px;
                display: none;
                flex-flow: row-reverse wrap;
                justify-content: space-between;
                align-items: center;
                padding: 2px;
                width: 24px;
                height: 24px;
                overflow: hidden;
                transition: width .42s cubic-bezier(0.075, 0.82, 0.165, 1);
                cursor: pointer;
            }

            .he-edit-btn-container.open{
                width: 90px;
                display:inline-flex;
                flex-flow: row-reverse nowrap;
            }


            .he-edit-btn{
                height: 24px;
                width: 24px;
                padding: 4px;
                color: var(--app-text-color-light);
                margin-right: 2px;
                margin-left: 2px;
                --paper-ink-color:var(--app-text-color-light);
            }

            .he-edit-btn-dark{
                color: var(--app-text-color);
                --paper-ink-color:var(--app-text-color);
            }

            .he-edit-btn-container > paper-icon-button.he-edit-btn:first-child {
                transition: .5s ease;
            }
            .he-edit-btn-container.open > paper-icon-button.he-edit-btn:first-child {
                transform: rotate(180deg)
            }
            ht-spinner.validAndTarif {
                position: absolute;
                top: 10px;
                transform: translateX(-10px);
                height: 42px;
                width: 42px;
            }

            .button-red {
                background-color:#ff0000!important;
                color:#ffffff!important;
            }

            .textAlignCenter {
                text-align: center;
            }

            .locations-spinner {
                transform: translate(0,40px);
            }


            .reasonCancel {
                display : flex;
            }

            #cancelDialog{
                height: 200px;
                width: 1000px;
            }

            .inputs-line {
                display: flex;
                flex-direction: row;
            }

            .paid {
                min-width: 100px;
            }

            #paymentCheckDialog {
                height: 300px;
                width: 500px;
            }

            #noDerogation {
                height: 200px;
                width: 500px;
            }

            #savedIndicator{
                position: fixed;
                top:50%;
                right: 0;
                z-index:1200;
                color: white;
                font-size: 13px;
                background:rgba(0,0,0,0.42);
                height: 24px;
                padding: 0 8px 0 12px;
                border-radius: 3px 0 0 3px;
                width: 0;
                opacity: 0;
            }
            #savedIndicator.saved{
                animation: savedAnim 2.5s ease-in;
            }

            .left-paddle {
                left: 0;
            }
            .right-paddle {
                right: 0;
            }

            @keyframes savedAnim {
                0%{
                    width: 0;
                    opacity: 0;
                }
                20%{
                    width: 114px;
                    opacity: 1;
                }
                25%{
                    width: 96px;
                    opacity: 1;
                }
                75%{
                    width: 96px;
                    opacity: 1;
                }
                100%{
                    width: 0;
                    opacity: 0;
                }
            }

            .transfertNmcl{
                height: 120px;
            }

            @media screen and (max-width: 1344px) {
                .invoice-item .invoice-text-row {
                    text-align: center;
                    justify-content: space-around;
                }
                .invoiceDateInfo {
                    flex-direction: column;
                }
            }

            @media screen and (max-width: 936px) {
                paper-dialog#invoiceDialog {
                    max-width: none !important;
                    max-height: none !important;
                    height: calc(100vh - 84px);
                    width: 100%;
                    margin: 0;
                }
            }

            @media screen and (max-width: 752px) {
                .invoice-header .mobile-col {
                    display: flex;
                }
                .mobile-col {
                    padding: 12px 0;
                }
                .mobile-col .flex-container {
                    flex-direction: column;
                    height: 280px;
                    width: 50%;
                    overflow-y: scroll;
                }
            }

            @media screen and (max-width: 632px) {
                .invoice-item .invoice-text-row {
                    text-align: left;
                    justify-content: initial;
                }
                .invoiceDateInfo {
                    flex-direction: initial;
                }

                paper-dialog#invoiceDialog {
                    display: flex;
                    flex-direction: column;
                }
                .invoice-panel {
                    height: 152px;
                    box-shadow: none;
                }
                .detail-panel {
                    box-shadow: 0 -8px 32px 0 rgba(0,0,0,.2);
                    z-index: 10;
                }
                #barCode {
                    display: none;
                }
                .buttons {
                    position: initial;
                    display: flex;
                    height: 80px;
                    background: var(--app-background-color);
                    z-index: 10;
                    bottom: 0;
                    right: 0;
                    box-sizing: border-box;
                }
            }

            @media screen and (max-width:576px) {
                .invoice-nomenclature-code-option {
                    flex-direction: column;
                }
            }

            .p5{
                padding: 5px;
            }

            #errorMessagePayment{
                color: var(--app-error-color);
                padding : 5px;
            }

            .statusInfoIcon{
                height: 8px;
                width: 8px;
            }

            .canceled{
                color: var(--app-status-color-nok);
            }

            .pending{
                color: var(--app-status-color-pending);
            }

            .ongoing{
                color: var(--paper-blue-400);
            }

            .accepted{
                color: var(--app-status-color-ok);
            }

        </style>

        <ht-inami-validator api="[[api]]" validator-name="ht-inami-validator"></ht-inami-validator>
        <paper-item id="savedIndicator">[[localize('sav','SAVED',language)]]
            <iron-icon icon="icons:check"></iron-icon>
        </paper-item>

        <paper-dialog id="invoiceDialog" opened="{{opened}}">
            <div class="invoice-panel">
                <paper-listbox id="_invoice_listbox" focused selectable="paper-item" selected="{{selectedInvoiceIndex}}">
                    <template is="dom-repeat" items="[[invoices]]">
                       <paper-item class="layout vertical invoice-item invoice--big invoice-text" id="[[item.id]]">
                            <paper-item class="invoice-text">
                                <div class="invoice-text-row invoice-text-date">
                                    <label>N° [[item.invoiceReference]]</label>
                                    <label>[[_formatInvoiceDate(item.invoiceDate)]]</label>
                                </div>
                                <div class="invoice-text-row grey">
                                    <h4>[[getInvoiceType(item.invoiceType)]] [[getSentMediumType(item.sentMediumType)]] [[item.creators]]</h4>
                                    <p>
                                        <template is="dom-repeat" items="[[item.invoicingCodes]]">
                                            [[item.code]]
                                        </template>
                                    </p>
                                    <div class="invoiceDateInfo">
                                        <template is="dom-if" if="[[!_isInvoiceEattest(item,item.*)]]">
                                            <template is="dom-if" if="[[_ifStatusDateExist(item.printedDate,item.*)]]">
                                                <paper-button class="item" data-item$="[[item.id]]">                                                     
                                                    <iron-icon icon="icons:print"  class="invoiceDateInfoIcon" style="background-color:var(--app-status-color-ok);"></iron-icon>
                                                    <span>[[_formatInvoiceDate(item.printedDate)]]</span>
                                                </paper-button>                                            
                                            </template>
                                        </template>
                                        <template is="dom-if" if="[[_isInvoiceEattest(item,item.*)]]">
                                            <template is="dom-if" if="[[_ifStatusDateExist(item.printedDate,item.*)]]">
                                                <paper-button class="item" data-item$="[[item.id]]" on-tap="_cancelPrintedDate" >
                                                    <iron-icon icon="icons:print"  class="invoiceDateInfoIcon" style="background-color:var(--app-status-color-ok);"></iron-icon>
                                                    <span>[[_formatInvoiceDate(item.printedDate)]]</span>
                                                 </paper-button>
                                            </template>
                                            <template is="dom-if" if="[[_ifClosedButNotPrinted(item,item.*)]]">
                                                <paper-button class="item" on-tap="_generatePrintedDate" data-item$="[[item.id]]">
                                                     <iron-icon icon="icons:print" class="invoiceDateInfoIcon" style="background-color:var(--app-status-color-nok);"></iron-icon>                                                     
                                                     <span>N/A</span>                                                 
                                                </paper-button>
                                            </template>
                                            <template is="dom-if" if="[[_ifStatusDateExist(item.sentDate)]]">
                                                <paper-button class="item">
                                                     <iron-icon icon="icons:send" class="invoiceDateInfoIcon"></iron-icon>
                                                     <span>[[_formatInvoiceDate(item.sentDate)]]</span>
                                                </paper-button>
                                            </template>
                                            <template is="dom-if" if="[[_isInvoiceEfact(item,item.*)]]">
                                                <paper-button class="item">
                                                    <iron-icon icon="vaadin:circle" class$="statusInfoIcon [[_getColorOfStatus(item, item.*)]]"></iron-icon>
                                                    <span>[[_getStatusTxt(item, item.*)]]</span>
                                                </paper-button>
                                            </template>
                                            <template is="dom-if" if="[[_ifStatusDateExist(item.cancelDate)]]">
                                                <paper-button class="item">
                                                    <iron-icon icon="icons:cancel" class="invoiceDateInfoIcon"></iron-icon>
                                                    <span>[[_formatInvoiceDate(item.cancelDate)]]</span>
                                                </paper-button>
                                            </template>
                                        </template>
                                      </div>
                                    </div>
                                    <div class="invoiceDateInfo">
                                        <paper-button class="item">
                                             <iron-icon icon="vaadin:coin-piles" class="invoiceDateInfoIcon"></iron-icon>
                                             <span>[[_getPaymentType(item.paymentType)]]: [[_formatPatientPaid(item.paid)]]€</span>
                                        </paper-button>
                                        <template is="dom-if" if="[[_toBeCorrected(item)]]">
                                            <paper-button class="item">
                                                <iron-icon icon="vaadin:pencil" class="invoiceDateInfoIcon"></iron-icon>
                                                <span>[[_getCorrectiveInvoiceNumber(item.correctiveInvoiceId)]] (<iron-icon icon="icons:send" class="invoiceDateInfoIcon"></iron-icon> [[_getCorrectiveInvoiceDate(item.correctiveInvoiceId)]])</span>
                                            </paper-button>
                                        </template>
                                    </div>
                                    <template is="dom-if" if="[[_ifEattestSaved(item,item.printedDate)]]">
                                        <div class="he-edit-btn-container">
                                            <paper-icon-button id="he-edit-btn-open_[[item.id]]" class="he-edit-btn" icon="vaadin:chevron-left" on-tap="_toggleEditHE"></paper-icon-button>
                                            <paper-icon-button id="he-edit-btn-xml_[[item.id]]-khmer" class="he-edit-btn" icon="vaadin:file-code" on-tap="downloadKmehr" data-item$="[[item.id]]"></paper-icon-button>
                                            <paper-icon-button id="he-edit-btn-xml_[[item.id]]-xades" class="he-edit-btn" icon="vaadin:flag-o" on-tap="downloadXades" data-item$="[[item.id]]"></paper-icon-button>
                                            <paper-icon-button id="he-edit-btn-duplicate_[[item.id]]" class="he-edit-btn" icon="vaadin:copy" on-tap="duplicate" data-item$="[[item.id]]"></paper-icon-button>
                                        </div>
                                        <paper-tooltip position="bottom" for="he-edit-btn-open_[[item.id]]">[[localize('ext','Extend',language)]]</paper-tooltip>
                                        <paper-tooltip position="bottom" for="he-edit-btn-xml_[[item.id]]-khmer">[[localize('gen_kmehr','Download Kmehr',language)]]</paper-tooltip>
                                        <paper-tooltip position="bottom" for="he-edit-btn-xml_[[item.id]]-xades">[[localize('gen_xades','Download Xades',language)]]</paper-tooltip>
                                        <paper-tooltip position="bottom" for="he-edit-btn-duplicate_[[item.id]]">[[localize('gen_duplicate','Generate duplicata',language)]]</paper-tooltip>
                                    </template>                                  
                            </paper-item>
                        </paper-material>
                    </template>
                </paper-listbox>
            </div>
            <div class="detail-panel">
                <div class="invoice-header">
                    <div class="title">
                        <div class="title-txt">
                            [[localize('header','Header',language)]]
                            <template is="dom-if" if="[[isEattestClosed]]">
                                - [[localize('num_accuse_reception','Numéro d\'accusé de reception',language)]] [[selectedInvoice.thirdPartyReference]]
                            </template>
                            <div class="eidReadingBtnContainer">
                                <iron-icon icon="vaadin:user-card" on-tap="_openEidDialog" style="height: 18px;"></iron-icon>
                            </div>
                        </div>
                    </div>
                    <div class="mobile-col">
                    <div class="flex-container">
                        <vaadin-combo-box id="invoice-type" filtered-items="[[invoiceType]]" item-label-path="label.[[language]]" item-value-path="id" on-filter-changed="" label="[[localize('inv_type_2','Invoice type',language)]]" value="{{selectedInvoice.invoiceType}}" on-value-changed="" readonly="[[_isInvoiceClosedOrSelectedInvoiceEattest(selectedInvoice.*)]]"></vaadin-combo-box>
                        <vaadin-combo-box id="invoice-mode" filtered-items="[[sentMediumType]]" item-label-path="label.[[language]]" item-value-path="id" on-filter-changed="" label="[[localize('inv_smt','Sent Medium Type',language)]]" value="{{selectedInvoice.sentMediumType}}" on-value-changed="analyzeMediumType" readonly="[[isInvoiceClosed]]"></vaadin-combo-box>
                        <vaadin-text-field id="invoice-number" label="[[localize('inv_num','Invoice number',language)]]" value="{{selectedInvoice.invoiceReference}}" readonly="" theme="always-float-label"></vaadin-text-field>

                        <vaadin-date-picker id="invoice-date" label="[[localize('inv_date','Invoice date',language)]]" value="{{invoiceDateAsString}}" i18n="[[i18n]]" readonly="[[_isInvoiceClosedOrSelectedInvoiceEattest(selectedInvoice, selectedInvoice.sentMediumType)]]"></vaadin-date-picker>

                        <template is="dom-if" if="[[!_isSelectedInvoiceEattest(selectedInvoice.*)]]"><vaadin-combo-box id="invoice-period" filtered-items="[[invoicePeriod]]" item-label-path="label.[[language]]" item-value-path="id" on-filter-changed="" label="[[localize('inv_per','Invoice period',language)]]" value="{{selectedInvoice.invoicePeriod}}" readonly="[[isInvoiceClosed]]"></vaadin-combo-box></template>
                    </div>

                    <div class="flex-container">
                        <template is="dom-if" if="[[!_isSelectedInvoiceEattest(selectedInvoice.*)]]">
                            <div id="invoice-creditNote">
                                <template is="dom-if" if="[[!isInvoiceClosed]]">
                                    <vaadin-checkbox on-checked-changed="_isCreditNote" checked="[[selectedInvoice.creditNote]]"></vaadin-checkbox>
                                    [[localize('inv_cr_no','Credit note',language)]]<br>

                                    <vaadin-checkbox on-checked-changed="_isLiftingLimitationPeriod" checked="[[_handleCheckboxCheckedStatusFromInteger(selectedInvoice.longDelayJustification)]]"></vaadin-checkbox>
                                    [[localize('inv_llp','Lifting limitation period',language)]]
                                </template>

                                <template is="dom-if" if="[[isInvoiceClosed]]">
                                    <vaadin-checkbox on-checked-changed="_isCreditNote" checked="[[selectedInvoice.creditNote]]">[[localize('inv_cr_no','Credit note',language)]]<br></vaadin-checkbox>
                                    <vaadin-checkbox on-checked-changed="_isLiftingLimitationPeriod" checked="[[_handleCheckboxCheckedStatusFromInteger(selectedInvoice.longDelayJustification)]]">[[localize('inv_llp','Lifting limitation period',language)]]</vaadin-checkbox>
                                </template>
                            </div>
                        </template>

                        <vaadin-combo-box id="invoice-careProviderType" filtered-items="[[careProviderType]]" item-label-path="label.[[language]]" item-value-path="id" on-value-changed="analyzeCareProviderType" label="[[localize('inv_care_prov_ty','Care provider type',language)]]" value="{{selectedInvoice.careProviderType}}" readonly="[[isInvoiceClosed]]"></vaadin-combo-box>

                        <template is="dom-if" if="[[_isTrainee(selectedInvoice.careProviderType)]]">
                            <vaadin-text-field id="invoice-nihiiTrainee" label="[[getLabel(selectedInvoice.careProviderType)]]" value="{{selectedInvoice.internshipNihii}}" readonly="[[isInvoiceClosed]]" validator="ht-inami-validator" theme="always-float-label" auto-validate=""></vaadin-text-field>
                        </template>

                        <template is="dom-if" if="[[!_isSelectedInvoiceEattest(selectedInvoice.*)]]">
                            <vaadin-combo-box id="invoice-thirdPartyJustification" filtered-items="[[_filterThirdPartyJustitifications(thirdPartyJustification)]]" item-label-path="label.[[language]]" item-value-path="id" on-filter-changed="" label="[[localize('inv_tpj','Third party justification',language)]]" value="{{selectedInvoice.thirdPartyPaymentJustification}}" on-value-changed="" readonly="[[isInvoiceClosed]]"></vaadin-combo-box>
                        </template>

                        <template is="dom-if" if="[[_isSelectedInvoiceEattest(selectedInvoice.*)]]">
                            <vaadin-combo-box id="locationType" class="flex-container-nmcl-row" label="[[localize('location','Location',language)]]" filtered-items="[[locationType]]" item-label-path="label.[[language]]" item-value-path="id" value="{{selectedInvoice.encounterLocationNorm}}" readonly="[[isInvoiceClosed]]">
                            </vaadin-combo-box>
                            <template is="dom-if" if="[[isLocationIsNeeded]]">
                                <vaadin-combo-box id="locations" class="flex-container-nmcl-row" label="[[localize('location','Locations',language)]]" filtered-items="[[organisationList]]" item-label-path="name" selected-item="[[selectedInvoice.encounterLocationName]]" on-selected-item-changed="setLocation" on-filter-changed="searchLocations" readonly="[[isInvoiceClosed]]"></vaadin-combo-box>
                                <vaadin-text-field id="invoice-nihii-location" label="[[localize('nihiiLocation','Inami du Lieu',language)]]" value="{{selectedInvoice.encounterLocationNihii}}" readonly="[[isInvoiceClosed]]" validator="ht-inami-validator" theme="always-float-label" auto-validate=""></vaadin-text-field>
                            </template>
                            <template is="dom-if" if="[[isLoadingLocations]]">
                                <ht-spinner class="locations-spinner" active="[[isLoadingLocations]]"></ht-spinner>
                            </template>
                        </template>


                            <vaadin-text-field id="invoice-dmg" label="[[localize('inv_dmgOwner','Dmg owner',language)]]" value="{{selectedInvoice.gnotionNihii}}" readonly="[[isInvoiceClosed]]" theme="always-float-label=" validator="ht-inami-validator" auto-validate="">
                                <div slot="suffix">
                                    <iron-icon icon="info" id="invoice-dmg-icon" class="infoDmg"></iron-icon>
                                </div>
                            </vaadin-text-field>
                            <paper-tooltip for="invoice-dmg-icon">[[localize('gnotion','Gnotion',language)]]</paper-tooltip>
                    </div>
                    </div>

                </div>
                <div class="invoice-nomenclature-code">
                    <div class="invoice-nomenclature-code-container">
                        <div class="nmcl-descr">
                            <div class="title">
                                <div class="title-txt">
                                    [[localize('nmcl','Nomenclature',language)]]
                                </div>
                            </div>
                            <div class="nmcl-list">
                                <!--<ht-spinner class="spinner chapter-list-spinner" alt="Loading eTar" active=[[isLoadingEattest]]></ht-spinner>-->
                                <vaadin-grid id="nmclGrid" items="[[selectedInvoice.invoicingCodes]]" class="material" active-item="{{activeNmclItem}}" on-tap="_showDetail">
                                    <vaadin-grid-column width="80px">
                                        <template class="header">
                                            <div class="cell frozen">[[localize('co','Code',language)]]</div>
                                        </template>
                                        <template>
                                            <div class="cell frozen">[[item.code]]</div>
                                        </template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column width="50%">
                                        <template class="header">
                                            <div class="cell frozen">[[localize('lab','Label',language)]]</div>
                                        </template>
                                        <template>
                                            <div class="cell frozen">[[item.label]]</div>
                                        </template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column width="80px">
                                        <template class="header">
                                            <div class="cell numeric">[[localize('tot_pat','Patient fees',language)]]
                                            </div>
                                        </template>
                                        <template>
                                            <template is="dom-if" if="[[!item.contract]]"><div class="cell numeric unverifiedNmcl" title="[[localize('unverified_etarif','This nomenclature code has not (yet) been verified by eFact',language)]]">[[_formatAmount(item.patientIntervention)]]&nbsp;€ <em class="unverifiedNmcl f-s-12em cursorPointer">*</em></div></template>
                                            <template is="dom-if" if="[[item.contract]]"><div class="cell numeric verifiedNmcl" title="[[localize('verified_etarif','This nomenclature code has been verified by eFact',language)]]">[[_formatAmount(item.patientIntervention)]]&nbsp;€ <em class="verifiedNmcl f-s-12em cursorPointer">*</em></div></template>
                                        </template>
                                        <template class="footer"> <div class="cell numeric">[[totalInvoice.patientIntervention]]&nbsp;€</div></template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column width="80px">
                                        <template class="header">
                                            <div class="cell numeric">[[localize('reimb','Reimbursement',language)]]</div>
                                        </template>
                                        <template>
                                            <template is="dom-if" if="[[!item.contract]]"><div class="cell numeric unverifiedNmcl" title="[[localize('unverified_etarif','This nomenclature code has not (yet) been verified by eFact',language)]]">[[_formatAmount(item.reimbursement)]]&nbsp;€ <em class="unverifiedNmcl f-s-12em cursorPointer">*</em></div></template>
                                            <template is="dom-if" if="[[item.contract]]"><div class="cell numeric verifiedNmcl" title="[[localize('verified_etarif','This nomenclature code has been verified by eFact',language)]]">[[_formatAmount(item.reimbursement)]]&nbsp;€<em class="verifiedNmcl f-s-12em cursorPointer">*</em></div></template>
                                        </template>
                                        <template class="footer"> <div class="cell numeric">[[totalInvoice.reimbursement]]&nbsp;€</div></template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column width="80px">
                                        <template class="header">
                                            <div class="cell numeric">[[localize('extra','Extra',language)]]</div>
                                        </template>
                                        <template>
                                            <div class="cell numeric">[[_formatAmount(item.doctorSupplement)]]&nbsp;€</div>
                                        </template>
                                        <template class="footer"> <div class="cell numeric">[[totalInvoice.doctorSupplement]]&nbsp;€</div></template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column width="88px">
                                        <template class="header">
                                            <div class="cell numeric">[[localize('tot','Fees',language)]]</div>
                                        </template>
                                        <template>
                                            <div class="cell numeric">[[_formatAmount(item.totalAmount)]]&nbsp;€</div>
                                        </template>
                                        <template class="footer"> <div class="cell numeric">[[totalInvoice.totalAmount]]&nbsp;€</div></template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column width="24px" class="textAlignCenter">
                                        <template class="header">
                                            <div class="cell numeric"></div>
                                        </template>
                                        <template>
                                            <template is="dom-if" if="[[item.prescriberNeeded]]">
                                                <iron-icon class="clearBtn" icon="vaadin:doctor"></iron-icon>
                                            </template>
                                            <template is="dom-if" if="[[item.isRelativePrestation]]">
                                                <!--<related-code-link language="[[language]]" linkables="[[selectedInvoice.invoicingCodes]]" represented-object-id="[[item.id]]" api="[[api]]" on-link-nmcl-to-related-code="linkNmclToRelatedCode"></related-code-link>-->
                                                <template is="dom-if" if="[[!isInvoiceClosed]]">
                                                    <iron-icon class="clearBtn" icon="vaadin:link" id="[[item.id]]" on-tap="_openlinkRelativePrestationDialog"></iron-icon>
                                                </template>
                                                [[item.relatedCode]]
                                            </template>

                                        </template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column width="24px">
                                        <template>
                                            <div class="cell frozen">
                                                <template is="dom-if" if="[[!isInvoiceClosed]]">
                                                    <iron-icon icon="vaadin:exchange" class="clearBtn" on-tap="_openTransfertDialog"></iron-icon>
                                                </template>
                                            </div>
                                        </template>
                                    </vaadin-grid-column>
                                    <vaadin-grid-column width="24px">
                                        <template>
                                            <div class="cell frozen">
                                                <template is="dom-if" if="[[!isInvoiceClosed]]">
                                                    <iron-icon icon="clear" class="clearBtn" data-item\$="[[item.tarificationId]]" on-tap="_deleteNmclCode"></iron-icon>
                                                </template>
                                            </div>
                                        </template>
                                    </vaadin-grid-column>
                                </vaadin-grid>
                            </div>
                            <template is="dom-if" if="[[!isInvoiceClosed]]">
                                <div class="nmcl-favorite">
                                    <span>[[localize('fav','Favorites code',language)]]:</span>
                                    <!--<div class="paddles">-->
                                    <!--</div>-->
                                    <div class="favcodes-flex" on-track="dragHoriz">
                                        <iron-icon icon="chevron-left" id="paddle-left" class="left-paddle paddle" on-tap="_favcodesScroll" direction="left">
                                        </iron-icon>
                                        <div id="favcodesScroller" class="favcodes-box">
                                            <template is="dom-repeat" items="[[favoriteCode]]">
                                                <paper-button style\$="transform:translateX([[favcodesScrollX]]px)" on-tap="_addNmcl" data-item\$="[[item]]" class="nmclFavoriteCode">
                                                    [[item.code]]
                                                    <iron-icon icon="clear" class="clearBtn" data-item\$="[[item.id]]" on-tap="_deleteFavoriteCode"></iron-icon>
                                                </paper-button>
                                            </template>
                                        </div>
                                        <iron-icon icon="chevron-right" id="paddle-right" class="right-paddle paddle" on-tap="_favcodesScroll" direction="right">
                                        </iron-icon>
                                    </div>
                                </div>
                                <div class="invoice-nomenclature-code-option">
                                    <vaadin-combo-box id="nmcl-search" filtered-items="[[nmclListItem]]" item-label-path="descr" item-value-path="id" on-filter-changed="_nmclSearch" on-keydown="isEnterPressed" label="[[localize('nmcl','Nomenclature',language)]]" value="{{nmcl-value}}" autofocus="" always-float-label="true"></vaadin-combo-box>
                                    <vaadin-combo-box id="code-type" filtered-items="[[sentMediumType]]" item-label-path="label.[[language]]" item-value-path="id" on-filter-changed="" label="[[localize('code_type','Code type',language)]]" value="{{selectedMediumCodeType}}" always-float-label="true"></vaadin-combo-box>
                                    <paper-icon-button id="add-nmcl" icon="icons:add-circle-outline" on-tap="_addNmcl"></paper-icon-button>
                                    <paper-tooltip position="left" for="add-nmcl">[[localize('add_nmcl','Add nomenclature',language)]]</paper-tooltip>
                                    <paper-icon-button id="add-fav" icon="icons:star" on-tap="_addFavoriteCode"></paper-icon-button>
                                    <paper-tooltip position="left" for="add-fav">[[localize('add_to_fav','Add to favorites',language)]]</paper-tooltip>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="invoice-detail">
                    <div class="title">
                        <div class="title-txt">
                            [[localize('det','Detail',language)]]
                        </div>
                    </div>
                    <template is="dom-if" if="[[isTarificationError]]">
                        <template is="dom-repeat" items="[[tarificationError]]">
                            <div class="tarificationError">[[item.code]]: [[_getErrorMsg(item, language)]]
                                ([[item.value]])
                            </div>
                        </template>
                    </template>
                    <template is="dom-if" if="[[isEattestError(isDetailNmcl.*,errorMessage.*)]]">
                        <div class="tarificationError">
                            [[errorMessage]]
                        </div>
                    </template>
                    <template is="dom-if" if="[[isDetailNmcl]]">
                        <div class="flex-container-nmcl">
                            <vaadin-text-field class="flex-container-nmcl-row" label="[[localize('co','Code',language)]]" value="{{activeNmclItem.code}}" theme="always-float-label" readonly=""></vaadin-text-field>
                            <vaadin-text-field class="flex-container-descr-nmcl-row" label="[[localize('lab','Label',language)]]" value="{{activeNmclItem.label}}" theme="always-float-label" readonly=""></vaadin-text-field>
                            <template is="dom-if" if="[[!_isSelectedInvoiceEattest(selectedInvoice.*)]]">
                                <vaadin-combo-box id="prescriberType" class="flex-container-nmcl-row" label="[[localize('derog','Derogation',language)]]" filtered-items="[[invoicingCodeDerogationType]]" item-label-path="label.[[language]]" item-value-path="id" value="{{activeNmclItem.derogationMaxNumber}}" readonly="[[isInvoiceClosed]]"></vaadin-combo-box>
                            </template>

                        </div>
                        <div class="flex-container-nmcl">
                            <vaadin-text-field prevent-invalid-input="" allowed-pattern="[.\\d]" class="flex-container-nmcl-row" label="[[localize('tot_pat','Patient fee',language)]]" value="{{activeNmclItem.patientIntervention}}" readonly="[[isInvoiceClosed]]" theme="always-float-label"></vaadin-text-field>
                            <vaadin-text-field prevent-invalid-input="" allowed-pattern="[.\\d]" class="flex-container-nmcl-row" label="[[localize('reimb','Reimbursement',language)]]" value="{{activeNmclItem.reimbursement}}" readonly="[[isInvoiceClosed]]" theme="always-float-label"></vaadin-text-field>
                            <vaadin-text-field prevent-invalid-input="" class="flex-container-nmcl-row" label="[[localize('extra','Extra',language)]]" value="{{activeNmclItem.doctorSupplement}}" readonly="[[isInvoiceClosed]]" theme="always-float-label"></vaadin-text-field>
                            <vaadin-text-field prevent-invalid-input="" class="flex-container-nmcl-row" label="[[localize('tot','Fee',language)]]" on-value-changed="_totalChanged" value="[[activeNmclItem.totalAmount]]" readonly="[[isInvoiceClosed]]" theme="always-float-label"></vaadin-text-field>
                        </div>

                        <template is="dom-if" if="[[isTravellingExpenses(activeNmclItem.*)]]">
                            <div class="flex-container-nmcl">
                                <vaadin-text-field class="flex-container-nmcl-row" label="[[localize('fraisDepAll','frais de déplacement - aller',language)]]" value="{{activeNmclItem.qteAll}}" readonly="[[isInvoiceClosed]]" theme="always-float-label"></vaadin-text-field>
                                <vaadin-text-field class="flex-container-nmcl-row" label="[[localize('fraisDepAllRet','frais de déplacement - aller &amp; retour',language)]]" value="[[quantityAllHasChanged(activeNmclItem.qteAll.*)]]" readonly="" theme="always-float-label"></vaadin-text-field>
                                <vaadin-text-field class="flex-container-nmcl-row" label="[[localize('fraisDepRemb','frais de déplacement - rembourser',language)]]" value="{{activeNmclItem.units}}" readonly="" theme="always-float-label"></vaadin-text-field>
                            </div>
                        </template>
                        <div class="flex-container-nmcl">
                            <vaadin-combo-box id="prescriberType" class="flex-container-nmcl-row" label="[[localize('prescriber','Prescriber',language)]]" filtered-items="[[prescriberType]]" item-label-path="label.[[language]]" item-value-path="id" value="{{activeNmclItem.prescriberNorm}}" on-value-changed="_checkIfPrescriberIsNeeded" readonly="[[isInvoiceClosed]]"></vaadin-combo-box>
                            <template is="dom-if" if="[[isPrescriberIsNeeded]]">
                                <vaadin-text-field class="flex-container-nmcl-row" label="[[localize('prescriber_nihii','Prescriber nihii',language)]]" value="{{activeNmclItem.prescriberNihii}}" readonly="[[isInvoiceClosed]]" validator="ht-inami-validator" theme="always-float-label" auto-validate=""></vaadin-text-field>
                                <template is="dom-if" if="[[_isSelectedInvoiceEattest(selectedInvoice.*)]]"><vaadin-date-picker id="prescription-date" label="[[localize('prescr_date','prescription date',language)]]" value="{{prescriptionDateAsString}}" i18n="[[i18n]]" readonly="[[isInvoiceClosed]]"></vaadin-date-picker></template>
                            </template>
                        </div>
                        <div class="flex-container-nmcl">
                            <vaadin-text-field class="flex-container-nmcl-row" label="[[localize('valid','Validation',language)]]" value="{{activeNmclItem.valid}}" readonly="" theme="always-float-label"></vaadin-text-field>
                            <vaadin-text-field class="flex-container-nmcl-row" label="[[localize('fin_con','Financial contract',language)]]" value="{{activeNmclItem.contract}}" readonly="" theme="always-float-label"></vaadin-text-field>
                            <vaadin-text-field class="flex-container-nmcl-row" label="[[localize('inv_tpj','Justification TP',language)]]" value="{{_getOvveride3PayerCodeAsString(activeNmclItem.override3rdPayerCode)}}" readonly="" theme="always-float-label"></vaadin-text-field>
                        </div>
                    </template>

                </div>

            </div>
                <canvas id="barCode"></canvas>
                <div class="buttons">
                    <ht-spinner class="validAndTarif" active="[[isLoadingValidation]]"></ht-spinner>
                    <ht-spinner class="validAndTarif" active="[[isLoadingJustif]]"></ht-spinner>
                    <paper-button class="button button--other" on-tap="_closeDialog">[[localize('clo','close',language)]]</paper-button>

                    <template is="dom-if" if="[[isEattestClosed]]">
                        <paper-button disabled="[[isLoadingEattest]]" class="button button--save" on-tap="_cancelDialogOpen">[[localize('can_eattest','Cancel eattest',language)]]</paper-button>
                    </template>

                    <template is="dom-if" if="[[!isInvoiceClosed]]">
                        <template is="dom-if" if="[[!_isSpecialist()]]">
                             <template is="dom-if" if="[[hasInsurability]]">
                                <paper-button class="button button--other" on-tap="_verifyTarification" disabled="[[_isETarButtonDisabled(selectedInvoice,isLoadingValidation,isTarificationMcnError,npi,selectedInvoice.sentMediumType)]]">[[localize('eTarif','Validation eTarif',language)]]</paper-button></template>
                            </template>
                            <template is="dom-if" if="[[!hasInsurability]]">
                                <paper-button class="button button--other" on-tap="" disabled="true">[[localize('patient_has_no_insurance','Ce patient n\\'est pas assuré',language)]]</paper-button>
                            </template>
                            <paper-button on-tap="_switchBetweenMethodForJustifAndCreation" class="button button--save" disabled="[[_isJustifButtonDisabled(selectedInvoice,isNmclVerified,isLoadingJustif,npi,selectedInvoice.sentMediumType)]]">[[localize('val_invoice','Justificatory + create invoice',language)]]</paper-button>
                    </template>

                    <template is="dom-if" if="[[isInvoiceClosed]]">
                        <paper-button on-tap="_switchBetweenMethodForJustif" class="button button--save" disabled="[[isLoadingJustif]]">[[localize('val_justificatory','Justificatory',language)]]</paper-button>
                    </template>
                </div>
        </paper-dialog>

        <paper-dialog id="transferDialog">
            <div class="content transfertNmcl">
                <vaadin-combo-box id="code-type" filtered-items="[[sentMediumType]]" item-label-path="label.[[language]]" item-value-path="id" label="[[localize('code_type','Code type',language)]]" value="{{bufferTypeCode}}"></vaadin-combo-box>
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="relativeCodeDialog">
            <vaadin-combo-box id="related-code" filtered-items="[[selectedInvoice.invoicingCodes]]" item-label-path="code" item-value-path="id" label="Link" value="{{childRelativeCodeId}}"></vaadin-combo-box>
        </paper-dialog>


        <paper-dialog id="eidDialog">
            <h2 class="modal-title">Type de lecture</h2>
            <div id="containerEidDialog" class="content">
                <div class="eidContainerBtn">
                    <paper-icon-button icon="vaadin:user-card" class="eidBtn" on-tap="_readEidCard"></paper-icon-button>
                    <p>EID</p>
                </div>
                <div class="eidContainerBtn">
                    <paper-icon-button icon="vaadin:qrcode" class="eidBtn" on-tap="_readBarreCode"></paper-icon-button>
                    <p>QR code &amp;&amp; code-barre</p>
                </div>
                <div class="eidContainerBtn">
                    <paper-icon-button icon="vaadin:pencil" class="eidBtn" on-tap="_showManualEncodingDialog"></paper-icon-button>
                    <p>Encodage manuel</p>
                </div>
            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="_closeEidDialog">[[localize('can','Cancel',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="manualEncodingDialog">
            <h2 class="modal-title">Encodage manuel</h2>
            <div class="content">
                <div class="manualEncodingContainer">
                    <vaadin-combo-box id="reasonOfManualEncoding" filtered-items="[[reasonOfManualEncoding]]" item-label-path="label.[[language]]" item-value-path="id" label="Raison" value="{{manualEncoding.reason}}" class="manualEncodingContainerChild"></vaadin-combo-box>
                </div>
                <div class="manualEncodingContainer">
                    <vaadin-combo-box id="code-type" filtered-items="[[typeOfSupport]]" item-label-path="label.[[language]]" item-value-path="id" label="Type de support" value="{{manualEncoding.supportType}}" class="manualEncodingContainerChild"></vaadin-combo-box>
                </div>
                <div class="manualEncodingContainer">
                    <vaadin-text-field class="flex-container-nmcl-row" label="N° de serie" value="{{manualEncoding.serialNumber}}" theme="always-float-label"></vaadin-text-field>
                </div>
                <template is="dom-if" if="[[supportTypeChanged(manualEncoding.supportType)]]">
                    <div class="manualEncodingContainer">
                        <vaadin-combo-box id="code-type" filtered-items="[[typeOfReasonVignette]]" item-label-path="label.[[language]]" item-value-path="id" label="Raison Vignette" value="{{manualEncoding.reasonVignette}}" class="manualEncodingContainerChild"></vaadin-combo-box>
                    </div>
                </template>
            </div>
            <div class="buttons">
                <paper-button class="button" on-tap="_closeManualEncodingDialog">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" on-tap="_confirmManualEncodingDialog">[[localize('add','Add',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="cancelDialog">
            <h2 class="modal-title">Annulation d'une eattest</h2>
            <div class="content reasonCancel p5">
                <vaadin-combo-box id="reasonOfCancel" filtered-items="[[reasonOfCancel]]" item-label-path="label.[[language]]" item-value-path="id" label="Raison" value="{{reason}}" class="manualEncodingContainerChild"></vaadin-combo-box>
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" dialog-confirm="" on-tap="_cancelEattest">[[localize('confirm','Confirm',language)]]</paper-button>
            </div>
        </paper-dialog>

        <paper-dialog id="paymentCheckDialog">
            <h2 class="modal-title">Type de paiement</h2>
            <div class="content">
                <div class="p5">
                    <p>Veuillez introduire le type de paiement et le montant <b>encaissé</b><br>Le montant indiqué sera repris sur le justificatif et a valeur fiscale</p>
                    <div class="inputs-line">
                        <vaadin-combo-box id="paymentType" filtered-items="[[paymentTypes]]" item-label-path="label.[[language]]" item-value-path="id" label="Type de paiement" value="{{selectedInvoice.paymentType}}" class="manualEncodingContainerChild"></vaadin-combo-box>
                        <vaadin-text-field class="paid" label="Montant encaissé" theme="always-float-label" allowed-pattern="[.\\d]" value="{{selectedInvoice.paid}}" type="number" min="0" max="100000" step="0.01"></vaadin-text-field>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <paper-button class="button" dialog-dismiss="">[[localize('can','Cancel',language)]]</paper-button>
                <paper-button class="button button--save" dialog-confirm="" on-tap="_confirmPayment">[[localize('validate','Validate',language)]]</paper-button>
            </div>
        </paper-dialog>
`
    }

    static get is() {
        return 'ht-pat-invoicing-dialog'
    }

    static get properties() {
        return {
            api: {
                type: Object
            },
            user: {
                type: Object
            },
            patient: {
                type: Object,
                value: null
            },
            contact: {
                type: Object,
                value: null
            },
            language: {
                type: String
            },
            currentContact: {
                type: Object,
                value: null
            },
            resources: {
                type: Object
            },
            opened: {
                type: Boolean,
                value: false
            },
            paymentTypes: {
                type: Array,
                value: () => [
                    {
                        id: "wired",
                        label: {"fr": "Virement", "nl": "Overschrijving", "en": "Wired"}
                    },
                    {
                        id: "cash",
                        label: {"fr": "En espèces", "nl": "Cash", "en": "Cash"}
                    },
                    {
                        id: "debitcard",
                        label: {"fr": "Carte de débit", "nl": "Debit kaart", "en": "Debit card"}
                    },
                    {
                        id: "creditcard",
                        label: {"fr": "Carte de crédit", "nl": "Credit kaart", "en": "Credit card"}
                    }
                ]
            },
            invoiceType: {
                type: Array,
                value: () => [
                    {
                        id: "mutualfund",
                        label: {"fr": "Mutuelle", "nl": "Mutual", "en": "Mutual"}
                    },
                    {
                        id: "patient",
                        label: {"fr": "Patient", "nl": "Patient", "en": "Patient"}
                    },
                    {
                        id: "payingagency",
                        label: {"fr": "Autre organisme", "nl": "Anders", "en": "Paying agency"}
                    }
                ]
            },
            sentMediumType: {
                type: Array,
                value: () => [
                    {
                        id: "efact",
                        label: {"fr": "eFact", "nl": "eFact", "en": "eFact"}
                    },
                    {
                        id: "eattest",
                        label: {"fr": "eAttest", "nl": "eAttest", "en": "eAttest"}
                    },
                    {
                        id: "mediprima",
                        label: {"fr": "Mediprima", "nl": "Mediprima", "en": "Mediprima"}
                    },
                    {
                        id: "paper",
                        label: {"fr": "Papier", "nl": "Paper", "en": "Paper"}
                    }
                ]
            },
            invoicePeriod: {
                type: Array,
                value: () => [
                    {
                        id: 0,
                        label: {"fr": "Semaine", "nl": "Week", "en": "Week"}
                    },
                    {
                        id: 1,
                        label: {"fr": "Nuit", "nl": "Nacht", "en": "Night"}
                    },
                    {
                        id: 2,
                        label: {"fr": "Weekend", "nl": "Weekend", "en": "Weekend"}
                    },
                    {
                        id: 3,
                        label: {"fr": "Jour férié", "nl": "Vakantie", "en": "Public holiday"}
                    }
                ]
            },
            careProviderType: {
                type: Array,
                value: () => [
                    {
                        id: "persphysician",
                        label: {"fr": "Médecin", "nl": "Arts", "en": "Physician"}
                    },
                    {
                        id: "traineesupervised",
                        label: {"fr": "Méd.stag. superv.", "nl": "Stagiair arts", "en": "Superv. trainee"}
                    },
                    {
                        id: "trainee",
                        label: {"fr": "Médecin stagiaire", "nl": "Stagiair arts", "en": "Trainee physician"}
                    }
                ]
            },
            prescriberType: {
                type: Array,
                value: () => [
                    {
                        id: 0,
                        label: {"fr": "Pas de prescripteur", "nl": "No prescriber", "en": "No prescriber"},
                        prescriber: false
                    },
                    {
                        id: 1,
                        label: {
                            "fr": "La prestation peut être attribuée à un prescripteur",
                            "nl": "The benefit can be attributed to a prescriber",
                            "en": "The benefit can be attributed to a prescriber physician"
                        },
                        prescriber: true
                    },
                    {
                        id: 3,
                        label: {
                            "fr": "Les prestations sont effectuées pour ses propres patients",
                            "nl": "The services are performed for his own patients",
                            "en": "The services are performed for his own patients"
                        },
                        prescriber: false
                    },
                    {
                        id: 4,
                        label: {
                            "fr": "Il s'agit de prestations ajoutées",
                            "nl": "These are added benefits",
                            "en": "These are added benefits"
                        },
                        prescriber: true
                    },
                    {
                        id: 5,
                        label: {
                            "fr": "La prestation peut être attribuée à un prescripteur et elle a été substituée",
                            "nl": "The benefit can be attributed to a prescriber and has been substituted",
                            "en": "The benefit can be attributed to a prescriber and has been substituted"
                        },
                        prescriber: true
                    },
                    {
                        id: 6,
                        label: {
                            "fr": "La prestation est prescrite par différents prescripteurs et elle a été substituée",
                            "nl": "The benefit is prescribed by different prescribers and has been substituted",
                            "en": "The benefit is prescribed by different prescribers and has been substituted"
                        },
                        prescriber: true
                    }
                ]
            },
            locationType: {
                type: Array,
                value: () => [
                    {
                        id: 0,
                        label: {"fr": "Pas de lieu de prestation", "nl": "Geen location", "en": "No location"},
                        location: "",
                        cdHcParty: ""
                    },
                    {
                        id: 1,
                        label: {
                            "fr": "La prestation est dispensée effectuée dans un hôpital",
                            "nl": "The benefit is provided at a hospital",
                            "en": "The benefit is provided at a hospital"
                        },
                        location: "HOSPITAL",
                        cdHcParty: "orghospital"
                    },
                    {
                        id: 2,
                        label: {
                            "fr": "La prestation est dispensée dans un labo",
                            "nl": "The benefit is provided at a labo",
                            "en": "The benefit is provided at a labo"
                        },
                        location: "LABO",
                        cdHcParty: "orglaboratory"

                    }
                ]
            },
            thirdPartyJustification: {
                type: Array,
                value: () => [

                    {
                        id: "0",
                        label: {
                            "fr": "0. Pas de justification",
                            "nl": "0. No justification",
                            "en": "0. No justification"
                        }
                    },
                    {
                        id: "1",
                        label: {"fr": "1. Décès, coma", "nl": "1. Death, coma", "en": "1. Death, coma"}
                    },
                    {
                        id: "2",
                        label: {
                            "fr": "2. Etat d'urgence financière",
                            "nl": "2. State of financial emergency",
                            "en": "2. State of financial emergency"
                        }
                    },
                    {
                        id: "3",
                        label: {"fr": "3. BIM", "nl": "3. BIM", "en": "3. BIM"}
                    },
                    {
                        id: "4",
                        label: {
                            "fr": "4. Prestations dispensées dans le cadre d'un accord prévoyant le paiement forfaitaire de cetaines prestations",
                            "nl": "4. Benefits provided under an agreement providing for the payment of certain benefits",
                            "en": "4. Benefits provided under an agreement providing for the payment of certain benefits"
                        }
                    },
                    {
                        id: "5",
                        label: {
                            "fr": "5. Prestations dispensées dans les centres de santé mentale, centres de planning familial et centres d'accueil pour toxicomanes",
                            "nl": "5. Services Provided in Mental Health Centers, Family Planning Centers and Addiction Centers",
                            "en": "5. Services Provided in Mental Health Centers, Family Planning Centers and Addiction Centers"
                        }
                    },
                    {
                        id: "6",
                        label: {
                            "fr": "6. Prestations dispensées dans des établissements spécialisés dans les soins aux enfants, aux personnes agées ou aux handicapés",
                            "nl": "6. Services provided in institutions specializing in the care of children, the elderly people or the disabled",
                            "en": "6. Services provided in institutions specializing in the care of children, the elderly people or the disabled"
                        }
                    },
                    {
                        id: "7",
                        label: {
                            "fr": "7. Prestations effectuées dans le cadre d'un service de garde de médecine générale",
                            "nl": "7. Services provided as part of a general medical care service",
                            "en": "7. Services provided as part of a general medical care service"
                        }
                    },
                    {
                        id: "8",
                        label: {
                            "fr": "8. Statut affection chronique (sur base d'une attestation fournie par le patient)",
                            "nl": "8. Chronic condition",
                            "en": "8. Chronic condition"
                        }
                    },
                    {
                        id: "9",
                        label: {
                            "fr": "9. Interdiction de facturer en tiers-payant via efact",
                            "nl": "9. Prohibition of third-party billing via efact",
                            "en": "9. Prohibition of third-party billing via efact"
                        }
                    },
                    {
                        id: "p",
                        label: {
                            "fr": "P. Patients palliatifs à domicile",
                            "nl": "P. Home palliative patients",
                            "en": "P. Home palliative patients"
                        }
                    }
                ]
            },
            reasonOfManualEncoding: {
                type: Object,
                value: () => [
                    {
                        id: 1,
                        label: {
                            "fr": "Utilisation d’un document d’identité sans puce",
                            "nl": "Using an identity document without a chip",
                            "en": "Using an identity document without a chip"
                        }
                    },
                    {
                        id: 2,
                        label: {
                            "fr": "Indisponibilité du lecteur de carte",
                            "nl": "Unavailability of the card reader",
                            "en": "Unavailability of the card reader"
                        }
                    },
                    {
                        id: 3,
                        label: {
                            "fr": "Panne du système informatique",
                            "nl": "Computer system failure",
                            "en": "Computer system failure"
                        }
                    }
                ]

            },
            invoicingCodeDerogationType: {
                type: Object,
                value: () => [
                    {
                        id: 0,
                        label: {
                            "fr": "Pas de dérogation",
                            "nl": "No derogation",
                            "en": "No derogation"
                        }
                    },
                    {
                        id: 3,
                        label: {
                            "fr": "2e prestation identique de la journée",
                            "nl": "2nd identical service of the day",
                            "en": "2nd identical service of the day"
                        }
                    },
                    {
                        id: 4,
                        label: {
                            "fr": "3e ou suivante prestation identique de la journée",
                            "nl": "3nd or following identical service of the day",
                            "en": "3nd or following identical service of the day"
                        }
                    }
                ]
            },
            typeOfSupport: {
                type: Object,
                value: () => [
                    {
                        id: 1,
                        label: {
                            "fr": "Carte d’identité électronique belge (ou Kids-id)",
                            "nl": "Belgium electronic identity card (or Kids-id)",
                            "en": "Belgium electronic identity card (or Kids-id)"
                        }
                    },
                    {
                        id: 2,
                        label: {
                            "fr": "Carte d’identité électronique étranger",
                            "nl": "Other country electronic identity card",
                            "en": "Other country electronic identity card"
                        }
                    },
                    {
                        id: 4,
                        label: {
                            "fr": "Carte ISI+",
                            "nl": "ISI+ card",
                            "en": "ISI+ card"
                        }
                    },
                    {
                        id: 5,
                        label: {
                            "fr": "Document de séjour électronique",
                            "nl": "Electronic residence document",
                            "en": "Electronic residence document"
                        }
                    },
                    {
                        id: 7,
                        label: {
                            "fr": "Vignette avec code-à-barres",
                            "nl": "Thumbnail with barcode",
                            "en": "Thumbnail with barcode"
                        }
                    },
                    {
                        id: 8,
                        label: {
                            "fr": "Attestation d’assuré social",
                            "nl": "Social insurance certificate",
                            "en": "Social insurance certificate"
                        }
                    },
                    {
                        id: 9,
                        label: {
                            "fr": "Attestation de perte ou de vol",
                            "nl": "Certificate of loss or theft",
                            "en": "Certificate of loss or theft"
                        }
                    }
                ]

            },
            typeOfReasonVignette: {
                type: Object,
                value: () => [
                    {
                        id: 1,
                        label: {
                            "fr": "Le bénéficiaire n’est pas présent au moment de la prestation et sa présence simultanée et celle du dispensateur n’est pas réglementairement requise",
                            "nl": "Le bénéficiaire n’est pas présent au moment de la prestation et sa présence simultanée et celle du dispensateur n’est pas réglementairement requise",
                            "en": "Le bénéficiaire n’est pas présent au moment de la prestation et sa présence simultanée et celle du dispensateur n’est pas réglementairement requise"
                        }
                    },
                    {
                        id: 2,
                        label: {
                            "fr": "Le bénéficiaire ne dispose pas de document d’identité",
                            "nl": "Le bénéficiaire ne dispose pas de document d’identité",
                            "en": "Le bénéficiaire ne dispose pas de document d’identité"
                        }
                    }
                ]

            },
            manualEncoding: {
                type: Object,
                value: () => ({
                    reason: "",
                    supportType: "",
                    serialNumber: "",
                    reasonVignette: "",
                    typeInput: 0
                })
            },
            selectedInvoice: {
                type: Object,
                value: () => {
                }
            },
            invoices: {
                type: Array,
                value: () => {
                }
            },
            totalInvoice: {
                type: Object,
                value: () => ({
                    reimbursement: Number(0.00).toFixed(2),
                    totalAmount: Number(0.00).toFixed(2),
                    patientIntervention: Number(0.00).toFixed(2),
                    doctorSupplement: Number(0.00).toFixed(2)
                })
            },
            isThirdParty: {
                type: Boolean,
                value: true
            },
            nmclListItem: {
                type: Array,
                value: () => []
            },
            nmclFilterValue: {
                type: String
            },
            npi: {
                type: Boolean,
                value: false
            },
            favoriteCode: {
                type: Object
            },
            isTarificationError: {
                type: Boolean,
                value: false
            },
            isDetailNmcl: {
                type: Boolean,
                value: false
            },
            tarificationError: {
                type: Array
            },
            activeNmclItem: {
                type: Object
            },
            isPrescriberIsNeeded: {
                type: Boolean,
                value: false
            },
            isLocationIsNeeded: {
                type: Boolean,
                value: false
            },
            isNmclVerified: {
                type: Boolean,
                value: false
            },
            isTrainee: {
                type: Boolean,
                value: false
            },
            isTarificationMcnError: {
                type: Boolean,
                value: false
            },
            hcp: {
                type: Object,
                value: () => ({})
            },
            selectedMediumCodeType: {
                type: String
            },
            i18n: {
                type: Object
            },
            invoiceDateAsString: {
                type: String,
                observer: '_invoiceDateAsStringChanged'
            },
            prescriptionDateAsString: {
                type: String,
                observer: '_prescriptionDateAsStringChanged'
            },
            isInvoiceClosed: {
                type: Boolean,
                value: false
            },
            bufferTypeCode: {
                type: String,
                observer: '_transferNmcl'
            },
            childRelativeCodeId: {
                type: String,
                value: "",
                observer: '_linkCode'
            },
            parentRelatedCodeId: {
                type: String,
                value: ""
            },
            isEattestClosed: {
                type: Boolean,
                value: false
            },
            isLoadingValidation: {
                type: Boolean,
                value: false
            },
            isLoadingJustif: {
                type: Boolean,
                value: false
            },
            searchOrgName: {
                type: String,
                value: ""
            },
            organisationList: {
                type: Array,
                value: () => []
            },
            errorMessage: {
                type: String,
                value: null
            },
            selectedInvoiceIndex: {
                type: Number
            },
            reasonOfCancel: {
                type: Object,
                value: () => [
                    {
                        id: "A",
                        label: {
                            "fr": "Erreur de patient",
                            "nl": "Erreur de patient",
                            "en": "Patient error"
                        }
                    },
                    {
                        id: "B",
                        label: {
                            "fr": "Erreur de prestataire (médecin B en lieu et place du médecin A)",
                            "nl": "Erreur de prestataire (médecin B en lieu et place du médecin A)",
                            "en": "Provider error (doctor B instead of doctor A)"
                        }
                    },
                    {
                        id: "C",
                        label: {
                            "fr": "Erreur dans un des éléments de l’ASD (ex. : code nomenclature, n° de dent, montant de l’honoraire/montant à payer par le patient, …)",
                            "nl": "Erreur dans un des éléments de l’ASD (ex. : code nomenclature, n° de dent, montant de l’honoraire/montant à payer par le patient, …)",
                            "en": "Error in one of the elements of the ASD (ex. : nomenclature code, tooth number, amount of fee / amount to be paid by the patient, …)"
                        }
                    },
                    {
                        id: "D",
                        label: {
                            "fr": "Double envoi de la même e-Attest",
                            "nl": "Double envoi de la même e-Attest",
                            "en": "Double sending of the same e-Attest"
                        }
                    },
                    {
                        id: "E",
                        label: {
                            "fr": "e-Attest remplacée par e-Fact",
                            "nl": "e-Attest remplacée par e-Fact",
                            "en": "e-Attest replaced by e-Fact"
                        }
                    },
                    {
                        id: "F",
                        label: {
                            "fr": "e-Attest remplacée par ASD papier. Envoi d’une eASD pour un patient devant ou souhaitant recevoir une ASD papier (ex. : versement sur un autre compte, accident de travail, police, problème technique, …)",
                            "nl": "e-Attest remplacée par ASD papier. Envoi d’une eASD pour un patient devant ou souhaitant recevoir une ASD papier (ex. : versement sur un autre compte, accident de travail, police, problème technique, …)",
                            "en": "e-Attest replaced by ASD paper. Sending an eASD for a patient in front of or wishing to receive a paper-based ASD (ex .: payment to another account, accident at work, police, technical problem, …)"
                        }
                    },
                    {
                        id: "G",
                        label: {
                            "fr": "Situation ne permettant pas l'établissement d'une e-Attest (eASD établie par erreur ex : pas de consultation mais délivrance d’une prescription, simple contact téléphonique, …). Il s’agit donc d’une annulation pure et simple de l’eASD",
                            "nl": "Situation ne permettant pas l'établissement d'une e-Attest (eASD établie par erreur ex : pas de consultation mais délivrance d’une prescription, simple contact téléphonique, …). Il s’agit donc d’une annulation pure et simple de l’eASD",
                            "en": "Situation not allowing the establishment of an e-Attest (eASD established by mistake ex: no consultation but issue of a prescription, simple telephone contact, …). It is therefore a pure and simple cancellation of the eASD"
                        }
                    }
                ]
            },
            reason: {
                type: String,
                value: "A"
            },
            hasInsurability: {
                type: Boolean,
                value: false
            },
            isInvoiceToBeCorrected: {
                type: Boolean,
                value: false
            },
            mousePos: {
                type: Object,
                value: {x: 0, y: 0}
            },
            favcodesScrollX: {
                type: Number,
                value: 0
            },
            defaultTicketMod: {
                type: Number,
                value: 0
            },
            needDefaultTicketMod: {
                type: Boolean,
                value: false
            },
            supervisor: {
                type: Object,
                value: () => {
                }
            }
        }

    }

    static get observers() {
        return ['_paymentTypeChanged(selectedInvoice.paymentType)', '_selectInvoice(selectedInvoiceIndex, invoices.*)', '_mediumTypeChanged(selectedInvoice.sentMediumType)', '_invoicingCodeChange(activeNmclItem, activeNmclItem.*)', 'selectedInvoiceChanged(selectedInvoice.*)', 'conventionAmountChanged(activeNmclItem.*)', 'varIsEattestClosedChanged(selectedInvoice.*)', '_checkIfLocationNeeds(selectedInvoice.encounterLocationNorm)']
    }

    ready() {
        super.ready()
        if (this.hcp) {
            if (this.hcp.parentId && this.hcp.parentId !== "") {
                this.api.hcparty().getHealthcareParty(this.hcp.parentId).then(hcp => {
                    if (hcp.type === "medicalHouse" && hcp.billingType === "flatRate") {
                        this.set("needDefaultTicketMod", true)
                        /** @ToDo
                         * Set the value of defaultTicket
                         * */
                    }
                })
            } else if (this.hcp.type === "medicalHouse" && this.hcp.billingType === "flatRate") {
                this.set("needDefaultTicketMod", true)
                /** @ToDo
                 * Set the value of defaultTicket
                 * */
            }
        }
    }

    dragHoriz(event) {
        const e = event || window.event
        const posX = e.clientX, posY = e.clientY
        const newPos = {x: posX, y: posY}
        if (this.mousePos != newPos) {
            this.set('mousePos', newPos)
        }
        console.log('drag queen', posX, posY)
    }


    _selectInvoice(idx) {
        // Drop all should there be any
        //this.shadowRoot.querySelectorAll(".iron-selected").forEach(item => { item && item.classList.remove("iron-selected") });

        const selected = (idx >= 0) ? this.invoices[idx] : null
        const invoiceId = selected && selected.id

        if (selected === this.selectedInvoice) {
            this.selectedInvoice.invoicingCodes.length > 0 ? this.set('npi', true) : this.set('npi', false)
            return
        }

        this.set("isLoadingJustif", false)
        this.set("isTarificationError", false)
        this.set("isTarificationMcnError", false)
        this.set('isDetailNmcl', false)
        this.set('isNmclVerified', false)
        this.set('npi', false)
        this.set("errorMessage", "")


        if (!selected) {
            this.set('selectedInvoice', {})
            return
        }


        this.api.tarification().getTarifications(new models.ListOfIdsDto({ids: selected.invoicingCodes.map(tar => tar.tarificationId)})).then(nmcls =>
            nmcls.map(nmcl => {

                let sns = selected.invoicingCodes.filter(n => n.tarificationId === nmcl.id) || null
                if (sns && sns.length) {
                    sns.map(sn => {
                        sn.prescriberNeeded = nmcl.needsPrescriber
                        sn.isRelativePrestation = nmcl.hasRelatedCode
                    })

                }
            })
        ).finally(() => {
            if (!selected.sentDate && this.needDefaultTicketMod) {
                selected.invoicingCodes.map(code => {
                    code.totalAmount -= (code.patientIntervention - this.defaultTicketMod)
                    code.patientIntervention = this.defaultTicketMod
                })
            }

            this.set("isInvoiceToBeCorrected", !!selected.invoicingCodes.find(ic => ic.resent === true))
            this.set('selectedInvoice', selected)
            this.set('selectedMediumCodeType', selected.sentMediumType)
            this.set('invoiceDateAsString', this.returnDatePickerDate(selected.invoiceDate))

            invoiceId !== "" ? this.calculateTotalOfInvoice() : null
            this.selectedInvoice.invoicingCodes.length > 0 ? this.set('npi', true) : this.set('npi', false)
            this.set('isInvoiceClosed', !!this.selectedInvoice.sentDate)

            this.set("manualEncoding.typeInput", 0)

            this.$['nmclGrid'].clearCache()
        })
    }

    isDoctorAssistant(nihii) {
        return (!!nihii && nihii.length === 11 && nihii.startsWith("1") && (nihii.endsWith("005") || nihii.endsWith("006")))
    }

    open(selection) {
        if (!this.user) return
        Promise.all([this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId), this.api.invoice().findBy(this.user.healthcarePartyId, this.patient).then(invoices => invoices.map(i => this.api.register(i, 'invoice')))]).then(([hcp, invoices]) => {
            this.set('supervisor', {})
            this.set('hcp', hcp)
            this.set('nmcl-value', '')

            ;((this.isDoctorAssistant(this.hcp.nihii || null) === true && this.hcp.supervisorId && this.hcp.supervisorId !== "") ? this.api.user().findByHcpartyId(this.hcp.supervisorId) : Promise.resolve({}))
                .then(sup => sup && sup[0] ? this.api.user().getUser(sup[0]) : Promise.resolve({}))
                .then(supervisor => {
                    supervisor && supervisor.id ? this.set('supervisor', supervisor) : null
                    const invoiceOfDay = invoices.find(i => i.invoiceDate + '' === moment().format("YYYYMMDD") && !i.printedDate)

                    if (!invoiceOfDay) {
                        const lastInsur = parseInt(this.patient.insurabilities.length) ?
                            _.chain(this.patient.insurabilities)
                                .filter(ins => _.get(ins, "startDate", 0) && parseInt(_.get(ins, "startDate", 0)) <= moment().format("YYYYMMDD") && !parseInt(_.get(ins, "endDate", 0)) && _.get(ins, "insuranceId", 0))
                                .orderBy(["startDate"], ["desc"])
                                .head()
                                .value()
                            : null

                        const newInvoice = {
                            invoicingCodes: [],
                            invoiceDate: moment().format("YYYYMMDD"),
                            invoiceReference: null,
                            thirdPartyPaymentJustification: lastInsur ? ((lastInsur.parameters.tc1 % 2 === 1) ? "3" : "0") : "0",
                            invoiceType: lastInsur ? ((lastInsur.parameters.tc1 % 2 === 1) ? "mutualfund" : "patient") : 'patient',
                            sentMediumType: lastInsur ? ((lastInsur.parameters.tc1 % 2 === 1) ? "efact" : "eattest") : 'paper',
                            invoicePeriod: 0,
                            longDelayJustification: 0,
                            gnotionNihii: null,
                            internshipNihii: this.isDoctorAssistant(this.hcp.nihii || null) === false ? null : this.hcp.nihii || null,
                            encounterLocationNorm: 0,
                            encounterLocationName: null,
                            encounterLocationNihii: null,
                            creditNote: false,
                            careProviderType: this.isDoctorAssistant(this.hcp.nihii || null) === false ? "persphysician" : "trainee"
                        }

                        this.set('invoices', _.orderBy(invoices.concat([newInvoice]), ['invoiceDate'], ['desc']))
                        if (selection && selection.invoicingCodeId) {
                            const idx = _.findIndex(this.invoices, i => i.id === selection.invoicingCodeId || i.invoicingCodes.some(c => c.id === selection.invoicingCodeId))
                            this.set('selectedInvoiceIndex', idx >= 0 ? idx : this.invoices.indexOf(newInvoice))
                        } else {
                            this.set('selectedInvoiceIndex', this.invoices.indexOf(newInvoice))
                        }
                    } else {
                        this.set('invoices', _.orderBy(invoices, ['invoiceDate'], ['desc']))
                        if (selection && selection.invoicingCodeId) {
                            const idx = _.findIndex(this.invoices, i => i.id === selection.invoicingCodeId || i.invoicingCodes.some(c => c.id === selection.invoicingCodeId))
                            this.set('selectedInvoiceIndex', idx >= 0 ? idx : this.invoices.indexOf(invoiceOfDay))
                        } else {
                            this.set('selectedInvoiceIndex', this.invoices.indexOf(invoiceOfDay))
                        }
                    }

                    this.set("hasInsurability", this._hasInsurability())

                    this.$.invoiceDialog.open()

                    this.getFavoritesCodes()
                })
        })
    }

    _mediumTypeChanged(mediumType) {

        this.varIsEattestClosedChanged()
        this.set('isInvoiceClosed', !!this.selectedInvoice.sentDate)


    }

    _favcodesScroll(e) {
        const dir = e.target.getAttribute('direction')
        if (dir) {
            const scrollBox = (dir == 'left') ? e.target.nextElementSibling : e.target.previousElementSibling
            const favCodes = scrollBox.children
            const maxScroll = favCodes.length * 80 - scrollBox.clientWidth
            let scrollPosition = this.tempScroll ? this.tempScroll : 0
            scrollPosition = (dir == 'left') ? scrollPosition - 80 : (dir == 'right') ? scrollPosition + 80 : scrollPosition
            scrollPosition = (scrollPosition < 0) ? 0 :
                (scrollPosition > maxScroll) ? maxScroll :
                    scrollPosition
            this.set('tempScroll', scrollPosition)
            this.set('favcodesScrollX', -scrollPosition)
        }
    }

    _closeDialog() {
        this.$.invoiceDialog.close()
    }

    _isTrainee(careProviderType) {
        return careProviderType && careProviderType === "persphysician" ? false : true
    }

    _checkInvoiceMediumType() {
        return this.selectedInvoice && this.selectedInvoice.sentMediumType && this.selectedInvoice.sentMediumType === "efact" ? true : false
    }

    getFavoritesCodes() {
        const preferedCode = this.user.properties.find(p => p.type && p.type.identifier === "org.taktik.icure.tarification.favorites")

        if (preferedCode && preferedCode.typedValue) {
            const code = JSON.parse(preferedCode.typedValue.stringValue)

            code && code.cs ? this.api.tarification().getTarifications(new models.ListOfIdsDto({ids: code && code.cs && code.cs.map(c => c)})) : Promise.resolve([]).then(t => {
                this.set("favoriteCode", t)
            })
        }
    }

    analyzeMediumType(e) {
        if (!this.selectedInvoice || !this.selectedMediumCodeType) return
        this.set('selectedMediumCodeType', e.detail.value)
        this.set('selectedInvoice.sentMediumType', e.detail.value)
        const mediumType = e.detail.value

        if (mediumType === 'eattest') {
            this.set('invoiceDateAsString', moment().format('YYYY-MM-DD'))
            this.set('selectedInvoice.encounterLocationNorm', 0)
            this.set('selectedInvoice.invoiceType', "patient")
        } else if (mediumType === "efact") {
            this.set('selectedInvoice.invoiceType', "mutualfund")
        }

        e && e.detail && e.detail.value && e.detail.value === "efact" ? this.set('isThirdParty', true) : this.set('isThirdParty', false)

        this.api.invoice().modifyInvoice(this.selectedInvoice)
            .then(invoice => this.api.register(invoice, 'invoice'))
            .then(invoice => {
                this.updateGui(invoice, true)
            })
    }

    _nmclSearch(e) {
        let latestSearchValue = e && e.detail.value
        this.latestSearchValue = latestSearchValue
        if (!latestSearchValue || latestSearchValue.length < 2) {
            // console.log("Cancelling empty search")
            this.set('nmclListItem', [])
            return
        }
        this._nmclDataProvider() && this._nmclDataProvider().filter(latestSearchValue).then(res => {
            if (latestSearchValue !== this.latestSearchValue) {
                console.log("Cancelling obsolete search")
                return
            }
            this.set('nmclListItem', res.rows)
        })
    }

    _nmclDataProvider() {
        return {
            filter: function (nmclFilterValue) {
                let count = 10
                return Promise.all([this.api.tarification().findPaginatedTarificationsByLabel('be', 'INAMI-RIZIV', this.language, nmclFilterValue, null, count)]).then(results => {
                    const nmclList = results[0]
                    const filtered = _.flatten(nmclList.rows.map(nmcl => ({
                        id: nmcl.id,
                        descr: nmcl.code + ': ' + nmcl.label[this.language],
                        code: nmcl.code,
                        label: nmcl.label,
                        valorisations: nmcl.valorisations
                    })))
                    return {totalSize: filtered.length, rows: filtered}
                })

            }.bind(this)
        }

    }

    _getDescription(label) {
        return label && label[this.language]
    }

    _addNmcl(e) {
        this.set("isTarificationMcnError", false)
        this.set("isTarificationError", false)
        this.set('isDetailNmcl', false)
        this.set('isNmclVerified', false)
        this.set('npi', false)

        if (this.shadowRoot.querySelector("#nmcl-search").selectedItem || e.target.dataset.item) {

            const nmcl = (e.target.dataset.item) ? JSON.parse(e.target.dataset.item) : this.shadowRoot.querySelector("#nmcl-search").selectedItem
            const newNmcl = {
                code: nmcl.code,
                tarificationId: nmcl.id,
                label: nmcl.label[this.language],
                totalAmount: Number(0.00).toFixed(2),
                reimbursement: Number(0.00).toFixed(2),
                patientIntervention: Number(0.00).toFixed(2),
                doctorSupplement: Number(0.00).toFixed(2),
                units: 1,
                canceled: false,
                accepted: false,
                pending: false,
                resent: false,
                dateCode: this.selectedInvoice.invoiceDate,
                prescriberNeeded: nmcl.needsPrescriber,
                isRelativePrestation: nmcl.hasRelatedCode,
                valid: false,
                id: this.api.crypto().randomUuid(),
                logicalId: this.api.crypto().randomUuid(),
                prescriberNihii: null,
                prescriberNorm: 0,
                derogationMaxNumber: 0
            }
            const ins = this.patient.insurabilities.find(i => !i.endDate) || null
            const age = moment().diff(this.patient.dateOfBirth, 'years', true)
            const dmg = this.patient.patientHealthCareParties.find(hcp => !hcp.referral)


            const env = new evaljs.Environment({
                patient: {
                    preferentialstatus: (ins && ins.parameters && ins.parameters.chronicalDisease) ? !!ins.parameters.preferentialstatus : false,
                    age: age,
                    dmg: (dmg && dmg.referral) ? !!dmg.referral : false,
                    chronical: (ins && ins.parameters && ins.parameters.chronicalDisease) ? !!ins.parameters.chronicalDisease : false
                },
                hcp: {
                    trainee: !!(this.hcp && this.hcp.statuses && this.hcp.statuses.find(st => st === "trainee")),
                    convention: !!(this.hcp && this.hcp.statuses && this.hcp.statuses.find(st => st === "withconvention"))
                }
            })

            if (nmcl.code != "109955") {
                nmcl.valorisations.forEach(val => {
                    const gen = (env.gen(val.predicate)())
                    let status = {done: false}

                    while (!status.done) {
                        status = gen.next() //Execute lines one by one
                    }

                    val.reimbursement = Number(val.reimbursement).toFixed(2)
                    val.patientIntervention = Number(val.patientIntervention).toFixed(2)
                    val.doctorSupplement = Number(val.doctorSupplement || '0').toFixed(2)
                    val.totalAmount = (Number(val.doctorSupplement || 0) + Number(val.patientIntervention || 0) + Number(val.reimbursement || 0)).toFixed(2)

                    // Patient has NO ins, charge it with all due fees
                    if (!this._hasInsurability()) {
                        val.patientIntervention = Number(Number(val.patientIntervention) + Number(val.reimbursement)).toFixed(2)
                        val.reimbursement = Number('0').toFixed(2)
                    }

                    if (status.value && moment().isBetween(this.api.moment(val.startOfValidity), this.api.moment(val.endOfValidity))) {

                        newNmcl.totalAmount = Number(Number(newNmcl.totalAmount) + Number(val.totalAmount)).toFixed(2)
                        newNmcl.reimbursement = Number(Number(newNmcl.reimbursement) + Number(val.reimbursement)).toFixed(2)
                        newNmcl.patientIntervention = Number(Number(newNmcl.patientIntervention) + Number(val.patientIntervention)).toFixed(2)

                        // Patient has NO ins, charge it with all due fees
                        if (!this._hasInsurability()) {
                            newNmcl.patientIntervention = Number(Number(newNmcl.patientIntervention) + Number(newNmcl.reimbursement)).toFixed(2)
                            newNmcl.reimbursement = Number('0').toFixed(2)
                        }
                    }
                })
            }

            //const lastPatientAssurance = this.patient.insurabilities && this.patient.insurabilities.length && this.patient.insurabilities.find(ass => !ass.endDate && ass.insuranceId != "") || null
            const patientInssurance = _.sortBy(_.get(this, 'patient.insurabilities', []), ['startDate']).find(ass => _.get(this, 'selectedInvoice.invoiceDate', null) && _.get(ass, 'startDate', null) && _.get(ass, 'endDate', null) && this.api.moment(_.get(this, 'selectedInvoice.invoiceDate', null)).isBetween(this.api.moment(_.get(ass, 'startDate', null)), this.api.moment(_.get(ass, 'endDate', null)))) || _.sortBy(_.get(this, 'patient.insurabilities', []), ['startDate']).find(ass => !ass.endDate && ass.insuranceId != "")

            this.api.crypto().extractDelegationsSFKs(this.patient, this.user.healthcarePartyId).then(secretForeignKeys => {
                const patientKeys = secretForeignKeys.extractedKeys.join(",")
                this.api.invoice().appendCodes((this.isDoctorAssistant(this.hcp.nihii) === true && this.supervisor && this.supervisor.id) ? this.supervisor.id : this.user.id, this.selectedInvoice.invoiceType, this.selectedMediumCodeType, (_.get(patientInssurance, 'insuranceId', '')), patientKeys, null, 0, [newNmcl])
                    .then(inv => (patientInssurance && patientInssurance.insuranceId ? this.api.insurance().getInsurance(patientInssurance.insuranceId).then(ins => [inv[0] || null, ins || null]) : Promise.resolve([inv[0] || null, null])))
                    .then(([inv, ins]) => (ins && ins != null) ? this.api.insurance().getInsurance(ins.parent).then(parentIns => [inv, parentIns]) : Promise.resolve([inv, null]))
                    .then(([inv, parentIns]) => {
                        let invoice = inv

                        if (!invoice) {
                            return null
                        }
                        if (!invoice.id) {
                            invoice.invoiceDate = this.selectedInvoice.invoiceDate
                            invoice.invoiceReference = this.selectedInvoice.invoiceReference
                            invoice.thirdPartyPaymentJustification = this.selectedInvoice.thirdPartyPaymentJustification
                            invoice.invoicePeriod = this.selectedInvoice.invoicePeriod !== "" ? this.selectedInvoice.invoicePeriod : 0
                            invoice.longDelayJustification = this.selectedInvoice.longDelayJustification
                            invoice.gnotionNihii = this.selectedInvoice.gnotionNihii === "" ? null : this.selectedInvoice.gnotionNihii
                            invoice.internshipNihii = this.selectedInvoice.internshipNihii === "" ? null : this.selectedInvoice.internshipNihii
                            invoice.creditNote = this.selectedInvoice.creditNote
                            invoice.careProviderType = this.selectedInvoice.careProviderType
                            invoice.encounterLocationName = this.selectedInvoice.encounterLocationName
                            invoice.encounterLocationNihii = this.selectedInvoice.encounterLocationNihii
                            invoice.encounterLocationNorm = this.selectedInvoice.encounterLocationNorm

                            const icId = invoice.invoicingCodes[0] && invoice.invoicingCodes[0].id
                            const prefix = 'invoice:' + this.user.healthcarePartyId + ':' + (parentIns && parentIns.code ? parentIns.code : '000') + ':'

                            if (!invoice.sentDate && this.needDefaultTicketMod) {
                                invoice.invoicingCodes.map(code => {
                                    code.totalAmount -= (code.patientIntervention - this.defaultTicketMod)
                                    code.patientIntervention = this.defaultTicketMod
                                })
                            }

                            return this.api.invoice().newInstance((this.isDoctorAssistant(this.hcp.nihii) === true && this.supervisor && this.supervisor.id) ? this.supervisor : this.user, this.patient, invoice)
                                .then(invoice => this.api.invoice().createInvoice(invoice, prefix))
                                .then(invoice => this.api.register(invoice, 'invoice'))
                                .then(invoice => {
                                    this.$['nmclGrid'].clearCache()
                                    console.log(this.selectedInvoice)
                                    this.api.invoice().findBy(this.user.healthcarePartyId, this.patient)
                                        .then(invoices => invoices.map(i => this.api.register(i, 'invoice')))
                                        .then(invoices => {
                                            this.set('invoices', _.orderBy(invoices, ['invoiceDate'], ['desc']))
                                            this.set('selectedInvoiceIndex', _.findIndex(this.invoices, i => i.invoicingCodes.some(c => c.id.includes(icId))))
                                            this.$['nmclGrid'].clearCache()

                                            return invoice
                                        })
                                })
                        } else {
                            this.api.tarification().getTarifications(new models.ListOfIdsDto({ids: invoice.invoicingCodes.map(tar => tar.tarificationId)})).then(nmcls =>
                                nmcls.map(nmcl => {
                                    let sns = invoice.invoicingCodes.filter(n => n.tarificationId === nmcl.id) || null
                                    if (sns && sns.length) {
                                        sns.map(sn => {
                                            sn.prescriberNeeded = nmcl.needsPrescriber
                                            sn.isRelativePrestation = nmcl.hasRelatedCode
                                        })
                                    }
                                })
                            ).then(x => {
                                if (!invoice.sentDate && this.needDefaultTicketMod) {
                                    invoice.invoicingCodes.map(code => {
                                        code.totalAmount -= (code.patientIntervention - this.defaultTicketMod)
                                        code.patientIntervention = this.defaultTicketMod
                                    })
                                }
                                const registered = this.api.register(invoice, 'invoice')
                                this.$['nmclGrid'].clearCache()
                                this.updateGui(registered)
                                return registered
                            })


                        }
                    })
            })
        }

        this.calculateTotalOfInvoice()
        this.set('nmcl-value', '')
        this.shadowRoot.querySelector("#nmcl-search").focus()
    }

    _addFavoriteCode() {
        if (this.shadowRoot.querySelector("#nmcl-search").selectedItem) {

            const newCode = this.shadowRoot.querySelector("#nmcl-search").selectedItem
            const preferedCode = this.user.properties.find(p => p.type && p.type.identifier === "org.taktik.icure.tarification.favorites")

            if (preferedCode && preferedCode.typedValue) {
                let code = JSON.parse(preferedCode.typedValue.stringValue)

                let existingCode = code && code.cs && code.cs.find(c => c === newCode.id) || null

                if (!existingCode) {

                    if (!code.cs) {
                        code = {cs: []}
                    }

                    code.cs.push(newCode.id)

                    preferedCode.typedValue.stringValue = JSON.stringify(code)

                    this.set('user.properties', this.user.properties.map(x => x))

                    console.log(this.user)

                    this.api.user().modifyUser(this.user)
                        .then(user => this.api.register(user, "user"))
                        .then(user => this.dispatchEvent(new CustomEvent('user-saved', {
                            detail: user,
                            bubbles: true,
                            composed: true
                        })))

                    this.getFavoritesCodes()
                }
            }
        }
        this.set('nmcl-value', '')
        this.shadowRoot.querySelector("#nmcl-search").focus()
    }

    _deleteFavoriteCode(e) {
        const preferedCode = this.user.properties.find(p => p.type && p.type.identifier === "org.taktik.icure.tarification.favorites")

        if (preferedCode && preferedCode.typedValue) {
            let code = JSON.parse(preferedCode.typedValue.stringValue)

            const index = code.cs.indexOf(e.target.dataset.item)
            delete (code.cs[index])
            code.cs.splice(index, 1)

            preferedCode.typedValue.stringValue = JSON.stringify(code)

            this.set('user.properties', this.user.properties.map(x => x))

            this.api.user().modifyUser(this.user)
                .then(user => this.api.register(user, 'user'))
                .then(user => this.dispatchEvent(new CustomEvent('user-saved', {
                    detail: user,
                    bubbles: true,
                    composed: true
                })))

            this.getFavoritesCodes()
        }

    }

    _verifyTarification() {
        if (this.patient.ssin && this.api.tokenId && this.selectedInvoice.invoiceDate !== "" && this.api.patient().isValidSsin(this.patient.ssin)) {
            this.set('isLoadingValidation', true)
            this.isLoadingEattest = true
            this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId)
                .then(hcp =>
                    (this.selectedInvoice.careProviderType === 'traineesupervised' || this.selectedInvoice.careProviderType === 'trainee') && hcp.supervisorId ?
                        this.api.hcparty().getHealthcareParty(hcp.supervisorId).then(sup =>
                            this.api.fhc().Tarificationcontroller().consultTarificationUsingPOST(
                                this.patient.ssin, this.api.tokenId, this.api.keystoreId, this.api.credentials.ehpassword,
                                hcp.firstName, hcp.lastName, hcp.nihii, hcp.ssin,
                                this.selectedInvoice.invoicingCodes.filter(ic => ic.code !== "109955").map(ic => ic.code), this.selectedInvoice.invoiceDate, this.selectedInvoice.gnotionNihii === "" ? null : this.selectedInvoice.gnotionNihii,
                                this.selectedInvoice.thirdPartyPaymentJustification === "0" ? null : this.selectedInvoice.thirdPartyPaymentJustification, sup.ssin, sup.nihii, sup.firstName, sup.lastName
                            ).then(r => this.api.logMcn(r, this.user, this.selectedInvoice.id, "eTar", "consult")
                            ))
                        :
                        this.api.fhc().Tarificationcontroller().consultTarificationUsingPOST(
                            this.patient.ssin, this.api.tokenId, this.api.keystoreId, this.api.credentials.ehpassword,
                            hcp.firstName, hcp.lastName, hcp.nihii, hcp.ssin,
                            this.selectedInvoice.invoicingCodes.filter(ic => ic.code !== "109955").map(ic => ic.code), this.selectedInvoice.invoiceDate, this.selectedInvoice.gnotionNihii === "" ? null : this.selectedInvoice.gnotionNihii,
                            this.selectedInvoice.thirdPartyPaymentJustification === "0" ? null : this.selectedInvoice.thirdPartyPaymentJustification
                        ).then(r => this.api.logMcn(r, this.user, this.selectedInvoice.id, "eTar", "consult"))
                )
                .then(r => {
                    console.log(r)
                    this.set('isDetailNmcl', false)
                    this.set("tarificationError", null)

                    if (r.errors.length > 0) {
                        const errors = r.errors
                        this.set("tarificationError", errors)
                        this.set("isTarificationError", true)

                        if (errors[0].code === "999999" || errors[0].code === "166") {
                            this.set("isTarificationMcnError", true)
                            this.set("isNmclVerified", true)
                        }

                    } else {
                        this.set("isTarificationError", false)
                        this.set("isNmclVerified", true)
                        this.set("isTarificationMcnError", false)

                        r.codeResults.forEach((c, idx) => {
                            let invCode = this.selectedInvoice.invoicingCodes[idx]
                            if (c.code !== invCode.code) {
                                //Desperate measure
                                invCode = this.selectedInvoice.invoicingCodes.find(invCode => invCode.code === c.code)
                                idx = this.selectedInvoice.invoicingCodes.indexOf(invCode)
                            }

                            this.set(`selectedInvoice.invoicingCodes.${idx}.reimbursement`, c.reimbursement.amount)
                            this.set(`selectedInvoice.invoicingCodes.${idx}.patientIntervention`, this.needDefaultTicketMod ? this.defaultTicketMod : c.patientFee.amount)
                            this.set(`selectedInvoice.invoicingCodes.${idx}.totalAmount`, this.needDefaultTicketMod ? c.fee.amount - c.patientFee.amount + this.defaultTicketMod : c.fee.amount)
                            this.set(`selectedInvoice.invoicingCodes.${idx}.contract`, c.contract)
                            this.set(`selectedInvoice.invoicingCodes.${idx}.valid`, true)
                            this.set(`selectedInvoice.invoicingCodes.${idx}.override3rdPayerCode`, c.justification)

                            //this.$['nmclGrid'].clearCache()
                        })
                        this.calculateTotalOfInvoice()
                        console.log(this.selectedInvoice)
                    }
                    return null
                })
                .catch((e) => {
                    console.log("Exception", e)
                }).finally(() => {
                this.isLoadingEattest = false
                this.set('isLoadingValidation', false)
                this.updateGui(this.selectedInvoice)
            })
        } else {
            //Todo manage mandatory fields
            let errors = []
            !this.patient.ssin ? errors.push({code: "999", msgFr: "Le patient n'a pas de niss"}) : null
            !this.api.tokenId ? errors.push({code: "999", msgFr: "Pas de connexion ehealth"}) : null
            !this.api.patient().isValidSsin(this.patient.ssin) ? errors.push({
                code: "999",
                msgFr: "Niss patient invalide"
            }) : null

            this.set("tarificationError", errors)
            this.set("isTarificationError", true)
            this.set("isNmclVerified", true)
        }
    }

    calculateTotalOfInvoice() {
        let totalAmount = 0
        let patientIntervention = 0
        let reimbursement = 0
        let doctorSupplement = 0

        this.selectedInvoice.invoicingCodes.map(n => {
            totalAmount += Number(n.totalAmount)
            patientIntervention += Number(n.patientIntervention)
            reimbursement += Number(n.reimbursement)
            doctorSupplement += Number(n.doctorSupplement)
        })

        this.set('totalInvoice.totalAmount', Number(totalAmount).toFixed(2))
        this.set('totalInvoice.patientIntervention', Number(patientIntervention).toFixed(2))
        this.set('totalInvoice.reimbursement', Number(reimbursement).toFixed(2))
        this.set('totalInvoice.doctorSupplement', Number(doctorSupplement).toFixed(2))
    }

    _getErrorMsg(item, language) {
        return item && language && language === "fr" ? item.msgFr : item.msgNl
    }

    _showDetail(e) {
        console.log(e)
        if (this.activeNmclItem) {
            const selected = this.activeNmclItem

            selected.prescriptionDate ? this.set('prescriptionDateAsString', this.returnDatePickerDate(selected.prescriptionDate)) : this.set('prescriptionDateAsString', moment().format("YYYY-MM-DD"))
            if (selected.code === "109955") {
                this.set('activeNmclItem.qteAll', (this.activeNmclItem.units + 6) / 2)
            }
            this.set('isDetailNmcl', true)
            console.log(this.activeNmclItem)
        } else {
            this.set('isDetailNmcl', false)
        }
    }

    _checkIfPrescriberIsNeeded(e) {
        if (e.detail.value === 0 || e.detail.value === 3) {
            this.set("isPrescriberIsNeeded", false)
        } else {
            this.set("isPrescriberIsNeeded", true)
        }
    }

    _checkIfLocationNeeds() {
        if (!this.selectedInvoice.encounterLocationNorm || this.selectedInvoice.encounterLocationNorm === "") {
            this.set("selectedInvoice.encounterLocationNorm", 0)
        }
        if (this.selectedInvoice.encounterLocationNorm === 0) {
            this.set("isLocationIsNeeded", false)
        } else {
            this.set("isLocationIsNeeded", true)
        }

    }

    _deleteNmclCode(e) {
        e.stopPropagation()
        if (e.target.dataset.item) {
            //this.api.invoice().removeCodes(this.user.id, service, this.patient.secretForeignKeys, e.target.item.tarificationId
            this.set('isDetailNmcl', false)
            let tabNmcl = this.selectedInvoice.invoicingCodes

            const item = tabNmcl.find(n => n.tarificationId === e.target.dataset.item)
            const iindex = tabNmcl.indexOf(item)

            delete (tabNmcl[iindex])
            tabNmcl.splice(iindex, 1)

            this.set("selectedInvoice.invoicingCodes", this.selectedInvoice.invoicingCodes.map(x => x))

            this.api.invoice().modifyInvoice(this.selectedInvoice)
                .then(invoice => this.api.register(invoice, 'invoice'))
                .then(invoice => {
                    this.api.tarification().getTarifications(new models.ListOfIdsDto({ids: invoice.invoicingCodes.map(tar => tar.tarificationId)})).then(nmcls =>
                        nmcls.map(nmcl => {
                            let sns = invoice.invoicingCodes.filter(n => n.tarificationId === nmcl.id) || null
                            if (sns && sns.length) {
                                sns.map(sn => {
                                    sn.prescriberNeeded = nmcl.needsPrescriber
                                    sn.isRelativePrestation = nmcl.hasRelatedCode
                                })
                            }
                        })
                    ).then(x => {
                        this.calculateTotalOfInvoice()
                        this.updateGui(invoice)
                        this.$['nmclGrid'].clearCache()
                    })

                    return invoice
                })
        }
    }

    analyzeCareProviderType(e) {
        if (e.detail.value === "trainee") {
            this.set("isTrainee", true)
        } else {
            this.set("isTrainee", false)
        }

        /*useless if(this.selectedInvoice.careProviderType==="traineesupervised"){
            this.set("selectedInvoice.internshipNihii",this.hcp.supervisorId)
        }*/
    }


    _prevalidateAndPrepareInvoiceForBatchSending() {
        if (this.selectedInvoice) {
            this.set('selectedInvoice.paid', Number(this.selectedInvoice.invoicingCodes.reduce((tot, c) => tot + (_.get(this.selectedInvoice, 'sentMediumType', 'paper') !== "efact" ? (Number(c.reimbursement) || 0) : 0) + (Number(c.patientIntervention) || 0) + (Number(c.doctorSupplement) || 0), 0).toFixed(2)))
            this.set('selectedInvoice.paymentType', "cash")
        }
        this.$['paymentCheckDialog'].open()
    }

    _confirmPayment() {
        this._validateAndPrepareInvoiceForBatchSending()
    }

    _validateAndPrepareInvoiceForBatchSending() {

        if (this.selectedInvoice.creditNote) {
            console.log(this.selectedInvoice)
            this.selectedInvoice.invoicingCodes.map(invoiceCode => {
                this.set("selectedInvoice.invoicingCodes." + this.selectedInvoice.invoicingCodes.indexOf(invoiceCode) + ".reimbursement", 0 - invoiceCode.reimbursement)
                this.set("selectedInvoice.invoicingCodes." + this.selectedInvoice.invoicingCodes.indexOf(invoiceCode) + ".patientIntervention", 0 - invoiceCode.patientIntervention)
                this.set("selectedInvoice.invoicingCodes." + this.selectedInvoice.invoicingCodes.indexOf(invoiceCode) + ".doctorSupplement", 0 - invoiceCode.doctorSupplement)
                this.set("selectedInvoice.invoicingCodes." + this.selectedInvoice.invoicingCodes.indexOf(invoiceCode) + ".totalAmount", 0 - invoiceCode.totalAmount)
            })
        }

        if (!this._isSelectedInvoiceEattest()) {

            if (!this.selectedInvoice.recipientId || this.selectedInvoice.recipientId === "") {
                const patientInssurance = _.sortBy(_.get(this, 'patient.insurabilities', []), ['startDate']).find(ass => _.get(this, 'selectedInvoice.invoiceDate', null) && _.get(ass, 'startDate', null) && _.get(ass, 'endDate', null) && this.api.moment(_.get(this, 'selectedInvoice.invoiceDate', null)).isBetween(this.api.moment(_.get(ass, 'startDate', null)), this.api.moment(_.get(ass, 'endDate', null)))) || _.sortBy(_.get(this, 'patient.insurabilities', []), ['startDate']).find(ass => !ass.endDate && ass.insuranceId != "")
                patientInssurance && patientInssurance.insuranceId ? this.set("selectedInvoice.recipientId", patientInssurance.insuranceId) : null
            }

            this.set('selectedInvoice.printedDate', moment().format("YYYYMMDD"))
        }

        if (this.isInvoiceToBeCorrected === true && !this._isSelectedInvoiceEattest()) {
            this.selectedInvoice.invoicingCodes.map(ic => ic.resent = false)

            this.api.invoice().modifyInvoice(this.selectedInvoice)
                .then(invoice => this.api.register(invoice, 'invoice'))
                .then(invoice => {
                    console.log(invoice)
                    this.updateGui(invoice)
                    return this.generateJustificatory(invoice)
                })
        } else {
            this.api.invoice().modifyInvoice(this.selectedInvoice)
                .then(invoice => this.api.register(invoice, 'invoice'))
                .then(invoice => {
                    console.log(invoice)
                    this.updateGui(invoice)

                    if (this.selectedInvoice.sentMediumType === "efact") {
                        return this.generateJustificatory(invoice)
                    } else if (this.selectedInvoice.sentMediumType === "eattest") {
                        return this.sendEattest(invoice)
                    }
                })
        }
    }

    _invoicingCodeChange() {
        if (this.activeNmclItem) {
            if (this.activeNmclItem.prescriberNorm === 0 || this.activeNmclItem.prescriberNorm === 3) {
                this.set("isPrescriberIsNeeded", false)
            } else {
                this.set("isPrescriberIsNeeded", true)
            }

            const code = this.selectedInvoice.invoicingCodes.find(code => code.id === this.activeNmclItem.id)
            const codeIdx = this.selectedInvoice.invoicingCodes.indexOf(code)

            let totalAmount = Number(this.activeNmclItem.patientIntervention) + Number(this.activeNmclItem.reimbursement) + Number(this.activeNmclItem.doctorSupplement)

            this.set('activeNmclItem.totalAmount', Number(totalAmount).toFixed(2).replace(/\.?0*$/, ''))
            this.set('selectedInvoice.invoicingCodes.' + codeIdx, this.activeNmclItem)
            this.$['nmclGrid'].clearCache()
            this.calculateTotalOfInvoice()
            this.selectedInvoiceChanged()
        }
    }

    returnDatePickerDate(date) {
        return date ? ("" + date).replace(/([0-9]{4})([0-9]{2})([0-9]{2})/, '$1-$2-$3') : 'N/A'

    }

    _formatInvoiceDate(date) {
        return date ? this.api.moment(date).format("DD/MM/YYYY") : 'N/A'
    }

    _formatAmount(amount) {

        // Make sure
        amount = typeof amount === 'undefined' ? 0 : amount

        if (amount == 0) {
            return "0.00"
        }
        if (amount.toString().length < 3) {
            let out = // if integer, add the decimals, else just besure it's float
                (Number(amount) % 1 === 0) ? amount + ".00" : parseFloat(amount)
            return out
        }
        return amount
    }

    datePickerChanged() {
        console.log('datePickerChange')
    }

    _invoiceDateAsStringChanged(invoiceDateAsString) {
        const dateNow = parseInt(this.api.moment(Date.now()).format('YYYYMMDD'))
        const dateInt = parseInt(invoiceDateAsString.replace(/(....)-(..)-(..)/, '$1$2$3'))
        if (this.selectedInvoice && (this.selectedInvoice.invoiceDate !== dateInt)) {
            if (dateInt <= dateNow) {
                this.set('selectedInvoice.invoiceDate', dateInt)
            } else {
                this.$['invoice-date'].set(Date.now())
            }

        }
    }

    _prescriptionDateAsStringChanged(prescriptionDateAsString) {
        const dateNow = parseInt(this.api.moment(Date.now()).format('YYYYMMDD'))
        const dateInt = parseInt(prescriptionDateAsString.replace(/(....)-(..)-(..)/, '$1$2$3'))
        if (this.activeNmclItem && (this.activeNmclItem.prescriptionDate !== dateInt)) {
            if (dateInt <= dateNow) {
                this.set('activeNmclItem.prescriptionDate', dateInt)
            } else {
                if (this.shadowRoot.querySelector('#prescription-date')) {
                    this.shadowRoot.querySelector('#prescription-date').set(Date.now())
                }
            }

        }

        console.log("date de prescription", this.activeNmclItem, this.selectedInvoice)
    }

    findAndReplace(string, target, replacement) {
        if (!(string && target && replacement)) return
        for (let i = 0; i < string.length; i++) {
            string = string.replace(target, replacement)
        }
        return string
    }

    getInvoiceType(invoiceType) {
        if (!invoiceType) return
        const type = this.invoiceType.find(type => type.id === invoiceType)
        return type && type.label && type.label[this.language]
    }

    getSentMediumType(sentMediumType) {
        const type = this.sentMediumType.find(type => type.id === sentMediumType)
        return type && type.label && type.label[this.language]
    }

    formatAmount(value) {
        return value && parseFloat(Math.round(value * 100) / 100).toFixed(2)
    }

    generateJustificatory() {
        this.set('isLoadingJustif', true)
        let template = {
            "pageOne": {
                entries: [],
                tot: {
                    totTotal: 0,
                    totOa: 0,
                    totPers: 0,
                    totSuppr: 0
                }
            },
            "pageTwo": {
                entries: [],
                tot: {
                    totTotal: 0,
                    totOa: 0,
                    totPers: 0,
                    totSuppr: 0
                }
            }
        }
        let totTotal = 0.00, totOA = 0.00, totPers = 0.00, totSupp = 0.00

        this.selectedInvoice.invoicingCodes.map(code => {
            const invoiceDate = this._formatInvoiceDate(code.dateCode)
            const invDate = invoiceDate
            const thisCode = code.code.toString()
            const reimbursement = this.formatAmount(code.reimbursement + '')
            const patientIntervention = this.formatAmount(code.patientIntervention + '')
            const doctorSupplement = this.formatAmount(code.doctorSupplement + '')
            const totalAmount = this.formatAmount(code.totalAmount + '')

            totTotal = Number(totTotal) + Number(code.totalAmount)
            totOA = Number(totOA) + Number(code.reimbursement)
            totPers = Number(totPers) + Number(code.patientIntervention)
            totSupp = Number(totSupp) + Number(code.doctorSupplement)

            totTotal = this.formatAmount(totTotal)
            totOA = this.formatAmount(totOA)
            totPers = this.formatAmount(totPers)
            totSupp = this.formatAmount(totSupp)

            const entry = {
                "invDate": invoiceDate,
                "code": thisCode,
                "reimbursement": reimbursement,
                "patientIntervention": patientIntervention,
                "doctorSupplement": doctorSupplement,
                "totalAmount": totalAmount
            }
            template.pageOne.entries.push(entry)
            template.pageTwo.entries.push(entry)
        })
        template.pageOne.tot.totTotal = totTotal
        template.pageOne.tot.totOa = totOA
        template.pageOne.tot.totPers = totPers
        template.pageOne.tot.totSupp = totSupp

        template.pageTwo.tot.totTotal = totTotal
        template.pageTwo.tot.totOa = totOA
        template.pageTwo.tot.totPers = totPers
        template.pageTwo.tot.totSupp = totSupp

        const html =
            `<html>
          <head>
              <style>
                  body {
                      margin: 0;
                  }
                  @page {
                      size: A4;
                      margin: 0;
                  }
                  article.page {
                      width: 210mm;
                      height: 297mm;
                      display: flex;
                      flex-direction: column;
                      padding: 25px;
                      box-sizing: border-box;
                      page-break-after: always;
                      border-bottom: 1px dashed grey;
                  }
                  article.page:last-child {
                      border-bottom: 0;
                  }
                  @media print {
                      article.page {
                          border-bottom: 0;
                      }
                  }
                  table {
                      display: table;
                      box-sizing: border-box;
                      border-spacing: 0;
                      border-collapse: collapse;
                      width: 100%;
                  }
                  table thead {font-size: 14px}
                  table tr,
                  table td {
                      margin: 0;
                      padding: 0;
                      vertical-align: top;
                  }
                  table td {padding: 5px;}

                  table.border,
                  table.border tr,
                  table.border td {
                      border: 1px solid black;
                  }
                  *.half td {width: 50%;}
                  *.no-border * {border: none !important;}
                  #factBody {
                      display: flex;
                      flex-direction: column;
                      flex: 1;
                      border: 1px solid black;
                  }
                  #factBody * {border: none;}
                  #factBody > * {
                      display: flex;
                      flex-direction: column;
                  }
                  #factBody > * > tr {
                      display: flex;
                      flex-direction: row;
                      border-bottom: 1px solid black;
                  }
                  #factBody > * > tr.border > td {border-right: 1px solid black;}
                  #factBody > * > tr.border > td:last-child {border-right: 0;            }
                  #factBody > * > tr > td {flex: 1 100%;}
                  #factBody > tbody {flex: 1;}
                  #factBody .table-entry,
                  #factBody .table-entry td {
                      border: none;
                      border-bottom: .5px solid lightgrey;
                  }
                  #factBody .table-entry td:last-child {border-bottom: none;}
                  #factBody .table-entry > td {text-align: right;}
                  #factBody .table-entry > td:first-child {text-align: left;}
                  #factBody .row-total > td {text-align: right;}
                  #factBody .row-total > td:first-child {text-align: left;}
                  .txt-center {text-align: center;}
                  .mt20 {margin-top: 20px;}
                  .bleft {border-left:1px solid black !important;}
                  .bleft-light {border-left:1px solid lightgrey !important;}
                  .bbottom-light {border-bottom:1px solid lightgrey !important;}
                  .bbzero {border-bottom: 0 !important;}
                  .nopad {padding: 0;}
                  .fleft {float: left;}
                  .fright {float:right;}
                  td.important {
                      font-weight: bold;
                      font-size: 1.1em;
                  }
                  td.indic {font-weight: 700;}
                  *.min-txt {font-size: 11px;}
                  .table-entry.min-txt {font-size: 16px;}
              </style>
          </head>
          <body>
              <article id="page-patient" class="page">
                  <table id="docHeader" class="border">
                      <thead>
                      <tr>
                          <td class="important">Numéro d'ordre: ${this.selectedInvoice.invoiceReference}</td>
                          <td class="important txt-center">DOCUMENT JUSTIFICATIF DE SOINS DE SANTE DESTINE AU PATIENT</td>
                      </tr>
                      <tr>
                          <td class="indic txt-center">Patient</td>
                          <td class="indic txt-center">Dispensateur de soins</td>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                          <td id="patient-info" class="nopad">
                              <table class="no-border">
                                  <thead>
                                      <tr>
                                          <td colspan="2">Identification</td>
                                      </tr>
                                  </thead>
                                  <tbody>
                                  <tr class="bbottom-light">
                                      <td>Nom&nbsp;:</td>
                                      <td class="indic">${this.patient.lastName}</td>
                                  </tr>
                                  <tr class="bbottom-light">
                                      <td>Prénom&nbsp;:</td>
                                      <td class="indic">${this.patient.firstName}</td>
                                  </tr>
                                  <tr>
                                      <td>NISS&nbsp;:</td>
                                      <td class="indic">${this.patient.ssin}</td>
                                  </tr>
                                  </tbody>
                              </table>
                          </td>
                          <td class="nopad">
                              <table class="no-border half">
                                  <tr>
                                      <td class="nopad">
                                          <table class="no-border">
                                              <thead>
                                              <tr>
                                                  <td colspan="2">Identification</td>
                                              </tr>
                                              </thead>
                                              <tbody>
                                              <tr class="bbottom-light">
                                                  <td>Nom&nbsp;:</td>
                                                  <td class="indic">${this.hcp.lastName}</td>
                                              </tr>
                                              <tr class="bbottom-light">
                                                  <td>Prénom&nbsp;:</td>
                                                  <td class="indic">${this.hcp.firstName}</td>
                                              </tr>
                                              <tr class="bbottom-light">
                                                  <td>Adresse&nbsp;:</td>
                                                  <td class="indic">${this.hcp.firstName}</td>
                                              </tr>
                                              </tbody>
                                              <tfoot>
                                              <tr class="bbottom-light">
                                                  <td>INAMI&nbsp;:</td>
                                                  <td class="indic">${this.hcp.nihii}</td>
                                              </tr>
                                              <tr>
                                                  <td>BCE&nbsp;:</td>
                                                  <td class="indic">${this.hcp.cbe}</td>
                                              </tr>
                                              </tfoot>
                                          </table>
                                      </td>
                                      <td class="bleft nopad">
                                          <table class="no-border">
                                              <thead>
                                              <tr>
                                                  <td class="txt-center">Les prestations de santé ont été effectuées pour le
                                                      compte de :</td>
                                              </tr>
                                              </thead>
                                              <tbody>
                                              <table class="no-border">
                                                  <tbody>
                                                  <tr class="bbottom-light">
                                                      <td>Nom&nbsp;:</td>
                                                      <td class="indic">${this.hcp.firstName}</td>
                                                  </tr>
                                                  <tr>
                                                      <td>BCE&nbsp;:</td>
                                                      <td class="indic">${this.hcp.cbe}</td>
                                                  </tr>
                                                  </tbody>
                                              </table>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      </tbody>
                  </table>
                  <table id="factBody" class="border mt20">
                      <thead>
                      <tr>
                          <td colspan="6" class="important txt-center">PRESTATION(S) DE SANTE REMBOURSABLE(S)</td>
                      </tr>
                      <tr class="no-border">
                          <td style="flex: 1 0 15.15%;"></td>
                          <td class="indic txt-center bleft-light" colspan="5">Prestation(s) facturée(s) en tiers payant</td>
                      </tr>
                      <tr class="border min-txt">
                          <td>Date des prestations</td>
                          <td>Code prestation</td>
                          <td>Intervention OA</td>
                          <td>Intervention personnelle</td>
                          <td>Supplément</td>
                          <td>Total</td>
                      </tr>
                      </thead>
                      <tbody>
                      {{#pageOne.entries}}
                      <tr class="table-entry min-txt">
                          <td>{{invDate}}</td>
                          <td class="bleft-light">{{code}}</td>
                          <td class="bleft-light">{{reimbursement}}</td>
                          <td class="bleft-light">{{patientIntervention}}</td>
                          <td class="bleft-light">{{doctorSupplement}}</td>
                          <td class="bleft-light">{{totalAmount}}</td>
                      </tr>
                      {{/pageOne.entries}}
                      </tbody>
                      <tfoot>
                      <tr class="no-border row-total">
                          <td class="important">Total</td>
                          <td></td>
                          {{#pageOne.tot}}
                          <td class="indic">{{totOa}}</td>
                          <td class="indic">{{totPerso}}</td>
                          <td class="indic">{{totSupp}}</td>
                          <td class="indic">{{totTotal}}</td>
                          {{/pageOne.tot}}
                      </tr>
                      <tr class="no-border">
                          <td class="indic">
                              <div class="fleft">Total dû par le patient</div>
                              <div class="fright">{{pageOne.tot.totPers}}</div>
                          </td>
                      </tr>
                      <tr class="no-border">
                          <td class="indic">
                              <div class="fleft">Montant total facturé à l'organisme assureur (OA)</div>
                              <div class="fright">{{pageOne.tot.totOa}}</div>
                          </td>
                      </tr>
                      <tr class="no-border bbzero">
                          <td class="indic">
                              <div class="fleft">Montant total à payer par le patient</div>
                              <div class="fright">{{pageOne.tot.totPers}}</div>
                          </td>
                      </tr>
                      </tfoot>
                  </table>
                  <small>Le présent document justificatif ne donne aucun droit au remboursement</small>
              </article>
              <article id="page-medic" class="page">
                  <table id="docHeader" class="border">
                      <thead>
                      <tr>
                          <td class="important">Numéro d'ordre&nbsp;: ${this.selectedInvoice.invoiceReference}</td>
                          <td class="important txt-center" colspan="2">DOCUMENT JUSTIFICATIF DE SOINS DE SANTE DESTINE AU MÉDECIN</td>

                      </tr>
                      <tr>
                          <td class="indic txt-center" colspan="3">Dispensateur de soins</td>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                          <td class="nopad">
                              <table class="no-border">
                                  <thead>
                                  <tr>
                                      <td colspan="2">Identification</td>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <tr class="bbottom-light">
                                      <td>Nom&nbsp;:</td>
                                      <td class="indic">${this.hcp.lastName}</td>
                                  </tr>
                                  <tr class="bbottom-light">
                                      <td>Prénom&nbsp;:</td>
                                      <td class="indic">${this.hcp.firstName}</td>
                                  </tr>
                                  <tr class="bbottom-light">
                                      <td>Adresse&nbsp;:</td>
                                      <td class="indic">${this.hcp.firstName}</td>
                                  </tr>
                                  </tbody>
                                  <tfoot>
                                  <tr class="bbottom-light">
                                      <td>INAMI&nbsp;:</td>
                                      <td class="indic">${this.hcp.nihii}</td>
                                  </tr>
                                  <tr>
                                      <td>BCE&nbsp;:</td>
                                      <td class="indic">${this.hcp.cbe}</td>
                                  </tr>
                                  </tfoot>
                              </table>
                          </td>
                          <td class="bleft nopad">
                              <table class="no-border">
                                  <thead>
                                  <tr>
                                      <td class="txt-center">Les prestations de santé ont été effectuées pour le
                                          compte de&nbsp;:</td>
                                  </tr>
                                  </thead>
                                  <tbody>
                                      <table class="no-border">
                                          <tbody>
                                          <tr class="bbottom-light">
                                              <td>Nom&nbsp;:</td>
                                              <td class="indic">${this.hcp.lastName}</td>
                                          </tr>
                                          <tr>
                                              <td>BCE&nbsp;:</td>
                                              <td class="indic">${this.hcp.cbe}</td>
                                          </tr>
                                          </tbody>
                                      </table>
                                  </tbody>
                              </table>
                          </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      </tbody>
                  </table>
                  <table id="factBody" class="border mt20">
                      <thead>
                      <tr>
                          <td colspan="6" class="important txt-center">PRESTATION(S) DE SANTE REMBOURSABLE(S)</td>
                      </tr>
                      <tr class="no-border">
                          <td style="flex: 1 0 15.15%;"></td>
                          <td class="indic txt-center bleft-light" colspan="5">Prestation(s) facturée(s) en tiers payant</td>
                      </tr>
                      <tr class="border min-txt">
                          <td>Date des prestations</td>
                          <td>Code prestation</td>
                          <td>Intervention OA</td>
                          <td>Intervention personnelle</td>
                          <td>Supplément</td>
                          <td>Total</td>
                      </tr>
                      </thead>
                      <tbody>
                      {{#pageTwo.entries}}
                      <tr class="table-entry min-txt">
                          <td>{{invDate}}</td>
                          <td class="bleft-light">{{code}}</td>
                          <td class="bleft-light">{{reimbursement}}</td>
                          <td class="bleft-light">{{patientIntervention}}</td>
                          <td class="bleft-light">{{doctorSupplement}}</td>
                          <td class="bleft-light">{{totalAmount}}</td>
                      </tr>
                      {{/pageTwo.entries}}
                      </tbody>
                      <tfoot>
                      <tr class="no-border row-total">
                          <td class="important">Total</td>
                          <td></td>
                          {{#pageTwo.tot}}
                          <td class="indic">{{totOa}}</td>
                          <td class="indic">{{totPerso}}</td>
                          <td class="indic">{{totSupp}}</td>
                          <td class="indic">{{totTotal}}</td>
                          {{/pageTwo.tot}}
                      </tr>
                      <tr class="no-border">
                          <td class="indic">
                              <div class="fleft">Total dû par le patient</div>
                              <div class="fright">{{pageTwo.tot.totPers}}</div>
                          </td>
                      </tr>
                      <tr class="no-border">
                          <td class="indic">
                              <div class="fleft">Montant total facturé à l'organisme assureur (OA)</div>
                              <div class="fright">{{pageTwo.tot.totOa}}</div>
                          </td>
                      </tr>
                      <tr class="no-border bbzero">
                          <td class="indic">
                              <div class="fleft">Montant total à payer par le patient</div>
                              <div class="fright">{{pageTwo.tot.totPers}}</div>
                          </td>
                      </tr>
                      </tfoot>
                  </table>
                  <small>Le présent document justificatif ne donne aucun droit au remboursement</small>
              </article>
          </body>
      </html>`

        this.api.pdfReport(mustache.render(html, template), {type: "doc-off-format", printer: 'regulations'})
            .then(({pdf: data, printed: printed}) => {
                if (!printed) {
                    let blob = new Blob([data], {type: 'application/pdf'})

                    let url = window.URL.createObjectURL(blob)

                    let a = document.createElement("a")
                    document.body.appendChild(a)
                    a.style = "display: none"

                    a.href = url
                    a.download = this.selectedInvoice.id + moment() + ".pdf"
                    a.click()
                    window.URL.revokeObjectURL(url)
                }
            }).finally(() => this.set('isLoadingJustif', false))
    }

    _ifStatusDateExist(date) {
        return (date && date !== "") ? true : false
    }

    _getOvveride3PayerCodeAsString(tp) {
        const tpAsString = this.thirdPartyJustification.find(tpRef => tpRef.id == tp)
        return (tpAsString) ? tpAsString.label[this.language] : ""

    }

    _transferNmcl() {
        if (this.activeNmclItem && this.activeNmclItem.id && this.bufferTypeCode && this.bufferTypeCode != this.selectedMediumCodeType) {
            this.api.crypto().extractDelegationsSFKs(this.patient, this.user.healthcarePartyId).then(secretForeignKeys => {
                const patientKeys = secretForeignKeys.extractedKeys.join(",")
                const patientInssurance = _.sortBy(_.get(this, 'patient.insurabilities', []), ['startDate']).find(ass => _.get(this, 'selectedInvoice.invoiceDate', null) && _.get(ass, 'startDate', null) && _.get(ass, 'endDate', null) && this.api.moment(_.get(this, 'selectedInvoice.invoiceDate', null)).isBetween(this.api.moment(_.get(ass, 'startDate', null)), this.api.moment(_.get(ass, 'endDate', null)))) || _.sortBy(_.get(this, 'patient.insurabilities', []), ['startDate']).find(ass => !ass.endDate && ass.insuranceId != "")
                this.api.invoice().appendCodes(this.user.id, this.selectedInvoice.invoiceType, this.bufferTypeCode, _.get(patientInssurance, 'insuranceId', ''), patientKeys, null, 0, [this.activeNmclItem])
                    .then(inv => (patientInssurance && patientInssurance.insuranceId ? this.api.insurance().getInsurance(patientInssurance.insuranceId).then(ins => [inv[0] || null, ins || null]) : Promise.resolve([inv[0] || null, null])))
                    .then(([inv, ins]) => (ins && ins != null) ? this.api.insurance().getInsurance(ins.parent).then(parentIns => [inv, parentIns]) : Promise.resolve([inv, null]))
                    .then(([inv, parentIns]) => {
                        let invoice = inv
                        if (!invoice) {
                            return null
                        }
                        if (!invoice.id) {
                            invoice.invoiceDate = this.selectedInvoice.invoiceDate
                            invoice.invoiceReference = this.selectedInvoice.invoiceReference
                            invoice.thirdPartyPaymentJustification = this.selectedInvoice.thirdPartyPaymentJustification
                            invoice.invoicePeriod = this.selectedInvoice.invoicePeriod
                            invoice.longDelayJustification = this.selectedInvoice.longDelayJustification
                            invoice.gnotionNihii = this.selectedInvoice.gnotionNihii === "" ? null : this.selectedInvoice.gnotionNihii
                            invoice.internshipNihii = this.selectedInvoice.internshipNihii === "" ? null : this.selectedInvoice.internshipNihii
                            invoice.creditNote = this.selectedInvoice.creditNote
                            invoice.careProviderType = this.selectedInvoice.careProviderType

                            const prefix = 'invoice:' + this.user.healthcarePartyId + ':' + (parentIns && parentIns.code ? parentIns.code : '000') + ':'

                            return this.api.invoice().newInstance(this.user, this.patient, invoice)
                                .then(invoice => this.api.invoice().createInvoice(invoice, prefix))
                                .then(invoice => this.api.register(invoice, 'invoice'))
                                .then(invoice => {
                                    this.$['nmclGrid'].clearCache()
                                    this.api.invoice().findBy(this.user.healthcarePartyId, this.patient)
                                        .then(invoices => invoices.map(i => this.api.register(i, 'invoice')))
                                        .then(invoices => {
                                            this.set('invoices', _.orderBy(invoices, ['invoiceDate'], ['desc']))
                                            this.set('selectedInvoiceIndex', _.findIndex(this.invoices, i => i.id === invoice.id))
                                            this.$['nmclGrid'].clearCache()

                                            return invoice
                                        })
                                })
                        } else {
                            const registered = this.api.register(invoice, 'invoice')
                            this.$['nmclGrid'].clearCache()
                            this.calculateTotalOfInvoice()

                            this.updateGui(registered)

                            return registered
                        }
                    }).then(invoice => {
                    this.set('isDetailNmcl', false)
                    let tabNmcl = this.selectedInvoice.invoicingCodes

                    const iindex = tabNmcl.indexOf(this.activeNmclItem)

                    //delete(this.selectedInvoice.invoicingCodes[iindex])
                    this.selectedInvoice.invoicingCodes.splice(iindex, 1)

                    this.api.invoice().modifyInvoice(this.selectedInvoice)
                        .then(invoice => this.api.register(invoice, 'invoice'))
                        .then(invoice => {
                            this.api.tarification().getTarifications(new models.ListOfIdsDto({ids: invoice.invoicingCodes.map(tar => tar.tarificationId)})).then(nmcls =>
                                nmcls.map(nmcl => {
                                    let sns = invoice.invoicingCodes.filter(n => n.tarificationId === nmcl.id) || null
                                    if (sns && sns.length) {
                                        sns.map(sn => {
                                            sn.prescriberNeeded = nmcl.needsPrescriber
                                            sn.isRelativePrestation = nmcl.hasRelatedCode
                                        })
                                    }
                                })
                            ).then(x => {
                                this.set("selectedInvoice.invoicingCodes", this.selectedInvoice.invoicingCodes.map(x => x))
                                this.$['nmclGrid'].clearCache()
                                this.calculateTotalOfInvoice()
                                this.updateGui(invoice)
                            })

                            return invoice
                        })
                })
            }).finally(() => {
                this.$["transferDialog"].close()
                this.set("bufferTypeCode", "")
            })
        }
    }

    updateGui(invoice, justLeftPart) {
        const selInvIdx = this.invoices.indexOf(invoice)
        Object.keys(invoice).forEach(k => {
            !justLeftPart && this.notifyPath(`selectedInvoice.${k}`)
            selInvIdx >= 0 && this.notifyPath(`invoices.${selInvIdx}.${k}`)
        })
    }

    _openTransfertDialog(e) {
        e.stopPropagation()
        this.$["transferDialog"].open()
    }

    _openlinkRelativePrestationDialog(e) {
        e.stopPropagation()
        this.parentRelatedCodeId = e.target.id
        this.$["relativeCodeDialog"].open()
    }

    _linkCode(selectedNmclId) {
        if (selectedNmclId != "") {
            const childNmcl = this.selectedInvoice.invoicingCodes.find(nmcl => selectedNmclId === nmcl.id) || null
            const parentNmcl = this.selectedInvoice.invoicingCodes.find(nmcl => this.parentRelatedCodeId === nmcl.id) || null

            if (childNmcl !== null && parentNmcl !== null) {
                parentNmcl.relatedCode = childNmcl.code
                this.$["relativeCodeDialog"].close()
            }

        }

    }

    //Obsolete because related-code.html is not supported by vaadin-grid for the moment.
    linkNmclToRelatedCode(e) {
        if (e.detail.relativeCode && e.detail.parentId) {
            let selectedNmcl = this.selectedInvoice.invoicingCodes.find(n => n.id === e.detail.parentId) || null
            if (selectedNmcl !== null) {
                selectedNmcl.relatedCode = e.detail.relativeCode
            }
        }
    }

    scheduleInvoiceUpdate() {
        const invoice = this.selectedInvoice
        const rev = invoice && invoice.rev
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout)
        }
        const saveAction = () => {
            if (rev !== invoice.rev) {
                return
            }
            this.api.invoice().modifyInvoice(invoice)
                .then(invoice => this.api.register(invoice, 'invoice'))
                .then(invoice => {
                    this.api.tarification().getTarifications(new models.ListOfIdsDto({ids: invoice.invoicingCodes.map(tar => tar.tarificationId)}))
                        .then(nmcls =>
                            nmcls.map(nmcl => {
                                let sns = invoice.invoicingCodes.filter(n => n.tarificationId === nmcl.id) || null
                                if (sns && sns.length) {
                                    sns.map(sn => {
                                        sn.prescriberNeeded = nmcl.needsPrescriber
                                        sn.isRelativePrestation = nmcl.hasRelatedCode
                                    })
                                }
                            }))
                        .finally(() => this.updateGui(invoice, true))
                    console.log("saved:", invoice)
                    this._patientSaved()
                })
        }
        if (invoice.id && rev) {
            this.saveTimeout = setTimeout(saveAction, 10000)
        } else {
            this.updateGui(invoice)
        }
    }

    _patientSaved() {
        setTimeout(() => this.$.savedIndicator.classList.remove("saved"), 2000)
        this.$.savedIndicator.classList.add("saved")
    }

    selectedInvoiceChanged() {
        this.scheduleInvoiceUpdate()
    }

    isEnterPressed(e) {
        if (e.keyCode == 13) {
            this._addNmcl(e)
        }
    }

    /*isLongDelay() {
        return this.selectedInvoice.longDelayJustification ? true : false
    }*/

    _openEidDialog() {
        this.$["eidDialog"].open()
    }

    _readEidCard() {

    }

    _readBarreCode() {

    }

    _showManualEncodingDialog() {
        this.$['eidDialog'].close()
        this.$['manualEncodingDialog'].open()
    }

    _closeEidDialog() {
        this.$['eidDialog'].close()
    }

    _closeManualEncodingDialog() {
        this.$['manualEncodingDialog'].close()
    }

    _confirmManualEncodingDialog() {
        if (!this.selectedInvoice || !this.manualEncoding) return

        this.set("selectedInvoice.idDocument", {})
        this.set("selectedInvoice.idDocument.reasonManualEncoding", this.manualEncoding && this.manualEncoding.reason)
        this.set("selectedInvoice.idDocument.eIdDocumentSupportType", this.manualEncoding && this.manualEncoding.supportType)
        this.set("selectedInvoice.idDocument.SupportSerialNumber", this.manualEncoding && this.manualEncoding.serialNumber)
        if (this.manualEncoding && this.manualEncoding.supportType === 7) {
            this.set("selectedInvoice.idDocument.reasonUsingVignette", this.manualEncoding && this.manualEncoding.reasonVignette)
        } else {

            this.set("selectedInvoice.idDocument.reasonUsingVignette", 0)
        }

        this.api.invoice().modifyInvoice(this.selectedInvoice)
            .then(invoice => this.api.register(invoice, 'invoice'))
            .then(invoice => {
                this.updateGui(invoice, true)

                this.set("manualEncoding", {
                    reason: "",
                    supportType: "",
                    serialNumber: "",
                    reasonVignette: "",
                    typeInput: 4
                })

                this.$['manualEncodingDialog'].close()
            })
    }

    supportTypeChanged() {
        return this.manualEncoding && this.manualEncoding.supportType === 7
    }

    _isCreditNote(e) {
        this.set('selectedInvoice.creditNote', e.target.checked)
    }

    _isLiftingLimitationPeriod(e) {
        this.set('selectedInvoice.longDelayJustification', e.target.checked ? 1 : 0)
    }

    isTravellingExpenses() {
        return this.activeNmclItem && this.activeNmclItem.code && this.activeNmclItem.code === "109955"
    }

    quantityAllHasChanged() {
        this.set("activeNmclItem.units", Math.round(this.activeNmclItem.qteAll * 2) - 6)
        if (this.activeNmclItem.units < 0) this.set("activeNmclItem.units", 0)
        if (this.activeNmclItem.qteAll > 20) this.set("activeNmclItem.units", 34)

        const total = Math.round(this.activeNmclItem.units * 0.92 * 100) / 100
        //entre 1.103 et 1.10 ils ont super mal calculé leurs éléments et ils donnent pas la formule.

        const remb = [0.84, 1.67, 2.51, 3.34, 4.17, 5.01, 5.84, 6.67, 7.51, 8.34, 9.17, 10.01, 10.84, 11.68, 12.51, 13.34, 14.18, 15.01, 15.84, 16.68, 17.51, 18.35, 19.18, 20.01, 20.84, 21.68, 22.51, 23.35, 24.18, 25.01, 25.85, 26.68, 27.51, 28.35]

        this.set("activeNmclItem.patientIntervention", (total - remb[this.activeNmclItem.units - 1]).toFixed(2))
        this.set("activeNmclItem.reimbursement", remb[this.activeNmclItem.units - 1])

        return this.activeNmclItem && this.activeNmclItem.qteAll && Math.round(this.activeNmclItem.qteAll * 2)
    }

    sendEattest() {
        this.set('isLoadingJustif', true)

        const eattest = {codes: []}
        this.selectedInvoice.invoicingCodes.map(code => {
            let newCode = {
                date: code.dateCode,
                doctorSupplement: Number(code.doctorSupplement),
                fee: Number(code.totalAmount),
                quantity: code.units + (code.code === "109955" ? 6 : 0),
                reglementarySupplement: Number(code.patientIntervention),
                reimbursement: Number(code.reimbursement),
                riziv: code.code
            }

            if (this.selectedInvoice.idDocument && this.selectedInvoice.idDocument.eIdDocumentSupportType && this.selectedInvoice.idDocument.SupportSerialNumber && this.selectedInvoice.idDocument.reasonManualEncoding) {
                newCode.cardReading = {
                    date: null,
                    inputType: this.manualEncoding.typeInput,
                    manualInputReason: this.selectedInvoice.idDocument.reasonManualEncoding,
                    mediaType: this.selectedInvoice.idDocument.eIdDocumentSupportType,
                    serial: this.selectedInvoice.idDocument.SupportSerialNumber,
                    time: null,
                }
            }

            if (code.relatedCode) {
                newCode.relativeService = code.relatedCode
            }
            if (this.selectedInvoice.gnotionNihii) {
                newCode.gmdManager = {
                    cdHcParty: "persphysician",
                    firstName: null,
                    idHcParty: this.selectedInvoice.gnotionNihii,
                    idSsin: null,
                    lastName: null
                }
            }

            if (this.selectedInvoice.internshipNihii && this.selectedInvoice.careProviderType === "trainee") {
                newCode.internship = {
                    cdHcParty: "persphysician",
                    firstName: null,
                    idHcParty: this.selectedInvoice.internshipNihii,
                    idSsin: null,
                    lastName: null
                }
            }

            if (this.selectedInvoice.internshipNihii && this.selectedInvoice.careProviderType === "traineesupervised") {
                newCode.internship = {
                    cdHcParty: "persphysician",
                    firstName: null,
                    idHcParty: this.hcp.nihii,
                    idSsin: null,
                    lastName: null
                }
            }


            if (this.selectedInvoice.encounterLocationNorm && this.selectedInvoice.encounterLocationNorm !== "" && this.selectedInvoice.encounterLocationNorm !== 0) {
                newCode.location = {
                    cdHcParty: this.locationType[this.selectedInvoice.encounterLocationNorm].cdHcParty,
                    firstName: null,
                    idHcParty: _.padEnd(this.selectedInvoice.encounterLocationNihii, 11, '0'),
                    idSsin: null,
                    lastName: null
                }
            }

            if (this.prescriberType[code.prescriberNorm].prescriber) {
                newCode.requestor = {
                    date: code.prescriptionDate,
                    hcp: {
                        cdHcParty: "persphysician",
                        firstName: null,
                        idHcParty: code.prescriberNihii || null,
                        idSsin: null,
                        lastName: null
                    }
                }
            }

            eattest.codes.push(newCode)
        })

        console.log("invoice", eattest)
        console.log("envoie")

        const sentDate = moment().format("YYYYMMDD")

        ;(this.selectedInvoice.careProviderType === "traineesupervised" ?
            this.api.hcparty().findBySsinOrNihii(this.selectedInvoice.internshipNihii, 0, 0, 1000, 'asc') : Promise.resolve({rows: []}))
            .then(hcps => this.api.fhc().Eattestcontroller().sendAttestWithResponseUsingPOST(this.patient.ssin, this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, (hcps.rows && hcps.rows.length && hcps.rows[0].nihii) || this.hcp.nihii, (hcps.rows && hcps.rows.length && hcps.rows[0].ssin) || this.hcp.ssin, (hcps.rows && hcps.rows.length && hcps.rows[0].firstName) || this.hcp.firstName, (hcps.rows && hcps.rows.length && hcps.rows[0].lastName) || this.hcp.lastName, (hcps.rows && hcps.rows.length && hcps.rows[0].cbe) || this.hcp.cbe, this.patient.firstName, this.patient.lastName, this.patient.gender, eattest, sentDate))
            .then(fhcEattest => this.api.logMcn(fhcEattest, this.user, this.selectedInvoice.id, 'eattest', 'notify'))
            .then(fhcEattest => {
                if (fhcEattest.acknowledge.errors.length === 0 && fhcEattest.attest !== null) {
                    this.set('selectedInvoice.thirdPartyReference', fhcEattest.invoicingNumber)
                    this.set("selectedInvoice.sentDate", sentDate)
                    fhcEattest.attest.codes.map(code => {
                        const currentCode = this.selectedInvoice.invoicingCodes.find(i => i.code === code.riziv)
                        currentCode.conventionAmount = code.fee
                    })
                    this.set("errorMessage", null)

                    Promise.all([
                        this.api.receipticc.createReceipt({
                            documentId: this.selectedInvoice.id,
                            references: Object.values(fhcEattest.commonOutput),
                            category: "eattest",
                            subCategory: "kmehr"
                        }),
                        this.api.receipticc.createReceipt({
                            documentId: this.selectedInvoice.id,
                            references: Object.values(fhcEattest.commonOutput),
                            category: "eattest",
                            subCategory: "xades"
                        })
                    ])
                        .then(([kmehr, xades]) => Promise.all([
                            this.api.receipt().setAttachment(kmehr.id, "kmehrResponse", undefined, (this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(atob(fhcEattest.kmehrMessage))))),
                            this.api.receipt().setAttachment(xades.id, "xades", undefined, (this.api.crypto().utils.ua2ArrayBuffer(this.api.crypto().utils.text2ua(atob(fhcEattest.xades)))))
                        ]))
                        .then(([kmehr, xades]) => {
                            kmehr.id && this.set('selectedInvoice.receipts', _.assign(this.selectedInvoice.receipts || {}, {kmehr: kmehr.id}))
                            xades.id && this.set('selectedInvoice.receipts', _.assign(this.selectedInvoice.receipts || {}, {xades: xades.id}))
                        })
                        .finally(() => this.eattest(this.selectedInvoice))
                } else {
                    let errorMsg = ""
                    if (fhcEattest.acknowledge && fhcEattest.acknowledge.errors && fhcEattest.acknowledge.errors.length !== 0)
                        fhcEattest.acknowledge.errors.map(error => {
                            console.log("Error :", error)
                            errorMsg += error.code + " " + (this.language === "fr" ? error.msgFr : error.msgNl) + ", "
                        })
                    else {
                        errorMsg += "Error : pas de message d'erreur renvoyé."
                    }
                    this.set("errorMessage", errorMsg)
                }
            }).finally(() => this.set('isLoadingJustif', false))
    }

    _ifEattestSaved(item) {
        return item && item.printedDate && item.sentMediumType && item.sentMediumType === "eattest"
    }

    _toggleEditHE(e) {
        e.stopPropagation()
        e.preventDefault()

        let parentElement = e.target.parentElement
        if (parentElement.classList.contains('open')) {
            parentElement.classList.remove('open')
        } else {
            parentElement.classList.add('open')
            setTimeout(() => parentElement.classList.remove('open'), 4000)
        }
    }

    downloadKmehr(e) {
        e.stopPropagation()
        e.preventDefault()

        const invoice = this.invoices.find(iv => iv.id === e.target.dataset.item)

        console.log("invoice for get Attachment :", invoice)

        var a = document.createElement('a')

        this.api.receipt().getReceipt(invoice.receipts.kmehr)
            .then(receipt => this.api.receipt().getAttachment(receipt.id, receipt.attachmentIds.kmehrResponse))
            .then(attach => {
                a.href = window.URL.createObjectURL(new Blob([new Uint8Array(attach)]))
                a.download = `invoice_kmehr-${invoice.invoiceDate}-${+new Date()}.xml`
                a.click()
                return null
            })
            .finally(() => a.remove())
    }

    downloadXades(e) {
        e.stopPropagation()
        e.preventDefault()

        const invoice = this.invoices.find(iv => iv.id === e.target.dataset.item)

        console.log("invoice for get Attachment :", invoice)

        var a = document.createElement('a')

        this.api.receipt().getReceipt(invoice.receipts.xades)
            .then(receipt => this.api.receipt().getAttachment(receipt.id, receipt.attachmentIds.xades))
            .then(attach => {
                a.href = window.URL.createObjectURL(new Blob([new Uint8Array(attach)]))
                a.download = `invoice_xades-${invoice.invoiceDate}-${+new Date()}.xml`
                a.click()
                return null
            })
            .finally(() => a.remove())
    }

    conventionAmountChanged() {
        if (!this.activeNmclItem) return
        const tot = Number(this.activeNmclItem.patientIntervention) + Number(this.activeNmclItem.reimbursement)
        this.set('activeNmclItem.conventionAmount', tot)
        this._isJustifButtonDisabled()
    }

    _handleCheckboxCheckedStatusFromInteger(inputValue) {
        return !!inputValue
    }

    duplicate(e) {
        e.stopPropagation()
        e.preventDefault()

        console.log(e.target.dataset.item)

        const invoice = this.invoices.find(iv => iv.id === e.target.dataset.item)
        invoice && this.eattest(invoice)
    }

    eattest(invoice) {
        //generate jpeg
        const element = this.root.querySelector("#barCode")
        JsBarcode(element, invoice.thirdPartyReference, {format: "CODE128A", displayValue: false, height: 75})
        const jpegUrl = element.toDataURL("image/jpeg")

        //totaux
        let totalACharge = 0.00
        let totalSuppl = 0.00
        let totalConv = 0.00
        let totalDelta = 0.00

        invoice.invoicingCodes.map((code) => {
            totalACharge += Number(code.reimbursement + code.patientIntervention)
            totalSuppl += Number(code.totalAmount - code.conventionAmount)
            totalConv += Number(code.conventionAmount)
            totalDelta += Number(code.reimbursement) + Number(code.patientIntervention) + Number(code.doctorSupplement)
        })

        let templatePat = _.clone(this.patient), templateHcp = _.clone(this.hcp)
        templatePat.gender = (this.patient.gender === "male") ? "Mr" : "Mme"
        templatePat.addresses.map(addr => {
            addr.telecoms.map(telcom => {
                telcom.telecomType = (telcom.telecomType === "phone") ? "Tel" : telcom.telecomType
            })
        })
        console.log("hcp", templateHcp, typeof templateHcp)
        console.log("pat", templatePat, typeof templatePat)
        templateHcp.addresses.map(addr => {
            addr.telecoms.map(telcom => {
                telcom.telecomType = (telcom.telecomType === "phone") ? "Tel" : telcom.telecomType
            })
        })

        const template = {
            "invoice": invoice,
            "patient": templatePat,
            "hcp": templateHcp,
            "formatDate": function () {
                return function (date, render) {
                    let format = render(date)
                    return moment(format).format("DD/MM/YYYY")
                }
            },
            "formatNumber": function () {
                return function (calcul, render) {
                    let termes = render(calcul).split(" ")
                    while (termes.length > 2) {
                        let first = Number(termes.shift())
                        let operateur = termes.shift()
                        let second = Number(termes.shift())

                        if (operateur == "+") {
                            termes.unshift(first + second)
                        } else if (operateur === "-") {
                            termes.unshift(first - second)
                        } else return "erreur dans le calcul"

                    }
                    return Number(termes[0]).toFixed(2) + " €"
                }
            },
            "justif": this.localize('pdf_justif', 'justif', this.language),
            "date": this.localize('pdf_date', 'date', this.language),
            "patCord": this.localize('pdf_patCord', 'patCord', this.language),
            "remboursPrest": this.localize('pdf_remboursPrest', 'remboursPrest', this.language),
            "honorPort": this.localize('pdf_honorPort', 'honorPort', this.language),
            "honorConv": this.localize('pdf_honorConv', 'honorConv', this.language),
            "deltaSupp": this.localize('pdf_deltaSupp', 'deltaSupp', this.language),
            "subTot": this.localize('pdf_subTot', 'subTot', this.language),
            "totOne": this.localize('pdf_totOne', 'totOne', this.language),
            "totFinal": this.localize('pdf_totFinal', 'totFinal', this.language),
            "totalACharge": totalACharge,
            "totalSuppl": totalSuppl,
            "totalConv": totalConv,
            "totalDelta": totalDelta,
            "jpegUrl": jpegUrl
        }


        const html = `
      <html>
          <head>
              <meta charset="utf-8">
              <title></title>
              <style>
                  .invoice-box {
                      max-width: 800px;
                      min-height:880px;
                      margin: auto;
                      padding: 30px;
                      border: 1px solid #eee;
                      box-shadow: 0 0 10px rgba(0, 0, 0, .15);
                      font-size: 16px;
                      line-height: 24px;
                      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
                      color: #555;
                  }
                  .invoice-box table {
                      width: 100%;
                      line-height: inherit;
                      text-align: left;
                  }
                  .p12 {width:12%;}
                  .p50 {width:50%;}
                  .bold {font-weight: bold;}
                  .invoice-box table td {
                      padding: 5px;
                      vertical-align: top;
                  }
                  td.first-col {
                  min-width: 33%;
                  }
                  .invoice-box table tr td.right {text-align: right;}
                  .invoice-box table tr.top table td.title {
                      font-size: 45px;
                      line-height: 45px;
                      color: #333;
                  }
                  .invoice-box table tr.information table td {padding-bottom: 40px;}
                  .invoice-box table tr.heading td {
                      background: #eee;
                      border-bottom: 1px solid #ddd;
                      font-weight: bold;
                  }
                  .invoice-box table tr.details td {padding-bottom: 20px;}
                  .invoice-box table tr.item td{border-bottom: 1px solid #eee;}
                  .invoice-box table tr.item.last td {
                      border-bottom: none;
                      font-weight: bold;
                  }
                  .invoice-box table tr.total td {font-weight: bold;}
                  .invoice-box table tr.total td:nth-child(2) {border-top: 2px solid #eee;}
                  .underline {border-bottom: 1px solid lightgrey;}
                  .underline-dotted {border-bottom: 1px dotted lightgrey;}
                  table.fact-details {
                      border: .5px solid lightgrey;
                      margin-top: 35px;
                  }
                  table.fact-details * {font-size: 12px}
                  td.minw30 {max-width: 30%;}
                  .fleft {
                      float: left;
                      clear: both;
                  }
                  .hidden {display: none;}
                  .txt-center {text-align: center;}
                  .lborder {
                      border-left: 1px solid lightgrey;
                      padding-left: 10px;
                  }
                  .uppercase {text-transform: uppercase !important;}
                  .capitalize {text-transform: capitalize;}
                  .txt-red {color: red;}
                  .mt20{margin-top: 20px;}
                  .mb10{margin-bottom: 10px;}
                  .mb20{margin-bottom:20px;}
                  .m0auto {margin: 0 auto;}
                  table.addr tr td:first-child {
                      border-bottom: 1px solid lightgrey;
                      text-align: right;
                      text-transform: uppercase;
                  }
                  table.addr tr td:nth-child(2) {
                      border-bottom: 1px dotted lightgrey;
                      text-transform: lowercase;
                      word-wrap: break-word;
                  }
                  .txt-underline {text-decoration:underline}
                  .title {font-weight:bold;text-decoration: underline; margin-bottom:15px;}
                  table.top-table {margin-bottom: 50px;}
              </style>
          </head>
          <body>
          <div class="invoice-box">
              <table class="toptable">
                  <tr class="top">
                      <td class="p50">
                          <h1>EATTEST</h1>
                          <h2 class="mb20">{{#patient}}
                              <div>{{firstName}} <span class="uppercase">{{lastName}}</span></div>
                              <div>NISS : {{ssin}}</div>
                          {{/patient}}</h2>
                          {{justif}} : {{invoice.invoiceReference}}<br />
                          {{date}} : {{#formatDate}}{{invoice.invoiceDate}}{{/formatDate}}
                     </td>
                     <td class="p50 txt-center">
                          <img src="{{jpegUrl}}" alt="barcode" />
                          <div class="txt-center">{{invoice.thirdPartyReference}}</div>
                          {{#invoice.printedDate}}
                              <div class="txt-center"><span class="txt-red">DUPLICATA</span></div>
                          {{/invoice.printedDate}}
                      </td>
                  </tr>
              </table>

              <table>
                  <tr>
                      <td class="p50">
                          {{#hcp}}
                              <div class="fleft bold">{{name}}</div>
                              <div class="fleft title">{{speciality}}</div>
                              <div class="block-addr">
                                  {{#addresses}}
                                      {{street}} {{houseNumber}} {{#postboxNumber}}b.{{postboxNumber}}{{/postboxNumber}}
                                      {{postalCode}} {{city}}
                                      <table class="addr">
                                          {{#telecoms}}
                                              <tr><td>{{telecomType}}</td><td><span class="hidden">:</span> {{telecomNumber}}</td></tr>
                                          {{/telecoms}}
                                          {{/addresses}}
                                          <tr><td>TVA/CBE</td><td><span class="hidden">:</span> {{cbe}}</td></tr>
                                          <tr><td>IBAN</td><td class="uppercase"><span class="hidden">:</span> {{bankAccount}}</td></tr>
                                      </table>
                              </div>
                          {{/hcp}}
                      </td>
                      <td class="lborder">
                          <div class="title">Coordonnées du patient</div>
                          {{#patient}}
                              <div>{{gender}}. {{firstName}} <span class="uppercase">{{lastName}}</span></div>
                              <div class="block-addr">
                              {{#addresses}}
                                  {{street}} {{houseNumber}} {{#postboxNumber}}b.{{postboxNumber}}{{/postboxNumber}}
                                  {{postalCode}} {{city}}
                                  <table class="mt20 addr">
                                  {{#telecoms}}
                                      <tr><td>{{telecomType}}</td><td><span class="hidden">:</span> {{telecomNumber}}</td></tr>
                                  {{/telecoms}}
                                  </table>
                              {{/addresses}}
                              </div>
                          {{/patient}}
                      </td>
                  </tr>
              </table>

              <table class="fact-details">
                  <tr class="heading">
                      <td class="minw30">{{remboursPrest}}</td>
                      <td class="p12">{{honorPort}}</td>
                      <td class="p12">{{honorConv}}</td>
                      <td class="p12">{{deltaSupp}}</td>
                  </tr>
                  {{#invoice.invoicingCodes}}
                      <tr class="item">
                          <td class="minw30"> {{unit}} {{code}} : {{label}}</td>
                          <td class="right">
                              {{#formatNumber}}{{patientIntervention}} + {{reimbursement}}{{/formatNumber}}
                          </td>
                          <td class="right">
                              {{#formatNumber}}{{conventionAmount}}{{/formatNumber}}
                          </td>
                          <td class="right">
                              {{#formatNumber}}{{totalAmount}} - {{conventionAmount}}{{/formatNumber}}
                          </td>
                      </tr>
                  {{/invoice.invoicingCodes}}
                  <tr class="item bold">
                      <td class="minw30">{{subTot}} :</td>
                      <td class="right">
                          {{#formatNumber}}{{totalACharge}}{{/formatNumber}}
                      </td>
                      <td class="right">
                          {{#formatNumber}}{{totalConv}}{{/formatNumber}}
                      </td>
                      <td class="right">
                          {{#formatNumber}}{{totalSuppl}}{{/formatNumber}}
                      </td>
                  </tr>
                  <tr class="item last">
                      <td class="minw30">{{totOne}}</td>
                      <td class="right">
                          {{#formatNumber}}{{totalSuppl}} - {{totalACharge}} + {{totalConv}}{{/formatNumber}}
                      </td>
                      <td class="right">

                      </td>
                      <td class="right">

                      </td>
                  </tr>

                  <tr class="total">
                      <td class="minw30">{{totFinal}}</td>
                      <td class="right">
                          {{#formatNumber}}{{totalACharge}} + {{totalSuppl}} - {{totalACharge}} + {{totalConv}}{{/formatNumber}}
                      </td>
                      <td class="right"></td>
                      <td class="right"></td>
                      <td class="right"></td>
                  </tr>
              </table>

              <table class="fact-details">
                  <tr>
                      <th>Total à payer</th>
                      <td class="right">{{#formatNumber}}{{totalACharge}} + {{totalSuppl}} - {{totalACharge}} + {{totalConv}}{{/formatNumber}}</td>
                  </tr>
                  <tr>
                      <th>Montant payé</th>
                      <td class="right">{{#formatNumber}}{{invoice.paid}}{{/formatNumber}}</td>
                  </tr>
                  <tr>
                      <th>Solde</th>
                      <td class="right">{{#formatNumber}}{{totalACharge}} + {{totalSuppl}} - {{totalACharge}} + {{totalConv}} - {{invoice.paid}}{{/formatNumber}}</td>
                  </tr>
              </table>
          </div>
          </body>
      </html>`

        this.api.pdfReport(mustache.render(html, template), {type: "doc-off-format", printer: 'regulations'})
            .then(({pdf: data, printed: printed}) => {
                if (!printed) {
                    let blob = new Blob([data], {type: 'application/pdf'})

                    let url = window.URL.createObjectURL(blob)

                    let a = document.createElement("a")
                    document.body.appendChild(a)
                    a.style = "display: none"

                    a.href = url
                    a.download = this.selectedInvoice.id + moment() + ".pdf"
                    a.click()
                    window.URL.revokeObjectURL(url)
                }
            }).then(() => {
            if (this.selectedInvoice)
                this.set("selectedInvoice.printedDate", moment().format("YYYYMMDD"))

            this.api.invoice().modifyInvoice(this.selectedInvoice)
                .then(invoice => this.api.register(invoice, 'invoice'))
                .then(invoice => {
                    this.api.tarification().getTarifications(new models.ListOfIdsDto({ids: invoice.invoicingCodes.map(tar => tar.tarificationId)})).then(nmcls =>
                        nmcls.map(nmcl => {
                            let sns = invoice.invoicingCodes.filter(n => n.tarificationId === nmcl.id) || null
                            if (sns && sns.length) {
                                sns.map(sn => {
                                    sn.prescriberNeeded = nmcl.needsPrescriber
                                    sn.isRelativePrestation = nmcl.hasRelatedCode
                                })
                            }
                        })
                    ).finally(() => this.updateGui(invoice))
                    console.log("saved:", invoice)
                })
        }).finally(() => this.set('isLoadingJustif', false))
    }

    varIsEattestClosedChanged() {
        this.set("isEattestClosed", this.selectedInvoice.sentMediumType === "eattest" && this.selectedInvoice.printedDate)
    }

    _cancelDialogOpen() {
        this.set("reason", "A")
        this.$["cancelDialog"].open()
    }

    _cancelEattest() {

        this.$["cancelDialog"].close()

        const reason = this.reason + ":" + (this.reasonOfCancel.find(reason => reason.id === this.reason).label[this.language])

        const url = "https://docs.google.com/forms/d/e/1FAIpQLSfUoc69iwFaTeOteXOaFHEghIv8SHLV5eZwOFRS0FJxVjzObQ/viewform?usp=pp_url&entry.1429469566=" + this.hcp.lastName + "&entry.156031164=" + this.hcp.firstName + "&entry.1335787920=" + this.hcp.nihii + "&entry.1193011163=" + this.user.email + "&entry.1773887602=" + this.selectedInvoice.thirdPartyReference + "&entry.802032397=" + reason
        window.open(url, "cancel")
    }

    _isSelectedInvoiceEattest() {
        return this.selectedInvoice && this.selectedInvoice.sentMediumType && this.selectedInvoice.sentMediumType === 'eattest'
    }

    _isSelectedInvoiceEfact() {
        return this.selectedInvoice && this.selectedInvoice.sentMediumType && this.selectedInvoice.sentMediumType === 'efact'
    }

    _isSelectedInvoicePaper() {
        return this.selectedInvoice && this.selectedInvoice.sentMediumType && this.selectedInvoice.sentMediumType === 'paper'
    }

    _isInvoiceClosedOrSelectedInvoiceEattest() {
        return this.selectedInvoice.sentMediumType === 'eattest' || this.isInvoiceClosed
    }

    _getAdressesBookInfo() {
        this.set('isLoadingLocations', true)
        this.api.fhc().Addressbookcontroller().searchOrgUsingGET(this.api.keystoreId, this.api.tokenId, this.api.credentials.ehpassword, '*' + this.searchOrgName + '*', this.locationType[this.selectedInvoice.encounterLocationNorm].location)
            .then(orgList => {
                this.set('organisationList', orgList)
                this.set('isLoadingLocations', false)
            })
    }

    searchLocations(e) {
        if (this.saveAdressTimeout) {
            clearTimeout(this.saveAdressTimeout)
        }
        this.getAdresses = () => {
            if (e.detail.value) {
                this.set("searchOrgName", e.detail.value)
                this._getAdressesBookInfo()
            }
        }
        this.saveAdressTimeout = setTimeout(this.getAdresses, 1000)
    }

    setLocation(e) {
        if (!(e && e.detail && e.detail.value)) return
        console.log("selection :", e.detail.value)
        this.set("selectedInvoice.encounterLocationName", e.detail.value.name)
        const regExp = new RegExp(/\W/, 'g')
        this.set("selectedInvoice.encounterLocationNihii", e.detail.value.ehp.replace(regExp, ""))
    }

    _hasInsurability() {
        return (this.patient && this.patient.insurabilities && !!this.patient.insurabilities.length)
    }

    isEattestError() {
        return (!this.isDetailNmcl) && this.errorMessage !== null
    }

    _invoiceDateIsToday() {
        return this.api.moment(this.selectedInvoice.invoiceDate).isSame(moment(), "day")
    }

    _isETarButtonDisabled() {
        const disabled = this.isLoadingValidation || this.isTarificationMcnError || !this.npi
        return disabled
    }

    _isJustifButtonDisabled() {
        return this.isLoadingJustif || !!((this._isSelectedInvoiceEattest() && (!this._invoiceDateIsToday() || !this.npi)) || (!this._isSelectedInvoiceEattest() && !((!this.isNmclVerified && (this.isTarificationError || this.isTarificationMcnError)) || this.isNmclVerified || this._isSpecialist())))
    }

    _switchBetweenMethodForJustifAndCreation() {
        this.calculateTotalOfInvoice()
        if (this._isSelectedInvoiceEattest() || (this._isSelectedInvoiceEfact() && Number(this.totalInvoice.patientIntervention) > 0) || (this._isSelectedInvoicePaper() && (Number(this.totalInvoice.patientIntervention) > 0 || Number(this.totalInvoice.reimbursement) > 0))) {
            this._prevalidateAndPrepareInvoiceForBatchSending()
        } else {
            this._validateAndPrepareInvoiceForBatchSending()
        }
    }

    _switchBetweenMethodForJustif() {
        if (this._isSelectedInvoiceEattest()) {
            this.eattest(this.selectedInvoice)
        } else {
            this._validateAndPrepareInvoiceForBatchSending()
        }
    }

    _filterThirdPartyJustitifications(inputData) {
        return _.filter(inputData, (v) => {
            return parseInt(v.id) !== 9
        })
    }

    _totalChanged(typedValue) {
        let v = Number(typedValue.detail.value || 0)
        if (isNaN(v)) {
            v = Number(this.activeNmclItem.reimbursement) + Number(this.activeNmclItem.patientIntervention)
        }
        if (!this.activeNmclItem || v === this.activeNmclItem.totalAmount) return
        this.set("activeNmclItem.doctorSupplement", Number((v || 0) - (Number(this.activeNmclItem.reimbursement) + Number(this.activeNmclItem.patientIntervention))).toFixed(2))
    }

    _generatePrintedDate(e) {
        e.stopPropagation()
        e.preventDefault()

        let invoice = this.invoices.find(iv => iv.id === e.target.dataset.item)
        const invoiceIndex = this.invoices.findIndex(iv => iv.id === e.target.dataset.item)

        invoice.printedDate = moment().format("YYYYMMDD")

        this.api.invoice().modifyInvoice(invoice)
            .then(invoice => this.api.register(invoice, 'invoice'))
            .then(invoice => {
                this.set("invoices." + invoiceIndex, invoice)
                this.updateGui(invoice, true)
            })
    }

    _cancelPrintedDate(e) {
        e.stopPropagation()
        e.preventDefault()

        let invoice = this.invoices.find(iv => iv.id === e.target.dataset.item)
        const invoiceIndex = this.invoices.findIndex(iv => iv.id === e.target.dataset.item)

        invoice.printedDate = null

        this.api.invoice().modifyInvoice(invoice)
            .then(invoice => this.api.register(invoice, 'invoice'))
            .then(invoice => {
                this.set("invoices." + invoiceIndex, invoice)
                this.updateGui(invoice, true)
            })
    }

    _paymentTypeChanged() {
        if (!this.selectedInvoice && this.selectedInvoice.paymentType) return
        if (this.selectedInvoice.paymentType === "wired") {
            this.set("selectedInvoice.paid", 0)
        }
    }

    _ifClosedButNotPrinted(item) {
        return item && !item.printedDate && !this._ifStatusDateExist(item.printedDate) && item.sentDate && item.sentMediumType === "eattest"
    }

    _isInvoiceEattest(item) {
        return item && item.sentMediumType === "eattest"
    }

    _isInvoiceEfact(item) {
        return item && item.sentMediumType === "efact"
    }

    getDMG(invoice) {
        if (!this.api.tokenId || this.isLoading) return
        this.set('isLoading', true)
        this.api.getUpdatedEdmgStatus(
            this.user,
            this.patient,
            Date.parse(invoice.invoiceDate),
            null,
            null,
            this.patient.insurabilities.find(ins => moment(ins.startDate).isSameOrBefore(moment())),//OA
            this.genInsAFF,//AFF
            true    // Bypass cache, force hit on fhc().Dmgcontroller().consultDmgUsingGET()
        ).then(edmgResp => {
            this.set('isLoading', false)
            this.set('consultDmgResp', edmgResp)
        })
    }

    getLabel() {
        if (this.selectedInvoice.careProviderType === "trainee") {
            return this.localize('train_nihii', 'NIHII trainee', this.language)
        } else {
            return this.localize('sup_train_nihii', 'NIHII supervisor', this.language)
        }

    }

    _getStatusTxt(item) {
        const statusOfInvoice = this._getStatusOfInvoice(item)
        console.log(item)
        return !_.get(item, 'sentDate', null) && !_.get(item, 'printedDate', null) && _.get(item, 'correctedInvoiceId', null) && _.get(statusOfInvoice, 'resent', 0) > 0 ? "A corriger" :
            !_.get(item, 'sentDate', null) && !_.get(item, 'printedDate', null) && !_.get(item, 'correctedInvoiceId', null) && _.get(statusOfInvoice, 'resent', 0) === 0 ? "En attente de finalisation" :
                !_.get(item, 'sentDate', null) && _.get(item, 'printedDate', null) ? "En attente d'envoi" :
                    _.get(item, "sentDate", null) && _.get(item, 'printedDate', null) && _.get(statusOfInvoice, 'canceled', 0) > 0 ? "Refusée" :
                        _.get(item, "sentDate", null) && _.get(item, 'printedDate', null) && _.get(statusOfInvoice, 'accepted', 0) > 0 && _.get(statusOfInvoice, 'pending', 0) === 0 && _.get(statusOfInvoice, 'resent', 0) === 0 && _.get(statusOfInvoice, 'canceled', 0) === 0 ? "Acceptée" :
                            _.get(item, "sentDate", null) && _.get(item, 'printedDate', null) && _.get(statusOfInvoice, 'canceled', 0) === 0 && _.get(statusOfInvoice, 'pending', 0) > 0 && _.get(statusOfInvoice, 'resent', 0) === 0 && _.get(statusOfInvoice, 'accepted', 0) === 0 ? "En cours" :
                                null
    }

    _getColorOfStatus(item) {
        const statusOfInvoice = this._getStatusOfInvoice(item)

        return !_.get(item, 'sentDate', null) && !_.get(item, 'printedDate', null) && _.get(item, 'correctedInvoiceId', null) && _.get(statusOfInvoice, 'resent', 0) > 0 ? "canceled" :
            !_.get(item, 'sentDate', null) && !_.get(item, 'printedDate', null) && !_.get(item, 'correctedInvoiceId', null) && _.get(statusOfInvoice, 'resent', 0) === 0 ? "pending" :
                !_.get(item, 'sentDate', null) && _.get(item, 'printedDate', null) ? "pending" :
                    _.get(item, "sentDate", null) && _.get(item, 'printedDate', null) && _.get(statusOfInvoice, 'canceled', 0) > 0 ? "canceled" :
                        _.get(item, "sentDate", null) && _.get(item, 'printedDate', null) && _.get(statusOfInvoice, 'accepted', 0) > 0 && _.get(statusOfInvoice, 'pending', 0) === 0 && _.get(statusOfInvoice, 'resent', 0) === 0 && _.get(statusOfInvoice, 'canceled', 0) === 0 ? "accepted" :
                            _.get(item, "sentDate", null) && _.get(item, 'printedDate', null) && _.get(statusOfInvoice, 'canceled', 0) === 0 && _.get(statusOfInvoice, 'pending', 0) > 0 && _.get(statusOfInvoice, 'resent', 0) === 0 && _.get(statusOfInvoice, 'accepted', 0) === 0 ? "ongoing" :
                                null
    }

    _getStatusOfInvoice(item) {
        const statusOfInvoice = {
            accepted: 0,
            pending: 0,
            resent: 0,
            canceled: 0
        }

        item.invoicingCodes.map(code => {
            _.get(code, 'accepted', null) ? statusOfInvoice.accepted++ : null
            _.get(code, 'pending', null) ? statusOfInvoice.pending++ : null
            _.get(code, 'resent', null) ? statusOfInvoice.resent++ : null
            _.get(code, 'canceled', null) ? statusOfInvoice.canceled++ : null
        })

        return statusOfInvoice
    }

    _formatPatientPaid(amount) {
        return amount && Number(amount).toFixed(2) || Number(0.00).toFixed(2)
    }

    _getPaymentType(paymentType) {
        return this.localize(paymentType, paymentType, this.language)
    }

    _toBeCorrected(item) {
        return _.get(item, 'correctiveInvoiceId', null)
    }

    _getCorrectiveInvoiceNumber(correctiveInvoiceId) {
        return _.get(_.get(this, 'invoices', []).find(inv => _.get(inv, 'id', null) === correctiveInvoiceId), 'invoiceReference', null)
    }

    _getCorrectiveInvoiceDate(correctiveInvoiceId) {
        return _.get(_.get(this, 'invoices', []).find(inv => _.get(inv, 'id', null) === correctiveInvoiceId), 'sentDate', null) ? this.api.moment(_.get(_.get(this, 'invoices', []).find(inv => _.get(inv, 'id', null) === correctiveInvoiceId), 'sentDate', null)).format('DD/MM/YYYY') : null
    }

    _isSpecialist() {
        return !!(_.get(this, 'hcp.nihii', null) && _.startsWith(_.get(this, 'hcp.nihii', null), "1", 0) && _.size(_.get(this, 'hcp.nihii', null)) === 11 && (_.get(this, 'hcp.nihii', null).substr(_.size(_.get(this, 'hcp.nihii', null)) - 3) >= 10))
    }
}

customElements.define(HtPatInvoicingDialog.is, HtPatInvoicingDialog)
