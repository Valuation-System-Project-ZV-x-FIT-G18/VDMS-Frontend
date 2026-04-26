import BankValuationJobDetail from '../../bank-credit-officer/pages/ValuationJobDetail';
import type { Project } from '../../../services/projectService';

interface ValuationJobDetailProps {
  projectId: string;
  initialProject?: Project | null;
  onBack: () => void;
}

const ValuationJobDetail = ({ projectId, initialProject, onBack }: ValuationJobDetailProps) => (
  <BankValuationJobDetail
    projectId={projectId}
    initialProject={initialProject}
    onBack={onBack}
  />
);

export default ValuationJobDetail;
