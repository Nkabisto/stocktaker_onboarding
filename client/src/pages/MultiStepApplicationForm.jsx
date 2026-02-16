// MultiStepApplicationForm.jsx
import { useState } from "react";
import DatePicker from "./inputs/DatePicker";
import SelectInput from "./inputs/SelectInput";
import TextInput from "./inputs/TextInput";
import RadioInput from "./inputs/RadioInput";
import TextAreaInput from "./inputs/TextAreaInput";

const MultiStepApplicationForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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

    // Step 4: Skills & Interests (simplified as single-select)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Final validation can be added here
    console.log("Final submission:", formData);
    alert("Application submitted! We'll be in touch.");
  };

  // Common button styles
  const buttonClass = "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2";

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Intro text from the Google form */}
      <div className="mb-6 p-4 bg-gray-100 rounded border-l-4 border-blue-500">
        <h1 className="text-xl font-bold mb-2">Dial a Stocktaker Application Form</h1>
        <p className="text-sm mb-2 font-semibold">PLEASE READ THIS!</p>
        <p className="text-sm mb-2">
          Your application is just the first step. Make sure you are prepared for the next stages!
        </p>
        {/* Add more intro text as needed – truncated for brevity */}
        <p className="text-xs text-gray-600 mt-2">
          Dial a Stocktaker is a division of Dial a Student, established in 1988...
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="step">
            <h2 className="text-lg font-bold mb-4">Personal Information</h2>
            <TextInput
              label="First Name(s)"
              name="firstnames"
              value={formData.firstnames}
              onChange={handleChange}
              required
              maxLength={255}
              filterRegex={/[^a-zA-Z\s-]/g}
            />
            <TextInput
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              maxLength={255}
              filterRegex={/[^a-zA-Z\s-]/g}
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
              required
            />
            <TextInput
              label="SA ID Number"
              name="said"
              value={formData.said}
              onChange={handleChange}
              required
              maxLength={13}
              pattern="^([0-9]{2})([0-1][0-9])([0-3][0-9])([0-9]{4})([0-1])([0-9]{2})[0-9]$"
              filterRegex={/[^0-9]/g}
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
          <div className="step">
            <h2 className="text-lg font-bold mb-4">Contact Details & Address</h2>
            <TextInput
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
            />
            <TextInput
              label="Cellphone Number"
              name="contactnumber"
              value={formData.contactnumber}
              onChange={handleChange}
              type="tel"
              placeholder="e.g 0721234567"
              required
              maxLength={10}
              pattern="0[6-8][0-9]{8}"
              filterRegex={/[^0-9]/g}
            />
            <TextInput
              label="Alternative Contact"
              name="secondarycontact"
              value={formData.secondarycontact}
              onChange={handleChange}
              type="tel"
              placeholder="e.g 0721234567"
              maxLength={10}
              pattern="0[6-8][0-9]{8}"
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
              rows={2}
              placeholder="Street address"
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
              maxLength={4}
              filterRegex={/[^0-9]/g}
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
          <div className="step">
            <h2 className="text-lg font-bold mb-4">Education & Qualifications</h2>
            <div className="mb-4">
              <label className="block font-semibold">Have you passed Grade 11?</label>
              <RadioInput
                label="Yes"
                name="grade11Passed"
                value="Yes"
                id="grade11-yes"
                onChange={handleChange}
                selectedValue={formData.grade11Passed}
              />
              <RadioInput
                label="No"
                name="grade11Passed"
                value="No"
                id="grade11-no"
                onChange={handleChange}
                selectedValue={formData.grade11Passed}
              />
            </div>
            <SelectInput
              label="Highest Grade / Qualification"
              name="highestGrade"
              value={formData.highestGrade}
              onChange={handleChange}
              options={[
                { value: "Grade11", label: "Grade 11" },
                { value: "Grade12", label: "Grade 12 / Matric" },
                { value: "Certificate", label: "Certificate" },
                { value: "Diploma", label: "Diploma" },
                { value: "Degree", label: "Degree" },
                { value: "Postgraduate", label: "Postgraduate" },
              ]}
              placeholder="Select highest qualification"
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
          <div className="step">
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
          <div className="step">
            <h2 className="text-lg font-bold mb-4">Availability & Final Questions</h2>
            <SelectInput
              label="Availability for stocktakes"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              options={[
                { value: "Full Day", label: "Full Day" },
                { value: "Weekends only", label: "Weekends only" },
                { value: "After hours", label: "After hours" },
                { value: "Any", label: "Any" },
              ]}
              placeholder="Select availability"
            />
            <SelectInput
              label="How did you hear about us?"
              name="howHeard"
              value={formData.howHeard}
              onChange={handleChange}
              options={[
                { value: "Search Engine", label: "Search Engine" },
                { value: "Television", label: "Television" },
                { value: "Print Media", label: "Print Media" },
                { value: "Friend/Family", label: "Friend/Family" },
                { value: "Facebook", label: "Facebook" },
                { value: "Other", label: "Other" },
              ]}
              placeholder="Select one"
            />
            {formData.howHeard === "Other" && (
              <TextInput
                label="Please specify"
                name="otherHowHeard"
                value={formData.otherHowHeard}
                onChange={handleChange}
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
                selectedValue={formData.trainingFeeAware}
              />
              <RadioInput
                label="No"
                name="trainingFeeAware"
                value="No"
                id="fee-no"
                onChange={handleChange}
                selectedValue={formData.trainingFeeAware}
              />
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
                selectedValue={formData.transportAware}
              />
              <RadioInput
                label="No"
                name="transportAware"
                value="No"
                id="transport-no"
                onChange={handleChange}
                selectedValue={formData.transportAware}
              />
            </div>
            <div className="flex">
              <button type="button" onClick={prevStep} className={buttonClass}>
                Previous
              </button>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Submit Application
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Step indicator */}
      <div className="mt-6 text-sm text-gray-600">
        Step {step} of 5
      </div>
    </div>
  );
};

export default MultiStepApplicationForm;
