import { useState, useCallback } from 'react';
import { DreamInput } from '@/types/Dream';

export interface FormData {
  title: string;
  content: string;
  tags: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: {
    title?: string;
    content?: string;
    tags?: string;
  };
}

export interface UseRecordFormReturn {
  formData: FormData;
  validation: FormValidation;
  isSubmitting: boolean;
  updateField: (field: keyof FormData, value: string) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  extractTags: (tagString: string) => string[];
  toDreamInput: () => DreamInput;
}

const initialFormData: FormData = {
  title: '',
  content: '',
  tags: '',
};

const initialValidation: FormValidation = {
  isValid: false,
  errors: {},
};

export const useRecordForm = (): UseRecordFormReturn => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [validation, setValidation] = useState<FormValidation>(initialValidation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractTags = useCallback((tagString: string): string[] => {
    const matches = tagString.match(/#\w+/g);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: FormValidation['errors'] = {};
    
    if (!formData.title.trim() && !formData.content.trim()) {
      errors.title = 'Either title or content is required';
      errors.content = 'Either title or content is required';
    }
    
    if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.content.length > 2000) {
      errors.content = 'Content must be less than 2000 characters';
    }

    const isValid = Object.keys(errors).length === 0;
    
    setValidation({ isValid, errors });
    return isValid;
  }, [formData]);

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when user starts typing
    if (validation.errors[field]) {
      setValidation(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: undefined },
      }));
    }
  }, [validation.errors]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidation(initialValidation);
    setIsSubmitting(false);
  }, []);

  const toDreamInput = useCallback((): DreamInput => {
    return {
      title: formData.title.trim() || 'Untitled Dream',
      content: formData.content.trim(),
      tags: extractTags(formData.tags),
    };
  }, [formData, extractTags]);

  return {
    formData,
    validation,
    isSubmitting,
    updateField,
    resetForm,
    validateForm,
    extractTags,
    toDreamInput,
  };
};