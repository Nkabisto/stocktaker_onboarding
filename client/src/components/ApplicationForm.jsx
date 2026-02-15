import { useState } from "react";
import DatePicker from "./inputs/DatePicker";
import SelectInput from "./inputs/SelectInput";
import TextInput from "./inputs/TextInput";
import RadioInput from "./inputs/RadioInput";
import TextAreaInput from "./inputs/TextAreaInput";

const ApplicationForm=() => {
  const [formData, setFormData]=useState({
    firstnames:'',
    surname:'',
    gender:'Male',
    birthdate:'',
    said:'',
    contactnumber:'',
    secondarycontact:'',
    facebookurl:''
  });

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
    
  const handleSubmit=(e)=>{
    e.preventDefault();

    const requiredInputFields=['firstnames','surname',
      'gender','birthdate','said','contactnumber'];
    
    // validations
    for(const inputField of requiredInputFields){
      if(!formData[inputField]){ 
        alert(`Please fill in ${inputField}`);
        return
      }
    }

    console.log('Form submitted:', formData);

    // Reset form data
    setFormData({
      firstnames:'',
      surname:'',
      gender:'Male',
      birthdate:'',
      said:'',
      contactnumber:'',
      secondarycontact:'',
      facebookurl:''
    });

    alert('Form submitted successfully!');
  };

  return(
    <>
      <h2 className="text-xl font-bold mb-4">Your personal details </h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <TextInput
          label="First Name(s)"
          name="firstnames"
          value={formData.firstnames}
          onChange={handleChange}
          required={true}
          maxLength={255}
          filterRegex={/[^a-zA-Z\s-]/g}
          className="w-full p-2 border rounded-lg"
        />
    
        <TextInput
          label="Surname"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          required={true}
          maxLength={255}
          filterRegex={/[^a-zA-Z\s-]/g}
          className="w-full p-2 border rounded-lg"
        />
      
        <RadioInput
          label="Male"
          name="gender"
          value="Male"
          id="gender-male"
          onChange={handleChange}
          selectedValue={formData.gender}
        />

        <RadioInput
          label="Female"
          name="gender"
          value="Female"
          id="gender-female"
          onChange={handleChange}
          selectedValue={formData.gender}
        />

        <RadioInput
          label="Prefer not to say"
          name="gender"
          value="Prefer not to say"
          id="gender-unspecified"
          onChange={handleChange}
          selectedValue={formData.gender}
        />
        
        <DatePicker
          label="Birth Date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleChange}
          required={true}
        />
        
        <TextInput
          label="SA ID Number"
          name="said"
          value={formData.said}
          onChange={handleChange}
          required={true}
          maxLength={13}
          pattern="^([0-9]{2})([0-1][0-9])([0-3][0-9])([0-9]{4})([0-1])([0-9]{2})[0-9]$"
          filterRegex={/[^0-9]/g}
          className="w-full p-2 border rounded-lg"
        />
    
        <TextInput
          label="Cellphone Number"
          name="contactnumber"
          value={formData.contactnumber}
          onChange={handleChange}
          type="tel"
          placeholder="e.g 0721234567"
          required={true}
          maxLength={10}
          pattern="0[6-8][0-9]{8}" // Matches local 10-digit format starting with 0
          filterRegex={/[^0-9]/g}    
          className="w-full p-2 border rounded-lg"
        />

        <TextInput
          label="Alternative Contact"
          name="secondarycontact"
          value={formData.secondarycontact}
          onChange={handleChange}
          type="tel"
          placeholder="e.g 0721234567"
          maxLength={10}
          pattern="0[6-8][0-9]{8}" // Matches local 10-digit format starting with 0
          filterRegex={/[^0-9]/g}    
          className="w-full p-2 border rounded-lg"
        />

        <TextInput
          label="Facebook URL"
          name="facebookurl"
          value={formData.facebookurl}
          onChange={handleChange}
          maxLength={255}
          className="w-full p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Application
        </button>
      </form>
    </>
  );
};

export default ApplicationForm;

