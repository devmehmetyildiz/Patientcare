import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button, Tab } from 'semantic-ui-react'
import { Contentwrapper, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper } from '../../Components'
import {
    CASE_PATIENT_STATUS_DEATH, CASE_PATIENT_STATUS_LEFT, DEPENDENCY_OPTION_FULLY, DEPENDENCY_OPTION_NON, DEPENDENCY_OPTION_PARTIAL, GENDER_OPTION_MEN, GENDER_OPTION_WOMEN,
    MEDICALBOARDREPORT_OPTION_MENTAL, MEDICALBOARDREPORT_OPTION_PHYSICAL, MEDICALBOARDREPORT_OPTION_SPIRITUAL
} from '../../Utils/Constants'

import PatientfollowupPatienttypes from '../../Containers/Patientfollowup/PatientfollowupPatienttypes'
import PatientfollowupPatientcases from '../../Containers/Patientfollowup/PatientfollowupPatientcases'
import PatientfollowupPatientmedicalboardreport from '../../Containers/Patientfollowup/PatientfollowupPatientmedicalboardreport'
import PatientfollowupPatientdependency from '../../Containers/Patientfollowup/PatientfollowupPatientdependency'
import PatientfollowupPatientgender from '../../Containers/Patientfollowup/PatientfollowupPatientgender'
import PatientfollowupCostumertype from '../../Containers/Patientfollowup/PatientfollowupCostumertype'
import PatientfollowupDisbanded from '../../Containers/Patientfollowup/PatientfollowupDisbanded'
import { useLocation } from 'react-router-dom'
import useTabNavigation from '../../Hooks/useTabNavigation'
import PatientfollowupPatientages from '../../Containers/Patientfollowup/PatientfollowupPatientages'

export default function Patientfollowup(props) {
    const { GetPatients, GetPatientdefines, GetPatienttypes, GetCostumertypes, GetCases, GetBeds, history } = props
    const { Patients, Patientdefines, Profile, closeModal, Cases, Patienttypes, Costumertypes, GetDepartments, Beds, Departments } = props

    const t = Profile?.i18n?.t

    const isLoading =
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Cases.isLoading ||
        Costumertypes.isLoading ||
        Departments.isLoading ||
        Patienttypes.isLoading

    const cases = (Cases.list || [])
        .filter(u => u.Isactive)
        .filter(u => u.Patientstatus !== CASE_PATIENT_STATUS_DEATH && u.Patientstatus !== CASE_PATIENT_STATUS_LEFT)
        .map(casedata => {
            const departmentuuids = (casedata?.Departmentuuids || []).map(u => u.DepartmentID);
            let isHavepatients = false
            departmentuuids.forEach(departmentuuid => {
                const department = (Departments.list || []).find(u => u.Uuid === departmentuuid)
                if (department?.Ishavepatients === true || department?.Ishavepatients === 1) {
                    isHavepatients = true
                }
            });
            return isHavepatients === true && casedata?.CaseStatus === 0 ? casedata : false
        }).filter(u => u)

    const disbandedCases = (Cases.list || []).filter(u => u.Isactive).filter(u => u.Patientstatus === CASE_PATIENT_STATUS_DEATH || u.Patientstatus === CASE_PATIENT_STATUS_LEFT).map(u => u?.Uuid)

    const patients = (Patients.list || [])
        .filter(u => u.Isactive && !u.Iswaitingactivation)
        .filter(u => !((disbandedCases || []).includes(u?.CaseID)))

    const medicalboardreportoptions = [
        { key: 0, text: t('Option.Medicalboardreportoption.Spiritual'), value: MEDICALBOARDREPORT_OPTION_SPIRITUAL },
        { key: 1, text: t('Option.Medicalboardreportoption.Physical'), value: MEDICALBOARDREPORT_OPTION_PHYSICAL },
        { key: 2, text: t('Option.Medicalboardreportoption.Mental'), value: MEDICALBOARDREPORT_OPTION_MENTAL }
    ]

    const dependencyoptions = [
        { key: 0, text: t('Option.Dependencyoption.Fully'), value: DEPENDENCY_OPTION_FULLY },
        { key: 1, text: t('Option.Dependencyoption.Partial'), value: DEPENDENCY_OPTION_PARTIAL },
        { key: 2, text: t('Option.Dependencyoption.Non'), value: DEPENDENCY_OPTION_NON }
    ]

    const genderoptions = [
        { key: 0, text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
        { key: 1, text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
    ]

    const patienttypes = (Patienttypes.list || []).filter(u => u.Isactive)
    const costumertypes = (Costumertypes.list || []).filter(u => u.Isactive)
    const bedCount = (Beds.list || []).filter(u => u.Isactive).length

    const disbandedPatients = (Patients.list || [])
        .filter(u => u.Isactive && !u.Iswaitingactivation)
        .filter(u => (disbandedCases || []).includes(u?.CaseID))

    const tabOrder = [
        'patienttypes',
        'patientcases',
        'patientmedicalboardreport',
        'patientdependency',
        'patientgenders',
        'costumertypes',
        'patientdisbandeds',
        'patientages',
    ]

    useEffect(() => {
        GetPatients()
        GetPatientdefines()
        GetPatienttypes()
        GetCostumertypes()
        GetCases()
        GetDepartments()
        GetBeds()
    }, [])


    const { activeTab, setActiveTab } = useTabNavigation({
        history,
        tabOrder,
        mainRoute: 'Patientfollowup',
    })

    return (
        <Pagewrapper dimmer isLoading={isLoading}>
            <Headerwrapper>
                <Headerbredcrump>
                    <Link to={"/Patientfollowup"}>
                        <Breadcrumb.Section >{t('Pages.Patientfollowup.Page.Header')}</Breadcrumb.Section>
                    </Link>
                </Headerbredcrump>
                {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
            </Headerwrapper>
            <Pagedivider />
            <Contentwrapper>
                <Form>
                    <Tab
                        onTabChange={(_, { activeIndex }) => {
                            setActiveTab(activeIndex)
                        }}
                        activeIndex={activeTab}
                        className="w-full bg-white"
                        panes={[
                            {
                                menuItem: t('Pages.Patientfollowup.Tab.Patienttype'),
                                render: () => <PatientfollowupPatienttypes
                                    patients={patients}
                                    patienttypes={patienttypes}
                                    bedCount={bedCount}
                                />
                            },
                            {
                                menuItem: t('Pages.Patientfollowup.Tab.Patientcase'),
                                render: () => <PatientfollowupPatientcases
                                    patients={patients}
                                    cases={cases}
                                    bedCount={bedCount}
                                />
                            },
                            {
                                menuItem: t('Pages.Patientfollowup.Tab.Patientmedicalreport'),
                                render: () => <PatientfollowupPatientmedicalboardreport
                                    patients={patients}
                                    medicalboardreportoptions={medicalboardreportoptions}
                                    bedCount={bedCount}
                                />
                            },
                            {
                                menuItem: t('Pages.Patientfollowup.Tab.Patientdependency'),
                                render: () => <PatientfollowupPatientdependency
                                    patients={patients}
                                    dependencyoptions={dependencyoptions}
                                    bedCount={bedCount}
                                />
                            },
                            {
                                menuItem: t('Pages.Patientfollowup.Tab.Patientgender'),
                                render: () => <PatientfollowupPatientgender
                                    patients={patients}
                                    genderoptions={genderoptions}
                                    bedCount={bedCount}
                                />
                            },
                            {
                                menuItem: t('Pages.Patientfollowup.Tab.Patientcostumertype'),
                                render: () => <PatientfollowupCostumertype
                                    patients={patients}
                                    costumertypes={costumertypes}
                                    bedCount={bedCount}
                                />
                            },
                            {
                                menuItem: t('Pages.Patientfollowup.Tab.Patientdisand'),
                                render: () => <PatientfollowupDisbanded
                                    patients={disbandedPatients}
                                    bedCount={bedCount}
                                />
                            },
                            {
                                menuItem: t('Pages.Patientfollowup.Tab.Age'),
                                render: () => <PatientfollowupPatientages
                                    patients={patients}
                                    bedCount={bedCount}
                                />
                            },
                        ]}
                        renderActiveOnly
                    />
                </Form>
            </Contentwrapper>
        </Pagewrapper >
    )
}