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
        name="date"
        className="nv-input"
        value={date}
        min={new Date().toISOString().split('T')[0]}       // disallow past dates
        onChange={e => onDateChange(e.target.value)}       // pass date up
        required
      />
      <input
        type="time"                                        // native time picker
        name="time"
        className="nv-input"
        value={time}
        min={date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0,5) : '08:00'}
        onChange={e => onTimeChange(e.target.value)}       // pass time up
        required
      />
    </div>
    {dateError && <span className="field-error">{dateError}</span>}
    {timeError && <span className="field-error">{timeError}</span>}
  </div>
);

export default SchedulePicker;
