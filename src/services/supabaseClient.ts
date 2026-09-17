import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const isCloudSyncConfigured = Boolean(supabaseUrl && supabasePublishableKey)

export const supabase = isCloudSyncConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  })
  : null
