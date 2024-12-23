import { connect } from 'react-redux'
import PatienthealthcasesDelete from "../../Pages/Patienthealthcases/PatienthealthcasesDelete"
import { DeletePatienthealthcases,GetPatienthealthcases } from "../../Redux/PatienthealthcaseSlice"

const mapStateToProps = (state) => ({
    Patienthealthcases: state.Patienthealthcases,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienthealthcasedefines: state.Patienthealthcasedefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatienthealthcases,GetPatienthealthcases
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienthealthcasesDelete)