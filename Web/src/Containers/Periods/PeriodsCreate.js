import { connect } from 'react-redux'
import PeriodsCreate from '../../Pages/Periods/PeriodsCreate'
import { AddPeriods, removePeriodnotification, fillPeriodnotification } from '../../Redux/Actions/PeriodAction'


const mapStateToProps = (state) => ({
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPeriods, removePeriodnotification, fillPeriodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PeriodsCreate)