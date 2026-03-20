import React, { useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Phone, Clock, Globe } from 'lucide-react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const RESTAURANT_LOCATION = { lat: -19.1167, lng: 33.4833 }; // Chimoio coordinates (approximate for WF4J+RV)

const MapContent = () => {
  return (
    <AdvancedMarker position={RESTAURANT_LOCATION} title="A Fornalha">
      <Pin background="#f59e0b" glyphColor="#000" borderColor="#000" />
    </AdvancedMarker>
  );
};

export const Location: React.FC = () => {
  const handleDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${RESTAURANT_LOCATION.lat},${RESTAURANT_LOCATION.lng}`, '_blank');
  };

  if (!hasValidKey) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="glass-card p-12 text-center">
          <MapPin className="w-16 h-16 text-gold-500 mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold mb-4">Nossa Localização</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Estamos localizados em Chimoio, Moçambique. 
            Para ver o mapa interativo, por favor configure a chave da API do Google Maps.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 text-left mb-8 max-w-md mx-auto">
            <p className="font-bold mb-2">Endereço:</p>
            <p className="text-white/70 mb-4">WF4J+RV, Chimoio, Moçambique</p>
            <button 
              onClick={handleDirections}
              className="gold-button w-full flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> Ver Direções
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                defaultCenter={RESTAURANT_LOCATION}
                defaultZoom={15}
                mapId="DEMO_MAP_ID"
                {...({ internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'] } as any)}
                style={{ width: '100%', height: '100%' }}
                disableDefaultUI={true}
              >
                <MapContent />
              </Map>
            </APIProvider>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card">
            <h2 className="text-3xl font-serif font-bold mb-6 gold-text">A Fornalha</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0 border border-gold-500/20">
                  <MapPin className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="font-bold mb-1">Endereço</p>
                  <p className="text-white/60 text-sm">WF4J+RV, Chimoio, Moçambique</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0 border border-gold-500/20">
                  <Phone className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="font-bold mb-1">Telefone</p>
                  <p className="text-white/60 text-sm">+258 86 767 4675</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0 border border-gold-500/20">
                  <Clock className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="font-bold mb-1">Horário</p>
                  <p className="text-white/60 text-sm">Seg - Dom: 09:00 - 22:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center shrink-0 border border-gold-500/20">
                  <Globe className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="font-bold mb-1">Website</p>
                  <p className="text-white/60 text-sm">www.afornalha.co.mz</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleDirections}
              className="gold-button w-full mt-8 flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> Ver Direções
            </button>
          </div>

          <div className="glass-card bg-darkred-950/20 border-darkred-900/30">
            <h3 className="text-xl font-serif font-bold mb-4">Serviços Disponíveis</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Comer no local ✔
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Take away ✔
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Entrega ✔
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
