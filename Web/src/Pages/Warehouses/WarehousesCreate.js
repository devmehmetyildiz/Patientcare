import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class WarehousesCreate extends Component {

  componentDidUpdate() {
    const { Warehouses, removeWarehousenotification } = this.props
    Notification(Warehouses.notifications, removeWarehousenotification)
  }

  render() {

    const { Warehouses } = this.props
    const { isLoading, isDispatching } = Warehouses

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Warehouses"}>
                  <Breadcrumb.Section >Ambarlar</Breadcrumb.Section>
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
                <label className='text-[#000000de]'>Ambar Adı</label>
                <Form.Input placeholder="Ambar Adı" name="Name" fluid />
              </Form.Field>
              <Form.Field>
                <label className='text-[#000000de]'>Açıklama</label>
                <Form.Input placeholder="Açıklama" name="Info" fluid />
              </Form.Field>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Warehouses">
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

    const { AddWarehouses, history, fillWarehousenotification } = this.props

    const data = formToObject(e.target)

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Ambarlar', description: 'İsim Boş Olamaz' })
    }
    if (!data.Info || data.Info === '') {
      errors.push({ type: 'Error', code: 'Ambarlar', description: 'Açıklama Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillWarehousenotification(error)
      })
    } else {
      AddWarehouses({data, history})
    }
  }


}
