import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useEffect } from 'react'
import { Card, Label, TabPane } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

export default function OverviewcardCompletedfilecountforpatient(props) {

    const { Profile, startDate, endDate, Overviewcards, GetCompletedFileCountForPatients } = props

    const t = Profile?.i18n?.t
    const { completedFileCountPatient, isCompletedFileCountPatientLoading } = Overviewcards

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

    const decoratedCategories = (completedFileCountPatient || []).map(data => {
        const { key } = data
        const targetKey = new Date(key)
        return categories[Profile.Language][targetKey.getMonth()]
    })

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Overviewcard.CompletedFileCountForPatients.Title'),
        },
        xAxis: {
            categories: decoratedCategories,
            title: {
                text: t('Pages.Overviewcard.CompletedFileCountForPatients.Category'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Overviewcard.CompletedFileCountForPatients.Units'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Overviewcard.CompletedFileCountForPatients.Unit'),
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
                name: t('Pages.Overviewcard.CompletedFileCountForPatients.FileCounts'),
                data: completedFileCountPatient.map(u => u.completedFileCount),
            },
            {
                name: t('Pages.Overviewcard.CompletedFileCountForPatients.PatientCounts'),
                data: completedFileCountPatient.map(u => u.patientCount),
            },
        ],
    };

    const completedFileCount = completedFileCountPatient.reduce((total, value) => { return total + value.completedFileCount }, 0)
    const patientCount = completedFileCountPatient.reduce((total, value) => { return total + value.patientCount }, 0)

    const percent = ((completedFileCount / patientCount) * 100).toFixed(2)
    const targetpercent = 95

    useEffect(() => {
        if (startDate && endDate && GetCompletedFileCountForPatients) {
            GetCompletedFileCountForPatients({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
        }
    }, [startDate, endDate, GetCompletedFileCountForPatients])

    return (
        <TabPane loading={isCompletedFileCountPatientLoading}>
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.CompletedFileCountForPatients.TotalFileCount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${completedFileCount} ${t('Pages.Overviewcard.CompletedFileCountForPatients.Unit')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.CompletedFileCountForPatients.TotalUserCount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${patientCount} ${t('Pages.Overviewcard.CompletedFileCountForPatients.Person')}`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.CompletedFileCountForPatients.Percent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${percent} %`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.CompletedFileCountForPatients.Targetpercent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${targetpercent} %`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <HighchartsReact highcharts={Highcharts} options={options} />
        </TabPane>
    )
}
