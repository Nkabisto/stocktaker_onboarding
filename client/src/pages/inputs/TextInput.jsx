import { useRef } from 'react';

const TextInput = ({label,name,value,onChange,type="text",placeholder,required=false,maxLength,pattern,filterRegex})=>{
  const inputRef = useRef(null);
  // Internal handler to clean data BEFORE sending to parent
  const handleInternalChange = (e) => {
    const cursor = e.target.selectionStart;
    let val = e.target.value;
    // 1. Apply real-time character filtering (e.g., remove symbols)
    if (filterRegex){
      if (filterRegex instanceof RegExp){
        val = val.replace(filterRegex, '');
      }else{
        console.warn('TextInput: filterRegex must be a RegExp object');
      }
    }

    // 2. Respect maxLength if provided
    if (maxLength && val.length > maxLength)val=val.slice(0,maxLength); 
   // Create a new event-like object but keep original event methods 
    const newEvent = { 
      ...e,
      target: { 
        ...e.target,
        name, 
        value: val,
      }, 
    };
    onChange(newEvent);
    // After render, restore cursor position
    // Adjust cursor position if characters were removed before it
    setTimeout(()=>{
      if(inputRef.current){
        const newLength = val.length;
        const adjustedCursor = Math.min(cursor, newLength);
        inputRef.current.setSelectionRange(adjustedCursor, adjustedCursor);
      }
    },0);
  }; 
  return(
    <div className="mb-4">
      <label htmlFor={name} className="block font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input 
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleInternalChange}
        placeholder={placeholder}
        required = {required}
        pattern={pattern}
        maxLength={maxLength}
        className="w-full p-2 border rounded-lg"
      />
    </div>
  );
};

export default TextInput;
