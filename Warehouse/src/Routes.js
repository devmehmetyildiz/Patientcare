const Routes = [
  { method: 'get', path: '/Warehouses/:warehouseId', controller: 'Warehouse', action: 'GetWarehouse' },
  { method: 'get', path: '/Warehouses', controller: 'Warehouse', action: 'GetWarehouses' },
  { method: 'post', path: '/Warehouses', controller: 'Warehouse', action: 'AddWarehouse' },
  { method: 'put', path: '/Warehouses', controller: 'Warehouse', action: 'UpdateWarehouse' },
  { method: 'delete', path: '/Warehouses/:warehouseId', controller: 'Warehouse', action: 'DeleteWarehouse' },

  { method: 'get', path: '/Stocks/:stockId', controller: 'Stock', action: 'GetStock' },
  { method: 'get', path: '/Stocks', controller: 'Stock', action: 'GetStocks' },
  { method: 'post', path: '/Stocks/TransferfromPatient', controller: 'Stock', action: 'TransferfromPatient' },
  { method: 'post', path: '/Stocks/TransfertoPatient', controller: 'Stock', action: 'TransfertoPatient' },
  { method: 'post', path: '/Stocks/Approve/:stockId', controller: 'Stock', action: 'ApproveStock' },
  { method: 'post', path: '/Stocks', controller: 'Stock', action: 'AddStock' },
  { method: 'put', path: '/Stocks', controller: 'Stock', action: 'UpdateStock' },
  { method: 'delete', path: '/Stocks/:stockId', controller: 'Stock', action: 'DeleteStock' },

  { method: 'get', path: '/Stockmovements/:stockmovementId', controller: 'Stockmovement', action: 'GetStockmovement' },
  { method: 'get', path: '/Stockmovements', controller: 'Stockmovement', action: 'GetStockmovements' },
  { method: 'post', path: '/Stockmovements/Approve/:stockmovementId', controller: 'Stockmovement', action: 'ApproveStockmovement' },
  { method: 'post', path: '/Stockmovements', controller: 'Stockmovement', action: 'AddStockmovement' },
  { method: 'put', path: '/Stockmovements', controller: 'Stockmovement', action: 'UpdateStockmovement' },
  { method: 'delete', path: '/Stockmovements/:stockmovementId', controller: 'Stockmovement', action: 'DeleteStockmovement' },

  { method: 'get', path: '/Purchaseorders/:purchaseorderId', controller: 'Purchaseorder', action: 'GetPurchaseorder' },
  { method: 'get', path: '/Purchaseorders', controller: 'Purchaseorder', action: 'GetPurchaseorders' },
  { method: 'post', path: '/Purchaseorders', controller: 'Purchaseorder', action: 'AddPurchaseorder' },
  { method: 'put', path: '/Purchaseorders/Complete', controller: 'Purchaseorder', action: 'CompletePurchaseorder' },
  { method: 'put', path: '/Purchaseorders/Deactive', controller: 'Purchaseorder', action: 'DeactivePurchaseorder' },
  { method: 'put', path: '/Purchaseorders', controller: 'Purchaseorder', action: 'UpdatePurchaseorder' },
  { method: 'delete', path: '/Purchaseorders/:purchaseorderId', controller: 'Purchaseorder', action: 'DeletePurchaseorder' },

  { method: 'get', path: '/Purchaseorderstocks/:stockId', controller: 'Purchaseorderstock', action: 'GetPurchaseorderstock' },
  { method: 'get', path: '/Purchaseorderstocks', controller: 'Purchaseorderstock', action: 'GetPurchaseorderstocks' },
  { method: 'post', path: '/Purchaseorderstocks', controller: 'Purchaseorderstock', action: 'AddPurchaseorderstock' },
  { method: 'put', path: '/Purchaseorderstocks', controller: 'Purchaseorderstock', action: 'UpdatePurchaseorderstock' },
  { method: 'delete', path: '/Purchaseorderstocks/:stockId', controller: 'Purchaseorderstock', action: 'DeletePurchaseorderstock' },

  { method: 'get', path: '/Purchaseorderstockmovements/:stockmovementId', controller: 'Purchaseorderstockmovement', action: 'GetPurchaseorderstockmovement' },
  { method: 'get', path: '/Purchaseorderstockmovements', controller: 'Purchaseorderstockmovement', action: 'GetPurchaseorderstockmovements' },
  { method: 'post', path: '/Purchaseorderstockmovements', controller: 'Purchaseorderstockmovement', action: 'AddPurchaseorderstockmovement' },
  { method: 'put', path: '/Purchaseorderstockmovements', controller: 'Purchaseorderstockmovement', action: 'UpdatePurchaseorderstockmovement' },
  { method: 'delete', path: '/Purchaseorderstockmovements/:stockmovementId', controller: 'Purchaseorderstockmovement', action: 'DeletePurchaseorderstockmovement' },

  { method: 'get', path: '/Patientstocks/:stockId', controller: 'Patientstock', action: 'GetPatientstock' },
  { method: 'get', path: '/Patientstocks', controller: 'Patientstock', action: 'GetPatientstocks' },
  { method: 'post', path: '/Patientstocks/Approve/:stockId', controller: 'Patientstock', action: 'ApprovePatientstock' },
  { method: 'post', path: '/Patientstocks', controller: 'Patientstock', action: 'AddPatientstock' },
  { method: 'put', path: '/Patientstocks/Transferpatientstock', controller: 'Patientstock', action: 'Transferpatientstock' },
  { method: 'put', path: '/Patientstocks/UpdatePatientstocklist', controller: 'Patientstock', action: 'UpdatePatientstocklist' },
  { method: 'put', path: '/Patientstocks', controller: 'Patientstock', action: 'UpdatePatientstock' },
  { method: 'delete', path: '/Patientstocks/:stockId', controller: 'Patientstock', action: 'DeletePatientstock' },

  { method: 'get', path: '/Patientstockmovements/:stockmovementId', controller: 'Patientstockmovement', action: 'GetPatientstockmovement' },
  { method: 'get', path: '/Patientstockmovements', controller: 'Patientstockmovement', action: 'GetPatientstockmovements' },
  { method: 'post', path: '/Patientstockmovements/Approve/:stockmovementId', controller: 'Patientstockmovement', action: 'ApprovePatientstockmovement' },
  { method: 'post', path: '/Patientstockmovements', controller: 'Patientstockmovement', action: 'AddPatientstockmovement' },
  { method: 'put', path: '/Patientstockmovements', controller: 'Patientstockmovement', action: 'UpdatePatientstockmovement' },
  { method: 'delete', path: '/Patientstockmovements/:stockmovementId', controller: 'Patientstockmovement', action: 'DeletePatientstockmovement' },

  { method: 'get', path: '/Stockdefines/:stockdefineId', controller: 'Stockdefine', action: 'GetStockdefine' },
  { method: 'get', path: '/Stockdefines', controller: 'Stockdefine', action: 'GetStockdefines' },
  { method: 'post', path: '/Stockdefines', controller: 'Stockdefine', action: 'AddStockdefine' },
  { method: 'put', path: '/Stockdefines', controller: 'Stockdefine', action: 'UpdateStockdefine' },
  { method: 'delete', path: '/Stockdefines/:stockdefineId', controller: 'Stockdefine', action: 'DeleteStockdefine' },



]

module.exports = Routes