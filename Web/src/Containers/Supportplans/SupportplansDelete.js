import { connect } from 'react-redux'
import SupportplansDelete from '../../Pages/Supportplans/SupportplansDelete'
import { DeleteSupportplans, handleDeletemodal, handleSelectedSupportplan } from '../../Redux/SupportplanSlice'

const mapStateToProps = (state) => ({
    Supportplans: state.Supportplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteSupportplans, handleDeletemodal, handleSelectedSupportplan
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportplansDelete)