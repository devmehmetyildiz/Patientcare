import { connect } from 'react-redux'
import PurchaseordersCreate from '../../Pages/Purchaseorders/PurchaseordersCreate'
import { AddPurchaseorders, fillPurchaseordernotification } from '../../Redux/PurchaseorderSlice'


const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Stocktypes: state.Stocktypes,
    Profile: state.Profile
})

const mapDispatchToProps = { AddPurchaseorders, fillPurchaseordernotification }

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersCreate)