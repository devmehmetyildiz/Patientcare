import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon, Loader } from 'semantic-ui-react'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import BreakdownsDelete from '../../Containers/Breakdowns/BreakdownsDelete'
import BreakdownsComplete from '../../Containers/Breakdowns/BreakdownsComplete'
import validator from '../../Utils/Validator'
import { DataTable, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'

export default class Breakdowns extends Component {

  componentDidMount() {
    const { GetBreakdowns, GetUsers, GetEquipments } = this.props
    GetBreakdowns()
    GetUsers()
    GetEquipments()
  }

  render() {
    const { Breakdowns, Profile, handleDeletemodal, handleSelectedBreakdown, handleCompletemodal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Breakdowns

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Breakdowns.Column.Starttime'), accessor: row => this.dateCellhandler(row?.Starttime), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Breakdowns.Column.Endtime'), accessor: row => this.dateCellhandler(row?.Endtime), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Breakdowns.Column.Equipment'), accessor: row => this.equipmentCellhandler(row?.EquipmentID), Title: true },
      { Header: t('Pages.Breakdowns.Column.Responsibleuser'), accessor: row => this.userCellhandler(row?.ResponsibleuserID), Subtitle: true, Withtext: true, },
      { Header: t('Pages.Breakdowns.Column.Openinfo'), accessor: 'Openinfo' },
      { Header: t('Pages.Breakdowns.Column.Closeinfo'), accessor: 'Closeinfo' },
      { Header: t('Pages.Breakdowns.Column.Iscompleted'), accessor: row => this.boolCellhandler(row?.Iscompleted), disableProps: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "breakdown"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Breakdowns.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        complete: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='blue' name='hand point right' onClick={() => {
          handleSelectedBreakdown(item)
          handleCompletemodal(true)
        }} />,
        edit: <Link to={`/Breakdowns/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedBreakdown(item)
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
                    <Link to={"/Breakdowns"}>
                      <Breadcrumb.Section>{t('Pages.Breakdowns.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Breakdowns.Page.CreateHeader')}
                  Pagecreatelink={"/Breakdowns/Create"}
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
          <BreakdownsDelete />
          <BreakdownsComplete />
        </React.Fragment>
    )
  }

  userCellhandler = (value) => {
    const { Users, Profile } = this.props

    const t = Profile?.i18n?.t

    if (Users.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const personel = (Users.list || []).find(u => u.Uuid === value)
      return personel ? `${personel?.Name} ${personel?.Surname}` : t('Common.NoDataFound')
    }
  }

  equipmentCellhandler = (value) => {
    const { Equipments, Profile } = this.props

    const t = Profile?.i18n?.t

    if (Equipments.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      return (Equipments.list || []).find(u => u.Uuid === value)?.Name || t('Common.NoDataFound')
    }
  }


  dateCellhandler = (value) => {
    const date = new Date(value)
    if (value && validator.isISODate(date)) {

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;

      return formattedDate
    } else {
      return value
    }
  }

  boolCellhandler = (value) => {
    return value !== null && (value
      ? <div className='w-full flex justify-center items-center'><Icon className='cursor-pointer' color='green' name='checkmark' /></div>
      : <div className='w-full flex justify-center items-center'><Icon className='cursor-pointer' color='red' name='times circle' /></div>)
  }
}