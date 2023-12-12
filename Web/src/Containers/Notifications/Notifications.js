import { connect } from 'react-redux'
import Notifications from '../../Pages/Notifications/Notifications'
import {
    GetUsernotifications, EditUsernotifications, handleViewmodal, handleDeletemodal,
    handleSelectedUsernotification, EditRecordUsernotifications, DeleteUsernotifications, DeleteUsernotificationbyid, DeleteUsernotificationbyidreaded
} from "../../Redux/UsernotificationSlice"

const mapStateToProps = (state) => ({
    Usernotifications: state.Usernotifications,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetUsernotifications, handleViewmodal, handleDeletemodal, handleSelectedUsernotification,
    EditUsernotifications, EditRecordUsernotifications, DeleteUsernotifications, DeleteUsernotificationbyid, DeleteUsernotificationbyidreaded
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)