import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Dropdown, Form, Grid, GridColumn } from 'semantic-ui-react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import config from '../../Config'
import { Contentwrapper, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper } from '../../Components'
import Formatdate from '../../Utils/Formatdate'

export default function Appreports(props) {

    const { GetLogByUser, GetUsagecountbyUserMontly, GetProcessCount, GetServiceUsageCount, GetServiceUsageCountDaily, GetUsers } = props
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
        isLoading,
        isLogByUserLoading,
        logByUser
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

    const generateDateArray = (Startdate, Enddate) => {
        const start = new Date(Startdate)
        start.setHours(0, 0, 0, 0);
        const end = new Date(Enddate)
        end.setHours(0, 0, 0, 0);
        const now = new Date()
        now.setHours(23, 59, 59, 999)

        const days = [];

        while (start.getTime() <= end.getTime() && start.getTime() <= now.getTime()) {
            const day = new Date(start)
            days.push(day);
            start.setDate(start.getDate() + 1);
        }

        return days;
    }

    let maxData = 0
    let minData = 0

    const LogByUserData = (Users.list || []).filter(u => u.Isactive).map((user) => {
        const dayStart = new Date(startDate)
        const dayEnd = new Date(endDate)

        const dayArray = generateDateArray(dayStart, dayEnd)
        return {
            name: `${user?.Username}`,
            data: dayArray.map(dayKey => {
                const dayData = logByUser.find(u => u.key === new Date(dayKey).toLocaleDateString('tr'))
                const value = (dayData?.value || []).find(u => u.UserID === user?.Username)?.Count
                if (value > maxData) {
                    maxData = value
                }
                if (value < minData) {
                    minData = value
                }
                return value || 0
            })
        }
    }).filter(u => (u.data || []).some(u => u > 0))


    const LogByUserOption = {
        chart: {
            type: 'line',
        },
        title: {
            text: t('Pages.Appreports.LogByUser.Label.Title'),
        },
        xAxis: {
            categories: generateDateArray(startDate, endDate).map(u => `${new Date(u).getDate()}.${String(new Date(u).getMonth() + 1).padStart(2, '0')}`),
            title: {
                text: t('Pages.Appreports.LogByUser.Label.Days'),
            },
        },
        yAxis: {
            min: minData,
            max: maxData,
            title: {
                text: t('Pages.Appreports.LogByUser.Label.Count'),
            },
        },
        series: LogByUserData,
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
            GetLogByUser({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
            GetUsers()
        }
    }, [startDate, endDate, GetUsagecountbyUserMontly, GetProcessCount, GetServiceUsageCount, GetServiceUsageCountDaily, GetUsers, GetLogByUser])

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
                        <div className='w-full'>
                            <HighchartsReact highcharts={Highcharts} options={UserUsageoptions} />
                        </div>
                    </div>
                    <Pagedivider />
                    <HighchartsReact highcharts={Highcharts} options={LogByUserOption} />
                </Pagewrapper >
            </React.Fragment >
    )
}
