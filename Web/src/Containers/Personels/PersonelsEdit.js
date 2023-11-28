import { connect } from 'react-redux'
import PersonelsEdit from '../../Pages/Personels/PersonelsEdit'
import { EditPersonels, GetPersonel, fillPersonelnotification } from "../../Redux/PersonelSlice"

const mapStateToProps = (state) => ({
    Personels: state.Personels,
    Profile: state.Profile
})

const mapDispatchToProps = { EditPersonels, GetPersonel, fillPersonelnotification }

export default connect(mapStateToProps, mapDispatchToProps)(PersonelsEdit)