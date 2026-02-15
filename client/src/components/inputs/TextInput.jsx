const TextInput = ({label,name,value,onChange,type="text",placeholder,required=false,maxLength,pattern,filterRegex})=>{
  // Internal handler to clean data BEFORE sending to parent
  const handleInternalChange = (e) => {
    let val = e.target.value;
    // 1. Apply real-time character filtering (e.g., remove symbols)
    if (filterRegex){
      val = val.replace(filterRegex, '');
    }
    
    // 2. Respect maxLength if provided
    if (maxLength && val.length > maxLength) return;
    
    onChange({ target: { name, value: val } });
    
  return(
    <div className="mb-4">
      <label htmlFor={name} className="block font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleInternalChange}
        placeholder={placeholder}
        required = {required}
        pattern={pattern}
        className="w-full p-2 border rounded-lg"
      />
    </div>
  );
};

export default TextInput;
