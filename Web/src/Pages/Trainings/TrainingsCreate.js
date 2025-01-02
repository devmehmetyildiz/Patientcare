import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { TRAINING_TYPE_COMPANY, TRAINING_TYPE_ORGANIZATION, TRAINING_TYPEDETAIL_PATIENT, TRAINING_TYPEDETAIL_PATIENTCONTACT, TRAINING_TYPEDETAIL_USER } from '../../Utils/Constants'
import Fileupload from '../../Components/Fileupload'
import TrainingsFastAdd from './TrainingsFastAdd'
import usePreviousUrl from '../../Hooks/usePreviousUrl'

export default function TrainingsCreate(props) {
  const PAGE_NAME = "TrainingsCreate"
  const { Trainings, Users, Usagetypes, Professions, Patients, Patientdefines, Profile, history, closeModal, } = props
  const { GetUsers, GetProfessions, GetUsagetypes, GetPatients, GetPatientdefines, fillTrainingnotification, AddTrainings } = props

  const { calculateRedirectUrl } = usePreviousUrl()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [open, setOpen] = useState(false)
  const context = useContext(FormContext)

  const t = Profile?.i18n?.t


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
        return []
    }
  }, [selectedTypedetail])

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
      AddTrainings({
        data,
        history,
        closeModal,
        redirectUrl: calculateRedirectUrl({ url: '/Trainings', usePrev: true }),
        files: selectedFiles
      })
    }
  }

  useEffect(() => {
    GetUsers()
    GetProfessions()
    GetUsagetypes()
    GetPatients()
    GetPatientdefines()
  }, [])

  return (
    isLoading ? <LoadingPage /> :
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Trainings"}>
              <Breadcrumb.Section >{t('Pages.Trainings.Page.Header')}</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>{t('Pages.Trainings.Page.CreateHeader')}</Breadcrumb.Section>
          </Headerbredcrump>
          {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
            buttonText={t('Common.Button.Create')}
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