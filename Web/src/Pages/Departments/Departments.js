import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon } from 'semantic-ui-react'
import Literals from './Literals'
import DepartmentDelete from "../../Containers/Departments/DepartmentsDelete"
import { getInitialconfig } from '../../Utils/Constants'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'

export default function Departments(props) {

  const { Departments, Stations, Profile, handleSelectedDepartment, handleDeletemodal, GetDepartments, GetStations } = props

  const [stationsStatus, setstationsStatus] = useState([])
  const [list, setList] = useState([])

  useEffect(() => {
    GetDepartments()
    GetStations()
  }, [])

  useEffect(() => {
    const departmentlist = (Departments.list || []).map(item => {
      var text = (item.Stationuuids || []).map(u => {
        return (Stations.list || []).find(station => station.Uuid === u.StationID)?.Name
      }).join(", ")
      return {
        ...item,
        Stations: text,
        edit: <Link to={`/Departments/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedDepartment(item)
          handleDeletemodal(true)
        }} />,
      }
    })
    setList(departmentlist)
  }, [Departments, Stations])


  const expandStations = (rowid) => {
    const prevData = stationsStatus
    prevData.push(rowid)
    setstationsStatus([...prevData])
  }

  const shrinkStations = (rowid) => {
    const index = stationsStatus.indexOf(rowid)
    const prevData = stationsStatus
    if (index > -1) {
      prevData.splice(index, 1)
      setstationsStatus([...prevData])
    }
  }

  const stationCellhandler = (col) => {
    if (col.value) {
      if (!col.cell?.isGrouped && !Profile.Ismobile) {
        const itemId = col?.row?.original?.Id
        const itemStations = (col.row.original.Stationuuids || []).map(u => { return (Stations.list || []).find(station => station.Uuid === u.StationID) })
        return col.value.length - 35 > 20 ?
          (
            !stationsStatus.includes(itemId) ?
              [col.value.slice(0, 35) + ' ...(' + itemStations.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => expandStations(itemId)}> ...Daha Fazla Göster</Link>] :
              [col.value, <Link to='#' className='showMoreOrLess' onClick={() => shrinkStations(itemId)}> ...Daha Az Göster</Link>]
          ) : col.value
      }
      return col.value
    }
    return null
  }

  const boolCellhandler = (col) => {
    return col.value !== null && (col.value === 1 ? "EVET" : "HAYIR")
  }

  const { isLoading, isDispatching } = Departments

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  const Columns = [
    { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
    { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
    { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Firstheader: true },
    { Header: Literals.Columns.stationstxt[Profile.Language], accessor: 'Stations', Subheader: true, Cell: col => stationCellhandler(col) },
    { Header: Literals.Columns.Ishavepatients[Profile.Language], accessor: 'Ishavepatients', Finalheader: true, Cell: col => boolCellhandler(col) },
    { Header: Literals.Columns.Isdefaultpatientdepartment[Profile.Language], accessor: 'Isdefaultpatientdepartment', Finalheader: true, Cell: col => boolCellhandler(col) },
    { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
    { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
    { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
    { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
    { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
    { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
  ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

  const metaKey = "Departments"
  const initialConfig = getInitialconfig(Profile, metaKey)
  return (
    isLoading || isDispatching ? <LoadingPage /> :
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