import React, { Component, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Icon, Table } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUsersQuery } from '../../Api/Features/Users'
import { fillnotification } from '../../Redux/ProfileSlice'
import { useEditSurveyMutation, useGetSurveyQuery } from '../../Api/Features/Survey'
import { SURVEY_TYPE_PATIENT, SURVEY_TYPE_PATIENTCONTACT, SURVEY_TYPE_USER } from '../../Utils/Constants'
import { DataContext } from '../../Provider/DataProvider'
import Input from '../../Components/Input'


export default function SurveysEdit(props) {
  const PAGE_NAME = "SurveysEdit"

  const dispatch = useDispatch()
  const { closeModal, history, match, SurveyID } = props
  const Id = SurveyID || match?.params?.SurveyID
  const context = useContext(DataContext)
  const Profile = useSelector((state) => state.Profile)
  const [surveydetails, setSurveydetails] = useState([])

  const { data, isFetching: isSurveyFetching, isSuccess: isSurveySuccess } = useGetSurveyQuery(Id, { refetchOnMountOrArgChange: true })
  const { data: Users, isFetching: userIsfetching } = useGetUsersQuery()
  const [EditSurvey, { isLoading }] = useEditSurveyMutation()

  const t = Profile?.i18n?.t

  const Usersoptions = (Users?.list || []).filter(u => u.Isactive).map(user => {
    return { key: user.Uuid, text: `${user.Name} ${user.Surname}`, value: user.Uuid }
  })

  const Surveytypeoption = [
    { key: 1, text: t('Option.Surveytypes.Patient'), value: SURVEY_TYPE_PATIENT },
    { key: 2, text: t('Option.Surveytypes.Patientcontant'), value: SURVEY_TYPE_PATIENTCONTACT },
    { key: 3, text: t('Option.Surveytypes.User'), value: SURVEY_TYPE_USER },
  ]

  useEffect(() => {
    if (isSurveySuccess) {
      setSurveydetails((data?.Surveydetails || []).map(u => {
        return { ...u, key: Math.random() }
      }))
      context.setForm(PAGE_NAME, data)
    }
  }, [isSurveySuccess])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = context.getForm(PAGE_NAME)
    console.log('data: ', data);
    let errors = []
    if (!validator.isNumber(data.Type)) {
      errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.TypeRequired') })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.NameRequired') })
    }
    if (!validator.isUUID(data.PrepareduserID)) {
      errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.PrepareduserRequired') })
    }
    if (!validator.isNumber(data.Minnumber)) {
      errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.MinnumberRequired') })
    }
    if (!validator.isNumber(data.Maxnumber)) {
      errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.MaxnumberRequired') })
    }
    if (!validator.isArray(surveydetails) || surveydetails.length <= 0) {
      errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.SurveydetailsRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        dispatch(fillnotification(error))
      })
    } else {
      EditSurvey({
        data: { ...data, Surveydetails: surveydetails },
        history,
        redirectUrl: "/Surveys",
        successMessage: t('Pages.Surveys.Messages.SuccessEdit'),
        reqType: t('Pages.Surveys.Page.Header'),
        closeModal
      })
    }
  }

  const Add = () => {
    const newDetail = {
      Question: "",
      key: Math.random(),
      Order: surveydetails.length,
    }
    setSurveydetails(prev => [...prev, newDetail])
  }

  const changeHandler = (key, property, value) => {
    let details = surveydetails
    const index = details.findIndex(detail => detail.key === key)
    if (property === 'Order') {
      details.filter(item => item.Order === value)
        .forEach((item) => item.Order = details[index].Order > value ? item.Order + 1 : item.Order - 1)
    }
    details[index][property] = value
    setSurveydetails([...details])
  }

  const remove = (key, order) => {
    let details = surveydetails.filter(detail => detail.key !== key)
    details.filter(detail => detail.Order > order).forEach(detail => detail.Order--)
    setSurveydetails([...details])
  }

  return (userIsfetching || isSurveyFetching || isLoading ? <LoadingPage /> :
    <Pagewrapper>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Surveys"}>
            <Breadcrumb.Section >{t('Pages.Surveys.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Surveys.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <Input page={PAGE_NAME} required placeholder={t('Pages.Surveys.Column.Name')} name="Name" />
            <Input page={PAGE_NAME} placeholder={t('Pages.Surveys.Column.Description')} name="Description" />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <Input page={PAGE_NAME} required placeholder={t('Pages.Surveys.Column.Type')} name="Type" options={Surveytypeoption} formtype='dropdown' />
            <Input page={PAGE_NAME} required placeholder={t('Pages.Surveys.Column.Prepareduser')} name="PrepareduserID" options={Usersoptions} formtype='dropdown' />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <Input page={PAGE_NAME} required placeholder={t('Pages.Surveys.Column.Minnumber')} name="Minnumber" type="number" min={"-1"} max={"100"} />
            <Input page={PAGE_NAME} required placeholder={t('Pages.Surveys.Column.Maxnumber')} name="Maxnumber" type="number" min={"-1"} max={"100"} />
          </Form.Group>
          <Table celled className='list-table' >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1}>{t('Pages.Surveys.Label.Order')}</Table.HeaderCell>
                <Table.HeaderCell>{t('Pages.Surveys.Label.Question')}</Table.HeaderCell>
                <Table.HeaderCell width={1}>{t('Pages.Surveys.Label.Remove')}</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {surveydetails.sort((a, b) => a.Order - b.Order).map((detail, index) => {
                return <Table.Row key={index}>
                  <Table.Cell>
                    <Button.Group basic size='small'>
                      <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { changeHandler(detail.key, 'Order', detail.Order - 1) }} />
                      <Button type='button' disabled={index + 1 === surveydetails.length} icon='angle down' onClick={() => { changeHandler(detail.key, 'Order', detail.Order + 1) }} />
                    </Button.Group>
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Input
                      value={detail.Question}
                      placeholder={t('Pages.Surveys.Label.Question')}
                      fluid
                      onChange={(e) => { changeHandler(detail.key, 'Question', e.target.value) }}
                    />
                  </Table.Cell>
                  <Table.Cell className='table-last-section'>
                    <Icon
                      className='type-conversion-remove-icon'
                      link
                      color='red'
                      name='minus circle'
                      onClick={() => { remove(detail.key, detail.Order) }}
                    />
                  </Table.Cell>
                </Table.Row>
              })}
            </Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='8'>
                  <Button type="button" className='!bg-[#2355a0] !text-white' size='mini' onClick={() => { Add() }}>{t('Pages.Surveys.Label.Add')}</Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Surveys"}
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
