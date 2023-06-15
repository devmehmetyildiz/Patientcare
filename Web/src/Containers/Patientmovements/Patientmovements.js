import { connect } from 'react-redux'
import Patientmovements from '../../Pages/Patientmovements/Patientmovements'
import { GetPatientmovements, removePatientmovementnotification, DeletePatientmovements } from '../../Redux/Reducers/PatientmovementReducer'

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientmovements, removePatientmovementnotification, DeletePatientmovements
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientmovements)