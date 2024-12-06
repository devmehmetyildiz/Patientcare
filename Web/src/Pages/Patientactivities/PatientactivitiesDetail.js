import React, { useEffect } from 'react'
import { Button, Label, Modal, Table } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'
import { Formatfulldate } from '../../Utils/Formatdate'
import { GENDER_OPTION_MEN } from '../../Utils/Constants'

export default function PatientactivitiesDetail(props) {

  const { open, setOpen, record, setRecord, Patienttypes, Costumertypes, Professions, Profile, Patients, Patientdefines, Users } = props
  const { GetPatienttypes, GetCostumertypes, GetProfessions } = props

  const t = Profile?.i18n?.t

  const {
    Name,
    Place,
    Starttime,
    Endtime,
    Budget,
    Description,
    Participatedpatients,
    Participatedusers
  } = record || {}

  const decoratedPatients = (Participatedpatients || []).map(participate => {
    const patient = (Patients.list || []).find(patient => patient.Uuid === participate.PatientID)
    const patientdefine = (Patientdefines.list || []).find(define => define.Uuid === patient?.PatientdefineID)
    const costumertype = (Costumertypes.list || []).find(type => type.Uuid === patientdefine?.CostumertypeID)
    const patienttype = (Patienttypes.list || []).find(type => type.Uuid === patientdefine?.PatienttypeID)
    return {
      name: `${patientdefine?.Firstname} ${patientdefine?.Lastname}`,
      costumertype: costumertype?.Name || t('Common.NoDataFound'),
      patienttype: patienttype?.Name || t('Common.NoDataFound'),
      gender: patientdefine.Gender === GENDER_OPTION_MEN ? t('Option.Genderoption.Men') : t('Option.Genderoption.Women')
    }
  })

  const decoratedUsers = (Participatedusers || []).map(participate => {
    const user = (Users.list || []).find(user => user.Uuid === participate.UserID)
    const profession = (Professions.list || []).find(profession => profession.Uuid === user?.ProfessionID)
    return {
      name: `${user?.Name} ${user?.Surname}`,
      profession: profession?.Name || t('Pages.Patientactivities.Label.NoProfessionFound')
    }
  })

  useEffect(() => {
    if (open) {
      GetPatienttypes()
      GetCostumertypes()
      GetProfessions()
    }
  }, [open])

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header >{t('Pages.Patientactivities.Page.DetailHeader')}</Modal.Header>
      <Modal.Content image>
        <div className='flex justify-start items-start flex-col w-full gap-2'>
          <div className='flex  gap-4'>
            <Label
              className='!bg-[#2355a0] !text-white !ml-6'
              ribbon
              size='large'>
              <div className='flex flex-col gap-2'>
                <span>{`${t('Pages.Patientactivities.Column.Name')} : ${Name}`}</span>
              </div>
            </Label>
            <Label
              className='!bg-[#2355a0] !text-white !ml-6'
              ribbon
              size='large'>
              <div className='flex flex-col gap-2'>
                <span>{`${t('Pages.Patientactivities.Column.Starttime')} : ${Formatfulldate(Starttime, true)}`}</span>
              </div>
            </Label>
            <Label
              className='!bg-[#2355a0] !text-white !ml-6'
              ribbon
              size='large'>
              <div className='flex flex-col gap-2'>
                <span>{`${t('Pages.Patientactivities.Column.Endtime')} : ${Formatfulldate(Endtime, true)}`}</span>
              </div>
            </Label>
          </div>
          <Pagedivider />
          <div className='flex flex-col gap-2 font-bold'>
            <span>{`${t('Pages.Patientactivities.Column.Place')} : ${Place}`}</span>
            <span>{`${t('Pages.Patientactivities.Column.Budget')} : ${Budget}`}</span>
            <span>{`${t('Pages.Patientactivities.Column.Description')} : ${Description || ''}`}</span>
          </div>
          <Pagedivider />
          <div className='w-full gap-4 flex flex-col lg:flex-row justify-start items-start'>
            <div>
              <Label
                className='!bg-[#2355a0] !text-white'
                size='large'
              >
                {t('Pages.Patientactivities.Column.Participatedpatients')}
              </Label>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>{t('Pages.Patientactivities.Label.Patientname')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Pages.Patientactivities.Label.Patienttype')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Pages.Patientactivities.Label.Costumertype')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Pages.Patientactivities.Label.Gender')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(decoratedPatients || []).map((patient, index) => {
                    return <Table.Row key={index}>
                      <Table.Cell>{patient.name}</Table.Cell>
                      <Table.Cell>{patient.patienttype}</Table.Cell>
                      <Table.Cell>{patient.costumertype}</Table.Cell>
                      <Table.Cell>{patient.gender}</Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
              </Table>
            </div>
            <div>
              <Label
                className='!bg-[#2355a0] !text-white'
                size='large'
              >
                {t('Pages.Patientactivities.Column.Participatedusers')}
              </Label>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>{t('Pages.Patientactivities.Label.Username')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Pages.Patientactivities.Label.Profession')}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {(decoratedUsers || []).map((user, index) => {
                    return <Table.Row key={index}>
                      <Table.Cell>{user.name}</Table.Cell>
                      <Table.Cell>{user.profession}</Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => {
          setOpen(false)
          setRecord(null)
        }}>
          {t('Common.Button.Giveup')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
