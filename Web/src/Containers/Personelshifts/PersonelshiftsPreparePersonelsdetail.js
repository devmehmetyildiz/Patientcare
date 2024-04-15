import { connect } from 'react-redux'
import PersonelshiftsPreparePersonelsdetail from '../../Pages/Personelshifts/PersonelshiftsPreparePersonelsdetail'
import { fillPersonelshiftnotification } from '../../Redux/PersonelshiftSlice'

const mapStateToProps = (state) => ({
    Personelshifts: state.Personelshifts,
    Shiftdefines: state.Shiftdefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillPersonelshiftnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsPreparePersonelsdetail)