const { SupabaseUser, SupabaseElimination, supabase } = require('./supabase-manager');
const { sendConfirmationEmail, sendTargetEmail, sendEliminationEmail } = require('./email-manager');

async function confirmUser(email, firstName, lastName, avatarUrl) {
  // wait for supabase.auth to load
  while (!supabase.auth) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  // real code now
  const { data, error } = await supabase
    .from('mhs_24_senior_assassin_users')
    .upsert([
      { email, first_name: firstName, last_name: lastName, avatar_url: avatarUrl ?? null }
    ]);
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
  const user = new SupabaseUser(email);
  await user.load();
  sendConfirmationEmail(user);
}

module.exports = {
  confirmUser
}