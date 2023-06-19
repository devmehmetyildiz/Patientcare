import React from 'react'
import { Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import Literals from './Literals'

export default function PurchaseordersList({ Data, Columns, initialConfig, Profile }) {

  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
      let stocks = []
      const decoratedstocks = Data.filter(u => u.Id === row.original.Id)
      decoratedstocks.forEach(element => {
        stocks = stocks.concat(element.Stocks)
      });
      const stockcolumns = [
        { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
        { Header: Literals.Columns.StockDefine[Profile.Language], accessor: 'Stockdefine.Name', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Department[Profile.Language], accessor: 'Department.Name', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Skt[Profile.Language], accessor: 'Skt', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Barcodeno[Profile.Language], accessor: 'Barcodeno', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      ]
      return <div className='w-full p-4'>
        <Header as='h4' attached='top' className='w-full text-center flex justify-center items-center'>{Literals.Columns.Stocks[Profile.Language]}</Header>
        <DataTable
          Columns={stockcolumns}
          Data={stocks.sort((a, b) => a.Order - b.Order)}
        />
      </div>
    }
    , [])


  return (
    <DataTable
      Columns={Columns}
      Data={Data}
      Config={initialConfig}
      renderRowSubComponent={renderRowSubComponent}
    />
  )
}
