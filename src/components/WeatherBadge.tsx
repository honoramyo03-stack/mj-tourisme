import React, { useState } from 'react';
import { Region } from '../types';
import { useApp } from '../context/AppContext';
import { getCircuitWeather } from '../utils/weatherData';
import { Sun, CloudSun, Waves, Wind, Thermometer, Info } from 'lucide-react';

interface WeatherBadgeProps {
  region: Region;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = ({
  region,
  variant = 'compact',
  className = '',
}) => {
  const { language } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);
  const weather = getCircuitWeather(region);

  const conditionText = weather.condition[language] || weather.condition.fr;
  const bestSeasonText = weather.bestSeason[language] || weather.bestSeason.fr;
  const tipText = weather.travelTip[language] || weather.travelTip.fr;

  const renderIcon = () => {
    switch (weather.icon) {
      case 'waves':
        return <Waves className="w-3.5 h-3.5 text-cyan-400" />;
      case 'cloud-sun':
        return <CloudSun className="w-3.5 h-3.5 text-amber-300" />;
      case 'wind':
        return <Wind className="w-3.5 h-3.5 text-sky-300" />;
      case 'sun':
      default:
        return <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />;
    }
  };

  if (variant === 'detailed') {
    return (
      <div
        className={`bg-stone-900/85 dark:bg-stone-900/90 backdrop-blur-md border border-amber-500/40 rounded-xl p-3 text-white shadow-lg ${className}`}
      >
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-stone-700/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              {renderIcon()}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {language === 'en'
                  ? 'Live Destination Weather'
                  : language === 'mg'
                  ? 'Toetrandro amin\'ny toerana'
                  : 'Météo en direct sur site'}
              </div>
              <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>{region}</span>
                <span className="text-amber-400 font-mono">
                  {weather.temperatureC}°C ({weather.temperatureF}°F)
                </span>
              </div>
            </div>
          </div>

          <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            {conditionText}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-stone-300">
          <div>
            <span className="text-stone-400 block">
              {language === 'en' ? 'Best Season:' : language === 'mg' ? 'Fotoana tsara indrindra:' : 'Période idéale :'}
            </span>
            <span className="font-semibold text-white">{bestSeasonText}</span>
          </div>
          <div>
            <span className="text-stone-400 block">
              {language === 'en' ? 'Conditions:' : language === 'mg' ? 'Fepetra:' : 'Conditions :'}
            </span>
            <span className="font-semibold text-white">
              {weather.humidity} hum. · {weather.windSpeed}
            </span>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-amber-300/90 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>{tipText}</span>
        </div>
      </div>
    );
  }

  // Compact variant: fits right next to the image on circuit cards
  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShowTooltip(!showTooltip);
      }}
    >
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-stone-900/80 hover:bg-stone-900/95 backdrop-blur-md border border-stone-700/60 hover:border-amber-500/60 text-white text-[11px] font-semibold shadow-md transition-all cursor-help"
        title={`${region}: ${weather.temperatureC}°C · ${conditionText}`}
      >
        {renderIcon()}
        <span className="font-bold text-amber-300">{weather.temperatureC}°C</span>
        <span className="hidden sm:inline text-[10px] text-stone-300 truncate max-w-[85px]">
          {conditionText}
        </span>
      </div>

      {/* Floating tooltip on hover/click */}
      {showTooltip && (
        <div className="absolute top-full left-0 mt-1.5 w-56 p-2.5 rounded-xl bg-stone-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl text-white text-[10px] z-50 pointer-events-none animate-in fade-in zoom-in-95">
          <div className="font-bold text-amber-400 flex items-center justify-between border-b border-stone-800 pb-1 mb-1.5">
            <span>Météo : {region}</span>
            <span>{weather.temperatureC}°C</span>
          </div>
          <div className="space-y-1 text-stone-300">
            <div>
              <strong className="text-white">Ciel :</strong> {conditionText}
            </div>
            <div>
              <strong className="text-white">Saison :</strong> {bestSeasonText}
            </div>
            <div className="text-amber-300/90 italic pt-1 border-t border-stone-800/60">
              💡 {tipText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
