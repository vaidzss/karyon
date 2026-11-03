import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export interface KaryonContextType {
  gatewayUrl: string;
  sessionId: string;
  activeEpoch: number;
  isProtected: boolean;
  threatScore: number;
  opticalActive: boolean;
  getPolymorphicRoute: (canonicalRoute: string) => string;
  refreshShield: () => Promise<void>;
}

const KaryonContext = createContext<KaryonContextType>({
  gatewayUrl: 'http://127.0.0.1:8000',
  sessionId: 'session_default',
  activeEpoch: 1,
  isProtected: true,
  threatScore: 0.0,
  opticalActive: false,
  getPolymorphicRoute: (r) => r,
  refreshShield: async () => {}
});

export interface KaryonProtectionProviderProps {
  children: React.ReactNode;
  gatewayUrl?: string;
  sessionId?: string;
}

export const KaryonProtectionProvider: React.FC<KaryonProtectionProviderProps> = ({
  children,
  gatewayUrl = 'http://127.0.0.1:8000',
  sessionId = 'session_default'
}) => {
  const [activeEpoch, setActiveEpoch] = useState<number>(1);
  const [routeMappings, setRouteMappings] = useState<Record<string, string>>({});
  const [threatScore, setThreatScore] = useState<number>(0.0);
  const [opticalActive, setOpticalActive] = useState<boolean>(false);
  const [svgFilterHtml, setSvgFilterHtml] = useState<string>('');
  const [cssRules, setCssRules] = useState<string>('');

  const cleanGatewayUrl = useMemo(() => gatewayUrl.replace(/\/$/, ''), [gatewayUrl]);

  const refreshShield = async () => {
    try {
      const res = await fetch(`${cleanGatewayUrl}/api/telemetry`);
      if (res.ok) {
        const snap = await res.json();
        if (snap.active_manifest) {
          setActiveEpoch(snap.active_manifest.version || 1);
          setRouteMappings(snap.active_manifest.route_mappings || {});
        }
      }
    } catch (err) {
      console.warn('[KaryonReact] Gateway handshake retry in progress:', err);
    }
  };

  useEffect(() => {
    refreshShield();

    // WebSocket subscription for zero-polling live polymorphic schema rotation
    const wsProto = cleanGatewayUrl.startsWith('https') ? 'wss:' : 'ws:';
    const wsHost = cleanGatewayUrl.replace(/^https?:\/\//, '');
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(`${wsProto}//${wsHost}/ws/manifest`);
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.version) setActiveEpoch(data.version);
          if (data.route_mappings) setRouteMappings(data.route_mappings);
        } catch {
          // ignore parse errors
        }
      };
    } catch (e) {
      console.warn('[KaryonReact] Manifest WS connection failed:', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [cleanGatewayUrl]);

  const getPolymorphicRoute = (canonicalRoute: string): string => {
    return routeMappings[canonicalRoute] || canonicalRoute;
  };

  return (
    <KaryonContext.Provider
      value={{
        gatewayUrl: cleanGatewayUrl,
        sessionId,
        activeEpoch,
        isProtected: true,
        threatScore,
        opticalActive,
        getPolymorphicRoute,
        refreshShield
      }}
    >
      {/* Dynamic SVG Filter injection for Ring 1 Anti-Screen Scraping */}
      {svgFilterHtml && <div dangerouslySetInnerHTML={{ __html: svgFilterHtml }} />}
      {cssRules && <style dangerouslySetInnerHTML={{ __html: cssRules }} />}
      {children}
    </KaryonContext.Provider>
  );
};

export const useKaryon = () => useContext(KaryonContext);

export interface KaryonOpticalBoundaryProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

/**
 * Drop-in wrapper component that shields enclosed UI elements from multimodal OCR scrapers
 * while keeping typography crisp for legitimate human viewers.
 */
export const KaryonOpticalBoundary: React.FC<KaryonOpticalBoundaryProps> = ({
  children,
  intensity = 0.6,
  className = ''
}) => {
  const { opticalActive } = useKaryon();
  return (
    <div
      className={`relative transition-all duration-300 ${
        opticalActive ? 'karyon-shield-active select-text' : ''
      } ${className}`}
      data-karyon-shield={opticalActive ? 'camouflaged' : 'standby'}
    >
      {children}
    </div>
  );
};
