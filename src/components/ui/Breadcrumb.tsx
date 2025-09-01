import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Always start with Dashboard
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', path: '/dashboard' }
    ];
    
    // Route mappings
    const routeLabels: Record<string, string> = {
      'notes': 'Course Notes',
      'questions': 'Practice Questions',
      'exam': 'Trial Exam',
      'flight-plan': 'Flight Planning',
      'analytics': 'Analytics',
      'category': 'Category',
      'performance': 'Performance',
      'navigation': 'Navigation',
      'fuel_planning': 'Fuel Planning',
      'weight_balance': 'Weight & Balance',
      'weather': 'Weather',
      'emergency_procedures': 'Emergency Procedures'
    };
    
    let currentPath = '';
    
    for (const segment of pathSegments) {
      currentPath += `/${segment}`;
      
      // Skip dashboard since it's already added
      if (segment === 'dashboard') continue;
      
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        path: currentPath
      });
    }
    
    // Mark the last item as active
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isActive = true;
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-xs">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <svg 
              className="w-3 h-3 text-white/40 mx-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          
          {item.isActive ? (
            <span className="text-white font-medium">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-white/70 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;