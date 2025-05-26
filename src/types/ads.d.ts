declare module '@/components/ads/AdUnit' {
  export type AdSize = 'banner' | 'sidebar' | 'native';
  
  export interface AdUnitProps {
    size: AdSize;
    className?: string;
  }
  
  const AdUnit: React.ComponentType<AdUnitProps>;
  export default AdUnit;
} 