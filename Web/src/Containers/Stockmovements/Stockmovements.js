import { connect } from 'react-redux'
import Stockmovements from '../../Pages/Stockmovements/Stockmovements'
import {
    GetStockmovements, removeStockmovementnotification,
    fillStockmovementnotification, DeleteStockmovements
} from '../../Redux/StockmovementSlice'


const mapStateToProps = (state) => ({
    Stockmovements: state.Stockmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetStockmovements, removeStockmovementnotification, fillStockmovementnotification, DeleteStockmovements,
}

export default connect(mapStateToProps, mapDispatchToProps)(Stockmovements)