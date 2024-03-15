import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import { MOVEMENTTYPES, getInitialconfig } from '../../Utils/Constants'
import PatientstockmovementsDelete from '../../Containers/Patientstockmovements/PatientstockmovementsDelete'
import PatientstockmovementsApprove from '../../Containers/Patientstockmovements/PatientstockmovementsApprove'

export default class Patientstockmovements extends Component {

  componentDidMount() {
    const { GetPatientstockmovements, GetPatientstocks, GetUnits, GetStockdefines } = this.props
    GetPatientstockmovements()
    GetStockdefines()
    GetPatientstocks()
    GetUnits()
  }

  render() {

    const { Patientstockmovements, Profile, handleSelectedPatientstockmovement, handleDeletemodal, handleApprovemodal } = this.props
    const { isLoading } = Patientstockmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: row => this.stockCellhandler(row?.StockID), Title: true },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: row => this.dateCellhandler(row?.Movementdate) },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: row => this.movementCellhandler(row?.Movementtype), Subtitle: true, Withtext: true },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: row => this.amountCellhandler(row), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Prevvalue[Profile.Language], accessor: row => this.prevamountCellhandler(row) },
      { Header: Literals.Columns.Newvalue[Profile.Language], accessor: row => this.newamountCellhandler(row) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.watch[Profile.Language], accessor: 'watch', disableProps: true },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    const metaKey = "Patientstockmovements"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Patientstockmovements.list || []).map(item => {
      return {
        ...item,
        watch: <Link to={`/Patientstockmovements/${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: <Link to={`/Patientstockmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          handleSelectedPatientstockmovement(item)
          handleApprovemodal(true)
        }} />,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatientstockmovement(item)
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
                    <Link to={"/Patientstockmovements"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Patientstockmovements/Create"}
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
          <PatientstockmovementsDelete />
          <PatientstockmovementsApprove />
        </React.Fragment>
    )
  }

  amountCellhandler = (row) => {
    const { Patientstockmovements, Patientstocks, Stockdefines, Units } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading || Units.isLoading || Patientstockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Patientstockmovements.list || []).find(u => u.Id === row?.Id)
      const stock = (Patientstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return `${row?.Amount || 0}  ${unit?.Name || ''}`
    }
  }

  prevamountCellhandler = (row) => {
    const { Patientstockmovements, Patientstocks, Stockdefines, Units } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading || Units.isLoading || Patientstockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Patientstockmovements.list || []).find(u => u.Id === row?.Id)
      const stock = (Patientstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return `${row?.Prevvalue || 0}  ${unit?.Name || ''}`
    }
  }

  newamountCellhandler = (row) => {
    const { Patientstockmovements, Patientstocks, Stockdefines, Units } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading || Units.isLoading || Patientstockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Patientstockmovements.list || []).find(u => u.Id === row?.Id)
      const stock = (Patientstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return `${row?.Newvalue || 0}  ${unit?.Name || ''}`
    }
  }

  stockCellhandler = (value) => {
    const { Patientstocks, Stockdefines } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Patientstocks.list || []).find(u => u.Uuid === value)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      return stockdefine?.Name
    }

  }

  dateCellhandler = (value) => {
    if (value) {
      return value.split('T').length > 0 ? value.split('T')[0] : value
    }
    return null
  }

  movementCellhandler = (value) => {
    return MOVEMENTTYPES.find(u => u.value === value) ? MOVEMENTTYPES.find(u => u.value === value).Name : value
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

}