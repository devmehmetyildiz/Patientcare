import { connect } from 'react-redux'
import FilesCreate from '../../Pages/Files/FilesCreate'
import { AddFiles,  fillFilenotification } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = {  AddFiles,  fillFilenotification }

export default connect(mapStateToProps, mapDispatchToProps)(FilesCreate)