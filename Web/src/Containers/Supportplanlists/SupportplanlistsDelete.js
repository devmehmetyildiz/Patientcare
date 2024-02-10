import { connect } from 'react-redux'
import SupportplanlistsDelete from '../../Pages/Supportplanlists/SupportplanlistsDelete'
import { DeleteSupportplanlists, handleDeletemodal, handleSelectedSupportplanlist } from '../../Redux/SupportplanlistSlice'

const mapStateToProps = (state) => ({
    Supportplanlists: state.Supportplanlists,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteSupportplanlists, handleDeletemodal, handleSelectedSupportplanlist
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportplanlistsDelete)