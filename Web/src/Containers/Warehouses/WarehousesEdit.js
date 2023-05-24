import { connect } from 'react-redux'
import WarehousesEdit from '../../Pages/Warehouses/WarehousesEdit'
import { EditWarehouses, GetWarehouse, RemoveSelectedWarehouse, removeWarehousenotification, fillWarehousenotification } from '../../Redux/Actions/WarehouseAction'

const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses
})

const mapDispatchToProps = {
    EditWarehouses, GetWarehouse, RemoveSelectedWarehouse, removeWarehousenotification, fillWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesEdit)