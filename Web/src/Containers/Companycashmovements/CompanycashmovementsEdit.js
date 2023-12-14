import { connect } from 'react-redux'
import CompanycashmovementsEdit from '../../Pages/Companycashmovements/CompanycashmovementsEdit'
import { EditCompanycashmovements, GetCompanycashmovement, fillCompanycashmovementnotification } from '../../Redux/CompanycashmovementSlice'

const mapStateToProps = (state) => ({
  Companycashmovements: state.Companycashmovements,
  Profile: state.Profile
})

const mapDispatchToProps = {
  EditCompanycashmovements, GetCompanycashmovement, fillCompanycashmovementnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanycashmovementsEdit)