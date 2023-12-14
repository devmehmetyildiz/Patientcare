import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

function Footerwrapper({ Profile, children }) {

    const [modalOpen, setmodalOpen] = useState(false)
    const options = {
        en: 'Manage',
        tr: 'İşlemler'
    }

    return (
        <React.Fragment>
            <Pagedivider />
            {
                Profile?.Ismobile ?
                    <Modal open={modalOpen}
                        onClose={() => { setmodalOpen(false) }}
                        onOpen={() => { setmodalOpen(true) }}
                        basic
                        size='tiny'
                        trigger={<div className='flex flex-row w-full justify-between px-2 py-4  items-center bg-white rounded-b-lg shadow-md'>
                            <Button onClick={(e) => { e.preventDefault() }} className='h-fit !m-auto ' color='violet' floated='right'>{options[Profile.Language]}</Button>
                        </div>}
                    >
                        <Modal.Content>
                            <div className='flex flex-col w-full justify-center h-full py-4  items-center gap-10'>
                                {children}
                            </div>
                        </Modal.Content>
                    </Modal>
                    :
                    <div className='flex flex-row w-full justify-between px-2 py-4  items-center bg-white rounded-b-lg shadow-md'>
                        {children}
                    </div>
            }
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Footerwrapper)