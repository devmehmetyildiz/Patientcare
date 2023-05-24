import { connect } from 'react-redux'
import FilesEdit from '../../Pages/Stations/StationsEdit'
import { EditFiles, GetFile, RemoveSelectedFile, removeFilenotification, fillFilenotification } from '../../Redux/Actions/FileAction'

const mapStateToProps = (state) => ({
    Files: state.Files
})

const mapDispatchToProps = { EditFiles, GetFile, RemoveSelectedFile, removeFilenotification, fillFilenotification }

export default connect(mapStateToProps, mapDispatchToProps)(FilesEdit)