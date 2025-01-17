import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'

export default function OverviewPatientpiechartCostumertype(props) {
    const { Patients, Costumertypes, Patientdefines, Profile } = props

    const history = useHistory()

    const t = Profile?.i18n?.t

    const isLoading = Patients.isLoading || Patientdefines.isLoading || Costumertypes.isLoading

    const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration)

    const livepatients = patients.filter(u => u.Isalive && !u.Isleft)

    const createOptions = () => {

        const costumertypes = [...new Set(patients.map(patient => {
            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            return patientdefine?.CostumertypeID
        }))]

        const data = costumertypes.map(costumertype => {
            const costumertypepatients = livepatients.filter(patient => {
                const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                return patientdefine?.CostumertypeID === costumertype
            })
            const costumertypedata = (Costumertypes.list || []).find(u => u.Uuid === costumertype)
            return {
                name: costumertypedata?.Name || t('Common.NoDataFound'),
                value: costumertypedata?.Uuid || null,
                y: costumertypepatients.length || 0
            }
        })

        const title = {
            en: "Active Costumer Type",
            tr: "Aktif Müşteri Türleri"
        }

        const legendname = {
            en: "Patient Count",
            tr: "Hasta Sayısı"
        }

        const options = {
            chart: {
                type: 'pie',
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
            series: {
                name: legendname[Profile.Language],
                data: data,
                showInLegend: true,
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                    },
                    point: {
                        events: {
                            click: function () {
                                history.push(`/Patientfollowup?tab=costumertypes&type=${this.value}`);
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
