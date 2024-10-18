import React from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const navigate = useNavigate()

    const startGame = () => {
        navigate('/game')
    }

    return (
        <div className="d-flex align-items-center justify-content-center mt-5">
            <div className="text-center " >
                <h1 style={{fontSize:'75px', color:'black' }} className='pt-5 pb-5'>Drag and Drop Table</h1>
                <button className="btn btn-success mt-5 " onClick={startGame}>Start Game</button>
            </div>
        </div>
    )
}