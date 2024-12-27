import { connect } from 'react-redux'
import UsernotificationsNotificationView from '../../Pages/Usernotifications/UsernotificationsNotificationView'
import { EditRecordUsernotifications, closeSidebar, GetLastUsernotificationsbyUseridFreezed, GetUsernotificationsFreezed } from "../../Redux/UsernotificationSlice"

const mapStateToProps = (state) => ({
    Usernotifications: state.Usernotifications,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    EditRecordUsernotifications, closeSidebar, GetLastUsernotificationsbyUseridFreezed, GetUsernotificationsFreezed
}

export default connect(mapStateToProps, mapDispatchToProps)(UsernotificationsNotificationView)