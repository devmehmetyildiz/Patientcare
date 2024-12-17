import { connect } from 'react-redux'
import OverviewcardTrainingpatientcontactcount from '../../Pages/Overviewcard/OverviewcardTrainingpatientcontactcount'
import { GetTrainingCountPatientcontact } from '../../Redux/OverviewcardSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Overviewcards: state.Overviewcards
})

const mapDispatchToProps = {
    GetTrainingCountPatientcontact
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewcardTrainingpatientcontactcount)