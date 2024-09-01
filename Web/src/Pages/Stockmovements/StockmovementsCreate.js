import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
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

    const Stockoptions = (Stocks.list || []).filter(u => u.Isactive).map(stock => {
      const stockdefine = (Stockdefines.list || []).find(u => u?.Uuid === stock?.StockdefineID)
      const stocktype = (Stocktypes.list || []).find(u => u?.Uuid === stockdefine?.StocktypeID)
      const isHavebarcode = stocktype?.Isbarcodeneed
      return { key: stock.Uuid, text: `${stockdefine?.Name}${isHavebarcode ? ` (${stockdefine.Barcode})` : ''}`, value: stock.Uuid }
    })

    const Movementoptions = [
      { key: -1, text: Literals.Options.Movementoptions.value0[Profile.Language], value: -1 },
      { key: 1, text: Literals.Options.Movementoptions.value1[Profile.Language], value: 1 },
    ]

    return (
      Stocks.isLoading || Stockmovements.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stockmovements"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Stockdefine[Profile.Language]} options={Stockoptions} name="StockID" formtype='dropdown' />
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" type='number' min={0} max={9999} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Movementtype[Profile.Language]} name="Movementtype" options={Movementoptions} formtype='dropdown' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stockmovements"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Stockmovements.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddStockmovements, history, fillStockmovementnotification, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Movementdate = new Date()
    data.Newvalue = 0
    data.Prevvalue = 0
    data.Status = 0

    let errors = []
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Movementrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StockID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Stockrequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Amountrequired[Profile.Language] })
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