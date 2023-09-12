import { connect } from 'react-redux'
import Checkperiods from '../../Pages/Checkperiods/Checkperiods'
import { GetCheckperiods, removeCheckperiodnotification, DeleteCheckperiods, handleDeletemodal, handleSelectedCheckperiod } from '../../Redux/CheckperiodSlice'
import { GetPeriods, removePeriodnotification } from '../../Redux/PeriodSlice'

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Profile: state.Profile,
    Periods: state.Periods
})

const mapDispatchToProps = {
    GetCheckperiods, removeCheckperiodnotification, DeleteCheckperiods,
    handleDeletemodal, handleSelectedCheckperiod, GetPeriods, removePeriodnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkperiods)