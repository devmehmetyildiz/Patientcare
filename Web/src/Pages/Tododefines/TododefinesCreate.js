
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class TododefinesCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRequired: false,
      isNeedactivation: false,
      selectedPeriods: []
    }
  }

  componentDidMount() {
    const { GetPeriods } = this.props
    GetPeriods()
  }

  componentDidUpdate() {
    const { Tododefines, removeTododefinenotification, Periods, removePeriodnotification } = this.props
    Notification(Tododefines.notifications, removeTododefinenotification)
    Notification(Periods.notifications, removePeriodnotification)
  }

  render() {

    const { Tododefines, Periods } = this.props
    const { isLoading, isDispatching } = Tododefines

    const Periodsoptions = Periods.list.map(period => {
      return { key: period.Uuid, text: period.Name, value: period.Uuid }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Tododefines"}>
                  <Breadcrumb.Section>Yapılacaklar</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Yapılacak İş</label>
                  <Form.Input placeholder="Yapılacak İş" name="Name" fluid />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Açıklama</label>
                  <Form.Input placeholder="Açıklama" name="Info" fluid />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Kontroller</label>
                  <Dropdown label="Kontroller" placeholder='Kontroller' clearable search fluid multiple selection options={Periodsoptions} onChange={(e, { value }) => { this.setState({ selectedPeriods: value }) }} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <Checkbox toggle className='m-2'
                    onClick={(e) => { this.setState({ isRequired: !this.state.isRequired }) }}
                    label="Zorunlu alan mı?" />
                </Form.Field>
                <Form.Field>
                  <Checkbox toggle className='m-2'
                    onChange={(e) => {
                      this.setState({ isNeedactivation: !this.state.isNeedactivation })
                    }}
                    label="Onay Gerekir mi?" />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Tododefines">
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

    const { AddTododefines, history, fillTododefinenotification, Periods } = this.props

    const data = formToObject(e.target)
    data.Periods = this.state.selectedPeriods.map(period => {
      return Periods.list.find(u => u.Uuid === period)
    })
    data.IsRequired = this.state.isRequired
    data.IsNeedactivation = this.state.isNeedactivation

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Yapılacaklar', description: 'İsim Boş Olamaz' })
    }
    if (!data.Periods || data.Periods.length <= 0) {
      errors.push({ type: 'Error', code: 'Yapılacaklar', description: 'Hiç Bir Kontrol seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillTododefinenotification(error)
      })
    } else {
      AddTododefines(data, history)
    }
  }


}
