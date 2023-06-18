import { connect } from 'react-redux'
import PatienttypesDelete from '../../Pages/Patienttypes/PatienttypesDelete'
import { DeletePatienttypes, handleDeletemodal, handleSelectedPatienttype } from '../../Redux/PatienttypeSlice'


const mapStateToProps = (state) => ({
    Patienttypes: state.Patienttypes,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeletePatienttypes, handleDeletemodal, handleSelectedPatienttype
}

export default connect(mapStateToProps, mapDispatchToProps)(PatienttypesDelete)