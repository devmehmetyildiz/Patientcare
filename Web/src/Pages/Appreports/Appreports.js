import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Dropdown, Form, Grid, GridColumn } from 'semantic-ui-react'
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

    const UserUsageoptions = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Appreports.Userusagecount.Label.Title'),
        },
        xAxis: {
            categories: [...new Set(usagecountbyUserMontly.map(u => u.UserID))],
            title: {
                text: t('Pages.Appreports.Userusagecount.Label.Services'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Appreports.Userusagecount.Label.UsageCounts'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Appreports.Userusagecount.Label.Unit'),
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                },
            },
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: -10,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true,
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                name: t('Pages.Appreports.Userusagecount.Label.Services'),
                data: [...new Set(usagecountbyUserMontly.map(u => u.UserID))].map((userKey) => {
                    return usagecountbyUserMontly.filter(u => u.UserID === userKey).reduce((total, value) => { return total + value.UsageCount }, 0)
                }),
            },
        ],
    };

    const ServiceUsageoptions = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Appreports.Serviceusagecount.Label.Title'),
        },
        xAxis: {
            categories: [...new Set(serviceUsageCount.map(u => u.Service))],
            title: {
                text: t('Pages.Appreports.Serviceusagecount.Label.Services'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Appreports.Serviceusagecount.Label.UsageCounts'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Appreports.Serviceusagecount.Label.Unit'),
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                },
            },
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: -10,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true,
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                name: t('Pages.Appreports.Serviceusagecount.Label.Services'),
                data: [...new Set(serviceUsageCount.map(u => u.Service))].map((serviceKey) => {
                    return serviceUsageCount.filter(u => u.Service === serviceKey).reduce((total, value) => { return total + value.Count }, 0)
                }),
            },
        ],
    };

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
                    <div className='w-full flex flex-col gap-8 justify-center items-center lg:flex-row '>
                        <div className='w-full'>
                            <HighchartsReact highcharts={Highcharts} options={ServiceUsageoptions} />
                        </div>
                    </div>
                    <Pagedivider />
                    <HighchartsReact highcharts={Highcharts} options={UserUsageoptions} />
                </Pagewrapper >
            </React.Fragment >
    )
}
