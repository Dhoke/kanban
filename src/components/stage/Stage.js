import React, { useRef, useState } from 'react'
import classes from './Stage.module.css'

const Stage = props => {

    const stageBox = useRef(null)
    const[isRegistered, setRegistered] = useState(false)

    if(!isRegistered) {
        setRegistered(true)
        props.register(stageBox, props.stage)
    }

    return (
        <div className={classes.column} ref={stageBox}>
            <h1>{props.title}</h1>
            <div className={classes.taskItems}>
                {props.children}
            </div>
        </div>
    )
}

export default Stage