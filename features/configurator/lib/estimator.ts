import { ConfiguratorState, PriceBreakdown } from '../types';
import { productTypes, productSeries, colorOptions, glassOptions, meshOptions, hardwareOptions } from '../config/data';

export function calculatePrice(state: ConfiguratorState): PriceBreakdown {
  const {
    typeId,
    seriesId,
    width,
    height,
    colorId,
    glassId,
    meshId,
    hardwareId,
    unitsCount,
    installationRequired
  } = state;

  const areaSqFt = width * height;

  // Find options
  const typeObj = productTypes.find(t => t.id === typeId) || productTypes[0];
  const seriesObj = productSeries.find(s => s.id === seriesId) || productSeries[0];
  const colorObj = colorOptions.find(c => c.id === colorId) || colorOptions[0];
  const glassObj = glassOptions.find(g => g.id === glassId) || glassOptions[0];
  const meshObj = meshOptions.find(m => m.id === meshId) || meshOptions[0];
  const hardwareObj = hardwareOptions.find(h => h.id === hardwareId) || hardwareOptions[0];

  const basePricePerSqFt = typeObj.basePricePerSqFt;
  const seriesModifierPerSqFt = seriesObj.priceModifierPerSqFt;
  const glassModifierPerSqFt = glassObj.priceModifierPerSqFt;
  const meshModifierPerSqFt = meshObj.priceModifierPerSqFt;
  const colorMultiplier = colorObj.priceMultiplier;
  const hardwareModifierPerUnit = hardwareObj.priceModifierPerUnit;

  // Real-world window calculation formula:
  // Frame profiles cost is affected by color multiplier (wood finish foils are expensive).
  // Glass and mesh are independent of frame color.
  // Hardware is a flat charge per unit.
  const profileCostPerSqFt = (basePricePerSqFt + seriesModifierPerSqFt) * colorMultiplier;
  const glassCostPerSqFt = glassModifierPerSqFt;
  const meshCostPerSqFt = meshModifierPerSqFt;

  const unitPrice = Math.round(
    (profileCostPerSqFt + glassCostPerSqFt + meshCostPerSqFt) * areaSqFt + hardwareModifierPerUnit
  );

  const subtotal = unitPrice * unitsCount;

  // Installation charges (realistic: ₹60 per sq ft, minimum ₹1,500 flat per configuration)
  const installationPrice = installationRequired
    ? Math.round(Math.max(1500, areaSqFt * 60) * unitsCount)
    : 0;

  // 15% range for uncertainty in site alignment, locks, weather-stripping or custom scaffolding
  const estimatedMinTotal = subtotal + installationPrice;
  const estimatedMaxTotal = Math.round(estimatedMinTotal * 1.15);

  return {
    width,
    height,
    areaSqFt,
    basePricePerSqFt,
    seriesModifierPerSqFt,
    glassModifierPerSqFt,
    meshModifierPerSqFt,
    colorMultiplier,
    hardwareModifierPerUnit,
    unitPrice,
    subtotal,
    installationPrice,
    estimatedMinTotal,
    estimatedMaxTotal
  };
}
