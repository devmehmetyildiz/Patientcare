import { connect } from 'react-redux'
import WarehousesCreate from '../../Pages/Warehouses/WarehousesCreate'
import { AddWarehouses, removeWarehousenotification, fillWarehousenotification } from '../../Redux/Actions/WarehouseAction'


const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses
})

const mapDispatchToProps = {
    AddWarehouses, removeWarehousenotification, fillWarehousenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesCreate)