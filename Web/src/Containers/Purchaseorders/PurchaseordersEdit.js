import { connect } from 'react-redux'
import PurchaseordersEdit from '../../Pages/Purchaseorders/PurchaseordersEdit'
import { EditPurchaseorders, GetPurchaseorder, handleSelectedPurchaseorder, fillPurchaseordernotification } from '../../Redux/PurchaseorderSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetFiles } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Stocktypes: state.Stocktypes,
    Files: state.Files,
    Stocks: state.Stocks,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPurchaseorders, GetPurchaseorder, handleSelectedPurchaseorder, fillPurchaseordernotification, GetFiles, GetStocks
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordersEdit)