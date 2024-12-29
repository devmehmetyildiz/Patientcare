import React, { Component } from 'react'
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
import { t } from 'i18next'

export default class Purchaseorders extends Component {

  componentDidMount() {
    const { GetPurchaseorders, GetUsers } = this.props
    GetPurchaseorders()
    GetUsers()
  }

  render() {
    const { Purchaseorders, Profile, handleDeletemodal, handleSelectedPurchaseorder, handleApprovemodal, handleDetailmodal,
      handleCheckmodal, handleCompletemodal } = this.props
    const { isLoading } = Purchaseorders

    const t = Profile?.i18n?.t

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Purchaseorder.Columns.Purchaseno'), accessor: 'Purchaseno' },
      { Header: t('Pages.Purchaseorder.Columns.Company'), accessor: 'Company' },
      { Header: t('Pages.Purchaseorder.Columns.Billno'), accessor: 'Billno' },
      { Header: t('Pages.Purchaseorder.Columns.Receiveruser'), accessor: row => this.userCellhandler(row?.ReceiveruserID) },
      { Header: t('Pages.Purchaseorder.Columns.Purchasecreatetime'), accessor: row => this.dateCellhandler(row?.Purchasecreatetime), key: 'created' },
      { Header: t('Pages.Purchaseorder.Columns.Createduser'), accessor: row => this.userCellhandler(row?.CreateduserID), key: 'created' },
      { Header: t('Pages.Purchaseorder.Columns.Purchasechecktime'), accessor: row => this.dateCellhandler(row?.Purchasechecktime), key: 'checked' },
      { Header: t('Pages.Purchaseorder.Columns.Checkeduser'), accessor: row => this.userCellhandler(row?.CheckeduserID), key: 'checked' },
      { Header: t('Pages.Purchaseorder.Columns.Purchaseapprovetime'), accessor: row => this.dateCellhandler(row?.Purchaseapprovetime), key: 'approved' },
      { Header: t('Pages.Purchaseorder.Columns.Approveduser'), accessor: row => this.userCellhandler(row?.ApproveduserID), key: 'approved' },
      { Header: t('Pages.Purchaseorder.Columns.Purchasecompletetime'), accessor: row => this.dateCellhandler(row?.Purchasecompletetime), key: 'completed' },
      { Header: t('Pages.Purchaseorder.Columns.Completeduser'), accessor: row => this.userCellhandler(row?.CompleteduserID), key: 'completed' },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
      { Header: t('Common.Column.check'), accessor: 'check', disableProps: true, key: 'created' },
      { Header: t('Common.Column.cancelcheck'), accessor: 'cancelcheck', disableProps: true, key: 'checked' },
      { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, key: 'checked' },
      { Header: t('Common.Column.cancelapprove'), accessor: 'cancelapprove', disableProps: true, key: 'approved' },
      { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, key: 'approved' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, key: 'created' },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, disableOncomplete: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const list = (Purchaseorders.list || []).filter(u =>u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Purchaseorders/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPurchaseorder(item)
          handleDeletemodal(true)
        }} />,
        cancelcheck: <Icon link size='large' color='red' name='level down alternate' onClick={() => {
          handleSelectedPurchaseorder(item)
          handleCheckmodal({ modal: true, deactive: true })
        }} />,
        check: <Icon link size='large' color='blue' name='level up alternate' onClick={() => {
          handleSelectedPurchaseorder(item)
          handleCheckmodal(true)
        }} />,
        cancelapprove: <Icon link size='large' color='red' name='hand point left' onClick={() => {
          handleSelectedPurchaseorder(item)
          handleApprovemodal({ modal: true, deactive: true })
        }} />,
        approve: <Icon link size='large' color='blue' name='hand point up ' onClick={() => {
          handleSelectedPurchaseorder(item)
          handleApprovemodal(true)
        }} />,
        complete: <Icon link size='large' color='blue' name='share' onClick={() => {
          handleSelectedPurchaseorder(item)
          handleCompletemodal(true)
        }} />,
        detail: <Icon link size='large' color='grey' name='history' onClick={() => {
          handleSelectedPurchaseorder(item)
          handleDetailmodal(true)
        }} />,
      }
    })

    const createList = list.filter(u => u.Isopened && !u.Ischecked && !u.Isapproved && !u.Iscompleted)
    const checkList = list.filter(u => u.Isopened && u.Ischecked && !u.Isapproved && !u.Iscompleted)
    const approveList = list.filter(u => u.Isopened && u.Ischecked && u.Isapproved && !u.Iscompleted)
    const completeList = list.filter(u => u.Isopened && u.Ischecked && u.Isapproved && u.Iscompleted)

    return (
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
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
                className="w-full !bg-transparent"
                panes={[
                  {
                    menuItem: `${t('Pages.Purchaseorder.Page.Tab.CreateHeader')} (${(createList || []).length})`,
                    pane: {
                      key: 'created',
                      content: <Purchaseorderscreated
                        Profile={Profile}
                        list={createList}
                        Columns={Columns.filter(u => u.key === 'created' || !u.key)}
                      />
                    }
                  },
                  {
                    menuItem: `${t('Pages.Purchaseorder.Page.Tab.CheckHeader')} (${(checkList || []).length})`,
                    pane: {
                      key: 'checked',
                      content: <Purchaseorderschecked
                        Profile={Profile}
                        list={checkList}
                        Columns={Columns.filter(u => u.key === 'checked' || !u.key)}
                      />
                    }
                  },
                  {
                    menuItem: `${t('Pages.Purchaseorder.Page.Tab.ApproveHeader')} (${(approveList || []).length})`,
                    pane: {
                      key: 'approved',
                      content: <Purchaseordersapproved
                        Profile={Profile}
                        list={approveList}
                        Columns={Columns.filter(u => u.key === 'approved' || !u.key)}
                      />
                    }
                  },
                  {
                    menuItem: `${t('Pages.Purchaseorder.Page.Tab.CompleteHeader')} (${(completeList || []).length})`,
                    pane: {
                      key: 'completed',
                      content: <Purchaseorderscompleted
                        Profile={Profile}
                        list={completeList}
                        Columns={Columns.filter(u => (u.key === 'completed' || !u.key) && !u.disableOncomplete)}
                      />
                    }
                  },
                ]}
                renderActiveOnly={false}
              />
            </Contentwrapper>
          </Pagewrapper>
          <PurchaseordersDetail />
          <PurchaseordersDelete />
          <PurchaseordersCheck />
          <PurchaseordersApprove />
          <PurchaseordersComplete />
        </React.Fragment>
    )
  }

  userCellhandler = (value) => {
    const { Users } = this.props
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const user = (Users.list || []).find(u => u.Uuid === value)
      return user ? `${user?.Name} ${user?.Surname} (${user?.Username})` : ''
    }
  }

  dateCellhandler = (value) => {
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
}


function Purchaseorderscreated({ Profile, Columns, list }) {

  const metaKey = "purchaseorder"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
          <Settings
            Profile={Profile}
            Columns={Columns}
            list={list}
            initialConfig={initialConfig}
            metaKey={metaKey}
            Showcolumnchooser
            Showexcelexport
          />
        </Grid>
      </Headerwrapper>
      {list.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}

function Purchaseorderschecked({ Profile, Columns, list }) {

  const metaKey = "purchaseorder"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
          <Settings
            Profile={Profile}
            Columns={Columns}
            list={list}
            initialConfig={initialConfig}
            metaKey={metaKey}
            Showcolumnchooser
            Showexcelexport
          />
        </Grid>
      </Headerwrapper>
      {list.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}

function Purchaseordersapproved({ Profile, Columns, list }) {

  const metaKey = "purchaseorder"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
          <Settings
            Profile={Profile}
            Columns={Columns}
            list={list}
            initialConfig={initialConfig}
            metaKey={metaKey}
            Showcolumnchooser
            Showexcelexport
          />
        </Grid>
      </Headerwrapper>
      {list.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}

function Purchaseorderscompleted({ Profile, Columns, list }) {

  const metaKey = "purchaseorder"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  return (
    <>
      <Headerwrapper>
        <Grid columns='2' >
          <GridColumn width={8} />
          <Settings
            Profile={Profile}
            Columns={Columns}
            list={list}
            initialConfig={initialConfig}
            metaKey={metaKey}
            Showcolumnchooser
            Showexcelexport
          />
        </Grid>
      </Headerwrapper>
      {list.length > 0 ?
        <div className='w-full mx-auto '>
          {Profile.Ismobile ?
            <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
            <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
        </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
      }
    </>
  )
}
