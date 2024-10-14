import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class ShiftdefinesCreate extends Component {

  PAGE_NAME = "ShiftdefinesCreate"

  render() {
    const { Shiftdefines, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    return (
      Shiftdefines.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Shiftdefines"}>
                <Breadcrumb.Section >{t('Pages.Shiftdefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Shiftdefines.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Shiftdefines.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Shiftdefines.Column.Priority')} name="Priority" type='number' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Shiftdefines.Column.Starttime')} name="Starttime" type='time' />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Shiftdefines.Column.Endtime')} name="Endtime" type='time' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Shiftdefines.Column.Isjoker')} name="Isjoker" formtype="checkbox" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Shiftdefines"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Shiftdefines.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddShiftdefines, history, fillShiftdefinenotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    !validator.isBoolean(data?.Isjoker) && (data.Isjoker = false)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Shiftdefines.Page.Header'), description: t('Pages.Shiftdefines.Messages.NameRequired') })
    }
    if (!validator.isString(data.Starttime)) {
      errors.push({ type: 'Error', code: t('Pages.Shiftdefines.Page.Header'), description: t('Pages.Shiftdefines.Messages.StarttimeRequired') })
    }
    if (!validator.isString(data.Endtime)) {
      errors.push({ type: 'Error', code: t('Pages.Shiftdefines.Page.Header'), description: t('Pages.Shiftdefines.Messages.EndtimeRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillShiftdefinenotification(error)
      })
    } else {
      AddShiftdefines({ data, history, closeModal })
    }
  }
}
ShiftdefinesCreate.contextType = FormContext