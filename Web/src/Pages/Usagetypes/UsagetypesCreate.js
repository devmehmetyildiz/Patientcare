import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Icon, Popup } from 'semantic-ui-react'
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

    const t = Profile?.i18n?.t

    const additionalicon = <Popup
      trigger={<div
        className='mx-2 cursor-pointer'
        onClick={() => { this.setState({ isHavevalue: !this.state.isHavevalue }) }}
      >
        <Icon name='hand point right' />
      </div>}
      content={t('Pages.Usagetypes.Messages.Newvaluecheck')}
    />


    return (
      Usagetypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Usagetypes"}>
                <Breadcrumb.Section >{t('Pages.Usagetypes.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Usagetypes.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Usagetypes.Column.Name')} name="Name" additionalicon={additionalicon} />
                {this.state.isHavevalue && <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Usagetypes.Column.Value')} name="Value" />}
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Usagetypes.Column.Isrequiredpatientusagetype')} name="Isrequiredpatientusagetype" formtype={'checkbox'} />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Usagetypes.Column.Isrequiredpersonelusagetype')} name="Isrequiredpersonelusagetype" formtype={'checkbox'} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Usagetypes"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Usagetypes.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddUsagetypes, history, fillUsagetypenotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Usagetypes.Page.Header'), description: t('Pages.Usagetypes.Messages.NameRequired') })
    }
    if (this.state.isHavevalue) {
      if (!validator.isString(data.Value)) {
        errors.push({ type: 'Error', code: t('Pages.Usagetypes.Page.Header'), description: t('Pages.Usagetypes.Messages.ValueReqired') })
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