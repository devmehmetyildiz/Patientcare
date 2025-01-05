import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { GENDER_OPTION_MEN, GENDER_OPTION_WOMEN } from '../../Utils/Constants'

export default class FloorsEdit extends Component {

  PAGE_NAME = "FloorsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { FloorID, GetFloor, match, history } = this.props
    let Id = FloorID || match?.params?.FloorID
    if (validator.isUUID(Id)) {
      GetFloor(Id)
    } else {
      history.push("/Floors")
    }
  }

  componentDidUpdate() {
    const { Floors } = this.props
    const { selected_record, isLoading } = Floors
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Floors, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const Genderoptions = [
      { key: 0, text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
      { key: 1, text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
    ]

    return (
      <Pagewrapper isLoading={Floors.isLoading} dimmer>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Floors"}>
              <Breadcrumb.Section >{t('Pages.Floors.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Floors.Page.EditHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Floors.Column.Name')} name="Name" />
            <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Floors.Column.Gender')} name="Gender" options={Genderoptions} formtype='dropdown' />
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Floors"}
            buttonText={t('Common.Button.Goback')}
          />
          <Submitbutton
            isLoading={Floors.isLoading}
            buttonText={t('Common.Button.Update')}
            submitFunction={this.handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditFloors, history, fillFloornotification, Profile, Floors } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Floors.Page.Header'), description: t('Pages.Floors.Messages.NameRequired') })
    }
    if (!validator.isString(data.Gender)) {
      errors.push({ type: 'Error', code: t('Pages.Floors.Page.Header'), description: t('Pages.Floors.Messages.GenderRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillFloornotification(error)
      })
    } else {
      EditFloors({ data: { ...Floors.selected_record, ...data }, history })
    }
  }
}
FloorsEdit.contextType = FormContext