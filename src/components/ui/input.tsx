import { forwardRef } from "react";
import { SystemInput, SystemTextarea, type SystemInputProps } from "@/components/system/system-input";

const Input = forwardRef<HTMLInputElement, SystemInputProps>((props, ref) => (
  <SystemInput ref={ref} {...props} />
));
Input.displayName = "Input";

export { Input, SystemTextarea };
