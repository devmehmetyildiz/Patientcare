import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'

export default function OverviewPatientlinechartCapasite(props) {
    const { Profile, Overviewcards } = props

    const { stayedPatientCount, isStayedPatientCountLoading } = Overviewcards

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

    const patienttitle = {
        en: "Patients",
        tr: "Kurumadaki Hastalar"
    }

    const max = Math.max(...stayedPatientCount.map(u => u.value));
    const min = Math.min(...stayedPatientCount.map(u => u.value));

    const createOptions = () => {

        const value = {
            en: "Patient Count",
            tr: "Hasta Sayısı"
        }

        const title = {
            en: "Months",
            tr: "Aylar"
        }

        const options = {
            chart: {
                type: 'line',
            },
            title: {
                text: null,
            },
            xAxis: {
                categories: categories[Profile.Language],
                title: {
                    text: title[Profile.Language],
                },
            },
            yAxis: {
                min: min - 10 < 0 ? 0 : min - 10,
                max: max + 10,
                title: {
                    text: value[Profile.Language],
                },
            },
            series: [
                {
                    name: patienttitle[Profile.Language],
                    data: [...stayedPatientCount.map(u => u.value)]
                },

            ],
        }

        return options
    }


    return (<DimmerDimmable>
        <Dimmer active={isStayedPatientCountLoading} inverted>
            <Loader inline={'centered'} inverted />
        </Dimmer>
        <HighchartsReact highcharts={Highcharts} options={createOptions()} />
    </DimmerDimmable >
    )
}
