import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
import Literals from './Literals'
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import validator from '../../Utils/Validator';
class ExcelExport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
    }
  }

  componentDidMount() {

  }

  render() {

    const { Profile } = this.props

    return <React.Fragment>
      <Button color='violet' floated='right' onClick={this.exportToExcel} >{Literals.Columns.Excelexport[Profile.Language]}</Button>
    </React.Fragment>
  }


  exportToExcel = () => {
    const { data, name, Config, columns } = this.props
    const isHavedata = Array.isArray(data) && data.length > 0
    let decoratedColumns = {}
    columns.forEach(element => {
      decoratedColumns[element.accessor] = element.accessor
    });
    const decoratedData = data.map(row => {
      let obj = {}
      Object.keys(row).forEach(cell => {
        if (!validator.isObject(row[cell])) {
          obj[cell] = row[cell]
        }
      })
      return obj
    })
    const headers = Object.keys(isHavedata ? decoratedData[0] : decoratedColumns)
      .map(key => {
        if (!(((Config.hiddenColumns).concat(['edit', 'delete', 'Isactive', 'Deleteduser', 'Deletetime']) || []).includes(key))) { return key; } return '';
      })
      .filter(key => key !== '');
    const exceldata = new Array(headers).concat(decoratedData.map(value => {
      let filteredValue = Object.keys(value).map(key => {
        if (headers.includes(key)) {
          return value[key]
        } else {
          return null
        }
      }).filter(key => key !== null);
      return filteredValue
    }))
    const worksheet = utils.aoa_to_sheet(exceldata);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, `${name}.xlsx`);
  }
};



export default ExcelExport