import React from 'react'

export default function Result({tries,timer}) {
  return (
    <div>
        <h1>Result</h1>
        <h2>Time taken: {timer} seconds</h2>
        <h2>Attempts: {tries}</h2>
    </div>
  )
}
