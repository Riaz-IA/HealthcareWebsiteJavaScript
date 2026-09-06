import { createClient } from '@/lib/supabase/server';
import ProfessionalCard from '@/components/ProfessionalCard';

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string; exp?: string; service?: string }>;
}) {
  const { location, exp, service } = await searchParams;
  const supabase = await createClient();
  
  const { data: availableServices } = await supabase
    .from("services")
    .select("name, slug")
    .order("name");

  const selectQuery = service 
    ? '*, profile_services!inner(services!inner(name, slug))' 
    : '*, profile_services(services(name, slug))';

  let query = supabase
    .from('profiles')
    .select(selectQuery)
    .eq('role', 'professional')
    .eq('is_approved', true);

  if (location) query = query.ilike('location', `%${location}%`);
  if (exp) query = query.gte('experience_years', parseInt(exp));
  if (service) query = query.eq('profile_services.services.slug', service);

  const { data: professionals, error } = await query;

  if (error) console.error("Database error:", error);

  return (
    <main className="min-h-screen bg-sentury-cream p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-sentury-green mb-3">
            Find a Professional
          </h1>
          <p className="text-sentury-green/80 text-lg mb-8">
            Browse our welcoming community of vetted care providers.
          </p>

          <form method="GET" action="/" className="bg-sentury-offwhite p-4 rounded-lg shadow-sm border border-sentury-blue/30 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-bold text-sentury-green mb-1 uppercase tracking-wide">Care Service</label>
              <select 
                name="service" 
                defaultValue={service || ""} 
                className="w-full p-3 rounded-default border border-sentury-blue/50 bg-white focus:outline-sentury-green text-sentury-green"
              >
                <option value="">All Services</option>
                {availableServices?.map(s => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-sentury-green mb-1 uppercase tracking-wide">Location</label>
              <input 
                name="location" 
                type="text" 
                defaultValue={location || ""} 
                placeholder="e.g. Hull" 
                className="w-full p-3 rounded-default border border-sentury-blue/50 bg-white focus:outline-sentury-green text-sentury-green"
              />
            </div>

            <div className="w-full sm:w-40">
              <label className="block text-xs font-bold text-sentury-green mb-1 uppercase tracking-wide">Min. Exp.</label>
              <select 
                name="exp" 
                defaultValue={exp || ""} 
                className="w-full p-3 rounded-default border border-sentury-blue/50 bg-white focus:outline-sentury-green text-sentury-green"
              >
                <option value="">Any</option>
                <option value="2">2+ Years</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button type="submit" className="flex-1 sm:flex-none bg-sentury-green text-sentury-offwhite px-8 py-3 rounded-default font-bold hover:bg-sentury-green/90 transition-colors h-[50px]">
                Search
              </button>
              {(location || exp || service) && (
                <a href="/" className="text-sm font-bold text-sentury-peach hover:text-sentury-peach/80 transition-colors whitespace-nowrap">
                  Clear
                </a>
              )}
            </div>
          </form>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals && professionals.length > 0 ? (
            professionals.map((pro) => (
              <ProfessionalCard key={pro.id} profile={pro} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-sentury-offwhite rounded-lg border border-sentury-blue/30">
              <p className="text-sentury-green font-bold text-lg">No professionals found matching your criteria.</p>
              <p className="text-sentury-green/70 text-sm mt-2">Try adjusting your filters or searching a different location.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}