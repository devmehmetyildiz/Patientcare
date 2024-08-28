import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Transition } from 'semantic-ui-react'

function Pagewrapper({ Profile, children }) {


    return (
        <Transition transitionOnMount animation='fade right' duration={500}>
            <div className={`w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center px-[${Profile?.Ismobile ? '10px' : '1rem'}] overflow-y-auto overflow-x-hidden`}>
                {children}
            </div>
        </Transition>
    )
}

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Pagewrapper)