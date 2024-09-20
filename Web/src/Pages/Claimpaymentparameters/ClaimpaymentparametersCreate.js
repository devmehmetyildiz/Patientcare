import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT } from '../../Utils/Constants'

export default class ClaimpaymentparametersCreate extends Component {

    PAGE_NAME = "ClaimpaymentparametersCreate"

    componentDidMount() {
        const { GetCostumertypes } = this.props
        GetCostumertypes()
    }

    render() {
        const { Costumertypes, Claimpaymentparameters, Profile, history, closeModal } = this.props

        const t = Profile?.i18n?.t

        const Costumertypesoptions = (Costumertypes.list || []).filter(u => u.Isactive).map(type => {
            return { key: type.Uuid, text: type.Name, value: type.Uuid }
        })

        const Claimpaymenttypes = [
            { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
            { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
            { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
        ]

        const selectedtype = this.context.formstates[`${this.PAGE_NAME}/Type`]
        const isSelectedtype = validator.isNumber(selectedtype)

        return (
            Claimpaymentparameters.isLoading ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Claimpaymentparameters"}>
                                <Breadcrumb.Section >{t('Pages.Claimpaymentparameters.Page.Header')}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{t('Pages.Claimpaymentparameters.Page.CreateHeader')}</Breadcrumb.Section>
                        </Headerbredcrump>
                        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <Form.Group widths={'equal'}>
                                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpaymentparameters.Label.Type')} name="Type" options={Claimpaymenttypes} formtype='dropdown' />
                            </Form.Group>
                            {isSelectedtype
                                ? <React.Fragment>
                                    <Form.Group widths={'equal'}>
                                        <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpaymentparameters.Label.Costumertype')} name="CostumertypeID" options={Costumertypesoptions} formtype='dropdown' />
                                        <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpaymentparameters.Label.Patientclaimpaymentperpayment')} name="Patientclaimpaymentperpayment" type='number' min={0} max={999999} step="0.01" />
                                    </Form.Group>
                                    <Form.Group widths={'equal'}>
                                        <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpaymentparameters.Label.Perpaymentkdvpercent')} name="Perpaymentkdvpercent" type='number' min={0} max={999999} step="0.01" />
                                        <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpaymentparameters.Label.Perpaymentkdvwithholdingpercent')} name="Perpaymentkdvwithholdingpercent" type='number' min={0} max={999999} step="0.01" />
                                    </Form.Group>
                                </React.Fragment>
                                : null}
                        </Form>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={"/Claimpaymentparameters"}
                            buttonText={t('Common.Button.Goback')}
                        />
                        <Submitbutton
                            isLoading={Claimpaymentparameters.isLoading}
                            buttonText={t('Common.Button.Savepreview')}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                </Pagewrapper >
        )
    }


    handleSubmit = (e) => {
        e.preventDefault()
        const { AddClaimpaymentparameters, history, fillClaimpaymentparameternotification, Profile, closeModal } = this.props
        const t = Profile?.i18n?.t
        const data = this.context.getForm(this.PAGE_NAME)
        let errors = []
        if (!validator.isNumber(data.Type)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpaymentparameters.Page.Header'), description: t('Pages.Claimpaymentparameters.Messages.TypeRequired') })
        }
        if (!validator.isUUID(data.CostumertypeID)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpaymentparameters.Page.Header'), description: t('Pages.Claimpaymentparameters.Messages.CostumertypeRequired') })
        }
        if (!validator.isNumber(data.Patientclaimpaymentperpayment)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpaymentparameters.Page.Header'), description: t('Pages.Claimpaymentparameters.Messages.PerpaymentRequired') })
        }
        if (!validator.isNumber(data.Perpaymentkdvpercent)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpaymentparameters.Page.Header'), description: t('Pages.Claimpaymentparameters.Messages.KdvpercentRequired') })
        }
        if (!validator.isNumber(data.Perpaymentkdvwithholdingpercent)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpaymentparameters.Page.Header'), description: t('Pages.Claimpaymentparameters.Messages.KdvwithholdingRequired') })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillClaimpaymentparameternotification(error)
            })
        } else {
            AddClaimpaymentparameters({ data, history, closeModal })
        }
    }
}
ClaimpaymentparametersCreate.contextType = FormContext