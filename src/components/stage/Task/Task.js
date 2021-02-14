import React, { useRef, useState } from 'react'
import classes from './Task.module.css'

const Task = (props) => {

    const taskBox = useRef(null)

    const [isDragging, setIsDragging] = useState(false)
    const [y, setY] = useState(-1)
    const [x, setX] = useState(-1)

    const startDrag = (e) => {
        const element = taskBox.current.getBoundingClientRect()
        console.log(element)
        console.log(`Mouse is at (${e.clientX},${e.clientY})`)
        console.log(`X is at (${e.clientX},${e.clientY})`)
        setX(e.clientX - (element.width / 2))
        setY(e.clientY)
        setIsDragging(true)
    }

    const dragTask = (e) => {
        if (isDragging) {
            const element = taskBox.current.getBoundingClientRect()
            console.log(element)
            setX(e.clientX - (element.width / 2))
            setY(e.clientY)

        }
    }

    const endDrag = (e) => {
        setIsDragging(false)
        props.boundaryCheck(e.clientX, e.clientY, props.taskId)
    }

    const style = {}
    if(isDragging) {
        style['position'] = 'absolute'
        style['top']  = y
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