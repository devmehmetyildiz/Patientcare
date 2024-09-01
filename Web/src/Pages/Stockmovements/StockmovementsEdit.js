import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
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
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
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
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditStockmovements, history, fillStockmovementnotification, Stockmovements, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
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