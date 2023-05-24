
import React, { useState } from "react"
import Cookies from "universal-cookie";

export const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const localcookies = new Cookies();
  const [token, setToken] = useState(localcookies.get('patientcare'))
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthProvider