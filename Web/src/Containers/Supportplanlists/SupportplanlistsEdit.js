import { connect } from 'react-redux'
import SupportplanlistsEdit from '../../Pages/Supportplanlists/SupportplanlistsEdit'
import { GetSupportplans } from '../../Redux/SupportplanSlice'
import { GetSupportplanlist, EditSupportplanlists, fillSupportplanlistnotification } from '../../Redux/SupportplanlistSlice'

const mapStateToProps = (state) => ({
    Supportplanlists: state.Supportplanlists,
    Supportplans: state.Supportplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetSupportplans, GetSupportplanlist, EditSupportplanlists, fillSupportplanlistnotification,

}

export default connect(mapStateToProps, mapDispatchToProps)(SupportplanlistsEdit)