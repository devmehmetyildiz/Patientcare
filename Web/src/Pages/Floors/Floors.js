import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon } from 'semantic-ui-react'
import Literals from './Literals'
import FloorsDelete from '../../Containers/Floors/FloorsDelete'
import FloorsFastcreate from '../../Containers/Floors/FloorsFastcreate'
import { getInitialconfig } from '../../Utils/Constants'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'

export default class Floors extends Component {

  componentDidMount() {
    const { GetFloors } = this.props
    GetFloors()
  }

  render() {
    const { Floors, Profile, handleDeletemodal, handleSelectedFloor, handleFastcreatemodal } = this.props
    const { isLoading } = Floors

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id' },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid' },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
      { Header: Literals.Columns.Gender[Profile.Language], accessor: row => this.genderCellhandler(row?.Gender), Lowtitle: true, Withtext: true, },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser' },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser' },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime' },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime' },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "floor"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Floors.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Floors/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedFloor(item)
          handleDeletemodal(true)
        }} />
      }
    })

    return (
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Floors"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Floors/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                  Additionalfunction={() => { handleFastcreatemodal(true) }}
                  Additionalfunctiontxt={Literals.Button.Fastcreate[Profile.Language]}
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
          <FloorsDelete />
          <FloorsFastcreate />
        </React.Fragment>
    )
  }

  genderCellhandler = (value) => {
    const { Profile } = this.props
    const Genderoptions = [
      { key: 0, text: Literals.Options.Genderoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Genderoptions.value1[Profile.Language], value: "1" }
    ]
    return Genderoptions.find(u => u.value === value)?.text || 'Tanımsız'
  }
}