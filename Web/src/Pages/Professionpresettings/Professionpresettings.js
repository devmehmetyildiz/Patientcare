import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { getInitialconfig } from '../../Utils/Constants'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import ProfessionpresettingsDelete from '../../Containers/Professionpresettings/ProfessionpresettingsDelete'
import Formatdate, { Getdateoptions } from '../../Utils/Formatdate'

export default class Professionpresettings extends Component {

  componentDidMount() {
    const { GetProfessionpresettings, GetFloors, GetShiftdefines, GetProfessions } = this.props
    GetProfessionpresettings()
    GetFloors()
    GetShiftdefines()
    GetProfessions()
  }

  render() {
    const { Professionpresettings, Profile, handleDeletemodal, handleSelectedProfessionpresetting } = this.props
    const { isLoading } = Professionpresettings

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
      { Header: Literals.Columns.Profession[Profile.Language], accessor: row => this.professionCellhandler(row?.ProfessionID), },
      { Header: Literals.Columns.Floor[Profile.Language], accessor: row => this.floorCellhandler(row?.FloorID), },
      { Header: Literals.Columns.Shiftdefine[Profile.Language], accessor: row => this.shiftdefineCellhandler(row?.ShiftdefineID), },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Isdeactive[Profile.Language], accessor: row => this.boolCellhandler(row?.Isdeactive), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Iscompleted[Profile.Language], accessor: row => this.boolCellhandler(row?.Iscompleted), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Ispersonelstay[Profile.Language], accessor: row => this.boolCellhandler(row?.Ispersonelstay), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Minpersonelcount[Profile.Language], accessor: 'Minpersonelcount' },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Professionpresettings"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Professionpresettings.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Professionpresettings/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedProfessionpresetting(item)
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
                    <Link to={"/Professionpresettings"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Professionpresettings/Create"}
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
          <ProfessionpresettingsDelete />
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

  professionCellhandler = (value) => {
    const { Professions } = this.props
    if (Professions.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const profession = (Professions.list || []).find(u => u.Uuid === value)
      return profession?.Name
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