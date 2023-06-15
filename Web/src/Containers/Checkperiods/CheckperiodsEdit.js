import { connect } from 'react-redux'
import CheckperiodsEdit from '../../Pages/Checkperiods/CheckperiodsEdit'
import { GetCheckperiod, EditCheckperiods, removeCheckperiodnotification, fillCheckperiodnotification } from '../../Redux/Reducers/CheckperiodReducer'
import { GetPeriods, removePeriodnotification } from '../../Redux/Reducers/PeriodReducer'

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetCheckperiod, EditCheckperiods, removeCheckperiodnotification, fillCheckperiodnotification,
    GetPeriods, removePeriodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckperiodsEdit)