import React, { useState } from 'react'
import classes from './TaskModal.module.css'
import { API } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'

const TaskModal = (props) => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [updateInProgress, setUpdateInProgress] = useState(false)

    const doClose = (e) => {
        if (e.target.id === 'modalBack' || e.target.id === 'cancel') {
            props.close()
        }
    }

    const doAddTask = () => {
        const input = {
            item: name,
            description,
            stage: 'CANDIDATE'
        }
        if (!updateInProgress) {
            setUpdateInProgress(true)
            API.graphql({ query: mutations.createTask, variables: { input } })
                .then(props.close)
                .catch(err => console.error(err))
                .finally(setUpdateInProgress(false))
        }
    }

    return (
        <div className={classes.modalBack} id="modalBack" onClick={doClose}>
            <div className={classes.modalCard}>
                <div className={classes.modalHeader}>
                    <h1>Enter New Task</h1>
                </div>
                <div className={classes.modalInput}>
                    <input autoFocus placeholder="Task name" onChange={(e) => setName(e.target.value)} value={name} />
                    <input placeholder="Task description" onChange={(e) => setDescription(e.target.value)} value={description} />
                </div>
                <div className={classes.modalControls}>
                    <button className={classes.cancel} id="cancel" onClick={doClose}>Cancel</button>
                    <button className={classes.confirm} onClick={doAddTask}>Add Task</button>
                </div>
            </div>
        </div>
    )
}

export default TaskModal