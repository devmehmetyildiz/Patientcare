import { connect } from 'react-redux'
import UnapprovedMovements from '../../Pages/Unapproveds/UnapprovedMovements'
import { GetPatientstockmovements, ApprovemultiplePatientstockmovements, ApprovePatientstockmovements } from '../../Redux/PatientstockmovementSlice'
import { GetPatientstocks } from '../../Redux/PatientstockSlice'
import { GetStockmovements, ApprovemultipleStockmovements, fillStockmovementnotification, ApproveStockmovements } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetPurchaseorderstockmovements, ApprovemultiplePurchaseorderstockmovements, ApprovePurchaseorderstockmovements } from '../../Redux/PurchaseorderstockmovementSlice'
import { GetPurchaseorderstocks } from '../../Redux/PurchaseorderstockSlice'
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetUnits } from '../../Redux/UnitSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Patientstockmovements: state.Patientstockmovements,
    Patientstocks: state.Patientstocks,
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Purchaseorderstockmovements: state.Purchaseorderstockmovements,
    Purchaseorderstocks: state.Purchaseorderstocks,
    Stockdefines: state.Stockdefines,
    Units: state.Units,
})

const mapDispatchToProps = {
    GetPatientstockmovements, ApprovemultiplePatientstockmovements, GetPatientstocks, ApproveStockmovements,
    GetStockmovements, ApprovemultipleStockmovements, GetStocks, ApprovePatientstockmovements,
    GetPurchaseorderstockmovements, ApprovemultiplePurchaseorderstockmovements, ApprovePurchaseorderstockmovements,
    GetPurchaseorderstocks, GetStockdefines, GetUnits, fillStockmovementnotification
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedMovements)