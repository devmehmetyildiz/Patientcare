import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'

export default function OverviewPatientlinechartMovements(props) {
    const { Patients, Patientdefines, Profile } = props

    const t = Profile?.i18n?.t

    const current = new Date()
    current.setDate(1)
    current.setHours(0)
    current.setMinutes(0)
    current.setSeconds(0)


    const createMonth = (month) => {
        const datacurrent = new Date()
        datacurrent.setMonth(month)
        datacurrent.setDate(1)
        datacurrent.setHours(0)
        datacurrent.setMinutes(0)
        datacurrent.setSeconds(0)
        return datacurrent
    }

    const checkDateIfItsBigger = (_startdate, _enddate) => {
        const startdate = new Date(_startdate)
        const enddate = new Date(_enddate)

        if (startdate.getTime() > enddate.getTime()) {
            return true
        } else {
            return false
        }
    }

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

    const isLoading = Patients.isLoading || Patientdefines.isLoading

    const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration)

    const livepatients = patients.filter(u => u.Isalive && !u.Isleft)

    const enterpatients = patients.filter(u => u.Isalive && checkDateIfItsBigger(u.Approvaldate, current))

    const deadpatients = patients.filter(u => !u.Isalive && checkDateIfItsBigger(u.Deathdate, current))

    const leftpatients = patients.filter(u => u.Isleft && checkDateIfItsBigger(u.Leavedate, current))

    let enterData = []
    let leftData = []
    let deadData = []

    for (let index = 1; index <= 12; index++) {
        const monthstart = createMonth(index)
        const monthend = createMonth(index + 1)

        const monthlyenters = patients.filter(u => u.Isalive && checkDateIfItsBigger(u.Approvaldate, monthstart) && !checkDateIfItsBigger(u.Approvaldate, monthend))

        enterData.push(
            monthlyenters.length || 0
        )
    }

    for (let index = 1; index <= 12; index++) {
        const monthstart = createMonth(index)
        const monthend = createMonth(index + 1)

        const monthlydead = patients.filter(u => u.Isalive && checkDateIfItsBigger(u.Deathdate, monthstart) && !checkDateIfItsBigger(u.Deathdate, monthend))

        deadData.push(
            monthlydead.length || 0
        )
    }

    for (let index = 1; index <= 12; index++) {
        const monthstart = createMonth(index)
        const monthend = createMonth(index + 1)

        const monthlyleft = patients.filter(u => u.Isalive && checkDateIfItsBigger(u.Leavedate, monthstart) && !checkDateIfItsBigger(u.Leavedate, monthend))

        leftData.push(
            monthlyleft.length || 0
        )
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
                    data: enterData
                },
                {
                    name: deads[Profile.Language],
                    data: deadData
                },
                {
                    name: lefts[Profile.Language],
                    data: leftData
                },
            ],
        }

        return options
    }


    return (<DimmerDimmable>
        <Dimmer active={isLoading} inverted>
            <Loader inline={'centered'} inverted />
        </Dimmer>
        <HighchartsReact highcharts={Highcharts} options={createOptions()} />
    </DimmerDimmable >
    )
}
