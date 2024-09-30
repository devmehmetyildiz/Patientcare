import React, { useEffect } from 'react'
import { Contentwrapper, Headerwrapper, Pagedivider, Pagewrapper } from '../../Components'
import { Breadcrumb, Grid, GridColumn, Tab } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import OverviewPatients from './Components/OverviewPatients'
import OverviewPatientevents from './Components/OverviewPatientevents'
import OverviewPatientlinechartMovements from './Components/OverviewPatientlinechartMovements'
import OverviewPatientlinechartCapasite from './Components/OverviewPatientlinechartCapasite'
import OverviewPatientpiechartPatienttype from './Components/OverviewPatientpiechartPatienttype'
import OverviewPatientpiechartCostumertype from './Components/OverviewPatientpiechartCostumertype'
import OverviewPatientpiechartMedicalboardreport from './Components/OverviewPatientpiechartMedicalboardreport'
import OverviewPatientpiechartDependency from './Components/OverviewPatientpiechartDependency'

export default function Overview(props) {

    const { GetPatients, GetPatientdefines, GetPatienteventdefines, GetFiles, GetUsagetypes, GetUsers, GetProfessions,
        GetCompanycashmovements, GetStocks, GetPurchaseorders, GetStockdefines, GetStockmovements, GetStocktypes,
        GetStocktypegroups, GetUnits, GetCases, GetCostumertypes, GetPatienttypes, GetTrainings, GetDepartments } = props

    const { Patients, Patientdefines, Patienteventdefines, Files, Usagetypes, Users, Professions, Companycashmovements,
        Stocks, Stockdefines, Stocktypes, Stocktypegroups, Purchaseorders, Cases, Costumertypes, Patienttypes, Trainings,
        Units, Departments, Profile, } = props

    const t = Profile?.i18n?.t

    useEffect(() => {
        GetPatients()
        GetPatientdefines()
        GetPatienteventdefines()
        GetFiles()
        GetUsagetypes()
        GetUsers()
        GetProfessions()
        GetCompanycashmovements()
        GetStocks()
        GetPurchaseorders()
        GetStockdefines()
        GetStockmovements()
        GetStocktypes()
        GetStocktypegroups()
        GetUnits()
        GetCases()
        GetCostumertypes()
        GetPatienttypes()
        GetTrainings()
        GetDepartments()
    }, [])

    return (
        <Pagewrapper>
            <Headerwrapper>
                <Grid columns='2' >
                    <GridColumn width={8}>
                        <Breadcrumb size='big'>
                            <Link to={"/Overview"}>
                                <Breadcrumb.Section>{t('Pages.Overview.Page.Header')}</Breadcrumb.Section>
                            </Link>
                        </Breadcrumb>
                    </GridColumn>
                </Grid>
            </Headerwrapper>
            <Pagedivider />
            <div className=' w-full flex flex-row  justify-center items-start gap-2'>
                <div className='w-full min-w-0 flex flex-col justify-center items-center gap-2'>
                    <Contentwrapper>
                        <Tab
                            className="w-full !bg-transparent"
                            panes={[
                                {
                                    menuItem: `${t('Pages.Overview.Tab.Patientslinechart.Movement')}`,
                                    pane: {
                                        key: 'movements',
                                        content: <OverviewPatientlinechartMovements
                                            Patients={Patients}
                                            Patientdefines={Patientdefines}
                                            Profile={Profile}
                                        />
                                    }
                                },
                                {
                                    menuItem: `${t('Pages.Overview.Tab.Patientslinechart.Totalview')}`,
                                    pane: {
                                        key: 'totalview',
                                        content: <OverviewPatientlinechartCapasite
                                            Patients={Patients}
                                            Patientdefines={Patientdefines}
                                            Profile={Profile}
                                        />
                                    }
                                },
                            ]}
                            renderActiveOnly={false}
                        />
                    </Contentwrapper>
                    <div className='w-full flex flex-row justify-between items-center gap-2 '>
                        <Contentwrapper additionalStyle={"w-auto "}>
                            <OverviewPatientpiechartPatienttype
                                Patients={Patients}
                                Patienttypes={Patienttypes}
                                Patientdefines={Patientdefines}
                                Profile={Profile}
                            />
                        </Contentwrapper>
                        <Contentwrapper additionalStyle={"w-auto "}>
                            <OverviewPatientpiechartCostumertype
                                Patients={Patients}
                                Costumertypes={Costumertypes}
                                Patientdefines={Patientdefines}
                                Profile={Profile}
                            />
                        </Contentwrapper>
                    </div>
                    <div className='w-full flex flex-row justify-between items-center gap-2 '>
                        <Contentwrapper additionalStyle={"w-auto "}>
                            <OverviewPatientpiechartMedicalboardreport
                                Patients={Patients}
                                Patientdefines={Patientdefines}
                                Profile={Profile}
                            />
                        </Contentwrapper>
                        <Contentwrapper additionalStyle={"w-auto "}>
                            <OverviewPatientpiechartDependency
                                Patients={Patients}
                                Patientdefines={Patientdefines}
                                Profile={Profile}
                            />
                        </Contentwrapper>
                    </div>
                </div>
                <div className="w-[500px] flex flex-col gap-2">
                    <OverviewPatients
                        Patients={Patients}
                        Cases={Cases}
                        Patientdefines={Patientdefines}
                        Profile={Profile}
                    />
                    <OverviewPatientevents
                        Patients={Patients}
                        Patienteventdefines={Patienteventdefines}
                        Patientdefines={Patientdefines}
                        Profile={Profile}
                    />
                </div>
            </div>
        </Pagewrapper>
    )
}
