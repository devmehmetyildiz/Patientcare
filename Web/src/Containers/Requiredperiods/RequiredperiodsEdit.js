import { connect } from 'react-redux'
import RequiredperiodsEdit from '../../Pages/Requiredperiods/RequiredperiodsEdit'
import { EditRequiredperiods, GetRequiredperiod, handleSelectedRequiredperiod, fillRequiredperiodnotification } from "../../Redux/RequiredperiodSlice"

const mapStateToProps = (state) => ({
    Requiredperiods: state.Requiredperiods,
    Profile: state.Profile
})

const mapDispatchToProps = { EditRequiredperiods, GetRequiredperiod, handleSelectedRequiredperiod, fillRequiredperiodnotification }

export default connect(mapStateToProps, mapDispatchToProps)(RequiredperiodsEdit)