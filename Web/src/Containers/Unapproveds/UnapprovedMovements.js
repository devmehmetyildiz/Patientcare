import { connect } from 'react-redux'
import UnapprovedMovements from '../../Pages/Unapproveds/UnapprovedMovements'
import { GetPatientstockmovements, ApprovePatientstockmovements } from '../../Redux/PatientstockmovementSlice'
import { GetPatientstocks } from '../../Redux/PatientstockSlice'
import { GetStockmovements, ApproveStockmovements } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetPurchaseorderstockmovements, ApprovePurchaseorderstockmovements } from '../../Redux/PurchaseorderstockmovementSlice'
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
    GetPatientstockmovements, ApprovePatientstockmovements, GetPatientstocks,
    GetStockmovements, ApproveStockmovements, GetStocks,
    GetPurchaseorderstockmovements, ApprovePurchaseorderstockmovements,
    GetPurchaseorderstocks, GetStockdefines, GetUnits
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedMovements)