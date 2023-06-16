import { connect } from 'react-redux'
import PeriodsEdit from '../../Pages/Periods/PeriodsEdit'
import { GetPeriod, removePeriodnotification, fillPeriodnotification, EditPeriods } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = { GetPeriod, removePeriodnotification, fillPeriodnotification, EditPeriods }

export default connect(mapStateToProps, mapDispatchToProps)(PeriodsEdit)