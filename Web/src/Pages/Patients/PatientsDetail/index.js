import React, { useEffect, useState } from 'react'
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
import PatientsLeftModal from '../../../Containers/Patients/PatientsLeftModal'
import PatientsDeadModal from '../../../Containers/Patients/PatientsDeadModal'

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

    const [opendead, setOpendead] = useState(false)
    const [openleft, setOpenleft] = useState(false)
    const [record, setRecord] = useState(null)
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
                                    <Dropdown.Header icon='tags' content={t('Pages.Patients.PatientsDetail.Button.Processtag')} />
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => { alert("Important") }}>
                                        <Icon name='attention' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Insertstock')}
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='comment' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Removestock')}
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Editplace')}
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Insertcash')}
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Editcase')}
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Editstatus')}
                                    </Dropdown.Item>
                                    <Dropdown.Header icon='setting' content={t('Pages.Patients.PatientsDetail.Button.Settingtag')} />
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => { history.push(`/Patients/${patientID}/Editcash`) }}>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Editcash')}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => { history.push(`/Patients/${patientID}/Editroutine`) }}>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Editroutine')}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => { history.push(`/Patients/${patientID}/Editsupportplan`) }}>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Editsupportplans')}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => { history.push(`/Patients/${patientID}/Editfile`) }}>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Editfiles')}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => { history.push(`/Patientdefines/${patientdefine?.Uuid}/edit`) }}>
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Editdefine')}
                                    </Dropdown.Item>
                                    <Dropdown.Header icon='setting' content={t('Pages.Patients.PatientsDetail.Button.Specialtag')} />
                                    <Dropdown.Divider />
                                    <Dropdown.Item
                                        onClick={() => {
                                            setRecord(patient)
                                            setOpenleft(true)
                                        }}
                                    >
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Removefromorganization')}
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => {
                                            setRecord(patient)
                                            setOpendead(true)
                                        }}
                                    >
                                        <Icon name='conversation' className='right floated' />
                                        {t('Pages.Patients.PatientsDetail.Button.Enterdead')}
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
            <PatientsLeftModal
                open={openleft}
                setOpen={setOpenleft}
                record={record}
                setRecord={setRecord}
            />
            <PatientsDeadModal
                open={opendead}
                setOpen={setOpendead}
                record={record}
                setRecord={setRecord}
            />
        </Pagewrapper >
    )
}