import { connect } from 'react-redux'
import PatienthealthcasedefinesCreate from '../../Pages/Patienthealthcasedefines/PatienthealthcasedefinesCreate'
import { AddPatienthealthcasedefines, fillPatienthealthcasedefinenotification } from "../../Redux/PatienthealthcasedefineSlice"

const mapStateToProps = (state) => ({
    Patienthealthcasedefines: state.Patienthealthcasedefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPatienthealthcasedefines, fillPatienthealthcasedefinenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienthealthcasedefinesCreate)