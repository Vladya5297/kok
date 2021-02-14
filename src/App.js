import { useState } from 'react'
import classes from './App.module.css'

const Barrier = ({ number, remove, P, setP }) => {
  const [um, setUm] = useState(0)
  const [fm, setFm] = useState(0)
  
  const recalculateP = (um, fm) => {
    if (um === 0 || fm === 0) {
      setP(NaN)
    } else {
      setP((1 / um) / (1 / um + 1 / fm))
    }
  }

  return (
    <div className={classes.barrier}>
      <span>{`Преграда ${number}`}</span>
      <span>um</span>
      <input
        type='number'
        min={0}
        value={um}
        onChange={({ target }) => {
          const value = parseFloat(target.value)
          setUm(value)
          recalculateP(value, fm)
        }}/>
      <span>fm</span>
      <input
        type='number'
        min={0}
        value={fm}
        onChange={({ target }) => {
          const value = parseFloat(target.value)
          setFm(value)
          recalculateP(um, value)
        }}/>
      <span>{`Pнсд = ${P || 'Деление на ноль'}`}</span>
      {number !== 1 && <button onClick={remove}>Удалить</button>}
    </div>
  )
}

const App = () => {
  const [barriers, setBarriers] = useState([{ id: 1 }])
  
  const deleteBarrier = (id) => {
    setBarriers(barriers.filter(barrier => barrier.id !== id))
  }

  const setP = (id, P) => {
    setBarriers(barriers.map(barrier => {
      if (barrier.id === id) {
        return { id, P }
      } else {
        return barrier
      }
    }))
  }

  const total = 1 - barriers.reduce((accumulator, barrier) => {
    accumulator = accumulator * barrier.P
    return accumulator
  }, 1)

  return (
    <div>
      {barriers.map(({ id, P }, index) => (
        <Barrier
          key={id}
          number={index + 1}
          remove={() => { deleteBarrier(id) }}
          setP={(P) => setP(id, P)}
          P={P}
        />
      ))}
      <input
        type='button'
        value='Добавить преграду'
        onClick={() => {
          setBarriers([...barriers, { id: barriers.length + 1 }])
        }}
      />
      <div className={classes.total}>{`Pзащ = ${total || 'Невозможно вычислить'}`}</div>
    </div>
  )
}

export default App
