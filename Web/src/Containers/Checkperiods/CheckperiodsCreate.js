import { connect } from 'react-redux'
import CheckperiodsCreate from '../../Pages/Checkperiods/CheckperiodsCreate'
import { AddCheckperiods,  fillCheckperiodnotification } from '../../Redux/CheckperiodSlice'
import { GetPeriods } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddCheckperiods,  fillCheckperiodnotification, GetPeriods
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckperiodsCreate)