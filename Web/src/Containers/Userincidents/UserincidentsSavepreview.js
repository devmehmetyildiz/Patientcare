import { connect } from 'react-redux'
import UserincidentsSavepreview from '../../Pages/Userincidents/UserincidentsSavepreview'
import { SavepreviewUserincidents, GetUserincidents } from '../../Redux/UserincidentSlice'

const mapStateToProps = (state) => ({
    Userincidents: state.Userincidents,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    SavepreviewUserincidents, GetUserincidents
}

export default connect(mapStateToProps, mapDispatchToProps)(UserincidentsSavepreview)