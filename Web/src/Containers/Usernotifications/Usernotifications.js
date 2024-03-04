import { connect } from 'react-redux'
import Usernotifications from '../../Pages/Usernotifications/Usernotifications'
import { GetUsernotifications, handleOpen } from "../../Redux/UsernotificationSlice"

const mapStateToProps = (state) => ({
    Usernotifications: state.Usernotifications,
    Profile: state.Profile,
})

const mapDispatchToProps = { GetUsernotifications, handleOpen }

export default connect(mapStateToProps, mapDispatchToProps)(Usernotifications)