import React, { useRef, useState } from 'react'
import classes from './Task.module.css'

const Task = (props) => {

    const taskBox = useRef(null)

    const [isDragging, setIsDragging] = useState(false)
    const [y, setY] = useState(-1)
    const [x, setX] = useState(-1)

    const startDrag = (e) => {
        // const element = taskBox.current.getBoundingClientRect()
        setX(e.clientX - 25)
        setY(e.clientY - 25)
        setIsDragging(true)
    }

    const dragTask = (e) => {
        if (isDragging) {
            setX(e.clientX - 25)
            setY(e.clientY - 25)
        }
    }

    const endDrag = (e) => {
        setIsDragging(false)
        props.boundaryCheck(e.clientX, e.clientY, props.taskId)
    }

    const style = {}
    if (isDragging) {
        style['position'] = 'absolute'
        style['top'] = y
        style['left'] = x
    }

    return (
        <div className={classes.task} ref={taskBox} onMouseDown={startDrag} onMouseMove={dragTask} onMouseUp={endDrag} style={style}>
            <h1>{props.item}</h1>
            <p>{props.description}</p>
        </div>
    )
}

export default Task