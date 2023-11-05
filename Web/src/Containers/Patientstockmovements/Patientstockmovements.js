import { connect } from 'react-redux'
import Patientstockmovements from '../../Pages/Patientstockmovements/Patientstockmovements'
import {
    GetPatientstockmovements,  fillPatientstockmovementnotification, handleApprovemodal,
    handleDeletemodal, handleSelectedPatientstockmovement, DeletePatientstockmovements, 
} from '../../Redux/PatientstockmovementSlice'
import { GetUnits } from '../../Redux/UnitSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetPatientstocks } from '../../Redux/PatientstockSlice'

const mapStateToProps = (state) => ({
    Patientstockmovements: state.Patientstockmovements,
    Profile: state.Profile,
    Patientstocks: state.Patientstocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units
})

const mapDispatchToProps = {
    GetPatientstockmovements,  fillPatientstockmovementnotification,
    handleDeletemodal, handleSelectedPatientstockmovement, DeletePatientstockmovements, 
    GetUnits, 
    GetStockdefines,
    GetPatientstocks, handleApprovemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientstockmovements)