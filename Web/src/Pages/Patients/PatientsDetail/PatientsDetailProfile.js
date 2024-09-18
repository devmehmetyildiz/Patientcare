import React from 'react'
import config from '../../../Config'
import { ROUTES } from '../../../Utils/Constants'
import { Button, Header, Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import Formatdate from '../../../Utils/Formatdate'

export default function PatientsDetailProfile(props) {

  const { patient, patientdefine, Files, Usagetypes, Profile } = props

  const history = useHistory()
  const t = Profile?.i18n?.t

  const usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
  const files = (Files.list || []).find(u => u.ParentID === patient?.Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)

  const patientname = `${patientdefine?.Firstname} ${patientdefine?.Lastname}` || t('Common.NoDataFound')
  const Approvaldate = patient?.Approvaldate ? Formatdate(patient?.Approvaldate, true) : t('Common.NoDataFound')
  const Happensdate = patient?.Happensdate ? Formatdate(patient?.Happensdate, true) : t('Common.NoDataFound')

  return (
    <div className='relative bg-white shadow-lg w-full  rounded-lg flex flex-col justify-center items-center  p-4 m-4 mt-0 min-w-[250px]'>
      {files
        ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${files?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
        : <Header className='!m-0 !p-0' as='h2' icon textAlign='center'><Icon name='users' circular /></Header>
      }
      <div className='mt-4 !text-[#2355a0] text-2xl font-extrabold' >{patientname}</div>
      <Header className='!m-0 !p-0 !mt-1 !text-[#bebebe]' as='h4'>{`${t('Pages.Patients.PatientsDetail.PatientDetailProfile.Approvaldate')}${Approvaldate}`}</Header>
      <Header className='!m-0 !p-0 !mt-1 !text-[#bebebe]' as='h4'>{`${t('Pages.Patients.PatientsDetail.PatientDetailProfile.Happensdate')}${Happensdate}`}</Header>
      <div className='mt-4'>
        <Button
          className='!bg-[#2355a0] !text-white !mt-8 mb-4'
          fluid
          onClick={() => { history.push(`/Patientdefines/${patientdefine?.Uuid}/edit`, { redirectUrl: "/Patients/" + patient?.Uuid }) }}>
          {t('Pages.Patients.PatientsDetail.PatientDetailProfile.DefineUpdate')}
        </Button>
      </div>
      <div
        onClick={() => { history.length > 1 ? history.goBack() : history.push(`/Patients`) }}
        className='absolute left-0 top-0 p-2 rotate-180 cursor-pointer'
      >
        <Icon className='!text-[#2355a0]' size='large' name='sign-out alternate' />
      </div>
    </div>
  )
}
