const TextAreaInput = ({label,name,value,onChange, required=false, rows=4})=>{
  return( 
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block font-semibold">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className="w-full p-2 border rounded-lg"
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
      ></textarea>
    </div>
  );
};

export default TextAreaInput;
