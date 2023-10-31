import { connect } from 'react-redux'
import UnapprovedPatientstocks from '../../Pages/Unapproveds/UnapprovedPatientstocks'
import {
    GetPatientstocks, removePatientstocknotification, fillPatientstocknotification, ApprovePatientstocks,
    handleApprovemodal as handlePatientstockApprovemodal, handleSelectedPatientstock
} from '../../Redux/PatientstockSlice'
import {
    GetPatientstockmovements, removePatientstockmovementnotification, fillPatientstockmovementnotification, ApprovePatientstockmovements,
    handleApprovemodal as handlePatientstockmovementApprovemodal, handleSelectedPatientstockmovement
} from '../../Redux/PatientstockmovementSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'

const mapStateToProps = (state) => ({
    Patientstocks: state.Patientstocks,
    Patientstockmovements: state.Patientstockmovements,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientstocks, removePatientstocknotification, fillPatientstocknotification, ApprovePatientstocks,
    handlePatientstockApprovemodal, handleSelectedPatientstock, GetPatientstockmovements, removePatientstockmovementnotification,
    fillPatientstockmovementnotification, ApprovePatientstockmovements,
    handlePatientstockmovementApprovemodal, handleSelectedPatientstockmovement, GetStockdefines, removeStockdefinenotification
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedPatientstocks)