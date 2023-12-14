import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import PatientsuppliesDelete from "../../Containers/Patientsupplies/PatientsuppliesDelete"
import PatientsuppliesApprove from "../../Containers/Patientsupplies/PatientsuppliesApprove"
import { getInitialconfig } from '../../Utils/Constants'

export default class Patientsupplies extends Component {

  componentDidMount() {
    const { GetPatientstocks, GetPatientdefines, GetStockdefines, GetDepartments, Getpreregistrations, GetPatientstockmovements } = this.props
    GetPatientstocks()
    GetPatientdefines()
    GetStockdefines()
    GetDepartments()
    Getpreregistrations()
    GetPatientstockmovements()
  }


  render() {


    const { Patientstocks, Profile, handleDeletemodal, handleSelectedPatientstock, handleApprovemodal } = this.props
    const { isLoading, isDispatching } = Patientstocks

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Patient[Profile.Language], accessor: 'PatientID', Cell: col => this.patientCellhandler(col) },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Cell: col => this.stockdefineCellhandler(col) },
      { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Cell: col => this.departmentCellhandler(col) },
      { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno' },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Cell: col => this.amountCellhandler(col) },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info' },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.change[Profile.Language], accessor: 'change', disableProps: true },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Patientsupplies"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Patientstocks.list || []).filter(u => !u.Ismedicine && u.Isactive && u.Issupply).map(item => {
      return {
        ...item,
        change: <Link to={`/Patientstockmovements/Create?StockID=${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: <Link to={`/Patientsupplies/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        approve: item.Isapproved ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          handleSelectedPatientstock(item)
          handleApprovemodal(true)
        }} />,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPatientstock(item)
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
                    <Link to={"/Patientsupplies"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Patientsupplies/Create"}
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
          <PatientsuppliesDelete />
          <PatientsuppliesApprove />
        </React.Fragment>
    )
  }

  departmentCellhandler = (col) => {
    const { Departments } = this.props
    if (Departments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Departments.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  patientCellhandler = (col) => {
    const { Patients, Patientdefines } = this.props
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === col.value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }
  }

  stockdefineCellhandler = (col) => {
    const { Stockdefines } = this.props
    if (Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stockdefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  amountCellhandler = (col) => {
    const { Patientstockmovements, Patientstocks } = this.props
    if (Patientstockmovements.isLoading || Patientstocks.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Patientstocks.list || []).find(u => u.Id === col?.row?.original?.Id)
      let amount = 0.0;
      let movements = (Patientstockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return amount
    }
  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
  }

  boolCellhandler = (col) => {
    const { Profile } = this.props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}