import { connect } from 'react-redux'
import CheckperiodsEdit from '../../Pages/Checkperiods/CheckperiodsEdit'
import { GetCheckperiod, EditCheckperiods, handleSelectedCheckperiod, fillCheckperiodnotification } from '../../Redux/CheckperiodSlice'
import { GetPeriods, removePeriodnotification } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetCheckperiod, EditCheckperiods, handleSelectedCheckperiod, fillCheckperiodnotification,
    GetPeriods, removePeriodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckperiodsEdit)