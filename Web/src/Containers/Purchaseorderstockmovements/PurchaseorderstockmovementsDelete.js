import { connect } from 'react-redux'
import PurchaseorderstockmovementsDelete from '../../Pages/Purchaseorderstockmovements/PurchaseorderstockmovementsDelete'
import { DeletePurchaseorderstockmovements, handleDeletemodal, handleSelectedPurchaseorderstockmovement } from '../../Redux/PurchaseorderstockmovementSlice'


const mapStateToProps = (state) => ({
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePurchaseorderstockmovements, handleDeletemodal, handleSelectedPurchaseorderstockmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseorderstockmovementsDelete)