import { connect } from 'react-redux'
import Periods from '../../Pages/Periods/Periods'
import { GetPeriods, removePeriodnotification,DeletePeriods } from '../../Redux/Reducers/PeriodReducer'

const mapStateToProps = (state) => ({
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = { GetPeriods, removePeriodnotification,DeletePeriods }

export default connect(mapStateToProps, mapDispatchToProps)(Periods)