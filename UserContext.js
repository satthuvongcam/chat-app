import { createContext, useState } from 'react'

const UserType = createContext()

const UserContext = ({ children }) => {
  const [userId, setUserId] = useState('')
  const [messages, setMessages] = useState([])

  return (
    <UserType.Provider value={{ userId, setUserId, messages, setMessages }}>
      {children}
    </UserType.Provider>
  )
}

export { UserType, UserContext }
