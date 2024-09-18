import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT, CLAIMPAYMENT_TYPE_PERSONEL } from '../../Utils/Constants'

export default class ClaimpaymentsCreate extends Component {

    PAGE_NAME = "ClaimpaymentsCreate"

    render() {
        const { Claimpayments, Profile, history, closeModal } = this.props

        const t = Profile?.i18n?.t

        const Claimpaymenttypes = [
            { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
            { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
            { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
            { key: 4, text: t('Common.Claimpayments.Type.Personel'), value: CLAIMPAYMENT_TYPE_PERSONEL },
        ]

        return (
            Claimpayments.isLoading ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Claimpayments"}>
                                <Breadcrumb.Section >{t('Pages.Claimpayments.Page.Header')}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{t('Pages.Claimpayments.Page.CreateHeader')}</Breadcrumb.Section>
                        </Headerbredcrump>
                        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <Form.Group widths={'equal'}>
                                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpayments.Label.Type')} name="Type" formtype='dropdown' options={Claimpaymenttypes} />
                            </Form.Group>
                            <Form.Group widths={'equal'}>
                                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpayments.Label.Startdate')} name="Startdate" type='datetime-local' />
                                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Claimpayments.Label.Enddate')} name="Enddate" type='datetime-local' />
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={"/Claimpayments"}
                            buttonText={t('Common.Button.Goback')}
                        />
                        <Submitbutton
                            isLoading={Claimpayments.isLoading}
                            buttonText={t('Common.Button.Create')}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                </Pagewrapper >
        )
    }


    handleSubmit = (e) => {
        e.preventDefault()
        const { AddClaimpayments, history, fillClaimpaymentnotification, Profile, closeModal } = this.props
        const t = Profile?.i18n?.t
        const data = this.context.getForm(this.PAGE_NAME)
        let errors = []
        if (!validator.isNumber(data.Type)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpayments.Page.Header'), description: t('Pages.Claimpayments.Messages.TypeRequired') })
        }
        if (!validator.isISODate(data.Startdate)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpayments.Page.Header'), description: t('Pages.Claimpayments.Messages.StartdateRequired') })
        }
        if (!validator.isISODate(data.Enddate)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpayments.Page.Header'), description: t('Pages.Claimpayments.Messages.EnddateRequired') })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillClaimpaymentnotification(error)
            })
        } else {
            AddClaimpayments({ data, history, closeModal })
        }
    }
}
ClaimpaymentsCreate.contextType = FormContext