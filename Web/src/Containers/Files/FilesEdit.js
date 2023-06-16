import { connect } from 'react-redux'
import FilesEdit from '../../Pages/Stations/StationsEdit'
import { EditFiles, GetFile, handleSelectedFile, removeFilenotification, fillFilenotification } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = { EditFiles, GetFile, handleSelectedFile, removeFilenotification, fillFilenotification }

export default connect(mapStateToProps, mapDispatchToProps)(FilesEdit)