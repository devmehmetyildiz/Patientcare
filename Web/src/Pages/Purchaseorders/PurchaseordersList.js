import React from 'react'
import { Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'

export default function PurchaseordersList({ Data, Columns, initialConfig }) {

  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
      let stocks = []
      const decoratedstocks = Data.filter(u => u.Id === row.original.Id)
      decoratedstocks.forEach(element => {
        stocks = stocks.concat(element.Stocks)
      });
      const stockcolumns = [
        { Header: 'Id', accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
        { Header: 'Ürün', accessor: 'Stockdefine.Name', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Departman', accessor: 'Department.Name', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Skt', accessor: 'Skt', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Barkod No', accessor: 'Barcodeno', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Aktüel Miktar', accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Açıklama', accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      ]
      return <div className='w-full p-4'>
        <Header as='h4' attached='top' className='w-full text-center flex justify-center items-center'>Stoklar</Header>
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
