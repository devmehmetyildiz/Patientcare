import { connect } from 'react-redux'
import PatienthealthcasedefinesDelete from "../../Pages/Patienthealthcasedefines/PatienthealthcasedefinesDelete"
import { DeletePatienthealthcasedefines, handleDeletemodal, handleSelectedPatienthealthcasedefine } from "../../Redux/PatienthealthcasedefineSlice"

const mapStateToProps = (state) => ({
    Patienthealthcasedefines: state.Patienthealthcasedefines,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatienthealthcasedefines, handleDeletemodal, handleSelectedPatienthealthcasedefine
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienthealthcasedefinesDelete)