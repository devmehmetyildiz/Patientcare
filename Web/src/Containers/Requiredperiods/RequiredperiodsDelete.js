import { connect } from 'react-redux'
import RequiredperiodsDelete from '../../Pages/Requiredperiods/RequiredperiodsDelete'
import { DeleteRequiredperiods, handleDeletemodal, handleSelectedRequiredperiod } from "../../Redux/RequiredperiodSlice"

const mapStateToProps = (state) => ({
    Requiredperiods: state.Requiredperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteRequiredperiods, handleDeletemodal, handleSelectedRequiredperiod
}

export default connect(mapStateToProps, mapDispatchToProps)(RequiredperiodsDelete)