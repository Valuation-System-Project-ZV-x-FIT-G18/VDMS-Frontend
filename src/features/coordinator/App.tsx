import { BrowserRouter, Routes, Route } from 'react-router-dom'; // client-side routing
import HomePage from './pages/HomePage';       // landing page with 7 role buttons
import CoordinatorLayout from '../../layouts/CoordinatorLayout'; // sidebar + topbar wrapper
import DashboardPage from './dashboard/pages/DashboardPage'; // coordinator dashboard
import SearchPage from './search-client/pages/SearchPage'; // coordinator search page
import RegisterPage from './register-client/pages/RegisterPage'; // registration page
import RegisterBankPage from './register-bank/pages/RegisterBankPage'; // bank registration
import PropertyInfoPage from './property-information/pages/PropertyInfoPage'; // property info
import SurveyPlanPage from './survey-plan/pages/SurveyPlanPage'; // survey plan
import LegalDetailsPage from './legal-details/pages/LegalDetailsPage'; // legal details
import DocumentUploadPage from './document-upload/pages/DocumentUploadPage'; // doc upload
import NewValuationPage from './new-valuation/pages/NewValuationPage'; // new valuation
import AvailableToPage from './available-to/pages/AvailableToPage'; // available officers
import OnLeaveToPage from './on-leave-to/pages/OnLeaveToPage'; // on-leave officers
import AssignedToPage from './assigned-to/pages/AssignedToPage'; // assigned officers
import FleetDashboard from './fleet-management/pages/FleetDashboard'; // fleet management dashboard
import RejectedToPage from './rejected-to/pages/RejectedToPage'; // rejected officers
import ProjectSummaryPage from './project-summary/pages/ProjectSummaryPage'; // project summary
import RevaluationPage from './revaluation/pages/RevaluationPage'; // read-only full details for revaluation
import BankInfoPage from './revaluation/pages/BankInfoPage'; // read-only bank info for revaluation

/* Root component — defines all application routes */
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />                    {/* landing — no layout */}

      {/* All coordinator routes wrapped with sidebar + topbar layout */}
      <Route path="/coordinator" element={<CoordinatorLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />    {/* dashboard */}
        <Route path="search" element={<SearchPage />} />           {/* search */}
        <Route path="register" element={<RegisterPage />} />       {/* register applicant */}
        <Route path="register-bank" element={<RegisterBankPage />} /> {/* register bank */}
        <Route path="property-information" element={<PropertyInfoPage />} /> {/* property */}
        <Route path="survey-plan" element={<SurveyPlanPage />} />  {/* survey plan */}
        <Route path="legal-details" element={<LegalDetailsPage />} /> {/* legal */}
        <Route path="document-upload" element={<DocumentUploadPage />} /> {/* documents */}
        <Route path="new-valuation" element={<NewValuationPage />} /> {/* new valuation */}
        <Route path="available-to" element={<AvailableToPage />} /> {/* available TOs */}
        <Route path="on-leave-to" element={<OnLeaveToPage />} />   {/* on-leave TOs */}
        <Route path="assigned-to" element={<AssignedToPage />} />  {/* assigned TOs */}
        <Route path="fleet-management" element={<FleetDashboard />} /> {/* fleet management dashboard */}
        <Route path="all-to" element={<AvailableToPage />} />      {/* all TOs — use available for now */}
        <Route path="rejected-to" element={<RejectedToPage />} />  {/* rejected TOs */}
        <Route path="project-summary" element={<ProjectSummaryPage />} /> {/* project summary */}
        <Route path="revaluation" element={<RevaluationPage />} /> {/* revaluation full details */}
        <Route path="revaluation-bank" element={<BankInfoPage />} /> {/* revaluation bank info */}
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
