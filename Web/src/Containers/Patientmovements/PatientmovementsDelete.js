import { connect } from 'react-redux'
import PatientmovementsDelete from '../../Pages/Patientmovements/PatientmovementsDelete'
import { DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement } from '../../Redux/PatientmovementSlice'

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmovementsDelete)