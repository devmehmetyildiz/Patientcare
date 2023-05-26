import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Form, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'

export default class PeriodsEdit extends Component {
  constructor(props) {
    super(props)
    const isDatafetched = false
    this.state = {
      isDatafetched
    }
  }

  componentDidMount() {
    const { GetPeriod, match, history } = this.props
    if (match.params.PeriodID) {
      GetPeriod(match.params.PeriodID)
    } else {
      history.push("/Periods")
    }
  }


  componentDidUpdate() {
    const { removePeriodnotification, Periods } = this.props
    Notification(Periods.notifications, removePeriodnotification)
  }

  render() {

    const { Periods } = this.props
    const { selected_record, isLoading, isDispatching } = Periods

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]' >
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Periods"}>
                  <Breadcrumb.Section>Kontrol Periyodları</Breadcrumb.Section>
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
                <Form.Input defaultValue={selected_record.Name} label="Kontrol Grup Adı" placeholder="Kontrol Grup Adı" name="Name" fluid />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <Form.Input defaultValue={selected_record.Occuredtime} type='time' label="Gerçekleşme Saati" placeholder="Gerçekleşme Saati" name="Occuredtime" fluid />
                <Form.Input defaultValue={selected_record.Checktime} type='time' label="Geçikme Saati" placeholder="Geçikme Saati" name="Checktime" fluid />
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Periods">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPeriods, history, fillPeriodnotification, Periods } = this.props
    const data = formToObject(e.target)
    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'İsim Boş Olamaz' })
    }
    if (!data.Occuredtime || data.Occuredtime === '') {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'Gerçekleşme tarihi seçilmedi' })
    }
    if (!data.Checktime || data.Checktime === '') {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'Geçikme tarihi seçilmedi' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPeriodnotification(error)
      })
    } else {
      EditPeriods({ ...Periods.selected_record, ...data }, history)
    }

  }
}
