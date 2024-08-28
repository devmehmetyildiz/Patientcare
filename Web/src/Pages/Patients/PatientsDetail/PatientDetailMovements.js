import React from 'react'
import { PATIENTS_MOVEMENTTYPES_APPROVE, PATIENTS_MOVEMENTTYPES_CANCELAPPROVE, PATIENTS_MOVEMENTTYPES_CANCELCHECK, PATIENTS_MOVEMENTTYPES_CHECK, PATIENTS_MOVEMENTTYPES_COMPLETE, PATIENTS_MOVEMENTTYPES_CREATE, PATIENTS_MOVEMENTTYPES_UPDATE } from '../../../Utils/Constants'
import { Feed } from 'semantic-ui-react'
import Formatdate from '../../../Utils/Formatdate'
import { Link } from 'react-router-dom'

export default function PatientDetailMovements(props) {

    const { Users, Profile, patient } = props

    const t = Profile?.i18n?.t
    const Notfound = t('Common.NoDataFound')
    const Movementtypes = [
        { name: t('Common.Patient.Movementtypes.Createduser'), value: PATIENTS_MOVEMENTTYPES_CREATE },
        { name: t('Common.Patient.Movementtypes.Updateduser'), value: PATIENTS_MOVEMENTTYPES_UPDATE },
        { name: t('Common.Patient.Movementtypes.Checkeduser'), value: PATIENTS_MOVEMENTTYPES_CHECK },
        { name: t('Common.Patient.Movementtypes.Approveduser'), value: PATIENTS_MOVEMENTTYPES_APPROVE },
        { name: t('Common.Patient.Movementtypes.Completeduser'), value: PATIENTS_MOVEMENTTYPES_COMPLETE },
        { name: t('Common.Patient.Movementtypes.Cancelcheckeduser'), value: PATIENTS_MOVEMENTTYPES_CANCELCHECK },
        { name: t('Common.Patient.Movementtypes.Cancelapproveduser'), value: PATIENTS_MOVEMENTTYPES_CANCELAPPROVE },
    ]

    const DecoratedMovements = ((patient?.Movements || []).map(movement => {
        const user = (Users.list || []).find(u => u.Uuid === movement?.UserID)
        const username = `${user?.Name || Notfound} ${user?.Surname || Notfound}`
        const type = Movementtypes.find(u => u.value === movement?.Type)?.name || Notfound

        return {
            label: type,
            user: username,
            userID: movement?.UserID,
            value: movement?.Occureddate,
            info: movement?.Info
        }
    }))

    return (
        <div className='bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center  p-4 m-4 mt-0 min-w-[250px]'>
            <div className='w-full flex justify-start items-start'>
                <div className='font-bold text-xl font-poppins'> {t('Pages.Patients.PatientsDetail.PatientDetailMovements.Header')}</div>
            </div>
            {DecoratedMovements.map((movement, index) => {
                return <Feed className='!m-0' key={index}>
                    <Feed.Event>
                        <Feed.Label icon="user" />
                        <Feed.Content>
                            <Feed.Date content={Formatdate(movement.value, true)} />
                            <Feed.Summary>
                                {movement.label} : <Link to={`Users/${movement.userID}/edit`}>{movement.user}</Link>
                            </Feed.Summary>
                            <Feed.Summary className='!font-semibold !text-[#8a8a8add]'>
                                {movement.info}
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                </Feed>
            })}
        </div>
    )
}
