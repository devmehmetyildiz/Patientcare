import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'
import { MEDICALBOARDREPORT_OPTION_MENTAL, MEDICALBOARDREPORT_OPTION_PHYSICAL, MEDICALBOARDREPORT_OPTION_SPIRITUAL } from '../../../Utils/Constants'
import { useHistory } from 'react-router-dom'

export default function OverviewPatientpiechartMedicalboardreport(props) {
    const { Patients, Patientdefines, Profile } = props

    const history = useHistory()

    const t = Profile?.i18n?.t

    const isLoading = Patients.isLoading || Patientdefines.isLoading

    const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration)

    const livepatients = patients.filter(u => u.Isalive && !u.Isleft)

    const createOptions = () => {

        const Medicalboardreportoptions = [
            { key: 0, text: "RUHSAL", value: MEDICALBOARDREPORT_OPTION_SPIRITUAL },
            { key: 1, text: "BEDENSEL", value: MEDICALBOARDREPORT_OPTION_PHYSICAL },
            { key: 2, text: "ZİHİNSEL", value: MEDICALBOARDREPORT_OPTION_MENTAL }
        ]

        const data = Medicalboardreportoptions.map(report => {
            const reportpatients = livepatients.filter(patient => {
                const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                return patientdefine?.Medicalboardreport === report.value
            })
            
            return {
                name: report?.text || t('Common.NoDataFound'),
                value: report?.value,
                y: reportpatients.length || 0
            }
        })

        const title = {
            en: "Patients For Medical Board Report",
            tr: "Sağlık Kurul Raporuna Göre Hastalar"
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
                    point: {
                        events: {
                            click: function () {
                                history.push(`/Patientfollowup?tab=patientmedicalboardreport&type=medicalboardreport${this.value}`);
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
