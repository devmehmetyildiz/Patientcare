import React, { useEffect, useState } from 'react'
import { Formatdate } from '..//../Utils/Formatdate'
import validator from '../../Utils/Validator'
import { Button, Checkbox, Dropdown, Feed, Form, Modal, } from 'semantic-ui-react'
import { Contentwrapper, PatientsDetailCard } from '../../Components'
import BedSelector from '../../Components/BedSelector'
import { CASE_PATIENT_STATUS_DEATH, CASE_PATIENT_STATUS_LEFT } from '../../Utils/Constants'

export default function PreregistrationsComplete(props) {
  const {
    fillPatientnotification,
    CompletePatients,
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
    Floors,
    Rooms,
    Beds,
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
    GetFloors,
    GetRooms,
    GetBeds,
    open,
    setOpen,
    record,
    setRecord
  } = props

  const {
    CaseID,
    Uuid,
    Approvaldate,
    Isoninstitution
  } = record || {}

  const [selectedcase, setSelectedcase] = useState(CaseID)
  const [selectedapprovaldate, setSelectedapprovaldate] = useState(Formatdate(Approvaldate))
  const [selectedinfo, setSelectedinfo] = useState(null)
  const [selectedbed, setSelectedbed] = useState(null)
  const [selectedIsoninstitution, setSelectedIsoninstitution] = useState(Isoninstitution)

  const t = Profile?.i18n?.t || null

  const isLoadingstatus =
    Patients.isLoading ||
    Patientdefines.isLoading ||
    Stocks.isLoading ||
    Stockdefines.isLoading ||
    Units.isLoading ||
    Cases.isLoading ||
    Departments.isLoading ||
    Stocktypes.isLoading ||
    Stocktypegroups.isLoading ||
    Users.isLoading ||
    Files.isLoading ||
    Usagetypes.isLoading ||
    Floors.isLoading ||
    Rooms.isLoading ||
    Beds.isLoading

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
      GetFloors()
      GetRooms()
      GetBeds()
    }
  }, [open])


  const Notfound = t('Common.NoDataFound')

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

  const bed = (Beds.list || []).find(u => u.Uuid === selectedbed)
  const room = (Rooms.list || []).find(u => u.Uuid === bed?.RoomID)
  const floor = (Floors.list || []).find(u => u.Uuid === room?.FloorID)


  return (
    <Modal
      onClose={() => {
        setOpen(false)
        setSelectedcase(null)
        setSelectedinfo(null)
        setSelectedIsoninstitution(false)
      }}
      onOpen={() => {
        setSelectedcase(null)
        setSelectedinfo(null)
        setSelectedIsoninstitution(false)
        setOpen(true)
      }}
      open={open}
    >
      <Modal.Header>{t('Pages.Preregistrations.Complete.Page.ModalHeader')}</Modal.Header>
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
        {!isLoadingstatus ?
          <Contentwrapper>
            <Form>
              <div className='w-full flex justify-between items-center flex-row'>
                <Feed>
                  <Feed.Event>
                    <Feed.Label icon="bed" />
                    <Feed.Content>
                      <Feed.Date content={"Seçili Yatak"} />
                      <Feed.Summary>
                        {selectedbed
                          ? `${floor?.Name} ${room?.Name} ${bed?.Name}`
                          : Notfound
                        }
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                </Feed>
                <BedSelector
                  Beds={Beds}
                  Floors={Floors}
                  Profile={Profile}
                  Rooms={Rooms}
                  selectedBed={selectedbed}
                  setSelectedBed={setSelectedbed}
                  fillNotification={fillPatientnotification}
                  Patients={Patients}
                  Patientdefines={Patientdefines}
                />
              </div>
              <Form.Group widths={'equal'}>
                <Form.Input
                  label={t('Pages.Preregistrations.Complete.Label.Approvaldate')}
                  type='date'
                  defaultValue={selectedapprovaldate}
                  onChange={(e) => {
                    setSelectedapprovaldate(e.target.value)
                  }}
                  fluid
                />
                <Form.Input
                  label={t('Pages.Preregistrations.Complete.Label.Info')}
                  value={selectedinfo || ''}
                  onChange={(e) => { setSelectedinfo(e.target.value) }}
                  fluid
                />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label
                    className='text-[#000000de]'>
                    {t('Pages.Preregistrations.Complete.Label.Case')}
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
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label
                    className='text-[#000000de]'>
                    {t('Pages.Preregistrations.Complete.Label.Isoninstitution')}
                  </label>
                  <Checkbox toggle className='m-2'
                    checked={selectedIsoninstitution}
                    onClick={() => { setSelectedIsoninstitution(prev => !prev) }}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </Contentwrapper>
          : null}
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          setOpen(false)
          setSelectedcase(null)
          setSelectedinfo(null)
          setSelectedIsoninstitution(false)
          setRecord(null)
        }}>
          {t('Common.Button.Goback')}
        </Button>
        <Button
          loading={Patients.isLoading}
          content={t('Common.Button.Complete')}
          labelPosition='right'
          icon='checkmark'
          className=' !bg-[#2355a0] !text-white'
          onClick={() => {
            let errors = []
            if (!validator.isUUID(selectedcase)) {
              errors.push({ type: 'Error', code: t('Pages.Preregistrations.Complete.Page.ModalHeader'), description: t('Pages.Preregistrations.Complete.Messages.CaseRequired') })
            }
            if (!validator.isISODate(selectedapprovaldate)) {
              errors.push({ type: 'Error', code: t('Pages.Preregistrations.Complete.Page.ModalHeader'), description: t('Pages.Preregistrations.Complete.Messages.ApprovaldateRequired') })
            }
            if (!validator.isUUID(floor?.Uuid)) {
              errors.push({ type: 'Error', code: t('Pages.Preregistrations.Complete.Page.ModalHeader'), description: t('Pages.Preregistrations.Complete.Messages.FloorRequired') })
            }
            if (!validator.isUUID(room?.Uuid)) {
              errors.push({ type: 'Error', code: t('Pages.Preregistrations.Complete.Page.ModalHeader'), description: t('Pages.Preregistrations.Complete.Messages.RoomRequired') })
            }
            if (!validator.isUUID(bed?.Uuid)) {
              errors.push({ type: 'Error', code: t('Pages.Preregistrations.Complete.Page.ModalHeader'), description: t('Pages.Preregistrations.Complete.Messages.BedRequired') })
            }
            if (errors.length > 0) {
              errors.forEach(error => {
                fillPatientnotification(error)
              })
            } else {

              const {
                Uuid
              } = record || {}

              CompletePatients({
                data: {
                  Uuid,
                  Completeinfo: selectedinfo,
                  CaseID: selectedcase,
                  Isoninstitution: selectedIsoninstitution || false,
                  Approvaldate: selectedapprovaldate,
                  FloorID: floor?.Uuid,
                  RoomID: room?.Uuid,
                  BedID: bed?.Uuid,
                  isTransferstocks: false
                },
                onSuccess: () => {
                  setOpen(false)
                  setRecord(null)
                }
              })
            }
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}


