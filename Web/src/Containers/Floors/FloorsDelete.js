import { connect } from 'react-redux'
import FloorsDelete from "../../Pages/Floors/FloorsDelete"
import { DeleteFloors, handleDeletemodal, handleSelectedFloor } from "../../Redux/FloorSlice"

const mapStateToProps = (state) => ({
    Floors: state.Floors,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteFloors, handleDeletemodal, handleSelectedFloor
}

export default connect(mapStateToProps, mapDispatchToProps)(FloorsDelete)