import { connect } from 'react-redux'
import PeriodsFastcreate from '../../Pages/Periods/PeriodsFastcreate'
import { handleFastcreatemodal, FastcreatePeriod } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Periods: state.Periods,
    Profile: state.Profile
})

const mapDispatchToProps = { handleFastcreatemodal, FastcreatePeriod }

export default connect(mapStateToProps, mapDispatchToProps)(PeriodsFastcreate)