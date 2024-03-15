import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import RoomsCreate from '../../Containers/Rooms/RoomsCreate'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class UsagetypesEdit extends Component {

  PAGE_NAME = "UsagetypesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { UsagetypeID, GetUsagetype, match, history } = this.props
    let Id = UsagetypeID || match?.params?.UsagetypeID
    if (validator.isUUID(Id)) {
      GetUsagetype(Id)
    } else {
      history.push("/Usagetypes")
    }
  }

  componentDidUpdate() {
    const { Usagetypes } = this.props
    const { selected_record, isLoading } = Usagetypes
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Usagetypes, Profile, history } = this.props

    return (
      Usagetypes.isLoading  ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Usagetypes"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Value[Profile.Language]} name="Value" />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Isrequired[Profile.Language]} name="Isrequired" formtype={'checkbox'} />
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
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditUsagetypes, history, fillUsagetypenotification, Profile, Usagetypes } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isString(data.Value)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Valuerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUsagetypenotification(error)
      })
    } else {
      EditUsagetypes({ data: { ...Usagetypes.selected_record, ...data }, history })
    }
  }
}
UsagetypesEdit.contextType = FormContext