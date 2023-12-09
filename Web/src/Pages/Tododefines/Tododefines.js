import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import TododefinesDelete from '../../Containers/Tododefines/TododefinesDelete'
import { getInitialconfig } from '../../Utils/Constants'
export default class Tododefines extends Component {

  constructor(props) {
    super(props)
    this.state = {
      periodStatus: []
    }
  }

  componentDidMount() {
    const { GetTododefines, GetPeriods } = this.props
    GetTododefines()
    GetPeriods()
  }

  render() {
    const { Tododefines, Profile, handleDeletemodal, handleSelectedTododefine, Periods } = this.props
    const { isLoading, isDispatching } = Tododefines

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Firstheader: true },
      { Header: Literals.Columns.IsRequired[Profile.Language], accessor: 'IsRequired', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.IsNeedactivation[Profile.Language], accessor: 'IsNeedactivation', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Dayperiod[Profile.Language], accessor: 'Dayperiod' },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info' },
      { Header: Literals.Columns.Periods[Profile.Language], accessor: 'Periodtxt', Subheader: true, Cell: col => this.PeriodCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Tododefines"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Tododefines.list || []).map(item => {
      var text = (item.Perioduuids || []).map(u => {
        return (Periods.list || []).find(period => period.Uuid === u.PeriodID)?.Name
      }).join(", ")
      return {
        ...item,
        Periodtxt: text,
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
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Tododefines"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Tododefines/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                />
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
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

  PeriodCellhandler = (col) => {

    const { Periods, Profile } = this.props

    if (col.value) {
      if (!col.cell?.isGrouped && !Profile.Ismobile) {
        const itemId = col?.row?.original?.Id
        const itemPeriods = (col.row.original.Perioduuids || []).map(u => { return (Periods.list || []).find(period => period.Uuid === u.PeriodID) })
        return col.value.length - 35 > 20 ?
          (
            !this.state.periodStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemPeriods.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandPeriods(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkPeriods(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return col.value
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}


