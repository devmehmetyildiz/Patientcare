const Routes = [
    { method: 'get', path: '/Warehouses', controller: 'Warehouse', action: 'GetWarehouses' },
    { method: 'get', path: '/Warehouses/:warehouseId', controller: 'Warehouse', action: 'GetWarehouse' },
    { method: 'post', path: '/Warehouses', controller: 'Warehouse', action: 'AddWarehouse' },
    { method: 'put', path: '/Warehouses', controller: 'Warehouse', action: 'UpdateWarehouse' },
    { method: 'delete', path: '/Warehouses', controller: 'Warehouse', action: 'DeleteWarehouse' },

    
  ]
  
  module.exports = Routes