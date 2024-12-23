import { connect } from 'react-redux'
import PatienthealthcasedefinesEdit from '../../Pages/Patienthealthcasedefines/PatienthealthcasedefinesEdit'
import { EditPatienthealthcasedefines, GetPatienthealthcasedefine, fillPatienthealthcasedefinenotification } from "../../Redux/PatienthealthcasedefineSlice"

const mapStateToProps = (state) => ({
    Patienthealthcasedefines: state.Patienthealthcasedefines,
    Profile: state.Profile
})

const mapDispatchToProps = { EditPatienthealthcasedefines, GetPatienthealthcasedefine, fillPatienthealthcasedefinenotification }

export default connect(mapStateToProps, mapDispatchToProps)(PatienthealthcasedefinesEdit)