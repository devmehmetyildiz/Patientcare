import { connect } from 'react-redux'
import WarehousesEdit from '../../Pages/Warehouses/WarehousesEdit'
import { EditWarehouses, GetWarehouse, handleSelectedWarehouse, fillWarehousenotification } from '../../Redux/WarehouseSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'

const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Stocktypegroups: state.Stocktypegroups,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditWarehouses, GetWarehouse, handleSelectedWarehouse, fillWarehousenotification, GetStocktypegroups
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesEdit)