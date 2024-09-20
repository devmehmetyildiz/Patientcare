import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Card, Icon, Label, Menu, Table, Transition } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
    Footerwrapper, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper,
    Submitbutton
} from '../../Components'
import Formatdate, { Formatfulldate } from '../../Utils/Formatdate'
import { CLAIMPAYMENT_TYPE_BHKS, CLAIMPAYMENT_TYPE_KYS } from '../../Utils/Constants'

export default class ClaimpaymentsDetail extends Component {

    PAGE_NAME = "ClaimpaymentsDetail"

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
            detailOpen: false
        }
    }

    componentDidMount() {
        const { ClaimpaymentID, GetClaimpayment, fillClaimpaymentnotification, match, history, Profile, GetPatientdefines, GetPatients } = this.props
        let Id = ClaimpaymentID || match?.params?.ClaimpaymentID

        const t = Profile?.i18n?.t

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
    }

    componentDidUpdate() {
        const { Claimpayments } = this.props
        const { selected_record, isLoading } = Claimpayments
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
            this.setState({
                isDatafetched: true
            })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
    }

    render() {
        const { Claimpayments, Patients, Patientdefines, Profile, history } = this.props

        const t = Profile?.i18n?.t

        const { selected_record, isLoading } = Claimpayments

        const {
            Name,
            Info,
            Type,
            Totaldaycount,
            Totalcalculatedpayment,
            Totalcalculatedkdv,
            Totalcalculatedfinal,
            Totalcalculatedwithholding,
            Isonpreview,
            Isapproved,
            Approveduser,
            Approvetime,
            Starttime,
            Endtime,
            Details
        } = selected_record

        const starttime = Formatfulldate(Starttime, true)
        const endtime = Formatfulldate(Endtime, true)

        const isByksorKys = Type === CLAIMPAYMENT_TYPE_BHKS || Type === CLAIMPAYMENT_TYPE_KYS;

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
                                onClick={() => { this.setState({ detailOpen: !this.state.detailOpen }) }}
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
                                    {t('Pages.Claimpayments.Label.Starttime')}:
                                    <Label.Detail>
                                        {starttime}
                                    </Label.Detail>
                                </Label>
                                <Label basic size='large'>
                                    {t('Pages.Claimpayments.Label.Endtime')}:
                                    <Label.Detail>
                                        {endtime}
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
                                        {this.CurrencyLabel({ value: Totalcalculatedpayment })}
                                    </Label.Detail>
                                </Label>
                                <Label basic size='large'>
                                    {t('Pages.Claimpayments.Label.Totalcalculatedkdv')}:
                                    <Label.Detail>
                                        {this.CurrencyLabel({ value: Totalcalculatedkdv })}
                                    </Label.Detail>
                                </Label>
                                <Label basic size='large'>
                                    {t('Pages.Claimpayments.Label.Totalcalculatedfinal')}:
                                    <Label.Detail>
                                        {this.CurrencyLabel({ value: Totalcalculatedfinal })}
                                    </Label.Detail>
                                </Label>
                                <Label basic size='large'>
                                    {t('Pages.Claimpayments.Label.Totalcalculatedwithholding')}:
                                    <Label.Detail>
                                        {this.CurrencyLabel({ value: Totalcalculatedwithholding })}
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
                                onClick={() => { this.setState({ detailOpen: !this.state.detailOpen }) }}
                            >
                                <div className='font-bold'>
                                    {t('Pages.Claimpayments.Detail.Detailheader')}
                                </div>
                                <div >
                                    {this.state.detailOpen ? <Icon name='angle up' /> : <Icon name='angle down' />}
                                </div>
                            </div>
                            <Pagedivider />
                            <Transition visible={this.state.detailOpen} animation='slide down' duration={500}>
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
                                                        : <Table.Cell className='!p-[4px]'>{this.CurrencyLabel({ value: Unitpayment })}</Table.Cell>}
                                                    <Table.Cell className='!p-[4px]'>{this.CurrencyLabel({ value: Calculatedpayment })}</Table.Cell>
                                                    <Table.Cell className='!p-[4px]'>{this.CurrencyLabel({ value: Calculatedkdv })}</Table.Cell>
                                                    <Table.Cell className='!p-[4px]'>{this.CurrencyLabel({ value: Calculatedfinal })}</Table.Cell>
                                                    <Table.Cell className='!p-[4px]'>{this.CurrencyLabel({ value: Calculatedwithholding })}</Table.Cell>
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
                        {Isonpreview ?
                            <Submitbutton
                                isLoading={Claimpayments.isLoading}
                                buttonText={t('Common.Button.Save')}
                                submitFunction={this.handleSubmit}
                            />
                            : null}
                    </Footerwrapper>

                </Pagewrapper >
        )
    }


    handleSubmit = (e) => {
        e.preventDefault()
        const { SavepreviewClaimpayments, history, fillClaimpaymentnotification, Profile, Claimpayments, ClaimpaymentID, match } = this.props
        const t = Profile?.i18n?.t

        let Id = ClaimpaymentID || match?.params?.ClaimpaymentID

        if (!validator.isUUID(Id)) {
            fillClaimpaymentnotification({
                type: 'Success',
                code: t('Pages.Claimpayments.Page.Header'),
                description: t('Pages.Claimpayments.Messages.UnsupportedClaimpaymentID'),
            });
        } else {
            SavepreviewClaimpayments({ data: Claimpayments?.selected_record, history })
        }
    }

    CurrencyLabel = ({ value, locale = 'tr-TR', currency = 'TRY' }) => {
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        });

        return <span>{formatter.format(value)}</span>;
    };
}
ClaimpaymentsDetail.contextType = FormContext