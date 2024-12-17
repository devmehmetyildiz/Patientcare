import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'

export default function OverviewPatientlinechartCapasite(props) {
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

    const patienttitle = {
        en: "Patients",
        tr: "Kurumadaki Hastalar"
    }

    const isLoading = Patients.isLoading || Patientdefines.isLoading

    const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration)

    let patientcount = []

    for (let index = 1; index <= current.getMonth() + 1; index++) {
        const monthstart = createMonth(index - 1)
        const monthend = createMonth(index)

        const count = patients
            .filter(u => new Date(u.Approvaldate).getTime() < monthend.getTime() && u.Ischecked && u.Isapproved && !u.Ispreregistration && u.Isactive)
            .filter(u => {
                if (!u.Isleft && u.Isalive) {
                    return true
                }
                if (u.Isalive && u.Isleft && new Date(u.Leavedate).getTime() > monthstart.getTime()) {
                    return true
                }
                if (!u.Isleft && !u.Isalive && new Date(u.Deathdate).getTime() > monthstart.getTime()) {
                    return true
                }
            })


        patientcount.push(
            count.length || 0
        )
    }

    const max = Math.max(...patientcount);
    const min = Math.min(...patientcount);

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
                    data: patientcount
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
