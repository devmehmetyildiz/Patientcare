import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Form, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'
import validator from '../../Utils/Validator'
import Literals from './Literals'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import { FormContext } from '../../Provider/FormProvider'
export default class StationsEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetStation, match, history } = this.props
    if (match.params.StationID) {
      GetStation(match.params.StationID)
    } else {
      history.push("/Stations")
    }
  }

  componentDidUpdate() {
    const { Stations, removeStationnotification } = this.props
    const { selected_record, isLoading } = Stations
    if (validator.isObject(selected_record) && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setFormstates(selected_record)
    }
    Notification(Stations.notifications, removeStationnotification)
  }

  render() {

    const { Stations, Profile } = this.props
    const { isLoading, isDispatching } = Stations


    return (
      isLoading || isDispatching ? <LoadingPage /> :
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
            <Form onSubmit={this.handleSubmit}>
              <FormInput placeholder={Literals.Columns.Name[Profile.Language]} name="Name" required />
              <Footerwrapper>
                <Link to="/Stations">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditStations, history, fillStationnotification, Stations, Profile } = this.props
    const data = formToObject(e.target)
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
