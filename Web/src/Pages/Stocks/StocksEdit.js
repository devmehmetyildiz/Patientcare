import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import WarehousesCreate from '../../Containers/Warehouses/WarehousesCreate'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'
import Formatdate from '../../Utils/Formatdate'

export default function StocksEdit(props) {

  const PAGE_NAME = "StocksEdit"

  const { StockID, GetStock, GetWarehouses, EditStocks, fillStocknotification, Profile, match, history, GetStockdefines, GetStocktypes, GetStocktypegroups } = props
  const { Stockdefines, Stocks, Warehouses, Stocktypes, Stocktypegroups } = props

  const Id = StockID || match.params.StockID

  const t = Profile?.i18n?.t

  const context = useContext(FormContext)

  const { selected_record, isLoading } = Stocks

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)

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

  const onWarehousechange = () => {
    context.setFormstates(prev => ({
      ...prev,
      [`${PAGE_NAME}/StockdefineID`]: "",
      [`${PAGE_NAME}/Skt`]: null,
      [`${PAGE_NAME}/Amount`]: 0,
    }))
  }

  const selectedstockdefineId = context.formstates[`${PAGE_NAME}/StockdefineID`]
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

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetStock(Id)
      GetStocktypes()
      GetStockdefines()
      GetWarehouses()
      GetStocktypegroups()
    } else {
      history.push("/Stocks")
    }
  }, [])

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, { ...selected_record, Skt: Formatdate(selected_record?.Skt) })
    }
  }, [selected_record])

  return (
    <Pagewrapper dimmer isLoading={isLoading}>
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
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Stocks.Column.Warehouse')} options={Warehouseoptions} name="WarehouseID" formtype='dropdown' modal={WarehousesCreate} effect={onWarehousechange} />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Stocks.Column.Stockdefine')} options={Stockdefineoptions} name="StockdefineID" formtype='dropdown' modal={StockdefinesCreate} />
          </Form.Group>
          <Form.Group widths='equal'>
            {Issktneeded ? <FormInput page={PAGE_NAME} required placeholder={t('Pages.Stocks.Column.Skt')} name="Skt" type='date' /> : null}
          </Form.Group>
          <Form.Group widths='equal'>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Stocks.Column.Info')} name="Info" />
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
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}