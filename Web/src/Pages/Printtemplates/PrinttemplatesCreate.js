import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button, Tab, Grid } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import Editor from "@monaco-editor/react";
import InnerHTML from '../../Utils/DangerouslySetHtmlContent'
export default class PrinttemplatesCreate extends Component {

  PAGE_NAME = 'PrinttemplatesCreate'

  constructor(props) {
    super(props)
    this.state = {
      template: ''
    }
    this.templateEditorRef = React.createRef()
  }

  render() {

    const { Printtemplates, Profile, history, closeModal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Printtemplates

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Printtemplates"}>
                <Breadcrumb.Section >{t('Pages.Printtemplates.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Printtemplates.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Tab className='station-tab'
                panes={[
                  {
                    menuItem: t('Pages.Printtemplates.Column.Savescreen'),
                    pane: {
                      key: 'save',
                      content: <React.Fragment>
                        <Form.Group widths={"equal"}>
                          <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Printtemplates.Column.Name')} name="Name" />
                        </Form.Group>
                      </React.Fragment>
                    }
                  },
                  {
                    menuItem: t('Pages.Printtemplates.Column.Editorscreen'),
                    pane: {
                      key: 'design',
                      content: <div className='max-h-[calc(66vh-10px)] overflow-y-auto overflow-x-hidden'>
                        <Grid columns={2}>
                          <Grid.Row>
                            <Grid.Column>
                              <div className='p-2 shadow-lg shadow-gray-300'>
                                <Editor
                                  height="60vh"
                                  language="html"
                                  value={this.state.template}
                                  onMount={this.handleTemplateEditorDidMount}
                                />
                              </div>
                            </Grid.Column>
                            <Grid.Column>
                              <div className='p-2 shadow-lg shadow-gray-300'>
                                <InnerHTML html={true ?
                                  this.state.template ? this.state.template : '<div class="print-design-preview-message">No code to show.</div>' :
                                  '<div class="print-design-preview-message">Preview only available in html design</div>'} />
                              </div>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </div>
                    }
                  }
                ]}
                renderActiveOnly={false} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Form.Group widths={'equal'}>
              <Gobackbutton
                history={history}
                redirectUrl={"/Printtemplates"}
                buttonText={t('Common.Button.Goback')}
              />
              <Button floated="right" type="button" color='grey' onClick={(e) => {
                this.setState({ template: '' })
              }}>{t('Common.Button.Clear')}</Button>
            </Form.Group>
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

    const { AddPrinttemplates, history, fillPrinttemplatenotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Printtemplate = this.state.template

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Printtemplates.Page.Header'), description: t('Pages.Printtemplates.Messages.NameRequired') })
    }
    if (!validator.isString(data.Printtemplate)) {
      errors.push({ type: 'Error', code: t('Pages.Printtemplates.Page.Header'), description: t('Pages.Printtemplates.Messages.Printtemplaterequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPrinttemplatenotification(error)
      })
    } else {
      AddPrinttemplates({ data, history, closeModal })
    }
  }


  handleTemplateEditorChange = () => {
    this.setState({ template: this.templateEditorRef.current.getValue() })
  }

  handleTemplateEditorDidMount = (editor, monaco) => {
    this.templateEditorRef.current = editor
    this.templateEditorRef.current.onDidChangeModelContent(this.handleTemplateEditorChange)
  }


}
PrinttemplatesCreate.contextType = FormContext

