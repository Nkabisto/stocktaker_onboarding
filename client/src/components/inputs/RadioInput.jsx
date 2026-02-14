const RadioInput = ({label, name, value,id,onChange, selectedValue=false})=>{
  return(
    <div className="mb-4">
      <input
        type="radio"
        id = {id}
        name={name}
        value={value}
        checked={selectedValue ===value}
        onChange={onChange}
        className="mr-2"
      >
      <label 
        htmlFor={id}
        className="cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default RadioInput;
