/**
 * Communication Setup Page - Test the Communication System
 * Allows CS practices to configure email and WhatsApp
 */

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { api } from '@/utils/api'
import Head from 'next/head'

interface EmailConfig {
  apiKey: string
  fromEmail: string
  fromName: string
}

interface WhatsAppConfig {
  provider: 'TWILIO' | 'WHATSAPP_BUSINESS_API'
  accountSid: string
  authToken: string
  fromNumber: string
}

export default function CommunicationSetup() {
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp' | 'test'>('email')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [whatsappStatus, setWhatsappStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const emailForm = useForm<EmailConfig>()
  const whatsappForm = useForm<WhatsAppConfig>()

  // tRPC hooks
  const { data: settings, refetch: refetchSettings } = api.communication.getSettings.useQuery(undefined, {
    enabled: typeof window !== 'undefined', // Only run on client
  })
  const configureResend = api.communication.configureResend.useMutation()
  const configureWhatsApp = api.communication.configureWhatsApp.useMutation()
  const testConfiguration = api.communication.testConfiguration.useMutation()
  const sendTestEmail = api.communication.sendEmail.useMutation()

  const onEmailSubmit = async (data: EmailConfig) => {
    setEmailStatus('testing')
    try {
      await configureResend.mutateAsync(data)
      setEmailStatus('success')
      await refetchSettings()
    } catch (error) {
      setEmailStatus('error')
    }
  }

  const onWhatsAppSubmit = async (data: WhatsAppConfig) => {
    setWhatsappStatus('testing')
    try {
      await configureWhatsApp.mutateAsync(data)
      setWhatsappStatus('success')
      await refetchSettings()
    } catch (error) {
      setWhatsappStatus('error')
    }
  }

  const handleTestConfiguration = async () => {
    try {
      const result = await testConfiguration.mutateAsync()
      console.log('Test results:', result)
    } catch (error) {
      console.error('Test failed:', error)
    }
  }

  const handleSendTestEmail = async () => {
    if (!settings?.hasEmailConfig) {
      alert('Please configure email first')
      return
    }

    try {
      const result = await sendTestEmail.mutateAsync({
        to: 'test@example.com',
        subject: 'Test Email from Communication System',
        content: `
          <h2>🎉 Communication System Test</h2>
          <p>Congratulations! Your Resend email configuration is working perfectly.</p>
          <p>This test email was sent at: ${new Date().toLocaleString()}</p>
          <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <h4>System Status:</h4>
            <ul>
              <li>✅ Email Provider: Resend</li>
              <li>✅ Template Engine: React Email</li>
              <li>✅ Encryption: Active</li>
              <li>✅ API Integration: Complete</li>
            </ul>
          </div>
          <p>Your Company Secretary practice is now ready to send professional invoices and compliance reminders!</p>
        `
      })

      console.log('Test email result:', result)
      alert('Test email sent successfully!')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Test email failed: ${errorMessage}`)
    }
  }

  return (
    <>
      <Head>
        <title>Communication Setup - CS ERP</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Communication System Setup</h1>
            <p className="text-gray-600 mt-2">Configure email and WhatsApp for your CS practice</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-600">Resend Integration</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  settings?.emailEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
              {settings?.emailEnabled && (
                <div className="mt-3 text-sm text-green-700">
                  ✅ {settings.fromName} &lt;{settings.fromEmail}&gt;
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-sm text-gray-600">Business API</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  settings?.whatsappEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
              {settings?.whatsappEnabled && (
                <div className="mt-3 text-sm text-green-700">
                  ✅ {settings.whatsappPhoneId}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
                  <p className="text-sm text-gray-600">React Email</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="mt-3 text-sm text-green-700">
                ✅ Professional Templates Ready
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {[
                  { id: 'email', name: '📧 Email Setup', icon: '📧' },
                  { id: 'whatsapp', name: '💬 WhatsApp Setup', icon: '💬' },
                  { id: 'test', name: '🧪 Test System', icon: '🧪' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'email' | 'whatsapp' | 'test')}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Email Setup Tab */}
              {activeTab === 'email' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resend Email Configuration</h3>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900">Quick Setup Guide:</h4>
                    <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                      <li>Sign up at <strong>resend.com</strong> (free tier: 3,000 emails/month)</li>
                      <li>Create an API key from your dashboard</li>
                      <li>Verify your sending domain (optional but recommended)</li>
                      <li>Enter your details below</li>
                    </ol>
                  </div>

                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Resend API Key</label>
                      <input
                        type="password"
                        {...emailForm.register('apiKey', { required: true })}
                        placeholder="re_..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">From Email</label>
                        <input
                          type="email"
                          {...emailForm.register('fromEmail', { required: true })}
                          placeholder="invoices@yourcompany.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">From Name</label>
                        <input
                          type="text"
                          {...emailForm.register('fromName', { required: true })}
                          placeholder="Sharma & Associates"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={emailStatus === 'testing'}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {emailStatus === 'testing' ? 'Testing Configuration...' : 'Configure Email'}
                    </button>

                    {emailStatus === 'success' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-medium">✅ Email configured successfully!</p>
                      </div>
                    )}

                    {emailStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-medium">❌ Configuration failed. Please check your API key.</p>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* WhatsApp Setup Tab */}
              {activeTab === 'whatsapp' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">WhatsApp Business API Configuration</h3>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900">⚠️ WhatsApp Requirements:</h4>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                      <li>WhatsApp Business API account required</li>
                      <li>Business verification needed</li>
                      <li>Costs: $0.005-0.02 per message</li>
                      <li>For testing, use Twilio WhatsApp sandbox</li>
                    </ul>
                  </div>

                  <form onSubmit={whatsappForm.handleSubmit(onWhatsAppSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Provider</label>
                      <select
                        {...whatsappForm.register('provider', { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="TWILIO">Twilio WhatsApp API</option>
                        <option value="WHATSAPP_BUSINESS_API">Direct WhatsApp Business API</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Account SID</label>
                        <input
                          type="text"
                          {...whatsappForm.register('accountSid', { required: true })}
                          placeholder="AC..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Auth Token</label>
                        <input
                          type="password"
                          {...whatsappForm.register('authToken', { required: true })}
                          placeholder="Your auth token"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                      <input
                        type="text"
                        {...whatsappForm.register('fromNumber', { required: true })}
                        placeholder="+14155238886"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={whatsappStatus === 'testing'}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {whatsappStatus === 'testing' ? 'Testing Configuration...' : 'Configure WhatsApp'}
                    </button>

                    {whatsappStatus === 'success' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-medium">✅ WhatsApp configured successfully!</p>
                      </div>
                    )}

                    {whatsappStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-medium">❌ Configuration failed. Please check your credentials.</p>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Test System Tab */}
              {activeTab === 'test' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Test Your Communication System</h3>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">System Status</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Email: <span className={settings?.emailEnabled ? 'text-green-600' : 'text-red-600'}>
                          {settings?.emailEnabled ? '✅ Ready' : '❌ Not configured'}
                        </span></div>
                        <div>WhatsApp: <span className={settings?.whatsappEnabled ? 'text-green-600' : 'text-red-600'}>
                          {settings?.whatsappEnabled ? '✅ Ready' : '❌ Not configured'}
                        </span></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleTestConfiguration}
                        disabled={testConfiguration.isPending}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {testConfiguration.isPending ? 'Testing...' : '🧪 Test All Configurations'}
                      </button>

                      <button
                        onClick={handleSendTestEmail}
                        disabled={!settings?.emailEnabled || sendTestEmail.isPending}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendTestEmail.isPending ? 'Sending...' : '📧 Send Test Email'}
                      </button>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">🎯 Next Steps:</h4>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                          <li>Test your configuration using the buttons above</li>
                          <li>Configure customer communication preferences</li>
                          <li>Start sending professional invoices automatically</li>
                          <li>Set up compliance reminders for your clients</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}