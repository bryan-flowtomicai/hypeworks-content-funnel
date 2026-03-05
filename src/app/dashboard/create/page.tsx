'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'

export const dynamic = 'force-dynamic'

export default function CreateSubmission() {
  const [step, setStep] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    productUrl: '',
    platform: 'amazon',
    companyName: '',
    brandColors: '',
    products: '',
  })
  const [brandAssets, setBrandAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/signin')
        return
      }

      setUser(session.user)
      setSessionLoading(false)
    }

    getSession()
  }, [])

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = (e: any) => {
    const files = Array.from(e.target.files)
    setBrandAssets((prev) => [...prev, ...files])
  }

  const handleRemoveAsset = (index: number) => {
    setBrandAssets((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Create submission
      const { data: submission, error: submitError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          product_url: formData.productUrl,
          platform: formData.platform,
          product_data: {
            companyName: formData.companyName,
            brandColors: formData.brandColors,
            products: formData.products,
          },
          status: 'pending',
          brand_assets: brandAssets.map((f) => f.name),
        })
        .select()

      if (submitError) throw submitError

      // Update submission count
      await supabase
        .from('users')
        .update({ submission_count: 1 })
        .eq('id', user.id)

      router.push(`/dashboard/submission/${submission[0].id}`)
    } catch (error) {
      console.error('Error creating submission:', error)
      alert('Failed to create submission')
    } finally {
      setLoading(false)
    }
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Hypeworks</h1>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create A+ Content</h2>
        <p className="text-slate-400 mb-8">
          Step {step} of 3 - Share your product details
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded ${
                  s <= step ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-8">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-6">
                Product Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Product URL *
                </label>
                <Input
                  type="url"
                  name="productUrl"
                  value={formData.productUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.amazon.com/dp/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="amazon">Amazon</option>
                  <option value="ebay">eBay</option>
                  <option value="shopify">Shopify</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company/Brand Name *
                </label>
                <Input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-6">
                Brand Assets
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Upload Brand Assets (Logo, Images, etc.)
                </label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <p className="text-slate-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-slate-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              {brandAssets.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-2">
                    Selected Assets ({brandAssets.length})
                  </p>
                  <div className="space-y-2">
                    {brandAssets.map((asset, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-slate-700 rounded"
                      >
                        <span className="text-slate-300">{asset.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAsset(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Brand Colors (e.g., #FF5733, #33FF57)
                </label>
                <Input
                  type="text"
                  name="brandColors"
                  value={formData.brandColors}
                  onChange={handleInputChange}
                  placeholder="Enter hex colors separated by commas"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-6">
                Content Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Product Description
                </label>
                <textarea
                  name="products"
                  value={formData.products}
                  onChange={handleInputChange}
                  placeholder="Describe your product, key features, benefits..."
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> Include key selling points, target
                  audience, and unique features for better A+ content
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition ml-auto"
            >
              Next
            </button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.productUrl || !formData.companyName}
              className="ml-auto"
            >
              {loading ? 'Creating...' : 'Create A+ Content'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
