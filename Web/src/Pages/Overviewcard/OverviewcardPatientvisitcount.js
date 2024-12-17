import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useEffect } from 'react'
import { Card, Label, TabPane } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

export default function OverviewcardPatientvisitcount(props) {

    const { Profile, startDate, endDate, Overviewcards, GetPatientvisitcount } = props

    const t = Profile?.i18n?.t
    const { patientVisitCount, isPatientVisitCountLoading } = Overviewcards

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

    const decoratedCategories = (patientVisitCount || []).map(data => {
        const { key } = data
        const targetKey = new Date(key)
        return categories[Profile.Language][targetKey.getMonth()]
    })

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Overviewcard.OverviewcardPatientvisitcount.Visits'),
        },
        xAxis: {
            categories: decoratedCategories,
            title: {
                text: t('Pages.Overviewcard.OverviewcardPatientvisitcount.Contacts'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Overviewcard.OverviewcardPatientvisitcount.PersonCount'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Overviewcard.OverviewcardPatientvisitcount.Person'),
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
                name: t('Pages.Overviewcard.OverviewcardPatientvisitcount.Contact'),
                data: patientVisitCount.map(u => u.totalPatientContactCount),
            },
            {
                name: t('Pages.Overviewcard.OverviewcardPatientvisitcount.Visitcount'),
                data: patientVisitCount.map(u => u.totalVisitCount),
            },
        ],
    };

    const totalVisitCount = patientVisitCount.reduce((total, value) => { return total + value.totalVisitCount }, 0)
    const totalPatientContactCount = patientVisitCount.reduce((total, value) => { return total + value.totalPatientContactCount }, 0)

    const percent = ((totalVisitCount / totalPatientContactCount) * 100).toFixed(2)
    const targetpercent = 35

    useEffect(() => {
        if (startDate && endDate && GetPatientvisitcount) {
            GetPatientvisitcount({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
        }
    }, [startDate, endDate, GetPatientvisitcount])

    return (
        <TabPane loading={isPatientVisitCountLoading}>
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardPatientvisitcount.Totalvisitcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalVisitCount} ${t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Person')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardPatientvisitcount.Totalpatientcontactcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalPatientContactCount} ${t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Person')}`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardPatientvisitcount.Percent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${percent} %`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardPatientvisitcount.Targetpercent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${targetpercent} %`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <HighchartsReact highcharts={Highcharts} options={options} />
        </TabPane>
    )
}
