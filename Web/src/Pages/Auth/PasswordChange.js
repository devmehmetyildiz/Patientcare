import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class PasswordChange extends Component {

  PAGE_NAME = "PasswordChange"

  render() {

    const { Profile } = this.props
    const { isLoading, username, history } = Profile

    return (
      isLoading  ? <LoadingPage /> :
        <Pagewrapper Profile={Profile}>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{username}</Breadcrumb.Section>
              <Breadcrumb.Divider icon='right chevron' />
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Oldpassword[Profile.Language]} name="Oldpassword" />
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Newpassword[Profile.Language]} name="Newpassword" />
                <FormInput page={this.PAGE_NAME} type='password' placeholder={Literals.Columns.Newpasswordre[Profile.Language]} name="Newpasswordre" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper Profile={Profile}>
            <Gobackbutton
              history={history}
              redirectUrl={"/"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { history, fillnotification, Profile, Changepassword } = this.props

    const data = this.context.getForm(this.PAGE_NAME)

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
PasswordChange.contextType = FormContext