import { connect } from 'react-redux'
import PatienttypesCreate from '../../Pages/Patienttypes/PatienttypesCreate'
import { AddPatienttypes, removePatienttypenotification, fillPatienttypenotification } from '../../Redux/Actions/PatienttypeAction'

const mapStateToProps = (state) => ({
  Patienttypes: state.Patienttypes
})

const mapDispatchToProps = { AddPatienttypes, removePatienttypenotification, fillPatienttypenotification }

export default connect(mapStateToProps, mapDispatchToProps)(PatienttypesCreate)