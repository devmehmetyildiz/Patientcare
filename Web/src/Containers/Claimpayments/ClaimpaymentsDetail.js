import { connect } from 'react-redux'
import ClaimpaymentsDetail from '../../Pages/Claimpayments/ClaimpaymentsDetail'
import { GetClaimpayment, SavepreviewClaimpayments, fillClaimpaymentnotification } from '../../Redux/ClaimpaymentSlice'
import { GetPatients } from '../../Redux/PatientSlice'
import { GetPatientdefines } from '../../Redux/PatientdefineSlice'

const mapStateToProps = (state) => ({
    Claimpayments: state.Claimpayments,
    Patients: state.Patients,
    Patientdefines: state.Patientdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetClaimpayment, fillClaimpaymentnotification, GetPatientdefines, GetPatients,
    SavepreviewClaimpayments
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimpaymentsDetail)