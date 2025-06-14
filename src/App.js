import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye,
  Edit3,
  Save,
  X,
  GripVertical
} from 'lucide-react';

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com'
    },
    summary: 'Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.',
    experience: [
      {
        id: 1,
        jobTitle: 'Senior Software Developer',
        company: 'Tech Corp Inc.',
        location: 'New York, NY',
        startDate: '2022',
        endDate: 'Present',
        description: '• Led development of customer-facing web applications\n• Improved application performance by 40%\n• Mentored junior developers'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        location: 'New York, NY',
        startDate: '2016',
        endDate: '2020'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    languages: [
      { id: 1, name: 'English', level: 'Native' },
      { id: 2, name: 'Spanish', level: 'Intermediate' }
    ]
  });

  const [editingField, setEditingField] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addArrayItem = (section, newItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...newItem, id: Date.now() }]
    }));
  };

  const removeArrayItem = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const updateArrayItem = (section, id, updatedItem) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      )
    }));
  };

  const EditableField = ({ 
    value, 
    onChange, 
    className = "", 
    placeholder = "", 
    multiline = false,
    fieldKey = "",
    type = "text"
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const inputRef = useRef(null);
    const saveTimeoutRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
      setTempValue(value);
    }, [value]);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        if (multiline) {
          inputRef.current.style.height = 'auto';
          inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        }
      }
    }, [isEditing, multiline]);

    const handleAutoSave = (newValue) => {
      setTempValue(newValue);
      
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set saving indicator
      setIsSaving(true);
      
      // Auto-save after 300ms of no typing
      saveTimeoutRef.current = setTimeout(() => {
        onChange(newValue);
        setIsSaving(false);
      }, 300);
    };

    const handleFinishEditing = () => {
      // Clear any pending timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Save immediately when done editing
      onChange(tempValue);
      setIsEditing(false);
      setIsSaving(false);
    };

    const handleCancel = () => {
      // Clear any pending timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      setTempValue(value);
      setIsEditing(false);
      setIsSaving(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !multiline) {
        handleFinishEditing();
      } else if (e.key === 'Escape') {
        handleCancel();
      } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
        handleFinishEditing();
      }
    };

    const handleBlur = () => {
      // Save when clicking outside or losing focus
      handleFinishEditing();
    };

    if (isEditing) {
      return (
        <div className="relative">
          {multiline ? (
            <textarea
              ref={inputRef}
              value={tempValue}
              onChange={(e) => handleAutoSave(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className={`${className} border-2 border-blue-500 bg-white resize-none`}
              placeholder={placeholder}
              style={{ minHeight: '60px' }}
            />
          ) : (
            <input
              ref={inputRef}
              type={type}
              value={tempValue}
              onChange={(e) => handleAutoSave(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className={`${className} border-2 border-blue-500 bg-white`}
              placeholder={placeholder}
            />
          )}
          {isSaving && (
            <div className="absolute -top-6 left-0 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded shadow-sm">
              Saving...
            </div>
          )}
          {multiline && (
            <div className="text-xs text-gray-500 mt-1">
              Auto-saves as you type • Press Enter to finish • Escape to cancel
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        onClick={() => setIsEditing(true)}
        className={`${className} cursor-text hover:bg-blue-50 hover:border hover:border-blue-300 rounded transition-colors ${
          !value ? 'text-gray-400' : ''
        }`}
      >
        {value || placeholder}
      </div>
    );
  };

  const EditableSkills = () => {
    const [newSkill, setNewSkill] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const saveTimeoutRef = useRef(null);

    const addSkill = () => {
      if (newSkill.trim()) {
        updateResumeData('skills', [...resumeData.skills, newSkill.trim()]);
        setNewSkill('');
        setIsAdding(false);
      }
    };

    const removeSkill = (index) => {
      updateResumeData('skills', resumeData.skills.filter((_, i) => i !== index));
    };

    const updateSkill = (index, value) => {
      const updatedSkills = [...resumeData.skills];
      updatedSkills[index] = value;
      updateResumeData('skills', updatedSkills);
    };

    const handleAutoAddSkill = (value) => {
      setNewSkill(value);
      
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Auto-add skill after 500ms of no typing (if it has content)
      if (value.trim()) {
        saveTimeoutRef.current = setTimeout(() => {
          updateResumeData('skills', [...resumeData.skills, value.trim()]);
          setNewSkill('');
          setIsAdding(false);
        }, 800);
      }
    };

    return (
      <div 
        className="group"
        onMouseEnter={() => setHoveredSection('skills')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-800 pb-1 border-b border-gray-300">Skills</h2>
          {hoveredSection === 'skills' && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Plus size={12} />
              Add Skill
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="group/skill relative">
              <EditableField
                value={skill}
                onChange={(value) => updateSkill(index, value)}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm inline-block min-w-12"
                placeholder="Skill name"
              />
              <button
                onClick={() => removeSkill(index)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover/skill:opacity-100 transition-opacity"
              >
                <X size={10} className="mx-auto" />
              </button>
            </div>
          ))}
          {isAdding && (
            <div className="relative">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => handleAutoAddSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
                    addSkill();
                  }
                  if (e.key === 'Escape') {
                    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
                    setIsAdding(false);
                    setNewSkill('');
                  }
                }}
                onBlur={() => {
                  if (newSkill.trim()) {
                    addSkill();
                  } else {
                    setIsAdding(false);
                  }
                }}
                placeholder="Skill name"
                className="px-3 py-1 border-2 border-blue-500 rounded text-sm"
                autoFocus
              />
              <div className="text-xs text-gray-500 mt-1">
                Auto-adds as you type • Press Enter to add immediately
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const EditableExperience = () => (
    <div 
      className="group"
      onMouseEnter={() => setHoveredSection('experience')}
      onMouseLeave={() => setHoveredSection(null)}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800 pb-1 border-b border-gray-300">Work Experience</h2>
        {hoveredSection === 'experience' && (
          <button
            onClick={() => addArrayItem('experience', {
              jobTitle: 'Job Title',
              company: 'Company Name',
              location: 'Location',
              startDate: 'Start Date',
              endDate: 'End Date',
              description: 'Describe your responsibilities and achievements...'
            })}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus size={12} />
            Add Experience
          </button>
        )}
      </div>
      {resumeData.experience.map((exp) => (
        <div key={exp.id} className="mb-6 group/item relative p-3 rounded hover:bg-gray-50">
          <button
            onClick={() => removeArrayItem('experience', exp.id)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
          >
            <X size={12} className="mx-auto" />
          </button>
          
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <EditableField
                value={exp.jobTitle}
                onChange={(value) => updateArrayItem('experience', exp.id, { jobTitle: value })}
                className="text-lg font-semibold text-gray-800 block w-full p-1"
                placeholder="Job Title"
              />
              <EditableField
                value={exp.company}
                onChange={(value) => updateArrayItem('experience', exp.id, { company: value })}
                className="text-blue-600 font-medium block w-full p-1"
                placeholder="Company Name"
              />
            </div>
            <div className="text-right ml-4">
              <div className="flex gap-2 text-sm text-gray-600">
                <EditableField
                  value={exp.startDate}
                  onChange={(value) => updateArrayItem('experience', exp.id, { startDate: value })}
                  className="p-1 text-right"
                  placeholder="Start Date"
                />
                <span>-</span>
                <EditableField
                  value={exp.endDate}
                  onChange={(value) => updateArrayItem('experience', exp.id, { endDate: value })}
                  className="p-1 text-right"
                  placeholder="End Date"
                />
              </div>
              <EditableField
                value={exp.location}
                onChange={(value) => updateArrayItem('experience', exp.id, { location: value })}
                className="text-sm text-gray-600 p-1 text-right"
                placeholder="Location"
              />
            </div>
          </div>
          
          <EditableField
            value={exp.description}
            onChange={(value) => updateArrayItem('experience', exp.id, { description: value })}
            className="text-gray-700 text-sm leading-relaxed whitespace-pre-line w-full p-2"
            placeholder="Describe your responsibilities and achievements..."
            multiline={true}
          />
        </div>
      ))}
    </div>
  );

  const EditableEducation = () => (
    <div 
      className="group"
      onMouseEnter={() => setHoveredSection('education')}
      onMouseLeave={() => setHoveredSection(null)}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800 pb-1 border-b border-gray-300">Education</h2>
        {hoveredSection === 'education' && (
          <button
            onClick={() => addArrayItem('education', {
              degree: 'Degree',
              school: 'School Name',
              location: 'Location',
              startDate: 'Start Date',
              endDate: 'End Date'
            })}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Plus size={12} />
            Add Education
          </button>
        )}
      </div>
      {resumeData.education.map((edu) => (
        <div key={edu.id} className="mb-4 group/item relative p-3 rounded hover:bg-gray-50">
          <button
            onClick={() => removeArrayItem('education', edu.id)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover/item:opacity-100 transition-opacity"
          >
            <X size={12} className="mx-auto" />
          </button>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <EditableField
                value={edu.degree}
                onChange={(value) => updateArrayItem('education', edu.id, { degree: value })}
                className="font-semibold text-gray-800 block w-full p-1"
                placeholder="Degree"
              />
              <EditableField
                value={edu.school}
                onChange={(value) => updateArrayItem('education', edu.id, { school: value })}
                className="text-blue-600 block w-full p-1"
                placeholder="School Name"
              />
            </div>
            <div className="text-right ml-4">
              <div className="flex gap-2 text-sm text-gray-600">
                <EditableField
                  value={edu.startDate}
                  onChange={(value) => updateArrayItem('education', edu.id, { startDate: value })}
                  className="p-1 text-right"
                  placeholder="Start Date"
                />
                <span>-</span>
                <EditableField
                  value={edu.endDate}
                  onChange={(value) => updateArrayItem('education', edu.id, { endDate: value })}
                  className="p-1 text-right"
                  placeholder="End Date"
                />
              </div>
              <EditableField
                value={edu.location}
                onChange={(value) => updateArrayItem('education', edu.id, { location: value })}
                className="text-sm text-gray-600 p-1 text-right"
                placeholder="Location"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EditableResume = () => (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-blue-600">
        <EditableField
          value={resumeData.personalInfo.fullName}
          onChange={(value) => updatePersonalInfo('fullName', value)}
          className="text-3xl font-bold text-gray-800 mb-2 block w-full text-center p-2"
          placeholder="Your Full Name"
        />
        
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 flex-wrap mb-2">
          <EditableField
            value={resumeData.personalInfo.email}
            onChange={(value) => updatePersonalInfo('email', value)}
            className="p-1"
            placeholder="email@example.com"
            type="email"
          />
          <span>•</span>
          <EditableField
            value={resumeData.personalInfo.phone}
            onChange={(value) => updatePersonalInfo('phone', value)}
            className="p-1"
            placeholder="Phone Number"
          />
          <span>•</span>
          <EditableField
            value={resumeData.personalInfo.location}
            onChange={(value) => updatePersonalInfo('location', value)}
            className="p-1"
            placeholder="Location"
          />
        </div>
        
        <div className="flex justify-center items-center gap-4 text-sm text-blue-600 flex-wrap">
          <EditableField
            value={resumeData.personalInfo.linkedin}
            onChange={(value) => updatePersonalInfo('linkedin', value)}
            className="p-1"
            placeholder="LinkedIn Profile"
          />
          <span>•</span>
          <EditableField
            value={resumeData.personalInfo.website}
            onChange={(value) => updatePersonalInfo('website', value)}
            className="p-1"
            placeholder="Website"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Professional Summary</h2>
        <EditableField
          value={resumeData.summary}
          onChange={(value) => updateResumeData('summary', value)}
          className="text-gray-700 leading-relaxed w-full p-2"
          placeholder="Write a brief summary about your professional background..."
          multiline={true}
        />
      </div>

      {/* Experience */}
      <div className="mb-6">
        <EditableExperience />
      </div>

      {/* Education */}
      <div className="mb-6">
        <EditableEducation />
      </div>

      {/* Skills */}
      <div className="mb-6">
        <EditableSkills />
      </div>

      {/* Languages */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Languages</h2>
        <div className="grid grid-cols-2 gap-2">
          {resumeData.languages.map((lang) => (
            <div key={lang.id} className="flex justify-between group/lang relative">
              <EditableField
                value={lang.name}
                onChange={(value) => updateArrayItem('languages', lang.id, { name: value })}
                className="text-gray-800 p-1 flex-1"
                placeholder="Language"
              />
              <EditableField
                value={lang.level}
                onChange={(value) => updateArrayItem('languages', lang.id, { level: value })}
                className="text-gray-600 text-sm p-1"
                placeholder="Level"
              />
              <button
                onClick={() => removeArrayItem('languages', lang.id)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover/lang:opacity-100 transition-opacity"
              >
                <X size={8} className="mx-auto" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const StaticResumePreview = () => (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-blue-600">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{resumeData.personalInfo.fullName}</h1>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 flex-wrap">
          <span>{resumeData.personalInfo.email}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.phone}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.location}</span>
        </div>
        {(resumeData.personalInfo.linkedin || resumeData.personalInfo.website) && (
          <div className="flex justify-center items-center gap-4 text-sm text-blue-600 mt-2 flex-wrap">
            {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
            {resumeData.personalInfo.linkedin && resumeData.personalInfo.website && <span>•</span>}
            {resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Work Experience</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{exp.jobTitle}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{exp.startDate} - {exp.endDate}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              {exp.description && (
                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Education</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                  <p className="text-blue-600">{edu.school}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{edu.startDate} - {edu.endDate}</p>
                  <p>{edu.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resumeData.languages.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-300">Languages</h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <span className="text-gray-800">{lang.name}</span>
                <span className="text-gray-600 text-sm">{lang.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <div className="text-sm text-gray-500">
                Click anywhere on the resume to edit directly
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isPreviewMode 
                    ? 'bg-gray-200 text-gray-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Eye size={16} />
                {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreviewMode ? <StaticResumePreview /> : <EditableResume />}
        
        {!isPreviewMode && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How to Edit:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click on any text to edit it directly</li>
              <li>• <strong>Auto-saves as you type</strong> - no need to click save buttons!</li>
              <li>• Press Enter to finish editing single-line fields</li>
              <li>• Click outside or press Escape to cancel changes</li>
              <li>• Hover over sections to see "Add" buttons</li>
              <li>• Hover over items to see delete buttons</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;