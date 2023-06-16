import { connect } from 'react-redux'
import Warehouses from '../../Pages/Warehouses/Warehouses'
import { GetWarehouses, removeWarehousenotification, fillWarehousenotification, DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse } from '../../Redux/WarehouseSlice'


const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetWarehouses, removeWarehousenotification, fillWarehousenotification, DeleteWarehouses, handleDeletemodal, handleSelectedWarehouse
}

export default connect(mapStateToProps, mapDispatchToProps)(Warehouses)