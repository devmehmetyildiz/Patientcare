import { connect } from 'react-redux'
import RequiredperiodsCreate from '../../Pages/Requiredperiods/RequiredperiodsCreate'
import { AddRequiredperiods, fillRequiredperiodnotification } from "../../Redux/RequiredperiodSlice"

const mapStateToProps = (state) => ({
    Requiredperiods: state.Requiredperiods,
    Profile: state.Profile
})

const mapDispatchToProps = { AddRequiredperiods, fillRequiredperiodnotification }

export default connect(mapStateToProps, mapDispatchToProps)(RequiredperiodsCreate)