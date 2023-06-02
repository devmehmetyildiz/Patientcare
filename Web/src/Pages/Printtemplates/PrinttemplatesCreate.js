import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Divider, Dropdown, Form, Grid, GridColumn, Tab } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Editor from "@monaco-editor/react";
import InnerHTML from '../../Utils/DangerouslySetHtmlContent'
export default class PrinttemplatesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedDepartment: "",
      template: ''
    }
    this.templateEditorRef = React.createRef()
  }
  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  componentDidUpdate() {
    const { Departments, Printtemplates, removeDepartmentnotification, removePrinttemplatenotification } = this.props
    Notification(Printtemplates.notifications, removePrinttemplatenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }


  render() {

    const { Printtemplates, Departments } = this.props
    const { isLoading, isDispatching } = Printtemplates

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Printtemplates"}>
                  <Breadcrumb.Section >Yazdırma Tasarımları</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Tab className='station-tab'
                panes={[
                  {
                    menuItem: "Kayıt",
                    pane: {
                      key: 'save',
                      content: <React.Fragment>
                        <Form.Group widths={"equal"}>
                          <Form.Input label="Taslak Adı" placeholder="Taslak Adı" name="Name" fluid />
                          <Form.Input label="Kaynak Değer" placeholder="Kaynak Değer" name="Valuekey" fluid />
                        </Form.Group>
                        <Form.Group widths={"equal"}>
                          <Form.Field>
                            <label className='text-[#000000de]'>Geçerli Departman</label>
                            <Dropdown placeholder='Geçerli Departman' clearable search fluid selection options={Departmentoptions} onChange={(e, { value }) => { this.setState({ selectedDepartment: value }) }} />
                          </Form.Field>
                        </Form.Group>
                      </React.Fragment>
                    }
                  },
                  {
                    menuItem: "Tasarım",
                    pane: {
                      key: 'design',
                      content: <div className='max-h-[calc(66vh-10px)] overflow-y-auto overflow-x-hidden'>
                        <Grid columns={2}>
                          <Grid.Row>
                            <GridColumn>
                              <div className='p-2 shadow-lg shadow-gray-300'>
                                <Editor
                                  height="60vh"
                                  language="html"
                                  value={this.state.template}
                                  onMount={this.handleTemplateEditorDidMount}
                                />
                              </div>
                            </GridColumn>
                            <GridColumn>
                              <div className='p-2 shadow-lg shadow-gray-300'>
                                <InnerHTML html={true ?
                                  this.state.template ? this.state.template : '<div class="print-design-preview-message">No code to show.</div>' :
                                  '<div class="print-design-preview-message">Preview only available in html design</div>'} />
                              </div>
                            </GridColumn>
                          </Grid.Row>
                        </Grid>
                      </div>
                    }
                  }
                ]}
                renderActiveOnly={false} />
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Printtemplates">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Oluştur</Button>
              </div>
            </Form>
          </div>

        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPrinttemplates, history, fillPrinttemplatenotification } = this.props

    const data = formToObject(e.target)
    data.DepartmentID = this.state.selectedDepartment
    data.Printtemplate = this.state.template

    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Yazırma Tasarımları', description: 'İsim Boş Olamaz' })
    }
    if (!data.Valuekey || data.Valuekey === '') {
      errors.push({ type: 'Error', code: 'Yazırma Tasarımları', description: 'Kaynak Değerleri Boş Olamaz' })
    }
    if (!data.DepartmentID || data.DepartmentID === '') {
      errors.push({ type: 'Error', code: 'Yazırma Tasarımları', description: 'Departman seçili değil' })
    }
    if (!data.Printtemplate || data.Printtemplate === '') {
      errors.push({ type: 'Error', code: 'Yazırma Tasarımları', description: 'Tasarım Yazılmadı' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPrinttemplatenotification(error)
      })
    } else {
      AddPrinttemplates(data, history)
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


