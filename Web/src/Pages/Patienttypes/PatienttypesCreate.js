import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'


export default class PatienttypesCreate extends Component {

  componentDidUpdate() {
    const { Patienttypes, removePatienttypenotification } = this.props
    Notification(Patienttypes.notifications, removePatienttypenotification)
  }

  render() {

    const { Patienttypes } = this.props
    const { isLoading, isDispatching } = Patienttypes

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Patienttypes"}>
                  <Breadcrumb.Section >Hasta Türleri</Breadcrumb.Section>
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
                <label className='text-[#000000de]'>Hasta Tür Adı</label>
                <Form.Input placeholder="Hasta Tür Adı" name="Name" fluid />
              </Form.Field>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Patienttypes">
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

    const { AddPatienttypes, history, fillPatienttypenotification } = this.props

    const data = formToObject(e.target)
    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Patienttypes', description: 'İsim Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatienttypenotification(error)
      })
    } else {
      AddPatienttypes(data, history)
    }
  }
}

