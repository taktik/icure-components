import '../../../dynamic-form/dynamic-link.js'
import '../../../dynamic-form/dynamic-pills.js'
import '../../../ht-spinner/ht-spinner.js'
import '../../../../styles/dialog-style.js'
import '../../../../styles/buttons-style.js'
import * as models from 'icc-api/dist/icc-api/model/models'
import moment from 'moment/src/moment'
import _ from 'lodash/lodash'
import promiseLimit from 'promise-limit'


import {TkLocalizerMixin} from "../../../tk-localizer"
import {mixinBehaviors} from "@polymer/polymer/lib/legacy/class"
import {IronResizableBehavior} from "@polymer/iron-resizable-behavior"
import {PolymerElement, html} from '@polymer/polymer'

class HtPatFlatRateUtils extends TkLocalizerMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
    static get template() {
        return html`

`
    }

    static get is() {
        return 'ht-pat-flatrate-utils'
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
            patient: {
                type: Object,
                notify: true
            },
            language: {
                type: String
            },
            opened: {
                type: Boolean,
                value: false
            },
            tabs: {
                type: Number,
                value: 0
            },
            isLoading: {
                type: Boolean,
                value: false
            },
            insList: {
                type: Object,
                value: null
            },
            invoicedMonth: {
                type: Number,
                value: 201901
            }
        }
    }

    static get observers() {
        return ['apiReady(api,user,opened)']
    }

    ready() {
        super.ready()
        // this.addEventListener('iron-resize', () => this.onWidthChange());
        document.addEventListener('xmlHubUpdated', () => this.xmlHubListener())
    }

    _dateFormat(date) {
        return date ? this.api.moment(date).format('DD/MM/YYYY') : ''
    }

    _timeFormat(date) {
        return date ? this.api.moment(date).format(date > 99991231 ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY') : ''
    }

    _ageFormat(date) {
        return date ? this.api.getCurrentAgeFromBirthDate(date, (e, s) => this.localize(e, s, this.language)) : ''
    }

    _dateFormat2(date, fFrom, fTo) {
        return date ? this.api.moment(date, fFrom).format(fTo) : ''
    }

    _shortDateFormat(date, altDate) {
        return (date || altDate) && "'" + this.api.moment((date || altDate)).format('YY') || ''
    }

    _isElevated(CT) {
        return CT && CT.substring(2) !== '0' ? this._yesOrNo(true) : this._yesOrNo(false)
    }

    _trueOrUnknown(b) {
        return b ? this.localize('yes', 'yes', this.language) : '?'
    }

    _yesOrNo(b) {
        return b ? this.localize('yes', 'yes', this.language) : this.localize('no', 'no', this.language)
    }

    apiReady() {
        if (!this.api || !this.user || !this.user.id || !this.opened) return

        try {
        } catch (e) {
            console.log(e)
        }
    }

    attached() {
        super.attached()
        this.async(this.notifyResize, 1)
    }

    checkGenins(resList) {
        let limit = promiseLimit(100)

        return Promise.all(resList.map(res => {
            return limit(() => {
                const dStart = this.getRequestDateFromRes(res)
                //TODO: only check patients where needed: niss-ok, mh-contract-ok
                console.log("utils.getGeneralInsurabilityUsingGET on date", dStart)
                return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
                    this.cleanNiss(res.pat.ssin),
                    this.api.tokenId ? this.api.tokenId : this.api.tokenIdMH, this.api.tokenId ? this.api.keystoreId : this.api.keystoreIdMH, this.api.tokenId ? this.api.credentials.ehpassword : this.api.credentials.ehpasswordMH,
                    this.api.tokenId ? hcp.nihii : this.api.nihiiMH, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, this.api.tokenId ? "doctor" : "medicalhouse", dStart, null
                ).then(gi => {
                    res.genIns = gi
                    //TODO: check if gi differs from assu in res
                    res.genInsMatch = true
                    return res
                }))
            })

        }))
    }

    getRequestDateFromRes(res) {
        const date = new Date(), y = Number(res.invoicedMonth.toString().substr(0, 4)),
            m = Number(res.invoicedMonth.toString().substr(4, 2))
        return new Date(y, m, 1).getTime()
    }

    checkFlatrateData(pat, invoicedMonth) {
        //TODO: if multiple MHcontracts exist, check for overlap/validity of all
        //TODO: if multiple insurabilities extist, check for overlap/validity of all
        //Check if hcp or hcpParrent is flatrateInvoicing
        return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp =>
            hcp.parentId ? this.api.hcparty().getHealthcareParty(hcp.parentId) : hcp).then(hcp2 => {
            let res = {}
            res.hcp = hcp2
            res.pat = pat
            res.invoicedMonth = invoicedMonth
            //console.log("hcp flatrate ?", hcp2);
            if (hcp2.billingType && hcp2.billingType.toLowerCase() === "flatrate") {
                //PatientData:
                //  NISS
                res.nissCheck = this.checkNissValid(pat)
                //  Gender
                res.genderCheck = this.checkGender(pat)
                //  GenderNissMatch
                res.genderNissCheck = this.checkGenderNiss(pat, res.genderCheck, res.nissCheck)
                //  DeathDate
                res.aliveCheck = this.checkAlive(pat, invoicedMonth)
                //Insurability:
                res.insurabilityCheck = this.checkInsurability(pat, invoicedMonth)
                //  MUT
                res.mutCheck = this.checkMut(res.insurabilityCheck)
                //  CT12
                res.ct12Check = this.checkCT12(res.insurabilityCheck)
                //all contracts have startOfCoverage
                res.mhContractStart = this.checkMHContractStart(pat)
                //all contracts have end after start (or no end)
                res.mhContractEndBeforeStart = this.checkMHContractEndBeforeStart(pat)
                //MH Contract:
                res.mhContractCheck = this.checkMHContract(pat, invoicedMonth)
                //  MM NIHII
                res.mhCheck = this.checkMH(res.mhContractCheck)
                //  No Suspension
                res.mhSuspensionCheck = this.checkSuspension(res.mhContractCheck, invoicedMonth)
                //  Disciplines
                res.mhDisciplineCheck = this.checkMHDiscipline(res.mhContractCheck)
                // oveview
                res.flatrateStatus = this.checkMHStatus(res)
                //console.log("res", res, JSON.stringify(res));
                res.flatrateInfo = this.getFlatrateInfo(res)
            } else {
                // non flatrate
                res.flatrateStatus = {status: "ok-no-flatrate-mh", errors: []}
            }
            return res
        })
    }

    //This method is faster since no reload of HCP is done
    checkFlatrateDataWithHcp(hcp, pat, invoicedMonth) {
        //TODO: if multiple MHcontracts exist, check for overlap/validity of all
        //TODO: if multiple insurabilities extist, check for overlap/validity of all
        //Check if hcp or hcpParrent is flatrateInvoicing
        let res = {}
        res.hcp = hcp
        res.pat = pat
        res.invoicedMonth = invoicedMonth
        //console.log("hcp flatrate ?", hcp);
        if (hcp.billingType && hcp.billingType.toLowerCase() === "flatrate") {
            //PatientData:
            //  NISS
            res.nissCheck = this.checkNissValid(pat)
            //  Gender
            res.genderCheck = this.checkGender(pat)
            //  GenderNissMatch
            res.genderNissCheck = this.checkGenderNiss(pat, res.genderCheck, res.nissCheck)
            //  DeathDate
            res.aliveCheck = this.checkAlive(pat, invoicedMonth)
            //Insurability:
            res.insurabilityCheck = this.checkInsurability(pat, invoicedMonth)
            //  MUT
            res.mutCheck = this.checkMut(res.insurabilityCheck)
            //  CT12
            res.ct12Check = this.checkCT12(res.insurabilityCheck)
            //all contracts have startOfCoverage
            res.mhContractStart = this.checkMHContractStart(pat)
            //all contracts have end after start (or no end)
            res.mhContractEndBeforeStart = this.checkMHContractEndBeforeStart(pat)
            //MH Contract:
            res.mhContractCheck = this.checkMHContract(pat, invoicedMonth)
            //  MM NIHII
            res.mhCheck = this.checkMH(res.mhContractCheck)
            //  No Suspension
            res.mhSuspensionCheck = this.checkSuspension(res.mhContractCheck, invoicedMonth)
            //  Disciplines
            res.mhDisciplineCheck = this.checkMHDiscipline(res.mhContractCheck)
            // oveview
            res.flatrateStatus = this.checkMHStatus(res)
            //console.log("res", res, JSON.stringify(res));
            res.flatrateInfo = this.getFlatrateInfo(res)
        } else {
            // non flatrate
            res.flatrateStatus = {status: "ok-no-flatrate-mh", errors: []}
        }
        return res
    }

    getFlatrateInfo(res) {
        var inf = {}
        inf.invoicedMonth = res.invoicedMonth
        inf.LName = res.pat.lastName
        inf.FName = res.pat.firstName
        inf.ssin = res.pat.ssin
        inf.MUT = "---"
        inf.CT12 = res.ct12Check.valid ? res.ct12Check.ct12 : "---/---"
        if (this.getLastMHContract(res.pat)) {
            const contract = this.getLastMHContract(res.pat)
            inf.ABON = (contract.gp ? "M" : "N") + (contract.kine ? "K" : "N") + (contract.nurse ? "I" : "N")
            inf.DINS = contract.startOfContract ? contract.startOfContract : "--/--/----"
            inf.DFAC = contract.startOfCoverage ? contract.startOfCoverage : "--/--/----"
            inf.DDES = contract.endOfContract ? contract.endOfContract : "--/--/----"
            inf.DFIN = contract.endOfCoverage ? contract.endOfCoverage : "--/--/----"

        } else {
            inf.ABON = "NNN"
            inf.DINS = "--/--/----"
            inf.DFAC = "--/--/----"
            inf.DDES = "--/--/----"
            inf.DFIN = "--/--/----"
        }
        return inf
    }

    getInsurancesDataByIds(insurancesIds) {
        return new Promise(resolve => {
            this.api.insurance().getInsurances(new models.ListOfIdsDto({ids: insurancesIds}))
                .then(insurancesData => resolve(
                    _
                        .chain(insurancesData)
                        .map((i) => {
                            i.finalName = (i && i.name && i.name[this.language]) ? i.name[this.language] : i.name[(this.language === 'fr' ? 'nl' : 'fr')]
                            return i
                        })
                        .sortBy((i) => {
                            return i.code
                        })
                        .value()
                ))
        })
    }

    checkMHStatus(res) {
        return res.mhContractCheck.valid || !res.mhContractStart.valid || !res.mhContractEndBeforeStart.valid ? (
            res.insurabilityCheck && res.mutCheck.valid && res.ct12Check.valid && res.mhCheck.valid
            && res.mhContractStart.valid && res.mhContractEndBeforeStart.valid && res.mhSuspensionCheck.valid
            && res.mhDisciplineCheck.valid && res.nissCheck.valid &&
            res.genderCheck.valid && res.genderNissCheck.valid && res.aliveCheck.valid
                ? {status: "ok-flatrate-patient", errors: []} : {
                    status: "nok-flatrate-patient",
                    errors: this.mhStatusErrors(res)
                }
        ) : {status: "ok-no-flatrate-patient", errors: []}
    }

    mhStatusErrors(res) {
        let err = []
        if (!res.insurabilityCheck.valid) err.push(res.insurabilityCheck.error)
        if (res.insurabilityCheck.valid && !res.mutCheck.valid) err.push(res.mutCheck.error)
        if (res.insurabilityCheck.valid && !res.ct12Check.valid) err.push(res.ct12Check.error)
        if (!res.mhContractStart.valid) err.push(res.mhContractStart.error)
        if (!res.mhContractEndBeforeStart.valid) err.push(res.mhContractEndBeforeStart.error)
        if (!res.mhCheck.valid) err.push(res.mhCheck.error)
        if (res.mhCheck.valid && !res.mhSuspensionCheck.valid) err.push(res.mhSuspensionCheck.error)
        if (res.mhCheck.valid && !res.mhDisciplineCheck.valid) err.push(res.mhDisciplineCheck.error)
        if (!res.nissCheck.valid) err.push(res.nissCheck.error)
        if (!res.genderCheck.valid) err.push(res.genderCheck.error)
        if (res.genderCheck.valid && res.nissCheck.valid && !res.genderNissCheck.valid) err.push(res.genderNissCheck.error)
        if (!res.aliveCheck.valid) err.push(res.aliveCheck.error)
        return err
    }

    checkMHDiscipline(mhcCheck) {
        return mhcCheck.valid ?
            ((mhcCheck.medicalHouseContract.kine || mhcCheck.medicalHouseContract.gp || mhcCheck.medicalHouseContract.nurse) ?
                    {
                        valid: true,
                        discipline: (mhcCheck.medicalHouseContract.gp ? "1" : "0") + (mhcCheck.medicalHouseContract.kine ? "1" : "0") + (mhcCheck.medicalHouseContract.nurse ? "1" : "0"),
                        error: ''
                    }
                    : {valid: false, discipline: "000", error: 'no-discipline'}
            )
            : {valid: false, discipline: "", error: 'no-contract-for-period'}
    }

    checkSuspension(mhcCheck, invoicedMonth) {
        const month = (invoicedMonth * 100) + 1
        return mhcCheck.valid ?
            (mhcCheck.medicalHouseContract.startOfSuspension && mhcCheck.medicalHouseContract.startOfSuspension <= month
                && (!mhcCheck.medicalHouseContract.endOfSuspension || (mhcCheck.medicalHouseContract.endOfSuspension >= month)) ?
                    {valid: false, suspension: mhcCheck.medicalHouseContract, error: 'contract-suspended'}
                    : {valid: true, suspension: {}, error: ''}
            )
            : {valid: false, suspension: {}, error: 'no-contract-for-period'}
    }

    checkMH(mhcCheck) {
        return mhcCheck.valid ?
            (mhcCheck.medicalHouseContract.hcpId && mhcCheck.medicalHouseContract.hcpId !== '' ?
                    {valid: true, hcpId: mhcCheck.medicalHouseContract.hcpId, error: ''}
                    : {valid: false, hcpId: '', error: 'mh-hcpId-absent-or-invalid'}
            )
            : {valid: false, hcpId: '', error: 'no-contract-for-period'}
    }

    checkMHContractStart(pat) {
        if (pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0) {
            const mhcList = pat.medicalHouseContracts.filter(mhc => !mhc.startOfCoverage)
            if (mhcList && mhcList.length > 0) {
                return {valid: false, error: 'contract-missing-start'}
            } else {
                return {valid: true, error: ''}
            }
        } else {
            return {valid: true, error: ''}
        }
    }

    checkMHContractEndBeforeStart(pat) {
        if (pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0) {
            const mhcList = pat.medicalHouseContracts.filter(mhc => mhc.startOfCoverage && mhc.endOfCoverage && (mhc.endOfCoverage < mhc.startOfCoverage))
            if (mhcList && mhcList.length > 0) {
                return {valid: false, error: 'contract-end-before-start'}
            } else {
                return {valid: true, error: ''}
            }
        } else {
            return {valid: true, error: ''}
        }
    }

    checkMHContract(pat, invoicedMonth) {
        //invoicedmonth => yyyyMM => 201909 => (201909 * 100) + 1 = 20190901
        const month = (invoicedMonth * 100) + 1
        if (pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0) {
            const mhcList = pat.medicalHouseContracts.filter(mhc =>
                mhc.startOfCoverage && mhc.startOfCoverage <= month && (!mhc.endOfCoverage || (mhc.endOfCoverage >= month)))
            if (mhcList && mhcList.length > 0) {
                return {valid: true, medicalHouseContract: mhcList[0], error: ''}
            } else {
                return {valid: false, medicalHouseContract: null, error: 'no-contract-for-period'}
            }
        } else {
            return {valid: false, medicalHouseContract: null, error: 'no-contracts'}
        }
    }

    getLastMHContract(pat) {
        if (pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0) {
            const mhcList = _.orderBy(pat.medicalHouseContracts, ['startOfCoverage'], ['desc'])
            return mhcList[0]
        } else {
            return null
        }
    }

    checkMut(insCheck) {
        return insCheck.valid ?
            (insCheck.insurability.insuranceId && insCheck.insurability.insuranceId !== '' ?
                    {valid: true, insuranceId: insCheck.insurability.insuranceId, error: ''}
                    : {valid: false, insuranceId: '', error: 'insuranceId-absent-or-invalid'}
            )
            : {valid: false, ct12: '', error: 'no-ins-for-period'}
    }

    checkCT12(insCheck) {
        return insCheck.valid ?
            (insCheck.insurability.parameters && insCheck.insurability.parameters.tc1
                && insCheck.insurability.parameters.tc1.length === 3 && insCheck.insurability.parameters.tc2 && insCheck.insurability.parameters.tc2.length === 3 ?
                    {
                        valid: true,
                        ct12: insCheck.insurability.parameters.tc1 + insCheck.insurability.parameters.tc2,
                        error: ''
                    }
                    : {valid: false, ct12: '', error: 'tc1-tc2-absent-or-invalid'}
            )
            : {valid: false, ct12: '', error: 'no-ins-for-period'}
    }

    checkInsurability(pat, invoicedMonth) {
        //invoicedmonth => yyyyMM => 201909 => (201909 * 100) + 1 = 20190901
        const month = (invoicedMonth * 100) + 1
        if (pat.insurabilities && pat.insurabilities.length > 0) {
            const insList = pat.insurabilities.filter(ins =>
                ins.startDate && ins.startDate <= month && (!ins.endDate || (ins.endDate >= month)))
            if (insList && insList.length > 0) {
                return {valid: true, insurability: insList[0], error: ''}
            } else {
                return {valid: false, insurability: null, error: 'no-ins-for-period'}
            }
        } else {
            return {valid: false, insurability: null, error: 'no-insurabilities'}
        }
    }

    checkAlive(pat, invoicedMonth) {
        const month = (invoicedMonth * 100) + 1
        return pat.dateOfDeath && (pat.dateOfDeath <= month) ? {
            valid: false,
            dateOfDeath: pat.dateOfDeath,
            error: 'patient-deceased'
        } : {valid: true, dateOfDeath: 0, error: ''}
    }

    checkGender(pat) {
        return pat.gender && (pat.gender === 'male' || pat.gender === 'female') ? {
            valid: true,
            error: ''
        } : {valid: false, error: 'gender-invalid'}
    }

    checkNissValid(pat) {
        return (pat.ssin && pat.ssin !== "") ? (pat.ssin.length === 11 ? {valid: true, error: ''} : {
            valid: false,
            error: 'niss-invalid'
        }) : {valid: false, error: 'niss-absent'}
    }

    checkGenderNiss(pat, genderCheck, nissCheck) {
        if (genderCheck.valid && nissCheck.valid) {
            const genderDigit = pat.ssin.substr(8, 1)
            return (genderDigit % 2 === 0 && pat.gender === 'female') || (genderDigit % 2 !== 0 && pat.gender === 'male') ? {
                valid: true,
                error: ''
            } : {valid: false, error: 'gender-or-niss-not-match'}
        } else {
            return {valid: false, error: 'gender-or-niss-invalid'}
        }
    }

    _getGeninsHistory() {
        this.set("isLoading", true)
        let aMonths = []
        let i
        for (i = 0; i < 24; i++) {
            aMonths.push(moment().startOf('month').subtract(i, 'month'))
        }
        this.set("insList", null)
        let insList = []
        Promise.all(aMonths.map(m => this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => this.api.fhc().Geninscontroller().getGeneralInsurabilityUsingGET(
            this.cleanNiss(this.patient.ssin),
            this.api.tokenId ? this.api.tokenId : this.api.tokenIdMH, this.api.tokenId ? this.api.keystoreId : this.api.keystoreIdMH, this.api.tokenId ? this.api.credentials.ehpassword : this.api.credentials.ehpasswordMH,
            this.api.tokenId ? hcp.nihii : this.api.nihiiMH, this.api.isMH ? this.api.MHContactPersonSsin : hcp.ssin, this.api.isMH ? this.api.MHContactPersonName : hcp.lastName + ' ' + hcp.firstName, this.api.tokenId ? "doctor" : "medicalhouse", m.format('x'), null
            ))
        )).then(aRes => {
            aRes.map(res => {
                insList.push(res)
                //console.log(res);
            })
            this.set("insList", insList)
            console.log("insList", JSON.stringify(insList))
            this.set("isLoading", false)
        }).finally(this.set("isLoading", false))
    }

    cleanNiss(niss) {
        return niss.replace(/ /g, "").replace(/-/g, "").replace(/\./g, "").replace(/_/g, "").replace(/\//g, "")
    }

    getForfaitAmountOnDate(date) {
        const amounts = this.getForfaitAmounts()
        let amount = amounts.find(am => am.startDate <= date && (!am.endDate || am.endDate >= date))

        return amount
    }

    getForfaitAmounts() {
        const propRegStatus = this.user.properties.find(p => p.type && p.type.identifier === 'org.taktik.icure.user.Forfait.Amounts') ||
            (this.user.properties[this.user.properties.length] = {
                type: {identifier: 'org.taktik.icure.user.Forfait.Amounts'},
                typedValue: {type: 'JSON', stringValue: '{\"amounts\":[]}'}
            })
        let amounts = {}
        if (propRegStatus && propRegStatus.typedValue) {
            amounts = JSON.parse(propRegStatus.typedValue.stringValue)
        }
        return amounts.amounts ? amounts.amounts : null
    }


    getPatientInvoices(pat) {
        return this.api.invoice().findBy(this.user.healthcarePartyId, pat).then(invoices => invoices)
    }

    _getInsurancesDataByIds(insurancesIds) {
        return new Promise(resolve => {
            this.api.insurance().getInsurances(new models.ListOfIdsDto({ids: insurancesIds}))
                .then(insurancesData => resolve(
                    _
                        .chain(insurancesData)
                        .map((i) => {
                            i.finalName = (i && i.name && i.name[this.language]) ? i.name[this.language] : i.name[(this.language === 'fr' ? 'nl' : 'fr')]
                            return i
                        })
                        .sortBy((i) => {
                            return i.code
                        })
                        .value()
                ))
        })
    }

    getFlatrateInvoiceMessages() {
        return this.api.getRowsUsingPagination(
            (key, docId) =>
                this.api.message().findMessagesByTransportGuid('MH:FLATRATE:INVOICING-BATCH-ZIP', null, key, docId, 1000)
                    .then(pl => {
                        return {
                            rows: _.filter(pl.rows, m => {
                                return m
                                    && _.get(m, 'fromHealthcarePartyId', false) === this.user.healthcarePartyId
                                    && _.get(m, "recipients", []).indexOf(this.user.healthcarePartyId) > -1
                                    && parseInt(_.get(m, "metas.batchExportTstamp", 0))
                                    && parseInt(_.size(_.get(m, "invoiceIds", [])))
                            }),
                            nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                            nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                            done: !pl.nextKeyPair
                        }
                    })
                    .catch(() => {
                        return Promise.resolve()
                    })
        ).then(messages => messages)
    }

    createInvoice(pat, date) {
        return this.getValorisation(date).then(valorisation => this._createMedicalHousePatientInvoice(pat, valorisation, date))
    }

    _createMedicalHousePatientInvoice(pat, valorisation, date) {
        pat.finalMedicalHouseContracts = pat.medicalHouseContracts.filter(mhc => mhc.startOfCoverage <= date && (mhc.endOfCoverage >= date || !mhc.endOfCoverage))[0]
        pat.finalInsurability = pat.insurabilities.filter(ins => ins.startDate <= date && (ins.endDate >= date || !ins.endDate))[0]
        const codesList = valorisation.valorisations
        const originalInvoicingCodes = codesList.filter(code =>
            parseFloat(code.price) && (
                (code.flatRateType === "physician" && pat.finalMedicalHouseContracts.gp === true) ||
                (code.flatRateType === "nurse" && pat.finalMedicalHouseContracts.nurse === true) ||
                (code.flatRateType === "physiotherapist" && pat.finalMedicalHouseContracts.kine === true)
            )
        )
        _.assign(pat, {
            invoicingCodes: _.compact(originalInvoicingCodes).map(val => ({
                code: val.code,
                tarificationId: "INAMI-RIZIV|" + val.code + "|1.0",
                label: _.get(val, "label." + this.language, ""),
                totalAmount: Number(_.get(val, "price", 0)),
                reimbursement: Number(_.get(val, "price", 0)),
                patientIntervention: Number(0.00).toFixed(2),
                doctorSupplement: Number(0.00).toFixed(2),
                units: 1,
                archived: false,
                canceled: false,
                accepted: false,
                pending: true,
                resent: false,
                lost: false,
                dateCode: parseInt(_.get(val, "valorisationMonth", 0)) || null,
                id: this.api.crypto().randomUuid(),
                logicalId: this.api.crypto().randomUuid()
            }))
        })
        let insParent = {}
        return this._getInsurancesDataByIds([pat.finalInsurability.insuranceId])
            .then(ins => this._getInsurancesDataByIds([_.get(ins, "[0].parent")]))
            .then(insP => {
                insParent = _.get(insP, "[0]")
                return this.api.crypto().extractDelegationsSFKs(pat, _.get(this, "user.healthcarePartyId"))
            })
            .then(secretForeignKeys => this.api.invoice().appendCodes(this.user.id, "patient", "cdrom", (pat.finalInsurability && pat.finalInsurability.insuranceId ? pat.finalInsurability.insuranceId : ''), secretForeignKeys.extractedKeys.join(","), null, (1), pat.invoicingCodes))
            .then(invoices => this.api.invoice().newInstance(this.user, pat, invoices[0]))
            .then(inv => this.api.invoice().createInvoice(inv, 'invoice:' + _.get(this, "user.healthcarePartyId") + ':' + this.getChangeParentCode306(insParent && insParent.code ? insParent.code : '000') + ':'))
            .then(inv => this.api.register(inv, 'invoice'))
            .then(inv => this.api.message().newInstance(this.user).then(newMessageInstance => ([inv, newMessageInstance])))
            .then(([inv, newMessageInstance]) => this.api.message().createMessage(_.merge(newMessageInstance,
                {
                    transportGuid: "MH:FLATRATE:INVOICE-TO-ADD",
                    recipientsType: "org.taktik.icure.entities.HealthcareParty",
                    recipients: [_.get(this, "user.healthcarePartyId")],
                    toAddresses: [_.get(this, "user.healthcarePartyId")],
                    metas: {
                        invoiceDate: _.get(inv, "invoiceDate"),
                        exportedDate: _.get(inv, "invoiceDate"),
                        invoiceRecipientId: _.trim(_.get(inv, "recipientId")),
                        invoiceReference: _.trim(_.get(inv, "invoiceReference")),
                    },
                    subject: "MH: Flatrate invoice to add upon next run",
                    invoiceIds: [_.get(inv, "id")]
                }
            )).then(() => inv))
    }

    getChangeParentCode306(code) {
        return code === "306" ? "300" : code
    }

    getValorisation(valorisationMonth) {
        return this.api.hcparty().getHealthcareParty(this.user.healthcarePartyId).then(hcp => {
            return {
                month: parseInt(valorisationMonth),
                valorisations: _.merge(
                    [
                        {code: "109616", price: 0.00, flatRateType: "physician"},           // Doctor
                        {code: "509611", price: 0.00, flatRateType: "physiotherapist"},     // Kine
                        {code: "409614", price: 0.00, flatRateType: "nurse"}                // Nurse
                    ],
                    _.compact(
                        _.chain(_.get(hcp, "flatRateTarifications", []))
                            .map(singleNomenclature => {
                                const valorisationObject = _.head(
                                    _.orderBy(
                                        _
                                            .chain(singleNomenclature.valorisations)
                                            .filter(singleValorisation => {
                                                return (
                                                    !!singleValorisation
                                                    && parseFloat(_.get(singleValorisation, "reimbursement", 0))
                                                    && (
                                                        (moment(_.trim(_.get(singleValorisation, "startOfValidity", "0")), "YYYYMMDD").startOf('month')).isBefore(moment(_.trim(valorisationMonth), "YYYYMMDD").startOf('month')) ||
                                                        (moment(_.trim(_.get(singleValorisation, "startOfValidity", "0")), "YYYYMMDD").startOf('month')).format("YYYYMMDD") === moment(_.trim(valorisationMonth), "YYYYMMDD").startOf('month').format("YYYYMMDD")
                                                    )
                                                )
                                            })
                                            .value(),
                                        ["startOfValidity"],
                                        ["desc"]
                                    )
                                )
                                return parseFloat(_.get(valorisationObject, "reimbursement", 0)) ? {
                                    code: _.trim(_.get(singleNomenclature, "code")),
                                    label: _.get(singleNomenclature, "label"),
                                    flatRateType: _.trim(_.get(singleNomenclature, "flatRateType")),
                                    price: parseFloat(_.get(valorisationObject, "reimbursement", 0)),
                                    valorisationMonth: parseInt(valorisationMonth)
                                } : false
                            })
                            .value()
                    )
                )
            }
        })
    }

    getNonInvoicedMonths(pat) {
        //const flatRateUtil = this.$.flatrateUtils;
        let invoices = []
        let insurancesData = []
        let messages = []
        this.getFlatrateInvoiceMessages().then(msgs => {
            messages = msgs
            console.log("messageCount", messages.length)
            console.log("messages", messages)
            return this.getPatientInvoices(pat)
        }).then(invs => {
            invoices = invs.filter(inv => inv.sentMediumType === "cdrom")
            if (pat && pat.medicalHouseContracts && pat.medicalHouseContracts.length > 0) {
                const mhc = _.orderBy(pat.medicalHouseContracts, ['startOfContract'], ['asc'])[0]
                const startOfCoverage = mhc.startOfCoverage
                const endOfCoverage = mhc.endOfCoverage ? mhc.endOfCoverage : parseInt(moment().startOf('month').format("YYYYMMDD"))
                const startMoment = this.api.moment(startOfCoverage)
                const curMoment = this.api.moment(endOfCoverage)
                const endMoment = this.api.moment(endOfCoverage)
                let aMonths = []
                while (startMoment <= curMoment) {
                    aMonths.push({date: this.api.moment(parseInt(curMoment.format('YYYYMMDD'))), data: {}})
                    curMoment.subtract(1, 'month')
                }

                if (invoices) {
                    aMonths.forEach(m => {
                        m.medicalHouseContract = mhc
                        const dateCode = parseInt(m.date.format("YYYYMMDD"))

                        const invs = invoices.filter(inv => inv.invoicingCodes.filter(ic => ic.dateCode === dateCode).length > 0)
                        const invsClone = []
                        invs.forEach(inv => {
                            inv.invoicingCodes.forEach(ic => {
                                ic.status = (ic.canceled ? "canceled " : "") + (ic.accepted ? "accepted " : "") + (ic.pending ? "pending " : "") + (ic.resent ? "resent " : "") + (ic.lost ? "lost " : "")
                                ic.group = ic.dateCode + "/" + ic.status
                            })
                            const invClone = _.cloneDeep(inv)
                            //TODO: get display values
                            //Send Date/envoi
                            //inv.DateEnvoi = this.api.moment(inv.invoiceDate).format("DD/MM/YYYY");
                            //Mut

                            //get all invoicingcode groups : dateCode-status
                            const icGroups = _.uniq(invClone.invoicingCodes.filter(ic => ic.dateCode === dateCode).map(ic => ic.group))

                            icGroups.forEach(icGroup => {
                                console.log("icGroup", icGroup)
                                //m, k, i
                                const invCloneBis = _.cloneDeep(invClone)
                                // invCloneBis.m = inv.invoicingCodes.find(ic => ic.code === "109616" && ic.group === icGroup);
                                // invCloneBis.k = inv.invoicingCodes.find(ic => ic.code === "509611" && ic.group === icGroup);
                                // invCloneBis.i = inv.invoicingCodes.find(ic => ic.code === "409614" && ic.group === icGroup);
                                // invCloneBis.mki = (invCloneBis.m ? "M" : "N") + (invCloneBis.k ? "K" : "N") + (invCloneBis.i ? "I" : "N");
                                // invCloneBis.icCount = inv.invoicingCodes.filter(ic => ic.code === "109616" && ic.dateCode === dateCode).length;
                                //
                                // //Status
                                // const icode = invCloneBis.m ? invCloneBis.m : invCloneBis.k ? invCloneBis.k : invCloneBis.i ? invCloneBis.i : {canceled: false, accepted: false, pending: false, resent: false, lost: false, status: ""};
                                // console.log("icode", dateCode, icode);
                                // invCloneBis.status = icode.status;//(icode.canceled ? "canceled " : "") + (icode.accepted ? "accepted " : "") + (icode.pending ? "pending " : "") + (icode.resent ? "resent " : "") + (icode.lost ? "lost " : "");
                                // invCloneBis.status = invCloneBis.status === "" ? "---" : invCloneBis.status;
                                // //reference
                                // //reason/error
                                // invCloneBis.comment = invCloneBis.error ? invCloneBis.error : "";
                                //
                                // //link with messages
                                // invCloneBis.messages = messages.filter(msg => msg.invoiceIds.includes(invCloneBis.id));
                                // invCloneBis.DateEnvoi = invCloneBis.messages && invCloneBis.messages.length > 0 ? this.api.moment(parseInt(invCloneBis.messages[0].metas.exportedDate)).format("MM/YYYY") : "--/----";
                                invsClone.push(invCloneBis)
                            })
                        })
                        m.data.invoices = invsClone
                    })
                }
                aMonths.forEach(m => {
                    const dateCode = parseInt(m.date.format("YYYYMMDD"))
                    m.dateCode = dateCode
                })
                return aMonths.filter(m => !(m.data.invoices && m.data.invoices.length > 0))
                //console.log(JSON.stringify(aMonths));
            } else {
                return []
            }
        })
    }

    _OLD_flagInvoicesToAddFromTimelineAsAdded(exportDate) {

        // Old method, do NOT use: this one also deletes invoices which is wrong

        let foundMessages = []
        let promMessages = Promise.resolve([])
        let promInvoices = Promise.resolve([])

        return this.getMessagesOfInvoicesToAddFromTimelineByMaxExportDate(exportDate)
            .then(x => foundMessages = x)
            .then(() => _.chain(foundMessages).map("invoiceIds").flatten().compact().uniq().value())
            .then(invoiceIds => !_.size(invoiceIds) ? null : invoiceIds.map(invoiceId => {
                promInvoices = promInvoices.then(promisesCarrier => !_.trim(invoiceId) ? Promise.resolve() : this.api.invoice().deleteInvoice(invoiceId).then(x => _.concat(promisesCarrier, x)).catch(() => Promise.resolve()))
            }))
            .then(() => foundMessages.map(msg => {
                promMessages = promMessages.then(promisesCarrier => !_.trim(_.get(msg, "id", "")) ? Promise.resolve() : this.api.message().modifyMessage(_.merge(msg, {transportGuid: "MH:FLATRATE:INVOICE-GOT-ADDED"})).then(x => _.concat(promisesCarrier, x)).catch(() => Promise.resolve()))
            }))
            .catch(() => Promise.resolve())
    }

    getMessagesOfInvoicesToAddFromTimelineByMaxExportDate(exportDate) {

        const userHcpId = _.trim(_.get(this, "user.healthcarePartyId"))

        return this.api.getRowsUsingPagination(
            (key, docId) =>
                this.api.message().findMessagesByTransportGuid('MH:FLATRATE:INVOICE-TO-ADD', null, key, docId, 1000)
                    .then(pl => {
                        return {
                            rows: _.filter(pl.rows, m => {
                                const invoiceDate = parseInt(_.get(m, "metas.invoiceDate")) || parseInt(moment().format('YYYYMMDD'))
                                return !!m
                                    && _.trim(_.get(m, 'fromHealthcarePartyId', false)) === userHcpId
                                    && _.get(m, "recipients", []).indexOf(userHcpId) > -1
                                    && !!_.size(_.get(m, "invoiceIds", []))
                                    && invoiceDate && parseInt(invoiceDate) <= (parseInt(exportDate) || 0)
                            }),
                            nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
                            nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
                            done: !pl.nextKeyPair
                        }
                    })
                    .catch(() => Promise.resolve())
        ).catch(() => Promise.resolve())

    }

    getInvoicesToAddFromTimelineByMaxExportDate(exportDate) {

        return this.getMessagesOfInvoicesToAddFromTimelineByMaxExportDate(exportDate)
            .then(foundMessages => _.chain(foundMessages).map("invoiceIds").flatten().compact().uniq().value())
            .then(invoiceIds => !_.size(invoiceIds) ? null : this.api.invoice().getInvoices({ids: invoiceIds}))
            .then(invoices => (!_.size(invoices) || !_.trim(_.get(invoices, "[0].id"))) ? [] : _.filter(invoices, it => !_.trim(_.get(it, "sentDate"))))
            .catch(() => Promise.resolve())

    }

    flagInvoicesToAddFromTimelineAsAdded(exportDate) {
        let promMessages = Promise.resolve([])
        // previous "transportGuid" = MH:FLATRATE:INVOICE-TO-ADD
        return this.getMessagesOfInvoicesToAddFromTimelineByMaxExportDate(exportDate)
            .then(foundMessages => foundMessages.map(msg => {
                promMessages = promMessages.then(promisesCarrier => !_.trim(_.get(msg, "id", "")) ?
                    Promise.resolve() :
                    this.api.message().modifyMessage(_.merge(msg, {transportGuid: "MH:FLATRATE:INVOICE-GOT-ADDED"}))
                        .then(x => _.concat(promisesCarrier, x))
                        .catch(() => _.concat(promisesCarrier, {}))
                )
            }))
            .catch(() => Promise.resolve())
    }

}

customElements.define(HtPatFlatRateUtils.is, HtPatFlatRateUtils)
