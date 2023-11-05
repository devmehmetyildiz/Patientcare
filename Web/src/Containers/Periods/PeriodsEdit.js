import { connect } from 'react-redux'
import PeriodsEdit from '../../Pages/Periods/PeriodsEdit'
import { GetPeriod,  fillPeriodnotification, EditPeriods, handleSelectedPeriod } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = { GetPeriod,  fillPeriodnotification, EditPeriods, handleSelectedPeriod }

export default connect(mapStateToProps, mapDispatchToProps)(PeriodsEdit)