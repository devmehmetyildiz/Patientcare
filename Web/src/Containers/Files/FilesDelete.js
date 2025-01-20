import { connect } from 'react-redux'
import FilesDelete from '../../Pages/Files/FilesDelete'
import { DeleteFiles } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteFiles
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesDelete)