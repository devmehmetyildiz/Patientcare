import { connect } from 'react-redux'
import PatientsEditcash from '../../Pages/Patients/PatientsEditcash'
import { GetPatientcashmovements, handleSelectedPatientcashmovement, handleDeletemodal } from "../../Redux/PatientcashmovementSlice"
import { GetPatientcashregisters } from "../../Redux/PatientcashregisterSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetPatients } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patientcashmovements: state.Patientcashmovements,
    Patientcashregisters: state.Patientcashregisters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientcashmovements, GetPatientcashregisters, GetPatientdefines, GetPatients, handleSelectedPatientcashmovement, handleDeletemodal
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEditcash)