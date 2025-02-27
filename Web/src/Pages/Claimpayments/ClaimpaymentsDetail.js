import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Card, Icon, Label, Table, Transition } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
    Footerwrapper, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper,
    Submitbutton
} from '../../Components'
import Formatdate from '../../Utils/Formatdate'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS, ROUTES } from '../../Utils/Constants'
import usePreviousUrl from '../../Hooks/usePreviousUrl'
import config from '../../Config'
import AxiosErrorHelper from '../../Utils/AxiosErrorHelper'
import ClaimpaymentsExcelExport from '../../Containers/Claimpayments/ClaimpaymentsExcelExport'

export default function ClaimpaymentsDetail(props) {

    const PAGE_NAME = "ClaimpaymentsDetail"

    const { SavepreviewClaimpayments, history, fillClaimpaymentnotification, Profile, Claimpayments, Patients, Patientdefines, ClaimpaymentID, match } = props
    const { GetClaimpayment, GetPatientdefines, GetPatients } = props

    const Id = ClaimpaymentID || match?.params?.ClaimpaymentID
    const { selected_record, isLoading } = Claimpayments
    const t = Profile?.i18n?.t

    const { calculateRedirectUrl } = usePreviousUrl()
    const context = useContext(FormContext)
    const [detailOpen, setDetailOpen] = useState(false)
    const [claimpaymentID, setClaimpaymentID] = useState(null)
    const [excelOpen, setExcelOpen] = useState(false)

    const {
        Name,
        Uuid,
        Info,
        Type,
        Totaldaycount,
        Totalcalculatedpayment,
        Totalcalculatedkdv,
        Totalcalculatedfinal,
        Totalcalculatedwithholding,
        Isonpreview,
        Isapproved,
        Reportdate,
        Details
    } = selected_record

    const isByksorKys = Type === CLAIMPAYMENT_TYPE_BHKS || Type === CLAIMPAYMENT_TYPE_KYS;

    const getReportDate = (_date) => {
        const date = new Date(_date)
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

        return `${categories[Profile.Language][date.getMonth()]} - ${date.getFullYear()}`
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validator.isUUID(Id)) {
            fillClaimpaymentnotification({
                type: 'Success',
                code: t('Pages.Claimpayments.Page.Header'),
                description: t('Pages.Claimpayments.Messages.UnsupportedClaimpaymentID'),
            });
        } else {
            SavepreviewClaimpayments({
                data: selected_record,
                history,
                redirectUrl: calculateRedirectUrl({ url: '/Claimpayments', usePrev: true }),
            })
        }
    }

    const CurrencyLabel = ({ value, locale = 'tr-TR', currency = 'TRY' }) => {
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 4,
        });

        return <span>{formatter.format(value)}</span>;
    };

    const exportExcelReport = () => {
        setClaimpaymentID(Id)
        setExcelOpen(true)
    }

    useEffect(() => {
        if (validator.isUUID(Id)) {
            GetClaimpayment(Id)
            GetPatients()
            GetPatientdefines()
        } else {
            fillClaimpaymentnotification({
                type: 'Success',
                code: t('Pages.Claimpayments.Page.Header'),
                description: t('Pages.Claimpayments.Messages.UnsupportedClaimpaymentID'),
            });
            history.length > 1 ? history.goBack() : history.push('/Claimpayments')
        }
    }, [])

    useEffect(() => {
        if (!isLoading && validator.isObject(selected_record)) {
            context.setForm(PAGE_NAME, selected_record)
        }
    }, [isLoading, selected_record])

    return (
        isLoading ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Headerbredcrump>
                        <Link to={"/Claimpayments"}>
                            <Breadcrumb.Section >{t('Pages.Claimpayments.Page.Header')}</Breadcrumb.Section>
                        </Link>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Breadcrumb.Section>{Name}</Breadcrumb.Section>
                    </Headerbredcrump>
                </Headerwrapper>
                <Pagedivider />
                <Card color='blue' fluid>
                    <Card.Content>
                        <div
                            className='text-[1.28571429em] w-full flex justify-between items-center'
                            onClick={() => { setDetailOpen(prev => !prev) }}
                        >
                            <div className='font-bold'>
                                {t('Pages.Claimpayments.Detail.Summaryheader')}
                            </div>
                            <div >
                                {Isapproved ? <Label color='blue' content={t('Common.Approved')} /> : <Label color='red' content={t('Common.Nonapproved')} />}
                            </div>
                        </div>
                        <Pagedivider />
                        <Card.Meta>
                            <Label basic size='large'>
                                {t('Pages.Claimpayments.Label.Reportdate')}:
                                <Label.Detail>
                                    {getReportDate(Reportdate)}
                                </Label.Detail>
                            </Label>
                        </Card.Meta>
                        <Pagedivider />
                        <Card.Description>
                            <Label basic size='large'>
                                {t('Pages.Claimpayments.Label.Totaldaycount')}:
                                <Label.Detail>
                                    {Totaldaycount}
                                </Label.Detail>
                            </Label>
                            <Label basic size='large'>
                                {t('Pages.Claimpayments.Label.Totalcalculatedpayment')}:
                                <Label.Detail>
                                    {CurrencyLabel({ value: Totalcalculatedpayment })}
                                </Label.Detail>
                            </Label>
                            <Label basic size='large'>
                                {t('Pages.Claimpayments.Label.Totalcalculatedkdv')}:
                                <Label.Detail>
                                    {CurrencyLabel({ value: Totalcalculatedkdv })}
                                </Label.Detail>
                            </Label>
                            <Label basic size='large'>
                                {t('Pages.Claimpayments.Label.Totalcalculatedfinal')}:
                                <Label.Detail>
                                    {CurrencyLabel({ value: Totalcalculatedfinal })}
                                </Label.Detail>
                            </Label>
                            <Label basic size='large'>
                                {t('Pages.Claimpayments.Label.Totalcalculatedwithholding')}:
                                <Label.Detail>
                                    {CurrencyLabel({ value: Totalcalculatedwithholding })}
                                </Label.Detail>
                            </Label>
                        </Card.Description>
                    </Card.Content>
                </Card>
                <Pagedivider />
                <Card color='blue' fluid >
                    <Card.Content>
                        <div
                            className='cursor-pointer text-[1.28571429em] w-full flex justify-between items-center'
                            onClick={() => { setDetailOpen(prev => !prev) }}
                        >
                            <div className='font-bold'>
                                {t('Pages.Claimpayments.Detail.Detailheader')}
                            </div>
                            <div >
                                {detailOpen ? <Icon name='angle up' /> : <Icon name='angle down' />}
                            </div>
                        </div>
                        <Pagedivider />
                        <Transition visible={detailOpen} animation='slide down' duration={500}>
                            <div className='w-full'>
                                <Table className='mt-2' celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell >{t('Pages.Claimpayments.Detail.Label.Patient')}</Table.HeaderCell>
                                            {isByksorKys
                                                ? <Table.HeaderCell width={2}>{t('Pages.Claimpayments.Detail.Label.Happensdate')}</Table.HeaderCell>
                                                : <Table.HeaderCell width={2}>{t('Pages.Claimpayments.Detail.Label.Daycount')}</Table.HeaderCell>}
                                            {isByksorKys
                                                ? null
                                                : <Table.HeaderCell width={2}>{t('Pages.Claimpayments.Detail.Label.Perpayment')}</Table.HeaderCell>}
                                            <Table.HeaderCell width={2}>{t('Pages.Claimpayments.Detail.Label.Total')}</Table.HeaderCell>
                                            <Table.HeaderCell width={2}>{t('Pages.Claimpayments.Detail.Label.Kdv')}</Table.HeaderCell>
                                            <Table.HeaderCell width={2}>{t('Pages.Claimpayments.Detail.Label.Totalfinal')}</Table.HeaderCell>
                                            <Table.HeaderCell width={2}>{t('Pages.Claimpayments.Detail.Label.Kdvwitholding')}</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {(Details || []).map((detail, index) => {

                                            const {
                                                Calculatedfinal,
                                                Calculatedkdv,
                                                Calculatedpayment,
                                                Calculatedwithholding,
                                                Daycount,
                                                PatientID,
                                                Unitpayment,
                                            } = detail

                                            const patient = (Patients.list || []).find(u => u.Uuid === PatientID)
                                            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

                                            const patientname = `${patientdefine?.Firstname} ${patientdefine?.Lastname} - ${patientdefine?.CountryID}`
                                            const patienthappensdate = validator.isISODate ? Formatdate(patient?.Happensdate, true) : t('Common.NoDataFound')

                                            return <Table.Row className='hover:bg-gray-100 transition-all ease-in-out duration-300' key={index}>
                                                <Table.Cell className='!p-[4px]' >{patientdefine ? patientname : t('Pages.Claimpayments.Detail.Messages.Nopatientfound')}</Table.Cell>
                                                <Table.Cell className='!p-[4px]'>{isByksorKys ? patienthappensdate : Daycount}</Table.Cell>
                                                {isByksorKys
                                                    ? null
                                                    : <Table.Cell className='!p-[4px]'>{CurrencyLabel({ value: Unitpayment })}</Table.Cell>}
                                                <Table.Cell className='!p-[4px]'>{CurrencyLabel({ value: Calculatedpayment })}</Table.Cell>
                                                <Table.Cell className='!p-[4px]'>{CurrencyLabel({ value: Calculatedkdv })}</Table.Cell>
                                                <Table.Cell className='!p-[4px]'>{CurrencyLabel({ value: Calculatedfinal })}</Table.Cell>
                                                <Table.Cell className='!p-[4px]'>{CurrencyLabel({ value: Calculatedwithholding })}</Table.Cell>
                                            </Table.Row>
                                        })}
                                    </Table.Body>
                                </Table>
                            </div>
                        </Transition>
                    </Card.Content>
                </Card>
                <Footerwrapper>
                    <Gobackbutton
                        history={history}
                        redirectUrl={"/Claimpayments"}
                        buttonText={t('Common.Button.Goback')}
                    />
                    <div>
                        <Submitbutton
                            isLoading={isLoading}
                            buttonText={t('Common.Button.Excel')}
                            submitFunction={exportExcelReport}
                        />
                        {Isonpreview ?
                            <Submitbutton
                                isLoading={isLoading}
                                buttonText={t('Common.Button.Save')}
                                submitFunction={handleSubmit}
                            />
                            : null}
                    </div>
                </Footerwrapper>
                <ClaimpaymentsExcelExport
                    open={excelOpen}
                    setOpen={setExcelOpen}
                    ClaimpaymentID={claimpaymentID}
                />
            </Pagewrapper >
    )
}
