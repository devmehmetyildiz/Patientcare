import React from 'react'
import {  Label, Loader } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import Literals from './Literals'

export default function PurchaseordersList({ Data, Columns, initialConfig, Profile, Departments, Stockdefines, Purchaseorderstocks, Purchaseorderstockmovements }) {

  const stockdefineCellhandler = (col) => {
    if (Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stockdefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  const departmentCellhandler = (col) => {
    if (Departments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Departments.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  const dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
  }

  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
      const purchaseorder = Data.find(u => u.Id === row.original.Id)
      let stocks = (Purchaseorderstocks.list || []).filter(u => u.PurchaseorderID === purchaseorder.Uuid && u.Isapproved && u.Isactive)
      const decoratedStocks = (stocks || []).map(stock => {
        let amount = 0.0;
        let movements = (Purchaseorderstockmovements.list || []).filter(u => u.StockID === stock.Uuid && u.Isactive && u.Isapproved)
        for (const movement of movements) {
          amount += (movement.Amount * movement.Movementtype);
        }
        return {
          ...stock,
          Amount: amount
        }
      })

      const medicinecolumns = [
        { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
        { Header: Literals.Columns.StockDefine[Profile.Language], accessor: 'StockdefineID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => stockdefineCellhandler(col) },
        { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => departmentCellhandler(col) },
        { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', sortable: true, canGroupBy: true, canFilter: true, Cell: col => dateCellhandler(col) },
        { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      ]

      const stockcolumns = [
        { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
        { Header: Literals.Columns.StockDefine[Profile.Language], accessor: 'StockdefineID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => stockdefineCellhandler(col) },
        { Header: Literals.Columns.Department[Profile.Language], accessor: 'DepartmentID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => departmentCellhandler(col) },
        { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      ]

      return <React.Fragment>
        <div className='w-full p-4'>
          <Label className='!ml-4' basic color='blue' ribbon>{Literals.Columns.Stocks[Profile.Language]}</Label>
          <DataTable
            Columns={stockcolumns}
            Data={decoratedStocks.sort((a, b) => a.Order - b.Order).filter(u => !u.Ismedicine && !u.Issupply)}
          />
        </div>
        <div className='w-full p-4'>
          <Label className='!ml-4' basic color='blue' ribbon>{Literals.Columns.Medicines[Profile.Language]}</Label>
          <DataTable
            Columns={medicinecolumns}
            Data={decoratedStocks.sort((a, b) => a.Order - b.Order).filter(u => u.Ismedicine && !u.Issupply)}
          />
        </div>
        <div className='w-full p-4'>
          <Label className='!ml-4' basic color='blue' ribbon>{Literals.Columns.Supplies[Profile.Language]}</Label>
          <DataTable
            Columns={medicinecolumns}
            Data={decoratedStocks.sort((a, b) => a.Order - b.Order).filter(u => !u.Ismedicine && u.Issupply)}
          />
        </div>
      </React.Fragment>
    }
    , [Data, Departments, Stockdefines, Purchaseorderstocks])


  return (
    <DataTable
      Columns={Columns}
      Data={Data}
      Config={initialConfig}
      renderRowSubComponent={renderRowSubComponent}
    />
  )
}
