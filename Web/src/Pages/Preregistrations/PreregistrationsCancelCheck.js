import React, { useEffect, useState } from 'react'
import validator from '../../Utils/Validator'
import { Button, Checkbox, Dropdown, Form, Modal } from 'semantic-ui-react'
import { Contentwrapper, PatientsDetailCard } from '../../Components'
import Formatdate from '../../Utils/Formatdate'
import { CASE_PATIENT_STATUS_DEATH, CASE_PATIENT_STATUS_LEFT } from '../../Utils/Constants'

export default function PreregistrationsCancelCheck(props) {

  const {
    CancelCheckPatients,
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
    fillPatientnotification,
    open,
    setOpen,
    record,
    setRecord
  } = props

  const t = Profile?.i18n?.t

  const {
    CaseID,
    Uuid,
  } = record || {}

  const [selectedcase, setSelectedcase] = useState(CaseID)
  const [selectedinfo, setSelectedinfo] = useState(null)

  useEffect(() => {
    if (open && !Users.isLoading) {
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
  }, [open])

  const stocks = (Stocks.list || []).filter(u => u.Isactive).filter(u => u.WarehouseID === record?.Uuid).map(element => {
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

  const CaseOption = (Cases.list || [])
    .filter(u => u.Isactive)
    .filter(u => u.Patientstatus !== CASE_PATIENT_STATUS_DEATH && u.Patientstatus !== CASE_PATIENT_STATUS_LEFT)
    .map(casedata => {
      const departmentuuids = (casedata?.Departmentuuids || []).map(u => u.DepartmentID);
      let isHavepatients = false
      departmentuuids.forEach(departmentuuid => {
        const department = (Departments.list || []).find(u => u.Uuid === departmentuuid)
        if (department?.Ishavepatients === true || department?.Ishavepatients === 1) {
          isHavepatients = true
        }
      });
      return isHavepatients === true && casedata?.CaseStatus === 0 ? { key: casedata.Uuid, text: casedata.Name, value: casedata.Uuid } : false
    }).filter(u => u)

  return (
    <Modal
      onClose={() => {
        setOpen(false)
        setSelectedcase(null)
        setSelectedinfo(null)
      }}
      onOpen={() => {
        setSelectedcase(null)
        setSelectedinfo(null)
        setOpen(false)
      }}
      open={open}
    >
      <Modal.Header>{t('Pages.Preregistrations.Page.Modal.CancelCheckHeader')}</Modal.Header>
      <PatientsDetailCard
        record={record}
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
      <Modal.Content>
        <Contentwrapper>
          <Form>
            <Form.Group widths={'equal'}>
              <Form.Field>
                <label
                  className='text-[#000000de]'>
                  {t('Pages.Preregistrations.Column.Case')}
                </label>
                <Dropdown
                  value={selectedcase}
                  clearable
                  search
                  fluid
                  selection
                  options={CaseOption}
                  onChange={(e, data) => { setSelectedcase(data.value) }}
                />
              </Form.Field>
              <Form.Input
                label={t('Pages.Preregistrations.Column.Info')}
                value={selectedinfo || ''}
                onChange={(e) => { setSelectedinfo(e.target.value) }}
                fluid
              />
            </Form.Group>
          </Form>
        </Contentwrapper>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          setOpen(false)
          setSelectedcase(null)
          setSelectedinfo(null)
          setRecord(null)
        }}>
          {t('Common.Button.Goback')}
        </Button>
        <Button
          content={t('Common.Button.CancelCheck')}
          labelPosition='right'
          icon='checkmark'
          className=' !bg-[#2355a0] !text-white'
          onClick={() => {
            let errors = []
            if (!validator.isUUID(selectedcase)) {
              errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.CaseRequired') })
            }
            if (errors.length > 0) {
              errors.forEach(error => {
                fillPatientnotification(error)
              })
            } else {

              const {
                Uuid
              } = record || {}

              CancelCheckPatients({
                Uuid,
                Cancelcheckinfo: selectedinfo,
                CaseID: selectedcase,
              })
              setOpen(false)
              setRecord(null)
            }
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}
