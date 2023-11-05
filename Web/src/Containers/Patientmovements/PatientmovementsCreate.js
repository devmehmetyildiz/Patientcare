import { connect } from 'react-redux'
import PatientmovementsCreate from '../../Pages/Patientmovements/PatientmovementCreate'
import { AddPatientmovements, fillPatientmovementnotification } from "../../Redux/PatientmovementSlice"
import { GetPatients } from "../../Redux/PatientSlice"

const mapStateToProps = (state) => ({
    Patientmovements: state.Patientmovements,
    Patients: state.Patients,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPatientmovements, fillPatientmovementnotification,
    GetPatients
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientmovementsCreate)