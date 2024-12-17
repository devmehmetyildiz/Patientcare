import { connect } from 'react-redux'
import OverviewcardCompletedfilecountforpatient from '../../Pages/Overviewcard/OverviewcardCompletedfilecountforpatient'
import { GetCompletedFileCountForPatients } from '../../Redux/OverviewcardSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Overviewcards: state.Overviewcards
})

const mapDispatchToProps = {
    GetCompletedFileCountForPatients
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewcardCompletedfilecountforpatient)