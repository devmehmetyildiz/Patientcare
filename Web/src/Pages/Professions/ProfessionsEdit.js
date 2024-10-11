import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class ProfessionsEdit extends Component {

  PAGE_NAME = "ProfessionsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }


  componentDidMount() {
    const { GetProfession, match, history, ProfessionID, GetFloors } = this.props
    let Id = ProfessionID || match.params.ProfessionID
    if (validator.isUUID(Id)) {
      GetProfession(Id)
      GetFloors()
    } else {
      history.push("/Professions")
    }
  }

  componentDidUpdate() {
    const { Professions, Floors } = this.props
    const { selected_record, isLoading } = Professions
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !Floors.isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Floors: (selected_record?.Floors || '').split(',') })
    }
  }

  render() {

    const { Professions, Floors, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
      return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
    })

    return (
      Professions.isLoading || Floors.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Professions"}>
                <Breadcrumb.Section >{t('Pages.Professions.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Professions.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Professions.Column.Name')} name="Name" />
              <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Professions.Column.Floors')} name="Floors" formtype='dropdown' multiple options={Floorsoptions} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Professions"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Professions.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditProfessions, history, fillRatingnotification, Professions, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Floors = (data.Floors || []).join(',')
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Professions.Page.Header'), description: t('Pages.Professions.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillRatingnotification(error)
      })
    } else {
      EditProfessions({ data: { ...Professions.selected_record, ...data }, history })
    }
  }
}
ProfessionsEdit.contextType = FormContext