import { connect } from 'react-redux'
import UsernotificationNotificationItem from '../../Pages/Usernotifications/UsernotificationNotificationItem'
import { DeleteUsernotifications } from "../../Redux/UsernotificationSlice"

const mapStateToProps = (state) => ({
    Usernotifications: state.Usernotifications,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    DeleteUsernotifications
}

export default connect(mapStateToProps, mapDispatchToProps)(UsernotificationNotificationItem)