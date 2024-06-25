import { connect } from 'react-redux'
import PurchaseorderPrepareStepThree from "../../Pages/Purchaseorders/PurchaseorderPrepareStepThree"
import { fillPurchaseordernotification } from '../../Redux/PurchaseorderSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillPurchaseordernotification, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderPrepareStepThree)