import { connect } from 'react-redux'
import Companycashmovements from '../../Pages/Companycashmovements/Companycashmovements'
import { GetCompanycashmovements, handleDeletemodal, handleSelectedCompanycashmovement } from '../../Redux/CompanycashmovementSlice'

const mapStateToProps = (state) => ({
  Companycashmovements: state.Companycashmovements,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetCompanycashmovements, handleDeletemodal, handleSelectedCompanycashmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(Companycashmovements)