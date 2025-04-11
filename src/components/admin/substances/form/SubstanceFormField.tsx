
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface SubstanceFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: 'text' | 'textarea' | 'checkbox';
  required?: boolean;
}

export const SubstanceFormField: React.FC<SubstanceFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  type = 'text',
  required = false,
}) => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={type === 'checkbox' ? "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4" : ""}>
          {type === 'checkbox' ? (
            <>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {label}{required && "*"}
                </FormLabel>
                {description && <FormDescription>{description}</FormDescription>}
              </div>
            </>
          ) : (
            <>
              <FormLabel>{label}{required && "*"}</FormLabel>
              <FormControl>
                {type === 'textarea' ? (
                  <Textarea 
                    placeholder={placeholder} 
                    className={type === 'textarea' ? "min-h-[120px]" : ""} 
                    {...field} 
                  />
                ) : (
                  <Input placeholder={placeholder} {...field} />
                )}
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </>
          )}
        </FormItem>
      )}
    />
  );
};
