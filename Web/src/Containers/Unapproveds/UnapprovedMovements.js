import { connect } from 'react-redux'
import UnapprovedMovements from '../../Pages/Unapproveds/UnapprovedMovements'
import { GetPatientstockmovements, ApprovemultiplePatientstockmovements } from '../../Redux/PatientstockmovementSlice'
import { GetPatientstocks } from '../../Redux/PatientstockSlice'
import { GetStockmovements, ApprovemultipleStockmovements, fillStockmovementnotification } from '../../Redux/StockmovementSlice'
import { GetStocks } from '../../Redux/StockSlice'
import { GetPurchaseorderstockmovements, ApprovemultiplePurchaseorderstockmovements } from '../../Redux/PurchaseorderstockmovementSlice'
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
    GetPatientstockmovements, ApprovemultiplePatientstockmovements, GetPatientstocks,
    GetStockmovements, ApprovemultipleStockmovements, GetStocks,
    GetPurchaseorderstockmovements, ApprovemultiplePurchaseorderstockmovements,
    GetPurchaseorderstocks, GetStockdefines, GetUnits, fillStockmovementnotification
}


export default connect(mapStateToProps, mapDispatchToProps)(UnapprovedMovements)