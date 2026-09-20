/**
 * Render-Einstieg für die Medien-Pipeline.
 * Die App-Komponenten sind die einzige Quelle der Grafiken – hier werden sie
 * serverseitig zu SVG-Text gerendert und anschließend zu WebP gerastert.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import type { MuscleGroup } from '../src/types';
import { AnatomyMap } from '../src/components/AnatomyMap';
import { EquipmentArt, type EquipmentVisual } from '../src/components/EquipmentArt';
import { PosedFigure, hasPose, type Phase } from '../src/components/PosedFigure';
import { initI18n } from '../src/i18n';

initI18n('de');

const withSvgHeader = (markup: string, width: number, height: number, background: string) =>
  markup
    .replace(
      '<svg ',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" `
    )
    .replace('>', `><rect width="100%" height="100%" fill="${background}"/>`);

export function renderAnatomy(
  view: 'front' | 'back',
  primary: MuscleGroup[],
  secondary: MuscleGroup[],
  title: string
): string {
  const markup = renderToStaticMarkup(
    <AnatomyMap view={view} primary={primary} secondary={secondary} palette="chart" title={title} />
  );
  return withSvgHeader(markup, 480, 1120, '#FFFFFF');
}

export function renderEquipment(visual: EquipmentVisual, title: string): string {
  const markup = renderToStaticMarkup(<EquipmentArt visual={visual} title={title} />);
  return withSvgHeader(markup, 800, 560, '#FFF7F1');
}

export function renderPose(exerciseId: string, phase: Phase, title: string): string | null {
  if (!hasPose(exerciseId, phase)) return null;
  const markup = renderToStaticMarkup(<PosedFigure exerciseId={exerciseId} phase={phase} title={title} />);
  return withSvgHeader(markup, 800, 960, '#FFFFFF');
}

export { hasPose };
