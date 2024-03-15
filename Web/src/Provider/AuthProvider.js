
import React, { useState } from "react"

export const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('patientcare'))
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider