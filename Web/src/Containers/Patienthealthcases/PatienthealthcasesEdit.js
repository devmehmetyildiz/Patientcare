import { connect } from 'react-redux'
import PatienthealthcasesEdit from '../../Pages/Patienthealthcases/PatienthealthcasesEdit'
import { EditPatienthealthcases, GetPatienthealthcase, fillPatienthealthcasenotification } from "../../Redux/PatienthealthcaseSlice"
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatienthealthcasedefines } from '../../Redux/PatienthealthcasedefineSlice'

const mapStateToProps = (state) => ({
    Patienthealthcases: state.Patienthealthcases,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienthealthcasedefines: state.Patienthealthcasedefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditPatienthealthcases, GetPatienthealthcase, fillPatienthealthcasenotification,
    GetPatients, GetPatientdefines, GetPatienthealthcasedefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienthealthcasesEdit)