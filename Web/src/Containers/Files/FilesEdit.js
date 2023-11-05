import { connect } from 'react-redux'
import FilesEdit from '../../Pages/Stations/StationsEdit'
import { EditFiles, GetFile, handleSelectedFile,  fillFilenotification } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = { EditFiles, GetFile, handleSelectedFile,  fillFilenotification }

export default connect(mapStateToProps, mapDispatchToProps)(FilesEdit)