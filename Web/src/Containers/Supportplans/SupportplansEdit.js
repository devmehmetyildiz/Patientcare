import { connect } from 'react-redux'
import SupportplansEdit from '../../Pages/Supportplans/SupportplansEdit'
import { GetSupportplan, EditSupportplans, fillSupportplannotification } from '../../Redux/SupportplanSlice'


const mapStateToProps = (state) => ({
    Supportplans: state.Supportplans,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetSupportplan, EditSupportplans, fillSupportplannotification
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportplansEdit)