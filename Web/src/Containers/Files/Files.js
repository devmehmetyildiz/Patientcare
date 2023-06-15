import { connect } from 'react-redux'
import Files from '../../Pages/Files/Files'
import { GetFiles,removeFilenotification ,fillFilenotification,DeleteFiles } from '../../Redux/Reducers/FileReducer'
 
const mapStateToProps = (state) => ({
    Files:state.Files,
    Profile: state.Profile
})

const mapDispatchToProps = { GetFiles,removeFilenotification ,fillFilenotification,DeleteFiles}

export default connect(mapStateToProps, mapDispatchToProps)(Files)