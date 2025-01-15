import React, { useEffect } from 'react'
import { Button, Dimmer, DimmerDimmable, Label, Loader, Modal, Table } from 'semantic-ui-react'
import Formatdate, { Getdateoptions, Getshiftlastdate } from '../../Utils/Formatdate'
import PersonelshiftsPrepareShifts from '../../Containers/Personelshifts/PersonelshiftsPrepareShifts'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import validator from '../../Utils/Validator'
import { Pagedivider } from '../../Components'

export default function PersonelshiftsDetail(props) {

  const { open, setOpen, record, setRecord, Personelshifts, Profile, GetPersonelshift, GetUsers, GetFloors, GetProfessions, GetShiftdefines, Shiftdefines, Floors, Users, Professions } = props

  const t = Profile?.i18n?.t

  const { selected_record } = Personelshifts
  const isLoading = Professions.isLoading || Personelshifts.isLoading || Floors.isLoading || Users.isLoading || Shiftdefines.isLoading

  const {
    Startdate,
    Personelshiftdetails,
    ProfessionID
  } = selected_record

  const selectedStartdate = new Date(Startdate);

  const startDay = new Date(selectedStartdate).getDate()
  const lastDay = Getshiftlastdate(selectedStartdate)

  const selectedProfession = (Professions.list || []).find(u => u.Uuid === ProfessionID)

  const professionFloors = ((selectedProfession?.Floors || '').split(',') || []).map(flooruuid => {
    return (Floors.list || []).find(u => u?.Uuid === flooruuid)
  }).filter(u => u)

  const professionUsers = (Users.list || []).filter(u => u.Includeshift && u.Isactive && u.ProfessionID === ProfessionID && u.Isworker && u.Isworking)

  const isGeneralshift = (professionFloors || []).length <= 0;

  const getSelectedShiftDate = (value) => {
    const dates = Getdateoptions()
    if (dates.find(u => Formatdate(u.value) === Formatdate(value))) {
      return `${dates.find(u => Formatdate(u.value) === Formatdate(value))?.text}      ( ${Formatdate(value, true)} )`
    }
    return value
  }

  useEffect(() => {
    if (open && validator.isUUID(record?.Uuid)) {
      GetPersonelshift(record?.Uuid || '')
      GetFloors()
      GetUsers()
      GetProfessions()
      GetShiftdefines()
    }
  }, [open])

  return (
    <DimmerDimmable blurring >
      <Modal
        size='large'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header >{t('Pages.Personelshifts.Page.DetailHeader')}</Modal.Header>
        <Modal.Content image>
          <Dimmer inverted active={isLoading}>
            <Loader inverted active />
          </Dimmer>
          <div className='w-full flex flex-col justify-start items-start'>
            <div className='w-full flex flex-row justify-start items-start gap-4'>
              <Label className='!bg-[#2355a0] !text-white' size='large'>
                {getSelectedShiftDate(Startdate)}
              </Label>
              <Label className='!bg-[#2355a0] !text-white' size='large'>
                {selectedProfession?.Name || t('Common.NoDataFound')}
              </Label>
            </div>
            <Pagedivider />
            <DndProvider backend={HTML5Backend}>
              <PersonelshiftsPrepareShifts
                readOnly
                personelshifts={Personelshiftdetails}
                setPersonelshifts={() => { }}
                Startdate={selectedStartdate}
                startDay={startDay}
                lastDay={lastDay}
                selectedProfession={ProfessionID}
                professionFloors={professionFloors}
                professionUsers={professionUsers}
                isGeneralshift={isGeneralshift}
                Profile={Profile}
              />
            </DndProvider>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            setOpen(false)
            setRecord(null)
          }}>
            {t('Common.Button.Close')}
          </Button>
        </Modal.Actions>
      </Modal>
    </DimmerDimmable>
  )
}
