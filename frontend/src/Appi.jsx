import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes.jsx";
import { CRMProvider } from "./CrmContext";


 const RootApp = () => {
  return (
  

    <BrowserRouter>
      <CRMProvider>
        <AppRoutes />
      </CRMProvider>
    </BrowserRouter>

);
};
export default RootApp