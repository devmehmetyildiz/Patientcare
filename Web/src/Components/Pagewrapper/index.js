import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'

function Pagewrapper({ Profile, children }) {


    return (
        <div className={`w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center px-[${Profile?.Ismobile ? '10px' : '1rem'}] overflow-y-auto overflow-x-hidden`}>
            {children}
        </div>
    )
}

const mapStateToProps = (state) => ({
    Profile: state.Profile
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Pagewrapper)