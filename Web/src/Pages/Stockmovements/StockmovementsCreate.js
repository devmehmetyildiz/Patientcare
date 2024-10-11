import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class StockmovementsCreate extends Component {

  PAGE_NAME = "StockmovementsCreate"

  componentDidMount() {
    const { GetStocks, GetStockdefines, GetStocktypes } = this.props
    GetStocks()
    GetStockdefines()
    GetStocktypes()
  }

  componentDidUpdate() {

    const { Stocks, location } = this.props

    if (!validator.isUUID(this.context.formstates[`${this.PAGE_NAME}/StockID`])) {
      const search = new URLSearchParams(location.search)
      const StockID = search.get('StockID') ? search.get('StockID') : ''
      if (validator.isUUID(StockID) && (Stocks.list || []).find(u => u.Uuid === StockID)) {
        this.context.setFormstates({
          ...this.context.formstates,
          [`${this.PAGE_NAME}/StockID`]: StockID ? StockID : '',
        })
      }
    }
  }

  render() {
    const { Stockmovements, Stocks, Stockdefines, Profile, history, closeModal, Stocktypes } = this.props

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
              <Breadcrumb.Section>{t('Pages.Stockmovements.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddStockmovements, history, fillStockmovementnotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Movementdate = new Date()

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
      AddStockmovements({ data, history, closeModal })
    }
  }

  getLocalDate = () => {
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substring(0, 10);
    return date
  }
}
StockmovementsCreate.contextType = FormContext