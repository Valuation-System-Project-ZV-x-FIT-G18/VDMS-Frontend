import React, { createContext, useContext, useState, useEffect } from "react";
import { theme } from "../styles/theme";

// Translation dictionary
export const translations = {
  en: {
    settings: "Settings",
    settingsSub: "Configure system preferences, security, and administrative features",
    profileSecurity: "Profile & Security",
    systemPreferences: "System Preferences",
    notifications: "Notifications",
    maintenanceLogs: "Maintenance & Logs",
    adminProfile: "User Profile",
    editProfile: "Edit Profile",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    securitySettings: "Security Settings",
    accountPassword: "Account Password",
    passwordSub: "Ensure your account is using a strong password.",
    changePassword: "Change Password",
    twoFactor: "Two-Factor Authentication",
    twoFactorSub: "Add an extra layer of security using Google Authenticator.",
    themeColour: "Theme Color Selection",
    themeSub: "Customize the primary brand color of your workspace.",
    selectTheme: "Select Accent Color",
    languageSetting: "Language Preference / භාෂා මනාපය",
    languageSub: "Choose your preferred system display language.",
    themeMode: "Display Mode",
    themeModeSub: "Choose between light and dark display preferences.",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    systemName: "System Platform Name",
    supportEmail: "Support Email Address",
    pageSize: "Default Table Page Size",
    sessionTimeout: "User Inactivity Timeout",
    maintenanceMode: "Platform Maintenance Mode",
    maintenanceSub: "Enable to put the system into maintenance mode.",
    publicReg: "Allow Public Registration",
    publicRegSub: "Allow property owners to sign up directly from login.",
    cancel: "Cancel",
    save: "Save",
    saveChanges: "Save Changes",
    // Sidebar
    dashboard: "Dashboard",
    users: "Users & Roles",
    valuationTypes: "Valuation Types",
    templates: "Templates",
    logout: "Logout",
    allProjects: "All Projects",
    payment: "Payment",
    assignedProjects: "Assigned Projects",
    reports: "Reports",
    documents: "Documents",
    attendance: "Attendance",
    approvals: "Approvals",
    pendingReviews: "Pending Reviews",
    approvedReports: "Approved Reports",
    rejectedReports: "Rejected Reports",
    allReports: "All Reports",
    finalizedReports: "Finalized Reports",
    versionHistory: "Version History",
    bottlenecks: "Bottlenecks",
    morningReport: "Morning Report",
    createProject: "Create Project",
    fleetManagement: "Fleet Management",
    // Theme options
    blue: "Ocean Blue",
    green: "Forest Green",
    purple: "Royal Purple",
    orange: "Sunset Orange",
    red: "Crimson Red",
    statusActive: "Status: Active",
    memberSince: "Member Since: Oct 2023",
    goSettings: "Go to Settings",
  },
  si: {
    settings: "සැකසුම්",
    settingsSub: "පද්ධති මනාපයන්, ආරක්ෂාව සහ පරිපාලන අංග වින්‍යාස කරන්න",
    profileSecurity: "පැතිකඩ සහ ආරක්ෂාව",
    systemPreferences: "පද්ධති මනාපයන්",
    notifications: "දැනුම්දීම්",
    maintenanceLogs: "නඩත්තු සහ ලොගයන්",
    adminProfile: "පරිශීලක පැතිකඩ",
    editProfile: "පැතිකඩ සංස්කරණය",
    firstName: "මුල් නම",
    lastName: "වාසගම",
    emailAddress: "විද්‍යුත් තැපැල් ලිපිනය",
    phoneNumber: "දුරකථන අංකය",
    securitySettings: "ආරක්ෂක සැකසුම්",
    accountPassword: "ගිණුම් මුරපදය",
    passwordSub: "ඔබගේ ගිණුම සඳහා ශක්තිමත් මුරපදයක් භාවිතා කිරීමට වග බලා ගන්න.",
    changePassword: "මුරපදය වෙනස් කරන්න",
    twoFactor: "ද්වි-සාධක සත්‍යාපනය",
    twoFactorSub: "ගූගල් සත්‍යාපකය භාවිතා කර අමතර ආරක්ෂාවක් එක් කරන්න.",
    themeColour: "තේමා වර්ණ තේරීම",
    themeSub: "ඔබගේ සේවා ස්ථානයේ මූලික තේමා වර්ණය රිසිකරණය කරන්න.",
    selectTheme: "තේමා වර්ණය තෝරන්න",
    languageSetting: "භාෂා මනාපය / Language Preference",
    languageSub: "පද්ධතිය සඳහා ඔබ කැමති භාෂාව තෝරන්න.",
    themeMode: "දර්ශන මාදිලිය",
    themeModeSub: "ආලෝකය සහ අඳුරු දර්ශන මනාපයන් අතර තෝරන්න.",
    lightMode: "ආලෝක මාදිලිය",
    darkMode: "අඳුරු මාදිලිය",
    systemName: "පද්ධති වේදිකාවේ නම",
    supportEmail: "සහාය විද්‍යුත් තැපැල් ලිපිනය",
    pageSize: "පෙරනිමි වගු පිටු ප්‍රමාණය",
    sessionTimeout: "පරිශීලක අක්‍රිය කාල සීමාව",
    maintenanceMode: "පද්ධති නඩත්තු මාදිලිය",
    maintenanceSub: "පද්ධතිය නඩත්තු මාදිලියට සැකසීමට සබල කරන්න.",
    publicReg: "පොදු ලියාපදිංචියට ඉඩ දෙන්න",
    publicRegSub: "හිමිකරුවන්ට සෘජුවම ලියාපදිංචි වීමට ඉඩ දෙන්න.",
    cancel: "අවලංගු කරන්න",
    save: "සුරකින්න",
    saveChanges: "වෙනස්කම් සුරකින්න",
    // Sidebar
    dashboard: "උපකරණ පුවරුව",
    users: "පරිශීලකයින් සහ භූමිකාවන්",
    valuationTypes: "තක්සේරු වර්ග",
    templates: "සැකිලි",
    logout: "පිටවීම",
    allProjects: "සියලුම ව්‍යාපෘති",
    payment: "ගෙවීම්",
    assignedProjects: "පැවරුණු ව්‍යාපෘති",
    reports: "වාර්තා",
    documents: "ලේඛන",
    attendance: "පැමිණීම",
    approvals: "අනුමැතීන්",
    pendingReviews: "විනිශ්චය වෙමින් පවතින",
    approvedReports: "අනුමත වාර්තා",
    rejectedReports: "ප්‍රතික්ෂේපිත වාර්තා",
    allReports: "සියලුම වාර්තා",
    finalizedReports: "ස්ථිර කළ වාර්තා",
    versionHistory: "සංශෝධන ඉතිහාසය",
    bottlenecks: "බාධාවන්",
    morningReport: "උදෑසන වාර්තාව",
    createProject: "ව්‍යාපෘතියක් සාදන්න",
    fleetManagement: "රථ වාහන කළමනාකරණය",
    // Theme options
    blue: "නිල් පැහැය (Blue)",
    green: "කොළ පැහැය (Green)",
    purple: "දම් පැහැය (Purple)",
    orange: "තැඹිලි පැහැය (Orange)",
    red: "රතු පැහැය (Red)",
    statusActive: "තත්ත්වය: ක්‍රියාකාරී",
    memberSince: "සාමාජිකයෙක් වූයේ: 2023 ඔක්තෝබර්",
    goSettings: "සැකසුම් වෙත යන්න",
  },
};

interface SettingsContextType {
  themeColor: string;
  language: "en" | "si";
  themeMode: "light" | "dark";
  setThemeColor: (color: string) => void;
  setLanguage: (lang: "en" | "si") => void;
  setThemeMode: (mode: "light" | "dark") => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const applyThemeMode = (mode: "light" | "dark", themeColor: string) => {
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
    root.style.setProperty("--bg-default", "#0f172a");
    root.style.setProperty("--bg-paper", "#1e293b");
    root.style.setProperty("--bg-sidebar", "#0f172a");
    root.style.setProperty("--text-primary", "#f3f4f6");
    root.style.setProperty("--text-secondary", "#9ca3af");
    root.style.setProperty("--border-color", "#334155");
    document.body.style.backgroundColor = "#0f172a";
    document.body.style.color = "#f3f4f6";

    theme.colors.text.primary = "#f3f4f6";
    theme.colors.text.secondary = "#9ca3af";
    theme.colors.background.default = "#0f172a";
    theme.colors.background.paper = "#1e293b";
    theme.colors.background.sidebar = "#0f172a";
    theme.colors.border = "#334155";
  } else {
    root.classList.remove("dark");
    root.style.setProperty("--bg-default", "#f0f4ff");
    root.style.setProperty("--bg-paper", "#ffffff");
    root.style.setProperty("--bg-sidebar", themeColor + "10");
    root.style.setProperty("--text-primary", "#262626");
    root.style.setProperty("--text-secondary", "#8c8c8c");
    root.style.setProperty("--border-color", "#d9d9d9");
    document.body.style.backgroundColor = "#f0f4ff";
    document.body.style.color = "#262626";

    theme.colors.text.primary = "#262626";
    theme.colors.text.secondary = "#8c8c8c";
    theme.colors.background.default = "#f0f4ff";
    theme.colors.background.paper = "#ffffff";
    theme.colors.background.sidebar = themeColor + "10";
    theme.colors.border = "#d9d9d9";
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColorState] = useState(() => {
    return localStorage.getItem("vdms_theme_color") || "#1890ff";
  });

  const [language, setLanguageState] = useState<"en" | "si">(() => {
    return (localStorage.getItem("vdms_language") as "en" | "si") || "en";
  });

  const [themeMode, setThemeModeState] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("vdms_theme_mode") as "light" | "dark") || "light";
  });

  // Apply theme color CSS variables
  useEffect(() => {
    localStorage.setItem("vdms_theme_color", themeColor);
    theme.colors.primary.main = themeColor;
    theme.colors.primary.light = themeColor + "22";
    theme.colors.primary.dark = themeColor;
    document.documentElement.style.setProperty("--primary-color", themeColor);
    document.documentElement.style.setProperty("--primary-color-light", themeColor + "22");

    // Re-apply mode so sidebar background updates too
    applyThemeMode(themeMode, themeColor);
  }, [themeColor]);

  // Apply dark/light mode
  useEffect(() => {
    localStorage.setItem("vdms_theme_mode", themeMode);
    applyThemeMode(themeMode, themeColor);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem("vdms_language", language);
  }, [language]);

  // On mount: apply persisted mode immediately
  useEffect(() => {
    applyThemeMode(themeMode, themeColor);
    document.documentElement.style.setProperty("--primary-color", themeColor);
  }, []);

  const setThemeColor = (color: string) => setThemeColorState(color);
  const setLanguage = (lang: "en" | "si") => setLanguageState(lang);
  const setThemeMode = (mode: "light" | "dark") => setThemeModeState(mode);

  return (
    <SettingsContext.Provider value={{ themeColor, language, themeMode, setThemeColor, setLanguage, setThemeMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const useTranslation = () => {
  const { language } = useSettings();
  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  };
  return { t, language };
};
