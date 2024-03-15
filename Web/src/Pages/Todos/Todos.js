import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import TodosApprove from '../../Containers/Todos/TodosApprove'
import { getInitialconfig } from '../../Utils/Constants'
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
    const { isLoading } = Todos

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Patient[Profile.Language], accessor: 'MovementID', Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.Tododefine[Profile.Language], accessor: 'TododefineID', Cell: col => this.tododefineCellhandler(col) },
      { Header: Literals.Columns.Order[Profile.Language], accessor: 'Order' },
      { Header: Literals.Columns.Occuredtime[Profile.Language], accessor: 'Occuredtime' },
      { Header: Literals.Columns.Checktime[Profile.Language], accessor: 'Checktime' },
      { Header: Literals.Columns.Willapprove[Profile.Language], accessor: 'Willapprove', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Iscompleted[Profile.Language], accessor: 'IsCompleted', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Todos"
    let initialConfig = getInitialconfig(Profile, metaKey)

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
      isLoading  ? <LoadingPage /> :
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


