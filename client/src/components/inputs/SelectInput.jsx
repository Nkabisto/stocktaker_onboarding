const SelectInput = ({label,name,value,onChange, options})=>{
  // Use 'name' as the 'id' so the label correctly links to the select
  const inputId = name;
  return(
    <div className="mb-4">
      <label htmlFor={inputId} 
        className="block font-semibold"
      >
        {label}
      </label>
      <select 
        id={inputId} //Required for the label to work
        name={name}
        className="w-full p-2 border rounded-lg"
        value={value}
        onChange={onChange}
      >
       {options.map((option)=>(
          <option 
            key={option.value} 
            value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectInput;
