import { connect } from 'react-redux'
import SupportplanlistsCreate from '../../Pages/Supportplanlists/SupportplanlistsCreate'
import { GetSupportplans } from '../../Redux/SupportplanSlice'
import { AddSupportplanlists, fillSupportplanlistnotification } from '../../Redux/SupportplanlistSlice'

const mapStateToProps = (state) => ({
    Supportplanlists: state.Supportplanlists,
    Supportplans: state.Supportplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetSupportplans, AddSupportplanlists, fillSupportplanlistnotification
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportplanlistsCreate)