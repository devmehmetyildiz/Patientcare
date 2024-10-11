import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import WarehousesCreate from '../../Containers/Warehouses/WarehousesCreate'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'

export default class StocksEdit extends Component {

  PAGE_NAME = "StocksEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { StockID, GetStock, GetWarehouses, match, history, GetStockdefines, GetStocktypes, GetStocktypegroups } = this.props
    let Id = StockID || match.params.StockID
    if (validator.isUUID(Id)) {
      GetStock(Id)
      GetStocktypes()
      GetStockdefines()
      GetWarehouses()
      GetStocktypegroups()
    } else {
      history.push("/Stocks")
    }
  }

  componentDidUpdate() {
    const { Stockdefines, Stocks, Warehouses, Stocktypes, Stocktypegroups } = this.props

    const { selected_record, isLoading } = Stocks
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Warehouses.isLoading && !Stocktypes.isLoading && !Stocktypegroups.isLoading
      && !Stockdefines.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Skt: this.getFormattetdate(selected_record?.Skt) })
    }
  }

  render() {
    const { Stocks, Warehouses, Stockdefines, Profile, history, Stocktypes, } = this.props

    const t = Profile?.i18n?.t

    const selectedstockdefineId = this.context.formstates[`${this.PAGE_NAME}/StockdefineID`]
    const stockdefine = (Stockdefines.list || []).find(item => item.Uuid === selectedstockdefineId)
    const selectedstocktypeId = stockdefine?.StocktypeID
    const stocktype = (Stocktypes.list || []).find(item => item.Uuid === selectedstocktypeId)
    const Issktneeded = stocktype?.Issktneed

    const Stockdefineoptions = (Stockdefines.list || []).filter(u => u.Isactive).map(item => {
      return { key: item.Uuid, text: item.Name, value: item.Uuid }
    })

    const Warehouseoptions = (Warehouses.list || []).filter(u => u.Isactive).map(item => {
      return { key: item.Uuid, text: item.Name, value: item.Uuid }
    })

    return (
      Stocks.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stocks"}>
                <Breadcrumb.Section >{t('Pages.Stocks.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section >{t('Pages.Stocks.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocks.Column.Warehouse')} options={Warehouseoptions} name="WarehouseID" formtype='dropdown' modal={WarehousesCreate} effect={this.onWarehousechange} />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocks.Column.Stockdefine')} options={Stockdefineoptions} name="StockdefineID" formtype='dropdown' modal={StockdefinesCreate} />
              </Form.Group>
              <Form.Group widths='equal'>
                {Issktneeded ? <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocks.Column.Skt')} name="Skt" type='date' /> : null}
              </Form.Group>
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Stocks.Column.Info')} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stocks"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Stocks.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditStocks, history, fillStocknotification, Stocks, Profile, Stockdefines, Stocktypes, Stocktypegroups } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    const selectedstockdefineId = data?.StockdefineID
    const stockdefine = (Stockdefines.list || []).find(item => item.Uuid === selectedstockdefineId)
    const selectedstocktypeId = stockdefine?.StocktypeID
    const stocktype = (Stocktypes.list || []).find(item => item.Uuid === selectedstocktypeId)
    const stocktypegroup = (Stocktypegroups.list || []).find(item => (((item.Stocktypes || '').split(',')) || []).includes(stocktype?.Uuid))
    const Issktneeded = stocktype?.Issktneed

    data.StocktypeID = stocktype?.Uuid
    data.StockgrouptypeID = stocktypegroup?.Uuid

    let errors = []
    if (!validator.isUUID(data.WarehouseID)) {
      errors.push({ type: 'Error', code: t('Pages.Stocks.Page.Header'), description: t('Pages.Stocks.Messages.WarehouseRequired') })
    }
    if (!validator.isUUID(data.StockdefineID)) {
      errors.push({ type: 'Error', code: t('Pages.Stocks.Page.Header'), description: t('Pages.Stocks.Messages.StockdefineRequired') })
    }
    if (Issktneeded) {
      if (!validator.isISODate(data.Skt)) {
        errors.push({ type: 'Error', code: t('Pages.Stocks.Page.Header'), description: t('Pages.Stocks.Messages.SktRequired') })
      }
    } else {
      data.Skt = null
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillStocknotification(error)
      })
    } else {
      EditStocks({ data: { ...Stocks.selected_record, ...data }, history })
    }
  }

  onWarehousechange = () => {
    this.context.setFormstates(prev => ({
      ...prev,
      [`${this.PAGE_NAME}/StockdefineID`]: "",
      [`${this.PAGE_NAME}/Skt`]: null,
      [`${this.PAGE_NAME}/Amount`]: 0,
    }))
  }

  getFormattetdate = (date) => {
    const currentDate = new Date(date || '');
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }
}
StocksEdit.contextType = FormContext