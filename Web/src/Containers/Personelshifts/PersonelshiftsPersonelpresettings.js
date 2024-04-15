import { connect } from 'react-redux'
import PersonelshiftsPersonelpresettings from "../../Pages/Personelshifts/PersonelshiftsPersonelpresettings"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Floors: state.Floors,
    Shiftdefines: state.Shiftdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsPersonelpresettings)