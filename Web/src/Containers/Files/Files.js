import { connect } from 'react-redux'
import Files from '../../Pages/Files/Files'
import { GetFiles, fillFilenotification, DeleteFiles, handleDeletemodal, handleSelectedFile } from '../../Redux/FileSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetFiles, fillFilenotification, DeleteFiles,
    handleDeletemodal, handleSelectedFile, GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Files)