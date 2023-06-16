import { connect } from 'react-redux'
import WarehousesEdit from '../../Pages/Warehouses/WarehousesEdit'
import { EditWarehouses, GetWarehouse, RemoveSelectedWarehouse, removeWarehousenotification, fillWarehousenotification } from '../../Redux/WarehouseSlice'

const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditWarehouses, GetWarehouse, RemoveSelectedWarehouse, removeWarehousenotification, fillWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesEdit)