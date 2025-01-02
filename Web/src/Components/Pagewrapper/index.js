import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Dimmer, DimmerDimmable, Loader, Transition } from 'semantic-ui-react'

function Pagewrapper({ Profile, children, additionalStyle, dimmer, isLoading }) {


    return (dimmer ?
        <DimmerDimmable>
            <Dimmer  inverted active={isLoading} >
                <Loader inverted active={isLoading} />
            </Dimmer>
            <Transition transitionOnMount animation='fade right' duration={500}>
                <div className={`w-full h-[calc(100vh-25.4px-2rem)] px-4 mx-auto flex flex-col  justify-start items-center px-[${Profile?.Ismobile ? '10px' : '1rem'}] overflow-y-auto overflow-x-hidden ${additionalStyle} `}>
                    {children}
                </div>
            </Transition>
        </DimmerDimmable>
        : <Transition transitionOnMount animation='fade right' duration={500}>
            <div className={`w-full h-[calc(100vh-25.4px-2rem)] p-4 mx-auto flex flex-col  justify-start items-center px-[${Profile?.Ismobile ? '10px' : '1rem'}] overflow-y-auto overflow-x-hidden ${additionalStyle} `}>
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