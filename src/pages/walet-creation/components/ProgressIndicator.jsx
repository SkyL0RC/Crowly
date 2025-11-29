import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="glass-card mb-8">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => (
          <React.Fragment key={step?.id}>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-accent border-accent'
                    : index === currentStep
                    ? 'bg-accent bg-opacity-20 border-accent' :'bg-surface border-border'
                }`}
              >
                {index < currentStep ? (
                  <Icon name="Check" size={20} color="var(--color-background)" />
                ) : (
                  <span
                    className={`text-sm font-semibold ${
                      index === currentStep ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-medium ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step?.label}
                </p>
              </div>
            </div>

            {index < steps?.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-8">
                <div
                  className={`h-full transition-all duration-300 ${
                    index < currentStep ? 'bg-accent' : 'bg-border'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;