import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { parsePhoneNumberFromString, validatePhoneNumberLength } from 'libphonenumber-js';
import Header from './Header';
import Dropdown from './Dropdown';
import SearchSelect from './SearchSelect';
import CgpaPicker from './CgpaPicker';
import { parseCgpa } from '../utils/cgpa';
import { liveCompletion, REQUIRED_PROFILE_PERCENT } from '../utils/profileCompletion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Camera,
  Trash2,
  Edit2,
  AlertTriangle,
  Key,
  Lock,
  X,
  Home,
  Globe,
  Plus,
  ChevronDown,
  Check,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import BackToDashboardButton from './BackToDashboardButton';

const LinkedinIcon = ({ className = "w-[18px] h-[18px]" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.72a1.47 1.47 0 1 0 0 2.94 1.47 1.47 0 0 0 0-2.94Z"/>
  </svg>
);

const GithubIcon = ({ className = "w-[18px] h-[18px]" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-[18px] h-[18px]" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const emptyProfile = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  address: "",
  dob: "",
  gender: "",
  currentEducation: "",
  fieldOfStudy: "",
  university: "",
  cgpa: "",
  expectedGraduation: "",
  interests: [],
  targetRoles: [],
  skills: [],
  workPreference: [],
  linkedin: "",
  github: "",
  portfolio: "",
  twitter: "",
  bio: ""
};

const getAuthToken = () => {
  const direct = sessionStorage.getItem('token') || sessionStorage.getItem('access_token');
  if (direct) return direct;

  try {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.token) return parsed.token;
      if (parsed.access_token) return parsed.access_token;
    }
  } catch (e) {
  }
  return null;
};

const authHeaders = () => ({ Authorization: `Bearer ${getAuthToken()}` });

const FIELD_SECTION = {
  avatar: 'photo', fullName: 'basic', email: 'basic', phone: 'basic', city: 'basic', country: 'basic', dob: 'basic',
  address: 'basic', gender: 'basic', currentEducation: 'education', fieldOfStudy: 'education', university: 'education',
  cgpa: 'education', expectedGraduation: 'education', interests: 'career', targetRoles: 'career', skills: 'career',
  workPreference: 'career', bio: 'career', linkedin: 'links', github: 'links', portfolio: 'links', twitter: 'links',
};
const MAX_TAGS = 15;
const MAX_TAG_LENGTH = 60;
const LINK_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

const GRADUATION_YEARS = Array.from({ length: new Date().getFullYear() + 10 - 1950 + 1 }, (_, i) => String(new Date().getFullYear() + 10 - i));

const loadGraduationYears = async (query) => ({
  items: GRADUATION_YEARS.filter((y) => y.includes(query.trim())).map((y) => ({ value: y, label: y })),
  hasMore: false,
});

const normalizePhone = (phone, countryCode = '') => {
  const raw = String(phone || '').trim();
  if (!raw) return '';
  const parsed = parsePhoneNumberFromString(raw, { defaultCallingCode: String(countryCode).replace('+', '') || undefined });
  return parsed ? parsed.number : raw.replace(/[^\d+]/g, '');
};

const MAX_PHONE_LENGTH = 20;

const acceptPhoneInput = (next, prev, countryCode = '') => {
  if (!/^\+?[\d\s()-]*$/.test(next) || next.length > MAX_PHONE_LENGTH) return false;
  const opts = { defaultCallingCode: String(countryCode).replace('+', '') || undefined };
  const digits = (v) => v.replace(/\D/g, '').length;
  if (digits(next) <= digits(prev)) return true;
  if (validatePhoneNumberLength(next, opts) === 'TOO_LONG') return false;
  const wasValid = !!parsePhoneNumberFromString(prev, opts)?.isValid();
  const isValid = !!parsePhoneNumberFromString(next, opts)?.isValid();
  return !(wasValid && !isValid);
};

const validateProfile = (data, countryCode = '') => {
  const errors = {};
  if (!String(data.fullName || '').trim()) errors.fullName = 'Full name is required.';
  if (!String(data.email || '').trim()) errors.email = 'Email address is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(data.email)) errors.email = 'Enter a valid email address, like name@example.com.';
  if (String(data.phone || '').trim()) {
    const parsed = parsePhoneNumberFromString(String(data.phone).trim(), { defaultCallingCode: String(countryCode).replace('+', '') || undefined });
    const lengthIssue = validatePhoneNumberLength(String(data.phone).trim(), { defaultCallingCode: String(countryCode).replace('+', '') || undefined });
    if (lengthIssue === 'TOO_SHORT') errors.phone = 'Phone number is incomplete. Enter the full number with country code, like +923001234567.';
    else if (!parsed || !parsed.isValid()) errors.phone = 'Enter a valid phone number with country code, like +923001234567.';
  }
  if (data.dob && new Date(data.dob) >= new Date(new Date().toDateString())) errors.dob = 'Date of birth must be in the past.';
  if (data.cgpa && !/^\d{1,3}(\.\d{1,2})?\s*(%|\/\s*\d{1,3}(\.\d{1,2})?)?$/.test(String(data.cgpa).trim())) {
    errors.cgpa = 'Enter your CGPA like 3.4 or 3.4/4, or a percentage like 85%.';
  }
  else if (data.cgpa) {
    const { scale, value } = parseCgpa(data.cgpa);
    if (parseFloat(value) > scale.max) errors.cgpa = `CGPA cannot be more than ${scale.max}${scale.key === '%' ? '%' : ''}.`;
  }
  if (data.expectedGraduation && !GRADUATION_YEARS.includes(String(data.expectedGraduation).trim())) {
    errors.expectedGraduation = `Select a graduation year between ${GRADUATION_YEARS.at(-1)} and ${GRADUATION_YEARS[0]}.`;
  }
  ['linkedin', 'github', 'portfolio'].forEach((key) => {
    if (data[key] && !LINK_PATTERN.test(String(data[key]).trim())) errors[key] = 'Enter a valid link, like linkedin.com/in/your-name.';
  });
  return errors;
};

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function UserProfile({ onNavigate, onLogout, autoEdit = false }) {
  const [profileData, setProfileData] = useState(emptyProfile);
  const [countryCode, setCountryCode] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get('/countries').then((res) => setCountries(res.data || [])).catch(() => {});
  }, []);

  const [fieldsOfStudy, setFieldsOfStudy] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);

  useEffect(() => {
    axios.get('/fields-of-study').then((res) => setFieldsOfStudy(res.data || [])).catch(() => {});
    axios.get('/education-levels').then((res) => setEducationLevels(res.data || [])).catch(() => {});
  }, []);

  const loadFieldsOfStudy = useCallback(async (query, page) => {
    const q = query.toLowerCase();
    const matches = q
      ? fieldsOfStudy
        .filter((name) => name.toLowerCase().includes(q))
        .sort((a, b) => (b.toLowerCase().startsWith(q) - a.toLowerCase().startsWith(q)) || a.localeCompare(b))
      : fieldsOfStudy;
    const items = matches.slice(0, page * 100).slice((page - 1) * 100).map((name) => ({ value: name, label: name }));
    return { items, hasMore: page * 100 < matches.length };
  }, [fieldsOfStudy]);

  const loadEducationLevels = useCallback(async (query, page) => {
    const q = query.toLowerCase();
    const matches = q
      ? educationLevels
        .filter((name) => name.toLowerCase().includes(q))
        .sort((a, b) => (b.toLowerCase().startsWith(q) - a.toLowerCase().startsWith(q)) || a.localeCompare(b))
      : educationLevels;
    const items = matches.slice(0, page * 100).slice((page - 1) * 100).map((name) => ({ value: name, label: name }));
    return { items, hasMore: page * 100 < matches.length };
  }, [educationLevels]);

  const selectedCountryIso = countries.find((c) => c.name === profileData.country)?.iso2 || '';

  const loadCountries = useCallback(async (query) => {
    const q = query.toLowerCase();
    const items = countries
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .sort((a, b) => (b.name.toLowerCase().startsWith(q) - a.name.toLowerCase().startsWith(q)) || a.name.localeCompare(b.name))
      .map((c) => ({ value: c.name, label: c.name, flag: c.flag }));
    return { items, hasMore: false };
  }, [countries]);

  const loadCities = useCallback(async (query, page) => {
    if (!selectedCountryIso) return { items: [], hasMore: false };
    const { data } = await axios.get(`/countries/${selectedCountryIso}/cities`, { params: { search: query, page } });
    return { items: data.cities.map((name) => ({ value: name, label: name })), hasMore: data.hasMore };
  }, [selectedCountryIso]);
  const [loading, setLoading] = useState(true);

  const [editingSection, setEditingSection] = useState(autoEdit ? 'all' : null);
  const isEditing = editingSection !== null;
  const canEdit = (section) => editingSection === 'all' || editingSection === section;
  const savedSnapshotRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [discardPrompt, setDiscardPrompt] = useState(null);
  const [emailVerify, setEmailVerify] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [hasPassword, setHasPassword] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [tagInputs, setTagInputs] = useState({
    interests: '',
    targetRoles: '',
    skills: ''
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordMsgTimeoutRef = useRef(null);

  const showPasswordError = (text) => {
    if (passwordMsgTimeoutRef.current) clearTimeout(passwordMsgTimeoutRef.current);
    setPasswordMsg({ type: 'error', text });
    passwordMsgTimeoutRef.current = setTimeout(() => {
      setPasswordMsg({ type: '', text: '' });
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (passwordMsgTimeoutRef.current) clearTimeout(passwordMsgTimeoutRef.current);
    };
  }, []);

  const [toast, setToast] = useState({ type: '', text: '' });

  const standardWorkModes = ["On-site", "Remote", "Hybrid"];

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast({ type: '', text: '' }), 3500);
  };

 
  const syncStoredUser = (user) => {
    try {
      const raw = sessionStorage.getItem('user');
      const existing = raw ? JSON.parse(raw) : {};
      const merged = { ...existing, name: user.fullName, email: user.email, avatar: user.avatar, avatar_url: user.avatar };
      sessionStorage.setItem('user', JSON.stringify(merged));
      window.dispatchEvent(new Event('user-profile-updated'));
    } catch (e) {
    }
  };

  const applyServerData = (user, profile) => {
    const formValues = {
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      city: profile.city || "",
      country: user.country || "",
      address: profile.address || "",
      dob: profile.dob || "",
      gender: profile.gender || "",
      currentEducation: profile.currentEducation || "",
      fieldOfStudy: profile.fieldOfStudy || "",
      university: profile.university || "",
      cgpa: profile.cgpa || "",
      expectedGraduation: profile.expectedGraduation || "",
      interests: profile.interests || [],
      targetRoles: profile.targetRoles || [],
      skills: profile.skills || [],
      workPreference: profile.workPreference && profile.workPreference.length > 0 ? profile.workPreference : [],
      linkedin: profile.linkedin || "",
      github: profile.github || "",
      portfolio: profile.portfolio || "",
      twitter: profile.twitter || "",
      bio: profile.bio || ""
    };
    setProfileData(formValues);
    savedSnapshotRef.current = formValues;
    setCountryCode(user.countryCode || "");
    if (typeof user.hasPassword === 'boolean') setHasPassword(user.hasPassword);
    setProfileImage(user.avatar || null);
    syncStoredUser(user);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) {
        showToast('error', 'Session expired. Please login again.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/profile', { headers: authHeaders() });
        applyServerData(response.data.user, response.data.profile);
        setCompletion(response.data.completion || null);
      } catch (error) {
        console.error("Failed to load profile", error);
        showToast('error', error.response?.data?.message || 'Failed to load your profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const toggleWorkPreferenceMode = (mode) => {
    if (!canEdit('career')) return;
    setProfileData(prev => {
      const currentPrefs = Array.isArray(prev.workPreference) ? prev.workPreference : [];
      if (currentPrefs.includes(mode)) {
        const updated = currentPrefs.filter(item => item !== mode);
        return { ...prev, workPreference: updated.length > 0 ? updated : [mode] };
      } else {
        return { ...prev, workPreference: [...currentPrefs, mode] };
      }
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setProfileImage(localPreview);
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await axios.post('/profile/avatar', formData, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      setProfileImage(response.data.avatar || null);
      if (response.data.completion) setCompletion(response.data.completion);
      syncStoredUser({ ...profileData, avatar: response.data.avatar });
      showToast('success', response.data.message || 'Profile picture updated!');
    } catch (error) {
      console.error("Failed to upload avatar", error);
      setProfileImage(null);
      showToast('error', error.response?.data?.message || 'Failed to upload picture.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (e) => {
    e.stopPropagation();
    const previous = profileImage;
    setProfileImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      const response = await axios.delete('/profile/avatar', { headers: authHeaders() });
      if (response.data.completion) setCompletion(response.data.completion);
      syncStoredUser({ ...profileData, avatar: null });
      showToast('success', response.data.message || 'Profile picture removed.');
    } catch (error) {
      console.error("Failed to delete avatar", error);
      setProfileImage(previous);
      showToast('error', error.response?.data?.message || 'Failed to remove picture.');
    }
  };

  const handleAddTag = (category, value) => {
    const tag = value.trim().replace(/\s+/g, ' ');
    if (!tag) return;
    const current = profileData[category] || [];
    let error = null;
    if (current.some((t) => t.toLowerCase() === tag.toLowerCase())) error = `"${tag}" is already added.`;
    else if (current.length >= MAX_TAGS) error = `You can add up to ${MAX_TAGS} items.`;
    else if (tag.length > MAX_TAG_LENGTH) error = `Keep each item under ${MAX_TAG_LENGTH} characters.`;
    setFieldErrors((prev) => ({ ...prev, [category]: error }));
    if (error) return;
    setProfileData(prev => ({ ...prev, [category]: [...prev[category], tag] }));
    setTagInputs(prev => ({ ...prev, [category]: '' }));
  };

  const handleRemoveTag = (category, indexToRemove) => {
    setProfileData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const startEditing = (section) => {
    savedSnapshotRef.current = profileData;
    setFieldErrors({});
    setTagInputs({ interests: '', targetRoles: '', skills: '' });
    setEditingSection(section);
  };

  const cancelEditing = () => {
    if (savedSnapshotRef.current) setProfileData(savedSnapshotRef.current);
    setFieldErrors({});
    setTagInputs({ interests: '', targetRoles: '', skills: '' });
    setEditingSection(null);
  };

  const hasUnsavedChanges = isEditing && (
    JSON.stringify(profileData) !== JSON.stringify(savedSnapshotRef.current)
    || Object.values(tagInputs).some((v) => v.trim() !== '')
  );

  const scrollToField = (key) => {
    setTimeout(() => {
      const el = document.querySelector(`[data-field="${key}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus({ preventScroll: true });
      }
    }, 80);
  };

  const saveProfile = async () => {
    const clientErrors = validateProfile(profileData, countryCode);
    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors);
      showToast('error', 'Please fix the highlighted fields.');
      scrollToField(Object.keys(clientErrors)[0]);
      return;
    }

    setIsSaving(true);
    setFieldErrors({});
    try {
      const payload = {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        country: profileData.country,
        city: profileData.city,
        dob: profileData.dob || null,
        address: profileData.address,
        gender: profileData.gender,
        currentEducation: profileData.currentEducation,
        fieldOfStudy: profileData.fieldOfStudy,
        university: profileData.university,
        cgpa: profileData.cgpa,
        expectedGraduation: profileData.expectedGraduation,
        interests: profileData.interests,
        targetRoles: profileData.targetRoles,
        skills: profileData.skills,
        workPreference: profileData.workPreference,
        bio: profileData.bio,
        linkedin: profileData.linkedin,
        github: profileData.github,
        portfolio: profileData.portfolio,
        twitter: profileData.twitter
      };

      const response = await axios.put('/profile', payload, { headers: authHeaders() });
      applyServerData(response.data.user, response.data.profile);
      setEditingSection(null);
      setTagInputs({ interests: '', targetRoles: '', skills: '' });
      const nextCompletion = response.data.completion || null;
      const justUnlocked = nextCompletion?.eligible && !completion?.eligible;
      setCompletion(nextCompletion);
      if (response.data.pendingEmail) {
        setEmailVerify({ email: response.data.pendingEmail, code: '', error: '', busy: false, retryAfter: 60 });
      }
      showToast('success', justUnlocked
        ? `Profile ${nextCompletion.percent}% complete. Career Assessment unlocked!`
        : (response.data.message || 'Profile updated successfully!'));
    } catch (error) {
      console.error("Failed to update profile", error);
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const mapped = {};
        Object.entries(validationErrors).forEach(([key, messages]) => {
          const field = key.split('.')[0];
          if (!mapped[field]) mapped[field] = messages[0];
        });
        setFieldErrors(mapped);
        scrollToField(Object.keys(mapped)[0]);
        showToast('error', 'Please fix the highlighted fields.');
      } else {
        showToast('error', error.response?.data?.message || 'Failed to save changes.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const guardUnsaved = (proceed) => {
    if (hasUnsavedChanges) setDiscardPrompt({ proceed });
    else proceed();
  };
  const guardedNavigate = (target, data) => guardUnsaved(() => onNavigate && onNavigate(target, data));
  const guardedLogout = () => guardUnsaved(() => onLogout && onLogout());

  useEffect(() => {
    if (!hasUnsavedChanges) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedChanges]);

  const goToField = (key) => {
    if (key === 'avatar') {
      fileInputRef.current?.click();
      return;
    }
    const section = FIELD_SECTION[key];
    if (!isEditing) startEditing(section);
    else if (!canEdit(section)) setEditingSection('all');
    scrollToField(key);
  };

  useEffect(() => {
    if (!emailVerify?.retryAfter) return undefined;
    const timer = setTimeout(() => setEmailVerify((v) => v && ({ ...v, retryAfter: v.retryAfter - 1 })), 1000);
    return () => clearTimeout(timer);
  }, [emailVerify?.retryAfter]);

  const submitEmailCode = async () => {
    if (!/^\d{5}$/.test(emailVerify.code)) {
      setEmailVerify((v) => ({ ...v, error: 'Enter the 5-digit code from the email.' }));
      return;
    }
    setEmailVerify((v) => ({ ...v, busy: true, error: '' }));
    try {
      const response = await axios.post('/profile/email/verify', { code: emailVerify.code }, { headers: authHeaders() });
      const user = response.data.user;
      setProfileData((prev) => ({ ...prev, email: user.email }));
      savedSnapshotRef.current = { ...savedSnapshotRef.current, email: user.email };
      syncStoredUser(user);
      if (response.data.completion) setCompletion(response.data.completion);
      setEmailVerify(null);
      showToast('success', response.data.message || 'Email address updated successfully!');
    } catch (error) {
      setEmailVerify((v) => ({ ...v, busy: false, error: error.response?.data?.message || 'Could not verify the code.' }));
    }
  };

  const resendEmailCode = async () => {
    setEmailVerify((v) => ({ ...v, busy: true, error: '' }));
    try {
      const response = await axios.post('/profile/email/resend', {}, { headers: authHeaders() });
      setEmailVerify((v) => ({ ...v, busy: false, retryAfter: response.data.retry_after || 60 }));
      showToast('success', response.data.message || 'A new code was sent.');
    } catch (error) {
      setEmailVerify((v) => ({
        ...v, busy: false,
        retryAfter: error.response?.data?.retry_after || v.retryAfter,
        error: error.response?.data?.message || 'Could not send a new code.',
      }));
    }
  };

  const isStudent = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('user') || '{}').role !== 'admin';
    } catch {
      return true;
    }
  })();
  const profileCompletion = isEditing ? liveCompletion(completion, { ...profileData, avatar: profileImage }) : completion;
  const requiredPercent = profileCompletion?.required ?? REQUIRED_PROFILE_PERCENT;
  const nextFields = (profileCompletion?.fields || [])
    .filter((field) => !field.done)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordMsgTimeoutRef.current) clearTimeout(passwordMsgTimeoutRef.current);
    setPasswordMsg({ type: '', text: '' });

    if ((hasPassword && !passwordData.currentPassword) || !passwordData.newPassword || !passwordData.confirmPassword) {
      showPasswordError('Please fill in all password fields.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showPasswordError('New password and confirmation do not match.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showPasswordError('New password must be at least 6 characters.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await axios.put('/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        newPassword_confirmation: passwordData.confirmPassword
      }, { headers: authHeaders() });

      setPasswordMsg({ type: 'success', text: response.data.message || 'Password updated successfully!' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordMsg({ type: '', text: '' });
        if (onLogout) onLogout();
      }, 1500);
    } catch (error) {
      console.error("Failed to update password", error);
      const validationErrors = error.response?.data?.errors;
      const firstError = validationErrors ? Object.values(validationErrors)[0]?.[0] : null;
      showPasswordError(firstError || error.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const displayPhone = profileData.phone && !String(profileData.phone).startsWith('+') && countryCode
    ? `${countryCode}${profileData.phone}`
    : (profileData.phone || countryCode || "");
  const [quickStats, setQuickStats] = useState({ quizzesAttempted: 0, careersMatched: 0 });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return undefined;

    const fetchQuickStats = () => {
      axios.get('/student/dashboard-stats', { headers: authHeaders() })
        .then(res => setQuickStats({
          quizzesAttempted: res.data?.quizzesCompleted ?? 0,
          careersMatched: res.data?.matchingCareers ?? 0,
        }))
        .catch(() => {});
    };

    fetchQuickStats();
    const statsInterval = setInterval(fetchQuickStats, 3000);
    return () => clearInterval(statsInterval);
  }, []);


  const renderSectionActions = (section) => {
    if (editingSection === section) {
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cancelEditing}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-60"
          >
            <X size={14} />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            onClick={saveProfile}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold text-white bg-[#890080] hover:bg-[#700068] shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            <Check size={14} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      );
    }
    if (isEditing || loading) return null;
    return (
      <button
        type="button"
        onClick={() => startEditing(section)}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold text-[#890080] bg-[#F7E8FF] border border-[#FFD2F7] hover:bg-[#890080] hover:text-white transition-all cursor-pointer"
      >
        <Edit2 size={14} />
        <span>Edit</span>
      </button>
    );
  };

  const renderFieldError = (key) => fieldErrors[key] ? (
    <p className="flex items-center gap-1.5 text-[13px] font-medium text-red-600 mt-1">
      <XCircle size={14} className="flex-shrink-0" />
      <span>{fieldErrors[key]}</span>
    </p>
  ) : null;
  const errorBorder = (key) => (fieldErrors[key] ? ' !border-red-400 focus:!ring-red-100' : '');

  return (
    <div className="w-full bg-transparent text-gray-900 antialiased space-y-6 pb-10 relative text-left">

      <Header onNavigate={guardedNavigate} onLogout={guardedLogout} currentView="profile" />

      {toast.text && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-2 px-4 py-3 rounded-[14px] shadow-lg border text-[14px] font-semibold animate-fade-in ${
          toast.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.text}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 space-y-8">

        <BackToDashboardButton onClick={() => guardedNavigate('dashboard')} />

        <div className="pt-1 space-y-2 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Your Profile</h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-4 space-y-6">

            <div className="bg-white border border-[#FFD2F7] rounded-[28px] p-6 shadow-[3px_4px_4px_0.2px_rgba(0,0,0,0.25)] flex flex-col items-center text-center relative">

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <div className="relative mt-2 group">
                <div className="w-[140px] h-[140px] rounded-full bg-[#FFBFF4] text-[#000000] font-extrabold text-[38px] flex items-center justify-center shadow-sm overflow-hidden relative">
                  {isUploadingImage ? (
                    <div className="w-8 h-8 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : profileImage ? (
                    <>
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setProfileImage(null)}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                        <button
                          type="button"
                          onClick={handleDeleteImage}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition transform hover:scale-110 cursor-pointer"
                          title="Delete Picture"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  ) : (
                    getInitials(profileData.fullName) || <User size={44} className="text-white" />
                  )}
                </div>

                {!profileImage && !isUploadingImage && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-[50px] h-[50px] flex items-center justify-center bg-white border border-gray-300 text-gray-600 hover:text-[#bd24df] rounded-full shadow-md transition cursor-pointer"
                    title="Upload Picture"
                  >
                    <Camera size={20} />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h2 className="text-[26px] font-bold text-[#000000] tracking-tight">
                  {loading ? '...' : (profileData.fullName || 'Student')}
                </h2>
                <p className="text-[18px] font-regular text-[#000000]">Student Member</p>
              </div>

              <div className="w-full border-t border-gray-100 my-5"></div>

              <div className="w-full space-y-3.5 text-left text-[16px] font-regular text-[#000000] px-2">
                <div className="flex items-center gap-3">
                  <Mail size={17} className="text-[#1300FF] flex-shrink-0" />
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={17} className="text-[#1300FF] flex-shrink-0" />
                  <span>{displayPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={17} className="text-[#1300FF] flex-shrink-0" />
                  <span>{profileData.city && profileData.country ? `${profileData.city}, ${profileData.country}` : profileData.city || profileData.country}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Home size={17} className="text-[#1300FF] flex-shrink-0" />
                  <span className="truncate">{profileData.address}</span>
                </div>
              </div>
            </div>

            {isStudent && profileCompletion && (
              <div className="bg-white border border-[#FFD2F7] rounded-[24px] p-5 shadow-[3px_4px_4px_0.2px_rgba(0,0,0,0.25)] space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-[21px] font-semibold text-[#000000] tracking-tight">Profile Completion</h3>
                  <span className="text-[21px] font-bold text-[#890080] transition-all duration-500">{profileCompletion.percent}%</span>
                </div>

                <div className="space-y-1.5">
                  <div className="relative h-2.5 w-full bg-[#F7E8FF] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#890080] transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(profileCompletion.percent, 100)}%` }}
                    />
                    <div className="absolute top-0 h-full w-0.5 bg-[#FF00ED]" style={{ left: `${requiredPercent}%` }} />
                  </div>
                  <div className="relative h-4 text-[12px] font-medium text-gray-500">
                    <span className="absolute -translate-x-1/2" style={{ left: `${requiredPercent}%` }}>{requiredPercent}% required</span>
                  </div>
                </div>

                {profileCompletion.eligible ? (
                  <div className="flex items-center gap-2 p-3 rounded-[12px] text-[14px] font-medium bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle2 size={18} className="flex-shrink-0" />
                    <span>Eligible for the Career Assessment</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-[12px] text-[14px] font-medium bg-red-50 text-red-600 border border-red-200">
                    <Lock size={17} className="flex-shrink-0" />
                    <span>Incomplete profile: {requiredPercent - profileCompletion.percent}% more needed to unlock the Career Assessment</span>
                  </div>
                )}

                {!profileCompletion.eligible && nextFields.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[14px] font-medium text-[#000000]">Complete next</p>
                    <div className="flex flex-wrap gap-2">
                      {nextFields.map((field) => (
                        <button
                          type="button"
                          key={field.key}
                          onClick={() => goToField(field.key)}
                          title={`Add your ${field.label.toLowerCase()}`}
                          className="px-3 py-1 rounded-full text-[13px] font-medium text-[#890080] bg-[#F7E8FF] border border-[#FFD2F7] hover:bg-[#890080] hover:text-white hover:border-[#890080] transition-all cursor-pointer group"
                        >
                          {field.label} <span className="text-gray-500 group-hover:text-white/80">+{field.weight}%</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <p className="text-[13px] text-gray-500">Updates live as you fill in fields. Save changes to apply.</p>
                )}

                {profileCompletion.eligible && !isEditing && (
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('quiz')}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-semibold text-white bg-[#890080] hover:bg-[#700068] transition shadow-sm cursor-pointer"
                  >
                    <FileText size={16} />
                    <span>Start Career Assessment</span>
                  </button>
                )}
              </div>
            )}

            <div className="bg-white border border-[#FFD2F7] rounded-[24px] p-5 shadow-[3px_4px_4px_0.2px_rgba(0,0,0,0.25)] space-y-4 text-left">
              <h3 className="text-[21px] font-semibold text-[#000000] tracking-tight">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F7E8FF] rounded-[15px]">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-[#1300FF]" />
                    <span className="text-[16px] font-regular text-gray-800">Assessments Attempted</span>
                  </div>
                  <span className="text-[17px] font-semibold text-[#890080] transition-all duration-500">{quickStats.quizzesAttempted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F7E8FF] rounded-[15px]">
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-[#1300FF]" />
                    <span className="text-[16px] font-regular text-gray-800">Careers Matched</span>
                  </div>
                  <span className="text-[17px] font-semibold text-[#890080] transition-all duration-500">{quickStats.careersMatched}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-8 bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] text-left space-y-7">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <h2 className="text-[25px] font-semibold text-[#000000]">Personal Information</h2>

              <div className="flex items-center gap-3 flex-wrap">
                {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setShowCurrentPassword(false);
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                    setPasswordMsg({ type: '', text: '' });
                    setIsPasswordModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#890080] bg-[#F7E8FF] border border-[#FFD2F7] hover:bg-[#890080] hover:text-white transition-all shadow-xs cursor-pointer"
                >
                  <Key size={16} />
                  <span>{hasPassword ? 'Change Password' : 'Set Password'}</span>
                </button>
                )}

                {editingSection === 'all' ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-60"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="button"
                      onClick={saveProfile}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-semibold text-white shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-[#890080] hover:bg-[#700068]"
                    >
                      <Check size={16} />
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </>
                ) : !isEditing && (
                  <button
                    type="button"
                    onClick={() => startEditing('all')}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-semibold text-white shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed bg-[#890080] hover:bg-[#700068]"
                  >
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                    <User size={23} strokeWidth={1.7} className="text-[#890080]" />
                    <span>Basic Information</span>
                  </div>
                  {renderSectionActions('basic')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={!canEdit('basic')}
                      data-field="fullName"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('fullName')}`}
                    />
                    {renderFieldError('fullName')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      maxLength={254}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        handleInputChange({ target: { name: 'email', value } });
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: validateProfile({ email: value }).email || null }));
                      }}
                      onBlur={(e) => setFieldErrors((prev) => ({ ...prev, email: validateProfile({ email: e.target.value }).email || null }))}
                      disabled={!canEdit('basic')}
                      data-field="email"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('email')}`}
                    />
                    {renderFieldError('email')}
                    {canEdit('basic') && !fieldErrors.email
                      && String(profileData.email || '').trim().toLowerCase() !== String(savedSnapshotRef.current?.email || '').trim().toLowerCase() && (
                      <p className="flex items-start gap-1.5 text-[13px] font-medium text-red-600 mt-1">
                        <AlertCircle size={14} className="flex-shrink-0 mt-[2px]" />
                        <span>Changing your email sends a verification code to the new address.</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      maxLength={MAX_PHONE_LENGTH}
                      onChange={(e) => {
                        if (!acceptPhoneInput(e.target.value, String(profileData.phone || ''), countryCode)) return;
                        handleInputChange(e);
                        if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: validateProfile({ phone: e.target.value }, countryCode).phone || null }));
                      }}
                      onBlur={(e) => setFieldErrors((prev) => ({ ...prev, phone: validateProfile({ phone: e.target.value }, countryCode).phone || null }))}
                      placeholder="+923001234567"
                      autoComplete="tel"
                      disabled={!canEdit('basic')}
                      data-field="phone"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('phone')}`}
                    />
                    {renderFieldError('phone')}
                    {canEdit('basic') && !fieldErrors.phone
                      && String(profileData.phone || '').replace(/[^\d+]/g, '') !== ''
                      && !validateProfile({ phone: profileData.phone }, countryCode).phone
                      && normalizePhone(profileData.phone, countryCode) !== normalizePhone(savedSnapshotRef.current?.phone, countryCode) && (
                      <p className="flex items-start gap-1.5 text-[13px] font-medium text-red-600 mt-1">
                        <AlertCircle size={14} className="flex-shrink-0 mt-[2px]" />
                        <span>Changing your phone number sends a verification code to the new number.</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Country</label>
                    <SearchSelect
                      value={profileData.country}
                      onChange={(v) => {
                        if (v === profileData.country) return;
                        setProfileData((prev) => ({ ...prev, country: v, city: '' }));
                      }}
                      loadOptions={loadCountries}
                      disabled={!canEdit('basic')}
                      placeholder="Select your country"
                      searchPlaceholder="Search country..."
                      emptyText="No country found"
                      hasError={!!fieldErrors.country}
                      dataField="country"
                      ariaLabel="Country"
                      renderValue={(v) => {
                        const flag = countries.find((c) => c.name === v)?.flag;
                        return flag ? `${flag}  ${v}` : v;
                      }}
                    />
                    {renderFieldError('country')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">City</label>
                    <SearchSelect
                      key={selectedCountryIso || 'no-country'}
                      value={profileData.city}
                      onChange={(v) => handleInputChange({ target: { name: 'city', value: v } })}
                      loadOptions={loadCities}
                      disabled={!canEdit('basic') || (!selectedCountryIso && !profileData.city)}
                      placeholder={selectedCountryIso ? 'Select your city' : 'Select a country first'}
                      searchPlaceholder={`Search cities in ${profileData.country || 'country'}...`}
                      emptyText="No city found"
                      allowCustom
                      hasError={!!fieldErrors.city}
                      dataField="city"
                      ariaLabel="City"
                    />
                    {renderFieldError('city')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={profileData.dob}
                      onChange={handleInputChange}
                      disabled={!canEdit('basic')}
                      data-field="dob"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('dob')}`}
                    />
                    {renderFieldError('dob')}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[17px] font-medium text-[#000000]">Residential Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      disabled={!canEdit('basic')}
                      data-field="address"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('address')}`}
                    />
                    {renderFieldError('address')}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[17px] font-medium text-[#000000]">Gender</label>
                    <Dropdown
                      variant="profile"
                      placeholder="Select gender"
                      value={profileData.gender}
                      onChange={(v) => handleInputChange({ target: { name: 'gender', value: v } })}
                      options={[
                        { value: 'Male', label: 'Male' },
                        { value: 'Female', label: 'Female' },
                        { value: 'Prefer not to say', label: 'Prefer Not to Say' },
                      ]}
                      disabled={!canEdit('basic')}
                      ariaLabel="Gender"
                    />
                  </div>

                </div>
              </div>

              <div className="w-full border-t border-gray-200/80 my-4"></div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                    <GraduationCap size={23} strokeWidth={1.7} className="text-[#890080]" />
                    <span>Education</span>
                  </div>
                  {renderSectionActions('education')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Current Education / Degree</label>
                    <SearchSelect
                      value={profileData.currentEducation}
                      onChange={(v) => handleInputChange({ target: { name: 'currentEducation', value: v } })}
                      loadOptions={loadEducationLevels}
                      disabled={!canEdit('education')}
                      placeholder="Select your education / degree"
                      searchPlaceholder="Search degree..."
                      emptyText="No degree found"
                      allowCustom
                      hasError={!!fieldErrors.currentEducation}
                      dataField="currentEducation"
                      ariaLabel="Current Education / Degree"
                    />
                    {renderFieldError('currentEducation')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Field of Study / Major</label>
                    <SearchSelect
                      value={profileData.fieldOfStudy}
                      onChange={(v) => handleInputChange({ target: { name: 'fieldOfStudy', value: v } })}
                      loadOptions={loadFieldsOfStudy}
                      disabled={!canEdit('education')}
                      placeholder="Select your field of study"
                      searchPlaceholder="Search field of study..."
                      emptyText="No field found"
                      allowCustom
                      hasError={!!fieldErrors.fieldOfStudy}
                      dataField="fieldOfStudy"
                      ariaLabel="Field of Study / Major"
                    />
                    {renderFieldError('fieldOfStudy')}
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[17px] font-medium text-[#000000]">University / College</label>
                    <input
                      type="text"
                      name="university"
                      value={profileData.university}
                      onChange={handleInputChange}
                      disabled={!canEdit('education')}
                      data-field="university"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('university')}`}
                    />
                    {renderFieldError('university')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Current CGPA / Grade</label>
                    <CgpaPicker
                      value={profileData.cgpa}
                      onChange={(v) => handleInputChange({ target: { name: 'cgpa', value: v } })}
                      disabled={!canEdit('education')}
                      hasError={!!fieldErrors.cgpa}
                      dataField="cgpa"
                    />
                    {renderFieldError('cgpa')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Expected Graduation Year</label>
                    <SearchSelect
                      value={profileData.expectedGraduation ? String(profileData.expectedGraduation) : ''}
                      onChange={(v) => handleInputChange({ target: { name: 'expectedGraduation', value: v } })}
                      loadOptions={loadGraduationYears}
                      disabled={!canEdit('education')}
                      placeholder="Select graduation year"
                      searchPlaceholder="Search year..."
                      emptyText="No year found"
                      hasError={!!fieldErrors.expectedGraduation}
                      dataField="expectedGraduation"
                      ariaLabel="Expected Graduation Year"
                    />
                    {renderFieldError('expectedGraduation')}
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-200/80 my-4"></div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                    <Briefcase size={23} strokeWidth={1.7} className="text-[#890080]" />
                    <span>Career Information</span>
                  </div>
                  {renderSectionActions('career')}
                </div>

                <div className="space-y-4">

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Career Interests / Domains</label>
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FDFDFD] border border-gray-200/90 focus-within:border-[#890080] focus-within:ring-2 focus-within:ring-[#FFD2F7] rounded-[14px] min-h-[50px] transition-all">
                      {profileData.interests.map((interest, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F7E8FF] text-[#890080] border border-[#FFD2F7] rounded-full text-[14px] font-semibold">
                          {interest}
                          {canEdit('career') && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTag('interests', idx)}
                              className="hover:text-red-600 transition cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </span>
                      ))}
                      {canEdit('career') && (
                        <div className="flex items-center gap-1.5 flex-1 min-w-[150px]">
                          <input
                            type="text"
                            data-field="interests"
                            maxLength={MAX_TAG_LENGTH}
                            value={tagInputs.interests}
                            onChange={(e) => { setTagInputs(prev => ({ ...prev, interests: e.target.value })); if (fieldErrors.interests) setFieldErrors(prev => ({ ...prev, interests: null })); }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag('interests', tagInputs.interests);
                              }
                            }}
                            placeholder="Add interest & press Enter..."
                            className="w-full text-[14px] font-medium bg-transparent outline-none text-gray-800 placeholder-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTag('interests', tagInputs.interests)}
                            className="p-1 bg-[#890080] text-white rounded-full hover:bg-[#700068] transition cursor-pointer flex-shrink-0"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    {renderFieldError('interests')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Target Job Roles</label>
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FDFDFD] border border-gray-200/90 focus-within:border-[#890080] focus-within:ring-2 focus-within:ring-[#FFD2F7] rounded-[14px] min-h-[50px] transition-all">
                      {profileData.targetRoles.map((role, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F7E8FF] text-[#890080] border border-[#FFD2F7] rounded-full text-[14px] font-semibold">
                          {role}
                          {canEdit('career') && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTag('targetRoles', idx)}
                              className="hover:text-red-600 transition cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </span>
                      ))}
                      {canEdit('career') && (
                        <div className="flex items-center gap-1.5 flex-1 min-w-[150px]">
                          <input
                            type="text"
                            data-field="targetRoles"
                            maxLength={MAX_TAG_LENGTH}
                            value={tagInputs.targetRoles}
                            onChange={(e) => { setTagInputs(prev => ({ ...prev, targetRoles: e.target.value })); if (fieldErrors.targetRoles) setFieldErrors(prev => ({ ...prev, targetRoles: null })); }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag('targetRoles', tagInputs.targetRoles);
                              }
                            }}
                            placeholder="Add target role & press Enter..."
                            className="w-full text-[14px] font-medium bg-transparent outline-none text-gray-800 placeholder-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTag('targetRoles', tagInputs.targetRoles)}
                            className="p-1 bg-[#890080] text-white rounded-full hover:bg-[#700068] transition cursor-pointer flex-shrink-0"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    {renderFieldError('targetRoles')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000]">Core Skills & Frameworks</label>
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FDFDFD] border border-gray-200/90 focus-within:border-[#890080] focus-within:ring-2 focus-within:ring-[#FFD2F7] rounded-[14px] min-h-[50px] transition-all">
                      {profileData.skills.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#F7E8FF] text-[#890080] border border-[#FFD2F7] rounded-full text-[14px] font-semibold">
                          {skill}
                          {canEdit('career') && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTag('skills', idx)}
                              className="hover:text-red-600 transition cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </span>
                      ))}
                      {canEdit('career') && (
                        <div className="flex items-center gap-1.5 flex-1 min-w-[150px]">
                          <input
                            type="text"
                            data-field="skills"
                            maxLength={MAX_TAG_LENGTH}
                            value={tagInputs.skills}
                            onChange={(e) => { setTagInputs(prev => ({ ...prev, skills: e.target.value })); if (fieldErrors.skills) setFieldErrors(prev => ({ ...prev, skills: null })); }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag('skills', tagInputs.skills);
                              }
                            }}
                            placeholder="Add skill & press Enter..."
                            className="w-full text-[14px] font-medium bg-transparent outline-none text-gray-800 placeholder-gray-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTag('skills', tagInputs.skills)}
                            className="p-1 bg-[#890080] text-white rounded-full hover:bg-[#700068] transition cursor-pointer flex-shrink-0"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    {renderFieldError('skills')}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[17px] font-medium text-[#000000]">Preferred Work Mode</label>
                      <div className="flex flex-wrap gap-3 pt-1">
                        {standardWorkModes.map((mode) => {
                          const isSelected = Array.isArray(profileData.workPreference) && profileData.workPreference.includes(mode);
                          return (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => toggleWorkPreferenceMode(mode)}
                              disabled={!canEdit('career')}
                              data-field={mode === standardWorkModes[0] ? 'workPreference' : undefined}
                              className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-[16px] text-[15px] font-medium transition-all shadow-sm ${
                                isSelected
                                  ? 'bg-[#FDF7FF] text-[#890080] border-2 border-[#890080]'
                                  : 'bg-white text-gray-700 border border-gray-200/90 hover:bg-[#F7E8FF]/40'
                              } ${!canEdit('career') ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <div className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-[#890080] text-white border-[#890080]' : 'border-gray-300 bg-white'
                              }`}>
                                {isSelected && <Check size={13} strokeWidth={3} />}
                              </div>
                              <span className="font-semibold">{mode}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[17px] font-medium text-[#000000]">Professional Summary / Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        disabled={!canEdit('career')}
                      data-field="bio"
                        rows={4}
                        className={`w-full bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium p-4 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all resize-none leading-relaxed${errorBorder('bio')}`}
                      />
                      {renderFieldError('bio')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-200/80 my-4"></div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                    <Globe size={23} strokeWidth={1.7} className="text-[#890080]" />
                    <span>Social & Professional Links</span>
                  </div>
                  {renderSectionActions('links')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000] flex items-center gap-2">
                      <LinkedinIcon className="w-[18px] h-[18px] text-[#0A66C2]" /> LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleInputChange}
                      disabled={!canEdit('links')}
                      data-field="linkedin"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('linkedin')}`}
                    />
                    {renderFieldError('linkedin')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000] flex items-center gap-2">
                      <GithubIcon className="w-[18px] h-[18px] text-[#181717]" /> GitHub Profile
                    </label>
                    <input
                      type="text"
                      name="github"
                      value={profileData.github}
                      onChange={handleInputChange}
                      disabled={!canEdit('links')}
                      data-field="github"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('github')}`}
                    />
                    {renderFieldError('github')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000] flex items-center gap-2">
                      <Globe size={18} className="text-[#890080]" /> Portfolio / Website
                    </label>
                    <input
                      type="text"
                      name="portfolio"
                      value={profileData.portfolio}
                      onChange={handleInputChange}
                      disabled={!canEdit('links')}
                      data-field="portfolio"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('portfolio')}`}
                    />
                    {renderFieldError('portfolio')}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[17px] font-medium text-[#000000] flex items-center gap-2">
                      <TwitterIcon className="w-[18px] h-[18px] text-[#1DA1F2]" /> Twitter / X Handle
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      value={profileData.twitter}
                      onChange={handleInputChange}
                      disabled={!canEdit('links')}
                      data-field="twitter"
                      className={`w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all${errorBorder('twitter')}`}
                    />
                    {renderFieldError('twitter')}
                  </div>
                </div>
              </div>

            </form>
          </div>

        </div>
      </main>

      {discardPrompt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDiscardPrompt(null)}>
          <div
            className="bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-[3px_6px_12px_0.5px_rgba(0,0,0,0.2)] text-left space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => setDiscardPrompt(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition cursor-pointer" title="Close">
              <X size={20} />
            </button>
            <div className="flex items-start gap-4 pr-6">
              <div className="w-12 h-12 rounded-full bg-[#FFECEC] border border-[#F3C9C9] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} strokeWidth={2} className="text-[#DC2626]" />
              </div>
              <div className="space-y-1.5 pt-0.5">
                <h3 className="text-[21px] font-semibold text-[#000000] leading-tight">Unsaved Changes</h3>
                <p className="text-[15px] text-gray-600 leading-relaxed">
                  You have changes that haven't been saved. If you leave now, they will be lost.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDiscardPrompt(null)}
                className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  const { proceed } = discardPrompt;
                  setDiscardPrompt(null);
                  cancelEditing();
                  proceed();
                }}
                className="px-6 py-2.5 rounded-full text-[14px] font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-sm transition-all cursor-pointer"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {emailVerify && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-[3px_6px_12px_0.5px_rgba(0,0,0,0.2)] text-left space-y-6 relative">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5 text-[25px] font-semibold text-[#000000]">
                <Mail size={26} className="text-[#890080]" />
                <span>Verify New Email</span>
              </div>
              <button type="button" onClick={() => setEmailVerify(null)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition cursor-pointer" title="Close (your current email stays active)">
                <X size={20} />
              </button>
            </div>

            <p className="text-[15px] text-gray-600 leading-relaxed">
              We sent a 5-digit code to <span className="font-semibold text-[#000000] break-all">{emailVerify.email}</span>.
              Your current email stays active until you confirm the new one.
            </p>

            {emailVerify.error && (
              <div className="flex items-center gap-2 p-3 rounded-[12px] text-[14px] font-medium bg-red-50 text-red-600 border border-red-200">
                <XCircle size={18} className="flex-shrink-0" />
                <span>{emailVerify.error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submitEmailCode(); }}>
              <div className="space-y-1">
                <label className="text-[16px] font-medium text-[#000000]">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={5}
                  autoFocus
                  value={emailVerify.code}
                  onChange={(e) => setEmailVerify((v) => ({ ...v, code: e.target.value.replace(/\D/g, ''), error: '' }))}
                  placeholder="00000"
                  className="w-full h-[50px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[22px] font-semibold tracking-[10px] text-center px-4 rounded-[14px] outline-none text-gray-800 transition-all"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={resendEmailCode}
                  disabled={emailVerify.busy || emailVerify.retryAfter > 0}
                  className="px-4 py-2.5 rounded-full text-[14px] font-medium text-[#890080] hover:bg-[#F7E8FF] transition cursor-pointer disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                  {emailVerify.retryAfter > 0 ? `Resend code in ${emailVerify.retryAfter}s` : 'Resend code'}
                </button>
                <button
                  type="submit"
                  disabled={emailVerify.busy}
                  className="px-6 py-2.5 rounded-full text-[14px] font-semibold text-white bg-[#890080] hover:bg-[#700068] transition shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {emailVerify.busy ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            if (passwordMsgTimeoutRef.current) clearTimeout(passwordMsgTimeoutRef.current);
            setIsPasswordModalOpen(false);
            setPasswordMsg({ type: '', text: '' });
          }}
        >
          <div
            className="bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-[3px_6px_12px_0.5px_rgba(0,0,0,0.2)] text-left space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2.5 text-[25px] font-semibold text-[#000000]">
                <Lock size={28} className="text-[#890080]" />
                <span>{hasPassword ? 'Update Password' : 'Set Password'}</span>
              </div>
              <button
                onClick={() => {
                  if (passwordMsgTimeoutRef.current) clearTimeout(passwordMsgTimeoutRef.current);
                  setIsPasswordModalOpen(false);
                  setPasswordMsg({ type: '', text: '' });
                }}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {passwordMsg.text && (
              <div className={`flex items-center gap-2 p-3 rounded-[12px] text-[14px] font-medium ${
                passwordMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {passwordMsg.type === 'error' ? <XCircle size={18} className="flex-shrink-0" /> : <CheckCircle2 size={18} className="flex-shrink-0" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {!hasPassword && (
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  You signed up with Google. Set a password to also sign in with your email and password.
                </p>
              )}
              {hasPassword && (
              <div className="space-y-1">
                <label className="text-[16px] font-medium text-[#000000]">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter current password"
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium pl-4 pr-11 py-2.5 rounded-[14px] outline-none text-gray-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              )}

              <div className="space-y-1">
                <label className="text-[16px] font-medium text-[#000000]">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium pl-4 pr-11 py-2.5 rounded-[14px] outline-none text-gray-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[16px] font-medium text-[#000000]">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#890080] focus:ring-2 focus:ring-[#FFD2F7] text-[15px] font-medium pl-4 pr-11 py-2.5 rounded-[14px] outline-none text-gray-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (passwordMsgTimeoutRef.current) clearTimeout(passwordMsgTimeoutRef.current);
                    setIsPasswordModalOpen(false);
                    setPasswordMsg({ type: '', text: '' });
                  }}
                  className="px-5 py-2.5 rounded-full text-[14px] font-medium text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-6 py-2.5 rounded-full text-[14px] font-semibold text-white bg-[#890080] hover:bg-[#700068] transition shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUpdatingPassword ? 'Saving...' : (hasPassword ? 'Update Password' : 'Set Password')}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
