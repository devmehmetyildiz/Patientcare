import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Button, Modal, Loader, Icon, Breadcrumb, Grid } from 'semantic-ui-react'
import Literals from './Literals'
import { Contentwrapper, Headerwrapper, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import { getInitialconfig } from '../../Utils/Constants'
import validator from '../../Utils/Validator'


export default function UnapprovedTodos(props) {

  const { GetTodos, GetPatients, GetPatientdefines, GetTododefines, GetPatientmovements } = props
  const { Todos, Patients, Patientdefines, Tododefines, Patientmovements, Profile } = props
  const { ApproveTodos, ApprovemultipleTodos, fillTodonotification } = props

  const [canFiltertodos, setCanfiltertodos] = useState(false)
  const [approveMultipletodos, setApprovemultipletodos] = useState(false)
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState('')
  const [approveTodos, setApprovetodos] = useState(false)

  useEffect(() => {
    GetTodos()
    GetPatients()
    GetPatientdefines()
    GetTododefines()
    GetPatientmovements()
  }, [])


  const movementCellhandler = (col) => {
    if (Patientmovements.isLoading || Patients.isLoading || Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patientmovement = (Patientmovements.list || []).find(u => u.Uuid === col.value)
      const patient = (Patients.list || []).find(u => u.Uuid === patientmovement?.PatientID)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`
    }
  }

  const tododefineCellhandler = (col) => {
    if (Tododefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Tododefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  const boolCellhandler = (col) => {
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const Columns = [
    { Header: "", accessor: 'Select', disableProps: true, visible: canFiltertodos },
    { Header: Literals.Columns.Todo.Id[Profile.Language], accessor: 'Id' },
    { Header: Literals.Columns.Todo.Uuid[Profile.Language], accessor: 'Uuid' },
    { Header: Literals.Columns.Todo.Patient[Profile.Language], accessor: 'MovementID', Cell: col => movementCellhandler(col) },
    { Header: Literals.Columns.Todo.Tododefine[Profile.Language], accessor: 'TododefineID', Cell: col => tododefineCellhandler(col) },
    { Header: Literals.Columns.Todo.Order[Profile.Language], accessor: 'Order' },
    { Header: Literals.Columns.Todo.Occuredtime[Profile.Language], accessor: 'Occuredtime' },
    { Header: Literals.Columns.Todo.Checktime[Profile.Language], accessor: 'Checktime' },
    { Header: Literals.Columns.Todo.Willapprove[Profile.Language], accessor: 'Willapprove', Cell: col => boolCellhandler(col) },
    { Header: Literals.Columns.Todo.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => boolCellhandler(col) },
    { Header: Literals.Columns.Todo.Iscompleted[Profile.Language], accessor: 'IsCompleted', Cell: col => boolCellhandler(col) },
    { Header: Literals.Columns.Todo.Createduser[Profile.Language], accessor: 'Createduser' },
    { Header: Literals.Columns.Todo.Updateduser[Profile.Language], accessor: 'Updateduser' },
    { Header: Literals.Columns.Todo.Createtime[Profile.Language], accessor: 'Createtime' },
    { Header: Literals.Columns.Todo.Updatetime[Profile.Language], accessor: 'Updatetime' },
    { Header: Literals.Columns.Todo.approve[Profile.Language], accessor: 'approve', disableProps: true, visible: !canFiltertodos },
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


  const list = (Todos.list || []).filter(u => u.Isactive && !u.Isapproved).map(item => {
    return {
      ...item,
      Select: <Checkbox
        checked={todos.find(u => u === item.Uuid) ? true : false}
        onClick={() => {
          const filter = todos.find(u => u === item.Uuid)
          filter
            ? setTodos(todos.filter(u => u !== item.Uuid))
            : setTodos([item.Uuid, ...todos])
        }
        } />,
      approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
        setTodo(item.Uuid)
        setApprovetodos(true)
      }} />,
    }
  })

  const metaKey = "Todosapprove"
  let initialConfig = getInitialconfig(Profile, metaKey)

  return (
    <React.Fragment>
      <Pagewrapper>
        <Headerwrapper>
          <Grid columns='2' >
            <Grid.Column width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Unapprovedtodos"}>
                  <Breadcrumb.Section>{Literals.Page.PageTodoheader[Profile.Language]}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </Grid.Column>
          </Grid>
        </Headerwrapper>
        <Pagedivider />
        {list.length > 0 ?
          <div className='w-full mx-auto '>
            {Profile.Ismobile ?
              <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
              <div className='flex flex-col w-full justify-center items-center gap-2'>
                <div className='flex flex-row  justify-between items-center w-full'>
                  <Button size='mini' onClick={() => {
                    setCanfiltertodos(!canFiltertodos)
                    setTodos([])
                  }} >{canFiltertodos ? Literals.Columns.Todo.CanSelectclose[Profile.Language] : Literals.Columns.Todo.CanSelect[Profile.Language]}</Button>
                  <div className='flex flex-row  justify-end items-center w-full'>
                    {canFiltertodos && todos.length > 0
                      ? <Button color='violet' onClick={() => {
                        setApprovemultipletodos(true)
                      }} >{Literals.Columns.Todo.Multipleapprove[Profile.Language]}</Button>
                      : null}
                    <Settings
                      Profile={Profile}
                      Columns={Columns}
                      list={list}
                      initialConfig={initialConfig}
                      metaKey={metaKey}
                      Showcolumnchooser
                    />
                  </div>
                </div>
                <DataTable Columns={Columns} Data={list} Config={initialConfig} />
              </div>
            }
          </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
        }
      </Pagewrapper>
      <Modal
        onClose={() => { setApprovemultipletodos(false) }}
        onOpen={() => { setApprovemultipletodos(true) }}
        open={approveMultipletodos}
      >
        <Modal.Header> {Literals.Columns.Todo.Multipleapprove[Profile.Language]}</Modal.Header>
        <Modal.Content image className='!block'>
          <Modal.Description>
            {Literals.Messages.Approvetodomessage[Profile.Language]}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => { setApprovemultipletodos(false) }}>
            {Literals.Button.Close[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Approve[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              let errors = []
              if (!validator.isArray(todos)) {
                errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Needtodo[Profile.Language] })
              }
              if (errors.length > 0) {
                errors.forEach(error => {
                  fillTodonotification(error)
                })
              } else {
                ApprovemultipleTodos(todos)
                setApprovemultipletodos(false)
              }
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
      <Modal
        onClose={() => { setApprovetodos(false) }}
        onOpen={() => { setApprovetodos(true) }}
        open={approveTodos}
      >
        <Modal.Header> {Literals.Columns.Todo.Multipleapprove[Profile.Language]}</Modal.Header>
        <Modal.Content image className='!block'>
          <Modal.Description>
            {Literals.Messages.Approvetodomessagesingle[Profile.Language]}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => { setApprovetodos(false) }}>
            {Literals.Button.Close[Profile.Language]}
          </Button>
          <Button
            content={Literals.Button.Approve[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            onClick={() => {
              let errors = []
              if (!validator.isString(todo)) {
                errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Needtodo[Profile.Language] })
              }
              if (errors.length > 0) {
                errors.forEach(error => {
                  fillTodonotification(error)
                })
              } else {
                ApproveTodos({ Uuid: todo })
                setApprovetodos(false)
              }
            }}
            positive
          />
        </Modal.Actions>
      </Modal>
    </React.Fragment >
  )
}