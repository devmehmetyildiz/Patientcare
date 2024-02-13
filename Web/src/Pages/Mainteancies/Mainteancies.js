import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { getInitialconfig } from '../../Utils/Constants'
import Literals from './Literals'
import MainteanciesDelete from '../../Containers/Mainteancies/MainteanciesDelete'
import MainteanciesComplete from '../../Containers/Mainteancies/MainteanciesComplete'
import validator from '../../Utils/Validator'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'

export default class Mainteancies extends Component {

  componentDidMount() {
    const { GetMainteancies, GetPersonels, GetEquipments } = this.props
    GetMainteancies()
    GetPersonels()
    GetEquipments()
  }

  render() {
    const { Mainteancies, Profile, handleDeletemodal, handleSelectedMainteance, handleCompletemodal } = this.props
    const { isLoading, isDispatching } = Mainteancies

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Starttime[Profile.Language], accessor: row => this.dateCellhandler(row?.Starttime), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Endtime[Profile.Language], accessor: row => this.dateCellhandler(row?.Endtime), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.EquipmentID[Profile.Language], accessor: row => this.equipmentCellhandler(row?.EquipmentID), Title: true },
      { Header: Literals.Columns.ResponsibleuserID[Profile.Language], accessor: row => this.personelCellhandler(row?.ResponsibleuserID), Subtitle: true, Withtext: true, },
      { Header: Literals.Columns.Openinfo[Profile.Language], accessor: 'Openinfo' },
      { Header: Literals.Columns.Closeinfo[Profile.Language], accessor: 'Closeinfo' },
      { Header: Literals.Columns.Iscompleted[Profile.Language], accessor: row => this.boolCellhandler(row?.Iscompleted), disableProps: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.complete[Profile.Language], accessor: 'complete', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Mainteancies"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Mainteancies.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        complete: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='blue' name='hand point right' onClick={() => {
          handleSelectedMainteance(item)
          handleCompletemodal(true)
        }} />,
        edit: <Link to={`/Mainteancies/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedMainteance(item)
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
                    <Link to={"/Mainteancies"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Mainteancies/Create"}
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
          <MainteanciesDelete />
          <MainteanciesComplete />
        </React.Fragment>
    )
  }

  personelCellhandler = (value) => {
    const { Personels } = this.props
    if (Personels.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const personel = (Personels.list || []).find(u => u.Uuid === value)
      return personel ? `${personel?.Name} ${personel?.Surname}` : 'Tanımsız'
    }
  }

  equipmentCellhandler = (value) => {
    const { Equipments } = this.props
    if (Equipments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Equipments.list || []).find(u => u.Uuid === value)?.Name || 'Tanımsız'
    }
  }


  dateCellhandler = (value) => {
    const date = new Date(value)
    if (value && validator.isISODate(date)) {

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;

      return formattedDate
    } else {
      return value
    }
  }

  boolCellhandler = (value) => {
    return value !== null && (value
      ? <div className='w-full flex justify-center items-center'><Icon className='cursor-pointer' color='green' name='checkmark' /></div>
      : <div className='w-full flex justify-center items-center'><Icon className='cursor-pointer' color='red' name='times circle' /></div>)
  }
}