import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function App() {
  const [todo, setTodo] = useState('')
  const [selectedFilter,setFilter] = useState('all')
  const [todos,setTodos] = useState([])

  useEffect(()=>{ getTodos()},[])

  let filteredTodos = filterTodos(todos,selectedFilter)
  let filters = ['all','active','done']
  let numOfTodos = filteredTodos.length

  

  let displayedTodos = filteredTodos.map(todo =>(
    <div key={todo._id} className="todo">
        <div className={todo.done? 'done':''}>
            <button onClick={() => handlePatch(!todo.done,todo)} className="toggle" aria-label="Change the state of todo"/>
        </div>

        <div>
            <input aria-label="Edit todo" type="text" defaultValue={todo.text} onInput={e => todo.text = e.target.value}/>
            <button onClick={() => handlePatch(todo.done,todo)} className="save" aria-label="Save todo" />
		    </div>
            <button onClick={() => handleDelete(todo)} className="delete" aria-label="Delete todo"/>
      
    </div>
  ))

  const filterButtons = filters.map(filter =>(
    <button onClick={() => setFilter(filter)}
    className="filter">{filter}</button>
  ))

  function filterTodos(todos, filter) {

    switch (filter.toLowerCase()) {
      case 'all':
        return todos
      case 'active':
        return todos.filter((todo) => !todo.done)
      case 'done':
        return todos.filter((todo) => todo.done)
	  default:
		  return todos
    }
  }

  function getTodos(){
    axios
        .get(
      'http://localhost:4000/api/todos'
        )
        .then(response => {

          setTodos(response.data)
        });
    }
  function handlePatch(tempDone,todo){
    axios
    .patch('http://localhost:4000/api/todos/' + todo._id,{text:todo.text, done:tempDone})
    .then(response => {
        if (response.data) {
          setTodos(response.data)
        }
      });
  }
  function handleDelete(todo){
    axios
      .delete('http://localhost:4000/api/todos/' + todo._id)
    .then(response => {
        if (response.data) {
          setTodos(response.data)
        }
      });
  }
    
  function handlePost(){
    axios
        .post('http://localhost:4000/api/todos',{text: todo})
        .then(response => {
          if (response.data) {
            setTodos(response.data)
          }
        });
      setTodo("")
    }
    
  const onKeyPress = e => {
    if (e.charCode === 13) handlePost();
  };
  return (
<div className="todos">
	<h1>Todos</h1>

	<div className="new" onKeyPress={onKeyPress}>
		<input value ={todo} onChange={e => setTodo(e.target.value)} aria-label="Add todo" placeholder="+ tap to add a todo" />
	</div>
  {displayedTodos}
	<div className="actions">
		<span>{numOfTodos} left</span>
		<div className="filters">
			{filterButtons}
		</div>
	</div>
</div>
  )
}

export default App
