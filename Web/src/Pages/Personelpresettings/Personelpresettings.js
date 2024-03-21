import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { getInitialconfig } from '../../Utils/Constants'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import PersonelpresettingsDelete from '../../Containers/Personelpresettings/PersonelpresettingsDelete'
import Formatdate, { Getdateoptions } from '../../Utils/Formatdate'

export default class Personelpresettings extends Component {

  componentDidMount() {
    const { GetPersonelpresettings, GetFloors, GetShiftdefines, GetUsers } = this.props
    GetPersonelpresettings()
    GetFloors()
    GetShiftdefines()
    GetUsers()
  }

  render() {
    const { Personelpresettings, Profile, handleDeletemodal, handleSelectedPersonelpresetting } = this.props
    const { isLoading } = Personelpresettings

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Isinfinite[Profile.Language], accessor: row => this.boolCellhandler(row?.Isinfinite), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Startdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Startdate), },
      { Header: Literals.Columns.Personel[Profile.Language], accessor: row => this.personelCellhandler(row?.PersonelID), },
      { Header: Literals.Columns.Floor[Profile.Language], accessor: row => this.floorCellhandler(row?.FloorID), },
      { Header: Literals.Columns.Shiftdefine[Profile.Language], accessor: row => this.shiftdefineCellhandler(row?.ShiftdefineID), },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Isdeactive[Profile.Language], accessor: row => this.boolCellhandler(row?.Isdeactive), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Iscompleted[Profile.Language], accessor: row => this.boolCellhandler(row?.Iscompleted), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Personelpresettings"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Personelpresettings.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Personelpresettings/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPersonelpresetting(item)
          handleDeletemodal(true)
        }} />
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
                    <Link to={"/Personelpresettings"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Personelpresettings/Create"}
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
          <PersonelpresettingsDelete />
        </React.Fragment>
    )
  }

  floorCellhandler = (value) => {
    const { Floors } = this.props
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const floor = (Floors.list || []).find(u => u.Uuid === value)
      return floor?.Name || ''
    }
  }

  shiftdefineCellhandler = (value) => {
    const { Shiftdefines } = this.props
    if (Shiftdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const shiftdefine = (Shiftdefines.list || []).find(u => u.Uuid === value)
      return shiftdefine?.Name || ''
    }
  }

  personelCellhandler = (value) => {
    const { Users } = this.props
    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const user = (Users.list || []).find(u => u.Uuid === value)
      return user && (`${user?.Name} ${user?.Surname}`)
    }
  }

  dateCellhandler = (value) => {
    if (value) {
      const dates = Getdateoptions()
      if (dates.find(u => Formatdate(u.value) === Formatdate(value))) {
        return `${dates.find(u => Formatdate(u.value) === Formatdate(value))?.text} (${Formatdate(value)})`
      } else {
        return Formatdate(value)
      }
    }
    return null
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

  booliconCellhandler = ({ value }) => {
    const { Profile } = this.props
    return value === Literals.Messages.Yes[Profile.Language] ? <Icon color='green' name='checkmark' /> : <Icon color='red' name='close' />
  }
}