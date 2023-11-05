import { connect } from 'react-redux'
import ProfileEdit from '../../Pages/Auth/ProfileEdit'
import { GetUserMeta,  fillnotification } from "../../Redux/ProfileSlice"
import { EditUsers } from "../../Redux/UserSlice"
import { EditFiles, fillFilenotification } from "../../Redux/FileSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Users: state.Users,
    Files: state.Files
})

const mapDispatchToProps = {
    GetUserMeta, EditUsers, EditFiles, 
    fillFilenotification,  fillnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit)