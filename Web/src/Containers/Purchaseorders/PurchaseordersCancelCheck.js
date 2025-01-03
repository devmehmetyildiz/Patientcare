import { connect } from 'react-redux'
import PurchaseordersCancelCheck from "../../Pages/Purchaseorders/PurchaseordersCancelCheck"
import { fillPurchaseordernotification, CancelCheckPurchaseorders } from "../../Redux/PurchaseorderSlice"
import { GetDepartments } from '../../Redux/DepartmentSlice'
import { GetCases } from '../../Redux/CaseSlice'

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Departments: state.Departments,
    Cases: state.Cases,
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillPurchaseordernotification, CancelCheckPurchaseorders, GetDepartments, GetCases
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersCancelCheck)