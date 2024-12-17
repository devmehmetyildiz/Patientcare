import { connect } from 'react-redux'
import OverviewcardTrainingusercount from '../../Pages/Overviewcard/OverviewcardTrainingusercount'
import { GetTrainingCountPersonel } from '../../Redux/OverviewcardSlice'

const mapStateToProps = (state) => ({
    Profile: state.Profile,
    Overviewcards: state.Overviewcards
})

const mapDispatchToProps = {
    GetTrainingCountPersonel
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewcardTrainingusercount)