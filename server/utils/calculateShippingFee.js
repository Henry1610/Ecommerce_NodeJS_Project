import ShippingZone from '../models/ShippingZone.js';

/**
 * Normalize city name for searching
 * @param {string} cityName - Name of the city
 * @returns {string} - Normalized city name
 */
const normalizeCityName = (cityName) => {
  if (!cityName) return '';
  
  // Convert to lowercase and remove accents
  return cityName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};

/**
 * Calculate shipping fee based on city name
 * @param {string} cityName - Name of the city
 * @returns {Promise<{fee: number, zone: Object|null}>} - Shipping fee and zone info
 */
export const calculateShippingFee = async (cityName) => {
  try {
    if (!cityName) {
      throw new Error('Tên thành phố không được để trống');
    }

    // First try exact match
    let zone = await ShippingZone.findOne({ city: cityName });
    
    // If not found, try case-insensitive search
    if (!zone) {
      zone = await ShippingZone.findOne({
        city: { $regex: new RegExp(`^${cityName}$`, 'i') }
      });
    }
    
    // If still not found, try normalized search
    if (!zone) {
      const normalizedCityName = normalizeCityName(cityName);
      const allZones = await ShippingZone.find();
      
      zone = allZones.find(z => {
        const normalizedZoneCity = normalizeCityName(z.city);
        return normalizedZoneCity === normalizedCityName;
      });
    }

    if (!zone) {
      // Get all available cities for better error message
      const allZones = await ShippingZone.find().select('city').sort('city');
      const availableCities = allZones.map(z => z.city).join(', ');
      
      throw new Error(
        `Không tìm thấy khu vực giao hàng cho thành phố: "${cityName}". ` +
        `Các thành phố có sẵn: ${availableCities}`
      );
    }
    
    return {
      fee: zone.fee,
      zone: zone
    };
  } catch (error) {
    console.error('Error calculating shipping fee:', error);
    throw error;
  }
};

/**
 * Get shipping zone info by city name
 * @param {string} cityName - Name of the city
 * @returns {Promise<Object|null>} - Shipping zone object or null
 */
export const getShippingZoneByCity = async (cityName) => {
  try {
    if (!cityName) return null;

    // First try exact match
    let zone = await ShippingZone.findOne({ city: cityName });
    
    // If not found, try case-insensitive search
    if (!zone) {
      zone = await ShippingZone.findOne({
        city: { $regex: new RegExp(`^${cityName}$`, 'i') }
      });
    }
    
    // If still not found, try normalized search
    if (!zone) {
      const normalizedCityName = normalizeCityName(cityName);
      const allZones = await ShippingZone.find();
      
      zone = allZones.find(z => {
        const normalizedZoneCity = normalizeCityName(z.city);
        return normalizedZoneCity === normalizedCityName;
      });
    }

    return zone;
  } catch (error) {
    console.error('Error getting shipping zone:', error);
    return null;
  }
};

/**
 * Validate if a city has shipping zone
 * @param {string} cityName - Name of the city
 * @returns {Promise<boolean>} - True if city has shipping zone
 */
export const validateShippingZone = async (cityName) => {
  try {
    const zone = await getShippingZoneByCity(cityName);
    return !!zone;
  } catch (error) {
    console.error('Error validating shipping zone:', error);
    return false;
  }
};

/**
 * Get all available cities
 * @returns {Promise<Array>} - Array of city names
 */
export const getAllAvailableCities = async () => {
  try {
    const zones = await ShippingZone.find().select('city').sort('city');
    return zones.map(zone => zone.city);
  } catch (error) {
    console.error('Error getting available cities:', error);
    return [];
  }
}; 