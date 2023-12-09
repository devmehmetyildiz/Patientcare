import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import EquipmentsDelete from "../../Containers/Equipments/EquipmentsDelete"
import { getInitialconfig } from '../../Utils/Constants'
import {
  DataTable, Headerwrapper, LoadingPage,
  MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'

export default class Equipments extends Component {

  componentDidMount() {
    const { GetEquipments, GetEquipmentgroups, GetRooms, GetFloors, GetUsers, GetBeds } = this.props
    GetEquipments()
    GetEquipmentgroups()
    GetRooms()
    GetFloors()
    GetBeds()
    GetUsers()
  }


  render() {

    const { Equipments, Profile, handleSelectedEquipment, handleDeletemodal } = this.props
    const { isLoading, isDispatching } = Equipments

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Firstheader: true },
      { Header: Literals.Columns.Equipmentgroup[Profile.Language], accessor: 'EquipmentgroupID', Subheader: true, Cell: col => this.equipmentgroupCellhandler(col) },
      { Header: Literals.Columns.Floor[Profile.Language], accessor: 'FloorID', Cell: col => this.floorCellhandler(col) },
      { Header: Literals.Columns.Room[Profile.Language], accessor: 'RoomID', Cell: col => this.roomCellhandler(col) },
      { Header: Literals.Columns.Floor[Profile.Language], accessor: 'BedID', Cell: col => this.bedCellhandler(col) },
      { Header: Literals.Columns.User[Profile.Language], accessor: 'UserID', Cell: col => this.userCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Equipments"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Equipments.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Equipments/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedEquipment(item)
          handleDeletemodal(true)
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
                    <Link to={"/Equipments"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Equipments/Create"}
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
          <EquipmentsDelete />
        </React.Fragment>
    )
  }

  equipmentgroupCellhandler = (col) => {
    const { Equipmentgroups } = this.props
    if (Equipmentgroups.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Equipmentgroups.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  floorCellhandler = (col) => {
    const { Floors } = this.props
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Floors.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  roomCellhandler = (col) => {
    const { Rooms } = this.props
    if (Rooms.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Rooms.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  bedCellhandler = (col) => {
    const { Beds } = this.props
    if (Beds.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Beds.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  userCellhandler = (col) => {
    const { Users } = this.props
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Users.list || []).find(u => u.Uuid === col.value)?.Username
    }
  }

}