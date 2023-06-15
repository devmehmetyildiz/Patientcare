import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'

export default class PatientdefinesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedpatienttype: "",
      selectedcostumertype: "",
      selectedMotherstatus: 0,
      selectedFatherstatus: 0,
      selectedGenderstatus: "",
      selectedFatheralaffinity: "",
      selectedMotheralaffinity: "",
    }
  }


  componentDidMount() {
    const { GetCostumertypes, GetPatienttypes } = this.props
    GetCostumertypes()
    GetPatienttypes()
  }

  componentDidUpdate() {
    const { Patientdefines, Costumertypes, removeCostumertypenotification, removePatienttypenotification, Patienttypes, removePatientdefinenotification } = this.props
    Notification(Patientdefines.notifications, removePatientdefinenotification)
    Notification(Costumertypes.notifications, removeCostumertypenotification)
    Notification(Patienttypes.notifications, removePatienttypenotification)
  }


  render() {
    const { Costumertypes, Patienttypes, Patientdefines } = this.props

    const Costumertypeoptions = Costumertypes.list.map(costumertype => {
      return { key: costumertype.Uuid, text: costumertype.Name, value: costumertype.Uuid }
    })

    const Patienttypeoptions = Patienttypes.list.map(patienttype => {
      return { key: patienttype.Uuid, text: patienttype.Name, value: patienttype.Uuid }
    })

    const Liveoptions = [
      { key: 0, text: 'HAYIR YAŞAMIYOR', value: false },
      { key: 1, text: 'EVET YAŞIYOR', value: true }
    ]
    const Genderoptions = [
      { key: 0, text: 'ERKEK', value: "ERKEK" },
      { key: 1, text: 'KADIN', value: "KADIN" }
    ]
    const Affinityoptions = [
      { key: 0, text: 'ÖZ', value: "ÖZ" },
      { key: 1, text: 'ÜVEY', value: "ÜVEY" }
    ]

    return (
      Patientdefines.isLoading || Patientdefines.isDispatching || Patienttypes.isLoading
        || Patienttypes.isDispatching || Costumertypes.isLoading || Costumertypes.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Patientdefines"}>
                  <Breadcrumb.Section >Hasta Tanımları</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <Form.Input label="Hasta Adı" placeholder="Hasta Adı" name="Firstname" fluid />
                <Form.Input label="Hasta Soyadı" placeholder="Hasta Soyadı" name="Lastname" fluid />
                <Form.Input label="Baba Adı" placeholder="Baba Adı" name="Fathername" fluid />
                <Form.Input label="Anne Adı" placeholder="Anne Adı" name="Mothername" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Anne Yakınlık Durumu</label>
                  <Dropdown placeholder='Anne Yakınlık Durumu' fluid selection options={Affinityoptions} onChange={(e, { value }) => { this.setState({ selectedMotheralaffinity: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Baba Yakınlık Durumu</label>
                  <Dropdown placeholder='Baba Yakınlık Durumu' fluid selection options={Affinityoptions} onChange={(e, { value }) => { this.setState({ selectedFatheralaffinity: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Anne Yaşıyor mu?</label>
                  <Dropdown placeholder='Anne Yaşıyor mu' fluid selection options={Liveoptions} onChange={(e, { value }) => { this.setState({ selectedMotherstatus: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Baba Yaşıyor mu?</label>
                  <Dropdown placeholder='Baba Yaşıyor mu' fluid selection options={Liveoptions} onChange={(e, { value }) => { this.setState({ selectedFatherstatus: value }) }} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="TC Kimlik No" placeholder="TC Kimlik No" name="CountryID" fluid />
                <Form.Input label="Doğum Tarihi" placeholder="Doğum Tarihi" name="Dateofbirth" type='date' fluid />
                <Form.Input label="Doğum Yeri" placeholder="Doğum Yeri" name="Placeofbirth" fluid />
                <Form.Input label="Ölüm Tarihi" placeholder="Ölüm Tarihi" name="Dateofdeath" type='date' fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Ölüm Yeri" placeholder="Ölüm Yeri" name="Placeofdeath" fluid />
                <Form.Input label="Ölüm Sebebi" placeholder="Ölüm Sebebi" name="Deathinfo" fluid />
                <Form.Field>
                  <label className='text-[#000000de]'>Cinsiyet</label>
                  <Dropdown placeholder='Cinsiyet' fluid selection options={Genderoptions} onChange={(e, { value }) => { this.setState({ selectedGenderstatus: value }) }} />
                </Form.Field>
                <Form.Input label="Kardeş Durumu" placeholder="Kardeş Durumu" name="Marialstatus" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Çocuk Sayısı" placeholder="Çocuk Sayısı" name="Childnumber" type='number' fluid />
                <Form.Input label="Engelli Çocuk Sayısı" placeholder="Engelli Çocuk Sayısı" name="Disabledchildnumber" type='number' fluid />
                <Form.Input label="Kardeş Durumu" placeholder="Kardeş Durumu" name="Siblingstatus" fluid />
                <Form.Input label="Sgk Durumu" placeholder="Sgk Durumu" name="Sgkstatus" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Maaş Durumu" placeholder="Maaş Durumu" name="Budgetstatus" fluid />
                <Form.Input label="Kayıtlı Şehir" placeholder="Kayıtlı Şehir" name="City" fluid />
                <Form.Input label="Kayıtlı İlçe" placeholder="Kayıtlı İlçe" name="Town" fluid />
                <Form.Input label="Tanımlı Adres 1" placeholder="Tanımlı Adres 1" name="Address1" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Tanımlı Adres 2" placeholder="Tanımlı Adres 2" name="Address2" fluid />
                <Form.Input label="Kayıtlı Ülke" placeholder="Kayıtlı Ülke" name="Country" fluid />
                <Form.Input label="İletişim No 1" placeholder="İletişim No 1" name="Contactnumber1" fluid />
                <Form.Input label="İletişim No 2" placeholder="İletişim No 2" name="Contactnumber2" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="İletişim Kişi 1" placeholder="İletişim Kişi 1" name="Contactname1" fluid />
                <Form.Input label="İletişim Kişi 2" placeholder="İletişim Kişi 2" name="Contactname2" fluid />
                <Form.Field>
                  <label className='text-[#000000de]'>Müşteri Türü</label>
                  <Dropdown placeholder='Müşteri Türü' fluid selection options={Costumertypeoptions} onChange={(e, { value }) => { this.setState({ selectedcostumertype: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Hasta Türü</label>
                  <Dropdown placeholder='Hasta Türü' fluid selection options={Patienttypeoptions} onChange={(e, { value }) => { this.setState({ selectedpatienttype: value }) }} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Patientdefines">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Oluştur</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddPatientdefines, history, fillPatientdefinenotification } = this.props
    const data = formToObject(e.target)
    data.PatienttypeID = this.state.selectedpatienttype
    data.CostumertypeID = this.state.selectedcostumertype
    data.Ismotheralive = this.state.selectedMotherstatus
    data.Isfatheralive = this.state.selectedFatherstatus
    data.Gender = this.state.selectedGenderstatus
    data.Motherbiologicalaffinity = this.state.selectedMotheralaffinity
    data.Fatherbiologicalaffinity = this.state.selectedFatheralaffinity

    if (!data.Dateofbirth || data.Dateofbirth === '') {
      data.Dateofbirth = null
    }
    if (!data.Dateofdeath || data.Dateofdeath === '') {
      data.Dateofdeath = null
    }
    if (!data.Childnumber || data.Childnumber === '') {
      data.Childnumber = 0
    }
    if (!data.Disabledchildnumber || data.Disabledchildnumber === '') {
      data.Disabledchildnumber = 0
    }
    data.Childnumber && (data.Childnumber = parseInt(data.Childnumber))
    data.Disabledchildnumber && (data.Disabledchildnumber = parseInt(data.Disabledchildnumber))
    data.Childnumber && (data.Childnumber = parseInt(data.Childnumber))

    let errors = []
    if (!data.Firstname || data.Firstname === '') {
      errors.push({ type: 'Error', code: 'Hasta Tanımları', description: 'İsim Boş Olamaz' })
    }
    if (!data.Lastname || data.Lastname === '') {
      errors.push({ type: 'Error', code: 'Hasta Tanımları', description: 'Soyisim Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientdefinenotification(error)
      })
    } else {
      AddPatientdefines({data, history})
    }
  }
}