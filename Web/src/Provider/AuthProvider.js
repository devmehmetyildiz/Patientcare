
import React, { useState } from "react"
import { STORAGE_KEY_PATIENTCARE_ACCESSTOKEN } from "../Utils/Constants"

export const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN))
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider