import { connect } from 'react-redux'
import Purchaseorders from "../../Pages/Purchaseorders/Purchaseorders"
import { GetPurchaseorders, } from '../../Redux/PurchaseorderSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPurchaseorders, GetUsers,
}

export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorders)