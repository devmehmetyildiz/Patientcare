import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import Fileupload from '../../Components/Fileupload'
import {
  TRAINING_TYPE_COMPANY, TRAINING_TYPE_ORGANIZATION, TRAINING_TYPEDETAIL_PATIENT,
  TRAINING_TYPEDETAIL_PATIENTCONTACT, TRAINING_TYPEDETAIL_USER
} from '../../Utils/Constants'
import { Formatfulldate } from '../../Utils/Formatdate'
import TrainingsFastAdd from './TrainingsFastAdd'
import usePreviousUrl from '../../Hooks/usePreviousUrl'


export default function TrainingsEdit(props) {

  const PAGE_NAME = "TrainingsEdit"

  const { TrainingID, Trainings, Professions, Users, Usagetypes, Files, Patients, Patientdefines, match, history, Profile } = props
  const { GetTraining, GetUsagetypes, GetFiles, GetUsers, GetProfessions, GetPatients, GetPatientdefines, fillTrainingnotification, EditTrainings } = props

  const t = Profile?.i18n?.t

  const { calculateRedirectUrl } = usePreviousUrl()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [open, setOpen] = useState(false)
  const context = useContext(FormContext)

  const typedetailOption = [
    { key: 1, text: t('Option.Training.TypedetailUser'), value: TRAINING_TYPEDETAIL_USER },
    { key: 2, text: t('Option.Training.TypedetailPatient'), value: TRAINING_TYPEDETAIL_PATIENT },
    { key: 3, text: t('Option.Training.TypedetailPatientcontact'), value: TRAINING_TYPEDETAIL_PATIENTCONTACT },
  ]

  const Useroptions = useMemo(() => (Users.list || []).filter(u => u.Isactive && u.Isworker).map(user => {
    return { key: user.Uuid, text: `${user?.Name} ${user?.Surname}`, value: user.Uuid }
  }), [Users.list])

  const Patientsoptions = useMemo(() => (Patients?.list || []).filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration).map(patient => {
    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    return { key: patient.Uuid, text: `${patientdefine.Firstname} ${patientdefine.Lastname}`, value: patient.Uuid }
  }), [Patients.list, Patientdefines.list])

  const Patientcontactsoptions = useMemo(() => (Patients.list || [])
    .filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration)
    .flatMap(patient => {
      let resArr = []
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

      const contactname1Base = patientdefine?.Contactname1
      const contactname2Base = patientdefine?.Contactname2

      const contactName1 = `${contactname1Base} (${patientdefine?.Firstname} ${patientdefine?.Lastname})`
      const contactName2 = `${contactname2Base} (${patientdefine?.Firstname} ${patientdefine?.Lastname})`

      if (contactname1Base && (contactname1Base || '').trim().length > 0) {
        resArr.push({
          key: `${patientdefine?.Uuid}-1`,
          text: contactName1,
          value: contactName1,
        })
      }

      if (contactname2Base && (contactname2Base || '').trim().length > 0) {
        resArr.push({
          key: `${patientdefine?.Uuid}-1`,
          text: contactName2,
          value: contactName2,
        })
      }
      return resArr
    }), [Patients.list, Patientdefines.list])


  const Trainingtypeoptions = [
    { key: 1, text: t('Common.Training.Type.Organization'), value: TRAINING_TYPE_ORGANIZATION },
    { key: 2, text: t('Common.Training.Type.Company'), value: TRAINING_TYPE_COMPANY }
  ]

  const selectedType = context.formstates[`${PAGE_NAME}/Type`]
  const selectedTypedetail = context.formstates[`${PAGE_NAME}/Typedetail`]

  const TraningUserOption = useMemo(() => {
    switch (selectedTypedetail) {
      case TRAINING_TYPEDETAIL_USER:
        return Useroptions
      case TRAINING_TYPEDETAIL_PATIENT:
        return Patientsoptions
      case TRAINING_TYPEDETAIL_PATIENTCONTACT:
        return Patientcontactsoptions
      default:
        return Useroptions
    }
  }, [selectedTypedetail, Useroptions, Patientsoptions, Patientcontactsoptions])

  const isLoading = Trainings.isLoading || Users.isLoading || Professions.isLoading || Usagetypes.isLoading || Patients.isLoading || Patientdefines.isLoading

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = context.getForm(PAGE_NAME)
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
      EditTrainings({
        data: { ...Trainings.selected_record, ...data },
        history,
        redirectUrl: calculateRedirectUrl({ url: '/Trainings', usePrev: true }),
        files: selectedFiles
      })
    }
  }

  useEffect(() => {
    const Id = match?.params?.TrainingID || TrainingID
    if (validator.isUUID(Id)) {
      GetTraining(Id)
      GetUsers()
      GetUsagetypes()
      GetFiles()
      GetProfessions()
      GetPatients()
      GetPatientdefines()
    } else {
      fillTrainingnotification({
        type: 'Error',
        code: t('Pages.Trainings.Page.Header'),
        description: t('Pages.Trainings.Messages.UnsupportedTraining'),
      });
      history.push("/Trainings")
    }
  }, [])

  useEffect(() => {
    const { selected_record } = Trainings
    if (!Trainings.isLoading && validator.isObject(Trainings.selected_record) && !Files.isLoading) {
      var response = (Files.list || []).filter(u => u.Isactive && u.ParentID === selected_record?.Uuid).map(element => {
        return {
          ...element,
          key: Math.random(),
          Usagetype: (element.Usagetype.split(',') || []).map(u => {
            return u
          })
        }
      });
      let userData = {}
      switch (selected_record?.Typedetail) {
        case TRAINING_TYPEDETAIL_USER:
          userData.Trainingusers = (selected_record?.Trainingusers || []).map(u => u.UserID)
          break;
        case TRAINING_TYPEDETAIL_PATIENT:
          userData.Trainingusers = (selected_record?.Trainingusers || []).map(u => u.PatientID)
          break;
        case TRAINING_TYPEDETAIL_PATIENTCONTACT:
          userData.Trainingusers = (selected_record?.Trainingusers || []).map(u => u.Patientcontact)
          break;
      }
      context.setForm(PAGE_NAME, {
        ...Trainings.selected_record,
        Trainingdate: Formatfulldate(selected_record?.Trainingdate),
        ...userData
      })
      setSelectedFiles(response)
    }
  }, [Trainings.selected_record, Files.list])

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
          {selectedTypedetail === TRAINING_TYPEDETAIL_USER ?
            <div className='w-full flex justify-end items-center'>
              <Button
                className=' !bg-[#2355a0] !text-white'
                content={t('Pages.Trainings.Column.Fastadd')}
                onClick={() => { setOpen(true) }}
              />
            </div> : null}
          <Form>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Type')} name="Type" formtype='dropdown' options={Trainingtypeoptions} />
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Typedetail')} name="Typedetail" formtype='dropdown' options={typedetailOption} />
            </Form.Group>
            {selectedType === TRAINING_TYPE_ORGANIZATION ?
              <Form.Group widths={'equal'}>
                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.EducatoruserID')} name="EducatoruserID" options={Useroptions} formtype="dropdown" />
              </Form.Group>
              : null}
            {selectedType === TRAINING_TYPE_COMPANY ?
              <Form.Group widths={'equal'}>
                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Companyname')} name="Companyname" />
                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Educator')} name="Educator" />
              </Form.Group>
              : null}
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Name')} name="Name" />
              <FormInput page={PAGE_NAME} placeholder={t('Pages.Trainings.Column.Place')} name="Place" />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Trainingdate')} name="Trainingdate" type='datetime-local' />
              <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Duration')} name="Duration" />
            </Form.Group>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Trainings.Column.Description')} name="Description" />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Trainings.Column.Trainingusers')} name="Trainingusers" options={TraningUserOption} multiple formtype="dropdown" />
          </Form>
          <Fileupload
            fillnotification={fillTrainingnotification}
            Usagetypes={Usagetypes}
            selectedFiles={selectedFiles}
            setselectedFiles={setSelectedFiles}
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
            submitFunction={handleSubmit}
          />
        </Footerwrapper>
        <TrainingsFastAdd
          context={context}
          PAGE_NAME={PAGE_NAME}
          open={open}
          setOpen={setOpen}
          fillTrainingnotification={fillTrainingnotification}
          Users={Users}
          Professions={Professions}
          Profile={Profile}
        />
      </Pagewrapper >
  )
}