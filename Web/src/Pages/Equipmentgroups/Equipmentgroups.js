import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import EquipmentgroupsDelete from "../../Containers/Equipmentgroups/EquipmentgroupsDelete"
import GetInitialconfig from '../../Utils/GetInitialconfig'
import {
  DataTable, Headerwrapper, LoadingPage, MobileTable,
  NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'

export default class Equipmentgroups extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stationsStatus: []
    }
  }

  componentDidMount() {
    const { GetDepartments, GetEquipmentgroups } = this.props
    GetDepartments()
    GetEquipmentgroups()
  }

  render() {

    const { Equipmentgroups, Profile, handleSelectedEquipmentgroup, handleDeletemodal } = this.props

    const t = Profile?.i18n?.t
    
    const { isLoading } = Equipmentgroups

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Equipmentgroups.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Equipmentgroups.Column.Department'), accessor: row => this.departmentCellhandler(row?.DepartmentID) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    const metaKey = "equipmentgroup"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Equipmentgroups.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Equipmentgroups/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedEquipmentgroup(item)
          handleDeletemodal(true)
        }} />,
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
                    <Link to={"/Equipmentgroups"}>
                      <Breadcrumb.Section>{t('Pages.Equipmentgroups.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Equipmentgroups.Page.CreateHeader')}
                  Pagecreatelink={"/Equipmentgroups/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                />
              </Grid>
            </Headerwrapper>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
              </div> : <NoDataScreen message={t('Common.NoDataFound')} />
            }
          </Pagewrapper>
          <EquipmentgroupsDelete />
        </React.Fragment>
    )
  }

  departmentCellhandler = (value) => {
    const { Departments } = this.props
    if (Departments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Departments.list || []).find(u => u.Uuid === value)?.Name
    }
  }
}