import { connect } from 'react-redux'
import PrinttemplatesCreate from '../../Pages/Printtemplates/PrinttemplatesCreate'
import { AddPrinttemplates, fillPrinttemplatenotification, removePrinttemplatenotification } from '../../Redux/PrinttemplateSlice'


const mapStateToProps = (state) => ({
    Printtemplates: state.Printtemplates,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddPrinttemplates, fillPrinttemplatenotification, removePrinttemplatenotification
}

export default connect(mapStateToProps, mapDispatchToProps)(PrinttemplatesCreate)