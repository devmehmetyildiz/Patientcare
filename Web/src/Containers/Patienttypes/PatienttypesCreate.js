import { connect } from 'react-redux'
import PatienttypesCreate from '../../Pages/Patienttypes/PatienttypesCreate'
import { AddPatienttypes, removePatienttypenotification, fillPatienttypenotification } from '../../Redux/PatienttypeSlice'

const mapStateToProps = (state) => ({
  Patienttypes: state.Patienttypes,
  Profile: state.Profile
})

const mapDispatchToProps = { AddPatienttypes, removePatienttypenotification, fillPatienttypenotification }

export default connect(mapStateToProps, mapDispatchToProps)(PatienttypesCreate)