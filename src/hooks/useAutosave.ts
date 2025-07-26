import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AutosaveData {
  title: string;
  content: string;
  lastSaved: string;
}

export const useAutosave = (
  title: string,
  content: string,
  interval: number = 10000 // 10 seconds
) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Track if content has changed
  useEffect(() => {
    if (title || content) {
      setIsDirty(true);
    }
  }, [title, content]);

  // Autosave functionality
  useEffect(() => {
    if (!isDirty || (!title.trim() && !content.trim())) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      const autosaveData: AutosaveData = {
        title: title || 'Untitled Draft',
        content,
        lastSaved: new Date().toISOString()
      };

      try {
        localStorage.setItem('autosave-draft', JSON.stringify(autosaveData));
        setLastSaved(new Date());
        setIsDirty(false);
        
        // Show subtle autosave notification
        toast({
          title: "Draft auto-saved",
          description: "Your work has been saved locally",
          duration: 2000,
        });
      } catch (error) {
        console.error('Failed to autosave:', error);
      }
    }, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, content, isDirty, interval, toast]);

  // Recovery function
  const recoverAutosave = (): AutosaveData | null => {
    try {
      const saved = localStorage.getItem('autosave-draft');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to recover autosave:', error);
    }
    return null;
  };

  // Clear autosave
  const clearAutosave = () => {
    localStorage.removeItem('autosave-draft');
    setLastSaved(null);
    setIsDirty(false);
  };

  // Force save
  const forceSave = () => {
    if (title || content) {
      const autosaveData: AutosaveData = {
        title: title || 'Untitled Draft',
        content,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem('autosave-draft', JSON.stringify(autosaveData));
      setLastSaved(new Date());
      setIsDirty(false);
    }
  };

  return {
    lastSaved,
    isDirty,
    recoverAutosave,
    clearAutosave,
    forceSave
  };
};