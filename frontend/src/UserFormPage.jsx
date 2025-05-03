import { useContext, useEffect, useState } from "react";
import { CRMContext } from "./CrmContext";
import { Link, useNavigate } from "react-router-dom";
import useAuthenticatedAxios from "./useAuthenticatedAxios";

const UserFormPage = () => {
  const { user, role, forms, setForms } = useContext(CRMContext);
  const axios = useAuthenticatedAxios();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    uniqueNumber: "",
    typeOf: "option1",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // ✅ Fetch user-specific forms
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get("/forms/user");
        setForms(res.data);
      } catch (err) {
        console.error("Failed to fetch user forms", err);
      }
    };
    fetchForms();
  }, [axios, setForms]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.uniqueNumber || !form.typeOf) {
      alert("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("uniqueNumber", form.uniqueNumber);
      formData.append("typeOf", form.typeOf);
      if (selectedFile) formData.append("file", selectedFile);

      const res = await axios.post("/forms", formData);
      setForms((prev) => [...prev, res.data]);
      setForm({ name: "", uniqueNumber: "", typeOf: "option1" });
      setSelectedFile(null);
    } catch (err) {
      console.error("Form submission failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/forms/${id}`);
      setForms((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Failed to delete form", err);
    }
  };

  return (
    <div>
      <h2>Welcome {user} 👋</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
        />
        <input
          name="uniqueNumber"
          placeholder="Unique Number"
          value={form.uniqueNumber}
          onChange={handleInputChange}
        />
        <select name="typeOf" value={form.typeOf} onChange={handleInputChange}>
          <option value="option1">חומרה</option>
          <option value="option2">החרגה</option>
          <option value="option3">Office</option>
          <option value="option4">רשת</option>
          <option value="option5">אימג</option>
        </select>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>

      <h3>Your Forms</h3>
      <ul>
        {forms.map((f) => (
          <li key={f.id}>
            {f.name} | {f.uniqueNumber} | {f.typeOf} | {f.status}
            <button onClick={() => navigate(`/edit/${f.id}`)}>Edit</button>
            <button onClick={() => handleDelete(f.id)}>Not Relevant</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFormPage;
