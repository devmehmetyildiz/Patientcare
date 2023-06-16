import { connect } from 'react-redux'
import Periods from '../../Pages/Periods/Periods'
import { GetPeriods, removePeriodnotification, DeletePeriods, handleDeletemodal, handleSelectedPeriod } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = { GetPeriods, removePeriodnotification, DeletePeriods, handleDeletemodal, handleSelectedPeriod }

export default connect(mapStateToProps, mapDispatchToProps)(Periods)