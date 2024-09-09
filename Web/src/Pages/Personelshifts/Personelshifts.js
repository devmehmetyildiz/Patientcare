import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import PersonelshiftsDelete from '../../Containers/Personelshifts/PersonelshiftsDelete'
import Formatdate, { Getdateoptions } from '../../Utils/Formatdate'
import PersonelshiftsApprove from '../../Containers/Personelshifts/PersonelshiftsApprove'
import PersonelshiftsComplete from '../../Containers/Personelshifts/PersonelshiftsComplete'
import PersonelshiftsDeactive from '../../Containers/Personelshifts/PersonelshiftsDeactive'
export default class Personelshifts extends Component {

  componentDidMount() {
    const { GetPersonelshifts, GetProfessions } = this.props
    GetPersonelshifts()
    GetProfessions()
  }

  render() {
    const { Personelshifts, Profile, handleDeletemodal, handleSelectedPersonelshift, handleApprovemodal, handleCompletemodal, handleDeactivemodal } = this.props
    const { isLoading } = Personelshifts

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Startdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Startdate), Title: true },
      { Header: Literals.Columns.Profession[Profile.Language], accessor: row => this.professionCellhandler(row?.ProfessionID), },
      { Header: Literals.Columns.Isworking[Profile.Language], accessor: row => this.boolCellhandler(row?.Isworking), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Isdeactive[Profile.Language], accessor: row => this.boolCellhandler(row?.Isdeactive), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Iscompleted[Profile.Language], accessor: row => this.boolCellhandler(row?.Iscompleted), disableProps: true, Cell: (col, row) => this.booliconCellhandler(col, row), },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.complete[Profile.Language], accessor: 'complete', disableProps: true },
      { Header: Literals.Columns.deactive[Profile.Language], accessor: 'deactive', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "personelshift"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Personelshifts.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Personelshifts/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPersonelshift(item)
          handleDeletemodal(true)
        }} />,
        approve: item.Isdeactive || item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          handleSelectedPersonelshift(item)
          handleApprovemodal(true)
        }} />,
        complete: item.Isdeactive || !item.Isapproved || item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='check square' onClick={() => {
          handleSelectedPersonelshift(item)
          handleCompletemodal(true)
        }} />,
        deactive: item.Isdeactive || item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='black' name='alternate trash' onClick={() => {
          handleSelectedPersonelshift(item)
          handleDeactivemodal(true)
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
                    <Link to={"/Personelshifts"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Personelshifts/Create"}
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
          <PersonelshiftsDelete />
          <PersonelshiftsApprove />
          <PersonelshiftsComplete />
          <PersonelshiftsDeactive />
        </React.Fragment>
    )
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

  booliconCellhandler = (col) => {
    const { Profile } = this.props
    if (!col?.cell?.isGrouped && !Profile.Ismobile) {
      return col?.value === Literals.Messages.Yes[Profile.Language] ? <Icon color='green' name='checkmark' /> : <Icon color='red' name='close' />
    } else {
      return col?.value
    }
  }
}