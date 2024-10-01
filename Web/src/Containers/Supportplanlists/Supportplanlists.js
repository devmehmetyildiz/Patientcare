import { connect } from 'react-redux'
import Supportplanlists from '../../Pages/Supportplanlists/Supportplanlists'
import { GetSupportplanlists, handleDeletemodal, handleSelectedSupportplanlist } from '../../Redux/SupportplanlistSlice'
import { GetSupportplans } from '../../Redux/SupportplanSlice'

const mapStateToProps = (state) => ({
    Supportplanlists: state.Supportplanlists,
    Profile: state.Profile,
    Supportplans: state.Supportplans,
})

const mapDispatchToProps = {
    GetSupportplanlists, handleDeletemodal, handleSelectedSupportplanlist, GetSupportplans
}

export default connect(mapStateToProps, mapDispatchToProps)(Supportplanlists)