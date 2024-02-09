import { connect } from 'react-redux'
import ProfileEdit from '../../Pages/Auth/ProfileEdit'
import { GetUserMeta, fillnotification } from "../../Redux/ProfileSlice"
import { GetUsagetypes } from "../../Redux/UsagetypeSlice"
import { EditUsers } from "../../Redux/UserSlice"
import { EditFiles, fillFilenotification } from "../../Redux/FileSlice"

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Users: state.Users,
    Usagetypes: state.Usagetypes,
    Files: state.Files
})

const mapDispatchToProps = {
    GetUserMeta, EditUsers, EditFiles,
    fillFilenotification, fillnotification, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit)