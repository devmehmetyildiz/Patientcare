import { connect } from 'react-redux'
import Patienttypes from '../../Pages/Patienttypes/Patienttypes'
import { GetPatienttypes, removePatienttypenotification, fillPatienttypenotification, DeletePatienttypes, handleDeletemodal, handleSelectedPatienttype } from '../../Redux/PatienttypeSlice'


const mapStateToProps = (state) => ({
  Patienttypes: state.Patienttypes,
  Profile: state.Profile
})

const mapDispatchToProps = {
  GetPatienttypes, removePatienttypenotification, fillPatienttypenotification, DeletePatienttypes,
  handleDeletemodal, handleSelectedPatienttype
}

export default connect(mapStateToProps, mapDispatchToProps)(Patienttypes)