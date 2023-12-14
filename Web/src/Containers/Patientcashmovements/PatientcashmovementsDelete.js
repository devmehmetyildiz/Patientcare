import { connect } from 'react-redux'
import PatientcashmovementsDelete from '../../Pages/Patientcashmovements/PatientcashmovementsDelete'
import { DeletePatientcashmovements, handleDeletemodal, handleSelectedPatientcashmovement } from '../../Redux/PatientcashmovementSlice'


const mapStateToProps = (state) => ({
    Patientcashmovements: state.Patientcashmovements,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientcashmovements, handleDeletemodal, handleSelectedPatientcashmovement
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientcashmovementsDelete)