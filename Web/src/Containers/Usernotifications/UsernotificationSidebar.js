import { connect } from 'react-redux'
import UsernotificationSidebar from '../../Pages/Usernotifications/UsernotificationSidebar'
import { GetLastUsernotificationsbyUserid, GetLastUsernotificationsbyUseridFreezed, closeSidebar, EditRecordUsernotifications, DeleteByUserID, DeleteReadByUserID, ShowAllNotificationByUser } from "../../Redux/UsernotificationSlice"

const mapStateToProps = (state) => ({
    Usernotifications: state.Usernotifications,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetLastUsernotificationsbyUserid, closeSidebar, GetLastUsernotificationsbyUseridFreezed, EditRecordUsernotifications, DeleteByUserID, DeleteReadByUserID, ShowAllNotificationByUser
}

export default connect(mapStateToProps, mapDispatchToProps)(UsernotificationSidebar)