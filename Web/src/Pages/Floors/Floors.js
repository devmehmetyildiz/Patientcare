import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, GridColumn, Icon } from 'semantic-ui-react'
import FloorsDelete from '../../Containers/Floors/FloorsDelete'
import FloorsFastcreate from '../../Containers/Floors/FloorsFastcreate'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import { GENDER_OPTION_MEN, GENDER_OPTION_WOMEN } from '../../Utils/Constants'

export default class Floors extends Component {

  componentDidMount() {
    const { GetFloors } = this.props
    GetFloors()
  }

  render() {
    const { Floors, Profile, handleDeletemodal, handleSelectedFloor, handleFastcreatemodal } = this.props
 
    const t = Profile?.i18n?.t
 
    const { isLoading } = Floors

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Floors.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Floors.Column.Gender'), accessor: row => this.genderCellhandler(row?.Gender), Lowtitle: true, Withtext: true, },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "floor"
    let initialConfig = GetInitialconfig(Profile, metaKey)

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
                      <Breadcrumb.Section>{t('Pages.Floors.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Floors.Page.CreateHeader')}
                  Pagecreatelink={"/Floors/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                  Additionalfunction={() => { handleFastcreatemodal(true) }}
                  Additionalfunctiontxt={t('Pages.Floors.Column.Fastcreate')}
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
          <FloorsDelete />
          <FloorsFastcreate />
        </React.Fragment>
    )
  }

  genderCellhandler = (value) => {
    const { Profile } = this.props

    const t = Profile?.i18n?.t

    const Genderoptions = [
      { key: 0, text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
      { key: 1, text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
    ]
    return Genderoptions.find(u => u.value === value)?.text || t('Common.NoDataFound')
  }
}