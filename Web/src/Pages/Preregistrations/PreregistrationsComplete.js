import React, {  useEffect, useState } from 'react'
import { Icon, Button, Modal,  Label, Dropdown, Grid, Input,  Divider, GridColumn } from 'semantic-ui-react'

export default function PreregistrationsComplete({ Warehouseslist, data, history, CompletePrepatients, removePatientnotification, fillPatientnotification }) {

  const [opened, setOpened] = useState(false)
  const [enable, setEnable] = useState(true)
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState([])
  const [room, setRoom] = useState(0)
  const [warehouse, setWarehouse] = useState("")
  const [floor, setFloor] = useState(0)
  const [bed, setBed] = useState(0)

  const Warehouseoptions = Warehouseslist.map(warehouse => {
    return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
  })


  useEffect(() => {
    if (opened) {
      const willCheckfiles = [
        'ilk görüşme formu',
        'engelli teslim etme-alma formu',
        'ilk kabul formu',
        'engelli mülkiyeti teslim alma formu',
        'genel vücut kontrol formu',
      ]
      let notificationErrors = []
      let notificationSuccess = []
      willCheckfiles.forEach(filestypes => {
        let foundedFile = data.Files.find(u => u.Usagetype === filestypes)
        if (!foundedFile) {
          notificationErrors.push({ type: 'Error', code: 'Dosya Bulunamadı', description: `${filestypes} bulunamadı` })
        } else {
          notificationSuccess.push({ type: 'Success', code: 'Dosya Bulundu', description: `${filestypes} Bulundu` })
        }
      })
      if (notificationErrors.length > 0) {
      //  setEnable(false)
        setErrors(notificationErrors)
        notificationErrors.forEach(error => {
          fillPatientnotification(error)
        });
      }
      if (notificationSuccess.length > 0) {
        setSuccess(notificationSuccess)
      }
    }
  }, [opened])

  const saveChanges = () => {
    let responsedata = { ...data }
    responsedata.Roomnumber = parseInt(room)
    responsedata.Floornumber = parseInt(floor)
    responsedata.Bednumber = parseInt(bed)
    responsedata.WarehouseID = warehouse
    delete responsedata.actions
    delete responsedata.enter
    if (enable) {
      CompletePrepatients(responsedata, history, "/Preregistrations")
    } else {
      fillPatientnotification({ type: 'Error', code: 'Kaydetme Hatası', description: `Dosyalar Eksik` })
    }
  }

  return <React.Fragment>
    <div onClick={() => { setOpened(true) }} className='cursor-pointer'><Icon color='black' className='row-edit' name='arrow circle right' /></div>
    <Modal
      open={opened}
      size={'small'}
      centered={true}>
      <Modal.Header><Icon name='columns' /> Hastayı Kuruma Kabul Et</Modal.Header>
      <Modal.Content >
        <Grid className='mt-4' columns={1} >
          <Grid.Column className='gap-4'>

            <div className='w-full flex justify-center items-center'>
              <Label className='!mb-4' size='big'>{`${data.Patientdefine?.Firstname} ${data.Patientdefine?.Lastname} - 
            ${data.Patientdefine?.CountryID} - ${data.Patientdefine?.Costumertype?.Name} - ${data.Patientdefine?.Patienttype?.Name}`}</Label>
            </div>
            <div className='flex flex-col justify-start items-start '>
              <Label className='!m-2' color='grey'>Gerekli Dosyalar</Label>
              <Divider className='w-full  h-[1px]' />
              {errors.length > 0 && errors.map(error => {
                return <Label className='!m-2' color='red'>{error.description}</Label>
              })}
              {success.length > 0 && success.map(succes => {
                return <Label className='!m-2' color='green'>{succes.description}</Label>
              })}
            </div>
          </Grid.Column>
          <Divider className='w-full  h-[1px]' />
          <Grid.Column >
            <label className='text-[#000000de] my-2'>Ürünlerin Teslim Edileceği Ambar</label>
            <Dropdown value={warehouse} placeholder='Ambar' fluid selection options={Warehouseoptions} onChange={(e, { value }) => { setWarehouse(value) }} />
          </Grid.Column>
          <Grid.Column >
            <Grid columns={3}>
              <GridColumn>
                <label className='text-[#000000de] my-2'>Kat Numarası</label>
                <Input onChange={(e) => { setFloor(e.target.value) }} fluid placeholder='Kat Numarası' type='number' />
              </GridColumn>
              <GridColumn>
                <label className='text-[#000000de] my-2'>Oda Numarası</label>
                <Input onChange={(e) => { setRoom(e.target.value) }} fluid placeholder='Oda Numarası' type='number'/>
              </GridColumn>
              <GridColumn>
                <label className='text-[#000000de] my-2'>Yatak Numarası</label>
                <Input onChange={(e) => { setBed(e.target.value) }} fluid placeholder='Yatak Numarası' type='number'/>
              </GridColumn>
            </Grid>
          </Grid.Column>
          <Divider className='w-full h-[1px]' />
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button type='button' negative onClick={() => setOpened(false)}>Vazgeç</Button>
        <Button disabled={!enable} floated='right' type='submit' positive onClick={() => saveChanges()}>Kaydet</Button>
      </Modal.Actions>
    </Modal>
  </React.Fragment>
}


