import React, { useState, useEffect } from 'react'
import classes from './App.module.css'

const Barrier = ({ number, remove, P, setP, withH, H, checked, setChecked, barriers }) => {
  const [um, setUm] = useState(0)
  const [fm, setFm] = useState(0)
  const [rangeP, setRangeP] = useState(0)

  useEffect(() => {
    if (um === 0 || fm === 0 || (withH && H === 0)) {
      setP(NaN)
    } else {
      const result = withH
        ? (1 / um) / (1 / um + 1 / fm + 1 / H)
        : (1 / um) / (1 / um + 1 / fm)
      setP(result)
    }
  }, [H, withH, um, fm])

  useEffect(() => {
    const rangeP = barriers.slice(0, number).reduce((accumulator, barrier) => {
      return accumulator + barrier.P
    }, 0)
    setRangeP(rangeP)
  })

  return (
    <div className={classes.barrier}>
      <input
        type='checkbox'
        onChange={({ target }) => {
          setChecked(target.checked)
        }}
        disabled={number === 1}
        checked={checked}
      />
      <span>{`Преграда ${number}`}</span>
      <span>um</span>
      <input
        type='number'
        min={0}
        value={um}
        onChange={({ target }) => {
          const value = parseFloat(target.value)
          setUm(value)
        }}/>
      <span>fm</span>
      <input
        type='number'
        min={0}
        value={fm}
        onChange={({ target }) => {
          const value = parseFloat(target.value)
          setFm(value)
        }}/>
      <span>
        {'Pнсд'}
        <span className={classes.index}>
          {number}
        </span>
        {` = ${P ? +P.toFixed(3) : 'Деление на ноль'}`}
      </span>
      <span>
        {'Pзащ'}
        <span className={classes.index}>
          {number}
        </span>
        {` = ${P ? +(1 - P).toFixed(3) : 'Деление на ноль'}`}
      </span>
      {number !== 1 && (
      <>
        <span>
          {'Pзащ'}
          <span className={classes.index}>
            1-{number}
          </span>
          {` = ${rangeP ? +rangeP.toFixed(3) : 'Деление на ноль'}`}
        </span>
        <button onClick={remove}>Удалить</button>
      </>)}
    </div>
  )
}

const App = () => {
  const [barriers, setBarriers] = useState([{ id: 1, checked: true }])
  const [withH, setWithH] = useState(false)
  const [H, setH] = useState(0)

  const deleteBarrier = (id) => {
    setBarriers(barriers => barriers.filter(barrier => barrier.id !== id))
  }

  const setP = (id, P) => {
    setBarriers(barriers => barriers.map(barrier => {
      if (barrier.id === id) {
        return Object.assign({}, barrier, { P })
      } else {
        return barrier
      }
    }))
  }

  const setChecked = (id, checked) => {
    setBarriers(barriers => barriers.map(barrier => {
      if (barrier.id === id) {
        return Object.assign({}, barrier, { checked })
      } else {
        return barrier
      }
    }))
  }

  const total = 1 - barriers.reduce((accumulator, barrier) => {
    if (!barrier.checked) return accumulator
    accumulator = accumulator * barrier.P
    return accumulator
  }, 1)

  return (
    <div>
      <h1>Комплекс оценки защищённости</h1>
      <p>Разработчики:</p>
      <ul>
        <li>Овчинникова М. А.</li>
        <li>Ларюшина И. А.</li>
        <li>Комиссарова Е. Г.</li>
        <li>Кувшинов В. Л.</li>
      </ul>
      <hr />
      <span className={classes.barrier}>
        <span>Использовать H</span>
        <input
          type='checkbox'
          onChange={({ target }) => { setWithH(target.checked) }}
        />
        {withH &&
          <>
            <span>H = </span>
            <input
              type='number'
              value={H}
              onChange={({ target }) => { setH(parseFloat(target.value)) }}
            />
          </>
        }
      </span>
      {barriers.map(({ id, P, checked }, index) => (
        <Barrier
          key={id}
          number={index + 1}
          remove={() => { deleteBarrier(id) }}
          setP={(P) => setP(id, P)}
          setChecked={(checked) => setChecked(id, checked)}
          checked={checked}
          P={P}
          withH={withH}
          H={H}
          barriers={barriers}
        />
      ))}
      <input
        type='button'
        value='Добавить преграду'
        onClick={() => {
          setBarriers([...barriers, { id: barriers.length + 1, checked: true }])
        }}
      />
      <div className={classes.total}>
        {'Pзащ'}
        <span className={classes.index}>
          {'∑'}
        </span>
        {` = ${total}`}
      </div>
    </div>
  )
}

export default App
