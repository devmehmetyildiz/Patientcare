import { connect } from 'react-redux'
import WarehousesCreate from '../../Pages/Warehouses/WarehousesCreate'
import { AddWarehouses,  fillWarehousenotification } from '../../Redux/WarehouseSlice'


const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddWarehouses, fillWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesCreate)