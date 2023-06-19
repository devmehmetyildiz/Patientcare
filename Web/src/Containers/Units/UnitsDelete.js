import { connect } from 'react-redux'
import UnitsDelete from "../../Pages/Units/UnitsDelete"
import { DeleteUnits, handleDeletemodal, handleSelectedUnit } from "../../Redux/UnitSlice"

const mapStateToProps = (state) => ({
    Units: state.Units,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteUnits, handleDeletemodal, handleSelectedUnit
}

export default connect(mapStateToProps, mapDispatchToProps)(UnitsDelete)