const SelectInput = ({label="",name="",value="",onChange, options=[], required=false, disabled=false,placeholder=`Select ${label.toLowerCase()}`})=>{
  // Ensure options is an array and  has valid items
  const validOptions = Array.isArray(options) ? options : [];

  return(
    <div className="mb-4">
      <label htmlFor={name} 
        className="block font-semibold"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select 
        id={name} //Required for the label to work
        name={name}
        className="w-full p-2 border rounded-lg"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        <option 
          value="" disabled>
          {placeholder} 
        </option>
        {validOptions.map((option,index)=>(
          <option 
            key={option.value || index} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
