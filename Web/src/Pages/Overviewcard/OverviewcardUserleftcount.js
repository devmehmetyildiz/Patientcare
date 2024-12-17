import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useEffect } from 'react'
import { Card, Label, TabPane } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

export default function OverviewcardUserleftcount(props) {

    const { Profile, startDate, endDate, Overviewcards, GetUserleftcount } = props

    const t = Profile?.i18n?.t
    const { userLeftCount, isuserLeftCountLoading } = Overviewcards

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

    const decoratedCategories = (userLeftCount || []).map(data => {
        const { key } = data
        const targetKey = new Date(key)
        return categories[Profile.Language][targetKey.getMonth()]
    })

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Overviewcard.OverviewcardUserleftcount.Lefts'),
        },
        xAxis: {
            categories: decoratedCategories,
            title: {
                text: t('Pages.Overviewcard.OverviewcardUserleftcount.Users'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Overviewcard.OverviewcardUserleftcount.PersonCount'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Overviewcard.OverviewcardUserleftcount.Person'),
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
                name: t('Pages.Overviewcard.OverviewcardUserleftcount.Userleft'),
                data: userLeftCount.map(u => u.totalLeftCount),
            },
            {
                name: t('Pages.Overviewcard.OverviewcardUserleftcount.UserWorking'),
                data: userLeftCount.map(u => u.totalUserCount),
            },
        ],
    };

    const totalLeftCount = userLeftCount.reduce((total, value) => { return total + value.totalLeftCount }, 0)
    const totalUserCount = userLeftCount.reduce((total, value) => { return total + value.totalUserCount }, 0)
    const forPercentUserCount = userLeftCount.reduce((total, value, index, arr) => { return index === 0 || index === arr.length - 1 ? total + value.totalUserCount : 0 }, 0)

    const percent = ((totalLeftCount / (forPercentUserCount / 2)) * 100).toFixed(2)
    const targetpercent = 10

    useEffect(() => {
        if (startDate && endDate && GetUserleftcount) {
            GetUserleftcount({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
        }
    }, [startDate, endDate, GetUserleftcount])

    return (
        <TabPane loading={isuserLeftCountLoading}>
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardUserleftcount.Totalleftcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalLeftCount} ${t('Pages.Overviewcard.OverviewcardUserleftcount.Person')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardUserleftcount.Totalworkingcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalUserCount} ${t('Pages.Overviewcard.OverviewcardUserleftcount.Person')}`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardUserleftcount.Percent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${percent} %`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardUserleftcount.Targetpercent')}
                        description={<div className='my-2'><Label basic color='blue' >{` < ${targetpercent} %`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <HighchartsReact highcharts={Highcharts} options={options} />
        </TabPane>
    )
}
