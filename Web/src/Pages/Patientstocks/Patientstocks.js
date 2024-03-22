import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import PatientstocksDelete from "../../Containers/Patientstocks/PatientstocksDelete"
import PatientstocksApprove from "../../Containers/Patientstocks/PatientstocksApprove"
import { getInitialconfig } from '../../Utils/Constants'
export default class Patientstocks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

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
    const { isLoading } = Patientstocks

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Patient[Profile.Language], accessor: row => this.patientCellhandler(row?.PatientID), Title: true },
      { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: row => this.stockdefineCellhandler(row?.StockdefineID), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Department[Profile.Language], accessor: row => this.departmentCellhandler(row?.DepartmentID), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Amount[Profile.Language], accessor: row => this.amountCellhandler(row), Lowtitle: true, Withtext: true },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info' },
      { Header: Literals.Columns.Isapproved[Profile.Language], accessor: row => this.boolCellhandler(row?.Isapproved), Subtitle: true, Withtext: true },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.change[Profile.Language], accessor: 'change', disableProps: true },
      { Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "patientstock"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Patientstocks.list || []).filter(u => !u.Ismedicine && !u.Issupply && u.Isactive).map(item => {
      return {
        ...item,
        change: <Link to={`/Patientstockmovements/Create?StockID=${item.Uuid}`} ><Icon link size='large' className='text-[#7ec5bf] hover:text-[#5bbdb5]' name='sitemap' /></Link>,
        edit: <Link to={`/Patientstocks/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
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
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Patientstocks"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Patientstocks/Create"}
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
          <PatientstocksDelete />
          <PatientstocksApprove />
        </React.Fragment>
    )
  }

  departmentCellhandler = (value) => {
    const { Departments } = this.props
    if (Departments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Departments.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  patientCellhandler = (value) => {
    const { Patients, Patientdefines } = this.props
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }
  }

  stockdefineCellhandler = (value) => {
    const { Stockdefines } = this.props
    if (Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stockdefines.list || []).find(u => u.Uuid === value)?.Name
    }
  }

  amountCellhandler = (row) => {
    const { Patientstockmovements, Patientstocks } = this.props
    if (Patientstockmovements.isLoading || Patientstocks.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Patientstocks.list || []).find(u => u.Id === row?.Id)
      let amount = 0.0;
      let movements = (Patientstockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return amount
    }
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    return value !== null && (value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }
}