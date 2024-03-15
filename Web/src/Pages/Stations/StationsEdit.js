import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class StationsEdit extends Component {

  PAGE_NAME = "StationsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetStation, match, history, StationID } = this.props
    let Id = StationID || match.params.StationID
    if (validator.isUUID(Id)) {
      GetStation(Id)
    } else {
      history.push("/Stations")
    }
  }

  componentDidUpdate() {
    const { Stations } = this.props
    const { selected_record, isLoading } = Stations
    if (validator.isObject(selected_record) && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Stations, Profile, history } = this.props
    const { isLoading } = Stations


    return (
      isLoading  ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stations"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Name[Profile.Language]} name="Name" required />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stations"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditStations, history, fillStationnotification, Stations, Profile } = this.props

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStationnotification(error)
      })
    } else {
      EditStations({ data: { ...Stations.selected_record, ...data }, history })
    }

  }
}
StationsEdit.contextType = FormContext
