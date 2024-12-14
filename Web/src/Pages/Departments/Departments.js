import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form } from 'semantic-ui-react'
import {
  Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
  Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'

export default function DepartmentsCreate(props) {
const PAGE_NAME = "Test   "
  return (
      <Pagewrapper>
        <Headerwrapper>
          <Headerbredcrump>
            <Link to={"/Departments"}>
              <Breadcrumb.Section >PANEL</Breadcrumb.Section>
            </Link>
            <Breadcrumb.Divider icon='right chevron' />
            <Breadcrumb.Section>EKLE</Breadcrumb.Section>
          </Headerbredcrump>
        </Headerwrapper>
        <Pagedivider />
        <Contentwrapper>
          <Form>
            <Form.Group widths={'equal'}>
              <FormInput page={PAGE_NAME} required placeholder="SAHA ADI" name="Name" />
              <FormInput page={PAGE_NAME} required placeholder="BÖLGE ADI" name="Name2" />
            </Form.Group>
            <FormInput page={PAGE_NAME} required placeholder="PANEL SAYISI" name="Name3" type="number" />
          </Form>
        </Contentwrapper>
        <Footerwrapper>
          <Gobackbutton
            history={props.history}
            redirectUrl={"/"}
            buttonText={"Vazgeç"}
          />
          <Submitbutton
            isLoading={""}
            buttonText={"Oluştur"}
            submitFunction={()=>{}}
          />
        </Footerwrapper>
      </Pagewrapper >
  )
}
