import React, { useState } from 'react'
import { Icon, Table, Transition } from 'semantic-ui-react'
import { Formatfulldate } from '../../../Utils/Formatdate'

export default function UsersDetailMainteancies(props) {

    const { user, Mainteancies, Equipmentgroups, Equipments, Profile } = props

    const [open, setOpen] = useState(false)

    const t = Profile?.i18n?.t

    const decoratedList = (Mainteancies.list || []).filter(u => u.Isactive && !u.Iscompleted && u.ResponsibleuserID === user?.Uuid).map(mainteance => {

        const equipment = (Equipments.list || []).find(u => u.Uuid === mainteance?.EquipmentID)
        const equipmentgroup = (Equipmentgroups.list || []).find(u => u.Uuid === equipment?.EquipmentgroupID)

        return {
            equipment: `${equipment?.Name || t('Common.NoDataFound')} (${equipmentgroup?.Name || t('Common.NoDataFound')})`,
            starttime: `${Formatfulldate(mainteance?.Starttime, true)}`,
            info: mainteance?.Openinfo || ''
        }
    })

    return (
        <div className='w-full px-4 mt-4'>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div onClick={() => { setOpen(prev => !prev) }} className='w-full flex justify-between cursor-pointer items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Users.Detail.Mainteance.Header')}</div>
                    <div >
                        {open ? <Icon name='angle up' /> : <Icon name='angle down' />}
                    </div>
                </div>
                <Transition visible={open} animation='slide down' duration={500}>
                    <div className='w-full'>
                        <Table >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.Mainteance.Label.Equipment')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.Mainteance.Label.Starttime')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.Mainteance.Label.Info')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {(decoratedList || []).length > 0
                                    ? decoratedList.map((mainteance, index) => {
                                        return <Table.Row key={index}>
                                            <Table.Cell>{mainteance?.equipment}</Table.Cell>
                                            <Table.Cell>{mainteance?.starttime}</Table.Cell>
                                            <Table.Cell>{mainteance?.info}</Table.Cell>
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
