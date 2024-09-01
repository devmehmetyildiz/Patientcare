import React, { useEffect } from 'react'
import { Formatdate } from '..//../Utils/Formatdate'
import validator from '../../Utils/Validator'
import { PatientsDetailCard } from '../../Components'

export default function PreregistrationsPrepareStepFour(props) {
    const {
        PAGE_NAME,
        Profile,
        selectedStocks,
        selectedFiles,
        Patients,
        Patientdefines,
        Stocks,
        Stockdefines,
        Units,
        Users,
        Cases,
        Departments,
        Stocktypes,
        Stocktypegroups,
        Files,
        Costumertypes,
        Patienttypes,
        Usagetypes,
        GetPatientdefines,
        GetStocks,
        GetStockdefines,
        GetUnits,
        GetCases,
        GetDepartments,
        GetStocktypes,
        GetStocktypegroups,
        GetUsers,
        GetFiles,
        GetUsagetypes,
        GetPatienttypes,
        GetCostumertypes,
        fillPatientnotification
    } = props

    useEffect(() => {
        GetPatientdefines()
        GetStocks()
        GetStockdefines()
        GetUnits()
        GetCases()
        GetDepartments()
        GetStocktypes()
        GetStocktypegroups()
        GetUsers()
        GetUsagetypes()
        GetFiles()
        GetCostumertypes()
        GetPatienttypes()
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

    return <PatientsDetailCard
        usecontext
        PAGE_NAME={PAGE_NAME}
        Profile={Profile}
        Patients={Patients}
        Patientdefines={Patientdefines}
        Stocks={Stocks}
        Stockdefines={Stockdefines}
        Units={Units}
        Users={Users}
        Cases={Cases}
        Departments={Departments}
        Stocktypes={Stocktypes}
        Stocktypegroups={Stocktypegroups}
        Files={Files}
        Costumertypes={Costumertypes}
        Patienttypes={Patienttypes}
        Usagetypes={Usagetypes}
        fillnotification={fillPatientnotification}
        stocks={stocks}
        files={files}
    />
}
