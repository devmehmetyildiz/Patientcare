import { connect } from 'react-redux'
import ColumnChooser from '../../Pages/Utils/ColumnChooser'
import { SaveTableMeta, ResetTableMeta } from "../../Redux/ProfileSlice"

const mapStateToProps = (state) => ({
  Profile: state.Profile
})

const mapDispatchToProps = {
  SaveTableMeta, ResetTableMeta
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnChooser)