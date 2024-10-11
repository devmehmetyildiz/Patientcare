import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class StockmovementsEdit extends Component {

  PAGE_NAME = "StockmovementsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }


  componentDidMount() {
    const { GetStockmovement, GetStocks, GetStockdefines, GetStocktypes, match, history, StockmovementID } = this.props
    let Id = StockmovementID || match.params.StockmovementID
    if (validator.isUUID(Id)) {
      GetStockmovement(Id)
      GetStocks()
      GetStockdefines()
      GetStocktypes()
    } else {
      history.push("/Stockmovements")
    }
  }

  componentDidUpdate() {
    const { Stocks, Stockmovements, Stockdefines } = this.props
    const { selected_record, isLoading } = Stockmovements
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Stockdefines.isLoading && !Stocks.isLoading
      && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Stockmovements, Stocks, Profile, Stockdefines, Stocktypes, history } = this.props

    const t = Profile?.i18n?.t

    const Stockoptions = (Stocks.list || []).filter(u => u.Isactive).map(stock => {
      const stockdefine = (Stockdefines.list || []).find(u => u?.Uuid === stock?.StockdefineID)
      const stocktype = (Stocktypes.list || []).find(u => u?.Uuid === stockdefine?.StocktypeID)
      const isHavebarcode = stocktype?.Isbarcodeneed
      return { key: stock.Uuid, text: `${stockdefine?.Name}${isHavebarcode ? ` (${stockdefine.Barcode})` : ''}`, value: stock.Uuid }
    })

    const Movementoptions = [
      { key: -1, text: t('Option.Movementoption.Outcome'), value: -1 },
      { key: 1, text: t('Option.Movementoption.Income'), value: 1 },
    ]

    return (
      Stocks.isLoading || Stockmovements.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stockmovements"}>
                <Breadcrumb.Section >{t('Pages.Stockmovements.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section >{t('Pages.Stockmovements.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stockmovements.Column.Stockdefine')} options={Stockoptions} name="StockID" formtype='dropdown' />
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stockmovements.Column.Amount')} name="Amount" type='number' min={0} max={9999} />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stockmovements.Column.Movementtype')} name="Movementtype" options={Movementoptions} formtype='dropdown' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stockmovements"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Stockmovements.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditStockmovements, history, fillStockmovementnotification, Stockmovements, Profile } = this.props
    
    const t = Profile?.i18n?.t
    
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: t('Pages.Stockmovements.Page.Header'), description: t('Pages.Stockmovements.Messages.MovementtypeRequired"') })
    }
    if (!validator.isUUID(data.StockID)) {
      errors.push({ type: 'Error', code: t('Pages.Stockmovements.Page.Header'), description: t('Pages.Stockmovements.Messages.StockRequired"') })
    }
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: t('Pages.Stockmovements.Page.Header'), description: t('Pages.Stockmovements.Messages.AmountRequired"') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStockmovementnotification(error)
      })
    } else {
      EditStockmovements({ data: { ...Stockmovements.selected_record, ...data }, history })
    }
  }

  getLocalDate = () => {
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substring(0, 10);
    return date
  }
}
StockmovementsEdit.contextType = FormContext