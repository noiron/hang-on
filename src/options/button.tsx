interface ButtonProps {
  children: React.ReactNode
  handleClick: () => void
  className?: string
}

const Button = (props: ButtonProps) => {
  const { handleClick, className = "", children } = props

  return (
    <button
      className={
        className +
        " bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded w-16"
      }
      onClick={handleClick}>
      {children}
    </button>
  )
}

export default Button
