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
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
      { Header: Literals.Columns.Equipmentgroup[Profile.Language], accessor: row => this.equipmentgroupCellhandler(row?.EquipmentgroupID), Subtitle: true, Withtext: true },
      { Header: Literals.Columns.Floor[Profile.Language], accessor: row => this.floorCellhandler(row?.FloorID) },
      { Header: Literals.Columns.Room[Profile.Language], accessor: row => this.roomCellhandler(row?.RoomID) },
      { Header: Literals.Columns.Bed[Profile.Language], accessor: row => this.bedCellhandler(row?.BedID) },
      { Header: Literals.Columns.User[Profile.Language], accessor: row => this.userCellhandler(row?.UserID) },
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

  equipmentgroupCellhandler = (value) => {
    const { Equipmentgroups } = this.props
    if (Equipmentgroups.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Equipmentgroups.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  floorCellhandler = (value) => {
    const { Floors } = this.props
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Floors.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  roomCellhandler = (value) => {
    const { Rooms } = this.props
    if (Rooms.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Rooms.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  bedCellhandler = (value) => {
    const { Beds } = this.props
    if (Beds.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Beds.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  userCellhandler = (value) => {
    const { Users } = this.props
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Users.list || []).find(u => u.Uuid === value)?.Username
    }
  }

}