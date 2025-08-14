
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { X, Divide, Plus, Minus, Percent, Delete } from 'lucide-react';

export function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [utilizationRate, setUtilizationRate] = useState<number | null>(null);
  const [showUppLabel, setShowUppLabel] = useState(false);
  const { toast } = useToast();

  const inputDigit = (digit: string) => {
    if (displayValue.length >= 15 && !shouldResetDisplay) return;
    if (shouldResetDisplay) {
      setDisplayValue(digit);
      setShouldResetDisplay(false);
      setShowUppLabel(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (shouldResetDisplay) {
      setDisplayValue('0.');
      setShouldResetDisplay(false);
      setShowUppLabel(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setShouldResetDisplay(false);
    setUtilizationRate(null);
    setShowUppLabel(false);
  };
  
  const backspace = () => {
    if (shouldResetDisplay) {
        clearAll();
        return;
    }
    setDisplayValue(displayValue.slice(0, -1) || '0');
  }

  const handleOperator = (nextOperator: string) => {
     if (nextOperator !== 'x') {
      toast({
        variant: "destructive",
        title: "Unsupported Operation",
        description: "Only multiplication 'x' is supported for this calculator.",
      });
      return;
    }
    
    const currentValue = parseFloat(displayValue);
    if (operator && !shouldResetDisplay && firstOperand !== null) {
      const first = parseFloat(firstOperand);
      const result = calculate(first, currentValue);
      setFirstOperand(String(result));
      setDisplayValue(String(result));
      setShowUppLabel(true);
    } else {
        setFirstOperand(displayValue);
    }
    
    setOperator(nextOperator);
    setShouldResetDisplay(true);
  };

  const calculate = (bd1: number, bd2: number): number => {
    const constantPart = 236.5; // 246.2 - 5 * 2 + 0.3
    const term1 = Math.floor(constantPart / (bd1 + 0.3));
    const term2 = Math.floor(constantPart / (bd2 + 0.3));
    return term1 * term2 * 4;
  };

  const calculateUtilization = (num1: number, num2: number, calcResult: number): number => {
    const denominator = 515 * 510;
    if (denominator === 0) return 0;
    const rate = (num1 * num2 * calcResult) / denominator;
    return rate * 100;
  }

  const handleEquals = () => {
    if (operator === null || firstOperand === null) {
      return;
    }

    const first = parseFloat(firstOperand);
    const second = parseFloat(displayValue);

    if (isNaN(first) || isNaN(second)) {
      setDisplayValue('Error');
      setUtilizationRate(null);
      setShouldResetDisplay(true);
      setShowUppLabel(false);
      return;
    }
    
    if (operator === 'x') {
        const result = calculate(first, second);
        setDisplayValue(String(result));
        const utilization = calculateUtilization(first, second, result);
        setUtilizationRate(utilization);
        setShowUppLabel(true);
    } else {
        setDisplayValue('Error');
        setUtilizationRate(null);
        setShowUppLabel(false);
    }

    setFirstOperand(null);
    setOperator(null);
    setShouldResetDisplay(true);
  };
  
  const getButtonClass = (variant?: 'default' | 'secondary' | 'accent' | 'primary') => {
      return cn(
        'text-3xl sm:text-4xl h-full aspect-square rounded-xl shadow-md active:shadow-inner font-light',
        {
          'bg-secondary hover:bg-muted text-secondary-foreground': variant === 'secondary',
          'bg-accent hover:bg-accent/90 text-blue-400': variant === 'accent',
          'bg-primary hover:bg-primary/90 text-primary-foreground': variant === 'primary'
        }
      );
  }

  return (
    <div className="bg-background w-full max-w-sm mx-auto h-full flex flex-col justify-end p-4">
      <div className="flex-1 flex flex-col justify-end items-end text-right mb-4 overflow-hidden">
        
        <div className="text-muted-foreground text-2xl h-8 truncate w-full text-right">
            {utilizationRate !== null ? `排版利用率: ${utilizationRate.toFixed(2)}%` : ''}
        </div>
        <div className="text-foreground text-7xl sm:text-8xl font-medium break-all flex items-end justify-end min-h-[96px] w-full">
            {showUppLabel && <span className="text-2xl mr-2 text-muted-foreground mb-2">UPP</span>}
            <span className="truncate">{displayValue}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-5 gap-3">
          <Button onClick={clearAll} className={getButtonClass('accent')}>C</Button>
          <Button onClick={() => handleOperator('÷')} className={getButtonClass('accent')}><Divide size={32} /></Button>
          <Button onClick={() => handleOperator('x')} className={cn(getButtonClass('accent'), 'flex flex-col items-center justify-center p-2 text-xl leading-none')}>
            <span className="text-2xl">x</span>
            <span className="text-xs mt-1 font-sans">排版计算</span>
          </Button>
          <Button onClick={backspace} className={getButtonClass('accent')}><Delete size={32} /></Button>
          
          <Button onClick={() => inputDigit('7')} className={getButtonClass('secondary')}>7</Button>
          <Button onClick={() => inputDigit('8')} className={getButtonClass('secondary')}>8</Button>
          <Button onClick={() => inputDigit('9')} className={getButtonClass('secondary')}>9</Button>
          <Button onClick={() => handleOperator('-')} className={getButtonClass('accent')}><Minus size={32}/></Button>
          
          <Button onClick={() => inputDigit('4')} className={getButtonClass('secondary')}>4</Button>
          <Button onClick={() => inputDigit('5')} className={getButtonClass('secondary')}>5</Button>
          <Button onClick={() => inputDigit('6')} className={getButtonClass('secondary')}>6</Button>
          <Button onClick={() => handleOperator('+')} className={getButtonClass('accent')}><Plus size={32} /></Button>
          
          <Button onClick={() => inputDigit('1')} className={getButtonClass('secondary')}>1</Button>
          <Button onClick={() => inputDigit('2')} className={getButtonClass('secondary')}>2</Button>
          <Button onClick={() => inputDigit('3')} className={getButtonClass('secondary')}>3</Button>
          <Button onClick={handleEquals} className={cn(getButtonClass('primary'), 'row-span-2 aspect-auto')}>=</Button>

          <Button onClick={() => handleOperator('%')} className={getButtonClass('secondary')}><Percent size={32} /></Button>
          <Button onClick={() => inputDigit('0')} className={getButtonClass('secondary')}>0</Button>
          <Button onClick={inputDecimal} className={getButtonClass('secondary')}>.</Button>
      </div>
    </div>
  );
}
