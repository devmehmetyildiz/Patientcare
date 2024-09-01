import React, { useEffect } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { PatientsDetailCard } from '../../Components'
import validator from '../../Utils/Validator'
import Formatdate from '../../Utils/Formatdate'

export default function PreregistrationsDetail(props) {
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


  const { isDetailmodalopen, selected_record } = Patients
  const { Uuid } = selected_record
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

  const stocks = (Stocks.list || []).filter(u => u.Isactive).filter(u => u.WarehouseID === selected_record?.Uuid).map(element => {
    return {
      ...element,
      key: Math.random(),
      Skt: validator.isISODate(element.Skt) ? Formatdate(element.Skt) : element.Skt
    }
  });

  const files = (Files.list || []).filter(u => u.Isactive).filter(u => u.ParentID === Uuid).map(element => {
    return {
      ...element,
      key: Math.random(),
      Usagetype: ((element?.Usagetype || '').split(',') || []).map(u => {
        return (Usagetypes.list || []).find(type => type.Uuid === u)?.Name
      })
    }
  });

  return (
    <Modal
      onClose={() => handleDetailmodal(false)}
      onOpen={() => handleDetailmodal(true)}
      open={isDetailmodalopen}
    >
      <Modal.Header>{t('Pages.Preregistrations.Detail.Page.Header')}</Modal.Header>
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
        stocks={stocks}
        files={files}
      />
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleDetailmodal(false)
          handleSelectedPatient({})
        }}>
          {t('Common.Button.Goback')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
