import { connect } from 'react-redux'
import FilesEdit from '../../Pages/Stations/StationsEdit'
import { EditFiles, GetFile, RemoveSelectedFile, removeFilenotification, fillFilenotification } from '../../Redux/Reducers/FileReducer'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = { EditFiles, GetFile, RemoveSelectedFile, removeFilenotification, fillFilenotification }

export default connect(mapStateToProps, mapDispatchToProps)(FilesEdit)