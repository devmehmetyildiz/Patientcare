import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Icon, Popup } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default class UsagetypesCreate extends Component {

  PAGE_NAME = "UsagetypesCreate"

  constructor(props) {
    super(props)
    this.state = {
      isHavevalue: false
    }
  }

  render() {
    const { Usagetypes, Profile, history, closeModal } = this.props

    const additionalicon = <Popup
      trigger={<div
        className='mx-2 cursor-pointer'
        onClick={() => { this.setState({ isHavevalue: !this.state.isHavevalue }) }}
      >
        <Icon name='hand point right' />
      </div>}
      content={Literals.Messages.Newvaluecheck[Profile.Language]}
    />


    return (
      Usagetypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Usagetypes"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" additionalicon={additionalicon} />
                {this.state.isHavevalue && <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Value[Profile.Language]} name="Value" />}
              </Form.Group>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Isrequired[Profile.Language]} name="Isrequired" formtype={'checkbox'} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Usagetypes"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Usagetypes.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddUsagetypes, history, fillUsagetypenotification, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (this.state.isHavevalue) {
      if (!validator.isString(data.Value)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Valuerequired[Profile.Language] })
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillUsagetypenotification(error)
      })
    } else {
      if (this.state.isHavevalue) {
        AddUsagetypes({ data, history, closeModal })
      } else {
        AddUsagetypes({ data: { ...data, Value: data.Name }, history, closeModal })
      }
    }
  }
}
UsagetypesCreate.contextType = FormContext