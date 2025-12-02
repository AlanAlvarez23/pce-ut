import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ⚠️ Reemplaza con tus datos del panel de Supabase → Configuración → API
const supabaseUrl = 'https://gnihdcxdxoddjqrgzjlc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduaWhkY3hkeG9kZGpxcmd6amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTYwMzcsImV4cCI6MjA3NjU3MjAzN30.1O2hNiY8vgt20vAoDv03oFRMF5e1USXguJt9HFsR0r4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
