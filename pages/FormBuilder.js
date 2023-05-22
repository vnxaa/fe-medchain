import { useState } from "react";

export default function FormBuilder() {
  const [formData, setFormData] = useState([]);
  const [fields, setFields] = useState([
    { type: "text", label: "New Field", name: "new_field" },
  ]);
  const [editedFieldIndex, setEditedFieldIndex] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const index = formData.findIndex((field) => field.name === name);
    if (index === -1) {
      setFormData([...formData, { name, value }]);
    } else {
      const newFormData = [...formData];
      newFormData[index].value = value;
      setFormData(newFormData);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...fields];
    const editedField = newFields[index];

    if (field === "name") {
      const index = formData.findIndex(
        (field) => field.name === editedField.name
      );
      if (index !== -1) {
        const newFormData = [...formData];
        newFormData[index].name = value;
        setFormData(newFormData);
      }
      editedField.label = value;
      editedField.name = value.toLowerCase().replace(" ", "_");
    } else if (field === "new_field") {
      const newFormData = [
        ...formData,
        { name: value.toLowerCase().replace(" ", "_"), value },
      ];
      setFormData(newFormData);
    }

    editedField[field] = value;
    setFields(newFields);
    setEditedFieldIndex(index);
  };

  const addField = () => {
    const newFields = [...fields];
    const lastIndex = newFields.length - 1;
    const newLabel = `New Field ${lastIndex + 1}`;
    const newName = `new_field_${lastIndex + 1}`;
    newFields.push({ type: "text", label: newLabel, name: newName });
    setFields(newFields);
  };

  const removeField = (index) => {
    const newFields = [...fields];
    const deletedField = newFields.splice(index, 1)[0];

    // Remove the corresponding field from formData
    setFormData(formData.filter((field) => field.name !== deletedField.name));

    setFields(newFields);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // fetch("/api/save-form-data", {
    //   method: "POST",
    //   body: data,
    //   headers: { "Content-Type": "application/json" },
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))
    //   .catch((error) => console.log(error));

    console.log(formData);
    setEditedFieldIndex(null);
  };
  return (
    <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <div key={index} className="mb-4">
          <label htmlFor={field.name} className="block mb-2 font-bold">
            {field.label}:
          </label>
          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              onChange={handleChange}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            >
              {field.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              onChange={handleChange}
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
          )}
          <div className="mt-2 flex justify-between">
            {/* <button
              type="button"
              onClick={() =>
                handleFieldChange(index, "label", prompt("Enter new label"))
              }
              className="px-2 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline"
            >
              Edit Label
            </button> */}

            <button
              type="button"
              onClick={() =>
                handleFieldChange(index, "name", prompt("Enter new name"))
              }
              className="px-2 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline"
            >
              Edit Name
            </button>
            <select
              onChange={(event) => {
                handleFieldChange(index, "type", event.target.value);
              }}
              value={field.type}
              className="px-2 py-1 rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline"
            >
              <option value="text">Text</option>
              <option value="file">Select File</option>
            </select>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to remove this field?")
                ) {
                  removeField(index);
                }
              }}
              className="px-2 py-1 rounded text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:shadow-outline"
            >
              Remove Field
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addField}
        className="mb-4 px-2 py-1 rounded text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:shadow-outline"
      >
        Add Field
      </button>

      <button
        type="submit"
        className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
}
