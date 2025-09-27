/**
 * Client Communication Setup - How customers provide their communication preferences
 * This is embedded in the customer onboarding process or available as a self-service portal
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Switch } from '../ui/switch'
import { Alert } from '../ui/alert'

interface CommunicationPreferences {
  email?: string
  phone?: string
  whatsappNumber?: string
  emailOptIn?: boolean
  whatsappOptIn?: boolean
  smsOptIn?: boolean
  language?: string
  timezone?: string
  preferredLanguage?: string
  paymentReminders?: string
  reminderFrequency?: string
  quietHours?: { start: string; end: string }
  invoiceDelivery?: string
  complianceReminders?: string
}

interface ClientCommunicationSetupProps {
  customerId: string
  customerName: string
  currentPreferences?: CommunicationPreferences
  onComplete?: () => void
}

export default function ClientCommunicationSetup({
  customerId,
  customerName,
  currentPreferences,
  onComplete
}: ClientCommunicationSetupProps) {
  const [step, setStep] = useState(1)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: currentPreferences?.email || '',
      phone: currentPreferences?.phone || '',
      whatsappNumber: currentPreferences?.whatsappNumber || '',
      emailOptIn: currentPreferences?.emailOptIn || false,
      whatsappOptIn: currentPreferences?.whatsappOptIn || false,
      language: currentPreferences?.language || 'en',
      timezone: currentPreferences?.timezone || 'Asia/Kolkata',

      // Delivery preferences
      invoiceDelivery: currentPreferences?.invoiceDelivery || 'EMAIL',
      complianceReminders: currentPreferences?.complianceReminders || 'EMAIL',
      paymentReminders: currentPreferences?.paymentReminders || 'EMAIL',

      // Frequency preferences
      reminderFrequency: currentPreferences?.reminderFrequency || 'WEEKLY',
      quietHours: currentPreferences?.quietHours || { start: '22:00', end: '09:00' }
    }
  })

  // TODO: Implement when communication API is ready
  const updatePreferences = {
    mutate: (_data: { customerId: string; preferences: CommunicationPreferences }) => {
      // Simulate API call
      setTimeout(() => {
        setStep(4) // Success step
        onComplete?.()
      }, 1500)
    },
    isLoading: false,
    error: null
  }

  const emailOptIn = watch('emailOptIn')
  const whatsappOptIn = watch('whatsappOptIn')

  const onSubmit = (data: CommunicationPreferences) => {
    updatePreferences.mutate({
      customerId,
      preferences: data
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Communication Preferences
        </h2>
        <p className="text-gray-600 mt-2">
          Hi {customerName}, let us know how you&apos;d like to receive updates from us.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-sm text-gray-600">
            Step {step} of 3
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Contact Information */}
        {step === 1 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Your Contact Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <Input
                  {...register('email', {
                    required: 'Email is required for invoices and important updates',
                    pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' }
                  })}
                  type="email"
                  placeholder="your.email@company.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.email.message) || 'Email is required'}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Required for invoices and compliance notices
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <Input
                  {...register('phone', {
                    required: 'Phone number is required for urgent communications'
                  })}
                  type="tel"
                  placeholder="+91 9876543210"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.phone.message) || 'Phone number is invalid'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  WhatsApp Number (Optional)
                </label>
                <Input
                  {...register('whatsappNumber')}
                  type="tel"
                  placeholder="+91 9876543210"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Same as phone number? Leave blank if yes
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="button" onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Communication Preferences */}
        {step === 2 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">How would you like to hear from us?</h3>

            <div className="space-y-6">
              {/* Email Opt-in */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">📧 Email Notifications</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive invoices, compliance reminders, and important updates via email
                    </p>
                    <ul className="text-xs text-gray-500 mt-2 list-disc list-inside">
                      <li>Monthly invoices and receipts</li>
                      <li>Compliance deadline reminders (7 days before)</li>
                      <li>Payment confirmations</li>
                      <li>Important regulatory updates</li>
                    </ul>
                  </div>
                  <Switch
                    checked={emailOptIn}
                    onCheckedChange={(checked) => setValue('emailOptIn', checked)}
                  />
                </div>
              </div>

              {/* WhatsApp Opt-in */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">💬 WhatsApp Messages</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Get instant notifications and quick updates on WhatsApp
                    </p>
                    <ul className="text-xs text-gray-500 mt-2 list-disc list-inside">
                      <li>Urgent compliance alerts</li>
                      <li>Payment reminders</li>
                      <li>Quick status updates</li>
                      <li>Document submission confirmations</li>
                    </ul>

                    <Alert className="mt-3 bg-blue-50 border-blue-200">
                      <p className="text-xs text-blue-800">
                        <strong>Privacy:</strong> We only send business-related messages.
                        You can opt-out anytime by replying &quot;STOP&quot;
                      </p>
                    </Alert>
                  </div>
                  <Switch
                    checked={whatsappOptIn}
                    onCheckedChange={(checked) => setValue('whatsappOptIn', checked)}
                  />
                </div>
              </div>

              {/* Delivery Preferences */}
              {(emailOptIn || whatsappOptIn) && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Delivery Preferences</h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {emailOptIn && whatsappOptIn && (
                      <>
                        <div className="flex justify-between items-center">
                          <span>Invoice delivery:</span>
                          <select {...register('invoiceDelivery')} className="border rounded px-2 py-1">
                            <option value="EMAIL">Email</option>
                            <option value="WHATSAPP">WhatsApp</option>
                            <option value="BOTH">Both</option>
                          </select>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Compliance reminders:</span>
                          <select {...register('complianceReminders')} className="border rounded px-2 py-1">
                            <option value="EMAIL">Email</option>
                            <option value="WHATSAPP">WhatsApp</option>
                            <option value="BOTH">Both</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center">
                      <span>Reminder frequency:</span>
                      <select {...register('reminderFrequency')} className="border rounded px-2 py-1">
                        <option value="WEEKLY">Weekly</option>
                        <option value="BI_WEEKLY">Bi-weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* No opt-ins warning */}
              {!emailOptIn && !whatsappOptIn && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <div>
                    <h4 className="font-medium text-yellow-800">⚠️ Limited Communication</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Without email or WhatsApp enabled, we can only contact you by phone
                      for urgent matters. You may miss important deadlines.
                    </p>
                  </div>
                </Alert>
              )}
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Review Your Preferences</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="text-sm space-y-1">
                  <div>Email: <span className="font-medium">{watch('email')}</span></div>
                  <div>Phone: <span className="font-medium">{watch('phone')}</span></div>
                  {watch('whatsappNumber') && (
                    <div>WhatsApp: <span className="font-medium">{watch('whatsappNumber')}</span></div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Communication Preferences</h4>
                <div className="text-sm space-y-1">
                  <div>Email notifications:
                    <span className={`font-medium ml-1 ${emailOptIn ? 'text-green-600' : 'text-gray-500'}`}>
                      {emailOptIn ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div>WhatsApp messages:
                    <span className={`font-medium ml-1 ${whatsappOptIn ? 'text-green-600' : 'text-gray-500'}`}>
                      {whatsappOptIn ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div>Reminder frequency:
                    <span className="font-medium ml-1">{watch('reminderFrequency').toLowerCase()}</span>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <div>
                  <h4 className="font-medium text-blue-800">📋 What happens next?</h4>
                  <ul className="text-blue-700 text-sm mt-1 list-disc list-inside space-y-1">
                    <li>Your preferences are saved securely</li>
                    <li>You&apos;ll start receiving communications as configured</li>
                    <li>You can update these settings anytime</li>
                    <li>We&apos;ll never share your contact information</li>
                  </ul>
                </div>
              </Alert>
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                type="submit"
                disabled={updatePreferences.isLoading}
              >
                {updatePreferences.isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <Card className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-green-800 mb-2">
              ✅ Preferences Saved Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your communication preferences have been updated. You&apos;ll start receiving
              notifications according to your settings.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">Need to make changes?</h4>
              <p className="text-sm text-gray-600">
                You can update your preferences anytime by:
              </p>
              <ul className="text-sm text-gray-600 mt-1 list-disc list-inside">
                <li>Calling our office directly</li>
                <li>Emailing us your updated preferences</li>
                <li>Using the self-service portal (if available)</li>
              </ul>
            </div>

            <Button className="mt-6" onClick={onComplete}>
              Done
            </Button>
          </Card>
        )}
      </form>
    </div>
  )
}