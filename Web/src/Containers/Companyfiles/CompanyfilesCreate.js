import { connect } from 'react-redux'
import CompanyfilesCreate from '../../Pages/Companyfiles/CompanyfilesCreate'
import { EditFiles, fillFilenotification } from '../../Redux/FileSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'

const mapStateToProps = (state) => ({
    Files: state.Files,
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = { EditFiles, fillFilenotification, GetUsagetypes }

export default connect(mapStateToProps, mapDispatchToProps)(CompanyfilesCreate)