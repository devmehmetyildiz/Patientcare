import { connect } from 'react-redux'
import Checkperiods from '../../Pages/Checkperiods/Checkperiods'
import { GetCheckperiods, removeCheckperiodnotification, DeleteCheckperiods } from '../../Redux/Reducers/CheckperiodReducer'

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetCheckperiods, removeCheckperiodnotification, DeleteCheckperiods
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkperiods)