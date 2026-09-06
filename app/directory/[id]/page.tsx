import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { sendContactRequest } from './actions';
import SubmitButton from '@/components/SubmitButton';

export default async function ProfessionalProfilePage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { id } = await params;
  const { sent } = await searchParams;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, profile_services(services(name))')
    .eq('id', id)
    .single();

  if (error || !profile) notFound();

  const isSelf = user?.id === profile.id;
  const services = profile.profile_services?.map((ps: any) => ps.services?.name).filter(Boolean) || [];

  return (
    <main className="min-h-screen bg-sentury-cream p-8">
      <div className="max-w-3xl mx-auto bg-sentury-offwhite rounded-lg p-8 shadow-sm border border-sentury-blue/30">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-sentury-green capitalize mb-2">
              {profile.full_name}
            </h1>
            <p className="text-lg text-sentury-green/80 mb-4">
              📍 {profile.location || 'Location not specified'}
            </p>
            {services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {services.map((serviceName: string, i: number) => (
                  <span key={i} className="bg-sentury-blue/30 text-sentury-green text-xs font-semibold px-3 py-1 rounded-default border border-sentury-blue/50">
                    {serviceName}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="bg-sentury-peach text-sentury-green text-sm font-bold px-4 py-2 rounded-full">
            {profile.experience_years || 0} Years Experience
          </span>
        </div>

        <div className="mb-8 mt-6">
          <h2 className="text-xl font-bold text-sentury-green mb-3">About Me</h2>
          <p className="text-sentury-green/80 leading-relaxed whitespace-pre-wrap">
            {profile.bio || 'No bio provided.'}
          </p>
        </div>

        <div className="bg-sentury-blue/20 p-6 rounded-default border border-sentury-blue/50">
          <h2 className="text-xl font-bold text-sentury-green mb-4">
            Contact {profile.full_name}
          </h2>
          
          {isSelf ? (
            <div className="text-center p-6 bg-sentury-blue/10 rounded-default border border-sentury-blue/30">
              <p className="text-sentury-green/80 font-medium">
                This is how your contact form appears to parents.
              </p>
            </div>
          ) : sent ? (
            <div className="p-4 bg-green-100 text-green-800 rounded-default font-medium border border-green-200">
              ✅ Your request has been sent successfully! The professional will review it shortly.
            </div>
          ) : user ? (
            <form action={sendContactRequest} className="flex flex-col gap-4">
              <input type="hidden" name="professional_id" value={profile.id} />
              <textarea 
                name="message"
                rows={4} 
                placeholder="Hi, I am looking for support regarding..."
                className="w-full rounded-default border border-sentury-blue/50 p-3 focus:outline-sentury-green focus:ring-1 focus:ring-sentury-green bg-sentury-offwhite text-sentury-green"
                required
              ></textarea>
              <div className="w-1/2">
                <SubmitButton defaultText="Send Request" loadingText="Sending..." />
              </div>
            </form>
          ) : (
            <div className="text-center p-6 bg-sentury-offwhite rounded-default border border-sentury-blue/30">
              <p className="text-sentury-green/80 mb-4">You must be logged in to send a request.</p>
              <Link 
                href="/login" 
                className="inline-block bg-sentury-green text-sentury-offwhite px-6 py-2 rounded-default font-bold hover:bg-sentury-green/90 transition-colors"
              >
                Sign In to Contact
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}