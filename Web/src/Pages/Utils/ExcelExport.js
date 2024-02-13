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

  render() {

    const { Profile } = this.props

    return <React.Fragment>
      <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={this.exportToExcel} >{Literals.Columns.Excelexport[Profile.Language]}</Button>
    </React.Fragment>
  }

  exportToExcel = () => {
    const { data, name, Config, columns } = this.props

    let excelData = []

    let headerRow = []
    columns.forEach(col => {
      const accessor = validator.isString(col.accessor) ? col.accessor : col.Header;
      const hiddenColumns = Config?.hiddenColumns || ['edit', 'delete', 'Isactive', 'Deleteduser', 'Deletetime'];
      if (!hiddenColumns.includes(accessor) && !col.disableProps) {
        headerRow.push(col.Header)
      }
    })
    excelData.push(headerRow)
    data.forEach(row => {
      let dataRow = []
      columns.forEach(col => {
        const accessor = validator.isString(col.accessor) ? col.accessor : col.Header;
        const hiddenColumns = Config?.hiddenColumns || ['edit', 'delete', 'Isactive', 'Deleteduser', 'Deletetime'];
        if (!hiddenColumns.includes(accessor) && !col.disableProps) {
          let isAccessor = columns.find(u => u.accessor === accessor)
            ? true
            : false

          let cellData = null
          if (isAccessor) {
            cellData = row[accessor] || ''
          } else {
            let renderer = columns.find(u => u.Header === accessor)
            cellData = renderer.accessor(row, true) || ''
          }
          dataRow.push(cellData)
        }
      })
      excelData.push(dataRow)
    })
    const worksheet = utils.aoa_to_sheet(excelData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, `${name}.xlsx`);
  }

}
export default ExcelExport