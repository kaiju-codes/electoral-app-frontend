"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Key, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react"
import { settingsAPI } from "@/lib/api"
import type { ApiKeySettingsResponse, ApiKeyProvider } from "@/lib/types"

export default function SettingsPage() {
  const [geminiSettings, setGeminiSettings] = useState<ApiKeySettingsResponse | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const settings = await settingsAPI.getApiKey("GEMINI")
      setGeminiSettings(settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("API key cannot be empty")
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await settingsAPI.createOrUpdateApiKey({
        provider_type: "GEMINI",
        api_key: apiKey.trim(),
        is_active: true,
      })
      setSuccess("API key saved successfully")
      setApiKey("")
      await loadSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save API key")
    } finally {
      setIsSaving(false)
    }
  }

  const handleActivate = async () => {
    if (!geminiSettings?.has_key) {
      setError("No API key configured. Please save an API key first.")
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await settingsAPI.activateProvider("GEMINI")
      setSuccess("Gemini provider activated")
      await loadSettings()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate provider")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppLayout
      title="Settings"
      description="Configure your electoral roll extraction settings"
    >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-5" />
                API Key Settings
              </CardTitle>
              <CardDescription>
                Configure API keys for AI providers. Keys are encrypted and stored securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <CheckCircle2 className="size-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Gemini API Key Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="gemini-key" className="text-base font-semibold">
                        Gemini API Key
                      </Label>
                      {geminiSettings?.is_active && (
                        <Badge variant="default" className="bg-green-600">
                          Active
                        </Badge>
                      )}
                      {geminiSettings?.has_key && !geminiSettings?.is_active && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      API key for Google Gemini. Used for document extraction.
                    </p>
                  </div>
                </div>

                {!geminiSettings?.has_key && (
                  <Alert>
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                      No API key configured.{" "}
                      <a
                        href="https://aistudio.google.com/app/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                      >
                        Generate a key
                        <ExternalLink className="size-3" />
                      </a>{" "}
                      and save it here.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="gemini-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="gemini-key"
                      type="password"
                      placeholder={
                        geminiSettings?.has_key
                          ? "Enter new key to update (leave empty to keep current)"
                          : "Enter your Gemini API key"
                      }
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isSaving}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || !apiKey.trim()}
                    >
                      <Key className="size-4" />
                      {geminiSettings?.has_key ? "Update" : "Save"}
                    </Button>
                  </div>
                  {geminiSettings?.key_generation_url && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Don't have a key?</span>
                      <a
                        href={geminiSettings.key_generation_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Generate one here
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </div>

                {geminiSettings?.has_key && !geminiSettings?.is_active && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleActivate}
                      disabled={isSaving}
                    >
                      Activate Gemini Provider
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Activate this provider to use it for document extraction.
                    </p>
                  </div>
                )}

                {geminiSettings?.has_key && (
                  <div className="rounded-md bg-muted p-3 text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">
                        {geminiSettings.is_active
                          ? "Active and ready to use"
                          : "Configured but not active"}
                      </span>
                    </div>
                    {geminiSettings.masked_key && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">API Key:</span>
                        <span className="font-mono text-xs font-medium">
                          {geminiSettings.masked_key}
                        </span>
                      </div>
                    )}
                    {geminiSettings.updated_at && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last updated:</span>
                        <span className="text-muted-foreground">
                          {new Date(geminiSettings.updated_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Future Providers Section */}
              <div className="border-t pt-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Other Providers</Label>
                  <p className="text-sm text-muted-foreground">
                    Support for additional AI providers (GPT, etc.) will be available in future updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
    </AppLayout>
  )
}
