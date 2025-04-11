import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import FormSection from "./FormSection";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "radio"
  | "select"
  | "date"
  | "email"
  | "password"
  | "file"
  | "hidden"
  | "captcha"
  | "range"
  | "url"
  | "search"
  | "autocomplete"
  | "grid"
  | "selectableGrid";

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  rows?: number;
  cols?: number;
  accept?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  defaultValue?: any;
  helperText?: string;
  gridConfig?: any; // Configuration for nested grid
  selectableGridConfig?: any; // Configuration for selectable grid
}

export interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface DynamicFormProps {
  sections: SectionConfig[];
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  validationSchema?: z.ZodType<any>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  sections,
  onSubmit,
  defaultValues = {},
  validationSchema,
}) => {
  const [formSections, setFormSections] = useState<SectionConfig[]>(sections);

  // Create form methods with optional schema validation
  const formMethods = useForm({
    defaultValues,
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
  });

  const handleSubmit = formMethods.handleSubmit((data) => {
    onSubmit(data);
  });

  const handleReset = () => {
    formMethods.reset(defaultValues);
  };

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const draggedSection = formSections[dragIndex];
    const newSections = [...formSections];
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, draggedSection);
    setFormSections(newSections);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formSections.map((section, index) => (
            <FormSection
              key={section.id}
              section={section}
              index={index}
              moveSection={moveSection}
            />
          ))}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </FormProvider>
    </DndProvider>
  );
};

export default DynamicForm;
