const TextInput = ({label,type="text", name, value, onChange,maxLength=255, required=false})=>{
  const handleChange=(e)=>{
    const inputValue = e.target.value;
    // Regex: Remove anything NOT a letter, space, or hyphen
    const filteredValue = inpuotValue.replace(/[^a-zA-Z\s-]/g, '');
    // Only call onChange if the value is within length and passes the filter.
    if(filteredValue.length <= maxLength){
      onChange({target: {name, value: filteredValue }});
    )
  };
  return(
    <div className="mb-4">
      <label htmlFor={name} className="block font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        required = {required}
        className="w-full p-2 border rounded-lg"
      />
    </div>
  );
}

export default TextInput;
