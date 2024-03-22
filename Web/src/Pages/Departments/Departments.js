import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon } from 'semantic-ui-react'
import Literals from './Literals'
import DepartmentDelete from "../../Containers/Departments/DepartmentsDelete"
import { getInitialconfig } from '../../Utils/Constants'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'

export default function Departments(props) {

  const { Departments, Profile, handleSelectedDepartment, handleDeletemodal, GetDepartments } = props

  const [list, setList] = useState([])

  useEffect(() => {
    GetDepartments()
  }, [])

  useEffect(() => {
    const departmentlist = (Departments.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Departments/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedDepartment(item)
          handleDeletemodal(true)
        }} />,
      }
    })
    setList(departmentlist)
  }, [Departments])

  const boolCellhandler = (value) => {
    return value !== null && (value === 1 ? "EVET" : "HAYIR")
  }

  const { isLoading } = Departments

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const Columns = [
    { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
    { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
    { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
    { Header: Literals.Columns.Ishavepatients[Profile.Language], accessor: row => boolCellhandler(row?.Ishavepatients), Subtitle: true, Withtext: true },
    { Header: Literals.Columns.Isdefaultpatientdepartment[Profile.Language], accessor: row => boolCellhandler(row?.Isdefaultpatientdepartment), Lowtitle: true, Withtext: true },
    { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
    { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
    { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
    { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
    { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
    { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  const metaKey = "department"
  const initialConfig = getInitialconfig(Profile, metaKey)
  return (
    isLoading ? <LoadingPage /> :
      <React.Fragment>
        <Pagewrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Departments"}>
                    <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                Pagecreatelink={"/Departments/Create"}
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
        <DepartmentDelete />
      </React.Fragment>
  )
}