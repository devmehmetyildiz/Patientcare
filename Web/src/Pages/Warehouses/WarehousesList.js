import React from 'react'
import { Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'

export default function WarehousesList({ Data, Columns, initialConfig }) {

  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
      let stocks = []
      const decoratedstocks = Data.filter(u => u.id === row.original.id)
      decoratedstocks.forEach(element => {
        stocks = stocks.concat(element.stocks)
      });
      const stockcolumns = [
        { Header: 'Id', accessor: 'id', sortable: true, canGroupBy: true, canFilter: true, },
        { Header: 'Ürün', accessor: 'stockdefine.name', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Departman', accessor: 'department.name', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Skt', accessor: 'skt', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Barkod No', accessor: 'barcodeno', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Toplam Miktar', accessor: 'maxamount', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Aktüel Miktar', accessor: 'amount', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Kullanılan Miktar', accessor: 'usageamount', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Açıklama', accessor: 'info', sortable: true, canGroupBy: true, canFilter: true },
        { Header: 'Kaynak', accessor: 'source', sortable: true, canGroupBy: true, canFilter: true },
      ]
      return <div className='w-full p-4'>
        <Header as='h4' attached='top' className='w-full text-center flex justify-center items-center'>Stoklar</Header>
        <DataTable
          Columns={stockcolumns}
          Data={stocks.sort((a, b) => a.order - b.order)}
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
