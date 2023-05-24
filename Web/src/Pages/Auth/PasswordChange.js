import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class PasswordChange extends Component {

  componentDidUpdate() {
    const { removenotification, Profile, Users, removeUsernotification } = this.props
    Notification(Profile.notifications, removenotification)
    Notification(Users.notifications, removeUsernotification)
  }

  render() {

    const { Profile } = this.props
    const { isLoading, isDispatching, username } = Profile

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Home"}>
                  <Breadcrumb.Section>Profil</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>{username}</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Parola Değişikliği</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Field>
                <Form.Input type='password' label="Güncel Parolanız" placeholder="Güncel Parolanız" name="oldpassword" fluid />
              </Form.Field>
              <Form.Group widths={"equal"}>
                <Form.Input type='password' label="Yeni Parolanız" placeholder="Yeni Parolanız" name="newpassword" fluid />
                <Form.Input type='password' label="Yeni Parola Yeniden" placeholder="Yeni Parola Yeniden" name="newpasswordRe" fluid />
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Home">
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

    const { ChangePassword, history, fillnotification, Profile } = this.props

    const data = formToObject(e.target)

    let errors = []
    if (!data.oldpassword || !data.oldpassword === '') {
      errors.push({ type: 'Error', code: 'Profil', description: 'Eski şifrenizi girmediniz' })
    }
    if (!data.newpassword || !data.newpassword === '') {
      errors.push({ type: 'Error', code: 'Profil', description: 'Yeni şifrenizi girmediniz' })
    }
    if (!data.newpasswordRe || !data.newpasswordRe === '') {
      errors.push({ type: 'Error', code: 'Profil', description: 'Yeni şifrenizi girmediniz' })
    }
    if (data.newpassword && data.newpasswordRe) {
      if (data.newpassword !== data.newpasswordRe) {
        errors.push({ type: 'Error', code: 'Profil', description: 'Yeni girilen şifreler eşleşmiyor' })
      }
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillnotification(error)
      })
    } else {
      ChangePassword({
        username: Profile.username,
        oldpassword: data.oldpassword,
        newpassword: data.newpassword
      }, history)
    }
  }


}
