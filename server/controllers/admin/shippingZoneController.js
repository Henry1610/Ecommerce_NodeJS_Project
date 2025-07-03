import ShippingZone from '../../models/ShippingZone.js';
import { calculateShippingFee, getAllAvailableCities } from '../../utils/calculateShippingFee.js';

// Get all shipping zones
export const getShippingZones = async (req, res) => {
  try {
    const shippingZones = await ShippingZone.find().sort({ city: 1 });
    res.json(shippingZones);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shipping zones', error: error.message });
  }
};

// Get shipping zone by ID
export const getShippingZoneById = async (req, res) => {
  try {
    const shippingZone = await ShippingZone.findById(req.params.id);
    if (!shippingZone) {
      return res.status(404).json({ message: 'Shipping zone not found' });
    }
    res.json(shippingZone);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shipping zone', error: error.message });
  }
};

// Create new shipping zone
export const createShippingZone = async (req, res) => {
  try {
    const { city, fee } = req.body;
    
    if (!city || fee === undefined) {
      return res.status(400).json({ message: 'City and fee are required' });
    }

    // Check if city already exists
    const existingZone = await ShippingZone.findOne({ city });
    if (existingZone) {
      return res.status(400).json({ message: 'Shipping zone for this city already exists' });
    }

    const shippingZone = new ShippingZone({ city, fee });
    const savedZone = await shippingZone.save();
    
    res.status(201).json(savedZone);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create shipping zone', error: error.message });
  }
};

// Update shipping zone
export const updateShippingZone = async (req, res) => {
  try {
    const { city, fee } = req.body;
    
    if (!city || fee === undefined) {
      return res.status(400).json({ message: 'City and fee are required' });
    }

    // Check if city already exists in another zone
    const existingZone = await ShippingZone.findOne({ 
      city, 
      _id: { $ne: req.params.id } 
    });
    if (existingZone) {
      return res.status(400).json({ message: 'Shipping zone for this city already exists' });
    }

    const updatedZone = await ShippingZone.findByIdAndUpdate(
      req.params.id,
      { city, fee },
      { new: true }
    );

    if (!updatedZone) {
      return res.status(404).json({ message: 'Shipping zone not found' });
    }

    res.json(updatedZone);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update shipping zone', error: error.message });
  }
};

// Delete shipping zone
export const deleteShippingZone = async (req, res) => {
  try {
    const deletedZone = await ShippingZone.findByIdAndDelete(req.params.id);
    
    if (!deletedZone) {
      return res.status(404).json({ message: 'Shipping zone not found' });
    }

    res.json({ message: 'Shipping zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete shipping zone', error: error.message });
  }
};

// Calculate shipping fee for a city (for admin use)
export const calculateShippingFeeForCity = async (req, res) => {
  try {
    const { cityName } = req.params;
    
    if (!cityName) {
      return res.status(400).json({ message: 'City name is required' });
    }

    const { fee, zone } = await calculateShippingFee(cityName);
    
    res.json({
      cityName,
      shippingFee: fee,
      zone: {
        _id: zone._id,
        city: zone.city,
        fee: zone.fee
      }
    });
  } catch (error) {
    res.status(400).json({ 
      message: error.message || 'Failed to calculate shipping fee', 
      error: error.message 
    });
  }
};

// Get all available cities (for debugging)
export const getAvailableCities = async (req, res) => {
  try {
    const cities = await getAllAvailableCities();
    res.json({
      cities,
      count: cities.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get available cities', 
      error: error.message 
    });
  }
};
