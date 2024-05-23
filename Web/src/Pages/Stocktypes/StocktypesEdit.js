import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class StocktypesEdit extends Component {

  PAGE_NAME = "StocktypesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetStocktype, match, history, StocktypeID } = this.props
    let Id = StocktypeID || match.params.StocktypeID
    if (validator.isUUID(Id)) {
      GetStocktype(Id)
    } else {
      history.push("/Stocktypes")
    }
  }

  componentDidUpdate() {
    const { Stocktypes } = this.props
    const { selected_record, isLoading } = Stocktypes
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Stocktypes, Profile, history } = this.props


    return (
      Stocktypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stocktypes"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Issktneed[Profile.Language]} name="Issktneed" formtype='checkbox' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Isbarcodeneed[Profile.Language]} name="Isbarcodeneed" formtype='checkbox' />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Isredpill[Profile.Language]} name="Isredpill" formtype='checkbox' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stocktypes"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Stocktypes.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditStocktypes, history, fillStocktypenotification, Stocktypes, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    !validator.isBoolean(data?.Issktneed) && (data.Issktneed = false)
    !validator.isBoolean(data?.Isbarcodeneed) && (data.Isbarcodeneed = false)
    !validator.isBoolean(data?.Isredpill) && (data.Isredpill = false)
    
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillStocktypenotification(error)
      })
    } else {
      EditStocktypes({ data: { ...Stocktypes.selected_record, ...data }, history })
    }
  }
}
StocktypesEdit.contextType = FormContext