import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb,  Form } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
import { FormContext } from '../../Provider/FormProvider'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import Submitbutton from '../../Common/Submitbutton'
import Gobackbutton from '../../Common/Gobackbutton'

export default class PatienttypesEdit extends Component {

  PAGE_NAME = "PatienttypesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatienttype, match, history, PatienttypeID } = this.props
    let Id = PatienttypeID || match?.params?.PatienttypeID
    if (validator.isUUID(Id)) {
      GetPatienttype(Id)
    } else {
      history.push("/Patienttypes")
    }
  }

  componentDidUpdate() {
    const { Patienttypes } = this.props
    const { selected_record, isLoading } = Patienttypes
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Patienttypes, Profile, history } = this.props
    const { isLoading, isDispatching } = Patienttypes

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patienttypes"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patienttypes"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Patienttypes.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPatienttypes, history, fillPatienttypenotification, Patienttypes, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatienttypenotification(error)
      })
    } else {
      EditPatienttypes({ data: { ...Patienttypes.selected_record, ...data }, history })
    }

  }
}
PatienttypesEdit.contextType = FormContext