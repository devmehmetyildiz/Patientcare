import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Divider, Form, Input } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import FormInput from '../../Utils/FormInput'

export default class StationsCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inputvalues: {}
    }
  }

  componentDidUpdate() {
    const { removeStationnotification, Stations } = this.props
    Notification(Stations.notifications, removeStationnotification)
  }

  render() {

    const { Stations } = this.props
    const { isLoading, isDispatching } = Stations
    const { inputvalues } = this.state


    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Stations"}>
                  <Breadcrumb.Section >İstasyonlar</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={(e) => { this.handleSubmit(e) }}>
              <Form.Field>
                <label className='text-[#000000de]'>İstasyon Adı</label>
                <FormInput  placeholder="İstasyon Adı" name="Name"  />
              </Form.Field>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Stations">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue' >Oluştur</Button>
              </div>
            </Form>
          </div>

        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddStations, history, fillStationnotification } = this.props

    const data = { ...formToObject(e.target) }

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Stations', description: 'İsim Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStationnotification(error)
      })
    } else {
      this.setState({ inputvalues: data })
      AddStations({ ...data }, history)
    }
  }
}

