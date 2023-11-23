import { connect } from 'react-redux'
import PersonelsCreate from '../../Pages/Personels/PersonelsCreate'
import { AddPersonels, fillPersonelnotification } from "../../Redux/PersonelSlice"

const mapStateToProps = (state) => ({
    Personels: state.Personels,
    Profile: state.Profile
})

const mapDispatchToProps = { AddPersonels, fillPersonelnotification }

export default connect(mapStateToProps, mapDispatchToProps)(PersonelsCreate)