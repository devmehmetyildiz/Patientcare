import { connect } from 'react-redux'
import PreregistrationsDelete from "../../Pages/Preregistrations/PreregistrationsDelete"
import { DeletePreregisrations, handleDeletemodal, handleSelectedPatient } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    DeletePreregisrations, handleDeletemodal, handleSelectedPatient
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsDelete)