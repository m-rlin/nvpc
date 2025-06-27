import { cn } from "@/utils/helpers";
import { CheckIcon } from "@heroicons/react/16/solid";

export const ProgressBar = (props: {
  currentValue?: string;
  data: { name: string; value: string }[];
  onSelect: (value: string, index: number) => void;
}) => {
  return (
    <nav aria-label="Progress">
      <SelectableSteps {...props} />
    </nav>
  );
};

export const SelectableSteps = ({
  className,
  currentValue,
  showName,
  data,
  onSelect,
}: {
  className?: string;
  currentValue?: string;
  showName?: boolean;
  data: { name: string; value: string }[];
  onSelect: (value: string, index: number) => void;
}) => {
  const activeIndex = data.findIndex((step) => step.value === currentValue);
  const currentStepIndex = activeIndex !== -1 ? activeIndex : 0;

  const steps = data.map((step, index) => ({
    ...step,
    status:
      index < currentStepIndex
        ? "complete"
        : index === currentStepIndex
          ? "current"
          : "upcoming",
  }));

  return (
    <ol role="list" className={cn("flex items-center", className)}>
      {steps.map((step, stepIdx) => (
        <li
          key={step.name}
          className="relative"
          style={
            stepIdx !== steps.length - 1
              ? { width: `${100 / (data.length - 1)}%` }
              : {}
          }
        >
          {step.status === "complete" ? (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="h-0.5 w-full bg-blue-600" />
              </div>
              <div
                onClick={() => onSelect(step.value, stepIdx)}
                className="relative flex size-6 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-900"
              >
                <CheckIcon aria-hidden="true" className="size-4 text-white" />
                <span className="sr-only">{step.name}</span>
              </div>
              {showName && (
                <div className="absolute ms-3 -translate-x-1/2 transform p-1">
                  {step.name}
                </div>
              )}
            </>
          ) : step.status === "current" ? (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
              <div
                onClick={() => onSelect(step.value, stepIdx)}
                aria-current="step"
                className="relative flex size-6 items-center justify-center rounded-full border-2 border-blue-600 bg-white"
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-blue-600"
                />
                <span className="sr-only">{step.name}</span>
              </div>
              {showName && (
                <div className="absolute ms-3 -translate-x-1/2 transform p-1">
                  {step.name}
                </div>
              )}
            </>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="h-0.5 w-full bg-gray-200" />
              </div>
              <div
                onClick={() => onSelect(step.value, stepIdx)}
                className="group relative flex size-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                />
                <span className="sr-only">{step.name}</span>
              </div>
              {showName && (
                <div className="absolute ms-3 -translate-x-1/2 transform p-1">
                  {step.name}
                </div>
              )}
            </>
          )}
        </li>
      ))}
    </ol>
  );
};
