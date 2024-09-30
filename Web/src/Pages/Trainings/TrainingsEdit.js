import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Fileupload from '../../Components/Fileupload'
import { TRAINING_TYPE_COMPANY, TRAINING_TYPE_ORGANIZATION } from '../../Utils/Constants'
import { Formatfulldate } from '../../Utils/Formatdate'
import TrainingsFastAdd from './TrainingsFastAdd'

export default class TrainingsEdit extends Component {

  PAGE_NAME = "TrainingsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      open: false,
      selectedFiles: []
    }
  }

  componentDidMount() {
    const { TrainingID, GetTraining, GetUsagetypes, GetFiles, GetUsers, GetProfessions, match, history } = this.props
    let Id = match?.params?.TrainingID || TrainingID
    if (validator.isUUID(Id)) {
      GetTraining(Id)
      GetUsers()
      GetUsagetypes()
      GetFiles()
      GetProfessions()
    } else {
      history.push("/Trainings")
    }
  }

  componentDidUpdate() {
    const { Trainings, Professions, Users, Usagetypes, Files } = this.props
    const { selected_record, isLoading } = Trainings
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !Professions.isLoading && !Users.isLoading && !Usagetypes.isLoading && !Files.isLoading
      && !isLoading && !this.state.isDatafetched) {
      var response = (Files.list || []).filter(u => u.ParentID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random(),
          Usagetype: (element.Usagetype.split(',') || []).map(u => {
            return u
          })
        }
      });
      this.setState({
        isDatafetched: true,
        selectedFiles: [...response] || []
      })
      this.context.setForm(this.PAGE_NAME, {
        ...selected_record,
        Trainingusers: (selected_record?.Trainingusers || []).map(u => u.UserID),
        Trainingdate: Formatfulldate(selected_record?.Trainingdate)
      })
    }
  }

  setselectedFiles = (files) => {
    this.setState({ selectedFiles: [...files] })
  }

  setOpen = (value) => {
    this.setState({ open: value })
  }

  render() {
    const { Trainings, Users, Usagetypes, Professions, Profile, history, fillTrainingnotification } = this.props

    const t = Profile?.i18n?.t

    const Useroptions = (Users.list || []).filter(u => u.Isactive && u.Isworker).map(user => {
      return { key: user.Uuid, text: `${user?.Name} ${user?.Surname}`, value: user.Uuid }
    })

    const Professionoptions = (Professions.list || []).filter(u => u.Isactive).map(profession => {
      return { key: profession.Uuid, text: profession?.Name, value: profession.Uuid }
    })

    const Trainingtypeoptions = [
      { key: 1, text: t('Common.Training.Type.Organization'), value: TRAINING_TYPE_ORGANIZATION },
      { key: 2, text: t('Common.Training.Type.Company'), value: TRAINING_TYPE_COMPANY }
    ]

    const selectedType = this.context.formstates[`${this.PAGE_NAME}/Type`]

    const isLoading = Trainings.isLoading || Users.isLoading || Professions.isLoading || Usagetypes.isLoading


    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Trainings"}>
                <Breadcrumb.Section >{t('Pages.Trainings.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Trainings.Page.UpdateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <div className='w-full flex justify-end items-center'>
              <Button
                className=' !bg-[#2355a0] !text-white'
                content={t('Pages.Trainings.Column.Fastadd')}
                onClick={() => { this.setOpen(true) }}
              />
            </div>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Type')} name="Type" formtype='dropdown' options={Trainingtypeoptions} />
              </Form.Group>
              {selectedType === TRAINING_TYPE_ORGANIZATION ?
                <Form.Group widths={'equal'}>
                  <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Trainings.Column.EducatoruserID')} name="EducatoruserID" options={Useroptions} formtype="dropdown" />
                </Form.Group>
                : null}
              {selectedType === TRAINING_TYPE_COMPANY ?
                <Form.Group widths={'equal'}>
                  <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Companyname')} name="Companyname" />
                  <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Educator')} name="Educator" />
                </Form.Group>
                : null}
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Trainings.Column.Place')} name="Place" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Trainingdate')} name="Trainingdate" type='datetime-local' />
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Duration')} name="Duration" />
              </Form.Group>
              <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Trainings.Column.Description')} name="Description" />
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Trainingusers')} name="Trainingusers" options={Useroptions} multiple formtype="dropdown" />
            </Form>
            <Fileupload
              fillnotification={fillTrainingnotification}
              Usagetypes={Usagetypes}
              selectedFiles={this.state.selectedFiles}
              setselectedFiles={this.setselectedFiles}
              Profile={Profile}
            />
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Trainings"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Trainings.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
          <TrainingsFastAdd
            context={this.context}
            PAGE_NAME={this.PAGE_NAME}
            open={this.state.open}
            setOpen={this.setOpen}
            fillTrainingnotification={fillTrainingnotification}
            Users={Users}
            Professions={Professions}
            Profile={Profile}
          />
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditTrainings, history, fillTrainingnotification, Profile, Trainings } = this.props
    const t = Profile?.i18n?.t
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Trainings.Page.Header'), description: t('Pages.Trainings.Messages.NameRequired') })
    }
    if (!validator.isNumber(data.Type)) {
      errors.push({ type: 'Error', code: t('Pages.Trainings.Page.Header'), description: t('Pages.Trainings.Messages.TypeRequired') })
    }
    if (data.Type === TRAINING_TYPE_ORGANIZATION) {
      if (!validator.isUUID(data.EducatoruserID)) {
        errors.push({ type: 'Error', code: t('Pages.Trainings.Page.Header'), description: t('Pages.Trainings.Messages.EducatoruserRequired') })
      }
    }
    if (data.Type === TRAINING_TYPE_COMPANY) {
      if (!validator.isString(data.Companyname)) {
        errors.push({ type: 'Error', code: t('Pages.Trainings.Page.Header'), description: t('Pages.Trainings.Messages.CompanynameRequired') })
      }
      if (!validator.isString(data.Educator)) {
        errors.push({ type: 'Error', code: t('Pages.Trainings.Page.Header'), description: t('Pages.Trainings.Messages.EducatorRequired') })
      }
    }

    if (!validator.isString(data.Duration)) {
      errors.push({ type: 'Error', code: t('Pages.Trainings.Page.Header'), description: t('Pages.Trainings.Messages.DurationRequired') })
    }
    if (!validator.isISODate(data.Trainingdate)) {
      errors.push({ type: 'Error', code: t('Pages.Trainings.Page.Header'), description: t('Pages.Trainings.Messages.TrainingdateRequired') })
    }

    if (!validator.isArray(data.Trainingusers)) {
      errors.push({ type: 'Error', code: t('Pages.Trainings.Page.Header'), description: t('Pages.Trainings.Messages.TrainingusersRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillTrainingnotification(error)
      })
    } else {
      EditTrainings({ data: { ...Trainings.selected_record, ...data }, history, files: this.state.selectedFiles })
    }
  }
}
TrainingsEdit.contextType = FormContext