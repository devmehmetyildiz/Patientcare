import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { getInitialconfig } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import BreakdownsDelete from '../../Containers/Breakdowns/BreakdownsDelete'
import BreakdownsComplete from '../../Containers/Breakdowns/BreakdownsComplete'
import Settings from '../../Common/Settings'
import MobileTable from '../../Utils/MobileTable'
import validator from '../../Utils/Validator'

export default class Breakdowns extends Component {

  componentDidMount() {
    const { GetBreakdowns, GetPersonels, GetEquipments } = this.props
    GetBreakdowns()
    GetPersonels()
    GetEquipments()
  }

  render() {
    const { Breakdowns, Profile, handleDeletemodal, handleSelectedBreakdown, handleCompletemodal } = this.props
    const { isLoading, isDispatching } = Breakdowns

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Starttime[Profile.Language], accessor: 'Starttime', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Endtime[Profile.Language], accessor: 'Endtime', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.EquipmentID[Profile.Language], accessor: 'EquipmentID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.equipmentCellhandler(col) },
      { Header: Literals.Columns.ResponsibleuserID[Profile.Language], accessor: 'ResponsibleuserID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => this.personelCellhandler(col) },
      { Header: Literals.Columns.Openinfo[Profile.Language], accessor: 'Openinfo', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Closeinfo[Profile.Language], accessor: 'Closeinfo', sortable: true, canGroupBy: true, canFilter: true },
      { Header: Literals.Columns.Iscompleted[Profile.Language], accessor: 'Iscompleted', sortable: false, canGroupBy: false, canFilter: false, Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
      { Header: Literals.Columns.complete[Profile.Language], accessor: 'complete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

    const metaKey = "Breakdowns"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Breakdowns.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        complete: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='blue' name='hand point right' onClick={() => {
          handleSelectedBreakdown(item)
          handleCompletemodal(true)
        }} />,
        edit: <Link to={`/Breakdowns/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedBreakdown(item)
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
                    <Link to={"/Breakdowns"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Breakdowns/Create"}
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
          <BreakdownsDelete />
          <BreakdownsComplete />
        </React.Fragment>
    )
  }

  personelCellhandler = (col) => {
    const { Personels } = this.props
    if (Personels.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const personel = (Personels.list || []).find(u => u.Uuid === col.value)
      return personel ? `${personel?.Name} ${personel?.Surname}` : 'Tanımsız'
    }
  }

  equipmentCellhandler = (col) => {
    const { Equipments } = this.props
    if (Equipments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Equipments.list || []).find(u => u.Uuid === col.value)?.Name || 'Tanımsız'
    }
  }


  dateCellhandler = (col) => {
    const date = new Date(col.value)
    if (col.value && validator.isISODate(date)) {

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;

      return formattedDate
    } else {
      return col.value
    }
  }

  boolCellhandler = (col) => {
    return col.value !== null && (col.value
      ? <div className='w-full flex justify-center items-center'><Icon className='cursor-pointer' color='green' name='checkmark' /></div>
      : <div className='w-full flex justify-center items-center'><Icon className='cursor-pointer' color='red' name='times circle' /></div>)
  }
}