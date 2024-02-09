import { connect } from 'react-redux'
import UsagetypesDelete from "../../Pages/Usagetypes/UsagetypesDelete"
import { DeleteUsagetypes, handleDeletemodal, handleSelectedUsagetype } from "../../Redux/UsagetypeSlice"

const mapStateToProps = (state) => ({
    Usagetypes: state.Usagetypes,
    Profile: state.Profile
})

const mapDispatchToProps = { DeleteUsagetypes, handleDeletemodal, handleSelectedUsagetype }

export default connect(mapStateToProps, mapDispatchToProps)(UsagetypesDelete)