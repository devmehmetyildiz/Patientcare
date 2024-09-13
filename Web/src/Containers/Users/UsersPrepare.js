import { connect } from 'react-redux'
import UsersPrepare from "../../Pages/Preregistrations/UsersPrepare"

const mapStateToProps = (state) => ({
    Patients: state.Patients,
    Profile: state.Profile
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPrepare)