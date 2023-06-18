import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import NoDataScreen from '../../Utils/NoDataScreen'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import MailsettingsDelete from "../../Containers/Mailsettings/MailsettingsDelete"
export default class Mailsettings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  componentDidMount() {
    const { GetMailsettings } = this.props
    GetMailsettings()
  }

  componentDidUpdate() {
    const { Mailsettings, removeMailsettingnotification } = this.props
    Notification(Mailsettings.notifications, removeMailsettingnotification)
  }

  render() {


    const { Mailsettings, Profile, handleSelectedMailsetting, handleDeletemodal } = this.props
    const { isLoading, isDispatching } = Mailsettings

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.User[Profile.Language], accessor: 'User', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Smtphost[Profile.Language], accessor: 'Smtphost', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Smtpport[Profile.Language], accessor: 'Smtpport', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Mailaddress[Profile.Language], accessor: 'Mailaddress', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Isbodyhtml[Profile.Language], accessor: 'Isbodyhtml', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Issettingactive[Profile.Language], accessor: 'Issettingactive', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Mailsettings"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : []
    };

    const list = (Mailsettings.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Mailsettings/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedMailsetting(item)
          handleDeletemodal(true)
        }} />,
      }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8} className="">
                  <Breadcrumb size='big'>
                    <Link to={"/Mailsettings"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <GridColumn width={8} >
                  <Link to={"/Mailsettings/Create"}>
                    <Button color='blue' floated='right' className='list-right-green-button'>
                      {Literals.Page.Pagecreateheader[Profile.Language]}
                    </Button>
                  </Link>
                  <ColumnChooser meta={Profile.tablemeta} columns={Columns} metaKey={metaKey} />
                </GridColumn>
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                <DataTable Columns={Columns} Data={list} Config={initialConfig} />
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <MailsettingsDelete />
        </React.Fragment>
    )
  }

  handleChangeModal = (value) => {
    this.setState({ modal: value })
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}
