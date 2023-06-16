import { connect } from 'react-redux'
import PatienttypesEdit from '../../Pages/Patienttypes/PatienttypesEdit'
import { EditPatienttypes, GetPatienttype, RemoveSelectedPatienttype, removePatienttypenotification, fillPatienttypenotification } from '../../Redux/PatienttypeSlice'

const mapStateToProps = (state) => ({
  Patienttypes: state.Patienttypes,
  Profile: state.Profile
})

const mapDispatchToProps = { EditPatienttypes, GetPatienttype, RemoveSelectedPatienttype, removePatienttypenotification, fillPatienttypenotification }

export default connect(mapStateToProps, mapDispatchToProps)(PatienttypesEdit)