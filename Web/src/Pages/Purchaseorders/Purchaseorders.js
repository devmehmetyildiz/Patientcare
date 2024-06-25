import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader, Tab } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable, Contentwrapper } from '../../Components'
import PurchaseordersDelete from '../../Containers/Purchaseorders/PurchaseordersDelete'
import { getInitialconfig } from '../../Utils/Constants'
import validator from '../../Utils/Validator'
import PurchaseordersCheck from '../../Containers/Purchaseorders/PurchaseordersCheck'
import PurchaseordersApprove from '../../Containers/Purchaseorders/PurchaseordersApprove'
import PurchaseordersComplete from '../../Containers/Purchaseorders/PurchaseordersComplete'
import PurchaseordersDetail from '../../Containers/Purchaseorders/PurchaseordersDetail'

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

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Purchaseno[Profile.Language], accessor: 'Purchaseno' },
      { Header: Literals.Columns.Company[Profile.Language], accessor: 'Company' },
      { Header: Literals.Columns.Billno[Profile.Language], accessor: 'Billno' },
      { Header: Literals.Columns.Receiveruser[Profile.Language], accessor: row => this.userCellhandler(row?.ReceiveruserID) },
      { Header: Literals.Columns.Purchasecreatetime[Profile.Language], accessor: row => this.dateCellhandler(row?.Purchasecreatetime), key: 'created' },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: row => this.userCellhandler(row?.CreateduserID), key: 'created' },
      { Header: Literals.Columns.Purchasechecktime[Profile.Language], accessor: row => this.dateCellhandler(row?.Purchasechecktime), key: 'checked' },
      { Header: Literals.Columns.Checkeduser[Profile.Language], accessor: row => this.userCellhandler(row?.CheckeduserID), key: 'checked' },
      { Header: Literals.Columns.Purchaseapprovetime[Profile.Language], accessor: row => this.dateCellhandler(row?.Purchaseapprovetime), key: 'approved' },
      { Header: Literals.Columns.Approveduser[Profile.Language], accessor: row => this.userCellhandler(row?.ApproveduserID), key: 'approved' },
      { Header: Literals.Columns.Purchasecompletetime[Profile.Language], accessor: row => this.dateCellhandler(row?.Purchasecompletetime), key: 'completed' },
      { Header: Literals.Columns.Completeduser[Profile.Language], accessor: row => this.userCellhandler(row?.CompleteduserID), key: 'completed' },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.detail[Profile.Language], accessor: 'detail', disableProps: true },
      { Header: Literals.Columns.check[Profile.Language], accessor: 'check', disableProps: true, key: 'created' },
      { Header: Literals.Columns.cancelcheck[Profile.Language], accessor: 'cancelcheck', disableProps: true, key: 'checked' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true, key: 'checked' },
      { Header: Literals.Columns.cancelapprove[Profile.Language], accessor: 'cancelapprove', disableProps: true, key: 'approved' },
      { Header: Literals.Columns.complete[Profile.Language], accessor: 'complete', disableProps: true, key: 'approved' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true, key: 'created' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true, disableOncomplete: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const list = (Purchaseorders.list || []).map(item => {
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
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
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
                    menuItem: `${Literals.Page.Pagecreatedheader[Profile.Language]} (${(createList || []).length})`,
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
                    menuItem: `${Literals.Page.Pagecheckedheader[Profile.Language]} (${(checkList || []).length})`,
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
                    menuItem: `${Literals.Page.Pageapprovedheader[Profile.Language]} (${(approveList || []).length})`,
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
                    menuItem: `${Literals.Page.Pagecompletedheader[Profile.Language]} (${(completeList || []).length})`,
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
  let initialConfig = getInitialconfig(Profile, metaKey)

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
        </div> : <NoDataScreen style={{ height: 'auto' }} message={Literals.Messages.Nodatafind[Profile.Language]} />
      }
    </>
  )
}

function Purchaseorderschecked({ Profile, Columns, list }) {

  const metaKey = "purchaseorder"
  let initialConfig = getInitialconfig(Profile, metaKey)

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
        </div> : <NoDataScreen style={{ height: 'auto' }} message={Literals.Messages.Nodatafind[Profile.Language]} />
      }
    </>
  )
}

function Purchaseordersapproved({ Profile, Columns, list }) {

  const metaKey = "purchaseorder"
  let initialConfig = getInitialconfig(Profile, metaKey)

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
        </div> : <NoDataScreen style={{ height: 'auto' }} message={Literals.Messages.Nodatafind[Profile.Language]} />
      }
    </>
  )
}

function Purchaseorderscompleted({ Profile, Columns, list }) {

  const metaKey = "purchaseorder"
  let initialConfig = getInitialconfig(Profile, metaKey)

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
        </div> : <NoDataScreen style={{ height: 'auto' }} message={Literals.Messages.Nodatafind[Profile.Language]} />
      }
    </>
  )
}
