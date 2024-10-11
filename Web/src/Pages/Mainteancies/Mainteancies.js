import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import MainteanciesDelete from '../../Containers/Mainteancies/MainteanciesDelete'
import MainteanciesComplete from '../../Containers/Mainteancies/MainteanciesComplete'
import validator from '../../Utils/Validator'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'

export default class Mainteancies extends Component {

  componentDidMount() {
    const { GetMainteancies, GetUsers, GetEquipments } = this.props
    GetMainteancies()
    GetUsers()
    GetEquipments()
  }

  render() {
    const { Mainteancies, Profile, handleDeletemodal, handleSelectedMainteance, handleCompletemodal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Mainteancies

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Mainteancies.Column.Starttime'), accessor: row => this.dateCellhandler(row?.Starttime), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Mainteancies.Column.Endtime'), accessor: row => this.dateCellhandler(row?.Endtime), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Mainteancies.Column.Equipment'), accessor: row => this.equipmentCellhandler(row?.EquipmentID), Title: true },
      { Header: t('Pages.Mainteancies.Column.Responsibleuser'), accessor: row => this.userCellhandler(row?.ResponsibleuserID), Subtitle: true, Withtext: true, },
      { Header: t('Pages.Mainteancies.Column.Openinfo'), accessor: 'Openinfo' },
      { Header: t('Pages.Mainteancies.Column.Closeinfo'), accessor: 'Closeinfo' },
      { Header: t('Pages.Mainteancies.Column.Iscompleted'), accessor: row => this.boolCellhandler(row?.Iscompleted), disableProps: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "mainteance"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Mainteancies.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        complete: item.Iscompleted ? <Icon size='large' color='black' name='minus' /> : <Icon link size='large' color='blue' name='hand point right' onClick={() => {
          handleSelectedMainteance(item)
          handleCompletemodal(true)
        }} />,
        edit: <Link to={`/Mainteancies/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedMainteance(item)
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
                    <Link to={"/Mainteancies"}>
                      <Breadcrumb.Section>{t('Pages.Mainteancies.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Mainteancies.Page.CreateHeader')}
                  Pagecreatelink={"/Mainteancies/Create"}
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
          <MainteanciesDelete />
          <MainteanciesComplete />
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