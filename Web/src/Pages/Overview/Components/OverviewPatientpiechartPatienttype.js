import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'

export default function OverviewPatientpiechartPatienttype(props) {
    const { Patients, Patienttypes, Patientdefines, Profile } = props

    const history = useHistory()

    const t = Profile?.i18n?.t

    const isLoading = Patients.isLoading || Patientdefines.isLoading || Patienttypes.isLoading
    const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration)

    const livepatients = patients.filter(u => u.Isalive && !u.Isleft)

    const createOptions = () => {

        const patienttypes = [...new Set(patients.map(patient => {
            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            return patientdefine?.PatienttypeID
        }))]

        const data = patienttypes.map(patienttype => {
            const patienttypepatients = livepatients.filter(patient => {
                const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                return patientdefine?.PatienttypeID === patienttype
            })
            const patienttypedata = (Patienttypes.list || []).find(u => u.Uuid === patienttype)
            return {
                name: patienttypedata?.Name || t('Common.NoDataFound'),
                value: patienttypedata?.Uuid || null,
                y: patienttypepatients.length || 0
            }
        })

        const title = {
            en: "Active Patient Type",
            tr: "Aktif Hasta Türleri"
        }

        const legendname = {
            en: "Patient Count",
            tr: "Hasta Sayısı"
        }

        const options = {
            chart: {
                type: 'pie',
                className: ' !w-full !h-auto !min-w-0',
            },
            title: {
                text: title[Profile.Language],
            },
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                itemMarginBottom: 5,
                itemStyle: {
                    fontSize: '12px',
                },
            },
            series: [
                {
                    name: legendname[Profile.Language],
                    data: data,
                    showInLegend: true,
                },
            ],
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                    },
                    point: {
                        events: {
                            click: function () {
                                history.push(`/Patientfollowup?tab=patienttypes`)
                            },
                        },
                    },
                },
            },
        };


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
