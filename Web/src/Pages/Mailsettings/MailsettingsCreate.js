import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Checkbox, Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class MailsettingsCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isbodyhtml: false,
      issettingactive: false
    }
  }

  componentDidUpdate() {
    const { removeMailsettingnotification, Mailsettings } = this.props
    const { notifications } = Mailsettings

    Notification(notifications, removeMailsettingnotification)
  }

  render() {

    const { Mailsettings } = this.props
    const { isLoading, isDispatching } = Mailsettings

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Mailsettings"}>
                  <Breadcrumb.Section >Mail Ayarları</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths={"equal"}>
                <Form.Input label="Mail Ayar Adı" placeholder="Mail Ayar Adı" name="name" fluid />
                <Form.Input label="Mail Kullanıcısı" placeholder="Mail Kullanıcısı" name="user" fluid />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <Form.Input type='password' label="Mail Kullanıcı Şifresi" placeholder="Mail Kullanıcı Şifresi" name="password" fluid />
                <Form.Input label="Smtp Port" placeholder="Smtp Port" name="smtpport" fluid />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <Form.Input label="Smtp Host" placeholder="Smtp Host" name="smtphost" fluid />
                <Form.Input label="Mailaddress" placeholder="Mailaddress" name="mailaddress" fluid />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <Form.Field>
                  <Checkbox toggle className='m-2'
                    onClick={(e) => { this.setState({ isbodyhtml: !this.state.isbodyhtml }) }}
                    label="Body html mi?" />
                </Form.Field>
                <Form.Field>
                  <Checkbox toggle className='m-2'
                    onClick={(e) => { this.setState({ issettingactive: !this.state.issettingactive }) }}
                    label="Aktif mi?" />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Mailsettings">
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

    const { AddMailsettings, history, fillMailsettingnotification } = this.props

    const data = formToObject(e.target)
    data.isbodyhtml = this.state.isbodyhtml
    data.issettingactive = this.state.issettingactive
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
      errors.push({ type: 'Error', code: 'Mail Ayarları', description: 'İsim Boş Olamaz' })
    }
    if (!data.user || data.user === '') {
      errors.push({ type: 'Error', code: 'Mail Ayarları', description: 'Mail kullanıcısı Boş Olamaz' })
    }
    if (!data.password || data.password === '') {
      errors.push({ type: 'Error', code: 'Mail Ayarları', description: 'Mail kullanıcı parolası Boş Olamaz' })
    }
    if (!data.smtpport || data.smtpport === '') {
      errors.push({ type: 'Error', code: 'Mail Ayarları', description: 'Smtp Port Boş Olamaz' })
    }
    if (!data.smtphost || data.smtphost === '') {
      errors.push({ type: 'Error', code: 'Mail Ayarları', description: 'Smtp Host Boş Olamaz' })
    }
    if (!data.mailaddress || data.mailaddress === '') {
      errors.push({ type: 'Error', code: 'Mail Ayarları', description: 'E-Mail Adresi Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillMailsettingnotification(error)
      })
    } else {
      AddMailsettings(data, history)
    }
  }


}
