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
      return { key: costumertype.concurrencyStamp, text: costumertype.name, value: costumertype.concurrencyStamp }
    })

    const Patienttypeoptions = Patienttypes.list.map(patienttype => {
      return { key: patienttype.concurrencyStamp, text: patienttype.name, value: patienttype.concurrencyStamp }
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
                <Form.Input label="Hasta Adı" placeholder="Hasta Adı" name="firstname" fluid />
                <Form.Input label="Hasta Soyadı" placeholder="Hasta Soyadı" name="lastname" fluid />
                <Form.Input label="Baba Adı" placeholder="Baba Adı" name="fathername" fluid />
                <Form.Input label="Anne Adı" placeholder="Anne Adı" name="mothername" fluid />
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
                <Form.Input label="TC Kimlik No" placeholder="TC Kimlik No" name="countryID" fluid />
                <Form.Input label="Doğum Tarihi" placeholder="Doğum Tarihi" name="dateofbirth" type='date' fluid />
                <Form.Input label="Doğum Yeri" placeholder="Doğum Yeri" name="placeofbirth" fluid />
                <Form.Input label="Ölüm Tarihi" placeholder="Ölüm Tarihi" name="dateofdeath" type='date' fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Ölüm Yeri" placeholder="Ölüm Yeri" name="placeofdeath" fluid />
                <Form.Input label="Ölüm Sebebi" placeholder="Ölüm Sebebi" name="deathinfo" fluid />
                <Form.Field>
                  <label className='text-[#000000de]'>Cinsiyet</label>
                  <Dropdown placeholder='Cinsiyet' fluid selection options={Genderoptions} onChange={(e, { value }) => { this.setState({ selectedGenderstatus: value }) }} />
                </Form.Field>
                <Form.Input label="Kardeş Durumu" placeholder="Kardeş Durumu" name="marialstatus" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Çocuk Sayısı" placeholder="Çocuk Sayısı" name="childnumber" type='number' fluid />
                <Form.Input label="Engelli Çocuk Sayısı" placeholder="Engelli Çocuk Sayısı" name="disabledchildnumber" type='number' fluid />
                <Form.Input label="Kardeş Durumu" placeholder="Kardeş Durumu" name="siblingstatus" fluid />
                <Form.Input label="Sgk Durumu" placeholder="Sgk Durumu" name="sgkstatus" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Maaş Durumu" placeholder="Maaş Durumu" name="budgetstatus" fluid />
                <Form.Input label="Kayıtlı Şehir" placeholder="Kayıtlı Şehir" name="city" fluid />
                <Form.Input label="Kayıtlı İlçe" placeholder="Kayıtlı İlçe" name="town" fluid />
                <Form.Input label="Tanımlı Adres 1" placeholder="Tanımlı Adres 1" name="address1" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Tanımlı Adres 2" placeholder="Tanımlı Adres 2" name="address2" fluid />
                <Form.Input label="Kayıtlı Ülke" placeholder="Kayıtlı Ülke" name="country" fluid />
                <Form.Input label="İletişim No 1" placeholder="İletişim No 1" name="contactnumber1" fluid />
                <Form.Input label="İletişim No 2" placeholder="İletişim No 2" name="contactnumber2" fluid />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="İletişim Kişi 1" placeholder="İletişim Kişi 1" name="contactname1" fluid />
                <Form.Input label="İletişim Kişi 2" placeholder="İletişim Kişi 2" name="contactname2" fluid />
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
    data.patienttypeid = this.state.selectedpatienttype
    data.costumertypeid = this.state.selectedcostumertype
    data.ismotheralive = this.state.selectedMotherstatus
    data.isfatheralive = this.state.selectedFatherstatus
    data.gender = this.state.selectedGenderstatus
    data.motherbiologicalaffinity = this.state.selectedMotheralaffinity
    data.fatherbiologicalaffinity = this.state.selectedFatheralaffinity
    data.costumertype = {}
    data.patienttype = {}
    data.id = 0
    data.concurrencyStamp = null
    data.createdUser = null
    data.updatedUser = null
    data.deleteUser = null
    data.createTime = null
    data.updateTime = null
    data.deleteTime = null
    data.isActive = true



    if (!data.dateofbirth || data.dateofbirth === '') {
      data.dateofbirth = null
    }
    if (!data.dateofdeath || data.dateofdeath === '') {
      data.dateofdeath = null
    }
    if (!data.childnumber || data.childnumber === '') {
      data.childnumber = 0
    }
    if (!data.disabledchildnumber || data.disabledchildnumber === '') {
      data.disabledchildnumber = 0
    }

    let errors = []
    if (!data.firstname || data.firstname === '') {
      errors.push({ type: 'Error', code: 'Hasta Tanımları', description: 'İsim Boş Olamaz' })
    }
    if (!data.lastname || data.lastname === '') {
      errors.push({ type: 'Error', code: 'Hasta Tanımları', description: 'Soyisim Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientdefinenotification(error)
      })
    } else {
      AddPatientdefines(data, history)
    }
  }
}