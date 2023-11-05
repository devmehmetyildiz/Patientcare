import React from 'react'
import { Button } from 'semantic-ui-react'

export default function Gobackbutton({
    history,
    redirectUrl,
    buttonText
}) {
    return (
        history && <Button onClick={(e) => {
            e.preventDefault()
            history.length > 1 ? history.goBack() : history.push(history?.location?.state?.redirectUrl ? history?.location?.state?.redirectUrl : redirectUrl)
        }} floated="left" color='grey'>{buttonText}</Button>
    )
}
