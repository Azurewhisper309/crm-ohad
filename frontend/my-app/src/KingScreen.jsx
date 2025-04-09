import React, { useEffect, useState } from "react";
import useAuthenticatedAxios from "./useAuthenticatedAxios";

const KingScreen = () => {
  const axios = useAuthenticatedAxios();
  const [fixedForms, setFixedForms] = useState([]);

  useEffect(() => {
    const fetchKingForms = async () => {
      try {
        const res = await axios.get("/forms/king");
        setFixedForms(res.data);
      } catch (error) {
        console.error("Failed to fetch fixed forms for KingScreen:", error);
      }
    };

    fetchKingForms();
  }, [axios]);

  return (
    <div>
      <h2>👑 King Screen - Fixed Forms Overview</h2>
      {fixedForms.length === 0 ? (
        <p>No fixed forms available.</p>
      ) : (
        <ul>
          {fixedForms.map((form, index) => (
            <li key={index}>
              Status: {form.status} | Take Number: {form.takeNumber}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KingScreen;
