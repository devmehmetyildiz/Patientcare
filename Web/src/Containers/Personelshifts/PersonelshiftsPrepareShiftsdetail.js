import { connect } from 'react-redux'
import PersonelshiftsPrepareShiftsdetail from '../../Pages/Personelshifts/PersonelshiftsPrepareShiftsdetail'

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Shiftdefines: state.Shiftdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsPrepareShiftsdetail)