import { connect } from 'react-redux'
import UnapprovedMovements from '../../Pages/Unapproveds/UnapprovedMovements'
import { GetPatientstockmovements, removePatientstockmovementnotification, ApprovePatientstockmovements } from '../../Redux/PatientstockmovementSlice'
import { GetPatientstocks, removePatientstocknotification } from '../../Redux/PatientstockSlice'
import { GetStockmovements, removeStockmovementnotification, ApproveStockmovements } from '../../Redux/StockmovementSlice'
import { GetStocks, removeStocknotification } from '../../Redux/StockSlice'
import { GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification, ApprovePurchaseorderstockmovements } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetPurchaseorderstocks, removePurchaseorderstocknotification } from '../../Redux/PurchaseorderstockSlice'
import { GetStockdefines, removeStockdefinenotification } from '../../Redux/StockdefineSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Stockdefines: state.Stockdefines,
})

const mapDispatchToProps = {
    GetPatientstockmovements, removePatientstockmovementnotification, ApprovePatientstockmovements, GetPatientstocks, removePatientstocknotification,
    GetStockmovements, removeStockmovementnotification, ApproveStockmovements, GetStocks, removeStocknotification,
    GetPurchaseorderstockmovements, removePurchaseorderstockmovementnotification, ApprovePurchaseorderstockmovements,
    GetPurchaseorderstocks, removePurchaseorderstocknotification, GetStockdefines, removeStockdefinenotification
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedMovements)