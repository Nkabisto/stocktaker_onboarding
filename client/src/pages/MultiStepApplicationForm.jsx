// MultiStepApplicationForm.jsx
import { useState, useEffect, useCallback } from "react";
import DatePicker from "./inputs/DatePicker";
import SelectInput from "./inputs/SelectInput";
import TextInput from "./inputs/TextInput";
import RadioInput from "./inputs/RadioInput";
import TextAreaInput from "./inputs/TextAreaInput";

// Helper function to get default form data (avoids duplication)
const getDefaultFormData = () => ({
  // Step 1: Personal
  firstnames: "",
  surname: "",
  gender: "Male",
  birthdate: "",
  said: "",
  southAfricanCitizen: "Yes",
  race: "",

  // Step 2: Contact & Address
  email: "",
  contactnumber: "",
  secondarycontact: "",
  facebookurl: "",
  address: "",
  suburb: "",
  city: "",
  postcode: "",

  // Step 3: Education & Qualifications
  grade11Passed: "",
  highestGrade: "",
  tertiaryInstitution: "",
  fieldOfStudy: "",
  yearCompleted: "",

  // Step 4: Skills & Interests
  skillsInterest: "",
  driversLicense: "",
  otherSkills: "",

  // Step 5: Availability & How Heard
  availability: "",
  howHeard: "",
  otherHowHeard: "",
  trainingFeeAware: "",
  transportAware: "",
});

// Validation rules for each step
const stepValidations = {
  1: (data) => ({
    isValid: data.firstnames && data.surname && data.birthdate && data.said,
    message: "Please fill in all required fields in Personal Information"
  }),
  2: (data) => ({
    isValid: data.email && data.contactnumber && data.address,
    message: "Please fill in all required fields in Contact Details"
  }),
  3: (data) => ({
    isValid: data.grade11Passed && data.highestGrade,
    message: "Please fill in all required fields in Education"
  }),
  4: (data) => ({
    isValid: true, // No required fields in step 4
    message: ""
  }),
  5: (data) => ({
    isValid: data.availability && data.howHeard && data.trainingFeeAware && data.transportAware,
    message: "Please fill in all required fields in Availability"
  })
};

const MultiStepApplicationForm = () => {
  // State with proper error handling for localStorage
  const [step, setStep] = useState(() => {
    try {
      const saved = localStorage.getItem('stocktaker-form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.step && parsed.step >= 1 && parsed.step <= 5 ? parsed.step : 1;
      }
    } catch (e) {
      console.warn('Failed to load saved step from localStorage', e);
    }
    return 1;
  });

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('stocktaker-form');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge saved data with default to handle any missing fields
        return { ...getDefaultFormData(), ...parsed.formData };
      }
    } catch (e) {
      console.warn('Failed to load saved form data from localStorage', e);
    }
    return getDefaultFormData();
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Debounced save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const dataToSave = {
          step,
          formData,
          lastSaved: new Date().toISOString()
        };
        localStorage.setItem('stocktaker-form', JSON.stringify(dataToSave));
        setSaveStatus('All changes saved');
        
        // Clear status after 3 seconds
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (e) {
        console.error('Failed to save to localStorage', e);
        setSaveStatus('Failed to save changes');
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timer);
  }, [step, formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    validateField(name, formData[name]);
  }, [formData]);

  const validateField = (name, value) => {
    // Add field-specific validation if needed
    const fieldErrors = {
      email: (val) => val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Invalid email format' : null,
      contactnumber: (val) => val && !/^0[6-8][0-9]{8}$/.test(val) ? 'Invalid SA cellphone number' : null,
      said: (val) => val && !/^[0-9]{13}$/.test(val) ? 'ID number must be 13 digits' : null,
      postcode: (val) => val && !/^[0-9]{4}$/.test(val) ? 'Postcode must be 4 digits' : null,
    };

    if (fieldErrors[name]) {
      const error = fieldErrors[name](value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const validateStep = (stepNumber) => {
    const validation = stepValidations[stepNumber](formData);
    if (!validation.isValid) {
      alert(validation.message);
      
      // Mark all fields in current step as touched to show errors
      const stepFields = getStepFields(stepNumber);
      const touchedFields = {};
      stepFields.forEach(field => {
        touchedFields[field] = true;
      });
      setTouched(prev => ({ ...prev, ...touchedFields }));
      
      return false;
    }
    return true;
  };

  const getStepFields = (stepNumber) => {
    const fields = {
      1: ['firstnames', 'surname', 'birthdate', 'said'],
      2: ['email', 'contactnumber', 'address'],
      3: ['grade11Passed', 'highestGrade'],
      4: [],
      5: ['availability', 'howHeard', 'trainingFeeAware', 'transportAware']
    };
    return fields[stepNumber] || [];
  };

  const nextStep = () => {
    if (step < 5 && validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0); // Scroll to top on step change
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
      setFormData(getDefaultFormData());
      setStep(1);
      setErrors({});
      setTouched({});
      localStorage.removeItem('stocktaker-form');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate final step
    if (!validateStep(5)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Final submission:", formData);
      
      // Clear saved form on successful submission
      localStorage.removeItem('stocktaker-form');
      
      alert("Application submitted successfully! We'll be in touch within 5-7 business days.");
      
      // Reset form after submission
      setFormData(getDefaultFormData());
      setStep(1);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common button styles
  const buttonClass = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const submitButtonClass = "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed";

  // Progress percentage
  const progressPercentage = ((step - 1) / 4) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header with save status and reset */}
      <div className="flex justify-between items-center mb-4">
        <div>
          {saveStatus && (
            <span className={`text-sm ${saveStatus.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {saveStatus}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear Form
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Intro text */}
      <div className="mb-6 p-4 bg-gray-100 rounded border-l-4 border-blue-500">
        <h1 className="text-xl font-bold mb-2">Dial a Stocktaker Application Form</h1>
        <p className="text-sm mb-2 font-semibold">PLEASE READ THIS!</p>
        <p className="text-sm mb-2">
          Your application is just the first step. Make sure you are prepared for the next stages!
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Dial a Stocktaker is a division of Dial a Student, established in 1988...
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="step animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">Personal Information</h2>
            
            <TextInput
              label="First Name(s)"
              name="firstnames"
              value={formData.firstnames}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={255}
              filterRegex={/[^a-zA-Z\s-]/g}
              error={touched.firstnames && !formData.firstnames ? 'First name is required' : null}
            />
            
            <TextInput
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={255}
              filterRegex={/[^a-zA-Z\s-]/g}
              error={touched.surname && !formData.surname ? 'Surname is required' : null}
            />
            
            <div className="mb-2">
              <label className="block font-semibold">Gender</label>
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
            </div>
            
            <DatePicker
              label="Birth Date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={touched.birthdate && !formData.birthdate ? 'Birth date is required' : null}
            />
            
            <TextInput
              label="SA ID Number"
              name="said"
              value={formData.said}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={13}
              pattern="^[0-9]{13}$"
              filterRegex={/[^0-9]/g}
              error={touched.said && !formData.said ? 'ID number is required' : errors.said}
            />
            
            <TextInput
              label="Race (optional)"
              name="race"
              value={formData.race}
              onChange={handleChange}
              maxLength={50}
            />
            
            <div className="mb-4">
              <label className="block font-semibold">Are you a South African citizen?</label>
              <RadioInput
                label="Yes"
                name="southAfricanCitizen"
                value="Yes"
                id="citizen-yes"
                onChange={handleChange}
                selectedValue={formData.southAfricanCitizen}
              />
              <RadioInput
                label="No"
                name="southAfricanCitizen"
                value="No"
                id="citizen-no"
                onChange={handleChange}
                selectedValue={formData.southAfricanCitizen}
              />
            </div>
            
            <button type="button" onClick={nextStep} className={buttonClass}>
              Next
            </button>
          </div>
        )}

        {/* Step 2: Contact & Address */}
        {step === 2 && (
          <div className="step animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">Contact Details & Address</h2>
            
            <TextInput
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              type="email"
              required
              error={touched.email && !formData.email ? 'Email is required' : errors.email}
            />
            
            <TextInput
              label="Cellphone Number"
              name="contactnumber"
              value={formData.contactnumber}
              onChange={handleChange}
              onBlur={handleBlur}
              type="tel"
              placeholder="e.g 0721234567"
              required
              maxLength={10}
              pattern="^0[6-8][0-9]{8}$"
              filterRegex={/[^0-9]/g}
              error={touched.contactnumber && !formData.contactnumber ? 'Cellphone number is required' : errors.contactnumber}
            />
            
            <TextInput
              label="Alternative Contact"
              name="secondarycontact"
              value={formData.secondarycontact}
              onChange={handleChange}
              type="tel"
              placeholder="e.g 0721234567"
              maxLength={10}
              pattern="^0[6-8][0-9]{8}$"
              filterRegex={/[^0-9]/g}
            />
            
            <TextInput
              label="Facebook URL (optional)"
              name="facebookurl"
              value={formData.facebookurl}
              onChange={handleChange}
              maxLength={255}
            />
            
            <TextAreaInput
              label="Physical Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={2}
              placeholder="Street address"
              required
              error={touched.address && !formData.address ? 'Address is required' : null}
            />
            
            <TextInput
              label="Suburb"
              name="suburb"
              value={formData.suburb}
              onChange={handleChange}
            />
            
            <TextInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            
            <TextInput
              label="Postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={4}
              filterRegex={/[^0-9]/g}
              error={errors.postcode}
            />
            
            <div className="flex">
              <button type="button" onClick={prevStep} className={buttonClass}>
                Previous
              </button>
              <button type="button" onClick={nextStep} className={buttonClass}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Education & Qualifications */}
        {step === 3 && (
          <div className="step animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">Education & Qualifications</h2>
            
            <div className="mb-4">
              <label className="block font-semibold">Have you passed Grade 11?</label>
              <RadioInput
                label="Yes"
                name="grade11Passed"
                value="Yes"
                id="grade11-yes"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.grade11Passed}
              />
              <RadioInput
                label="No"
                name="grade11Passed"
                value="No"
                id="grade11-no"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.grade11Passed}
              />
              {touched.grade11Passed && !formData.grade11Passed && (
                <p className="text-red-500 text-sm mt-1">Please select an option</p>
              )}
            </div>
            
            <SelectInput
              label="Highest Grade / Qualification"
              name="highestGrade"
              value={formData.highestGrade}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[
                { value: "Grade11", label: "Grade 11" },
                { value: "Grade12", label: "Grade 12 / Matric" },
                { value: "Certificate", label: "Certificate" },
                { value: "Diploma", label: "Diploma" },
                { value: "Degree", label: "Degree" },
                { value: "Postgraduate", label: "Postgraduate" },
              ]}
              placeholder="Select highest qualification"
              required
              error={touched.highestGrade && !formData.highestGrade ? 'Please select your highest qualification' : null}
            />
            
            <TextInput
              label="Tertiary Institution (if applicable)"
              name="tertiaryInstitution"
              value={formData.tertiaryInstitution}
              onChange={handleChange}
            />
            
            <TextInput
              label="Field of Study"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleChange}
            />
            
            <TextInput
              label="Year Completed"
              name="yearCompleted"
              value={formData.yearCompleted}
              onChange={handleChange}
              maxLength={4}
              filterRegex={/[^0-9]/g}
              placeholder="YYYY"
            />
            
            <div className="flex">
              <button type="button" onClick={prevStep} className={buttonClass}>
                Previous
              </button>
              <button type="button" onClick={nextStep} className={buttonClass}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Skills & Interests */}
        {step === 4 && (
          <div className="step animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">Skills & Interests</h2>
            
            <SelectInput
              label="Area of interest / skills (main)"
              name="skillsInterest"
              value={formData.skillsInterest}
              onChange={handleChange}
              options={[
                { value: "Accounts", label: "Accounts" },
                { value: "Administration", label: "Administration" },
                { value: "Cashier", label: "Cashier" },
                { value: "Call Centre", label: "Call Centre" },
                { value: "First Aid", label: "First Aid" },
                { value: "Marketing", label: "Marketing" },
                { value: "Promotions", label: "Promotions" },
                { value: "Shelf packing", label: "Shelf packing" },
                { value: "Stock taking", label: "Stock taking" },
                { value: "Care giver", label: "Care giver" },
                { value: "Other", label: "Other" },
              ]}
              placeholder="Select primary skill"
            />
            
            <SelectInput
              label="Driver's license"
              name="driversLicense"
              value={formData.driversLicense}
              onChange={handleChange}
              options={[
                { value: "None", label: "None" },
                { value: "Code A", label: "Code A" },
                { value: "Code B", label: "Code B" },
                { value: "Code EB", label: "Code EB" },
                { value: "Code C", label: "Code C" },
              ]}
              placeholder="Select license"
            />
            
            <TextAreaInput
              label="Other skills or hobbies"
              name="otherSkills"
              value={formData.otherSkills}
              onChange={handleChange}
              rows={3}
              placeholder="e.g., first aid, computer skills, etc."
            />
            
            <div className="flex">
              <button type="button" onClick={prevStep} className={buttonClass}>
                Previous
              </button>
              <button type="button" onClick={nextStep} className={buttonClass}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Availability & Additional Info */}
        {step === 5 && (
          <div className="step animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">Availability & Final Questions</h2>
            
            <SelectInput
              label="Availability for stocktakes"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[
                { value: "Full Day", label: "Full Day" },
                { value: "Weekends only", label: "Weekends only" },
                { value: "After hours", label: "After hours" },
                { value: "Any", label: "Any" },
              ]}
              placeholder="Select availability"
              required
              error={touched.availability && !formData.availability ? 'Please select your availability' : null}
            />
            
            <SelectInput
              label="How did you hear about us?"
              name="howHeard"
              value={formData.howHeard}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[
                { value: "Search Engine", label: "Search Engine" },
                { value: "Television", label: "Television" },
                { value: "Print Media", label: "Print Media" },
                { value: "Friend/Family", label: "Friend/Family" },
                { value: "Facebook", label: "Facebook" },
                { value: "Other", label: "Other" },
              ]}
              placeholder="Select one"
              required
              error={touched.howHeard && !formData.howHeard ? 'Please select how you heard about us' : null}
            />
            
            {formData.howHeard === "Other" && (
              <TextInput
                label="Please specify"
                name="otherHowHeard"
                value={formData.otherHowHeard}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={touched.otherHowHeard && !formData.otherHowHeard ? 'Please specify how you heard about us' : null}
              />
            )}
            
            <div className="mb-4">
              <label className="block font-semibold">Are you aware of the R80 training fee?</label>
              <RadioInput
                label="Yes"
                name="trainingFeeAware"
                value="Yes"
                id="fee-yes"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.trainingFeeAware}
              />
              <RadioInput
                label="No"
                name="trainingFeeAware"
                value="No"
                id="fee-no"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.trainingFeeAware}
              />
              {touched.trainingFeeAware && !formData.trainingFeeAware && (
                <p className="text-red-500 text-sm mt-1">Please select an option</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block font-semibold">
                Can you arrange transport to Braamfontein (twice)?
              </label>
              <RadioInput
                label="Yes"
                name="transportAware"
                value="Yes"
                id="transport-yes"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.transportAware}
              />
              <RadioInput
                label="No"
                name="transportAware"
                value="No"
                id="transport-no"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.transportAware}
              />
              {touched.transportAware && !formData.transportAware && (
                <p className="text-red-500 text-sm mt-1">Please select an option</p>
              )}
            </div>
            
            <div className="flex">
              <button type="button" onClick={prevStep} className={buttonClass}>
                Previous
              </button>
              <button 
                type="submit" 
                className={submitButtonClass}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Step indicator */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <span>Step {step} of 5</span>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-blue-500 hover:text-blue-700"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

// Add this CSS to your global styles or component
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

// Inject styles if needed
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default MultiStepApplicationForm;
