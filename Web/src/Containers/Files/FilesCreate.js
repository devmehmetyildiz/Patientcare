import { connect } from 'react-redux'
import FilesCreate from '../../Pages/Files/FilesCreate'
import { AddFiles, removeFilenotification, fillFilenotification } from '../../Redux/Actions/FileAction'

const mapStateToProps = (state) => ({
    Files: state.Files
})

const mapDispatchToProps = {  AddFiles, removeFilenotification, fillFilenotification }

export default connect(mapStateToProps, mapDispatchToProps)(FilesCreate)