import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class CheckperiodsCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedPeriods: [],
      selectedDays: [],
      selectedType: null
    }
  }


  componentDidMount() {
    const { GetPeriods } = this.props
    GetPeriods()
  }

  componentDidUpdate() {
    const { Periods, Checkperiods, removeCheckperiodnotification, removePeriodnotification } = this.props
    Notification(Periods.notifications, removePeriodnotification)
    Notification(Checkperiods.notifications, removeCheckperiodnotification)
  }

  render() {
    const { Checkperiods, Periods } = this.props

    const Periodoptions = Periods.list.map(period => {
      return { key: period.Uuid, text: period.Name, value: period.Uuid }
    })

    const Days = [
      "PAZARTESİ",
      "SALI",
      "ÇARŞAMBA",
      "PERŞEMBE",
      "CUMA",
      "CUMARTESİ",
      "PAZAR"
    ]
    const Dayoptions = Days.map(day => {
      return { key: day, text: day, value: day }
    })

    const Periodtypeoption = [
      { key: "1", text: "Sürekli Kontrol", value: "1" },
    ]

    return (
      Checkperiods.isLoading || Checkperiods.isDispatching || Periods.isLoading || Periods.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Checkperiods"}>
                  <Breadcrumb.Section >Kontrol Grupları</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Field>
                <Form.Input label="Kontrol Grup Adı" placeholder="Kontrol Grup Adı" name="Name" fluid />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <Form.Field>
                  <label className='text-[#000000de]'>Kullanılacak Günler</label>
                  <Dropdown placeholder='Kullanılacak Günler' clearable search fluid multiple selection options={Dayoptions} onChange={(e, { value }) => { this.setState({ selectedDays: value }) }} />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Kontrol Türü</label>
                  <Dropdown placeholder='Kontrol Türü' clearable search fluid selection options={Periodtypeoption} onChange={(e, { value }) => { this.setState({ selectedType: value }) }} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={"equal"}>
                <Form.Field>
                  <label className='text-[#000000de]'>Kontroller</label>
                  <Dropdown placeholder='Kontroller' clearable search fluid multiple selection options={Periodoptions} onChange={(e, { value }) => { this.setState({ selectedPeriods: value }) }} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Checkperiods">
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

    const { AddCheckperiods, history, fillCheckperiodnotification, Periods } = this.props
    const { list } = Periods
    const { selectedDays, selectedPeriods, selectedType } = this.state
    const data = formToObject(e.target)
    data.Periods = selectedPeriods.map(station => {
      return list.find(u => u.Uuid === station)
    })
    var days = selectedDays.map((day) => {
      return day;
    }).join(", ")
    data.Occureddays = days
    data.Periodtype = parseInt(selectedType);

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'İsim Boş Olamaz' })
    }
    if (!data.Periods || data.Periods.length <= 0) {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'Hiç Bir Kontrol seçili değil' })
    }
    if (!data.Occureddays || data.Occureddays === "") {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'Hiç Bir Gün seçili değil' })
    }
    if (!selectedType || selectedType === "") {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'Hiç Bir Kontrol tipi seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCheckperiodnotification(error)
      })
    } else {
      AddCheckperiods(data, history)
    }
  }

  handleChange = (e, { value }) => {
    this.setState({ selectedstations: value })
  }
}