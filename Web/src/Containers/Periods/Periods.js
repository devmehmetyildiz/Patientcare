import { connect } from 'react-redux'
import Periods from '../../Pages/Periods/Periods'
import { GetPeriods, DeletePeriods, handleDeletemodal, handleSelectedPeriod, handleFastcreatemodal } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = { GetPeriods, DeletePeriods, handleDeletemodal, handleSelectedPeriod, handleFastcreatemodal }

export default connect(mapStateToProps, mapDispatchToProps)(Periods)