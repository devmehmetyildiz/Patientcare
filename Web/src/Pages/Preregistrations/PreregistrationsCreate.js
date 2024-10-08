import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PreregistrationsPrepare from '../../Containers/Preregistrations/PreregistrationsPrepare'
export default class PreregistrationsCreate extends Component {

  PAGE_NAME = 'PreregistrationsCreate'

  constructor(props) {
    super(props)
    this.state = {
      selectedFiles: [],
      selectedStocks: [],
    }
  }

  render() {

    const { Patients, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t
    const { isLoading } = Patients

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Preregistrations"}>
                <Breadcrumb.Section>{t('Pages.Preregistrations.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Preregistrations.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <PreregistrationsPrepare
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
              redirectUrl={"/Preregistrations"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { fillPatientnotification, AddPatients, history, Profile, closeModal, Stocktypes, Stockdefines } = this.props
    const t = Profile?.i18n?.t
    const PatientdefinePagename = `${this.PAGE_NAME}-Patientdefine`
    let patientdata = this.context.getForm(PatientdefinePagename)
    let data = this.context.getForm(this.PAGE_NAME)
    data.Patientdefine = patientdata
    data.Stocks = this.state.selectedStocks
    console.log('data: ', data);

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
      console.log('data.DepartmentID: ', data.DepartmentID);

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
      AddPatients({ data, history, redirectUrl: "/Preregistrations", closeModal, files: this.state.selectedFiles })
    }
  }

  setselectedFiles = (files) => {
    this.setState({ selectedFiles: [...files] })
  }
  setselectedStocks = (stocks) => {
    this.setState({ selectedStocks: [...stocks] })
  }

}
PreregistrationsCreate.contextType = FormContext