import React, { Component, useContext, useEffect, } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { FormContext } from '../../Provider/FormProvider'
import { Formatfulldate } from '../../Utils/Formatdate'
import { USER_INCIDENT_BYCONTACT, USER_INCIDENT_PHYSICAL, USER_INCIDENT_TOPERSONELS } from '../../Utils/Constants'


export default function UserincidentsEdit(props) {
  const PAGE_NAME = "UserincidentsEdit"

  const { Userincidents, Users, Profile, closeModal, history, match, UserincidentID } = props
  const { GetUserincident, GetUsers, EditUserincidents, fillUserincidentnotification } = props

  const context = useContext(FormContext)

  const Id = UserincidentID || match?.params?.UserincidentID
  const t = Profile?.i18n?.t

  const Usersoptions = (Users?.list || []).filter(u => u.Isactive && u.Isworker && u.Isworking).map(user => {
    return { key: user.Uuid, text: `${user.Name} ${user.Surname}`, value: user.Uuid }
  })

  const Typeeoption = [
    { key: 1, text: t('Option.Userincident.Topersonels'), value: USER_INCIDENT_TOPERSONELS },
    { key: 2, text: t('Option.Userincident.Bycontact'), value: USER_INCIDENT_BYCONTACT },
    { key: 3, text: t('Option.Userincident.Physical'), value: USER_INCIDENT_PHYSICAL },
  ]


  const handleSubmit = (e) => {
    e.preventDefault()
    const data = context.getForm(PAGE_NAME)
    let errors = []
    if (!validator.isUUID(data.UserID)) {
      errors.push({ type: 'Error', code: t('Pages.Userincidents.Page.Header'), description: t('Pages.Userincidents.Messages.UserRequired') })
    }
    if (!validator.isNumber(data.Type)) {
      errors.push({ type: 'Error', code: t('Pages.Userincidents.Page.Header'), description: t('Pages.Userincidents.Messages.TypeRequired') })
    }
    if (!validator.isString(data.Event)) {
      errors.push({ type: 'Error', code: t('Pages.Userincidents.Page.Header'), description: t('Pages.Userincidents.Messages.EventRequired') })
    }
    if (!validator.isISODate(data.Occuredtime)) {
      errors.push({ type: 'Error', code: t('Pages.Userincidents.Page.Header'), description: t('Pages.Userincidents.Messages.OccuredtimeRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUserincidentnotification(error)
      })
    } else {
      EditUserincidents({
        data: { ...Userincidents.selected_record, ...data },
        history,
        redirectUrl: "/Userincidents",
        closeModal
      })
    }
  }

  useEffect(() => {
    GetUsers()
    if (validator.isUUID(Id)) {
      GetUserincident(Id)
    } else {
      fillUserincidentnotification({
        type: 'Error',
        code: t('Pages.Userincidents.Page.Header'),
        description: t('Pages.Userincidents.Messages.UnsupportedUserincident'),
      });
    }
  }, [])

  useEffect(() => {
    if (!Userincidents.isLoading && validator.isObject(Userincidents.selected_record)) {
      context.setForm(PAGE_NAME, {
        ...Userincidents.selected_record,
        Occuredtime: Formatfulldate(Userincidents?.selected_record?.Occuredtime),
      })
    }
  }, [Userincidents.selected_record])

  return (Userincidents.isLoading || Users.isLoading ? <LoadingPage /> :
    <Pagewrapper>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Userincidents"}>
            <Breadcrumb.Section >{t('Pages.Userincidents.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Userincidents.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Userincidents.Column.User')} name="UserID" options={Usersoptions} formtype='dropdown' />
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Userincidents.Column.Occuredtime')} name="Occuredtime" type="datetime-local" />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Userincidents.Column.Type')} name="Type" options={Typeeoption} formtype='dropdown' />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Userincidents.Column.Event')} name="Event" />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Userincidents.Column.Eventdetail')} name="Eventdetail" />
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Userincidents.Column.Result')} name="Result" />
          </Form.Group>
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Userincidents"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Userincidents.isLoading}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}
