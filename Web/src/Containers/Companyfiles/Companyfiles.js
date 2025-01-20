import { connect } from 'react-redux'
import Companyfiles from '../../Pages/Companyfiles/Companyfiles'
import { GetCompanyFiles, fillFilenotification } from '../../Redux/FileSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'

const mapStateToProps = (state) => ({
  Files: state.Files,
  Usagetypes: state.Usagetypes,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetCompanyFiles,
  fillFilenotification,
  GetUsagetypes
}

export default connect(mapStateToProps, mapDispatchToProps)(Companyfiles)