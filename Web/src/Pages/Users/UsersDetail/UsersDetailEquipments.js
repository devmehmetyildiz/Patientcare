import React, { useState } from 'react'
import { Icon, Table, Transition } from 'semantic-ui-react'

export default function UsersDetailEquipments(props) {

  const { user, Equipmentgroups, Equipments, Floors, Rooms, Beds, Profile } = props

  const [open, setOpen] = useState(true)

  const t = Profile?.i18n?.t

  const decoratedList = (Equipments.list || []).filter(u => u.Isactive && u.UserID === user?.Uuid).map(equipment => {

    const equipmentgroup = (Equipmentgroups.list || []).find(u => u.Uuid === equipment?.EquipmentgroupID)
    const floor = (Floors.list || []).find(u => u.Uuid === equipment?.FloorID)
    const room = (Rooms.list || []).find(u => u.Uuid === equipment?.RoomID)
    const bed = (Beds.list || []).find(u => u.Uuid === equipment?.BedID)

    let place = ''
    floor && (place = place.concat(`${floor?.Name} `))
    room && (place = place.concat(`${room?.Name} `))
    bed && (place = place.concat(`${bed?.Name} `))

    return {
      equipmentname: `${equipment?.Name || t('Common.NoDataFound')}`,
      equipmentgroup: `${equipmentgroup?.Name || t('Common.NoDataFound')}`,
      place: place || ''
    }
  })

  return (
    <div className='w-full px-4 mt-4'>
      <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
        <div onClick={() => { setOpen(prev => !prev) }} className='w-full flex justify-between cursor-pointer items-start'>
          <div className='font-bold text-xl font-poppins'> {t('Pages.Users.Detail.Equipment.Header')}</div>
          <div >
            {open ? <Icon name='angle up' /> : <Icon name='angle down' />}
          </div>
        </div>
        <Transition visible={open} animation='slide down' duration={500}>
          <div className='w-full'>
            <Table >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t('Pages.Users.Detail.Equipment.Label.Name')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('Pages.Users.Detail.Equipment.Label.Groupname')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('Pages.Users.Detail.Equipment.Label.Place')}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(decoratedList || []).length > 0
                  ? decoratedList.map((equipment, index) => {
                    return <Table.Row key={index}>
                      <Table.Cell>{equipment?.equipmentname}</Table.Cell>
                      <Table.Cell>{equipment?.equipmentgroup}</Table.Cell>
                      <Table.Cell>{equipment?.place}</Table.Cell>
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
