const DatePicker = ({label,name,value,onChange,required=false})=>{
  return (
    <div className='mb-4'>
      <label 
        htmlFor={name}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label}
      </label>
      <input
        type="date"
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="shadow appearance-none border rounded w-full py-2 px-3"
      />
    </div>
  );
};

export default DatePicker;
      
