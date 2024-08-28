import React, { useEffect } from 'react'
import { Breadcrumb, Button, Grid, GridColumn, Transition } from 'semantic-ui-react'
import { Contentwrapper, Headerwrapper } from '../../Components'
import { Link } from 'react-router-dom'
import Fileupload from '../../Components/Fileupload'

export default function PreregistrationsPrepareStepThree({ setCompletedSteps, selectedFiles, goNext, stepKey, setselectedFiles, PAGE_NAME, GetUsagetypes, Usagetypes, fillPatientnotification, Profile }) {

  const t = Profile?.i18n?.t

  useEffect(() => {
    GetUsagetypes()
  }, [])

  return (
    <Transition transitionOnMount animation='fade right' duration={500}>
      <div className='w-full'>
        <Contentwrapper>
          <Headerwrapper>
            <Grid columns='2' >
              <GridColumn width={8}>
                <Breadcrumb size='big'>
                  <Link to={"/Purchaseorders"}>
                    <Breadcrumb.Section>{t('Pages.Preregistrations.Page.FileHeader')}</Breadcrumb.Section>
                  </Link>
                </Breadcrumb>
              </GridColumn>
            </Grid>
          </Headerwrapper>
          <Fileupload
            fillnotification={fillPatientnotification}
            Usagetypes={Usagetypes}
            selectedFiles={selectedFiles}
            setselectedFiles={setselectedFiles}
            Literals={null}
            Profile={Profile}
          />
        </Contentwrapper>
      </div>
    </Transition>
  )
}
