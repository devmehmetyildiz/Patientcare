import { connect } from 'react-redux'
import EquipmentsDelete from '../../Pages/Equipments/EquipmentsDelete'
import { DeleteEquipments, handleDeletemodal, handleSelectedEquipment } from "../../Redux/EquipmentSlice"

const mapStateToProps = (state) => ({
    Equipments: state.Equipments,
    Profile: state.Profile
})

const mapDispatchToProps = {
    DeleteEquipments, handleDeletemodal, handleSelectedEquipment
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentsDelete)