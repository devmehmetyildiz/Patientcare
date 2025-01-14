import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown, Modal } from 'semantic-ui-react'
import { GetPrinttemplates } from '../../Redux/PrinttemplateSlice'
import InnerHTML from '../../Utils/DangerouslySetHtmlContent'
import PrintDataReplacer from '../../Utils/PrintBodyReplacer'

export default function PrintPreview(props) {

    const Data = {
        items: props?.Data || []
    }

    const Profile = useSelector(state => state?.Profile)
    const Printtemplates = useSelector(state => state?.Printtemplates)
    const dispatch = useDispatch()

    const t = Profile?.i18n?.t

    const [open, setOpen] = useState(false)
    const [template, setTemplate] = useState(null)
    const [selectedPrintTemplateID, setSelectedPrintTemplateID] = useState(null)

    useEffect(() => {
        if (open) {
            dispatch(GetPrinttemplates())
        }
    }, [open])

    const Printtemplateoptions = (Printtemplates.list || []).filter(u => u.Isactive).map(template => {
        return { key: template.Uuid, text: template.Name, value: template.Uuid }
    })

    const selectedPrinttemplate = (Printtemplates.list || []).find(u => u.Uuid === selectedPrintTemplateID)

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className='!bg-[#2355a0] !text-white'>{t('Common.Button.Print')}</Button>}
        >
            <Modal.Header>{t('Components.PrintPreview.Page.Header')}</Modal.Header>
            <Modal.Content>
                <Dropdown
                    placeholder={t('Components.PrintPreview.Label.Printtemplates')}
                    clearable
                    search
                    fluid
                    selection
                    options={Printtemplateoptions}
                    onChange={(e, data) => { setSelectedPrintTemplateID(data.value) }}
                />
                {selectedPrinttemplate ?
                    <div className='p-2 shadow-lg shadow-gray-300'>
                        <div className='p-2 shadow-lg shadow-gray-300'>
                            <InnerHTML html={true ?
                                selectedPrinttemplate?.Printtemplate ? PrintDataReplacer(selectedPrinttemplate?.Printtemplate, Data) : '<div class="print-design-preview-message">No code to show.</div>' :
                                '<div class="print-design-preview-message">Preview only available in html design</div>'} />
                        </div>
                    </div>
                    : null}
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    setTemplate(null)
                }}>
                    {t('Common.Button.Giveup')}
                </Button>
                <Button
                    className='!bg-[#2355a0] !text-white'
                    content={t('Common.Button.Print')}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {

                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}
