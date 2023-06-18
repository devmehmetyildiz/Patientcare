import { connect } from 'react-redux'
import PatientdefinesDelete from '../../Pages/Patientdefines/PatientdefinesDelete'
import { DeletePatientdefines, handleDeletemodal, handleSelectedPatientdefine } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatientdefines, handleDeletemodal, handleSelectedPatientdefine
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientdefinesDelete)