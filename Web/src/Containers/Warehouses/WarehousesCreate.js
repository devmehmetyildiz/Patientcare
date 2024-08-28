import { connect } from 'react-redux'
import WarehousesCreate from '../../Pages/Warehouses/WarehousesCreate'
import { AddWarehouses, fillWarehousenotification } from '../../Redux/WarehouseSlice'
import { GetStocktypegroups } from '../../Redux/StocktypegroupSlice'


const mapStateToProps = (state) => ({
    Warehouses: state.Warehouses,
    Stocktypegroups: state.Stocktypegroups,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddWarehouses, fillWarehousenotification, GetStocktypegroups
}

export default connect(mapStateToProps, mapDispatchToProps)(WarehousesCreate)