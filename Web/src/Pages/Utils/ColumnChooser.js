import React, { Component } from 'react'
import { Icon, Button, Modal, Table, Label, Checkbox, Form } from 'semantic-ui-react'
import Literals from './Literals'
import validator from './../../Utils/Validator';

class ColumnChooser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      decoratedColumns: []
    }
  }

  componentDidMount() {
    const { metaKey, meta, columns } = this.props

    let tableMeta = (meta || []).find(u => u.Meta === metaKey)
    if (tableMeta) {
      const metaColumns = JSON.parse(tableMeta.Config)
      const decoratedColumns = metaColumns.length === columns.length ?
        metaColumns.map((item, index) => {
          return { order: index, isVisible: item.isVisible, name: columns.find(u => this.getAccessor(u) === item.key)?.Header, key: item.key, isGroup: item.isGroup }
        }) :
        columns.map((item, index) => {
          return { order: index, isVisible: true, name: item.Header, key: this.getAccessor(item), isGroup: false }
        })
      this.setState({ decoratedColumns: decoratedColumns })
    } else {
      const defaultHiddens = ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"]
      const decoratedColumns = columns.map((item, index) => {
        return { order: index, isVisible: defaultHiddens.includes(this.getAccessor(item)) ? false : true, name: item.Header, key: this.getAccessor(item), isGroup: false }
      })
      this.setState({ decoratedColumns: decoratedColumns })
    }
  }

  componentDidUpdate(prev) {
    const { metaKey, meta, columns } = this.props
    if (prev.metaKey !== metaKey) {
      let tableMeta = (meta || []).find(u => u.Meta === metaKey)
      if (tableMeta) {
        const metaColumns = JSON.parse(tableMeta.Config)
        const decoratedColumns = metaColumns.length === columns.length ?
          metaColumns.map((item, index) => {
            return { order: index, isVisible: item.isVisible, name: columns.find(u => this.getAccessor(item) === item.key)?.Header, key: item.key, isGroup: item.isGroup }
          }) :
          columns.map((item, index) => {
            return { order: index, isVisible: true, name: item.Header, key: this.getAccessor(item), isGroup: false }
          })
        this.setState({ decoratedColumns: decoratedColumns })
      } else {
        const defaultHiddens = ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"]
        const decoratedColumns = columns.map((item, index) => {
          return { order: index, isVisible: defaultHiddens.includes(this.getAccessor(item)) ? false : true, name: item.Header, key: this.getAccessor(item), isGroup: false }
        })
        this.setState({ decoratedColumns: decoratedColumns })
      }
    }
  }

  Cellwrapper = (children, columnname) => {
    const { Profile } = this.props

    return Profile.Ismobile ?
      <div className='w-full flex justify-between items-center'>
        <Label>{columnname}</Label>
        {children}
      </div> :
      children
  }

  render() {

    const { Profile } = this.props
    const { decoratedColumns } = this.state

    return <React.Fragment>
      <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { this.setState({ opened: !this.state.opened }) }} >{Literals.Columns.Visible[Profile.Language]}</Button>
      <Modal
        open={this.state.opened}
        size={'tiny'}
        centered={true}>
        <Modal.Header><Icon name='columns' />{Literals.Page.Pageheader[Profile.Language]}</Modal.Header>
        <Modal.Content scrolling>
          <Table celled className='list-table ' key='product-create-type-conversion-table ' >
            {!Profile.Ismobile &&
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>{Literals.Columns.Columnname[Profile.Language]}</Table.HeaderCell>
                  <Table.HeaderCell width={1}>{Literals.Columns.Order[Profile.Language]}</Table.HeaderCell>
                  <Table.HeaderCell width={2}>{Literals.Columns.Visible[Profile.Language]}</Table.HeaderCell>
                  <Table.HeaderCell width={1}>{Literals.Columns.Group[Profile.Language]}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>}
            <Table.Body>
              {(decoratedColumns.length > 0 ? decoratedColumns.sort((a, b) => a.order - b.order) : []).filter(u => validator.isString(u.name)).map((column, index) => {
                return <Table.Row key={Math.random()}>
                  <Table.Cell className='table-last-section'>
                    {this.Cellwrapper(<Label>{`${column.name}`}</Label>, Literals.Columns.Columnname[Profile.Language])}
                  </Table.Cell>
                  <Table.Cell>
                    {this.Cellwrapper(<Button.Group basic size='small'>
                      <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.orderChanged(column.key, column.order - 1) }} />
                      <Button type='button' disabled={index + 1 === decoratedColumns.length} icon='angle down' onClick={() => { this.orderChanged(column.key, column.order + 1) }} />
                    </Button.Group>, Literals.Columns.Order[Profile.Language])}
                  </Table.Cell>
                  <Table.Cell>
                    {this.Cellwrapper(<Checkbox toggle className='m-2' checked={column.isVisible} onClick={(e) => { this.visibleChanged(column.key) }} />, Literals.Columns.Visible[Profile.Language])}
                  </Table.Cell>
                  <Table.Cell>
                    {this.Cellwrapper(<Checkbox disabled={!column.isVisible} readOnly={!column.isVisible} toggle className='m-2' checked={column.isGroup} onClick={(e) => { column.isVisible && this.groupChanged(column.key) }} />, Literals.Columns.Group[Profile.Language])}
                  </Table.Cell>
                </Table.Row>
              })}
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button type='button' floated='left' negative onClick={() => this.resetTable()}>{Literals.Button.Reset[Profile.Language]}</Button>
          <Form.Group widths={'equal'}>
            <Button type='button' negative onClick={() => this.setState({ opened: false })}>{Literals.Button.Giveup[Profile.Language]}</Button>
            <Button floated='right' type='submit' positive onClick={() => this.saveChanges()}>{Literals.Button.Create[Profile.Language]}</Button>
          </Form.Group>
        </Modal.Actions>
      </Modal>
    </React.Fragment >
  }

  saveChanges = () => {
    const { SaveTableMeta, meta, metaKey } = this.props
    let tableMeta = (meta || []).find(u => u.Meta === metaKey)
    const { decoratedColumns } = this.state
    delete decoratedColumns['name']
    const data = tableMeta ? {
      Id: tableMeta.Id,
      UserID: tableMeta.UserID,
      Meta: tableMeta.Meta,
      Config: JSON.stringify(decoratedColumns)
    } :
      {
        Id: 0,
        UserID: "",
        Meta: metaKey,
        Config: JSON.stringify(decoratedColumns)
      }
    this.setState({ opened: false })
    SaveTableMeta({ data })
  }

  resetTable = () => {
    const { metaKey, ResetTableMeta } = this.props
    ResetTableMeta(metaKey)
  }

  orderChanged = (property, value) => {
    const Columns = this.state.decoratedColumns
    const index = Columns.findIndex(column => column.key === property)
    Columns.filter(column => column.order === value)
      .forEach((column) => column.order = Columns[index].order > value ? column.order + 1 : column.order - 1)
    Columns[index].order = value
    this.setState({ decoratedColumns: Columns })
  }

  visibleChanged = (property) => {
    const Columns = this.state.decoratedColumns
    const index = Columns.findIndex(column => column.key === property)
    Columns[index].isVisible = !Columns[index].isVisible
    if (!Columns[index].isVisible) {
      Columns[index].isGroup = false
    }
    this.setState({ decoratedColumns: Columns })
  }
  groupChanged = (property) => {
    const Columns = this.state.decoratedColumns
    const index = Columns.findIndex(column => column.key === property)
    Columns[index].isGroup = !Columns[index].isGroup
    this.setState({ decoratedColumns: Columns })
  }

  getAccessor = (data) => {
    if (validator.isString(data?.accessor)) {
      return data?.accessor
    } else {
      return data.Header
    }
  }
}


export default ColumnChooser