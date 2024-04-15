import { connect } from 'react-redux'
import PersonelshiftsPreparePersonels from '../../Pages/Personelshifts/PersonelshiftsPreparePersonels'

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Profile: state.Profile
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsPreparePersonels)