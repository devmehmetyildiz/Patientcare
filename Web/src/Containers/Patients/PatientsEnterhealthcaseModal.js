import { connect } from 'react-redux'
import PatientsEnterhealthcaseModal from '../../Pages/Patients/PatientsEnterhealthcaseModal'
import { AddPatienthealthcases, fillPatienthealthcasenotification } from '../../Redux/PatienthealthcaseSlice'
import { GetPatient } from '../../Redux/PatientSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Patienthealthcases: state.Patienthealthcases,
    Patienthealthcasedefines: state.Patienthealthcasedefines,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    AddPatienthealthcases, fillPatienthealthcasenotification, GetPatient
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientsEnterhealthcaseModal)