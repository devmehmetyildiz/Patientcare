import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon } from 'semantic-ui-react'
import DepartmentDelete from "../../Containers/Departments/DepartmentsDelete"
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import { useGetBreakdownsQuery } from '../../Api/Features/Breakdown'

export default function Departments(props) {

  const { Departments, Profile, handleSelectedDepartment, handleDeletemodal, GetDepartments } = props
  const t = Profile?.i18n?.t

  const [list, setList] = useState([])
  const response = useGetBreakdownsQuery()
  console.log('response : ', response);

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
    { Header: t("Common.Column.Id"), accessor: 'Id' },
    { Header: t("Common.Column.Uuid"), accessor: 'Uuid' },
    { Header: t("Pages.Departments.Columns.Name"), accessor: 'Name', Title: true },
    { Header: t("Pages.Departments.Columns.Ishavepatients"), accessor: row => boolCellhandler(row?.Ishavepatients) },
    { Header: t("Pages.Departments.Columns.Isdefaultpatientdepartment"), accessor: row => boolCellhandler(row?.Isdefaultpatientdepartment), Lowtitle: true, Withtext: true },
    { Header: t("Pages.Departments.Columns.Ishavepersonels"), accessor: row => boolCellhandler(row?.Ishavepersonels), Lowtitle: true, Withtext: true },
    { Header: t("Pages.Departments.Columns.Isdefaultpersoneldepartment"), accessor: row => boolCellhandler(row?.Isdefaultpersoneldepartment), Lowtitle: true, Withtext: true },
    { Header: t("Common.Column.Createduser"), accessor: 'Createduser' },
    { Header: t("Common.Column.Updateduser"), accessor: 'Updateduser' },
    { Header: t("Common.Column.Createtime"), accessor: 'Createtime' },
    { Header: t("Common.Column.Updatetime"), accessor: 'Updatetime' },
    { Header: t("Common.Column.edit"), accessor: 'edit', disableProps: true },
    { Header: t("Common.Column.delete"), accessor: 'delete', disableProps: true }
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  const metaKey = "department"
  const initialConfig = GetInitialconfig(Profile, metaKey)

  return (
    isLoading ? <LoadingPage /> :
      <React.Fragment>
        <Pagewrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Departments"}>
                    <Breadcrumb.Section>{t("Pages.Departments.Page.Header")}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t("Pages.Departments.Page.CreateHeader")}
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
            </div> : <NoDataScreen message={t("Common.NoDataFound")} />
          }
        </Pagewrapper>
        <DepartmentDelete />
      </React.Fragment>
  )
}