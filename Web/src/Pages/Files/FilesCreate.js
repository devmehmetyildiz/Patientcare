import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Table } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
export class FilesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedFiles: []
    }
  }

  componentDidUpdate() {
    const { Files, removeFilenotification } = this.props
    Notification(Files.notifications, removeFilenotification)
  }

  render() {

    const { isLoading, isDispatching, Profile } = this.props

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Files"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form onSubmit={this.handleSubmit}>
              <Table celled className='list-table' key='product-create-type-conversion-table' >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={3}>{Literals.Columns.Filename[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={3}>{Literals.Columns.ParentID[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={3}>{Literals.Columns.Usagetype[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={9}>{Literals.Columns.File[Profile.Language]}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.selectedFiles.map((file, index) => {
                    return <Table.Row key={index}>
                      <Table.Cell>
                        <Form.Input placeholder={Literals.Columns.Filename[Profile.Language]} name="Name" fluid value={file.Name} onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'Name', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input placeholder={Literals.Columns.ParentID[Profile.Language]} name="ParentID" fluid value={file.ParentID} onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'ParentID', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input placeholder={Literals.Columns.Usagetype[Profile.Language]} name="Usagetype" fluid value={file.Usagetype} onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'Usagetype', e.target.value) }} />
                      </Table.Cell>
                      <Table.Cell>
                        <Form.Input placeholder={Literals.Columns.File[Profile.Language]} type='file' name="File" fluid value={file?.File?.file} onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'File', e) }} />
                      </Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan='6'>
                      <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewFile() }}>{Literals.Button.AddFile[Profile.Language]}</Button>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
              <Footerwrapper>
                <Link to="/Files">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddFiles, history, fillFilenotification, Profile } = this.props
    const files = this.state.selectedFiles

    files.forEach(data => {
      delete data.key
    });

    const formData = new FormData();
    files.forEach((data, index) => {
      Object.keys(data).forEach(element => {
        formData.append(`list[${index}].${element}`, data[element])
      });
    })

    let errors = []
    if (!validator.isArray(this.state.selectedFiles)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Filesrequired[Profile.Language] })
    }
    this.state.selectedFiles.forEach(data => {
      if (!validator.isString(data.Name)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
      }
    });
    if (errors.length > 0) {
      errors.forEach(error => {
        fillFilenotification(error)
      })
    } else {
      AddFiles({ data: formData, history })
    }
  }

  AddNewFile = () => {
    this.setState({
      selectedFiles: [...this.state.selectedFiles,
      {
        Name: '',
        ParentID: '',
        Filename: '',
        Filefolder: '',
        Filepath: '',
        Filetype: '',
        Usagetype: '',
        Canteditfile: false,
        File: {},
        key: Math.random(),
      }]
    })
  }


  selectedFilesChangeHandler = (key, property, value) => {
    let selectedFiles = this.state.selectedFiles
    const index = selectedFiles.findIndex(file => file.key === key)
    if (property === 'File') {
      if (value.target.files && value.target.files.length > 0) {
        selectedFiles[index][property] = value.target.files[0]
      }
    } else {
      selectedFiles[index][property] = value
    }
    this.setState({ selectedFiles: selectedFiles })
  }

}
export default FilesCreate
