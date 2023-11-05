import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Divider, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import FormInput from '../../Utils/FormInput'

export default class PasswordChange extends Component {

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
                  <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>{username}</Breadcrumb.Section>
                <Breadcrumb.Divider icon='right chevron' />
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form onSubmit={this.handleSubmit}>
              <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Oldpassword[Profile.Language]} name="Oldpassword" />
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Newpassword[Profile.Language]} name="Newpassword" />
                <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Newpasswordre[Profile.Language]} name="Newpasswordre" />
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <div onClick={(e) => {
                  e.preventDefault()
                  this.props.history.goBack()
                }}>
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </div>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </div>
            </Form>
          </div>

        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { history, fillnotification, Profile, Changepassword } = this.props

    const data = formToObject(e.target)

    let errors = []
    if (!validator.isString(data.Oldpassword)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Oldpasswordrequired[Profile.Language] })
    }
    if (!validator.isString(data.Newpassword)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Newpasswordrequired[Profile.Language] })
    }
    if (!validator.isString(data.Newpasswordre)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Newpasswordrerequired[Profile.Language] })
    }
    if (data.Newpassword && data.Newpasswordre) {
      if (data.Newpassword !== data.Newpasswordre) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Passworddidntmatch[Profile.Language] })
      }
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillnotification(error)
      })
    } else {
      Changepassword({ data, history })
    }
  }
}
