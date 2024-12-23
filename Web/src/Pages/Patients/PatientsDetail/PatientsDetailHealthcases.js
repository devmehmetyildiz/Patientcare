import React, { useState } from 'react'
import { Icon, Table, Transition } from 'semantic-ui-react'

export default function PatientsDetailHealthcases(props) {

    const [open, setOpen] = useState(true)

    const { patient, Patienthealthcases, Patienthealthcasedefines, Profile } = props

    const t = Profile?.i18n?.t

    const list = (Patienthealthcases.list || []).filter(u => u.Isactive && u.PatientID === patient?.Uuid).map(healthcase => {

        const define = (Patienthealthcasedefines.list || []).find(u => u.Uuid === healthcase?.DefineID)
        return {
            name: define?.Name || t('Common.NoDataFound')
        }
    })

    return (
        <div className='w-full px-4 mt-4'>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div onClick={() => { setOpen(prev => !prev) }} className='w-full flex justify-between cursor-pointer items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Patients.PatientsDetail.PatientDetailHealthcases.Header')}</div>
                    <div >
                        {open ? <Icon name='angle up' /> : <Icon name='angle down' />}
                    </div>
                </div>
                <Transition visible={open} animation='slide down' duration={500}>
                    <div className='w-full'>
                        <Table >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailHealthcases.Label.Define')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {(list || []).length > 0
                                    ? list.map((healthcase, index) => {
                                        return <Table.Row key={index}>
                                            <Table.Cell>{healthcase?.name}</Table.Cell>
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
