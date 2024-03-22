import { connect } from 'react-redux'
import PersonelshiftsEdit from '../../Pages/Personelshifts/PersonelshiftsEdit'
import { EditPersonelshifts, GetPersonelshift, fillPersonelshiftnotification } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = { EditPersonelshifts, GetPersonelshift, fillPersonelshiftnotification }

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsEdit)