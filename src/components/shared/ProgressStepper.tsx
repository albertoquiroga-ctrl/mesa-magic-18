import { motion } from 'framer-motion';

const steps = ['Pediste', 'Confirmado', 'En cocina', 'En camino'];

interface ProgressStepperProps {
  currentStep: number; // 0-3
}

export const ProgressStepper = ({ currentStep }: ProgressStepperProps) => {
  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => (
        <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full flex items-center">
            <div className="relative flex-1 h-1 rounded-full bg-muted overflow-hidden">
              {i <= currentStep && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  className="absolute inset-0 bg-success rounded-full"
                />
              )}
            </div>
          </div>
          <span
            className={`text-[9px] font-medium ${
              i <= currentStep ? 'text-success' : 'text-muted-foreground'
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};
