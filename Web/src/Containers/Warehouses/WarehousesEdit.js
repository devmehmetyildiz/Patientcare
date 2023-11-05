import { connect } from 'react-redux'
import WarehousesEdit from '../../Pages/Warehouses/WarehousesEdit'
import { EditWarehouses, GetWarehouse, handleSelectedWarehouse,  fillWarehousenotification } from '../../Redux/WarehouseSlice'

const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditWarehouses, GetWarehouse, handleSelectedWarehouse,  fillWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesEdit)