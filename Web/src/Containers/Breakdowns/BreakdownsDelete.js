import { connect } from 'react-redux'
import BreakdownsDelete from '../../Pages/Breakdowns/BreakdownsDelete'
import { DeleteBreakdowns, handleDeletemodal, handleSelectedBreakdown } from '../../Redux/BreakdownSlice'

const mapStateToProps = (state) => ({
    Breakdowns: state.Breakdowns,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteBreakdowns, handleDeletemodal, handleSelectedBreakdown
}

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownsDelete)