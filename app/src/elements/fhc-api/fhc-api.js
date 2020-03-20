import * as api from 'fhc-api/dist/fhcApi'

import {PolymerElement, html} from '@polymer/polymer';
class FhcApi extends PolymerElement {
  static get template() {
    return html`
        <style>
        </style>
`;
  }

  static get is() {
      return "fhc-api";
  }

  static get properties() {
      return {
          headers: {
              type: Object,
              value: { "Content-Type": "application/json",  "Authorization": "Basic: ZGU5ODcyYjUtNWNiMC00ODQ2LThjNGMtOThhMjFhYmViNWUzOlQwcEB6RmhjWnRm" }
          },
          host: {
              type: String
          }
      };
  }

  static get observers() {
      return ["refresh(headers, headers.*, host)"];
  }

  ready() {
      super.ready();

      if (this.host != null && this.headers != null) this.refresh();
  }

  refresh() {
      this.addressbookcontrollerfhc = new api.fhcAddressbookcontrollerApi(this.host, this.headers);
      this.consentcontrollerfhc = new api.fhcConsentcontrollerApi(this.host, this.headers);
      this.chaptercontrollerfhc = new api.fhcChaptercontrollerApi(this.host, this.headers);
      this.dmgcontrollerfhc = new api.fhcDmgcontrollerApi(this.host, this.headers);
      this.eattestcontrollerfhc = new api.fhcEattestcontrollerApi(this.host, this.headers);
      this.eattestv2controllerfhc = new api.fhcEattestvcontrollerApi(this.host, this.headers);
      this.ehboxcontrollerfhc = new api.fhcEhboxcontrollerApi(this.host, this.headers);
      this.efactcontrollerfhc = new api.fhcEfactcontrollerApi(this.host, this.headers);
      this.geninscontrollerfhc = new api.fhcGeninscontrollerApi(this.host, this.headers);
      this.hubcontrollerfhc = new api.fhcHubcontrollerApi(this.host, this.headers);
      this.recipecontrollerfhc = new api.fhcRecipecontrollerApi(this.host, this.headers);
      this.stscontrollerfhc = new api.fhcStscontrollerApi(this.host, this.headers);
      this.tarificationcontrollerfhc = new api.fhcTarificationcontrollerApi(this.host, this.headers);
      this.therlinkcontrollerfhc = new api.fhcTherlinkcontrollerApi(this.host, this.headers);
      this.rnconsultcontrollerfhc = new api.fhcConsultrncontrollerApi(this.host, this.headers);
      this.memberdatacontrollerfhc = new api.fhcMemberdatacontrollerApi(this.host, this.headers);

      this.dispatchEvent(new CustomEvent('refresh', {detail: {}}))
  }

  constructor() {
      super();
  }

    Addressbookcontroller() { return this.addressbookcontrollerfhc }
    Consentcontroller() { return this.consentcontrollerfhc }
    Chaptercontroller() { return this.chaptercontrollerfhc }
    Dmgcontroller() { return this.dmgcontrollerfhc }
    Eattestcontroller() { return this.eattestcontrollerfhc }
    Eattestv2controller() { return this.eattestv2controllerfhc }
    Efactcontroller() { return this.efactcontrollerfhc  }
    Ehboxcontroller() { return this.ehboxcontrollerfhc }
    Geninscontroller() { return this.geninscontrollerfhc }
    Hubcontroller() { return this.hubcontrollerfhc }
    Recipecontroller() { return this.recipecontrollerfhc }
    Stscontroller() { return this.stscontrollerfhc }
    Tarificationcontroller() { return this.tarificationcontrollerfhc }
    Therlinkcontroller() { return this.therlinkcontrollerfhc }
    RnConsultController(){return this.rnconsultcontrollerfhc}
    MemberDataController(){return this.memberdatacontrollerfhc}
}

customElements.define(FhcApi.is, FhcApi);
