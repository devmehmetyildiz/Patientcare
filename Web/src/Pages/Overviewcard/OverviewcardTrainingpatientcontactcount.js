import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useEffect } from 'react'
import { Card, Label, TabPane } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

export default function OverviewcardTrainingusercount(props) {

    const { Profile, startDate, endDate, Overviewcards, GetTrainingCountPatientcontact } = props

    const t = Profile?.i18n?.t
    const { trainingCountPatientcontact, isTrainingCountPatientcontactLoading } = Overviewcards

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

    const decoratedCategories = (trainingCountPatientcontact || []).map(data => {
        const { key } = data
        const targetKey = new Date(key)
        return categories[Profile.Language][targetKey.getMonth()]
    })

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Traning'),
        },
        xAxis: {
            categories: decoratedCategories,
            title: {
                text: t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Contacts'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.PersonCount'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Person'),
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
                name: t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Contact'),
                data: trainingCountPatientcontact.map(u => u.totalPatientcontactCount),
            },
            {
                name: t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Participated'),
                data: trainingCountPatientcontact.map(u => u.totalParticipatedPatientContactCount),
            },
            {
                name: t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Trainingcount'),
                data: trainingCountPatientcontact.map(u => u.totalTraningCount),
            },
        ],
    };

    const totalTrainingCount = trainingCountPatientcontact.reduce((total, value) => { return total + value.totalTraningCount }, 0)
    const totalParticipatedPatientcontactCount = trainingCountPatientcontact.reduce((total, value) => { return total + value.totalParticipatedPatientContactCount }, 0)
    const totalPatientcontactCount = trainingCountPatientcontact.reduce((total, value) => { return total + value.totalPatientcontactCount }, 0)

    const percent = ((totalParticipatedPatientcontactCount / (totalTrainingCount * totalPatientcontactCount)) * 100).toFixed(2)
    const targetpercent = 35

    useEffect(() => {
        if (startDate && endDate && GetTrainingCountPatientcontact) {
            GetTrainingCountPatientcontact({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
        }
    }, [startDate, endDate, GetTrainingCountPatientcontact])

    return (
        <TabPane loading={isTrainingCountPatientcontactLoading}>
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Totalpatientcontactcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalPatientcontactCount} ${t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Person')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Totaltrainingcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalTrainingCount} ${t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Person')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Totalparticipatedpatientcontactcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalParticipatedPatientcontactCount} ${t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Person')}`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Percent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${percent} %`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingpatientcontactcount.Targetpercent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${targetpercent} %`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <HighchartsReact highcharts={Highcharts} options={options} />
        </TabPane>
    )
}
