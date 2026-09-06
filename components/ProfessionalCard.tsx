import Link from 'next/link';

export default function ProfessionalCard({ profile }: { profile: any }) {
  const services = profile.profile_services
    ?.map((ps: any) => ps.services?.name)
    .filter(Boolean) || [];

  return (
    <div className="bg-sentury-offwhite rounded-lg p-6 shadow-sm border border-sentury-blue/30 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-sentury-green capitalize">
              {profile.full_name || 'Unnamed Professional'}
            </h2>
            <p className="text-sm font-medium text-sentury-green/70">
              📍 {profile.location || 'Location not set'}
            </p>
          </div>
          <span className="bg-sentury-peach text-sentury-green text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ml-2">
            {profile.experience_years || 0} Yrs Exp
          </span>
        </div>
        
        <p className="text-sentury-green/80 text-sm mb-4 line-clamp-3">
          {profile.bio || 'This professional has not added a bio yet.'}
        </p>

        {/* Render the Service Tags */}
        {services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {services.map((serviceName: string, index: number) => (
              <span key={index} className="bg-sentury-blue/30 text-sentury-green text-xs font-semibold px-2 py-1 rounded-default border border-sentury-blue/50">
                {serviceName}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <Link 
        href={`/directory/${profile.id}`}
        className="w-full bg-sentury-green text-sentury-offwhite py-2 rounded-default font-medium hover:bg-sentury-green/90 transition-colors block text-center mt-auto"
      >
        View Profile
      </Link>
    </div>
  );
}