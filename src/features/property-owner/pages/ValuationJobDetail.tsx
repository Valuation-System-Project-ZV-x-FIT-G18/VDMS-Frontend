import BankValuationJobDetail from "../../bank-credit-officer/pages/ValuationJobDetail";
import type { Project } from "../../bank-credit-officer/types";

interface ValuationJobDetailProps {
  projectId: string;
  initialProject?: Project | null;
  onBack: () => void;
}

/**
 * Reuses the shared valuation detail implementation to keep owner and bank flows behaviorally aligned.
 */
const ValuationJobDetail = ({ projectId, initialProject, onBack }: ValuationJobDetailProps) => (
  <BankValuationJobDetail
    projectId={projectId}
    initialProject={initialProject}
    onBack={onBack}
  />
);

export default ValuationJobDetail;
