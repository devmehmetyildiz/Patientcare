import { connect } from 'react-redux'
import PersonelshiftsProfessionpresettings from "../../Pages/Personelshifts/PersonelshiftsProfessionpresettings"

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Floors: state.Floors,
    Shiftdefines: state.Shiftdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsProfessionpresettings)