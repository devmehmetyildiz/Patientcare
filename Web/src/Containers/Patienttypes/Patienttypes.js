import { connect } from 'react-redux'
import Patienttypes from '../../Pages/Patienttypes/Patienttypes'
import { GetPatienttypes, removePatienttypenotification, fillPatienttypenotification, DeletePatienttypes } from '../../Redux/Reducers/PatienttypeReducer'


const mapStateToProps = (state) => ({
  Patienttypes: state.Patienttypes,
  Profile: state.Profile
})

const mapDispatchToProps = { GetPatienttypes, removePatienttypenotification, fillPatienttypenotification, DeletePatienttypes }

export default connect(mapStateToProps, mapDispatchToProps)(Patienttypes)