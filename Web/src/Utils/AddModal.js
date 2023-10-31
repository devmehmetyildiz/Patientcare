import React, { useEffect, useState } from 'react'
import { Icon, Modal } from 'semantic-ui-react'

export default function AddModal({ Content }) {

    const [open, setOpen] = useState(false)

    return (<Modal
        open={open}
        onClose={() => { setOpen(false) }}
        onOpen={() => { setOpen(true) }}
        trigger={<Icon link name='plus' />}
    >
        <Content
            closeModal={() => { setOpen(false) }}
        />
    </Modal>
    )
}
