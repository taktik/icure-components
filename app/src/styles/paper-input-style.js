const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="paper-input-style">
    <template>
		<style is="custom-style">
			:host {
				--paper-font-caption_-_line-height: 16px;
			}
            paper-input, paper-input-container {
				--paper-input-container-focus-color: var(--app-secondary-color)!important;
				--paper-input-container: {
					padding: 0;
					height: 40px;
					width: 100%;
					box-sizing: border-box;
				};

				--paper-input-container-input: {
					height: 22px;
					font-size: var(--font-size-normal);
					line-height: var(--font-size-normal);
					padding: 4px 8px 0;
					padding-top: 4px;
					box-sizing: border-box;
					background: var(--app-input-background-color);
					border-radius: 4px 4px 0 0;
				};

                --paper-input-container-label-floating: {
                    font-size: var(--font-size-large);
                    padding: 0 12px;
                    height: 15px;
                    line-height: 11px;
                    box-sizing: border-box;
					overflow: visible;
                };

				--paper-input-container-underline-disabled: {
					border-bottom-color: var(--app-text-color-disabled);
				};

				--paper-input-container-disabled: {
					opacity: 1;
				};

				--paper-input-suffix: {
					background: var(--app-input-background-color);
					border-radius: 0 3px 0 0;
					height: 22px;
					line-height: 20px;
				};

                --paper-input-container-label: {
                    z-index: 2;
                };
			}


			paper-input[disabled] label, paper-input-container[disabled] label {
				font-style: italic;
				color: var(--app-text-color-disabled);
			}

			paper-input iron-input{
				box-sizing: border-box;
			}

			paper-input-container .input-wrapper {
				height: 22px;
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
        </style>
    </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
