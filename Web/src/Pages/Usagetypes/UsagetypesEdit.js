import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Popup } from 'semantic-ui-react'
import { Breadcrumb, Form } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class UsagetypesEdit extends Component {

  PAGE_NAME = "UsagetypesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      isHavevalue: false
    }
  }

  componentDidMount() {
    const { UsagetypeID, GetUsagetype, match, history } = this.props
    let Id = UsagetypeID || match?.params?.UsagetypeID
    if (validator.isUUID(Id)) {
      GetUsagetype(Id)
    } else {
      history.push("/Usagetypes")
    }
  }

  componentDidUpdate() {
    const { Usagetypes } = this.props
    const { selected_record, isLoading } = Usagetypes
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0
      && !isLoading && !this.state.isDatafetched) {
      if (selected_record?.Name !== selected_record?.Value)
        this.setState({
          isDatafetched: true,
          isHavevalue: !(selected_record?.Name !== selected_record?.Value)
        })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {
    const { Usagetypes, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const additionalicon = <Popup
      trigger={<div
        className='mx-2 cursor-pointer'
        onClick={() => { this.setState({ isHavevalue: !this.state.isHavevalue }) }}
      >
        <Icon name='hand point right' />
      </div>}
      content={t('Pages.Usagetypes.Messages.Newvaluecheck')}
    />

    return (
      Usagetypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Usagetypes"}>
                <Breadcrumb.Section >{t('Pages.Usagetypes.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Usagetypes.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Usagetypes.Column.Name')} name="Name" additionalicon={additionalicon} />
                {this.state.isHavevalue && <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Usagetypes.Column.Value')} name="Value" />}
              </Form.Group>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Usagetypes.Column.Isrequired')} name="Isrequired" formtype={'checkbox'} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Usagetypes"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Usagetypes.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { EditUsagetypes, history, fillUsagetypenotification, Profile, Usagetypes } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Usagetypes.Page.Header'), description: t('Pages.Usagetypes.Messages.NameRequired') })
    }
    if (this.state.isHavevalue) {
      if (!validator.isString(data.Value)) {
        errors.push({ type: 'Error', code: t('Pages.Usagetypes.Page.Header'), description: t('Pages.Usagetypes.Messages.ValueReqired') })
      }
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillUsagetypenotification(error)
      })
    } else {
      EditUsagetypes({ data: { ...Usagetypes.selected_record, ...data }, history })
    }
  }
}
UsagetypesEdit.contextType = FormContext