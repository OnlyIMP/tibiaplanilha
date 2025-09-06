import React, { useState, useEffect, useRef } from 'react';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const PriceInput: React.FC<PriceInputProps> = ({ value, onChange, className }) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  // Atualizar valor local quando o valor prop mudar (mas só se não estiver focado)
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setLocalValue(value.toString());
    }
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Cancelar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce - aguardar 500ms antes de atualizar o estado pai
    timeoutRef.current = setTimeout(() => {
      const numValue = parseInt(newValue) || 0;
      onChange(numValue);
    }, 500);
  };
  
  const handleBlur = () => {
    // Ao perder o foco, atualizar imediatamente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const numValue = parseInt(localValue) || 0;
    onChange(numValue);
    setLocalValue(numValue.toString());
  };
  
  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <input
      ref={inputRef}
      type="number"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
};

export default PriceInput;