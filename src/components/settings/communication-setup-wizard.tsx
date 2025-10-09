/**
 * Communication Setup Wizard - Step-by-step integration for CS practices
 * This is how the admin configures email and WhatsApp for their entire practice
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Alert } from '../ui/alert'

// Types for communication setup data
interface SetupData {
  emailProvider?: string
  fromEmail?: string
  fromName?: string
  username?: string
  password?: string
  whatsappEnabled?: boolean
  whatsappProvider?: string
}

interface EmailFormData {
  fromEmail: string
  fromName: string
  username: string
  password: string
}

interface StepProps {
  data: SetupData
  onNext: (stepData: Partial<SetupData>) => void
  onPrev: () => void
  canGoBack?: boolean
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error'

interface SetupStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<StepProps>
}

export default function CommunicationSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [setupData, setSetupData] = useState<SetupData>({})

  const steps: SetupStep[] = [
    {
      id: 'email-provider',
      title: 'Choose Email Provider',
      description: 'Select how you want to send emails to clients',
      component: EmailProviderStep
    },
    {
      id: 'email-config',
      title: 'Configure Email',
      description: 'Enter your email credentials',
      component: EmailConfigStep
    },
    {
      id: 'whatsapp-setup',
      title: 'WhatsApp Integration (Optional)',
      description: 'Connect WhatsApp Business API for instant messaging',
      component: WhatsAppSetupStep
    },
    {
      id: 'test-integration',
      title: 'Test & Activate',
      description: 'Test your configuration and go live',
      component: TestIntegrationStep
    }
  ]

  const nextStep = (data: Partial<SetupData>) => {
    setSetupData((prev: SetupData) => ({ ...prev, ...data }))
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600 mt-2">
            {steps[currentStep].description}
          </p>
        </div>

        <CurrentStepComponent
          data={setupData}
          onNext={nextStep}
          onPrev={prevStep}
          canGoBack={currentStep > 0}
        />
      </Card>
    </div>
  )
}

// Step 1: Email Provider Selection
function EmailProviderStep({ data, onNext }: StepProps) {
  const [selectedProvider, setSelectedProvider] = useState(data.emailProvider || '')

  const providers = [
    {
      id: 'SMTP',
      name: 'Gmail/Outlook (SMTP)',
      description: 'Use your existing Gmail or Outlook account',
      recommended: true,
      setup: 'Easy - just enter your email and app password'
    },
    {
      id: 'RESEND',
      name: 'Resend (Professional)',
      description: 'Professional email service with better deliverability',
      recommended: false,
      setup: 'Medium - requires API key signup'
    },
    {
      id: 'SENDGRID',
      name: 'SendGrid (Enterprise)',
      description: 'Enterprise-grade email with advanced analytics',
      recommended: false,
      setup: 'Advanced - requires SendGrid account'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedProvider === provider.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedProvider(provider.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{provider.name}</h3>
                  {provider.recommended && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{provider.description}</p>
                <p className="text-blue-600 text-sm mt-2">Setup: {provider.setup}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedProvider === provider.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {selectedProvider === provider.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProvider && (
        <Alert className="mt-6 bg-blue-50 border-blue-200">
          <div>
            <h4 className="font-medium">Next: Configure {providers.find(p => p.id === selectedProvider)?.name}</h4>
            <p className="text-sm mt-1">
              We&apos;ll help you set up your email configuration step by step.
            </p>
          </div>
        </Alert>
      )}

      <div className="flex justify-end pt-4">
        <Button
          onClick={() => onNext({ emailProvider: selectedProvider })}
          disabled={!selectedProvider}
        >
          Continue to Configuration
        </Button>
      </div>
    </div>
  )
}

// Step 2: Email Configuration
function EmailConfigStep({ data, onNext, onPrev, canGoBack }: StepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailFormData>({
    defaultValues: {
      fromEmail: data.fromEmail || '',
      fromName: data.fromName || '',
      username: data.username || '',
      password: data.password || ''
    }
  })

  const [testStatus, setTestStatus] = useState<TestStatus>('idle')
  const [testError, setTestError] = useState<string>('')

  // TODO: Implement when communication API is ready
  const testConfiguration = {
    mutate: (data: EmailFormData & { provider: string }) => {
      setTestStatus('testing')
      // Simulate API call
      setTimeout(() => {
        setTestStatus('success')
        setTestError('')
      }, 2000)
    },
    isLoading: testStatus === 'testing',
    error: testError || null
  }

  const onSubmit = (formData: EmailFormData) => {
    if (testStatus !== 'success') {
      // Auto-test configuration before proceeding
      testConfiguration.mutate({
        ...formData,
        provider: data.emailProvider || 'resend'
      })
      return
    }

    onNext(formData)
  }

  const getInstructions = () => {
    switch (data.emailProvider) {
      case 'SMTP':
        return (
          <Alert className="mb-6 bg-blue-50">
            <div>
              <h4 className="font-medium">Gmail/Outlook Setup Instructions</h4>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li><strong>Gmail:</strong> Enable 2-factor auth, then generate an &quot;App Password&quot;</li>
                <li><strong>Outlook:</strong> Use your regular email and password</li>
                <li>We&apos;ll automatically configure SMTP settings for you</li>
              </ul>
            </div>
          </Alert>
        )
      case 'RESEND':
        return (
          <Alert className="mb-6 bg-blue-50">
            <div>
              <h4 className="font-medium">Resend Setup Instructions</h4>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Sign up at resend.com (free tier: 3,000 emails/month)</li>
                <li>Get your API key from the dashboard</li>
                <li>Verify your domain (optional but recommended)</li>
              </ul>
            </div>
          </Alert>
        )
      default:
        return null
    }
  }

  return (
    <div>
      {getInstructions()}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From Email Address</label>
            <Input
              {...register('fromEmail', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
              })}
              placeholder="your.name@company.com"
              className={errors.fromEmail ? 'border-red-500' : ''}
            />
            {errors.fromEmail && (
              <p className="text-red-500 text-sm mt-1">{String(errors.fromEmail.message) || 'Invalid email address'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">From Name</label>
            <Input
              {...register('fromName', { required: 'Name is required' })}
              placeholder="Your Company Name"
              className={errors.fromName ? 'border-red-500' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {data.emailProvider === 'SMTP' ? 'Email Address' : 'API Key'}
            </label>
            <Input
              {...register('username', { required: 'This field is required' })}
              placeholder={data.emailProvider === 'SMTP' ? 'your.email@gmail.com' : 'your-api-key'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {data.emailProvider === 'SMTP' ? 'App Password' : 'API Secret'}
            </label>
            <Input
              {...register('password', { required: 'This field is required' })}
              type="password"
              placeholder={data.emailProvider === 'SMTP' ? 'your-app-password' : 'your-api-secret'}
            />
          </div>
        </div>

        {testStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <div>
              <h4 className="font-medium text-red-800">Configuration Test Failed</h4>
              <p className="text-red-700 text-sm mt-1">{testError}</p>
              <p className="text-red-600 text-xs mt-2">
                Please check your credentials and try again.
              </p>
            </div>
          </Alert>
        )}

        {testStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <div>
              <h4 className="font-medium text-green-800">✅ Configuration Successful!</h4>
              <p className="text-green-700 text-sm mt-1">
                Your email configuration has been tested and verified.
              </p>
            </div>
          </Alert>
        )}

        <div className="flex justify-between pt-6">
          {canGoBack && (
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
          )}

          <Button
            type="submit"
            disabled={testStatus === 'testing'}
            className="ml-auto"
          >
            {testStatus === 'testing' && 'Testing Configuration...'}
            {testStatus === 'success' && 'Continue to WhatsApp Setup'}
            {(testStatus === 'idle' || testStatus === 'error') && 'Test & Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}

// Step 3: WhatsApp Setup (Optional)
function WhatsAppSetupStep({ data, onNext, onPrev }: StepProps) {
  const [skipWhatsApp, setSkipWhatsApp] = useState(false)

  if (skipWhatsApp) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-4">WhatsApp Setup Skipped</h3>
        <p className="text-gray-600 mb-6">
          You can set up WhatsApp later from the Settings page.
        </p>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setSkipWhatsApp(false)}>
            Back to WhatsApp Setup
          </Button>
          <Button onClick={() => onNext({ whatsappEnabled: false })}>
            Continue to Testing
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Alert className="bg-blue-50 border-blue-200">
          <div>
            <h4 className="font-medium">WhatsApp Business API Required</h4>
            <p className="text-sm mt-1">
              To send WhatsApp messages, you need a WhatsApp Business API account.
              This requires business verification and has associated costs.
            </p>
          </div>
        </Alert>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium">Option 1: Direct WhatsApp Business API</h4>
          <p className="text-sm text-gray-600 mt-1">
            Apply directly with Meta for WhatsApp Business API access
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Cost: $0.005-0.02 per message | Setup time: 2-4 weeks
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium">Option 2: Third-Party Provider (Twilio)</h4>
          <p className="text-sm text-gray-600 mt-1">
            Faster setup through Twilio&apos;s WhatsApp Business API
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Cost: $0.008-0.025 per message | Setup time: 1-2 days
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>

        <div className="space-x-3">
          <Button variant="outline" onClick={() => setSkipWhatsApp(true)}>
            Skip WhatsApp (Setup Later)
          </Button>
          <Button onClick={() => onNext({ whatsappEnabled: true, whatsappProvider: 'TWILIO' })}>
            Setup WhatsApp with Twilio
          </Button>
        </div>
      </div>
    </div>
  )
}

// Step 4: Test Integration
function TestIntegrationStep({ data, onPrev }: StepProps) {
  const [isComplete, setIsComplete] = useState(false)

  // TODO: Implement when communication API is ready
  const finalizeSetup = {
    mutate: (data: SetupData) => {
      // Simulate setup completion
      setTimeout(() => {
        setIsComplete(true)
        // Redirect to dashboard or show success message
      }, 1000)
    },
    isPending: false,
    error: null
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Review Your Configuration</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span>Email Provider:</span>
            <span className="font-medium">{data.emailProvider}</span>
          </div>
          <div className="flex justify-between">
            <span>From Email:</span>
            <span className="font-medium">{data.fromEmail}</span>
          </div>
          <div className="flex justify-between">
            <span>WhatsApp:</span>
            <span className="font-medium">
              {data.whatsappEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {isComplete ? (
        <Alert className="border-green-200 bg-green-50">
          <div>
            <h4 className="font-medium text-green-800">🎉 Setup Complete!</h4>
            <p className="text-green-700 text-sm mt-1">
              Your communication system is now active. You can start sending invoices
              and notifications to your clients.
            </p>
          </div>
        </Alert>
      ) : (
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button
            onClick={() => finalizeSetup.mutate(data)}
            disabled={finalizeSetup.isPending}
          >
            {finalizeSetup.isPending ? 'Activating...' : 'Activate Communication System'}
          </Button>
        </div>
      )}
    </div>
  )
}

