import { connect } from 'react-redux'
import StockmovementsApprove from '../../Pages/Stockmovements/StockmovementsApprove'
import { ApproveStockmovements, handleApprovemodal, handleSelectedStockmovement } from '../../Redux/StockmovementSlice'

const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveStockmovements, handleApprovemodal, handleSelectedStockmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsApprove)