import React from 'react'
import { Card, Icon, Label } from 'semantic-ui-react';

export default function PatientsDetailCard(props) {

  const { patient, Floors, Rooms, Beds, Patientcashmovements, Patientcashregisters, Profile } = props

  const t = Profile?.i18n?.t

  let patientCash = 0.0;
  let patientCashdetail = [];

  (Patientcashmovements.list || []).filter(u => u.PatientID === patient?.Uuid && u.Isactive).forEach(cash => {
    patientCash += cash.Movementtype * cash.Movementvalue
    let registername = (Patientcashregisters.list || []).find(u => u.Uuid === cash.RegisterID)?.Name || t('Common.NoDataFound')
    patientCashdetail.push({ label: registername, value: cash.Movementtype * cash.Movementvalue, key: cash.RegisterID })
  })
  const [integerPart, decimalPart] = patientCash.toFixed(2).split('.')

  const bed = (Beds.list || []).find(u => u?.Uuid === patient?.BedID)?.Name
  const room = (Rooms.list || []).find(u => u?.Uuid === patient?.RoomID)?.Name
  const floor = (Floors.list || []).find(u => u?.Uuid === patient?.FloorID)?.Name

  const patientplace = (bed || room || floor) ? `${floor} ${room} ${bed}` : t('Common.NoDataFound')

  return (
    <div className='px-4 mt-1 gap-4 relative w-full font-poppins flex flex-row flex-wrap justify-between items-start  '>
      <Card className='!m-0 xm:!w-auto !min-w-250 !border-none !shadow-lg'>
        <Card.Content>
          <div className='flex flex-col justify-center items-center'>
            <Icon className='text-[#2355a0]' name='money' size='big' />
            <div className='font-bold font-poppins text-xl'>
              {t('Pages.Patients.PatientsDetail.PatientDetailCard.Cash')}
            </div>
            <div className='font-poppins text-lg'>
              {integerPart}.{decimalPart}₺
            </div>
          </div>
        </Card.Content>
      </Card>
      <Card className='!m-0 xm:!w-auto !min-w-250 !border-none !shadow-lg'>
        <Card.Content>
          <div className='flex flex-col justify-center items-center'>
            <Icon className='text-[#2355a0]' name='sort amount up' size='big' />
            <div className='font-bold font-poppins text-xl'>
              {t('Pages.Patients.PatientsDetail.PatientDetailCard.Income')}
            </div>
            <div className='font-poppins text-lg'>
              0.00₺
            </div>
          </div>
        </Card.Content>
      </Card>
      <Card className='!m-0 xm:!w-auto !min-w-250 !border-none !shadow-lg'>
        <Card.Content>
          <div className='flex flex-col justify-center items-center'>
            <Icon className='text-[#2355a0]' name='bed' size='big' />
            <div className='font-bold font-poppins text-xl'>
              {t('Pages.Patients.PatientsDetail.PatientDetailCard.Place')}
            </div>
            <div className=' w-full  font-poppins text-lg'>
              <span className='overflow-hidden block text-ellipsis whitespace-nowrap'>{patientplace}asdasdsa</span>
            </div>
          </div>
        </Card.Content>
      </Card>
      <Card className='!m-0 xm:!w-auto !min-w-250 !border-none !shadow-lg'>
        <Card.Content>
          <div className='flex flex-col justify-center items-center'>
            <Icon className='text-[#2355a0]' name='map' size='big' />
            <div className='font-bold font-poppins text-xl'>
              {t('Pages.Patients.PatientsDetail.PatientDetailCard.Supportplan')}
            </div>
            <div className='font-poppins text-lg'>
              {t('Common.NoDataFound')}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
