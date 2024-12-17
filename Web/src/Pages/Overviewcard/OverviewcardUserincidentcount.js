import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import React, { useEffect } from 'react'
import { Card, Label, TabPane } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

export default function OverviewcardUserincidentcount(props) {

    const { Profile, startDate, endDate, Overviewcards, GetUserincidentcount } = props

    const t = Profile?.i18n?.t
    const { userIncidentCount, isUserIncidentCountLoading } = Overviewcards

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

    const decoratedCategories = (userIncidentCount || []).map(data => {
        const { key } = data
        const targetKey = new Date(key)
        return categories[Profile.Language][targetKey.getMonth()]
    })

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Overviewcard.OverviewcardUserincidentcount.Incidents'),
        },
        xAxis: {
            categories: decoratedCategories,
            title: {
                text: t('Pages.Overviewcard.OverviewcardUserincidentcount.Incident'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Overviewcard.OverviewcardUserincidentcount.UnitCount'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Overviewcard.OverviewcardUserincidentcount.Unit'),
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
                name: t('Pages.Overviewcard.OverviewcardUserincidentcount.Totalincidentcount'),
                data: userIncidentCount.map(u => u.totalIncidentCount),
            },
        ],
    };

    const totalIncidentCount = userIncidentCount.reduce((total, value) => { return total + value.totalIncidentCount }, 0)

    const targetpercent = 0

    useEffect(() => {
        if (startDate && endDate && GetUserincidentcount) {
            GetUserincidentcount({
                data: {
                    Startdate: new Date(startDate),
                    Enddate: new Date(endDate),
                }
            })
        }
    }, [startDate, endDate, GetUserincidentcount])

    return (
        <TabPane loading={isUserIncidentCountLoading}>
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardUserincidentcount.Totalincidentcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalIncidentCount} ${t('Pages.Overviewcard.OverviewcardUserincidentcount.Unit')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewcard.OverviewcardUserincidentcount.Targetpercent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${targetpercent} ${t('Pages.Overviewcard.OverviewcardUserincidentcount.Unit')}`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <HighchartsReact highcharts={Highcharts} options={options} />
        </TabPane>
    )
}
