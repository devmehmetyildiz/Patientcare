import { connect } from 'react-redux'
import StockmovementsApprove from '../../Pages/Stockmovements/StockmovementsApprove'
import { ApproveStockmovements, } from '../../Redux/StockmovementSlice'

const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Stocks: state.Stocks,
    Stockdefines: state.Stockdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveStockmovements,
}

export default connect(mapStateToProps, mapDispatchToProps)(StockmovementsApprove)