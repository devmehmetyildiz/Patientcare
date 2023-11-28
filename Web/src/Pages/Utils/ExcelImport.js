import React, { Component } from 'react'
import { Icon, Button, Modal, Table, Label, Form } from 'semantic-ui-react'
import Literals from './Literals'
import { read, utils } from 'xlsx';

class ExcelImport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            opened: false,
            columnHeaders: [],
            data: [],
            dataUploaded: false
        }
    }

    componentDidMount() {

    }

    render() {

        const { Profile } = this.props

        return <React.Fragment>
            <Button color='violet' floated='right' onClick={() => { this.setState({ opened: !this.state.opened }) }} >{Literals.Columns.Excelimport[Profile.Language]}</Button>
            <Modal
                open={this.state.opened}
                size={'large'}
                centered={true}>
                <Modal.Header><Icon name='file' />{Literals.Page.Pageheaderexcelimport[Profile.Language]}</Modal.Header>
                <Modal.Content scrolling>
                    {this.state.dataUploaded ?
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    {this.state.columnHeaders.map((key) => {
                                        return <Table.HeaderCell key={Math.random()}>{key}</Table.HeaderCell>
                                    })}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.data.map((row, i) => {
                                    return <Table.Row key={Math.random()}>
                                        {Object.values(row).map((cell, ii) => {
                                            return <Table.Cell key={i + ii}>
                                                <Label >{cell}</Label>
                                            </Table.Cell>
                                        })}
                                    </Table.Row>

                                })}
                            </Table.Body>
                        </Table>
                        : <Form.Input label={Literals.Columns.File} type='file' accept=".xlsx, .xls" fluid onChange={this.handleFileChange} />}
                </Modal.Content>
                <Modal.Actions >
                    <Button className='!m-4' floated='left' type='button' negative onClick={() => this.setState({
                        opened: false,
                        columnHeaders: [],
                        data: [],
                        dataUploaded: false
                    })}>{Literals.Button.Giveup[Profile.Language]}</Button>
                    <Button className='!m-4' floated='right' type='submit' positive onClick={() => this.saveChanges()}>{Literals.Button.Create[Profile.Language]}</Button>
                </Modal.Actions>
            </Modal>
        </React.Fragment>
    }

    handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(sheet, { header: 1 });
            if (jsonData && Array.isArray(jsonData) && jsonData.length > 0) {
                const columnHeaders = jsonData[0];
                const dataArray = jsonData.slice(1).map((row) => {
                    const obj = {};
                    columnHeaders.forEach((header, index) => {
                        obj[header] = String(row[index]);
                    });
                    return obj;
                });
                this.setState({ columnHeaders: columnHeaders, data: dataArray, dataUploaded: true })
            }
        };
        reader.readAsBinaryString(file);
    };

    saveChanges = () => {
        const { addData } = this.props
        addData({ data: this.state.data })
    }

}


export default ExcelImport