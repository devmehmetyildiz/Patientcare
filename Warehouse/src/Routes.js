const Routes = [
  { method: 'get', path: '/Purchaseorders/:purchaseorderId', controller: 'Purchaseorder', action: 'GetPurchaseorder' },
  { method: 'get', path: '/Purchaseorders', controller: 'Purchaseorder', action: 'GetPurchaseorders' },
  { method: 'post', path: '/Purchaseorders', controller: 'Purchaseorder', action: 'AddPurchaseorder' },
  { method: 'put', path: '/Purchaseorders/Check', controller: 'Purchaseorder', action: 'CheckPurchaseorder' },
  { method: 'put', path: '/Purchaseorders/CancelCheck', controller: 'Purchaseorder', action: 'CancelCheckPurchaseorder' },
  { method: 'put', path: '/Purchaseorders/Approve', controller: 'Purchaseorder', action: 'ApprovePurchaseorder' },
  { method: 'put', path: '/Purchaseorders/CancelApprove', controller: 'Purchaseorder', action: 'CancelApprovePurchaseorder' },
  { method: 'put', path: '/Purchaseorders/Complete', controller: 'Purchaseorder', action: 'CompletePurchaseorder' },
  { method: 'put', path: '/Purchaseorders', controller: 'Purchaseorder', action: 'UpdatePurchaseorder' },
  { method: 'delete', path: '/Purchaseorders/:purchaseorderId', controller: 'Purchaseorder', action: 'DeletePurchaseorder' },

  { method: 'get', path: '/Warehouses/:warehouseId', controller: 'Warehouse', action: 'GetWarehouse' },
  { method: 'get', path: '/Warehouses', controller: 'Warehouse', action: 'GetWarehouses' },
  { method: 'post', path: '/Warehouses', controller: 'Warehouse', action: 'AddWarehouse' },
  { method: 'put', path: '/Warehouses', controller: 'Warehouse', action: 'UpdateWarehouse' },
  { method: 'delete', path: '/Warehouses/:warehouseId', controller: 'Warehouse', action: 'DeleteWarehouse' },

  { method: 'get', path: '/Stocks/GetStocksByWarehouseID/:warehouseId', controller: 'Stock', action: 'GetStocksByWarehouseID' },
  { method: 'get', path: '/Stocks/:stockId', controller: 'Stock', action: 'GetStock' },
  { method: 'get', path: '/Stocks', controller: 'Stock', action: 'GetStocks' },
  { method: 'post', path: '/Stocks/Approve/:stockId', controller: 'Stock', action: 'ApproveStock' },
  { method: 'post', path: '/Stocks/Approve', controller: 'Stock', action: 'ApproveStocks' },
  { method: 'post', path: '/Stocks/CreateStockFromStock', controller: 'Stock', action: 'CreateStockFromStock' },
  { method: 'post', path: '/Stocks/AddStockWithoutMovement', controller: 'Stock', action: 'AddStockWithoutMovement' },
  { method: 'post', path: '/Stocks', controller: 'Stock', action: 'AddStock' },
  { method: 'put', path: '/Stocks', controller: 'Stock', action: 'UpdateStock' },
  { method: 'delete', path: '/Stocks/DeleteStockByWarehouseID/:warehouseId', controller: 'Stock', action: 'DeleteStockByWarehouseID' },
  { method: 'delete', path: '/Stocks/:stockId', controller: 'Stock', action: 'DeleteStock' },

  { method: 'get', path: '/Stockmovements/:stockmovementId', controller: 'Stockmovement', action: 'GetStockmovement' },
  { method: 'get', path: '/Stockmovements', controller: 'Stockmovement', action: 'GetStockmovements' },
  { method: 'post', path: '/Stockmovements/Approve/:stockmovementId', controller: 'Stockmovement', action: 'ApproveStockmovement' },
  { method: 'post', path: '/Stockmovements/Approve', controller: 'Stockmovement', action: 'ApproveStockmovements' },
  { method: 'post', path: '/Stockmovements/InsertList', controller: 'Stockmovement', action: 'AddStockmovements' },
  { method: 'post', path: '/Stockmovements', controller: 'Stockmovement', action: 'AddStockmovement' },
  { method: 'put', path: '/Stockmovements', controller: 'Stockmovement', action: 'UpdateStockmovement' },
  { method: 'delete', path: '/Stockmovements/:stockmovementId', controller: 'Stockmovement', action: 'DeleteStockmovement' },

  { method: 'get', path: '/Stockdefines/:stockdefineId', controller: 'Stockdefine', action: 'GetStockdefine' },
  { method: 'get', path: '/Stockdefines', controller: 'Stockdefine', action: 'GetStockdefines' },
  { method: 'post', path: '/Stockdefines', controller: 'Stockdefine', action: 'AddStockdefine' },
  { method: 'put', path: '/Stockdefines', controller: 'Stockdefine', action: 'UpdateStockdefine' },
  { method: 'delete', path: '/Stockdefines/:stockdefineId', controller: 'Stockdefine', action: 'DeleteStockdefine' },

  { method: 'get', path: '/Stocktypes/:stocktypeId', controller: 'Stocktype', action: 'GetStocktype' },
  { method: 'get', path: '/Stocktypes', controller: 'Stocktype', action: 'GetStocktypes' },
  { method: 'post', path: '/Stocktypes', controller: 'Stocktype', action: 'AddStocktype' },
  { method: 'put', path: '/Stocktypes', controller: 'Stocktype', action: 'UpdateStocktype' },
  { method: 'delete', path: '/Stocktypes/:stocktypeId', controller: 'Stocktype', action: 'DeleteStocktype' },

  { method: 'get', path: '/Stocktypegroups/:stocktypegroupId', controller: 'Stocktypegroup', action: 'GetStocktypegroup' },
  { method: 'get', path: '/Stocktypegroups', controller: 'Stocktypegroup', action: 'GetStocktypegroups' },
  { method: 'post', path: '/Stocktypegroups', controller: 'Stocktypegroup', action: 'AddStocktypegroup' },
  { method: 'put', path: '/Stocktypegroups', controller: 'Stocktypegroup', action: 'UpdateStocktypegroup' },
  { method: 'delete', path: '/Stocktypegroups/:stocktypegroupId', controller: 'Stocktypegroup', action: 'DeleteStocktypegroup' },

  { method: 'get', path: '/Equipmentgroups/:equipmentgroupId', controller: 'Equipmentgroup', action: 'GetEquipmentgroup' },
  { method: 'get', path: '/Equipmentgroups', controller: 'Equipmentgroup', action: 'GetEquipmentgroups' },
  { method: 'post', path: '/Equipmentgroups', controller: 'Equipmentgroup', action: 'AddEquipmentgroup' },
  { method: 'put', path: '/Equipmentgroups', controller: 'Equipmentgroup', action: 'UpdateEquipmentgroup' },
  { method: 'delete', path: '/Equipmentgroups/:equipmentgroupId', controller: 'Equipmentgroup', action: 'DeleteEquipmentgroup' },

  { method: 'get', path: '/Equipments/:equipmentId', controller: 'Equipment', action: 'GetEquipment' },
  { method: 'get', path: '/Equipments', controller: 'Equipment', action: 'GetEquipments' },
  { method: 'post', path: '/Equipments', controller: 'Equipment', action: 'AddEquipment' },
  { method: 'put', path: '/Equipments', controller: 'Equipment', action: 'UpdateEquipment' },
  { method: 'delete', path: '/Equipments/:equipmentId', controller: 'Equipment', action: 'DeleteEquipment' },

  { method: 'get', path: '/Breakdowns/:breakdownId', controller: 'Breakdown', action: 'GetBreakdown' },
  { method: 'get', path: '/Breakdowns', controller: 'Breakdown', action: 'GetBreakdowns' },
  { method: 'post', path: '/Breakdowns', controller: 'Breakdown', action: 'AddBreakdown' },
  { method: 'put', path: '/Breakdowns/Complete', controller: 'Breakdown', action: 'CompleteBreakdown' },
  { method: 'put', path: '/Breakdowns', controller: 'Breakdown', action: 'UpdateBreakdown' },
  { method: 'delete', path: '/Breakdowns/:breakdownId', controller: 'Breakdown', action: 'DeleteBreakdown' },

  { method: 'get', path: '/Mainteancies/:mainteanceId', controller: 'Mainteance', action: 'GetMainteance' },
  { method: 'get', path: '/Mainteancies', controller: 'Mainteance', action: 'GetMainteancies' },
  { method: 'post', path: '/Mainteancies', controller: 'Mainteance', action: 'AddMainteance' },
  { method: 'put', path: '/Mainteancies/Complete', controller: 'Mainteance', action: 'CompleteMainteance' },
  { method: 'put', path: '/Mainteancies', controller: 'Mainteance', action: 'UpdateMainteance' },
  { method: 'delete', path: '/Mainteancies/:mainteanceId', controller: 'Mainteance', action: 'DeleteMainteance' },

]

module.exports = Routes