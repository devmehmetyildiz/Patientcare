import React, { Component, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PurchaseorderPrepare from './PurchaseorderPrepare'
import { Formatdate } from '../../Utils/Formatdate'

export default function PurchaseordersEdit(props) {
  const PAGE_NAME = "PurchaseordersEdit"

  const { Purchaseorders, Profile, GetPurchaseorder, GetFiles, GetStocks, match, history, PurchaseorderID } = props
  const { EditPurchaseorders, fillPurchaseordernotification, Stockdefines, Files, Stocks, Stocktypes } = props

  const Id = PurchaseorderID || match?.params?.PurchaseorderID

  const t = Profile?.i18n?.t

  const context = useContext(FormContext)

  const [fetchedStocks, setFetchedStocks] = useState(false)
  const [fetchedFiles, setFetchedFiles] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedStocks, setSelectedStocks] = useState([])

  const { selected_record, isLoading } = Purchaseorders

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = context.getForm(PAGE_NAME)
    data.Price = validator.isNumber(Number(data.Price)) ? Number(data.Price) : 0
    data.Stocks = selectedStocks
    data.Deliverytype = validator.isNumber(data.Deliverytype) ? data.Deliverytype : null

    let errors = []
    if (!validator.isString(data.Company)) {
      errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.CompanyRequired') })
    }
    if (!validator.isUUID(data.CaseID)) {
      errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.CaseRequired') })
    }

    if (!validator.isArray(data.Stocks)) {
      errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.StocksRequired') })
    }

    for (const stock of data.Stocks) {

      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)
      const stocktype = (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)
      const Issktneed = stocktype?.Issktneed

      if (!validator.isUUID(stock.StockdefineID)) {
        errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.StockRequired') })
      }
      if (!validator.isUUID(stock.StocktypeID)) {
        errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.StocktypeRequired') })
      }

      if (!validator.isNumber(Number(stock.Amount))) {
        errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.AmountRequired') })
      } else {
        if (Number(stock.Amount) === 0) {
          errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.AmountRequired') })
        }
      }

      if (Issktneed) {
        if (!validator.isISODate(stock.Skt)) {
          errors.push({ type: 'Error', code: t('Pages.Purchaseorder.Page.Header'), description: t('Pages.Purchaseorder.Messages.SktRequired') })
        }
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseordernotification(error)
      })
    } else {
      EditPurchaseorders({ data: { ...Purchaseorders.selected_record, ...data }, history, files: selectedFiles })
    }
  }

  const setselectedFiles = (files) => {
    setSelectedFiles([...files])
  }
  const setselectedStocks = (stocks) => {
    setSelectedStocks([...stocks])
  }

  useEffect(() => {
    if (!isLoading && validator.isObject(selected_record)) {
      context.setForm(PAGE_NAME, { ...selected_record })
    }
  }, [selected_record])

  useEffect(() => {
    if (!fetchedFiles && !Files.isLoading) {
      var files = (Files.list || []).filter(u => u.Isactive && u.ParentID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random(),
          Usagetype: (element.Usagetype.split(',') || []).map(u => {
            return u
          })
        }
      });
      setselectedFiles(files)
      setFetchedFiles(true)
    }
  }, [Files, selected_record, fetchedFiles, setFetchedFiles])

  useEffect(() => {
    if (!fetchedStocks && !Stocks.isLoading) {
      var stocks = (Stocks.list || []).filter(u => u.WarehouseID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random()
        }
      });
      setselectedStocks((stocks || []).map(u => {
        if (validator.isISODate(u.Skt)) {
          return { ...u, Skt: Formatdate(u.Skt) }
        } else {
          return { ...u }
        }
      }))
      setFetchedStocks(true)
    }
  }, [Stocks, selected_record, fetchedStocks, setFetchedStocks])

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetPurchaseorder(Id)
      GetFiles()
      GetStocks()
    } else {
      history.push("/Purchaseorder")
    }
  }, [])

  return (
    Purchaseorders.isLoading ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Purchaseorders"}>
              <Breadcrumb.Section >{t('Pages.Purchaseorder.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Purchaseorder.Page.EditHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <PurchaseorderPrepare
            Preparestatus={2}
            PAGE_NAME={PAGE_NAME}
            selectedFiles={selectedFiles}
            selectedStocks={selectedStocks}
            setselectedFiles={setselectedFiles}
            setselectedStocks={setselectedStocks}
            Profile={Profile}
          />
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={history}
            redirectUrl={"/Purchaseorders"}
            buttonText={t('Common.Button.Goback')}
          />
          <Submitbutton
            isLoading={Purchaseorders.isLoading}
            buttonText={t('Common.Button.Update')}
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}