import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
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
import TodosApprove from '../../Containers/Todos/TodosApprove'
import MobileTable from '../../Utils/MobileTable'
import Settings from '../../Common/Settings'
export default class Todos extends Component {

  componentDidMount() {
    const { GetTodos, GetPatientmovements, GetTododefines, GetPatients, GetPatientdefines } = this.props
    GetTodos()
    GetPatientmovements()
    GetTododefines()
    GetPatients()
    GetPatientdefines()
  }

  render() {
    const { Todos, Profile, handleApprovemodal, handleSelectedTodo } = this.props
    const { isLoading, isDispatching, } = Todos

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Patient[Profile.Language], accessor: 'MovementID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.Tododefine[Profile.Language], accessor: 'TododefineID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.tododefineCellhandler(col) },
      { Header: Literals.Columns.Order[Profile.Language], accessor: 'Order', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Occuredtime[Profile.Language], accessor: 'Occuredtime', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Checktime[Profile.Language], accessor: 'Checktime', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Willapprove[Profile.Language], accessor: 'Willapprove', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Iscompleted[Profile.Language], accessor: 'IsCompleted', sortable: true, canGroupBy: true, canFilter: true, isOpen: false, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
    ]

    const metaKey = "Todos"
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
      hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
        return item.key
      }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
      columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
        return item.key
      }) : [],
      groupBy: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isGroup === true).map(item => {
        return item.key
      }) : [],
    };

    const list = (Todos.list || []).map(item => {
      return {
        ...item,
        approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          handleSelectedTodo(item)
          handleApprovemodal(true)
        }} />,
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
                    <Link to={"/Todos"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
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
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <TodosApprove />
        </React.Fragment>
    )
  }


  movementCellhandler = (col) => {
    const { Patientmovements, Patients, Patientdefines } = this.props
    if (Patientmovements.isLoading || Patients.isLoading || Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patientmovement = (Patientmovements.list || []).find(u => u.Uuid === col.value)
      const patient = (Patients.list || []).find(u => u.Uuid === patientmovement?.PatientID)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`
    }
  }

  tododefineCellhandler = (col) => {
    const { Tododefines } = this.props
    if (Tododefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Tododefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}


