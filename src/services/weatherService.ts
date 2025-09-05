import { supabase, type WeatherData, type WeatherDataFormatted, type RSWTData, type RSWTLevelData } from '../lib/supabase';

class WeatherService {
  /**
   * Get weather data by weather ID
   */
  async getWeatherData(weatherId: string): Promise<WeatherData | null> {
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .eq('weather_id', weatherId)
      .single();

    if (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }

    return data as WeatherData;
  }

  /**
   * Get formatted weather data by weather ID
   */
  async getFormattedWeatherData(weatherId: string): Promise<WeatherDataFormatted | null> {
    const { data, error } = await supabase
      .from('weather_data_formatted')
      .select('*')
      .eq('weather_id', weatherId)
      .single();

    if (error) {
      console.error('Error fetching formatted weather data:', error);
      return null;
    }

    return data as WeatherDataFormatted;
  }

  /**
   * Get weather data by scenario name
   */
  async getWeatherDataByScenario(scenarioName: string): Promise<WeatherData[]> {
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .eq('scenario_name', scenarioName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching weather data by scenario:', error);
      return [];
    }

    return data as WeatherData[];
  }

  /**
   * Get weather data by route
   */
  async getWeatherDataByRoute(from: string, to: string): Promise<WeatherData[]> {
    const { data, error } = await supabase
      .from('weather_data')
      .select('*')
      .eq('route_from', from)
      .eq('route_to', to)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching weather data by route:', error);
      return [];
    }

    return data as WeatherData[];
  }

  /**
   * Create new weather data (admin only)
   */
  async createWeatherData(weatherData: Omit<WeatherData, 'id' | 'created_at' | 'updated_at'>): Promise<WeatherData | null> {
    const { data, error } = await supabase
      .from('weather_data')
      .insert(weatherData)
      .select()
      .single();

    if (error) {
      console.error('Error creating weather data:', error);
      return null;
    }

    return data as WeatherData;
  }

  /**
   * Update weather data (admin only)
   */
  async updateWeatherData(weatherId: string, updates: Partial<WeatherData>): Promise<WeatherData | null> {
    const { data, error } = await supabase
      .from('weather_data')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('weather_id', weatherId)
      .select()
      .single();

    if (error) {
      console.error('Error updating weather data:', error);
      return null;
    }

    return data as WeatherData;
  }

  /**
   * Delete weather data (admin only)
   */
  async deleteWeatherData(weatherId: string): Promise<boolean> {
    const { error } = await supabase
      .from('weather_data')
      .delete()
      .eq('weather_id', weatherId);

    if (error) {
      console.error('Error deleting weather data:', error);
      return false;
    }

    return true;
  }

  /**
   * Get all available weather scenarios
   */
  async getAllWeatherScenarios(): Promise<WeatherDataFormatted[]> {
    const { data, error } = await supabase
      .from('weather_data_formatted')
      .select('*')
      .order('scenario_name', { ascending: true });

    if (error) {
      console.error('Error fetching all weather scenarios:', error);
      return [];
    }

    return data as WeatherDataFormatted[];
  }

  /**
   * Convert weather data to given data format for questions
   */
  convertToGivenDataFormat(weatherData: WeatherData): Record<string, string> {
    const givenData: Record<string, string> = {};

    // Add route data
    if (weatherData.route_from && weatherData.route_to) {
      givenData['Route'] = `${weatherData.route_from} to ${weatherData.route_to}`;
    }
    if (weatherData.total_distance_nm) {
      givenData['Route Distance'] = `${weatherData.total_distance_nm} nm`;
    }

    // Add segment distances
    if (weatherData.segment_distances) {
      Object.entries(weatherData.segment_distances).forEach(([key, value]) => {
        givenData[key] = `${value} nm`;
      });
    }

    // Add other weather parameters
    if (weatherData.pressure_altitude) {
      givenData['Pressure Altitude'] = `${weatherData.pressure_altitude} ft`;
    }
    if (weatherData.visibility_nm) {
      givenData['Visibility'] = `${weatherData.visibility_nm} nm`;
    }
    if (weatherData.cloud_base_ft) {
      givenData['Cloud Base'] = `${weatherData.cloud_base_ft} ft`;
    }

    // Add RSWT extract (complete data for student interpretation)
    givenData['RSWT Extract'] = this.formatRSWTExtract(weatherData.rswt_data);

    return givenData;
  }

  /**
   * Format RSWT extract for display
   */
  formatRSWTExtract(rswtData: RSWTData): string {
    const lines = ['RSWT EXTRACT', 'FL -ISA YPDN/YBAS YBAS/LEC LEC/YMML'];
    
    Object.entries(rswtData).forEach(([fl, data]) => {
      const line = `${fl} ${data.isa_temp} ${data.ypdn_ybas} ${data.ybas_lec} ${data.lec_ymml}`;
      lines.push(line);
    });
    
    return lines.join('\n');
  }

  /**
   * Create RSWT data from raw RSWT extract
   */
  createRSWTData(rswtExtract: string): RSWTData {
    // Parse the RSWT extract format
    const lines = rswtExtract.split('\n').filter(line => line.trim() && !line.includes('RSWT EXTRACT') && !line.includes('FL -ISA'));
    
    const rswtData: Partial<RSWTData> = {};
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const fl = parts[0] as keyof RSWTData;
        const isaDev = parseInt(parts[1]);
        const ypdnYbas = parts[2];
        const ybasLec = parts[3];
        const lecYmml = parts[4];
        
        rswtData[fl] = {
          isa_temp: isaDev,
          ypdn_ybas: ypdnYbas,
          ybas_lec: ybasLec,
          lec_ymml: lecYmml
        };
      }
    });
    
    return rswtData as RSWTData;
  }
}

export const weatherService = new WeatherService();
