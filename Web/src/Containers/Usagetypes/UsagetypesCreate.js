import { connect } from 'react-redux'
import UsagetypesCreate from '../../Pages/Usagetypes/UsagetypesCreate'
import { AddUsagetypes, fillUsagetypenotification } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = { AddUsagetypes, fillUsagetypenotification }

export default connect(mapStateToProps, mapDispatchToProps)(UsagetypesCreate)