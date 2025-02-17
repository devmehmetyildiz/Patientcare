import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Tab } from 'semantic-ui-react'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { Contentwrapper, DataTable, Headerwrapper, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings } from '../../Components'
import ProfessionpresettingsDelete from '../../Containers/Professionpresettings/ProfessionpresettingsDelete'
import ProfessionpresettingsSavepreview from '../../Containers/Professionpresettings/ProfessionpresettingsSavepreview'
import ProfessionpresettingsActivate from '../../Containers/Professionpresettings/ProfessionpresettingsActivate'
import ProfessionpresettingsDeactivate from '../../Containers/Professionpresettings/ProfessionpresettingsDeactivate'
import ProfessionpresettingsApprove from '../../Containers/Professionpresettings/ProfessionpresettingsApprove'
import ProfessionpresettingsComplete from '../../Containers/Professionpresettings/ProfessionpresettingsComplete'
import Formatdate, { Getdateoptions } from '../../Utils/Formatdate'
import { COL_PROPS } from '../../Utils/Constants'
import useTabNavigation from '../../Hooks/useTabNavigation'
import privileges from '../../Constants/Privileges'

export default function Professionpresettings(props) {
  const { Professionpresettings, Profile, Floors, Professions, Shiftdefines, GetProfessionpresettings, GetFloors, GetShiftdefines, GetProfessions, history } = props

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [savePreviewOpen, setSavePreviewOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [record, setRecord] = useState(null)

  const { isLoading } = Professionpresettings

  const t = Profile?.i18n?.t

  const floorCellhandler = (value) => {
    if (Floors.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const floor = (Floors.list || []).find(u => u.Uuid === value)
      return floor?.Name || ''
    }
  }

  const shiftdefineCellhandler = (value) => {
    if (Shiftdefines.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const shiftdefine = (Shiftdefines.list || []).find(u => u.Uuid === value)
      return shiftdefine?.Name || ''
    }
  }

  const professionCellhandler = (value) => {
    if (Professions.isLoading) {
      return <Loader size='small' active inline='centered' ></Loader>
    } else {
      const profession = (Professions.list || []).find(u => u.Uuid === value)
      return profession?.Name
    }
  }

  const dateCellhandler = (value) => {
    if (value) {
      const dates = Getdateoptions()
      if (dates.find(u => Formatdate(u.value) === Formatdate(value))) {
        return `${dates.find(u => Formatdate(u.value) === Formatdate(value))?.text} (${Formatdate(value)})`
      } else {
        return Formatdate(value)
      }
    }
    return null
  }

  const boolCellhandler = (value) => {
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }

  const booliconCellhandler = ({ value }) => {
    return value === t('Common.Yes') ? <Icon color='green' name='checkmark' /> : <Icon color='red' name='close' />
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

  const Columns = [
    { Header: t('Common.Column.Id'), accessor: 'Id' },
    { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
    { Header: t('Pages.Professionpresettings.Column.Isinfinite'), accessor: row => boolCellhandler(row?.Isinfinite), disableProps: true, Cell: (col, row) => booliconCellhandler(col, row), },
    { Header: t('Pages.Professionpresettings.Column.Startdate'), accessor: row => dateCellhandler(row?.Startdate), },
    { Header: t('Pages.Professionpresettings.Column.Profession'), accessor: row => professionCellhandler(row?.ProfessionID), },
    { Header: t('Pages.Professionpresettings.Column.Floor'), accessor: row => floorCellhandler(row?.FloorID), },
    { Header: t('Pages.Professionpresettings.Column.Shiftdefine'), accessor: row => shiftdefineCellhandler(row?.ShiftdefineID), },
    { Header: t('Pages.Professionpresettings.Column.Ispersonelstay'), accessor: row => boolCellhandler(row?.Ispersonelstay), disableProps: true, Cell: (col, row) => booliconCellhandler(col, row), },
    { Header: t('Pages.Professionpresettings.Column.Minpersonelcount'), accessor: 'Minpersonelcount' },
    { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
    { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
    { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
    { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
    { Header: t('Common.Column.savepreview'), accessor: 'savepreview', disableProps: true, keys: ['onpreview'], role: privileges.professionpresettingsavepreview },
    { Header: t('Common.Column.approve'), accessor: 'approve', disableProps: true, keys: ['waitingapprove'], role: privileges.professionpresettingapprove },
    { Header: t('Common.Column.complete'), accessor: 'complete', disableProps: true, keys: ['approved'], role: privileges.professionpresettingcomplete },
    { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, keys: ['onpreview'], role: privileges.professionpresettingupdate },
    { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, keys: ['onpreview', 'waitingapprove'], role: ProfessionpresettingsDelete }
  ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })

  const metaKey = "professionpresetting"
  let initialConfig = GetInitialconfig(Profile, metaKey)

  const list = (Professionpresettings.list || []).filter(u => u.Isactive).map(item => {
    return {
      ...item,
      edit: <Link to={`/Professionpresettings/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
      delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
        setRecord(item)
        setDeleteOpen(true)
      }} />,
      approve: <Icon link size='large' color='red' name='hand pointer' onClick={() => {
        setRecord(item)
        setApproveOpen(true)
      }} />,
      complete: <Icon link size='large' color='blue' name='hand point left' onClick={() => {
        setRecord(item)
        setCompleteOpen(true)
      }} />,
      savepreview: <Icon link size='large' color='green' name='save' onClick={() => {
        setRecord(item)
        setSavePreviewOpen(true)
      }} />,
    }
  })

  const completedList = list.filter(u => u.Iscompleted && u.Isapproved && !u.Isonpreview)
  const approvedList = list.filter(u => !u.Iscompleted && u.Isapproved && !u.Isonpreview)
  const waitingapproveList = list.filter(u => !u.Iscompleted && !u.Isapproved && !u.Isonpreview)
  const onpreviewList = list.filter(u => !u.Iscompleted && !u.Isapproved && u.Isonpreview)

  const tabOrder = [
    'completed',
    'approved',
    'waitingapprove',
    'onpreview',
  ]

  const { activeTab, setActiveTab } = useTabNavigation({
    history,
    tabOrder,
    mainRoute: 'Professionpresettings'
  })

  useEffect(() => {
    GetProfessionpresettings()
    GetFloors()
    GetShiftdefines()
    GetProfessions()
  }, [])

  return (
    <React.Fragment>
      <Pagewrapper dimmer isLoading={isLoading}>
        <Headerwrapper>
          <Grid columns='2' >
            <GridColumn width={8}>
              <Breadcrumb size='big'>
                <Link to={"/Professionpresettings"}>
                  <Breadcrumb.Section>{t('Pages.Professionpresettings.Page.Header')}</Breadcrumb.Section>
                </Link>
              </Breadcrumb>
            </GridColumn>
            <Settings
              Profile={Profile}
              Pagecreateheader={t('Pages.Professionpresettings.Page.CreateHeader')}
              Pagecreatelink={"/Professionpresettings/Create"}
              Columns={Columns}
              list={list}
              initialConfig={initialConfig}
              metaKey={metaKey}
              Showcreatebutton
              Showcolumnchooser
              Showexcelexport
              CreateRole={privileges.professionpresettingadd}
              ReportRole={privileges.professionpresettinggetreport}
              ViewRole={privileges.professionpresettingmanageview}
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
                menuItem: `${t('Pages.Professionpresettings.Tab.Completed')} (${(completedList || []).length})`,
                pane: {
                  key: 'completed',
                  content: renderView({ list: completedList, Columns, keys: ['completed'], initialConfig })
                }
              },
              {
                menuItem: `${t('Pages.Professionpresettings.Tab.Approved')} (${(approvedList || []).length})`,
                pane: {
                  key: 'approved',
                  content: renderView({ list: approvedList, Columns, keys: ['approved'], initialConfig })
                }
              },
              {
                menuItem: `${t('Pages.Professionpresettings.Tab.Waitingapprove')} (${(waitingapproveList || []).length})`,
                pane: {
                  key: 'waitingapprove',
                  content: renderView({ list: waitingapproveList, Columns, keys: ['waitingapprove'], initialConfig })
                }
              },
              {
                menuItem: `${t('Pages.Professionpresettings.Tab.Onpreview')} (${(onpreviewList || []).length})`,
                pane: {
                  key: 'onpreview',
                  content: renderView({ list: onpreviewList, Columns, keys: ['onpreview'], initialConfig })
                }
              },
            ]}
            renderActiveOnly={false}
          />
        </Contentwrapper>
      </Pagewrapper>
      <ProfessionpresettingsSavepreview
        open={savePreviewOpen}
        setOpen={setSavePreviewOpen}
        record={record}
        setRecord={setRecord}
      />
      <ProfessionpresettingsApprove
        open={approveOpen}
        setOpen={setApproveOpen}
        record={record}
        setRecord={setRecord}
      />
      <ProfessionpresettingsComplete
        open={completeOpen}
        setOpen={setCompleteOpen}
        record={record}
        setRecord={setRecord}
      />
      <ProfessionpresettingsActivate
        open={activateOpen}
        setOpen={setActivateOpen}
        record={record}
        setRecord={setRecord}
      />
      <ProfessionpresettingsDeactivate
        open={deactivateOpen}
        setOpen={setDeactivateOpen}
        record={record}
        setRecord={setRecord}
      />
      <ProfessionpresettingsDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        record={record}
        setRecord={setRecord}
      />
    </React.Fragment>
  )
}