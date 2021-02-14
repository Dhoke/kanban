import { useEffect, useState } from 'react';
import './App.css';
import TaskModal from './components/Layout/TaskModal';
import Stage from './components/stage/Stage';
import Task from './components/stage/Task/Task'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import awsconfig from './aws-exports'
import * as queries from './graphql/queries'
import * as subscriptions from './graphql/subscriptions'
import * as mutations from './graphql/mutations'

Amplify.configure(awsconfig)

function App() {

  const [refs, setRefs] = useState({})
  const [showModal, setShowModal] = useState(false)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // Get a list of existing tasks
    API.graphql({ query: queries.listTasks })
      .then(resp => {
        console.log(resp)
        setTasks(resp.data.listTasks.items)
      })

    // Subscribe to any new tasks coming in
    API.graphql(
      graphqlOperation(subscriptions.onCreateTask)
    ).subscribe({
      next: (item) => setTasks(old => [...old, item.value.data.onCreateTask])
    })

  }, [])

  useEffect(() => {
    console.log("Current list of tasks: ", tasks)
  }, [tasks])

  const doBoundaryCheck = (mouseX, mouseY, taskId) => {
    for (const [stage, ref] of Object.entries(refs)) {
      const { x, y, width, height } = ref.current.getBoundingClientRect()
      if (mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height) {

        // TODO: Update the task if needed
        const input = {
          id: taskId,
          stage
        }
        API.graphql({ query: mutations.updateTask, variables: { input } })
          .then(resp => {
            setTasks(old => {
              const update = [...old]
              update.filter(t => t.id === resp.data.updateTask.id)[0]['stage'] = stage
              return update
            })
          })
          .catch(err => console.error(err))
        break
      }
    }
  }

  const registerRef = (ref, stage) => {
    console.log('Registering...', ref)
    setRefs(refs => {
      const updated = { ...refs }
      updated[stage] = ref
      return updated
    })
  }

  const closeModal = () => setShowModal(false)

  const clearCompleted = () => {
    const completed = tasks.filter(t => t.stage === 'COMPLETE')
    completed.forEach(t => {
      const input = {
        id: t.id
      }
      API.graphql({query:mutations.deleteTask, variables:{input}})
      .then(resp => {
        setTasks(old => old.filter(t => t.id !== resp.data.deleteTask.id))
      })
      .catch(err => console.error(err))
    })
  }

  return (
    <div className="App">
      <div className="titleArea">
        <h1>Kanban</h1>
      </div>
      <div className="kanbanColumns">
        <Stage stage='CANDIDATE' register={registerRef} title="Candidates">
          {tasks.filter(t => t.stage === 'CANDIDATE').map(task => {
            return <Task taskId={task.id} key={task.id} item={task.item} description={task.description} boundaryCheck={doBoundaryCheck} />
          })}
        </Stage>
        <Stage stage='SUSPENDED' register={registerRef} title="Suspended">
          {tasks.filter(t => t.stage === 'SUSPENDED').map(task => {
            return <Task taskId={task.id} key={task.id} item={task.item} description={task.description} boundaryCheck={doBoundaryCheck} />
          })}
        </Stage>
        <Stage stage='TODO' register={registerRef} title="To-dos">
          {tasks.filter(t => t.stage === 'TODO').map(task => {
            return <Task taskId={task.id} key={task.id} item={task.item} description={task.description} boundaryCheck={doBoundaryCheck} />
          })}
        </Stage>
        <Stage stage='IN_PROGRESS' register={registerRef} title="In Progress">
          {tasks.filter(t => t.stage === 'IN_PROGRESS').map(task => {
            return <Task taskId={task.id} key={task.id} item={task.item} description={task.description} boundaryCheck={doBoundaryCheck} />
          })}
        </Stage>
        <Stage stage='BLOCKED' register={registerRef} title="Blocked">
          {tasks.filter(t => t.stage === 'BLOCKED').map(task => {
            return <Task taskId={task.id} key={task.id} item={task.item} description={task.description} boundaryCheck={doBoundaryCheck} />
          })}
        </Stage>
        <Stage stage='COMPLETE' register={registerRef} title="Completed">
          {tasks.filter(t => t.stage === 'COMPLETE').map(task => {
            return <Task taskId={task.id} key={task.id} item={task.item} description={task.description} boundaryCheck={doBoundaryCheck} />
          })}
        </Stage>
      </div>
      <div className='controls'>
        <button onClick={() => setShowModal(true)}>Add Task</button>
        <button onClick={clearCompleted}>Clear completed</button>
      </div>
      {showModal ? <TaskModal close={closeModal} /> : null}
    </div>
  );
}

export default App;
