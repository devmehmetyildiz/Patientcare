import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import UnitsCreate from '../../Containers/Units/UnitsCreate'
import StocktypesCreate from '../../Containers/Stocktypes/StocktypesCreate'

export default class StockdefinesEdit extends Component {

  PAGE_NAME = "StockdefinesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetStockdefine, match, history, GetStocktypes, GetUnits, StockdefineID } = this.props
    let Id = StockdefineID || match.params.StockdefineID
    if (validator.isUUID(Id)) {
      GetStockdefine(Id)
      GetStocktypes()
      GetUnits()
    } else {
      history.push("/Stockdefines")
    }
  }

  componentDidUpdate() {
    const { Stockdefines, Units, Stocktypes } = this.props
    const { selected_record, isLoading } = Stockdefines
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !Units.isLoading && !Stocktypes.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Stocktypes, Stockdefines, Units, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const Stocktypesoption = (Stocktypes.list || []).filter(u => u.Isactive).map(item => {
      return { key: item.Uuid, text: item.Name, value: item.Uuid }
    })

    const Unitoption = (Units.list || []).filter(u => u.Isactive).map(item => {
      return { key: item.Uuid, text: item.Name, value: item.Uuid }
    })

    const selectedType = this.context.formstates[`${this.PAGE_NAME}/StocktypeID`]
    const Isbarcodeneed = selectedType?.Isbarcodeneed

    return (
      Stockdefines.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stockdefines"}>
                <Breadcrumb.Section >{t('Pages.Stockdefines.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Stockdefines.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stockdefines.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Stockdefines.Column.Brand')} name="Brand" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stockdefines.Column.Stocktype')} options={Stocktypesoption} name="StocktypeID" formtype='dropdown' modal={StocktypesCreate} />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stockdefines.Column.Unit')} options={Unitoption} name="UnitID" formtype='dropdown' modal={UnitsCreate} />
              </Form.Group>
              {Isbarcodeneed ?
                <Form.Group widths={"equal"}>
                  <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stockdefines.Column.Barcode')} name="Barcode" />
                </Form.Group>
                : null
              }
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Stockdefines.Column.Info')} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stockdefines"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Stockdefines.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditStockdefines, history, fillStockdefinenotification, Stockdefines, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    const Isbarcodeneed = data?.StocktypeID?.Isbarcodeneed

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Stockdefines.Page.Header'), description: t('Pages.Stockdefines.Messages.NameRequired') })
    }
    if (!validator.isUUID(data.StocktypeID)) {
      errors.push({ type: 'Error', code: t('Pages.Stockdefines.Page.Header'), description: t('Pages.Stockdefines.Messages.StocktypeRequired') })
    }
    if (!validator.isUUID(data.UnitID)) {
      errors.push({ type: 'Error', code: t('Pages.Stockdefines.Page.Header'), description: t('Pages.Stockdefines.Messages.UnitRequired') })
    }
    if (Isbarcodeneed) {
      if (!validator.isString(data.Barcode)) {
        errors.push({ type: 'Error', code: t('Pages.Stockdefines.Page.Header'), description: t('Pages.Stockdefines.Messages.BarcodeRequired') })
      }
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStockdefinenotification(error)
      })
    } else {
      EditStockdefines({ data: { ...Stockdefines.selected_record, ...data }, history })
    }
  }
}
StockdefinesEdit.contextType = FormContext