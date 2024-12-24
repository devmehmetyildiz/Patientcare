import { connect } from 'react-redux'
import Overviewhealthcarecards from '../../Pages/Overviewhealthcarecards/Overviewhealthcarecards'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'
import { GetPatienteventmovements } from '../../Redux/PatienteventmovementSlice'
import { GetPatienteventdefines } from '../../Redux/PatienteventdefineSlice'
import { GetPatienthealthcases } from '../../Redux/PatienthealthcaseSlice'
import { GetPatienthealthcasedefines } from '../../Redux/PatienthealthcasedefineSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienteventmovements: state.Patienteventmovements,
    Patienteventdefines: state.Patienteventdefines,
    Patienthealthcases: state.Patienthealthcases,
    Patienthealthcasedefines: state.Patienthealthcasedefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetPatients, GetPatientdefines, GetPatienteventmovements, GetPatienteventdefines,
    GetPatienthealthcases, GetPatienthealthcasedefines
}

export default connect(mapStateToProps, mapDispatchToProps)(Overviewhealthcarecards)