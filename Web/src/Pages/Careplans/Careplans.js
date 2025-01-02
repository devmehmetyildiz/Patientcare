import React, { Component, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader, Tab } from 'semantic-ui-react'
import CareplansDelete from '../../Containers/Careplans/CareplansDelete'
import CareplansApprove from '../../Containers/Careplans/CareplansApprove'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import {
  Contentwrapper,
  DataTable, Headerwrapper, LoadingPage,
  MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings
} from '../../Components'
import CareplansSavepreview from '../../Containers/Careplans/CareplansSavepreview'
import CareplansDetail from '../../Containers/Careplans/CareplansDetail'
import { COL_PROPS, SUPPORTPLAN_TYPE_CAREPLAN, SUPPORTPLAN_TYPE_PSYCHOSOCIAL, SUPPORTPLAN_TYPE_RATING } from '../../Utils/Constants'
import Formatdate from '../../Utils/Formatdate'
import useTabNavigation from '../../Hooks/useTabNavigation'

export default function Careplans(props) {
  const { GetCareplans, GetPatients, GetPatientdefines } = props

  const { Careplans, Profile, handleSelectedCareplan, Patients, Patientdefines, handleDeletemodal, handleApprovemodal, handleDetailmodal, handleSavepreviewmodal, history } = props

  const t = Profile?.i18n?.t

  const { isLoading } = Careplans

  const patientCellhandler = (value) => {
    if (Patientdefines.isLoading || Patients.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const patient = (Patients.list || []).find(u => u.Uuid === value)
      const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
      return `${patientdefine?.Firstname} ${patientdefine?.Lastname} - (${patientdefine?.CountryID})`
    }
  }

  const dateCellhandler = (value) => {
    if (value) {
      return Formatdate(value, true)
    }
    return null
  }

  const renderView = ({ list, Columns, keys, initialConfig }) => {

    const searchbykey = (data, searchkeys) => {
      let ok = false
      searchkeys.forEach(key => {

        if (!ok) {
          if (data.includes(key)) {
            ok = true
          }
        }
      });

      return ok
    }

    const columns = Columns.filter(u => searchbykey((u?.keys || []), keys) || !(u?.keys))

    return list.length > 0 ?
      <div className='w-full mx-auto '>
        {Profile.Ismobile ?
          <MobileTable Columns={columns} Data={list} Config={initialConfig} Profile={Profile} /> :
          <DataTable Columns={columns} Data={list} Config={initialConfig} />}
      </div> : <NoDataScreen style={{ height: 'auto' }} message={t('Common.NoDataFound')} />
  }

  const boolCellhandler = (value) => {
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }

  const typeCellhandler = (value) => {
    const Supportplantypeoptions = [
      { key: 1, text: t('Common.Supportplan.Types.Careplan'), value: SUPPORTPLAN_TYPE_CAREPLAN },
      { key: 2, text: t('Common.Supportplan.Types.Psychosocial'), value: SUPPORTPLAN_TYPE_PSYCHOSOCIAL },
      { key: 3, text: t('Common.Supportplan.Types.Rating'), value: SUPPORTPLAN_TYPE_RATING },
    ]

    return Supportplantypeoptions.find(u => u.value === value)?.text || t('Common.NoDataFound')
  }

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Careplans.Columns.Type'), accessor: row => typeCellhandler(row?.Type), },
    { Header: t('Pages.Careplans.Columns.Createdate'), accessor: row => dateCellhandler(row?.Createdate) },
    { Header: t('Pages.Careplans.Columns.Startdate'), accessor: row => dateCellhandler(row?.Startdate) },
    { Header: t('Pages.Careplans.Columns.Enddate'), accessor: row => dateCellhandler(row?.Enddate) },
    { Header: t('Pages.Careplans.Columns.Patient'), accessor: row => patientCellhandler(row?.PatientID), Title: true },
    { Header: t('Pages.Careplans.Columns.Approveduser'), accessor: 'Approveduser', keys: ['completed', 'approved'] },
    { Header: t('Pages.Careplans.Columns.Approvetime'), accessor: row => dateCellhandler(row?.Approvetime), keys: ['completed', 'approved'] },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.detail'), accessor: 'detail', disableProps: true },
    { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['isonpreview'] },
    { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'] },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['isonpreview',] },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['isonpreview', 'waitingapprove'] },
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "careplan"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Careplans.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Careplans/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      approve: <Icon className='!cursor-pointer' link size='large' color='red' name='hand pointer' onClick={() => {
        handleSelectedCareplan(item)
        handleApprovemodal(true)
      }}
      />,
      detail: <Icon className='!cursor-pointer' size='large' color='red' name='address book' onClick={() => {
        handleSelectedCareplan(item)
        handleDetailmodal(true)
      }}
      />,
      delete: <Icon className='!cursor-pointer' link size='large' color='red' name='alternate trash' onClick={() => {
        handleSelectedCareplan(item)
        handleDeletemodal(true)
      }} />,
      savepreview: <Icon className='!cursor-pointer' link size='large' color='green' name='save' onClick={() => {
        handleSelectedCareplan(item)
        handleSavepreviewmodal(true)
      }} />,
    }
  })

  const approvedList = list.filter(u => u.Isapproved && !u.Isonpreview)
  const waitingapproveList = list.filter(u => !u.Isapproved && !u.Isonpreview)
  const onpreviewList = list.filter(u => !u.Isapproved && u.Isonpreview)

  const tabOrder = [
    'approved',
    'waitingapprove',
    'onpreview',
  ]

  const { activeTab, setActiveTab } = useTabNavigation({
    history,
    tabOrder,
    mainRoute: 'Careplans'
  })

  useEffect(() => {
    GetCareplans()
    GetPatients()
    GetPatientdefines()
  }, [])

  return (
    isLoading ? <LoadingPage /> :
      <React.Fragment>
        <Pagewrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Careplans"}>
                    <Breadcrumb.Section>{t('Pages.Careplans.Page.Header')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
              <Settings
                Profile={Profile}
                Pagecreateheader={t('Pages.Careplans.Page.CreateHeader')}
                Pagecreatelink={"/Careplans/Create"}
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
          <Contentwrapper>
            <Tab
              onTabChange={(_, { activeIndex }) => {
                setActiveTab(activeIndex)
              }}
              activeIndex={activeTab}
              className="w-full !bg-transparent"
              panes={[
                {
                  menuItem: `${t('Pages.Careplans.Tab.Approved')} (${(approvedList || []).length})`,
                  pane: {
                    key: 'approved',
                    content: renderView({ list: approvedList, Columns, keys: ['approved'], initialConfig })
                  }
                },
                {
                  menuItem: `${t('Pages.Careplans.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                  pane: {
                    key: 'waitingapprove',
                    content: renderView({ list: waitingapproveList, Columns, keys: ['waitingapprove'], initialConfig })
                  }
                },
                {
                  menuItem: `${t('Pages.Careplans.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                  pane: {
                    key: 'onpreview',
                    content: renderView({ list: onpreviewList, Columns, keys: ['isonpreview'], initialConfig })
                  }
                },


              ]}
              renderActiveOnly={false}
            />
          </Contentwrapper>
        </Pagewrapper>
        <CareplansDelete />
        <CareplansApprove />
        <CareplansSavepreview />
        <CareplansDetail />
      </React.Fragment >
  )
}