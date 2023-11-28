import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
export default class StockmovementsCreate extends Component {

  PAGE_NAME = "StockmovementsCreate"

  componentDidMount() {
    const { GetStocks, GetStockdefines } = this.props
    GetStocks()
    GetStockdefines()
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
    const { Stockmovements, Stocks, Stockdefines, Profile, history, closeModal } = this.props

    const Stockoptions = (Stocks.list || []).filter(u => u.Isactive).map(stock => {
      if (stock.Barcodeno) {
        return { key: stock.Uuid, text: `${(Stockdefines.list || []).find(define => define.Uuid === stock.StockdefineID)?.Name} - ${stock.Barcodeno}`, value: stock.Uuid }
      }
      else {
        return { key: stock.Uuid, text: `${(Stockdefines.list || []).find(define => define.Uuid === stock.StockdefineID)?.Name}`, value: stock.Uuid }
      }
    })

    const Movementoptions = [
      { key: -1, text: Literals.Options.Movementoptions.value0[Profile.Language], value: -1 },
      { key: 1, text: Literals.Options.Movementoptions.value1[Profile.Language], value: 1 },
    ]

    return (
      Stocks.isLoading || Stocks.isDispatching || Stockmovements.isLoading || Stockmovements.isDispatching ? <LoadingPage /> :
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
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Stockdefine[Profile.Language]} options={Stockoptions} name="StockID" formtype='dropdown' />
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" type='number' />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Movementtype[Profile.Language]} name="Movementtype" options={Movementoptions} formtype='dropdown' />
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