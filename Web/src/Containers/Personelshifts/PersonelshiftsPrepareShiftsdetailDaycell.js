import { connect } from 'react-redux'
import PersonelshiftsPrepareShiftsdetailDaycell from '../../Pages/Personelshifts/PersonelshiftsPrepareShiftsdetailDaycell'
import { fillPersonelshiftnotification } from '../../Redux/PersonelshiftSlice'

const mapStateToProps = (state) => ({
    Users: state.Users,
    Usagetypes: state.Usagetypes,
    Professions: state.Professions,
    Profile: state.Profile
})

const mapDispatchToProps = {
    fillPersonelshiftnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonelshiftsPrepareShiftsdetailDaycell)