import React from 'react'
import { DEPENDENCY_OPTION_FULLY, DEPENDENCY_OPTION_NON, DEPENDENCY_OPTION_PARTIAL, GENDER_OPTION } from '../../../Utils/Constants'
import { Header } from 'semantic-ui-react'
import Formatdate from '../../../Utils/Formatdate'
import { Pagedivider } from '../../../Components'

export default function PatientsDetailInfo(props) {

  const { patient, patientdefine, Costumertypes, Patienttypes, Profile } = props

  const t = Profile?.i18n?.t

  const PatienttypeName = (Patienttypes.list || []).find(u => u.Uuid === patientdefine?.PatienttypeID)?.Name || t('Common.NoDataFound')
  const CostumertypeName = (Costumertypes.list || []).find(u => u.Uuid === patientdefine?.CostumertypeID)?.Name || t('Common.NoDataFound')

  const getAge = (dateOfBirth, dateToCalculate) => {
    const dob = new Date(dateOfBirth).getTime();
    const dateToCompare = new Date(dateToCalculate).getTime();
    const age = (dateToCompare - dob) / (365 * 24 * 60 * 60 * 1000);
    return Math.floor(age);
  };


  const Dependencyoptions = [
    { key: 0, text: t('Option.Dependencyoption.Fully'), value: DEPENDENCY_OPTION_FULLY },
    { key: 1, text: t('Option.Dependencyoption.Partial'), value: DEPENDENCY_OPTION_PARTIAL },
    { key: 2, text: t('Option.Dependencyoption.Non'), value: DEPENDENCY_OPTION_NON }
  ]


  const Age = patientdefine?.Placeofbirth ? getAge(patientdefine?.Dateofbirth, new Date()) : t('Common.NoDataFound')
  const Gender = GENDER_OPTION.find(u => u.value === patientdefine?.Gender)?.text[Profile?.Language] || t('Common.NoDataFound')
  const Dependency = Dependencyoptions.find(u => u.value === patientdefine?.Dependency)?.text || t('Common.NoDataFound')
  const Fathername = patientdefine?.Fathername || t('Common.NoDataFound')
  const CountryID = patientdefine?.CountryID || t('Common.NoDataFound')
  const Dateofbirth = patientdefine?.Dateofbirth ? Formatdate(patientdefine?.Dateofbirth, true) : t('Common.NoDataFound')
  const Placeofbirth = patientdefine?.Placeofbirth || t('Common.NoDataFound')
  const Sgkstatus = patientdefine?.Sgkstatus || t('Common.NoDataFound')
  const Contact1 = `${patientdefine?.Contactnumber1 || ''} ${patientdefine?.Contactname1 || ''}`
  const Contact2 = `${patientdefine?.Contactnumber2 || ''} ${patientdefine?.Contactname2 || ''}`

  const Info = patient?.Info || ''
  const Guardiannote = patient?.Guardiannote || ''

  const Columns = [
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Age'), value: Age },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Gender'), value: Gender },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Fathername'), value: Fathername },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.CountryID'), value: CountryID },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Dateofbirth'), value: Dateofbirth },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Dependency'), value: Dependency },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Placeofbirth'), value: Placeofbirth },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Patienttype'), value: PatienttypeName },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Costumertype'), value: CostumertypeName },
    { label: t('Pages.Patients.PatientsDetail.PatientDetailInfo.Sgkstatus'), value: Sgkstatus },
  ]

  return (
    <div className='bg-white shadow-lg w-full rounded-lg flex flex-col gap-4 justify-center items-center  p-4 m-4 mt-0 min-w-[250px]'>
      <div className='w-full flex justify-start items-start'>
        <div className='font-bold text-xl '> {t('Pages.Patients.PatientsDetail.PatientDetailInfo.Header')}</div>
      </div>
      {Columns.map((item, index) => {
        return <div key={index} className='w-full flex justify-start items-center gap-2'>
          <div className='w-48 text-left font-bold'>
            {`${item.label}:`}
          </div>
          <div className='w-full text-left font-semibold text-[#777777dd]'>
            {item.value}
          </div>
        </div>
      })}
      <Pagedivider />
      <div className='w-full flex justify-start items-start gap-2'>
        <div className='font-bold'>
          {`${t('Pages.Patients.PatientsDetail.PatientDetailInfo.Contact1')}:`}
        </div>
        <div className=' font-semibold text-[#777777dd]'>
          {Contact1}
        </div>
      </div>
      <div className='w-full flex justify-start items-start gap-2'>
        <div className='font-bold'>
          {`${t('Pages.Patients.PatientsDetail.PatientDetailInfo.Contact2')}:`}
        </div>
        <div className=' font-semibold text-[#777777dd]'>
          {Contact2}
        </div>
      </div>
      <div className='w-full flex justify-start items-start gap-2'>
        <div className='font-bold'>
          {`${t('Pages.Patients.PatientsDetail.PatientDetailInfo.Info')}:`}
        </div>
        <div className=' font-semibold text-[#777777dd]'>
          {Info}
        </div>
      </div>
      <div className='w-full flex justify-start items-start gap-2'>
        <div className='font-bold'>
          {`${t('Pages.Patients.PatientsDetail.PatientDetailInfo.Guardiannote')}:`}
        </div>
        <div className=' font-semibold text-[#777777dd]'>
          {Guardiannote}
        </div>
      </div>
    </div>
  )
}
