import { connect } from 'react-redux'
import PreregistrationsPrepareStepThree from "../../Pages/Preregistrations/PreregistrationsPrepareStepThree"
import { fillPatientnotification } from '../../Redux/PatientSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillPatientnotification, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsPrepareStepThree)