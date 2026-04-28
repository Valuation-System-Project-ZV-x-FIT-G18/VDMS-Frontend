import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WorkflowLayout from "../../components/WorkflowLayout";
import { notificationService } from "../../../../services/notificationService";
import { getPortalClientId } from "../../../../config/portalConfig";

interface ValuationDetails {
  priority: "High" | "Medium" | "Low";
  completionDate: string;
  valuationType: "initial" | "revaluation";
  files: {
    deed1?: File;
    deed2?: File;
    deed3?: File;
    deed4?: File;
    additional?: File;
  };
}

const NewValuation: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    { number: 1, label: "Search", path: "/coordinator/workflow/search" },
    { number: 2, label: "Register", path: "/coordinator/workflow/register" },
    {
      number: 3,
      label: "Create Project",
      path: "/coordinator/workflow/create-project",
    },
    {
      number: 4,
      label: "New Valuation",
      path: "/coordinator/workflow/new-valuation",
    },
    { number: 5, label: "Assign TO", path: "/coordinator/workflow/assign-to" },
  ];

  // State for form fields
  const [priority, setPriority] = useState<"High" | "Medium" | "Low" | "">("");
  const [completionDate, setCompletionDate] = useState("");
  const [valuationType, setValuationType] = useState<"initial" | "revaluation">(
    "initial",
  );

  // File states with refs for better control
  const [deed1, setDeed1] = useState<File | null>(null);
  const [deed2, setDeed2] = useState<File | null>(null);
  const [deed3, setDeed3] = useState<File | null>(null);
  const [deed4, setDeed4] = useState<File | null>(null);
  const [additionalDoc, setAdditionalDoc] = useState<File | null>(null);

  // File names for display
  const [deed1Name, setDeed1Name] = useState("");
  const [deed2Name, setDeed2Name] = useState("");
  const [deed3Name, setDeed3Name] = useState("");
  const [deed4Name, setDeed4Name] = useState("");
  const [additionalDocName, setAdditionalDocName] = useState("");

  // Error states
  const [priorityError, setPriorityError] = useState("");
  const [dateError, setDateError] = useState("");
  const [deed1Error, setDeed1Error] = useState("");
  const [deed2Error, setDeed2Error] = useState("");
  const [additionalDocError, setAdditionalDocError] = useState("");

  // File input refs for reset functionality
  const deed1Ref = useRef<HTMLInputElement>(null);
  const deed2Ref = useRef<HTMLInputElement>(null);
  const deed3Ref = useRef<HTMLInputElement>(null);
  const deed4Ref = useRef<HTMLInputElement>(null);
  const additionalDocRef = useRef<HTMLInputElement>(null);

  const projectId = "647556";
  const valuationId = "1";

  // Validation functions
  const validateDate = (value: string): string => {
    if (!value) return "Date is required";
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "Date must be today or later";
    return "";
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriority(e.target.value as "High" | "Medium" | "Low");
    setPriorityError("");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompletionDate(e.target.value);
    const error = validateDate(e.target.value);
    setDateError(error);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    setNameSetter: React.Dispatch<React.SetStateAction<string>>,
    errorSetter: React.Dispatch<React.SetStateAction<string>>,
    required: boolean = true,
  ) => {
    const file = e.target.files?.[0] || null;
    setter(file);

    if (file) {
      setNameSetter(file.name);
      errorSetter("");
    } else {
      setNameSetter("");
      if (required) {
        errorSetter("File is required");
      }
    }
  };

  const handleRemoveFile = (
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    setNameSetter: React.Dispatch<React.SetStateAction<string>>,
    errorSetter: React.Dispatch<React.SetStateAction<string>>,
    ref: React.RefObject<HTMLInputElement | null>,
    required: boolean = true,
  ) => {
    setter(null);
    setNameSetter("");
    if (required) {
      errorSetter("File is required");
    }
    if (ref.current) {
      ref.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate priority
    if (!priority) {
      setPriorityError("Please select a priority level");
      isValid = false;
    }

    // Validate date
    const dateValidation = validateDate(completionDate);
    if (dateValidation) {
      setDateError(dateValidation);
      isValid = false;
    }

    // Validate required files
    if (!deed1) {
      setDeed1Error("Deed of Sale 1 is required");
      isValid = false;
    }

    if (!deed2) {
      setDeed2Error("Deed of Sale 2 is required");
      isValid = false;
    }

    if (!additionalDoc) {
      setAdditionalDocError("Additional document is required");
      isValid = false;
    }

    return isValid;
  };

  const handleBack = () => {
    navigate("/coordinator/workflow/create-project");
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const valuationData: ValuationDetails = {
        priority: priority as "High" | "Medium" | "Low",
        completionDate,
        valuationType,
        files: {
          deed1: deed1 || undefined,
          deed2: deed2 || undefined,
          deed3: deed3 || undefined,
          deed4: deed4 || undefined,
          additional: additionalDoc || undefined,
        },
      };

      console.log("Valuation details:", valuationData);
      void notificationService.create({
        type: "success",
        event: "PROJECT_CREATED",
        title: `Valuation Job Created - ${projectId}`,
        message: `Coordinator created valuation job ${projectId}. Priority: ${priority}. Estimated completion: ${completionDate}.`,
        recipientId: getPortalClientId("bank"),
        recipientRole: "client",
        projectId: null,
      });
      navigate("/coordinator/workflow/assign-to");
    } else {
      alert("Please fill in all required fields and upload required documents");

      const firstError = document.querySelector(
        ".has-error, .error-msg, .input-error",
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleRequestMissing = () => {
    alert("Request for missing documents sent to client");
  };

  return (
    <WorkflowLayout steps={steps} activeStep={4}>
      <div className="content">
        <h1 className="title">New Valuation</h1>

        <div className="grid">
          {/* left: validation fields */}
          <section className="panel">
            <div className="id-card">
              <div className="id-card__icon">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M8 3h6l3 3v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                  />
                  <path
                    d="M9 12h6M9 16h6"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                  />
                </svg>
              </div>
              <div>
                <div className="id-line">
                  <strong>Project ID</strong>
                  <span>:</span>
                  <span className="value">{projectId}</span>
                </div>
                <div className="id-line">
                  <strong>Valuation ID</strong>
                  <span>:</span>
                  <span className="value">{valuationId}</span>
                </div>
              </div>
            </div>

            <div className="field-title">Priority Level *</div>
            <div className="radios" id="priorityGroup">
              <label className="radio">
                <input
                  type="radio"
                  name="priority"
                  value="High"
                  checked={priority === "High"}
                  onChange={handlePriorityChange}
                />
                <span className="radio-label">High</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="priority"
                  value="Medium"
                  checked={priority === "Medium"}
                  onChange={handlePriorityChange}
                />
                <span className="radio-label">Medium</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={priority === "Low"}
                  onChange={handlePriorityChange}
                />
                <span className="radio-label">Low</span>
              </label>
            </div>
            {priorityError && (
              <div className="error-msg priority-error">{priorityError}</div>
            )}

            <div className="field-title">Expected Completion Date *</div>
            <div className="date-wrapper">
              <input
                type="date"
                id="completionDate"
                className={`date ${dateError ? "input-error" : ""}`}
                value={completionDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {dateError && (
              <div className="error-msg date-error">{dateError}</div>
            )}

            <div className="field-title">Valuation type</div>
            <div className="seg">
              <button
                className={valuationType === "initial" ? "active" : ""}
                type="button"
                onClick={() => setValuationType("initial")}
              >
                Initial Valuation
              </button>
              <button
                className={valuationType === "revaluation" ? "active" : ""}
                type="button"
                onClick={() => setValuationType("revaluation")}
              >
                Revaluation
              </button>
            </div>
          </section>

          {/* right: uploads + continue */}
          <section>
            <div className="uploads" id="uploadsContainer">
              {/* Deed of Sale 1 - Required */}
              <div className="upload-group" data-required="true">
                <div className="upload-title">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                    <path
                      d="M14 2v6h6"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                  Deed of Sale 1 *
                </div>
                <div
                  className={`drop ${deed1Error ? "has-error" : ""} ${deed1 ? "has-file" : ""}`}
                  id="drop1"
                >
                  {deed1 ? (
                    <div className="file-info">
                      <span className="file-name">{deed1Name}</span>
                      <button
                        className="file-remove"
                        onClick={() =>
                          handleRemoveFile(
                            setDeed1,
                            setDeed1Name,
                            setDeed1Error,
                            deed1Ref,
                            true,
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="drop-inner">
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <path
                          d="M12 16V6m0 0l-3 3m3-3l3 3"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                        <path
                          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>Drag & drop or click to browse</span>
                      <span className="file-types">
                        PDF, JPG, PNG (Max 10MB)
                      </span>
                    </div>
                  )}
                  <input
                    ref={deed1Ref}
                    type="file"
                    className="file-input"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setDeed1,
                        setDeed1Name,
                        setDeed1Error,
                        true,
                      )
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                {deed1Error && <div className="error-msg">{deed1Error}</div>}
              </div>

              {/* Deed of Sale 2 - Required */}
              <div className="upload-group" data-required="true">
                <div className="upload-title">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                    <path
                      d="M14 2v6h6"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                  Deed of Sale 2 *
                </div>
                <div
                  className={`drop ${deed2Error ? "has-error" : ""} ${deed2 ? "has-file" : ""}`}
                  id="drop2"
                >
                  {deed2 ? (
                    <div className="file-info">
                      <span className="file-name">{deed2Name}</span>
                      <button
                        className="file-remove"
                        onClick={() =>
                          handleRemoveFile(
                            setDeed2,
                            setDeed2Name,
                            setDeed2Error,
                            deed2Ref,
                            true,
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="drop-inner">
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <path
                          d="M12 16V6m0 0l-3 3m3-3l3 3"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                        <path
                          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>Drag & drop or click to browse</span>
                      <span className="file-types">
                        PDF, JPG, PNG (Max 10MB)
                      </span>
                    </div>
                  )}
                  <input
                    ref={deed2Ref}
                    type="file"
                    className="file-input"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setDeed2,
                        setDeed2Name,
                        setDeed2Error,
                        true,
                      )
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                {deed2Error && <div className="error-msg">{deed2Error}</div>}
              </div>

              {/* Deed of Sale 3 - Optional */}
              <div className="upload-group" data-required="false">
                <div className="upload-title">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                    <path
                      d="M14 2v6h6"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                  Deed of Sale 3
                </div>
                <div className={`drop ${deed3 ? "has-file" : ""}`} id="drop3">
                  {deed3 ? (
                    <div className="file-info">
                      <span className="file-name">{deed3Name}</span>
                      <button
                        className="file-remove"
                        onClick={() =>
                          handleRemoveFile(
                            setDeed3,
                            setDeed3Name,
                            () => {},
                            deed3Ref,
                            false,
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="drop-inner">
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <path
                          d="M12 16V6m0 0l-3 3m3-3l3 3"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                        <path
                          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>Drag & drop or click to browse</span>
                      <span className="file-types">
                        PDF, JPG, PNG (Max 10MB)
                      </span>
                    </div>
                  )}
                  <input
                    ref={deed3Ref}
                    type="file"
                    className="file-input"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setDeed3,
                        setDeed3Name,
                        () => {},
                        false,
                      )
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              {/* Deed of Sale 4 - Optional */}
              <div className="upload-group" data-required="false">
                <div className="upload-title">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                    <path
                      d="M14 2v6h6"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                  Deed of Sale 4
                </div>
                <div className={`drop ${deed4 ? "has-file" : ""}`} id="drop4">
                  {deed4 ? (
                    <div className="file-info">
                      <span className="file-name">{deed4Name}</span>
                      <button
                        className="file-remove"
                        onClick={() =>
                          handleRemoveFile(
                            setDeed4,
                            setDeed4Name,
                            () => {},
                            deed4Ref,
                            false,
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="drop-inner">
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <path
                          d="M12 16V6m0 0l-3 3m3-3l3 3"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                        <path
                          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>Drag & drop or click to browse</span>
                      <span className="file-types">
                        PDF, JPG, PNG (Max 10MB)
                      </span>
                    </div>
                  )}
                  <input
                    ref={deed4Ref}
                    type="file"
                    className="file-input"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setDeed4,
                        setDeed4Name,
                        () => {},
                        false,
                      )
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              {/* Additional document - Required */}
              <div
                className="upload-group"
                style={{ gridColumn: "1/-1" }}
                data-required="true"
              >
                <div className="upload-title">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                    <path
                      d="M14 2v6h6"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                  Additional document *
                </div>
                <div
                  className={`drop big ${additionalDocError ? "has-error" : ""} ${additionalDoc ? "has-file" : ""}`}
                  id="drop5"
                >
                  {additionalDoc ? (
                    <div className="file-info">
                      <span className="file-name">{additionalDocName}</span>
                      <button
                        className="file-remove"
                        onClick={() =>
                          handleRemoveFile(
                            setAdditionalDoc,
                            setAdditionalDocName,
                            setAdditionalDocError,
                            additionalDocRef,
                            true,
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="drop-inner">
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <path
                          d="M12 16V6m0 0l-3 3m3-3l3 3"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                        <path
                          d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                          fill="none"
                          stroke="#9aa6b2"
                          strokeWidth="2"
                        />
                      </svg>
                      <div>Drag & drop or click to browse</div>
                      <div className="browse">or browse files</div>
                      <div className="types">
                        <span>PDF</span>
                        <span>JPG</span>
                        <span>PNG</span>
                        <span>MAX 50MB</span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={additionalDocRef}
                    type="file"
                    className="file-input"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setAdditionalDoc,
                        setAdditionalDocName,
                        setAdditionalDocError,
                        true,
                      )
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                {additionalDocError && (
                  <div className="error-msg">{additionalDocError}</div>
                )}
              </div>
            </div>

            <div className="footer-actions">
              <button className="btn btn--secondary" onClick={handleBack}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="currentColor"
                    fill="none"
                  />
                </svg>
                Back to Create Project
              </button>
              <div className="request" onClick={handleRequestMissing}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M4 4h16v16H4V4zm0 4l8 5 8-5"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="2"
                  />
                </svg>
                Request Missing
              </div>
              <button className="btn btn--primary" onClick={handleContinue}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="#fff"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
                Continue
              </button>
            </div>
          </section>
        </div>
      </div>
    </WorkflowLayout>
  );
};

export default NewValuation;
