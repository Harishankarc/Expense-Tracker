import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    'https://glwfeugekqbxdhdtefxy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsd2ZldWdla3FieGRoZHRlZnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzOTQyMjIsImV4cCI6MjA0Njk3MDIyMn0.qj-7oDo2qgZyRtymLABRBiZx5BzAFAIq6cxHhvlyVXA'
)