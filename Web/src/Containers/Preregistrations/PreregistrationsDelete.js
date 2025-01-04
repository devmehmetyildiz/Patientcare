import { connect } from 'react-redux'
import PreregistrationsDelete from "../../Pages/Preregistrations/PreregistrationsDelete"
import { DeletePreregisrations, } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    DeletePreregisrations,
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsDelete)