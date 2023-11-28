import { connect } from 'react-redux'
import BreakdownsComplete from '../../Pages/Breakdowns/BreakdownsComplete'
import { CompleteBreakdowns, handleCompletemodal, handleSelectedBreakdown } from '../../Redux/BreakdownSlice'

const mapStateToProps = (state) => ({
    Breakdowns: state.Breakdowns,
    Profile: state.Profile
})

const mapDispatchToProps = {
    CompleteBreakdowns, handleCompletemodal, handleSelectedBreakdown
}

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownsComplete)