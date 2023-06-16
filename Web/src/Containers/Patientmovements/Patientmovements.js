import { connect } from 'react-redux'
import Patientmovements from '../../Pages/Patientmovements/Patientmovements'
import { GetPatientmovements, removePatientmovementnotification, DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement } from '../../Redux/PatientmovementSlice'

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientmovements, removePatientmovementnotification, DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientmovements)