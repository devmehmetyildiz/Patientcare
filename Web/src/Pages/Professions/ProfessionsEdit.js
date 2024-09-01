import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
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

    const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
      return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
    })

    return (
      Professions.isLoading || Floors.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Professions"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <FormInput page={this.PAGE_NAME}  placeholder={Literals.Columns.Floors[Profile.Language]} name="Floors" formtype='dropdown' multiple options={Floorsoptions} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Professions"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Professions.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditProfessions, history, fillRatingnotification, Professions, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Floors = (data.Floors || []).join(',')
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
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