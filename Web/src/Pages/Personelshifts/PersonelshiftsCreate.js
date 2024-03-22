import React, { Component, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Icon, Label, Modal, Table } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Notfoundpage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { Getdateoptions } from '../../Utils/Formatdate'
export default class PersonelshiftsCreate extends Component {

  PAGE_NAME = "PersonelshiftsCreate"

  componentDidMount() {
    const { GetProfessions, GetProfessionpresettings, GetPersonelpresettings, GetFloors, GetShiftdefines, GetUsers } = this.props
    GetProfessions()
    GetProfessionpresettings()
    GetPersonelpresettings()
    GetFloors()
    GetShiftdefines()
    GetUsers()
  }

  render() {
    const { Personelshifts, Professions, Professionpresettings, Personelpresettings,
      Floors, Users, Shiftdefines, Profile, history, closeModal } = this.props

    const dateOptions = Getdateoptions()

    const Professionsoptions = (Professions.list || []).filter(u => u.Isactive).map(propfession => {
      return { key: propfession.Uuid, text: propfession.Name, value: propfession.Uuid }
    });

    const selectedProfession = this.context.formstates[`${this.PAGE_NAME}/ProfessionID`];
    const selectedStartdate = this.context.formstates[`${this.PAGE_NAME}/Startdate`];

    const isProfessionselected = validator.isUUID(selectedProfession);
    const isStartdateselected = validator.isISODate(selectedStartdate);

    const foundedProfessionpresetting = (Professionpresettings.list || []).filter(u => u.Isactive && (u.Startdate === selectedStartdate || u.Isinfinite) && u.ProfessionID === selectedProfession)
    const foundedPersonelpresetting = (Personelpresettings.list || []).filter(u => u.Isactive && (u.Startdate === selectedStartdate || u.Isinfinite))

    return (
      Personelshifts.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Personelshifts"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Startdate[Profile.Language]} name="Startdate" formtype="dropdown" options={dateOptions} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Profession[Profile.Language]} name="ProfessionID" formtype="dropdown" options={Professionsoptions} />
              </Form.Group>
              {(!isProfessionselected || !isStartdateselected)
                ? <Notfoundpage
                  text='Meslek veya Tarih Seçilmedi'
                  autoHeight
                />
                : <React.Fragment>
                  <Pagedivider />
                  <Professionpresettingoverview
                    selectedProfessionpresettings={foundedProfessionpresetting}
                    Floors={Floors}
                    Shiftdefines={Shiftdefines}
                    Profile={Profile}
                  />
                  <Personelpresettingoverview
                    selectedPersonelpresettings={foundedPersonelpresetting}
                    Profile={Profile}
                  />
                </React.Fragment>
              }
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Personelshifts"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Personelshifts.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddBeds, history, fillBednotification, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isUUID(data.RoomID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.RoomIDrequired[Profile.Language] })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillBednotification(error)
      })
    } else {
      AddBeds({ data, history, closeModal })
    }
  }
}
PersonelshiftsCreate.contextType = FormContext



function Professionpresettingoverview({ selectedProfessionpresettings, Floors, Shiftdefines, Profile }) {

  const [open, setOpen] = useState(false)

  return (
    <div className='p-2'>
      {selectedProfessionpresettings.length > 0 && (
        <React.Fragment>
          <div onClick={() => { setOpen(prev => !prev) }}>
            <Label size='large' as='a' className='!bg-[#2355a0] !text-white !w-full' image >
              {Literals.Messages.Foundedprofessionpresetting[Profile.Language]}
              <Label.Detail>{selectedProfessionpresettings.length} {Literals.Columns.Amount[Profile.Language]}</Label.Detail>
            </Label>
          </div>
          <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
          >
            <Modal.Header>{Literals.Page.Pageprofessionoverviewheader[Profile.Language]}</Modal.Header>
            <Modal.Content image>
              <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={1}>{Literals.Columns.Floor[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={1}>{Literals.Columns.Shiftdefine[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={2}>{Literals.Columns.Ispersonelstay[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={1}>{Literals.Columns.Minpersonelcount[Profile.Language]}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedProfessionpresettings.length > 0 && selectedProfessionpresettings.map(column => {
                    return <Table.Row key={Math.random()}>
                      <Table.Cell className='table-last-section'>
                        {`${(Floors.list || []).find(u => u.Uuid === column?.FloorID)?.Name || ''}`}
                      </Table.Cell>
                      <Table.Cell>
                        {`${(Floors.list || []).find(u => u.Uuid === column?.ShiftdefineID)?.Name || ''}`}
                      </Table.Cell>
                      <Table.Cell>
                        {`${column.Ispersonelstay ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language]}`}
                      </Table.Cell>
                      <Table.Cell>
                        {`${column.Minpersonelcount}`}
                      </Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
              </Table>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => {
                setOpen(false)
              }}>
                {Literals.Button.Close[Profile.Language]}
              </Button>
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      )}
    </div>
  )
}

function Personelpresettingoverview({ selectedPersonelpresettings, Profile }) {

  const [open, setOpen] = useState(false)

  return (
    <div className='p-2'>
      {selectedPersonelpresettings.length > 0 && (
        <React.Fragment>
          <div onClick={() => { setOpen(prev => !prev) }}>
            <Label size='large' as='a' className='!bg-[#2355a0] !text-white !w-full' image >
              {Literals.Messages.Foundedpersonelpresetting[Profile.Language]}
              <Label.Detail>{selectedPersonelpresettings.length} {Literals.Columns.Amount[Profile.Language]}</Label.Detail>
            </Label>
          </div>
          <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
          >
            <Modal.Header>{Literals.Page.Pagepersoneloverviewheader[Profile.Language]}</Modal.Header>
            <Modal.Content image>
              <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell width={1}>{Literals.Columns.Floor[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={1}>{Literals.Columns.Shiftdefine[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={2}>{Literals.Columns.Ispersonelstay[Profile.Language]}</Table.HeaderCell>
                    <Table.HeaderCell width={1}>{Literals.Columns.Minpersonelcount[Profile.Language]}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedProfessionpresettings.length > 0 && selectedProfessionpresettings.map(column => {
                    return <Table.Row key={Math.random()}>
                      <Table.Cell className='table-last-section'>
                        {`${(Floors.list || []).find(u => u.Uuid === column?.FloorID)?.Name || ''}`}
                      </Table.Cell>
                      <Table.Cell>
                        {`${(Floors.list || []).find(u => u.Uuid === column?.ShiftdefineID)?.Name || ''}`}
                      </Table.Cell>
                      <Table.Cell>
                        {`${column.Ispersonelstay ? Literals.Messages.Yes[Profile.Language] : Literals.Messages.No[Profile.Language]}`}
                      </Table.Cell>
                      <Table.Cell>
                        {`${column.Minpersonelcount}`}
                      </Table.Cell>
                    </Table.Row>
                  })}
                </Table.Body>
              </Table>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => {
                setOpen(false)
              }}>
                {Literals.Button.Close[Profile.Language]}
              </Button>
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      )}
    </div>
  )
}
