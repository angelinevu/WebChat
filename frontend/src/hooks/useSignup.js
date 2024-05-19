import React, { useState } from 'react'
import toast from 'react-hot-toast';

/* FIX ERROR: Add or remove email for sign up, change fullName to name, or vice versa
*/

const useSignup = () => {
  const [loading, setLoading] = useState(false);

  const signup = async({fullName, username, password, confirmPassword}) => {
    const success = handleInputErrors({fullName, username, password, confirmPassword})
    if (!success) return;

    setLoading(true);
    try {
        const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({fullName, username, password, confirmPassword})
        })
    
        const data = await res.json();
        console.log(data)

    } catch (error) {
        toast.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  return { loading, signup}
}

export default useSignup

{/* Handle Input Errors */}
function handleInputErrors({fullName, username, password, confirmPassword}) {
    if (!fullName || !username || !password || !confirmPassword) {
        toast.error("Please fill in all fields")
        return false
    }

    if (password != confirmPassword) {
            toast.error("Passwords do not match")
            return false
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return false
    }

    return true
}