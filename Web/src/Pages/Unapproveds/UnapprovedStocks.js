import React, { Component, useEffect, useState } from 'react'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import { Breadcrumb, Button, Checkbox, Grid, Icon, Loader, Modal, Tab } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Settings from '../../Common/Settings'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Literals from './Literals'
import NoDataScreen from '../../Utils/NoDataScreen'
import { MOVEMENTTYPES, getInitialconfig } from '../../Utils/Constants'
import DataTable from '../../Utils/DataTable'
import MobileTable from '../../Utils/MobileTable'
import validator from '../../Utils/Validator'

/*   approveMultiplestocks: false,
   approveMultiplepurchaseorderstocks: false,
   approveMultiplepatientstocks: false,
   purchaseorders: [],
   patientstocks: [],
   stocks: [],
   medicines: [],
   supplies: [],
   stock: '',
   medicine: '',
   supply: '',
   patientstock: '',
   patientmedicine: '',
   patientsupply: '',
   purchaseorderstock: '',
   purchaseordermedicine: '',
   purchaseordersupply: '',
   approvestocks: false,
   approvemedicines: false,
   approvesıpplies: false,
   approvepurchaseorderstocks: false,
   approvepurchaseordermedicines: false,
   approvepurchaseordersupplies: false,
   approvepatientstocks: false,
   approvepatientmedicines: false,
   approvepatientsupplies: false, */

export default function UnapprovedStocks(props) {

  const [openStockfilter, setopenStockfilter] = useState(false)
  const [openMedicinefilter, setopenMedicinefilter] = useState(false)
  const [openSupplyfilter, setopenSupplyfilter] = useState(false)
  const [openPatientstockfilter, setopenPatientstockfilter] = useState(false)
  const [openPatientmedicinefilter, setopenPatientmedicinefilter] = useState(false)
  const [openPatientsupplyfilter, setopenPatientsupplyfilter] = useState(false)
  const [openPurchaseorderstockfilter, setopenPurchaseorderstockfilter] = useState(false)
  const [openPurchaseordermedicinefilter, setopenPurchaseordermedicinefilter] = useState(false)
  const [openPurchaseordersupplyfilter, setopenPurchaseordersupplyfilter] = useState(false)

  const [stocks, setStocks] = useState([])
  const [medicines, setMedicines] = useState([])
  const [supplies, setSupplies] = useState([])
  const [patientstocks, setPatientstocks] = useState([])
  const [patientmedicines, setPatientmedicines] = useState([])
  const [patientsupplies, setPatientsupplies] = useState([])
  const [purchaseorderstocks, setPurchaseorderstocks] = useState([])
  const [purchaseordermedicines, setPurchaseordermedicines] = useState([])
  const [purchaseordersupplies, setPurchaseordersupplies] = useState([])

  const [stock, setStock] = useState('')
  const [medicine, setMedicine] = useState('')
  const [supply, setSupply] = useState('')
  const [purchaseorderstock, setPurchaseorderstock] = useState('')
  const [purchaseordermedicine, setPurchaseordermedicine] = useState('')
  const [purchaseordersupply, setPurchaseordersupply] = useState('')
  const [patientstock, setPatientstock] = useState('')
  const [patientmedicine, setPatientmedicine] = useState('')
  const [patientsupply, setPatientsupply] = useState('')

  const [stockmodal, setStockmodal] = useState(false)
  const [medicinemodal, setMedicinemodal] = useState(false)
  const [supplymodal, setSupplymodal] = useState(false)
  const [purchaseorderstockmodal, setPurchaseorderstockmodal] = useState(false)
  const [purchaseordermedicinemodal, setPurchaseordermedicinemodal] = useState(false)
  const [purchaseordersupplymodal, setPurchaseordersupplymodal] = useState(false)
  const [patientstockmodal, setPatientstockmodal] = useState(false)
  const [patientmedicinemodal, setPatientmedicinemodal] = useState(false)
  const [patientsupplymodal, setPatientsupplymodal] = useState(false)

  const [stocksmodal, setStocksmodal] = useState(false)
  const [medicinesmodal, setMedicinesmodal] = useState(false)
  const [supplysmodal, setSuppliesmodal] = useState(false)
  const [purchaseordersstockmodal, setPurchaseorderstocksmodal] = useState(false)
  const [purchaseordersmedicinemodal, setPurchaseordermedicinesmodal] = useState(false)
  const [purchaseorderssupplymodal, setPurchaseordersuppliesmodal] = useState(false)
  const [patientstocksmodal, setPatientstocksmodal] = useState(false)
  const [patientmedicinesmodal, setPatientmedicinesmodal] = useState(false)
  const [patientsupplysmodal, setPatientsuppliesmodal] = useState(false)

  useEffect(() => {
    const {
      GetPatientstocks,
      GetStocks,
      GetPurchaseorderstocks,
      GetPatients,
      GetPatientdefines,
      GetPatientstockmovements,
      GetPurchaseorders,
      GetPurchaseorderstockmovements,
      GetStockmovements,
      GetDepartments,
      GetStockdefines,
      GetUnits
    } = props
    GetPatientstocks()
    GetStocks()
    GetPurchaseorderstocks()
    GetPatients()
    GetPatientdefines()
    GetPatientstockmovements()
    GetPurchaseorders()
    GetPurchaseorderstockmovements()
    GetStockmovements()
    GetDepartments()
    GetStockdefines()
    GetUnits()
  }, [])


  const getAmountcolumn = (type, col) => {
    switch (type) {
      case 'stocks':
        return this.stockamountCellhandler(col)
      case 'purchaseorders':
        return this.purchaseorderamountCellhandler(col)
      case 'patients':
        return this.patientstockamountCellhandler(col)
    }
  }

  const getDecoratedlist = (List, filters, setFilters, setItem, setApprovemodal) => {
    (List.list || []).filter(u => u.Isactive && !u.Isapproved).map(item => {
      return {
        ...item,
        Select: <Checkbox
          checked={filters.find(u => u === item.Uuid) ? true : false}
          onClick={() => {
            const filter = filters.find(u => u === item.Uuid)
            filter
              ? setFilters(filters.filter(u => u !== item.Uuid))
              : setFilters([item.Uuid, ...filters])
          }
          } />,
        approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
          setItem(item.Uuid)
          setApprovemodal(true)
        }} />,
      }
    })
  }

  const generteColumn = (selectVisiblestate, type, medicine) => {
    let columns = []
    columns.push({ Header: "", accessor: 'Select', disableProps: true, visible: selectVisiblestate })
    columns.push({ Header: Literals.Columns.Movement.Id[Profile.Language], accessor: 'Id', })
    columns.push({ Header: Literals.Columns.Movement.Id[Profile.Language], accessor: 'Id', })
    type === 'stocks' && columns.push({ Header: Literals.Columns.Warehouse[Profile.Language], accessor: 'WarehouseID', Cell: col => this.warehouseCellhandler(col) })
    type === 'patients' && columns.push({ Header: Literals.Columns.Patient[Profile.Language], accessor: 'PatientID', Cell: col => this.patientCellhandler(col) })
    type === 'purchaseorders' && columns.push({ Header: Literals.Columns.Purchaseorder[Profile.Language], accessor: 'PurchaseorderID', Cell: col => this.purchaseorderCellhandler(col) })
    columns.push({ Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', Firstheader: true, Cell: col => this.stockdefineCellhandler(col) })
    columns.push({ Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', Subheader: true, Cell: col => this.departmentCellhandler(col) })
    medicine && columns.push({ Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', Cell: col => this.dateCellhandler(col) })
    medicine && columns.push({ Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', })
    columns.push({ Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => this.getAmountcolumn(type, col) })
    columns.push({ Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', })
    columns.push({ Header: Literals.Columns.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => this.boolCellhandler(col) })
    medicine && columns.push({ Header: Literals.Columns.Isredprescription[Profile.Language], accessor: 'Isredprescription', Cell: col => this.boolCellhandler(col) })
    columns.push({ Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', })
    columns.push({ Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', })
    columns.push({ Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', })
    columns.push({ Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', })
    columns.push({ Header: Literals.Columns.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true, visible: !selectVisiblestate })
    columns.map(u => { return u.disableProps ? u : { ...u, ...colProps } })
    return columns
  }

  const stockdefineCellhandler = (col) => {
    const { Stockdefines } = props
    if (Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stockdefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  const warehouseCellhandler = (col) => {
    const { Warehouses } = props
    if (Warehouses.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Warehouses.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  const departmentCellhandler = (col) => {
    const { Departments } = props
    if (Departments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Departments.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  const stockamountCellhandler = (col) => {
    const { Stockmovements, Stocks } = props
    if (Stockmovements.isLoading || Stocks.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Stocks.list || []).find(u => u.Id === col?.row?.original?.Id)
      let amount = 0.0;
      let movements = (Stockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return amount
    }
  }

  const patientCellhandler = (col) => {
    const { Patients, Patientdefines } = props
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === col.value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }
  }

  const patientstockamountCellhandler = (col) => {
    const { Patientstockmovements, Patientstocks } = props
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

  const purchaseorderamountCellhandler = (col) => {
    const { Purchaseorderstockmovements, Purchaseorderstocks } = props
    if (Purchaseorderstockmovements.isLoading || Purchaseorderstocks.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const selectedStock = (Purchaseorderstocks.list || []).find(u => u.Id === col?.row?.original?.Id)
      let amount = 0.0;
      let movements = (Purchaseorderstockmovements.list || []).filter(u => u.StockID === selectedStock?.Uuid && u.Isactive && u.Isapproved)
      movements.forEach(movement => {
        amount += (movement.Amount * movement.Movementtype);
      });
      return amount
    }
  }

  const boolCellhandler = (col) => {
    const { Profile } = props
    return col.value !== null && (col.value ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language])
  }

  const stockColumns = generteColumn(openStockfilter, 'stocks', false)
  const medicineColumns = generteColumn(openMedicinefilter, 'stocks', true)
  const supplyColumns = generteColumn(openSupplyfilter, 'stocks', true)

  const purchaseorderstockColumns = generteColumn(openPurchaseorderstockfilter, 'purchaseorders', false)
  const purchaseordermedicineColumns = generteColumn(openPurchaseordermedicinefilter, 'purchaseorders', true)
  const purchaseordersupplyColumns = generteColumn(openPurchaseordersupplyfilter, 'purchaseorders', true)

  const patientstockColumns = generteColumn(openPatientstockfilter, 'patients', false)
  const patientmedicineColumns = generteColumn(openPatientmedicinefilter, 'patients', true)
  const patientsupplyColumns = generteColumn(openPatientsupplyfilter, 'patients', true)

  const stockslist = getDecoratedlist(Stocks, stocks, setStocks, setStock, setStockmodal).filter(u => !u.Isupply, !u.Ismedicine)
  const medicineslist = getDecoratedlist(Stocks, medicines, setMedicines, setMedicine, setMedicinemodal).filter(u => !u.Isupply, u.Ismedicine)
  const supplieslist = getDecoratedlist(Stocks, supplies, setSupplies, setSupply, setSupplymodal).filter(u => u.Isupply, !u.Ismedicine)

  const patientstockslist = getDecoratedlist(Patientstocks, patientstocks, setPatientstocks, setPatientstock, setPatientstockmodal).filter(u => !u.Isupply, !u.Ismedicine)
  const patientmedicineslist = getDecoratedlist(Patientstocks, patientmedicines, setPatientmedicines, setPatientmedicine, setPatientmedicinemodal).filter(u => !u.Isupply, u.Ismedicine)
  const patientsupplieslist = getDecoratedlist(Patientstocks, patientsupplies, setPatientsupplies, setPatientsupply, setPatientsupplymodal).filter(u => u.Isupply, !u.Ismedicine)

  const purchaseorderstockslist = getDecoratedlist(Purchaseorderstocks, purchaseorderstocks, setPurchaseorderstocks, setPurchaseorderstock, setPurchaseorderstockmodal).filter(u => !u.Isupply, !u.Ismedicine)
  const purchaseordermedicineslist = getDecoratedlist(Purchaseorderstocks, purchaseordermedicines, setPurchaseordermedicines, setPurchaseordermedicine, setPurchaseordermedicinemodal).filter(u => !u.Isupply, u.Ismedicine)
  const purchaseordersupplieslist = getDecoratedlist(Purchaseorderstocks, purchaseordersupplies, setPurchaseordersupplies, setPurchaseordersupply, setPurchaseordersupplymodal).filter(u => u.Isupply, !u.Ismedicine)


  const stocksMetakey = "Stocksapprove"
  let stocksInitialconfig = getInitialconfig(Profile, stocksMetakey)
  const medicinesMetakey = "Medicinesapprove"
  let medicinesInitialconfig = getInitialconfig(Profile, medicinesMetakey)
  const suppliesMetakey = "Supplyapprove"
  let supplyInitialconfig = getInitialconfig(Profile, suppliesMetakey)

  const patientstocksMetakey = "Patientstocksapprove"
  let patientstocksInitialconfig = getInitialconfig(Profile, patientstocksMetakey)
  const patientmedicinesMetakey = "Patientmedicinesapprove"
  let patientmedicinesInitialconfig = getInitialconfig(Profile, patientmedicinesMetakey)
  const patientsuppliesMetakey = "Patientsupplyapprove"
  let patientsupplyInitialconfig = getInitialconfig(Profile, patientsuppliesMetakey)

  const purchaseorderstocksMetakey = "Purchaseorderstocksapprove"
  let purchaseorderstocksInitialconfig = getInitialconfig(Profile, purchaseorderstocksMetakey)
  const purchaseordermedicinesMetakey = "Purchaseordermedicinesapprove"
  let purchaseordermedicinesInitialconfig = getInitialconfig(Profile, purchaseordermedicinesMetakey)
  const purchaseordersuppliesMetakey = "Purchaseordersupplyapprove"
  let purchaseordersupplyInitialconfig = getInitialconfig(Profile, purchaseordersuppliesMetakey)


  const Listdata = [
    {
      pageHeader: Literals.Page.Stock.PageStockheader[Profile.Language],
      pages: [
        {
          list: stockslist,
          column: stockColumns,
          key: 'stock',
          config: stocksInitialconfig,
          meta: stocksMetakey,
          openFilter: () => {
            setopenStockfilter(!openStockfilter)
            setStocks([])
          },
          openfilter: openStockfilter,
          filters: stocks,
          openMultiplemodal: () => { setStocksmodal(true) },
          multipleModalstate: stocksmodal,
          setmultipleModalstate: (state) => { setStocksmodal(state) }
        }

      ]
    }
  ]

  return (
    <React.Fragment>
      <Pagewrapper>
        <Headerwrapper>
          <Grid columns='2' >
            <Grid.Column width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Unapprovedmovements"}>
                  <Breadcrumb.Section>{Literals.Page.Movement.Pageheader[Profile.Language]}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </Grid.Column>
          </Grid>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Tab
            className='station-tab'
            pages={Listdata.map(data => {
              return {
                menuItem: data.pageHeader,
                pane: data.pages.map((page => {
                  return {
                    key: page.key,
                    content: <React.Fragment>
                      {page.list.length > 0 ?
                        <div className='w-full mx-auto '>
                          {Profile.Ismobile ?
                            <MobileTable Columns={page.column} Data={page.list} Config={page.config} Profile={Profile} /> :
                            <div className='flex flex-col w-full justify-center items-center gap-2'>
                              <div className='flex flex-row  justify-between items-center w-full'>
                                <Button size='mini' onClick={() => { page.openFilter() }} >{page.openfilter ? Literals.Columns.Movement.CanSelectclose[Profile.Language] : Literals.Columns.Movement.CanSelect[Profile.Language]}</Button>
                                <div className='flex flex-row  justify-end items-center w-full'>
                                  {page.openfilter && page.filters.length > 0
                                    ? <Button color='violet' onClick={page.openMultiplemodal} >{Literals.Columns.Movement.Multipleapprove[Profile.Language]}</Button>
                                    : null}
                                  <Settings
                                    Profile={Profile}
                                    Columns={page.column}
                                    list={page.list}
                                    initialConfig={page.config}
                                    metaKey={page.meta}
                                    Showcolumnchooser
                                  />
                                </div>
                              </div>
                              <DataTable Columns={page.column} Data={page.list} Config={page.column} />
                            </div>
                          }
                        </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
                      }
                    </React.Fragment>
                  }
                }))
              }
            })}
            renderActiveOnly={false} />
        </Contentwrapper>
      </Pagewrapper>
      {Listdata.map(data => {
        return data.pages.map(page => {
          return <Modal
            onClose={page.setmultipleModalstate(false)}
            onOpen={() => { page.setmultipleModalstate(true) }}
            open={page.multipleModalstate}
          >
            <Modal.Header> {Literals.Columns.Movement.Multipleapprove[Profile.Language]}</Modal.Header>
            <Modal.Content image className='!block'>
              <Modal.Description>
                {Literals.Messages.Approvemovementmessage[Profile.Language]}
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => { page.setmultipleModalstate(false) }}>
                {Literals.Button.Close[Profile.Language]}
              </Button>
              <Button
                content={Literals.Button.Approve[Profile.Language]}
                labelPosition='right'
                icon='checkmark'
                onClick={() => {
                  let errors = []
                  if (!validator.isArray(this.state.stocks)) {
                    errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Needmovement[Profile.Language] })
                  }
                  if (errors.length > 0) {
                    errors.forEach(error => {
                      fillStockmovementnotification(error)
                    })
                  } else {
                    ApprovemultipleStockmovements(this.state.stocks)
                    this.setState({ approveMultiplestocks: false })
                  }
                }}
                positive
              />
            </Modal.Actions>
          </Modal>
        })
      })}
    
    </React.Fragment >
  )
}