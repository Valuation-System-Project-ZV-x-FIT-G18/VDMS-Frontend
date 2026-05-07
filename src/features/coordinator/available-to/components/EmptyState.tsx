/* Empty state shown when there are no rows in the table */
const EmptyState = ({ message }: { message: string }) => (
  <div className="to-empty">
    <p>{message}</p>               {/* e.g. "No available officers found" */}
  </div>
);

export default EmptyState;
