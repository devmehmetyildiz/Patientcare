import React, { useCallback, useEffect, useState } from 'react'
import { Contentwrapper, Headerwrapper, Pagedivider, Pagewrapper } from '../../Components'
import { Breadcrumb, Dropdown, Form, Grid, GridColumn, Tab } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import validator from '../../Utils/Validator'
import OverviewhealthcarecardsTabpane from './OverviewhealthcarecardsTabpane'

export default function Overviewhealthcarecards(props) {

    const { GetPatients, GetPatientdefines, GetPatienteventmovements, GetPatienteventdefines, GetPatienthealthcases, GetPatienthealthcasedefines } = props
    const { Patients, Patientdefines, Patienteventmovements, Patienteventdefines, Patienthealthcases, Patienthealthcasedefines, Profile, } = props

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const t = Profile?.i18n?.t

    const generateMonthArray = (startDate, endDate) => {
        const start = new Date(startDate);
        start.setDate(1)
        const end = new Date(endDate);
        end.setDate(1)
        const months = [];

        while (start <= end) {
            const month = start.toDateString()
            months.push(month);
            start.setMonth(start.getMonth() + 1);
        }

        return months;
    }

    const getDateOption = useCallback((props) => {
        const isEndDate = props?.isEndDate

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
            if (isEndDate) {
                const preferredEnddate = new Date(start)
                preferredEnddate.setMonth(preferredEnddate.getMonth() + 6)
                preferredEnddate.setDate(0)
                months.push({
                    key: index,
                    text: preferredEnddate.toLocaleDateString('tr'),
                    value: preferredEnddate.getTime()
                });
            } else {
                months.push({
                    key: index,
                    text: start.toLocaleDateString('tr'),
                    value: start.getTime()
                });
            }
            start.setMonth(start.getMonth() + 6);
        }
        return months
    }, [])

    const getPatientsByDate = useCallback(() => {

        const start = startDate
        const end = endDate

        const monthArray = generateMonthArray(start, end)

        let resArr = []

        const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration);

        for (const month of monthArray) {
            const startOfMonth = new Date(month)
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const endtOfMonth = new Date(month)
            endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
            endtOfMonth.setDate(0);
            endtOfMonth.setHours(23, 59, 59, 999);

            const targetDate = startOfMonth.toDateString()

            const foundedPatients = validator.isISODate(startOfMonth) && validator.isISODate(endtOfMonth) ? patients
                .filter(u => new Date(u.Approvaldate).getTime() <= new Date(endtOfMonth).getTime() && u.Ischecked && u.Isapproved && !u.Ispreregistration && u.Isactive)
                .filter(u => {
                    if (!u.Isleft && u.Isalive) {
                        return true
                    }
                    if (u.Isalive && u.Isleft && new Date(u.Leavedate).getTime() >= new Date(startOfMonth).getTime()) {
                        return true
                    }
                    if (!u.Isleft && !u.Isalive && new Date(u.Deathdate).getTime() >= new Date(startOfMonth).getTime()) {
                        return true
                    }
                }).length : 0;

            resArr.push({
                key: targetDate,
                patientCount: foundedPatients,
            })
        }

        return resArr

    }, [startDate, endDate, Patients])

    let panes = [];

    (Patienteventdefines?.list || []).filter(u => u.Isactive).forEach(eventdefine => {

        panes.push({
            menuItem: String(eventdefine?.Eventname || t('Common.NoDataFound')).toLocaleUpperCase('tr'),
            render: () => <OverviewhealthcarecardsTabpane
                type='Event'
                record={eventdefine}
                monthArray={generateMonthArray(startDate, endDate)}
                patients={getPatientsByDate()}
                Patientdefines={Patientdefines}
                Patienteventmovements={Patienteventmovements}
                Patienteventdefines={Patienteventdefines}
                Profile={Profile}
            />,
        })
    });

    (Patienthealthcasedefines?.list || []).filter(u => u.Isactive).forEach(healthcasedefine => {

        panes.push({
            menuItem: String(healthcasedefine?.Name || t('Common.NoDataFound')).toLocaleUpperCase('tr'),
            render: () => <OverviewhealthcarecardsTabpane
                type='Healtcase'
                record={healthcasedefine}
                monthArray={generateMonthArray(startDate, endDate)}
                patients={getPatientsByDate()}
                Patientdefines={Patientdefines}
                Patienthealthcases={Patienthealthcases}
                Patienthealthcasedefines={Patienthealthcasedefines}
                Profile={Profile}
            />,
        })
    });

    useEffect(() => {
        const current = new Date()
        current.setFullYear(current.getFullYear(), current.getMonth() > 5 ? 6 : 0, 1)
        current.setHours(0, 0, 0, 0)
        setStartDate(current.getTime())
        current.setMonth(current.getMonth() + 6)
        current.setDate(0)
        setEndDate(current.getTime())
    }, [])

    useEffect(() => {
        GetPatients()
        GetPatientdefines()
        GetPatienteventmovements()
        GetPatienteventdefines()
        GetPatienthealthcases()
        GetPatienthealthcasedefines()
    }, [])

    return (
        <Pagewrapper>
            <Headerwrapper>
                <Grid columns='2' >
                    <GridColumn width={8}>
                        <Breadcrumb size='big'>
                            <Link to={"/Overviewhealthcarecards"}>
                                <Breadcrumb.Section>{t('Pages.Overviewhealthcarecard.Page.Header')}</Breadcrumb.Section>
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
                            <label className='text-[#000000de]'>{t('Pages.Overviewhealthcarecard.Label.Startdate')}</label>
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
                        <Form.Field>
                            <label className='text-[#000000de]'>{t('Pages.Overviewhealthcarecard.Label.Enddate')}</label>
                            <Dropdown
                                options={getDateOption({ isEndDate: true })}
                                value={endDate}
                                search
                                fluid
                                selection
                                onChange={(e, data) => {
                                    setEndDate(data.value)
                                }}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Contentwrapper>
            <Pagedivider />
            <Contentwrapper>
                <Tab
                    className="w-full !bg-transparent"
                    renderActiveOnly
                    panes={panes}
                />
            </Contentwrapper>
        </Pagewrapper>
    )
}
