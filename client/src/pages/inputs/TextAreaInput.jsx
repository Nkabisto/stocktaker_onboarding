const TextAreaInput = ({label="",name="",value="",onChange, required=false,placeholder="",rows=4,disabled=false,maxLength})=>{
  return( 
    <div className="mb-4">
      <label 
        htmlFor={name} 
        className="block font-semibold">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        className="w-full p-2 border rounded-lg"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-disabled={disabled}
      />
    </div>
  );
};

export default TextAreaInput;
