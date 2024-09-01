import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Formatdate from '../../Utils/Formatdate'
import PreregistrationsPrepare from '../../Containers/Preregistrations/PreregistrationsPrepare'
export default class PreregistrationsEdit extends Component {

  PAGE_NAME = 'PreregistrationsEdit'

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      selectedFiles: [],
      selectedStocks: [],
    }
  }

  componentDidMount() {
    const { GetPatient, GetStocks, GetFiles, match, history } = this.props
    if (match.params.PatientID) {
      GetPatient(match.params.PatientID)
      GetStocks()
      GetFiles()
    } else {
      history.push("/Preregistrations")
    }
  }

  componentDidUpdate() {
    const { Patients, Files, Stocks } = this.props
    const { selected_record, isLoading } = Patients
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !isLoading && !Files.isLoading && !Stocks.isLoading && !this.state.isDatafetched) {
      var files = (Files.list || []).filter(u => u.ParentID === selected_record?.Uuid).map(element => {
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
      this.context.setForm(this.PAGE_NAME,
        {
          ...selected_record,
          [`Happensdate`]: Formatdate(selected_record?.Registerdate),
          [`Approvaldate`]: Formatdate(selected_record?.Approvaldate),
          [`Registerdate`]: Formatdate(selected_record?.Registerdate),
        })
    }
  }


  render() {

    const { Patients, history, Profile } = this.props
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
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <PreregistrationsPrepare
              Preparestatus={'edit'}
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
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { fillPatientnotification, Patients, EditPatients, history, Profile, Stockdefines, Stocktypes } = this.props
    const t = Profile?.i18n?.t
    const PatientdefinePagename = `${this.PAGE_NAME}-Patientdefine`
    let patientdata = this.context.getForm(PatientdefinePagename)
    let data = this.context.getForm(this.PAGE_NAME)
    data.Patientdefine = patientdata
    data.Stocks = this.state.selectedStocks

    if (!validator.isISODate(data.Registerdate)) {
      data.Registerdate = null
    }
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
      EditPatients({ data: { ...Patients.selected_record, ...data }, history, redirectUrl: "/Preregistrations", files: this.state.selectedFiles })
    }
  }

  setselectedFiles = (files) => {
    this.setState({ selectedFiles: [...files] })
  }
  setselectedStocks = (stocks) => {
    this.setState({ selectedStocks: [...stocks] })
  }
}
PreregistrationsEdit.contextType = FormContext