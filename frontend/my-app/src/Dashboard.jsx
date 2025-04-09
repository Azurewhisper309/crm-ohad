// 📁 frontend/src/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import useAuthenticatedAxios from "./useAuthenticatedAxios";
import { CRMContext } from "./CrmContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const axios = useAuthenticatedAxios();
  const { role } = useContext(CRMContext);
  const [allForms, setAllForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const res = await axios.get("/forms");
        setAllForms(res.data);
      } catch (error) {
        console.error("Failed to fetch all forms:", error);
      }
    };

    fetchAllForms();
  }, [axios]);

  const handleMarkNotRelevant = async (form) => {
    try {
      await axios.put(`/forms/${form.id}/notRelevant/admin`);
      setAllForms((prev) => prev.filter((f) => f.id !== form.id));
    } catch (error) {
      console.error("Failed to mark as not relevant:", error);
    }
  };

  const handleMarkFixed = async (formId) => {
    try {
      const updated = await axios.put(`/forms/${formId}/admin`, {
        status: "Fixed",
        takeNumber: 1,
      });

      setAllForms((prev) =>
        prev.map((f) => (f.id === formId ? updated.data : f))
      );
    } catch (error) {
      console.error("Failed to update form status:", error);
    }
  };

  const handleEdit = (formId) => {
    navigate(`/edit/${formId}`);
  };

  return (
    <div>
      <h2>📊 Admin Dashboard</h2>
      {allForms.length === 0 ? (
        <p>No forms available.</p>
      ) : (
        <ul>
          {allForms.map((form) => (
            <li key={form.id}>
              <strong>{form.name}</strong> | {form.uniqueNumber} | {form.typeOf} | Status: {form.status} | Taken: {form.takeNumber}
              <br />
              {form.filePath && (
                <a href={`http://${import.meta.env.VITE_API_BASE}/${form.filePath}`} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              )}
              <br />
              <button onClick={() => handleEdit(form.id)}>Edit</button>
              <button onClick={() => handleMarkFixed(form.id)}>Mark Fixed</button>
              <button onClick={() => handleMarkNotRelevant(form)}>Mark Not Relevant</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
