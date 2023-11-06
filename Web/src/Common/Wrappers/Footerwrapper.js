import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'semantic-ui-react'

export function Footerwrapper({ Profile, children }) {

    const [modalOpen, setmodalOpen] = useState(false)
    const options = {
        en: 'Manage',
        tr: 'İşlemler'
    }

    return (
        Profile.Ismobile ?
            <Modal open={modalOpen}
                onClose={() => { setmodalOpen(false) }}
                onOpen={() => { setmodalOpen(true) }}
                basic
                size='tiny'
                trigger={<Button onClick={(e) => { e.preventDefault() }} className='h-fit !m-auto' color='violet' floated='right'>{options[Profile.Language]}</Button>} >
                <Modal.Content>
                    <div className='flex flex-col w-full justify-center h-full py-4  items-center gap-10'>
                        {children}
                    </div>
                </Modal.Content>
            </Modal>
            :
            <div className='flex flex-row w-full justify-between py-4  items-center'>
                {children}
            </div>
    )
}

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Footerwrapper)