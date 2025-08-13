
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const { toast } = useToast();

  const inputDigit = (digit: string) => {
    if (displayValue.length >= 15 && !shouldResetDisplay) return;
    if (shouldResetDisplay) {
      setDisplayValue(digit);
      setShouldResetDisplay(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (shouldResetDisplay) {
      setDisplayValue('0.');
      setShouldResetDisplay(false);
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
  };

  const handleOperator = (nextOperator: string) => {
    if (nextOperator !== 'x') {
      toast({
        variant: "destructive",
        title: "Unsupported Operation",
        description: "Only multiplication 'x' is supported for this calculator.",
      });
      return;
    }
    
    if (operator && !shouldResetDisplay) {
        handleEquals()
        setFirstOperand(displayValue);
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

  const handleEquals = () => {
    if (operator === null || firstOperand === null) {
      return;
    }

    const first = parseFloat(firstOperand);
    const second = parseFloat(displayValue);

    if (isNaN(first) || isNaN(second)) {
      setDisplayValue('Error');
      setShouldResetDisplay(true);
      return;
    }
    
    if (operator === 'x') {
        const result = calculate(first, second);
        setDisplayValue(String(result));
    } else {
        setDisplayValue('Error');
    }

    setFirstOperand(null);
    setOperator(null);
    setShouldResetDisplay(true);
  };

  const calculatorButtons = [
    { label: 'AC', handler: clearAll, variant: 'secondary' as const },
    { label: '+', handler: () => handleOperator('+'), variant: 'accent' as const },
    { label: '-', handler: () => handleOperator('-'), variant: 'accent' as const },
    { label: 'x', handler: () => handleOperator('x'), variant: 'accent' as const },
    { label: '7', handler: () => inputDigit('7'), variant: 'secondary' as const },
    { label: '8', handler: () => inputDigit('8'), variant: 'secondary' as const },
    { label: '9', handler: () => inputDigit('9'), variant: 'secondary' as const },
    { label: '÷', handler: () => handleOperator('÷'), variant: 'accent' as const },
    { label: '4', handler: () => inputDigit('4'), variant: 'secondary' as const },
    { label: '5', handler: () => inputDigit('5'), variant: 'secondary' as const },
    { label: '6', handler: () => inputDigit('6'), variant: 'secondary' as const },
    { label: '=', handler: handleEquals, variant: 'primary' as const, className: 'row-span-2' },
    { label: '1', handler: () => inputDigit('1'), variant: 'secondary' as const },
    { label: '2', handler: () => inputDigit('2'), variant: 'secondary' as const },
    { label: '3', handler: () => inputDigit('3'), variant: 'secondary' as const },
    { label: '0', handler: () => inputDigit('0'), className: 'col-span-2', variant: 'secondary' as const },
    { label: '.', handler: inputDecimal, variant: 'secondary' as const },
  ];

  const gridTemplate = [
    ['AC', '+', '-', 'x'],
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '='],
    ['1', '2', '3', '='],
    ['0', '0', '.', '='],
  ];

  return (
    <Card className="w-full max-w-xs sm:max-w-sm mx-auto shadow-2xl border-none rounded-2xl bg-card p-2">
      <CardContent className="p-2">
        <div className="bg-background rounded-lg p-4 mb-4 text-right overflow-hidden text-ellipsis">
          <div className="text-muted-foreground text-2xl h-8 truncate text-right">
            {firstOperand || ''} {operator || ''}
          </div>
          <div className="text-foreground text-6xl font-bold h-16 break-all flex items-center justify-end">
            {displayValue}
          </div>
        </div>
        <div className="grid grid-cols-4 grid-rows-5 gap-2">
          {calculatorButtons.map(({ label, handler, className, variant }) => (
             <Button
                key={label}
                onClick={handler}
                variant={variant}
                className={cn(
                  'text-2xl h-full aspect-square rounded-xl shadow-md active:shadow-inner',
                  label === '0' && 'col-span-2 aspect-auto',
                  label === '=' && 'row-span-2',
                  className
                )}
                style={{ gridColumn: label === '0' ? 'span 2' : '', gridRow: label === '=' ? 'span 2' : '' }}
              >
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
