import React from 'react'
import { auth, db } from './firebase'
import { useNavigate } from 'react-router-dom'
export default function Home() {
    const { currentUser } = auth
    const navigate = useNavigate()
    const newGameOptions = [
        { label: 'Black pieces', value: 'b' },
        { label: 'White pieces', value: 'w' },
        { label: 'Random', value: 'r' },
    ]

    async function startOnlineGame(startingPiece) {
        const member = {
            uid: currentUser.uid,
            piece: startingPiece === 'r' ? ['b', 'w'][Math.round(Math.random())] : startingPiece,
            name: localStorage.getItem('userName'),
            creator: true
        }
        const game = {
            status: 'waiting',
            members: [member],
            gameId: `${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
        }
        await db.collection('games').doc(game.gameId).set(game)
        navigate(`/game/${game.gameId}`)
    }

    return (
        <>
            <div className="modal-background">
                <div className="modal-content">
                    <div className="card">
                        <div className="card-content">
                            <div className="content">
                                Please {localStorage.getItem('userName')}, select the piece you want to start with
                            </div>

                        </div>
                        <footer className="card-footer">
                            {newGameOptions.map(({ label, value }) => (
                                <span className="card-footer-item pointer" key={value}
                                    onClick={() => startOnlineGame(value)}>
                                    {label}
                                </span>
                            ))}
                        </footer>
                    </div>
                </div>
            </div>
        </>
    )
}