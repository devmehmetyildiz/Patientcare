import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
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

    const t = Profile?.i18n?.t

    return (
      Stocktypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stocktypes"}>
                <Breadcrumb.Section >{t('Pages.Stocktypes.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Stocktypes.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypes.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Stocktypes.Column.Info')} name="Info" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypes.Column.Issktneed')} name="Issktneed" formtype='checkbox' />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypes.Column.Isbarcodeneed')} name="Isbarcodeneed" formtype='checkbox' />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypes.Column.Isredpill')} name="Isredpill" formtype='checkbox' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stocktypes"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Stocktypes.isLoading}
              buttonText={t('Common.Button.Update')}
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

    const t = Profile?.i18n?.t

    !validator.isBoolean(data?.Issktneed) && (data.Issktneed = false)
    !validator.isBoolean(data?.Isbarcodeneed) && (data.Isbarcodeneed = false)
    !validator.isBoolean(data?.Isredpill) && (data.Isredpill = false)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Stocktypes.Page.Header'), description: t('Pages.Stocktypes.Messages.NameRequired') })
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