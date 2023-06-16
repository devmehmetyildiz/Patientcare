import { connect } from 'react-redux'
import Checkperiods from '../../Pages/Checkperiods/Checkperiods'
import { GetCheckperiods, removeCheckperiodnotification, DeleteCheckperiods, handleDeletemodal, handleSelectedCheckperiod } from '../../Redux/CheckperiodSlice'

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetCheckperiods, removeCheckperiodnotification, DeleteCheckperiods, handleDeletemodal, handleSelectedCheckperiod
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkperiods)