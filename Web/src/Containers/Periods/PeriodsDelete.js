import { connect } from 'react-redux'
import PeriodsDelete from '../../Pages/Periods/PeriodsDelete'
import { DeletePeriods, handleDeletemodal, handleSelectedPeriod } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = { DeletePeriods, handleDeletemodal, handleSelectedPeriod }

export default connect(mapStateToProps, mapDispatchToProps)(PeriodsDelete)