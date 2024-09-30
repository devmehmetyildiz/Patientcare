import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'
import { DEPENDENCY_OPTION_FULLY, DEPENDENCY_OPTION_NON, DEPENDENCY_OPTION_PARTIAL } from '../../../Utils/Constants'

export default function OverviewPatientpiechartDependency(props) {
    const { Patients, Patientdefines, Profile } = props

    const t = Profile?.i18n?.t

    const isLoading = Patients.isLoading || Patientdefines.isLoading

    const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration)

    const livepatients = patients.filter(u => u.Isalive && !u.Isleft)

    const createOptions = () => {

        const Dependencyoptions = [
            { key: 0, text: "TAM BAĞIMLI", value: DEPENDENCY_OPTION_FULLY },
            { key: 1, text: "KISMİ BAĞIMLI", value: DEPENDENCY_OPTION_PARTIAL },
            { key: 2, text: "BAĞIMSIZ", value: DEPENDENCY_OPTION_NON }
        ]

        const data = Dependencyoptions.map(dependency => {
            const dependencypatients = livepatients.filter(patient => {
                const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                return patientdefine?.Dependency === dependency.value
            })
            const dependencyname = Dependencyoptions.find(u => u.value === dependency.value)?.text
            return {
                name: dependencyname || t('Common.NoDataFound'),
                y: dependencypatients.length || 0
            }
        })

        const title = {
            en: "Active Dependency Types",
            tr: "Aktif Bağımlılık Türleri"
        }

        const legendname = {
            en: "Patient Count",
            tr: "Hasta Sayısı"
        }

        const options = {
            chart: {
                type: 'pie',
                className: ' !w-full !h-auto !min-w-0'
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
