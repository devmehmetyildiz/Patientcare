import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Transition } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { Getdateoptions, Getshiftlastdate } from '../../Utils/Formatdate'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, Notfoundpage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PersonelshiftsProfessionpresettings from '../../Containers/Personelshifts/PersonelshiftsProfessionpresettings'
import PersonelshiftsPersonelpresettings from '../../Containers/Personelshifts/PersonelshiftsPersonelpresettings'
import PersonelshiftsPrepare from '../../Containers/Personelshifts/PersonelshiftsPrepare'
import PersonelshiftsFastcreate from '../../Containers/Personelshifts/PersonelshiftsFastcreate'
import usePreviousUrl from '../../Hooks/usePreviousUrl'

export default function PersonelshiftsEdit(props) {
  const PAGE_NAME = "PersonelshiftsEdit"

  const { GetProfessions, GetPersonelshift, GetProfessionpresettings, GetPersonelpresettings, GetFloors, EditPersonelshifts, fillPersonelshiftnotification, GetShiftdefines, GetUsers, GetUsagetypes, } = props
  const { Personelshifts, Professions, Professionpresettings, Shiftdefines, Floors, Usagetypes, Users, Personelpresettings, PersonelshiftID, Profile, history, match, closeModal } = props


  const [calculatedShifts, setCalculatedShifts] = useState([])
  const { calculateRedirectUrl } = usePreviousUrl()
  const context = useContext(FormContext)

  const Id = PersonelshiftID || match?.params?.PersonelshiftID
  const t = Profile?.i18n?.t

  const handleCalculatedShifts = (prev) => {
    setCalculatedShifts(...prev)
  }

  const resetCalculatedShifts = () => {
    setCalculatedShifts([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const shiftData = context.getForm(PAGE_NAME)

    const data = {
      Startdate: shiftData?.Startdate,
      ProfessionID: shiftData?.ProfessionID,
      Isworking: true,
      Isdeactive: false,
      Iscompleted: false,
      Isapproved: false,
      Personelshiftdetails: calculatedShifts
    }

    let errors = []

    if (!validator.isISODate(data.Startdate)) {
      errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.StartdateRequired') })
    }
    if (!validator.isUUID(data.ProfessionID)) {
      errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.ProfessionRequired') })
    }
    if (!validator.isArray(data.Personelshiftdetails) && data.Personelshiftdetails.length <= 0) {
      errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.PersonelshiftsRequired') })
    } else {

      for (const personelshift of data.Personelshiftdetails) {

        const { Annualtype, Day, PersonelID, ShiftID } = personelshift

        if (!validator.isNumber(Annualtype)) {
          errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.AnnualtypeRequired') })
        }
        if (!validator.isNumber(Day)) {
          errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.DayRequired') })
        }
        if (!validator.isUUID(PersonelID)) {
          errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.PersonelRequired') })
        }
        if (!validator.isUUID(ShiftID)) {
          errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.ShiftRequired') })
        }
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPersonelshiftnotification(error)
      })
    } else {

      EditPersonelshifts({
        data: {
          ...Personelshifts.selected_record,
          ...data
        }, history, closeModal,
        redirectUrl: calculateRedirectUrl({ url: '/Personelshifts', usePrev: true }),
      })
    }
  }

  const dateOptions = Getdateoptions(2)

  const Professionsoptions = (Professions.list || []).filter(u => u.Isactive).map(propfession => {
    return { key: propfession.Uuid, text: propfession.Name, value: propfession.Uuid }
  });

  const selectedProfession = context.formstates[`${PAGE_NAME}/ProfessionID`];
  const selectedStartdate = context.formstates[`${PAGE_NAME}/Startdate`];

  const isProfessionselected = validator.isUUID(selectedProfession);
  const isStartdateselected = validator.isISODate(selectedStartdate);

  const foundedProfessionpresetting = (Professionpresettings.list || []).filter(u => u.Isactive && (u.Startdate === selectedStartdate || u.Isinfinite) && u.ProfessionID === selectedProfession)
  const foundedPersonelpresetting = (Personelpresettings.list || []).filter(u => u.Isactive && (u.Startdate === selectedStartdate || u.Isinfinite))

  const personelshifts = calculatedShifts

  const startDay = new Date(selectedStartdate).getDate()
  const lastDay = Getshiftlastdate(selectedStartdate)

  useEffect(() => {
    if (Personelshifts.selected_record && validator.isObject(Personelshifts.selected_record)) {
      const startDate = new Date(Personelshifts.selected_record?.Startdate)
      context.setForm(PAGE_NAME, {
        ...Personelshifts.selected_record,
        Startdate: startDate
      })
      setCalculatedShifts((Personelshifts?.selected_record?.Personelshiftdetails || []).map(detail => {
        return {
          Annualtype: detail?.Annualtype,
          Day: detail?.Day,
          PersonelID: detail?.PersonelID,
          ShiftID: detail?.ShiftID,
          FloorID: detail?.FloorID,
          Isworking: detail?.Isworking,
          Isonannual: detail?.Isonannual
        }
      }))
    }
  }, [Personelshifts.selected_record, setCalculatedShifts])

  useEffect(() => {
    if (validator.isUUID(Id)) {
      GetPersonelshift(Id)
      GetProfessions()
      GetProfessionpresettings()
      GetPersonelpresettings()
      GetFloors()
      GetShiftdefines()
      GetUsers()
      GetUsagetypes()
    } else {
      history && history.push("/Personelshifts")
    }
  }, [])

  const pageLoading = Personelshifts.isLoading ||
    Professions.isLoading ||
    Professionpresettings.isLoading ||
    Personelpresettings.isLoading ||
    Floors.isLoading ||
    Shiftdefines.isLoading ||
    Users.isLoading ||
    Usagetypes.isLoading

  return (
    <Pagewrapper dimmer isLoading={pageLoading}>
      <Headerwrapper>
        <Headerbredcrump>
          <Link to={"/Personelshifts"}>
            <Breadcrumb.Section >{t('Pages.Personelshifts.Page.Header')}</Breadcrumb.Section>
          </Link>
          <Breadcrumb.Divider icon='right chevron' />
          <Breadcrumb.Section>{t('Pages.Personelshifts.Page.EditHeader')}</Breadcrumb.Section>
        </Headerbredcrump>
        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
      </Headerwrapper>
      <Pagedivider />
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <Transition animation='slide down' visible={(isProfessionselected && isStartdateselected)}>
              <div className='w-full'>
                {(foundedPersonelpresetting.length <= 0 && foundedProfessionpresetting.length <= 0) ?
                  <React.Fragment>
                    <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { }} >
                      {t('Pages.Personelshifts.Messages.PersettingNotFound')}
                    </Button>
                  </React.Fragment>
                  : <React.Fragment>
                    <PersonelshiftsProfessionpresettings selectedProfessionpresettings={foundedProfessionpresetting} />
                    <PersonelshiftsPersonelpresettings selectedPersonelpresettings={foundedPersonelpresetting} />
                  </React.Fragment>
                }
                <PersonelshiftsFastcreate
                  selectedProfession={selectedProfession}
                  selectedStartdate={selectedStartdate}
                  setPersonelshifts={handleCalculatedShifts}
                />
              </div>
            </Transition>
          </Form.Group>
          <Form.Group widths={'equal'}>
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Personelshifts.Column.Startdate')} name="Startdate" formtype="dropdown" options={dateOptions} effect={resetCalculatedShifts} />
            <FormInput page={PAGE_NAME} placeholder={t('Pages.Personelshifts.Column.ProfessionID')} name="ProfessionID" formtype="dropdown" options={Professionsoptions} effect={resetCalculatedShifts} />
          </Form.Group>
          {(!isProfessionselected || !isStartdateselected)
            ? <Notfoundpage
              text={t('Pages.Personelshifts.Messages.NoSettingSetted')}
              autoHeight
            />
            : <React.Fragment>
              <PersonelshiftsPrepare
                selectedProfessionID={selectedProfession}
                selectedStartdate={selectedStartdate}
                startDay={startDay}
                lastDay={lastDay}
                personelshifts={personelshifts}
                setPersonelshifts={handleCalculatedShifts}
              />
            </React.Fragment>
          }
        </Form>
      </Contentwrapper>
      <Footerwrapper>
        <Gobackbutton
          history={history}
          redirectUrl={"/Personelshifts"}
          buttonText={t('Common.Button.Goback')}
        />
        <Submitbutton
          isLoading={Personelshifts.isLoading}
          buttonText={t('Common.Button.Update')}
          submitFunction={handleSubmit}
        />
      </Footerwrapper>
    </Pagewrapper >
  )
}
