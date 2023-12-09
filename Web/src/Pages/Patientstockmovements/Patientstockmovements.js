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
    const { isLoading, isDispatching } = Patientstockmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockID', Cell: col => this.stockCellhandler(col) },
      { Header: Literals.Columns.Movementdate[Profile.Language], accessor: 'Movementdate', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Movementtype[Profile.Language], accessor: 'Movementtype', Cell: col => this.movementCellhandler(col) },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Prevvalue[Profile.Language], accessor: 'Prevvalue', Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Newvalue[Profile.Language], accessor: 'Newvalue', Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.watch[Profile.Language], accessor: 'watch' },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit' },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete' }
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
      isLoading || isDispatching ? <LoadingPage /> :
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

  amountCellhandler = (col) => {
    const { Patientstockmovements, Patientstocks, Stockdefines, Units } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading || Units.isLoading || Patientstockmovements.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stockmovement = (Patientstockmovements.list || []).find(u => u.Id === col?.row?.original?.Id)
      const stock = (Patientstocks.list || []).find(u => u.Uuid === stockmovement?.StockID)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)
      return <p>{`${col.value || ''}  ${unit?.Name || ''}`}</p>
    }

  }

  stockCellhandler = (col) => {
    const { Patientstocks, Stockdefines } = this.props
    if (Patientstocks.isLoading || Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const stock = (Patientstocks.list || []).find(u => u.Uuid === col.value)
      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock?.StockdefineID)
      return stockdefine?.Name
    }

  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
  }

  movementCellhandler = (col) => {
    return MOVEMENTTYPES.find(u => u.value === col.value) ? MOVEMENTTYPES.find(u => u.value === col.value).Name : col.value
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

}