import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader, Tab } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Contentwrapper } from '../../Components'
import PurchaseordersDelete from '../../Containers/Purchaseorders/PurchaseordersDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import validator from '../../Utils/Validator'
import PurchaseordersCheck from '../../Containers/Purchaseorders/PurchaseordersCheck'
import PurchaseordersApprove from '../../Containers/Purchaseorders/PurchaseordersApprove'
import PurchaseordersComplete from '../../Containers/Purchaseorders/PurchaseordersComplete'
import PurchaseordersDetail from '../../Containers/Purchaseorders/PurchaseordersDetail'
import { COL_PROPS } from '../../Utils/Constants'
import useTabNavigation from '../../Hooks/useTabNavigation'
import PurchaseordersCancelCheck from '../../Containers/Purchaseorders/PurchaseordersCancelCheck'
import PurchaseordersCancelApprove from '../../Containers/Purchaseorders/PurchaseordersCancelApprove'

export default function Purchaseorders(props) {

  const { GetPurchaseorders, GetUsers, history } = props
  const { Purchaseorders, Users, Profile, } = props

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [checkOpen, setCheckOpen] = useState(false)
  const [cancelCheckOpen, setCancelCheckOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [cancelApproveOpen, setCancelApproveOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [record, setRecord] = useState(null)

  const { isLoading } = Purchaseorders

  const t = Profile?.i18n?.t

  const userCellhandler = (value) => {
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const user = (Users.list || []).find(u => u.Uuid === value)
      return user ? `${user?.Name} ${user?.Surname} (${user?.Username})` : ''
    }
  }

  const dateCellhandler = (value) => {
    const date = new Date(value)
    if (value && validator.isISODate(date)) {

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;

      return formattedDate
    } else {
      return value
    }
  }

  const renderView = ({ list, Columns, keys, initialConfig }) => {

    const searchbykey = (data, searchkeys) => {
      let ok = false
      searchkeys.forEach(key => {

        if (!ok) {
          if (data.includes(key)) {
            ok = true
          }
        }
      });

      return ok
    }

    const columns = Columns.filter(u => searchbykey((u?.keys || []), keys) || !(u?.keys))

    return list.length > 0 ?
      <div className='w-full mx-auto '>
        {Profile.Ismobile ?
          <MobileTable Columns={columns} Data={list} Config={initialConfig} Profile={Profile} /> :
          <DataTable Columns={columns} Data={list} Config={initialConfig} />}
      </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Purchaseorder.Columns.Purchaseno'), accessor: 'Purchaseno' },
    { Header: t('Pages.Purchaseorder.Columns.Company'), accessor: 'Company' },
    { Header: t('Pages.Purchaseorder.Columns.Billno'), accessor: 'Billno' },
    { Header: t('Pages.Purchaseorder.Columns.Receiveruser'), accessor: row => userCellhandler(row?.ReceiveruserID) },
    { Header: t('Pages.Purchaseorder.Columns.Purchasecreatetime'), accessor: row => dateCellhandler(row?.Purchasecreatetime), keys: ['created'] },
    { Header: t('Pages.Purchaseorder.Columns.Createduser'), accessor: row => userCellhandler(row?.CreateduserID), keys: ['created'] },
    { Header: t('Pages.Purchaseorder.Columns.Purchasechecktime'), accessor: row => dateCellhandler(row?.Purchasechecktime), keys: ['checked'] },
    { Header: t('Pages.Purchaseorder.Columns.Checkeduser'), accessor: row => userCellhandler(row?.CheckeduserID), keys: ['checked'] },
    { Header: t('Pages.Purchaseorder.Columns.Purchaseapprovetime'), accessor: row => dateCellhandler(row?.Purchaseapprovetime), keys: ['approved'] },
    { Header: t('Pages.Purchaseorder.Columns.Approveduser'), accessor: row => userCellhandler(row?.ApproveduserID), keys: ['approved'] },
    { Header: t('Pages.Purchaseorder.Columns.Purchasecompletetime'), accessor: row => dateCellhandler(row?.Purchasecompletetime), keys: ['completed'] },
    { Header: t('Pages.Purchaseorder.Columns.Completeduser'), accessor: row => userCellhandler(row?.CompleteduserID), keys: ['completed'] },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
    { Header: t('Common.Column.check'), accessor: 'check', disableProps: true, keys: ['created'] },
    { Header: t('Common.Column.cancelcheck'), accessor: 'cancelcheck', disableProps: true, keys: ['checked'] },
    { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['checked'] },
    { Header: t('Common.Column.cancelapprove'), accessor: 'cancelapprove', disableProps: true, keys: ['approved'] },
    { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'] },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['created'] },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, disableOncomplete: true, keys: ['created', 'chcked', 'approved'] }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "purchaseorder"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Purchaseorders.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Purchaseorders/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setDeleteOpen(true)
      }} />,
      cancelcheck: <Icon link size='large' color='red' name='level down alternate' onClick={() => {
        setRecord(item)
        setCancelCheckOpen(true)
      }} />,
      check: <Icon link size='large' color='blue' name='level up alternate' onClick={() => {
        setRecord(item)
        setCheckOpen(true)
      }} />,
      cancelapprove: <Icon link size='large' color='red' name='hand point left' onClick={() => {
        setRecord(item)
        setCancelApproveOpen(true)
      }} />,
      approve: <Icon link size='large' color='blue' name='hand point up' onClick={() => {
        setRecord(item)
        setApproveOpen(true)
      }} />,
      complete: <Icon link size='large' color='blue' name='share' onClick={() => {
        setRecord(item)
        setCompleteOpen(true)
      }} />,
      detail: <Icon link size='large' color='grey' name='history' onClick={() => {
        setRecord(item)
        setDetailOpen(true)
      }} />,
    }
  })

  const createList = list.filter(u => u.Isopened && !u.Ischecked && !u.Isapproved && !u.Iscompleted)
  const checkList = list.filter(u => u.Isopened && u.Ischecked && !u.Isapproved && !u.Iscompleted)
  const approveList = list.filter(u => u.Isopened && u.Ischecked && u.Isapproved && !u.Iscompleted)
  const completeList = list.filter(u => u.Isopened && u.Ischecked && u.Isapproved && u.Iscompleted)

  const tabOrder = [
    'created',
    'checked',
    'approved',
    'completed',
  ]

  const { activeTab, setActiveTab } = useTabNavigation({
    history,
    tabOrder,
    mainRoute: 'Purchaseorders'
  })

  useEffect(() => {
    GetPurchaseorders()
    GetUsers()
  }, [])

  return (
      <React.Fragment>
        <Pagewrapper isLoading={isLoading} dimmer>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Purchaseorders"}>
                    <Breadcrumb.Section>{t('Pages.Purchaseorder.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Purchaseorder.Page.CreateHeader')}
                Pagecreatelink={"/Purchaseorders/Create"}
                Showcreatebutton
              />
            </Grid>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Tab
              onTabChange={(_, { activeIndex }) => {
                setActiveTab(activeIndex)
              }}
              activeIndex={activeTab}
              className="w-full !bg-transparent"
              panes={[
                {
                  menuItem: `${t('Pages.Purchaseorder.Page.Tab.CreateHeader')} (${(createList || []).length})`,
                  pane: {
                    key: 'created',
                    content: renderView({ list: createList, Columns, keys: ['created'], initialConfig })
                  }
                },
                {
                  menuItem: `${t('Pages.Purchaseorder.Page.Tab.CheckHeader')} (${(checkList || []).length})`,
                  pane: {
                    key: 'checked',
                    content: renderView({ list: checkList, Columns, keys: ['checked'], initialConfig })
                  }
                },
                {
                  menuItem: `${t('Pages.Purchaseorder.Page.Tab.ApproveHeader')} (${(approveList || []).length})`,
                  pane: {
                    key: 'approved',
                    content: renderView({ list: approveList, Columns, keys: ['approved'], initialConfig })
                  }
                },
                {
                  menuItem: `${t('Pages.Purchaseorder.Page.Tab.CompleteHeader')} (${(completeList || []).length})`,
                  pane: {
                    key: 'completed',
                    content: renderView({ list: completeList, Columns, keys: ['completed'], initialConfig })
                  }
                },


              ]}
              renderActiveOnly={false}
            />
          </Contentwrapper>
        </Pagewrapper>
        <PurchaseordersDetail
          open={detailOpen}
          setOpen={setDetailOpen}
          record={record}
          setRecord={setRecord}
        />
        <PurchaseordersDelete
          open={deleteOpen}
          setOpen={setDeleteOpen}
          record={record}
          setRecord={setRecord}
        />
        <PurchaseordersCheck
          open={checkOpen}
          setOpen={setCheckOpen}
          record={record}
          setRecord={setRecord}
        />
        <PurchaseordersApprove
          open={approveOpen}
          setOpen={setApproveOpen}
          record={record}
          setRecord={setRecord}
        />
        <PurchaseordersComplete
          open={completeOpen}
          setOpen={setCompleteOpen}
          record={record}
          setRecord={setRecord}
        />
        <PurchaseordersCancelCheck
          open={cancelCheckOpen}
          setOpen={setCancelCheckOpen}
          record={record}
          setRecord={setRecord}
        />
        <PurchaseordersCancelApprove
          open={cancelApproveOpen}
          setOpen={setCancelApproveOpen}
          record={record}
          setRecord={setRecord}
        />
      </React.Fragment>
  )

}