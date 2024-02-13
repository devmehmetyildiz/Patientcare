import React from 'react'
import { Button } from 'semantic-ui-react'

export default function Submitbutton({
    buttonText,
    isLoading,
    submitFunction
}) {
    return (
        <Button disabled={isLoading} loading={isLoading} onClick={submitFunction} floated="right" type='submit' color='blue'>{buttonText}</Button>
    )
}
