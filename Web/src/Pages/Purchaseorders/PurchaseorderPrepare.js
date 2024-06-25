import React, { useState, useEffect, useContext } from 'react'
import { Step } from 'semantic-ui-react'
import PurchaseorderPrepareStepOne from '../../Containers/Purchaseorders/PurchaseorderPrepareStepOne'
import PurchaseorderPrepareStepTwo from '../../Containers/Purchaseorders/PurchaseorderPrepareStepTwo'
import PurchaseorderPrepareStepThree from '../../Containers/Purchaseorders/PurchaseorderPrepareStepThree'
import PurchaseorderPrepareStepFour from '../../Containers/Purchaseorders/PurchaseorderPrepareStepFour'
import Literals from './Literals'
import { FormContext } from '../../Provider/FormProvider'
import validator from '../../Utils/Validator'

export default function PurchaseorderPrepare({ PAGE_NAME, Preparestatus, selectedFiles, selectedStocks, setselectedFiles, setselectedStocks, Profile }) {

    const STEPONE = "one"
    const STEPTWO = "two"
    const STEPTHREE = "three"
    const STEPFOUR = "four"

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
        const data = context.getForm(PAGE_NAME)
        const { Company, CaseID } = data
        if (!completedSteps.includes(STEPONE)) {
            if (validator.isUUID(CaseID) && validator.isString(Company)) {
                setCompletedSteps(prev => [...prev, STEPONE])
            }
        }
    }, [context])

    useEffect(() => {
        if (!completedSteps.includes(STEPTWO)) {
            if (validator.isArray(selectedStocks) && selectedStocks.length > 0) {
                setCompletedSteps(prev => [...prev, STEPTWO])
            }
        }
    }, [selectedStocks])

    useEffect(() => {
        if (!completedSteps.includes(STEPTHREE)) {
            if (validator.isArray(selectedFiles) && selectedFiles.length > 0) {
                setCompletedSteps(prev => [...prev, STEPTHREE])
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
                        <Step.Title>{Literals.Page.Pageinfoheader[Profile.Language]}</Step.Title>
                        <Step.Description>{Literals.Page.Pageinfoheaderdesc[Profile.Language]}</Step.Description>
                    </Step.Content>
                </Step>
                <Step
                    onClick={() => setStep(STEPTWO)}
                    completed={completedSteps.includes(STEPTWO)}
                    link
                    active={step === STEPTWO}
                >
                    <Step.Content>
                        <Step.Title>{Literals.Page.Pageproductheader[Profile.Language]}</Step.Title>
                        <Step.Description>{Literals.Page.Pageproductheaderdesc[Profile.Language]}</Step.Description>
                    </Step.Content>
                </Step>
                <Step
                    onClick={() => setStep(STEPTHREE)}
                    completed={completedSteps.includes(STEPTHREE)}
                    link
                    active={step === STEPTHREE}
                >
                    <Step.Content>
                        <Step.Title>{Literals.Page.Pagefileheader[Profile.Language]}</Step.Title>
                        <Step.Description>{Literals.Page.Pagefileheaderdesc[Profile.Language]}</Step.Description>
                    </Step.Content>
                </Step>
                <Step
                    onClick={() => setStep(STEPFOUR)}
                    completed={completedSteps.includes(STEPFOUR)}
                    link
                    active={step === STEPFOUR}
                >
                    <Step.Content>
                        <Step.Title>{Literals.Page.Pagedetailheader[Profile.Language]}</Step.Title>
                        <Step.Description>{Literals.Page.Pagedetailheaderdesc[Profile.Language]}</Step.Description>
                    </Step.Content>
                </Step>
            </Step.Group>
            {step === STEPONE ?
                <PurchaseorderPrepareStepOne
                    Preparestatus={Preparestatus}
                    PAGE_NAME={PAGE_NAME}
                    setCompletedSteps={setCompletedSteps}
                    goNext={goNext} stepKey={STEPONE}
                />
                : null}
            {step === STEPTWO ?
                <PurchaseorderPrepareStepTwo
                    PAGE_NAME={PAGE_NAME}
                    selectedStocks={selectedStocks}
                    setselectedStocks={setselectedStocks}
                    setCompletedSteps={setCompletedSteps}
                    goNext={goNext}
                    stepKey={STEPTWO}
                />
                : null}
            {step === STEPTHREE ?
                <PurchaseorderPrepareStepThree
                    PAGE_NAME={PAGE_NAME}
                    selectedFiles={selectedFiles}
                    setselectedFiles={setselectedFiles}
                    setCompletedSteps={setCompletedSteps}
                    goNext={goNext}
                    stepKey={STEPTHREE}
                />
                : null}
            {step === STEPFOUR ?
                <PurchaseorderPrepareStepFour
                    PAGE_NAME={PAGE_NAME}
                    selectedStocks={selectedStocks}
                    selectedFiles={selectedFiles}
                    stepKey={STEPFOUR}
                />
                : null}
        </div>
    )
}
