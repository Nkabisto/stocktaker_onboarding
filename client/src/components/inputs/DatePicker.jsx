const DatePicker = ({label,name,value,onChange,required=false, min,max,id})=>{
  const inputId = id || name;
  const formatDateForInput = (dateValue) =>{
    if(!dateValue) return '';
    
    if (dateValue instanceof Date){
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2,'0');
      const day = String(dateValue.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    //Assume it's already in YYYY-MM-DD or return as-is
    return dateValue;
  };
  
  const handleDateChange = (e)=>{
    const dateString = e.target.value;

    // Convert to Date object for parent (using UTC to avoid timezone issues)
    const dateValue = dateString ? new Date(dateString + 'T00:00:00') : null;

    onChange({
      target:{
        name,
        value: dateValue
      }
    });
  };
  return (
    <div className='mb-4'>
      <label 
        htmlFor={inputId}
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={inputId}
        name={name}
        type="date"
        value={formatDateForInput(value)}
        onChange={handleDateChange}
        required={required}
        min={min}
        max={max}
        className="shadow appearance-none border rounded w-full py-2 px-3"
      />
    </div>
  );
};

export default DatePicker;
      
