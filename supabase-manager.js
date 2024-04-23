
// set up supabase
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseUser {
  constructor(email) {
    this.email = email;
  }

  isLoaded() {
    return this.data !== undefined;
  }

  async load() {
    const { data, error } = await supabase
      .from('mhs_24_senior_assassin_users')
      .select('*')
      .eq('email', this.email)
      .maybeSingle();
    
    if (error) {
      console.error(error);
    } else {
      this.data = data;
    }
  }
}

class SupabaseElimination {
  constructor(id) {
    this.id = id;
  }

  isLoaded() {
    return this.data !== undefined;
  }

  async load() {
    const { data, error } = await supabase
      .from('mhs_24_senior_assassin_eliminations')
      .select('*')
      .eq('id', this.id)
      .maybeSingle();
    
    if (error) {
      console.error(error);
    } else {
      this.data = data;
    }
  }
}

module.exports = {
  SupabaseUser,
  SupabaseElimination,
  supabase
}