import { useEffect } from "react";
import { createContext, useState, useRef } from "react";
import { io } from 'socket.io-client'

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {

    const [person, setPerson] = useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const [newMessageFlag, setNewMessageFlag] = useState(false)
    const socket = useRef();

    useEffect(() => {
        socket.current = io('http://localhost:8000')
    }, [])

    return (
        <AccountContext.Provider value={{
            person,
            setPerson,
            socket,
            activeUsers,
            setActiveUsers,
            newMessageFlag,
            setNewMessageFlag
        }}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountProvider