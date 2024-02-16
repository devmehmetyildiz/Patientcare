import { connect } from 'react-redux'
import CareplansDelete from "../../Pages/Careplans/CareplansDelete"
import { DeleteCareplans, removeCareplannotification, fillCareplannotification, handleDeletemodal, handleSelectedCareplan } from "../../Redux/CareplanSlice"

const mapStateToProps = (state) => ({
    Careplans: state.Careplans,
    Profile: state.Profile
})

const mapDispatchToProps = { DeleteCareplans, removeCareplannotification, fillCareplannotification, handleDeletemodal, handleSelectedCareplan }

export default connect(mapStateToProps, mapDispatchToProps)(CareplansDelete)