import React, { useEffect } from 'react'
import { Formatdate } from '..//../Utils/Formatdate'
import validator from '../../Utils/Validator'
import { Button, Modal } from 'semantic-ui-react'
import { PurchaseorderDetailCard } from '../../Components'

export default function PurchaseordersDetail(props) {
  const {
    Profile,
    Purchaseorders,
    handleDetailmodal,
    handleSelectedPurchaseorder,
    fillPurchaseordernotification,
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
    Departments
  } = props

  const t = Profile?.i18n?.t

  const { isDetailmodalopen, selected_record } = Purchaseorders

  const {
    Uuid,
  } = selected_record

  useEffect(() => {
    if (isDetailmodalopen && !Users.isLoading) {
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
    }
  }, [isDetailmodalopen])


  const stocks = (Stocks.list || []).filter(u => u.WarehouseID === selected_record?.Uuid).map(element => {
    return {
      ...element,
      key: Math.random(),
      Skt: validator.isISODate(element.Skt) ? Formatdate(element.Skt) : element.Skt
    }
  });
  const files = (Files.list || []).filter(u => u.ParentID === Uuid).map(element => {
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
      <Modal.Header>{t('Pages.Purchaseorder.Page.DetailHeaderModal')}</Modal.Header>
      <PurchaseorderDetailCard
        Purchaseorders={Purchaseorders}
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
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleDetailmodal(false)
          handleSelectedPurchaseorder({})
        }}>
          {t('Common.Button.Goback')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
