// Fiche « flash-attention » : schéma statique des deux mémoires d'un GPU A100 (chiffres du paper FlashAttention, §2.1).
// HBM : 40 à 80 Go, 1,5 à 2,0 To/s. SRAM : 192 Ko par multiprocesseur × 108, environ 19 To/s.
import type { Etat } from '../animations/types';
import { svgDe } from '../animations/svg';

export const etats: Record<string, Etat> = { initial: { k: 0 } };

function gabarit() {
  return `
    <text x="4" y="18" class="svg-texte" font-size="12" font-weight="700">Les deux mémoires d’un GPU A100</text>
    <rect x="4" y="32" width="200" height="150" rx="6" class="svg-entree" fill-opacity="0.12" />
    <rect x="4" y="32" width="200" height="150" rx="6" fill="none" class="svg-trait-entree" stroke-width="1.5" />
    <text x="16" y="56" class="svg-texte" font-size="13" font-weight="700">HBM</text>
    <text x="16" y="78" class="svg-texte" font-size="11">40 à 80 Go</text>
    <text x="16" y="96" class="svg-texte" font-size="11">débit 1,5 à 2,0 To/s</text>
    <text x="16" y="120" class="svg-doux" font-size="10">tout le modèle, Q, K, V,</text>
    <text x="16" y="134" class="svg-doux" font-size="10">et la matrice S si on la stocke</text>
    <rect x="236" y="104" width="100" height="78" rx="6" class="svg-sortie" fill-opacity="0.16" />
    <rect x="236" y="104" width="100" height="78" rx="6" fill="none" class="svg-trait-sortie" stroke-width="1.5" />
    <text x="244" y="124" class="svg-texte" font-size="13" font-weight="700">SRAM</text>
    <text x="244" y="142" class="svg-texte" font-size="10.5">192 Ko × 108</text>
    <text x="244" y="158" class="svg-texte" font-size="10.5">≈ 19 To/s</text>
    <text x="244" y="174" class="svg-doux" font-size="9.5">sur la puce</text>
    <line x1="206" y1="143" x2="232" y2="143" class="svg-trait-doux" stroke-width="2" stroke-dasharray="3 3" />
    <text x="4" y="204" class="svg-texte" font-size="12" font-weight="700">SRAM : environ 10 fois plus rapide,</text>
    <text x="4" y="220" class="svg-texte" font-size="12" font-weight="700">mais des milliers de fois plus petite</text>
    <text x="4" y="240" class="svg-doux" font-size="10.5">FlashAttention calcule dans la SRAM, bloc par bloc,</text>
    <text x="4" y="255" class="svg-doux" font-size="10.5">et limite les allers-retours avec la HBM</text>`;
}

export function dessiner(scene: HTMLElement) {
  svgDe(scene, 340, 262, gabarit);
  scene.setAttribute('aria-label', 'Schéma : la HBM du GPU A100 fait 40 à 80 Go avec un débit de 1,5 à 2,0 To/s ; la SRAM fait 192 Ko sur chacun des 108 multiprocesseurs, avec un débit d’environ 19 To/s.');
}
