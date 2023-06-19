import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import Notification from "../../Utils/Notification"
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import TododefinesDelete from '../../Containers/Todogroupdefines/TodogroupdefinesDelete'
export default class Tododefines extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      selectedrecord: [],
      periodStatus: []
    }
  }

  componentDidMount() {
    const { GetTododefines } = this.props
    GetTododefines()
  }

  componentDidUpdate() {
    const { notifications, removeTododefinenotification } = this.props
    Notification(notifications, removeTododefinenotification)
  }

  render() {
    const { Tododefines, Profile, handleDeletemodal, handleSelectedTododefine } = this.props
    const { isLoading, isDispatching } = Tododefines

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.IsRequired[Profile.Language], accessor: 'IsRequired', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.IsNeedactivation[Profile.Language], accessor: 'IsNeedactivation', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Periods[Profile.Language], accessor: 'Periodstxt', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.periodCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Tododefines"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : []
    };

    const list = (Tododefines.list || []).map(item => {
      var text = item.Periods.map((period) => {
        return period.Name;
      }).join(", ")
      return {
        ...item,
        Periodstxt: text,
        edit: <Link to={`/Tododefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedTododefine(item)
          handleDeletemodal(true)
        }} />
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
                    <Link to={"/Tododefines"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <GridColumn width={8} >
                  <Link to={"/Tododefines/Create"}>
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
          <TododefinesDelete />
        </React.Fragment>
    )
  }

  handleChangeModal = (value) => {
    this.setState({ modal: value })
  }

  expandPeriods = (rowid) => {
    const prevData = this.state.periodStatus
    prevData.push(rowid)
    this.setState({ periodStatus: [...prevData] })
  }

  shrinkPeriods = (rowid) => {
    const index = this.state.periodStatus.indexOf(rowid)
    const prevData = this.state.periodStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ periodStatus: [...prevData] })
    }
  }

  periodCellhandler = (col) => {
    if (col.value) {
      if (!col.cell.isGrouped) {
        const itemId = col.row.original.Id
        const itemPeriods = col.row.original.Periods
        return col.value.length - 35 > 20 ?
          (
            !this.state.periodStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemPeriods.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandPeriods(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkPeriods(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}


