import { connect } from 'react-redux'
import Purchaseorders from "../../Pages/Purchaseorders/Purchaseorders"
import {
    GetPurchaseorders, handleSelectedPurchaseorder, handleDeletemodal, handleApprovemodal,
    handleCheckmodal, handleCompletemodal, handleDetailmodal
} from '../../Redux/PurchaseorderSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorders, handleSelectedPurchaseorder, handleDeletemodal, GetUsers, handleApprovemodal,
    handleCheckmodal, handleCompletemodal, handleDetailmodal
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorders)