import React, { useEffect, useState } from 'react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { Button, Checkbox, Dropdown, Form, Modal } from 'semantic-ui-react'
import { Contentwrapper, PatientsDetailCard } from '../../Components'

export default function PreregistrationsCheck(props) {
  const {
    handleCheckmodal,
    CheckPatients,
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
    handleSelectedPatient,
    fillPatientnotification
  } = props

  const { isCheckmodalopen, selected_record, isCheckdeactive } = Patients

  const {
    CaseID,
    Isoninstitution
  } = selected_record

  const Isdeactive = isCheckdeactive
  const [selectedcase, setSelectedcase] = useState(CaseID)
  const [selectedinfo, setSelectedinfo] = useState(null)
  const [selectedIsoninstitution, setSelectedIsoninstitution] = useState(Isoninstitution)

  useEffect(() => {
    if (isCheckmodalopen && !Users.isLoading) {
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
  }, [isCheckmodalopen])

  const CaseOption = (Cases.list || []).filter(u => u.Isactive).map(casedata => {
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
        handleCheckmodal(false)
        setSelectedcase(null)
        setSelectedinfo(null)
        setSelectedIsoninstitution(false)
      }}
      onOpen={() => {
        setSelectedcase(null)
        setSelectedinfo(null)
        setSelectedIsoninstitution(false)
        handleCheckmodal({ modal: true, deactive: Isdeactive ? Isdeactive : false })
      }}
      open={isCheckmodalopen}
    >
      <Modal.Header>{Isdeactive ? Literals.Page.Pagecheckedcancelheadermodal[Profile.Language] : Literals.Page.Pagecheckedheadermodal[Profile.Language]}</Modal.Header>
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
      <Modal.Content>
        <Contentwrapper>
          <Form>
            <Form.Group widths={'equal'}>
              <Form.Field>
                <label
                  className='text-[#000000de]'>
                  {Literals.Columns.Case[Profile.Language]}
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
                label={Literals.Columns.Info[Profile.Language]}
                value={selectedinfo || ''}
                onChange={(e) => { setSelectedinfo(e.target.value) }}
                fluid
              />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <Form.Field>
                <label
                  className='text-[#000000de]'>
                  {Literals.Columns.Isoninstitution[Profile.Language]}
                </label>
                <Checkbox toggle className='m-2'
                  checked={selectedIsoninstitution}
                  onClick={() => { setSelectedIsoninstitution(prev => !prev) }}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Contentwrapper>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          handleCheckmodal(false)
          setSelectedcase(null)
          setSelectedinfo(null)
          setSelectedIsoninstitution(false)
          handleSelectedPatient({})
        }}>
          {Literals.Button.Goback[Profile.Language]}
        </Button>
        {Isdeactive
          ? <Button
            content={Literals.Button.Cancelcheck[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            className=' !bg-[#2355a0] !text-white'
            onClick={() => {
              let errors = []
              if (!validator.isUUID(selectedcase)) {
                errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CaseRequired[Profile.Language] })
              }
              if (errors.length > 0) {
                errors.forEach(error => {
                  fillPatientnotification(error)
                })
              } else {
                const {
                  Uuid
                } = selected_record
                CancelCheckPatients({
                  Uuid,
                  Cancelcheckinfo: selectedinfo,
                  CaseID: selectedcase,
                  Isoninstitution: selectedIsoninstitution
                })
                handleCheckmodal(false)
                handleSelectedPatient({})
              }
            }}
            positive
          />
          : <Button
            content={Literals.Button.Check[Profile.Language]}
            labelPosition='right'
            icon='checkmark'
            className=' !bg-[#2355a0] !text-white'
            onClick={() => {
              let errors = []
              if (!validator.isUUID(selectedcase)) {
                errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CaseRequired[Profile.Language] })
              }
              if (errors.length > 0) {
                errors.forEach(error => {
                  fillPatientnotification(error)
                })
              } else {
                const {
                  Uuid
                } = selected_record
                CheckPatients({
                  Uuid,
                  Checkinfo: selectedinfo,
                  CaseID: selectedcase,
                  Isoninstitution: selectedIsoninstitution
                })
                handleCheckmodal(false)
                handleSelectedPatient({})
              }
            }}
            positive
          />
        }
      </Modal.Actions>
    </Modal>
  )
}
