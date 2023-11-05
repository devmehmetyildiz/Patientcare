import { connect } from 'react-redux'
import Files from '../../Pages/Files/Files'
import { GetFiles, fillFilenotification, DeleteFiles, handleDeletemodal, handleSelectedFile } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetFiles, fillFilenotification, DeleteFiles,
    handleDeletemodal, handleSelectedFile
}

export default connect(mapStateToProps, mapDispatchToProps)(Files)