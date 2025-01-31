import React from 'react'
import { Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { DataTable } from '../../Components'

export default function WarehousesList({ Data, Columns, Stocks, initialConfig, Profile, Units, Stockmovements, Stockdefines }) {

  const stockdefineCellhandler = (col) => {
    if (Stockdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Stockdefines.list || []).find(u => u.Uuid === col.value)?.Name
    }
  }

  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
      const warehouse = Data.find(u => u.Id === row.original.Id)
      let stocks = (Stocks.list || []).filter(u => u.WarehouseID === warehouse.Uuid && u.Isactive)

      const decoratedStocks = (stocks || []).map(stock => {
        let amount = 0.0;
        let movements = (Stockmovements.list || []).filter(u => u.StockID === stock.Uuid && u.Isactive && u.Isapproved)
        for (const movement of movements) {
          amount += (movement.Amount * movement.Movementtype);
        }
        return {
          ...stock,
          Amount: amount
        }
      })

      const stockcolumns = [
        { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
        { Header: Literals.Columns.Stockdefine[Profile.Language], accessor: 'StockdefineID', sortable: true, canGroupBy: true, canFilter: true, Cell: col => stockdefineCellhandler(col) },
        { Header: Literals.Columns.Amount[Profile.Language], accessor: 'Amount', sortable: true, canGroupBy: true, canFilter: true },
        { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info', sortable: true, canGroupBy: true, canFilter: true },
      ]


      return <div className='p-4  shadow-gray-300 shadow-2'>
        {decoratedStocks.length > 0 ?
          <DataTable
            Columns={stockcolumns}
            Data={decoratedStocks}
          /> : null}
      </div>
    }
    , [Data, Units, Stockmovements, Stockdefines, Stocks])


  return (
    <DataTable
      Columns={Columns}
      Data={Data}
      Config={initialConfig}
      renderRowSubComponent={renderRowSubComponent}
    />
  )
}
