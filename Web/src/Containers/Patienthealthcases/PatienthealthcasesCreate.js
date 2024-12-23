import { connect } from 'react-redux'
import PatienthealthcasesCreate from '../../Pages/Patienthealthcases/PatienthealthcasesCreate'
import { AddPatienthealthcases, fillPatienthealthcasenotification } from "../../Redux/PatienthealthcaseSlice"
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
    AddPatienthealthcases, fillPatienthealthcasenotification,
    GetPatientdefines, GetPatients, GetPatienthealthcasedefines
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienthealthcasesCreate)