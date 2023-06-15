import { connect } from 'react-redux'
import Printtemplates from '../../Pages/Printtemplates/Printtemplates'
import { GetPrinttemplates, removePrinttemplatenotification, DeletePrinttemplates } from '../../Redux/Reducers/PrinttemplateReducer'


const mapStateToProps = (state) => ({
    Printtemplates: state.Printtemplates,
    Profile: state.Profile
})

const mapDispatchToProps = { GetPrinttemplates, removePrinttemplatenotification, DeletePrinttemplates }

export default connect(mapStateToProps, mapDispatchToProps)(Printtemplates)