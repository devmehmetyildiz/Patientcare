import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import StocktypesCreate from '../../Containers/Stocktypes/StocktypesCreate'

export default class StocktypegroupsCreate extends Component {

  PAGE_NAME = "StocktypegroupsCreate"

  constructor(props) {
    super(props)
    this.state = {
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetStocktypes } = this.props
    GetStocktypes()
  }

  render() {
    const { Stocktypes, Stocktypegroups, history, Profile, closeModal } = this.props

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
              <Breadcrumb.Section>{t('Pages.Stocktypegroups.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
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
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddStocktypegroups, history, fillStocktypegroupnotification, Profile, closeModal } = this.props

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
      AddStocktypegroups({ data, history, closeModal })
    }
  }
}
StocktypegroupsCreate.contextType = FormContext