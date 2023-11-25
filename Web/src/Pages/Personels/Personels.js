import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Icon, Modal } from 'semantic-ui-react'
import { Breadcrumb, Button, Grid, GridColumn, Header } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import NoDataScreen from '../../Utils/NoDataScreen'
import ColumnChooser from '../../Containers/Utils/ColumnChooser'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import PersonelsDelete from '../../Containers/Personels/PersonelsDelete'
import MobileTable from '../../Utils/MobileTable'
import Settings from '../../Common/Settings'
import { getInitialconfig } from '../../Utils/Constants'
export default class Periods extends Component {


  componentDidMount() {
    const { GetPersonels } = this.props
    GetPersonels()
  }

  render() {

    const { Personels, Profile, handleDeletemodal, handleSelectedPersonel, AddRecordPersonels } = this.props
    const { isLoading, isDispatching } = Personels

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name' },
      { Header: Literals.Columns.Surname[Profile.Language], accessor: 'Surname' },
      { Header: Literals.Columns.CountryID[Profile.Language], accessor: 'CountryID' },
      { Header: Literals.Columns.Professions[Profile.Language], accessor: 'Professions', Cell: col => this.professionCellhandler(col) },
      { Header: Literals.Columns.Workstarttime[Profile.Language], accessor: 'Workstarttime', Cell: col => this.dateCellhandler(col) },
      { Header: Literals.Columns.Gender[Profile.Language], accessor: 'Gender', Cell: col => this.genderCellhandler(col) },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Personels"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Personels.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Personels/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPersonel(item)
          handleDeletemodal(true)
        }} />
      }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Personels"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Personels/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  AddRecord={AddRecordPersonels}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                  Showexcelimport
                />
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
              </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
            }
          </Pagewrapper>
          <PersonelsDelete />
        </React.Fragment>
    )
  }

  dateCellhandler = (col) => {
    if (col.value) {
      return col.value.split('T').length > 0 ? col.value.split('T')[0] : col.value
    }
    return null
  }

  genderCellhandler = (col) => {
    const { Profile } = this.props
    const Genderoptions = [
      { key: 0, text: Literals.Options.Genderoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Genderoptions.value1[Profile.Language], value: "1" }
    ]
    return Genderoptions.find(u => u.value === col.value)?.text
  }

  professionCellhandler = (col) => {
    const { Profile } = this.props
    const Professionoptions = [
      { key: 0, text: Literals.Options.Professionoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Professionoptions.value1[Profile.Language], value: "1" },
      { key: 2, text: Literals.Options.Professionoptions.value2[Profile.Language], value: "2" },
      { key: 3, text: Literals.Options.Professionoptions.value3[Profile.Language], value: "3" },
      { key: 4, text: Literals.Options.Professionoptions.value4[Profile.Language], value: "4" },
    ]
    return Professionoptions.find(u => u.value === col.value)?.text
  }
}
