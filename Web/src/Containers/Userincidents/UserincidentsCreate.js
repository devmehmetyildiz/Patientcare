import { connect } from 'react-redux'
import UserincidentsCreate from '../../Pages/Userincidents/UserincidentsCreate'
import { AddUserincidents, fillUserincidentnotification } from '../../Redux/UserincidentSlice'
import { GetUsers } from '../../Redux/UserSlice'

const mapStateToProps = (state) => ({
    Userincidents: state.Userincidents,
    Users: state.Users,
    Profile: state.Profile
})

const mapDispatchToProps = {
    AddUserincidents, fillUserincidentnotification, GetUsers
}


export default connect(mapStateToProps, mapDispatchToProps)(UserincidentsCreate)