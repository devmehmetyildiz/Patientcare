import React, { useState, useEffect, useContext } from 'react'
import { Step } from 'semantic-ui-react'
import PreregistrationsPrepareStepOne from '../../Containers/Preregistrations/PreregistrationsPrepareStepOne'
import PreregistrationsPrepareStepTwo from '../../Containers/Preregistrations/PreregistrationsPrepareStepTwo'
import PreregistrationsPrepareStepThree from '../../Containers/Preregistrations/PreregistrationsPrepareStepThree'
import { FormContext } from '../../Provider/FormProvider'
import validator from '../../Utils/Validator'
import PreregistrationsPrepareStepFour from '../../Containers/Preregistrations/PreregistrationsPrepareStepFour'

export default function PreregistrationsPrepare({ PAGE_NAME, Preparestatus, selectedFiles, selectedStocks, setselectedFiles, setselectedStocks, Profile }) {

    const STEPONE = "one"
    const STEPTWO = "two"
    const STEPTHREE = "three"
    const STEPFOUR = "four"

    const t = Profile?.i18n?.t

    const [step, setStep] = useState(STEPONE)
    const [completedSteps, setCompletedSteps] = useState([])
    const context = useContext(FormContext)

    const goNext = () => {
        switch (step) {
            case STEPONE:
                setStep(STEPTWO)
                break;
            case STEPTWO:
                setStep(STEPTHREE)
                break;
            case STEPTHREE:
                setStep(STEPFOUR)
                break;
        }
    }

    useEffect(() => {
        const PatientdefinePagename = `${PAGE_NAME}-Patientdefine`
        const data = context.getForm(PAGE_NAME)
        const patientdata = context.getForm(PatientdefinePagename)
        const { PatientdefineID, Approvaldate, CaseID, DepartmentID } = data
        const { CountryID } = patientdata
        if (
            (validator.isUUID(PatientdefineID) || (validator.isString(CountryID) && validator.isCountryID(CountryID))) &&
            validator.isISODate(Approvaldate) &&
            validator.isUUID(CaseID) &&
            validator.isUUID(DepartmentID)
        ) {
            if (!completedSteps.includes(STEPONE)) {
                setCompletedSteps(prev => [...prev, STEPONE])
            }
        } else {
            if (completedSteps.includes(STEPONE)) {
                setCompletedSteps(prev => [...prev.filter(u => u !== STEPONE)])
            }
        }
    }, [context])

    useEffect(() => {
        if (validator.isArray(selectedStocks) && selectedStocks.length > 0) {
            if (!completedSteps.includes(STEPTWO)) {
                setCompletedSteps(prev => [...prev, STEPTWO])
            }
        } else {
            if (completedSteps.includes(STEPTWO)) {
                setCompletedSteps(prev => [...prev.filter(u => u !== STEPTWO)])
            }
        }
    }, [selectedStocks])

    useEffect(() => {
        if (validator.isArray(selectedFiles) && selectedFiles.length > 0) {
            if (!completedSteps.includes(STEPTHREE)) {
                setCompletedSteps(prev => [...prev, STEPTHREE])
            }
        } else {
            if (completedSteps.includes(STEPTHREE)) {
                setCompletedSteps(prev => [...prev.filter(u => u !== STEPTHREE)])
            }
        }
    }, [selectedFiles])

    return (
        <div>
            <Step.Group ordered>
                <Step
                    onClick={() => setStep(STEPONE)}
                    completed={completedSteps.includes(STEPONE)}
                    link
                    active={step === STEPONE}
                >
                    <Step.Content>
                        <Step.Title>{t('Pages.Preregistrations.Page.InfoHeader')}</Step.Title>
                        <Step.Description>{t('Pages.Preregistrations.Page.InfoHeader.Desc')}</Step.Description>
                    </Step.Content>
                </Step>
                <Step
                    onClick={() => setStep(STEPTWO)}
                    completed={completedSteps.includes(STEPTWO)}
                    link
                    active={step === STEPTWO}
                >
                    <Step.Content>
                        <Step.Title>{t('Pages.Preregistrations.Page.StockHeader')}</Step.Title>
                        <Step.Description>{t('Pages.Preregistrations.Page.StockHeader.Desc')}</Step.Description>
                    </Step.Content>
                </Step>
                <Step
                    onClick={() => setStep(STEPTHREE)}
                    completed={completedSteps.includes(STEPTHREE)}
                    link
                    active={step === STEPTHREE}
                >
                    <Step.Content>
                        <Step.Title>{t('Pages.Preregistrations.Page.FileHeader')}</Step.Title>
                        <Step.Description>{t('Pages.Preregistrations.Page.FileHeader.Desc')}</Step.Description>
                    </Step.Content>
                </Step>
                <Step
                    onClick={() => setStep(STEPFOUR)}
                    completed={completedSteps.includes(STEPFOUR)}
                    link
                    active={step === STEPFOUR}
                >
                    <Step.Content>
                        <Step.Title>{t('Pages.Preregistrations.Page.InfoHeader')}</Step.Title>
                        <Step.Description>{t('Pages.Preregistrations.Page.InfoHeader.Desc')}</Step.Description>
                    </Step.Content>
                </Step>
            </Step.Group>
            {step === STEPONE ?
                <PreregistrationsPrepareStepOne
                    Preparestatus={Preparestatus}
                    PAGE_NAME={PAGE_NAME}
                    setCompletedSteps={setCompletedSteps}
                    goNext={goNext}
                    stepKey={STEPONE}
                />
                : null}
            {step === STEPTWO ?
                <PreregistrationsPrepareStepTwo
                    PAGE_NAME={PAGE_NAME}
                    selectedStocks={selectedStocks}
                    setselectedStocks={setselectedStocks}
                    setCompletedSteps={setCompletedSteps}
                    goNext={goNext}
                    stepKey={STEPTWO}
                />
                : null}
            {step === STEPTHREE ?
                <PreregistrationsPrepareStepThree
                    PAGE_NAME={PAGE_NAME}
                    selectedFiles={selectedFiles}
                    setselectedFiles={setselectedFiles}
                    setCompletedSteps={setCompletedSteps}
                    goNext={goNext}
                    stepKey={STEPTHREE}
                />
                : null}
            {step === STEPFOUR ?
                <PreregistrationsPrepareStepFour
                    PAGE_NAME={PAGE_NAME}
                    selectedStocks={selectedStocks}
                    selectedFiles={selectedFiles}
                    setselectedFiles={setselectedFiles}
                    setCompletedSteps={setCompletedSteps}
                    goNext={goNext}
                    stepKey={STEPFOUR}
                />
                : null}
        </div>
    )
}
