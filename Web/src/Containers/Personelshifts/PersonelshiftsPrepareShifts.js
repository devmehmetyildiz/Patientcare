import { connect } from 'react-redux'
import PersonelshiftsPrepareShifts from '../../Pages/Personelshifts/PersonelshiftsPrepareShifts'

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsPrepareShifts)