import { connect } from 'react-redux'
import Units from "../../Pages/Units/Units"
import { GetUnits, DeleteUnits, removeUnitnotification, fillUnitnotification } from "../../Redux/Reducers/UnitReducer"

const mapStateToProps = (state) => ({
  Units: state.Units,
  Profile: state.Profile
})

const mapDispatchToProps = { GetUnits, DeleteUnits, removeUnitnotification, fillUnitnotification }

export default connect(mapStateToProps, mapDispatchToProps)(Units)