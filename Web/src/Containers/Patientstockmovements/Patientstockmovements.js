import { connect } from 'react-redux'
import Patientstockmovements from '../../Pages/Patientstockmovements/Patientstockmovements'
import {
    GetPatientstockmovements, removePatientstockmovementnotification, fillPatientstockmovementnotification, handleApprovemodal,
    handleDeletemodal, handleSelectedPatientstockmovement, DeletePatientstockmovements, 
} from '../../Redux/PatientstockmovementSlice'
import { GetUnits, removeUnitnotification } from '../../Redux/UnitSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'
import { GetPatientstocks, removePatientstocknotification } from '../../Redux/PatientstockSlice'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Profile: state.Profile,
    Patientstocks: state.Patientstocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units
})

const mapDispatchToProps = {
    GetPatientstockmovements, removePatientstockmovementnotification, fillPatientstockmovementnotification,
    handleDeletemodal, handleSelectedPatientstockmovement, DeletePatientstockmovements, 
    GetUnits, removeUnitnotification,
    GetStockdefines, removeStockdefinenotification,
    GetPatientstocks, removePatientstocknotification, handleApprovemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientstockmovements)