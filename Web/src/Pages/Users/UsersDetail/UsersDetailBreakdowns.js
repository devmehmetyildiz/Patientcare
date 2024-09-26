import React, { useState } from 'react'
import { Icon, Table, Transition } from 'semantic-ui-react'
import { Formatfulldate } from '../../../Utils/Formatdate'

export default function UsersDetailBreakdowns(props) {

    const [open, setOpen] = useState(false)

    const { user, Breakdowns, Equipmentgroups, Equipments, Profile } = props

    const t = Profile?.i18n?.t

    const decoratedList = (Breakdowns.list || []).filter(u => u.Isactive && !u.Iscompleted && u.ResponsibleuserID === user?.Uuid).map(breakdown => {

        const equipment = (Equipments.list || []).find(u => u.Uuid === breakdown?.EquipmentID)
        const equipmentgroup = (Equipmentgroups.list || []).find(u => u.Uuid === equipment?.EquipmentgroupID)

        return {
            equipment: `${equipment?.Name || t('Common.NoDataFound')} (${equipmentgroup?.Name || t('Common.NoDataFound')})`,
            starttime: `${Formatfulldate(breakdown?.Starttime, true)}`,
            info: breakdown?.Openinfo || ''
        }
    })

    return (
        <div className='w-full px-4 mt-4'>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div onClick={() => { setOpen(prev => !prev) }} className='w-full flex justify-between cursor-pointer items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Users.Detail.Breakdown.Header')}</div>
                    <div >
                        {open ? <Icon name='angle up' /> : <Icon name='angle down' />}
                    </div>
                </div>
                <Transition visible={open} animation='slide down' duration={500}>
                    <div className='w-full'>
                        <Table >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.Breakdown.Label.Equipment')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.Breakdown.Label.Starttime')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.Breakdown.Label.Info')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {(decoratedList || []).length > 0
                                    ? decoratedList.map((breakdown, index) => {
                                        return <Table.Row key={index}>
                                            <Table.Cell>{breakdown?.equipment}</Table.Cell>
                                            <Table.Cell>{breakdown?.starttime}</Table.Cell>
                                            <Table.Cell>{breakdown?.info}</Table.Cell>
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
