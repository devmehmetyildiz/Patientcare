import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useEffect } from 'react'
import { Card, Label, TabPane } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

export default function OverviewcardTrainingusercount(props) {

    const { Profile, startDate, endDate, Overviewcards, GetTrainingCountPersonel } = props

    const t = Profile?.i18n?.t
    const { trainingCountPersonel, isTrainingCountPersonelLoading } = Overviewcards

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

    const decoratedCategories = (trainingCountPersonel || []).map(data => {
        const { key } = data
        const targetKey = new Date(key)
        return categories[Profile.Language][targetKey.getMonth()]
    })

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Overviewcard.OverviewcardTrainingusercount.Traning'),
        },
        xAxis: {
            categories: decoratedCategories,
            title: {
                text: t('Pages.Overviewcard.OverviewcardTrainingusercount.Users'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Overviewcard.OverviewcardTrainingusercount.PersonCount'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Overviewcard.OverviewcardTrainingusercount.Person'),
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
                name: t('Pages.Overviewcard.OverviewcardTrainingusercount.Worker'),
                data: trainingCountPersonel.map(u => u.totalUserCount),
            },
            {
                name: t('Pages.Overviewcard.OverviewcardTrainingusercount.Participated'),
                data: trainingCountPersonel.map(u => u.totalParticipatedUserCount),
            },
            {
                name: t('Pages.Overviewcard.OverviewcardTrainingusercount.Trainingcount'),
                data: trainingCountPersonel.map(u => u.totalTraningCount),
            },
        ],
    };

    const totalTrainingCount = trainingCountPersonel.reduce((total, value) => { return total + value.totalTraningCount }, 0)
    const totalParticipatedUserCount = trainingCountPersonel.reduce((total, value) => { return total + value.totalTraningCount }, 0)
    const totalUserCount = trainingCountPersonel.reduce((total, value) => { return total + value.totalUserCount }, 0)

    const percent = ((totalParticipatedUserCount / (totalTrainingCount * totalUserCount)) * 100).toFixed(2)
    const targetpercent = 70

    useEffect(() => {
        if (startDate && endDate && GetTrainingCountPersonel) {
            GetTrainingCountPersonel({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
        }
    }, [startDate, endDate, GetTrainingCountPersonel])



    return (
        <TabPane loading={isTrainingCountPersonelLoading}>
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingusercount.Totalusercount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalUserCount} ${t('Pages.Overviewcard.OverviewcardTrainingusercount.Person')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingusercount.Totaltrainingcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalTrainingCount} ${t('Pages.Overviewcard.OverviewcardTrainingusercount.Person')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingusercount.Totalparticipatedusercount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalParticipatedUserCount} ${t('Pages.Overviewcard.OverviewcardTrainingusercount.Person')}`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingusercount.Percent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${percent} %`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardTrainingusercount.Targetpercent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${targetpercent} %`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <HighchartsReact highcharts={Highcharts} options={options} />
        </TabPane>
    )
}
