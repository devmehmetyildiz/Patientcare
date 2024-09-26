import React, { useState } from 'react'
import { Icon, Table, Transition } from 'semantic-ui-react'
import { Formatfulldate } from '../../../Utils/Formatdate'

export default function UsersDetailPurchaseorders(props) {

  const { user, Purchaseorders, Cases, Profile } = props

  const [open, setOpen] = useState(false)

  const t = Profile?.i18n?.t

  const decoratedList = (Purchaseorders.list || []).filter(u => u.Isactive && !u.Iscompleted && u.ReceiveruserID === user?.Uuid).map(order => {

    const activecase = (Cases.list || []).find(u => u.Uuid === order?.CaseID)

    return {
      name: `${order?.Purchaseno || ''} - ${order?.Company}`,
      detail: `${order?.Price || '-'}₺ - ${order?.Billno}`,
      createtime: `${Formatfulldate(order?.Purchasecreatetime, true)}`,
      case: `${activecase?.Name || ''}`,
    }
  })

  return (
    <div className='w-full px-4 mt-4'>
      <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
        <div onClick={() => { setOpen(prev => !prev) }} className='w-full flex justify-between cursor-pointer items-start'>
          <div className='font-bold text-xl font-poppins'> {t('Pages.Users.Detail.Purchaseorder.Header')}</div>
          <div >
            {open ? <Icon name='angle up' /> : <Icon name='angle down' />}
          </div>
        </div>
        <Transition visible={open} animation='slide down' duration={500}>
          <div className='w-full'>
            <Table >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>{t('Pages.Users.Detail.Purchaseorder.Label.Name')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('Pages.Users.Detail.Purchaseorder.Label.Detail')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('Pages.Users.Detail.Purchaseorder.Label.Createtime')}</Table.HeaderCell>
                  <Table.HeaderCell>{t('Pages.Users.Detail.Purchaseorder.Label.Case')}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(decoratedList || []).length > 0
                  ? decoratedList.map((order, index) => {
                    return <Table.Row key={index}>
                      <Table.Cell>{order?.name}</Table.Cell>
                      <Table.Cell>{order?.detail}</Table.Cell>
                      <Table.Cell>{order?.createtime}</Table.Cell>
                      <Table.Cell>{order?.case}</Table.Cell>
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
