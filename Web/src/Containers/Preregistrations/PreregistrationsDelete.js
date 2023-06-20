import { connect } from 'react-redux'
import PreregistrationsDelete from "../../Pages/Preregistrations/PreregistrationsDelete"
import { DeletePatients, handleDeletemodal, handleSelectedPatient } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    DeletePatients, handleDeletemodal, handleSelectedPatient
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsDelete)