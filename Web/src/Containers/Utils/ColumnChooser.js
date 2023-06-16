import { connect } from 'react-redux'
import ColumnChooser from '../../Pages/Utils/ColumnChooser'
import { SaveTableMeta } from "../../Redux/ProfileSlice"

const mapStateToProps = (state) => ({
  Profile: state.Profile
})

const mapDispatchToProps = {
  SaveTableMeta
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnChooser)