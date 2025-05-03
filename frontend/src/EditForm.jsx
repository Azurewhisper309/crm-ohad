import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthenticatedAxios from "./useAuthenticatedAxios";
import { CRMContext } from "./CrmContext";

const EditForm = () => {
  const { id } = useParams();
  const { role, setForms } = useContext(CRMContext);
  const axios = useAuthenticatedAxios();
  const navigate = useNavigate();

  const [editedForm, setEditedForm] = useState({
    name: "",
    uniqueNumber: "",
    typeOf: "",
    takeNumber: "",
    status: "",
  });

  // ✅ Allowed editable fields by role
  const allowedFields = {
    admin: ["takeNumber", "status"],
    user: ["uniqueNumber", "typeOf", "name"],
  };

  // ✅ Fetch form data on load
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`/forms/${id}`);
        setEditedForm(res.data);
      } catch (err) {
        console.error("Error loading form:", err);
      }
    };
    fetchForm();
  }, [axios, id]);

  // ✅ Update only allowed fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (!allowedFields[role]?.includes(name)) return;
    setEditedForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit update based on role
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === "admin" ? `/forms/${id}/admin` : `/forms/${id}/user`;
      const res = await axios.put(endpoint, editedForm);
      setForms((prev) => prev.map((f) => (f.id === res.data.id ? res.data : f)));
      navigate(role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      console.error("Failed to update form:", err);
    }
  };

  return (
    <div>
      <h2>Edit Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={editedForm.name}
          onChange={handleChange}
          placeholder="Name"
          disabled={role === "admin"}
        />
        <input
          name="uniqueNumber"
          value={editedForm.uniqueNumber}
          onChange={handleChange}
          placeholder="Unique Number"
          disabled={role === "admin"}
        />
        <input
          name="typeOf"
          value={editedForm.typeOf}
          onChange={handleChange}
          placeholder="Type Of"
          disabled={role === "admin"}
        />
        <input
          name="takeNumber"
          value={editedForm.takeNumber}
          onChange={handleChange}
          placeholder="Take Number"
          disabled={role === "user"}
        />
        <input
          name="status"
          value={editedForm.status}
          onChange={handleChange}
          placeholder="Status"
          disabled={role === "user"}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditForm;
