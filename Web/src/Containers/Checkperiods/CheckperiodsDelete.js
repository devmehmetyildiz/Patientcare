import { connect } from 'react-redux'
import CheckperiodsDelete from "../../Pages/Checkperiods/CheckperiodsDelete"
import {
    DeleteCheckperiods, handleDeletemodal, handleSelectedCheckperiod
} from "../../Redux/CheckperiodSlice"

const mapStateToProps = (state) => ({
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteCheckperiods, handleDeletemodal, handleSelectedCheckperiod
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckperiodsDelete)