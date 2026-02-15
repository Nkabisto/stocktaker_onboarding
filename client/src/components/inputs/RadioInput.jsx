const RadioInput = ({label="", name="", value="",id,onChange, selectedValue})=>{
  return(
    <div className="flex items-center mb-2">
      <input
        type="radio"
        id = {id}
        name={name}
        value={value} // The value is the specific option ID (e.g., "Male")
        checked={selectedValue === value} // compare current selection to this ID
        onChange={onChange}
        className="mr-2"
        aria-checked={selectedValue ===value}
      />
      <label 
        htmlFor={id}
        className="cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default RadioInput;
