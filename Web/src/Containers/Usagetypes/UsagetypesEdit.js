import { connect } from 'react-redux'
import UsagetypesEdit from '../../Pages/Usagetypes/UsagetypesEdit'
import { EditUsagetypes, GetUsagetype, fillUsagetypenotification } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = { EditUsagetypes, GetUsagetype, fillUsagetypenotification }

export default connect(mapStateToProps, mapDispatchToProps)(UsagetypesEdit)