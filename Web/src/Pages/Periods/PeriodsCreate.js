import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class PeriodsCreate extends Component {

  componentDidUpdate() {
    const { removePeriodnotification, Periods } = this.props
    Notification(Periods.notifications, removePeriodnotification)
  }

  render() {

    const { Periods } = this.props
    const { isLoading, isDispatching } = Periods

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
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
                <Form.Input label="Kontrol Grup Adı" placeholder="Kontrol Grup Adı" name="name" fluid />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <Form.Input type='time' label="Gerçekleşme Saati" placeholder="Gerçekleşme Saati" name="occuredtime" fluid />
                <Form.Input type='time' label="Geçikme Saati" placeholder="Geçikme Saati" name="checktime" fluid />
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Periods">
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

    const { AddPeriods, history, fillPeriodnotification } = this.props

    const data = formToObject(e.target)
    data.id = 0
    data.concurrencyStamp = null
    data.createdUser = null
    data.updatedUser = null
    data.deleteUser = null
    data.createTime = null
    data.updateTime = null
    data.deleteTime = null
    data.isActive = true

    let errors = []
    if (!data.name || data.name === '') {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'İsim Boş Olamaz' })
    }
    if (!data.occuredtime || data.occuredtime === '') {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'Gerçekleşme tarihi seçilmedi' })
    }
    if (!data.checktime || data.checktime === '') {
      errors.push({ type: 'Error', code: 'Kontrol Grupları', description: 'Geçikme tarihi seçilmedi' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPeriodnotification(error)
      })
    } else {
      AddPeriods(data, history)
    }
  }
}
