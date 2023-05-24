import { connect } from 'react-redux'
import ProfileEdit from '../../Pages/Auth/ProfileEdit'
import { GetUserMeta, removenotification, fillnotification } from "../../Redux/Actions/ProfileAction"
import { EditUsers, removeUsernotification } from "../../Redux/Actions/UserAction"
import { EditFiles, removeFilenotification, fillFilenotification } from "../../Redux/Actions/FileAction"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Users: state.Users,
    Files: state.Files
})

const mapDispatchToProps = {
    GetUserMeta, EditUsers, EditFiles, removeFilenotification,
    fillFilenotification, removenotification, fillnotification, removeUsernotification
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit)