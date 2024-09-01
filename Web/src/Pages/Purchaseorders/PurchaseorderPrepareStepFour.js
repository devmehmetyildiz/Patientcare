import React, { useEffect } from 'react'
import { Formatdate } from '..//../Utils/Formatdate'
import validator from '../../Utils/Validator'
import { PurchaseorderDetailCard } from '../../Components'

export default function PurchaseorderPrepareStepFour(props) {
    const {
        PAGE_NAME,
        Profile,
        selectedStocks,
        selectedFiles,
        GetUsers,
        GetFiles,
        GetStocks,
        GetUsagetypes,
        GetStockdefines,
        GetWarehouses,
        GetUnits,
        GetPatientdefines,
        GetPatients,
        GetCases,
        GetDepartments,
        Users,
        Files,
        Stocks,
        Usagetypes,
        Stockdefines,
        Units,
        Warehouses,
        Patients,
        Patientdefines,
        Cases,
        Departments,
        fillPurchaseordernotification
    } = props

    useEffect(() => {
        GetUsers()
        GetFiles()
        GetStocks()
        GetUsagetypes()
        GetUnits()
        GetStockdefines()
        GetWarehouses()
        GetPatientdefines()
        GetPatients()
        GetCases()
        GetDepartments()
    }, [])

    const stocks = (selectedStocks || []).map(element => {
        return {
            ...element,
            key: Math.random(),
            Skt: validator.isISODate(element.Skt) ? Formatdate(element.Skt) : element.Skt
        }
    });
    const files = (selectedFiles || []).map(element => {
        return {
            ...element,
            key: Math.random(),
            Usagetype: (Array.isArray(element.Usagetype) ? element.Usagetype : ((element?.Usagetype || '').split(',') || [])).map(u => {
                return (Usagetypes.list || []).find(type => type.Uuid === u)?.Name
            })
        }
    });

    return <PurchaseorderDetailCard
        usecontext
        PAGE_NAME={PAGE_NAME}
        Users={Users}
        Files={Files}
        Stocks={Stocks}
        Usagetypes={Usagetypes}
        Stockdefines={Stockdefines}
        Units={Units}
        Warehouses={Warehouses}
        Patients={Patients}
        Patientdefines={Patientdefines}
        Cases={Cases}
        Departments={Departments}
        fillnotification={fillPurchaseordernotification}
        files={files}
        stocks={stocks}
        Profile={Profile}
    />
}
