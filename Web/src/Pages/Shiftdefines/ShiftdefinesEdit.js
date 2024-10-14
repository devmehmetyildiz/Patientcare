import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class ShiftdefinesEdit extends Component {

  PAGE_NAME = "ShiftdefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { ShiftdefineID, GetShiftdefine, match, history } = this.props
    let Id = ShiftdefineID || match?.params?.ShiftdefineID
    if (validator.isUUID(Id)) {
      GetShiftdefine(Id)
    } else {
      history.push("/Shiftdefines")
    }
  }

  componentDidUpdate() {
    const { Shiftdefines } = this.props
    const { selected_record, isLoading } = Shiftdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Shiftdefines, Profile, history } = this.props

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
              <Breadcrumb.Section>{t('Pages.Shiftdefines.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
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
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditShiftdefines, history, fillShiftdefinenotification, Profile, Shiftdefines } = this.props
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
      EditShiftdefines({ data: { ...Shiftdefines.selected_record, ...data }, history })
    }
  }
}
ShiftdefinesEdit.contextType = FormContext