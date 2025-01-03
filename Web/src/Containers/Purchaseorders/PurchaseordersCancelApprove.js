import { connect } from 'react-redux'
import PurchaseordersCancelApprove from "../../Pages/Purchaseorders/PurchaseordersCancelApprove"
import { fillPurchaseordernotification, CancelApprovePurchaseorders } from "../../Redux/PurchaseorderSlice"
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetCases } from '../../Redux/CaseSlice'

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Departments: state.Departments,
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillPurchaseordernotification, CancelApprovePurchaseorders, GetDepartments, GetCases
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersCancelApprove)