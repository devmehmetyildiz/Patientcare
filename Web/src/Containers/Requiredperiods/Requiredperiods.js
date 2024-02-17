import { connect } from 'react-redux'
import Requiredperiods from '../../Pages/Requiredperiods/Requiredperiods'
import { GetRequiredperiods, handleDeletemodal, handleSelectedRequiredperiod } from "../../Redux/RequiredperiodSlice"

const mapStateToProps = (state) => ({
    Requiredperiods: state.Requiredperiods,
    Profile: state.Profile,
})

const mapDispatchToProps = {
    GetRequiredperiods, handleDeletemodal, handleSelectedRequiredperiod
}

export default connect(mapStateToProps, mapDispatchToProps)(Requiredperiods)