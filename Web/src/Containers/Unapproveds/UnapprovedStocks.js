import { connect } from 'react-redux'
import UnapprovedStocks from '../../Pages/Unapproveds/UnapprovedStocks'
import { GetPatientstocks, removePatientstocknotification, ApprovePatientstocks } from '../../Redux/PatientstockSlice'
import { GetStockmovements, removeStockmovementnotification } from '../../Redux/StockmovementSlice'
import { GetStocks, removeStocknotification, ApproveStocks } from '../../Redux/StockSlice'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification, ApprovePurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Patientstocks: state.Patientstocks,
    Stocks: state.Stocks,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Stockdefines: state.Stockdefines,
})

const mapDispatchToProps = {
    GetPatientstocks, removePatientstocknotification, ApprovePatientstocks, GetStockmovements, removeStockmovementnotification,
    GetStocks, removeStocknotification, ApproveStocks, GetPurchaseorderstocks, removePurchaseorderstocknotification, ApprovePurchaseorderstocks,
    GetStockdefines, removeStockdefinenotification
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedStocks)