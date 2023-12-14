import { connect } from 'react-redux'
import PersonelshiftsCreate from '../../Pages/Personelshifts/PersonelshiftsCreate'
import { AddPersonelshifts, fillPersonelshiftnotification } from "../../Redux/PersonelshiftSlice"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = { AddPersonelshifts, fillPersonelshiftnotification }

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsCreate)