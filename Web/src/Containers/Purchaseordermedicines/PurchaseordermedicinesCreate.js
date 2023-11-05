import { connect } from 'react-redux'
import PurchaseordermedicinesCreate from '../../Pages/Purchaseordermedicines/PurchaseordermedicinesCreate'
import { AddPurchaseorderstocks,  fillPurchaseorderstocknotification } from '../../Redux/PurchaseorderstockSlice'
import { GetPurchaseorders } from "../../Redux/PurchaseorderSlice"
import { GetStockdefines } from '../../Redux/StockdefineSlice'
import { GetDepartments } from '../../Redux/DepartmentSlice'

const mapStateToProps = (state) => ({
    Purchaseorderstocks: state.Purchaseorderstocks,
    Purchaseorders: state.Purchaseorders,
    Stockdefines: state.Stockdefines,
    Departments: state.Departments,
    Profile: state.Profile
})


const mapDispatchToProps = {
    AddPurchaseorderstocks,  fillPurchaseorderstocknotification,
    GetPurchaseorders,  GetStockdefines, GetDepartments
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseordermedicinesCreate)