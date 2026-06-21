import { ConfiguratorState, PriceBreakdown } from '../types';
import { productTypes, productSeries, colorOptions, glassOptions, meshOptions, hardwareOptions } from '../config/data';
import { businessSettings } from '@/lib/data/business';
import { formatINR } from '@/lib/utils';

export function generateWhatsAppLink(state: ConfiguratorState, price: PriceBreakdown): string {
  // Find name strings
  const typeObj = productTypes.find(t => t.id === state.typeId);
  const seriesObj = productSeries.find(s => s.id === state.seriesId);
  const colorObj = colorOptions.find(c => c.id === state.colorId);
  const glassObj = glassOptions.find(g => g.id === state.glassId);
  const meshObj = meshOptions.find(m => m.id === state.meshId);
  const hardwareObj = hardwareOptions.find(h => h.id === state.hardwareId);

  const familyName = state.family === 'upvc' ? 'uPVC' : 'Aluminium';
  const typeName = typeObj?.name || state.typeId;
  const seriesName = seriesObj?.name || state.seriesId;
  const colorName = colorObj?.name || state.colorId;
  const glassName = glassObj?.name || state.glassId;
  const meshName = meshObj?.name || state.meshId;
  const hardwareName = hardwareObj?.name || state.hardwareId;

  const minPriceFormatted = formatINR(price.estimatedMinTotal);
  const maxPriceFormatted = formatINR(price.estimatedMaxTotal);

  const messageText = `Hello! I would like to get a quote for a custom window/door:

*System Configuration:*
- System: ${familyName} Systems
- Type: ${typeName}
- Series: ${seriesName}
- Dimensions: ${state.width} ft (W) x ${state.height} ft (H)
- Color Option: ${colorName}
- Glass Option: ${glassName}
- Mesh Option: ${meshName}
- Hardware Option: ${hardwareName}
- Quantity: ${state.unitsCount} unit(s)
- Installation Needed: ${state.installationRequired ? 'Yes' : 'No'}

*Estimated Price Guide:*
- Range: ${minPriceFormatted} to ${maxPriceFormatted}
- Note: Final quote after measurement / hardware / glass confirmation.

*Client Details:*
- Client Name: ${state.customerName}
- Location: ${state.customerCity}
- Preferred Callback: ${state.preferredCallbackTime}
- Contact Phone: ${state.customerPhone}

Looking forward to hearing from you. Thanks!`;

  // Encode the message
  const encodedText = encodeURIComponent(messageText);
  
  // Strip non-digit characters from the business WhatsApp number
  const cleanPhone = businessSettings.whatsapp.replace(/\D/g, '');

  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
