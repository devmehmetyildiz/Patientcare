import { connect } from 'react-redux'
import Patientvisits from '../../Pages/Patientvisits/Patientvisits'
import { GetPatientvisits } from '../../Redux/PatientvisitSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Patientvisits: state.Patientvisits,
    Users: state.Users,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientvisits, GetUsers, GetPatientdefines, GetPatients,
}


export default connect(mapStateToProps, mapDispatchToProps)(Patientvisits)