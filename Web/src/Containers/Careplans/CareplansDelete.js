import { connect } from 'react-redux'
import CareplansDelete from "../../Pages/Careplans/CareplansDelete"
import { DeleteCareplans, } from "../../Redux/CareplanSlice"

const mapStateToProps = (state) => ({
    Careplans: state.Careplans,
    Profile: state.Profile
})

const mapDispatchToProps = { DeleteCareplans, }

export default connect(mapStateToProps, mapDispatchToProps)(CareplansDelete)