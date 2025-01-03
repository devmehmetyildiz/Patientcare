import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

import PurchaseorderPrepare from '../../Containers/Purchaseorders/PurchaseorderPrepare'

export default function PurchaseordersCreate(props) {

  const PAGE_NAME = "PurchaseordersCreate"

  const { Purchaseorders, history, Profile, closeModal } = props
  const { AddPurchaseorders, fillPurchaseordernotification, Stockdefines, Stocktypes } = props

  const t = Profile?.i18n?.t

  const context = useContext(FormContext)

  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedStocks, setSelectedStocks] = useState([])

  const setselectedFiles = (files) => {
    setSelectedFiles([...files])
  }
  const setselectedStocks = (stocks) => {
    setSelectedStocks([...stocks])
  }

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
      AddPurchaseorders({ data, history, closeModal, files: selectedFiles })
    }
  }

  return (
    Purchaseorders.isLoading ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Purchaseorders"}>
              <Breadcrumb.Section >{t('Pages.Purchaseorder.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Purchaseorder.Page.CreateHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
          {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
            buttonText={t('Common.Button.Create')}
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}