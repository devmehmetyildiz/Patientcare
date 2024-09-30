import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
export default class PatienteventdefinesCreate extends Component {

  PAGE_NAME = "PatienteventdefinesCreate"

  render() {
    const { Patienteventdefines, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    return (
      Patienteventdefines.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patienteventdefines"}>
                <Breadcrumb.Section >{t('Pages.Patienteventdefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Patienteventdefines.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Patienteventdefines.Label.Eventname')} name="Eventname" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patienteventdefines"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Patienteventdefines.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddPatienteventdefines, history, fillPatienteventdefinenotification, Profile, closeModal } = this.props
    const t = Profile?.i18n?.t
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Eventname)) {
      errors.push({ type: 'Error', code: t('Pages.Patienteventdefines.Page.Header'), description: t('Pages.Patienteventdefines.Messages.EventnameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatienteventdefinenotification(error)
      })
    } else {
      AddPatienteventdefines({ data, history, closeModal })
    }
  }
}
PatienteventdefinesCreate.contextType = FormContext