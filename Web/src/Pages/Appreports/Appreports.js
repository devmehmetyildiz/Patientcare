import React, { Component, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Dropdown, Form, Grid, GridColumn } from 'semantic-ui-react'
import { FormContext } from '../../Provider/FormProvider'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import config from '../../Config'
import { Contentwrapper, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper } from '../../Components'

export default function Appreports(props) {

    const { GetUsagecountbyUserMontly, GetProcessCount, GetServiceUsageCount, GetServiceUsageCountDaily, GetUsers } = props
    const { Profile, Reports, Users } = props

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const t = Profile?.i18n?.t

    const { logs } = Reports

    const services = Object.keys(config.services)

    const {
        serviceUsageCount,
        serviceUsageCountDaily,
        usagecountbyUserMontly,
        processCount,
        isServiceUsageCountLoading,
        isServiceUsageCountDailyLoading,
        isUsagecountbyUserMontlyLoading,
        isProcessCountLoading,
        isLoading
    } = Reports

    const isLoadingStatus = isLoading || isProcessCountLoading || isServiceUsageCountDailyLoading || isServiceUsageCountLoading || isUsagecountbyUserMontlyLoading || Users.isLoading

   /*  const ServiceUsageCountOptions = {
        chart: {
            type: 'pie',
            className: ' !w-full !h-auto !min-w-0'
        },
        title: {
            text: ,
        },
        legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            itemMarginBottom: 5,
            itemStyle: {
                fontSize: '12px',
            },
        },
        series: {
            name: legendname[Profile.Language],
            data: data,
            showInLegend: true,
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false,
                },
            },
        },
    }; */

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
                preferredEnddate.setMonth(preferredEnddate.getMonth() + 1)
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
            start.setMonth(start.getMonth() + 1);
        }
        return months
    }, [])

    useEffect(() => {
        const current = new Date()
        current.setFullYear(current.getFullYear(), current.getMonth(), 1)
        current.setHours(0, 0, 0, 0)
        setStartDate(current.getTime())
        current.setMonth(current.getMonth() + 1)
        current.setDate(0)
        setEndDate(current.getTime())
    }, [])

    useEffect(() => {
        if (
            startDate &&
            endDate &&
            GetUsagecountbyUserMontly &&
            GetProcessCount &&
            GetServiceUsageCount &&
            GetServiceUsageCountDaily &&
            GetUsers
        ) {
            GetUsagecountbyUserMontly({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
            GetProcessCount({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
            GetServiceUsageCount({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
            GetServiceUsageCountDaily({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
            GetUsers()
        }
    }, [startDate, endDate, GetUsagecountbyUserMontly, GetProcessCount, GetServiceUsageCount, GetServiceUsageCountDaily, GetUsers])

    return (
        isLoadingStatus ? <LoadingPage /> :
            <React.Fragment>
                <Pagewrapper>
                    <Headerwrapper>
                        <Grid stackable columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Appreports"} >
                                        <Breadcrumb.Section>{t('Pages.Appreports.Page.Header')}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Contentwrapper>
                        <Form>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <label className='text-[#000000de]'>{t('Pages.Appreports.Label.Startdate')}</label>
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
                                    <label className='text-[#000000de]'>{t('Pages.Appreports.Label.Enddate')}</label>
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
                  {/*   <HighchartsReact highcharts={Highcharts} options={ServiceUsageCountOptions} /> */}
                </Pagewrapper >
            </React.Fragment >
    )
}
