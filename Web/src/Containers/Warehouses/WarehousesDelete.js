import { connect } from 'react-redux'
import WarehousesDelete from '../../Pages/Warehouses/WarehousesDelete'
import { DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse } from '../../Redux/WarehouseSlice'


const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesDelete)