import { connect } from 'react-redux'
import BreakdownsEdit from '../../Pages/Breakdowns/BreakdownsEdit'
import { EditBreakdowns, GetBreakdown, handleSelectedBreakdown, fillBreakdownnotification } from '../../Redux/BreakdownSlice'
import { GetEquipments } from '../../Redux/EquipmentSlice'
import { GetEquipmentgroups } from '../../Redux/EquipmentgroupSlice'
import { GetUsers } from '../../Redux/UserSlice'
import { GetUsagetypes } from '../../Redux/UsagetypeSlice'
import { GetFiles } from '../../Redux/FileSlice'

const mapStateToProps = (state) => ({
    Breakdowns: state.Breakdowns,
    Users: state.Users,
    Files: state.Files,
    Usagetypes: state.Usagetypes,
    Equipments: state.Equipments,
    Equipmentgroups: state.Equipmentgroups,
    Profile: state.Profile
})

const mapDispatchToProps = { EditBreakdowns, GetBreakdown, GetUsagetypes, GetFiles, handleSelectedBreakdown, fillBreakdownnotification, GetEquipments, GetEquipmentgroups, GetUsers }

export default connect(mapStateToProps, mapDispatchToProps)(BreakdownsEdit)