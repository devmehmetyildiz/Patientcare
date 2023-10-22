import React from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'

function ModalExampleBasic() {

    return (
        <Modal
            basic
            open={true}
            size='small'
        >
            <Header icon>
                <Icon name='archive' />
                Archive Old Messages
            </Header>
            <Modal.Content>
                <p>
                    Your inbox is getting full, would you like us to enable automatic
                    archiving of old messages?
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button basic color='red' inverted >
                    <Icon name='remove' /> No
                </Button>
                <Button color='green' inverted >
                    <Icon name='checkmark' /> Yes
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ModalExampleBasic