import React, { useState } from 'react'
import { Icon, Table, Transition } from 'semantic-ui-react'
import { Formatfulldate } from '../../../Utils/Formatdate'

export default function PatientsDetailEvents(props) {

    const [open, setOpen] = useState(true)

    const { patient, Patienteventdefines, Users, Profile } = props

    const t = Profile?.i18n?.t

    const decoratedList = (patient.Events || []).filter(u => u.Isactive && u.PatientID === patient?.Uuid).map(event => {

        const user = (Users.list || []).find(u => u.Uuid === event?.UserID)
        const eventdefine = (Patienteventdefines.list || []).find(u => u.Uuid === event?.EventID)

        return {
            event: `${eventdefine?.Eventname || t('Common.NoDataFound')}`,
            user: `${user?.Name} ${user?.Surname}`,
            occureddate: `${Formatfulldate(event?.Occureddate, true)}`,
            info: event.Info || ''
        }
    })

    return (
        <div className='w-full px-4 mt-4'>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div onClick={() => { setOpen(prev => !prev) }} className='w-full flex justify-between cursor-pointer items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Patients.PatientsDetail.PatientDetailEvents.Header')}</div>
                    <div >
                        {open ? <Icon name='angle up' /> : <Icon name='angle down' />}
                    </div>
                </div>
                <Transition visible={open} animation='slide down' duration={500}>
                    <div className='w-full'>
                        <Table >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailEvents.Label.Name')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailEvents.Label.User')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailEvents.Label.Occureddate')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailEvents.Label.Info')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {(decoratedList || []).length > 0
                                    ? decoratedList.map((event, index) => {
                                        return <Table.Row key={index}>
                                            <Table.Cell>{event?.event}</Table.Cell>
                                            <Table.Cell>{event?.user}</Table.Cell>
                                            <Table.Cell>{event?.occureddate}</Table.Cell>
                                            <Table.Cell>{event?.info}</Table.Cell>
                                        </Table.Row>
                                    })
                                    : <Table.Row>
                                        <Table.Cell>
                                            <div className='font-bold font-poppins'>{t('Common.NoDataFound')}</div>
                                        </Table.Cell>
                                    </Table.Row>}
                            </Table.Body>
                        </Table>
                    </div>
                </Transition>

            </div>
        </div>
    )
}
