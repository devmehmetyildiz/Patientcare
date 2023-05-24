import { connect } from 'react-redux'
import Stockmovements from "../../Pages/Stocks/Stockmovements"
import { GetStockmovements, fillStockmovementnotification, removeStockmovementnotification,DeleteStockmovements } from '../../Redux/Actions/StockmovementAction'

const mapStateToProps = (state) => ({
  Stockmovements: state.Stockmovements,
  Profile: state.Profile
})

const mapDispatchToProps = { GetStockmovements, fillStockmovementnotification, removeStockmovementnotification,DeleteStockmovements }

export default connect(mapStateToProps, mapDispatchToProps)(Stockmovements)