// MultiStepApplicationForm.jsx
import { useState, useEffect, useCallback } from "react";
import DatePicker from "./inputs/DatePicker";
import SelectInput from "./inputs/SelectInput";
import TextInput from "./inputs/TextInput";
import RadioInput from "./inputs/RadioInput";
import TextAreaInput from "./inputs/TextAreaInput";
import TimeSlotBooking from "./TimeSlotBooking";

import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const getDefaultFormData = () => ({
  firstnames: "",
  surname: "",
  gender: "Male",
  birthdate: "",
  said: "",
  southAfricanCitizen: "Yes",
  race: "",
  email: "",
  contactnumber: "",
  secondarycontact: "",
  facebookurl: "",
  address: "",
  suburb: "",
  city: "",
  postcode: "",
  highestGrade: "",
  tertiaryInstitution: "",
  fieldOfStudy: "",
  yearCompleted: "",
  skillsInterest: "",
  driversLicense: "",
  otherSkills: "",
  availability: "",
  howHeard: "",
  otherHowHeard: "",
  trainingFeeAware: "",
  transportAware: "",
  interviewDate: "",
  interviewTime: "",
});

const stepValidations = {
  1: (data) => ({
    isValid: data.firstnames && data.surname && data.birthdate && data.said,
    message: "Please fill in all required fields in Personal Information",
  }),
  2: (data) => ({
    isValid: data.email && data.contactnumber && data.address && data.suburb && data.city && data.postcode,
    message: "Please fill in all required fields in Contact Details",
  }),
  3: (data) => ({
    isValid: data.highestGrade,
    message: "Please fill in all required fields in Education",
  }),
  4: (data) => ({ isValid: true, message: "" }),
  5: (data) => ({
    isValid: data.availability && data.howHeard && data.trainingFeeAware && data.transportAware,
    message: "Please fill in all required fields in Availability",
  }),
  6: (data) => ({
    isValid: data.interviewDate && data.interviewTime,
    message: "Please select both a date and time slot for your interview",
  }),
};

const MultiStepApplicationForm = () => {
  const [step, setStep] = useState(() => {
    try {
      const saved = localStorage.getItem('stocktaker-form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.step && parsed.step >= 1 && parsed.step <= 6 ? parsed.step : 1;
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
  const [bookedSlots, setBookedSlots] = useState({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  // Pre-fill from Clerk
  useEffect(() => {
    if (user && !formData.email) {
      setFormData(prev => ({
        ...prev,
        firstnames: user.firstName || '',
        surname: user.lastName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
      }));
    }
  }, [user]);

  // Fetch booked slots with cancellation
  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchBookedSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const response = await axios.get('/api/booked-slots', { cancelToken: source.token });
        setBookedSlots(response.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Failed to fetch booked slots:', error);
          setBookedSlots({});
        }
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchBookedSlots();
    return () => source.cancel();
  }, []);

  // Debounced save to localStorage with cleanup
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      try {
        const dataToSave = { step, formData, lastSaved: new Date().toISOString() };
        localStorage.setItem('stocktaker-form', JSON.stringify(dataToSave));
        setSaveStatus('All changes saved');
        const statusTimer = setTimeout(() => setSaveStatus(''), 3000);
        return () => clearTimeout(statusTimer);
      } catch (e) {
        console.error('Failed to save to localStorage', e);
        setSaveStatus('Failed to save changes');
        const statusTimer = setTimeout(() => setSaveStatus(''), 3000);
        return () => clearTimeout(statusTimer);
      }
    }, 1000);
    return () => clearTimeout(saveTimer);
  }, [step, formData]);

  const validateField = useCallback((name, value) => {
    const fieldErrors = {
      email: (val) => (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Invalid email format' : null),
      contactnumber: (val) => (val && !/^0[6-8][0-9]{8}$/.test(val) ? 'Invalid SA cellphone number' : null),
      said: (val) => (val && !/^\d{13}$/.test(val) ? 'ID number must be 13 digits' : null),
      postcode: (val) => (val && !/^\d{4}$/.test(val) ? 'Postcode must be 4 digits' : null),
      yearCompleted: (val) => (val && !/^\d{4}$/.test(val) ? 'Enter a valid 4-digit year' : null),
    };
    if (fieldErrors[name]) {
      const error = fieldErrors[name](value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Clear otherHowHeard when howHeard changes away from "Other"
      if (name === 'howHeard' && value !== 'Other') {
        return { ...prev, [name]: value, otherHowHeard: '' };
      }
      return { ...prev, [name]: value };
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  const handleBookingChange = useCallback((date, time) => {
    setFormData(prev => ({ ...prev, interviewDate: date, interviewTime: time }));
    if (errors.interviewDate) setErrors(prev => ({ ...prev, interviewDate: null }));
    if (errors.interviewTime) setErrors(prev => ({ ...prev, interviewTime: null }));
  }, [errors]);

  const getStepFields = (stepNumber) => ({
    1: ['firstnames', 'surname', 'birthdate', 'said'],
    2: ['email', 'contactnumber', 'address', 'suburb', 'city', 'postcode'],
    3: ['highestGrade'],
    4: [],
    5: ['availability', 'howHeard', 'trainingFeeAware', 'transportAware'],
    6: ['interviewDate', 'interviewTime'],
  }[stepNumber] || []);

  const validateStep = (stepNumber) => {
    const fields = getStepFields(stepNumber);
    const hasEmptyRequired = fields.some(field => !formData[field]);
    const hasErrors = fields.some(field => errors[field]);

    if (hasEmptyRequired || hasErrors) {
      alert(hasEmptyRequired ? 'Please fill in all required fields' : 'Please fix the errors before proceeding');
      const touchedFields = {};
      fields.forEach(field => { touchedFields[field] = true; });
      setTouched(prev => ({ ...prev, ...touchedFields }));
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step < 6 && validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
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
    if (!validateStep(6)) return;
    setIsSubmitting(true);
    try {
      const submissionData = { ...formData, userId: user?.id, submittedAt: new Date().toISOString() };
      const response = await axios.post('/api/apply', submissionData);
      if (formData.interviewDate && formData.interviewTime) {
        await axios.post('/api/book-slot', {
          date: formData.interviewDate,
          time: formData.interviewTime,
          userId: user?.id,
          applicationId: response.data.applicationId,
        });
      }
      localStorage.removeItem('stocktaker-form');
      alert("Application submitted successfully! We'll be in touch within 5-7 business days to confirm your interview slot.");
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission failed:', error);
      alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonClass = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const submitButtonClass = "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed";

  const progressPercentage = ((step - 1) / 5) * 100;

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
        <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">
          Clear Form
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
      </div>

      {/* Intro text */}
      <div className="mb-6 p-4 bg-gray-100 rounded border-l-4 border-blue-500">
        <h1 className="text-xl font-bold mb-2">Dial a Stocktaker Application Form</h1>
        <p className="text-sm mb-2 font-semibold">PLEASE READ THIS!</p>
        <p className="text-sm mb-2">Your application is just the first step. Make sure you are prepared for the next stages!</p>
        <p className="text-xs text-gray-600 mt-2">Dial a Stocktaker is a division of Dial a Student, established in 1988...</p>
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
                onBlur={handleBlur}
                selectedValue={formData.gender}
              />
              <RadioInput
                label="Female"
                name="gender"
                value="Female"
                id="gender-female"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.gender}
              />
              <RadioInput
                label="Prefer not to say"
                name="gender"
                value="Prefer not to say"
                id="gender-unspecified"
                onChange={handleChange}
                onBlur={handleBlur}
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
              error={touched.said && (!formData.said ? 'ID number is required' : errors.said)}
            />
            <div className="mb-4">
              <label className="block font-semibold">Are you a South African citizen?</label>
              <RadioInput
                label="Yes"
                name="southAfricanCitizen"
                value="Yes"
                id="citizen-yes"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.southAfricanCitizen}
              />
              <RadioInput
                label="No"
                name="southAfricanCitizen"
                value="No"
                id="citizen-no"
                onChange={handleChange}
                onBlur={handleBlur}
                selectedValue={formData.southAfricanCitizen}
              />
            </div>
            <button type="button" onClick={nextStep} className={buttonClass}>Next</button>
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
              error={touched.email && (!formData.email ? 'Email is required' : errors.email)}
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
              error={touched.contactnumber && (!formData.contactnumber ? 'Cellphone number is required' : errors.contactnumber)}
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
              label="Street Address"
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
              onBlur={handleBlur}
              required
              error={touched.suburb && !formData.suburb ? 'Suburb is required' : null}
            />
            <TextInput
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              error={touched.city && !formData.city ? 'City is required' : null}
            />
            <TextInput
              label="Postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={4}
              filterRegex={/[^0-9]/g}
              required
              error={touched.postcode && (!formData.postcode ? 'Postcode is required' : errors.postcode)}
            />
            <div className="flex">
              <button type="button" onClick={prevStep} className={buttonClass}>Previous</button>
              <button type="button" onClick={nextStep} className={buttonClass}>Next</button>
            </div>
          </div>
        )}

        {/* Step 3: Education & Qualifications */}
        {step === 3 && (
          <div className="step animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">Education & Qualifications</h2>
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
              onBlur={handleBlur}
              maxLength={4}
              filterRegex={/[^0-9]/g}
              placeholder="YYYY"
              error={touched.yearCompleted && errors.yearCompleted}
            />
            <div className="flex">
              <button type="button" onClick={prevStep} className={buttonClass}>Previous</button>
              <button type="button" onClick={nextStep} className={buttonClass}>Next</button>
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
              <button type="button" onClick={prevStep} className={buttonClass}>Previous</button>
              <button type="button" onClick={nextStep} className={buttonClass}>Next</button>
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
                { value: "All Days", label: "All Days" },
                { value: "Weekends only", label: "Weekends only" },
                { value: "Sundays Only", label: "Sundays Only" },
                { value: "Mondays Only", label: "Mondays Only" },
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
              <label className="block font-semibold">Can you arrange transport to Braamfontein (twice)?</label>
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
              <button type="button" onClick={prevStep} className={buttonClass}>Previous</button>
              <button type="button" onClick={nextStep} className={buttonClass}>Next</button>
            </div>
          </div>
        )}

        {/* Step 6: Interview Booking */}
        {step === 6 && (
          <div className="step animate-fadeIn">
            <h2 className="text-lg font-bold mb-4">Schedule Your Interview</h2>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Please select a date and time for your interview.
                Interviews are available Monday to Friday from 8:00 AM to 12:00 PM in 30-minute slots.
              </p>
            </div>
            {isLoadingSlots ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading available slots...</p>
              </div>
            ) : (
              <TimeSlotBooking
                selectedDate={formData.interviewDate}
                selectedTime={formData.interviewTime}
                onDateChange={(date) => handleBookingChange(date, formData.interviewTime)}
                onTimeChange={(time) => handleBookingChange(formData.interviewDate, time)}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, interviewDate: true, interviewTime: true }));
                }}
                error={
                  (touched.interviewDate && !formData.interviewDate) ? 'Please select a date' :
                  (touched.interviewTime && !formData.interviewTime) ? 'Please select a time' : null
                }
                required={true}
                bookedSlots={bookedSlots}
              />
            )}
            {formData.interviewDate && formData.interviewTime && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Selected Interview Slot:</h3>
                <p className="text-green-700">
                  <strong>Date:</strong> {new Date(formData.interviewDate).toLocaleDateString('en-ZA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-green-700">
                  <strong>Time:</strong> {formData.interviewTime.replace(':', ':')} (30-minute slot)
                </p>
              </div>
            )}
            <div className="flex mt-6">
              <button type="button" onClick={prevStep} className={buttonClass}>Previous</button>
              <button type="submit" className={submitButtonClass} disabled={isSubmitting || isLoadingSlots}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Step indicator */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <span>Step {step} of 6</span>
        <button type="button" onClick={() => setStep(1)} className="text-blue-500 hover:text-blue-700">
          Start Over
        </button>
      </div>
    </div>
  );
};

// Single CSS injection with deduplication
if (typeof document !== 'undefined' && !document.querySelector('#form-styles')) {
  const style = document.createElement('style');
  style.id = 'form-styles';
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1s linear infinite; }
  `;
  document.head.appendChild(style);
}

export default MultiStepApplicationForm;
