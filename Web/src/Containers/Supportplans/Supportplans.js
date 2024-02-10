import { connect } from 'react-redux'
import Supportplans from '../../Pages/Supportplans/Supportplans'
import {GetSupportplans,  DeleteSupportplans, handleDeletemodal,handleSelectedSupportplan } from '../../Redux/SupportplanSlice'

const mapStateToProps = (state) => ({
    Supportplans: state.Supportplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetSupportplans,  DeleteSupportplans, handleDeletemodal,handleSelectedSupportplan
}


export default connect(mapStateToProps, mapDispatchToProps)(Supportplans)