import React, { useContext, useEffect, useState } from "react";
import { CRMContext } from "./CrmContext";
import { useNavigate } from "react-router-dom";
import useAuthenticatedAxios from "./useAuthenticatedAxios";

const RecoveryPage = () => {
  const { role } = useContext(CRMContext);
  const axios = useAuthenticatedAxios();
  const [recoveryForms, setRecoveryForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecoveryForms = async () => {
      try {
        const res = await axios.get("/recoveryForms");
        setRecoveryForms(res.data);
      } catch (err) {
        console.error("Failed to load recovery forms:", err); // ✅ fixed typo here
      }
    };

    fetchRecoveryForms();
  }, [axios]);

  const handleRestore = async (id) => {
    try {
      await axios.put(`/recoveryForms/${id}`);
      setRecoveryForms((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Failed to restore form:", err);
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await axios.delete(`/recoveryForms/${id}`);
      setRecoveryForms((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Failed to delete form:", err);
    }
  };

  return (
    <div>
      <h2>🗂️ Recovery Page</h2>
      {recoveryForms.length === 0 ? (
        <p>No recovery forms available.</p>
      ) : (
        <ul>
          {recoveryForms.map((form) => (
            <li key={form.id}>
              {form.name} | {form.uniqueNumber} | {form.typeOf} | {form.status}
              <button onClick={() => handleRestore(form.id)}>Restore</button>
              <button onClick={() => handlePermanentDelete(form.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecoveryPage;
