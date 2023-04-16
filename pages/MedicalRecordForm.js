import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function MedicalRecordForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [emergencyContactFirstName, setEmergencyContactFirstName] =
    useState("");
  const [emergencyContactLastName, setEmergencyContactLastName] = useState("");
  const [emergencyContactAddress, setEmergencyContactAddress] = useState("");
  const [emergencyContactAddress2, setEmergencyContactAddress2] = useState("");
  const [emergencyContactCity, setEmergencyContactCity] = useState("");
  const [emergencyContactState, setEmergencyContactState] = useState("");
  const [emergencyContactZip, setEmergencyContactZip] = useState("");
  const [emergencyContactCountry, setEmergencyContactCountry] = useState("");
  const [emergencyContactHomePhone, setEmergencyContactHomePhone] =
    useState("");
  const [emergencyContactWorkPhone, setEmergencyContactWorkPhone] =
    useState("");
  const [hepatitisBVaccination, setHepatitisBVaccination] = useState(false);
  const [chickenPoxImmunity, setChickenPoxImmunity] = useState("");
  const [measlesImmunity, setMeaslesImmunity] = useState("");
  const [significantMedicalHistory, setSignificantMedicalHistory] =
    useState("");
  const [medicalProblems, setMedicalProblems] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [hasMedicalInsurance, setHasMedicalInsurance] = useState(false);
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [insuranceAddress, setInsuranceAddress] = useState("");
  const [insuranceAddress2, setInsuranceAddress2] = useState("");
  const [insuranceCity, setInsuranceCity] = useState("");
  const [insuranceState, setInsuranceState] = useState("");
  const [insuranceZip, setInsuranceZip] = useState("");
  const [insuranceCountry, setInsuranceCountry] = useState("");
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
  const [insuranceExpiryDay, setInsuranceExpiryDay] = useState("");
  const [insuranceExpiryMonth, setInsuranceExpiryMonth] = useState("");
  const [insuranceExpiryYear, setInsuranceExpiryYear] = useState("");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to backend
    console.log("Form submitted!");
    // router.push("/success"); // Navigate to success page
    const form = e.target;
    const formData = {
      firstName: form.firstname.value,
      lastname: form.lastname.value,
      dateOfBirth: form.birthdate.value,
    };
    const formDataJson = JSON.stringify(formData);
    console.log(formDataJson);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Medical Information Form</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-5">
            Medical Information Form
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-y-6">
            <div className="sm:col-span-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Patient Information
              </h2>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="given-name"
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="phone-number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number*
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +84
                </span>
                <input
                  type="tel"
                  name="phone-number"
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="birthdate"
                className="block text-sm font-medium text-gray-700"
              >
                Birth date
              </label>
              <input
                type="date"
                name="birthdate"
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                autoComplete="bday"
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Address
              </h2>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="address-line-2"
                className="block text-sm font-medium text-gray-700"
              >
                Address Line 2
              </label>
              <input
                type="text"
                name="address-line-2"
                id="address-line-2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State / Province
              </label>
              <input
                type="text"
                name="state"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium text-gray-700"
              >
                Postal / Zip Code
              </label>
              <input
                type="text"
                name="postal-code"
                id="postal-code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Please Select</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Weight
              </label>
              <input
                type="text"
                name="weight"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            {/* This is a single line comment */}
            <div className="sm:col-span-2">
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700"
              >
                Height
              </label>
              <input
                type="text"
                name="height"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="hep-b"
                className="block text-sm font-medium text-gray-700"
              >
                Have you had the Hepatitis B vaccination?
              </label>
              <div className="mt-1">
                <div className="flex items-center">
                  <input
                    id="hep-b-yes"
                    name="hep-b"
                    type="radio"
                    value="yes"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor="hep-b-yes"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="hep-b-no"
                    name="hep-b"
                    type="radio"
                    value="no"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor="hep-b-no"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="chicken-pox"
                className="block text-sm font-medium text-gray-700"
              >
                Chicken Pox (Varicella)
              </label>
              <div className="mt-1">
                <div className="flex items-center">
                  <input
                    id="chicken-pox-immune"
                    name="chicken-pox"
                    type="radio"
                    value="immune"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor="chicken-pox-immune"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    IMMUNE
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="chicken-pox-not-immune"
                    name="chicken-pox"
                    type="radio"
                    value="not-immune"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor="chicken-pox-not-immune"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    NOT IMMUNE
                  </label>
                </div>
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="measles"
                className="block text-sm font-medium text-gray-700"
              >
                Measles
              </label>
              <div className="mt-1">
                <div className="flex items-center">
                  <input
                    id="measles-immune"
                    name="measles"
                    type="radio"
                    value="immune"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor="measles-immune"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    IMMUNE
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="measles-not-immune"
                    name="measles"
                    type="radio"
                    value="not-immune"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor="measles-not-immune"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    NOT IMMUNE
                  </label>
                </div>
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="significant-history"
                className="block text-sm font-medium text-gray-700"
              >
                Significant Medical History (surgery, injuries, serious illness)
              </label>
              <div className="mt-1">
                <textarea
                  id="significant-history"
                  name="significant-history"
                  rows="3"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter any significant medical history, such as surgeries, injuries, or serious illnesses."
                ></textarea>
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="medical-problems"
                className="block text-sm font-medium text-gray-700"
              >
                List any Medical Problems (asthma, seizures, headaches):
              </label>
              <div className="mt-1">
                <textarea
                  id="medical-problems"
                  name="medical-problems"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter any medical problems you have here"
                />
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="medication"
                className="block text-sm font-medium text-gray-700"
              >
                List any medication taken regularly:
              </label>
              <div className="mt-1">
                <textarea
                  id="medication"
                  name="medication"
                  rows={3}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter any medication taken regularly here"
                />
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="allergies"
                className="block text-sm font-medium text-gray-700"
              >
                List any allergies:
              </label>
              <div className="mt-1">
                <input
                  id="allergies"
                  name="allergies"
                  type="text"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter any allergies you have here"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
