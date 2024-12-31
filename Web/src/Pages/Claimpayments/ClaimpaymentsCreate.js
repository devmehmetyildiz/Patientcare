import React, { useCallback, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Dropdown, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, CLAIMPAYMENT_TYPE_PATIENT } from '../../Utils/Constants'

export default function ClaimpaymentsCreate(props) {

    const PAGE_NAME = "ClaimpaymentsCreate"

    const { AddClaimpayments, Claimpayments, history, fillClaimpaymentnotification, Profile, closeModal } = props

    const context = useContext(FormContext)

    const t = Profile?.i18n?.t

    const Claimpaymenttypes = [
        { key: 1, text: t('Common.Claimpayments.Type.Patient'), value: CLAIMPAYMENT_TYPE_PATIENT },
        { key: 2, text: t('Common.Claimpayments.Type.Bhks'), value: CLAIMPAYMENT_TYPE_BHKS },
        { key: 3, text: t('Common.Claimpayments.Type.Kys'), value: CLAIMPAYMENT_TYPE_KYS },
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        const t = Profile?.i18n?.t
        const data = context.getForm(PAGE_NAME)
        let errors = []
        if (!validator.isString(data.Name)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpayments.Page.Header'), description: t('Pages.Claimpayments.Messages.NameRequired') })
        }
        if (!validator.isNumber(data.Type)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpayments.Page.Header'), description: t('Pages.Claimpayments.Messages.TypeRequired') })
        }
        if (!validator.isISODate(data.Reportdate)) {
            errors.push({ type: 'Error', code: t('Pages.Claimpayments.Page.Header'), description: t('Pages.Claimpayments.Messages.ReportdateRequired') })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillClaimpaymentnotification(error)
            })
        } else {
            AddClaimpayments({ data, history, closeModal })
        }
    }

    const getDateOption = useCallback(() => {
        const categories = {
            en: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
            ],
            tr: [
                'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
            ]
        }

        const start = new Date()
        start.setFullYear(2020, 0, 1)
        start.setHours(0, 0, 0, 0)

        const end = new Date();
        end.setMonth(end.getMonth() + 1)
        end.setDate(0)
        const months = [];
        let index = 0
        while (start <= end) {
            index++
            months.push({
                key: index,
                text: `${categories[Profile.Language][start.getMonth()]} - ${start.getFullYear()}`,
                value: start.getTime()
            });
            start.setMonth(start.getMonth() + 1);
        }
        return months.sort((a, b) => b.value - a.value);
    }, [])

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
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Claimpayments.Label.Name')} name="Name" />
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Claimpayments.Label.Type')} name="Type" formtype='dropdown' options={Claimpaymenttypes} />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Claimpayments.Label.Reportdate')} name="Reportdate" formtype='dropdown' options={getDateOption()} />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} placeholder={t('Pages.Claimpayments.Label.Info')} name="Info" />
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
                        buttonText={t('Common.Button.Savepreview')}
                        submitFunction={handleSubmit}
                    />
                </Footerwrapper>
            </Pagewrapper >
    )
}
