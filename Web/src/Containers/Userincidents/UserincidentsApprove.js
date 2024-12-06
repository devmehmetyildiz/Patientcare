import { connect } from 'react-redux'
import UserincidentsApprove from '../../Pages/Userincidents/UserincidentsApprove'
import { ApproveUserincidents, GetUserincidents } from '../../Redux/UserincidentSlice'

const mapStateToProps = (state) => ({
    Userincidents: state.Userincidents,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    ApproveUserincidents, GetUserincidents
}


export default connect(mapStateToProps, mapDispatchToProps)(UserincidentsApprove)