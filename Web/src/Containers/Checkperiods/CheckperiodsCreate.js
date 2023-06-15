import { connect } from 'react-redux'
import CheckperiodsCreate from '../../Pages/Checkperiods/CheckperiodsCreate'
import { AddCheckperiods, removeCheckperiodnotification, fillCheckperiodnotification } from '../../Redux/Reducers/CheckperiodReducer'
import { GetPeriods, removePeriodnotification } from '../../Redux/Reducers/PeriodReducer'

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddCheckperiods, removeCheckperiodnotification, fillCheckperiodnotification, GetPeriods, removePeriodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckperiodsCreate)