import { connect } from 'react-redux'
import SupportplansCreate from '../../Pages/Supportplans/SupportplansCreate'
import { AddSupportplans, fillSupportplannotification } from '../../Redux/SupportplanSlice'


const mapStateToProps = (state) => ({
    Supportplans: state.Supportplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddSupportplans, fillSupportplannotification
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportplansCreate)