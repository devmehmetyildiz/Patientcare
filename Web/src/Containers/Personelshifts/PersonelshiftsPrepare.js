import { connect } from 'react-redux'
import PersonelshiftsPrepare from '../../Pages/Personelshifts/PersonelshiftsPrepare'

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Professions: state.Professions,
    Floors: state.Floors,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsPrepare)