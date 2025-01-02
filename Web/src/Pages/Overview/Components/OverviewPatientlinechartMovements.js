import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'

export default function OverviewPatientlinechartMovements(props) {
    const { Profile, Overviewcards } = props

    const { patientIncomeOutcome, isPatientIncomeOutcomeLoading } = Overviewcards

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

    const enters = {
        en: "Organization Enters",
        tr: "Kuruma Girişler"
    }

    const deads = {
        en: "Deaths",
        tr: "Vefatlar"
    }

    const lefts = {
        en: "Lefts",
        tr: "Ayrılmalar"
    }

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
                type: 'column',
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
                min: 0,
                title: {
                    text: value[Profile.Language],
                },
            },
            series: [
                {
                    name: enters[Profile.Language],
                    data: patientIncomeOutcome.map(u => u.enterCount)
                },
                {
                    name: deads[Profile.Language],
                    data: patientIncomeOutcome.map(u => u.deadCount)
                },
                {
                    name: lefts[Profile.Language],
                    data: patientIncomeOutcome.map(u => u.leftCount)
                },
            ],
        }

        return options
    }


    return (<DimmerDimmable>
        <Dimmer active={isPatientIncomeOutcomeLoading} inverted>
            <Loader inline={'centered'} inverted />
        </Dimmer>
        <HighchartsReact highcharts={Highcharts} options={createOptions()} />
    </DimmerDimmable >
    )
}
