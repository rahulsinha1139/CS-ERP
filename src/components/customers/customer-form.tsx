/**
 * Customer Form Component - Create and Edit Customers
 */

import React, { useState } from 'react'
import { api } from '@/utils/api';
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Loader2, Save, X } from 'lucide-react'

// Simple toast replacement for customer notifications
const toast = {
  success: (message: string) => alert(`✅ ${message}`),
  error: (message: string) => alert(`❌ ${message}`)
}

interface CustomerFormProps {
  onCancel?: () => void
  onSuccess?: (customerId: string) => void
  initialData?: {
    id?: string
    name?: string
    email?: string
    phone?: string
    address?: string
    gstin?: string
    stateCode?: string
    creditLimit?: number
    creditDays?: number
    whatsappNumber?: string
  }
}

export default function CustomerForm({ onCancel, onSuccess, initialData }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    gstin: initialData?.gstin || '',
    stateCode: initialData?.stateCode || '',
    creditLimit: initialData?.creditLimit || 0,
    creditDays: initialData?.creditDays || 30,
    whatsappNumber: initialData?.whatsappNumber || '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Customer ID generation handled by backend

  const createCustomer = api.customer.create.useMutation({
    onSuccess: (data) => {
      toast.success('Customer created successfully!')
      onSuccess?.(data.id)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create customer')
      setIsSubmitting(false)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Customer name is required')
      return
    }

    setIsSubmitting(true)

    try {
      await createCustomer.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        gstin: formData.gstin.trim() || undefined,
        stateCode: formData.stateCode.trim() || undefined,
        creditLimit: formData.creditLimit || undefined,
        creditDays: formData.creditDays || undefined,
        whatsappNumber: formData.whatsappNumber.trim() || undefined,
      })
    } catch (error) {
      // Error handling is done in the onError callback
      console.error('Customer creation error:', error)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {initialData?.id ? 'Edit Customer' : 'Create New Customer'}
          </h2>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Customer Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter customer name"
                required
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="customer@example.com"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 9876543210"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm font-medium text-slate-700">
                WhatsApp Number
              </Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="+91 9876543210"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-slate-700">
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* GST Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gstin" className="text-sm font-medium text-slate-700">
                GSTIN
              </Label>
              <Input
                id="gstin"
                type="text"
                value={formData.gstin}
                onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                placeholder="27ABCDE1234F1Z5"
                maxLength={15}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stateCode" className="text-sm font-medium text-slate-700">
                State Code
              </Label>
              <Input
                id="stateCode"
                type="text"
                value={formData.stateCode}
                onChange={(e) => handleInputChange('stateCode', e.target.value)}
                placeholder="27"
                maxLength={2}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Credit Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creditLimit" className="text-sm font-medium text-slate-700">
                Credit Limit (₹)
              </Label>
              <Input
                id="creditLimit"
                type="number"
                value={formData.creditLimit}
                onChange={(e) => handleInputChange('creditLimit', Number(e.target.value))}
                placeholder="50000"
                min="0"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditDays" className="text-sm font-medium text-slate-700">
                Credit Days
              </Label>
              <Input
                id="creditDays"
                type="number"
                value={formData.creditDays}
                onChange={(e) => handleInputChange('creditDays', Number(e.target.value))}
                placeholder="30"
                min="0"
                max="365"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6"
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Customer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}