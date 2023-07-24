interface IProps {
  value: number | string;
  onChange: (value: number | string) => void;
  className?: string;
  type?: string;
  [rest: string]: any;
}

const Input = (props: IProps) => {
  const { value, onChange, className, type = "text", ...rest } = props

  return (
    <input
      type={type}
      className={
        className +
        " shadow appearance-none border rounded w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      }
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      {...rest}
      ></input>
  )
}

export default Input
