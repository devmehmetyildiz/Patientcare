import { connect } from 'react-redux'
import BedsDelete from "../../Pages/Beds/BedsDelete"
import { DeleteBeds, handleDeletemodal, handleSelectedBed } from "../../Redux/BedSlice"

const mapStateToProps = (state) => ({
    Beds: state.Beds,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteBeds, handleDeletemodal, handleSelectedBed
}

export default connect(mapStateToProps, mapDispatchToProps)(BedsDelete)