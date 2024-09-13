import React from 'react'
import { Form } from 'semantic-ui-react'
import { FormInput } from '../../../Components'
import { GENDER_OPTION_MEN, GENDER_OPTION_WOMEN } from '../../../Utils/Constants'
import validator from '../../../Utils/Validator'

export default function UsersPrepareKnowledge(props) {
    const { Profile, PAGE_NAME } = props

    const t = Profile?.i18n?.t

    const Genderoptions = [
        { key: 0, text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
        { key: 1, text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
    ]

    return (
        <React.Fragment>
            <Form.Group widths={'equal'}>
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.CountryID")} name="CountryID" validationfunc={validator.isCountryID} validationmessage={"Geçerli Bir Tc Giriniz!"} />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Gender")} name="Gender" options={Genderoptions} formtype='dropdown' />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Dateofbirth")} name="Dateofbirth" type='date' />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Phonenumber")} name="Phonenumber" />
            </Form.Group>
            <Form.Group widths={'equal'}>
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Bloodgroup")} name="Bloodgroup" />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Foreignlanguage")} name="Foreignlanguage" />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Graduation")} name="Graduation" />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Chronicillness")} name="Chronicillness" />
            </Form.Group>
            <Form.Group widths={'equal'}>
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Covid")} name="Covid" />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Contactnumber")} name="Contactnumber" />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.City")} name="City" />
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Town")} name="Town" />
            </Form.Group>
            <Form.Group widths={'equal'}>
                <FormInput page={PAGE_NAME} placeholder={t("Pages.Users.Prepare.Label.Adress")} name="Adress" />
            </Form.Group>
        </React.Fragment>
    )
}
