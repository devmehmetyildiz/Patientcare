import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PurchaseorderPrepare from './PurchaseorderPrepare'
import { Formatdate } from '../../Utils/Formatdate'
export default class PurchaseordersEdit extends Component {

  PAGE_NAME = "PurchaseordersEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      selectedFiles: [],
      selectedStocks: [],
    }
  }

  componentDidMount() {
    const { GetPurchaseorder, GetFiles, GetStocks, match, history, PurchaseorderID } = this.props
    let Id = PurchaseorderID || match.params.PurchaseorderID
    if (validator.isUUID(Id)) {
      GetPurchaseorder(Id)
      GetFiles()
      GetStocks()
    } else {
      history.push("/Purchaseorder")
    }
  }

  componentDidUpdate() {
    const { Purchaseorders, Files, Stocks } = this.props
    const { selected_record, isLoading } = Purchaseorders
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !Files.isLoading && !Stocks.isLoading && !isLoading && !this.state.isDatafetched) {
      var files = (Files.list || []).filter(u => u.ParentID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random(),
          Usagetype: (element.Usagetype.split(',') || []).map(u => {
            return u
          })
        }
      });
      var stocks = (Stocks.list || []).filter(u => u.WarehouseID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random()
        }
      });
      this.setState({
        isDatafetched: true,
        selectedFiles: [...files] || [],
        selectedStocks: (stocks || []).map(u => {
          if (validator.isISODate(u.Skt)) {
            return { ...u, Skt: Formatdate(u.Skt) }
          } else {
            return { ...u }
          }
        }),
      })

      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Purchaseorders, Profile, history } = this.props

    return (
      Purchaseorders.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Purchaseorders"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <PurchaseorderPrepare
              Preparestatus={2}
              PAGE_NAME={this.PAGE_NAME}
              selectedFiles={this.state.selectedFiles}
              selectedStocks={this.state.selectedStocks}
              setselectedFiles={this.setselectedFiles}
              setselectedStocks={this.setselectedStocks}
              Profile={Profile}
            />
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Purchaseorders"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Purchaseorders.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPurchaseorders, history, fillPurchaseordernotification, Purchaseorders, Profile, Stockdefines, Stocktypes } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Price = validator.isNumber(Number(data.Price)) ? Number(data.Price) : 0
    data.Stocks = this.state.selectedStocks
    data.Deliverytype = validator.isNumber(data.Deliverytype) ? data.Deliverytype : null

    let errors = []
    if (!validator.isString(data.Company)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CompanyRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.CaseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.CaseRequired[Profile.Language] })
    }

    if (!validator.isArray(data.Stocks)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StocksRequired[Profile.Language] })
    }

    for (const stock of data.Stocks) {

      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)
      const stocktype = (Stocktypes.list || []).find(u => stockdefine?.StocktypeID)
      const Issktneed = stocktype?.Issktneed

      if (!validator.isUUID(stock.StockdefineID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StockRequired[Profile.Language] })
      }
      if (!validator.isUUID(stock.StocktypeID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StocktypeRequired[Profile.Language] })
      }

      if (!validator.isNumber(Number(stock.Amount))) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.AmountRequired[Profile.Language] })
      } else {
        if (Number(stock.Amount) === 0) {
          errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.AmountRequired[Profile.Language] })
        }
      }

      if (Issktneed) {
        if (!validator.isISODate(stock.Skt)) {
          errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.SktRequired[Profile.Language] })
        }
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseordernotification(error)
      })
    } else {
      EditPurchaseorders({ data: { ...Purchaseorders.selected_record, ...data }, history, files: this.state.selectedFiles })
    }
  }

  setselectedFiles = (files) => {
    this.setState({ selectedFiles: [...files] })
  }
  setselectedStocks = (stocks) => {
    this.setState({ selectedStocks: [...stocks] })
  }
}
PurchaseordersEdit.contextType = FormContext