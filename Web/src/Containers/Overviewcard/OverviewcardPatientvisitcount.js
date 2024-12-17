import { connect } from 'react-redux'
import OverviewcardPatientvisitcount from '../../Pages/Overviewcard/OverviewcardPatientvisitcount'
import { GetPatientvisitcount } from '../../Redux/OverviewcardSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Overviewcards: state.Overviewcards
})

const mapDispatchToProps = {
    GetPatientvisitcount
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewcardPatientvisitcount)