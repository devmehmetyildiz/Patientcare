import { connect } from 'react-redux'
import Checkperiods from '../../Pages/Checkperiods/Checkperiods'
import { GetCheckperiods,  DeleteCheckperiods, handleDeletemodal, handleSelectedCheckperiod } from '../../Redux/CheckperiodSlice'
import { GetPeriods } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Profile: state.Profile,
    Periods: state.Periods
})

const mapDispatchToProps = {
    GetCheckperiods,  DeleteCheckperiods,
    handleDeletemodal, handleSelectedCheckperiod, GetPeriods
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkperiods)