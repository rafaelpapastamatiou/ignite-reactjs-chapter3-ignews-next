import { useState } from "react";
import { useEffect } from "react";

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [isButtonInvisible, setIsButtonInvisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true)
    }, 2000)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setIsButtonInvisible(true)
    }, 3000)
  }, [])

  return (
    <div>
      <h1>Hello World</h1>
      {isButtonVisible && <button>Visible after 2 seconds</button>}
      {!isButtonInvisible && <button>Invisible after 3 seconds</button>}
    </div>
  )
}