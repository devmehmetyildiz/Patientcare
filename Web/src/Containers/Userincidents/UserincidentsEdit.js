import { connect } from 'react-redux'
import UserincidentsEdit from '../../Pages/Userincidents/UserincidentsEdit'
import { EditUserincidents, GetUserincident, fillUserincidentnotification } from '../../Redux/UserincidentSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Userincidents: state.Userincidents,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    EditUserincidents, GetUserincident, fillUserincidentnotification, GetUsers
}


export default connect(mapStateToProps, mapDispatchToProps)(UserincidentsEdit)