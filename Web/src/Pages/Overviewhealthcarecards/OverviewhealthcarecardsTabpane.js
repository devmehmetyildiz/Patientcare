import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, Label, TabPane } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

const OverviewhealthcarecardsTabpane = (props) => {

    const { type, record, patients, monthArray, Patienteventmovements, Patienteventdefines, Patienthealthcases, Patienthealthcasedefines, Profile } = props

    const t = Profile?.i18n?.t

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

    const decoratedCategories = (patients || []).map(data => {
        const { key } = data
        const targetKey = new Date(key)
        return categories[Profile.Language][targetKey.getMonth()]
    })

    const calculateSeries = () => {

        if (type === 'Event') {

            let resArr = []

            const patienteventmovements = (Patienteventmovements.list || []).filter(u => u.Isactive && u.EventID === record?.Uuid);

            for (const month of monthArray) {
                const startOfMonth = new Date(month)
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);
                const endtOfMonth = new Date(month)
                endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
                endtOfMonth.setDate(0);
                endtOfMonth.setHours(23, 59, 59, 999);

                const targetDate = startOfMonth.toDateString()

                const foundedPatienteventmovement = patienteventmovements
                    .filter(u =>
                        new Date(u.Occureddate).getTime() <= new Date(endtOfMonth).getTime() &&
                        new Date(u.Occureddate).getTime() >= new Date(startOfMonth).getTime()
                    )

                resArr.push({
                    key: targetDate,
                    count: foundedPatienteventmovement.length,
                })
            }
            return resArr
        } else {
            let resArr = []

            const patienthealthcases = (Patienthealthcases.list || []).filter(u => u.Isactive);

            for (const month of monthArray) {
                const startOfMonth = new Date(month)
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);
                const endtOfMonth = new Date(month)
                endtOfMonth.setMonth(endtOfMonth.getMonth() + 1);
                endtOfMonth.setDate(0);
                endtOfMonth.setHours(23, 59, 59, 999);

                const targetDate = startOfMonth.toDateString()

                const foundedPatienthealthcases = patienthealthcases
                    .filter(u =>
                        new Date(u.Createtime).getTime() <= new Date(endtOfMonth).getTime() &&
                        new Date(u.Createtime).getTime() >= new Date(startOfMonth).getTime()
                    )

                resArr.push({
                    key: targetDate,
                    count: foundedPatienthealthcases.length,
                })
            }
            return resArr
        }
    }

    const seriesCount = calculateSeries()

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Overviewhealthcarecard.Tab.Title'),
        },
        xAxis: {
            categories: decoratedCategories,
            title: {
                text: t('Pages.Overviewhealthcarecard.Tab.Months'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Overviewhealthcarecard.Tab.Count'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Overviewhealthcarecard.Tab.Unit'),
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
                name: t('Pages.Overviewhealthcarecard.Tab.Patientcount'),
                data: patients.map(u => u.patientCount),
            },
            {
                name: t('Pages.Overviewhealthcarecard.Tab.Eventcount'),
                data: seriesCount.map(u => u.count),
            },
        ],
    };

    const totalCount = seriesCount.reduce((total, value) => { return total + value.count }, 0)
    const totalPatientCount = patients.reduce((total, value) => { return total + value.patientCount }, 0)

    const percent = ((totalCount / (totalPatientCount)) * 100).toFixed(2)
    const targetpercent = 0

    return (
        <TabPane>
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewhealthcarecard.Tab.TotalEventcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalCount} ${t('Pages.Overviewhealthcarecard.Tab.Unit')}`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewhealthcarecard.Tab.TotalPatientcount')}
                        description={<div className='my-2'><Label basic color='blue' >{`${totalPatientCount} ${t('Pages.Overviewhealthcarecard.Tab.Unit')}`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <div className='w-full flex flex-row justify-between items-center gap-4'>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewhealthcarecard.Tab.Percent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${percent} %`}</Label></div>}
                    />
                </div>
                <div className='w-full'>
                    <Card
                        className='!w-full'
                        header={t('Pages.Overviewhealthcarecard.Tab.Targetpercent')}
                        description={<div className='my-2'><Label basic color='blue' >{`${targetpercent} %`}</Label></div>}
                    />
                </div>
            </div>
            <Pagedivider />
            <HighchartsReact highcharts={Highcharts} options={options} />
        </TabPane>
    )
}

export default OverviewhealthcarecardsTabpane