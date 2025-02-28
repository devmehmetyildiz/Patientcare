import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Contentwrapper, Headerwrapper, LoadingPage, NoDataScreen, Pagedivider, Pagewrapper } from '../../Components'
import { Accordion, Breadcrumb, Button, Dropdown, Form, Grid, GridColumn, Icon, Label, Menu, Table, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import validator from '../../Utils/Validator'
import { CASE_PATIENT_STATUS_ONORGANIZATION } from '../../Utils/Constants'

const Patientsrollcall = (props) => {

    const { GetPatienttypes, GetCostumertypes, GetCases, GetPatientsRollCall, removePatientRollCall } = props
    const { Patients, Patienttypes, Costumertypes, Cases, Profile } = props

    const [startDate, setStartDate] = useState(null)
    const [hiddenTabs, setHiddenTabs] = useState([])

    const t = Profile?.i18n?.t
    const { patientRollCallList } = Patients

    const isLoading = Patients.isPatientRollCallListLoading || Patienttypes.isLoading || Costumertypes.isLoading || Cases.isLoading

    const costumerTypes = [...new Set(patientRollCallList.map(u => u.CostumertypeID))]

    const generateDateArray = (month) => {
        const start = new Date(month)
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(month)
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);

        const days = [];

        while (start.getTime() <= end.getTime()) {
            const day = new Date(start)
            days.push(day);
            start.setDate(start.getDate() + 1);
        }

        return days;
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

    const handleFetchQuery = () => {
        if (validator.isISODate(startDate)) {
            GetPatientsRollCall({
                data: {
                    Month: new Date(startDate)
                }
            })
        }
    }

    useEffect(() => {
        GetPatienttypes()
        GetCostumertypes()
        GetCases()
    }, [])


    useEffect(() => {
        removePatientRollCall()
    }, [startDate, removePatientRollCall])

    return (
        isLoading ? <LoadingPage /> :
            <React.Fragment>
                <Pagewrapper additionalStyle={'!overflow-x-auto xl:!overflow-x-hidden'}>
                    <Headerwrapper>
                        <Grid columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Patientsrollcall"}>
                                        <Breadcrumb.Section>{t('Pages.Patientsrollcall.Page.Header')}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <label className='text-[#000000de]'>{t('Pages.Patientsrollcall.Column.Startdate')}</label>
                                    <Dropdown
                                        options={getDateOption()}
                                        value={startDate}
                                        search
                                        fluid
                                        selection
                                        onChange={(e, data) => {
                                            setStartDate(data.value)
                                        }}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={'equal'}>
                                <div className='w-full px-8' onClick={handleFetchQuery}>
                                    <Button
                                        className='!bg-[#2355a0] !text-white whitespace-nowrap'
                                        floated='right'
                                        content="Listeyi Getir"
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                    <Pagedivider />
                    <Contentwrapper additionalStyle={''}>
                        <div className='w-full flex flex-col justify-start items-center gap-8'>
                            {(costumerTypes || []).length ?
                                (costumerTypes || []).map((costumerTypeID, costumertypeIndex) => {
                                    const costumertype = (Costumertypes.list || []).find(u => u.Uuid === costumerTypeID)

                                    const filteredPatients = patientRollCallList.filter(u => u.CostumertypeID === costumerTypeID)

                                    return <div className='w-full flex flex-col justify-start items-center gap-4' index={costumertypeIndex}>
                                        <Accordion className='w-full'>
                                            <Accordion.Title
                                                className='w-full'
                                                index={costumertypeIndex}
                                                active={!hiddenTabs.includes(costumertypeIndex)}
                                                onClick={() => setHiddenTabs(prev => hiddenTabs.includes(costumertypeIndex) ? prev.filter(u => u !== costumertypeIndex) : [...prev, costumertypeIndex])}
                                            >
                                                <Icon name='dropdown' />
                                                <Label basic className='!text-[#2355a0] !border-[#2355a0]'>{`${costumertype?.Name || t('Common.NoDataFound')}`}</Label>
                                                <Label basic className='!text-[#2355a0] !border-[#2355a0]'>{`${filteredPatients.length} / ${(patientRollCallList || []).length}`}</Label>
                                            </Accordion.Title>
                                            <Accordion.Content className='w-full' active={true}>
                                                <Transition visible={!hiddenTabs.includes(costumertypeIndex)} animation='slide down' duration={500}>
                                                    <div className='w-full'>
                                                        {(patientRollCallList || []).filter(u => u.CostumertypeID === costumerTypeID).length > 0 ?
                                                            <Table celled>
                                                                <Table.Header>
                                                                    <Table.Row>
                                                                        <Table.HeaderCell width={2}>{t('Pages.Patientsrollcall.Column.Patient')}</Table.HeaderCell>
                                                                        {generateDateArray(startDate).map((day, index) => {
                                                                            return <Table.HeaderCell collapsing key={index}>{`${day.getDate()}`}</Table.HeaderCell>
                                                                        })}
                                                                    </Table.Row>
                                                                </Table.Header>
                                                                <Table.Body>
                                                                    {patientRollCallList.filter(u => u.CostumertypeID === costumerTypeID).map((rollCall, index) => {
                                                                        return <Table.Row key={index}>
                                                                            <Table.Cell
                                                                                className='rollcallscreen-header'
                                                                            >
                                                                                <Link to={`/Patients/${rollCall.Uuid}`}>
                                                                                    {rollCall.Name}
                                                                                </Link>
                                                                            </Table.Cell>
                                                                            {(rollCall.Rollcall || []).map((roll, i) => {
                                                                                const dayCase = (Cases.list || []).find(u => u.Uuid === roll.CaseID)
                                                                                return <Table.Cell
                                                                                    index={i}
                                                                                    className='rollcallscreen-td'
                                                                                    style={{
                                                                                        backgroundColor: CASE_PATIENT_STATUS_ONORGANIZATION !== dayCase?.Patientstatus ? dayCase?.Casecolor || "transparent" : "transparent",
                                                                                    }}
                                                                                >
                                                                                    {dayCase?.Shortname || '-'}
                                                                                </Table.Cell>
                                                                            })}
                                                                        </Table.Row>
                                                                    })}
                                                                </Table.Body>
                                                            </Table>
                                                            : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />}
                                                    </div>
                                                </Transition>
                                            </Accordion.Content>
                                        </Accordion>
                                    </div>
                                })
                                : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />}
                        </div>
                    </Contentwrapper>
                </Pagewrapper>
            </React.Fragment >
    )
}

export default Patientsrollcall