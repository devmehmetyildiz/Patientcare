import { connect } from 'react-redux'
import Files from '../../Pages/Files/Files'
import { GetFiles, removeFilenotification, fillFilenotification, DeleteFiles, handleDeletemodal, handleSelectedFile } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetFiles, removeFilenotification, fillFilenotification, DeleteFiles,
    handleDeletemodal, handleSelectedFile
}

export default connect(mapStateToProps, mapDispatchToProps)(Files)