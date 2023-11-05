import { connect } from 'react-redux'
import TododefinesEdit from '../../Pages/Tododefines/TododefinesEdit'
import { GetTododefine, EditTododefines,  fillTododefinenotification } from '../../Redux/TododefineSlice'
import { GetCheckperiods } from '../../Redux/CheckperiodSlice'


const mapStateToProps = (state) => ({
    Tododefines: state.Tododefines,
    Checkperiods: state.Checkperiods,
    Profile: state.Profile
})

const mapDispatchToProps = {
    GetTododefine, EditTododefines, fillTododefinenotification,
    GetCheckperiods
}

export default connect(mapStateToProps, mapDispatchToProps)(TododefinesEdit)