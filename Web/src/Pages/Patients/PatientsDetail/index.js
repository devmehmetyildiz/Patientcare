import React, { useEffect } from 'react'
import PatientsDetailProfile from './PatientsDetailProfile'
import PatientsDetailInfo from './PatientsDetailInfo'
import PatientsDetailCard from './PatientsDetailCard'
import PatientsDetailFiles from './PatientsDetailFiles'
import PatientsDetailCase from './PatientsDetailCase'
import Pagewrapper from '../../../Components/Pagewrapper'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import validator from '../../../Utils/Validator'
import PatientDetailMovements from './PatientDetailMovements'
import PatientsDetailStocks from './PatientsDetailStocks'
import { Button, Dimmer, DimmerDimmable, Dropdown, Header, Icon, Loader, Modal } from 'semantic-ui-react'

export default function Patientsdetail(props) {

    const {
        GetPatient, handleSelectedPatient, fillPatientnotification, GetPatienttypes, GetCostumertypes,
        GetPatientdefines, GetFiles, GetUsagetypes, GetCases, GetDepartments, GetFloors, GetRooms, GetBeds,
        GetPatientcashmovements, GetPatientcashregisters, GetStocks, GetStockdefines, GetStockmovements, GetUsers,
        GetStocktypes, GetStocktypegroups, GetUnits
    } = props

    const { Patients, Patientdefines, Files, Cases, Departments, Usagetypes, Floors, Beds, Rooms,
        Patientcashregisters, Patientcashmovements, Costumertypes, Patienttypes, Stocks, Stockdefines,
        Stockmovements, Users, Stocktypes, Stocktypegroups, Units,
        PatientID, Profile } = props

    const location = useLocation()
    const params = useParams()
    const history = useHistory()
    const patientID = params?.PatientID || PatientID
    const t = Profile?.i18n?.t

    const patient = Patients?.selected_record
    const patientdefine = (Patientdefines?.list || []).find(u => u?.Uuid === patient?.PatientdefineID)

    useEffect(() => {
        if (validator.isUUID(patientID)) {
            GetPatient(patientID)
            GetPatientdefines()
            GetFiles()
            GetUsagetypes()
            GetCases()
            GetDepartments()
            GetPatienttypes()
            GetCostumertypes()
            GetFloors()
            GetRooms()
            GetBeds()
            GetPatientcashmovements()
            GetPatientcashregisters()
            GetStocks()
            GetStockdefines()
            GetStockmovements()
            GetUsers()
            GetStocktypes()
            GetStocktypegroups()
            GetUnits()
        } else {
            fillPatientnotification({
                type: 'Success',
                code: t('Pages.Patients.PatientsDetail.Page.Header'),
                description: t('Pages.Patients.PatientsDetail.Messages.UnsupportedPatientID'),
            });
            history.length > 1 ? history.goBack() : history.push('/Patients')
        }
    }, [])

    const isLoadingstatus =
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Files.isLoading ||
        Cases.isLoading ||
        Departments.isLoading ||
        Usagetypes.isLoading ||
        Floors.isLoading ||
        Beds.isLoading ||
        Rooms.isLoading ||
        Patientcashregisters.isLoading ||
        Patientcashmovements.isLoading ||
        Costumertypes.isLoading ||
        Patienttypes.isLoading ||
        Stocks.isLoading ||
        Stockdefines.isLoading ||
        Stockmovements.isLoading ||
        Users.isLoading ||
        Stocktypes.isLoading ||
        Stocktypegroups.isLoading ||
        Units.isLoading

    return (
        <Pagewrapper>
            <DimmerDimmable blurring={isLoadingstatus} dimmed>
                <Dimmer active={isLoadingstatus} inverted>
                    <Loader>Yükleniyor</Loader>
                </Dimmer>
                <div className='w-full flex flex-col md:flex-row lg:flex-row justify-center items-center md:items-start lg:items-start'>
                    <div className=' w-[30%] flex flex-col justify-start items-center'>
                        <PatientsDetailProfile
                            patient={patient}
                            patientdefine={patientdefine}
                            Files={Files}
                            Usagetypes={Usagetypes}
                            Profile={Profile}
                        />
                        <PatientsDetailCase
                            patient={patient}
                            Cases={Cases}
                            Departments={Departments}
                            Profile={Profile}
                        />
                        <PatientsDetailInfo
                            patient={patient}
                            patientdefine={patientdefine}
                            Costumertypes={Costumertypes}
                            Patienttypes={Patienttypes}
                            Profile={Profile}
                        />
                        <PatientDetailMovements
                            patient={patient}
                            Users={Users}
                            Profile={Profile}
                        />
                    </div>
                    <div className=' w-full mx-4 flex flex-col justify-start items-center'>
                        <div className='px-4 pb-2 w-full'>
                            <Dropdown
                                text='İşlemler'
                                icon='filter'
                                floating
                                fluid
                                labeled
                                button
                                className='!bg-[#2355a0] !text-white icon'
                            >
                                <Dropdown.Menu>
                                    <Dropdown.Header icon='tags' content='İşlemler' />
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => { alert("Important") }}>
                                        <Icon name='attention' className='right floated' />
                                        Ürün Aktar
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='comment' className='right floated' />
                                        Ürün Tüket
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        Yatak Değiştir
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        Para Girişi
                                    </Dropdown.Item>
                                    <Dropdown.Header icon='setting' content='Düzenlemeler' />
                                    <Dropdown.Divider />
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        Rutinleri Düzenle
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        Destek Planları Düzenle
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        Dosyaları Düzenle
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        Tanımları Düzenle
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <PatientsDetailCard
                            patient={patient}
                            Floors={Floors}
                            Rooms={Rooms}
                            Beds={Beds}
                            Patientcashmovements={Patientcashmovements}
                            Patientcashregisters={Patientcashregisters}
                            Profile={Profile}
                        />
                        <PatientsDetailFiles
                            patient={patient}
                            Files={Files}
                            Usagetypes={Usagetypes}
                            fillnotification={fillPatientnotification}
                            Profile={Profile}
                        />
                        <PatientsDetailStocks
                            patient={patient}
                            Stocks={Stocks}
                            Stocktypegroups={Stocktypegroups}
                            Stocktypes={Stocktypes}
                            Stockdefines={Stockdefines}
                            Units={Units}
                            Stockmovements={Stockmovements}
                            Profile={Profile}
                        />
                    </div>
                </div>
            </DimmerDimmable>
        </Pagewrapper>
    )
}
