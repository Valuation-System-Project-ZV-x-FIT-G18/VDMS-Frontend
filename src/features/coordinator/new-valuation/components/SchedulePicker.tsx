interface Props {
  date: string;                                            // selected date value (YYYY-MM-DD)
  time: string;                                            // selected time value (HH:MM)
  onDateChange: (val: string) => void;                    // callback when date changes
  onTimeChange: (val: string) => void;                    // callback when time changes
  dateError?: string;
  timeError?: string;
}

/* Date and time picker for scheduling the valuation visit */
const SchedulePicker = ({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: Props) => (
  <div className="nv-section">
    <h3 className="nv-section-title">Schedule date & time</h3>
    <div className="nv-schedule-row">
      <input
        type="date"                                        // native date picker
        className="nv-input"
        value={date}
        onChange={e => onDateChange(e.target.value)}       // pass date up
        required
      />
      <input
        type="time"                                        // native time picker
        className="nv-input"
        value={time}
        onChange={e => onTimeChange(e.target.value)}       // pass time up
        required
      />
    </div>
    {dateError && <span className="field-error">{dateError}</span>}
    {timeError && <span className="field-error">{timeError}</span>}
  </div>
);

export default SchedulePicker;
