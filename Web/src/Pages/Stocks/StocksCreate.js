import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import WarehousesCreate from '../../Containers/Warehouses/WarehousesCreate'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'

export default function StocksCreate(props) {
  const PAGE_NAME = "StocksCreate"

  const { GetStocktypes, GetStockdefines, GetWarehouses, GetStocktypegroups } = props
  const { Stocks, Warehouses, Stocktypes, Stockdefines, Profile, history, closeModal } = props
  const { AddStocks, fillStocknotification, Stocktypegroups } = props

  const t = Profile?.i18n?.t

  const context = useContext(FormContext)

  const handleSubmit = (e) => {
    e.preventDefault()

    const t = Profile?.i18n?.t

    const data = context.getForm(PAGE_NAME)
    data.Type = 0
    data.Isapproved = false
    data.Isdeactivated = false
    data.Deactivateinfo = ""

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
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: t('Pages.Stocks.Page.Header'), description: t('Pages.Stocks.Messages.AmountRequired') })
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
      AddStocks({ data, history, closeModal })
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
    GetStocktypes()
    GetStockdefines()
    GetWarehouses()
    GetStocktypegroups()
  }, [])

  return (
    <Pagewrapper dimmer isLoading={Stocks.isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Stocks"}>
            <Breadcrumb.Section >{t('Pages.Stocks.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Stocks.Page.CreateHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Stocks.Column.Amount')} name="Amount" step="0.01" type='number' min={0} max={9999} />
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
          buttonText={t('Common.Button.Create')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}