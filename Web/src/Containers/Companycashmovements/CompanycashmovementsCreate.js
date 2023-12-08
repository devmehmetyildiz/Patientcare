import { connect } from 'react-redux'
import CompanycashmovementsCreate from '../../Pages/Companycashmovements/CompanycashmovementsCreate'
import { AddCompanycashmovements,fillCompanycashmovementnotification } from '../../Redux/CompanycashmovementSlice'

const mapStateToProps = (state) => ({
  Companycashmovements: state.Companycashmovements,
  Profile: state.Profile
})

const mapDispatchToProps = { AddCompanycashmovements,fillCompanycashmovementnotification }

export default connect(mapStateToProps, mapDispatchToProps)(CompanycashmovementsCreate)