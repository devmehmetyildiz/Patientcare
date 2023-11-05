import { connect } from 'react-redux'
import Patientmovements from '../../Pages/Patientmovements/Patientmovements'
import { GetPatientmovements,  DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement } from '../../Redux/PatientmovementSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientmovements,  DeletePatientmovements, handleDeletemodal, handleSelectedPatientmovement,
    GetPatientdefines,  GetPatients
}

export default connect(mapStateToProps, mapDispatchToProps)(Patientmovements)