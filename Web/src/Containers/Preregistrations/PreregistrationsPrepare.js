import { connect } from 'react-redux'
import PreregistrationsPrepare from "../../Pages/Preregistrations/PreregistrationsPrepare"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Profile: state.Profile
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PreregistrationsPrepare)