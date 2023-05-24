import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Checkbox, Divider, Dropdown, Form, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class TododefinesEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      isRequired: false,
      isNeedactivation: false,
      selectedPeriods: []
    }
  }

  componentDidMount() {
    const { GetTododefine, match, history } = this.props
    if (match.params.TododefineID) {
      GetTododefine(match.params.TododefineID)
    } else {
      history.push("/Tododefines")
    }
  }

  componentDidUpdate() {
    const { Tododefines, removeTododefinenotification, Periods, removePeriodnotification } = this.props
    const { notifications, selected_record, isLoading } = Tododefines
    if (selected_record && Object.keys(selected_record).length > 0 && !isLoading && selected_record.id !== 0 && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
        isRequired: selected_record.isRequired,
        isNeedactivation: selected_record.isNeedactivation,
        selectedPeriods: selected_record.periods.map(period => {
          return period.concurrencyStamp
        })
      })
    }
    Notification(notifications, removeTododefinenotification)
    Notification(Periods.notifications, removePeriodnotification)
  }

  render() {

    const { Tododefines, Periods } = this.props
    const { selected_record, isLoading, isDispatching } = Tododefines

    const Periodsoptions = Periods.list.map(period => {
      return { key: period.concurrencyStamp, text: period.name, value: period.concurrencyStamp }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]' >
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
                  <Form.Input defaultValue={selected_record.name} placeholder="Yapılacak İş" name="name" fluid />
                </Form.Field>
                <Form.Field>
                  <label className='text-[#000000de]'>Açıklama</label>
                  <Form.Input defaultValue={selected_record.value} placeholder="Açıklama" name="info" fluid />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <label className='text-[#000000de]'>Kontroller</label>
                  <Dropdown value={this.state.selectedPeriods} label="Kontroller" placeholder='Kontroller' clearable search fluid multiple selection options={Periodsoptions} onChange={(e, { value }) => { this.setState({ selectedPeriods: value }) }} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Field>
                  <Checkbox toggle className='m-2'
                    checked={this.state.isRequired}
                    onClick={(e) => { this.setState({ isRequired: !this.state.isRequired }) }}
                    label="Zorunlu alan mı?" />
                </Form.Field>
                <Form.Field>
                  <Checkbox toggle className='m-2'
                    checked={this.state.isNeedactivation}
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
                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditTododefines, history, removeTododefinenotification, Tododefines, Periods } = this.props
    const data = formToObject(e.target)
    data.periods = this.state.selectedPeriods.map(period => {
      return Periods.list.find(u => u.concurrencyStamp === period)
    })
    data.isNeedactivation = this.state.isNeedactivation
    data.isRequired = this.state.isRequired
    let errors = []
    if (!data.name || data.name === '') {
      errors.push({ type: 'Error', code: 'Yapılacaklar', description: 'İsim Boş Olamaz' })
    }
    if (!data.periods || data.periods.length <= 0) {
      errors.push({ type: 'Error', code: 'Yapılacaklar', description: 'Hiç Bir Kontrol seçili değil' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        removeTododefinenotification(error)
      })
    } else {
      EditTododefines({ ...Tododefines.selected_record, ...data }, history)
    }

  }
}
