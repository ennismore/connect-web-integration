import React, { useState } from 'react'
import styles from '../styles/Eliza.module.css'
import {
    createPromiseClient,
    createConnectTransport,
} from '@bufbuild/connect-web'
import { HelloService } from '../gen/hello/v1/hello_connectweb.js'

interface Response {
    text: string
    sender: 'eliza' | 'user'
}

function App() {
    const [statement, setStatement] = useState<string>('')
    const [responses, setResponses] = useState<Response[]>([
        {
            text: 'What is your name?',
            sender: 'eliza',
        },
    ])

    // Make the Eliza Service client
    const client = createPromiseClient(
        HelloService,
        createConnectTransport({
            baseUrl: 'http://localhost:3001', //local em-booking-api after skafflolding (+cors from buf demo if without kong)
        }),
        
    )

    const send = async (message: string) => {
        setResponses((resp) => [...resp, { text: message, sender: 'user' }])
        setStatement('')

        const response = await client.sayHello({
            message,
        })

        setResponses((resp) => [
            ...resp,
            { text: response.message, sender: 'eliza' },
        ])
    }

    const handleStatementChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setStatement(event.target.value)
    }

    const handleSend = () => {
        send(statement)
    }

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            handleSend()
        }
    }

    return (
        <div>
            <header className={styles.appHeader}>
                <h1 className={styles.headline}>Eliza</h1>
            </header>
            <div className={styles.container}>
                {responses.map((resp, i) => {
                    return (
                        <div
                            key={`resp${i}`}
                            className={
                                resp.sender === 'eliza'
                                    ? styles.elizaRespContainer
                                    : styles.userRespContainer
                            }
                        >
                            <p className={styles.respText}>{resp.text}</p>
                        </div>
                    )
                })}
                <div>
                    <input
                        type="text"
                        className={`${styles.textInput} ${styles.statementInput}`}
                        value={statement}
                        onChange={handleStatementChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button className={styles.button} onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default App
