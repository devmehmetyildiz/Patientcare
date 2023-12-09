import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Checkbox, Grid, Icon, Label, Loader, Modal, Tab } from 'semantic-ui-react'
import { Headerwrapper, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { getInitialconfig } from '../../Utils/Constants'


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
  const [suppliesmodal, setSuppliesmodal] = useState(false)
  const [purchaseorderstocksmodal, setPurchaseorderstocksmodal] = useState(false)
  const [purchaseordermedicinesmodal, setPurchaseordermedicinesmodal] = useState(false)
  const [purchaseordersuppliesmodal, setPurchaseordersuppliesmodal] = useState(false)
  const [patientstocksmodal, setPatientstocksmodal] = useState(false)
  const [patientmedicinesmodal, setPatientmedicinesmodal] = useState(false)
  const [patientsuppliesmodal, setPatientsuppliesmodal] = useState(false)

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
    GetWarehouses,
    GetUnits,
    Profile,
    Stocks,
    Warehouses,
    Purchaseorderstocks,
    Patientstocks,
    fillPatientstocknotification,
    ApprovePatientstocks, ApprovemultiplePatientstocks,
    ApprovePurchaseorderstocks, ApprovemultiplePurchaseorderstocks,
    ApproveStocks, ApprovemultipleStocks
  } = props

  const colProps = {
    sortable: true,
    canGroupBy: true,
    canFilter: true
  }

  useEffect(() => {
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
    GetWarehouses()
  }, [])


  const getAmountcolumn = (type, col) => {
    switch (type) {
      case 'stocks':
        return stockamountCellhandler(col)
      case 'purchaseorders':
        return purchaseorderamountCellhandler(col)
      case 'patients':
        return patientstockamountCellhandler(col)
    }
  }

  const getDecoratedlist = (List, filters, setFilters, setItem, setApprovemodal) => {
    return (List.list || []).filter(u => u.Isactive && !u.Isapproved).map(item => {
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
    columns.push({ Header: Literals.Columns.Stock.Id[Profile.Language], accessor: 'Id', })
    type === 'stocks' && columns.push({ Header: Literals.Columns.Stock.Warehouse[Profile.Language], accessor: 'WarehouseID', Cell: col => warehouseCellhandler(col) })
    type === 'patients' && columns.push({ Header: Literals.Columns.Stock.Patient[Profile.Language], accessor: 'PatientID', Cell: col => patientCellhandler(col) })
    type === 'purchaseorders' && columns.push({ Header: Literals.Columns.Stock.Purchaseorder[Profile.Language], accessor: 'PurchaseorderID', Cell: col => purchaseorderCellhandler(col) })
    columns.push({ Header: Literals.Columns.Stock.Stockdefine[Profile.Language], accessor: 'StockdefineID', Firstheader: true, Cell: col => stockdefineCellhandler(col) })
    columns.push({ Header: Literals.Columns.Stock.Department[Profile.Language], accessor: 'DepartmentID', Subheader: true, Cell: col => departmentCellhandler(col) })
    medicine && columns.push({ Header: Literals.Columns.Stock.Skt[Profile.Language], accessor: 'Skt', Cell: col => dateCellhandler(col) })
    medicine && columns.push({ Header: Literals.Columns.Stock.Barcodeno[Profile.Language], accessor: 'Barcodeno', })
    columns.push({ Header: Literals.Columns.Stock.Amount[Profile.Language], accessor: 'Amount', Finalheader: true, Cell: col => getAmountcolumn(type, col) })
    columns.push({ Header: Literals.Columns.Stock.Info[Profile.Language], accessor: 'Info', })
    columns.push({ Header: Literals.Columns.Stock.Isapproved[Profile.Language], accessor: 'Isapproved', Cell: col => boolCellhandler(col) })
    medicine && columns.push({ Header: Literals.Columns.Stock.Isredprescription[Profile.Language], accessor: 'Isredprescription', Cell: col => boolCellhandler(col) })
    columns.push({ Header: Literals.Columns.Stock.Createduser[Profile.Language], accessor: 'Createduser', })
    columns.push({ Header: Literals.Columns.Stock.Updateduser[Profile.Language], accessor: 'Updateduser', })
    columns.push({ Header: Literals.Columns.Stock.Createtime[Profile.Language], accessor: 'Createtime', })
    columns.push({ Header: Literals.Columns.Stock.Updatetime[Profile.Language], accessor: 'Updatetime', })
    columns.push({ Header: Literals.Columns.Stock.approve[Profile.Language], accessor: 'approve', disableFilters: true, disableProps: true, visible: !selectVisiblestate })
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

  const purchaseorderCellhandler = (col) => {
    const { Purchaseorders } = props
    if (Purchaseorders.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Purchaseorders.list || []).find(u => u.Uuid === col.value)?.Purchasenumber
    }
  }

  const dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
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

  const stockslist = getDecoratedlist(Stocks, stocks, setStocks, setStock, setStockmodal).filter(u => !u.Issupply && !u.Ismedicine)
  const medicineslist = getDecoratedlist(Stocks, medicines, setMedicines, setMedicine, setMedicinemodal).filter(u => !u.Issupply && u.Ismedicine)
  const supplieslist = getDecoratedlist(Stocks, supplies, setSupplies, setSupply, setSupplymodal).filter(u => u.Issupply && !u.Ismedicine)

  const patientstockslist = getDecoratedlist(Patientstocks, patientstocks, setPatientstocks, setPatientstock, setPatientstockmodal).filter(u => !u.Issupply && !u.Ismedicine)
  const patientmedicineslist = getDecoratedlist(Patientstocks, patientmedicines, setPatientmedicines, setPatientmedicine, setPatientmedicinemodal).filter(u => !u.Issupply && u.Ismedicine)
  const patientsupplieslist = getDecoratedlist(Patientstocks, patientsupplies, setPatientsupplies, setPatientsupply, setPatientsupplymodal).filter(u => u.Issupply && !u.Ismedicine)

  const purchaseorderstockslist = getDecoratedlist(Purchaseorderstocks, purchaseorderstocks, setPurchaseorderstocks, setPurchaseorderstock, setPurchaseorderstockmodal).filter(u => !u.Issupply && !u.Ismedicine)
  const purchaseordermedicineslist = getDecoratedlist(Purchaseorderstocks, purchaseordermedicines, setPurchaseordermedicines, setPurchaseordermedicine, setPurchaseordermedicinemodal).filter(u => !u.Issupply && u.Ismedicine)
  const purchaseordersupplieslist = getDecoratedlist(Purchaseorderstocks, purchaseordersupplies, setPurchaseordersupplies, setPurchaseordersupply, setPurchaseordersupplymodal).filter(u => u.Issupply && !u.Ismedicine)


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
      pageHeader: Literals.Page.Stock.PageStockmainheader[Profile.Language],
      key: 'stockmain',
      pages: [
        {
          pageHeader: Literals.Page.Stock.PageStockheader[Profile.Language],
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
          setmultipleModalstate: (state) => { setStocksmodal(state) },
          approvemultiple: () => { ApprovemultipleStocks(stocks) },
          singleModalstate: stockmodal,
          filter: stock,
          setsingleModalstate: (state) => { setStockmodal(state) },
          approvesingle: () => { ApproveStocks({ Uuid: stock }) },
        },
        {
          pageHeader: Literals.Page.Stock.PageMedicineheader[Profile.Language],
          list: medicineslist,
          column: medicineColumns,
          key: 'medicine',
          config: medicinesInitialconfig,
          meta: medicinesMetakey,
          openFilter: () => {
            setopenMedicinefilter(!openMedicinefilter)
            setMedicines([])
          },
          openfilter: openMedicinefilter,
          filters: medicines,
          openMultiplemodal: () => { setMedicinesmodal(true) },
          multipleModalstate: medicinesmodal,
          setmultipleModalstate: (state) => { setMedicinesmodal(state) },
          approvemultiple: () => { ApprovemultipleStocks(medicines) },
          singleModalstate: medicinemodal,
          filter: medicine,
          setsingleModalstate: (state) => { setMedicinemodal(state) },
          approvesingle: () => { ApproveStocks({ Uuid: medicine }) },
        },
        {
          pageHeader: Literals.Page.Stock.PageSupplyheader[Profile.Language],
          list: supplieslist,
          column: supplyColumns,
          key: 'supply',
          config: supplyInitialconfig,
          meta: suppliesMetakey,
          openFilter: () => {
            setopenSupplyfilter(!openSupplyfilter)
            setSupplies([])
          },
          openfilter: openSupplyfilter,
          filters: supplies,
          openMultiplemodal: () => { setSuppliesmodal(true) },
          multipleModalstate: suppliesmodal,
          setmultipleModalstate: (state) => { setSuppliesmodal(state) },
          approvemultiple: () => { ApprovemultipleStocks(supplies) },
          singleModalstate: supplymodal,
          filter: supply,
          setsingleModalstate: (state) => { setSupplymodal(state) },
          approvesingle: () => { ApproveStocks({ Uuid: supply }) },
        },

      ]
    },
    {
      pageHeader: Literals.Page.Stock.PagePurchaseordermainheader[Profile.Language],
      key: 'purchaseordermain',
      pages: [
        {
          pageHeader: Literals.Page.Stock.PagePurchaseorderstockheader[Profile.Language],
          list: purchaseorderstockslist,
          column: purchaseorderstockColumns,
          key: 'purcasheroderstock',
          config: purchaseorderstocksInitialconfig,
          meta: purchaseorderstocksMetakey,
          openFilter: () => {
            setopenPurchaseorderstockfilter(!openPurchaseorderstockfilter)
            setPurchaseorderstocks([])
          },
          openfilter: openPurchaseorderstockfilter,
          filters: purchaseorderstocks,
          openMultiplemodal: () => { setPurchaseorderstocksmodal(true) },
          multipleModalstate: purchaseorderstocksmodal,
          setmultipleModalstate: (state) => { setPurchaseorderstocksmodal(state) },
          approvemultiple: () => { ApprovemultiplePurchaseorderstocks(purchaseorderstocks) },
          singleModalstate: purchaseorderstockmodal,
          filter: purchaseorderstock,
          setsingleModalstate: (state) => { setPurchaseorderstockmodal(state) },
          approvesingle: () => { ApprovePurchaseorderstocks({ Uuid: purchaseorderstock }) },
        },
        {
          pageHeader: Literals.Page.Stock.PagePurchaseordermedicineheader[Profile.Language],
          list: purchaseordermedicineslist,
          column: purchaseordermedicineColumns,
          key: 'purchaseordermedicine',
          config: purchaseordermedicinesInitialconfig,
          meta: purchaseordermedicinesMetakey,
          openFilter: () => {
            setopenPurchaseordermedicinefilter(!openPurchaseordermedicinefilter)
            setPurchaseordermedicines([])
          },
          openfilter: openPurchaseordermedicinefilter,
          filters: purchaseordermedicines,
          openMultiplemodal: () => { setPurchaseordermedicinesmodal(true) },
          multipleModalstate: purchaseordermedicinesmodal,
          setmultipleModalstate: (state) => { setPurchaseordermedicinesmodal(state) },
          approvemultiple: () => { ApprovemultiplePurchaseorderstocks(purchaseordermedicines) },
          singleModalstate: purchaseordermedicinemodal,
          filter: purchaseordermedicine,
          setsingleModalstate: (state) => { setPurchaseordermedicinemodal(state) },
          approvesingle: () => { ApprovePurchaseorderstocks({ Uuid: purchaseordermedicine }) },
        },
        {
          pageHeader: Literals.Page.Stock.PagePurchaseordersupplyheader[Profile.Language],
          list: purchaseordersupplieslist,
          column: purchaseordersupplyColumns,
          key: 'purchaseordersupply',
          config: purchaseordersupplyInitialconfig,
          meta: purchaseordersuppliesMetakey,
          openFilter: () => {
            setopenPurchaseordersupplyfilter(!openPurchaseordersupplyfilter)
            setPurchaseordersupplies([])
          },
          openfilter: openPurchaseordersupplyfilter,
          filters: purchaseordersupplies,
          openMultiplemodal: () => { setPurchaseordersuppliesmodal(true) },
          multipleModalstate: purchaseordersuppliesmodal,
          setmultipleModalstate: (state) => { setPurchaseordersuppliesmodal(state) },
          approvemultiple: () => { ApprovemultiplePurchaseorderstocks(purchaseordersupplies) },
          singleModalstate: purchaseordersupplymodal,
          filter: purchaseordersupply,
          setsingleModalstate: (state) => { setPurchaseordersupplymodal(state) },
          approvesingle: () => { ApprovePurchaseorderstocks({ Uuid: purchaseordersupply }) },
        },
      ]
    },
    {
      pageHeader: Literals.Page.Stock.PagePatientmainheader[Profile.Language],
      key: 'patientmain',
      pages: [
        {
          pageHeader: Literals.Page.Stock.PagePatientstockheader[Profile.Language],
          list: patientstockslist,
          column: patientstockColumns,
          key: 'patientstock',
          config: patientstocksInitialconfig,
          meta: patientstocksMetakey,
          openFilter: () => {
            setopenPatientstockfilter(!openPatientstockfilter)
            setPatientstocks([])
          },
          openfilter: openPatientstockfilter,
          filters: patientstocks,
          openMultiplemodal: () => { setPatientstocksmodal(true) },
          multipleModalstate: patientstocksmodal,
          setmultipleModalstate: (state) => { setPatientstocksmodal(state) },
          approvemultiple: () => { ApprovemultiplePatientstocks(patientstocks) },
          singleModalstate: patientstockmodal,
          filter: patientstock,
          setsingleModalstate: (state) => { setPatientstockmodal(state) },
          approvesingle: () => { ApprovePatientstocks({ Uuid: patientstock }) },
        },
        {
          pageHeader: Literals.Page.Stock.PagePatientmedicineheader[Profile.Language],
          list: patientmedicineslist,
          column: patientmedicineColumns,
          key: 'patientmedicine',
          config: patientmedicinesInitialconfig,
          meta: patientmedicinesMetakey,
          openFilter: () => {
            setopenPatientmedicinefilter(!openPatientmedicinefilter)
            setPatientmedicines([])
          },
          openfilter: openPatientmedicinefilter,
          filters: patientmedicines,
          openMultiplemodal: () => { setPatientmedicinesmodal(true) },
          multipleModalstate: patientmedicinesmodal,
          setmultipleModalstate: (state) => { setPatientmedicinesmodal(state) },
          approvemultiple: () => { ApprovemultiplePatientstocks(patientmedicines) },
          singleModalstate: patientmedicinemodal,
          filter: patientmedicine,
          setsingleModalstate: (state) => { setPatientmedicinemodal(state) },
          approvesingle: () => { ApprovePatientstocks({ Uuid: patientmedicine }) },
        },
        {
          pageHeader: Literals.Page.Stock.PagePatientsupplyheader[Profile.Language],
          list: patientsupplieslist,
          column: patientsupplyColumns,
          key: 'patientsupply',
          config: patientsupplyInitialconfig,
          meta: patientsuppliesMetakey,
          openFilter: () => {
            setopenPatientsupplyfilter(!openPatientsupplyfilter)
            setPatientsupplies([])
          },
          openfilter: openPatientsupplyfilter,
          filters: patientsupplies,
          openMultiplemodal: () => { setPatientsuppliesmodal(true) },
          multipleModalstate: patientsuppliesmodal,
          setmultipleModalstate: (state) => { setPatientsuppliesmodal(state) },
          approvemultiple: () => { ApprovemultiplePatientstocks(patientsupplies) },
          singleModalstate: patientsupplymodal,
          filter: patientsupply,
          setsingleModalstate: (state) => { setPatientsupplymodal(state) },
          approvesingle: () => { ApprovePatientstocks({ Uuid: patientsupply }) },
        },
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
                  <Breadcrumb.Section>{Literals.Page.Stock.Pageheader[Profile.Language]}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </Grid.Column>
          </Grid>
        </Headerwrapper>
        <Pagedivider />
        <Tab
          className="w-full bg-white"
          panes={Listdata.map(data => {
            return {
              menuItem: data.pageHeader,
              pane: {
                key: data.key,
                content: <div className='w-full flex flex-col justify-start items-center'>
                  {data.pages.map((page => {
                    return page.list.length > 0 ? <div className='w-full mt-4 flex flex-col items-center justify-center' key={Math.random()}>
                      <div className='py-2 w-full flex justify-start items-center'>
                        <Label size='large' color={'blue'}>{page.pageHeader}</Label>
                      </div>
                      {page.list.length > 0 ?
                        <div className='w-full mx-auto '>
                          {Profile.Ismobile ?
                            <MobileTable Columns={page.column} Data={page.list} Config={page.config} Profile={Profile} /> :
                            <div className='flex flex-col w-full justify-center items-center gap-2'>
                              <div className='flex flex-row  justify-between items-center w-full'>
                                <Button size='mini' onClick={() => { page.openFilter() }} >{page.openfilter ? Literals.Columns.Movement.CanSelectclose[Profile.Language] : Literals.Columns.Movement.CanSelect[Profile.Language]}</Button>
                                <div className='flex flex-row  justify-end items-center w-full'>
                                  {page.openfilter && page.filters.length > 0
                                    ? <Button color='violet' onClick={() => { page.openMultiplemodal() }} >{Literals.Columns.Movement.Multipleapprove[Profile.Language]}</Button>
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
                              <DataTable Columns={page.column} Data={page.list} Config={page.config} />
                            </div>
                          }
                        </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} style={{ height: 'auto' }} />
                      }
                    </div> : null
                  }))}
                </div>
              }
            }
          })}
          renderActiveOnly={false} />
      </Pagewrapper>
      {Listdata.map(data => {
        return data.pages.map(page => {
          return <Modal
            onClose={() => { page.setmultipleModalstate(false) }}
            onOpen={() => { page.setmultipleModalstate(true) }}
            open={page.multipleModalstate}
          >
            <Modal.Header> {Literals.Columns.Stock.Multipleapprove[Profile.Language]}</Modal.Header>
            <Modal.Content image className='!block'>
              <Modal.Description>
                {Literals.Messages.Approvestockmessage[Profile.Language]}
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
                  if (!validator.isArray(page.filters)) {
                    errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Needstock[Profile.Language] })
                  }
                  if (errors.length > 0) {
                    errors.forEach(error => {
                      fillPatientstocknotification(error)
                    })
                  } else {
                    page.approvemultiple()
                    page.setmultipleModalstate(false)
                  }
                }}
                positive
              />
            </Modal.Actions>
          </Modal>
        })
      })}
      {Listdata.map(data => {
        return data.pages.map(page => {
          return <Modal
            onClose={() => { page.setsingleModalstate(false) }}
            onOpen={() => { page.setsingleModalstate(true) }}
            open={page.singleModalstate}
          >
            <Modal.Header> {Literals.Columns.Stock.Approve[Profile.Language]}</Modal.Header>
            <Modal.Content image className='!block'>
              <Modal.Description>
                {Literals.Messages.Approvestockmessagesingle[Profile.Language]}
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => { page.setsingleModalstate(false) }}>
                {Literals.Button.Close[Profile.Language]}
              </Button>
              <Button
                content={Literals.Button.Approve[Profile.Language]}
                labelPosition='right'
                icon='checkmark'
                onClick={() => {
                  let errors = []
                  if (!validator.isString(page.filter)) {
                    errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Needstock[Profile.Language] })
                  }
                  if (errors.length > 0) {
                    errors.forEach(error => {
                      fillPatientstocknotification(error)
                    })
                  } else {
                    page.approvesingle()
                    page.setsingleModalstate(false)
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


