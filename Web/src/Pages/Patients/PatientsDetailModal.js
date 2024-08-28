import React, { useEffect } from 'react'
import Literals from './Literals'
import { Button, Modal } from 'semantic-ui-react'
import { PatientsDetailCard } from '../../Components'

export default function PatientsDetailModal(props) {
    const {
        Profile,
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
        handleDetailmodal,
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
        handleSelectedPatient,
        fillPatientnotification
    } = props


    const { isDetailmodalopen } = Patients

    const t = Profile?.i18n?.t || null

    useEffect(() => {
        if (isDetailmodalopen && !Users.isLoading) {
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
        }
    }, [isDetailmodalopen])

    return (
        <Modal
            onClose={() => handleDetailmodal(false)}
            onOpen={() => handleDetailmodal(true)}
            open={isDetailmodalopen}
        >
            <Modal.Header>{Literals.Page.Pagepreparedetailheader[Profile.Language]}</Modal.Header>
            <PatientsDetailCard
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
            />
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    handleDetailmodal(false)
                    handleSelectedPatient({})
                }}>
                    {Literals.Button.Goback[Profile.Language]}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}
