import { connect } from 'react-redux'
import Stockmovements from '../../Pages/Stockmovements/Stockmovements'
import {
    GetStockmovements, removeStockmovementnotification,
    fillStockmovementnotification, DeleteStockmovements, handleDeletemodal, handleSelectedStockmovement
} from '../../Redux/StockmovementSlice'


const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStockmovements, removeStockmovementnotification, fillStockmovementnotification, DeleteStockmovements,
    handleDeletemodal, handleSelectedStockmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockmovements)