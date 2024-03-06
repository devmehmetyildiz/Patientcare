import { connect } from 'react-redux'
import Usernotifications from '../../Pages/Usernotifications/Usernotifications'
import { GetUsernotifications, handleOpen, EditRecordUsernotifications, DeleteUsernotifications } from "../../Redux/UsernotificationSlice"

const mapStateToProps = (state) => ({
    Usernotifications: state.Usernotifications,
    Profile: state.Profile,
})

const mapDispatchToProps = { GetUsernotifications, handleOpen, EditRecordUsernotifications, DeleteUsernotifications }

export default connect(mapStateToProps, mapDispatchToProps)(Usernotifications)