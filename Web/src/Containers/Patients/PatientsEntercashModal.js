import { connect } from 'react-redux'
import PatientsEntercashModal from '../../Pages/Patients/PatientsEntercashModal'
import { GetPatientcashmovements, AddPatientcashmovements, fillPatientcashmovementnotification } from "../../Redux/PatientcashmovementSlice"
import { GetPatientcashregisters } from "../../Redux/PatientcashregisterSlice"
import { GetPatientdefines } from "../../Redux/PatientdefineSlice"
import { GetPatients, GetPatient } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patientcashmovements: state.Patientcashmovements,
    Patientcashregisters: state.Patientcashregisters,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetPatientcashmovements, AddPatientcashmovements, GetPatientcashregisters,
    fillPatientcashmovementnotification, GetPatientdefines,
    GetPatients, GetPatient
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEntercashModal)