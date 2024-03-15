import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { CASHYPES } from '../../Utils/Constants'

export default class CompanycashmovementsEdit extends Component {

  PAGE_NAME = "CompanycashmovementsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetCompanycashmovement, match, history, CompanycashmovementID } = this.props
    let Id = CompanycashmovementID || match?.params?.CompanycashmovementID
    if (validator.isUUID(Id)) {
      GetCompanycashmovement(Id)
    } else {
      history.push("/Companycashmovements")
    }
  }

  componentDidUpdate() {
    const { Companycashmovements } = this.props
    const { selected_record, isLoading } = Companycashmovements
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Companycashmovements, Profile, history, closeModal } = this.props
    const { isLoading} = Companycashmovements

    const Movementoptions = [
      { key: CASHYPES[0]?.value, text: CASHYPES[0]?.Name, value: CASHYPES[0]?.value },
      { key: CASHYPES[1]?.value, text: CASHYPES[1]?.Name, value: CASHYPES[1]?.value },
      { key: CASHYPES[2]?.value, text: CASHYPES[2]?.Name, value: CASHYPES[2]?.value },
    ]

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Companycashmovements"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Movementtype[Profile.Language]} name="Movementtype" options={Movementoptions} formtype='dropdown' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Movementvalue[Profile.Language]} name="Movementvalue" type='number' step='0.01'/>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Report[Profile.Language]} name="ReportID" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Companycashmovements"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Companycashmovements.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditCompanycashmovements, history, fillCompanycashmovementnotification, Companycashmovements, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    console.log('data: ', data);
    console.log('validator.isNumber(data.Movementvalue): ', validator.isNumber(data.Movementvalue));
    !validator.isNumber(data.Movementvalue) && (data.Movementvalue = 0)
    let errors = []
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Typerequired[Profile.Language] })
    }
    if (!validator.isString(data.ReportID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Reportnorequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillCompanycashmovementnotification(error)
      })
    } else {
      EditCompanycashmovements({ data: { ...Companycashmovements.selected_record, ...data }, history })
    }

  }
}
CompanycashmovementsEdit.contextType = FormContext