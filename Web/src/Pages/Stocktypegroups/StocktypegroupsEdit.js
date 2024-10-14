import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import StocktypesCreate from '../../Containers/Stocktypes/StocktypesCreate'

export default class StocktypegroupsEdit extends Component {

  PAGE_NAME = "StocktypegroupsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetStocktypegroup, match, history, GetStocktypes, StocktypegroupID } = this.props
    let Id = StocktypegroupID || match.params.StocktypegroupID
    if (validator.isUUID(Id)) {
      GetStocktypegroup(Id)
      GetStocktypes()
    } else {
      history.push("/Stocktypegroups")
    }
  }

  componentDidUpdate() {
    const { Stocktypegroups, Stocktypes } = this.props
    const { selected_record, isLoading } = Stocktypegroups
    if (selected_record &&
      Object.keys(selected_record).length > 0 &&
      selected_record.Id !== 0 &&
      Stocktypes.list.length > 0 &&
      !Stocktypes.isLoading &&
      !isLoading &&
      !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Stocktypes: (selected_record?.Stocktypes || '').split(',') })
    }
  }

  render() {

    const { Stocktypes, Stocktypegroups, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const Stocktypesoption = (Stocktypes.list || []).filter(u => u.Isactive).map(type => {
      return { key: type.Uuid, text: type.Name, value: type.Uuid }
    })

    return (
      Stocktypegroups.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stocktypegroups"}>
                <Breadcrumb.Section >{t('Pages.Stocktypegroups.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Stocktypegroups.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypegroups.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Stocktypegroups.Column.Info')} name="Info" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Stocktypegroups.Column.Stocktypes')} options={Stocktypesoption} name="Stocktypes" formtype='dropdown' multiple modal={StocktypesCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stocktypegroups"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Stocktypegroups.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditStocktypegroups, history, fillStocktypegroupnotification, Stocktypegroups, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Stocktypegroups.Page.Header'), description: t('Pages.Stocktypegroups.Messages.NameRequired') })
    }
    if (!validator.isArray(data.Stocktypes)) {
      errors.push({ type: 'Error', code: t('Pages.Stocktypegroups.Page.Header'), description: t('Pages.Stocktypegroups.Messages.StocktypesRequired') })
    }
    data.Stocktypes = (data.Stocktypes || []).join(',')

    if (errors.length > 0) {
      errors.forEach(error => {
        fillStocktypegroupnotification(error)
      })
    } else {
      EditStocktypegroups({ data: { ...Stocktypegroups.selected_record, ...data }, history })
    }
  }
}
StocktypegroupsEdit.contextType = FormContext