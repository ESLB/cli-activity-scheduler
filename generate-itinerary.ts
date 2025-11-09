#!/usr/bin/env ts-node
import { newItineraryCommand } from './src/app/console/commands/schedule/newItinerary.command';

// Parse command line arguments
const args = process.argv.slice(2);

let startTime: number | undefined;
let energy: number | undefined;

// Simple argument parsing
for (let i = 0; i < args.length; i++) {
  if (args[i] === '-t' || args[i] === '--time') {
    startTime = parseFloat(args[i + 1]);
    i++;
  } else if (args[i] === '-e' || args[i] === '--energy') {
    energy = parseFloat(args[i + 1]);
    i++;
  } else if (args[i] === '-h' || args[i] === '--help') {
    console.log(`
Generador de Itinerario

Uso: npm run itinerary [opciones]

Opciones:
  -t, --time <hora>      Hora de inicio (en formato decimal, ej: 8.5 para 8:30 AM)
  -e, --energy <puntos>  Energía disponible (número)
  -h, --help            Mostrar esta ayuda

Ejemplos:
  npm run itinerary                    # Usa hora actual
  npm run itinerary -t 8               # Inicia a las 8:00 AM
  npm run itinerary -t 8 -e 100        # Inicia a las 8 AM con 100 de energía
  npm run itinerary -t 14.5 -e 50      # Inicia a las 2:30 PM con 50 de energía

Archivos requeridos:
  - activities.md: Lista de actividades
  - blocked-times.md: (Opcional) Bloques de tiempo fijos
`);
    process.exit(0);
  }
}

// Execute the command
newItineraryCommand.handler({
  _: [],
  $0: 'generate-itinerary',
  t: startTime,
  e: energy,
});
