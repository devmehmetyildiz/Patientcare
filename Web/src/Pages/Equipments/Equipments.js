import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import EquipmentsDelete from "../../Containers/Equipments/EquipmentsDelete"
import GetInitialconfig from '../../Utils/GetInitialconfig'
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

    const t = Profile?.i18n?.t

    const { isLoading } = Equipments

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Equipments.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Equipments.Column.Equipmentgroup'), accessor: row => this.equipmentgroupCellhandler(row?.EquipmentgroupID), Subtitle: true, Withtext: true },
      { Header: t('Pages.Equipments.Column.Floor'), accessor: row => this.floorCellhandler(row?.FloorID) },
      { Header: t('Pages.Equipments.Column.Room'), accessor: row => this.roomCellhandler(row?.RoomID) },
      { Header: t('Pages.Equipments.Column.Bed'), accessor: row => this.bedCellhandler(row?.BedID) },
      { Header: t('Pages.Equipments.Column.User'), accessor: row => this.userCellhandler(row?.UserID) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "equipment"
    let initialConfig = GetInitialconfig(Profile, metaKey)

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
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Equipments"}>
                      <Breadcrumb.Section>{t('Pages.Equipments.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Equipments.Page.CreateHeader')}
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
              </div> : <NoDataScreen message={t('Common.NoDataFound')} />
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