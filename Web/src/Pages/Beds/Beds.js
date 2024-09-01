import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Confirm, Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { getInitialconfig } from '../../Utils/Constants'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import BedsDelete from '../../Containers/Beds/BedsDelete'
export default class Beds extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bedID: null,
      openConfirm: false
    }
  }

  componentDidMount() {
    const { GetBeds, GetRooms, GetFloors, GetPatients, GetPatientdefines } = this.props
    GetBeds()
    GetRooms()
    GetFloors()
    GetPatients()
    GetPatientdefines()
  }

  render() {
    const { Beds, Profile, handleDeletemodal, handleSelectedBed, ChangeBedOccupied, Rooms, Floors } = this.props
    const t = Profile?.i18n?.t
    const { isLoading } = Beds

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Beds.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Beds.Column.Room'), accessor: row => this.roomCellhandler(row?.RoomID), Subtitle: true, Withtext: true },
      { Header: t('Pages.Beds.Column.Isoccupied'), accessor: row => this.boolCellhandler(row?.Isoccupied), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Beds.Column.Patient'), accessor: row => this.patientCellhandler(row?.PatientID, row?.Uuid), Withtext: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "bed"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Beds.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Beds/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedBed(item)
          handleDeletemodal(true)
        }} />
      }
    })

    const bed = (Beds.list || []).find(u => u.Uuid === this.state.bedID)
    const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
    const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
    const bedName = `${bed?.Name} (${room?.Name}-${floor?.Name})`

    return (
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Confirm
            cancelButton={t('Common.Button.Giveup')}
            confirmButton={t('Common.Button.Update')}
            content={`${bedName} ${t('Pages.Beds.Messages.EmptyCheck')}`}
            open={this.state.openConfirm}
            onCancel={() => {
              this.setState({
                bedID: null,
                openConfirm: false
              })
            }}
            onConfirm={() => {
              ChangeBedOccupied({
                data: {
                  BedID: this.state.bedID,
                  Isoccupied: false
                }
              })
              this.setState({
                bedID: null,
                openConfirm: false
              })
            }}
          />
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Beds"}>
                      <Breadcrumb.Section>{t('Pages.Beds.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Beds.Page.CreateHeader')}
                  Pagecreatelink={"/Beds/Create"}
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
          <BedsDelete />
        </React.Fragment>
    )
  }

  roomCellhandler = (value) => {
    const { Rooms, Floors } = this.props
    if (Rooms.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const room = (Rooms.list || []).find(u => u.Uuid === value)
      const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)
      return `${room?.Name} (${floor?.Name})`
    }
  }

  patientCellhandler = (value, bedID) => {
    const { Patients, Patientdefines } = this.props
    if (Patients.isLoading || Patientdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return patientdefine
        ? <div
          className='group cursor-pointer flex flex-row flex-nowrap'
        >
          {`${patientdefine?.Firstname} ${patientdefine?.Lastname} (${patientdefine?.CountryID})`}
          <div
            onClick={() => {
              this.setState({
                bedID: bedID,
                openConfirm: true
              })
            }}
            className='opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500'>
            <Icon color='red' name='delete' />
          </div>
        </div>
        : null
    }
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Pages.Beds.Label.Filled') : t('Pages.Beds.Label.Empty'))
  }
}