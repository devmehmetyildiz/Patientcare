import { connect } from 'react-redux'
import FilesCreate from '../../Pages/Files/FilesCreate'
import { AddFiles, removeFilenotification, fillFilenotification } from '../../Redux/Reducers/FileReducer'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = {  AddFiles, removeFilenotification, fillFilenotification }

export default connect(mapStateToProps, mapDispatchToProps)(FilesCreate)