import React, { Component, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Formatdate from '../../Utils/Formatdate'
import PreregistrationsPrepare from '../../Containers/Preregistrations/PreregistrationsPrepare'
import usePreviousUrl from '../../Hooks/usePreviousUrl'

export default function PreregistrationsEdit(props) {
  const PAGE_NAME = 'PreregistrationsEdit'
  const { GetPatient, GetStocks, GetFiles, fillPatientnotification, EditPatients, match, history } = props
  const { Stockdefines, Stocktypes, Patients, Files, Stocks, Profile } = props

  const [fetched, setFetched] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedStocks, setSelectedStocks] = useState([])
  const { calculateRedirectUrl } = usePreviousUrl()

  const context = useContext(FormContext)

  const t = Profile?.i18n?.t

  const { selected_record, isLoading } = Patients
  const setselectedFiles = (files) => {
    setSelectedFiles([...files])
  }
  const setselectedStocks = (stocks) => {
    setSelectedStocks([...stocks])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const t = Profile?.i18n?.t
    const PatientdefinePagename = `${PAGE_NAME}-Patientdefine`
    let patientdata = context.getForm(PatientdefinePagename)
    let data = context.getForm(PAGE_NAME)
    data.Patientdefine = patientdata
    data.Stocks = selectedStocks

    if (!validator.isISODate(data.Approvaldate)) {
      data.Approvaldate = null
    }
    if (!validator.isISODate(data.Happensdate)) {
      data.Happensdate = null
    }
    if (!validator.isISODate(data.Dateofbirth)) {
      data.Dateofbirth = null
    }

    let errors = []
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.Departmentrequired') })
    }
    if (!validator.isUUID(data.CaseID)) {
      errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.CaseRequired') })
    }
    if (!validator.isISODate(data.Approvaldate)) {
      errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.ApprovaldateRequired') })
    }
    if (!(validator.isUUID(data.PatientdefineID) || (validator.isString(data.Patientdefine?.CountryID) && validator.isCountryID(data.Patientdefine?.CountryID)))) {
      errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.PatientdefineRequired') })
    }

    for (const stock of data.Stocks) {

      const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === stock.StockdefineID)
      const stocktype = (Stocktypes.list || []).find(u => u.Uuid === stockdefine?.StocktypeID)
      const Issktneed = stocktype?.Issktneed

      if (!validator.isUUID(stock.StockdefineID)) {
        errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.StockRequired') })
      }
      if (!validator.isUUID(stock.StocktypeID)) {
        errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.StocktypeRequired') })
      }

      if (!validator.isNumber(Number(stock.Amount))) {
        errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.AmountRequired') })
      } else {
        if (Number(stock.Amount) === 0) {
          errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.AmountRequired') })
        }
      }

      if (Issktneed) {
        if (!validator.isISODate(stock.Skt)) {
          errors.push({ type: 'Error', code: t('Pages.Preregistrations.Page.Header'), description: t('Pages.Preregistrations.Create.Messages.SktRequired') })
        }
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      EditPatients({
        data: { ...Patients.selected_record, ...data },
        history,
        redirectUrl: calculateRedirectUrl({ url: '/Preregistrations', usePrev: true }),
        files: selectedFiles
      })
    }
  }

  useEffect(() => {
    if (selected_record && validator.isObject(selected_record) && !Stocks.isLoading && !Files.isLoading && !fetched) {
      var files = (Files.list || []).filter(u => u.Isactive && u.ParentID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random(),
          Usagetype: (element.Usagetype.split(',') || []).map(u => {
            return u
          })
        }
      });
      var stocks = (Stocks.list || []).filter(u => u.Isactive).filter(u => u.WarehouseID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random()
        }
      });

      setselectedFiles([...files] || [])
      setselectedStocks((stocks || []).map(u => {
        if (validator.isISODate(u.Skt)) {
          return { ...u, Skt: Formatdate(u.Skt) }
        } else {
          return { ...u }
        }
      }))
      setFetched(true)
      context.setForm(PAGE_NAME,
        {
          ...selected_record,
          [`Happensdate`]: Formatdate(selected_record?.Happensdate),
          [`Approvaldate`]: Formatdate(selected_record?.Approvaldate),
        })
    }
  }, [selected_record, Stocks, Files, fetched])

  useEffect(() => {
    if (match.params.PatientID) {
      GetPatient(match.params.PatientID)
      GetStocks()
      GetFiles()
    } else {
      history.push("/Preregistrations")
    }
  }, [])

  return (
    <Pagewrapper dimmer isLoading={isLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Preregistrations"}>
            <Breadcrumb.Section>{t('Pages.Preregistrations.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Preregistrations.Page.CreateHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <PreregistrationsPrepare
          Preparestatus={'edit'}
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
          redirectUrl={"/Preregistrations"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={isLoading}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}